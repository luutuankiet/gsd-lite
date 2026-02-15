#!/usr/bin/env node

/**
 * GSD-Lite Worklog Reader CLI
 * 
 * A lightweight server for viewing WORK.md files with live reload.
 * Uses chokidar for native file watching and WebSocket for push updates.
 * 
 * Usage:
 *   npx @gsd-lite/reader [path-to-worklog] [--port=3000]
 * 
 * Examples:
 *   npx @gsd-lite/reader                          # Watch ./gsd-lite/WORK.md on :3000
 *   npx @gsd-lite/reader ./my-project/WORK.md     # Custom path
 *   npx @gsd-lite/reader --port=3001              # Custom port
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');
const chokidar = require('chokidar');

// =============================================================================
// Configuration
// =============================================================================

// Parse command line arguments
const args = process.argv.slice(2);

// Find port from --port=XXXX argument
const portArg = args.find(a => a.startsWith('--port='));
const PORT = parseInt(portArg?.split('=')[1] || process.env.PORT || '3000', 10);

// First non-flag argument is the worklog path
const WORKLOG = args.find(a => !a.startsWith('--')) || './gsd-lite/WORK.md';
const WORKLOG_PATH = path.resolve(WORKLOG);

// Static assets directory (bundled with this package)
const DIST = path.join(__dirname, 'dist');

// MIME types for static file serving
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

// =============================================================================
// HTTP Server
// =============================================================================

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // API endpoint: serve WORK.md content
  if (pathname === '/_worklog') {
    try {
      const content = fs.readFileSync(WORKLOG_PATH, 'utf-8');
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.end(content);
    } catch (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`WORK.md not found: ${WORKLOG_PATH}\n\nError: ${err.message}`);
    }
    return;
  }

  // Static file serving from dist/
  let filePath = pathname === '/' ? '/index.html' : pathname;
  const fullPath = path.join(DIST, filePath);

  // Security: prevent directory traversal
  if (!fullPath.startsWith(DIST)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    // SPA fallback: serve index.html for non-file routes
    const indexPath = path.join(DIST, 'index.html');
    if (fs.existsSync(indexPath)) {
      serveFile(indexPath, '.html', res);
      return;
    }
    res.statusCode = 404;
    res.end('Not found');
    return;
  }

  // Serve the file
  const ext = path.extname(fullPath).toLowerCase();
  serveFile(fullPath, ext, res);
});

function serveFile(filePath, ext, res) {
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
  
  try {
    const content = fs.readFileSync(filePath);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.end(content);
  } catch (err) {
    res.statusCode = 500;
    res.end(`Error reading file: ${err.message}`);
  }
}

// =============================================================================
// WebSocket Server (Live Reload)
// =============================================================================

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('[gsd-reader] Client connected');
  
  ws.on('close', () => {
    console.log('[gsd-reader] Client disconnected');
  });
});

function broadcastReload() {
  let clientCount = 0;
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send('reload');
      clientCount++;
    }
  });
  if (clientCount > 0) {
    console.log(`[gsd-reader] Notified ${clientCount} client(s)`);
  }
}

// =============================================================================
// File Watcher (Chokidar)
// =============================================================================

// Check if worklog exists before starting
if (!fs.existsSync(WORKLOG_PATH)) {
  console.error(`\n❌ WORK.md not found: ${WORKLOG_PATH}`);
  console.error('\nUsage: npx @gsd-lite/reader [path-to-worklog] [--port=3000]');
  console.error('\nExamples:');
  console.error('  npx @gsd-lite/reader                        # Watch ./gsd-lite/WORK.md');
  console.error('  npx @gsd-lite/reader ./my-project/WORK.md   # Custom path');
  process.exit(1);
}

// Watch the worklog file
const watcher = chokidar.watch(WORKLOG_PATH, {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 100,
    pollInterval: 50,
  },
});

watcher.on('change', (filepath) => {
  console.log(`[gsd-reader] ${path.basename(filepath)} changed`);
  broadcastReload();
});

watcher.on('error', (error) => {
  console.error('[gsd-reader] Watcher error:', error.message);
});

// =============================================================================
// Startup
// =============================================================================

server.listen(PORT, () => {
  console.log('');
  console.log('┌─────────────────────────────────────────────────────┐');
  console.log('│              📖 GSD-Lite Worklog Reader             │');
  console.log('├─────────────────────────────────────────────────────┤');
  console.log(`│  Server:   http://localhost:${PORT.toString().padEnd(25)}│`);
  console.log(`│  Watching: ${path.basename(WORKLOG_PATH).padEnd(40)}│`);
  console.log('├─────────────────────────────────────────────────────┤');
  console.log('│  Press Ctrl+C to stop                               │');
  console.log('└─────────────────────────────────────────────────────┘');
  console.log('');
  console.log(`[gsd-reader] Full path: ${WORKLOG_PATH}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[gsd-reader] Shutting down...');
  watcher.close();
  wss.close();
  server.close(() => {
    console.log('[gsd-reader] Goodbye!');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  process.emit('SIGINT');
});