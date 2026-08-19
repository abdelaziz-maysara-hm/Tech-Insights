import assert from 'node:assert/strict';
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  assertSeoQuality,
  buildHreflangAlternates,
  detectLocale,
  escapeAttr,
  escapeHtml,
  injectSeoIntoShell,
  isHreflangEligibleForRoute,
  pickLocalized,
  prerenderSeoRoutes,
  resolveRouteSeo,
  routeIdentityFromPathname,
  safeJsonLd,
} from './seo-prerender.mjs';

const shell = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>NetSec Atlas</title>
  <script type="module" crossorigin src="/assets/index-TEST.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index-TEST.css">
</head>
<body><div id="root"></div></body>
</html>`;

function makeIndexes(overrides = {}) {
  return {
    articlesBySlug: new Map([
      [
        'sample-article',
        {
          slug: 'sample-article',
          title: { ar: 'عنوان عربي', en: 'English Title' },
          excerpt: { ar: 'وصف عربي', en: 'English description' },
          heroImage: 'https://cdn.example/img.jpg',
          date: '2024-01-15',
          author: { name: { ar: 'كاتب', en: 'Author' } },
        },
      ],
      [
        'evil-article',
        {
          slug: 'evil-article',
          title: { ar: '</title><script>alert(1)</script>', en: 'Evil "Title"' },
          excerpt: { ar: 'desc "x" & y', en: 'desc "x" & y' },
          heroImage: '',
          date: '2024-01-01',
          author: { name: { ar: 'A', en: 'A' } },
        },
      ],
    ]),
    comparisonsBySlug: new Map(),
    pagesBySlug: new Map(),
    vendorsById: new Map([
      [
        'fortinet',
        {
          id: 'fortinet',
          label: { ar: 'Fortinet', en: 'Fortinet' },
          description: { ar: 'جدران نارية', en: 'Firewalls' },
        },
      ],
    ]),
    domainsById: new Map([
      [
        'cybersecurity',
        {
          id: 'cybersecurity',
          label: { ar: 'الأمن السيبراني', en: 'Cybersecurity' },
          description: { ar: 'وصف أمن', en: 'Security desc' },
        },
      ],
    ]),
    reviewedContentRoutes: new Set(),
    eligibleDiscoveryRoutes: new Set(['/', '/articles', '/troubleshooting', '/guides']),
    ...overrides,
  };
}

test('locale and identity helpers', () => {
  assert.equal(detectLocale('/ar/article/x'), 'ar');
  assert.equal(detectLocale('/en/articles'), 'en');
  assert.equal(routeIdentityFromPathname('/ar/article/sample-article'), '/article/sample-article');
  assert.equal(routeIdentityFromPathname('/en/'), '/');
  assert.equal(routeIdentityFromPathname('/ar/articles'), '/articles');
});

test('hreflang eligibility is conservative', () => {
  const indexes = makeIndexes();
  assert.equal(isHreflangEligibleForRoute('/articles', indexes), true);
  assert.equal(isHreflangEligibleForRoute('/article/sample-article', indexes), false);
  assert.equal(buildHreflangAlternates('/article/sample-article', false).length, 0);
  assert.equal(buildHreflangAlternates('/', true).length, 3);
});

test('Arabic home SEO', () => {
  const seo = resolveRouteSeo('/ar/', makeIndexes());
  assert.equal(seo.lang, 'ar');
  assert.equal(seo.dir, 'rtl');
  assert.equal(seo.canonical, 'https://netsecatlas.com/ar/');
  assert.ok(seo.alternates.length === 3);
  assert.equal(assertSeoQuality(seo, '/ar/').length, 0);
});

test('English home SEO', () => {
  const seo = resolveRouteSeo('/en/', makeIndexes());
  assert.equal(seo.lang, 'en');
  assert.equal(seo.dir, 'ltr');
  assert.equal(seo.canonical, 'https://netsecatlas.com/en/');
});

test('Arabic article SEO with JSON-LD fields', () => {
  const seo = resolveRouteSeo('/ar/article/sample-article', makeIndexes());
  assert.equal(seo.source, 'article');
  assert.equal(seo.title, 'عنوان عربي');
  assert.equal(seo.description, 'وصف عربي');
  assert.equal(seo.canonical, 'https://netsecatlas.com/ar/article/sample-article');
  assert.equal(seo.type, 'article');
  assert.equal(seo.alternates.length, 0);
});

test('English article path still resolves English fields when present', () => {
  const seo = resolveRouteSeo('/en/article/sample-article', makeIndexes());
  assert.equal(seo.lang, 'en');
  assert.equal(seo.title, 'English Title');
  assert.equal(seo.description, 'English description');
});

test('section route metadata', () => {
  const seo = resolveRouteSeo('/ar/troubleshooting', makeIndexes());
  assert.equal(seo.source, 'section');
  assert.match(seo.title, /استكشاف|Troubleshooting/);
  assert.equal(seo.canonical, 'https://netsecatlas.com/ar/troubleshooting');
});

test('unreviewed content must not get hreflang alternates', () => {
  const seo = resolveRouteSeo('/ar/article/sample-article', makeIndexes());
  assert.equal(seo.alternates.length, 0);
});

test('escaping prevents HTML breakout', () => {
  const seo = resolveRouteSeo('/ar/article/evil-article', makeIndexes());
  const html = injectSeoIntoShell(shell, seo);
  assert.ok(html.includes('&lt;/title&gt;'));
  assert.ok(!html.includes('</title><script>alert'));
  assert.ok(html.includes('/assets/index-TEST.js'));
  assert.ok(html.includes('/assets/index-TEST.css'));
  const ld = html.match(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/);
  assert.ok(ld);
  assert.ok(!ld[1].includes('</script>'));
});

test('canonical equals og:url and quality gate', () => {
  const seo = resolveRouteSeo('/en/articles', makeIndexes());
  const html = injectSeoIntoShell(shell, seo);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
  const ogUrl = html.match(/property="og:url" content="([^"]+)"/)[1];
  assert.equal(canonical, ogUrl);
  assert.equal(canonical, 'https://netsecatlas.com/en/articles');
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(!canonical.includes('Tech-Insights'));
});

test('inject preserves vite assets and sets lang/dir', () => {
  const seo = resolveRouteSeo('/ar/', makeIndexes());
  const html = injectSeoIntoShell(shell, seo);
  assert.match(html, /<html lang="ar" dir="rtl">/);
  assert.ok(html.includes('src="/assets/index-TEST.js"'));
  assert.ok(html.includes('href="/assets/index-TEST.css"'));
});

test('prerenderSeoRoutes writes all sitemap paths and keeps unknown out', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nsa-seo-'));
  try {
    const distPublic = join(dir, 'public');
    mkdirSync(distPublic, { recursive: true });
    writeFileSync(join(distPublic, 'index.html'), shell, 'utf8');
    const xml = `<?xml version="1.0"?>
    <urlset>
      <url><loc>https://netsecatlas.com/ar/</loc></url>
      <url><loc>https://netsecatlas.com/en/</loc></url>
      <url><loc>https://netsecatlas.com/ar/articles</loc></url>
      <url><loc>https://netsecatlas.com/ar/article/sample-article</loc></url>
      <url><loc>https://netsecatlas.com/en/article/sample-article</loc></url>
      <url><loc>https://evil.example/ar/</loc></url>
    </urlset>`;
    const result = prerenderSeoRoutes({
      distPublic,
      sitemapXml: xml,
      shellHtml: shell,
      indexes: makeIndexes(),
    });
    assert.equal(result.written, 5);
    assert.equal(result.rejected.length, 1);
    assert.ok(existsSync(join(distPublic, 'ar', 'index.html')));
    assert.ok(existsSync(join(distPublic, 'en', 'index.html')));
    assert.ok(existsSync(join(distPublic, 'ar', 'articles', 'index.html')));
    assert.ok(existsSync(join(distPublic, 'ar', 'article', 'sample-article', 'index.html')));
    const articleHtml = readFileSync(
      join(distPublic, 'ar', 'article', 'sample-article', 'index.html'),
      'utf8',
    );
    assert.ok(articleHtml.includes('عنوان عربي'));
    assert.ok(articleHtml.includes('application/ld+json'));
    assert.ok(!existsSync(join(distPublic, 'unknown', 'index.html')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('escape helpers and json-ld safety', () => {
  assert.equal(escapeHtml('<x>'), '&lt;x&gt;');
  assert.equal(escapeAttr('"&"'), '&quot;&amp;&quot;');
  assert.ok(safeJsonLd({ a: '</script>' }).includes('\\u003c'));
  assert.equal(pickLocalized({ ar: 'أ', en: 'E' }, 'ar'), 'أ');
});
