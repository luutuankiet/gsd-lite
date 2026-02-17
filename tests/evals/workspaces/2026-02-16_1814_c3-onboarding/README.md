# API Client Fixture

A simple Python CLI tool that fetches weather data from [wttr.in](https://wttr.in) and caches it locally.

## Setup

No external dependencies required. Just Python 3.9+.

```bash
# Run directly
python -m src.main weather London

# Run tests
python -m unittest discover tests
```

## Structure

- `src/main.py`: Entry point
- `src/client.py`: API logic (uses urllib)
- `src/cache.py`: JSON file cache in `~/.cache/api-client-fixture`
- `src/config.py`: Configuration