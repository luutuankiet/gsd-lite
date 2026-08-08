# Project

*Initialized: [date]*

## What This Is

<!-- 2-3 sentence description of the project -->

## Core Value

<!-- Single sentence: the ONE thing that must work perfectly -->

## Success Criteria

Project succeeds when:
- [ ] <!-- observable outcome 1 -->
- [ ] <!-- observable outcome 2 -->
- [ ] <!-- observable outcome 3 -->

## Context

<!-- Background: technical environment, prior work, user needs -->

## Constraints

<!-- Hard limits: technical, budget, time, platform -->

## File Index — how agents read these artifacts

Read bounded, in this order. Each file's own first section restates its contract.

| File | At boot | Bound |
|---|---|---|
| `PROJECT.md` | whole file | small by design — keep it under ~60 lines |
| `ARCHITECTURE.md` | zone A only | stop at `## Version Archive` |
| `WORK.md` | sections 1 and 2 only | stop at `## 2b. Archive` |
| `INBOX.md` | on demand | parked ideas, not boot context |

**Never read `ARCHITECTURE.md` or `WORK.md` unbounded.** Both are append-only and grow without limit. On a mature project the architecture file reaches tens of thousands of words and the work log thousands of lines, so an unbounded read of either spends most of a context window before any work starts.

**Heading grep:** use `^#{2,4} ` on these files, never `^#{1,4} `. Fenced code blocks contain shell comments starting with `# `, and a level-1 grep reports those as headings — producing an index that looks real and is not.
