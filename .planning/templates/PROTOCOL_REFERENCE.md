---
version: 1.0
updated: 2026-01-21
purpose: Quick reference for all protocol enforcement mechanisms used across templates
---

# Protocol Reference

## Purpose

This document provides quick reference for all protocol patterns, enforcement mechanisms, and conventions used across the GSD template system. Use this when you need to look up:
- Systematic ID formats
- Checkpoint types and when to use them
- Sticky note rules
- Visual conventions
- Available actions menu
- Recovery protocols

For full template details, see individual template files (LOOPS_TEMPLATE.md, CONTEXT_TEMPLATE.md, etc.).

## Systematic ID Coding

**Format:** `TYPE-NNN` (zero-padded 3 digits)

**Why:** Quick reference, artifact linking, global uniqueness, no ambiguity. Instead of "that invoice question from earlier", say "LOOP-007".

### ID Types

| Type | Used For | Example | Scope |
|------|----------|---------|-------|
| LOOP | Open questions, parking lot ideas | LOOP-003 | Global unique |
| TASK | Execution units | TASK-017 | Global unique |
| DECISION | Architectural/technology choices | DECISION-008 | Global unique |
| HYPO | Hypotheses to validate | HYPO-005 | Global unique |
| PLAN | Phase plans | PLAN-012 | Global unique |
| MILESTONE | Release milestones | MILESTONE-002 | Global unique |
| CHECKPOINT | Blocking verification points | CHECKPOINT-009 | Global unique |

### Format Rules

- **PREFIX**: Always uppercase (LOOP, not loop or Loop)
- **SEPARATOR**: Hyphen `-` (not underscore or space)
- **NUMBER**: Three digits, zero-padded (001, not 1 or 0001)
- **SCOPE**: Global unique - IDs never repeat across sessions
- **REGISTRY**: All tracked in STATE.md

### Examples

**Good:**
- LOOP-003 (correct format)
- TASK-042 (zero-padded)
- DECISION-008 (consistent style)

**Bad:**
- loop-3 (lowercase, not zero-padded)
- Loop 003 (space separator)
- LOOP_003 (underscore separator)
- "question #3" (ambiguous, no type)

### Usage in References

**When referencing IDs:**
- Include ID + brief title: **LOOP-003** (missing CB invoices)
- Link between artifacts: "Resolved LOOP-007 → DECISION-008"
- Grep for tracking: `grep LOOP-003` finds all mentions

**Registry location:** STATE.md maintains the canonical registry of all active IDs.

## Sticky Note Protocol

**Purpose:** End-of-response status block that acts as protocol reminder, maintaining agent discipline throughout long sessions.

**Why:** Agents can't dynamically reference bootloader mid-session - context window pushes early instructions out of attention. Sticky note embeds protocol checklist every turn.

### When to Include

**Include sticky note when:**
- ✅ Artifact updated (STATE.md, LOOPS.md, CONTEXT.md modified)
- ✅ State changed (phase transition, loop captured, checkpoint reached)
- ✅ Available actions changed (new contextual actions available)

**Omit sticky note when:**
- ❌ No changes (pure conversational turn)
- ❌ Same state and actions as previous turn
- ❌ Just reading files without updates

**Why selective:** Balance between protocol enforcement (need visibility) and visual fatigue (too much noise creates wallpaper effect).

### Required Format

```gsd-status
📋 UPDATED: [artifact name] ([what changed])

CURRENT STATE:
- Phase: [phase number/name or task description]
- Active loops: [count] ([LOOP-001, LOOP-002, ...])
- Token budget: [used]/[total] ([percentage]%)

AVAILABLE ACTIONS:
📋 /continue | /pause | /status | /add-loop | /discuss
[Contextual actions if applicable]

NEXT: [What agent expects from user]
```

### Required Fields

1. **UPDATED**: Which artifact changed and what modification was made
2. **CURRENT STATE**: Phase, loop count, token budget snapshot
3. **AVAILABLE ACTIONS**: Core actions + contextual actions
4. **NEXT**: What agent expects from user (explicit)

### Visual Marker

- **Fenced block**: ``` wrapper with `gsd-status` label
- **Placement**: End of response only (doesn't interrupt reading)
- **Purpose**: Parseable structure, visible compliance, protocol reminder

For full details, see BOOTLOADER_TEMPLATE.md.

## Checkpoint Types

**Purpose:** Visual interruptions that arrest attention for critical events, using distinct emojis per checkpoint type.

**Why:** Consistent visual language reduces cognitive load, makes checkpoints instantly recognizable.

### Informational Checkpoints

These provide progress visibility but don't require blocking:

| Type | Emoji | When to Use | Example Action |
|------|-------|-------------|----------------|
| Loop captured | 📫 | Loop proposed and approved | "Added to LOOPS.md" |
| Decision made | ⚡ | User selected option | "Documented in PROJECT.md" |
| Task complete | ✅ | Unit of work done | "Moving to next task" |
| Phase complete | 🔮 | Milestone reached | "Ready for next phase" |
| Hypothesis validated | 🧪 | Test result confirmed | "Evidence documented" |
| Hypothesis invalidated | 🧪 | Test result rejected | "Assumption revised" |

### Blocking Checkpoints

These require explicit user action before proceeding:

**Format:**
```
🛑🛑🛑🛑🛑🛑🛑 BLOCKING: [Type of verification/decision] 🛑🛑🛑🛑🛑🛑🛑

**CHECKPOINT:** [Clear title]

**What**: [What was built/discovered/needs decision]

**Context**: [Why this matters]

**How to verify** OR **Options**:
[Numbered steps for verification OR options with pros/cons]

────────────────────────────────────────────────────────
→ YOUR ACTION: [Explicit instruction - "Type 'approved'" or "Select 1, 2, or 3"]
────────────────────────────────────────────────────────
```

**Why aggressive emoji wall:** 7+ 🛑 emojis arrest scrolling attention, make it impossible to miss the blocking point.

### Checkpoint Structure

All checkpoints include:

1. **Emoji banner**: Visual arrest (7+ emojis for blocking)
2. **What section**: What needs attention
3. **Context section**: Why it matters
4. **Action section**: How to verify OR options to choose
5. **Action prompt**: Explicit instruction (always clear what user should do)
6. **Horizontal rules**: Visual separation for blocking checkpoints

### Usage Guidance

**Use blocking checkpoints for:**
- User needs to verify visual output (dashboard layout, UI behavior)
- User needs to make architectural decision (library choice, data model)
- User needs to provide credentials (authentication gates)
- User needs to test functionality (manual testing required)

**Use informational checkpoints for:**
- Progress visibility (task complete, loop captured)
- Confirmation of automated actions (decision documented, file written)
- Milestone tracking (phase complete, hypothesis validated)

For full checkpoint patterns, see Phase 1 CONTEXT.md and RESEARCH.md.

## Visual Conventions

### Emoji Usage

**Distinct per context:**
- 🛑 Blocking checkpoint (very aggressive, 7+ in wall)
- 📫 Loop captured (mailbox = captured for later)
- ✅ Task complete (checkmark = done)
- 🔮 Phase complete (crystal ball = seeing ahead to next phase)
- 🧪 Hypothesis result (test tube = scientific validation)
- ⚡ Decision made (lightning = decisive action)
- 📋 Available actions menu (clipboard = actionable list)

### Fenced Blocks

**Purpose:** Visual isolation and parseability

| Block Type | Marker | Usage |
|------------|--------|-------|
| Sticky notes | ```gsd-status | Protocol status at response end |
| XML examples | ```xml | Loop structures, context budgets |
| Bash commands | ```bash | Command examples, execution |
| Markdown examples | ```markdown | Template structures, formats |

### Blocking Barriers

**Format:**
```
🛑🛑🛑🛑🛑🛑🛑 BLOCKING: [Title] 🛑🛑🛑🛑🛑🛑🛑
[Content]
────────────────────────────────────────────────────────
→ YOUR ACTION: [Instruction]
────────────────────────────────────────────────────────
```

**Count:** Minimum 7 emojis (creates visual wall)
**Horizontal rules:** ASCII lines for separation
**Arrow prompt:** → symbol draws eye to action

### Action Prompts

**Always explicit:**
- "Type 'approved' or describe issues"
- "Select 1, 2, or 3"
- "Run command and paste output"
- "Verify and type 'continue'"

**Never vague:**
- ❌ "Let me know what you think"
- ❌ "Check if it works"
- ❌ "Verify and proceed"

## Available Actions Menu

**Purpose:** Surface capabilities so user always knows options. Reduces "what do I do now?" moments.

### Core Actions (Always Present)

These are available in every session:

| Action | Purpose | Example |
|--------|---------|---------|
| /continue | Resume work after checkpoint | Continue to next task |
| /pause | Save session state for later | Pause and export to SUMMARY |
| /status | Show current state | Display phase, loops, budget |
| /add-loop | Capture new loop | Propose loop for approval |
| /discuss | Fork to exploratory discussion | Discuss architecture without losing main focus |

### Contextual Actions

These appear based on current state:

**Plan-related:**
- /approve-plan - Approve proposed plan
- /reject-plan - Reject and request revision
- /edit-plan - Modify specific sections

**Loop-related:**
- /close-loop [ID] - Mark loop as resolved
- /explore-loop [ID] - Deep dive into specific loop
- /defer-loop [ID] - Move to backlog

**Phase-related:**
- /complete-phase - Mark phase done, move to next
- /skip-to-phase [N] - Jump to different phase
- /review-phase - Assess phase progress

**Decision-related:**
- /make-decision - Document architectural choice
- /defer-decision - Capture as HYPO for later

### Menu Format

**In sticky note:**
```
AVAILABLE ACTIONS:
📋 /continue | /pause | /status | /add-loop | /discuss
Loop actions: /close-loop [ID] | /explore-loop [ID]
```

**Single-line core:** Pipe-separated for scanning
**Contextual below:** Grouped by category when present

## Context Stack

**Purpose:** Support non-linear reasoning in linear chat - fork to discuss tangent, return to main focus.

### Structure

**Single level only:** One fork at a time (prevents cognitive overload)

**STATE.md tracks:**
- "Return To" field: What to resume after fork
- Current focus: What's being discussed now
- Fork depth: Must stay at 0 or 1 (no nesting)

### Behavior

**When forking:**
1. User types `/discuss [topic]`
2. Agent records current context in STATE.md "Return To" field
3. Agent switches focus to discussion
4. Sticky note shows fork state: "Forked from: TASK-003"

**When returning:**
1. Discussion concludes (decision made or topic exhausted)
2. Agent prompts: "Discussion complete. Ready to return to TASK-003?"
3. User confirms: "yes" or "approved"
4. Agent loads TASK-003 context, resumes work
5. STATE.md clears "Return To" field

### Example Usage

**Main focus:** Working on TASK-003 (refactoring orders model)
**Fork:** User asks "What's the best approach for handling Chargebee invoice lineage?"
**Agent:** Records TASK-003 in "Return To", discusses lineage patterns
**Return:** "Discussion complete. Ready to return to TASK-003?"
**Resume:** Loads TASK-003 context, continues refactoring

**Why single level:** Multiple nested forks create cognitive overhead. Stack depth = 1 keeps conversations manageable.

For full context stack protocol, see Phase 1 CONTEXT.md.

## Recovery Protocol

**Purpose:** Reset agent protocol discipline when drift occurs (no sticky notes, missed updates, inconsistent IDs).

### Trigger

**User prompts:**
- "update artifacts"
- "protocol check"
- "reset protocol"

**Agent self-detects:**
- Before executing plan: "Let me check current state first..."
- After long conversation: "Let me verify artifacts are up to date..."

### Agent Response

1. **Read STATE.md** to load current state
2. **Display sticky note** with current state:
   ```gsd-status
   📋 PROTOCOL CHECK: STATE.md loaded

   CURRENT STATE:
   - Phase: [current]
   - Active loops: [count] ([IDs])
   - Token budget: [used/total] ([%])

   AVAILABLE ACTIONS:
   📋 /continue | /status | /add-loop

   NEXT: Protocol resumed. Ready for your input.
   ```
3. **Resume compliance** on subsequent turns
4. **Acknowledge drift** if significant: "I notice I stopped including sticky notes around turn 15. Resuming protocol now."

### Prevention

**Primary:** Include sticky note every turn when artifact updated - maintains protocol visibility
**Secondary:** Self-checks before major operations (plan execution, phase transitions)
**Tertiary:** User recovery trigger when drift noticed

### Warning Signs

Watch for these drift indicators:
- Agent stops including sticky notes
- Artifact updates mentioned but not shown in sticky note
- IDs become inconsistent (LOOP-3 vs Loop 003 vs loop-003)
- Checkpoints lose visual barriers
- No token budget tracking mentioned

For full recovery protocol, see BOOTLOADER_TEMPLATE.md.

## MCP vs Copy-Paste

**Purpose:** Vendor-agnostic protocol that works with MCP-capable agents (Claude Desktop, Claude Code) and copy-paste environments (ChatGPT web, Gemini).

### Detection

**Agent attempts:** Try file read first
**If successful:** MCP available - use tools directly
**If fails:** Copy-paste workflow - request user to provide contents

### MCP Workflow

**Agents WITH file access:**
- Read artifacts directly using file read tools
- Write artifacts directly using file write tools
- Show in sticky note: "UPDATED: STATE.md (added LOOP-003)"

**Example:**
```
Agent: [uses MCP tool to read STATE.md]
Agent: [uses MCP tool to write updated STATE.md]
Agent: [displays sticky note confirming update]
```

### Copy-Paste Workflow

**Agents WITHOUT file access:**
- Request file contents: "Please paste STATE.md contents"
- Display updated artifact: "Here's updated STATE.md - please save this:"
- User copies and saves manually
- Agent tracks in memory that artifact was updated

**Example:**
```
Agent: "Please paste contents of STATE.md (or say 'new session' if starting fresh)"
User: [pastes STATE.md contents]
Agent: [processes state, proposes update]
Agent: "Here's updated STATE.md - please save this: [markdown content]"
```

### Protocol Identical

**Both maintain same artifacts:** STATE.md, LOOPS.md, CONTEXT.md
**Both follow same protocol:** Systematic IDs, sticky notes, checkpoints
**Both produce same outputs:** SUMMARY.md exports, GTD integration

**Key principle:** File-based protocol means artifacts are ALWAYS markdown files user can view/edit/paste. MCP just automates the transfer.

For full dual instructions, see BOOTLOADER_TEMPLATE.md.

## Template Cross-References

This protocol is implemented across all templates:

### Core Templates

**LOOPS_TEMPLATE.md** - Loop capture with systematic IDs
- Location: `.gsd-lite/templates/LOOPS_TEMPLATE.md`
- Implements: LOOP-NNN format, XML structure, status transitions
- See: Systematic ID Coding, Checkpoint Types (loop captured)

**CONTEXT_TEMPLATE.md** - Token budget management
- Location: `.gsd-lite/templates/CONTEXT_TEMPLATE.md`
- Implements: Token thresholds, progressive loading, exclusion rationale
- See: Context Stack, Recovery Protocol

**STATE_TEMPLATE.md** - Session working memory
- Location: `.gsd-lite/templates/STATE_TEMPLATE.md`
- Implements: Phase tracking, loop registry, token budget display
- See: Systematic ID Coding, Context Stack

**BOOTLOADER_TEMPLATE.md** - Session initialization
- Location: `.gsd-lite/templates/BOOTLOADER_TEMPLATE.md`
- Implements: Sticky note template, protocol checklist, dual instructions
- See: Sticky Note Protocol, Recovery Protocol, MCP vs Copy-Paste

**SUMMARY_TEMPLATE.md** - Session export
- Location: `.gsd-lite/templates/SUMMARY_TEMPLATE.md`
- Implements: GTD export, context decisions, next session prep
- See: Available Actions Menu, Context Stack

### Quick Navigation

**Finding a pattern:**
1. Check this PROTOCOL_REFERENCE (quick lookup)
2. Follow link to full template (detailed implementation)
3. See examples in template (practical usage)

**Understanding a template:**
1. Read template Purpose section (what/why)
2. Check cross-references back to this PROTOCOL_REFERENCE (patterns used)
3. Review examples in template (how to apply)

## Summary

This protocol reference consolidates all enforcement mechanisms used across the GSD template system. When you need to:

- **Look up ID format**: See Systematic ID Coding
- **Understand checkpoint types**: See Checkpoint Types
- **Check sticky note rules**: See Sticky Note Protocol
- **Find visual conventions**: See Visual Conventions
- **See available actions**: See Available Actions Menu
- **Handle context forks**: See Context Stack
- **Recover from drift**: See Recovery Protocol
- **Support all platforms**: See MCP vs Copy-Paste

For full implementation details, see individual template files.

---

**Protocol version:** 1.0
**Last updated:** 2026-01-21
**Part of:** Phase 1 - Foundation & Templates
