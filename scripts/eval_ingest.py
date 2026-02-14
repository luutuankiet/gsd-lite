#!/usr/bin/env python3
"""
OpenCode Session Evaluation Helper (SQLite Edition)

Parses OpenCode session data from SQLite database for GSD-Lite evaluation pipeline.
Refactored from filesystem-based approach after OpenCode migrated to SQLite storage.

Design References:
- LOG-032: OpenCode native JSON as data source
- LOG-033: Session fingerprinting via fs-mcp paths
- LOG-038: Parser specification and output schema
- LOG-040: Time partitioning and streaming architecture

Database Location:
    ~/.local/share/opencode/opencode.db

Usage:
    # List available projects
    python eval_ingest.py projects
    
    # Interactive collect workflow
    python eval_ingest.py collect --project /path/to/project --since 2h
    
    # Extract specific partition
    python eval_ingest.py extract --project /path/to/project --partition 1
"""

import argparse
import json
import os
import re
import sys
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Generator, List, Optional, Set, Tuple, Any

from sqlmodel import Field, Session, SQLModel, create_engine, select

try:
    import yaml
    YAML_AVAILABLE = True
except ImportError:
    YAML_AVAILABLE = False


# =============================================================================
# Configuration
# =============================================================================

# Database path
DB_PATH = Path(os.path.expanduser("~/.local/share/opencode/opencode.db"))

# Regex patterns for path extraction
GREP_FILE_PATTERN = re.compile(r"File:\s+([^\n,]+)")

# Default config path
DEFAULT_CONFIG_PATH = Path(__file__).parent / "eval_config.yaml"


# =============================================================================
# SQLModel Database Models
# =============================================================================

class Project(SQLModel, table=True):
    """OpenCode project table."""
    id: str = Field(primary_key=True)
    worktree: str
    vcs: Optional[str] = None
    name: Optional[str] = None
    icon_url: Optional[str] = None
    icon_color: Optional[str] = None
    time_created: int
    time_updated: int
    time_initialized: Optional[int] = None
    sandboxes: str
    commands: Optional[str] = None


class SessionModel(SQLModel, table=True):
    """OpenCode session table."""
    __tablename__ = "session"
    
    id: str = Field(primary_key=True)
    project_id: str = Field(foreign_key="project.id")
    parent_id: Optional[str] = None
    slug: str
    directory: str
    title: str
    version: str
    share_url: Optional[str] = None
    summary_additions: Optional[int] = None
    summary_deletions: Optional[int] = None
    summary_files: Optional[int] = None
    summary_diffs: Optional[str] = None
    revert: Optional[str] = None
    permission: Optional[str] = None
    time_created: int
    time_updated: int
    time_compacting: Optional[int] = None
    time_archived: Optional[int] = None


class Message(SQLModel, table=True):
    """OpenCode message table."""
    id: str = Field(primary_key=True)
    session_id: str = Field(foreign_key="session.id")
    time_created: int
    time_updated: int
    data: str  # JSON blob


class Part(SQLModel, table=True):
    """OpenCode part table (tool calls, text, reasoning)."""
    id: str = Field(primary_key=True)
    message_id: str = Field(foreign_key="message.id")
    session_id: str = Field(foreign_key="session.id")
    time_created: int
    time_updated: int
    data: str  # JSON blob


# =============================================================================
# Database Connection
# =============================================================================

def get_engine():
    """Create SQLite engine for OpenCode database."""
    if not DB_PATH.exists():
        raise FileNotFoundError(f"OpenCode database not found: {DB_PATH}")
    return create_engine(f"sqlite:///{DB_PATH}", echo=False)


def get_session():
    """Create database session."""
    engine = get_engine()
    return Session(engine)


# =============================================================================
# Configuration Management (unchanged from original)
# =============================================================================

class EvalConfig:
    """
    Configuration for evaluation pipeline.
    
    Handles tool name normalization: maps physical tool names (from storage)
    to logical capabilities (standardized for evaluation).
    """
    
    def __init__(self, config_path: Optional[Path] = None):
        self.tool_mappings: Dict[str, List[str]] = {}
        self._reverse_map: Dict[str, str] = {}
        
        if config_path and config_path.exists():
            self._load_config(config_path)
        else:
            self._load_defaults()
        
        self._build_reverse_map()
    
    def _load_config(self, config_path: Path) -> None:
        """Load config from YAML file."""
        if not YAML_AVAILABLE:
            print("⚠️  PyYAML not installed. Using default tool mappings.", file=sys.stderr)
            self._load_defaults()
            return
        
        with open(config_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
        
        self.tool_mappings = data.get("tool_mappings", {})
    
    def _load_defaults(self) -> None:
        """Load default tool mappings."""
        self.tool_mappings = {
            "fs.read": [
                "tools_fs_read_files",
                "mcp_tools_gsd-lite-fs_read_files",
                "mcp_tools_home-fs_read_files",
                "tools_gsd-lite-fs_read_files",
            ],
            "fs.grep": [
                "tools_fs_grep_content",
                "mcp_tools_gsd-lite-fs_grep_content",
                "mcp_tools_home-fs_grep_content",
                "tools_gsd-lite-fs_grep_content",
            ],
            "fs.edit": [
                "tools_fs_propose_and_review",
                "mcp_tools_gsd-lite-fs_propose_and_review",
                "mcp_tools_home-fs_propose_and_review",
                "tools_gsd-lite-fs_propose_and_review",
            ],
            "fs.commit": [
                "tools_fs_commit_review",
                "mcp_tools_gsd-lite-fs_commit_review",
                "mcp_tools_home-fs_commit_review",
            ],
            "fs.list": [
                "tools_fs_list_directory_with_sizes",
                "mcp_tools_gsd-lite-fs_list_directory_with_sizes",
                "mcp_tools_gsd-lite-fs_directory_tree",
                "tools_gsd-lite-fs_list_directory_with_sizes",
                "tools_gsd-lite-fs_directory_tree",
            ],
            "fs.search": [
                "tools_fs_search_files",
                "mcp_tools_gsd-lite-fs_search_files",
            ],
            "web.fetch": [
                "mcp_webfetch",
                "mcp_tools_mmcp_url_to_markdown__md",
            ],
            "github.read": [
                "mcp_tools_mmcp_github__get_file_contents",
                "mcp_tools_mmcp_github__list_commits",
                "mcp_tools_mmcp_github__list_issues",
            ],
            "bash": [
                "mcp_bash",
            ],
        }
    
    def _build_reverse_map(self) -> None:
        """Build reverse mapping: physical tool name -> logical capability."""
        self._reverse_map = {}
        for logical, physical_list in self.tool_mappings.items():
            for physical in physical_list:
                self._reverse_map[physical] = logical
    
    def normalize_tool(self, physical_name: str) -> str:
        """Normalize physical tool name to logical capability."""
        if physical_name in self._reverse_map:
            return self._reverse_map[physical_name]
        return f"raw.{physical_name}"
    
    def is_known_tool(self, physical_name: str) -> bool:
        """Check if tool is in our mapping."""
        return physical_name in self._reverse_map


# Global config instance
_config: Optional[EvalConfig] = None


def get_config(config_path: Optional[Path] = None) -> EvalConfig:
    """Get or create config instance."""
    global _config
    if _config is None:
        _config = EvalConfig(config_path)
    return _config


def load_config(config_path: Path) -> None:
    """Explicitly load config from path."""
    global _config
    _config = EvalConfig(config_path)


# =============================================================================
# Data Classes
# =============================================================================

class SessionMeta:
    """Lightweight session metadata."""
    
    def __init__(self, session_id: str, created_ms: int, title: str = ""):
        self.session_id = session_id
        self.created_ms = created_ms
        self.title = title
        self._dt = datetime.fromtimestamp(created_ms / 1000)
    
    @property
    def created(self) -> str:
        """ISO format timestamp."""
        return self._dt.strftime("%Y-%m-%dT%H:%M:%S")
    
    @property
    def date(self) -> str:
        """Date portion."""
        return self._dt.strftime("%Y-%m-%d")
    
    @property
    def time(self) -> str:
        """Time portion."""
        return self._dt.strftime("%H:%M:%S")
    
    @property
    def time_short(self) -> str:
        """HH:MM format."""
        return self._dt.strftime("%H:%M")
    
    def __repr__(self):
        return f"SessionMeta({self.session_id}, {self.created})"


# =============================================================================
# Fingerprinting (Project Identification)
# =============================================================================

def extract_paths_from_output(tool_name: str, output: str) -> Set[str]:
    """Extract absolute paths from tool output."""
    paths = set()
    
    if not output:
        return paths
    
    # list_allowed_directories: newline-separated paths
    if "list_allowed_directories" in tool_name:
        for line in output.splitlines():
            line = line.strip()
            if line.startswith("/"):
                paths.add(line)
        return paths
    
    # grep_content / read_files: "File: /path" pattern
    if "grep_content" in tool_name or "read_files" in tool_name:
        matches = GREP_FILE_PATTERN.findall(output)
        paths.update(matches)
    
    return paths


def path_matches_project(path: str, target_project: str) -> bool:
    """Check if path matches target project."""
    # Absolute path match
    if target_project in path:
        return True
    
    # Relative path match
    project_name = os.path.basename(target_project.rstrip("/"))
    project_name_normalized = project_name.replace("_", "-").lower()
    path_normalized = path.replace("_", "-").lower()
    
    if path_normalized.startswith(project_name_normalized + "/"):
        return True
    if f"/{project_name_normalized}/" in f"/{path_normalized}/":
        return True
    
    return False


def fingerprint_session(session_id: str, target_project: str) -> bool:
    """
    Check if session touched the target project.
    
    Queries parts table for tool calls and extracts paths from outputs.
    """
    with get_session() as db:
        # Get all tool parts for this session
        statement = select(Part).where(Part.session_id == session_id)
        parts = db.exec(statement).all()
        
        for part in parts:
            try:
                data = json.loads(part.data)
            except json.JSONDecodeError:
                continue
            
            if data.get("type") != "tool":
                continue
            
            tool_name = data.get("tool", "")
            state = data.get("state", {})
            output = state.get("output", "")
            
            if not output:
                continue
            
            paths = extract_paths_from_output(tool_name, output)
            
            for path in paths:
                if path_matches_project(path, target_project):
                    return True
    
    return False


# =============================================================================
# Time Parsing
# =============================================================================

def parse_since(since_str: str) -> datetime:
    """Parse --since argument into datetime cutoff."""
    since_str = since_str.strip().lower()
    now = datetime.now()
    
    # Minutes: "30m"
    if since_str.endswith("m"):
        try:
            minutes = int(since_str[:-1])
            return now - timedelta(minutes=minutes)
        except ValueError:
            pass
    
    # Hours: "1h", "2h"
    if since_str.endswith("h"):
        try:
            hours = int(since_str[:-1])
            return now - timedelta(hours=hours)
        except ValueError:
            pass
    
    # Today: midnight
    if since_str == "today":
        return now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # ISO date: "2026-02-14"
    try:
        return datetime.strptime(since_str, "%Y-%m-%d")
    except ValueError:
        pass
    
    # Fallback: 1 hour ago
    print(f"⚠️  Could not parse '{since_str}', defaulting to 1h ago", file=sys.stderr)
    return now - timedelta(hours=1)


# =============================================================================
# Discovery Phase
# =============================================================================

def stream_sessions() -> Generator[SessionMeta, None, None]:
    """Stream all session metadata from database."""
    with get_session() as db:
        statement = select(SessionModel).order_by(SessionModel.time_created)
        sessions = db.exec(statement).all()
        
        for session in sessions:
            yield SessionMeta(
                session_id=session.id,
                created_ms=session.time_created,
                title=session.title
            )


def discover_sessions(project_path: str, since: str = "1h") -> List[SessionMeta]:
    """
    Discover sessions matching project within time window.
    
    Filter order:
    1. Time filter FIRST (cheap)
    2. Project fingerprint SECOND (requires parsing tool outputs)
    """
    cutoff = parse_since(since)
    cutoff_ms = int(cutoff.timestamp() * 1000)
    matched: List[SessionMeta] = []
    
    with get_session() as db:
        # Time filter in SQL
        statement = (
            select(SessionModel)
            .where(SessionModel.time_created >= cutoff_ms)
            .order_by(SessionModel.time_created)
        )
        sessions = db.exec(statement).all()
        
        for session in sessions:
            meta = SessionMeta(
                session_id=session.id,
                created_ms=session.time_created,
                title=session.title
            )
            
            # Project fingerprint
            if fingerprint_session(session.id, project_path):
                matched.append(meta)
    
    return matched


def detect_partitions(sessions: List[SessionMeta], gap_minutes: int = 30) -> List[List[SessionMeta]]:
    """Group sessions into partitions based on time gaps."""
    if not sessions:
        return []
    
    partitions: List[List[SessionMeta]] = []
    current_partition: List[SessionMeta] = [sessions[0]]
    
    for i in range(1, len(sessions)):
        prev_time = sessions[i-1]._dt
        curr_time = sessions[i]._dt
        
        gap = (curr_time - prev_time).total_seconds() / 60
        
        if gap > gap_minutes:
            partitions.append(current_partition)
            current_partition = [sessions[i]]
        else:
            current_partition.append(sessions[i])
    
    if current_partition:
        partitions.append(current_partition)
    
    return partitions


# =============================================================================
# Extraction Phase
# =============================================================================

def extract_trajectory(session: SessionMeta) -> dict:
    """
    Extract full trajectory from a single session.
    
    Output format (Vertex AI compatible):
    {
        "session_id": "ses_...",
        "created": "2026-02-14T09:15:00",
        "title": "Session title",
        "prompt": "User instruction text",
        "response": "Agent response text", 
        "generated_trajectory": [
            {"tool": "fs.grep", "args": {...}, "output": "..."},
            {"tool": "fs.read", "args": {...}, "output": "..."}
        ]
    }
    """
    prompts: List[str] = []
    responses: List[str] = []
    trajectory: List[dict] = []
    config = get_config()
    
    with get_session() as db:
        # Get all messages for this session, ordered by creation time
        statement = (
            select(Message)
            .where(Message.session_id == session.session_id)
            .order_by(Message.time_created)
        )
        messages = db.exec(statement).all()
        
        for message in messages:
            try:
                msg_data = json.loads(message.data)
            except json.JSONDecodeError:
                continue
            
            role = msg_data.get("role", "")
            
            # Get parts for this message
            parts_statement = (
                select(Part)
                .where(Part.message_id == message.id)
                .order_by(Part.time_created)
            )
            parts = db.exec(parts_statement).all()
            
            for part in parts:
                try:
                    part_data = json.loads(part.data)
                except json.JSONDecodeError:
                    continue
                
                part_type = part_data.get("type", "")
                
                if part_type == "text":
                    text = part_data.get("text", "")
                    if role == "user":
                        prompts.append(text)
                    elif role == "assistant":
                        responses.append(text)
                
                elif part_type == "tool" and role == "assistant":
                    tool_name_raw = part_data.get("tool", "unknown")
                    state = part_data.get("state", {})
                    tool_args = state.get("input", {})
                    tool_output = state.get("output", "")
                    
                    # Normalize tool name
                    tool_name = config.normalize_tool(tool_name_raw)
                    
                    trajectory.append({
                        "tool": tool_name,
                        "tool_raw": tool_name_raw,
                        "args": tool_args,
                        "output": tool_output[:2000] if tool_output else ""
                    })
    
    return {
        "session_id": session.session_id,
        "created": session.created,
        "title": session.title,
        "prompt": "\n\n".join(prompts),
        "response": "\n\n".join(responses),
        "generated_trajectory": trajectory
    }


def extract_partition(sessions: List[SessionMeta], output_path: str) -> None:
    """Extract full trajectories from partition, write to file."""
    with open(output_path, "w", encoding="utf-8") as out:
        out.write("[\n")
        first = True
        
        for session in sessions:
            if not first:
                out.write(",\n")
            first = False
            
            trajectory = extract_trajectory(session)
            json.dump(trajectory, out, indent=2)
        
        out.write("\n]")
    
    print(f"✅ Wrote {len(sessions)} sessions to {output_path}")


def audit_partition(sessions: List[SessionMeta]) -> Tuple[Dict[str, int], Set[str]]:
    """Audit tool usage within a partition."""
    from collections import Counter
    
    config = get_config()
    tool_counts: Counter = Counter()
    unmapped_tools: Set[str] = set()
    
    with get_session() as db:
        for session in sessions:
            statement = select(Part).where(Part.session_id == session.session_id)
            parts = db.exec(statement).all()
            
            for part in parts:
                try:
                    data = json.loads(part.data)
                except json.JSONDecodeError:
                    continue
                
                if data.get("type") != "tool":
                    continue
                
                tool_name = data.get("tool", "unknown")
                tool_counts[tool_name] += 1
                
                if not config.is_known_tool(tool_name):
                    unmapped_tools.add(tool_name)
    
    return dict(tool_counts), unmapped_tools


def print_audit_results(tool_counts: Dict[str, int], unmapped_tools: Set[str]) -> None:
    """Print audit results."""
    config = get_config()
    mapped_count = sum(1 for t in tool_counts if config.is_known_tool(t))
    
    print(f"   Found {len(tool_counts)} unique tools")
    print(f"   Mapped: {mapped_count}, Unmapped: {len(unmapped_tools)}")
    print()
    
    if unmapped_tools:
        print("⚠️  Unmapped Tools (add to eval_config.yaml):")
        print("─" * 60)
        for tool in sorted(unmapped_tools):
            count = tool_counts.get(tool, 0)
            print(f"  {tool:<55} ({count} calls)")
        print()
    else:
        print("✅ All tools mapped in config!")
        print()


# =============================================================================
# CLI Commands
# =============================================================================

def cmd_collect(args):
    """Interactive flow: discover → audit → extract."""
    project = args.project
    since = args.since
    gap = args.gap
    
    print(f"🔍 Discovering sessions...")
    print(f"   Project: {project}")
    print(f"   Since: {since}")
    print(f"   Database: {DB_PATH}")
    print()
    
    sessions = discover_sessions(project, since)
    
    if not sessions:
        print("❌ No matching sessions found.")
        print("   Check that:")
        print(f"   - Project path is correct: {project}")
        print(f"   - Sessions exist within time window: {since}")
        print(f"   - Sessions used fs-mcp tools (for fingerprinting)")
        return
    
    partitions = detect_partitions(sessions, gap_minutes=gap)
    
    print(f"📊 Found {len(sessions)} sessions in {len(partitions)} partition(s):")
    print("─" * 50)
    
    for i, partition in enumerate(partitions, 1):
        start_time = partition[0].time_short
        end_time = partition[-1].time_short
        count = len(partition)
        date_str = partition[0].date
        print(f"  [{i}] {date_str} {start_time} - {end_time}  ({count} sessions)")
    
    print()
    
    # User selects partition
    if len(partitions) == 1:
        selection = "1"
        print("   (Only one partition found, auto-selecting)")
    else:
        try:
            selection = input(f"Select partition [1-{len(partitions)}, or 'all']: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n\nCancelled.")
            return
    
    # Parse selection
    if selection.lower() == "all":
        selected_sessions = sessions
        partition_label = "all"
    else:
        try:
            idx = int(selection)
            if idx < 1 or idx > len(partitions):
                print(f"❌ Invalid selection. Choose 1-{len(partitions)}")
                return
            selected_sessions = partitions[idx - 1]
            partition_label = f"partition {idx}"
        except ValueError:
            print(f"❌ Invalid input: {selection}")
            return
    
    print()
    print(f"📋 Selected {partition_label} ({len(selected_sessions)} sessions)")
    print()
    
    # Audit tools
    print("🔍 Auditing tools...")
    tool_counts, unmapped_tools = audit_partition(selected_sessions)
    print_audit_results(tool_counts, unmapped_tools)
    
    if unmapped_tools:
        try:
            proceed = input("Unmapped tools found. Continue anyway? [y/N]: ").strip().lower()
        except (EOFError, KeyboardInterrupt):
            print("\n\nCancelled.")
            return
        
        if proceed != "y":
            print("Aborted. Please update eval_config.yaml and retry.")
            return
    
    # Extract
    try:
        proceed = input("Proceed to extract? [Y/n]: ").strip().lower()
    except (EOFError, KeyboardInterrupt):
        print("\n\nCancelled.")
        return
    
    if proceed == "n":
        print("Aborted.")
        return
    
    first_session = selected_sessions[0]
    date_str = first_session.date
    time_str = first_session.time_short.replace(":", "")
    output_file = args.output or f"eval_run_{date_str}_{time_str}.json"
    
    print()
    extract_partition(selected_sessions, output_file)


def cmd_discover(args):
    """Discover available evaluation partitions."""
    project = args.project
    since = args.since
    gap = args.gap
    
    print(f"🔍 Discovering sessions for project: {project}")
    print(f"   Since: {since}")
    print()
    
    sessions = discover_sessions(project, since)
    
    if not sessions:
        print("❌ No matching sessions found.")
        return
    
    partitions = detect_partitions(sessions, gap_minutes=gap)
    
    print(f"📊 Found {len(sessions)} sessions in {len(partitions)} partition(s):")
    print("─" * 50)
    
    for i, partition in enumerate(partitions, 1):
        start_time = partition[0].time_short
        end_time = partition[-1].time_short
        count = len(partition)
        date_str = partition[0].date
        print(f"  [{i}] {date_str} {start_time} - {end_time}  ({count} sessions)")
    
    print()
    print("💡 Use 'collect' for interactive workflow:")
    print(f"   python eval_ingest.py collect --project {project}")


def cmd_extract(args):
    """Extract a specific partition to evaluation format."""
    project = args.project
    since = args.since
    partition_num = args.partition
    gap = args.gap
    
    sessions = discover_sessions(project, since)
    
    if not sessions:
        print(f"❌ No sessions found")
        return
    
    partitions = detect_partitions(sessions, gap_minutes=gap)
    
    if partition_num < 1 or partition_num > len(partitions):
        print(f"❌ Invalid partition number. Available: 1-{len(partitions)}")
        return
    
    selected = partitions[partition_num - 1]
    date_str = selected[0].date
    start_time = selected[0].time_short.replace(":", "")
    output_file = args.output or f"eval_run_{date_str}_{start_time}.json"
    
    print(f"📦 Extracting partition {partition_num}")
    print(f"   Sessions: {len(selected)}")
    print(f"   Time range: {selected[0].time_short} - {selected[-1].time_short}")
    print(f"   Output: {output_file}")
    print()
    
    extract_partition(selected, output_file)


def cmd_projects(args):
    """List all projects with session counts."""
    print("🔍 Scanning database for projects...")
    print(f"   Database: {DB_PATH}")
    print()
    
    with get_session() as db:
        # Get all sessions with project info
        statement = select(SessionModel, Project).join(Project)
        results = db.exec(statement).all()
        
        # Group by detected project paths
        projects: Dict[str, dict] = defaultdict(lambda: {
            "sessions": set(),
            "last_activity": None,
            "titles": []
        })
        
        for session, project in results:
            # Try to get project from worktree
            worktree = project.worktree
            
            if worktree and worktree != "/":
                proj_key = worktree
            else:
                # Fingerprint from tool outputs
                proj_key = _detect_project_from_session(session.id)
                if not proj_key:
                    proj_key = "(unknown)"
            
            projects[proj_key]["sessions"].add(session.id)
            projects[proj_key]["titles"].append(session.title)
            
            session_dt = datetime.fromtimestamp(session.time_created / 1000)
            if projects[proj_key]["last_activity"] is None or session_dt > projects[proj_key]["last_activity"]:
                projects[proj_key]["last_activity"] = session_dt
    
    if not projects:
        print("❌ No projects found.")
        return
    
    # Sort by last activity
    sorted_projects = sorted(
        projects.items(),
        key=lambda x: x[1]["last_activity"] or datetime.min,
        reverse=True
    )
    
    limit = args.limit
    
    print(f"📁 Projects (sorted by last activity, showing top {limit}):")
    print("─" * 80)
    print(f"  {'Last Activity':<20} {'Sessions':<10} {'Project Path'}")
    print("─" * 80)
    
    for path, info in sorted_projects[:limit]:
        last_activity = info["last_activity"].strftime("%Y-%m-%d %H:%M") if info["last_activity"] else "Unknown"
        session_count = len(info["sessions"])
        print(f"  {last_activity:<20} {session_count:<10} {path}")
    
    if len(sorted_projects) > limit:
        print()
        print(f"   ... and {len(sorted_projects) - limit} more. Use --limit to show more.")


def _detect_project_from_session(session_id: str) -> Optional[str]:
    """Detect project path from session's tool outputs."""
    with get_session() as db:
        statement = select(Part).where(Part.session_id == session_id)
        parts = db.exec(statement).all()
        
        for part in parts:
            try:
                data = json.loads(part.data)
            except json.JSONDecodeError:
                continue
            
            if data.get("type") != "tool":
                continue
            
            tool_name = data.get("tool", "")
            output = data.get("state", {}).get("output", "")
            
            paths = extract_paths_from_output(tool_name, output)
            
            for path in paths:
                # Infer project root
                root = _infer_project_root(path)
                if root:
                    return root
    
    return None


def _infer_project_root(file_path: str) -> Optional[str]:
    """Infer project root from a file path."""
    if not file_path.startswith("/"):
        return None
    
    indicators = {".git", "pyproject.toml", "package.json", "Cargo.toml", "go.mod", "gsd-lite"}
    path = Path(file_path)
    
    for parent in path.parents:
        for indicator in indicators:
            if (parent / indicator).exists():
                return str(parent)
        
        if parent == Path.home():
            break
    
    # Fallback: look for /dev/, /projects/, etc.
    parts = file_path.split("/")
    for i, part in enumerate(parts):
        if part in ("dev", "projects", "src", "code", "repos", "workspace"):
            if i + 2 <= len(parts):
                return "/".join(parts[:i+2])
    
    return None


def cmd_inspect(args):
    """Inspect a single session."""
    session_id = args.session_id
    
    with get_session() as db:
        statement = select(SessionModel).where(SessionModel.id == session_id)
        session = db.exec(statement).first()
        
        if not session:
            print(f"❌ Session not found: {session_id}")
            return
        
        meta = SessionMeta(session.id, session.time_created, session.title)
        trajectory = extract_trajectory(meta)
        
        print(json.dumps(trajectory, indent=2))


def main():
    parser = argparse.ArgumentParser(
        description="OpenCode Session Evaluation Helper (SQLite Edition)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # List available projects
  python eval_ingest.py projects
  
  # Interactive collect (recommended)
  python eval_ingest.py collect --project /Users/x/dev/gsd_lite
  
  # Discover partitions
  python eval_ingest.py discover --project /Users/x/dev/gsd_lite --since 2h
  
  # Extract partition to JSON
  python eval_ingest.py extract --project /Users/x/dev/gsd_lite --partition 1
        """
    )
    
    parser.add_argument("--config", type=Path, help="Path to eval_config.yaml")
    
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # Collect command
    collect_parser = subparsers.add_parser("collect", help="Interactive: discover → audit → extract")
    collect_parser.add_argument("--project", required=True, help="Project root path")
    collect_parser.add_argument("--since", default="1h", help="Time window: 30m, 1h, 2h, today, YYYY-MM-DD")
    collect_parser.add_argument("--gap", type=int, default=30, help="Minutes gap for partition detection")
    collect_parser.add_argument("--output", help="Output file path")
    
    # Discover command
    discover_parser = subparsers.add_parser("discover", help="Discover partitions")
    discover_parser.add_argument("--project", required=True, help="Project root path")
    discover_parser.add_argument("--since", default="1h", help="Time window")
    discover_parser.add_argument("--gap", type=int, default=30, help="Minutes gap")
    
    # Extract command
    extract_parser = subparsers.add_parser("extract", help="Extract partition to eval format")
    extract_parser.add_argument("--project", required=True, help="Project root path")
    extract_parser.add_argument("--since", default="1h", help="Time window")
    extract_parser.add_argument("--partition", type=int, required=True, help="Partition number")
    extract_parser.add_argument("--gap", type=int, default=30, help="Minutes gap")
    extract_parser.add_argument("--output", help="Output file path")
    
    # Projects command
    projects_parser = subparsers.add_parser("projects", help="List detected projects")
    projects_parser.add_argument("--limit", type=int, default=20, help="Max projects to show")
    
    # Inspect command
    inspect_parser = subparsers.add_parser("inspect", help="Inspect a single session")
    inspect_parser.add_argument("--session-id", required=True, help="Session ID")
    
    args = parser.parse_args()
    
    # Load config
    if args.config:
        load_config(args.config)
    elif DEFAULT_CONFIG_PATH.exists():
        load_config(DEFAULT_CONFIG_PATH)
    
    if args.command == "collect":
        cmd_collect(args)
    elif args.command == "discover":
        cmd_discover(args)
    elif args.command == "extract":
        cmd_extract(args)
    elif args.command == "projects":
        cmd_projects(args)
    elif args.command == "inspect":
        cmd_inspect(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()