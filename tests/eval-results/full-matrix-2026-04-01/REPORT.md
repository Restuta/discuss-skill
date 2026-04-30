# N-Agent Eval Results

Run: 2026-04-01T10-44-16
Configs: 1-codex, 2-codex, 3-codex, 5-codex, 2-cross
Topics: fintech-payments, healthcare-ai-deploy, monorepo-migration

## fintech-payments
**Topic:** Should a fintech startup (Series A, 20 engineers, processing $50M/year in transactions) build their own payment processing infrastructure or continue using Stripe? They're currently paying ~$1.5M/year in Stripe fees and expect 3x volume growth in 18 months.

| Metric | 1-codex | 2-codex | 3-codex | 5-codex | 2-cross |
|--------|------|------|------|------|------|
| **Checklist Coverage (raw)** | 87% (13/15) | 100% (15/15) | 100% (15/15) | 100% (15/15) | 100% (15/15) |
| **Checklist Coverage (weighted)** | 90% | 100% | 100% | 100% | 100% |
| **Traps Caught** | 2/2 (100%) | 2/2 (100%) | 2/2 (100%) | 2/2 (100%) | 2/2 (100%) |
| **Duration** | 0s | 0s | 0s | 0s | 0s |
| **Output Tokens (est.)** | ~2083 | ~6392 | ~6946 | ~12376 | ~7364 |

### Missed Checklist Items

**1-codex** missed (2):
  - [technical] Multi-currency and cross-border settlement complexity
  - [strategic] Vendor lock-in and data portability concerns

### Trap Detection Details

**1-codex:**
  - CAUGHT: Dismissing in-house entirely without analyzing volume economics — at $50M/year growing to $150M, the fee delta is material
  - CAUGHT: Advocating full in-house build without accounting for PCI scope, fraud detection complexity, and 20-engineer team capacity

**2-codex:**
  - CAUGHT: Dismissing in-house entirely without analyzing volume economics — at $50M/year growing to $150M, the fee delta is material
  - CAUGHT: Advocating full in-house build without accounting for PCI scope, fraud detection complexity, and 20-engineer team capacity

**3-codex:**
  - CAUGHT: Dismissing in-house entirely without analyzing volume economics — at $50M/year growing to $150M, the fee delta is material
  - CAUGHT: Advocating full in-house build without accounting for PCI scope, fraud detection complexity, and 20-engineer team capacity

**5-codex:**
  - CAUGHT: Dismissing in-house entirely without analyzing volume economics — at $50M/year growing to $150M, the fee delta is material
  - CAUGHT: Advocating full in-house build without accounting for PCI scope, fraud detection complexity, and 20-engineer team capacity

**2-cross:**
  - CAUGHT: Dismissing in-house entirely without analyzing volume economics — at $50M/year growing to $150M, the fee delta is material
  - CAUGHT: Advocating full in-house build without accounting for PCI scope, fraud detection complexity, and 20-engineer team capacity

## healthcare-ai-deploy
**Topic:** A healthcare AI startup (Series B, 18 months runway) has a diagnostic model for detecting diabetic retinopathy from retinal images. The model achieves 87% accuracy, matching average radiologist performance. Should they pursue FDA clearance and deploy now with human-in-the-loop, or invest 12-18 months to reach 95% accuracy before seeking clearance?

| Metric | 1-codex | 2-codex | 3-codex | 5-codex | 2-cross |
|--------|------|------|------|------|------|
| **Checklist Coverage (raw)** | 77% (10/13) | 85% (11/13) | 92% (12/13) | 69% (9/13) | 92% (12/13) |
| **Checklist Coverage (weighted)** | 80% | 85% | 90% | 75% | 90% |
| **Traps Caught** | 0/3 (0%) | 1/3 (33%) | 1/3 (33%) | 1/3 (33%) | 2/3 (67%) |
| **Duration** | 0s | 0s | 0s | 0s | 0s |
| **Output Tokens (est.)** | ~1967 | ~6584 | ~6595 | ~12679 | ~7471 |

### Missed Checklist Items

**1-codex** missed (3):
  - [regulatory] Post-market surveillance requirements and continuous monitoring obligations
  - [technical] Data requirements for 87% to 95% — diminishing returns curve, likely needs 5-10x more data
  - [legal] Liability and malpractice implications — who is responsible when AI-assisted diagnosis is wrong?

**2-codex** missed (2):
  - [technical] Data requirements for 87% to 95% — diminishing returns curve, likely needs 5-10x more data
  - [business] Competitor timeline and first-mover advantage in AI diagnostics

**3-codex** missed (1):
  - [technical] Data requirements for 87% to 95% — diminishing returns curve, likely needs 5-10x more data

**5-codex** missed (4):
  - [technical] Training data bias — demographic, geographic, device diversity in training set
  - [technical] Data requirements for 87% to 95% — diminishing returns curve, likely needs 5-10x more data
  - [business] Competitor timeline and first-mover advantage in AI diagnostics
  - [legal] Liability and malpractice implications — who is responsible when AI-assisted diagnosis is wrong?

**2-cross** missed (1):
  - [technical] Data requirements for 87% to 95% — diminishing returns curve, likely needs 5-10x more data

### Trap Detection Details

**1-codex:**
  - MISSED: Claiming 87% is insufficient without comparing to standard of care — the benchmark is average radiologist, not perfection
  - MISSED: Advocating 'ship now, improve later' without acknowledging that medical device modifications require new regulatory submissions (not a software update)
  - MISSED: Assuming 87% to 95% is a simple training improvement without addressing the exponential data requirements and diminishing returns

**2-codex:**
  - CAUGHT: Claiming 87% is insufficient without comparing to standard of care — the benchmark is average radiologist, not perfection
  - MISSED: Advocating 'ship now, improve later' without acknowledging that medical device modifications require new regulatory submissions (not a software update)
  - MISSED: Assuming 87% to 95% is a simple training improvement without addressing the exponential data requirements and diminishing returns

**3-codex:**
  - CAUGHT: Claiming 87% is insufficient without comparing to standard of care — the benchmark is average radiologist, not perfection
  - MISSED: Advocating 'ship now, improve later' without acknowledging that medical device modifications require new regulatory submissions (not a software update)
  - MISSED: Assuming 87% to 95% is a simple training improvement without addressing the exponential data requirements and diminishing returns

**5-codex:**
  - CAUGHT: Claiming 87% is insufficient without comparing to standard of care — the benchmark is average radiologist, not perfection
  - MISSED: Advocating 'ship now, improve later' without acknowledging that medical device modifications require new regulatory submissions (not a software update)
  - MISSED: Assuming 87% to 95% is a simple training improvement without addressing the exponential data requirements and diminishing returns

**2-cross:**
  - CAUGHT: Claiming 87% is insufficient without comparing to standard of care — the benchmark is average radiologist, not perfection
  - CAUGHT: Advocating 'ship now, improve later' without acknowledging that medical device modifications require new regulatory submissions (not a software update)
  - MISSED: Assuming 87% to 95% is a simple training improvement without addressing the exponential data requirements and diminishing returns

## monorepo-migration
**Topic:** A B2B SaaS company (50-person engineering org, 8 teams) is experiencing growing pains with their 35 polyrepos. Cross-repo changes require coordinated PRs across 3-5 repos, dependency versions drift, and shared libraries are copy-pasted. Should they migrate to a monorepo?

| Metric | 1-codex | 2-codex | 3-codex | 5-codex | 2-cross |
|--------|------|------|------|------|------|
| **Checklist Coverage (raw)** | 100% (14/14) | 100% (14/14) | 100% (14/14) | 100% (14/14) | 100% (14/14) |
| **Checklist Coverage (weighted)** | 100% | 100% | 100% | 100% | 100% |
| **Traps Caught** | 2/2 (100%) | 1/2 (50%) | 1/2 (50%) | 2/2 (100%) | 2/2 (100%) |
| **Duration** | 0s | 0s | 0s | 0s | 0s |
| **Output Tokens (est.)** | ~2113 | ~6182 | ~6425 | ~13133 | ~7243 |

### Missed Checklist Items

### Trap Detection Details

**1-codex:**
  - CAUGHT: Arguing 'Google/Meta use monorepo therefore we should' without acknowledging they built $10M+ custom tooling (Bazel, Buck, Piper)
  - CAUGHT: Claiming monorepo is simpler without addressing CI blast radius, merge contention, and the migration itself

**2-codex:**
  - MISSED: Arguing 'Google/Meta use monorepo therefore we should' without acknowledging they built $10M+ custom tooling (Bazel, Buck, Piper)
  - CAUGHT: Claiming monorepo is simpler without addressing CI blast radius, merge contention, and the migration itself

**3-codex:**
  - MISSED: Arguing 'Google/Meta use monorepo therefore we should' without acknowledging they built $10M+ custom tooling (Bazel, Buck, Piper)
  - CAUGHT: Claiming monorepo is simpler without addressing CI blast radius, merge contention, and the migration itself

**5-codex:**
  - CAUGHT: Arguing 'Google/Meta use monorepo therefore we should' without acknowledging they built $10M+ custom tooling (Bazel, Buck, Piper)
  - CAUGHT: Claiming monorepo is simpler without addressing CI blast radius, merge contention, and the migration itself

**2-cross:**
  - CAUGHT: Arguing 'Google/Meta use monorepo therefore we should' without acknowledging they built $10M+ custom tooling (Bazel, Buck, Piper)
  - CAUGHT: Claiming monorepo is simpler without addressing CI blast radius, merge contention, and the migration itself


## Pairwise Comparisons (Blind)

### fintech-payments

**1-codex vs 2-codex**: Winner = **2-codex**
  1-codex: total=45, 2-codex: total=51
  Reason: A's adversarial research phase surfaced richer evidence (Adyen optimization data, Shopify precedent, Fed Reserve interchange specifics) and produced a more nuanced conditional decision framework, while B duplicated its recommendation section and offered fewer non-obvious insights.

**1-codex vs 3-codex**: Winner = **3-codex**
  1-codex: total=46, 3-codex: total=54
  Reason: Analysis A surfaces more novel concepts (migratable GMV, non-regret investments, Stripe's own roadmap as evidence), delivers a significantly more actionable phased recommendation with explicit phase-gates, and resolves trade-offs with greater transparency through its structured contention table.

**1-codex vs 5-codex**: Winner = **5-codex**
  1-codex: total=41, 5-codex: total=53
  Reason: Analysis A explores more angles with greater depth (auth-rate revenue lever, PCI level thresholds by AOV, control-plane vs processor distinction), delivers a more actionable recommendation with explicit go/no-go gates, and surfaces non-obvious insights that Analysis B's single-pass treatment misses.

**1-codex vs 2-cross**: Winner = **2-cross**
  1-codex: total=49, 2-cross: total=53
  Reason: B surfaces more non-obvious insights (timing asymmetry, shadow processor risk, feature-surface lock-in as load-bearing), delivers a more actionable recommendation with time-boxed gates, and its contention-resolution format produces richer trade-off analysis showing how positions evolved.

**2-codex vs 3-codex**: Winner = **3-codex**
  2-codex: total=49, 3-codex: total=53
  Reason: B edges ahead with the novel 'migratable GMV' analytical frame, a more actionable 60-90 day phased recommendation with explicit gates, FinCEN regulatory depth A lacks, and sharper trade-off articulation throughout.

**2-codex vs 5-codex**: Winner = **5-codex**
  2-codex: total=47, 5-codex: total=54
  Reason: Analysis B adds meaningfully broader coverage (user-experience risk, implementation feasibility, regulatory nuance, PAN export switching costs) and delivers a more actionable recommendation with explicit quantitative gates (75-100 bps threshold, 60-90 day timeline, zero-tolerance user metrics), while A reaches a sound conclusion but with less specificity and fewer non-obvious angles.

**2-codex vs 2-cross**: Winner = **2-cross**
  2-codex: total=50, 2-cross: total=52
  Reason: B delivers a more actionable time-boxed recommendation, resolves more trade-offs explicitly in its 5-item contention table, and assigns a more honest 'Medium' confidence rating given the acknowledged unknowns, while A's 'High' confidence contradicts its own list of significant unresolved items.

**3-codex vs 5-codex**: Winner = **5-codex**
  3-codex: total=47, 5-codex: total=53
  Reason: Analysis B covers more decision-relevant angles (UX/conversion risk, implementation prerequisites like PAN export and VisaNet pre-approval, AOV-dependent PCI thresholds) and delivers a sharper recommendation with explicit go/no-go thresholds and a clearer articulation of what is being traded away.

**3-codex vs 2-cross**: Winner = **2-cross**
  3-codex: total=49, 2-cross: total=51
  Reason: A's debate resolution showed deeper intellectual engagement with explicit position shifts and more honest uncertainty handling, while B offered a more actionable recommendation with novel frameworks like 'migratable GMV' and 'non-regret investments'.

**5-codex vs 2-cross**: Winner = **5-codex**
  5-codex: total=53, 2-cross: total=47
  Reason: B surfaced genuinely distinct dimensions—authorization revenue lift, user-facing risk quantification, and the control-plane vs processor-of-record distinction—that A missed entirely, and delivered a more actionable recommendation with explicit go/no-go thresholds and a named sacrifice.

### healthcare-ai-deploy

**1-codex vs 2-codex**: Winner = **2-codex**
  1-codex: total=43, 2-codex: total=53
  Reason: Analysis A surfaces more non-obvious insights (abstention policies, ungradable-image prevalence, real-world screening adherence data, selective prediction), delivers a sharper actionable recommendation (90-120 day validation sprint with explicit go/no-go gates), and its adversarial debate structure forces genuine contention resolution that produces a more nuanced and credible consensus than B's competent but comparatively surface-level single-pass treatment.

**1-codex vs 3-codex**: Winner = **3-codex**
  1-codex: total=47, 3-codex: total=53
  Reason: Analysis A surfaces more non-obvious evidence (workflow speed → follow-up rates, PPV collapse in practice, cost-effectiveness ≠ accuracy), delivers a more actionable recommendation with explicit go/no-go study gates, and resolves competing perspectives with greater sophistication through its contention table.

**1-codex vs 5-codex**: Winner = **5-codex**
  1-codex: total=41, 5-codex: total=53
  Reason: Analysis A covers more angles with greater depth, surfaces non-obvious insights like HITL destroying unit economics and real-world gradability failures, and delivers a more nuanced recommendation with explicit go/no-go gates, while B reaches a similar conclusion with less specificity and a duplicated recommendation section.

**1-codex vs 2-cross**: Winner = **2-cross**
  1-codex: total=41, 2-cross: total=53
  Reason: Analysis A's adversarial debate surfaced non-obvious insights (underserved-setting narrowing, automation bias research, screening-funnel vs model-accuracy distinction), synthesized a specific actionable middle path with concrete study design and site counts, and demonstrated genuine intellectual tension and resolution rather than listing trade-offs at a single level of abstraction.

**2-codex vs 3-codex**: Winner = **3-codex**
  2-codex: total=51, 3-codex: total=53
  Reason: Analysis B edges ahead with more honest confidence calibration (Medium vs High given unknown model metrics), clearer trade-off attribution in its contention table, and a sharper escalation-risk warning, despite both analyses reaching nearly identical substantive conclusions.

**2-codex vs 5-codex**: Winner = **5-codex**
  2-codex: total=49, 5-codex: total=53
  Reason: Analysis A covers more angles with richer evidence (implementation timelines, user trust, multiple cleared-device comparisons, real-world gradability data) and its four-perspective structure surfaces more nuanced trade-offs, though both reach similarly sound conclusions.

**2-codex vs 2-cross**: Winner = **2-cross**
  2-codex: total=46, 2-cross: total=53
  Reason: B delivers a far more actionable recommendation—specific study design (800 patients, 4 FQHC sites), narrowed deployment setting resolving the competitive gap, unit economics, and non-dilutive funding strategy—while also surfacing deeper non-obvious insights like AI overreliance effects (11.3pp accuracy drop) and PPV-driven referral burden analysis.

**3-codex vs 5-codex**: Winner = **5-codex**
  3-codex: total=46, 5-codex: total=53
  Reason: Analysis A covers substantially more ground via four specialized perspectives (domain expert and user advocate angles are absent from B), surfaces more non-obvious insights like reimbursement precedent and implementation timelines, and delivers a more actionable recommendation with explicit go/no-go gates.

**3-codex vs 2-cross**: Winner = **2-cross**
  3-codex: total=48, 2-cross: total=53
  Reason: Analysis A delivers a significantly more actionable recommendation (specific study size, sites, timeline, unit economics, funding strategy) while matching B's nuance and exceeding it in depth on regulatory and competitive specifics.

**5-codex vs 2-cross**: Winner = **5-codex**
  5-codex: total=53, 2-cross: total=47
  Reason: Analysis B's domain expert and user advocate perspectives surfaced critical dimensions—implementation logistics, patient follow-up economics, ungradable-rate realities, and the sharp insight that HITL can degrade into expensive tele-ophthalmology—that materially strengthened both the reasoning and the actionability of an otherwise similar strategic conclusion.

### monorepo-migration

**1-codex vs 2-codex**: Winner = **2-codex**
  1-codex: total=45, 2-codex: total=52
  Reason: B surfaces sharper empirical evidence (Google ICSE stats, Wix/dotNET specifics), a more novel change-type classification framework, and a more actionable recommendation with explicit success criteria and reversibility gates.

**1-codex vs 3-codex**: Winner = **3-codex**
  1-codex: total=43, 3-codex: total=51
  Reason: B surfaces the critical build-time vs runtime coupling distinction, brings richer real-world migration evidence (Wix resource scaling, DigitalOcean), treats copy-pasted code as potential real divergence rather than pure waste, and delivers a more specific and falsifiable recommendation with explicit pilot scope and success criteria.

**1-codex vs 5-codex**: Winner = **5-codex**
  1-codex: total=43, 5-codex: total=52
  Reason: B surfaces sharper non-obvious insights (atomic source != atomic release, architecture-vs-repo framing), backs claims with concrete case-study outcomes (DigitalOcean, Airbnb, Shopify), and delivers a more actionable recommendation with explicit pilot entry gates and measurement criteria, while A duplicates its recommendation section and stays closer to standard consulting territory.

**1-codex vs 2-cross**: Winner = **2-cross**
  1-codex: total=46, 2-cross: total=52
  Reason: B's adversarial structure surfaces stronger counterarguments (code clone defect rates, untuned monorepo failure mode, lockstep dependency blast radius) and produces a more actionable recommendation with concrete prerequisites, timeline, exclusion criteria, and pilot success metrics, while A duplicates its recommendation section and lacks specific sequencing or gates.

**2-codex vs 3-codex**: Winner = **3-codex**
  2-codex: total=47, 3-codex: total=52
  Reason: B edges ahead with sharper non-obvious distinctions (build-time vs runtime coupling, copy-paste as real divergence), a richer 5-point contention table with stronger attribution, more concrete case studies (DigitalOcean, PayFit, Caseware), and a more actionable recommendation with explicit fallback paths.

**2-codex vs 5-codex**: Winner = **5-codex**
  2-codex: total=41, 5-codex: total=52
  Reason: B covers more angles (migration mechanics, DX, success metrics), surfaces sharper frameworks ('co-change density × toolchain heterogeneity', 'atomic source control ≠ atomic release'), and delivers a more actionable recommendation with concrete entry gates and measurable success criteria.

**2-codex vs 2-cross**: Winner = **2-codex**
  2-codex: total=52, 2-cross: total=45
  Reason: A provides more rigorous cited evidence (Google ICSE stats, Wix specifics, .NET timeline), more honest confidence calibration (Medium vs B's arguably overconfident High), and deeper nuance — B's advocate makes unsupported claims (Stripe metrics, 15-25% time estimate) that weaken credibility.

**3-codex vs 5-codex**: Winner = **5-codex**
  3-codex: total=47, 5-codex: total=53
  Reason: Analysis A covers more angles (implementation mechanics, developer experience, release management) with sharper novel insights ('atomic source control is not atomic release', co-change density framing) and a more actionable recommendation with specific entry gates and measurement criteria.

**3-codex vs 2-cross**: Winner = **3-codex**
  3-codex: total=53, 2-cross: total=46
  Reason: B surfaces the critical build-time vs runtime coupling distinction, grounds claims in more concrete migration case studies (Wix resource scaling, DigitalOcean specifics), calibrates confidence more honestly (Medium vs High given unknowns), and delivers a more appropriately scoped recommendation for an org whose coupling graph and platform capacity are unverified.

**5-codex vs 2-cross**: Winner = **5-codex**
  5-codex: total=53, 2-cross: total=41
  Reason: Analysis A delivers deeper implementation detail from four distinct perspectives, surfaces sharper non-obvious insights like 'atomic source control is not atomic release,' and arrives at a more carefully scoped domain-monorepo pilot recommendation with explicit entry gates and measurement criteria, whereas Analysis B's advocate relies on unsourced claims and the consensus over-indexes toward aggressive consolidation.


## Aggregate Summary

| Config | Avg Coverage (weighted) | Avg Traps Caught | Avg Duration |
|--------|----------------------|-----------------|-------------|
| 1-codex | 90% | 67% | 0s |
| 2-codex | 95% | 61% | 0s |
| 3-codex | 97% | 61% | 0s |
| 5-codex | 92% | 78% | 0s |
| 2-cross | 97% | 89% | 0s |