# GSD-Lite Protocol

[SYSTEM: GSD-LITE MODE ACTIVE]

## Session Start Checklist

When starting ANY session:
1. Read this PROTOCOL.md (you're doing it now)
2. Read STATE.md (current phase, task, decisions)
3. If resuming mid-task, also read WORK.md

**Single-Read Constraint:** Your agent can only read files at the first turn. This protocol must give you everything you need to operate correctly throughout the session.

---

## File Guide

| File | Purpose | When to Read | When to Write |
|------|---------|--------------|---------------|
| PROTOCOL.md | Session entrypoint | Always first | Never (immutable) |
| STATE.md | Phase/task tracker | Every session start | After decisions, phase changes |
| WORK.md | Verbose execution log | When resuming | Every action during execution |
| INBOX.md | Loop capture | When planning | When user OR agent discovers loop |
| HISTORY.md | Completed phases | For context | After phase promotion |

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

2. **Present the Moodboard**
   - Show visual boxes with emoji borders
   - Break down: Scope / Risk / Tasks
   - Get explicit confirmation before proceeding

3. **Wait for User Confirmation**
   - Never proceed to execution without "yes" or equivalent
   - Adjust based on user feedback

### Moodboard Format

```
🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯 PHASE MOODBOARD 🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯

┌─────────────────────────────────────────┐
│ 📦 SCOPE                                │
│ • Task 1: [description]                 │
│ • Task 2: [description]                 │
│ • Task 3: [description]                 │
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

**Example:**

```
🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯 PHASE MOODBOARD 🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯

┌─────────────────────────────────────────┐
│ 📦 SCOPE                                │
│ • Task 1: Add user authentication       │
│ • Task 2: Create login endpoint         │
│ • Task 3: Add JWT token generation      │
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

### WORK.md Logging

Every action gets logged with timestamp and context.

**Example:**

```markdown
### 2026-01-22 15:30 - Task 1: Add user authentication

**Action:** Created auth.ts file
**Files:** src/auth.ts
**Changes:**
- Added generateToken function
- Added validateToken function
- Imported jose library for JWT

**Status:** In progress
**Next:** Create login endpoint
```

---

## Loop Capture Protocol

Loops come from TWO sources:

1. **User:** Non-linear thinker, will ask questions mid-task
2. **Agent:** Discovers dependencies, concerns, future work

Both get captured immediately to INBOX.md.

### INBOX.md Format

```markdown
## Loop: [Brief Description]
**Source:** [User | Agent]
**Captured:** [Date]
**Context:** [Why this matters]
**Priority:** [High | Medium | Low]

### Details
[Full description of the loop/concern/future work]

### Next Action
[What needs to happen when this loop is addressed]
```

**Example:**

```markdown
## Loop: Add password reset flow
**Source:** User
**Captured:** 2026-01-22
**Context:** User asked mid-task: "What about password reset?"
**Priority:** Medium

### Details
Need to add password reset functionality with email verification.
Out of scope for current auth phase but important for production.

### Next Action
Create new phase after current auth phase completes
```

---

## Sticky Reminder

At the end of EVERY turn, include this status block:

```
📌 CURRENT STATUS 📌
Phase: [Phase name]
Task: [Current task] - [Status: In progress / Blocked / Complete]
Loops captured this turn: [Number, or "None"]
Next action: [What happens next]
```

**Example:**

```
📌 CURRENT STATUS 📌
Phase: Add User Authentication
Task: Create login endpoint - In progress
Loops captured this turn: 1 (password reset flow)
Next action: Finish login endpoint implementation
```

This sticky reminder ensures both agent and user maintain shared understanding of current state.

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

## Promotion Workflow

When a phase completes:

### Step 1: Promote
Extract key outcomes to external artifact:
- Write PR description from WORK.md
- Update documentation
- Create deployment notes

### Step 2: Record to HISTORY.md
Add one-line entry with completion date and outcome.

**HISTORY.md Format:**

```markdown
## [Date] - Phase: [Name]
**Outcome:** [One sentence summary]
**Artifact:** [Link to PR/doc/external artifact]
```

**Example:**

```markdown
## 2026-01-22 - Phase: Add User Authentication
**Outcome:** JWT-based authentication with login/logout endpoints
**Artifact:** PR #42 (merged)
```

### Step 3: Trim WORK.md
**Aggressive deletion.** The verbose log served its purpose during execution. Now it's promoted and can be removed.

Delete entire content of WORK.md.

### Step 4: Clear STATE.md
Update STATE.md to show no active phase. Ready for next phase.

**STATE.md After Promotion:**

```markdown
## Active Phase
None - Awaiting next phase planning

## Last Completed
Phase: Add User Authentication
Completed: 2026-01-22
Outcome: JWT-based auth (PR #42)
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
