#!/usr/bin/env python3
"""
Layer 2 Evaluation: Vertex AI GenAI Client Integration

Uses Vertex AI's rubric-based metrics with custom guidelines to evaluate
agent behavior against the GSD-Lite Constitution.

Design References:
- LOG-043: Vertex AI Rubric-Based Evaluation (DECISION-043a, 043b, 043c)
- LOG-046: Vertex-Native Turn-Structured Schema
- CONSTITUTION.md: The Four Pillars (S1, P2, C3, J4)
- rubrics/pair-programming.yaml: Structured P2 rubric

Usage:
    # Evaluate a single session file
    python layer2_vertex.py evaluate --input eval_run_2026-02-16.json
    
    # Evaluate with specific pillar focus
    python layer2_vertex.py evaluate --input eval.json --pillar P2
    
    # List available metrics
    python layer2_vertex.py metrics

Requirements:
    pip install google-cloud-aiplatform[evaluation] pyyaml
"""

import argparse
import json
import os
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional

try:
    import yaml
    YAML_AVAILABLE = True
except ImportError:
    YAML_AVAILABLE = False

# Vertex AI imports (lazy load to allow --help without auth)
_vertex_client = None

# Default paths
RUBRICS_DIR = Path(__file__).parent.parent / "src" / "gsd_lite" / "template" / "constitution" / "rubrics"


def get_vertex_client():
    """Lazy-load Vertex AI client."""
    global _vertex_client
    if _vertex_client is None:
        try:
            
            
            project_id = os.environ.get("GOOGLE_CLOUD_PROJECT", os.environ.get("PROJECT_ID"))
            location = os.environ.get("GOOGLE_CLOUD_LOCATION", "us-central1")
            
            if not project_id:
                print("❌ Error: Set GOOGLE_CLOUD_PROJECT or PROJECT_ID environment variable")
                sys.exit(1)
            
            from vertexai import Client, types
            _vertex_client = Client(
                project=project_id,
                location=location
            )
            print(f"✅ Connected to Vertex AI: {project_id} / {location}")
        except ImportError:
            print("❌ Error: Install Vertex AI SDK with: pip install google-cloud-aiplatform[evaluation]")
            sys.exit(1)
    
    return _vertex_client


# =============================================================================
# Rubric Loading (YAML → Guidelines)
# =============================================================================

def load_yaml_rubric(pillar_id: str) -> Optional[Dict]:
    """
    Load a YAML rubric file for the given pillar.
    
    Args:
        pillar_id: Pillar identifier (P2, S1, C3, J4)
    
    Returns:
        Parsed YAML dict or None if not found
    """
    if not YAML_AVAILABLE:
        print(f"⚠️  PyYAML not installed, cannot load rubric for {pillar_id}")
        return None
    
    # Map pillar IDs to filenames
    pillar_files = {
        "P2": "pair-programming.yaml",
        "S1": "stateless-first.yaml",
        "C3": "context-engineering.yaml",
        "J4": "journalism-quality.yaml",
    }
    
    filename = pillar_files.get(pillar_id)
    if not filename:
        return None
    
    rubric_path = RUBRICS_DIR / filename
    if not rubric_path.exists():
        return None
    
    with open(rubric_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def yaml_rubric_to_guidelines(rubric: Dict) -> str:
    """
    Convert a YAML rubric to Vertex AI guidelines string.
    
    The YAML rubric structure:
    - metadata: pillar info
    - criteria[]: list of behaviors with evaluation_steps, scoring, examples
    
    Output: Structured text that Vertex's GENERAL_QUALITY can use.
    """
    lines = []
    
    # Header
    metadata = rubric.get("metadata", {})
    pillar_name = metadata.get("pillar", "Unknown Pillar")
    pillar_id = metadata.get("pillar_id", "XX")
    description = metadata.get("description", "").strip()
    
    lines.append(f"# Evaluate: {pillar_name} ({pillar_id})")
    lines.append("")
    lines.append(description)
    lines.append("")
    lines.append("=" * 60)
    lines.append("")
    
    # Each criterion
    criteria = rubric.get("criteria", [])
    for criterion in criteria:
        crit_id = criterion.get("id", "?")
        crit_name = criterion.get("name", "Unknown")
        crit_desc = criterion.get("description", "").strip()
        
        lines.append(f"## {crit_id}: {crit_name}")
        lines.append("")
        lines.append(crit_desc)
        lines.append("")
        
        # Evaluation steps
        eval_steps = criterion.get("evaluation_steps", [])
        if eval_steps:
            lines.append("### Evaluation Steps:")
            for i, step in enumerate(eval_steps, 1):
                lines.append(f"  {i}. {step}")
            lines.append("")
        
        # Scoring criteria
        scoring = criterion.get("scoring", [])
        if scoring:
            lines.append("### Scoring:")
            for score_item in scoring:
                score = score_item.get("score", "?")
                label = score_item.get("label", "?")
                criteria_text = score_item.get("criteria", "").strip()
                lines.append(f"  [{score}] {label}:")
                for line in criteria_text.split("\n"):
                    lines.append(f"      {line.strip()}")
            lines.append("")
        
        # Violation examples
        violations = criterion.get("violation_examples", [])
        if violations:
            lines.append("### Violation Examples (FAIL):")
            for v in violations:
                lines.append(f"  Input: \"{v.get('input', '')}\"")
                lines.append(f"  Response: \"{v.get('response', '')[:100]}...\"")
                lines.append(f"  Why FAIL: {v.get('reason', '')}")
                lines.append("")
        
        # Compliance examples
        compliance = criterion.get("compliance_examples", [])
        if compliance:
            lines.append("### Compliance Examples (PASS):")
            for c in compliance:
                lines.append(f"  Input: \"{c.get('input', '')}\"")
                lines.append(f"  Response: \"{c.get('response', '')[:100]}...\"")
                lines.append(f"  Why PASS: {c.get('reason', '')}")
                lines.append("")
        
        lines.append("-" * 40)
        lines.append("")
    
    return "\n".join(lines)


# =============================================================================
# Fallback Prose Guidelines (for pillars without YAML rubrics)
# =============================================================================

S1_GUIDELINES = """
# Evaluate: Stateless-First (S1)

The agent MUST end every response with a stateless handoff that enables
any future agent to continue with zero chat history.

## S1-H1: Handoff Present
Response MUST end with "📦 STATELESS HANDOFF" block.
FAIL: No handoff block at all.
PASS: Handoff block present.

## S1-H2: Layer 1 Present
Handoff MUST include Layer 1 (local task context).
FAIL: Missing "Layer 1" or "Local Context" section.
PASS: Layer 1 section present with last action, dependency chain, next action.

## S1-H3: Layer 2 Present
Handoff MUST include Layer 2 (global project context).
FAIL: Missing "Layer 2" or "Global Context" section.
PASS: Layer 2 section present with architecture, patterns, key decisions.

## S1-H4: Fork Paths
Handoff MUST provide 2-4 actionable fork paths.
FAIL: No fork paths, or just "continue".
PASS: 2-4 specific fork paths with log references.

## S1-H5: Reference Format
References MUST use LOG-XXX (description) format.
FAIL: Vague references like "recent logs" or "LOG-001 through LOG-050".
PASS: Specific references like "LOG-045 (schema migration)".

Violation Examples:
- Response ends without any handoff → FAIL S1-H1
- "Read the recent logs" → FAIL S1-H5
- Missing Layer 2 (can't pivot) → FAIL S1-H3
"""

C3_GUIDELINES = """
# Evaluate: Context Engineering (C3)

The agent MUST use grep-first patterns and complete onboarding before work.

## C3-H1: Grep Before Read
Agent MUST grep before reading large artifacts.
FAIL: Full file read without prior grep.
PASS: Grep to discover structure, then surgical read.

## C3-H2: Section-Aware Reading
Agent MUST use section-aware reading (start_line + boundary).
FAIL: Reading entire file when only one section needed.
PASS: Using start_line/end_line or read_to_next_pattern.

## C3-H3: Universal Onboarding
Agent MUST complete onboarding on first turn (PROJECT → ARCHITECTURE → WORK.md).
FAIL: Jumping straight to task without reading artifacts.
PASS: Reading PROJECT.md, ARCHITECTURE.md, WORK.md Current Understanding first.

## C3-H4: Artifacts Over Chat
Agent MUST reconstruct context from artifacts, NOT chat history.
FAIL: "As we discussed earlier..." (no prior context exists).
PASS: "According to LOG-045..." (referencing artifacts).

Violation Examples:
- read_files([{"path": "WORK.md"}]) without grep → FAIL C3-H1
- "Let me continue where we left off" without reading WORK.md → FAIL C3-H4
"""

J4_GUIDELINES = """
# Evaluate: Journalism Quality (J4)

Log entries (if any were written) MUST include WHY and evidence.

## J4-H1: Why Not Just What
Log entries MUST include WHY, not just WHAT.
FAIL: "Implemented auth. Works now." (no reasoning)
PASS: "Implemented JWT auth because session cookies don't work cross-domain..."

## J4-H2: Concrete Evidence
Log entries MUST include concrete evidence (code snippets, errors, results).
FAIL: "Fixed the bug" with no evidence.
PASS: Includes error message, SQL query, or code snippet.

## J4-H3: Summary in Header
Log headers MUST include summary for grep scanning.
FAIL: "### [LOG-005]" alone.
PASS: "### [LOG-005] - [DECISION] - Use card layout - Task: MODEL-A"

## J4-H4: No Transcript Dumps
MUST NOT log conversation transcripts — log crystallized understanding.
FAIL: Pasting entire chat into WORK.md.
PASS: Distilled insights with structure.

## J4-H5: Backlink Don't Repeat
MUST NOT repeat explanations from prior logs — backlink instead.
FAIL: Re-explaining JWT vs sessions when LOG-015 already covered it.
PASS: "See LOG-015 for JWT rationale. Building on that..."

Note: If no log entries were written, J4 criteria are N/A.
"""


def get_guidelines_for_pillar(pillar_id: str) -> tuple[str, str]:
    """
    Get guidelines for a pillar, preferring YAML rubric if available.
    
    Returns:
        Tuple of (guidelines_text, source_description)
    """
    # Try YAML first
    rubric = load_yaml_rubric(pillar_id)
    if rubric:
        guidelines = yaml_rubric_to_guidelines(rubric)
        return guidelines, f"YAML rubric: {pillar_id.lower()}.yaml"
    
    # Fallback to prose
    prose_guidelines = {
        "S1": S1_GUIDELINES,
        "P2": None,  # Should have YAML
        "C3": C3_GUIDELINES,
        "J4": J4_GUIDELINES,
    }
    
    guidelines = prose_guidelines.get(pillar_id)
    if guidelines:
        return guidelines, "prose fallback (no YAML rubric)"
    
    return "", "no guidelines available"


def get_all_guidelines() -> str:
    """Combine all pillar guidelines for full Constitution evaluation."""
    all_guidelines = []
    
    all_guidelines.append("# GSD-Lite Constitution Evaluation")
    all_guidelines.append("")
    all_guidelines.append("Evaluate the agent's adherence to ALL four pillars.")
    all_guidelines.append("Each pillar has MUST (hardcoded) behaviors that are violations if broken.")
    all_guidelines.append("")
    all_guidelines.append("=" * 60)
    all_guidelines.append("")
    
    for pillar_id in ["S1", "P2", "C3", "J4"]:
        guidelines, source = get_guidelines_for_pillar(pillar_id)
        if guidelines:
            all_guidelines.append(guidelines)
            all_guidelines.append("")
    
    return "\n".join(all_guidelines)


# =============================================================================
# Evaluation Data Classes
# =============================================================================

@dataclass
class L2CheckResult:
    """Result from a Layer 2 (Vertex) evaluation."""
    metric_name: str
    pillar_id: str
    score: float  # 0.0 to 1.0
    passed: bool
    explanation: str
    rubrics_source: str = ""
    raw_result: Optional[Dict] = None


@dataclass
class L2SessionResult:
    """All L2 check results for a single session."""
    session_id: str
    created: str
    title: str
    checks: List[L2CheckResult] = field(default_factory=list)
    
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


# =============================================================================
# Evaluation Functions
# =============================================================================

def load_eval_data(input_path: str) -> List[Dict]:
    """Load evaluation data from JSON file."""
    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Handle both single session and array of sessions
    if isinstance(data, list):
        return data
    return [data]


def evaluate_session(
    session: Dict,
    pillar: Optional[str] = None,
    verbose: bool = False
) -> L2SessionResult:
    """
    Evaluate a single session with Vertex AI.
    
    Args:
        session: Session data in our eval format
        pillar: Optional pillar to focus on (S1, P2, C3, J4)
        verbose: Print detailed progress
    
    Returns:
        L2SessionResult with check results
    """
    from vertexai import types
    import pandas as pd
    
    client = get_vertex_client()
    
    session_id = session.get("session_id", "unknown")
    created = session.get("created", "")
    title = session.get("title", "")
    
    # Get prompt and response
    prompt = session.get("prompt", "")
    response_text = ""
    try:
        response_text = session["response"]["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError):
        response_text = session.get("response_concat", "")
    
    if not prompt or not response_text:
        return L2SessionResult(
            session_id=session_id,
            created=created,
            title=title,
            checks=[L2CheckResult(
                metric_name="error",
                pillar_id="N/A",
                score=0.0,
                passed=False,
                explanation="Missing prompt or response"
            )]
        )
    
    # Determine which pillars to evaluate
    if pillar:
        pillars_to_eval = [pillar]
    else:
        pillars_to_eval = ["S1", "P2", "C3", "J4"]
    
    checks: List[L2CheckResult] = []
    
    for pillar_id in pillars_to_eval:
        guidelines, source = get_guidelines_for_pillar(pillar_id)
        
        if not guidelines:
            checks.append(L2CheckResult(
                metric_name=f"{pillar_id}_compliance",
                pillar_id=pillar_id,
                score=0.0,
                passed=False,
                explanation=f"No guidelines available for {pillar_id}",
                rubrics_source=source
            ))
            continue
        
        if verbose:
            print(f"   📋 Evaluating {pillar_id} using {source}...")
        
        # Create DataFrame for evaluation
        eval_df = pd.DataFrame({
            "prompt": [prompt],
            "response": [response_text],
        })
        
        try:
            # Run evaluation with GENERAL_QUALITY + custom guidelines
            eval_result = client.evals.evaluate(
                dataset=eval_df,
                metrics=[
                    types.RubricMetric.GENERAL_QUALITY(
                        metric_spec_parameters={
                            "guidelines": guidelines
                        }
                    )
                ]
            )
            
            # Debug: Dump raw result to JSON for inspection (requires jsonpickle)
            if verbose:
                try:
                    import jsonpickle
                    # Sanitize filename
                    safe_id = "".join(c for c in session_id if c.isalnum())[:8]
                    debug_path = f"debug_eval_{pillar_id}_{safe_id}.json"
                    
                    with open(debug_path, "w", encoding="utf-8") as f:
                        f.write(jsonpickle.encode(eval_result, indent=2))
                    print(f"   🔍 Debug dump saved to: {debug_path}")
                except ImportError:
                    print("   ⚠️  Install 'jsonpickle' to enable debug dumps")
                except Exception as e:
                    print(f"   ⚠️  Failed to dump debug JSON: {e}")

            # Parse results
            row_results = eval_result.to_dataframe() if hasattr(eval_result, 'to_dataframe') else None
            
            if row_results is not None and len(row_results) > 0:
                row = row_results.iloc[0]
                
                # Extract score
                score_col = [c for c in row_results.columns if 'score' in c.lower()]
                score = float(row[score_col[0]]) if score_col else 0.5
                
                # Extract explanation
                explanation_col = [c for c in row_results.columns if 'explanation' in c.lower() or 'rationale' in c.lower()]
                explanation = str(row[explanation_col[0]]) if explanation_col else "No explanation available"
                
                checks.append(L2CheckResult(
                    metric_name=f"{pillar_id}_compliance",
                    pillar_id=pillar_id,
                    score=score,
                    passed=score >= 0.7,
                    explanation=explanation,
                    rubrics_source=source,
                    raw_result=row.to_dict() if hasattr(row, 'to_dict') else None
                ))
            else:
                checks.append(L2CheckResult(
                    metric_name=f"{pillar_id}_compliance",
                    pillar_id=pillar_id,
                    score=0.0,
                    passed=False,
                    explanation="Failed to parse evaluation results",
                    rubrics_source=source
                ))
                
        except Exception as e:
            checks.append(L2CheckResult(
                metric_name=f"{pillar_id}_compliance",
                pillar_id=pillar_id,
                score=0.0,
                passed=False,
                explanation=f"Evaluation error: {str(e)}",
                rubrics_source=source
            ))
    
    return L2SessionResult(
        session_id=session_id,
        created=created,
        title=title,
        checks=checks
    )


def evaluate_sessions(
    sessions: List[Dict],
    pillar: Optional[str] = None,
    verbose: bool = False
) -> List[L2SessionResult]:
    """
    Run Vertex AI evaluation on multiple sessions.
    """
    results: List[L2SessionResult] = []
    
    for i, session in enumerate(sessions):
        title = session.get("title", "")[:50]
        if verbose:
            print(f"\n📊 Evaluating session {i+1}/{len(sessions)}: {title}...")
        
        result = evaluate_session(session, pillar=pillar, verbose=verbose)
        results.append(result)
        
        if verbose:
            for check in result.checks:
                status = "✅" if check.passed else "❌"
                print(f"   {status} {check.pillar_id}: {check.score:.2f}")
    
    return results


def print_results(results: List[L2SessionResult]) -> None:
    """Print evaluation results summary."""
    print("\n" + "=" * 60)
    print("LAYER 2 EVALUATION RESULTS (Vertex AI)")
    print("=" * 60)
    
    total_sessions = len(results)
    total_passed = sum(1 for r in results if r.pass_rate >= 0.7)
    
    print(f"\n📊 Summary: {total_passed}/{total_sessions} sessions passed")
    print("-" * 60)
    
    # Per-pillar summary
    pillar_stats: Dict[str, Dict[str, int]] = {}
    for result in results:
        for check in result.checks:
            pid = check.pillar_id
            if pid not in pillar_stats:
                pillar_stats[pid] = {"passed": 0, "failed": 0}
            if check.passed:
                pillar_stats[pid]["passed"] += 1
            else:
                pillar_stats[pid]["failed"] += 1
    
    if pillar_stats:
        print("\n📋 Per-Pillar Results:")
        for pid, stats in sorted(pillar_stats.items()):
            total = stats["passed"] + stats["failed"]
            rate = stats["passed"] / total if total > 0 else 0
            status = "✅" if rate >= 0.7 else "❌"
            print(f"   {status} {pid}: {stats['passed']}/{total} ({rate:.0%})")
    
    print("\n" + "-" * 60)
    print("📝 Session Details:")
    
    for result in results:
        status = "✅" if result.pass_rate >= 0.7 else "❌"
        print(f"\n{status} {result.title[:50]}")
        print(f"   ID: {result.session_id}")
        
        for check in result.checks:
            check_status = "✅" if check.passed else "❌"
            print(f"   {check_status} {check.pillar_id}: {check.score:.2f} ({check.rubrics_source})")
            if not check.passed and check.explanation:
                # Truncate long explanations
                expl = check.explanation[:200]
                if len(check.explanation) > 200:
                    expl += "..."
                print(f"      → {expl}")


def export_results(results: List[L2SessionResult], output_path: str) -> None:
    """Export results to JSON file."""
    export_data = {
        "summary": {
            "total_sessions": len(results),
            "passed_sessions": sum(1 for r in results if r.pass_rate >= 0.7),
            "overall_pass_rate": sum(r.pass_rate for r in results) / len(results) if results else 0
        },
        "sessions": []
    }
    
    for result in results:
        export_data["sessions"].append({
            "session_id": result.session_id,
            "created": result.created,
            "title": result.title,
            "pass_rate": result.pass_rate,
            "checks": [
                {
                    "metric_name": c.metric_name,
                    "pillar_id": c.pillar_id,
                    "score": c.score,
                    "passed": c.passed,
                    "explanation": c.explanation,
                    "rubrics_source": c.rubrics_source
                }
                for c in result.checks
            ]
        })
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(export_data, f, indent=2)
    
    print(f"\n✅ Results exported to: {output_path}")


# =============================================================================
# CLI Commands
# =============================================================================

def cmd_evaluate(args):
    """Run Layer 2 evaluation on input file."""
    input_path = args.input
    pillar = args.pillar
    output_path = args.output
    verbose = args.verbose
    
    print(f"🔍 Loading evaluation data from: {input_path}")
    sessions = load_eval_data(input_path)
    print(f"   Found {len(sessions)} session(s)")
    
    if pillar:
        print(f"   Focusing on pillar: {pillar}")
        guidelines, source = get_guidelines_for_pillar(pillar)
        print(f"   Using: {source}")
    else:
        print(f"   Evaluating all pillars")
    
    results = evaluate_sessions(sessions, pillar=pillar, verbose=verbose)
    print_results(results)
    
    if output_path:
        export_results(results, output_path)
    
    # Return exit code based on pass rate
    total_sessions = len(results)
    total_passed = sum(1 for r in results if r.pass_rate >= 0.7)
    pass_rate = total_passed / total_sessions if total_sessions > 0 else 0.0
    
    threshold = args.threshold
    if pass_rate < threshold:
        print(f"\n❌ FAILED: Pass rate {pass_rate:.1%} < threshold {threshold:.1%}")
        sys.exit(1)
    else:
        print(f"\n✅ PASSED: Pass rate {pass_rate:.1%} >= threshold {threshold:.1%}")
        sys.exit(0)


def cmd_metrics(args):
    """List available metrics and guidelines."""
    print("📋 Available Evaluation Metrics\n")
    print("=" * 60)
    
    print("\n🎯 Pillar-Specific Metrics:")
    print("-" * 60)
    
    for pillar_id, pillar_name in [
        ("S1", "Stateless-First"),
        ("P2", "Pair Programming"),
        ("C3", "Context Engineering"),
        ("J4", "Journalism Quality")
    ]:
        guidelines, source = get_guidelines_for_pillar(pillar_id)
        status = "✅" if guidelines else "❌"
        print(f"  {status} {pillar_id}  {pillar_name:<25} ({source})")
    
    print("\n📖 Usage Examples:")
    print("-" * 60)
    print("  python layer2_vertex.py evaluate --input eval.json")
    print("  python layer2_vertex.py evaluate --input eval.json --pillar P2")
    print("  python layer2_vertex.py evaluate --input eval.json --output results.json -v")


def cmd_show_guidelines(args):
    """Show guidelines for a specific pillar."""
    pillar = args.pillar
    guidelines, source = get_guidelines_for_pillar(pillar)
    
    print(f"📋 Guidelines for {pillar} ({source})")
    print("=" * 60)
    print()
    print(guidelines)


def main():
    parser = argparse.ArgumentParser(
        description="Layer 2 Evaluation: Vertex AI GenAI Client Integration",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # Evaluate command
    eval_parser = subparsers.add_parser("evaluate", help="Run Layer 2 evaluation")
    eval_parser.add_argument("--input", "-i", required=True, help="Input JSON file path")
    eval_parser.add_argument("--pillar", "-p", choices=["S1", "P2", "C3", "J4"],
                            help="Focus on specific pillar (default: all)")
    eval_parser.add_argument("--output", "-o", help="Output JSON file for results")
    eval_parser.add_argument("--threshold", "-t", type=float, default=0.7,
                            help="Pass rate threshold (default: 0.7)")
    eval_parser.add_argument("--verbose", "-v", action="store_true",
                            help="Print detailed progress")
    
    # Metrics command
    metrics_parser = subparsers.add_parser("metrics", help="List available metrics")
    
    # Show guidelines command
    show_parser = subparsers.add_parser("show", help="Show guidelines for a pillar")
    show_parser.add_argument("pillar", choices=["S1", "P2", "C3", "J4"],
                            help="Pillar to show guidelines for")
    
    args = parser.parse_args()
    
    if args.command == "evaluate":
        cmd_evaluate(args)
    elif args.command == "metrics":
        cmd_metrics(args)
    elif args.command == "show":
        cmd_show_guidelines(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()