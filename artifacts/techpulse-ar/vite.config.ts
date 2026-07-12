import path from 'path';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

// On Replit, PORT/BASE_PATH are always injected by the workflow. When building
// standalone (e.g. a Netlify build, which only runs `vite build` and has no
// notion of the Replit proxy), fall back to sane defaults instead of failing.
const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 5173;

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || '/';

/**
 * Dev-only middleware that serves the admin CMS API at /cms/api/* from
 * inside the Vite dev server, so the admin panel works in the Replit
 * preview too. In production (Netlify) the same paths are served by the
 * Netlify Function at netlify/functions/cms-api.ts - this plugin does
 * nothing there.
 */
function cmsDevApiPlugin(): Plugin {
  return {
    name: 'techpulse-cms-dev-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/cms/api')) return next();

        const chunks: Buffer[] = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => {
          void (async () => {
            try {
              const { handleCmsRequest } = await server.ssrLoadModule('/server/admin/router.ts');
              const { parseCookies } = await server.ssrLoadModule('/server/admin/cookies.ts');

              const url = new URL(req.url as string, 'http://localhost');
              const cmsPath = url.pathname.replace(/^\/cms\/api/, '') || '/';
              const raw = Buffer.concat(chunks).toString('utf8');
              let body: unknown;
              if (raw) {
                try {
                  body = JSON.parse(raw);
                } catch {
                  body = undefined;
                }
              }

              const result = await handleCmsRequest({
                method: req.method || 'GET',
                path: cmsPath,
                body,
                cookies: parseCookies(req.headers.cookie),
              });

              res.statusCode = result.status;
              res.setHeader('Content-Type', 'application/json');
              if (result.headers) {
                for (const [key, value] of Object.entries(result.headers)) {
                  res.setHeader(key, value);
                }
              }
              res.end(JSON.stringify(result.body));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'internal_error', message: String(err) }));
            }
          })();
        });
      });
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    cmsDevApiPlugin(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
