# API Client Fixture

*Initialized: 2026-02-16*

## What This Is

A lightweight Python CLI application designed to fetch live data (weather, crypto) from public APIs and cache it locally. It serves as a minimal but realistic test fixture for GSD-Lite evaluation scenarios.

## Core Value

Provides immediate, offline-capable access to frequently checked data (like weather) directly from the terminal, avoiding browser context switching.

## Success Criteria

Project succeeds when:
- [ ] Users can fetch weather for any city via `weather <City>` command
- [ ] API responses are cached to reduce latency and network usage
- [ ] Codebase remains dependency-free (stdlib only) for maximum portability
- [ ] Error handling gracefully manages network failures

## Context

**Technical environment:**
- Python 3.9+ standard library only
- `urllib` for requests (no `requests` dependency)
- `json` for file-based caching
- `argparse` for CLI interface

**Key decisions:**
- Use `wttr.in` as the primary data source (no auth required)
- Cache files stored in `~/.cache/api-client-fixture`
- JSON format for both API response and cache storage
