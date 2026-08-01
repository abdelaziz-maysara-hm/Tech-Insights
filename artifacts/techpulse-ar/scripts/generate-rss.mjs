/**
 * Generates public/rss.xml from CMS articles.
 * Run during `vite build` (see package.json).
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

function escapeXml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function pickText(field) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field.ar || field.en || '';
}

const articles = loadJson('src/content/articles.json')
  .filter((a) => a?.slug)
  .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
  .slice(0, 50);

const items = articles
  .map((a) => {
    const title = escapeXml(pickText(a.title));
    const desc = escapeXml(pickText(a.excerpt));
    const link = `${SITE}/article/${a.slug}`;
    const pub = a.date ? new Date(a.date).toUTCString() : new Date().toUTCString();
    return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pub}</pubDate>
      <description>${desc}</description>
    </item>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Technical Insights — رؤى تقنية</title>
    <link>${SITE}</link>
    <description>دليلك الأول في عالم التقنية: مراجعات، أخبار، مقارنات، وشروحات.</description>
    <language>ar</language>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

const outDir = join(root, 'public');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'rss.xml'), xml, 'utf8');
console.log(`[rss] wrote ${articles.length} items → public/rss.xml`);
