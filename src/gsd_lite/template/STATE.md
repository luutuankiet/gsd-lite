# GSD-Lite State

<!--
This file answers: "Where were we?"
Read this at session start to understand current position.
Update after EVERY turn (agent response).
-->

## Current Mode

<!--
Mode determines which workflow to load from PROTOCOL.md router.
Transitions: none → planning → moodboard-complete → execution → checkpoint → promotion
-->

**Mode:** none
**Workflow:** moodboard.md

---

## Active Phase

**Phase:** PHASE-NNN - [Name]
**Goal:** [One sentence]
**Status:** Planning | Executing | Blocked | Complete
**Progress:** [X/Y tasks complete]

## Current Task

**Task:** TASK-NNN - [Name]
**Status:** Not Started | In Progress | Blocked | Done
**Blocked By:** [If blocked, what's stopping progress]

## Key Decisions Made

<!--
Decisions logged here so agent doesn't re-ask same questions.
All decisions get unique ID: DECISION-NNN
-->

| ID | Date | Decision | Why |
|----|------|----------|-----|
| DECISION-001 | YYYY-MM-DD | [Decision] | [Rationale] |

## Session Log

<!-- Brief history of what happened when -->

| Session | Date | Summary |
|---------|------|---------|
| 1 | YYYY-MM-DD | [What happened] |

## Open Loops

See INBOX.md for full list.
Currently: [N] loops pending review

**Quick references:**
- LOOP-001: [Brief description]
- LOOP-002: [Brief description]

## ID Registry

<!--
Track next available ID for each type.
IDs are globally unique and never reused.
-->

**Next IDs:** PHASE-NNN, TASK-NNN, LOOP-NNN, DECISION-NNN

---
*Last Updated: YYYY-MM-DD HH:MM*
