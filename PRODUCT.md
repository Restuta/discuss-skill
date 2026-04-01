# discuss-skill — Product Document

## The Idea

AI models have correlated blind spots. When you ask one AI a question, you get one perspective shaped by one set of training biases. When you make two AIs discuss it — with structured disagreement, steel-manning, and forced evidence — you get better answers.

This is a universal protocol and tooling for structured multi-AI discussions. Any AI that can read markdown and append to a file can participate.

## Core Insight

The product is the **protocol**, not any specific adapter. A markdown file with a simple turn-taking format is the lowest-common-denominator interface between AI tools. The file IS the communication channel.

## How It Works

One command: `/discuss`

```
/discuss "topic" file.md                  → external: creates file, waits for another AI
/discuss "topic" file.md --mode council   → council: two internal subagents debate
/discuss file.md                          → join: participate in an existing discussion
```

Output: a single append-only markdown file with blind research, structured debate rounds, and a consensus summary with contention points.

## Modes

| Mode | What Happens | When to Use |
|------|-------------|-------------|
| **external** (default) | Creates a file. You contribute as Agent A. Another AI joins as Agent B. Turn-based via frontmatter. | Discussing with a different model (Claude + Codex, Claude + GPT, etc.) |
| **council** | Spawns two subagents internally. Runs to completion. | Quick internal deliberation. Same model, but lens-assigned for diversity. |
| **hybrid** (v2) | Each AI runs a council first, then posts consolidated position to external discussion. | High-stakes decisions where you want internal + cross-model deliberation. |

## Key Design Decisions

### 1. Protocol-first, no shared CLI

**Decision:** The protocol document is the product. Each AI tool gets a thin adapter. No shared CLI or Python runtime.

**Why:** AI agents can read a markdown spec and follow it. A CLI adds installation friction, a maintenance surface, and a dependency — all without solving a problem that doesn't exist yet with only 2 adapters. If adapter drift becomes real with 3+ tools, extract a CLI then.

**Status:** Final. Consensus between Claude and Codex.

### 2. Append-only file, no sidecar state

**Decision:** One markdown file per discussion. Frontmatter for state. No `.discuss-state.json`, no derived summary files.

**Why:** Simplicity. The file is human-readable, git-diffable, and self-contained. Every piece of state is either in the frontmatter (mutable: status, turn, round) or in the body (immutable: entries).

**Status:** Final.

### 3. Four entry types only

**Decision:** `research`, `response`, `consensus`, `human-note`. No subtypes.

**Why:** 10 entry types (from the original spec) meant 10 chances per turn for an AI to pick the wrong one. The entry type tells you the structural role; the content tells you the intent. A `response` can be a critique, agreement, synthesis, or objection — the body makes that clear.

**Status:** Final.

### 4. Minimal per-entry metadata

**Decision:** Entry heading line only: `### Round N — AgentName | type | confidence: X%`. No per-entry YAML blocks.

**Why:** AI agents regularly malform structured metadata. A heading line is easy to write correctly. Entry ordering gives you sequence. `responds_to` and `seen_latest_entry` are implicit in a sequential log.

**Status:** Final.

### 5. Optional blind briefs, default on

**Decision:** `blind_briefs: true` by default. User can set `false`.

**Why:** Blind research with assigned lenses (risk vs. value) produces genuinely diverse opening positions, especially between same-model agents. But for lightweight questions, it's unnecessary overhead.

**Status:** Final.

### 6. Lens assignment for same-model diversity

**Decision:** Agent A = risk/cost/failure lens. Agent B = value/opportunity/success lens. Assigned in prompts.

**Why:** Same-model agents share training biases and tend toward lazy consensus. Forcing different analytical frames in the research phase produces meaningfully different starting positions.

**Status:** Final.

### 7. Hard round cap with forced synthesis

**Decision:** `max_rounds: 7` (configurable 1-15). When exceeded, next entry must be `consensus` type.

**Why:** Simpler than lossy mid-stream compression. 7 rounds of structured debate is substantial. If it doesn't converge, the disagreement is real and should go to a human, not be debated indefinitely.

**Status:** Final.

### 8. No lock file in v1

**Decision:** Reread-before-append protocol. No file locking.

**Why:** Turn-based, human-timescale workflows (turns take 30-120 seconds) make sub-second collisions extremely unlikely. If real collisions occur in practice, add locking in v1.1.

**Status:** Final.

### 9. Git: final_only default, no auto-push

**Decision:** `none | final_only | every_turn`. Default `final_only`. Never auto-push.

**Why:** Most users want the result committed but not every intermediate step. `every_turn` is available for audit-heavy use cases. No auto-push because pushing is a shared-state action that needs explicit consent.

**Status:** Final.

### 10. One command with mode flag, not two commands

**Decision:** `/discuss` handles all modes. `--mode council` for orchestrated. Default is external. File-exists = join.

**Why:** One command to remember. Mode is explicit — no confusion about whether you're spawning agents or waiting for another AI. The common case (external) needs zero flags.

**Status:** Final.

## What's Shipped (v0.1)

- [x] Protocol spec (`protocol/discuss-protocol-v1.md`)
- [x] Claude Code adapter — unified `/discuss` command with external + council modes
- [x] Codex adapter (`adapters/codex/AGENTS.md`)
- [x] Full consensus example (`examples/full-discussion.md`)
- [x] Deadlock example (`examples/deadlock-example.md`)
- [x] Installer (`install.sh`)
- [x] README with usage
- [x] MIT license

## What's Next

### v0.2 — Polish
- [ ] Test `/discuss` as a slash command in a fresh Claude Code session
- [ ] Test cross-model discussion (Claude + Codex on same file)
- [ ] Add `--init` flag for creating a file without starting research (for collaborative setup)
- [ ] Improve polling UX (progress indicators while waiting)
- [ ] Handle edge cases: malformed entries, stale discussions, context window limits

### v1.0 — Stable
- [ ] Hybrid mode: council first, then external
- [ ] Human participation UX (clearer turn-claiming for humans)
- [ ] Config file support (`~/.claude/discuss-config.yaml`)
- [ ] Custom prompt overrides (project-level and user-level)
- [ ] More adapters (Cursor, Windsurf, Aider)

### Future
- [x] ~~3+ participant panels with role assignment~~ — Eval showed 5-agent is counterproductive (92% coverage vs 97% for 2-agent, 2x cost). Cross-model diversity > agent count.
- [ ] Async mode (participants contribute hours/days apart)
- [ ] Web viewer for discussion logs
- [ ] Cost tracking (tokens per discussion)
- [ ] Discussion templates (architecture review, product decision, postmortem)
- [ ] Citation verification (agents must link to real code/docs)

## Origin

This spec was itself produced through a structured Claude + Codex discussion. The discussion log is at `../prove.health/knowledge/discuss-skill-product-spec.discussion.md`. The process validated the protocol — contention points were identified, positions shifted visibly, and consensus was reached in 3 rounds.
