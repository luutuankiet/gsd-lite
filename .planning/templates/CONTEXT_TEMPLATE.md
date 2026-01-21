---
version: 1.0
updated: 2026-01-21
purpose: Token budget management and context scoping template for deliberate context loading decisions
---

# Context Budget Template

## Purpose

Token budget management is about **deliberate context scoping** - deciding what to load, what to exclude, and documenting why. When working with large codebases (200+ file lineages, 500k+ token manifests), loading everything overwhelms the agent and degrades reasoning quality.

**Why context scoping matters:**
- Prevents overwhelming agent with irrelevant context
- Maintains reasoning quality by staying within comfortable token budgets
- Documents inclusion/exclusion decisions for future sessions
- Enables progressive loading strategy (start narrow, expand when needed)
- Creates audit trail of "what was considered" vs "what was ignored"

This template provides structured format for tracking token budgets and context decisions.

## Token Budget Thresholds

**Why thresholds matter:**
LLM reasoning quality degrades as context fills. At 0-20% of context window, agent has room to explore. As budget fills past 40%, agent starts missing details, forgetting instructions, losing protocol discipline.

**Context window considerations:**
Different LLMs have different context windows, which affects how budget percentage translates to quality:
- **Claude 3.5 Sonnet**: 200k tokens → Conservative thresholds (20/40/50%)
- **Gemini 1.5 Pro**: 1M tokens → Can tolerate higher fill (30/50/60%)
- **GPT-4**: 128k tokens → Conservative thresholds (20/40/50%)

**Rule of thumb:** Smaller windows require more conservative thresholds. Quality degradation is relative to window size, not absolute token count.

**Four phases (percentages relative to YOUR context window):**

### 1. Comfortable (0-20% of window)

**What it means:** Plenty of room for exploratory work
**When to use:** Discovery, brainstorming, open-ended research
**Agent behavior:** Can load additional context freely
**Risk level:** Low - quality remains high

**Example (200k window like Claude):**
- Window: 200,000 tokens available
- Budget target: 10,000 tokens (5% of window)
- Current: 2,000 / 10,000 (20% of budget = 1% of window)
- Loaded: 3 core models
- Room for: Tests, downstream models, documentation
- Quality: Full reasoning capacity available

**Example (1M window like Gemini):**
- Window: 1,000,000 tokens available
- Budget target: 50,000 tokens (5% of window)
- Current: 10,000 / 50,000 (20% of budget = 1% of window)
- Quality: Full reasoning capacity available

### 2. Deliberate (20-40% of budget)

**What it means:** Focused work mode, deliberate additions only
**When to use:** Implementation, refactoring, debugging specific issues
**Agent behavior:** Load additional context only when needed, justify inclusions
**Risk level:** Low-Medium - quality still good, but monitor additions

**Example (200k window):**
- Budget: 3,600 / 10,000 (36% of budget = 1.8% of window)
- Loaded: 8 models + tests + lineage
- Room for: Selective additions with justification
- Quality: Good reasoning, less exploration

### 3. Warning (40-60% of budget)

**What it means:** Quality degradation zone, consider reducing context
**When to use:** Temporarily acceptable, but prioritize exclusions
**Agent behavior:** Pause before loading more, actively seek exclusions
**Risk level:** Medium - quality degrading, protocol discipline slipping

**Threshold adjustments by window size:**
- **200k window (Claude)**: Warning at 40%, STOP at 50%
- **1M window (Gemini)**: Warning at 50%, STOP at 60%
- **128k window (GPT-4)**: Warning at 40%, STOP at 50%

**Example (200k window):**
- Budget: 4,600 / 10,000 (46% of budget = 2.3% of window)
- Loaded: 15 models + tests + docs + lineage
- Room for: Very limited, must exclude before adding
- Quality: Starting to miss details, forget edge cases

**Why higher tolerance for larger windows:** Gemini's 1M window has more absolute capacity, so 50% fill (500k tokens) is less cognitively demanding than Claude's 50% (100k tokens). Percentage relative to window matters more than absolute count.

### 4. Stop (50-60%+ of budget, window-dependent)

**What it means:** Context must be reduced before proceeding
**When to use:** Never intentional - red line boundary
**Agent behavior:** STOP loading, identify exclusions, reduce context
**Risk level:** High - quality severely degraded, protocol drift likely

**STOP thresholds by window:**
- **200k window (Claude)**: STOP at 50%+ of budget
- **1M window (Gemini)**: STOP at 60%+ of budget
- **128k window (GPT-4)**: STOP at 50%+ of budget

**Example (200k window):**
- Budget: 5,600 / 10,000 (56% of budget = 2.8% of window)
- Loaded: Too much - agent overwhelmed
- Room for: None - must exclude
- Quality: Missing instructions, losing discipline, hallucinating

**Why these percentages:**
Based on GSD framework patterns (Pattern 7: Conservative token budgets) adapted for varying context windows. Data engineering work requires precision - better to scope narrow and expand than to overload and degrade. Percentages are relative to YOUR model's window, not absolute values.

## XML Structure

**Why XML in markdown:**
- **Attribute metadata:** Token counts, thresholds, reasons as attributes
- **Nested structure:** Included/excluded sections with hierarchy
- **Greppable:** Find all test exclusions with `<excluded reason="test_files"`
- **Machine-parseable:** Can validate budget calculations
- **Human-readable:** Still renders clearly in markdown

**Full template:**
```xml
<context_loaded>
  <budget total="5000" used="2300" remaining="2700" threshold="warning" />
  <phase>warning</phase> <!-- comfortable | deliberate | warning | stop -->

  <included reason="core_implementation">
    <file path="src/models/fct_orders.sql" tokens="450" />
    <file path="src/models/dim_customers.sql" tokens="380" />
    <file path="src/models/int_order_items.sql" tokens="320" />
    <total_tokens>1150</total_tokens>
  </included>

  <included reason="direct_dependencies">
    <file path="src/models/stg_orders.sql" tokens="280" />
    <file path="src/models/stg_customers.sql" tokens="240" />
    <total_tokens>520</total_tokens>
  </included>

  <excluded reason="test_files">
    <pattern>tests/**/*.sql</pattern>
    <file_count>23</file_count>
    <saved_tokens>1200</saved_tokens>
    <rationale>Tests not needed for model grain refactor - focus on model logic</rationale>
  </excluded>

  <excluded reason="out_of_scope">
    <pattern>src/models/legacy_reports/*</pattern>
    <file_count>15</file_count>
    <saved_tokens>850</saved_tokens>
    <rationale>Legacy reports unaffected by customer dimension grain change</rationale>
  </excluded>

  <excluded reason="downstream_depth">
    <pattern>marts/** (beyond 3 levels deep)</pattern>
    <file_count>87</file_count>
    <saved_tokens>4200</saved_tokens>
    <rationale>Deep downstream models inherit changes - no direct modification needed</rationale>
  </excluded>
</context_loaded>
```

**Key attributes:**
- `total`: Maximum token budget for this session
- `used`: Current tokens loaded
- `remaining`: Tokens still available
- `threshold`: Current phase (comfortable/deliberate/warning/stop)
- `reason`: Why files included or excluded
- `saved_tokens`: How many tokens exclusion saved

## Progressive Loading Strategy

**Why progressive loading:**
You don't know what context you need until you start working. Loading everything upfront wastes budget on irrelevant files. Loading progressively keeps you in comfortable/deliberate zones.

**Strategy:**

### Phase 1: Start Narrow (0-20% budget)

**Load:** Minimum viable context
- Core file being modified
- Direct dependencies (1 level up)
- Direct dependents (1 level down)

**Example:**
```xml
<context_loaded>
  <budget total="5000" used="900" remaining="4100" threshold="comfortable" />
  <phase>comfortable</phase>

  <included reason="task_focus">
    <file path="src/models/fct_orders.sql" tokens="450" />
    <note>Primary refactor target</note>
  </included>

  <included reason="direct_deps">
    <file path="src/models/stg_orders.sql" tokens="280" />
    <file path="src/models/int_order_items.sql" tokens="170" />
  </included>
</context_loaded>
```

### Phase 2: Expand When Needed (20-40% budget)

**Load:** Context as questions arise
- Tests when debugging failures
- Downstream models when impact unclear
- Documentation when patterns unknown

**Example:**
```xml
<context_loaded>
  <budget total="5000" used="1800" remaining="3200" threshold="deliberate" />
  <phase>deliberate</phase>

  <included reason="test_debugging">
    <file path="tests/fct_orders/unique_order_id.sql" tokens="120" />
    <file path="tests/fct_orders/not_null_customer_id.sql" tokens="90" />
    <note>Added after test failures - need to understand assertions</note>
  </included>

  <included reason="downstream_impact">
    <file path="src/models/marts/mart_customer_orders.sql" tokens="340" />
    <note>Uses fct_orders grain - verify grain change compatibility</note>
  </included>
</context_loaded>
```

### Phase 3: Exclude and Refocus (40%+ budget)

**Load:** Nothing new - actively reduce
- Identify files not referenced in last 5 turns
- Move tangential files to exclusions
- Document why exclusion is safe

**Example:**
```xml
<context_loaded>
  <budget total="5000" used="2100" remaining="2900" threshold="deliberate" />
  <phase>deliberate</phase>

  <excluded reason="not_referenced">
    <file path="src/models/stg_customers.sql" tokens="240" />
    <rationale>Loaded initially but not used in last 10 turns - customer dim unchanged</rationale>
    <removed_at>2026-01-21T15:30:00Z</removed_at>
  </excluded>
</context_loaded>
```

**Key principle:** Start narrow, expand deliberately, exclude proactively.

## Examples

### Scenario 1: Model Refactor with Direct Dependencies

**Context:** Refactoring fct_orders grain from order_id to line_item_id.

```xml
<context_loaded>
  <budget total="5000" used="1850" remaining="3150" threshold="deliberate" />
  <phase>deliberate</phase>

  <included reason="refactor_target">
    <file path="src/models/fct_orders.sql" tokens="520" />
    <note>Primary refactor - changing grain from order_id to line_item_id</note>
  </included>

  <included reason="upstream_deps">
    <file path="src/models/stg_orders.sql" tokens="340" />
    <file path="src/models/stg_order_lines.sql" tokens="280" />
    <note>Source data for fact table - need to verify line-level data quality</note>
  </included>

  <included reason="downstream_impact">
    <file path="src/models/marts/mart_revenue_daily.sql" tokens="390" />
    <file path="src/models/marts/mart_customer_orders.sql" tokens="320" />
    <note>Direct consumers of fct_orders - verify aggregation logic compatible with grain change</note>
  </included>

  <excluded reason="test_files">
    <pattern>tests/**/*.sql</pattern>
    <file_count>18</file_count>
    <saved_tokens>980</saved_tokens>
    <rationale>Tests will be updated after grain change - not needed for refactor logic</rationale>
  </excluded>

  <excluded reason="reporting_layer">
    <pattern>src/models/reports/**</pattern>
    <file_count>42</file_count>
    <saved_tokens>3200</saved_tokens>
    <rationale>Reports consume marts, not fct directly - impact absorbed by mart layer</rationale>
  </excluded>
</context_loaded>
```

### Scenario 2: Test Failure Investigation

**Context:** unique_test failing in stg_orders, need to debug root cause.

```xml
<context_loaded>
  <budget total="5000" used="1320" remaining="3680" threshold="comfortable" />
  <phase>comfortable</phase>

  <included reason="failing_test">
    <file path="tests/stg_orders/unique_order_id.sql" tokens="150" />
    <note>Failing test - need to understand uniqueness assertion</note>
  </included>

  <included reason="tested_model">
    <file path="src/models/stg_orders.sql" tokens="420" />
    <note>Model under test - verify staging logic isn't creating duplicates</note>
  </included>

  <included reason="source_data">
    <file path="src/models/sources.yml" tokens="280" />
    <note>Check source schema - upstream changes may have introduced duplicates</note>
  </included>

  <included reason="dbt_project">
    <file path="dbt_project.yml" tokens="180" />
    <note>Verify test configuration and severity settings</note>
  </included>

  <excluded reason="other_models">
    <pattern>src/models/** (except stg_orders.sql)</pattern>
    <file_count>120</file_count>
    <saved_tokens>8500</saved_tokens>
    <rationale>Test failure isolated to stg_orders - other models not relevant for debugging</rationale>
  </excluded>

  <excluded reason="downstream_tests">
    <pattern>tests/** (except stg_orders tests)</pattern>
    <file_count>67</file_count>
    <saved_tokens>3200</saved_tokens>
    <rationale>Focus on failing test only - downstream tests irrelevant until this is fixed</rationale>
  </excluded>
</context_loaded>
```

### Scenario 3: Large Lineage with Slim Manifest

**Context:** Refactoring dim_customers, full lineage is 200+ models - need scoping strategy.

```xml
<context_loaded>
  <budget total="5000" used="2200" remaining="2800" threshold="warning" />
  <phase>warning</phase>

  <included reason="refactor_target">
    <file path="src/models/dim_customers.sql" tokens="580" />
    <note>Adding SCD Type 2 column - need to verify existing logic</note>
  </included>

  <included reason="direct_downstream_dims">
    <file path="src/models/dim_customer_segments.sql" tokens="340" />
    <file path="src/models/fct_orders.sql" tokens="420" />
    <file path="src/models/fct_subscriptions.sql" tokens="380" />
    <note>Direct dimension consumers - verify join logic handles new SCD column</note>
  </included>

  <included reason="slim_manifest">
    <file path=".dbt-mp/slim_manifest_3_levels.json" tokens="480" />
    <note>dbt-mp generated slim manifest - 3-level lineage depth, 97% token reduction</note>
  </included>

  <excluded reason="deep_downstream">
    <pattern>marts/** (4+ levels downstream)</pattern>
    <file_count>87</file_count>
    <saved_tokens>6200</saved_tokens>
    <rationale>Deep downstream models inherit changes through intermediate layers - no direct modification needed</rationale>
  </excluded>

  <excluded reason="full_manifest">
    <file path="target/manifest.json" tokens="52000" />
    <saved_tokens>52000</saved_tokens>
    <rationale>Full manifest too large - using dbt-mp slim manifest instead for 97% reduction</rationale>
  </excluded>

  <excluded reason="unrelated_dims">
    <pattern>src/models/dim_products.sql, dim_locations.sql, dim_time.sql</pattern>
    <file_count>8</file_count>
    <saved_tokens>1800</saved_tokens>
    <rationale>Customer dimension change doesn't affect product/location/time dimensions</rationale>
  </excluded>

  <note>
    Strategy: Use dbt-mp slim manifest for high-level lineage view. Load only direct downstream
    dimensions/facts. Exclude deep marts layer (changes inherited through intermediate models).
    If issues arise in marts, reload specific models on demand.
  </note>
</context_loaded>
```

## Educational Notes

### Why Token Budgets Matter

**The quality degradation curve:**
```
Quality
  ^
100%|████
    |████
 80%|███░
    |███░          comfortable zone (0-20%)
 60%|██░░
    |██░░          deliberate zone (20-40%)
 40%|█░░░
    |█░░░ <- DANGER warning zone (40-50%)
 20%|░░░░
    |░░░░ <- STOP red line (50%+)
  0%+----+----+----+----+----+
    0%  20%  40%  60%  80% 100%
           Token Budget %
```

**What degrades:**
- Protocol discipline (forgets to update artifacts, skips checkpoints)
- Edge case handling (misses null checks, boundary conditions)
- Instruction following (forgets user constraints, makes assumptions)
- Detail retention (loses track of loop IDs, references wrong file)

**Why 50% is red line:**
GSD testing shows quality cliff at 50%. Below 50%, agent mostly follows protocol with occasional slips. Above 50%, protocol discipline collapses rapidly.

### Why Exclusion Rationale

**Problem without rationale:**
```xml
<excluded>
  <pattern>tests/**</pattern>
  <saved_tokens>1200</saved_tokens>
</excluded>
```
- Future session doesn't know WHY tests excluded
- User can't evaluate if exclusion still valid
- New team member doesn't understand scoping decision

**Solution with rationale:**
```xml
<excluded reason="test_files">
  <pattern>tests/**/*.sql</pattern>
  <saved_tokens>1200</saved_tokens>
  <rationale>Tests not needed for model grain refactor - focus on model logic. Will update tests after grain change verified.</rationale>
</excluded>
```
- Future context: "Tests excluded because X, reload if Y"
- Audit trail: "We considered tests, decided not needed because..."
- Learning: Next time similar task, same exclusion pattern applies

### Why Progressive Loading

**Anti-pattern: Load everything upfront**
```
Turn 1: Load 200 models, 15 tests, full manifest
Budget: 4500 / 5000 (90%) - STOP threshold
Agent: Overwhelmed, misses details, protocol drift
Result: Poor quality, must restart with reduced context
```

**Pattern: Progressive loading**
```
Turn 1: Load 3 core models
Budget: 900 / 5000 (18%) - comfortable
Agent: Clear reasoning, high quality

Turn 5: Question about downstream impact - load 2 marts
Budget: 1600 / 5000 (32%) - deliberate
Agent: Still good quality, focused exploration

Turn 10: Realize tests needed - load 3 test files
Budget: 2100 / 5000 (42%) - warning
Agent: Good quality, but monitor closely

Turn 15: Identify 2 models not referenced - exclude
Budget: 1700 / 5000 (34%) - deliberate
Agent: Back to good zone, continue work
```

**Key insight:** You don't know what you need until you need it. Start narrow, expand deliberately, exclude proactively.

## Agent Workflow

**How agents track context budgets:**

### 1. Initialize Context

```markdown
Starting new session. Initializing context budget:

- Total budget: 5000 tokens
- Target threshold: deliberate (20-40%)
- Progressive loading: enabled
```

### 2. Load Initial Context

```xml
<context_loaded>
  <budget total="5000" used="850" remaining="4150" threshold="comfortable" />
  <phase>comfortable</phase>

  <included reason="task_focus">
    <file path="src/models/fct_orders.sql" tokens="450" />
  </included>

  <included reason="direct_deps">
    <file path="src/models/stg_orders.sql" tokens="280" />
    <file path="src/models/int_order_items.sql" tokens="120" />
  </included>
</context_loaded>
```

### 3. Update on Every Load

When loading additional context:

```markdown
Loading tests/fct_orders/unique_order_id.sql (120 tokens)

Updated context budget:
- Used: 970 / 5000 (19.4%) - comfortable
- Threshold: Still in comfortable zone
- Strategy: Room for exploration
```

### 4. Warning When Approaching Threshold

```markdown
⚠️ TOKEN BUDGET WARNING

Current: 2200 / 5000 (44%) - warning zone
Action needed: Identify exclusions before loading more

Candidates for exclusion:
- stg_customers.sql (240 tokens) - not referenced in last 8 turns
- Legacy reports (850 tokens) - out of scope for this refactor

Proceed? [y/n]
```

### 5. Stop When Red Line Reached

```markdown
🛑🛑🛑 TOKEN BUDGET EXCEEDED 🛑🛑🛑

Current: 2800 / 5000 (56%) - STOP threshold
Quality degradation likely - must reduce context

Required action: Identify and exclude at least 500 tokens

Exclusion candidates:
1. tests/** (980 tokens) - can reload if needed
2. reports/** (1200 tokens) - out of scope
3. Unused models (340 tokens) - not referenced

Select exclusions: [1, 2, 3, or custom]
```

## File Format

**Location:** `.project/sessions/YYYY-MM-DD-description/CONTEXT.md`

**Structure:**
1. YAML frontmatter (version, updated timestamp)
2. Current budget summary (quick reference at top)
3. Full XML context_loaded block (detailed breakdown)
4. Session notes (strategy decisions, threshold triggers)

**Example:**
```markdown
---
version: 1.0
updated: 2026-01-21T15:45:00Z
session: 2026-01-21-fct-orders-grain-refactor
---

# Context: fct_orders Grain Refactor

## Current Budget

**Status:** deliberate (34%)
**Used:** 1700 / 5000 tokens
**Threshold:** deliberate (20-40%)
**Strategy:** Progressive loading, focused on direct impact

## Loaded Context

[XML context_loaded block here]

## Session Notes

**15:30 - Crossed into warning zone (44%)**
- Excluded stg_customers.sql (not referenced)
- Excluded reports/** (out of scope)
- Returned to deliberate zone (34%)

**15:45 - Loaded additional test file**
- Added tests/fct_orders/not_null_customer_id.sql
- Budget now 36% (still deliberate)
- Strategy: Stay under 40% for remainder of session
```

---

**Template version:** 1.0
**Created:** 2026-01-21
**For:** Data Engineering Copilot Patterns (learn_gsd project)
