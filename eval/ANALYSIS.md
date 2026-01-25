# GSD-Lite Evaluation Analysis

**Analyzed:** 2026-01-25
**Evaluations:** eval_claude.md (Claude Sonnet 4), eval_gemini.md (Gemini 3.0 Pro), another_eval_gsd_gemini.md

## Executive Summary

- **Claude Sonnet violation**: Jumped directly to implementation without moodboard (T9), treating troubleshooting as technical detail when scope was unclear
- **Gemini iterative fixes**: Applied fixes without checkpoints (T78, T94), user had to challenge assumptions multiple times (T116, T125)
- **Gemini hallucination**: Claimed file writes without executing tool calls (T4-T6), breaking user trust
- **Missing research mode**: Protocol has no investigation phase before planning, yet users need this (another_eval T9-T16)
- **Root cause**: 930-line monolithic PROTOCOL.md creates cognitive overload, agents skip sections or lose track of requirements

---

## Coaching Analysis

Coaching violations = agent overstepped or undershot autonomy boundaries.

### Governance Framework Reference

| Decision Type | Owner | Agent Role | Example |
|---------------|-------|------------|---------|
| Vision/Outcome | User | Extract via questioning | "What should this feel like?" |
| Scope boundary | User | Clarify, redirect creep | "That's new capability - defer?" |
| Implementation choice | User (if affects UX) | Present options | "Cards vs timeline?" |
| Technical detail | Agent | Auto-fix with log | "Missing null check - adding" |
| Architectural change | User | Pause, present | "Requires new table" |

### Claude Sonnet Findings

**Session:** eval_claude.md

**Coaching Violations:**

| Turn | Violation | Type | Expected Behavior |
|------|-----------|------|-------------------|
| T9 | Jumped directly to implementation without moodboard | Overstepped | Should have asked: "What are you trying to achieve? What should the outcome feel like?" |
| T1-T8 | Read multiple files to understand problem (correct exploration) | Correct (technical investigation) | This was appropriate for understanding the codebase |
| T10-T14 | User had to explicitly call out protocol violation twice | Undershot recovery | After T10 correction, should have immediately started moodboard, not continued execution mode |
| T16-T18 | Formatting error in moodboard (options on single line) | Technical error | Should self-check output formatting before presenting |

**Pattern:** Claude treated "troubleshooting" request as technical detail with known scope, but user intention was unclear. Should have:
1. Asked user: "What's your goal? Fix the bug? Understand why it happens? Document the issue?"
2. Extracted outcome vision via moodboard questions
3. Presented whiteboard with scope/risk/verification
4. Only then applied fix

**Autonomy level assessment:** Agent assumed Vision/Outcome was implicit ("fix the bug") when it should have been extracted through questioning. This is a **scope boundary violation** - agent defined the problem without user input.

### Gemini 3.0 Pro Findings

**Session:** eval_gemini.md

**Coaching Violations:**

| Turn | Violation | Type | Expected Behavior |
|------|-----------|------|-------------------|
| T78 | Applied fix (prefer content:encoded) without discussion | Overstepped | Should have presented hypothesis: "I think the sanitizer prefers description. Should I change it to prefer content:encoded?" |
| T94 | Applied regex fix ([%s%S] pattern) without user confirmation | Overstepped (borderline) | Technical detail but risky - regex changes can break parsing. Should have asked: "I found a regex bug with newlines. Can I fix it?" |
| T116 challenge | User had to challenge fallback assumption | Undershot | Agent stated fallback exists as fact without evidence. Should have said: "I hypothesize a fallback exists. Let me verify with debug logs." |
| T125 response | Added debug logs only after user demanded empirical proof | Undershot | Should have proactively added minimal logging earlier when stating hypothesis |
| T132-T135 | User had to manually initiate /debug after multiple failures | Undershot | After T162 (third failure), agent should have recognized pattern failure and proposed systematic debugging |

**Pattern:** Gemini applied fixes iteratively without checkpoints, treating each fix as technical detail. User had to act as quality gate, challenging assumptions and demanding evidence. Agent should have:
1. After T78 failure: "My hypothesis was wrong. Let me debug systematically instead of guessing."
2. Presented whiteboard: "Debugging plan: Add minimal logs → Test → Analyze → Fix. Scope: 1-2 sessions max."
3. Obtained approval before continuing

**Autonomy level assessment:** Agent treated debugging as autonomous technical detail when it became an **implementation choice** (how to debug: iterative guessing vs systematic diagnosis). User had to redirect approach multiple times.

### another_eval_gsd_gemini.md Findings

**Session:** Gemini 3.0 Pro (same model, different project)

**Key Issues:**

1. **Hallucination (T4-T6):** Agent claimed to write files without executing tool calls
2. **Missing Research Mode (T9-T16):** User initiated /discuss but protocol had no research/investigation phase

**Coaching Violations:**

| Turn | Violation | Type | Expected Behavior |
|------|-----------|------|-------------------|
| T4 | Claimed "I have written..." without tool execution | Hallucination (not coaching) | Self-check protocol needed: "Did I EXECUTE tool calls or just DESCRIBE them?" |
| T5 | User caught hallucination | N/A | Broke trust, required user to act as verification layer |
| T6 | Agent corrected and actually executed | Recovery | Should never reach this state |
| T9-T16 | Agent entered undefined "Verification" mode | Undershot (protocol gap) | Protocol provides moodboard/whiteboard/execution but not investigation mode |

**Pattern:** Agent improvised "Verification" mode because user needed investigation before planning, but protocol doesn't cover this. User's actual need:
1. "Let me verify this is possible before we plan implementation"
2. Agent should investigate, document findings, present feasibility
3. Then proceed to moodboard/whiteboard with informed context

**Autonomy level assessment:** This reveals **protocol gap**, not coaching violation. User needed research mode but protocol forces binary choice: plan now (moodboard) or execute now. No support for "investigate first, plan later."

---

## Architectural Analysis

Architectural gaps = protocol structure enabled failures.

### Gap 1: Monolithic Protocol

**Evidence:** 930-line PROTOCOL.md (as noted in 01.3-RESEARCH.md)
**Failure Mode:** Agents skip critical sections (moodboard, questioning) or lose track of requirements
**Observed in:**
- Claude Sonnet eval_claude.md (T9 - jumped to implementation, skipped moodboard entirely)
- Gemini eval_gemini.md (no whiteboard presented before iterative fixes)

**Root cause:** Cognitive overload from loading entire protocol at once. Agent reasoning:
- "I see MOODBOARD section... and WHITEBOARD section... and EXECUTION section..."
- "User asked for troubleshooting, that sounds like execution mode"
- *Skips over critical entry conditions and mode switching logic*

**Resolution:** Decompose into separate workflow files:
- `workflows/moodboard.md` (200-300 lines) - Loaded for new phases
- `workflows/whiteboard.md` (200-300 lines) - Loaded after vision extracted
- `workflows/execution.md` (200-300 lines) - Loaded after plan approved
- `workflows/checkpoint.md` (200-300 lines) - Loaded for promotion

**Status:** Phase 1.3 deliverable (this phase)

### Gap 2: No Anti-Hallucination Protocol

**Evidence:** another_eval_gsd_gemini.md T4-T6
**Failure Mode:** Agent claims file writes without tool execution, creating phantom state
**Observed in:** Gemini 3.0 Pro

**Root cause:** No self-verification checklist in protocol. Agent generates plausible-sounding completion statements without verifying actual execution.

**Resolution:** Add self-check section to all sticky notes:
```markdown
SELF-CHECK:
- [ ] Did I EXECUTE tool calls or just DESCRIBE them?
- [ ] Are file updates CONFIRMED in tool results?
- [ ] Can I reference specific line numbers from Read results?
```

**Status:** Phase 1.3 deliverable (this phase) - Added to sticky note template in all workflows

### Gap 3: Implicit Coaching Model

**Evidence:** No governance table in original PROTOCOL.md
**Failure Mode:** Inconsistent ask vs decide behavior across sessions and models
**Observed in:** Both Claude (assumed scope) and Gemini (applied fixes without asking)

**Root cause:** Protocol says "be collaborative" but doesn't define what that means operationally. Agents interpret differently:
- Claude interprets as "understand the problem first" → reads extensively
- Gemini interprets as "solve iteratively" → applies fixes rapidly
- Neither interprets as "extract user's vision before proposing solution"

**Resolution:** Explicit governance framework at top of each workflow:
```markdown
## Coaching Philosophy

You are a **guide**, not an implementer.

| Decision Type | Owner | Your Role |
|---------------|-------|-----------|
| Vision/Outcome | User | Extract via questioning |
| Scope boundary | User | Clarify, redirect creep |
| Implementation choice | User (if affects UX) | Present options |
| Technical detail | You | Auto-fix with log |
| Architectural change | User | Pause, present |
```

**Status:** Phase 1.3 deliverable (this phase) - Repeated in each workflow file

### Gap 4: No Research/Verification Mode

**Evidence:** another_eval_gsd_gemini.md T9-T16
**Failure Mode:** User initiates /discuss for investigation, but protocol forces immediate planning
**Observed in:** Gemini 3.0 Pro

**Root cause:** Protocol provides three modes:
1. MOODBOARD (planning - extract vision)
2. WHITEBOARD (planning - confirm scope)
3. EXECUTION (work - implement)

Missing mode: RESEARCH (pre-planning - investigate feasibility before committing to plan)

**Real-world need:** User wants to ask "Is this possible? How does this work?" before planning implementation. Current protocol forces:
- Option A: Enter MOODBOARD → plan something we're not sure is feasible
- Option B: Enter EXECUTION → implement without plan

Neither fits "Let me investigate first."

**Resolution (current phase):** Moodboard workflow covers questioning adequately for vision extraction. For technical investigation, user can:
1. Ask questions before triggering formal moodboard
2. Agent investigates, documents findings in WORK.md
3. Once feasibility confirmed, proceed to moodboard with informed context

**Resolution (future consideration):** Add explicit /research trigger if evaluations show continued confusion:
```markdown
## RESEARCH Mode (Optional Pre-Planning)

**Entry:** User requests investigation without commitment to plan
**Protocol:**
1. Update STATE.md: Current Mode = Research
2. Investigate codebase/dependencies/feasibility
3. Document findings in WORK.md with evidence
4. Present findings: "Here's what I found. Ready for moodboard?"
5. Transition to MOODBOARD after user confirms
```

**Status:** Documented in checkpoint.md context lifecycle guidance, consider explicit /research in future eval

### Gap 5: No Context Lifecycle Documentation

**Evidence:** eval_gemini.md shows 279-turn session with multiple failed attempts, no clear pause/resume strategy
**Failure Mode:**
- User had to manually prompt /debug after multiple failures (no systematic recovery)
- Sessions accumulate bloat with failed hypotheses and debugging artifacts
- No clear way to checkpoint progress and resume with fresh context

**Observed in:** Gemini 3.0 Pro (eval_gemini.md spans 279 turns with T225-T279 cleanup phase)

**Root cause:** Protocol doesn't document checkpoint → clear → resume pattern:
- When to checkpoint (phase complete? stuck? session getting long?)
- How to clear (what to extract? what to delete? how to mark session end?)
- How to resume (which artifact is source of truth? how to reconstruct context?)

**Resolution:** Document context lifecycle in checkpoint.md workflow:
```markdown
## Context Lifecycle: Checkpoint → Clear → Resume

### When to Checkpoint
- Phase complete, ready for promotion
- Session approaching 50% context usage
- Work blocked, need user input or different approach

### How to Clear
1. Extract completed work to external artifact
2. Update STATE.md with decisions/position
3. Trim WORK.md (delete debugging notes, failed attempts)
4. User starts fresh chat with clean context

### How to Resume
1. Read STATE.md (where were we? what decisions made?)
2. Read WORK.md (what's in progress?)
3. Load appropriate workflow based on current state
4. Continue from last checkpoint
```

**Status:** Phase 1.3 deliverable (checkpoint.md workflow) - Addresses eval findings

---

## GSD-Lite vs OG GSD Architectural Differences

This section provides COMPREHENSIVE architectural documentation, not just eval-related differences.

### Architecture Comparison Table

| Dimension | OG GSD | GSD-lite | Rationale |
|-----------|--------|----------|-----------|
| **Orchestration** | Multi-agent (spawns subagents via Task tool) | Single-agent sessions | GSD-lite targets weaker models in chat apps without orchestration capabilities |
| **Context strategy** | Fresh windows via Task tool spawning | Checkpoint → clear → resume (manual) | No programmatic spawning available in chat interfaces |
| **Workflow scope** | Project/milestone/phase hierarchy | Single phase only | Incremental work focus, simpler mental model |
| **Protocol location** | `.claude/get-shit-done/workflows/` | `gsd-lite/workflows/` | Namespace separation, independent versioning |
| **Artifact depth** | Deep (RESEARCH, PLAN, SUMMARY, UAT) | Minimal (STATE, WORK, INBOX, HISTORY) | Weak agent optimization - aggressive trimming reduces resume complexity |
| **Planning mode** | Separate discuss-phase workflow (spawns researcher agent) | Embedded moodboard/whiteboard in main protocol | Fewer files to load, no agent spawning, simpler routing |
| **Promotion** | Automatic after phase complete | User-controlled | Prevent premature WORK.md trimming (user extracts PR content first) |
| **Model target** | Claude Opus 4+ via Claude Code CLI | Any model (Sonnet, Gemini, etc.) via chat apps | Weaker reasoning requires more explicit instructions |
| **Tool access** | Full MCP tools + file system + git operations | File-based only (copy-paste or limited MCP) | Works in constrained environments like web chat |
| **Verification** | Automated via gsd-verifier agent | Manual human verification | No subagent spawning available |
| **Entry points** | Command triggers: `/gsd:discuss-phase`, `/gsd:execute-plan` | User natural language (agent infers mode from STATE.md) | Chat apps don't support custom slash commands reliably |
| **Protocol size** | Each workflow 300-500 lines (self-contained with full context) | Target 200-300 lines per workflow (references shared templates) | Optimization for weaker model context limits |

### Design Philosophy Differences

**OG GSD philosophy:** "Spawn specialized agents for each concern, coordinate via orchestrator, fresh context per agent."
- Researcher agent extracts vision via CONTEXT.md
- Planner agent reads CONTEXT.md and creates PLAN.md
- Executor agent reads PLAN.md and creates SUMMARY.md
- Verifier agent tests and creates UAT.md
- Each agent has single responsibility, fresh context window

**GSD-lite philosophy:** "Single agent does everything, user manages context lifecycle, artifacts survive session boundaries."
- Same agent does moodboard → whiteboard → execution → checkpoint
- Agent must switch modes within same context window
- Artifacts must be minimal to enable weak agent resume
- User triggers checkpoint/clear when context gets bloated

### When to Use Which

| Scenario | Recommendation |
|----------|----------------|
| Claude Code CLI available | Use OG GSD |
| Chat interface only (ChatGPT, Claude.ai, Gemini) | Use GSD-lite |
| Opus-level model | OG GSD preferred |
| Sonnet/Gemini-level model | GSD-lite preferred |
| Multi-day project with clear milestones | OG GSD preferred |
| Single-phase incremental work | GSD-lite preferred |
| Need automated verification | OG GSD (has verifier agent) |
| Manual verification acceptable | GSD-lite (human-in-loop) |
| Working solo | Either (depending on available tools) |
| Team environment with handoffs | OG GSD (better artifact documentation) |

**Key Insight:** GSD-lite is NOT simplified GSD. It's a single-session pattern optimized for weak agents in constrained environments, using GSD's workflow decomposition principles but with fundamentally different architectural constraints (no orchestration layer, manual context lifecycle, human verification).

---

## Recommendations

### Immediate (Phase 1.3)

1. ✅ Decompose PROTOCOL.md into workflows - IN PROGRESS (this phase)
   - moodboard.md: Vision extraction via questioning
   - whiteboard.md: Scope/risk/verification proposal
   - execution.md: Task execution with loop capture
   - checkpoint.md: Promotion and context lifecycle

2. ✅ Add self-check to all sticky notes - IN PROGRESS (this phase)
   - Prevent hallucination (Gemini T4-T6 failure mode)
   - Verify tool execution actually happened
   - Confirm file updates persisted

3. ✅ Document coaching philosophy in each workflow - IN PROGRESS (this phase)
   - Explicit governance framework (who decides what)
   - Prevent premature implementation (Claude T9 failure mode)
   - Prevent iterative guessing (Gemini T78-T162 failure mode)

4. ✅ Document context lifecycle - IN PROGRESS (this phase)
   - Checkpoint → clear → resume pattern in checkpoint.md
   - When to checkpoint (50% context, phase complete, blocked)
   - How to resume (STATE.md as source of truth)

### Future Consideration

1. **Add explicit /research trigger for investigation mode**
   - Current state: Covered by informal questioning before moodboard
   - If future evals show confusion: Formalize as separate mode with WORK.md documentation structure
   - Decision point: After Phase 1.3 implementation tested with Gemini

2. **Model-specific guidance**
   - Current state: Single protocol optimized for "weakest acceptable model"
   - If future evals show divergent behavior: Add model-specific sections or variant protocols
   - Example: "Gemini 3.0 Pro: Be extra explicit about self-checks. Claude Sonnet: Focus on scope boundaries."

3. **Re-evaluate with Gemini after Phase 1.3 implementation**
   - Test decomposed workflows with same project (KOReader RSS plugin troubleshooting)
   - Measure: Does agent follow moodboard → whiteboard → execution flow?
   - Measure: Does self-check prevent hallucination?
   - Measure: Does governance framework reduce premature implementation?

4. **Consider workflow size monitoring**
   - If individual workflows grow >400 lines: Split further or move content to reference docs
   - Target: 200-300 lines per workflow (cognitive load optimization)

---

## Evidence Index

| Source | Key Turns | Findings |
|--------|-----------|----------|
| eval_claude.md | T9 | Premature implementation - jumped to fix without moodboard |
| eval_claude.md | T10-T14 | User had to correct protocol violations twice |
| eval_claude.md | T16-T18 | Formatting error in moodboard recovery attempt |
| eval_gemini.md | T78 | Applied fix (prefer content:encoded) without discussion |
| eval_gemini.md | T94 | Applied regex fix ([%s%S]) without user confirmation |
| eval_gemini.md | T116, T125 | User challenged assumptions, demanded empirical proof |
| eval_gemini.md | T132-T135 | User manually initiated /debug after multiple failures |
| eval_gemini.md | T225-T279 | Cleanup phase - reverting failed attempts, ensuring atomic patch |
| another_eval_gsd_gemini.md | T4-T6 | Hallucination - claimed file writes without tool execution |
| another_eval_gsd_gemini.md | T9-T16 | Missing research mode - agent improvised "Verification" mode |

---

*Analysis completed: 2026-01-25*
