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

export function injectSeoIntoShell(shellHtml, seo) {
  let html = shellHtml;
  html = html.replace(
    /<html\b[^>]*>/i,
    `<html lang="${escapeAttr(seo.lang)}" dir="${escapeAttr(seo.dir)}">`,
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
    if (seo.image) jsonLd.image = seo.image;
    if (seo.datePublished) jsonLd.datePublished = seo.datePublished;
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

    const html = injectSeoIntoShell(shellHtml, seo);
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
    writeFileSync(shellPath, shellHtml, 'utf8');
  }
  writeFileSync(join(distPublic, '404.html'), shellHtml, 'utf8');

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
