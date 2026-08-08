# Architecture

*Mapped: [date]*

## How To Read This File — bounded-read contract, agents start here

Two zones, split by heading level. Onboarding reads **zone A only**.

| Zone | Headings | Extent | Read when |
|---|---|---|---|
| A — canonical reference | `## ` sections | top of file → `## Version Archive` | every session boot |
| B — version archive | `### ` under `## Version Archive` | rest of file | only when a named version or subsystem is in scope |

**Boot read — two steps, never one unbounded read:**

1. `rg -n '^## Version Archive' gsd-lite/ARCHITECTURE.md` → line N
2. read this file with `limit: N`

To reach zone B, index it with `rg -n '^### ' gsd-lite/ARCHITECTURE.md`, then read only the one section you need.

**Heading-grep hygiene:** grep this file with `^#{2,4} `, never `^#{1,4} `. A mature architecture file carries fenced code blocks whose shell comments start with `# `, and a level-1 grep reports those as headings. The resulting index looks real and is not.

**Growth rule:** zone A is current-state only, target under ~400 lines. Anything version-stamped, superseded or historical belongs in zone B. Anything in zone B that is still true and still consulted belongs back up in zone A — promote it rather than leaving the next reader to find live knowledge by date.

## Project Structure Overview

| Directory | Purpose |
|-----------|--------|

## Tech Stack

<!-- Runtime, language, 2-5 critical dependencies -->

## Data Flow

<!-- Mermaid diagram or text description of how data moves through the system -->

## Entry Points

<!-- 3-5 files that give fastest path to understanding the codebase -->

## Version Archive — STOP: onboarding does not read past this line

Chronological, append-only, **never read during onboarding**. One `### ` entry per release or work phase, kept so a decision can be traced back to the conditions that produced it.

Current-state facts belong in the zone-A sections above. Index this zone with `rg -n '^### ' gsd-lite/ARCHITECTURE.md` and read one entry at a time.

<!-- Append `### ` entries below. Never promote one to `## ` — that is what makes an archive
     indistinguishable from the reference above it in a heading grep, and gets this file read whole. -->
