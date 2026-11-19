/**
 * Generates RSS 2.0 feeds from CMS articles (run before `vite build`).
 *
 *   public/rss.xml     Arabic feed (legacy URL, linked from the HTML shell)
 *   public/ar/rss.xml  Arabic feed
 *   public/en/rss.xml  English feed (only when English content URLs are published)
 *
 * Item links MUST use the localized canonical URLs (/ar/article/<slug>,
 * /en/article/<slug>); the old un-prefixed /article/<slug> links returned 404
 * on GitHub Pages.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
export const SITE = 'https://netsecatlas.com';
export const MAX_ITEMS = 50;

function loadJson(rel) {
  try {
    const data = JSON.parse(readFileSync(join(root, rel), 'utf8'));
    return data;
  } catch {
    return null;
  }
}

export function escapeXml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function pickText(field, lang) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field.ar || field.en || '';
}

function toRfc822(date) {
  const parsed = date ? new Date(date) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toUTCString() : new Date(0).toUTCString();
}

const CHANNEL = {
  ar: {
    title: 'NetSec Atlas — معرفة عملية في الشبكات والأمن وتقنية المعلومات',
    description: 'أحدث المقالات العملية في الشبكات والأمن السيبراني والبنية التحتية من NetSec Atlas.',
  },
  en: {
    title: 'NetSec Atlas — Practical Network, Security & IT Knowledge',
    description: 'The latest practical articles on networking, cybersecurity and infrastructure from NetSec Atlas.',
  },
};

export function buildFeed(articles, lang, selfPath) {
  const sorted = articles
    .filter((a) => a?.slug && pickText(a.title, lang))
    .slice()
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    .slice(0, MAX_ITEMS);

  const items = sorted
    .map((a) => {
      const link = `${SITE}/${lang}/article/${encodeURIComponent(a.slug)}`;
      const tags = Array.isArray(a.tags) ? a.tags : [];
      const categories = tags.map((t) => `      <category>${escapeXml(t)}</category>`).join('\n');
      return `    <item>
      <title>${escapeXml(pickText(a.title, lang))}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${toRfc822(a.date)}</pubDate>
      <description>${escapeXml(pickText(a.excerpt, lang))}</description>${categories ? `\n${categories}` : ''}
    </item>`;
    })
    .join('\n');

  const lastBuild = sorted[0]?.date ? toRfc822(sorted[0].date) : new Date(0).toUTCString();
  return {
    count: sorted.length,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(CHANNEL[lang].title)}</title>
    <link>${SITE}/${lang}/</link>
    <description>${escapeXml(CHANNEL[lang].description)}</description>
    <language>${lang}</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE}${selfPath}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`,
  };
}

function main() {
  const raw = loadJson('src/content/articles.json');
  const articles = Array.isArray(raw) ? raw : [];
  const policy = loadJson('src/config/hreflang-policy.json') || {};
  const publishEnglish = policy.publishUnreviewedTranslations === true;
  const englishArticles = articles.filter(
    (a) => a?.translationStatus === 'reviewed' || (publishEnglish && a?.translationStatus !== 'invalid'),
  );

  const outDir = join(root, 'public');
  mkdirSync(join(outDir, 'ar'), { recursive: true });
  mkdirSync(join(outDir, 'en'), { recursive: true });

  const legacy = buildFeed(articles, 'ar', '/rss.xml');
  writeFileSync(join(outDir, 'rss.xml'), legacy.xml, 'utf8');
  const ar = buildFeed(articles, 'ar', '/ar/rss.xml');
  writeFileSync(join(outDir, 'ar', 'rss.xml'), ar.xml, 'utf8');
  const en = buildFeed(englishArticles, 'en', '/en/rss.xml');
  writeFileSync(join(outDir, 'en', 'rss.xml'), en.xml, 'utf8');
  console.log(`[rss] wrote ${legacy.count} ar items → public/rss.xml, public/ar/rss.xml; ${en.count} en items → public/en/rss.xml`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
