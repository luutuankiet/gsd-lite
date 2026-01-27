# Proposal: Evolving WORK.md for Efficient Agent Collaboration (V2)

**Date:** 2026-01-27
**Author:** opencode (AI Agent)
**Status:** Proposal

## 1. Executive Summary

This document proposes an evolution of the `WORK.md` artifact, moving from a purely chronological log to a structured, "queriable" format. The goal is to dramatically improve the efficiency of AI agents that use this file for context, while preserving human readability.

The core change is to introduce a **Key Events Index** and uniquely identifiable **Atomic Log Entries**. This allows an agent to understand a session's history by reading a small, fixed-size header and then surgically retrieving specific details using tools like `grep` and `read_files`, rather than consuming the entire, ever-growing file into its context window.

This change will reduce token consumption, accelerate agent onboarding, and make our GSD-Lite artifacts more scalable and robust for long-term, multi-session projects.

## 2. The Problem: The Cost of Unstructured Context

The current `WORK.md` is a detailed chronological log. While valuable for human history, it is inefficient for an AI agent. As a project progresses over multiple sessions, the file grows linearly.

Consider an agent resuming work on Session 5 of a project:
- The `WORK.md` file might contain thousands of lines from Sessions 1-4.
- To understand a key decision made in Session 1, the agent must read (and "pay" the token cost for) the entire file, or a large chunk of it.
- This is slow, expensive, and scales poorly. It forces the agent to waste context on irrelevant history just to find one or two key facts.

## 3. The Solution: A Queriable, Three-Part Structure

We will restructure `WORK.md` into three distinct sections, designed for a "summary-first, details-on-demand" workflow.

### 3.1. Part 1: The Handoff Header

This section remains largely the same. It is a small, fixed-size block at the top of the file that a new agent reads every time to get a 30-second overview of the current state.

```xml
---
## 1. Current Handoff State (Read First)

<current_state>
Phase: PHASE-001 (JIRA Ticket Analysis)
Task: TASK-003 (Prepare implementation for cost allocation) - Blocked
</current_state>
<vision>
The goal is to make GM2 cost calculations more accurate by replacing the hardcoded `admin_cost`...
</vision>
<decisions>
- The join key is `transaction_id` <-> `invoice_id`.
</decisions>
<blockers>
Awaiting decision from stakeholders on cost allocation strategy.
</blockers>
<next_action>
1. Add `order_id` to `fct_transactions`.
2. Implement chosen allocation logic.
</next_action>
---
```

### 3.2. Part 2: The Key Events Index (New)

This is a new, machine-friendly index that acts as a table of contents for the entire session log. It is designed to be small, scannable, and directly reference the detailed log entries.

```markdown
---
## 2. Key Events Index (Query Accelerator)

| Type      | ID         | Summary                                     |
| :-------- | :--------- | :------------------------------------------ |
| [PLAN]    | [LOG-025]  | Established new, evidence-based path forward. |
| [BLOCKER] | [LOG-028]  | Hit roadblock: `order_id` missing from model. |
| [DECISION]| [LOG-035]  | Confirmed adding `order_id` is a safe change. |
| [EXEC]    | [LOG-042]  | Groomed stakeholder decision doc with new data. |
---
```

### 3.3. Part 3: The Atomic Session Log (New)

The chronological log is now composed of "atomic" entries. Each entry has:
1.  A unique, grep-friendly ID: `[LOG-NNN]`.
2.  A structured header with timestamp and type.
3.  A concise `Summary` field.
4.  A `Details` field, which can contain verbose information (like code or API responses) often hidden in a `<details>` tag to keep the log clean.

```markdown
---
## 3. Atomic Session Log (Chronological)

[LOG-028] - [2026-01-27 11:20] - [BLOCKER-DISCOVERY]
**Summary:** Hit a practical roadblock: the necessary `order_id` join key is missing from the `fct_transactions` model.
**Details:** An attempt to query and join the models failed because the `order_id` column, while present in upstream sources like `stg_shopify_transactions`, is not selected into the final `fct_transactions` table.
**Impact:** This proved that a direct join was not immediately possible and that a modification to `fct_transactions` would be required.

[LOG-035] - [2026-01-27 11:35] - [IMPACT-ANALYSIS]
**Summary:** Conducted downstream lineage analysis for `fct_transactions`.
**Details:** Used `jq` to parse the manifest and trace all dependencies. The full downstream lineage was found to be shallow (`payment_overview` and `transactions`).
**Conclusion:** Adding `order_id` to `fct_transactions` is a non-breaking, structurally safe change.

---
```

## 4. Agent Workflow Scenario: From Inefficient to Optimal

This scenario demonstrates the practical benefit of the V2 structure.

**Goal:** An agent is starting a new session and needs to understand why we need to modify the `fct_transactions` model.

### V1 Workflow (Inefficient)

1.  **Agent Action:** `read_files('gsd-lite/WORK.md')`.
2.  **Result:** The agent loads the entire file, which could be hundreds of kilobytes, into its context. It has to read chronologically through dozens of unrelated entries (like the initial grain analysis, manifest exploration, etc.) to finally find the log entry from `[2026-01-27 11:20]` that explains the missing key.
3.  **Cost:** Very high token usage, slow processing.

### V2 Workflow (Optimal)

1.  **Agent Action:** `read_files('gsd-lite/WORK.md', end_line=50)`.
2.  **Result:** The agent reads only the tiny Handoff Header and Key Events Index. It immediately sees `[LOG-028]` in the index, summarized as "Hit roadblock: `order_id` missing from model."
3.  **Agent Action:** `grep_content(pattern='[LOG-028]', search_path='gsd-lite/WORK.md')`.
4.  **Result:** `grep` returns: `File: gsd-lite/WORK.md, Line: 75`.
5.  **Agent Action:** `read_files([{'path': 'gsd-lite/WORK.md', 'start_line': 74, 'end_line': 82}])`.
6.  **Result:** The agent gets the exact, isolated context for that specific blocker, having spent only a fraction of the token budget.

## 5. Implementation Notes

- The `[LOG-NNN]` IDs should be sequential and padded (e.g., `[LOG-001]`, `[LOG-002]`) for consistent searching.
- A script or agent-level function could be created to automatically update the Key Events Index whenever a log entry with a major type (`[DECISION]`, `[BLOCKER]`, `[PLAN-PIVOT]`) is added.
- Existing `WORK.md` files can be migrated to this new format.

This structured approach treats our work log as a simple, effective database, unlocking a much more efficient and scalable way of collaborating with AI agents.

## 6. Addendum: Agent "Structural Discovery" Workflow

A key question is how an agent discovers this structure without reading the whole file. It does so by using the `grep_content` tool (powered by ripgrep) to find the file's main "landmarks" before committing to a larger read.

**Agent's Goal:** Understand the layout of `WORK.md` at a glance.

**Action:** The agent would execute the following tool call to find all the main headers:
```python
# Agent's tool call
grep_content(pattern='^## ', search_path='gsd-lite/WORK.md')
```
* The pattern `^## ` matches all level-2 markdown headers at the start of a line.
* The `grep_content` tool's output will include the line numbers for each match.

**Result:** The agent receives a low-token "table of contents" like this:
```
File: gsd-lite/WORK.md, Line: 10, Matched: ## 1. Current Handoff State (Read First)
File: gsd-lite/WORK.md, Line: 45, Matched: ## 2. Key Events Index (Query Accelerator)
File: gsd-lite/WORK.md, Line: 60, Matched: ## 3. Atomic Session Log (Chronological)
```

From this, the agent instantly learns the structure of the file and can immediately decide to do a targeted read of the `Key Events Index` from line 45 to 59 to get its bearings, demonstrating the efficiency of this approach.