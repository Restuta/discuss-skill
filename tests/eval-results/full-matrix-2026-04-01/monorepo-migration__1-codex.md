---
topic: "A B2B SaaS company (50-person engineering org, 8 teams) is experiencing growing pains with their 35 polyrepos. Cross-repo changes require coordinated PRs across 3-5 repos, dependency versions drift, and shared libraries are copy-pasted. Should they migrate to a monorepo?"
mode: "single-agent"
agent_count: "1"
agent_cli: "codex"
status: "consensus"
created: "2026-04-01T08:52:13.712Z"
---

# Discussion: A B2B SaaS company (50-person engineering org, 8 teams) is experiencing growing pains with their 35 polyrepos. Cross-repo changes require coordinated PRs across 3-5 repos, dependency versions drift, and shared libraries are copy-pasted. Should they migrate to a monorepo?

## Single Agent Analysis

# Analysis: A B2B SaaS company (50-person engineering org, 8 teams) is experiencing growing pains with their 35 polyrepos. Cross-repo changes require coordinated PRs across 3-5 repos, dependency versions drift, and shared libraries are copy-pasted. Should they migrate to a monorepo?

## Research
The symptoms you described map unevenly to monorepo value. The strongest monorepo benefit is atomic, cross-cutting change. Google’s CACM writeup on monorepos highlights unified versioning, atomic changes, simplified dependency management, code sharing, and large-scale refactoring as the core advantages, while also calling out the cost of building and maintaining the supporting tooling and code-health controls ([CACM](https://cacm.acm.org/research/why-google-stores-billions-of-lines-of-code-in-a-single-repository/)). That matters here because coordinated PRs across 3-5 repos are the one pain that better discipline alone does not truly remove; tooling can choreograph multi-repo changes, but it cannot make them one change.

The migration cost is real. My estimate here is an inference from the org shape you gave, not a published benchmark. For 35 active repos, the work usually breaks into three layers: platform foundation, repo onboarding, and parallel-run cleanup. Foundation means choosing a workspace/package strategy, build graph, caching, root CI, release/versioning rules, ownership model, and developer ergonomics. Onboarding means moving code, preserving history, normalizing scripts, manifests, test/build targets, and deployment metadata. Cleanup means fixing implicit dependencies, path assumptions, and release coupling that were hidden by repo boundaries. For a mostly JS/TS shop, this is usually on the order of 8-15 engineer-months over roughly 3-6 calendar months. If the repos span multiple build systems, custom CI/CD, or strict access boundaries, 15-25 engineer-months is plausible. The big risks are not git mechanics; they are CI explosion, ownership confusion, and accidental release coupling.

Not every problem here requires a monorepo. Dependency drift can often be reduced with automated update policies and stricter package hygiene; GitHub’s Dependabot docs show both direct and indirect dependency update automation ([Dependabot](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configuring-dependabot-version-updates)). CI duplication can often be reduced with reusable workflows and templates ([GitHub reusable workflows](https://docs.github.com/en/actions/concepts/workflows-and-actions/reusing-workflow-configurations)). Copy-pasted shared libraries can often be replaced with internal packages published to a private registry such as GitHub Packages, without changing repo topology ([GitHub Packages](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages)). If the dominant workflow is “publish shared lib, bump dependents,” a disciplined polyrepo can work. But if the dominant workflow is “change service, shared contract, client, and deploy/config together,” a monorepo is structurally better.

A successful monorepo also requires organizational changes. Microsoft’s One Engineering guidance centers trunk-based development, short-lived branches, build policies, owner signoff, and keeping `main` buildable; it also explicitly notes that multi-repo can still be right for some microservice-heavy contexts ([Microsoft](https://learn.microsoft.com/en-us/devops/develop/how-microsoft-develops-devops)). In practice, this company would need directory-level ownership via `CODEOWNERS`, protected branches, required checks, and probably a merge queue as PR volume rises ([CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), [protected branches and merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)). CI must become graph-aware and cache-heavy, not “run everything on every PR”; Nx, Turborepo, and Bazel all emphasize incremental adoption plus caching/affected builds because raw monorepos otherwise become slow and expensive ([Nx incremental adoption](https://nx.dev/docs/getting-started/start-with-existing-project), [Turborepo add to existing repo](https://turborepo.dev/docs/getting-started/add-to-existing-repository), [Turborepo remote caching](https://turborepo.dev/docs/core-concepts/remote-caching), [Bazel remote caching](https://bazel.build/remote/caching)).

This is not all-or-nothing. Both Nx and Turborepo explicitly support incremental adoption in existing repos. A good path is a strategic monorepo, not a universal one: move the tightly coupled apps, services, and shared libraries first; keep infra repos, vendor mirrors, or sensitive code outside if access/compliance needs differ. Independent releases are still possible inside a monorepo; Nx, for example, supports independently released projects and release groups ([Nx independent releases](https://nx.dev/docs/guides/nx-release/release-projects-independently)). Security/compliance is the main reason not to force everything into one repo; centralization increases the need for least-privilege access and auditable merge controls ([Microsoft Zero Trust](https://learn.microsoft.com/en-us/security/zero-trust/sfi/zero-trust-source-code-access)).

## Recommendation

### Decision
Yes, but not as a big-bang “35 repos into one” migration. I would move to a strategic monorepo for the most tightly coupled product repos, while first fixing the simpler polyrepo hygiene issues with internal packages, dependency automation, and reusable CI in the repos that remain separate.

### Key Trade-offs
| # | Trade-off | How You Weighed It |
|---|-----------|-------------------|
| 1 | Atomic cross-repo changes vs migration effort | This is the decisive factor in favor of monorepo; your current 3-5 repo PR choreography is exactly the kind of friction monorepos remove. |
| 2 | Shared code reuse vs stronger boundary management | Monorepo makes reuse easier, but without module boundaries and ownership rules it also makes accidental coupling easier. |
| 3 | Faster refactors vs CI complexity | Refactors get much easier, but only if CI is graph-aware, cached, and selective; otherwise one repo becomes a slow tax. |
| 4 | Independent deploys vs perceived release coupling | Monorepo does not require one release train, but you must explicitly design for independent releases and deployments. |
| 5 | Simpler collaboration vs security/access concerns | Centralization helps engineering flow, but least-privilege and sensitive-code controls become more important. |
| 6 | Incremental adoption vs prolonged hybrid state | Incremental migration reduces risk, but you will temporarily pay a coordination tax while both models coexist. |

### Risks & Uncertainties
- If most of the 35 repos are truly independent microservices with low co-change, a broad monorepo will be overkill.
- If build stacks and deployment pipelines are highly heterogeneous, migration cost will be closer to the high end.
- Without a real platform/DevEx owner, the monorepo will centralize problems instead of solving them.
- If access controls differ materially across repos, some code should stay outside the monorepo.
- If the team does not adopt stronger ownership, branch protection, and merge controls, review latency may get worse before it gets better.

### Confidence: Medium
The direction is clear from the failure modes you described, but the right scope depends on how much of the repo graph is actually co-changing and how heterogeneous the current toolchain is.
