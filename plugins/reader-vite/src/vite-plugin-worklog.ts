/**
 * Vite Plugin: GSD-Lite Worklog Watcher
 * 
 * This plugin enables hot reload for external WORK.md files:
 * 1. Watches the WORK.md file using chokidar (Vite's built-in watcher)
 * 2. Serves the file content via a custom middleware endpoint
 * 3. Sends HMR events to the browser when the file changes
 * 
 * Usage in vite.config.ts:
 *   import { worklogPlugin } from './src/vite-plugin-worklog';
 *   export default defineConfig({
 *     plugins: [worklogPlugin({ worklogPath: '../../gsd-lite/WORK.md' })],
 *   });
 */

import type { Plugin, ViteDevServer } from 'vite';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';

export interface WorklogPluginOptions {
  /** Path to WORK.md file (relative to project root or absolute) */
  worklogPath?: string;
  /** Endpoint to serve WORK.md content (default: /_worklog) */
  endpoint?: string;
}

const DEFAULT_OPTIONS: Required<WorklogPluginOptions> = {
  worklogPath: '../../gsd-lite/WORK.md',
  endpoint: '/_worklog',
};

export function worklogPlugin(options: WorklogPluginOptions = {}): Plugin {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let resolvedPath: string;
  let server: ViteDevServer | null = null;

  return {
    name: 'vite-plugin-worklog',

    configResolved(config) {
      // Resolve the worklog path relative to project root
      resolvedPath = resolve(config.root, opts.worklogPath);
      console.log(`[worklog-plugin] Watching: ${resolvedPath}`);
    },

    configureServer(devServer) {
      server = devServer;

      // Middleware to serve WORK.md content
      devServer.middlewares.use((req, res, next) => {
        if (req.url === opts.endpoint) {
          try {
            if (!existsSync(resolvedPath)) {
              res.statusCode = 404;
              res.end(`WORK.md not found at: ${resolvedPath}`);
              return;
            }

            const content = readFileSync(resolvedPath, 'utf-8');
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache');
            res.end(content);
          } catch (err) {
            res.statusCode = 500;
            res.end(`Error reading WORK.md: ${err}`);
          }
          return;
        }
        next();
      });

      // Watch the WORK.md file for changes
      const watcher = devServer.watcher;
      
      // Add the WORK.md file and its directory to the watcher
      watcher.add(resolvedPath);
      watcher.add(dirname(resolvedPath));

      // Handle file changes
      watcher.on('change', (changedPath) => {
        if (changedPath === resolvedPath) {
          console.log(`[worklog-plugin] WORK.md changed, sending HMR update...`);
          
          // Send custom HMR event to all connected clients
          devServer.ws.send({
            type: 'custom',
            event: 'worklog-update',
            data: { timestamp: Date.now() },
          });
        }
      });

      // Also handle add event (in case file is recreated)
      watcher.on('add', (addedPath) => {
        if (addedPath === resolvedPath) {
          console.log(`[worklog-plugin] WORK.md created, sending HMR update...`);
          devServer.ws.send({
            type: 'custom',
            event: 'worklog-update',
            data: { timestamp: Date.now() },
          });
        }
      });
    },
  };
}

export default worklogPlugin;