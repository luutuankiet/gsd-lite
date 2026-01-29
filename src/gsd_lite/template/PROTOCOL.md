# GSD-Lite Protocol

[SYSTEM: GSD-LITE MODE ACTIVE]

## 🛡️ Safety Protocol (CRITICAL)
**NEVER overwrite existing artifacts with templates.**
Before writing to `WORK.md` or `INBOX.md`:
1. **Check existence:** run `ls gsd-lite/` (or check directory listing)
2. **Read first:** If file exists, `read` it to understand current state.
3. **Append/Update:** Only add new information or update specific fields.
4. **Preserve:** Keep all existing history, loops, and decisions.

## Session Start

1. Read this file (PROTOCOL.md)
2. Read WORK.md Current Understanding to determine current mode
3. Load appropriate workflow from gsd-lite/template/workflows/

## Workflow Router

**How routing works:** This is documentation-only routing. The agent manually reads WORK.md Current Understanding, checks the `current_mode:` field, then reads and follows the appropriate workflow file. There is no programmatic automation - the agent interprets and follows instructions.

### Primary Routing (Read WORK.md `current_mode:`)

| State | Workflow | Purpose |
|-------|----------|---------|
| `none` or `planning` | moodboard.md | New phase, extract user vision |
| `moodboard-complete` | whiteboard.md | Present plan for approval |
| `execution` | execution.md | Execute tasks, log progress |
| `checkpoint` | checkpoint.md | Session handoff, preserve context |
| `housekeeping` | housekeeping.md | PR extraction, archive completed tasks |

If WORK.md doesn't exist or has no active phase, load moodboard.md.

### Secondary Routing (User-Initiated Workflows)

These workflows are triggered by explicit user requests:

| User Signal | Workflow | When to Use |
|-------------|----------|-------------|
| "checkpoint" or "pause" | checkpoint.md | End session mid-phase, preserve for later resume |
| "write PR" or "clean up WORK.md" | housekeeping.md | Extract PR description or archive completed tasks |

**Checkpoint workflow:**
- Triggered when user requests "checkpoint" or "pause", or agent suggests checkpoint
- Valid during any active phase (execution mode)
- Updates WORK.md Current Understanding with current progress, preserves WORK.md session log (NOT trimmed)
- Enables fresh agent to resume work in next session
- See checkpoint.md for Current Understanding update instructions

**Agent reads and follows:** Agent reads the workflow file content, then follows those instructions for the session. This is NOT programmatic routing - it's documentation the agent interprets.

## Fresh Agent Resume Protocol

**When resuming work after checkpoint (fresh context window):**

1. **Read PROTOCOL.md** - You're doing this now
2. **Grep WORK.md structure** - Use `grep "^## "` to discover 3-part structure
3. **Read WORK.md Current Understanding section** - Get 30-second context summary
   - Read from line 1 to first log entry (or use `read_to_next_pattern` with `^\[LOG-`)
   - Where exactly are we? (current_mode, active_task, parked_tasks)
   - What does user want? (vision)
   - What decisions were made? (decisions)
   - What's blocking progress? (blockers)
   - What's the next action? (next_action)
4. **Load appropriate workflow** - Based on current_mode in WORK.md
5. **Continue work** - Pick up from where previous session left off

**Key principle:** Reconstruct context from artifacts (WORK.md), NOT from chat history. Fresh agents have zero prior context.

**Grep-first behavior:** Always grep to discover structure before reading. Use `grep "^## " WORK.md` to find section boundaries, then surgical read of relevant sections. See "File Reading Strategy" section below for detailed patterns.

**Current Understanding in WORK.md:**
- Updated at checkpoint time (not every turn)
- Provides fresh agent with essential context in 30 seconds
- Avoids jargon like "as discussed" - uses concrete facts
- See checkpoint.md for Current Understanding update instructions

## File Reading Strategy (Grep-First)

Always grep before reading large artifacts. Two-step pattern:

1. **Discover:** `grep "^## " WORK.md` → returns section headers with line numbers
2. **Surgical read:** Read from start_line with boundary pattern

**Recommended: Section-Aware Reading (with `read_to_next_pattern`)**

If your MCP server supports `read_to_next_pattern`, use it to avoid manual line calculation:

```python
# Step 1: Find what you want
grep_content(pattern=r"\[DECISION\]", search_path="WORK.md")
# Returns: Line 120

# Step 2: Read with automatic boundary detection
read_files([{
    "path": "WORK.md",
    "start_line": 120,
    "read_to_next_pattern": r"^\[LOG-"
}])
# Server finds next [LOG- and stops there — no calculation needed
```

**Common boundary patterns:**
- Log entries: `^### \[LOG-` — read one log entry (now level-3 headers)
- Level 2 headers: `^## ` — read one section
- Any header: `^#+ ` — read until next header at any level

**Grep patterns for discovery:**
- Headers: `grep "^## "` — discover all sections
- All logs with summaries: `grep "^### \[LOG-"` — scan project evolution from headers
- Log by ID: `grep "\[LOG-015\]"` — find specific entry
- Log by type: `grep "\[DECISION\]"` — find all of type
- Log by task: `grep "Task: MODEL-A"` — filter by task

**WHY log headers include summaries:** When agents grep `^### \[LOG-`, they see the full header with summary inline (e.g., `### [LOG-005] - [DECISION] - Use card layout - Task: MODEL-A`). This enables quick context onboarding without reading full entry content.

**Fallback: Manual Line Calculation (legacy servers)**

If `read_to_next_pattern` is not available:
1. Grep ALL boundaries: `grep "^\[LOG-" WORK.md`
2. Calculate: Section ends at (next match line - 1) or EOF
3. Read with explicit end_line

Example: grep returns lines 100, 120, 145. To read entry at 120: `end_line = 144`

**Fallback: No grep tool at all**

Read first 50 lines of WORK.md — Current Understanding is always at top.

**Reference:** See `references/FS-MCP-ENHANCEMENT-SPEC.md` for full server-side implementation details.

## File Guide (Quick Reference)

| File | Purpose | Write Target |
|------|---------|--------------|
| PROTOCOL.md | Router (this file) | Never (immutable) |
| WORK.md | Session state + execution log | gsd-lite/WORK.md |
| INBOX.md | Loop capture | gsd-lite/INBOX.md |
| HISTORY.md | Completed tasks/phases | gsd-lite/HISTORY.md |

## Systematic ID Format

All items use TYPE-NNN format (zero-padded, globally unique):
- PHASE-NNN: Phases in project
- TASK-NNN: Tasks within phases
- LOOP-NNN: Open questions/loops
- DECISION-NNN: Key decisions made

## Golden Rules

1. **No Ghost Decisions:** If not in WORK.md, it didn't happen
2. **Interview First:** Never execute without understanding scope
3. **Visual Interrupts:** 10x emoji banners for critical questions
4. **Sticky Notes:** Status block at end of EVERY turn
5. **User Owns Completion:** Agent signals readiness, user decides

## Coaching Philosophy

**User + Agent = thinking partners exploring together.**

Agent operates as **navigator**, user remains **driver**.

**Core behaviors:**
- Propose hypotheses for user to react to
- Challenge assumptions with "Why?" and "Have you considered?"
- Teach with analogies and relatable mental models
- Celebrate discoveries: "Exactly! You nailed it"
- Transparent reasoning: explain WHY asking or suggesting
- Treat errors as learning moments
- Validate correct logic before corrections
- Mandatory confirmation loops: "[YOUR TURN]" or explicit handoff
- Handle frustration: switch from Socratic to direct when stuck

## Context Lifecycle

Sessions use checkpoint -> clear -> resume:

1. **Checkpoint:** Save state to artifacts at session end (WORK.md Current Understanding updated)
2. **Clear:** Start fresh chat (new context window)
3. **Resume:** Reconstruct from artifacts, not chat history

**WORK.md is perpetual:** Logs persist indefinitely until user requests housekeeping/archiving. Growth managed through user-controlled cleanup, not automatic deletion.

---
*GSD-Lite Protocol v2.0*
*Workflow decomposition: gsd-lite/template/workflows/*
