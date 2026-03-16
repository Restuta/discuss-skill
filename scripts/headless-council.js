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

// --- CLI Profiles ---
// Each profile defines how to invoke a specific AI CLI in headless mode.
// To add a new CLI, add an entry here.

const CLI_PROFILES = {
  claude: {
    name: "Claude",
    binary: "claude",
    buildCmd: (promptFile) =>
      `cat "${promptFile}" | claude -p --effort high --output-format text --allowedTools "Read,Grep,Glob,Bash"`,
    check: () => {
      execSync("which claude", { stdio: "pipe" });
      execSync("claude --version", { stdio: "pipe" });
    },
  },
  codex: {
    name: "Codex",
    binary: "codex",
    buildCmd: (promptFile) =>
      `cat "${promptFile}" | codex exec --full-auto -`,
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
  return content.replace(/^---\n([\s\S]*?)\n---/, (match, fm) => {
    let updated = fm;
    for (const [key, val] of Object.entries(updates)) {
      const regex = new RegExp(`^${key}:.*$`, "m");
      if (regex.test(updated)) {
        updated = updated.replace(regex, `${key}: ${val}`);
      }
    }
    return `---\n${updated}\n---`;
  });
}

function runAgent(promptText, cliName, tmpDir) {
  const profile = getProfile(cliName);
  const promptFile = path.join(
    tmpDir,
    `prompt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.txt`
  );
  fs.writeFileSync(promptFile, promptText);

  const cmd = profile.buildCmd(promptFile);

  try {
    const result = execSync(cmd, {
      encoding: "utf-8",
      timeout: 300000, // 5 min per call
      maxBuffer: 1024 * 1024 * 10,
      stdio: ["pipe", "pipe", "pipe"],
    });
    return result.trim();
  } catch (err) {
    log(`${profile.name} call failed: ${err.message}`);
    return null;
  }
}

function runAgentsParallel(agentConfigs, tmpDir) {
  return Promise.all(
    agentConfigs.map(
      ({ promptText, cliName }) =>
        new Promise((resolve) => {
          const profile = getProfile(cliName);
          const promptFile = path.join(
            tmpDir,
            `prompt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.txt`
          );
          fs.writeFileSync(promptFile, promptText);

          const cmd = profile.buildCmd(promptFile);
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

// --- Validation ---

function validateResearch(output, agent) {
  if (!output) return false;
  const heading = `### Agent ${agent} — Independent Research | research`;
  return output.includes(heading);
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
    const hasConvergence =
      /\*\*Convergence assessment:\*\*|CONVERGING|PARALLEL|DIVERGING|DEADLOCKED/.test(output);
    if (!hasConvergence) return false;
  }
  return true;
}

function validateConsensus(output) {
  if (!output) return false;
  return (
    output.includes("## Consensus Summary") &&
    output.includes("### Decision") &&
    output.includes("### Key Contention Points") &&
    output.includes("### Confidence:")
  );
}

function extractConvergence(output) {
  if (/CONVERGING/.test(output)) return "CONVERGING";
  if (/PARALLEL/.test(output)) return "PARALLEL";
  if (/DEADLOCKED/.test(output)) return "DEADLOCKED";
  if (/DIVERGING/.test(output)) return "DIVERGING";
  return null;
}

// --- Prompt builders ---

function buildResearchPrompt(topic, agent, lens) {
  const lensDesc =
    agent === "A"
      ? "Focus on RISKS, COSTS, FAILURE MODES, edge cases, and what could go wrong. Be the skeptic."
      : "Focus on BENEFITS, OPPORTUNITIES, SUCCESS CASES, and what could go right. Be the advocate.";

  return `You are Agent ${agent} in a structured discussion about: "${topic}"

Your analytical lens: ${lensDesc}

Research this topic independently. Do NOT try to anticipate what another agent might say. You have access to tools for reading files and running commands — use them if the topic involves a specific codebase or requires inspecting local files.

Return ONLY this formatted output, nothing else:

### Agent ${agent} — Independent Research | research

[Your analysis. Be specific, cite evidence, name uncertainties. ~200 words.]`;
}

function buildTurnPrompt(topic, agent, lens, fileContent, round) {
  const lensDesc =
    agent === "A"
      ? "RISKS, COSTS, FAILURE MODES. Be the skeptic."
      : "BENEFITS, OPPORTUNITIES, SUCCESS CASES. Be the advocate.";

  const otherAgent = agent === "A" ? "Agent B" : "Agent A";

  const convergenceInstr =
    round >= 3
      ? `

IMPORTANT: Since this is Round ${round} (3+), you MUST end with a convergence assessment:
**Convergence assessment:** [CONVERGING|PARALLEL|DIVERGING|DEADLOCKED] — [explanation]
- CONVERGING — positions within ~80% agreement, name remaining gap
- PARALLEL — same conclusion, different reasoning
- DIVERGING — core disagreement on [specific point], state your crux
- DEADLOCKED — fundamental disagreement, recommend human review`
      : "";

  return `You are Agent ${agent} in a structured council discussion. Your lens: ${lensDesc}

Here is the full discussion file:

---BEGIN DISCUSSION FILE---
${fileContent}
---END DISCUSSION FILE---

PRINCIPLES:
1. Steel-man first. Restate the other's argument in its strongest form before disagreeing.
2. Evidence over intuition. "I think" requires "because..." with a concrete reason.
3. Name your uncertainty. Calibrated confidence: "~70% because..."
4. Seek the third option. Look for synthesis before arguing your side.
5. Change your mind visibly. Say so explicitly and explain what shifted.
6. Stay scoped. Flag tangents as [PARKING LOT], don't chase them.
7. Be concise. Quality over quantity. Repetition = no progress.

Write your Round ${round} response. You MUST follow this EXACT format:

### Round ${round} — [Your Name] | response | confidence: X%

**Response to previous point:**
Steel-man their argument first, then agree, disagree, or synthesize.
Be specific about what convinced you or what you find insufficient.

**New evidence or angle:**
Something not yet discussed. If nothing new, say so — that's convergence.

**Current position:**
Where you stand now, confidence %, brief justification.

**Question for ${otherAgent}:**
One specific question to resolve remaining disagreement.${convergenceInstr}

Return ONLY the formatted response above, nothing else.`;
}

function buildConsensusPrompt(fileContent) {
  return `You are the consensus writer for a structured council discussion. Read the full discussion below and write the final consensus summary.

---BEGIN DISCUSSION FILE---
${fileContent}
---END DISCUSSION FILE---

Write the consensus using this EXACT format:

---

## Consensus Summary

### Decision
[2-3 sentences — the agreed answer, or both positions if deadlocked]

### Key Contention Points

| # | What We Disagreed On | How It Was Resolved | Who Shifted & Why |
|---|---------------------|--------------------|--------------------|
| 1 | ... | ... | ... |

### Unresolved Items & Risks
- ...

### Confidence: [High | Medium | Low]
[1 sentence justification]

Return ONLY the formatted consensus above, nothing else.`;
}

// --- Git ---

function gitCommit(filePath, message, mode) {
  if (mode === "none") return;
  try {
    execSync(`git add "${filePath}" && git commit -m "${message}"`, {
      cwd: path.dirname(filePath),
      stdio: "pipe",
    });
  } catch {
    // Not in a git repo or nothing to commit
  }
}

// --- Main ---

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: node scripts/headless-council.js <discussion-file.md>");
    console.error("");
    console.error("Configure agent CLIs via frontmatter:");
    console.error('  agent_a_cli: "claude"   (default)');
    console.error('  agent_b_cli: "codex"');
    console.error("");
    console.error(`Supported CLIs: ${Object.keys(CLI_PROFILES).join(", ")}`);
    process.exit(1);
  }

  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    console.error(`File not found: ${absPath}`);
    process.exit(1);
  }

  let content = fs.readFileSync(absPath, "utf-8");
  let fm = parseFrontmatter(content);

  // Resolve CLI for each agent (default: claude)
  const cliA = fm.agent_a_cli || "claude";
  const cliB = fm.agent_b_cli || "claude";

  log(`Agent A: ${getProfile(cliA).name} (${cliA})`);
  log(`Agent B: ${getProfile(cliB).name} (${cliB})`);

  // Preflight — check all required CLIs
  const uniqueClis = [...new Set([cliA, cliB])];
  const preflightResults = preflight(uniqueClis);
  const allPassed = uniqueClis.every((cli) => preflightResults[cli]);

  if (!allPassed) {
    const failed = uniqueClis.filter((cli) => !preflightResults[cli]);
    console.error(
      `FALLBACK: CLI(s) not available: ${failed.join(", ")}. Use subagent mode instead.`
    );
    process.exit(2); // Exit code 2 signals fallback to caller
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "discuss-council-"));
  log(`Temp directory: ${tmpDir}`);

  // Map agent letter to CLI
  const agentCli = { A: cliA, B: cliB };

  try {
    const topic = fm.topic;
    const maxRounds = parseInt(fm.max_rounds || "7", 10);
    const gitMode = fm.git_commit || "final_only";

    log(`Topic: ${topic}`);
    log(`Max rounds: ${maxRounds}, Git: ${gitMode}`);

    // Phase 1: Blind Research
    if (fm.status === "researching") {
      log("Phase 1: Blind research (parallel)...");

      const promptA = buildResearchPrompt(topic, "A", fm.agent_a_lens);
      const promptB = buildResearchPrompt(topic, "B", fm.agent_b_lens);

      const [resultA, resultB] = await runAgentsParallel(
        [
          { promptText: promptA, cliName: cliA },
          { promptText: promptB, cliName: cliB },
        ],
        tmpDir
      );

      if (!validateResearch(resultA, "A")) {
        log("WARNING: Agent A research failed validation");
      }
      if (!validateResearch(resultB, "B")) {
        log("WARNING: Agent B research failed validation");
      }

      // Append research
      content = fs.readFileSync(absPath, "utf-8");
      content += `\n## Research Phase\n\n${resultA || "[Agent A research failed]"}\n\n${resultB || "[Agent B research failed]"}\n\n---\n\n## Discussion\n`;
      content = updateFrontmatter(content, {
        status: "discussing",
        turn: "A",
        round: "1",
        last_updated: new Date().toISOString(),
      });
      fs.writeFileSync(absPath, content);

      gitCommit(
        absPath,
        "discuss: initial research complete",
        gitMode === "every_turn" ? "every_turn" : "none"
      );
      log("Research phase complete.");
    }

    // Phase 2: Discussion Rounds
    content = fs.readFileSync(absPath, "utf-8");
    fm = parseFrontmatter(content);
    let round = parseInt(fm.round || "1", 10);
    let status = fm.status;

    while (status === "discussing" && round <= maxRounds) {
      for (const agent of ["A", "B"]) {
        const cli = agentCli[agent];
        log(`Round ${round} — Agent ${agent} (${getProfile(cli).name})...`);

        content = fs.readFileSync(absPath, "utf-8");
        const lens = agent === "A" ? fm.agent_a_lens : fm.agent_b_lens;
        const prompt = buildTurnPrompt(topic, agent, lens, content, round);

        let result = runAgent(prompt, cli, tmpDir);

        // Validate with retry
        if (!validateResponse(result, round)) {
          log(`Agent ${agent} output failed validation, retrying...`);
          const retryPrompt =
            prompt +
            "\n\nIMPORTANT: Your previous response was malformed. Follow the EXACT format specified above. Every section is required.";
          result = runAgent(retryPrompt, cli, tmpDir);

          if (!validateResponse(result, round)) {
            log(`Agent ${agent} retry also failed. Appending raw output.`);
          }
        }

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
          if (conv === "DEADLOCKED") {
            log("DEADLOCKED — moving to consensus.");
            status = "deadlock";
            break;
          }
          if ((conv === "CONVERGING" || conv === "PARALLEL") && agent === "B") {
            if (result.includes("## Consensus Summary")) {
              status = "consensus";
              break;
            }
          }
        }
      }

      if (status !== "discussing") break;

      round++;
      if (round > maxRounds) {
        log(`Max rounds (${maxRounds}) exceeded — forcing consensus.`);
        break;
      }
    }

    // Phase 3: Consensus
    // Use Agent A's CLI for consensus writing (arbitrary choice — it has the full context)
    if (status !== "consensus") {
      log("Phase 3: Writing consensus...");
      content = fs.readFileSync(absPath, "utf-8");
      const consensusPrompt = buildConsensusPrompt(content);
      let consensus = runAgent(consensusPrompt, cliA, tmpDir);

      if (!validateConsensus(consensus)) {
        log("Consensus failed validation, retrying...");
        consensus = runAgent(
          consensusPrompt +
            "\n\nIMPORTANT: Follow the EXACT format. Include Decision, Key Contention Points table, Unresolved Items, and Confidence.",
          cliA,
          tmpDir
        );
      }

      content = fs.readFileSync(absPath, "utf-8");
      content += `\n${consensus || "[Consensus generation failed — manual synthesis needed]"}\n`;
      const finalStatus = status === "deadlock" ? "deadlock" : "consensus";
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

    // Print summary to stdout for the orchestrating caller to read
    const finalContent = fs.readFileSync(absPath, "utf-8");
    const consensusMatch = finalContent.match(/## Consensus Summary[\s\S]*$/);
    if (consensusMatch) {
      console.log(consensusMatch[0]);
    }
  } finally {
    // Cleanup
    fs.rmSync(tmpDir, { recursive: true, force: true });
    log("Temp directory cleaned up.");
  }
}

main().catch((err) => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
