#!/usr/bin/env node

// n-agent-eval.js — Comparison eval runner for N-agent discussions
//
// Runs the same topic through multiple agent configurations (1, 2, 3, 5 agents)
// and evaluates output quality using:
//   1. Expert checklist coverage (keyword matching + LLM verification)
//   2. Trap detection (did the discussion catch known pitfalls?)
//   3. Blind pairwise comparison (LLM judge ranks outputs)
//
// Usage:
//   node tests/n-agent-eval.js                           # Run all topics x all configs
//   node tests/n-agent-eval.js --topic fintech-payments  # Single topic
//   node tests/n-agent-eval.js --config 3-codex          # Single config
//   node tests/n-agent-eval.js --judge-only <dir>        # Re-judge existing outputs
//   node tests/n-agent-eval.js --dry-run                 # Show what would run
//
// Output: tests/eval-results/<timestamp>/ with per-run discussions and summary

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const {
  runCouncil,
  createDiscussionFile,
  resolveAgents,
  parseFrontmatter,
  ROLES,
} = require("../scripts/headless-council-n.js");

// --- Constants ---

const CASES_DIR = path.join(__dirname, "cases");
const RESULTS_DIR = path.join(__dirname, "eval-results");

const CONFIGS = {
  "1-codex": {
    description: "Single agent, no debate (control)",
    agent_count: 1,
    agent_config: null, // Special: single-agent mode
    default_cli: "codex",
  },
  "2-codex": {
    description: "2 Codex agents: Advocate + Skeptic",
    agent_count: 2,
    agent_config: "2-agent",
    default_cli: "codex",
  },
  "3-codex": {
    description: "3 Codex agents: Advocate + Skeptic + Synthesizer",
    agent_count: 3,
    agent_config: "3-agent",
    default_cli: "codex",
  },
  "5-codex": {
    description: "5 Codex agents: full panel + Synthesizer",
    agent_count: 5,
    agent_config: "5-agent",
    default_cli: "codex",
  },
  "2-cross": {
    description: "Cross-model: Claude (Advocate) + Codex (Skeptic)",
    agent_count: 2,
    agent_config: "2-agent",
    default_cli: "codex",
    cli_overrides: { A: "claude", B: "codex" },
  },
};

// --- Load eval topics ---

function loadEvalTopics(filterName) {
  const files = fs.readdirSync(CASES_DIR).filter((f) => f.startsWith("eval-") && f.endsWith(".json"));
  let topics = files.map((f) => {
    const content = JSON.parse(fs.readFileSync(path.join(CASES_DIR, f), "utf-8"));
    return { ...content, _file: f };
  });
  if (filterName) {
    topics = topics.filter((t) => t.name.includes(filterName));
  }
  return topics;
}

// --- Single-agent runner (control group) ---

function runSingleAgent(topic, cli, outputPath, tmpDir, cwd) {
  const prompt = `You are an expert analyst. Thoroughly analyze the following question and provide a comprehensive recommendation.

Topic: "${topic.topic}"

Key questions to address:
${(topic.key_questions || []).map((q, i) => `${i + 1}. ${q}`).join("\n")}

Provide your analysis in this format:

# Analysis: ${topic.topic}

## Research
[Comprehensive analysis covering all relevant dimensions — technical, business, organizational, strategic, regulatory. ~500 words.]

## Recommendation

### Decision
[2-3 sentences — clear recommendation with reasoning]

### Key Trade-offs
| # | Trade-off | How You Weighed It |
|---|-----------|-------------------|
| 1 | ... | ... |

### Risks & Uncertainties
- ...

### Confidence: [High | Medium | Low]
[1 sentence justification]
`;

  const promptFile = path.join(tmpDir, `single-agent-prompt-${Date.now()}.txt`);
  fs.writeFileSync(promptFile, prompt);

  const profile = require("../scripts/headless-council-n.js").CLI_PROFILES[cli];
  const cmd = profile.buildCmd(promptFile, cwd);

  try {
    const result = execSync(cmd, {
      encoding: "utf-8",
      timeout: 600000,
      maxBuffer: 1024 * 1024 * 50,
      stdio: ["pipe", "pipe", "pipe"],
    });

    // Write as a pseudo-discussion file for uniform evaluation
    const content = `---
topic: "${topic.topic}"
mode: "single-agent"
agent_count: "1"
agent_cli: "${cli}"
status: "consensus"
created: "${new Date().toISOString()}"
---

# Discussion: ${topic.topic}

## Single Agent Analysis

${result.trim()}
`;
    fs.writeFileSync(outputPath, content);
    return result.trim();
  } catch (err) {
    console.error(`Single agent failed: ${(err.message || "").slice(0, 200)}`);
    return null;
  }
}

// --- Checklist Scorer ---

function scoreChecklist(content, checklist) {
  const lowerContent = content.toLowerCase();
  const results = [];

  for (const item of checklist) {
    const keywordHits = item.keywords.filter((kw) => lowerContent.includes(kw.toLowerCase()));
    const hit = keywordHits.length > 0;
    results.push({
      id: item.id,
      item: item.item,
      weight: item.weight,
      category: item.category,
      hit,
      matched_keywords: keywordHits,
    });
  }

  const totalWeight = results.reduce((sum, r) => sum + r.weight, 0);
  const hitWeight = results.filter((r) => r.hit).reduce((sum, r) => sum + r.weight, 0);
  const coverageRaw = results.filter((r) => r.hit).length / results.length;
  const coverageWeighted = hitWeight / totalWeight;

  return {
    items: results,
    total: results.length,
    hits: results.filter((r) => r.hit).length,
    misses: results.filter((r) => !r.hit).map((r) => r.id),
    coverage_raw: Math.round(coverageRaw * 100),
    coverage_weighted: Math.round(coverageWeighted * 100),
  };
}

// --- Trap Scorer ---

function scoreTraps(content, traps) {
  const lowerContent = content.toLowerCase();
  const results = [];

  for (const trap of traps) {
    const caughtHits = trap.caught_keywords.filter((kw) => lowerContent.includes(kw.toLowerCase()));
    const fell = trap.detection_keywords.some((kw) => lowerContent.includes(kw.toLowerCase())) && caughtHits.length === 0;
    const caught = caughtHits.length > 0;

    results.push({
      id: trap.id,
      description: trap.description,
      caught,
      fell_into: fell,
      evidence: caughtHits,
    });
  }

  return {
    traps: results,
    total: results.length,
    caught: results.filter((r) => r.caught).length,
    fell_into: results.filter((r) => r.fell_into).length,
    score: Math.round((results.filter((r) => r.caught).length / results.length) * 100),
  };
}

// --- LLM Judge (blind pairwise) ---

function extractForJudging(content) {
  // Extract research + consensus sections (skip verbose turn-by-turn debate)
  // This ensures the judge sees the full research AND full consensus regardless of length
  const parts = [];

  // Research phase
  const researchMatch = content.match(/## Research Phase\n([\s\S]*?)(?=\n---\n|\n## Discussion)/);
  const singleMatch = content.match(/## Single Agent Analysis\n([\s\S]*?)$/);
  if (researchMatch) {
    parts.push("## Research Phase\n" + researchMatch[1].trim());
  } else if (singleMatch) {
    parts.push("## Analysis\n" + singleMatch[1].trim());
  }

  // Consensus / Recommendation
  const consensusMatch = content.match(/## Consensus Summary\n([\s\S]*?)$/);
  const recoMatch = content.match(/## Recommendation\n([\s\S]*?)$/);
  if (consensusMatch) {
    parts.push("## Consensus Summary\n" + consensusMatch[1].trim());
  } else if (recoMatch) {
    parts.push("## Recommendation\n" + recoMatch[1].trim());
  }

  // If extraction failed, fall back to full content (truncated)
  if (parts.length === 0) return content.slice(0, 12000);

  return parts.join("\n\n---\n\n");
}

function buildJudgePrompt(topic, outputA, outputB, labelA, labelB) {
  const extractA = extractForJudging(outputA);
  const extractB = extractForJudging(outputB);

  return `You are an expert evaluator judging the quality of two analyses on the same topic. You do NOT know which analysis used more agents or resources. Judge purely on output quality.

Each analysis includes a research/analysis section and a final recommendation/consensus. Some analyses were produced by structured multi-agent debate (research + consensus), others by a single analyst. Judge the QUALITY OF THE OUTPUT, not the format.

TOPIC: "${topic}"

=== ANALYSIS A ===
${extractA}
=== END A ===

=== ANALYSIS B ===
${extractB}
=== END B ===

Score each analysis on these dimensions (0-10):

1. COMPREHENSIVENESS: How many important angles were covered?
2. DEPTH: How deep did the analysis go on key points?
3. NOVELTY: Were non-obvious insights surfaced?
4. DECISION QUALITY: Is the final recommendation well-reasoned and actionable?
5. TRADE-OFF CLARITY: Were trade-offs explicitly named and weighed?
6. NUANCE: Does the analysis avoid oversimplification? Does it acknowledge uncertainty and edge cases?

Return ONLY this JSON (no markdown, no explanation):
{"a":{"comprehensiveness":N,"depth":N,"novelty":N,"decision_quality":N,"tradeoff_clarity":N,"nuance":N,"total":N},"b":{"comprehensiveness":N,"depth":N,"novelty":N,"decision_quality":N,"tradeoff_clarity":N,"nuance":N,"total":N},"winner":"a|b|tie","reason":"one sentence"}`;
}

function runJudge(topic, outputA, outputB, labelA, labelB, tmpDir, cwd) {
  const prompt = buildJudgePrompt(topic, outputA, outputB, labelA, labelB);
  const promptFile = path.join(tmpDir, `judge-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.txt`);
  fs.writeFileSync(promptFile, prompt);

  // Use Claude for judging (higher quality)
  const cmd = `cd "${cwd}" && cat "${promptFile}" | claude -p --output-format text`;

  try {
    const result = execSync(cmd, {
      encoding: "utf-8",
      timeout: 120000,
      maxBuffer: 1024 * 1024 * 10,
      stdio: ["pipe", "pipe", "pipe"],
    });

    // Try to parse JSON from result
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    console.error("Judge returned non-JSON output");
    return null;
  } catch (err) {
    console.error(`Judge failed: ${(err.message || "").slice(0, 200)}`);
    return null;
  }
}

// --- Run single config ---

async function runConfig(topic, configName, config, runDir) {
  const outputFile = path.join(runDir, `${topic.name}__${configName}.md`);
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `eval-${configName}-`));
  const cwd = path.dirname(path.resolve(runDir));

  console.log(`  [${configName}] Starting...`);
  const startTime = Date.now();

  try {
    if (config.agent_count === 1) {
      // Single agent control
      runSingleAgent(topic, config.default_cli, outputFile, tmpDir, cwd);
    } else {
      // N-agent council
      const fm = {
        agent_count: String(config.agent_count),
        agent_config: config.agent_config,
        agent_cli: config.default_cli,
        max_rounds: String(topic.max_rounds || 5),
        git_commit: "none",
      };

      // Apply per-agent CLI overrides
      if (config.cli_overrides) {
        for (const [label, cli] of Object.entries(config.cli_overrides)) {
          fm[`agent_${label}_cli`] = cli;
        }
      }

      createDiscussionFile(topic.topic, resolveAgents(fm), config.agent_config, outputFile, {
        max_rounds: String(topic.max_rounds || 5),
        git_commit: "none",
        agent_count: String(config.agent_count),
        agent_config: config.agent_config,
        agent_cli: config.default_cli,
        ...(config.cli_overrides || {}),
      });

      // Patch the key questions into the file
      let content = fs.readFileSync(outputFile, "utf-8");
      if (topic.key_questions) {
        const qSection = topic.key_questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
        content = content.replace(
          "## Key Questions\n1. [To be addressed through structured debate]",
          `## Key Questions\n${qSection}`
        );
        fs.writeFileSync(outputFile, content);
      }

      await runCouncil(outputFile);
    }

    const durationMs = Date.now() - startTime;
    const outputContent = fs.readFileSync(outputFile, "utf-8");
    const tokenEstimate = Math.round(outputContent.length / 4); // rough

    console.log(`  [${configName}] Done in ${(durationMs / 1000).toFixed(0)}s (~${tokenEstimate} tokens output)`);

    return {
      config: configName,
      file: outputFile,
      content: outputContent,
      duration_ms: durationMs,
      token_estimate: tokenEstimate,
      success: true,
    };
  } catch (err) {
    console.error(`  [${configName}] FAILED: ${err.message}`);
    return {
      config: configName,
      file: outputFile,
      content: "",
      duration_ms: Date.now() - startTime,
      token_estimate: 0,
      success: false,
      error: err.message,
    };
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  }
}

// --- Evaluate all runs for a topic ---

function evaluateTopic(topic, runs) {
  const results = {};

  for (const run of runs) {
    if (!run.success) {
      results[run.config] = { success: false, error: run.error };
      continue;
    }

    const checklist = scoreChecklist(run.content, topic.expert_checklist);
    const traps = scoreTraps(run.content, topic.traps);

    results[run.config] = {
      success: true,
      checklist,
      traps,
      duration_ms: run.duration_ms,
      token_estimate: run.token_estimate,
      file: run.file,
    };
  }

  return results;
}

// --- Generate comparison table ---

function generateComparisonTable(topic, evaluation) {
  const configs = Object.keys(evaluation);
  const lines = [];

  lines.push(`## ${topic.name}`);
  lines.push(`**Topic:** ${topic.topic}`);
  lines.push("");

  // Main comparison table
  lines.push("| Metric | " + configs.join(" | ") + " |");
  lines.push("|--------|" + configs.map(() => "------").join("|") + "|");

  // Checklist coverage
  lines.push(
    "| **Checklist Coverage (raw)** | " +
      configs.map((c) => {
        const e = evaluation[c];
        return e.success ? `${e.checklist.coverage_raw}% (${e.checklist.hits}/${e.checklist.total})` : "FAILED";
      }).join(" | ") + " |"
  );

  lines.push(
    "| **Checklist Coverage (weighted)** | " +
      configs.map((c) => {
        const e = evaluation[c];
        return e.success ? `${e.checklist.coverage_weighted}%` : "FAILED";
      }).join(" | ") + " |"
  );

  // Trap detection
  lines.push(
    "| **Traps Caught** | " +
      configs.map((c) => {
        const e = evaluation[c];
        return e.success ? `${e.traps.caught}/${e.traps.total} (${e.traps.score}%)` : "FAILED";
      }).join(" | ") + " |"
  );

  // Duration
  lines.push(
    "| **Duration** | " +
      configs.map((c) => {
        const e = evaluation[c];
        return e.success ? `${(e.duration_ms / 1000).toFixed(0)}s` : "FAILED";
      }).join(" | ") + " |"
  );

  // Token estimate
  lines.push(
    "| **Output Tokens (est.)** | " +
      configs.map((c) => {
        const e = evaluation[c];
        return e.success ? `~${e.token_estimate}` : "FAILED";
      }).join(" | ") + " |"
  );

  lines.push("");

  // Missed checklist items per config
  lines.push("### Missed Checklist Items");
  lines.push("");
  for (const c of configs) {
    const e = evaluation[c];
    if (!e.success) continue;
    const misses = e.checklist.items.filter((i) => !i.hit);
    if (misses.length > 0) {
      lines.push(`**${c}** missed (${misses.length}):`);
      misses.forEach((m) => lines.push(`  - [${m.category}] ${m.item}`));
      lines.push("");
    }
  }

  // Trap details
  lines.push("### Trap Detection Details");
  lines.push("");
  for (const c of configs) {
    const e = evaluation[c];
    if (!e.success) continue;
    lines.push(`**${c}:**`);
    e.traps.traps.forEach((t) => {
      const status = t.caught ? "CAUGHT" : t.fell_into ? "FELL INTO" : "MISSED";
      lines.push(`  - ${status}: ${t.description}`);
    });
    lines.push("");
  }

  return lines.join("\n");
}

// --- Main ---

async function main() {
  const args = process.argv.slice(2);
  const topicFilter = args.includes("--topic") ? args[args.indexOf("--topic") + 1] : null;
  const configFilter = args.includes("--config") ? args[args.indexOf("--config") + 1] : null;
  const dryRun = args.includes("--dry-run");
  const judgeOnly = args.includes("--judge-only") ? args[args.indexOf("--judge-only") + 1] : null;
  const skipJudge = args.includes("--skip-judge");
  const outputDir = args.includes("--output-dir") ? args[args.indexOf("--output-dir") + 1] : null;

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  N-Agent Discussion Eval Runner");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");

  const topics = loadEvalTopics(topicFilter);
  let configNames = Object.keys(CONFIGS);
  if (configFilter) {
    configNames = configNames.filter((c) => c.includes(configFilter));
  }

  console.log(`Topics: ${topics.map((t) => t.name).join(", ")}`);
  console.log(`Configs: ${configNames.join(", ")}`);
  console.log(`Total runs: ${topics.length * configNames.length}`);
  console.log("");

  if (dryRun) {
    console.log("DRY RUN — would execute:");
    for (const topic of topics) {
      for (const configName of configNames) {
        const config = CONFIGS[configName];
        console.log(`  ${topic.name} x ${configName} (${config.description})`);
      }
    }
    return;
  }

  // Create results directory
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const runDir = judgeOnly || outputDir || path.join(RESULTS_DIR, timestamp);
  if (!judgeOnly) {
    fs.mkdirSync(runDir, { recursive: true });
  }

  // Run discussions
  const allRuns = {};

  if (!judgeOnly) {
    for (const topic of topics) {
      console.log(`\n--- ${topic.name} ---`);
      allRuns[topic.name] = [];

      for (const configName of configNames) {
        const config = CONFIGS[configName];
        const result = await runConfig(topic, configName, config, runDir);
        allRuns[topic.name].push(result);
      }
    }
  } else {
    // Load existing outputs for re-judging
    for (const topic of topics) {
      allRuns[topic.name] = [];
      for (const configName of configNames) {
        const file = path.join(runDir, `${topic.name}__${configName}.md`);
        if (fs.existsSync(file)) {
          allRuns[topic.name].push({
            config: configName,
            file,
            content: fs.readFileSync(file, "utf-8"),
            success: true,
            duration_ms: 0,
            token_estimate: Math.round(fs.readFileSync(file, "utf-8").length / 4),
          });
        }
      }
    }
  }

  // Evaluate
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  EVALUATION RESULTS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const reportLines = [];
  reportLines.push("# N-Agent Eval Results");
  reportLines.push(`\nRun: ${timestamp}`);
  reportLines.push(`Configs: ${configNames.join(", ")}`);
  reportLines.push(`Topics: ${topics.map((t) => t.name).join(", ")}`);
  reportLines.push("");

  const allEvals = {};

  for (const topic of topics) {
    const evaluation = evaluateTopic(topic, allRuns[topic.name]);
    allEvals[topic.name] = evaluation;
    const table = generateComparisonTable(topic, evaluation);
    reportLines.push(table);
    console.log("\n" + table);
  }

  // Pairwise comparison (if not skipped)
  if (!skipJudge) {
    console.log("\n--- Running blind pairwise comparisons (Claude as judge) ---");
    reportLines.push("\n## Pairwise Comparisons (Blind)\n");

    const pairwiseTmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "eval-judge-"));
    const cwd = path.dirname(path.resolve(runDir));

    for (const topic of topics) {
      reportLines.push(`### ${topic.name}\n`);
      const runs = allRuns[topic.name].filter((r) => r.success);

      for (let i = 0; i < runs.length; i++) {
        for (let j = i + 1; j < runs.length; j++) {
          const a = runs[i];
          const b = runs[j];

          // Randomize order to avoid position bias
          const flip = Math.random() > 0.5;
          const first = flip ? b : a;
          const second = flip ? a : b;

          console.log(`  Judging: ${a.config} vs ${b.config}...`);
          const judgment = runJudge(topic.topic, first.content, second.content, first.config, second.config, pairwiseTmpDir, cwd);

          if (judgment) {
            const winnerLabel = judgment.winner === "a" ? first.config : judgment.winner === "b" ? second.config : "TIE";
            const scoreA = flip ? judgment.b : judgment.a;
            const scoreB = flip ? judgment.a : judgment.b;

            reportLines.push(`**${a.config} vs ${b.config}**: Winner = **${winnerLabel}**`);
            reportLines.push(`  ${a.config}: total=${scoreA.total}, ${b.config}: total=${scoreB.total}`);
            reportLines.push(`  Reason: ${judgment.reason}`);
            reportLines.push("");

            console.log(`    Winner: ${winnerLabel} (${judgment.reason})`);
          } else {
            reportLines.push(`**${a.config} vs ${b.config}**: Judge failed`);
            reportLines.push("");
          }
        }
      }
    }

    try {
      fs.rmSync(pairwiseTmpDir, { recursive: true, force: true });
    } catch {}
  }

  // Aggregate summary
  reportLines.push("\n## Aggregate Summary\n");
  reportLines.push("| Config | Avg Coverage (weighted) | Avg Traps Caught | Avg Duration |");
  reportLines.push("|--------|----------------------|-----------------|-------------|");

  for (const configName of configNames) {
    const coverages = [];
    const trapScores = [];
    const durations = [];

    for (const topic of topics) {
      const e = allEvals[topic.name][configName];
      if (e && e.success) {
        coverages.push(e.checklist.coverage_weighted);
        trapScores.push(e.traps.score);
        durations.push(e.duration_ms);
      }
    }

    if (coverages.length > 0) {
      const avgCov = Math.round(coverages.reduce((a, b) => a + b, 0) / coverages.length);
      const avgTraps = Math.round(trapScores.reduce((a, b) => a + b, 0) / trapScores.length);
      const avgDur = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length / 1000);
      reportLines.push(`| ${configName} | ${avgCov}% | ${avgTraps}% | ${avgDur}s |`);
    } else {
      reportLines.push(`| ${configName} | FAILED | FAILED | FAILED |`);
    }
  }

  // Write report
  const reportPath = path.join(runDir, "REPORT.md");
  fs.writeFileSync(reportPath, reportLines.join("\n"));
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  Report: ${reportPath}`);
  console.log(`  Outputs: ${runDir}/`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

main().catch((err) => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
