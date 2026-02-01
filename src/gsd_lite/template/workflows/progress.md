---
description: Progress check workflow - show current state and route to next action
---

# Progress Workflow

[SYSTEM: PROGRESS MODE - Situational Awareness]

## Entry Conditions

- User requests progress, status, or "where are we?"
- Session start without clear context
- Any time user wants situational awareness

## Exit Conditions

- Status report presented
- Next action suggested with clear routing
- User confirms direction

---

## Purpose

Quick situational awareness before continuing work. Show where we are, what's pending, and route to the appropriate next action.

**Philosophy:** You stay the author who can explain the "why" - this workflow surfaces that context quickly.

---

## Progress Check Process

### Step 1: Verify Structure Exists

Check if `gsd-lite/` directory exists:

```bash
test -d gsd-lite && echo "exists" || echo "missing"
```

**If missing:**

```
No GSD-Lite structure found.

To start: Create gsd-lite/ directory and initialize WORK.md

Or describe what you want to build - I'll help set it up.
```

Exit.

### Step 2: Discover Artifact State

Use grep-first to understand what exists:

```bash
ls -la gsd-lite/*.md 2>/dev/null
```

Track what exists:
- `WORK.md` - Session state and execution log
- `INBOX.md` - Loop capture
- `PROJECT.md` - Project vision (optional)
- `ARCHITECTURE.md` - Codebase structure (optional)
- `HISTORY.md` - Completed work (optional)

### Step 3: Read Current Understanding

**Grep-first pattern:**

```bash
grep "^## " gsd-lite/WORK.md
```

Read the Current Understanding section (top of WORK.md to first `---`):

Extract from XML tags:
- `<current_mode>` - What workflow are we in?
- `<active_task>` - What's being worked on?
- `<parked_tasks>` - What's on hold?
- `<blockers>` - What's blocking progress?
- `<next_action>` - What's the specific next step?

### Step 4: Count Active Loops

If INBOX.md exists:

```bash
grep -c "^## LOOP-" gsd-lite/INBOX.md 2>/dev/null || echo "0"
grep "Status: Open" gsd-lite/INBOX.md 2>/dev/null | wc -l
```

### Step 5: Present Status Report

```
# Progress Check

**Mode:** [current_mode from WORK.md]

## Current State

**Active Task:** [active_task or "None"]
**Parked:** [count of parked_tasks or "None"]
**Open Loops:** [count] in INBOX.md

## Blockers

[blockers content or "None - clear to proceed"]

## Next Action

[next_action from Current Understanding]

---
```

### Step 6: Route to Next Action

Based on `current_mode`, suggest the appropriate workflow:

| current_mode | Meaning | Suggested Action |
|--------------|---------|------------------|
| `none` or empty | No active work | "Describe what you want to build" |
| `planning` or `moodboard` | Extracting vision | "Continue vision exploration" |
| `moodboard-complete` | Ready for plan | "Ready to present plan - say 'show me the plan'" |
| `execution` | Active work | "Continue with: [next_action]" |
| `checkpoint` | Session paused | "Resume from checkpoint - [next_action]" |
| `housekeeping` | Cleanup mode | "Continue PR extraction or archiving" |

**Present routing:**

```
---

## ▶ Next Up

**[Workflow]:** [Brief description]

[Specific next step from next_action]

---

**Also available:**
- "checkpoint" or "pause" — save state for later
- "write PR for [TASK]" — extract PR description
- "archive [TASK]" — move to HISTORY.md

---
```

---

## Special Cases

### No WORK.md Exists

```
No active session found.

**Options:**
1. Tell me what you want to build → I'll help set up PROJECT.md
2. "map the codebase" → I'll document existing code in ARCHITECTURE.md
3. Start fresh → Describe your first task

What would you like to do?
```

### WORK.md Has Example Content Only

If Current Understanding contains "EXAMPLE" entries:

```
WORK.md exists but contains only template examples.

Ready to start real work. What would you like to build or accomplish?
```

### Multiple Blockers

If blockers section has content:

```
⚠️ Blockers need attention before continuing:

[List blockers]

Would you like to:
1. Resolve blockers now
2. Park blocked work and start something else
3. Continue anyway (if blockers are soft)
```

---

## Sticky Note Protocol

**At the end of EVERY turn**, include this status block **without exception**.

### Required Format

Use fenced block with `gsd-status` marker:

```gsd-status
📋 CHECKED: Current progress loaded

CURRENT STATE:
- Mode: [current_mode]
- Active: [active_task or "None"]
- Loops: [count] open
- Blockers: [count or "None"]

AVAILABLE ACTIONS:
📋 /continue | /pause | /status | /add-loop | /discuss

NEXT: [What user should do next]

---
📊 STATUS: [Mode] — [Brief state description]
---
```

---

## Anti-Patterns

- **Reading entire WORK.md** — Use grep-first, read only Current Understanding
- **Suggesting actions without context** — Always read current_mode first
- **Ignoring blockers** — Surface blockers prominently before suggesting next action
- **Complex routing** — Keep it simple: one clear next action
- **Over-reporting** — Status should be glanceable, not a wall of text

---

*Progress Workflow - Part of GSD-Lite Protocol v2.0*
