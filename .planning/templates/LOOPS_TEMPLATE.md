---
version: 1.0
updated: 2026-01-21
purpose: Loop capture template with systematic ID format for managing open questions and parking lot ideas
---

# Loop Capture Template

## Purpose

Loops are **open questions** and **parking lot ideas** that arise during non-linear reasoning in a linear chat interface. When you're working on Task A and discover Question B, you need to capture B without losing focus on A.

**Why loops matter:**
- Engineering logic is non-linear, but chat is linear
- Questions from Turn 10 get buried by Turn 20
- Parking lot ideas get lost in chat history
- You need to track "what needs clarification" separately from "what's being executed"

This template provides systematic structure for capturing and tracking loops.

## When to Use

**USE loops for:**
- Open questions requiring clarification (assumptions that need validation)
- Parking lot ideas (future improvements, refactorings)
- Hypotheses to validate (data assumptions, architectural guesses)
- Deferred decisions (choices that can't be made yet)
- Discovery tasks (research needed before proceeding)

**DO NOT use loops for:**
- Clarified decisions → Move to PROJECT.md Decision Log
- Active tasks → Track in STATE.md Current Context
- Resolved questions → Close loop with outcome, archive to PROJECT.md
- Implementation details → Document in code comments

## Loop Lifecycle

Loops transition through three states:

1. **open** - Initial capture, question identified but not yet explored
2. **clarifying** - Actively exploring, gathering data, discussing with user
3. **closed** - Resolved with outcome (decision made, question answered, idea deferred)

**State transitions:**
```
open → clarifying → closed
   ↓        ↓          ↓
User     Exploring   Outcome
approves  options   documented
```

## Systematic ID Format

**Why systematic IDs:**
- **Quick reference:** "Resolved LOOP-007 → DECISION-008" is immediate and unambiguous
- **Artifact linking:** `grep LOOP-003` finds all references across all files
- **Global uniqueness:** IDs never repeat across sessions
- **Type clarity:** PREFIX tells you what it is (LOOP vs TASK vs DECISION)

**ID format:** `LOOP-NNN`
- PREFIX: `LOOP` (always uppercase)
- SEPARATOR: Hyphen `-`
- NUMBER: Three-digit zero-padded sequential (001, 002, 003...)

**Examples:**
- LOOP-001 (first loop)
- LOOP-042 (forty-second loop)
- LOOP-999 (nine hundred ninety-ninth loop)

**ID scope:** Global unique - IDs never repeat. Once LOOP-003 is used, it's never reused even after closure.

## XML Structure

**Why XML in markdown:**
- **Semantic clarity:** `status="open"` clearer than markdown headers
- **Attribute metadata:** Status, timestamps, IDs as attributes
- **Greppable:** Find all open loops with `<loop.*status="open"`
- **Machine-parseable:** Structured Outputs can validate schema
- **Human-readable:** Still renders well in markdown viewers

**Template:**
```xml
<loop id="LOOP-NNN" status="open">
  <title>[Brief one-line description]</title>
  <context>
    [Why this came up - what were you working on when this question arose?]
  </context>
  <question>
    [What needs clarification or validation?]
  </question>
  <captured>[ISO timestamp YYYY-MM-DDTHH:MM:SSZ]</captured>
</loop>
```

**Status values:**
- `status="open"` - Initial capture, not yet explored
- `status="clarifying"` - Actively investigating
- `status="closed"` - Resolved with outcome

## Loop Capture Workflow

**Loops originate from two sources:**

### 1. Agent Discovery
Agent identifies open question during work (assumption to validate, unclear requirement, edge case discovered).

**Flow:**
1. **Agent identifies open question** during work
2. **Agent drafts loop** in XML format (above template)
3. **Agent presents to user** with checkpoint:
   ```
   📫 LOOP CAPTURED

   I've identified an open question:

   [XML loop here]

   → YOUR ACTION: Approve to add to LOOPS.md or edit
   ```
4. **User approves** → Agent writes to LOOPS.md
5. **User rejects** → Loop discarded, not captured
6. **User edits** → Agent updates loop with user's changes, then writes to LOOPS.md

### 2. User Questions
User asks questions about decisions, checkpoints, or clarifications during session.

**Examples:**
- "Why did you choose this approach instead of X?"
- "What happens if the data has edge case Y?"
- "Can you explain the reasoning behind Z decision?"
- "What about scenario W - did we consider that?"

**Flow:**
1. **User asks question** during session
2. **Agent recognizes** this may need tracking (not immediately answerable, requires investigation, or reveals assumption)
3. **Agent proposes loop** capturing the question
4. **User approves** → Agent writes to LOOPS.md with user's question as context

**Why capture user questions:**
- User questions often reveal gaps in reasoning or untested assumptions
- Checkpoints and decisions may raise follow-up questions worth tracking
- Session conversations can surface important edge cases or considerations
- Loops preserve these insights for async processing outside session

**Why user approval:**
- User stays in key reasoning decisions
- Agent handles articulation, user validates importance
- Prevents agent from creating noise loops

## Status Transitions

### Open → Clarifying

When you start exploring a loop:

```xml
<loop id="LOOP-003" status="clarifying">
  <title>Clarify Chargebee invoice mixed-type assumption</title>
  <context>...</context>
  <question>...</question>
  <captured>2026-01-21T14:30:00Z</captured>
  <exploring>
    <started>2026-01-21T15:00:00Z</started>
    <approach>Run query against invoice_line_items to check for mixed types per invoice</approach>
  </exploring>
</loop>
```

### Clarifying → Closed

When loop is resolved:

```xml
<loop id="LOOP-003" status="closed">
  <title>Clarify Chargebee invoice mixed-type assumption</title>
  <context>...</context>
  <question>...</question>
  <captured>2026-01-21T14:30:00Z</captured>
  <exploring>
    <started>2026-01-21T15:00:00Z</started>
    <approach>Run query against invoice_line_items to check for mixed types per invoice</approach>
  </exploring>
  <outcome>
    <closed>2026-01-21T15:20:00Z</closed>
    <result>Validated: No Chargebee invoices mix subscription and one-time line items</result>
    <evidence>Query returned 0 mixed invoices out of 12,450 total invoices</evidence>
    <decision_ref>DECISION-008</decision_ref>
  </outcome>
</loop>
```

**Why document outcomes:**
- Future sessions can see what was learned
- Evidence provides audit trail
- Decision references link to architectural choices
- Prevents re-asking same question months later

## Examples

### Example 1: Data Assumption Loop

**Scenario:** Refactoring a dbt model, reviewer assumes no mixed invoice types.

```xml
<loop id="LOOP-007" status="open">
  <title>Validate Chargebee invoice mixed-type assumption</title>
  <context>
    Refactoring fct_invoices model. PR reviewer assumed Chargebee invoices never
    mix subscription and one-time-purchase line items in a single invoice. This
    assumption affects grain definition - if mixed invoices exist, grain must be
    line_item_id, not invoice_id.
  </context>
  <question>
    What query proves whether Chargebee invoices can have mixed line item types?
    How many such invoices exist in production data?
  </question>
  <captured>2026-01-21T14:30:00Z</captured>
</loop>
```

### Example 2: Lineage Scope Loop

**Scenario:** Large dbt lineage - unclear how much context to load.

```xml
<loop id="LOOP-012" status="clarifying">
  <title>Determine lineage scope for dim_customers refactor</title>
  <context>
    Refactoring dim_customers to add new SCD Type 2 column. Full lineage is 200+
    downstream models. Loading all models exceeds token budget (50%+ threshold).
    Need strategy for scoping context.
  </context>
  <question>
    Which downstream models are critical for impact analysis? Can we exclude
    reporting models and focus only on dimensional models in direct lineage?
  </question>
  <captured>2026-01-21T09:15:00Z</captured>
  <exploring>
    <started>2026-01-21T09:20:00Z</started>
    <approach>Use dbt-mp to generate slim manifest with 3-level depth, exclude marts layer</approach>
  </exploring>
</loop>
```

### Example 3: Test Failure Root Cause Loop

**Scenario:** dbt test failing, root cause unclear.

```xml
<loop id="LOOP-018" status="open">
  <title>Identify root cause of unique_test failure in stg_orders</title>
  <context>
    Test unique_combination_of_columns(order_id, line_number) failing in
    stg_orders. Test passed yesterday, failed after upstream schema change in
    raw.orders source. Unclear if duplicate rows introduced upstream or if
    staging logic needs adjustment.
  </context>
  <question>
    Are duplicate rows present in raw.orders source, or is staging transformation
    creating duplicates? What changed upstream between last passing test and now?
  </question>
  <captured>2026-01-21T16:00:00Z</captured>
</loop>
```

## Educational Notes

### Why Systematic IDs Matter

**Problem without IDs:**
- "Remember that invoice question from earlier?" (Which one? Turn 10 or Turn 20?)
- "The customer dimension lineage issue" (Too vague, could be 3 different loops)
- "Question #3" (Ambiguous - number resets each session)

**Solution with systematic IDs:**
- "LOOP-007" (Exact reference, no ambiguity)
- `grep LOOP-007` finds all mentions across artifacts
- "Resolved LOOP-007 → DECISION-008" shows clear progression

### Why XML Structure

**Problem with markdown-only:**
```markdown
## Loop: Validate invoice assumption
Status: Open
Captured: 2026-01-21
```
- Status is ambiguous (text parsing required)
- No attributes for metadata
- Hard to grep (markdown headers non-semantic)

**Solution with XML:**
```xml
<loop id="LOOP-007" status="open">
  <captured>2026-01-21T14:30:00Z</captured>
</loop>
```
- Status is semantic attribute
- Greppable: `<loop.*status="open"` finds all open loops
- Machine-parseable for validation

### Why Status Tracking

**Problem without status:**
- Can't distinguish between "just captured" and "actively exploring"
- Can't filter for loops needing attention vs archived loops
- Recovery from interruptions unclear (which loops were active?)

**Solution with status tracking:**
- Filter open loops: "What needs attention?"
- See clarifying loops: "What's being worked on?"
- Archive closed loops: "What was learned?"
- Resume after interruption: "Pick up clarifying loops"

## Recovery Protocol

If protocol drifts and loops aren't being captured:

**User prompt:** "update artifacts - check for uncaptured loops"

**Agent action:**
1. Review recent conversation (last 5-10 turns)
2. Identify open questions, assumptions, parking lot ideas
3. Draft loops in XML format
4. Present for user approval
5. Update LOOPS.md with approved loops
6. Update STATE.md to show active loop count

**Why recovery matters:**
Long sessions cause context drift. Agent forgets to capture loops. Recovery
protocol resets discipline without restarting session.

---

**Template version:** 1.0
**Created:** 2026-01-21
**For:** Data Engineering Copilot Patterns (learn_gsd project)
