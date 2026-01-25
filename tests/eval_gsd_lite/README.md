# Simulated Data Pipeline for Evaluation

This is a **simulated** data engineering project used to evaluate GSD-lite agents.
It is a simple ETL pipeline that reads CSV, cleans data, and loads to SQLite.

## Structure
- `data/`: Input files
- `src/etl/`: Logic for Extract, Transform, Load
- `src/pipeline.py`: Main entry point
- `tests/`: Unit tests

## Usage
Run the pipeline:
```bash
python3 src/pipeline.py
```

Run tests:
```bash
python3 -m unittest discover tests
```

## Constraints
- Use **Standard Library only** (no pandas, no numpy, no external deps).
- Keep logic simple but correct.
- Verify changes with tests.
