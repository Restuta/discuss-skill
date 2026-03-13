---
topic: "Should config values be environment variables or a config file for a small CLI tool?"
blind_briefs: true
max_rounds: 3
git_commit: none
agent_a: "Claude Agent A"
agent_b: "Claude Agent B"
agent_a_lens: "risk/cost/failure"
agent_b_lens: "value/opportunity/success"
status: consensus
turn: A
round: 3
created: 2026-03-13T20:00:00Z
last_updated: 2026-03-13T20:03:00Z
---

# Discussion: Should config values be environment variables or a config file for a small CLI tool?

## Research Phase

### Agent A — Independent Research | research

**Risk analysis of config approaches for small CLI tools:**

**Environment variables — failure modes:**
- Silent misconfiguration: a typo like `MY_TOOL_TMEOUT=30` produces no error; the tool just uses a default. This is the single most common source of env-var bugs in practice.
- No schema validation at load time. You get strings; parsing `"true"` vs `"1"` vs `"yes"` is your problem.
- Discoverability is near zero. Users must read docs to know which vars exist. `env | grep TOOL` is a workaround, not a solution.
- Shell quoting and escaping issues with complex values (paths with spaces, JSON blobs, multi-line certs).
- Per-project config requires wrapper scripts or direnv — additional tooling the user must adopt.

**Config file — failure modes:**
- File-not-found errors on first run if no generation/init command exists.
- Permission and path issues across OS (XDG on Linux, `~/Library` on macOS, `%APPDATA%` on Windows). Getting this right is non-trivial.
- Format choice creates its own risk: TOML/YAML/JSON each have parsing edge cases (YAML's infamous `NO` -> `false` coercion, JSON's lack of comments).
- Merge/override semantics between global and local config files add complexity that small tools rarely need.

**Key uncertainty:** "Small CLI tool" is vague. A tool used by one developer on one machine has very different risk profiles from one distributed to a team. The answer depends heavily on this distinction.

**Cost bottom line:** Env vars have lower implementation cost but higher silent-failure risk. Config files have higher upfront cost but fail loudly and are self-documenting.

### Agent B — Independent Research | research

**Environment variables are the stronger default for a small CLI tool, with a config file as a worthwhile optional addition.**

**Benefits of environment variables as the primary mechanism:**

- **12-Factor App compliance.** The twelve-factor methodology (widely adopted since Heroku popularized it) explicitly recommends config in env vars because they are language- and OS-agnostic, and unlikely to be accidentally checked into version control.
- **Zero-dependency setup.** No file parsing library needed. Every language has native env var access (`os.environ`, `process.env`, `os.Getenv`). This keeps the tool small.
- **CI/CD and container-native.** GitHub Actions, Docker, Kubernetes, and every major CI system have first-class support for injecting env vars. A config file requires mounting or generating the file as an extra step.
- **Composability.** Users can set vars per-invocation (`API_KEY=xxx mytool run`), per-shell session, or per-system. This layering comes free.
- **Secret handling.** Tools like `direnv`, `1Password CLI`, and `doppler` inject secrets as env vars, never writing them to disk.

**Where a config file adds value:**

- When there are more than ~5-7 settings, env var proliferation becomes unwieldy.
- For non-secret, project-specific defaults (e.g., output format, default flags), a `.toolrc` or `config.toml` checked into the repo is convenient.

**Recommended pattern:** env vars take precedence, config file provides defaults, CLI flags override everything. This precedence chain (flags > env > file > built-in defaults) is battle-tested in tools like `kubectl`, `gh`, and `terraform`.

**Key uncertainty:** If the tool's config is deeply nested or relational, env vars flatten poorly and a structured file becomes necessary earlier.

---

## Discussion

### Round 1 — Agent A | response | confidence: 72%

**Response to previous point:**
Agent B's argument is well-structured and the proposed precedence chain (flags > env > file > built-in defaults) is genuinely battle-tested. The strongest part of their case is that env vars are CI/CD-native and zero-dependency — for a small CLI tool, minimizing setup friction matters enormously. I agree that env vars should be a supported input method, and that the kubectl/gh/terraform pattern is the right model.

**New evidence or angle:**
My research highlights a critical gap: env vars fail silently. A typo like `MYTOOL_TMEOUT=30` produces no error — the tool just uses the default. Config files fail loudly (parse errors, unknown keys with schema validation). For a CLI tool where misconfiguration could go unnoticed for weeks in a CI pipeline, this silent-failure risk is underweighted in Agent B's analysis. Additionally, env vars have zero discoverability — there is no `--generate-config` equivalent. New users must read docs to learn what's configurable.

**Current position:**
I lean toward config file as the *primary* store with env var overrides, rather than the inverse. The silent-failure and discoverability costs of env-var-first outweigh the setup simplicity gains, especially as settings grow past 3-4 values. Confidence is 72% because I acknowledge the tradeoff is genuinely close for tools with very few settings.

**Question for Agent B:**
How do you propose handling the silent misconfiguration problem (typos in env var names going undetected) in an env-var-first approach without reimplementing config-file-like validation?

### Round 1 — Agent B | response | confidence: 68%

**Response to previous point:**
The silent misconfiguration argument is genuinely strong. A typo in `MYTOOL_TMEOUT=30` does silently become a no-op, and that failure mode is real. However, this is solvable without inverting the hierarchy: strict prefix matching with unknown-variable warnings. If a tool claims the `MYTOOL_` prefix, any env var matching that prefix but not in the known schema triggers a warning: `"Unknown variable MYTOOL_TMEOUT — did you mean MYTOOL_TIMEOUT?"` Libraries like `envy` (Rust) and `envconfig` (Go) already do this. This gives you validation without requiring a config file.

**New evidence or angle:**
Config-file-primary introduces a cold-start problem for CLI tools. A user running `mytool --help` then `mytool run` hits an error demanding a config file that doesn't exist yet. Env vars let you go from install to working in one line. The onboarding friction of config-file-primary is measurable — it's why most successful CLIs (gh, docker, kubectl) start working with zero config files.

**Current position:**
Env vars as default, config file opt-in at complexity threshold. Confidence: 68% (down from ~75%, acknowledging the validation gap is real but addressable).

**Question for Agent A:**
How do you solve the cold-start problem — does your config-file-primary approach require the file to exist before first use, or do you fall through to defaults, and if the latter, how does that differ functionally from env-var-first?

### Round 2 — Agent A | response | confidence: 68%

**Response to previous point:**
B's cold-start question is strong. Honestly, if config-file-primary falls through to sensible defaults, the user experience is identical to env-var-first with defaults — you run the tool and it works. The difference is only where *non-default* values live. I concede this weakens my "config-file-primary" framing, because both approaches have the same cold-start story when defaults are good.

**New evidence or angle:**
B's prefix-matching validation (e.g., `MYCLI_` namespace with fuzzy-match warnings) substantially addresses my discoverability concern. That narrows the real gap to: where do users *persist* non-default config? I'd argue a file is more auditable and version-controllable, but env vars in `.env` or CI secrets achieve the same thing.

**Current position:**
Converging toward B's model: env vars as primary with `MYCLI_` prefix validation, config file opt-in for complex setups. The key is the validation layer — without it, env-var-primary is too fragile.

**Question for Agent B:**
Can we agree on a concrete invariant: env var always beats config file value when both are set (no merge semantics)?

CONVERGING — We effectively agree on the hybrid model; the remaining question is just precedence semantics.

### Round 2 — Agent B | response | confidence: 72%

**Response to previous point:**
A's silent misconfiguration concern is legitimate. I concede that a typo in `MYTOOL_DATABSE_URL` silently falling back to a default is genuinely dangerous. Prefix-matching validation helps but doesn't eliminate this — it catches `MYTOL_DATABASE_URL` but not `MYTOOL_DATABSE_URL`. That's a real gap.

**New evidence or angle:**
I think we've been converging without naming it. A's "config file primary, env var overrides" and my "env vars default, config file opt-in" differ mainly on which source wins when both exist. The real question is precedence, not exclusivity.

**Current position:**
Moving toward A's model: config file as source of truth, env vars as overrides. But the tool should work with zero config files present (using sensible defaults), and `--init` should scaffold the config file. This preserves my cold-start concern while adopting A's discoverability advantage.

**Question for Agent A:**
Can we agree on: defaults → config file → env vars → CLI flags (each layer overriding the previous)?

CONVERGING — We agree on layered config. The remaining delta is precedence ordering, which is resolvable.

---

## Consensus Summary

### Decision
Use a layered config approach with precedence: built-in defaults → config file → environment variables → CLI flags. The tool works out of the box with zero config (sensible defaults). A config file is optional and scaffoldable via `--init`. Env vars use a strict `MYTOOL_` prefix with validation/fuzzy-match warnings for typos. Each layer overrides the previous; no merge semantics.

### Key Contention Points

| # | What We Disagreed On | How It Was Resolved | Who Shifted & Why |
|---|---------------------|--------------------|--------------------|
| 1 | Config file primary vs. env var primary | Synthesized: both are supported in a layered precedence chain. Config file stores persistent defaults; env vars override for CI/deployment. | Both shifted — A conceded env-var-first has the same cold-start story; B conceded config files are more discoverable and auditable. |
| 2 | Silent misconfiguration risk of env vars | Prefix-matching validation (`MYTOOL_` namespace + fuzzy warnings) addresses most cases. Remaining gap (valid-prefix typos) accepted as low-frequency risk. | A conceded — B's validation proposal was concrete and sufficient. |
| 3 | Cold-start friction of config-file-primary | Resolved by making config file optional with sensible defaults + `--init` scaffolding. | A conceded — if defaults work without a file, the cold-start problem disappears. |

### Unresolved Items & Risks
- Prefix-matching doesn't catch all typos (e.g., `MYTOOL_DATABSE_URL` passes prefix check). Accepted as low risk for a small CLI tool.
- Config file format choice (TOML vs. YAML vs. JSON) not discussed. TOML is the pragmatic default for CLI tools (comments, simple syntax, no YAML gotchas).

### Confidence: High
Both agents independently converged on the same layered precedence chain from opposite starting positions. The synthesis captures the best of both approaches: zero cold-start friction (from B) with discoverability and auditability (from A).
