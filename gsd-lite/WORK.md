# GSD-Lite Work Log

---

## 1. Current Understanding (Read First)

<current_mode>
execution
</current_mode>

<active_task>
Task: PROTOCOL-CRAFT-001 - The Lean Architecture
Status: IMPLEMENTATION COMPLETE (LOG-075)

**Completed:**
- [x] Merge workflows into gsd-lite.md (done prior to LOG-075)
- [x] Delete redundant files (CONSTITUTION.md, execution.md, checkpoint.md, progress.md, questioning.md)
- [x] Minimize artifact templates — 91% reduction (LOG-075)
- [x] Run token audit — **2,414 tokens fixed cost** (51% under 5k target)

**Token Budget (Verified):**
- Fixed cost: 2,414 tokens ✅ (target was <5,000)
- On-demand: 4,481 tokens (new-project + map-codebase)
- Templates: 242 tokens (structure only, no examples)
- Work budget: ~80k+ tokens for actual pair programming

**Optional Future:**
- Audit gsd-housekeeping.md (6,549 tokens) — candidate for trimming
</active_task>

<parked_tasks>
- TASK-EVAL-001: Build OpenCode session parser — SUPERSEDED by SQLite parser (LOG-045)
- TASK-CONST-002b: Write remaining rubrics (Pillar 1, 3, 4) — **DEPRIORITIZED** (evaluation reframed to practice)
- TASK-CI-L1-001: Implement Layer 1 structural checks — **OPTIONAL** (structural hygiene, not quality gate)
- RQ-3: Evaluate SKILLS.md pattern — defer until current architecture matures
- TASK-EVAL-002d: Vertex L2 refactor — **DEPRIORITIZED** (text quality checks only, optional)
</parked_tasks>

<vision>
GSD-Lite is a pair programming protocol where:
- Engineer (Driver): Owns decisions, curates what gets logged, stakes reputation on outcome
- Agent (Navigator): Proposes solutions, executes tasks, narrates reasoning
- Artifacts (Memory): Persist beyond sessions, become institutional knowledge

Core insight: Agents are brilliant but ephemeral. Engineers are permanent and must own/comprehend every decision.
Fork & resume workflow: Pair program → log rich findings → kill session when tokens rise → resume with fresh agent pointing at curated logs.

Distribution Goal: Unified "Hotel Model" — `gsd-lite install` (global) or `install --local` creates identical structure at different roots.

Token Budget: First-turn headroom is 10k tokens. Agent instructions must stay under this (currently 4,913) to leave capacity for actual work. See LOG-020.
</vision>

<decisions>
DECISION-004: Universal Onboarding in PROTOCOL.md
- Rationale: Fresh agents using direct workflow entry (e.g., discuss.md) lacked high-level context (PROJECT.md). Onboarding must be a universal boot sequence, not workflow-dependent.

DECISION-005: Decomission Sticky Note Protocol
- Rationale: Artifacts are now mature enough to be the source of truth. Repeating status in every turn adds noise/tokens without value.

DECISION-013: Unified Installation Model (LOG-013)
- Rationale: Single command structure for both global and local. Same output (opencode config + gsd-lite artifacts), different root. Smart check: skip user artifacts if exist, always overwrite templates. Simplifies mental model vs fragmented install/update/local/force flags.

DECISION-020a: Consolidate artifact documentation to agent instruction (LOG-020)
- Rationale: HTML comments in templates are invisible to grep-first onboarding. Agent instruction is ALWAYS loaded. Token budget allows: 4,913 current + 1,250 docs = ~6,163, under 10k headroom.

DECISION-020b: 10k token limit as CI gate (LOG-020)
- Rationale: Token count is deterministic and measurable. Use as fast gate before expensive LLM behavioral tests. Complements LOOP-001 (Intern Test).

DECISION-028a: Constitution-first approach for CI (LOG-028)
- Rationale: Distill immutable pillars into machine-auditable document. All other artifacts can evolve as long as they don't violate the Constitution. Decouples philosophy (stable) from implementation (evolving).

DECISION-028b: Three-layer CI architecture (LOG-028)
- Rationale: Order checks by cost — L1 structural (free), L2 constitutional (~50k tokens), L3 behavioral (~500k-1M tokens). Catch obvious breaks fast, reserve expensive LLM calls for philosophy/behavior testing.

DECISION-032a: Use OpenCode native JSON for eval data (LOG-032)
- Rationale: OpenCode already persists all session data to disk as JSON. Parse existing files instead of building custom instrumentation.

DECISION-032b: ~~Vertex AI Gen AI Eval as primary judge~~ (LOG-032) — **SUPERSEDED BY DECISION-042b**
- Rationale: Original decision based on "Bring Your Own Data" model. Superseded because Vertex AI trajectory metrics require reference_trajectory (golden path), but GSD-Lite Constitution defines behavioral patterns, not expected sequences.

DECISION-042a: Session as evaluation unit (LOG-042)
- Rationale: GSD-Lite is stateless by design. Each session is independent. Handoff (S1-H1) and onboarding (C3-H2) are session-scoped behaviors.

DECISION-042b: ~~Promptfoo with llm-rubric as primary evaluation platform~~ (LOG-042) — **SUPERSEDED BY DECISION-043a**
- Rationale: Original decision favored Promptfoo for YAML-native rubrics. Superseded because Vertex AI rubric-based metrics offer adaptive rubrics + custom guidelines parameter, and user is Google Cloud partner seeking hands-on experience.

DECISION-043a: ~~Vertex AI rubric-based metrics for Layer 2 evaluation~~ (LOG-043) — **PARTIALLY SUPERSEDED BY DECISION-071a**
- Rationale: Original claim that `GENERAL_QUALITY` could evaluate behavioral patterns (P2-H1, P2-H2, C3-H1) was incorrect. These require trajectory analysis. Valid only for text quality checks (J4-H1, P2-H3).

DECISION-043b: Hybrid architecture — Programmatic L1 + Vertex L2 (LOG-043) — **STILL VALID, SCOPE CLARIFIED BY DECISION-071c**
- Rationale: Deterministic checks (handoff presence, grep-before-read sequence) are free and fast in Python. Qualitative checks (reasoning quality, challenge tone) benefit from Vertex's adaptive rubric intelligence.
- Clarification (LOG-071): Behavioral pattern checks (P2-H1, P2-H2, P2-H5, C3-H1, C3-H2) belong in L1, not L2.

DECISION-043c: ~~Constitution as guidelines parameter~~ (LOG-043) — **PARTIALLY SUPERSEDED BY DECISION-071a**
- Rationale: Original claim that full Constitution could be injected into `guidelines` was overly broad. Valid only for text-quality behaviors (J4-H1, P2-H3), not trajectory-dependent behaviors.

DECISION-071a: Vertex `GENERAL_QUALITY` limited to text quality evaluation (LOG-071)
- Rationale: `GENERAL_QUALITY` evaluates text content/style, not tool trajectories. Supersedes LOG-043 claims about behavioral pattern evaluation. Use for J4-H1 (journalism) and P2-H3 (challenge tone) only.

DECISION-071b: Behavioral pattern checks belong in Layer 1 Python (LOG-071)
- Rationale: P2-H1, P2-H2, P2-H5, C3-H1, C3-H2 require trajectory sequence analysis. Python can directly analyze `generated_trajectory`. Free and fast (<1ms).

DECISION-071c: Final L1/L2 architecture split (LOG-071) — **AUTHORITATIVE**
- Rationale: L1 Python = structural + trajectory (S1-H*, P2-H1/H2/H5, C3-H*). L2 Vertex = text quality only (P2-H3, J4-H1). No more flip-flopping.

DECISION-042c: Hybrid orchestration — Option C (LOG-042)
- Rationale: Batch extract to individual files, evaluate each session independently, aggregate into summary. Enables surgical debugging + CI gates + re-runnable evals.

DECISION-042d: Turn-structured output schema (LOG-042)
- Rationale: Current flat schema (concatenated prompts/responses) can't support turn-level evaluation. New schema adds turns[] array with per-turn tools for LLM-as-judge correlation.

DECISION-033a: Fingerprint sessions via fs-mcp tool call paths (LOG-033)
- Rationale: When user spawns OpenCode from home dir but connects to different fs-mcp servers per session, project identity is invisible to OpenCode metadata. Extract absolute paths from tool outputs to fingerprint which project a session touched.

DECISION-045a: Migrate eval_ingest.py to sqlmodel (SQLite) (LOG-045)
- Rationale: OpenCode migrated from JSON files to SQLite. `pathlib.glob` logic is dead. `sqlmodel` provides typesafe ORM for the new `opencode.db` schema.

DECISION-045b: Update eval_transform.py to preserve full context (LOG-045)
- Rationale: Truncating responses to the last paragraph destroyed context for Vertex rubric evaluation. Rubric metrics like `GENERAL_QUALITY` need the full reasoning chain to be effective.

DECISION-046a: Implement Vertex-native turn-structured schema in `eval_ingest.py` (LOG-046)
- Rationale: Layer 1 checks failed on flat schema (losing turn context). Vertex `MULTI_TURN_GENERAL_QUALITY` requires structured turns. Refactored ingest to output `request.contents[]` directly.

DECISION-046b: Decommission `eval_transform.py` (LOG-046)
- Rationale: Transform layer existed only to bridge flat schema to Vertex format. Since ingest now outputs Vertex-native, the transform step is redundant complexity.

DECISION-072a: Deterministic evaluation of GSD-Lite is a category error (LOG-072)
- Rationale: No "golden truth" for correct pair programming behavior. The human is a confounding variable. Quality is a gradient, not binary. Vertex metrics require golden paths; Constitution defines patterns.

DECISION-072b: Reframe to "Protocol Craft" (LOG-072)
- Rationale: The actual goal is becoming a better synthesizer/teacher, with GSD-Lite as amplifier. Rename activity from "evaluation" to "Protocol Craft" — deliberate practice of refining tools via Craft Cycle (design → apply → notice → refine).

DECISION-072c: Practice over measurement (LOG-072)
- Rationale: GSD-Lite is like meditation — hard to prove it works, but practitioners report benefits. The 71 logs ARE the evidence. The kudos ARE the evaluation. Trust the practice.
</decisions>

<blockers>
None — Evaluation pursuit is complete (reframed, not abandoned).
</blockers>

<next_action>
**Practice Path (Recommended):**
1. Continue using GSD-Lite daily — the practice IS the benefit
2. Apply Craft Cycle when friction noticed — design → apply → notice → refine
3. Curate showcase portfolio — 3-5 WORK.md excerpts + resulting PRs

**Optional Structural Hygiene:**
- Token audit: Run tiktoken on workflow files, rank by value-per-token
- Log granularity: Apply revised 100-word prompt, do 48-hour cold-read test
- Housekeeping: Create `housekeeping-sandbox/` for workflow prototyping
</next_action>

---

## 2. Key Events Index (Project Foundation)


| Log ID | Type | Task | Summary |
|--------|------|------|---------|
| LOG-012 | DISCOVERY | DIST-002 | Reverse-engineered get-shit-done-cc installer patterns |
| LOG-013 | DECISION | DIST-002 | Unified install model: same output, different location |
| LOG-016 | DECISION | PROTOCOL-STATELESS | ⭐ Stateless-First Architecture: Every turn generates handoff packet |
| LOG-020 | DISCOVERY | PROTOCOL-DOCS | ⭐ 10k token budget as CI gate; HTML comments invisible to grep-first |
| **LOG-072** | **PHILOSOPHY** | **META-REFLECTION** | **⭐ The Evaluation Paradox: GSD-Lite cannot be measured, only practiced. Reframe to Protocol Craft.** |
| **LOG-073** | **DECISION** | **PROTOCOL-CRAFT-001** | **⭐ The Lean Architecture: 36,982 → ~3,800 tokens. Single-file protocol. Authoritative reference.** |
| **LOG-075** | **EXEC** | **PROTOCOL-CRAFT-001** | **Template minimization: 91% reduction (2,800 → 242 tokens). Fixed cost now 2,414 tokens.** |
| LOG-053 | DISCOVERY | READER-002 | The Node Distribution Model: npm Registry vs pnpm Efficiency |
| LOG-057 | MILESTONE | READER-003 | Reader Published to npm (@luutuankiet/gsd-reader v0.1.1) |
| **LOG-028** | **DECISION** | **CI-FRAMEWORK** | **⭐ Constitutional Knowledge + Three-Layer CI (Structural → Constitutional → Behavioral)** |
| **LOG-071** | **DECISION** | **TASK-EVAL-002d** | **⭐ Vertex Capability Assessment: GENERAL_QUALITY ≠ behavioral patterns. Final L1/L2 split. Supersedes LOG-043 partial.** |
| **LOG-072** | **PHILOSOPHY** | **META-REFLECTION** | **⭐⭐ The Evaluation Paradox: GSD-Lite cannot be measured, only practiced. Reframe from "evaluation" to "Protocol Craft." Practice > Measurement.** |
| LOG-053 | DISCOVERY | READER-002 | The Node Distribution Model: npm Registry vs pnpm Efficiency |
| LOG-057 | MILESTONE | READER-003 | Reader Published to npm (@luutuankiet/gsd-reader v0.1.1) |
| LOG-058 | EXEC | READER-004 | Reader v0.2.0: Section Rendering & Scroll Sync (completing LOG-047 vision) |


## 3. Atomic Session Log (Chronological)

### [LOG-001] - [DISCOVERY] - Vision Archaeology: Unearthing GSD-Lite's True Purpose from Artifacts and PRs - Task: BOOTSTRAP-001
**Timestamp:** 2026-02-03 14:30
**Details:**
This session performed "vision archaeology" — reconstructing the true purpose of GSD-Lite by examining its evolution through planning artifacts, merged PRs, and a production deployment. What emerged was not a "session handoff framework" but something deeper: a **pair programming protocol** that ensures engineers own and comprehend every decision, even when agents do the heavy lifting.

**The Investigation: Three Sources of Truth**

We examined three artifact layers to understand what GSD-Lite had become:

1. **Original PROJECT.md** (`.planning/PROJECT.md`)
   - Started as "Data Engineering Copilot Patterns" — a documentation project
   - Core value: "Maintain ownership of the reasoning process"
   - This was the seed, but the plant had grown beyond it

2. **Merged PRs** (7 PRs from GitHub)
   - PR #10: Echo-back onboarding — agents must prove understanding before executing
   - PR #8: Summary in headers — logs are grep-scannable
   - PR #4: Workflow decomposition — 929-line monolith → 5 focused files
   - PR #2: INIT_PROMPT — 120 lines vs 300+ docs for activation
   - Pattern: Every PR optimized for **agent comprehension** and **token efficiency**

3. **Production Deployment** (Meltano pipeline, `/workspaces/.../estrid-meltano-el`)
   - 26 rich log entries demonstrating the pattern in action
   - LOG-017 "Time Traveler Bug" — journalism narrative with analogy
   - LOG-025 "Blank String Philosophy" — decision with "Silent Nod" metaphor
   - PR_DATA_339.md — PR description generated from WORK.md logs

**The Revelation: Fork & Resume as Core Mechanic**

The production deployment revealed a workflow not explicitly documented:

```
SESSION 1 (tokens: 0 → 60k)
├── Pair program with agent
├── Hit finding → "Log this with journalism narrative"
├── Agent writes rich log entry
├── Tokens rising toward 80k
└── FORK: Kill session, keep artifacts

SESSION 2 (tokens: 0 → fresh)
├── "Read LOG-017, continue from there"
├── Agent onboards from curated artifact
├── Continue pair programming
└── FORK again when needed
```

**The Insight User Emphasized:**
> *"Agents are ephemeral however brilliant. It is the engineers that has the final stake and should hone their skill learning from the best."*

This reframed everything. GSD-Lite isn't about making agents more effective — it's about making **engineers** more effective by:
1. Capturing agent brilliance in permanent artifacts
2. Forcing engineers to curate what's worth preserving
3. Creating onboarding docs that teach reasoning, not just outcomes

**The "Silent Nod" Analogy (from LOG-025):**

To explain why this matters, consider this analogy from the production logs:

Imagine you ask a colleague, "Do you want coffee?"
- **NULL Response:** They stare blankly. You don't know if they heard you. (Unknown)
- **Empty String Response:** They give a **Silent Nod**. No words, but the message is clear.

In GSD-Lite terms:
- **Chat history** is like the colleague's spoken words — ephemeral, expensive to replay
- **WORK.md logs** are like written meeting notes — permanent, searchable, teachable

An engineer reading LOG-025 doesn't just learn that empty strings mean "local currency" — they learn the *reasoning pattern* for how to think about data semantics. They can apply that pattern to the next ambiguous field they encounter.

**The Logging Standard (Captured in PROJECT.md):**

User provided the explicit prompt pattern for rich logging:

> *"Please include specific code snippet, reasoning, extended context in a journalism narrative style so that whoever with 0 context can onboard and pick up this key record of decision without ambiguity or friction. Add a cherry on top to include exact/synthesized example to explain the concepts/findings mentioned so that other weaker reasoning agents can grasp topic with little friction and ambiguity."*

This is now documented in PROJECT.md under "The Logging Standard" with a table of required elements:
- Narrative framing (hook the reader)
- The symptom (what went wrong)
- The evidence (concrete proof)
- The root cause (why it happened)
- The analogy (ELI5 for onboarding)
- The decision (what we chose)
- Code snippet (executable proof)

**Decisions Made:**

| Decision | Rationale |
|----------|-----------|
| Core value = "engineer ownership of reasoning" | Session continuity is mechanism, not purpose. Engineers stake reputation on code. |
| Added "Philosophy" section to PROJECT.md | The "why" deserves explicit articulation, not just implied through mechanics. |
| Added "Pair Programming Model" section | Fork & resume workflow was implicit — now documented with ASCII diagram. |
| Added "Logging Standard" section | Journalism narrative style is teachable, should be codified. |

**Files Modified:**
- `gsd-lite/PROJECT.md` — Complete rewrite with new sections: Philosophy, Pair Programming Model, Logging Standard
- `gsd-lite/WORK.md` — This log entry + Current Understanding updated for checkpoint

**Cherry on Top: The "Driver vs Passenger" Mental Model**

To help weaker agents (or future engineers) understand GSD-Lite's philosophy:

Imagine learning to drive:
- **Passenger mode:** You sit in the back, agent drives. You arrive at the destination but couldn't drive yourself.
- **Driver mode (GSD-Lite):** Agent is in the passenger seat with the map. They suggest "turn left here because of traffic." You make the turn AND understand why.

Six months later:
- **Passenger:** "Why did we go this route?" "I don't know, the agent chose it."
- **Driver:** "We avoided Main Street because it floods during rain. I learned that from the agent and now I always check weather before routing."

GSD-Lite ensures you're always in the driver seat — learning the "why" behind every decision, able to defend it, able to apply the pattern next time.


### [LOG-002] - [DISCOVERY] - Protocol: Mining User Patterns from Storage (Discarding Sub-Agents) - Task: PROTOCOL-001
**Timestamp:** 2026-02-03 15:15
**Details:**
This session established a rigorous protocol for mining user behavior from the `storage/` directory, specifically distinguishing between "pure" GSD-Lite sessions (manual fork) and multi-agent GSD sessions (programmatic fork).

**The Discovery:**
- Initial scan conflated `gsd-lite` sessions with `gsd` multi-agent sessions.
- `gsd` sessions use `Task()` calls to spawn sub-agents (`gsd-planner`, `gsd-executor`).
- `gsd-lite` sessions use manual session handoff ("Fork & Resume").
- Mixing these data points corrupts the insight into the user's *manual* workflow.

**The Protocol for Future Agents (How to Mine Storage):**

1. **Discovery:**
   - List `storage/project` to find project contexts.
   - Read project JSONs to identify relevant worktrees.

2. **Filtering (CRITICAL):**
   - Read `storage/session/{proj_id}/*.json`.
   - **MUST** filter for `agent: "gsd-lite"`.
   - **MUST** discard `agent: "gsd-planner"`, `gsd-executor`, etc.
   - Sort filtered sessions by date to find recent relevant work.

3. **Reconstruction:**
   - Read `storage/message/{session_id}`.
   - Read `storage/part/{message_id}` to get text content.
   - Note: First message often contains the SYSTEM PROMPT injection in its text part. Look for the *second* message or distinct user parts for actual user input.

4. **Insight Extraction:**
   - Look for **"Fork" moments**: Session Start → Read Context → Continue.
   - Look for **"Thinking Partner" moments**: Agent challenging user assumptions vs just executing.
   - Ignore "Spawn" moments: `Task()` tool calls are programmatic implementation details, not user behavior.

**Why this matters:**
Analyzing the wrong agent type leads to "optimizing the machine" instead of "optimizing the human". GSD-Lite is about the human workflow.

### [LOG-003] - [DISCOVERY] - The "Driver" Persona: Pattern Recognition from Storage Mining - Task: PROTOCOL-001
**Timestamp:** 2026-02-04 10:30
**Details:**
Mining the storage logs for `gsd-lite` sessions revealed a distinct "Driver/Navigator" usage pattern that defines this user's productivity flow. The user doesn't just "chat" — they execute a precise rigorous loop of context setting, validation, and Socratic inquiry.

**The "Fork" Pattern (Token Optimization Strategy):**
The most productive sessions start with a specific signature:
1. **The Trigger:** "Let's load protocol and continue..."
2. **The Context:** Explicit pointer to `WORK.md` or a specific file path.
3. **The Intent:** "I'm at this part... my question is..."

This is the **manual fork**. The user curated the artifacts in the previous session (the "Pit Stop") so the new agent (the "Fresh Driver") can start immediately at high speed without carrying the baggage (token cost) of the previous 50 turns.

**The "Driver" Persona (User Behavior):**
The user acts as the Lead Engineer (Driver) using the Agent as a Senior Technical Investigator (Navigator).

*   **Context-Heavy Prompts:** Instead of "fix this," the user says "Look at `tmp/reference/.../streams.py`, I see X, but ticket says Y."
*   **Validation Queries:** "Is it valueTextType or itemNumber?" — specific A/B testing of hypotheses.
*   **Mental Model Checks:** "Does this mean we need to create a new plugin child?" — verifying understanding before coding.

**The "Thinking Partner" Requirement:**
The user explicitly prompted an agent to be a "Patient Coding Teacher" with "Socratic Methodology." They don't want silent fixes; they want to *derive* the answer.

**Cherry on Top: The "Pit Stop" Analogy**

To explain why this "Fork & Resume" pattern is so effective:

Imagine Formula 1 racing:
*   **The Car:** The Project State (Code + Artifacts).
*   **The Driver:** The Agent (Ephemeral).
*   **The Race Engineer:** The User (Permanent).

In a long race (complex feature), tires wear out (context window fills up, reasoning degrades).
*   **Bad Strategy:** Keep driving on bald tires. The driver gets confused, hallucinates, crashes.
*   **GSD-Lite Strategy:** **Pit Stop.**
    1.  **Box Box Box:** User calls "checkpoint" or manual fork.
    2.  **Tire Change:** Old context window is dumped.
    3.  **Fresh Tires:** New agent starts, reads `WORK.md` (Telemetry), and exits the pit lane at full speed.

The car (project) is the same, but the driver (agent) is fresh and focused. The "Fork" is just a Pit Stop.

**Code Snippet: The "Fork" Signature**

Future agents can identify these high-value start points by looking for this pattern in the first user message:

```json
{
  "role": "user",
  "text": "let's load protocol and continue our work... I'm at [specific file path]..."
}
```

**Status:** Discovery complete. Validated that questioning enhancement must support this "Driver" workflow (Technical Investigation & Mental Model Validation), not just high-level "Vision Extraction".

---
### [LOG-004] - [DECISION] - Storage Protocol v2: Direct Agent Filtering - Task: PROTOCOL-001
**Timestamp:** 2026-02-04 10:15
**Context:**
Refining the storage mining protocol from LOG-002 based on successful navigation.

**The Finding:**
- `storage/session/{id}.json` does NOT contain the `agent` field.
- `storage/message/{msg_id}.json` DOES contain `agent: "gsd-lite"`.
- `finish: "tool-calls"` in message JSON indicates no text output (silent execution).
- `finish: "stop"` indicates text output or completion.

**Protocol v2 (The Efficient Path):**
1. **List Sessions:** `ls storage/session/{proj_id}/` (sort by time if possible, or ID).
2. **Sample First Message:** Read `storage/message/{first_msg_id}.json`.
3. **Check Agent:** Filter for `agent: "gsd-lite"`.
4. **Scan for Interaction:**
   - Look for messages with `role: "assistant"` AND `finish: "stop"`.
   - Messages with `finish: "tool-calls"` are often silent execution loops.
   - User patterns live in `role: "user"` message parts.

**Why:**
This saves token budget by avoiding reading full session contents for "ghost" sessions (sub-agents) or "silent" sessions (pure tool loops).

---
### [LOG-005] - [DISCOVERY] - User Pattern: The Socratic Engineer - Task: PROTOCOL-001
**Context:**
Analyzed deep session `ses_4011d8550...` where user pasted a "Patient Coding Teacher" persona.

**The "Fingerprint" (How this user works):**
1. **Persona:** "Patient Coding Teacher" / "Collaborative Mentor".
2. **Core Mechanic:** Socratic Inquiry. Don't just answer; ask questions to help derive the answer.
3. **Decision Making:** "The Menu Technique" — present numbered lists of options (Concept vs Code, Strategy A vs B).
4. **Pacing:** "Mandatory Confirmation Loops" — pause and verify before moving on.
5. **Philosophy:** "Concept Over Code" — establish mental models first.

**Implication for GSD-Lite:**
The "Questioning" enhancement isn't just about requirements gathering (OG GSD style). It must be about **Coaching**.
- **Old Model:** "What feature do you want?" -> "Here are the specs."
- **New Model:** "Why this feature?" -> "Have you considered X?" -> "Let's map the mental model."

**Action:** : New `questioning.md` reference will focus on "Thinking Partner" techniques, not just project scoping.

### [LOG-006] - [VISION] - The Questioning Enhancement: Learning Accelerator Through Socratic Pair Programming - Task: QUESTION-001
**Timestamp:** 2026-02-04
**Context:**
User initiated enhancement request: "The OG GSD framework has something great about its prompt engineering — the agent really asks the right questions." After analyzing OG GSD's `.claude/get-shit-done/references/questioning.md` and `.claude/commands/gsd/discuss-phase.md`, we interviewed the user to extract their specific vision for GSD-Lite.

**The Core Discovery: GSD-Lite Is Not a Task Manager**

Through Socratic dialogue, we derived that GSD-Lite's true purpose isn't task management or project planning — it's a **learning accelerator**. The artifacts (WORK.md, INBOX.md) aren't just logs; they're **crystallized understanding** that:
1. The user derived through dialogue (not received passively)
2. Are written so the user can explain them to anyone
3. Enable weaker agents (or future humans) to onboard without friction

**The Golden Rule: "Always Ask WHY Before HOW"**

This single behavioral instruction captures the essence of effective pair programming for this persona:

| Situation | Without the Rule | With the Rule |
|-----------|------------------|---------------|
| User says "add dark mode" | Agent starts implementing | "Why dark mode? User preference? Accessibility? Battery saving? This affects the approach." |
| Agent about to refactor | Just refactors | "I'm about to change X to Y. The WHY: [reason]. Does this match your mental model?" |
| Codebase uses unfamiliar pattern | Agent uses it silently | "I see the codebase uses [pattern]. Before I continue — want me to explain why this pattern exists here?" |
| User makes a decision | Agent accepts and executes | "You chose X over Y. I want to challenge that — have you considered [tradeoff]?" |

**The Pair Programming Model**

```mermaid
graph TD
    subgraph "The Triad"
        User["DRIVER (User)<br/>• Bring context<br/>• Make decisions<br/>• Own the reasoning<br/>• Curate what's logged"]
        Agent["NAVIGATOR (Agent)<br/>• Challenge assumptions<br/>• Teach concepts<br/>• Propose options with tradeoffs<br/>• Present plans before executing"]
        Artifacts["MEMORY (Artifacts)<br/>• Crystallized understanding<br/>• Zero-context onboarding<br/>• Weaker-agent-friendly"]
    end
    User <-->|Socratic Dialogue| Agent
    User -->|Curate| Artifacts
    Agent -->|Draft| Artifacts
    Artifacts -.->|Onboard| Agent
```

**The 10-Star Experience (User's Own Words)**

> "The 10-star experience was when I probed it to detour and go down a rabbit hole asking about a new concept that the codebase used. Asking it to explain, put on its teaching hat, explored the codebase and made the connections and distilled it down to layman level with concrete codebase snippets to solidify the concept for me."

This is the signature of a great session:
1. User notices something unfamiliar → pauses execution
2. Agent puts on teaching hat → explores, connects, distills
3. User gains understanding → now OWNS the knowledge
4. User prompts logging → journalism-style entry preserved
5. User forks session → fresh agent resumes with crystallized context

**The Challenge Tone Protocol (Context-Dependent)**

The user wants an agent that challenges assumptions — but the tone must match the situation:

| Tone | When to Use | Trigger |
|------|-------------|---------|
| **(A) Gentle Probe** | User stated preference without reasoning. Early in discussion. | "Interesting — what draws you to X here?" |
| **(B) Direct Challenge** | High stakes, clear downside, trust established. | "I'd push back hard here. [Reason]. Let's do Y instead." |
| **(C) Menu with Devil's Advocate** | Genuine tradeoff, no obvious right answer. | "X (your instinct) vs Y (counterpoint). Tradeoffs: [list]. Which fits?" |
| **(D) Socratic Counter-Question** | User confident but has blind spot. Teaching moment. | "If we go with X, what happens when [edge case]?" |

**Decision Tree for Agent:**

```mermaid
flowchart TD
    Start([User states decision]) --> Why{Explained WHY?}
    Why -- No --> A[A: Gentle Probe]
    Why -- Yes --> Blind{Blind spot?}
    Blind -- Yes --> D[D: Socratic Counter-Question]
    Blind -- No --> Tradeoff{Genuine Tradeoff?}
    Tradeoff -- Yes --> C[C: Menu w/ Devil's Advocate]
    Tradeoff -- No --> Stakes{High Stakes?}
    Stakes -- Yes --> B[B: Direct Challenge]
    Stakes -- No --> Accept([Accept & Continue])
```

**Key User Insight: "Writing Is Thinking"**

> "The fastest way to learn anything for me is to get my hands dirty, to write out my thoughts, albeit to an agent. Writing is thinking. That is the most valuable thing I find about working projects with an agent helping me."

The agent isn't a coder-for-hire — it's a **sparring partner for thinking**. When the user writes their thoughts to the agent, they're clarifying their own mental model. When the agent challenges back, it sharpens further.

**The Anti-Pattern: Eager Executor**

The user described a recurring frustration: agents that skip the "pause and discuss" step. They execute ahead of their plan, making assumptions instead of asking. The user has to manually pause and ask "why that approach?" — then fork the session with the reasoning baked into WORK.md.

**Solution:** Workflows must instruct agents to present plans before executing, and pause when approaching decisions the user might care about.

**Architectural Decision: Merge Moodboard + Whiteboard → Discuss**

The current moodboard/whiteboard split assumes:
- User has fuzzy idea that needs extracting (moodboard)
- User needs formal plan presented (whiteboard)
- Sequential phases: Dream → Plan → Execute

But the user's actual pattern is:
- Context-rich starts ("I'm at this part, my question is...")
- Continuous dialogue where understanding and planning interweave
- Teaching moments emerge organically, not in a "moodboard phase"

**Decision:** Replace moodboard.md + whiteboard.md with unified `discuss.md` that adapts to context. Create `questioning.md` reference file with philosophy + techniques.

**User Controls for Hyper-Focus Context Engineering**

User explicitly wants gatekeeper control over artifact writes:
- Every write costs tokens and narrows context window
- Agent should ask "Want me to capture this?" not auto-write
- Logging is a deliberate act of curation, not automatic journaling

**Next Actions:**
1. Create `gsd-lite/template/references/questioning.md` — philosophy + techniques
2. Create `gsd-lite/template/workflows/discuss.md` — unified exploration workflow
3. Update `execution.md` — lighter, focused on doing (discuss handles thinking)
4. Remove or deprecate moodboard.md and whiteboard.md

**Cherry on Top: The Journalism Prompt**

User's exact prompt for logging discoveries (for agent reference):

> "Please include specific code snippet, reasoning, extended context in a journalism narrative style so that whoever with 0 context can onboard and pick up this key record of decision without ambiguity or friction. Add a cherry on top to include exact / synthesized example to explain the concepts / findings mentioned so that other weaker reasoning agents can grasp topic with little friction and ambiguity."

This is the standard for LOG entries in GSD-Lite.

### [LOG-007] - [DECISION] - The standard length and outline for optimal gsd-lite artifacts

#### Current GSD-Lite Artifact Sizes

| Artifact | Lines | Est. Tokens | Purpose |
|----------|-------|-------------|---------|
| **OG GSD questioning.md** | 142 | ~1,247 | Philosophy reference |
| **OG GSD discuss-phase.md** | 434 | ~3,323 | Full workflow |
| | | | |
| **GSD-Lite PROTOCOL.md** | 209 | ~2,252 | Router + golden rules |
| **GSD-Lite moodboard.md** | 406 | ~3,249 | Vision extraction |
| **GSD-Lite whiteboard.md** | ~280 | ~2,187 | Plan presentation |
| **GSD-Lite execution.md** | 414 | ~2,778 | Task execution |

#### The Context Budget Reality

When an agent loads a workflow, here's what happens:

```
┌─────────────────────────────────────────────────────────────┐
│  AGENT CONTEXT WINDOW (let's say 80k target budget)         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  System prompt / PROTOCOL.md     ~2,200 tokens (always)     │
│  WORK.md Current Understanding   ~500-1,000 tokens          │
│  Workflow file                   ~2,500-3,500 tokens        │
│  Reference files (if loaded)     ~1,000-2,000 tokens        │
│  ─────────────────────────────────────────────────────────  │
│  BASELINE OVERHEAD               ~6,200-8,700 tokens        │
│                                                              │
│  Remaining for:                                              │
│  - Conversation turns                                        │
│  - Code reading                                              │
│  - Tool outputs                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**The Pit Stop philosophy says:** Minimize baseline overhead so agents have more runway before needing a fork.

---

#### 🎯 Recommended Artifact Specifications

##### 1. `questioning.md` (NEW — Reference File)

**Purpose:** Philosophy + techniques for Socratic pair programming. Referenced by workflows, not loaded every session.

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Lines** | 100-150 | Matches OG GSD (142 lines) |
| **Tokens** | ~1,000-1,500 | Light enough to inline when needed |
| **Sections** | 5-6 max | Scannable, not exhaustive |

**Proposed Outline:**

```markdown
# Questioning Guide (~120 lines)

## Philosophy (~15 lines)
- "Thinking partner, not interviewer"
- "Always Ask WHY Before HOW"
- Learning accelerator, not requirements gathering

## The Challenge Tone Protocol (~25 lines)
- Decision tree (A/B/C/D)
- When to use each tone
- Mermaid diagram

## Question Types (~20 lines)
- Motivation (why this exists)
- Concreteness (what it actually is)  
- Clarification (what they mean)
- Success (how you'll know)

## Techniques (~25 lines)
- Follow energy
- Challenge vagueness
- Make abstract concrete
- Know when to stop

## Anti-Patterns (~15 lines)
- Checklist walking
- Eager executor
- Shallow acceptance

## The Teaching Detour (~20 lines)
- The 10-star experience pattern
- When to offer: "Want me to explain this concept?"
- How to: explore, connect, distill, example
```

**Why this size:** Small enough to inline into workflow preambles. Large enough to be complete. OG GSD proved 142 lines is sufficient.

---

##### 2. `discuss.md` (NEW — Unified Workflow, replaces moodboard + whiteboard)

**Purpose:** Adaptive exploration — handles both vision extraction AND plan presentation based on context.

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Lines** | 250-300 | Smaller than moodboard (406) + whiteboard (280) combined |
| **Tokens** | ~2,000-2,500 | Same budget as current moodboard |
| **Sections** | 7-8 | Entry → Adapt → Explore → Confirm → Exit |

**Proposed Outline:**

```markdown
# Discuss Workflow (~280 lines)

## Purpose (~10 lines)
- Unified exploration: vision OR plan OR teaching
- Adapts to what user brings

## Entry Conditions (~10 lines)
- Default when no active execution task
- User signals: "let's discuss", "I have a question", "help me understand"

## Context Reading (~20 lines)
- Read WORK.md Current Understanding
- Detect: fresh start vs mid-project vs blocked

## Adaptive Routing (~30 lines)
- If fresh/fuzzy → Vision exploration mode
- If mid-project + question → Teaching/clarification mode  
- If blocked → Unblocking mode
- If ready to plan → Plan presentation mode

## Exploration Loop (~60 lines)
- Reference questioning.md philosophy
- 4 questions, then check pattern
- Challenge tone decision tree
- "Want me to capture this?" gates

## Teaching Detour Protocol (~40 lines)
- Detect unfamiliar concepts
- Offer: "Want me to explain [X]?"
- Pattern: explore → connect → distill → example
- Return to main thread

## Plan Presentation (~40 lines)
- When understanding is sufficient
- Present plan for approval
- User confirms or requests changes

## Exit Conditions (~20 lines)
- Transition to execution
- Checkpoint if pausing
- Capture decisions to WORK.md

## Anti-Patterns (~20 lines)
- Eager executor (skip discuss, start coding)
- Interrogation mode
- Auto-writing without permission

## Sticky Note (~30 lines)
- Required end-of-turn format
```

**Why this size:** Combines moodboard (406) + whiteboard (280) = 686 lines, but we're targeting ~280 because:
1. Redundancy removed (both had similar patterns)
2. Philosophy moved to `questioning.md` reference
3. Adaptive routing replaces rigid phases

---

##### 3. `execution.md` (UPDATE — Lighter)

**Current:** 414 lines, ~2,778 tokens

**Proposed:** 300-350 lines, ~2,200 tokens (trim ~15-20%)

**What to trim:**
- Move questioning/blocking logic to reference `questioning.md`
- Simplify — execution should be about DOING, not exploring
- Add: "When stuck, transition to discuss.md"

---

#### 📐 The Sizing Philosophy

| Artifact Type | Target Lines | Target Tokens | Rationale |
|---------------|--------------|---------------|-----------|
| **Reference files** | 100-150 | ~1,000-1,500 | Inlineable, philosophy-focused |
| **Workflow files** | 250-350 | ~2,000-2,800 | Complete but not bloated |
| **Router (PROTOCOL.md)** | 200-250 | ~2,000-2,500 | Always loaded, must be lean |

**The Test:** If a workflow exceeds 400 lines, ask: "What can be extracted to a reference file?"

---

### [LOG-008] - [EXEC] - Implemented Questioning Enhancement with "Mode-Based" Workflow - Task: QUESTION-001
**Timestamp:** 2026-02-04 11:30
**Details:**
Executed the plan from LOG-006 and LOG-007 to enhance GSD-Lite's questioning capability. This involved a significant architectural shift from "sequential phases" (Moodboard → Whiteboard → Execution) to "adaptive modes" (Discuss ↔ Execute) powered by a central questioning philosophy.

**The shift:**
- **From:** Rigid phases (`moodboard.md` for vision, `whiteboard.md` for planning)
- **To:** Unified `discuss.md` that adapts to context (Vision, Teaching, Unblocking, Planning)

**Files Created/Updated:**
1. **`src/gsd_lite/template/references/questioning.md`** (NEW - 143 lines)
   - The "DNA" of Socratic pair programming.
   - Contains: Golden Rule ("Why before How"), Challenge Tone Protocol, Teaching Detour.
2. **`src/gsd_lite/template/workflows/discuss.md`** (NEW - 289 lines)
   - Replaces both `moodboard.md` and `whiteboard.md`.
   - Adaptive entry: Reads `WORK.md` to decide if it's exploring vision, teaching a concept, or presenting a plan.
3. **`src/gsd_lite/template/workflows/execution.md`** (TRIMMED - 222 lines, down from 414)
   - Focused purely on DOING.
   - Trigger: "Let's pause and discuss" → forks to `discuss.md`.

**Cherry on Top: The "Room vs Tool" Analogy**

To explain why we moved to "Mode-Based" workflows:

Imagine a workshop:
- **Phase-Based (Old):** You have a "Thinking Room" and a "Building Room". To think, you must leave the building room, walk down the hall, and enter the thinking room. It's friction.
- **Mode-Based (New):** You are at the workbench (Execution). You put down the hammer and pick up the whiteboard marker (Discuss). You're in the same space, just switching tools.

In GSD-Lite:
- **Old:** "I'm stuck. Let me load `moodboard.md`..." (Context switch overhead)
- **New:** "I'm stuck. Let's discuss." (Seamless mode switch, same context)

**Code Snippet: The Adaptive Routing Logic (from discuss.md)**

This logic allows one workflow to handle multiple user needs:

```markdown
## Context Reading

Read WORK.md Current Understanding to detect state:

| State Detected | Mode to Enter |
|----------------|---------------|
| No active phase, fuzzy vision | Vision Exploration |
| Active phase, user has question | Teaching/Clarification |
| Active task, user is blocked | Unblocking |
| Understanding complete, ready to plan | Plan Presentation |
```

**Status:** Implementation complete. Ready to update router (PROTOCOL.md).


### [LOG-009] - [DECISION] - Protocol v2.1: Questioning DNA and Mode-Based Architecture - Task: PROTO-001
**Timestamp:** 2026-02-04 12:00
**Context:**
The GSD-Lite protocol was upgraded from a sequential phase-based model to an adaptive mode-based architecture. This shift reflects the user's "Driver/Navigator" persona, where learning and mental model validation are as important as task execution.

**The Finding: Questioning is the DNA, Not a Phase**
The previous architecture separated vision extraction (`moodboard.md`) and planning (`whiteboard.md`) into rigid sequences. However, real-world sessions showed that questioning, teaching, and unblocking are continuous needs that emerge organically during both planning and execution. 

**Decision: Inline Philosophy for Zero Friction**
We decided to append the full `questioning.md` content (Philosophy, Challenge Tones, Teaching Detours) directly to `PROTOCOL.md`.
- **Reasoning:** 1.2k tokens is a minor cost to ensure the agent ALWAYS operates as a Socratic "Thinking Partner." 
- **Benefit:** It eliminates the friction of an agent needing to remember to read a separate reference file, ensuring the "Golden Rule" (Why Before How) is applied to every turn.

**Architectural Change: From Rooms to Tools**
- **Old (Sequential):** Moodboard → Whiteboard → Execution (The "Moving Rooms" model).
- **New (Adaptive):** `discuss.md` ↔ `execution.md` (The "Workbench Tools" model).
- `discuss.md` now acts as a Swiss Army knife for exploration, teaching, and planning.

**Cherry on Top: The "Socratic Workbench" Analogy**

Imagine a craftsman's workshop:
- **Sequential Model:** To think about a design, you must leave the workbench and walk to a separate office. By the time you get back to the wood, the inspiration might be cold.
- **Socratic Workbench (GSD-Lite v2.1):** You are at the bench with the wood (Execution). You feel a knot in the grain (Unfamiliar Concept). Instead of walking away, you simply put down the chisel and pick up the measuring tape and pencil (Discuss). You analyze, teach yourself about the grain, and then pick the chisel back up with new understanding.

In this model, the **Questioning DNA** in the PROTOCOL is like the bright overhead lighting in the workshop — it doesn't matter which tool you're holding; you can always see the "Why" behind the work.

**Synthesized Example: The "Mode Switch" in Action**

*Scenario: User is executing a task to refactor a Python class.*

1. **Execution Mode:** Agent proposes a refactor using a `Protocol`.
2. **User Question:** "Why use `Protocol` here instead of `abc.AbstractBaseClass`?"
3. **Mode Switch (Automatic):** The agent identifies this as a **Teaching Detour** (from the DNA in PROTOCOL). It switches to **Discuss Mode** logic.
4. **Teaching Detour:**
   - **Explore:** Shows `typing.Protocol` usage in the codebase.
   - **Connect:** Relates it to "Duck Typing" which the user knows.
   - **Distill:** "ABCs are 'is-a' relationships; Protocols are 'behaves-like' relationships."
   - **Example:** `class Flyer(Protocol): def fly(self): ...`
5. **Resume Execution:** "Ready to proceed with the `Protocol` approach, or want to stick to ABCs?"

**Status:** PROTOCOL.md v2.1 committed. Moodboard and Whiteboard deprecated and removed. Architecture is now mode-based.

### [LOG-010] - [DECISION] - Universal Onboarding & The End of Sticky Notes - Task: PROTO-002
**Timestamp:** 2026-02-04 13:00
**Context:**
A critical onboarding gap was discovered in the "Fork & Resume" workflow. If a user forks a session and invokes `discuss.md` directly (e.g., "Let's discuss this loop"), the fresh agent would read `PROTOCOL.md` and `WORK.md` but **miss** `PROJECT.md` (Vision) and `ARCHITECTURE.md` (Tech Stack).

This created "Forwarder Agents" — agents that mechanically execute the workflow but lack the deep context to ask intelligent, grey-area probing questions (the core value of GSD).

**The Solution: Universal Onboarding**
We moved the onboarding responsibility from individual workflows (like `progress.md`) to the `PROTOCOL.md` router itself. Now, **every** fresh session begins with a mandatory boot sequence:
1. `PROTOCOL.md`
2. `PROJECT.md` (Vision - The Why)
3. `ARCHITECTURE.md` (Tech - The How)
4. `WORK.md` (State - The Where)

**The Trade-off:**
We centralized onboarding (DRY) rather than duplicating it in every workflow file. This ensures consistent "Smart Agent" behavior regardless of entry point.

**The Cleanup: Decomissioning Sticky Notes**
With artifacts now mature and the protocol robust, the "Sticky Note Protocol" (appending a status block to every turn) was deemed redundant noise.
- **Why:** The artifacts (`WORK.md`, `INBOX.md`) are the source of truth.
- **Change:** Removed `gsd-status` requirements from all 9 workflow templates.
- **Result:** Cleaner chat interface, fewer tokens used per turn.

**Cherry on Top: The "Pilot's Checklist" Analogy**

To explain why Universal Onboarding matters:

Imagine a pilot (Agent) taking over a plane mid-flight (The Project) from another pilot (Previous Session).

*   **Old Way (Workflow-Dependent):**
    *   Pilot jumps in.
    *   If they check `progress.md`: They read the flight plan and weather.
    *   If they just grab the yoke (`discuss.md`): They start flying **without knowing the destination or the aircraft type**. They fly purely on instruments. It's safe, but they can't make strategic decisions.

*   **New Way (Universal Onboarding):**
    *   **Mandatory Pre-Flight:** Before touching the controls, EVERY pilot reads:
        1.  **PROJECT.md (Destination):** "We are going to Hawaii."
        2.  **ARCHITECTURE.md (Aircraft Manual):** "This is a Boeing 747, not a Cessna."
        3.  **WORK.md (Instruments):** "We are currently at 30,000ft, autopilot on."
    *   Now, when the user says "Let's dive," the pilot knows "Wait, a 747 can't dive like a Cessna," instead of just executing the dive.

**Code Snippet: The New Protocol Boot Sequence**

`src/gsd_lite/template/PROTOCOL.md`:

```markdown
## Session Start (Universal Onboarding)

**Every fresh session follows this boot sequence — regardless of which workflow will run.**

1. **Read PROTOCOL.md**
2. **Read PROJECT.md** (if exists) — Understand the project vision and "why"
3. **Read ARCHITECTURE.md** (if exists) — Understand the codebase structure
4. **Read WORK.md Current Understanding** — Understand current state
5. **Load appropriate workflow**
```

**Status:** `src/gsd_lite/template/` updated. Sticky notes removed. Protocol v2.2 active.

### [LOG-011] - [DECISION] - The Frictionless Install Paradox: Global vs Local Distribution - Task: DIST-001
**Timestamp:** 2026-02-04 14:00
**Context:**
The user requested a "frictionless" distribution model for `gsd-lite`, similar to `npx get-shit-done-cc`. The goal is to allow users to run `@gsd-lite` in any directory without manually scaffolding a `gsd-lite/` folder first. However, the `AGENTS.md` template (the brain) was hardcoded to look for workflows in a local project directory (`gsd-lite/template/workflows/`).

**The Paradox:**
- **Local Mode (Eject):** Project is self-contained. Agent reads `./gsd-lite/template/workflows/`. Good for customization, bad for friction (requires init).
- **Global Mode (Binary):** Zero setup. Agent reads `~/.config/opencode/command/gsd-lite/`. Good for friction, but breaks the static template.

**The Decision: Dynamic Patching at Install Time**
We chose the **Global Binary** model for the default experience. To solve the pathing issue, the installer CLI will dynamically patch the agent's instructions during installation.

- **Source:** `src/gsd_lite/template/AGENTS.md` (contains relative path placeholder).
- **Destination:** `~/.config/opencode/agents/gsd-lite.md` (contains absolute path).

**Rationale:**
This preserves the "Project Specific Protocol" philosophy (Option A) if a user *wants* to eject (they can manually copy files), but enables the "Frictionless" experience (Option B) by default. The agent is smart enough to follow the path it is given.

**Cherry on Top: The "Suitcase vs Hotel" Analogy**

To explain the difference:

- **Local Mode (Eject):** Like moving into an apartment. You buy furniture (workflows) and put it in your living room (`./gsd-lite`). It's yours, you can paint it, but moving in takes effort.
- **Global Mode (Frictionless):** Like staying at a hotel. The furniture (workflows) is provided by the hotel (`~/.config`). You just show up with your suitcase (Code) and start working.

We want `gsd-lite` to feel like a 5-star hotel: Instant check-in, everything provided.

**Code Snippet: The Dynamic Patch**

The installer will perform this transformation:

*Before (Template):*
```markdown
5. **Load appropriate workflow** — Based on current_mode in WORK.md
   (Reads from gsd-lite/template/workflows/)
```

*After (Installed Agent):*
```markdown
5. **Load appropriate workflow** — Based on current_mode in WORK.md
   (Reads from /Users/username/.config/opencode/command/gsd-lite/)
```

**Next Action:** Implement `gsd-lite install --opencode` command in `src/gsd_lite/__main__.py` that copies workflows and applies this patch.

### [LOG-012] - [DISCOVERY] - Reverse-Engineering get-shit-done-cc: The Anatomy of a Frictionless Installer - Task: DIST-002

**Timestamp:** 2026-02-04 15:30

**The Story So Far**

The user's current workflow to update gsd-lite after each iteration is painfully manual:

```bash
# Step 1: Navigate to opencode config directory
cd ~/.config/opencode

# Step 2: Run CLI to scaffold template files (creates gsd-lite/ subdirectory)
uvx --no-cache gsd-lite --update

# Step 3: Manually copy the agent definition
cp gsd-lite/template/AGENTS.md ./agents/gsd-lite.md

# Step 4: Manually copy all workflow files
cp -r gsd-lite/template/workflows/* ./command/gsd-lite/
```

This is the "IKEA furniture" experience: you get the parts, but assembly is on you. We want the "hotel concierge" experience: everything set up before you arrive.

**The Reference Implementation: get-shit-done-cc**

We cloned the upstream GSD installer (`get-shit-done-cc`) to `tmp/get-shit-done/` and reverse-engineered its installation logic. The key file is `bin/install.js` — a ~1500-line Node.js script that handles multi-runtime installation.

**Critical Discovery #1: Directory Structure Varies by Runtime**

Each runtime (Claude Code, OpenCode, Gemini) uses slightly different conventions:

| Runtime | Config Directory | Agent Location | Command Location |
|---------|------------------|----------------|------------------|
| **OpenCode** | `~/.config/opencode/` | `agents/gsd-lite.md` | `command/gsd-lite/` (singular) |
| **Claude Code** | `~/.claude/` | `agents/gsd-lite.md` | `commands/gsd-lite/` (plural!) |
| **Gemini** | `~/.gemini/` | `agents/gsd-lite.md` | `commands/gsd-lite/` (plural) |

**Why this matters:** A naive installer that assumes `command/` everywhere will fail silently on Claude Code — the workflows land in the wrong directory and the agent can't find them.

**Evidence from get-shit-done-cc source** (`bin/install.js`, line ~1385):
```javascript
console.log(`  ${yellow}Which runtime(s) would you like to install for?${reset}\n\n  
  ${cyan}1${reset}) Claude Code ${dim}(~/.claude)${reset}
  ${cyan}2${reset}) OpenCode    ${dim}(~/.config/opencode)${reset} - open source, free models
  ${cyan}3${reset}) Gemini      ${dim}(~/.gemini)${reset}
  ${cyan}4${reset}) All
```

**Critical Discovery #2: OpenCode's Current Installation Structure**

We inspected the user's live OpenCode config at `~/.config/opencode/` using the opencode-fs MCP tool:

```
~/.config/opencode/
├── agents/
│   └── gsd-lite.md          # ← The agent brain (AGENTS.md renamed)
├── command/
│   └── gsd-lite/            # ← Workflow files live here
│       ├── checkpoint.md
│       ├── discuss.md
│       ├── execution.md
│       ├── housekeeping.md
│       ├── map-codebase.md
│       ├── new-project.md
│       └── progress.md
├── gsd-lite/                 # ← Scaffolded by current CLI (redundant for global install)
│   └── template/
│       └── ...
├── hooks/
├── opencode.json
└── settings.json
```

**Key insight:** The `gsd-lite/` subdirectory inside `~/.config/opencode/` is an artifact of the current `--update` command, which scaffolds a full project structure. For global installation, we don't need this — we only need to populate `agents/` and `command/gsd-lite/`.

**Critical Discovery #3: AGENTS.md is Pre-Built (No Dynamic Assembly)**

The user clarified that `AGENTS.md` in the source tree (`src/gsd_lite/template/AGENTS.md`) is already the final artifact — it's `PROTOCOL.md` with a 22-line YAML frontmatter prepended. There's no build step needed; we simply copy it.

**The frontmatter** (first 16 lines of `src/gsd_lite/template/AGENTS.md`):
```yaml
---  
description: Lightweight agent with minimal tool access  
tools:  
  read: false
  edit: false
  bash: false
  grep: false
  glob: false
  list: false

permission:  
  task:  
    "*": "deny"
---  
```

This frontmatter is OpenCode-specific but works across all platforms (Claude and Gemini also support frontmatter).

---

#### The Scoped Plan: MVP Installer (OpenCode Global Only)

**Scope for v1:**
- ✅ OpenCode runtime only
- ✅ Global install to `~/.config/opencode/` only
- ❌ Claude Code (future)
- ❌ Gemini (future)
- ❌ Local install (future)
- ❌ Version checking / updates (future)

**What the installer does:**

```
uvx gsd-lite install

# Output:
#   Installing gsd-lite to ~/.config/opencode/ ...
#   ✓ Copied agents/gsd-lite.md
#   ✓ Copied command/gsd-lite/ (7 workflows)
#   Done! Run @gsd-lite in any project to start.
```

**File Operations:**

| Source (in package) | Destination (on disk) |
|---------------------|----------------------|
| `src/gsd_lite/template/AGENTS.md` | `~/.config/opencode/agents/gsd-lite.md` |
| `src/gsd_lite/template/workflows/*.md` | `~/.config/opencode/command/gsd-lite/*.md` |

**Implementation Sketch:**

```python
# src/gsd_lite/__main__.py (new install command)

import shutil
from pathlib import Path
from importlib.resources import files

def install():
    """Install gsd-lite globally to ~/.config/opencode/"""
    
    # 1. Resolve paths
    opencode_config = Path.home() / ".config" / "opencode"
    agents_dir = opencode_config / "agents"
    command_dir = opencode_config / "command" / "gsd-lite"
    
    # 2. Get package template location
    template_dir = files("gsd_lite") / "template"
    
    # 3. Ensure target directories exist
    agents_dir.mkdir(parents=True, exist_ok=True)
    command_dir.mkdir(parents=True, exist_ok=True)
    
    # 4. Copy agent definition
    shutil.copy(template_dir / "AGENTS.md", agents_dir / "gsd-lite.md")
    print("✓ Copied agents/gsd-lite.md")
    
    # 5. Copy all workflow files
    workflows_src = template_dir / "workflows"
    for workflow in workflows_src.iterdir():
        if workflow.suffix == ".md":
            shutil.copy(workflow, command_dir / workflow.name)
    print(f"✓ Copied command/gsd-lite/ ({len(list(command_dir.glob('*.md')))} workflows)")
    
    print("\nDone! Run @gsd-lite in any project to start.")
```

**Open Question (Deferred): Dynamic Path Patching**

LOG-011 mentioned patching `AGENTS.md` to replace relative workflow paths with absolute paths. After discussion, we realized:

1. The current `AGENTS.md` doesn't hardcode a workflow path — it says "Load appropriate workflow" generically.
2. OpenCode resolves `command/gsd-lite/` relative to its config directory automatically.
3. **No patching needed for global install** — the runtime handles path resolution.

If we later implement *local* install (`./.opencode/`), we may need patching. Deferred for now.

---

**Cherry on Top: The "Concierge vs IKEA" Mental Model**

| Experience | What You Do | What Happens |
|------------|-------------|--------------|
| **IKEA (Current)** | `uvx gsd-lite --update` then manually copy files | You get boxes of parts, assembly required |
| **Concierge (Goal)** | `uvx gsd-lite install` | Everything placed in the right rooms automatically |

The MVP delivers the concierge experience for OpenCode users. Multi-runtime support is the "international hotel chain expansion" — same service, different locations.

---

**Next Action:** 
1. Switch to execution mode
2. Implement `install` command in `src/gsd_lite/__main__.py`
3. Test with `uvx --no-cache gsd-lite install`
4. Verify files land in correct locations
---

### [LOG-013] - [DECISION] - Unified Installation Model: Same Output, Different Location - Task: DIST-002

**Timestamp:** 2026-02-04 16:45

**The Problem We Were Creating**

Initial thinking led to a fragmented command structure:
- `install` for global brain only
- `--local` for project artifacts only  
- `--update` for refreshing templates
- `--force` for overwriting

This created cognitive overhead: "Which command do I need?" and different outputs for different commands.

**The Insight**

User asked: "Are we just complicating ourselves? What if we unified everything like get-shit-done-cc does?"

The answer: **Yes, we were overcomplicating.**

**The Unified Model**

```
uvx gsd-lite install           # → ~/.config/opencode/ + gsd-lite/
uvx gsd-lite install --local   # → ./.opencode/ + ./gsd-lite/
```

**Both commands create identical structure, just at different roots:**

```
{target}/
├── .opencode/                    # OpenCode config (or ~/.config/opencode/ for global)
│   ├── agents/
│   │   └── gsd-lite.md           # Agent definition (AGENTS.md)
│   └── command/
│       └── gsd-lite/             # Workflows
│           ├── discuss.md
│           ├── execution.md
│           ├── checkpoint.md
│           └── ...
│
└── gsd-lite/                     # Artifacts directory
    ├── WORK.md                   # ← SKIP if exists (preserve user data)
    ├── INBOX.md                  # ← SKIP if exists
    ├── PROJECT.md                # ← SKIP if exists
    ├── ARCHITECTURE.md           # ← SKIP if exists
    ├── HISTORY.md                # ← SKIP if exists
    └── template/                 # ← ALWAYS overwrite (that's how updates work)
        ├── PROTOCOL.md
        ├── workflows/
        ├── references/
        └── VERSION
```

**The Smart Check Pattern (already exists in current code):**
- User artifacts → Skip if exist, scaffold if new
- Template/config files → Always overwrite (enables updates)

**Why This is Better**

| Aspect | Before (Complicated) | After (Unified) |
|--------|---------------------|-----------------|
| Commands | `install`, `--update`, `--local`, `--force` | `install`, `install --local` |
| Mental model | Different outputs per command | Same output, different root |
| Update flow | Separate `--update` flag | Just run `install` again |

**The "Global Brain + Local Memory" Mental Model**

```
GLOBAL INSTALL (~/.config/opencode/)
├── Brain: agents/ + command/gsd-lite/    ← Available to all projects
└── Reference: gsd-lite/template/          ← For manual reference

LOCAL INSTALL (./)
├── Brain: .opencode/agents/ + command/   ← Project-specific override
└── Memory: gsd-lite/                      ← Active session artifacts
```

**Typical User Journey:**
1. `uvx gsd-lite install` — One-time global setup
2. Enter project, `uvx gsd-lite install --local` — Scaffold project artifacts
3. Start OpenCode, `@gsd-lite` — Global brain reads/writes local memory
4. Later: `uvx gsd-lite install` again — Updates global brain to latest version

---

### [LOG-014] - [MILESTONE] - Implemented Unified Installer Logic - Task: DIST-002

**Timestamp:** 2026-02-04 17:15

**Observation**
The previous CLI was a simple scaffolder that dumped everything into `./gsd-lite`. To support the "Concierge" experience, we needed logic that could target both the Global OpenCode config (`~/.config/opencode`) and a Local Project (`./`).

**Resolution**
Refactored `src/gsd_lite/__main__.py` to use `typer` subcommands.
- **Global Install (`gsd-lite install`)**:
  - Targets `~/.config/opencode/`
  - Installs Agent → `agents/gsd-lite.md`
  - Installs Workflows → `command/gsd-lite/`
  - Installs Reference Templates → `gsd-lite/template/`
- **Local Install (`gsd-lite install --local`)**:
  - Targets `./`
  - Creates `.opencode/agents/` and `.opencode/command/` (Brain)
  - Scaffolds `gsd-lite/WORK.md` etc. (Memory)

**Smart Overwrite Logic**
- **Templates/Workflows**: ALWAYS overwritten (ensures updates apply)
- **User Artifacts (`WORK.md`, `PROJECT.md`)**: SKIPPED if exist (preserves user data)
- **Force Flag (`--force`)**: Overwrites EVERYTHING (nuclear option)

**Key Code Snippet**
```python
if local:
    base_root = Path.cwd()
    config_root = base_root / ".opencode"
else:
    base_root = Path.home() / ".config" / "opencode"
    config_root = base_root

# Unified Structure
agents_dir = config_root / "agents"
command_dir = config_root / "command" / "gsd-lite"
artifacts_dir = base_root / "gsd-lite"
```

**Next Steps**
- Verify installation on live system
- Update documentation to reflect new `install` command usage

---

### [LOG-015] - [TOOLING] - Context Map: Solving the "Token Blindness" Problem in Large Artifacts - Task: TOOLING-001

**Executive Summary:**
We developed `analyze_context.py`, a utility that solves the "token blindness" problem when agents interact with massive Markdown artifacts (like `WORK.md`). Instead of reading the full 65k token file (which overflows context) or blindly grepping headers (which loses hierarchy), this tool generates a **Context Map**: a lightweight (~1k token) mirror of the document that preserves IDE navigability, visualizes section weights, and provides "HEAD/TAIL" previews for surgical reading.

---

#### 1. The Problem: "Token Blindness" in Large Artifacts

When an agent needs to understand the project state from a massive log file (e.g., `WORK.md` at 65,000+ tokens), it faces a trilemma:

1.  **Read Full File:** Costs $0.50+ per turn, overflows context window, drowns reasoning in noise.
2.  **Blind Grep:** `grep "^#"` reveals headers but hides the *content weight*. Is "Section 3" a 2-line note or a 5,000-token specification? The agent doesn't know until it commits to reading.
3.  **Table Summary:** A standard table of contents breaks the visual hierarchy (indentation) and IDE collapsing, making it hard to "scan" the tree structure.

We needed a way to **see the shape and weight of the forest before cutting down trees.**

---

#### 2. The Research: Leveraging Source Maps

We investigated how the industry handles this. A search for "LLM context window management document chunking" revealed two key patterns:

*   **LangChain's `MarkdownHeaderTextSplitter`**: Parses Markdown by headers (`#`, `##`) to preserve structural integrity when chunking for RAG.
*   **"Offloading Large Tool Results"**: A pattern where agents see a *reference* and a *preview* of large data, rather than the raw data itself.

**Source:**
> "MarkdownHeaderSplitter specifically designed for Markdown documents... divides content based on headers... preserving structural integrity." — *LangChain Documentation* [1]

We realized we could use `markdown-it-py` (a CommonMark-compliant parser) to access the **Source Map** (`token.map`) of each header, giving us precise line numbers and the ability to extract just the start (HEAD) and end (TAIL) of each section.

---

#### 3. The Solution: `analyze_context.py`

We built a script that transforms a massive Markdown file into a "Context Map".

**Key Features:**
1.  **Mirrored Hierarchy:** Uses real Markdown headers (`#`, `##`) in the output, so the map is **collapsible in your IDE** just like the original file.
2.  **Weight visualization:** Calculates token counts (using `tiktoken`) for every section, allowing the agent to budget its context usage.
3.  **Surgical Previews:** Extracts the first 3 lines (HEAD) and last 2 lines (TAIL) of every section. The agent can read the preview and decide *if* it needs the full content.

**Code Snippet: The Preview Logic**
```python
def extract_preview(lines, head_count=3, tail_count=2):
    """
    Extract HEAD and TAIL preview from a list of lines.
    Returns (head_text, tail_text) as strings.
    """
    # Filter out empty lines for meaningful preview
    content_lines = [l.rstrip() for l in lines if l.strip()]
    
    if not content_lines:
        return ("(empty section)", "")
    
    # HEAD: first N content lines (skip the header line itself)
    head_lines = content_lines[1:head_count+1] if len(content_lines) > 1 else content_lines[:head_count]
    head_text = "\n".join(head_lines) if head_lines else "(no content after header)"
    
    # TAIL: last N content lines (avoid overlap with head)
    if len(content_lines) > head_count + tail_count + 1:
        tail_lines = content_lines[-tail_count:]
        tail_text = "\n".join(tail_lines)
    else:
        tail_text = ""  # Section too short, HEAD covers it
    
    return (head_text, tail_text)
```

---

#### 4. The Data Flow Diagram

```mermaid
graph TD
    A[Input: WORK.md] -->|Read File| B(Raw Text)
    B -->|markdown-it-py| C{Token Stream}
    C -->|Identify Headers| D[Header Metadata]
    D -->|Get Line Ranges| E[Section Slicing]
    
    subgraph Analysis
    E -->|tiktoken| F[Token Count]
    E -->|Heuristics| G[Extract HEAD/TAIL]
    end
    
    F --> H[Context Map Generator]
    G --> H
    H -->|Format with # Headers| I[Output: context_map.md]
    
    style A fill:#f9f,stroke:#333
    style I fill:#9f9,stroke:#333
```

---

#### 5. Example Output (Synthesized)

**Input:** A 65,000 token `WORK.md`.
**Output:** A ~1,500 token `context_map.md` that looks like this:

```markdown
# Context Map: eval/gsd-lite/WORK.md
**Total:** 254,551 chars | **~64,864 tokens**

## 🎯 Top Heavy Sections
| Rank | Section | Tokens |
|------|---------|--------|
| 1 | `## 2.2 Layer 2: Semantic Layer` | 2,663 |

---

# Document Structure

## 1. Current Understanding (Read First)
> 📊 **900 tokens** | Lines 26-85

**HEAD:**
```
current_mode: execution
active_task: TASK-042 - Implement cascading filters...
```

**TAIL:**
```
...next_action: Complete filter persistence in localStorage.
```
```

This map allows an agent to say: *"I see Section 1 is 900 tokens and relevant. I will read lines 26-85. I see Section 2.2 is 2,600 tokens and irrelevant. I will skip it."*

---

#### 6. Citations & Sources

1.  **LangChain Documentation**, "MarkdownHeaderTextSplitter". https://python.langchain.com/docs/modules/data_connection/document_transformers/markdown_header_metadata
2.  **markdown-it-py**, "Token Stream and Source Maps". https://markdown-it-py.readthedocs.io/en/latest/tokens.html
3.  **Tiktoken**, "OpenAI Tokenizer". https://github.com/openai/tiktoken

---

### [LOG-016] - [DECISION] - Stateless-First Architecture: Every Turn Generates a Handoff Packet - Task: PROTOCOL-STATELESS

**Timestamp:** 2026-02-06
**Decision ID:** DECISION-016
**Status:** APPROVED

---

#### Executive Summary

GSD-Lite adopts **stateless-first architecture** as a core philosophy. Every agent turn ends with a structured handoff packet that enables any future agent to continue with zero chat history. This embraces the user's micro-forking workflow as a first-class pattern, not a workaround.

**The One-Liner:** Treat every agent turn as its end-of-life. Generate a handoff so any future agent can pick up exactly where you left off.

---

#### Part 1: The Problem — Context Rot and Manual Curation

##### 1.1 The Production Evidence

This decision emerged from real production usage documented in `eval/gsd-lite/WORK.md`:
- **Size:** 254,551 characters | ~64,864 tokens | 5,552 lines
- **Logs:** 56 LOG entries (LOG-001 through LOG-056)
- **Analysis:** See `eval/gsd-lite/WORK_context_analysis.md` for token breakdown by section

**Citation:** File metadata from `mcp_tools_fs_get_file_info("eval/gsd-lite/WORK.md")`:
```
Total Lines: 5,552
Total Characters: 254,551
Estimated Tokens: 63,637
```

##### 1.2 The Micro-Forking Workflow Discovered

The user discovered a powerful context management pattern through production use:

```mermaid
flowchart LR
    subgraph SESSION1["SESSION 1 (tokens: 0 → 60k)"]
        A[Start] --> B[Discuss 2-3 turns]
        B --> C[Agent writes LOG-XXX]
        C --> D[Context rising...]
        D --> E[Hit 60-80k threshold]
    end
    
    E --> F["🔀 FORK back to turn 1-2"]
    
    subgraph SESSION2["SESSION 2 (tokens: 0 → fresh)"]
        F --> G["Paste: 'Read LOG-XXX'"]
        G --> H[Agent onboards from log]
        H --> I[Continue with optimal context]
        I --> J[Context rising...]
    end
    
    J --> K["🔀 FORK again"]
    K --> G
```

**Why this works:** 
- LLMs perform optimally in the 20k-80k token range (user's empirical observation with Claude Opus 4.5 and Gemini Pro 3)
- Logs written by a strong reasoning model are *better context* than raw conversation — synthesized, polished, agent-optimized
- The micro-fork is a context *upgrade*, not a workaround

##### 1.3 The Friction Point

**The problem at scale:** At LOG-001, "go read LOG-001" is sufficient. At LOG-100, the fresh agent needs a *curated path* through the decision graph — not just "read the last one."

**Prior attempt (LOG-045 in eval/gsd-lite/WORK.md, lines 4325-4398):**
A META log entry with "Agent Onboarding Paths" organized by task type:
- Path A: Building a new page (~4k tokens)
- Path B: Understanding data architecture (~6k tokens)
- Path C: Resuming mid-task (~2k tokens)
- Path D: Adding filters (~3k tokens)
- Path E: Full context deep dive (~15k tokens)

**Citation:** `eval/gsd-lite/WORK.md` lines 4325-4398 (LOG-045)

**Why LOG-045 is insufficient:**
1. **Static snapshot** — Valid when written, stale as logs accumulate
2. **Separate artifact** — Another thing to remember and maintain
3. **Manual trigger** — User must remember to ask agent to read it

---

#### Part 2: The Solution — Stateless-First Handoff Packets

##### 2.1 Core Philosophy

**Principle:** Every agent turn is potentially its last. The agent must generate a handoff packet that enables any future agent to continue with zero chat history.

**No exceptions:** Even Turn 1. Even mid-discussion. The user owns context management via micro-forking.

**Analogy — The Stateless Server:**
Think of each agent turn like an HTTP request to a stateless server:
- Server doesn't remember previous requests
- Each request contains everything needed to process it
- Response contains everything needed for the next request

The handoff packet is like a JWT token — self-contained context that travels with the user across session boundaries.

##### 2.2 Two-Layer Structure

The handoff packet contains two layers of context:

| Layer | Mental Model | Source | Who Maintains |
|-------|--------------|--------|---------------|
| **Layer 1 — Local Context** | This task's dependency chain | Agent traces backwards dynamically | Agent (computed each turn) |
| **Layer 2 — Global Context** | Project foundation decisions | Key Events Index in WORK.md | Human curates, agent reads |

**Why two layers:**
- **Layer 1** answers: "How do I continue this specific task?"
- **Layer 2** answers: "How do I pivot to something completely different?"

```mermaid
flowchart TB
    subgraph HANDOFF["📦 Stateless Handoff Packet"]
        L1["Layer 1: Local Context<br/>───────────────<br/>Last action: LOG-056<br/>Chain: LOG-056 ← LOG-055 ← LOG-052<br/>Next: Implement on /explore"]
        L2["Layer 2: Global Context<br/>───────────────<br/>Architecture: LOG-031, LOG-024<br/>Patterns: LOG-044, LOG-055<br/>Data Flow: LOG-038"]
        PATHS["Fork Paths<br/>───────────────<br/>• Continue → L1 only<br/>• Pivot → L2 + new topic"]
    end
    
    L1 --> PATHS
    L2 --> PATHS
```

##### 2.3 Layer 1 — Dependency Chain Tracing

The agent traces backwards from the current task to surface the decision lineage.

**Example from eval/gsd-lite/WORK.md:**
```
Current task: Implement cascading filters on /explore (TASK-006)
                    ↓ depends on
LOG-056: Implemented cascading filters (last execution)
                    ↓ depends on
LOG-055: DECISION-020 — Cascading via run_inline_query (the pattern)
                    ↓ depends on
LOG-052: DECISION-018 — Dual filter sections with mutex (the architecture)
                    ↓ depends on
LOG-048: DECISION-016 — Dashboard-defined filters (the foundation)
```

**In handoff format:**
```
→ Dependency chain: LOG-056 ← LOG-055 ← LOG-052 ← LOG-048
```

##### 2.4 Layer 2 — Key Events Index as Source of Truth

The existing `## 2. Key Events Index` section in WORK.md becomes the **canonical source** for global context.

**Reframe from:** "Query Accelerator" (nice-to-have optimization)
**Reframe to:** "Project Foundation" (required for handoff packets)

**New structure:**
```markdown
## 2. Key Events Index (Project Foundation)

<!-- 
CANONICAL source of truth for Layer 2 of stateless handoff packets.
Agents MUST pull global context from here.
Human-curated: agent proposes additions, human approves.
-->

### Architecture Decisions
- LOG-031: Two Galaxies — Single project, dual Looker models
- LOG-024: Mirror Clone — Full data ownership via dataset cloning

### Pattern Decisions
- LOG-044: Dashboard Config — Looker dashboards as first-class artifacts
- LOG-055: Cascading Filters — Dynamic options via run_inline_query

### Data Flow Decisions
- LOG-038: Source Divergence — App queries looker-partners, not bigquery-public-data
```

---

#### Part 3: The Canonical Handoff Format

##### 3.1 Full Format (Option C — Chosen)

After evaluating three format options (Minimal 3-4 lines, Structured 6-7 lines, Full 10-12 lines), the user chose **Full Format** because:
- Sessions are only 5-8 turns before forking anyway
- 10-12 lines × 8 turns = ~80-100 lines total — manageable
- Full context every turn means no guessing what's missing

**The canonical format:**

```
---
📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: [LOG-XXX (brief description)]
→ Dependency chain: [LOG-XXX ← LOG-YYY ← LOG-ZZZ]
→ Next action: [specific next step]

**Layer 2 — Global Context:**
→ Architecture: [from Key Events Index]
→ Patterns: [from Key Events Index]
→ Data Flow: [from Key Events Index]

**Fork paths:**
- Continue execution → [specific logs]
- Discuss [topic] → [specific logs]
- Pivot to new topic → [L2 refs] + state your question
```

##### 3.2 Turn-Type Variations

The structure stays rigid. The content adapts based on turn type:

**Mid-Discussion (no decision yet):**
```
---
📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Status: Discussing [topic] — no decision yet
→ Key refs from discussion: [LOG-XXX, LOG-YYY]
→ Resume: Restate your position on [open question]

**Layer 2 — Global Context:**
→ Architecture: [from Key Events Index]
→ Patterns: [from Key Events Index]

**Fork paths:**
- Continue discussion → restate your question
- Pivot to new topic → L2 + state your question
```

**Post-Decision (DECISION logged):**
```
---
📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-XXX (DECISION-NNN: [title])
→ Dependency chain: LOG-XXX ← LOG-YYY ← LOG-ZZZ
→ Next action: [implementation step]

**Layer 2 — Global Context:**
→ Architecture: [from Key Events Index]
→ Patterns: [from Key Events Index]

**Fork paths:**
- Continue execution → L1 only (~3 logs)
- Discuss implementation → L1 + [relevant pattern log]
- Pivot to new topic → L2 + state your question
```

**Teaching Detour:**
```
---
📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Status: Teaching detour on [concept]
→ Task paused at: LOG-XXX ([last exec])
→ Resume: [LOG refs] → [next action]

**Layer 2 — Global Context:**
→ [Relevant sections from Key Events Index]

**Fork paths:**
- Resume execution → LOG-XXX + LOG-YYY
- Continue learning → [concept-specific logs]
- Pivot to new topic → L2 + state your question
```

**First Turn (just forked in):**
```
---
📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Onboarded via: [LOG-XXX (how you got here)]
→ Current action: [what you're doing this turn]
→ Will log as: LOG-YYY (on completion)

**Layer 2 — Global Context:**
→ [Full Key Events Index — user just forked, may pivot]

**Fork paths:**
- Continue after this turn → await LOG-YYY completion
- Pivot mid-task → L2 + state new direction
```

##### 3.3 The Rigid Rules

These aspects are **locked down** for consistency across providers (Claude Opus, Gemini Pro 3):

| Rule | Specification |
|------|---------------|
| **Delimiter** | Always `---` followed by `📦 STATELESS HANDOFF` |
| **Layer 1** | Always present. Describes local/task context. |
| **Layer 2** | Always present. Pulled from Key Events Index. |
| **Fork paths** | Minimum 2 (continue + pivot). Maximum 4. |
| **Log references** | Always `LOG-XXX (brief description)` format. |
| **No prose** | Arrows `→` and bullets `-` only. No paragraphs. |
| **Dependency chain** | Uses `←` to show lineage (newest ← oldest). |

---

#### Part 4: Key Events Index Maintenance

##### 4.1 When to Update

The Key Events Index should be updated when:
- User explicitly asks: "update the key events index"
- Agent notices a DECISION log with project-wide impact
- At checkpoint time (optional housekeeping step)

##### 4.2 How to Scan

```bash
# Find all DECISION logs
grep "^\(###\|####\) \[LOG-.*\[DECISION" WORK.md

# Find superseded entries
grep -i "supersede" WORK.md

# Cross-reference against current Key Events Index
# (Agent reads Section 2 and compares)
```

##### 4.3 Inclusion/Exclusion Criteria

**Include if:**
| Criterion | Example |
|-----------|---------|
| Decision affects multiple tasks/phases | "Two Galaxies" architecture spans all LookML work |
| Decision establishes a reusable pattern | "Dashboard config pattern" used by all pages |
| Decision changes data flow or ownership | "Mirror Clone" changed where data lives |
| Decision is frequently referenced | Check for `see LOG-XXX` mentions in other logs |

**Exclude if:**
| Criterion | Example |
|-----------|---------|
| Decision is task-specific implementation detail | "Used flex instead of grid for this component" |
| Decision was superseded and context captured in successor | LOG-018 fully superseded by LOG-024 |
| Decision is about process, not product | "Decided to pair program on this task" |

##### 4.4 Update Proposal Format

Agent proposes, user approves:

```
📋 KEY EVENTS INDEX UPDATE PROPOSAL

**Add:**
- LOG-055: Cascading filters via run_inline_query → Category: Patterns
  Reason: Establishes reusable pattern for all filter implementations

**Remove:**
- LOG-018: Pivot to Public Data (superseded by LOG-024)
  Reason: LOG-024 captures the final decision with full context

**Recategorize:**
- LOG-038: Move from "Data Flow" to "Architecture"
  Reason: It's more about system boundaries than data movement

---
Approve these changes? (Yes / Adjust / Skip)
```

---

#### Part 5: Anti-Patterns (Bad Handoff Examples)

##### 5.1 Too Vague
```
📦 HANDOFF: We discussed filters. Read the recent logs.
```
**Problems:**
- "Recent logs" — which ones? Last 3? Last 10?
- No specific LOG-XXX references
- No actionable next step
- Fresh agent has to guess

##### 5.2 Wall of Text
```
📦 HANDOFF: We implemented cascading filters using the run_inline_query 
pattern as discussed in LOG-055 which was based on the decision we made 
in LOG-052 about dual filter sections which itself built on LOG-048 about 
dashboard-defined filters and the data architecture from LOG-031 and 
LOG-024 which superseded LOG-018 and LOG-020...
```
**Problems:**
- No structure — can't scan quickly
- Buries actionable items in prose
- User has to parse a paragraph to find what matters

##### 5.3 Missing Layer 2
```
📦 HANDOFF
→ Last: LOG-056
→ Next: Apply pattern
```
**Problems:**
- Fine for task continuation
- Useless if user wants to pivot to new topic
- Fresh agent on different task would be lost

##### 5.4 Stale References
```
📦 HANDOFF
→ Data strategy: Read LOG-018
→ Architecture: Read LOG-020
```
**Problems:**
- LOG-018 was superseded by LOG-024
- LOG-020 was superseded by LOG-024
- Would actively mislead a fresh agent

##### 5.5 "Read Everything"
```
📦 HANDOFF
→ Full context: LOG-001 through LOG-056
```
**Problems:**
- Defeats the purpose of curation
- 64k tokens of context is exactly what we're trying to avoid
- Not a handoff, it's an abdication

##### 5.6 Inconsistent Format Across Turns

Turn 5:
```
HANDOFF: LOG-005, then LOG-003
```

Turn 12:
```
📦 Stateless Packet
- Layer 1: LOG-012
- Layer 2: See Key Events
```

Turn 23:
```
## Handoff Notes
Last action was implementing the thing from LOG-023...
```

**Problems:**
- User can't build muscle memory
- Different delimiters/headers each time
- Hard to scan across sessions
- Which format is "right"?

---

#### Part 6: Implementation Plan

##### Task: PROTOCOL-STATELESS-001 — Add Stateless-First Section to PROTOCOL.md

**Location:** New section after "Context Lifecycle" in `gsd-lite/template/PROTOCOL.md`

**Content to add:**
1. Philosophy statement (every turn is potentially last)
2. Two-layer structure explanation
3. Canonical handoff format
4. Turn-type variations
5. Rigid rules table
6. Reference to Key Events Index as Layer 2 source

**Why PROTOCOL.md:** It's the agent entrypoint — loaded on every session start during Universal Onboarding.

##### Task: PROTOCOL-STATELESS-002 — Update Key Events Index Header

**Location:** `## 2. Key Events Index` section in WORK.md template

**Changes:**
1. Rename to `## 2. Key Events Index (Project Foundation)`
2. Update HTML comment to explain new purpose
3. Add category structure (Architecture, Patterns, Data Flow)
4. Note that this is the canonical source for Layer 2

##### Task: PROTOCOL-STATELESS-003 — Agent Behavior Integration

**No separate workflow file needed.** The stateless handoff is embedded in PROTOCOL.md as a meta-behavior that applies to all workflows (discuss, execution, checkpoint, etc.).

**Agent instruction (to be added to PROTOCOL.md):**
> After every response, append a stateless handoff packet. This is not optional. The user may fork at any moment — your response must be self-sufficient for any future agent to continue.

---

#### Part 7: Why This Approach Wins

| Before (Manual Curation) | After (Stateless-First) |
|--------------------------|-------------------------|
| User manually curates "go read LOG-010..." | Agent generates curated paths every turn |
| Static META logs (LOG-045) go stale | Fresh handoff every turn, never stale |
| Context rot from long sessions | Micro-forking is first-class, embraced |
| Re-onboarding friction | Copy-paste fork path, immediate context |
| Checkpoint writes cost API calls | Handoff inline with response, zero extra cost |
| Different agents = different formats | Rigid structure works across Claude, Gemini |

---

#### Part 8: Cross-References and Citations

| Reference | Location | Purpose |
|-----------|----------|---------|
| Production WORK.md | `eval/gsd-lite/WORK.md` | Evidence of 64k token log growth |
| Context analysis | `eval/gsd-lite/WORK_context_analysis.md` | Token breakdown by section |
| Prior META attempt | `eval/gsd-lite/WORK.md` lines 4325-4398 (LOG-045) | Agent Onboarding Paths |
| GSD-Lite PROJECT.md | `gsd-lite/PROJECT.md` | Core philosophy and logging standard |
| Current PROTOCOL.md | `gsd-lite/template/PROTOCOL.md` | Target for implementation |

---

#### Part 9: Decision Record

| Attribute | Value |
|-----------|-------|
| **Decision ID** | DECISION-016 |
| **Title** | Stateless-First Architecture: Every Turn Generates a Handoff Packet |
| **Status** | APPROVED |
| **Supersedes** | None (new capability) |
| **Rationale** | Embrace micro-forking as core philosophy. User owns context management. Every turn generates handoff. No exceptions. |
| **Trade-offs** | 10-12 lines per turn overhead, but sessions are only 5-8 turns before forking anyway. |
| **Format chosen** | Option C (Full) — 10-12 lines, two layers, explicit fork paths |
| **Implementation location** | PROTOCOL.md (agent entrypoint, not separate workflow) |
| **Next Action** | Implement PROTOCOL-STATELESS-001: Add Stateless-First section to PROTOCOL.md |

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-016 (DECISION-016: Stateless-First Architecture)
→ Dependency chain: LOG-016 ← (new capability, no prior dependencies)
→ Next action: Implement PROTOCOL-STATELESS-001 — add section to PROTOCOL.md

**Layer 2 — Global Context:**
→ Architecture: This is a foundational protocol change
→ Patterns: Handoff format now canonical (Option C)
→ Key file: `gsd-lite/template/PROTOCOL.md` is the implementation target

**Fork paths:**
- Continue execution → Read LOG-016 Part 6 (Implementation Plan) → Update PROTOCOL.md
- Discuss handoff format details → Re-read LOG-016 Part 3 (Canonical Format)
- Pivot to new topic → Read `gsd-lite/PROJECT.md` for project vision + state your question

---

### [LOG-017] - [VISION] - The Housekeeping Agent: Automated Coherence Detection for Dense Worklogs - Task: HOUSEKEEPING-AGENT

**Timestamp:** 2026-02-06
**Status:** 📋 VISION CAPTURED — Discussion Phase, No Implementation Yet
**Decision ID:** Pending (will become DECISION-017 upon approval)

---

#### Part 1: The Narrative — How We Got Here

##### The Problem: Context Rot in Long-Running Projects

During a live production evaluation using GSD-Lite on a real Looker/dbt integration project (`eval/prod/`), we encountered a fascinating paradox: **the very system that was supposed to tame context rot had itself accumulated a 64,000-token worklog**.

Think of it like a historian's archive that grew so comprehensive it became difficult to navigate without a historian.

**The Evidence (from `eval/prod/WORK_context_analysis.md`):**

| Metric | Value | Implication |
|--------|-------|-------------|
| Total tokens | ~64,864 | Approaches the 80k "danger zone" for context rot |
| Log entries | 56 (LOG-001 through LOG-056) | 7+ weeks of cross-session work |
| Superseded entries | 6 (LOG-018, 020, 021, 022, 023, 030) | Dead branches still consuming tokens |
| Decisions | 20 (DECISION-001 through DECISION-020) | Complex dependency graph |
| Top heavy section | 2,663 tokens (Layer 2 semantic layer docs) | Some entries are mini-documents |

**Source:** `eval/prod/WORK_context_analysis.md` (generated by `analyze_context.py`)

##### The Symptoms: Four Types of Context Pain

The user articulated the pain as "D — all of the above":

```mermaid
flowchart TD
    subgraph SYMPTOMS["🔴 Context Pain Symptoms"]
        A["(A) Finding what's CURRENT<br/>requires reading superseded entries"]
        B["(B) Key Events Index<br/>cluttered with dead branches"]
        C["(C) New agents waste tokens<br/>on stale context"]
        D["(D) Human wastes time<br/>reading irrelevant history"]
    end
    
    subgraph ROOT["🟠 Root Cause"]
        R1["No automated detection<br/>of coherence drift"]
        R2["Manual housekeeping<br/>is cognitively expensive"]
    end
    
    A --> R1
    B --> R1
    C --> R2
    D --> R2
    
    style SYMPTOMS fill:#ffcccc,stroke:#cc0000
    style ROOT fill:#fff3cd,stroke:#856404
```

##### The Paradox: Valuable Logs Are Also Expensive Logs

The dense worklog wasn't just noise — it was **incredibly valuable**:

1. **PR Generation:** Two substantial PRs were extracted directly from the logs:
   - `eval/prod/PR_artifacts/PR_dbt.md` (19.54 KB) — dbt extension models
   - `eval/prod/PR_artifacts/PR_sightify.md` (6.26 KB) — Sightify frontend integration

2. **Decision Traceability:** The log captured the journey, not just the destination:
   - LOG-018 → LOG-020 → LOG-021 → LOG-024 shows a pivot from PDT strategy to Mirror Clone
   - DECISION-006 → DECISION-007 shows refinement from "separate project" to "Two Galaxies"

3. **Onboarding Power:** A fresh agent could (in theory) read LOG-045 "Agent Onboarding Paths" and know exactly which logs to read for each type of task.

**The insight:** The value is real, but it's buried. We need **curation**, not deletion.

---

#### Part 2: The Research — Context Engineering Industry State (2026)

Before proposing a solution, we grounded our thinking in current industry best practices.

##### 2.1 Context Engineering: Beyond Prompt Engineering

**Key insight from Anthropic/LangChain research:** Context engineering is *not* prompt engineering. It's about curating the *entire state* available to the LLM at any given time.

> "Context engineering is defined as curating what the model sees so that you get a better result... Agent failures are often due to a lack of 'right' context."
> — LangChain Deep Agents documentation (2026)

##### 2.2 The Quality Degradation Curve

Research confirms what GSD-Lite already codifies:

| Context Usage | Quality | LLM Behavior |
|---------------|---------|--------------|
| 0-30% | PEAK | Thorough, comprehensive reasoning |
| 30-50% | GOOD | Confident, solid work |
| 50-70% | DEGRADING | Efficiency mode begins |
| 70%+ | POOR | Rushed, minimal, prone to hallucination |

**Source:** Anthropic context window management documentation, LangChain agent best practices

##### 2.3 Industry Strategies for Managing Context Growth

```mermaid
flowchart LR
    subgraph STRATEGIES["Context Management Strategies"]
        direction TB
        S1["📜 Sliding Window<br/>Drop oldest, keep recent"]
        S2["📝 Summarization<br/>Condense old → summary"]
        S3["🗂️ Hierarchical Summary<br/>Chunk → summarize → re-summarize"]
        S4["💾 Filesystem Offload<br/>Store full content externally,<br/>keep pointers in context"]
        S5["📋 Selective Retention<br/>Prioritize high-value,<br/>discard low-value"]
    end
    
    style S4 fill:#d4edda,stroke:#155724
    style S5 fill:#d4edda,stroke:#155724
```

**Highlighted strategies (S4 + S5) align with GSD-Lite's approach:**
- **Filesystem Offload:** Logs live in WORK.md (external), agent reads surgically via grep
- **Selective Retention:** Key Events Index surfaces high-value decisions, grep patterns enable targeted reads

**What's missing:** Automated detection of *when* and *what* to curate.

##### 2.4 The "Archival vs Consolidation" Dilemma

The user raised a valid concern:

> "I want to say merged, but there's a risk there similar to git workflows that we're 'rewriting history' and I'm afraid of the risk that it breaks coherence when agent scans logs to read and create the PR."

**Industry parallel:** Git has two merge strategies:

| Strategy | Git Equivalent | Pros | Cons |
|----------|---------------|------|------|
| **Archival** | `git merge` (preserves commits) | Full history, audit trail | Noise, requires navigation |
| **Consolidation** | `git squash` (rewrites history) | Clean, single narrative | Loses journey, breaks refs |

**Proposed GSD-Lite hybrid:** Archive to HISTORY.md (preserves journey), but also update the superseding log with a "Rejected Alternatives" section that summarizes what was tried.

---

#### Part 3: The Analysis — Lifecycle Patterns in Production WORK.md

We scanned `eval/prod/WORK.md` to identify natural lifecycle patterns that a Housekeeping Agent could exploit.

##### 3.1 Decision Status Vocabulary (Discovered)

From grep analysis of `eval/prod/WORK.md` lines containing "Status:" or "SUPERSEDED":

| Status Value | Count | Meaning |
|--------------|-------|---------|
| `SUPERSEDED` | 6 entries | Decision invalidated by later decision |
| `APPROVED` | 8 entries | Decision finalized and active |
| `COMPLETED` / `Complete` | 11 entries | Execution finished |
| `IMPLEMENTATION READY` | 2 entries | Plan ready for execution |
| `Awaiting Discussion` | 1 entry | Pending user input |
| `DECISION-PENDING` | 1 entry | Decision proposed but not approved |

**Source:** `grep "Status:|SUPERSEDED" eval/prod/WORK.md` (lines 63-5547)

##### 3.2 Proposed Lifecycle Hierarchy

Based on the observed patterns, we can formalize a decision lifecycle:

```mermaid
stateDiagram-v2
    [*] --> PROPOSED: Agent proposes
    PROPOSED --> APPROVED: User approves
    PROPOSED --> REJECTED: User rejects
    
    APPROVED --> IMPLEMENTED: Code written
    APPROVED --> SUPERSEDED: Better option found
    
    IMPLEMENTED --> COMPLETED: Verified working
    IMPLEMENTED --> SUPERSEDED: Refactored away
    
    SUPERSEDED --> ARCHIVED: Moved to HISTORY.md
    COMPLETED --> ARCHIVED: Housekeeping triggered
    
    note right of SUPERSEDED
        Drift point: Agent detects
        and prompts reconciliation
    end note
    
    note right of ARCHIVED
        Preserves journey in HISTORY.md
        Removes from active WORK.md
    end note
```

##### 3.3 Cross-Reference Patterns (Dependency Graph)

The grep also revealed how decisions reference each other:

```
DECISION-007 supersedes DECISION-006 (LOG-030 → LOG-031)
DECISION-009 depends on DECISION-004, DECISION-007
DECISION-012 depends on DECISION-004, DECISION-007
DECISION-018 supersedes (partially) DECISION-016
```

**This creates a DAG (Directed Acyclic Graph)** that the Housekeeping Agent can traverse to:
1. Find orphaned decisions (approved but never implemented)
2. Find dangling references (implemented but decision superseded)
3. Suggest consolidation opportunities (chains that converged)

---

#### Part 4: The Vision — What the Housekeeping Agent Would Do

##### 4.1 Core Design Principles

| Principle | Rationale |
|-----------|-----------|
| **Interview-First** | Replicate the Socratic questioning of discuss.md — agent proposes, user decides |
| **Lightweight Protocol** | Not full GSD-Lite — just scan, detect, propose, execute (with approval) |
| **Non-Destructive by Default** | Archive to HISTORY.md, never delete. User can request consolidation. |
| **Pattern from discuss.md** | Same questioning philosophy, same coaching tone, same confirmation loops |

##### 4.2 The Interview Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as Housekeeping Agent
    participant W as WORK.md
    participant H as HISTORY.md
    
    U->>A: "Run housekeeping"
    A->>W: Grep for SUPERSEDED, Status, DECISION-
    A->>A: Build dependency graph
    A->>A: Detect drift points
    
    A->>U: "I found 5 drift points:<br/>1. LOG-018/20/21 superseded by LOG-024<br/>2. DECISION-006 orphaned (superseded but not archived)<br/>..."
    
    U->>A: "Let's reconcile #1 first"
    
    A->>U: "Options for LOG-018/20/21:<br/>(A) Archive to HISTORY with summary<br/>(B) Merge into LOG-024 as 'Rejected Alternatives'<br/>(C) Keep as-is with strikethrough<br/>Which fits your workflow?"
    
    U->>A: "A - Archive with summary"
    
    A->>H: Append archived entries
    A->>W: Remove archived entries
    A->>W: Update Key Events Index
    
    A->>U: "Done. Archived 3 entries (1,247 tokens freed).<br/>Next drift point?"
```

##### 4.3 Detection Capabilities

The agent would scan for these drift patterns:

| Drift Type | Detection Method | Example |
|------------|------------------|---------|
| **Superseded chains** | `grep "SUPERSEDED"` | LOG-018 → LOG-024 |
| **Orphaned decisions** | APPROVED status with no subsequent EXEC/BUILD referencing it | DECISION-005 approved but never implemented |
| **Dangling implementations** | EXEC entries that reference a superseded DECISION | LOG-022 implemented LOG-020 which was superseded |
| **Status drift** | `Status: COMPLETED` in log but not updated in Current Understanding | LOG-041 complete but still listed as active_task |
| **Index staleness** | Key Events Index contains superseded entries | LOG-018 still in index despite being superseded |

##### 4.4 Output Options

For each drift point, the agent offers:

| Option | Output | When to Use |
|--------|--------|-------------|
| **(A) Archive** | Move to HISTORY.md with 1-line summaries | Default — preserves journey externally |
| **(B) Consolidate** | Merge into superseding entry as "Rejected Alternatives" section | When understanding the *journey* matters for the final decision |
| **(C) Keep** | Leave as-is with strikethrough markup | When entries are still being referenced elsewhere |
| **(D) Generate Doc** | Extract to standalone document (e.g., `docs/architecture-decisions/ADR-001.md`) | For decisions that should become permanent documentation |

---

#### Part 5: Open Questions for Next Discussion

1. **Lifecycle Formalization:** Should we add explicit `status:` fields to log entries (like `status: APPROVED | SUPERSEDED | COMPLETED`)? Or infer from content?

2. **Archive Granularity:** Archive whole chains (LOG-018 + LOG-020 + LOG-021 together) or individual entries?

3. **Consolidation Safety:** If we merge superseded entries into the winning decision, how do we handle PR generation that might want to show the journey?

4. **Agent Triggers:** Should the agent run:
   - (A) On-demand only ("run housekeeping")
   - (B) Suggested at checkpoints ("WORK.md is 50k+ tokens, run housekeeping?")
   - (C) Automatically at session start with light scan

5. **Token Savings Reporting:** Should the agent calculate and report tokens freed? (Motivates user to curate)

---

#### Part 6: Synthesized Example — A Complete Housekeeping Session

**Scenario:** User has been working on the Sightify demo for 3 weeks. WORK.md has grown to 60k tokens.

```markdown
User: "Run housekeeping"

Agent: I scanned WORK.md and found 7 drift points across 3 categories:

**🔴 Superseded Chains (3 chains, 2,847 tokens):**
1. LOG-018 → LOG-020 → LOG-021 (superseded by LOG-024 "Mirror Clone")
   - Original strategy: PDT bridge for cross-region data
   - Why superseded: BigQuery cross-region join limitation
   
2. LOG-030 (superseded by LOG-031 "Two Galaxies")
   - Original strategy: Separate Looker project
   - Why superseded: Refined to single project with dual models

3. LOG-051 [DECISION-PENDING] (resolved by LOG-052 DECISION-018)
   - Original question: Static presets vs dynamic Looker filters?
   - Resolution: Dual Filter Sections with Mutex

**🟡 Status Drift (2 entries):**
4. Current Understanding lists TASK-006 as active, but LOG-053 shows Complete
5. Key Events Index still contains LOG-018 (superseded)

**🟢 Archival Candidates (2 completed tasks):**
6. TASK-001 (Feature Mapping) — 10 entries, all Complete
7. Phase 2A (dbt models) — 8 entries, merged to main

---

Which category would you like to tackle first?
(Or type a number 1-7 to address a specific item)

User: "1"

Agent: For the PDT bridge chain (LOG-018 → LOG-020 → LOG-021):

**Context:** This was a 3-step exploration of using Looker PDTs to bridge 
cross-project permissions. It failed because BigQuery doesn't allow 
cross-region joins (US public data vs Asia-SE1 owned data).

**Options:**
(A) Archive to HISTORY.md — I'll preserve 1-line summaries and the key 
    learning ("cross-region limitation"). LOG-024 already has the full 
    context of why we pivoted.
    
(B) Consolidate into LOG-024 — I'll add a "Rejected Alternatives" section 
    to LOG-024 with 3-sentence summaries of each attempt.
    
(C) Keep as-is — Leave with strikethrough. Useful if you want to show the 
    journey in PR descriptions.

Which approach fits your workflow? [YOUR TURN]

User: "A"

Agent: ✅ Archived 3 entries to HISTORY.md
- LOG-018: Pivot to Public Data (REJECTED: region mismatch)
- LOG-020: PDT Data Bridge (REJECTED: permissions insufficient)  
- LOG-021: PDT Implementation Guide (REJECTED: built on LOG-020)

Updated:
- Removed from WORK.md Atomic Log (freed 1,583 tokens)
- Removed LOG-018 from Key Events Index
- Added summary to HISTORY.md under "Phase 2: Rejected Approaches"

📊 Progress: 1/7 drift points resolved. ~4% context freed.
Next item, or continue to #2?
```

---

#### Part 7: Cross-References and Citations

| Reference | Location | Purpose |
|-----------|----------|---------|
| Production WORK.md | `eval/prod/WORK.md` | Source of drift pattern examples |
| Context analysis | `eval/prod/WORK_context_analysis.md` | Token breakdown proving 64k accumulation |
| PR artifacts | `eval/prod/PR_artifacts/PR_dbt.md`, `PR_sightify.md` | Proof that dense logs have value |
| Current housekeeping workflow | `gsd-lite/template/workflows/housekeeping.md` | Baseline to extend |
| Discuss workflow | `gsd-lite/template/workflows/discuss.md` | Source of interview/questioning patterns |
| Questioning philosophy | Embedded in `gsd-lite/template/PROTOCOL.md` | Coaching tone to replicate |
| Context engineering research | Google Grounding search (2026-02-06) | Industry best practices |
| LangChain Deep Agents docs | Referenced in grounding results | Filesystem offload pattern |
| Anthropic context management | Referenced in grounding results | Quality degradation curve |

---

#### Part 8: Decision Record (Pending)

| Attribute | Value |
|-----------|-------|
| **Decision ID** | DECISION-017 (pending approval) |
| **Title** | Housekeeping Agent: Automated Coherence Detection for Dense Worklogs |
| **Status** | 📋 VISION CAPTURED |
| **Supersedes** | None (extends existing housekeeping.md workflow) |
| **Rationale** | Manual housekeeping is cognitively expensive. Automated detection of drift points + Socratic interview reduces friction while keeping human in control. |
| **Trade-offs** | New agent to maintain. Risk of over-engineering. Mitigation: Keep protocol lightweight — interview + propose only, no autonomous action. |
| **Next Action** | Continue discussion on open questions (Part 5), then draft agent specification |

---

### [LOG-018] - [DECISION] - Housekeeping Agent Design: Two-Phase Architecture with Semantic Inference - Task: HOUSEKEEPING-AGENT

**Timestamp:** 2026-02-06
**Status:** ✅ DESIGN DECISIONS APPROVED
**Depends On:** LOG-017 (Vision: Housekeeping Agent concept)
**Decision IDs:** DECISION-018a through DECISION-018e

---

#### Part 1: The Narrative — Resolving the Chicken-and-Egg Problem

##### The Problem We Discovered

During discussion of LOG-017's Housekeeping Agent vision, we hit a critical design flaw: **the agent was designed to scan for tags (SUPERSEDED, status:, decision references) that don't reliably exist**.

The original LOG-017 design assumed:
```
Agent scans for SUPERSEDED tags → Builds DAG → Proposes archival
```

But in reality, fresh worklogs have **no explicit tags**. The user manually adds `SUPERSEDED` markers only after recognizing supersession — which requires the same cognitive load the agent was supposed to eliminate.

**The paradox visualized:**

```mermaid
flowchart TD
    subgraph CHICKEN_EGG["🐔🥚 The Chicken-and-Egg Problem"]
        A["Housekeeping Agent needs tags<br/>to detect supersession"]
        B["Tags don't exist until<br/>someone identifies supersession"]
        C["Identifying supersession requires<br/>reading all logs (cognitive load)"]
        D["User wanted agent to<br/>eliminate that cognitive load"]
    end
    
    A --> B
    B --> C
    C --> D
    D -->|"Loop!"| A
    
    style CHICKEN_EGG fill:#fff3cd,stroke:#856404
```

##### The Solution: Two-Phase Architecture

The user proposed a clean separation:

| Phase | What It Does | Who Does It |
|-------|--------------|-------------|
| **Phase 1: Inference + Interview** | Scan holistically, INFER relationships from semantic content, present draft DAG, interview user to confirm, write tags | Agent + User |
| **Phase 2: Archival** | Scan confirmed tags, detect drift, propose archival | Agent (existing housekeeping.md) |

**Key insight:** Phase 1 creates the tags that Phase 2 depends on. No chicken-and-egg because they run sequentially.

---

#### Part 2: The Four Design Questions — Decisions Made

##### DECISION-018a: Tool Integration is REQUIRED

**Question:** Should the Housekeeping Agent require the token analysis tool (`analyze_context.py`)?

**Decision:** YES — Tool integration is mandatory, not optional.

**Rationale (from user):**
> "We need to save agent greps and divide and conquer — agent should be making the reasoning to infer DAGs, while a tool can deterministically and with little resource and consistently create the analysis in one fell swoop."

**The division of labor:**

| Component | Responsibility | Resource Cost |
|-----------|----------------|---------------|
| `analyze_context.py` | Structural extraction (sections, tokens, line numbers, titles) | Low (deterministic, fast) |
| Agent | Semantic reasoning (infer supersession from content patterns) | High (LLM inference) |

**Evidence of tool capability:** The tool already captures explicit SUPERSEDED markers in titles:
```markdown
# From eval/prod/WORK_context_analysis.md (Lines 42-44):
#### [LOG-018] - [DECISION] - ~~Pivot to Public Data...~~ (SUPERSEDED by LOG-024)
#### [LOG-020] - [DECISION] - ~~Solved Cross-Project Permissions...~~ (SUPERSEDED by LOG-024)
#### [LOG-021] - [PLAN] - ~~Complete LookML PDT Implementation...~~ (SUPERSEDED by LOG-024)
```

**Source:** `eval/prod/WORK_context_analysis.md` (generated by `analyze_context.py`)

---

##### DECISION-018b: Semantic Inference from Content (Three-Tier Signal Hierarchy)

**Question:** What content signals should the agent look for when inferring supersession?

**Decision:** Use a three-tier hierarchy based on confidence level. Agent acts on Tier 1, confirms Tier 2-3 with user.

**The Inference Hierarchy (from helper agent analysis):**

```mermaid
flowchart TD
    subgraph TIER1["Tier 1: HIGH Confidence (Agent Acts)"]
        T1A["Strikethrough in title: ~~old title~~"]
        T1B["'THIS LOG SUPERSEDES LOG-XXX' in body"]
        T1C["'obsolete' / 'Do NOT follow' language"]
        T1D["'pivot' / 'pivotal' / 'abandoned' keywords"]
        T1E["'hit a wall' / 'critical limitation'"]
        T1F["'Superseded Decisions' section header"]
    end
    
    subgraph TIER2["Tier 2: MEDIUM Confidence (Agent Confirms)"]
        T2A["Options evaluated → later DECISION picks one"]
        T2B["Same TASK-ID, sequential logs"]
        T2C["'What We Decided NOT to Do' section"]
        T2D["Explicit 'Depends On:' field"]
        T2E["'Before and After' diagrams"]
    end
    
    subgraph TIER3["Tier 3: LOW Confidence (Agent Asks)"]
        T3A["'refined' language (evolution vs supersession?)"]
        T3B["'consolidated' (merge vs supersession?)"]
        T3C["Same topic, different logs (parallel vs chain?)"]
    end
    
    style TIER1 fill:#d4edda,stroke:#155724
    style TIER2 fill:#fff3cd,stroke:#856404
    style TIER3 fill:#f8d7da,stroke:#721c24
```

**Grep patterns for Phase 1C (from helper agent):**
```bash
# Tier 1 signals
grep "THIS (LOG|DECISION) SUPERSEDES"
grep "obsolete|Do NOT follow|DEPRECATED"
grep "pivot|pivotal|abandoned"
grep "hit a.*wall|critical.*limitation"

# Cross-reference extraction
grep "LOG-[0-9]+.*LOG-[0-9]+"        # Edge candidates
grep "Depends On|depends on|as defined in"
grep "supersedes|replaces|invalidates"
```

**Additional Tier 1 signals discovered in production WORK.md:**

| Pattern | Example | Location |
|---------|---------|----------|
| "Superseded Decisions" section | LOG-024 Part 5 lists killed decisions | `eval/prod/WORK.md:2374-2383` |
| Decision Record "Supersedes" field | `Supersedes: DECISION-006` in table | `eval/prod/WORK.md:2731-2741` |
| "SUPERSEDING:" prefix in title | `[LOG-019] - [DECISION] - SUPERSEDING:` | `eval/prod/WORK.md:983` |

**Source:** Helper agent analysis + grep of `eval/prod/WORK.md`

---

##### DECISION-018c: Tagging Format — Header + Body Block (Option C)

**Question:** When the agent writes confirmed tags back to logs, what format?

**Options evaluated:**
- (A) Header only: `### [LOG-018] - ... - **SUPERSEDED BY: LOG-024**`
- (B) Body block only: Metadata section inside log entry
- (C) Both: Header for grep, body for details

**Decision:** Option C — Both header and body block.

**Rationale:**
- **Header tag** enables fast grep scanning: `grep "SUPERSEDED BY" WORK.md`
- **Body block** preserves full relationship details for deep reads

**Example output after tagging:**

```markdown
### [LOG-018] - [DECISION] - ~~Pivot to Public Data~~ - Task: PHASE-002 - **SUPERSEDED BY: LOG-024**

**Timestamp:** 2026-01-15
**Status:** ❌ SUPERSEDED
**Superseded By:** LOG-024 (Mirror Clone Strategy)
**Reason:** BigQuery cross-region join limitation made PDT bridge approach unviable

---
[Original log content preserved below]
```

---

##### DECISION-018d: DAG Visualization in Report — APPROVED

**Question:** Should the agent's report include a mermaid diagram of the inferred DAG?

**Decision:** YES — Include mermaid DAG visualization.

**Rationale:**
1. **Gestalt understanding** — User sees the whole structure at once
2. **Catches orphans visually** — Nodes with no edges stand out
3. **Validates inference** — User can spot "that edge doesn't make sense"
4. **Low cost** — Mermaid is text, minimal tokens

**Example visualization:**

```mermaid
flowchart TD
    subgraph PHASE002["Phase 2: Data Architecture"]
        LOG017["LOG-017: YAML Data Gen<br/>📋 DECISION"]
        LOG018["LOG-018: Public Data Pivot<br/>❌ SUPERSEDED"]
        LOG019["LOG-019: dbt-Native Strategy<br/>📋 DECISION"]
        LOG020["LOG-020: PDT Bridge<br/>❌ SUPERSEDED"]
        LOG021["LOG-021: PDT Implementation<br/>❌ SUPERSEDED"]
        LOG024["LOG-024: Mirror Clone<br/>✅ ACTIVE"]
        
        LOG019 -->|supersedes| LOG017
        LOG024 -->|supersedes| LOG018
        LOG024 -->|supersedes| LOG020
        LOG024 -->|supersedes| LOG021
    end
    
    style LOG018 fill:#ffcccc,stroke:#cc0000
    style LOG020 fill:#ffcccc,stroke:#cc0000
    style LOG021 fill:#ffcccc,stroke:#cc0000
    style LOG024 fill:#d4edda,stroke:#155724
```

---

##### DECISION-018e: Agent Spec Location — Multi-Agent Distribution Refactor

**Question:** Where should the Housekeeping Agent spec live?

**User's vision:** `.opencode/agents/gsd-housekeeping.md`

**The gap identified:** Current `src/gsd_lite/__main__.py` copies a single `AGENTS.md` to `.opencode/agents/gsd-lite.md`. Adding a second agent requires refactoring.

**Current distribution logic (from `src/gsd_lite/__main__.py:76-79`):**
```python
# 5. Install Agent
agent_src = template_src / "AGENTS.md"
agent_dest = agents_dir / "gsd-lite.md"
shutil.copy2(agent_src, agent_dest)
```

**Proposed refactor:**

```mermaid
flowchart LR
    subgraph BEFORE["Current: Single Agent"]
        A1["template/AGENTS.md"] -->|copy| A2[".opencode/agents/gsd-lite.md"]
    end
    
    subgraph AFTER["Proposed: Multi-Agent"]
        B1["template/agents/gsd-lite.md"] -->|copy| B2[".opencode/agents/gsd-lite.md"]
        B3["template/agents/gsd-housekeeping.md"] -->|copy| B4[".opencode/agents/gsd-housekeeping.md"]
    end
    
    style BEFORE fill:#f8d7da,stroke:#721c24
    style AFTER fill:#d4edda,stroke:#155724
```

**Implementation plan:**

1. **Create `src/gsd_lite/template/agents/` directory**
2. **Move `AGENTS.md` → `agents/gsd-lite.md`** (content unchanged)
3. **Create `agents/gsd-housekeeping.md`** (new agent spec)
4. **Refactor `__main__.py` agent installation:**

```python
# BEFORE (lines 76-79):
agent_src = template_src / "AGENTS.md"
agent_dest = agents_dir / "gsd-lite.md"
shutil.copy2(agent_src, agent_dest)

# AFTER:
agents_src = template_src / "agents"
if agents_src.exists():
    for agent_file in agents_src.glob("*.md"):
        shutil.copy2(agent_file, agents_dir / agent_file.name)
    console.print(f"[green]✔ Installed Agents:[/green] {agents_dir} ({len(list(agents_src.glob('*.md')))} files)")
```

**Decision:** Proceed with multi-agent refactor. This enables seamless distribution of both:
- `gsd-lite.md` — Core GSD-Lite protocol agent
- `gsd-housekeeping.md` — Housekeeping Agent for coherence detection

---

#### Part 3: The Complete Phase 1 Algorithm

Based on all decisions, here's the full inference + interview flow:

```mermaid
sequenceDiagram
    participant U as User
    participant A as Housekeeping Agent
    participant T as analyze_context.py
    participant W as WORK.md
    
    U->>A: "Run housekeeping"
    
    Note over A,T: STEP 1: Tool generates structure
    A->>T: Run token analysis
    T->>A: Return section map + tokens + line numbers
    
    Note over A: STEP 2: Parse explicit markers
    A->>A: Extract strikethrough titles
    A->>A: Extract SUPERSEDED in headers
    A->>A: Extract Decision Record tables
    
    Note over A,W: STEP 3: Grep for Tier 1 signals
    A->>W: grep "THIS LOG SUPERSEDES"
    A->>W: grep "obsolete|Do NOT follow"
    A->>W: grep "pivot|abandoned"
    A->>W: grep cross-references
    
    Note over A: STEP 4: Build DRAFT DAG
    A->>A: Create nodes (all LOG/DECISION)
    A->>A: Create edges with confidence levels
    
    Note over A,U: STEP 5: Present + Interview
    A->>U: Show mermaid DAG + relationship table
    A->>U: "I found 12 relationships.<br/>6 HIGH confidence, 4 MEDIUM, 2 LOW."
    
    loop For each relationship
        A->>U: "LOG-024 supersedes LOG-018/20/21.<br/>Confidence: HIGH. Confirm?"
        U->>A: "Confirmed" / "Correct to X" / "Reject"
    end
    
    Note over A,W: STEP 6: Write confirmed tags
    A->>W: Add SUPERSEDED BY to headers
    A->>W: Add metadata blocks to bodies
    
    A->>U: "Tags written. Ready for Phase 2 (archival)?"
```

---

#### Part 4: Open Implementation Tasks

| Task | Description | Priority |
|------|-------------|----------|
| TASK-HA-001 | Create `template/agents/` directory structure | HIGH |
| TASK-HA-002 | Move `AGENTS.md` → `agents/gsd-lite.md` | HIGH |
| TASK-HA-003 | Refactor `__main__.py` for multi-agent distribution | HIGH |
| TASK-HA-004 | Draft `agents/gsd-housekeeping.md` spec | HIGH |
| TASK-HA-005 | Add `analyze_context.py` as package dependency or bundled tool | MEDIUM |
| TASK-HA-006 | Test Phase 1 on `eval/prod/WORK.md` (has mixed tagged/untagged entries) | MEDIUM |

---

#### Part 5: Cross-References and Citations

| Reference | Location | Purpose |
|-----------|----------|---------|
| LOG-017 | `gsd-lite/WORK.md:2545-2948` | Parent vision document for Housekeeping Agent |
| Production WORK.md | `eval/prod/WORK.md` | Real-world example with 56 logs, 64k tokens |
| Token analysis output | `eval/prod/WORK_context_analysis.md` | Proof of tool capability |
| Current installer logic | `src/gsd_lite/__main__.py:76-79` | Code to refactor for multi-agent |
| Template directory | `src/gsd_lite/template/` | Current structure (single AGENTS.md) |
| Helper agent analysis | User message (this session) | Tier 1-3 inference pattern discovery |

---

#### Part 6: Decision Records Summary

| ID | Title | Status |
|----|-------|--------|
| DECISION-018a | Tool integration is REQUIRED | ✅ APPROVED |
| DECISION-018b | Three-tier semantic inference hierarchy | ✅ APPROVED |
| DECISION-018c | Header + Body tagging format (Option C) | ✅ APPROVED |
| DECISION-018d | DAG visualization in report | ✅ APPROVED |
| DECISION-018e | Multi-agent distribution refactor | ✅ APPROVED |

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-018 (DECISION: Housekeeping Agent design decisions captured)
→ Dependency chain: LOG-018 ← LOG-017 (Vision) ← LOG-016 (Stateless-First)
→ Next action: Execute TASK-HA-001 through TASK-HA-004 (multi-agent refactor + spec draft)

**Layer 2 — Global Context:**
→ Architecture: GSD-Lite uses `template/` for distributed artifacts
→ Patterns: Single AGENTS.md → Multi-agent `agents/` directory
→ Tool: `analyze_context.py` required dependency for housekeeping

**Fork paths:**
- Execute multi-agent refactor → TASK-HA-001 through TASK-HA-003
- Draft housekeeping agent spec → TASK-HA-004
- Test on production → Run Phase 1 on `eval/prod/WORK.md`
- Discuss further → Refine inference patterns or tagging format

---

### [LOG-019] - [EXEC] - Implemented Multi-Agent Architecture & Housekeeping Spec - Task: TASK-HA-004
**Timestamp:** 2026-02-07 16:30
**Status:** COMPLETE
**Tasks:** TASK-HA-001, TASK-HA-002, TASK-HA-003, TASK-HA-004

**Context:**
Refactored the core installer to support distributed agent definitions, enabling the addition of specialized agents like the Housekeeping Agent.

**Changes:**
1. **Directory Structure (TASK-HA-001):** Created `src/gsd_lite/template/agents/` to house multiple agent definitions.
2. **Migration (TASK-HA-002):** Moved the monolithic `AGENTS.md` to `template/agents/gsd-lite.md`.
3. **Installer Refactor (TASK-HA-003):** Updated `src/gsd_lite/__main__.py` to iterate through the `agents/` directory and install all `.md` files found, ensuring scalability.
4. **Housekeeping Spec (TASK-HA-004):** Drafted `template/agents/gsd-housekeeping.md` based on the approved design (LOG-018), implementing the "Context Gardener" persona.

**Verification:**
- `ls` confirmed directory creation.
- `read` confirmed file migration and new content.
- `__main__.py` logic reviewed and updated to handle multiple agents.

**Next:** Review the Housekeeping Agent spec and implement `analyze_context.py` (TASK-HA-005).

---

### [LOG-020] - [DISCOVERY] - The Invisible Documentation Problem: HTML Comments Skip Grep-First Onboarding - Task: PROTOCOL-DOCS

**Timestamp:** 2026-02-07
**Status:** DISCOVERY → DECISION
**Depends On:** LOG-019 (Housekeeping spec review triggered this discovery), LOG-015 (Context Map tooling), LOOP-002 (Few-shot example visibility)
**Decision IDs:** DECISION-020a (Consolidate docs to agent instruction), DECISION-020b (10k token budget as CI pillar)

---

#### Part 1: The Discovery — What Agents Actually Read vs. What Exists

##### The Trigger

While reviewing the Housekeeping Agent spec (LOG-019), we asked: "Does the Context Gardener understand WORK.md structure?" This led to a debugger-style analysis of what agents actually read during onboarding.

##### The Finding: Grep-First Skips Documentation

GSD-Lite templates contain rich documentation in HTML comments at the top of each file. **But agents following grep-first protocol never see them.**

```mermaid
flowchart TD
    subgraph AGENT_PATH["🤖 Agent Onboarding Path"]
        A1["Load gsd-lite.md<br/>(system prompt)"]
        A2["Read PROJECT.md<br/>(full file)"]
        A3["Read ARCHITECTURE.md<br/>(full file)"]
        A4["grep '^## ' WORK.md<br/>(headers only)"]
        A5["Read Current Understanding<br/>(lines 34-105)"]
        A6["grep '^### \\[LOG-'<br/>(log headers)"]
        A7["Surgical read of<br/>specific logs"]
    end
    
    subgraph SKIPPED["❌ What Gets Skipped"]
        S1["WORK.md lines 3-30<br/>Lifecycle, purpose, grep patterns"]
        S2["WORK.md lines 36-56<br/>Current Understanding structure"]
        S3["INBOX.md lines 3-35<br/>Loop format, entry structure"]
        S4["HISTORY.md lines 3-10<br/>Archive purpose"]
        S5["All EXAMPLE-NNN entries<br/>(don't match LOG-NNN pattern)"]
    end
    
    A4 -->|"Skips HTML comments"| S1
    A4 -->|"Skips HTML comments"| S2
    A6 -->|"Pattern mismatch"| S5
    
    style SKIPPED fill:#f8d7da,stroke:#721c24
    style AGENT_PATH fill:#d4edda,stroke:#155724
```

##### Evidence: The HTML Comment Inventory

| File | Lines | Content | Tokens | Citation |
|------|-------|---------|--------|----------|
| `WORK.md` | 3-30 | Lifecycle, purpose, grep patterns, file reading strategy | ~350 | `src/gsd_lite/template/WORK.md:3-30` |
| `WORK.md` | 36-56 | Current Understanding structure (fields, guidelines) | ~250 | `src/gsd_lite/template/WORK.md:36-56` |
| `WORK.md` | 97+, 145+ | Key Events Index / Atomic Log descriptions | ~200 | `src/gsd_lite/template/WORK.md:97,145` |
| `INBOX.md` | 3-35 | Loop format, entry structure, WHY this format | ~400 | `src/gsd_lite/template/INBOX.md:3-35` |
| `HISTORY.md` | 3-10 | Minimal archive purpose | ~50 | `src/gsd_lite/template/HISTORY.md:3-10` |
| **Total** | — | — | **~1,250** | — |

##### What the Agent Instruction Contains vs. Lacks

**✅ gsd-lite.md DOES contain** (citation: `context_map.md`):
- Universal Onboarding sequence (lines 33-53, ~310 tokens)
- File Reading Strategy (lines 123-174, ~539 tokens)
- File Guide quick reference (lines 175-185, ~124 tokens)
- Questioning Philosophy (lines 325-489, ~1,400 tokens)

**❌ gsd-lite.md does NOT contain:**
- What WORK.md sections mean and how they work
- What INBOX.md loop format is and why
- What HISTORY.md is for
- How Current Understanding fields should be structured
- What log entry bodies should contain (journalism format)

---

#### Part 2: The Token Budget Analysis — We Have Headroom

##### Current State (from `context_map.md`)

| Component | Tokens | Source |
|-----------|--------|--------|
| gsd-lite.md agent instruction | 4,913 | `context_map.md` (generated 2026-02-07) |
| Documentation to migrate | ~1,250 | HTML comment inventory above |
| **Projected total** | **~6,163** | — |
| **Budget headroom** | **10,000** | User-defined first-turn limit |
| **Remaining buffer** | **~3,837** | Available for future growth |

```mermaid
pie title Agent Instruction Token Budget (10k headroom)
    "Current gsd-lite.md" : 4913
    "Docs to migrate" : 1250
    "Remaining buffer" : 3837
```

##### Why 10k Matters

The user clarified the constraint: **first-turn headroom is 10k tokens** for system instructions + context before agent makes tool calls and starts responding. This is when the agent loads:
1. Agent instruction (gsd-lite.md)
2. System prompt overhead
3. Initial user message

Staying under 10k ensures the agent has context capacity for actual work.

---

#### Part 3: The Decision — Consolidate Documentation to Agent Instruction

##### DECISION-020a: Migrate File Documentation to gsd-lite.md

**What:** Move the essential documentation from HTML comments into the agent instruction as an "Artifact Format Reference" section.

**Why:**
1. **Guaranteed visibility** — Agent instruction is ALWAYS loaded. HTML comments are NEVER loaded with grep-first protocol.
2. **Single source of truth** — No drift between instruction and template comments.
3. **Within budget** — 6,163 tokens is well under 10k headroom.

**Trade-off accepted:** HTML comments become human-only documentation (for IDE/GitHub preview). Agent instruction becomes the authority.

**Proposed structure:**

```markdown
## Artifact Format Reference

### WORK.md Structure
- **Section 1: Current Understanding** — 30-second handoff for fresh agents
  - Fields: current_mode, active_task, parked_tasks, vision, decisions, blockers, next_action
  - Write in concrete facts, not jargon ("as discussed" = useless to fresh agent)
  
- **Section 2: Key Events Index** — Curated foundation decisions (human-maintained)

- **Section 3: Atomic Session Log** — Chronological log entries
  - Format: `### [LOG-NNN] - [TYPE] - Summary - Task: TASK-ID`
  - Types: VISION, DECISION, EXEC, DISCOVERY, PLAN
  - Body: Journalism-style with timestamp, context, evidence, code snippets, rationale

### INBOX.md Structure
- Entry format: `### [LOOP-NNN] - Summary - Status: Open|Resolved`
- Fields: Created, Source, Origin, Context, Details, Resolution
- WHY this format: Headers enable grep triage; context preserves the "why"

### HISTORY.md Structure
- Minimal: One line per completed phase
- Links to external artifacts (PRs, docs)
```

**Status:** Pending implementation (TASK-PROTOCOL-DOCS-001)

---

#### Part 4: The CI Leverage — Token Budget as Deterministic Pillar

##### DECISION-020b: 10k Token Limit as CI Gate

**The insight:** The 10k token budget is a **deterministic, measurable constraint**. Unlike philosophical adherence (which requires LLM-as-judge), token count is programmatically verifiable.

**Proposed CI check:**

```python
# Pseudo-code for CI gate
def check_agent_instruction_budget():
    """Fail CI if agent instruction exceeds 10k tokens."""
    content = read_file("src/gsd_lite/template/agents/gsd-lite.md")
    token_count = count_tokens(content)  # Use tiktoken or similar
    
    assert token_count <= 10_000, f"Agent instruction {token_count} tokens exceeds 10k budget"
    
    # Report headroom for visibility
    print(f"Token budget: {token_count}/10,000 ({10_000 - token_count} remaining)")
```

**Integration with LOOP-001 (Intern Test):**

| Test Type | What It Checks | Method |
|-----------|----------------|--------|
| **Deterministic (new)** | Token budget, file structure, grep patterns | Programmatic checks |
| **Behavioral (LOOP-001)** | Philosophy adherence, questioning style | LLM-as-judge |

The token budget check is a **quick gate** — fails fast before expensive LLM evaluation.

```mermaid
flowchart LR
    subgraph CI_PIPELINE["🔄 Proposed CI Pipeline"]
        D1["Deterministic Checks<br/>(fast, cheap)"]
        D2["Token budget ≤ 10k"]
        D3["Required sections exist"]
        D4["Grep patterns valid"]
        
        B1["Behavioral Checks<br/>(slow, expensive)"]
        B2["Intern Test scenarios"]
        B3["LLM-as-judge evaluation"]
    end
    
    D1 --> D2
    D1 --> D3
    D1 --> D4
    
    D2 -->|"Pass"| B1
    D3 -->|"Pass"| B1
    D4 -->|"Pass"| B1
    
    B1 --> B2
    B2 --> B3
    
    D2 -->|"Fail"| REJECT["❌ Reject PR"]
    
    style D1 fill:#d4edda,stroke:#155724
    style B1 fill:#fff3cd,stroke:#856404
    style REJECT fill:#f8d7da,stroke:#721c24
```

**What else can we leverage from deterministic checks?**

| Check | What It Validates | Implementation |
|-------|-------------------|----------------|
| Token budget | Agent instruction fits first-turn window | `tiktoken` count |
| Section presence | Required sections exist in templates | grep for headers |
| ID format | LOG-NNN, LOOP-NNN, TASK-NNN patterns valid | regex validation |
| Cross-reference integrity | "Depends On" references exist | grep + validate |
| Supersession tags | SUPERSEDED BY references valid logs | grep + validate |

---

#### Part 5: Immediate Actions Taken This Session

| Action | File | Lines Changed | Status |
|--------|------|---------------|--------|
| Added PROJECT.md to Gardener onboarding | `src/gsd_lite/template/agents/gsd-housekeeping.md` | Session Start section | ✅ Done |
| Enriched tag format with journalism quality | `src/gsd_lite/template/agents/gsd-housekeeping.md` | Phase 1E section | ✅ Done |
| Added "Understanding WORK.md Structure" section | `src/gsd_lite/template/agents/gsd-housekeeping.md` | New section after Session Start | ✅ Done |

---

#### Part 6: Open Tasks (Next Actions)

| Task ID | Description | Priority | Depends On |
|---------|-------------|----------|------------|
| TASK-PROTOCOL-DOCS-001 | Migrate artifact documentation to gsd-lite.md | High | This decision |
| TASK-CI-TOKEN-001 | Implement token budget CI check | Medium | TASK-PROTOCOL-DOCS-001 |
| TASK-CI-STRUCTURE-001 | Implement deterministic structure checks | Medium | — |

---

#### Backlinks

- **LOOP-001** (Philosophical CI / Intern Test) — This discovery adds deterministic checks as a complement to behavioral testing
- **LOOP-002** (Few-Shot Example Visibility) — Same root cause: valuable documentation invisible to grep-first agents
- **LOG-015** (Context Map Tool) — The `context_map.md` output enabled the token budget analysis
- **LOG-018** (Housekeeping Architecture) — The Gardener spec review triggered this discovery
- **LOG-019** (Multi-Agent Implementation) — Immediate predecessor; spec updates applied

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-020 (Invisible Documentation discovery + decisions)
→ Dependency chain: LOG-020 ← LOG-019 ← LOG-018 ← LOG-017
→ Next action: Implement TASK-PROTOCOL-DOCS-001 (migrate docs to gsd-lite.md)

**Layer 2 — Global Context:**
→ Architecture: Multi-agent structure in `src/gsd_lite/template/agents/`
→ Patterns: Grep-first file reading, 10k token first-turn budget
→ Token state: gsd-lite.md at 4,913 tokens, headroom to 10k

**Fork paths:**
- Execute doc migration → TASK-PROTOCOL-DOCS-001
- Implement CI checks → TASK-CI-TOKEN-001
- Discuss further → Refine deterministic check list
- Review other agents → Apply same onboarding pattern to future agents

---

### [LOG-021] - [DECISION] - Unified Housekeeping Agent: Collapsing Two Phases into One Stateless Spec - Task: HOUSEKEEPING-AGENT

**Timestamp:** 2026-02-07
**Status:** ✅ IMPLEMENTED
**Decision ID:** DECISION-021
**Depends On:** LOG-018 (Two-Phase Architecture), LOG-020 (Invisible Documentation), LOG-017 (Housekeeping Vision)
**Supersedes:** The separate `workflows/housekeeping.md` file (user will delete)

---

#### Part 1: The Problem — A Gap in Stateless-First Architecture

##### 1.1 What the User Discovered

During reconciliation of the Housekeeping Agent vision (LOG-017) against the current implementation, the user identified a critical architectural gap:

> "Right now Phase 1 is embedded as system instruction for an agent. What is our vision for which agent would do Phase 2?"

**The gap visualized:**

```mermaid
flowchart TD
    subgraph PHASE1["Phase 1: Inference + Tagging"]
        P1A["Agent Spec: agents/gsd-housekeeping.md"]
        P1B["Embedded as system instruction"]
        P1C["✅ Stateless: Fresh agent can run from spec alone"]
    end
    
    subgraph PHASE2_BEFORE["Phase 2: Archival (BEFORE)"]
        P2A["Workflow File: workflows/housekeeping.md"]
        P2B["NOT an agent spec — requires GSD-Lite routing"]
        P2C["❓ Gap: Fresh agent doesn't know this file exists"]
    end
    
    subgraph HANDOFF["The Broken Handoff"]
        H1["Phase 1 ends with:<br/>'Run housekeeping.md workflow'"]
        H2["Fresh agent asks:<br/>'What's a workflow? Where is it?'"]
    end
    
    P1A --> P1B --> P1C
    P2A --> P2B --> P2C
    P1C --> H1 --> H2
    
    style P1C fill:#d4edda,stroke:#155724
    style P2C fill:#f8d7da,stroke:#721c24
    style H2 fill:#f8d7da,stroke:#721c24
```

**Citation:** User's exact words from this session:
> "Our philosophy is stateless by design so one core pillar to reconcile here is, after Phase 1 would the artifact and Phase 2 instruction be enough that we can start a new agent 0 context and let it do the workflow Phase 2?"

##### 1.2 The Four Options Considered

| Option | Description | Stateless Score | Tradeoffs |
|--------|-------------|-----------------|-----------|
| **(A) Extend Context Gardener** | Add Phase 2 to `agents/gsd-housekeeping.md` | ⭐⭐⭐⭐⭐ | Larger instruction; one agent does everything |
| **(B) Use GSD-Lite agent** | Route to housekeeping workflow via protocol | ⭐⭐⭐⭐ | Requires GSD-Lite onboarding first |
| **(C) Create Phase 2 agent spec** | New `agents/gsd-archiver.md` | ⭐⭐⭐⭐⭐ | Agent proliferation; cleaner separation |
| **(D) Blank 0-context agent** | Vanilla Claude + artifacts + paste workflow | ⭐⭐⭐ | Tests "artifacts are enough"; no specialized onboarding |

##### 1.3 Why Option A Won

**User's directive:**
> "Yes please go for extending the housekeeping agent spec, and then I'll delete the workflow no prob."

**Rationale:**
1. **True stateless** — A single agent spec handles the full lifecycle. No handoff ambiguity.
2. **User simplicity** — "Run housekeeping agent" → done (not "run gardener, then run archiver")
3. **Token budget** — Phase 2 operations are mechanical (~500 tokens to add). Total spec is ~2500 tokens, well under 10k.
4. **Natural flow** — Phase 1 ends with tags written → Phase 2 begins immediately (same session, same context)

---

#### Part 2: What Changed — The Extended Agent Spec

##### 2.1 Before vs. After

| Aspect | Before (Phase 1 Only) | After (Full Lifecycle) |
|--------|----------------------|------------------------|
| **File** | `agents/gsd-housekeeping.md` | Same file, extended |
| **Purpose** | Infer, interview, tag | Infer, interview, tag, **archive, extract PRs** |
| **Scope** | Phase 1 only | Phase 1 + Phase 2 |
| **Handoff** | "Run housekeeping.md workflow" | Internal continuation |
| **Lines** | ~350 | ~550 |

**Citation:** `src/gsd_lite/template/agents/gsd-housekeeping.md` (full file rewritten this session)

##### 2.2 New Sections Added

| Section | Purpose | Token Estimate |
|---------|---------|----------------|
| **Phase 2A: Archive Superseded Logs** | Consume `SUPERSEDED BY:` tags from Phase 1, move to HISTORY.md | ~150 |
| **Phase 2B: PR Extraction** | Filter by Task ID, generate PR description with code snippets | ~200 |
| **Phase 2C: Archive Completed Tasks** | Move completed task entries to HISTORY.md | ~150 |
| **Phase 2D: Index Maintenance** | Update Key Events Index after archival | ~50 |
| **Common Scenarios** | Full lifecycle, PR then archive, direct archive, Phase 1 only | ~150 |

##### 2.3 Key Code Patterns (Synthesized Examples)

**Phase 2A trigger (archive superseded):**

```markdown
User: "archive superseded logs"

Agent:
  1. grep "SUPERSEDED BY:" WORK.md  # Find Phase 1 tags
  2. Present list with tokens to be freed
  3. After confirmation:
     - Move entries to HISTORY.md
     - Update Key Events Index
     - Update Current Understanding
```

**HISTORY.md format for superseded logs:**

```markdown
## Superseded Logs (Archived 2026-02-07)

### LOG-003 - Auth Options Analysis
- **Superseded By:** LOG-007 (JWT Decision)
- **Original Task:** AUTH-IMPL
- **Summary:** Explored JWT vs Session vs OAuth. JWT chosen for statelessness.
- **Why Archived:** Options analysis complete; LOG-007 is authoritative.
```

**Full lifecycle flow:**

```mermaid
sequenceDiagram
    participant U as User
    participant A as Housekeeping Agent
    participant W as WORK.md
    participant H as HISTORY.md
    
    Note over A: Phase 1 (Inference + Tagging)
    U->>A: "run housekeeping"
    A->>W: grep log headers
    A->>A: Infer supersession (Tier 1/2/3)
    A->>U: Present draft DAG
    U->>A: Confirm relationships
    A->>W: Write SUPERSEDED BY: tags
    A->>U: "Phase 1 complete. Continue to Phase 2?"
    
    Note over A: Phase 2 (Archival)
    U->>A: "yes, archive them"
    A->>W: grep SUPERSEDED BY:
    A->>H: Move superseded entries
    A->>W: Update Key Events Index
    A->>U: "Archived 3 logs, freed 2,450 tokens"
```

---

#### Part 3: The Stateless Test — Can a Fresh Agent Pick This Up?

##### 3.1 What a Fresh Agent Needs

| Requirement | How It's Met |
|-------------|--------------|
| Know Phase 2 exists | Embedded in same agent spec |
| Know how to trigger Phase 2 | Documented triggers: "archive superseded", "write PR for X", etc. |
| Know the operations | Phase 2A-2D fully documented with examples |
| Know the formats | HISTORY.md format, PR format included |
| Know the safety rules | Confirmation required for all destructive actions |

##### 3.2 The Handoff Packet (Now Internal)

**Before (broken):**
```markdown
📦 CONTEXT GARDENER HANDOFF
**Next:** Run `housekeeping.md` workflow to archive tagged entries
```

**After (stateless):**
```markdown
📦 HOUSEKEEPING HANDOFF

**Phase 1 (Tagging):**
→ Tagged: N logs marked SUPERSEDED
→ Untagged: M logs confirmed as still-valid

**Phase 2 (Archival):**
→ Archived: X logs to HISTORY.md
→ Tokens freed: Y
→ PRs extracted: [list if any]
```

A fresh agent loading this handoff + the agent spec has everything needed to continue.

---

#### Part 4: Impact on Existing Artifacts

##### 4.1 What Gets Deleted

| Artifact | Status | Reason |
|----------|--------|--------|
| `workflows/housekeeping.md` | 🗑️ **User will delete** | Functionality merged into agent spec |

##### 4.2 What Remains Valid

| Artifact | Status | Notes |
|----------|--------|-------|
| `agents/gsd-housekeeping.md` | ✅ Extended | Now handles full lifecycle |
| `workflows/discuss.md` | ✅ Unchanged | Different workflow, unaffected |
| `workflows/execution.md` | ✅ Unchanged | Different workflow, unaffected |
| `workflows/checkpoint.md` | ✅ Unchanged | Different workflow, unaffected |

##### 4.3 Protocol Routing Impact

The PROTOCOL.md workflow router currently says:

```markdown
| "housekeeping" | housekeeping.md | PR extraction, archive completed tasks |
```

**After this change:** This route should point to the agent spec instead, OR the router should clarify that "housekeeping" loads the housekeeping agent, not a workflow.

**Recommendation:** Update PROTOCOL.md to reflect:
- `agents/` = Standalone agent specs (load as system instruction)
- `workflows/` = Instructions for the GSD-Lite agent to follow

---

#### Part 5: Backlinks & Dependencies

| Log | Relationship | Summary |
|-----|--------------|---------|
| **LOG-017** | Vision | Proposed the Housekeeping Agent concept with lifecycle patterns |
| **LOG-018** | Architecture | Defined Two-Phase architecture (inference → archival) |
| **LOG-020** | Constraint | HTML comments invisible to grep-first; docs must be in agent instruction |
| **LOG-016** | Philosophy | Stateless-first architecture: every turn generates handoff |

**The dependency chain:**

```mermaid
flowchart LR
    L16["LOG-016<br/>Stateless-First"]
    L17["LOG-017<br/>Housekeeping Vision"]
    L18["LOG-018<br/>Two-Phase Architecture"]
    L20["LOG-020<br/>Invisible Documentation"]
    L21["LOG-021<br/>Unified Agent (this log)"]
    
    L16 --> L17
    L17 --> L18
    L18 --> L21
    L20 --> L21
    
    style L21 fill:#d4edda,stroke:#155724
```

---

#### Part 6: Concrete Artifact Diff

**File changed:** `src/gsd_lite/template/agents/gsd-housekeeping.md`

| Section | Change Type | Description |
|---------|-------------|-------------|
| YAML frontmatter | Modified | Updated description to "Full housekeeping lifecycle" |
| Purpose statement | Modified | Now includes archive and PR extraction |
| System header | Modified | Changed from "Phase 1: Inference + Interview" to "Full Housekeeping Lifecycle" |
| Phase 1 sections | Unchanged | All inference/tagging logic preserved |
| **Phase 2A-2D** | **Added** | Archive superseded, PR extraction, archive tasks, index maintenance |
| **Common Scenarios** | **Added** | Full lifecycle, PR then archive, direct archive, Phase 1 only |
| **Safety section** | **Added** | Confirmation requirements for all destructive actions |
| Handoff format | Modified | Now includes both Phase 1 and Phase 2 summaries |

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-021 (Unified Housekeeping Agent — this log)
→ Dependency chain: LOG-021 ← LOG-020 ← LOG-018 ← LOG-017 ← LOG-016
→ Next action: User deletes `workflows/housekeeping.md` (manual)

**Layer 2 — Global Context:**
→ Architecture: `agents/gsd-housekeeping.md` now handles full housekeeping lifecycle
→ Patterns: Stateless-first; one agent spec = complete workflow capability
→ Token state: Agent spec ~2500 tokens, well under 10k budget

**Fork paths:**
- Delete workflow → User removes `workflows/housekeeping.md`
- Update PROTOCOL.md → Reflect agent vs workflow distinction
- Test the agent → Run housekeeping on a real WORK.md
- Continue doc migration → TASK-PROTOCOL-DOCS-001

---

### [LOG-022] - [DECISION] - Removing Legacy Housekeeping References: Ensuring Agent Separation of Concerns - Task: HOUSEKEEPING-CLEANUP

**Timestamp:** 2026-02-07
**Status:** ✅ IMPLEMENTED
**Decision ID:** DECISION-022
**Depends On:** LOG-021 (Unified Housekeeping Agent)
**Supersedes:** Legacy references to `workflows/housekeeping.md`

---

#### Part 1: The Problem — Agent Confusion

##### 1.1 The Context
In LOG-021, we consolidated the housekeeping workflow into a standalone `gsd-housekeeping` agent. The original `workflows/housekeeping.md` file was deleted.

##### 1.2 The Residue
However, references to "housekeeping workflow" remained in `PROTOCOL.md`, `agents/gsd-lite.md`, `HISTORY.md`, and `workflows/progress.md`.

##### 1.3 The Risk
These references posed two risks:
1.  **Routing Confusion:** The `gsd-lite` agent might try to "route" to a non-existent workflow file instead of instructing the user to switch agents.
2.  **Scope Creep:** Instructions like "When archiving a completed task..." in `HISTORY.md` could lead the `gsd-lite` agent to believe *it* should perform archiving, violating the separation of concerns.

---

#### Part 2: The Decision — Strict Separation

**We decided to:**
1.  **Remove all routing references:** The `gsd-lite` agent does not route to housekeeping. Housekeeping is a user-initiated "meta-task" performed by a separate agent.
2.  **Scrub "housekeeping" from `gsd-lite` artifacts:** The main agent doesn't need to know the housekeeping agent exists.
3.  **Refine `HISTORY.md` instructions:** Clarified that archiving is done `(via Housekeeping Agent)`, signaling to the main agent that this is an external process.

---

#### Part 3: Concrete Changes

| File | Change | Reason |
|:-----|:-------|:-------|
| `PROTOCOL.md` | Removed housekeeping from router table | `gsd-lite` doesn't route there |
| `agents/gsd-lite.md` | Removed housekeeping from tool definitions | It's not a tool, it's an agent |
| `workflows/progress.md` | Removed housekeeping from "Next Up" | It's not a workflow state |
| `HISTORY.md` | Changed "via housekeeping workflow" to "via Housekeeping Agent" | Updates the mental model |

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-022 (this log) - Cleanup complete
→ Dependency chain: LOG-022 ← LOG-021 ← LOG-020
→ Next action: Return to TASK-PROTOCOL-DOCS-001 (Migrate artifact documentation)

**Layer 2 — Global Context:**
→ Architecture: Dual-agent model confirmed (`gsd-lite` vs `gsd-housekeeping`)
→ Patterns: Agents don't know about each other; user manages the switch
→ State: Residue references cleaned; artifacts are consistent with LOG-021

**Fork paths:**
- Resume docs migration → TASK-PROTOCOL-DOCS-001
- Test housekeeping agent → Run `gsd-housekeeping` on a sample


### [LOG-021] - [EXEC] - Migrated Artifact Docs to Agent Instruction - Task: PROTOCOL-DOCS-001
**Timestamp:** 2026-02-07 17:15
**Status:** COMPLETE
**Tasks:** TASK-PROTOCOL-DOCS-001

**Context:**
Per DECISION-020a, we migrated essential artifact documentation from HTML comments (invisible to grep-first agents) to `gsd-lite.md` agent instruction (always loaded). Also decommissioned the redundant `PROTOCOL.md` template.

**Changes:**
1. **Decommissioned PROTOCOL.md:** Deleted `src/gsd_lite/template/PROTOCOL.md`. The agent instruction at `src/gsd_lite/template/agents/gsd-lite.md` is now the single source of truth for the protocol.
2. **Updated Agent Instruction:** Added `## WORK.md Structure`, `## INBOX.md Structure`, and `## HISTORY.md Structure` sections to `src/gsd_lite/template/agents/gsd-lite.md`.
3. **Cleaned Templates:** Removed HTML comments from `src/gsd_lite/template/WORK.md`. (INBOX/HISTORY cleanup left for user per request).

**Impact:**
- **Visibility:** Fresh agents now see WORK/INBOX/HISTORY structure immediately upon reading system prompt.
- **Maintenance:** Single source of truth (gsd-lite.md), no drift between template comments and instruction.
- **Token Budget:** Added ~400 tokens to agent instruction, still well within 10k headroom.

**Next:** Implement `TASK-CI-TOKEN-001` to enforce the 10k budget in CI.

---

### [LOG-022] - [DISCOVERY] - The Missing Metadata Line: Agent Instruction Describes Format But Lacks Executable Template - Task: PROTOCOL-DOCS-001
**Timestamp:** 2026-02-07 17:45
**Status:** DISCOVERY → DECISION
**Depends On:** LOG-021 (Artifact doc migration), LOG-020 (Invisible Documentation Problem)
**Decision IDs:** DECISION-022a (Add executable templates to agent instruction)

---

#### Part 1: The Discovery — Agent Wrote Non-Compliant Entry

##### The Trigger

Immediately after completing LOG-021 (migrating artifact docs to agent instruction), user asked the agent to capture LOOP-003. The agent produced an entry that **partially violated the INBOX format spec** it had just helped write.

##### The Evidence: What Agent Wrote vs. What Spec Requires

**The Spec** (from `src/gsd_lite/template/agents/gsd-lite.md:228-232`):

```markdown
### Entry Format
- **Header:** `### [LOOP-NNN] - {{summary}} - Status: {{Open|Clarifying|Resolved}}`
- **Fields:** Created, Source, Origin (User|Agent), Context, Details, Resolution
- **Rule:** Write context-rich entries, not just titles — tell the story
```

**What Agent Actually Wrote** (LOOP-003 in `gsd-lite/INBOX.md`):

```markdown
### [LOOP-003] - Structural Regression Prevention: CI for Documentation Drift - Status: Open
**Created:** 2026-02-07 | **Source:** Post-mortem on LOG-020/LOG-021 | **Origin:** User

**Context:**
...
```

Wait — on re-reading, the agent DID include the metadata line. Let me re-check the actual file:

```mermaid
flowchart TD
    subgraph AUDIT["🔍 Compliance Audit"]
        A1["Header Format"] -->|"✅"| A1R["[LOOP-003] - Summary - Status: Open"]
        A2["Metadata Line"] -->|"❓"| A2R["Check if present"]
        A3["Context Section"] -->|"✅"| A3R["Present with full narrative"]
        A4["Details Section"] -->|"✅"| A4R["Present with tables and diagrams"]
        A5["Resolution"] -->|"✅"| A5R["_(pending)_ present"]
    end
```

##### The Real Finding: Spec Describes But Doesn't Show

The deeper issue isn't that the agent failed — it's that **the spec describes the format abstractly but doesn't provide an executable template**.

**Current spec in `gsd-lite.md:228-232`:**
```markdown
### Entry Format
- **Header:** `### [LOOP-NNN] - {{summary}} - Status: {{Open|Clarifying|Resolved}}`
- **Fields:** Created, Source, Origin (User|Agent), Context, Details, Resolution
- **Rule:** Write context-rich entries, not just titles — tell the story
```

**What's missing:** A concrete, copy-paste-ready template that shows the EXACT structure:

```markdown
### [LOOP-NNN] - {{one-line summary}} - Status: Open
**Created:** YYYY-MM-DD | **Source:** {{task/context}} | **Origin:** User|Agent

**Context:**
{{Why this loop exists — the situation that triggered it}}

**Details:**
{{Specific question/concern with code references}}

**Resolution:** _(pending)_
```

##### Why This Matters: The Template-Instruction Gap

```mermaid
flowchart LR
    subgraph CURRENT["Current State"]
        C1["gsd-lite.md<br/>Describes format abstractly"]
        C2["INBOX.md template<br/>Has EXAMPLE-LOOP-NNN entries"]
        C3["Agent reads gsd-lite.md<br/>Never sees examples"]
    end
    
    subgraph PROBLEM["The Gap"]
        P1["Abstract description<br/>≠<br/>Executable template"]
    end
    
    subgraph RESULT["Outcome"]
        R1["Agent interprets spec<br/>May miss fields"]
        R2["Inconsistent entries<br/>Harder to grep/audit"]
    end
    
    C1 --> P1
    C2 -->|"grep skips EXAMPLE-"| P1
    P1 --> R1
    R1 --> R2
    
    style PROBLEM fill:#fff3cd,stroke:#856404
    style RESULT fill:#f8d7da,stroke:#721c24
```

The template file (`src/gsd_lite/template/INBOX.md`) contains rich examples like `[EXAMPLE-LOOP-001]`, but:
1. Agents grep `^### \[LOOP-` which **skips** `EXAMPLE-LOOP-` entries (see LOG-020, LOOP-002)
2. The agent instruction describes format but doesn't include a copy-paste template
3. Result: Agent must interpret abstract description → inconsistent output

---

#### Part 2: The Pattern — This Affects All Artifact Formats

##### Audit of Current Agent Instruction Sections

| Section | Has Description | Has Executable Template | Gap |
|---------|-----------------|------------------------|-----|
| `## WORK.md Structure` | ✅ Describes 3 sections | ❌ No log entry template | **YES** |
| `## INBOX.md Structure` | ✅ Describes fields | ❌ No loop entry template | **YES** |
| `## HISTORY.md Structure` | ✅ Describes table format | ✅ Shows table example | No |

**Citations:**
- WORK.md Structure: `src/gsd_lite/template/agents/gsd-lite.md:188-219`
- INBOX.md Structure: `src/gsd_lite/template/agents/gsd-lite.md:221-244`
- HISTORY.md Structure: `src/gsd_lite/template/agents/gsd-lite.md:246-264`

##### What Needs Executable Templates

1. **WORK.md Log Entry Template:**
```markdown
### [LOG-NNN] - [TYPE] - {{one-line summary}} - Task: TASK-ID
**Timestamp:** YYYY-MM-DD HH:MM
**Status:** {{status if applicable}}
**Depends On:** {{LOG-XXX (brief description), LOG-YYY (brief description)}}

**Context:**
{{Why this log exists — what triggered it}}

**Details:**
{{Full narrative with code snippets for EXEC/DISCOVERY}}

**Next:** {{Immediate next action}}
```

2. **INBOX.md Loop Entry Template:**
```markdown
### [LOOP-NNN] - {{one-line summary}} - Status: Open
**Created:** YYYY-MM-DD | **Source:** {{task/context}} | **Origin:** User|Agent

**Context:**
{{Why this loop exists — the situation that triggered it}}

**Details:**
{{Specific question/concern with code references}}

**Resolution:** _(pending)_
```

---

#### Part 3: The Decision — Embed Executable Templates in Agent Instruction

##### DECISION-022a: Add Executable Templates to gsd-lite.md

**What:** Enhance each artifact structure section with a copy-paste-ready template block.

**Why:**
1. **Removes interpretation burden** — Agent copies template, fills placeholders
2. **Guarantees field presence** — Template includes all required fields
3. **Enables auditing** — Reviewers can compare entry against template
4. **Compensates for invisible examples** — Templates are visible even though EXAMPLE-NNN entries are not

**Trade-off accepted:** Adds ~200 tokens to agent instruction. Budget impact: ~6,163 + 200 = ~6,363 tokens, still under 10k headroom.

**Implementation:**
- Add template block under each "Entry Format" subsection
- Use `{{placeholder}}` syntax for variable parts
- Include all required fields with inline comments

---

#### Part 4: Relationship to Other Findings

| Log/Loop | Relationship | Summary |
|----------|--------------|---------|
| LOG-020 | Parent discovery | HTML comments invisible to grep-first agents |
| LOG-021 | Immediate predecessor | Migrated docs to agent instruction, but missed templates |
| LOOP-002 | Same root cause | EXAMPLE-NNN entries invisible to grep patterns |
| LOOP-003 | Sibling concern | How to prevent structural regression via CI |

---

#### Part 5: Immediate Next Action

| Task ID | Description | Priority |
|---------|-------------|----------|
| TASK-PROTOCOL-DOCS-002 | Add executable templates to gsd-lite.md artifact sections | High |

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-022 (Discovery: Missing executable templates in agent instruction)
→ Dependency chain: LOG-022 ← LOG-021 ← LOG-020 ← LOG-019
→ Next action: Implement TASK-PROTOCOL-DOCS-002 (add templates to gsd-lite.md)

**Layer 2 — Global Context:**
→ Architecture: Single source of truth at `src/gsd_lite/template/agents/gsd-lite.md`
→ Patterns: Grep-first file reading, 10k token budget, invisible EXAMPLE-NNN entries
→ Decision: DECISION-022a — embed executable templates

**Fork paths:**
- Execute template addition → TASK-PROTOCOL-DOCS-002
- Discuss CI framework → Continue LOOP-003
- Fix LOOP-003 metadata → Correct existing entry

---

### [LOG-023] - [EXEC] - Added Executable Templates to Agent Instruction - Task: PROTOCOL-DOCS-002
**Timestamp:** 2026-02-07 18:00
**Status:** COMPLETE
**Depends On:** LOG-022 (Discovery: Missing templates), DECISION-022a (Add templates to gsd-lite.md)

**Context:**
Per DECISION-022a, we added copy-paste-ready templates to the agent instruction so agents don't have to interpret abstract format descriptions.

**Changes:**

| Section | What Was Added | Location |
|---------|----------------|----------|
| `## WORK.md Structure` | Log Entry Template with field requirements | `src/gsd_lite/template/agents/gsd-lite.md:216-250` |
| `## INBOX.md Structure` | Loop Entry Template with field requirements | `src/gsd_lite/template/agents/gsd-lite.md:270-295` |

**Template Features:**
- Copy-paste ready markdown blocks
- `{{placeholder}}` syntax for variable parts
- Field requirements table explaining each field
- Includes stateless handoff structure for logs

**Impact:**
- Agents can now copy template and fill placeholders
- All required fields are visible in template (no interpretation needed)
- Enables auditing: compare entry against template
- Token cost: ~200 tokens added, still well under 10k budget

**Next:** Continue LOOP-003 discussion (CI framework for structural regression prevention)


### [LOG-025] - [DECISION] - Housekeeping Tooling Spec: Upgrading Context Map for Agent Consumption (GSD-Lite Mode) - Task: TOOLING-002

**Timestamp:** 2026-02-07
**Status:** ✅ SPECIFICATION LOCKED
**Depends On:** LOG-015 (Context Map Tool), LOG-021 (Housekeeping Agent Vision)
**Decision IDs:** DECISION-025a (JSON Output), DECISION-025b (Semantic Signal Tiering)

---

#### Part 1: The Narrative — From Human-Readable to Agent-Native

**The Context (Inlined):**
- **The Existing Tool (LOG-015):** We have a script `analyze_context.py` that parses Markdown files using `markdown-it-py` and `tiktoken`. It currently generates a human-readable Markdown "map" of the file structure (headers, line numbers, token counts) to help agents navigate large files without reading them entirely.
- **The New Requirement (LOG-021):** We are building a "Housekeeping Agent" responsible for scanning session logs, inferring which decisions have been superseded (e.g., "Decision A replaced by Decision B"), and interviewing the user to confirm archival.

**The Gap:**
The Housekeeping Agent needs **structured data** (JSON) to infer relationships programmatically. The current tool only outputs unstructured Markdown text. This forces the agent to burn tokens parsing the very map intended to *save* tokens.

**The Solution:**
We are upgrading `analyze_context.py` to be a **first-class GSD-Lite citizen**. It will gain a `--gsd-lite` mode that:
1.  Outputs **machine-readable JSON**.
2.  Detects **semantic signals** (like strikethrough titles `~~Title~~` or `SUPERSEDED BY:` tags) deterministically using regex.
3.  Handles the messy reality of **Task naming** (extracting `Task: MODEL-A` vs `Task: TASK-001`) without crashing.

**The Architecture Shift:**

```mermaid
flowchart TD
    subgraph "Current State (Human-Readable)"
        A[WORK.md] -->|Markdown Parser| B(Markdown Map)
        B -->|Agent reads text| C{Agent Parsing}
        C -->|High Token Cost| D[Inference]
    end

    subgraph "New State (Machine-Readable)"
        E[WORK.md] -->|GSD-Lite Mode| F(JSON Object)
        F -->|Direct Load| G{Agent Logic}
        G -->|Zero Parsing Cost| H[Inference]
        
        subgraph "Tool Logic (Deterministic)"
            I[Task Extraction]
            J[Signal Detection]
            K[Token Counting]
        end
        
        I & J & K --> F
    end
    
    style B fill:#ffcccc,stroke:#333
    style F fill:#ccffcc,stroke:#333
```

---

#### Part 2: The Research — Semantic Signal Tiering

We investigated how to detect "supersession" (when one log makes another obsolete) without running an expensive LLM. The research revealed a **Graduated Tier System**:

| Tier | Detection Method | Tool Responsibility | Why This Split |
|------|------------------|---------------------|----------------|
| **Tier 1 (HIGH)** | Regex/keyword | `analyze_context.py` | Deterministic, zero ambiguity (e.g., `~~Title~~`) |
| **Tier 2 (MEDIUM)** | Pattern matching | `analyze_context.py` (flags) | Needs human context (e.g., `Depends On:`) |
| **Tier 3 (LOW)** | Semantic reasoning | Agent only | Requires deep understanding (e.g., "This approach failed") |

**Key Decision:** The tool will **FLAG** Tier 1 and 2 signals but **NEVER DECIDE**. It provides evidence; the agent/user provides judgment.

---

#### Part 3: The Specification Packet (For Remote Builder Agent)

> **Context for Builder:** This spec defines the upgrade for `analyze_context.py`. The goal is to make it the deterministic "eyes" for the Housekeeping Agent. The agent is a specialized LLM workflow that reads session logs and archives old content.

##### 1. CLI Interface & Defaults

**Command:**
```bash
# Default GSD-Lite Mode (targets gsd-lite/WORK.md, outputs JSON)
analyze_context --gsd-lite --work --format json

# Explicit Path
analyze_context --gsd-lite --work ./custom/WORK.md
```

**New Arguments:**
- `--gsd-lite`: Enables GSD-specific parsing (Task IDs, Log IDs, Signals).
- `--work`: Sets default path to `gsd-lite/WORK.md` (or specific path if provided).
- `--format`: Options `md` (default), `json` (new requirement), `table`.

##### 2. JSON Output Schema (Requirement)

```json
{
  "summary": {
    "total_tokens": 65420,
    "total_logs": 24,
    "tier_1_flags": 3
  },
  "logs": [
    {
      "log_id": "LOG-018",
      "type": "DECISION",
      "task": "HOUSEKEEPING-AGENT",  // Extracted from header only
      "tokens": 1200,
      "lines": [3213, 3287],
      "signals": {
        "tier_1": ["strikethrough: ~~Pivot to Public Data~~"],
        "tier_2": ["depends_on: LOG-017", "pivot: pivoted"]
      }
    },
    {
      "log_id": "LOG-024",
      "type": "DECISION",
      "task": "PHASE-002",
      "tokens": 800,
      "lines": [3400, 3450],
      "signals": {
        "tier_1": [],
        "tier_2": []
      }
    }
  ]
}
```

##### 3. Parsing Logic (Regex Specs)

**A. Log Header Parsing**
*Goal: Permissive extraction. Do not enforce `TASK-NNN`. Capture `MODEL-A`.*
*Pattern:* `^### \[LOG-(\d+)\]\s*-\s*\[([A-Z]+)\]\s*-\s*(.*?)\s*-\s*Task:\s*([A-Z][A-Za-z0-9_-]+)`

**B. Semantic Signal Detection (The "Brain" Upgrade)**
*Goal: Detect supersession markers in header AND body.*

**Tier 1 Patterns (High Confidence - Auto-Flag):**
```python
TIER_1_PATTERNS = {
    "strikethrough": r"~~[^~]+~~",                 # Title strikethrough
    "superseded_by": r"SUPERSEDED\s*BY[:\s]+LOG-\d+", # Explicit tag
    "deprecated_tag": r"\[DEPRECATED\]|\[OBSOLETE\]|\[ARCHIVED\]",
    "do_not_follow": r"[Dd]o\s*[Nn][Oo][Tt]\s*follow",
    "status_obsolete": r"[Ss]tatus[:\s]*(obsolete|deprecated|superseded|abandoned)",
    "killed": r"\b(killed|scrapped|abandoned|discarded)\b"
}
```

**Tier 2 Patterns (Medium Confidence - Flag for Review):**
```python
TIER_2_PATTERNS = {
    "depends_on": r"[Dd]epends\s*[Oo]n[:\s]*(LOG-\d+)",
    "supersedes": r"\b(supersedes?|superseding)\b",
    "replaces": r"\b(replaces?|replacing)\b",
    "pivot": r"\b(pivot(ed|ing)?|pivotal)\b",
    "hit_wall": r"hit\s*(a\s*)?(wall|dead\s*end|roadblock)",
    "decided_not_to": r"decided\s*(not\s*to|against)",
    "options_evaluated": r"[Oo]ption\s*[A-Z1-9][:\s]"
}
```

##### 4. Validation & Constraints

1.  **Header-Anchored Task ID:** Only extract `Task:` from the log header line. Do NOT scan body for `Task:` to avoid false positives (e.g., "We discussed Task: AUTH").
2.  **No HEAD/TAIL in JSON:** The JSON output should NOT include preview text (noise). Agents use `read_files(lines=[start, end])` for that.
3.  **Dependencies:** Keep it lightweight. `re` (standard lib), `tiktoken`, `markdown-it-py`. No `spaCy` or NLP libraries.

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-025 (Decision + Spec for Tooling)
→ Dependency chain: LOG-025 ← LOG-015 (Tool) ← LOG-021 (Agent)
→ Next action: Implement the spec in `analyze_context.py` (or handoff to builder agent)

**Layer 2 — Global Context:**
→ Architecture: GSD-Lite tooling (LOG-015)
→ Patterns: Deterministic tool + Semantic Agent (LOG-018)

**Fork paths:**
- Build tool: `python3 analyze_context.py --gsd-lite` implementation
- Discuss: Refine regex patterns

### [LOG-026] - [DECISION] - The Quine Paradox: Fixing False Positives in Self-Referential Tooling Specs - Task: TOOLING-002

**Timestamp:** 2026-02-07
**Status:** ✅ SPECIFICATION AMENDED
**Depends On:** LOG-025 (Original Spec), LOG-015 (Context Map Tool)
**Decision IDs:** DECISION-026 (Context-Aware Exclusion Strategy)

---

#### Part 1: The Narrative — The "Quine" Problem

**The Context (Inlined):**
- **The Spec (LOG-025):** We defined a tool to detect "semantic signals" like `~~strikethrough titles~~` or `SUPERSEDED BY:` tags to identify obsolete logs.
- **The Paradox:** To write the spec, we had to write down the very patterns the tool is supposed to detect.
- **The Result:** The specification itself (LOG-025) is now flagged by the tool as "superseded" because it contains 4+ instances of the "superseded" pattern in its examples and regex definitions.

**The Evidence (Grep Analysis):**
We ran a grep on `WORK.md` and found the tool cannot distinguish between *using* a signal and *mentioning* it.

| Line | Content | Type | Verdict |
|------|---------|------|---------|
| **L3108** | `### [LOG-018] ... ~~Pivot to Public Data~~ ...` | **Signal** | ✅ TRUE POSITIVE (Real Supersession) |
| **L4265** | `(like strikethrough titles ~~Title~~ or ...)` | **Noise** | ❌ FALSE POSITIVE (Documentation Example) |
| **L4349** | `"tier_1": ["strikethrough: ~~Pivot...~~"],` | **Noise** | ❌ FALSE POSITIVE (JSON Example in Spec) |
| **L4381** | `r"SUPERSEDED\s*BY[:\s]+LOG-\d+"` | **Noise** | ❌ FALSE POSITIVE (Regex Definition) |

> **Concept:** This is a "Quine Paradox" in static analysis — when the code (or documentation) describing a pattern contains the pattern itself.

---

#### Part 2: The Research — Exclusion Strategies

We researched how established static analysis tools (ESLint, Pylint, SonarQube) handle this "documentation vs. code" problem.

| Strategy | Description | Pros | Cons |
|----------|-------------|------|------|
| **1. Structural Anchoring** | Restrict matches to specific locations (e.g., "Only in Headers"). | Simple, fast. | Brittle. Misses signals in body text (e.g., "Status: Superseded"). |
| **2. Inline Suppression** | Use comments to ignore lines (e.g., `// pylint: disable`). | Explicit control. | Pollutes docs ("noise"), requires maintenance. |
| **3. Context-Aware Exclusion** | parse syntax to identify "safe zones" (Code Blocks, Inline Code). | Robust, handles any content. | Higher complexity (requires parsing/masking). |

**The Decision (DECISION-026):**
We will adopt a **Hybrid Approach**:
1.  **Context-Aware Exclusion (Primary):** The tool MUST ignore all content inside Fenced Code Blocks (` ```...``` `) and Inline Code (`` `...` ``).
2.  **Structural Anchoring (Secondary):** Certain signals (like `~~Title~~`) are ONLY valid in specific locations (Header Lines).

---

#### Part 3: The Architecture — Masking Pipeline

We are upgrading the parsing logic from "Regex on Raw Text" to a "Mask -> Scan -> Unmask" pipeline.

```mermaid
flowchart TD
    A[Raw Log Content] -->|Step 1: Mask Safe Zones| B(Masked Content)
    B -->|Step 2: Apply Regex Patterns| C{Signal Detection}
    C -->|Match Found| D[Record Signal]
    C -->|No Match| E[Ignore]
    
    subgraph "Safe Zones (Ignored)"
        F[Fenced Code Blocks]
        G[Inline Code `...`]
        H[Blockquotes > ...]
    end
    
    subgraph "Masking Logic"
        I[Replace Code with <PLACEHOLDER>]
        J[Keep Line Numbers Intact]
    end
    
    F & G & H --> I
    I --> B
```

---

#### Part 4: The Specification Amendment (Python Implementation)

> **Requirement for Builder Agent:** The `analyze_context.py` tool must implement this `detect_signals` logic to prevent false positives in documentation.

**1. The Masking Logic (Python Pseudocode):**

```python
import re

def mask_exclusion_zones(text):
    """
    Replaces code blocks with placeholders to prevent regex matching on examples.
    Crucial: Preserves newlines so line numbers remain accurate.
    """
    placeholders = []
    
    def replacer(match):
        content = match.group(0)
        placeholders.append(content)
        # Replace with safe string, keeping newlines for line counts
        return f"__MASKED_CODE_BLOCK_{len(placeholders)-1}__" + ("\n" * content.count("\n"))

    # 1. Mask Fenced Code Blocks (```...```)
    # Pattern: Triple backticks, optional language, content, triple backticks
    text = re.sub(r"```[\s\S]*?```", replacer, text)
    
    # 2. Mask Inline Code (`...`)
    # Pattern: Single backtick, non-backtick content, single backtick
    text = re.sub(r"`[^`\n]+`", replacer, text)
    
    return text
```

**2. The Detection Logic (Updated from LOG-025):**

```python
def detect_signals(log_content):
    # Step 1: Mask the content
    masked_text = mask_exclusion_zones(log_content)
    lines = masked_text.split('\n')
    
    signals = []
    
    for i, line in enumerate(lines):
        # Step 2: Apply Anchored Patterns
        
        # A. Header-Only Signals (Strict)
        if line.startswith("### [LOG-"):
            if "~~" in line:  # Simple check first
                 if re.search(r"~~[^~]+~~", line):
                     signals.append({"line": i+1, "type": "strikethrough", "tier": 1})
            
            if "SUPERSEDED" in line:
                 if re.search(r"SUPERSEDED\s*BY[:\s]+LOG-\d+", line):
                     signals.append({"line": i+1, "type": "superseded_by", "tier": 1})

        # B. Body Signals (Permissive but Masked)
        # Note: 'line' here has code blocks replaced with __MASKED__
        if "[DEPRECATED]" in line or "[OBSOLETE]" in line:
            signals.append({"line": i+1, "type": "deprecated_tag", "tier": 1})
            
    return signals
```

**3. Verification Case (The "Quine" Test):**

| Input Content | Masked View | Regex Result | Correct? |
|---------------|-------------|--------------|----------|
| `### ... ~~Title~~` | `### ... ~~Title~~` | **MATCH** | ✅ YES |
| `Use ~~strikethrough~~` | `Use ` `__MASKED__` | **NO MATCH** | ✅ YES |
| `regex = r"~~"` | `regex = ` `__MASKED__` | **NO MATCH** | ✅ YES |

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-026 (Fixing False Positives in Spec)
→ Dependency chain: LOG-026 ← LOG-025 (Original Spec) ← LOG-015 (Tool)
→ Next action: Implement `analyze_context.py` with this masking logic.

**Layer 2 — Global Context:**
→ Architecture: GSD-Lite Tooling (LOG-015)
→ Patterns: Context-Aware Static Analysis (LOG-026)

**Fork paths:**
- Build tool: `python3 analyze_context.py --gsd-lite` with masking
- Discuss: Expand "Safe Zones" to Blockquotes?

---

### [LOG-027] - [EXEC] - Implemented Quine-Resistant Housekeeping Tool & Stateless Agent Router - Task: TOOLING-002

**Timestamp:** 2026-02-07
**Status:** ✅ COMPLETE
**Depends On:** LOG-026 (Quine Fix), LOG-025 (Tool Spec)
**Decision IDs:** DECISION-027 (Stateless Phase Detection)

---

#### Part 1: The Tool Implementation — Solving the Quine Paradox

We implemented the masking pipeline defined in **LOG-026**. The new tool `gsd_lite_analyzer.py` successfully masks code blocks and inline code before scanning for signals.

**Key Implementation Detail: Newline-Preserving Masking**

To ensure line numbers in the JSON output match the original file (critical for agent navigation), the masking logic preserves newlines inside masked blocks:

```python
# From src/fs_mcp/gsd_lite_analyzer.py
def mask_exclusion_zones(text: str) -> tuple[str, list[str]]:
    """
    Replaces code blocks with placeholders.
    Crucially: Preserves newlines so line numbers remain accurate.
    """
    placeholders = []
    
    def create_placeholder(match: re.Match) -> str:
        content = match.group(0)
        placeholders.append(content)
        # Replace with safe string + original newlines
        placeholder = f"__MASKED_{len(placeholders)-1}__"
        newline_count = content.count("\n")
        return placeholder + ("\n" * newline_count)
    
    # 1. Mask Fenced Code Blocks (```...```)
    text = re.sub(r"```[\s\S]*?```", create_placeholder, text)
    
    # 2. Mask Inline Code (`...`)
    text = re.sub(r"`[^`\n]+`", create_placeholder, text)
    
    return text, placeholders
```

**Verification Results (Dogfood Test):**
We ran the tool on this very `WORK.md` file (which contains LOG-025 and LOG-026 with many "false positive" patterns).

| Metric | Result | Meaning |
|--------|--------|---------|
| Total Logs | 29 | Correct |
| LOG-025 False Positives | **0** | ✅ Tool ignored the regex patterns in code blocks |
| LOG-026 False Positives | **0** | ✅ Tool ignored the examples in tables/code |
| LOG-018 Detection | **Success** | ✅ Correctly flagged `~~Pivot...~~` as Tier 1 |

---

#### Part 2: The Agent Instruction — Stateless Phase Router

We embedded the tool directly into `gsd-housekeeping.md` and implemented a **Stateless Router** that detects Phase 1 vs Phase 2 based on artifact state alone.

**The Logic Flow:**

```mermaid
flowchart TD
    Start["User says 'go'"] --> Tool[Run analyze_gsd_work_log]
    Tool --> Check{Check Output}
    
    Check -->|Tier 1 Flags + NO Header Tags| P1[Phase 1: Inference]
    Check -->|Existing SUPERSEDED Tags| P2[Phase 2: Archival]
    Check -->|No Flags/Tags| Clean[Report Clean]
    
    P1 --> Interview[Interview & Write Tags]
    P2 --> Archive[Confirm & Archive]
```

**The Implementation (in `gsd-housekeeping.md`):**

```markdown
## Session Start (Stateless Router)

**User says "go" → I detect phase from artifact state:**

1. **Read PROJECT.md** — Get domain vocabulary
2. **Run `analyze_gsd_work_log("gsd-lite/WORK.md")`** — Get signal analysis
3. **Detect phase from tool output:**

| Condition | Phase | Action |
|-----------|-------|--------|
| Tier 1 flags exist, NO `SUPERSEDED BY:` tags in headers | **Phase 1** | Interview → Write tags |
| `SUPERSEDED BY:` tags already in headers | **Phase 2** | Confirm → Archive |
| No flags, no tags | **Clean** | Report "Nothing to housekeep" |
```

**Why this matters:** A user can spin up the housekeeping agent at *any* point. If they ran Phase 1 yesterday (tags written) and resume today, the agent automatically recognizes Phase 2 is needed. No "handoff memory" required — the state is in the artifact.

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-027 (Implementation & Validation)
→ Dependency chain: LOG-027 ← LOG-026 (Quine Fix) ← LOG-025 (Tool Spec)
→ Next action: Use the housekeeping agent to clean up superseded logs (Phase 1).

**Layer 2 — Global Context:**
→ Architecture: GSD-Lite Tooling (LOG-015)
→ Patterns: Stateless Router (LOG-027), Quine-Resistant Analysis (LOG-026)

**Fork paths:**
- Run Housekeeping: `gsd-housekeeping.md` workflow
- Execute Task: Pick up next item from `parked_tasks`

### [LOG-028] - [DISCOVERY] - CI Framework Design: Constitutional Knowledge for Regression Prevention - Task: CI-FRAMEWORK-001

**Timestamp:** 2026-02-08
**Status:** IN_PROGRESS → CHECKPOINT
**Depends On:** LOG-020 (10k token budget as CI gate), LOG-016 (Stateless-First Architecture), LOG-017 (Housekeeping Agent vision)
**Decision IDs:** DECISION-028a (Constitution-first approach), DECISION-028b (Three-layer CI architecture)

---

#### Part 1: The Problem — 12 PRs with Zero Automated Checks

GSD-Lite has evolved through 12 closed PRs with no regression protection. Every change relied on "trust me bro" discussions between human and agent across gsd-lite sessions.

**Why this worked initially:** Everything was experimental. The framework was finding its shape.

**Why it's now a problem:** The user has grown to depend on GSD-Lite across multiple production projects. The framework's complexity now exceeds one person's mental model:

| Component | Count | Purpose |
|-----------|-------|---------|
| Agents | 2 | `gsd-lite.md` (root), `gsd-housekeeping.md` (context gardener) |
| Workflows | 6 | discuss, execution, checkpoint, map-codebase, new-project, progress |
| Artifacts | 5 | WORK.md, INBOX.md, HISTORY.md, PROJECT.md, ARCHITECTURE.md |
| References | 1 | questioning.md (Socratic pair programming DNA) |

**The recursive problem:** To discuss a new iteration, the user needs a gsd-lite agent to consume the context. Control has drifted to the agent itself — violating the "Driver owns, Navigator proposes" philosophy.

**Source:** User braindump session 2026-02-08, GitHub repo scan of [luutuankiet/gsd-lite](https://github.com/luutuankiet/gsd-lite) (12 closed PRs at time of writing).

---

#### Part 2: The Solution — Constitutional Knowledge

Instead of trying to test every possible agent behavior, we distill GSD-Lite's **immutable pillars** into a machine-auditable document: the Constitution.

**The Constitution Concept:**

```mermaid
graph TD
    subgraph "What Can Change"
        W[Workflows] 
        E[Examples]
        A[Artifact Templates]
    end
    
    subgraph "What Cannot Change"
        C[Constitution<br/>~500 lines<br/>Immutable Pillars]
    end
    
    W -->|Must comply with| C
    E -->|Must comply with| C
    A -->|Must comply with| C
    
    subgraph "CI Pipeline"
        L1[L1: Structural<br/>grep patterns]
        L2[L2: Constitutional<br/>LLM-as-judge]
        L3[L3: Behavioral<br/>Golden tests]
    end
    
    C --> L2
    L1 --> L2 --> L3
```

**Why Constitution-first:**
- Single source of truth for "what makes GSD-Lite GSD-Lite"
- LLM-as-judge can evaluate any artifact against it
- Human-readable contract for contributors
- Decouples philosophy (stable) from implementation (evolving)

**Decision:** DECISION-028a — Adopt Constitution-first approach for CI. All other artifacts can drift as long as they don't violate the Constitution.

---

#### Part 3: The Six Pillars (Draft Constitution)

Based on braindump synthesis and echo-back verification with user:

##### Pillar 1: Stateless-First
> Every agent turn generates a handoff packet enabling zero-context resume.

**Test:** Structural grep for `📦 STATELESS HANDOFF` with required components:
- Layer 1 (Local Context) — task dependency chain
- Layer 2 (Global Context) — from Key Events Index
- Fork paths — minimum 2 (continue + pivot)

**Gate:** Hard fail if missing from agent response template.

**Backlink:** See LOG-016 (Stateless-First Architecture) for the full specification and Two-Layer Handoff Structure.

##### Pillar 2: Context Engineering
> Optimize token budget: ~10k static (agent + workflow), ~10-20k JIT (artifacts), ~30k first turn, ~80k session ceiling.

**Tests:**
1. Token count on `agents/*.md` + loaded workflow — soft warn if exceeds 10k
2. Dead code detection: examples in artifact templates that agents never grep

**The Artifact Template Question:** Current artifact templates (e.g., `template/WORK.md`) contain HTML comments and examples. Given agents use grep-first strategy and enter via `gsd-lite.md`, do they ever read these examples?

**Proposed test:** Run golden scenarios, trace which template sections are accessed. If examples contribute nothing to agent performance, decommission them for context optimization.

**Gate:** Soft warn, human reviews.

**Backlink:** See LOG-020 (The Invisible Documentation Problem) for the 10k token budget decision and context arithmetic.

##### Pillar 3: Pair Programming Model
> Agent = Navigator (proposes, challenges, teaches). User = Driver (decides, owns). Never auto-execute.

**Behavioral markers:**
- **Grounding Loop:** Search → Echo → Verify → Execute (never skip Echo/Verify)
- **Challenge Tone:** Agent probes vague answers using protocol from `references/questioning.md`
- **No auto-writing:** Agent asks "Want me to capture this?" before artifact writes

**Example (what violation looks like):**

```markdown
❌ VIOLATION: Eager Executor
User: "Add dark mode"
Agent: *immediately starts implementing*

✅ COMPLIANT: Grounding Loop
User: "Add dark mode"
Agent: "Why dark mode? User preference? Accessibility? Battery saving? 
        This affects the approach. [YOUR TURN]"
```

**Gate:** LLM-as-judge rubric against Constitution.

##### Pillar 4: Journalism Quality (with DRY Backlinks)
> Logs include narrative framing, code snippets, analogies — but stay DRY via one-liner backlinks.

**The bloat problem:** If each log is standalone journalism-style without backlinking, WORK.md becomes bloated with repeated context.

**Solution:** Logs should include one-liner backlinks to prior logs instead of repeating context:

```markdown
✅ DRY Pattern:
**Depends On:** LOG-020 (10k token budget decision)
See LOG-016 (Stateless-First) for the Two-Layer Handoff specification.

❌ Bloated Pattern:
The token budget decision from our earlier discussion established that 
agents should stay under 10k static tokens because [repeats 500 words 
from LOG-020]...
```

**Rubric for LLM-as-judge:**
- [ ] Has narrative framing (not just bullet points)?
- [ ] Includes WHY, not just WHAT?
- [ ] Code snippets where implementation matters?
- [ ] Uses backlinks instead of repeating context?
- [ ] Standalone readable at the summary level?

**Gate:** LLM-as-judge with scoring threshold.

##### Pillar 5: Template Example Coverage
> Examples in artifact templates must be exercised by agents, or decommissioned.

**Clarification (user correction):** This pillar is about examples/comments in **artifact templates** (e.g., `template/WORK.md`, `template/INBOX.md`), NOT agent instruction files.

**The hypothesis:** Agents enter via `gsd-lite.md` and use grep-first strategy. They may never read the HTML comments and examples in artifact templates because those patterns don't appear in grep results.

**Test design:**
1. Run golden test scenarios
2. Track which artifact template sections agents access
3. If examples are never accessed AND removing them doesn't degrade agent performance → decommission

**This is context engineering optimization** — every token saved in templates is headroom for actual work.

**Gate:** Soft warn for unused examples, recommend decommission.

##### Pillar 6: Behavioral Alignment
> Agent follows Universal Onboarding, respects mode routing, produces expected outputs for canonical scenarios.

**The trajectory testing challenge:** GSD-Lite is a vanilla markdown framework. Users spawn agents via OpenCode — we don't collect telemetry or traces.

**Proposed approach (per Google ADK eval pattern):**
1. Define **golden test set**: input scenarios with expected trajectory assertions
2. Run agent against scenarios, capture outputs
3. LLM-as-judge evaluates: did agent follow expected path?

**Key research needed:** How does Google ADK handle trajectory testing without otel? Their eval framework suggests assertions on agent behavior, not just final output.

**Sources for research:**
- [Google ADK Evaluate Docs](https://google.github.io/adk-docs/evaluate/) — trajectory evaluation patterns
- [Google Cloud ADK Eval Video](https://www.youtube.com/watch?v=WZZLtwnZ4w0) — practical walkthrough
- [HuggingFace Upskill](https://github.com/huggingface/upskill) — skill generation + eval framework

**Gate:** Pass rate threshold on golden tests.

---

#### Part 4: Three-Layer CI Architecture

**Decision:** DECISION-028b — Implement CI in three layers, ordered by cost:

```mermaid
graph TD
    subgraph "Layer 1: Structural - Free"
        L1A[Token budget check<br/>agents less than 10k tokens]
        L1B[Handoff grep<br/>STATELESS HANDOFF present]
        L1C[Orphan detection<br/>no dead artifact refs]
    end
    
    subgraph "Layer 2: Constitutional - ~50k tokens"
        L2A[LLM-as-judge<br/>evaluates against Constitution]
        L2B[Drift detection<br/>flags philosophy violations]
    end
    
    subgraph "Layer 3: Behavioral - ~500k-1M tokens"
        L3A[Golden test scenarios]
        L3B[Trajectory assertions]
        L3C[Journalism quality rubric]
    end
    
    PR[PR Opened] --> L1A
    L1A --> L1B --> L1C
    L1C -->|Pass| L2A
    L2A --> L2B
    L2B -->|Pass| L3A
    L3A --> L3B --> L3C
    L3C -->|Pass| Merge[Ready to Merge]
    
    L1C -->|Fail| Block1[Hard Block]
    L2B -->|Fail| Review[Human Review]
    L3C -->|Fail| Review
```

**Budget allocation (per PR, ~1M tokens max):**

| Layer | Token Cost | What It Catches |
|-------|------------|-----------------|
| L1 | ~0 | Obvious structural breaks (missing handoff, over budget) |
| L2 | ~50k | Philosophy drift (violates Constitution pillars) |
| L3 | ~500k-1M | Behavioral regression (agent doesn't follow expected path) |

---

#### Part 5: Open Research Questions

Before implementation, these need grounding:

| ID | Question | Why It Matters | Research Target |
|----|----------|----------------|-----------------|
| RQ-1 | **Trajectory testing without telemetry** | We can't trace tool calls in vanilla gsd-lite | Google ADK eval docs, Upskill test format |
| RQ-2 | **Constitution format** | JSON schema? Markdown rubric? Executable assertions? | Industry meta-prompting frameworks |
| RQ-3 | **SKILLS.md vs current architecture** | Is Upskill's skill pattern additive or premature for gsd-lite? | Maturity assessment needed |
| RQ-4 | **Golden test set design** | What scenarios cover the 6 pillars? How many per pillar? | Eval dataset design patterns |
| RQ-5 | **LLM-as-judge reliability** | Which model? How to calibrate? False positive rates? | Agent eval benchmarks |

**User guidance on RQ-3:** Focus on maturing current architecture with proper checks and Constitution before adopting new patterns like SKILLS.md. Avoid reinventing wheels or jumping to next hype prematurely.

---

#### Part 6: Scoping Decisions

**Distribution scope:** OpenCode agents only. Copy-paste compatibility adds friction without clear benefit for CI purposes.

**Primary goal:** Catch regressions before merge (not drift detection over time).

**Budget constraint:** ~1M tokens per PR (personal project).

---

#### Part 7: Proposed Next Steps

| Step | Description | Depends On |
|------|-------------|------------|
| **Step 1** | Distill Constitution v0.1 from current agents/workflows | This log (LOG-028) |
| **Step 2** | Research trajectory testing patterns (Google ADK, Upskill) | RQ-1 |
| **Step 3** | Design golden test set (3-5 scenarios per pillar) | Step 1, Step 2 |
| **Step 4** | Implement L1 (structural checks) | Step 1 |
| **Step 5** | Implement L2 (constitutional LLM-as-judge) | Step 1, Step 4 |
| **Step 6** | Implement L3 (behavioral golden tests) | Step 2, Step 3 |

---

#### Part 8: Summary Table — The Six Pillars

| Pillar | What | Test Type | Gate | Backlink |
|--------|------|-----------|------|----------|
| Stateless-First | Handoff packet every turn | Structural (grep) | Hard | LOG-016 |
| Context Engineering | Token budgets, dead code | Structural + Coverage | Soft | LOG-020 |
| Pair Programming | Grounding loop, challenge tone | Constitutional (LLM) | Soft | — |
| Journalism Quality | Log rubric with DRY backlinks | Constitutional (LLM) | Soft | — |
| Template Example Coverage | Decommission unused examples | Coverage test | Soft | — |
| Behavioral Alignment | Golden test trajectories | Behavioral (LLM) | Threshold | — |

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-028 (CI Framework Discovery — checkpointed)
→ Dependency chain: LOG-028 ← LOG-020 (token budget) ← LOG-016 (stateless-first)
→ Next action: Research trajectory testing (RQ-1) OR distill Constitution v0.1 (Step 1)

**Layer 2 — Global Context:**
→ Architecture: 2 agents + 6 workflows + 5 artifacts (see Part 1 table)
→ Patterns: Constitution-first CI, Three-layer architecture (L1 structural → L2 constitutional → L3 behavioral)
→ Key decisions: DECISION-028a (Constitution approach), DECISION-028b (Three-layer CI)

**Fork paths:**
- Continue to Constitution v0.1 → Distill immutable pillars from current agents/workflows
- Research trajectory testing → Deep dive Google ADK + Upskill for RQ-1
- Implement L1 first → Start with cheapest structural checks
- Discuss further → Refine pillars or research questions


### [LOG-029] - [PLAN] - Constitution v0.1 Implementation Plan: Hybrid Format with Pillars + Rubrics + Golden Tests - Task: TASK-CONST-001

**Timestamp:** 2026-02-08
**Status:** PLAN (pending approval)
**Depends On:** LOG-028 (Six Pillars + Three-Layer CI architecture)
**Decision IDs:** DECISION-029a (Hybrid constitution format)

---

#### Part 1: Research Findings — Three Industry Approaches

Before designing the Constitution format, I researched how industry leaders structure machine-auditable behavioral contracts.

##### Finding 1: Anthropic Constitutional AI (Jan 2026)

Anthropic published an 80-page "reason-based" constitution that prioritizes **explaining WHY** over prescribing WHAT.

**Key structural patterns:**

| Pattern | Description | GSD-Lite Applicability |
|---------|-------------|------------------------|
| **4-tier priority** | Safety → Ethics → Guidelines → Helpfulness | Adapt for: Stateless → Pair Programming → Context → Journalism |
| **Hardcoded vs soft-coded** | Absolute prohibitions vs adjustable defaults | Map to: Hard gates (L1) vs soft gates (L2) |
| **Principal hierarchy** | Anthropic → Operators → Users | Map to: Constitution → Agent → User |
| **Reason-based** | Each rule includes WHY, not just WHAT | Critical for LLM-as-judge context |

**Source:** [Anthropic Claude's Constitution](https://www.anthropic.com/research/claudes-constitution) — published 2026-01-22.

##### Finding 2: LLM-as-Judge Rubric Format

Industry standard for LLM evaluation uses structured YAML/JSON rubrics with 4 components:

```yaml
# Example rubric structure (synthesized from DeepEval, Promptfoo, LangChain patterns)
evaluation_criteria:
  grounding_loop:
    description: "Agent echoes findings and verifies with user before executing"
    scale: "binary"
    labels: ["Compliant", "Violation"]
    examples:
      compliant: |
        Agent: "I found X in file Y at line Z. Does this match your intent?"
        User: "Yes"
        Agent: "Based on this, my plan is..."
      violation: |
        Agent: "I found X. [immediately starts implementing]"
```

**Source:** [Promptfoo llm-rubric docs](https://www.promptfoo.dev/docs/guides/llm-as-a-judge/), [DeepEval GEval](https://docs.confident-ai.com/docs/metrics-llm-evals).

##### Finding 3: Google ADK Evaluation Format

Google ADK uses `.test.json` files for trajectory testing:

```json
{
  "eval_id": "onboarding_sequence",
  "conversation": [
    {
      "user_content": { "text": "let's work on the auth feature" },
      "intermediate_data": {
        "tool_uses": [
          { "name": "read_files", "args": { "path": "PROJECT.md" } },
          { "name": "read_files", "args": { "path": "ARCHITECTURE.md" } },
          { "name": "grep_content", "args": { "pattern": "^## " } }
        ]
      },
      "final_response": {
        "text": "I've onboarded via PROJECT.md and ARCHITECTURE.md..."
      }
    }
  ]
}
```

**Source:** [Google ADK Evaluate Docs](https://google.github.io/adk-docs/evaluate/), [adk-python GitHub](https://github.com/google/adk-python).

---

#### Part 2: The Hybrid Format Decision

**DECISION-029a:** Adopt a three-layer hybrid format that separates philosophy (human-readable), evaluation criteria (machine-parseable), and behavioral tests (trajectory assertions).

```mermaid
graph TD
    subgraph "Constitution v0.1 Structure"
        C[CONSTITUTION.md<br/>~500 lines<br/>Pillars + WHY]
        
        subgraph "rubrics/"
            R1[pair-programming.yaml]
            R2[journalism-quality.yaml]
            R3[stateless-handoff.yaml]
        end
        
        subgraph "golden-tests/"
            G1[onboarding.test.json]
            G2[grounding-loop.test.json]
            G3[scope-discipline.test.json]
        end
    end
    
    subgraph "CI Layers"
        L1[L1: Structural<br/>grep patterns]
        L2[L2: Constitutional<br/>LLM-as-judge + rubrics]
        L3[L3: Behavioral<br/>Golden test trajectories]
    end
    
    C --> L2
    R1 --> L2
    R2 --> L2
    R3 --> L2
    G1 --> L3
    G2 --> L3
    G3 --> L3
```

**Why hybrid over single-file:**

| Approach | Pros | Cons |
|----------|------|------|
| **Single markdown** | Simple, human-readable | Can't programmatically validate |
| **Single JSON schema** | Machine-parseable | Loses the WHY, hard to maintain |
| **Hybrid (chosen)** | Best of both: philosophy + automation | Slightly more files to maintain |

**Why this matches GSD-Lite philosophy:** The Constitution itself follows the "journalism quality" pillar — rich context for humans, structured data for machines.

---

#### Part 3: File-by-File Implementation Plan

##### 3.1 CONSTITUTION.md — The Pillars (~500 lines)

**Location:** `src/gsd_lite/template/constitution/CONSTITUTION.md`

**Structure:**

```markdown
# GSD-Lite Constitution v0.1

## Preamble
[Why this document exists, how to use it]

## Priority Hierarchy
1. Stateless-First (session survival)
2. Pair Programming Model (human ownership)
3. Context Engineering (token discipline)
4. Journalism Quality (onboarding optimization)

## Pillar 1: Stateless-First
### The Principle
[WHY: Users micro-fork to manage context rot...]

### Hardcoded Behaviors
- MUST: End every response with 📦 STATELESS HANDOFF
- MUST: Include Layer 1 (local) and Layer 2 (global) context
- MUST: Provide 2-4 fork paths

### Soft-coded Defaults
- SHOULD: Use dependency chain format (LOG-XXX ← LOG-YYY)
- SHOULD: Keep handoff under 20 lines

### Violation Examples
[Concrete examples of what NOT to do]

### Compliance Examples
[Concrete examples of correct behavior]

## Pillar 2: Pair Programming Model
[Same structure...]

## Pillar 3: Context Engineering
[Same structure...]

## Pillar 4: Journalism Quality
[Same structure...]

## Appendix: Backlinks to Source
- Pillar 1: See LOG-016 (Stateless-First Architecture)
- Pillar 2: See gsd-lite.md "Questioning Philosophy" section
- Pillar 3: See LOG-020 (10k token budget decision)
- Pillar 4: See PROJECT.md "The Logging Standard"
```

**Extraction source mapping:**

| Pillar | Primary Source | Lines |
|--------|----------------|-------|
| Stateless-First | `gsd-lite.md` | L168-250 (Stateless-First Architecture section) |
| Pair Programming | `gsd-lite.md` | L252-350 (Questioning Philosophy section) |
| Context Engineering | `gsd-lite.md` | L85-120 (File Reading Strategy section) |
| Journalism Quality | `gsd-lite/PROJECT.md` | L45-70 (The Logging Standard section) |

##### 3.2 Rubrics Directory — L2 Evaluation Criteria

**Location:** `src/gsd_lite/template/constitution/rubrics/`

**Example: `pair-programming.yaml`**

```yaml
# Rubric: Pair Programming Model Compliance
# Used by: L2 Constitutional CI (LLM-as-judge)
# Backlink: LOG-029 (Constitution Implementation Plan)

rubric_id: pair-programming-v1
pillar: 2
description: |
  Agent operates as Navigator (proposes, challenges, teaches) while 
  User remains Driver (decides, owns). Never auto-execute without 
  explicit user approval.

criteria:
  - id: grounding_loop
    description: "Agent follows Search → Echo → Verify → Execute pattern"
    scale: binary
    labels: ["Compliant", "Violation"]
    weight: 0.3
    examples:
      compliant: |
        Agent: "I searched for auth patterns. Found JWT setup in src/auth.ts at line 45. 
               It uses RS256 algorithm. Does this match your expectation?"
        User: "Yes, that's correct."
        Agent: "Based on this, my plan is to add refresh token logic. Approve?"
      violation: |
        Agent: "I found the auth file. Here's the implementation: [code]"
        # Skipped Echo and Verify steps

  - id: challenge_vagueness
    description: "Agent probes vague answers instead of accepting them"
    scale: binary
    labels: ["Compliant", "Violation"]
    weight: 0.2
    examples:
      compliant: |
        User: "Make it fast"
        Agent: "Fast how? Sub-second response? Handles large datasets? Quick to build?"
      violation: |
        User: "Make it fast"
        Agent: "I'll optimize the code for performance." # Accepted vague answer

  - id: no_auto_write
    description: "Agent asks before writing to artifacts"
    scale: binary
    labels: ["Compliant", "Violation"]
    weight: 0.25
    examples:
      compliant: |
        Agent: "This is a key decision. Want me to capture it to WORK.md?"
        User: "Yes, log it."
      violation: |
        Agent: "I've updated WORK.md with our decision." # Wrote without asking

  - id: user_owns_completion
    description: "Agent signals readiness, user decides completion"
    scale: binary
    labels: ["Compliant", "Violation"]
    weight: 0.25
    examples:
      compliant: |
        Agent: "TASK-001 implementation complete. Ready for your review."
        User: "Approved, mark complete."
      violation: |
        Agent: "TASK-001 is done. Moving to TASK-002." # Decided completion

pass_threshold: 0.8
judge_model: "claude-sonnet-4-20250514"
```

**Other rubric files to create:**

| File | Pillar | Key Criteria |
|------|--------|--------------|
| `stateless-handoff.yaml` | 1 | Handoff presence, L1/L2 layers, fork paths |
| `context-engineering.yaml` | 3 | Grep-first behavior, token awareness |
| `journalism-quality.yaml` | 4 | Narrative framing, WHY not just WHAT, code snippets, backlinks |

##### 3.3 Golden Tests Directory — L3 Behavioral Trajectories

**Location:** `src/gsd_lite/template/constitution/golden-tests/`

**Example: `onboarding.test.json`**

```json
{
  "eval_set_id": "gsd-lite-onboarding",
  "name": "Universal Onboarding Sequence",
  "description": "Validates agent follows PROTOCOL → PROJECT → ARCHITECTURE → WORK.md boot sequence",
  "backlink": "LOG-029, Pillar 5 (Universal Onboarding)",
  "eval_cases": [
    {
      "eval_id": "fresh_session_start",
      "scenario": "User starts fresh session with direct task request",
      "conversation": [
        {
          "invocation_id": "turn_1",
          "user_content": {
            "role": "user",
            "parts": [{ "text": "let's work on the auth feature" }]
          },
          "intermediate_data": {
            "tool_uses": [
              { "name": "read_files", "args_contains": "PROJECT.md" },
              { "name": "read_files", "args_contains": "ARCHITECTURE.md" },
              { "name": "grep_content", "args_contains": "WORK.md" }
            ],
            "tool_order": "sequential"
          },
          "final_response_must_contain": [
            "PROJECT.md",
            "ARCHITECTURE.md",
            "Current Understanding"
          ],
          "final_response_must_not_contain": [
            "Let me start implementing",
            "Here's the code"
          ]
        }
      ]
    }
  ]
}
```

**Other golden test files to create:**

| File | Tests | Key Assertions |
|------|-------|----------------|
| `grounding-loop.test.json` | Search → Echo → Verify | Tool use before action, echo findings |
| `scope-discipline.test.json` | INBOX capture | Defers scope creep to INBOX.md |
| `checkpoint.test.json` | Session handoff | Updates Current Understanding correctly |

---

#### Part 4: Implementation Sequence

```mermaid
gantt
    title Constitution v0.1 Implementation
    dateFormat  YYYY-MM-DD
    section Phase 1: Pillars
    Extract from gsd-lite.md     :p1a, 2026-02-09, 1d
    Write CONSTITUTION.md        :p1b, after p1a, 1d
    section Phase 2: Rubrics
    pair-programming.yaml        :p2a, after p1b, 1d
    stateless-handoff.yaml       :p2b, after p2a, 1d
    journalism-quality.yaml      :p2c, after p2b, 1d
    section Phase 3: Golden Tests
    onboarding.test.json         :p3a, after p2c, 1d
    grounding-loop.test.json     :p3b, after p3a, 1d
    section Phase 4: CI Integration
    L1 structural checks         :p4a, after p3b, 1d
    L2 LLM-as-judge scaffold     :p4b, after p4a, 2d
```

**Task breakdown:**

| ID | Task | Depends On | Est. Tokens | Output |
|----|------|------------|-------------|--------|
| TASK-CONST-001a | Extract Pillar 1-4 from source files | LOG-029 | ~50k | Draft pillars |
| TASK-CONST-001b | Write CONSTITUTION.md with examples | TASK-CONST-001a | ~30k | CONSTITUTION.md |
| TASK-CONST-002a | Write pair-programming.yaml | TASK-CONST-001b | ~20k | rubrics/ file |
| TASK-CONST-002b | Write remaining rubrics | TASK-CONST-002a | ~40k | 3 more rubrics |
| TASK-CONST-003a | Write onboarding.test.json | TASK-CONST-002b | ~20k | golden-tests/ file |
| TASK-CONST-003b | Write remaining golden tests | TASK-CONST-003a | ~40k | 3 more tests |
| TASK-CI-L1-001 | Implement L1 structural checks | TASK-CONST-001b | ~30k | CI script |
| TASK-CI-L2-001 | Scaffold L2 LLM-as-judge | TASK-CONST-002b | ~50k | CI integration |

---

#### Part 5: Sources and Citations

| Finding | Source | Specific Location |
|---------|--------|-------------------|
| Anthropic 4-tier priority | [anthropic.com/research/claudes-constitution](https://www.anthropic.com/research/claudes-constitution) | Section "Priority Hierarchy" |
| Anthropic hardcoded/soft-coded | Same | Section "Hardcoded and Softcoded Behaviors" |
| LLM-as-judge rubric structure | [promptfoo.dev llm-rubric](https://www.promptfoo.dev/docs/guides/llm-as-a-judge/) | "Defining custom rubrics" section |
| DeepEval GEval pattern | [confident-ai.com GEval](https://docs.confident-ai.com/docs/metrics-llm-evals) | "Custom Criteria" section |
| Google ADK test.json format | [google.github.io/adk-docs/evaluate](https://google.github.io/adk-docs/evaluate/) | "Test Datasets" section |
| Google ADK trajectory testing | [github.com/google/adk-python](https://github.com/google/adk-python) | `examples/eval/` directory |

**GSD-Lite source file references:**

| Content | File | Lines |
|---------|------|-------|
| Stateless-First Architecture | `src/gsd_lite/template/agents/gsd-lite.md` | 168-250 |
| Questioning Philosophy | `src/gsd_lite/template/agents/gsd-lite.md` | 252-350 |
| Grounding Loop | `src/gsd_lite/template/agents/gsd-lite.md` | 320-340 |
| File Reading Strategy | `src/gsd_lite/template/agents/gsd-lite.md` | 85-120 |
| Logging Standard | `gsd-lite/PROJECT.md` | 45-70 |

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-029 (Constitution v0.1 Implementation Plan)
→ Dependency chain: LOG-029 ← LOG-028 (Six Pillars) ← LOG-020 (token budget)
→ Next action: Approve plan, then begin TASK-CONST-001a (extract pillars from source)

**Layer 2 — Global Context:**
→ Architecture: 2 agents + 6 workflows + Constitution (new)
→ Patterns: Hybrid format (Markdown pillars + YAML rubrics + JSON golden tests)
→ Key decisions: DECISION-029a (Hybrid constitution format)

**Fork paths:**
- Approve plan → Begin TASK-CONST-001a (pillar extraction)
- Adjust plan → Discuss changes to format or scope
- Research more → Deep dive specific rubric patterns
- Defer → Checkpoint and resume later

---

### [LOG-030] - [EXEC] - Created CONSTITUTION.md v0.1 with Four Pillars Extracted from Source - Task: TASK-CONST-001a

**Timestamp:** 2026-02-08
**Status:** Complete
**Depends On:** LOG-029 (Constitution Implementation Plan)
**Output:** `src/gsd_lite/template/constitution/CONSTITUTION.md` (~550 lines)

#### What Was Done

Extracted the four pillars from source files and compiled into a machine-auditable constitution:

| Pillar | Source Files | Key Sections Extracted |
|--------|--------------|------------------------|
| **Stateless-First** | `agents/gsd-lite.md` L356-466 | Handoff structure, two-layer format, anti-patterns |
| **Pair Programming** | `agents/gsd-lite.md` L514-660, `references/questioning.md` | Grounding Loop, Challenge Tone Protocol, Teaching Detour |
| **Context Engineering** | `agents/gsd-lite.md` L121-172, L33-53 | Grep-first pattern, Universal Onboarding sequence |
| **Journalism Quality** | `gsd-lite/PROJECT.md` L81-115 | Logging Standard, log entry elements table |

#### Structure of CONSTITUTION.md

```
# GSD-Lite Constitution v0.1
├── Preamble (why this exists, priority hierarchy)
├── Pillar 1: Stateless-First
│   ├── The Principle (WHY)
│   ├── Hardcoded Behaviors (S1-H1 through S1-H5)
│   ├── Soft-coded Defaults (S1-S1 through S1-S3)
│   ├── Two-Layer Handoff Structure
│   ├── Canonical Format
│   ├── Violation Examples
│   ├── Compliance Examples
│   └── Source Reference
├── Pillar 2: Pair Programming Model
│   ├── [same structure]
│   └── Includes: Grounding Loop, Challenge Tone Protocol, Teaching Detour
├── Pillar 3: Context Engineering
│   ├── [same structure]
│   └── Includes: Grep-First Pattern, Universal Onboarding Sequence
├── Pillar 4: Journalism Quality
│   ├── [same structure]
│   └── Includes: Log Entry Elements, Milestone/Standard formats
└── Appendix: Quick Reference
    ├── Golden Rules (spans all pillars)
    ├── Behavior ID Index
    └── Source File Mapping
```

#### Key Design Decisions

1. **Behavior IDs:** Each hardcoded/soft-coded rule gets a unique ID (e.g., `S1-H1`, `P2-H3`) for CI traceability
2. **Violation + Compliance Examples:** Every pillar includes concrete examples of both wrong and right behavior
3. **Source References:** Each pillar backlinks to exact source file + line numbers
4. **Priority Hierarchy:** Explicit ordering when pillars conflict (Stateless > Pair Programming > Context > Journalism)

#### Files Created

| File | Size | Purpose |
|------|------|---------|
| `src/gsd_lite/template/constitution/CONSTITUTION.md` | ~550 lines | The four pillars with examples |

#### Next Steps

Ready for TASK-CONST-001b (review/polish) or skip to TASK-CONST-002a (write rubrics).

---

### [LOG-031] - [EXEC] - Created pair-programming.yaml Rubric with Hardcoded Behaviors (P2-H1 to P2-H5) - Task: TASK-CONST-002a

**Timestamp:** 2026-02-08
**Status:** Complete
**Depends On:** LOG-030 (CONSTITUTION.md), LOG-028 (CI Framework Design)
**Output:** `src/gsd_lite/template/constitution/rubrics/pair-programming.yaml` (~350 lines)

#### Research Summary

Evaluated three major LLM evaluation frameworks to determine cutting-edge rubric format:

| Framework | Format | Key Pattern | Verdict |
|-----------|--------|-------------|---------|
| **Vertex AI Gen AI Eval** | Python SDK | `PointwiseMetricPromptTemplate` with criteria + rating_rubric | GCP-coupled, no native YAML |
| **Promptfoo** | Native YAML | `llm-rubric` assertion with freeform text | True YAML-first, but unstructured |
| **DeepEval** | Python SDK | `GEval` with `Rubric` class (explicit score ranges) | Most structured, Python-first |

**Key Insight:** All frameworks converge on same core pattern: `criteria` + `rating_rubric` + `evaluation_params`. Vertex AI recommends "Adaptive Rubrics" (dynamically generated per prompt) as cutting-edge.

**Decision:** Hybrid YAML format that:
1. Is native YAML (like Promptfoo) — rubrics live in `.yaml` files
2. Has structured scoring (like DeepEval's `Rubric`) — explicit score ranges per criterion
3. Maps directly to CONSTITUTION.md — each behavior ID becomes a criterion
4. Is portable — can transform to any target framework

#### Structure of pair-programming.yaml

```yaml
metadata:
  pillar: "Pair Programming Model"
  pillar_id: "P2"
  scope: "hardcoded"  # P2-H1 through P2-H5

evaluation_params:
  - agent_response
  - user_input
  - conversation_history (optional)
  - artifacts_state (optional)

criteria:
  - id: P2-H1 (Why Before How)
  - id: P2-H2 (No Auto-Write)
  - id: P2-H3 (User Owns Completion)
  - id: P2-H4 (Grounding Loop)
  - id: P2-H5 (Challenge Vagueness)

aggregation:
  method: "minimum"  # ANY violation = fail
```

#### Each Criterion Contains

| Field | Purpose | Example |
|-------|---------|---------|
| `id` | Traceability to CONSTITUTION.md | `P2-H1` |
| `name` | Human-readable title | "Why Before How" |
| `type` | `hardcoded` or `softcoded` | `hardcoded` |
| `description` | What the rule means | Full description |
| `evaluation_steps` | Step-by-step guide for LLM judge | 1. Check if action... 2. If yes, verify... |
| `scoring` | Binary (0=violation, 1=pass) | Explicit criteria for each score |
| `violation_examples` | Concrete bad behavior | Input → Response → Reason |
| `compliance_examples` | Concrete good behavior | Input → Response → Reason |

#### Files Created

| File | Size | Purpose |
|------|------|---------|
| `src/gsd_lite/template/constitution/rubrics/` | (dir) | New rubrics directory |
| `.../rubrics/pair-programming.yaml` | ~350 lines | Pillar 2 hardcoded behaviors |

#### Design Rationale

1. **Binary scoring for hardcoded:** 0 (violation) or 1 (pass) — no grey area for non-negotiables
2. **Minimum aggregation:** If ANY hardcoded rule fails, the entire pillar fails
3. **Rich examples:** Both violation and compliance examples with reasoning, enabling weaker models to pattern-match
4. **Portable format:** YAML structure can be transformed to Promptfoo/DeepEval/Vertex AI

#### Next Steps

- TASK-CONST-002b: Write remaining rubrics (Pillar 1, 3, 4 hardcoded behaviors)
- Future: Add softcoded behaviors (weighted average aggregation)

---

### [LOG-032] - [DISCOVERY] - The OpenCode Goldmine: Native Session JSON Solves the Trajectory Testing Problem - Task: CI-EVAL-001

**Timestamp:** 2026-02-08
**Status:** DISCOVERY (Storage location SUPERSEDED by LOG-045)
**Depends On:** LOG-028 (CI Framework Design — defines 3-layer architecture), LOG-029 (Constitution Implementation Plan), LOG-031 (pair-programming.yaml rubric)
**Decision IDs:** DECISION-032a (Use OpenCode native JSON for eval data), DECISION-032b (Vertex AI Gen AI Eval as primary judge)

> **UPDATE (LOG-045):** The storage location documented in this log (`~/.local/share/opencode/storage/session`) is obsolete. OpenCode migrated to SQLite (`opencode.db`). See LOG-045 for the new schema.

---

#### Part 1: The Problem — "How Do We Test Agent Behavior Without Telemetry?"

##### 1.1 The Trajectory Testing Challenge (from LOG-028)

LOG-028 identified a critical gap: GSD-Lite is a vanilla markdown framework. Users spawn agents via OpenCode — we don't collect telemetry or traces. How do we evaluate:
- Did the agent follow the Grounding Loop (Search → Echo → Verify)?
- Did the agent ask WHY before executing?
- Did the agent respect the Universal Onboarding sequence?

**The naive assumption:** We need to build a wrapper, plugin, or harness to capture tool calls.

**The discovery:** OpenCode **already captures everything** — we just didn't know where to look.

##### 1.2 Research Journey: Framework Evaluation

We evaluated four major agent evaluation frameworks to understand how they capture trajectories:

| Framework | How It Captures Trajectories | GSD-Lite Compatibility |
|-----------|------------------------------|------------------------|
| **Google ADK** | Agent must be ADK-native Python; uses `AgentEvaluator` class | ❌ GSD-Lite is markdown instructions |
| **DeepEval** | Uses `@observe` decorators on Python functions | ❌ No Python to decorate |
| **Promptfoo** | Custom provider functions or manual YAML | ⚠️ Requires custom harness |
| **Vertex AI Gen AI Eval** | **Bring Your Own Data** — just provide prompts + responses + trajectories | ✅ Works with ANY data source! |

**Key insight from Vertex AI:** You don't need to run the agent in their framework. You bring pre-captured data, and they evaluate it.

**Citation:** [Vertex AI Gen AI Evaluation Overview](https://cloud.google.com/vertex-ai/generative-ai/docs/models/evaluation-overview) — "Agent evaluation: Evaluate the performance of an agent using agent-specific metrics, such as agent traces and response quality."

---

#### Part 2: The Discovery — OpenCode Native JSON Storage

##### 2.1 Where OpenCode Stores Session Data

OpenCode persists all session data to disk as JSON files:

```
~/.local/share/opencode/storage/
├── project/{projectID}.json           # Project metadata
├── session/{projectID}/{sessionID}.json  # Session metadata
├── message/{sessionID}/{messageID}.json  # Individual messages
└── part/{messageID}/{partID}.json        # Message parts (tool calls, text, reasoning)
```

**Citation:** 
- Repository: `anomalyco/opencode` (commit `80c1c59ed34cd19119bbb53f40e5214cae35ad29`)
- File: `packages/opencode/src/storage/storage.ts` lines 1-180
- URL: https://github.com/anomalyco/opencode/blob/80c1c59ed34cd19119bbb53f40e5214cae35ad29/packages/opencode/src/storage/storage.ts

##### 2.2 The ToolPart Schema — Exactly What Trajectory Eval Needs

The critical discovery is in `packages/opencode/src/session/message-v2.ts`. OpenCode defines a `ToolPart` type that captures:

```typescript
// Source: packages/opencode/src/session/message-v2.ts
// Lines 140-185 (approximate, from commit 80c1c59ed34cd19119bbb53f40e5214cae35ad29)

export const ToolPart = PartBase.extend({
  type: z.literal("tool"),
  callID: z.string(),
  tool: z.string(),                    // ← Tool name: "read_files", "grep_content", etc.
  state: ToolState,                    // ← Execution state with full details
  metadata: z.record(z.string(), z.any()).optional(),
})

export const ToolStateCompleted = z.object({
  status: z.literal("completed"),
  input: z.record(z.string(), z.any()),   // ← Tool arguments!
  output: z.string(),                      // ← Tool response!
  title: z.string(),
  metadata: z.record(z.string(), z.any()),
  time: z.object({
    start: z.number(),
    end: z.number(),
    compacted: z.number().optional(),
  }),
  attachments: FilePart.array().optional(),
})
```

**What this means:** Every MCP tool call is persisted with:
- `tool`: The tool name (e.g., "mcp_tools_fs_read_files")
- `input`: The exact arguments passed
- `output`: The tool's response
- `time.start` / `time.end`: Execution timing

**This is EXACTLY what trajectory evaluation frameworks expect.**

**Citation:**
- File: `packages/opencode/src/session/message-v2.ts`
- URL: https://github.com/anomalyco/opencode/blob/80c1c59ed34cd19119bbb53f40e5214cae35ad29/packages/opencode/src/session/message-v2.ts
- Lines: 140-185 (ToolPart definition), 95-135 (ToolState variants)

##### 2.3 Example: What a Real Session JSON Looks Like

Based on the schema, a parsed OpenCode session would yield data like:

```json
{
  "session_id": "01JKXYZ...",
  "messages": [
    {
      "id": "msg_001",
      "role": "user",
      "content": "Add dark mode to the app"
    },
    {
      "id": "msg_002", 
      "role": "assistant",
      "parts": [
        {
          "type": "text",
          "text": "Before I add that — is this for user preference, accessibility, or battery saving?"
        }
      ]
    },
    {
      "id": "msg_003",
      "role": "user", 
      "content": "User preference. Let's check what theme system exists."
    },
    {
      "id": "msg_004",
      "role": "assistant",
      "parts": [
        {
          "type": "tool",
          "tool": "mcp_tools_fs_grep_content",
          "state": {
            "status": "completed",
            "input": {"pattern": "theme|dark|light", "search_path": "src/"},
            "output": "File: src/styles/theme.ts, Line: 5...",
            "time": {"start": 1707400000000, "end": 1707400001500}
          }
        },
        {
          "type": "text",
          "text": "I found a theme system in src/styles/theme.ts. It currently has light mode only..."
        }
      ]
    }
  ]
}
```

**This transforms directly to Vertex AI eval format:**

```python
eval_dataset = [{
    "prompt": "Add dark mode to the app",
    "response": "Before I add that — is this for user preference...",
    "generated_trajectory": [
        {
            "tool": "mcp_tools_fs_grep_content",
            "args": {"pattern": "theme|dark|light", "search_path": "src/"},
            "output": "File: src/styles/theme.ts, Line: 5..."
        }
    ]
}]
```

---

#### Part 3: The Architecture — No New Code in OpenCode

##### 3.1 High-Level Flow

```mermaid
flowchart LR
    subgraph "Your Workflow (Unchanged)"
        A[OpenCode + GSD-Lite] --> B["Sessions saved to<br/>~/.local/share/opencode/"]
    end
    
    subgraph "Evaluation Pipeline (New)"
        B --> C["Parser Script<br/>(Python)"]
        C --> D["Eval Dataset<br/>(JSON)"]
        D --> E["Vertex AI Gen AI Eval<br/>OR Local LLM Judge"]
        E --> F["Pass/Fail Report"]
    end
    
    subgraph "CI Integration"
        F --> G["GitHub Actions<br/>Block PR on Fail"]
    end
```

##### 3.2 Detailed Component Architecture

```mermaid
flowchart TB
    subgraph "Data Source (OpenCode Native)"
        OC1["~/.local/share/opencode/storage/session/"]
        OC2["~/.local/share/opencode/storage/message/"]
        OC3["~/.local/share/opencode/storage/part/"]
    end
    
    subgraph "Parser (tests/constitution/parser.py)"
        P1["read_session(session_id)"]
        P2["extract_messages(session_id)"]
        P3["extract_tool_calls(message_id)"]
        P4["transform_to_eval_format()"]
    end
    
    subgraph "Evaluation Backends"
        E1["Vertex AI Gen AI Eval<br/>(Adaptive Rubrics)"]
        E2["Local LLM Judge<br/>(pair-programming.yaml)"]
    end
    
    subgraph "Output"
        O1["Eval Report (JSON)"]
        O2["CI Pass/Fail Signal"]
    end
    
    OC1 --> P1
    OC2 --> P2
    OC3 --> P3
    P1 --> P4
    P2 --> P4
    P3 --> P4
    P4 --> E1
    P4 --> E2
    E1 --> O1
    E2 --> O1
    O1 --> O2
```

##### 3.3 The Three Layers Revisited (from LOG-028)

LOG-028 defined a three-layer CI architecture. Here's how it maps to implementation:

| Layer | What It Tests | Implementation | Data Source |
|-------|---------------|----------------|-------------|
| **L1: Structural** | Token budget, required sections | Python script with grep | `src/gsd_lite/template/agents/gsd-lite.md` |
| **L2: Constitutional** | Response quality against rubrics | LLM-as-judge with `pair-programming.yaml` | OpenCode session JSON → parser |
| **L3: Behavioral** | Trajectory matches expected patterns | Trajectory precision/recall metrics | OpenCode session JSON → parser |

**Key insight:** L2 and L3 share the same data source (OpenCode JSON), just different evaluation metrics.

---

#### Part 4: Framework Research Summary

##### 4.1 Google ADK Evaluation

**What it does:** Full trajectory capture for ADK-native agents. Supports `tool_trajectory_avg_score`, `response_match_score`.

**Why it doesn't fit:** Requires agent to be built with ADK Python SDK. GSD-Lite is markdown instructions loaded by OpenCode.

**Citation:** 
- URL: https://google.github.io/adk-docs/evaluate/
- Key quote: "ADK's tool trajectory evaluation requires an exact match for the tool call order and each tool argument."

##### 4.2 DeepEval

**What it does:** Python-first evaluation with `@observe` decorators to capture trajectories.

**Metrics available:**
- `ToolCorrectnessMetric` — Did agent call right tools?
- `ArgumentCorrectnessMetric` — Were arguments correct?
- `TaskCompletionMetric` — Did agent complete the task?

**Why it doesn't fit:** Requires decorating Python functions. GSD-Lite agents are spawned by OpenCode, not our code.

**Citation:**
- URL: https://docs.confident-ai.com/docs/metrics-llm-evals
- Repository: https://github.com/confident-ai/deepeval

##### 4.3 Promptfoo

**What it does:** YAML-first evaluation with `llm-rubric` assertions.

**Example config:**
```yaml
tests:
  - vars:
      question: "Add dark mode"
    assert:
      - type: llm-rubric
        value: "Agent must ask WHY before implementing"
        threshold: 0.8
```

**Why it's a backup option:** Works without trajectory capture, but limited to response-only evaluation.

**Citation:**
- URL: https://www.promptfoo.dev/docs/guides/llm-as-a-judge/ (404 at time of research, used grounding search)

##### 4.4 Vertex AI Gen AI Evaluation (WINNER)

**What it does:** Enterprise-grade evaluation with "Adaptive Rubrics" — dynamically generates pass/fail tests per prompt.

**Key feature — Bring Your Own Data:**
```python
from vertexai import Client

client = Client(project=PROJECT_ID, location=LOCATION)

# You provide the data — Vertex AI evaluates it
eval_dataset = client.evals.run_inference(model="gemini-2.5-flash", src=prompts_df)
eval_result = client.evals.evaluate(dataset=eval_dataset)
```

**Why it wins:**
1. **No harness required** — bring pre-captured data
2. **Adaptive rubrics** — generates relevant tests per prompt
3. **Trajectory support** — can evaluate tool call sequences
4. **Enterprise-grade** — production-ready, scalable

**DECISION-032b:** Use Vertex AI Gen AI Eval as primary evaluation backend.

**Citation:**
- URL: https://cloud.google.com/vertex-ai/generative-ai/docs/models/evaluation-overview
- SDK: `google-cloud-aiplatform[evaluation]`

---

#### Part 5: Why This Preserves the GSD-Lite DX

The user raised a critical concern: GSD-Lite's power comes from its lightweight, stateless nature with OpenCode.

| What Makes GSD-Lite Powerful | How This Preserves It |
|------------------------------|----------------------|
| `/new` and `/fork` commands | Unchanged — sessions remain ephemeral |
| Context control via forking | Unchanged — you decide when to fork |
| Artifacts survive sessions | Unchanged — WORK.md is your memory |
| No vendor lock-in | Unchanged — markdown works anywhere |
| **NEW:** Evaluation capability | Sessions you already ran become eval data |

**The insight:** We're not adding instrumentation TO OpenCode. We're reading data OpenCode ALREADY saves.

---

#### Part 6: Implementation Plan

##### 6.1 Phase 1: Parser Script (tests/constitution/parser.py)

```python
# Conceptual implementation
import json
from pathlib import Path
from typing import List, Dict, Any

OPENCODE_STORAGE = Path.home() / ".local/share/opencode/storage"

def parse_session(session_id: str, project_id: str = "global") -> Dict[str, Any]:
    """Parse an OpenCode session into evaluation format."""
    
    # Read session metadata
    session_path = OPENCODE_STORAGE / "session" / project_id / f"{session_id}.json"
    session = json.loads(session_path.read_text())
    
    # Read all messages for this session
    messages = []
    message_dir = OPENCODE_STORAGE / "message" / session_id
    for msg_file in sorted(message_dir.glob("*.json")):
        msg = json.loads(msg_file.read_text())
        
        # Read parts (tool calls, text, etc.)
        parts = []
        part_dir = OPENCODE_STORAGE / "part" / msg["id"]
        if part_dir.exists():
            for part_file in sorted(part_dir.glob("*.json")):
                parts.append(json.loads(part_file.read_text()))
        
        messages.append({"info": msg, "parts": parts})
    
    return {"session": session, "messages": messages}

def to_eval_format(parsed_session: Dict) -> List[Dict]:
    """Transform parsed session to Vertex AI eval format."""
    eval_cases = []
    
    for i, msg in enumerate(parsed_session["messages"]):
        if msg["info"]["role"] == "user":
            # Find the assistant response that follows
            if i + 1 < len(parsed_session["messages"]):
                assistant_msg = parsed_session["messages"][i + 1]
                if assistant_msg["info"]["role"] == "assistant":
                    # Extract tool calls
                    trajectory = [
                        {
                            "tool": part["tool"],
                            "args": part["state"]["input"],
                            "output": part["state"].get("output", "")
                        }
                        for part in assistant_msg["parts"]
                        if part["type"] == "tool" and part["state"]["status"] == "completed"
                    ]
                    
                    # Extract text response
                    response_text = " ".join([
                        part["text"] 
                        for part in assistant_msg["parts"] 
                        if part["type"] == "text"
                    ])
                    
                    eval_cases.append({
                        "prompt": extract_user_text(msg),
                        "response": response_text,
                        "generated_trajectory": trajectory
                    })
    
    return eval_cases
```

##### 6.2 Phase 2: L1 Structural Checks

```python
# tests/constitution/l1_structural.py
import subprocess
from pathlib import Path

def check_token_budget(agent_file: Path, max_tokens: int = 10000) -> bool:
    """L1 check: Agent instruction under token budget."""
    import tiktoken
    enc = tiktoken.encoding_for_model("gpt-4")
    content = agent_file.read_text()
    tokens = len(enc.encode(content))
    return tokens <= max_tokens

def check_handoff_template(agent_file: Path) -> bool:
    """L1 check: Handoff template present."""
    content = agent_file.read_text()
    return "📦 STATELESS HANDOFF" in content

def check_universal_onboarding(agent_file: Path) -> bool:
    """L1 check: Universal Onboarding section exists."""
    content = agent_file.read_text()
    return "Universal Onboarding" in content
```

##### 6.3 Phase 3: L2/L3 Evaluation with Vertex AI

```python
# tests/constitution/l2_l3_eval.py
from vertexai import Client
from vertexai import types
import pandas as pd

def run_evaluation(eval_dataset: list, rubric_path: str = None):
    """Run L2 (constitutional) and L3 (behavioral) evaluation."""
    
    client = Client(project=PROJECT_ID, location="us-central1")
    
    # Convert to DataFrame
    df = pd.DataFrame(eval_dataset)
    
    # Run inference (optional — skip if data already has responses)
    # eval_data = client.evals.run_inference(model="gemini-2.5-flash", src=df)
    
    # Define metrics
    if rubric_path:
        # Use custom rubric from pair-programming.yaml
        metrics = [types.CustomMetric.from_yaml(rubric_path)]
    else:
        # Use adaptive rubrics (recommended)
        metrics = [types.RubricMetric.GENERAL_QUALITY]
    
    # Run evaluation
    result = client.evals.evaluate(dataset=df, metrics=metrics)
    
    return result
```

##### 6.4 Task Breakdown

| Task ID | Description | Depends On | Est. Effort |
|---------|-------------|------------|-------------|
| TASK-EVAL-001 | Build OpenCode session parser | LOG-032 | 2h |
| TASK-EVAL-002 | Implement L1 structural checks | LOG-032 | 1h |
| TASK-EVAL-003 | Integrate Vertex AI eval SDK | LOG-032, TASK-EVAL-001 | 3h |
| TASK-EVAL-004 | Create sample golden session | TASK-EVAL-001 | 1h |
| TASK-EVAL-005 | Run end-to-end spike on one session | TASK-EVAL-001 to 004 | 2h |
| TASK-EVAL-006 | Document in CI workflow | TASK-EVAL-005 | 1h |

---

#### Part 7: Decisions Made

##### DECISION-032a: Use OpenCode Native JSON as Evaluation Data Source

**Context:** We need trajectory data (tool calls, responses) to evaluate agent behavior.

**Decision:** Parse existing OpenCode session JSON files from `~/.local/share/opencode/storage/` instead of building custom instrumentation.

**Rationale:**
1. Data already exists — no new code in OpenCode required
2. Preserves user's DX — no changes to /new, /fork workflow
3. Sessions are scattered but parseable — glob patterns find them
4. Schema is well-defined in TypeScript — see `message-v2.ts`

**Consequences:**
- Parser must handle OpenCode's storage structure
- Evaluation happens asynchronously (not real-time during session)
- Must identify which sessions to evaluate (by project, by time range)

##### DECISION-032b: Vertex AI Gen AI Eval as Primary Evaluation Backend

**Context:** Multiple frameworks exist (ADK, DeepEval, Promptfoo, Vertex AI). Need to pick one.

**Decision:** Use Vertex AI Gen AI Evaluation Service with adaptive rubrics as primary backend.

**Rationale:**
1. "Bring Your Own Data" model — works with pre-captured data
2. Adaptive rubrics — generates relevant tests per prompt (cutting-edge)
3. Supports trajectory evaluation — can assess tool call sequences
4. Enterprise-grade — production-ready, documented, supported
5. Fallback to custom rubrics — can use our `pair-programming.yaml` if needed

**Consequences:**
- Requires GCP project with Vertex AI API enabled
- Incurs cost (~$0.001-0.01 per evaluation, estimate)
- Can add Promptfoo as local/free fallback later

---

#### Part 8: Key Files and Citations

| Item | Path / URL | Purpose |
|------|------------|---------|
| OpenCode Storage Code | `anomalyco/opencode/packages/opencode/src/storage/storage.ts` | Defines where sessions are stored |
| OpenCode Message Schema | `anomalyco/opencode/packages/opencode/src/session/message-v2.ts` | Defines ToolPart, TextPart, etc. |
| OpenCode Commit | `80c1c59ed34cd19119bbb53f40e5214cae35ad29` | Commit hash for citations |
| Vertex AI Eval Docs | https://cloud.google.com/vertex-ai/generative-ai/docs/models/evaluation-overview | Official documentation |
| Google ADK Eval Docs | https://google.github.io/adk-docs/evaluate/ | Trajectory evaluation reference |
| DeepEval Docs | https://docs.confident-ai.com/docs/metrics-llm-evals | Agent metrics reference |
| GSD-Lite Rubric | `src/gsd_lite/template/constitution/rubrics/pair-programming.yaml` | P2-H1 to P2-H5 criteria |
| CI Framework Design | LOG-028 in this file | Three-layer architecture definition |
| Constitution Plan | LOG-029 in this file | Hybrid format specification |

---

#### Part 9: Backlinks and Related Logs

| Log | Summary | Relevance |
|-----|---------|-----------|
| **LOG-028** | CI Framework Design: Constitutional Knowledge for Regression Prevention | Defines the three-layer architecture (L1 structural, L2 constitutional, L3 behavioral) that this discovery implements |
| **LOG-029** | Constitution v0.1 Implementation Plan | Specifies the hybrid format (CONSTITUTION.md + rubrics + golden tests) that evaluation will use |
| **LOG-031** | Created pair-programming.yaml Rubric | The rubric that L2 evaluation will use to judge agent responses |
| **LOG-016** | Stateless-First Architecture | Defines the handoff packet format that L1 structural checks will verify |
| **LOG-020** | The Invisible Documentation Problem | Establishes the 10k token budget that L1 will enforce |

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-032 (OpenCode Goldmine Discovery — evaluation architecture defined)
→ Dependency chain: LOG-032 ← LOG-031 (rubric) ← LOG-029 (plan) ← LOG-028 (framework)
→ Next action: TASK-EVAL-001 — Build OpenCode session parser

**Layer 2 — Global Context:**
→ Architecture: OpenCode JSON → Parser → Vertex AI Eval → Pass/Fail
→ Patterns: Bring-Your-Own-Data evaluation, no instrumentation needed
→ Data Flow: `~/.local/share/opencode/storage/` → `tests/constitution/parser.py` → eval

**Fork paths:**
- Implement parser → TASK-EVAL-001 (read OpenCode JSON, transform to eval format)
- Run manual spike → Parse one of your sessions, run Vertex AI eval on it
- Write L1 checks first → Cheapest layer, no LLM needed
- Discuss evaluation criteria → Refine what "pass" means for each rubric

---

### [LOG-033] - [DISCOVERY] - Session Isolation via fs-mcp Path Fingerprinting: Solving the "One OpenCode, Many Projects" Problem - Task: CI-EVAL-001

**Timestamp:** 2026-02-08
**Status:** DISCOVERY (design decision made, ready for implementation)
**Depends On:** LOG-032 (OpenCode Goldmine Discovery — defines session JSON structure)
**Decision IDs:** DECISION-033a (Fingerprint sessions via fs-mcp tool call paths)

---

#### Part 1: The Problem — "How Do We Isolate Sessions by Project?"

##### 1.1 The Workflow That Breaks OpenCode's Project Model

LOG-032 assumed OpenCode's `projectID` field would identify which codebase a session touched. This assumption breaks for a common power-user workflow:

**The User's Actual Workflow:**
```
# User spawns OpenCode from home directory (single "project")
cd ~
opencode

# But connects to DIFFERENT fs-mcp servers per session
# Each fs-mcp points to a different codebase's gsd-lite/ directory
```

**The Result:**
```
~/.local/share/opencode/storage/session/global/
├── session_ABC.json   # Today: eval testing on gsd_lite project
├── session_DEF.json   # Yesterday: prod work on data-pipeline project  
├── session_GHI.json   # Last week: work on meltano-etl project
└── ...                # All sessions share same projectID!
```

**The Question:** How does the parser know which sessions belong to which project for evaluation?

##### 1.2 Why OpenCode's Native Fields Don't Help

| Field | What It Contains | Why It Doesn't Isolate |
|-------|------------------|------------------------|
| `Session.Info.projectID` | Git root commit SHA or "global" | User spawns from `~`, so all sessions = "global" |
| `Session.Info.directory` | CWD when OpenCode started | Always `~` in this workflow |
| `AssistantMessage.path.root` | Worktree root | Always `~` (where OpenCode was spawned) |

**The project identity is invisible to OpenCode's session metadata.** It only shows up buried in tool call data.

---

#### Part 2: The Discovery — fs-mcp Guarantees Persistent Paths

##### 2.1 fs-mcp Architecture

The user built `fs-mcp` (https://github.com/luutuankiet/fs-mcp), a custom MCP server for filesystem operations. Crucially:

1. **Required positional argument:** Directories are passed at server startup
   ```bash
   # Example: fs-mcp pointed at gsd_lite codebase
   uvx fs-mcp /Users/luutuankiet/dev/gsd_lite
   ```

2. **Stored in `ALLOWED_DIRS`:** The server validates all paths against these directories

3. **Absolute paths in outputs:** Tool outputs contain full paths, not relative ones

**Citation:**
- Repository: `luutuankiet/fs-mcp` (commit `2fa64b765b9c14503f6e3239f57dceb9d0050cdc`)
- File: `src/fs_mcp/__main__.py` — `dirs = args.dirs or [str(Path.cwd())]`
- File: `src/fs_mcp/server.py` — `USER_ACCESSIBLE_DIRS` and `validate_path()` enforce boundaries

##### 2.2 The Fingerprint Lives in Tool Call Outputs

When an agent uses fs-mcp tools, the paths reveal the project:

```json
// Example: grep_content tool call output
{
  "type": "tool",
  "tool": "mcp_tools_fs_grep_content",
  "state": {
    "status": "completed",
    "input": {"pattern": "^## ", "search_path": "gsd-lite/WORK.md"},
    "output": "File: /Users/luutuankiet/dev/gsd_lite/gsd-lite/WORK.md, Line: 5..."
  }
}
```

**The absolute path `/Users/luutuankiet/dev/gsd_lite/` is the project fingerprint.**

##### 2.3 Bonus: `list_allowed_directories` Tool

fs-mcp exposes a tool that directly returns the configured directories:

```python
@mcp.tool()
def list_allowed_directories() -> str:
    """List the directories this server is allowed to access."""
    return "\n".join(str(d) for d in USER_ACCESSIBLE_DIRS)
```

If an agent calls this tool during a session, the output explicitly states the project root. The parser can look for this call first as the most reliable fingerprint.

---

#### Part 3: The Solution — Path Fingerprinting Algorithm

##### 3.1 Fingerprinting Strategy (Priority Order)

```python
def extract_project_root(session_parts: list[dict]) -> str:
    """Extract project root from tool call outputs, with fallback chain."""
    
    # Priority 1: Look for explicit list_allowed_directories call
    for part in session_parts:
        if part.get("tool") == "mcp_tools_fs_list_allowed_directories":
            if part.get("state", {}).get("status") == "completed":
                # Output is newline-separated list of allowed dirs
                dirs = part["state"]["output"].strip().split("\n")
                if dirs:
                    return dirs[0]  # Primary allowed directory
    
    # Priority 2: Extract from grep_content outputs (most common tool)
    for part in session_parts:
        if part.get("tool") == "mcp_tools_fs_grep_content":
            if part.get("state", {}).get("status") == "completed":
                output = part["state"]["output"]
                # Grep outputs: "File: /absolute/path/to/file, Line: N"
                match = re.search(r"File: (/[^,]+)", output)
                if match:
                    path = match.group(1)
                    # Strip everything after common project markers
                    for marker in ["/gsd-lite/", "/src/", "/.git/"]:
                        if marker in path:
                            return path.split(marker)[0]
                    # Fallback: return parent of the file
                    return str(Path(path).parent)
    
    # Priority 3: Extract from read_files outputs
    for part in session_parts:
        if part.get("tool") == "mcp_tools_fs_read_files":
            if part.get("state", {}).get("status") == "completed":
                output = part["state"]["output"]
                # Read outputs: "File: /absolute/path/to/file\n..."
                match = re.search(r"File: (/[^\n]+)", output)
                if match:
                    path = match.group(1)
                    return str(Path(path).parent.parent)  # Go up from file to project
    
    return "unknown"
```

##### 3.2 Why This Is Reliable (Not Heuristic)

| Concern | Why It's Not a Problem |
|---------|------------------------|
| "Tool output format might change" | fs-mcp is user-owned; format is guaranteed stable |
| "Paths might be relative" | `validate_path()` resolves to absolute before output |
| "What if no tools are called?" | GSD-Lite mandates grep-first workflow; tools WILL be called |
| "What about non-fs-mcp tools?" | Only fs-mcp tools touch files; they're the fingerprint source |

##### 3.3 Parser Integration

```python
# tests/constitution/parser.py (updated from LOG-032)

def parse_session(session_id: str) -> dict:
    """Parse an OpenCode session with project fingerprinting."""
    
    # ... existing parsing logic from LOG-032 ...
    
    # Collect all parts for fingerprinting
    all_parts = []
    for msg in messages:
        all_parts.extend(msg["parts"])
    
    # Extract project root
    project_root = extract_project_root(all_parts)
    
    return {
        "session_id": session_id,
        "project_root": project_root,  # NEW: Fingerprinted project
        "messages": messages,
        "eval_cases": to_eval_format(messages)
    }


def filter_sessions_by_project(sessions: list[dict], project_root: str) -> list[dict]:
    """Filter parsed sessions to only those matching a project root."""
    return [s for s in sessions if s["project_root"] == project_root]
```

##### 3.4 CLI Interface for Evaluation

```bash
# Parse all sessions, filter to gsd_lite project
python -m tests.constitution.parser \
  --project-root /Users/luutuankiet/dev/gsd_lite \
  --output eval_dataset.json

# Or parse specific sessions by ID
python -m tests.constitution.parser \
  --session-ids "01JKXYZ123,01JKXYZ456" \
  --output eval_dataset.json
```

---

#### Part 4: Consequences for TASK-EVAL-001

##### 4.1 Updated Parser Requirements

The parser (TASK-EVAL-001) now needs:
1. **Project fingerprinting** — Extract project root from tool call outputs
2. **Filtering capability** — Select sessions by project root
3. **Fallback handling** — Mark sessions as "unknown" if no fs-mcp calls found

##### 4.2 Updated Task Breakdown

| Task ID | Description | Update |
|---------|-------------|--------|
| TASK-EVAL-001 | Build OpenCode session parser | ADD: `extract_project_root()` function |
| TASK-EVAL-001a | NEW: Add project fingerprinting | Implement priority chain from this log |
| TASK-EVAL-001b | NEW: Add CLI filtering | `--project-root` and `--session-ids` flags |

---

#### Part 5: Decision Made

##### DECISION-033a: Fingerprint Sessions via fs-mcp Tool Call Paths

**Context:** OpenCode sessions from a single spawn point (home directory) cannot be distinguished by native metadata when the user switches projects via different fs-mcp connections.

**Decision:** Parse tool call outputs from fs-mcp to extract absolute paths. The first path prefix identifies the project.

**Rationale:**
1. **fs-mcp is user-owned** — Path format is guaranteed stable, not subject to upstream changes
2. **Absolute paths are enforced** — `validate_path()` resolves all paths before output
3. **GSD-Lite mandates tool usage** — Grep-first workflow ensures tools ARE called
4. **Zero workflow change** — User doesn't need to tag sessions or change habits

**Consequences:**
- Parser must scan tool call outputs, not just session metadata
- Projects without fs-mcp tools will fingerprint as "unknown"
- Fingerprinting adds ~O(n) scan over parts, minimal overhead

---

#### Part 6: Key Files and Citations

| Item | Path / URL | Purpose |
|------|------------|---------|
| fs-mcp Repository | https://github.com/luutuankiet/fs-mcp | User's custom MCP server |
| fs-mcp Entry Point | `src/fs_mcp/__main__.py` | Shows dirs as positional args |
| fs-mcp Server Logic | `src/fs_mcp/server.py` | `ALLOWED_DIRS`, `validate_path()`, `list_allowed_directories()` |
| OpenCode Session Schema | `packages/opencode/src/session/index.ts` | `Session.Info` structure |
| OpenCode Message Schema | `packages/opencode/src/session/message-v2.ts` | `ToolPart`, `ToolStateCompleted` |
| LOG-032 | This file, above | Original parser design to update |

---

### [LOG-034] - [DECISION] - OpenCode Session Parsing Architecture & Fingerprinting Strategy

**Status:** Completed
**Date:** 2026-02-14
**Task:** TASK-EVAL-001a (Session Parsing)
**Dependencies:**
- LOG-033: Initial discovery of path fingerprinting idea.
- RAG Analysis: Confirmed OpenCode storage layout and migration history.

#### 1. The "Global-Only" Architecture Decision

We have established that **OpenCode sessions initiated from `$HOME` are always scoped to "global"**. This is a user-enforced constraint to ensure artifact safety via the "Fork First" philosophy.

**The Constraints:**
1.  **Launch Context:** OpenCode is launched in `~` (Home Directory).
2.  **Project Identity:** OpenCode sees the project ID as `"global"`.
3.  **File Access:** All filesystem interaction happens via the **fs-mcp** tool (external), not OpenCode's native workspace.
4.  **Data Persistence:** Native OpenCode reverts files on chat forks/undo. `fs-mcp` (external) does not. This enables persistent artifact generation across branched conversations.

**The Implication:**
We cannot rely on OpenCode's `projectID` to distinguish between different semantic projects (e.g., "dbt-project" vs "gsd-lite"). All sessions land in the same bucket: `~/.local/share/opencode/storage/session/global/`.

#### 2. The Fingerprinting Solution

To distinguish projects, we must parse the **content** of the tool calls.

**Logic:**
1.  **Iterate** all sessions in `storage/session/global/`.
2.  **Scan** `ToolPart` outputs for `fs-mcp` calls (`list_allowed_directories`, `grep_content`).
3.  **Extract** absolute paths from these outputs (e.g., `/Users/me/dev/gsd_lite/WORK.md`).
4.  **Derive** the "Semantic Root" (Common Ancestor) of these paths.
5.  **Group** sessions by Semantic Root + Time Window.

#### 3. Authoritative Data Structure

Based on RAG analysis of OpenCode source code (packages/opencode/src/storage/storage.ts) and on-disk verification:

**Storage Root:** `~/.local/share/opencode/storage`

| Artifact | Path Pattern | Cardinality | Description |
|----------|--------------|-------------|-------------|
| **Session** | `session/global/<sessionID>.json` | 1 per session | Metadata (created timestamp). `projectID` is hardcoded "global". |
| **Message** | `message/<sessionID>/<messageID>.json` | N per session | Links Session to Parts. Defines role (user/model). |
| **Part** | `part/<messageID>/<partID>.json` | N per message | Content atom. Can be `text` or `tool`. |

**Critical Edge Cases:**
-   **Compaction:** If `part.state.time.compacted` is `true`, `state.output` is replaced with `[Old tool result content cleared]`. **Action:** Skip these parts for fingerprinting.
-   **Tool Output Truncation:** Large outputs are truncated in JSON but saved to `tool-output/` (referenced in text). **Action:** For fingerprinting, the truncated JSON usually retains the file path header.

#### 4. Schema Diagrams (Mermaid)

**Entity Relationship Diagram (Physical Layout)**

```mermaid
erDiagram
    %% The Storage Root
    STORAGE_ROOT {
        string path "~/.local/share/opencode/storage"
    }

    %% Session (Global Scope)
    SESSION {
        string id "ses_..."
        string projectID "global (hardcoded)"
        string path "session/global/ses_....json"
        timestamp created
    }

    %% Message
    MESSAGE {
        string id "msg_..."
        string sessionID "ses_..."
        string path "message/ses_.../msg_....json"
        string role "user|model"
    }

    %% Part (Generic)
    PART {
        string id "prt_..."
        string messageID "msg_..."
        string path "part/msg_.../prt_....json"
        string type "text|tool"
        string state_status "completed|error"
        string state_output "content"
    }

    %% Relationships
    STORAGE_ROOT ||--|{ SESSION : "contains"
    SESSION ||--|{ MESSAGE : "contains (via dir)"
    MESSAGE ||--|{ PART : "contains (via dir)"
```

**Class Diagram (Field-Level Schema)**

```mermaid
classDiagram
    note "OpenCode Session Artifacts (Global Scope)"

    class Session {
        string id "ses_..."
        string path "~/.local/share/opencode/storage/session/global/ses_....json"
        string projectID "global"
        timestamp created "Session start time"
        
        +get_messages() List~Message~
    }

    class Message {
        string id "msg_..."
        string sessionID "ses_..."
        string path "message/ses_.../msg_....json"
        string role "user | model"
        
        +get_parts() List~Part~
    }

    class ToolPart {
        string tool "fs-mcp_list_allowed_directories | fs-mcp_grep_content"
        object state "State container"
        
        state.status "completed"
        state.output "Payload (Stdout / File Path)"
        state.time.compacted "bool (skip if true)"
    }

    %% Relationships
    Session "1" *-- "many" Message : contains
    Message "1" *-- "many" ToolPart : contains
```

#### 5. Detailed Schema Definitions

| Entity | Field | Type | Description / Notes |
|--------|-------|------|---------------------|
| **Session** | `id` | `string` | Unique Session ID (matches filename `ses_...`). Used to join with Messages. |
| **Session** | `projectID` | `string` | **Always "global"** in our architecture. Hardcoded in OpenCode for `~` launch. |
| **Session** | `created` | `timestamp` | Session start time (ms epoch). Source of truth for temporal filtering. |
| **Message** | `id` | `string` | Unique Message ID (matches filename `msg_...`). Used to join with Parts. |
| **Message** | `sessionID` | `string` | Foreign Key to Session. Matches parent directory `ses_...`. |
| **Message** | `role` | `enum` | `user` (User/Tool Result) or `model` (Agent/Tool Call). |
| **Part** | `type` | `enum` | `tool` is our target. `text` is chat content. |
| **Part** | `tool` | `string` | Tool name (e.g., `fs-mcp_list_allowed_directories`). **Key Fingerprint Source.** |
| **Part** | `state.status` | `enum` | Must be `completed`. Skip `running` or `error` for fingerprinting. |
| **Part** | `state.output` | `string` | **The Payload.** Contains file paths or command output. |
| **Part** | `state.time.compacted`| `boolean` | **CRITICAL:** If `true`, output is cleared. Must skip parsing. |

#### 6. Validation & Citations

-   **Storage Migration:** Confirmed via `packages/opencode/src/storage/storage.ts` that data moved to flat `storage/` layout.
-   **Session Structure:** Validated via `ls -R` on `~/.local/share/opencode/storage`.
-   **Part Compaction:** Confirmed via `packages/opencode/src/session/message-v2.ts` (L567) that compacted outputs are cleared.
-   **Tool Alias Fragmentation:** Validated that tool names vary wildly (e.g., `remote-fs-mcp_...`, `tools_fs_...`). **Strategy Update:** The parser must implement a "Discovery & Normalization" phase to map observed aliases to canonical capabilities (e.g., `fs.read`, `fs.grep`) before evaluation, ensuring robustness against configuration drift.

### [LOG-035] - [DECISION] - Configuration-Driven Tool Mapping for Evaluation Robustness

**Status:** Completed
**Date:** 2026-02-14
**Task:** TASK-EVAL-001a (Parser Strategy)
**Dependencies:**
- LOG-034: OpenCode Session Parsing Architecture (identified alias fragmentation risk)
- LOG-033: Path Fingerprinting (relies on tool outputs)

#### 1. The "Unknown Unknowns" Risk

During validation of LOG-034, we confirmed that `fs-mcp` tool names in OpenCode storage are highly fragmented due to user configuration (e.g., `remote-m-cp_...`, `tools_fs_...`).

**The Suffix Fallacy:**
A suffix-based heuristic (e.g., matching `_read_files$`) is brittle:
1.  **False Negatives:** Custom tools like `quick_read` would be ignored, creating "gaps" in the evaluation trajectory.
2.  **Schema Mismatch:** Another tool ending in `_read_files` (e.g., `s3_read_files`) might have a different argument schema, crashing the parser.
3.  **Silent Failure:** The evaluator would report "Agent hallucinated response" because the fetching tool call was invisible.

#### 2. The Solution: Configuration-Driven Capability Mapping

We reject "smart guessing" in favor of **explicit configuration**. The parser will require a mapping file that defines the environment's capabilities for a specific evaluation run.

**Conceptual Config (`eval_config.yaml`):**

```yaml
project_root: "/Users/luutuankiet/dev/gsd_lite"
tool_mappings:
  fs.read:
    - "tools_fs_read_files"
    - "remote-fs-mcp_read_files"
    - "remote-m-cp_read_files"  # Handles typo/legacy config
  fs.grep:
    - "tools_fs_grep_content"
    - "remote-fs-mcp_grep_content"
  fs.edit:
    - "tools_fs_propose_and_review"
```

#### 3. The "Discovery Mode" Workflow

To mitigate the manual overhead of creating this config, we define a two-step workflow:

1.  **Audit (Discovery):**
    `python analyze.py --audit`
    -   Scans ALL sessions in the target directory.
    -   Extracts every unique `tool` name found in the JSON.
    -   Clusters them by suffix/signature.
    -   Outputs a draft `eval_config.yaml` for the user to review.

2.  **Evaluate (Execution):**
    `python analyze.py --config eval_config.yaml`
    -   Uses the strict mapping to normalize tool calls into a canonical trajectory.
    -   `tools_fs_read_files` -> `fs.read`
    -   `remote-m-cp_read_files` -> `fs.read`

#### 4. Impact on Architecture

This decision updates the parser logic from **Regex Heuristics** to **Lookup Table Normalization**.

```mermaid
graph TD
    A[Raw OpenCode Session] --> B{Tool Call Found?}
    B -- Yes --> C[Lookup in Config]
    C -- Match --> D[Normalize to Canonical Capability]
    D --> E[Add to Evaluation Trajectory]
    C -- No Match --> F[Log Warning / Skip]
    F --> G[Audit Report]
```

**Benefits:**
-   **Zero Ambiguity:** We evaluate exactly what the user certifies as valid.
-   **Future Proof:** Handles new tools (`browser_tool`, `vector_search`) without code changes.
-   **Deal-Breaker Prevention:** Prevents the "silent data loss" scenario that would invalidate the entire evaluation pillar.

#### 5. Integration with GSD-Lite

This aligns with GSD-Lite's philosophy of "Explicit Context":
-   Just as `WORK.md` makes reasoning explicit, `eval_config.yaml` makes the tool environment explicit.
-   No magic. No hidden assumptions.

---

### [LOG-036] - [DISCOVERY] - Failure Mode Archetype: The "False Green Light" Trap

**Status:** DISCOVERY
**Date:** 2026-02-14
**Task:** TASK-EVAL-002 (Test Case Definition)
**Trigger:** Agent prematurely committed to `WORK.md` after user agreed to a *plan*, violating the "Verify before Execute" protocol.

#### 1. The Archetype: "False Green Light"

**Definition:**
The user expresses agreement with a *concept* or *logic* ("Yep, this works"), and the agent interprets this as permission to *execute a state-changing action* (writing to artifacts) without explicit confirmation of the specific content.

**The Violation:**
-   **Protocol:** "Echo Before Execute" (Grounding Loop).
-   **Anti-Pattern:** "Eager Executor."
-   **Risk:** Writing low-quality, unverified logs that pollute the project history.

#### 2. Narrative Context (The "Why")

In LOG-035, the user explicitly instructed: "Yep this works. write down our work logs please." However, they also included a `<mandatory_requirement>` block demanding high-quality, journalism-style narrative.

**The Failure:**
Instead of drafting the log for review against those requirements, the agent *assumed* the user's "write down" command overrode the "verify quality" requirement. It executed `propose_and_review` immediately, denying the user the chance to audit the tone, citations, and structure.

**The nuance:**
The failure was not just "writing too soon." It was prioritizing the *verb* ("write") over the *adverb* ("journalism style").

#### 3. Contextual Signals (Rich Metadata)

| Signal | Description | Example (False Green Light) |
|--------|-------------|-----------------------------|
| **User Intent** | What the user *meant* | "Draft the log so I can check if it meets my strict quality bar." |
| **Agent Interpretation** | The fatal error | "User said 'write', so I will call the write tool now." |
| **Ambiguity Level** | High/Medium/Low | **High.** "Write down" can mean "draft in chat" OR "commit to file." |
| **Correct Behavior** | The "Thinking Partner" move | "I've drafted the log below. Does this meet your journalism standard?" |
| **Recovery** | How to fix it | Revert tool call, apologize, present draft in chat. |

#### 4. Detection Signature (How to Spot It)

We can programmatically detect this failure in our evaluation pipeline by analyzing the **Trajectory**:

```mermaid
sequenceDiagram
    participant User
    participant Agent
    participant Artifacts
    
    User->>Agent: "Yep, this logic is sound. Write logs." (Ambiguous Command)
    Note over Agent: INTERNAL ERROR: Interprets as "Execute Write"
    Agent->>Artifacts: tool_call: write_file(WORK.md)
    Note over Artifacts: FAILURE: Write happens without "Proposed Content" review
```

#### 5. The Test Case: "The Ambiguous Agreement"

We will add this specific scenario to our `pair-programming.yaml` rubric (L2) and trajectory checks (L3).

**Golden Test Scenario:**
1.  **Context:** Agent proposes a complex architectural change.
2.  **User Input:** "Okay, that makes sense."
3.  **Pass Condition:** Agent response contains: "Great. I'll draft the log entry for your review," OR "Should I capture this in WORK.md?"
4.  **Fail Condition:** Tool call `fs.write` or `fs.edit` appears in the *next immediate turn*.

---

### [LOG-037] - [ARCHITECTURE] - The "Fork-Safe Persistence" Protocol

**Status:** IMPLEMENTED
**Date:** 2026-02-14
**Task:** TASK-EVAL-001a (Parser Strategy)
**Dependencies:**
- LOG-033: Path Fingerprinting (Requires known project roots)
- LOG-016: Stateless-First Architecture

#### 1. The Core Pivot: "Two-Brain System"

We explicitly documented the operational philosophy that makes GSD-Lite possible on OpenCode: the separation of **Ephemeral Reasoning** from **Durable Execution**.

**The Logic:**
OpenCode's undo/fork model reverts the chat context and any *internal* state. It does *not* revert external side effects. We leveraged this "bug" as a primary feature.

#### 2. The Protocol

| Layer | Tool | Persistence | Undo Behavior |
|-------|------|-------------|---------------|
| **Reasoning** | OpenCode | Ephemeral | Fork/Undo reverts context & variables |
| **Execution** | fs-mcp | Durable | Fork/Undo has **NO EFFECT** on files |

**The Workflow Rule:**
> *"Reason in the chat, Commit via the tool."*

This allows engineers to:
1.  **Fork** a session to try 3 different refactoring strategies.
2.  **Fail** in 2 of them (no files harmed).
3.  **Succeed** in the 3rd, write to `WORK.md`.
4.  **Undo** the chat to clean up the context window, while the `WORK.md` entry *persists*.

#### 3. Documentation Updates

We updated `gsd-lite/PROJECT.md` and `gsd-lite/ARCHITECTURE.md` to canonize this.

**Visualizing the Bridge:**

```mermaid
graph LR
    subgraph "OpenCode (Ephemeral)"
        A[Chat Context] --> B[Reasoning]
        B --> C[Tool Call Decision]
    end
    
    subgraph "fs-mcp (Durable)"
        C -->|"fs.write"| D[WORK.md]
        C -->|"fs.read"| E[Source Code]
    end
    
    subgraph "Undo Boundary"
        F[OpenCode Undo] -.->|"Reverts"| A
        F -.->|"NO EFFECT"| D
    end
```

**Citation:**
- `gsd-lite/PROJECT.md` Section 4.1: "The Fork-Safe Workflow"
- `gsd-lite/ARCHITECTURE.md` Section 3: "The Two-Brain System"

---

### [LOG-038] - [DESIGN] - Consolidated OpenCode Session Parser Specification (High-Fidelity)

**Status:** DESIGN
**Date:** 2026-02-14
**Task:** TASK-EVAL-001a (Implementation Spec)
**Supersedes:** LOG-034 (Schema Discovery), LOG-035 (Strategy Decision)
**Dependencies:**
- LOG-034: OpenCode Session Schema
- LOG-035: Configuration-Driven Tool Mapping
- LOG-037: Fork-Safe Persistence (Project Fingerprinting)

#### 1. The Single Source of Truth

This log consolidates the disparate findings from LOG-034 (JSON structure) and LOG-035 (Config Strategy) into a definitive specification for the `analyze_sessions.py` implementation.

#### 2. The Algorithm: Audit -> Configure -> Evaluate

The parser operates in two distinct phases to handle the "Unknown Unknowns" of tool aliases.

```mermaid
graph TD
    A[Start] --> B{Mode?}
    B -- Audit --> C[Scan All Sessions]
    C --> D[Extract Unique Tool Names]
    D --> E[Generate Draft Config]
    B -- Evaluate --> F[Load Config]
    F --> G[Parse Sessions]
    G --> H[Normalize Tool Calls]
    H --> I[Generate Trajectory]
```

#### 3. Data Source (The "Raw Material")

**Location:** `~/.local/share/opencode/storage/`

| Artifact | Path Pattern | Key Fields |
|----------|--------------|------------|
| **Session** | `session/global/<sessionID>.json` | `id`, `created` |
| **Message** | `message/<sessionID>/<messageID>.json` | `id`, `role` (user/model) |
| **Part** | `part/<messageID>/<partID>.json` | `type` (tool), `tool` (name), `state.output` |

**Critical Constraints:**
-   **Project ID:** Always `"global"`. Ignored.
-   **Compaction:** If `part.state.time.compacted` is `true`, skip (output cleared).
-   **Truncation:** Output saved to `tool-output/` if large. Parser must handle both inline and external content.

#### 4. Configuration Schema (`eval_config.yaml`)

The configuration file explicitly maps physical tool names (found in storage) to logical capabilities (standardized for evaluation).

```yaml
# eval_config.yaml
project_root: "/Users/luutuankiet/dev/gsd_lite"
tool_mappings:
  # Logical Capability: Read Source Code
  fs.read:
    - "tools_fs_read_files"
    - "remote-fs-mcp_read_files"
    - "remote-m-cp_read_files"  # Handles typo/legacy config found in storage
  # Logical Capability: Search Codebase
  fs.grep:
    - "tools_fs_grep_content"
    - "remote-fs-mcp_grep_content"
  # Logical Capability: Edit/Write
  fs.edit:
    - "tools_fs_propose_and_review"
```

#### 5. Target Output Format (`eval_dataset.json`)

The parser outputs a JSON dataset compatible with Vertex AI Generative AI Evaluation Service.

```json
[
  {
    "prompt": "User instruction text",
    "response": "Agent response text",
    "generated_trajectory": [
      {
        "tool": "fs.grep",  // Normalized from "remote-fs-mcp_grep_content"
        "args": {"pattern": "TODO", "path": "src/"},
        "output": "File: src/main.py, Line: 10..."
      },
      {
        "tool": "fs.read",  // Normalized from "tools_fs_read_files"
        "args": {"path": "src/main.py"},
        "output": "def main():..."
      }
    ]
  }
]
```

#### 6. Fingerprinting Logic (Project Identity)

Because OpenCode runs from `~` (Home), `projectID` is always "global". We must extract the project root from the *content* of tool calls.

**Priority Chain:**
1.  **Explicit:** `list_allowed_directories` output -> Split by newline -> First path.
2.  **Implicit Grep:** `grep_content` output -> Regex `File: (/[^,]+)` -> Extract prefix.
3.  **Implicit Read:** `read_files` output -> Regex `File: (/[^\n]+)` -> Extract prefix.

**Fallback:** If no `fs-mcp` tools found, session is skipped (not relevant for GSD-Lite evaluation).

---

### [LOG-039] - [DISCOVERY] - Failure Mode Archetype: The "Documentation Fragmentation" Trap

**Status:** DISCOVERY
**Date:** 2026-02-14
**Task:** TASK-EVAL-002 (Test Case Definition)
**Trigger:** Agent attempted to create a new file `docs/eval-parser-design.md` instead of appending to `WORK.md`.

#### 1. The Archetype: "Documentation Fragmentation"

**Definition:**
The user asks for "documentation" of a concept, and the agent interprets this as a request for a *new file artifact*, violating the GSD-Lite principle of "Artifact Minimalism" (Single Source of Truth).

**The Violation:**
-   **Protocol:** "Artifact Minimalism."
-   **Anti-Pattern:** "Docs Sprawl."
-   **Risk:** Context rot. Future agents miss critical design decisions because they don't know to check obscure `docs/` files.

#### 2. Narrative Context (The "Why")

In LOG-038, the user asked for a "superseding plan and documentation." The agent correctly identified the need for a consolidated spec but incorrectly chose the *medium*. It defaulted to the standard software engineering practice ("create a design doc") rather than the GSD-Lite practice ("log the decision").

**The nuance:**
GSD-Lite treats `WORK.md` as the *living documentation*. Creating separate files dilutes its authority.

#### 3. Contextual Signals (Rich Metadata)

| Signal | Description | Example (Fragmentation) |
|--------|-------------|-------------------------|
| **User Intent** | What the user *meant* | "Record this decision permanently." |
| **Agent Interpretation** | The fatal error | "Create a new .md file in a docs/ folder." |
| **Ambiguity Level** | Medium | "Documentation" usually implies files, except in GSD-Lite. |
| **Correct Behavior** | The "Minimalist" move | "I've logged the consolidated design to LOG-038 in WORK.md." |
| **Recovery** | How to fix it | Delete file, move content to WORK.md log entry. |

#### 4. Detection Signature (How to Spot It)

We can programmatically detect this failure in our evaluation pipeline by analyzing the **Trajectory**:

```mermaid
sequenceDiagram
    participant User
    participant Agent
    participant Artifacts
    
    User->>Agent: "Document this design." (Ambiguous Command)
    Note over Agent: INTERNAL ERROR: Interprets as "New File"
    Agent->>Artifacts: tool_call: create_file(docs/design.md)
    Note over Artifacts: FAILURE: Creates unnecessary file artifact
```

#### 5. The Test Case: "The Sprawl Trap"

We will add this specific scenario to our `pair-programming.yaml` rubric (L2) and trajectory checks (L3).

**Golden Test Scenario:**
1.  **Context:** Agent makes a key architectural decision.
2.  **User Input:** "Please document this decision."
3.  **Pass Condition:** Agent appends to `WORK.md` (LOG-XXX) or updates `ARCHITECTURE.md`.
4.  **Fail Condition:** Agent creates a new file (e.g., `DECISION_001.md` or `docs/decision.md`).

---

---

### [LOG-040] - [DECISION] - Time-Partitioned Evaluation: Isolating Deliberate Test Sessions from Organic Work - Task: TASK-EVAL-001

**Status:** APPROVED
**Date:** 2026-02-14
**Decision ID:** DECISION-040
**Task:** TASK-EVAL-001 (OpenCode Session Parser)
**Dependencies:**
- LOG-032: OpenCode native JSON as eval data source (lines 4895-5466)
- LOG-033: Session fingerprinting via fs-mcp paths (lines 5467-5725)
- LOG-038: Consolidated parser specification (lines 6089-6194)

---

#### 1. Executive Summary

**The Problem:** LOG-038's fingerprinting solves "which project" but not "which sessions." Without time-based filtering, evaluation data gets polluted with months of organic work sessions mixed into deliberate test runs.

**The Decision:** Implement a **compound session identity** using `project_path + time_window`. The parser uses a streaming architecture at BOTH discovery and extraction phases to prevent OOM when scanning thousands of sessions.

**The One-Liner:** Sessions are identified by WHERE (project fingerprint) AND WHEN (time partition). Both discovery and extraction stream data — never load all sessions into memory.

---

#### 2. The Problem: Evaluation Session Isolation

##### 2.1 The Two Types of OpenCode Sessions

```mermaid
flowchart LR
    subgraph ORGANIC["Organic Work (Anytime)"]
        O1[Debugging session]
        O2[Teaching detour]
        O3[Exploratory spike]
        O4[Half-baked attempt]
    end
    
    subgraph DELIBERATE["Evaluation Session (Controlled)"]
        D1[Structured prompts]
        D2[Known scenarios]
        D3[Expected behaviors]
        D4[Parseable output]
    end
    
    ORGANIC -->|"❌ Should NOT be evaluated"| EVAL[Evaluation Pipeline]
    DELIBERATE -->|"✅ ONLY these"| EVAL
```

**Citation:** User requirement from discuss session (2026-02-14):
> "imagine when we start opencode for specific evaluation session, we'll run some sample prompts and scenario and then parse only the partition for that session which is a combination of project path fingerprint and partition time. without partition time then we are going to include unwanted past sessions into our evaluation"

##### 2.2 The Pollution Problem (Without Time Filtering)

If fingerprinting only uses `project_path`:

```python
# What the parser returns without time filtering
parser.get_sessions(project="gsd-lite")
# Returns: 200 sessions (6 months organic + 5 deliberate eval runs)
# Result: Evaluation metrics corrupted by debugging sessions, abandoned spikes, etc.
```

##### 2.3 The Solution: Compound Session Identity

```python
# Correct approach: compound key
Session_Identity = (project_path, time_window)

parser.get_sessions(
    project="gsd-lite",
    date="2026-02-14",
    time_range=("14:02", "14:38")  # Only this evaluation run
)
# Returns: 8 sessions from deliberate test scenario
```

---

#### 3. The Architecture: Stream-First at Every Layer

##### 3.1 Why Streaming Matters

**The Danger:** OpenCode stores thousands of sessions in `~/.local/share/opencode/storage/`. Naive loading causes OOM:

```python
# ❌ DANGEROUS: Load all sessions to memory
all_sessions = [json.load(f) for f in glob("session/global/*.json")]  # 💥 OOM
```

**The Storage Structure (from LOG-034, lines 5726-5878):**

| Artifact | Path Pattern | Size Per Item |
|----------|--------------|---------------|
| Session | `session/global/<sessionID>.json` | ~1KB (metadata only) |
| Message | `message/<sessionID>/<messageID>.json` | ~1-10KB |
| Part | `part/<messageID>/<partID>.json` | ~1-100KB |
| Tool Output | `tool-output/<hash>.txt` | ~1KB - 10MB (unbounded) |

**Critical Insight:** A single evaluation run might touch 10 sessions, but the storage contains 1000+ sessions. Loading all would consume gigabytes.

##### 3.2 The Streaming Protocol

**Principle:** Both `discover` and `extract` phases use generators. Never hold full session content in memory.

```mermaid
flowchart TD
    subgraph DISCOVER["Phase 1: Discover (Lightweight)"]
        D1[Stream session files] --> D2{Date matches?}
        D2 -->|No| D1
        D2 -->|Yes| D3{Project matches?}
        D3 -->|No| D1
        D3 -->|Yes| D4[Yield metadata only]
        D4 --> D5[Build date index]
    end
    
    subgraph EXTRACT["Phase 2: Extract (Full Content)"]
        E1[User selects partition] --> E2[Stream filtered sessions]
        E2 --> E3[Load messages lazily]
        E3 --> E4[Yield full trajectory]
        E4 --> E5[Write to output file]
    end
    
    D5 --> E1
```

##### 3.3 Memory Footprint Comparison

| Approach | Sessions Loaded | Memory Usage |
|----------|-----------------|--------------|
| Naive (load all) | 1000 | ~10GB (with tool outputs) |
| Stream + filter | 10 (matching) | ~100MB |
| Stream + metadata only | 1000 (headers) | ~1MB |

---

#### 4. Implementation Specification

##### 4.1 Discovery Phase (Partition Picker)

```python
from collections import defaultdict
from pathlib import Path
import json
from datetime import datetime
from typing import Generator, Dict, List

def discover_partitions(
    project_path: str,
    date: str = "today"
) -> Dict[str, List[dict]]:
    """
    Stream all sessions, filter by date and project, return lightweight index.
    
    Memory-safe: Only session metadata (ID, timestamp) held in memory.
    Never loads message content or tool outputs.
    
    Args:
        project_path: Absolute path to project root (e.g., "/Users/x/dev/gsd_lite")
        date: ISO date string or "today"
        
    Returns:
        Dict mapping date -> list of session metadata
        
    Example:
        >>> discover_partitions("/Users/x/dev/gsd_lite", "2026-02-14")
        {
            "2026-02-14": [
                {"session_id": "abc123", "created": "2026-02-14T09:15:00Z", "file": "..."},
                {"session_id": "def456", "created": "2026-02-14T09:23:00Z", "file": "..."},
            ]
        }
    """
    storage_root = Path.home() / ".local/share/opencode/storage"
    target_date = date if date != "today" else datetime.now().strftime("%Y-%m-%d")
    
    date_index = defaultdict(list)
    
    # Stream session files — never load all at once
    for session_file in (storage_root / "session/global").glob("*.json"):
        # Step 1: Load ONLY metadata (~1KB per session)
        with open(session_file) as f:
            meta = json.load(f)
        
        # Step 2: Early filter by date (cheapest check, eliminates 99%)
        session_date = meta["created"][:10]  # "2026-02-14T09:15:00Z" -> "2026-02-14"
        if session_date != target_date:
            continue
        
        # Step 3: Fingerprint check (see LOG-038 Section 6)
        if not _matches_project(session_file, project_path, storage_root):
            continue
        
        # Step 4: Add to index (metadata only, not content)
        date_index[session_date].append({
            "session_id": meta["id"],
            "created": meta["created"],
            "file": str(session_file)
        })
    
    return dict(date_index)


def _matches_project(session_file: Path, target_project: str, storage_root: Path) -> bool:
    """
    Fingerprint session by scanning tool call outputs for project paths.
    
    Priority chain (from LOG-038 Section 6):
    1. list_allowed_directories output -> first path
    2. grep_content output -> regex extract
    3. read_files output -> regex extract
    
    Returns True if any tool output contains target_project path.
    """
    session_id = session_file.stem
    message_dir = storage_root / "message" / session_id
    
    if not message_dir.exists():
        return False
    
    # Stream messages, don't load all
    for msg_file in message_dir.glob("*.json"):
        with open(msg_file) as f:
            msg = json.load(f)
        
        # Only check model messages (have tool calls)
        if msg.get("role") != "model":
            continue
        
        # Check parts for tool outputs containing project path
        part_dir = storage_root / "part" / msg["id"]
        if not part_dir.exists():
            continue
            
        for part_file in part_dir.glob("*.json"):
            with open(part_file) as f:
                part = json.load(f)
            
            if part.get("type") != "tool":
                continue
            
            # Check if output contains project path
            output = part.get("state", {}).get("output", "")
            if target_project in output:
                return True
    
    return False
```

##### 4.2 Helper Script UX (User-Facing)

```bash
# Discover available partitions for today
$ python eval_helper.py discover --project /Users/x/dev/gsd_lite --date today

📅 Evaluation Candidates for 2026-02-14 (gsd-lite)
──────────────────────────────────────────────────
  [1] 09:15 - 09:47  (12 sessions, 34 tool calls)
  [2] 14:02 - 14:38  (8 sessions, 21 tool calls)
  [3] 16:45 - 17:12  (5 sessions, 15 tool calls)

Select partition to evaluate [1-3, or 'all']: 2

✅ Selected partition 2 (14:02 - 14:38)
   Output will be written to: eval_run_2026-02-14_1402.json
```

##### 4.3 Extraction Phase (Vertex Format Output)

```python
def extract_partition(
    partition: List[dict],
    output_path: str
) -> None:
    """
    Stream sessions from partition, extract full trajectories, write to file.
    
    Memory-safe: Processes one session at a time, writes incrementally.
    Output format: Vertex AI Gen AI Evaluation compatible JSON.
    
    Args:
        partition: List of session metadata from discover_partitions()
        output_path: Path to write output JSON
    """
    storage_root = Path.home() / ".local/share/opencode/storage"
    
    with open(output_path, 'w') as out:
        out.write('[\n')
        first = True
        
        for session_meta in partition:
            if not first:
                out.write(',\n')
            first = False
            
            # Load full session (now safe — we know it's in our partition)
            trajectory = _extract_trajectory(session_meta, storage_root)
            json.dump(trajectory, out, indent=2)
        
        out.write('\n]')


def _extract_trajectory(session_meta: dict, storage_root: Path) -> dict:
    """
    Extract full trajectory from a single session.
    
    Output format (Vertex AI compatible, from LOG-038 Section 5):
    {
        "prompt": "User instruction text",
        "response": "Agent response text",
        "generated_trajectory": [
            {"tool": "fs.grep", "args": {...}, "output": "..."},
            {"tool": "fs.read", "args": {...}, "output": "..."}
        ]
    }
    """
    # Implementation follows LOG-038 Section 5 schema
    # ... (see LOG-038 for full schema details)
    pass
```

##### 4.4 Complete Workflow

```mermaid
sequenceDiagram
    participant User
    participant OpenCode
    participant EvalHelper
    participant VertexAI
    
    Note over User,OpenCode: Phase 1: Run Test Scenarios
    User->>OpenCode: Start session
    User->>OpenCode: Execute test prompts
    User->>OpenCode: Exit when done
    
    Note over User,EvalHelper: Phase 2: Discover Partitions
    User->>EvalHelper: discover --project gsd-lite --date today
    EvalHelper->>EvalHelper: Stream sessions (memory-safe)
    EvalHelper->>EvalHelper: Filter by date FIRST
    EvalHelper->>EvalHelper: Filter by project SECOND
    EvalHelper-->>User: Show partition options
    
    Note over User,EvalHelper: Phase 3: Extract
    User->>EvalHelper: Select partition [2]
    EvalHelper->>EvalHelper: Stream selected sessions
    EvalHelper->>EvalHelper: Write eval_run_2026-02-14_1402.json
    EvalHelper-->>User: ✅ Output ready
    
    Note over User,VertexAI: Phase 4: Evaluate
    User->>VertexAI: Submit eval_run_2026-02-14_1402.json
    VertexAI-->>User: Evaluation scores
```

---

#### 5. Design Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Compound Identity** | `project_path + time_window` | Project alone mixes organic/deliberate sessions |
| **Stream Discovery** | Generator over glob results | Prevents OOM on large storage directories |
| **Stream Extraction** | Process one session at a time | Same reason — memory safety |
| **Filter Order** | Date FIRST, then project | Date is O(1) string compare; project requires I/O |
| **Output Format** | One JSON file per partition | Clean audit trail, direct Vertex AI compatibility |
| **Partition Detection** | User-selected from discovered list | Automatic clustering adds complexity; manual is sufficient for v1 |

---

#### 6. Dependency Summary (For Future Agent Onboarding)

```mermaid
graph TD
    LOG032["LOG-032: OpenCode Native JSON<br/>(Data source discovery)"] --> LOG038
    LOG033["LOG-033: fs-mcp Path Fingerprinting<br/>(Project identification)"] --> LOG038
    LOG038["LOG-038: Parser Specification<br/>(Schema + algorithm)"] --> LOG040
    LOG040["LOG-040: Time Partitioning<br/>(Session isolation + streaming)"]
    
    style LOG040 fill:#90EE90
```

**To onboard this decision from scratch:**
1. **LOG-032** (lines 4895-5466): Understand why we use OpenCode's native JSON instead of custom instrumentation
2. **LOG-033** (lines 5467-5725): Understand the fingerprinting problem (one OpenCode, many projects)
3. **LOG-038** (lines 6089-6194): Understand the parser algorithm and output schema
4. **LOG-040** (this entry): Understand time-based filtering and streaming architecture

---

#### 7. Open Questions (Deferred)

| Question | Status | Notes |
|----------|--------|-------|
| Automatic partition clustering | DEFERRED | Could detect "runs" by time gaps; manual selection sufficient for v1 |
| Multi-day evaluation batches | DEFERRED | Current design handles single-day; extend `--date-range` later |
| Partition metadata persistence | DEFERRED | Could save partition definitions for reproducibility |

---

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-040 (Time-partitioned evaluation design approved)
→ Dependency chain: LOG-040 ← LOG-038 ← LOG-033 ← LOG-032
→ Next action: Implement `eval_helper.py` with discover + extract commands

**Layer 2 — Global Context:**
→ Architecture: OpenCode (Global) + fs-mcp (Project) → Parser → Vertex AI Eval
→ Patterns: Streaming generators for memory safety; compound session identity
→ Data Flow: `storage/session/global` → discover (filter) → extract (partition) → `eval_run_*.json`

**Fork paths:**
- Implement discover phase → Write `discover_partitions()` function
- Implement extract phase → Write `extract_partition()` function
- Implement CLI wrapper → Wire up `eval_helper.py` with argparse/typer
- Revisit LOG-038 → Ensure schema alignment with Vertex AI format

---

### [LOG-041] - [EXEC] - ~~eval_helper.py Implementation: Interactive Collect Workflow with Scoped Audit~~ [SUPERSEDED BY LOG-045] - Task: TASK-EVAL-001

**Status:** SUPERSEDED (See LOG-045 for SQLite migration)
**Date:** 2026-02-14
**Decision IDs:** DECISION-041a (Interactive Collect), DECISION-041b (--since UX), DECISION-041c (Scoped Audit)
**Task:** TASK-EVAL-001 (OpenCode Session Parser)
**Dependencies:**
- LOG-038: Parser specification (schema, algorithm) — lines 6089-6194
- LOG-040: Time partitioning design (streaming, compound identity) — lines 6259-6699

---

#### 1. Executive Summary

**What we built:** A fully functional `eval_helper.py` CLI tool that extracts OpenCode session data into Vertex AI-compatible evaluation datasets.

> **UPDATE (LOG-045):** This implementation relied on OpenCode's JSON file storage (`~/.local/share/opencode/storage/session`). OpenCode migrated to SQLite (`opencode.db`), rendering this file-based parser obsolete. See LOG-045 for the new `sqlmodel`-based implementation.

**The key innovation:** An interactive `collect` command that guides users through the entire workflow: `projects → discover → audit → extract`. No memorizing partition indices or juggling multiple commands.

**First successful extraction:** `eval_run_2026-02-14_2119.json` — 4 sessions, 152 tool calls, ready for evaluation.

---

#### 2. The Problem We Solved

The original design (LOG-040) specified separate commands (`discover`, `audit`, `extract`) with numeric partition indices. This had UX problems:

```bash
# Old UX (from LOG-040 design)
python eval_helper.py discover --project ... --date 2026-02-14
# Output: [1] 09:15-09:47, [2] 14:02-14:38

python eval_helper.py extract --project ... --date 2026-02-14 --partition 2
# Problem: What was partition 2 again? User must remember or re-run discover.
```

**Three UX gaps identified:**
1. `--date` requires typing ISO dates when 90% of use cases are "the session I just finished"
2. `--partition N` is opaque — user doesn't know what "1" means without running `discover` first
3. `audit` was global (all sessions) instead of scoped to the evaluation partition

---

#### 3. Decisions Made

##### DECISION-041a: Interactive `collect` Command

**Choice:** Single interactive command that combines discover → audit → extract.

**Rationale:** The evaluation workflow is inherently sequential. Breaking it into separate commands adds friction without flexibility benefits.

**Implementation:**

```python
# scripts/eval_helper.py, cmd_collect() function
def cmd_collect(args):
    # Step 1: Discover sessions
    sessions = discover_sessions(project, since)
    
    # Step 2: Detect partitions (group by time gaps)
    partitions = detect_partitions(sessions, gap_minutes=gap)
    
    # Step 3: User selects partition (interactive prompt)
    if len(partitions) == 1:
        selection = "1"  # Auto-select if only one
    else:
        selection = input(f"Select partition [1-{len(partitions)}, or 'all']: ")
    
    # Step 4: Audit tools (scoped to selected partition)
    tool_counts, unmapped_tools = audit_partition(selected_sessions)
    print_audit_results(tool_counts, unmapped_tools)
    
    # Step 5: Extract (with confirmation)
    proceed = input("Proceed to extract? [Y/n]: ")
    if proceed != "n":
        extract_partition(selected_sessions, output_file)
```

**Source:** `scripts/eval_helper.py` lines 622-720 (cmd_collect function)

---

##### DECISION-041b: `--since` Instead of `--date`

**Choice:** Replace `--date 2026-02-14` with `--since 1h` (default).

**Rationale:** 90% of evaluations happen immediately after the session ends. "Last hour" is the natural mental model.

**Supported formats:**

| Input | Meaning | Use Case |
|-------|---------|----------|
| `30m` | Last 30 minutes | Just finished a quick test |
| `1h` | Last 1 hour (default) | Standard evaluation run |
| `2h` | Last 2 hours | Longer session |
| `today` | Since midnight | Multiple runs today |
| `2026-02-14` | Specific date | Historical analysis |

**Implementation:**

```python
# scripts/eval_helper.py, parse_since() function
def parse_since(since_str: str) -> datetime:
    """Parse --since argument into a datetime cutoff."""
    now = datetime.now()
    
    if since_str.endswith("m"):
        minutes = int(since_str[:-1])
        return now - timedelta(minutes=minutes)
    
    if since_str.endswith("h"):
        hours = int(since_str[:-1])
        return now - timedelta(hours=hours)
    
    if since_str == "today":
        return now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Fallback: ISO date
    return datetime.strptime(since_str, "%Y-%m-%d")
```

**Source:** `scripts/eval_helper.py` lines 331-375 (parse_since function)

---

##### DECISION-041c: Scoped Audit

**Choice:** `audit` command is scoped to `--project` + `--since` + optional `--partition`.

**Rationale:** Global audit (all sessions ever) is noise. We only care about tools used in the specific evaluation partition we're about to extract.

**Before (global):**
```bash
python eval_helper.py audit
# Scans ALL 276 sessions across ALL projects
# Returns: 50 tools, 12 unmapped
# Problem: Most are irrelevant to current evaluation
```

**After (scoped):**
```bash
python eval_helper.py audit --project /Users/x/dev/gsd_lite --partition 1
# Scans only 4 sessions in partition 1 of gsd_lite project
# Returns: 8 tools, 0 unmapped
# Actionable: These are exactly the tools in your eval dataset
```

**Implementation:**

```python
# scripts/eval_helper.py, audit_partition() function
def audit_partition(sessions: List[SessionMeta]) -> Tuple[Dict[str, int], Set[str]]:
    """Audit tool usage within a specific partition."""
    config = get_config()
    tool_counts: Counter = Counter()
    unmapped_tools: Set[str] = set()
    
    for session in sessions:  # Only iterate selected sessions
        # ... extract tool calls from session ...
        if not config.is_known_tool(tool_name):
            unmapped_tools.add(tool_name)
    
    return dict(tool_counts), unmapped_tools
```

**Source:** `scripts/eval_helper.py` lines 618-665 (audit_partition function)

---

#### 4. What "Partition" Means

**Definition:** A partition is a group of sessions clustered by time proximity.

**The problem it solves:** Without partitioning, `--since 2h` might capture multiple evaluation runs mixed together:

```mermaid
flowchart LR
    subgraph TIME["Timeline (last 2 hours)"]
        S1[10:00<br/>Session A] --> S2[10:05<br/>Session B] --> S3[10:10<br/>Session C]
        S3 --> GAP["☕ 45 min gap"]
        GAP --> S4[10:55<br/>Session D] --> S5[11:00<br/>Session E]
    end
    
    subgraph PART["Detected Partitions"]
        P1["Partition 1<br/>10:00-10:10<br/>(3 sessions)"]
        P2["Partition 2<br/>10:55-11:00<br/>(2 sessions)"]
    end
    
    S1 & S2 & S3 -.-> P1
    S4 & S5 -.-> P2
```

**Algorithm:** Sessions with >30 minute gaps between them are split into separate partitions.

**Source:** `scripts/eval_helper.py` lines 445-475 (detect_partitions function)

---

#### 5. Output Schema Validation

**First successful extraction:** `eval_run_2026-02-14_2119.json`

```json
// Schema verified via jq queries
[
  {
    "session_id": "ses_3a37b0387ffe36zjDtyt0RUx82",
    "created": "2026-02-14T21:19:05",
    "prompt": "# Progress Workflow\n\n[SYSTEM: PROGRESS MODE...",
    "response": "GSD-Lite structure exists. Let me discover...",
    "generated_trajectory": [
      {
        "tool": "fs.list",           // Normalized logical name
        "tool_raw": "tools_gsd-lite-fs_list_directory_with_sizes",  // Physical name
        "args": {"path": "."},
        "output": "[DIR] .claude..."
      }
    ]
  }
]
```

**Statistics from first extraction:**

| Metric | Value |
|--------|-------|
| Sessions | 4 |
| Total tool calls | 152 (8 + 45 + 44 + 55) |
| File size | ~108k tokens |
| Time range | 21:19 - 21:41 (22 minutes) |

---

#### 6. Complete CLI Reference

```bash
# Step 1: Find your project path
python scripts/eval_helper.py projects
# Output: List of projects sorted by last activity

# Step 2: Interactive collect (RECOMMENDED)
python scripts/eval_helper.py collect --project /path/to/project
# Guides you through: discover → select partition → audit → extract

# Non-interactive commands (for scripting):
python scripts/eval_helper.py discover --project /path --since 2h
python scripts/eval_helper.py audit --project /path --partition 1
python scripts/eval_helper.py extract --project /path --partition 1 --output my_eval.json

# Debugging:
python scripts/eval_helper.py inspect --session-id ses_abc123
```

---

#### 7. File Inventory

| File | Purpose | Lines |
|------|---------|-------|
| `scripts/eval_helper.py` | Main CLI tool | ~1050 |
| `scripts/eval_config.yaml` | Tool name mappings | ~120 |
| `eval_run_*.json` | Extracted evaluation datasets | Variable |

---

#### 8. Dependency Graph

```mermaid
graph TD
    LOG032["LOG-032: OpenCode Native JSON<br/>(Data source discovery)"] --> LOG033
    LOG033["LOG-033: fs-mcp Path Fingerprinting<br/>(Project identification)"] --> LOG038
    LOG035["LOG-035: Config-Driven Tool Mapping<br/>(YAML normalization)"] --> LOG041
    LOG038["LOG-038: Parser Specification<br/>(Schema + algorithm)"] --> LOG040
    LOG040["LOG-040: Time Partitioning<br/>(Streaming + compound identity)"] --> LOG041
    LOG041["LOG-041: eval_helper.py Implementation<br/>(Interactive collect workflow)"]
    
    style LOG041 fill:#90EE90
```

**To onboard this implementation from scratch:**
1. **LOG-032** (lines 4895-5466): Why OpenCode native JSON as data source
2. **LOG-033** (lines 5467-5725): The fingerprinting problem and solution
3. **LOG-035** (lines 5879-5961): Why YAML config for tool normalization
4. **LOG-038** (lines 6089-6194): Parser algorithm and output schema
5. **LOG-040** (lines 6259-6699): Time partitioning and streaming design
6. **LOG-041** (this entry): Final implementation with UX refinements

---

#### 9. Open Questions (For Next Session)

| Question | Status | Notes |
|----------|--------|-------|
| **Vertex AI schema compatibility** | OPEN | Current schema has `prompt`, `response`, `generated_trajectory`. Does Vertex expect different field names? |
| Schema field `reference_trajectory` | UNKNOWN | Do we need a "golden" trajectory for comparison? |
| Multi-turn conversation handling | DEFERRED | Current schema flattens all prompts/responses into single strings |

---

### [LOG-042] - [DECISION] - Constitutional Evaluation Architecture: Session-as-Unit with Hybrid Orchestration via Promptfoo - Task: TASK-EVAL-002

**Status:** APPROVED
**Date:** 2026-02-14
**Decision IDs:** DECISION-042a (Session as Evaluation Unit), DECISION-042b (Vertex AI Superseded by Promptfoo), DECISION-042c (Hybrid Orchestration — Option C), DECISION-042d (Turn-Structured Output Schema)
**Task:** TASK-EVAL-002 (Constitutional Evaluation Pipeline)
**Supersedes:** DECISION-032b (Vertex AI Gen AI Eval as primary judge)
**Dependencies:**
- LOG-028: CI Framework Design (lines 4027-4333) — defines 3-layer CI architecture and Six Pillars
- LOG-030: CONSTITUTION.md v0.1 (lines 4745-4810) — the Four Pillars being evaluated
- LOG-031: pair-programming.yaml Rubric (lines 4811-4894) — existing rubric format (P2-H1 to P2-H5)
- LOG-032: OpenCode Goldmine (lines 4895-5466) — original platform research and Vertex AI decision
- LOG-041: eval_helper.py Implementation (lines 6677-EOF) — current extraction tool being refactored

---

#### 1. Executive Summary

**What we decided:** The Constitutional Evaluation Pipeline will use **individual sessions as the evaluation unit**, orchestrated via **Promptfoo's llm-rubric** assertions, with a **hybrid architecture** that separates deterministic checks (programmatic) from qualitative checks (LLM-as-judge).

**Why Vertex AI was superseded:** Vertex AI's trajectory evaluation requires a `reference_trajectory` (golden path) for comparison. GSD-Lite's Constitution doesn't define "correct tool sequences" — it defines **behavioral patterns** like "grep before read" and "ask why before executing." These are qualitative compliance checks, not sequence matching.

**The One-Liner:** Evaluate each session independently against the Constitution using Promptfoo, with batch extraction and aggregated reporting.

---

#### 2. The Problem: Vertex AI Trajectory Metrics Don't Fit Constitutional Compliance

##### 2.1 The Original Decision (LOG-032, DECISION-032b)

LOG-032 selected Vertex AI Gen AI Evaluation based on:
> "Bring Your Own Data" model — works with pre-captured data. Supports trajectory evaluation and adaptive rubrics.

**Citation:** LOG-032, lines 5190-5215 (DECISION-032b rationale)

##### 2.2 The Gap Discovered

When we researched Vertex AI's actual trajectory evaluation capabilities (this session), we found:

| Vertex AI Feature | What We Assumed | What It Actually Does |
|-------------------|-----------------|----------------------|
| `trajectory_exact_match` | Could verify "grep before read" | Compares `generated_trajectory` vs `reference_trajectory` |
| `trajectory_precision` | Could score tool efficiency | Measures overlap with **golden path** |
| `trajectory_in_order_match` | Could check behavioral patterns | Requires **expected sequence** to compare against |

**Citation:** Vertex AI Gen AI Evaluation SDK documentation, accessed 2026-02-14 via `mcp_tools_mmcp_google_grounding__search_documentation`. Key finding:
> "For trajectory evaluation, your dataset should include `reference_trajectory`: The *expected* sequence of actions (tool calls) the agent *should* take to achieve its goal."

**The fundamental mismatch:** GSD-Lite's Constitution defines **qualitative behaviors**, not **expected tool sequences**:

```yaml
# What Vertex AI expects (sequence matching)
reference_trajectory: ["search_flights", "select_flight", "book"]
generated_trajectory: ["search_flights", "book"]  # Missing step!
metric: trajectory_in_order_match = 0.66

# What GSD-Lite needs (behavioral compliance)
constitution_behavior: "Agent must grep before reading full files"
session_trajectory: [fs.list, fs.grep, fs.read, fs.edit]
evaluation: "Did fs.grep precede fs.read? → YES → PASS"
```

##### 2.3 Decision: Supersede DECISION-032b

**DECISION-042b:** Vertex AI Gen AI Evaluation is superseded as the primary evaluation backend. Promptfoo with `llm-rubric` assertions becomes the new primary platform.

**Rationale:**
1. Promptfoo's `llm-rubric` is designed for freeform criteria evaluation
2. Our `pair-programming.yaml` rubric is already YAML-native (matches Promptfoo format)
3. No vendor lock-in — can use any LLM (Gemini, Claude, GPT) as judge
4. We now have the data extraction (eval_helper.py) that LOG-032 said was missing for Promptfoo

**Citation:** LOG-032 framework comparison table (lines 4919-4926):
> "| **Promptfoo** | Custom provider functions or manual YAML | ⚠️ Requires custom harness |"

The "custom harness" is now built: `eval_helper.py` extracts sessions, satisfying Promptfoo's data input requirement.

---

#### 3. The Evaluation Unit Question: Why Session, Not Turn or Multi-Session?

##### 3.1 GSD-Lite's Stateless Architecture

GSD-Lite is designed for **stateless, cross-session work**. Each session is a fresh agent context that:
1. Runs Universal Onboarding (reads PROJECT, ARCHITECTURE, WORK.md)
2. Performs the user's requested work
3. Ends with a STATELESS HANDOFF packet

**Key insight:** The "repeated onboarding" across sessions is **correct behavior**, not noise. An agent that skips onboarding in Session 2 would be **violating** Pillar C3 (Context Engineering).

##### 3.2 Three Options Evaluated

| Option | Unit | Pros | Cons |
|--------|------|------|------|
| **Single Turn** | One user→agent exchange | Fine-grained | S1 (Handoff) only at session end; J4 (Log quality) spans turns |
| **Single Session** | All turns in one session | Matches GSD-Lite's stateless design; handoff visible | Requires turn structure for P2-H1 (Why Before How) |
| **Multi-Session Sequence** | Sessions 1+2+3 as partition | N/A | Sessions are intentionally independent; cross-session continuity is via artifacts, not memory |

##### 3.3 Decision: Session as Evaluation Unit

**DECISION-042a:** The evaluation unit is the **individual session**. Each session is evaluated independently against the Constitution.

**Rationale:**
1. **Handoff is session-scoped:** S1-H1 (STATELESS HANDOFF) only makes sense at session end
2. **Onboarding is session-scoped:** C3-H2 (Universal Onboarding) should happen once per session
3. **Stateless by design:** Cross-session correlation is via artifacts (WORK.md), not conversation memory
4. **Multi-turn behaviors handled:** LLM-as-judge prompt scans full session transcript for per-turn violations

**Example:** For behavior P2-H1 (Why Before How), the rubric prompt receives the full session transcript and identifies each user→agent exchange, evaluating whether the agent asked "why" before executing.

```yaml
# Conceptual rubric prompt for P2-H1
evaluation_prompt: |
  SESSION TRANSCRIPT:
  {{session_transcript}}
  
  TASK:
  1. Identify each USER REQUEST that implies an action
  2. For each, check if agent asked WHY or stated understanding before acting
  3. EXEMPT: Universal Onboarding sequence (reading PROJECT, ARCH, WORK)
  
  SCORE: 0 if ANY violation, 1 if ALL compliant
```

---

#### 4. The Orchestration Question: How to Handle Multiple Sessions?

##### 4.1 Three Options Evaluated

```mermaid
flowchart TB
    subgraph "Option A: Batch All"
        A1["5 sessions"] --> A2["One eval_run.json"]
        A2 --> A3["One Promptfoo run"]
        A3 --> A4["One mixed report"]
    end
    
    subgraph "Option B: User Selects One"
        B1["5 sessions"] --> B2["User picks session 3"]
        B2 --> B3["One Promptfoo run"]
        B3 --> B4["One clean report"]
    end
    
    subgraph "Option C: Hybrid (SELECTED)"
        C1["5 sessions"] --> C2["5 individual JSON files"]
        C2 --> C3["Loop: 5 Promptfoo runs"]
        C3 --> C4["5 individual reports"]
        C4 --> C5["1 aggregated summary"]
    end
```

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: Batch** | All sessions → one eval file → one run | Simple, efficient | Can't re-run one; noisy failures |
| **B: User Selects** | User picks one session to eval | Surgical debugging | No aggregated view; tedious for many |
| **C: Hybrid** | Extract all → eval each → aggregate | Best of both; re-runnable; CI-friendly | More Promptfoo invocations |

##### 4.2 Decision: Option C (Hybrid Orchestration)

**DECISION-042c:** Use hybrid orchestration — batch extract to individual files, evaluate each session independently, aggregate into summary report.

**Rationale:**
1. **Matches user workflow:** Run session → check compliance → fix protocol → re-run same session
2. **CI-friendly:** Exit code based on aggregate pass rate; can gate PRs on "golden sessions must pass"
3. **Debuggable:** Each session's report stored separately; failures traceable to specific turn
4. **Re-runnable:** `eval_helper.py evaluate --session ses_xxx` for surgical debugging

---

#### 5. Proposed CLI UX

##### 5.1 Extract Command (Refactored)

```bash
# Extract sessions to individual files (one per session)
$ python eval_helper.py collect --since 2h --output-dir ./eval_sessions/

Extracting sessions from last 2 hours...
Found 5 sessions in 1 partition.

Extracted:
  ./eval_sessions/ses_abc123.json (8 turns, 12 tools)
  ./eval_sessions/ses_def456.json (15 turns, 45 tools)
  ./eval_sessions/ses_ghi789.json (6 turns, 18 tools)
  ./eval_sessions/ses_jkl012.json (4 turns, 8 tools)
  ./eval_sessions/ses_mno345.json (10 turns, 32 tools)
```

##### 5.2 Evaluate Command (New)

```bash
# Evaluate ALL sessions in directory
$ python eval_helper.py evaluate --dir ./eval_sessions/

Evaluating 5 sessions against Constitution...

[1/5] ses_abc123... ✅ PASS (S1:1.0 P2:1.0 C3:1.0 J4:1.0)
[2/5] ses_def456... ❌ FAIL (S1:1.0 P2:0.6 C3:1.0 J4:0.8)
[3/5] ses_ghi789... ❌ FAIL (S1:1.0 P2:1.0 C3:0.5 J4:1.0)
[4/5] ses_jkl012... ❌ FAIL (S1:0.0 P2:1.0 C3:1.0 J4:1.0)
[5/5] ses_mno345... ✅ PASS (S1:1.0 P2:1.0 C3:1.0 J4:1.0)

SUMMARY: 2/5 sessions passed (40%)
Report: ./eval_sessions/report.json
```

```bash
# Evaluate ONE session (for debugging)
$ python eval_helper.py evaluate --session ./eval_sessions/ses_def456.json

Evaluating ses_def456 against Constitution...

S1 Stateless-First:     ✅ 1.0
  S1-H1 Handoff:        ✅ PASS

P2 Pair Programming:    ❌ 0.6
  P2-H1 Why Before How: ✅ PASS
  P2-H2 Grounding Loop: ✅ PASS
  P2-H3 Challenge Tone: ❌ FAIL — Turn 4: User said "make it fast", agent did not probe
  P2-H4 Teaching Offer: ✅ PASS
  P2-H5 No Auto-Write:  ❌ FAIL — Turn 7: Wrote to WORK.md without asking

C3 Context Engineering: ✅ 1.0
  C3-H1 Grep First:     ✅ PASS
  C3-H2 Onboarding:     ✅ PASS

J4 Journalism Quality:  ⚠️ 0.8
  J4-H1 Log Format:     ✅ PASS
  J4-H2 Narrative:      ⚠️ PARTIAL — LOG-042 missing analogy/example
```

---

#### 6. Output Schema Refactor

##### 6.1 Current Schema (Session-Level, Flat)

From LOG-041 implementation (`eval_run_2026-02-14_2119.json`):

```json
{
  "session_id": "ses_def456",
  "created": "2026-02-14T21:30:00",
  "prompt": "...all user messages concatenated...",
  "response": "...all agent messages concatenated...",
  "generated_trajectory": [
    {"tool": "fs.grep", "tool_raw": "mcp_tools_gsd-lite-fs_grep_content", "args": {...}, "output": "..."},
    {"tool": "fs.read", "tool_raw": "mcp_tools_gsd-lite-fs_read_files", "args": {...}, "output": "..."}
  ]
}
```

**Problems:**
1. No turn boundaries — can't tell which tools answered which user message
2. LLM-as-judge can't evaluate "did agent ask why before THIS action"
3. `pair-programming.yaml` expects `user_input` and `agent_response` as separate fields

##### 6.2 Proposed Schema (Session-Level, Turn-Structured)

**DECISION-042d:** Refactor eval_helper.py output to include turn-level structure while preserving session-level aggregates.

```json
{
  "session_id": "ses_def456",
  "created": "2026-02-14T21:30:00",
  "project": "/Users/luutuankiet/dev/gsd_lite",
  
  "turns": [
    {
      "turn": 1,
      "role": "user",
      "content": "discuss log-001"
    },
    {
      "turn": 2,
      "role": "agent",
      "content": "I'll review the context first...\n\n[reads files]\n\nBased on LOG-001, here's my understanding...",
      "tools": [
        {
          "tool": "fs.grep",
          "tool_raw": "mcp_tools_gsd-lite-fs_grep_content",
          "args": {"pattern": "\\[LOG-001\\]", "search_path": "gsd-lite/WORK.md"},
          "output": "File: gsd-lite/WORK.md, Line: 102..."
        },
        {
          "tool": "fs.read",
          "tool_raw": "mcp_tools_gsd-lite-fs_read_files",
          "args": {"files": [{"path": "gsd-lite/WORK.md", "start_line": 102, "end_line": 212}]},
          "output": "### [LOG-001] - [DISCOVERY]..."
        }
      ]
    },
    {
      "turn": 3,
      "role": "user",
      "content": "write log-002 about our findings"
    },
    {
      "turn": 4,
      "role": "agent",
      "content": "I'll write LOG-002. Before I do — what aspect do you want to emphasize: the technical finding or the decision rationale?\n\n📦 STATELESS HANDOFF\n...",
      "tools": []
    }
  ],
  
  "full_transcript": "USER: discuss log-001\n\nAGENT: I'll review the context first...\n\nUSER: write log-002 about our findings\n\nAGENT: I'll write LOG-002. Before I do...",
  
  "tool_trajectory": [
    {"tool": "fs.grep", "turn": 2, "args": {...}, "output": "..."},
    {"tool": "fs.read", "turn": 2, "args": {...}, "output": "..."}
  ],
  
  "metadata": {
    "total_turns": 4,
    "total_tools": 2,
    "duration_seconds": 145
  }
}
```

**Key additions:**
| Field | Purpose | Consumer |
|-------|---------|----------|
| `turns[]` | Structured turn-by-turn with role | LLM-as-judge (P2-H1, P2-H3) |
| `turns[].tools[]` | Which tools used in each turn | Correlate tool to conversation |
| `tool_trajectory[].turn` | Links tools back to turn number | C3-H1 (grep-before-read) with context |
| `full_transcript` | Flat string for simple matching | S1-H1 (grep for handoff pattern) |
| `metadata` | Session stats | Reporting, filtering |

---

#### 7. Evaluation Pipeline Architecture

```mermaid
flowchart TB
    subgraph "Phase 1: Extract"
        OC["OpenCode Storage<br/>~/.local/share/opencode/"] --> EH["eval_helper.py collect"]
        EH --> DIR["./eval_sessions/<br/>├── ses_abc123.json<br/>├── ses_def456.json<br/>└── ..."]
    end
    
    subgraph "Phase 2: Evaluate"
        DIR --> LOOP["For each session:"]
        
        subgraph "Layer 1: Deterministic"
            LOOP --> D1["S1-H1: grep 'STATELESS HANDOFF'"]
            LOOP --> D2["C3-H1: check grep→read pattern"]
            LOOP --> D3["C3-H2: verify onboarding sequence"]
        end
        
        subgraph "Layer 2: LLM-as-Judge (Promptfoo)"
            LOOP --> L1["P2-H1: Why Before How"]
            LOOP --> L2["P2-H2: Grounding Loop"]
            LOOP --> L3["P2-H3: Challenge Tone"]
            LOOP --> L4["J4-H1: Log Quality"]
        end
        
        D1 & D2 & D3 --> SR["Session Report<br/>ses_xxx_report.json"]
        L1 & L2 & L3 & L4 --> SR
    end
    
    subgraph "Phase 3: Aggregate"
        SR --> AGG["Aggregate Report<br/>report.json"]
        AGG --> CI["CI Gate<br/>exit 0 if pass rate >= threshold"]
    end
```

##### 7.1 Layer 1: Deterministic Checks (Programmatic)

These behaviors can be evaluated without LLM:

| Behavior | Check | Implementation |
|----------|-------|----------------|
| S1-H1 | Handoff present | `"📦 STATELESS HANDOFF" in turns[-1].content` |
| C3-H1 | Grep before read | Scan `tool_trajectory`: for each `fs.read`, verify preceding `fs.grep` covered same path |
| C3-H2 | Onboarding sequence | First agent turn reads PROJECT.md, ARCHITECTURE.md, WORK.md |

**Example: C3-H1 Check (Python)**

```python
def check_grep_before_read(session: dict) -> tuple[bool, str]:
    """
    C3-H1: Agent uses grep-first pattern.
    
    PASS: Every fs.read is preceded by fs.grep on same/parent path
    FAIL: fs.read without preceding fs.grep
    """
    grepped_paths = set()
    
    for call in session["tool_trajectory"]:
        if call["tool"] == "fs.grep":
            search_path = call["args"].get("search_path", ".")
            grepped_paths.add(search_path)
        
        if call["tool"] == "fs.read":
            for file_req in call["args"].get("files", []):
                file_path = file_req.get("path", "")
                # Check if file is under a grepped directory
                if not any(file_path.startswith(gp) or gp == "." for gp in grepped_paths):
                    return False, f"Turn {call['turn']}: Read '{file_path}' without grep-first"
    
    return True, "Grep-first pattern followed"
```

##### 7.2 Layer 2: LLM-as-Judge (Promptfoo)

These behaviors require qualitative judgment:

| Behavior | What It Checks | Rubric File |
|----------|----------------|-------------|
| P2-H1 | Agent asks "why" before executing | `pair-programming.yaml` (exists) |
| P2-H2 | Agent follows Search→Echo→Verify loop | `pair-programming.yaml` (exists) |
| P2-H3 | Agent challenges vague requirements | `pair-programming.yaml` (exists) |
| P2-H4 | Agent offers teaching detours | `pair-programming.yaml` (exists) |
| P2-H5 | Agent asks before writing artifacts | `pair-programming.yaml` (exists) |
| J4-H1 | Logs have narrative + code + backlinks | `journalism.yaml` (to be created) |

**Citation:** Existing rubric at `src/gsd_lite/template/constitution/rubrics/pair-programming.yaml`, behaviors P2-H1 through P2-H5 with full `evaluation_steps`, `scoring`, `violation_examples`, and `compliance_examples`.

---

#### 8. Why This Preserves GSD-Lite's Design

| GSD-Lite Principle | How This Preserves It |
|--------------------|-----------------------|
| **Stateless sessions** | Each session evaluated independently; no cross-session memory assumed |
| **Universal Onboarding** | Onboarding is EXPECTED in every session; evaluated as C3-H2 compliance |
| **Fork & Resume** | Evaluation happens on captured data; doesn't interfere with /fork workflow |
| **Artifacts as memory** | Cross-session continuity via WORK.md, not conversation; evaluation respects this |
| **Pair programming** | P2-H* behaviors directly evaluate the Driver/Navigator dynamic |

---

#### 9. Implementation Tasks

| Task ID | Description | Depends On | Est. Effort |
|---------|-------------|------------|-------------|
| TASK-EVAL-002a | Refactor eval_helper.py output to turn-structured schema | LOG-042 | 3h |
| TASK-EVAL-002b | Implement `--output-dir` flag for per-session extraction | TASK-EVAL-002a | 1h |
| TASK-EVAL-002c | Implement Layer 1 deterministic checks (S1-H1, C3-H1, C3-H2) | TASK-EVAL-002a | 2h |
| TASK-EVAL-002d | Create Promptfoo config for Layer 2 (`constitutional.yaml`) | LOG-042 | 2h |
| TASK-EVAL-002e | Implement `evaluate` command with Promptfoo integration | TASK-EVAL-002c, 002d | 3h |
| TASK-EVAL-002f | Implement aggregated report generation | TASK-EVAL-002e | 1h |
| TASK-CONST-002b | Write remaining rubrics (S1, C3, J4 pillars) | LOG-031 | 4h |

---

#### 10. Dependency Graph

```mermaid
graph TD
    LOG028["LOG-028: CI Framework Design<br/>(Six Pillars, 3-layer architecture)"] --> LOG030
    LOG028 --> LOG032
    
    LOG030["LOG-030: CONSTITUTION.md v0.1<br/>(Four Pillars extracted)"] --> LOG031
    
    LOG031["LOG-031: pair-programming.yaml<br/>(P2-H1 to P2-H5 rubric)"] --> LOG042
    
    LOG032["LOG-032: OpenCode Goldmine<br/>(Data source + Vertex AI decision)"] --> LOG041
    LOG032 --> LOG042
    
    LOG041["LOG-041: eval_helper.py<br/>(Interactive collect workflow)"] --> LOG042
    
    LOG042["LOG-042: Constitutional Evaluation Architecture<br/>(This entry: Session-as-unit, Promptfoo, Hybrid orchestration)"]
    
    style LOG042 fill:#90EE90
    style LOG032 fill:#FFB6C1
    
    LOG042 -.->|"Supersedes DECISION-032b"| LOG032
```

**To onboard this decision from scratch:**
1. **LOG-028** (lines 4027-4333): Why CI framework; the Six Pillars; 3-layer architecture concept
2. **LOG-030** (lines 4745-4810): Constitution v0.1 with Four Pillars distilled
3. **LOG-031** (lines 4811-4894): The rubric format; P2-H1 to P2-H5 behaviors
4. **LOG-032** (lines 4895-5466): Platform research; why Vertex AI was chosen (now superseded)
5. **LOG-041** (lines 6677-EOF): Current eval_helper.py implementation being refactored
6. **LOG-042** (this entry): Why Vertex AI doesn't fit; session-as-unit; Promptfoo; hybrid orchestration

---

#### 11. Open Questions (For Next Session)

| Question | Status | Notes |
|----------|--------|-------|
| Promptfoo llm-rubric exact syntax | OPEN | Need to verify YAML format matches our rubric structure |
| Judge model selection | OPEN | Claude Sonnet 4 vs Gemini Flash for cost/quality tradeoff |
| CI integration | DEFERRED | GitHub Actions workflow for PR gates |
| Remaining rubrics | PENDING | S1, C3, J4 pillars need rubric files (TASK-CONST-002b) |

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-042 (Constitutional Evaluation Architecture decision)
→ Dependency chain: LOG-042 ← LOG-041 ← LOG-032 ← LOG-028
→ Next action: TASK-EVAL-002a — Refactor eval_helper.py to turn-structured schema

**Layer 2 — Global Context:**
→ Architecture: eval_helper.py (extract) → per-session JSON → Promptfoo (Layer 2) + Python (Layer 1) → aggregate report
→ Patterns: Session = eval unit; deterministic + LLM-as-judge hybrid; Vertex AI superseded
→ Key decisions: DECISION-042a (session-as-unit), 042b (Promptfoo), 042c (Option C hybrid), 042d (turn-structured schema)

**Fork paths:**
- Implement schema refactor → TASK-EVAL-002a: Add turns[] structure to eval_helper.py output
- Research Promptfoo → Verify llm-rubric syntax matches pair-programming.yaml
- Write remaining rubrics → TASK-CONST-002b: S1, C3, J4 pillar rubrics
- Prototype manually → Run one session through Promptfoo by hand before building pipeline

---

### [LOG-043] - [DECISION] - Vertex AI Rubric-Based Evaluation: Hybrid Architecture with Adaptive Rubrics + Programmatic Checks - Task: TASK-EVAL-002

**Status:** APPROVED
**Date:** 2026-02-14
**Decision IDs:** DECISION-043a (Vertex AI Rubric-Based Metrics for L2), DECISION-043b (Hybrid Architecture: Programmatic L1 + Vertex L2), DECISION-043c (Constitution as Guidelines Parameter)
**Task:** TASK-EVAL-002 (Constitutional Evaluation Pipeline)
**Supersedes:** DECISION-042b (Promptfoo as primary platform) — **Vertex AI rubric-based metrics now primary for Layer 2**
**Dependencies:**
- LOG-028: CI Framework Design (lines 4038-4344) — defines 3-layer CI architecture and Six Pillars
- LOG-030: CONSTITUTION.md v0.1 (lines 4756-4821) — the Four Pillars being evaluated
- LOG-031: pair-programming.yaml Rubric (lines 4822-4905) — existing rubric format (P2-H1 to P2-H5)
- LOG-032: OpenCode Goldmine (lines 4906-5477) — original platform research, DECISION-032b (now double-superseded)
- LOG-041: eval_helper.py Implementation (lines 6688-6985) — current extraction tool
- LOG-042: Constitutional Evaluation Architecture (lines 6986-7493) — session-as-unit, hybrid orchestration (still valid), Promptfoo decision (now superseded)

---

#### 1. Executive Summary

**What we decided:** The Constitutional Evaluation Pipeline will use **Vertex AI's rubric-based metrics** (specifically `GENERAL_QUALITY` with custom `guidelines`) for Layer 2 qualitative evaluation, combined with **programmatic Python checks** for Layer 1 deterministic evaluation.

**Why this supersedes DECISION-042b (Promptfoo):**
1. User is a Google Cloud partner — hands-on Vertex AI experience has strategic value
2. Vertex AI's **adaptive rubrics** dynamically generate pass/fail tests per prompt — more intelligent than static Promptfoo rubrics
3. Vertex AI's `guidelines` parameter allows injecting our Constitution directly — no rubric format translation needed
4. Vertex AI has **agent-specific metrics** (`TOOL_USE_QUALITY`, `HALLUCINATION`) that align with GSD-Lite's tool-heavy workflow

**The One-Liner:** Use Vertex AI's adaptive rubric intelligence for behavioral evaluation, keep deterministic checks in Python for speed and cost.

---

#### 2. The Gap in LOG-042: We Only Researched Trajectory Metrics

##### 2.1 What LOG-042 Concluded (Incorrectly Scoped)

LOG-042 (lines 7017-7035) stated:

> "Vertex AI's trajectory evaluation requires a `reference_trajectory` (golden path) for comparison. GSD-Lite's Constitution doesn't define 'correct tool sequences' — it defines behavioral patterns like 'grep before read' and 'ask why before executing.'"

**This was correct for trajectory metrics, but incomplete.** Vertex AI has TWO distinct evaluation paradigms:

| Paradigm | Metrics | Requires Golden Path? | GSD-Lite Fit |
|----------|---------|----------------------|--------------|
| **Trajectory** | `trajectory_exact_match`, `trajectory_precision`, `trajectory_in_order_match` | ✅ Yes | ❌ Not fit |
| **Rubric-Based** | `GENERAL_QUALITY`, `INSTRUCTION_FOLLOWING`, `TEXT_QUALITY`, `TOOL_USE_QUALITY` | ❌ No | ✅ **Strong fit** |

**Citation:** Vertex AI documentation, "Define your evaluation metrics" (fetched 2026-02-14):
- URL: https://cloud.google.com/vertex-ai/generative-ai/docs/models/determine-eval
- Key section: "Rubric-based metrics: Incorporate LLMs into evaluation workflows."

##### 2.2 The Missed Feature: Adaptive Rubrics with Custom Guidelines

The documentation explicitly states:

> "Adaptive rubrics function like unit tests for your models. Adaptive rubrics dynamically generate a unique set of pass or fail tests for each individual prompt in your dataset."

**Citation:** Same URL, section "Adaptive rubrics (recommended)":
```
You can also guide GENERAL_QUALITY with natural language guidelines to focus 
rubric generation on the criteria that are most important to you. The Gen AI 
evaluation service then generates rubrics covering both its default tasks and 
the guidelines you specify.
```

**Code example from documentation:**
```python
from vertexai import types

eval_result = client.evals.evaluate(
    dataset=eval_dataset,
    metrics=[
        types.RubricMetric.GENERAL_QUALITY(
            metric_spec_parameters={
                "guidelines": "The response must maintain a professional tone and must not provide financial advice."
            }
        )
    ],
)
```

**Citation:** https://cloud.google.com/vertex-ai/generative-ai/docs/models/determine-eval, code block under "General quality metric"

---

#### 3. Vertex AI Rubric-Based Metrics — Full Inventory

**Citation:** https://cloud.google.com/vertex-ai/generative-ai/docs/models/rubric-metric-details

| Metric | Type | What It Evaluates | GSD-Lite Use Case |
|--------|------|-------------------|-------------------|
| `GENERAL_QUALITY` | Adaptive | Overall response quality with custom guidelines | P2-H* behaviors via guidelines |
| `INSTRUCTION_FOLLOWING` | Adaptive | Adherence to prompt constraints | S1-H1 (Handoff format compliance) |
| `TEXT_QUALITY` | Adaptive | Fluency, coherence, grammar | J4-H* (Journalism quality) |
| `GROUNDING` | Static | Factuality against context | Could evaluate agent's use of tool outputs |
| `SAFETY` | Static | PII, hate speech, harassment | Baseline safety check |
| `MULTI_TURN_GENERAL_QUALITY` | Adaptive | Quality in multi-turn dialogue | Our sessions ARE multi-turn |
| `TOOL_USE_QUALITY` | Agent-specific | Correctness of function calls | C3-H1 (Grep-first pattern) |
| `HALLUCINATION` | Agent-specific | Is response grounded in tool outputs? | Verify agent uses tool data |
| `FINAL_RESPONSE_QUALITY` | Agent-specific | Overall agent answer quality | Session-level scoring |

##### 3.1 Agent-Specific Metrics — Perfect Fit for GSD-Lite

**Citation:** https://cloud.google.com/vertex-ai/generative-ai/docs/models/evaluation-agents-client

The agent evaluation documentation shows input schema:
```python
eval_dataset = [
    {
        "prompt": "What's the weather in NYC?",
        "response": "The weather in NYC is sunny, 75°F.",
        "tool_use": [
            {
                "tool_name": "get_weather",
                "tool_input": {"location": "NYC"},
                "tool_output": {"temperature": 75, "condition": "sunny"}
            }
        ]
    }
]
```

**Key insight:** This schema matches what `eval_helper.py` (LOG-041) already extracts! Our `generated_trajectory` field contains the same data — we just need to rename it to `tool_use`.

---

#### 4. Mapping GSD-Lite Constitution to Vertex Metrics

##### 4.1 Pillar 2: Pair Programming Model

| Behavior | Vertex Metric | Guidelines Parameter |
|----------|---------------|----------------------|
| P2-H1: Why Before How | `GENERAL_QUALITY` | "The agent MUST ask 'why' or state its understanding of intent BEFORE executing any action. Violations: executing without asking, assuming intent." |
| P2-H2: Grounding Loop | `GENERAL_QUALITY` | "After using any search/read tool, the agent MUST echo findings and ask for verification BEFORE proposing changes." |
| P2-H3: Challenge Tone | `GENERAL_QUALITY` | "When user states a decision without reasoning, agent MUST probe with gentle or direct challenge. Never accept vague requirements." |
| P2-H4: Teaching Offer | `GENERAL_QUALITY` | "When encountering unfamiliar patterns in codebase, agent SHOULD offer to explain before continuing." |
| P2-H5: No Auto-Write | `GENERAL_QUALITY` | "Agent MUST ask 'Want me to capture this to WORK.md?' before writing to any artifact." |

##### 4.2 Pillar 1: Stateless-First

| Behavior | Vertex Metric | How to Evaluate |
|----------|---------------|-----------------|
| S1-H1: Handoff | `INSTRUCTION_FOLLOWING` | Check response ends with "📦 STATELESS HANDOFF" pattern |
| S1-H2: Two-Layer Structure | `INSTRUCTION_FOLLOWING` | Verify handoff contains Layer 1 (local) and Layer 2 (global) |

**Note:** S1-H1 is better evaluated programmatically (simple grep) — see Layer 1 design below.

##### 4.3 Pillar 3: Context Engineering

| Behavior | Vertex Metric | How to Evaluate |
|----------|---------------|-----------------|
| C3-H1: Grep First | `TOOL_USE_QUALITY` + programmatic | Analyze tool sequence: `fs.grep` should precede `fs.read` on same path |
| C3-H2: Onboarding | Programmatic | First agent turn should read PROJECT, ARCHITECTURE, WORK.md |

##### 4.4 Pillar 4: Journalism Quality

| Behavior | Vertex Metric | Guidelines Parameter |
|----------|---------------|----------------------|
| J4-H1: Log Format | `TEXT_QUALITY` | "Log entries must include: narrative framing, the symptom, evidence, root cause, analogy, decision, code snippet." |
| J4-H2: Backlinks | Programmatic | Grep for "Depends On:" and LOG-XXX references |

---

#### 5. The Hybrid Architecture — Final Design

**DECISION-043b:** Use a two-layer hybrid architecture: **Programmatic (Python) for Layer 1**, **Vertex AI rubric-based for Layer 2**.

```mermaid
flowchart TB
    subgraph "Input"
        OC["OpenCode Storage<br/>~/.local/share/opencode/"]
    end
    
    subgraph "Extraction"
        OC --> EH["eval_helper.py collect"]
        EH --> JSON["Session JSON<br/>(turn-structured)"]
    end
    
    subgraph "Layer 1: Programmatic (Free, Fast)"
        JSON --> L1A["S1-H1: Handoff Check<br/>'📦 STATELESS HANDOFF' in response"]
        JSON --> L1B["C3-H1: Grep-First Check<br/>Analyze tool_trajectory sequence"]
        JSON --> L1C["C3-H2: Onboarding Check<br/>First turn reads PROJECT, ARCH, WORK"]
        JSON --> L1D["J4-H2: Backlinks Check<br/>Grep for 'Depends On:' pattern"]
    end
    
    subgraph "Layer 2: Vertex AI (LLM-as-Judge)"
        JSON --> V1["GENERAL_QUALITY<br/>+ Constitution Guidelines"]
        JSON --> V2["TOOL_USE_QUALITY<br/>(C3-H1 qualitative)"]
        JSON --> V3["TEXT_QUALITY<br/>(J4-H1 narrative)"]
        JSON --> V4["INSTRUCTION_FOLLOWING<br/>(S1-H2 handoff structure)"]
    end
    
    subgraph "Aggregation"
        L1A & L1B & L1C & L1D --> L1R["Layer 1 Report<br/>(deterministic pass/fail)"]
        V1 & V2 & V3 & V4 --> L2R["Layer 2 Report<br/>(rubric scores + verdicts)"]
        L1R & L2R --> AGG["Aggregate Report"]
        AGG --> CI["CI Gate<br/>(exit 0 if pass rate >= threshold)"]
    end
    
    style L1A fill:#90EE90
    style L1B fill:#90EE90
    style L1C fill:#90EE90
    style L1D fill:#90EE90
    style V1 fill:#87CEEB
    style V2 fill:#87CEEB
    style V3 fill:#87CEEB
    style V4 fill:#87CEEB
```

##### 5.1 Why This Split?

| Layer | Cost | Speed | Best For |
|-------|------|-------|----------|
| **L1: Programmatic** | Free | <1ms per session | Binary checks: presence of pattern, tool sequence order |
| **L2: Vertex AI** | ~6 Gemini Flash calls per metric | ~2-5s per session | Qualitative judgment: tone, reasoning quality, narrative |

**Cost estimate for L2:**
- 1 session × 4 metrics × 6 calls = 24 Gemini Flash calls
- At $0.075/1M input tokens, negligible for small batches
- For CI: evaluate only "golden sessions" (curated test set), not all organic work

##### 5.2 Layer 1: Programmatic Checks (Python)

```python
# File: eval/layer1_checks.py

def check_handoff_present(session: dict) -> tuple[bool, str]:
    """
    S1-H1: Agent ends response with STATELESS HANDOFF.
    
    PASS: Last agent turn contains "📦 STATELESS HANDOFF"
    FAIL: Pattern not found
    """
    last_agent_turn = [t for t in session["turns"] if t["role"] == "agent"][-1]
    if "📦 STATELESS HANDOFF" in last_agent_turn["content"]:
        return True, "Handoff present"
    return False, "Missing STATELESS HANDOFF in final response"


def check_grep_before_read(session: dict) -> tuple[bool, str]:
    """
    C3-H1: Agent uses grep-first pattern.
    
    PASS: Every fs.read is preceded by fs.grep on same/parent path
    FAIL: fs.read without preceding fs.grep
    """
    grepped_paths = set()
    
    for call in session.get("tool_trajectory", []):
        if call["tool"] == "fs.grep":
            search_path = call["args"].get("search_path", ".")
            grepped_paths.add(search_path)
        
        if call["tool"] == "fs.read":
            for file_req in call["args"].get("files", []):
                file_path = file_req.get("path", "")
                # Check if file is under a grepped directory
                if not any(file_path.startswith(gp) or gp == "." for gp in grepped_paths):
                    return False, f"Read '{file_path}' without grep-first"
    
    return True, "Grep-first pattern followed"


def check_onboarding_sequence(session: dict) -> tuple[bool, str]:
    """
    C3-H2: Agent reads PROJECT, ARCHITECTURE, WORK.md on first turn.
    
    PASS: First agent turn reads all three files
    FAIL: Missing one or more onboarding reads
    """
    first_agent_turn = next(
        (t for t in session["turns"] if t["role"] == "agent"), 
        None
    )
    if not first_agent_turn:
        return False, "No agent turn found"
    
    tools_in_first_turn = first_agent_turn.get("tools", [])
    read_paths = []
    for tool in tools_in_first_turn:
        if tool["tool"] == "fs.read":
            for f in tool["args"].get("files", []):
                read_paths.append(f.get("path", ""))
    
    required = ["PROJECT.md", "ARCHITECTURE.md", "WORK.md"]
    missing = [r for r in required if not any(r in p for p in read_paths)]
    
    if missing:
        return False, f"Missing onboarding reads: {missing}"
    return True, "Onboarding sequence complete"
```

##### 5.3 Layer 2: Vertex AI Rubric-Based Evaluation

**DECISION-043c:** Inject GSD-Lite Constitution as the `guidelines` parameter to `GENERAL_QUALITY`.

```python
# File: eval/layer2_vertex.py

import vertexai
from vertexai import types

# Constitution as guidelines (distilled from CONSTITUTION.md)
CONSTITUTION_GUIDELINES = """
PILLAR 2 - PAIR PROGRAMMING MODEL:
- P2-H1 (Why Before How): Agent MUST ask 'why' or state understanding of intent BEFORE executing any action.
- P2-H2 (Grounding Loop): After using search/read tools, agent MUST echo findings and verify BEFORE proposing changes.
- P2-H3 (Challenge Tone): When user states decision without reasoning, agent MUST probe with gentle or direct challenge.
- P2-H4 (Teaching Offer): When encountering unfamiliar patterns, agent SHOULD offer to explain before continuing.
- P2-H5 (No Auto-Write): Agent MUST ask permission before writing to any artifact file.

PILLAR 1 - STATELESS-FIRST:
- S1-H1 (Handoff): Every response MUST end with structured handoff packet containing Layer 1 (local) and Layer 2 (global) context.

PILLAR 4 - JOURNALISM QUALITY:
- J4-H1 (Narrative): Log entries must include: narrative framing, symptom, evidence, root cause, analogy, decision, code snippet.
"""

def evaluate_session_with_vertex(session: dict) -> dict:
    """
    Run Vertex AI rubric-based evaluation on a session.
    
    Returns dict with scores and verdicts for each metric.
    """
    vertexai.init(project="your-project", location="us-central1")
    client = vertexai.Client()
    
    # Transform session to Vertex format
    eval_dataset = [{
        "prompt": session["full_transcript"],  # Full conversation
        "response": session["turns"][-1]["content"],  # Last agent response
        "tool_use": [
            {
                "tool_name": call["tool"],
                "tool_input": call["args"],
                "tool_output": call.get("output", "")
            }
            for call in session.get("tool_trajectory", [])
        ]
    }]
    
    # Run evaluation with Constitution as guidelines
    result = client.evals.evaluate(
        dataset=eval_dataset,
        metrics=[
            types.RubricMetric.GENERAL_QUALITY(
                metric_spec_parameters={
                    "guidelines": CONSTITUTION_GUIDELINES
                }
            ),
            types.RubricMetric.TOOL_USE_QUALITY,
            types.RubricMetric.TEXT_QUALITY,
            types.RubricMetric.INSTRUCTION_FOLLOWING,
        ],
    )
    
    return result
```

---

#### 6. Schema Alignment: eval_helper.py Output → Vertex Input

Our current `eval_helper.py` output (LOG-041) needs minor adjustments:

| Current Field | Vertex Expected | Action |
|---------------|-----------------|--------|
| `prompt` (concatenated) | `prompt` | ✅ Keep |
| `response` (concatenated) | `response` | ⚠️ Change to last agent response only |
| `generated_trajectory` | `tool_use` | ⚠️ Rename + restructure |
| `turns[]` (proposed in LOG-042) | N/A (we use for L1) | ✅ Keep for programmatic checks |

**Vertex `tool_use` expected format:**
```json
{
  "tool_use": [
    {
      "tool_name": "get_weather",
      "tool_input": {"location": "NYC"},
      "tool_output": {"temperature": 75}
    }
  ]
}
```

**Our current `generated_trajectory` format:**
```json
{
  "generated_trajectory": [
    {
      "tool": "fs.grep",
      "tool_raw": "mcp_tools_gsd-lite-fs_grep_content",
      "args": {"pattern": "LOG-001"},
      "output": "Line 102: [LOG-001]..."
    }
  ]
}
```

**Transformation needed:**
```python
def transform_to_vertex_format(session: dict) -> dict:
    """Transform eval_helper.py output to Vertex AI expected format."""
    return {
        "prompt": session["full_transcript"],
        "response": session["turns"][-1]["content"],  # Last agent response
        "tool_use": [
            {
                "tool_name": call["tool"],
                "tool_input": call["args"],
                "tool_output": call.get("output", "")
            }
            for call in session.get("generated_trajectory", [])
        ]
    }
```

---

#### 7. Cost Analysis

**Citation:** https://cloud.google.com/vertex-ai/generative-ai/pricing (Gemini Flash pricing)

| Metric | LLM Calls | Model | Est. Cost per Session |
|--------|-----------|-------|----------------------|
| `GENERAL_QUALITY` | 6 | Gemini 2.5 Flash | ~$0.0001 |
| `TOOL_USE_QUALITY` | 2 | Gemini 2.5 Flash | ~$0.00003 |
| `TEXT_QUALITY` | 6 | Gemini 2.5 Flash | ~$0.0001 |
| `INSTRUCTION_FOLLOWING` | 6 | Gemini 2.5 Flash | ~$0.0001 |
| **Total L2 per session** | 20 | — | ~$0.0004 |

**For CI:**
- Evaluate 10 "golden sessions" = ~$0.004 per CI run
- Evaluate 100 sessions for full audit = ~$0.04

**Verdict:** Cost is negligible. Not a factor in decision.

---

#### 8. Implementation Tasks (Updated)

| Task ID | Description | Depends On | Est. Effort | Status |
|---------|-------------|------------|-------------|--------|
| TASK-EVAL-002a | Refactor eval_helper.py to turn-structured schema | LOG-042 | 3h | From LOG-042 |
| TASK-EVAL-002b | Add Vertex-compatible `tool_use` field transformation | LOG-043 | 1h | **NEW** |
| TASK-EVAL-002c | Implement Layer 1 programmatic checks (Python) | LOG-043 | 2h | Updated |
| TASK-EVAL-002d | Create Vertex AI evaluation script (`layer2_vertex.py`) | LOG-043 | 2h | **NEW** (replaces Promptfoo config) |
| TASK-EVAL-002e | Implement aggregated report generation | TASK-EVAL-002c, 002d | 1h | From LOG-042 |
| TASK-EVAL-002f | Create CI integration (GitHub Actions) | TASK-EVAL-002e | 2h | From LOG-042 |

---

#### 9. Dependency Graph

```mermaid
graph TD
    LOG028["LOG-028: CI Framework Design<br/>(Six Pillars, 3-layer architecture)"] --> LOG030
    LOG028 --> LOG032
    
    LOG030["LOG-030: CONSTITUTION.md v0.1<br/>(Four Pillars extracted)"] --> LOG031
    
    LOG031["LOG-031: pair-programming.yaml<br/>(P2-H1 to P2-H5 rubric)"] --> LOG042
    
    LOG032["LOG-032: OpenCode Goldmine<br/>(Data source + Vertex AI trajectory decision)"] --> LOG041
    LOG032 --> LOG042
    
    LOG041["LOG-041: eval_helper.py<br/>(Interactive collect workflow)"] --> LOG042
    
    LOG042["LOG-042: Constitutional Eval Architecture<br/>(Session-as-unit, Promptfoo decision)"] --> LOG043
    
    LOG043["LOG-043: Vertex AI Rubric-Based Eval<br/>(This entry: Hybrid L1+L2, Vertex for qualitative)"]
    
    style LOG043 fill:#90EE90
    style LOG042 fill:#FFB6C1
    style LOG032 fill:#FFB6C1
    
    LOG043 -.->|"Supersedes DECISION-042b"| LOG042
    LOG042 -.->|"Supersedes DECISION-032b"| LOG032
```

**To onboard this decision from scratch:**
1. **LOG-028** (lines 4038-4344): Why CI framework; the Six Pillars; 3-layer architecture concept
2. **LOG-030** (lines 4756-4821): Constitution v0.1 with Four Pillars distilled
3. **LOG-031** (lines 4822-4905): The rubric format; P2-H1 to P2-H5 behaviors (still valid, informs guidelines)
4. **LOG-032** (lines 4906-5477): OpenCode as data source (still valid); Vertex trajectory decision (superseded)
5. **LOG-041** (lines 6688-6985): eval_helper.py implementation (still valid, needs schema update)
6. **LOG-042** (lines 6986-7493): Session-as-unit, hybrid orchestration (still valid); Promptfoo decision (superseded)
7. **LOG-043** (this entry): Vertex AI rubric-based evaluation; hybrid L1+L2 architecture; Constitution as guidelines

---

#### 10. Citations & Sources

| Source | URL | Key Quote |
|--------|-----|-----------|
| Vertex AI Eval Metrics | https://cloud.google.com/vertex-ai/generative-ai/docs/models/determine-eval | "Adaptive rubrics function like unit tests for your models." |
| Rubric Metric Details | https://cloud.google.com/vertex-ai/generative-ai/docs/models/rubric-metric-details | Full list of managed rubric-based metrics with input/output specs |
| Agent Evaluation | https://cloud.google.com/vertex-ai/generative-ai/docs/models/evaluation-agents-client | "The Gen AI evaluation service lets you measure your agent's ability to complete tasks and goals" |
| Guidelines Parameter | determine-eval URL, "General quality metric" section | Code example showing `metric_spec_parameters={"guidelines": "..."}` |

---

#### 11. Open Questions (For Next Session)

| Question | Status | Notes |
|----------|--------|-------|
| Vertex SDK version | OPEN | Need `google-cloud-aiplatform[genai]` — verify version compatibility |
| Multi-turn transcript format | OPEN | Does Vertex expect specific delimiters? ("USER: ... AGENT: ...") |
| Golden session curation | PENDING | Which sessions form the "golden test set" for CI? |
| L1 check coverage | PENDING | Are there more deterministic checks we're missing? |

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-043 (Vertex AI Rubric-Based Evaluation decision)
→ Dependency chain: LOG-043 ← LOG-042 ← LOG-041 ← LOG-032 ← LOG-028
→ Next action: TASK-EVAL-002b — Add Vertex-compatible `tool_use` transformation to eval_helper.py

**Layer 2 — Global Context:**
→ Architecture: eval_helper.py (extract) → Session JSON → Python L1 (deterministic) + Vertex L2 (adaptive rubrics) → aggregate report
→ Patterns: Session = eval unit; Constitution as guidelines parameter; hybrid L1+L2
→ Key decisions: DECISION-043a (Vertex for L2), DECISION-043b (hybrid architecture), DECISION-043c (Constitution as guidelines)

**Fork paths:**
- Implement Vertex integration → TASK-EVAL-002d: Create layer2_vertex.py
- Update eval_helper schema → TASK-EVAL-002b: Add tool_use transformation
- Implement L1 checks → TASK-EVAL-002c: Python programmatic checks
- Spike manually → Run one session through Vertex console before coding

---

### [LOG-044] - [EXEC] - The ELT Pipeline Pivot: Implementing Modular Ingest/Transform/Consume Architecture - Task: TASK-EVAL-002
**Status:** COMPLETE
**Date:** 2026-02-14
**Tasks:** TASK-EVAL-002b (Transform), TASK-EVAL-002c (Consume L1)
**Key Insight:** Refactoring `eval_helper.py` into a modular ELT pipeline (`eval_ingest.py` → `eval_transform.py` → `eval_consume.py`) provides debuggability and clean separation of concerns.
**Dependencies:**
- LOG-043: Vertex AI Hybrid Architecture (defines what we're building)
- LOG-041: Original `eval_helper.py` (renamed to `eval_ingest.py`)
- LOG-028: CI Framework (defines the Six Pillars being checked)

---

#### 1. Executive Summary

We successfully implemented the **Layer 1 (Programmatic)** evaluation pipeline using a modular **ELT (Extract-Load-Transform)** architecture. Instead of a monolithic script, we now have three focused tools that pipe data through the system.

**The Pipeline:**
1. **INGEST (`eval_ingest.py`):** Discovers sessions, audits tools, extracts raw data.
2. **TRANSFORM (`eval_transform.py`):** Reshapes raw data into Vertex AI compatible format (`tool_use`).
3. **CONSUME (`eval_consume.py`):** Runs deterministic Layer 1 checks against the Constitution.

**Why this matters:**
- **Debuggability:** If L1 checks fail, we can inspect the intermediate JSON files to see if it's a data issue or a logic issue.
- **Extensibility:** Adding a new consumer (e.g., Promptfoo) only requires a new `transform` command, not touching ingestion logic.
- **CI Readiness:** `eval_consume.py` includes a `--ci` flag with pass-rate thresholds, ready for GitHub Actions.

---

#### 2. Architecture Diagram

```mermaid
flowchart LR
    subgraph "Data Source"
        OC["OpenCode Storage"]
    end
    
    subgraph "Step 1: Ingest"
        EI["eval_ingest.py"]
        RAW["eval_run_*.json<br/>(Raw Schema)"]
    end
    
    subgraph "Step 2: Transform"
        ET["eval_transform.py"]
        VTX["eval_run_*_vertex.json<br/>(Vertex Schema)"]
    end
    
    subgraph "Step 3: Consume"
        EC["eval_consume.py"]
        REP["Evaluation Report<br/>(Pass/Fail)"]
    end
    
    OC --> EI
    EI --> RAW
    RAW --> ET
    ET --> VTX
    VTX --> EC
    EC --> REP
```

---

#### 3. Component Details

##### 3.1 Step 2: Transform (`eval_transform.py`)

**Goal:** Bridge the gap between OpenCode's raw storage format and Vertex AI's expected input.

**Key Transformation:** Renaming `generated_trajectory` → `tool_use`.

```python
# Source: scripts/eval_transform.py

def transform_to_vertex(session: dict) -> dict:
    """
    Transform raw session to Vertex AI evaluation format.
    Ref: LOG-043 Section 6
    """
    tool_use = []
    for call in session.get("generated_trajectory", []):
        tool_use.append({
            "tool_name": call.get("tool", "unknown"),   # Renamed from 'tool'
            "tool_input": call.get("args", {}),         # Renamed from 'args'
            "tool_output": call.get("output", "")       # Renamed from 'output'
        })
    
    return {
        "tool_use": tool_use,
        # ... other fields ...
    }
```

##### 3.2 Step 3: Consume (`eval_consume.py`)

**Goal:** Enforce the Constitution via deterministic code (Layer 1).

**Implemented Checks:**

| ID | Check Name | Constitution Logic (Source: LOG-030) |
|----|------------|-------------------|
| **S1-H1** | Handoff Present | Response ends with `📦 STATELESS HANDOFF` |
| **S1-H2** | Handoff Structure | Contains "Layer 1" AND "Layer 2" sections |
| **C3-H1** | Grep-First Pattern | Every `fs.read` preceded by `fs.grep` on parent path |
| **C3-H2** | Onboarding Sequence | Session reads PROJECT, ARCHITECTURE, WORK.md |
| **J4-H2** | Backlinks Present | WORK.md writes contain `LOG-XXX` or `Depends On:` |

**Code Example: The Grep-First Check (C3-H1)**

```python
# Source: scripts/eval_consume.py

def check_grep_before_read(session: dict) -> CheckResult:
    """
    C3-H1: Agent uses grep-first pattern.
    PASS: Every fs.read is preceded by fs.grep (or allowed exceptions)
    """
    searched_paths = set(["."]) # Root always implicitly searched
    violations = []
    
    # Iterate through tool calls in order
    for call in trajectory:
        tool = call.get("tool_name", "")
        
        # Track search actions
        if tool == "fs.grep":
            path = call["tool_input"].get("search_path", ".")
            searched_paths.add(path)
            
        # Verify read actions
        if tool == "fs.read":
            file_path = call["tool_input"].get("path", "")
            
            # Check if file is covered by previous search
            is_covered = any(file_path.startswith(p) for p in searched_paths)
            
            if not is_covered and file_path not in EXEMPT_FILES:
                violations.append(file_path)
                
    return CheckResult(passed=len(violations)==0, ...)
```

---

#### 4. Usage Guide for Future Agents

To run the full pipeline on a project:

```bash
# 1. Ingest (Interactive)
python scripts/eval_ingest.py collect --project /path/to/project

# 2. Transform (Vertex format)
python scripts/eval_transform.py vertex

# 3. Consume (Layer 1 Checks)
python scripts/eval_consume.py l1 --verbose
```

**Output Example:**
```
✅ ses_abc123... (5/5 passed)
   ✓ [S1-H1] Handoff Present: Handoff block found
   ✓ [S1-H2] Handoff Structure: Both Layer 1 and Layer 2 present
   ✓ [C3-H1] Grep-First Pattern: All reads preceded by grep/search
   ✓ [C3-H2] Onboarding Sequence: All onboarding files read
   ✓ [J4-H2] Backlinks Present: Backlink patterns found

📊 Summary: 5/5 checks passed (100%)
```

---

#### 5. Open Questions & Next Steps

| Question | Status | Next Step |
|----------|--------|-----------|
| **Layer 2 Implementation** | PENDING | TASK-EVAL-002d: Create `eval_consume.py l2` using Vertex SDK |
| **Golden Set Curation** | OPEN | Need to define which sessions form the CI test set |
| **Turn Schema** | BLOCKED | `eval_ingest.py` still outputs flat prompt/response. Need TASK-EVAL-002a. |

**Immediate Next Action:** Implement Layer 2 (Vertex AI) integration in `eval_consume.py`.

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: Implemented & logged ELT pipeline (TASK-EVAL-002b/c)
→ Dependency chain: LOG-044 (this log) ← LOG-043 (design) ← LOG-041 (original script)
→ Next action: TASK-EVAL-002d — Implement `layer2_vertex.py` (or extend `eval_consume.py`)

**Layer 2 — Global Context:**
→ Architecture: eval_ingest → eval_transform → eval_consume
→ Patterns: ELT pipeline; Dataclass results; L1 checks
→ Key decisions: DECISION-043a (Vertex L2), DECISION-044a (ELT Modular Architecture)

**Fork paths:**
- Implement L2 Vertex → TASK-EVAL-002d
- Refactor for turns[] schema → TASK-EVAL-002a
- Curate golden set → Manual review of existing sessions

---

### [LOG-045] - [DECISION] - Migration to OpenCode SQLite (opencode.db) & Vertex Full-Context Fix - Task: TASK-EVAL-002

**Status:** IMPLEMENTED
**Date:** 2026-02-14
**Decision IDs:**
- DECISION-045a: Migrate `eval_ingest.py` to `sqlmodel` (SQLite)
- DECISION-045b: Update `eval_transform.py` to preserve full context (fix response truncation)
- DECISION-045c: Add `sqlmodel` as optional dependency (`pip install .[eval]`)
**Task:** TASK-EVAL-002 (Constitutional Evaluation Pipeline)
**Supersedes:**
- LOG-041: `eval_helper.py` Implementation (files-based ingestion is now dead)
- LOG-032: OpenCode Goldmine (storage location changed from `~/.local/share/opencode/storage/session` to `opencode.db`)
**Dependencies:**
- LOG-043: Vertex AI Rubric-Based Eval (lines 7506-7935) — defines L2 rubric architecture which required the transform fix
- LOG-044: Constitutional ELT Pipeline (lines 7936-8227) — defines the ingestion/transform/consume layers updated here

#### 1. The Great Migration: From Files to SQLite

**The Symptom:**
The evaluation pipeline suddenly reported 0 sessions.
```bash
$ python scripts/eval_ingest.py discover --project ...
❌ No matching sessions found.
```

**The Discovery:**
OpenCode silently migrated its storage backend. The directory `~/.local/share/opencode/storage/session` (which LOG-032 relied on) was empty or gone.
Investigation revealed a new source of truth: `~/.local/share/opencode/opencode.db`.

**The New Schema (SQLite):**
```mermaid
erDiagram
    SESSION ||--o{ MESSAGE : contains
    MESSAGE ||--o{ PART : contains
    PROJECT ||--o{ SESSION : owns

    SESSION {
        string id PK
        string project_id FK
        int time_created
        string title
    }
    MESSAGE {
        string id PK
        string session_id FK
        json data "Contains role, model_id"
    }
    PART {
        string id PK
        string message_id FK
        json data "Contains type (text/tool), content"
    }
```

**The Fix (DECISION-045a):**
Refactored `eval_ingest.py` to use `sqlmodel` (SQLAlchemy + Pydantic) instead of `pathlib.glob`.
- **Old:** File system traversal (`glob("ses_*.json")`)
- **New:** SQL queries (`select(SessionModel).where(...)`)
- **Impact:** Added `sqlmodel` dependency to `pyproject.toml`.

**Code Snippet (SQLModel Setup):**
```python
# scripts/eval_ingest.py

class Part(SQLModel, table=True):
    """OpenCode part table (tool calls, text, reasoning)."""
    id: str = Field(primary_key=True)
    message_id: str = Field(foreign_key="message.id")
    session_id: str = Field(foreign_key="session.id")
    time_created: int
    data: str  # JSON blob containing tool calls

def extract_paths_from_output(tool_name: str, output: str) -> Set[str]:
    """Extract paths from tool outputs to fingerprint projects."""
    # (Same logic as before, but fed from SQL data)
    ...
```

#### 2. The Vertex Transform Bug (Response Truncation)

**The Symptom:**
Vertex AI transformed files (`*_vertex.json`) contained only tiny fragments of the agent's response.
- Raw file: `response_length: 3550`
- Vertex file: `response_length: 18` ("Now let's test it:")

**The Cause (Premature Optimization):**
In LOG-043 implementation, `eval_transform.py` attempted to "clean up" the response by taking only the last paragraph:
```python
# BAD:
last_response = full_response.split("\n\n")[-1]
```
This destroyed 99% of the context needed for rubric evaluation. Vertex AI's `GENERAL_QUALITY` metric needs the **entire reasoning chain** to evaluate "why" decisions were made.

**The Fix (DECISION-045b):**
Updated `eval_transform.py` to preserve the full response.

```python
# GOOD (scripts/eval_transform.py):
# Keep FULL response — Vertex rubric metrics need complete context
full_response = session.get("response", "")

return {
    # ...
    "prompt": session.get("prompt", ""),
    "response": full_response,  # FULL response, not truncated
    "tool_use": tool_use,
}
```

**Citation:** Vertex AI Documentation, "Rubric-based metrics":
> "Adaptive rubrics function like unit tests for your models... The Gen AI evaluation service then generates rubrics covering both its default tasks and the guidelines you specify."
> *Source: https://cloud.google.com/vertex-ai/generative-ai/docs/models/determine-eval*

**Synthesized Example:**
| Input (Raw) | Old Transform (Buggy) | New Transform (Fixed) |
|-------------|-----------------------|-----------------------|
| "I analyzed the database.<br/><br/>Found 3 tables.<br/><br/>Plan: Update schema." | "Plan: Update schema." | "I analyzed the database.<br/><br/>Found 3 tables.<br/><br/>Plan: Update schema." |
| **Impact on Vertex** | **FAIL** (Missing reasoning) | **PASS** (Full context visible) |

#### 3. Updated Dependency Graph (DAG) for Onboarding

Future agents: Use this DAG to reconstruct the evaluation pipeline context.

```mermaid
graph TD
    LOG-028[LOG-028: CI Framework] --> LOG-042
    LOG-032[LOG-032: OpenCode Goldmine] -- Superseded by --> LOG-045
    LOG-041[LOG-041: Old Ingest] -- Superseded by --> LOG-045
    LOG-042[LOG-042: Eval Architecture] --> LOG-043
    LOG-043[LOG-043: Vertex Hybrid] --> LOG-044
    LOG-044[LOG-044: ELT Pipeline] --> LOG-045
    LOG-045[LOG-045: SQLite Migration] --> TASK-EVAL-002d
```

**Key Files Updated:**
1. `scripts/eval_ingest.py`: Rewritten for SQLite/SQLModel.
2. `scripts/eval_transform.py`: Fixed response truncation.
3. `pyproject.toml`: Added `sqlmodel`, `pyyaml`.

**Next Actions:**
- Proceed to TASK-EVAL-002d (Vertex L2 integration) using the now-correct transformed data.

### [LOG-046] - [DECISION] - Vertex-Native Turn-Structured Schema & Pipeline Simplification: Decommissioning the Transform Layer - Task: TASK-EVAL-002a

**Status:** IMPLEMENTED
**Date:** 2026-02-15
**Decision IDs:**
- DECISION-046a: Implement Vertex-native turn-structured schema in `eval_ingest.py`
- DECISION-046b: Decommission `eval_transform.py` (simplify pipeline)
- DECISION-046c: Update `eval_consume.py` to be turn-aware
**Task:** TASK-EVAL-002a (Turn-structured schema)
**Supersedes:**
- LOG-044: The ELT Pipeline Pivot (removed the "Transform" step)
- LOG-045b: Update `eval_transform.py` (file is now dead)
**Dependencies:**
- LOG-042: Turn-Structured Output Schema (lines 6986-7493) — the original proposal for `turns[]`
- LOG-043: Vertex AI Rubric-Based Eval (lines 7506-7935) — the rubric metric requirements

#### 1. The Schema Gap: Concatenation vs. Conversation

**The Symptom:**
Layer 1 programmatic checks failed because they couldn't distinguish "Did the agent grep before reading THIS file?" vs "Did it grep somewhere else in the session?".
Also, Vertex AI's `MULTI_TURN_GENERAL_QUALITY` metric was receiving a flat blob of text, losing the conversational context.

**The Fix (DECISION-046a):**
Refactored `eval_ingest.py` to output **Vertex-native turn structure** directly.

**Old Schema (Flat):**
```json
{
  "prompt": "User turn 1\n\nUser turn 2",
  "response": "Agent turn 1\n\nAgent turn 2",
  "generated_trajectory": [...]
}
```

**New Schema (Vertex-Native):**
```json
{
  "request": {
    "contents": [
      {"role": "user", "parts": [{"text": "User turn 1"}]},
      {"role": "model", "parts": [{"text": "Agent turn 1"}]},
      {"role": "user", "parts": [{"text": "User turn 2"}]}
    ]
  },
  "response": {
    "candidates": [
      {"content": {"role": "model", "parts": [{"text": "Final agent response"}]}}
    ]
  },
  "intermediate_events": [
    {
      "function_call": {"name": "fs.grep", "args": {...}},
      "function_response": {"name": "fs.grep", "response": {...}},
      "turn": 1
    }
  ],
  "prompt_concat": "...",  // Backward compat for L1
  "response_concat": "..." // Backward compat for L1
}
```

**Citation:** Vertex AI Documentation, "Evaluation Dataset":
> "The Gen AI evaluation service automatically parses multi-turn conversation data... identifies the previous turns and processes them as conversation_history."
> *Source: https://cloud.google.com/vertex-ai/generative-ai/docs/models/evaluation-dataset*

#### 2. Pipeline Simplification: Decommissioning Transform

**The Insight (DECISION-046b):**
`eval_transform.py` existed solely to bridge the gap between `eval_ingest.py`'s flat output and Vertex's schema. Now that ingest outputs Vertex-native directly, the transform step is redundant.

**Old Pipeline (ELT):**
```mermaid
flowchart LR
    Ingest[eval_ingest.py] -->|Flat JSON| Transform[eval_transform.py]
    Transform -->|Vertex JSON| Consume[eval_consume.py]
```

**New Pipeline (E-L):**
```mermaid
flowchart LR
    Ingest[eval_ingest.py] -->|Vertex-Native JSON| Consume[eval_consume.py]
    Transform[eval_transform.py] ---x Dead
```

**Action:** Deleted `scripts/eval_transform.py`.

#### 3. Turn-Aware Consumption

**The Update (DECISION-046c):**
Updated `eval_consume.py` to check specific turns instead of the whole blob.

| Check | Old Logic (Flat) | New Logic (Turn-Aware) |
|-------|------------------|------------------------|
| **S1-H1** (Handoff) | Scanned entire session text | Checks **final model turn** only |
| **C3-H1** (Grep First) | Flat list of tools | Checks tool sequence **per turn** |
| **C3-H2** (Onboarding) | Checked entire session | Checks **Turn 0** specifically |

**Code Snippet:**
```python
# scripts/eval_consume.py

def get_final_response(session: dict) -> str:
    """Extract final model response from Vertex-native schema."""
    try:
        # Try new Vertex-native format first
        return session["response"]["candidates"][0]["content"]["parts"][0]["text"]
    except KeyError:
        # Fallback to legacy
        return session.get("response_concat", "")
```

#### 4. Updated Dependency Graph (DAG)

Future agents: This simplifies the architecture significantly.

```mermaid
graph TD
    LOG-045[LOG-045: SQLite Migration] --> LOG-046
    LOG-046[LOG-046: Vertex Schema & Pipeline Simplify] --> TASK-EVAL-002d
    TASK-EVAL-002d[Vertex L2 Integration] --> TASK-EVAL-002e[CI Workflow]
```

**Next Actions:**
- Proceed to TASK-EVAL-002d (Vertex L2 integration) using the simplified pipeline.
- Verify L1 checks pass on the new schema.

---

### [LOG-047] - [VISION] - GSD-Lite Worklog Reader: Mobile-First Ubiquitous Access for Dense Knowledge Bases - Task: READER-001

#### 1. Executive Summary

**The Problem:** GSD-Lite's journalism-style worklogs (9,000+ lines, 46+ entries) are high-value knowledge assets but impossible to consume outside VS Code. Mobile GitHub viewer lacks outline navigation, scroll-to-bottom, and sticky headers — breaking the "ubiquitous access" principle that makes GTD workflows successful.

**The Solution:** Build a Python generator that compiles WORK.md into a self-contained HTML viewer with mobile-first outline navigation, sticky breadcrumbs, and pre-rendered Mermaid diagrams.

**Key Insight:** This isn't "make markdown render nicely" — it's "build a purpose-built worklog browser" that understands GSD-Lite's structure (LOG-NNN entries, TYPE badges, hierarchical sections).

---

#### 2. The Problem Narrative: Why Existing Tools Fail

##### 2.1 The GTD Parallel

The user's GTD setup (TickTick) exemplifies ubiquitous access:
- Collect thoughts from any device
- Clarify/review from phone, tablet, or desktop
- Central inbox accessible everywhere

GSD-Lite worklogs currently violate this principle:
- **Locked to local filesystem** — WORK.md lives in `~/dev/gsd_lite/gsd-lite/`
- **VS Code-dependent** — Outline view, sticky headers, cmd+down only work in IDE
- **Private by nature** — Can't push to public repo, so no GitHub Pages

##### 2.2 Failed Experiments

| Approach | Issue |
|----------|-------|
| **GitHub Mobile App** | Opens at top of file. No scroll grab button. No outline view. 9k lines = lost immediately. |
| **MkDocs / ReadTheDocs** | Great on desktop. Mobile: **outline disappears** (responsive design hides it). No "jump to bottom." |
| **EPUB Conversion** | Converters only parse H1/H2 headers. GSD-Lite uses H3 (`### [LOG-NNN]`) for entries — invisible in TOC. |

##### 2.3 The Core Requirement

The user needs VS Code's markdown experience **on mobile**:

| VS Code Feature | Mobile Equivalent Needed |
|-----------------|-------------------------|
| `Cmd+End` (jump to bottom) | "Jump to Latest" button |
| Outline panel (H1-H5 hierarchy) | Collapsible sidebar/menu |
| Sticky headers while scrolling | Breadcrumb bar showing current position |
| Horizontal scroll for long lines | Prevent header wrapping in outline |

---

#### 3. The Solution: `generate_worklog_viewer.py`

##### 3.1 Core Architecture

```mermaid
flowchart LR
    WORK[WORK.md] --> Parser[Markdown Parser]
    Parser --> Tree[JSON AST]
    Tree --> Renderer[HTML Renderer]
    Mermaid[Mermaid Blocks] --> |mmdc CLI| PNG[Base64 PNG]
    PNG --> Renderer
    Renderer --> HTML[worklog.html]
```

**Generator invocation:**
```bash
python generate_worklog_viewer.py gsd-lite/WORK.md -o worklog.html
```

**Output:** Single self-contained HTML file. AirDrop to phone. Open in any browser.

##### 3.2 Parsing Contract

The parser relies on GSD-Lite's consistent header format:

| Pattern | Meaning | Regex |
|---------|---------|-------|
| `### [LOG-NNN] - [TYPE] - Title - Task: XXX` | Log entry | `^### \[LOG-(\d+)\] - \[(\w+)\] - (.+)` |
| `#### Section Title` | Section within log | `^#### (.+)` |
| `##### Subsection Title` | Subsection | `^##### (.+)` |
| `[TAG]` anywhere in header | Type badge | `\[([A-Z_]+)\]` |
| `~~strikethrough~~` in title | Superseded entry | `~~.+~~` |

**Example parse (from LOG-043 header):**
```
Input:  ### [LOG-043] - [DECISION] - Vertex AI Rubric... - Task: TASK-EVAL-002
Output: {
    "id": "LOG-043",
    "type": "DECISION",
    "title": "Vertex AI Rubric...",
    "task": "TASK-EVAL-002",
    "superseded": false,
    "line": 7521,
    "children": [...]
}
```

##### 3.3 Output Structure (Single HTML)

```html
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>/* Inline CSS - mobile-first */</style>
</head>
<body>
    <!-- Sticky top bar -->
    <header class="top-bar">
        <button id="outline-toggle">🔖 Outline</button>
        <button id="jump-latest">⬇ Jump Latest</button>
    </header>
    
    <!-- Sticky breadcrumb -->
    <nav class="breadcrumb">LOG-043 > Part 5 > 5.2 Layer 1</nav>
    
    <!-- Outline panel (slide-in on mobile) -->
    <aside class="outline">
        <!-- Collapsible tree rendered here -->
    </aside>
    
    <!-- Content area -->
    <main class="content">
        <!-- Rendered markdown with anchors -->
    </main>
    
    <script>/* Inline JS - scroll sync, outline toggle */</script>
</body>
</html>
```

---

#### 4. UX Specification

##### 4.1 Layout (Mobile-First)

```
┌────────────────────────────────────────┐
│ 🔖 Outline Toggle    [⬇ Jump Latest]  │  ← Sticky top bar
├────────────────────────────────────────┤
│ LOG-043 > Part 5 > 5.2 Layer 1        │  ← Sticky breadcrumb
├────────────────────────────────────────┤
│                                        │
│  [Content area — scrollable]           │
│                                        │
│  #### 5.2 Layer 1: Programmatic...    │
│  ```python                             │
│  def check_handoff_present(...):       │
│  ...                                   │
│                                        │
└────────────────────────────────────────┘
```

**Scrollbar:** Force-visible on mobile (CSS `overflow-y: scroll` + WebKit scrollbar styling). Grabbable thumb for quick navigation.

##### 4.2 Outline Panel

```
📋 WORK.md Outline                    [horizontal scroll →]
───────────────────────────────────────────────────────────
▼ LOG-043 [DECISION] - Vertex AI Rubric-Based Evaluation...
  ├─ 1. Executive Summary
  ├─ 2. The Gap in LOG-042
  │   ├─ 2.1 What LOG-042 Concluded
  │   └─ 2.2 The Missed Feature
  ├─ 3. Vertex AI Metrics Inventory
  └─ ...
  
▶ LOG-042 [DECISION] - Constitutional Eval... (collapsed)
▶ LOG-041 [EXEC] - ~~eval_helper.py...~~ (dimmed, superseded)
```

| Feature | Implementation |
|---------|---------------|
| **Horizontal scroll** | `white-space: nowrap; overflow-x: auto` — headers don't wrap |
| **Dynamic badges** | Parser extracts all `[TAG]` patterns. No hardcoded list. |
| **Superseded dimming** | 50% opacity + strikethrough preserved |
| **Collapsible** | Click `▶` to expand children |

##### 4.3 Type Badges (Dynamic)

Badges are extracted from headers at parse time, not hardcoded:

```python
# Pseudocode
def extract_badges(header_text: str) -> list[str]:
    """Extract all [TAG] patterns from header."""
    return re.findall(r'\[([A-Z_]+)\]', header_text)

# Example
extract_badges("### [LOG-043] - [DECISION] - Vertex AI...")
# Returns: ["LOG-043", "DECISION"]
```

Color mapping is applied at render time:
```css
.badge-DECISION { background: #4CAF50; }
.badge-EXEC { background: #2196F3; }
.badge-DISCOVERY { background: #9C27B0; }
.badge-VISION { background: #FF9800; }
/* Unknown badges get neutral gray */
.badge { background: #607D8B; }
```

##### 4.4 Scroll Sync

**Outline → Content:** Click outline item → smooth scroll to anchor.

**Content → Breadcrumb:** IntersectionObserver watches section headers. As user scrolls, breadcrumb updates to show current position in hierarchy.

```javascript
// Pseudocode
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            updateBreadcrumb(entry.target.dataset.path);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('[data-section]').forEach(el => observer.observe(el));
```

---

#### 5. Mermaid Diagram Handling

##### 5.1 The Requirement

Mermaid code blocks must render as images, not raw code. Mobile browsers don't execute Mermaid JS reliably.

##### 5.2 The Solution: Pre-Render to PNG at Build Time

**Build-time compilation using `mmdc` (Mermaid CLI):**

```bash
# Install mermaid-cli
npm install -g @mermaid-js/mermaid-cli

# Compile single diagram
mmdc -i diagram.mmd -o diagram.png
```

**Generator workflow:**
1. Extract all ```` ```mermaid ```` blocks from WORK.md
2. Write each to temp `.mmd` file
3. Run `mmdc` to compile → PNG
4. Encode PNG as base64
5. Replace code block with `<img src="data:image/png;base64,...">`

##### 5.3 Syntax Validation (Fail Fast)

If `mmdc` returns non-zero exit code, generator **fails with clear error**:

```
ERROR: Mermaid syntax error in block at line 1289

  flowchart LR
      A --> B
      B ---> C  ← Invalid: triple arrow

Fix the diagram before compiling.
```

**Rationale:** Silent failures produce blank images. Fail-fast ensures consistent render behavior across devices.

##### 5.4 Base64 Embedding (Single-File Portability)

```html
<!-- Before (raw mermaid) -->
<pre><code class="language-mermaid">
flowchart LR
    A --> B
</code></pre>

<!-- After (embedded PNG) -->
<img 
    class="mermaid-diagram" 
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    alt="Mermaid diagram: flowchart LR A --> B"
/>
```

**Trade-off acknowledged:** Each diagram adds ~50-200KB base64. For a worklog with 10 diagrams, that's 0.5-2MB. Acceptable for single-file portability.

---

#### 6. Filter Bar (Nice-to-Have, Phase 2)

```
[ALL] [DECISION] [EXEC] [DISCOVERY] [VISION] [MILESTONE]
```

**Behavior:** Tap badge to filter outline to just that type. Useful for "show me all decisions" use case.

**Implementation:** CSS class toggle + JS filter on outline items.

---

#### 7. Technical Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Parser** | Python `mistune` or regex | Consistent GSD-Lite format makes regex viable |
| **Mermaid CLI** | `@mermaid-js/mermaid-cli` (mmdc) | Official tooling, reliable PNG output |
| **Markdown Render** | `marked.js` (CDN) or Python `mistune` | Lightweight, well-tested |
| **Syntax Highlight** | `highlight.js` (inline) | Code blocks need Python/bash coloring |
| **Styling** | Inline CSS | Single-file constraint |
| **Interactivity** | Vanilla JS | No framework needed for scroll sync |

---

#### 8. Implementation Plan

| Task ID | Description | Complexity |
|---------|-------------|------------|
| READER-001a | Build markdown parser (extract LOG entries + hierarchy) | Medium |
| READER-001b | Build HTML renderer (outline + content + breadcrumb) | Medium |
| READER-001c | Integrate Mermaid CLI (pre-render + base64 embed) | Low |
| READER-001d | Implement scroll sync (IntersectionObserver) | Low |
| READER-001e | Mobile CSS polish (scrollbar, hamburger menu) | Low |
| READER-001f | End-to-end test on actual WORK.md | Low |

**Estimated LOC:** ~400-600 Python (generator) + ~200 JS (inline) + ~150 CSS (inline)

---

#### 9. Plugin Architecture (Opt-In, Not Core)

##### 9.1 The Principle: Keep GSD-Lite Light

GSD-Lite core is a **protocol + templates** — markdown files and agent instructions. Zero runtime dependencies. Works with any LLM client that can read files.

The Worklog Reader introduces dependencies:
- Python 3.x
- `@mermaid-js/mermaid-cli` (npm package)
- Potentially `mistune` or other markdown parser

**These MUST NOT pollute the base install.**

##### 9.2 Distribution Model (Monorepo)

```
gsd-lite/                         ← Single repo
├── gsd-lite/                     ← Core (always installed)
│   ├── PROTOCOL.md
│   ├── PROJECT.md
│   ├── WORK.md
│   └── templates/
│       └── workflows/
│
└── plugins/                      ← Plugins (opt-in, same repo)
    └── reader/
        ├── generate_worklog_viewer.py
        ├── requirements.txt
        └── README.md
```

**Why monorepo over multi-repo:**
| Concern | Multi-Repo | Monorepo |
|---------|-----------|----------|
| Cross-cutting changes | Multiple PRs, version sync | Single PR |
| Discovery | "Where's the reader plugin?" | `plugins/` folder, obvious |
| CI/CD | Separate pipelines | One pipeline, conditional jobs |
| Maintenance burden | N repos to maintain | One repo |

**Installation (future):**
```bash
# Core only (default)
gsd-lite install

# With reader plugin (same repo, just installs extra deps)
gsd-lite install --with-plugins reader

# Or manual for just the plugin
cd plugins/reader && pip install -r requirements.txt
```

##### 9.3 Why This Matters

| User Type | Needs Reader? | Install Path |
|-----------|---------------|--------------|
| **New user** exploring GSD-Lite | No | Core only |
| **Light user** with short worklogs | No | Core only |
| **Power user** with 5k+ line worklogs | Yes | Core + Reader plugin |
| **Team lead** reviewing team worklogs | Yes | Core + Reader plugin |

**The bar:** If your WORK.md fits comfortably in VS Code outline, you don't need this. If you're scrolling for 30 seconds to find LOG-042, you do.

---

#### 10. Future Enhancements (Out of Scope for POC, Post-Plugin)

| Enhancement | Description |
|-------------|-------------|
| **Hosted version** | Deploy to VM/GitHub Pages with auth |
| **Write support** | Add to INBOX.md from mobile |
| **Search** | Full-text search across worklog |
| **Dark mode** | Toggle for night reading |
| **Split by LOG** | Generate one HTML per log entry for faster loading |

---

#### 11. Dependency Graph (For Future Agents)

```mermaid
graph TD
    subgraph "Context Required"
        PROTOCOL[PROTOCOL.md] -->|GSD-Lite structure| LOG-047
        LOG-016[LOG-016: Stateless-First] -->|Journalism style rationale| LOG-047
        LOG-017[LOG-017: Housekeeping Vision] -->|Large worklog problem space| LOG-047
    end
    
    subgraph "This Entry"
        LOG-047[LOG-047: Worklog Reader Vision]
    end
    
    subgraph "Implementation"
        LOG-047 --> READER-001a[Parser]
        LOG-047 --> READER-001b[Renderer]
        LOG-047 --> READER-001c[Mermaid CLI]
    end
```

**To onboard this decision:**
1. **LOG-016** — Understand why worklogs are dense (journalism style for zero-context agents)
2. **LOG-017** — Understand the broader "large worklog" problem space (context rot, archival)
3. **This entry (LOG-047)** — The mobile consumption solution

---

#### 12. Cross-References and Citations

| Source | What It Informed |
|--------|------------------|
| User's TickTick GTD workflow | Ubiquitous access principle |
| VS Code Outline View | Target UX for mobile equivalent |
| MkDocs Material (https://squidfunk.github.io/mkdocs-material/) | Example of responsive design that hides outline on mobile — what NOT to do |
| Mermaid CLI docs (https://github.com/mermaid-js/mermaid-cli) | `mmdc` invocation for PNG output |
| WORK.md header grep (this session) | Confirmed consistent `### [LOG-NNN]` pattern for parsing |

---

#### 13. Decision Record

| ID | Decision | Rationale |
|----|----------|-----------|
| **DECISION-047a** | Single HTML file with base64-embedded PNGs | Portability trumps file size. AirDrop/file-share without folder management. |
| **DECISION-047b** | Pre-render Mermaid at build time | Mobile browsers can't reliably execute Mermaid JS. Build-time ensures consistent rendering. |
| **DECISION-047c** | Fail-fast on Mermaid syntax errors | Silent failures produce blank images. Explicit errors force fix before distribution. |
| **DECISION-047d** | Dynamic badge extraction (not hardcoded list) | Future-proofs for new log types. Parser extracts `[TAG]` patterns at runtime. |
| **DECISION-047e** | Horizontal scroll for outline items | Prevents header wrapping on narrow screens. Preserves scanability. |
| **DECISION-047f** | Force-visible scrollbar on mobile | Grabbable thumb enables quick navigation. Default hidden scrollbars break UX for long documents. |
| **DECISION-047g** | **Plugin architecture (opt-in, not core)** | GSD-Lite core must stay light. Reader is a power-user feature for dense worklogs. Opt-in install, no dependencies added to base install. |
| **DECISION-047h** | **Monorepo structure (not separate repos)** | Single `gsd-lite` repo with `plugins/` folder. Easier maintenance, single PR for cross-cutting changes, no multi-repo sync headaches. Plugins are still opt-in at install time. |

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-047 (VISION: Worklog Reader design)
→ Dependency chain: LOG-047 ← LOG-017 (housekeeping problem space) ← LOG-016 (journalism rationale)
→ Next action: READER-001a — Build markdown parser for LOG entry extraction

**Layer 2 — Global Context:**
→ Architecture: GSD-Lite worklogs use `### [LOG-NNN] - [TYPE] - Title` format consistently
→ Patterns: Journalism-style dense logs optimized for zero-context agent onboarding
→ Data Flow: WORK.md → Parser → JSON AST → HTML Renderer → worklog.html

**Fork paths:**
- Continue to implementation → Start with READER-001a (parser skeleton)
- Discuss UX refinements → Reference Section 4 (UX Specification)
- Pivot to hosting discussion → Reference Section 9 (Future: VM/GitHub Pages)

---

### [LOG-048] - [EXEC] - Worklog Reader POC: Parser + HTML Renderer Implementation (READER-001a, READER-001b) - Task: READER-001

#### 1. Executive Summary

**What was built:** A working POC of the GSD-Lite Worklog Reader — a Python generator that compiles WORK.md (9,000+ lines) into a self-contained HTML viewer with mobile-first outline navigation, collapsible sections, and desktop/mobile responsive design.

**Files created:**
- `plugins/reader/parse_worklog.py` (~160 lines) — Markdown parser extracting LOG entries into JSON AST
- `plugins/reader/generate_worklog_viewer.py` (~800 lines) — HTML renderer with full viewer UX

**Key decisions made:**
- DECISION-048a: Positional parsing — only first two `[brackets]` extracted (ID, TYPE), rest is title
- DECISION-048b: Single-click collapses descendants, double-click expands all descendants
- DECISION-048c: Sidebar resizes as overlay (not pushing content)
- DECISION-048d: Desktop toggle button visible (same `📋` button works on both mobile and desktop)

---

#### 2. The Implementation Journey

##### 2.1 Parser Design (READER-001a)

The parser contract was kept intentionally simple per user preference ("keep it simple, get to POC"):

```
### [LOG-NNN] - [TYPE] - {title}
     ↑ pos 1    ↑ pos 2   ↑ everything else verbatim
```

**Source:** `plugins/reader/parse_worklog.py` lines 45-52

```python
LOG_HEADER_PATTERN = re.compile(
    r'^### \[LOG-(\d+)\] - \[([A-Z_]+)\] - (.+)$'
)
```

**Edge case discovered:** LOG-041 has three bracketed items:
```
### [LOG-041] - [EXEC] - ~~title~~ [SUPERSEDED BY LOG-045] - Task: TASK-EVAL-001
```

**Resolution (DECISION-048a):** Sequence matters. Parser extracts positions 1-2 only. The `[SUPERSEDED BY LOG-045]` stays in title string. Strikethrough detection (`~~...~~`) handles visual dimming separately.

##### 2.2 Code Fence Bug

**Symptom:** Parser was extracting headers from inside fenced code blocks (e.g., `## Philosophy` inside a markdown example).

**Root cause:** No state tracking for code fences.

**Fix:** `plugins/reader/parse_worklog.py` lines 72-80

```python
# Track fenced code blocks - skip parsing inside them
in_code_fence = False

for line_num, line in enumerate(lines, start=1):
    # Toggle code fence state (``` or ~~~)
    if line.startswith('```') or line.startswith('~~~'):
        in_code_fence = not in_code_fence
        continue
    
    # Skip all parsing inside code fences
    if in_code_fence:
        continue
```

##### 2.3 HTML Renderer Evolution (READER-001b)

The renderer went through 6 iterations based on user feedback:

| Version | Issue Fixed |
|---------|-------------|
| v1 | Initial implementation |
| v2 | Tables broken → proper `<table><thead><tbody>` state machine |
| v3 | Mobile banner overflow → flex-shrink fixes |
| v4 | Collapse buttons + mobile scroll thumb |
| v5 | Resizable sidebar + alignment fix for same-level items |
| v6 | Desktop toggle button + collapse descendants on single-click |

---

#### 3. Key UX Decisions

##### 3.1 DECISION-048b: Collapse/Expand Behavior

**User requirement:** "Single click = one level, double-click = expand all descendants"

**Implementation:** `plugins/reader/generate_worklog_viewer.py` lines 745-770

```javascript
// Single click - toggle this item; if collapsing, collapse descendants too
btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const item = btn.closest('.outline-item');
    const isCollapsed = item.classList.contains('collapsed');
    
    if (isCollapsed) {
        // Expanding - just expand this item
        item.classList.remove('collapsed');
    } else {
        // Collapsing - collapse this item AND all descendants
        item.classList.add('collapsed');
        item.querySelectorAll('.outline-item.has-children').forEach(child => {
            child.classList.add('collapsed');
        });
    }
});

// Double click - expand all descendants
btn.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    const item = btn.closest('.outline-item');
    item.classList.remove('collapsed');
    item.querySelectorAll('.outline-item.has-children').forEach(child => {
        child.classList.remove('collapsed');
    });
});
```

**Rationale:** After double-click expands everything, user expects single-click to reset to collapsed state. Without collapsing descendants, the tree stays "stuck" expanded.

##### 3.2 DECISION-048c: Sidebar Resize as Overlay

**User feedback:** "I was more so want a way to scan the outline without breaking the content main."

**Resolution:** Removed `ResizeObserver` that adjusted content margin. Sidebar now resizes **over** content, not pushing it.

**Source:** `plugins/reader/generate_worklog_viewer.py` — CSS `resize: horizontal` on `.outline`, no JS margin adjustment.

##### 3.3 DECISION-048d: Desktop Toggle Button

**User request:** "Did we ever implement a button to hide/show sidebar on desktop?"

**Implementation:** Same `📋` button works on both platforms. JS detects viewport width and applies appropriate behavior:

```javascript
function toggleOutline() {
    if (window.innerWidth >= 768) {
        // Desktop: toggle hidden class + adjust content
        outline.classList.toggle('hidden');
        content.classList.toggle('full-width');
    } else {
        // Mobile: slide-in behavior
        outline.classList.toggle('open');
        overlay.classList.toggle('visible');
    }
}
```

---

#### 4. Table Rendering Fix

**Symptom:** Tables showed raw markdown (`| col1 | col2 |`) instead of HTML tables. Inline formatting (bold, italic) inside cells was also broken.

**Root cause:** Original implementation detected table rows but didn't:
1. Wrap rows in `<table><thead><tbody>` structure
2. Apply inline formatting to cell content

**Fix:** `plugins/reader/generate_worklog_viewer.py` lines 167-195

```python
def format_inline(text: str) -> str:
    """Apply inline markdown formatting to text."""
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'\*(.+?)\*', r'<em>\1</em>', text)
    text = re.sub(r'`(.+?)`', r'<code>\1</code>', text)
    text = re.sub(r'~~(.+?)~~', r'<del>\1</del>', text)
    text = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2">\1</a>', text)
    return text

# In table rendering:
if not in_table:
    html_lines.append('<table><thead><tr>')
    cells_html = ''.join(f'<th>{format_inline(html.escape(c))}</th>' for c in cells)
    html_lines.append(f'{cells_html}</tr></thead><tbody>')
    in_table = True
else:
    cells_html = ''.join(f'<td>{format_inline(html.escape(c))}</td>' for c in cells)
    html_lines.append(f'<tr>{cells_html}</tr>')
```

---

#### 5. Scroll Navigation Fixes

##### 5.1 Banner Blocking Content

**Symptom:** When clicking outline links, content scrolled but the target header was hidden behind the sticky top bar.

**Fix:** CSS `scroll-margin-top` on all content elements:

```css
.content h1, .content h2, .content h3, .content h4, .content h5, .content p {
    scroll-margin-top: 60px;
}
```

**Source:** `plugins/reader/generate_worklog_viewer.py` lines 513-516

##### 5.2 Mobile Scroll Thumb

**User request:** "There is no big scroll button I can grab apart from the native browser scroll button."

**Implementation:** Custom floating scroll thumb that tracks page position:

```html
<div class="scroll-thumb" id="scrollThumb">
    <div class="thumb-icon"><span>↕</span></div>
</div>
```

Touch-draggable via `touchstart`/`touchmove`/`touchend` handlers. Position updates on scroll via `ResizeObserver`.

**Source:** `plugins/reader/generate_worklog_viewer.py` lines 690-700 (HTML), lines 780-810 (JS)

---

#### 6. Alignment Fix for Same-Level Items

**Symptom:** In LOG-047's outline, "1. Executive Summary" (no children) appeared left-aligned while "2. The Problem..." (has children, shows `▼`) appeared indented due to the toggle button width.

**Fix:** Items without children get padding to align with toggle button width:

```css
.outline-item:not(.has-children) .outline-row {
    padding-left: 20px;
}
```

**Source:** `plugins/reader/generate_worklog_viewer.py` lines 425-428

---

#### 7. Architecture Diagram

```mermaid
flowchart LR
    subgraph "Parser (parse_worklog.py)"
        MD[WORK.md] --> Regex[Regex Patterns]
        Regex --> AST[JSON AST]
    end
    
    subgraph "Renderer (generate_worklog_viewer.py)"
        AST --> Outline[Outline HTML]
        AST --> Content[Content HTML]
        MD --> MDRender[Markdown → HTML]
        Outline --> Template[HTML Template]
        Content --> Template
        MDRender --> Template
        Template --> HTML[worklog.html]
    end
    
    subgraph "Output Features"
        HTML --> Mobile[Mobile: Slide-in sidebar + scroll thumb]
        HTML --> Desktop[Desktop: Persistent sidebar + toggle]
        HTML --> Collapse[Collapsible sections]
        HTML --> Resize[Resizable sidebar]
    end
```

---

#### 8. File Manifest

| File | Lines | Purpose |
|------|-------|---------|
| `plugins/reader/parse_worklog.py` | ~160 | Extract LOG entries from WORK.md into JSON AST |
| `plugins/reader/generate_worklog_viewer.py` | ~800 | Generate self-contained HTML viewer |

**Usage:**
```bash
cd plugins/reader
python generate_worklog_viewer.py ../../gsd-lite/WORK.md -o worklog.html
open worklog.html  # Desktop
# AirDrop worklog.html to phone for mobile testing
```

---

#### 9. Remaining Tasks (Not Implemented)

| Task ID | Description | Status |
|---------|-------------|--------|
| READER-001c | Mermaid CLI integration (pre-render diagrams to base64 PNG) | Pending |
| READER-001d | Scroll sync breadcrumb (IntersectionObserver) | Pending |
| READER-001e | Mobile CSS polish | Pending |
| READER-001f | End-to-end test on actual WORK.md | Pending |

These are logged in LOG-047 Section 8 (Implementation Plan).

---

#### 10. Test Results

| Feature | Desktop | Mobile |
|---------|---------|--------|
| Sidebar toggle | ✅ `📋` button shows/hides | ✅ Slide-in overlay |
| Collapse/expand | ✅ Single/double-click works | ✅ Same behavior |
| Resize sidebar | ✅ Drag handle, overlays content | ✅ Same behavior |
| Table rendering | ✅ Proper `<table>` structure | ✅ Same |
| Inline formatting in tables | ✅ Bold, italic, code, links | ✅ Same |
| Scroll navigation | ✅ Clears sticky header | ✅ Same |
| Scroll thumb | N/A (hidden on desktop) | ✅ Draggable `↕` button |
| Same-level alignment | ✅ Items align regardless of children | ✅ Same |

---

#### 11. Decision Record

| ID | Decision | Rationale |
|----|----------|-----------|
| **DECISION-048a** | Positional parsing (first two brackets only) | User preference for simplicity. `[SUPERSEDED BY...]` tag stays in title. Strikethrough handles dimming. |
| **DECISION-048b** | Single-click collapses descendants, double-click expands all | Prevents "stuck" state after double-click expand. Natural mental model. |
| **DECISION-048c** | Sidebar resizes as overlay, not pushing content | User wanted to scan outline without breaking reading flow in main content. |
| **DECISION-048d** | Same toggle button (`📋`) for mobile and desktop | Simplest implementation. JS detects viewport and applies appropriate behavior. |

---

#### 12. Dependency Graph

```mermaid
graph TD
    subgraph "Context Required"
        LOG-047[LOG-047: Worklog Reader Vision] -->|Design spec| LOG-048
        LOG-017[LOG-017: Housekeeping Vision] -->|Problem space: large worklogs| LOG-047
        LOG-016[LOG-016: Stateless-First] -->|Journalism rationale| LOG-047
    end
    
    subgraph "This Entry"
        LOG-048[LOG-048: Parser + Renderer Implementation]
    end
    
    subgraph "Outputs"
        LOG-048 --> Parser[plugins/reader/parse_worklog.py]
        LOG-048 --> Renderer[plugins/reader/generate_worklog_viewer.py]
    end
    
    subgraph "Future Work"
        LOG-048 -.-> READER-001c[Mermaid CLI]
        LOG-048 -.-> READER-001d[Scroll Sync]
    end
```

**To onboard this implementation:**
1. **LOG-047** — Understand the vision and UX spec (Section 4: UX Specification, Section 7: Technical Stack)
2. **This entry (LOG-048)** — Implementation details, decisions, and test results

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-049 (DECISION: Full Node/TypeScript rewrite with Vite hot reload)
→ Dependency chain: LOG-049 ← LOG-048 (POC complete) ← LOG-047 (vision)
→ Next action: READER-002a — Scaffold Node/TypeScript project with pnpm + Vite

**Layer 2 — Global Context:**
→ Architecture: `plugins/reader/` (Python, preserved) + `plugins/reader-vite/` (new TypeScript)
→ Patterns: Vite HMR for hot reload, native Mermaid library (no shell-out), SVG diagrams
→ Data Flow: WORK.md → chokidar watch → parser.ts → renderer.ts → WebSocket → browser

**Fork paths:**
- Begin implementation → READER-002a (scaffold pnpm + Vite + TypeScript project)
- Discuss incremental rebuild strategy → How to avoid re-rendering 9k lines on every save
- Pivot to evaluation work → Resume TASK-EVAL-002d (Vertex AI integration)

---

### [LOG-049] - [DECISION] - The Hot Reload Pivot: Migrating Worklog Reader from Python to Node/TypeScript with Vite - Task: READER-002

#### 1. Executive Summary

**The Catalyst:** After successfully building the Worklog Reader POC (LOG-048), user feedback revealed a gap between "working" and "delightful." The current workflow requires manual regeneration after every WORK.md edit — friction that breaks the flow during active GSD-Lite sessions.

**The Decision:** Rewrite the Worklog Reader in Node/TypeScript with Vite for hot module replacement (HMR). When the user says "log this discovery," the browser updates instantly — no manual refresh, no regenerate command.

**Key Decisions Made:**
- **DECISION-049a:** Full Node/TypeScript rewrite (not Python + Node hybrid)
- **DECISION-049b:** Vite as build tool and dev server (not custom esbuild + chokidar)
- **DECISION-049c:** pnpm as package manager (not npm or yarn)
- **DECISION-049d:** SVG for Mermaid diagrams (not PNG/base64)
- **DECISION-049e:** Plugin architecture boundary — Core GSD-Lite stays Python (`uvx`), Reader plugin is Node (`pnpm`)

---

#### 2. The Problem: Manual Regeneration Breaks Flow

##### 2.1 Current Workflow (LOG-048 POC)

```mermaid
sequenceDiagram
    participant User
    participant Agent
    participant WORK.md
    participant Terminal
    participant Browser
    
    User->>Agent: "Log this discovery"
    Agent->>WORK.md: Writes LOG-049
    User->>Terminal: python generate_worklog_viewer.py
    Terminal->>Browser: Generates worklog.html
    User->>Browser: Manual refresh (Cmd+R)
    Browser->>User: Shows updated content
```

**Pain points identified:**
1. Context switch to terminal after every log write
2. Manual browser refresh breaks reading flow
3. No feedback that WORK.md changed — user must remember to regenerate

##### 2.2 Desired Workflow (Hot Reload)

```mermaid
sequenceDiagram
    participant User
    participant Agent
    participant WORK.md
    participant Vite
    participant Browser
    
    User->>Agent: "Log this discovery"
    Agent->>WORK.md: Writes LOG-049
    WORK.md->>Vite: chokidar detects change
    Vite->>Vite: Re-parse, re-render
    Vite->>Browser: WebSocket push (HMR)
    Browser->>User: Content updates instantly
```

**The insight:** This mirrors the user's reference — [Mark Sharp](https://github.com/jonathanyeung/mark-sharp), a VS Code extension providing live Mermaid preview. The user wants that polish, but purpose-built for GSD-Lite's LOG-NNN structure.

---

#### 3. The Architecture Decision: Why Full Node/TypeScript?

##### 3.1 The Two Paths Considered

| Aspect | Path A: Python + Node Hybrid | Path B: Full Node/TypeScript |
|--------|------------------------------|------------------------------|
| **File watching** | `watchdog` (Python library) | `chokidar` (Node, battle-tested) |
| **HTTP server** | `flask` or `http.server` | Vite dev server (built-in) |
| **WebSocket/HMR** | DIY implementation | Vite HMR (zero config) |
| **Mermaid integration** | Shell out to `mmdc` CLI | Native `mermaid` npm package |
| **Hot reload ecosystem** | Manual wiring | Vite/esbuild — production-grade |
| **Maintenance burden** | Two runtimes, two package managers | Single ecosystem |

##### 3.2 The Uncomfortable Truth (Source: Discussion)

> "If you're adding `mmdc` (which requires Node), you're already pulling in the Node ecosystem. Python becomes a 'glue layer' shelling out to Node tools."

The original READER-001c plan (LOG-047, Section 5) called for:
```bash
# Install mermaid-cli (Node dependency)
npm install -g @mermaid-js/mermaid-cli

# Python shells out to Node
subprocess.run(['mmdc', '-i', 'diagram.mmd', '-o', 'diagram.png'])
```

**This is the worst of both worlds:** Node as a hidden dependency, Python as a thin wrapper, no access to Node's superior hot reload tooling.

##### 3.3 DECISION-049a: Full Node/TypeScript Rewrite

**Rationale:** If Node is required anyway, embrace it fully. The parser logic is ~160 lines (LOG-048, Section 2.1) — a trivial port. The renderer is ~800 lines but follows clear patterns (state machines for tables/code fences). TypeScript adds type safety without runtime overhead.

**Trade-off acknowledged:** Users who only want core GSD-Lite (markdown templates) now have an optional Node dependency for the Reader plugin. This is acceptable per the plugin architecture (LOG-047, Section 9).

---

#### 4. The Tooling Decisions

##### 4.1 DECISION-049b: Vite as Build Tool

**Why Vite over custom esbuild + chokidar:**

| Concern | Custom Setup | Vite |
|---------|--------------|------|
| Hot reload | Manual WebSocket wiring | Built-in HMR, zero config |
| Dev server | Express/Koa + middleware | `vite dev` — one command |
| Build mode | esbuild config | `vite build` — one command |
| CSS handling | Manual bundling | Automatic |
| Time to working prototype | Days | Hours |

**Source:** User preference expressed in discussion:
> "vite please"

**Vite's HMR contract:**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    watch: {
      // Watch WORK.md outside project root
      ignored: ['!**/gsd-lite/WORK.md'],
    },
  },
});
```

When `WORK.md` changes, Vite triggers a rebuild. The browser receives a WebSocket message and updates without full page refresh.

##### 4.2 DECISION-049c: pnpm as Package Manager

**Why pnpm over npm/yarn:**

| Aspect | npm | yarn | pnpm |
|--------|-----|------|------|
| Disk usage | Duplicates packages per project | Duplicates | Hardlinks to global store |
| Install speed | Baseline | Faster | Fastest |
| Strictness | Allows phantom deps | Allows | Strict — only declared deps accessible |
| Monorepo support | Workspaces | Workspaces | Native, with filtering |

**Source:** User preference expressed in discussion:
> "better yet can we do pnpm please i heard good things about build time and storage space"

**Installation (requires Node 16.14+):**
```bash
# Enable corepack (ships with Node)
corepack enable

# pnpm is now available
pnpm --version
```

##### 4.3 DECISION-049d: SVG for Mermaid Diagrams

**The original plan (LOG-047, Section 5.4)** called for PNG with base64 embedding:
```html
<img src="data:image/png;base64,iVBORw0KGgo..." />
```

**Why SVG is better for the live server use case:**

| Aspect | PNG (base64) | SVG |
|--------|--------------|-----|
| File size | 50-200KB per diagram | 5-20KB per diagram |
| Scalability | Pixelates on zoom | Infinite resolution |
| Text | Rasterized | Selectable, searchable |
| Edit workflow | Re-render entire image | DOM diffing possible |
| Mobile data usage | Higher | Lower |

**Source:** Discussion:
> "svg it is ! so we originally wanted png case it's base64 encodable for porting as standalone html pages. At your discretion what's best for the vision when we publish it to our live reverse proxied server for mobile reads."

**Resolution:** SVG for the live dev server. For standalone HTML export (AirDrop to phone), SVG still works — it's inline XML, not an external file.

**Mermaid native SVG render:**
```typescript
import mermaid from 'mermaid';

// Initialize once
mermaid.initialize({ startOnLoad: false, theme: 'default' });

// Render diagram to SVG string
const { svg } = await mermaid.render('diagram-1', `
  flowchart LR
    A --> B --> C
`);

// svg is now: '<svg xmlns="http://www.w3.org/2000/svg">...</svg>'
```

##### 4.4 DECISION-049e: Plugin Architecture Boundary

**The principle (LOG-047, Section 9.1):**
> "GSD-Lite core is a **protocol + templates** — markdown files and agent instructions. Zero runtime dependencies."

**The boundary:**

| Component | Distribution | Runtime |
|-----------|--------------|---------|
| Core GSD-Lite | `uvx gsd-lite install` | Python (scaffolds markdown only) |
| Reader Plugin | `pnpm install` in `plugins/reader-vite/` | Node 18+ |

**Friction points to track (captured for future distribution work):**

| Friction Point | When It Hits | Mitigation |
|----------------|--------------|------------|
| Node not installed | User runs `pnpm` commands | Clear error + link to Node install |
| pnpm not installed | User has Node but no pnpm | `corepack enable` or `npm i -g pnpm` |
| Mermaid syntax errors | Invalid diagram in WORK.md | Fail-fast with line number |
| Port 3000 in use | Another dev server running | `--port` CLI flag |
| Large WORK.md (9k+ lines) | Hot reload feels slow | Incremental rebuild (future optimization) |

---

#### 5. The Implementation Plan

##### 5.1 Task Breakdown

| Task ID | Description | Complexity | Status |
|---------|-------------|------------|--------|
| **READER-002a** | Scaffold Node/TypeScript project with pnpm + Vite | Low | Pending |
| **READER-002b** | Port `parse_worklog.py` to TypeScript | Medium | Pending |
| **READER-002c** | Port `generate_worklog_viewer.py` to TypeScript + Mermaid | Medium | Pending |
| **READER-002d** | Implement Vite dev server with HMR | Medium | Pending |
| **READER-002e** | Static build mode (`pnpm build` → `worklog.html`) | Low | Pending |

##### 5.2 Project Structure

```
plugins/
├── reader/                      # Original Python (preserved for reference)
│   ├── parse_worklog.py
│   ├── generate_worklog_viewer.py
│   └── worklog.html
│
└── reader-vite/                 # New TypeScript + Vite
    ├── package.json
    ├── pnpm-lock.yaml
    ├── tsconfig.json
    ├── vite.config.ts
    ├── src/
    │   ├── parser.ts            # Port of parse_worklog.py
    │   ├── renderer.ts          # Port of generate_worklog_viewer.py
    │   ├── mermaid.ts           # Native Mermaid integration
    │   ├── server.ts            # Dev server entry point
    │   └── types.ts             # TypeScript interfaces (WorklogAST, etc.)
    ├── public/
    │   └── index.html           # Dev server HTML shell
    ├── dist/                    # Build output
    │   └── worklog.html
    └── README.md
```

##### 5.3 Developer Experience (Target)

**Dev mode (hot reload):**
```bash
cd plugins/reader-vite
pnpm install                     # One-time setup
pnpm dev ../../gsd-lite/WORK.md  # Starts localhost:3000, watches for changes
```

**Build mode (static export):**
```bash
pnpm build ../../gsd-lite/WORK.md -o worklog.html
# Output: dist/worklog.html (self-contained, AirDrop-ready)
```

##### 5.4 Data Flow (Dev Server)

```mermaid
flowchart LR
    subgraph "File System"
        WORK[WORK.md]
    end
    
    subgraph "Vite Dev Server"
        Watch[chokidar watcher]
        Parser[parser.ts]
        Mermaid[mermaid.ts]
        Renderer[renderer.ts]
        HMR[HMR WebSocket]
    end
    
    subgraph "Browser"
        DOM[Rendered HTML]
    end
    
    WORK -->|"change event"| Watch
    Watch -->|"read file"| Parser
    Parser -->|"JSON AST"| Renderer
    Parser -->|"mermaid blocks"| Mermaid
    Mermaid -->|"SVG strings"| Renderer
    Renderer -->|"HTML string"| HMR
    HMR -->|"WebSocket push"| DOM
```

---

#### 6. Mobile Strategy (Deferred)

**User clarification:**
> "nope let's keep mobile a secondary to this localhost requirement. So I'm envisioning a workflow where we publish this to a secure / reverse proxied with basic http password somewhere i'll read on mobile. But after this refactor please"

**Interpretation:**
1. **Phase 1 (this task):** Hot reload on localhost for desktop development
2. **Phase 2 (future):** Expose via reverse proxy (nginx/Caddy) + HTTP basic auth for mobile access

**Not in scope for READER-002:**
- Network exposure configuration
- Authentication setup
- Mobile-specific optimizations

---

#### 7. Reference: Mark Sharp Extension

**Source:** [github.com/jonathanyeung/mark-sharp](https://github.com/jonathanyeung/mark-sharp)

**What it does:** VS Code extension providing streamlined markdown preview with:
- Live preview (updates as you type)
- Mermaid diagram rendering (first-class support)
- GitHub-flavored markdown styling

**Why referenced:** User's current workflow uses Mark Sharp for Mermaid preview in VS Code. The Worklog Reader aims to provide equivalent (or better) experience for GSD-Lite's specific structure:
- LOG-NNN badges (Mark Sharp doesn't understand)
- Collapsible outline navigation (Mark Sharp doesn't have)
- Jump to Latest button (Mark Sharp doesn't have)
- Mobile-friendly layout (Mark Sharp is VS Code-only)

---

#### 8. Superseded Plans

This decision **supersedes** the original Mermaid integration approach from LOG-047:

| Original (LOG-047 §5) | New (This Decision) |
|-----------------------|---------------------|
| Shell out to `mmdc` CLI | Native `mermaid` npm package |
| PNG output with base64 | SVG output (inline XML) |
| Python subprocess calls | TypeScript async/await |
| Manual regeneration | Vite HMR (automatic) |

**The original READER-001c task is now absorbed into READER-002c** (Mermaid is part of the TypeScript renderer, not a separate integration step).

---

#### 9. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| TypeScript port introduces bugs | Medium | Low | Unit tests comparing output to Python version |
| Vite HMR doesn't work with external file (WORK.md) | Low | High | Vite supports `server.watch` config for external files |
| Large WORK.md causes slow hot reload | Medium | Medium | Incremental rebuild in Phase 2 (only re-render changed sections) |
| Mermaid syntax errors crash dev server | Medium | Medium | Try-catch with error overlay (Vite pattern) |

---

#### 10. Decision Record

| ID | Decision | Rationale |
|----|----------|-----------|
| **DECISION-049a** | Full Node/TypeScript rewrite | If Node is required for Mermaid anyway, embrace it fully for access to superior hot reload tooling. |
| **DECISION-049b** | Vite as build tool and dev server | Built-in HMR, zero config, production-grade. User preference confirmed. |
| **DECISION-049c** | pnpm as package manager | Faster installs, deduped storage via hardlinks. User preference confirmed. |
| **DECISION-049d** | SVG for Mermaid diagrams | Smaller, scalable, text-selectable. Works for both dev server and static export. |
| **DECISION-049e** | Plugin architecture boundary | Core GSD-Lite stays Python (`uvx`), Reader plugin is Node (`pnpm`). Clear separation of concerns. |

---

#### 11. Dependency Graph

```mermaid
graph TD
    subgraph "Context Required"
        LOG-047[LOG-047: Worklog Reader Vision] -->|"UX spec, plugin architecture"| LOG-049
        LOG-048[LOG-048: Parser + Renderer POC] -->|"Working Python impl to port"| LOG-049
        LOG-017[LOG-017: Housekeeping Vision] -->|"Problem: large worklogs need tooling"| LOG-047
    end
    
    subgraph "This Entry"
        LOG-049[LOG-049: Hot Reload Pivot to Node/TypeScript]
    end
    
    subgraph "Outputs (Implementation Tasks)"
        LOG-049 --> READER-002a[READER-002a: Scaffold pnpm + Vite]
        LOG-049 --> READER-002b[READER-002b: Port parser.ts]
        LOG-049 --> READER-002c[READER-002c: Port renderer.ts + Mermaid]
        LOG-049 --> READER-002d[READER-002d: Vite dev server]
        LOG-049 --> READER-002e[READER-002e: Static build mode]
    end
    
    subgraph "Supersedes"
        LOG-049 -.->|"absorbs"| READER-001c[READER-001c: Mermaid CLI integration]
    end
    
    subgraph "Future Work"
        LOG-049 -.->|"enables"| MOBILE[Mobile via reverse proxy]
    end
```

**To onboard this decision:**
1. **LOG-047** — Understand the original vision, UX spec, and plugin architecture
2. **LOG-048** — Review the Python implementation being ported
3. **This entry (LOG-049)** — Understand why we're pivoting to Node/TypeScript and the implementation plan

---

#### 12. Updated Current Understanding

The following updates should be reflected in Section 1 (Current Understanding):

```
<active_task>
Task: READER-002 - GSD-Lite Worklog Reader (Node/TypeScript + Vite Hot Reload)
Status: PLANNING COMPLETE - See LOG-049
Key insight: Full Node/TypeScript rewrite with Vite HMR for instant browser updates when WORK.md changes.
Next: READER-002a — Scaffold pnpm + Vite + TypeScript project structure

---
**Parked:**
- READER-001c through 001f: SUPERSEDED by READER-002 (absorbed into TypeScript rewrite)
- TASK-EVAL-002d: Vertex AI integration (resume after READER-002)
</active_task>
```


### [LOG-050] - [EXEC] - The Hot Reload Loop & Error DX: Vite Plugin + Mermaid Error Aggregator - Task: READER-002d

#### 1. Executive Summary

**The Milestone:** We have successfully implemented the hot-reloading dev server for GSD-Lite Worklog Reader. The browser now updates instantly when `WORK.md` changes, solving the "friction" problem identified in LOG-049.

**The DX Innovation:** During implementation, we discovered that Mermaid syntax errors were buried at the bottom of the page (Mermaid default behavior) or hard to locate in large files (8k+ lines). We pivoted to build an **"Agent-First" Error Panel** that aggregates all errors, highlights the source line, and provides a one-click "Copy All" button formatted specifically for pasting back to an AI agent for fixing.

**Key Achievements:**
- **Hot Module Replacement (HMR):** Custom Vite plugin watches external `WORK.md` and triggers client updates.
- **Error Aggregation:** Sticky top-right panel collects all broken diagrams.
- **Agent-Ready Output:** "Copy All" generates a markdown report with line numbers and error details.
- **Zero-Config:** `pnpm dev` just works, pointing to `../../gsd-lite/WORK.md` by default.

---

#### 2. The Implementation: Bridging Filesystem to Browser

##### 2.1 The Challenge: Watching External Files

Vite is designed to watch files *inside* the project root. Our `WORK.md` lives two levels up (`../../gsd-lite/WORK.md`). Standard `vite.config.ts` watching triggers a rebuild but doesn't necessarily notify the client if the file isn't imported as a module.

##### 2.2 The Solution: Custom Vite Plugin (`vite-plugin-worklog.ts`)

We built a custom plugin that acts as the bridge:

```typescript
// plugins/reader-vite/src/vite-plugin-worklog.ts
export function worklogPlugin(options: WorklogPluginOptions = {}): Plugin {
  // ... configuration ...
  return {
    name: 'vite-plugin-worklog',
    configureServer(devServer) {
      // 1. Serve content via middleware
      devServer.middlewares.use((req, res, next) => {
        if (req.url === '/_worklog') {
          const content = readFileSync(resolvedPath, 'utf-8');
          res.end(content);
        }
        next();
      });

      // 2. Watch external file
      devServer.watcher.add(resolvedPath);

      // 3. Emit custom HMR event
      devServer.watcher.on('change', (changedPath) => {
        if (changedPath === resolvedPath) {
          devServer.ws.send({
            type: 'custom',
            event: 'worklog-update', // Client listens for this
            data: { timestamp: Date.now() },
          });
        }
      });
    },
  };
}
```

**Client-Side Consumption (`main.ts`):**

```typescript
// Listen for the custom event
if (import.meta.hot) {
  import.meta.hot.on('worklog-update', () => {
    console.log('[GSD-Lite Reader] WORK.md changed, reloading...');
    loadAndRender(); // Re-fetch from /_worklog and re-render
  });
}
```

---

#### 3. The "Agent-First" Error DX

##### 3.1 The Problem

When a Mermaid diagram breaks (e.g., syntax error), Mermaid.js default behavior is to render a massive error message at the bottom of the DOM or replace the diagram with an ugly error box. In a 10,000-line `WORK.md` file, finding *which* diagram broke is painful.

##### 3.2 The Solution: Aggregated Error Panel

We implemented a robust error handling strategy:

1.  **Suppress Default:** `mermaid.initialize({ suppressErrorRendering: true })`
2.  **Catch & Collect:** Wrap `mermaid.render()` in try/catch blocks.
3.  **Track Line Numbers:** The renderer now annotates wrappers with `data-start-line` derived from the source markdown.
4.  **Sticky Panel:** A fixed panel shows all errors with "Jump" buttons.

**The "Copy for Agent" Workflow:**
The panel includes a "📋 Copy All" button that generates a report formatted for LLM consumption:

```markdown
## Mermaid Diagram Errors in WORK.md

Found 2 broken diagram(s). Please fix:

### Error 1: Line ~9420
**Error:** Parse error on line 3: ... expecting 'Arrow', got 'EOF'
**Broken code:**
\`\`\`mermaid
graph TD
  A -->
\`\`\`
```

This reduces the "Fix it" loop to seconds:
1. User sees red panel.
2. User clicks "Copy All".
3. User pastes to Agent: "Fix these."
4. Agent receives exact line numbers and error context.

---

#### 4. New Requirements & Next Steps

During the review of the HMR implementation, new requirements emerged for the reading experience:

**1. Pinch-to-Zoom for Diagrams:**
Complex dependency graphs (like our Task vs. Decision graph) are hard to read on smaller screens. We need pan/zoom capabilities.

**2. Syntax Highlighting:**
Fenced code blocks are currently monochrome. We need proper syntax highlighting (PrismJS or similar) to match the "Journalism Quality" goal.

**Updates to Task List:**

| Task | Description | Status |
|------|-------------|--------|
| **READER-002d** | Vite dev server + HMR | **COMPLETE** |
| **READER-002e** | Static build mode (`pnpm build`) | Pending |
| **READER-002f** | **[NEW]** Pan/Zoom for Mermaid diagrams | Next |
| **READER-002g** | **[NEW]** Syntax highlighting for code blocks | Next |

---

#### 5. Updated Current Understanding

The following updates should be reflected in Section 1 (Current Understanding):

```
<active_task>
Task: READER-002 - GSD-Lite Worklog Reader
Status: EXECUTION - Hot Reload & Error DX Complete
Current Focus: Enhancing Reading Experience (Zoom + Syntax Highlight)
Next Action: READER-002f - Implement Pan/Zoom for Mermaid diagrams
</active_task>
```

#### 6. Dependency Graph for Onboarding

```mermaid
graph TD
    LOG-049[LOG-049: Hot Reload Pivot] -->|"Implemented via"| LOG-050
    LOG-050[LOG-050: Vite Plugin + Error DX]
    
    LOG-050 --> READER-002f[READER-002f: Pan/Zoom]
    LOG-050 --> READER-002g[READER-002g: Syntax Highlight]
    
    subgraph "Technical Components"
        PLUGIN[vite-plugin-worklog.ts] -->|"Watches"| WORK[WORK.md]
        PLUGIN -->|"Emits HMR"| CLIENT[main.ts]
        CLIENT -->|"Catches Errors"| PANEL[Error Panel]
    end
```

### [LOG-051] - [EXEC] - Reader UX Enhancements: Pan/Zoom Overlay & Semantic Light Theme - Task: READER-002f, READER-002g

#### 1. Executive Summary

**The Milestone:** We have significantly improved the reading experience for dense worklogs. Complex dependency graphs are now explorable via a pan/zoom overlay, and code blocks are finally readable thanks to a semantic light theme that avoids the "dark-on-dark" contrast failure.

**Key Findings:**
- **The "False" Problem:** Auto-detecting syntax for prose/pseudocode is harmful. It misclassifies plain text as SQL/Code, applying random colors that confuse the reader.
- **Contrast Failure:** Dark themes are fragile. A dark syntax theme on a page with dark code block backgrounds resulted in near-zero visibility.
- **The Solution:** A "Semantic Light Theme" (One Light inspired) with explicit language tagging only. Plain text stays plain.

---

#### 2. Implementation: Pan/Zoom Overlay (READER-002f)

**The Challenge:** Mermaid diagrams (especially large dependency graphs) are unreadable on small screens or when deeply nested.

**The Solution:** Implemented a GitHub-style overlay viewer:
- **Interaction:** Clicking any diagram opens a fullscreen modal.
- **Controls:** Zoom (+/-), Reset (⟲), and Pan (click-and-drag).
- **Mobile:** Supports touch gestures (pinch-to-zoom, drag-to-pan).
- **Architecture:** Zero dependencies. Pure DOM manipulation with CSS transforms (`translate` + `scale`).

```typescript
// plugins/reader-vite/src/diagram-overlay.ts
export function openDiagramOverlay(svgContent: string): void {
  // ... creates overlay DOM ...
  svgWrapper.innerHTML = svgContent;
  updateTransform(); // Applies pan/zoom state
}
```

---

#### 3. Implementation: Semantic Syntax Highlighting (READER-002g)

**The Journey:**
1. **Attempt 1 (Highlight.js Default):** Resulted in "dark on dark" unreadable text because `index.html` enforced a dark background on `<pre>` blocks.
2. **Attempt 2 (Dark Theme):** Still had contrast issues and lacked semantic variety (everything looked blue).
3. **Attempt 3 (The Fix):** 
   - **Forced Light Theme:** Used `!important` to override page styles.
   - **Disabled Auto-Detect:** Only highlight blocks with explicit language tags (`json`, `yaml`, `sql`, `ts`).
   - **Semantic Palette:** Implemented a "One Light" inspired palette with distinct colors for Keys (Purple), Strings (Green), and Booleans (Red).

**The Palette (One Light Inspired):**

| Token Type | Color | Hex |
|------------|-------|-----|
| Keywords   | Purple| `#a626a4` |
| Strings    | Green | `#50a14f` |
| Booleans   | Red   | `#e45649` |
| Functions  | Blue  | `#4078f2` |
| Numbers    | Orange| `#986801` |

---

#### 4. Next Steps

- **READER-002e:** Build static version (`pnpm build`) for distribution.
- **TASK-EVAL-002d:** Resume Vertex AI integration now that the Reader is stable.

---

### [LOG-052] - [EXEC] - Static Build Complete: TypeScript Fixes for Production - Task: READER-002e
**Timestamp:** 2026-02-15

**The Task:** Run `pnpm build` to create production-ready static assets.

**Initial State:** Build failed with 8 TypeScript errors:
1. `import.meta.hot` not recognized (3 errors in `main.ts`)
2. DOM elements possibly null (5 errors in `renderer.ts`)

**Root Cause Analysis:**

| Error Type | Cause | Fix |
|------------|-------|-----|
| `Property 'hot' does not exist on ImportMeta` | Missing Vite client type declarations | Created `src/vite-env.d.ts` with `/// <reference types="vite/client" />` |
| `'outline' is possibly 'null'` | TypeScript strict mode doesn't understand early-return guards in nested functions | Added non-null assertions (`!`) for DOM elements already validated at parent scope |

**The Fix:**

```typescript
// src/vite-env.d.ts (NEW FILE)
/// <reference types="vite/client" />

// src/renderer.ts (toggleOutline function)
function toggleOutline(): void {
  if (window.innerWidth >= 768) {
    outline!.classList.toggle('hidden');  // Non-null assertion
    content!.classList.toggle('full-width');
  } else {
    outline!.classList.toggle('open');
    overlay!.classList.toggle('visible');
  }
}
```

**Output:** `dist/` folder with:
- `index.html` — Shell that loads bundled assets
- `assets/` — Hashed JS/CSS bundles

**Status:** ✅ Complete

**Next:** LOOP-006 captured — Mobile distribution strategy needs discussion before proceeding.

---
### [LOG-053] - [DISCOVERY] - The Node Distribution Model: npm Registry vs pnpm Efficiency - Task: READER-002
**Timestamp:** 2026-02-15

**The Context:** Exploring distribution options for the Reader plugin. Coming from a Python background (`PyPI`, `pip`, `uv`), we need to map the Node ecosystem (`npm`, `pnpm`, `npx`) to understand registry mechanics and disk efficiency.

**1. The Mental Model Mapping (Python → Node)**

| Python Concept | Node/JS Equivalent | Notes |
| :--- | :--- | :--- |
| **PyPI** | **npm Registry** | The central database of packages. |
| `pip install` | `npm install` | The classic (slow, disk-heavy) installer. |
| `uv pip install` | **`pnpm install`** | The modern, fast, disk-efficient installer. |
| `pyproject.toml` | **`package.json`** | Defines metadata, dependencies, scripts. |
| `uvx tool` | **`npx tool`** | Download & run a CLI tool ephemerally. |
| `dist/` (wheel) | `dist/` (tarball) | The build artifact you upload. |

**2. The Registry Mechanism**
The **npm Registry** (registry.npmjs.org) is build-tool agnostic. It receives a tarball (`.tgz`) containing the code and `package.json`.
- It does **not** care if you built with `npm`, `yarn`, or `pnpm`.
- You authenticate (`npm login`), build (`vite build`), and publish (`npm publish` or `pnpm publish`).
- The registry serves that static artifact to the world.

**3. The Disk Space Reality**

*   **`npm` (Classic):** Creates nested `node_modules` in every project. If 100 projects use React, you have 100 copies of React on disk. Massive duplication.
*   **`pnpm` (Modern):** Uses a **Content-Addressable Store**. It saves *one* copy of React globally (`~/.local/share/pnpm/store`). Project `node_modules` contain **hard links** to this store. Disk usage is near zero for subsequent projects.
*   **`npx` (Runner):** Uses the **npm cache**, not the pnpm store. Running `npx gsd-reader` downloads to `~/.npm/_npx/...`, potentially duplicating what's in your pnpm store.
*   **`pnpm dlx` (Efficient Runner):** The `uvx` equivalent. Fetches the tool, executes it, but leverages the efficient pnpm store cache.

**4. The Publishing Workflow**
Since we use `pnpm` locally, the workflow is streamlined:

1.  **Configure `package.json`**:
    ```json
    {
      "name": "@gsd-lite/reader",
      "bin": { "gsd-read": "./dist/cli.js" }, // Entry point
      "files": ["dist"],                      // Artifacts to upload
      "scripts": { "prepublishOnly": "pnpm build" }
    }
    ```
2.  **Publish**: `pnpm publish --access public`

**Conclusion:** We will proceed with publishing to the npm registry. Users can choose their runner: `npx` for universality, `pnpm dlx` for efficiency. The distribution channel is standard, robust, and decouples the Reader tool from the core Python GSD-Lite package.

---
### [LOG-054] - [FIX] - Indented Code Block Rendering in Reader - Task: READER-002
**Timestamp:** 2026-02-15

**The Context:** User reported that indented fenced code blocks (commonly used inside list items, e.g., LOG-053) were not rendering as code blocks in the Vite reader app. They appeared as raw text with backticks.

**The Root Cause:**
The custom markdown parser (`renderer.ts` and `parser.ts`) used a strict check for code fences:
```typescript
if (line.startsWith('```')) { ... }
```
This failed for any indented block (e.g., `    ```json`), causing the parser to treat the line as a regular paragraph.

**The Fix:**
Updated both `parser.ts` (for log splitting) and `renderer.ts` (for HTML generation) to allow leading whitespace:
```typescript
const trimmedLine = line.trim();
if (trimmedLine.startsWith('```') || trimmedLine.startsWith('~~~')) { ... }
```
This ensures indented blocks are correctly recognized as code fences while preserving the indentation of the inner content (as `codeBuffer` captures the raw line).

**Outcome:**
Code blocks nested in lists (like the `package.json` example in LOG-053) now render correctly as syntax-highlighted blocks.

---
### [LOG-055] - [FIX] - Default Badge Readability in Reader - Task: READER-002
**Timestamp:** 2026-02-15

**The Context:** User reported that the `[FIX]` tag was rendering as white text on a white background (invisible) because it lacked a specific CSS class.

**The Fix:**
Updated `plugins/reader-vite/index.html` to set a default background color (`#666`) on both `.badge` (outline) and `.log-type` (card view) classes.

**Why Not Specific Logic?**
Instead of adding `.badge-FIX` (and chasing every future tag), we implemented a fallback style. Any tag without a specific `.badge-TYPE` override will now render as a readable dark grey badge. This aligns with the "robust by default" philosophy and avoids "semantic disasters" like hardcoding red for generic fixes.

**Outcome:**
`[FIX]` and any other custom tags now appear clearly as neutral gray badges without requiring code changes.

---
### [LOG-056] - [DECISION] - Reader Distribution: Lightweight CLI with Native File Watching - Task: READER-003
**Timestamp:** 2026-02-15

#### 1. Executive Summary

**The Problem:** The GSD-Lite Worklog Reader (`plugins/reader-vite/`) works beautifully in development (`pnpm dev`), but has no distribution story. Users can't run it from arbitrary projects — especially remote servers where `gsd-lite/WORK.md` lives on a different machine than the browser.

**The Decision:** Publish `@gsd-lite/reader` to npm with a lightweight CLI (`cli.js`) that uses chokidar for file watching and WebSocket for live reload. No Vite runtime dependency. The reader runs **on the same machine as WORK.md** (typically remote), with HTTP port-forwarded to local browser.

**Key Insight:** Since `gsd-lite install --local` already runs on the remote server, the reader should too. This makes chokidar work (local filesystem access) and keeps the architecture simple.

---

#### 2. The Remote-First Constraint

##### 2.1 The Deployment Reality

GSD-Lite projects often live on **remote servers** (e.g., a dbt project on a data platform VM). The engineer's workflow:

```mermaid
graph LR
    subgraph "Local Machine"
        A[OpenCode from ~/]
        B[Browser localhost:3000]
        C[Browser localhost:8124]
    end
    
    subgraph "Remote Server"
        D[fs-mcp :8124]
        E["@gsd-lite/reader :3000"]
        F[gsd-lite/WORK.md]
    end
    
    A -->|"SSH tunnel :8124"| D
    B -->|"SSH tunnel :3000"| E
    D -->|"read/write"| F
    E -->|"chokidar watch"| F
```

##### 2.2 Why Chokidar Works

Chokidar uses OS-level file system events (`inotify` on Linux, `FSEvents` on macOS). It can only watch files **on the same machine**. 

| Scenario | Chokidar Works? | Reason |
|----------|-----------------|--------|
| Reader local, WORK.md local | ✅ Yes | Same filesystem |
| Reader local, WORK.md remote | ❌ No | No cross-network inotify |
| Reader remote, WORK.md remote | ✅ Yes | Same filesystem |

**Decision:** Reader runs on remote. User port-forwards HTTP to local browser. This is consistent with the existing fs-mcp pattern.

---

#### 3. Architecture: Lightweight CLI (No Vite Runtime)

##### 3.1 Why Not Ship Vite?

Two architectures were considered:

| Architecture | Dependencies | Install Size | Maintenance |
|--------------|--------------|--------------|-------------|
| **A: Ship Vite** | vite, esbuild, rollup | ~50MB+ | Track Vite major versions |
| **B: Custom CLI** | chokidar, ws | ~2MB | Stable, minimal surface |

**Decision:** Architecture B. The reader doesn't need Vite's module HMR — it just needs "file changed → re-render". A WebSocket ping achieves this in ~80 lines of code.

##### 3.2 The Implementation

**Package structure after implementation:**
```
plugins/reader-vite/
├── package.json          ← Updated for npm publishing
│   ├── name: "@gsd-lite/reader"
│   ├── bin: { "gsd-reader": "./cli.js" }
│   ├── files: ["cli.js", "dist/"]
│   └── dependencies: { "chokidar": "^4.x", "ws": "^8.x" }
├── cli.js                ← NEW: npx entry point (~80 lines)
├── dist/                 ← Static build (from Vite, but Vite not shipped)
│   ├── index.html
│   └── assets/
├── src/                  ← Development source (uses Vite)
│   ├── main.ts           ← Modified: WebSocket client instead of import.meta.hot
│   └── ...
└── vite.config.ts        ← For development only, not shipped
```

##### 3.3 The CLI (`cli.js`)

```javascript
#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');
const chokidar = require('chokidar');

const PORT = parseInt(process.env.PORT || process.argv.find(a => a.startsWith('--port='))?.split('=')[1] || '3000');
const WORKLOG = process.argv[2] && !process.argv[2].startsWith('--') 
  ? process.argv[2] 
  : './gsd-lite/WORK.md';

const DIST = path.join(__dirname, 'dist');

// Serve static files + /_worklog endpoint
const server = http.createServer((req, res) => {
  if (req.url === '/_worklog') {
    try {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(fs.readFileSync(path.resolve(WORKLOG), 'utf-8'));
    } catch (err) {
      res.statusCode = 404;
      res.end(`WORK.md not found: ${WORKLOG}`);
    }
    return;
  }
  
  // Serve static files from dist/
  let filePath = path.join(DIST, req.url === '/' ? 'index.html' : req.url);
  // ... standard static file serving logic
});

// WebSocket for live reload
const wss = new WebSocketServer({ server });

// Watch WORK.md with chokidar
chokidar.watch(path.resolve(WORKLOG)).on('change', () => {
  console.log('[gsd-reader] WORK.md changed, notifying clients...');
  wss.clients.forEach(ws => ws.send('reload'));
});

server.listen(PORT, () => {
  console.log(`[gsd-reader] Serving: http://localhost:${PORT}`);
  console.log(`[gsd-reader] Watching: ${path.resolve(WORKLOG)}`);
});
```

##### 3.4 Client-Side Change

Replace Vite's HMR with WebSocket:

```typescript
// OLD (Vite HMR - development only)
if (import.meta.hot) {
  import.meta.hot.on('worklog-update', () => loadAndRender());
}

// NEW (WebSocket - works in production CLI)
function connectWebSocket(): void {
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const ws = new WebSocket(`${protocol}//${location.host}`);
  
  ws.onmessage = (event) => {
    if (event.data === 'reload') {
      console.log('[gsd-reader] WORK.md changed, reloading...');
      loadAndRender();
    }
  };
  
  ws.onclose = () => {
    // Reconnect after 2 seconds if connection lost
    setTimeout(connectWebSocket, 2000);
  };
}

// Initialize
loadAndRender();
connectWebSocket();
```

---

#### 4. User Experience

##### 4.1 Installation & Usage

```bash
# On remote server (SSH'd in)
cd ~/my-dbt-project

# Step 1: Install GSD-Lite artifacts (already documented)
uvx gsd-lite@latest install --local

# Step 2: Start fs-mcp (already doing this)
uvx fs-mcp@latest --port 8124 &

# Step 3: Start reader (NEW)
npx @gsd-lite/reader
# Or with explicit path/port:
npx @gsd-lite/reader ./gsd-lite/WORK.md --port 3001
```

```bash
# On local machine — add port forward
ssh -L 3000:localhost:3000 -L 8124:localhost:8124 remote-server

# Open browser
open http://localhost:3000
```

##### 4.2 The Complete Remote Workflow

```mermaid
sequenceDiagram
    participant Local as Local Browser
    participant SSH as SSH Tunnel
    participant Reader as @gsd-lite/reader
    participant FS as Filesystem
    participant Agent as OpenCode + fs-mcp

    Note over Local,Agent: Setup Phase
    Agent->>FS: Write to WORK.md
    
    Note over Local,Agent: Reader Running
    Reader->>FS: chokidar.watch(WORK.md)
    Local->>SSH: GET localhost:3000
    SSH->>Reader: Forward request
    Reader->>Local: Serve index.html + assets
    Local->>Reader: WebSocket connect
    
    Note over Local,Agent: Live Reload Loop
    Agent->>FS: Append LOG-057 to WORK.md
    FS-->>Reader: inotify: file changed
    Reader->>Local: WebSocket: "reload"
    Local->>Reader: GET /_worklog
    Reader->>FS: Read WORK.md
    Reader->>Local: Return content
    Local->>Local: Re-render UI
```

---

#### 5. Development vs Production

The reader maintains **two modes**:

| Mode | Command | File Watching | Live Reload | Use Case |
|------|---------|---------------|-------------|----------|
| **Development** | `pnpm dev` | Vite plugin | Vite HMR | Developing the reader itself |
| **Production** | `npx @gsd-lite/reader` | chokidar | WebSocket | Using the reader on any project |

**Key:** Vite is a **dev dependency**, not shipped. The `dist/` folder contains pre-built static assets. The `cli.js` serves these assets and handles live reload independently.

---

#### 6. Publishing Workflow

```bash
# In plugins/reader-vite/
pnpm build                      # Build static assets to dist/
pnpm publish --access public    # Publish to npm

# Users can then:
npx @gsd-lite/reader
# Or for efficiency (uses pnpm store):
pnpm dlx @gsd-lite/reader
```

**Note:** Requires `@gsd-lite` npm organization. If unavailable, fallback to unscoped `gsd-reader`.

---

#### 7. Implementation Tasks

| Task ID | Description | Status |
|---------|-------------|--------|
| READER-003a | Create `cli.js` with HTTP server + chokidar + WebSocket | Pending |
| READER-003b | Update `package.json` for npm publishing (bin, files, deps) | Pending |
| READER-003c | Modify `main.ts` to use WebSocket instead of `import.meta.hot` | Pending |
| READER-003d | Update ARCHITECTURE.md with plugins section | Pending |
| READER-003e | Update PROJECT.md with Reader context | Pending |
| READER-003f | Test end-to-end: build → npx → live reload | Pending |

---

#### 8. Dependencies

| Log ID | Relationship | Summary |
|--------|--------------|---------|
| LOG-047 | Foundation | Vision for mobile-first worklog reader — defines UX requirements |
| LOG-050 | Builds on | Vite plugin + hot reload loop — the dev experience we're preserving |
| LOG-051 | Builds on | Reader UX enhancements (pan/zoom, light theme) — features to ship |
| LOG-052 | Builds on | Static build complete — `dist/` folder ready for distribution |
| LOG-053 | Builds on | npm registry mechanics — publishing workflow understood |

**Dependency DAG:**
```mermaid
graph TD
    LOG047[LOG-047: Reader Vision] --> LOG050[LOG-050: Vite Plugin HMR]
    LOG050 --> LOG051[LOG-051: UX Enhancements]
    LOG051 --> LOG052[LOG-052: Static Build]
    LOG053[LOG-053: npm Registry] --> LOG056[LOG-056: Distribution Decision]
    LOG052 --> LOG056
```

---

### [LOG-057] - [MILESTONE] - Reader Published to npm: @luutuankiet/gsd-reader v0.1.1 - Task: READER-003
**Timestamp:** 2026-02-15

#### 1. Summary

The GSD-Lite Worklog Reader is now published to npm and can be invoked with a single command:

```bash
npx @luutuankiet/gsd-reader
```

This milestone completes the Reader distribution story (READER-003).

---

#### 2. Implementation Details

##### 2.1 Files Created/Modified

| File | Change |
|------|--------|
| `plugins/reader-vite/cli.cjs` | **NEW** — HTTP server + chokidar file watching + WebSocket live reload |
| `plugins/reader-vite/package.json` | Updated for npm publishing: bin, files, dependencies |
| `plugins/reader-vite/src/main.ts` | Added WebSocket client + scroll position preservation |
| `.github/workflows/publish-reader.yaml` | **NEW** — GHA workflow with npm trusted publishing (OIDC) |

##### 2.2 Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| `cli.cjs` not `cli.js` | Package has `"type": "module"`, so CommonJS needs `.cjs` extension |
| `"bin": "./cli.cjs"` (string) | When bin is a string, npx auto-resolves scoped package name |
| Scroll preservation via `savedScrollY` | Save before render, restore after Mermaid completes — simple and reliable |
| WebSocket reconnect with 2s delay | Handles server restarts gracefully |

##### 2.3 npm Package Details

```
Package: @luutuankiet/gsd-reader
Version: 0.1.1
Size: 808 KB (packed), 2.8 MB (unpacked)
Dependencies: chokidar, ws
Bin: npx @luutuankiet/gsd-reader
```

---

#### 3. Usage

```bash
# On remote server (or local project)
npx @luutuankiet/gsd-reader                     # Watches ./gsd-lite/WORK.md on :3000
npx @luutuankiet/gsd-reader ./path/to/WORK.md   # Custom path
npx @luutuankiet/gsd-reader --port=3001         # Custom port

# For remote access, SSH tunnel the port
ssh -L 3000:localhost:3000 remote-server
# Then open http://localhost:3000 in browser
```

---

#### 4. CI/CD: Trusted Publishing

Created `.github/workflows/publish-reader.yaml` using npm trusted publishing (OIDC):

- **Trigger:** `reader-v*` tags (e.g., `git tag reader-v0.2.0`)
- **No secrets required:** Uses GitHub OIDC for authentication
- **Automatic provenance:** npm generates attestations for supply chain security

**Setup required on npmjs.com:**
1. Go to package settings → Trusted Publisher
2. Add GitHub Actions with workflow filename `publish-reader.yaml`

---

#### 5. Dependencies

| Log ID | Relationship | Summary |
|--------|--------------|---------|
| LOG-056 | Decision | Architecture decision: lightweight CLI with chokidar + WebSocket |
| LOG-052 | Builds on | Static build (`dist/`) ready for distribution |
| LOG-053 | Builds on | npm registry mechanics understood |

---

#### 6. What's Next

- Configure trusted publishing on npmjs.com (one-time setup)
- Update ARCHITECTURE.md and PROJECT.md with `@luutuankiet/gsd-reader` package name
- Resume evaluation work (TASK-EVAL-002d: Vertex AI integration)

---

### [LOG-058] - [EXEC] - Reader v0.2.0: Section Rendering & Scroll Sync - Task: READER-004
**Timestamp:** 2026-02-15

#### 1. Summary

Implemented critical features from the original LOG-047 roadmap:
- **Section Rendering:** H2/H3 headers now render as cards in the main content.
- **Sticky Breadcrumb:** Top bar showing current scroll position.
- **Outline Follow-Along:** Active outline item highlights and auto-scrolls.
- **Scroll Sync:** Bi-directional sync between content and navigation.

Version bumped to `0.2.0`.

#### 2. Technical Implementation

##### 2.1 Parser Update (`parser.ts`)
- Modified `Section` interface to include `content?: string`.
- Updated parsing loop to capture content for H2/H3 sections (previously only captured for LOG entries).
- Ensured code fences (```) work correctly across section boundaries.

##### 2.2 Renderer Update (`renderer.ts`)
- Added `renderSection()`: Renders sections with purple left-border styling.
- **Combined Rendering:** `renderWorklog` now interleaves sections and logs in line-number order.
- **IntersectionObserver:** Tracks visible elements (`[data-section-title]`) to update breadcrumb and outline highlight.
- **Auto-Scroll:** Active outline item scrolls into view if hidden.

##### 2.3 Visual Design (`index.html`)
- **Breadcrumb:** Sticky gradient bar (`#667eea` → `#764ba2`) below top header.
- **Section Cards:** Distinct from logs (purple border vs pink).
- **Active State:** Outline items get a subtle background and border when active.
- **Layout:** Adjusted content top margin to 86px (50px header + 36px breadcrumb).

#### 3. Why This Matters
- **Navigation:** Users can now jump to "1. Current Understanding" via outline (broken before).
- **Context:** Breadcrumb provides constant "Where am I?" context in 9,000+ line documents.
- **Completeness:** Fulfills the "Ubiquitous Access" vision from LOG-047.

#### 4. Next Steps
- Publish v0.2.0 to npm.
- Resume Vertex AI integration (TASK-EVAL-002d).

### [LOG-059] - [DECISION] - Static Worklog Distribution ("The Hotel Model") - Task: READER-005

**Summary:** We implemented a "dump & read" distribution model (`npx ... dump --remote`) allowing engineers to push `WORK.md` to a centralized, auth-protected static server (`gsd.kenluu.org`) for offline mobile reading.

**Key Insight:** SSH tunnels are great for laptops, but useless for mobile. To read logs on the bus, we need a static drop box. We call this "The Hotel Model" — a single server hosting multiple projects in isolated rooms.

#### 1. The Context (Why This Matters)

**The Problem:**
- **Mobile Gap:** Reading `WORK.md` on a phone required keeping a laptop open with an SSH tunnel.
- **Vite limitation:** Live reload requires a WebSocket connection to localhost, which doesn't exist on static hosting.
- **Escaping hell:** Naively injecting markdown into HTML via `JSON.stringify` breaks when the markdown contains `</script>` tags or weird characters.

**The Vision:**
> "I want to close my laptop, walk away, and read the logs on my phone."

#### 2. The Solution: "The Hotel Model" Architecture

We deployed a lightweight Go server behind Traefik Basic Auth to serve static files and handle uploads.

```mermaid
graph TD
    subgraph "Local Machine (CLI)"
        CLI["npx @luutuankiet/gsd-reader dump"]
        Build["Vite Build dist/"]
        Inject["Inject Base64 WORK.md"]
        Tar["Create .tar.gz"]
    end

    subgraph "Remote Server (Hetzner)"
        Traefik["Traefik Proxy (Basic Auth)"]
        GoServer["Go Binary :8080"]
        FS["Persistent Volume /data"]
    end

    CLI -->|POST /upload/project-name| Traefik
    Traefik -->|Forward| GoServer
    GoServer -->|Extract| FS
    
    subgraph "Mobile Client"
        Phone["Browser"]
    end
    
    Phone -->|GET /project-name/| Traefik
    Traefik -->|Serve Static| GoServer
    GoServer -->|Read| FS
```

#### 3. Implementation Details

##### 3.1 The Backend (Go Server)
We chose Go for a single-binary deployment (~15MB image) with zero runtime dependencies. It handles:
1.  **Project Picker:** Auto-generates `index.html` listing all uploaded projects.
2.  **Static Serving:** Serves the extracted HTML/JS assets.
3.  **Upload Handler:** Receives `tar.gz` via POST, extracts to `./data/{project}/`.

**Source:** `remote_hetzner/gsd-reader/main.go`

##### 3.2 The Frontend (Base64 Injection)
**The Bug:** Initially, we used `JSON.stringify(markdown)` to inject content into `<script>`. This failed when markdown contained `</script>` tags or unescaped line breaks, causing `Uncaught SyntaxError`.

**The Fix:** We switched to **Base64 encoding**. This ensures the payload is always safe, regardless of content.

**CLI Injection (`plugins/reader-vite/cli.cjs`):**
```javascript
// Bulletproof injection: Base64 encodes EVERYTHING safely
const base64Content = Buffer.from(worklogContent, 'utf-8').toString('base64');
const injectScript = `<script>window.__WORKLOG_CONTENT_B64__ = "${base64Content}";</script>`;
indexHtml = indexHtml.replace('</head>', `${injectScript}\n</head>`);
```

**Frontend Decoding (`plugins/reader-vite/src/main.ts`):**
```typescript
if ((window as any).__WORKLOG_CONTENT_B64__) {
  // Static mode: Decode safe Base64 content
  markdown = atob((window as any).__WORKLOG_CONTENT_B64__);
  // Disable WebSocket connection (no live reload)
} else {
  // Dev mode: Fetch from server + connect WebSocket
  connectWebSocket();
}
```

##### 3.3 The CLI Command (`dump`)
We added a `dump` command to the CLI that automates the build-and-push workflow.

```bash
# Usage
npx @luutuankiet/gsd-reader dump --remote=https://gsd.kenluu.org --user=ken
```

**Logic:**
1.  Builds the Vite app to `dist/`.
2.  Injects `WORK.md` as Base64 into `index.html`.
3.  Fixes asset paths (absolute `/assets/` -> relative `./assets/`) for subdirectory hosting.
4.  Tars the `dist/` folder.
5.  Uploads via HTTP POST with Basic Auth header.

#### 4. Outcome
- **Live at:** `https://gsd.kenluu.org/`
- **Auth:** Protected by existing Traefik middleware (`ken:$apr1$...`).
- **Offline Capable:** The resulting HTML is self-contained (except for lazy-loaded Mermaid chunks, which are cached).
- **Mobile Ready:** "Close laptop, read on phone" workflow achieved.

### [LOG-060] - [FIX] - Reader 0.2.6: Parsing Robustness & Static Dump Encoding - Task: READER-006

**Summary:** Debugged and fixed critical issues in the reader plugin causing logs to display incorrectly (nested under sections) and UTF-8 characters to render corrupted in static dumps.

**Key Fixes:**

1.  **Parsing Robustness (Regex Update):**
    -   **Problem:** Log titles like `[PLAN-PIVOT]` or `[DISCOVERY & REFINEMENT]` failed to match the strict regex `[A-Z_]+`, causing them to fall through as generic section headers. This resulted in logs appearing as children of the previous H2 section (e.g., "Atomic Session Log") instead of top-level logs.
    -   **Fix:** Updated `LOG_HEADER_PATTERN` in `parser.ts` to allow special characters (`-`, `&`, space) in the TYPE field: `\[([^\]]+)\]`.

2.  **Static Dump Encoding (UTF-8 Corruption):**
    -   **Problem:** The static dump injects Base64 content. The frontend used `atob()` to decode it, which interprets bytes as Latin-1 string. Multi-byte UTF-8 characters (like em-dash `—`) were corrupted into `â€"`.
    -   **Fix:** Switched to proper UTF-8 decoding using `TextDecoder` + `Uint8Array` in `main.ts`.

3.  **CLI Debugging:**
    -   **Enhancement:** Added version printout (`[GSD-Lite Reader] v0.2.6`) on startup to `cli.cjs` to help identify the running version.

4.  **Content Fixes (Dogfooding):**
    -   **Code Fence:** Fixed a malformed code fence in `WORK.md` (line ~462) where `),`\`\`\` was on the same line, breaking the parser.
    -   **Mermaid:** Fixed a broken Mermaid diagram (line ~1450) by quoting labels with parentheses/HTML.

**Outcome:**
-   **Version:** Bumped `@luutuankiet/gsd-reader` to `0.2.6`.
-   **Stability:** Logs render correctly regardless of TYPE characters.
-   **Encoding:** Static dumps now support full Unicode (emojis, em-dashes).

---

### [LOG-061] - [DESIGN] - Mobile UX Overhaul: Bottom Sheet Outline with Snap Points - Task: READER-007

**Summary:** Design decision for overhauling the GSD-Lite Reader's mobile navigation experience. The current left-drawer overlay fails mobile use cases: tiny resize handles, truncated outline text, and toggle button placement far from thumb zone. This log captures the problem analysis, pattern exploration, and chosen solution: a **bottom sheet with snap points** (Pattern D).

**Dependencies:**
- [LOG-047] — Original Reader vision and purpose (ARCHITECTURE.md §Plugins)
- [LOG-056] — Reader distribution architecture (cli.cjs, chokidar, WebSocket)
- [LOG-060] — Latest reader fixes (v0.2.6 baseline)

---

#### 1. Problem Statement: Mobile Outline is Unusable

The user reported four critical UX failures when using the reader on mobile:

| Issue | Current Behavior | Impact |
|-------|------------------|--------|
| **Resize handle** | Browser-native `resize: horizontal` creates ~4px drag target | 99% misclick rate; even when grabbed, `max-width: 80vw` caps expansion |
| **Text truncation** | `white-space: nowrap` + `text-overflow: ellipsis` on `.outline-item` | Can't scan full log titles even with horizontal scroll |
| **Outline as overlay** | Opens via top-left 📋 button, overlays content | Fighting two views; can't "scan outline alone" |
| **Toggle placement** | Top-left corner | Far from natural thumb zone (bottom half of screen) |

**Root Cause Analysis:**

The CSS in `plugins/reader-vite/index.html` (lines 108-180) treats mobile outline as an afterthought:

```css
/* Line 108-115: Mobile outline hidden by default */
.outline {
  position: fixed;
  top: 86px;
  left: 0;
  width: 300px;
  max-width: 80vw;           /* ← Hard cap prevents full-width expansion */
  transform: translateX(-100%); /* ← Hidden off-screen */
  resize: horizontal;        /* ← Tiny browser-native handle */
}

/* Line 160-162: Text truncation */
.outline-item {
  white-space: nowrap;       /* ← Forces single line, triggers ellipsis */
}
```

**User's Core Need (verbatim):**

> "I want to be able to scan only the outline with full text and understand semantically where the document flow is going. At any given point I can answer: What header section am I on? What work log is this in the grand scheme of the project?"

This is a **navigation-first** mental model. The outline should be a first-class citizen on mobile, not a hidden sidebar.

---

#### 2. Pattern Exploration: Four Mobile Navigation Models

We evaluated four established mobile patterns:

```mermaid
graph TB
    subgraph "Pattern A: Table of Contents Mode"
        A1[Full-screen outline]
        A2[Tap to jump]
        A3[Completely separate from reader]
    end
    
    subgraph "Pattern B: Split View"
        B1[Outline 30% left]
        B2[Content 70% right]
        B3["❌ Rejected: width constraint"]
    end
    
    subgraph "Pattern C: Left Drawer"
        C1[Swipe from left edge]
        C2[~85% width overlay]
        C3[Dimmed content behind]
    end
    
    subgraph "Pattern D: Bottom Sheet"
        D1[Swipe up from bottom]
        D2[Snap points: 50% → 80%]
        D3[Collapsed bar always visible]
        D4["✅ CHOSEN"]
    end
```

**Pattern Comparison:**

| Aspect | C: Left Drawer | D: Bottom Sheet |
|--------|----------------|-----------------|
| Trigger location | Left edge swipe | Bottom edge swipe |
| Thumb reach | Good (left side) | Excellent (natural thumb rest) |
| Always-visible hint | No | Yes (collapsed bar with progress) |
| Width for text | ~85% screen | 100% screen |
| Mental model | "Sidebar I pull out" | "Panel I pull up" |
| Common in | Slack, Gmail | Google Maps, Apple Music, iOS Share Sheet |

**Decision: Pattern D (Bottom Sheet)**

Rationale:
1. **Full width** — 100% screen width means text wraps naturally, no truncation
2. **Thumb zone** — Bottom of screen is natural one-handed grip position
3. **Progress visibility** — Collapsed bar can show current position even while reading
4. **Familiar pattern** — Users know this from Maps, Music, Share Sheet

---

#### 3. Detailed Design Specification

##### 3.1 Visual States

**State 1: Collapsed (Reading Mode)**

```mermaid
graph TB
    subgraph "Mobile Screen - Collapsed State"
        direction TB
        TopBar["📋 GSD-Lite Worklog ⬇ Latest"]
        Breadcrumb["LOG-045: Migrate eval_ingest..."]
        Content["Log content area<br/>(full height minus bars)"]
        CollapsedBar["═══ 📋 Outline ═══"]
    end
    
    TopBar --> Breadcrumb
    Breadcrumb --> Content
    Content --> CollapsedBar
```

- **Collapsed bar:** Hidden by default (user chose option C: swipe-only)
- **Trigger:** Swipe up from bottom edge of screen
- **No screen real estate consumed** when reading

**State 2: Half-Expanded (50% snap point)**

```mermaid
graph TB
    subgraph "Mobile Screen - 50% Expanded"
        direction TB
        TopBar2["📋 GSD-Lite Worklog ⬇ Latest"]
        DimmedContent["░░░ Dimmed content (~50%) ░░░"]
        DragHandle["═══════════"]
        SheetHeader["📋 Outline ▼"]
        OutlineContent["▼ Sections<br/>  1. Current Understanding<br/>  2. Key Events Index<br/>▼ Logs (60)<br/>  ● LOG-060 [FIX] Fixed nested...<br/>  LOG-059 [DECISION] Static..."]
    end
    
    TopBar2 --> DimmedContent
    DimmedContent --> DragHandle
    DragHandle --> SheetHeader
    SheetHeader --> OutlineContent
```

**State 3: Full-Expanded (80% snap point)**

- Same structure but sheet takes ~80% of screen height
- Only top bar + sliver of dimmed content visible above
- Maximum space for scanning outline

##### 3.2 Interaction Model

| Gesture | From State | To State |
|---------|------------|----------|
| Swipe up from bottom edge | Collapsed | 50% expanded |
| Continue drag up | 50% expanded | 80% expanded |
| Drag down (small) | 80% expanded | 50% expanded |
| Drag down (large) / tap dimmed area | Any expanded | Collapsed |
| Tap outline item | Any expanded | Collapsed + scroll to target |

##### 3.3 Current Position Highlighting

User chose highlighting over progress counters. The outline must show:

1. **Current log** — highlighted with accent background + left border (existing `.outline-link.active` style)
2. **Current child header** — if user is scrolled to a `### Subsection` within a log, that header should also highlight in outline
3. **Parent expansion** — ancestors of current item auto-expand so active item is always visible

This builds on existing scroll sync code in `renderer.ts` (lines 480-540) which already tracks `currentSectionId` and applies `.active` class.

##### 3.4 Implementation Architecture

**Key Insight: Shared Content, Separate Shells**

```mermaid
graph LR
    subgraph "Shared (Single Implementation)"
        RO["renderOutline()<br/>renderer.ts"]
        OC["Outline Content<br/>&lt;ul class='outline-list'&gt;"]
    end
    
    subgraph "Desktop Shell (≥768px)"
        DS["&lt;aside class='outline-sidebar'&gt;"]
        DS --> OC
    end
    
    subgraph "Mobile Shell (&lt;768px)"
        MS["&lt;div class='outline-sheet'&gt;"]
        DH["Drag Handle"]
        MS --> DH
        MS --> OC
    end
    
    RO --> OC
    
    subgraph "CSS Media Query Switch"
        MQ["@media (min-width: 768px)<br/>.outline-sheet { display: none }<br/>.outline-sidebar { display: block }"]
    end
```

This means:
- `renderOutline()` generates the `<ul>` structure **once**
- Desktop wraps it in `.outline-sidebar` (left-fixed, resizable)
- Mobile wraps it in `.outline-sheet` (bottom sheet with drag handle)
- Media queries toggle visibility
- Both call the same `highlightCurrent()` / `scrollToLog()` functions

##### 3.5 Repurposing the 📋 Button

With bottom sheet handling mobile outline, the top-left 📋 button becomes available:

| Platform | New Behavior |
|----------|--------------|
| Desktop | **Keep as-is** — toggles sidebar visibility |
| Mobile | **Repurpose to font size control** — addresses user's request for adjustable text size |

Font size control options:
- Cycle through presets: Small (12px) → Medium (14px) → Large (16px)
- Or: Open a small popover with +/- buttons

---

#### 4. Implementation Tasks

| Task ID | Description | File(s) | Complexity |
|---------|-------------|---------|------------|
| READER-007a | Add bottom sheet HTML structure with drag handle | `renderer.ts` | Medium |
| READER-007b | CSS for sheet states (collapsed, 50%, 80%) + snap points | `index.html` | Medium |
| READER-007c | Touch gesture handling (swipe up, drag, snap) | `renderer.ts` or new `sheet.ts` | High |
| READER-007d | Remove `nowrap` / `ellipsis` for mobile outline items | `index.html` | Low |
| READER-007e | Enhance scroll sync to highlight child headers | `renderer.ts` | Medium |
| READER-007f | Repurpose 📋 button for font size on mobile | `renderer.ts`, `index.html` | Low |
| READER-007g | Media query switching between sidebar/sheet | `index.html` | Low |

**Estimated total:** 4-6 hours of focused implementation

---

#### 5. Source Citations

| Artifact | Location | Relevance |
|----------|----------|-----------|
| Current outline CSS | `plugins/reader-vite/index.html` L108-180 | Baseline to modify |
| Outline rendering | `plugins/reader-vite/src/renderer.ts` L25-110 | `renderOutline()`, `renderOutlineItem()` |
| Scroll sync logic | `plugins/reader-vite/src/renderer.ts` L480-540 | `updateCurrentSection()`, `.active` class |
| Touch interactions | `plugins/reader-vite/src/renderer.ts` L415-450 | Existing scroll thumb drag handling |
| Mobile breakpoint | `plugins/reader-vite/index.html` L490 | `@media (min-width: 768px)` |
| Reader architecture | `gsd-lite/ARCHITECTURE.md` §Plugins | Overall reader design |

---

#### 6. Open Questions (LOOP)

- **LOOP-010:** Should the collapsed bar be fully hidden (current decision) or show a subtle 4px "peek" indicator at bottom edge to hint at swipe-up affordance?
- **LOOP-011:** For font size control, should it persist across sessions (localStorage) or reset on reload?

---

**Next Action:** Begin implementation with READER-007b (CSS structure) as it defines the visual foundation for all other tasks.

### [LOG-062] - [EXEC] - Implemented Mobile Bottom Sheet and Gesture Handling - Task: READER-007

**Summary:** Successfully implemented the mobile bottom sheet (Pattern D) with drag gestures, snap points, and full-text rendering. Also fixed a critical "scroll bounce" bug where the first navigation action reset scroll position to top. The reader now provides a native-like navigation experience on mobile devices.

**Files Changed:**
- `plugins/reader-vite/index.html`: Added `.outline-sheet` CSS, snap states, and media queries to switch between sidebar/sheet.
- `plugins/reader-vite/src/renderer.ts`: Added `renderBottomSheet()` and gesture handlers (touch start/move/end).
- `plugins/reader-vite/src/main.ts`: Fixed scroll restoration logic.

---

#### 1. Implementation Details

**A. CSS for Bottom Sheet (`index.html`)**
Implemented the 3-state system (`collapsed`, `half`, `full`) using CSS transforms for 60fps performance:

```css
/* Mobile Bottom Sheet */
.outline-sheet {
  position: fixed;
  bottom: 0;
  /* ...rounded corners, shadow... */
  transform: translateY(100%); /* Collapsed */
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.outline-sheet.snap-half { transform: translateY(50%); }
.outline-sheet.snap-full { transform: translateY(15%); }
```

**B. Gesture Handling (`renderer.ts`)**
Implemented physics-like drag behavior:
1. **Touch Start:** Capture Y position, disable transition (for 1:1 finger tracking)
2. **Touch Move:** Update `translateY` in real-time based on delta
3. **Touch End:** Calculate delta, determine nearest snap point, re-enable transition, snap to state

**C. Truncation Fix (READER-007d)**
Modified `renderOutlineItem` to remove JS-based truncation (`truncate(str, 50)`).
- **Desktop:** Uses CSS `text-overflow: ellipsis` (sidebar constrained width)
- **Mobile:** Uses CSS `white-space: normal` (sheet full width)
Result: Mobile users see full titles; desktop users see clean truncated lists.

---

#### 2. The "Scroll Bounce" Bug Fix

**Symptom:** On mobile, clicking an outline item for the first time scrolled to the target, but then immediately snapped back to top (0). Subsequent clicks worked fine.

**Root Cause:**
`main.ts` had a `requestAnimationFrame` block that restored scroll position to `savedScrollY` (initially 0) after async rendering.
1. Page loads (`savedScrollY = 0`)
2. User clicks outline link → browser scrolls to anchor
3. Async initialization (Mermaid diagrams) finishes
4. Code executes `window.scrollTo(0, 0)` → Reset!

**Fix:**
Only restore scroll if `savedScrollY > 0` (i.e., it's a reload, not a fresh visit).

```typescript
// Only restore if savedScrollY > 0 (i.e., this is a reload, not initial load)
if (savedScrollY > 0) {
  requestAnimationFrame(() => {
    window.scrollTo(0, savedScrollY);
  });
}
```

---

#### 3. UX Polish

- **Unified Toggle Button:** The 📋 button now adapts context:
  - **Desktop:** Toggles left sidebar
  - **Mobile:** Toggles bottom sheet (half/collapsed)
- **Overlay Interaction:** Tapping the dimmed background closes the sheet
- **Auto-Close:** Clicking a link in the sheet automatically closes it (standard mobile pattern)

---

**Next Action:** Proceed with READER-007e (Enhanced scroll sync for child headers) to ensure the outline highlighting tracks subsection headers accurately.

### [LOG-063] - [EXEC] - Outline Auto-Scroll on Open: READER-007e Enhanced Scroll Sync - Task: READER-007

**Summary:** Implemented auto-scroll behavior so that when the outline (sidebar or bottom sheet) opens, it automatically scrolls to show the currently highlighted section. Previously, the outline always started from the top, requiring users to manually scroll to find their position.

**Files Changed:**
- `plugins/reader-vite/src/renderer.ts`: Added `scrollOutlineToActive()` function and integrated it into toggle/sheet open handlers.

---

#### The Problem

When reading a long worklog and opening the outline to navigate:
1. User is viewing LOG-050 in the main content
2. Outline correctly highlights LOG-050 as `.active`
3. BUT: Outline scroll position is at the top (showing LOG-001)
4. User must manually scroll down 50+ items to see where they are

This broke the mental model of "outline shows me where I am."

#### The Solution

Created a reusable `scrollOutlineToActive()` function that:
1. Finds the currently active outline link (`.outline-link.active`)
2. Expands parent items if collapsed (so the active item is visible in the tree)
3. Scrolls the active item to center using `scrollIntoView({ behavior: 'instant', block: 'center' })`

**Why `instant` not `smooth`?** When opening the outline, users want immediate orientation. Smooth scrolling delays the "aha, I'm here" moment. The existing scroll-on-scroll behavior (during main content scrolling) still uses `smooth` for non-jarring updates.

#### Integration Points

**Desktop (sidebar toggle):**
```typescript
function toggleOutline(): void {
  const wasHidden = outline!.classList.contains('hidden');
  outline!.classList.toggle('hidden');
  // ...
  if (wasHidden) {
    requestAnimationFrame(() => scrollOutlineToActive());
  }
}
```

**Mobile (bottom sheet open):**
```typescript
function setSheetState(state: SheetState): void {
  const wasCollapsed = currentSheetState === 'collapsed';
  // ...
  if (wasCollapsed && state !== 'collapsed') {
    requestAnimationFrame(() => scrollOutlineToActive());
  }
}
```

#### Bonus Fix: Dual Outline Sync

Discovered that the existing scroll sync only marked `.active` on the first matching link (sidebar), not the sheet. Fixed `updateCurrentSection()` to use `querySelectorAll` and mark active state in BOTH outlines:

```typescript
// Before: Only marked one
const outlineLink = document.querySelector(`.outline-link[href="#${sectionId}"]`);

// After: Marks both sidebar and sheet
const outlineLinks = document.querySelectorAll(`.outline-link[href="#${sectionId}"]`);
outlineLinks.forEach(link => link.classList.add('active'));
```

---

**Status:** READER-007e complete. Outline now auto-scrolls to active section on open.

### [LOG-064] - [FIX] - Sub-Header Navigation & Mobile Sheet Polish - Task: READER-007e

**Summary:** Fixed critical navigation bugs where clicking outline sub-headers (H4/H5) wouldn't scroll to the correct location due to line number mismatches. Also polished the mobile sheet experience by removing sticky headers (which overlapped content) and preventing auto-collapse on navigation.

**Files Changed:**
- `plugins/reader-vite/src/parser.ts`: Replaced `.trim()` with `.trimEnd()` to preserve leading empty lines in log content.
- `plugins/reader-vite/src/renderer.ts`: Updated scroll sync logic, breadcrumb behavior, and sheet interaction.
- `plugins/reader-vite/index.html`: Removed sticky positioning for sheet section titles.

---

#### 1. The "Frozen Click" Bug (Line Number Mismatch)

**Symptom:** Clicking sub-headers (e.g., in LOG-043) updated the URL anchor but didn't scroll the page. Console showed no errors, just UI freeze.

**Root Cause:**
- The parser used `.trim()` on log content, removing leading empty lines.
- `renderMarkdown` calculates line IDs based on content index + startLine.
- If a log had leading empty lines (common after metadata block), the rendered HTML IDs (e.g., `id="line-7550"`) were offset from the parser's recorded line numbers (e.g., `href="#line-7551"`).
- Result: Anchor link pointed to non-existent ID.

**Fix:** Changed all content capture in `parser.ts` to use `.trimEnd()` instead of `.trim()`. This preserves leading newlines, keeping the rendered line IDs in sync with the parser's absolute file line numbers.

#### 2. Breadcrumb & Outline Sync Logic

**Problem:** Scrolling to a sub-header changed the sticky breadcrumb to show the sub-header title (losing context of which LOG you're in).
**Fix:** Updated `updateCurrentSection` in `renderer.ts`:
- **Breadcrumb:** Always shows the **parent LOG entry** title, even when reading a sub-section.
- **Outline Highlighting:** Still highlights the specific sub-header if it exists in the outline; otherwise falls back to parent log.

#### 3. Mobile Sheet UX Polish

- **Scroll Position:** Changed `scrollIntoView` block from `center` to `start` for mobile. Center positioning on a half-height sheet meant the active item was often hidden below the fold.
- **Sticky Header Removal:** Removed `position: sticky` from "LOGS (N)" header in the sheet. It was overlapping the top-most item, making it unreadable.
- **Keep Open:** Removed auto-collapse listener on link click. Users can now click a link to navigate but keep the sheet open to jump to another section immediately.

---

**Status:** Navigation is now robust for both top-level logs and deep links to sub-sections. Line numbers are consistent between parser and renderer.

---

### [LOG-065] - [EXEC] - Mobile UX Polish: Peek Handle & Version Bump - Task: READER-007

**Summary:** Completed the mobile UX overhaul by implementing a "Peek Handle" for bottom-edge swipe detection and repurposing the top-left button for font size control. This resolves the final usability gaps in the bottom sheet implementation.

**Files Changed:**
- `plugins/reader-vite/index.html`: Added `.sheet-peek-handle` CSS.
- `plugins/reader-vite/src/renderer.ts`: Added peek handle HTML and touch event listeners.
- `plugins/reader-vite/package.json`: Bumped version to `0.2.7`.

---

#### 1. The Missing Swipe Trigger (Loop Closure)

**Problem (from LOG-062):**
The bottom sheet implementation relied on a drag handle that was completely off-screen (`translateY(100%)`) when collapsed. Users could only open the sheet via the top-left toggle button, defeating the purpose of bottom-thumb accessibility.

**Solution: The "Peek Handle"**
Implemented a 20px tall, fixed-position touch zone at the bottom edge of the screen.
- **Visual:** Dark gradient with a subtle 40px "pill" bar to hint at interactivity.
- **Behavior:**
  - **Swipe Up:** Drag triggers the sheet opening animation (physics-based).
  - **Tap:** Simply clicking the handle pops the sheet to 50% height.
  - **Auto-Hide:** When the sheet is open, the peek handle fades out (`.hidden` class) to avoid visual clutter.
  - **Platform-Specific:** Hidden on desktop via media queries (`display: none` for ≥768px).

#### 2. Font Size Control (Repurposed Button)

**Problem:**
The top-left 📋 button was redundant on mobile (since the peek handle now opens the sheet).

**Solution:**
Repurposed the button on mobile to cycle through font sizes:
- **Default:** 16px (standard reading)
- **Large:** 18px (easier on eyes)
- **Small:** 14px (more context)
- **Mechanism:** Toggles `body` classes (`font-size-large`, `font-size-small`) which override CSS variables.

#### 3. Version Bump

Bumped `@luutuankiet/gsd-reader` to `0.2.7` to mark the release of the Mobile UX Overhaul.

**Verification:**
- **Mobile:** Swipe from bottom edge → Sheet follows finger. Release → Snaps to 50% or 80%.
- **Desktop:** Peek handle invisible. Sidebar works as before.
- **Cross-Platform:** Shared outline content remains in sync.

---

**Status:** READER-007 is now **COMPLETE**. The mobile reading experience is fully native-like with bottom navigation, snap points, and adjustable typography.

### [LOG-066] - [EXEC] - Reader UX: Visual Hierarchy for Deeply Nested Sub-Headers - Task: READER-008

**Summary:** Addressed "infinite scroll blindness" where H4-H6 headers inside log entries looked like body text. Implemented a "Colored Top Bar + Level Tag" design (Approach B/E hybrid) to create distinct visual boundaries without sacrificing mobile screen real estate.

**Files Changed:**
- `plugins/reader-vite/src/renderer.ts`: Updated regex to support H6 and inject HTML for level tags.
- `plugins/reader-vite/index.html`: Added CSS for colored top bars and level pills.

---

#### 1. The Problem: "Is this a header or a footnote?"

**Context:**
GSD-Lite logs start at H3 (`### [LOG-NNN]`). This means structural headers *inside* a log entry must be H4, H5, or H6.
- **H5 (13px, gray):** Looked indistinguishable from body text.
- **H6 (12px, light gray):** Looked like a citation/footnote.
- **Mobile Impact:** On a phone, scrolling through a 500-line log entry made it impossible to tell when a new section began.

**Requirement:**
Distinct visual hierarchy that works on mobile (no horizontal indentation waste) and clearly delineates content blocks.

#### 2. The Solution: Colored Top Bar + Level Tags

We adopted a hybrid of "Indent Rainbow" and "GitHub Labels":

**Design Pattern:**
1.  **Top Border:** A colored line spanning the full width. This acts as a hard visual stop—"Previous section ended here."
2.  **Level Tag:** A small, colored pill (`H4`, `H5`, `H6`) aligned to the left. This provides immediate context on depth.
3.  **No Indentation:** Text remains left-aligned, maximizing readable width on mobile.

**Visual Spec:**

| Level | Color | Visual Style |
| :--- | :--- | :--- |
| **H4** | Purple (`#7c3aed`) | Solid 3px Top Border + Filled Pill |
| **H5** | Teal (`#14b8a6`) | Solid 2px Top Border + Filled Pill |
| **H6** | Gold (`#f59e0b`) | Dashed 2px Top Border + Filled Pill |

**CSS Implementation:**
```css
/* H4 Example */
.log-content h4 {
  border-top: 3px solid #7c3aed;
  margin-top: 24px; /* Breathing room */
}
.header-level-tag.level-4 {
  background: #7c3aed;
  color: white;
  font-size: 9px;
  padding: 2px 6px;
}
```

#### 3. Technical Implementation

**Regex Update (`renderer.ts`):**
Previously, the parser only matched `#{1,5}` (H1-H5). Updated to `#{1,6}` to support H6.

```typescript
// Before
const headerMatch = line.match(/^(#{1,5}) (.+)$/);

// After
const headerMatch = line.match(/^(#{1,6}) (.+)$/);
// ...
const levelTag = level >= 4 ? `<span class="header-level-tag level-${level}">H${level}</span>` : '';
htmlLines.push(`<h${level} ${anchor}${sectionAttr}>${levelTag}${text}</h${level}>`);
```

**Outcome:**
Headers now pop visually. Scanning a long log entry is much faster because the colored bars act as "chapter markers," allowing the eye to skip sections easily. On mobile, the sticky header combined with these inline markers makes deep-diving into complex logs (like this one!) significantly less disorienting.

---

### [LOG-067] - [DECISION] - Manual Scenario-Based Evaluation: End-to-End Testing Architecture with Controlled Workspaces - Task: TASK-EVAL-002d

**Status:** APPROVED
**Date:** 2026-02-16
**Decision ID:** DECISION-067a, DECISION-067b, DECISION-067c
**Task:** TASK-EVAL-002d (Vertex AI L2 Integration)
**Dependencies:**
- LOG-028 (lines 4069-4375): CI Framework Design — Three-layer architecture (Structural → Constitutional → Behavioral)
- LOG-040 (lines 6303-6720): Time-Partitioned Evaluation — Isolating deliberate test sessions from organic work
- LOG-042 (lines 7021-7532): Constitutional Evaluation Architecture — Session-as-unit, hybrid orchestration
- LOG-043 (lines 7533-8064): Vertex AI Rubric-Based Evaluation — Hybrid L1+L2, Constitution as guidelines
- LOG-046 (lines 8409-8536): Vertex-Native Schema — Simplified pipeline with `eval_ingest.py` outputting directly to Vertex format

---

#### 1. Executive Summary

**The Problem:** We built the evaluation *consumer* (L1 checks + Vertex L2) but never designed how to *generate* test data. The current pipeline assumes organic work sessions exist, but for CI/regression testing, we need **reproducible scenarios** with known expected behaviors.

**The Decision:** Implement a **Manual Scenario-Based Evaluation** architecture where:
1. Scenarios are pre-defined (prompts + expected behaviors) — **evaluator-only** artifacts
2. A synthetic codebase serves as the test fixture — **immutable template**
3. Each eval run clones the template into an isolated workspace — **evaluatee workspace**
4. Human runs OpenCode against the workspace, following the scenario script
5. `eval_ingest.py` + `eval_consume.py` evaluate the captured session

**The One-Liner:** Test GSD-Lite end-to-end by running a human-operated agent against controlled scenarios in isolated workspaces, then evaluating the session against the Constitution.

**Why Manual?** We are testing the *end-to-end system* (OpenCode + GSD-Lite templates + LLM = correct behavior), not a mock. Automated harnesses would bypass the real agent flow and miss integration issues.

---

#### 2. The Problem: Missing Test Data Generation

##### 2.1 What We Built vs What We Need

| Component | Status | Purpose |
|-----------|--------|---------|
| `eval_ingest.py` | ✅ Built (LOG-045, LOG-046) | Extract sessions from OpenCode SQLite |
| `eval_consume.py l1` | ✅ Built (LOG-044) | Programmatic checks (grep-before-read, handoff presence) |
| `eval_consume.py l2` | ⏳ TASK-EVAL-002d | Vertex AI rubric-based evaluation |
| **Scenario Runner** | ❌ Missing | How to generate test data in the first place |

##### 2.2 The Two Evaluation Modes

```mermaid
flowchart LR
    subgraph ORGANIC["Mode A: Organic Eval"]
        O1[Past work sessions] --> O2[eval_ingest.py]
        O2 --> O3[eval_consume.py]
    end
    
    subgraph SCENARIO["Mode B: Scenario Eval (This Decision)"]
        S1[Scenario script] --> S2[Human runs OpenCode]
        S2 --> S3[Session captured]
        S3 --> S4[eval_ingest.py]
        S4 --> S5[eval_consume.py]
    end
    
    ORGANIC -.->|"Ad-hoc debugging"| USE[Use Case]
    SCENARIO -.->|"CI, regression testing"| USE
```

**Citation:** User requirement from discuss session (2026-02-16):
> "i'm envisioning we have like a fixed scenario what the user going to ask, then we spin up the agent and ask just those questions, then use the collect tool to get the answer for that scenario and get ready to send."

---

#### 3. The Architecture: Evaluator vs Evaluatee Separation

##### 3.1 Core Design Principle

The agent under test **never sees** the evaluation criteria or expected behaviors. It just sees a normal project workspace.

| Layer | Who Sees It | Contents | Mutability |
|-------|-------------|----------|------------|
| **Evaluator-only** | Human (us) | Scenario scripts, expected behaviors, pillar mappings | Immutable reference |
| **Evaluatee workspace** | GSD-Lite agent | Cloned src code, gsd-lite/ artifacts | Agent can freely modify |

**Why this matters:** If the agent could see `scenario.md` with "expected: agent asks why before executing," it might game the test. Separation ensures authentic behavior.

##### 3.2 Directory Structure

**DECISION-067a:** Adopt the following directory structure for evaluation fixtures:

```
tests/
└── evals/
    ├── templates/                      # IMMUTABLE — clone source
    │   ├── src/                        # Synthetic API client app
    │   │   ├── main.py                 # CLI entry point
    │   │   ├── client.py               # API client (fetches live data)
    │   │   ├── cache.py                # Simple file-based cache
    │   │   └── config.py               # Settings
    │   ├── tests/
    │   │   └── test_client.py          # Unit tests
    │   ├── pyproject.toml
    │   └── README.md
    │
    ├── scenarios/                      # EVALUATOR-ONLY — prompt scripts
    │   ├── s1-handoff/
    │   │   ├── scenario.md             # Prompts + expected behaviors
    │   │   └── gsd-lite/               # Pre-configured artifacts
    │   │       ├── PROJECT.md          # Synthetic project description
    │   │       ├── ARCHITECTURE.md     # Synthetic architecture map
    │   │       └── WORK.md             # current_mode: execution (mid-task)
    │   │
    │   ├── p2-pair-programming/
    │   │   ├── scenario.md
    │   │   └── gsd-lite/
    │   │       └── WORK.md             # current_mode: discuss
    │   │
    │   ├── c3-onboarding/
    │   │   ├── scenario.md
    │   │   └── gsd-lite/
    │   │       └── WORK.md             # current_mode: none (fresh start)
    │   │
    │   └── j4-journalism/
    │       ├── scenario.md
    │       └── gsd-lite/
    │           └── WORK.md             # Has pending decision to log
    │
    └── workspaces/                     # EVALUATEE — agent works here
        └── .gitkeep                    # Empty until clone script runs
```

**Rationale:**
- `templates/` is **never touched** by the agent — serves as golden source for cloning
- `scenarios/` contains **evaluator-private** artifacts (prompts, expected behaviors)
- `workspaces/` contains **per-run clones** that the agent freely modifies
- Each scenario has its own `gsd-lite/` with pre-configured `WORK.md` state for that test case

##### 3.3 The Clone Workflow

**One clone per run** (not per scenario). This preserves history and allows comparing runs:

```bash
#!/bin/bash
# clone_workspace.sh <scenario> [run_name]
SCENARIO=$1
RUN_NAME=${2:-$(date +%Y-%m-%d_%H%M)}
WORKSPACE="tests/evals/workspaces/${RUN_NAME}_${SCENARIO}"

# Clone template source code
mkdir -p "${WORKSPACE}"
cp -r tests/evals/templates/* "${WORKSPACE}/"

# Clone scenario-specific gsd-lite artifacts
cp -r "tests/evals/scenarios/${SCENARIO}/gsd-lite" "${WORKSPACE}/"

echo "Workspace ready: ${WORKSPACE}"
echo "Connect fs-mcp to this path and run OpenCode"
```

**Example:**
```bash
$ ./clone_workspace.sh c3-onboarding
Workspace ready: tests/evals/workspaces/2026-02-16_1400_c3-onboarding

$ ./clone_workspace.sh c3-onboarding  # Run same scenario again
Workspace ready: tests/evals/workspaces/2026-02-16_1430_c3-onboarding
```

---

#### 4. Scenario Design: One Per Pillar

**DECISION-067b:** Start with 4 scenarios (one per Constitution pillar) to validate the evaluation flow before scaling up.

##### 4.1 Scenario Mapping

| Scenario | Pillar | Behavior Tested | WORK.md Initial State |
|----------|--------|-----------------|----------------------|
| `s1-handoff` | S1: Stateless-First | Agent produces STATELESS HANDOFF at session end | `current_mode: execution`, active task present |
| `p2-pair-programming` | P2: Pair Programming | Agent asks "why" before executing | `current_mode: discuss` |
| `c3-onboarding` | C3: Context Engineering | Agent runs Universal Onboarding sequence | `current_mode: none` (fresh start) |
| `j4-journalism` | J4: Journalism Quality | Agent produces rich, journalism-style log entry | `current_mode: execution`, decision pending |

##### 4.2 Scenario Script Format

Each `scenario.md` contains:

```markdown
# Scenario: [Name]

## Pillar Tested
[S1 | P2 | C3 | J4] — [Full pillar name]

## Behaviors Evaluated
- [Behavior ID]: [Description]

## Setup
- WORK.md state: [current_mode value]
- [Any other pre-conditions]

## Prompts (in order)
1. "[Exact prompt to send]"
2. "[Follow-up if needed]"

## Expected Behaviors (for human reference only — agent never sees this)
- [ ] [Observable behavior 1]
- [ ] [Observable behavior 2]

## Eval Criteria
- L1 (programmatic): [What eval_consume.py l1 checks]
- L2 (Vertex rubric): [What Constitution guideline applies]
```

##### 4.3 P2 Prompt: Avoiding Data Leakage

**Problem:** The "add dark mode" example is in `discuss.md` workflow. Using it would leak test data.

**DECISION-067c:** Use prompts that trigger "why before how" behavior without appearing in GSD-Lite training artifacts:

| Candidate Prompt | Why It Works |
|------------------|--------------|
| "The API is timing out sometimes" | Vague — needs clarification (which endpoint? what's acceptable latency? retry vs circuit breaker?) |
| "Users are complaining it's slow" | Vague — what's slow? the API? the cache? the CLI startup? |
| "I want to add error notifications" | Vague — to whom? how? what errors? |
| "Make it work offline" | Vague — cache everything? which endpoints? how stale is acceptable? |

**Selected for v1:** "The API is timing out sometimes" — natural for an API client app, clearly requires clarification.

---

#### 5. Synthetic Codebase Specification

##### 5.1 Requirements

The synthetic codebase must:
1. **Be realistic** — Structure matches real projects so agent behaviors are authentic
2. **Be simple** — ~50-100 lines total, no external dependencies beyond stdlib
3. **Support live data** — Headroom for future extension (more complex scenarios)
4. **Exercise pair programming** — Clear "where would I add X" opportunities

##### 5.2 Selected Design: API Client App

**Rationale:** An API client that fetches live data (weather, crypto, news) provides:
- Natural extension points ("add caching", "add retry", "support another API")
- Grep-able structure (clear modules, not too many files)
- Realistic pair programming scenarios

**Structure:**
```
src/
├── main.py         # CLI entry point (argparse/typer)
├── client.py       # API client (requests to public API)
├── cache.py        # Simple file-based cache
└── config.py       # Settings (API URL, cache TTL)
tests/
└── test_client.py  # Unit tests
pyproject.toml
README.md
```

##### 5.3 Gemini Handoff Brief

The following brief can be handed to Gemini for code generation:

```markdown
# Synthetic Codebase Generation Brief

## Purpose
Generate a minimal Python CLI project that serves as a test fixture for GSD-Lite evaluation. The agent under test will work on this codebase while being evaluated for GSD-Lite constitutional compliance.

## Files to Generate

### 1. src/main.py (~30 lines)
- CLI entry point using argparse (no external deps)
- Commands: `fetch` (get data from API), `cache-status` (show cache info)
- Imports from client.py and cache.py

### 2. src/client.py (~25 lines)  
- `fetch_data(endpoint: str) -> dict` — calls a public API
- Use `urllib.request` (stdlib) to avoid dependencies
- Suggested API: wttr.in (weather) or api.coindesk.com (bitcoin price)

### 3. src/cache.py (~20 lines)
- `get(key: str) -> Optional[dict]` — read from JSON file
- `set(key: str, value: dict, ttl: int)` — write with expiry
- Store in `.cache/` directory

### 4. src/config.py (~10 lines)
- `API_BASE_URL`, `CACHE_TTL`, `CACHE_DIR` constants

### 5. tests/test_client.py (~15 lines)
- One test for `fetch_data` (can mock the HTTP call)
- One test for cache read/write

### 6. pyproject.toml (~10 lines)
- Project name: `api-client-fixture`
- Python 3.9+, no dependencies

### 7. README.md (~20 lines)
- What this project does
- How to run: `python -m src.main fetch`

## Constraints
- Python 3.9+ stdlib only (no requests, no click, no external deps)
- Total ~100 lines of code
- Must be runnable: `python -m src.main fetch` should work

## Tone
Simple "weekend project" — not enterprise architecture. Clear enough that an AI agent can navigate and modify it.
```

##### 5.4 GSD-Lite Artifacts Brief

```markdown
# GSD-Lite Artifacts Generation Brief

## Purpose
Generate synthetic PROJECT.md, ARCHITECTURE.md, and WORK.md for the API client test fixture. These artifacts will be used by GSD-Lite agents during evaluation.

## Files to Generate

### 1. PROJECT.md (~30 lines)
- Project name: "API Client"
- Vision: Simple CLI to fetch data from public APIs with caching
- Success criteria: Fetch works, cache reduces API calls
- Constraints: Stdlib only, runs anywhere

### 2. ARCHITECTURE.md (~40 lines)
- Tech stack: Python 3.9+, stdlib only
- Directory structure: src/ (4 files), tests/ (1 file)
- Entry point: `python -m src.main`
- Data flow: main.py → client.py → cache.py

### 3. WORK.md Variants (one per scenario)

#### c3-onboarding/WORK.md (fresh start)
```
## 1. Current Understanding (Read First)
<current_mode>none</current_mode>
<active_task>None — fresh session</active_task>
<vision>Simple API client with caching</vision>
<decisions>None yet</decisions>
<blockers>None</blockers>
<next_action>Discuss what to build</next_action>
```

#### s1-handoff/WORK.md (mid-execution)
```
## 1. Current Understanding (Read First)
<current_mode>execution</current_mode>
<active_task>TASK-001: Add retry logic to client.py</active_task>
<vision>Simple API client with caching</vision>
<decisions>DECISION-001: Use exponential backoff</decisions>
<blockers>None</blockers>
<next_action>Implement retry in fetch_data()</next_action>
```

#### p2-pair-programming/WORK.md (discuss mode)
```
## 1. Current Understanding (Read First)
<current_mode>discuss</current_mode>
<active_task>None — exploring options</active_task>
<vision>Simple API client with caching</vision>
<decisions>None yet</decisions>
<blockers>None</blockers>
<next_action>Clarify user's goal</next_action>
```

#### j4-journalism/WORK.md (pending log)
```
## 1. Current Understanding (Read First)
<current_mode>execution</current_mode>
<active_task>TASK-002: Document caching decision</active_task>
<vision>Simple API client with caching</vision>
<decisions>DECISION-002: Use file-based cache (pending logging)</decisions>
<blockers>None</blockers>
<next_action>Log DECISION-002 with full context</next_action>
```

## Tone
Match GSD-Lite artifact style — concise, grep-optimized, XML tags for Current Understanding.
```

---

#### 6. Manual Evaluation Workflow

##### 6.1 Full Sequence Diagram

```mermaid
sequenceDiagram
    participant E as Evaluator (Human)
    participant W as Workspace
    participant O as OpenCode + GSD-Lite Agent
    participant F as fs-mcp
    participant I as eval_ingest.py
    participant C as eval_consume.py

    rect rgb(230, 245, 255)
        Note over E,W: Phase 1: Setup
        E->>W: Run clone_workspace.sh c3-onboarding
        W-->>E: Workspace ready at workspaces/2026-02-16_c3/
        E->>F: Start fs-mcp pointed at workspace
        E->>O: Start OpenCode session
    end

    rect rgb(255, 245, 230)
        Note over E,O: Phase 2: Run Scenario
        E->>E: Note start time (14:00)
        E->>O: Send prompt from scenario.md
        O->>F: Read PROJECT.md, ARCHITECTURE.md, WORK.md
        O-->>E: Agent responds (follows GSD-Lite protocol)
        E->>O: [Follow-up prompts as needed]
        E->>E: Note end time (14:15)
    end

    rect rgb(245, 255, 230)
        Note over E,C: Phase 3: Evaluate
        E->>I: python eval_ingest.py --since 14:00 --until 14:15
        I-->>E: Session extracted to eval_output/
        E->>C: python eval_consume.py l1 ./eval_output/
        C-->>E: L1 results (programmatic checks)
        E->>C: python eval_consume.py l2 ./eval_output/
        C-->>E: L2 results (Vertex rubric scores)
    end
```

##### 6.2 Checklist for Each Eval Run

```markdown
## Eval Run Checklist

### Setup
- [ ] Clone workspace: `./clone_workspace.sh <scenario>`
- [ ] Start fs-mcp: `uvx fs-mcp@latest --root <workspace_path>`
- [ ] Start OpenCode with GSD-Lite agent config
- [ ] Note start time: __:__

### Execution
- [ ] Follow prompts from `scenarios/<scenario>/scenario.md`
- [ ] Let agent respond naturally (don't coach)
- [ ] Note any unexpected behaviors

### Collection
- [ ] Note end time: __:__
- [ ] Run: `python eval_ingest.py --since <start> --until <end> --project <workspace_path>`
- [ ] Verify session extracted to `eval_output/`

### Evaluation
- [ ] L1: `python eval_consume.py l1 ./eval_output/`
- [ ] L2: `python eval_consume.py l2 ./eval_output/`
- [ ] Record results in `workspaces/<run>/results.md`
```

---

#### 7. Implementation Tasks

| Task ID | Description | Depends On | Est. |
|---------|-------------|------------|------|
| TASK-EVAL-003a | Create `tests/evals/` directory structure | This decision | 0.5h |
| TASK-EVAL-003b | Generate synthetic codebase (Gemini handoff) | TASK-EVAL-003a | 1h |
| TASK-EVAL-003c | Generate GSD-Lite artifacts for each scenario | TASK-EVAL-003b | 1h |
| TASK-EVAL-003d | Write scenario.md for each pillar (S1, P2, C3, J4) | TASK-EVAL-003c | 1h |
| TASK-EVAL-003e | Create `clone_workspace.sh` script | TASK-EVAL-003a | 0.5h |
| TASK-EVAL-002d | Implement `eval_consume.py l2` (Vertex integration) | LOG-046 | 2h |
| TASK-EVAL-002e | Run first end-to-end eval (C3 scenario) | All above | 1h |

---

#### 8. Dependency DAG

```mermaid
graph TD
    LOG028["LOG-028: CI Framework Design<br/>(3-layer architecture)"] --> LOG042
    LOG040["LOG-040: Time-Partitioned Eval<br/>(Session isolation)"] --> LOG042
    LOG042["LOG-042: Constitutional Eval Architecture<br/>(Session-as-unit)"] --> LOG043
    LOG043["LOG-043: Vertex AI Rubric Eval<br/>(Hybrid L1+L2)"] --> LOG046
    LOG046["LOG-046: Vertex-Native Schema<br/>(Pipeline simplification)"] --> LOG067
    LOG067["LOG-067: Manual Scenario Eval<br/>(This entry)"]
    
    LOG067 --> TASK003a["TASK-EVAL-003a: Directory structure"]
    TASK003a --> TASK003b["TASK-EVAL-003b: Synthetic codebase"]
    TASK003b --> TASK003c["TASK-EVAL-003c: GSD-Lite artifacts"]
    TASK003c --> TASK003d["TASK-EVAL-003d: Scenario scripts"]
    TASK003a --> TASK003e["TASK-EVAL-003e: Clone script"]
    
    LOG046 --> TASK002d["TASK-EVAL-002d: Vertex L2"]
    
    TASK003d --> TASK002e["TASK-EVAL-002e: First E2E eval"]
    TASK003e --> TASK002e
    TASK002d --> TASK002e
    
    style LOG067 fill:#90EE90
    style TASK002e fill:#FFD700
```

**To onboard this decision from scratch:**
1. **LOG-028** (lines 4069-4375): Why CI framework; three-layer architecture concept
2. **LOG-040** (lines 6303-6720): Time-partitioned evaluation; deliberate vs organic sessions
3. **LOG-042** (lines 7021-7532): Session-as-unit; hybrid orchestration decision
4. **LOG-043** (lines 7533-8064): Vertex AI for L2; Constitution as guidelines parameter
5. **LOG-046** (lines 8409-8536): Pipeline simplification; `eval_ingest.py` outputs Vertex-native
6. **LOG-067** (this entry): Manual scenario-based evaluation; workspace isolation

---

#### 9. Open Questions (For Next Session)

| Question | Status | Notes |
|----------|--------|-------|
| Which public API for test fixture? | OPEN | wttr.in (weather) vs api.coindesk.com (bitcoin) — both stdlib-friendly |
| Should scenarios share PROJECT.md/ARCHITECTURE.md? | DECIDED | Yes — only WORK.md varies per scenario |
| How to version control workspaces? | OPEN | `.gitignore workspaces/*` or commit select runs? |

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-067 (Manual Scenario-Based Evaluation decision)
→ Dependency chain: LOG-067 ← LOG-046 ← LOG-043 ← LOG-042 ← LOG-040 ← LOG-028
→ Next action: TASK-EVAL-003a — Create `tests/evals/` directory structure

**Layer 2 — Global Context:**
→ Architecture: templates/ (immutable) + scenarios/ (evaluator-only) + workspaces/ (per-run clones)
→ Patterns: Manual E2E testing; evaluator/evaluatee separation; one scenario per pillar
→ Key decisions: DECISION-067a (directory structure), DECISION-067b (4 scenarios), DECISION-067c (P2 prompt selection)

**Fork paths:**
- Create directory structure → TASK-EVAL-003a
- Generate synthetic codebase → Hand Gemini brief from Section 5.3
- Generate GSD-Lite artifacts → Hand Gemini brief from Section 5.4
- Implement Vertex L2 → TASK-EVAL-002d (can parallelize)
- Discuss scenario details → Refine scenario.md content

---

### [LOG-068] - [EXEC] - Implementation of Manual Scenario Evaluation Fixtures - Task: TASK-EVAL-003

**Status:** COMPLETE
**Date:** 2026-02-16
**Task:** TASK-EVAL-003 (Manual Scenario-Based Evaluation Setup)
**Dependencies:**
- LOG-067 (Decision to use manual scenarios)
- TASK-EVAL-003a through TASK-EVAL-003e (Implementation steps)

---

#### 1. Executive Summary

**What was done:** Implemented the full evaluation fixture suite defined in LOG-068. We now have a "laboratory" for testing GSD-Lite agents against the Constitution.
1. **Synthetic Codebase:** `tests/evals/templates/src/` contains a realistic Python CLI app (API Client for `wttr.in`).
2. **Scenario Artifacts:** 4 distinct `WORK.md` states representing the pillars (Fresh Start, Mid-Task, Discuss Mode, Pending Log).
3. **Evaluator Scripts:** `tests/evals/scenarios/*.md` contain the prompt scripts for humans to run.
4. **Workspace Automation:** `tests/evals/clone_workspace.sh` automates the setup of isolated test environments.

**Key Decision:** Switched from Coindesk API to `wttr.in` for the test fixture because `wttr.in` requires zero auth, returns complex JSON, and is highly reliable for test automation.

**The One-Liner:** The "gym" is built — we can now run controlled experiments to test agent compliance with the Constitution.

---

#### 2. Implementation Details

##### 2.1 The Synthetic Codebase (`api-client-fixture`)

Located in `tests/evals/templates/src/`:
- `client.py`: Uses `urllib` to fetch weather from `wttr.in?format=j1`.
- `cache.py`: JSON file-based caching in `~/.cache/api-client-fixture`.
- `main.py`: CLI with `weather` and `raw` commands.
- **Why this matters:** It's simple enough (no external deps) to run anywhere, but complex enough (network, caching, JSON parsing) to require "real" engineering thought from the agent.

##### 2.2 The 4 Scenarios

| Scenario | Path | Purpose | Key Artifact |
|----------|------|---------|--------------|
| **C3: Onboarding** | `scenarios/c3-onboarding` | Test Universal Onboarding | `WORK.md`: `current_mode: none` |
| **S1: Handoff** | `scenarios/s1-handoff` | Test Session Handoff | `WORK.md`: Active task `TASK-001` (Retry logic) |
| **P2: Pair Prog** | `scenarios/p2-pair-programming` | Test "Why Before How" | `WORK.md`: `current_mode: discuss` |
| **J4: Journalism** | `scenarios/j4-journalism` | Test Log Quality | `WORK.md`: Pending `DECISION-002` (Caching) |

##### 2.3 The Clone Script

`tests/evals/clone_workspace.sh` implements the layering logic:
1. Copy immutable template (Source code + Shared `PROJECT.md`/`ARCHITECTURE.md`)
2. Copy scenario-specific `gsd-lite/` (Overwrites `WORK.md`)

```bash
./clone_workspace.sh c3-onboarding
# Creates: tests/evals/workspaces/2026-02-16_1400_c3-onboarding/
```

---

#### 3. Verification

Verified the fixture works by:
1. Running `clone_workspace.sh c3-onboarding` → Success.
2. Inspecting generated `WORK.md` → Correctly set to `current_mode: none`.
3. Running `python -m src.main weather London` in the template → Successfully fetched JSON from `wttr.in`.

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-068 (Implemented evaluation fixtures)
→ Dependency chain: LOG-068 ← LOG-067 ← LOG-046 ← LOG-043 ← LOG-042
→ Next action: TASK-EVAL-002d — Implement `eval_consume.py l2` (Vertex Integration)

**Layer 2 — Global Context:**
→ Architecture: tests/evals/ contains complete test fixture suite
→ Patterns: Manual E2E testing; isolated workspaces
→ Key decisions: DECISION-067a (Structure), DECISION-067b (Scenarios), DECISION-067c (P2 Prompt)

**Fork paths:**
- Implement Vertex L2 → TASK-EVAL-002d
- Run first manual eval → Use `clone_workspace.sh` and follow `scenarios/c3-onboarding/scenario.md`
- Inspect synthetic code → `tests/evals/templates/src/`

---

### [LOG-069] - [EXEC] - Vertex AI L2 Integration: Constitution as Guidelines via YAML Rubrics - Task: TASK-EVAL-002d

**Status:** IMPLEMENTED (Pending Verification)
**Date:** 2026-02-16
**Task:** TASK-EVAL-002d (Vertex AI L2 Integration)
**Dependencies:**
- LOG-046 (Vertex-Native Turn-Structured Schema, lines 8414-8536)
- LOG-043 (Vertex AI Rubric-Based Evaluation, lines 7538-8064)
- LOG-030 (CONSTITUTION.md v0.1)
- `src/gsd_lite/template/constitution/rubrics/pair-programming.yaml` (14KB structured rubric)

---

#### 1. Executive Summary

**What we built:** A Layer 2 evaluation pipeline that uses Vertex AI's `GENERAL_QUALITY` metric with **custom guidelines** derived from our YAML rubrics (or fallback prose) to evaluate agent compliance with the GSD-Lite Constitution.

**The Key Innovation:** "Constitution as Code" — Our structured YAML rubrics (`pair-programming.yaml`) are dynamically converted to natural language guidelines that Vertex AI's adaptive rubric engine can understand. This bridges machine-readable rubrics with LLM-as-judge evaluation.

**The One-Liner:** We teach Vertex AI how to be a Constitution compliance officer by injecting our rubric criteria, scoring rules, and examples directly into its evaluation guidelines.

**Initial Run Status:**
- **Input:** `tests/evals/workspaces/p2-pair-programming_20260216_1823/eval.json`
- **Output:** `tests/evals/workspaces/p2-pair-programming_20260216_1823/eval_results.json`
- **Result:** `"explanation": "Failed to parse evaluation results"` — needs debugging

---

#### 2. The Problem: Schema Mismatch with Vertex AI

##### 2.1 The Symptom

Our original `eval_ingest.py` output was semantically incorrect:

```json
{
  "request": {
    "contents": [
      {"role": "user", "parts": [{"text": "User prompt"}]},
      {"role": "model", "parts": [{"text": "Model response"}]}  // ❌ WRONG!
    ]
  },
  "response": {
    "candidates": [{"content": {"role": "model", "parts": [{"text": "Model response"}]}}]
  }
}
```

**The Bug:** We were putting the model's response BOTH in `request.contents` AND `response.candidates`. This confused Vertex's auto-parsing because it saw the answer as part of the question.

##### 2.2 The Fix (eval_ingest.py Lines 633-680)

Per Vertex AI documentation:
- `request.contents` = Conversation history + **current prompt** (last user turn)
- `response.candidates` = The **model response being evaluated** (last model turn)

**Citation:** https://cloud.google.com/vertex-ai/generative-ai/docs/models/evaluation-dataset

> "The Gen AI evaluation service automatically parses multi-turn conversation data... identifies the previous turns and processes them as conversation_history."

**Code Change (scripts/eval_ingest.py:664):**
```python
# Build request_contents: everything UP TO AND INCLUDING the last user turn
# (excludes the final model response - that goes in response.candidates)
if last_user_idx >= 0:
    request_contents = contents[:last_user_idx + 1]
else:
    request_contents = []
```

**Correct Schema:**
```json
{
  "request": {
    "contents": [
      {"role": "user", "parts": [{"text": "User prompt"}]}
    ]
  },
  "response": {
    "candidates": [{"content": {"role": "model", "parts": [{"text": "Model response"}]}}]
  }
}
```

---

#### 3. The Innovation: YAML Rubrics → Vertex Guidelines

##### 3.1 The Design Challenge

Vertex AI's `GENERAL_QUALITY` metric accepts a `guidelines` parameter — a natural language string that instructs the judge model what to evaluate. But we have structured YAML rubrics with:
- `evaluation_steps`: Procedural checklist
- `scoring`: Binary pass/fail criteria
- `violation_examples`: What bad looks like
- `compliance_examples`: What good looks like

How do we bridge structured data → natural language?

##### 3.2 The Solution: yaml_rubric_to_guidelines()

**File:** `scripts/layer2_vertex.py` (Lines 114-175)

```python
def yaml_rubric_to_guidelines(rubric: Dict) -> str:
    """
    Convert a YAML rubric to Vertex AI guidelines string.
    
    The YAML rubric structure:
    - metadata: pillar info
    - criteria[]: list of behaviors with evaluation_steps, scoring, examples
    
    Output: Structured text that Vertex's GENERAL_QUALITY can use.
    """
    lines = []
    
    # Header from metadata
    lines.append(f"# Evaluate: {pillar_name} ({pillar_id})")
    lines.append(description)
    
    # Each criterion becomes a section
    for criterion in criteria:
        lines.append(f"## {crit_id}: {crit_name}")
        lines.append(crit_desc)
        
        # Evaluation steps become numbered list
        lines.append("### Evaluation Steps:")
        for i, step in enumerate(eval_steps, 1):
            lines.append(f"  {i}. {step}")
        
        # Scoring criteria
        lines.append("### Scoring:")
        lines.append(f"  [0] Violation: {fail_criteria}")
        lines.append(f"  [1] Pass: {pass_criteria}")
        
        # Examples for grounding
        lines.append("### Violation Examples (FAIL):")
        lines.append("### Compliance Examples (PASS):")
    
    return "\n".join(lines)
```

##### 3.3 Example: P2-H1 "Why Before How"

**Input (from pair-programming.yaml):**
```yaml
- id: P2-H1
  name: Why Before How
  evaluation_steps:
    - Identify if the agent performed an ACTION
    - If action was performed, check: Did agent ask WHY first?
  scoring:
    - score: 0
      label: Violation
      criteria: "Agent executed without asking why"
    - score: 1
      label: Pass
      criteria: "Agent asked clarifying questions before executing"
  violation_examples:
    - input: "Add a logout button"
      response: "I've added a logout button to the header..."
      reason: "Executed without asking why"
```

**Output (Vertex Guidelines):**
```
## P2-H1: Why Before How

Agent MUST NOT execute without understanding intent...

### Evaluation Steps:
  1. Identify if the agent performed an ACTION
  2. If action was performed, check: Did agent ask WHY first?

### Scoring:
  [0] Violation:
      Agent executed without asking why
  [1] Pass:
      Agent asked clarifying questions before executing

### Violation Examples (FAIL):
  Input: "Add a logout button"
  Response: "I've added a logout button to the header..."
  Why FAIL: Executed without asking why
```

---

#### 4. The Pipeline: How It All Connects

```mermaid
flowchart TB
    subgraph "Ingest (eval_ingest.py)"
        OC["OpenCode SQLite"] --> INGEST["extract_trajectory()"]
        INGEST --> SCHEMA["Vertex-Native JSON"]
    end
    
    subgraph "Consume L2 (layer2_vertex.py)"
        SCHEMA --> LOAD["load_yaml_rubric()"]
        LOAD --> CONVERT["yaml_rubric_to_guidelines()"]
        CONVERT --> GUIDELINES["Natural Language Guidelines"]
        
        GUIDELINES --> VERTEX["Vertex AI<br/>GENERAL_QUALITY<br/>+ guidelines param"]
        SCHEMA --> VERTEX
        
        VERTEX --> RESULT["L2 Evaluation Result"]
    end
    
    subgraph "Rubrics"
        YAML["pair-programming.yaml<br/>(P2-H1 to P2-H5)"]
        PROSE["Prose Fallback<br/>(S1, C3, J4)"]
    end
    
    YAML --> LOAD
    PROSE -.->|"fallback if no YAML"| CONVERT
    
    style YAML fill:#90EE90
    style VERTEX fill:#87CEEB
    style RESULT fill:#FFD700
```

---

#### 5. Implementation Details

##### 5.1 Files Created/Modified

| File | Action | Key Changes |
|------|--------|-------------|
| `scripts/layer2_vertex.py` | **CREATED** | 500+ lines; rubric loading, Vertex integration, CLI |
| `scripts/eval_ingest.py` | **MODIFIED** | Lines 633-680; schema fix for request.contents |
| `scripts/eval_consume.py` | **MODIFIED** | Added `l2` command that delegates to `layer2_vertex.py` |

##### 5.2 CLI Usage

```bash
# Run L2 evaluation on P2 pillar using YAML rubric
python scripts/eval_consume.py l2 \
    --input tests/evals/workspaces/p2-pair-programming_20260216_1823/eval.json \
    --pillar P2 \
    --verbose \
    --output eval_results.json

# Show what guidelines would be used
python scripts/layer2_vertex.py show P2

# List available metrics and their sources
python scripts/layer2_vertex.py metrics
```

##### 5.3 Rubric Source Priority

**File:** `scripts/layer2_vertex.py:303` (`get_guidelines_for_pillar`)

```python
def get_guidelines_for_pillar(pillar_id: str) -> tuple[str, str]:
    # Try YAML first (structured, preferred)
    rubric = load_yaml_rubric(pillar_id)
    if rubric:
        guidelines = yaml_rubric_to_guidelines(rubric)
        return guidelines, f"YAML rubric: {pillar_id.lower()}.yaml"
    
    # Fallback to prose guidelines
    prose_guidelines = {
        "S1": S1_GUIDELINES,  # Hardcoded in script
        "C3": C3_GUIDELINES,
        "J4": J4_GUIDELINES,
    }
    return prose_guidelines.get(pillar_id), "prose fallback"
```

---

#### 6. Initial Run Results

**Command:**
```bash
python scripts/eval_consume.py l2 \
    --input tests/evals/workspaces/p2-pair-programming_20260216_1823/eval.json \
    --pillar P2 -v \
    --output tests/evals/workspaces/p2-pair-programming_20260216_1823/eval_results.json
```

**Output (eval_results.json):**
```json
{
  "summary": {
    "total_sessions": 1,
    "passed_sessions": 0,
    "overall_pass_rate": 0.0
  },
  "sessions": [{
    "session_id": "ses_399a5be94ffeDAst21Ym5yFvkx",
    "title": "API timeout troubleshooting",
    "checks": [{
      "metric_name": "P2_compliance",
      "pillar_id": "P2",
      "score": 0.0,
      "passed": false,
      "explanation": "Failed to parse evaluation results",
      "rubrics_source": "YAML rubric: p2.yaml"
    }]
  }]
}
```

**Status:** Result parsing failed — needs debugging. Likely causes:
1. Column naming mismatch in Vertex result DataFrame
2. Auth or project configuration issue
3. Guidelines string too long

---

#### 7. Dependency DAG for Future Agents

```mermaid
graph TD
    LOG028["LOG-028: CI Framework Design<br/>(3-layer architecture)"] --> LOG043
    LOG030["LOG-030: CONSTITUTION.md v0.1<br/>(Four Pillars)"] --> LOG043
    LOG042["LOG-042: Eval Architecture<br/>(Session as unit, turn schema)"] --> LOG043
    
    LOG043["LOG-043: Vertex AI Rubric-Based Eval<br/>(DECISION-043a,b,c)"] --> LOG046
    LOG046["LOG-046: Vertex-Native Schema<br/>(Pipeline simplification)"] --> LOG069
    
    LOG067["LOG-067: Manual Scenario Decision<br/>(Evaluation Laboratory)"] --> LOG068
    LOG068["LOG-068: Evaluation Fixtures<br/>(Synthetic codebase)"] --> LOG069
    
    LOG069["LOG-069: Vertex L2 Integration<br/>(This entry)"]
    
    YAML["rubrics/pair-programming.yaml<br/>(P2-H1 to P2-H5)"] --> LOG069
    
    style LOG069 fill:#FFD700,stroke:#333,stroke-width:2px
    style LOG043 fill:#90EE90
    style LOG046 fill:#90EE90
```

**Key Dependencies Summary:**
- **LOG-043** (lines 7538-8064): Defines the Vertex AI rubric-based approach and DECISION-043c (Constitution as guidelines)
- **LOG-046** (lines 8414-8536): Defines the Vertex-native schema that `eval_ingest.py` outputs
- **LOG-068** (lines 11851-11933): Provides the test fixtures and workspaces we're evaluating

---

#### 8. Next Actions

1. **Debug result parsing:** Investigate why `"Failed to parse evaluation results"` — check Vertex response format
2. **Verify auth:** Ensure `GOOGLE_CLOUD_PROJECT` and `gcloud auth` are correct
3. **Create remaining rubrics:** S1, C3, J4 YAML files (currently using prose fallback)
4. **Run full evaluation:** Once parsing is fixed, run across all 4 pillars

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-069 (Vertex L2 Integration implementation)
→ Dependency chain: LOG-069 ← LOG-046 ← LOG-043 ← LOG-042 ← LOG-028
→ Next action: Debug `"Failed to parse evaluation results"` in eval_results.json

**Layer 2 — Global Context:**
→ Architecture: `eval_ingest.py` → Vertex-native JSON → `layer2_vertex.py` → Vertex AI
→ Patterns: YAML rubric → guidelines conversion; fallback to prose
→ Key decisions: DECISION-043c (Constitution as guidelines)

**Fork paths:**
- Debug L2 results → Investigate Vertex response DataFrame columns
- Create more rubrics → Add S1, C3, J4 YAML rubrics to `constitution/rubrics/`
- Review eval input → Check `eval.json` schema matches expectations
- Approve task → If verified working, update TASK-EVAL-002d status

### [LOG-070] - [DEV-EXP] - Zero-Friction Debugging: The jsonpickle Pattern & Optional Dependencies Strategy - Task: TASK-EVAL-002d

**The Black Box Problem:**
When integrating with third-party SDKs like Vertex AI, return objects are often complex, nested structures (e.g., `EvaluationResult` containing `pandas.DataFrame`). Standard Python `json.dump()` and Pydantic's `model_dump_json()` fail to serialize these objects, resulting in opaque `PydanticSerializationError` exceptions. This forces developers into a manual "mapping hell" — writing custom serializers for every internal class just to inspect debug data.

**The Solution: `jsonpickle`**
Instead of manually mapping fields, we adopt `jsonpickle` as our standard debug serializer. It encodes arbitrary Python object graphs into JSON-serializable dictionaries, preserving type metadata (`py/object`, `py/state`) so they can be fully reconstructed ("thawed") later. This turns opaque SDK objects into browseable, searchable JSON artifacts in VS Code.

**Implementation Details:**
We modified `scripts/layer2_vertex.py` to automatically dump the raw `EvaluationResult` when running in verbose mode.

```python
# scripts/layer2_vertex.py L352-368
# Debug: Dump raw result to JSON for inspection (requires jsonpickle)
if verbose:
    try:
        import jsonpickle
        # Sanitize filename
        safe_id = "".join(c for c in session_id if c.isalnum())[:8]
        debug_path = f"debug_eval_{pillar_id}_{safe_id}.json"
        
        with open(debug_path, "w", encoding="utf-8") as f:
            f.write(jsonpickle.encode(eval_result, indent=2))
        print(f"   🔍 Debug dump saved to: {debug_path}")
    except ImportError:
        print("   ⚠️  Install 'jsonpickle' to enable debug dumps")
```

**Output Example (Synthesized):**
What a standard `json.dump()` crash looks like vs `jsonpickle` output:

```json
{
  "py/object": "vertexai.preview.generative_models.EvaluationResult",
  "summary_metrics": [
    {
      "py/object": "vertexai.preview.generative_models.AggregatedMetricResult",
      "metric_name": "general_quality",
      "mean_score": 0.8
    }
  ],
  "_row_results": {
    "py/object": "pandas.core.frame.DataFrame",
    "py/state": {
      "values": [
        {"prompt": "Test input", "score": 5, "explanation": "Excellent adherence..."}
      ]
    }
  }
}
```

**Dependency Strategy: Production Lean, Dev Rich**
To keep the installed footprint small for end-users while empowering developers, we use the `[project.optional-dependencies]` standard (PEP 621) in `pyproject.toml`.

```toml
# pyproject.toml
[project.optional-dependencies]
dev = [
    "jsonpickle>=3.0.0",
    "pytest>=7.0.0",
]
```

**Architecture Diagram:**

```mermaid
graph TD
    A[pyproject.toml] -->|Defines| B(Core Dependencies)
    A -->|Defines| C(Optional: dev)
    
    B -->|pip install gsd-lite| D[User Environment]
    D -->|Contains| E[typer, rich, google-cloud-aiplatform]
    D -->|Missing| F[jsonpickle]
    
    C -->|uv sync --extra dev| G[Dev Environment]
    G -->|Contains| E
    G -->|Contains| F
    
    H[scripts/layer2_vertex.py] -->|ImportError| D
    H -->|Dumps JSON| G
```

**Citations & Sources:**
- **PEP 621**: [Storing project metadata in pyproject.toml](https://peps.python.org/pep-0621/#dependencies-optional-dependencies)
- **Vertex AI SDK**: [EvaluationResult Documentation](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/evaluation)
- **Code Change**: `scripts/layer2_vertex.py` (Commit: pending)

**Dependencies Added:**
- `jsonpickle` (dev-only)


---

### [LOG-071] - [DECISION] - Vertex AI Gen AI Evaluation is NOT Fit for Constitutional Compliance: The Golden Path Problem - Task: TASK-EVAL-002

**Status:** APPROVED  
**Date:** 2026-02-17  
**Decision IDs:** DECISION-071a (Vertex AI is not fit for behavioral compliance evaluation), DECISION-071b (Need unified single-platform evaluation approach)  
**Task:** TASK-EVAL-002 (Constitutional Evaluation Pipeline)  
**Supersedes:** DECISION-043a (Vertex AI rubric-based metrics for L2 evaluation)  
**Dependencies:**
- LOG-028 (lines 4083-4389): CI Framework Design — defines 3-layer architecture and Six Pillars
- LOG-029 (lines 4390-4600): Constitution Implementation Plan — hybrid format decision
- LOG-030 (lines 4801-4900): CONSTITUTION.md v0.1 — the Four Pillars being evaluated
- LOG-032 (lines 4895-5466): OpenCode Goldmine — original Vertex AI decision (DECISION-032b, now triple-superseded)
- LOG-042 (lines 7041-7120): Constitutional Evaluation Architecture — first Vertex supersession (DECISION-042b: Promptfoo)
- LOG-043 (lines 7547-7800): Vertex AI Rubric-Based Evaluation — second Vertex decision (DECISION-043a, now superseded)
- LOG-069 (lines 11945-12110): Vertex AI L2 Integration implementation

---

#### 1. Executive Summary

**What we discovered:** After exhaustive analysis of ALL Vertex AI Gen AI Evaluation documentation (14 official docs scraped and analyzed), we conclude that **Vertex AI is fundamentally not designed for evaluating agent behavioral compliance against a Constitution**. It is designed for evaluating *response quality* and *trajectory correctness against golden paths* — neither of which matches our use case.

**The Core Problem:** Every Vertex trajectory metric except `trajectory_single_tool_use` requires a `reference_trajectory` (golden path). GSD-Lite's Constitution defines **behavioral patterns** ("grep before read", "ask why before executing"), NOT **expected tool sequences**.

**The User's Valid Frustration:**
> "I do not want to split my brain trying to run eval on one end and devise custom test on another. That is simply too tedious for a one man job."

**DECISION-071a:** Vertex AI Gen AI Evaluation is **NOT fit** for GSD-Lite Constitutional compliance evaluation. This supersedes DECISION-043a.

**DECISION-071b:** We need a **unified single-platform evaluation approach** that can handle both behavioral patterns and text quality without requiring the user to maintain two separate evaluation systems.

---

#### 2. The Decision Flip-Flop Chain: How We Got Here

```mermaid
graph TD
    subgraph "Decision Chain"
        D032["LOG-032: DECISION-032b<br/>Vertex AI (trajectory metrics)<br/>❌ SUPERSEDED"]
        D042["LOG-042: DECISION-042b<br/>Promptfoo (YAML rubrics)<br/>❌ SUPERSEDED"]
        D043["LOG-043: DECISION-043a<br/>Vertex AI (rubric-based)<br/>❌ SUPERSEDED"]
        D071["LOG-071: DECISION-071a<br/>Vertex NOT fit<br/>✅ CURRENT"]
    end
    
    D032 -->|"Trajectory requires golden path"| D042
    D042 -->|"User is GCP partner"| D043
    D043 -->|"Deep doc analysis"| D071
    
    subgraph "Why Each Failed"
        F032["Vertex trajectory_* needs<br/>reference_trajectory"]
        F042["Promptfoo superseded<br/>for strategic reasons"]
        F043["GENERAL_QUALITY<br/>can't see tool calls"]
    end
    
    D032 -.-> F032
    D042 -.-> F042
    D043 -.-> F043
```

| Log | Decision | Chose | Why Superseded |
|-----|----------|-------|----------------|
| LOG-032 | DECISION-032b | Vertex AI (trajectory) | Trajectory metrics require golden path |
| LOG-042 | DECISION-042b | Promptfoo | User is GCP partner, wanted hands-on Vertex experience |
| LOG-043 | DECISION-043a | Vertex AI (rubric-based) | `GENERAL_QUALITY` can't see tool trajectory |
| **LOG-071** | **DECISION-071a** | **Vertex NOT fit** | **Comprehensive doc analysis proves mismatch** |

---

#### 3. The Evidence: What Vertex AI Actually Offers

##### 3.1 Documents Analyzed

We analyzed **14 official Vertex AI Gen AI Evaluation documents** (scraped 2026-02-16):

| URL | Key Content |
|-----|-------------|
| `cloud.google.com/.../evaluation-dataset` | Dataset schema: `prompt`, `response`, `intermediate_events` |
| `cloud.google.com/.../determine-eval` | Metric types: Rubric-based, Computation-based, Custom function |
| `cloud.google.com/.../evaluation-agents` | **Agent evaluation: trajectory metrics require `reference_trajectory`** |
| `cloud.google.com/.../metrics-templates` | Pre-built prompts for fluency, coherence, safety |
| `cloud.google.com/.../run-evaluation` | SDK usage: `EvalTask`, `evaluate()` |

**Citation:** All docs scraped to `scripts/vertex_eval_docs.json` (38KB, 14 entries).

##### 3.2 Agent Evaluation Metrics — The Golden Path Problem

From `evaluation-agents` doc, section "Trajectory evaluation":

```python
# What Vertex expects (from official docs)
reference_trajectory = [
    {"tool_name": "get_user_preferences", "tool_input": {"user_id": "user_y"}},
    {"tool_name": "set_temperature", "tool_input": {"location": "Living Room", "temperature": 23}},
]

predicted_trajectory = [
    {"tool_name": "get_user_preferences", "tool_input": {"user_id": "user_z"}},
    {"tool_name": "set_temperature", "tool_input": {"location": "Living Room", "temperature": 23}},
]

eval_dataset = pd.DataFrame({
    "predicted_trajectory": predicted_trajectory,
    "reference_trajectory": reference_trajectory,  # <-- REQUIRED!
})
```

**Every trajectory metric except `trajectory_single_tool_use` requires `reference_trajectory`:**

| Metric | What It Does | Requires Golden Path? |
|--------|--------------|----------------------|
| `trajectory_exact_match` | Predicted == Reference exactly | ✅ Yes |
| `trajectory_in_order_match` | Contains all reference tools in order | ✅ Yes |
| `trajectory_any_order_match` | Contains all reference tools (any order) | ✅ Yes |
| `trajectory_precision` | % of predicted tools in reference | ✅ Yes |
| `trajectory_recall` | % of reference tools in predicted | ✅ Yes |
| `trajectory_single_tool_use` | Does specific tool appear? | ❌ No |

**Citation:** `evaluation-agents` doc, section "Trajectory evaluation", table "Metric input parameters".

##### 3.3 What GSD-Lite Constitution Requires

From LOG-030 (CONSTITUTION.md v0.1, lines 4801-4900):

| Behavior ID | Constitution Rule | Golden Path? |
|-------------|-------------------|--------------|
| S1-H1 | Response ends with `📦 STATELESS HANDOFF` | ❌ No (text pattern) |
| P2-H1 | Agent asks "why" BEFORE executing | ❌ No (behavioral pattern) |
| P2-H2 | Agent echoes findings BEFORE proposing | ❌ No (behavioral pattern) |
| C3-H1 | Agent greps BEFORE reading files | ❌ No (tool sequence pattern) |
| C3-H3 | Agent reads PROJECT/ARCH/WORK on first turn | ⚠️ Could define reference |
| J4-H1 | Log includes WHY not just WHAT | ❌ No (text quality) |

**The Mismatch:** Our Constitution defines **behavioral patterns** ("X before Y"), not **expected sequences** ("do X then Y then Z").

---

#### 4. The Fundamental Mismatch: Synthesized Example

##### What Vertex Trajectory Evaluation Does (Golden Path Matching)

```python
# Vertex: "Did the agent follow THE expected sequence?"
reference_trajectory = [
    {"tool_name": "search_flights", "tool_input": {"dest": "Paris"}},
    {"tool_name": "select_flight", "tool_input": {"flight_id": "AF123"}},
    {"tool_name": "book_flight", "tool_input": {"flight_id": "AF123"}},
]

# Agent's actual trajectory
predicted_trajectory = [
    {"tool_name": "search_flights", "tool_input": {"dest": "Paris"}},
    {"tool_name": "book_flight", "tool_input": {"flight_id": "AF123"}},  # Skipped select!
]

# Vertex evaluates:
# trajectory_exact_match = 0 (not identical)
# trajectory_in_order_match = 0 (missing select_flight)
# trajectory_recall = 0.66 (2/3 tools present)
```

**Vertex answers:** "Did the agent do exactly what we expected?"

##### What GSD-Lite Constitutional Compliance Needs (Pattern Matching)

```python
# GSD-Lite: "Did the agent follow BEHAVIORAL RULES?"
constitution_rule_C3H1 = "Agent MUST grep BEFORE reading full files"

# Agent's actual trajectory
predicted_trajectory = [
    {"tool_name": "list_directory", "tool_input": {"path": "."}},
    {"tool_name": "grep_content", "tool_input": {"pattern": "^## ", "path": "WORK.md"}},
    {"tool_name": "read_files", "tool_input": {"files": [{"path": "WORK.md", "start_line": 5, "end_line": 50}]}},
]

# We need to evaluate:
# 1. Was there a grep_content before read_files on WORK.md? → YES
# 2. Did the read_files use surgical reading (start_line/end_line)? → YES
# Result: C3-H1 = PASS

# But there's NO golden reference_trajectory!
# The agent could have grepped different patterns, read different sections.
# We don't care about the exact sequence — we care about the PATTERN.
```

**GSD-Lite needs:** "Did the agent follow behavioral rules, regardless of exact sequence?"

---

#### 5. The `GENERAL_QUALITY` + Guidelines Limitation

LOG-043 proposed using `GENERAL_QUALITY` with custom `guidelines` parameter. Let's analyze what this actually sees:

##### What We Pass to Vertex (from LOG-069 implementation)

```python
# From scripts/layer2_vertex.py, lines 292-340
prompt = session.get("prompt", "")
response_text = session["response"]["candidates"][0]["content"]["parts"][0]["text"]

eval_df = pd.DataFrame({
    "prompt": [prompt],           # Just user prompt text
    "response": [response_text],  # Just final model response
})
```

##### What Vertex's Judge Model Sees

```
Prompt: "The API is timing out sometimes. please remember that the read_files tool accept paths"

Response: "I have successfully loaded the project context and investigated the codebase.
**Current Understanding:**
- **Project**: API Client Fixture...
**Proposed Solution:**
I suggest we make the timeout configurable..."
```

##### What Vertex's Judge Model Does NOT See

```python
# The tool trajectory that led to this response!
generated_trajectory = [
    {"tool": "fs.list", "args": {"path": "gsd-lite"}, "output": "[DIR] template..."},
    {"tool": "fs.read", "args": {"files": [...]}, "output": "Error: validation..."},
    {"tool": "fs.grep", "args": {"pattern": "timeout"}, "output": "..."},
]
```

**The Problem:** `GENERAL_QUALITY` evaluates **text quality** of the response. It cannot evaluate:
- Did the agent grep before read?
- Did the agent ask "why" before executing?
- Did the agent echo tool findings before proposing?

Because **it doesn't see the tool trajectory**.

---

#### 6. Could We Enrich the Context?

One might ask: "Could we concatenate the trajectory into the prompt/response?"

```python
enriched_prompt = f"""
## User Prompt
{prompt}

## Tool Calls Made by Agent
{json.dumps(trajectory, indent=2)}

## Agent's Final Response
{response}
"""
```

**Problems:**
1. **Token explosion** — Tool trajectories can be 10k+ tokens per session
2. **Wrong metric** — `GENERAL_QUALITY` is optimized for text quality, not behavioral compliance
3. **Hacky** — We're abusing the metric for something it wasn't designed for
4. **No structured analysis** — The judge model would have to parse JSON from text

**This is the "square peg, round hole" antipattern.**

---

#### 7. The User's Valid Concern: Single-Platform Requirement

> "I do not want to split my brain trying to run eval on one end and devise custom test on another. That is simply too tedious for a one man job. And I do not think that is best practice for agent evaluation."

**This is a valid engineering constraint.** The LOG-043 "hybrid architecture" proposed:

| Layer | Method | Tool |
|-------|--------|------|
| L1 | Programmatic (Python) | Custom scripts |
| L2 | LLM-as-judge | Vertex AI |

**But this requires:**
1. Maintaining two evaluation systems
2. Running two evaluation pipelines
3. Aggregating results from two sources
4. Debugging issues in two places

**For a one-person project, this is unsustainable.**

---

#### 8. What Does This Mean for Our Core Goal?

##### 8.1 The Original Goal (from LOG-028)

> "Instead of trying to test every possible agent behavior, we distill GSD-Lite's immutable pillars into a machine-auditable document: the Constitution."

##### 8.2 What We Learned

1. **Vertex AI's strengths:** Text quality evaluation, response grounding, golden path trajectory matching
2. **Vertex AI's weaknesses:** Behavioral pattern evaluation, tool sequence analysis without golden path
3. **GSD-Lite's needs:** Behavioral compliance, pattern-based trajectory analysis, Constitutional rules

##### 8.3 The Mismatch Diagram

```mermaid
graph LR
    subgraph "What Vertex Evaluates"
        V1["Text Quality<br/>(fluency, coherence)"]
        V2["Response Grounding<br/>(factuality)"]
        V3["Golden Path Match<br/>(trajectory == reference)"]
    end
    
    subgraph "What GSD-Lite Needs"
        G1["Behavioral Patterns<br/>(grep before read)"]
        G2["Constitutional Rules<br/>(ask why before executing)"]
        G3["Text Quality<br/>(journalism in logs)"]
    end
    
    V1 -.->|"Partial overlap"| G3
    V2 -.->|"No overlap"| G1
    V3 -.->|"No overlap"| G2
    
    style V1 fill:#90EE90
    style V3 fill:#FFB6C1
    style G1 fill:#FFB6C1
    style G2 fill:#FFB6C1
    style G3 fill:#90EE90
```

**Only ~25% overlap** (text quality evaluation).

---

#### 9. The Decision

##### DECISION-071a: Vertex AI is NOT Fit for Constitutional Compliance

**Context:** We evaluated Vertex AI Gen AI Evaluation across 14 official documentation pages, analyzed the agent evaluation metrics, and compared against our Constitution requirements.

**Decision:** Vertex AI Gen AI Evaluation is **not the right tool** for evaluating GSD-Lite Constitutional compliance.

**Rationale:**
1. Trajectory metrics require `reference_trajectory` (golden path) — we don't have one
2. `GENERAL_QUALITY` + guidelines doesn't see tool trajectories
3. Custom function metrics are just Python — we don't need Vertex for that
4. The only useful metrics (text quality) are a small fraction of our needs

**Consequences:**
- DECISION-043a (Vertex AI rubric-based metrics for L2) is **SUPERSEDED**
- Current `layer2_vertex.py` implementation is **inadequate** for full Constitution evaluation
- Need to identify a unified single-platform approach

##### DECISION-071b: Single-Platform Evaluation Requirement

**Context:** User explicitly stated: "I do not want to split my brain trying to run eval on one end and devise custom test on another."

**Decision:** The evaluation solution MUST be a **unified single-platform approach** that handles:
1. Behavioral pattern checks (trajectory analysis)
2. Text quality checks (response evaluation)
3. Constitutional compliance (rule-based evaluation)

**Open Question:** What platform/approach satisfies this requirement? Options to explore:
- Custom LLM-as-judge with full context (prompt + trajectory + response)
- Promptfoo with arbitrary context in `llm-rubric`
- Framework like Braintrust, Langsmith, or others
- Pure Python with direct Gemini/Claude calls

---

#### 10. What Vertex CAN Still Do (Limited Use Cases)

Despite the mismatch, Vertex has some valid use cases:

| Use Case | Vertex Metric | GSD-Lite Applicability |
|----------|---------------|------------------------|
| J4-H1: Log quality | `TEXT_QUALITY` | ✅ Evaluate log narrative quality |
| P2-H3: Challenge tone | `GENERAL_QUALITY` + guidelines | ⚠️ Partial — if we inject enough context |
| C3-H3: Onboarding sequence | `trajectory_in_order_match` | ⚠️ IF we define reference_trajectory |

**But using Vertex for 25% of checks while building custom for 75% violates DECISION-071b (single-platform requirement).**

---

#### 11. Next Steps

| ID | Action | Priority |
|----|--------|----------|
| 1 | Research unified evaluation platforms (Promptfoo, Braintrust, Langsmith) | High |
| 2 | Evaluate "custom LLM-as-judge" approach with full context | High |
| 3 | Design evaluation schema that includes trajectory + response | Medium |
| 4 | Deprecate `layer2_vertex.py` or scope it to text-quality-only | Low |

---

#### 12. Citations & Sources

##### Vertex AI Documentation (Scraped 2026-02-16)

| Source | URL | Key Finding |
|--------|-----|-------------|
| Evaluation Dataset | `cloud.google.com/.../evaluation-dataset` | Schema: `prompt`, `response`, `intermediate_events` |
| Define Metrics | `cloud.google.com/.../determine-eval` | Adaptive rubrics, static rubrics, custom functions |
| **Agent Evaluation** | `cloud.google.com/.../evaluation-agents` | **Trajectory metrics require `reference_trajectory`** |
| Metrics Templates | `cloud.google.com/.../metrics-templates` | Pre-built prompts for text quality |
| Run Evaluation | `cloud.google.com/.../run-evaluation` | SDK usage patterns |

**Full doc dump:** `scripts/vertex_eval_docs.json` (38KB, scraped 2026-02-16 18:58)

##### GSD-Lite Source References

| Content | File | Lines |
|---------|------|-------|
| Constitution pillars | LOG-030 | 4801-4900 |
| CI Framework Design | LOG-028 | 4083-4389 |
| Previous Vertex decision | LOG-043 | 7547-7800 |
| Current implementation | `scripts/layer2_vertex.py` | Full file |
| Evaluation input | `tests/evals/workspaces/.../eval.json` | Full file |

---

#### 13. Dependency Summary for Future Agents

To understand this decision, read in order:

1. **LOG-028** (lines 4083-4389): Defines the 3-layer CI architecture and Six Pillars — the "what we're trying to evaluate"
2. **LOG-030** (lines 4801-4900): The CONSTITUTION.md with behavior IDs (S1-H1, P2-H1, etc.)
3. **LOG-032** (lines 4895-5466): Original Vertex decision (now triple-superseded)
4. **LOG-042** (lines 7041-7120): First supersession — why trajectory metrics don't fit
5. **LOG-043** (lines 7547-7800): Second Vertex decision — rubric-based approach (now superseded)
6. **LOG-069** (lines 11945-12110): Implementation of `layer2_vertex.py` — reveals the gaps
7. **LOG-071** (this entry): Final analysis — why Vertex doesn't fit, need unified platform

```mermaid
graph TD
    L028["LOG-028<br/>CI Framework Design<br/>(6 Pillars)"]
    L030["LOG-030<br/>CONSTITUTION.md<br/>(Behavior IDs)"]
    L032["LOG-032<br/>Vertex Trajectory<br/>❌ SUPERSEDED"]
    L042["LOG-042<br/>Promptfoo<br/>❌ SUPERSEDED"]
    L043["LOG-043<br/>Vertex Rubric<br/>❌ SUPERSEDED"]
    L069["LOG-069<br/>layer2_vertex.py<br/>Implementation"]
    L071["LOG-071<br/>Vertex NOT Fit<br/>✅ CURRENT"]
    
    L028 --> L030
    L030 --> L032
    L032 --> L042
    L042 --> L043
    L043 --> L069
    L069 --> L071
    L028 --> L071
    L030 --> L071
```

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-071 (DECISION-071a: Vertex NOT fit; DECISION-071b: Need unified platform)
→ Dependency chain: LOG-071 ← LOG-069 ← LOG-043 ← LOG-042 ← LOG-032 ← LOG-030 ← LOG-028
→ Next action: Research unified evaluation platforms that can handle both trajectory + response

**Layer 2 — Global Context:**
→ Architecture: 3-layer CI (L1 structural, L2 constitutional, L3 behavioral) per LOG-028
→ Patterns: Constitution with behavior IDs (S1-H1, P2-H1, C3-H1, J4-H1)
→ Key Finding: Vertex trajectory metrics ALL require `reference_trajectory`; Constitution defines patterns, not golden paths

**Fork paths:**
- Research Promptfoo (third attempt) → `llm-rubric` with arbitrary context
- Research Braintrust/Langsmith → unified evaluation platforms
- Design custom LLM-as-judge → pass full context (prompt + trajectory + response) to Gemini
- Accept hybrid (violates DECISION-071b) → Vertex for text quality, Python for the rest



### [LOG-072] - [PHILOSOPHY] - The Evaluation Paradox: Why GSD-Lite Cannot Be Measured, Only Practiced - Task: META-REFLECTION

**Status:** CRYSTALLIZED  
**Date:** 2026-02-17  
**Decision IDs:** DECISION-072a (Evaluation is a category error), DECISION-072b (Reframe to Protocol Craft), DECISION-072c (Practice over measurement)  
**Task:** META-REFLECTION (Existential examination of GSD-Lite's measurability)  
**Supersedes:** The entire evaluation pursuit (LOG-028 through LOG-071 recontextualized, not invalidated)  
**Dependencies:**
- LOG-028 (lines 4096-4402): CI Framework Design — defines 3-layer architecture and Constitution
- LOG-067 (lines 11340-11872): Manual Scenario-Based Evaluation — the "laboratory" approach
- LOG-071 (lines 12421-12890): Vertex AI NOT Fit — the breaking point that triggered this reflection
- User kudos corpus (external): Evidence of outcomes attributable to learning practice
- Session transcripts (eval_run_2026-02-15_*.json): Evidence of interaction patterns

---

#### 1. Executive Summary: The Moment of Clarity

**The Question:** Can we build an evaluation pipeline that proves GSD-Lite "works"?

**The Answer:** No. And pursuing it is a category error.

**What Happened:** After 71 logs, 43 of which dealt with evaluation architecture (LOG-028 onwards), and multiple platform pivots (Promptfoo → Vertex → Promptfoo → Vertex → "Vertex NOT fit"), the user hit 0% confidence and asked the fundamental question:

> "Is the end goal of evaluation a pipe dream or not?"

This log captures the critical thinking session that answered: **Yes, deterministic evaluation of GSD-Lite is a pipe dream. But that's okay, because measurement was never the real goal.**

---

#### 2. The 5 Whys Analysis: Unearthing the Real Goal

##### The Surface Question
> "I want to evaluate the agent so that I can measure the session quality over iterations."

##### Why #1: Why measure session quality?
> "So that I can improve. Otherwise we cannot improve what we cannot measure."

##### Why #2: Why improve?
This is where the conversation pivoted. **Improve WHAT?**

Four distinct targets were identified:

| Target | What it means | Can it be measured? |
|--------|--------------|---------------------|
| **The protocol** (PROTOCOL.md, workflows) | Are the instructions effective? | ⚠️ Partially — via ablation |
| **Agent behavior** | Does the agent follow rules? | ✅ Yes — programmatic checks |
| **User learning outcomes** | Did the human learn? | ❌ No — confounded by skill growth |
| **Artifact quality** | Are logs useful for onboarding? | ⚠️ Partially — via cold-read test |

**Critical Insight:** The user's actual goal ("improve session quality") conflates all four targets. Evaluating "sessions" would require isolating protocol quality from model capability from user prompting skill from user domain knowledge from user mood that day.

**This is the confounding variable problem. The system includes the human as a variable.**

##### Why #3: Why believe measurement leads to improvement?
The suspected chain:
```
I make protocol changes → I want to know if they helped → I need measurement
```

**The trap:** Even with identical protocol and model, sessions vary because the human varies. There's no control group. There's no A/B test against yourself.

##### Why #4 & #5: What are you actually trying to achieve?
Through analysis of:
- **Kudos corpus:** "human version of GenAI", "sturdy reliable wall to bounce ideas off", "pushing the learning curve"
- **Session transcripts:** Research delegation, fork & redirect, echo verification, logging requests

**The root goal emerged:**

> "I want to be the best version of the 'reliable wall' for my team — the synthesizer who makes complex accessible."

GSD-Lite is an **amplifier** for this goal, not a product to be evaluated.

---

#### 3. The Category Error: Looker Eval vs GSD-Lite Eval

The user had prior success with evaluation in a different domain:

##### The Looker URL Project (Worked)

| Element | Looker Project | Evaluation |
|---------|----------------|------------|
| **Golden truth** | Analyst-verified URL | Exists ✅ |
| **Input** | Natural language question | Deterministic |
| **Output** | URL (deterministic) | Binary: works or doesn't |
| **Metric** | 50% match golden answers | Meaningful |

##### GSD-Lite (Cannot Work the Same Way)

| Element | GSD-Lite | Evaluation |
|---------|----------|------------|
| **Golden truth** | "Correct" pair programming behavior | ❓ What is "correct"? |
| **Input** | Natural language prompt | Varies by context |
| **Output** | Conversation + artifacts (generative) | Infinite valid outputs |
| **Metric** | ??? | Quality gradient, not binary |

**The Analogy:**
- Looker eval is like grading a math test (right/wrong answers)
- GSD-Lite eval is like grading a therapy session (was it "good"?)

You can define behaviors (grep-before-read, ask-why-before-how), but:
1. There are infinite valid ways to satisfy "ask why before how"
2. The agent could follow the letter but violate the spirit
3. The evaluation becomes subjective

**This is why Vertex trajectory metrics failed:** They require `reference_trajectory` (golden path). GSD-Lite's Constitution defines **patterns**, not **sequences**.

---

#### 4. The Evidence: What GSD-Lite Actually Provides

##### 4.1 The User's Articulated Values

From the discussion, the user identified what they actually want from GSD-Lite:

| Value | How GSD-Lite Delivers |
|-------|----------------------|
| **Learn faster** | Natural language on unchartered topics → stripped-down explanations applied to current vision |
| **10★ distillation experience** | Hard concepts → simple terms (the consulting technique that wins stakeholder buy-in) |
| **Consume massive data** | Agent scrapes, crunches, returns highly relevant bits (e.g., all Vertex docs → "not a fit" conclusion) |
| **Own the knowledge** | Discussion mode probes and examples → user comes out owning it, can explain to anyone |

**The real value chain:**
```
Raw docs (intimidating) 
    → Agent crunches + distills 
    → User interrogates + refines 
    → Crystallized log entry 
    → User can now explain to stakeholders/teammates
    → User becomes "the wall to bounce ideas off"
```

##### 4.2 The Kudos as Indirect Evidence

| Date Range | Representative Kudos | Inference |
|------------|---------------------|-----------|
| Pre-GSD-Lite (2024) | "rocking the first Looker jumpstart", "nailing the dbt training" | Already skilled |
| Post-GSD-Lite (Jan 2026+) | "human version of GenAI", "role model for learning spirit", Google showcase | Amplified synthesis capability |

**Can this be attributed to GSD-Lite specifically?** No.
**Can the correlation be noticed?** Yes.

This is the **attribution problem**: the promoted docs and PRs show quality outcomes, but the WORK.md is private. The public sees "this guy knows how to harness agents" but not the method.

---

#### 5. The Reframe: Protocol Craft, Not Evaluation

##### 5.1 What These Exercises Actually Are

| What user called it | What it actually is |
|---------------------|---------------------|
| "Evaluating GSD-Lite" | **Refining your instrument** |
| "Testing if prompts work" | **Calibrating your technique** |
| "Measuring session quality" | **Developing taste** |

**The Musician Analogy:**
- A violinist doesn't "evaluate" if their violin is good
- They **tune** it, **maintain** it, **learn its quirks**
- They develop **taste** for what sounds right

GSD-Lite is an instrument. You develop taste for what a good session feels like.

##### 5.2 The Craft Cycle Framework

```
┌─────────────────────────────────────────────────────┐
│                    CRAFT CYCLE                       │
│                                                      │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│   │  DESIGN  │───▶│  APPLY   │───▶│  NOTICE  │     │
│   │ (change) │    │ (use it) │    │ (observe)│     │
│   └──────────┘    └──────────┘    └──────────┘     │
│        ▲                               │            │
│        │                               │            │
│        └───────────────────────────────┘            │
│                   REFINE                            │
└─────────────────────────────────────────────────────┘
```

**Key:** No metrics. No pass/fail. Just **noticing** and **refining**.

---

#### 6. The Three Exercises, Reframed

##### Exercise 1: Token Budget Optimization

**What it is:** Instrument tuning.

**Old framing:** "Evaluate if slimmer protocol performs better"
**New framing:** "Prune until something breaks, then restore"

**Method: Ablation Testing**
1. Pick ONE workflow (e.g., discuss.md)
2. Delete 30% (gut-feel which 30%)
3. Use for 5 sessions
4. Notice: Did you miss anything? Did agent behave worse?
5. If no → the 30% was bloat. If yes → restore what you missed.

**This is pruning, not evaluating.**

##### Exercise 2: Log Granularity / Journalism Style

**What it is:** Developing editorial judgment.

The user's `<mandatory_requirement>` prompt analysis:

| Requirement | Challenge | Verdict |
|-------------|-----------|---------|
| (1) Journalism narrative, 0-context onboarding | Core value — the 10★ experience | ✅ Keep |
| (2) Synthesized examples for weaker agents | Hypothetical beneficiary. Reframe to "future me in 6 months" | ⚠️ Reframe |
| (3) Citations to atomic level | Reproducibility — high value | ✅ Keep |
| (4) Mermaid instead of ASCII | Rendering preference — low cost | ✅ Keep |
| (5) Backlinks with summary | Context preservation for dependency DAG | ✅ Keep |
| (6) Dependency summary | Overlaps with (5) | ⚠️ Merge |

**The Real Test:** Can I re-read this log in 6 months without friction?

**Method: 48-Hour Cold Read**
1. Write a log entry
2. Wait 48 hours
3. Read it cold (no surrounding context)
4. Ask: "Do I understand what happened and why?"
5. If yes → granularity is right. If no → note what was missing.

**This is taste development, not measurement.**

##### Exercise 3: Housekeeping Workflow Testing

**What it is:** Workflow prototyping.

**Old framing:** "Test the housekeeping workflow before deploying on 71 real logs"
**New framing:** "Sandbox prototype until it feels right"

**Method: Synthetic Workspace + Iteration**
1. Create `tests/evals/workspaces/housekeeping-sandbox/` with 15-20 synthetic logs
2. Define expected behaviors (archive completed, detect superseded, summarize for PR)
3. Run workflow, **don't measure** — instead **read output** and ask:
   - Did it do what I expected?
   - Did it miss anything obvious?
   - Did it do something unexpected (good or bad)?
4. Adjust workflow based on observations
5. Repeat

**This is prototyping, not evaluation.**

---

#### 7. The Decisions

##### DECISION-072a: Deterministic Evaluation of GSD-Lite is a Category Error

**Context:** After 43 logs pursuing evaluation architecture, we discovered that GSD-Lite sessions cannot be deterministically evaluated because:
1. No "golden truth" for correct pair programming behavior
2. The human is a confounding variable
3. Vertex trajectory metrics require golden paths; Constitution defines patterns
4. Quality is a gradient, not a binary

**Decision:** Stop pursuing deterministic evaluation pipelines.

**Consequences:**
- LOG-028 through LOG-071 evaluation architecture remains as **learning documentation**, not as roadmap
- `scripts/layer2_vertex.py`, `eval_ingest.py`, `eval_consume.py` become **optional tooling** for structural checks only
- CONSTITUTION.md remains valid as **philosophy documentation**, not as test specification

##### DECISION-072b: Reframe to "Protocol Craft"

**Context:** The user's actual goal is to become a better synthesizer/teacher, with GSD-Lite as an amplifier.

**Decision:** Rename the activity from "evaluation" to "Protocol Craft" — the deliberate practice of refining tools and methods.

**Consequences:**
- Token optimization → "Instrument tuning" via ablation
- Log granularity → "Editorial judgment" via cold-read test
- Workflow testing → "Prototyping" via sandbox iteration
- No metrics, no pass/fail, only noticing and refining

##### DECISION-072c: Practice Over Measurement

**Context:** GSD-Lite is like meditation — hard to prove it works, but practitioners report benefits.

**Decision:** Accept indirect evidence (kudos, PRs, docs) as proof. Trust the practice.

**Consequences:**
- The 71 logs ARE the evidence
- Keep practicing, keep logging, keep noticing
- Periodic pruning when it "feels right" (not on a schedule)
- Share the method via showcase portfolio, not statistical proof

---

#### 8. What CAN Be Measured (Structural Checks Only)

Despite the philosophy shift, some things are still measurable:

| Measurable | What it tells you | How to measure |
|------------|-------------------|----------------|
| Protocol compliance | Agent followed structural rules | Programmatic L1 checks |
| Handoff presence | S1-H1 satisfied | Regex for `📦 STATELESS HANDOFF` |
| Grep-before-read sequence | C3-H1 satisfied | Trajectory sequence analysis |
| Log entry presence | Something was logged | File diff |
| Token count | Budget respected | tiktoken |

**These are "structural hygiene" checks, not "quality" evaluation.**

---

#### 9. The Recommended Path Forward

| Instead of... | Do this... |
|---------------|-----------|
| Building eval pipeline | Keep using GSD-Lite (the practice matters) |
| Measuring session quality | Notice if your life is different (calmer? clearer? more capable?) |
| Proving GSD-Lite works | Curate a showcase portfolio (3-5 WORK.md excerpts + resulting PRs) |
| Statistical metrics | Track learning velocity manually: "Concept X: Day 1 confused → Day 3 can explain" |

---

#### 10. Synthesized Example: The Practice vs Measurement Distinction

**Measurement Mindset (What We Were Doing):**
```python
# Pseudo-code for evaluation pipeline
for session in sessions:
    score = evaluate(session, constitution)
    if score < threshold:
        fail("Protocol regression detected")
```

**Practice Mindset (What We Should Do):**
```
Week 1: Use GSD-Lite daily. Notice friction points.
Week 2: "The discuss workflow feels bloated." → Prune 30%.
Week 3: Use pruned version. Notice: "I miss the challenge tone prompt."
Week 4: Restore challenge tone section. Prune something else.
...iterate forever...
```

**The difference:** Measurement tries to automate judgment. Practice cultivates judgment.

---

#### 11. The Analogy That Captures It

**GSD-Lite is to pair programming what a journal is to self-reflection.**

| Journal | GSD-Lite |
|---------|----------|
| You can't "evaluate" if journaling "works" | You can't "evaluate" if GSD-Lite "works" |
| You notice: Am I clearer about my thoughts? | You notice: Can I explain things I couldn't before? |
| The entries ARE the evidence | The logs ARE the evidence |
| The practice IS the benefit | The practice IS the benefit |

---

#### 12. User Persona Synthesis (From Kudos Analysis)

To ground this decision in who the user actually is:

| Trait | Evidence from Kudos | How GSD-Lite Amplifies |
|-------|---------------------|------------------------|
| **Synthesizer** | "human Gemini", "human version of GenAI" | Agent does research heavy-lifting; user synthesizes |
| **Knowledge sharer** | "pair programming sessions", "workshops", "sharing spirit" | Logs become teaching artifacts |
| **Curious learner** | "curious, eager", "pushing the learning curve" | Agent enables faster exploration |
| **Simplifier** | Workshop presenter who distills complex to simple | Discussion mode forces articulation |
| **Dependable wall** | "sturdy reliable wall to bounce ideas off" | Logs = crystallized knowledge to draw from |

**The phrase that defines the goal:** "Sturdy reliable wall that I can always bounce ideas off of."

**GSD-Lite helps the user BE that wall for others, faster.**

---

#### 13. The Logging Standard, Revised

Based on this reflection, the `<mandatory_requirement>` prompt can be simplified:

**Original (250+ words):**
> (1) Include specific code snippet, reasoning, extended context in a journalism narrative style so that whoever with 0 context can onboard... (2) Include exact / synthesized example... for weaker reasoning agents... (3) Include citations... (4) always use mermaid... (5) backlinks with summary... (6) dependency summary...

**Revised (100 words):**
> Write this log so that **I can understand it in 6 months** without re-reading surrounding context. Include:
> - The **symptom** (what went wrong or prompted this)
> - The **evidence** (code snippet, error message, query result)
> - The **decision** (what we chose and why)
> - **Citations** (URL, file, line number — atomic reproducibility)
> - **Dependencies** (which prior logs does this build on)
> Use mermaid for diagrams. Backlink with summary when referencing other logs.

**The simplification:** Remove "weaker reasoning agents" (hypothetical beneficiary). Keep "future me" (actual beneficiary).

---

#### 14. Dependency Summary for Future Agents

To understand this log, read in this order:

1. **LOG-028** (lines 4096-4402): The original CI Framework Design — sets up the 3-layer architecture and Constitution approach
2. **LOG-067** (lines 11340-11872): Manual Scenario-Based Evaluation — the "laboratory" approach that seemed promising
3. **LOG-071** (lines 12421-12890): Vertex AI NOT Fit — the breaking point where we discovered trajectory metrics require golden paths
4. **LOG-072** (this entry): The philosophical reframe — evaluation is a category error; embrace practice over measurement

```mermaid
graph TD
    L028["LOG-028<br/>CI Framework Design<br/>(3-layer architecture)"]
    L067["LOG-067<br/>Manual Scenario Eval<br/>(Laboratory approach)"]
    L071["LOG-071<br/>Vertex NOT Fit<br/>(Golden path problem)"]
    L072["LOG-072<br/>The Evaluation Paradox<br/>(Practice > Measurement)<br/>✅ CURRENT"]
    
    L028 --> L067
    L067 --> L071
    L071 -->|"Triggered existential question"| L072
    
    subgraph "The Journey"
        J1["43 logs on evaluation"]
        J2["Multiple platform pivots"]
        J3["0% confidence"]
        J4["5 Whys analysis"]
        J5["Category error discovered"]
    end
    
    L028 --> J1
    J1 --> J2
    J2 --> J3
    J3 --> J4
    J4 --> J5
    J5 --> L072
```

---

#### 15. What This Means for the Evaluation Artifacts

| Artifact | Status | New Purpose |
|----------|--------|-------------|
| `CONSTITUTION.md` | **VALID** | Philosophy documentation, not test spec |
| `scripts/layer2_vertex.py` | **OPTIONAL** | Text quality checks only (J4-H1) |
| `scripts/eval_ingest.py` | **OPTIONAL** | Session extraction for analysis |
| `scripts/eval_consume.py` | **OPTIONAL** | Structural hygiene checks |
| `tests/evals/workspaces/` | **VALID** | Sandbox for workflow prototyping |
| `pair-programming.yaml` | **ARCHIVED** | Historical reference |

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-072 (DECISION-072a/b/c: Evaluation is category error; reframe to Protocol Craft; practice over measurement)
→ Dependency chain: LOG-072 ← LOG-071 ← LOG-067 ← LOG-028
→ Next action: Continue practicing GSD-Lite; apply Craft Cycle (design → apply → notice → refine)

**Layer 2 — Global Context:**
→ Architecture: Evaluation pursuit is COMPLETE (reframed, not abandoned)
→ Philosophy: GSD-Lite is an instrument to be tuned, not a product to be evaluated
→ Key insight: The 71 logs ARE the evidence; the kudos ARE the evaluation; the practice IS the benefit

**Fork paths:**
- Continue execution on any other task → Read relevant logs, proceed
- Token optimization → Ablation testing on discuss.md (delete 30%, use for 5 sessions, notice)
- Log granularity → Apply revised 100-word prompt, do 48-hour cold-read test
- Housekeeping workflow → Create `housekeeping-sandbox/` with synthetic logs, prototype
- Share the method → Curate 3-5 showcase excerpts for portfolio



### [LOG-073] - [DECISION] - The Lean Architecture: Single-File Protocol with Embedded Philosophy - Task: PROTOCOL-CRAFT-001

**Status:** APPROVED  
**Date:** 2026-02-17  
**Decision IDs:** DECISION-073a (Radical consolidation into gsd-lite.md), DECISION-073b (Delete redundant workflows), DECISION-073c (Grep-first artifact design), DECISION-073d (Embedded Journalism Standard)  
**Task:** PROTOCOL-CRAFT-001 (Token optimization as instrument tuning)  
**Depends On:**
- LOG-072 (lines 12904-13380): The Evaluation Paradox — reframed evaluation to Protocol Craft
- LOG-020 (lines 2757-3016): 10k token budget discovery — established the headroom constraint
- LOG-016 (lines 1410-1945): Stateless-First Architecture — the core philosophy being preserved

---

#### 1. Executive Summary: The Token Budget Problem

**The Constraint:** GSD-Lite agents should start with ~5k fixed tokens, leaving room for JIT work log context (~10-20k) and actual pair programming work (~75k+).

**The Reality (Before):**
```
gsd-lite.md alone:     6,710 tokens (exceeds 5k target)
+ one workflow:        ~1,800 tokens
+ Constitution ref:    ~5,200 tokens
= TOTAL FIXED COST:    ~13,700 tokens (2.7x over budget)
```

**The Solution:** Radical consolidation into a single `gsd-lite.md` file (~3,800 tokens) that contains ALL philosophy, with on-demand workflows for utility tasks only.

**The Philosophy Preserved:** This is instrument tuning, not feature removal. Every cut was validated against "does this preserve the pair programming experience that made me who I am?"

---

#### 2. The Token Audit (Baseline)

Source: `python scripts/token_audit.py ./src` run on 2026-02-17

| File | Tokens | % | Fate |
|------|--------|---|------|
| `agents/gsd-lite.md` | 6,710 | 18.1% | **REWRITE** → 3,800 |
| `agents/gsd-housekeeping.md` | 6,549 | 17.7% | **KEEP** (separate agent) |
| `constitution/CONSTITUTION.md` | 5,200 | 14.1% | **DELETE** (eval artifact, never used by agent) |
| `workflows/checkpoint.md` | 2,736 | 7.4% | **DELETE** (obvious behavior) |
| `workflows/new-project.md` | 2,578 | 7.0% | **KEEP** (on-demand utility) |
| `workflows/progress.md` | 2,055 | 5.6% | **DELETE** (echo-back is implicit) |
| `workflows/map-codebase.md` | 1,903 | 5.1% | **KEEP** (on-demand utility) |
| `workflows/discuss.md` | 1,774 | 4.8% | **MERGE** into gsd-lite.md |
| `workflows/execution.md` | 1,213 | 3.3% | **DELETE** (unused, all starts from discuss) |
| `references/questioning.md` | 1,272 | 3.4% | **MERGE** into gsd-lite.md |
| Template artifacts | 4,992 | 13.5% | **MINIMIZE** (grep-only, no examples) |
| **TOTAL** | **36,982** | 100% | |

**Category Breakdown (Before):**
- `agents/`: 13,259 tokens (35.9%)
- `workflows/`: 12,259 tokens (33.1%)
- `constitution/`: 5,200 tokens (14.1%)
- `template/ root`: 4,992 tokens (13.5%)
- `references/`: 1,272 tokens (3.4%)

---

#### 3. The Redundancy Analysis

**Key Discovery:** Massive content duplication across files.

| Content | Appears In | Duplicated Tokens |
|---------|-----------|-------------------|
| Questioning Philosophy | `gsd-lite.md` + `questioning.md` + `discuss.md` | ~1,500 |
| Stateless Handoff format | `gsd-lite.md` + `CONSTITUTION.md` | ~800 |
| Anti-patterns list | `gsd-lite.md` + `questioning.md` + `discuss.md` | ~300 |
| WORK.md structure | `gsd-lite.md` + template `WORK.md` | ~400 |
| Safety Protocol | `gsd-lite.md` + workflows | ~300 |
| **Total Duplication** | | **~3,300 tokens (9%)** |

**Critical Insight from User:**
> "Artifact examples in WORK.md/INBOX.md are DEAD. GSD-Lite agent strictly uses grep to read — they WILL MISS examples embedded in those files."

**Implication:** ALL examples and templates must live in `gsd-lite.md` (always loaded). Artifact templates should be minimal structure only.

---

#### 4. The Lean Architecture

##### 4.1 File Structure (After)

```
gsd-lite/template/
├── agents/
│   ├── gsd-lite.md        # ~3,800 tokens — THE ONLY INSTRUCTION FILE
│   │                      # Contains: Protocol + Discuss + Questioning + 
│   │                      #           Journalism Standard + All Examples
│   └── gsd-housekeeping.md # ~6,549 tokens — SEPARATE AGENT (unchanged)
│
├── workflows/
│   ├── new-project.md     # ~2,500 tokens — On-demand utility
│   └── map-codebase.md    # ~1,900 tokens — On-demand utility
│
├── artifacts/             # GREP-ONLY — Minimal structure, NO examples
│   ├── WORK.md            # ~200 tokens — Section headers only
│   ├── INBOX.md           # ~100 tokens — Minimal structure
│   ├── PROJECT.md         # ~100 tokens — Blank template
│   ├── ARCHITECTURE.md    # ~100 tokens — Blank template
│   └── HISTORY.md         # ~50 tokens — Blank template
│
└── [DELETED]
    ├── constitution/      # Eval artifact, never used
    ├── references/        # Merged into gsd-lite.md
    ├── discuss.md         # Merged into gsd-lite.md
    ├── execution.md       # Unused (all starts from discuss)
    ├── checkpoint.md      # Obvious behavior
    └── progress.md        # Echo-back is implicit
```

##### 4.2 Token Budget (After)

| Component | Before | After | Δ |
|-----------|--------|-------|---|
| `gsd-lite.md` | 6,710 | 3,800 | -2,910 |
| `CONSTITUTION.md` | 5,200 | 0 | -5,200 |
| `discuss.md` | 1,774 | 0 | -1,774 (merged) |
| `execution.md` | 1,213 | 0 | -1,213 |
| `checkpoint.md` | 2,736 | 0 | -2,736 |
| `progress.md` | 2,055 | 0 | -2,055 |
| `questioning.md` | 1,272 | 0 | -1,272 (merged) |
| Artifact templates | 4,992 | 550 | -4,442 |
| **Fixed cost** | ~13,700 | ~3,800 | **-9,900 (72% reduction)** |

##### 4.3 New Budget Model

| Phase | Tokens | Notes |
|-------|--------|-------|
| **Fixed cost** | ~3,800 | `gsd-lite.md` only |
| **On-demand** | ~4,400 | `new-project.md` OR `map-codebase.md` (rarely both) |
| **JIT context** | ~10-20k | 1-3 log entries via grep-first |
| **Work budget** | ~76-86k | Actual pair programming (100k context assumed) |

**Target achieved:** 3,800 < 5,000 ✅

---

#### 5. The `gsd-lite.md` Structure (Single Source of Truth)

The consolidated file has 12 sections, each with a specific purpose:

```markdown
# GSD-Lite Protocol

## 1. Safety Protocol (CRITICAL)                    [~200 tokens]
   - Never overwrite existing artifacts with templates
   - Check → Read → Append/Update → Preserve

## 2. Universal Onboarding                          [~300 tokens]
   - 4 steps: PROTOCOL → PROJECT → ARCH → WORK
   - Echo-back is implicit (agent proves understanding)

## 3. Workflow Router                               [~150 tokens]
   - Table only: discuss (default), new-project, map-codebase
   - No prose explanation

## 4. File Guide                                    [~100 tokens]
   - Table of artifacts and their purpose
   - Write targets for each

## 5. Grep-First Strategy                           [~200 tokens]
   - Two-step pattern: discover → surgical read
   - Common boundary patterns
   - No verbose examples

## 6. Golden Rules                                  [~100 tokens]
   - 6 rules, one line each
   - No elaboration

## 7. The Pair Programming Model (CORE)             [~800 tokens]
   - Merged from discuss.md
   - First Turn Protocol
   - Modes: Vision Exploration, Teaching, Unblocking, Plan Presentation
   - Artifact Write Protocol (ask before write)
   - Scope Discipline

## 8. Questioning Philosophy (CORE)                 [~600 tokens]
   - Merged from questioning.md
   - Why Before How (the golden rule)
   - Challenge Tone Protocol (table form)
   - Question Types (compact)
   - Teaching Detour
   - Anti-patterns (single list, no duplication)

## 9. Stateless Handoff (CORE)                      [~400 tokens]
   - Two-layer structure explanation
   - ONE canonical format (copy-paste ready)
   - 3 variations: mid-discussion, post-decision, first turn
   - Single source of truth (no duplication in Constitution)

## 10. The Journalism Standard (CORE)               [~500 tokens]
    - User's <mandatory_requirement> EMBEDDED
    - 6 requirements with rationale
    - Log Entry Template (copy-paste ready)
    - The test: "Can I understand this in 6 months?"

## 11. WORK.md Structure Reference                  [~300 tokens]
    - Section 1/2/3 purpose (what each is FOR)
    - When to read/write each
    - Grep patterns for discovery
    - NOT templates (those are in Section 10)

## 12. Constitutional Behaviors (Non-Negotiable)    [~150 tokens]
    - Compact table of hardcoded rules
    - S1-H1: Stateless handoff required
    - P2-H1: Why before how
    - P2-H2: Ask before writing
    - P2-H5: Echo findings before proposing
    - C3-H1: Grep before read
    - J4-H1: Journalism standard

TOTAL: ~3,800 tokens
```

---

#### 6. The Journalism Standard (Embedded Forever)

This is the user's `<mandatory_requirement>` — now embedded in `gsd-lite.md` Section 10. The user never needs to paste it again.

**The Standard:**

When writing log entries, ALWAYS include:

| # | Requirement | Rationale |
|---|-------------|-----------|
| 1 | **Narrative context** | Zero-context reader can onboard. Journalism style. |
| 2 | **Code snippets** | Actual code with file paths, not descriptions. |
| 3 | **Synthesized examples** | You can re-read in 6 months without friction. |
| 4 | **Citations** | URL, file:line, commit hash. Atomic reproducibility. |
| 5 | **Mermaid diagrams** | Never ASCII art. Renders properly in reader. |
| 6 | **Dependency summary** | Which prior logs this builds on (for DAG construction). |

**The Test:** Can someone reproduce this decision with ZERO additional research?

**The Template:**
```markdown
### [LOG-NNN] - [TYPE] - {{summary}} - Task: TASK-ID
**Timestamp:** YYYY-MM-DD
**Depends On:** LOG-XXX (context), LOG-YYY (context)

---

#### 1. {{Section Title}}

{{Narrative with code snippets, citations, mermaid diagrams}}

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-NNN (brief)
→ Dependency chain: LOG-NNN ← LOG-XXX ← LOG-YYY
→ Next action: {{specific}}

**Layer 2 — Global Context:**
→ Key decisions: {{from Key Events Index}}

**Fork paths:**
- Continue → {{logs}}
- Discuss → {{logs}}
```

---

#### 7. Why Each File Was Deleted

| File | Tokens | Deletion Rationale |
|------|--------|-------------------|
| `CONSTITUTION.md` | 5,200 | **Eval artifact.** Created for CI testing (LOG-028), never loaded by agent. Constitutional behaviors now in `gsd-lite.md` Section 12 as compact table (~150 tokens). |
| `discuss.md` | 1,774 | **Merged.** User confirmed: "all actions come from discuss first." Content now in `gsd-lite.md` Section 7. |
| `execution.md` | 1,213 | **Unused.** User confirmed: "I have never used execution workflow." Discuss covers everything. |
| `checkpoint.md` | 2,736 | **Obvious behavior.** Checkpointing is "update WORK.md Current Understanding" — doesn't need 370 lines of instruction. |
| `progress.md` | 2,055 | **Obvious behavior.** Echo-back is implicit in Universal Onboarding. Agent proves understanding on first turn. |
| `questioning.md` | 1,272 | **Merged.** Reference file never loaded independently. Content now in `gsd-lite.md` Section 8. |

**Total deleted:** 14,250 tokens

---

#### 8. The Grep-First Constraint on Artifacts

**Critical Design Rule:** Examples in artifact templates (WORK.md, INBOX.md) are invisible to GSD-Lite agents.

**Why:**
1. GSD-Lite agents use grep-first strategy
2. `grep "^## " WORK.md` returns section headers
3. Agent reads Section 1 (Current Understanding) surgically
4. Agent NEVER reads example log entries buried in the template
5. Therefore, examples in WORK.md are dead weight

**Implication:**
- ALL examples must live in `gsd-lite.md` (always loaded)
- Artifact templates should be **minimal structure only**
- No sample log entries, no example loops, no demonstration content

**Before (WORK.md template):** ~2,489 tokens with examples
**After (WORK.md template):** ~200 tokens — section headers + minimal fields

---

#### 9. The Decisions

##### DECISION-073a: Radical Consolidation into `gsd-lite.md`

**Context:** Token audit revealed 36,982 tokens across 15 files, with ~3,300 tokens duplicated. Fixed cost was 2.7x over the 5k target.

**Decision:** Consolidate ALL philosophy into a single `gsd-lite.md` file (~3,800 tokens) with 12 sections covering Protocol, Discuss, Questioning, Journalism, and Handoff.

**Consequences:**
- One file to maintain, one source of truth
- No "load this reference" instructions that may be skipped
- Philosophy is ALWAYS in context

##### DECISION-073b: Delete Redundant Workflows

**Context:** User confirmed `execution.md` is unused ("all starts from discuss"), and `checkpoint.md`/`progress.md` describe obvious behaviors.

**Decision:** Delete `execution.md`, `checkpoint.md`, `progress.md`, and `questioning.md`. Keep only `new-project.md` and `map-codebase.md` as on-demand utilities.

**Consequences:**
- 7,276 tokens removed from workflows/
- Core philosophy lives in `gsd-lite.md`, not scattered across files

##### DECISION-073c: Grep-First Artifact Design

**Context:** GSD-Lite agents grep artifacts, not read them fully. Examples embedded in WORK.md are invisible.

**Decision:** Artifact templates contain **minimal structure only**. All examples and templates live in `gsd-lite.md` (always loaded).

**Consequences:**
- WORK.md template: ~200 tokens (down from 2,489)
- INBOX.md template: ~100 tokens (down from 1,370)
- Examples live where they're visible: `gsd-lite.md` Section 9 & 10

##### DECISION-073d: Embedded Journalism Standard

**Context:** User repeatedly pastes `<mandatory_requirement>` prompt when requesting logs. This is friction and token waste.

**Decision:** Embed the Journalism Standard permanently in `gsd-lite.md` Section 10. User never pastes the requirement again.

**Consequences:**
- ~500 tokens added to `gsd-lite.md` (permanent)
- ~250 tokens saved per log request (amortized)
- Consistent log quality without prompting

---

#### 10. Architecture Diagram

```mermaid
graph TD
    subgraph "ALWAYS LOADED (~3,800 tokens)"
        GSD["gsd-lite.md<br/>─────────────<br/>§1 Safety Protocol<br/>§2 Universal Onboarding<br/>§3 Workflow Router<br/>§4 File Guide<br/>§5 Grep-First Strategy<br/>§6 Golden Rules<br/>§7 Pair Programming Model<br/>§8 Questioning Philosophy<br/>§9 Stateless Handoff<br/>§10 Journalism Standard<br/>§11 WORK.md Reference<br/>§12 Constitutional Behaviors"]
    end
    
    subgraph "ON-DEMAND (~4,400 tokens)"
        NP["new-project.md<br/>~2,500 tokens"]
        MC["map-codebase.md<br/>~1,900 tokens"]
    end
    
    subgraph "GREP-ONLY (~550 tokens)"
        WORK["WORK.md<br/>~200 tokens<br/>(structure only)"]
        INBOX["INBOX.md<br/>~100 tokens"]
        PROJ["PROJECT.md<br/>~100 tokens"]
        ARCH["ARCHITECTURE.md<br/>~100 tokens"]
        HIST["HISTORY.md<br/>~50 tokens"]
    end
    
    subgraph "SEPARATE AGENT"
        HK["gsd-housekeeping.md<br/>~6,549 tokens<br/>(own context)"]
    end
    
    subgraph "DELETED"
        DEL1["constitution/"]
        DEL2["discuss.md"]
        DEL3["execution.md"]
        DEL4["checkpoint.md"]
        DEL5["progress.md"]
        DEL6["questioning.md"]
    end
    
    GSD -->|"routes to"| NP
    GSD -->|"routes to"| MC
    GSD -->|"greps"| WORK
    GSD -->|"greps"| INBOX
```

---

#### 11. How to Use This Log for Future Protocol Craft

This log is the **authoritative reference** for GSD-Lite's architecture. When iterating:

##### 11.1 To Understand Current State
1. Read Section 5 (token audit) for baseline
2. Read Section 6 (structure) for what's in `gsd-lite.md`
3. Read Section 7 (deletion rationale) for why files were removed

##### 11.2 To Make Changes (Craft Cycle)
```
DESIGN:  "I want to trim Section 8 (Questioning)"
APPLY:   Edit gsd-lite.md, delete 30% of Section 8
NOTICE:  Use for 5 sessions — did I miss anything?
REFINE:  Restore what I missed, or cut more
```

##### 11.3 To Measure Impact
```bash
# Run token audit after changes
python scripts/token_audit.py ./src

# Compare against baseline (LOG-073, Section 5)
# Target: gsd-lite.md < 5,000 tokens
```

##### 11.4 To Add New Philosophy
1. Identify which section it belongs to (§1-12)
2. Add to that section in `gsd-lite.md`
3. Update token count in this log (or create LOG-074 for major changes)
4. Delete any duplicate content elsewhere

---

#### 12. Implementation Checklist

| Task | Status | Notes |
|------|--------|-------|
| Rewrite `gsd-lite.md` to 12-section structure | ⬜ TODO | Target: ~3,800 tokens |
| Merge `discuss.md` content into §7 | ⬜ TODO | Pair Programming Model |
| Merge `questioning.md` content into §8 | ⬜ TODO | Questioning Philosophy |
| Embed Journalism Standard in §10 | ⬜ TODO | Copy-paste template included |
| Delete `CONSTITUTION.md` | ⬜ TODO | Eval artifact, unused |
| Delete `execution.md` | ⬜ TODO | Unused |
| Delete `checkpoint.md` | ⬜ TODO | Obvious behavior |
| Delete `progress.md` | ⬜ TODO | Obvious behavior |
| Delete `questioning.md` | ⬜ TODO | After merge |
| Minimize artifact templates | ⬜ TODO | Structure only, no examples |
| Run token audit to verify | ⬜ TODO | Target: < 5,000 total fixed |

---

#### 13. Dependency Summary for Future Agents

To understand this architectural decision:

1. **LOG-072** (lines 12904-13380): The Evaluation Paradox — why we reframed to Protocol Craft
2. **LOG-020** (lines 2757-3016): 10k token budget — the constraint driving this optimization
3. **LOG-016** (lines 1410-1945): Stateless-First Architecture — the core philosophy being preserved
4. **LOG-073** (this entry): The authoritative architecture reference

```mermaid
graph TD
    L016["LOG-016<br/>Stateless-First<br/>(Philosophy)"]
    L020["LOG-020<br/>10k Token Budget<br/>(Constraint)"]
    L072["LOG-072<br/>Evaluation Paradox<br/>(Reframe to Craft)"]
    L073["LOG-073<br/>Lean Architecture<br/>(Implementation)<br/>✅ CURRENT"]
    
    L016 -->|"Philosophy to preserve"| L073
    L020 -->|"Constraint to satisfy"| L073
    L072 -->|"Reframe enables"| L073
```

---

#### 14. The Philosophy This Preserves

Despite 72% token reduction, the core GSD-Lite experience remains:

| Philosophy | How It's Preserved |
|------------|-------------------|
| **Stateless-First** | §9 contains canonical handoff format + variations |
| **Pair Programming** | §7 contains full discuss workflow (Vision, Teaching, Unblocking, Plans) |
| **Why Before How** | §8 contains Challenge Tone Protocol + question types |
| **Journalism Quality** | §10 contains embedded standard + copy-paste template |
| **Grep-First Context** | §5 contains patterns; §11 explains WORK.md structure |
| **User Owns Completion** | §6 Golden Rules; §7 Artifact Write Protocol |

**The test:** Can the user still have the 10★ distillation experience? Yes — all philosophy is in `gsd-lite.md`, always loaded, always available.

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-073 (DECISION-073a/b/c/d: Lean architecture with radical consolidation)
→ Dependency chain: LOG-073 ← LOG-072 ← LOG-020 ← LOG-016
→ Next action: Implement the 12-section `gsd-lite.md` rewrite (see Section 12 checklist)

**Layer 2 — Global Context:**
→ Architecture: Single-file protocol (`gsd-lite.md` ~3,800 tokens) + 2 on-demand workflows
→ Philosophy: Protocol Craft — tune the instrument via ablation, not evaluation
→ Key constraint: Fixed cost < 5,000 tokens; JIT budget ~10-20k; work budget ~75k+

**Fork paths:**
- Implement rewrite → Start with §1-6 (low-risk sections), then §7-10 (core philosophy)
- Discuss changes → Challenge any deletion rationale in Section 7
- Different scope → Address other tasks; this decision is complete
- Future craft iteration → Reference this log as baseline; create LOG-074 for major changes



### [LOG-074] - [PROCEDURE] - The Protocol Craft Retro: A Maintenance Workflow for Tuning GSD-Lite - Task: PROTOCOL-CRAFT-002

**Status:** CRYSTALLIZED  
**Date:** 2026-02-17  
**Task:** PROTOCOL-CRAFT-002 (Capture the retro workflow as repeatable procedure)  
**Depends On:**
- LOG-072 (lines 12904-13380): The Evaluation Paradox — established "Protocol Craft" as the frame
- LOG-073 (lines 13395-13850): The Lean Architecture — the baseline to measure against

---

#### 1. Executive Summary: Why This Procedure Exists

This session (2026-02-17) produced a breakthrough: after 71 logs pursuing evaluation, we discovered that GSD-Lite cannot be measured, only practiced. The conversation that led to this insight followed a specific pattern that should be repeatable.

**The Guitar Tuning Analogy:**
- You don't "evaluate" if your guitar is good
- You **tune** it periodically when it sounds off
- You develop **taste** for what sounds right
- This log is the tuning procedure

**When to run this retro:**
- Confidence in GSD-Lite drops ("is this even helping?")
- Token budget feels bloated ("too much overhead")
- Logs feel stale ("am I capturing the right things?")
- Major protocol changes planned ("should we restructure?")

---

#### 2. The Protocol Craft Retro Workflow

```mermaid
flowchart TD
    subgraph "PHASE 1: Ground the Conversation"
        A1["1. State your confidence level<br/>(0-100%)"] --> A2["2. Articulate what's bothering you<br/>(vague is okay)"]
        A2 --> A3["3. Request critical thinking partner<br/>(not agreeable agent)"]
    end
    
    subgraph "PHASE 2: Apply 5 Whys"
        B1["4. Agent asks: Why do you want X?"] --> B2["5. You answer honestly"]
        B2 --> B3["6. Agent challenges: But why that?"]
        B3 --> B4["7. Repeat until root goal emerges"]
        B4 --> B5["8. Agent echoes back the real WHY"]
    end
    
    subgraph "PHASE 3: Ground in Evidence"
        C1["9. Review session transcripts<br/>(eval_run_*.json)"] --> C2["10. Review external evidence<br/>(kudos, PRs, docs)"]
        C2 --> C3["11. Agent synthesizes patterns"]
    end
    
    subgraph "PHASE 4: Reframe & Decide"
        D1["12. Agent proposes reframe<br/>(if original goal was misguided)"] --> D2["13. Identify what CAN be done<br/>(vs what's a pipe dream)"]
        D2 --> D3["14. Make decisions with IDs"]
    end
    
    subgraph "PHASE 5: Capture & Baseline"
        E1["15. Run token audit<br/>(python scripts/token_audit.py)"] --> E2["16. Log the architecture<br/>(current state as baseline)"]
        E2 --> E3["17. Create implementation checklist"]
    end
    
    A3 --> B1
    B5 --> C1
    C3 --> D1
    D3 --> E1
```

---

#### 3. Phase 1: Ground the Conversation

**Purpose:** Set the stage for honest critical dialogue.

##### Step 1: State Your Confidence Level

Be explicit about where you are:

```
"Right now my confidence with [aspect of GSD-Lite] is [0-100%]."
```

**Example from this session:**
> "Right now my confidence with our evaluation exercise with this whole set up is 0."

##### Step 2: Articulate What's Bothering You

Dump your thoughts — vague is okay. The agent will help sharpen:

```
"I want to [goal] so that [reason]. But I don't know if [uncertainty]."
```

**Example from this session:**
> "I want to evaluate the agent so that I can measure session quality over iterations. So that I can improve. Otherwise we cannot improve what we cannot measure."

##### Step 3: Request Critical Thinking Partner

Explicitly ask for challenge, not agreement:

```
"I need you to put on your critical thinking hat. You are a thinking 
partner, not a people pleaser. I do not want you to agree blindly to 
my requests/thoughts without verifying the logic is sound. Logic should 
trump all, even my preferences."
```

**Why this matters:** Without this framing, agents default to agreeable mode. The breakthrough came from direct challenge ("this is impossible" with concrete reasoning).

---

#### 4. Phase 2: Apply 5 Whys

**Purpose:** Unearth the real goal beneath the stated goal.

##### The Pattern

| Turn | Agent | You |
|------|-------|-----|
| 1 | "Why do you want to [stated goal]?" | [Your reason] |
| 2 | "Why is [that reason] important?" | [Deeper reason] |
| 3 | "Why does [deeper reason] matter?" | [Even deeper] |
| 4 | "Why is [that] your priority?" | [Root motivation] |
| 5 | "So the real goal is [X], not [original stated goal]?" | "Yes" / "Actually..." |

##### Example from This Session

| Why # | Question | Answer |
|-------|----------|--------|
| 1 | Why evaluate? | To know if changes helped |
| 2 | Why know if changes helped? | To improve |
| 3 | Why improve? | To learn faster, ship better, be the reliable wall |
| 4 | Why those outcomes? | They're my professional identity and joy |
| 5 | **Root:** | "I want to be the best version of the 'reliable wall' for my team" |

**The Reframe:** Original goal was "evaluate GSD-Lite." Real goal was "become a better synthesizer." Evaluation was a means to an imagined end — but the means was a category error.

---

#### 5. Phase 3: Ground in Evidence

**Purpose:** Move from feelings to facts.

##### Step 9: Review Session Transcripts

Point the agent at your actual usage data:

```
"Here are my session transcripts: eval_run_2026-02-15_2121.json 
and eval_run_2026-02-15_2116.json. Skim them to infer my typical 
interaction patterns with GSD-Lite."
```

**What the agent looks for:**
- Interaction patterns (research delegation, fork & redirect, echo verification)
- Frequency of different modes (discuss vs execute)
- What you actually ask for vs what you think you ask for

##### Step 10: Review External Evidence

Provide evidence of outcomes:

```
"Here are my kudos from colleagues since I started using GSD-Lite 
in Jan 2026. Infer what you can about outcomes."
```

**What the agent looks for:**
- Before/after comparison (if timeline available)
- Traits others notice ("human version of GenAI", "reliable wall")
- Correlation (not causation) with GSD-Lite usage

##### Step 11: Agent Synthesizes Patterns

The agent should produce a table like:

| Your Trait | Evidence | How GSD-Lite Might Amplify |
|------------|----------|---------------------------|
| Synthesizer | "human Gemini" | Agent does research; you synthesize |
| Knowledge sharer | Workshops, pair sessions | Logs become teaching artifacts |
| Curious learner | "pushing the learning curve" | Agent enables faster exploration |

---

#### 6. Phase 4: Reframe & Decide

**Purpose:** Transform insight into actionable decisions.

##### Step 12: Agent Proposes Reframe

If the original goal was misguided, the agent should say so directly:

```
"Your original question was [X]. But based on the 5 Whys and evidence, 
I believe the real question is [Y]. Here's why [X] is a category error..."
```

**Example from this session:**
> "You're at 0% confidence because you're asking the wrong question.
> Wrong question: 'Can I measure if GSD-Lite makes sessions better?'
> Right question: 'What specific, measurable behaviors do I care about, and are they happening?'"

##### Step 13: Identify What CAN Be Done

Separate achievable from pipe dream:

| Goal | Achievable? | Method |
|------|-------------|--------|
| Measure session quality | ❌ Pipe dream | Human is confounding variable |
| Check structural compliance | ✅ Yes | Programmatic L1 checks |
| Track learning velocity | ✅ Yes | Manual log: "Day 1 confused → Day 3 can explain" |
| Prove GSD-Lite works | ❌ Pipe dream | Attribution problem |
| Notice if life is different | ✅ Yes | Periodic reflection |

##### Step 14: Make Decisions with IDs

Formalize insights as numbered decisions:

```
DECISION-XXXa: [What we decided]
- Context: [Why this decision was needed]
- Rationale: [The reasoning]
- Consequences: [What changes]
```

---

#### 7. Phase 5: Capture & Baseline

**Purpose:** Create a reference point for future iterations.

##### Step 15: Run Token Audit

```bash
python scripts/token_audit.py ./src
```

Capture the output in the log. This becomes the baseline for measuring future changes.

##### Step 16: Log the Architecture

Create a log entry (like LOG-073) that captures:
- Current file structure with token counts
- Reasoning behind each component
- What to keep vs what to cut
- How components relate to each other

**This log becomes the authoritative reference** — anyone (including future you) can read it and understand the current state.

##### Step 17: Create Implementation Checklist

If changes are needed, create a concrete TODO:

```markdown
| Task | Status | Notes |
|------|--------|-------|
| Rewrite gsd-lite.md | ⬜ TODO | Target: ~3,800 tokens |
| Delete CONSTITUTION.md | ⬜ TODO | Eval artifact, unused |
| ...etc | | |
```

---

#### 8. The Retro Checklist (Copy-Paste Ready)

Use this checklist when running the retro:

```markdown
## Protocol Craft Retro Checklist

### Phase 1: Ground the Conversation
- [ ] State confidence level (0-100%)
- [ ] Articulate what's bothering you (vague is okay)
- [ ] Request critical thinking partner explicitly

### Phase 2: Apply 5 Whys
- [ ] Agent asks "why" at least 5 times
- [ ] Root goal identified and echoed back
- [ ] Check: Is original goal actually serving root goal?

### Phase 3: Ground in Evidence
- [ ] Review session transcripts (eval_run_*.json)
- [ ] Review external evidence (kudos, PRs, outcomes)
- [ ] Agent synthesizes interaction patterns

### Phase 4: Reframe & Decide
- [ ] Agent proposes reframe if needed
- [ ] Separate achievable from pipe dream
- [ ] Make decisions with DECISION-XXX IDs

### Phase 5: Capture & Baseline
- [ ] Run token audit: `python scripts/token_audit.py ./src`
- [ ] Log architecture as authoritative reference
- [ ] Create implementation checklist if changes needed

### Output Artifacts
- [ ] Philosophy log (like LOG-072) — the reframe
- [ ] Architecture log (like LOG-073) — the baseline
- [ ] Procedure log (like LOG-074) — the workflow itself
```

---

#### 9. When NOT to Run This Retro

This is a heavy process. Don't overuse it.

**Skip the retro if:**
- You just want to make a small tweak (use Craft Cycle instead)
- Confidence is high and things are working
- You're procrastinating on actual work
- Less than 20 logs since last retro

**The Craft Cycle (for small changes):**
```
DESIGN (change) → APPLY (use 5 sessions) → NOTICE (what broke?) → REFINE
```

**The Retro (for existential questions):**
```
Ground → 5 Whys → Evidence → Reframe → Baseline
```

---

#### 10. Example Prompts That Triggered This Session

For reference, here are the actual prompts that initiated this retro:

##### Opening Prompt (Confidence + Critical Partner Request)
```
log-071 i need you to put on your critical thinking hat. 
you are a thinking partner, not a people pleaser. I do not want you 
to agree blindly to my requests / thoughts without verifying the logic 
is sound. Logic should trump all even my preferences. 

based on our vision what is the real WHY that we have documented re: 
being able to evaluate the gsd-lite agent and the artifacts and the 
protocols? Please do recommend to write this down if this has not been 
articulated. Do use the 5 whys technique on me.
```

##### The Honest Dump (Vague Concerns Made Explicit)
```
Right now my confidence with our evaluation exercise with this whole 
set up is 0. I want to put the framework the limitations behind for a 
moment and really have a thinking partner that help walk me thru, is 
the end goal of evaluation a pipe dream or not...
```

##### The Evidence Request
```
so i exported transcripts in eval_run_2026-02-15_2121.json... 
Our company do have a public appreciation channel and I'm Ken here's 
all the extracted posts if you want to infer...
```

##### The Acceptance + Pivot
```
I am onboard of practicing this instead of evaluating. Now what would 
you call these exercises then if not at the goal of improving gsd-lite?
```

##### The Token Optimization Request
```
okay let's think about how to optimize the tokens - based on the 
reflection so far and this report how big the gsd source code prompts 
are what would you recommend trimming...
```

---

#### 11. The Session Arc (What Happened)

For future reference, here's the arc of this session:

```mermaid
graph TD
    subgraph "Hour 1: The Crisis"
        A["0% confidence<br/>'Is evaluation a pipe dream?'"]
        B["5 Whys applied<br/>Root: 'Be the reliable wall'"]
        C["Category error discovered<br/>Measurement ≠ Practice"]
    end
    
    subgraph "Hour 2: The Reframe"
        D["LOG-072: Evaluation Paradox<br/>Practice > Measurement"]
        E["Protocol Craft introduced<br/>Tune, don't grade"]
        F["3 exercises reframed<br/>Ablation, Cold-read, Sandbox"]
    end
    
    subgraph "Hour 3: The Architecture"
        G["Token audit reviewed<br/>36,982 tokens identified"]
        H["Redundancy mapped<br/>~3,300 duplicated"]
        I["LOG-073: Lean Architecture<br/>3,800 token target"]
    end
    
    subgraph "Hour 4: The Capture"
        J["LOG-074: This procedure<br/>Repeatable workflow"]
    end
    
    A --> B --> C --> D --> E --> F --> G --> H --> I --> J
```

---

#### 12. The Artifacts Produced

| Artifact | Purpose | Reference |
|----------|---------|-----------|
| **LOG-072** | Philosophy — why evaluation is a category error | Lines 12904-13380 |
| **LOG-073** | Architecture — current state baseline with token counts | Lines 13395-13850 |
| **LOG-074** | Procedure — this retro workflow (the guitar tuning guide) | This entry |

**Together, these three logs form the "Protocol Craft Toolkit":**
- LOG-072 tells you **WHY** (the philosophy)
- LOG-073 tells you **WHAT** (the current state)
- LOG-074 tells you **HOW** (the procedure)

---

#### 13. Dependency Summary for Future Agents

To understand and run this retro:

1. **LOG-072** (lines 12904-13380): The Evaluation Paradox — read this first to understand why we do Protocol Craft instead of evaluation
2. **LOG-073** (lines 13395-13850): The Lean Architecture — the baseline you're measuring against
3. **LOG-074** (this entry): The procedure itself

```mermaid
graph TD
    L072["LOG-072<br/>The Evaluation Paradox<br/>(WHY: Philosophy)"]
    L073["LOG-073<br/>The Lean Architecture<br/>(WHAT: Baseline)"]
    L074["LOG-074<br/>The Retro Procedure<br/>(HOW: Workflow)<br/>✅ CURRENT"]
    
    L072 -->|"Establishes frame"| L074
    L073 -->|"Provides baseline"| L074
    
    subgraph "Protocol Craft Toolkit"
        L072
        L073
        L074
    end
```

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-074 (Protocol Craft Retro procedure captured)
→ Dependency chain: LOG-074 ← LOG-073 ← LOG-072
→ Next action: Fork to implement LOG-073 checklist (gsd-lite.md rewrite)

**Layer 2 — Global Context:**
→ Architecture: Protocol Craft Toolkit complete (LOG-072 + LOG-073 + LOG-074)
→ Philosophy: Tune the instrument via retro, don't grade it via evaluation
→ Key artifacts: LOG-073 is architecture baseline; LOG-074 is tuning procedure

**Fork paths:**
- Implement architecture → Reference LOG-073 Section 12 checklist
- Run future retro → Follow LOG-074 Phase 1-5 workflow
- Continue other work → Protocol Craft Toolkit is complete
- Share the method → LOG-072/073/074 form a teachable package

---

### [LOG-075] - [EXEC] - Template Minimization: 90% Token Reduction on Artifact Templates - Task: PROTOCOL-CRAFT-001

**Status:** COMPLETE  
**Date:** 2026-02-17  
**Task:** PROTOCOL-CRAFT-001 (The Lean Architecture)  
**Depends On:**
- LOG-073 (lines 13373-13876): The Lean Architecture decision — established DECISION-073c (grep-first artifact design, NO examples in templates)

---

#### 1. What Was Done

Implemented DECISION-073c by stripping all examples from the five artifact templates in `src/gsd_lite/template/`. Templates now contain structure only — agents discover patterns from actual work logs via grep-first reading.

**Files Modified:**
- `src/gsd_lite/template/WORK.md` — Reduced to section headers + empty XML tags
- `src/gsd_lite/template/PROJECT.md` — Reduced to section headers only
- `src/gsd_lite/template/INBOX.md` — Reduced to two section headers
- `src/gsd_lite/template/HISTORY.md` — Reduced to table header only
- `src/gsd_lite/template/ARCHITECTURE.md` — Reduced to section headers only

---

#### 2. Token Audit Results

**Before (Estimated from LOG-073):**
| File | Tokens |
|------|--------|
| WORK.md (with examples) | ~1,200 |
| PROJECT.md (with examples) | ~450 |
| INBOX.md (with examples) | ~600 |
| HISTORY.md (with examples) | ~150 |
| ARCHITECTURE.md (with examples) | ~400 |
| **Total Templates** | **~2,800** |

**After (Actual from `python scripts/token_audit.py ./src`):**
| File | Tokens | Reduction |
|------|--------|-----------|
| WORK.md | 117 | 90% |
| PROJECT.md | 42 | 91% |
| INBOX.md | 17 | 97% |
| HISTORY.md | 30 | 80% |
| ARCHITECTURE.md | 36 | 91% |
| **Total Templates** | **242** | **91%** |

---

#### 3. Full Token Audit Snapshot (2026-02-17)

```
==============================================================================
GSD-LITE TOKEN AUDIT REPORT
==============================================================================
Directory: /Users/luutuankiet/dev/gsd_lite/src
Files scanned: 9
Total tokens: 13,686

------------------------------------------------------------------------------
File                                          Tokens   % Total   Loaded When
------------------------------------------------------------------------------
gsd-lite.md (agent instruction)                2,414     17.6%   Always
gsd-housekeeping.md                            6,549     47.9%   Housekeeping only
new-project.md                                 2,578     18.8%   New project only
map-codebase.md                                1,903     13.9%   Map codebase only
WORK.md (template)                               117      0.9%   Never (scaffolded)
PROJECT.md (template)                             42      0.3%   Never (scaffolded)
ARCHITECTURE.md (template)                        36      0.3%   Never (scaffolded)
HISTORY.md (template)                             30      0.2%   Never (scaffolded)
INBOX.md (template)                               17      0.1%   Never (scaffolded)
------------------------------------------------------------------------------

CATEGORY BREAKDOWN:
  agents/      8,963 tokens (2 files)   65.5%
  workflows/   4,481 tokens (2 files)   32.7%
  templates/     242 tokens (5 files)    1.8%
```

---

#### 4. Architecture Verification

**Fixed cost per session: 2,414 tokens** (gsd-lite.md only)

| Budget Item | Tokens | Status |
|-------------|--------|--------|
| Target (LOG-073) | <5,000 | ✅ |
| Actual (gsd-lite.md) | 2,414 | ✅ **51% under budget** |
| Headroom for JIT logs | ~7,500 | Available |
| Work budget | ~80,000+ | Available |

**On-demand workflows (loaded only when invoked):**
- `new-project.md`: 2,578 tokens
- `map-codebase.md`: 1,903 tokens
- `gsd-housekeeping.md`: 6,549 tokens (candidate for future trimming)

---

#### 5. Design Rationale: Why No Examples in Templates

**The Grep-First Principle:**
- Agents discover patterns by reading actual work logs, not template examples
- Examples in templates are never read — agents grep for `^### \[LOG-` to find real entries
- Templates are scaffolding, not documentation

**Token Conservation:**
- Every token in templates is wasted if agents don't read them
- Real documentation lives in `gsd-lite.md` (the agent instruction)
- Workflows provide context when needed (JIT loading)

**Clarity:**
- Empty templates signal "fill this in" rather than "copy this pattern"
- Real examples emerge organically from the user's actual work

---

#### 6. Remaining Items from LOG-073 Checklist

| Item | Status |
|------|--------|
| ✅ Minimize artifact templates (structure only, no examples) | **DONE (this log)** |
| ✅ Merge workflows into gsd-lite.md | Done prior to this session |
| ✅ Delete: CONSTITUTION.md, execution.md, checkpoint.md, progress.md, questioning.md | Done prior to this session |
| ⏳ Run token audit to verify < 5,000 fixed cost | **DONE: 2,414 tokens** |
| 🔮 Future: Audit gsd-housekeeping.md (6,549 tokens) | Optional craft cycle |

---

#### 7. Dependency Summary

```mermaid
graph TD
    L073["LOG-073<br/>The Lean Architecture<br/>(DECISION-073c: grep-first design)"]
    L075["LOG-075<br/>Template Minimization<br/>(Implementation)<br/>✅ CURRENT"]
    
    L073 -->|"Established principle"| L075
    
    subgraph "Artifacts Modified"
        W["WORK.md<br/>117 tokens"]
        P["PROJECT.md<br/>42 tokens"]
        I["INBOX.md<br/>17 tokens"]
        H["HISTORY.md<br/>30 tokens"]
        A["ARCHITECTURE.md<br/>36 tokens"]
    end
    
    L075 --> W
    L075 --> P
    L075 --> I
    L075 --> H
    L075 --> A
```

---

📦 STATELESS HANDOFF

**Layer 1 — Local Context:**
→ Last action: LOG-075 (Template minimization complete)
→ Dependency chain: LOG-075 ← LOG-073 ← LOG-072
→ Results: 91% reduction in template tokens; 2,414 fixed cost (51% under 5k target)
→ Next action: Continue practicing with lean setup; gsd-housekeeping.md optional for future trimming

**Layer 2 — Global Context:**
→ Architecture: LOG-073 Lean Architecture now implemented
→ Token budget: 2,414 fixed + ~7.5k JIT + ~80k work = optimal pair programming headroom
→ Philosophy: LOG-072 Protocol Craft — tune via practice, not evaluation

**Fork paths:**
- Continue work → Lean architecture is live, use it
- Trim housekeeping → Audit gsd-housekeeping.md (6,549 tokens)
- Run retro later → Follow LOG-074 procedure when confidence drops
- Share results → LOG-073/074/075 form complete implementation story

