# GSD-Lite Worklog Reader (Vite)

Hot-reloading viewer for GSD-Lite WORK.md files. When you edit WORK.md, the browser updates instantly.

## Quick Start

```bash
cd plugins/reader-vite

# Install dependencies (one-time)
pnpm install

# Start dev server (watches ../../gsd-lite/WORK.md by default)
pnpm dev

# Or specify a custom WORK.md path:
WORKLOG_PATH=../../../other-project/gsd-lite/WORK.md pnpm dev
```

Then open http://localhost:3000 — the page auto-refreshes when WORK.md changes.

## Features

- 🔥 **Hot Reload** — Browser updates instantly when WORK.md changes (no manual refresh)
- 📊 **Mermaid Diagrams** — Native SVG rendering with error handling
- 🎨 **Full Markdown** — Tables, code blocks, lists, links, strikethrough
- 📱 **Mobile Ready** — Responsive layout, touch-friendly navigation
- ⚡ **Fast** — Vite's instant HMR, sub-second rebuilds

## How It Works

The Vite plugin (`src/vite-plugin-worklog.ts`) does three things:

1. **Watches** — Uses chokidar to monitor the external WORK.md file
2. **Serves** — Exposes `/_worklog` endpoint that returns the file content
3. **Pushes** — Sends HMR events to the browser when the file changes

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────┐
│    WORK.md      │────▶│  vite-plugin-worklog │────▶│   Browser   │
│   (external)    │     │  (watch + serve)     │     │   (HMR)     │
└─────────────────┘     └──────────────────────┘     └─────────────┘
       │                         │                          │
       │ chokidar detects        │ WebSocket push           │ re-fetch
       │ file change             │ 'worklog-update'         │ & re-render
       ▼                         ▼                          ▼
```

## Architecture

```
src/
├── main.ts                 # Entry point, HMR setup, Mermaid init
├── parser.ts               # WORK.md → WorklogAST (line numbers, children)
├── renderer.ts             # WorklogAST → HTML (outline, content, gestures)
├── diagram-overlay.ts      # Mermaid pan/zoom overlay
├── syntax-highlight.ts     # Code block highlighting
├── types.ts                # TypeScript interfaces
└── vite-plugin-worklog.ts  # Custom Vite plugin for file watching (dev only)
```

## ⚠️ Critical Implementation Notes

### Line Number Alignment

Deep linking (`#line-7551`) requires strict alignment between parser and renderer:

1. **Parser** records `lineNumber` as **absolute file line** (1-indexed)
2. **Renderer** calculates `id="line-N"` via `startLine + contentIndex`
3. **Content must use `.trimEnd()` NOT `.trim()`** — trimming leading lines breaks anchors

```typescript
// ❌ WRONG - breaks line numbers
currentLog.content = currentContent.join('\n').trim();

// ✅ CORRECT - preserves leading empty lines
currentLog.content = currentContent.join('\n').trimEnd();
```

### Dual Outline Containers

Desktop (sidebar) and mobile (bottom sheet) have **separate** outline containers:
- Desktop: `#outline` — always in DOM, toggled via `.hidden` class
- Mobile: `#outlineSheet .sheet-content` — bottom sheet with drag gestures

Both render identical content but have different scroll/interaction handlers.

### Mobile Bottom Sheet States

| State | CSS Class | Transform |
|-------|-----------|-----------|
| Collapsed | `.snap-collapsed` | `translateY(100%)` |
| Half | `.snap-half` | `translateY(50%)` |
| Full | `.snap-full` | `translateY(15%)` |

Gestures are handled via touch events on the drag handle.

## Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `WORKLOG_PATH` | `../../gsd-lite/WORK.md` | Path to WORK.md (relative to plugin root) |

## Build (Static Export)

```bash
# Build static HTML for sharing/mobile (TODO: READER-002e)
pnpm build
```

## Related Logs

| Log | Topic |
|-----|-------|
| LOG-047 | Original Worklog Reader vision |
| LOG-048 | Python POC implementation |
| LOG-049 | Decision to pivot to Node/TypeScript + Vite |
| LOG-050 | Hot reload loop & Mermaid error DX |
| LOG-051 | Pan/zoom overlay & semantic light theme |
| LOG-056 | Production CLI distribution (npm) |
| LOG-061 | Mobile UX overhaul: bottom sheet design |
| LOG-062 | Bottom sheet & gesture implementation |
| LOG-063 | Outline auto-scroll on open |
| LOG-064 | **Critical:** Line number alignment fix (`.trimEnd()`) |