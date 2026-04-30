---
topic: "A B2B SaaS company (50-person engineering org, 8 teams) is experiencing growing pains with their 35 polyrepos. Cross-repo changes require coordinated PRs across 3-5 repos, dependency versions drift, and shared libraries are copy-pasted. Should they migrate to a monorepo?"
mode: "council"
agent_count: "3"
agent_config: "3-agent"
max_rounds: "5"
git_commit: "none"
agent_cli: "codex"
status: consensus
turn: B
round: 3
created: "2026-04-01T09:00:15.192Z"
last_updated: 2026-04-01T09:07:38.592Z
agent_A_name: "Advocate"
agent_A_cli: "codex"
agent_A_role: "advocate"
agent_B_name: "Skeptic"
agent_B_cli: "codex"
agent_B_role: "skeptic"
agent_C_name: "Synthesizer"
agent_C_cli: "codex"
agent_C_role: "synthesizer"
---

# Discussion: A B2B SaaS company (50-person engineering org, 8 teams) is experiencing growing pains with their 35 polyrepos. Cross-repo changes require coordinated PRs across 3-5 repos, dependency versions drift, and shared libraries are copy-pasted. Should they migrate to a monorepo?

## Participants
- **Agent A** — Advocate (advocate) via codex
- **Agent B** — Skeptic (skeptic) via codex
- **Agent C** — Synthesizer (synthesizer) via codex

## Key Questions
1. What is the actual migration cost and risk for 35 repos with active development?
2. Which problems are best solved by monorepo, and which have simpler solutions (better tooling, stricter dependency management)?
3. What organizational changes does a monorepo require (CI/CD, code ownership, merge process)?
4. Is there an incremental path, or is this all-or-nothing?

## Research Phase

### Agent A (Advocate) — Independent Research | research

Yes, I would advocate for migrating, because the company’s current pain pattern is almost the canonical “you’ve outgrown polyrepos” signal. The symptoms are not ideological; they are operational: coordinated PRs across 3-5 repos, first-party dependency drift, and copy-pasted shared code. A monorepo directly attacks those costs. Google’s classic paper on its monorepo is still the clearest statement of the upside: unified versioning, simplified dependency management, atomic changes, large-scale refactoring, code sharing, and clearer visibility across teams ([CACM/Google](https://cacm.acm.org/research/why-google-stores-billions-of-lines-of-code-in-a-single-repository/), [Google Research](https://research.google.com/pubs/pub45424.html?authuser=0)). That maps almost one-to-one to this company’s pain. The biggest win is not “one repo”; it is replacing multi-repo choreography with one reviewable, testable change set.

The upside scenario is substantial. Today, a shared API or library change appears to require release sequencing and negotiation between teams. In a well-run monorepo, that same change becomes: update library, update all consumers, run affected tests, merge once. A Microsoft/Nrwl guest post describes exactly this dynamic: when a component and all consumers can change in one PR, the work is hours; when they live in separate repos, it can become weeks or get avoided entirely ([Microsoft DevBlogs](https://devblogs.microsoft.com/startups/using-monorepos-to-increase-velocity-during-early-stages-of-product-development/)). For a 50-person org, that means fewer “integration projects,” fewer broken intermediate versions, and far less duplicated migration work.

The second major opportunity is platform leverage. With 35 polyrepos, the org is likely maintaining 35 near-variants of CI config, lint rules, package management, build scripts, CODEOWNERS, and dependency update policy. Consolidation turns that into one engineering system. Microsoft’s own DevOps guidance says single-main-branch development “virtually eliminates merge debt” and gives teams confidence to refactor because changes are tested constantly ([Microsoft Learn](https://learn.microsoft.com/en-us/devops/develop/how-microsoft-develops-devops)). That is a real organizational dividend: fewer repo-by-repo exceptions, faster onboarding, and a platform team that improves developer experience once instead of 35 times.

Modern tooling also makes the old “monorepos are too slow” objection much weaker than it used to be. DigitalOcean’s 2024 migration moved 1.3M lines of React micro-frontend code into a monorepo specifically to reduce dependency-management burden and increase developer velocity; importantly, they note that a monorepo still allows isolated packages to deploy independently, and they built changed-workspace detection to avoid unnecessary deployments and e2e runs ([DigitalOcean](https://www.digitalocean.com/blog/migrate-production-code-to-monorepo)). Vercel’s current guidance describes almost the exact pain in this prompt, and notes that Vercel itself runs 12 microfrontend projects in one monorepo with shared packages; its Turborepo examples show 17x unchanged-build speedups via caching ([Vercel monorepo fundamentals](https://vercel.com/academy/production-monorepos/understanding-monorepos), [Vercel microfrontend setup](https://vercel.com/academy/microfrontends-on-vercel/monorepo-setup), [Vercel Turborepo basics](https://vercel.com/academy/production-monorepos/turborepo-basics)).

There are also encouraging success cases, though I would treat vendor-published ones as directional rather than neutral evidence. Nx’s customer stories report PayFit cutting feature deployment from 2-5 days to 20 minutes and Caseware reaching a 93% cache hit rate in a 700+ project monorepo, saving large amounts of CI compute ([PayFit](https://nx.dev/blog/payfit-success-story), [Caseware](https://nx.dev/blog/caseware-success-story)). The exact numbers may not transfer, but the pattern does: once dependency graphs, caching, and shared libraries are real, the coordination tax drops sharply.

The uncertainty is not whether monorepos can work; it is whether this org will invest in the operating model that makes them work: module boundaries, code ownership, affected-only CI, and an incremental migration path. My advocate view is that this company is in the sweet spot where the upside is unusually high. If they migrate thoughtfully, they do not just get cleaner repos; they get back engineering time currently being burned on synchronization.

### Agent B (Skeptic) — Independent Research | research

The skeptical read is: a monorepo may solve today’s coordination pain by replacing it with a larger, more centralized systems problem. The strongest evidence is that successful monorepos at scale depend on heavy platform investment, not just a repo move. Google’s canonical monorepo papers explicitly list the downsides as the need to create and scale custom tools, plus ongoing code-health risk from unnecessary dependencies and codebase complexity ([CACM 2016](https://cacm.acm.org/research/why-google-stores-billions-of-lines-of-code-in-a-single-repository/), [ICSE 2018](https://research.google/pubs/advantages-and-disadvantages-of-a-monolithic-codebase/)). In the 2018 Google study, engineers still saw real tradeoffs: multi-repo systems provided “significant access control and stability benefits,” and “stable dependencies” plus faster build time were cited as reasons to prefer multi-repo setups ([preprint](https://storage.googleapis.com/gweb-research2023-media/pubtools/4479.pdf)). That matters here: the current pain is dependency drift, but monorepos often “solve” that by forcing latest-at-head dependencies. Google’s own paper notes that this also creates churn, where dependencies can break underneath teams unless tooling and ownership are strong.

The failure mode is an “untooled monorepo”: one repo, one pipeline surface, but without Google-grade infra. Real migrations show how expensive that gets. Wix’s 2025 write-up is especially relevant because the starting point is similar: 60 repos with cross-repo build pain. Their migration required new synchronization tooling, CI redesign, custom clone strategies, resource increases from 8 CPU/16 GB to 30 CPU/160 GB, and eventually a separate local-dev CLI/plugin stack just to keep developers productive in a 22 GB repo ([Part 1](https://www.wix.engineering/post/from-60-repos-to-one-how-wix-tackled-monorepo-migration-part-1), [Part 3](https://www.wix.engineering/post/from-60-repos-to-one-how-wix-tackled-monorepo-migration-part3)). That is not “move code and profit”; it is a platform program. Microsoft’s monorepo guidance says the same thing more bluntly: monorepos require discipline, process, automation, and involve “tedious access management”; their example transition from 10+ repos took several weeks even for roughly a 100-person project, and they say the model pays off most when “the system is always deployed together” ([Microsoft ISE blog](https://devblogs.microsoft.com/ise/working-with-a-monorepo/)). A B2B SaaS with 8 teams and likely independently deployable services may not satisfy that condition.

Access control is another under-discussed risk. On GitHub, permissions are fundamentally repository-scoped roles; CODEOWNERS helps with review routing, but it does not create fine-grained read barriers inside a repo ([repository roles](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization), [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners?ref=the-mergify-blog)). If these 35 repos exist partly because of compliance, customer isolation, or different risk domains, a monorepo can make governance worse, not better.

My bottom-line risk assessment: the company could spend 6-12+ months migrating, run dual systems, slow delivery, centralize CI failures, and still not fix the underlying issue if the real problem is weak dependency governance, weak package ownership, and no cross-repo automation. The safer interpretation of the evidence is that monorepo benefits are real, but only after a nontrivial tooling/org investment. Uncertainty: if the repos are same stack, same trust boundary, same deployment cadence, and leadership will fund a real platform team, the case strengthens. Without that, a partial strategy is less risky: consolidate only the most interdependent repos, standardize internal package publishing/versioning, add cross-repo integration CI, and kill copy-paste before attempting a full monorepo.

---

## Discussion

### Round 1 — Advocate | response | confidence: 74%

**Response to previous points:**
Agent B’s strongest point is the right constraint: an untooled monorepo is worse than today’s polyrepo setup. The Wix example is a real warning that “just merge repos” can create a giant CI and local-dev tax if platform work, ownership, and boundaries lag behind. I agree with that.

Where I disagree is the implied decision boundary. Those risks argue against a big-bang migration, not against migrating at all. The company’s current problems are first-party coordination failures: 3-5 PRs per change, version drift, and copy-pasted shared code. Those are exactly the cases where a monorepo’s atomic changes and single-source shared libraries create user value quickly. If they stay polyrepo, they still need to build better tooling and governance, but they do not get atomic refactors in return.

So my synthesis is: migrate, but only as an incremental platform program. Start with the most interdependent repos plus shared libraries, keep independent deployability, and require affected-only CI, CODEOWNERS, and explicit module boundaries before expanding further.

**New evidence or angle:**
A new angle is option value. In the current setup, every new cross-cutting initiative gets more expensive because coordination cost scales with repo count and drift. In a monorepo, the migration cost is front-loaded, but the marginal cost of later platform-wide changes drops. For a 50-engineer org with 8 teams, that matters more than raw repo count: they are large enough that cross-team change friction compounds, but still small enough to standardize before local repo conventions become irreversible.

**Current position:**
I still favor migrating, at ~74% confidence, because the stated pain points are unusually well matched to monorepo benefits and are already imposing recurring tax on delivery. My confidence is not higher because Agent B is right that success depends on nontrivial investment in CI, ownership, and developer workflow; without that, this fails.

**Key question for the group:**
Can we identify the 6-10 repos with the highest rate of coordinated changes and shared-library churn, and agree that the real decision is whether those should move first, rather than debating all 35 repos as one package?

### Round 1 — Skeptic | response | confidence: 66%

**Response to previous points:**
Agent A’s strongest point is the reframing: the real choice is not “big-bang monorepo or nothing,” but whether the most interdependent slice should live together so shared-code changes can be atomic. I agree, and it changes my position: a pilot across the 6-10 highest co-change repos is materially less risky than migrating all 35.

Where I still disagree is the causal claim. Coordinated PRs can mean two different things: build-time coupling (shared libs and consumers changing together) or runtime/process coupling (multiple services, contracts, approvals, releases). A monorepo directly helps the first; it only partially helps the second. Agent A is right on copy-pasted libraries and first-party dependency drift. But if many of the 3-5 repo changes are really API/versioning problems between independently deployable services, a monorepo may centralize code without removing the actual coordination tax. Agent C should synthesize around that distinction, because it is the main unresolved question.

**New evidence or angle:**
The decision should be based on the change graph, not repo count. If the same repos repeatedly co-change in one workstream, that cluster is a monorepo candidate. If cross-repo work mostly crosses stable service boundaries, the cheaper fix is stronger contracts: ownership, lockstep internal package versioning where appropriate, compatibility tests, and automation for coordinated releases. Shared source control should follow proven code coupling, not substitute for architecture discipline.

**Current position:**
I’ve moved from “probably no” to “pilot only.” ~66% because the evidence supports a monorepo for a tightly coupled subset, especially shared libraries plus their main consumers, but not yet for all 35 repos. The missing proof is whether their pain is mostly code coupling or service/process coupling.

**Key question for the group:**
In the last 20 cross-repo changes, how many required simultaneous edits to shared build-time code and consumers, versus independent service/API changes that only needed coordination because interfaces and release tooling are weak?

### Round 2 — Advocate | response | confidence: 78%

**Response to previous points:**
Agent B’s strongest argument is the most important one: the decision should follow the change graph, not the repo count. I agree. If the last 20 painful changes were mostly build-time coupling between shared libraries and their consumers, that is positive evidence for migration. If they were mostly service/API coordination, a monorepo will not remove the real bottleneck. That distinction is now the decision boundary.

Where I still push harder than Agent B is on action. Even under uncertainty, the company should not stay in a “35 repos plus better intentions” state. The copy-pasted libraries and first-party version drift already show weak package boundaries and weak upgrade mechanics. Those can be improved in polyrepo, but the company would still pay multi-PR coordination tax on the same tightly coupled slice. So I’ve shifted further from “migrate all 35” to “run a bounded monorepo pilot for the highest co-change cluster, with explicit success/failure criteria.” Agent C should synthesize around that conditional path, not a binary yes/no.

**New evidence or angle:**
A new angle is risk concentration in copy-pasted shared code. In B2B SaaS, duplicated auth, billing, API client, or permission logic is not just a maintenance smell; it creates inconsistent fixes, uneven security posture, and slower incident response. A monorepo is not the only way to fix that, but it is the cleanest way to turn “many drifting copies” into “one owned module plus atomic consumer updates.” That user-value argument is stronger than generic developer-experience claims.

**Current position:**
I favor a staged migration, not a full-org mandate, at ~78% confidence. The evidence now supports “monorepo for the tightly coupled core” more strongly than “all 35 repos should move.” My confidence is higher on the pilot than on the end-state because the company’s observed pain maps directly to the subset case, while full consolidation still depends on trust boundaries, deployment independence, and platform capacity.

**Key question for the group:**
What are the 5 repo pairs or clusters with the highest co-change frequency over the last 6 months, and for each, was the coordination driven by shared source changes or by service/API release sequencing?

### Round 2 — Skeptic | response | confidence: 71%

**Response to previous points:**
Agent A’s strongest argument is now well-framed: the real decision is not “35 repos or 1 repo,” but whether the highest co-change cluster should be brought together so first-party library changes and consumer updates can land atomically. I agree with that narrower framing, and I’ve visibly shifted because it removes the worst failure mode: a full-org migration justified by pain that only exists in one slice.

Where I still want to stress-test the case is causality. Agent A is right that copy-pasted libraries and version drift are strong evidence of build-time coupling. But I would not let those symptoms automatically justify broader consolidation. They may point to one bad cluster, not a company-wide repo problem. Agent C should synthesize around a gated approach: prove the pain is concentrated, prove a pilot improves lead time and breakage, then decide whether to expand. Without that proof, “staged migration” can still become an unbounded platform project.

**New evidence or angle:**
A new angle is the risk of centralizing the wrong abstractions. Copy-paste is sometimes bad duplication, but sometimes it is a signal that teams have similar-looking code with meaningfully different change rates or requirements. If they force those into one shared library inside a monorepo too early, they may replace duplication with a high-churn dependency hotspot that slows everyone down. So the precondition is not just “these repos co-change,” but “the shared code is actually stable enough to be owned centrally.”

**Current position:**
I support a bounded monorepo pilot for the most tightly coupled cluster, not a default migration of all 35 repos. ~71% because the evidence now supports a third option: monorepo where build-time coupling is demonstrably high, keep true service boundaries separate, and treat expansion as something to earn with metrics rather than assume.

**Key question for the group:**
Which duplicated/shared code areas changed across 3+ repos in the last 6 months, and for each one, was the underlying logic genuinely the same enough to centralize, or was the duplication masking real product/service divergence?

### Round 3 — Advocate | response | confidence: 82%

**Response to previous points:**
Agent B’s strongest point is now the crux: the company should not justify a company-wide monorepo on symptoms that may be concentrated in one cluster. That is the right standard, because if the pain is mostly service/API release sequencing, repo topology will not fix it. I’ve changed my mind visibly on the end-state: I no longer advocate “migrate the 35 repos”; I advocate “prove the highest-coupled cluster belongs together, then expand only if the data stays favorable.”

I also think Agent B’s warning about centralizing the wrong abstraction is important. Copy-paste is not automatic proof that one shared library is correct; some duplication reflects real divergence. So the open questions are now narrower and more concrete: which repos co-change together, which duplicated modules are truly semantically the same, and whether trust/access boundaries would block consolidation even for that subset. Agent C should synthesize around a gated decision: one pilot cluster, explicit metrics, explicit stop conditions.

**New evidence or angle:**
A new angle is reversibility. The pilot should be designed as a falsifiable bet, not a one-way reorg. Success criteria should be set before migration: reduced lead time for cross-cutting changes, fewer broken intermediate versions, lower duplicate-code surface, and no material CI/local-dev regression. Failure criteria matter just as much: if the pilot cluster still behaves like separately versioned systems inside one repo, or requires heavy bespoke tooling before basic productivity returns, that is evidence against broader migration. That makes this less of an ideological repo decision and more of a measured operating-model experiment.

**Current position:**
I support a bounded monorepo pilot for the most tightly coupled 6-10 repo cluster, not a blanket migration of all 35 repos. ~82% because both the original symptoms and Agent B’s cautions point to the same third option: use monorepo where build-time coupling is demonstrably high, keep genuinely independent services separate, and earn any expansion with measured results.

**Key question for the group:**
What percentage of the last 6 months of painful cross-repo work is concentrated in one repo cluster driven by the same 1-3 shared code areas, and is that percentage high enough to justify a pilot?

**Convergence assessment:** CONVERGING — we are largely aligned on a bounded pilot over a full migration; the remaining gap is evidentiary, not philosophical: how concentrated the pain really is, and whether the shared code is truly centralizable.

---

## Consensus Summary

### Decision
Do not migrate all 35 repos into a single monorepo now. Start a bounded monorepo pilot for the 6-10 repos with the highest co-change rate plus the shared libraries they depend on, because that directly addresses the real pain the Advocate identified (atomic cross-cutting changes, no version drift, no copy-paste) while honoring the Skeptic’s strongest warning that a full-org monorepo without platform investment simply centralizes complexity. If the pilot measurably reduces lead time and breakage without materially hurting CI or local development, expand; if not, keep the remaining services polyrepo and fix contracts, release automation, and dependency governance there.

### Key Contention Points

| # | What Was Debated | Resolution | Who Had the Strongest Case & Why |
|---|-----------------|------------|----------------------------------|
| 1 | Whether the company should migrate to a monorepo at all | Yes for the tightly coupled subset, no for a blanket 35-repo migration | Agent A had the strongest case on problem fit: the stated symptoms are classic build-time coupling pain, and monorepo uniquely enables atomic library-and-consumer changes that polyrepo tooling cannot fully replicate |
| 2 | Whether cross-repo pain is actually caused by repo topology or by service/API/process coupling | Treat this as the decision boundary: monorepo only solves the build-time/shared-code part | Agent B had the strongest case because it drew the key causal distinction: if the pain is mostly runtime/service coordination, a monorepo will not remove the real bottleneck |
| 3 | Big-bang migration versus incremental path | Use a gated pilot with explicit success and stop criteria | Agent B had the strongest case on execution risk, supported by evidence that successful monorepos require CI, tooling, ownership, and local-dev investment; Agent A ultimately converged on the same pilot model |
| 4 | Whether duplicated shared code should be centralized | Centralize only code that is semantically the same and changes together; do not force false abstractions | Agent B had the strongest case because it correctly warned that some copy-paste reflects real divergence, and prematurely shared code can create a high-churn bottleneck instead of reducing friction |
| 5 | What organizational trade-off to accept | Sacrifice the simplicity of a single company-wide answer in exchange for lower migration risk and clearer proof | Both converged here, but Agent A had the stronger final framing: make the move a falsifiable operating-model experiment rather than an ideological repo reorg |

### Unresolved Items & Risks
- The company still needs actual co-change data before choosing the pilot cluster; repo count alone is not enough.
- The pilot will fail if they do not invest in affected-only CI, code ownership, dependency graphing, and standardized local-dev workflows.
- Access-control, compliance, or trust-boundary constraints may rule out consolidation for some repos even if they co-change frequently.
- Some duplicated libraries may be masking real domain divergence; forcing them together too early could create a noisy shared hotspot.
- This recommendation explicitly sacrifices immediate company-wide standardization in order to avoid a large migration program that may not attack the true source of coordination cost.

### Confidence: Medium
Both agents converged on a bounded pilot rather than a full migration, but the final scope still depends on company-specific co-change and shared-code evidence that was not provided.

---
