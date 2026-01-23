# GSD-Lite Protocol

[SYSTEM: GSD-LITE MODE ACTIVE]

## Session Start Checklist

When starting ANY session, read the following files : 

1. Template PROTOCOL.md (you're doing it now). 
2. Immediately after reading this file, read all the following in **one function call** before continue to process user task :
    1. Other files in Template directory : INBOX.md, HISTORY.md, PROTOCOL.md, STATE.md, WORK.md (to load the protocol template to your memory)
    2. Read project (not in template dir) STATE.md (current phase, task, decisions)
    3. If resuming mid-task, also read WORK.md (also not in tempalte dir)

The instructions above ensure you have everything you need to operate correctly throughout the session.

### Understanding "Resume Mid-Task" in Chat Apps

**Scenario 1: Linear Session (same chat thread)**

Monday Session 1 (new chat):

- Do Task A, Task B
- Artifacts updated after each turn
- User says "let's continue tomorrow"
- This is NOT "resume mid-task" - just pausing linear session

Tuesday continuation (SAME chat):

- User says "let's continue"
- Agent has full chat history, just continues from last turn
- This is NOT "resume mid-task" - linear continuation

**Scenario 2: Resume Mid-Task (NEW chat thread)**

Tuesday Session 2 (NEW chat):

- User opens fresh chat, says "resume task B"
- Agent reads PROTOCOL.md + STATE.md + WORK.md
- STATE.md shows: "Current Task: TASK-002 (Task B) - In Progress"
- WORK.md shows: Latest log entry for Task B progress
- Agent reconstructs context from artifacts → THIS is "resume mid-task"

**Key insight:** "Resume mid-task" = starting NEW chat session with in-progress task state in artifacts.

**Session hierarchy example:**

```
Phase 1 ──┬── Session 1 (Chat A) ──┬── TASK-001 (Task A) ✓
          │                         └── TASK-002 (Task B) [partial]
          ├── Session 2 (Chat B) ──┬── TASK-002 (Task B continued) ✓
          │                         └── TASK-003 (Task C) ✓
          └── Session 3 (Chat C) ──── TASK-004 (Task D) ✓
```

**Artifact update timing:**

- STATE.md and WORK.md: Updated after EVERY turn (agent's response)
- User never manually updates - agent writes after each response
- At session wrap-up: Agent updates STATE.md with session end marker

---

## File Guide

| File        | Purpose               | When to Read        | When to Write                     | Write target        | Reference target (DO NOT WRITE TO THIS) |
| ----------- | --------------------- | ------------------- | --------------------------------- | ------------------- | ------------------ |
| PROTOCOL.md | Session entrypoint    | Always first        | Never (immutable)                 | n/a                 | gsd_lite/template/PROTOCOL.md                    |
| STATE.md    | Phase/task tracker    | Every session start | After EVERY turn                  | gsd_lite/STATE.md   | gsd_lite/template/STATE.md                    |
| WORK.md     | Verbose execution log | When resuming       | After EVERY turn during execution | gsd_lite/WORK.md    | gsd_lite/template/WORK.md                    |
| INBOX.md    | Loop capture          | When planning       | When user OR agent discovers loop | gsd_lite/INBOX.md   | gsd_lite/template/INBOX.md                    |
| HISTORY.md  | Completed phases      | For context         | After phase promotion             | gsd_lite/HISTORY.md | gsd_lite/template/HISTORY.md                    |

**Artifact lifecycle clarification:**

- STATE.md and WORK.md are updated frequently (after every agent response)
- This ensures artifacts are always current when new session starts
- No risk of "forgetting" - protocol enforces update every turn via sticky reminder

---

## Systematic ID Format

**ALL items get unique IDs in TYPE-NNN format** (zero-padded, globally unique).

### ID Types

| Type         | Examples                   | Scope                | Used In              |
| ------------ | -------------------------- | -------------------- | -------------------- |
| PHASE-NNN    | PHASE-001, PHASE-002       | Phases in project    | STATE.md, HISTORY.md |
| TASK-NNN     | TASK-001, TASK-003         | Tasks within phases  | STATE.md, WORK.md    |
| LOOP-NNN     | LOOP-007, LOOP-012         | Open questions/loops | INBOX.md, STATE.md   |
| DECISION-NNN | DECISION-008, DECISION-015 | Key decisions made   | STATE.md             |

### Why Systematic IDs

1. **Quick lookup:** User can prompt "discuss LOOP-007" or "continue TASK-003"
2. **Greppable:** `grep LOOP-007 *` finds all references across artifacts
3. **Unambiguous:** No confusion about which item being referenced
4. **Global unique:** IDs never repeat, even after resolution

### ID Assignment Rules

- **Sequential numbering:** Increment by 1 for each new item
- **Zero-padded:** Always three digits (001, 002, 003, ...)
- **Never reuse:** Once assigned, ID is permanent (even after item closed)
- **Registry:** STATE.md tracks current counters for each type

### Example References

**In STATE.md:**

```markdown
## Current Task
**Task:** TASK-003 - Add user authentication
**Status:** In Progress

## Key Decisions Made
| ID | Date | Decision | Why |
|----|------|----------|-----|
| DECISION-001 | 2026-01-22 | Use JWT tokens | Stateless auth preferred |
```

**In INBOX.md:**

```markdown
## From User
| ID | Date | Loop | Status |
|----|------|------|--------|
| LOOP-001 | 2026-01-22 | Password reset flow | Open |
```

**In WORK.md:**

```markdown
**[2026-01-22 15:30]** - TASK-003: Create auth.ts
- Captured LOOP-002: Token expiry strategy unclear
```

**In user prompts:**

- "What's the status of LOOP-007?"
- "Resume TASK-003"
- "Why did we make DECISION-008?"

---

## Golden Rules

These are non-negotiable principles from the GSD-Lite manifesto:

1. **No Ghost Decisions:** If a decision isn't in STATE.md, it didn't happen
2. **Interview First:** Never execute without understanding scope
3. **Visual Interrupts:** Use 10x emoji banners for critical questions to arrest attention

---

## Planning Mode

🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯 PLANNING MODE 🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯

**DO NOT SKIP THE MOODBOARD.** The visual banner is required for every new phase.

### Planning Steps

1. **Interview the User**

   - What's the goal?
   - What's the scope boundary?
   - How do we verify success?
1. **Present the Moodboard**

   - Show visual boxes with emoji borders
   - Break down: Scope / Risk / Tasks
   - Get explicit confirmation before proceeding
1. **Wait for User Confirmation**

   - Never proceed to execution without "yes" or equivalent
   - Adjust based on user feedback

### Moodboard Format (with systematic IDs)

```
🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯 PHASE-NNN MOODBOARD 🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯

PHASE-NNN: [Phase Name]

┌─────────────────────────────────────────┐
│ 📦 SCOPE                                │
│ • TASK-NNN: [description]               │
│ • TASK-NNN: [description]               │
│ • TASK-NNN: [description]               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ⚠️  RISK                                 │
│ • [Risk item 1]                         │
│ • [Risk item 2]                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✅ VERIFICATION                         │
│ • [How to verify success]               │
└─────────────────────────────────────────┘

👉 YOUR TURN: Type "yes" to proceed or adjust scope
```

**Example with systematic IDs:**

```
🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯 PHASE-001 MOODBOARD 🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯

PHASE-001: Add User Authentication

┌─────────────────────────────────────────┐
│ 📦 SCOPE                                │
│ • TASK-001: Add user authentication     │
│ • TASK-002: Create login endpoint       │
│ • TASK-003: Add JWT token generation    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ⚠️  RISK                                 │
│ • Security: Token expiry strategy TBD   │
│ • Breaking: Existing users need migrate │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✅ VERIFICATION                         │
│ • Login with test user returns 200      │
│ • Token validates correctly             │
└─────────────────────────────────────────┘

👉 YOUR TURN: Type "yes" to proceed or adjust scope
```

---

## Execution Mode

During execution:

1. **Log EVERY action to WORK.md** (verbose logging)
2. **Capture loops immediately to INBOX.md** (no parking lot in chat)
3. **Never expand scope mid-phase** - defer to INBOX

### WORK.md Logging (with systematic IDs)

Every action gets logged with timestamp, systematic IDs, and context.

**Example with systematic IDs:**

```markdown
### 2026-01-22 15:30 - TASK-001: Add user authentication

**Action:** Created auth.ts file
**Files:** src/auth.ts
**Changes:**
- Added generateToken function
- Added validateToken function
- Imported jose library for JWT

**Decisions:** DECISION-001 (Use JWT tokens for stateless auth)
**Loops captured:** LOOP-001 (Token expiry strategy unclear)
**Status:** In progress
**Next:** TASK-002 (Create login endpoint)
```

---

## Loop Capture Protocol

Loops come from TWO sources:

1. **User:** Non-linear thinker, will ask questions mid-task
2. **Agent:** Discovers dependencies, concerns, future work

Both get captured immediately to INBOX.md.

### INBOX.md Format (with systematic IDs)

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

**Example with systematic ID:**

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

## Sticky Reminder

**At the end of EVERY turn**, include this status block with systematic IDs **without exception**.

#### Progress Indicators

Progress indicators appear at the bottom of sticky note block

```

────────────────────────────────────────────────────────
📊 PROGRESS: PHASE-001 [██████░░░░] 60% (3/5 tasks complete)
────────────────────────────────────────────────────────
```

This checkpoint system ensures both agent and user maintain shared understanding of current state with systematic IDs for quick lookup.

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
SELF-CHECK : agent has completed the following action
- [ ] STATE.md update
- [ ] WORK.md update
- [ ] INBOX.md update
- [ ] HISTORY.md update

────────────────────────────────────────────────────────
📊 PROGRESS: n/a Phase not started
────────────────────────────────────────────────────────
```

### Available Actions Menu

**Core actions (always present):**

- `/continue` - Resume work after checkpoint
- `/pause` - Save session state for later
- `/status` - Show current state
- `/add-loop` - Capture new loop
- `/discuss` - Fork to exploratory discussion

**Contextual actions (when relevant):**

- Plan-related: `/approve-plan`, `/reject-plan`, `/edit-plan`
- Loop-related: `/close-loop [ID]`, `/explore-loop [ID]`, `/defer-loop [ID]`
- Phase-related: `/complete-phase`, `/skip-to-phase [N]`, `/review-phase`
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
SELF-CHECK : agent has completed the following action
- [x] STATE.md update
- [x] WORK.md update
- [ ] INBOX.md update (no loops found)
- [ ] HISTORY.md update (no promote workflow triggered)

────────────────────────────────────────────────────────
📊 PROGRESS: PHASE-001 [██████░░░░] 60% (3/5 tasks complete)
────────────────────────────────────────────────────────

```

### Checkpoint Emoji Banners

Checkpoints use distinct emoji banners for different event types. All checkpoints receive the same visual treatment (7+ emojis) to arrest attention.

#### Blocking Checkpoints

When user verification or decision is required:

**Format:**

```
🛑🛑🛑🛑🛑🛑🛑 BLOCKING: [Type of verification/decision] 🛑🛑🛑🛑🛑🛑🛑

**What**: [What was built/discovered/needs decision]

**Context**: [Why this matters]

**How to verify** OR **Options**:
[Numbered steps for verification OR options with pros/cons]

────────────────────────────────────────────────────────
→ YOUR ACTION: [Explicit instruction - "Type 'approved'" or "Select 1, 2, or 3"]
────────────────────────────────────────────────────────
```

**Use blocking checkpoints for:**

- User needs to verify visual output (dashboard layout, UI behavior)
- User needs to make architectural decision (library choice, data model)
- User needs to provide credentials (authentication gates)
- User needs to test functionality (manual testing required)

#### Informational Checkpoints

For progress updates and state changes that don't require immediate action:

**🔄 LOOP Captured**

```
🔄LOOP-NNN CAPTURED

**Loop**: [Brief description]
**Source**: [User | Agent]
**Priority**: [High | Medium | Low]
**Added to**: INBOX.md

────────────────────────────────────────────────────────
```

**✅ DECISION Made**

```
✅ DECISION-NNN MADE

**Decision**: [What was decided]
**Rationale**: [Why this choice]
**Impact**: [Affected components/tasks]
**Recorded in**: STATE.md

────────────────────────────────────────────────────────
```

**🏁 PHASE Complete**

```
🏁 PHASE-NNN COMPLETE

**Phase**: [Phase name]
**Outcome**: [One sentence summary]
**Tasks completed**: [N/N]
**Promoted to**: [PR/doc/artifact]

────────────────────────────────────────────────────────
```

**🧪 HYPOTHESIS Validated/Invalidated**

```
🧪 HYPOTHESIS VALIDATED/INVALIDATED

**Hypothesis**: [What was tested]
**Result**: [Validated | Invalidated]
**Evidence**: [What was found]
**Next action**: [What this means for plan]

────────────────────────────────────────────────────────
```

**📋 PLAN Ready**

```
📋 PLAN READY

**Phase**: PHASE-NNN
**Tasks**: [N tasks defined]
**Review**: [Link to moodboard/plan]

────────────────────────────────────────────────────────
→ YOUR ACTION: Type "yes" to proceed or adjust scope
────────────────────────────────────────────────────────
```

**✔️ TASK Complete**

```
✔️ TASK-NNN COMPLETE

**Task**: [Task name]
**Files changed**: [Key files]
**Logged in**: WORK.md
**Next**: TASK-NNN ([Next task name])

────────────────────────────────────────────────────────
```

#### Checkpoint Confirmation Format

When a checkpoint is resolved, explicitly confirm the transition:

```
✅ LOOP-007 resolved → DECISION-008 created
```

This makes state changes visible and traceable.

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

---

## Phase Definition and Completion

### What is a Phase?

A **phase** is a logical unit of work agreed upon between user and agent during planning mode.

**Characteristics:**

- Has clear goal (visible in moodboard)
- Has defined scope (tasks in moodboard)
- Has verification criteria (in moodboard)
- Gets unique ID: PHASE-NNN

**Example phases:**

- PHASE-001: Add user authentication (3 tasks)
- PHASE-002: Implement password reset flow (2 tasks)
- PHASE-003: Add user profile page (4 tasks)

### Phase Lifecycle

```
Planning → Moodboard → User confirms → Execution → User requests completion → Promotion
```

### Phase Completion Protocol

**CRITICAL: Phase completion is USER-CONTROLLED, not agent-decided.**

**Agent role:**

- Execute tasks in scope
- Update WORK.md after every turn
- Show progress in sticky reminder
- When all tasks done: Signal completion readiness

**User role:**

- Decide WHEN to complete phase (may want to review, test, adjust)
- Explicitly request phase promotion: "complete this phase" or "promote phase"
- User controls timing of WORK.md trimming (prevents permanent data loss)

**Why user controls completion:**

- Promotion workflow trims WORK.md (deletes verbose log)
- If agent auto-promotes, material for distributed artifacts is FOREVER LOST
- User may need time to extract outcomes, write PR description, review logs
- Agent doesn't know if user wants to pause, review, or test before promotion

**Phase completion signal from agent:**

```
🔮🔮🔮 PHASE READY FOR COMPLETION 🔮🔮🔮

All tasks in scope complete:
✓ TASK-001: Add user authentication
✓ TASK-002: Create login endpoint
✓ TASK-003: Add JWT token generation

WORK.md contains full execution log (ready for promotion).

👉 YOUR TURN: Type "complete phase" to promote, or continue working
```

**User then decides:** "complete phase" (triggers promotion) OR "let's add one more thing" (continues execution)

### Sticky Note with Phase Progress

Every sticky reminder shows phase completion progress:

```
📌 CURRENT STATUS 📌
Phase: PHASE-001 (Add User Authentication) - 2/3 tasks complete
Task: TASK-003 (Add JWT token generation) - In progress
Loops captured this turn: None
Next action: Finish TASK-003, then signal phase ready
```

---

## Promotion Workflow

When USER requests phase completion:

### Step 1: Promote

Extract key outcomes to external artifact:

- Write PR description from WORK.md
- Update documentation
- Create deployment notes

### Step 2: Record to HISTORY.md

Add one-line entry with systematic ID, completion date, and outcome.

**HISTORY.md Format (with systematic IDs):**

```markdown
## PHASE-NNN: [Name]
**Completed:** [Date]
**Outcome:** [One sentence summary]
**Artifact:** [Link to PR/doc/external artifact]
```

**Example with systematic ID:**

```markdown
## PHASE-001: Add User Authentication
**Completed:** 2026-01-22
**Outcome:** JWT-based authentication with login/logout endpoints
**Artifact:** PR #42 (merged)
```

### Step 3: Trim WORK.md

**Aggressive deletion.** The verbose log served its purpose during execution. Now it's promoted and can be removed.

Delete entire content of WORK.md.

### Step 4: Clear STATE.md

Update STATE.md to show no active phase. Ready for next phase.

**STATE.md After Promotion (with systematic IDs):**

```markdown
## Active Phase
None - Awaiting next phase planning

## Last Completed
Phase: PHASE-001 (Add User Authentication)
Completed: 2026-01-22
Outcome: JWT-based auth (PR #42)

## ID Registry
**Next IDs:** PHASE-002, TASK-004, LOOP-005, DECISION-003
```

---

## Artifact Lifecycle Summary

```
┌──────────────┐
│  Planning    │ → Moodboard → User confirms
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Execution   │ → Verbose WORK.md logging
└──────┬───────┘       → Capture loops to INBOX.md
       │
       ▼
┌──────────────┐
│  Promotion   │ → Extract to PR/doc
└──────┬───────┘       → Record to HISTORY.md
       │              → Delete WORK.md
       ▼
┌──────────────┐
│  Complete    │ → STATE.md cleared
└──────────────┘       → Ready for next phase
```

---

## Common Pitfalls to Avoid

1. **Skipping the moodboard** - Never proceed without visual confirmation
2. **Keeping decisions in chat** - All decisions go to STATE.md
3. **Ignoring loops** - Capture immediately, don't let them pile up in chat
4. **Expanding scope mid-phase** - Defer to INBOX, stay disciplined
5. **Forgetting sticky reminder** - End every turn with status block
6. **Not promoting** - WORK.md must be trimmed after phase completion

---

## Quick Reference Card

**Starting Session?**

→ Read PROTOCOL.md → Read STATE.md → (Read WORK.md if resuming)

**New Phase?**

→ Interview → Moodboard → Confirmation → Execute

**During Execution?**

→ Log to WORK.md → Capture loops to INBOX.md → Sticky reminder every turn

**Phase Complete?**

→ Promote to PR/doc → Record to HISTORY.md → Trim WORK.md → Clear STATE.md

---

*Protocol Version: 1.0 (2026-01-22)*

*GSD-Lite: Comprehensive TODO list, not documentation repository*