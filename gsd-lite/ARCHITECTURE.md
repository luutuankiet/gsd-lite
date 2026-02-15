# Architecture

*Mapped: 2026-02-03*

## Project Structure Overview

| Directory                | Description                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| `src/gsd_lite/`          | **Core Logic**: Python source code for the CLI application                                |
| `src/gsd_lite/template/` | **Payload**: The GSD artifact templates (PROTOCOL, WORK.md, etc.) distributed to users    |
| `plugins/reader-vite/`   | **Reader Plugin**: TypeScript/Vite worklog viewer with live reload (see [Plugins](#plugins) section) |
| `.planning/`             | **Context**: Upstream project planning and definition (Data Engineering Copilot Patterns) |
| `.claude/`               | **Reference**: Original GSD reference implementation                                      |
| `gsd-lite/`              | **Bootstrap**: The "dogfooding" instance of GSD-Lite used to build this project           |

## Tech Stack

| Technology      | Role          | Reason                                                       |
| --------------- | ------------- | ------------------------------------------------------------ |
| **Python 3.9+** | Runtime       | Universal availability, strong text processing               |
| **Typer**       | CLI Framework | Type-safe, declarative CLI building with minimal boilerplate |
| **Rich**        | UI Library    | Beautiful terminal formatting for better user experience     |
| **Hatchling**   | Build Backend | Modern Python packaging standard (PEP 621)                   |

## Data Flow

The application functions as a static asset generator/scaffolder.

```mermaid
graph TD
    CLI[CLI Entry Point] -->|Run| Main[__main__.py]
    Main -->|Locate| Pkg[Package Dir src/gsd_lite]
    Pkg -->|Read| Tpl[Template Dir src/gsd_lite/template]
    Main -->|Copy| UserDir[User Directory ./gsd-lite]
    Main -->|Scaffold| Core[Core Files WORK.md, etc.]
    UserDir -->|Contains| Artifacts[Active Session Artifacts]
```

## Entry Points

- `src/gsd_lite/__main__.py` - **CLI Entry Point**: Main application logic, handles args parsing and file operations.
- `pyproject.toml` - **Project Config**: Defines dependencies, scripts, and build targets.
- `.planning/PROJECT.md` - **Vision**: Defines the "Why" and scope of the GSD-Lite project.

## The Two-Brain System

### Session vs. Filesystem Persistence

GSD-Lite operates on a fundamental architectural principle: **ephemeral reasoning, durable artifacts**.

| Component | Role | Persistence | Undo Behavior |
|-----------|------|-------------|---------------|
| **OpenCode Session** | Reasoning Engine | Ephemeral | Fork/Undo reverts context |
| **fs-mcp Server** | Execution Engine | Durable | Fork/Undo has no effect |

### The Persistence Bridge

Agents MUST treat the filesystem as an **External API**, not as session state.

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

### Why OpenCode Runs from Home

The user spawns OpenCode from `~/` (Home Directory), not from project roots. This is intentional:

1. **Single Entry Point:** One OpenCode instance manages multiple projects via different fs-mcp connections.
2. **Global Session Pool:** All sessions land in `~/.local/share/opencode/storage/session/global/`.
3. **Project Isolation via Fingerprinting:** We identify which project a session touched by parsing absolute paths from fs-mcp tool outputs (see LOG-033, LOG-034).

### Consequences for Evaluation

Because `projectID` is always "global", the evaluation parser must:
1. Scan tool call outputs for absolute paths
2. Extract project root from path prefixes
3. Group sessions by detected project

This is documented in LOG-033 (Fingerprinting) and LOG-034 (Schema).

---

## Plugins

### Worklog Reader (`plugins/reader-vite/`)

A TypeScript/Vite application that renders `WORK.md` as an interactive, mobile-friendly HTML viewer with live reload.

#### Purpose

GSD-Lite worklogs grow to 9,000+ lines. Standard markdown viewers (GitHub, VS Code mobile) lack:
- Outline navigation for `### [LOG-NNN]` entries
- "Jump to latest" functionality
- Sticky breadcrumbs showing current position
- Live reload when WORK.md changes

The Reader solves this with a purpose-built worklog browser. See LOG-047 for the full vision.

#### Tech Stack

| Technology | Role | Reason |
|------------|------|--------|
| **TypeScript** | Source language | Type safety for parser/renderer |
| **Vite** | Dev server & bundler | Fast HMR during development |
| **Mermaid** | Diagram rendering | Renders `mermaid` code blocks as SVG |
| **Highlight.js** | Syntax highlighting | Code block formatting |
| **chokidar** | File watching (prod) | Native OS file events |
| **ws** | WebSocket (prod) | Live reload notifications |

#### Directory Structure

```
plugins/reader-vite/
├── package.json           # npm package config (publishable as @gsd-lite/reader)
├── cli.js                 # Production entry point (npx @gsd-lite/reader)
├── vite.config.ts         # Vite configuration (dev only)
├── dist/                  # Built static assets (shipped with npm package)
│   ├── index.html
│   └── assets/
└── src/
    ├── main.ts            # App entry point
    ├── parser.ts          # WORK.md → AST parser
    ├── renderer.ts        # AST → HTML renderer
    ├── diagram-overlay.ts # Mermaid pan/zoom overlay
    ├── syntax-highlight.ts# Code block highlighting
    ├── types.ts           # TypeScript interfaces
    └── vite-plugin-worklog.ts  # Vite plugin for HMR (dev only)
```

#### Two Modes of Operation

| Mode | Command | Use Case |
|------|---------|----------|
| **Development** | `cd plugins/reader-vite && pnpm dev` | Developing the reader itself |
| **Production** | `npx @gsd-lite/reader [path]` | Using reader on any gsd-lite project |

**Development mode** uses Vite's HMR for instant updates. **Production mode** uses a lightweight Node HTTP server with chokidar file watching and WebSocket live reload.

#### Data Flow

```mermaid
graph TD
    subgraph "Input"
        WM[gsd-lite/WORK.md]
    end
    
    subgraph "Parser (parser.ts)"
        P1[Split by LOG headers]
        P2[Extract metadata: ID, TYPE, Task]
        P3[Build AST with sections]
    end
    
    subgraph "Renderer (renderer.ts)"
        R1[Generate outline tree]
        R2[Render content HTML]
        R3[Wrap mermaid blocks]
    end
    
    subgraph "Post-Processing"
        M[Mermaid: code → SVG]
        H[Highlight.js: code blocks]
        D[Diagram overlay: pan/zoom]
    end
    
    subgraph "Output"
        UI[Interactive HTML Viewer]
    end
    
    WM --> P1 --> P2 --> P3
    P3 --> R1 --> R2 --> R3
    R3 --> M --> H --> D --> UI
```

#### Remote Server Deployment

The reader is designed to run **on the same machine as WORK.md** (typically a remote server). This enables native file watching via chokidar.

```mermaid
graph LR
    subgraph "Local Machine"
        Browser[Browser localhost:3000]
    end
    
    subgraph "Remote Server"
        Reader["@gsd-lite/reader :3000"]
        FSMCP[fs-mcp :8124]
        WORK[gsd-lite/WORK.md]
    end
    
    Browser -->|"SSH tunnel"| Reader
    Reader -->|"chokidar watch"| WORK
    FSMCP -->|"read/write"| WORK
```

**Workflow:**
```bash
# On remote server
npx @gsd-lite/reader ./gsd-lite/WORK.md --port 3000

# On local machine (add to SSH tunnel)
ssh -L 3000:localhost:3000 remote-server

# Open browser
open http://localhost:3000
```

#### Key Design Decisions

| Decision | Rationale | Log Reference |
|----------|-----------|---------------|
| Custom parser (not unified markdown lib) | GSD-Lite has specific header format (`### [LOG-NNN] - [TYPE] - Title`) | LOG-047 §3.2 |
| Light theme only | "False" syntax highlighting is worse than none; semantic colors need contrast | LOG-051 |
| WebSocket for prod live reload | Avoids shipping Vite as runtime dep (~50MB → ~2MB) | LOG-056 §3 |
| Reader runs on remote | Chokidar requires local filesystem access | LOG-056 §2 |