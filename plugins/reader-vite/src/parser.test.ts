/**
 * Line Number Accuracy Tests
 * 
 * These tests verify that the parser's line number tracking is accurate
 * for the copy-to-clipboard feature, which provides exact text for
 * propose_and_review operations.
 * 
 * Critical requirement: rawText from parser must be usable as match_text
 * in propose_and_review without any modifications.
 */

import { describe, it, expect } from 'vitest';
import { parseWorklog } from './parser';
import { parseContextDocument } from './context-parser';

describe('Line Number Accuracy', () => {
  describe('WORK.md sections', () => {
    it('should track endLine including trailing blank lines', () => {
      const markdown = `# Work Log

## 1. Current Understanding

<current_mode>
execution
</current_mode>

## 2. Key Events`;

      const ast = parseWorklog(markdown);
      const section1 = ast.sections.find(s => s.title === '1. Current Understanding');
      
      expect(section1).toBeDefined();
      expect(section1?.lineNumber).toBe(3);
      expect(section1?.endLine).toBe(8); // Includes blank line before next section
      
      // The rawText should include the blank line
      const lines = section1?.rawText?.split('\n') || [];
      expect(lines[lines.length - 1]).toBe(''); // Trailing blank
    });

    it('should track log entry boundaries correctly', () => {
      const markdown = `# Work Log

## 3. Atomic Session Log

### [LOG-001] - [DISCOVERY] - Test Log - Task: TEST-001
**Timestamp:** 2026-01-01
Content here.

### [LOG-002] - [EXEC] - Another Log`;

      const ast = parseWorklog(markdown);
      const log001 = ast.logs.find(l => l.id === 'LOG-001');
      
      expect(log001).toBeDefined();
      expect(log001?.lineNumber).toBe(5);
      expect(log001?.endLine).toBe(8); // Includes blank line before LOG-002
      expect(log001?.rawText).toContain('Content here.');
    });
  });

  describe('PROJECT.md / ARCHITECTURE.md sections', () => {
    it('should track H2 section boundaries', () => {
      const markdown = `# Project

## What This Is

Description here.

## Core Value

More content.`;

      const doc = parseContextDocument(markdown, 'project', 'PROJECT.md');
      const section1 = doc.sections[0];
      
      expect(section1.title).toBe('What This Is');
      expect(section1.lineNumber).toBe(3);
      expect(section1.endLine).toBe(6); // Includes blank line before next section
      expect(section1.rawText).toContain('Description here.');
    });
  });

  describe('propose_and_review compatibility', () => {
    it('rawText should be usable directly as match_text', () => {
      const markdown = `# Work

## Section One

Content with **markdown**.

## Section Two`;

      const ast = parseWorklog(markdown);
      const section = ast.sections[0];
      
      // This is what gets copied to clipboard
      const rawText = section.rawText;
      
      // Simulate propose_and_review: match_text must exist in file exactly
      const fileLines = markdown.split('\n');
      const expectedLines = fileLines.slice(section.lineNumber - 1, section.endLine);
      const expectedText = expectedLines.join('\n');
      
      expect(rawText).toBe(expectedText);
    });
  });
});