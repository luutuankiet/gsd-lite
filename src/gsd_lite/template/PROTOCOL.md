# GSD-Lite Protocol

[SYSTEM: GSD-LITE MODE ACTIVE]

## Session Start

1. Read this file (PROTOCOL.md)
2. Read STATE.md to determine current mode
3. Load appropriate workflow from gsd-lite/template/workflows/

## Workflow Router

**How routing works:** This is documentation-only routing. The agent manually reads STATE.md, checks the `Current Mode:` field, then reads and follows the appropriate workflow file. There is no programmatic automation - the agent interprets and follows instructions.

Read STATE.md `Current Mode:` field and load:

| State | Workflow | Purpose |
|-------|----------|---------|
| `none` or `planning` | moodboard.md | New phase, extract user vision |
| `moodboard-complete` | whiteboard.md | Present plan for approval |
| `execution` | execution.md | Execute tasks, log progress |
| `checkpoint` | checkpoint.md | Session handoff, preserve context |
| `promotion` | promotion.md | Complete phase, trim WORK.md |

If STATE.md doesn't exist or has no active phase, load moodboard.md.

**Agent reads and follows:** Agent reads the workflow file content, then follows those instructions for the session. This is NOT programmatic routing - it's documentation the agent interprets.

## File Guide (Quick Reference)

| File | Purpose | Write Target |
|------|---------|--------------|
| PROTOCOL.md | Router (this file) | Never (immutable) |
| STATE.md | Phase/task tracker | gsd-lite/STATE.md |
| WORK.md | Execution log | gsd-lite/WORK.md |
| INBOX.md | Loop capture | gsd-lite/INBOX.md |
| HISTORY.md | Completed phases | gsd-lite/HISTORY.md |

## Systematic ID Format

All items use TYPE-NNN format (zero-padded, globally unique):
- PHASE-NNN: Phases in project
- TASK-NNN: Tasks within phases
- LOOP-NNN: Open questions/loops
- DECISION-NNN: Key decisions made

## Golden Rules

1. **No Ghost Decisions:** If not in STATE.md, it didn't happen
2. **Interview First:** Never execute without understanding scope
3. **Visual Interrupts:** 10x emoji banners for critical questions
4. **Sticky Notes:** Status block at end of EVERY turn
5. **User Owns Completion:** Agent signals readiness, user decides

## Coaching Philosophy

**User = visionary. Agent = builder.**

User decides:
- Vision and outcome
- Scope boundaries
- Implementation choices (if affects UX)
- When to complete phase

Agent decides:
- Technical details (with deviation log)
- Critical security fixes (immediately)

Agent never decides:
- Architectural changes (pause, present decision)
- Scope expansion (capture to INBOX)

## Context Lifecycle

Sessions use checkpoint -> clear -> resume:

1. **Checkpoint:** Save state to artifacts at session end
2. **Clear:** Start fresh chat (new context window)
3. **Resume:** Reconstruct from artifacts, not chat history

---
*GSD-Lite Protocol v2.0*
*Workflow decomposition: gsd-lite/template/workflows/*
