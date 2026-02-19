import type { ContextDocument, DocSection } from './types';

const H1_PATTERN = /^#\s+(.+)$/;
const H2_PATTERN = /^##\s+(.+)$/;

function buildSection(
  kind: 'project' | 'architecture',
  title: string,
  lineNumber: number,
  markdownLines: string[],
  index: number,
): DocSection {
  const markdown = markdownLines.join('\n').trimEnd();
  const content = markdownLines.slice(1).join('\n').trimEnd();

  return {
    key: `${kind}-section-${index}`,
    title,
    lineNumber,
    anchorId: `${kind}-line-${lineNumber}`,
    markdown,
    content,
  };
}

/**
 * Parse PROJECT.md / ARCHITECTURE.md into root-level (H2) sections.
 *
 * Notes:
 * - Only H2 roots are extracted for copy selection simplicity.
 * - Headers inside fenced code blocks are ignored.
 */
export function parseContextDocument(
  markdown: string,
  kind: 'project' | 'architecture',
  fileName: string,
): ContextDocument {
  const lines = markdown.split('\n');
  let title = fileName;

  for (let i = 0; i < Math.min(lines.length, 20); i++) {
    const h1Match = lines[i].match(H1_PATTERN);
    if (h1Match) {
      title = h1Match[1].trim();
      break;
    }
  }

  const sections: DocSection[] = [];
  let inCodeFence = false;

  let currentTitle = '';
  let currentLineNumber = 1;
  let currentStartIndex = -1;
  let sectionIndex = 0;

  const flushCurrent = (endIndex: number) => {
    if (currentStartIndex < 0 || !currentTitle) return;
    const markdownLines = lines.slice(currentStartIndex, endIndex);
    sections.push(buildSection(kind, currentTitle, currentLineNumber, markdownLines, sectionIndex));
    sectionIndex += 1;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
      inCodeFence = !inCodeFence;
    }

    if (inCodeFence) continue;

    const h2Match = line.match(H2_PATTERN);
    if (h2Match) {
      flushCurrent(i);
      currentTitle = h2Match[1].trim();
      currentLineNumber = i + 1;
      currentStartIndex = i;
    }
  }

  flushCurrent(lines.length);

  if (sections.length === 0) {
    const fallbackContent = markdown.trimEnd();
    if (fallbackContent) {
      sections.push({
        key: `${kind}-section-0`,
        title: 'Overview',
        lineNumber: 1,
        anchorId: `${kind}-line-1`,
        markdown: `## Overview\n\n${fallbackContent}`,
        content: fallbackContent,
      });
    }
  }

  return {
    kind,
    fileName,
    title,
    totalLines: lines.length,
    sections,
  };
}