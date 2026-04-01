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
created: "2026-04-01T12:14:05.886Z"
last_updated: 2026-04-01T12:21:27.113Z
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

**The $4.5M question: why building in-house is the highest-ROI bet this company can make.**

**The fee math is brutal at scale.** At $50M/year and ~$1.5M in Stripe fees, this company is paying an effective rate of ~3%. With 3x volume growth to $150M/year in 18 months, that's **$4.5M/year flowing to Stripe** — and continuing to grow. By moving to direct acquiring relationships with interchange-plus pricing, high-volume processors negotiate markups as low as 0.05–0.10% + $0.05 per transaction on top of interchange (~1.5–2.0%). The realistic effective rate drops to **1.6–2.1%**, yielding annual savings of **$1.35M–$2.1M at $150M volume**. Over three years at continued growth, cumulative savings easily exceed $5–8M. That's a Series B worth of runway recovered from fees alone.

**Precedent companies prove the path is viable.** Helcim built its entire payment stack in-house with a small Canadian engineering team and saw increased sales post-launch. Finix quadrupled revenue after becoming a payment processor, closing more deals in 2024 than in the company's entire prior history. Shopify built Shopify Payments to capture 1.8–2.2% gross margin on every dollar processed — over 56% of their GMV now flows through it, demonstrating how payment ownership becomes a profit engine. These aren't trillion-dollar companies with unlimited resources — they're startups and growth-stage companies that made the same bet.

**This is a fintech company — payments IS the product.** Unlike a SaaS company where payments are a utility, a fintech processing $50M/year has payments as a core competency. Owning the stack creates three strategic advantages: (1) **data ownership** — transaction-level data enables better fraud models, underwriting, and product features that differentiate against competitors also running on Stripe; (2) **customization** — Stripe's one-size-fits-all approach means accepting their risk models, settlement timing, and dispute processes, which may not fit this company's specific vertical; (3) **competitive moat** — when competitors can spin up a Stripe integration in a weekend, your proprietary infrastructure becomes a defensible advantage that compounds over time.

**The talent is already in place.** Twenty engineers at a Series A fintech likely includes payments-domain expertise. A dedicated team of 3–4 engineers can build a payment orchestration layer in 6–9 months, starting with a multi-PSP approach (direct integrations with Adyen, Worldpay, or acquiring banks) before moving to full acquiring. The industry trend of "unbundling Stripe" — using specialized vendors for fraud (Sardine, Forter), tokenization, and settlement — means you don't have to build everything monolithically.

**The timing window is now.** Building at $50M volume gives the team room to iterate before $150M volume makes migration riskier. Every month of delay at the higher volume is ~$112K–$175K in avoidable fees. Series A capital is explicitly for building competitive advantages — and for a fintech, there is no greater advantage than owning your money movement.

**Key uncertainties to acknowledge:** PCI DSS Level 1 compliance is non-trivial (~$200K–$500K initial cost), direct acquiring bank relationships take 3–6 months to establish, and there's execution risk in maintaining uptime for payment-critical infrastructure. But these are solvable engineering and business problems — not existential risks. The existential risk is paying a growing tax to Stripe while competitors who own their stack undercut you on pricing and outpace you on features.

### Agent B (Skeptic) — Independent Research | research

The optimistic case overweights the visible fee line and underweights replacement risk. Today’s spend is ~$1.5M on $50M of volume, ანუ about 300 bps. That sounds painful, but Stripe’s published US card pricing is 2.9% + 30c and Stripe explicitly offers custom pricing, IC+ pricing, and volume discounts for larger merchants ([Stripe pricing](https://stripe.com/us/pricing)). So the first skeptical question is not “can we build cheaper?” but “have we exhausted negotiation?” If not, the startup could burn 12-18 months on infrastructure that a pricing renegotiation partially solves in weeks.

The second problem is scope ambiguity. “Build our own payments infrastructure” can mean anything from lightweight orchestration to becoming effectively a direct processor/payfac. Those are radically different bets. If they go deep, even Stripe’s own payfac guide says the traditional route requires acquirer sponsorship, payment gateways, merchant dashboards, payout systems, dispute systems, compliance programs, underwriting, fraud tooling, reconciliation, and ongoing registrations/licensing. Stripe’s estimated minimums are not trivial: 3-6 months for acquirer sponsorship, 3-5 months and $50k-$500k for Level 1 PCI validation, 6-12+ months and $600k+ for merchant management, plus $200k+/year for annual PCI validation ([Stripe payfac guide](https://stripe.com/us/guides/payfacs)). That is before considering the startup has only 20 engineers. A Series A company does not usually have spare staff for a quasi-bank/platform build while tripling volume.

Security and compliance are the biggest downside. PCI DSS applies to entities that store, process, or transmit cardholder data, including merchants, processors, acquirers, issuers, and service providers ([PCI SSC](https://www.pcisecuritystandards.org/standards/pci-dss/)). PCI scope is not static either: PCI SSC clarified that revised SAQ A e-commerce requirements took effect on April 1, 2025, including protections against script attacks even for embedded payment forms ([PCI SSC blog](https://blog.pcisecuritystandards.org/faq-clarifies-new-saq-a-eligibility-criteria-for-e-commerce-merchants)). If the company moves from hosted/tokenized flows toward owning more of the card path, it is choosing a much larger cardholder-data environment, more audit surface, harder incident response, and higher breach blast radius. One serious payment-data incident can wipe out years of fee savings.

Operational failure modes are also easy to underestimate. Stripe bundles fraud tooling, real-time retries, account updater, customer authentication, dispute workflows, payout rails, and claims 99.999% average historical uptime on its pricing page ([Stripe pricing](https://stripe.com/us/pricing)). Replacing “payment acceptance” really means replacing a stack of edge-case behavior. Bugs here do not fail gracefully: routing errors create false declines, ledger defects misstate cash, payout bugs trigger customer harm, and descriptor/dispute problems push chargebacks up. Mastercard’s Excessive Chargeback Program starts monitoring above 1.0% CTR with at least 100 chargebacks and treats merchants as excessive at 1.5% CTR with at least 100 chargebacks in each of two consecutive months ([Mastercard Security Rules](https://www.mastercard.us/content/dam/public/mastercardcom/na/global-site/documents/SPME-Manual.pdf)). Visa likewise notes disputes are time-consuming and resource-intensive for merchants ([Visa chargebacks](https://corporate.visa.com/en/solutions/acceptance/chargebacks.html)). A scaling startup can easily save basis points and lose dollars if auth rates or dispute rates worsen.

My skeptical conclusion: do not treat this as a binary choice between “Stripe forever” and “become a processor.” The downside scenario is spending heavily to rebuild commodity infrastructure during hypergrowth, accepting more security/compliance exposure, and still needing an acquirer/bank/network stack underneath. Unless payments are the company’s product moat, the default answer is stay on Stripe, force a commercial repricing, and consider narrow extensions only after proving a specific bottleneck. The major uncertainties are AOV, domestic vs international mix, fraud/chargeback rates, whether they store cards today, and whether “build” means orchestration or true direct processing. Without those, the savings thesis is not decision-grade.

---

## Discussion

### Round 1 — Advocate | response | confidence: 72%

**Response to previous points:**

Skeptic's strongest argument is scope ambiguity — the gap between "payment orchestration layer" and "become a processor" is enormous, and my research phase conflated them. A 20-engineer Series A building full acquiring/payfac infrastructure while tripling volume is genuinely reckless. I concede that framing. The Skeptic is also right that step zero is renegotiating with Stripe; if they haven't pushed for IC+ or volume pricing, leaving $300K–$600K/year on the table before writing a line of code is negligent.

Where I disagree: the Skeptic frames this as "commodity infrastructure rebuild" and asks whether payments are the company's moat. But this *is* a fintech. Payments aren't a utility bill here — they're the product surface. The Skeptic's own examples (fraud tooling, dispute workflows, settlement timing) are exactly the dimensions where a fintech differentiates. Accepting Stripe's one-size-fits-all risk models and settlement schedules means competing with every other Stripe-powered fintech on identical infrastructure. That's a strategic ceiling, not just a cost problem.

**New evidence or angle:**

The binary is false — and that's actually the Advocate's best case. The move isn't Stripe-to-processor. It's Stripe-to-orchestration-layer-to-optionality. Companies like Primer, Spreedly, and Gr4vy exist precisely because the unbundled stack works: keep Stripe as one PSP, add Adyen or a direct acquirer for high-volume corridors, route intelligently. This captures 40–60% of the fee savings (~$500K–$1.2M/year at $150M volume) with ~10% of the compliance burden because card data stays tokenized through the PSPs. Two engineers, 3–4 months, no PCI scope expansion. The Skeptic's compliance nightmare applies to full direct processing — not to orchestration. These are different bets with different risk profiles, and collapsing them lets the status quo win by default.

One data point missing from both sides: auth rate optimization. Multi-PSP routing typically lifts authorization rates 1–3% by retrying declines across processors. On $150M volume with average transaction size of $100, even a 1% auth rate lift recovers ~$1.5M in otherwise-lost revenue. This dwarfs the fee savings and has zero PCI implications.

**Current position:**

Build a payment orchestration layer (not full processing), starting now, while simultaneously renegotiating Stripe pricing. ~72% confident because: the orchestration path delivers real savings and auth-rate gains with manageable risk, the company is a fintech where payment control is strategic, and the Skeptic's strongest objections apply to a scope I'm no longer proposing. I discount to 72% (not higher) because we lack data on their transaction mix, fraud profile, and whether two engineers can actually be spared during hypergrowth — the Skeptic is right that staffing during 3x scaling is a real constraint.

**Key question for the group:**

Skeptic — does the orchestration-layer approach (multi-PSP routing, tokenized, no PCI scope expansion) change your risk calculus, or do you see hidden costs in that "middle path" that I'm underweighting?

### Round 1 — Skeptic | response | confidence: 78%

**Response to previous points:**
Advocate’s strongest move is narrowing the proposal from “become a processor” to “build an orchestration layer while renegotiating Stripe.” I agree that this materially improves the risk profile: it preserves optionality, avoids most of the payfac/acquirer buildout I flagged earlier, and treats pricing negotiation as the immediate no-regrets step. That is a real shift, and it changes my view.

Where I still disagree is the implied ease: “2 engineers, 3–4 months, no PCI expansion” is not yet decision-grade. The hard part is rarely the API routing layer. It is token portability, recurring-payment migration, reconciliation across multiple PSPs, dispute/refund operations, finance controls, and failure handling when one PSP authorizes and another owns the customer record. Advocate is right that orchestration is the credible third option; I think the hidden costs are still being underweighted.

**New evidence or angle:**
The gating issue is stored credential control. If saved cards, network tokens, or subscription mandates effectively live inside Stripe’s vault, multi-PSP routing is much easier for new traffic than for existing customers. That means the company may only be able to route a slice of volume at first, which weakens both the fee-savings and auth-lift story. Related point: the claimed 1–3% auth-rate uplift is plausible, but it is not bankable without decline-code distribution, issuer mix, cross-border share, and evidence that retries can be done without creating duplicate auths or customer-visible failures. The biggest unmodeled cost here is not compliance; it is migration friction plus operational fragmentation.

**Current position:**
Do not build full payment processing infrastructure. Renegotiate Stripe now, and only pursue orchestration as a narrow pilot if the company can prove token portability, isolate high-volume corridors, and show that net savings survive added ops/finance complexity. ~78% because Advocate successfully reduced the compliance objection, but the practical economics of orchestration still depend on details we do not have, especially stored-credential portability and how much volume is actually routable.

**Key question for the group:**
What percentage of current and projected volume depends on Stripe-held stored credentials or subscription mandates, and can those credentials be ported or re-tokenized for a second PSP without forcing customer re-entry or re-consent?

### Round 2 — Advocate | response | confidence: 75%

**Response to previous points:**

Skeptic's strongest point is that stored-credential portability — not compliance or engineering complexity — is the actual gating constraint. This is correct and I underweighted it. If 60–80% of volume runs on Stripe-vaulted cards (subscriptions, returning customers), the orchestration layer initially captures only new-customer flow, sharply reducing the near-term savings and auth-lift numbers I cited. Skeptic is also right that reconciliation across PSPs, split dispute handling, and finance controls add real operational weight I glossed over with "2 engineers, 3–4 months."

Where I push back: this constraint is the strongest argument for starting *now*. Every month of delay adds more credentials to Stripe's vault, deepening lock-in. The stored-credential problem gets worse with time, not better — especially during 3x volume growth. Framing portability as a blocker rather than a phased migration challenge lets lock-in compound unchallenged.

**New evidence or angle:**

Two things not yet on the table:

1. **Network tokenization addresses portability without PCI expansion.** Visa Token Service and Mastercard MDES create network-level tokens that are PSP-agnostic. Stripe supports provisioning network tokens, and these can be used across any processor that accepts them (Adyen, Worldpay, etc.). Stored credentials don't have to stay locked in Stripe's vault — they can be migrated to network tokens gradually without customer re-entry or consent flows. This directly answers Skeptic's gating question: credentials are portable, but migration is incremental, not instant.

2. **The "new traffic only" constraint is a de-risking mechanism, not a limitation.** Routing only new customers through a second PSP for 3–6 months creates a controlled pilot: measure actual auth-rate lift, actual reconciliation burden, actual ops overhead on ~20–30% of volume before committing further. If net savings don't survive operational complexity, stop and stay on renegotiated Stripe. If they do, expand. This converts Skeptic's uncertainty into testable hypotheses rather than reasons to defer.

**Current position:**

Renegotiate Stripe immediately. In parallel, build toward orchestration via a phased pilot on new traffic only. ~75% confident because: (a) network tokenization provides a credible portability path for the stored-credential problem Skeptic identified, (b) a pilot-first approach makes the unknowns measurable before full commitment, and (c) both sides now agree the status quo is suboptimal — remaining disagreements are about implementation sequencing, not strategic direction, and those are testable. I stay below 80% because we're still reasoning without knowing the actual stored-credential percentage, transaction mix, or available engineering bandwidth during hypergrowth.

**Key question for the group:**

Skeptic — given that network tokenization provides a PSP-agnostic portability path and the pilot can be scoped to new traffic only, does your position shift toward "yes, run the pilot," or do you see a reason the pilot itself carries unacceptable risk for a company mid-hypergrowth?

### Round 2 — Skeptic | response | confidence: 74%

**Response to previous points:**
Advocate’s strongest argument is the sequencing point: the real mistake is not “failing to become a processor,” it is letting Stripe lock-in deepen while volume triples. I agree more than before, and I’m changing my view explicitly: a narrow, reversible orchestration pilot is now the most credible third option. But I still disagree that network tokenization fully resolves portability. It helps, but it does not automatically solve legacy Stripe-vaulted cards, recurring mandate migration, account-updater continuity, or operational ownership across two PSPs. So the synthesis between Advocate’s revised case and my earlier objections is: renegotiate Stripe now, pilot a second PSP on tightly bounded new traffic or one corridor, and do not underwrite the economics on migrating the installed base until portability is proven in practice.

**New evidence or angle:**
One angle we have not discussed enough is bargaining power. A credible second PSP can pay off even before major traffic migration because it turns Stripe pricing talks from hypothetical to real. That makes the pilot valuable as commercial leverage and vendor-concentration reduction, not just as a fee-arbitrage project. The catch is measurement: if they cannot produce clean pilot metrics on auth lift, dispute/refund handling cost, reconciliation effort, and net margin after added ops/finance burden, the pilot will generate complexity without decision-grade evidence.

**Current position:**
Do not build full payment processing infrastructure. Renegotiate Stripe immediately, and run a narrow second-PSP pilot only if it is explicitly framed as an experiment with hard success/failure gates and named finance/ops ownership. ~74% because Advocate materially reduced the compliance objection by narrowing scope, but the portability and operational-cost assumptions are still too soft to justify a broad orchestration program.

**Key question for the group:**
What is the six-month, all-in pilot P&L for one specific routable corridor after including engineering time, finance/ops overhead, and support costs, not just processor fee savings?

### Round 3 — Advocate | response | confidence: 76%

**Response to previous points:**

Skeptic's strongest contribution this round is reframing the pilot's primary value: it's bargaining leverage and vendor-concentration reduction *first*, fee arbitrage *second*. That's a better framing than mine. A credible second PSP turns Stripe repricing from "please give us a discount" into "we have a live alternative processing real volume." That alone could be worth $300K–$600K/year in better Stripe terms — potentially exceeding the direct savings from the pilot corridor itself. I'm adopting this framing.

Skeptic is also right that I oversold network tokenization as a clean portability solution. It addresses *card-on-file* migration for future routing, but doesn't solve recurring mandate ownership, account-updater continuity, or the operational split where Stripe owns disputes on old transactions while the new PSP handles current ones. I was treating portability as a technical problem when it's equally an operational and financial one.

Where I still push back: Skeptic's insistence on a "six-month all-in pilot P&L" before greenlighting risks becoming a reason to never start. The pilot *is* the mechanism for generating that P&L. You can scope a 90-day, single-corridor test with a $50K–$80K engineering budget (one engineer, part-time ops support) and pre-defined kill criteria — if auth rates drop >0.5%, if reconciliation takes >X hours/week, if dispute resolution exceeds Y days, stop. That's not a major resource bet for a company burning Series A capital. Demanding decision-grade economics before running the experiment that produces them is circular.

**New evidence or angle:**

We've exhausted the major strategic and operational arguments. What hasn't been said: the two positions are now close enough that the *decision framework* matters more than the *decision*. Both sides agree on renegotiate-first, pilot-second. The remaining gap is how high the bar should be to *start* the pilot vs. how high the bar should be to *expand* it. I'd propose splitting those: low bar to start (one corridor, new traffic, named owner, 90-day timebox), high bar to expand (proven P&L, clean reconciliation metrics, portability evidence). This isn't a compromise — it's the correct risk structure for an experiment.

**Current position:**

Renegotiate Stripe immediately. Run a tightly bounded 90-day orchestration pilot on one new-traffic corridor with explicit kill criteria and a named finance/ops owner. Do not plan migration of stored credentials until pilot data proves the economics. ~76% confident because both sides' remaining objections are about implementation sequencing that a structured pilot resolves empirically, and the downside of a failed 90-day experiment ($50K–$80K, one engineer's quarter) is trivially small relative to the $1.5M–$4.5M/year fee exposure.

**Key question for the group:**

Can we draft joint success/failure criteria for a 90-day pilot — specifically: what auth-rate delta, reconciliation overhead, and net-margin threshold would make Skeptic say "expand" vs. "stop"?

**Convergence assessment:** CONVERGING — Both sides agree on renegotiate Stripe, don't build full processing, pilot orchestration with guardrails. The remaining gap is narrow: how much upfront evidence is needed to *start* the pilot vs. to *expand* it. That's an implementation detail, not a strategic disagreement.

---

## Consensus Summary

### Decision
Do not build full payment processing infrastructure. Renegotiate Stripe pricing immediately to capture $300K–$600K/year in near-term savings, then run a tightly bounded 90-day orchestration pilot on a single new-traffic corridor with one engineer, a named finance/ops owner, and explicit kill criteria. Expand only if pilot data proves positive economics after accounting for reconciliation overhead, auth-rate impact, and operational complexity.

### Key Contention Points

| # | What Was Debated | Resolution | Who Had the Strongest Case & Why |
|---|-----------------|------------|----------------------------------|
| 1 | Full in-house processing vs. staying on Stripe | Resolved — both rejected the binary. Orchestration layer (multi-PSP routing) emerged as the credible third path. | Skeptic initially, for exposing that the full-build scope was reckless for a 20-engineer Series A; Advocate then strengthened it by proposing the narrower orchestration framing. |
| 2 | PCI/compliance risk of owning more of the card path | Resolved — orchestration with tokenized PSP integrations avoids PCI scope expansion entirely. | Skeptic raised it; Advocate resolved it by narrowing from direct processing to orchestration where card data stays with PSPs. |
| 3 | Stored-credential portability as the real gating constraint | Partially resolved — network tokenization (Visa Token Service, Mastercard MDES) provides a path, but legacy mandates, account-updater continuity, and operational splits remain unproven. | Skeptic, for identifying that lock-in depth — not compliance — was the actual bottleneck, and that network tokenization doesn't fully solve recurring mandate migration. |
| 4 | How much evidence is needed before starting the pilot | Resolved via tiered bar — low threshold to start (one corridor, 90-day timebox, ~$50K–$80K budget), high threshold to expand (proven P&L, clean reconciliation metrics). | Advocate, for recognizing that demanding decision-grade economics before running the experiment that produces them is circular; the pilot itself is the evidence-generation mechanism. |
| 5 | Primary value of a second PSP | Resolved — bargaining leverage and vendor-concentration reduction first, direct fee arbitrage second. A live alternative transforms Stripe repricing negotiations. | Skeptic, for reframing the pilot's value hierarchy in a way Advocate explicitly adopted. |

### Unresolved Items & Risks
- **Stored-credential percentage unknown**: What share of current volume depends on Stripe-vaulted cards/subscriptions determines how much volume is initially routable and how fast savings materialize.
- **Engineering bandwidth during hypergrowth**: Whether even one engineer can be spared during 3x volume scaling without jeopardizing core product delivery is untested.
- **Pilot success/failure criteria not yet defined**: Specific auth-rate delta thresholds, reconciliation overhead limits, and net-margin gates need to be set before the pilot starts.
- **Six-month all-in pilot P&L**: The true cost of operating across two PSPs (split disputes, dual reconciliation, finance controls) remains modeled, not measured.
- **Transaction mix unknown**: Domestic vs. international split, average order value, and fraud/chargeback profile all affect whether fee savings survive operational complexity.

### Confidence: High
Both sides converged to the same three-step recommendation (renegotiate, pilot, expand-if-proven) with remaining disagreements limited to implementation sequencing that the pilot itself resolves empirically.
