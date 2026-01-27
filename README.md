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

## Typical Session

Here's what a real GSD-Lite session looks like, from initial exploration to completed work.

### Starting Fresh (Moodboard)

**You:** "I want to build a simple REST API for my notes app"

**Agent:** "Let me understand what you're picturing. When you say 'simple', are you thinking:
1. Just CRUD operations (create, read, update, delete)?
2. With authentication and user accounts?
3. Something else?

[YOUR TURN] - Which matches your mental model?"

**You:** "Just CRUD for now. I want to validate the idea first."

**Agent:** "Perfect. So a minimal viable API - we can always add auth later.
What would creating a note look like? Are you thinking:
- A title + body?
- Just free-form text?
- Tags or categories?

[YOUR TURN] - What feels right to you?"

**You:** "Title and body. Keep it simple."

**Agent:** "Got it. So we're looking at:
- POST /notes (create with title + body)
- GET /notes (list all)
- GET /notes/:id (get one)
- PUT /notes/:id (update)
- DELETE /notes/:id (delete)

Does that match your vision?

[YOUR TURN]"

**You:** "Yes, exactly."

**Agent:** "Excellent. I'll log this vision to WORK.md and present you with a plan for review."

### Mid-Session (Execution)

**Agent:** "I'm noticing the notes endpoint doesn't validate empty titles. What if we tried adding validation here?

```typescript
if (!title || title.trim().length === 0) {
  throw new ValidationError('Title cannot be empty');
}
```

This prevents orphaned notes with no identifier. Does this align with your expectations?

[YOUR TURN] - Should we validate, or allow empty titles?"

**You:** "Yes, validate. Empty titles don't make sense."

**Agent:** "Perfect. Adding validation and logging the decision."

*(Agent executes, logs to WORK.md with code snippet, continues to next task)*

### Wrapping Up (Housekeeping)

**You:** "Write PR for the notes API work"

**Agent:** "Generating PR description from WORK.md logs..."

```markdown
## Notes API Implementation

Created basic CRUD API for notes with title + body fields.

### Changes
- POST /notes - create note with validation
- GET /notes - list all notes
- GET /notes/:id - retrieve single note
- PUT /notes/:id - update note
- DELETE /notes/:id - delete note

### Key Decisions
- Title validation: reject empty titles (prevents orphaned notes)
- In-memory storage for MVP (deferred database to future iteration)

### Code Snippets
[Extracted from WORK.md execution logs with full context]
```

**You:** "Perfect. Archive this and start fresh for the auth work."

**Agent:** "Archived notes API logs to HISTORY.md. Ready for next session."

## Workflow Diagram

```mermaid
graph TD
    Start([New Session]) --> ReadProtocol[Read PROTOCOL.md]
    ReadProtocol --> ReadWork[Read WORK.md Current Understanding]
    ReadWork --> CheckMode{Current Mode?}

    CheckMode -->|none/planning| Moodboard[moodboard.md]
    CheckMode -->|moodboard-complete| Whiteboard[whiteboard.md]
    CheckMode -->|execution| Execution[execution.md]
    CheckMode -->|checkpoint| Checkpoint[checkpoint.md]

    Moodboard -->|User: ready for plan| Whiteboard
    Whiteboard -->|User: approved| Execution
    Execution -->|Session end| Checkpoint
    Execution -->|User: write PR| Housekeeping[housekeeping.md]

    Checkpoint --> Resume([Next Session])
    Housekeeping -->|Archive| History[HISTORY.md]
```

**Current workflows:**
- **moodboard.md** - Extract user vision through collaborative exploration (thinking partner mode)
- **whiteboard.md** - Present plan for approval before execution
- **execution.md** - Execute tasks with pair programming approach (propose hypotheses, challenge assumptions)
- **checkpoint.md** - Pause session and update WORK.md Current Understanding for fresh agent resume
- **housekeeping.md** - Extract PR from task logs or archive completed work to HISTORY.md

## For Maintainers

### Testing Changes

Before merging changes to templates or workflows:

1. **Golden sample test:** Create a WORK.md with 50+ log entries. Verify grep patterns work:
   - `grep "^## "` finds all sections
   - `grep "[LOG-NNN]"` finds specific entries
   - `grep "[DECISION]"` filters by type

2. **Coherence check:** After updating any file, grep for cross-references:
   - `grep "STATE.md" src/gsd_lite/template/` - should return 0 (deleted)
   - `grep "ephemeral" src/gsd_lite/template/` - should return 0
   - `grep "promotion.md\|revisit.md" src/gsd_lite/template/` - should return 0 (workflows deleted)

3. **Eval framework:** Run scenarios in tests/eval_gsd_lite/ with different models.

### Updating This README

- Keep conversational tone (like a thinking partner explaining)
- Show don't tell (examples > descriptions)
- Update session walkthrough if workflows change significantly
- Update diagram if routing logic changes

### Core Principles (Do Not Regress)

These principles MUST be preserved in all iterations. Each principle is:
- **Observable** in artifacts (testable via grep or review)
- **Testable** with specific verification command
- **Justified** with rationale

| # | Principle | Observable In | Test | Rationale |
|---|-----------|---------------|------|-----------|
| 1 | Pair programming > task execution | workflows/*.md | `grep "thinking partner" workflows/` returns 5+ matches | Exploration-first agents ask better questions |
| 2 | Perpetual WORK.md | WORK.md, housekeeping.md | `grep "delete WORK.md\|ephemeral" templates/` returns 0 | Session history enables PR extraction |
| 3 | Grep-first retrieval | WORK.md | `grep "^## " WORK.md` finds all sections | Scales to large files, non-linear access |
| 4 | User controls completion | workflows/*.md | `grep "[YOUR TURN]" workflows/` returns matches | User owns outcome, agent proposes |
| 5 | First-turn conversation | moodboard.md | Review moodboard.md - no file writes before dialogue | Understanding before implementation |
| 6 | Confirmation loops | workflows/*.md | `grep "handoff\|YOUR TURN" workflows/` returns matches | Every response invites user input |

If a change would violate these principles, it needs explicit approval and documented rationale.

## Installation

No installation required. Run directly with `uv` (recommended):

```bash
# Initialize a new project
uvx gsd-lite

# Or update an existing one
uvx gsd-lite --update
```

## License

MIT
