/**
 * Diagram Overlay - Pan/Zoom viewer for Mermaid diagrams
 * 
 * Opens a fullscreen overlay when clicking a diagram, with:
 * - Zoom +/- buttons and mouse wheel zoom
 * - Pan via click-and-drag
 * - Touch support for mobile (pinch-to-zoom, drag-to-pan)
 * - Close via button, ESC key, or click outside
 * 
 * Task: READER-002f
 */

// ============================================================
// STATE
// ============================================================

interface OverlayState {
  isOpen: boolean;
  zoom: number;
  panX: number;
  panY: number;
  isDragging: boolean;
  dragStartX: number;
  dragStartY: number;
  lastPanX: number;
  lastPanY: number;
}

const state: OverlayState = {
  isOpen: false,
  zoom: 1,
  panX: 0,
  panY: 0,
  isDragging: false,
  dragStartX: 0,
  dragStartY: 0,
  lastPanX: 0,
  lastPanY: 0,
};

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.25;

// ============================================================
// DOM ELEMENTS
// ============================================================

let overlay: HTMLElement | null = null;
let container: HTMLElement | null = null;
let svgWrapper: HTMLElement | null = null;
let zoomDisplay: HTMLElement | null = null;

function createOverlayDOM(): void {
  if (overlay) return; // Already created

  overlay = document.createElement('div');
  overlay.id = 'diagram-overlay';
  overlay.innerHTML = `
    <style>
      #diagram-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        z-index: 3000;
        display: none;
        flex-direction: column;
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      #diagram-overlay.visible {
        display: flex;
        opacity: 1;
      }
      
      /* Header bar */
      .diagram-overlay-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: rgba(0, 0, 0, 0.5);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      .diagram-overlay-title {
        color: white;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .diagram-overlay-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .diagram-overlay-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.15s ease;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .diagram-overlay-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      .diagram-overlay-btn:active {
        background: rgba(255, 255, 255, 0.3);
      }
      .diagram-overlay-btn.close {
        background: rgba(233, 69, 96, 0.3);
        border-color: rgba(233, 69, 96, 0.5);
      }
      .diagram-overlay-btn.close:hover {
        background: rgba(233, 69, 96, 0.5);
      }
      .zoom-display {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
        min-width: 50px;
        text-align: center;
        font-family: monospace;
      }
      
      /* Container */
      .diagram-overlay-container {
        flex: 1;
        overflow: hidden;
        cursor: grab;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .diagram-overlay-container.dragging {
        cursor: grabbing;
      }
      
      /* SVG Wrapper */
      .diagram-svg-wrapper {
        transform-origin: center center;
        transition: transform 0.1s ease;
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
      }
      .diagram-svg-wrapper svg {
        display: block;
        max-width: none !important;
        max-height: none !important;
      }
      
      /* Help text */
      .diagram-overlay-help {
        position: absolute;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        pointer-events: none;
      }
      
      /* Mobile adjustments */
      @media (max-width: 600px) {
        .diagram-overlay-header {
          padding: 8px 12px;
        }
        .diagram-overlay-btn {
          padding: 6px 10px;
          font-size: 12px;
        }
        .diagram-overlay-help {
          font-size: 10px;
        }
      }
    </style>
    
    <div class="diagram-overlay-header">
      <div class="diagram-overlay-title">
        📊 Diagram Viewer
      </div>
      <div class="diagram-overlay-controls">
        <button class="diagram-overlay-btn" id="diagram-zoom-out" title="Zoom Out">−</button>
        <span class="zoom-display" id="diagram-zoom-display">100%</span>
        <button class="diagram-overlay-btn" id="diagram-zoom-in" title="Zoom In">+</button>
        <button class="diagram-overlay-btn" id="diagram-reset" title="Reset View">⟲</button>
        <button class="diagram-overlay-btn close" id="diagram-close" title="Close (ESC)">✕</button>
      </div>
    </div>
    
    <div class="diagram-overlay-container" id="diagram-container">
      <div class="diagram-svg-wrapper" id="diagram-svg-wrapper"></div>
    </div>
    
    <div class="diagram-overlay-help">
      Scroll to zoom · Drag to pan · ESC to close
    </div>
  `;

  document.body.appendChild(overlay);

  // Cache references
  container = document.getElementById('diagram-container');
  svgWrapper = document.getElementById('diagram-svg-wrapper');
  zoomDisplay = document.getElementById('diagram-zoom-display');

  // Wire up event listeners
  setupEventListeners();
}

// ============================================================
// EVENT HANDLERS
// ============================================================

function setupEventListeners(): void {
  if (!overlay || !container) return;

  // Close button
  document.getElementById('diagram-close')?.addEventListener('click', closeOverlay);

  // Zoom buttons
  document.getElementById('diagram-zoom-in')?.addEventListener('click', () => zoomBy(ZOOM_STEP));
  document.getElementById('diagram-zoom-out')?.addEventListener('click', () => zoomBy(-ZOOM_STEP));
  document.getElementById('diagram-reset')?.addEventListener('click', resetView);

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.isOpen) {
      closeOverlay();
    }
  });

  // Click outside (on backdrop)
  overlay.addEventListener('click', (e) => {
    if (e.target === container) {
      closeOverlay();
    }
  });

  // Mouse wheel zoom
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    zoomBy(delta);
  }, { passive: false });

  // Mouse drag to pan
  container.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', endDrag);

  // Touch support
  let lastTouchDist = 0;
  let lastTouchX = 0;
  let lastTouchY = 0;

  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      // Single touch = pan
      const touch = e.touches[0];
      state.isDragging = true;
      state.dragStartX = touch.clientX;
      state.dragStartY = touch.clientY;
      state.lastPanX = state.panX;
      state.lastPanY = state.panY;
      container?.classList.add('dragging');
    } else if (e.touches.length === 2) {
      // Two touches = pinch zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist = Math.sqrt(dx * dx + dy * dy);
      lastTouchX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      lastTouchY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    }
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && state.isDragging) {
      const touch = e.touches[0];
      const dx = touch.clientX - state.dragStartX;
      const dy = touch.clientY - state.dragStartY;
      state.panX = state.lastPanX + dx;
      state.panY = state.lastPanY + dy;
      updateTransform();
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (lastTouchDist > 0) {
        const scale = dist / lastTouchDist;
        const newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, state.zoom * scale));
        state.zoom = newZoom;
        updateTransform();
      }
      lastTouchDist = dist;
    }
  }, { passive: false });

  container.addEventListener('touchend', () => {
    state.isDragging = false;
    lastTouchDist = 0;
    container?.classList.remove('dragging');
  });
}

function startDrag(e: MouseEvent): void {
  // Only left mouse button
  if (e.button !== 0) return;
  
  state.isDragging = true;
  state.dragStartX = e.clientX;
  state.dragStartY = e.clientY;
  state.lastPanX = state.panX;
  state.lastPanY = state.panY;
  container?.classList.add('dragging');
}

function onDrag(e: MouseEvent): void {
  if (!state.isDragging) return;
  
  const dx = e.clientX - state.dragStartX;
  const dy = e.clientY - state.dragStartY;
  state.panX = state.lastPanX + dx;
  state.panY = state.lastPanY + dy;
  updateTransform();
}

function endDrag(): void {
  state.isDragging = false;
  container?.classList.remove('dragging');
}

// ============================================================
// ZOOM & TRANSFORM
// ============================================================

function zoomBy(delta: number): void {
  const newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, state.zoom + delta));
  state.zoom = newZoom;
  updateTransform();
}

function resetView(): void {
  state.zoom = 1;
  state.panX = 0;
  state.panY = 0;
  updateTransform();
}

function updateTransform(): void {
  if (!svgWrapper || !zoomDisplay) return;
  
  svgWrapper.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
  zoomDisplay.textContent = `${Math.round(state.zoom * 100)}%`;
}

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Open the overlay with the given SVG content
 */
export function openDiagramOverlay(svgContent: string): void {
  createOverlayDOM();
  
  if (!overlay || !svgWrapper) return;

  // Reset state
  state.zoom = 1;
  state.panX = 0;
  state.panY = 0;
  state.isDragging = false;
  
  // Insert SVG
  svgWrapper.innerHTML = svgContent;
  updateTransform();
  
  // Show overlay
  overlay.style.display = 'flex';
  // Trigger reflow for animation
  overlay.offsetHeight;
  overlay.classList.add('visible');
  state.isOpen = true;
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

/**
 * Close the overlay
 */
export function closeOverlay(): void {
  if (!overlay) return;
  
  overlay.classList.remove('visible');
  state.isOpen = false;
  
  // Restore body scroll
  document.body.style.overflow = '';
  
  // Hide after animation
  setTimeout(() => {
    if (overlay) overlay.style.display = 'none';
  }, 200);
}

/**
 * Initialize click handlers on all Mermaid diagrams
 * Call this after Mermaid rendering is complete
 */
export function initDiagramOverlays(): void {
  // Find all rendered mermaid containers
  const containers = document.querySelectorAll('.mermaid-container');
  
  containers.forEach((container) => {
    // Add visual hint that it's clickable
    (container as HTMLElement).style.cursor = 'zoom-in';
    container.setAttribute('title', 'Click to expand');
    
    // Add click handler
    container.addEventListener('click', () => {
      const svg = container.querySelector('svg');
      if (svg) {
        openDiagramOverlay(svg.outerHTML);
      }
    });
  });
}