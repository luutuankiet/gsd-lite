# Evaluation Output Schema

*Documented: 2026-02-16 (LOG-068)*
*Source: scripts/eval_ingest.py*

## Overview

The `eval_ingest.py` script extracts OpenCode sessions into a JSON format designed for **dual-consumption**:
1. **Layer 1 (Programmatic Checks):** Fast, regex-based checks in Python.
2. **Layer 2 (Vertex AI Evaluation):** LLM-based rubric evaluation using Vertex AI Gen AI Eval service.

The schema is **Vertex-Native** by default, meaning it matches the input format expected by Google's `GenAiEvaluationService` without further transformation.

---

## Schema Reference

```json
{
  "session_id": "ses_...",
  "title": "Session Title",
  "created": "ISO-8601 Timestamp",
  
  // PRIMARY: Vertex AI Native Format (Layer 2)
  // Auto-parsed by Vertex AI as multi-turn conversation
  "request": {
    "contents": [
      {
        "role": "user",
        "parts": [{"text": "User input..."}]
      },
      {
        "role": "model",
        "parts": [{"text": "Agent response..."}]
      }
    ]
  },
  
  // PRIMARY: Vertex AI Native Response (Layer 2)
  "response": {
    "candidates": [
      {
        "content": {
          "role": "model",
          "parts": [{"text": "Final agent response"}]
        }
      }
    ]
  },
  
  // PRIMARY: Intermediate Events (Layer 2)
  // Used for TOOL_USE_QUALITY and trajectory analysis
  "intermediate_events": [
    {
      "function_call": {
        "name": "fs.list",
        "args": {"path": "src"}
      },
      "function_response": {
        "name": "fs.list",
        "response": {"output": "..."}
      },
      "turn": 1  // Critical: Maps tool use to specific conversation turn
    }
  ],
  
  // LEGACY: Flat Concatenations (Layer 1)
  // Kept for backward compatibility with existing regex checks
  "prompt": "Last user prompt",
  "prompt_concat": "All user prompts combined",
  "response_concat": "All agent responses combined",
  "conversation_history": [ ... ], // All turns except last prompt
  
  // LEGACY: Generated Trajectory (Layer 1)
  // Deprecated in favor of intermediate_events
  "generated_trajectory": [
    {
      "tool": "fs.list",
      "args": {...},
      "output": "...",
      "turn": 1
    }
  ],
  
  "metadata": {
    "total_turns": 5,
    "total_tools": 12,
    "user_turns": 2,
    "model_turns": 3
  }
}
```

---

## Field Details

### 1. `request` (Vertex Native)
- **Type:** `dict`
- **Purpose:** Input for `MULTI_TURN_GENERAL_QUALITY` metric.
- **Structure:** Google Gemini API `Content` object.
- **Logic:**
  - `role`: "user" or "model" (mapped from OpenCode "user"/"assistant").
  - `parts`: Array of text parts.
  - **Turn Merging:** Consecutive messages from the same role are merged into a single turn (text joined by `\n\n`).

### 2. `intermediate_events` (Tool Usage)
- **Type:** `list[dict]`
- **Purpose:** Input for `TOOL_USE_QUALITY` and custom trajectory analysis.
- **Logic:**
  - Captures *every* tool call made by the agent.
  - `turn`: Integer index (1-based) matching the `request.contents` array index where this tool was called.
  - **Critical for L2:** Allows the LLM judge to know *when* a tool was used in the conversation flow.

### 3. `prompt_concat` / `response_concat` (Legacy)
- **Type:** `str`
- **Purpose:** Backward compatibility for `eval_consume.py` Layer 1 checks.
- **Logic:**
  - `prompt_concat`: All user messages joined by `\n\n`.
  - `response_concat`: All agent messages joined by `\n\n`.
  - **Why keep it?** Simple regex checks (e.g., "Did agent mention X?") are faster on strings than parsing JSON structures.

---

## Evolution History

| Log ID | Decision | Description |
|--------|----------|-------------|
| **LOG-042** | DECISION-042d | Proposed `turns[]` array to support turn-level evaluation. |
| **LOG-046** | DECISION-046a | Adopted **Vertex-Native** schema (`request`/`response`) to eliminate ETL transform step. |
| **LOG-046** | DECISION-046b | Decommissioned `eval_transform.py`. |

## Maintainer Notes

- **Modifying Schema:** If you change this, you MUST update `scripts/eval_consume.py` to match.
- **Vertex API:** This schema roughly conforms to the [Vertex AI Evaluation Dataset](https://cloud.google.com/vertex-ai/generative-ai/docs/models/evaluation-dataset) requirements.
- **Turn Counting:** Turn numbers in `intermediate_events` correspond to the index in `request.contents`. Be careful when merging turns.