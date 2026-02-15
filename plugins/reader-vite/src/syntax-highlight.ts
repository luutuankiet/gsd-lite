/**
 * Syntax Highlighting - Code block highlighting with Highlight.js
 * 
 * Features:
 * - Auto-detects language when not specified
 * - Supports all common languages (TypeScript, Python, SQL, JSON, YAML, etc.)
 * - GitHub-inspired theme that matches the reader aesthetic
 * - Graceful fallback for unknown languages
 * 
 * Task: READER-002g
 */

import hljs from 'highlight.js/lib/core';

// Import common languages used in GSD-Lite logs
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import bash from 'highlight.js/lib/languages/bash';
import shell from 'highlight.js/lib/languages/shell';
import markdown from 'highlight.js/lib/languages/markdown';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';

// Register languages
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('yml', yaml);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('md', markdown);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('diff', diff);

/**
 * Inject the syntax highlighting CSS theme.
 * Uses a GitHub-inspired light theme that matches the reader aesthetic.
 */
function injectStyles(): void {
  if (document.getElementById('hljs-styles')) return;

  const style = document.createElement('style');
  style.id = 'hljs-styles';
  style.textContent = `
    /* 
     * Semantic Light Theme - High contrast with distinct token colors
     * Designed for readability across all languages (TS, Python, YAML, SQL, etc.)
     */
    .hljs {
      background: #fafafa !important;
      color: #383a42 !important;
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid #e1e4e8 !important;
      font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace;
      font-size: 0.875rem;
      line-height: 1.6;
      overflow-x: auto;
    }

    /* Comments - muted italic gray */
    .hljs-comment,
    .hljs-quote {
      color: #a0a1a7;
      font-style: italic;
    }

    /* Keywords (if, else, return, const, let, from, import) - BOLD PURPLE */
    .hljs-keyword,
    .hljs-selector-tag {
      color: #a626a4;
      font-weight: 600;
    }

    /* Types & Built-ins - ORANGE */
    .hljs-type,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-class .hljs-title {
      color: #c18401;
    }

    /* Strings - GREEN */
    .hljs-string,
    .hljs-doctag,
    .hljs-regexp {
      color: #50a14f;
    }

    /* Numbers - DARK ORANGE */
    .hljs-number {
      color: #986801;
    }

    /* Booleans (true/false/null) - MAGENTA (distinct!) */
    .hljs-literal {
      color: #e45649;
      font-weight: 600;
    }

    /* Variables - RED */
    .hljs-variable,
    .hljs-template-variable {
      color: #e45649;
    }

    /* Functions - BLUE */
    .hljs-title,
    .hljs-title.function_,
    .hljs-section {
      color: #4078f2;
      font-weight: 600;
    }

    /* Keys/Attributes (YAML keys, HTML attrs, JSON keys) - DARK BLUE */
    .hljs-attr,
    .hljs-attribute {
      color: #4078f2;
    }

    /* Names/Tags (HTML tags, XML) - RED */
    .hljs-name,
    .hljs-tag {
      color: #e45649;
    }

    /* Classes/Selectors - ORANGE */
    .hljs-selector-id,
    .hljs-selector-class {
      color: #c18401;
    }

    /* Meta (decorators, preprocessor) - PURPLE */
    .hljs-meta,
    .hljs-meta .hljs-keyword {
      color: #a626a4;
    }

    /* Symbols/Bullets/Punctuation - TEAL */
    .hljs-symbol,
    .hljs-bullet {
      color: #0184bc;
    }

    /* Links - BLUE underlined */
    .hljs-link {
      color: #4078f2;
      text-decoration: underline;
    }

    /* Additions (diff) - GREEN bg */
    .hljs-addition {
      color: #50a14f;
      background-color: #e6ffec;
    }

    /* Deletions (diff) - RED bg */
    .hljs-deletion {
      color: #e45649;
      background-color: #ffebe9;
    }

    /* Emphasis */
    .hljs-emphasis {
      font-style: italic;
    }

    /* Strong */
    .hljs-strong {
      font-weight: bold;
    }

    /* Code blocks in log entries - light subtle container */
    .log-content pre {
      margin: 1rem 0;
      border: none !important;
      background: transparent !important;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    .log-content pre code {
      display: block;
      padding: 0;
    }

    /* Language badge */
    .log-content pre {
      position: relative;
    }

    .log-content pre[data-language]::before {
      content: attr(data-language);
      position: absolute;
      top: 0;
      right: 0;
      padding: 2px 8px;
      font-size: 0.7rem;
      color: #57606a;
      background: #eaeef2;
      border-bottom-left-radius: 4px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      text-transform: uppercase;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Apply syntax highlighting to all code blocks in the document.
 * Call this after the DOM is rendered.
 */
export function highlightCodeBlocks(): void {
  // Inject styles first
  injectStyles();

  // Find all code blocks (excluding mermaid which is handled separately)
  const codeBlocks = document.querySelectorAll('pre code:not(.mermaid-source)');

  codeBlocks.forEach((block) => {
    const codeElement = block as HTMLElement;
    const preElement = codeElement.parentElement;
    
    // Check if already highlighted
    if (codeElement.classList.contains('hljs')) return;

    // Get language from class (e.g., "language-typescript")
    const langClass = Array.from(codeElement.classList).find(c => c.startsWith('language-'));
    const lang = langClass ? langClass.replace('language-', '') : null;

    // Skip mermaid blocks
    if (lang === 'mermaid') return;

    try {
      if (lang && hljs.getLanguage(lang)) {
        // Known language - highlight with specific language
        hljs.highlightElement(codeElement);
        if (preElement) {
          preElement.setAttribute('data-language', lang);
        }
      } else {
        // No language specified or unknown - apply base hljs styles only (light bg, dark text)
        // Do NOT auto-detect: it misclassifies prose/pseudocode as SQL/other languages
        codeElement.classList.add('hljs');
        if (preElement && lang) {
          preElement.setAttribute('data-language', lang);
        }
      }
    } catch (e) {
      // Silently fail - leave code unhighlighted
      console.warn('[Syntax Highlight] Failed to highlight block:', e);
    }
  });
}