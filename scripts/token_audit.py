#!/usr/bin/env python3
"""
Token Audit Script for GSD-Lite

Scans all *.md files under a directory and reports token counts using tiktoken.
Helps identify which files consume the most token budget.

Usage:
    python scripts/token_audit.py [directory] [--model MODEL] [--top N]

Examples:
    python scripts/token_audit.py ./src
    python scripts/token_audit.py ./src --model gpt-4 --top 10
    python scripts/token_audit.py ./src/gsd_lite/template --top 5
"""

import argparse
from pathlib import Path
from typing import NamedTuple

try:
    import tiktoken
except ImportError:
    print("Error: tiktoken not installed. Run: pip install tiktoken")
    exit(1)


class FileTokenInfo(NamedTuple):
    path: Path
    tokens: int
    lines: int
    chars: int
    tokens_per_line: float


def count_tokens(text: str, model: str = "cl100k_base") -> int:
    """Count tokens using tiktoken encoding."""
    try:
        # Try to get encoding for specific model
        enc = tiktoken.encoding_for_model(model)
    except KeyError:
        # Fall back to cl100k_base (used by GPT-4, Claude uses similar)
        enc = tiktoken.get_encoding("cl100k_base")
    return len(enc.encode(text))


def scan_markdown_files(directory: Path, model: str) -> list[FileTokenInfo]:
    """Scan all .md files and return token info."""
    results = []
    
    for md_file in directory.rglob("*.md"):
        try:
            content = md_file.read_text(encoding="utf-8")
            tokens = count_tokens(content, model)
            lines = len(content.splitlines())
            chars = len(content)
            tokens_per_line = tokens / lines if lines > 0 else 0
            
            results.append(FileTokenInfo(
                path=md_file,
                tokens=tokens,
                lines=lines,
                chars=chars,
                tokens_per_line=round(tokens_per_line, 1)
            ))
        except Exception as e:
            print(f"Warning: Could not read {md_file}: {e}")
    
    return results


def format_table(results: list[FileTokenInfo], base_dir: Path, top_n: int | None = None) -> str:
    """Format results as a table."""
    # Sort by tokens descending
    sorted_results = sorted(results, key=lambda x: x.tokens, reverse=True)
    
    if top_n:
        sorted_results = sorted_results[:top_n]
    
    # Calculate totals
    total_tokens = sum(r.tokens for r in results)
    total_lines = sum(r.lines for r in results)
    total_chars = sum(r.chars for r in results)
    
    # Build table
    lines = []
    lines.append("")
    lines.append("=" * 90)
    lines.append("GSD-LITE TOKEN AUDIT REPORT")
    lines.append("=" * 90)
    lines.append("")
    lines.append(f"Directory: {base_dir.resolve()}")
    lines.append(f"Files scanned: {len(results)}")
    lines.append(f"Total tokens: {total_tokens:,}")
    lines.append(f"Total lines: {total_lines:,}")
    lines.append(f"Total chars: {total_chars:,}")
    lines.append("")
    lines.append("-" * 90)
    lines.append(f"{'File':<50} {'Tokens':>10} {'Lines':>8} {'Tok/Line':>10} {'% Total':>10}")
    lines.append("-" * 90)
    
    for info in sorted_results:
        rel_path = info.path.relative_to(base_dir)
        pct = (info.tokens / total_tokens * 100) if total_tokens > 0 else 0
        lines.append(
            f"{str(rel_path):<50} {info.tokens:>10,} {info.lines:>8,} {info.tokens_per_line:>10.1f} {pct:>9.1f}%"
        )
    
    lines.append("-" * 90)
    lines.append(f"{'TOTAL':<50} {total_tokens:>10,} {total_lines:>8,} {'-':>10} {'100.0':>9}%")
    lines.append("")
    
    # Add category breakdown
    lines.append("")
    lines.append("CATEGORY BREAKDOWN:")
    lines.append("-" * 50)
    
    categories = {}
    for info in results:
        # Determine category from path
        parts = info.path.parts
        if "workflows" in parts:
            cat = "workflows/"
        elif "agents" in parts:
            cat = "agents/"
        elif "references" in parts:
            cat = "references/"
        elif "constitution" in parts:
            cat = "constitution/"
        elif "template" in parts:
            cat = "template/ (root)"
        else:
            cat = "other/"
        
        if cat not in categories:
            categories[cat] = {"tokens": 0, "files": 0}
        categories[cat]["tokens"] += info.tokens
        categories[cat]["files"] += 1
    
    for cat, data in sorted(categories.items(), key=lambda x: x[1]["tokens"], reverse=True):
        pct = (data["tokens"] / total_tokens * 100) if total_tokens > 0 else 0
        lines.append(f"  {cat:<30} {data['tokens']:>8,} tokens ({data['files']} files) {pct:>6.1f}%")
    
    lines.append("")
    
    # Add recommendations
    lines.append("")
    lines.append("OBSERVATIONS:")
    lines.append("-" * 50)
    
    if sorted_results:
        biggest = sorted_results[0]
        lines.append(f"  • Largest file: {biggest.path.name} ({biggest.tokens:,} tokens)")
        
        # Files over 1000 tokens
        large_files = [r for r in results if r.tokens > 1000]
        if large_files:
            lines.append(f"  • Files over 1,000 tokens: {len(large_files)}")
        
        # Dense files (high tokens per line)
        dense_files = [r for r in results if r.tokens_per_line > 15]
        if dense_files:
            lines.append(f"  • Dense files (>15 tok/line): {[r.path.name for r in dense_files]}")
    
    lines.append("")
    
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(
        description="Audit token usage in GSD-Lite markdown files",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python scripts/token_audit.py ./src
    python scripts/token_audit.py ./src/gsd_lite/template --top 5
    python scripts/token_audit.py . --model gpt-4
        """
    )
    parser.add_argument(
        "directory",
        nargs="?",
        default="./src",
        help="Directory to scan (default: ./src)"
    )
    parser.add_argument(
        "--model",
        default="cl100k_base",
        help="Tiktoken model/encoding (default: cl100k_base, works for GPT-4/Claude)"
    )
    parser.add_argument(
        "--top",
        type=int,
        default=None,
        help="Show only top N files by token count"
    )
    
    args = parser.parse_args()
    directory = Path(args.directory)
    
    if not directory.exists():
        print(f"Error: Directory '{directory}' does not exist")
        exit(1)
    
    results = scan_markdown_files(directory, args.model)
    
    if not results:
        print(f"No .md files found in {directory}")
        exit(0)
    
    report = format_table(results, directory, args.top)
    print(report)


if __name__ == "__main__":
    main()