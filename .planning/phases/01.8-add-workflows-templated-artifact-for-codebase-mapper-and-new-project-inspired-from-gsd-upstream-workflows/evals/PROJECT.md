# Hetzner Homelab Resource Assessment

## What This Is

An assessment and optimization project for a remote Hetzner server hosting a personal homelab. The goal is to diagnose frequent server timeouts, identify resource bottlenecks among the 13+ running containers, and establish a "reasonable headroom" to ensure performance stability for a single user.

## Core Value

**Stable, responsive performance for a single client with defined resource headroom.**
(The system must not timeout during normal use, even if that means capping or removing non-essential services.)

## Requirements

### Validated

(None yet — assessment in progress)

### Active

- [ ] **Assessment**: Accurate breakdown of RAM/CPU usage per container under load (not just idle).
- [ ] **Diagnosis**: Identify the specific cause of "frequent timeouts" (CPU saturation? OOM kills? Disk I/O?).
- [ ] **Optimization**: Configuration tuning for heaviest consumers (`metamcp`, `crawl4ai`, `n8n`).
- [ ] **Headroom**: Establish a "safe capacity" metric (e.g., keep 2GB RAM free).

### Out of Scope

- Hardware upgrades (Must stay within current 8GB/4vCPU plan).
- Multi-user scaling (Strictly optimized for single-user patterns).

## Context

**Infrastructure:**
- **Server**: Hetzner Cloud (Finland)
- **Client**: Asia (High latency connection)
- **Specs**: AMD EPYC (4 vCPU), 8GB RAM, 75GB Disk (NVMe).
- **OS**: Linux (x86_64), Docker environment.

**Workload Profile:**
- **Heavy**: `crawl4ai` (Headless browser), `lightdash` (Java/Browser), `metamcp` (Node).
- **Medium**: `n8n` (Workflow automation), `firefox` (Remote browser).
- **Light**: `freshrss`, `linkding`, `traefik`.

**Current State (Snapshot):**
- RAM Usage: ~50% allocated to containers in idle state.
- CPU Usage: Low in snapshot, but likely spiking during active browser tasks.
- Storage: 49% used (37GB free).

## Constraints

- **Type**: Memory — 8GB limit is tight for multiple headless browsers (`crawl4ai`, `lightdash`, `firefox`).
- **Type**: Latency — Remote management via MCP/SSH over intercontinental link.
- **Type**: Stability — "Frequent timeouts" implies we are hitting a hard limit (likely OOM killer or I/O lock).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Focus on Stability | Current timeouts make the system unusable. | — Pending |
| Single-User Focus | Optimization target is bursty, single-user traffic, not concurrent load. | — Pending |

---
*Last updated: 2026-01-31 after initial discovery*