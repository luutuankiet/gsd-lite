#!/usr/bin/env python3
"""
GSD-Lite Worklog Parser

Parses WORK.md into a JSON AST for the worklog viewer.
Dead simple contract:
  ### [LOG-NNN] - [TYPE] - {title}
       ↑ extract  ↑ extract  ↑ everything else, verbatim

Superseded detection: title contains ~~...~~ → superseded: true
"""

import re
import json
import sys
from dataclasses import dataclass, field, asdict
from pathlib import Path


@dataclass
class Section:
    """A header section (H2-H5) in the worklog."""
    level: int
    title: str
    line: int
    children: list["Section"] = field(default_factory=list)


@dataclass 
class LogEntry:
    """A LOG-NNN entry with metadata."""
    id: str
    type: str
    title: str
    superseded: bool
    line: int
    children: list[Section] = field(default_factory=list)


@dataclass
class WorklogAST:
    """Root AST node containing all parsed content."""
    sections: list[Section] = field(default_factory=list)
    logs: list[LogEntry] = field(default_factory=list)


# Patterns
LOG_HEADER_PATTERN = re.compile(
    r'^### \[LOG-(\d+)\] - \[([A-Z_]+)\] - (.+)$'
)
SECTION_HEADER_PATTERN = re.compile(
    r'^(#{2,5}) (.+)$'
)
STRIKETHROUGH_PATTERN = re.compile(r'~~.+~~')


def parse_worklog(filepath: Path) -> WorklogAST:
    """
    Parse WORK.md into structured AST.
    
    Returns:
        WorklogAST with sections (H2) and logs (H3 matching LOG-NNN pattern)
    """
    ast = WorklogAST()
    lines = filepath.read_text().splitlines()
    
    # Stack for tracking hierarchy: (level, node)
    # We'll build a flat list of logs and top-level sections
    current_log: LogEntry | None = None
    section_stack: list[tuple[int, Section | LogEntry]] = []
    
    # Track fenced code blocks - skip parsing inside them
    in_code_fence = False
    
    for line_num, line in enumerate(lines, start=1):
        # Toggle code fence state (``` or ~~~)
        if line.startswith('```') or line.startswith('~~~'):
            in_code_fence = not in_code_fence
            continue
        
        # Skip all parsing inside code fences
        if in_code_fence:
            continue
        
        # Try LOG entry first (H3 with specific format)
        log_match = LOG_HEADER_PATTERN.match(line)
        if log_match:
            log_id = f"LOG-{log_match.group(1)}"
            log_type = log_match.group(2)
            title = log_match.group(3)
            superseded = bool(STRIKETHROUGH_PATTERN.search(title))
            
            current_log = LogEntry(
                id=log_id,
                type=log_type,
                title=title,
                superseded=superseded,
                line=line_num,
            )
            ast.logs.append(current_log)
            # Reset stack - log entries are top-level containers
            section_stack = [(3, current_log)]
            continue
        
        # Try generic section header (H2-H5)
        section_match = SECTION_HEADER_PATTERN.match(line)
        if section_match:
            hashes = section_match.group(1)
            level = len(hashes)
            title = section_match.group(2)
            
            section = Section(
                level=level,
                title=title,
                line=line_num,
            )
            
            # H2 sections are top-level (outside logs)
            if level == 2:
                ast.sections.append(section)
                section_stack = [(2, section)]
                current_log = None
                continue
            
            # H3 that's NOT a log entry - treat as section
            if level == 3 and current_log is None:
                ast.sections.append(section)
                section_stack = [(3, section)]
                continue
            
            # H4/H5 - nest under current parent
            if section_stack:
                # Pop stack until we find a parent with lower level
                while section_stack and section_stack[-1][0] >= level:
                    section_stack.pop()
                
                if section_stack:
                    parent = section_stack[-1][1]
                    parent.children.append(section)
                
                section_stack.append((level, section))
    
    return ast


def ast_to_dict(ast: WorklogAST) -> dict:
    """Convert AST to JSON-serializable dict."""
    def section_to_dict(s: Section) -> dict:
        return {
            "level": s.level,
            "title": s.title,
            "line": s.line,
            "children": [section_to_dict(c) for c in s.children],
        }
    
    def log_to_dict(log: LogEntry) -> dict:
        return {
            "id": log.id,
            "type": log.type,
            "title": log.title,
            "superseded": log.superseded,
            "line": log.line,
            "children": [section_to_dict(c) for c in log.children],
        }
    
    return {
        "sections": [section_to_dict(s) for s in ast.sections],
        "logs": [log_to_dict(log) for log in ast.logs],
    }


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("Usage: python parse_worklog.py <path-to-WORK.md>", file=sys.stderr)
        sys.exit(1)
    
    filepath = Path(sys.argv[1])
    if not filepath.exists():
        print(f"Error: File not found: {filepath}", file=sys.stderr)
        sys.exit(1)
    
    ast = parse_worklog(filepath)
    output = ast_to_dict(ast)
    
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()