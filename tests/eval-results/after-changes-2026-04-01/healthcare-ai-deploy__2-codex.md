---
topic: "A healthcare AI startup (Series B, 18 months runway) has a diagnostic model for detecting diabetic retinopathy from retinal images. The model achieves 87% accuracy, matching average radiologist performance. Should they pursue FDA clearance and deploy now with human-in-the-loop, or invest 12-18 months to reach 95% accuracy before seeking clearance?"
mode: "council"
agent_count: "2"
agent_config: "2-agent"
max_rounds: "5"
git_commit: "none"
agent_cli: "codex"
status: consensus
turn: B
round: 3
created: "2026-04-01T12:22:34.936Z"
last_updated: 2026-04-01T12:28:32.862Z
agent_A_name: "Advocate"
agent_A_cli: "codex"
agent_A_role: "advocate"
agent_B_name: "Skeptic"
agent_B_cli: "codex"
agent_B_role: "skeptic"
---

# Discussion: A healthcare AI startup (Series B, 18 months runway) has a diagnostic model for detecting diabetic retinopathy from retinal images. The model achieves 87% accuracy, matching average radiologist performance. Should they pursue FDA clearance and deploy now with human-in-the-loop, or invest 12-18 months to reach 95% accuracy before seeking clearance?

## Participants
- **Agent A** — Advocate (advocate) via codex
- **Agent B** — Skeptic (skeptic) via codex

## Key Questions
1. Is 87% accuracy sufficient given that it matches current standard of care (average radiologist)?
2. What does the FDA clearance pathway look like at 87% vs 95%, and does higher accuracy meaningfully change the regulatory burden?
3. What are the data and compute requirements to go from 87% to 95%, and is 12-18 months realistic?
4. Can the company survive 12-18 months of continued burn without revenue from deployment?

## Research Phase

### Agent A (Advocate) — Independent Research | research

They should pursue FDA clearance now, with a tightly scoped human-in-the-loop screening workflow, while continuing to improve the model in parallel. The upside case is strong: diabetic retinopathy is an access problem as much as an algorithm problem. In the U.S., CDC says 60% of people with diabetes do not get annual eye exams, more than 90% of diabetes-related vision loss can be avoided with early detection and treatment, and an estimated 9.6 million people were living with diabetic retinopathy in 2021, including 1.84 million with vision-threatening disease (CDC, 2024: https://www.cdc.gov/diabetes/hcp/clinical-guidance/promote-eye-health.html ; https://www.cdc.gov/vision-health-data/prevalence-estimates/dr-prevalence.html). If the startup can move screening into primary care or endocrinology now, it can catch patients who are currently missed, not just marginally outperform already-screened patients.

Regulatory precedent also argues for action, not delay. FDA already created the device category for retinal diagnostic software with IDx-DR in 2018, and multiple devices have since cleared or been authorized, including EyeArt and AEYE-DS (FDA: https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/denovo.cfm?id=DEN180001 ; https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K200667 ; https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K240058). The first FDA De Novo summary is especially important: IDx-DR’s prespecified regulatory thresholds were 85.0% sensitivity and 82.5% specificity, and it achieved 87.4% sensitivity and 89.5% specificity in the pivotal study (FDA DEN180001 summary: https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN180001.pdf). That means “95% accuracy” is not the obvious gating number. Accuracy is also the wrong headline metric for a screening product; FDA will care more about sensitivity, specificity, imageability, subgroup performance, and what happens to low-confidence or unreadable images. If their current 87% top-line accuracy can be translated into clinically acceptable operating points, they may already be in the clearance zone.

What could go right operationally is even more compelling. Point-of-care AI screening appears to increase real follow-through, not just model scores. In a 2024 randomized trial in youth, autonomous AI increased diabetic eye exam completion to 100% versus 22% for usual referral; among those needing follow-up, 64% completed it versus 22% in control (Nature Communications, 2024: https://www.nature.com/articles/s41467-023-44676-z). A 2025 meta-analysis covering 20,108 patients found AI-based initial assessment significantly increased follow-up uptake versus human grading (OR 1.89, 95% CI 1.78-2.01) (Eye, 2025: https://www.nature.com/articles/s41433-025-03849-4). In a Stanford adult screening program, 69.2% of AI-positive patients followed up within 90 days, and follow-up at the university eye institute was roughly triple the human workflows (35.5% vs 12.0% and 11.7%) (Clin Ophthalmol, 2023: https://pubmed.ncbi.nlm.nih.gov/38026608/). The value here is speed, convenience, and closing the referral gap.

Business upside matters too. Adoption is still tiny. A 2024 JAMA Ophthalmology analysis found only 0.09% of all patients with diabetes in TriNetX received CPT 92229 AI imaging, despite an established reimbursement code; that is whitespace, not saturation (https://jamanetwork.com/journals/jamaophthalmology/fullarticle/2825181). With only 18 months of runway, spending 12-18 months chasing an arbitrary 95% risks using the company’s entire option value before it gets regulatory, payer, workflow, and real-world evidence. One 2024 economic evaluation also found that the most accurate AI operating point was not the most cost-effective one; higher accuracy did not automatically maximize value (NPJ Digital Medicine, 2024: https://pubmed.ncbi.nlm.nih.gov/38383738/). Generalizability to the U.S. is uncertain, but the strategic lesson is clear: better product-market fit and clinical workflow can matter more than squeezing out the last few benchmark points.

The main uncertainty is whether the startup’s “87% accuracy” hides weak sensitivity, poor imageability, unsafe subgroup gaps, or brittle performance under real-world image quality. If so, they are not ready. But if the current model is already clinically respectable, the upside-maximizing move is not to wait for perfection. It is to file now, launch with human oversight, route unreadable or low-confidence cases to specialists, and use deployment to build the evidence moat that a lab-only 95% may never create.

### Agent B (Skeptic) — Independent Research | research

The skeptical view is that `87% accuracy` is not a decision-grade number for an FDA-bound screening product. In diabetic retinopathy screening, the dangerous errors are false negatives, ungradable images, and subgroup failures; overall accuracy can look acceptable while still missing too many referable cases. That is also how FDA-cleared comparators are evaluated: the FDA summaries for IDx-DR and AEYE-DS center on sensitivity, specificity, PPV/NPV, and analyzable fraction or imageability, not headline accuracy ([IDx-DR De Novo summary](https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN180001.pdf), [AEYE-DS 510(k) summary](https://www.accessdata.fda.gov/cdrh_docs/pdf24/K240058.pdf)). IDx-DR cleared with 87.4% sensitivity and 89.5% specificity, but even there the FDA summary notes a worst-case sensitivity of 80.7% when non-analyzable cases are treated conservatively. AEYE-DS later cleared at materially stronger levels: roughly 92%-93% sensitivity, 89%-94% specificity, and 99% imageability. So if this startup’s `87%` is only overall accuracy, it may be well below what regulators, customers, and competitors will expect.

“Human-in-the-loop” does not make the regulatory or clinical risk disappear. FDA’s CDS guidance is explicit that software which acquires, processes, or analyzes medical images is generally still a regulated device; image analysis does not become “non-device CDS” just because a clinician reviews the output ([FDA CDS guidance/FAQ](https://www.fda.gov/medical-devices/software-medical-device-samd/clinical-decision-support-software-frequently-asked-questions-faqs), [final guidance page](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software)). FDA’s transparency principles also stress that the relevant unit is the `human-AI team`, meaning you need evidence that the workflow actually improves care rather than just adding another fallible step ([FDA transparency principles](https://www.fda.gov/medical-devices/software-medical-device-samd/transparency-machine-learning-enabled-medical-devices-guiding-principles)). In practice, radiologists under time pressure may over-trust the model, under-trust it, or use it inconsistently. If the team performance is unproven, HITL is more of a comforting story than a validated mitigation.

The biggest downside scenario is not merely “the model is a bit worse than hoped.” It is: the company spends scarce runway on a pivotal study, gets a narrow clearance or fails clearance, then discovers real-world performance degrades on new cameras, low-quality images, different ethnic groups, or sites with different disease prevalence. Real-world DR AI performance is highly variable. A 2025 implementation study found candidate algorithms ranging from `60%-80% sensitivity` and `14%-96% specificity`, and reported that one FDA-approved algorithm was dropped because interim specificity was too low in that setting ([JMIR 2025 implementation study](https://medinform.jmir.org/2025/1/e67529/)). Another 2026 real-world study showed worst-case sensitivity collapsing to `48.5%` when ungradable/missing cases were handled pessimistically ([Scientific Reports 2026](https://www.nature.com/articles/s41598-026-37292-6)). Even when sensitivity is high, poor specificity can create operational damage: a real-world IDx commentary reported PPV of only `19%`, meaning most referrals were false positives, burdening ophthalmology clinics and patients ([Journal commentary](https://pmc.ncbi.nlm.nih.gov/articles/PMC8120063/)).

So the skeptical conclusion is: do not treat this as a simple choice between “deploy now at 87” and “wait until 95.” `95% accuracy` is also the wrong target if it does not translate into sensitivity, specificity, imageability, and subgroup robustness. With only 18 months of runway, the company cannot afford a weak clearance attempt that produces one safety scare or one embarrassing external-validation paper. If they move now, the least-bad path is tightly controlled evidence generation, not broad deployment: lock hardware/workflow, report sensitivity/specificity/imageability by subgroup, validate prospectively across sites, and prove the human-AI team is safe. Without that, the downside is patient harm, regulatory rejection, referral overload, and a damaged brand before the company reaches the next financing.

---

## Discussion

### Round 1 — Advocate | response | confidence: 74%

**Response to previous points:**
Agent B’s strongest argument is that `87% accuracy` is not a regulatory or clinical decision metric in this category. That is the right caution: if `87%` hides weak sensitivity, poor imageability, or subgroup failure, then “human-in-the-loop” is not a real safety answer, and a broad launch could burn runway and trust at the same time.

My synthesis is narrower than “deploy now” but still action-oriented: do **not** spend 12-18 months chasing a headline `95% accuracy` target before engaging FDA. Instead, pursue the clearance path **now** with a tightly scoped indication, locked workflow, fixed camera stack, and explicit triage for low-confidence/ungradable cases. Agent B is right that uncontrolled deployment is risky; I disagree that the implication is “wait.” The company’s real enemy is not just model error, it is time-to-evidence and time-to-revenue with only 18 months of runway.

**New evidence or angle:**
A new angle is **metric economics**: the jump from `87%` to `95%` may be the wrong optimization problem because later-stage gains are often limited by label disagreement, case-mix shifts, and image-quality variance, not just model architecture. In other words, they may spend most of their runway buying benchmark improvement that does not materially improve clearance odds or workflow value. A prospective, site-constrained study now may create more enterprise and financing value than another year of offline tuning.

**Current position:**
Pursue FDA engagement now and build toward a controlled HITL deployment, not a broad autonomous rollout. Confidence: 74% because Agent B’s evidence changed my view away from “deploy now if roughly radiologist-level” toward “file now, but only with a tightly bounded workflow and prospective evidence plan.” I am still against waiting for `95% accuracy` as the gating condition.

**Key question for the group:**
What are the model’s current `sensitivity`, `specificity`, `imageability`, and subgroup results on a prospective multi-site U.S.-like dataset, especially when ungradable images are counted conservatively?

### Round 1 — Skeptic | response | confidence: 78%

**Response to previous points:**
Agent A’s strongest point is that `95% accuracy` is a seductive but probably wrong target: if the real regulatory levers are `sensitivity`, `specificity`, `imageability`, and subgroup performance, then burning 12-18 months on one aggregate metric could kill the company without meaningfully improving clearance odds. I agree with that, and I’ve changed my mind on one piece: “wait for 95 before doing anything” is too blunt given only 18 months of runway.

Where I still disagree with Agent A is on the step after that. “Engage FDA now” is sound; “pursue clearance and deploy now” is still too aggressive unless the company already has prospective evidence on a locked workflow. A narrow HITL claim can reduce some risk, but it does not solve the core problem if current `87%` masks weak false-negative behavior, low analyzable fraction, or site-specific degradation. The most important open questions remain the ones Agent A ended with: current `sensitivity`, `specificity`, `imageability`, and subgroup results under conservative handling of ungradable images. Until those are known, the right synthesis is: start the regulatory process now, but do not assume that means filing immediately or launching commercially.

**New evidence or angle:**
New angle: an early clearance can create a product trap. If they file now with a tightly locked camera stack, thresholds, and workflow to make the study pass, they may clear a version that is too narrow to scale commercially. Then the “real” product improvements they need afterward can trigger expensive revalidation, new clinical work, and possibly another submission. So the tradeoff is not just `deploy now` versus `wait for 95`; it is `when do we freeze the product`, and freezing too early can be as damaging as waiting too long.

**Current position:**
Do not wait for `95% accuracy` as a gate. Do initiate FDA pre-sub, lock the intended use, and run a fast prospective multi-site study now. I am still against filing for clearance or broad deployment until the company can show clinically credible `sensitivity`, `specificity`, `imageability`, and subgroup robustness on the actual workflow it plans to sell. Confidence: 78% because Agent A is right that time-to-evidence matters more than offline benchmark chasing, but the downside of freezing and filing the wrong product is still substantial.

**Key question for the group:**
If ungradable images are counted conservatively and results are sliced by site, camera, and key demographic subgroups, what are the model’s current `sensitivity`, `specificity`, and analyzable fraction on the exact locked workflow they would submit to FDA?

### Round 2 — Advocate | response | confidence: 82%

**Response to previous points:**
Agent B’s strongest argument is the `product trap`: if they freeze too early around a narrow camera/workflow just to make a submission pass, they could clear a version that is too constrained to scale, then pay again to revalidate the product they actually want to sell. That is a real risk, and it changed my view further away from “file immediately.” I agree with Agent B that `87% accuracy` is not decision-grade; the open question both agents are converging on is still the key one: on the exact locked workflow, with ungradable images handled conservatively, what are `sensitivity`, `specificity`, `imageability`, and subgroup/site/camera results? Where I still disagree is on pace: those unknowns argue for a fast prospective study and FDA pre-sub now, not a 12-18 month campaign to reach `95%` on a headline metric.

**New evidence or angle:**
New angle: this is a `value-of-information` problem under runway pressure. Waiting 12-18 months for `95% accuracy` is an expensive, low-information bet because it delays the only evidence that really matters: real-world performance on the locked clinical workflow. A short prospective multi-site study creates more strategic value sooner. If the model is already good enough on the right metrics, they can file and finance off regulatory momentum; if it fails on imageability or subgroup robustness, they learn that while they still have runway to fix the actual bottleneck rather than optimizing the wrong benchmark.

**Current position:**
Start FDA pre-sub now and run an accelerated prospective validation immediately; do not wait for `95% accuracy` as a gate. I would file and launch only if that study shows credible `sensitivity`, `specificity`, `imageability`, and subgroup robustness on the intended workflow. Confidence: 82% because Agent B’s evidence made the original “deploy now” stance too aggressive, but it also strengthened the case against spending most of the runway on offline model improvement before getting decision-grade evidence.

**Key question for the group:**
Can the company complete a 3-6 month prospective, multi-site study on a locked camera/workflow that reports conservative `sensitivity`, `specificity`, `imageability`, and subgroup performance soon enough to support a real file/no-file decision before runway becomes the binding constraint?

### Round 2 — Skeptic | response | confidence: 84%

**Response to previous points:**
Agent A’s strongest argument is the `value-of-information` point: with only 18 months of runway, a 12-18 month push to `95% accuracy` is a slow bet on the wrong metric, while a fast prospective study on the locked workflow answers the only questions that matter for both FDA and the business. I agree, and my view has shifted further: the company should not wait for `95%` as a gate.

Where I still differ from Agent A is on how close that gets them to a filing decision. “Pre-sub now + accelerated prospective validation now” is the right move; “clearance path now” is only justified if the evidence package is built around the intended operating point, not the model’s average score. Agent A is right that time-to-evidence matters more than offline tuning. My added caution is that the evidence has to answer the full deployment question at once: `sensitivity`, `specificity`, `imageability`, conservative handling of ungradable images, subgroup/site/camera robustness, and whether the HITL workflow preserves those results in practice. Without that, they risk proving only that a narrow lab configuration works.

**New evidence or angle:**
New angle: the real decision variable is probably `coverage at a safe operating point`, not raw accuracy. If the model can abstain on low-confidence or low-quality images and still deliver clinically credible sensitivity/specificity on, say, 70%-85% of cases, that could support a viable HITL product now. If achieving safe performance requires abstaining on too many patients, then the product is not commercially or operationally ready even if the benchmark accuracy improves later. So the crucial curve is: as confidence threshold rises, what happens to sensitivity, specificity, and analyzable fraction?

**Current position:**
Do not spend 12-18 months chasing `95% accuracy` before engaging FDA. Start pre-sub now, lock the intended workflow enough to run a fast prospective multi-site study, and make the file/no-file decision from that evidence. I am still against filing or deploying broadly until they can show a viable safety-coverage tradeoff on the actual workflow they intend to sell. Confidence: 84% because Agent A’s runway argument is strong, but the gating risk has narrowed to one testable issue rather than disappeared.

**Key question for the group:**
At the intended confidence threshold and workflow, what percentage of patients can the model handle while still meeting clinically credible `sensitivity`, `specificity`, and conservative ungradable-case performance across sites, cameras, and key subgroups?

### Round 3 — Advocate | response | confidence: 86%

**Response to previous points:**
Agent B’s strongest argument is now the right crux: the real product is not “87% accuracy,” it is the `coverage at a safe operating point` on a locked workflow, including conservative treatment of ungradable images and robustness across sites, cameras, and subgroups. I agree. That changed my position materially from early “deploy now” toward “generate decision-grade evidence now.” Where I still push harder than Agent B is on timing: the evidence gap argues for an immediate pre-sub plus fast prospective study, not a 12-18 month optimization cycle toward `95%`. On the core open questions, both of us are effectively asking the same thing: what are `sensitivity`, `specificity`, `imageability`, and abstention-adjusted coverage on the exact workflow they would sell, and are those numbers good enough to justify filing before runway becomes the larger risk?

**New evidence or angle:**
New angle: this is also a `financing and partnership` strategy question, not just a model question. A startup with 18 months of runway is more likely to unlock capital, pilot sites, and payer conversations from a credible FDA pre-sub outcome plus a prospective multi-site readout than from another year of offline benchmark improvement. In other words, the fastest path to survival may be proving `regulatory-ready clinical workflow evidence`, not proving `best-in-class model accuracy`. That favors a staged plan with explicit gates: pre-sub now, prospective study now, file only if the readout clears prespecified safety and coverage thresholds.

**Current position:**
Do not wait for `95% accuracy` as the gating condition. Start FDA pre-sub immediately, lock the minimum viable commercial workflow, and run a 3-6 month prospective multi-site study with prespecified thresholds for `sensitivity`, `specificity`, `imageability`, subgroup robustness, and safe-case coverage. File only if that package is strong enough; if not, spend the remaining runway fixing the identified bottleneck rather than chasing a generic accuracy target. Confidence: 86% because Agent B’s risk framing changed my view on immediate filing, but the strategic case against a long delay is now stronger, not weaker.

**Key question for the group:**
What is the minimum `safe coverage` threshold, at the intended confidence cutoff and locked workflow, that would make the product both clinically credible and commercially viable enough to justify filing within the next 6 months?

**Convergence assessment:** CONVERGING — we are within ~80% agreement that they should not wait for `95% accuracy`, and should instead run pre-sub plus fast prospective validation now; the remaining gap is the filing bar, specifically what safety-and-coverage threshold is enough to justify filing rather than another iteration.

---

## Consensus Summary

### Decision
The council converged on a staged middle path: do not spend 12-18 months chasing a headline `95% accuracy` target before engaging FDA, but also do not pursue broad deployment now based only on `87% accuracy`. The company should start FDA pre-sub immediately, lock a minimum viable commercial workflow, and run a fast prospective multi-site study; they should file for clearance and launch a tightly scoped human-in-the-loop product only if that study shows strong `sensitivity`, `specificity`, `imageability`, subgroup robustness, and safe coverage at the intended operating point.

### Key Contention Points

| # | What Was Debated | Resolution | Who Had the Strongest Case & Why |
|---|-----------------|------------|----------------------------------|
| 1 | Whether `87% accuracy` matching average radiologist performance is enough to move forward | `87% accuracy` alone is not decision-grade for DR screening; the relevant bar is `sensitivity`, `specificity`, `imageability`, subgroup performance, and conservative handling of ungradable images on the actual workflow | Skeptic had the strongest case because they showed that FDA-cleared comparators are evaluated on clinically specific metrics, not headline accuracy |
| 2 | Whether the company should deploy now or wait to reach `95% accuracy` | Neither extreme won; the group rejected both immediate broad deployment and waiting for `95%` as a gating target | Advocate had the strongest case against waiting because the runway and value-of-information argument made a long offline optimization cycle look strategically inferior |
| 3 | Whether human-in-the-loop meaningfully reduces regulatory and safety risk | HITL helps only if the team workflow is prospectively validated; it is not a blanket exemption or sufficient mitigation by itself | Skeptic had the strongest case because they tied HITL limits to FDA CDS/device principles and real workflow failure modes |
| 4 | Whether engaging FDA now risks freezing the wrong product too early | The company should avoid over-freezing a narrow lab setup, but should still lock a minimum viable commercial workflow soon enough to generate decision-grade evidence | Skeptic had the strongest case because the “product trap” risk was concrete and changed the advocate’s earlier “file now” stance |
| 5 | What the best near-term strategy is under 18 months of runway | Immediate FDA pre-sub plus a 3-6 month prospective multi-site study is the preferred path because it generates financing, partnership, and regulatory signal faster than chasing benchmark gains | Advocate had the strongest case because they reframed the problem as time-to-evidence and survival, not just model optimization |

### Unresolved Items & Risks
- The current model’s actual `sensitivity`, `specificity`, `imageability`, and subgroup performance are still unknown from the discussion record.
- It remains unresolved whether safe performance is achievable at a commercially viable coverage rate once low-confidence and ungradable cases are abstained or routed out.
- A too-narrow locked workflow could win a study but produce a product that is hard to scale commercially.
- A weak prospective readout could consume runway without yielding clearance, financing leverage, or a usable product.
- Real-world degradation across sites, cameras, patient populations, and referral workflows remains a material risk even if internal validation looks acceptable.

### Confidence: High
Both agents converged by Round 3 on the same core recommendation: reject `95% accuracy` as the gate, generate prospective workflow-level evidence now, and make filing contingent on those results rather than on benchmark accuracy alone.
