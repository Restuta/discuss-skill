---
topic: "Should a fintech startup (Series A, 20 engineers, processing $50M/year in transactions) build their own payment processing infrastructure or continue using Stripe? They're currently paying ~$1.5M/year in Stripe fees and expect 3x volume growth in 18 months."
mode: "single-agent"
agent_count: "1"
agent_cli: "codex"
status: "consensus"
created: "2026-04-01T08:55:12.286Z"
---

# Discussion: Should a fintech startup (Series A, 20 engineers, processing $50M/year in transactions) build their own payment processing infrastructure or continue using Stripe? They're currently paying ~$1.5M/year in Stripe fees and expect 3x volume growth in 18 months.

## Single Agent Analysis

# Analysis: Should a fintech startup (Series A, 20 engineers, processing $50M/year in transactions) build their own payment processing infrastructure or continue using Stripe? They're currently paying ~$1.5M/year in Stripe fees and expect 3x volume growth in 18 months.

## Research
At today’s scale, the economics usually do **not** support building a true in-house processor. Your current Stripe spend implies an effective cost of about **3.0% of volume** ($1.5M / $50M). If mix and pricing stay similar, 3x volume means roughly **$4.5M/year** in Stripe fees at $150M GMV. The important question is not “can we remove Stripe?” but “how much of that 3.0% is actually replaceable?” In practice, an internal build does **not** eliminate interchange, network assessments, sponsor-bank/acquirer fees, fraud tooling, dispute ops, reconciliation, compliance, or uptime obligations. It mainly replaces Stripe’s software margin and managed-service bundle.

A realistic in-house option for a Series A company is not “become Visa/Mastercard infrastructure”; it is “build routing, vaulting, reconciliation, and processor integrations while still relying on sponsor-bank/acquirer rails.” I would model the non-Stripe variable cost floor for card-heavy CNP volume at roughly **2.1%-2.4%** of GMV, with **fixed annual platform cost of ~$2M-$4M** once you include a 4-6 engineer team, a senior payments lead, security/compliance/legal support, audits, cloud/HSM/logging, incident response, and payment ops. On that model, in-house TCO is roughly **$3.0M-$5.2M today** and **$5.2M-$7.6M at $150M GMV**. Even a strong outcome where you save **80 bps** versus Stripe only yields about **$400k/year now** and **$1.2M/year later**; that still does not cover the fixed cost of a credible internal platform. Break-even is more likely in the **$250M-$600M+** annual volume range, depending on mix and execution quality.

Compliance is the second reason not to do this now. Stripe is a **PCI Level 1 service provider**, and Stripe-hosted/Stripe-rendered payment patterns can keep merchants in lighter PCI scope such as **SAQ A** or **A-EP**, depending on implementation. If you take custody of PANs or build your own vault/processor, scope jumps materially; PCI SSC is explicit that **service providers assess under SAQ D for Service Providers**, and banks/acquirers often want QSA-led evidence. Internationally, this compounds fast: **EEA/UK** payments must satisfy **PSD2/SCA** rules; **India** requires RBI authorization for payment aggregators; **Singapore** treats merchant acquisition as a licensed payment service; in the **US**, the FinCEN payment-processor exemption is narrow and fact-specific, with separate state money-transmitter analysis if you receive/transmit funds for others. If you are only the merchant for your own sales, licensing burden is lower; if you hold or settle funds for third parties, it rises sharply.

The best path is usually hybrid. Stripe already supports **custom/IC+ pricing**, **Vault and Forward**, **Payment Element across multiple processors**, and **Orchestration**. That lets you keep Stripe as the PCI vault and checkout layer while selectively adding lower-cost rails, second processors, or internal routing logic. That is a 1-3 FTE program. A full in-house processor is a 5-6+ engineer, 18-month diversion, which is roughly **25-30% of total engineering capacity** for this company. Those engineers are more valuable building differentiated assets: underwriting/risk models, merchant onboarding/KYB, reconciliation automation, ACH/local-bank adoption, payout speed, pricing, and dispute reduction.

Primary references: [Stripe pricing](https://stripe.com/us/pricing), [Stripe security/PCI](https://docs.stripe.com/security/stripe), [Stripe integration security](https://docs.stripe.com/security/guide), [Stripe Elements](https://docs.stripe.com/payments/elements), [Vault and Forward](https://docs.stripe.com/payments/vault-and-forward), [PCI SSC SAQ A FAQ](https://www.pcisecuritystandards.org/faq/articles/Frequently_Asked_Question/How-do-PCI-DSS-Requirements-2-6-and-8-apply-to-SAQ-A-merchants/), [PCI SSC outsourcing FAQ](https://www.pcisecuritystandards.org/faq/articles/Frequently_Asked_Question/does-pci-dss-apply-to-merchants-who-outsource-all-payment-processing-operations-and-never-store-process-or-transmit-cardholder-data/?_hsmi=364054903), [PCI SSC service-provider FAQ](https://www.pcisecuritystandards.org/faq/articles/Frequently_Asked_Question/can-service-providers-use-eligibility-criteria-from-a-merchant-self-assessment-questionnaire-saq-to-determine-applicable-pci-dss-requirements-for-the-service-providers-assessment/), [FinCEN payment processor exemption](https://www.fincen.gov/resources/statutes-regulations/administrative-rulings/application-money-services-business), [EU PSD2](https://finance.ec.europa.eu/regulation-and-supervision/financial-services-legislation/implementing-and-delegated-acts/payment-services-directive_en), [FCA payments guidance](https://www.fca.org.uk/firms/emi-payment-institutions-key-publications), [RBI PA guidelines](https://www.rbi.org.in/scripts/FS_Notification.aspx?Id=11822), [MAS licensing examples](https://eservices.mas.gov.sg/fid/institution/detail/430099-CODA-PAYMENTS-PTE-LTD), [NY DFS money transmitter licensing](https://www.dfs.ny.gov/apps_and_licensing/money_transmitters).

## Recommendation

### Decision
Do **not** build a full payment-processing stack now. Stay on Stripe for the next 18-24 months, but run a deliberate **hybrid cost-reduction program**: negotiate custom/IC+ pricing, shift eligible flows to cheaper rails, and only add a second processor where the unit economics are proven while keeping Stripe as the PCI vault and checkout layer.

### Key Trade-offs
| # | Trade-off | How You Weighed It |
|---|-----------|-------------------|
| 1 | Fee savings vs fixed platform cost | The replaceable portion of Stripe’s fee is smaller than it looks; at $50M-$150M GMV, fixed internal payments-platform cost likely overwhelms gross savings. |
| 2 | Control vs compliance burden | In-house control buys routing flexibility, but it materially expands PCI scope and can trigger licensing/regulatory work by country. |
| 3 | Custom optimization vs global coverage | Stripe bundles SCA, mandates, payment methods, disputes, and country coverage; rebuilding that globally is slow and expensive. |
| 4 | Strategic moat vs commoditized plumbing | Unless payments infrastructure itself is the product moat, the startup should invest engineers in differentiated fintech capabilities instead. |
| 5 | Vendor dependence vs phased leverage | A hybrid approach reduces Stripe concentration risk without taking full PAN custody or full regulatory ownership. |

### Risks & Uncertainties
- The exact answer depends on card mix, AOV, debit vs credit, domestic vs international share, and dispute/fraud rate.
- It is unclear whether the $1.5M includes only Stripe Payments or also Billing/Tax/Connect-related charges.
- If the company is already becoming a payfac/MoR or already has deep payments/compliance leadership, the build case strengthens somewhat.
- Stripe enterprise pricing could reduce the baseline materially without any architectural change.
- International growth plans matter: the more countries and payment methods involved, the stronger the case for staying primarily on Stripe.

### Confidence: Medium
The directional recommendation is strong, but the exact break-even point depends on transaction mix, geography, and how much of today’s Stripe bill is truly replaceable rather than just shifted into other processing and compliance costs.
