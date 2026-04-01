---
topic: "A healthcare AI startup (Series B, 18 months runway) has a diagnostic model for detecting diabetic retinopathy from retinal images. The model achieves 87% accuracy, matching average radiologist performance. Should they pursue FDA clearance and deploy now with human-in-the-loop, or invest 12-18 months to reach 95% accuracy before seeking clearance?"
mode: "council"
agent_count: "3"
agent_config: "3-agent"
max_rounds: "5"
git_commit: "none"
agent_cli: "codex"
status: consensus
turn: B
round: 3
created: "2026-04-01T09:01:42.771Z"
last_updated: 2026-04-01T09:10:46.192Z
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

# Discussion: A healthcare AI startup (Series B, 18 months runway) has a diagnostic model for detecting diabetic retinopathy from retinal images. The model achieves 87% accuracy, matching average radiologist performance. Should they pursue FDA clearance and deploy now with human-in-the-loop, or invest 12-18 months to reach 95% accuracy before seeking clearance?

## Participants
- **Agent A** — Advocate (advocate) via codex
- **Agent B** — Skeptic (skeptic) via codex
- **Agent C** — Synthesizer (synthesizer) via codex

## Key Questions
1. Is 87% accuracy sufficient given that it matches current standard of care (average radiologist)?
2. What does the FDA clearance pathway look like at 87% vs 95%, and does higher accuracy meaningfully change the regulatory burden?
3. What are the data and compute requirements to go from 87% to 95%, and is 12-18 months realistic?
4. Can the company survive 12-18 months of continued burn without revenue from deployment?

## Research Phase

### Agent A (Advocate) — Independent Research | research

The strongest upside case is to pursue FDA clearance now and deploy in a tightly controlled human-in-the-loop workflow, rather than spend 12 to 18 months chasing a headline metric of 95% accuracy. The core reason is simple: diabetic retinopathy is a screening-access problem as much as a model-performance problem. In the U.S., the CDC estimates about 9.6 million people were living with diabetic retinopathy in 2021, including 1.84 million with vision-threatening disease, while Healthy People 2030 reports only 66.0% of adults with diabetes had a yearly eye exam in 2023 ([CDC VEHSS, 2024](https://www.cdc.gov/vision-health-data/prevalence-estimates/dr-prevalence.html); [Healthy People 2030](https://odphp.health.gov/healthypeople/objectives-and-data/browse-objectives/diabetes/increase-proportion-adults-diabetes-who-have-yearly-eye-exam-d-04)). The National Eye Institute is explicit that diabetic retinopathy may be asymptomatic early, and that early treatment can stop damage and prevent blindness ([NEI](https://www.nei.nih.gov/health/diabetic)). That means a good-enough model embedded in primary care can create value immediately by finding patients who are currently missed entirely.

The regulatory and market signal is also more favorable than “wait until perfect” thinking implies. FDA already established the device class for retinal diagnostic software in 2018 through IDx-DR’s De Novo clearance, and multiple follow-on products have since reached the market through 510(k), including EyeArt and AEYE-DS ([FDA De Novo DEN180001](https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN180001.pdf); [FDA K200667](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K200667); [FDA K240058](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K240058)). That matters strategically: this is no longer a speculative regulatory category. More importantly, FDA clearance-level performance has not required a universal 95% “accuracy” threshold. In IDx-DR’s pivotal study, the primary endpoints were sensitivity and specificity, not raw accuracy, and the device cleared with observed sensitivity of 87.4% and specificity of 89.5% for more-than-mild DR ([FDA De Novo Summary](https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN180001.pdf)). EyeArt later showed higher performance, but the lesson is that a startup may already be within striking distance if its operating point, intended use, imageability, and workflow controls are well designed ([JAMA Netw Open, 2021](https://pubmed.ncbi.nlm.nih.gov/34779843/)).

There is also real evidence that workflow speed creates clinical upside beyond model metrics. In Stanford’s STATUS program, an AI-based workflow for positive diabetic retinopathy screens produced 69.2% ophthalmology follow-up within 90 days, and follow-up at the university eye institute was roughly three times higher than human-only or hybrid workflows, likely because AI results were returned much faster ([Dow et al., 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10665027/)). That is exactly the kind of upside an advocate should emphasize: a model that is slightly less “perfect” on paper can still save more vision in practice if it shortens time-to-result, triggers same-visit counseling, and closes referral loops. Real-world health systems are already acting on this logic; Sutter Health reported scaling an AI diabetic retinopathy screening pilot from 6 sites to 28 primary care offices in 2025 ([AMA, 2025](https://www.ama-assn.org/practice-management/digital-health/sutter-health-s-use-ai-enabled-cameras-gets-eye-opening-results)).

The uncertainty is that “87% accuracy” is not enough by itself to decide. They need disease-prevalence context, sensitivity for vision-threatening cases, specificity, imageability, subgroup performance, camera dependence, and a clear protocol for ungradable images and clinician escalation. But that uncertainty is an argument for starting the regulatory process now, not for hiding in the lab. With only 18 months of runway, waiting 12 to 18 months risks consuming the company before it has prospective evidence, payer conversations, site references, or postmarket learning. The upside scenario is not “ship recklessly.” It is: narrow the claim, use mandatory human review for positives and no-results, run a prospective pivotal study, get cleared into a real workflow, and learn in market while competitors are still proving adoption. In this category, speed with guardrails is a feature, not a flaw.

### Agent B (Skeptic) — Independent Research | research

The main skeptical point is that “87% accuracy” is almost the wrong number for this decision. For diabetic retinopathy screening, regulators and buyers will care far more about sensitivity, specificity, imageability/technical failure rate, subgroup performance, and how the model behaves in the actual workflow than about headline accuracy. The best precedent, the FDA-authorized IDx-DR pivotal trial, succeeded with a locked model in a prospective primary-care study because it showed 87.2% sensitivity, 90.7% specificity, and 96.1% imageability against predefined thresholds, not because it advertised a generic accuracy number ([Abràmoff et al., 2018](https://www.nature.com/articles/s41746-018-0040-6)). If this startup only knows “87% accuracy,” the downside scenario is they enter FDA preparation and discover too late that one of the clinically relevant metrics is weak.

Real-world failure modes are not hypothetical. In a primary-care deployment study, an AI system correctly found the only 2 true disease cases but generated 15 false positives, for a positive predictive value of just 12%; many errors were caused by inadequate image quality and lens artifacts ([JAMA Network Open, 2018](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2703944)). That is the operational nightmare: ophthalmology referrals get flooded, PCPs lose trust, staff blame the camera or workflow, and payers conclude the tool adds cost without improving care. If the model underperforms on low-quality images, darker fundi, different cameras, or underrepresented populations, the reputational damage will be much larger than the raw metric suggests.

Human-in-the-loop is also not a magic safety valve. FDA’s 2024 transparency principles explicitly say the focus should be on the performance of the human-AI team, not the model alone, and they call for clear limitations, local validation, and ongoing monitoring ([FDA Transparency Principles, 2024](https://www.fda.gov/medical-devices/software-medical-device-samd/transparency-machine-learning-enabled-medical-devices-guiding-principles)). In practice, two bad outcomes are common. Either clinicians over-trust the system and automation bias turns false negatives into missed care, or they distrust it and re-read everything, destroying the productivity and reimbursement case. “Human oversight” can reduce liability on paper while preserving almost all the workflow cost.

Waiting for “95% accuracy” is not obviously safer. Recent health-economic modeling in DR screening found that the most accurate AI was not necessarily the most cost-effective; the trade-off depends on prevalence and on sensitivity versus specificity, with sensitivity often driving value more than overall accuracy ([npj Digital Medicine, 2024](https://www.nature.com/articles/s41746-024-01032-9)). So a 12–18 month sprint to 95% internal accuracy could burn most of an 18-month runway while optimizing the wrong target. They may still need prospective multicenter validation, human factors testing, quality-system maturity, and workflow evidence before clearance or commercial uptake.

The skeptical conclusion is: broad deployment now would be premature, but “wait until 95% accuracy” is also a risky fiction. The real risk is anchoring strategy on an oversimplified benchmark. The least bad path is to lock the current model and run a fast, prospective, multi-site evidence program on the intended cameras and users, measuring sensitivity, specificity, imageability, false negatives for vision-threatening disease, subgroup equity, and human-AI workflow performance. If those data approach the FDA-cleared precedent and the operational false-positive burden is acceptable, file. If not, they have learned the right failure mode before spending the company’s remaining runway on a clearance attempt or a benchmark chase.

---

## Discussion

### Round 1 — Advocate | response | confidence: 78%

**Response to previous points:**
Agent B’s strongest argument is that `87% accuracy` is not the decision variable; for FDA clearance and clinical adoption, sensitivity for referable disease, specificity, imageability, subgroup performance, and human-AI workflow behavior matter more. I agree. That does not weaken the case for acting now; it changes what “act now” means.

So my synthesis is: do not broad-commercially deploy on a vague `87% accuracy` claim, but also do not spend 12 to 18 months chasing `95%` as a headline metric. Agent B is right that this could optimize the wrong target. The action-oriented move is to start the regulatory path now with a narrow intended use, pre-sub/FDA engagement, and a prospective multi-site study using the current model in a controlled human-in-the-loop workflow. If the pivotal metrics land near the cleared precedents, file; if they do not, improve from evidence, not from offline benchmark guessing. With 18 months runway, a “wait in the lab” strategy is the riskier bet.

**New evidence or angle:**
A key timing angle is that the critical path is probably not model training alone. Quality system work, study design, site contracting, camera/workflow validation, human factors, and reimbursement/sales evidence all take time and do not disappear if the model improves from 87 to 95. That means the company can de-risk the real bottlenecks now while still improving the model in parallel until the lock point. In other words, “start now” does not mean “freeze forever”; it means stop treating algorithmic accuracy as the only workstream that matters.

**Current position:**
Pursue FDA clearance now, but through a constrained evidence-first path rather than immediate scaled deployment. Confidence `78%` because the runway makes delay expensive, FDA precedent suggests 95% is not a prerequisite, and real-world access gains can matter more than a better offline metric. My uncertainty is moderate because we still do not know the current model’s sensitivity for vision-threatening disease, ungradable-image rate, or subgroup performance.

**Key question for the group:**
What are the current model’s prospective sensitivity, specificity, and imageability for referable or vision-threatening diabetic retinopathy on the intended cameras and workflow, not just its retrospective `87% accuracy`?

### Round 1 — Skeptic | response | confidence: 84%

**Response to previous points:**
Agent A’s strongest argument is that the prompt’s binary choice is poorly framed: waiting for `95% accuracy` could burn most of the runway while optimizing the wrong metric, because FDA clearance and clinical adoption hinge on prospective sensitivity, specificity, imageability, subgroup performance, and workflow design, not a retrospective headline number. I agree with that, and I’m updating slightly toward A’s sequencing view. Where I still disagree is on the phrase “pursue FDA clearance now” if that means committing to broad deployment or a full pivotal path before validating the current model in the intended workflow. Matching “average radiologist performance” is not enough because standard of care is not a single accuracy number; it is a system with escalation, repeat imaging, and downstream specialist review. A human-in-the-loop wrapper also does not automatically fix the failure modes if false positives overload referrals or false negatives are concentrated in low-quality images or specific subgroups. So my synthesis is: do not wait 12-18 months for `95%`, but do not deploy broadly now either; run a fast gated evidence program that decides whether the current model is fileable or needs targeted improvement.

**New evidence or angle:**
The hidden risk is external validity. An `87% accuracy` result often comes from curated retrospective data, but FDA-grade performance lives or dies on the intended cameras, operators, clinics, and reference standard. If their benchmark used cleaner images, different prevalence, or weaker labels than an adjudicated prospective study, the apparent parity with radiologists may collapse at the exact point they operationalize and lock the model. That makes “go now” risky, but it also argues against a long offline optimization cycle: the fastest way to learn is a prospective, camera-specific, workflow-specific study.

**Current position:**
I favor a third option: start regulatory preparation now, but make the next 3-6 months a hard go/no-go gate based on prospective multi-site evidence with the current locked model, not a broad deployment and not a 12-18 month chase for `95%`. Confidence `84%` because both extreme options are anchored to the wrong variable, and the company’s real decision should turn on prospective clinical-operational performance before it spends the runway.

**Key question for the group:**
Has the current locked model been tested prospectively on the intended cameras and clinic workflow against an adjudicated reference standard, and if so what are its sensitivity, specificity, imageability, and subgroup false-negative rate for vision-threatening diabetic retinopathy?

### Round 2 — Advocate | response | confidence: 82%

**Response to previous points:**
Agent B’s strongest point is that the real risk is not `87%` versus `95%`; it is mistaking a retrospective headline metric for FDA-grade, workflow-grade evidence. I agree, and I’m updating my position explicitly: I no longer support “deploy now” if that means scaled commercial rollout before prospective validation. But I still disagree with the implied caution of waiting 12 to 18 months for `95%`. The action-oriented synthesis is: start the FDA path now, lock a candidate model, and run a short, hard-gated prospective study in the intended workflow. That preserves speed, runway, and learning. My pushback to the more cautious framing is that every month spent chasing offline accuracy without site, camera, and workflow evidence is false comfort. Agent B is right on the evidence standard; I’m arguing the consequence is faster real-world validation, not delay.

**New evidence or angle:**
A business angle we have not emphasized enough: with only 18 months of runway, the company is not choosing only between two model states; it is choosing between two financing narratives. “We improved offline accuracy from 87 to 95” is a weaker Series C / strategic-partner story than “we completed a prospective multi-site study, defined a safe operating envelope, and know whether this is fileable.” Regulatory-grade evidence is an asset even if the first study says “narrow the indication” or “fix imageability first.” A 12-18 month lab sprint risks ending with better benchmarks but no proof of deployability.

**Current position:**
Start regulatory preparation now and commit to a 3-6 month prospective go/no-go gate with the current best locked model; do not broadly deploy before that gate, and do not spend 12-18 months chasing `95%` as the primary plan. Confidence `82%` because this path best matches the runway constraint, preserves upside, and tests the variables that actually matter for clearance and adoption.

**Key question for the group:**
What exact prospective threshold package would make us say “file now” versus “improve first” for this product: sensitivity, specificity, imageability, and subgroup false-negative limits on the intended cameras and workflow?

### Round 2 — Skeptic | response | confidence: 86%

**Response to previous points:**
Agent A’s strongest contribution is the reframing: the company should stop treating `95% accuracy` as the strategy and instead buy real information quickly through a locked-model, workflow-specific prospective study. I agree, and I’m updating toward A on one important point: they should start FDA preparation now because quality systems, study design, site setup, camera validation, and human factors are long-pole work regardless of whether the model later improves. Where I still want harder guardrails is commitment risk. “Start the FDA path” can become escalation bias if the organization treats prep work as proof they should file. So my synthesis with Agent A is: begin regulatory prep now, but make the current model earn the right to a filing through pre-specified prospective thresholds. If imageability is weak, subgroup false negatives are concentrated, or referral burden is operationally unacceptable, they should stop and improve rather than rationalize a bad launch. I want Agent C, when synthesizing, to force explicit thresholds here rather than vague “near precedent” language.

**New evidence or angle:**
The under-discussed issue is statistical power in a low-prevalence screening setting. A short pilot can look acceptable on overall performance while having too few cases of referable or vision-threatening disease to estimate the metric that matters most: false negatives. The same base-rate problem can also make false positives operationally toxic even with decent-looking specificity, because PCP workflows and ophthalmology referrals get swamped. So a `3-6 month` gate is only meaningful if the study is powered for clinically important positives, run on the intended cameras and operators, and includes predefined limits for imageability and referral burden.

**Current position:**
I favor the third option more clearly now: start regulatory preparation immediately, run a prospective multi-site readiness study with the current locked model, improve in parallel, and do not broadly deploy or commit to filing until the study hits pre-specified clinical and operational thresholds. Confidence `86%` because this protects runway from both benchmark chasing and premature commercialization, while generating the only evidence that can actually settle the decision.

**Key question for the group:**
What exact go/no-go thresholds and sample size would make the next prospective study decision-quality, especially for sensitivity on vision-threatening disease, imageability, subgroup false-negative rates, and referral burden on the intended cameras and workflow?

### Round 3 — Advocate | response | confidence: 85%

**Response to previous points:**
Agent B’s strongest point is the escalation-bias warning: once FDA prep starts, teams can confuse motion with evidence, so the current model must earn a filing through a prospective study that is actually powered for the clinically dangerous errors, especially false negatives for vision-threatening disease in a low-prevalence screening setting. I agree, and that is the main way my view has shifted. Agent B is also right that `3-6 months` only matters if the study is decision-quality, not a feel-good pilot. Where I still push harder is on tempo and commitment: with 18 months of runway, the company should start regulatory prep immediately and make this study the commercialization gate, not another exploratory cycle. Agent C should now turn that into a hard decision rule, not a narrative.

**New evidence or angle:**
`95% accuracy` is an especially bad target here because overall accuracy in screening is prevalence- and threshold-sensitive. In a low-prevalence population, a model can raise headline accuracy without materially reducing false negatives for vision-threatening disease or without keeping referral burden manageable. So the choice is not `87` versus `95`; it is whether the current locked model can hit endpoint-based thresholds in the intended workflow.

**Current position:**
Start FDA preparation now, lock the best current model, and run a prospective multi-site readiness study before filing or scaled deployment. I would treat the model as fileable only if it lands roughly in cleared-device territory on the endpoints that matter: high-80s sensitivity for referable disease, about 90% specificity, mid-90s imageability, no major subgroup sensitivity drop, and referral burden partner clinics can absorb. If it misses, improve from those observed failure modes rather than spend 12-18 months chasing `95%` offline. Confidence `85%` because Agent B and I now agree on the critical unknowns, and the runway makes delay more dangerous than a gated evidence-first push.

**Key question for the group:**
What exact pre-registered go/no-go threshold package should Agent C recommend so the company cannot rationalize a premature filing: sensitivity, specificity, imageability, subgroup floor, and maximum acceptable referral burden?

**Convergence assessment:** CONVERGING — Agent B and I are now aligned on the strategic path: start regulatory prep now, reject a 12-18 month chase for `95%`, and gate filing/deployment on a prospective study. The remaining gap is the exact threshold package and study sizing that turns that shared direction into a decision.

---

## Consensus Summary

### Decision
They should start the FDA clearance path now, but not broadly deploy yet and not spend 12-18 months chasing `95% accuracy` as the main strategy. The right move is to lock the current best model, begin regulatory/quality-system work immediately, and run a prospective multi-site readiness study in the intended workflow with pre-registered go/no-go thresholds; file if those thresholds are met, otherwise improve targeted failure modes rather than optimize offline accuracy in the abstract.

### Key Contention Points

| # | What Was Debated | Resolution | Who Had the Strongest Case & Why |
|---|-----------------|------------|----------------------------------|
| 1 | Whether `87% accuracy` is already good enough because it matches average radiologist performance | `87% accuracy` alone is not decision-quality evidence; it is insufficient as the main basis for filing or deployment. | Agent B had the strongest case because they showed that FDA clearance and buyer acceptance depend on sensitivity, specificity, imageability, subgroup performance, and workflow behavior, not a headline accuracy number. |
| 2 | Whether to deploy now with human-in-the-loop | No broad deployment now; use a tightly controlled prospective study as the commercialization gate first. | Agent B had the strongest case because they explained that human-in-the-loop does not automatically solve false negatives, false positives, automation bias, or referral overload. |
| 3 | Whether to wait 12-18 months to reach `95% accuracy` before seeking clearance | Reject that plan; `95%` is the wrong target and likely a dangerous use of runway. | Agent A had the strongest case because they argued convincingly that runway is short, FDA precedent does not require `95%`, and the long poles are regulatory, workflow, and evidence generation rather than model training alone. |
| 4 | What the company should do immediately | Begin FDA preparation now and run a powered prospective multi-site study with pre-specified thresholds before filing. | Both agents converged here, but Agent A had the edge on sequencing because they connected regulatory prep, financing narrative, and time-to-learning into a concrete near-term plan. |

### Unresolved Items & Risks
- The current model’s prospective sensitivity, specificity, and imageability on the intended cameras and operators are still unknown.
- The study must be powered for referable or vision-threatening disease, not just overall accuracy, or the go/no-go decision will be weak.
- Predefined thresholds still need to be set for sensitivity, specificity, imageability, subgroup floors, and maximum acceptable referral burden.
- If subgroup false negatives or image-quality failures are concentrated in certain populations or clinics, the product could be non-viable without targeted remediation.
- Starting FDA prep creates escalation risk; leadership must treat the study as a real stop/go gate, not as a justification to file regardless of results.
- This path sacrifices the simplicity of “ship now” and the comfort of “wait for a better benchmark” in exchange for faster, decision-grade evidence.

### Confidence: Medium
Confidence is medium because the agents clearly converged on strategy, but the decisive clinical-operational metrics for the current model were not provided.

---
