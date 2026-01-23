# ⚡ GSD-Lite

**(lite) Get Sh*t Done with AI Agents.**

A minimal, file-based protocol to keep your AI sessions focused, context-aware, and productive.

[![PyPI](https://img.shields.io/pypi/v/gsd-lite)](https://pypi.org/project/gsd-lite/)

[Inspired by gsd](https://github.com/glittercowboy/get-shit-done) 

## 🚀 Quick Start

No installation required. Run directly with `uv` (recommended):

```bash
# Initialize a new project
uvx gsd-lite

# Or update an existing one
uvx gsd-lite --update
```

## 🧐 What is this?

**GSD-Lite** is a set of markdown templates that structure your interaction with coding agents (Claude, ChatGPT, Cursor, Windsurf).

Instead of treating the chat as ephemeral, GSD-Lite forces the agent to maintain **persistent state** in your file system. This drastically reduces hallucinations and "context amnesia" during long coding sessions.

### The Artifacts

| File | Purpose |
|------|---------|
| **`PROTOCOL.md`** | The rulebook. The agent reads this to know how to behave. |
| **`STATE.md`** | The high-level map. Tracks Phase, Current Task, and Decisions. |
| **`WORK.md`** | The execution log. Tracks every action, file change, and command. |
| **`INBOX.md`** | The parking lot. Captures scope creep, ideas, and bugs for later. |
| **`HISTORY.md`** | The ledger. A permanent record of completed phases. |

## 🛠️ Usage

1. **Scaffold**: Run `uvx gsd-lite` in your project root.
2. **Prompt**: Start your AI session with:
   > "Hi! Please read `gsd-lite/template/PROTOCOL.md` to start the session."
3. **Flow**: The agent will guide you through:
   - **Planning Mode:** Creating a Moodboard and defining scope.
   - **Execution Mode:** Logging work and updating state.
   - **Review Mode:** Promoting results and cleaning up logs.

## 🔄 Updating

As the protocol evolves, you can pull the latest templates without losing your active session data:

```bash
uvx gsd-lite --update
```

This refreshes `gsd-lite/template/` but keeps your active `STATE.md` and `WORK.md` safe.

## 📄 License

MIT