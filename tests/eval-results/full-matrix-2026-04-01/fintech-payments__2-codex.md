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
created: "2026-04-01T08:55:12.288Z"
last_updated: 2026-04-01T09:04:53.992Z
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

The strongest upside case for building is that payments is about to become too large a margin line to leave as a bundled black box. On the numbers given, the company is paying an effective ~3.0% of volume today ($1.5M on $50M). If volume reaches $150M in 18 months and fee economics do not improve, that becomes roughly $4.5M/year. Stripe’s own pricing shows standard U.S. card pricing at `2.9% + 30¢`, while larger merchants can move to custom structures including IC+ pricing, volume discounts, and even Stripe’s “Vault and Forward API” to route payments to other processors while keeping card vaulting in place (https://stripe.com/us/pricing). That is important evidence: the market already assumes sophisticated merchants will unbundle payments over time. A phased build is not exotic; it is a normal maturity path.

There is also a clear economic gap to attack. The Nilson Report said U.S. merchants paid a weighted average of `1.57%` in card-processing fees in 2024 (https://www.globenewswire.com/news-release/2025/03/19/3045828/0/en/Merchant-Processing-Fees-in-the-United-States-Exceeded-187-Billion-in-2024.html). The Federal Reserve’s 2024 debit data shows average covered debit interchange around `0.47%` across all networks and `0.44%` for covered Visa debit transactions, with all-network debit at `0.73%` of average ticket value (https://www.federalreserve.gov/paymentsystems/regii-average-interchange-fee.htm). Those are not apples-to-apples with every fintech flow, but they do show a basic truth: not all of a 3% effective bill is irreducible network cost. There is real markup, routing, and mix optimization value sitting on the table. If the company can reclaim even `50–150 bps` on selected volume over time, that is roughly `$750k–$2.25M` of annual gross-profit improvement at `$150M` volume.

The opportunity is not just cheaper processing. It is a better payments engine. Adyen’s published cost-optimization data shows what can happen when payments becomes a first-class capability: `26%` lower payment cost from intelligent routing on U.S. debit, `49%` average savings from local payment methods versus cards, `6%` higher authorization rates from network tokens, and `16.5%` lower standard payment fees from enhanced scheme data; Adyen also cites FlixBus reducing U.S. bank declines by `21%` through local acquiring (https://www.adyen.com/landing/save-cost-on-payments). That is the upside scenario here: more approvals, fewer false declines, lower network fees, and more control over retries, fraud rules, and settlement behavior. Payments stops being a tax and becomes an optimization surface.

There are also success-case precedents for turning payments into a moat. Shopify’s Q3 2025 filing says Shopify Payments generated `$518M` of quarterly revenue, with `65%` penetration and `$60.2B` of GMV processed in that quarter alone (https://www.sec.gov/Archives/edgar/data/1594805/000159480525000089/shop-20250930.htm). The lesson is not “be Shopify.” It is that once a company owns the payments control plane, payments can drive retention, monetization, product expansion, and pricing power. Even Stripe’s own Authorization Boost markets payments optimization as economically material, claiming `2.2%` higher acceptance on average and up to `2.8%` lower processing costs on custom IC+ pricing (https://stripe.com/authorization-boost). That reinforces the advocate view: optimization is worth real money.

The main uncertainty is scope. This only works if “build” means owning the control plane first: routing, ledgering, reconciliation, token strategy, payment-method mix, and processor abstraction, while continuing to rent regulated edges where necessary. It does not require becoming Visa. But if the company waits until it is already at $150M volume, it will pay the same learning-curve cost at 3x the transaction scale. The upside case is that now is exactly the right time to start.

### Agent B (Skeptic) — Independent Research | research

At face value, $1.5M/year in Stripe fees on $50M of volume makes “build our own” sound inevitable. The skeptical view is that this framing is usually wrong: it treats the whole fee stack as recoverable engineering margin when a large share is not. Stripe’s public pricing says large-volume businesses can get [custom packages with IC+ pricing and volume discounts](https://stripe.com/pricing), and Stripe’s own interchange explainer says [interchange is typically 70% to 90% of card processing fees](https://stripe.com/us/resources/more/interchange-fees-101-what-they-are-how-they-work-and-how-to-cut-costs). If that range is even directionally right here, the truly addressable savings pool is not the full $1.5M today or $4.5M at 3x growth; it is roughly 10% to 30% of that. That implies maybe ~$150k-$450k/year now, and ~$450k-$1.35M/year at 3x volume, before adding new costs. Also, their observed 3.0% effective fee does not tell us the payment mix or transaction count; that uncertainty matters a lot, because the economics differ sharply between mostly-US cards, ACH-heavy flows, international cards, marketplaces, and stored credentials.

The biggest downside scenario is that they accidentally promote themselves from “merchant using Stripe” to “payment infrastructure provider” without staffing, controls, or licenses to match. PCI SSC says SAQ A is only available when the payment page elements come entirely from the validated third party, while direct-post flows expand scope to [SAQ A-EP](https://www.pcisecuritystandards.org/faqs/1291/) and even embedded payment pages now carry [script-attack obligations](https://www.pcisecuritystandards.org/faqs/1588/). Visa states that [PCI DSS applies to any entity that stores, processes, or transmits cardholder data](https://corporate.visa.com/en/resources/security-compliance.html). Mastercard says [all third-party processors and merchant payment gateways are Level 1 service providers](https://www.mastercard.us/en-us/business/overview/safety-and-security/security-recommendations/site-data-protection-PCI/service-providers-need-to-know.html), and Visa’s service-provider guidance says providers above [300,000 Visa transactions/year need annual on-site validation, with non-compliance assessments starting at $10,000](https://usa.visa.com/content/dam/VCOM/download/business/resources-and-tools/DataSecurityComplianceServiceProviders.pdf). That is not an engineering side quest; it is a permanent compliance program.

If they are a platform/payfac/marketplace, the risk multiplies. Stripe Connect currently handles [localized onboarding, document collection, identity verification, international bank accounts, and remediation flows](https://docs.stripe.com/connect/embedded-onboarding); Stripe’s docs explicitly note that missed verification requirements can [disable charges and payouts](https://docs.stripe.com/connect/embedded-onboarding). Stripe also supports [1099 delivery workflows](https://docs.stripe.com/connect/platform-embedded-taxes-walkthrough). Replacing that means building not just APIs, but compliance operations, support playbooks, risk review, and incident response.

The second failure mode is that the spreadsheet understates revenue risk. Stripe includes fraud tooling, 3DS, network-token support, retry logic, and acceptance optimization. Stripe claims [Authorization Boost increases accepted payment volume by 2.2% on average](https://stripe.com/us/authorization). I would not take that as neutral truth, but it proves the sensitivity: a modest drop in auth rate, slightly worse fraud controls, slower dispute handling, or poorer retries can erase the processor-margin savings. One reconciliation bug, payout-delay issue, or acquiring outage can hit cash flow and customer trust at the same time.

The downside of staying on Stripe is mostly margin pressure and concentration risk, but those are easier to hedge than rebuilding the stack. A more skeptical, lower-regret path is: exhaust [custom pricing / IC+](https://stripe.com/pricing), shift eligible volume to cheaper rails like [ACH (0.8%, capped at $5)](https://stripe.com/pricing), and add optionality through Stripe’s [Vault and Forward API](https://docs.stripe.com/payments/vault-and-forward) or [Orchestration](https://docs.stripe.com/payments/orchestration/route-payments) before attempting full replacement. My bottom line: for a Series A company with 20 engineers, “build our own processor” is most likely an expensive distraction unless their payment flows are unusually simple and they already have experienced payments, fraud, and compliance operators in-house.

---

## Discussion

### Round 1 — Advocate | response | confidence: 78%

**Response to previous points:**
Skeptic’s strongest point is that the real choice is not “pay Stripe fees” versus “replace all of Stripe.” The hardest part of the fee stack is mostly interchange and scheme cost, and the moment this startup takes on card data, payfac-like responsibilities, or Connect-style onboarding, the problem becomes compliance operations, not just engineering. I agree with that.

Where I disagree is the implied conclusion that this means “stay on Stripe” in the current shape. My synthesis is: do not build a full processor, but do start building a payments control plane now. If the recoverable pool is only ~10% to 30% of fees, that still becomes roughly $450k to $1.35M/year at projected volume, before counting approval-rate gains, routing leverage, and reduced concentration risk. For a Series A company, that is too much value to ignore, but not enough to justify rebuilding Stripe Connect, PCI Level 1 scope, and global compliance from scratch.

So the likely right answer is a staged hybrid:
1. Negotiate Stripe custom/IC+ pricing immediately.
2. Shift eligible flows to cheaper rails like ACH/local methods.
3. Build an internal abstraction for routing, ledgering, reconciliation, and processor portability.
4. Keep regulated edges outsourced unless a later stage proves the economics justify insourcing them.

**New evidence or angle:**
The missing angle is timing risk. Waiting until volume is already 3x larger makes migration harder, not easier, because card vaulting, merchant/account migration, reconciliation dependencies, and product coupling all get more entrenched with scale. That means “do nothing for 18 months” is also an active choice with switching-cost consequences. The real timing question is not “build now or never,” but “when do we invest in optionality?” My answer is: now, but narrowly.

**Current position:**
I favor continuing to use Stripe for core processing in the near term, while investing immediately in a hybrid architecture that creates negotiating leverage and future routing flexibility. Confidence is 78% because Skeptic is right that full-stack insourcing is probably a trap at this stage, but the projected fee growth is large enough that pure passivity is also wrong.

**Key question for the group:**
What portion of current and projected volume is actually eligible for lower-cost alternatives without taking on major new compliance scope: domestic debit, ACH, recurring card-on-file, or platform/Connect flows?

### Round 1 — Skeptic | response | confidence: 74%

**Response to previous points:**
Agent A’s strongest argument is the timing one: optionality gets more expensive as volume, vault lock-in, and operational coupling grow, so “wait and see” is not neutral. I agree with that, and I’ve shifted a bit toward A’s hybrid path.

Where I still disagree is on what “build the control plane now” should include. Routing portability is defensible; building internal ledgering, reconciliation, and a processor abstraction too early may be an expensive abstraction tax if they do not yet know their true savings pool by rail, geography, and payment type. Agent A is right that $450k-$1.35M/year of recoverable savings at projected scale is material. But that is gross upside, not net. A small payments-platform team plus compliance/ops overhead can consume that quickly, and one auth-rate regression or reconciliation incident can erase a year of savings. So my synthesis is narrower than A’s: negotiate Stripe hard, push ACH/local rails, and use Stripe-hosted portability features first; only build owned control-plane components after the company proves, with actual mix data, that a specific slice of volume is both large and operationally simple enough to justify it.

**New evidence or angle:**
The missing angle is organizational maturity risk. A 20-engineer Series A company does not just need code to unbundle payments; it needs sustained operational ownership for disputes, settlements, exceptions, outages, and audit evidence. The hidden cost is not just PCI scope, it is management bandwidth. Even a “hybrid” approach can fail if it creates a second payments stack before the first one is economically exhausted.

**Current position:**
Continue using Stripe as the primary processor, but pursue a staged hedge immediately: custom pricing, rail mix optimization, and Stripe-native portability before building meaningful in-house infrastructure. I’m at 74% because Agent A is persuasive that optionality should start now, but I still think the default failure mode is overbuilding before they quantify net savings and operational burden.

**Key question for the group:**
What is the actual payment mix today and at 3x scale: percent of volume by card vs ACH, domestic debit vs credit, recurring vs one-time, cross-border vs domestic, and any Connect/platform flows?

### Round 2 — Advocate | response | confidence: 76%

**Response to previous points:**
Agent B’s strongest argument is that the real failure mode is not “engineering complexity” in the abstract; it is organizational self-deception. A 20-engineer Series A startup can easily build a second payments stack, inherit exceptions/settlements/compliance overhead, and discover too late that the net savings pool was too small or too operationally messy to justify it. I agree, and I’ve changed my view further in B’s direction: “build the control plane now” was too broad.

My synthesis is narrower. Keep Stripe as the primary processor, but do not stay passive. Follow Agent B’s sequence first: push for custom/IC+ pricing, quantify payment mix precisely, and use Stripe-native portability where possible. Then build only the minimum viable option layer for one low-complexity lane, not a generalized internal payments platform. The key open questions are still the same and they matter more than abstract architecture: how much volume is domestic debit vs credit vs ACH, how much is recurring, and how much depends on Connect-style onboarding/payout/compliance flows. If the business is Connect-heavy or cross-border, the case for deep insourcing drops sharply.

**New evidence or angle:**
The new angle is option value. A narrowly scoped portability project is not justified only by direct fee savings; it is justified because a credible outside option improves negotiating leverage before volume triples. They do not need to migrate most volume to benefit. If Stripe believes the company can route even one meaningful lane elsewhere, that alone can improve commercial terms. The mistake would be treating “buy leverage” as “rebuild payments.”

**Current position:**
Continue using Stripe as the primary processor, but start a tightly scoped hybrid now: renegotiate pricing, optimize rail mix, and pilot portability on one simple, high-volume payment lane. Confidence is 76% because Agent B’s organizational-risk argument is strong, but waiting until 3x scale to create optionality likely increases both switching cost and dependency risk.

**Key question for the group:**
What single payment lane will represent the largest share of projected volume while carrying the lowest new compliance/ops burden: domestic ACH, domestic debit, recurring card-on-file, or something else?

### Round 2 — Skeptic | response | confidence: 79%

**Response to previous points:**
Agent A’s strongest point is the option-value argument: they do not need to replace Stripe to justify action now; they only need enough portability to create commercial leverage and avoid deeper lock-in before volume triples. I agree, and that has shifted me further toward a hybrid path than I was in my research note.

My disagreement is now mostly about gates and sequence, not direction. Agent A is right to narrow the scope to one simple lane, but I still think the default failure mode is starting the build before they have lane-level economics after a real Stripe renegotiation. The important open questions remain the same and they are decisive: what share of projected volume is ACH vs cards, domestic debit vs credit, recurring vs one-time, and how much of the business depends on Connect-style onboarding/payout/compliance? If the “clean” lane is small, cross-border, or operationally noisy, the pilot becomes an abstraction project with weak ROI.

**New evidence or angle:**
The missing angle is break-even staffing math. The recoverable pool at 3x volume was framed earlier as roughly $450k-$1.35M/year. That sounds material until you price the minimum durable ownership: 2-3 strong payments engineers, plus meaningful product/finance/ops/compliance time, plus incident overhead. On fully loaded cost, the lower half of that savings range disappears quickly. So the bar should not be “can we save basis points?” It should be “is there one lane whose net savings, after Stripe custom pricing and expected auth/fraud/recon drag, clearly funds a small permanent team?” If not, they should buy leverage through negotiation and rail mix, not code.

**Current position:**
Continue using Stripe as the primary processor, but prepare a tightly scoped hedge: renegotiate pricing now, quantify lane-level economics, and only then pilot portability on one lane if the post-renegotiation net upside is clearly above the ongoing ownership cost. I’m at 79% because Agent A’s timing argument is strong, but the evidence still points to overbuilding as the higher-probability mistake for a Series A team of this size.

**Key question for the group:**
After Stripe custom pricing is on the table, which single payment lane still shows enough net annual savings at projected $150M volume to fund a permanent 2-3 person payments team without expanding PCI/compliance scope materially?

### Round 3 — Advocate | response | confidence: 82%

**Response to previous points:**
Skeptic’s strongest point is the break-even one: gross fee savings are the wrong metric. If a post-Stripe-repricing lane cannot comfortably fund a permanent 2-3 person payments team plus ops/compliance drag, then “building optionality” is just an abstraction tax. I agree, and I’ve changed my mind again because that is the real gate. Advocate’s earlier timing argument still matters, though: waiting is not neutral, because leverage and migration simplicity get worse as volume triples. My synthesis is: act now, but make the first act commercial and analytical, not architectural. The open questions should be answered in this order: payment mix by lane, Stripe’s real IC+/volume offer, whether the top lane avoids Connect/cross-border/expanded PCI scope, and whether its projected net savings still clear a hard ownership threshold.

**New evidence or angle:**
The missing angle is decision design. This should be run as a 30-45 day real-options experiment with explicit kill criteria, not as a vague platform initiative. Ask Stripe for repricing, get 2 external processor quotes, build lane-level unit economics at projected $150M volume, and set a go/no-go bar upfront: one lane must show clear post-repricing net savings, no material PCI scope expansion, and a pilot small enough to unwind if auth/recon metrics regress. That preserves urgency without accidentally creating a second payments stack by inertia.

**Current position:**
Keep Stripe as the primary processor, immediately run a repricing + lane-economics + external-benchmark process, and only pilot one low-scope lane if it still produces clearly positive net savings after fully loaded ownership cost. Confidence is 82% because Skeptic changed my view on sequencing, but I still think caution is overstating the value of passivity: the company should actively buy negotiating leverage now.

**Key question for the group:**
After Stripe custom pricing and two external quotes, does the largest low-scope lane still show enough projected net annual savings at $150M volume to exceed a pre-agreed ownership threshold?

**Convergence assessment:** CONVERGING — both agents now support Stripe as the primary processor plus an immediate, tightly scoped hedge; the remaining gap is sequencing, specifically whether any technical portability work should begin before post-repricing lane economics are proven.

---

## Consensus Summary

### Decision
The company should not build a full in-house payment processing stack now; it should keep Stripe as the primary processor. It should immediately run a tightly scoped hedge: negotiate Stripe custom/IC+ pricing, optimize rail mix, get external processor quotes, and model lane-level economics at projected scale. Only if one low-complexity lane still shows clear net savings above the cost of a permanent 2-3 person ownership team, without materially expanding PCI/compliance scope or harming auth/recon performance, should it pilot a narrow hybrid portability layer.

### Key Contention Points

| # | What We Disagreed On | How It Was Resolved | Who Shifted & Why |
|---|---------------------|--------------------|--------------------|
| 1 | Whether the startup should start building its own payments infrastructure now | Resolved in favor of staying on Stripe as the primary processor and rejecting a full in-house build at Series A scale | Agent A shifted substantially after Agent B’s arguments on PCI/compliance, operational burden, and the risk of rebuilding Stripe-like functionality too early |
| 2 | Whether “building optionality now” meant a broad internal control plane or something much narrower | Resolved toward a minimal, lane-specific hedge rather than a generalized routing/ledger/reconciliation platform | Both shifted: Agent A narrowed scope after the “abstraction tax” concern; Agent B accepted that some portability is valuable if tightly bounded |
| 3 | Whether the company should act now or wait until it has more scale/data | Resolved as “act now, but commercially and analytically first,” not architecturally first | Agent B shifted by accepting that waiting is not neutral because lock-in and switching costs rise with volume; Agent A shifted by accepting that pricing/mix proof must come before engineering build-out |
| 4 | Whether projected savings should be judged on gross Stripe fees or true net economics | Resolved in favor of a hard break-even test based on post-repricing lane economics minus staffing, ops, compliance, and performance risk | Agent A shifted after Agent B’s break-even staffing math showed that gross fee savings can disappear quickly once permanent ownership costs are included |

### Unresolved Items & Risks
- The actual payment mix is still unknown: ACH vs card, debit vs credit, recurring vs one-time, domestic vs cross-border, and any Connect/platform exposure.
- Stripe’s real custom/IC+ offer and external processor quotes could shrink the savings pool enough to eliminate the case for any pilot.
- It is still unproven whether there is a single “clean” lane large enough to justify ownership without expanding PCI/compliance scope materially.
- A narrow pilot could still destroy value if authorization rates, fraud performance, reconciliation quality, or payout reliability regress.
- Even a successful pilot creates permanent operational ownership, so the threshold for proceeding must stay high and explicit.

### Confidence: High
Both agents converged on the same practical answer, and the remaining uncertainty is mainly factual input data needed to decide whether any narrow pilot clears the agreed economic and compliance gates.
