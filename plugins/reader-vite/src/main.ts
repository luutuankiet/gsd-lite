/**
 * GSD-Lite Worklog Reader - Main Entry Point
 * 
 * This is the dev server entry point. It:
 * 1. Fetches WORK.md from the dev server via plugin endpoint
 * 2. Parses it into structured AST
 * 3. Renders the interactive viewer
 * 4. Initializes all UI interactions
 * 5. Sets up HMR for instant updates when WORK.md changes
 */

import { parseWorklog } from './parser';
import { renderWorklog, initializeInteractions } from './renderer';
import { initDiagramOverlays } from './diagram-overlay';
import { highlightCodeBlocks } from './syntax-highlight';

// Endpoint served by vite-plugin-worklog
const WORKLOG_ENDPOINT = '/_worklog';

// Track Mermaid errors for the error panel
interface MermaidError {
  line: string;
  error: string;
  code: string;
}
let mermaidErrors: MermaidError[] = [];

async function loadAndRender(): Promise<void> {
  const app = document.getElementById('app');
  if (!app) return;

  // Reset errors on each render
  mermaidErrors = [];

  // ==========================================================================
  // Preserve scroll position across reloads
  // Strategy: Save raw scrollY, restore after render. Simple and reliable.
  // ==========================================================================
  
  const savedScrollY = window.scrollY;
  console.log(`[GSD-Lite Reader] Saving scroll position: ${savedScrollY}px`);

  try {
    // Fetch the raw markdown from the plugin endpoint
    const response = await fetch(WORKLOG_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to load WORK.md: ${response.status} ${response.statusText}`);
    }
    const markdown = await response.text();

    // Parse into AST
    const ast = parseWorklog(markdown);

    // Render to DOM
    app.innerHTML = renderWorklog(ast);

    // Initialize all interactive elements (outline, scroll, etc.)
    initializeInteractions();

    // Initialize Mermaid diagrams (this populates mermaidErrors)
    // Must complete BEFORE scroll restore since diagrams change page height
    await initMermaid();

    // Initialize diagram overlay click handlers (pan/zoom viewer)
    initDiagramOverlays();

    // Apply syntax highlighting to code blocks
    highlightCodeBlocks();

    // Show error panel if there are errors
    showErrorPanel();

    // Restore scroll position AFTER all async rendering is complete
    // Use requestAnimationFrame to ensure browser has painted
    requestAnimationFrame(() => {
      window.scrollTo(0, savedScrollY);
      console.log(`[GSD-Lite Reader] Restored scroll to ${savedScrollY}px`);
    });

    console.log(`[GSD-Lite Reader] Loaded ${ast.metadata.totalLogs} logs in ${ast.metadata.parseTime}ms`);
  } catch (error) {
    app.innerHTML = `
      <div class="loading">
        <div>⚠️ Failed to load worklog</div>
        <div style="font-size: 0.875rem; color: #888;">
          ${error instanceof Error ? error.message : 'Unknown error'}
        </div>
        <div style="font-size: 0.75rem; color: #aaa;">
          Check that WORK.md exists and the dev server is running.
        </div>
      </div>
    `;
  }
}

function showErrorPanel(): void {
  // Remove existing error panel if any
  const existingPanel = document.getElementById('mermaid-error-panel');
  if (existingPanel) existingPanel.remove();

  if (mermaidErrors.length === 0) return;

  const panel = document.createElement('div');
  panel.id = 'mermaid-error-panel';
  panel.innerHTML = `
    <style>
      #mermaid-error-panel {
        position: fixed;
        top: 50px;
        right: 16px;
        width: 400px;
        max-width: calc(100vw - 32px);
        max-height: 60vh;
        background: #fff5f5;
        border: 2px solid #e94560;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 2000;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      #mermaid-error-panel.collapsed {
        max-height: none;
        height: auto;
      }
      #mermaid-error-panel.collapsed .error-panel-body {
        display: none;
      }
      .error-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: #e94560;
        color: white;
        font-weight: 600;
        cursor: pointer;
      }
      .error-panel-header:hover {
        background: #d63050;
      }
      .error-panel-title {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .error-panel-badge {
        background: white;
        color: #e94560;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
      }
      .error-panel-actions {
        display: flex;
        gap: 8px;
      }
      .error-panel-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .error-panel-btn:hover {
        background: rgba(255,255,255,0.3);
      }
      .error-panel-btn.copied {
        background: #4CAF50;
      }
      .error-panel-body {
        overflow-y: auto;
        padding: 12px;
        flex: 1;
      }
      .error-item {
        background: white;
        border: 1px solid #ffcccc;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 8px;
      }
      .error-item:last-child {
        margin-bottom: 0;
      }
      .error-item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      .error-item-line {
        font-weight: 600;
        color: #e94560;
      }
      .error-item-jump {
        background: #e94560;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
      }
      .error-item-jump:hover {
        background: #d63050;
      }
      .error-item-msg {
        font-size: 13px;
        color: #333;
        word-break: break-word;
      }
      @media (max-width: 500px) {
        #mermaid-error-panel {
          right: 8px;
          width: calc(100vw - 16px);
        }
      }
    </style>
    <div class="error-panel-header" onclick="toggleErrorPanel()">
      <div class="error-panel-title">
        ⚠️ Mermaid Errors
        <span class="error-panel-badge">${mermaidErrors.length}</span>
      </div>
      <div class="error-panel-actions">
        <button class="error-panel-btn" onclick="event.stopPropagation(); copyAllErrors();" id="copy-errors-btn">
          📋 Copy All
        </button>
        <span style="font-size: 12px;">▼</span>
      </div>
    </div>
    <div class="error-panel-body">
      ${mermaidErrors.map((err, i) => `
        <div class="error-item">
          <div class="error-item-header">
            <span class="error-item-line">📍 Line ~${err.line}</span>
            <button class="error-item-jump" onclick="jumpToLine(${err.line})">Jump</button>
          </div>
          <div class="error-item-msg">${escapeHtml(err.error)}</div>
        </div>
      `).join('')}
    </div>
  `;

  document.body.appendChild(panel);

  // Add global functions for the panel
  (window as any).toggleErrorPanel = () => {
    panel.classList.toggle('collapsed');
  };

  (window as any).copyAllErrors = () => {
    const errorText = formatErrorsForClipboard();
    navigator.clipboard.writeText(errorText).then(() => {
      const btn = document.getElementById('copy-errors-btn');
      if (btn) {
        btn.classList.add('copied');
        btn.innerHTML = '✓ Copied!';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = '📋 Copy All';
        }, 2000);
      }
    });
  };

  (window as any).jumpToLine = (line: number) => {
    // Find the closest element with this line number
    const target = document.querySelector(`[id^="line-${line}"], [data-start-line="${line}"]`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Flash highlight
      (target as HTMLElement).style.outline = '3px solid #e94560';
      setTimeout(() => {
        (target as HTMLElement).style.outline = '';
      }, 2000);
    }
  };
}

function formatErrorsForClipboard(): string {
  const header = `## Mermaid Diagram Errors in WORK.md\n\nFound ${mermaidErrors.length} broken diagram(s). Please fix:\n`;
  
  const errorList = mermaidErrors.map((err, i) => {
    return `### Error ${i + 1}: Line ~${err.line}

**Error:** ${err.error}

**Broken code:**
\`\`\`mermaid
${err.code}
\`\`\`
`;
  }).join('\n---\n\n');

  return header + '\n' + errorList;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function initMermaid(): Promise<void> {
  // Find all mermaid wrappers (they contain the source blocks)
  const mermaidWrappers = document.querySelectorAll('.mermaid-wrapper');
  if (mermaidWrappers.length === 0) return;

  // Dynamically import mermaid only when needed
  const { default: mermaid } = await import('mermaid');
  
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    // Suppress Mermaid's default error rendering (we handle errors ourselves)
    suppressErrorRendering: true,
    themeVariables: {
      primaryColor: '#e94560',
      primaryTextColor: '#1a1a2e',
      primaryBorderColor: '#6f42c1',
      lineColor: '#6c757d',
      secondaryColor: '#f8f9fa',
      tertiaryColor: '#ffffff',
    },
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
    },
    sequence: {
      useMaxWidth: true,
    },
  });

  // Render each mermaid block
  for (let i = 0; i < mermaidWrappers.length; i++) {
    const wrapper = mermaidWrappers[i] as HTMLElement;
    const sourceBlock = wrapper.querySelector('.mermaid-source') as HTMLElement;
    if (!sourceBlock) continue;
    
    const code = sourceBlock.textContent || '';
    const startLine = wrapper.dataset.startLine || '?';

    try {
      const { svg } = await mermaid.render(`mermaid-${i}`, code);
      wrapper.innerHTML = `<div class="mermaid-container">${svg}</div>`;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      
      // Track error for the panel
      mermaidErrors.push({
        line: startLine,
        error: errorMsg,
        code: code,
      });
      
      console.error(`[Mermaid] Error at WORK.md line ~${startLine}:`, errorMsg);
      
      wrapper.innerHTML = `
        <div class="mermaid-error">
          <strong>⚠️ Mermaid syntax error</strong>
          <div style="margin-top: 0.25rem; font-size: 0.75rem; color: #666;">
            📍 WORK.md line ~${startLine}
          </div>
          <div style="margin-top: 0.5rem; font-size: 0.875rem; color: #c62828;">
            ${errorMsg}
          </div>
          <details style="margin-top: 0.5rem;">
            <summary style="cursor: pointer; font-size: 0.75rem; color: #666;">Show diagram source</summary>
            <pre style="margin-top: 0.5rem; font-size: 0.75rem; background: #f5f5f5; padding: 0.5rem; border-radius: 4px; overflow-x: auto; white-space: pre-wrap;">${code}</pre>
          </details>
        </div>
      `;
    }
  }
}

// =============================================================================
// Live Reload: WebSocket (Production CLI) + Vite HMR (Development)
// =============================================================================

/**
 * WebSocket client for production CLI live reload.
 * The CLI server (cli.js) sends 'reload' messages when WORK.md changes.
 * 
 * This runs in both dev and production, but in dev the Vite HMR below
 * will typically fire first (faster). Having both doesn't hurt.
 */
function connectWebSocket(): void {
  // Determine WebSocket URL based on current page location
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${location.host}`;
  
  try {
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('[GSD-Lite Reader] WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      if (event.data === 'reload') {
        console.log('[GSD-Lite Reader] WORK.md changed (WebSocket), reloading...');
        loadAndRender();
      }
    };
    
    ws.onclose = () => {
      // Reconnect after 2 seconds if connection lost
      // This handles server restarts and network hiccups
      console.log('[GSD-Lite Reader] WebSocket disconnected, reconnecting in 2s...');
      setTimeout(connectWebSocket, 2000);
    };
    
    ws.onerror = () => {
      // Errors are followed by onclose, so we just log here
      // In dev mode with Vite, this may fail (no WS server) - that's fine
    };
  } catch (err) {
    // WebSocket constructor can throw in some edge cases
    console.warn('[GSD-Lite Reader] WebSocket connection failed, will retry');
    setTimeout(connectWebSocket, 2000);
  }
}

// Initial load
loadAndRender();

// Start WebSocket connection for CLI live reload
connectWebSocket();

// Hot Module Replacement - reload when WORK.md changes (Vite dev server only)
if (import.meta.hot) {
  import.meta.hot.on('worklog-update', () => {
    console.log('[GSD-Lite Reader] WORK.md changed (Vite HMR), reloading...');
    loadAndRender();
  });

  // Also handle full module reload
  import.meta.hot.accept(() => {
    loadAndRender();
  });
}