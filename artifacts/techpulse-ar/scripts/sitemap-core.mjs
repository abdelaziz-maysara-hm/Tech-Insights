/**
 * Shared sitemap construction: indexable routes from actual content, App
 * routes, taxonomy and hreflang policy. lastmod comes from each item's
 * updated/date field or the git commit that last changed that item — never
 * from the build clock.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SITE = 'https://netsecatlas.com';
export const INDEXNOW_KEY = '13a10f8dd925f0cae8bb47017b2b8ba2';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Query-driven or otherwise noindex identities. Never listed in the sitemap. */
export const NOINDEX_IDENTITIES = new Set(['/search']);

const ROUTE_META = {
  '/': { priority: '1.0', changefreq: 'daily' },
  '/articles': { priority: '0.95', changefreq: 'daily' },
  '/comparisons': { priority: '0.9', changefreq: 'daily' },
  '/troubleshooting': { priority: '0.9', changefreq: 'weekly' },
  '/guides': { priority: '0.9', changefreq: 'weekly' },
  '/tools': { priority: '0.85', changefreq: 'weekly' },
  '/alternatives': { priority: '0.85', changefreq: 'weekly' },
  '/vendors': { priority: '0.85', changefreq: 'weekly' },
  '/videos': { priority: '0.85', changefreq: 'weekly' },
  '/categories': { priority: '0.85', changefreq: 'weekly' },
};

function findGitRoot(start) {
  let dir = start;
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, '.git'))) return dir;
    dir = dirname(dir);
  }
  return start;
}

const repoRoot = findGitRoot(root);

export function repoPath(relativeFromApp) {
  const abs = join(root, relativeFromApp);
  if (abs.startsWith(`${repoRoot}/`)) return abs.slice(repoRoot.length + 1);
  return relativeFromApp;
}

export function loadJson(relativePath) {
  try {
    const value = JSON.parse(readFileSync(join(root, relativePath), 'utf8'));
    return Array.isArray(value) ? value : value;
  } catch {
    return null;
  }
}

export function loadJsonArray(relativePath) {
  const value = loadJson(relativePath);
  return Array.isArray(value) ? value : [];
}

export function loadPolicy() {
  try {
    return JSON.parse(readFileSync(join(root, 'src/config/hreflang-policy.json'), 'utf8'));
  } catch {
    return { reviewedContentRoutes: [], eligibleDiscoveryRoutes: [], publishUnreviewedTranslations: false };
  }
}

export function loadRedirectIdentities() {
  try {
    const data = JSON.parse(readFileSync(join(root, 'src/config/content-redirects.json'), 'utf8'));
    return new Set(Object.keys(data.redirects || {}));
  } catch {
    return new Set();
  }
}

export function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function parseIsoDate(value) {
  if (typeof value !== 'string') return null;
  const m = value.trim().match(/^(\d{4}-\d{2}-\d{2})/);
  if (!m) return null;
  const t = Date.parse(`${m[1]}T00:00:00Z`);
  return Number.isNaN(t) ? null : m[1];
}

export function maxDate(...values) {
  let best = null;
  for (const value of values) {
    const iso = parseIsoDate(value);
    if (iso && (!best || iso > best)) best = iso;
  }
  return best;
}

export function explicitItemDate(item) {
  if (!item || typeof item !== 'object') return null;
  return maxDate(item.updatedAt, item.updated, item.date);
}

const gitFileCache = new Map();
const gitItemCache = new Map();

export function gitLastCommitDate(paths) {
  const list = [...new Set((Array.isArray(paths) ? paths : [paths]).filter(Boolean))];
  if (!list.length) return null;
  const key = list.join('\0');
  if (gitFileCache.has(key)) return gitFileCache.get(key);
  try {
    const out = execFileSync('git', ['-C', repoRoot, 'log', '-1', '--format=%cs', '--', ...list], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const val = parseIsoDate(out);
    gitFileCache.set(key, val);
    return val;
  } catch {
    gitFileCache.set(key, null);
    return null;
  }
}

function parseItemsAt(hash, repoRelPath) {
  try {
    const raw = execFileSync('git', ['-C', repoRoot, 'show', `${hash}:${repoRelPath}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 40 * 1024 * 1024,
    });
    const data = JSON.parse(raw);
    const items = Array.isArray(data) ? data : [];
    const fp = new Map();
    for (const item of items) {
      if (item?.slug) fp.set(item.slug, JSON.stringify(item));
    }
    return fp;
  } catch {
    return new Map();
  }
}

/** Newest commit date on which each slug's JSON object last changed. */
export function gitItemLastmodMap(relativeFromApp) {
  const repoRelPath = repoPath(relativeFromApp);
  if (gitItemCache.has(repoRelPath)) return gitItemCache.get(repoRelPath);
  const map = new Map();
  let log;
  try {
    log = execFileSync('git', ['-C', repoRoot, 'log', '--format=%H %cs', '--', repoRelPath], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 20 * 1024 * 1024,
    }).trim();
  } catch {
    gitItemCache.set(repoRelPath, map);
    return map;
  }
  if (!log) {
    gitItemCache.set(repoRelPath, map);
    return map;
  }
  const commits = log.split('\n').map((line) => {
    const i = line.indexOf(' ');
    return { hash: line.slice(0, i), date: line.slice(i + 1) };
  });
  const head = parseItemsAt(commits[0].hash, repoRelPath);
  for (let i = 0; i < commits.length; i++) {
    const parent = i + 1 < commits.length ? parseItemsAt(commits[i + 1].hash, repoRelPath) : new Map();
    for (const [slug, fp] of head) {
      if (map.has(slug)) continue;
      if (parent.get(slug) !== fp) map.set(slug, parseIsoDate(commits[i].date));
    }
    if (map.size === head.size) break;
  }
  gitItemCache.set(repoRelPath, map);
  return map;
}

export function itemLastmod(item, relativeFromApp, gitMap) {
  const explicit = explicitItemDate(item);
  const git = (gitMap && item?.slug && gitMap.get(item.slug)) || gitLastCommitDate(repoPath(relativeFromApp));
  return maxDate(explicit, git);
}

export function isContentPublishable(item, policy) {
  if (!item?.slug) return false;
  if (item.translationStatus === 'invalid') return false;
  return true;
}

export function isEnglishPublishable(item, policy) {
  if (!isContentPublishable(item, policy)) return false;
  if (item.translationStatus === 'reviewed') return true;
  // Items without a status (pages, most comparisons) follow the policy switch.
  return policy.publishUnreviewedTranslations === true && item.translationStatus !== 'invalid';
}

function routeMeta(path, extra = {}) {
  if (ROUTE_META[path]) return { ...ROUTE_META[path], ...extra };
  if (path.startsWith('/article/')) {
    return { priority: extra.featured ? '0.9' : '0.8', changefreq: 'weekly', ...extra };
  }
  if (path.startsWith('/comparison/')) return { priority: '0.85', changefreq: 'weekly', ...extra };
  if (path.startsWith('/alternatives/')) return { priority: '0.8', changefreq: 'weekly', ...extra };
  if (path.startsWith('/tools/')) return { priority: '0.8', changefreq: 'monthly', ...extra };
  if (path.startsWith('/videos/')) return { priority: '0.8', changefreq: 'weekly', ...extra };
  if (path.startsWith('/video/')) return { priority: '0.6', changefreq: 'monthly', ...extra };
  if (path.startsWith('/page/')) return { priority: '0.55', changefreq: 'monthly', ...extra };
  if (path.startsWith('/vendors/')) return { priority: '0.8', changefreq: 'weekly', ...extra };
  if (path.startsWith('/domain/')) return { priority: '0.85', changefreq: 'weekly', ...extra };
  return { priority: '0.7', changefreq: 'weekly', ...extra };
}

export function staticAppIdentities() {
  const src = readFileSync(join(root, 'src/App.tsx'), 'utf8');
  const paths = [...src.matchAll(/<Route path="(\/[^"]*)"/g)].map((m) => m[1]);
  return paths.filter((p) => p && !p.includes(':') && !NOINDEX_IDENTITIES.has(p));
}

function validDomainIds() {
  try {
    const src = readFileSync(join(root, 'src/pages/Domain.tsx'), 'utf8');
    const m = src.match(/const VALID:[^=]*=\s*\[([^\]]+)\]/);
    if (!m) return [];
    return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
  } catch {
    return [];
  }
}

function vendorIds(policy) {
  const fromPolicy = (policy.eligibleDiscoveryRoutes || []).filter((p) => p.startsWith('/vendors/')).map((p) => p.slice('/vendors/'.length));
  // Prefer live taxonomy so a newly added vendor is listed even before the policy file is edited.
  try {
    const src = readFileSync(join(root, 'src/data/taxonomy/vendors.ts'), 'utf8');
    const start = src.indexOf('export const VENDORS');
    const ids = [];
    if (start !== -1) {
      const body = src.slice(start);
      const re = /^\s{2}\{\s*\n\s*id:\s*'([^']+)'/gm;
      let m;
      while ((m = re.exec(body))) ids.push(m[1]);
    }
    return [...new Set([...ids, ...fromPolicy])];
  } catch {
    return fromPolicy;
  }
}

function collectionLastmod(items, relativeFromApp) {
  const gitMap = gitItemLastmodMap(relativeFromApp);
  const dates = items.map((item) => itemLastmod(item, relativeFromApp, gitMap));
  dates.push(gitLastCommitDate(repoPath(relativeFromApp)));
  return maxDate(...dates);
}

/**
 * All indexable sitemap route definitions (language-less identity + languages).
 * Redirect-only and noindex identities are omitted.
 */
export function collectIndexableRoutes() {
  const policy = loadPolicy();
  const redirects = loadRedirectIdentities();
  const eligibleDiscovery = new Set(policy.eligibleDiscoveryRoutes || []);
  const reviewedContent = new Set(policy.reviewedContentRoutes || []);

  const articles = loadJsonArray('src/content/articles.json');
  const comparisons = loadJsonArray('src/content/comparisons.json');
  const pages = loadJsonArray('src/content/pages.json');
  const alternatives = loadJsonArray('src/content/alternatives.json');
  const videos = loadJsonArray('src/content/videos.json');
  const playlists = loadJsonArray('src/content/video-playlists.json');
  const webTools = loadJsonArray('src/content/web-tools.json');

  const articleGit = gitItemLastmodMap('src/content/articles.json');
  const comparisonGit = gitItemLastmodMap('src/content/comparisons.json');
  const pageGit = gitItemLastmodMap('src/content/pages.json');
  const altGit = gitItemLastmodMap('src/content/alternatives.json');
  const videoGit = gitItemLastmodMap('src/content/videos.json');
  const playlistGit = gitItemLastmodMap('src/content/video-playlists.json');
  const toolGit = gitItemLastmodMap('src/content/web-tools.json');

  const routes = [];
  const seen = new Set();

  function add(path, options) {
    if (!path || seen.has(path) || NOINDEX_IDENTITIES.has(path) || redirects.has(path)) return;
    seen.add(path);
    routes.push({ path, ...options });
  }

  function translatableLanguages(item) {
    const langs = ['ar'];
    if (isEnglishPublishable(item, policy)) langs.push('en');
    return langs;
  }

  function discoveryEligible(path, { bilingual, translatable, item } = {}) {
    if (bilingual) return true;
    if (eligibleDiscovery.has(path) || reviewedContent.has(path)) return true;
    if (translatable && item) return isEnglishPublishable(item, policy);
    return false;
  }

  // Static section routes declared in the app (new ones are picked up automatically).
  for (const path of staticAppIdentities()) {
    const bilingual = true;
    let lastmod = gitLastCommitDate([
      repoPath('src/App.tsx'),
      repoPath('src/pages'),
    ]);
    if (path === '/') {
      lastmod = maxDate(
        lastmod,
        collectionLastmod(articles, 'src/content/articles.json'),
        gitLastCommitDate(repoPath('src/pages/Home.tsx')),
      );
    } else if (path === '/articles') {
      lastmod = maxDate(collectionLastmod(articles, 'src/content/articles.json'), gitLastCommitDate(repoPath('src/pages/Articles.tsx')));
    } else if (path === '/comparisons') {
      lastmod = maxDate(collectionLastmod(comparisons, 'src/content/comparisons.json'), gitLastCommitDate(repoPath('src/pages/Comparisons.tsx')));
    } else if (path === '/alternatives') {
      lastmod = maxDate(collectionLastmod(alternatives, 'src/content/alternatives.json'), gitLastCommitDate(repoPath('src/pages/Alternatives.tsx')));
    } else if (path === '/videos') {
      lastmod = maxDate(
        collectionLastmod(videos, 'src/content/videos.json'),
        collectionLastmod(playlists, 'src/content/video-playlists.json'),
        gitLastCommitDate(repoPath('src/pages/Videos.tsx')),
      );
    } else if (path === '/tools') {
      lastmod = maxDate(
        gitLastCommitDate([
          repoPath('src/pages/Tools.tsx'),
          repoPath('src/content/desktop-program.json'),
        ]),
      );
    } else if (path === '/vendors') {
      lastmod = gitLastCommitDate([repoPath('src/pages/Vendors.tsx'), repoPath('src/data/taxonomy/vendors.ts')]);
    } else if (path === '/categories') {
      lastmod = gitLastCommitDate([repoPath('src/pages/Categories.tsx'), repoPath('src/data/taxonomy')]);
    } else if (path === '/guides' || path === '/troubleshooting') {
      lastmod = maxDate(
        collectionLastmod(articles, 'src/content/articles.json'),
        gitLastCommitDate(repoPath(`src/pages/${path === '/guides' ? 'Guides' : 'Troubleshooting'}.tsx`)),
      );
    }
    add(path, {
      ...routeMeta(path),
      lastmod,
      languages: ['ar', 'en'],
      eligible: discoveryEligible(path, { bilingual }),
    });
  }

  // Policy discovery routes not already covered (vendor hubs historically live here;
  // domain hubs too). Also include every current vendor and valid domain from source.
  for (const path of policy.eligibleDiscoveryRoutes || []) {
    if (staticAppIdentities().includes(path)) continue;
    if (path.startsWith('/vendors/') || path.startsWith('/domain/')) {
      // added below from live taxonomy / Domain.tsx so we don't double-handle
      continue;
    }
    add(path, {
      ...routeMeta(path),
      lastmod: gitLastCommitDate([repoPath('src/config/hreflang-policy.json'), repoPath('src/App.tsx')]),
      languages: ['ar', 'en'],
      eligible: true,
    });
  }

  for (const id of vendorIds(policy)) {
    const path = `/vendors/${id}`;
    add(path, {
      ...routeMeta(path),
      lastmod: gitLastCommitDate([repoPath('src/data/taxonomy/vendors.ts'), repoPath('src/pages/VendorDetail.tsx')]),
      languages: ['ar', 'en'],
      eligible: true,
    });
  }

  for (const id of validDomainIds()) {
    const path = `/domain/${id}`;
    add(path, {
      ...routeMeta(path),
      lastmod: gitLastCommitDate([repoPath('src/data/taxonomy/domains.ts'), repoPath('src/pages/Domain.tsx')]),
      languages: ['ar', 'en'],
      eligible: true,
    });
  }

  for (const item of webTools.filter((i) => i?.slug)) {
    const path = `/tools/${item.slug}`;
    add(path, {
      ...routeMeta(path),
      lastmod: itemLastmod(item, 'src/content/web-tools.json', toolGit),
      languages: ['ar', 'en'],
      eligible: discoveryEligible(path, { bilingual: true }),
    });
  }

  for (const item of alternatives.filter((i) => i?.slug)) {
    const path = `/alternatives/${item.slug}`;
    add(path, {
      ...routeMeta(path),
      lastmod: itemLastmod(item, 'src/content/alternatives.json', altGit),
      languages: ['ar', 'en'],
      eligible: true,
    });
  }

  for (const item of articles.filter((i) => isContentPublishable(i, policy))) {
    const path = `/article/${item.slug}`;
    add(path, {
      ...routeMeta(path, { featured: item.isFeatured === true }),
      lastmod: itemLastmod(item, 'src/content/articles.json', articleGit),
      languages: translatableLanguages(item),
      eligible: discoveryEligible(path, { translatable: true, item }),
      translationStatus: item.translationStatus,
    });
  }

  for (const item of comparisons.filter((i) => isContentPublishable(i, policy))) {
    const path = `/comparison/${item.slug}`;
    add(path, {
      ...routeMeta(path),
      lastmod: itemLastmod(item, 'src/content/comparisons.json', comparisonGit),
      languages: translatableLanguages(item),
      eligible: discoveryEligible(path, { translatable: true, item }),
      translationStatus: item.translationStatus,
    });
  }

  for (const item of playlists.filter((i) => i?.slug)) {
    const path = `/videos/${item.slug}`;
    add(path, {
      ...routeMeta(path),
      lastmod: itemLastmod(item, 'src/content/video-playlists.json', playlistGit),
      languages: ['ar', 'en'],
      eligible: true,
    });
  }

  for (const item of videos.filter((i) => i?.slug)) {
    const path = `/video/${item.slug}`;
    add(path, {
      ...routeMeta(path),
      lastmod: itemLastmod(item, 'src/content/videos.json', videoGit),
      languages: ['ar', 'en'],
      eligible: true,
    });
  }

  for (const item of pages.filter((i) => isContentPublishable(i, policy))) {
    const path = `/page/${item.slug}`;
    add(path, {
      ...routeMeta(path),
      lastmod: itemLastmod(item, 'src/content/pages.json', pageGit),
      languages: translatableLanguages(item),
      eligible: discoveryEligible(path, { translatable: true, item }),
      translationStatus: item.translationStatus,
    });
  }

  return routes;
}

export function localizedUrl(path, language) {
  return `${SITE}/${language}${path === '/' ? '/' : path}`;
}

function alternateXml(path) {
  const ar = localizedUrl(path, 'ar');
  const en = localizedUrl(path, 'en');
  return [
    ['ar', ar],
    ['en', en],
    ['x-default', ar],
  ]
    .map(([language, href]) => `\n    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(href)}" />`)
    .join('');
}

export function expandRouteEntries(routes) {
  const entries = [];
  for (const route of routes) {
    const languages = route.languages?.length ? route.languages : ['ar'];
    const eligible = route.eligible === true && languages.includes('en');
    for (const language of languages) {
      entries.push({ ...route, language, eligible });
    }
  }
  return entries;
}

export function buildUrlsetXml(entries) {
  const body = entries
    .map((entry) => {
      const loc = localizedUrl(entry.path, entry.language);
      const alternates = entry.eligible ? alternateXml(entry.path) : '';
      const lastmod = entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : '';
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>${alternates}${lastmod}\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`;
}

function isoSeconds(text) {
  if (!text) return null;
  const parts = String(text).split(':').map(Number);
  while (parts.length < 3) parts.unshift(0);
  if (parts.some((n) => Number.isNaN(n))) return null;
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

export function buildVideoSitemapXml(videos) {
  const videoGit = gitItemLastmodMap('src/content/videos.json');
  const body = videos
    .filter((v) => v?.slug && /^[\w-]{11}$/.test(v.youtubeId || ''))
    .flatMap((v) => {
      const lastmod = itemLastmod(v, 'src/content/videos.json', videoGit);
      const pub = parseIsoDate(v.date);
      return ['ar', 'en'].map((language) => {
        const loc = localizedUrl(`/video/${v.slug}`, language);
        const seconds = isoSeconds(v.durationText);
        const title = (v.title && v.title[language]) || v.originalTitle;
        const description = (v.description && v.description[language]) || title;
        return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `
    <lastmod>${escapeXml(lastmod)}</lastmod>` : ''}
    <video:video>
      <video:thumbnail_loc>${escapeXml(`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`)}</video:thumbnail_loc>
      <video:title>${escapeXml(title)}</video:title>
      <video:description>${escapeXml(String(description).slice(0, 2048))}</video:description>
      <video:player_loc>${escapeXml(`https://www.youtube-nocookie.com/embed/${v.youtubeId}`)}</video:player_loc>${seconds ? `
      <video:duration>${seconds}</video:duration>` : ''}${pub ? `
      <video:publication_date>${escapeXml(pub)}</video:publication_date>` : ''}
      <video:family_friendly>yes</video:family_friendly>
      <video:uploader info="${escapeXml(v.channel?.url || '')}">${escapeXml(v.channel?.name || '')}</video:uploader>
    </video:video>
  </url>`;
      });
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n${body}\n</urlset>\n`;
}

export function buildSitemaps() {
  const routes = collectIndexableRoutes();
  const entries = expandRouteEntries(routes);
  const videos = loadJsonArray('src/content/videos.json');
  return {
    routes,
    entries,
    sitemapXml: buildUrlsetXml(entries),
    videoXml: buildVideoSitemapXml(videos),
    videoCount: videos.filter((v) => v?.slug && /^[\w-]{11}$/.test(v.youtubeId || '')).length,
  };
}
