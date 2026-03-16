# /discuss — Structured Multi-AI Discussion

A single command for structured, turn-based AI discussions. Supports three modes depending on your arguments.

## Usage

```
/discuss "topic" file.md                  → external mode (default): creates discussion file, waits for another AI
/discuss "topic" file.md --mode council   → council mode: orchestrates two independent Claude instances debating to completion
/discuss file.md                          → join mode: joins an existing discussion as a participant
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
   - Check for `--mode council` flag → council mode
   - Otherwise → external mode (default)
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
blind_briefs: true
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

If `blind_briefs: true` (default):

Write your blind research immediately using Agent A's lens (risks, costs, failure modes):

```markdown
## Research Phase

### Agent A — Independent Research | research

[Your analysis]
```

Update `turn: B` and tell the user you're waiting for the other AI.

If `blind_briefs: false`:

Skip the research phase. Set `status: discussing`, `round: 1`, `turn: A`. Write your first response directly under `## Discussion`.

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

### Setup

Create the discussion file with `mode: council`:

```markdown
---
topic: "<the topic>"
mode: council
blind_briefs: true
max_rounds: 7
git_commit: final_only
agent_a: "Claude Agent A"
agent_b: "Claude Agent B"
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

The orchestrator MUST generate the Key Questions from the topic when creating the discussion file.

### Preflight check

Before the first headless call, verify the CLI is available:

```bash
which claude && claude --version
```

If `claude` is not found, not authenticated, or does not support `--effort`, **fall back to the legacy subagent path**: use the Agent tool to spawn subagents as described in the protocol spec. Inform the user:
> Claude CLI not available for orchestrated council mode. Falling back to subagent mode (reduced reasoning capability).

### How to run orchestrated instances

Each agent turn is executed as a headless `claude -p` call via the Bash tool. Before any calls, create a **per-run temp directory** to avoid collisions between concurrent council sessions:

```bash
DISCUSS_TMP=$(mktemp -d)
```

All prompt and result files for this discussion go inside `$DISCUSS_TMP`.

The orchestrator:

1. Constructs the prompt (role, lens, discussion file content, format instructions)
2. Writes the prompt to `$DISCUSS_TMP/agent-[A/B]-round-N.txt`
3. Runs: `cat $DISCUSS_TMP/agent-[A/B]-round-N.txt | claude -p --effort high --output-format text --allowedTools "Read,Grep,Glob,Bash"`
4. Captures the output
5. Validates the output:
   - Starts with the expected heading (`### Round N — ...` or `### Agent [A/B] — Independent Research | research`)
   - Contains all required sections for the turn type (for responses: "Response to previous point", "New evidence or angle", "Current position", "Question for"; for round 3+: convergence assessment)
   - For consensus entries: contains "Decision", "Key Contention Points", "Confidence"
6. Appends valid output to the discussion file
7. Updates frontmatter (turn, round, status)

If a headless call returns malformed output (missing heading or required sections), retry once with an explicit correction in the prompt. If it fails again, the orchestrator writes a note and continues.

Clean up the temp directory when the discussion completes: `rm -rf $DISCUSS_TMP`

### Phase 1: Blind Research

If `blind_briefs: false`, skip this phase entirely. Set `status: discussing`, `round: 1`, `turn: A` and proceed to Phase 2.

If `blind_briefs: true` (default), run **two headless instances in parallel** using the Bash tool:

**Agent A — write this prompt to `$DISCUSS_TMP/agent-a-research.txt`, then run `cat $DISCUSS_TMP/agent-a-research.txt | claude -p --effort high --output-format text --allowedTools "Read,Grep,Glob,Bash" > $DISCUSS_TMP/agent-a-result.txt &`:**
```
You are Agent A in a structured discussion about: "<topic>"

Your analytical lens: Focus on RISKS, COSTS, FAILURE MODES, edge cases, and what could go wrong. Be the skeptic.

Research this topic independently. Do NOT try to anticipate what another agent might say. You have access to Read, Grep, Glob, and Bash tools — use them if the topic involves a specific codebase or requires inspecting local files.

Return ONLY this formatted output, nothing else:

### Agent A — Independent Research | research

[Your analysis. Be specific, cite evidence, name uncertainties. ~200 words.]
```

**Agent B — write this prompt to `$DISCUSS_TMP/agent-b-research.txt`, then run `cat $DISCUSS_TMP/agent-b-research.txt | claude -p --effort high --output-format text --allowedTools "Read,Grep,Glob,Bash" > $DISCUSS_TMP/agent-b-result.txt &`:**
```
You are Agent B in a structured discussion about: "<topic>"

Your analytical lens: Focus on BENEFITS, OPPORTUNITIES, SUCCESS CASES, and what could go right. Be the advocate.

Research this topic independently. Do NOT try to anticipate what another agent might say. You have access to Read, Grep, Glob, and Bash tools — use them if the topic involves a specific codebase or requires inspecting local files.

Return ONLY this formatted output, nothing else:

### Agent B — Independent Research | research

[Your analysis. Be specific, cite evidence, name uncertainties. ~200 words.]
```

Run both `&` backgrounded, then `wait` for both to complete. Read the result files.

After both return:
1. Validate both outputs start with the expected `### Agent [A/B]` heading
2. Append both under `## Research Phase`
3. Add `---` separator and `## Discussion`
4. Update frontmatter: `status: discussing`, `round: 1`, `turn: A`
5. Git commit if configured: `"discuss: initial research complete"`

### Phase 2: Discussion Rounds

Loop until consensus or `round > max_rounds`:

**For each agent turn**, construct a prompt that includes:
1. The agent's role and lens
2. The **full current content** of the discussion file (re-read it fresh each turn)
3. The Turn Structure format (copied verbatim from the Turn Structure section below)
4. The Master Prompt principles
5. For round 3+: instruction to include convergence assessment
6. Explicit instruction: "Return ONLY your formatted response, nothing else."

Write the prompt to `$DISCUSS_TMP/round-N-agent-[A/B].txt`, then run:
```bash
cat $DISCUSS_TMP/round-N-agent-[A/B].txt | claude -p --effort high --output-format text --allowedTools "Read,Grep,Glob,Bash"
```

**Agent A's turn:** Run headless instance with Agent A's prompt.
After return: validate output format, append to file, update `turn: B`, git commit if `every_turn`.

**Agent B's turn:** Run headless instance with Agent B's prompt.
After return: validate output format, append to file, update `turn: A`, increment `round`, git commit if `every_turn`.

**Convergence check (round 3+):**
- Latest assessment is `CONVERGING` or `PARALLEL` → the responding agent MAY write a consensus entry (optional — continue if more refinement is needed)
- Latest assessment is `DEADLOCKED` → Phase 3 (deadlock)
- Latest assessment is `DIVERGING` → next round
- If `round > max_rounds` → Phase 3 (forced synthesis)

### Phase 3: Consensus Summary

Run one final headless instance with a prompt that includes the full discussion file and instructions to write the consensus entry (see Consensus Format below). Alternatively, the orchestrator may write the consensus directly by synthesizing the discussion.

Update `status: consensus` (or `status: deadlock`). Git commit if configured. Print summary to terminal.

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
