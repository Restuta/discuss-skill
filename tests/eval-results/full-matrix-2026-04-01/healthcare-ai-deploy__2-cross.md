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
created: "2026-04-01T09:23:37.158Z"
last_updated: 2026-04-01T09:32:12.926Z
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

**Deploy now with human-in-the-loop. The evidence overwhelmingly favors it.**

**The accuracy bar has already been cleared by precedent.** IDx-DR — the first FDA-authorized autonomous AI diagnostic in any field — received De Novo clearance in April 2018 with 87.2% sensitivity and 90.7% specificity for detecting more-than-mild diabetic retinopathy. That is functionally identical to this startup's 87% figure. And IDx-DR was cleared as *fully autonomous* — no human review required. A human-in-the-loop system at the same accuracy faces a materially lower regulatory bar. The FDA has already signaled that 87% is acceptable for this exact indication in its most demanding configuration.

**Human-in-the-loop changes the regulatory calculus entirely.** An AI system where a clinician retains decision-making authority (CADe or CADt classification) typically qualifies for 510(k) clearance rather than De Novo, cutting FDA review from 6-12 months to 3-6 months. Viz.ai used exactly this playbook — launching with a triage indication for stroke detection under a lighter regulatory pathway, then expanding claims over time. Caption Health (acquired by GE for ~$500M) did the same with AI-guided ultrasound. The human-in-the-loop-first strategy is now a proven regulatory accelerant in medical AI.

**The unmet clinical need is staggering and lives are at stake during any delay.** Roughly 37 million Americans have diabetes, and diabetic retinopathy affects ~1 in 3. Yet only 50-60% receive recommended annual eye exams — in underserved populations, as low as 30-40%. That means 15-20 million diabetic Americans go unscreened each year. DR is the leading cause of blindness in working-age adults, and it is *largely preventable with early detection*. An 87%-accurate screening tool with human oversight deployed in primary care settings *today* saves more sight than a 95%-accurate tool that doesn't exist for another 18 months. Every month of delay is a month where preventable blindness occurs.

**The runway math is existential.** With 18 months of funding, spending 12-18 months pursuing higher accuracy leaves zero-to-six months for regulatory submission, clearance, commercialization, and revenue generation. That is not a business plan — it is a wind-down schedule. Deploying now means revenue within 6-9 months (post-clearance), giving the company 9-12 months of commercial traction to demonstrate product-market fit before needing to raise again. Series C investors fund companies with FDA clearance, deployed customers, and real-world performance data — not companies with promising R&D and an empty bank account.

**Post-market improvement is the norm, not the exception.** The FDA's 2021 framework for Predetermined Change Control Plans (PCCPs) explicitly enables AI/ML devices to improve after clearance through a pre-specified algorithm update protocol. Real-world deployment generates the diverse, high-volume training data that lab development cannot replicate. The path to 95% accuracy runs *through* deployment, not around it. EyeArt by Eyenuk achieved 95.5% sensitivity — but only after years of iteration that included real-world clinical data.

**First-mover advantage in healthcare AI is durable.** Integration into clinical workflows, EHR systems, and payer reimbursement networks creates switching costs that protect early entrants. CMS reimbursement codes exist for autonomous DR screening (CPT 92229, established after IDx-DR's clearance). Being second-to-market with marginally better accuracy is categorically less valuable than being first-to-market with clinically validated, reimbursable, human-supervised screening.

**Key uncertainties acknowledged:** Predicate device selection for 510(k) requires careful strategy. Post-market surveillance obligations are real. Liability frameworks for AI-assisted diagnosis are still evolving. These are manageable execution risks, not reasons to delay.

**The bottom line:** The startup has a product that meets the FDA's own demonstrated accuracy threshold for this exact indication, a regulatory pathway that is faster with human oversight, a clinical need measured in millions of unscreened patients, and a financial runway that penalizes delay with corporate death. Deploy now, improve continuously, save sight sooner.

### Agent B (Skeptic) — Independent Research | research

The skeptical view is that “87% accuracy, matching average radiologists” is not enough evidence to justify FDA clearance and deployment. For this product class, **accuracy is the wrong headline metric**. FDA’s special controls for retinal diagnostic software explicitly require **sensitivity, specificity, PPV, NPV, performance under anticipated clinical use, and variability by user/device**; and because the software analyzes medical images, it is still a regulated device even if a clinician reviews the output ([FDA classification order](https://www.accessdata.fda.gov/cdrh_docs/pdf18/DEN180001.pdf), [FDA CDS FAQ](https://www.fda.gov/medical-devices/software-medical-device-samd/clinical-decision-support-software-frequently-asked-questions-faqs)). “Human-in-the-loop” does not make the regulatory or liability problem go away.

The stronger reason to be cautious is that **the competitive/regulatory bar is already higher than the prompt’s 87% figure**. In FDA’s De Novo summary for IDx-DR, the pivotal study reported **87.4% sensitivity and 89.5% specificity** for more-than-mild DR, with **95.7% NPV** and only a **92% analyzable fraction**; under FDA’s own worst-case assumption for non-analyzable participants, sensitivity falls to **80.7%** ([FDA De Novo summary](https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN180001.pdf)). EyeArt’s FDA-cleared study reported even stronger performance, with **mtmDR sensitivity 92.9%-96.6%**, specificity **85.2%-85.6%**, and imageability around **96.5%-96.8%** depending on cohort ([FDA 510(k) summary](https://www.accessdata.fda.gov/cdrh_docs/pdf20/K200667.pdf), [JAMA Network Open pivotal trial](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2786132)). A startup whose best claim is “87% accuracy” is likely **below current market expectations**, not merely “good enough.”

Operationally, the downside is ugly. In screening, disease prevalence is low, so even good models generate a lot of false positives. In EyeArt’s enrichment-permitted primary-care cohort, PPV for mtmDR was only **54.4%**; for vision-threatening DR it was **31.9%** ([FDA 510(k) summary](https://www.accessdata.fda.gov/cdrh_docs/pdf20/K200667.pdf)). That means referral burden, provider annoyance, and payer skepticism. Image quality is another failure mode: FDA special controls require a training program and human-factors validation because **operator quality matters** ([classification order](https://www.accessdata.fda.gov/cdrh_docs/pdf18/DEN180001.pdf)). IDx’s pivotal trial used novice operators, but still required a standardized 4-hour training program, and “no result” cases had to be retested or referred ([De Novo summary](https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN180001.pdf)). Also, IDx labeling warns that the device is **not intended to detect other eye diseases**, so a reassuring AI output can create false reassurance about glaucoma, cataract, or other pathology.

The “human-in-the-loop will catch errors” argument is weaker than it sounds. In a randomized JAMA study, clinicians shown **systematically biased AI** became **11.3 percentage points less accurate**, and explanations did not materially rescue them ([JAMA 2023](https://pubmed.ncbi.nlm.nih.gov/38112814/)). That is not ophthalmology-specific, but it is directly relevant to overreliance risk.

Waiting 12-18 months is not risk-free either. With only 18 months of runway, a model-improvement sprint could consume the company before it even finishes the **prospective, workflow-realistic validation** FDA expects. And “95% accuracy” may be a vanity target: recent meta-analysis of regulator-approved DR systems found pooled performance around **0.93 sensitivity / 0.90 specificity**, but also substantial heterogeneity driven by **gradability, dilation, reference standard, and setting**, with explicit calls for post-market audits ([npj Digital Medicine 2025/2026](https://www.nature.com/articles/s41746-025-02223-8)). So the real risk is twofold: **deploy now and get hurt by misses, false reassurance, and inferior positioning against already-cleared tools; or burn the runway chasing a single metric that still does not translate into a pivotal-trial-ready product.** The least-defensible move is broad FDA/deploy-now on an “87% accuracy” headline without stronger prospective evidence.

---

## Discussion

### Round 1 — Advocate | response | confidence: 78%

**Response to previous points:**

Skeptic's strongest argument is the competitive positioning one, and I want to state it even more sharply than they did: if EyeArt is already cleared at 93-97% sensitivity and the startup enters at 87%, they're not just "good enough" — they're entering the market as the measurably inferior product. Payers comparing cleared alternatives have no reason to prefer this device. That's a real commercial problem, not just a regulatory one. I take this seriously.

However, Skeptic conflates two distinct questions: (1) whether FDA will clear the device, and (2) whether the device will win commercially. On question 1, the IDx-DR precedent at 87.2% sensitivity is dispositive — FDA cleared it as *fully autonomous* at this performance level. A human-in-the-loop system at equivalent accuracy faces a lower bar, full stop. Skeptic cites FDA special controls (sensitivity, specificity, NPV, etc.) as if they establish a *minimum threshold* — they don't. They establish *what must be reported*. The predicate exists.

On automation bias (the JAMA 2023 study): fair point, but that study tested *systematically biased* AI — designed to mislead. A calibrated model with known error characteristics used as a screening triage tool is a different risk profile than a model actively pushing clinicians toward wrong answers. The overreliance concern is real but mitigable through workflow design (e.g., AI flags cases for review rather than rendering a diagnosis).

**New evidence or angle:**

Neither of us has addressed the *deployment setting* question, which I think changes the calculus fundamentally. The value proposition isn't competing with EyeArt in ophthalmology clinics. It's deploying in **primary care and community health centers where no screening happens at all**. The counterfactual isn't "87% AI vs. 95% AI" — it's "87% AI with human review vs. zero screening." Among the ~40% of diabetic patients who skip annual eye exams, the relevant comparison is 87% sensitivity versus 0% sensitivity. In federally qualified health centers, where DR screening rates can be below 30%, even a modestly performing tool with ophthalmologist telemedicine review creates enormous clinical value. This also sidesteps Skeptic's competitive positioning concern — you're not competing with EyeArt for the same customer.

**Current position:**

Deploy now with human-in-the-loop, but narrowly scoped to underserved primary care settings where the alternative is no screening — not as a general-market competitor to EyeArt. ~78% confidence, reduced from my research phase because Skeptic is right that the competitive positioning against cleared 93%+ devices is weak. The narrow deployment thesis avoids that problem while generating real-world data, revenue, and regulatory precedent.

**Key question for the group:**

Skeptic — does the underserved-primary-care deployment frame change your risk assessment? Specifically: if the startup pursues 510(k) with a labeling indication scoped to *screening in settings without existing retinal imaging programs*, does that adequately address the competitive and clinical risk you've identified, or do you see failure modes specific to that setting that make 87% insufficient?

### Round 1 — Skeptic | response | confidence: 81%

**Response to previous points:**
Agent A’s strongest point is the counterfactual: in underserved primary care, the alternative is often no screening, not a better AI system. That materially weakens my earlier “inferior to EyeArt” objection. I also agree with A that 18 months runway makes a full 12-18 month accuracy chase dangerous; I’ve changed my mind on one piece: I do **not** think “wait for 95%” is the default safe answer.

Where I still disagree is the leap from “better than no screening” to “pursue FDA clearance and deploy now.” In the exact settings A wants to target, the hidden failure modes get worse: lower image quality, novice operators, weaker follow-up, and more patients lost after a “negative” result. An 87% headline can mask unacceptable real-world performance if analyzable fraction drops or false negatives concentrate in hard-to-image populations. Human-in-the-loop helps, but it does not erase automation bias, workflow burden, or false reassurance. So my synthesis is: **don’t spend 12-18 months chasing a vanity 95%, but also don’t broad-launch off an 87% retrospective headline.** Narrow the indication, prove prospective workflow performance, then clear.

**New evidence or angle:**
The missing angle is **system performance, not model performance**. For screening products, the real question is not “accuracy on labeled images,” but “of 100 intended patients in primary care, how many get a gradable image, a correct recommendation, and completed follow-up?” Underserved settings are exactly where this funnel breaks. A slightly weaker model with high gradability and strong referral completion can outperform a “better” model on paper. Conversely, an 87% model can fail clinically if 10-15% of images are ungradable and referral leakage is high. That suggests the company’s next milestone should be a prospective site study optimizing imageability, operator training, and referral workflow, not an abstract push to 95%.

**Current position:**
I favor a third option: **6-9 months to get prospective, intended-use evidence and workflow hardening, then seek a narrowly scoped clearance/deployment**, rather than deploy now broadly or spend 12-18 months chasing 95%. ~81% because Advocate persuaded me that delay has real runway and access costs, but I still think “87% equals radiologists” is too weak a basis without prospective evidence from the actual primary-care environment.

**Key question for the group:**
What are the startup’s prospective results in its intended primary-care setting on the full care funnel: sensitivity, specificity, **gradable-image rate**, and follow-up completion for positive and “no result” cases?

### Round 2 — Advocate | response | confidence: 82%

**Response to previous points:**

Skeptic's strongest argument — and I want to be precise about why — is the system performance vs. model performance distinction. An 87% model that produces ungradable images 15% of the time in a community health center with a medical assistant operating a tabletop camera is not an 87% screening program. It's a ~74% screening program before referral leakage. That framing is correct and I was wrong to treat model accuracy as a sufficient proxy for clinical utility. The full-funnel question (gradable image → correct recommendation → completed referral) is the right one to ask.

Where I think Skeptic's proposal undersells itself: the 6-9 month prospective study **is** the regulatory submission strategy, not a precursor to it. These aren't sequential steps. A well-designed prospective study in 2-4 primary care sites serves simultaneously as (a) workflow validation, (b) the pivotal dataset for 510(k) submission, and (c) the evidence package for payer conversations. You file a Pre-Submission (Q-Sub) with FDA in month 1, run the prospective study in months 2-6, and submit the 510(k) in month 7 with FDA already familiar with your protocol. That's clearance by month 10-12, first revenue by month 13-14, inside the runway.

**I'm changing my position.** Skeptic's third option is better than my original "deploy now" framing, once you recognize that "prospective study" and "pursue FDA clearance" run in parallel, not in series. My Round 1 position implicitly assumed the startup could submit with retrospective data alone — that was overconfident given the competitive landscape of already-cleared devices with prospective evidence.

**New evidence or angle:**

The piece neither of us has named: **the prospective study itself is a commercial asset, not just a regulatory requirement.** Health systems and FQHCs evaluating DR screening solutions increasingly require site-specific validation before procurement. Running the prospective study *at* target customer sites (community health centers, VA clinics, Indian Health Service facilities) creates embedded relationships that convert to contracts post-clearance. Caption Health and Viz.ai both used clinical study sites as their first paying customers. The 6-month "delay" generates pipeline, not just data.

**Current position:**

Pursue parallel-path strategy: file Q-Sub immediately, run a focused 4-6 month prospective study in 3-4 underserved primary care sites measuring the full screening funnel (gradability, sensitivity/specificity, referral completion), submit 510(k) with that data. ~82% confidence, increased from 78% because Skeptic's refinement actually makes the deploy case *stronger* by building it on prospective evidence while staying inside runway constraints.

**Key question for the group:**

Skeptic — given that we're converging on the prospective-study-as-pivotal-data approach, what's your view on minimum study design? Specifically: is 300-500 patients across 3-4 community health sites over 4-6 months sufficient for a credible 510(k) with a predicate, or do you see FDA requiring something larger given the existing cleared devices already have multi-site prospective data?

### Round 2 — Skeptic | response | confidence: 84%

**Response to previous points:**
Advocate’s strongest move is the reframing: the real choice is not “deploy now vs. wait for 95%,” but “use the next 6-9 months to generate prospective intended-use evidence that doubles as the FDA package.” I agree with that synthesis, and I’ve changed my mind on the core strategic question: they should pursue clearance now, but through a tightly scoped prospective study, not a retrospective-data submission and not a 12-18 month model-only push.

Where I still disagree with Advocate is on study sizing and timeline optimism. A `300-500` patient study across `3-4` sites sounds operationally attractive, but FDA credibility is driven by precision on the clinically important endpoints, not headline `N`. If more-than-mild DR prevalence in primary care is only around `10-20%`, that sample may yield too few positive cases to estimate sensitivity tightly, and too few ungradable cases to characterize the exact failure modes we both think matter most. So I would not anchor on total patients yet; I would anchor on event counts, confidence intervals, and a pre-specified rule for handling `no result` cases.

**New evidence or angle:**
The under-discussed risk is unit economics under human-in-the-loop. Narrow primary-care deployment only works if the review burden is cheap and fast enough to scale. If an `87%` model generates a meaningful mix of false positives and ungradable images, scarce ophthalmology capacity becomes the bottleneck, and the product turns into a referral amplifier rather than a scalable screening system. That means the pivotal study should measure not just diagnostic performance and referral completion, but also overread volume per `1,000` screens and median time-to-disposition.

**Current position:**
Pursue FDA now, but only via a Q-Sub plus prospective intended-use study designed around full-system performance and review burden. `~84%` because Advocate is right that waiting for `95%` is runway-suicidal, but I still think the plan fails if the company mistakes a small, underpowered study or a labor-heavy human-review workflow for a real regulatory and commercial bridge.

**Key question for the group:**
What sample-size and operating-point plan gives enough positive cases, ungradable cases, and review-burden data to defend a narrow primary-care `510(k)` claim without exhausting the runway?

### Round 3 — Advocate | response | confidence: 85%

**Response to previous points:**

Skeptic's strongest point in Round 2 is the event-count critique of my 300-500 patient suggestion. At 10-20% DR prevalence in primary care, 300 patients yields only 30-60 positive cases — too few to bound sensitivity with a tight confidence interval. A 510(k) reviewer comparing your CI to EyeArt's multi-thousand-patient pivotal will see the difference immediately. I was anchoring on "what fits the timeline" rather than "what satisfies the statistical question," and that's backwards. The study must be powered to the endpoint, then you check whether the timeline fits — not the reverse.

Skeptic's unit economics point is also well-taken but more solvable than it sounds. Asynchronous telemedicine overread is the standard model (Digital Diagnostics, EyeArt, RetinaVue all use it). A single fellowship-trained reader can review 40-60 fundus images per hour at ~$3-5 per read. At that rate, the human-in-the-loop isn't an ophthalmologist bottleneck — it's a $5 line item on a $40-60 reimbursable screening event (CPT 92229 reimburses ~$45). The prospective study should still measure overread volume and time-to-disposition as Skeptic recommends, but I'd bet this is a solvable cost problem, not a structural one.

**New evidence or angle:**

The piece we haven't addressed: **the startup can generate non-dilutive funding during the study period.** NIH SBIR/STTR Phase II grants for AI diagnostics in underserved settings routinely fund $1-2M over 2 years. HRSA's health center innovation awards and ARPA-H's Equitable Breakthroughs in Medicine program target exactly this use case — AI screening in FQHCs. A prospective study in community health centers is grant-ready by design. This doesn't replace venture runway, but it extends it by 6-12 months and signals mission alignment to future investors. The parallel path isn't just Q-Sub + study + 510(k) — it's Q-Sub + study + grant funding + 510(k), which substantially de-risks the runway concern that made "wait for 95%" untenable in the first place.

On study sizing: I'd propose ~800 patients across 4 sites over 5-6 months (~40 patients/site/month, which is realistic for high-volume FQHC diabetes panels). At 15% prevalence that yields ~120 positive cases — enough to estimate sensitivity with a 95% CI width of roughly ±8 percentage points, which is comparable to IDx-DR's pivotal. Pre-specify a "no result" protocol (re-image once, then refer) and report the intention-to-screen population, not just gradable images.

**Current position:**

Pursue the parallel-path strategy we've converged on: Q-Sub month 1, prospective study months 2-7 (~800 patients, 4 FQHC sites, full-funnel endpoints including gradability and overread burden), 510(k) submission month 8, with non-dilutive grant funding pursued concurrently to extend runway. ~85% confidence, up from 82%, because Skeptic's refinements have made this a more robust plan than my original "deploy now" position, and the grant-funding angle addresses the remaining runway fragility.

**Key question for the group:**

Skeptic — we've converged on strategy. The remaining operational risk I see is: what if the prospective data shows the system underperforms its retrospective 87% in real primary-care conditions (worse images, diverse populations, novice operators)? Should the startup pre-specify a go/no-go threshold before the study begins — say, lower bound of sensitivity CI above 80% — and if so, what's the right kill criterion?

**Convergence assessment:** CONVERGING — We agree on the parallel-path strategy (Q-Sub + prospective study + narrowly scoped 510(k)) and reject both "deploy now on retrospective data" and "wait 12-18 months for 95%." Remaining gap is implementation detail: study powering, go/no-go thresholds, and whether the review-burden economics hold in practice. These are execution questions, not strategic disagreements.

---

## Consensus Summary

### Decision
The startup should pursue FDA clearance now via a parallel-path strategy: file a Pre-Submission (Q-Sub) immediately, run a 5-7 month prospective study across ~4 FQHC sites (~800 patients), and submit a narrowly scoped 510(k) for human-in-the-loop DR screening in underserved primary care settings where the alternative is no screening. Both "deploy immediately on retrospective data alone" and "wait 12-18 months to reach 95% accuracy" were rejected as inferior to this middle path. Non-dilutive grant funding (NIH SBIR/STTR, HRSA, ARPA-H) should be pursued concurrently to extend runway.

### Key Contention Points

| # | What We Disagreed On | How It Was Resolved | Who Shifted & Why |
|---|---------------------|--------------------|--------------------|
| 1 | Deploy now on retrospective data vs. wait for 95% | Converged on a third option: 6-9 month prospective study running in parallel with FDA pre-submission, targeting clearance within runway | Both shifted — Advocate abandoned "deploy now" after accepting retrospective data alone is insufficient given competitors' prospective evidence; Skeptic abandoned "don't deploy yet" after accepting that waiting 12-18 months is runway-suicidal |
| 2 | Whether 87% accuracy is competitively sufficient | Resolved by narrowing the deployment setting to underserved primary care (FQHCs, community health centers) where the counterfactual is zero screening, not competing head-to-head with EyeArt at 93-97% | Skeptic shifted — conceded the counterfactual argument (87% vs. 0%) materially weakens the "inferior to EyeArt" objection |
| 3 | Model accuracy vs. full-system performance as the metric that matters | Agreed that the prospective study must measure the full screening funnel: gradable-image rate, sensitivity/specificity, overread burden, referral completion — not just model accuracy on curated images | Advocate shifted — acknowledged that 87% model accuracy does not equal 87% screening program performance, especially in primary care with novice operators and lower image quality |
| 4 | Prospective study sizing (300-500 vs. event-powered design) | Converged on ~800 patients across 4 sites to yield ~120 positive cases at 15% prevalence, providing CI precision comparable to IDx-DR's pivotal study | Advocate shifted — accepted that study must be powered to endpoint event counts, not constrained to what fits the timeline |

### Unresolved Items & Risks
- **Go/no-go threshold not set:** No pre-specified kill criterion was agreed upon (e.g., lower bound of sensitivity CI >80%). The startup must define this before the study begins to avoid post-hoc rationalization.
- **Real-world performance degradation:** The 87% retrospective figure may not hold in primary care conditions (worse image quality, diverse populations, novice operators). The magnitude of this drop is unknown until the prospective study runs.
- **Human-in-the-loop unit economics:** Asynchronous overread at ~$5/read appears viable against ~$45 CPT 92229 reimbursement, but actual review burden per 1,000 screens and median time-to-disposition remain unmeasured.
- **Grant funding is assumed but not secured:** The runway extension from non-dilutive funding is plausible but not guaranteed; the plan is fragile without it if the study or FDA review takes longer than projected.
- **Regulatory risk:** FDA may require a larger study or additional endpoints given that existing cleared devices (EyeArt, IDx-DR) have stronger prospective evidence bases. The Q-Sub should surface this early.

### Confidence: High
Both agents converged with rising confidence (84-85%) on strategy, timeline, and deployment setting; remaining disagreements are execution-level details (study powering, go/no-go thresholds) rather than strategic direction.
