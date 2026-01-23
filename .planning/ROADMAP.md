# Roadmap: Data Engineering Copilot Patterns

## Overview

Build a knowledge base of vendor-agnostic patterns for using AI copilots in data engineering workflows. Establish file-based protocols and heavily-commented templates that teach both GSD mechanics and data engineering patterns. Ship session handoff system first (eliminate 15-30 min context reconstruction), then layer in context engineering patterns (handling 200+ model lineages), and validate on real dbt refactoring work.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 0: GSD Pattern Analysis** - Reference setup (completed via Quick 001)
- [ ] **Phase 0.1: Integrate GSD Patterns** - Reflect Quick 001 findings into planning docs (INSERTED)
- [x] **Phase 1: Foundation & Templates** - File-based protocol and template structure
- [ ] **Phase 1.1: Allow Flexible Token Budget** - Handle token budget flexibility (INSERTED)
- [ ] **Phase 1.2: Audit and Fix Template Coherence** - Fix template coherence for single-agent sessions (INSERTED)
- [ ] **Phase 2: Session Handoff System** - Eliminate context reconstruction between sessions
- [ ] **Phase 3: Context Engineering Patterns** - Token budget management and context optimization
- [ ] **Phase 4: Educational Integration & Validation** - Teach through templates and validate on real work

## Phase Details

### Phase 0: GSD Pattern Analysis
**Goal**: Analyze Get-Shit-Done framework patterns for application to data engineering copilot workflows
**Depends on**: Nothing (initial setup)
**Requirements**: None (discovery/research phase)
**Status**: Completed via Quick Task 001

**Completed work:**
- Created `gsd_reference/` directory (89 files, reference copy of .claude)
- Created `.planning/GSD_PATTERNS.md` (647 lines, comprehensive pattern analysis)
- Identified 8 core GSD patterns with rationale
- Created phase-specific integration roadmap for Phases 1-4
- Made key decisions: XML structure, conservative token budgets (20/40/50%), checkpoint thinking

**Reference:** [Quick Task 001](.planning/quick/001-duplicate-claude-to-gsd-reference-and-su/)

### Phase 0.1: Integrate GSD Patterns (INSERTED)
**Goal**: Reflect Quick 001 findings into planning docs - ensure decisions and patterns are properly integrated before Phase 1 execution
**Depends on**: Phase 0
**Requirements**: None (integration work)
**Success Criteria** (what must be TRUE):
  1. Key decisions from GSD_PATTERNS.md reflected in PROJECT.md Key Decisions table
  2. Phase 1-4 details updated with GSD pattern applications from integration roadmap
  3. REQUIREMENTS.md updated if GSD patterns suggest new requirements
  4. Directory structure decisions (`.project/sessions/`) documented

**Plans:** 1 plan

Plans:
- [ ] 00.1-01-PLAN.md — Integrate GSD pattern findings into PROJECT.md, ROADMAP.md, and REQUIREMENTS.md

### Phase 1: Foundation & Templates
**Goal**: Establish file-based protocol and heavily-commented template approach that works across all agent types
**Depends on**: Nothing (first phase)
**Requirements**: META-01, META-02
**Success Criteria** (what must be TRUE):
  1. Templates have inline explanations of GSD mechanics (why artifacts exist, how they work)
  2. File-based protocol works via both MCP and copy/paste without modification
  3. User can read any template and understand both what to do and why

**Plans:** 4 plans

Plans:
- [x] 01-01-PLAN.md — Core Templates (LOOPS, CONTEXT, STATE)
- [x] 01-02-PLAN.md — Session Templates (BOOTLOADER, SUMMARY, README)
- [x] 01-03-PLAN.md — Protocol Documentation (PROTOCOL_REFERENCE, AGENTS.md)
- [x] 01-04-PLAN.md — Human Verification (templates clear and actionable)

### Phase 1.1: Allow Flexible Token Budget (INSERTED)
**Goal**: Handle token budget flexibility - urgent work discovered after Phase 1 completion
**Depends on**: Phase 1
**Requirements**: TBD (to be defined during planning)
**Success Criteria** (what must be TRUE):
  1. TBD (to be defined during planning)

**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd:plan-phase 1.1 to break down)

### Phase 1.2: Audit and Fix Template Coherence for Single-Agent Sessions (INSERTED)
**Goal**: Refactor GSD-lite templates into 5-file structure optimized for single-agent sessions with weaker reasoning models
**Depends on**: Phase 1
**Requirements**: None (consolidation/refactor work)
**Success Criteria** (what must be TRUE):
  1. gsd_lite/ contains exactly 5 files: PROTOCOL.md, STATE.md, WORK.md, INBOX.md, HISTORY.md
  2. PROTOCOL.md is self-contained and foolproof for weak agents
  3. STATE.md template captures moderate depth for session resume
  4. INBOX.md supports loop capture from both user and agent
  5. No redundant files remain (README, INIT_PROMPT, BOOTLOADER consolidated or removed)
  6. A human can read the protocol and understand the entire workflow

**Plans:** 3 plans

Plans:
- [x] 01.2-01-PLAN.md — Create PROTOCOL.md (single entrypoint with all behavioral rules)
- [x] 01.2-02-PLAN.md — Create supporting templates (STATE.md, WORK.md, INBOX.md, HISTORY.md)
- [x] 01.2-03-PLAN.md — Cleanup redundant files and human verification

### Phase 2: Session Handoff System
**Goal**: Create ephemeral working memory system that exports to GTD and eliminates 15-30 min context reconstruction
**Depends on**: Phase 1
**Requirements**: HANDOFF-01, HANDOFF-02, HANDOFF-03, HANDOFF-04, HANDOFF-05, HANDOFF-06
**Success Criteria** (what must be TRUE):
  1. User can capture loops during session (agent proposes, user approves workflow)
  2. User can generate session summary showing loops and context decisions
  3. User can export session working memory to TickTick for GTD processing
  4. User can import clarified loops from GTD back into future sessions
  5. User can track token budget (what's loaded, what's excluded, why)

Plans:
- TBD (to be defined during phase planning)

### Phase 3: Context Engineering Patterns
**Goal**: Enable context optimization for large codebases (200+ file lineages) while staying within 1k-5k token budgets
**Depends on**: Phase 2
**Requirements**: CONTEXT-01, CONTEXT-02, CONTEXT-03, CONTEXT-04, CONTEXT-05, CONTEXT-06
**Success Criteria** (what must be TRUE):
  1. User can scope context for any project type (not just dbt)
  2. User can stay within token budget across different scenarios
  3. User can start narrow and expand context progressively when needed
  4. User can document context decisions (why this scope? what was excluded?)
  5. User can navigate large codebases using dbt-mp and similar AEOps patterns

Plans:
- TBD (to be defined during phase planning)

### Phase 4: Educational Integration & Validation
**Goal**: Thread educational content through all templates and validate patterns on real dbt refactoring work
**Depends on**: Phase 3
**Requirements**: EDUC-01, EDUC-02, EDUC-03, META-03
**Success Criteria** (what must be TRUE):
  1. Every template explains both GSD mechanics and data engineering patterns
  2. 30-minute onboarding guide enables colleague to do and understand
  3. Patterns validated on real dbt refactoring (200+ model lineage scenario)
  4. User can produce PR narrative with reasoning, not just code changes

Plans:
- TBD (to be defined during phase planning)

## Progress

**Execution Order:**
Phases execute in numeric order: 0 → 0.1 → 1 → 1.1 → 1.2 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 0. GSD Pattern Analysis | N/A | Completed (Quick 001) | 2026-01-20 |
| 0.1. Integrate GSD Patterns (INSERTED) | 0/1 | Not started | - |
| 1. Foundation & Templates | 4/4 | Completed | 2026-01-22 |
| 1.1. Allow Flexible Token Budget (INSERTED) | 0/TBD | Not started | - |
| 1.2. Audit and Fix Template Coherence (INSERTED) | 3/3 | Completed | 2026-01-23 |
| 2. Session Handoff System | 0/TBD | Not started | - |
| 3. Context Engineering Patterns | 0/TBD | Not started | - |
| 4. Educational Integration & Validation | 0/TBD | Not started | - |

---
*Roadmap created: 2026-01-19*
*Last updated: 2026-01-23 (Phase 1.2 completed - 5-file GSD-lite structure verified)*
