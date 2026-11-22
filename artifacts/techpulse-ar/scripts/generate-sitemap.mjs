/** Generates canonical localized sitemap entries from source content and hreflang policy. */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://netsecatlas.com';
const today = new Date().toISOString().slice(0, 10);
const policy = JSON.parse(readFileSync(join(root, 'src/config/hreflang-policy.json'), 'utf8'));
const eligibleDiscoveryRoutes = new Set(policy.eligibleDiscoveryRoutes);
const reviewedContentRoutes = new Set(policy.reviewedContentRoutes);
const publishUnreviewedTranslations = policy.publishUnreviewedTranslations === true;

function loadJson(relativePath) {
  try {
    const value = JSON.parse(readFileSync(join(root, relativePath), 'utf8'));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

const baseRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/articles', priority: '0.95', changefreq: 'daily' },
  { path: '/comparisons', priority: '0.9', changefreq: 'daily' },
  { path: '/troubleshooting', priority: '0.9', changefreq: 'daily' },
  { path: '/guides', priority: '0.9', changefreq: 'weekly' },
  { path: '/tools', priority: '0.85', changefreq: 'weekly' },
  { path: '/alternatives', priority: '0.85', changefreq: 'weekly' },
  { path: '/vendors', priority: '0.85', changefreq: 'weekly' },
  { path: '/domain/cybersecurity', priority: '0.85', changefreq: 'weekly' },
  { path: '/domain/networking', priority: '0.85', changefreq: 'weekly' },
  { path: '/domain/infrastructure', priority: '0.85', changefreq: 'weekly' },
  { path: '/videos', priority: '0.85', changefreq: 'weekly' },
  { path: '/categories', priority: '0.85', changefreq: 'weekly' },
  { path: '/search', priority: '0.4', changefreq: 'monthly' },
];

const articles = loadJson('src/content/articles.json');
const comparisons = loadJson('src/content/comparisons.json');
const pages = loadJson('src/content/pages.json');
const webTools = loadJson('src/content/web-tools.json');
const alternatives = loadJson('src/content/alternatives.json');
const videos = loadJson('src/content/videos.json');
const playlists = loadJson('src/content/video-playlists.json');
const vendorRoutes = policy.eligibleDiscoveryRoutes
  .filter((path) => path.startsWith('/vendors/'))
  .map((path) => ({ path, priority: '0.8', changefreq: 'weekly' }));

const routes = [
  ...baseRoutes,
  ...vendorRoutes,
  ...webTools.filter((item) => item?.slug).map((item) => ({
    path: `/tools/${item.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: typeof item.updated === 'string' ? item.updated.slice(0, 10) : today,
  })),
  ...alternatives.filter((item) => item?.slug).map((item) => ({
    path: `/alternatives/${item.slug}`,
    bilingual: true,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: typeof item.date === 'string' ? item.date.slice(0, 10) : today,
  })),
  ...articles.filter((item) => item?.slug).map((item) => ({
    path: `/article/${item.slug}`,
    translatable: true,
    priority: item.isFeatured ? '0.9' : '0.8',
    changefreq: 'weekly',
    lastmod: typeof item.date === 'string' ? item.date.slice(0, 10) : today,
    translationStatus: item.translationStatus,
  })),
  ...comparisons.filter((item) => item?.slug).map((item) => ({
    path: `/comparison/${item.slug}`,
    translatable: true,
    priority: '0.85',
    changefreq: 'weekly',
    lastmod: typeof item.date === 'string' ? item.date.slice(0, 10) : today,
    translationStatus: item.translationStatus,
  })),
  ...playlists.filter((item) => item?.slug).map((item) => ({
    path: `/videos/${item.slug}`,
    bilingual: true,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: typeof item.updatedAt === 'string' ? item.updatedAt.slice(0, 10) : today,
  })),
  ...videos.filter((item) => item?.slug).map((item) => ({
    path: `/video/${item.slug}`,
    bilingual: true,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: typeof item.date === 'string' ? item.date.slice(0, 10) : today,
  })),
  ...pages.filter((item) => item?.slug).map((item) => ({
    path: `/page/${item.slug}`,
    translatable: true,
    priority: '0.55',
    changefreq: 'monthly',
    lastmod: typeof item.updatedAt === 'string' ? item.updatedAt.slice(0, 10) : today,
    translationStatus: item.translationStatus,
  })),
];

const uniqueRoutes = [...new Map(routes.map((route) => [route.path, route])).values()];
const entries = [];
for (const route of uniqueRoutes) {
  const eligible = route.bilingual === true
    || eligibleDiscoveryRoutes.has(route.path)
    || route.translationStatus === 'reviewed'
    || reviewedContentRoutes.has(route.path)
    || (publishUnreviewedTranslations
      && route.translatable === true
      && route.translationStatus !== 'invalid');
  const languages = eligible ? ['ar', 'en'] : ['ar'];
  for (const language of languages) entries.push({ ...route, language, eligible });
}

function localizedUrl(path, language) {
  return `${SITE}/${language}${path === '/' ? '/' : path}`;
}

function alternateXml(path) {
  const ar = localizedUrl(path, 'ar');
  const en = localizedUrl(path, 'en');
  return [
    ['ar', ar],
    ['en', en],
    ['x-default', ar],
  ].map(([language, href]) => `\n    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(href)}" />`).join('');
}

const body = entries.map((entry) => {
  const loc = localizedUrl(entry.path, entry.language);
  const alternates = entry.eligible ? alternateXml(entry.path) : '';
  const lastmod = entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : '';
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>${alternates}${lastmod}\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`;
const outputDirectory = join(root, 'public');
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(join(outputDirectory, 'sitemap.xml'), xml, 'utf8');

const arCount = entries.filter((entry) => entry.language === 'ar').length;
const enCount = entries.filter((entry) => entry.language === 'en').length;
console.log(`[sitemap] wrote ${entries.length} canonical URLs (${arCount} ar, ${enCount} en) → public/sitemap.xml`);

// ---------------------------------------------------------------------------
// Video sitemap (Google video extension). One <url> per localized video page.
// Only fields we actually know are emitted (no invented upload dates).
// ---------------------------------------------------------------------------
function isoSeconds(text) {
  if (!text) return null;
  const parts = String(text).split(':').map(Number);
  while (parts.length < 3) parts.unshift(0);
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

const videoBody = videos
  .filter((v) => v?.slug && /^[\w-]{11}$/.test(v.youtubeId || ''))
  .flatMap((v) => ['ar', 'en'].map((language) => {
    const loc = localizedUrl(`/video/${v.slug}`, language);
    const seconds = isoSeconds(v.durationText);
    const title = (v.title && v.title[language]) || v.originalTitle;
    const description = (v.description && v.description[language]) || title;
    return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`)}</video:thumbnail_loc>
      <video:title>${escapeXml(title)}</video:title>
      <video:description>${escapeXml(description.slice(0, 2048))}</video:description>
      <video:player_loc>${escapeXml(`https://www.youtube-nocookie.com/embed/${v.youtubeId}`)}</video:player_loc>${seconds ? `
      <video:duration>${seconds}</video:duration>` : ''}
      <video:family_friendly>yes</video:family_friendly>
      <video:uploader info="${escapeXml(v.channel?.url || '')}">${escapeXml(v.channel?.name || '')}</video:uploader>
    </video:video>
  </url>`;
  }))
  .join('\n');

const videoXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n${videoBody}\n</urlset>\n`;
writeFileSync(join(outputDirectory, 'video-sitemap.xml'), videoXml, 'utf8');
console.log(`[sitemap] wrote ${videos.length * 2} video entries → public/video-sitemap.xml`);
