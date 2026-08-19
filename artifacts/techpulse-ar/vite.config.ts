import path from 'path';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// PORT/BASE_PATH may be injected by the host; fall back to sane defaults.
const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 5173;

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || '/';

/**
 * Dev-only middleware that serves the admin CMS API at /cms/api/* from
 * inside the Vite dev server. In production the same paths are served by
 * the Netlify/Vercel function - this plugin does nothing there.
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
    cmsDevApiPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('\\react\\') || id.includes('scheduler')) {
            return 'react-vendor';
          }
          if (id.includes('wouter')) return 'router';
          if (id.includes('lucide-react')) return 'icons';
          // Keep other node_modules together to avoid over-fragmentation
          return 'vendor';
        },
      },
    },
    chunkSizeWarningLimit: 600,
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
