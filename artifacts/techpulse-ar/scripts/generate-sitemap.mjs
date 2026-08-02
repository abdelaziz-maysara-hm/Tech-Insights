/**
 * Generates public/sitemap.xml from CMS JSON + static routes.
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

const today = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/articles', priority: '0.95', changefreq: 'daily' },
  { path: '/comparisons', priority: '0.9', changefreq: 'daily' },
  { path: '/videos', priority: '0.85', changefreq: 'weekly' },
  { path: '/categories', priority: '0.85', changefreq: 'weekly' },
  { path: '/search', priority: '0.4', changefreq: 'monthly' },
  { path: '/page/about', priority: '0.5', changefreq: 'monthly' },
  { path: '/page/privacy', priority: '0.4', changefreq: 'yearly' },
];

const categories = [
  'cybersecurity', 'mobile', 'laptops', 'howto', 'ai', 'reviews', 'windows', 'comparisons', 'technology',
];

const articles = loadJson('src/content/articles.json');
const pages = loadJson('src/content/pages.json');
const videos = loadJson('src/content/videos.json');
const comparisons = loadJson('src/content/comparisons.json');

const urls = [...staticRoutes];

for (const c of categories) {
  urls.push({
    path: `/articles?c=${c}`,
    priority: '0.75',
    changefreq: 'weekly',
    lastmod: today,
  });
}

for (const a of articles) {
  if (a?.slug) {
    urls.push({
      path: `/article/${a.slug}`,
      priority: a.isFeatured ? '0.9' : '0.8',
      changefreq: 'weekly',
      lastmod: typeof a.date === 'string' ? a.date.slice(0, 10) : today,
    });
  }
}

for (const c of comparisons) {
  if (c?.slug) {
    urls.push({
      path: `/comparison/${c.slug}`,
      priority: '0.85',
      changefreq: 'weekly',
      lastmod: typeof c.date === 'string' ? c.date.slice(0, 10) : today,
    });
  }
}

for (const p of pages) {
  if (p?.slug) {
    urls.push({
      path: `/page/${p.slug}`,
      priority: '0.55',
      changefreq: 'monthly',
      lastmod: typeof p.updatedAt === 'string' ? p.updatedAt.slice(0, 10) : today,
    });
  }
}

if (videos.length) {
  urls.push({ path: '/videos', priority: '0.85', changefreq: 'weekly', lastmod: today });
}

const seen = new Set();
const unique = [];
for (const u of urls) {
  if (seen.has(u.path)) continue;
  seen.add(u.path);
  unique.push(u);
}

const body = unique
  .map((u) => {
    const lastmod = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : '';
    return `  <url>\n    <loc>${SITE}${u.path}</loc>${lastmod}\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

const outDir = join(root, 'public');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'sitemap.xml'), xml, 'utf8');
console.log(`[sitemap] wrote ${unique.length} URLs → public/sitemap.xml`);
