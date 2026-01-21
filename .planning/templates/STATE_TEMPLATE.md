---
version: 1.0
updated: 2026-01-21
purpose: Session working memory template for tracking current context, active loops, and available actions
---

# Session State Template

## Purpose

STATE.md is your **session working memory** - the single source of truth for "where are we right now?" It answers:
- What phase/task are we working on?
- What loops are active (open questions)?
- What's our token budget status?
- What can the user do next?
- What's the context stack if we forked into a discussion?

**Why STATE.md exists:**
- **Single source of truth:** All current context in one place, not scattered across chat history
- **Recovery from context drift:** Agent can read STATE.md to reset protocol discipline
- **Session resumption:** Pick up exactly where you left off, even after interruption
- **Audit trail:** Recent updates section shows what changed and when
- **Cognitive offload:** User doesn't need to remember what's active - STATE.md tracks it

This template provides structure for maintaining session state across single-session and multi-session work.

## When to Update

**Agent must update STATE.md:**
- After every turn where state changes (new loop, phase transition, task completion)
- When forking into discussion or non-linear exploration
- When crossing token budget thresholds
- When closing loops or making decisions
- Before checkpoints (show current state for user verification)

**Frequency:** Minimum once per turn if anything changed. More frequently if multiple state transitions in single turn.

**Recovery protocol:** If agent forgets to update, user prompts "update artifacts" and agent reads current STATE.md, identifies drift, updates to current reality.

## Structure Sections

### 1. Current Context

**What:** The immediate work being done RIGHT NOW
**Why:** Answers "where were we?" after interruption or context drift

**Elements:**
- **Phase:** Which phase of the project (from ROADMAP.md or project plan)
- **Task:** Current task ID and name (if applicable)
- **Focus:** One-sentence description of current goal
- **Status:** Working | Blocked | Awaiting Input | Discussion Mode

**Example:**
```markdown
## Current Context

**Phase:** 1. Foundation & Templates
**Task:** TASK-003 - Create CONTEXT_TEMPLATE.md
**Focus:** Define token budget thresholds and progressive loading strategy
**Status:** Working
```

### 2. Active Loops

**What:** List of open LOOP-NNN IDs with brief titles
**Why:** Quick reference to what questions are parking lot vs being explored

**Format:** Table with columns: ID, Title, Status, Captured
**Link to:** LOOPS.md (full loop details)

**Example:**
```markdown
## Active Loops

| ID | Title | Status | Captured |
|----|-------|--------|----------|
| LOOP-007 | Validate CB invoice mixed-type assumption | clarifying | 2026-01-21 |
| LOOP-012 | Determine lineage scope for dim_customers | open | 2026-01-21 |
| LOOP-018 | Root cause of unique_test failure | open | 2026-01-21 |

**Total active:** 3 loops (1 clarifying, 2 open)

See LOOPS.md for full details.
```

### 3. Token Budget Snapshot

**What:** Current token budget status from CONTEXT.md
**Why:** Visibility into whether we're in safe zone or approaching thresholds

**Elements:**
- Used / Total tokens
- Percentage
- Threshold phase (comfortable/deliberate/warning/stop)
- Quick status indicator (emoji)

**Example:**
```markdown
## Token Budget

**Status:** 1850 / 5000 tokens (37%) - deliberate
**Phase:** 🟡 Deliberate zone (20-40%)
**Strategy:** Focused loading, justify additions

- 0-20% 🟢 Comfortable (exploratory)
- 20-40% 🟡 Deliberate (focused) ← YOU ARE HERE
- 40-50% 🟠 Warning (reduce context)
- 50%+ 🔴 Stop (must exclude)

See CONTEXT.md for full breakdown.
```

### 4. Available Actions

**What:** Context-sensitive menu of what user can do next
**Why:** Reduces cognitive load - user always knows options without guessing

**Structure:**
- **Core actions:** Always present (/continue, /pause, /status, /add-loop, /discuss)
- **Contextual actions:** Vary based on current state (plan approval, loop closure, phase completion)

**Format:** Slash commands (familiar from Slack/Discord/VS Code)

**Example:**
```markdown
## Available Actions

**Core:**
- `/continue` - Continue current task
- `/pause` - Pause and save state for later
- `/status` - Show full status (loops, budget, recent updates)
- `/add-loop [description]` - Capture new open question
- `/discuss [topic]` - Fork into discussion mode

**Contextual (current task):**
- `/complete-task` - Mark current task complete and move to next
- `/close-loop [ID]` - Mark loop resolved with outcome

**Type action or respond directly**
```

### 5. Context Stack

**What:** Current activity and return-to location if forked
**Why:** Support non-linear reasoning (user asks tangent question, agent tracks where to return)

**Structure:**
- **Current:** What's happening right now
- **Return to:** Where to go back to after current activity
- **Depth:** How deep in the stack (limit 1 level - no nested forks)

**Example - Working:**
```markdown
## Context Stack

**Current:** TASK-003 (Create CONTEXT_TEMPLATE.md)
**Return to:** None (not forked)
**Depth:** 0
```

**Example - Forked into discussion:**
```markdown
## Context Stack

**Current:** /discuss token budget thresholds
**Return to:** TASK-003 (Create CONTEXT_TEMPLATE.md)
**Depth:** 1

*Discussion: User asked why 50% is red line - exploring quality degradation research*
```

### 6. Recent Updates

**What:** Last 3-5 artifact updates with timestamps
**Why:** Audit trail of what changed, when, and why

**Format:** Chronological list (newest first) with timestamp, artifact, and change description

**Example:**
```markdown
## Recent Updates

**2026-01-21 15:45**
- Updated CONTEXT.md: Crossed into warning zone (44%), excluded stg_customers.sql and reports/**, returned to deliberate zone (34%)

**2026-01-21 15:30**
- Added LOOP-012 to LOOPS.md: Determine lineage scope for dim_customers refactor

**2026-01-21 15:15**
- Updated STATE.md: Changed focus from TASK-002 to TASK-003, marked TASK-002 complete

**2026-01-21 15:00**
- Closed LOOP-007 in LOOPS.md: Validated no mixed invoice types, created DECISION-008

**2026-01-21 14:45**
- Added LOOP-007 to LOOPS.md: Validate Chargebee invoice mixed-type assumption
```

## Available Actions Menu

### Core Actions (Always Present)

**`/continue`**
- Continue working on current task
- Agent proceeds with execution
- Use when: Ready to move forward

**`/pause`**
- Pause current session and save state
- Creates .continue-here.md with resumption context
- Use when: Need to step away, end session

**`/status`**
- Show full status report (all sections of STATE.md)
- Includes loops, budget, recent updates, context stack
- Use when: Lost track of where things are

**`/add-loop [description]`**
- Capture new open question or parking lot idea
- Agent drafts loop in XML format, presents for approval
- Use when: New question arises mid-task

**`/discuss [topic]`**
- Fork into discussion mode
- Agent tracks return-to point in context stack
- Use when: Need to explore tangent without losing current task

### Contextual Actions (Vary by State)

**Plan-related:**
- `/approve-plan` - Approve proposed plan, proceed to execution
- `/reject-plan` - Reject plan, request revisions
- `/edit-plan [changes]` - Request specific plan modifications

**Loop-related:**
- `/close-loop [ID]` - Mark loop resolved, document outcome
- `/explore-loop [ID]` - Change loop status to clarifying, start investigation

**Phase-related:**
- `/complete-phase` - Mark current phase complete, move to next
- `/skip-to-phase [N]` - Jump to specific phase (if non-linear work)

**Task-related:**
- `/complete-task` - Mark current task done, move to next
- `/skip-task` - Skip current task with rationale

### Return Behavior After Fork

When user forks with `/discuss`:

1. **Agent updates context stack:**
```markdown
## Context Stack
**Current:** /discuss token budget research
**Return to:** TASK-003 (Create CONTEXT_TEMPLATE.md)
**Depth:** 1
```

2. **Agent conducts discussion** (tangent exploration)

3. **Agent prompts before returning:**
```markdown
Discussion complete. Key points:
- [Summary of discussion]

Ready to return to TASK-003 (Create CONTEXT_TEMPLATE.md)?
Type /return or /continue
```

4. **User confirms** → Agent restores context stack, updates STATE.md

**Nesting limit:** Single level only - one fork at a time. If user tries to `/discuss` while already in discussion, agent warns: "Already in discussion mode (depth 1). Complete current discussion before forking again."

## Examples

### Example 1: Mid-Task State

**Scenario:** Working on Task 3, one loop clarifying, two loops open, budget in deliberate zone.

```markdown
---
version: 1.0
updated: 2026-01-21T15:45:00Z
session: 2026-01-21-foundation-templates
---

# Session State: Foundation & Templates

## Current Context

**Phase:** 1. Foundation & Templates
**Task:** TASK-003 - Create CONTEXT_TEMPLATE.md
**Focus:** Documenting token budget thresholds and progressive loading strategy
**Status:** Working

## Active Loops

| ID | Title | Status | Captured |
|----|-------|--------|----------|
| LOOP-007 | Validate CB invoice mixed-type assumption | clarifying | 2026-01-21 14:45 |
| LOOP-012 | Determine lineage scope for dim_customers | open | 2026-01-21 15:30 |
| LOOP-018 | Root cause of unique_test failure | open | 2026-01-21 15:35 |

**Total active:** 3 loops (1 clarifying, 2 open)

See LOOPS.md for full details.

## Token Budget

**Status:** 1850 / 5000 tokens (37%) - deliberate
**Phase:** 🟡 Deliberate zone (20-40%)
**Strategy:** Focused loading, justify additions

- 0-20% 🟢 Comfortable (exploratory)
- 20-40% 🟡 Deliberate (focused) ← YOU ARE HERE
- 40-50% 🟠 Warning (reduce context)
- 50%+ 🔴 Stop (must exclude)

See CONTEXT.md for full breakdown.

## Available Actions

**Core:**
- `/continue` - Continue working on TASK-003
- `/pause` - Pause session and save state
- `/status` - Show full status report
- `/add-loop [description]` - Capture new question
- `/discuss [topic]` - Fork into discussion

**Contextual:**
- `/complete-task` - Mark TASK-003 complete
- `/close-loop [ID]` - Mark loop 007/012/018 resolved
- `/explore-loop [ID]` - Investigate loop 012 or 018

**Type action or respond directly**

## Context Stack

**Current:** TASK-003 (Create CONTEXT_TEMPLATE.md)
**Return to:** None (not forked)
**Depth:** 0

## Recent Updates

**2026-01-21 15:45**
- Updated CONTEXT.md: Crossed into warning zone (44%), excluded stg_customers.sql and reports/**, returned to deliberate zone (34%)

**2026-01-21 15:35**
- Added LOOP-018 to LOOPS.md: Root cause of unique_test failure in stg_orders

**2026-01-21 15:30**
- Added LOOP-012 to LOOPS.md: Determine lineage scope for dim_customers refactor

**2026-01-21 15:00**
- Closed LOOP-007 in LOOPS.md: Validated no mixed invoice types, created DECISION-008

**2026-01-21 14:45**
- Added LOOP-007 to LOOPS.md: Validate Chargebee invoice mixed-type assumption
```

### Example 2: Checkpoint State (Awaiting Approval)

**Scenario:** Plan ready for approval, blocked waiting for user input.

```markdown
---
version: 1.0
updated: 2026-01-21T16:20:00Z
session: 2026-01-21-phase2-planning
---

# Session State: Phase 2 Planning

## Current Context

**Phase:** 2. Session Handoff System (Planning)
**Task:** PLAN-005 - Draft session handoff approach
**Focus:** Waiting for user approval of proposed plan
**Status:** Blocked (Awaiting Approval)

## Active Loops

| ID | Title | Status | Captured |
|----|-------|--------|----------|
| LOOP-024 | Clarify ephemeral vs persistent loop storage | clarifying | 2026-01-21 16:10 |

**Total active:** 1 loop (clarifying)

See LOOPS.md for full details.

## Token Budget

**Status:** 2250 / 5000 tokens (45%) - warning
**Phase:** 🟠 Warning zone (40-50%)
**Strategy:** Avoid loading more, seek exclusions

- 0-20% 🟢 Comfortable (exploratory)
- 20-40% 🟡 Deliberate (focused)
- 40-50% 🟠 Warning (reduce context) ← YOU ARE HERE
- 50%+ 🔴 Stop (must exclude)

See CONTEXT.md for full breakdown.

## Available Actions

**Core:**
- `/status` - Show full status report
- `/pause` - Pause and save state
- `/discuss [topic]` - Fork into discussion

**Contextual (plan approval):**
- `/approve-plan` - Approve PLAN-005, proceed to execution
- `/reject-plan` - Reject plan, request revisions
- `/edit-plan [changes]` - Request specific modifications

**AWAITING: Approve, reject, or edit PLAN-005**

## Context Stack

**Current:** PLAN-005 approval checkpoint
**Return to:** None (checkpoint is primary context)
**Depth:** 0

## Recent Updates

**2026-01-21 16:20**
- Presented PLAN-005 for approval: Session handoff approach with ephemeral loop storage

**2026-01-21 16:10**
- Added LOOP-024 to LOOPS.md: Clarify ephemeral vs persistent loop storage

**2026-01-21 16:00**
- Started TASK-011: Draft phase 2 plan

**2026-01-21 15:50**
- Completed TASK-010: Review phase 1 artifacts
```

## Educational Notes

### Why Single File (Not Scattered Context)

**Problem with scattered state:**
```
Turn 5: "We have 3 open loops"
Turn 12: "Token budget at 42%"
Turn 18: "Working on TASK-003"
Turn 25: User asks "What's our current state?"
Agent: Must reconstruct from chat history (error-prone)
```

**Solution with STATE.md:**
```markdown
STATE.md always contains:
- Current phase and task (no reconstruction needed)
- Active loop count and IDs (quick reference)
- Token budget status (immediate visibility)
- Available actions (user always knows options)
- Recent updates (audit trail)

Agent reads STATE.md → accurate state in 1 read
```

### Why Available Actions Menu

**Problem without menu:**
User completes task, doesn't know what to do next:
- "Continue" → But to what?
- "Approve" → Approve what?
- "Close loop" → Which loop? How?

**Solution with contextual actions:**
STATE.md shows exactly what's possible:
- Core actions always visible (continue/pause/status)
- Contextual actions reflect current state (approve plan, close loop 007)
- Format familiar (slash commands like Slack/Discord)
- User cognitive load reduced (options explicit, not guessed)

### Why Context Stack

**Problem with linear-only:**
```
User: "Explain why 50% is red line"
Agent: [Long explanation]
User: "OK, back to the task"
Agent: "Which task?" (Context lost)
```

**Solution with context stack:**
```markdown
User: /discuss token budget research
Agent updates STATE.md:
  Current: /discuss token budget research
  Return to: TASK-003
  Depth: 1

[Discussion happens]

Agent: Discussion complete. Ready to return to TASK-003?
User: /return
Agent restores: TASK-003 as current context
```

**Why limit depth:**
Nesting discussions creates confusion:
- Depth 0: Normal work
- Depth 1: One tangent (manageable)
- Depth 2+: Lost track of primary goal (cognitive overload)

### Why Recent Updates Audit Trail

**Problem without trail:**
- User: "Did we close LOOP-007?"
- Agent must search chat history or check LOOPS.md
- No timestamp context (when did state change?)
- No reason context (why did we close it?)

**Solution with audit trail:**
Recent Updates shows last 5 changes:
- What changed (closed LOOP-007)
- When (2026-01-21 15:00)
- Why (validated no mixed invoice types)
- Related (created DECISION-008)

**Benefits:**
- Quick verification without reading full chat history
- Timestamp context for session continuity
- Causality chain (loop → decision) visible
- New session can read updates to understand recent work

## Recovery Protocol

**When protocol drifts** (agent stops updating STATE.md):

### User Prompt

```
update artifacts
```

### Agent Action

1. **Read current STATE.md** to see last known state
2. **Review recent chat** (last 5-10 turns) for changes
3. **Identify drift:**
   - New loops not captured
   - Task transitions not recorded
   - Token budget not updated
   - Available actions stale
4. **Update STATE.md** with current reality
5. **Show diff** in sticky note (what changed)
6. **Resume protocol discipline**

### Example Recovery

**STATE.md (stale):**
```markdown
Task: TASK-002
Active loops: 2
Budget: 1200/5000 (24%)
```

**Reality (after 10 turns):**
```markdown
Task: TASK-003 (transitioned 5 turns ago)
Active loops: 4 (added 2 new)
Budget: 2100/5000 (42%)
```

**Agent recovery:**
```markdown
📋 ARTIFACT UPDATE - Protocol Drift Detected

Synced STATE.md with current reality:

Changes:
- Task: TASK-002 → TASK-003 (completed 5 turns ago)
- Loops: 2 → 4 (added LOOP-012, LOOP-018)
- Budget: 24% → 42% (crossed into warning zone)
- Actions: Updated contextual actions for TASK-003

STATE.md now accurate. Resuming protocol discipline.
```

### Why Recovery Works

- **Agent can't "remember"** - LLM context window pushes early instructions out
- **STATE.md is stable** - File contents don't degrade over conversation
- **Single read resets** - Agent loads current state from artifact, not memory
- **Visual diff shows drift** - User sees what was missed, validates correction
- **Protocol reinforced** - Recovery act itself reminds agent to maintain discipline

## File Format

**Location:** `.project/sessions/YYYY-MM-DD-description/STATE.md` (ephemeral, per-session)

**Alternative:** `.gsd-lite/STATE.md` (persistent, project-wide)

**Structure:**
1. YAML frontmatter (version, updated timestamp, session identifier)
2. Current Context section (phase, task, focus, status)
3. Active Loops section (table with IDs, titles, statuses)
4. Token Budget section (snapshot with thresholds)
5. Available Actions section (core + contextual)
6. Context Stack section (current, return-to, depth)
7. Recent Updates section (last 5 changes with timestamps)

**Update frequency:** After every turn where state changed (minimum once per turn)

**Read frequency:**
- Agent: At start of turn (if protocol drift suspected)
- User: Anytime via `/status` command or direct file read

---

**Template version:** 1.0
**Created:** 2026-01-21
**For:** Data Engineering Copilot Patterns (learn_gsd project)
