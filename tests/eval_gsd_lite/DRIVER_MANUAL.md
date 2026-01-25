# GSD-lite Evaluation Driver Manual

This document contains instructions for manually driving a GSD-lite agent through the "Simulated Data Pipeline" scenario.

## Pre-requisites
1. You are in the project root: `/Users/luutuankiet/dev/learn_gsd` (or equivalent).
2. You have a fresh LLM session (Claude Sonnet or Gemini Pro).
3. The simulation is clean (see Reset Procedure).

## Scenario: "Add Tax Calculation"

**Objective**: Modify the pipeline to calculate a 10% tax for "Income" category transactions and store it in a new `tax` column.

### Step 1: Moodboard (Planning)

**Prompt (Copy/Paste):**
```text
I want to modify the simulated ETL pipeline in `tests/eval_gsd_lite`.
Please read `tests/eval_gsd_lite/README.md` to orient yourself.
Then, initialize a Moodboard to help me plan a new feature: I need to calculate a 10% tax for all transactions in the "Income" category and save it to the database.
```

**Expected Behavior:**
- Agent reads the README.
- Agent starts `gsd_lite/template/workflows/moodboard.md`.
- Agent asks scoping questions (e.g., "Should tax be 0 for non-Income?", "Is it a flat 10%?", "Do we need to backfill?").

### Step 2: Whiteboard (Architecture)

**Prompt (Copy/Paste):**
```text
Here are the answers:
1. Yes, tax is 0.0 for non-Income categories.
2. Yes, flat 10%.
3. No backfill needed for this test, just future runs.
4. We need to update the database schema.

Please move to Whiteboard mode and propose a plan.
```

**Expected Behavior:**
- Agent switches to `gsd_lite/template/workflows/whiteboard.md`.
- Agent proposes a plan involving:
    - Updating `src/etl/transform.py` (logic).
    - Updating `src/etl/load.py` (schema + insert).
    - Updating `tests/test_transform.py`.
- Agent produces a checklist.

### Step 3: Execution

**Prompt (Copy/Paste):**
```text
The plan looks good. Please proceed to Execution mode.
Remember to run the tests and the pipeline to verify your work.
```

**Expected Behavior:**
- Agent switches to `gsd_lite/template/workflows/execution.md`.
- Agent edits the files.
- Agent runs `python3 tests/eval_gsd_lite/src/pipeline.py` and `tests`.
- Agent fixes any errors.

## Reset Procedure

After the evaluation, reset the simulation to its clean state:

```bash
# 1. Remove the generated database
rm tests/eval_gsd_lite/transactions.db

# 2. Revert code changes to the simulation src/ and tests/
git checkout HEAD -- tests/eval_gsd_lite/src tests/eval_gsd_lite/tests
```
