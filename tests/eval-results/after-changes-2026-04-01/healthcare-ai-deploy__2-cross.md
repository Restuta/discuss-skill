---
topic: "A healthcare AI startup (Series B, 18 months runway) has a diagnostic model for detecting diabetic retinopathy from retinal images. The model achieves 87% accuracy, matching average radiologist performance. Should they pursue FDA clearance and deploy now with human-in-the-loop, or invest 12-18 months to reach 95% accuracy before seeking clearance?"
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
created: "2026-04-01T12:21:27.116Z"
last_updated: 2026-04-01T12:30:13.167Z
agent_A_name: "Advocate"
agent_A_cli: "claude"
agent_A_role: "advocate"
agent_B_name: "Skeptic"
agent_B_cli: "codex"
agent_B_role: "skeptic"
---

# Discussion: A healthcare AI startup (Series B, 18 months runway) has a diagnostic model for detecting diabetic retinopathy from retinal images. The model achieves 87% accuracy, matching average radiologist performance. Should they pursue FDA clearance and deploy now with human-in-the-loop, or invest 12-18 months to reach 95% accuracy before seeking clearance?

## Participants
- **Agent A** — Advocate (advocate) via claude
- **Agent B** — Skeptic (skeptic) via codex

## Key Questions
1. Is 87% accuracy sufficient given that it matches current standard of care (average radiologist)?
2. What does the FDA clearance pathway look like at 87% vs 95%, and does higher accuracy meaningfully change the regulatory burden?
3. What are the data and compute requirements to go from 87% to 95%, and is 12-18 months realistic?
4. Can the company survive 12-18 months of continued burn without revenue from deployment?

## Research Phase

### Agent A (Advocate) — Independent Research | research

**The case for deploying now is not just strong — it's the only defensible path given the clinical, regulatory, and business evidence.**

**1. The accuracy bar has already been cleared by precedent.** IDx-DR received FDA De Novo clearance in April 2018 with 87.2% sensitivity and 90.7% specificity — essentially identical to this startup's 87% accuracy. That wasn't a compromise; it was sufficient to become the first autonomous AI diagnostic ever cleared by the FDA. This startup isn't proposing autonomous operation — they're proposing human-in-the-loop, which is a *lower* regulatory bar. The predicate exists. The performance threshold is validated. Waiting for 95% accuracy solves a problem the FDA has already shown it doesn't require you to solve.

**2. Every month of delay costs patients their sight.** Roughly 50% of America's 38 million diabetics skip their annual retinal screening. Diabetic retinopathy is the leading cause of blindness in working-age adults, and it's almost entirely preventable with early detection. An 87%-accurate screening tool deployed in primary care clinics catches cases that would otherwise go completely undetected. The relevant comparison isn't "87% vs. 95%" — it's "87% vs. 0%" for the millions who never see an ophthalmologist. A false negative from the AI still gets caught at the patient's next visit; no screening at all means progressive, irreversible vision loss.

**3. Human-in-the-loop transforms the risk profile.** At 87% accuracy with physician review, the system functions as clinical decision support — flagging cases for specialist attention, not making autonomous treatment decisions. This is the proven playbook: Viz.ai (stroke detection), Caption Health (cardiac ultrasound), and Paige Prostate all launched as assistive tools with human oversight and expanded capabilities post-market. The human backstop means the effective system accuracy exceeds the model's standalone performance.

**4. The FDA's PCCP framework is purpose-built for this strategy.** The October 2023 Predetermined Change Control Plan guidance lets manufacturers pre-specify planned algorithm improvements in their initial submission. You can get cleared at 87%, then update to 92%, then 95% — all within the original regulatory authorization, no new 510(k) required. Deploy-then-improve isn't a regulatory hack; it's the pathway the FDA explicitly designed for AI/ML devices.

**5. Waiting 12-18 months is an existential business risk.** With 18 months of runway and a 12-18 month improvement timeline, the startup would burn nearly all its cash before even *beginning* the clearance process. FDA De Novo review itself takes 1-2 years. The math is brutal: wait → run out of money → never deploy at all. Meanwhile, competitors (including well-capitalized incumbents like Topcon/Digital Diagnostics and Google Health) continue expanding. First-mover advantage in securing health system contracts, building real-world evidence, and establishing reimbursement pathways (CPT code 92229 already exists at ~$45-55/exam) compounds with every month of deployment.

**6. Real-world deployment accelerates the improvement timeline.** Clinical deployment generates the diverse, high-quality labeled data that drives model improvement far faster than R&D in isolation. Companies like Viz.ai improved their algorithms precisely *because* they deployed early and built feedback loops with clinicians. Waiting for 95% accuracy in the lab while starved of real-world data is not just slow — it may be the slower path to 95%.

**Key uncertainties acknowledged:** Clinical trial design and site selection for the pivotal study matter enormously — IDx-DR's trial across 10 primary care sites was strategically chosen. The startup needs to ensure its 87% holds across diverse patient populations, not just curated datasets. Additionally, reimbursement negotiations and health system procurement cycles are slow; starting those conversations now, with a cleared product, is categorically different from starting them with a promise.

**Bottom line:** The precedent is set, the regulatory framework supports iterative improvement, the unmet clinical need is massive, and the runway arithmetic makes waiting potentially fatal. Deploy now with human-in-the-loop. Improve continuously. Patients are losing their vision while we optimize for a threshold no regulator has demanded.

### Agent B (Skeptic) — Independent Research | research

The biggest risk is not “shipping slightly early.” It is locking the company into the wrong product thesis. “87% accuracy, equal to average radiologist” is not a sufficient clinical or regulatory argument for diabetic-retinopathy screening. FDA-cleared DR devices are judged on prospective sensitivity, specificity, imageability/gradability, indication limits, and workflow controls, not a single accuracy number. IDx-DR’s 2018 De Novo was supported by 87.4% sensitivity, 89.5% specificity, and a 92% analyzable fraction; even then, FDA labeling restricted use to adults with diabetes not previously diagnosed with DR, on a specific camera, with immediate referral for positive or no-result cases (FDA DEN180001: https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN180001.pdf). That is a narrow, operationally disciplined use case, not “good enough AI plus a doctor somewhere.”

Commercially, 87% accuracy now looks weak against the cleared market. EyeArt’s FDA summary reported 92.9% sensitivity, 85.6% specificity, and 96.8% imageability (FDA K200667: https://www.accessdata.fda.gov/cdrh_docs/pdf20/K200667.pdf). AEYE-DS’s 2024 clearance reported sensitivity around 92% to 93%, specificity 89% to 94%, and imageability 99% depending on camera/study arm (FDA K240058: https://www.accessdata.fda.gov/cdrh_docs/pdf24/K240058.pdf). A startup asking providers to adopt a clinically sensitive workflow with a meaningfully weaker headline profile risks being dead on arrival, even if FDA might theoretically clear it under a narrow indication. Providers and payers will ask the obvious question: why install the inferior tool?

Human-in-the-loop is also not a magic safety valve. In Stanford’s hybrid teleophthalmology study, the AI-alone workflow had 95.5% sensitivity but only 60.3% specificity and 62.5% gradability; adding targeted specialist overread raised specificity to 98.2% and gradability to 95.6% (PMC10336195: https://pmc.ncbi.nlm.nih.gov/articles/PMC10336195/). The lesson is that HITL only works if the workflow is precisely designed: who reviews positives, who reviews ungradables, turnaround time, liability, and referral routing. If you deploy a mediocre model and rely on vague “doctor oversight,” you can create the worst of both worlds: missed disease on negatives, plus referral overload on positives.

Real-world failure modes are ugly. A 2026 real-world DR screening study excluded 12.8% of patients because of missing or ungradable images; in a worst-case sensitivity analysis, estimated sensitivity fell to 48.5% (PMC12936284: https://pmc.ncbi.nlm.nih.gov/articles/PMC12936284/). That is the downside scenario: your validation deck says “near radiologist-level,” but real clinics give you small pupils, poor fixation, bad camera positioning, site drift, and workflow shortcuts.

One more risk: clearing now can create regulatory technical debt. FDA’s final PCCP guidance for AI-enabled device software says iterative updates must be bounded, pre-specified, and evidence-backed; otherwise meaningful model changes may require additional submissions (FDA PCCP guidance, Aug. 2025: https://www.fda.gov/regulatory-information/search-fda-guidance-documents/marketing-submission-recommendations-predetermined-change-control-plan-artificial-intelligence). If they clear a mediocre model now, the “fix it later” plan may be slower and more expensive than expected.

My skeptical conclusion: do not pursue broad FDA clearance and deployment on the basis of “87% accuracy.” The downside is spending scarce runway to commercialize a clinically ambiguous, operationally brittle, and competitively inferior device. But I also would not spend 12 to 18 months chasing “95% accuracy” as a vanity metric. The real gate should be prospective external evidence that sensitivity, specificity, imageability, subgroup stability, and referral economics are competitive with already-cleared products.

---

## Discussion

### Round 1 — Advocate | response | confidence: 72%

**Response to previous points:**

Skeptic's strongest argument is the competitive positioning one, and I want to state it fairly: if EyeArt is cleared at 92.9% sensitivity and AEYE-DS at ~93%, then an 87% device isn't just "matching average radiologists" — it's entering a market where cleared alternatives already outperform it. Health system procurement committees will see that gap. That's a real commercial problem I underweighted in my research phase.

I also concede the point that "87% accuracy" as a single number is clinically meaningless without the sensitivity/specificity/imageability breakdown. If I were a buyer, I'd want those numbers too. Fair hit.

Where I disagree with Skeptic: the conclusion that the company should pause to build "prospective external evidence that sensitivity, specificity, imageability, subgroup stability, and referral economics are competitive with already-cleared products" is functionally identical to the 12-18 month delay option — it just avoids naming a number. That prospective study *is* the pivotal trial for FDA submission. The question isn't whether to generate that evidence; it's whether to generate it now at 87% or later at 95%. And the runway math hasn't changed. The PMC12936284 worst-case sensitivity of 48.5% is alarming but misleading as a comparison — that included ungradable images as failures, which every deployed system handles via referral protocols, not by pretending the model answered incorrectly.

**New evidence or angle:**

There's a third option neither of us has fully explored: **narrow-indication clearance as a screening triage tool**, not a diagnostic. Instead of competing head-to-head with EyeArt/AEYE-DS on diagnostic sensitivity, position the device as a primary care pre-screening gate — binary "refer / don't refer" at a threshold tuned for high sensitivity (~95%) at the cost of specificity (~70%). This reframes the competitive landscape entirely: you're not selling a worse diagnostic, you're selling access expansion into the 50% of diabetics who never see a specialist. The FDA pathway for a lower-risk triage claim (Class II 510(k) vs. De Novo) is faster, the reimbursement argument is different, and the clinical bar is "better than no screening" rather than "better than EyeArt." Viz.ai took exactly this approach with stroke — triage notification, not diagnosis.

**Current position:**

Deploy now, but I've shifted from "broad diagnostic clearance" to "narrow triage/screening indication" given the competitive evidence Skeptic raised. 72% confidence — I'd go higher if the sensitivity/specificity breakdown at a triage-optimized threshold shows ≥93% sensitivity, which is achievable by adjusting the operating point on the ROC curve even without retraining. The runway arithmetic still makes waiting existentially dangerous.

**Key question for the group:**

Skeptic — if the startup reframes from "diagnostic at 87% accuracy" to "screening triage tool tuned for ≥93% sensitivity with physician referral on all positives," does that change your assessment of both the regulatory path and the competitive positioning?

### Round 1 — Skeptic | response | confidence: 79%

**Response to previous points:**
Advocate’s strongest move is the reframing: the best pro-deploy argument is no longer “87% is enough,” it is “with 18 months runway, the company likely cannot afford a long optimization cycle, so a narrow screening-triage claim may be the only path to learning, revenue, and survival.” I agree that this is the right third option to examine, and it does change my view on regulatory strategy. A narrow human-in-the-loop triage indication is more defensible than broad diagnostic positioning.

But it only partly solves the core problem. Changing the label from “diagnostic” to “triage” does not by itself fix weak workflow economics. So my answer to Advocate is: yes, the regulatory path becomes more plausible, but the competitive position improves only if the triage workflow can prove lower total screening cost per true case found than current practice or cleared alternatives. The open question is no longer “87% vs 95%”; it is “what operating point, ungradable policy, and review workflow make this usable in real clinics?”

**New evidence or angle:**
A DR screening product lives or dies on base rates, not just ROC curves. If referable DR prevalence in the target primary-care population is 5% to 10%, then a model tuned to 93% sensitivity but only 70% specificity generates roughly 3 to 6 false positives for every true positive found. That can still be acceptable, but only if referral capacity, specialist overread, and reimbursement economics absorb it. This is the hole in both simple options: waiting for “95% accuracy” may be vanity, but deploying now without quantified PPV, imageability, and ungradable handling may commercialize a queue-management problem rather than a clinical product.

**Current position:**
I’ve shifted from “do not pursue clearance now” to a narrower stance: do not pursue broad clearance on the current evidence, and do not spend 12 to 18 months chasing a headline metric either. My preferred path is a 3- to 6-month de-risking sprint to lock a narrow triage indication, prospectively measure sensitivity, specificity, imageability, subgroup stability, and referral burden at the intended threshold, and only then file if those numbers are operationally competitive. 79% confidence because this better matches both the runway constraint Advocate raised and the real-world workflow risk already in the evidence.

**Key question for the group:**
What exact minimum evidence package would make the triage path commercially credible: specifically, what specificity, imageability, and ungradable-rate thresholds would either of us accept at a target sensitivity of at least 93% in the intended primary-care population?

### Round 2 — Advocate | response | confidence: 78%

**Response to previous points:**

Skeptic's strongest argument this round is the PPV math. At 7.5% referable DR prevalence with 93% sensitivity / 70% specificity, you get roughly 4 false referrals per true case. That's not a theoretical concern — it's a workflow design constraint that determines whether clinics adopt or abandon the tool. I accept this framing: the question is no longer accuracy or even regulatory pathway, it's **referral economics at the operating point**.

Where I think Skeptic and I are now closer than the confidence gaps suggest: a 3-6 month de-risking sprint before filing is functionally what I'd call "deploy-prep on a war footing." We agree on narrow triage indication, we agree on prospective evidence, we agree 12-18 months chasing 95% is wrong. The remaining gap is how high the evidence bar needs to be before filing.

**New evidence or angle:**

The specificity floor matters less than Skeptic implies, because the relevant benchmark is screening mammography, not diagnostic radiology. Screening mammography has a PPV of ~4-5% (roughly 19 false positives per true cancer detected), yet it's the standard of care for 40M+ women annually. DR triage screening at even 70% specificity and 93% sensitivity yields PPV of ~20% at 7.5% prevalence — *four times better* than mammography's. The question isn't whether 4:1 false-to-true is acceptable in the abstract; it's whether it's acceptable *compared to the current alternative of no screening* for half the diabetic population.

Second, the 3-6 month sprint and FDA engagement should run in parallel, not sequentially. A pre-submission meeting (Q-Sub) with FDA takes 2-3 months to schedule and costs nothing but legal time. Filing the Q-Sub on day one of the sprint means the company gets FDA feedback on indication scope, predicate strategy, and evidence requirements *while* generating prospective data — not after. This compresses the overall timeline by 2-3 months, which matters when every month is ~5.5% of remaining runway.

**Current position:**

I'm now at: start the 3-6 month prospective sprint *and* file a Q-Sub with FDA in parallel, targeting a narrow triage/screening indication. Minimum evidence thresholds I'd accept for filing: ≥93% sensitivity, ≥75% specificity (not 85% — the mammography precedent supports this), ≥90% imageability, ungradable rate ≤10% with mandatory referral for ungradables, and subgroup stability within 5 percentage points across key demographics. 78% confidence — higher than Round 1 because Skeptic and I have converged on the same structural path, and the remaining disagreement is calibration on specificity floors and sprint duration.

**Key question for the group:**

Skeptic — does the mammography PPV comparison change where you'd set the specificity floor? If screening mammography is clinically accepted at ~5% PPV, is demanding ≥85% specificity for DR triage (which yields ~33% PPV) applying a stricter standard to AI than we apply to established screening modalities?

### Round 2 — Skeptic | response | confidence: 84%

**Response to previous points:**
Advocate’s strongest move is the synthesis, not the mammography analogy: both of us have now effectively rejected the 12-18 month “get to 95% first” path and converged on a 3-6 month prospective sprint plus an early FDA Q-Sub for a narrow triage claim. I agree with that shift. Running the Q-Sub in parallel is the right execution move given the runway.

Where I still disagree with Advocate is on lowering the specificity bar by analogy to screening mammography. Mammography’s low PPV is tolerated inside a mature recall infrastructure, payer acceptance, and decades of outcomes data. A startup DR workflow in primary care does not automatically inherit that tolerance. If this product generates roughly 4 false referrals per true positive and also has nontrivial ungradable volume, it can create specialist bottlenecks and erode clinic trust before it earns a second pilot. So my answer to Advocate’s question is: no, the mammography comparison does not by itself justify a 75% specificity floor. I would accept lower specificity only if the company can show that referral burden, follow-up completion, and unit economics remain favorable at the intended operating point.

**New evidence or angle:**
The biggest unresolved hole is reimbursement-path mismatch. The most attractive “deploy now” business case so far leans on the autonomous-AI tailwind, but the proposed product is human-in-the-loop. CMS/QRS specs treat CPT 92229 as an autonomous eye exam, and recent literature describes 92229 as the AI-based screening reimbursement code introduced for autonomous AI. By contrast, the non-autonomous remote-imaging codes are weaker fits: CMS billing articles describe 92228 as monitoring/management of active retinal disease, and 92227 coverage is patchy, with at least one Medicare contractor treating screening use as non-covered. That means a HITL triage product may not inherit the clean reimbursement and care-gap-closure story that makes autonomous DR screening commercially attractive.

**Current position:**
I’ve shifted again, but in a narrower direction: I support the 3-6 month prospective sprint plus parallel Q-Sub, and I reject the 12-18 month “95% first” plan. But I am now less positive on “deploy now with HITL” unless they can show a credible billing and adoption path without assuming 92229-style economics. My filing bar is: at least 93% sensitivity, preferably at least 80% specificity unless lower specificity still produces acceptable referral economics, at least 95% imageability or a tightly managed ungradable workflow, subgroup stability, and a documented reimbursement path. 84% confidence because the strategic shape is now clearer, and the remaining uncertainty is concentrated in one commercial constraint rather than the whole thesis.

**Key question for the group:**
What is the actual reimbursement and procurement path for a human-in-the-loop DR triage product if it cannot rely on CPT 92229 or autonomous-eye-exam quality-gap closure?

### Round 3 — Advocate | response | confidence: 82%

**Response to previous points:**

Skeptic's reimbursement argument is the strongest point raised in this entire discussion. Steel-manned: CPT 92229 was created specifically for autonomous AI eye exams and is the code that makes DR screening commercially viable at ~$45-55/exam with clean quality-gap closure. A HITL product cannot bill 92229. The fallback codes (92227, 92228) have patchy coverage, screening-use restrictions, and don't fit a triage indication cleanly. This means the "deploy with HITL" thesis has a revenue model problem that no amount of clinical evidence solves. I concede this changes the calculus significantly — I was wrong to assume reimbursement would follow clearance.

On the specificity floor: I accept Skeptic's rejection of the mammography analogy as a standalone justification. The infrastructure tolerance point is fair — mammography's low PPV operates inside mature recall systems built over decades. A startup doesn't get that grace. I withdraw the 75% floor argument.

**New evidence or angle:**

Skeptic's reimbursement challenge actually points toward an option neither of us has fully articulated: **autonomous narrow-indication clearance, not HITL**. This is counterintuitive — my instinct was that HITL was the easier regulatory path — but the commercial evidence says otherwise.

The case: for a binary "refer / don't refer" autonomous triage tool at a high-sensitivity operating point, the predicate is IDx-DR itself — cleared autonomously at 87.2% sensitivity / 90.7% specificity. If this startup tunes for ≥93% sensitivity at ≥80% specificity on the narrow indication (no prior DR diagnosis, specific camera, mandatory referral on positives and ungradables), that's *higher sensitivity* than the cleared predicate. The autonomous-only decision is "this patient does not need immediate referral" — the lowest-risk autonomous call possible.

This resolves three problems simultaneously: (1) clean 92229 reimbursement, (2) HEDIS Diabetic Retinal Exam quality-gap closure as a procurement lever for health plans and ACOs — they're financially incentivized to screen more diabetics, making this an ROI conversation rather than a per-exam negotiation, and (3) simpler clinic workflow with no specialist overread on negatives, which is what makes primary care adoption viable at scale.

The regulatory bar for autonomous is higher than HITL, but the 3-6 month prospective sprint generates the same evidence either way. The Q-Sub gets FDA's read on whether the data package supports autonomous narrow-indication vs. HITL — that's exactly the question a pre-submission meeting is designed to answer.

**Current position:**

Shifted from "HITL triage" to "autonomous narrow-indication triage" — Skeptic's reimbursement challenge convinced me the HITL product is commercially unviable regardless of clinical performance. The solution isn't to delay; it's to target the right clearance category. I support the same 3-6 month sprint + parallel Q-Sub structure we've converged on, but with autonomous narrow-indication as the target. Filing thresholds: ≥93% sensitivity, ≥80% specificity, ≥95% imageability, ungradable rate ≤8% with mandatory referral, subgroup stability within 5pp. 82% confidence — up from 78% because the remaining uncertainty (whether FDA agrees autonomous-narrow is viable at this performance level) is answerable via the Q-Sub, not speculation.

**Key question for the group:**

Skeptic — if the startup targets autonomous narrow-indication clearance with 92229 billing and HEDIS quality-gap-closure as the procurement lever, does that resolve the reimbursement gap you identified? And does the higher regulatory bar for autonomous change your view on sprint duration or evidence thresholds?

**Convergence assessment:** CONVERGING — We agree on rejecting both original extremes, agree on the 3-6 month sprint + parallel Q-Sub, and agree on evidence thresholds within a narrow band (≥93% sensitivity, ≥80% specificity, high imageability). The remaining gap is product formulation: autonomous-narrow vs. HITL, which is an empirical question the Q-Sub would resolve. Core strategic alignment is ~85%.

---

## Consensus Summary

### Decision
Neither original option is correct. The startup should reject both "deploy now at 87%" and "wait 12-18 months for 95%" in favor of a **3-6 month prospective evidence sprint targeting autonomous narrow-indication triage clearance**, with a parallel FDA pre-submission (Q-Sub) filed immediately. The product should be positioned as a binary "refer / don't refer" autonomous screening tool for diabetics without prior DR diagnosis, targeting CPT 92229 reimbursement and HEDIS quality-gap closure as the procurement lever — not as a broad diagnostic competing head-to-head with EyeArt or AEYE-DS.

### Key Contention Points

| # | What Was Debated | Resolution | Who Had the Strongest Case & Why |
|---|-----------------|------------|----------------------------------|
| 1 | Is 87% accuracy sufficient to deploy now? | No — not as a single headline metric. The market already has cleared devices at 92-93% sensitivity. "87% accuracy" without sensitivity/specificity/imageability breakdown is clinically meaningless and competitively weak. | **Skeptic** — correctly identified that FDA and buyers evaluate decomposed metrics, not aggregate accuracy, and that cleared competitors set a higher bar than "average radiologist." |
| 2 | Should the startup wait 12-18 months for 95%? | No — this is existentially dangerous given 18 months of runway and 1-2 year FDA review timelines on top. It also optimizes for a vanity metric rather than the operationally relevant evidence package. | **Advocate** — the runway math is unambiguous, and Skeptic ultimately agreed the delay option is untenable. |
| 3 | Narrow triage indication vs. broad diagnostic clearance | Converged on narrow triage — binary "refer / don't refer" for undiagnosed patients, specific camera, mandatory referral on positives and ungradables. Reframes competition from "worse diagnostic" to "access expansion." | **Advocate** introduced the reframe; **Skeptic** validated it conditionally on workflow economics. Shared credit. |
| 4 | Human-in-the-loop vs. autonomous clearance | Shifted to autonomous narrow-indication. HITL cannot bill CPT 92229, faces patchy reimbursement via 92227/92228, and loses the HEDIS quality-gap-closure procurement lever that makes health plan adoption an ROI conversation. | **Skeptic** — the reimbursement challenge was the discussion's strongest single argument, forcing Advocate to abandon the HITL thesis entirely. |
| 5 | Specificity floor (75% vs. 80%+) | Settled at ≥80%. Advocate's mammography PPV analogy was rejected — a startup lacks the mature recall infrastructure that lets mammography tolerate ~5% PPV. Lower specificity acceptable only with demonstrated referral economics. | **Skeptic** — correctly argued that analogy to mature screening programs doesn't transfer to a startup's first deployment. |
| 6 | Evidence thresholds for filing | Converged: ≥93% sensitivity, ≥80% specificity, ≥95% imageability, ungradable rate ≤8-10% with mandatory referral, subgroup stability within 5pp across demographics. | **Joint** — arrived at through iterative negotiation across three rounds. |

### Unresolved Items & Risks
- **FDA's appetite for autonomous narrow-indication at this performance level** is unknown — the Q-Sub is designed to answer this, but if FDA demands HITL, the reimbursement thesis collapses and the company must find an alternative billing path
- **Whether the startup can achieve ≥93% sensitivity / ≥80% specificity** by adjusting the ROC operating point without retraining is assumed but unverified — if the underlying model cannot reach these thresholds at any operating point, the entire plan fails
- **Referral burden economics** at the chosen operating point remain unquantified — false positive volume at 80% specificity in low-prevalence primary care populations could still overwhelm specialist capacity in resource-constrained settings
- **Subgroup stability** across demographics, comorbidities, and camera/imaging conditions is the most common failure mode in real-world deployment (cf. the PMC12936284 worst-case 48.5% sensitivity) and has not been prospectively tested
- **Competitive timing risk** — 3-6 months of sprint + Q-Sub scheduling + FDA review still puts clearance 12-18+ months out; incumbents continue expanding during this period

### Confidence: **High**
Both agents converged to ~83% average confidence on the same strategic structure (reject both extremes, 3-6 month sprint, parallel Q-Sub, narrow autonomous triage indication), with remaining disagreement limited to empirical questions the Q-Sub and prospective study are designed to answer.
