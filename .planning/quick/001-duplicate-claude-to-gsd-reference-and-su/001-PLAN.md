---
type: execute
mode: quick
wave: 1
depends_on: []
files_modified: []
autonomous: true

must_haves:
  truths:
    - ".claude directory content exists in gsd_reference for reference without agent confusion"
    - "Planning documents include GSD-style context engineering patterns"
    - "User has concrete suggestions for leveraging GSD patterns in this project"
  artifacts:
    - path: "gsd_reference/"
      provides: "Reference copy of .claude directory"
      min_lines: 0
    - path: ".planning/GSD_PATTERNS.md"
      provides: "Analysis and suggestions for GSD pattern integration"
      min_lines: 100
  key_links:
    - from: ".planning documents"
      to: "GSD patterns from glittercowboy/get-shit-done"
      via: "Analysis in GSD_PATTERNS.md"
      pattern: "XML-structured.*context layering.*wave-based"
---

<objective>
Separate reference materials from active agentic prompts and establish GSD context engineering patterns for this project.

Purpose: The .claude directory contains agentic prompts that should not be confused with reference materials. Duplicating to gsd_reference creates a clean reference copy while keeping .claude as the active agent workspace. Additionally, analyze GSD patterns from the source repository to provide concrete suggestions for this project's planning documents.

Output:
- gsd_reference/ directory containing full copy of .claude
- .planning/GSD_PATTERNS.md with holistic analysis and suggestions
</objective>

<execution_context>
@./.claude/get-shit-done/workflows/execute-plan.md
@./.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/STATE.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Duplicate .claude to gsd_reference</name>
  <files>gsd_reference/</files>
  <action>
  Copy the entire .claude directory to gsd_reference/ at the project root.

  Use cp -R to preserve directory structure:
  - agents/ (11 agent definition files)
  - commands/ (orchestrator commands)
  - get-shit-done/ (workflows, templates, reference)
  - hooks/ (Claude Desktop integration)
  - settings.json

  This creates a reference copy that won't be confused with active agentic prompts in .claude.
  </action>
  <verify>
  ls -la gsd_reference/ shows same structure as .claude/
  find gsd_reference -type f | wc -l matches find .claude -type f | wc -l
  </verify>
  <done>gsd_reference/ directory exists with complete copy of .claude contents</done>
</task>

<task type="auto">
  <name>Task 2: Analyze GSD patterns from source repository</name>
  <files>.planning/GSD_PATTERNS.md</files>
  <action>
  Fetch and analyze https://github.com/glittercowboy/get-shit-done repository to extract key context engineering patterns.

  Focus on:
  1. XML-structured instructions (why XML vs markdown, clarity benefits)
  2. Context layering approach (project vision → domain research → requirements → state)
  3. Fresh context windows via multi-agent orchestration
  4. Wave-based parallel execution (dependency graphs, file ownership)
  5. Artifact organization in .planning/ (what prevents context rot)
  6. Goal-backward methodology (truths → artifacts → key_links)
  7. Task sizing and context budgets (50% rule, quality degradation curve)
  8. Checkpoint patterns (human-verify, decision, human-action)

  Create comprehensive analysis document at .planning/GSD_PATTERNS.md with:
  - Pattern descriptions (what they are)
  - Rationale (why they work)
  - Application to this project (how to use them in Session Handoff, Context Engineering phases)
  - Specific suggestions for PROJECT.md, ROADMAP.md, future phase planning
  </action>
  <verify>
  cat .planning/GSD_PATTERNS.md shows structured analysis with sections for each pattern
  grep -c "##" .planning/GSD_PATTERNS.md returns 10+ (multiple sections)
  </verify>
  <done>GSD_PATTERNS.md exists with pattern analysis and concrete suggestions for this project</done>
</task>

<task type="auto">
  <name>Task 3: Create holistic suggestions for planning document integration</name>
  <files>.planning/GSD_PATTERNS.md</files>
  <action>
  Based on the GSD pattern analysis, add a final "Integration Roadmap" section to GSD_PATTERNS.md with specific, actionable suggestions.

  Connect patterns to project phases:
  - **Phase 1 (Foundation & Templates)**: Which GSD patterns to adopt in template design
  - **Phase 2 (Session Handoff)**: How XML structure and context layering apply to LOOPS.md, CONTEXT.md
  - **Phase 3 (Context Engineering)**: Apply token budget management, progressive loading, context decision documentation
  - **Phase 4 (Educational Integration)**: Use heavily-commented templates approach from GSD

  Include:
  - What to add to existing planning documents (PROJECT.md, ROADMAP.md)
  - Template structure recommendations (XML vs markdown, inline documentation style)
  - Context engineering principles for data engineering scenarios (200+ model lineages)
  - Wave-based thinking for task breakdown in future phases

  Make suggestions concrete and implementable, not abstract theory.
  </action>
  <verify>
  grep -A 20 "Integration Roadmap" .planning/GSD_PATTERNS.md shows phase-specific suggestions
  grep -c "Phase [1-4]" .planning/GSD_PATTERNS.md returns 4+ (covers all phases)
  </verify>
  <done>GSD_PATTERNS.md contains Integration Roadmap with concrete, phase-specific suggestions</done>
</task>

</tasks>

<verification>
Run these checks to confirm plan completion:

```bash
# Verify duplication
ls -la gsd_reference/
diff -r .claude gsd_reference | head -20

# Verify analysis document
cat .planning/GSD_PATTERNS.md
wc -l .planning/GSD_PATTERNS.md  # Should be 100+ lines
```

Expected outcomes:
- gsd_reference/ directory mirrors .claude structure
- GSD_PATTERNS.md provides comprehensive pattern analysis
- Integration suggestions map directly to project phases
</verification>

<success_criteria>
- [ ] gsd_reference/ directory exists with complete .claude copy
- [ ] .planning/GSD_PATTERNS.md created (100+ lines)
- [ ] Pattern analysis covers XML structure, context layering, wave execution, artifact organization
- [ ] Integration Roadmap section provides phase-specific suggestions
- [ ] User can reference GSD patterns without confusion with active agent prompts
- [ ] User has actionable guidance for applying GSD patterns to Session Handoff and Context Engineering phases
</success_criteria>

<output>
After completion, create `.planning/quick/001-duplicate-claude-to-gsd-reference-and-su/001-SUMMARY.md`
</output>
