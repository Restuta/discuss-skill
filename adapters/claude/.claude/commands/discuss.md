# /discuss — Structured Multi-AI Discussion

A single command for structured, turn-based AI discussions. Supports three modes depending on your arguments.

## Usage

```
/discuss "topic" file.md                              → council mode (default): orchestrates two Claude instances debating to completion
/discuss "topic" file.md --agents claude,codex        → council with cross-model debate (Claude vs Codex)
/discuss "topic" file.md --mode external              → external mode: creates discussion file, waits for another AI to join manually
/discuss file.md                                      → join mode: joins an existing discussion as a participant
```

When invoked, print this to the user so they know what's happening:

**For external mode:**
> Starting external discussion on: "<topic>"
> Created: file.md
> Mode: external — doing independent research, waiting for another AI to join
>
> **Copy this into your other AI to join:**
> ```
> Join the discussion in <absolute path to file.md>. Read the file, claim Agent B, and follow the protocol in the frontmatter and body.
> ```
>
> If the other AI has `/discuss` installed:
> ```
> /discuss <absolute path to file.md>
> ```

**For council mode:**
> Starting council discussion on: "<topic>"
> Mode: council — orchestrating two independent Claude instances with full reasoning
> Output: file.md
> Running...

**For join mode:**
> Joining discussion: "<topic from frontmatter>"
> You are: Agent [A/B]
> Current round: N
> Status: [researching/discussing/consensus/deadlock]

---

## Argument Parsing

Parse the user's input to determine the mode:

1. If a **topic string in quotes** AND a **file path** are provided:
   - Check for `--mode external` flag → external mode
   - Check for `--agents X,Y` flag (council mode only) → set `agent_a_cli` and `agent_b_cli` (e.g. `--agents claude,codex`)
   - Check for `--lens LENS_ID` flag (council mode only) → set `lens_id` directly, skip picker. Valid IDs: `risk-vs-opportunity`, `simplicity-vs-correctness`, `speed-vs-maintainability`. If the ID is invalid, error: "Unknown lens '[value]'. Available: risk-vs-opportunity, simplicity-vs-correctness, speed-vs-maintainability"
   - Otherwise → council mode (default)
2. If **only a file path** is provided and the file exists → join mode
3. If **only a file path** is provided and the file does NOT exist → error: "File not found. To start a new discussion, provide a topic: `/discuss \"your topic\" file.md`"

---

## External Mode (default)

Creates a discussion file and participates as one side, waiting for another AI to join.

### Setup

Create the discussion file:

```markdown
---
topic: "<the topic>"
mode: external
max_rounds: 7
git_commit: final_only
agent_a: "Claude"
agent_b: "unassigned"
agent_a_lens: "risk/cost/failure"
agent_b_lens: "value/opportunity/success"
status: researching
turn: A
round: 0
created: <ISO 8601 timestamp>
last_updated: <ISO 8601 timestamp>
---

# Discussion: <topic>

## Key Questions
1. [Generated from the topic — 2-3 specific sub-questions to resolve]
2. ...
3. ...
```

The agent MUST generate the Key Questions from the topic when creating a new discussion. These should be concrete sub-questions that, if answered, would resolve the topic.

### Git Detection

If the file is inside a git repository, ask the user:

> Git repo detected. How should I handle commits?
> - `final_only` (default) — one commit when discussion ends
> - `every_turn` — commit after each agent turn
> - `none` — no commits

### Research Phase

Write your blind research immediately using Agent A's lens (risks, costs, failure modes):

```markdown
## Research Phase

### Agent A — Independent Research | research

[Your analysis]
```

Update `turn: B` and tell the user you're waiting for the other AI.

### Discussion Phase

Poll the file for changes (every ~10 seconds):
1. Re-read the file
2. If new content appeared and `turn` indicates you → write your response
3. If a `### Human Interjection | human-note` entry appeared since your last read → acknowledge and address it in your next response
4. If `turn` is not you → keep waiting
5. After 5 minutes of no changes → tell the user the discussion appears stalled
6. If `status: consensus` or `status: deadlock` → display summary, stop
7. If `round > max_rounds` → write a consensus entry instead of a response

For each response turn, follow the **Turn Structure** below.

---

## Council Mode (`--mode council`)

Orchestrates two independent top-level Claude instances that debate the topic with full reasoning capabilities. Each instance runs as a separate `claude -p` process with `--effort high`, ensuring extended thinking is available for every turn. The orchestrator (you) manages the discussion file, frontmatter, and turn sequencing.

**Why not subagents:** Claude Code subagents do not receive extended thinking blocks. For adversarial reasoning — steel-manning, counterargument generation, synthesis — full thinking is essential. Council mode uses orchestrated instances to guarantee the best available reasoning on every turn.

### Lens selection

Before creating the discussion file, select the debate lens. If `--lens LENS_ID` was provided, use it directly. Otherwise, present the picker:

Read the topic and show the user available lens pairs. Analyze the topic to determine which lens is the best fit, then present options with your recommendation highlighted:

```
Debate lens for: "<topic>"

  1. Risk vs Opportunity — general-purpose, one agent stress-tests, the other advocates
  2. Simplicity vs Correctness — architecture/design, simple path vs thorough approach
  3. Speed vs Maintainability — roadmap/refactoring, ship now vs build to last

  Recommended: [your pick based on the topic] (enter to accept, or pick 1-3)
```

Valid lens IDs: `risk-vs-opportunity`, `simplicity-vs-correctness`, `speed-vs-maintainability`

The recommendation is your judgment based on the topic — not a heuristic or keyword match. If the topic is ambiguous, recommend `risk-vs-opportunity` (the general-purpose default).

Record the selection in frontmatter as `lens_id` and `selection_mode` (`default` if user hit enter on recommendation, `manual` if they picked a different one, `flag` if `--lens` was used).

### Setup

Create the discussion file with `mode: council`:

```markdown
---
topic: "<the topic>"
mode: council
lens_id: "<selected lens id>"
selection_mode: "<default|manual|flag>"
max_rounds: 7
git_commit: final_only
agent_a: "Claude Agent A"
agent_b: "Claude Agent B"
agent_a_cli: "claude"
agent_b_cli: "claude"
agent_a_lens: "<from selected lens pair>"
agent_b_lens: "<from selected lens pair>"
status: researching
turn: A
round: 0
created: <ISO 8601 timestamp>
last_updated: <ISO 8601 timestamp>
---

# Discussion: <topic>

## Key Questions
1. [Generated from the topic — 2-3 specific sub-questions to resolve]
2. ...
3. ...
```

The orchestrator MUST generate the Key Questions from the topic when creating the discussion file.

### Cross-model discussions

Council mode supports running different AI CLIs for each agent. Set `agent_a_cli` and `agent_b_cli` in the frontmatter to control which CLI runs each side of the debate. Both default to `"claude"`.

Supported CLIs:
- `claude` — Claude Code CLI (`claude -p --effort high`)
- `codex` — OpenAI Codex CLI (`codex exec --full-auto`)

When the user specifies `--agents claude,codex` (or similar), parse the comma-separated values and set `agent_a_cli` and `agent_b_cli` accordingly in the frontmatter. Agent names in the frontmatter should reflect the CLI: e.g. `agent_a: "Claude"`, `agent_b: "Codex"`.

Example:
```
/discuss "Should we use a monorepo?" monorepo.md --mode council --agents claude,codex
```

### Orchestration

Council mode is orchestrated by a Node.js script that handles all process management, validation, and file updates deterministically. The skill file (this document) handles routing and file creation; the script handles execution.

After creating the discussion file, run the orchestrator:

```bash
node ~/.claude/scripts/headless-council.js <discussion-file.md>
```

The script:
1. Reads `agent_a_cli` and `agent_b_cli` from frontmatter (default: `"claude"`)
2. Runs a preflight check for each required CLI. If any fails, exits with code 2 — fall back to subagent mode and inform the user.
3. Creates a per-run temp directory (`mktemp -d`) for all prompt/result files
4. **Phase 1 — Blind Research:** Runs two parallel instances (each using its configured CLI) with opposing lenses. Validates output format. Appends to file.
5. **Phase 2 — Discussion Rounds:** Alternates Agent A and Agent B turns, each using its own CLI. Validates all required sections. Retries once on malformed output.
6. **Phase 3 — Consensus:** Generates consensus entry when agents converge, deadlock, or exceed max rounds.
7. Cleans up temp directory and prints the consensus summary to stdout.

The script is at `scripts/headless-council.js`. Zero npm dependencies. Adding a new CLI requires only adding an entry to the `CLI_PROFILES` object in the script.

---

## Join Mode

Joins an existing discussion file as a participant.

### Step 1: Read and Understand

Read the full file. Parse frontmatter for `topic`, `status`, `turn`, `round`, `agent_a`, `agent_b`.

### Step 2: Claim Identity

If `agent_a` or `agent_b` is "unassigned" or empty:
1. Claim the first available slot
2. Update frontmatter with your identity
3. Re-read to confirm no collision

If both slots are taken:
- Tell user: "Both participant slots are taken. I can observe and contribute human notes if you'd like."

### Step 3: Act Based on Status

**`status: researching` + your turn:** Write blind research using your assigned lens. Update `turn`. If both briefs done, update `status: discussing`, `round: 1`.

**`status: discussing` + your turn:** Write structured response (see Turn Structure). Update `turn`, `round`, `last_updated`.

**`status: discussing` + NOT your turn:** Poll file every ~10 seconds. After 5 min of no changes, warn user.

**`status: consensus` or `deadlock`:** Display the summary. Done.

**`round > max_rounds`:** You MUST write a consensus entry. No more response turns allowed.

---

## Turn Structure (All Modes)

Every discussion response MUST follow this format:

```markdown
### Round N — [Name] | response | confidence: X%

**Response to previous point:**
Steel-man their argument first, then agree, disagree, or synthesize.
Be specific about what convinced you or what you find insufficient.

**New evidence or angle:**
Something not yet discussed. If nothing new, say so — that's convergence.

**Current position:**
Where you stand now, confidence %, brief justification.

**Question for [other participant]:**
One specific question to resolve remaining disagreement.
```

**Round 3+:** End with convergence assessment:
- `CONVERGING` — positions within ~80% agreement, name remaining gap
- `PARALLEL` — same conclusion, different reasoning
- `DIVERGING` — core disagreement on [specific point], state your crux
- `DEADLOCKED` — fundamental disagreement, recommend human review

---

## Consensus Format

```markdown
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
```

---

## Master Prompt (All Participants)

These principles govern every turn:

1. **Steel-man first.** Restate the other's argument in its strongest form before disagreeing.
2. **Evidence over intuition.** "I think" requires "because..." with a concrete reason.
3. **Name your uncertainty.** Calibrated confidence: "~70% because..."
4. **Seek the third option.** Look for synthesis before arguing your side.
5. **Change your mind visibly.** Say so explicitly and explain what shifted.
6. **Stay scoped.** Flag tangents as [PARKING LOT], don't chase them.
7. **Be concise.** Quality over quantity. Repetition = no progress.

---

## Git Behavior

After each appended entry:
- `every_turn`: `git add <file> && git commit -m "discuss: round N — [Name] response"`
- `final_only`: commit only when `status` changes to `consensus` or `deadlock`
- `none`: skip
- Never auto-push. Never use broad staging.

---

## Reread-Before-Append Protocol

Before EVERY write:
1. Re-read the full file
2. Confirm `turn` still indicates you
3. Confirm no new content since last read
4. If anything changed: abort, re-read, reassess

Fail closed. Do not guess.

This prevents collisions without a lock file.
