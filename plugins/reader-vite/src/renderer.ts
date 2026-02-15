/**
 * GSD-Lite Worklog Renderer
 * 
 * Renders WorklogAST to HTML with full markdown support and Mermaid diagrams.
 * Full port of generate_worklog_viewer.py (LOG-048, READER-002c).
 * 
 * Features:
 * - Full markdown: tables, code blocks, links, strikethrough, lists
 * - Collapsible outline with toggle buttons
 * - Type badges with color coding
 * - Section hierarchy with nested indentation
 * - Mobile support: top bar, overlay, scroll thumb
 * - Superseded styling for ~~strikethrough~~ titles
 */

import type { WorklogAST, LogEntry, Section } from './types';

// ============================================================
// INLINE FORMATTING
// ============================================================

/**
 * Apply inline markdown formatting to text.
 * Order matters: bold before italic to handle ***bold italic***
 */
function formatInline(text: string): string {
  let result = text;
  
  // Bold (must come before italic)
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Inline code
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Strikethrough
  result = result.replace(/~~(.+?)~~/g, '<del>$1</del>');
  
  // Links
  result = result.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  
  return result;
}

/**
 * Escape HTML entities
 */
function escapeHtml(text: string): string {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, char => entities[char]);
}

/**
 * Truncate string with ellipsis
 */
function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + '…';
}

// ============================================================
// OUTLINE RENDERING
// ============================================================

/**
 * Render a single outline item (log or section)
 */
function renderOutlineItem(item: LogEntry | Section, isLog: boolean = false): string {
  const anchor = `line-${item.lineNumber}`;
  const hasChildren = item.children && item.children.length > 0;
  
  if (isLog) {
    const log = item as LogEntry;
    const supersededClass = log.superseded ? ' superseded' : '';
    const collapsedClass = hasChildren ? ' has-children collapsed' : '';
    
    const toggleBtn = hasChildren ? '<span class="toggle-btn">▼</span>' : '';
    const childrenHtml = hasChildren 
      ? `<ul class="outline-children">${log.children.map(c => renderOutlineItem(c, false)).join('')}</ul>`
      : '';
    
    return `
      <li class="outline-item log-item${supersededClass}${collapsedClass}">
        <div class="outline-row">
          ${toggleBtn}
          <a href="#${anchor}" class="outline-link">
            <span class="badge badge-${log.type}">${log.type}</span>
            <span class="log-id">${log.id}</span>
            <span class="log-title">${escapeHtml(truncate(log.title, 40))}</span>
          </a>
        </div>
        ${childrenHtml}
      </li>
    `;
  } else {
    const section = item as Section;
    const indentClass = `indent-${section.level}`;
    const collapsedClass = hasChildren ? ' has-children collapsed' : '';
    
    const toggleBtn = hasChildren ? '<span class="toggle-btn">▼</span>' : '';
    const childrenHtml = hasChildren
      ? `<ul class="outline-children">${section.children.map(c => renderOutlineItem(c, false)).join('')}</ul>`
      : '';
    
    return `
      <li class="outline-item section-item ${indentClass}${collapsedClass}">
        <div class="outline-row">
          ${toggleBtn}
          <a href="#${anchor}" class="outline-link">${escapeHtml(truncate(section.title, 50))}</a>
        </div>
        ${childrenHtml}
      </li>
    `;
  }
}

/**
 * Render the full outline panel
 */
function renderOutline(ast: WorklogAST): string {
  // Sections
  const sectionsHtml = ast.sections.map(s => renderOutlineItem(s, false)).join('');
  
  // Logs in reverse order (newest first for navigation)
  const logsHtml = [...ast.logs].reverse().map(log => renderOutlineItem(log, true)).join('');
  
  return `
    <nav class="outline" id="outline">
      <div class="outline-header">
        <span>📋 Outline</span>
        <div class="outline-header-buttons">
          <button class="expand-all-btn" id="expandAllBtn" title="Expand/Collapse All">⊞</button>
          <button class="outline-close" id="outlineClose">✕</button>
        </div>
      </div>
      <div class="outline-content">
        <h3 class="outline-section-title">Sections</h3>
        <ul class="outline-list">${sectionsHtml}</ul>
        <h3 class="outline-section-title">Logs (${ast.logs.length})</h3>
        <ul class="outline-list">${logsHtml}</ul>
      </div>
    </nav>
  `;
}

// ============================================================
// MARKDOWN TO HTML CONVERSION
// ============================================================

/**
 * Convert markdown content to HTML with line anchors.
 * Handles: headers, code blocks, tables, lists, paragraphs.
 */
function renderMarkdown(content: string, startLine: number = 1): string {
  const lines = content.split('\n');
  const htmlLines: string[] = [];
  
  let inCodeFence = false;
  let codeLang = '';
  let codeBuffer: string[] = [];
  let inTable = false;
  let inList = false;
  let listType: 'ul' | 'ol' = 'ul';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = startLine + i;
    const anchor = `id="line-${lineNum}"`;
    
    // Handle code fences
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('```') || trimmedLine.startsWith('~~~')) {
      if (!inCodeFence) {
        // Close any open structures
        if (inTable) {
          htmlLines.push('</tbody></table>');
          inTable = false;
        }
        if (inList) {
          htmlLines.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
        }
        
        inCodeFence = true;
        codeLang = trimmedLine.slice(3).trim();
        codeBuffer = [];
      } else {
        inCodeFence = false;
        const codeContent = escapeHtml(codeBuffer.join('\n'));
        
        // Special handling for mermaid blocks
        if (codeLang === 'mermaid') {
          // Track the starting line of the mermaid fence for error reporting
          const mermaidStartLine = lineNum - codeBuffer.length;
          htmlLines.push(`
            <div class="mermaid-wrapper" data-start-line="${mermaidStartLine}">
              <pre class="mermaid-source" style="display:none">${codeContent}</pre>
            </div>
          `);
        } else {
          const langClass = codeLang ? ` class="language-${codeLang}"` : '';
          htmlLines.push(`<pre><code${langClass}>${codeContent}</code></pre>`);
        }
      }
      continue;
    }
    
    if (inCodeFence) {
      codeBuffer.push(line);
      continue;
    }
    
    // Headers (H1-H5)
    const headerMatch = line.match(/^(#{1,5}) (.+)$/);
    if (headerMatch) {
      if (inTable) {
        htmlLines.push('</tbody></table>');
        inTable = false;
      }
      if (inList) {
        htmlLines.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
      }
      
      const level = headerMatch[1].length;
      const text = formatInline(escapeHtml(headerMatch[2]));
      htmlLines.push(`<h${level} ${anchor}>${text}</h${level}>`);
      continue;
    }
    
    // Horizontal rules
    if (/^---+$/.test(line)) {
      if (inTable) {
        htmlLines.push('</tbody></table>');
        inTable = false;
      }
      if (inList) {
        htmlLines.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
      }
      htmlLines.push('<hr>');
      continue;
    }
    
    // Empty lines
    if (!line.trim()) {
      if (inTable) {
        htmlLines.push('</tbody></table>');
        inTable = false;
      }
      if (inList) {
        htmlLines.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
      }
      continue;
    }
    
    // Tables
    if (line.includes('|') && line.trim().startsWith('|')) {
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      
      // Check if separator row (|---|---|)
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        continue; // Skip separator
      }
      
      if (!inTable) {
        if (inList) {
          htmlLines.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
        }
        htmlLines.push('<table><thead><tr>');
        const cellsHtml = cells.map(c => `<th>${formatInline(escapeHtml(c))}</th>`).join('');
        htmlLines.push(`${cellsHtml}</tr></thead><tbody>`);
        inTable = true;
      } else {
        const cellsHtml = cells.map(c => `<td>${formatInline(escapeHtml(c))}</td>`).join('');
        htmlLines.push(`<tr>${cellsHtml}</tr>`);
      }
      continue;
    }
    
    // Close table if non-table content
    if (inTable) {
      htmlLines.push('</tbody></table>');
      inTable = false;
    }
    
    // Unordered lists
    const ulMatch = line.match(/^(\s*)[-*+] (.+)$/);
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        if (inList) htmlLines.push('</ol>');
        htmlLines.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      htmlLines.push(`<li>${formatInline(escapeHtml(ulMatch[2]))}</li>`);
      continue;
    }
    
    // Ordered lists
    const olMatch = line.match(/^(\s*)\d+\. (.+)$/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        if (inList) htmlLines.push('</ul>');
        htmlLines.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      htmlLines.push(`<li>${formatInline(escapeHtml(olMatch[2]))}</li>`);
      continue;
    }
    
    // Close list if non-list content
    if (inList) {
      htmlLines.push(listType === 'ul' ? '</ul>' : '</ol>');
      inList = false;
    }
    
    // Blockquotes
    if (line.startsWith('> ')) {
      htmlLines.push(`<blockquote ${anchor}>${formatInline(escapeHtml(line.slice(2)))}</blockquote>`);
      continue;
    }
    
    // Default: paragraph with inline formatting
    const text = formatInline(escapeHtml(line));
    htmlLines.push(`<p ${anchor}>${text}</p>`);
  }
  
  // Close any trailing structures
  if (inTable) htmlLines.push('</tbody></table>');
  if (inList) htmlLines.push(listType === 'ul' ? '</ul>' : '</ol>');
  
  return htmlLines.join('\n');
}

// ============================================================
// LOG ENTRY RENDERING
// ============================================================

/**
 * Render a single log entry card
 */
function renderLogEntry(log: LogEntry): string {
  const content = renderMarkdown(log.content, log.lineNumber + 1);
  const supersededClass = log.superseded ? ' superseded' : '';
  
  return `
    <article class="log-entry${supersededClass}" id="line-${log.lineNumber}">
      <header class="log-header">
        <span class="log-badge">${log.id}</span>
        <span class="log-type badge-${log.type}">${log.type}</span>
        ${log.task ? `<span class="log-task">${log.task}</span>` : ''}
      </header>
      <h2 class="log-title">${formatInline(escapeHtml(log.title))}</h2>
      <div class="log-content">
        ${content}
      </div>
    </article>
  `;
}

// ============================================================
// MAIN RENDER FUNCTION
// ============================================================

/**
 * Render full worklog to HTML string.
 * Returns the inner content (outline + main) - the shell is in index.html.
 */
export function renderWorklog(ast: WorklogAST): string {
  const outline = renderOutline(ast);
  const content = ast.logs.map(log => renderLogEntry(log)).join('');
  const latestLogLine = ast.logs.length > 0 ? ast.logs[ast.logs.length - 1].lineNumber : 1;
  
  return `
    <!-- Top Bar -->
    <header class="top-bar">
      <button class="btn-outline-toggle" id="outlineToggle">📋</button>
      <span class="top-bar-title">GSD-Lite Worklog</span>
      <button class="btn-jump-latest" id="jumpLatest" data-line="${latestLogLine}">⬇ Latest</button>
    </header>
    
    <!-- Outline Panel -->
    ${outline}
    
    <!-- Overlay (mobile) -->
    <div class="overlay" id="overlay"></div>
    
    <!-- Main Content -->
    <main class="content" id="content">
      ${content}
    </main>
    
    <!-- Mobile Scroll Thumb -->
    <div class="scroll-thumb" id="scrollThumb">
      <div class="thumb-icon">↕</div>
    </div>
    
    <!-- Stats Footer -->
    <div class="stats-footer">
      ${ast.metadata.totalLogs} logs · ${ast.metadata.totalLines} lines · ${ast.metadata.parseTime}ms
    </div>
  `;
}

/**
 * Initialize event listeners after render.
 * Call this after injecting renderWorklog() output into DOM.
 */
export function initializeInteractions(): void {
  const outline = document.getElementById('outline');
  const overlay = document.getElementById('overlay');
  const content = document.getElementById('content');
  const outlineToggle = document.getElementById('outlineToggle');
  const outlineClose = document.getElementById('outlineClose');
  const expandAllBtn = document.getElementById('expandAllBtn');
  const jumpLatest = document.getElementById('jumpLatest');
  const scrollThumb = document.getElementById('scrollThumb');
  
  if (!outline || !overlay || !content) return;
  
  let allExpanded = false;
  
  // ===== OUTLINE TOGGLE =====
  function toggleOutline(): void {
    if (window.innerWidth >= 768) {
      outline!.classList.toggle('hidden');
      content!.classList.toggle('full-width');
    } else {
      outline!.classList.toggle('open');
      overlay!.classList.toggle('visible');
    }
  }
  
  outlineToggle?.addEventListener('click', toggleOutline);
  outlineClose?.addEventListener('click', toggleOutline);
  overlay?.addEventListener('click', toggleOutline);
  
  // ===== JUMP TO LATEST =====
  jumpLatest?.addEventListener('click', () => {
    const line = jumpLatest.dataset.line;
    if (line) {
      document.getElementById(`line-${line}`)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  // ===== EXPAND/COLLAPSE ALL =====
  expandAllBtn?.addEventListener('click', () => {
    const items = document.querySelectorAll('.outline-item.has-children');
    
    if (allExpanded) {
      items.forEach(item => item.classList.add('collapsed'));
      expandAllBtn.textContent = '⊞';
      expandAllBtn.title = 'Expand All';
    } else {
      items.forEach(item => item.classList.remove('collapsed'));
      expandAllBtn.textContent = '⊟';
      expandAllBtn.title = 'Collapse All';
    }
    allExpanded = !allExpanded;
  });
  
  // ===== INDIVIDUAL TOGGLE BUTTONS =====
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = (btn as HTMLElement).closest('.outline-item');
      if (!item) return;
      
      const isCollapsed = item.classList.contains('collapsed');
      
      if (isCollapsed) {
        item.classList.remove('collapsed');
      } else {
        item.classList.add('collapsed');
        // Also collapse descendants
        item.querySelectorAll('.outline-item.has-children').forEach(child => {
          child.classList.add('collapsed');
        });
      }
    });
    
    // Double click = expand all descendants
    btn.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      const item = (btn as HTMLElement).closest('.outline-item');
      if (!item) return;
      
      item.classList.remove('collapsed');
      item.querySelectorAll('.outline-item.has-children').forEach(child => {
        child.classList.remove('collapsed');
      });
    });
  });
  
  // ===== CLOSE OUTLINE ON LINK CLICK (MOBILE) =====
  document.querySelectorAll('.outline-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        outline.classList.remove('open');
        overlay.classList.remove('visible');
      }
    });
  });
  
  // ===== MOBILE SCROLL THUMB =====
  if (scrollThumb) {
    let isDragging = false;
    let startY = 0;
    let startScrollY = 0;
    
    function updateThumbPosition(): void {
      if (!scrollThumb) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const thumbTrack = window.innerHeight - 120;
      const thumbPos = 60 + (scrollTop / docHeight) * thumbTrack;
      scrollThumb.style.top = `${thumbPos}px`;
    }
    
    scrollThumb.addEventListener('touchstart', (e) => {
      isDragging = true;
      startY = e.touches[0].clientY;
      startScrollY = window.scrollY;
      scrollThumb.style.background = 'rgba(26, 26, 46, 0.95)';
    });
    
    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      const deltaY = e.touches[0].clientY - startY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const thumbTrack = window.innerHeight - 120;
      const scrollDelta = (deltaY / thumbTrack) * docHeight;
      
      window.scrollTo(0, startScrollY + scrollDelta);
    });
    
    document.addEventListener('touchend', () => {
      isDragging = false;
      scrollThumb.style.background = 'rgba(26, 26, 46, 0.8)';
    });
    
    window.addEventListener('scroll', updateThumbPosition);
    updateThumbPosition();
  }
}