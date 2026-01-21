# Phase 1: Foundation & Templates - Context

**Gathered:** 2026-01-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish file-based protocol and heavily-commented template approach that works for **single-agent scenarios** (Gemini, ChatGPT) as well as multi-agent (Claude Code). The protocol must enforce agent discipline to update artifacts, use systematic IDs, provide checkpoint visibility, and surface available actions — preventing the agent from "racing ahead" without user verification.

Key constraint: Single-agent environments have linear turn-by-turn conversation, no parallel tool calls, and context drift over long sessions. Protocol must work within these limitations.

</domain>

<decisions>
## Implementation Decisions

### Artifact Update Enforcement
- **Update timing:** After every turn — agent must update STATE.md at minimum after each response
- **Enforcement mechanism:** Sticky note in response — fenced codeblock at response end showing what was updated and current state
- **Sticky note format:** Strictly templated — exact fenced block format agent must follow every time, predictable and parseable
- **Sticky note content:** Verbose — shows task, phase, what changed, AND available actions
- **Visual marker:** Fenced code block with label: ```gsd-status ... ```
- **Placement:** End of response only — doesn't interrupt reading, acts as summary
- **Recovery protocol:** Both — user can prompt with "update artifacts", AND agent self-checks before execution
- **Example templates:** Inline in BOOTLOADER — copy-pasteable sticky note template agent sees every session

### Systematic ID Coding
- **Item types:** Full set — LOOP, TASK, DECISION, HYPO, PLAN, MILESTONE, CHECKPOINT
- **ID format:** TYPE-NNN (e.g., LOOP-001) — simple sequential numbering, zero-padded
- **ID scope:** Global unique — IDs never repeat across all sessions
- **Registry location:** STATE.md only — all items tracked in one place with clear sections
- **Archive policy:** Move to PROJECT.md when resolved — STATE.md stays lean with active items
- **Reference style:** ID + brief title: **LOOP-003** (missing CB invoices) — context inline

### Checkpoint Visibility
- **Checkpoint events:** Comprehensive — Loop captured, Decision made, Phase complete, Hypothesis validated, Plan ready, Task complete, Any artifact updated
- **Visual style:** Emoji banner with distinct emojis per type:
  - 🔄 LOOP captured
  - ✅ DECISION made
  - 🏁 PHASE complete
  - 🧪 HYPO validated/invalidated
  - 📋 PLAN ready
  - ✔️ TASK complete
- **Visual intensity:** Same visual treatment for all checkpoints (blocking and informational)
- **Action prompt:** Yes, explicit action — checkpoint states what response is expected
- **Confirmation:** Explicit confirmation when checkpoint resolved: ✅ LOOP-007 resolved → DECISION-008 created
- **Checkpoint IDs:** Use related item ID — checkpoint for LOOP-007 references LOOP-007, not CHECKPOINT-XXX
- **Progress indicator:** Outside sticky note, at very end of response for maximum visibility
- **Blocking style:** Very aggressive emoji wall: 🛑🛑🛑🛑🛑🛑🛑 BLOCKING: ... 🛑🛑🛑🛑🛑🛑🛑
- **Control points:** After logical groups of work — when artifact needs updating = pause for confirmation
- **Discovery checkpoints:** Raw data + agent interpretation + question asking for user verification
- **No response behavior:** Wait indefinitely — agent does not proceed until explicit 'continue'
- **MCP integration:** User has `propose_and_review` tool for artifact updates — agent uses this tool, checkpoint visual confirms what was updated

### Available Actions Menu
- **Menu timing:** End of every turn — always show what user can do next
- **Presentation style:** Single-line shortcut list: 📋 `/continue` | `/pause` | `/discuss` | `/add-loop` | `/status`
- **Menu content:** Contextual with core always present
- **Core actions (always present):** `/continue`, `/pause`, `/status`, `/add-loop`, `/discuss`
- **Contextual actions:**
  - Plan-related: `/approve-plan`, `/reject-plan`, `/edit-plan`
  - Loop-related: `/close-loop [ID]`, `/explore-loop [ID]`
  - Phase-related: `/complete-phase`, `/skip-to-phase [N]`
- **Action format:** Slash commands (familiar from Slack/Discord)
- **Context stack:** Explicit "Return To" field in STATE.md — when user forks (e.g., /discuss), agent tracks where to return
- **Return behavior:** Prompt before returning — "Discussion complete. Ready to return to TASK-003?"
- **Nesting:** Single level only — one fork allowed at a time

### Claude's Discretion
- Exact sticky note template layout within the decided structure
- Specific emoji choices if alternatives feel more appropriate
- How to phrase checkpoint action prompts
- Exact wording of contextual action labels

</decisions>

<specifics>
## Specific Ideas

### From gsd_lite session feedback:
- Agent (Gemini) successfully did interview protocol initially but degraded over time — kept executing without re-interviewing
- Agent forgot to update artifacts after each turn — context drifted
- No systematic ID coding made it hard to reference specific items quickly
- User's non-linear questions became lost — no loop capture
- No clear checkpoint visibility — user lost sight of progress
- No workflow menu — user didn't know what actions were available
- Long needle-in-haystack context caused agent to forget protocol

### Sticky note as "protocol reminder":
- User suggested: sticky note acts as "reminder to self" for agent
- Since agent reads top-down and can't dynamically refer to procedures, sticky note embeds the protocol checklist
- User accepts visual overhead if it enforces GSD-lite compliance

### Artifact structure inspiration:
- gsd_lite used: 00_MANIFESTO.md, BOOTLOADER_PROMPT.md, PROJECT.md, STATE.md
- Decision Log with "Proof of Capture" citing explicit queries and code snippets
- Open Loops section as "parking lot" for ideas

### Self-documenting outputs:
- All decisions must include the explicit query used and result (limited rows for overview)
- Never reference "turn 5 in conversation" — everything must be captured in artifacts
- Output should be auditable by another agent that can chain events for PR narrative

</specifics>

<deferred>
## Deferred Ideas

- **Context cleanup workflow** — Process to review and graduate closed loops, clean outdated items — Phase 3 (Context Engineering)
- **Detailed PR logging** — Comprehensive log with verbosity for PR generation — Phase 4 (Educational Integration)
- **Session handoff system** — Pause/resume across sessions — Phase 2 (Session Handoff)
- **Token budget tracking** — What's loaded, what's excluded, why — Phase 3 (Context Engineering)

</deferred>

---

*Phase: 01-foundation-templates*
*Context gathered: 2026-01-21*
