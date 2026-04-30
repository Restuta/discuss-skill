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
created: "2026-04-01T08:52:49.324Z"
last_updated: 2026-04-01T09:01:42.770Z
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

They should pursue FDA clearance now and deploy with a tightly designed human-in-the-loop workflow, not spend most of their remaining runway chasing a nominal 95% target. The strongest reason is that FDA precedent does not support the idea that “95% accuracy” is a prerequisite for clearance in this category. On April 11, 2018, FDA granted De Novo classification to the autonomous diabetic retinopathy device IDx-DR; in its pivotal 10-site primary care study, the device achieved 87.4% sensitivity and 89.5% specificity, and the pre-specified regulatory thresholds were 85.0% sensitivity and 82.5% specificity ([FDA De Novo summary](https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN180001.pdf), [FDA De Novo record](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/denovo.cfm?ID=DEN180001)). That matters because FDA’s software-as-a-medical-device framework evaluates intended use, analytical validation, and clinical validation in the target population and “context of clinical care,” not a single abstract leaderboard metric ([FDA SaMD clinical evaluation guidance](https://www.fda.gov/files/medical%20devices/published/Software-as-a-Medical-Device-%28SAMD%29--Clinical-Evaluation---Guidance-for-Industry-and-Food-and-Drug-Administration-Staff.pdf)). A human-in-the-loop product with a narrower screening/referral claim is, if anything, easier to justify than the autonomous precedent.

The public-health upside of deploying now is substantial because the main failure in diabetic retinopathy is not only classifier quality; it is missed screening. CDC states that 60% of people with diabetes do not get annual eye exams, even though more than 90% of diabetes-related vision loss can be avoided with early detection and treatment ([CDC, May 15, 2024](https://www.cdc.gov/diabetes/hcp/clinical-guidance/promote-eye-health.html)). In that environment, a good-enough model embedded in primary care can create value immediately by converting “no exam happened” into “screening happened and referral happened.” Real-world studies support that. In an adult primary care study using automated retinal analysis with human supervision, adherence to follow-up ophthalmic care rose to 55.4% versus a historical 18.7% baseline ([Ophthalmology Retina, 2021](https://pubmed.ncbi.nlm.nih.gov/32562885/)). In the ACCESS randomized trial, point-of-care autonomous AI drove diabetic eye exam completion to 100% versus 22% in controls, with much higher follow-through after abnormal results ([Nature Communications, January 11, 2024](https://pubmed.ncbi.nlm.nih.gov/38212308/)). Even newer primary-care evidence suggests AI-assisted screening may improve downstream specialist presentation in underserved Black patients ([npj Digital Medicine, March 5, 2026](https://www.nature.com/articles/s41746-026-02460-5)).

The business upside is also better now than later. With 18 months of runway as of April 1, 2026, a 12-18 month “get to 95% first” plan pushes submission into roughly April-October 2027, before accounting for FDA review, implementation, contracting, reimbursement, and sales ramp. That is a bet-the-company timeline. By contrast, a filing now creates a chance to secure clearance, generate clinical/health-economic evidence, and start commercial learning while runway still exists. There is also market whitespace: CPT code 92229 has existed since January 2021, yet a 2024 JAMA Ophthalmology analysis found AI DR screening was still used in only 0.09% of all patients with diabetes in the studied US dataset, which implies underpenetration rather than a closed market ([JAMA Ophthalmology, 2024](https://jamanetwork.com/journals/jamaophthalmology/fullarticle/2825181)).

The key uncertainty is whether the startup’s “87% accuracy” is actually the right evidence. If it is retrospective, class-imbalanced, single-site, or unstable across camera types and patient subgroups, the pro-deploy case weakens fast. FDA and international regulators increasingly emphasize the performance of the human-AI team, workflow fit, transparent limitations, and lifecycle monitoring ([FDA transparency principles](https://www.fda.gov/medical-devices/software-medical-device-samd/transparency-machine-learning-enabled-medical-devices-guiding-principles)). So the upside scenario depends on converting the current model into a disciplined product: prospective multisite validation, sensitivity/specificity/NPV reporting instead of raw accuracy, explicit handling of ungradable images, mandatory human review/referral pathways, subgroup analysis, and post-market monitoring. If they can do that, “deploy now” is not reckless; it is the higher-upside move.

### Agent B (Skeptic) — Independent Research | research

The main skeptical objection is that “87% accuracy” is almost certainly the wrong decision metric. FDA-cleared DR systems were not cleared because they matched an average human reader; they were supported by prospective, multicenter studies against an ETDRS reading-center reference standard and reported sensitivity, specificity, PPV/NPV, and imageability. FDA’s de novo summary for IDx-DR (cleared April 11, 2018) reports 87.4% sensitivity, 89.5% specificity, 96% imageability, plus strict labeling limitations: adults with diabetes, no prior DR diagnosis, a specific camera, and mandatory referral/retest rules for no-result cases ([FDA decision summary](https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN180001.pdf), [De Novo record](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/denovo.cfm?ID=DEN180001)). That means 87% is not obviously “too low,” but only if it is the same kind of 87% on the same endpoint, in the same real-world workflow, with the same operational controls. If their 87% is a retrospective aggregate accuracy on curated images, it is not decision-grade evidence.

The failure mode in “deploy now with human-in-the-loop” is false reassurance. DR screening is asymmetric: missing referable disease is worse than over-referring. IDx-DR’s own FDA summary notes that insufficient-quality cases still had 26% prevalence of more-than-mild DR, and in a worst-case analysis sensitivity dropped to 80.7% ([FDA summary](https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN180001.pdf)). Human-in-the-loop does not erase that risk. FDA/Health Canada/MHRA’s June 13, 2024 transparency principles explicitly stress performance of the human-AI team, local acceptance testing, and disclosure of known biases/failure modes, not just model ROC curves ([FDA transparency principles](https://www.fda.gov/medical-devices/software-medical-device-samd/transparency-machine-learning-enabled-medical-devices-guiding-principles)). If clinicians anchor on the AI output, the “human” can become a liability transfer mechanism rather than a meaningful safeguard.

The failure mode in “wait 12-18 months for 95%” is different: metric chasing can kill the company without solving the real problem. The strongest autonomous benchmark I found, a prospective multicenter EyeArt study, reported 95.5% sensitivity and 85.0% specificity for more-than-mild DR, with imageability improving from 87.4% to 97.4% only after protocolized dilation ([JAMA Netw Open, 2021](https://pubmed.ncbi.nlm.nih.gov/34779843/)). But that was a carefully designed pivotal study, not simply a better offline model. A 2026 meta-analysis of 17 EyeArt studies found pooled sensitivity 95% but specificity only 81%, and explicitly flagged variability in specificity and inconsistent handling of ungradable images ([Am J Ophthalmol meta-analysis](https://pubmed.ncbi.nlm.nih.gov/41052568/)). A 2024 real-world study found perfect sensitivity for referable DR but only 0.59 specificity, concluding that false positives limited cost-effectiveness ([Acta Diabetol, 2024](https://pubmed.ncbi.nlm.nih.gov/38995312/)). So “95% accuracy” may still leave them commercially broken if it comes with referral overload, workflow rejection, or poor camera/operator robustness.

My skeptical bottom line: do not confuse headline accuracy with a fundable regulatory path. The downside scenario is spending the remaining runway on either premature deployment that creates patient-safety and liability events, or on a 12-18 month accuracy push that still fails on prospective generalization, subgroup performance, imageability, QMS/cybersecurity, and human factors. I would not support broad deployment now unless they already have prospective multicenter evidence close to FDA-cleared comparators. But I also would not endorse a blind 95% moonshot. The real gating question is whether they can, within runway, run a narrow FDA-oriented validation plan that proves patient-level sensitivity/specificity, imageability, subgroup robustness, operator workflow safety, and camera-specific performance. If not, the company may not be ready to be a regulated diagnostic company.

---

## Discussion

### Round 1 — Advocate | response | confidence: 78%

**Response to previous points:**
Skeptic’s strongest point is the right one to anchor on: “87% accuracy” by itself is not decision-grade evidence. If that number comes from retrospective, curated data rather than prospective multicenter validation with sensitivity, specificity, imageability, subgroup performance, and clear handling of ungradable images, then “deploy now” is too loose. I agree with that.

Where I disagree is the implied alternative of waiting for a headline 95% before moving. The FDA precedent already suggests the gating factor is not a magical accuracy threshold; it is whether the product is safe and effective for a narrow intended use in a controlled workflow. So the synthesis is: do not broadly deploy now, but do start the FDA path now with a constrained human-in-the-loop/triage claim, locked workflow, and a validation plan designed around the actual regulatory endpoint. Waiting 12-18 months to chase 95% offline accuracy looks like metric optimization disconnected from the real bottlenecks.

**New evidence or angle:**
The underappreciated issue is organizational risk, not just model risk. With 18 months of runway, a “wait until 95%” strategy creates a sequencing problem: they would still need QMS, human factors, cybersecurity, site activation, prospective validation, FDA review, and go-to-market ramp after the model work. That means the company is not really choosing between “deploy now” and “deploy later”; it is choosing between starting the regulated-product machine now or delaying the whole machine until runway is nearly exhausted.

**Current position:**
They should pursue FDA clearance now, but with a narrow, workflow-constrained product and evidence plan, while continuing model improvement in parallel. Confidence is 78% because the business timing strongly favors action, and the regulatory precedent weakens the case for a 95% wait, but my confidence depends heavily on whether their current 87% reflects prospective performance in the intended setting.

**Key question for the group:**
What exactly is the current “87%”: prospective or retrospective, against what reference standard, on which cameras/sites, and with what sensitivity, specificity, and imageability?

### Round 1 — Skeptic | response | confidence: 81%

**Response to previous points:**
Advocate’s strongest point is that `95% accuracy` is the wrong target to organize the company around. I agree. Agent A is right that FDA precedent does not imply a magical 95% threshold, and with 18 months of runway, delaying the regulated-product work by 12-18 months is close to a bet-the-company move. Where I still disagree is on acting as if “pursue clearance now” is already justified. If the current `87%` is still a retrospective aggregate metric rather than prospective, multisite, workflow-specific performance against the right reference standard, then they are not clearance-ready; they are still at the evidence-formation stage. So my synthesis is narrower than A’s: start the FDA-oriented program now, yes, but do not infer that broad deployment or even a credible submission is warranted until the current model proves out on sensitivity, specificity, imageability, camera robustness, and subgroup performance.

**New evidence or angle:**
The hidden failure mode is human factors, not just model quality. “Human-in-the-loop” is only a real safeguard if the human has explicit override rules, known failure modes, and mandatory escalation for ungradable or low-confidence cases. If the reviewer is a busy PCP or technician who defaults to the model output, HITL can preserve liability without preserving safety. So the key product question is not just “is 87% enough?” but “who is the human, what do they see, and what cases automatically trigger referral or retest?”

**Current position:**
I have moved slightly toward Agent A’s direction: they should not spend 12-18 months chasing a headline 95%. But I still would not support broad deploy-now language. The right move is a short, hard FDA-grade validation sprint now, with a narrow intended use and strict go/no-go criteria. Confidence: 81% because the business case against a long wait is strong, but the safety and regulatory case still turns on evidence we do not yet have.

**Key question for the group:**
Can they produce, within 90-120 days, prospective multisite results in the intended workflow showing sensitivity, specificity, imageability, and subgroup performance that are close enough to cleared comparators to justify submission?

### Round 2 — Advocate | response | confidence: 84%

**Response to previous points:**
Skeptic’s strongest argument is that `human-in-the-loop` is not a real safeguard unless the human role is operationally concrete: who reviews, what they see, what overrides are mandatory, and how ungradable or low-confidence cases are escalated. I agree, and that moves me further away from any broad “deploy now” framing. My earlier position should be tightened: start the FDA-grade program now, not broad commercial rollout now.

The synthesis between Skeptic’s caution and my action bias is the third option: reject the `95%` moonshot, but also reject casual deployment on a weak `87%` headline. The company should spend the next `90-120 days` on a narrow, pre-specified validation sprint for the intended workflow: prospective or prospective-like multisite data, reading-center reference standard, camera-specific performance, imageability, subgroup analysis, and explicit HITL escalation rules. If that clears comparator-like thresholds, file; if not, do not spend `12-18 months` pretending offline accuracy alone will solve it.

**New evidence or angle:**
The decision should be framed as an option-value problem, not a model-accuracy problem. A `90-120 day` FDA-oriented go/no-go sprint creates asymmetric upside: if results are strong, they unlock submission, fundraising, partnerships, and commercial credibility while runway still exists; if results are weak, management learns that before burning most of the remaining `18 months`. By contrast, a `12-18 month` push to `95%` delays both revenue and falsification, which is the worst sequencing for a runway-constrained medtech company.

**Current position:**
They should pursue clearance now in the sense of starting the regulated evidence program immediately, with a narrow claim and strict workflow controls, while continuing model improvement in parallel. They should not broadly deploy until near-term validation shows sensitivity, specificity, imageability, and human-factors performance close to cleared comparators. Confidence `84%` because Skeptic is right about the safety/regulatory gates, but I see no credible case for organizing the company around a delayed `95%` target.

**Key question for the group:**
Would we all support an immediate FDA-path decision if management commits now to a `90-120 day` go/no-go plan with predeclared thresholds for sensitivity, specificity, imageability, subgroup robustness, and HITL escalation behavior, rather than a vague `95%` objective?

### Round 2 — Skeptic | response | confidence: 86%

**Response to previous points:**
Advocate’s strongest argument is the option-value framing: with `18 months` of runway, a `12-18 month` push toward a vague `95%` target delays both learning and commercialization until the company is nearly out of time. I agree, and I have moved further in that direction. The best synthesis now is not `deploy now` versus `wait for 95%`; it is `start the FDA-grade program now, with a hard near-term go/no-go gate`.

Where I still want to tighten Agent A’s framing is on execution realism. A `90-120 day` validation sprint only helps if it is attached to actual submission-readiness work: locked intended use, fixed camera(s), reading-center reference standard, predeclared sensitivity/specificity/imageability thresholds, subgroup analysis, and explicit HITL escalation rules. Otherwise it becomes another way to burn runway on a nicer metric without de-risking the regulatory package. So I support starting now, but not broad deployment and not a loose “we’ll validate quickly” story.

**New evidence or angle:**
One missing angle is operating-point economics. In screening, the same model can look acceptable clinically but still fail operationally if prevalence, ungradable-image rate, and false-referral burden make clinics reject it. So the go/no-go criteria should include not just sensitivity/specificity, but also maximum `no-result` rate, referral rate per `1,000` screened patients, and who absorbs the follow-up workload. A model that clears a paper threshold but floods specialists or forces too many retests can still be commercially dead.

**Current position:**
I now support initiating the FDA path immediately, but only as a tightly scoped validation-and-readiness sprint, not as “deploy now” in any broad sense. Confidence `86%` because the case against a `95%` moonshot is now stronger than the case for it, but the remaining risk is execution: if they lack the regulatory and clinical-ops infrastructure, even the right strategy can still miss runway.

**Key question for the group:**
Do they already have the minimum submission infrastructure in place today, specifically `QMS/design controls`, target camera-locking, IRB/site access, reading-center adjudication, and named HITL escalation rules, so that a `90-120 day` go/no-go study is actually credible rather than aspirational?

### Round 3 — Advocate | response | confidence: 89%

**Response to previous points:**
Agent B’s strongest point is now the crux: if they do not already have `QMS/design controls`, fixed camera scope, reading-center adjudication, IRB/site access, and explicit HITL escalation rules, then a `90-120 day` study is not a strategy, it is a slogan. I agree. That has changed my position further from my initial `deploy now with HITL` instinct. The right synthesis is: start the FDA program now, but define “start” as submission-readiness work plus a hard-gated validation sprint, not broad deployment and not a `12-18 month` accuracy chase.

On the open questions, two matter most. First, what exactly is the current `87%` and how close is it to intended-use evidence rather than retrospective model evidence? Second, is the operational infrastructure already real enough to run a credible study this quarter? If either answer is “no,” the correct action is still not “wait for 95%”; it is to narrow the claim and workflow until the study becomes executable inside runway.

**New evidence or angle:**
A new angle is `selective prediction`, not raw model improvement. They may not need one model threshold over `100%` of cases. A safer product design is three-bucket: `auto-refer`, `auto-pass`, and `mandatory human review/retest` for low-confidence or ungradable cases. That matters because it converts the question from “is 87% enough everywhere?” to “can the system create a high-confidence subset with acceptable coverage, safety, and reviewer burden?” In other words, abstention policy may buy more real-world safety and regulatory viability than spending a year chasing a prettier aggregate metric.

**Current position:**
They should reject the `95%` moonshot and initiate the FDA path immediately, but only through a tightly scoped readiness-and-validation sprint with a narrow claim, explicit abstention/HITL rules, and predeclared go/no-go thresholds. I no longer support broad deployment before that. Confidence `89%` because both Agent B’s safety concerns and the runway math point to the same answer: act now on regulatory execution, not on leaderboard optimization. The remaining uncertainty is whether the company is operationally ready enough to make “start now” real.

**Key question for the group:**
Do they already have enough submission infrastructure today to launch, this quarter, a prospective study with a fixed camera/workflow and explicit abstention plus HITL rules?

**Convergence assessment:** [CONVERGING] — We now mostly agree on the core answer: do not wait `12-18 months` for `95%`, and do not broadly deploy on a loose `87%` headline. The remaining gap is execution readiness: whether “pursue clearance now” is immediately credible or still requires a short pre-study infrastructure build.

---

## Consensus Summary

### Decision
They should not spend 12-18 months chasing a headline `95%` accuracy target before engaging FDA, because that delays both learning and commercialization until runway is nearly exhausted. The consensus is to start the FDA path now, but as a tightly scoped submission-readiness and `90-120 day` validation sprint with a narrow intended use, fixed workflow/camera scope, explicit abstention plus human-review rules, and hard go/no-go thresholds; broad deployment should wait until that evidence is in hand.

### Key Contention Points

| # | What We Disagreed On | How It Was Resolved | Who Shifted & Why |
|---|---------------------|--------------------|--------------------|
| 1 | Whether `87%` performance justified deploying now with human-in-the-loop | Both agreed `87% accuracy` alone is not decision-grade; it must be translated into prospective, workflow-specific evidence with sensitivity, specificity, imageability, subgroup performance, and ungradable-case handling | Agent A shifted most, moving from `deploy now with HITL` to `start the FDA program now, but no broad deployment before near-term validation` after accepting that HITL is not a safeguard unless operationally concrete |
| 2 | Whether the company should wait `12-18 months` to reach `95%` before seeking clearance | Both concluded `95%` is the wrong organizing target; FDA precedent does not require it, and a long metric-chasing plan is too risky for an `18-month` runway | Agent B shifted toward A’s timing argument, accepting that a `95%` moonshot delays falsification and commercialization too long |
| 3 | What “pursue clearance now” actually means | Resolved by reframing it as an immediate FDA-grade readiness-and-validation sprint, not an immediate broad launch or guaranteed submission | Both converged: A narrowed “act now,” B broadened support for immediate action once tied to concrete validation, QMS/design controls, and human-factors execution |
| 4 | Whether model improvement or product/workflow design is the main bottleneck | Resolved in favor of workflow, evidence quality, and operating-point design over raw offline accuracy; abstention policies and escalation rules may matter more than squeezing out a prettier metric | Agent A emphasized option value and selective prediction; Agent B emphasized human factors and referral burden; both ended up prioritizing product/regulatory design over leaderboard gains |

### Unresolved Items & Risks
- The current `87%` metric is still undefined: retrospective vs prospective, reference standard, site mix, camera mix, and class balance remain unknown.
- The plan only works if the company already has enough infrastructure to execute quickly: `QMS/design controls`, IRB/site access, reading-center adjudication, locked intended use, and named HITL escalation rules.
- Human-in-the-loop can fail if reviewers anchor on the model output or if override/retest/referral rules are vague.
- Commercial viability depends not just on clinical performance but on `no-result` rate, false-referral burden, specialist capacity, and clinic workflow acceptance.
- Subgroup robustness, camera/operator variability, and ungradable-image handling could still block submission even if the top-line model metric improves.

### Confidence: High
Both agents converged on the same practical recommendation and the remaining uncertainty is mostly execution readiness, not strategic direction.
