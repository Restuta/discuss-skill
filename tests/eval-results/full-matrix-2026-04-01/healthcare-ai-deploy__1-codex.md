---
topic: "A healthcare AI startup (Series B, 18 months runway) has a diagnostic model for detecting diabetic retinopathy from retinal images. The model achieves 87% accuracy, matching average radiologist performance. Should they pursue FDA clearance and deploy now with human-in-the-loop, or invest 12-18 months to reach 95% accuracy before seeking clearance?"
mode: "single-agent"
agent_count: "1"
agent_cli: "codex"
status: "consensus"
created: "2026-04-01T08:52:49.322Z"
---

# Discussion: A healthcare AI startup (Series B, 18 months runway) has a diagnostic model for detecting diabetic retinopathy from retinal images. The model achieves 87% accuracy, matching average radiologist performance. Should they pursue FDA clearance and deploy now with human-in-the-loop, or invest 12-18 months to reach 95% accuracy before seeking clearance?

## Single Agent Analysis

# Analysis: A healthcare AI startup (Series B, 18 months runway) has a diagnostic model for detecting diabetic retinopathy from retinal images. The model achieves 87% accuracy, matching average radiologist performance. Should they pursue FDA clearance and deploy now with human-in-the-loop, or invest 12-18 months to reach 95% accuracy before seeking clearance?

## Research
The first issue is that `87% accuracy` is not the right decision metric. For diabetic retinopathy screening, prevalence is usually low enough that accuracy can hide clinically dangerous false negatives. FDA’s special controls for this device category require sensitivity, specificity, PPV, and NPV with confidence intervals under intended-use conditions, not just headline accuracy. Also, the relevant human comparator is usually retinal specialists, ophthalmologists, or trained graders, not radiologists. So the company should not decide based on “87% equals average human” alone; it should decide based on whether current prospective performance has acceptable sensitivity, NPV, imageability, and subgroup stability across cameras, sites, and operators ([FDA special controls](https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN180001.pdf), [FDA CDS guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software)).

Regulatorily, 87% does not automatically block clearance. FDA’s first De Novo diabetic retinopathy device, IDx-DR, was authorized in April 2018 with observed sensitivity of 87.4% and specificity of 89.5%; the review summary notes prespecified thresholds of 85.0% sensitivity and 82.5% specificity. Since that De Novo created Class II regulation `21 CFR 886.1100` / product code `PIB`, later devices such as EyeArt cleared via 510(k), including a 2023 clearance showing roughly 94%-96% sensitivity and 86%-91% specificity depending on camera and endpoint. That means an 87-level model can be clearable if it fits the intended use and validates well, but it will be commercially weaker than the best cleared alternatives. Higher accuracy helps benefit-risk and competitive positioning; it does not remove the need for the same core package: Pre-Sub, QMS, software V&V, cybersecurity, human factors, clinical validation, camera/operator variability analysis, labeling, and change-control planning ([FDA PIB classification](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpcd/classification.cfm?productcode=PIB&start_search=1), [IDx-DR De Novo](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/denovo.cfm?id=DEN180001), [EyeArt 510(k)](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K223357), [Q-Sub guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/requests-feedback-and-meetings-medical-device-submissions-q-submission-program), [PCCP guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/marketing-submission-recommendations-predetermined-change-control-plan-artificial-intelligence)).

Technically, getting from 87 to 95 is plausible but not something to assume on a 12-18 month schedule. Strong DR systems have already needed large, well-labeled datasets: Gulshan et al used 128,175 images with 3-7 ophthalmologist grades per image; Ting et al trained on 76,370 images and validated on 71,896 more, reaching about 90.5% sensitivity / 91.6% specificity. That suggests the bottleneck is usually not raw compute; it is adjudicated data from the deployment population, hard-case mining, camera/site diversity, label quality, and ungradable-image handling. If the current model is stuck at 87, the gap to 95 probably requires not just more training but materially better data and clinical design. Twelve to eighteen months is realistic only if those data partnerships and labeling operations already exist ([Gulshan 2016](https://jamanetwork.com/article.aspx?doi=10.1001%2Fjama.2016.17216), [Ting 2017](https://jamanetwork.com/journals/jama/fullarticle/2665775)).

Financially, waiting is the bigger risk. An 18-month runway is not enough for “improve model for 12-18 months, then start FDA, then wait for clearance, then ramp revenue” unless the company is already certain of a bridge round. A 510(k) review goal is 90 days and De Novo 150 days, but total program time is much longer once Pre-Sub, study execution, AI requests, and launch prep are included. There is now a reimbursement path for AI DR screening in the US via CPT `92229`, and usage has been growing since January 2021, though adoption remains early. That argues for starting the regulatory and commercialization clock sooner, not later, while continuing improvement in parallel ([FDA review timelines](https://www.fda.gov/medical-devices/laboratory-developed-tests-faqs/premarket-review-laboratory-developed-tests-faqs), [JAMA Ophthalmology 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11581731/)).

## Recommendation

### Decision
Pursue FDA engagement now and plan for deployment with a human-in-the-loop or otherwise narrow, defensible indication, while continuing model improvement in parallel. Do not wait for an arbitrary `95% accuracy` target before filing unless current 87% breaks down into clinically weak sensitivity, poor NPV, or unstable subgroup/site performance.

### Key Trade-offs
| # | Trade-off | How You Weighed It |
|---|-----------|-------------------|
| 1 | Faster clearance vs better model | Clearance at current performance is plausible; waiting for 95 may improve competitiveness, but it likely delays revenue beyond runway. |
| 2 | Regulatory confidence vs commercial differentiation | 95 does not radically simplify FDA review; it mostly improves marketability against existing cleared competitors. |
| 3 | Data/clinical effort now vs later | The same clinical/regulatory infrastructure is needed either way, so starting now creates learning and de-risks later iterations. |
| 4 | Human-in-the-loop safety vs autonomous-margin ambition | HITL/narrow claims lower commercial upside per use case but are more realistic for a current 87-level model. |
| 5 | Burn preservation vs pre-revenue R&D | With only 18 months runway, a pure-improvement strategy is financially fragile unless a bridge is already lined up. |

### Risks & Uncertainties
- `87% accuracy` may mask an unsafe false-negative profile.
- Performance may fall materially in prospective, multicenter, intended-use validation.
- Competitors with mid-90s sensitivity may make an 87-level product hard to sell unless workflow, price, or access advantages are strong.
- A HITL product may clear but still struggle on reimbursement or provider adoption.
- The recommendation changes if the company already has committed financing for an extra 12-18 months.

### Confidence: Medium
This is the right default strategy given current FDA precedent and runway pressure, but the decision depends heavily on how the 87% decomposes into sensitivity, specificity, NPV, imageability, and subgroup robustness.
