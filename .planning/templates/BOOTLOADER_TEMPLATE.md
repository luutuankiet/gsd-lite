---
version: 1.0
updated: 2026-01-21
purpose: Session initialization and protocol enforcement
template_type: bootloader
---

# BOOTLOADER Template

## Purpose

The BOOTLOADER template initializes your copilot session and embeds the protocol enforcement mechanism that keeps the agent disciplined throughout the conversation. This template solves the "protocol drift" problem where agents start following procedures but degrade after 10+ turns.

**What BOOTLOADER does:**
1. **Initialize session**: Check for existing artifacts (STATE.md, LOOPS.md, CONTEXT.md) - resume if present, create if not
2. **Load project context**: Import goals from PROJECT.md/ROADMAP.md, set current phase/task
3. **Embed protocol in every response**: Use sticky note template (see below) to enforce artifact updates, checkpoint visibility, and action menus

**Why this matters:** Single-agent environments (ChatGPT web UI, Gemini, Claude without MCP) have linear turn-by-turn conversation. Agents can't dynamically reference a long bootloader mid-session - context window pushes early instructions out of attention. Solution: Sticky note at response end acts as protocol reminder, visible every turn.

## Session Initialization Protocol

When starting a new session, the agent MUST:

### Step 1: Check for existing session artifacts

**If you have file access (MCP tools):**
```
Read these files directly:
- .project/sessions/[YYYY-MM-DD-description]/STATE.md
- .project/sessions/[YYYY-MM-DD-description]/LOOPS.md
- .project/sessions/[YYYY-MM-DD-description]/CONTEXT.md
```

**If copy-paste workflow:**
```
Ask user: "Please paste contents of STATE.md (or say 'new session' if starting fresh)"
```

### Step 2: Initialize or resume

**If artifacts exist** (resuming session):
- Read STATE.md to get current phase, active loops, last activity
- Read LOOPS.md to see open questions
- Read CONTEXT.md to understand token budget and loaded context
- Display: "Session resumed. Phase: [X], Active loops: [N], Last activity: [description]"

**If no artifacts** (new session):
- Read PROJECT.md to understand north star goals
- Read ROADMAP.md to identify current phase
- Create STATE.md with initial state
- Create LOOPS.md (empty, ready for loop capture)
- Create CONTEXT.md with default token budget (5000 tokens)
- Display: "New session initialized. Phase: [X], Token budget: 5000, Ready to work."

### Step 3: Set token budget target

**Default: 5000 tokens** (adjustable based on task complexity)

Token budget phases (from GSD patterns):
- **0-20%**: Comfortable - plenty of room for exploration
- **20-40%**: Deliberate - start tracking what's loaded
- **40-50%**: Warning - consider excluding files or scoping down
- **50%+**: STOP - must exclude context before proceeding

Display current budget in sticky note every turn.

## Sticky Note Template (CRITICAL - Protocol Enforcement)

**This is the core protocol enforcement mechanism.** Copy this template into your response at the END of every turn where:
- An artifact was updated, OR
- Available actions changed, OR
- A checkpoint was reached

```gsd-status
📋 UPDATED: [artifact name] ([what changed])

CURRENT STATE:
- Phase: [phase number/name or task description]
- Active loops: [count] ([LOOP-001, LOOP-002, ...])
- Token budget: [used]/[total] ([percentage]%)

AVAILABLE ACTIONS:
📋 /continue | /pause | /status | /add-loop | /discuss
[Contextual actions if applicable]

NEXT: [What agent expects from user - "Waiting for your input" / "Awaiting approval" / "Ready to proceed"]
```

**Why sticky note format:**
- **Predictable**: Exact same structure every time - agent learns pattern
- **Parseable**: ```gsd-status marker makes it machine-readable
- **Visible**: End placement doesn't interrupt reading, acts as summary
- **Embeds protocol**: Agent sees compliance checklist every turn

**When to include:**
- ✅ After updating STATE.md, LOOPS.md, or CONTEXT.md
- ✅ After capturing a loop
- ✅ After reaching a checkpoint
- ✅ When available actions change (new contextual actions available)
- ❌ Skip if nothing changed and same actions available (avoid visual fatigue)

**Contextual actions examples:**
- Plan-related: `/approve-plan`, `/reject-plan`, `/edit-plan`
- Loop-related: `/close-loop [ID]`, `/explore-loop [ID]`
- Phase-related: `/complete-phase`, `/skip-to-phase [N]`
- Decision-related: `/make-decision`, `/defer-decision`

## Protocol Checklist (Agent Self-Reminder)

This checklist embeds in sticky note behavior. Agent MUST follow after every turn:

- [ ] **After every turn**: Update STATE.md with current activity (what was done, what's next)
- [ ] **When loop identified** (from agent discovery OR user question): Propose loop in XML format → wait for user approval → write to LOOPS.md
- [ ] **When checkpoint reached**: Use visual barrier (🛑🛑🛑) → state action required clearly
- [ ] **When artifact updated**: Show in sticky note UPDATED field (which file, what changed)
- [ ] **When decision made**: Document in PROJECT.md Key Decisions table with rationale
- [ ] **When context changes**: Update CONTEXT.md with files loaded/excluded and token budget
- [ ] **Before execution**: Check token budget - if >50%, stop and scope down context

**Why checklist exists:** Agent reads top-down, can't refer back to bootloader dynamically. Sticky note embeds reminder every turn, reducing protocol drift.

**Loop sources:** Loops originate from two sources:
1. **Agent discovery**: Agent identifies open question during work (assumption needs validation, unclear requirement, edge case found)
2. **User questions**: User asks about decisions, checkpoints, clarifications during session ("Why this approach?", "What about X scenario?", "Can you explain Y?")

## Artifact References

Where to find core templates:

- **LOOPS_TEMPLATE.md**: How to capture open questions, track loop status (open/clarifying/closed)
  - Location: `.gsd-lite/templates/LOOPS_TEMPLATE.md`
  - When to use: When question arises, when idea needs capture, when loop status changes

- **CONTEXT_TEMPLATE.md**: How to manage token budget, track what's loaded and excluded
  - Location: `.gsd-lite/templates/CONTEXT_TEMPLATE.md`
  - When to use: When loading files, when excluding context, when approaching budget limits

- **STATE_TEMPLATE.md**: How to maintain session working memory (current phase, activity, status)
  - Location: `.gsd-lite/templates/STATE_TEMPLATE.md`
  - When to use: Continuously - update after every significant activity

- **SUMMARY_TEMPLATE.md**: How to export session (loops + context decisions) for GTD integration
  - Location: `.gsd-lite/templates/SUMMARY_TEMPLATE.md`
  - When to use: End of session, before closing

**Cross-reference pattern:** When agent proposes loop → link to LOOPS_TEMPLATE for format. When token budget warning → link to CONTEXT_TEMPLATE for exclusion patterns.

## MCP vs Copy-Paste: Dual Instructions

This protocol must work across all agent types - MCP-capable (Claude Desktop, Claude Code) and copy-paste environments (ChatGPT web, Gemini web).

**For agents WITH MCP tools:**
- Read artifacts directly using file read tools
- Write artifacts directly using file write tools
- Show in sticky note: "UPDATED: STATE.md (added LOOP-003)" after write

**For agents WITHOUT MCP (copy-paste workflow):**
- Request file contents: "Please paste STATE.md contents"
- Display updated artifact: "Here's updated STATE.md - please save this:"
- User copies and saves manually
- Agent tracks in memory that artifact was updated

**Detection:** Agent should attempt file read first. If tool not available or fails, fall back to copy-paste workflow.

**Educational note:** File-based protocol means artifacts are ALWAYS markdown files user can view/edit/paste, regardless of agent capabilities. MCP just automates the transfer - the protocol itself is vendor-agnostic.

## Recovery from Drift

If agent stops following protocol (no sticky notes, missed artifact updates, lost systematic IDs):

**User trigger:** Type "update artifacts" or "protocol check"

**Agent response:**
1. Read STATE.md to check current state
2. Display current state in sticky note format:
   ```gsd-status
   📋 PROTOCOL CHECK: STATE.md loaded

   CURRENT STATE:
   - Phase: [current phase]
   - Active loops: [count] ([IDs])
   - Token budget: [used/total] ([percentage]%)

   AVAILABLE ACTIONS:
   📋 /continue | /status | /add-loop

   NEXT: Protocol resumed. Ready for your input.
   ```
3. Resume sticky note compliance on subsequent turns

**Why this works:** Explicit protocol reset brings bootloader instructions back into recent context window. Sticky note format acts as template for agent to follow.

**Prevention:** Include sticky note every turn where artifact updated - maintains protocol visibility without requiring explicit reset.

## Educational Comments

### Why sticky note at response end?

Problem: Agent can't dynamically reference long bootloader mid-session. Context window pushes early instructions out of attention after 10-15 turns.

Solution: Sticky note embeds protocol reminder at end of every response. Agent sees checklist in recent context, maintains compliance longer.

Tradeoff: Visual overhead vs protocol enforcement. Testing shows compliance matters more - user accepts visual noise if it prevents drift.

### Why protocol checklist visible?

Problem: Hidden compliance (agent internally remembers) degrades invisibly. User doesn't know agent drifted until artifacts are out of sync.

Solution: Visible checklist in sticky note. User sees what agent should do, can catch drift immediately ("you didn't update STATE.md").

Benefit: Self-documenting protocol. User learns by watching agent follow checklist.

### Why dual instructions (MCP vs copy-paste)?

Problem: MCP-specific instructions fail in copy-paste environments (ChatGPT web, Gemini web, Cursor without MCP configured).

Solution: Template shows both paths. Agent tries MCP first, falls back to copy-paste if tools unavailable.

Benefit: Vendor-agnostic protocol. Same template works across all agent types.

### Why token budget tracking?

Problem: Loading 500k+ token dbt manifests with no strategy causes context window exhaustion, poor responses, agent confusion.

Solution: Conservative budget (5000 tokens default, expand deliberately). Track what's loaded, what's excluded, why. Stop at 50% to review.

Benefit: Forces context scoping discipline. Prevents "dump everything" anti-pattern.

## Example Session

Shows first 3 agent responses with sticky notes:

### Turn 1: Initialization

**Agent:**
New session initialized. I've created the session artifacts:

- STATE.md: Phase 1 (Foundation & Templates), Status: Starting Task 1
- LOOPS.md: Empty, ready for loop capture
- CONTEXT.md: Token budget 5000, comfortable phase (0%)

Ready to work on Task 1: Create LOOPS_TEMPLATE.md.

```gsd-status
📋 UPDATED: STATE.md, LOOPS.md, CONTEXT.md (session initialized)

CURRENT STATE:
- Phase: 01-foundation-templates, Task 1
- Active loops: 0
- Token budget: 0/5000 (0%)

AVAILABLE ACTIONS:
📋 /continue | /pause | /status | /add-loop | /discuss

NEXT: Ready to proceed with Task 1
```

### Turn 2: Loop captured during work

**Agent:**
I've started drafting LOOPS_TEMPLATE.md. While working, I noticed the plan doesn't specify whether loop IDs should be globally unique across all sessions or scoped per session.

Proposed loop:

```xml
<loop id="LOOP-001" status="open">
  <title>Loop ID scope - global or per-session?</title>
  <context>BOOTLOADER template needs to specify ID behavior</context>
  <question>Should LOOP-001 mean "first loop ever" or "first loop this session"?</question>
  <captured>2026-01-21T16:30:00Z</captured>
  <status>open</status>
</loop>
```

Should I capture this loop?

```gsd-status
📋 UPDATED: STATE.md (proposed LOOP-001)

CURRENT STATE:
- Phase: 01-foundation-templates, Task 1 (in progress)
- Active loops: 1 (LOOP-001 pending approval)
- Token budget: 245/5000 (5%)

AVAILABLE ACTIONS:
📋 /continue | /status | /add-loop
Loop actions: /approve-loop | /reject-loop

NEXT: Awaiting loop approval
```

**User:** Approve - IDs should be globally unique

### Turn 3: Loop resolved, work continues

**Agent:**
✅ LOOP-001 approved and resolved. Decision: Loop IDs are globally unique across all sessions (prevents ID collisions when importing from GTD).

Updated LOOPS_TEMPLATE.md to specify global uniqueness in ID format section.

```gsd-status
📋 UPDATED: LOOPS.md (LOOP-001 closed), STATE.md (decision recorded)

CURRENT STATE:
- Phase: 01-foundation-templates, Task 1 (in progress)
- Active loops: 0
- Token budget: 380/5000 (8%)

AVAILABLE ACTIONS:
📋 /continue | /pause | /status | /add-loop | /discuss

NEXT: Continuing with LOOPS_TEMPLATE.md
```

---

**Session Pattern Notes:**
- Sticky note appears after every artifact update
- Loop capture → approval workflow visible
- Token budget gradually increases as context loads
- Available actions change contextually (loop approval actions appear when loop pending)
- Visual consistency helps user learn protocol

## Summary

**BOOTLOADER solves:**
- Protocol drift (agents stop updating artifacts after 10+ turns)
- Context optimization (track token budget, prevent overload)
- Session initialization (resume existing or start fresh)
- Vendor lock-in (works with MCP or copy-paste)

**Key mechanisms:**
- Sticky note template (embeds protocol at every turn)
- Protocol checklist (visible compliance)
- Dual instructions (MCP + copy-paste)
- Recovery trigger ("update artifacts")

**Usage:**
1. Paste this template into agent at session start
2. Agent initializes artifacts (STATE, LOOPS, CONTEXT)
3. Agent follows protocol checklist after every turn
4. Sticky note enforces compliance throughout session
5. User recovers with "update artifacts" if drift occurs

**What's NOT in BOOTLOADER:**
- Loop capture format (see LOOPS_TEMPLATE.md)
- Context scoping patterns (see CONTEXT_TEMPLATE.md)
- Session export format (see SUMMARY_TEMPLATE.md)
- Cross-session state persistence (Phase 2 - Session Handoff)

---

*Template version: 1.0*
*Last updated: 2026-01-21*
*Part of: Phase 1 - Foundation & Templates*
