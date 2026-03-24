# Work Log

## 1. Current Understanding

<current_mode>
pair_programming
</current_mode>

<active_task>
</active_task>

<parked_tasks>
- Multi-vendor support (Gemini CLI) — deferred to future phase
- Port mermaid syntax preferences to agent template
- Port response formatting standard to agent template
</parked_tasks>

<vision>
Distribute GSD-Lite as an npm package that engineers can install in any project to get a structured pair programming experience with Claude Code. Zero friction onboarding — npx install, start claude, go.
</vision>

<decisions>
- Claude-first, local mode only (no MCP sandbox, no remote filesystem)
- Zero npm dependencies (Node.js builtins only)
- Settings merge strategy: only add agent key, never delete existing config
- Scoped file writes: only touch agents/gsd-lite.md and commands/gsd/
- Package scoped under @luutuankiet npm org
- Legacy Python codebase preserved at luutuankiet/gsd-lite-src
</decisions>

<blockers>
</blockers>

<next_action>
Team onboarding — have colleagues run npx @luutuankiet/gsd-lite and validate /gsd learn experience
</next_action>

---

## 2. Key Events

| Date | Event | Impact |
|---|---|---|
| 2026-03-24 | Converted from Python/PyPI to Node.js/npm package | Complete restructuring — v2.0.0 |
| 2026-03-24 | Fixed settings.json merge to preserve client config | Safe install — never clobbers hooks/permissions |
| 2026-03-24 | Added 14 automated install safety tests | Regression protection for all install scenarios |
| 2026-03-24 | Added name field to agent frontmatter | Claude Code agent discovery requirement |
| 2026-03-24 | Added Claude Code mechanics section to README | 4 Mermaid diagrams bridging concepts to internals |
| 2026-03-24 | Published @luutuankiet/gsd-lite v2.0.1 to npm | Package live for team use |
| 2026-03-24 | Mirrored legacy repo to luutuankiet/gsd-lite-src | All Python source, plugins, planning preserved |

---

## 3. Atomic Session Log

### [LOG-001] - [DECISION] [EXEC] - Convert gsd-lite from Python to npm package - Task: TASK-001
**Timestamp:** 2026-03-24 03:00
**Depends On:** None (initial)

---

#### Decision: Package Format

**Chosen:** Zero-dependency Node.js npm package
**Rejected alternatives:**
- Python/PyPI (v1.x) — required pip, heavy deps (typer, rich, sqlmodel, google-cloud-aiplatform), targeted wrong directory (.opencode/)
- Claude Code skill — can't set root agent via settings.json before Claude starts
- Template repo — no version management, no update path

**Rationale:** npm/npx is universal in the JS ecosystem, zero deps means no install friction, and Claude Code's .claude/ directory is the native extension point.

#### Execution Summary

| Step | Action | Status |
|---|---|---|
| 1 | Create package.json, bin/cli.mjs | Done |
| 2 | Write local-mode agent template (strip MCP constraints) | Done |
| 3 | Create slash commands (learn, progress, new-project, map-codebase) | Done |
| 4 | Write README with 9 Mermaid diagrams | Done |
| 5 | Add GitHub Actions OIDC publish workflow | Done |
| 6 | Fix settings.json merge (preserve client config) | Done |
| 7 | Add 14 install safety tests | Done |
| 8 | Add name field to agent frontmatter | Done |
| 9 | Mirror legacy repo to gsd-lite-src | Done |
| 10 | Publish v2.0.1 to npm | Done |

---

STATELESS HANDOFF
**What was decided:** GSD-Lite v2.0 ships as @luutuankiet/gsd-lite npm package with zero deps, safe settings merge, and 14 test coverage
**Next action:** Team onboarding — validate /gsd learn experience with colleagues
**If pivoting:** Multi-vendor support (Gemini CLI) tracked in GitHub issue
