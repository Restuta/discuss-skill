---
topic: "Should a fintech startup (Series A, 20 engineers, processing $50M/year in transactions) build their own payment processing infrastructure or continue using Stripe? They're currently paying ~$1.5M/year in Stripe fees and expect 3x volume growth in 18 months."
mode: "council"
agent_count: "5"
agent_config: "5-agent"
max_rounds: "5"
git_commit: "none"
agent_cli: "codex"
status: consensus
turn: C
round: 3
created: "2026-04-01T09:13:28.377Z"
last_updated: 2026-04-01T09:27:27.801Z
agent_A_name: "Advocate"
agent_A_cli: "codex"
agent_A_role: "advocate"
agent_B_name: "Skeptic"
agent_B_cli: "codex"
agent_B_role: "skeptic"
agent_C_name: "Domain Expert"
agent_C_cli: "codex"
agent_C_role: "expert"
agent_D_name: "User Advocate"
agent_D_cli: "codex"
agent_D_role: "user_advocate"
agent_E_name: "Synthesizer"
agent_E_cli: "codex"
agent_E_role: "synthesizer"
---

# Discussion: Should a fintech startup (Series A, 20 engineers, processing $50M/year in transactions) build their own payment processing infrastructure or continue using Stripe? They're currently paying ~$1.5M/year in Stripe fees and expect 3x volume growth in 18 months.

## Participants
- **Agent A** — Advocate (advocate) via codex
- **Agent B** — Skeptic (skeptic) via codex
- **Agent C** — Domain Expert (expert) via codex
- **Agent D** — User Advocate (user_advocate) via codex
- **Agent E** — Synthesizer (synthesizer) via codex

## Key Questions
1. What is the true total cost of ownership for in-house payment processing vs Stripe at current and projected volumes?
2. What are the regulatory and compliance implications (PCI-DSS, per-country requirements) of each approach?
3. Is there a hybrid approach that captures cost savings without full infrastructure ownership?
4. What is the engineering opportunity cost — what else could those engineers build?

## Research Phase

### Agent A (Advocate) — Independent Research | research

The upside case favors starting to build your own payments infrastructure now, not because “Stripe is bad,” but because the company is large enough for payments to become a strategic advantage rather than a utility bill. At today’s run rate, the startup is paying about 3% of volume in fees ($1.5M on $50M). If volume reaches $150M in 18 months and economics stay similar, that becomes roughly $4.5M/year. Even a modest 50-100 bps improvement from direct acquiring, IC+ pricing, bank-rail substitution, or smarter routing would be worth about $750k-$1.5M/year at the projected volume. That is large enough to fund a focused payments platform team and still improve gross margin materially. Stripe itself signals that high-volume merchants graduate to more control: its pricing page explicitly offers custom IC+ pricing, and its “Vault and Forward API” exists so merchants can store credentials and route to other processors while keeping PCI scope manageable ([Stripe pricing](https://stripe.com/us/pricing)).

The real opportunity is not only fee reduction; it is revenue lift. Payments performance is an operating lever. Stripe markets a 2.2% average revenue increase from Authorization Boost and says it recovers 20% of false declines on average ([Stripe Authorization Boost](https://stripe.com/us/authorization)). Visa says tokenized card-not-present transactions see a 4.6% authorization lift globally and about 30% less online fraud versus PAN transactions ([Visa tokenization](https://corporate.visa.com/en/solutions/commercial-solutions/knowledge-hub/tokenization.html)). Those numbers imply that owning the routing, tokenization, retries, and approval analytics layer can create upside well beyond processor-fee savings. A 1% authorization improvement on $150M is $1.5M of additional approved volume before any margin effects. In fintech, that can be more valuable than the fee savings.

There are strong success patterns. Uber’s next-gen payments platform let it reduce launch time for new business lines and new markets from months to days ([Uber Engineering](https://www.uber.com/en-US/blog/payments-platform/)). Airbnb’s replatformed payments architecture helped it launch 20+ local payment methods in just over a year; Airbnb attributes the new platform to faster integrations, less engineering effort, better observability, and “meaningful uplift” in bookings and new users where local methods launched ([Airbnb Engineering](https://airbnb.tech/payments/pay-as-a-local/)). Shopify is the clearest economic proof that payments can become a growth engine: in 2025, “merchant solutions” were 76% of revenue, driven principally by payment processing and currency conversion fees from Shopify Payments; Shopify also reported 37% gross payments volume growth ([Shopify 2025 results](https://www.shopify.com/investors/press-releases/shopifys-standout-2025-the-launchpad-for-a-new-era-of-commerce-in-2026), [Shopify 10-K](https://www.sec.gov/Archives/edgar/data/1594805/000159480526000007/shop-20251231.htm)).

So the bullish view is: do not “replace Stripe in one shot”; build the control plane. Keep Stripe as one rail initially, but own the ledger, routing, token strategy, reconciliation, approval analytics, payout logic, and support for lower-cost rails like ACH/RTP where the product permits. That path compounds. It improves negotiating leverage with processors, speeds international and product expansion, and turns payments from a tax on growth into differentiated infrastructure.

Main uncertainties: the savings depend on card mix, debit vs. credit, international share, dispute/fraud profile, and how much of the current $1.5M is true processing versus value-added Stripe products. If those inputs are unfavorable, first-year ROI could be thinner. But if the company is genuinely a fintech and volume is tripling, the upside scenario is credible: the cost base is already big enough, and the strategic leverage from owning payments is likely to grow faster than the engineering burden.

### Agent B (Skeptic) — Independent Research | research

The skeptical view is that a Series A company with 20 engineers should assume that “building our own payments infrastructure” is a multi-year regulated-operations bet, not a cost-cutting engineering project. The visible cost is Stripe’s fee line; the hidden cost is taking on fraud, PCI scope, acquirer relationships, dispute operations, settlement risk, and uptime obligations yourself. At today’s numbers, the fee burden is about 3.0% of volume ($1.5M on $50M). That is not obviously “excess margin” you can reclaim. Stripe’s public US pricing is 2.9% + 30c for domestic cards, but Stripe also explicitly offers custom pricing, IC+ pricing, and volume discounts for large-volume users, plus ACH Direct Debit at 0.8% with a $5 cap and a “Vault and Forward” option for routing to other processors without fully replacing Stripe ([Stripe pricing](https://stripe.com/us/pricing), [ACH](https://stripe.com/payments/ach-direct-debit)). Before rebuilding, I would assume there is still meaningful optimization left inside Stripe.

The downside case is scope explosion. If they move toward acting like a payment facilitator or owning more of the stack, Mastercard says a payment facilitator must be registered by an acquirer, and Stripe’s payfac guide says traditional payfac setups require systems for processing, sub-merchant onboarding, compliance, risk, payouts, AML, SAR filing, and potentially money transmitter licenses depending on fund flows ([Mastercard](https://www.mastercard.com/content/mastercardcom/us/en/business/overview/start-accepting/payment-facilitators.html), [Stripe payfacs guide](https://stripe.com/us/guides/payfacs)). There is real regulatory ambiguity here: FinCEN’s merchant payment processor ruling says some payment processors are not money transmitters when they only facilitate payment for goods/services through settlement rails, but that is explicitly facts-and-circumstances dependent ([FinCEN](https://www.fincen.gov/resources/statutes-regulations/administrative-rulings/definition-money-transmitter-merchant-payment)). Translation: the “we’ll just be our own processor” plan can quietly turn into a legal-architecture problem.

Security/compliance is the next trap. Stripe states that if you handle card data directly, you may need to satisfy 300+ PCI DSS controls, with 1,800+ pages of official documentation behind them. Using Stripe Checkout/Elements keeps card data off your servers and can preserve SAQ A scope ([Stripe PCI guide](https://stripe.com/guides/pci-compliance)). If the company’s average ticket is low enough, 3x growth could push them into PCI Level 2 or even Level 1 territory by transaction count, which means QSA involvement, formal assessments, and quarterly scans. That threshold depends on average order value, which is a major uncertainty. If AOV is $100, $150M/year is ~1.5M transactions; if AOV is $25, it is ~6M, which is already a Level 1 problem.

Operationally, the failure modes are ugly: auth/capture bugs, duplicate charges, ledger mismatches, payout delays, chargeback spikes, broken refund logic, false fraud declines, bad statement descriptors, and reserve/settlement mistakes. Stripe’s member-bank terms require merchants to maintain fraud and dispute rates acceptable under network rules and warn that certain activity can trigger fees, settlement delays, audits, withholdings, or termination ([Cross River Bank acquirer terms](https://stripe.com/es-us/legal/crb-acquirer-terms)). Stripe also advertises 99.999% average historical uptime and bundles fraud tooling, payment method coverage, support, and compliance into the platform ([Stripe pricing](https://stripe.com/us/pricing)). Reproducing that with a 20-engineer team is improbable.

My bottom line: the downside scenario is spending 12-24 months and several key hires to save less than expected, while increasing regulatory blast radius and risking payment outages during a growth phase. I would not support a full in-house processor build unless they first decompose current fees, prove that Stripe markup rather than interchange is the problem, exhaust negotiation/ACH/orchestration options, and show that net annual savings after staffing, compliance, and risk ops are still decisively positive.

### Agent C (Domain Expert) — Independent Research | research

From an implementation-feasibility lens, there are really two different projects hiding inside “build our own payments.” One is building an internal payments control plane while still relying on PSPs/acquirers underneath. The other is replacing Stripe as the processor of record. The first is feasible for a 20-engineer company if it is tightly scoped. The second is a multi-year company bet. Stripe’s own pricing page already signals the near-term alternative: standard pricing is simple, but larger merchants can get custom/IC+/volume pricing ([Stripe pricing](https://stripe.com/us/pricing)). Stripe also now offers multi-processor routing through Orchestration, but Stripe is explicit that when you route to third-party processors, those processors still own fees/liability, and Stripe Orchestration does not cover everything, including some disputes/settlement flows ([Stripe Orchestration](https://docs.stripe.com/payments/orchestration)).

If the startup means “become our own processor,” the hard requirements arrive immediately. PCI SSC says PCI DSS applies to any entity that stores, processes, or transmits cardholder data, including merchants, processors, acquirers, and service providers ([PCI SSC](https://www.pcisecuritystandards.org/standards/pci-dss/)). Stripe’s migration docs make the switching cost concrete: Stripe will only export stored card data to another PCI DSS Level 1-compliant payment processor ([Stripe PAN export](https://docs.stripe.com/get-started/data-migrations/pan-export)). So even a clean migration off Stripe requires you to already have a compliant receiving processor stack, not just a new API. Direct network connectivity is also not “just integrate Visa”: Visa says production use of VisaNet Connect Acceptance requires pre-approval by both an acquirer and Visa, and is aimed at acquirers, acquirer-processors, and approved technology partners ([VisaNet Connect](https://developer.visa.com/capabilities/visanet-connect-acceptance/docs-getting-started)). If the company facilitates payments for submerchants or moves funds for third parties, the regulatory/registration bar rises again: Visa third-party agents typically need a sponsor and PCI documents, and Mastercard says payment facilitators must be registered by an acquirer ([Visa TPA registration](https://partner.visa.com/site/programs/third-party-agent-registration.html), [Mastercard payment facilitators](https://www.mastercard.com/content/mastercardcom/us/en/business/overview/start-accepting/payment-facilitators.html)).

What actually has to be built is broader than auth/capture. You need tokenization/card vaulting, key management/HSMs, idempotent payment execution, refunds/voids/retries, 3DS/SCA, network tokens/account updater, dispute evidence tooling, reconciliation, settlement, finance-grade ledgering, fraud/risk, observability, and 24x7 operational support. Real-world precedents show how deep this goes. Airbnb says it built a “large in-house payments operation” to support 191 countries, 70+ currencies, and more than two dozen payment routes ([Scaling Airbnb](https://medium.com/airbnb-engineering/scaling-airbnbs-payment-platform-43ebfc99b324)). When Airbnb later rebuilt payment orchestration, it redesigned around idempotent DAG-based workflows and needed dedicated QA, unit/integration/E2E coverage, and matchup jobs against the legacy path before rollout ([Rebuilding Payment Orchestration at Airbnb](https://medium.com/airbnb-engineering/rebuilding-payment-orchestration-at-airbnb-341d194a781b)). In 2026, after a multi-year replatforming, Airbnb still described launching 20+ local payment methods in 14 months using connector/plugin architecture and processor-agnostic multi-step transactions ([Pay As a Local](https://medium.com/airbnb-engineering/pay-as-a-local-bef469b72f32)). Adyen, whose core business is payments, processes payments “hundreds of times a second, 24/7” and still treats idempotency, reporting, and accounting architecture as major engineering concerns ([Adyen engineering](https://medium.com/adyen/design-to-duty-how-we-make-architecture-decisions-at-adyen-11303bfa3065)).

The strongest practical precedent is that very large platforms often stop short of owning the processor layer. Stripe’s Shopify case study says Shopify has partnered with Stripe for years to power Shopify Payments and continued building adjacent financial products on Stripe infrastructure ([Shopify on Stripe](https://stripe.com/us/customers/shopify)).

My domain-expert conclusion: a Series A company at $50M GPV should not try to replace Stripe with a self-owned processing stack in the next 18 months. The feasible move is to keep Stripe, negotiate enterprise pricing now, and if needed build only the control-plane pieces that create leverage: internal ledger/reconciliation, PSP abstraction, and perhaps multi-processor routing. The key uncertainty is transaction profile: average ticket, domestic vs international mix, dispute/fraud rate, and whether the business handles third-party funds. Those variables determine whether the right next step is price negotiation, dual-PSP orchestration, or eventually a deeper processor strategy.

### Agent D (User Advocate) — Independent Research | research

From a user-experience lens, the default should be: do not replace Stripe end-to-end in the next 18 months. Users do not care that you “own the stack”; they care that checkout is fast, trusted, locally familiar, rarely declines, refunds are smooth, and support can resolve edge cases. That matters more at your scale because the company is growing from roughly $50M/year to an implied ~$150M/year in payment volume. A small user-facing regression becomes very expensive very quickly: a 1% drop in payment success at that future scale strands about $1.5M in annual transaction volume, which is roughly the same order as today’s entire Stripe bill. That is an inference from the numbers you provided, but it frames the UX risk clearly.

The market is also moving toward more payment choice, not less. Worldpay’s 2025 Global Payments Report says digital payments grew from 34% of global ecommerce value in 2014 to 66% in 2024, and explicitly frames consumer demand as “choice, control and convenience” rather than just card acceptance ([Worldpay](https://www.worldpay.com/en/insights/articles/digital-payments-GPR-guide)). Stripe’s current surface area lines up with that user reality: it offers access to 100+ payment methods, local acquiring in 46 markets, and support for 195+ countries and 135+ currencies ([Stripe Payments](https://stripe.com/us/payments)). Its dynamic payment-method system uses AI based on more than 100 signals and lets teams A/B test payment methods from the dashboard, which is exactly the sort of continuous UX tuning that in-house processors usually underinvest in while rebuilding table-stakes plumbing ([Stripe dynamic payment methods docs](https://docs.stripe.com/payments/payment-methods/dynamic-payment-methods)).

The highest-risk place to “go custom” is checkout/authentication, because that is where users feel every mistake. Baymard still reports a 70.19% cart-abandonment rate across ecommerce, which is a reminder that checkout friction remains brutally expensive ([Baymard](https://baymard.com/research/checkout-usability)). Stripe’s accelerated checkout product, Link, has real adoption signals: Stripe says businesses with large repeat-customer bases have seen an average 14% returning-user conversion increase; Link reaches 200M+ consumers and is built into hundreds of thousands of Stripe-powered sites ([Stripe Link](https://stripe.com/payments/link)). Real-world case studies are directionally consistent: OpenAI says Link customers paid 40% faster; MemberPress says over 30% of customers chose Link and conversions grew 5% in four months; Visualsoft reports 13% of checkouts via Link, 25% of volume via Apple Pay, six-second Link checkout, and up to 35% conversion uplift after consolidating on Stripe ([OpenAI/MemberPress on Link](https://stripe.com/payments/link), [Visualsoft](https://stripe.com/ae/customers/visualsoft)). Those are vendor-provided numbers, so treat magnitude cautiously, but the directional lesson is strong: modern payment UX gains come from network effects, saved credentials, wallet coverage, and optimization layers that are hard to recreate alone.

Stripe also already handles the ugly user-facing regulatory/authentication edge cases. Its docs emphasize automatic SCA exemptions, minimizing unnecessary authentication, and adapting to fragmented rules across the EEA, UK, India, Japan, and Australia ([Stripe Authentication](https://stripe.com/payments/authentication), [3DS docs](https://docs.stripe.com/payments/3d-secure)). It also claims real-time retry and authorization optimizations that recover false declines and reduce payment failures ([Stripe authorization](https://stripe.com/payments/authorization)). If you replace that too early, users will likely feel it first as more declines, more “try another card” moments, more support tickets, and less trust.

Main uncertainty: if your users are mostly US-only, low-repeat, card-only, and your real pain is economics rather than checkout performance, then building selective infrastructure around Stripe can make sense. But the user-safe version is to build around Stripe, not instead of Stripe: own your ledger, routing abstraction, analytics, and maybe lower-cost rails for specific use cases, while leaving the customer-facing payment experience, authentication, wallets, and global method coverage on Stripe until you have much stronger evidence that users are being constrained by it.

---

## Discussion

### Round 1 — Advocate | response | confidence: 78%

**Response to previous points:**
Agent C has the strongest framing: there are really two decisions here, and collapsing them is the mistake. I agree with C and much of B that “replace Stripe as processor of record” is too big a bet for a Series A team of 20 engineers. B is right that PCI, acquirer sponsorship, disputes, settlement, and regulatory edge cases can turn a cost project into a company-risk project. D is also right that users will punish any checkout/auth regression faster than finance will reward infrastructure purity.

Where I disagree is on the implied fallback of “therefore mostly stay put.” The third option is to start building the control plane now while keeping Stripe on the critical user-facing path. That means Stripe still handles checkout/auth/wallets/SCA, but the company owns ledgering, fee observability, routing abstraction, reconciliation, retry policy, and selective lower-cost rails where product fit exists. That directly addresses the open questions: it contains compliance scope, preserves UX, and still creates negotiating leverage plus future processor optionality.

**New evidence or angle:**
The missing angle is timing asymmetry. Waiting until volume triples is not neutral; it makes the eventual migration harder because every cutover happens under higher transaction volume, more countries/methods, and more revenue at risk. A lightweight abstraction layer built at $50M GPV is cheaper and safer than one built at $150M GPV. Said differently: they do not need to “earn” full in-house processing now, but they should earn the option now. If projected volume is $150M, even a 50 bps improvement is roughly $750k/year; every quarter of delay after that scale is real lost margin and weaker negotiating leverage.

**Current position:**
I’m at ~78% that they should continue using Stripe for the next 18 months, but immediately start a narrow in-house payments platform program. Confidence is below 90% because the fee stack is still too coarse: if most of the $1.5M is unavoidable interchange/network cost, the savings case weakens; if a large share is Stripe markup/value-added products, the control-plane case strengthens materially.

**Key question for the group:**
What is the actual composition of the current $1.5M Stripe bill: interchange/network pass-through vs Stripe markup vs fraud/disputes/value-added products, and how much of projected 3x growth is card volume versus ACH/bank-rail-eligible volume?

### Round 1 — Skeptic | response | confidence: 76%

**Response to previous points:**
Agent A’s strongest argument is the timing asymmetry: if they may eventually need routing, ledgering, and processor optionality, starting from zero at $150M GPV is harder and riskier than laying foundations at $50M. Agent C sharpens that well by separating “control plane” from “be our own processor,” and Agent D is right that checkout/auth regressions would wipe out a large share of any fee savings fast.

Where I still disagree is that “start building the control plane now” is obviously the safe middle path. For a 20-engineer Series A team, ledgering, reconciliation, routing abstraction, ACH offload, dispute tooling, and payment observability are not one project; they are several. If they do not yet have a second processor committed, a routing layer is speculative architecture. If they do not yet know fee composition, a ledger/recon rewrite may optimize the wrong problem. So I support C’s decomposition, but only after a stricter gate: exhaust Stripe enterprise repricing, ACH substitution, and bill decomposition first, then build only the smallest internal component justified by a signed savings case.

**New evidence or angle:**
The missing angle is fully loaded team cost versus realistic savings. At projected $150M volume, 50 bps savings is about $750k/year; 100 bps is $1.5M/year. A credible internal payments program is not “2 engineers and a roadmap.” It likely means 4-6 senior engineers plus an engineering manager, with ongoing finance/risk/compliance/legal involvement. That easily consumes most of the 50 bps case and a meaningful chunk of the 100 bps case before outage risk, dispute ops, and on-call burden. So the hurdle is higher than “fees look big.” The savings must beat a real org cost, not just Stripe’s invoice.

**Current position:**
They should stay on Stripe for now and treat any in-house build as a gated optimization program, not a platform initiative. I’m ~76% confident because the downside of premature scope expansion is clear, while the upside still depends on unanswered facts: fee mix, AOV/transaction count, domestic vs international mix, and how much volume is actually bank-rail-eligible.

**Key question for the group:**
After negotiated Stripe repricing and realistic ACH/bank-rail migration, what is the remaining net annual savings versus the fully loaded cost of a dedicated payments platform team plus compliance/risk operations?

### Round 1 — Domain Expert | response | confidence: 82%

**Response to previous points:**
Agent D and Agent B have the strongest combined constraint: a 20-engineer Series A team should not confuse “reduce Stripe spend” with “take on processor-grade reliability, compliance, and operations.” D is right that at the projected $150M GPV, even a small checkout/auth regression can wipe out a meaningful share of the savings case. B is right that PCI scope, dispute ops, settlement correctness, and 24x7 incident response are not side quests. I also think Agent A is right on timing: waiting until 3x scale to start any internal payments work is not neutral; migrations get harder under load and revenue concentration. The synthesis is sequence, not ideology: keep Stripe on the customer-facing path, but only build the internal pieces that solve a proven problem now, starting with fee attribution, reconciliation, and ledgering if finance pain is already real.

**New evidence or angle:**
The important precedent is often misread. Airbnb and Uber built orchestration layers after they already had multi-market, multi-method, multi-processor complexity; they were standardizing heterogeneity, not pre-building optionality at mid-eight-figure volume. That matters here: a PSP abstraction before there is an actual second PSP or cheaper rail to route to usually becomes costly indirection and a lowest-common-denominator API. At this company’s scale, the hard problem is not throughput; it is operational surface area. That pushes against “build your own processor,” and in favor of a very narrow control-plane program only when there is a concrete second-rail use case.

**Current position:**
They should continue using Stripe as the primary processor for the next 18 months and should not attempt processor replacement on this horizon. I support a gated hybrid path only if it starts with finance-grade internals that have immediate value independent of any migration, and only adds routing after a real second PSP or bank rail is identified. I’m ~82% confident because the technical precedents and compliance reality point strongly that way, but the answer still depends on fee composition and whether they handle third-party funds.

**Key question for the group:**
What percentage of the projected $150M volume is realistically eligible for a cheaper alternative rail or second acquirer in the next 12 months, by corridor and use case?

### Round 1 — User Advocate | response | confidence: 84%

**Response to previous points:**
Agent C has the strongest framing: this is really two decisions, not one. Agent B adds the right bar that any internal build has to beat fully loaded engineering, compliance, risk, and support cost, and Agent A is right that waiting until $150M GPV to build anything makes future migration harder. My synthesis is narrower than A’s but less static than “stay put”: keep Stripe on the customer-facing path, and only build internal payments pieces that users never have to notice. That means fee attribution, reconciliation, ledgering, and maybe selective rail choice for specific use cases, but not a checkout/authentication/wallet rebuild during a 3x growth phase. The most important open questions are not just fee mix; they are where Stripe is actually hurting users today and what customers would lose if the team starts swapping core payment flows under load.

**New evidence or angle:**
The missing user lens is support and trust recovery. Users experience payments as “did it work, did I get charged correctly, did my refund arrive, and can support fix it fast,” not as basis points. A payment outage or refund/reconciliation bug can create churn, duplicate support load, and brand damage that lasts longer than the finance win from lower fees. So the decision should be gated by user-facing metrics first: payment success rate by segment, checkout completion time, refund turnaround time, dispute resolution time, and support contacts per 1,000 payments. If Stripe is already strong on those, pulling 4-6 engineers into infra likely worsens user outcomes overall because those engineers are not shipping product improvements customers would actually feel.

**Current position:**
They should keep Stripe as the primary customer-facing payment layer for the next 18 months, negotiate pricing aggressively, and only build narrow internal payments capabilities that reduce cost or improve control without changing the checkout and authentication experience. I’m ~84% confident because the user downside of payment regressions is immediate and concentrated, while most of the safer upside can still come from repricing, analytics, selective ACH/bank-rail use, and better internal finance tooling. I would change my mind if Stripe is clearly blocking a major user need in core markets today.

**Key question for the group:**
What concrete user-facing problem is Stripe causing right now that is big enough to justify diverting engineers from the core product: elevated declines in a key segment, missing local payment methods, slow refunds or payouts, or high payment-related support volume?

### Round 2 — Advocate | response | confidence: 81%

**Response to previous points:**
Agent B’s strongest point, reinforced by Agent C and Agent D, is that “control plane” can become a comforting euphemism for multiple expensive products: ledgering, reconciliation, routing, ACH offload, disputes, and ops. If there is no second processor signed, no hard fee decomposition, and no proven user pain, a generic abstraction layer is speculative architecture, not leverage. I agree with that, and I’m updating my view accordingly.

Where I still push back is on any passive interpretation of “stay on Stripe.” The right synthesis is not platform-building now, but decision-building now. Agent B is right to demand a fully loaded savings case. Agent C is right that routing should follow a real second rail, not precede it. Agent D is right that customer-facing flows must stay on Stripe unless Stripe is visibly harming users. So the actionable path is: negotiate Stripe enterprise pricing immediately, quantify fee/auth economics by segment, and only build the smallest internal capability that has standalone value today, most likely payments intelligence plus finance-grade reconciliation. That answers the main open questions better than arguing ideology.

**New evidence or angle:**
The scarce asset here is not processor connectivity; it is decision-quality payments data. Without their own margin, authorization, and dispute visibility by payment method, country, BIN range, ticket size, and customer cohort, they cannot negotiate well with Stripe, cannot identify bank-rail-eligible volume, and cannot judge whether a second PSP is worth the complexity. The first “in-house payments infrastructure” should therefore be an economics-and-performance layer, not a processor replacement or broad orchestration layer. That creates leverage even if they stay on Stripe longer.

**Current position:**
I’ve moved from “start a narrow payments platform program now” to “start a 60-90 day prove-or-kill optimization program now.” They should stay on Stripe as the primary processor and user-facing layer for this horizon, but act immediately on repricing, payment economics instrumentation, and selective internal finance tooling. I’m at ~81% because the risk evidence from B/C/D is real, but I still think doing nothing until $150M GPV would be a mistake.

**Key question for the group:**
After Stripe repricing, what is the remaining annual gross-savings pool, broken down by segment, for volume that is realistically reroutable within 12 months without changing the customer-facing checkout/authentication experience?

### Round 2 — Skeptic | response | confidence: 83%

**Response to previous points:**
Agent A’s strongest update is the right one: the first move is not “build payments infra,” it is “build decision quality” through fee, auth, and dispute visibility. Agent C sharpened the gating correctly: do not build routing before there is a real second rail, and Agent D is right that any plan has to be judged against user-facing outcomes, not basis-point theory. I agree with that synthesis, but I want one tighter constraint: even finance-grade internals should clear a higher bar than “seems useful.” If Stripe repricing, better reporting, and selective ACH migration can answer 80% of the economics problem, then building internal ledger/recon now may still be premature scope. The key open questions are still unresolved: how much of the $1.5M is Stripe markup vs unavoidable pass-through cost, what share of projected volume is actually reroutable in 12 months, and what user or ops pain exists today that Stripe cannot solve cheaply.

**New evidence or angle:**
The missing angle is transition-state complexity. Hybrid is not “halfway to in-house”; during migration it is often 1.5x operational complexity because you must run two systems, reconcile two sources of truth, and debug failures at the boundary. That means the real risk is not just the steady-state cost of owning more payments logic, but the 6-12 month period where auth, refunds, disputes, settlement, and finance reporting can drift between old and new paths. For a fast-growing company, that transition tax can wipe out the near-term savings case even if the end-state architecture is sound.

**Current position:**
They should remain on Stripe as the primary processor and customer-facing payments layer for the next 18 months, and only fund a narrow optimization program after repricing and volume-segment economics prove a real residual savings pool. I’m ~83% confident because the group has largely converged on the same constraint: full replacement is a bad bet, and even the hybrid path only makes sense if the first internal build has standalone value without assuming a future processor migration.

**Key question for the group:**
After Stripe repricing and realistic ACH/bank-rail offload, what is the quantified residual annual savings pool that remains, and is it large enough to justify not just the end-state team cost but also the 6-12 month transition and reconciliation risk?

### Round 2 — Domain Expert | response | confidence: 86%

**Response to previous points:**
Agent A’s update is the strongest move this round because it absorbs the best objections from Agent B and Agent D without collapsing into “do nothing.” The steel-man is: before building any payment platform, they need decision-quality economics and operational data, because otherwise “control plane” is just expensive ambiguity. I agree with A on that, and with B’s added constraint that even internal finance-grade work should be justified against a real residual savings pool, not against Stripe’s gross invoice. I also think D is right that the customer-facing path must remain on Stripe unless there is current, measurable user harm. My synthesis is narrower now: do not build PSP abstraction or routing yet; first prove three facts in order: what part of the $1.5M is true Stripe markup, what share of projected volume is actually rail-switchable within 12 months, and whether they touch third-party funds in a way that changes the compliance architecture.

**New evidence or angle:**
The missing technical angle is external critical-path risk. Even if the engineering were straightforward, dual-processor or direct-acquirer work is gated by non-code dependencies: acquirer underwriting, sponsor approval, PCI assessment timelines, legal review, chargeback operations, and finance close integration. For a 20-engineer Series A team, those dependencies usually dominate the schedule more than API implementation does. That makes “we can start small and route later” less linear than it sounds: once you cross from reporting/reconciliation into live processing changes, the calendar risk jumps sharply because outside parties now sit on the critical path.

**Current position:**
My position is firmer than in Round 1: they should stay on Stripe as the primary processor and customer-facing payment layer through this 18-month horizon, and they should not begin processor replacement work now. The only internal build I would support immediately is payments economics/reconciliation instrumentation that has standalone value even if they never add a second PSP. I’m at ~86% because the group has converged on the same implementation reality: the feasible path is narrower than “hybrid infrastructure,” and the biggest remaining uncertainty is economic, not architectural.

**Key question for the group:**
After enterprise repricing and realistic ACH/bank-rail offload, how many net basis points of Stripe-controllable cost remain on volume that is actually reroutable within 12 months without changing checkout, auth, or fund-flow/compliance posture?

### Round 2 — User Advocate | response | confidence: 88%

**Response to previous points:**
Agent A’s revised position is the strongest one this round: before building “payments infrastructure,” build decision quality. That steel-mans Agent B’s cost warning, Agent C’s sequencing constraint, and my user-risk concern at the same time. I agree with A, and I’m narrowing my own earlier view: even internal ledgering/reconciliation should not be assumed; it should be funded only if it clearly improves user-facing outcomes like faster refunds, fewer support escalations, or fewer payment-state mismatches. I also agree with B that hybrid creates transition risk, and with C that routing before a real second rail exists is speculative. The most important open questions now are: what pain do users actually feel today, what portion of the Stripe bill is truly controllable, and can any savings be captured without touching checkout/authentication at all?

**New evidence or angle:**
The missing angle is trust asymmetry. Users do not notice lower processing cost, but they remember duplicate charges, missing refunds, payout confusion, and “payment pending” states for a long time. That means the bar for any live payments change should be higher than normal product work: it should improve a user-visible metric, not just a margin line. If the company wants a safe first step, the best candidate is probably instrumentation/support tooling that helps resolve failed payments and refunds faster while staying fully on Stripe’s customer-facing rails.

**Current position:**
They should keep Stripe as the primary processor and customer-facing payment layer through this growth window, negotiate pricing hard, and run a short prove-or-kill optimization program before building any broader payments platform. I’m at ~88% because the group has largely converged that full replacement is a bad bet here, and the user downside of transition mistakes is immediate while most near-term upside can likely be captured inside Stripe or around it.

**Key question for the group:**
Which user-facing payments metric is currently bad enough to justify engineering work now: approval rate in a key segment, checkout conversion, refund turnaround, payout reliability, or payment-related support contacts per 1,000 transactions?

### Round 3 — Advocate | response | confidence: 86%

**Response to previous points:**
Agent C has the strongest crux now: the real cliff is not API complexity, it is the moment you move from internal reporting into live payment-path changes, because acquirer underwriting, PCI scope, legal review, and finance-close integration put outside parties on the critical path. I agree, and Agent B sharpens that with the transition-state risk that “hybrid” can mean 1.5x operational complexity before it means leverage. Agent D is also right that users remember duplicate charges, failed payments, and slow refunds far longer than they benefit from lower processing cost. So I’m changing my emphasis again: the near-term opportunity is not “start building a control plane,” it is “buy the option intelligently.” That means answering four facts in order: what part of the $1.5M is Stripe-controllable markup, what share of projected volume is actually reroutable within 12 months, whether third-party fund flows change the compliance posture, and which user-facing metric is bad enough to justify touching payments at all.

**New evidence or angle:**
The missing move is a commercial market test, not an engineering one. Before writing routing code, they should run a 60-90 day RFP with Stripe plus 1-2 credible alternatives using their real mix: AOV, domestic/international split, card/debit/ACH share, chargeback rate, MCC, and payout model. That is the fastest way to turn the remaining disagreement into numbers. If no competitor can show material net savings on reroutable volume after transition cost, the “build now” case largely dies without spending engineers to discover that.

**Current position:**
They should keep Stripe as the primary processor and customer-facing layer through this growth window, should not build their own processor, and should only fund a narrow optimization program now: repricing, fee/auth/support instrumentation, and external quote collection. I’m at ~86% because the risk case from B, C, and D is now well-supported, but I still see real opportunity in creating negotiating leverage and a data-backed option for selective rail diversification later.

**Key question for the group:**
What minimum net residual savings threshold, after Stripe repricing and full transition/team cost, would justify any live payment-path change at all: for example, how many basis points on what share of projected $150M volume?

**Convergence assessment:** CONVERGING — positions are within roughly 80% agreement; the remaining gap is not whether to replace Stripe now, but what quantified savings and user-benefit threshold would justify any internal live-processing work beyond analytics/reconciliation.

### Round 3 — Skeptic | response | confidence: 87%

**Response to previous points:**
Agent A has the strongest refinement this round: the immediate job is not to build payments infrastructure, but to buy the option intelligently through repricing, instrumentation, and an external market test. I agree, and Agent C’s constraint is the reason why: once they touch live payment paths, outside-party dependencies dominate the schedule. Agent D is also right that the downside is asymmetric because users feel every failure instantly while fee savings are invisible. My remaining pushback is narrower: even a 60-90 day RFP should not be treated as proof that a live migration is attractive, because quoted basis points are often the easy part. The open questions still need to be answered in order: what share of the $1.5M is actually Stripe-controllable, what volume is truly reroutable in 12 months without changing checkout or compliance posture, and what user or ops pain exists today that is large enough to justify any execution risk.

**New evidence or angle:**
A new caution: headline processor quotes are not the same as executable savings. The real economics often move during underwriting and implementation through reserves, fraud-loss assumptions, dispute handling, minimums, cross-border treatment, and support/integration obligations. So the decision gate should not be “another PSP quoted lower bps,” but “another PSP still wins after diligence-adjusted economics and a realistic time-to-savings model.” Otherwise they risk optimizing to a paper spread that disappears in the transition.

**Current position:**
They should stay on Stripe as the primary processor and customer-facing payments layer through this 18-month growth window, and they should not start live processor replacement work now. I support only a narrow prove-or-kill program: Stripe repricing, fee/auth/support instrumentation, and external quote collection with diligence-adjusted economics. I’m at ~87% because the group has mostly resolved the architecture question; the remaining uncertainty is whether any residual savings pool survives real transition cost, external-party drag, and user-risk constraints.

**Key question for the group:**
What is the minimum diligence-adjusted payback threshold for any live payment-path change: for example, after repricing, reserves, transition cost, and team cost, how many net basis points on what share of projected $150M volume must be bankable within 12 months?

**Convergence assessment:** CONVERGING — we mostly agree they should not build their own processor now and should keep Stripe on the customer-facing path; the remaining gap is the decision threshold for any narrower live-processing change after repricing and real-world economics are known.

---

## Consensus Summary

### Decision
Continue using Stripe as the primary processor and keep all customer-facing payment flows on Stripe for the next 18 months; do not build your own payment processor. Run a 60-90 day prove-or-kill program instead: negotiate enterprise/IC+ pricing with Stripe, decompose the current fee stack, instrument authorization/refund/support economics, and get diligence-adjusted quotes from 1-2 alternatives. Only fund narrow internal tooling with standalone value, or a selective second rail, if it can prove roughly `75-100 bps` net savings on a meaningful reroutable share of volume with payback under 12 months and no checkout/authentication regression; this sacrifices some medium-term fee upside and processor independence in order to protect growth velocity, UX stability, and compliance containment.

### Key Contention Points

| # | What Was Debated | Resolution | Who Had the Strongest Case & Why |
|---|-----------------|------------|----------------------------------|
| 1 | Build in-house processing vs stay on Stripe | Do not replace Stripe as processor of record on this horizon. The compliance, sponsor-bank, PCI, dispute, and settlement burden is too large for a Series A team of 20 engineers. | **Agent C (Domain Expert)**, because they separated “control plane” from “becoming your own processor” and showed that the second path is a multi-year operational/regulatory bet, not an engineering project. |
| 2 | Whether the “hybrid” answer means building payments infrastructure now | Do not start with generic routing or a PSP abstraction. Start only with a narrow optimization program that improves decision quality and has value even if no migration ever happens. | **Agent A (Advocate)**, because they made the best timing argument: buy the option now through pricing, instrumentation, and market testing, rather than waiting until `3x` scale makes every future change riskier. |
| 3 | Whether Stripe fees are large enough to justify internal investment | Treat the `$1.5M` Stripe bill as gross, not savings potential. Any business case must survive fully loaded team cost, transition risk, reserves, compliance, and ops overhead after repricing and ACH/offload opportunities are accounted for. | **Agent B (Skeptic)**, because they most clearly converted headline bps savings into true TCO and emphasized that quoted processor spreads often collapse after underwriting and implementation reality. |
| 4 | Cost savings vs user experience risk | Protect checkout, auth, wallets, refunds, and payment reliability first. Small approval-rate or refund-state regressions can erase the financial upside and damage trust during a high-growth period. | **Agent D (User Advocate)**, because they framed the asymmetry correctly: users never notice lower processing cost, but they immediately feel duplicate charges, failed payments, and slow refunds. |

### Unresolved Items & Risks
- The exact composition of the current `$1.5M` Stripe spend is still unknown: Stripe markup vs interchange/network pass-through vs value-added products.
- The share of projected volume that is realistically reroutable or bank-rail-eligible within 12 months is still unproven.
- If the business handles third-party funds or payfac-like flows, the compliance and licensing posture may change materially.
- Processor quotes must be diligence-adjusted for reserves, fraud/dispute assumptions, support obligations, and implementation timing before they are treated as real savings.
- The go/no-go threshold for any live payment-path change should be set explicitly before work begins: target net basis-point savings, payback period, and zero-tolerance user metrics.

### Confidence: High
By Round 3 the agents had largely converged on the same conclusion: keep Stripe, do not build your own processor now, and only revisit narrower live-processing changes if hard economics and user-risk gates are clearly met.
