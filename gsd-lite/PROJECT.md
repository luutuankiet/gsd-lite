# GSD-Lite

*Initialized: 2025-08-01*

## What This Is

A pair programming protocol for AI agents, distributed as an npm package. Engineers run `npx @luutuankiet/gsd-lite` in any project to install a Claude Code agent that turns Claude into a thinking partner — one that challenges assumptions, teaches concepts, and ensures the human owns every decision.

## Core Value

Every decision is documented with rationale, so any engineer can pick up where the last session left off — zero context loss between sessions.

## Success Criteria

Project succeeds when:
- [x] `npx @luutuankiet/gsd-lite` installs cleanly into any project
- [x] Existing `.claude/` config (hooks, permissions, other agents) is never clobbered
- [x] Agent activates automatically via `settings.json` on `claude` start
- [x] Slash commands (`/gsd learn`, `/gsd new-project`, `/gsd map-codebase`, `/gsd progress`) work
- [x] Artifacts (WORK.md, PROJECT.md, etc.) are preserved on re-run
- [x] 14 automated tests pass covering all safety guarantees
- [ ] Engineers on team can self-onboard using `/gsd learn` without help
- [ ] Multi-vendor support (Gemini CLI, future) via protocol abstraction

## Context

Evolved from a Python/PyPI package (v1.x) that required `pip install gsd-lite` and targeted a custom `.opencode/` directory structure. v2.0 is a complete rewrite:
- Zero-dependency Node.js CLI (no Python, no typer, no rich)
- Targets Claude Code's native `.claude/` directory structure
- Stripped MCP sandbox constraints — agent uses native tools
- Merged from `luutuankiet/gsd-lite-src` (legacy preserved there)

## Constraints

- **Claude Code only (v2.0):** Multi-vendor (Gemini CLI) deferred to future phase
- **Zero npm dependencies:** CLI must use only Node.js builtins
- **Non-destructive installs:** Must never break existing Claude Code configuration
