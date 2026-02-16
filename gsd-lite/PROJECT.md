# GSD-Lite

*Initialized: 2026-02-03*

## What This Is

A pair programming protocol that helps human engineers collaborate with AI agents while maintaining ownership of reasoning and decisions. GSD-Lite scaffolds markdown artifacts (PROTOCOL.md, WORK.md, INBOX.md) that capture the *why* behind every decision — creating institutional memory that survives ephemeral agent sessions.

The framework enables a "fork & resume" workflow: pair program with an agent, log rich findings to artifacts, kill the session when token budget rises, and resume with a fresh agent pointing at the curated logs. Engineers stay in the driver seat, learning and owning every decision.

## Core Value

Engineers own and comprehend the reasoning behind every line of code — agents are brilliant collaborators, but ephemeral. The human stakes their reputation on the outcome and must be able to explain the "why" to anyone.

## Success Criteria

Project succeeds when:
- [ ] Engineers can explain any logged decision without re-consulting the agent
- [ ] Fresh agent resumes work by reading curated logs (not reconstructing from scratch)
- [ ] Session token budget stays under 80k via deliberate fork-and-condense workflow
- [ ] Log entries read like journalism: narrative, analogies, code snippets, zero-friction onboarding
- [ ] Artifacts feed directly into PR descriptions and documentation

## The Pair Programming Model

**Roles:**
- **Engineer (Driver):** Owns decisions, curates what gets logged, stakes reputation on outcome
- **Agent (Navigator):** Proposes solutions, executes tasks, narrates reasoning in log entries
- **Artifacts (Memory):** Persist beyond any single session, become institutional knowledge

**The Fork & Resume Cycle:**

```
SESSION 1 (tokens: 0 → 60k)
├── Pair program back-and-forth
├── Hit interesting finding → "Log this with journalism narrative"
├── Agent writes LOG-017 (Time Traveler Bug)
├── Continue working → tokens rising
└── Hit 80k threshold → FORK

SESSION 2 (tokens: 0 → fresh start)
├── "Read LOG-017, continue from there"
├── Agent onboards from curated artifact (not chat history)
├── Continue pair programming
├── New decision → "Log this decision with analogy"
├── Agent writes LOG-025 (Blank String Philosophy)
└── Continue or FORK again
```

**Why This Matters:**
- Chat history is expensive (tokens) and ephemeral (session dies)
- Artifacts are cheap (grep-optimized) and permanent (survives sessions)
- Engineer decides what's worth preserving — not the agent
- Curated logs become onboarding docs for future engineers AND weaker agents

## Context

**Technical environment:**
- Python 3.9+ CLI built with Typer/Rich
- Distributed as pip-installable package (`uvx gsd-lite@latest install`)
- Templates bundled in `src/gsd_lite/template/`
- Designed for synergy with fs-mcp (grep-first file reading)
- **Worklog Reader plugin** (`plugins/reader-vite/`): TypeScript/Vite app for interactive WORK.md viewing with live reload. Distributed separately via npm (`npx @luutuankiet/gsd-reader`). See ARCHITECTURE.md [Plugins section](./ARCHITECTURE.md#plugins) for details. **Critical:** If modifying the parser, read the "Line Number Alignment" section in ARCHITECTURE.md first — incorrect line handling breaks deep linking.

**Prior work:**
- Evolved from "Data Engineering Copilot Patterns" knowledge base project
- Inspired by upstream GSD framework (reference in `.claude/gsd_reference/`)
- 8 iterative phases: Foundation → Template Coherence → Context Lifecycle → Checkpoint → Evaluation → Grep Synergy → Workflows → Echo-back Onboarding

**Key architectural decisions:**
- Workflow decomposition: 929-line monolith → 5 focused ~350-line workflows
- Checkpoint ≠ Promotion: Separate "save state" from "trim logs"
- Summary in headers: Log entries include description for grep scanning
- Echo-back protocol: Agents must prove understanding before executing
- Journalism narrative: Logs include analogies, code snippets, extended context

**Validated in production:**
- Meltano pipeline project (DATA-338, DATA-339)
- 26+ rich log entries demonstrating the pattern
- PR descriptions generated directly from WORK.md logs

## The Logging Standard

When logging findings, use this prompt pattern:

> *"Please include specific code snippet, reasoning, extended context in a journalism narrative style so that whoever with 0 context can onboard and pick up this key record of decision without ambiguity or friction. Add a cherry on top to include exact/synthesized example to explain the concepts/findings mentioned so that other weaker reasoning agents can grasp topic with little friction and ambiguity."*

**What makes a good log entry:**

| Element | Purpose | Example |
|---------|---------|---------|
| Narrative framing | Hook the reader | "The Time Traveler Bug" |
| The symptom | What went wrong | "DAG reported success, table remained empty" |
| The evidence | Concrete proof | Actual error message, query results |
| The root cause | Why it happened | "Business Central uses 0001-01-01 for NULL" |
| The analogy | ELI5 for onboarding | "Like writing 01/01/0001 on a form when you don't have a date" |
| The decision | What we chose | "Sanitize in post_process(), not relax schema" |
| Code snippet | Executable proof | The actual fix |

## Constraints

- **Engineer ownership:** Human must be able to explain any decision without the agent
- **Token discipline:** Sessions stay under 80k via deliberate fork-and-condense
- **Vendor agnostic:** Works with any agent via file read/write or copy/paste
- **Grep-optimized:** Artifacts designed for surgical reads via `grep → read_files`
- **Journalism quality:** Logs are onboarding documents, not bullet points

## Companion Tools

| Tool | Distribution | Purpose |
|------|--------------|---------|
| `gsd-lite` | `uvx gsd-lite@latest install` | Scaffold artifacts + agent config |
| `@luutuankiet/gsd-reader` | `npx @luutuankiet/gsd-reader` | Interactive WORK.md viewer with live reload |
| `fs-mcp` | `uvx fs-mcp@latest` | Filesystem MCP server for durable writes |

**Typical remote workflow:**
```bash
# On remote server
uvx gsd-lite@latest install --local   # Scaffold gsd-lite/ artifacts
uvx fs-mcp@latest --port 8124 &       # Start filesystem MCP
npx @luutuankiet/gsd-reader &         # Start worklog viewer on :3000

# On local machine
ssh -L 3000:localhost:3000 -L 8124:localhost:8124 remote
# Browser: localhost:3000 (reader), OpenCode connects to localhost:8124 (fs-mcp)
```

## Operational Philosophy

### The Fork-Safe Workflow

GSD-Lite is designed for **Non-Linear Development**. The tooling architecture enforces a clean separation between ephemeral reasoning and durable state.

| Layer | Tool | Persistence | Purpose |
|-------|------|-------------|---------|
| **Reasoning** | OpenCode | Ephemeral | Explore ideas, fork freely, undo mistakes |
| **Execution** | fs-mcp | Durable | Commit decisions, write artifacts, persist code |

**The Rule:** *"Reason in the chat, Commit via the tool."*

### Why This Matters

OpenCode's native file operations are **session-scoped**. When you fork or undo, file changes revert. This is dangerous for GSD-Lite artifacts—you could lose a LOG entry by forking.

**The Solution:** All filesystem I/O goes through `fs-mcp`, an external MCP server. Because it's external to OpenCode's undo stack:
- **Forks** don't revert file writes
- **Undos** don't erase committed decisions
- **WORK.md** becomes a true "forward-only" journal

### The Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  OpenCode (from ~/)           fs-mcp (project root)         │
│  ─────────────────            ─────────────────────         │
│  • Spawned from $HOME         • Connected to /dev/gsd_lite  │
│  • projectID = "global"       • Absolute paths in outputs   │
│  • Context is forkable        • Writes are permanent        │
│  • Undo reverts chat state    • Undo has no effect          │
└─────────────────────────────────────────────────────────────┘
```

**Practical Implication:**
When evaluating past sessions (see LOG-032 to LOG-035), we cannot use OpenCode's `projectID` to identify which project a session touched. Instead, we **fingerprint** sessions by parsing absolute paths from `fs-mcp` tool call outputs.

## Philosophy

**Agents are brilliant but ephemeral.** They can reason through complex problems, spot patterns humans miss, and execute with precision. But when the session ends, that brilliance evaporates.

**Engineers are permanent.** They stake their reputation on the code. They get paged at 2am. They explain to the team lead why this approach was chosen. They onboard the next engineer who inherits the system.

**GSD-Lite bridges the gap.** It captures the agent's brilliance in artifacts that the engineer owns, comprehends, and can defend. The engineer learns from the best (the agent's reasoning) while maintaining the ability to stand behind every decision.

> *"I may or may not write the code, but I understand the reasoning for the final code that got written."*

---
*Dogfood instance: Using GSD-Lite to build GSD-Lite*
