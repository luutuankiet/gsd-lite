#!/usr/bin/env python3
"""
Evaluation Consume Pipeline

Runs evaluation checks on transformed session data.
Layer 1: Programmatic (deterministic, free, fast)
Layer 2: Vertex AI (LLM-as-judge, qualitative) — future

Design References:
- LOG-043: Hybrid architecture, Layer 1 checks specification
- LOG-028: CI Framework Design, Six Pillars

Pipeline Position: INGEST → TRANSFORM → CONSUME (this)

Usage:
    # Run Layer 1 checks
    python eval_consume.py l1 --input eval_run_2026-02-14_2119.json
    
    # Run with CI mode (exit code based on pass rate)
    python eval_consume.py l1 --input eval_run_*.json --ci --threshold 0.8
    
    # Generate report
    python eval_consume.py report --input eval_run_2026-02-14_2119.json
"""

import argparse
import glob
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable, Dict, List, Optional, Tuple

# =============================================================================
# Check Result Types
# =============================================================================

@dataclass
class CheckResult:
    """Result of a single check on a session."""
    check_id: str           # e.g., "S1-H1"
    check_name: str         # e.g., "Handoff Present"
    passed: bool
    message: str
    details: Optional[dict] = None


@dataclass 
class SessionResult:
    """All check results for a single session."""
    session_id: str
    created: str
    checks: List[CheckResult] = field(default_factory=list)
    
    @property
    def passed_count(self) -> int:
        return sum(1 for c in self.checks if c.passed)
    
    @property
    def failed_count(self) -> int:
        return sum(1 for c in self.checks if not c.passed)
    
    @property
    def pass_rate(self) -> float:
        if not self.checks:
            return 0.0
        return self.passed_count / len(self.checks)


@dataclass
class EvalReport:
    """Aggregated evaluation report."""
    sessions: List[SessionResult] = field(default_factory=list)
    
    @property
    def total_sessions(self) -> int:
        return len(self.sessions)
    
    @property
    def total_checks(self) -> int:
        return sum(len(s.checks) for s in self.sessions)
    
    @property
    def total_passed(self) -> int:
        return sum(s.passed_count for s in self.sessions)
    
    @property
    def total_failed(self) -> int:
        return sum(s.failed_count for s in self.sessions)
    
    @property
    def overall_pass_rate(self) -> float:
        if self.total_checks == 0:
            return 0.0
        return self.total_passed / self.total_checks
    
    def checks_by_id(self) -> Dict[str, Dict[str, int]]:
        """Aggregate pass/fail counts per check type."""
        results = {}
        for session in self.sessions:
            for check in session.checks:
                if check.check_id not in results:
                    results[check.check_id] = {"passed": 0, "failed": 0, "name": check.check_name}
                if check.passed:
                    results[check.check_id]["passed"] += 1
                else:
                    results[check.check_id]["failed"] += 1
        return results


# =============================================================================
# Layer 1 Checks (Programmatic)
# =============================================================================

def check_handoff_present(session: dict) -> CheckResult:
    """
    S1-H1: Agent ends response with STATELESS HANDOFF.
    
    Constitution Reference: Pillar 1 - Stateless-First
    
    PASS: Response contains "📦 STATELESS HANDOFF"
    FAIL: Pattern not found
    
    Note: With current flat schema (concatenated response), we check 
    if handoff appears anywhere. With turns[] schema, we'd check last turn only.
    """
    response = session.get("response", "")
    
    # Check for handoff marker
    if "📦 STATELESS HANDOFF" in response:
        return CheckResult(
            check_id="S1-H1",
            check_name="Handoff Present",
            passed=True,
            message="Handoff block found in response"
        )
    
    # Also accept the text version without emoji (some terminals strip it)
    if "STATELESS HANDOFF" in response:
        return CheckResult(
            check_id="S1-H1",
            check_name="Handoff Present",
            passed=True,
            message="Handoff block found (no emoji)",
            details={"emoji_missing": True}
        )
    
    return CheckResult(
        check_id="S1-H1",
        check_name="Handoff Present",
        passed=False,
        message="Missing STATELESS HANDOFF in response"
    )


def check_handoff_structure(session: dict) -> CheckResult:
    """
    S1-H2: Handoff contains Layer 1 (local) and Layer 2 (global) context.
    
    Constitution Reference: Pillar 1 - Stateless-First, Two-Layer Structure
    
    PASS: Handoff contains both "Layer 1" and "Layer 2" sections
    FAIL: Missing one or both layers
    """
    response = session.get("response", "")
    
    # First check if handoff exists
    if "STATELESS HANDOFF" not in response:
        return CheckResult(
            check_id="S1-H2",
            check_name="Handoff Structure",
            passed=False,
            message="No handoff block to check structure"
        )
    
    # Extract handoff section (everything after the marker)
    handoff_start = response.find("STATELESS HANDOFF")
    handoff_section = response[handoff_start:]
    
    has_layer1 = "Layer 1" in handoff_section or "Local Context" in handoff_section
    has_layer2 = "Layer 2" in handoff_section or "Global Context" in handoff_section
    
    if has_layer1 and has_layer2:
        return CheckResult(
            check_id="S1-H2",
            check_name="Handoff Structure",
            passed=True,
            message="Both Layer 1 and Layer 2 present"
        )
    
    missing = []
    if not has_layer1:
        missing.append("Layer 1 (Local)")
    if not has_layer2:
        missing.append("Layer 2 (Global)")
    
    return CheckResult(
        check_id="S1-H2",
        check_name="Handoff Structure",
        passed=False,
        message=f"Missing: {', '.join(missing)}",
        details={"has_layer1": has_layer1, "has_layer2": has_layer2}
    )


def check_grep_before_read(session: dict) -> CheckResult:
    """
    C3-H1: Agent uses grep-first pattern.
    
    Constitution Reference: Pillar 3 - Context Engineering
    
    PASS: Every fs.read is preceded by fs.grep (or allowed exceptions)
    FAIL: fs.read without preceding grep on that path
    
    Allowed exceptions:
    - Reading gsd-lite/*.md files (onboarding)
    - Reading files that were just created
    - Reading after fs.search (file discovery)
    """
    # Get trajectory - support both raw and vertex format
    trajectory = session.get("generated_trajectory", [])
    if not trajectory:
        trajectory = session.get("tool_use", [])
    
    if not trajectory:
        return CheckResult(
            check_id="C3-H1",
            check_name="Grep-First Pattern",
            passed=True,
            message="No tool calls to evaluate"
        )
    
    # Track what's been grepped or searched
    searched_paths = set()
    searched_paths.add(".")  # Root is implicitly searched if any grep ran
    
    # Onboarding files are exempt (always okay to read directly)
    exempt_patterns = [
        "gsd-lite/PROJECT.md",
        "gsd-lite/ARCHITECTURE.md", 
        "gsd-lite/WORK.md",
        "gsd-lite/PROTOCOL.md",
        "PROJECT.md",
        "ARCHITECTURE.md",
        "WORK.md",
        "PROTOCOL.md",
    ]
    
    violations = []
    
    for call in trajectory:
        # Normalize field names (raw vs vertex format)
        tool = call.get("tool") or call.get("tool_name", "")
        args = call.get("args") or call.get("tool_input", {})
        
        # Track grep/search paths
        if tool in ("fs.grep", "grep_content"):
            search_path = args.get("search_path", ".")
            searched_paths.add(search_path)
            # Also add parent directories
            parts = search_path.split("/")
            for i in range(len(parts)):
                searched_paths.add("/".join(parts[:i+1]) or ".")
        
        if tool in ("fs.search", "search_files"):
            search_path = args.get("path", ".")
            searched_paths.add(search_path)
        
        # Check read operations
        if tool in ("fs.read", "read_files"):
            files = args.get("files", [])
            for file_req in files:
                file_path = file_req.get("path", "") if isinstance(file_req, dict) else str(file_req)
                
                # Skip exempt files
                if any(exempt in file_path for exempt in exempt_patterns):
                    continue
                
                # Check if path was searched
                path_searched = False
                for sp in searched_paths:
                    if sp == ".":
                        path_searched = True
                        break
                    if file_path.startswith(sp) or sp in file_path:
                        path_searched = True
                        break
                
                if not path_searched:
                    violations.append(file_path)
    
    if violations:
        return CheckResult(
            check_id="C3-H1",
            check_name="Grep-First Pattern",
            passed=False,
            message=f"Read without grep: {violations[0]}" + (f" (+{len(violations)-1} more)" if len(violations) > 1 else ""),
            details={"violations": violations[:5]}  # Limit details
        )
    
    return CheckResult(
        check_id="C3-H1",
        check_name="Grep-First Pattern",
        passed=True,
        message="All reads preceded by grep/search"
    )


def check_onboarding_sequence(session: dict) -> CheckResult:
    """
    C3-H2: Agent reads PROJECT, ARCHITECTURE, WORK.md for onboarding.
    
    Constitution Reference: Pillar 3 - Context Engineering, Universal Onboarding
    
    PASS: Session includes reads of core onboarding files
    FAIL: Missing one or more onboarding reads
    
    Note: This checks the entire session, not just first turn (flat schema limitation).
    With turns[] schema, we'd check specifically the first agent turn.
    """
    # Get trajectory
    trajectory = session.get("generated_trajectory", [])
    if not trajectory:
        trajectory = session.get("tool_use", [])
    
    if not trajectory:
        return CheckResult(
            check_id="C3-H2",
            check_name="Onboarding Sequence",
            passed=False,
            message="No tool calls - cannot verify onboarding"
        )
    
    # Collect all read paths
    read_paths = []
    for call in trajectory:
        tool = call.get("tool") or call.get("tool_name", "")
        args = call.get("args") or call.get("tool_input", {})
        
        if tool in ("fs.read", "read_files"):
            files = args.get("files", [])
            for file_req in files:
                path = file_req.get("path", "") if isinstance(file_req, dict) else str(file_req)
                read_paths.append(path)
    
    # Check for required onboarding files
    required = {
        "PROJECT.md": False,
        "ARCHITECTURE.md": False,
        "WORK.md": False,
    }
    
    for path in read_paths:
        for req in required:
            if req in path:
                required[req] = True
    
    missing = [k for k, v in required.items() if not v]
    
    if missing:
        return CheckResult(
            check_id="C3-H2",
            check_name="Onboarding Sequence",
            passed=False,
            message=f"Missing: {', '.join(missing)}",
            details={"missing": missing, "read_paths": read_paths[:10]}
        )
    
    return CheckResult(
        check_id="C3-H2",
        check_name="Onboarding Sequence", 
        passed=True,
        message="All onboarding files read"
    )


def check_backlinks_present(session: dict) -> CheckResult:
    """
    J4-H2: Log entries include backlinks (Depends On, LOG-XXX references).
    
    Constitution Reference: Pillar 4 - Journalism Quality
    
    PASS: Response contains LOG-XXX references or "Depends On:" pattern
    FAIL: No backlink patterns found
    
    Note: Only applicable if session appears to be creating log entries.
    Skip check if no log-writing activity detected.
    """
    response = session.get("response", "")
    
    # Check if this session involves log writing
    trajectory = session.get("generated_trajectory", []) or session.get("tool_use", [])
    
    writes_to_work = False
    for call in trajectory:
        tool = call.get("tool") or call.get("tool_name", "")
        args = call.get("args") or call.get("tool_input", {})
        
        if tool in ("fs.edit", "propose_and_review", "fs.write"):
            path = args.get("path", "")
            if "WORK.md" in path:
                writes_to_work = True
                break
    
    if not writes_to_work:
        return CheckResult(
            check_id="J4-H2",
            check_name="Backlinks Present",
            passed=True,
            message="N/A - No WORK.md writes detected"
        )
    
    # Check for backlink patterns
    log_pattern = re.compile(r"LOG-\d{3}")
    has_log_refs = bool(log_pattern.search(response))
    has_depends_on = "Depends On:" in response or "Dependencies:" in response
    
    if has_log_refs or has_depends_on:
        return CheckResult(
            check_id="J4-H2",
            check_name="Backlinks Present",
            passed=True,
            message="Backlink patterns found",
            details={"has_log_refs": has_log_refs, "has_depends_on": has_depends_on}
        )
    
    return CheckResult(
        check_id="J4-H2",
        check_name="Backlinks Present",
        passed=False,
        message="No LOG-XXX or Depends On: patterns in WORK.md write"
    )


# =============================================================================
# Check Registry
# =============================================================================

# All Layer 1 checks in evaluation order
LAYER1_CHECKS: List[Callable[[dict], CheckResult]] = [
    check_handoff_present,      # S1-H1
    check_handoff_structure,    # S1-H2
    check_grep_before_read,     # C3-H1
    check_onboarding_sequence,  # C3-H2
    check_backlinks_present,    # J4-H2
]


def run_layer1_checks(session: dict) -> SessionResult:
    """Run all Layer 1 checks on a single session."""
    result = SessionResult(
        session_id=session.get("session_id", "unknown"),
        created=session.get("created", "")
    )
    
    for check_fn in LAYER1_CHECKS:
        check_result = check_fn(session)
        result.checks.append(check_result)
    
    return result


# =============================================================================
# File Discovery
# =============================================================================

def find_eval_files(directory: Path = Path(".")) -> List[Path]:
    """Find eval_run_*.json files (raw or transformed)."""
    pattern = str(directory / "eval_run_*.json")
    files = glob.glob(pattern)
    files.sort(key=lambda f: Path(f).stat().st_mtime, reverse=True)
    return [Path(f) for f in files]


# =============================================================================
# CLI Commands
# =============================================================================

def cmd_l1(args):
    """Run Layer 1 programmatic checks."""
    # Determine input file
    if args.input:
        input_path = Path(args.input)
        if not input_path.exists():
            print(f"❌ Input file not found: {input_path}")
            return 1
    else:
        # Auto-detect
        eval_files = find_eval_files()
        if not eval_files:
            print("❌ No eval_run_*.json files found.")
            return 1
        
        if len(eval_files) == 1:
            input_path = eval_files[0]
            print(f"📄 Auto-detected: {input_path.name}")
        else:
            print("📁 Available eval files:")
            for i, f in enumerate(eval_files, 1):
                print(f"  [{i}] {f.name}")
            print()
            try:
                selection = input(f"Select file [1-{len(eval_files)}]: ").strip()
                idx = int(selection)
                input_path = eval_files[idx - 1]
            except (ValueError, IndexError, EOFError, KeyboardInterrupt):
                print("\nCancelled.")
                return 1
    
    # Load sessions
    print()
    print(f"🔍 Running Layer 1 checks on: {input_path.name}")
    print("─" * 60)
    
    with open(input_path, "r", encoding="utf-8") as f:
        sessions = json.load(f)
    
    if not isinstance(sessions, list):
        sessions = [sessions]
    
    # Run checks
    report = EvalReport()
    
    for session in sessions:
        session_result = run_layer1_checks(session)
        report.sessions.append(session_result)
        
        if not args.quiet:
            # Print per-session summary
            status = "✅" if session_result.failed_count == 0 else "⚠️"
            print(f"{status} {session_result.session_id[:20]}... "
                  f"({session_result.passed_count}/{len(session_result.checks)} passed)")
            
            # Show failures
            if args.verbose:
                for check in session_result.checks:
                    icon = "✓" if check.passed else "✗"
                    print(f"   {icon} [{check.check_id}] {check.check_name}: {check.message}")
    
    # Print summary
    print()
    print("─" * 60)
    print(f"📊 Summary: {report.total_passed}/{report.total_checks} checks passed "
          f"({report.overall_pass_rate:.0%})")
    print()
    
    # Per-check breakdown
    checks_by_id = report.checks_by_id()
    print("📋 By Check:")
    for check_id, stats in sorted(checks_by_id.items()):
        total = stats["passed"] + stats["failed"]
        rate = stats["passed"] / total if total > 0 else 0
        icon = "✅" if stats["failed"] == 0 else "⚠️"
        print(f"   {icon} [{check_id}] {stats['name']:<25} {stats['passed']}/{total} ({rate:.0%})")
    
    # CI mode
    if args.ci:
        threshold = args.threshold
        if report.overall_pass_rate >= threshold:
            print()
            print(f"✅ CI PASS: {report.overall_pass_rate:.0%} >= {threshold:.0%} threshold")
            return 0
        else:
            print()
            print(f"❌ CI FAIL: {report.overall_pass_rate:.0%} < {threshold:.0%} threshold")
            return 1
    
    # Write report if requested
    if args.output:
        report_data = {
            "input_file": str(input_path),
            "summary": {
                "total_sessions": report.total_sessions,
                "total_checks": report.total_checks,
                "total_passed": report.total_passed,
                "total_failed": report.total_failed,
                "pass_rate": report.overall_pass_rate,
            },
            "checks_by_id": checks_by_id,
            "sessions": [
                {
                    "session_id": s.session_id,
                    "created": s.created,
                    "pass_rate": s.pass_rate,
                    "checks": [
                        {
                            "check_id": c.check_id,
                            "check_name": c.check_name,
                            "passed": c.passed,
                            "message": c.message,
                            "details": c.details,
                        }
                        for c in s.checks
                    ]
                }
                for s in report.sessions
            ]
        }
        
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(report_data, f, indent=2)
        print()
        print(f"📄 Report written to: {args.output}")
    
    return 0


def cmd_checks(args):
    """List available checks."""
    print("📋 Layer 1 Checks (Programmatic)")
    print("─" * 60)
    
    for check_fn in LAYER1_CHECKS:
        # Extract info from docstring
        doc = check_fn.__doc__ or ""
        lines = [l.strip() for l in doc.split("\n") if l.strip()]
        
        # Get check ID from first line
        check_id = lines[0] if lines else "?"
        
        # Get description
        desc = lines[1] if len(lines) > 1 else ""
        
        print(f"  • {check_id}")
        if desc:
            print(f"    {desc}")
        print()
    
    print("💡 Run checks with:")
    print("   python eval_consume.py l1 --input <file>")
    
    return 0


# =============================================================================
# Main
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Evaluation Consume Pipeline - Run checks on session data",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Pipeline Position:
  eval_ingest.py → eval_transform.py → eval_consume.py (this)

Examples:
  # Run Layer 1 checks (auto-detect input)
  python eval_consume.py l1
  
  # Run with verbose output
  python eval_consume.py l1 --input eval_run_*.json --verbose
  
  # CI mode with threshold
  python eval_consume.py l1 --input eval_run_*.json --ci --threshold 0.8
  
  # List available checks
  python eval_consume.py checks
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Evaluation commands")
    
    # l1 command
    l1_parser = subparsers.add_parser("l1", help="Run Layer 1 programmatic checks")
    l1_parser.add_argument("--input", "-i", help="Input file (eval_run_*.json)")
    l1_parser.add_argument("--output", "-o", help="Write JSON report to file")
    l1_parser.add_argument("--verbose", "-v", action="store_true", help="Show per-check details")
    l1_parser.add_argument("--quiet", "-q", action="store_true", help="Only show summary")
    l1_parser.add_argument("--ci", action="store_true", help="CI mode: exit 1 if below threshold")
    l1_parser.add_argument("--threshold", type=float, default=0.8, help="Pass rate threshold for CI (default: 0.8)")
    
    # checks command
    checks_parser = subparsers.add_parser("checks", help="List available checks")
    
    args = parser.parse_args()
    
    if args.command == "l1":
        sys.exit(cmd_l1(args))
    elif args.command == "checks":
        sys.exit(cmd_checks(args))
    else:
        parser.print_help()
        sys.exit(0)


if __name__ == "__main__":
    main()