/**
 * Vite Plugin: GSD-Lite Artifact Watcher
 *
 * Watches WORK.md and sibling PROJECT.md / ARCHITECTURE.md, serves them over
 * middleware endpoints, and triggers HMR when any of them changes.
 */

import type { Plugin, ViteDevServer } from 'vite';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import type { ServerResponse } from 'http';

export interface WorklogPluginOptions {
  /** Path to WORK.md file (relative to project root or absolute) */
  worklogPath?: string;
  /** Optional override for PROJECT.md path */
  projectPath?: string;
  /** Optional override for ARCHITECTURE.md path */
  architecturePath?: string;
  /** Endpoint to serve WORK.md content (default: /_worklog) */
  endpoint?: string;
  /** Endpoint to serve PROJECT.md content (default: /_project) */
  projectEndpoint?: string;
  /** Endpoint to serve ARCHITECTURE.md content (default: /_architecture) */
  architectureEndpoint?: string;
}

const DEFAULT_OPTIONS: Required<WorklogPluginOptions> = {
  worklogPath: '../../gsd-lite/WORK.md',
  projectPath: '',
  architecturePath: '',
  endpoint: '/_worklog',
  projectEndpoint: '/_project',
  architectureEndpoint: '/_architecture',
};

function serveFileOr404(res: ServerResponse, filePath: string, label: string): void {
  try {
    if (!existsSync(filePath)) {
      res.statusCode = 404;
      res.end(`${label} not found at: ${filePath}`);
      return;
    }

    const content = readFileSync(filePath, 'utf-8');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.end(content);
  } catch (err) {
    res.statusCode = 500;
    res.end(`Error reading ${label}: ${err}`);
  }
}

export function worklogPlugin(options: WorklogPluginOptions = {}): Plugin {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let resolvedWorklogPath: string;
  let resolvedProjectPath: string;
  let resolvedArchitecturePath: string;
  let server: ViteDevServer | null = null;

  return {
    name: 'vite-plugin-worklog',

    configResolved(config) {
      resolvedWorklogPath = resolve(config.root, opts.worklogPath);
      const worklogDir = dirname(resolvedWorklogPath);
      resolvedProjectPath = opts.projectPath
        ? resolve(config.root, opts.projectPath)
        : join(worklogDir, 'PROJECT.md');
      resolvedArchitecturePath = opts.architecturePath
        ? resolve(config.root, opts.architecturePath)
        : join(worklogDir, 'ARCHITECTURE.md');

      console.log(`[worklog-plugin] Watching: ${resolvedWorklogPath}`);
      console.log(`[worklog-plugin] Watching: ${resolvedProjectPath}`);
      console.log(`[worklog-plugin] Watching: ${resolvedArchitecturePath}`);
    },

    configureServer(devServer) {
      server = devServer;

      devServer.middlewares.use((req, res, next) => {
        if (req.url === opts.endpoint) {
          serveFileOr404(res, resolvedWorklogPath, 'WORK.md');
          return;
        }

        if (req.url === opts.projectEndpoint) {
          serveFileOr404(res, resolvedProjectPath, 'PROJECT.md');
          return;
        }

        if (req.url === opts.architectureEndpoint) {
          serveFileOr404(res, resolvedArchitecturePath, 'ARCHITECTURE.md');
          return;
        }

        next();
      });

      const watcher = devServer.watcher;
      const watchedFiles = new Set<string>([
        resolvedWorklogPath,
        resolvedProjectPath,
        resolvedArchitecturePath,
      ]);

      watcher.add(Array.from(watchedFiles));
      watcher.add(dirname(resolvedWorklogPath));

      const pushUpdate = (changedPath: string, action: 'changed' | 'created') => {
        if (!watchedFiles.has(changedPath)) return;
        const fileName = changedPath.split('/').pop() || changedPath;
        console.log(`[worklog-plugin] ${fileName} ${action}, sending HMR update...`);

        server?.ws.send({
          type: 'custom',
          event: 'worklog-update',
          data: { timestamp: Date.now(), path: changedPath },
        });
      };

      watcher.on('change', (changedPath) => pushUpdate(changedPath, 'changed'));
      watcher.on('add', (addedPath) => pushUpdate(addedPath, 'created'));
    },
  };
}

export default worklogPlugin;