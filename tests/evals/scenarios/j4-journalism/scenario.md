# Scenario: Journalism Quality Log

## Pillar Tested
**J4: Journalism Quality** — Log Entry Quality

## Behaviors Evaluated
- **J4-H1:** Narrative framing (intro hook)
- **J4-H2:** Inclusion of code snippet / evidence
- **J4-H4:** Synthesized analogy ("cherry on top")

## Setup
- **WORK.md state:** `current_mode: execution` (task pending logging)
- **Active Task:** `TASK-002: Document caching decision`
- **Pre-condition:** Agent has context about "file-based JSON caching" (simulated via WORK.md history)

## Prompts (in order)
1. **"Let's capture the decision to use JSON file caching formally. Make sure the log entry explains why we chose this over SQLite."**

## Expected Behaviors (Evaluator Checklist)
- [ ] Log entry includes **Summary** section
- [ ] Log entry includes **Context** ("why we chose JSON over SQLite")
- [ ] Log entry includes **Code Snippet** (e.g., `json.dump` usage)
- [ ] Log entry uses **Journalism style** (narrative, not just bullets)
- [ ] Log entry includes **Analogy** or "ELI5" explanation (e.g., "SQLite is overkill for key-value store")

## Eval Criteria
- **L1 (Programmatic):** `grep "^### \[LOG-"` matches new entry.
- **L2 (Vertex Rubric):** Is the log entry understandable by someone with zero context? Does it tell a story?