---
topic: "A B2B SaaS company (50-person engineering org, 8 teams) is experiencing growing pains with their 35 polyrepos. Cross-repo changes require coordinated PRs across 3-5 repos, dependency versions drift, and shared libraries are copy-pasted. Should they migrate to a monorepo?"
mode: "council"
agent_count: "2"
agent_config: "2-agent"
max_rounds: "5"
git_commit: "none"
agent_cli: "codex"
status: consensus
turn: B
round: 3
created: "2026-04-01T12:28:32.864Z"
last_updated: 2026-04-01T12:33:59.440Z
agent_A_name: "Advocate"
agent_A_cli: "codex"
agent_A_role: "advocate"
agent_B_name: "Skeptic"
agent_B_cli: "codex"
agent_B_role: "skeptic"
---

# Discussion: A B2B SaaS company (50-person engineering org, 8 teams) is experiencing growing pains with their 35 polyrepos. Cross-repo changes require coordinated PRs across 3-5 repos, dependency versions drift, and shared libraries are copy-pasted. Should they migrate to a monorepo?

## Participants
- **Agent A** — Advocate (advocate) via codex
- **Agent B** — Skeptic (skeptic) via codex

## Key Questions
1. What is the actual migration cost and risk for 35 repos with active development?
2. Which problems are best solved by monorepo, and which have simpler solutions (better tooling, stricter dependency management)?
3. What organizational changes does a monorepo require (CI/CD, code ownership, merge process)?
4. Is there an incremental path, or is this all-or-nothing?

## Research Phase

### Agent A (Advocate) — Independent Research | research

The strongest pro-monorepo signal here is not “35 repos”; it is the company’s change topology. If ordinary product work already requires 3 to 5 coordinated PRs, version bumps, and hand-managed sequencing, the org is paying a compounding coordination tax every sprint. That is exactly the failure mode modern monorepo tooling is built to remove. Vercel’s own monorepo/polyrepo training uses a simpler 4-repo shared-component example and frames the polyrepo cost as “multiple PRs, version coordination, CI runs,” while the monorepo alternative is “1 commit, atomic changes,” with TypeScript verification across producers and consumers in one place ([Vercel](https://vercel.com/academy/production-monorepos/monorepos-vs-polyrepos)). Your scenario is already worse than their teaching example, which is a strong signal that the current repo boundary map no longer matches the product architecture.

The upside is substantial. A monorepo turns cross-repo changes into normal refactors: change the API contract, update downstream consumers, run one dependency graph, merge once. Nx’s documentation is unusually direct here: the benefits are “shared code and visibility,” “atomic changes,” “developer mobility,” and a “single set of dependencies” ([Nx](https://nx.dev/docs/concepts/decisions/why-monorepos)). For this company, that translates into concrete wins: copied libraries become shared internal packages; auth, API clients, design system primitives, lint/type/build config, and observability wrappers become single-source assets instead of drifting variants. Vercel’s monorepo examples show the exact mechanism: shared packages replace “Copy 1 / Copy 2 / Copy 3,” and internal dependencies can use `workspace:*`, meaning all apps resolve the workspace version and stay in sync automatically ([Vercel shared packages](https://vercel.com/academy/microfrontends-on-vercel/shared-packages-introduction)). That directly attacks your stated problems: dependency drift and copy-paste reuse.

The usual fear is that a monorepo trades coordination pain for slower CI. Modern tooling makes that a solvable problem rather than a structural blocker. Nx documents that “affected” commands determine the minimum set of changed projects and only run tasks there, which “drastically improves” CI speed and compute usage; the same docs recommend pairing that with remote caching and distributed execution ([Nx affected](https://nx.dev/docs/features/ci-features/affected)). Vercel’s current monorepo guidance says the same thing in simpler language: coordinated builds happen in dependency order, and remote caching skips builds that have not changed ([Vercel monorepo setup](https://vercel.com/academy/microfrontends-on-vercel/monorepo-setup)). So the upside scenario is not “one giant repo where everything rebuilds”; it is one repository with a precise project graph, selective CI, and a single lockfile.

There are real success precedents. Google still describes its monorepo as a “common source of truth” for tens of thousands of developers ([Google Research](https://research.google/pubs/why-google-stores-billions-of-lines-of-code-in-a-single-repository/)). Meta says breaking up its monorepo was “out of the question” because it would lose “simplified dependency management” and the ability to make “broad changes quickly” ([Meta Sapling](https://engineering.fb.com/2022/11/15/open-source/sapling-source-control-scalable/)). Vercel says all 12 of its microfrontend projects live in one monorepo with shared packages for headers, footers, and design systems ([Vercel monorepo setup](https://vercel.com/academy/microfrontends-on-vercel/monorepo-setup)). Those are not proofs that every migration succeeds, but they are credible evidence that the model works when the core problem is coordination across related codebases.

My advocate conclusion: yes, they should seriously pursue a monorepo, because the best-case outcome is not marginal improvement. It is a structural reset: one PR instead of five, one dependency policy instead of drift, one reusable library instead of clones, faster platform refactors, and higher engineering leverage per team. The main uncertainty is not whether monorepos can work; it is whether this company will adopt the accompanying discipline: graph-aware CI, enforced boundaries, CODEOWNERS, and a phased migration starting with the highest-churn shared repos. If they do, this looks like the kind of org that can get a large payoff.

### Agent B (Skeptic) — Independent Research | research

The skeptical case is: a monorepo can solve your current pain, but it can also concentrate it. Google’s famous success story is not “move to one repo and win”; it is “a custom-built monolithic source repository plus the systems and workflows that make it feasible” ([Google Research](https://research.google/pubs/why-google-stores-billions-of-lines-of-code-in-a-single-repository/)). That matters because a 50-person org usually does not have Google’s platform investment budget. If you migrate without first funding build graphing, cacheing, ownership rules, release automation, and repo ergonomics, you risk replacing 35 smaller coordination problems with one large shared bottleneck.

The first failure mode is CI and build blast radius. Official Nx docs say monorepo workspaces eventually need “affected” execution because re-testing everything becomes too slow, but they also warn that changing a heavily used project can still affect “almost all the projects in the workspace,” and that this is best paired with remote caching and distributed execution ([Nx Affected](https://nx.dev/docs/features/ci-features/affected)). In other words: the common optimistic pitch, “only changed projects rebuild,” is incomplete. Shared libraries are exactly the thing most likely to fan out across the graph. If your current pain involves cross-repo changes across 3-5 repos, a monorepo may turn that into frequent whole-workspace CI pressure unless you stand up serious task orchestration.

The second risk is architectural entropy. Nx’s own docs are blunt: if projects in a monorepo can depend on each other freely, “chaos will ensue, and the workspace will become unmanageable” ([Nx module boundaries](https://nx.dev/docs/features/enforce-module-boundaries)). Their code ownership guidance also warns that code sharing can backfire: other teams can add complexity to code your team owns, or start depending on internal APIs and lock you in ([Nx code ownership](https://nx.dev/docs/concepts/decisions/code-ownership)). So copy-paste may decline, but only if you actively govern shared code. Otherwise you get a different anti-pattern: easy internal imports, hidden coupling, and every “shared” package becoming a political hotspot.

Third, release/versioning pain does not disappear; it changes shape. Lerna’s docs note that in fixed-version mode, a major change in one package can force a new major version for all affected packages ([Lerna](https://lerna.js.org/docs/features/version-and-publish)). pnpm’s workspace docs warn that, by default, dependency resolution can fall back to the registry if local versions do not match, which “introduces some uncertainty” unless you enforce `workspace:` ranges ([pnpm](https://pnpm.io/workspaces) or mirror result surfaced via docs search). So a monorepo reduces repo-to-repo drift, but you still need strict internal package policies, release grouping, and tooling discipline.

Fourth, developer experience and governance can get worse before they get better. Git has sparse checkout and partial clone because very large repos are genuinely painful; official Git docs say large clones can take “hours (or days)” and consume “100+GiB,” and `git sparse-checkout` itself warns its behavior is experimental and changes command behavior ([partial clone](https://www.kernel.org/pub/software/scm/git/docs/technical/partial-clone.html), [sparse-checkout](https://www.kernel.org/pub/software/scm/git/docs/git-sparse-checkout.html)). On GitHub, branch protection and CODEOWNERS become more critical, but also more operationally fragile: required status checks can block merges if job names collide, and code owners must have write permission to the repository ([protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)). In a monorepo, one misconfigured rule can stall everyone.

My bottom line: a monorepo is risky if this org wants the benefits without paying the platform tax. The downside scenario is a 6-12 month migration that standardizes paths but not behavior: slower CI, broader blast radius, more permission complexity, and no real reduction in coupling. Uncertainty: if these 35 repos are mostly one language/runtime, share build tooling already, and the company is willing to fund 2-4 engineers on developer platform, the risk drops materially. If not, skepticism is warranted.

---

## Discussion

### Round 1 — Advocate | response | confidence: 74%

**Response to previous points:**
Agent B’s strongest point is that monorepo benefits are not free; without graph-aware CI, caching, ownership, and boundary enforcement, the company could centralize pain instead of removing it. I agree with that risk model. Where I disagree is the implied conclusion. The decisive signal here is not “35 repos,” it is that normal work already spans 3-5 coordinated PRs. That means the current repo boundaries are already misaligned with how the system changes. In that situation, better polyrepo hygiene is likely a partial mitigation, not a fix. The synthesis is: do not migrate all 35 repos blindly; migrate the highest-churn, tightly coupled repos first, and treat CI/platform investment as part of the migration decision, not a later cleanup step.

**New evidence or angle:**
A missing angle is the distinction between change boundaries and deploy boundaries. They do not need a monolith to get monorepo benefits. Services can remain independently deployed while sharing one source graph, one lockfile, and one refactor surface. That matters because the stated pain is source-change coordination, version drift, and shared-code duplication, not necessarily runtime co-location. So the real choice is not “polyrepo vs giant app”; it is “polyrepo vs unified source control with explicit package/service boundaries.”

**Current position:**
They should move toward a monorepo incrementally, not via a big-bang migration. Confidence: 74% because the pain described maps directly to monorepo strengths, and the strongest objections Agent B raised are mostly prerequisites and execution risks, not evidence that the current repo model still fits the architecture.

**Key question for the group:**
What subset of 8-12 repos accounts for most of the 3-5-repo coordinated changes today, and could that slice be migrated first to test whether the coordination tax actually drops?

### Round 1 — Skeptic | response | confidence: 68%

**Response to previous points:**
Agent A’s strongest argument is the change-topology point: if ordinary work routinely needs 3-5 coordinated PRs, the repo boundaries no longer match the system’s real seams. I agree that this is the most compelling pro-monorepo fact in the prompt, and I also agree with A’s distinction between change boundaries and deploy boundaries; independent deployment does not require polyrepos. Where I still disagree is on decision timing: that symptom shows the current model is failing, but not yet that a 35-repo migration is the best fix. The main open question is whether the pain is concentrated in a small, same-toolchain cluster that can be unified cheaply, or spread across heterogeneous systems where a monorepo mostly adds platform overhead.

**New evidence or angle:**
A repo is also an access-control and operational boundary, not just a code boundary. If some of these 35 repos exist because of different languages, compliance constraints, ownership models, or release cadences, collapsing them into one source tree can create new friction even if builds are graph-aware. That pushes me toward a third option: a staged “multi-package core repo” for the 8-12 tightly coupled repos, while keeping stricter package/version governance for the rest, instead of an immediate company-wide monorepo.

**Current position:**
I’m leaning toward an incremental partial migration, not a blanket monorepo decision. Confidence: 68% because Agent A has shown the current coordination tax is probably structural, but the migration cost is still unbounded and the platform prerequisites remain the deciding variable.

**Key question for the group:**
In the last 90 days, what fraction of cross-repo changes came from the same 8-12 repos with the same language/build stack, and would leadership fund dedicated platform ownership for CI, boundaries, and release automation for that slice?

### Round 2 — Advocate | response | confidence: 78%

**Response to previous points:**
Agent B’s strongest point is that the real risk is not “monorepo” in the abstract, but paying migration cost without paying the platform tax that makes it work: affected CI, caching, ownership, and boundary enforcement. I agree, and that has shifted my position in one important way: I no longer think the right decision is “migrate the company to a monorepo”; I think it is “run a bounded monorepo pilot on the tightly coupled same-stack slice.” That synthesizes B’s caution with my earlier point that the current 3-5-PR change pattern is structural evidence the existing boundaries are wrong. If the pain is concentrated in 8-12 repos, staying polyrepo there is already expensive; if it is not concentrated, that is evidence against a broad migration.

**New evidence or angle:**
The missing angle is duplicated platform work. In 35 polyrepos, every improvement to linting, type checks, CI policy, dependency updates, release rules, and security scanning is either repeated repo-by-repo or allowed to drift. A monorepo does not just reduce product-change coordination; it concentrates platform standardization into one place. That means the prerequisites Agent B is worried about are not pure migration overhead, they are also the mechanism for reducing ongoing operational duplication. The practical implication is to compare two costs, not one: migration cost versus the recurring tax of maintaining 35 slightly different engineering systems.

**Current position:**
They should pursue an incremental monorepo migration for the highest-coupling cluster, not commit to a 35-repo end state up front. Confidence: 78% because the prompt’s pain points map directly to monorepo strengths, and Agent B’s objections mostly argue for a narrower, instrumented rollout rather than for preserving the current topology.

**Key question for the group:**
Can leadership identify a same-stack cluster of roughly 8-12 repos that drives most multi-repo changes, and fund a 90-day pilot with explicit success metrics: fewer coordinated PRs, lower dependency drift, and no CI regression?

### Round 2 — Skeptic | response | confidence: 75%

**Response to previous points:**
Agent A’s strongest argument is now the right one: the evidence is not “35 repos,” it is that routine work already crosses 3-5 repos, which means the current source boundaries are misaligned with the real change graph. I agree, and A’s shift from “migrate” to “run a bounded pilot on the same-stack cluster” moves me materially. My view has changed on that point: I no longer think the default answer is “probably stay polyrepo”; I think the default answer is “pilot a monorepo where the coupling is highest, while keeping the rest separate.” My remaining disagreement is about scope and prerequisites. A pilot only tells you something if it includes the real operating model: affected CI, remote caching, CODEOWNERS/boundaries, and independent deploys. Otherwise it is just a file move that avoids the hard part.

**New evidence or angle:**
The hidden cost not yet named clearly is merge-process contention. In polyrepos, eight teams can merge in parallel with partial isolation. In one repo, they share one default-branch lane. If the company keeps the same PR size, review habits, and branch protection style, it can trade cross-repo coordination for a shared merge bottleneck. So the pilot should test not just build speed and dependency drift, but branch throughput: PR lead time, queue time, and revert rate before and after. If those regress, the pilot is failing even if cross-repo changes get easier.

**Current position:**
I support a 90-day pilot monorepo for the top 8-12 tightly coupled, same-stack repos, not an org-wide migration decision yet. Confidence: 75% because Agent A has shown the pain is structural, but the real bet is on platform execution and merge/process discipline, not on directory layout alone.

**Key question for the group:**
Will leadership fund a real pilot up front with named owners and hard success criteria: 2-4 platform engineers, affected CI plus caching plus ownership rules, and explicit thresholds for PR lead time, CI duration, and multi-repo change frequency?

### Round 3 — Advocate | response | confidence: 82%

**Response to previous points:**
Agent B’s strongest point is now the right crux: a monorepo pilot is only valid if it tests the actual operating model, not just directory layout. I agree with B that without affected CI, caching, CODEOWNERS/module boundaries, and branch-throughput measurement, the company could get a false positive or false negative. I also still agree with my earlier point that the current 3-5 coordinated PR pattern is already a throughput problem, just distributed across repos. So the real synthesis is: do not decide “monorepo yes/no” in the abstract; decide whether to fund a real 90-day experiment on the most coupled same-stack slice, with explicit success and failure criteria.

**New evidence or angle:**
The missing angle is reversibility. A pilot that migrates only the top 8-12 tightly coupled repos is a bounded bet, not a one-way door. If the pilot improves cross-repo change friction but hurts CI or merge flow, they can stop at a hybrid model: one multi-package core repo plus remaining independent repos. That materially changes the risk calculus. The question is less “should we commit the whole company to a monorepo?” and more “is the coordination tax high enough to justify a reversible platform experiment?” Given the prompt, I think yes.

**Current position:**
They should run a real monorepo pilot for the highest-coupling 8-12 repos, not approve a 35-repo migration up front. Confidence: 82% because Agent B’s evidence changed my view on scope and prerequisites, but it did not weaken the core case that the current repo boundaries are misaligned with how the system changes.

**Key question for the group:**
Will leadership pre-commit to a pilot charter before any migration starts: exact repos in scope, named platform owners, and numeric go/no-go thresholds for PR lead time, CI p95 duration, and reduction in multi-repo changes?

**Convergence assessment:** CONVERGING — we now largely agree on a bounded monorepo pilot for the tightly coupled slice; the remaining gap is execution discipline: whether leadership will fund the platform work and define hard success thresholds up front.

---

## Consensus Summary

### Decision
They should not commit to migrating all 35 repos into a monorepo up front. The consensus is to run a real, time-boxed monorepo pilot for the 8-12 most tightly coupled, same-stack repos, because the current pattern of routine 3-5 repo changes is strong evidence that the existing source boundaries no longer match how the system evolves. If the pilot improves coordination without degrading CI and merge flow, they can expand or stop at a hybrid model.

### Key Contention Points

| # | What Was Debated | Resolution | Who Had the Strongest Case & Why |
|---|-----------------|------------|----------------------------------|
| 1 | Whether the company’s pain is fundamentally caused by having many repos, or by badly aligned change boundaries | The main signal is not repo count but the fact that ordinary work already requires 3-5 coordinated PRs, version bumps, and sequencing across repos | Advocate, because the change-topology argument best explained why the current structure is imposing recurring coordination tax |
| 2 | Whether the answer should be a full monorepo migration or staying polyrepo with better tooling | Neither extreme won; the agreed path is an incremental pilot for the highest-coupling slice, while leaving the rest separate for now | Skeptic, because the strongest caution was that a blanket 35-repo migration is unjustified without proving the benefits on the same-stack cluster first |
| 3 | Whether monorepo benefits outweigh the platform cost and operational risk | Only if the pilot includes the real operating model: affected CI, remote caching, module boundaries, CODEOWNERS, and independent deploys | Skeptic, because the “platform tax” argument clarified that a file move without supporting systems would produce misleading results |
| 4 | Whether the migration is a one-way strategic commitment | It should be treated as a reversible experiment with explicit go/no-go thresholds and a possible hybrid end state | Advocate, because reframing the move as a bounded, reversible bet materially reduced the perceived migration risk |

### Unresolved Items & Risks
- Which exact 8-12 repos account for most multi-repo changes, and whether they truly share the same language/build stack
- Whether leadership will fund named platform ownership, likely 2-4 engineers, for CI, caching, boundaries, and release automation during the pilot
- The exact success thresholds for PR lead time, CI p95 duration, merge queue time, revert rate, and reduction in multi-repo changes
- The risk that shared-library changes still fan out widely and create CI or merge bottlenecks even inside a monorepo
- The possibility that some repos should remain separate because of heterogeneous tooling, compliance, access-control, or release-cadence differences

### Confidence: High
Both agents converged on the same recommendation by the end: a bounded monorepo pilot for the tightly coupled slice, with disagreement remaining mainly on execution discipline rather than direction.
