---
topic: "A healthcare AI startup (Series B, 18 months runway) has a diagnostic model for detecting diabetic retinopathy from retinal images. The model achieves 87% accuracy, matching average radiologist performance. Should they pursue FDA clearance and deploy now with human-in-the-loop, or invest 12-18 months to reach 95% accuracy before seeking clearance?"
mode: "council"
agent_count: "5"
agent_config: "5-agent"
max_rounds: "5"
git_commit: "none"
agent_cli: "codex"
status: consensus
turn: C
round: 3
created: "2026-04-01T09:10:46.195Z"
last_updated: 2026-04-01T09:23:37.156Z
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

# Discussion: A healthcare AI startup (Series B, 18 months runway) has a diagnostic model for detecting diabetic retinopathy from retinal images. The model achieves 87% accuracy, matching average radiologist performance. Should they pursue FDA clearance and deploy now with human-in-the-loop, or invest 12-18 months to reach 95% accuracy before seeking clearance?

## Participants
- **Agent A** — Advocate (advocate) via codex
- **Agent B** — Skeptic (skeptic) via codex
- **Agent C** — Domain Expert (expert) via codex
- **Agent D** — User Advocate (user_advocate) via codex
- **Agent E** — Synthesizer (synthesizer) via codex

## Key Questions
1. Is 87% accuracy sufficient given that it matches current standard of care (average radiologist)?
2. What does the FDA clearance pathway look like at 87% vs 95%, and does higher accuracy meaningfully change the regulatory burden?
3. What are the data and compute requirements to go from 87% to 95%, and is 12-18 months realistic?
4. Can the company survive 12-18 months of continued burn without revenue from deployment?

## Research Phase

### Agent A (Advocate) — Independent Research | research

The upside case favors pursuing FDA clearance now and deploying with a tightly designed human-in-the-loop workflow, not waiting 12 to 18 months for a headline jump to 95% accuracy. The core reason is that diabetic retinopathy is a screening-access problem as much as a pure-model problem. In the U.S., only 66.0% of adults with diabetes had an eye exam in the past 12 months in 2023, meaning roughly one-third are still not getting recommended screening; HHS still rates progress as “little or no detectable change” ([Healthy People 2030](https://odphp.health.gov/healthypeople/objectives-and-data/browse-objectives/diabetes/increase-proportion-adults-diabetes-who-have-yearly-eye-exam-d-04)). CDC also continues to describe diabetic retinopathy as a leading cause of blindness in working-age adults ([CDC](https://www.cdc.gov/diabetes/diabetes-complications/diabetes-and-vision-loss.html)). If the startup can move screening into primary care or endocrinology clinics now, the product can create value by finding patients who otherwise would not be screened at all. An 87%-level system used in front of no exam is often better than a 95% system that arrives after another year of missed screening.

There is also evidence that “good enough plus workflow speed” can matter more than squeezing the last points out of offline metrics. FDA’s April 11, 2018 De Novo authorization for IDx-DR established a Class II device type for diabetic retinopathy detection (21 CFR 886.1100), and the pivotal study reported 87.4% sensitivity, 89.5% specificity, and 96.1% imageability, with novice operators trained in about four hours ([FDA De Novo DEN180001](https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN180001.pdf)). A second product, EyeArt v2.2.0, followed through 510(k) on June 16, 2023, which means the regulatory path is now more legible than it was for the first entrant ([FDA 510(k) K223357](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K223357)). That matters strategically: this company does not need to prove AI-for-DR is a valid category from scratch. It needs to prove its own device is safe, effective, and operationally reliable in intended use.

The strongest pro-deploy evidence is implementation value. In a 2023 Stanford-associated study, an AI-based DR workflow that returned results within 48 hours produced much better follow-up behavior than slower human or hybrid workflows: 69.2% of AI-positive patients followed up within 90 days, and in one in-person subset the AI workflow produced 35.5% follow-up versus about 12% for the human-based alternatives ([PubMed PMID 38026608](https://pubmed.ncbi.nlm.nih.gov/38026608/)). That is the real prize: not merely matching radiologists image-by-image, but compressing time-to-action and increasing referral completion. A human-in-the-loop launch amplifies that upside because the model can triage normals, flag positives, and route low-confidence or poor-quality images to humans, while the company accumulates prospective evidence and a proprietary real-world dataset.

The business case also leans toward now. With 18 months of runway, spending 12 to 18 months chasing 95% risks arriving at the fundraise with better science but no clearance, no site learnings, no reimbursement story, and no revenue signal. By contrast, a limited-release, HITL-cleared product could generate clinical evidence, commercial proof, and payer/provider traction while the model keeps improving. There is reimbursement precedent too: IDx-DR/LumineticsCore later obtained CPT code 92229, and CMS included it in the Medicare Physician Fee Schedule for 2021 ([Health Affairs Forefront/PMC review](https://pmc.ncbi.nlm.nih.gov/articles/PMC12900248/)). The key uncertainty is that “87% accuracy” is not enough by itself; FDA will care about sensitivity/specificity by intended claim, imageability, subgroup performance, human factors, and prospective validation. But if those underlying metrics are already credible, the upside-maximizing move is to seek clearance now with guardrails, not treat 95% as a magical threshold.

### Agent B (Skeptic) — Independent Research | research

The skeptical view is that `87% accuracy` is not a deployable evidence standard for a diabetic-retinopathy diagnostic device, even with human-in-the-loop. For FDA-cleared retinal diagnostic software, the burden is not a single headline metric; FDA’s special controls explicitly require clinically justified `sensitivity`, `specificity`, `PPV/NPV`, confidence intervals, testing under real conditions of use, variability across users and image-acquisition devices, training, and human-factors validation. FDA also names the core harms up front: `false negatives` can delay evaluation/treatment, `false positives` can trigger unnecessary follow-up, and poor image capture by operators is itself a regulated risk ([FDA De Novo summary for IDx-DR](https://www.accessdata.fda.gov/cdrh_docs/pdf18/DEN180001.pdf); [FDA PCCP guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/marketing-submission-recommendations-predetermined-change-control-plan-artificial-intelligence)). If the startup is anchoring on “matches average radiologist,” that is a warning sign: FDA will ask whether performance is safe, reproducible, and robust in the intended workflow, not whether it is roughly human-average on one dataset.

The competitive/regulatory benchmark is also higher than the prompt implies. In the pivotal prospective IDx-DR trial, the system reported `87.2% sensitivity`, `90.7% specificity`, and `96.1% imageability` in primary care ([Abramoff et al., npj Digital Medicine, 2018](https://www.nature.com/articles/s41746-018-0040-6)). EyeArt’s 2023 FDA-cleared update reported prospective sensitivity around `94% to 96%` with specificity roughly `86% to 91%`, depending on camera and endpoint ([FDA EyeArt K223357 summary](https://www.accessdata.fda.gov/cdrh_docs/pdf22/K223357.pdf)). So an internal “87% accuracy” claim may be materially below what the market already considers credible, or at minimum it is non-comparable to the metrics that matter. If they file now, the downside is burning capital on a submission and commercialization motion that yields either a narrow label, poor uptake, or outright failure. If they wait 12-18 months purely to hit “95% accuracy,” that is also dangerous: accuracy can improve while clinically important failure modes remain unresolved.

Real-world deployment risk is where optimism usually breaks. A 2025 adoption review found that these systems had been commercialized for 5 years, yet adoption was still limited; across adopters, average nonmydriatic `gradability` was only `49% to 75%`, with specificity as low as `60%` in some settings ([Teng et al., Ophthalmology Science, 2025](https://www.sciencedirect.com/science/article/pii/S2666914525002337)). A Stanford hybrid-workflow study is even more sobering: the AI arm had `95.5% sensitivity` but only `60.3% specificity` and `62.5% gradability`; specialists had far better specificity and gradability, and the “hybrid” only worked after specialist overread ([Dow et al., 2023](https://pubmed.ncbi.nlm.nih.gov/37449051/)). That means HITL is not a free safety blanket; it can simply move the burden back to scarce specialists and destroy the startup’s unit economics.

My downside-adjusted conclusion: `do not pursue broad clearance/deployment now on the basis of 87% accuracy.` But I also would not spend the full runway blindly chasing a prettier number. The real work is prospective multi-site validation, subgroup robustness, operator/device variability, gradability, referral burden, and workflow economics. If forced to choose between the two options in the prompt, delaying broad deployment is the less dangerous choice. The worst-case outcome is deploying now, missing disease in edge cases, overwhelming referral networks with false positives/ungradables, and discovering too late that “human-in-the-loop” did not actually contain either safety risk or cost.

### Agent C (Domain Expert) — Independent Research | research

From an execution standpoint, I would not anchor the go/no-go decision on “87% vs 95% accuracy.” FDA-cleared precedent in diabetic retinopathy shows the regulatory and operational bar is defined by clinically chosen endpoints, imageability, workflow safety, and prospective validation, not a single overall accuracy number. The first FDA-cleared autonomous system, IDx-DR (De Novo, April 11, 2018), succeeded with 87.4% sensitivity and 89.5% specificity for more-than-mild DR in a 10-site primary-care pivotal study; 92% of enrolled patients were analyzable, and operators were novices trained for four hours (FDA de novo summary: https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN180001.pdf; pivotal trial: https://www.nature.com/articles/s41746-018-0040-6). More recent systems improved sensitivity, but the precedent says “good enough on the right endpoint plus a safe workflow” can clear. EyeArt v2.2.0, cleared June 16, 2023, reported 94.4% sensitivity and 91.1% specificity on Topcon NW400 images, with 98.9% final imageability after dilation as needed, in a six-site prospective study using sites excluded from training (FDA summary: https://www.accessdata.fda.gov/cdrh_docs/pdf22/K223357.pdf). AEYE-DS cleared in 2024 with roughly 92% to 93% sensitivity, 89% to 94% specificity, and >99% success rate, including handheld-camera use (FDA entry: https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K240058).

What this means practically: if their current model can already hit acceptable sensitivity/NPV on the clinically relevant endpoint for referral-warranted disease, a clearance program now is feasible. But “deploy now with human-in-the-loop” does not avoid FDA oversight. FDA’s CDS policy is explicit that software that acquires/processes/analyzes medical images is a device even if a clinician reviews the result (FDA FAQ: https://www.fda.gov/medical-devices/software-medical-device-samd/clinical-decision-support-software-frequently-asked-questions-faqs). Human-in-the-loop changes workflow and possibly risk framing; it does not turn this into unregulated software. It also creates a different evidence burden: they would need to show the human-AI team performs safely in practice, not just the model in isolation. FDA’s 2024 transparency principles explicitly emphasize “performance of the human-AI team” and how the tool fits clinical workflow (https://www.fda.gov/medical-devices/software-medical-device-samd/transparency-machine-learning-enabled-medical-devices-guiding-principles).

The real build is larger than model training. They need: a locked model; narrow intended use; camera-specific validation; prospective multi-site study on unseen sites; reference-standard grading by a reading center; ungradable-image and dilation/referral protocol; cybersecurity and software V&V; quality system documentation; EMR/result integration; and post-market monitoring. FDA-cleared summaries show this clearly. IDx-DR’s de novo summary calls the software “major level of concern,” includes cybersecurity and hazard analysis requirements, and notes significant algorithm changes affecting false positives/negatives can trigger a new 510(k). In other words, clearing at 87% and then “updating to 95% later” may mean a second regulatory cycle, not a simple model refresh (https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN180001.pdf).

Real-world implementation lessons also argue for starting the regulatory/operational machine sooner, not spending the runway chasing a headline metric. A large health system review reported about 6 months from kickoff to first camera use because contracting, Epic integration, order/result build, and workflow planning dominated startup; operators needed about 40 exams to stabilize at roughly 6 minutes per exam; image quality problems and cataracts/small pupils drove nondiagnostic studies and false positives (implementation review: https://pmc.ncbi.nlm.nih.gov/articles/PMC10788651/). Stanford’s STATUS program found follow-up after a positive screen was about three times higher with AI workflow than prior human workflows, apparently because results returned faster (https://pmc.ncbi.nlm.nih.gov/articles/PMC10665027/). That is a deployment lesson: operational speed and referral completion matter as much as incremental model lift.

My bottom-line domain view: pursue clearance preparation now if 87% reflects acceptable sensitivity on referable/vision-threatening DR and they can define a conservative indication for use. Do not wait 12 to 18 months for “95% accuracy” unless they already know that gap is achievable, durable across sites/cameras/subgroups, and large enough to justify delaying both revenue and the regulatory clock. The biggest uncertainty is that we do not know their current sensitivity/specificity split, ungradable rate, subgroup performance, camera constraints, or quality-system readiness; those matter more than the headline accuracy number.

### Agent D (User Advocate) — Independent Research | research

From a user-advocate lens, the key question is not “does the model match average radiologists on a benchmark?” It is “will patients actually get screened, understand the result, trust it, and complete follow-up without the clinic workflow breaking?” Current evidence says convenience and immediacy matter more than abstract model parity. Diabetic retinopathy (DR) screening adherence remains poor: a 2025 meta-analysis reported global screening adherence of 66.9% in high-income countries and 39.3% in LMICs, and a human-centered implementation study in a US primary-care clinic noted that fewer than half of Americans with diabetes receive yearly eye screening; in that clinic, 56% of diabetic patients were overdue ([Rahmati et al., *Eye*, 2025](https://www.nature.com/articles/s41433-025-03849-4); [Scanzera et al., *Front Public Health*, 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10361413/)). That is the user problem to solve.

AI can improve the user journey when it delivers same-visit answers. The same 2025 meta-analysis found AI-based DR assessment significantly increased follow-up uptake versus human-grader workflows (OR 1.89, 95% CI 1.78-2.01), likely because instant results remove waiting and ambiguity ([Rahmati et al.](https://www.nature.com/articles/s41433-025-03849-4)). In a low-income US primary-care program, AI-assisted screening improved adherence to follow-up eye care from 18.7% historically to 55.4% at one year ([Liu et al., *Ophthalmology Retina*, 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8546907/)). A human-centered design study explicitly argued that the value comes from giving results in-office, educating the patient immediately, and scheduling the eye exam before checkout ([Scanzera et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC10361413/)). So users do not mainly need a prettier ROC curve; they need access, fast explanation, and frictionless next steps.

That said, I would not recommend broad FDA pursuit and deployment now if “87% accuracy” is the true headline metric. For screening products, overall accuracy is not the metric users feel. Patients care about missed disease; clinicians care about missed disease plus false-positive burden and “ungradable” exams. Existing FDA-authorized systems already set a user expectation around higher screening performance: recent meta-analyses reported pooled sensitivity/specificity around 95%/91% for IDx-DR/LumineticsCore and 95%/81% for EyeArt ([Khan et al., *Am J Ophthalmol*, 2025](https://pubmed.ncbi.nlm.nih.gov/39986640/); [Wang et al., *Am J Ophthalmol*, 2026](https://pubmed.ncbi.nlm.nih.gov/41052568/)). If this startup launches materially below that bar, buyers may not see enough user benefit versus existing options.

Real-world usage adds more friction than model cards suggest. In a 2026 real-world IDx-DR study, 10.5% of patients yielded no image and 26.1% were unanalyzable; age, pupil size, examiner skill, and visual acuity mattered ([Duvoisin et al., 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC12864748/)). In the Washington University study, 29.4% of screens were inconclusive, and human review found additional non-DR pathology in 17 patients ([Liu et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC8546907/)). For users, that means extra visits, anxiety, lost work time, and trust erosion if the tool often says “can’t tell.”

My recommendation: do not rush broad clearance/deployment on the basis of 87% accuracy. From the user side, I would rather see the company spend the next 12-18 months improving not just model performance but also gradability, same-visit workflow, patient education, and referral completion. If they deploy now, it should be only in tightly supervised pilots with explicit human review and hard tracking of user-centered outcomes. The main uncertainty is that “87% accuracy” is not directly comparable to screening sensitivity/specificity/NPV; if the model already has very high sensitivity and low ungradable rates in the intended population, my view could soften. But based on the current evidence, users will punish a mediocre first experience more than they will reward a merely adequate early launch.

---

## Discussion

### Round 1 — Advocate | response | confidence: 76%

**Response to previous points:**
The strongest argument is from **Agent B**, reinforced by **Agent D**: `87% accuracy` is not a clinical or regulatory decision metric here because users feel `false negatives`, `false positives`, and `ungradable` exams, not benchmark parity. If this model is mediocre on sensitivity/NPV for referral-warranted disease, or creates too much human overread burden, a fast launch destroys trust and economics. I agree with that.

That said, **Agent C** is right that the real choice is not “87 now vs 95 later.” FDA will care about intended use, sensitivity/specificity, imageability, camera/operator robustness, and the human-AI workflow. So I’m explicitly updating my stance: I do **not** support broad deployment now on the basis of the headline metric alone. I **do** support starting the FDA/Q-Sub and prospective validation process now, with a narrow claim and tightly controlled human-in-the-loop rollout, while improving the model in parallel.

On the open questions:
`87% accuracy` is not sufficient by itself. It could still be sufficient if the underlying sensitivity/NPV on the clinically relevant endpoint is already strong.
A higher headline number probably does **not** meaningfully reduce regulatory burden if workflow, subgroup, and imageability evidence are still weak.
A 12-18 month jump to `95%` looks uncertain because the likely bottleneck is not just compute; it is new prospective data, device/site variability, and workflow design.
With `18 months runway`, waiting to start both regulatory and commercial learning is the riskiest path.

**New evidence or angle:**
The third option is an **abstention-based product**, not an all-or-nothing launch. If the model only makes autonomous recommendations on high-confidence, gradable images from supported cameras, and automatically routes low-confidence/ungradable cases to human review, the relevant metric becomes safe performance at a defined coverage rate, not one global accuracy number. That is a product and regulatory design choice, not just an ML improvement project.

**Current position:**
Pursue FDA engagement and prospective HITL pilots now, but do **not** do broad deployment until the current model clears pre-specified thresholds for sensitivity, imageability, subgroup robustness, and human-review burden. Confidence `76%` because this preserves upside and runway while absorbing the strongest safety objections from **B** and **D**.

**Key question for the group:**
What are the model’s current **prospective** metrics on unseen clinics/cameras, after applying a conservative abstain threshold: sensitivity, specificity, NPV, and `% sent to human review/ungradable`?

### Round 1 — Skeptic | response | confidence: 82%

**Response to previous points:**
**Agent C** has the strongest frame: `87% vs 95% accuracy` is the wrong decision variable. FDA and buyers will care about `sensitivity`, `specificity`, `imageability`, camera/operator robustness, and the safety of the actual workflow. I agree, and that shifts me slightly away from a simple “wait 18 months.” **Agent A** is also right that burning most of the runway before even starting regulatory and workflow learning is dangerous. The best third option on the table is A’s abstention-based path: narrow claim, conservative thresholds, HITL, prospective validation now.

But I still disagree with any implication of “deploy now” unless they can already show a safe operating point on unseen sites/cameras. **Agent D** is right that users experience missed disease, inconclusives, and referral friction, not benchmark parity. So the key open questions are not model-only: what fraction becomes ungradable or low-confidence, what NPV looks like at real prevalence, and whether HITL actually contains risk without overwhelming human reviewers.

**New evidence or angle:**
The missing angle is commercial defensibility under HITL. If the model has to abstain or escalate too often to stay safe, the company may end up with the regulatory burden of a medical device plus the cost structure of tele-ophthalmology, without a strong margin or staffing advantage over existing cleared products. Abstention is only a real solution if coverage stays high enough and overread burden low enough to preserve unit economics.

**Current position:**
Do not pursue broad clearance/deployment on the basis of `87% accuracy`, and do not spend `12-18 months` chasing `95%` as a vanity metric. Start Q-Sub/protocol design now, but make the filing decision contingent on a pre-specified prospective package: high sensitivity/NPV on referable disease, acceptable imageability, subgroup stability, and a HITL review burden that still works financially. Confidence `82%` because this preserves optionality while guarding against the biggest failure mode: burning runway on a submission or launch that is neither clinically safe enough nor economically viable.

**Key question for the group:**
On a held-out prospective cohort from intended-use clinics and supported cameras, what operating point can the model achieve after abstention: `sensitivity`, `specificity`, `% ungradable/low-confidence`, and `% requiring human overread`?

### Round 1 — Domain Expert | response | confidence: 84%

**Response to previous points:**
The strongest argument is the combined case from **Agent B** and **Agent D**: `87% accuracy` is not a deployment metric in DR screening because the real failure modes are missed referable disease, excess false positives, and too many ungradable/low-confidence exams that break workflow. I agree. The FDA precedents already in the record point the same way: **IDx-DR** cleared on prospective sensitivity/specificity plus imageability in primary care, while **EyeArt** and **AEYE-DS** show the category now competes on stronger prospective operating points, not retrospective headline accuracy. **Agent A** is right that the prompt’s binary is false: the real third option is to start Q-Sub, design controls, and prospective HITL validation now rather than spend most of the runway chasing a nominal `95%`. **Agent B** is also right that abstention only helps if the resulting human-overread burden is still economically viable, and **Agent D** is right that same-visit results and referral completion are part of clinical value, not just commercialization. So the key open questions are still: on intended cameras and unseen clinics, what are `sensitivity`, `NPV`, `specificity`, `imageability`, subgroup performance, and `% routed to human review`?

**New evidence or angle:**
The likely bottleneck is no longer model training; it is protocol lock, reading-center ground truth, supported-camera constraints, software V&V, EMR integration, and site activation. That matters because “wait 12-18 months to hit `95%`, then start clearance” is probably the slowest path twice over. Once they lock a pivotal protocol, a materially changed model can force re-verification and potentially another regulatory cycle, so delayed filing does not buy a clean shortcut.

**Current position:**
Do not do broad deployment now, but do start FDA engagement and a narrow, camera-specific HITL clearance program now. I would make filing and scale-up contingent on pre-specified gates: strong sensitivity/NPV for referable disease, acceptable imageability, stable subgroup performance, and a human-review burden that still preserves unit economics. Confidence `84%` because this matches actual FDA and implementation precedent while respecting the 18-month runway.

**Key question for the group:**
On the supported cameras and intended-use clinics, what prospective operating point can they achieve after abstention: `sensitivity/NPV` for referable disease, `specificity`, and `% of exams sent to human review or deemed ungradable`?

### Round 1 — User Advocate | response | confidence: 81%

**Response to previous points:**
The strongest argument is **Agent C’s** reframing, backed by **Agent B** and **Agent A**: the real choice is not `87% now` versus `95% later`, it is whether the company can define a safe, narrow workflow now and learn fast enough before runway runs out. I agree, and I’m updating from my initial “do not rush” stance to a more specific one: do **not** do broad deployment now, but do start FDA engagement and tightly supervised HITL pilots now.

**Agent B** is right that users do not experience “accuracy”; they experience missed disease, unnecessary referrals, and inconclusive exams. **Agent A** is right that waiting 12-18 months without regulatory or workflow learning is also a user harm if it means the product never reaches clinics that need screening access. So the user-centered synthesis is: launch only where the workflow protects the patient from the model’s uncertainty. That means conservative abstention, explicit human review, supported cameras/operators only, and tracking whether patients actually get a clear next step.

The biggest open questions are still practical, not abstract: on unseen clinics/cameras, what are `sensitivity`, `NPV`, `% ungradable`, and `% escalated to human review` at a conservative threshold? If those are weak, users will lose trust quickly.

**New evidence or angle:**
One user risk has not been emphasized enough: **false reassurance from the negative result language**. Even a decent model can do harm if the patient hears “you’re fine” instead of “this screen did not find referral-warranted disease today; keep annual exams and seek care for symptoms.” For users, messaging and handoff are part of safety, not just UX polish. A mediocre model with disciplined result communication and immediate follow-up booking can be safer than a better model wrapped in overconfident messaging.

**Current position:**
Pursue FDA/Q-Sub work and narrow HITL pilots now, but do not pursue broad deployment on the basis of `87% accuracy` alone. I’ve shifted toward **A/C’s** third option because the company cannot afford to spend most of its runway learning nothing about real clinics, but **B’s** warning still stands: if abstention and overread rates are too high, this is not yet a user-ready product. Confidence `81%` because the synthesis fits both patient safety and startup survival, but key prospective metrics are still missing.

**Key question for the group:**
At a conservative operating threshold in intended-use clinics, what percentage of patients can leave the same visit with a **reliable result plus a concrete next step** (`screen negative with clear instructions`, `booked referral`, or `human review queued`) rather than an inconclusive outcome?

### Round 2 — Advocate | response | confidence: 83%

**Response to previous points:**
The strongest argument is the combined case from **Agent B** and **Agent D**, sharpened by **Agent C**: broad deployment on `87% accuracy` would be a category error because the real safety and business variables are `false negatives`, `ungradable/low-confidence exams`, and the human-overread burden on unseen clinics and supported cameras. I agree. I’ve changed my position further: this is no longer “clear now vs wait for 95,” it is “start de-risking now vs burn runway optimizing the wrong metric.”

**Agent C** is right that most remaining risk sits in prospective validation, camera/site constraints, workflow, and regulatory execution, not just model training. **Agent B** is right that abstention is only a real answer if coverage stays high enough that the economics still work. **Agent D** is right that the patient-level endpoint is whether the patient leaves with a trustworthy next step, not whether the model looks good on a benchmark. So the open questions really collapse into one package: after a conservative abstain threshold, what are `sensitivity/NPV` for referable disease, `specificity`, `imageability`, `% same-visit dispositions`, and `% human overread`?

**New evidence or angle:**
The missing decision variable is `coverage-adjusted value`. A model that is weaker on one global offline metric but can safely auto-resolve a meaningful share of high-confidence, gradable exams may create more clinical value and more enterprise value than a “95% accuracy” model that still fails on image quality, workflow, or review cost. So the company should optimize for a safe operating frontier, not a headline number. That argues for action now: run Q-Sub and prospective pilots immediately, learn the frontier, and narrow or kill the product fast if the coverage/overread tradeoff is bad.

**Current position:**
Pursue FDA engagement, protocol lock, and narrow HITL pilots now; do **not** do broad deployment yet. Confidence `83%` because **A/B/C/D** are now converging on the same third option, and the main remaining uncertainty is empirical rather than conceptual: whether the current model can reach a viable operating point after abstention without collapsing coverage or economics.

**Key question for the group:**
Across intended-use clinics and supported cameras, what is the best prospective operating point the model can achieve at three candidate abstention thresholds: `sensitivity/NPV` for referable disease, `specificity`, `% autonomous reads`, `% ungradable`, and `% sent to human overread`?

### Round 2 — Skeptic | response | confidence: 86%

**Response to previous points:**
The strongest argument is the convergence from **Agent C**, **Agent A**, and **Agent D**: the prompt’s binary is false. The real decision is not `87% now` versus `95% later`; it is whether the company should start FDA/prospective de-risking now while refusing broad deployment until it proves a safe and workable operating point. I agree, and that is a meaningful update from my earlier stance.

**Agent C** is right that the gating items are prospective performance, imageability, camera/site robustness, protocol lock, and workflow validation, not another round of retrospective model optimization. **Agent A** is right that waiting most of the runway to optimize a vanity metric is strategically dangerous. **Agent D** is right that patient safety is partly a workflow property: users need a reliable next step, not a benchmark score. My remaining skepticism is narrower but important: `human-in-the-loop` is not automatically a risk-control win. If the abstention threshold needed to make sensitivity/NPV safe drives too many cases into overread or inconclusive buckets, the product may be clinically acceptable on paper but commercially nonviable in practice.

So my answer to the open questions is: do not file or deploy broadly based on `87% accuracy`; do start Q-Sub/protocol design and tightly bounded pilots now; and make the go/no-go decision based on a joint clinical-and-economic operating point on unseen sites/cameras.

**New evidence or angle:**
One under-discussed risk is `reimbursement/ROI mismatch`. **Agent A** cited reimbursement precedent from autonomous DR screening, but a HITL product may not inherit the same economics if it requires substantial human overread, repeat imaging, or tele-ophthalmology staffing. In other words, the company could clear a device and still fail commercially because buyers compare it not to “no screening” but to existing cleared systems and outsourced reading workflows. The hidden cost is that a safe abstention policy can erase the margin advantage that justified the product in the first place.

**Current position:**
I now support the group’s third option: start FDA engagement and prospective, narrow HITL validation now, but do **not** pursue broad clearance/deployment yet and do **not** spend `12-18 months` chasing `95%` as the primary goal. Confidence `86%` because the group is converging, and the main unresolved issue is empirical: whether a conservative operating point can satisfy both safety and unit economics at the same time.

**Key question for the group:**
At the safest candidate operating point on intended-use clinics/cameras, what is the `per-1000-screen` outcome package: `missed referable cases`, `false-positive referrals`, `% ungradable/abstained`, `% needing human overread`, and resulting gross margin or cost per completed screening episode?

### Round 2 — Domain Expert | response | confidence: 89%

**Response to previous points:**
The strongest argument is **Agent B’s** refined version of the third option: `human-in-the-loop` is only a real safety control if it preserves a viable operating point, not if it simply turns the product into costly tele-ophthalmology with a device wrapper. I agree. **Agent A** sharpened the right optimization target as `coverage-adjusted value`, and **Agent D** correctly translated that into the patient-level outcome: can most patients leave with a reliable next step, rather than an inconclusive result or false reassurance? My synthesis is: broad deployment now is still premature, but delaying `12-18 months` to chase `95% accuracy` is also the wrong move.

The most important open questions are now concrete, not philosophical: on intended-use clinics and supported cameras, after abstention, what are `sensitivity` and `NPV` for referable DR, `specificity`, `% ungradable/low-confidence`, `% sent to human overread`, and the per-`1000-screen` economics? If those numbers are strong, a narrow filing path is feasible now. If they are weak, more model work is justified, but it should target those failure modes rather than a global accuracy number.

**New evidence or angle:**
One domain correction: `matching average radiologist` is not the right benchmark. Retinal DR screening is typically benchmarked against an adjudicated ophthalmology or reading-center reference standard, not radiologists. FDA-cleared DR devices were evaluated against specialist grading protocols and prospective site data, so if the company’s `87%` is anchored to “average radiologist,” that metric may be both clinically and regulatorily misaligned. In practical terms, they may be optimizing against the wrong comparator and wrong label source. That makes the `87% vs 95%` framing even less trustworthy.

**Current position:**
Start FDA/Q-Sub work, lock intended use, and run narrow prospective HITL validation now; do not do broad deployment yet; do not spend most of the runway chasing `95% accuracy` as the primary milestone. Confidence `89%` because the group is converging, and the biggest remaining uncertainty is not conceptual but measurement: whether the current model can hit a safe operating point against the correct clinical reference standard without excessive abstention or overread burden.

**Key question for the group:**
Against an adjudicated ophthalmology/reading-center ground truth on intended-use clinics and supported cameras, what operating point can the current model achieve after abstention for `sensitivity/NPV` on referable DR, and what `% of exams` must be escalated to human review to get there?

### Round 2 — User Advocate | response | confidence: 85%

**Response to previous points:**
The strongest argument is **Agent B’s** refined version of the third option, supported by **Agent C** and **Agent A**: `human-in-the-loop` only helps if it produces a safe patient outcome *and* a workable clinic workflow, not if it just hides a weak model behind expensive overread. I agree. **Agent C** is also right that `87% vs 95% accuracy` is the wrong frame if the comparator and ground truth are misaligned; users are affected by missed referable disease, inconclusive exams, and unclear next steps, not by a benchmark number. **Agent A’s** `coverage-adjusted value` framing is useful because it translates to a user question: how many patients leave the visit with a trustworthy disposition rather than ambiguity?

So I’m changing my mind a bit further: I no longer think the core decision is “deploy later when better.” It is “start learning now, but only in a workflow that protects the patient from uncertainty.” That means no broad deployment now, no `95%` vanity chase, and no filing decision until the team can show on intended-use clinics/cameras: high `sensitivity/NPV` for referable DR, acceptable `% ungradable/abstained`, manageable `% human overread`, and a high rate of patients leaving with a concrete next step.

**New evidence or angle:**
A user-side operational point not fully surfaced yet: the *first pilot sites matter as much as the model*. The same model will feel much safer to patients in clinics that can explain results clearly, handle repeat imaging, and book ophthalmology before checkout. If the company pilots first in sites without referral-closure capacity, users will experience the product as “AI said maybe, now good luck,” which is worse than delayed launch. So site selection should optimize for referral completion and patient handoff, not just screen volume.

**Current position:**
Start FDA/Q-Sub work and narrow HITL pilots now; do not pursue broad deployment yet; do not spend `12-18 months` chasing `95% accuracy` as the headline goal. Confidence `85%` because the group is converging, and the remaining uncertainty is now empirical and user-facing: whether a conservative operating point can still give most patients a reliable same-visit outcome without collapsing clinic workflow or economics.

**Key question for the group:**
At the proposed conservative operating point, what percentage of patients in pilot clinics can leave the visit with a **completed, trustworthy disposition** (`negative with clear follow-up instructions`, `referral booked`, or `human review turnaround committed`) rather than an inconclusive result or loose referral?

### Round 3 — Advocate | response | confidence: 88%

**Response to previous points:**
The strongest argument is **Agent B’s** latest refinement, strengthened by **Agent C** and translated well by **Agent D**: `human-in-the-loop` is not a magic safety label. It only works if, on unseen clinics and supported cameras, the model can hit a conservative operating point with high `sensitivity/NPV` for referable DR, acceptable `% ungradable/abstained`, and a human-overread burden that still preserves clinic workflow and margin. I agree, and I’ve visibly changed my mind from “clear/deploy now” to “start the regulatory and pilot machine now, but gate scale on prospective operating-point evidence.”

Where I still want to push the group is on action sequencing. **B** is right about the downside of fake safety. **C** is right that `87% vs 95% accuracy` is the wrong benchmark and may even be anchored to the wrong comparator. **D** is right that the patient-level endpoint is a trustworthy next step, not a model score. But all three points still argue for moving now on the parts that take calendar time anyway: Q-Sub, protocol lock, site selection, reading-center ground truth, workflow design, and pilot operations. The most important open questions are now tightly scoped: after abstention, what are `sensitivity/NPV`, `% autonomous reads`, `% ungradable`, `% human overread`, per-`1000-screen` referral burden, and `% patients leaving with a completed disposition`?

**New evidence or angle:**
The best third option is organizational, not just technical: split into a locked `v1` clearance/pilot track and a separate `v2` improvement track. That preserves speed without pretending the current model is ready for broad launch. It also avoids the common failure mode where the team spends 12 months improving the model while never generating the prospective evidence, workflow proof, or commercial signal needed to survive the next fundraise.

**Current position:**
Start FDA engagement and narrow HITL pilots now; do not do broad deployment yet; do not wait `12-18 months` chasing `95% accuracy` as the main milestone. Confidence `88%` because the group is largely aligned on the third option, and the remaining dispute is empirical: whether the current model can achieve a safe, economically viable operating point after abstention.

**Key question for the group:**
What is the company’s pre-specified `go/no-go` threshold for a narrow filing and pilot expansion on intended-use sites: the exact minimum `sensitivity/NPV`, maximum `% ungradable/overread`, and minimum `% completed patient dispositions` they must hit prospectively?

**Convergence assessment:** CONVERGING — positions are now within ~80% agreement around “start de-risking now, no broad deployment yet, don’t optimize to 95% as the headline goal.” Remaining gap: how strict the prospective operating-point and economics gates must be before filing or scaling.

### Round 3 — Skeptic | response | confidence: 89%

**Response to previous points:**
The strongest argument is **Agent A’s** latest synthesis, because it finally turns the false binary into an execution plan: run a locked `v1` clearance/pilot track now, keep `v2` model improvement separate, and stop treating `95% accuracy` as the milestone that decides everything. **Agent C** makes that stronger by pointing out that the current `87%` may be benchmarked against the wrong comparator entirely, so waiting to optimize that number could mean optimizing the wrong target. **Agent D** adds the right user test: does the patient leave with a trustworthy next step?

I agree with that direction, and I’ve changed my mind on one point: I no longer think “delay” is the default safe answer. The safer answer is `start de-risking now, but refuse broad deployment and refuse a filing decision without explicit gates`. My remaining pushback is against vagueness. If the company cannot name its prospective `go/no-go` thresholds now, it is not ready to spend runway on a submission. The open questions are therefore operational, not philosophical: on unseen intended-use sites and supported cameras, what operating point can `v1` hit after abstention, and does that produce acceptable per-`1000-screen` misses, false-positive referrals, overread load, and completed patient dispositions? If those numbers are weak, “HITL” is just a story masking nonviable economics.

**New evidence or angle:**
The missing angle is `fundraising optics`. A Series B company with 18 months runway does not just need clinical safety; it needs an investable narrative at the next financing event. A failed or weak filing hurts that narrative more than a disciplined pilot program with pre-specified gates. So the hidden cost is not only regulatory spend, but the possibility of teaching the market that the product is below the bar. That strengthens the case for starting Q-Sub/prospective work now while making the actual filing contingent on hard interim data, not calendar time.

**Current position:**
Start FDA engagement, protocol lock, and narrow HITL pilots now; do not do broad deployment yet; do not optimize around `95% accuracy` as the primary target. I’m ~89% confident because **A**, **C**, and **D** have shown that waiting for a vanity metric is the wrong strategy, but the skeptical constraint still holds: no filing or scale-up without explicit prospective thresholds on clinical performance, abstention/overread burden, and unit economics.

**Key question for the group:**
What exact interim `go/no-go` package would make us comfortable with a narrow filing: the minimum prospective `sensitivity/NPV` for referable DR, maximum `% ungradable + abstained`, maximum `% human overread`, and minimum `% patients leaving with a completed disposition`?

**Convergence assessment:** CONVERGING — the group is now largely aligned on “start de-risking now, no broad deployment yet, don’t chase 95% as the headline goal.” The remaining gap is not strategy but thresholds: how strong the prospective clinical and economic gates must be before filing or scaling.

---

## Consensus Summary

### Decision
Do not choose either original extreme. Start FDA/Q-Sub work, lock a narrow `v1` indication, and run prospective human-in-the-loop pilots now; do not broadly deploy yet, and do not spend 12-18 months chasing `95% accuracy` as the primary milestone. The company should file and scale only if the current model proves, on intended-use sites and supported cameras, that it can hit pre-set gates for referable-DR sensitivity/NPV, imageability/abstention, human-overread burden, and completed patient dispositions.

### Key Contention Points

| # | What Was Debated | Resolution | Who Had the Strongest Case & Why |
|---|-----------------|------------|----------------------------------|
| 1 | Whether `87% accuracy` is already enough because it matches average radiologist performance | Rejected. `Accuracy` vs radiologists is the wrong benchmark for DR screening; the relevant bar is prospective sensitivity/NPV, specificity, imageability, subgroup robustness, and reading-center ground truth. | **Agent C (Domain Expert)** had the strongest case because it tied the decision to actual FDA-cleared DR precedents and showed the current metric may be clinically and regulatorily misaligned. |
| 2 | Whether the company should deploy now versus wait 12-18 months for `95% accuracy` | Rejected as a false binary. The right move is to start regulatory and workflow de-risking now while separating a locked `v1` from ongoing `v2` model improvement. | **Agent A (Advocate)** had the strongest case because it reframed the decision around runway and calendar-time bottlenecks: prospective validation, protocol lock, site activation, and workflow learning take time regardless of model accuracy gains. |
| 3 | Whether human-in-the-loop makes immediate clearance/deployment safe enough | Only conditionally. HITL is acceptable only if abstention and overread rates stay low enough to preserve both safety and unit economics; otherwise it just becomes expensive tele-ophthalmology. | **Agent B (Skeptic)** had the strongest case because it forced explicit clinical-and-economic gates instead of letting `HITL` function as a vague safety story. |
| 4 | What outcome matters most to patients and pilot sites | The product should be judged by whether patients leave with a trustworthy next step: clear negative guidance, booked referral, or committed human-review turnaround. | **Agent D (User Advocate)** had the strongest case because it translated model and regulatory debates into user trust, follow-up completion, and first-visit experience. |

### Unresolved Items & Risks
- The current `87%` figure is not decision-grade until it is decomposed into prospective `sensitivity`, `NPV`, `specificity`, `% ungradable/abstained`, and `% requiring human overread` on intended-use clinics and supported cameras.
- The company must set explicit go/no-go thresholds before spending heavily on a filing; otherwise it risks a weak submission and damaging fundraising optics.
- Broad deployment remains too risky until pilot sites prove strong referral closure, clear patient messaging, and acceptable per-`1000-screen` miss and false-positive burden.
- If safe performance requires too much abstention or specialist review, the product may be clinically defensible but commercially unattractive.
- Filing a locked `v1` while improving `v2` creates execution complexity, but that trade-off is preferable to burning most of the runway optimizing the wrong headline metric.

### Confidence: High
The agents clearly converged by Round 3 on the same recommendation: start de-risking now, reject broad deployment for now, and do not optimize around `95% accuracy` as the main decision variable.

---
