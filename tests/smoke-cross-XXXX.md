---
topic: "Should a new Python project prefer spaces or tabs?"
mode: council
max_rounds: 1
git_commit: none
agent_a: "Claude"
agent_b: "Codex"
agent_a_cli: "claude"
agent_b_cli: "codex"
agent_a_lens: "risk/cost/failure"
agent_b_lens: "value/opportunity/success"
status: consensus
turn: A
round: 2
created: 2026-03-16T00:00:00Z
last_updated: 2026-03-16T12:28:57.857Z
---

# Discussion: Should a new Python project prefer spaces or tabs?

## Key Questions
1. Which choice aligns better with Python ecosystem defaults?
2. Which choice is less risky for collaboration and tooling?
3. Are there any meaningful advantages to the alternative?

## Research Phase

### Agent A — Independent Research | research

**The risk calculus overwhelmingly punishes tabs in Python.**

**Hard failure: Python 3 forbids mixing.** Python 3 raises `TabError` on mixed indentation within a single block. In Python 2, tabs and spaces could silently coexist, creating logic bugs where visually-identical code executed differently. Python 3 made this a hard error — but this *increases* the cost of choosing tabs, because the entire ecosystem has standardized on spaces post-PEP 8, meaning any copy-pasted snippet, Stack Overflow answer, or third-party contribution will likely use spaces and immediately conflict.

**Tooling friction is real.** PEP 8 mandates 4 spaces. `black`, `ruff`, `autopep8`, `isort`, and virtually every Python linter/formatter defaults to spaces. Choosing tabs means fighting defaults on every tool, every CI config, every pre-commit hook. This is ongoing maintenance cost, not a one-time setup.

**Contributor onboarding risk.** New contributors will submit PRs with spaces. Every single one. You'll burn review cycles on whitespace — or you'll get mixed indentation that breaks builds.

**The accessibility argument for tabs** (users can set display width) is legitimate but narrow. Editor soft-tab settings solve this for spaces too, and `.editorconfig` standardizes it.

**Edge case: `makefile`-style heredocs and multiline strings** — tab/space confusion in triple-quoted strings can produce subtle data bugs that pass tests but corrupt output.

**Bottom line:** choosing tabs for a new Python project is swimming against a mass-consensus current. The risk isn't that tabs are technically inferior — it's that the ecosystem will constantly punish the deviation.

### Agent B — Independent Research | research

For a new Python project, the strongest success case is to prefer 4-space indentation. The official Python style guide is explicit: “Use 4 spaces per indentation level,” “Spaces are the preferred indentation method,” and tabs should be used only to stay consistent with existing tab-indented code (PEP 8: https://peps.python.org/pep-0008/). For a greenfield project, that means spaces are the default that best matches the language’s published convention.

What could go right with spaces is mostly about friction reduction. New contributors already expect PEP 8 formatting, so onboarding is easier and code reviews spend less time on editor-specific behavior. Python’s own lexer documentation also supports this choice operationally: tabs are expanded to 8-column boundaries, and mixed indentation can raise `TabError`; the docs further warn that mixing tabs and spaces is unwise for cross-platform compatibility because editors differ in how they handle them (Python lexical analysis: https://docs.python.org/3/reference/lexical_analysis.html). That is a concrete benefit for multi-OS teams and long-lived repos.

The Windows FAQ reinforces the same pattern: it recommends configuring editors to insert spaces, notes that PEP 8 recommends 4 spaces for distributed Python code, and points out this is also the Emacs `python-mode` default (https://docs.python.org/3/faq/windows.html).

Uncertainty: tabs can still work if a project is already tab-based and rigorously consistent. But for a new project, spaces maximize compatibility, predictability, and ecosystem alignment.

---

## Discussion

### Round 1 — Claude | response | confidence: 97%

**Response to previous point:**
Agent B's strongest argument: spaces win not on abstract merit but on *concrete friction reduction* — PEP 8 compliance, zero-config tooling, contributor expectations, and Python's own lexer treating tabs as 8-column boundaries (which surprises anyone expecting 4). This is well-supported and I agree with it fully. The argument isn't "spaces are theoretically better indentation" — it's "the entire Python ecosystem has already made this decision for you, and deviating has measurable ongoing cost."

I have no substantive disagreement with Agent B's position. The evidence converges.

**New evidence or angle:**
One angle neither of us emphasized enough: **`git diff` and `git blame` noise.** If a project ever flips from tabs to spaces (or vice versa), every line in every file shows as changed, destroying blame history and making forensic debugging harder. Choosing spaces from day one avoids this irreversible cost — because if you start with tabs, the pressure to convert will only grow as the project matures and more ecosystem tools assume spaces. Starting with spaces means you'll never face a forced migration. Starting with tabs means you probably will.

**Current position:**
4 spaces, ~97% confidence. The remaining 3% is the accessibility argument for tabs (configurable display width for visually impaired developers), which is real but addressable through editor settings and `.editorconfig` rather than changing the indentation character. I cannot construct a realistic scenario where a *new* Python project benefits from choosing tabs over spaces.

**Question for Agent B:**
Is there any scenario — team composition, tooling constraint, upstream dependency — where you'd recommend tabs for a new Python project, or do you consider this effectively a settled question?

### Round 1 — Codex | response | confidence: 98%

**Response to previous point:**
Claude’s strongest point is that the real downside of tabs is not aesthetics, it is compounding operational cost: the ecosystem has already standardized on 4 spaces, so tabs create avoidable breakage in tooling, copy-pasted examples, and external contributions, and can eventually force a repo-wide migration that destroys `git blame` continuity. I agree with that, and the `git diff` / `git blame` angle is especially persuasive because it turns “we can be consistent with tabs” into a short-term claim that often collapses as a project grows. My synthesis is stronger than “spaces are safer”: spaces are the choice that preserves optionality and avoids future cleanup work.

**New evidence or angle:**
A useful third option is to separate “Python code style” from “all files in the repo.” For `.py` files, spaces should be the rule. For file types with different conventions or requirements, such as `Makefile`s, the repo can still allow tabs where the format demands them. That means a new Python project does not need a blanket ideological stance against tabs; it needs a precise repo policy, usually encoded in `.editorconfig`, that says “spaces for Python, tabs only where required.” This keeps accessibility and file-format edge cases from becoming arguments against the default for Python itself.

**Current position:**
Prefer 4 spaces for a new Python project, ~98% confidence, because it aligns with PEP 8, avoids lexer and tooling surprises, lowers contributor friction, and prevents future migration noise. The remaining uncertainty is not about Python files; it is about whether the final recommendation should explicitly carve out non-Python file exceptions so teams do not overgeneralize the rule.

**Question for Agent A:**
Do you agree the cleanest final recommendation is “spaces for all Python source files, with tabs allowed only in file types that explicitly require them,” rather than framing this as a repo-wide ban on tabs?

---

## Consensus Summary

### Decision
A new Python project should use 4 spaces for indentation in all `.py` files, with tabs permitted only in file types that explicitly require them (e.g., `Makefile`s). This aligns with PEP 8, eliminates tooling and contributor friction, and avoids a future forced migration that would destroy `git blame` history. The recommendation should be encoded in `.editorconfig` for precision.

### Key Contention Points

| # | What We Disagreed On | How It Was Resolved | Who Shifted & Why |
|---|---------------------|--------------------|--------------------|
| 1 | Whether this is purely a Python question or a repo-wide policy question | Codex reframed the recommendation as file-type-specific rather than a blanket ban on tabs; Claude agreed this was the cleaner formulation | Both converged — Claude implicitly treated it as Python-only; Codex made the scoping explicit |
| 2 | Weight of the accessibility argument for tabs | Both acknowledged configurable display width is a real benefit of tabs but agreed it is addressable via editor settings and `.editorconfig` without changing the indentation character for Python files | Neither shifted — both held this was a minor consideration from the start |

### Unresolved Items & Risks
- The final recommendation should explicitly call out `.editorconfig` as the enforcement mechanism, but neither agent specified exact config values — teams should define this during project setup.
- The accessibility benefit of tabs (user-configurable display width) remains a legitimate concern for visually impaired developers; teams with specific accessibility requirements may want to evaluate editor-level accommodations rather than relying solely on spaces.

### Confidence: High
Both agents independently converged at 97–98% confidence with no substantive disagreement on the core recommendation; the only refinement was scoping precision.
