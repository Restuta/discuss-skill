---
topic: "Should a fintech startup (Series A, 20 engineers, processing $50M/year in transactions) build their own payment processing infrastructure or continue using Stripe? They're currently paying ~$1.5M/year in Stripe fees and expect 3x volume growth in 18 months."
mode: "council"
agent_count: "2"
agent_config: "2-agent"
max_rounds: "5"
git_commit: "none"
agent_cli: "codex"
A: "claude"
B: "codex"
status: consensus
turn: B
round: 3
created: "2026-04-01T09:27:27.811Z"
last_updated: 2026-04-01T09:33:13.309Z
agent_A_name: "Advocate"
agent_A_cli: "claude"
agent_A_role: "advocate"
agent_B_name: "Skeptic"
agent_B_cli: "codex"
agent_B_role: "skeptic"
---

# Discussion: Should a fintech startup (Series A, 20 engineers, processing $50M/year in transactions) build their own payment processing infrastructure or continue using Stripe? They're currently paying ~$1.5M/year in Stripe fees and expect 3x volume growth in 18 months.

## Participants
- **Agent A** — Advocate (advocate) via claude
- **Agent B** — Skeptic (skeptic) via codex

## Key Questions
1. What is the true total cost of ownership for in-house payment processing vs Stripe at current and projected volumes?
2. What are the regulatory and compliance implications (PCI-DSS, per-country requirements) of each approach?
3. Is there a hybrid approach that captures cost savings without full infrastructure ownership?
4. What is the engineering opportunity cost — what else could those engineers build?

## Research Phase

### Agent A (Advocate) — Independent Research | research

**The $4.5M/year question: why building is the rational move at this inflection point.**

**The economics are already screaming.** At $50M/year, Stripe's ~3% effective rate costs $1.5M. At the projected $150M/year in 18 months, that's $4.5M annually — and it compounds from there. Companies like Adyen, which built proprietary processing, operate at 20-25 basis points per transaction. Even a conservative in-house build reaching 80-100 bps total cost (including ops, compliance, staff) against Stripe's ~300 bps produces **$2M-3M/year in savings at $150M volume**. That's not marginal — that's runway extension, that's headcount, that's a Series B narrative.

**This is a well-trodden path with known playbooks.** Square built its own processing stack after starting on third-party rails. Shopify moved payment processing in-house through its acquisition of a processing license. Affirm, Marqeta, and Checkout.com all transitioned to owning more of the payment stack as volume justified it. The pattern is consistent: fintech companies that reach product-market fit and predictable volume migrate to owned infrastructure. The question isn't *if* but *when*, and $50M/year with 3x growth is precisely the inflection point where the math flips.

**The strategic upside extends far beyond cost savings.** Owning the payment stack unlocks:
- **Pricing flexibility**: custom interchange optimization, surcharging strategies, and volume-based processor negotiations impossible through Stripe's abstraction layer
- **Data ownership**: raw transaction data, decline reason codes, and authorization patterns become first-party assets for fraud modeling, underwriting, and product development
- **Speed of iteration**: no dependency on Stripe's roadmap for features like multi-currency settlement, custom retry logic, or novel payment methods
- **Competitive moat**: proprietary processing becomes a defensible technical asset that increases enterprise value at exit or future fundraise

**The talent market supports this move.** Payment infrastructure engineers are more available post-2023 layoffs at Stripe itself, Plaid, and other fintech infrastructure companies. A team of 3-4 dedicated payment engineers (realistic to hire within 6 months) can stand up a processing layer using existing acquiring bank APIs (Worldpay, First Data/Fiserv, Adyen as a processor) while maintaining Stripe as a fallback. You don't need to become Visa — you need to own the orchestration layer.

**The risk of NOT building is underappreciated.** Stripe is a vendor dependency on your most critical business function. Rate changes, API deprecations, risk policy shifts, or account holds can materially impact the business with zero recourse. In 2022, Stripe raised prices for the first time — companies locked into the platform had no leverage. At $150M volume, this startup would be a mid-tier Stripe customer with limited negotiating power, not a strategic account.

**Realistic timeline and phasing make this manageable.** A phased approach — (1) payment orchestration layer abstracting Stripe (3 months), (2) direct acquiring bank integration for high-volume transaction types (6 months), (3) progressive traffic migration (3-6 months) — means revenue never stops flowing through proven rails while new infrastructure is validated. The orchestration layer alone, even before replacing Stripe, delivers vendor optionality and multi-processor redundancy.

**Key uncertainty acknowledged**: PCI DSS Level 1 compliance is real work — annual audits, penetration testing, network segmentation. Cost is $200K-500K/year. But at $4.5M in projected Stripe fees, compliance cost is a rounding error on the savings.

The inertia argument — "Stripe just works" — is a comfort-zone bias masquerading as risk management. At this volume and growth rate, the riskier move is *not* building.

### Agent B (Skeptic) — Independent Research | research

The skeptical view is that a Series A company at $50M/year should assume “build our own processor” is a trap unless Stripe is blocking the business strategically, not just economically. The current fee load implies an effective rate of about 3.0% ($1.5M / $50M), which is close to Stripe’s standard US card pricing of 2.9% + 30c; Stripe also explicitly offers custom structures including IC+ and volume discounts for larger customers ([Stripe pricing](https://stripe.com/us/pricing)). Inference: the relevant savings case is not “eliminate $1.5M,” because interchange/network/acquirer costs do not disappear if you build. The real savings opportunity is only Stripe’s margin plus any tooling you can replace, and that may be far smaller than founders expect. At 3x volume, the gross fee line could grow to roughly $4.5M/year, but that still does not prove in-house processing is cheaper than renegotiating Stripe first.

The downside risk is that “build payments infra” usually means dragging the company into PCI, fraud, disputes, and audit scope. Stripe states that if you use Checkout/Elements, you can stay in SAQ A; if you write your own code to handle card data, you may become ineligible for SAQ A and responsible for additional PCI DSS requirements. Stripe also notes that businesses handling card data may need to meet 300+ PCI security controls ([Stripe PCI guide](https://stripe.com/guides/pci-compliance)). PCI SSC separately makes clear that even merchants that outsource processing remain responsible for compliance oversight; outsourcing reduces scope, not accountability ([PCI SSC FAQ](https://www.pcisecuritystandards.org/faq/articles/Frequently_Asked_Question/does-pci-dss-apply-to-merchants-who-outsource-all-payment-processing-operations-and-never-store-process-or-transmit-cardholder-data/?_hsmi=364054903)). If they move payment data or become a service provider, Visa’s validation guidance shows service providers face heavier validation expectations, including ROC/AOC paths and registry implications ([Visa PCI validation](https://usa.visa.com/content/dam/VCOM/regional/na/us/support-legal/documents/pci-dss-validation-best-practice-review.pdf)).

If this fintech is actually a platform, marketplace, or anything onboarding sellers / moving funds for others, risk goes up another level. Visa’s Payment Facilitator and Marketplace Risk Guide says acquirers must screen, monitor, periodically review/audit, and maintain ongoing oversight of payment facilitators; it also highlights operational, regulatory/compliance, credit settlement, and brand/reputation risk as core categories ([Visa risk guide](https://usa.visa.com/content/dam/VCOM/regional/na/us/partner-with-us/documents/visa-payment-facilitator-and-marketplace-risk-guide.pdf)). FinCEN’s guidance is similarly uncomfortable: whether you are a money transmitter is “a matter of facts and circumstances,” and the payment-processor exemption is narrow and conditional ([FinCEN ruling](https://www.fincen.gov/resources/statutes-regulations/administrative-rulings/administrative-ruling-whether-company-offers)). That means the legal perimeter can shift as product design shifts.

The practical failure mode is underestimating post-authorization operations. Stripe’s own multiprocessor “Vault and Forward” docs warn that if you route to another processor, you must handle refunds and disputes directly with that processor ([Stripe Vault and Forward](https://docs.stripe.com/payments/vault-and-forward)). That is the tell: auth/capture is only the visible part. The ugly parts are retries, ledger reconciliation, failed payouts, dispute evidence, risk monitoring, underwriting, reserves, reporting, and incident response. A 20-engineer team can build a gateway; it is much harder to build a resilient payment operations organization.

My skeptical conclusion: do not replace Stripe end-to-end now. First exhaust lower-risk options: negotiate custom pricing, push lower-cost rails like ACH where product permits, and test multiprocessor routing only if there is a measurable acceptance-rate or unit-economics reason. Revisit “build” only if you can show, with actual processor quotes and compliance staffing plans, that net savings remain compelling after PCI, legal, fraud, ops, and migration risk. Biggest uncertainties: transaction count/average ticket, card vs ACH mix, cross-border exposure, dispute/fraud rates, and whether they process only their own merchant volume or funds for third parties.

---

## Discussion

### Round 1 — Advocate | response | confidence: 72%

**Response to previous points:**

Skeptic's strongest argument — and I want to state it fairly — is that the *actual* savings opportunity is Stripe's margin only, not the full $1.5M fee line. Interchange, network fees, and acquirer costs don't vanish when you build. That's a critical correction to the naive "we'd save $4.5M" framing. If Stripe's effective margin is 80-120 bps above interchange-plus, the real savings at $150M volume are closer to $1.2M-$1.8M/year, not $3M+. I accept that reframe.

Where I disagree with Skeptic: the recommendation to "first exhaust lower-risk options" like negotiating custom pricing treats this as a binary — negotiate OR build. But the first phase of building (a payment orchestration layer that abstracts Stripe behind an internal API) is *itself* the negotiating leverage. You cannot get Stripe's best pricing without a credible alternative. Companies that show up to Stripe pricing conversations with a multi-processor architecture and direct acquiring relationships get IC+ pricing they'd never get by asking nicely. The orchestration layer is the lowest-risk, highest-optionality move regardless of the final build/buy decision.

Skeptic is right that post-auth operations (disputes, reconciliation, risk monitoring) are where builds actually fail. I take that seriously — this is the hardest 80% of the work. But the phased approach I outlined keeps Stripe handling post-auth for the initial migration period. You route auth/capture through direct acquiring while Stripe continues to handle disputes and payouts via their existing rails during transition.

**New evidence or angle:**

One thing neither of us has addressed: the startup's *transaction profile* matters enormously. If average ticket is $500+ (B2B payments, lending disbursements), the per-transaction fixed costs of in-house processing are amortized quickly and the basis-point savings compound faster. If average ticket is $15 (consumer micro-transactions), the operational overhead per transaction makes building far less attractive. Similarly, if 30%+ of volume is ACH-eligible, the immediate win is pushing those transactions off card rails entirely — something achievable *within* Stripe using Stripe's ACH product, no build required. We're debating build-vs-buy without knowing the single variable that most determines the answer.

**Current position:**

Build the orchestration layer now (~72% confident). Not because the full build is obviously right today, but because abstraction + vendor optionality is positive-EV regardless of whether you eventually go direct. The full migration decision should wait until you have direct processor quotes, a PCI compliance cost estimate, and — crucially — know your transaction profile. I'm *not* 72% on "replace Stripe end-to-end." I'm 72% on "start the orchestration work that makes all future options cheaper."

**Key question for the group:**

Skeptic — do you agree that building the orchestration/abstraction layer (Stripe stays as the processor behind it) is a low-risk, high-optionality first step? Or do you see material costs even in that intermediate architecture that make it not worth pursuing at 20 engineers?

### Round 1 — Skeptic | response | confidence: 78%

**Response to previous points:**
Advocate’s strongest point is the narrower one, not the headline “save Stripe fees” claim: a thin routing/abstraction layer can create negotiating leverage and preserve optionality before volume triples. That moved me somewhat. I agree a credible alternative matters more than asking Stripe for a discount with no fallback. But I do not agree that an “orchestration layer” is automatically low-risk. At a 20-engineer company, a broad internal payments API often becomes a shadow processor: duplicated idempotency, retry semantics, webhook normalization, reconciliation states, and support tooling, all before any savings land. So my synthesis with Advocate is: yes to a very thin router tied to one concrete second route, no to a generalized payments platform built in anticipation of someday needing it.

Agent A is also right that transaction profile is the key missing variable. Average ticket size, ACH eligibility, dispute rate, cross-border exposure, and whether they move funds for third parties dominate the answer. If this is mostly their own merchant volume, the path is one thing; if it looks anything like marketplace/payfac behavior, the compliance and ops burden changes materially.

**New evidence or angle:**
The missing angle is feature-surface lock-in. Stripe is usually not just auth/capture; it is often fraud tooling, dispute workflows, billing primitives, tokenization, updater services, reporting, and sometimes Connect-like fund flows. A generic abstraction does not preserve that value cleanly. It either forces the company down to the lowest common denominator or makes them rebuild those capabilities piecemeal. That is why targeted multiprocessor routing for one flow can work, while “abstract all payments now” often creates an abstraction tax with no near-term payoff.

**Current position:**
I would not build end-to-end processing now. I would support a narrowly scoped router only if they already have a specific high-volume flow, direct acquirer quotes showing meaningful net savings after ops/compliance cost, and a plan to leave Stripe in place for the long tail and ops-heavy cases. I’m at ~78% because the dominant failure mode here is organizational overreach, not failing to seize an obvious infra win.

**Key question for the group:**
What portion of the projected $150M is a clean, repetitive transaction slice, same-country card or ACH-eligible, low-dispute, no third-party fund movement, and what net basis-point quote can they get today for that exact slice from a direct acquirer?

### Round 2 — Advocate | response | confidence: 68%

**Response to previous points:**

Skeptic's strongest point in Round 1 — and I want to sit with it — is the feature-surface lock-in argument. Stripe isn't a pipe you swap out; it's fraud scoring, dispute automation, card updater services, billing retry logic, tokenization, and often Connect-based fund flows, all wired into product code. An "orchestration layer" that pretends these are interchangeable across processors is a fiction. Any abstraction either drops to the lowest common denominator (losing Stripe features the product relies on) or becomes a bespoke reimplementation of each provider's surface area. That's the abstraction tax, and it's real. **I'm updating my position because of this.** My Round 1 framing of "build the orchestration layer" was too broad — Skeptic correctly identified that a generalized abstraction is a shadow processor in disguise.

Where I still disagree: Skeptic's precondition of "already have direct acquirer quotes showing meaningful net savings" before writing any code is sequencing backwards. You need the thin integration to *get* meaningful quotes — processors give indicative pricing, not binding quotes, until you're in technical due diligence. And the 18-month growth window creates a timing asymmetry neither of us has addressed directly: building routing infrastructure at $150M/year is 3x more dangerous than building it at $50M/year because migration risk scales with volume. The cost of waiting isn't zero.

On Skeptic's key question — what portion of $150M is clean, repetitive, low-dispute — I'll answer with the framework rather than guessing: if that clean slice is under 30% of volume, don't bother. The operational overhead of a second processor isn't worth routing a minority of transactions. If it's over 50%, the case is strong. That's the threshold question.

**New evidence or angle:**

There's a third option we've both missed: **Stripe's own multi-processor tooling changes the calculus.** Stripe Vault and Forward (which Skeptic cited) lets you tokenize on Stripe and route auth to a second processor while keeping Stripe's token vault, fraud tools, and dispute handling. This is explicitly Stripe enabling the hybrid path — you get a second processor for the clean volume slice without losing Stripe's feature surface for the complex tail. The abstraction tax drops dramatically because Stripe itself becomes the abstraction layer. The catch: you're still paying Stripe something for vault/tokenization, and you're still in their ecosystem. But it directly addresses both my concern (start building optionality now) and Skeptic's concern (don't lose the feature surface or build a shadow processor).

**Current position:**

Down to ~68% on active build work, up from my Round 1 position in nuance. Concrete recommendation: (1) negotiate IC+ pricing with Stripe now using the credible threat of multi-processor routing, (2) evaluate Stripe Vault and Forward for the cleanest transaction slice, (3) get one direct acquirer quote for that slice. This is closer to Skeptic's position than my Round 1 — I've moved because the feature-surface lock-in argument is genuinely load-bearing, not just a caution reflex. But I maintain that *some* active work beyond just negotiating is warranted now, while volume is lower and migration risk is manageable.

**Key question for the group:**

Skeptic — does Stripe Vault and Forward as the hybrid path change your risk assessment? It preserves the feature surface you're concerned about while enabling the multi-processor routing I'm advocating for, without building a generalized abstraction layer.

### Round 2 — Skeptic | response | confidence: 80%

**Response to previous points:**
Agent A’s strongest point is the timing asymmetry: if a second route may eventually be justified, learning at $50M is safer than first attempting it at $150M. I’ve moved a bit on that, and I agree with Agent A’s correction that a generalized orchestration layer is too broad. But I don’t think `Vault and Forward` changes the risk as much as it first appears. In the research I cited earlier, Stripe’s own docs say that once you forward to another processor, refunds and disputes for those payments must be handled with that processor directly. So the hardest operational surface does not stay fully “Stripe-managed.” My synthesis with Agent A is: do active diligence now, but keep it commercial and slice-specific, not platform-first. The unresolved questions are still gating: what share of volume is a clean repetitive slice, what exact Stripe features are in use today, and are they processing only their own volume or moving funds for third parties?

**New evidence or angle:**
The real distinction is not “build vs Stripe”; it is “merchant optimization vs becoming payments infrastructure.” If they reroute one bounded, merchant-owned flow, that is a controlled optimization problem. If they start touching card data more directly, assume service-provider-like obligations, or recreate Stripe features across products, it becomes a company-shaping distraction. `Vault and Forward` may help with token portability and PCI scope, but it does not remove the post-auth ownership burden on forwarded traffic. That keeps the decision threshold higher than “the fee line is big.”

**Current position:**
Do not build end-to-end processing now. I would support a 30-60 day diligence/pilot plan now: Stripe repricing, dependency inventory, one direct acquirer quote for one clean slice, and a narrow pilot only if the modeled net savings still clear the added ops/compliance cost. ~80% because Agent A is right that waiting has a cost, but the evidence still says the common failure mode is underestimating the non-API surface area.

**Key question for the group:**
What is the annualized GMV, dispute rate, average ticket, and Stripe feature dependency for the single cleanest transaction slice they could route separately tomorrow, and what net basis-point savings would that slice actually produce after adding refunds, disputes, and reconciliation ownership?

### Round 3 — Advocate | response | confidence: 65%

**Response to previous points:**

Skeptic's strongest point in Round 2 — and the one that moved me most across this entire discussion — is the surgical distinction between "merchant optimization" and "becoming payments infrastructure." That's the real decision boundary, not build-vs-buy. Routing one clean slice to a second processor is a bounded optimization problem with knowable costs. Building a generalized payment abstraction layer is a company-identity decision that a 20-engineer Series A startup should not be making under cost-pressure framing. I accept that distinction fully.

Skeptic is also right that Vault and Forward doesn't solve the problem I wanted it to solve. I framed it as "keep Stripe's feature surface while routing elsewhere," but Skeptic correctly noted that post-auth operations (refunds, disputes, reconciliation) on forwarded traffic still fall to the second processor. The operational burden doesn't stay Stripe-managed — it just stays Stripe-tokenized. That's a narrower benefit than I presented.

Where I still push back, but only slightly: Skeptic's 30-60 day diligence plan is essentially what I'm advocating for, reframed as caution rather than action. Stripe repricing negotiation, dependency inventory, one acquirer quote, one narrow pilot — that *is* active work. It's 1-2 engineers for a month. The label matters less than the content, and I think we agree on the content.

**New evidence or angle:**

Honest answer: nothing materially new to add. We've covered the economics, the compliance surface, the feature lock-in, the hybrid tooling, and the timing asymmetry. The remaining uncertainty is entirely empirical — transaction profile data we don't have. Further debate without that data is speculation with diminishing returns.

**Current position:**

Down to ~65%, and I want to be precise about what that means. I'm ~90% aligned with Skeptic's concrete plan: negotiate IC+ pricing, inventory Stripe feature dependencies, get one direct acquirer quote for the cleanest slice, pilot only if modeled net savings clear ops/compliance cost. Where I hold the remaining 10% gap: I'd set a harder decision deadline (90 days, not open-ended diligence) and I'd allocate one engineer to build the dependency inventory and Stripe feature audit as a technical workstream, not just a commercial exercise. The risk of open-ended "diligence" is that it becomes indefinite deferral, and the timing asymmetry — building at $50M is safer than at $150M — doesn't wait.

**Key question for the group:**

Skeptic — can we converge on a concrete deliverable: a 60-day time-boxed evaluation with a go/no-go gate, where the gate criteria are (a) net bps savings on the cleanest slice after ops/compliance cost, (b) Stripe feature dependency count, and (c) clean-slice percentage of total volume? If all three clear defined thresholds, proceed to narrow pilot. If not, renegotiate Stripe and revisit at $100M.

**Convergence assessment:** CONVERGING — We agree on ~85% of the substance: don't build end-to-end now, do active commercial and technical diligence on a narrow slice, keep Stripe for the complex tail. Remaining gap is pacing and commitment mechanism — I want a hard deadline and allocated engineering time; Skeptic may prefer keeping it purely commercial until the numbers justify technical investment.

---

## Consensus Summary

### Decision
Do not build end-to-end payment processing infrastructure now. Instead, execute a time-boxed (60-90 day) commercial and technical evaluation: negotiate IC+ pricing with Stripe, inventory all Stripe feature dependencies, obtain one direct acquirer quote for the single cleanest transaction slice, and proceed to a narrow pilot only if modeled net basis-point savings clear ops/compliance costs. Keep Stripe as the primary processor for all complex, dispute-heavy, and long-tail flows regardless of outcome.

### Key Contention Points

| # | What We Disagreed On | How It Was Resolved | Who Shifted & Why |
|---|---------------------|--------------------|--------------------|
| 1 | Whether to build a generalized payment orchestration/abstraction layer | Resolved against. Skeptic argued it becomes a "shadow processor" with duplicated idempotency, retry semantics, and reconciliation — an abstraction tax with no near-term payoff. | Advocate shifted (R2), accepting that a generalized abstraction is too broad and a company-identity decision a 20-engineer startup shouldn't make under cost-pressure framing. |
| 2 | Whether Stripe feature-surface lock-in is a blocking concern | Resolved as load-bearing. Stripe isn't just auth/capture — it's fraud scoring, dispute automation, card updater, billing retry, tokenization, and often Connect fund flows. | Advocate shifted (R2), calling this "genuinely load-bearing, not just a caution reflex" and dropping confidence from 72% to 68%. |
| 3 | Whether Stripe Vault and Forward solves the hybrid problem | Resolved as insufficient. Post-auth operations (refunds, disputes, reconciliation) on forwarded traffic still fall to the second processor. | Advocate shifted (R3), conceding the operational burden doesn't stay Stripe-managed, only Stripe-tokenized — a narrower benefit than initially presented. |
| 4 | The real savings opportunity ($4.5M vs. Stripe's margin only) | Resolved early. Interchange, network, and acquirer fees don't vanish when you build; actual savings are Stripe's margin (~80-120 bps), not the full fee line. | Advocate accepted this reframe in R1, narrowing projected savings from $3M+ to $1.2M-$1.8M/year at $150M volume. |
| 5 | Pacing of diligence — open-ended vs. hard-gated | Partially resolved. Both agree on the same activities; Advocate wants a 60-day deadline with one allocated engineer, Skeptic prefers commercial-first sequencing. | Neither fully shifted. Advocate conceded ~90% alignment but held that open-ended diligence risks indefinite deferral given the timing asymmetry (building at $50M is safer than at $150M). |

### Unresolved Items & Risks
- **Transaction profile is unknown**: Average ticket size, ACH-eligible share, dispute rate, cross-border exposure, and whether they process only their own volume or move funds for third parties — these variables dominate the answer and neither agent had them.
- **Clean-slice threshold unclear**: Both agents agreed the decision hinges on what percentage of volume is clean, repetitive, same-country, low-dispute — but no threshold was formally agreed (Advocate suggested 30-50% as the range).
- **Go/no-go gate criteria need definition**: Advocate proposed three gate criteria (net bps savings, feature dependency count, clean-slice percentage) but specific numeric thresholds were not set.
- **Timing asymmetry remains live**: If diligence takes too long and volume hits $150M, migration risk increases materially — but moving too fast risks organizational overreach. The right pacing depends on growth trajectory accuracy.
- **Stripe repricing may eliminate the case entirely**: If Stripe offers IC+ at competitive rates (which they do for volume customers), the net savings from a second processor may not clear the added ops/compliance cost, making the entire build question moot.

### Confidence: Medium
Both agents converged to ~85% agreement on substance — don't build end-to-end, do active diligence on a narrow slice, keep Stripe for the complex tail — but the actionable decision (proceed to pilot or not) depends entirely on empirical data neither agent had access to.
