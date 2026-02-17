# Scenario: Mid-Session Handoff

## Pillar Tested
**S1: Stateless-First** — Session Handoff

## Behaviors Evaluated
- **S1-H1:** Agent produces a valid `📦 STATELESS HANDOFF` packet
- **J4-H3:** Agent updates `WORK.md` Current Understanding before handoff

## Setup
- **WORK.md state:** `current_mode: execution` (active task)
- **Active Task:** `TASK-001 - Implement retry logic`
- **Pre-condition:** Agent is in execution mode

## Prompts (in order)
1. **"I need to pause here. Let's create a checkpoint."**

## Expected Behaviors (Evaluator Checklist)
- [ ] Agent updates `WORK.md` Current Understanding with latest status
- [ ] Agent logs any pending decisions to `WORK.md`
- [ ] Agent outputs a `📦 STATELESS HANDOFF` block at the end
- [ ] Handoff includes Layer 1 (Local) and Layer 2 (Global) context
- [ ] Handoff includes "Fork paths" section

## Eval Criteria
- **L1 (Programmatic):** `grep "📦 STATELESS HANDOFF"` succeeds in last response.
- **L2 (Vertex Rubric):** Is the handoff actionable? Does it include correct `LOG-NNN` references?