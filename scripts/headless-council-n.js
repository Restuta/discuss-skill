#!/usr/bin/env node

// headless-council-n.js — N-agent council orchestrator
//
// Extends headless-council.js to support 2-5 agents with distinct roles.
// Backward compatible with 2-agent frontmatter (agent_a/agent_b).
//
// Usage: node scripts/headless-council-n.js <discussion-file.md>
//
// N-agent frontmatter format:
//   agent_count: 3
//   agent_config: "3-agent"     (references roles.json configurations)
//   agent_cli: "codex"          (all agents use this CLI, or per-agent below)
//   agent_A_cli: "claude"       (override CLI for specific agent)
//   agent_B_cli: "codex"
//
// Falls back to 2-agent mode if agent_count is absent.

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

// --- Registries ---

const PROMPTS_DIR = path.join(__dirname, "prompts");
const LENSES_PATH = path.join(PROMPTS_DIR, "lenses.json");
const ROLES_PATH = path.join(PROMPTS_DIR, "roles.json");

let LENSES, ROLES;
try {
  LENSES = JSON.parse(fs.readFileSync(LENSES_PATH, "utf-8"));
} catch (err) {
  console.error(`Failed to load lens registry: ${LENSES_PATH}`);
  process.exit(1);
}
try {
  ROLES = JSON.parse(fs.readFileSync(ROLES_PATH, "utf-8"));
} catch (err) {
  console.error(`Failed to load roles registry: ${ROLES_PATH}`);
  process.exit(1);
}

// --- CLI Profiles ---

const CLI_PROFILES = {
  claude: {
    name: "Claude",
    binary: "claude",
    buildCmd: (promptFile, cwd) =>
      `cd "${cwd}" && cat "${promptFile}" | claude -p --effort max --output-format text --allowedTools "Read,Grep,Glob,Bash"`,
    check: () => {
      execSync("which claude", { stdio: "pipe" });
      execSync("claude --version", { stdio: "pipe" });
    },
  },
  codex: {
    name: "Codex",
    binary: "codex",
    buildCmd: (promptFile, cwd) =>
      `cat "${promptFile}" | codex exec --full-auto --skip-git-repo-check -C "${cwd}" -`,
    check: () => {
      execSync("which codex", { stdio: "pipe" });
    },
  },
};

// --- Helpers ---

function log(msg) {
  process.stderr.write(`[council-n] ${msg}\n`);
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
  for (const name of [...new Set(cliNames)]) {
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
      const re = new RegExp(`^${key}:.*$`, "m");
      if (re.test(updated)) {
        updated = updated.replace(re, `${key}: ${val}`);
      } else {
        updated += `\n${key}: ${val}`;
      }
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

function runAgent(promptText, cliName, tmpDir, cwd) {
  const profile = getProfile(cliName);
  const promptFile = preparePromptFile(promptText, tmpDir);
  const cmd = profile.buildCmd(promptFile, cwd);

  try {
    const result = execSync(cmd, {
      encoding: "utf-8",
      timeout: 600000,
      maxBuffer: 1024 * 1024 * 50,
      stdio: ["pipe", "pipe", "pipe"],
    });
    return result.trim();
  } catch (err) {
    log(`${profile.name} call failed: ${(err.message || "").slice(0, 200)}`);
    return null;
  }
}

function runAgentsParallel(agentConfigs, tmpDir, cwd) {
  return Promise.all(
    agentConfigs.map(
      ({ promptText, cliName, label }) =>
        new Promise((resolve) => {
          const profile = getProfile(cliName);
          const promptFile = preparePromptFile(promptText, tmpDir);
          const cmd = profile.buildCmd(promptFile, cwd);

          const child = spawn("sh", ["-c", cmd], {
            stdio: ["pipe", "pipe", "pipe"],
          });

          let stdout = "";
          let stderr = "";
          child.stdout.on("data", (d) => (stdout += d));
          child.stderr.on("data", (d) => (stderr += d));

          const timeout = setTimeout(() => {
            child.kill("SIGTERM");
            log(`${label || profile.name} timed out after 10min`);
            resolve(null);
          }, 600000);

          child.on("close", (code) => {
            clearTimeout(timeout);
            if (code !== 0) {
              log(`${label || profile.name} exited ${code}: ${stderr.slice(0, 200)}`);
              resolve(null);
            } else {
              resolve(stdout.trim());
            }
          });
          child.on("error", (err) => {
            clearTimeout(timeout);
            log(`${label || profile.name} spawn error: ${err.message}`);
            resolve(null);
          });
        })
    )
  );
}

function runWithRetry(promptText, validator, retryHint, cliName, tmpDir, cwd) {
  let result = runAgent(promptText, cliName, tmpDir, cwd);
  if (!validator(result)) {
    log("Output failed validation, retrying...");
    result = runAgent(promptText + "\n\n" + retryHint, cliName, tmpDir, cwd);
    if (!validator(result)) {
      log("Retry also failed. Using raw output.");
    }
  }
  return result;
}

// --- Agent Config Resolution ---

function resolveAgents(fm) {
  const agentCount = parseInt(fm.agent_count || "2", 10);
  const configName = fm.agent_config || `${agentCount}-agent`;
  const defaultCli = fm.agent_cli || "codex";

  const labels = ROLES.agent_labels;
  const config = ROLES.configurations[configName];

  if (!config) {
    // Fallback to 2-agent legacy mode
    log(`No config "${configName}" found, using legacy 2-agent mode`);
    return [
      {
        label: "A",
        name: fm.agent_a || "Agent A",
        cli: fm.agent_a_cli || defaultCli,
        roleId: "advocate",
        role: ROLES.roles.advocate,
      },
      {
        label: "B",
        name: fm.agent_b || "Agent B",
        cli: fm.agent_b_cli || defaultCli,
        roleId: "skeptic",
        role: ROLES.roles.skeptic,
      },
    ];
  }

  return config.agents.map((roleId, i) => {
    const label = labels[i];
    const role = ROLES.roles[roleId];
    if (!role) throw new Error(`Unknown role "${roleId}" in config "${configName}"`);

    const cliKey = `agent_${label}_cli`;
    const cli = fm[cliKey] || fm[`agent_${label.toLowerCase()}_cli`] || defaultCli;

    return {
      label,
      name: role.name,
      cli,
      roleId,
      role,
    };
  });
}

// --- Validation ---

function validateResearch(output, agent) {
  if (!output) return false;
  return output.includes(`### Agent ${agent.label}`) && output.includes("Independent Research | research");
}

function validateResponse(output, round) {
  if (!output) return false;
  const hasHeading = /### Round \d+ — .+ \| response \| confidence: \d+%/.test(output);
  const hasResponseTo = /\*\*Response to previous point/.test(output);
  const hasNewEvidence = output.includes("**New evidence or angle:**");
  const hasPosition = output.includes("**Current position:**");
  const hasQuestion = /\*\*.*question/i.test(output);
  if (!hasHeading || !hasResponseTo || !hasNewEvidence || !hasPosition || !hasQuestion)
    return false;
  if (round >= 3) {
    const convergencePattern = Object.values(CONVERGENCE).join("|");
    if (!new RegExp(`Convergence assessment|${convergencePattern}`).test(output))
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

function buildResearchPrompt(topic, agent) {
  return fillTemplate(loadTemplate("n-agent-research"), {
    topic,
    agent: agent.label,
    agentName: agent.name,
    roleName: agent.role.name,
    lensDesc: agent.role.research_lens,
  });
}

function buildTurnPrompt(agent, agents, fileContent, round) {
  const otherAgents = agents
    .filter((a) => a.label !== agent.label)
    .map((a) => `${a.name} (Agent ${a.label})`)
    .join(", ");

  const convergenceInstr =
    round >= 3
      ? fillTemplate(loadTemplate("convergence"), { round: String(round) })
      : "";

  return fillTemplate(loadTemplate("n-agent-turn"), {
    agent: agent.label,
    agentName: agent.name,
    agentCount: String(agents.filter((a) => !a.role.skip_research).length),
    roleName: agent.role.name,
    roleMandate: agent.role.discussion_mandate,
    fileContent,
    round: String(round),
    otherAgents,
    convergenceInstr,
  });
}

function buildConsensusPrompt(fileContent, agents) {
  const synthesizer = agents.find((a) => a.roleId === "synthesizer");
  if (synthesizer) {
    return fillTemplate(loadTemplate("synthesizer-consensus"), { fileContent });
  }
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

function formatSummary(fileContent, agents, roundsCompleted, filePath) {
  const fm = parseFrontmatter(fileContent);
  const agentNames = agents.map((a) => a.name).join(" vs ");
  const statusLabel = fm.status === STATUS.DEADLOCK ? "DEADLOCK" : "CONSENSUS";

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
  lines.push(`  COUNCIL ${statusLabel}  —  ${agentNames}  —  ${roundsCompleted} rounds  —  ${agents.length} agents`);
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
  if (confidenceReason) lines.push(confidenceReason);
  lines.push("");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push(`Full discussion: ${filePath}`);
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  return lines.join("\n");
}

// --- Discussion file creation ---

function createDiscussionFile(topic, agents, config, outputPath, extraFm) {
  const fm = {
    topic,
    mode: "council",
    agent_count: String(agents.length),
    agent_config: config,
    ...(extraFm || {}),
    status: "researching",
    turn: "A",
    round: "0",
    created: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  };

  // Add per-agent frontmatter
  agents.forEach((a) => {
    fm[`agent_${a.label}_name`] = a.name;
    fm[`agent_${a.label}_cli`] = a.cli;
    fm[`agent_${a.label}_role`] = a.roleId;
  });

  const lines = ["---"];
  for (const [k, v] of Object.entries(fm)) {
    lines.push(`${k}: "${v}"`);
  }
  lines.push("---");
  lines.push("");
  lines.push(`# Discussion: ${topic}`);
  lines.push("");
  lines.push("## Participants");
  agents.forEach((a) => {
    lines.push(`- **Agent ${a.label}** — ${a.name} (${a.roleId}) via ${a.cli}`);
  });
  lines.push("");
  lines.push("## Key Questions");
  lines.push("1. [To be addressed through structured debate]");
  lines.push("");

  fs.writeFileSync(outputPath, lines.join("\n"));
  return outputPath;
}

// --- Main Orchestration ---

async function runCouncil(filePath) {
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
  const agents = resolveAgents(fm);
  const debatingAgents = agents.filter((a) => !a.role.skip_research);
  const synthesizer = agents.find((a) => a.roleId === "synthesizer");

  log(`Agents (${agents.length}):`);
  agents.forEach((a) => log(`  ${a.label}: ${a.name} (${a.roleId}) via ${getProfile(a.cli).name}`));

  // Preflight
  const cliNames = agents.map((a) => a.cli);
  const preflightResults = preflight(cliNames);
  const allPassed = [...new Set(cliNames)].every((cli) => preflightResults[cli]);

  if (!allPassed) {
    const failed = [...new Set(cliNames)].filter((cli) => !preflightResults[cli]);
    console.error(`FALLBACK: CLI(s) not available: ${failed.join(", ")}`);
    process.exit(2);
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "discuss-council-n-"));
  log(`Temp directory: ${tmpDir}`);

  const cwd = path.dirname(absPath);

  try {
    const topic = fm.topic;
    const maxRounds = parseInt(fm.max_rounds || "5", 10);
    const gitMode = fm.git_commit || "none";

    log(`Topic: ${topic}`);
    log(`Max rounds: ${maxRounds}, Git: ${gitMode}`);

    // Phase 1: Blind Research (parallel, skip synthesizer)
    if (fm.status === STATUS.RESEARCHING) {
      log(`Phase 1: Blind research (${debatingAgents.length} agents in parallel)...`);

      const researchConfigs = debatingAgents.map((agent) => ({
        promptText: buildResearchPrompt(topic, agent),
        cliName: agent.cli,
        label: `${agent.name} (${agent.label})`,
      }));

      const results = await runAgentsParallel(researchConfigs, tmpDir, cwd);

      // Validate
      debatingAgents.forEach((agent, i) => {
        if (!validateResearch(results[i], agent)) {
          log(`WARNING: ${agent.name} (${agent.label}) research failed validation`);
        }
      });

      // Append research sections
      content = fs.readFileSync(absPath, "utf-8");
      let researchText = "\n## Research Phase\n\n";
      debatingAgents.forEach((agent, i) => {
        researchText += `${results[i] || `[${agent.name} (Agent ${agent.label}) research failed]`}\n\n`;
      });
      researchText += "---\n\n## Discussion\n";

      content += researchText;
      content = updateFrontmatter(content, {
        status: STATUS.DISCUSSING,
        turn: debatingAgents[0].label,
        round: "1",
        last_updated: new Date().toISOString(),
      });
      fs.writeFileSync(absPath, content);

      if (gitMode === "every_turn") {
        gitCommit(absPath, "discuss: initial research complete", "every_turn");
      }
      log("Research phase complete.");
    }

    // Phase 2: Discussion Rounds (round-robin among debating agents)
    content = fs.readFileSync(absPath, "utf-8");
    fm = parseFrontmatter(content);
    let round = parseInt(fm.round || "1", 10);
    let status = fm.status;
    let convergenceCount = 0;

    while (status === STATUS.DISCUSSING && round <= maxRounds) {
      for (let i = 0; i < debatingAgents.length; i++) {
        const agent = debatingAgents[i];
        const cli = agent.cli;
        log(`Round ${round} — ${agent.name} (Agent ${agent.label}, ${getProfile(cli).name})...`);

        content = fs.readFileSync(absPath, "utf-8");
        const prompt = buildTurnPrompt(agent, debatingAgents, content, round);

        const result = runWithRetry(
          prompt,
          (r) => validateResponse(r, round),
          "IMPORTANT: Your previous response was malformed. Follow the EXACT format specified above. Every section is required.",
          cli,
          tmpDir,
          cwd
        );

        // Determine next turn
        const isLastInRound = i === debatingAgents.length - 1;
        const nextAgent = isLastInRound ? debatingAgents[0] : debatingAgents[i + 1];
        const nextRound = isLastInRound ? round + 1 : round;

        // Append
        content = fs.readFileSync(absPath, "utf-8");
        content += `\n${result || `[${agent.name} (Agent ${agent.label}) Round ${round} failed]`}\n`;
        content = updateFrontmatter(content, {
          turn: nextAgent.label,
          round: String(nextRound),
          last_updated: new Date().toISOString(),
        });
        fs.writeFileSync(absPath, content);

        if (gitMode === "every_turn") {
          gitCommit(absPath, `discuss: round ${round} — ${agent.name} response`, "every_turn");
        }

        // Convergence check (round 3+)
        if (round >= 3 && result) {
          const conv = extractConvergence(result);
          if (conv === CONVERGENCE.DEADLOCKED) {
            log("DEADLOCKED — moving to consensus.");
            status = STATUS.DEADLOCK;
            break;
          }
          if (conv === CONVERGENCE.CONVERGING || conv === CONVERGENCE.PARALLEL) {
            convergenceCount++;
            // Need majority of agents to agree on convergence
            const threshold = Math.ceil(debatingAgents.length / 2);
            if (convergenceCount >= threshold) {
              log(`${conv} — ${convergenceCount}/${debatingAgents.length} agents converged, moving to consensus.`);
              status = STATUS.CONVERGED;
              break;
            }
          }
        }
      }

      // Reset convergence count at end of round if not converged
      if (status === STATUS.DISCUSSING) {
        convergenceCount = 0;
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

      // Use synthesizer if available, otherwise first agent
      const consensusCli = synthesizer ? synthesizer.cli : debatingAgents[0].cli;
      const consensusLabel = synthesizer ? `Synthesizer (${getProfile(consensusCli).name})` : getProfile(consensusCli).name;
      log(`Consensus writer: ${consensusLabel}`);

      const consensus = runWithRetry(
        buildConsensusPrompt(content, agents),
        validateConsensus,
        "IMPORTANT: Follow the EXACT format. Include Decision, Key Contention Points table, Unresolved Items & Risks, and Confidence.",
        consensusCli,
        tmpDir,
        cwd
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
    console.log(formatSummary(finalContent, agents, round, absPath));

    return { filePath: absPath, status: finalFm.status, rounds: round, agents: agents.length };
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    log("Temp directory cleaned up.");
  }
}

// --- Exports (for eval runner) ---
module.exports = { runCouncil, createDiscussionFile, resolveAgents, parseFrontmatter, ROLES, CLI_PROFILES };

// --- CLI entry ---
if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: node scripts/headless-council-n.js <discussion-file.md>");
    console.error("");
    console.error("N-agent frontmatter fields:");
    console.error('  agent_count: "3"');
    console.error('  agent_config: "3-agent"');
    console.error('  agent_cli: "codex"          (default CLI for all agents)');
    console.error('  agent_A_cli: "claude"        (override per agent)');
    console.error("");
    console.error(`Available configs: ${Object.keys(ROLES.configurations).join(", ")}`);
    console.error(`Available roles: ${Object.keys(ROLES.roles).join(", ")}`);
    console.error(`Supported CLIs: ${Object.keys(CLI_PROFILES).join(", ")}`);
    process.exit(1);
  }

  runCouncil(filePath).catch((err) => {
    console.error(`Fatal: ${err.message}`);
    process.exit(1);
  });
}
