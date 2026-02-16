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
            <span class="log-title">${escapeHtml(log.title)}</span>
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
          <a href="#${anchor}" class="outline-link">${escapeHtml(section.title)}</a>
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

/**
 * Render the mobile bottom sheet (shares content structure with outline)
 */
function renderBottomSheet(ast: WorklogAST): string {
  // Sections
  const sectionsHtml = ast.sections.map(s => renderOutlineItem(s, false)).join('');
  
  // Logs in reverse order (newest first for navigation)
  const logsHtml = [...ast.logs].reverse().map(log => renderOutlineItem(log, true)).join('');
  
  return `
    <div class="sheet-overlay" id="sheetOverlay"></div>
    <!-- Peek handle: always visible at bottom edge when sheet is collapsed -->
    <div class="sheet-peek-handle" id="sheetPeekHandle">
      <div class="peek-bar"></div>
    </div>
    <div class="outline-sheet snap-collapsed" id="outlineSheet">
      <div class="sheet-drag-handle" id="sheetDragHandle">
        <div class="sheet-drag-bar"></div>
      </div>
      <div class="sheet-header">
        <span class="sheet-title">📋 Outline</span>
        <div class="sheet-header-buttons">
          <button class="expand-all-btn" id="sheetExpandAllBtn" title="Expand/Collapse All">⊞</button>
          <button class="sheet-close-btn" id="sheetClose">✕</button>
        </div>
      </div>
      <div class="sheet-content">
        <h3 class="outline-section-title">Sections</h3>
        <ul class="outline-list">${sectionsHtml}</ul>
        <h3 class="outline-section-title">Logs (${ast.logs.length})</h3>
        <ul class="outline-list">${logsHtml}</ul>
      </div>
    </div>
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
    
    // Headers (H1-H6)
    const headerMatch = line.match(/^(#{1,6}) (.+)$/);
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
      const rawText = headerMatch[2];
      const text = formatInline(escapeHtml(rawText));
      // Add data-section-title for scroll sync tracking (H4+ inside logs)
      const sectionAttr = level >= 4 ? ` data-section-title="${escapeHtml(rawText)}"` : '';
      
      // Add level tag for H4-H6 (sub-headers inside log content) for visual hierarchy
      const levelTag = level >= 4 ? `<span class="header-level-tag level-${level}">H${level}</span>` : '';
      htmlLines.push(`<h${level} ${anchor}${sectionAttr}>${levelTag}${text}</h${level}>`);
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
// SECTION RENDERING
// ============================================================

/**
 * Render a section (H2/H3) with its content
 */
function renderSection(section: Section): string {
  const content = section.content ? renderMarkdown(section.content, section.lineNumber + 1) : '';
  const levelClass = `section-h${section.level}`;
  
  return `
    <section class="worklog-section ${levelClass}" id="line-${section.lineNumber}" data-section-title="${escapeHtml(section.title)}">
      <h${section.level} class="section-title">${formatInline(escapeHtml(section.title))}</h${section.level}>
      <div class="section-content">
        ${content}
      </div>
    </section>
  `;
}

// ============================================================
// LOG ENTRY RENDERING
// ============================================================

/**
 * Render a single log entry card
 */
function renderLogEntry(log: LogEntry): string {
  // Content may have been trimmed, losing leading empty lines.
  // We need to adjust startLine to account for this.
  // The parser stores children lineNumbers as absolute file lines,
  // so rendered line IDs must match those for anchor navigation to work.
  // 
  // Calculate offset: if original content had N leading empty lines that were trimmed,
  // startLine should be log.lineNumber + 1 + N (not just + 1)
  //
  // Since we don't have access to pre-trimmed content, we use a heuristic:
  // The first non-empty line of content should match log.lineNumber + 1 if no trimming.
  // But if content is trimmed, the actual file line is higher.
  // 
  // For now, we'll assume content starts right after the log header (line + 1).
  // If children don't align, the outline links won't work. This is a known limitation
  // that requires parser changes to fully fix.
  const content = renderMarkdown(log.content, log.lineNumber + 1);
  const supersededClass = log.superseded ? ' superseded' : '';
  
  return `
    <article class="log-entry${supersededClass}" id="line-${log.lineNumber}" data-section-title="${escapeHtml(log.id + ': ' + log.title)}">
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
  const bottomSheet = renderBottomSheet(ast);
  
  // Combine sections and logs, sort by line number for correct document order
  type ContentItem = { type: 'section' | 'log'; lineNumber: number; item: Section | LogEntry };
  const allItems: ContentItem[] = [
    ...ast.sections.map(s => ({ type: 'section' as const, lineNumber: s.lineNumber, item: s })),
    ...ast.logs.map(l => ({ type: 'log' as const, lineNumber: l.lineNumber, item: l })),
  ];
  allItems.sort((a, b) => a.lineNumber - b.lineNumber);
  
  // Render in order
  const content = allItems.map(({ type, item }) => {
    if (type === 'section') {
      return renderSection(item as Section);
    } else {
      return renderLogEntry(item as LogEntry);
    }
  }).join('');
  
  const latestLogLine = ast.logs.length > 0 ? ast.logs[ast.logs.length - 1].lineNumber : 1;
  
  return `
    <!-- Top Bar -->
    <header class="top-bar">
      <button class="btn-outline-toggle" id="outlineToggle">📋</button>
      <span class="top-bar-title">GSD-Lite Worklog</span>
      <button class="btn-jump-latest" id="jumpLatest" data-line="${latestLogLine}">⬇ Latest</button>
    </header>
    
    <!-- Sticky Breadcrumb (shows current position while scrolling) -->
    <nav class="breadcrumb" id="breadcrumb">
      <span class="breadcrumb-text">GSD-Lite Worklog</span>
    </nav>
    
    <!-- Outline Panel (Desktop) -->
    ${outline}
    
    <!-- Bottom Sheet (Mobile) -->
    ${bottomSheet}
    
    <!-- Overlay (mobile - for desktop sidebar) -->
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
  const breadcrumb = document.getElementById('breadcrumb');
  const outlineToggle = document.getElementById('outlineToggle');
  const outlineClose = document.getElementById('outlineClose');
  const expandAllBtn = document.getElementById('expandAllBtn');
  const jumpLatest = document.getElementById('jumpLatest');
  const scrollThumb = document.getElementById('scrollThumb');
  
  if (!outline || !overlay || !content) return;
  
  let allExpanded = false;
  
  // ===== SCROLL OUTLINE TO ACTIVE ITEM =====
  // Reusable function to scroll the outline (sidebar or sheet) to show the currently active item
  function scrollOutlineToActive(): void {
    // On mobile, scroll the sheet; on desktop, scroll the sidebar
    const isMobile = window.innerWidth < 768;
    
    // Find the active link in the appropriate container
    // Note: Sheet uses .sheet-content, sidebar uses .outline-content
    const container = isMobile 
      ? document.querySelector('#outlineSheet .sheet-content') as HTMLElement | null
      : document.querySelector('#outline') as HTMLElement | null;
    
    if (!container) return;
    
    const activeLink = container.querySelector('.outline-link.active') as HTMLElement | null;
    if (!activeLink) return;

    // Ensure parent items are expanded so active item is visible
    let parent = activeLink.closest('.outline-item');
    while (parent) {
      const parentItem = parent.parentElement?.closest('.outline-item');
      if (parentItem) {
        parentItem.classList.remove('collapsed');
      }
      parent = parentItem ?? null;
    }

    // Scroll the active link into view within the container
    // Mobile: use 'start' since sheet is only 50% height, 'center' would be hidden
    // Desktop: use 'center' for better context
    setTimeout(() => {
      const block = isMobile ? 'start' : 'center';
      activeLink.scrollIntoView({ behavior: 'instant', block });
    }, 50);
  }

  // ===== OUTLINE TOGGLE (Desktop only - mobile uses bottom sheet) =====
  function toggleOutline(): void {
    // Desktop: toggle sidebar
    if (window.innerWidth >= 768) {
      const wasHidden = outline!.classList.contains('hidden');
      outline!.classList.toggle('hidden');
      content!.classList.toggle('full-width');
      breadcrumb?.classList.toggle('full-width');
      
      // If sidebar just became visible, scroll to active item
      // Wait for CSS transition to complete (300ms) before scrolling
      if (wasHidden) {
        setTimeout(() => scrollOutlineToActive(), 350);
      }
    }
    // Mobile: handled by bottom sheet below
  }
  
  // Desktop sidebar toggle (📋 button handled specially for mobile below)
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

  // ===== MOBILE BOTTOM SHEET =====
  const outlineSheet = document.getElementById('outlineSheet');
  const sheetOverlay = document.getElementById('sheetOverlay');
  const sheetDragHandle = document.getElementById('sheetDragHandle');
  const sheetClose = document.getElementById('sheetClose');
  const sheetExpandAllBtn = document.getElementById('sheetExpandAllBtn');

  // Get peek handle element
  const sheetPeekHandle = document.getElementById('sheetPeekHandle');

  if (outlineSheet && sheetOverlay && sheetDragHandle) {
    type SheetState = 'collapsed' | 'half' | 'full';
    let currentSheetState: SheetState = 'collapsed';
    let sheetAllExpanded = false;

    function setSheetState(state: SheetState): void {
      const wasCollapsed = currentSheetState === 'collapsed';
      currentSheetState = state;
      outlineSheet!.classList.remove('snap-collapsed', 'snap-half', 'snap-full');
      outlineSheet!.classList.add(`snap-${state}`);
      sheetOverlay!.classList.toggle('visible', state !== 'collapsed');
      
      // Show/hide peek handle based on sheet state
      // Peek handle should be visible only when sheet is collapsed
      if (sheetPeekHandle) {
        sheetPeekHandle.classList.toggle('hidden', state !== 'collapsed');
      }
      
      // If sheet just became visible, scroll to active item
      // Wait for CSS transition to complete (300ms) before scrolling
      if (wasCollapsed && state !== 'collapsed') {
        setTimeout(() => scrollOutlineToActive(), 350);
      }
    }

    // Close button
    sheetClose?.addEventListener('click', () => setSheetState('collapsed'));

    // Overlay tap closes sheet
    sheetOverlay.addEventListener('click', () => setSheetState('collapsed'));

    // Expand/collapse all in sheet
    sheetExpandAllBtn?.addEventListener('click', () => {
      const items = outlineSheet!.querySelectorAll('.outline-item.has-children');
      if (sheetAllExpanded) {
        items.forEach(item => item.classList.add('collapsed'));
        sheetExpandAllBtn.textContent = '⊞';
      } else {
        items.forEach(item => item.classList.remove('collapsed'));
        sheetExpandAllBtn.textContent = '⊟';
      }
      sheetAllExpanded = !sheetAllExpanded;
    });

    // Touch gesture handling for drag
    let sheetDragStartY = 0;
    let sheetDragCurrentY = 0;
    let isSheetDragging = false;

    sheetDragHandle.addEventListener('touchstart', (e) => {
      isSheetDragging = true;
      sheetDragStartY = e.touches[0].clientY;
      sheetDragCurrentY = sheetDragStartY;
      outlineSheet!.style.transition = 'none';
    });

    // Peek handle: swipe up from bottom edge to open sheet
    // Uses the same drag state as sheetDragHandle for consistency
    if (sheetPeekHandle) {
      sheetPeekHandle.addEventListener('touchstart', (e) => {
        isSheetDragging = true;
        sheetDragStartY = e.touches[0].clientY;
        sheetDragCurrentY = sheetDragStartY;
        outlineSheet!.style.transition = 'none';
        // Immediately show the sheet starting to rise
        outlineSheet!.style.transform = 'translateY(95%)';
      });
      
      // Also support simple tap to open (not just swipe)
      sheetPeekHandle.addEventListener('click', () => {
        if (currentSheetState === 'collapsed') {
          setSheetState('half');
        }
      });
    }

    document.addEventListener('touchmove', (e) => {
      if (!isSheetDragging) return;
      sheetDragCurrentY = e.touches[0].clientY;
      
      // Calculate how much to offset based on drag direction
      const deltaY = sheetDragCurrentY - sheetDragStartY;
      
      // Get current base position based on state
      let baseTranslateY: number;
      switch (currentSheetState) {
        case 'collapsed': baseTranslateY = 100; break;
        case 'half': baseTranslateY = 50; break;
        case 'full': baseTranslateY = 15; break;
      }
      
      // Apply drag offset (constrained between 15% and 100%)
      const dragPercent = (deltaY / window.innerHeight) * 100;
      const newTranslateY = Math.max(15, Math.min(100, baseTranslateY + dragPercent));
      outlineSheet!.style.transform = `translateY(${newTranslateY}%)`;
    });

    document.addEventListener('touchend', () => {
      if (!isSheetDragging) return;
      isSheetDragging = false;
      
      // Re-enable transitions
      outlineSheet!.style.transition = '';
      outlineSheet!.style.transform = '';
      
      const deltaY = sheetDragCurrentY - sheetDragStartY;
      const threshold = 50; // pixels needed to trigger state change
      
      if (deltaY < -threshold) {
        // Swiped up - expand
        if (currentSheetState === 'collapsed') {
          setSheetState('half');
        } else if (currentSheetState === 'half') {
          setSheetState('full');
        }
      } else if (deltaY > threshold) {
        // Swiped down - collapse
        if (currentSheetState === 'full') {
          setSheetState('half');
        } else if (currentSheetState === 'half') {
          setSheetState('collapsed');
        }
      }
    });

    // Keep sheet open on link click for continued navigation
    // User can close manually via X button, overlay tap, or swipe down

    // Toggle button: opens sheet on mobile, toggles sidebar on desktop
    if (outlineToggle) {
      outlineToggle.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          // Mobile: toggle bottom sheet
          if (currentSheetState === 'collapsed') {
            setSheetState('half');
          } else {
            setSheetState('collapsed');
          }
        } else {
          // Desktop: toggle sidebar
          toggleOutline();
        }
      });
    }
  }
  
  // ===== SCROLL SYNC: BREADCRUMB + OUTLINE HIGHLIGHTING =====
  const breadcrumbText = breadcrumb?.querySelector('.breadcrumb-text');

  // Find all trackable sections (log entries and sections with data-section-title)
  const trackableSections = document.querySelectorAll('[data-section-title]');

  if (trackableSections.length > 0 && breadcrumbText) {
    // Track which section is currently visible
    let currentSectionId: string | null = null;
    // Offset from top of viewport to consider as the "reading line"
    // Matches the sticky header area (top bar 50px + breadcrumb 36px + small buffer)
    const READING_LINE_OFFSET = 96;

    function updateCurrentSection() {
      // Find the last section whose top has scrolled past the reading line.
      // This is the section the user is currently reading, regardless of scroll direction.
      let activeElement: HTMLElement | null = null;

      for (let i = 0; i < trackableSections.length; i++) {
        const el = trackableSections[i] as HTMLElement;
        const rect = el.getBoundingClientRect();
        if (rect.top <= READING_LINE_OFFSET) {
          activeElement = el;
        } else {
          // Sections are in document order; once one is below the reading line,
          // all subsequent ones will be too, so stop early.
          break;
        }
      }

      // Fall back to the first section if nothing has scrolled past yet (top of page)
      if (!activeElement && trackableSections.length > 0) {
        activeElement = trackableSections[0] as HTMLElement;
      }

      if (!activeElement) return;

      const sectionId = activeElement.id;
      if (sectionId === currentSectionId) return;

      currentSectionId = sectionId;
      
      // For breadcrumb: Always show the parent LOG entry, not sub-headers
      // This provides stable context ("I'm in LOG-063") while reading sub-sections
      let breadcrumbTitle = activeElement.dataset.sectionTitle || 'GSD-Lite Worklog';
      
      // Check if this is a child element inside a log-entry
      const parentLogEntry = activeElement.closest('.log-entry') as HTMLElement | null;
      if (parentLogEntry && parentLogEntry !== activeElement) {
        // We're inside a log but on a sub-header - use the log's title for breadcrumb
        breadcrumbTitle = parentLogEntry.dataset.sectionTitle || breadcrumbTitle;
      }

      // Update breadcrumb with parent log context
      breadcrumbText!.textContent = breadcrumbTitle;

      // Update outline highlighting in BOTH sidebar and sheet
      document.querySelectorAll('.outline-link').forEach(link => {
        link.classList.remove('active');
      });

      // Try to find outline link for the exact section first
      let outlineLinks = document.querySelectorAll(`.outline-link[href="#${sectionId}"]`);
      
      // If no outline link for this exact section (e.g., sub-header not in outline),
      // fall back to the parent log entry's outline link
      if (outlineLinks.length === 0 && parentLogEntry) {
        const parentId = parentLogEntry.id;
        outlineLinks = document.querySelectorAll(`.outline-link[href="#${parentId}"]`);
      }
      outlineLinks.forEach(outlineLink => {
        outlineLink.classList.add('active');

        // Ensure parent items are expanded so active item is visible
        let parent = outlineLink.closest('.outline-item');
        while (parent) {
          const parentItem = parent.parentElement?.closest('.outline-item');
          if (parentItem) {
            parentItem.classList.remove('collapsed');
          }
          parent = parentItem ?? null;
        }
      });

      // Scroll outline to show active item (smooth, only if visible and out of view)
      // Only scroll the currently visible outline container
      // Note: Sidebar uses #outline (scrollable), sheet uses .sheet-content (scrollable)
      const sidebarContainer = document.querySelector('#outline:not(.hidden)') as HTMLElement | null;
      const sheetContainer = document.querySelector('#outlineSheet:not(.snap-collapsed) .sheet-content') as HTMLElement | null;
      
      const visibleOutlineContainer = sidebarContainer || sheetContainer;
      if (visibleOutlineContainer) {
        const activeLink = visibleOutlineContainer.querySelector('.outline-link.active') as HTMLElement | null;
        if (activeLink) {
          const linkRect = activeLink.getBoundingClientRect();
          const containerRect = visibleOutlineContainer.getBoundingClientRect();

          if (linkRect.top < containerRect.top || linkRect.bottom > containerRect.bottom) {
            activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    }

    // Use rAF-throttled scroll listener for snappy, direction-agnostic tracking
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
          updateCurrentSection();
          scrollTicking = false;
        });
      }
    }, { passive: true });

    // Run once on load to set initial state
    updateCurrentSection();
  }
}