# Requirements: Data Engineering Copilot Patterns

**Defined:** 2026-01-19
**Core Value:** Maintain ownership of the reasoning process - stay the author who can explain the "why"

## v1 Requirements

### Session Handoff

- [ ] **HANDOFF-01**: LOOPS.md template (format, structure, lifecycle for ephemeral working memory)
- [ ] **HANDOFF-02**: Loop capture protocol (agent proposes loops, user approves workflow)
- [ ] **HANDOFF-03**: CONTEXT.md template (what's loaded, exclusions, token budget tracking)
- [ ] **HANDOFF-04**: Session summary generation (loops + context decisions for export)
- [ ] **HANDOFF-05**: TickTick export format specification
- [ ] **HANDOFF-06**: Context import protocol (how to bring clarified loops back into future sessions)

### Context Engineering

- [ ] **CONTEXT-01**: Context scoping framework (how to decide what to load vs exclude for any project)
- [ ] **CONTEXT-02**: Token budget management patterns (staying within 1k-5k across different scenarios)
- [ ] **CONTEXT-03**: Progressive context loading strategy (start narrow → expand when needed)
- [ ] **CONTEXT-04**: Context decision documentation pattern (why this scope? what did we exclude?)
- [ ] **CONTEXT-05**: Context optimization tools and techniques (dbt-mp as example, broader AEOps patterns)
- [ ] **CONTEXT-06**: Large codebase navigation patterns (handling 200+ file lineages)

### Educational

- [ ] **EDUC-01**: GSD mechanics explanations in templates (why artifacts exist, how they work)
- [ ] **EDUC-02**: Data engineering pattern explanations (why these approaches work)
- [ ] **EDUC-03**: 30-minute onboarding guide (enables colleague to do + understand)

### Meta

- [ ] **META-01**: All templates heavily commented to teach through use
- [ ] **META-02**: File-based protocol works via MCP or copy/paste
- [ ] **META-03**: Validate patterns on real dbt refactoring work

## v2 Requirements

### Task Breakdown Templates

- **TASK-01**: Refactor scenario template (changing model grain, managing downstream dependencies)
- **TASK-02**: Test failure debugging template (root cause analysis, fix verification)
- **TASK-03**: New model creation template (from requirements to implementation)
- **TASK-04**: Pipeline debugging template (production issues, data quality problems)

### Pair Programming Workflows

- **PAIR-01**: Problem articulation protocol (user explains problem before agent solves)
- **PAIR-02**: Reasoning trail documentation (capturing "why" for PR narratives)
- **PAIR-03**: Root cause analysis template (structured investigation approach)
- **PAIR-04**: Proof of correctness patterns (validation and verification strategies)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-agent orchestration | Priority 2 - focus on single session optimization first |
| Vendor-specific features | Must work with any agent via file protocol or copy/paste |
| Code deliverables | This project produces documentation and templates only |
| Generic productivity patterns | Focus specifically on data engineering + AEOps workflows |
| Real-time collaboration | Solo work patterns only, not team-based workflows |
| Custom tooling development | Document patterns, don't build new tools (dbt-mp already exists) |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|

**Coverage:**
- v1 requirements: 18 total
- Mapped to phases: 0 (pending roadmap creation)
- Unmapped: 18 ⚠️

---
*Requirements defined: 2026-01-19*
*Last updated: 2026-01-19 after initial definition*
