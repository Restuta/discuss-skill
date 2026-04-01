---
topic: "Should a fintech startup (Series A, 20 engineers, processing $50M/year in transactions) build their own payment processing infrastructure or continue using Stripe? They're currently paying ~$1.5M/year in Stripe fees and expect 3x volume growth in 18 months."
mode: "council"
agent_count: "2"
agent_config: "2-agent"
max_rounds: "5"
git_commit: "none"
agent_cli: "codex"
status: consensus
turn: B
round: 3
created: "2026-04-01T12:14:04.986Z"
last_updated: 2026-04-01T12:22:34.934Z
agent_A_name: "Advocate"
agent_A_cli: "codex"
agent_A_role: "advocate"
agent_B_name: "Skeptic"
agent_B_cli: "codex"
agent_B_role: "skeptic"
---

# Discussion: Should a fintech startup (Series A, 20 engineers, processing $50M/year in transactions) build their own payment processing infrastructure or continue using Stripe? They're currently paying ~$1.5M/year in Stripe fees and expect 3x volume growth in 18 months.

## Participants
- **Agent A** — Advocate (advocate) via codex
- **Agent B** — Skeptic (skeptic) via codex

## Key Questions
1. What is the true total cost of ownership for in-house payment processing vs Stripe at current and projected volumes?
2. What are the regulatory and compliance implications (PCI-DSS, per-country requirements) of each approach?
3. Is there a hybrid approach that captures cost savings without full infrastructure ownership?
4. What is the engineering opportunity cost — what else could those engineers build?

## Research Phase

### Agent A (Advocate) — Independent Research | research

The advocate case is that they should start building their own payments control plane now, because the economics are about to move from “annoying SaaS spend” to a core margin lever. On the numbers in the prompt, they are effectively paying about 3.0% today ($1.5M on $50M). If volume reaches $150M within 18 months and fee economics stay flat, that becomes roughly $4.5M/year. A 50 bps improvement would be worth about $750k/year; 100 bps is $1.5M/year; 150 bps is $2.25M/year. That math is an inference from the prompt, but it is the right frame: once payment fees are multi-millions, infrastructure can become a high-ROI product investment rather than a back-office project.

The opportunity is bigger than pure fee reduction. Owning the payment layer creates negotiating leverage and strategic freedom. Stripe itself is implicitly validating that direction: its pricing page says large-volume businesses can get custom packages with volume discounts, and Stripe now offers both [Vault and Forward API](https://docs.stripe.com/payments/vault-and-forward) and [Orchestration](https://docs.stripe.com/payments/orchestration) so merchants can vault card details once, route to third-party processors, and retry payments across processors. That matters because it turns this from a binary “rip out Stripe or don’t” decision into a staged migration. Even [Stripe pricing](https://stripe.com/us/pricing) now explicitly positions custom pricing for large-volume merchants.

There is also a credible top-line upside. Payments optimization is not just about shaving basis points; it can improve authorization, recovery, and conversion. Stripe claims [Authorization Boost](https://stripe.com/us/authorization) increases acceptance rates by 2.2% on average and can lower card processing costs by up to 2.8% for businesses on custom interchange pricing. Adyen reported that its [US debit routing pilot](https://www.adyen.com/press-and-media/adyens-intelligent-payment-routing-usdebit) across 20+ enterprise merchants produced average cost savings of 26% with a 0.22% authorization-rate uplift, and that some merchants saw much larger savings on those flows. Adyen also says pilots of [Uplift](https://www.adyen.com/press-and-media/adyen-uplift-launch) showed up to 6% conversion improvement and up to 5% payment-cost reduction. Those are vendor claims, not universal outcomes, but they prove the upside ceiling is material.

The strongest success-pattern evidence is from companies that turned payments infra into a growth enabler. Uber’s engineering team said its next-gen payments platform was designed for high reliability, exactly-once processing, strong auditability via double-entry bookkeeping, and the ability to scale to new business lines, payment types, and geographies ([Uber](https://www.uber.com/en-US/blog/payments-platform/)). That is the real prize for a fintech startup: not merely “save on Stripe,” but gain a reusable money-movement platform that supports new products, geographies, rail mixes, risk controls, and finance operations.

The practical upside scenario is incremental: build the ledger, routing, retries, reconciliation, and processor abstraction first; keep Stripe as one rail; then move the highest-volume, lowest-complexity corridors first. If they execute well, they end up with lower processing costs, better auth performance, faster product launches, and more bargaining power with every processor they use.

**Key uncertainty:** the upside depends heavily on transaction mix. If they are mostly domestic card-not-present with low decline variance, savings may be modest. If they have debit, ACH, recurring billing, cross-border, or retryable decline volume, the upside is much larger.

**Confidence:** 74% — the economic upside is real and the migration path is now more proven, but the exact ROI depends on their payment-method mix, decline profile, and how narrowly they define “build.”

### Agent B (Skeptic) — Independent Research | research

The skeptical view is that this startup may be anchoring on the wrong number. Their current Stripe bill is about 3.0% of volume ($1.5M on $50M), but that is not all “recoverable margin.” Stripe’s own explanation of [interchange-plus pricing](https://stripe.com/resources/more/interchange-plus-pricing-explained) says card costs are made up of interchange (issuer bank), network assessments, and processor markup. Building your own stack does not remove interchange or network fees; it mainly attacks markup and bundled services. At projected volume of $150M in 18 months, every 10 basis points is only $150k/year. That matters, but it also means the company can be directionally right that Stripe is expensive while still being wrong that full in-house processing is economically justified. Stripe also explicitly offers [custom pricing, volume discounts, and IC+](https://stripe.com/us/pricing), so the lower-risk move is to renegotiate before taking infrastructure risk.

The biggest downside is scope creep from “we want cheaper payments” into “we accidentally became a regulated payments intermediary.” Visa’s 2026 [Payment Facilitator and Marketplace Risk Guide](https://usa.visa.com/content/dam/VCOM/regional/na/us/partner-with-us/documents/visa-payment-facilitator-and-marketplace-risk-guide.pdf) says payment facilitators and marketplaces are third-party agents that require acquirer sponsorship and registration, and that acquirers must continuously monitor them. Visa’s [TPA registration page](https://partner.visa.com/site/programs/third-party-agent-registration.html) also expects sponsor information and PCI documentation. On the U.S. regulatory side, [FinCEN](https://www.fincen.gov/resources/statutes-regulations/administrative-rulings/definition-money-transmitter-merchant-payment) says whether you are a money transmitter is facts-and-circumstances based; the merchant-processor exemption depends on staying narrowly within payment processing/settlement. If this fintech starts holding funds, routing them, or distributing settlement in new ways, the legal posture can change. The [CSBS MTMA summary](https://www.csbs.org/csbs-money-transmission-modernization-act-mtma) is a reminder that money transmitter regimes still bring net worth, surety bond, and liquidity requirements; as of February 26, 2026, 31 states had adopted the model in full or in part, covering 99% of reported money transmission activity. That is not a side quest for a 20-engineer company.

Security and compliance are another cliff. Visa says all entities that store, process, or transmit Visa account data must comply with PCI DSS, and its [PCI DSS validation guidance](https://usa.visa.com/content/dam/VCOM/regional/na/us/support-legal/documents/pci-dss-validation-best-practice-review.pdf) shows merchants at 1M to 6M Visa transactions are Level 2, while service providers above 300,000 Visa transactions are Level 1 and need annual ROC/AOC validation. Without average ticket size, I cannot tell whether this startup crosses those thresholds today, but at 3x projected growth it becomes plausible fast. PCI scope also does not disappear just because processing is outsourced: the PCI SSC’s 2025 [FAQ](https://www.pcisecuritystandards.org/faq/articles/Frequently_Asked_Question/does-pci-dss-apply-to-merchants-who-outsource-all-payment-processing-operations-and-never-store-process-or-transmit-cardholder-data/) says merchants still retain responsibility for provider oversight and shared controls. If they bring card handling or orchestration in-house, that shared-responsibility burden grows, not shrinks.

Migration and orchestration introduce ugly failure modes. Stripe’s own [Vault and Forward documentation](https://docs.stripe.com/payments/vault-and-forward) warns that multiprocessor flows can accidentally double-capture, Link credentials cannot be transferred between processors, refunds and disputes must be handled with the third-party processor, Stripe cannot guarantee processor responses, and the forwarding API can return HTTP 200 even when the downstream processor returned 400. That is a concise map of what can go wrong in production: idempotency bugs, token-portability gaps, split-brain reconciliation, degraded observability, dispute ownership confusion, and authorization/capture mismatches. The downside scenario is not “we spend six months and save 100 bps.” It is “we spend 12 to 18 months, widen regulatory and PCI scope, dent conversion or settlement reliability during migration, and still remain dependent on sponsor banks, acquirers, and networks.” My conclusion through the risk lens: do not attempt full-stack payment processing unless payments infrastructure is becoming the company’s core product. First exhaust Stripe custom pricing/IC+, and only then consider narrow, corridor-specific routing where savings are proven and compliance scope is controlled.

---

## Discussion

### Round 1 — Advocate | response | confidence: 78%

**Response to previous points:**
Agent B’s strongest point is that the startup may be treating the full `~3.0%` Stripe bill as recoverable when most of it is not. The real risks are not theoretical: PCI scope can expand, sponsor-bank/acquirer dependencies do not disappear, and Stripe’s own vault/forward docs show how multiprocessor setups create double-capture, refund, dispute, and observability failure modes. I agree with B that “become your own processor” is the wrong action for a 20-engineer Series A company. I’m changing my position on that: they should not build full payment processing infrastructure, but they should start building the control plane now so they can renegotiate, route selectively, and avoid deeper lock-in before volume triples.

**New evidence or angle:**
The missing lens is timing and option value. If they wait until volume is already `$150M`, they start the hardest migration exactly when the fee pain and operational stakes are highest; if they build ledger/reconciliation/routing abstractions now while keeping Stripe as a rail, they buy negotiating leverage and future exit optionality at much lower execution risk. The hurdle-rate math is also useful: at projected volume, `50 bps = ~$750k/year` and `100 bps = ~$1.5M/year`, so a small 3-5 engineer payments platform team is only justified if they can prove recurring savings plus auth/conversion gains on specific corridors, not on ideology.

**Current position:**
My position is now: do not build full in-house processing, but do start a hybrid program immediately. Sequence it as `1)` renegotiate Stripe hard on custom/IC+ pricing, `2)` build internal ledger/reconciliation/orchestration primitives, `3)` move only high-volume, low-complexity flows where savings are empirically proven. Confidence is `78%` because B’s compliance/TCO objections are strong, but they argue against full-stack ownership, not against building strategic payment leverage.

**Key question for the group:**
What share of the current `~300 bps` effective cost is actually Stripe markup/bundled services versus unavoidable interchange/network cost, and which transaction corridors could realistically yield `>=75-100 bps` net savings without expanding regulatory scope?

### Round 1 — Skeptic | response | confidence: 82%

**Response to previous points:**
Agent A’s revised argument is much stronger than the original pro-build case: do not become a processor, but start building only the internal control-plane pieces that create leverage and reduce future lock-in. I agree with that synthesis in principle, and I’ve shifted slightly from Agent B’s earlier “mostly don’t build” stance to “build only a very thin layer, if the economics are proven first.” Where I still disagree with Agent A is timing and scope. Agent B’s earlier point remains: most of the `~300 bps` is not recoverable, so a premature platform effort can easily chase the wrong savings number. Once they own routing, retries, reconciliation, and ledger correctness, they also own a 24/7 payments surface with incident response, finance ops, dispute handling, and audit obligations. For a 20-engineer Series A team, that only makes sense after Stripe renegotiation is exhausted and after they can name specific corridors with `>=75-100 bps` net savings after extra headcount and migration risk.

**New evidence or angle:**
The missing cost is organizational, not just technical. Even a “hybrid” payments layer usually implies a standing cross-functional burden: engineering, payments ops, finance/reconciliation, compliance/security, and legal/vendor management. The breakeven test therefore should not be “can we save `50-100 bps` gross?” but “can one narrowly scoped routing/reconciliation program produce savings that still beat a fully loaded platform team plus one bad-quarter worth of auth-rate regression or migration defects?” If the answer is no, the control plane is a strategic hobby, not a margin lever.

**Current position:**
Continue using Stripe as the primary processor, renegotiate aggressively now, and only build the minimum internal abstractions needed for reconciliation, observability, and future processor optionality. I am still against a near-term program to “build our own payment processing infrastructure.” Confidence is `82%` because Agent A correctly narrowed the target, but the hidden operating cost and failure surface still make premature platform work easy to over-justify.

**Key question for the group:**
After Stripe custom pricing or IC+ renegotiation, which exact transaction corridors still show `>=75 bps` net savings at enough volume to repay a dedicated payments platform team within 12 months?

### Round 2 — Advocate | response | confidence: 83%

**Response to previous points:**
Agent B’s strongest argument is that the real trap is not technical ambition but false economics: if most of the `~300 bps` is interchange/network cost, then a broad payments-platform effort becomes a permanent engineering, ops, compliance, and incident-response burden without enough recoverable margin. I agree, and I’ve changed my mind on full-stack ownership because B showed the gross-savings frame was too loose. Where I disagree with B is sequencing: waiting for Stripe renegotiation before building any internal capability leaves the company with weak leverage and poor visibility into corridor-level economics. The synthesis with my Round 1 view is narrower: do not build “payment processing infrastructure,” but do start a tightly scoped payments control-plane program now so finance and engineering can quantify recoverable markup, decline losses, and pilotable corridors before volume triples.

**New evidence or angle:**
The cleanest frame is real options, not architecture. They do not need to commit to becoming a processor; they need to buy decision quality. A 90-day program with `2-3` engineers plus finance/compliance support can produce four concrete outputs: `1)` fee waterfall by corridor, `2)` auth/decline loss map, `3)` external quotes from alternative processors/acquirers, and `4)` a single pilot business case with explicit kill criteria. That is a materially cheaper bet than either extreme: blindly accepting another `~$3M/year` of incremental Stripe fees at 3x volume, or prematurely standing up a full payments stack. If no corridor clears the hurdle after renegotiation, stop. If one does, pilot it.

**Current position:**
They should keep Stripe as the primary processor, renegotiate immediately, and launch a thin, time-boxed leverage program now. I am against building full in-house processing infrastructure, but I am also against doing nothing beyond vendor negotiation. Confidence is `83%` because Agent B’s risk case is strong enough to rule out broad ownership, but the opportunity cost of waiting is also real once payments spend is on track to become a multi-million-dollar annual margin line.

**Key question for the group:**
Can they identify, within 90 days, at least one transaction corridor representing meaningful volume that still shows `>=100 bps` net savings after team cost and migration risk, without expanding money-transmission or PCI scope materially?

### Round 2 — Skeptic | response | confidence: 85%

**Response to previous points:**
Agent A’s strongest argument is now well-framed: the real risk is not “Stripe is expensive,” it is waiting until volume is `~$150M` before developing any leverage or corridor-level visibility. I agree with A that a binary choice between “stay on Stripe forever” and “become your own processor” is the wrong frame, and I’ve changed my mind slightly in that direction. Where I still disagree is on what should start now: I do not think they should begin building a payments control plane yet. The most important open questions are still unresolved: how much of the current `~300 bps` is actually recoverable after Stripe custom pricing/IC+, and whether any single corridor can clear `>=75-100 bps` net savings after team cost, migration risk, and auth-rate downside.

**New evidence or angle:**
The missing angle is irreversibility. A thin internal payments layer sounds modest, but once a startup owns ledger, routing, retries, or reconciliation in production, the burden becomes system-wide while the savings are only corridor-specific. That asymmetry matters. The lowest-risk third option is a 90-day decision program, not a build program: `1)` renegotiate Stripe, `2)` run an RFP with alternative processors/acquirers, `3)` instrument fee/auth/decline economics by corridor, and `4)` perform token-portability/compliance review. That buys most of the decision quality A wants without prematurely creating an on-call platform that will try to justify its own existence.

**Current position:**
Keep Stripe as the primary processor, renegotiate immediately, and run a tightly scoped discovery/commercial program now. Do not start building payment infrastructure beyond minimal instrumentation until one corridor shows a credible 12-month payback with conservative assumptions. Confidence is `85%` because Agent A is right that passivity is a mistake, but I still see the highest-probability failure mode as starting engineering before the economics are proven.

**Key question for the group:**
After Stripe IC+/custom pricing and at least one external processor quote, what is the all-in net annual savings of the single best corridor after subtracting platform headcount, compliance/ops overhead, and a conservative reserve for auth-rate regression?

### Round 3 — Advocate | response | confidence: 86%

**Response to previous points:**
Agent B’s strongest point is the asymmetry: once a startup puts routing, ledger, or retries into production, the operating burden is system-wide and permanent, while the savings may be narrow and corridor-specific. That evidence changed my mind away from any near-term “build our own processor” path. Where I still disagree with B is on sequencing. I agree with Agent A’s narrower view that passivity is also expensive: the two real open questions are `1)` how much of the current `~300 bps` remains recoverable after Stripe IC+/custom pricing, and `2)` whether any single corridor still clears `>=75-100 bps` net savings after headcount, compliance, and auth-risk. My synthesis is: do the commercial discovery first, but start only no-regrets internal work in parallel, not production payment ownership.

**New evidence or angle:**
The unpriced risk cuts both ways: lock-in compounds over time. If they wait until volume is `~$150M` to map token portability, fee telemetry, reconciliation data models, and alternate processor terms, they will negotiate from maximum dependency and minimum time. That argues for a very small reversible prep layer now: corridor-level cost instrumentation, reconciliation schemas, and a portability/vendor-readiness exercise. None of that requires owning processing, touching card data more deeply, or expanding money-transmission scope, but it preserves option value if one corridor later proves out.

**Current position:**
They should continue using Stripe as the primary processor, renegotiate immediately, and run a 90-day decision program with one hard gate: no production routing or settlement logic unless a specific corridor shows `>=100 bps` net savings after Stripe repricing and conservative overhead assumptions. I support starting only reversible, processor-agnostic prep work now because it improves leverage without committing the company to a permanent payments platform. `86%` because the compliance/TCO evidence clearly rules out full-stack ownership, and the remaining disagreement is now mostly about when minimal engineering starts.

**Key question for the group:**
Can we agree on an explicit boundary for “no-regrets work now” versus “gated work later” by naming the exact tasks that may start immediately without increasing PCI/regulatory scope?

**Convergence assessment:** CONVERGING — both agents now reject full in-house processing and support Stripe-first plus immediate renegotiation/discovery; the remaining gap is whether reversible engineering prep starts now or only after one corridor proves `>=75-100 bps` net savings.

---

## Consensus Summary

### Decision
The council’s consensus is that the startup should not build full in-house payment processing infrastructure now and should continue using Stripe as its primary processor. Instead, it should immediately renegotiate Stripe pricing, run a 90-day discovery/commercial program, and only consider a narrowly scoped hybrid path if a specific transaction corridor still shows at least `>=100 bps` net savings after Stripe repricing, headcount, compliance/ops overhead, and conservative auth-rate risk. Reversible “no-regrets” work such as corridor-level cost instrumentation, reconciliation data modeling, and portability/vendor-readiness prep is acceptable; owning production routing, settlement, or processor logic is not.

### Key Contention Points

| # | What Was Debated | Resolution | Who Had the Strongest Case & Why |
|---|-----------------|------------|----------------------------------|
| 1 | Full in-house payments infrastructure vs staying on Stripe | Full in-house ownership was rejected; Stripe remains the primary processor. | Skeptic had the strongest case because they showed most of the current `~300 bps` is not recoverable, and highlighted PCI, sponsor-bank, money-transmission, dispute, and operational risks that a 20-engineer Series A team is poorly positioned to absorb. |
| 2 | Whether the company should start building internal payments capabilities now | Only reversible prep work should start now; no production routing, settlement, or processor abstraction should go live until economics are proven. | Advocate had the strongest case on timing because they framed early prep as option value: waiting until volume reaches `~$150M` would increase lock-in and weaken negotiating leverage. |
| 3 | What economic threshold justifies any hybrid move away from Stripe | The bar is high: after Stripe IC+/custom pricing and external quotes, at least one corridor must show `>=100 bps` net savings with a credible 12-month payback. | Skeptic had the strongest case because they shifted the conversation from gross fee savings to true net savings after team cost, compliance/ops burden, and migration/auth regression risk. |

### Unresolved Items & Risks
- The company still does not know how much of the current `~$1.5M/year` Stripe spend is recoverable after custom pricing or IC+.
- It remains unproven whether any single high-volume corridor can clear the `>=100 bps` net-savings hurdle.
- PCI scope, token portability limits, refund/dispute handling, and authorization-rate regression remain major migration risks even in a hybrid model.
- The exact boundary between acceptable “no-regrets” prep work and scope-expanding production infrastructure should be explicitly documented before engineering starts.

### Confidence: High
Both agents converged on the core answer: reject full in-house processing, keep Stripe, renegotiate now, and gate any hybrid buildout behind hard corridor-level economics and compliance discipline.
