# discuss-skill

Make two AIs argue about your problem so you get a better answer.

Instead of asking one AI and hoping it's right, `discuss-skill` creates a structured debate between two AI agents. They independently research the topic from opposing angles, challenge each other's reasoning, and produce a clear summary showing what they agreed on, what they fought about, and how they resolved it.

The output is a single markdown file you can read, share, or commit to your repo.

## What it looks like

Here's the end of a real discussion — the part you actually read:

```markdown
## Consensus Summary

### Decision
Use a simple append-only table with JSON payload column for the audit log
at launch. Design for future event sourcing migration but don't implement
it now.

### Key Contention Points

| # | What We Disagreed On         | How It Was Resolved                      | Who Shifted & Why                   |
|----|------------------------------|------------------------------------------|--------------------------------------|
| 1  | Event sourcing vs. table     | Reframed: depends on multi-consumer need | Codex shifted — no consumers yet     |
| 2  | Event fidelity preservation  | JSON payload column solves it            | Both converged independently         |
| 3  | Migration path documentation | Fast follow, not launch blocker          | Claude proposed, Codex agreed        |

### Confidence: High
Both agents converged from opposite starting positions.
```

Full examples: [consensus](examples/full-discussion.md) | [productive deadlock](examples/deadlock-example.md)

## How to use it

### With Claude Code

Install:
```bash
git clone https://github.com/Restuta/discuss-skill-claude.git
cd discuss-skill-claude
bash install.sh
```

Then in any Claude Code session, one command:

```
/user:discuss "Should we use event sourcing for the audit log?" audit-log.md
```

That's it. It creates the file, does its research, and waits for another AI to join.

Three modes:

| What you type | What happens |
|---|---|
| `/user:discuss "topic" file.md` | **External** (default) — creates file, you contribute as one side, another AI joins as the other |
| `/user:discuss "topic" file.md --mode council` | **Council** — spawns two internal agents that debate and produce a result automatically |
| `/user:discuss file.md` | **Join** — joins an existing discussion that another AI started |

### With OpenAI Codex

No installer needed. Point Codex to `adapters/codex/AGENTS.md` in this repo and tell it to join the discussion file. It reads the protocol and follows it.

### With any other AI

Any AI that can read and write markdown files can participate. Point it at `protocol/discuss-protocol-v1.md` and the discussion file. The protocol is self-contained — the AI reads the rules and follows them.

### Cross-model discussions (the interesting part)

This is where it gets good. Run different models against each other:

**Window 1 (Claude Code):**
```
/user:discuss "Should we rewrite auth in Rust?" auth-rewrite.md
```

**Window 2 (Codex, or another Claude, or anything):**
Point it to `auth-rewrite.md` and tell it to join. Both AIs take turns in the same file.

The file is the protocol. Turn-taking, state, and history are all in the markdown. No server, no coordination layer, just a shared file.

## How it works

1. **Blind research.** Each agent independently analyzes the topic through an assigned lens — one focuses on risks and failure modes, the other on benefits and opportunities. They don't see each other's work.
2. **Structured debate.** Agents take turns responding. Every turn requires: steel-manning the other's argument, presenting new evidence, stating confidence with a percentage, and asking one question.
3. **Convergence.** After round 3, agents assess whether they're converging, diverging, or deadlocked. At round 7 (configurable), they must synthesize or declare deadlock.
4. **Summary.** A consensus section is appended with: the decision, a contention table showing what was fought over and how it resolved, unresolved items, and a confidence rating.

The whole thing lives in one append-only markdown file. No database, no server, no special runtime.

## Configuration

Settings live in the discussion file's frontmatter. Override per-discussion:

| Setting | Default | Options |
|---------|---------|---------|
| `blind_briefs` | `true` | Skip research phase with `false` for lightweight questions |
| `max_rounds` | `7` | `1`-`15` — more rounds for complex topics |
| `git_commit` | `final_only` | `none`, `final_only`, `every_turn` |

## You can join too

Humans are first-class participants. Edit the file directly:

1. Add a `### Human Interjection | human-note` section anywhere
2. Set `turn:` in the frontmatter to the next agent

Add constraints the AIs don't know about, inject domain context, break ties, or tell them they're both wrong. The triadic structure (two AIs + one human) is often the most productive.

## Why this exists

We built this because we kept asking one AI for advice and getting plausible-sounding answers with hidden blind spots. Two AIs debating — especially with assigned opposing lenses — surface those blind spots. The structured format (steel-manning, evidence, calibrated confidence) prevents the debate from being performative.

This spec was itself designed through a [Claude + Codex discussion](https://github.com/Restuta/discuss-skill-claude/blob/main/examples/full-discussion.md). The process validated the protocol.

Based on research showing multi-agent debate improves factual accuracy and reasoning quality (Du et al. 2023, "Improving Factuality and Reasoning in Language Models through Multiagent Debate").

## Project structure

```
discuss-skill-claude/
├── protocol/
│   └── discuss-protocol-v1.md     # The protocol spec — source of truth
├── adapters/
│   ├── claude/.claude/commands/
│   │   └── discuss.md             # Claude Code skill (all modes)
│   └── codex/
│       └── AGENTS.md              # Codex instruction file
├── examples/
│   ├── full-discussion.md         # Complete consensus example
│   └── deadlock-example.md        # Productive deadlock example
├── PRODUCT.md                     # Design decisions & roadmap
├── install.sh                     # One-command setup for Claude Code
└── LICENSE                        # MIT
```

The protocol document is the product. Adapters are boring glue. If a new AI tool appears tomorrow, it participates by reading the protocol — no code changes needed.

---

## For AI Agents

If you are an AI agent being asked to participate in a discussion using this skill, read this section.

### Quick orientation

1. Read `protocol/discuss-protocol-v1.md` — it contains all the rules you need to follow
2. The discussion file (the `.md` file the user pointed you to) contains the current state in YAML frontmatter and the full conversation history in the body
3. You are append-only — never delete or rewrite earlier entries

### Joining a discussion

1. Read the discussion file
2. Check the `agent_a` and `agent_b` fields in frontmatter — claim the first unassigned slot
3. Check `status` and `turn` to know what to do:
   - `status: researching` + your turn → write your blind research using your assigned lens
   - `status: discussing` + your turn → write a structured response (steel-man, evidence, confidence, question)
   - `status: discussing` + not your turn → wait and poll the file for changes
   - `status: consensus` or `deadlock` → discussion is over, display the summary
4. After writing, update `turn` to the next participant and `last_updated`

### Response format

Every discussion turn must use this heading and structure:

```markdown
### Round N — YourName | response | confidence: X%

**Response to previous point:**
Steel-man their argument, then agree/disagree/synthesize.

**New evidence or angle:**
Something not yet discussed. If nothing new, say so.

**Current position:**
Updated position with confidence % and justification.

**Question for [other participant]:**
One specific question to resolve disagreement.
```

### Key rules

- **Steel-man first** — restate the other's argument in its strongest form before responding
- **Evidence over assertion** — ground claims in specifics
- **Calibrated confidence** — use percentages, not vague hedging
- **Change your mind visibly** — say what shifted and why
- **Stay scoped** — flag tangents as `[PARKING LOT]`, don't chase them
- **Round 3+** — end with convergence assessment: `CONVERGING / PARALLEL / DIVERGING / DEADLOCKED`
- **Round > max_rounds** — you must write a `consensus` entry, no more responses allowed

### Consensus format

```markdown
## Consensus Summary

### Decision
[2-3 sentences]

### Key Contention Points
| # | What We Disagreed On | How It Was Resolved | Who Shifted & Why |
|---|---------------------|--------------------|--------------------|
| 1 | ... | ... | ... |

### Unresolved Items & Risks
- ...

### Confidence: [High | Medium | Low]
[1 sentence justification]
```

### Full protocol

Read `protocol/discuss-protocol-v1.md` for the complete specification including file format, entry types, git behavior, and synchronization rules.

## License

MIT
