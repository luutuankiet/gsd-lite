# Execution Workflow

[SYSTEM: EXECUTION MODE - Task Work]

## Entry Conditions

- After whiteboard approval (user says "yes")
- STATE.md shows active phase with tasks
- No blocking decisions pending

## Exit Conditions

- All tasks in scope complete
- Agent signals "phase ready for completion"
- User requests checkpoint/promotion

---

## Coaching Philosophy

During execution, the relationship between user and agent is clear:

**User owns outcome. Agent executes.**

### Governance Framework

| Decision Type | Owner | Agent Role | Example |
|---------------|-------|------------|---------|
| Vision/Outcome | User | Extract via questioning | "What should this feel like when done?" |
| Scope boundary | User | Clarify, redirect creep | "That's a new capability - note for roadmap?" |
| Implementation choice | User (if affects UX) | Present options with pros/cons | "Cards vs timeline layout?" |
| Technical detail | Agent | Auto-fix with deviation log | "Missing null check - adding" |
| Architectural change | User | Pause, present decision | "This requires new database table" |
| Critical security | Agent | Auto-fix immediately | "SQL injection risk - sanitizing input" |

### Key Principles

1. **Technical details:** Agent auto-fixes bugs, missing validation, security issues. Log deviation, continue execution.
2. **Architectural changes:** Agent pauses, presents decision with context and options, waits for user choice.
3. **Scope creep:** Agent captures to INBOX.md, references in sticky note, continues with original scope.
4. **Never expand scope mid-phase:** Defer discovered work to INBOX, stay disciplined.

---

## Execution Protocol

### The Journalist Rule

**Don't just log data; tell the story of the build.**

When executing tasks, you're creating the narrative that will inform the PR description, documentation updates, and future context.

### WORK.md Logging Standard

Use two types of entries:

**1. Milestone Entry (Rich Context):**

Use this for "Big Wins" or complex fixes. This helps write the final PR description.

```markdown
### [2026-01-22] Milestone: Fixed Timestamp Collision

**Observation:** Found 29k rows where valid_to < valid_from.

**Evidence:**
`SELECT count(*) FROM subs WHERE valid_to < valid_from` -> 29,063 rows.

**Resolution:** Implemented deterministic staggering in `base_recharge_subscriptions.sql`.
```

**2. Standard Entry (Routine):**

Use this for the daily grind.

```markdown
**[2026-01-22 15:45]** - TASK-002: Create auth.ts file
- Result: Created file with generateToken function
- Files modified: src/auth.ts
- Status: In Progress
```

### Granular Logs for Steps

For minor edits/commands, use standard bullet points.

Track progress after every turn to maintain rich context for wins.

---

## Loop Capture Protocol

Loops come from TWO sources:

1. **User:** Non-linear thinker, will ask questions mid-task
2. **Agent:** Discovers dependencies, concerns, future work

Both get captured immediately to INBOX.md.

### INBOX.md Format

```markdown
## LOOP-NNN: [Brief Description]

**Source:** [User | Agent]
**Captured:** [Date]
**Context:** [Why this matters]
**Priority:** [High | Medium | Low]
**Status:** Open | Clarifying | Closed

### Details

[Full description of the loop/concern/future work]

### Next Action

[What needs to happen when this loop is addressed]
```

### Example Entry

```markdown
## LOOP-003: Add password reset flow

**Source:** User
**Captured:** 2026-01-22
**Context:** User asked mid-task during TASK-002: "What about password reset?"
**Priority:** Medium
**Status:** Open

### Details

Need to add password reset functionality with email verification.
Out of scope for PHASE-001 (current auth phase) but important for production.

### Next Action

Create new PHASE-002 after PHASE-001 completes
```

---

## Scope Discipline

**The Core Principle:** Never expand scope mid-phase.

### When Scope Creep Appears

1. **Stop execution**
2. **Capture to INBOX.md** with clear context
3. **Reference in sticky reminder**
4. **Continue with original scope**

### Why This Matters

- Phases complete faster
- Clear boundaries prevent drift
- INBOX becomes prioritization backlog
- User maintains control over what's in scope

### Example

```
User (mid-task): "Oh, we should also add user profile page"

Agent response:
"That's a new capability. I'll capture to INBOX.md so we can address after current phase completes."

[Writes LOOP-004 to INBOX.md]
[References in sticky note: "Captured LOOP-004 for future phase"]
[Continues with original task]
```

---

## Checkpoint Emoji Banners

During execution, use checkpoint banners to signal state changes and important events.

### Blocking Checkpoints

When user verification or decision is required:

```
🛑🛑🛑🛑🛑🛑🛑 BLOCKING: [Type of verification/decision] 🛑🛑🛑🛑🛑🛑🛑

**What**: [What was built/discovered/needs decision]

**Context**: [Why this matters]

**How to verify** OR **Options**:
[Numbered steps for verification OR options with pros/cons]

---
→ YOUR ACTION: [Explicit instruction - "Type 'approved'" or "Select 1, 2, or 3"]
---
```

**Use blocking checkpoints for:**

- User needs to verify visual output (dashboard layout, UI behavior)
- User needs to make architectural decision (library choice, data model)
- User needs to provide credentials (authentication gates)
- User needs to test functionality (manual testing required)

### Informational Checkpoints

For progress updates and state changes that don't require immediate action:

**🔄 LOOP Captured**

```
🔄 LOOP-NNN CAPTURED

**Loop**: [Brief description]
**Source**: [User | Agent]
**Priority**: [High | Medium | Low]
**Added to**: INBOX.md

---
```

**✅ DECISION Made**

```
✅ DECISION-NNN MADE

**Decision**: [What was decided]
**Rationale**: [Why this choice]
**Impact**: [Affected components/tasks]
**Recorded in**: STATE.md

---
```

**✔️ TASK Complete**

```
✔️ TASK-NNN COMPLETE

**Task**: [Task name]
**Files changed**: [Key files]
**Logged in**: WORK.md
**Next**: TASK-NNN ([Next task name])

---
```

**🧪 HYPOTHESIS Validated/Invalidated**

```
🧪 HYPOTHESIS VALIDATED/INVALIDATED

**Hypothesis**: [What was tested]
**Result**: [Validated | Invalidated]
**Evidence**: [What was found]
**Next action**: [What this means for plan]

---
```

### Checkpoint Confirmation Format

When a checkpoint is resolved, explicitly confirm the transition:

```
✅ LOOP-007 resolved → DECISION-008 created
```

This makes state changes visible and traceable.

---

## Sticky Note Protocol

**At the end of EVERY turn**, include this status block **without exception**.

### Required Format

Use fenced block with `gsd-status` marker:

```gsd-status
📋 UPDATED: [artifact name] ([what changed])

CURRENT STATE:
- Phase: PHASE-NNN ([Phase name]) - [X/Y tasks complete]
- Task: TASK-NNN ([Task name]) - [Status]
- Active loops: [count] ([LOOP-001, LOOP-002, ...])

AVAILABLE ACTIONS:
📋 /continue | /pause | /status | /add-loop | /discuss
[Contextual actions if applicable]

NEXT: [What agent expects from user]
SELF-CHECK: agent has completed the following action
- [ ] STATE.md update
- [ ] WORK.md update
- [ ] INBOX.md update
- [ ] HISTORY.md update

---
📊 PROGRESS: PHASE-NNN [██████░░░░] 60% (3/5 tasks complete)
---
```

### Available Actions Menu

**Core actions (always present):**

- `/continue` - Resume work after checkpoint
- `/pause` - Save session state for later
- `/status` - Show current state
- `/add-loop` - Capture new loop
- `/discuss` - Fork to exploratory discussion

**Contextual actions (when relevant):**

- Loop-related: `/close-loop [ID]`, `/explore-loop [ID]`, `/defer-loop [ID]`
- Phase-related: `/complete-phase`, `/review-phase`
- Decision-related: `/make-decision`, `/defer-decision`

### Example with Systematic IDs

```gsd-status
📋 UPDATED: STATE.md (added LOOP-003), INBOX.md (captured password reset loop)

CURRENT STATE:
- Phase: PHASE-001 (Add User Authentication) - 1/3 tasks complete
- Task: TASK-002 (Create login endpoint) - In progress
- Active loops: 3 (LOOP-001, LOOP-002, LOOP-003)

AVAILABLE ACTIONS:
📋 /continue | /pause | /status | /add-loop | /discuss
Loop actions: /close-loop [ID] | /explore-loop [ID]

NEXT: Finish login endpoint implementation
SELF-CHECK: agent has completed the following action
- [x] STATE.md update
- [x] WORK.md update
- [ ] INBOX.md update (no loops found)
- [ ] HISTORY.md update (no promote workflow triggered)

---
📊 PROGRESS: PHASE-001 [██████░░░░] 60% (3/5 tasks complete)
---
```

### Progress Indicators

Progress indicators appear at the bottom of sticky note block:

```
---
📊 PROGRESS: PHASE-001 [██████░░░░] 60% (3/5 tasks complete)
---
```

This checkpoint system ensures both agent and user maintain shared understanding of current state.

---

## Common Pitfalls to Avoid

1. **Skipping sticky reminder** - End every turn with status block
2. **Expanding scope mid-phase** - Defer to INBOX, stay disciplined
3. **Keeping decisions in chat** - All decisions go to STATE.md
4. **Ignoring loops** - Capture immediately, don't let them pile up in chat
5. **Thin WORK.md logs** - Use Journalist Rule for key wins
6. **Forgetting self-check** - Prevent phantom updates

---

*Execution Workflow - Part of GSD-Lite Protocol v1.0*
