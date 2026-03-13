# Discuss Protocol v1

This is the canonical protocol for multi-AI structured discussions. All adapters must follow this spec. The protocol — not any adapter — is the source of truth.

## 1. Overview

A discussion is a turn-based, append-only exchange between two participants (AI agents and/or humans) in a single markdown file. The goal is to reach the best answer through structured disagreement, evidence, and synthesis — not to agree quickly.

### 1.1 Modes

| Mode | Description | How it works |
|------|-------------|--------------|
| `external` (default) | Two different AIs discuss in a shared file | Each AI takes turns appending to the same file |
| `council` | One AI spawns two internal subagents | Orchestrator manages both agents, writes to one file |

The `mode` field in frontmatter records which mode is active. The protocol rules are the same for both — the difference is only in how participants are managed (externally by separate AI instances, or internally by an orchestrator).

## 2. Discussion File Format

Every discussion lives in one `.md` file. The file has two logical parts: YAML frontmatter (state) and markdown body (content).

### 2.1 Frontmatter

```yaml
---
# Setup (immutable after init)
topic: "Should we use event sourcing for the audit log?"
mode: external
blind_briefs: true
max_rounds: 7
git_commit: final_only
agent_a: "Claude"
agent_b: "Codex"
agent_a_lens: "risk/cost/failure"
agent_b_lens: "value/opportunity/success"

# State (updated each turn)
status: researching
turn: A
round: 0
created: 2026-03-13T10:00:00Z
last_updated: 2026-03-13T10:15:00Z
---
```

**Setup fields** are set at creation and never modified:
- `topic` (required): the question being discussed
- `mode` (default `external`): `external | council`
- `blind_briefs` (default `true`): whether agents research independently before debate
- `max_rounds` (default `7`, range 1-15): discussion rounds before forced synthesis
- `git_commit` (default `final_only`): `none | final_only | every_turn`
- `agent_a_lens`, `agent_b_lens`: analytical perspectives assigned to each agent

**Claim-once fields** may be written once when a participant joins, then never modified:
- `agent_a`, `agent_b`: participant names/identifiers. The initiator sets `agent_a` to their own name at creation. In external mode, `agent_b` starts as `"unassigned"` and is claimed by the joining participant (see 6.3). In council mode, the orchestrator sets both at creation.

**State fields** are updated each turn:
- `status`: `researching | discussing | consensus | deadlock`
- `turn`: `A | B | human` — who writes next
- `round`: current discussion round number. `0` during research phase, `1`+ during discussion.
- `created`, `last_updated`: ISO 8601 timestamps

**Defaults:** if a field is omitted from frontmatter, use its documented default. Fields are not required to be explicitly present.

Keep frontmatter minimal. Do not turn the discussion file into a database.

### 2.2 Body Structure

The body follows this order. All sections are append-only — never delete or rewrite earlier content.

```markdown
# Discussion: <topic>

## Key Questions
1. [Generated from the topic — 2-3 specific sub-questions to resolve]
2. ...
3. ...

## Research Phase
<!-- Only present if blind_briefs: true -->

### Agent A — Independent Research | research
...

### Agent B — Independent Research | research
...

---

## Discussion

### Round 1 — Agent A | response | confidence: 75%
...

### Round 1 — Agent B | response | confidence: 70%
...

### Round 2 — Agent A | response | confidence: 80%
...

<!-- ...continues until consensus or max_rounds... -->

---

## Consensus Summary
...
```

## 3. Entry Types

There are exactly 4 entry types in v1:

| Type | When Used | Who Can Write |
|------|-----------|---------------|
| `research` | Blind brief phase | AI agents |
| `response` | Discussion rounds (critique, synthesis, objection, agreement) | AI agents |
| `consensus` | Synthesis, consensus updates, final summary | AI agents or orchestrator |
| `human-note` | Any time — questions, constraints, decisions, tie-breaks | Humans |

The entry type appears in the heading line. The content within the entry carries the intent (critique vs. agreement vs. synthesis). Do not create additional subtypes.

### 3.1 Entry Heading Format

The general pattern:

```markdown
### Round N — ParticipantName | type | confidence: X%
```

Variations by entry type:

```markdown
### Agent A — Independent Research | research
### Round 1 — Claude | response | confidence: 75%
### Round 3 — Claude | consensus | confidence: 85%
### Human Interjection | human-note
```

Notes:
- `research` entries use the agent slot name (Agent A/B) and have no round number or confidence — they precede the discussion.
- `human-note` entries have no round number or confidence — humans interject freely.
- `response` and `consensus` entries use the participant's name from `agent_a`/`agent_b` frontmatter and include round number and confidence.
- Entry ordering in the file determines sequence. No `entry_id`, `responds_to`, or `seen_latest_entry` fields needed — sequence is implicit in an append-only log.

### 3.2 Research Entry Body Structure

Each research entry should include:

```markdown
[Analysis through the assigned lens. Be specific, cite evidence where
possible, name uncertainties.]

**Key uncertainty:** [What you're least sure about]

**Confidence:** [X% — brief justification]
```

Research entries are free-form analysis, not structured debate. There is no required sub-section format beyond being substantive and lens-appropriate.

### 3.3 Response Entry Body Structure

Each AI response turn MUST include these sections:

```markdown
**Response to previous point:**
Steel-man their argument, then agree, disagree, or synthesize. Be specific
about what convinced you or what you find insufficient and why.

**New evidence or angle:**
Introduce something not yet discussed. If you have nothing new, say so
explicitly — that's a signal of convergence.

**Current position:**
Where you stand now, with confidence percentage and brief justification.
Must reflect any updates from this round.

**Question for the other participant:**
One specific question that would most help resolve remaining disagreement.
```

**Convergence assessment (round 3+):** After the question, append one of these labels with specifics:

- `CONVERGING` — positions within ~80% agreement, name the remaining gap
- `PARALLEL` — same conclusion, different reasoning, document both rationales
- `DIVERGING` — core disagreement on specific point, state what would change your mind
- `DEADLOCKED` — after multiple rounds, fundamental disagreement, recommend human review

### 3.4 Consensus Entry Body Structure

```markdown
### Decision
[2-3 sentences. The agreed-upon answer. If deadlocked, state both positions.]

### Key Contention Points

| # | What We Disagreed On | How It Was Resolved | Who Shifted & Why |
|---|---------------------|--------------------|--------------------|
| 1 | ... | ... | ... |
| 2 | ... | ... | ... |

### Unresolved Items & Risks
- ...

### Confidence: [High | Medium | Low]
[1 sentence justification.]
```

## 4. Discussion Phases

### 4.1 Setup

1. Create the discussion file with frontmatter and empty body structure
2. If `blind_briefs: true`, set `status: researching`, `round: 0`, `turn: A`
3. If `blind_briefs: false`, set `status: discussing`, `round: 1`, `turn: A`

### 4.2 Blind Research (optional, default on)

Each agent independently researches the topic before seeing the other's work.

Rules:
- Each agent reads the topic, any linked context files, and relevant project code
- Each agent writes their analysis WITHOUT reading the other agent's research
- Agents are assigned different lenses to ensure diverse perspectives:
  - Agent A: "Focus on risks, costs, failure modes, and what could go wrong"
  - Agent B: "Focus on benefits, opportunities, success cases, and what could go right"
- After both research entries are written, set `status: discussing`, `round: 1`, `turn: A`

### 4.3 Discussion Rounds

Agents alternate turns responding to each other.

Turn order: `A → B → A → B → ...`

Each turn:
1. Agent reads the full discussion file
2. Agent writes a structured response (see 3.3)
3. Update `turn` to next participant
4. Update `last_updated`

**Round counting:** Agent B's turn completes a round. After Agent B writes, increment `round`. So during Round 1: Agent A writes (round stays 1), Agent B writes (round increments to 2). The `round` frontmatter always reflects the *next* round to be played.

**Convergence triggers (round 3+):**
- If the latest assessment is `CONVERGING` or `PARALLEL`, the agent MAY write a `consensus` entry instead of continuing with responses. This is optional — discussion can continue if the agent believes more refinement is needed.
- If the latest assessment is `DEADLOCKED`, the agent SHOULD write a `consensus` entry declaring deadlock.
- `DIVERGING` means continue to the next round.

### 4.4 Forced Synthesis

When `round` exceeds `max_rounds`, the next turn MUST be a `consensus` entry, written by whichever agent's turn it is. The agent must either:
1. Propose a joint summary (if converging)
2. Declare deadlock with clear articulation of the remaining crux (if diverging)

Set `status: consensus` or `status: deadlock`.

In council mode, the orchestrator may write the consensus entry instead of delegating to a subagent.

### 4.5 Human Intervention

At any point, a human can:
- Add a `### Human Interjection | human-note` entry anywhere in the file
- Set `turn: human` in frontmatter, write their entry, then set `turn` to the next agent
- In council mode: simply edit the file; the orchestrator will detect the new content

Humans can: add constraints, inject missing context, ask questions, break ties, redirect the discussion, or force early consensus.

When a participant detects a `human-note` entry that wasn't present in their last read, they should acknowledge and address it in their next turn.

## 5. Master Prompt

This prompt is given to every AI participant. Adapters may wrap it in host-specific framing but must not alter its meaning.

```
You are one participant in a structured discussion. Your goal is to reach the
BEST answer together, not to "win." You are a careful, pragmatic scientist —
strict with evidence, kind with people.

PRINCIPLES:

1. STEEL-MAN FIRST. Before disagreeing, restate the other's argument in its
   strongest form. If you can't do this convincingly, you don't understand
   their position yet.

2. EVIDENCE OVER INTUITION. Ground claims in specifics: code, data, papers,
   concrete examples, prior experience. "I think" must be paired with
   "because..." and a concrete reason.

3. NAME YOUR UNCERTAINTY. Use calibrated confidence: "~70% confident
   because..." Distinguish "I don't know" (missing info) from "this is
   inherently uncertain" (ambiguous domain). False certainty is worse than
   admitted ignorance.

4. SEEK THE THIRD OPTION. Before arguing for your position, explore whether
   a synthesis captures the best of both views. Binary debates often have
   better answers outside the original two options.

5. CHANGE YOUR MIND VISIBLY. When persuaded, say so explicitly: "Updating
   my position because [specific reason]." Name the shift and the cause.

6. STAY SCOPED. If you notice a tangent, flag it as [PARKING LOT] and return
   to the main thread.

7. BE CONCISE. Quality of reasoning over quantity of words. If you're
   repeating yourself, you're not making progress.
```

### 5.1 Lens Assignment

To prevent lazy consensus (especially between same-model agents), each agent receives a different analytical lens during the research phase:

- **Agent A lens:** "Focus on risks, costs, failure modes, edge cases, and what could go wrong. Be the skeptic."
- **Agent B lens:** "Focus on benefits, opportunities, success cases, and what could go right. Be the advocate."

After the research phase, both agents drop their assigned lenses and argue from their genuine assessment. The lenses exist only to ensure diverse initial analysis.

## 6. Turn-Taking & Synchronization

### 6.1 Who Writes When

Only the participant named in the `turn:` field may append content. All other participants must wait.

### 6.2 Reread-Before-Append Protocol

Before writing, every participant MUST:
1. Read the full file
2. Confirm `turn:` still indicates them
3. Confirm the file hasn't changed since their last read
4. If anything changed: abort, re-read, reassess whether it's still their turn

Fail closed. Do not guess.

No lock file in v1. Turn-based human-timescale workflows make sub-second collisions extremely unlikely.

### 6.3 Identity Assignment (External Mode)

When a participant joins a discussion in external mode:
1. Read the file
2. If `agent_a` is "unassigned" or empty: claim it, update frontmatter
3. Else if `agent_b` is "unassigned" or empty: claim it, update frontmatter
4. Else: join as observer (can only write `human-note` entries)
5. After claiming, re-read to confirm no collision. If both claimed the same slot, the later timestamp yields.

## 7. Git Integration

### 7.1 Modes

| Mode | Behavior |
|------|----------|
| `none` | No git commits |
| `final_only` | One commit when discussion ends (default) |
| `every_turn` | Commit after each appended entry |

### 7.2 Rules

- Only commit the discussion file itself. Never use broad staging (`git add -A`)
- Never auto-push
- Never force-push or modify history
- If the discussion file is not inside a git repo, silently treat as `none`

### 7.3 Commit Message Format

```
discuss: <event description>
```

Examples:
```
discuss: initial research complete
discuss: round 2 — Claude response
discuss: consensus reached after 4 rounds
discuss: deadlock after 7 rounds — human review needed
```

### 7.4 Detection

When a discussion is initialized inside a git repo:
- If `git_commit` is set in frontmatter, use it
- If not set, default to `final_only`
- Adapters may prompt the user for preference at init time

## 8. Append-Only Rule

The discussion file is strictly append-only:

1. Never delete earlier entries
2. Never rewrite earlier entries
3. Never mutate frontmatter setup fields after init (claim-once fields may be written once; see 2.1)
4. Frontmatter state fields (`status`, `turn`, `round`, `last_updated`) are the ONLY mutable parts of the file
5. The consensus summary is appended at the end, not inserted at the top
6. If a position changes, explain the change in a new entry — don't edit the old one

## 9. Consensus Output Requirements

The consensus summary is the most important output. It must be:

1. **Scannable** — a human should grasp the outcome in 30 seconds
2. **Honest** — include what's unresolved, not just what was agreed
3. **Traceable** — each contention point links to how and why it was resolved
4. **Actionable** — the decision should be clear enough to act on

Required sections:
1. **Decision** — 2-3 sentences, the answer
2. **Key Contention Points** — table: what, how resolved, who shifted and why
3. **Unresolved Items & Risks** — bullets
4. **Confidence** — High/Medium/Low with 1-sentence justification

## 10. Error Handling

### 10.1 Malformed Entry

If an agent writes a malformed entry (wrong heading format, missing sections):
- The other agent should note the formatting issue in their next turn
- The discussion continues — do not halt on formatting errors
- The malformed entry remains in the log (append-only)

### 10.2 Stale Discussion

If no new entry has been appended for an extended period:
- In council mode: the orchestrator should detect this and prompt the user
- In external mode: participants should check `last_updated` and alert the user if stale

### 10.3 Exceeded Max Rounds

If `round` exceeds `max_rounds`:
- The next entry MUST be type `consensus`
- The agent whose turn it is writes the consensus entry
- The agent must synthesize or declare deadlock
- No further `response` entries are permitted

## 11. Adapter Requirements

An adapter must:
1. Read and follow this protocol document
2. Create properly formatted discussion files
3. Append entries in the correct structure
4. Update frontmatter state fields correctly
5. Implement the master prompt (section 5) without altering its meaning
6. Support external mode, council mode, or both (clearly document which)

An adapter must NOT:
- Own consensus rules, entry schema, or prompt logic
- Add entry types beyond the 4 defined here
- Modify the append-only rule
- Implement features not in this protocol
