#!/usr/bin/env python3
"""
Evaluation Transform Pipeline

Transforms raw session data (from eval_ingest.py) into format-specific outputs
for different evaluation consumers.

Design References:
- LOG-043: Vertex AI rubric-based evaluation, tool_use schema
- LOG-042: Turn-structured output schema (DECISION-042d)

Pipeline Position: INGEST (eval_ingest.py) → TRANSFORM (this) → CONSUME (eval_consume.py)

Usage:
    # Transform to Vertex AI format
    python eval_transform.py vertex --input eval_run_2026-02-14_2119.json
    
    # Auto-detect latest eval_run file
    python eval_transform.py vertex
    
    # List available input files
    python eval_transform.py list
"""

import argparse
import glob
import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Optional

# =============================================================================
# Schema Transformations
# =============================================================================

def transform_to_vertex(session: dict) -> dict:
    """
    Transform raw session to Vertex AI evaluation format.
    
    Input format (from eval_ingest.py):
    {
        "session_id": "ses_...",
        "created": "2026-02-14T09:15:00",
        "prompt": "User instruction text (concatenated)",
        "response": "Agent response text (concatenated)", 
        "generated_trajectory": [
            {"tool": "fs.grep", "tool_raw": "mcp_...", "args": {...}, "output": "..."},
        ]
    }
    
    Output format (Vertex AI expected):
    {
        "session_id": "ses_...",
        "created": "2026-02-14T09:15:00",
        "title": "Session title",
        "prompt": "Full user instructions",
        "response": "Full agent response",
        "tool_use": [
            {"tool_name": "fs.grep", "tool_input": {...}, "tool_output": "..."},
        ]
    }
    
    Key transformations:
    1. generated_trajectory → tool_use (Vertex schema)
    2. tool → tool_name
    3. args → tool_input  
    4. output → tool_output
    5. prompt/response: Keep FULL content (Vertex rubric metrics need complete context)
    
    Reference: LOG-043 Section 3
    """
    # Transform tool trajectory to Vertex format
    tool_use = []
    for call in session.get("generated_trajectory", []):
        tool_use.append({
            "tool_name": call.get("tool", "unknown"),
            "tool_input": call.get("args", {}),
            "tool_output": call.get("output", "")
        })
    
    # Keep FULL response — Vertex rubric metrics need complete context
    # Previous bug: split by "\n\n" and took last chunk, losing 99% of content
    # Reference: LOG-043 Section 3 — GENERAL_QUALITY, TEXT_QUALITY evaluate full responses
    full_response = session.get("response", "")
    
    return {
        "session_id": session.get("session_id", ""),
        "created": session.get("created", ""),
        "title": session.get("title", ""),
        "prompt": session.get("prompt", ""),
        "response": full_response,  # FULL response, not truncated
        "tool_use": tool_use,
        # Metadata for debugging
        "_response_length": len(full_response),
        "_tool_count": len(tool_use),
    }


def transform_file_to_vertex(input_path: Path, output_path: Path) -> int:
    """
    Transform entire file from raw to Vertex format.
    
    Returns number of sessions transformed.
    """
    with open(input_path, "r", encoding="utf-8") as f:
        sessions = json.load(f)
    
    if not isinstance(sessions, list):
        sessions = [sessions]
    
    transformed = [transform_to_vertex(s) for s in sessions]
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(transformed, f, indent=2)
    
    return len(transformed)


# =============================================================================
# File Discovery
# =============================================================================

def find_eval_files(directory: Path = Path(".")) -> List[Path]:
    """
    Find eval_run_*.json files in directory.
    
    Returns files sorted by modification time (newest first).
    Excludes already-transformed files (*_vertex.json, *_turns.json).
    """
    pattern = str(directory / "eval_run_*.json")
    all_files = glob.glob(pattern)
    
    # Filter out transformed files
    raw_files = [
        Path(f) for f in all_files 
        if not f.endswith("_vertex.json") 
        and not f.endswith("_turns.json")
    ]
    
    # Sort by modification time (newest first)
    raw_files.sort(key=lambda p: p.stat().st_mtime, reverse=True)
    
    return raw_files


def generate_output_path(input_path: Path, suffix: str) -> Path:
    """
    Generate output path by inserting suffix before .json extension.
    
    eval_run_2026-02-14_2119.json → eval_run_2026-02-14_2119_vertex.json
    """
    stem = input_path.stem  # eval_run_2026-02-14_2119
    return input_path.parent / f"{stem}_{suffix}.json"


# =============================================================================
# CLI Commands
# =============================================================================

def cmd_vertex(args):
    """
    Transform raw eval file to Vertex AI format.
    
    Interactive: if no input specified, shows available files.
    """
    # Determine input file
    if args.input:
        input_path = Path(args.input)
        if not input_path.exists():
            print(f"❌ Input file not found: {input_path}")
            return 1
    else:
        # Auto-detect: find eval_run files
        eval_files = find_eval_files()
        
        if not eval_files:
            print("❌ No eval_run_*.json files found in current directory.")
            print("   Run eval_ingest.py first to extract sessions.")
            return 1
        
        if len(eval_files) == 1:
            input_path = eval_files[0]
            print(f"📄 Auto-detected: {input_path.name}")
        else:
            # Interactive selection
            print("📁 Available eval files:")
            print("─" * 50)
            for i, f in enumerate(eval_files, 1):
                size_kb = f.stat().st_size / 1024
                mtime = f.stat().st_mtime
                from datetime import datetime
                mtime_str = datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M")
                print(f"  [{i}] {f.name:<40} ({size_kb:.1f} KB, {mtime_str})")
            print()
            
            try:
                selection = input(f"Select file [1-{len(eval_files)}]: ").strip()
                idx = int(selection)
                if idx < 1 or idx > len(eval_files):
                    print(f"❌ Invalid selection")
                    return 1
                input_path = eval_files[idx - 1]
            except (ValueError, EOFError, KeyboardInterrupt):
                print("\nCancelled.")
                return 1
    
    # Determine output path
    if args.output:
        output_path = Path(args.output)
    else:
        output_path = generate_output_path(input_path, "vertex")
    
    # Check for existing output
    if output_path.exists() and not args.force:
        print(f"⚠️  Output file exists: {output_path.name}")
        try:
            overwrite = input("Overwrite? [y/N]: ").strip().lower()
            if overwrite != "y":
                print("Aborted.")
                return 1
        except (EOFError, KeyboardInterrupt):
            print("\nCancelled.")
            return 1
    
    # Transform
    print()
    print(f"🔄 Transforming to Vertex AI format...")
    print(f"   Input:  {input_path.name}")
    print(f"   Output: {output_path.name}")
    
    try:
        count = transform_file_to_vertex(input_path, output_path)
        print()
        print(f"✅ Transformed {count} sessions")
        print(f"   Output: {output_path}")
        
        # Show sample of first session
        if args.preview:
            with open(output_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            if data:
                print()
                print("📋 Preview (first session):")
                print("─" * 50)
                sample = data[0]
                print(f"   session_id: {sample.get('session_id', '')[:20]}...")
                print(f"   tool_use: {sample.get('_tool_count', 0)} calls")
                print(f"   response length: {sample.get('_raw_response_length', 0)} chars")
        
        return 0
        
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON in input file: {e}")
        return 1
    except Exception as e:
        print(f"❌ Transform failed: {e}")
        return 1


def cmd_list(args):
    """List available eval files and their transform status."""
    eval_files = find_eval_files()
    
    if not eval_files:
        print("❌ No eval_run_*.json files found.")
        return 1
    
    print("📁 Eval Files:")
    print("─" * 70)
    print(f"  {'File':<45} {'Size':<10} {'Transforms'}")
    print("─" * 70)
    
    for f in eval_files:
        size_kb = f.stat().st_size / 1024
        
        # Check for transforms
        transforms = []
        vertex_path = generate_output_path(f, "vertex")
        turns_path = generate_output_path(f, "turns")
        
        if vertex_path.exists():
            transforms.append("vertex")
        if turns_path.exists():
            transforms.append("turns")
        
        transform_str = ", ".join(transforms) if transforms else "—"
        print(f"  {f.name:<45} {size_kb:>6.1f} KB  {transform_str}")
    
    print()
    print("💡 Transform commands:")
    print("   python eval_transform.py vertex --input <file>")
    
    return 0


def cmd_inspect(args):
    """Inspect a transformed file (debugging)."""
    input_path = Path(args.input)
    
    if not input_path.exists():
        print(f"❌ File not found: {input_path}")
        return 1
    
    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    if not isinstance(data, list):
        data = [data]
    
    print(f"📋 File: {input_path.name}")
    print(f"   Sessions: {len(data)}")
    print()
    
    for i, session in enumerate(data[:args.limit], 1):
        print(f"─── Session {i} ───")
        print(f"   ID: {session.get('session_id', 'N/A')}")
        print(f"   Created: {session.get('created', 'N/A')}")
        
        # Check format type
        if "tool_use" in session:
            print(f"   Format: Vertex AI")
            print(f"   Tools: {len(session.get('tool_use', []))}")
        elif "generated_trajectory" in session:
            print(f"   Format: Raw (ingest)")
            print(f"   Tools: {len(session.get('generated_trajectory', []))}")
        
        print(f"   Prompt length: {len(session.get('prompt', ''))} chars")
        print(f"   Response length: {len(session.get('response', ''))} chars")
        print()
    
    if len(data) > args.limit:
        print(f"   ... and {len(data) - args.limit} more sessions")
    
    return 0


# =============================================================================
# Main
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Evaluation Transform Pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Pipeline Position:
  eval_ingest.py (extract) → eval_transform.py (this) → eval_consume.py (evaluate)

Examples:
  # Transform to Vertex AI format (auto-detect input)
  python eval_transform.py vertex
  
  # Transform specific file
  python eval_transform.py vertex --input eval_run_2026-02-14_2119.json
  
  # List available files and transform status
  python eval_transform.py list
  
  # Inspect transformed file
  python eval_transform.py inspect --input eval_run_2026-02-14_2119_vertex.json
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Transform commands")
    
    # vertex command
    vertex_parser = subparsers.add_parser("vertex", help="Transform to Vertex AI format")
    vertex_parser.add_argument("--input", "-i", help="Input file (raw eval_run_*.json)")
    vertex_parser.add_argument("--output", "-o", help="Output file (default: <input>_vertex.json)")
    vertex_parser.add_argument("--force", "-f", action="store_true", help="Overwrite existing output")
    vertex_parser.add_argument("--preview", "-p", action="store_true", help="Show preview of first session")
    
    # list command
    list_parser = subparsers.add_parser("list", help="List eval files and transform status")
    
    # inspect command
    inspect_parser = subparsers.add_parser("inspect", help="Inspect a transformed file")
    inspect_parser.add_argument("--input", "-i", required=True, help="File to inspect")
    inspect_parser.add_argument("--limit", type=int, default=3, help="Max sessions to show (default: 3)")
    
    args = parser.parse_args()
    
    if args.command == "vertex":
        sys.exit(cmd_vertex(args))
    elif args.command == "list":
        sys.exit(cmd_list(args))
    elif args.command == "inspect":
        sys.exit(cmd_inspect(args))
    else:
        parser.print_help()
        sys.exit(0)


if __name__ == "__main__":
    main()