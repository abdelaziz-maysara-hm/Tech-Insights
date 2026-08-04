import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Standalone production server for hosting the fully-static built site on
// platforms that run a persistent Node process (e.g. Render), as opposed to
// Vercel's serverless Functions or the Vite dev middleware used on Replit.
//
// Serves the built static site (dist/public) with an SPA fallback to
// index.html so client-side routing (e.g. /page/:slug) works on a hard
// refresh. No admin/CMS API -- content is committed as static JSON and
// deployed through the normal build, not edited live.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../dist/public');
const PORT = Number(process.env.PORT) || 10000;

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

async function serveStatic(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  const url = new URL(req.url || '/', 'http://localhost');
  let filePath = path.join(PUBLIC_DIR, decodeURIComponent(url.pathname));

  // Prevent path traversal outside the public dir.
  if (!filePath.startsWith(PUBLIC_DIR)) {
    filePath = PUBLIC_DIR;
  }

  try {
    let stats = await stat(filePath);
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      stats = await stat(filePath);
    }
    const ext = path.extname(filePath);
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
    createReadStream(filePath).pipe(res);
  } catch {
    // SPA fallback for client-side routes (e.g. /page/some-slug).
    try {
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      await stat(indexPath);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      createReadStream(indexPath).pipe(res);
    } catch {
      res.statusCode = 404;
      res.end('Not found');
    }
  }
}

const server = http.createServer((req, res) => {
  void serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`TechPulse render server listening on port ${PORT}`);
});
