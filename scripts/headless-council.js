#!/usr/bin/env node

// headless-council.js — Orchestrates a council discussion using top-level
// CLI instances with full reasoning capabilities.
//
// Supports multiple AI CLIs (Claude, Codex, or any CLI that takes a prompt
// and returns text to stdout). Each agent can use a different CLI.
//
// Usage: node scripts/headless-council.js <discussion-file.md>
//
// The discussion file must already exist with frontmatter (topic, agents,
// lenses, key questions). This script handles research, discussion rounds,
// validation, and consensus.
//
// Agent CLIs are configured via frontmatter:
//   agent_a_cli: "claude"   (default)
//   agent_b_cli: "codex"
//
// Supported CLIs: claude, codex (extensible via CLI_PROFILES)

const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

// --- Constants ---

const CONVERGENCE = {
  CONVERGING: "CONVERGING",
  PARALLEL: "PARALLEL",
  DEADLOCKED: "DEADLOCKED",
  DIVERGING: "DIVERGING",
};

const STATUS = {
  RESEARCHING: "researching",
  DISCUSSING: "discussing",
  CONSENSUS: "consensus",
  DEADLOCK: "deadlock",
  CONVERGED: "converged",
};

// --- Lens Registry ---
// Loaded from lenses.json. Each pair defines research and turn prompts for both agents.

const LENSES_PATH = path.join(__dirname, "prompts", "lenses.json");
let LENSES;
try {
  LENSES = JSON.parse(fs.readFileSync(LENSES_PATH, "utf-8"));
} catch (err) {
  console.error(`Failed to load lens registry: ${LENSES_PATH}`);
  console.error(err.code === "ENOENT" ? "File not found. Re-run install.sh." : err.message);
  process.exit(1);
}

function getLensPair(lensId) {
  const pair = LENSES.pairs.find((p) => p.id === lensId);
  if (!pair) {
    const valid = LENSES.pairs.map((p) => p.id).join(", ");
    throw new Error(`Unknown lens "${lensId}". Available: ${valid}`);
  }
  return pair;
}

function getLensDesc(lensId) {
  const pair = getLensPair(lensId);
  return {
    A: { research: pair.agent_a.research, turn: pair.agent_a.turn },
    B: { research: pair.agent_b.research, turn: pair.agent_b.turn },
  };
}

// --- CLI Profiles ---
// Each profile defines how to invoke a specific AI CLI in headless mode.
// To add a new CLI, add an entry here.

// Each profile has a `defaultModel` (used when no override is set) and a
// `buildCmd(promptFile, cwd, model)` that takes a resolved model. Override
// via `agent_a_model` / `agent_b_model` in discussion frontmatter.
const CLI_PROFILES = {
  claude: {
    name: "Claude",
    binary: "claude",
    defaultModel: "claude-opus-4-7",
    buildCmd: (promptFile, cwd, model) =>
      `cd "${cwd}" && cat "${promptFile}" | claude -p --model ${model} --effort max --output-format text --allowedTools "Read,Grep,Glob,Bash"`,
    check: () => {
      execSync("which claude", { stdio: "pipe" });
      execSync("claude --version", { stdio: "pipe" });
    },
  },
  codex: {
    name: "Codex",
    binary: "codex",
    defaultModel: "gpt-5.5",
    buildCmd: (promptFile, cwd, model) =>
      `cat "${promptFile}" | codex exec --full-auto --skip-git-repo-check -m ${model} -c model_reasoning_effort='"xhigh"' -C "${cwd}" -`,
    check: () => {
      execSync("which codex", { stdio: "pipe" });
    },
  },
};

// --- Helpers ---

function log(msg) {
  process.stderr.write(`[council] ${msg}\n`);
}

function getProfile(cliName) {
  const profile = CLI_PROFILES[cliName];
  if (!profile) {
    throw new Error(
      `Unknown CLI "${cliName}". Supported: ${Object.keys(CLI_PROFILES).join(", ")}`
    );
  }
  return profile;
}

function preflight(cliNames) {
  const results = {};
  for (const name of cliNames) {
    const profile = getProfile(name);
    try {
      profile.check();
      results[name] = true;
      log(`Preflight OK: ${profile.name} (${profile.binary})`);
    } catch {
      results[name] = false;
      log(`Preflight FAILED: ${profile.name} (${profile.binary}) not available`);
    }
  }
  return results;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error("No frontmatter found");
  const fm = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    fm[key] = val;
  }
  return fm;
}

function updateFrontmatter(content, updates) {
  return content.replace(/^---\n([\s\S]*?)\n---/, (_, fm) => {
    let updated = fm;
    for (const [key, val] of Object.entries(updates)) {
      updated = updated.replace(new RegExp(`^${key}:.*$`, "m"), `${key}: ${val}`);
    }
    return `---\n${updated}\n---`;
  });
}

function preparePromptFile(promptText, tmpDir) {
  const promptFile = path.join(
    tmpDir,
    `prompt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.txt`
  );
  fs.writeFileSync(promptFile, promptText);
  return promptFile;
}

function runAgent(promptText, cliName, tmpDir, cwd, model) {
  const profile = getProfile(cliName);
  const resolvedModel = model || profile.defaultModel;
  const promptFile = preparePromptFile(promptText, tmpDir);
  const cmd = profile.buildCmd(promptFile, cwd, resolvedModel);

  try {
    const result = execSync(cmd, {
      encoding: "utf-8",
      timeout: 300000,
      maxBuffer: 1024 * 1024 * 10,
      stdio: ["pipe", "pipe", "pipe"],
    });
    return result.trim();
  } catch (err) {
    log(`${profile.name} call failed: ${err.message}`);
    return null;
  }
}

function runAgentsParallel(agentConfigs, tmpDir, cwd) {
  return Promise.all(
    agentConfigs.map(
      ({ promptText, cliName, model }) =>
        new Promise((resolve) => {
          const profile = getProfile(cliName);
          const resolvedModel = model || profile.defaultModel;
          const promptFile = preparePromptFile(promptText, tmpDir);
          const cmd = profile.buildCmd(promptFile, cwd, resolvedModel);

          const child = spawn("sh", ["-c", cmd], {
            stdio: ["pipe", "pipe", "pipe"],
            timeout: 300000,
          });

          let stdout = "";
          let stderr = "";
          child.stdout.on("data", (d) => (stdout += d));
          child.stderr.on("data", (d) => (stderr += d));
          child.on("close", (code) => {
            if (code !== 0) {
              log(`${profile.name} exited ${code}: ${stderr.slice(0, 200)}`);
              resolve(null);
            } else {
              resolve(stdout.trim());
            }
          });
          child.on("error", (err) => {
            log(`${profile.name} spawn error: ${err.message}`);
            resolve(null);
          });
        })
    )
  );
}

function runWithRetry(promptText, validator, retryHint, cliName, tmpDir, cwd, model) {
  let result = runAgent(promptText, cliName, tmpDir, cwd, model);
  if (!validator(result)) {
    log("Output failed validation, retrying...");
    result = runAgent(promptText + "\n\n" + retryHint, cliName, tmpDir, cwd, model);
    if (!validator(result)) {
      log("Retry also failed. Using raw output.");
    }
  }
  return result;
}

// --- Validation ---

function validateResearch(output, agent) {
  if (!output) return false;
  return output.includes(`### Agent ${agent} — Independent Research | research`);
}

function validateResponse(output, round) {
  if (!output) return false;
  const hasHeading = /### Round \d+ — .+ \| response \| confidence: \d+%/.test(output);
  const hasResponseTo = output.includes("**Response to previous point:**");
  const hasNewEvidence = output.includes("**New evidence or angle:**");
  const hasPosition = output.includes("**Current position:**");
  const hasQuestion = output.includes("**Question for");
  if (!hasHeading || !hasResponseTo || !hasNewEvidence || !hasPosition || !hasQuestion)
    return false;
  if (round >= 3) {
    const convergencePattern = Object.values(CONVERGENCE).join("|");
    if (!new RegExp(`\\*\\*Convergence assessment:\\*\\*|${convergencePattern}`).test(output))
      return false;
  }
  return true;
}

function validateConsensus(output) {
  if (!output) return false;
  return (
    output.includes("## Consensus Summary") &&
    output.includes("### Decision") &&
    output.includes("### Key Contention Points") &&
    output.includes("### Unresolved Items") &&
    output.includes("### Confidence:")
  );
}

function extractConvergence(output) {
  for (const state of Object.values(CONVERGENCE)) {
    if (new RegExp(state).test(output)) return state;
  }
  return null;
}

// --- Templates ---

const PROMPTS_DIR = path.join(__dirname, "prompts");

const templateCache = {};
function loadTemplate(name) {
  if (!templateCache[name]) {
    templateCache[name] = fs.readFileSync(path.join(PROMPTS_DIR, `${name}.template`), "utf-8");
  }
  return templateCache[name];
}

function fillTemplate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

// --- Prompt builders ---

function buildResearchPrompt(topic, agent, lensDesc) {
  return fillTemplate(loadTemplate("research"), {
    topic,
    agent,
    lensDesc: lensDesc[agent].research,
  });
}

function buildTurnPrompt(agent, fileContent, round) {
  const otherAgent = agent === "A" ? "Agent B" : "Agent A";
  const convergenceInstr =
    round >= 3
      ? fillTemplate(loadTemplate("convergence"), { round: String(round) })
      : "";

  // Discussion turns don't use lens — agents argue from genuine assessment
  return fillTemplate(loadTemplate("turn"), {
    agent,
    lensDesc: "",
    fileContent,
    round: String(round),
    otherAgent,
    convergenceInstr,
  });
}

function buildConsensusPrompt(fileContent) {
  return fillTemplate(loadTemplate("consensus"), { fileContent });
}

// --- Git ---

function gitCommit(filePath, message, mode) {
  if (mode === "none") return;
  try {
    const escaped = message.replace(/'/g, "'\\''");
    execSync(`git add '${filePath}' && git commit -m '${escaped}'`, {
      cwd: path.dirname(filePath),
      stdio: "pipe",
    });
  } catch {
    // Not in a git repo or nothing to commit
  }
}

// --- Output formatting ---

function formatSummary(fileContent, fm, roundsCompleted, filePath) {
  const finalFm = parseFrontmatter(fileContent);
  const agentA = finalFm.agent_a || "Agent A";
  const agentB = finalFm.agent_b || "Agent B";
  const statusLabel = finalFm.status === STATUS.DEADLOCK ? "DEADLOCK" : "CONSENSUS";

  // Extract sections from consensus
  const decisionMatch = fileContent.match(/### Decision\n([\s\S]*?)(?=\n### )/);
  const decision = decisionMatch ? decisionMatch[1].trim() : "[No decision found]";

  const contentionMatch = fileContent.match(/### Key Contention Points\n([\s\S]*?)(?=\n### )/);
  const contentionTable = contentionMatch ? contentionMatch[1].trim() : "";

  const unresolvedMatch = fileContent.match(/### Unresolved Items[^\n]*\n([\s\S]*?)(?=\n### )/);
  const unresolved = unresolvedMatch ? unresolvedMatch[1].trim() : "";

  const confidenceMatch = fileContent.match(/### Confidence: (.+)\n(.*)/);
  const confidence = confidenceMatch ? confidenceMatch[1].trim() : "Unknown";
  const confidenceReason = confidenceMatch ? confidenceMatch[2].trim() : "";

  const lines = [];

  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push(`  COUNCIL ${statusLabel}  —  ${agentA} vs ${agentB}  —  ${roundsCompleted} rounds`);
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("");

  lines.push("## Decision");
  lines.push("");
  lines.push(decision);
  lines.push("");

  if (contentionTable) {
    lines.push("## Key Disagreements");
    lines.push("");
    lines.push(contentionTable);
    lines.push("");
  }

  if (unresolved) {
    lines.push("## Unresolved");
    lines.push("");
    lines.push(unresolved);
    lines.push("");
  }

  lines.push(`## Confidence: ${confidence}`);
  if (confidenceReason) {
    lines.push(confidenceReason);
  }
  lines.push("");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push(`Full discussion: ${filePath}`);
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  return lines.join("\n");
}

// --- Main ---

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: node scripts/headless-council.js <discussion-file.md>");
    console.error("");
    console.error("Configure via frontmatter:");
    console.error('  agent_a_cli: "claude"   (default)');
    console.error('  agent_b_cli: "codex"');
    console.error(`  lens_id: "${LENSES.default}"   (default)`);
    console.error("");
    console.error(`Supported CLIs: ${Object.keys(CLI_PROFILES).join(", ")}`);
    console.error(`Available lenses: ${LENSES.pairs.map((p) => p.id).join(", ")}`);
    process.exit(1);
  }

  const absPath = path.resolve(filePath);

  let content;
  try {
    content = fs.readFileSync(absPath, "utf-8");
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(`File not found: ${absPath}`);
      process.exit(1);
    }
    throw err;
  }

  let fm = parseFrontmatter(content);

  // Resolve CLI for each agent (default: claude)
  const cliA = fm.agent_a_cli || "claude";
  const cliB = fm.agent_b_cli || "claude";

  // Resolve model for each agent (default: profile.defaultModel).
  // Override by setting agent_a_model / agent_b_model in frontmatter.
  const modelA = fm.agent_a_model || getProfile(cliA).defaultModel;
  const modelB = fm.agent_b_model || getProfile(cliB).defaultModel;

  log(`Agent A: ${getProfile(cliA).name} (${cliA}) — model: ${modelA}${fm.agent_a_model ? " (pinned)" : " (default)"}`);
  log(`Agent B: ${getProfile(cliB).name} (${cliB}) — model: ${modelB}${fm.agent_b_model ? " (pinned)" : " (default)"}`);

  // Persist resolved models into frontmatter so the discussion file is
  // self-documenting about which models actually ran (matters for evals).
  if (!fm.agent_a_model || !fm.agent_b_model) {
    content = updateFrontmatter(content, {
      agent_a_model: modelA,
      agent_b_model: modelB,
    });
    fs.writeFileSync(absPath, content);
    fm = parseFrontmatter(content);
  }

  // Preflight — check all required CLIs
  const uniqueClis = [...new Set([cliA, cliB])];
  const preflightResults = preflight(uniqueClis);
  const allPassed = uniqueClis.every((cli) => preflightResults[cli]);

  if (!allPassed) {
    const failed = uniqueClis.filter((cli) => !preflightResults[cli]);
    console.error(
      `FALLBACK: CLI(s) not available: ${failed.join(", ")}. Use subagent mode instead.`
    );
    process.exit(2);
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "discuss-council-"));
  log(`Temp directory: ${tmpDir}`);

  const agentCli = { A: cliA, B: cliB };
  const agentModel = { A: modelA, B: modelB };
  const cwd = path.dirname(absPath);

  try {
    const topic = fm.topic;
    const maxRounds = parseInt(fm.max_rounds || "7", 10);
    const gitMode = fm.git_commit || "final_only";

    // Resolve lens pair
    const lensId = fm.lens_id || LENSES.default;
    const lensDesc = getLensDesc(lensId);
    log(`Topic: ${topic}`);
    log(`Lens: ${lensId}`);
    log(`Max rounds: ${maxRounds}, Git: ${gitMode}`);

    // Phase 1: Blind Research
    if (fm.status === STATUS.RESEARCHING) {
      log("Phase 1: Blind research (parallel)...");

      const promptA = buildResearchPrompt(topic, "A", lensDesc);
      const promptB = buildResearchPrompt(topic, "B", lensDesc);

      const [resultA, resultB] = await runAgentsParallel(
        [
          { promptText: promptA, cliName: cliA, model: modelA },
          { promptText: promptB, cliName: cliB, model: modelB },
        ],
        tmpDir,
        cwd
      );

      if (!validateResearch(resultA, "A")) log("WARNING: Agent A research failed validation");
      if (!validateResearch(resultB, "B")) log("WARNING: Agent B research failed validation");

      content = fs.readFileSync(absPath, "utf-8");
      content += `\n## Research Phase\n\n${resultA || "[Agent A research failed]"}\n\n${resultB || "[Agent B research failed]"}\n\n---\n\n## Discussion\n`;
      content = updateFrontmatter(content, {
        status: STATUS.DISCUSSING,
        turn: "A",
        round: "1",
        last_updated: new Date().toISOString(),
      });
      fs.writeFileSync(absPath, content);

      gitCommit(absPath, "discuss: initial research complete", gitMode === "every_turn" ? "every_turn" : "none");
      log("Research phase complete.");
    }

    // Phase 2: Discussion Rounds
    content = fs.readFileSync(absPath, "utf-8");
    fm = parseFrontmatter(content);
    let round = parseInt(fm.round || "1", 10);
    let status = fm.status;

    while (status === STATUS.DISCUSSING && round <= maxRounds) {
      for (const agent of ["A", "B"]) {
        const cli = agentCli[agent];
        log(`Round ${round} — Agent ${agent} (${getProfile(cli).name})...`);

        content = fs.readFileSync(absPath, "utf-8");
        const prompt = buildTurnPrompt(agent, content, round);

        const result = runWithRetry(
          prompt,
          (r) => validateResponse(r, round),
          "IMPORTANT: Your previous response was malformed. Follow the EXACT format specified above. Every section is required.",
          cli,
          tmpDir,
          cwd,
          agentModel[agent]
        );

        // Append
        content = fs.readFileSync(absPath, "utf-8");
        const nextAgent = agent === "A" ? "B" : "A";
        const nextRound = agent === "B" ? round + 1 : round;
        content += `\n${result || `[Agent ${agent} Round ${round} failed]`}\n`;
        content = updateFrontmatter(content, {
          turn: nextAgent,
          round: String(nextRound),
          last_updated: new Date().toISOString(),
        });
        fs.writeFileSync(absPath, content);

        if (gitMode === "every_turn") {
          gitCommit(absPath, `discuss: round ${round} — Agent ${agent} response`, "every_turn");
        }

        // Convergence check (round 3+)
        if (round >= 3 && result) {
          const conv = extractConvergence(result);
          if (conv === CONVERGENCE.DEADLOCKED) {
            log("DEADLOCKED — moving to consensus.");
            status = STATUS.DEADLOCK;
            break;
          }
          if ((conv === CONVERGENCE.CONVERGING || conv === CONVERGENCE.PARALLEL) && agent === "B") {
            log(`${conv} — both agents aligned, moving to consensus.`);
            status = STATUS.CONVERGED;
            break;
          }
        }
      }

      if (status !== STATUS.DISCUSSING) break;

      round++;
      if (round > maxRounds) {
        log(`Max rounds (${maxRounds}) exceeded — forcing consensus.`);
        break;
      }
    }

    // Phase 3: Consensus
    if (status !== STATUS.CONSENSUS) {
      log("Phase 3: Writing consensus...");
      content = fs.readFileSync(absPath, "utf-8");

      const consensus = runWithRetry(
        buildConsensusPrompt(content),
        validateConsensus,
        "IMPORTANT: Follow the EXACT format. Include Decision, Key Contention Points table, Unresolved Items & Risks, and Confidence.",
        cliA,
        tmpDir,
        cwd,
        modelA
      );

      content = fs.readFileSync(absPath, "utf-8");
      content += `\n${consensus || "[Consensus generation failed — manual synthesis needed]"}\n`;
      const finalStatus = status === STATUS.DEADLOCK ? STATUS.DEADLOCK : STATUS.CONSENSUS;
      content = updateFrontmatter(content, {
        status: finalStatus,
        last_updated: new Date().toISOString(),
      });
      fs.writeFileSync(absPath, content);
    }

    // Final git commit
    const finalFm = parseFrontmatter(fs.readFileSync(absPath, "utf-8"));
    gitCommit(absPath, `discuss: ${finalFm.status} reached`, gitMode !== "none" ? "every_turn" : "none");

    log(`Discussion complete. Status: ${finalFm.status}`);
    log(`File: ${absPath}`);

    // Print formatted summary to stdout
    const finalContent = fs.readFileSync(absPath, "utf-8");
    console.log(formatSummary(finalContent, fm, round, absPath));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    log("Temp directory cleaned up.");
  }
}

main().catch((err) => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
