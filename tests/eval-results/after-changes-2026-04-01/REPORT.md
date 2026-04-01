# N-Agent Eval Results

Run: 2026-04-01T12-14-05
Configs: 2-cross
Topics: fintech-payments, healthcare-ai-deploy, monorepo-migration

## fintech-payments
**Topic:** Should a fintech startup (Series A, 20 engineers, processing $50M/year in transactions) build their own payment processing infrastructure or continue using Stripe? They're currently paying ~$1.5M/year in Stripe fees and expect 3x volume growth in 18 months.

| Metric | 2-cross |
|--------|------|
| **Checklist Coverage (raw)** | 93% (14/15) |
| **Checklist Coverage (weighted)** | 95% |
| **Traps Caught** | 2/2 (100%) |
| **Duration** | 441s |
| **Output Tokens (est.)** | ~6933 |

### Missed Checklist Items

**2-cross** missed (1):
  - [regulatory] Regulatory reporting obligations (money transmission, per-state/country licensing)

### Trap Detection Details

**2-cross:**
  - CAUGHT: Dismissing in-house entirely without analyzing volume economics — at $50M/year growing to $150M, the fee delta is material
  - CAUGHT: Advocating full in-house build without accounting for PCI scope, fraud detection complexity, and 20-engineer team capacity

## healthcare-ai-deploy
**Topic:** A healthcare AI startup (Series B, 18 months runway) has a diagnostic model for detecting diabetic retinopathy from retinal images. The model achieves 87% accuracy, matching average radiologist performance. Should they pursue FDA clearance and deploy now with human-in-the-loop, or invest 12-18 months to reach 95% accuracy before seeking clearance?

| Metric | 2-cross |
|--------|------|
| **Checklist Coverage (raw)** | 92% (12/13) |
| **Checklist Coverage (weighted)** | 90% |
| **Traps Caught** | 1/3 (33%) |
| **Duration** | 526s |
| **Output Tokens (est.)** | ~7743 |

### Missed Checklist Items

**2-cross** missed (1):
  - [technical] Data requirements for 87% to 95% — diminishing returns curve, likely needs 5-10x more data

### Trap Detection Details

**2-cross:**
  - CAUGHT: Claiming 87% is insufficient without comparing to standard of care — the benchmark is average radiologist, not perfection
  - MISSED: Advocating 'ship now, improve later' without acknowledging that medical device modifications require new regulatory submissions (not a software update)
  - MISSED: Assuming 87% to 95% is a simple training improvement without addressing the exponential data requirements and diminishing returns

## monorepo-migration
**Topic:** A B2B SaaS company (50-person engineering org, 8 teams) is experiencing growing pains with their 35 polyrepos. Cross-repo changes require coordinated PRs across 3-5 repos, dependency versions drift, and shared libraries are copy-pasted. Should they migrate to a monorepo?

| Metric | 2-cross |
|--------|------|
| **Checklist Coverage (raw)** | 100% (14/14) |
| **Checklist Coverage (weighted)** | 100% |
| **Traps Caught** | 2/2 (100%) |
| **Duration** | 440s |
| **Output Tokens (est.)** | ~6975 |

### Missed Checklist Items

### Trap Detection Details

**2-cross:**
  - CAUGHT: Arguing 'Google/Meta use monorepo therefore we should' without acknowledging they built $10M+ custom tooling (Bazel, Buck, Piper)
  - CAUGHT: Claiming monorepo is simpler without addressing CI blast radius, merge contention, and the migration itself


## Aggregate Summary

| Config | Avg Coverage (weighted) | Avg Traps Caught | Avg Duration |
|--------|----------------------|-----------------|-------------|
| 2-cross | 95% | 78% | 469s |