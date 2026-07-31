/**
 * Generates public/sitemap.xml from CMS JSON + static routes.
 * Run before / during `vite build` (see package.json).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const SITE = 'https://technical-insights.com';

function loadJson(rel) {
  try {
    const raw = readFileSync(join(root, rel), 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/articles', priority: '0.9', changefreq: 'daily' },
  { path: '/comparisons', priority: '0.8', changefreq: 'weekly' },
  { path: '/videos', priority: '0.8', changefreq: 'weekly' },
  { path: '/categories', priority: '0.7', changefreq: 'weekly' },
  { path: '/search', priority: '0.5', changefreq: 'monthly' },
];

const articles = loadJson('src/content/articles.json');
const pages = loadJson('src/content/pages.json');

const urls = [...staticRoutes];

for (const a of articles) {
  if (a?.slug) {
    urls.push({
      path: `/article/${a.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: typeof a.date === 'string' ? a.date.slice(0, 10) : undefined,
    });
  }
}

for (const p of pages) {
  if (p?.slug) {
    urls.push({
      path: `/page/${p.slug}`,
      priority: '0.6',
      changefreq: 'monthly',
      lastmod: typeof p.updatedAt === 'string' ? p.updatedAt.slice(0, 10) : undefined,
    });
  }
}

const body = urls
  .map((u) => {
    const lastmod = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : '';
    return `  <url>
    <loc>${SITE}${u.path}</loc>${lastmod}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

const outDir = join(root, 'public');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'sitemap.xml'), xml, 'utf8');
console.log(`[sitemap] wrote ${urls.length} URLs → public/sitemap.xml`);
