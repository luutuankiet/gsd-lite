/**
 * TypeScript interfaces for the GSD-Lite Worklog Reader
 * Ported from Python POC (LOG-048)
 */

/** Represents a single LOG entry in the worklog */
export interface LogEntry {
  id: string;           // e.g., "LOG-049"
  type: string;         // e.g., "DECISION", "EXEC", "MILESTONE"
  title: string;        // e.g., "The Hot Reload Pivot"
  task?: string;        // e.g., "READER-002"
  superseded: boolean;  // true if title contains ~~strikethrough~~
  lineNumber: number;   // Original line number in WORK.md
  level: number;        // Header level (2 = ##, 3 = ###)
  content: string;      // Full content including nested sections
  children: Section[];  // Nested H4/H5 sections under this log
}

/** Represents a section header in the worklog */
export interface Section {
  title: string;
  level: number;
  lineNumber: number;
  children: Section[];
  logs?: LogEntry[];  // Optional - not always populated
}

/** Parsed worklog structure */
export interface WorklogAST {
  title: string;
  sections: Section[];
  logs: LogEntry[];
  metadata: {
    totalLines: number;
    totalLogs: number;
    parseTime: number;
  };
}

/** Mermaid diagram extracted from content */
export interface MermaidDiagram {
  id: string;
  code: string;
  lineNumber: number;
}

/** Render options for the viewer */
export interface RenderOptions {
  theme: 'light' | 'dark';
  showLineNumbers: boolean;
  collapseSections: boolean;
  highlightLogId?: string;
}