/**
 * Builds src/entry-server.tsx to dist/ssr/entry-server.js so seo-prerender
 * can renderToPipeableStream the real <App /> tree for every route.
 * Must run after the client Vite build? Independent, but must not wipe
 * dist/public — outDir is dist/ssr only.
 */
import { build } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

await build({
  configFile: path.join(root, 'vite.config.ts'),
  build: {
    ssr: path.join(root, 'src/entry-server.tsx'),
    outDir: path.join(root, 'dist/ssr'),
    emptyOutDir: true,
    minify: false,
    sourcemap: false,
    copyPublicDir: false,
    rollupOptions: {
      output: {
        format: 'esm',
        entryFileNames: 'entry-server.js',
      },
    },
  },
  ssr: {
    // Bundle the app, keep Node built-ins and react's server renderer external
    // enough that the prerender script can import the file in Node.
    noExternal: true,
  },
  logLevel: 'info',
});

console.log('[build-ssr] wrote dist/ssr/entry-server.js');
