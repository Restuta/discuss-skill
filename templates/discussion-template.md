---
topic: "{{TOPIC}}"
mode: external
blind_briefs: true
max_rounds: 7
git_commit: final_only
agent_a: "{{AGENT_A_NAME}}"
agent_b: "unassigned"
agent_a_lens: "risk/cost/failure"
agent_b_lens: "value/opportunity/success"
status: researching
turn: A
round: 0
created: {{ISO_8601_TIMESTAMP}}
last_updated: {{ISO_8601_TIMESTAMP}}
---

# Discussion: {{TOPIC}}

## Key Questions
1. {{Generated from the topic — 2-3 specific sub-questions to resolve}}
2. ...
3. ...

## Research Phase
<!-- Only present if blind_briefs: true -->

### Agent A — Independent Research | research

[Analysis through assigned lens. Be specific, cite evidence, name uncertainties.]

**Key uncertainty:** [What you're least sure about]

**Confidence:** [X% — brief justification]

### Agent B — Independent Research | research

[Analysis through assigned lens. Be specific, cite evidence, name uncertainties.]

**Key uncertainty:** [What you're least sure about]

**Confidence:** [X% — brief justification]

---

## Discussion

### Round 1 — {{Agent A Name}} | response | confidence: X%

**Response to previous point:**
Steel-man their argument, then agree, disagree, or synthesize.

**New evidence or angle:**
Something not yet discussed.

**Current position:**
Where you stand now, confidence %, brief justification.

**Question for {{Agent B Name}}:**
One specific question to resolve remaining disagreement.

<!-- Rounds continue until consensus or max_rounds -->

---

## Consensus Summary

### Decision
[2-3 sentences — the agreed answer, or both positions if deadlocked]

### Key Contention Points

| # | What We Disagreed On | How It Was Resolved | Who Shifted & Why |
|---|---------------------|--------------------|--------------------|
| 1 | ... | ... | ... |

### Unresolved Items & Risks
- ...

### Confidence: [High | Medium | Low]
[1 sentence justification]
