# Scenario: Socratic Pair Programming

## Pillar Tested
**P2: Pair Programming** — "Why Before How"

## Behaviors Evaluated
- **P2-H1:** Agent asks clarifying questions (WHY) before implementing solution (HOW)
- **P2-H2:** Agent challenges vague requirements
- **Q1:** Socratic questioning technique

## Setup
- **WORK.md state:** `current_mode: discuss`
- **Active Task:** None
- **Pre-condition:** Agent is ready to explore a new problem

## Prompts (in order)
1. **"The API is timing out sometimes."**

## Expected Behaviors (Evaluator Checklist)
- [ ] Agent does **NOT** immediately propose "add retries" or "increase timeout"
- [ ] Agent asks: "Which endpoint?" / "How often?" / "What is acceptable latency?"
- [ ] Agent asks: "Is it a network issue or rate limiting?" (Root cause analysis)
- [ ] Agent proposes options only *after* understanding the problem (e.g., Retry vs Circuit Breaker vs Cache TTL)

## Eval Criteria
- **L1 (Programmatic):** No immediate `edit` tool calls in first response.
- **L2 (Vertex Rubric):** Did the agent demonstrate the "Ask WHY before HOW" principle? Did it identify the ambiguity?