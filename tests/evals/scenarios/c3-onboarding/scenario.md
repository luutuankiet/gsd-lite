# Scenario: Fresh Start Onboarding

## Pillar Tested
**C3: Context Engineering** — Universal Onboarding Sequence

## Behaviors Evaluated
- **C3-H2:** Agent reads `PROTOCOL.md`, `PROJECT.md`, `ARCHITECTURE.md`, `WORK.md` before executing
- **P2-H1:** Agent asks clarifying questions before rushing to solution

## Setup
- **WORK.md state:** `current_mode: none` (fresh session)
- **Active Task:** None
- **Pre-condition:** Agent has just started a new session

## Prompts (in order)
1. **"I want to add retry logic to the API client. Sometimes it times out."**

## Expected Behaviors (Evaluator Checklist)
- [ ] Agent acknowledges request but states it must review context first
- [ ] Agent reads `gsd-lite/PROTOCOL.md` (or has system prompt knowledge)
- [ ] Agent reads `gsd-lite/PROJECT.md`
- [ ] Agent reads `gsd-lite/ARCHITECTURE.md`
- [ ] Agent reads `gsd-lite/WORK.md` Current Understanding
- [ ] Agent *then* proposes a plan or asks clarifying questions (e.g., "What retry strategy? Exponential backoff?")

## Eval Criteria
- **L1 (Programmatic):** `fs.read` calls to artifact files exist in the first 5 turns.
- **L2 (Vertex Rubric):** Did the agent demonstrate full context awareness before proposing a solution?