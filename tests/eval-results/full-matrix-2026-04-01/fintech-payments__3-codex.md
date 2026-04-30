---
topic: "Should a fintech startup (Series A, 20 engineers, processing $50M/year in transactions) build their own payment processing infrastructure or continue using Stripe? They're currently paying ~$1.5M/year in Stripe fees and expect 3x volume growth in 18 months."
mode: "council"
agent_count: "3"
agent_config: "3-agent"
max_rounds: "5"
git_commit: "none"
agent_cli: "codex"
status: consensus
turn: B
round: 3
created: "2026-04-01T09:04:53.994Z"
last_updated: 2026-04-01T09:13:28.376Z
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

# Discussion: Should a fintech startup (Series A, 20 engineers, processing $50M/year in transactions) build their own payment processing infrastructure or continue using Stripe? They're currently paying ~$1.5M/year in Stripe fees and expect 3x volume growth in 18 months.

## Participants
- **Agent A** — Advocate (advocate) via codex
- **Agent B** — Skeptic (skeptic) via codex
- **Agent C** — Synthesizer (synthesizer) via codex

## Key Questions
1. What is the true total cost of ownership for in-house payment processing vs Stripe at current and projected volumes?
2. What are the regulatory and compliance implications (PCI-DSS, per-country requirements) of each approach?
3. Is there a hybrid approach that captures cost savings without full infrastructure ownership?
4. What is the engineering opportunity cost — what else could those engineers build?

## Research Phase

### Agent A (Advocate) — Independent Research | research

The upside case for building is real, but only if “build your own” means “own the payment control plane and economics,” not “become Stripe from scratch in 12 months.” At $50M in annual volume and ~$1.5M in Stripe fees, they are already spending about 3% of volume on payments. If volume triples in 18 months, that becomes roughly $4.5M/year. Stripe’s public standard online rate is 2.9% + 30c, and Stripe explicitly offers custom `IC+`, volume discounts, and country-specific pricing for larger merchants ([Stripe pricing](https://stripe.com/us/pricing)). That matters because it proves two things: first, their current fee line is economically material; second, some of it is negotiable processor margin rather than immutable network cost. The Nilson Report said U.S. merchants paid $187.2B in processing fees in 2024, or $1.57 per $100 of card payments on average ([Nilson](https://www.globenewswire.com/news-release/2025/03/19/3045828/0/en/Merchant-Processing-Fees-in-the-Unites-States-Exceeded-187-Billion-in-2024.html)). Their 3% effective cost suggests there may be meaningful room to reclaim basis points if they control routing, pricing, retries, and settlement more directly. My inference, not a sourced fact: at $150M/year, even 30 to 50 bps of durable savings is $450k to $750k annually, which can justify a focused team.

The strongest pro-build argument is not fee reduction alone. It is strategic control. Owning the stack unlocks custom ledgering, smarter routing by issuer/country/risk, tighter reconciliation, better unit economics reporting, and product speed for fintech-specific workflows. Stripe’s own product roadmap is evidence that sophisticated merchants want this: Stripe now documents a Vault and Forward API that stores card details in Stripe’s PCI-compliant vault and forwards them to other processors, and an Orchestration product that routes payments across processors based on rules like card country, currency, and amount, with retries to another processor on failure ([Vault and Forward](https://docs.stripe.com/payments/vault-and-forward), [Orchestration](https://docs.stripe.com/payments/orchestration/route-payments)). In other words, even Stripe is productizing the transition from “single PSP” to “merchant-owned payment architecture.” That is a big opportunity for this startup: they do not need a cliff migration. They can keep Stripe-hosted card collection initially, preserve lower PCI scope, and still start internalizing routing, token ownership, ledger, risk logic, and non-card rails.

There are credible success patterns. Shopify said merchant solutions, driven largely by Shopify Payments and related financial products, were 76% of total revenue in 2025; Shopify Payments is described as a “fully integrated payment solution” ([Shopify 2025 filing](https://www.sec.gov/Archives/edgar/data/1594805/000159480526000007/shop-20251231.htm)). Toast’s filing says its ability to attract and retain customers depends in part on offering payment processing “with the desired functionality at an attractive price,” and that its all-in-one platform with payments offers customers “significant advantages” ([Toast 2025 annual report](https://www.sec.gov/Archives/edgar/data/1650164/000165016425000140/toastinc_arx2025xv3final.pdf)). Adyen’s 2025 annual report ties a single platform and licensed infrastructure to customer “efficiency, resilience, and control,” access to local rails, and ownership of payments and data ([Adyen 2025 annual report](https://investors.adyen.com/financials/2025)). Those are not tiny startups, but they show the upside logic: payments can become moat, margin engine, and product substrate, not just vendor spend.

The key uncertainty is scope. If they literally mean full in-house processing, acquiring, compliance, network relationships, disputes, and global coverage, that is probably too much for a 20-engineer Series A team. If they mean a staged hybrid build that starts now and makes Stripe one processor among others, the upside is compelling. Stripe-hosted flows currently keep them in lighter PCI paths such as SAQ A, while handling card data themselves can escalate requirements materially; PCI thresholds are transaction-count based, and Level 1 starts above 6 million Visa/Mastercard transactions annually ([Stripe PCI guide](https://stripe.com/guides/pci-compliance)). But that is exactly why the opportunity is now: build before the scale arrives, while they still have time to choose which layers to own deliberately.

### Agent B (Skeptic) — Independent Research | research

Skeptical view: a Series A fintech with 20 engineers should assume that “build our own payments stack” is a trap unless a line-item fee analysis proves that most of the current $1.5M is truly Stripe markup, not unavoidable network cost. Today they are paying an effective ~3.0% on $50M. At 3x volume that becomes ~\$4.5M if nothing changes, but Stripe already offers custom pricing, IC+ pricing, and volume discounts for larger customers, so the relevant comparison is not “current Stripe list price vs. self-build,” it is “renegotiated enterprise Stripe deal vs. self-build” (Stripe pricing: https://stripe.com/us/pricing; IC+ support note: https://support.stripe.com/questions/understanding-ic-fees). Stripe’s own IC+ documentation distinguishes Stripe fees from network costs, which is the key skeptical point: building your own processor does not eliminate interchange and network fees. If only a minority of the \$1.5M is negotiable margin, the savings case may collapse before the project starts.

The compliance downside is much worse than most product teams estimate. Once they stop being “a merchant using Stripe” and start behaving like a gateway, processor, or other payment service provider, PCI scope expands materially. PCI SSC says service providers cannot rely on the lighter merchant SAQs; the only SAQ path for service providers is SAQ D, and service providers that indirectly facilitate storage/processing/transmission are still in scope (PCI SSC FAQs 1578 and 1579: https://www.pcisecuritystandards.org/faqs/1578/ and https://www.pcisecuritystandards.org/faqs/1579/). Mastercard classifies all third-party processors and all merchant payment gateways as Level 1 service providers, requiring an annual ROC by a QSA (https://www.mastercard.com/us/en/business/cybersecurity-fraud-prevention/site-data-protection-pci.html). That means this is not “some extra compliance work”; it is a permanent security/compliance program with audit, evidence collection, vendor management, and production-control rigor.

Regulatory scope is another failure mode. If they touch fund flows in the wrong way, “payment processor” exemptions are narrower than startup decks suggest. FinCEN explicitly treats money transmission status as facts-and-circumstances and says the payment-processor exemption requires a formal agreement with the seller/creditor and operation through a clearance/settlement system; it is not a blanket safe harbor for “we move money as software” (https://www.fincen.gov/resources/statutes-regulations/administrative-rulings/administrative-ruling-whether-company-offers). If this startup’s model involves holding funds, split settlements, platform payouts, or merchant-of-record-like behavior, legal complexity can outrun engineering complexity very fast.

Operationally, the ugly scenario is dual-running systems during hypergrowth. Stripe’s own vault-and-forward docs are instructive: if you route card data to another processor, post-transaction actions like refunds and disputes become your responsibility with that processor, and Stripe cannot guarantee the downstream processor’s response behavior (https://docs.stripe.com/payments/vault-and-forward). In other words: once you decompose the stack, outages, reconciliation drift, dispute workflows, and support escalations become multi-party incidents. You also lose embedded advantages such as Radar’s fraud models trained on Stripe-wide data (https://stripe.com/radar/pricing). At \$150M annualized volume, even a 30 bps increase in fraud/dispute loss or approval-rate deterioration is \$450k/year in damage, enough to erase much of the hoped-for savings.

My bottom-line skeptical conclusion: the downside case is they spend 9-18 months building, add permanent PCI/regulatory overhead, distract a small engineering org during 3x growth, and discover the real savings were far smaller than forecast because network costs persisted and risk/ops costs moved in-house. The burden of proof is on the self-build case, not on Stripe.

---

## Discussion

### Round 1 — Advocate | response | confidence: 74%

**Response to previous points:**
Agent B’s strongest argument is that “$1.5M in Stripe fees” is not the same as “$1.5M available to save.” That is the right caution, because interchange/network costs persist, while PCI/service-provider scope, dispute ops, and regulatory exposure can become permanent overhead. I agree with that core point.

Where I disagree is on the implied choice set. The real decision is not “Stripe forever” vs. “become a processor.” It is whether they should start building the payment control plane now so that Stripe stops being their only economic and operational dependency before volume hits ~$150M/year. On the evidence both agents surfaced, Stripe itself now supports that middle path via Vault/Forward and Orchestration. So my synthesis is: do not build full-stack acquiring/processing infrastructure now, but do start building the layers that create leverage: internal ledgering, processor abstraction, routing rules, reconciliation, retry logic, and commercial optionality.

I’d like Agent C to pressure-test that distinction, because it resolves the biggest open question: how much user value and margin can they capture without crossing into “we are now a regulated payments company” territory?

**New evidence or angle:**
New angle: timing and negotiating leverage. Even if they never fully leave Stripe, building a credible multi-processor architecture changes the commercial conversation. At projected 3x growth, waiting until they are already at ~$150M/year is the worst time to start, because they will be migrating during hypergrowth with less room for mistakes. Starting now creates option value: they can renegotiate Stripe from a position of credible exit, test a second processor on a narrow slice, and stop if realized savings are too small.

A practical decision rule seems missing from the discussion: if a 60-90 day discovery shows recoverable savings after enterprise repricing are only, say, <30-40 bps, they should not build beyond abstraction basics. If recoverable savings are >50 bps with measurable approval-rate or reconciliation upside, the hybrid build is easier to justify.

**Current position:**
Build selectively, not end-to-end. Confidence is 74% because the economic incentive is already material and grows fast with volume, but Agent B is right that a literal “build our own processor” move is too risky for a 20-engineer Series A company. The opportunity is in owning strategy and routing, not replacing every Stripe function.

**Key question for the group:**
What is the realistic net savings range after enterprise Stripe repricing, keeping interchange/network costs constant and adding the fully loaded cost of a 3-5 person payments platform team plus PCI/compliance overhead?

### Round 1 — Skeptic | response | confidence: 78%

**Response to previous points:**
Agent A’s strongest point is the reframing: the real choice is not “Stripe forever” vs. “become Stripe,” but whether to build enough payment control-plane capability to create negotiating leverage and reduce single-vendor dependence before volume reaches ~$150M/year. I agree that this is the right decision frame, and it is the best synthesis so far.

Where I still disagree with Agent A is on how “lightweight” that middle path may be in practice. A processor abstraction sounds modest, but once it owns routing, retries, reconciliation, token portability, refunds, and dispute handoff, it is no longer a thin layer. The failure mode is building 60-70% of the complexity while only capturing 20-30% of the savings. Agent B’s core objection still stands: the comparison must be against a repriced Stripe contract, not today’s fee line, and the savings case is unproven until they decompose the $1.5M into interchange/network costs, Stripe markup, fraud tooling, dispute ops, and international/local-method mix.

So my synthesis is narrower than Agent A’s: build only the minimum internal capabilities that improve negotiating leverage and observability first, not routing in production. Concretely: fee decomposition, processor-agnostic internal ledger/reconciliation, and token-migration readiness. I want Agent C to test whether “hybrid” remains attractive if the first 6 months produce no meaningful basis-point savings after enterprise repricing.

**New evidence or angle:**
New angle: the real gating variable is not annual volume alone, but transaction shape. A 3% effective cost can mean very different things depending on average ticket size, payment-method mix, cross-border share, card-present vs. card-not-present, and dispute/fraud profile. If they have low AOV and many transactions, fixed per-transaction fees matter; if they have high AOV, basis points dominate. That means the current debate is under-specified: a $50M business with 500k transactions behaves very differently from a $50M business with 10M transactions, both economically and for PCI/service-provider thresholds. Until the company models savings by payment-method cohort, any ROI estimate is too coarse to drive an infrastructure decision.

**Current position:**
Do not build in-house processing infrastructure now, and do not assume a hybrid routing layer is automatically justified. I support a staged option-creation plan only if a short discovery proves likely net savings after repricing exceed the full cost of a 3-5 person team plus added compliance/ops burden. Confidence is 78% because the downside risks are concrete and near-term, while the upside still depends on an unproven fee decomposition.

**Key question for the group:**
What portion of the current $1.5M annual Stripe spend is actually recoverable processor markup after repricing, broken down by transaction count, average order value, payment method, geography, and fraud/dispute costs?

### Round 2 — Advocate | response | confidence: 81%

**Response to previous points:**
Agent B’s strongest argument is that the real comparison is not “today’s Stripe bill vs. self-build,” but “repriced Stripe plus unchanged interchange/network costs vs. a new permanent compliance/ops burden.” I’ve moved toward that view. B is also right that a “hybrid layer” stops being lightweight the moment it owns live routing, refunds, disputes, and retries across processors.

So my position has narrowed: I no longer support early production routing as the default next step. The action I still support is a phase-1 build of non-regret capabilities only: cohort-level fee decomposition, internal ledger/reconciliation, processor-agnostic payment domain models, and token-portability readiness while keeping Stripe-hosted flows. That preserves the strategic-control upside I argued for earlier without prematurely accepting service-provider-like complexity. Agent C should pressure-test whether that phased approach actually captures most of the option value B is worried we’d destroy by moving too fast.

**New evidence or angle:**
The missing angle is reversibility. Some investments are reversible and valuable even if they stay on Stripe: fee telemetry by AOV/payment-method/geography, reconciliation automation, and contract/token portability. Others are hard to reverse and immediately operationalize risk: live auth routing, direct processor integrations, and owning post-transaction workflows. For a 20-engineer team during 3x growth, that distinction matters more than the slogan “build vs. buy.”

Simple economics sharpen it: at $150M/year, every 10 bps is only $150k. So “fees feel high” is not enough. The case for phase 2 likely needs something like 50+ bps of durable net savings, or a combination of savings plus measurable approval-rate/product benefits, after repricing Stripe and including team/compliance cost.

**Current position:**
Do not build full payment processing infrastructure. Do start a 60-90 day phase to reprice Stripe, decompose current fees by transaction cohort, and build the internal observability/reconciliation/token-portability foundation. Only proceed to live multi-processor routing if that phase proves a durable economic or approval-rate advantage above a predefined threshold. Confidence is 81% because Agent B’s evidence materially weakens the case for early routing, but the option value of the non-regret layers still looks strong.

**Key question for the group:**
What exact phase-2 gate should we endorse: a net basis-point threshold, an approval-rate lift threshold, or a combined hurdle, and what number is high enough to justify moving from observability/abstraction into live routing?

### Round 2 — Skeptic | response | confidence: 84%

**Response to previous points:**
Agent A’s strongest move was narrowing the recommendation from “hybrid routing” to “reversible, non-regret capabilities first.” I agree with that shift, and I’ve changed my mind slightly because it separates option creation from operational exposure. I also think Agent A is right that live routing should not be the default next step.

My remaining disagreement is about sequencing. Even “token portability readiness” and processor abstraction can become premature engineering if the economics are weak after repricing. So I’d tighten the plan further: first do a 60-90 day no-code discovery with Stripe repricing, 1-2 competitive processor quotes, cohort-level fee decomposition, approval-rate baselines, and legal/compliance scoping. Only then decide whether internal ledger/reconciliation tooling is enough, or whether more platform work is justified. Agent C should synthesize the gate here, because the group is converging on “not full self-build,” but not yet on what evidence is strong enough to fund phase 2.

**New evidence or angle:**
New angle: the right unit of analysis is not total GMV, but migratable GMV. A basis-point saving on total volume is misleading if only a subset can realistically move off Stripe in the next 12 months without breaking product flows or expanding regulatory scope. If, for example, only certain geographies, card cohorts, or payment methods are portable, then the savings case must be modeled on that cohort alone, with fraud loss, dispute ops, and approval-rate effects attached to that same cohort. That makes the hurdle materially harder than the discussion has implied.

**Current position:**
Do not build in-house payment processing infrastructure. I now support a staged path, but only if phase 1 is mostly commercial, analytical, and legal discovery rather than building routing infrastructure. Confidence is 84% because the downside of overbuilding is concrete, while the manageable path is now clearer: prove recoverable value on migratable volume before adding payment-platform complexity.

**Key question for the group:**
What is the annualized net benefit on the realistically migratable volume, after Stripe repricing, alternative processor quotes, fraud/dispute effects, and the full cost of a 3-5 person team plus compliance overhead?

### Round 3 — Advocate | response | confidence: 83%

**Response to previous points:**
Agent B’s strongest argument is the `migratable GMV` test: savings should be modeled on the subset of volume they can realistically move without triggering major new regulatory or operational exposure, not on total GMV. I agree, and that changed my view. It makes any broad “we’ll save 50 bps on $150M” claim too loose. I also agree with Agent B that live routing, refunds, and dispute ownership are premature for a 20-engineer Series A company.

Where I still disagree with Agent B is on making phase 1 mostly no-code. A pure discovery phase produces a memo, but not much leverage. The third option is a two-track phase 1: commercial/legal discovery in parallel with 1-2 non-regret builds that are valuable even if Stripe remains the only processor. Concretely: cohort-level fee/recovery telemetry and an internal reconciliation/ledger layer. Those help finance, ops, and product immediately, and they shorten future migration time without putting live auth routing into production. Agent C should synthesize whether that narrower build set captures most of the option value while staying inside B’s risk threshold.

**New evidence or angle:**
New angle: time-to-option matters almost as much as basis points. With 3x growth expected in 18 months, the cost of waiting is not just lost savings; it is entering hypergrowth with weak payment observability, brittle reconciliation, and no clean way to test alternatives. A 90-day phase that ships nothing leaves them more informed but not more capable. A 90-day phase that ends with cohort economics, processor quotes, and production-grade internal payment telemetry creates a real option whether they ever multi-home or not.

**Current position:**
Do not build full payment processing infrastructure, and do not start live multi-processor routing yet. I support an immediate 60-90 day phase with two outputs: 1) hard economics on repriced Stripe vs. migratable-volume alternatives, and 2) non-regret internal payment primitives that improve reconciliation and decision quality even if they stay on Stripe. Confidence is 83% because Agent B’s risk case is strong, but “analyze first, build nothing” still underweights the value of capability-building before hypergrowth.

**Key question for the group:**
Should phase 1 explicitly include shipping two internal capabilities now, `cohort-level payment telemetry` and `processor-agnostic reconciliation/ledgering`, or do we recommend a discovery-only phase before any engineering work?

**Convergence assessment:** CONVERGING — positions are within ~80% agreement on “no full self-build now” and “use a staged path.” The remaining gap is sequencing: whether phase 1 should be discovery-only, as Agent B prefers, or discovery plus a very small set of non-regret internal builds, which I think is the highest-value action.

---

## Consensus Summary

### Decision
Continue using Stripe as the primary payment processor and do not build full in-house payment processing infrastructure. Start a 60-90 day phase now that does two things in parallel: reprice Stripe and collect alternative processor quotes on migratable GMV, while shipping only two non-regret internal capabilities, `cohort-level payment telemetry` and `processor-agnostic reconciliation/ledgering`. Only approve live multi-processor routing if that phase proves a hard economic win on migratable volume after team, compliance, fraud, dispute, and ops costs; otherwise stay on Stripe and use the new data to negotiate better terms.

### Key Contention Points

| # | What Was Debated | Resolution | Who Had the Strongest Case & Why |
|---|-----------------|------------|----------------------------------|
| 1 | Whether the startup should replace Stripe to save fees | Do not replace Stripe now; the correct comparison is against a repriced Stripe contract, not today’s bill, and full self-build is unjustified for a 20-engineer Series A team. | Skeptic had the strongest case because they grounded the decision in true recoverable savings, not gross fees, and showed that interchange/network costs and permanent compliance overhead do not disappear. |
| 2 | Whether a hybrid path is better than Stripe-only or full self-build | Yes, but only as a staged option-building path, not live routing from day one. The company should own observability and reconciliation first, not auth routing, refunds, disputes, or processor operations. | Advocate had the strongest case because they reframed the choice from a false binary into a control-plane strategy and identified the narrow set of capabilities that create leverage without taking on full processor complexity. |
| 3 | How to measure ROI for any future migration | Model savings on `migratable GMV`, not total GMV, and require a predefined hurdle before phase 2. A practical gate is net savings of roughly 50+ bps on migratable volume and/or a clear approval-rate gain after fully loaded costs. | Skeptic had the strongest case because `migratable GMV` is the most decision-useful unit; it prevents the company from justifying a large build on savings that are not actually portable. |
| 4 | Whether phase 1 should be discovery-only or include engineering work | Phase 1 should include limited engineering work, but only non-regret work that pays off even if Stripe remains the sole processor. Discovery alone is too passive given expected 3x growth in 18 months. | Advocate had the strongest case because they identified reversible investments that improve finance/ops immediately and shorten future migration time without triggering the operational risks tied to live multi-processor routing. |

### Unresolved Items & Risks
- The discussion still lacks the actual breakdown of the current $1.5M annual Stripe spend into interchange, network fees, Stripe markup, fraud tooling, disputes, and international/payment-method mix.
- The recommended hurdle for phase 2 is directionally clear but not yet company-approved; leadership should set it before the 60-90 day phase starts.
- Legal and compliance scope remains a material risk if future plans expand beyond telemetry/reconciliation into routing, token forwarding, fund flows, or post-transaction ownership.
- Opportunity cost is real: even the narrow phase-1 build takes engineering time away from product growth work, so it must stay tightly scoped.

### Confidence: High
Both agents converged on the core answer: no full self-build now, preserve Stripe, and use a tightly scoped staged plan to earn the right to any deeper payments infrastructure investment.
