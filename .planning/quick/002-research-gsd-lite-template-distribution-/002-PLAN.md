---
phase: quick-002
plan: 002
type: research
wave: 1
depends_on: []
files_modified: []
autonomous: true

must_haves:
  truths:
    - "User understands markdown template distribution differs from code package distribution"
    - "User knows standard approaches for sharing markdown templates (Git, GitHub template repos, script-based copy)"
    - "User knows npx/pip are for executable code packages, not markdown file templates"
  artifacts:
    - path: ".planning/quick/002-research-gsd-lite-template-distribution-/002-SUMMARY.md"
      provides: "Research findings on template distribution methods"
      min_lines: 30
  key_links:
    - from: "Research findings"
      to: "User's decision"
      via: "Clear comparison of distribution approaches"
      pattern: "Git template repo|npm create|CLI installer|manual copy"
---

<objective>
Research and document how to distribute markdown-based template systems like gsd-lite.

Purpose: Answer user's question about distributing .planning/templates/ (7 markdown files + AGENTS.md). Clarify that npx/pip are for code packages, not markdown templates. Identify standard approaches for template distribution and recommend best fit for this use case.

Output: Research summary documenting distribution methods with pros/cons and recommendation.
</objective>

<execution_context>
@./.claude/get-shit-done/workflows/execute-plan.md
@./.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/AGENTS.md
@.planning/templates/README.md

**Current templates:**
- .planning/templates/ contains 7 markdown templates (LOOPS, CONTEXT, STATE, BOOTLOADER, SUMMARY, PROTOCOL_REFERENCE, README)
- .planning/AGENTS.md (agent configuration following agents.md standard)
- All templates are markdown files with frontmatter, XML examples, inline comments
- Target audience: Data engineers using any AI copilot (Claude, ChatGPT, Gemini, Cursor)
- Distribution goal: Enable others to copy templates into their own projects

**User question:**
"how do i publish my gsd lite template for distribution ? is this through npx or pip `.planning/templates`"

**Key clarification needed:**
- npx is for executable Node.js packages (code)
- pip is for Python packages (code)
- gsd-lite templates are markdown files (documentation/configuration)
- Different distribution paradigm required
</context>

<tasks>

<task type="auto">
  <name>Research markdown template distribution patterns</name>
  <files>N/A (web research)</files>
  <action>
Research standard approaches for distributing markdown-based template systems:

1. **GitHub Template Repository Pattern**
   - How cookiecutter, yeoman, create-react-app templates work
   - "Use this template" button vs manual clone
   - Template variables vs static files
   - Examples: github.com/template repos with "template" flag

2. **npm create / npx init Pattern**
   - How @create packages work (create-react-app, create-next-app)
   - Requires JavaScript wrapper to copy files
   - Distribution: npm registry
   - User experience: `npm create gsd-lite` or `npx create-gsd-lite`
   - NOT just markdown - needs code to scaffold

3. **CLI Installer Pattern**
   - Shell script that curls/downloads templates
   - Distribution: GitHub releases, install.sh script
   - Example: oh-my-zsh, homebrew formulas
   - User experience: `curl -fsSL url | bash` or `wget -qO- url | bash`

4. **Git Subtree / Submodule Pattern**
   - User adds templates as git subtree/submodule
   - Distribution: Git repository
   - User experience: `git subtree add --prefix .gsd-lite https://github.com/user/gsd-lite main`
   - Updates: `git subtree pull`

5. **Manual Copy Pattern**
   - User clones repo, copies templates/ directory manually
   - Distribution: GitHub repo with clear README
   - Simplest approach, no tooling required
   - User experience: Clone, copy .planning/templates/ to their project

Focus on:
- What method requires (tooling, infrastructure)
- User experience (how they install/update)
- Maintenance burden (versioning, updates)
- Best fit for markdown templates (no code compilation/execution)

Research sources:
- GitHub template repository documentation
- npm create/init documentation
- cookiecutter (Python template tool)
- Examples of markdown-based template distributions
  </action>
  <verify>Research covers 5 approaches with clear pros/cons for each</verify>
  <done>Understanding of template distribution landscape documented</done>
</task>

<task type="auto">
  <name>Evaluate approaches for gsd-lite use case</name>
  <files>N/A (analysis)</files>
  <action>
Compare distribution approaches against gsd-lite requirements:

**Constraints:**
- Templates are pure markdown (no code execution)
- Target users: Data engineers (may not have Node.js/Python in project)
- Platform agnostic (works with any AI copilot)
- 8 files total (7 templates + AGENTS.md)
- Users need to customize paths, project names
- Updates: Users may want to pull template improvements

**Evaluation criteria:**
1. **Simplicity** - How easy for user to get templates?
2. **Dependencies** - What must user have installed?
3. **Customization** - How do users adapt templates to their project?
4. **Updates** - How do users get template improvements?
5. **Maintenance** - How much work to maintain distribution?

Create comparison table:

| Approach | Simplicity | Dependencies | Customization | Updates | Maintenance |
|----------|------------|--------------|---------------|---------|-------------|
| GitHub Template Repo | [rating] | [deps] | [method] | [method] | [burden] |
| npm create | [rating] | [deps] | [method] | [method] | [burden] |
| CLI Installer | [rating] | [deps] | [method] | [method] | [burden] |
| Git Subtree | [rating] | [deps] | [method] | [method] | [burden] |
| Manual Copy | [rating] | [deps] | [method] | [method] | [burden] |

Consider:
- npx/pip require code wrapper → overkill for 8 markdown files
- Git subtree enables updates but complex for non-Git users
- Manual copy simplest but no update mechanism
- GitHub template repo good for project scaffolding, but gsd-lite is drop-in addition
  </action>
  <verify>Comparison table complete with ratings and reasoning</verify>
  <done>Clear evaluation of each approach for gsd-lite context</done>
</task>

<task type="auto">
  <name>Document findings and recommend approach</name>
  <files>.planning/quick/002-research-gsd-lite-template-distribution-/002-SUMMARY.md</files>
  <action>
Write research summary following SUMMARY template structure:

**Include:**
1. **Question answered:** "How to distribute markdown templates (not code packages)"
2. **Key insight:** npx/pip are for executable code, not markdown files - wrong tool
3. **Research findings:** 5 distribution approaches with explanations
4. **Comparison:** Table evaluating approaches for gsd-lite
5. **Recommendation:** Best approach(es) with reasoning
6. **Implementation steps:** If user chooses recommended approach, what to do next
7. **Alternative:** Fallback approach if recommended doesn't fit

**Recommendation criteria:**
- Lowest barrier to entry (users just want templates, not infrastructure)
- Minimal dependencies (don't require Node.js if project is Python-only)
- Update-friendly (users can pull improvements)
- Low maintenance (you don't want complex tooling to maintain)

**Likely recommendation (validate with research):**
- Primary: GitHub repository with clear README (clone and copy)
- Optional: Shell script installer for convenience (`curl | bash` copies templates)
- Future: npm create wrapper if demand justifies tooling investment

Structure summary with:
- Overview section
- Detailed findings for each approach
- Comparison table
- Recommendation with reasoning
- Next steps for implementation
  </action>
  <verify>002-SUMMARY.md exists and follows SUMMARY template structure</verify>
  <done>Research documented, user question answered with clear guidance</done>
</task>

</tasks>

<verification>
- [ ] Research covers standard template distribution approaches
- [ ] Clarifies npx/pip are for code, not markdown templates
- [ ] Evaluation compares approaches against gsd-lite constraints
- [ ] Recommendation includes reasoning and implementation steps
- [ ] 002-SUMMARY.md follows SUMMARY template structure
</verification>

<success_criteria>
User understands:
1. Why npx/pip are not the right tools (code vs markdown)
2. What standard approaches exist for template distribution
3. Which approach(es) best fit gsd-lite use case
4. How to implement recommended approach
5. What tradeoffs exist between approaches
</success_criteria>

<output>
After completion, create `.planning/quick/002-research-gsd-lite-template-distribution-/002-SUMMARY.md` with research findings, comparison, and recommendation.
</output>
