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
created: "2026-04-01T08:52:13.714Z"
last_updated: 2026-04-01T09:00:15.190Z
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

The upside case is strong, and this company’s current symptoms are almost a checklist for monorepo fit. If a single product change regularly needs 3-5 coordinated PRs across 35 repos, the org is already paying the integration tax every week. A monorepo turns that into one atomic change set, one CI graph, and one review surface. That is not cosmetic. It means API producers and consumers can migrate together, dependency bumps stop lagging by weeks, and “shared libraries” can become actual shared packages instead of copy-pasted forks. Current monorepo tooling explicitly optimizes for this: Nx highlights atomic changes, one shared dependency set, and easier developer mobility across projects ([Nx docs](https://canary.nx.dev/docs/concepts/decisions/why-monorepos)).

There is real evidence that engineers value these properties. In Google’s ICSE 2018 study of engineers who had experienced both models, **88% preferred** Google’s monorepo over their prior multi-repo setup; even when the researchers tried to hold tooling constant, **79% still preferred** the monorepo ([Google research paper](https://research.google/pubs/advantages-and-disadvantages-of-a-monolithic-codebase/), [PDF](https://storage.googleapis.com/gweb-research2023-media/pubtools/4479.pdf)). The primary reasons were codebase visibility and simpler dependency management. More importantly, the benefit was not just aspirational: the median engineer viewed **28% of files outside their own area**, showing that cross-team code discovery and reuse were happening in practice, not just in theory ([PDF](https://storage.googleapis.com/gweb-research2023-media/pubtools/4479.pdf)). For an 8-team B2B SaaS org, that suggests a genuine upside in making service contracts, auth patterns, UI primitives, and integration examples discoverable by default.

The operational upside is also better than many teams assume. A monorepo does **not** require monolithic deployment. Vercel’s monorepo guidance explicitly treats repository layout and deployment architecture as separate concerns; apps can live together and still deploy independently ([Vercel Academy](https://vercel.com/academy/production-monorepos/understanding-monorepos)). That matters here: the company can centralize source control and shared code without giving up team autonomy over releases. Microsoft’s .NET team is a recent success case. They describe building the SDK from “dozens of repositories” as a source of significant complexity and maintenance overhead; after introducing a virtual monorepo, they now build from a single commit, and call that repo a foundational pillar for unifying and streamlining build and release while preserving autonomy where needed ([.NET blog](https://devblogs.microsoft.com/dotnet/how-we-synchronize-dotnets-virtual-monorepo/)). Meta describes similar benefits: unified dependency management, large-scale refactoring, easier collaboration, and code reuse in its monorepo ([Meta Engineering](https://engineering.fb.com/2025/10/16/developer-tools/branching-in-a-sapling-monorepo/)).

The best-case outcome is compounding leverage. One repo makes it easier to standardize CI, code ownership, dependency upgrades, test conventions, and shared libraries. It also aligns well with trunk-based development; DORA reports better delivery and operational performance when teams keep branch counts low, merge at least daily, and avoid integration phases and code freezes ([DORA](https://dora.dev/capabilities/trunk-based-development/)). A monorepo makes those behaviors easier because integration happens continuously, not after publishing and rebasing across separate repos.

The uncertainty is mostly about scope, not value. Google, Meta, and Microsoft are larger than this company, so the lesson is not “merge all 35 repos tomorrow.” It is: start with the repos that already behave like one system. If a subset of services and shared libraries already changes together, that cluster is the obvious migration target. The advocate view is that inertia is already expensive here. This org is acting like it has a monorepo, but with worse mechanics.

### Agent B (Skeptic) — Independent Research | research

The skeptical case is not that monorepos never work; it is that they often replace visible coordination pain with a larger, less reversible platform problem.

The strongest evidence from successful monorepos is also the warning sign. Google’s canonical writeup says the benefits come with major ongoing costs in tooling, execution infrastructure, and code-health enforcement; they explicitly built custom source control, build/test, code-search, IDE, and cleanup systems to make the model viable ([Google/CACM](https://cacm.acm.org/research/why-google-stores-billions-of-lines-of-code-in-a-single-repository/)). That is the first red flag for a 50-person org: if the answer depends on “be more like Google,” the odds are poor. Wix’s recent 60-repo migration story is similar: they needed new synchronization tooling, custom clone strategies, special Git settings, and much larger CI machines; their naive monorepo build took about five hours, local clone was about an hour, and the repo reached 22GB before they built mitigations ([Wix Part 1](https://www.wix.engineering/post/from-60-repos-to-one-how-wix-tackled-monorepo-migration-part-1), [Part 3](https://www.wix.engineering/post/from-60-repos-to-one-how-wix-tackled-monorepo-migration-part3)). .NET’s “Unified Build” took roughly four years and landed on a virtual monorepo that preserves separate product repos rather than a clean “everything in one repo” simplification ([.NET](https://devblogs.microsoft.com/dotnet/reinventing-how-dotnet-builds-and-ships-again/), [.NET VMR](https://devblogs.microsoft.com/dotnet/how-we-synchronize-dotnets-virtual-monorepo/)).

The main failure mode is a topology change without a systems change. If build graphing, affected-test selection, ownership boundaries, package publishing rules, and dependency policies are weak today, a monorepo can make that weakness universal. Google even notes that easier sharing can make it too easy to add dependencies and reduce incentives to design stable APIs ([Google/CACM](https://cacm.acm.org/research/why-google-stores-billions-of-lines-of-code-in-a-single-repository/)). In other words: copy-paste libraries may disappear, but dependency sprawl can replace them.

There are also concrete Git and local-dev risks. Atlassian documents that large Git monorepos create conceptual and performance problems because Git tracks the whole tree in every commit; history operations, `status`, clone/fetch, and branch switching all degrade as commit count and file count grow ([Atlassian](https://www.atlassian.com/git/tutorials/monorepos)). Microsoft separately notes monorepos “grow very large,” require discipline and access management, and make quick local experimentation harder once automation interdependencies are introduced ([Microsoft ISE](https://devblogs.microsoft.com/ise/working-with-a-monorepo/)).

Access control is another under-discussed trap. GitHub’s permission model is repository-scoped, and `CODEOWNERS` is review routing, not true read isolation; code owners must already have write access to the repository ([GitHub roles](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization), [GitHub CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)). If some repos contain regulated code, customer-specific logic, or contractor-restricted areas, a monorepo can weaken least-privilege.

The biggest strategic uncertainty is whether these 35 repos are actually one product or several independently deployable systems. Microsoft’s ISE team says monorepos pay off most when the system is deployed together ([Microsoft ISE](https://devblogs.microsoft.com/ise/working-with-a-monorepo/)). If these services ship independently, a monorepo may couple source control and CI without reducing runtime or release complexity. My skeptical conclusion: do not start with a full migration. First prove that a smaller pilot can deliver affected builds, fast local workflows, ownership enforcement, and access-control compliance. If that platform work is not funded explicitly, the migration is more likely to centralize pain than remove it.

---

## Discussion

### Round 1 — Advocate | response | confidence: 78%

**Response to previous points:**
Agent B’s strongest point is that a monorepo without serious platform work can replace today’s obvious coordination pain with a larger, harder-to-reverse platform problem: slow CI, weak boundaries, and bad local workflows. I agree, and it changed my view on scope. My earlier upside case should not be read as “move all 35 repos now.”

Where I disagree with Agent B is on the practical alternative. If a normal product change already needs 3-5 coordinated PRs, version choreography, and duplicated shared code, the org is already paying a platform tax, just in the most expensive place: inside feature delivery. Better polyrepo hygiene may reduce some pain, but it does not fix the core issue when producer, consumer, and shared library changes belong in one atomic change. So the synthesis is: do the platform work, but only for the subset of repos that already behave like one system. That answers both the migration-risk question and the incremental-path question.

**New evidence or angle:**
The key economic question is not “monorepo or polyrepo?” It is “where should integration cost live?” Right now it is decentralized and recurring: every cross-cutting initiative re-solves repo coordination, dependency drift, and release ordering. A monorepo pilot centralizes that cost upfront into build graphing, ownership rules, and affected CI. For an 8-team org, that is often the better trade if cross-repo work is frequent, because you stop taxing every team on every initiative.

**Current position:**
I favor a migration, but only as a staged monorepo or virtual-monorepo pilot for the highest-coupling cluster, not a big-bang move. Confidence remains 78% because the stated pain maps directly to monorepo strengths, and Agent B’s risks look real but containable if the first phase has explicit success criteria: affected builds, preserved independent deploys, clear ownership, and fast local workflows.

**Key question for the group:**
In the last 90 days, what percentage of meaningful product changes touched 3+ repos, and which 5-10 repos co-change most often? That data would tell us whether this is truly one coupled system wearing polyrepo clothing, or a set of repos that mainly need better tooling.

### Round 1 — Skeptic | response | confidence: 72%

**Response to previous points:**
Agent A’s strongest argument is the right one to pressure-test: if ordinary product work routinely needs 3-5 coordinated PRs, the company is already operating a de facto coupled codebase, just with worse mechanics. I agree that this weakens the case for “just improve polyrepo hygiene,” and I’ve shifted a bit on that. For the most tightly coupled cluster, a staged monorepo or virtual monorepo pilot is plausible.

Where I still disagree is on the implied economics. Centralizing integration cost is only better if the platform layer is actually built and funded: affected CI, ownership boundaries, dependency policy, and local-dev ergonomics. Otherwise the company will keep the runtime/release complexity of independent services and add repository-scale CI and tooling complexity on top. So my synthesis with Agent A is narrower: pilot the highest co-change cluster, but treat this first as a platform investment decision, not a repo-layout decision.

The main open question is not just “how often do repos co-change?” but “why?” If co-change is mostly shared types, version bumps, and duplicated libraries, there may be cheaper fixes first. If it is producer-and-consumer logic that truly must change atomically, the monorepo case gets much stronger.

**New evidence or angle:**
A missing diagnostic is change taxonomy. Not all multi-repo changes are equal. A repo topology change is justified mainly when the painful changes require atomic source edits across boundaries; it is much less justified when the pain comes from weak package management, bad code generation, or missing ownership/process rules. In concrete terms: if most cross-repo work is “bump package X, regenerate client Y, update shared schema Z,” an internal package platform plus stricter dependency automation may remove much of the pain without a migration. If most cross-repo work is “change service A and its callers together or nothing works,” that is monorepo-shaped pain.

**Current position:**
I still oppose a full 35-repo migration now. I support a time-boxed pilot for the 5-10 repos with the highest co-change, with explicit exit criteria: affected builds are fast, local workflows stay sane, ownership is enforceable, and independent deploys remain intact. Confidence is 72% because Agent A is right that the current coordination tax is real, but the deciding variable is still whether the pain is architectural coupling or merely poor multi-repo discipline.

**Key question for the group:**
Of the cross-repo changes in the last 90 days, what share were truly atomic producer-consumer changes versus dependency/versioning/shared-library maintenance?

### Round 2 — Advocate | response | confidence: 81%

**Response to previous points:**
Agent B’s strongest point is the change-taxonomy test: if most multi-repo pain is just versioning, codegen, or weak package discipline, a monorepo is the wrong medicine. I agree, and that shifted me further away from arguing for a blanket 35-repo migration. Where I still push back is on letting that uncertainty default to caution. The facts already on the table, 3-5 coordinated PRs per product change, dependency drift, and copy-pasted shared code, mean the org has a coupling problem now. So my synthesis with Agent B is narrower and more actionable: pilot a monorepo only for the top co-change cluster, with explicit success/failure criteria. The two most important open questions are still the same: how many recent multi-repo changes were truly atomic producer-consumer edits, and which repos form the densest co-change cluster?

**New evidence or angle:**
Repo boundaries should follow change boundaries more than deployment boundaries. Independent deploys do not require independent repos. If services release separately but their source changes frequently need to land together, polyrepos are enforcing the wrong transaction boundary. That points to a third option between “keep 35 repos” and “merge everything”: create one workspace for the 5-10 repos that co-change most, keep independent deploy pipelines, and leave the rest separate until the data justifies more consolidation.

**Current position:**
I support a staged migration for the highest-coupling cluster, not a full monorepo. Confidence is 81% because Agent B’s caution sharpened the scope without weakening the core case: where atomic change demand is real, monorepo mechanics directly address the pain. The company’s reported symptoms make that likely enough to justify a bounded pilot, but not a whole-estate migration.

**Key question for the group:**
If we sample the last 30 cross-repo changes, how many would have been materially simpler as one atomic PR in one workspace, rather than solvable by better package/version tooling alone?

### Round 2 — Skeptic | response | confidence: 77%

**Response to previous points:**
Agent A’s strongest point is now much stronger than the original “go monorepo” case: repo boundaries should follow change boundaries more than deployment boundaries. I agree with that, and I’ve changed my mind on one important point: for the 5-10 repos with the highest atomic co-change, a shared workspace is now the default option worth proving first, not a fringe option. Where I still disagree with Agent A is on sufficiency of the symptoms. “3-5 coordinated PRs,” dependency drift, and copy-paste prove coupling exists, but they do not yet prove that repo topology is the main cause. So the key open questions from both Agent A and me remain the gating test: which repos co-change most often, and of the last 30 cross-repo changes, how many truly required one atomic source change versus better package/version tooling?

**New evidence or angle:**
The missing criterion is reversibility. A full monorepo migration is risky not only because it is expensive, but because it is hard to unwind once CI, ownership, and developer workflows are centralized. That makes a workspace-first or virtual-monorepo pilot superior to a hard merge economically as well as technically: it lets the company test whether lead time, CI cost, and change failure rate improve before taking on irreversible repo-topology debt. If the pilot cannot improve those delivery metrics for the top co-change cluster, that is strong evidence the real problem was tooling/process, not repository layout.

**Current position:**
I support a reversible, time-boxed pilot for the highest-coupling 5-10 repos and still oppose a full 35-repo migration now. Confidence is 77% because Agent A is right that change boundaries matter more than deploy boundaries, but the remaining uncertainty is still first-order: we do not yet know whether most pain is atomic cross-service work or merely fixable coordination/versioning overhead.

**Key question for the group:**
If we classify the last 30 cross-repo changes, what percentage slowed down or failed specifically because producer and consumer code could not land atomically in one place?

### Round 3 — Advocate | response | confidence: 84%

**Response to previous points:**
Agent B’s strongest argument is the reversibility bar: a full 35-repo migration is the wrong first move because if the real problem is weak package/version discipline, a monorepo would centralize CI and ownership pain without removing release complexity. I agree, and that has fully changed my view on scope. My earlier point still stands, though: repo boundaries should follow change boundaries more than deploy boundaries. So the real open questions are empirical, not ideological: which repos form the densest co-change cluster, and of the last 30 cross-repo changes, how many were truly atomic producer-consumer edits rather than package-maintenance churn?

Where I still push for action is this: those questions are not reasons to wait, they are the gating criteria for a reversible pilot. If the same 5-10 repos dominate atomic co-change work, the company should stop treating this as a general repo-layout debate and start a workspace or virtual-monorepo pilot there.

**New evidence or angle:**
The decision should hinge on cost-of-delay, not repo count. Even if cross-repo work is a minority of all changes, it can still justify a shared workspace if it sits on the critical path for roadmap delivery. So the pilot should optimize one business-facing metric first: lead time for cross-repo changes in the target cluster before vs after, with CI cost and local-dev time as guardrails. If lead time drops materially while deploy autonomy stays intact, the thesis is proven even if the other 25-30 repos never move.

**Current position:**
I support a time-boxed, reversible monorepo or virtual-monorepo pilot for the highest-coupling 5-10 repos, and I oppose a full migration now. Confidence is 84% because Agent B’s risk arguments narrowed the scope correctly, but they did not undercut the core opportunity: where change boundaries already cut across repo boundaries, atomic change sets are a real delivery gain, not just a tooling preference.

**Key question for the group:**
In the last 30 cross-repo changes, how many required synchronized source edits across the same 5-10 repos that could not have been safely handled by versioned packages and dependency automation alone?

**Convergence assessment:** CONVERGING — We now mostly agree on the action: no big-bang migration, yes reversible pilot for the highest-coupling cluster. The remaining gap is the evidence threshold for starting that pilot versus trying package/tooling fixes first.

---

## Consensus Summary

### Decision
They should not migrate all 35 repos into a monorepo now. The consensus is to run a time-boxed, reversible pilot for the 5-10 repos with the highest co-change, using a shared workspace or virtual monorepo, and decide based on evidence: whether atomic changes are actually common, whether lead time for cross-repo work drops, and whether CI/local workflows remain acceptable.

### Key Contention Points

| # | What We Disagreed On | How It Was Resolved | Who Shifted & Why |
|---|---------------------|--------------------|--------------------|
| 1 | Whether the company should broadly migrate to a monorepo now | Both converged on rejecting a big-bang 35-repo migration in favor of a reversible pilot limited to the highest-coupling cluster | Agent A shifted from a general pro-migration stance after accepting the platform, CI, and reversibility risks raised by Agent B |
| 2 | Whether the current symptoms already prove monorepo is the right answer | Resolved into an evidence threshold: first classify recent cross-repo changes to separate truly atomic producer-consumer changes from versioning/package churn | Agent B shifted from broad skepticism to supporting a pilot once the discussion focused on the densest co-change cluster rather than the whole estate |
| 3 | Whether deployment boundaries should determine repo boundaries | Resolved in favor of change boundaries mattering more than deploy boundaries; independent deploys can remain even if source lives in a shared workspace | Agent B moved toward Agent A here after accepting that frequent atomic co-change is a stronger signal than independent release mechanics |
| 4 | Whether simpler fixes should come first instead of any repo-topology change | Resolved by making the pilot itself the test: compare monorepo/workspace benefits against what package/version tooling alone could solve | Both narrowed their positions; Agent A accepted tooling/process may solve part of the pain, and Agent B accepted topology may be justified for the most coupled repos |

### Unresolved Items & Risks
- They still need hard data on which 5-10 repos co-change most often.
- They still need to classify recent cross-repo changes into atomic source edits versus dependency/versioning/shared-library maintenance.
- The pilot only makes sense if platform work is explicitly funded: affected CI, ownership rules, dependency policy, and sane local workflows.
- Access-control and least-privilege requirements may block consolidation if some repos cannot be broadly visible.
- If the pilot does not materially improve lead time for cross-repo changes, that is evidence the root problem is tooling/process rather than repo layout.

### Confidence: Medium
The discussion strongly converged on the pilot approach, but the final recommendation still depends on missing empirical data about co-change patterns and the true cause of cross-repo pain.
