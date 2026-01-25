# Revisit Workflow

[SYSTEM: REVISIT MODE - Post-Whiteboard Rethinking]

## Entry Conditions

- User requests "revisit" or "let me rethink this"
- MODE = whiteboard-complete (ready for execution but not yet executing)
- User has new ideas since original whiteboard session

## Exit Conditions

- Revised plan presented and user approves
- MODE transitions back to whiteboard-complete
- OR user decides original plan was correct (no changes needed)

---

## Coaching Philosophy

**User owns outcome, agent guides execution.**

### Governance Framework

| Decision Type | Owner | Agent Role | Example |
|---------------|-------|------------|---------|
| Vision/Outcome | User | Extract via questioning | "What should this feel like when done?" |
| Scope boundary | User | Clarify, redirect creep | "That's a new capability - note for roadmap?" |
| Implementation choice | User (if affects UX) | Present options with pros/cons | "Cards vs timeline layout?" |
| Technical detail | Agent | Auto-fix with deviation log | "Missing null check - adding" |
| Architectural change | User | Pause, present decision | "This requires new database table" |
| Critical security | Agent | Auto-fix immediately | "SQL injection risk - sanitizing input" |

**Key principle:**

The user knows:
- How they imagine it working
- What it should look/feel like
- What's essential vs nice-to-have
- Specific behaviors or references they have in mind

The user doesn't know (and shouldn't be asked):
- Codebase patterns (researcher reads the code)
- Technical risks (researcher identifies these)
- Implementation approach (planner figures this out)

---

## What is Revisit Mode?

**Revisit mode enables non-linear thinking after whiteboard completion.**

User returns with new ideas, second thoughts, or alternative approaches after originally approving a plan. This is NORMAL. Good planning doesn't happen linearly - you dream, plan, sleep on it, realize a better way, and circle back.

### When to Use Revisit

**User signals:**
- "Let me rethink this"
- "I had another idea about..."
- "Actually, what if we did X instead?"
- "Can we reconsider the approach?"

**Current state:**
- Plan exists (whiteboard-complete mode)
- User approved plan originally
- Execution hasn't started (or just started)

### What Revisit Enables

1. **Review current plan** - Agent shows existing PLAN.md state
2. **Capture new ideas** - User shares alternative thinking
3. **Identify changes** - Agent highlights what's different
4. **Revise plan** - Agent updates PLAN.md with new approach
5. **Return to whiteboard-complete** - User approves revised plan or confirms original

**Revisit stays in the planning layer.** You're reconsidering HOW to implement, not re-discovering WHAT you want.

---

## Revisit Protocol

When USER requests revisit or signals rethinking:

### Step 1: Review Current Plan

Present the existing plan to user as reference point.

**Agent response:**

```markdown
📚 CURRENT PLAN REVIEW

**PHASE-NNN: [Phase Name]**

**📦 SCOPE**
* TASK-001: [description]
* TASK-002: [description]
* TASK-003: [description]

**⚠️ RISK**
* [Risk item 1]
* [Risk item 2]

**✅ VERIFICATION**
* [How to verify success]

---

This was the approved plan. What would you like to rethink?
```

**Why this matters:** User needs to see current state before proposing changes. Prevents talking past each other.

### Step 2: Capture New Ideas

Listen to user's new thoughts and capture to WORK.md session log.

**User example:** "Actually, I think cards are better than timeline after all"

**Agent captures to WORK.md:**

```markdown
**[2026-01-25 16:30]** - [DECISION] Reconsidering layout approach
- Original decision: Timeline view (simpler, cleaner)
- New thinking: Card-based layout (more flexible, supports varying content)
- Rationale: User realized timeline constrains content types too much
- Impact: Affects TASK-002 (UI implementation) and TASK-003 (styling)
```

**Entry types during revisit:**
- `[DECISION]` - Reconsidering previous decision
- `[BLOCKER]` - New question emerged during rethinking
- `[PLAN]` - Adjusting task breakdown or approach

**Why this matters:** Fresh agents resuming after revisit need to understand why plan changed.

### Step 3: Identify What Changed

Compare new ideas vs original plan and highlight differences explicitly.

**Agent response format:**

```markdown
📊 CHANGE ANALYSIS

**What's changing:**

1. **Layout Approach**
   - Original: Timeline view
   - New: Card-based layout
   - Rationale: Timeline constrains content types, cards more flexible

2. **Task Affected: TASK-002**
   - Original scope: Build timeline component
   - New scope: Build card grid component
   - Effort change: Similar (no significant increase)

3. **Risk Update**
   - Removed: Timeline performance on large datasets
   - Added: Card layout responsive behavior across screen sizes

**What's staying the same:**
- Authentication flow (TASK-001)
- Data fetching approach (TASK-003)
- Overall phase goal

---

Proceed with these changes? Type "yes" to revise plan or "cancel" to keep original.
```

**Why this matters:** Explicit comparison prevents misunderstandings. User sees exactly what's changing vs staying constant.

### Step 4: Revise Plan (if needed)

If user approves changes, update PLAN.md or whiteboard notes with revised approach.

**Agent actions:**

1. **Update PLAN.md** - Modify affected tasks, risks, verification
2. **Preserve rationale in WORK.md** - Document why change made
3. **Update STATE.md Key Decisions table** - Record revision decision

**Example WORK.md entry:**

```markdown
**[2026-01-25 16:45]** - [DECISION] Revised PHASE-001 plan - switched to card layout
- Original plan: Timeline view (approved 2026-01-24)
- Revised plan: Card-based layout
- Rationale: User realized timeline too constraining after thinking overnight
- Affected tasks: TASK-002 (UI), TASK-003 (styling)
- Decision ID: DECISION-004
```

**Example STATE.md entry:**

```markdown
| ID | Date | Decision | Why |
|----|------|----------|-----|
| DECISION-004 | 2026-01-25 | Revised PHASE-001: Card layout instead of timeline | User rethinking after whiteboard - cards more flexible |
```

**If no changes needed:**

User might decide original plan was correct after all. That's valuable too.

**Agent response:**

```markdown
✅ Original plan confirmed

After review, you're sticking with the original approach. Recording this confirmation.

**WORK.md entry:**
- [DECISION] Confirmed original plan after revisit
- Considered alternative: Card layout
- Decision: Timeline view still best fit
- Rationale: Simpler implementation, meets requirements

Returning to whiteboard-complete mode. Ready to proceed with execution?
```

**Why this matters:** Confirmation is a decision too. Captures that user deliberately chose original approach after reconsidering.

### Step 5: Return to Whiteboard-Complete

Present revised plan (or confirmed original plan) and return to whiteboard-complete mode.

**Agent response:**

```markdown
📚📚📚📚📚📚📚📚📚📚 PHASE-001 WHITEBOARD (REVISED) 📚📚📚📚📚📚📚📚📚📚

**PHASE-001: Add User Authentication**

**📦 SCOPE**
* TASK-001: Add user authentication
* TASK-002: Create card-based dashboard [REVISED]
* TASK-003: Add card styling [REVISED]

**⚠️ RISK**
* Security: Token expiry strategy TBD
* UI: Card layout responsive behavior [NEW]

**✅ VERIFICATION**
* Login with test user returns 200
* Card grid displays correctly on mobile/desktop [REVISED]

👉 YOUR TURN: Type "yes" to proceed to execution or "revisit" to adjust again
```

**MODE status:** Still whiteboard-complete, ready for execution or another revisit round.

**Why this matters:** User can revisit multiple times before executing. Each iteration captured, nothing lost.

---

## Revisit vs Moodboard

**CRITICAL: Revisit is NOT moodboard. They serve different purposes.**

| Aspect | Revisit (this workflow) | Moodboard (separate workflow) |
|--------|------------------------|-------------------------------|
| **Entry point** | After whiteboard-complete | Start of new phase |
| **User signal** | "Let me rethink this" | "I want to build X" |
| **Assumption** | Vision already extracted | Vision needs extraction |
| **Layer** | Planning layer | Discovery layer |
| **Agent asks** | "What's changing in the plan?" | "What do you want to build?" |
| **Captures** | Plan revisions, alternative approaches | User vision, preferences, references |
| **Outputs** | Revised PLAN.md | Initial whiteboard |
| **MODE transition** | whiteboard-complete → revisit → whiteboard-complete | moodboard → whiteboard-complete |

### Key Difference

**Revisit assumes vision already extracted.** User already answered:
- What do you want to build?
- How should it feel?
- What's the success criteria?

**Revisit reconsiders HOW to implement**, not WHAT to build.

### Anti-Pattern: Looping Back to Moodboard

**What goes wrong:**

User says "let me rethink this" → Agent responds "What do you want to build?" → User frustrated because they already explained vision.

**Why it happens:**

Agent treats "rethink" as "restart discovery" instead of "reconsider approach."

**How to avoid:**

- Revisit = planning layer rethinking (tasks, approach, risks)
- Moodboard = discovery layer extraction (vision, feel, success criteria)
- If user wants to fundamentally change WHAT (not HOW), suggest moodboard restart explicitly

**Example (correct revisit):**

```
User: "Let me rethink the card layout"
Agent: "Current plan uses timeline view. What's your new thinking?"
```

**Example (incorrect - looping to moodboard):**

```
User: "Let me rethink the card layout"
Agent: "What do you want to build?" ❌ (vision already extracted)
```

**Warning signs:**
- Agent asking "what do you want?" questions during revisit
- User re-explaining vision they already shared in moodboard
- Revisit session feels like starting over

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

**Contextual actions (when relevant during revisit):**

- Revisit-related: `/approve-revision`, `/cancel-revisit`, `/compare-plans`
- Plan-related: `/show-original`, `/show-changes`, `/edit-plan`
- Loop-related: `/close-loop [ID]`, `/explore-loop [ID]`, `/defer-loop [ID]`
- Decision-related: `/make-decision`, `/defer-decision`

### Example Revisit Status

```gsd-status
📋 UPDATED: WORK.md (captured new decision - card layout preferred), PLAN.md (revised TASK-002 and TASK-003)

CURRENT STATE:
- Phase: PHASE-001 (Add User Authentication) - 0/3 tasks (plan revised, awaiting approval)
- Task: None (revisit mode, not executing)
- Active loops: 0

AVAILABLE ACTIONS:
📋 /approve-revision | /cancel-revisit | /show-original | /pause | /discuss
Revisit actions: /compare-plans (see original vs revised)

NEXT: Type "yes" to approve revised plan or "cancel" to revert to original
SELF-CHECK: agent has completed the following action
- [x] STATE.md update (DECISION-004 recorded)
- [x] WORK.md update (revision rationale captured)
- [ ] INBOX.md update (no loops during revisit)
- [ ] HISTORY.md update (no promotion yet)

---
📊 PROGRESS: n/a (Plan revision in progress)
---
```

### Progress Indicators

Progress indicators appear at the bottom of sticky note block:

```
---
📊 PROGRESS: PHASE-001 [██████░░░░] 60% (3/5 tasks complete)
---
```

During revisit mode (before execution), progress may show "n/a (Plan revision in progress)".

This checkpoint system ensures both agent and user maintain shared understanding of current state.

---

## Common Revisit Scenarios

### Scenario 1: User Sleeps On It, Changes Mind

```
Day 1 (whiteboard-complete):
  - User approves timeline layout
  - Agent ready to execute

Day 2 (user returns):
  User: "Actually, I want cards instead"
  Agent: Enters revisit mode
    - Reviews current plan (timeline)
    - Captures new thinking (cards)
    - Compares changes
    - Updates PLAN.md
    - Returns to whiteboard-complete
```

### Scenario 2: User Realizes Simpler Approach

```
User: "Wait, do we really need TASK-004? That seems overkill"
Agent: Enters revisit mode
  - Shows current scope (includes TASK-004)
  - Discusses user's concern
  - Removes TASK-004 if user confirms
  - Updates risks/verification
  - Presents revised whiteboard
```

### Scenario 3: User Wants to Compare Options

```
User: "Can we compare the card vs timeline approach?"
Agent: Presents comparison table
  - Card layout: Pros, cons, effort
  - Timeline layout: Pros, cons, effort
  - User chooses based on tradeoffs
  - Agent revises plan if different from original
```

### Scenario 4: User Confirms Original Plan After All

```
User: "Let me think about this again"
Agent: Enters revisit mode, reviews plan
User: "Actually, the original plan is fine"
Agent:
  - Records confirmation in WORK.md
  - Captures that alternatives were considered
  - Returns to whiteboard-complete
  - Ready to execute original plan
```

---

## Common Pitfalls to Avoid

1. **Looping back to moodboard instead of staying in planning layer** - Revisit reconsiders HOW (approach), not WHAT (vision). Don't ask "what do you want?" questions - user already answered those.

2. **Not capturing rationale for revised decisions** - WORK.md must show why plan changed. Future agents need context for the revision.

3. **Forgetting to update PLAN.md with changes** - Revised plan must be written down, not just discussed. Update artifacts, not just chat history.

4. **Treating revisit as failure** - Non-linear thinking is normal. Revisit is a feature, not a bug. Users should feel encouraged to rethink.

5. **Not preserving original plan context** - WORK.md should show both original decision (timeline) and revised decision (cards) with rationale for each. Don't lose the "why timeline was considered" context.

6. **Infinite revisit loops** - If user revisits multiple times without settling, suggest moodboard restart. May indicate vision isn't fully extracted yet.

---

*Revisit Workflow - Part of GSD-Lite Protocol v1.0*
