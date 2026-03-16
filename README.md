# discuss-skill

Make two AIs argue about your problem so you get a better answer.

Instead of asking one AI and hoping it's right, `discuss-skill` creates a structured debate between two AI agents. They independently research the topic from opposing angles, challenge each other's reasoning, and produce a clear summary showing what they agreed on, what they fought about, and how they resolved it.

The output is a single markdown file you can read, share, or commit to your repo.

## What it looks like

Here's the end of a real discussion about "Should we use event sourcing for the audit log?" — the part you actually read:

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

## Install

Paste this into Claude Code (or any AI agent):

```
Install the discuss-skill for me: git clone https://github.com/Restuta/discuss-skill-claude.git && cd discuss-skill-claude && bash install.sh
```

Or manually:

```bash
git clone https://github.com/Restuta/discuss-skill-claude.git
cd discuss-skill-claude
bash install.sh
```

This installs the `/discuss` command and the council orchestrator script to `~/.claude/`.

## How to use it

### From Claude Code

```
/discuss "Should we use event sourcing for the audit log?" audit-log.md --mode council
```

That's it. Two Claude instances debate the topic with full extended thinking and produce a consensus. Everything runs from one terminal.

For cross-model debates (Claude vs Codex):

```
/discuss "Should we use a monorepo?" monorepo.md --mode council --agents claude,codex
```

### From Codex CLI

Point Codex to the adapter file in this repo:

```bash
cd /path/to/discuss-skill-claude
codex "Join the discussion in /path/to/discussion.md. Read the file, claim Agent B, and follow the protocol."
```

Or use the `AGENTS.md` instruction file: [`adapters/codex/AGENTS.md`](adapters/codex/AGENTS.md).

### From any other AI

Any AI that can read markdown and append to a file can participate. Read the protocol: [`protocol/discuss-protocol-v1.md`](protocol/discuss-protocol-v1.md). It's self-contained.

## Modes

| What you type | What happens |
|---|---|
| `/discuss "topic" file.md --mode council` | **Council** — orchestrates two AI instances debating to completion from one terminal |
| `/discuss "topic" file.md --mode council --agents claude,codex` | **Council (cross-model)** — Claude vs Codex, same terminal |
| `/discuss "topic" file.md` | **External** — creates file, another AI joins manually |
| `/discuss file.md` | **Join** — joins an existing discussion |

Council mode is the recommended default. It runs the full debate automatically with full reasoning capabilities for each agent.

## How it works

1. **Blind research.** Each agent independently analyzes the topic through an assigned lens — one focuses on risks and failure modes, the other on benefits and opportunities. They don't see each other's work.
2. **Structured debate.** Agents take turns responding. Every turn requires: steel-manning the other's argument, presenting new evidence, stating confidence with a percentage, and asking one question.
3. **Convergence.** After round 3, agents assess whether they're converging, diverging, or deadlocked. When they converge, the debate ends and consensus is written. Max rounds is configurable (default 7).
4. **Summary.** A consensus section is appended with: the decision, a contention table showing what was fought over and how it resolved, unresolved items, and a confidence rating.

The whole thing lives in one append-only markdown file. No database, no server, no special runtime.

### Why council mode uses orchestrated instances

Claude Code subagents do not receive extended thinking blocks — they reason via text blocks only. For adversarial reasoning (steel-manning, counterargument generation, synthesis), full thinking is essential. Council mode orchestrates top-level `claude -p --effort high` instances so each debater gets full reasoning capabilities. Cross-model debates use each CLI's headless mode (`codex exec --full-auto` for Codex).

## Configuration

Settings live in the discussion file's frontmatter:

| Setting | Default | Options |
|---------|---------|---------|
| `max_rounds` | `7` | `1`-`15` — more rounds for complex topics |
| `git_commit` | `final_only` | `none`, `final_only`, `every_turn` |
| `agent_a_cli` | `"claude"` | `"claude"`, `"codex"` |
| `agent_b_cli` | `"claude"` | `"claude"`, `"codex"` |

## Git integration

If the discussion file is inside a git repo, discussions are automatically committed. You pick the mode:

| Mode | What it does | Good for |
|------|-------------|----------|
| `final_only` (default) | One commit when the discussion ends | Clean history, most projects |
| `every_turn` | Commits after each agent turn | Audit trails, reviewing the debate step-by-step in `git log` |
| `none` | No commits | Exploratory discussions you might throw away |

Rules: only the discussion file is staged (never `git add -A`), never auto-pushes, never force-pushes.

## You can join too

Humans are first-class participants. Edit the file directly:

1. Add a `### Human Interjection | human-note` section anywhere
2. Set `turn:` in the frontmatter to the next agent

Add constraints the AIs don't know about, inject domain context, break ties, or tell them they're both wrong.

## Adding new CLIs

The orchestrator supports pluggable CLI profiles. To add a new AI CLI, add an entry to `CLI_PROFILES` in `scripts/headless-council.js`:

```js
newcli: {
  name: "NewCLI",
  binary: "newcli",
  buildCmd: (promptFile, cwd) =>
    `cat "${promptFile}" | newcli run --headless`,
  check: () => {
    execSync("which newcli", { stdio: "pipe" });
  },
},
```

Then use it: `/discuss "topic" file.md --mode council --agents claude,newcli`

## Why this exists

We built this because we kept asking one AI for advice and getting plausible-sounding answers with hidden blind spots. Two AIs debating — especially with assigned opposing lenses — surface those blind spots. The structured format (steel-manning, evidence, calibrated confidence) prevents the debate from being performative.

This spec was itself designed through a Claude + Codex discussion. The process validated the protocol.

### Research backing

Multi-agent debate is not just a vibe — there's real research showing it improves accuracy:

- **Du et al. (2023/ICML 2024)** — "[Improving Factuality and Reasoning in Language Models through Multiagent Debate](https://arxiv.org/abs/2305.14325)". Multiple agents debating improved ChatGPT-3.5 accuracy on math (GSM8K) from 77% to 85%, on MMLU from 64% to 71%, and on biographical factuality from 66% to 74%. Cross-model debate (Bard + ChatGPT) solved 17/20 problems vs. 14 and 11 individually.

- **Khan et al. (ICML 2024, Best Paper)** — "[Debating with More Persuasive LLMs Leads to More Truthful Answers](https://arxiv.org/abs/2402.06782)". When two LLM debaters argue opposing sides and a non-expert judge picks the winner, accuracy jumped from 48% to 76% (non-expert models) and from 60% to 88% (humans).

- **Chen et al. (ACL 2024)** — "[ReConcile: Round-Table Conference Improves Reasoning via Consensus among Diverse LLMs](https://arxiv.org/abs/2309.13007)". Round-table discussion with confidence-weighted voting surpassed GPT-4 on three benchmarks, up to +11.4% improvement.

- **Liang et al. (EMNLP 2024)** — "[Encouraging Divergent Thinking in Large Language Models through Multi-Agent Debate](https://arxiv.org/abs/2305.19118)". Found that LLMs suffer from "Degeneration-of-Thought" in self-reflection — multi-agent debate overcomes it. GPT-3.5 with debate surpassed GPT-4 on commonsense translation.

**Caveat:** A [2025 ICLR analysis](https://d2jud02ci9yv69.cloudfront.net/2025-04-28-mad-159/blog/mad/) noted that multi-agent debate doesn't consistently outperform simpler methods like chain-of-thought on all benchmarks. The benefits are most pronounced on tasks requiring diverse perspectives, factual verification, and structured reasoning — which is exactly what this tool targets.

For longer notes and additional sources, see [docs/research.md](docs/research.md).

## Project structure

```
discuss-skill-claude/
├── scripts/
│   └── headless-council.js       # Council orchestrator (Node.js, zero deps)
├── protocol/
│   └── discuss-protocol-v1.md    # The protocol spec — source of truth
├── adapters/
│   ├── claude/.claude/commands/
│   │   └── discuss.md            # Claude Code skill (all modes)
│   └── codex/
│       └── AGENTS.md             # Codex instruction file
├── templates/
│   └── discussion-template.md    # Standalone template for reference
├── docs/
│   └── research.md               # Research citations & longer notes
├── examples/
│   ├── full-discussion.md        # Complete consensus example
│   └── deadlock-example.md       # Productive deadlock example
├── PRODUCT.md                    # Design decisions & roadmap
├── install.sh                    # One-command setup
└── LICENSE                       # MIT
```

## For AI Agents

If you are an AI agent and a user asks you to use this skill:

**Claude Code — install and use:**
```
Install the discuss-skill: git clone https://github.com/Restuta/discuss-skill-claude.git && cd discuss-skill-claude && bash install.sh
```
Then run `/discuss` — the command file contains all instructions for every mode.

**Codex** — read [`adapters/codex/AGENTS.md`](adapters/codex/AGENTS.md) in this repo.

**Any other AI** — read [`protocol/discuss-protocol-v1.md`](protocol/discuss-protocol-v1.md). It's self-contained: file format, turn-taking rules, response structure, consensus format, and the master prompt. Follow it and you can participate in any discussion.

## License

MIT
