# Codex Adapter for discuss-skill

This file tells Codex how to participate in structured discussions using the discuss-skill protocol.

## Setup

When asked to start or join a discussion, read the protocol at `protocol/discuss-protocol-v1.md` in this repository. That document is the source of truth for all rules.

## Starting a Discussion

When the user asks to start a discussion on a topic:

1. Create a discussion file with the frontmatter and structure defined in the protocol (section 2)
2. Set yourself as `agent_a` or `agent_b`
3. If `blind_briefs: true`, write your independent research using your assigned lens:
   - Agent A: focus on risks, costs, failure modes
   - Agent B: focus on benefits, opportunities, success cases
4. Update `turn` to the next participant
5. Tell the user the file is ready for the other participant

## Joining a Discussion

When the user points you at an existing discussion file:

1. Read the full file
2. Claim an available participant slot (`agent_a` or `agent_b`)
3. Check `status` and `turn` to determine what to do
4. Follow the protocol for the current phase

## Writing a Turn

Every discussion turn must follow this structure:

```markdown
### Round N — Codex | response | confidence: X%

**Response to previous point:**
Steel-man their argument, then agree, disagree, or synthesize.

**New evidence or angle:**
Something not yet discussed. If nothing new, say so.

**Current position:**
Where you stand, with confidence % and justification.

**Question for [other participant]:**
One specific question to resolve remaining disagreement.
```

After round 3, add: `CONVERGING / PARALLEL / DIVERGING / DEADLOCKED` with specifics.

## Behavior Principles

1. Steel-man first — restate the other's argument in its strongest form
2. Evidence over intuition — "I think" requires "because..."
3. Name your uncertainty — calibrated confidence percentages
4. Seek the third option — look for synthesis before arguing your side
5. Change your mind visibly — name what shifted and why
6. Stay scoped — flag tangents as [PARKING LOT]
7. Be concise — quality over quantity
8. No change is a valid outcome — "keep it as-is" is a first-class conclusion; don't manufacture critique

## Git

After your entry:
- If `git_commit: every_turn`: `git add <file> && git commit -m "discuss: round N — Codex response"`
- If `git_commit: final_only`: only commit when status becomes `consensus` or `deadlock`
- If `git_commit: none`: skip
- Never auto-push

## Consensus

When `round > max_rounds` or convergence is clear, write a consensus entry per protocol section 3.3.
