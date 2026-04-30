---
topic: "Should a new Python project prefer spaces or tabs?"
mode: council
max_rounds: 1
git_commit: none
agent_a: "Claude"
agent_b: "Claude"
agent_a_cli: "claude"
agent_b_cli: "claude"
agent_a_lens: "risk/cost/failure"
agent_b_lens: "value/opportunity/success"
status: consensus
turn: A
round: 2
created: 2026-03-16T00:00:00Z
last_updated: 2026-03-16T12:21:57.570Z
---

# Discussion: Should a new Python project prefer spaces or tabs?

## Key Questions
1. Which choice aligns better with Python ecosystem defaults?
2. Which choice is less risky for collaboration and tooling?
3. Are there any meaningful advantages to the alternative?

## Research Phase

### Agent A — Independent Research | research

**The risk calculus overwhelmingly penalizes tabs in Python.**

**Hard failure mode — Python 3 rejects mixed indentation.** Python 3 raises `TabError` on mixed tabs and spaces within a single block (PEP 8, Python docs §2.1.8). A single contributor's editor misconfiguration silently introduces a mix, and the code fails at parse time — not at the offending line, but at the *next* indentation change, making debugging non-obvious.

**Tooling fragility.** Core ecosystem tools assume 4-space indentation: `black` (the dominant autoformatter) enforces spaces and has no tab mode. `isort`, `flake8`, `pycodestyle` (E101/W191) all flag tabs by default. Choosing tabs means fighting your linter config from day one or disabling checks that catch real bugs.

**Collaboration cost.** PEP 8 mandates 4 spaces. Every `git diff`, GitHub PR review, and CI pipeline renders tabs at platform-default width (often 8), producing unreadable diffs. New contributors familiar with Python conventions will default to spaces, creating merge friction.

**Edge cases:** heredoc strings, `textwrap.dedent`, YAML generation, and Makefile interop (which *requires* tabs) create boundary zones where indentation semantics clash. Spaces give consistent byte-width; tabs do not.

**The one legitimate tab advantage** — accessibility (configurable display width for visually impaired developers) — is real but addressable via editor settings without changing the source encoding.

**Bottom line:** tabs in Python are a latent defect generator with ecosystem-wide friction.

### Agent B — Independent Research | research

**Spaces (4-space indent) are the clear winner for new Python projects.** The evidence is overwhelming:

**PEP 8 alignment.** Python's official style guide explicitly recommends 4 spaces. Following PEP 8 from day one means zero friction with linters (`flake8`, `pylint`), formatters (`black`, `autopep8`, `ruff format`), and CI pipelines. Black — now the de facto standard formatter — enforces spaces with no option for tabs.

**Ecosystem consistency.** The Python standard library uses spaces. Django, Flask, FastAPI, SQLAlchemy, NumPy, pandas — virtually every major library uses spaces. CPython's own C code style guide switched to spaces. A new project using spaces can copy/paste from documentation, tutorials, and Stack Overflow answers without indent mismatches.

**Tooling success cases.** Projects adopting `ruff` or `black` on day one report near-zero style bikeshedding in code review. Spaces are the non-negotiable default in both. This is a solved problem — choosing spaces means you inherit battle-tested tooling for free.

**Collaboration upside.** GitHub, GitLab, and most code review tools render spaces consistently. Mixed-indent bugs (the `TabError` exception) become impossible. Onboarding new contributors is frictionless because spaces match every Python tutorial written in the last decade.

**Key uncertainty:** Teams with strong accessibility needs (e.g., developers using braille displays) may benefit from tabs' configurable width — a legitimate but niche consideration.

---

## Discussion

### Round 1 — Agent A | response | confidence: 97%

**Response to previous point:**
Agent B's strongest claim: choosing spaces means you inherit the entire Python tooling ecosystem — black, ruff, flake8, autopep8 — with zero configuration. This isn't just convenience; it's a *structural cost elimination*. Every hour not spent fighting linter configs or debugging `TabError` in CI is an hour spent on the actual product. I agree fully. There is nothing in B's research I find insufficient — it's the same conclusion arrived at from the opportunity side of the same evidence.

**New evidence or angle:**
One risk worth naming explicitly: the **cost of revisiting this decision later is high**. If a project starts with tabs and later needs to switch (e.g., adopting black, onboarding a contributor who submits spaces), the migration produces a single massive commit that touches every file, pollutes `git blame`, and makes bisecting regressions across that boundary painful. Starting with spaces eliminates this migration risk entirely because there is no plausible future where the Python ecosystem shifts to tabs. The arrow of tooling standardization points one direction only.

**Current position:**
Spaces, 4-indent, enforced by an autoformatter (black or ruff) from commit zero. Confidence 97% — the 3% residual is the accessibility edge case, which I believe is real but best solved at the editor/display layer rather than the source encoding layer.

**Question for Agent B:**
Do you see *any* scenario where a new Python project in 2026 should choose tabs — even a narrow one — or are we at full convergence?

### Round 1 — Agent B | response | confidence: 98%

**Response to previous point:**
Agent A's strongest contribution is the **irreversibility argument**: migrating from tabs to spaces later produces a blame-polluting mega-commit with real bisection costs, while the reverse migration (spaces to tabs) would never be needed because the ecosystem trajectory is unidirectional. This is the most compelling framing I've seen — it reframes the choice not as "spaces vs. tabs" but as "reversible vs. irreversible decision," and spaces are the only reversibility-safe option. I fully agree and have nothing to challenge in A's analysis.

**New evidence or angle:**
I think we've reached full convergence on the core question, so let me directly answer A's question: **No, I cannot construct a credible scenario where a new Python project in 2026 should choose tabs.** The accessibility argument — the strongest remaining case for tabs — has been effectively decoupled from the source-encoding question by modern editors and IDE features (VS Code's `editor.tabSize`, configurable indent guides, elastic tabstops plugins). A visually impaired developer can set their editor to render 4 spaces at any visual width they prefer. The accommodation happens at the display layer without imposing encoding constraints on the team.

One additional positive framing worth naming: choosing spaces is a **decision-elimination benefit**. By aligning with PEP 8, black, and ruff defaults, the team removes indentation from the decision space entirely. This is an underappreciated form of value — every convention question that never gets asked is cognitive overhead that never gets spent. New Python projects in 2026 should treat "4 spaces, enforced by ruff/black" not as a style choice but as a **default that requires justification to override**, similar to "use UTF-8" or "use git."

**Current position:**
Spaces (4-indent), enforced by autoformatter from the first commit. Confidence 98% — the 2% is not allocated to tabs being correct but to the possibility I'm overlooking an exotic deployment context (e.g., embedded MicroPython on storage-constrained devices where tab = 1 byte vs. 4 bytes) that I haven't researched. Even there, I suspect spaces still win on tooling grounds.

**Question for Agent A:**
Given full convergence, is there value in our synthesis naming the **one concrete action** beyond "use spaces" — namely, adding a formatter to pre-commit hooks at project init — as the real recommendation? The indentation question is settled; the implementation mechanism is where teams still sometimes fail to follow through.

---

## Consensus Summary

### Decision
A new Python project should use 4-space indentation, enforced by an autoformatter (black or ruff) from the first commit. This aligns with PEP 8, the entire Python tooling ecosystem, and eliminates indentation as a source of friction, bugs, or future migration cost. The recommendation should be treated not as a style preference but as a ecosystem default that requires justification to override.

### Key Contention Points

| # | What We Disagreed On | How It Was Resolved | Who Shifted & Why |
|---|---------------------|--------------------|--------------------|
| 1 | No substantive disagreement arose | Both agents independently reached the same conclusion from complementary lenses (risk vs. opportunity) | Neither shifted — convergence was immediate |
| 2 | Whether any edge case (accessibility, storage constraints) justifies tabs | Both agreed accessibility is real but best solved at the editor/display layer, not source encoding | Mutual agreement; no shift needed |
| 3 | Whether the recommendation should extend beyond "use spaces" to "enforce via pre-commit hooks" | Agent B proposed this as the actionable implementation step; Agent A implicitly agreed by advocating formatter enforcement "from commit zero" | Convergence on implementation, not just principle |

### Unresolved Items & Risks
- Exotic deployment contexts (e.g., MicroPython on storage-constrained devices) were acknowledged but not researched — tabs' 1-byte-vs-4 advantage may matter there, though tooling friction likely still favors spaces
- The specific choice between black and ruff as the enforcing formatter was not adjudicated, though both enforce spaces and either suffices

### Confidence: High
Both agents converged independently at 97-98% confidence with no contested points; the Python ecosystem's standardization on spaces is effectively settled fact.
