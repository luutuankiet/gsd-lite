---
description: WORK.md maintenance workflow - extract PR descriptions and archive completed tasks to HISTORY.md
---

# Housekeeping Workflow

[SYSTEM: HOUSEKEEPING MODE - WORK.md Maintenance]

## Initialization Check
Check if `WORK.md` and `HISTORY.md` exist. If yes, READ THEM. Do NOT overwrite.

## Entry Conditions

- User requests "write PR for [TASK]" or "generate PR description"
- User requests "clean up WORK.md" or "archive [TASK]"
- User requests "housekeeping" or "tidy up artifacts"
- Natural language triggers, NOT mode-based

## Exit Conditions

- PR description extracted (if requested)
- Completed task entries archived to HISTORY.md (if requested)
- Key Events Index updated (archived entries removed)
- Current Understanding reflects only active tasks
- User informed of housekeeping results

---

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

---

## First Turn Protocol

**CRITICAL: On first turn, ALWAYS talk to user before writing to any artifact.**

First turn sequence:
1. Read PROTOCOL.md (silently)
2. Read WORK.md Current Understanding (silently)
3. **TALK to user:** "Here's what I understand from the artifacts... What would you like to explore today?"
4. Only write to artifacts AFTER conversing with user

**Never on first turn:**
- Write to INBOX.md or WORK.md
- Propose a plan without discussing
- Start executing without understanding context

---

## Housekeeping Operations

### Operation 1: PR Extraction

**Trigger:** User says "write PR for MODEL-A" or "generate PR description for AUTH-IMPL"

**What it does:**
1. Filter WORK.md Atomic Log by Task: TAG (e.g., "Task: MODEL-A")
2. Extract relevant log types: VISION, DECISION, DISCOVERY (with code), EXEC (with code)
3. Generate PR description with narrative and evidence
4. Keep entries in WORK.md (NOT deleted)

**PR Description Format:**

```markdown
## Task: [TASK-ID] - [Task Name]

### What Changed

[High-level summary from VISION and PLAN entries]

### Evidence

[Key DISCOVERY and EXEC entries with code snippets]

**[LOG-004]** - Created base card component with TypeScript interface
```typescript
interface PostCardProps {
  post: { id: string; content: string; /* ... */ };
}
```

**[LOG-013]** - bcrypt cost factor 12 optimal for performance
Benchmark: Cost 10 = 50ms, Cost 12 = 150ms, Cost 14 = 600ms

### Decisions Made

[All DECISION entries with rationale]

- **[LOG-005]**: Card-based layout over timeline view (rationale: supports varying content length)
- **[LOG-016]**: Separate reset token, not main JWT (rationale: better security isolation)

### Testing

[Verification steps from final EXEC entries or manual testing]

- Login with test user returns 200
- Token validates correctly
- Card layout renders on mobile (768px breakpoint)
```

**Example interaction:**

```
User: "write PR for MODEL-A"

Agent:
  1. Reads WORK.md Atomic Log
  2. Filters for "Task: MODEL-A"
  3. Extracts LOG-001, LOG-003, LOG-004, LOG-005, LOG-009
  4. Generates PR description
  5. Presents to user for approval
  6. Entries remain in WORK.md for future reference
```

---

### Operation 2: Archive Completed Tasks

**Trigger:** User says "archive MODEL-A" or "clean up WORK.md" or "move completed tasks to history"

**What it does:**
1. Identify completed task entries by Task: TAG
2. Move entries from WORK.md to HISTORY.md
3. Update Key Events Index (remove archived entries)
4. Update Current Understanding (remove from active/parked tasks)
5. Optionally save full logs to dated files (user choice)

**HISTORY.md Format:**

```markdown
## Task: [TASK-ID] - [Task Name]

**Completed:** [Date]
**Outcome:** [One sentence summary]
**Artifact:** [Link to PR/doc if applicable]

**Key Milestones:**
- [LOG-001]: [One-line summary]
- [LOG-005]: [One-line summary]
- [LOG-017]: [One-line summary]
```

**Optionally, full logs can be saved to:** `HISTORY/2026-01-27-MODEL-A.md`

**Default:** Only keep one-liner summaries in HISTORY.md. Full logs archived only if user requests.

**Example interaction:**

```
User: "archive MODEL-A"

Agent:
  1. Reads WORK.md Atomic Log
  2. Filters for "Task: MODEL-A"
  3. Extracts key milestones (VISION, DECISION, final EXEC)
  4. Writes to HISTORY.md with one-line summaries
  5. Removes MODEL-A entries from WORK.md
  6. Updates Key Events Index (removes LOG-001, LOG-005, etc.)
  7. Updates Current Understanding (removes MODEL-A from active_task)
  8. Confirms with user: "Archived 9 entries for MODEL-A to HISTORY.md"
```

---

### Operation 3: Index Maintenance

**Automatically performed** after archiving:

1. Remove archived entries from Key Events Index
2. Re-sequence if needed (keep LOG IDs, just remove rows)
3. Verify index matches active log entries only

**Example:**

Before archiving:
```
| LOG-001 | VISION | MODEL-A | ... |
| LOG-005 | DECISION | MODEL-A | ... |
| LOG-010 | VISION | AUTH-IMPL | ... |
```

After archiving MODEL-A:
```
| LOG-010 | VISION | AUTH-IMPL | ... |
```

---

## Key Differences from Promotion Workflow

| Aspect | Promotion (old) | Housekeeping (new) |
|--------|----------------|-------------------|
| Trigger | Mode-based | Natural language request |
| WORK.md | Deleted after promotion | Perpetual, only archived selectively |
| Frequency | Once per phase | Multiple times as needed |
| Scope | Entire phase | Specific tasks |
| PR timing | At phase end | Anytime user requests |

---

## Sticky Note Protocol

**At the end of EVERY turn**, include this status block **without exception**.

### Required Format

Use fenced block with `gsd-status` marker:

```gsd-status
📋 UPDATED: [artifact name] ([what changed])

CURRENT STATE:
- Phase: PHASE-NNN ([Phase name]) - [X/Y tasks complete]
- Task: [Active task or "None"]
- Active loops: [count] ([LOOP-001, LOOP-002, ...])

AVAILABLE ACTIONS:
📋 /continue | /pause | /status | /add-loop | /discuss
[Contextual actions if applicable]

NEXT: [What agent expects from user]
SELF-CHECK: agent has completed the following action
- [ ] WORK.md update
- [ ] INBOX.md update
- [ ] HISTORY.md update

---
📊 PROGRESS: [status]
---
```

---

## Common Housekeeping Scenarios

### Scenario 1: PR for Single Task

```
User: "write PR for MODEL-A"

Agent:
  1. Filters WORK.md for Task: MODEL-A
  2. Extracts VISION, DECISION, DISCOVERY, EXEC entries
  3. Generates PR description with code snippets
  4. Presents to user
  5. User: "looks good"
  6. Agent: Saves PR description to file or clipboard
  7. Entries remain in WORK.md
```

### Scenario 2: Archive Completed Task

```
User: "archive MODEL-A"

Agent:
  1. Confirms task is complete (asks user if unclear)
  2. Extracts key milestones to HISTORY.md
  3. Removes MODEL-A entries from WORK.md
  4. Updates Key Events Index
  5. Updates Current Understanding
  6. Shows summary: "Archived 9 entries for MODEL-A"
```

### Scenario 3: Clean Up Multiple Tasks

```
User: "clean up WORK.md - archive MODEL-A and AUTH-IMPL"

Agent:
  1. Archives MODEL-A entries to HISTORY.md
  2. Archives AUTH-IMPL entries to HISTORY.md
  3. Updates Key Events Index (removes both)
  4. Updates Current Understanding (removes both if no longer active)
  5. Shows summary: "Archived 17 total entries (9 MODEL-A, 8 AUTH-IMPL)"
```

### Scenario 4: PR Then Archive

```
User: "write PR for MODEL-A"
Agent: [generates PR description]

User: "looks good, now archive it"
Agent:
  1. PR already extracted (not re-done)
  2. Archives MODEL-A entries to HISTORY.md
  3. Updates artifacts
  4. "PR ready to submit, entries archived"
```

---

## Common Pitfalls to Avoid

1. **Deleting WORK.md entirely** - Only archive specific tasks, not entire file
2. **Auto-archiving without user request** - User controls when to clean up
3. **Forgetting to update Key Events Index** - Must remove archived entries
4. **Losing code snippets during PR extraction** - Preserve all code blocks
5. **Forgetting sticky reminder** - End every turn with status block
6. **Assuming task is complete** - Confirm with user if unclear
7. **Mixing PR extraction with archiving** - These are separate operations (can be combined if user requests)

---

## Perpetual WORK.md Philosophy

**WORK.md is now perpetual, not ephemeral.**

**What this means:**
- Logs persist indefinitely until user requests archiving
- Enables PR extraction at any time (not just phase end)
- Supports multiple concurrent tasks with Task: TAG filtering
- Growth managed through user-controlled housekeeping

**When to suggest housekeeping:**
- WORK.md exceeds ~500 lines
- User completes a major task/milestone
- User explicitly requests cleanup
- Never auto-archive without permission

**The shift:**
- Old: WORK.md deleted after phase promotion
- New: WORK.md grows organically, user decides when to archive
- Result: Better evidence preservation, flexible PR timing

---

*Housekeeping Workflow - Part of GSD-Lite Protocol v2.0*
