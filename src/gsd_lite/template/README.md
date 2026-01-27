# GSD-Lite: Lightweight Session Management for AI Pair Programming

GSD-Lite helps you maintain productive sessions with AI agents across context window resets. Think of it as a shared notebook that keeps both you and the agent on the same page.

## Philosophy

### Thinking Partners, Not Task Executors

GSD-Lite treats you and the agent as **thinking partners exploring together**, not a traditional user-command hierarchy.

**Agent as Navigator:**
- Proposes hypotheses for you to react to ("What if we tried X?")
- Challenges your assumptions ("Why do you think that?")
- Teaches concepts with relatable analogies (like "Road Map vs Road Trip")
- Celebrates discoveries with you ("Exactly! You nailed it")
- Explains WHY it's asking questions or suggesting paths

**You as Driver:**
- Make all key decisions about direction and scope
- Own the outcome and understand the reasoning behind it
- Approve or reject the agent's proposals
- Stay engaged throughout the exploration, not just at the start

This approach produces better outcomes because exploration-first agents ask better questions, and you maintain ownership of the reasoning process. You're the author who can explain the "why" behind every decision, not a passenger consuming agent output.

### Why Perpetual WORK.md?

Traditional approaches delete session logs after each phase ("ephemeral state"). GSD-Lite keeps logs perpetually until you explicitly request archiving.

**Benefits:**
- **PR extraction anytime:** Generate pull request descriptions from detailed execution logs at any point
- **Multi-session continuity:** Pick up where you left off, even weeks later
- **Full evidence trail:** Code snippets preserved in logs show exactly what was built and why
- **User-controlled cleanup:** You decide when to archive, based on your project rhythm

You manage growth through the housekeeping workflow, not automatic deletion.

### Why Grep-First?

As your WORK.md grows to hundreds of lines, reading it sequentially becomes inefficient. Grep patterns enable **non-linear access** — discover structure first, then surgically read what you need.

**Two-step pattern:**
1. **Discover:** `grep "^## " WORK.md` → returns section headers with line numbers
2. **Surgical read:** Read specific sections using line ranges

This scales to files with 1000+ lines without overwhelming the agent's context window.

## How It Works

### Quick Start

1. **Agent reads PROTOCOL.md** to understand the system and routing logic
2. **Agent reads WORK.md** to get current context (30-second summary in "Current Understanding")
3. **Agent loads appropriate workflow** based on current mode (moodboard, execution, checkpoint, etc.)
4. **You and agent explore together** — planning, executing, discovering
5. **Housekeeping workflow** extracts PRs from task logs and archives completed work when you request it

Fresh agents resume by reading artifacts (not chat history), enabling seamless handoffs across context resets.

## Artifact Overview

| File | Purpose | Lifecycle | How to Read |
|------|---------|-----------|-------------|
| PROTOCOL.md | Router - tells agent which workflow to load | Immutable template | Read in full (small) |
| WORK.md | Session state + detailed log | Perpetual - grows over time, housekeeping archives | `grep "^## "` for sections, `grep "[LOG-NNN]"` for entries |
| INBOX.md | Open questions and loops | Cleared when loops resolved | Read in full (small) |
| HISTORY.md | Completed phases (one-liner each) | Append-only archive | `grep "Phase:"` for phases |

**How they connect:**
- **PROTOCOL.md** routes to workflows based on current mode in WORK.md
- **Workflows** read/write WORK.md to track progress and decisions
- **Open loops** captured in INBOX.md during exploration
- **Completed work** archived from WORK.md to HISTORY.md via housekeeping

For detailed grep patterns, see PROTOCOL.md's "File Reading Strategy" section.

## Grep Workflow (For Agents and Power Users)

GSD-Lite is optimized for grep-based discovery. Use these patterns to navigate large files efficiently:

**Discover structure:**
```bash
grep "^## " WORK.md
```
Returns all section headers (Current Understanding, Key Events Index, Atomic Session Log)

**Find specific log entry:**
```bash
grep "\[LOG-015\]" WORK.md
```
Jump directly to entry 015 without scanning the entire file

**Filter by type:**
```bash
grep "\[DECISION\]" WORK.md
```
Find all decisions made during the session

**Filter by task:**
```bash
grep "Task: MODEL-A" WORK.md
```
Show only logs related to MODEL-A task (useful for multi-task projects)

**Core workflow:** Grep to discover structure, then surgical read of relevant sections. This enables efficient context loading even with 500+ line WORK.md files.
