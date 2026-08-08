# Work Log

## How To Read This File — bounded-read contract, agents start here

| Section | Read at boot | How |
|---|---|---|
| `## 1. Current Understanding` | yes | part of the single boot read below |
| `## 2. Key Events` | yes | part of the single boot read below |
| `## 2b. Archive` | no | only when history is in scope |
| `## 3. Atomic Session Log` | **never whole** | index, then read one entry |

**Boot read — two steps, never one unbounded read:**

1. `rg -n '^## 2b\.' gsd-lite/WORK.md` → line N
2. read this file with `limit: N`

**Section 3 is index-then-read, never scan** — including when the user cites a log ID directly:

1. `rg -n '^### \[LOG-' gsd-lite/WORK.md` → the index
2. read only that entry's line range

Other useful indexes: `rg -n '\[DECISION\]'` by type, `rg -n 'Task: TASK-001'` by task.

**Growth rule:** sections 1 and 2 are read on every single session, so their size is a recurring tax rather than a one-off. When either passes ~40 lines, move its stale tail down into `## 2b. Archive`. Section 3 grows without limit by design and is never read whole.

## 1. Current Understanding

<current_mode>
</current_mode>

<active_task>
</active_task>

<parked_tasks>
</parked_tasks>

<vision>
</vision>

<decisions>
</decisions>

<blockers>
</blockers>

<next_action>
</next_action>

---

## 2. Key Events

| Date | Event | Impact |
|------|-------|--------|
| | | |

---

## 2b. Archive — superseded state and older events, not read at boot

### Prior sprint statuses

<!-- Stale bodies evicted from Section 1. Newest first. -->

### Older key events

| Date | Event | Impact |
|------|-------|--------|

---

## 3. Atomic Session Log — NEVER read whole, index with `^### \[LOG-` and read one entry

<!-- Chronological log entries. Use LOG-001, LOG-002, etc. -->
<!-- Each entry follows the Journalism Standard (see agent protocol Section 9) -->
