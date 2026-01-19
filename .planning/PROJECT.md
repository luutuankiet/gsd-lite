# Data Engineering Copilot Patterns

## What This Is

A knowledge base of vendor-agnostic patterns and practices for using AI copilots in data engineering workflows. Templates and protocols that maintain ownership and learning while leveraging AI assistance - specifically designed to work with any agent that can read/write files (or via copy/paste).

## Core Value

Maintain ownership of the reasoning process - you stay the author who can explain the "why" behind every decision, not a passenger consuming agent output.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Session handoff protocol that eliminates 15-30 min context reconstruction
- [ ] Loop capture system (agent proposes, you approve) for non-linear reasoning in linear chat
- [ ] Session summary format (loops + context decisions) for export to GTD system
- [ ] Context engineering patterns for dbt projects (when to use dbt-mp, how to scope lineage)
- [ ] Task breakdown templates for common data work (refactors, test failures, new models, pipeline debugging)
- [ ] Pair programming workflow where user articulates problem before agent solves
- [ ] Documentation that teaches both GSD mechanics and data engineering patterns
- [ ] 30-minute onboarding guide for colleagues (enables do + understand)

### Out of Scope

- Multi-agent orchestration (priority 2 - focus on single session optimization first)
- Vendor-specific features (must work with any agent via file protocol or copy/paste)
- Code deliverables (this project produces documentation and templates only)
- Generic productivity patterns (focus specifically on data engineering workflows)

## Context

### Current State
- Using GTD methodology successfully for solo work
- Have built dbt-mp tool for token-optimized manifest parsing (97% reduction)
- Learning GSD framework itself as a user
- Testing patterns on real data engineering work (e.g., refactoring dbt models with downstream dependencies)

### Problems to Solve
Five ways current copilot workflow breaks down:

1. **Context optimization**: Dumping 500k+ token dbt manifests with no strategy
2. **Forwarder problem**: Agent fixes issues but user doesn't learn the reasoning
3. **Non-linear reasoning**: Open loops from turn 10 get buried by turn 20 in chat history
4. **Document sprawl**: PROJECT.md milestones grow indefinitely
5. **Cross-session continuity**: Every new session requires 15-30 min manual context reconstruction

### Data Engineering Context
- Working with dbt projects (400+ models in production)
- Common scenarios: model lineage can be 200+ models for a single refactor
- Using dbt-mp to create slim manifests, but need patterns for deciding what to include
- Need to produce PR narratives with reasoning, root cause analysis, and proof of correctness

### GTD Integration
- Solo work uses loops section in sticky notes
- Loops processed async through clarify → next action → close
- Ephemeral session working memory should export to TickTick for async GTD processing
- Clarified loops return as context for future sessions

## Constraints

- **Vendor agnostic**: Must work with any agent (Claude API, ChatGPT, Cursor, etc.) - minimal requirement is file read/write or copy/paste
- **File-based protocol**: Patterns built on maintaining artifacts (LOOPS.md, CONTEXT.md, etc.) regardless of agent capabilities
- **Educational focus**: Learning GSD itself, so include "why" explanations for both GSD mechanics and data engineering patterns
- **Deliverable type**: Markdown documentation and templates only, not code
- **Token budget**: Context documents should stay within 1k-5k tokens per task (vendor-agnostic fixed limit)
- **GTD velocity**: Maintain "close tasks fast, minimal maintenance" principle

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Ephemeral session loops | Session working memory exports to TickTick; avoids cross-session maintenance burden | — Pending |
| Agent proposes loops, user approves | User stays in key reasoning, agent handles articulation | — Pending |
| Session summary = loops + context | Supports GTD capture and learning from context decisions | — Pending |
| Templates as documentation | Heavily commented templates teach patterns through use | — Pending |
| File-based protocol | Works across all agent types (MCP, copy/paste, etc.) | — Pending |
| Research decides milestone structure | Not yet clear if all 4 patterns in one milestone or separate | — Pending |

---
*Last updated: 2026-01-19 after initialization*
