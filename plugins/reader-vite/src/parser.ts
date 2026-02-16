/**
 * GSD-Lite Worklog Parser
 * 
 * Parses WORK.md into a structured AST for rendering.
 * Full port of parse_worklog.py (LOG-048, READER-002b).
 * 
 * Dead simple contract:
 *   ### [LOG-NNN] - [TYPE] - {title}
 *        ↑ extract  ↑ extract  ↑ everything else, verbatim
 * 
 * Superseded detection: title contains ~~...~~ → superseded: true
 */

import type { WorklogAST, LogEntry, Section } from './types';

// Regex patterns (matching Python implementation exactly)
const LOG_HEADER_PATTERN = /^### \[LOG-(\d+)\] - \[([^\]]+)\] - (.+)$/;
const SECTION_HEADER_PATTERN = /^(#{2,5}) (.+)$/;
const STRIKETHROUGH_PATTERN = /~~.+~~/;

/**
 * Parse raw WORK.md content into structured AST.
 * 
 * Implements:
 * - LOG entry extraction with type/title/superseded
 * - Content capture (all lines until next H2/H3 section)
 * - Section hierarchy (H2-H5) with nested children
 * - Code fence handling (skip header parsing inside ```)
 * - Stack-based parent tracking for nesting
 */
export function parseWorklog(markdown: string): WorklogAST {
  const startTime = performance.now();
  const lines = markdown.split('\n');
  
  const logs: LogEntry[] = [];
  const sections: Section[] = [];
  
  // Extract title from first H1
  let title = 'GSD-Lite Worklog';
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    if (lines[i].startsWith('# ')) {
      title = lines[i].slice(2).trim();
      break;
    }
  }

  // Stack for tracking hierarchy: [level, node]
  let currentLog: LogEntry | null = null;
  let currentSection: Section | null = null;
  let currentContent: string[] = [];
  let sectionStack: Array<{ level: number; node: Section | LogEntry }> = [];
  
  // Track fenced code blocks - skip header parsing inside them
  let inCodeFence = false;

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    const lineNumber = lineNum + 1; // 1-indexed for display

    // Toggle code fence state (``` or ~~~)
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('```') || trimmedLine.startsWith('~~~')) {
      inCodeFence = !inCodeFence;
      // Still capture content for logs/sections even in code fences
      if (currentLog || currentSection) {
        currentContent.push(line);
      }
      continue;
    }

    // Inside code fence: capture content but skip header parsing
    if (inCodeFence) {
      if (currentLog || currentSection) {
        currentContent.push(line);
      }
      continue;
    }

    // Try LOG entry first (H3 with specific format)
    const logMatch = line.match(LOG_HEADER_PATTERN);
    if (logMatch) {
      // Save previous log's content (trimEnd only - preserve leading lines for anchor alignment)
      if (currentLog) {
        currentLog.content = currentContent.join('\n').trimEnd();
      }
      // Save previous section's content
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trimEnd();
        currentSection = null;
      }

      const logId = `LOG-${logMatch[1]}`;
      const logType = logMatch[2];
      const logTitle = logMatch[3];
      const superseded = STRIKETHROUGH_PATTERN.test(logTitle);

      // Extract task from title if present (e.g., "- Task: READER-002")
      const taskMatch = logTitle.match(/- Task: ([A-Z0-9-]+)/);
      const task = taskMatch ? taskMatch[1] : undefined;
      const cleanTitle = taskMatch 
        ? logTitle.replace(/\s*- Task: [A-Z0-9-]+/, '').trim()
        : logTitle;

      currentLog = {
        id: logId,
        type: logType,
        title: cleanTitle,
        task,
        superseded,
        lineNumber,
        level: 3,
        content: '',
        children: [],
      };
      logs.push(currentLog);
      currentContent = [];
      
      // Reset stack - log entries are top-level containers
      sectionStack = [{ level: 3, node: currentLog }];
      continue;
    }

    // Try generic section header (H2-H5)
    const sectionMatch = line.match(SECTION_HEADER_PATTERN);
    if (sectionMatch) {
      const hashes = sectionMatch[1];
      const level = hashes.length;
      const sectionTitle = sectionMatch[2];

      const section: Section = {
        level,
        title: sectionTitle,
        lineNumber,
        children: [],
      };

      // H2 sections are top-level (outside logs)
      if (level === 2) {
        // Save previous log's content (trimEnd only - preserve leading lines for anchor alignment)
        if (currentLog) {
          currentLog.content = currentContent.join('\n').trimEnd();
        }
        // Save previous section's content
        if (currentSection) {
          currentSection.content = currentContent.join('\n').trimEnd();
        }
        sections.push(section);
        sectionStack = [{ level: 2, node: section }];
        currentLog = null;
        currentSection = section;
        currentContent = [];
        continue;
      }

      // H3 that's NOT a log entry - treat as section (ends current log/section)
      if (level === 3 && currentLog === null) {
        // Save previous section's content
        if (currentSection) {
          currentSection.content = currentContent.join('\n').trimEnd();
        }
        sections.push(section);
        sectionStack = [{ level: 3, node: section }];
        currentSection = section;
        currentContent = [];
        continue;
      }

      // H3 non-log breaks current log
      if (level === 3 && currentLog !== null && !logMatch) {
        currentLog.content = currentContent.join('\n').trimEnd();
        sections.push(section);
        sectionStack = [{ level: 3, node: section }];
        currentLog = null;
        currentSection = section;
        currentContent = [];
        continue;
      }

      // H4/H5 - nest under current parent, include in content
      if (sectionStack.length > 0) {
        // Pop stack until we find a parent with lower level
        while (sectionStack.length > 0 && sectionStack[sectionStack.length - 1].level >= level) {
          sectionStack.pop();
        }

        if (sectionStack.length > 0) {
          const parent = sectionStack[sectionStack.length - 1].node;
          parent.children.push(section);
        }

        sectionStack.push({ level, node: section });
      }

      // H4/H5 headers are also part of log content
      if (currentLog && level >= 4) {
        currentContent.push(line);
      }
      continue;
    }

    // Regular line - capture as content if inside a log or section
    if (currentLog || currentSection) {
      currentContent.push(line);
    }
  }

  // Don't forget last log's content
  // Note: We preserve leading newlines to maintain line number alignment between
  // parser (which tracks absolute file line numbers for children) and renderer
  // (which calculates lineNum = startLine + index). Trimming breaks anchor navigation.
  if (currentLog) {
    currentLog.content = currentContent.join('\n').trimEnd(); // Only trim trailing whitespace
  }
  // Don't forget last section's content
  if (currentSection) {
    currentSection.content = currentContent.join('\n').trimEnd();
  }

  const parseTime = Math.round(performance.now() - startTime);

  return {
    title,
    sections,
    logs,
    metadata: {
      totalLines: lines.length,
      totalLogs: logs.length,
      parseTime,
    },
  };
}

/**
 * Convert AST to JSON-serializable format.
 * Useful for debugging or caching.
 */
export function astToJson(ast: WorklogAST): string {
  return JSON.stringify(ast, null, 2);
}