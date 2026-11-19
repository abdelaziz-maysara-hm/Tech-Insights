/**
 * Phase 6A SEO prerender orchestration.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  extractLocUrls,
  pathnameFromProductionUrl,
  routeDirFromPathname,
  resolveRouteIndexPath,
  PRODUCTION_ORIGIN,
} from './generate-static-route-fallbacks.mjs';
import {
  SITE,
  escapeHtml,
  escapeAttr,
  safeJsonLd,
  pickLocalized,
  loadContentIndexes,
  routeIdentityFromPathname,
  detectLocale,
  isHreflangEligibleForRoute,
  buildHreflangAlternates,
  resolveRouteSeo,
  fullDocumentTitle,
} from './seo-prerender-core.mjs';
import { renderStaticBody, breadcrumbTrail, localizedHref, toolFaqJsonLd } from './seo-static-content.mjs';
import { countWords } from '../src/lib/markdown.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Re-exports for tests
export {
  SITE,
  escapeHtml,
  escapeAttr,
  safeJsonLd,
  pickLocalized,
  loadContentIndexes,
  routeIdentityFromPathname,
  detectLocale,
  isHreflangEligibleForRoute,
  buildHreflangAlternates,
  resolveRouteSeo,
  fullDocumentTitle,
} from './seo-prerender-core.mjs';

export function injectSeoIntoShell(shellHtml, seo, extras = {}) {
  let html = shellHtml;
  html = html.replace(
    /<html\b[^>]*>/i,
    // "dark" matches ThemeProvider's default theme so the static content is
    // readable before (or without) JavaScript.
    `<html lang="${escapeAttr(seo.lang)}" dir="${escapeAttr(seo.dir)}" class="dark">`,
  );
  const docTitle = fullDocumentTitle(seo);
  if (/<title\b[^>]*>[\s\S]*?<\/title>/i.test(html)) {
    html = html.replace(
      /<title\b[^>]*>[\s\S]*?<\/title>/i,
      `<title>${escapeHtml(docTitle)}</title>`,
    );
  } else {
    html = html.replace(/<\/head>/i, `  <title>${escapeHtml(docTitle)}</title>\n</head>`);
  }

  html = html.replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, '');
  html = html.replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi, '');
  html = html.replace(/<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi, '');
  html = html.replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/gi, '');
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '');
  html = html.replace(/<link\s+rel=["']alternate["'][^>]*hreflang[^>]*>\s*/gi, '');
  html = html.replace(
    /<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi,
    '',
  );

  const desc = seo.description || (seo.lang === 'ar' ? SITE.descriptionAr : SITE.descriptionEn);
  const tags = [];
  tags.push(`<meta name="description" content="${escapeAttr(desc)}" />`);
  tags.push(`<meta name="robots" content="index, follow" />`);
  tags.push(`<link rel="canonical" href="${escapeAttr(seo.canonical)}" />`);
  for (const alt of seo.alternates) {
    tags.push(
      `<link rel="alternate" hreflang="${escapeAttr(alt.hreflang)}" href="${escapeAttr(alt.href)}" data-netsecatlas-hreflang="1" />`,
    );
  }
  tags.push(`<meta property="og:title" content="${escapeAttr(docTitle)}" />`);
  tags.push(`<meta property="og:description" content="${escapeAttr(desc)}" />`);
  tags.push(`<meta property="og:url" content="${escapeAttr(seo.canonical)}" />`);
  tags.push(`<meta property="og:type" content="${escapeAttr(seo.type)}" />`);
  tags.push(`<meta property="og:site_name" content="${escapeAttr(SITE.name)}" />`);
  tags.push(`<meta property="og:locale" content="${seo.lang === 'ar' ? 'ar_AR' : 'en_US'}" />`);
  if (seo.image) tags.push(`<meta property="og:image" content="${escapeAttr(seo.image)}" />`);
  tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
  tags.push(`<meta name="twitter:title" content="${escapeAttr(docTitle)}" />`);
  tags.push(`<meta name="twitter:description" content="${escapeAttr(desc)}" />`);
  if (seo.image) tags.push(`<meta name="twitter:image" content="${escapeAttr(seo.image)}" />`);

  if (seo.type === 'article' && seo.title) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: seo.title,
      description: desc,
      url: seo.canonical,
      inLanguage: seo.lang === 'ar' ? 'ar' : 'en',
      author: {
        '@type': 'Person',
        name: seo.authorName || (seo.lang === 'ar' ? SITE.defaultAuthorAr : SITE.defaultAuthorEn),
      },
      publisher: {
        '@type': 'Organization',
        name: SITE.organization.name,
        url: SITE.organization.url,
      },
    };
    jsonLd.mainEntityOfPage = { '@type': 'WebPage', '@id': seo.canonical };
    if (seo.image) jsonLd.image = seo.image;
    if (seo.datePublished) {
      jsonLd.datePublished = seo.datePublished;
      jsonLd.dateModified = seo.dateModified || seo.datePublished;
    }
    if (extras.article?.wordCount) jsonLd.wordCount = extras.article.wordCount;
    if (extras.article?.keywords?.length) jsonLd.keywords = extras.article.keywords.join(', ');
    if (extras.article?.section) jsonLd.articleSection = extras.article.section;
    tags.push(
      `<script type="application/ld+json" id="jsonld-article">${safeJsonLd(jsonLd)}</script>`,
    );
  } else if (seo.source === 'home' || seo.source === 'section') {
    const localizedRoot = `${SITE.url}/${seo.lang}/`;
    const searchUrl = `${SITE.url}/${seo.lang}/search`;
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE.name,
      url: localizedRoot,
      inLanguage: seo.lang,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${searchUrl}?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
    tags.push(
      `<script type="application/ld+json" id="jsonld-website">${safeJsonLd(jsonLd)}</script>`,
    );
  } else if (seo.source === 'tool' && seo.title) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: seo.title,
      description: desc,
      url: seo.canonical,
      inLanguage: seo.lang === 'ar' ? 'ar' : 'en',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any (web browser)',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: {
        '@type': 'Organization',
        name: SITE.organization.name,
        url: SITE.organization.url,
      },
    };
    tags.push(
      `<script type="application/ld+json" id="jsonld-tool">${safeJsonLd(jsonLd)}</script>`,
    );
  }

  if (seo.alternates.length) {
    tags.push(`<meta property="og:locale:alternate" content="${seo.lang === 'ar' ? 'en_US' : 'ar_AR'}" />`);
  }
  if (seo.type === 'article' && seo.datePublished) {
    tags.push(`<meta property="article:published_time" content="${escapeAttr(seo.datePublished)}" />`);
  }
  if (Array.isArray(extras.breadcrumbs) && extras.breadcrumbs.length > 1) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: extras.breadcrumbs.map(([name, url], index) => {
        const item = { '@type': 'ListItem', position: index + 1, name };
        if (url) item.item = url;
        return item;
      }),
    };
    tags.push(`<script type="application/ld+json" id="jsonld-breadcrumbs">${safeJsonLd(jsonLd)}</script>`);
  }
  for (const [id, data] of extras.jsonLd || []) {
    if (data) tags.push(`<script type="application/ld+json" id="${escapeAttr(id)}">${safeJsonLd(data)}</script>`);
  }

  // Language-specific RSS feed discovery link.
  html = html.replace(
    /<link\s+rel=["']alternate["']\s+type=["']application\/rss\+xml["'][^>]*>/i,
    `<link rel="alternate" type="application/rss+xml" title="${escapeAttr(SITE.name)} RSS" href="/${seo.lang}/rss.xml" />`,
  );

  // Crawlable static body (replaced by React's createRoot on mount).
  if (extras.bodyHtml) {
    html = html.replace(/<div id="root">\s*<\/div>/i, () => `<div id="root">${extras.bodyHtml}</div>`);
  }

  const injection = tags.map((t) => `    ${t}`).join('\n') + '\n';
  if (/<\/head>/i.test(html)) html = html.replace(/<\/head>/i, `${injection}</head>`);
  else html = injection + html;
  return html;
}

export function assertSeoQuality(seo, pathname) {
  const errors = [];
  if (!seo.canonical.startsWith('https://netsecatlas.com')) {
    errors.push(`canonical host: ${seo.canonical}`);
  }
  for (const bad of ['localhost', 'github.io', 'vercel.app', '/Tech-Insights/']) {
    if (seo.canonical.includes(bad)) errors.push(`canonical contains ${bad}`);
  }
  if (seo.canonical.includes('?') || seo.canonical.includes('#')) {
    errors.push('canonical has query/hash');
  }
  if (/\/(ar|en)\/\1(\/|$)/.test(seo.canonical)) errors.push('duplicated locale prefix');
  if (pathname.startsWith('/ar') && seo.lang !== 'ar') errors.push('ar path with non-ar lang');
  if (pathname.startsWith('/en') && seo.lang !== 'en') errors.push('en path with non-en lang');
  return errors;
}

export function buildRouteExtras(pathname, seo, indexes) {
  const identity = routeIdentityFromPathname(pathname);
  const extras = {
    bodyHtml: renderStaticBody(identity, seo, indexes),
    breadcrumbs: breadcrumbTrail(identity, seo, indexes).map(([label, id]) => [
      label,
      id ? `${SITE.url}${localizedHref(id, seo.lang)}` : seo.canonical,
    ]),
    jsonLd: [],
  };
  let m;
  if ((m = identity.match(/^\/article\/([^/]+)$/))) {
    const article = indexes.articlesBySlug.get(m[1]);
    if (article) {
      extras.article = {
        wordCount: countWords(pickLocalized(article.body, seo.lang)),
        keywords: Array.isArray(article.tags) ? article.tags : [],
        section: article.categoryId || '',
      };
    }
  }
  if ((m = identity.match(/^\/tools\/([^/]+)$/))) {
    extras.jsonLd.push(['jsonld-faq', toolFaqJsonLd(indexes.toolsBySlug?.get(m[1]), seo.lang)]);
  }
  return extras;
}

/**
 * GitHub Pages answers /x/y with a 301 to /x/y/ when only x/y/index.html
 * exists, but serves x/y.html directly with HTTP 200. Canonical and sitemap
 * URLs have no trailing slash, so also write <route>.html. Language roots
 * (/ar/, /en/) keep their trailing-slash canonical and are skipped.
 */
export function writeExtensionlessTwin(distPublic, relativeDir, html) {
  if (!relativeDir || /^(ar|en)$/.test(relativeDir)) return false;
  const indexPath = resolveRouteIndexPath(distPublic, relativeDir);
  if (!indexPath) return false;
  const twin = `${dirname(indexPath)}.html`;
  const base = resolve(distPublic);
  if (!resolve(twin).startsWith(`${base}/`)) return false;
  mkdirSync(dirname(twin), { recursive: true });
  writeFileSync(twin, html, 'utf8');
  return true;
}

/** Tiny HTML page that forwards an un-prefixed legacy URL to its /ar/ canonical. */
export function legacyRedirectHtml(targetPath) {
  const target = escapeAttr(targetPath);
  const abs = escapeAttr(`${SITE.url}${targetPath}`);
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<title>NetSec Atlas</title>
<link rel="canonical" href="${abs}" />
<meta http-equiv="refresh" content="0; url=${target}" />
<script>location.replace(${JSON.stringify(targetPath).replaceAll('<', '\\u003c')} + location.search + location.hash);</script>
</head>
<body><p><a href="${target}">${abs}</a></p></body>
</html>
`;
}

/**
 * Old feeds/backlinks used un-prefixed paths (/article/<slug>, /comparisons …).
 * GitHub Pages cannot send 301s, so write a meta-refresh + canonical stub at
 * each legacy path (Google treats an instant meta refresh as a permanent
 * redirect). Never overwrites an existing file.
 */
export function writeLegacyRedirects({ distPublic, routes }) {
  let written = 0;
  const seen = new Set();
  for (const route of routes) {
    const m = String(route.path).match(/^ar\/(.+)$/);
    if (!m || seen.has(m[1])) continue;
    seen.add(m[1]);
    const outPath = resolveRouteIndexPath(distPublic, m[1]);
    if (!outPath || existsSync(outPath)) continue;
    mkdirSync(dirname(outPath), { recursive: true });
    const stub = legacyRedirectHtml(`/ar/${m[1]}`);
    writeFileSync(outPath, stub, 'utf8');
    writeExtensionlessTwin(distPublic, m[1], stub);
    written += 1;
  }
  return written;
}

export function prerenderSeoRoutes({ distPublic, sitemapXml, shellHtml, indexes }) {
  const urls = extractLocUrls(sitemapXml);
  const result = {
    sitemapUrls: urls.length,
    written: 0,
    withSpecificMeta: 0,
    withFallbackMeta: 0,
    rejected: [],
    skippedDuplicate: 0,
    qualityFailures: [],
    routes: [],
  };
  const seen = new Set();

  for (const url of urls) {
    const pathname = pathnameFromProductionUrl(url, PRODUCTION_ORIGIN);
    if (pathname == null) {
      result.rejected.push({ url, reason: 'foreign-or-invalid-url' });
      continue;
    }
    const dirResult = routeDirFromPathname(pathname);
    if (!dirResult.ok) {
      result.rejected.push({ url, reason: dirResult.reason });
      continue;
    }
    const relativeDir = dirResult.relativeDir;
    const key = relativeDir || '__root__';
    if (seen.has(key)) {
      result.skippedDuplicate += 1;
      continue;
    }
    seen.add(key);

    const seo = resolveRouteSeo(pathname, indexes);
    const quality = assertSeoQuality(seo, pathname);
    if (quality.length) {
      result.qualityFailures.push({ url, quality });
      continue;
    }

    const html = injectSeoIntoShell(shellHtml, seo, buildRouteExtras(pathname, seo, indexes));
    const outPath =
      relativeDir === ''
        ? join(distPublic, 'index.html')
        : resolveRouteIndexPath(distPublic, relativeDir);
    if (!outPath) {
      result.rejected.push({ url, reason: 'path-escape' });
      continue;
    }
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html, 'utf8');
    writeExtensionlessTwin(distPublic, relativeDir, html);
    result.written += 1;
    result.routes.push({ path: relativeDir || '', source: seo.source, canonical: seo.canonical });
    if (seo.source === 'fallback') result.withFallbackMeta += 1;
    else result.withSpecificMeta += 1;
  }
  return result;
}

function isMainModule() {
  const entry = process.argv[1] && resolve(process.argv[1]);
  return entry === fileURLToPath(import.meta.url);
}

function main() {
  const distPublic = join(root, 'dist', 'public');
  const shellPath = join(distPublic, 'index.html');
  if (!existsSync(shellPath)) {
    console.error('[seo-prerender] missing dist/public/index.html — run vite build first');
    process.exit(1);
  }
  const sitemapPath = [join(distPublic, 'sitemap.xml'), join(root, 'public', 'sitemap.xml')].find(
    (p) => existsSync(p),
  );
  if (!sitemapPath) {
    console.error('[seo-prerender] sitemap.xml not found');
    process.exit(1);
  }

  const shellHtml = readFileSync(shellPath, 'utf8');
  const indexes = loadContentIndexes();
  const xml = readFileSync(sitemapPath, 'utf8');
  const result = prerenderSeoRoutes({ distPublic, sitemapXml: xml, shellHtml, indexes });

  if (!result.routes.some((r) => r.path === '')) {
    // Root "/" → crawlable Arabic home (canonical /ar/); the SPA then
    // client-redirects to /ar/ as before.
    const homeSeo = resolveRouteSeo('/ar/', indexes);
    writeFileSync(
      shellPath,
      injectSeoIntoShell(shellHtml, homeSeo, buildRouteExtras('/ar/', homeSeo, indexes)),
      'utf8',
    );
  }
  const legacyWritten = writeLegacyRedirects({ distPublic, routes: result.routes });
  const notFoundHtml = shellHtml.replace(
    /<meta\s+name=["']robots["'][^>]*>/i,
    '<meta name="robots" content="noindex, follow" />',
  );
  writeFileSync(join(distPublic, '404.html'), notFoundHtml, 'utf8');
  console.log(`[seo-prerender] legacy redirect stubs=${legacyWritten}`);

  console.log(
    `[seo-prerender] sitemap=${result.sitemapUrls} written=${result.written} specific=${result.withSpecificMeta} fallback=${result.withFallbackMeta} rejected=${result.rejected.length} qualityFails=${result.qualityFailures.length}`,
  );
  if (result.qualityFailures.length) {
    for (const item of result.qualityFailures.slice(0, 5)) {
      console.error('[seo-prerender] quality', item.url, item.quality.join('; '));
    }
    process.exit(1);
  }
}

if (isMainModule()) {
  main();
}
