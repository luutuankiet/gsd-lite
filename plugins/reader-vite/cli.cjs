#!/usr/bin/env node

/**
 * GSD-Lite Worklog Reader CLI
 * 
 * Commands:
 *   serve [path] [--port=3000]    Start live-reload server (default)
 *   dump [path] --remote=URL      Build and upload to remote server
 * 
 * Examples:
 *   npx @luutuankiet/gsd-reader                              # Serve ./gsd-lite/WORK.md on :3000
 *   npx @luutuankiet/gsd-reader serve ./project/WORK.md      # Serve custom path
 *   npx @luutuankiet/gsd-reader dump --remote=https://gsd.kenluu.org --user=ken
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');
const chokidar = require('chokidar');
const { execSync } = require('child_process');
const zlib = require('zlib');
const tar = require('tar');
const readline = require('readline');

// Get version from package.json
const pkg = require('./package.json');
console.log(`[GSD-Lite Reader] v${pkg.version}`);

// =============================================================================
// Argument Parsing
// =============================================================================

const args = process.argv.slice(2);
const command = args[0] && !args[0].startsWith('--') && !args[0].includes('/') && !args[0].endsWith('.md') 
  ? args[0] 
  : 'serve';

// Extract flags
function getFlag(name) {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg?.split('=')[1];
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

// Find non-flag arguments (excluding command)
const positionalArgs = args.filter(a => !a.startsWith('--') && a !== command);

// =============================================================================
// Command: dump
// =============================================================================

async function commandDump() {
  const worklogPath = positionalArgs[0] || './gsd-lite/WORK.md';
  const remote = getFlag('remote');
  const user = getFlag('user');
  
  if (!remote) {
    console.error('❌ --remote=URL is required');
    console.error('\nUsage: npx @luutuankiet/gsd-reader dump [path] --remote=URL --user=USER');
    console.error('\nExample:');
    console.error('  npx @luutuankiet/gsd-reader dump --remote=https://gsd.kenluu.org --user=ken');
    process.exit(1);
  }

  // Resolve paths
  const resolvedWorklog = path.resolve(worklogPath);
  const projectDir = path.dirname(resolvedWorklog);
  
  // Derive project name from path (last 2 segments)
  const pathParts = projectDir.split(path.sep).filter(Boolean);
  const projectName = pathParts.slice(-2).join('/');
  
  console.log('');
  console.log('┌─────────────────────────────────────────────────────┐');
  console.log('│              📤 GSD-Lite Worklog Dump               │');
  console.log('├─────────────────────────────────────────────────────┤');
  console.log(`│  Worklog:  ${path.basename(resolvedWorklog).padEnd(40)}│`);
  console.log(`│  Project:  ${projectName.padEnd(40)}│`);
  console.log(`│  Remote:   ${remote.padEnd(40)}│`);
  console.log('└─────────────────────────────────────────────────────┘');
  console.log('');

  // Check if worklog exists
  if (!fs.existsSync(resolvedWorklog)) {
    console.error(`❌ WORK.md not found: ${resolvedWorklog}`);
    process.exit(1);
  }

  // Step 1: Build the static site
  console.log('[dump] Building static site...');
  const distDir = path.join(__dirname, 'dist');
  
  // Copy dist to temp directory and inject worklog content
  const tempDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'gsd-dump-'));
  const tempDist = path.join(tempDir, 'dist');
  
  // Copy dist directory
  fs.cpSync(distDir, tempDist, { recursive: true });
  
  // Read worklog and inject into HTML
  const worklogContent = fs.readFileSync(resolvedWorklog, 'utf-8');
  const indexPath = path.join(tempDist, 'index.html');
  let indexHtml = fs.readFileSync(indexPath, 'utf-8');
  
  // Fix asset paths: Vite builds with absolute paths (/assets/...) but we need
  // relative paths (./assets/...) when served from subdirectories
  indexHtml = indexHtml.replace(/href="\//g, 'href="./');
  indexHtml = indexHtml.replace(/src="\//g, 'src="./');
  
  // Inject worklog content as a script tag (the app will read this instead of fetching)
  // Use Base64 encoding to avoid any escaping issues with special characters,
  // </script> sequences, or line breaks in the markdown content
  const base64Content = Buffer.from(worklogContent, 'utf-8').toString('base64');
  const injectScript = `<script>window.__WORKLOG_CONTENT_B64__ = "${base64Content}";</script>`;
  indexHtml = indexHtml.replace('</head>', `${injectScript}\n</head>`);
  fs.writeFileSync(indexPath, indexHtml);
  
  console.log(`[dump] Static site prepared in ${tempDist}`);

  // Step 2: Create tar.gz
  console.log('[dump] Creating archive...');
  const tarPath = path.join(tempDir, 'dist.tar.gz');
  
  await tar.create(
    {
      gzip: true,
      file: tarPath,
      cwd: tempDist,
    },
    fs.readdirSync(tempDist)
  );
  
  const tarStats = fs.statSync(tarPath);
  console.log(`[dump] Archive created: ${(tarStats.size / 1024).toFixed(1)} KB`);

  // Step 3: Get password
  let password = getFlag('pass');
  if (!password && user) {
    password = await promptPassword(`Password for ${user}: `);
  }

  // Step 4: Upload to remote
  console.log(`[dump] Uploading to ${remote}/upload/${projectName}...`);
  
  const tarData = fs.readFileSync(tarPath);
  const uploadUrl = new URL(`/upload/${projectName}`, remote);
  
  const uploadOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/gzip',
      'Content-Length': tarData.length,
    },
  };
  
  // Add basic auth if credentials provided
  if (user && password) {
    const auth = Buffer.from(`${user}:${password}`).toString('base64');
    uploadOptions.headers['Authorization'] = `Basic ${auth}`;
  }

  try {
    const response = await httpRequest(uploadUrl, uploadOptions, tarData);
    console.log(`[dump] ✅ Upload complete: ${response}`);
    console.log(`[dump] View at: ${remote}/${projectName}/`);
  } catch (err) {
    console.error(`[dump] ❌ Upload failed: ${err.message}`);
    process.exit(1);
  } finally {
    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function promptPassword(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    // Hide input (works on most terminals)
    process.stdout.write(prompt);
    
    // For password masking, we need to handle raw mode
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    
    let password = '';
    
    process.stdin.on('data', (char) => {
      char = char.toString();
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004': // Ctrl+D
          if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
          }
          process.stdout.write('\n');
          rl.close();
          resolve(password);
          break;
        case '\u0003': // Ctrl+C
          process.exit(1);
          break;
        case '\u007F': // Backspace
          password = password.slice(0, -1);
          break;
        default:
          password += char;
          break;
      }
    });
  });
}

function httpRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const protocol = url.protocol === 'https:' ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body.trim() || `HTTP ${res.statusCode}`);
        } else if (res.statusCode === 401) {
          reject(new Error('Authentication failed (401). Check username/password.'));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// =============================================================================
// Command: serve (default)
// =============================================================================

function commandServe() {
  // Parse serve-specific arguments
  const portArg = getFlag('port');
  const PORT = parseInt(portArg || process.env.PORT || '3000', 10);
  const WORKLOG = positionalArgs[0] || './gsd-lite/WORK.md';
  const WORKLOG_PATH = path.resolve(WORKLOG);

  // Static assets directory (bundled with this package)
  const DIST = path.join(__dirname, 'dist');

  // MIME types for static file serving
  const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
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

  // HTTP Server
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
        serveFile(indexPath, '.html', res, MIME_TYPES);
        return;
      }
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    // Serve the file
    const ext = path.extname(fullPath).toLowerCase();
    serveFile(fullPath, ext, res, MIME_TYPES);
  });

  function serveFile(filePath, ext, res, mimeTypes) {
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    
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

  // WebSocket Server (Live Reload)
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

  // Check if worklog exists before starting
  if (!fs.existsSync(WORKLOG_PATH)) {
    console.error(`\n❌ WORK.md not found: ${WORKLOG_PATH}`);
    console.error('\nUsage: npx @luutuankiet/gsd-reader [serve] [path] [--port=3000]');
    console.error('\nExamples:');
    console.error('  npx @luutuankiet/gsd-reader                        # Watch ./gsd-lite/WORK.md');
    console.error('  npx @luutuankiet/gsd-reader ./my-project/WORK.md   # Custom path');
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

  // Startup
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
}

// =============================================================================
// Main
// =============================================================================

if (command === 'dump') {
  commandDump().catch((err) => {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  });
} else if (command === 'serve' || command === 'help' || command === '--help' || command === '-h') {
  if (command === 'help' || command === '--help' || command === '-h') {
    console.log(`
📖 GSD-Lite Worklog Reader

Commands:
  serve [path] [--port=3000]    Start live-reload server (default)
  dump [path] --remote=URL      Build and upload to remote server

Examples:
  npx @luutuankiet/gsd-reader                              # Serve ./gsd-lite/WORK.md
  npx @luutuankiet/gsd-reader serve ./project/WORK.md      # Serve custom path
  npx @luutuankiet/gsd-reader dump --remote=https://gsd.kenluu.org --user=ken
`);
    process.exit(0);
  }
  commandServe();
} else {
  // Assume it's a path, not a command
  commandServe();
}