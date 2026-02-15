#!/usr/bin/env python3
"""
GSD-Lite Worklog Viewer Generator

Compiles WORK.md into a self-contained HTML file with:
- Mobile-first outline navigation (slide-in on mobile, sticky sidebar on desktop)
- Sticky top bar with "Jump to Latest"
- Collapsible outline sections
- Mobile scroll thumb for easy navigation
- Rendered markdown content with anchors

Usage:
    python generate_worklog_viewer.py gsd-lite/WORK.md -o worklog.html
"""

import argparse
import html
import re
from pathlib import Path

from parse_worklog import parse_worklog, ast_to_dict, WorklogAST


def format_inline(text: str) -> str:
    """Apply inline markdown formatting to text."""
    # Bold (must come before italic to handle ***bold italic***)
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    # Italic
    text = re.sub(r'\*(.+?)\*', r'<em>\1</em>', text)
    # Inline code
    text = re.sub(r'`(.+?)`', r'<code>\1</code>', text)
    # Strikethrough
    text = re.sub(r'~~(.+?)~~', r'<del>\1</del>', text)
    # Links
    text = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2">\1</a>', text)
    return text


def render_outline_item(item: dict, is_log: bool = False) -> str:
    """Render a single outline item (log or section) as HTML."""
    anchor = f"line-{item['line']}"
    has_children = bool(item.get('children'))
    
    if is_log:
        # Log entry with type badge
        log_id = item['id']
        log_type = item['type']
        title = html.escape(item['title'])
        superseded_class = ' superseded' if item.get('superseded') else ''
        
        children_html = ""
        toggle_btn = ""
        collapsed_class = ""
        if has_children:
            toggle_btn = '<span class="toggle-btn">▼</span>'
            children_items = ''.join(
                render_outline_item(c, is_log=False) 
                for c in item['children']
            )
            children_html = f'<ul class="outline-children">{children_items}</ul>'
        
        return f'''<li class="outline-item log-item{superseded_class}{' has-children collapsed' if has_children else ''}">
            <div class="outline-row">
                {toggle_btn}
                <a href="#{anchor}" class="outline-link">
                    <span class="badge badge-{log_type}">{log_type}</span>
                    <span class="log-id">{log_id}</span>
                    <span class="log-title">{title}</span>
                </a>
            </div>
            {children_html}
        </li>'''
    else:
        # Regular section
        title = html.escape(item['title'])
        indent_class = f"indent-{item['level']}"
        
        children_html = ""
        toggle_btn = ""
        if has_children:
            toggle_btn = '<span class="toggle-btn">▼</span>'
            children_items = ''.join(
                render_outline_item(c, is_log=False) 
                for c in item['children']
            )
            children_html = f'<ul class="outline-children">{children_items}</ul>'
        
        return f'''<li class="outline-item section-item {indent_class}{' has-children collapsed' if has_children else ''}">
            <div class="outline-row">
                {toggle_btn}
                <a href="#{anchor}" class="outline-link">{title}</a>
            </div>
            {children_html}
        </li>'''


def render_outline(ast_dict: dict) -> str:
    """Render the full outline panel HTML."""
    # Top-level sections
    sections_html = ''.join(
        render_outline_item(s, is_log=False) 
        for s in ast_dict['sections']
    )
    
    # Log entries (descending order - newest first)
    logs_html = ''.join(
        render_outline_item(log, is_log=True) 
        for log in reversed(ast_dict['logs'])
    )
    
    return f'''
    <nav class="outline" id="outline">
        <div class="outline-header">
            <span>📋 Outline</span>
            <div class="outline-header-buttons">
                <button class="expand-all-btn" onclick="toggleExpandAll()" title="Expand/Collapse All">⊞</button>
                <button class="outline-close" onclick="toggleOutline()">✕</button>
            </div>
        </div>
        <div class="outline-content">
            <h3 class="outline-section-title">Sections</h3>
            <ul class="outline-list">{sections_html}</ul>
            <h3 class="outline-section-title">Logs ({len(ast_dict['logs'])})</h3>
            <ul class="outline-list">{logs_html}</ul>
        </div>
    </nav>
    '''


def render_markdown_to_html(md_content: str, ast: WorklogAST) -> str:
    """
    Convert markdown to HTML with anchors at each header.
    
    POC: Simple regex-based conversion. 
    Future: Use mistune for proper parsing.
    """
    lines = md_content.splitlines()
    html_lines = []
    in_code_fence = False
    in_table = False
    code_lang = ""
    code_buffer = []
    
    for line_num, line in enumerate(lines, start=1):
        anchor = f'id="line-{line_num}"'
        
        # Handle code fences
        if line.startswith('```') or line.startswith('~~~'):
            if not in_code_fence:
                # Close any open table first
                if in_table:
                    html_lines.append('</tbody></table>')
                    in_table = False
                in_code_fence = True
                code_lang = line[3:].strip()
                code_buffer = []
            else:
                in_code_fence = False
                code_content = html.escape('\n'.join(code_buffer))
                lang_class = f' class="language-{code_lang}"' if code_lang else ''
                html_lines.append(f'<pre><code{lang_class}>{code_content}</code></pre>')
            continue
        
        if in_code_fence:
            code_buffer.append(line)
            continue
        
        # Headers (H1-H5)
        header_match = re.match(r'^(#{1,5}) (.+)$', line)
        if header_match:
            # Close any open table
            if in_table:
                html_lines.append('</tbody></table>')
                in_table = False
            level = len(header_match.group(1))
            text = html.escape(header_match.group(2))
            html_lines.append(f'<h{level} {anchor}>{text}</h{level}>')
            continue
        
        # Horizontal rules
        if re.match(r'^---+$', line):
            if in_table:
                html_lines.append('</tbody></table>')
                in_table = False
            html_lines.append('<hr>')
            continue
        
        # Empty lines
        if not line.strip():
            if in_table:
                html_lines.append('</tbody></table>')
                in_table = False
            html_lines.append('<br>')
            continue
        
        # Tables
        if '|' in line and line.strip().startswith('|'):
            cells = [c.strip() for c in line.split('|')[1:-1]]
            
            # Check if this is the separator row (|---|---|)
            if all(re.match(r'^:?-+:?$', c) for c in cells if c):
                # Skip separator but keep table open
                continue
            
            # Start table if not already in one
            if not in_table:
                html_lines.append('<table><thead><tr>')
                # First row is header - apply inline formatting
                cells_html = ''.join(f'<th>{format_inline(html.escape(c))}</th>' for c in cells)
                html_lines.append(f'{cells_html}</tr></thead><tbody>')
                in_table = True
            else:
                # Data row - apply inline formatting
                cells_html = ''.join(f'<td>{format_inline(html.escape(c))}</td>' for c in cells)
                html_lines.append(f'<tr>{cells_html}</tr>')
            continue
        
        # Close table if we hit non-table content
        if in_table:
            html_lines.append('</tbody></table>')
            in_table = False
        
        # Default: paragraph with inline formatting
        text = format_inline(html.escape(line))
        html_lines.append(f'<p {anchor}>{text}</p>')
    
    # Close any trailing table
    if in_table:
        html_lines.append('</tbody></table>')
    
    return '\n'.join(html_lines)


def generate_html(md_path: Path) -> str:
    """Generate complete HTML viewer from WORK.md."""
    
    # Parse structure
    ast = parse_worklog(md_path)
    ast_dict = ast_to_dict(ast)
    
    # Render components
    outline_html = render_outline(ast_dict)
    content_html = render_markdown_to_html(md_path.read_text(), ast)
    
    # Find latest log for "Jump to Latest"
    latest_log_line = ast_dict['logs'][-1]['line'] if ast_dict['logs'] else 1
    
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>GSD-Lite Worklog</title>
    <style>
        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }}
        
        /* ===== TOP BAR ===== */
        .top-bar {{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 50px;
            background: #1a1a2e;
            color: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 12px;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }}
        
        .top-bar-title {{
            font-size: 14px;
            font-weight: 500;
            flex-shrink: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0 8px;
        }}
        
        .top-bar button {{
            background: #4a4a6a;
            border: none;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            flex-shrink: 0;
            white-space: nowrap;
        }}
        
        .top-bar button:hover {{
            background: #5a5a7a;
        }}
        
        /* ===== OUTLINE PANEL ===== */
        .outline {{
            position: fixed;
            top: 50px;
            left: 0;
            bottom: 0;
            width: 300px;
            min-width: 200px;
            max-width: 80vw;
            background: white;
            border-right: 1px solid #ddd;
            overflow-y: auto;
            overflow-x: hidden;
            z-index: 999;
            /* Mobile: hidden by default */
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            /* Resizable */
            resize: horizontal;
        }}
        
        .outline.open {{
            transform: translateX(0);
        }}
        
        /* Resize handle styling */
        .outline::-webkit-resizer {{
            background: linear-gradient(135deg, transparent 50%, #ccc 50%, #ccc 60%, transparent 60%);
            cursor: ew-resize;
        }}
        
        .outline-header {{
            position: sticky;
            top: 0;
            background: #f8f8f8;
            padding: 12px 16px;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            z-index: 10;
        }}
        
        .outline-header-buttons {{
            display: flex;
            gap: 8px;
            align-items: center;
        }}
        
        .expand-all-btn {{
            background: none;
            border: 1px solid #ccc;
            font-size: 16px;
            cursor: pointer;
            color: #666;
            padding: 2px 6px;
            border-radius: 4px;
        }}
        
        .expand-all-btn:hover {{
            background: #eee;
            color: #333;
        }}
        
        .outline-close {{
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #666;
        }}
        
        .outline-content {{
            padding: 8px 0;
            overflow-x: auto;
        }}
        
        .outline-section-title {{
            padding: 8px 16px;
            font-size: 12px;
            text-transform: uppercase;
            color: #888;
            border-bottom: 1px solid #eee;
            position: sticky;
            top: 0;
            background: white;
            z-index: 5;
        }}
        
        .outline-list {{
            list-style: none;
        }}
        
        .outline-item {{
            white-space: nowrap;
        }}
        
        .outline-row {{
            display: flex;
            align-items: center;
        }}
        
        .toggle-btn {{
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 10px;
            color: #888;
            flex-shrink: 0;
            user-select: none;
        }}
        
        .toggle-btn:hover {{
            color: #333;
        }}
        
        /* Spacer for items without children to align with toggle buttons */
        .outline-item:not(.has-children) .outline-row {{
            padding-left: 20px;
        }}
        
        .outline-item.collapsed > .outline-children {{
            display: none;
        }}
        
        .outline-item.collapsed .toggle-btn {{
            transform: rotate(-90deg);
        }}
        
        .outline-link {{
            display: block;
            padding: 6px 8px;
            color: #333;
            text-decoration: none;
            font-size: 13px;
            flex-grow: 1;
        }}
        
        .outline-link:hover {{
            background: #f0f0f0;
        }}
        
        .outline-children {{
            list-style: none;
            padding-left: 20px;
        }}
        
        /* Log item styling */
        .log-item .outline-link {{
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        
        .log-id {{
            font-weight: 600;
            color: #555;
            flex-shrink: 0;
        }}
        
        .log-title {{
            color: #666;
            overflow: hidden;
            text-overflow: ellipsis;
        }}
        
        .log-item.superseded {{
            opacity: 0.5;
        }}
        
        .log-item.superseded .log-title {{
            text-decoration: line-through;
        }}
        
        /* Type badges */
        .badge {{
            font-size: 9px;
            padding: 2px 5px;
            border-radius: 3px;
            font-weight: 600;
            text-transform: uppercase;
            flex-shrink: 0;
        }}
        
        .badge-DECISION {{ background: #4CAF50; color: white; }}
        .badge-EXEC {{ background: #2196F3; color: white; }}
        .badge-DISCOVERY {{ background: #9C27B0; color: white; }}
        .badge-VISION {{ background: #FF9800; color: white; }}
        .badge-MILESTONE {{ background: #E91E63; color: white; }}
        .badge-PLAN {{ background: #00BCD4; color: white; }}
        .badge-TOOLING {{ background: #795548; color: white; }}
        .badge-ARCHITECTURE {{ background: #607D8B; color: white; }}
        .badge-DESIGN {{ background: #3F51B5; color: white; }}
        
        /* Section indentation */
        .indent-3 .outline-link {{ padding-left: 8px; }}
        .indent-4 .outline-link {{ padding-left: 16px; }}
        .indent-5 .outline-link {{ padding-left: 24px; }}
        
        /* ===== CONTENT AREA ===== */
        .content {{
            margin-top: 50px;
            padding: 16px;
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
            background: white;
            min-height: calc(100vh - 50px);
        }}
        
        /* Scroll margin to clear sticky top bar when navigating */
        .content h1, .content h2, .content h3, .content h4, .content h5, .content p {{
            scroll-margin-top: 60px;
        }}
        
        .content h1 {{ font-size: 24px; margin: 20px 0 12px; border-bottom: 2px solid #333; padding-bottom: 8px; }}
        .content h2 {{ font-size: 20px; margin: 18px 0 10px; color: #1a1a2e; }}
        .content h3 {{ font-size: 17px; margin: 14px 0 8px; color: #333; }}
        .content h4 {{ font-size: 15px; margin: 12px 0 6px; color: #555; }}
        .content h5 {{ font-size: 13px; margin: 10px 0 4px; color: #666; }}
        
        .content p {{ margin: 6px 0; }}
        .content pre {{
            background: #1a1a2e;
            color: #f8f8f2;
            padding: 12px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 10px 0;
            font-size: 12px;
        }}
        .content code {{
            background: #f0f0f0;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: 'SF Mono', 'Consolas', monospace;
            font-size: 12px;
        }}
        .content pre code {{
            background: none;
            padding: 0;
        }}
        
        .content table {{
            border-collapse: collapse;
            margin: 10px 0;
            width: 100%;
            font-size: 13px;
            display: block;
            overflow-x: auto;
        }}
        .content th {{
            background: #f5f5f5;
            font-weight: 600;
        }}
        .content td, .content th {{
            border: 1px solid #ddd;
            padding: 6px 10px;
            text-align: left;
        }}
        .content tr:nth-child(even) {{
            background: #fafafa;
        }}
        
        .content hr {{
            border: none;
            border-top: 1px solid #ddd;
            margin: 20px 0;
        }}
        
        .content del {{
            color: #999;
        }}
        
        .content a {{
            color: #2196F3;
        }}
        
        /* ===== OVERLAY (mobile) ===== */
        .overlay {{
            display: none;
            position: fixed;
            top: 50px;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.3);
            z-index: 998;
        }}
        
        .overlay.visible {{
            display: block;
        }}
        
        /* ===== MOBILE SCROLL THUMB ===== */
        .scroll-thumb {{
            position: fixed;
            right: 8px;
            width: 44px;
            height: 60px;
            background: rgba(26, 26, 46, 0.8);
            border-radius: 8px;
            z-index: 1001;
            cursor: grab;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            touch-action: none;
            user-select: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }}
        
        .scroll-thumb:active {{
            cursor: grabbing;
            background: rgba(26, 26, 46, 0.95);
        }}
        
        .scroll-thumb .thumb-icon {{
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 12px;
            gap: 2px;
        }}
        
        /* Hide scroll thumb on desktop */
        @media (min-width: 768px) {{
            .scroll-thumb {{
                display: none;
            }}
        }}
        
        /* ===== SCROLLBAR ===== */
        ::-webkit-scrollbar {{
            width: 10px;
            height: 10px;
        }}
        ::-webkit-scrollbar-track {{
            background: #f1f1f1;
        }}
        ::-webkit-scrollbar-thumb {{
            background: #888;
            border-radius: 5px;
        }}
        ::-webkit-scrollbar-thumb:hover {{
            background: #555;
        }}
        
        /* ===== DESKTOP LAYOUT (768px+) ===== */
        @media (min-width: 768px) {{
            .outline {{
                transform: translateX(0);  /* Visible by default */
            }}
            
            .outline.hidden {{
                transform: translateX(-100%);  /* Hidden when toggled */
            }}
            
            .content {{
                margin-left: 300px;  /* Make room for sidebar */
                max-width: calc(100% - 320px);
                transition: margin-left 0.3s ease;
            }}
            
            .content.full-width {{
                margin-left: 0;
                max-width: 100%;
            }}
            
            .overlay {{
                display: none !important;  /* Never show overlay on desktop */
            }}
        }}
    </style>
</head>
<body>
    <header class="top-bar">
        <button class="btn-outline-toggle" onclick="toggleOutline()">📋</button>
        <span class="top-bar-title">GSD-Lite Worklog</span>
        <button onclick="jumpToLatest()">⬇ Latest</button>
    </header>
    
    {outline_html}
    
    <div class="overlay" id="overlay" onclick="toggleOutline()"></div>
    
    <main class="content" id="content">
        {content_html}
    </main>
    
    <!-- Mobile scroll thumb -->
    <div class="scroll-thumb" id="scrollThumb">
        <div class="thumb-icon">
            <span>↕</span>
        </div>
    </div>
    
    <script>
        const outline = document.getElementById('outline');
        const overlay = document.getElementById('overlay');
        const content = document.getElementById('content');
        const scrollThumb = document.getElementById('scrollThumb');
        
        // ===== OUTLINE TOGGLE =====
        function toggleOutline() {{
            if (window.innerWidth >= 768) {{
                // Desktop: toggle hidden class + adjust content
                outline.classList.toggle('hidden');
                content.classList.toggle('full-width');
            }} else {{
                // Mobile: slide-in behavior
                outline.classList.toggle('open');
                overlay.classList.toggle('visible');
            }}
        }}
        
        function jumpToLatest() {{
            document.getElementById('line-{latest_log_line}').scrollIntoView({{ behavior: 'smooth' }});
        }}
        
        // Sidebar resize overlays content (no content reflow)
        
        // Close outline when clicking a link (mobile only)
        document.querySelectorAll('.outline-link').forEach(link => {{
            link.addEventListener('click', () => {{
                if (window.innerWidth < 768) {{
                    outline.classList.remove('open');
                    overlay.classList.remove('visible');
                }}
            }});
        }});
        
        // ===== COLLAPSIBLE SECTIONS =====
        let allExpanded = false;
        
        function toggleExpandAll() {{
            const items = document.querySelectorAll('.outline-item.has-children');
            const btn = document.querySelector('.expand-all-btn');
            
            if (allExpanded) {{
                // Collapse all
                items.forEach(item => item.classList.add('collapsed'));
                btn.textContent = '⊞';
                btn.title = 'Expand All';
            }} else {{
                // Expand all
                items.forEach(item => item.classList.remove('collapsed'));
                btn.textContent = '⊟';
                btn.title = 'Collapse All';
            }}
            allExpanded = !allExpanded;
        }}
        
        // Single click = toggle one level (collapse includes descendants)
        // Double click = expand all descendants
        document.querySelectorAll('.toggle-btn').forEach(btn => {{
            // Single click - toggle this item; if collapsing, collapse descendants too
            btn.addEventListener('click', (e) => {{
                e.stopPropagation();
                const item = btn.closest('.outline-item');
                const isCollapsed = item.classList.contains('collapsed');
                
                if (isCollapsed) {{
                    // Expanding - just expand this item
                    item.classList.remove('collapsed');
                }} else {{
                    // Collapsing - collapse this item AND all descendants
                    item.classList.add('collapsed');
                    item.querySelectorAll('.outline-item.has-children').forEach(child => {{
                        child.classList.add('collapsed');
                    }});
                }}
            }});
            
            // Double click - expand all descendants
            btn.addEventListener('dblclick', (e) => {{
                e.stopPropagation();
                const item = btn.closest('.outline-item');
                // Remove collapsed from this item and all descendants
                item.classList.remove('collapsed');
                item.querySelectorAll('.outline-item.has-children').forEach(child => {{
                    child.classList.remove('collapsed');
                }});
            }});
        }});
        
        // ===== MOBILE SCROLL THUMB =====
        let isDragging = false;
        let startY = 0;
        let startScrollY = 0;
        
        function updateThumbPosition() {{
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const thumbTrack = window.innerHeight - 120; // 50px top bar + padding
            const thumbPos = 60 + (scrollTop / docHeight) * thumbTrack;
            scrollThumb.style.top = thumbPos + 'px';
        }}
        
        scrollThumb.addEventListener('touchstart', (e) => {{
            isDragging = true;
            startY = e.touches[0].clientY;
            startScrollY = window.scrollY;
            scrollThumb.style.background = 'rgba(26, 26, 46, 0.95)';
        }});
        
        document.addEventListener('touchmove', (e) => {{
            if (!isDragging) return;
            
            const deltaY = e.touches[0].clientY - startY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const thumbTrack = window.innerHeight - 120;
            const scrollDelta = (deltaY / thumbTrack) * docHeight;
            
            window.scrollTo(0, startScrollY + scrollDelta);
        }});
        
        document.addEventListener('touchend', () => {{
            isDragging = false;
            scrollThumb.style.background = 'rgba(26, 26, 46, 0.8)';
        }});
        
        // Update thumb position on scroll
        window.addEventListener('scroll', updateThumbPosition);
        updateThumbPosition();
    </script>
</body>
</html>'''


def main():
    parser = argparse.ArgumentParser(description='Generate GSD-Lite worklog HTML viewer')
    parser.add_argument('input', type=Path, help='Path to WORK.md')
    parser.add_argument('-o', '--output', type=Path, default=Path('worklog.html'),
                        help='Output HTML file (default: worklog.html)')
    
    args = parser.parse_args()
    
    if not args.input.exists():
        print(f"Error: File not found: {args.input}")
        return 1
    
    html_content = generate_html(args.input)
    args.output.write_text(html_content)
    print(f"Generated: {args.output}")
    return 0


if __name__ == "__main__":
    exit(main())