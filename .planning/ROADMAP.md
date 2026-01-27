# Roadmap: Data Engineering Copilot Patterns

## Overview

Build a knowledge base of vendor-agnostic patterns for using AI copilots in data engineering workflows. Establish file-based protocols and heavily-commented templates that teach both GSD mechanics and data engineering patterns. Ship session handoff system first (eliminate 15-30 min context reconstruction), then layer in context engineering patterns (handling 200+ model lineages), and validate on real dbt refactoring work.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 0: GSD Pattern Analysis** - Reference setup (completed via Quick 001)
- [x] **Phase 1: Foundation & Templates** - File-based protocol and template structure
- [ ] **Phase 1.1: Allow Flexible Token Budget** - Handle token budget flexibility (INSERTED)
- [x] **Phase 1.2: Audit and Fix Template Coherence** - Fix template coherence for single-agent sessions (INSERTED)
- [x] **Phase 1.3: Context Lifecycle, Coaching Model & Workflow Decomposition** - User-controlled context, coaching philosophy, per-workflow files (INSERTED)
- [ ] **Phase 1.4: Enrich Checkpoint Workflow** - Enrich checkpoint workflow (INSERTED)
- [x] **Phase 1.5: Evaluation Framework for GSD-lite** - Simulated repo + prompts + reference responses + eval notes for iterative QC (INSERTED)
- [ ] **Phase 1.6: Fix Agent Overriding Examples** - Fix agent overriding scaffolded files (INSERTED)
- [ ] **Phase 1.7: Refactor Artifacts for Grep Synergy** - Refactor artifacts and protocols for grep workflows (INSERTED)
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

### Phase 1.3: Context Lifecycle, Coaching Model & Workflow Decomposition (INSERTED)
**Goal**: Define GSD-lite's context control strategy (checkpoint → clear → resume), coaching philosophy (user owns outcome, agent guides), and decompose monolithic protocol into per-workflow files
**Depends on**: Phase 1.2
**Requirements**: None (architecture/vision work)
**Success Criteria** (what must be TRUE):
  1. Context lifecycle documented (when to checkpoint, when to clear, how to resume)
  2. Coaching philosophy articulated (user owns outcome, agent is thinking partner)
  3. PROTOCOL.md decomposed into per-workflow files under `src/gsd_lite/template/workflows/`
  4. Sticky note protocol included in ALL workflow files (universal orientation)
  5. All ASCII art removed, replaced with markdown headers + mermaid diagrams
  6. Eval findings (Claude Sonnet, Gemini 3.0 Pro) analyzed through coaching lens
  7. GSD-lite vs OG GSD architectural differences documented

**Deliverables:**
- `src/gsd_lite/template/workflows/moodboard.md` — Dream extraction mode
- `src/gsd_lite/template/workflows/whiteboard.md` — Plan proposal mode
- `src/gsd_lite/template/workflows/execution.md` — Task execution mode
- `src/gsd_lite/template/workflows/checkpoint.md` — Context clearing for cross-session work
- `src/gsd_lite/template/workflows/promotion.md` — Phase completion and WORK.md trimming
- `src/gsd_lite/template/PROTOCOL.md` — Minimal entrypoint (which workflow to load)
- `src/gsd_lite/template/STATE.md` — Updated with mode tracking
- `eval/ANALYSIS.md` — Eval findings with architectural insights

**Plans:** 5 plans

Plans:
- [x] 01.3-01-PLAN.md — Extract moodboard and whiteboard workflows
- [x] 01.3-02-PLAN.md — Extract execution and checkpoint workflows
- [x] 01.3-03-PLAN.md — Create minimal PROTOCOL.md router and update STATE.md template
- [x] 01.3-04-PLAN.md — Analyze eval findings (coaching + architectural lens)
- [x] 01.3-05-PLAN.md — Verify workflow decomposition, fixes, and human review

### Phase 1.4: Enrich Checkpoint Workflow (INSERTED)
**Goal**: Enhance checkpoint workflow to preserve work-in-progress state with Current Understanding section and type-tagged session logs
**Depends on**: Phase 1.3
**Requirements**: None (enhancement to existing checkpoint workflow)
**Success Criteria** (what must be TRUE):
  1. Fresh agent can resume multi-session work in 30 seconds by reading Current Understanding
  2. Session logs capture all work types (vision, decisions, plans, execution, blockers)
  3. Type tags enable non-linear retrieval via grep
  4. User can revisit planning decisions without restarting discovery
  5. WORK.md semantic fits moodboard/whiteboard/execution modes

**Plans:** 2 plans

Plans:
- [x] 01.4-01-PLAN.md — Update WORK.md template and checkpoint workflow
- [x] 01.4-02-PLAN.md — Create revisit workflow and verify templates

### Phase 1.5: Evaluation Framework for GSD-lite (INSERTED)
**Goal**: Build evaluation sequence in ./tests/eval_gsd_lite with simulated repo setup, step-by-step prompts, reference agent responses, and eval notes framework for iterative QC
**Depends on**: Phase 1.4
**Requirements**: None (testing/evaluation infrastructure)
**Success Criteria** (what must be TRUE):
  1. Simulated code repo can be set up reproducibly for evaluation scenarios
  2. Step-by-step prompts document the full GSD-lite workflow from setup to enhancement
  3. Reference responses capture expected agent behavior at each step
  4. Eval notes framework enables tracking failure modes and iteration insights
  5. User can iterate on GSD-lite templates and measure improvement

**Plans:** 2 plans

Plans:
- [x] 01.5-01-PLAN.md — Simulation Sandbox Setup
- [x] 01.5-02-PLAN.md — Evaluation Protocol & Tools

### Phase 1.6: Fix Agent Overriding Examples in Scaffolded File (INSERTED)
**Goal**: Fix agent overriding examples in scaffolded file - urgent work discovered after Phase 1.5 completion
**Depends on**: Phase 1.5
**Requirements**: None (prompt engineering enhancement)
**Success Criteria** (what must be TRUE):
  1. Agents check file existence before initializing artifacts
  2. Agents read and adopt existing files instead of overwriting
  3. Protocol explicitly forbids overwriting existing artifacts

**Plans:** 1 plan

Plans:
- [ ] 01.6-01-PLAN.md — Update Templates with Safety Protocol

**Details:**
- Note: commands are under ~/.config/opencode

### Phase 1.7: Refactor Artifacts and Protocols and Workflows to Synergy with Grep (INSERTED)

**Goal:** Restructure GSD-lite artifacts for grep-optimized retrieval and revamp coaching philosophy to pair programming model
**Depends on:** Phase 1.6
**Requirements:** None (refactor + philosophy work)
**Success Criteria** (what must be TRUE):
  1. WORK.md has 3-part grep-friendly structure (Current Understanding, Key Events Index, Atomic Log)
  2. STATE.md merged into WORK.md (deprecated as separate file)
  3. All workflows encode pair programming philosophy (thinking partners, not visionary/builder)
  4. First-turn protocol prevents artifact writes before conversation
  5. housekeeping.md replaces promotion.md for perpetual WORK.md management
  6. README explains philosophy, artifacts, and provides session walkthrough
  7. All templates pass coherence verification (no orphan references, consistent log format)

**Deliverables:**
- WORK.md template with grep-friendly 3-part structure
- housekeeping.md workflow (replaces promotion.md)
- All workflows updated with pair programming philosophy
- README.md with philosophy, artifact overview, walkthrough, maintainer's guide

**Plans:** 4 plans

Plans:
- [ ] 01.7-01-PLAN.md — Restructure WORK.md and create housekeeping workflow
- [ ] 01.7-02-PLAN.md — Update all workflows with pair programming philosophy
- [ ] 01.7-03-PLAN.md — Create README with philosophy and maintainer's guide
- [ ] 01.7-04-PLAN.md — Final coherence verification

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
Phases execute in numeric order: 0 → 1 → 1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6 → 1.7 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 0. GSD Pattern Analysis | N/A | Completed (Quick 001) | 2026-01-20 |
| 1. Foundation & Templates | 4/4 | Completed | 2026-01-22 |
| 1.1. Allow Flexible Token Budget (INSERTED) | 0/TBD | Not started | - |
| 1.2. Audit and Fix Template Coherence (INSERTED) | 3/3 | Completed | 2026-01-23 |
| 1.3. Context Lifecycle & Workflow Decomposition (INSERTED) | 5/5 | Completed | 2026-01-25 |
| 1.4. Enrich Checkpoint Workflow (INSERTED) | 2/2 | Completed | 2026-01-25 |
| 1.5. Evaluation Framework for GSD-lite (INSERTED) | 2/2 | Completed | 2026-01-26 |
| 1.6. Fix Agent Overriding Examples in Scaffolded File (INSERTED) | 0/TBD | Not started | - |
| 1.7. Refactor Artifacts for Grep Synergy (INSERTED) | 4/4 | Completed | 2026-01-27 |
| 2. Session Handoff System | 0/TBD | Not started | - |

---
*Roadmap created: 2026-01-19*
*Last updated: 2026-01-27 (Completed 01.7-04 - Phase 1.7 complete)*
