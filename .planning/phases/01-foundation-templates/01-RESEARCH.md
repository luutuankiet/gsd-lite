# Phase 1: Foundation & Templates - Research

**Researched:** 2026-01-21
**Domain:** Artifact-driven protocol enforcement, single-agent workflows, self-teaching templates
**Confidence:** MEDIUM (GSD reference patterns HIGH, web research LOW pending validation)

## Summary

This research investigates how to design file-based protocols and heavily-commented templates that enforce agent discipline across single-agent environments (Gemini, ChatGPT) and multi-agent systems (Claude Code). The core challenge: agents degrade over long sessions, forgetting to update artifacts, losing protocol discipline, and drifting from systematic workflows.

Key findings from tested gsd_lite implementation and GSD reference framework:
- **Sticky notes** (end-of-turn status blocks) work as protocol reminders when agents can't dynamically reference procedures
- **XML-structured elements** provide semantic clarity for loop status, token budgets, and checkpoint events
- **Fenced code blocks** with visual labels (```gsd-status) create parseable, visible protocol enforcement
- **Emoji banners** arrest attention for checkpoints (🛑🛑🛑 blocking barriers, 📫 loop captured, ✅ task complete)
- **Systematic ID coding** (TYPE-NNN format) enables quick reference and artifact linking

**Primary recommendation:** Use predictable, template-driven sticky notes at response end that embed protocol checklist, combined with visual checkpoint barriers for blocking events. File format: markdown with XML elements for semantic structure, enabling both MCP tool access and copy-paste workflows.

## Standard Stack

The established approach for single-agent protocol enforcement in 2026:

### Core
| Library/Pattern | Version/Standard | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Markdown | CommonMark | Base format for all artifacts | Universal readability, MCP/copy-paste compatible, git-friendly |
| XML elements | Inline in markdown | Semantic structure (status, budgets, events) | Agent parsing clarity, attribute metadata, nested context |
| AGENTS.md | Open standard 2024-2025 | Agent configuration/instruction format | Emerging standard backed by OpenAI, Google, Cursor, Factory |
| Structured Outputs | Claude/OpenAI native | Schema enforcement for critical outputs | Prevents format drift, machine-parseable, validation out-of-box |

### Supporting
| Pattern | Context | Purpose | When to Use |
|---------|---------|---------|-------------|
| MCP (Model Context Protocol) | Anthropic/Linux Foundation 2024 | File system tool access | When agent needs direct file read/write |
| Fenced code blocks | Markdown standard | Visual isolation for status/protocol blocks | End-of-turn sticky notes, checkpoint displays |
| YAML frontmatter | Jekyll/Hugo convention | Structured metadata in markdown | Template metadata, configuration, status tracking |
| ISO timestamps | Standard | Session/update tracking | Last_updated fields, continuity tracking |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Markdown + XML | Pure JSON | JSON loses human readability, harder to copy-paste, no inline comments |
| Markdown + XML | Pure Markdown | Markdown headers ambiguous for semantic parsing, no attribute metadata |
| End-of-turn blocks | Inline reminders | Inline interrupts reading flow, less visible, easily skipped |

**Installation:**
No dependencies — markdown + XML patterns work in any environment.

## Architecture Patterns

### Recommended Artifact Structure

```
.project/sessions/YYYY-MM-DD-description/
├── LOOPS.md              # Open questions, working memory
├── CONTEXT.md            # What's loaded, token budget, exclusions
└── SUMMARY.md            # Session export (loops + context decisions)

Templates location:
.planning/templates/
├── LOOPS_TEMPLATE.md
├── CONTEXT_TEMPLATE.md
├── SUMMARY_TEMPLATE.md
└── BOOTLOADER_TEMPLATE.md
```

### Pattern 1: Sticky Note Protocol Reminder
**What:** End-of-turn fenced code block embedding protocol checklist

**When to use:** Every agent response in single-agent environments where agent can't dynamically reference procedures

**Example:**
```markdown
<!-- Agent response text here -->

```gsd-status
📋 UPDATED: STATE.md (added LOOP-003)

CURRENT STATE:
- Phase: 01-foundation-templates
- Active loops: 3 (LOOP-001, LOOP-002, LOOP-003)
- Token budget: 2300/5000 (46%)

AVAILABLE ACTIONS:
📋 /continue | /pause | /discuss | /add-loop | /status
Loop-specific: /close-loop [ID] | /explore-loop [ID]

NEXT: Waiting for your input
```
```

**Why this works:**
- Agent reads top-down, can't refer back to bootloader — sticky note embeds reminder
- Fenced block with label creates visual separation from response content
- Predictable template — agent follows same format every time
- Parseable structure — status updates machine-readable
- Always visible — user sees protocol compliance (or lack thereof)

**Critical elements:**
- Label: ```gsd-status (consistent marker for protocol blocks)
- Updated field: What artifact changed this turn
- Current state: Phase, loops, budgets (context snapshot)
- Available actions: User always knows options
- Next field: What agent expects from user

### Pattern 2: Systematic ID Coding
**What:** TYPE-NNN format for all trackable items

**When to use:** Loops, tasks, decisions, hypotheses, plans, milestones, checkpoints

**Example:**
```xml
<loop id="LOOP-003" status="open">
  <title>Clarify CB invoice mixed-type assumption</title>
  <context>Reviewer assumed no mixed subscription/one-off invoices</context>
  <question>Is this validated? What query proves it?</question>
  <status>open</status>
</loop>
```

**ID types:**
- LOOP-NNN: Open questions, parking lot items
- TASK-NNN: Execution units
- DECISION-NNN: Architectural/technology choices
- HYPO-NNN: Hypotheses to validate
- PLAN-NNN: Phase plans
- MILESTONE-NNN: Release milestones
- CHECKPOINT-NNN: Blocking verification points

**Benefits:**
- Quick reference: "Resolved LOOP-007 → DECISION-008"
- Artifact linking: grep for LOOP-003 across all files
- Global uniqueness: IDs never repeat
- No ambiguity: TYPE prefix clarifies what it is

### Pattern 3: Visual Checkpoint Barriers
**What:** Emoji banners that arrest attention for critical events

**When to use:** Blocking checkpoints, loop capture, phase completion, artifact updates

**Example:**
```markdown
🛑🛑🛑🛑🛑🛑🛑 BLOCKING: Verification Required 🛑🛑🛑🛑🛑🛑🛑

**CHECKPOINT:** Verify dashboard layout

**Built:** Responsive dashboard at /dashboard

**How to verify:**
1. Run: npm run dev
2. Visit: http://localhost:3000/dashboard
3. Desktop (>1024px): Sidebar visible, content fills remaining space
4. Tablet (768px): Sidebar collapses to icons
5. Mobile (375px): Sidebar hidden, hamburger menu appears

────────────────────────────────────────────────────────
→ YOUR ACTION: Type "approved" or describe issues
────────────────────────────────────────────────────────
```

**Emoji conventions:**
- 🛑 Blocking checkpoint (very aggressive wall)
- 📫 Loop captured
- ✅ Task complete
- 🔮 Phase complete
- 🧪 Hypothesis validated/invalidated
- 🧠 Plan ready
- ⚡ Decision made

**Why this works:**
- Visual interruption: Emojis arrest scrolling attention
- Consistent format: User learns to recognize checkpoints
- Clear action: Always states what user needs to do
- Blocking explicit: No ambiguity about whether to wait

### Pattern 4: XML Semantic Elements in Markdown
**What:** XML tags for structured data within markdown files

**When to use:** Status tracking, token budgets, loop metadata, any parseable state

**Example:**
```xml
<context_loaded>
  <budget total="5000" used="2300" remaining="2700" threshold="warning" />
  <included>
    <file path="src/models/fct_orders.sql" tokens="450" />
    <file path="src/models/dim_customers.sql" tokens="380" />
  </included>
  <excluded reason="test_files">
    <pattern>tests/**/*.sql</pattern>
    <saved_tokens>1200</saved_tokens>
  </excluded>
</context_loaded>
```

**Benefits:**
- Attribute metadata: `status="open"` clearer than markdown tags
- Nested structure: Hierarchy without markdown ambiguity
- Greppable: Find all excluded test files with `<excluded reason="test_files">`
- Machine-parseable: Structured Outputs can validate XML schema
- Human-readable: Still markdown-friendly, renders in viewers

**When NOT to use:**
- Long-form prose: Use markdown paragraphs
- Simple lists: Markdown bullets sufficient
- Visual formatting: Markdown headers/emphasis clearer

### Anti-Patterns to Avoid

**Anti-pattern 1: Ghost Updates**
- ❌ Agent says "updated STATE.md" but doesn't show what changed
- ✅ Sticky note shows: "UPDATED: STATE.md (added LOOP-003, status: 3 active loops)"

**Anti-pattern 2: Vague Checkpoints**
- ❌ "Verify the dashboard works"
- ✅ Numbered steps with exact URLs, screen sizes, expected behavior

**Anti-pattern 3: Inconsistent ID Format**
- ❌ "loop-3", "Loop 003", "question #3" all refer to same item
- ✅ Always LOOP-003 (TYPE-NNN, zero-padded)

**Anti-pattern 4: Protocol Buried in Bootloader**
- ❌ 200-line bootloader agent can't reference mid-session
- ✅ Sticky note embeds protocol checklist at every turn

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Structured output validation | Regex parsing of XML | Claude Structured Outputs | Schema drift causes broken automations, native validation prevents format decay |
| Agent configuration format | Custom markdown convention | AGENTS.md standard | Emerging cross-platform standard (OpenAI, Google, Cursor), already has tooling |
| File system access | Prompt to copy-paste file contents | MCP tools | Eliminates copy-paste tango, agent reads files directly |
| Status tracking in markdown | Pure prose descriptions | XML elements with attributes | Ambiguous parsing, no metadata, harder to grep |
| Session state persistence | Reconstruct from chat history | Artifact files (STATE.md, LOOPS.md) | Chat context degrades, artifacts provide stable memory |

**Key insight:** In 2026, the ecosystem shifted from custom patterns to standards. MCP (Linux Foundation), AGENTS.md (multi-vendor), and Structured Outputs (Anthropic/OpenAI) all emerged 2024-2025. Use these instead of reinventing.

## Common Pitfalls

### Pitfall 1: Context Drift in Long Sessions
**What goes wrong:** Agent starts following protocol (updating artifacts, using IDs, checkpoint discipline) but degrades after 10+ turns. Forgets to update STATE.md, skips sticky notes, loses systematic ID coding.

**Why it happens:**
- LLM context window pushes early instructions out of attention
- "Lost in the middle" problem — protocol in bootloader becomes inaccessible
- Agent sees recent conversation pattern (casual back-and-forth) and mimics that instead of protocol

**How to avoid:**
- **Sticky notes as self-reminder:** Embed protocol checklist at end of every response
- **Goal reinforcement:** Restate objectives in sticky note (keeps goals in recent attention)
- **Context trimming:** Drop old turns while keeping protocol-compliant recent turns as examples
- **Fresh context windows:** Export session state, reimport with fresh agent (GSD pattern)

**Warning signs:**
- Agent stops including sticky notes
- Artifact updates mentioned but not shown in sticky note
- IDs become inconsistent (LOOP-3 vs Loop 003)
- Checkpoints lose visual barriers

**Recovery:**
User prompt: "update artifacts" triggers protocol reset. Agent reads STATE.md, shows current state in sticky note, resumes discipline.

### Pitfall 2: Visual Overhead Fatigue
**What goes wrong:** Sticky notes and emoji barriers add visual noise. User stops reading them, defeats the purpose. Agent includes them mechanically without updating content.

**Why it happens:**
- Every response has sticky note, even when nothing changed
- Emoji walls become wallpaper (brain filters out repetitive patterns)
- Sticky note content doesn't change turn-to-turn

**How to avoid:**
- **Conditional sticky notes:** Only include when artifact updated OR available actions changed
- **Delta reporting:** Show what changed, not full state dump every time
- **Emoji discipline:** Reserve 🛑🛑🛑 walls for TRUE blocking events (not every checkpoint)
- **Visual hierarchy:** Use subtle markers for informational updates, aggressive for blocking

**Example — Good sticky note evolution:**
```
Turn 1 (artifact updated):
```gsd-status
📋 UPDATED: STATE.md (added LOOP-003)
AVAILABLE ACTIONS: /continue | /close-loop 003
```

Turn 2 (no changes):
<!-- No sticky note — nothing to update -->

Turn 3 (blocking checkpoint):
🛑🛑🛑 BLOCKING: Approve LOOP-003 closure
```

**Balance:** Visual attention vs protocol enforcement. Overuse creates fatigue, underuse loses discipline.

### Pitfall 3: Template Documentation Becomes Stale
**What goes wrong:** Templates have inline comments explaining protocol, but examples don't match actual workflow. Agent follows outdated pattern in template.

**Why it happens:**
- Protocol evolves (add new checkpoint type) but template examples don't update
- Template shows XML structure, but workflow switched to pure markdown
- Comments explain "why" based on old reasoning

**How to avoid:**
- **Templates as living docs:** Update template when protocol changes
- **Version tracking:** YAML frontmatter with `updated: YYYY-MM-DD` and `version: 1.2`
- **Example validation:** Periodically test template examples still work
- **Deprecation notices:** Mark outdated patterns with `<!-- DEPRECATED: Use X instead -->`

**Verification protocol:**
After protocol change → update template → test with fresh agent → commit together

### Pitfall 4: Copy-Paste Workflow Breaks with MCP-Specific Patterns
**What goes wrong:** Template works perfectly in Claude Desktop (MCP tools available) but breaks in ChatGPT/Gemini (no MCP, copy-paste only).

**Why it happens:**
- Template instructs agent to "use MCP tool to read STATE.md"
- Copy-paste user has to manually provide file contents
- Protocol assumes agent can write files directly

**How to avoid:**
- **Dual instructions:** "If MCP available: use tool. If copy-paste: request file contents."
- **Markdown focus:** Core protocol uses markdown artifacts user can paste
- **Tool-optional design:** Templates work without MCP, MCP just makes it smoother
- **Explicit fallback:** "If you don't have file access, ask user to paste STATE.md contents"

**Example — MCP-agnostic template:**
```markdown
## Step 1: Load Current State

**If you have file access (MCP):**
Read `.planning/STATE.md` directly.

**If copy-paste workflow:**
Ask user: "Please paste contents of STATE.md"
```

**Key principle:** File-based protocol means artifacts are ALWAYS markdown files user can view/edit/paste. MCP just automates the transfer.

## Code Examples

Verified patterns from gsd_lite testing and GSD reference:

### Sticky Note Template (End of Response)

```markdown
<!-- Source: gsd_lite/BOOTLOADER_PROMPT.md + Phase 1 decisions -->

```gsd-status
📋 UPDATED: [artifact name] ([what changed])

CURRENT STATE:
- Phase: [phase number/name]
- Active loops: [count] ([LOOP-001, LOOP-002])
- Token budget: [used/total] ([percentage]%)

AVAILABLE ACTIONS:
📋 /continue | /pause | /discuss | /add-loop | /status
[Contextual actions if applicable]

NEXT: [What agent expects from user]
```
```

**Usage:** Agent includes this block at end of every response where artifact updated or state changed.

### Loop Capture with XML Structure

```xml
<!-- Source: GSD_PATTERNS.md Pattern 1 + Phase 1 decisions -->

<loop id="LOOP-003" status="open">
  <title>Clarify Chargebee invoice mixed-type assumption</title>
  <context>
    PR reviewer assumed Chargebee invoices never mix subscription and
    one-time-purchase line items. Need to validate this assumption
    before proceeding with refactor.
  </context>
  <question>
    What query proves no Chargebee invoices have mixed line item types?
  </question>
  <captured>2026-01-21T14:30:00Z</captured>
  <status>open</status>
</loop>
```

**Usage:** Agent proposes loop in this format. User approves → agent writes to LOOPS.md. Status transitions: open → clarifying → closed.

### Checkpoint Barrier (Blocking Event)

```markdown
<!-- Source: gsd_reference/get-shit-done/references/checkpoints.md -->

🛑🛑🛑🛑🛑🛑🛑 BLOCKING: Decision Required 🛑🛑🛑🛑🛑🛑🛑

**CHECKPOINT:** Select authentication approach

**Decision:** How should we handle session persistence?

**Context:** User needs to stay logged in across browser sessions.

**Options:**
1. **JWT in localStorage**
   Pros: Simple, works offline
   Cons: XSS vulnerability, manual refresh logic

2. **HTTP-only cookies**
   Pros: XSS-safe, automatic refresh
   Cons: CSRF considerations, requires backend

3. **Session database**
   Pros: Revocable, server-controlled
   Cons: Database dependency, more complexity

────────────────────────────────────────────────────────
→ YOUR ACTION: Select 1, 2, or 3
────────────────────────────────────────────────────────
```

**Usage:** Agent stops execution, displays checkpoint, waits for explicit user input. No hallucinated continuation.

### AGENTS.md Template Structure

```markdown
<!-- Source: https://agents.md/ + web research 2026 -->

---
persona: Data Engineering Copilot
tech_stack: [dbt, SQL, Python, BigQuery]
project_structure: dbt standard layout
workflows:
  - loop_capture
  - context_scoping
  - session_handoff
---

# Data Engineering Copilot

## Role
You assist with dbt model refactoring, maintaining discipline around:
- Loop capture (open questions → LOOPS.md)
- Context scoping (token budget management)
- Session handoff (export state for GTD)

## Commands
- `/add-loop [description]` - Capture new loop
- `/close-loop [ID]` - Mark loop resolved
- `/status` - Show current state (phase, loops, budget)
- `/export-summary` - Generate session summary for TickTick

## Protocol
[Rest of template follows...]
```

**Usage:** Save as `.planning/AGENTS.md` or `.project/AGENTS.md`. Supported by Claude Desktop, Cursor, and other AGENTS.md-aware tools.

### Context Budget Tracking (XML in Markdown)

```xml
<!-- Source: GSD_PATTERNS.md Pattern 7 + Phase 1 decisions -->

<context_loaded>
  <budget total="5000" used="2300" remaining="2700" threshold="warning" />
  <phase>comfortable</phase> <!-- comfortable | deliberate | warning | stop -->

  <included>
    <file path="src/models/fct_orders.sql" tokens="450" />
    <file path="src/models/dim_customers.sql" tokens="380" />
    <file path="src/models/int_order_items.sql" tokens="320" />
  </included>

  <excluded reason="test_files">
    <pattern>tests/**/*.sql</pattern>
    <saved_tokens>1200</saved_tokens>
  </excluded>

  <excluded reason="out_of_scope">
    <file path="src/models/legacy_reports/*" />
    <saved_tokens>850</saved_tokens>
    <rationale>Legacy reports not affected by grain change</rationale>
  </excluded>
</context_loaded>
```

**Usage:** Maintain in CONTEXT.md. Update when files loaded/excluded. Thresholds: 20% comfortable, 40% deliberate, 50% warning, 60%+ stop.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom agent instructions in prompt | AGENTS.md standard | 2024-2025 | Cross-platform compatibility, tooling support |
| Copy-paste file contents manually | MCP (Model Context Protocol) | Nov 2024 | Direct file access, eliminates copy-paste tango |
| Unstructured LLM output | Structured Outputs (Claude/OpenAI) | 2024-2025 | Schema validation prevents format drift |
| Single monolithic prompt | Context layering (stable → ephemeral) | GSD 2024 | Fresh context windows, reduced drift |
| Regenerate from chat history | Artifact files (STATE.md, LOOPS.md) | GSD 2024 | Stable memory, session resumption |

**Deprecated/outdated:**
- **Custom XML schema validation:** Use Structured Outputs instead (built-in, maintained by provider)
- **Instructing agent to "remember" protocol:** Use sticky notes (agents can't dynamically reference long prompts)
- **Markdown-only for structured data:** XML elements provide semantic clarity without breaking markdown
- **Prompt-engineering format compliance:** Schema enforcement is now native feature, use it

**Key 2026 shift:** Ecosystem moved from bespoke patterns to standards. MCP eliminates copy-paste workflows, AGENTS.md provides cross-tool compatibility, Structured Outputs prevent format drift. Templates should leverage these, not reinvent.

## Open Questions

Things that couldn't be fully resolved:

1. **Optimal sticky note frequency**
   - What we know: Every-turn creates fatigue, only-on-change loses visibility
   - What's unclear: Exact heuristic for when to include vs omit
   - Recommendation: Include when artifact updated OR available actions changed, test with real sessions

2. **XML vs Structured Outputs for semantic elements**
   - What we know: XML in markdown is human-readable, Structured Outputs enforce schema
   - What's unclear: Can Structured Outputs validate XML within markdown? Or separate JSON?
   - Recommendation: Test both: XML for human artifacts (LOOPS.md), Structured Outputs for machine handoffs (session export)

3. **Visual checkpoint fatigue threshold**
   - What we know: Emoji walls arrest attention initially, become wallpaper over time
   - What's unclear: How many sessions before user ignores them? Does it vary by checkpoint type?
   - Recommendation: Track in Phase 2 testing — does user engagement drop after N checkpoints?

4. **AGENTS.md tooling support in single-agent environments**
   - What we know: Standard backed by OpenAI, Google, Cursor as of 2024-2025
   - What's unclear: Do ChatGPT web UI and Gemini web UI actually read AGENTS.md?
   - Recommendation: Test and document which platforms support it, provide fallback for unsupported

5. **Context budget thresholds for different task types**
   - What we know: GSD uses 30/50/70%, we adapted to 20/40/50% for data engineering
   - What's unclear: Are different thresholds needed for different reasoning types? (SQL vs code vs prose)
   - Recommendation: Document thresholds as guidelines, not rules — let Phase 2 testing reveal patterns

## Sources

### Primary (HIGH confidence)
- **gsd_lite implementation** - Tested in production data engineering session, identified degradation patterns
  - `.planning/phases/01-foundation-templates/01-CONTEXT.md` (Phase 1 decisions)
  - `gsd_lite/BOOTLOADER_PROMPT.md`, `STATE.md`, `PROJECT.md` (working templates)
- **GSD reference patterns** - Proven framework from glittercowboy/get-shit-done
  - `.planning/GSD_PATTERNS.md` (8 pattern analyses)
  - `gsd_reference/get-shit-done/references/checkpoints.md` (checkpoint types)
  - `gsd_reference/get-shit-done/templates/state.md` (STATE.md structure)
  - `gsd_reference/get-shit-done/references/continuation-format.md` (handoff patterns)

### Secondary (MEDIUM confidence)
- [Structured outputs on the Claude Developer Platform](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) - Official Claude documentation on schema enforcement
- [Use XML tags to structure your prompts - Claude Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/use-xml-tags) - XML pattern guidance
- [How to write a great agents.md - The GitHub Blog](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) - AGENTS.md standard and best practices
- [AGENTS.md](https://agents.md/) - Official standard documentation
- [What Is MCP (Model Context Protocol)? The 2026 Guide](https://generect.com/blog/what-is-mcp/) - MCP overview and adoption

### Tertiary (LOW confidence - web search only, needs validation)
- [Context Engineering - Short-Term Memory Management with Sessions from OpenAI Agents SDK](https://cookbook.openai.com/examples/agents_sdk/session_memory) - Context drift prevention techniques
- [Understanding AI Agent Reliability: Best Practices for Preventing Drift in Production Systems](https://www.getmaxim.ai/articles/understanding-ai-agent-reliability-best-practices-for-preventing-drift-in-production-systems/) - Agent drift patterns
- [Agents At Work: The 2026 Playbook for Building Reliable Agentic Workflows](https://promptengineering.org/agents-at-work-the-2026-playbook-for-building-reliable-agentic-workflows/) - 2026 workflow patterns
- [Top 7 Code Documentation Best Practices for Teams (2026)](https://www.qodo.ai/blog/code-documentation-best-practices-2026/) - Self-documenting template practices
- [Google's Eight Essential Multi-Agent Design Patterns - InfoQ](https://www.infoq.com/news/2026/01/multi-agent-design-patterns/) - Multi-agent patterns (informational context)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - MCP, AGENTS.md, Structured Outputs all documented standards with official sources
- Architecture: HIGH - gsd_lite tested in production, GSD patterns proven framework
- Pitfalls: HIGH - identified from actual gsd_lite degradation, documented in Phase 1 context
- State of the art: MEDIUM - web research verified with official docs (Claude, GitHub) but ecosystem adoption varies
- Visual patterns: LOW - emoji barriers and sticky notes tested in gsd_lite but optimal thresholds unknown

**Research date:** 2026-01-21
**Valid until:** 2026-02-21 (30 days — standards stable, tooling support may expand)

**Research approach:**
1. Loaded Phase 1 context from CONTEXT.md (user decisions on sticky notes, IDs, checkpoints)
2. Analyzed gsd_lite implementation (real-world testing results, degradation patterns)
3. Studied GSD reference patterns (proven framework, 8 core patterns)
4. Web research on 2026 ecosystem (MCP, AGENTS.md, Structured Outputs adoption)
5. Cross-referenced findings with official documentation (Claude docs, GitHub blog)

**Key verification gaps:**
- Sticky note frequency heuristics need real-session testing
- AGENTS.md support across platforms needs verification (claim vs reality)
- Visual fatigue thresholds require user study (not just agent testing)
- XML vs Structured Outputs integration needs technical validation
