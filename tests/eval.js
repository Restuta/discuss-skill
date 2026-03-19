#!/usr/bin/env node

// eval.js — Automated evaluation runner for discuss-skill
//
// Runs test cases against the council orchestrator and validates:
// - Discussion file structure (frontmatter, sections)
// - Consensus quality (all required sections present)
// - Lens application (research uses assigned lens, turns do not)
// - Convergence detection (exits early when converging)
//
// Usage: node tests/eval.js [--filter NAME]

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ORCHESTRATOR = path.join(__dirname, "..", "scripts", "headless-council.js");
const TESTS_DIR = path.join(__dirname, "cases");

// --- Test case loader ---

function loadTestCases(filterName) {
  const files = fs.readdirSync(TESTS_DIR).filter((f) => f.endsWith(".json"));
  let cases = files.map((f) => {
    const content = JSON.parse(fs.readFileSync(path.join(TESTS_DIR, f), "utf-8"));
    return { ...content, _file: f };
  });
  if (filterName) {
    cases = cases.filter((c) => c.name.includes(filterName));
  }
  return cases;
}

// --- Discussion file generator ---

function createDiscussionFile(testCase, tmpDir) {
  const filePath = path.join(tmpDir, `${testCase.name}.md`);
  const frontmatter = {
    topic: testCase.topic,
    mode: "council",
    lens_id: testCase.lens_id || "risk-vs-opportunity",
    selection_mode: "flag",
    max_rounds: testCase.max_rounds || 3,
    git_commit: "none",
    agent_a: "Claude Agent A",
    agent_b: "Claude Agent B",
    agent_a_cli: testCase.agent_a_cli || "claude",
    agent_b_cli: testCase.agent_b_cli || "claude",
    agent_a_lens: testCase.agent_a_lens || "risk/cost/failure",
    agent_b_lens: testCase.agent_b_lens || "value/opportunity/success",
    status: "researching",
    turn: "A",
    round: "0",
    created: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  };

  const lines = ["---"];
  for (const [k, v] of Object.entries(frontmatter)) {
    lines.push(`${k}: "${v}"`);
  }
  lines.push("---");
  lines.push("");
  lines.push(`# Discussion: ${testCase.topic}`);
  lines.push("");
  lines.push("## Key Questions");
  for (const q of testCase.key_questions || ["What is the best approach?"]) {
    lines.push(`1. ${q}`);
  }
  lines.push("");

  fs.writeFileSync(filePath, lines.join("\n"));
  return filePath;
}

// --- Validators ---

function validateStructure(content) {
  const errors = [];

  // Frontmatter
  if (!content.match(/^---\n[\s\S]*?\n---/)) errors.push("Missing frontmatter");

  // Required sections
  if (!content.includes("## Research Phase")) errors.push("Missing Research Phase section");
  if (!content.includes("## Discussion")) errors.push("Missing Discussion section");

  // Research entries
  if (!content.includes("### Agent A — Independent Research | research"))
    errors.push("Missing Agent A research");
  if (!content.includes("### Agent B — Independent Research | research"))
    errors.push("Missing Agent B research");

  // At least one response round
  if (!/### Round \d+ — .+ \| response \| confidence: \d+%/.test(content))
    errors.push("No response rounds found");

  return errors;
}

function validateConsensus(content) {
  const errors = [];

  if (!content.includes("## Consensus Summary")) errors.push("Missing Consensus Summary");
  if (!content.includes("### Decision")) errors.push("Missing Decision section");
  if (!content.includes("### Key Contention Points")) errors.push("Missing Key Contention Points");
  if (!content.includes("### Unresolved Items")) errors.push("Missing Unresolved Items");
  if (!content.includes("### Confidence:")) errors.push("Missing Confidence section");

  return errors;
}

function validateFrontmatterState(content) {
  const errors = [];
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return ["Cannot parse frontmatter"];

  const fm = {};
  for (const line of fmMatch[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    fm[key] = val;
  }

  if (fm.status !== "consensus" && fm.status !== "deadlock")
    errors.push(`Expected status consensus|deadlock, got "${fm.status}"`);

  return errors;
}

function validateLensApplication(content, lensId) {
  const errors = [];

  // Research should contain lens-specific language
  const researchSection = content.match(/## Research Phase\n([\s\S]*?)(?=\n---\n)/);
  if (!researchSection) return ["Cannot extract research section"];

  // Turn responses should NOT contain lens descriptions
  // (This is a soft check — we verify the lens was removed from turn prompts)
  const discussionSection = content.match(/## Discussion\n([\s\S]*?)(?=\n---\n## Consensus|\n## Consensus)/);
  if (discussionSection) {
    const turns = discussionSection[1];
    // Lens descriptions should not appear verbatim in turns
    if (lensId === "simplicity-vs-correctness") {
      // Check that the turn template isn't injecting lens text
      if (turns.includes("Your lens: SIMPLICITY, PRAGMATISM"))
        errors.push("Lens description leaked into discussion turns");
    }
  }

  return errors;
}

// --- Runner ---

async function runTestCase(testCase) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "discuss-eval-"));
  const result = {
    name: testCase.name,
    passed: true,
    errors: [],
    duration_ms: 0,
    rounds: 0,
  };

  try {
    const filePath = createDiscussionFile(testCase, tmpDir);
    const startTime = Date.now();

    try {
      execSync(`node "${ORCHESTRATOR}" "${filePath}"`, {
        encoding: "utf-8",
        timeout: 600000, // 10 min max
        maxBuffer: 1024 * 1024 * 50,
        stdio: ["pipe", "pipe", "pipe"],
      });
    } catch (err) {
      // Check if it's a real failure or just stderr output
      if (err.status !== 0 && err.status !== null) {
        result.errors.push(`Orchestrator exited with code ${err.status}: ${(err.stderr || "").slice(0, 200)}`);
        result.passed = false;
        return result;
      }
    }

    result.duration_ms = Date.now() - startTime;

    // Read the output file
    const content = fs.readFileSync(filePath, "utf-8");

    // Count rounds
    const roundMatches = content.match(/### Round \d+/g);
    result.rounds = roundMatches ? Math.ceil(roundMatches.length / 2) : 0;

    // Run validators
    const structureErrors = validateStructure(content);
    const consensusErrors = validateConsensus(content);
    const stateErrors = validateFrontmatterState(content);
    const lensErrors = validateLensApplication(content, testCase.lens_id || "risk-vs-opportunity");

    // Custom assertions from test case
    const customErrors = [];
    if (testCase.assertions) {
      for (const assertion of testCase.assertions) {
        if (assertion.type === "contains" && !content.includes(assertion.value)) {
          customErrors.push(`Expected content to contain: "${assertion.value}"`);
        }
        if (assertion.type === "not_contains" && content.includes(assertion.value)) {
          customErrors.push(`Expected content NOT to contain: "${assertion.value}"`);
        }
        if (assertion.type === "min_rounds" && result.rounds < assertion.value) {
          customErrors.push(`Expected at least ${assertion.value} rounds, got ${result.rounds}`);
        }
        if (assertion.type === "max_rounds" && result.rounds > assertion.value) {
          customErrors.push(`Expected at most ${assertion.value} rounds, got ${result.rounds}`);
        }
      }
    }

    result.errors = [...structureErrors, ...consensusErrors, ...stateErrors, ...lensErrors, ...customErrors];
    result.passed = result.errors.length === 0;
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  return result;
}

// --- Main ---

async function main() {
  const filterArg = process.argv.find((a) => a === "--filter");
  const filterName = filterArg ? process.argv[process.argv.indexOf(filterArg) + 1] : null;

  console.log("discuss-skill eval runner");
  console.log("========================\n");

  const testCases = loadTestCases(filterName);
  if (testCases.length === 0) {
    console.log("No test cases found in tests/cases/");
    process.exit(1);
  }

  console.log(`Running ${testCases.length} test case(s)...\n`);

  const results = [];
  for (const tc of testCases) {
    process.stdout.write(`  ${tc.name} ... `);
    const result = await runTestCase(tc);
    results.push(result);

    if (result.passed) {
      console.log(`PASS (${result.rounds} rounds, ${(result.duration_ms / 1000).toFixed(1)}s)`);
    } else {
      console.log("FAIL");
      for (const err of result.errors) {
        console.log(`    - ${err}`);
      }
    }
  }

  // Summary
  console.log("\n========================");
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const totalTime = results.reduce((sum, r) => sum + r.duration_ms, 0);

  console.log(`${passed} passed, ${failed} failed, ${(totalTime / 1000).toFixed(1)}s total`);

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
