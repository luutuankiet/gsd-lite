# Reader Style Guide

*Established: 2026-02-19*

## Purpose

This guide defines UI and navigation consistency rules for `plugins/reader-vite/` so future agents can add features without regressing the reading experience.

## Core UX Principles

1. **Card Context First**
   - The sticky top path bar must answer: "What card/entry am I currently inside?"
   - In `WORK.md`, the `LOG-XXX: title` chip is a first-class context anchor.

2. **Compass + Map Split**
   - Top bar is the **compass** (current exact location).
   - Sidebar/bottom sheet is the **map** (broader hierarchy and nearby sections).

3. **Readable by Default**
   - Context docs (`PROJECT.md`, `ARCHITECTURE.md`) and logs should share the same neutral card baseline (white surfaces, consistent spacing).
   - Avoid style drift between document types.

4. **Mobile Parity**
   - Mobile may compress, but must not hide essential context (doc + card + current section).
   - If space is tight, prefer horizontal scrolling over truncating the card-level identity.

## Navigation Rules

## Path Bar

- Path format should follow:
  - `WORK.md > LOG-XXX: Title > H4 > H5 ...`
  - `PROJECT.md > Section > Subsection ...`
  - `ARCHITECTURE.md > Section > Subsection ...`
- Full path is available via popover and all clickable chips.
- Card chip (`kind=card`) should not be ellipsized.

## Outline (Desktop + Mobile Sheet)

- Keep collapsible hierarchy behavior identical on desktop and mobile.
- Active section highlighting must stay synchronized with scroll position.
- If active nested heading has no direct outline node, highlight nearest parent card/section node.

## Copy Export Rules

- Selection controls are root-level convenience features:
  - Group-level "All" for `PROJECT`, `ARCHITECTURE`, `WORK`.
- Export payload must include source markers per chunk for LLM handoff clarity:

```md
> Source: WORK.md / LOG-074: ...

...markdown content...
```

- Preserve deterministic ordering of copied chunks.

## Markdown + Header Rendering Rules

- Render headings consistently across docs and logs.
- Support at least `h1`-`h6` robustly, including flexible spacing after `#` markers.
- Any future deep-level heading UI (>h6 semantics) should preserve accessibility (`role="heading"`, `aria-level`).

## XML Rendering Rules

- XML-like tags outside fenced code blocks should render in human-readable tag UI.
- XML inside fenced blocks must remain code (no semantic conversion).
- Support:
  - open tag line (`<tag>`)
  - close tag line (`</tag>`)
  - self-closing (`<tag/>`)
  - inline pair (`<tag>value</tag>`)

## Visual Baseline

- Code blocks: light theme baseline for both context docs and logs.
- Avoid introducing context-doc-only gradients/shaded cards.
- Keep interaction affordances subtle and consistent (chips, pills, hover states).

## Change Checklist (Before Merge)

- [ ] Sticky path still preserves card-level context in `WORK.md`
- [ ] Mobile path still readable without losing card identity
- [ ] Outline highlight + auto-expand still works (desktop and sheet)
- [ ] Copy export includes source markers and stable ordering
- [ ] XML rendering still ignores fenced code blocks
- [ ] Code block theme remains light and readable

## Ownership

- Primary implementation area: `plugins/reader-vite/src/renderer.ts`
- Primary visual system: `plugins/reader-vite/index.html`
- Document-level parsing: `plugins/reader-vite/src/context-parser.ts`