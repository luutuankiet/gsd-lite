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
├── parser.ts               # WORK.md → WorklogAST
├── renderer.ts             # WorklogAST → HTML
├── types.ts                # TypeScript interfaces
└── vite-plugin-worklog.ts  # Custom Vite plugin for file watching
```

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

- **LOG-047** — Original Worklog Reader vision
- **LOG-048** — Python POC implementation  
- **LOG-049** — Decision to pivot to Node/TypeScript + Vite