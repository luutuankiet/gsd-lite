---
status: testing
phase: 01-foundation-templates
source: [01-01-SUMMARY.md, 01-02-SUMMARY.md, 01-03-SUMMARY.md, 01-04-SUMMARY.md]
started: 2026-01-22T06:30:00Z
updated: 2026-01-22T06:37:00Z
---

## Current Test

number: 4
name: Templates use .gsd-lite namespace
expected: |
  All templates reference .gsd-lite/ namespace for artifact paths, not .planning/. Check BOOTLOADER, STATE, README, PROTOCOL_REFERENCE for consistent namespace usage.
awaiting: user response

## Tests

### 1. LOOPS_TEMPLATE systematic ID format
expected: Opening .planning/templates/LOOPS_TEMPLATE.md shows systematic ID format (TYPE-NNN) with examples like LOOP-007, TASK-003. Template includes XML structure for loop status tracking and lifecycle transitions.
result: pass

### 2. CONTEXT_TEMPLATE token budget thresholds
expected: Opening .planning/templates/CONTEXT_TEMPLATE.md shows four-phase token budget thresholds: comfortable (0-20%), deliberate (20-40%), warning (40-50%), stop (50%+). Includes window-relative guidance for different LLMs (Claude 40/50%, Gemini 50/60%).
result: issue
reported: "the issue here is that the templates are straight out forcing the agent to stop and drop some context if the current match >60% budget. This is not possible for conversatoinal based single agent; the only way is to start fresh session at which point the new agent never had memory of before"
severity: major

### 3. STATE_TEMPLATE available actions menu
expected: Opening .planning/templates/STATE_TEMPLATE.md shows session state structure with available actions menu (core + contextual slash commands), context stack support, and recovery protocol.
result: pass

### 4. Templates use .gsd-lite namespace
expected: All templates reference .gsd-lite/ namespace for artifact paths, not .planning/. Check BOOTLOADER, STATE, README, PROTOCOL_REFERENCE for consistent namespace usage.
result: pass

### 5. BOOTLOADER_TEMPLATE sticky note protocol
expected: Opening .planning/templates/BOOTLOADER_TEMPLATE.md shows sticky note template with ```gsd-status fenced block format, protocol checklist, dual instructions (MCP + copy-paste), and example 3-turn session.
result: [pending]

### 6. BOOTLOADER includes loop source clarification
expected: BOOTLOADER_TEMPLATE.md protocol checklist mentions loops originate from both agent discovery AND user questions during checkpoints/decisions.
result: [pending]

### 7. SUMMARY_TEMPLATE GTD export mapping
expected: Opening .planning/templates/SUMMARY_TEMPLATE.md shows GTD export format: closed loops → achievements, open loops → next actions, clarifying loops → waiting for. Includes TickTick-compatible structure.
result: [pending]

### 8. SUMMARY includes realistic examples
expected: SUMMARY_TEMPLATE.md contains 2 realistic examples showing different token budget patterns: dbt refactor at 84% budget (high) and test debugging at 36% budget (comfortable).
result: [pending]

### 9. README Mermaid workflow diagram
expected: Opening .planning/templates/README.md shows Mermaid flowchart (not ASCII) with color-coded workflow zones and decision points for session lifecycle.
result: [pending]

### 10. README Getting Started sequence
expected: README.md includes Getting Started section with Mermaid sequence diagram showing first-time user journey and reading order (README → BOOTLOADER → test session → SUMMARY).
result: [pending]

### 11. PROTOCOL_REFERENCE consolidates patterns
expected: Opening .planning/templates/PROTOCOL_REFERENCE.md shows quick reference for systematic IDs, checkpoint types (informational vs blocking), sticky note rules, visual conventions, and available actions.
result: [pending]

### 12. PROTOCOL_REFERENCE checkpoint split
expected: PROTOCOL_REFERENCE.md documents checkpoint types as two categories: informational (📫 ⚡ ✅ 🔮 🧪) for progress and blocking (🛑 wall) for action required.
result: [pending]

### 13. AGENTS.md follows standard format
expected: Opening .planning/AGENTS.md shows YAML frontmatter (persona, domain, workflows) and sections following agents.md standard, with commands (slash commands), protocol summary, and platform support notes.
result: [pending]

### 14. AGENTS.md uses .gsd-lite namespace
expected: AGENTS.md references .gsd-lite/ namespace consistently (not .planning/).
result: [pending]

### 15. Templates include inline education
expected: Checking any template (LOOPS, CONTEXT, STATE) shows inline educational comments explaining "why" (GSD mechanics rationale) throughout sections, not dumped at end.
result: [pending]

### 16. Templates support dual workflows
expected: BOOTLOADER_TEMPLATE.md provides both MCP (file access) and copy-paste instructions for session initialization, working in both paradigms without modification.
result: [pending]

### 17. CONTEXT window-relative thresholds
expected: CONTEXT_TEMPLATE.md explains token budget thresholds relative to context window size, with specific guidance for Claude 200k (40/50% warning/stop), Gemini 1M (50/60%), and quality degradation rationale.
result: [pending]

### 18. LOOPS sources include user questions
expected: LOOPS_TEMPLATE.md explains loops originate from both agent discovery (finds open questions) AND user questions during session (user asks "Why this approach?" during checkpoints).
result: [pending]

### 19. All templates cross-reference correctly
expected: BOOTLOADER cross-references LOOPS/CONTEXT/STATE templates, AGENTS.md points to README, PROTOCOL_REFERENCE links back to templates. Chain is complete and navigable.
result: [pending]

### 20. README template index clarity
expected: README.md template index lists all templates with purpose, when-to-use, and what-it-does sections (not just filenames).
result: [pending]

### 21. All 8 templates exist in .planning/templates/
expected: Directory .planning/templates/ contains: LOOPS_TEMPLATE.md, CONTEXT_TEMPLATE.md, STATE_TEMPLATE.md, BOOTLOADER_TEMPLATE.md, SUMMARY_TEMPLATE.md, PROTOCOL_REFERENCE.md, README.md, and .planning/AGENTS.md exists at project root.
result: [pending]

## Summary

total: 21
passed: 3
issues: 1
pending: 17
skipped: 0

## Gaps

- truth: "Token budget enforcement allows dynamic context management mid-session"
  status: failed
  reason: "User reported: the issue here is that the templates are straight out forcing the agent to stop and drop some context if the current match >60% budget. This is not possible for conversatoinal based single agent; the only way is to start fresh session at which point the new agent never had memory of before"
  severity: major
  test: 2
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
