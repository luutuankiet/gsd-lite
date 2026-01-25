# GSD-Lite Protocol

[SYSTEM: GSD-LITE MODE ACTIVE]

## Session Start

1. Read this file (PROTOCOL.md)
2. Read STATE.md to determine current mode
3. Load appropriate workflow from gsd-lite/template/workflows/

## Workflow Router

**How routing works:** This is documentation-only routing. The agent manually reads STATE.md, checks the `Current Mode:` field, then reads and follows the appropriate workflow file. There is no programmatic automation - the agent interprets and follows instructions.

### Primary Routing (Read STATE.md `Current Mode:`)

| State | Workflow | Purpose |
|-------|----------|---------|
| `none` or `planning` | moodboard.md | New phase, extract user vision |
| `moodboard-complete` | whiteboard.md | Present plan for approval |
| `execution` | execution.md | Execute tasks, log progress |
| `checkpoint` | checkpoint.md | Session handoff, preserve context |
| `promotion` | promotion.md | Complete phase, trim WORK.md |

If STATE.md doesn't exist or has no active phase, load moodboard.md.

### Secondary Routing (User-Initiated Workflows)

These workflows are triggered by explicit user requests, not by STATE.md mode:

| User Signal | Workflow | When to Use |
|-------------|----------|-------------|
| "revisit" or "let me rethink this" | revisit.md | User wants to reconsider plan after whiteboard approval |
| "checkpoint" or "pause" | checkpoint.md | End session mid-phase, preserve for later resume |

**Revisit workflow:**
- Triggered when user says "revisit" or "let me rethink this"
- Only valid when MODE = whiteboard-complete (plan exists but execution hasn't started)
- Enables user to reconsider implementation approach without restarting discovery
- After revisit completes, returns to whiteboard-complete mode
- See revisit.md for full protocol

**Checkpoint workflow:**
- Triggered when user requests "checkpoint" or "pause", or agent suggests checkpoint
- Valid during any active phase (execution mode)
- Updates STATE.md with current progress, preserves WORK.md (NOT trimmed)
- Enables fresh agent to resume work in next session
- See checkpoint.md for Current Understanding update instructions

**Agent reads and follows:** Agent reads the workflow file content, then follows those instructions for the session. This is NOT programmatic routing - it's documentation the agent interprets.

## Fresh Agent Resume Protocol

**When resuming work after checkpoint (fresh context window):**

1. **Read PROTOCOL.md** - You're doing this now
2. **Read STATE.md** - Determine current mode and phase/task status
3. **Read WORK.md Current Understanding section** - Get 30-second context summary
   - Where exactly are we? (current_state)
   - What does user want? (vision)
   - What decisions were made? (decisions)
   - What's blocking progress? (blockers)
   - What's the next action? (next_action)
4. **Load appropriate workflow** - Based on STATE.md mode
5. **Continue work** - Pick up from where previous session left off

**Key principle:** Reconstruct context from artifacts (STATE.md, WORK.md), NOT from chat history. Fresh agents have zero prior context.

**Current Understanding in WORK.md:**
- Updated at checkpoint time (not every turn)
- Provides fresh agent with essential context in 30 seconds
- Avoids jargon like "as discussed" - uses concrete facts
- See checkpoint.md for Current Understanding update instructions

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
