---
version: 1.0
updated: 2026-01-21
purpose: Session export for GTD integration
template_type: summary
---

# SUMMARY Template

## Purpose

The SUMMARY template exports ephemeral session working memory to your GTD system (TickTick, Things, etc.) and captures learning from context decisions. This template solves the "context reconstruction" problem where every new session requires 15-30 minutes to rebuild what you were working on.

**What SUMMARY does:**
1. **Export loops to GTD**: Closed loops → Achievements, Open loops → Next actions, Clarifying loops → Waiting for
2. **Document context decisions**: What was loaded, what was excluded, why (learning for future sessions)
3. **Capture session metadata**: Duration, phase/task, token budget peak (performance tracking)
4. **Enable session resume**: Next session prep section eliminates reconstruction time

**Why this matters:** Session working memory is ephemeral - LOOPS.md and CONTEXT.md are temporary artifacts that exist only during active work. SUMMARY extracts the durable pieces (completed work, open questions, context patterns) and exports them to your permanent GTD system for async processing.

**GTD Integration:** Solo work processes loops through clarify → next action → close cycle. Session SUMMARY provides the raw material for that processing, keeping session artifacts lean while maintaining GTD capture discipline.

## Template Structure

### 1. Session Metadata

Track when, how long, what phase, and how much context was used.

```yaml
---
session_date: YYYY-MM-DD
session_duration: [X hours Y minutes]
phase: [Phase number/name]
task: [Specific task or goal]
token_budget_peak: [used]/[total] ([percentage]%)
artifacts_created: [count]
---
```

**Why session metadata:**
- **Audit trail**: When did this work happen? What was the focus?
- **Velocity tracking**: How long do sessions typically take? (informs planning)
- **Context patterns**: What token budget phases are common? (informs future scoping)
- **Learning**: Correlate session outcomes with metadata (e.g., "50%+ budget = poor results")

**Example:**
```yaml
---
session_date: 2026-01-21
session_duration: 2 hours 15 minutes
phase: 01-foundation-templates
task: Create BOOTLOADER and SUMMARY templates
token_budget_peak: 2300/5000 (46%)
artifacts_created: 2
---
```

### 2. Loops Captured

All loops from session with status and outcome. This section exports directly to GTD for async processing.

```markdown
## Loops Captured

### Closed Loops (Achievements)

**LOOP-001** (Closed): Loop ID scope - global or per-session?
- **Context**: BOOTLOADER template needed ID scope specification
- **Resolution**: Decided globally unique IDs across all sessions (prevents collisions when importing from GTD)
- **Outcome**: Updated BOOTLOADER and LOOPS templates with global uniqueness requirement
- **Closed**: 2026-01-21T16:45:00Z

**LOOP-002** (Closed): Token budget thresholds for data engineering
- **Context**: Needed conservative thresholds for dbt lineage scenarios
- **Resolution**: Adopted 20/40/50% phases (comfortable/deliberate/warning) from GSD patterns
- **Outcome**: Documented in CONTEXT_TEMPLATE with rationale
- **Closed**: 2026-01-21T17:30:00Z

### Open Loops (Next Actions)

**LOOP-003** (Open): Verify sticky note visual fatigue threshold
- **Context**: User feedback needed on whether sticky notes create too much visual overhead
- **Question**: Does every-turn sticky note help or hinder? When to omit?
- **Next action**: Test with Phase 2 real session, gather feedback
- **Captured**: 2026-01-21T18:00:00Z

### Clarifying Loops (Waiting For)

**LOOP-004** (Clarifying): Confirm AGENTS.md support in ChatGPT web UI
- **Context**: Research found AGENTS.md standard backed by OpenAI, unclear if web UI reads it
- **Question**: Does ChatGPT web actually load .gsd-lite/AGENTS.md or only API/Cursor?
- **Waiting for**: User to test with ChatGPT web and report back
- **Captured**: 2026-01-21T18:15:00Z
```

**Why loops section:**
- **GTD capture**: Closed → log as achievements, Open → convert to next actions, Clarifying → add to waiting-for
- **Context preservation**: Loop includes enough context to resume without re-reading full chat history
- **Learning**: Patterns in closed loops reveal what questions recur (inform future templates)

**Status definitions:**
- **Closed**: Question resolved, decision made, action complete
- **Open**: Needs work, clear next action, ready to execute
- **Clarifying**: Blocked on external input, unclear scope, needs discussion

### 3. Context Decisions

Document what was loaded, what was excluded, and why. This captures learning for future sessions.

```markdown
## Context Decisions

### What Was Loaded

**Core context** (1200 tokens):
- `.gsd-lite/PROJECT.md` (450 tokens) - North star goals
- `.gsd-lite/ROADMAP.md` (380 tokens) - Current phase context
- `.gsd-lite/phases/01-foundation-templates/01-CONTEXT.md` (370 tokens) - Phase decisions

**Reference implementations** (850 tokens):
- `gsd_lite/BOOTLOADER_PROMPT.md` (320 tokens) - Tested sticky note pattern
- `gsd_lite/template_gsd_lite/03_BOOTLOADER_TEMPLATE.md` (280 tokens) - Template structure
- `.gsd-lite/GSD_PATTERNS.md` (250 tokens) - Pattern analysis

**Research** (250 tokens):
- `.gsd-lite/phases/01-foundation-templates/01-RESEARCH.md` (selected sections) - Sticky note protocol, XML patterns

**Total loaded**: 2300 tokens (46% of 5000 budget)

### What Was Excluded

**Test files** (saved ~1200 tokens):
- Pattern: `tests/**/*.md`
- Rationale: Template creation doesn't require test file context

**Legacy documentation** (saved ~800 tokens):
- Files: Old planning docs, archived sessions
- Rationale: Phase 1 work uses fresh context from CONTEXT.md decisions, not prior attempts

**Implementation code** (saved ~1500 tokens):
- Pattern: `*.py`, `*.sql`, `*.js`
- Rationale: Building templates (documentation), not code - no need for implementation files

**Total excluded**: 3500 tokens

### Why This Worked

**Token budget stayed comfortable**: 46% peak, never hit warning phase (50%). Conservative scoping paid off.

**Key decision**: Loaded reference implementations (gsd_lite) instead of trying to extrapolate from GSD framework alone. Seeing tested patterns reduced guessing, improved template quality.

**Exclusion principle**: "Is this file essential to the current task?" If no, exclude. Prevented scope creep.

**Pattern to reuse**: When building documentation, exclude code. When building code, exclude tests initially (add later if needed).
```

**Why context decisions:**
- **Learning**: What scoping strategies worked? What can be reused?
- **Replication**: Future sessions can apply same patterns (e.g., "exclude tests when building docs")
- **Audit**: If something went wrong, trace back to what was loaded/excluded
- **Teaching**: Educational value for colleagues - shows thought process behind context choices

### 4. Artifacts Created

List all files written during session with brief description.

```markdown
## Artifacts Created

**Templates** (2 files):
1. `.gsd-lite/templates/BOOTLOADER_TEMPLATE.md` (352 lines)
   - Session initialization protocol
   - Sticky note template for protocol enforcement
   - Dual instructions (MCP + copy-paste)
   - Example session showing 3-turn workflow

2. `.gsd-lite/templates/SUMMARY_TEMPLATE.md` (current file)
   - Session export structure
   - GTD integration format
   - Context decision capture

**Session artifacts** (3 files):
1. `.project/sessions/2026-01-21-bootloader-summary/STATE.md`
   - Phase tracking, loop count, token budget
   - Updated after each task completion

2. `.project/sessions/2026-01-21-bootloader-summary/LOOPS.md`
   - Captured 4 loops (2 closed, 1 open, 1 clarifying)

3. `.project/sessions/2026-01-21-bootloader-summary/CONTEXT.md`
   - Loaded files with token counts
   - Exclusion patterns with rationale
```

**Why artifacts section:**
- **Deliverables**: What did this session produce?
- **Review**: User can quickly scan what exists without exploring directories
- **Continuity**: Next session knows what artifacts are available

### 5. Checkpoints Reached

Document decision points, approvals, and verifications during session.

```markdown
## Checkpoints Reached

### Decision Checkpoints

**Checkpoint 1**: Loop ID scope (global vs per-session)
- **Decision**: Global uniqueness across all sessions
- **Rationale**: Prevents ID collisions when importing loops from GTD back into new sessions
- **Impact**: BOOTLOADER and LOOPS templates specify global IDs

**Checkpoint 2**: Token budget thresholds
- **Decision**: 20/40/50% phases (comfortable/deliberate/warning)
- **Rationale**: More conservative than GSD 30/50/70% - data engineering lineage can explode context quickly
- **Impact**: CONTEXT_TEMPLATE documents these thresholds with data engineering examples

### Approval Checkpoints

**Checkpoint 3**: Sticky note template format
- **Proposed**: ```gsd-status fenced block with UPDATED, CURRENT STATE, AVAILABLE ACTIONS, NEXT fields
- **Approved**: Structure clear, parseable, visible
- **Result**: Implemented in BOOTLOADER example session

### Verification Checkpoints

**Checkpoint 4**: BOOTLOADER template completeness
- **Verified**: Contains sticky note template, protocol checklist, dual instructions, recovery protocol
- **Method**: grep checks for required sections, line count verification
- **Result**: All criteria met, Task 1 complete
```

**Why checkpoints:**
- **Decision trail**: What choices were made and why?
- **Approval record**: What did user explicitly approve vs agent assumptions?
- **Quality gate**: What verification steps ensured correctness?

### 6. Next Session Prep

What to load, what context to restore, where to resume.

```markdown
## Next Session Prep

### What to Load

**Required context**:
- This SUMMARY file (context decisions, closed loops for reference)
- `.gsd-lite/templates/BOOTLOADER_TEMPLATE.md` (completed)
- `.gsd-lite/templates/SUMMARY_TEMPLATE.md` (completed)
- `.gsd-lite/phases/01-foundation-templates/01-02-PLAN.md` (current plan)

**Optional context** (load if needed):
- `.gsd-lite/phases/01-foundation-templates/01-CONTEXT.md` (decisions)
- `.gsd-lite/phases/01-foundation-templates/01-RESEARCH.md` (patterns)

**Skip loading**:
- Previous session artifacts (STATE.md, LOOPS.md from this session) - ephemeral, exported to SUMMARY
- Reference implementations (gsd_lite) - patterns extracted, no longer needed

### Context to Restore

**Phase**: 01-foundation-templates
**Plan**: 01-02 (Session Templates)
**Task**: Task 3 - Create README.md for template navigation
**Token budget**: Start fresh at 0/5000

**Loops to import**:
- LOOP-003 (Open): Verify sticky note visual fatigue threshold → test in Phase 2
- LOOP-004 (Clarifying): Confirm AGENTS.md support in ChatGPT web UI → user to test

**Decisions to carry forward**:
- Global loop IDs across sessions
- 20/40/50% token budget phases
- Sticky note format (```gsd-status structure)

### Where to Resume

**Current state**: Tasks 1-2 complete (BOOTLOADER, SUMMARY)
**Next task**: Task 3 - Create README.md
**Approach**:
1. Load this SUMMARY for context
2. Create README with template index, workflow diagram, quick start
3. Verify all 3 templates reference each other correctly
4. Complete plan, generate 01-02-SUMMARY.md
```

**Why next session prep:**
- **Eliminates reconstruction**: Don't spend 15-30 min rebuilding context
- **Selective loading**: Only import what's needed, not full session history
- **Continuity**: Resume exactly where you left off, not from vague memory

## GTD Export Format

How to process SUMMARY loops into TickTick (or your GTD system).

### Closed Loops → Achievements

Create "Logbook" or "Journal" entry:

```
✅ 2026-01-21 Session: Foundation Templates
- Resolved loop ID scope (global uniqueness)
- Defined token budget thresholds (20/40/50%)
- Created BOOTLOADER and SUMMARY templates
- Captured 4 loops, closed 2, identified 2 for follow-up
```

**Purpose**: Capture accomplishments for weekly review, motivational record

### Open Loops → Next Actions

Create tasks in relevant project:

```
Project: Data Engineering Copilot Patterns
[ ] Test sticky note visual fatigue in Phase 2 session
    Context: LOOP-003 - need user feedback on whether every-turn sticky note helps or hinders
    Next action: Run real session with sticky notes, gather subjective feedback
    Due: Phase 2 testing
```

**Purpose**: Convert open questions into actionable tasks with context

### Clarifying Loops → Waiting For

Create tasks in "Waiting For" list:

```
[ ] @waiting-for Confirm AGENTS.md support in ChatGPT web
    Context: LOOP-004 - Research claims OpenAI supports AGENTS.md, need to verify web UI actually reads it
    Blocked by: User testing with ChatGPT web UI
    Follow-up: Next planning session
```

**Purpose**: Track external dependencies, ensure nothing falls through cracks

### Context Decisions → Reference Notes

Create note in "Reference" folder:

```
Title: Context Scoping - Template Creation Pattern

When building documentation (templates, guides):
- Load: Reference implementations, decisions, research
- Exclude: Code files, tests, legacy docs
- Threshold: Stay comfortable (<20% budget) - templates don't require heavy context

Result: 46% peak budget, comfortable session, quality output

Reuse this pattern for future documentation tasks.
```

**Purpose**: Capture reusable patterns for future reference

## Learning Capture

Reflect on what worked, what didn't, patterns discovered.

```markdown
## What I Learned

### GSD Mechanics

**Sticky note protocol**:
- Embedding protocol at response end prevents agent drift (tested in gsd_lite, degraded without it)
- Fenced code block (```gsd-status) provides visual separation from content
- UPDATED field forces agent to acknowledge artifact changes explicitly

**Why this matters**: Single-agent environments can't dynamically reference bootloader mid-session. Sticky note brings protocol into recent context every turn.

### Data Engineering Patterns

**Token budget for template work**:
- Documentation tasks need less context than code debugging (46% vs typical 60%+)
- Reference implementations more valuable than framework docs (gsd_lite > pure GSD theory)
- Excluding code when building docs = obvious in hindsight, easy to forget in practice

**Why this matters**: Different task types have different context needs. Template creation is "narrow and deep" (few reference files, study them carefully) vs debugging "wide and shallow" (many files, scan quickly).

### Mistakes Avoided

**Didn't load unnecessary context**:
- Almost loaded full GSD reference framework (89 files) - would have hit 80%+ budget immediately
- Instead: loaded GSD_PATTERNS.md (curated analysis) + specific references as needed
- Lesson: Curated summaries > raw source dumps

**Didn't skip loop capture**:
- LOOP-001 (ID scope) came up mid-work, could have just "decided internally"
- Instead: proposed loop → user approved → documented in artifacts
- Lesson: Loops surface assumptions that might be wrong - worth the friction

### Patterns Discovered

**Template structure pattern**:
1. YAML frontmatter (version, purpose, date)
2. Purpose section (what, why, when)
3. Core content sections (protocol, structure, examples)
4. Educational comments (why this matters)
5. Summary (what's included, what's not)

**Why this pattern**: Front-loads purpose so user knows immediately if they're in the right place. Educational comments thread learning throughout (not dumped at end).
```

**Why learning section:**
- **Meta-learning**: You're learning GSD itself - capturing this improves future sessions
- **Pattern recognition**: Discovering reusable patterns (template structure, context scoping)
- **Mistake prevention**: Documenting what NOT to do (helps colleagues, future-you)

## Example SUMMARY Files

### Example 1: dbt Refactor Session

```markdown
---
session_date: 2026-01-15
session_duration: 3 hours 45 minutes
phase: data-engineering-work
task: Refactor fct_orders grain change with 200+ downstream models
token_budget_peak: 4200/5000 (84%)
artifacts_created: 5
---

# Session Summary: fct_orders Grain Change

## Loops Captured

### Closed Loops (2)

**LOOP-012** (Closed): Identify all downstream dependencies
- **Context**: fct_orders grain change from order to line_item level
- **Resolution**: Used dbt-mp --select fct_orders+ to generate slim manifest with 237 downstream models
- **Outcome**: Created lineage.txt with all affected models, prioritized by layer
- **Closed**: 2026-01-15T14:30:00Z

**LOOP-013** (Closed): Determine test coverage gaps
- **Context**: Grain change requires new uniqueness tests
- **Resolution**: Found 12 downstream models missing tests, added to backlog
- **Outcome**: Created test_gaps.md, prioritized 3 critical marts for immediate testing
- **Closed**: 2026-01-15T16:45:00Z

### Open Loops (1)

**LOOP-014** (Open): Optimize incremental model performance after grain change
- **Context**: fct_orders now 10x rows, incremental models slow
- **Question**: Add partition pruning or switch to snapshots for large marts?
- **Next action**: Profile query plans, measure impact
- **Captured**: 2026-01-15T18:00:00Z

## Context Decisions

### What Was Loaded

**dbt lineage** (3200 tokens):
- Slim manifest from dbt-mp (fct_orders + 237 downstream)
- Token optimization: Excluded tests/, seeds/, sources/ (saved 2500 tokens)

**Model definitions** (800 tokens):
- fct_orders.sql (current definition)
- Top 5 downstream marts (dim_customers, fct_revenue, etc.)

**Project context** (200 tokens):
- dbt_project.yml (macro configuration)
- schema.yml snippets (test definitions)

**Total loaded**: 4200 tokens (84% of 5000 budget)

### What Was Excluded

**Out-of-scope models** (saved ~8000 tokens):
- Legacy reports (not affected by grain change)
- Analytics sandbox (not production)

**Implementation details** (saved ~1500 tokens):
- Macro definitions (used but not modified)
- Test data (relied on schema only)

### Why This Worked

**Token budget hit warning phase (84%)**: Close to limit, but manageable because context was highly scoped.

**Key decision**: Used dbt-mp slim manifest instead of full manifest - 97% token reduction enabled loading 237 models within budget.

**Lesson**: For large lineage tasks, ALWAYS use dbt-mp with --select. Full manifest is never viable.

## Artifacts Created

1. `lineage.txt` - 237 downstream models, organized by layer
2. `test_gaps.md` - 12 models needing tests, prioritized
3. `refactor_plan.md` - Step-by-step approach to grain change
4. `models/staging/stg_orders.sql` - Updated staging model
5. `models/marts/fct_orders.sql` - Refactored fact table

## Next Session Prep

**Phase**: Implementation
**Task**: Execute refactor for top 5 downstream marts
**Token budget**: Start at 0, load only affected models per mart

**Loops to import**:
- LOOP-014 (Open): Performance optimization - test after implementation

**Context to restore**:
- This SUMMARY (decisions, lineage scope)
- refactor_plan.md (step-by-step approach)
- lineage.txt (downstream dependencies)

**Skip loading**:
- Full dbt-mp manifest (regenerate per task with --select)
- Test files (load only when writing tests)

## What I Learned

**dbt lineage scoping**:
- Pattern: Start with dbt-mp --select <model>+, review count, exclude out-of-scope layers
- For 200+ models: Load top 5 immediate downstream, reference lineage.txt for rest
- Token budget: ~15 tokens per model in slim manifest

**Grain change strategy**:
- Don't load all 237 models at once (impossible even with dbt-mp)
- Break into waves: staging → core marts → analytics → reports
- Each wave = separate session with focused context
```

### Example 2: Test Debugging Session

```markdown
---
session_date: 2026-01-18
session_duration: 1 hour 30 minutes
phase: debugging
task: Fix failing uniqueness test in dim_customers
token_budget_peak: 1800/5000 (36%)
artifacts_created: 2
---

# Session Summary: dim_customers Test Debugging

## Loops Captured

### Closed Loops (1)

**LOOP-018** (Closed): Root cause of duplicate customer_ids
- **Context**: uniqueness test failing with 47 duplicate customer_ids
- **Resolution**: Found merge logic error - not deduplicating source table before join
- **Outcome**: Added ROW_NUMBER() deduplication in CTE, test passes
- **Closed**: 2026-01-18T15:45:00Z

### Open Loops (0)

No open loops - issue resolved in single session.

## Context Decisions

### What Was Loaded

**Model and test** (600 tokens):
- models/marts/dim_customers.sql (current definition)
- tests/dim_customers_uniqueness.yml (test configuration)

**Dependencies** (500 tokens):
- models/staging/stg_customers.sql (source of duplicates)
- models/staging/stg_orders.sql (joined table)

**dbt test output** (200 tokens):
- Test failure message with 47 duplicate IDs
- Sample of duplicate records

**Query investigation** (500 tokens):
- Intermediate queries to isolate duplication source
- Row counts at each CTE step

**Total loaded**: 1800 tokens (36% of 5000 budget)

### What Was Excluded

**Unrelated models** (saved ~15000 tokens):
- All other marts (not involved in this test failure)
- Full dbt manifest (used targeted --select instead)

**Historical context** (saved ~500 tokens):
- Git history, prior versions (focused on current state only)

### Why This Worked

**Token budget stayed comfortable (36%)**: Debugging benefits from narrow scope - load failing model + immediate dependencies only.

**Key decision**: Didn't load full project context. Started with 3 files (model + 2 dependencies), expanded only when needed.

**Lesson**: For test failures, start narrow. Most issues are in the model itself or one level up dependencies.

## Artifacts Created

1. `models/marts/dim_customers.sql` (fixed) - Added deduplication CTE
2. `debug_notes.md` - Root cause analysis for PR description

## Next Session Prep

**No follow-up needed** - issue resolved, test passing, PR created.

**Loops to import**: None

**Context to restore**: None (unless PR needs revision)

## What I Learned

**Test debugging context pattern**:
- Start: Failing model + test definition (600 tokens)
- Expand: Immediate dependencies only (500 tokens)
- Iterate: Load investigation queries as needed (500 tokens)
- Result: 1800 tokens total, plenty of room for investigation

**dbt deduplication pattern**:
- Common source of uniqueness test failures: Not deduplicating before joins
- Solution: ROW_NUMBER() OVER (PARTITION BY key ORDER BY updated_at DESC) WHERE row_num = 1
- Add to template library for future debugging

**Token budget for debugging**:
- Debugging is "start narrow, expand as needed" (opposite of lineage analysis)
- Most bugs are local (model + 1 level dependencies)
- Budget rarely exceeds 40% if you resist loading "just in case" context
```

## Educational Comments

### Why session metadata matters

Problem: You complete work but don't track duration, token usage, or outcomes. Can't learn what session patterns work best.

Solution: SUMMARY captures metadata (duration, budget peak, phase). Over time, patterns emerge: "Template work = 2 hrs comfortable", "Debugging = 1 hr narrow scope", "Refactoring = 3+ hrs warning budget".

Benefit: Informed planning. Future sessions benefit from velocity data.

### Why loops export to GTD

Problem: Session working memory (LOOPS.md) is ephemeral - when session ends, loops vanish unless explicitly preserved.

Solution: SUMMARY exports loops to GTD system (TickTick, Things, etc.). Closed → achievements, Open → next actions, Clarifying → waiting for.

Benefit: Solo work rhythm - session captures loops, GTD processes them async. No cross-session maintenance burden in session artifacts.

### Why context decisions documentation

Problem: You exclude 3500 tokens of test files, works great. Next session, different task, you forget to exclude tests - hit 80% budget, poor session.

Solution: SUMMARY documents what was excluded and why. Pattern: "Exclude tests when building docs" becomes reusable principle.

Benefit: Learning library. Context decisions compound - each session teaches future sessions.

### Why next session prep eliminates reconstruction time

Problem: Resume work after 3 days. Spend 15-30 min re-reading chat history, figuring out what was loaded, where you stopped. Momentum lost.

Solution: SUMMARY "Next Session Prep" section answers: what to load, what to skip, where to resume. Copy-paste into new session bootloader.

Benefit: 15-30 min saved = start working immediately, not reconstructing context.

## What NOT to Include in SUMMARY

**Avoid:**
- Full chat transcript (too long, not actionable - extract decisions instead)
- Code diffs (belong in git commits, not SUMMARY)
- Temporary debugging queries (artifact pollution - capture patterns only)
- "I tried X and it didn't work" play-by-play (summarize root cause instead)

**Why NOT:**
SUMMARY is for durable insights (decisions, patterns, learning), not ephemeral details (conversation flow, dead ends, debugging steps). If it's not useful in 3 days, don't include it.

**Rule of thumb:**
- Include: What, Why, Outcome (decisions, rationale, results)
- Exclude: How, When, Who (implementation details, timestamps, conversation flow)

Exception: Checkpoints and approvals (What user explicitly approved matters for continuity).

## Summary

**SUMMARY Template solves:**
- Context reconstruction (15-30 min saved per session)
- GTD integration (loops export for async processing)
- Learning capture (context decisions, patterns, mistakes avoided)
- Session continuity (next session prep, selective loading)

**Key sections:**
- Session metadata (duration, budget, deliverables)
- Loops captured (closed/open/clarifying with GTD export)
- Context decisions (what loaded, excluded, why)
- Next session prep (eliminates reconstruction)

**Usage:**
1. At session end, create SUMMARY in `.project/sessions/YYYY-MM-DD-description/`
2. Export closed loops to GTD achievements
3. Export open loops to GTD next actions
4. Export clarifying loops to GTD waiting-for
5. Save context decisions as reference note
6. Use next session prep to resume future work

**What's NOT in SUMMARY:**
- How to capture loops during session (see LOOPS_TEMPLATE.md)
- How to track token budget during session (see CONTEXT_TEMPLATE.md)
- Session initialization protocol (see BOOTLOADER_TEMPLATE.md)

---

*Template version: 1.0*
*Last updated: 2026-01-21*
*Part of: Phase 1 - Foundation & Templates*
