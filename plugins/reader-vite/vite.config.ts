import { defineConfig } from 'vite';
import { resolve } from 'path';
import { worklogPlugin } from './src/vite-plugin-worklog';

// Default WORK.md path - can be overridden via CLI or env
const WORKLOG_PATH = process.env.WORKLOG_PATH || '../../gsd-lite/WORK.md';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [
    worklogPlugin({
      worklogPath: WORKLOG_PATH,
      endpoint: '/_worklog',
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyDirBeforeWrite: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});