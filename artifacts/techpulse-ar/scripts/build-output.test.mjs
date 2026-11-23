/**
 * Post-build checks on dist/public (run after `pnpm run build`).
 * Verifies what GitHub Pages will actually serve.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/public/', import.meta.url));
const read = (rel) => readFileSync(join(dist, rel), 'utf8');
const textOf = (html) => {
  const start = html.indexOf('<div id="root">');
  return html.slice(start).replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
};

/** File GitHub Pages serves for an extensionless URL path. */
function servedFile(pathname) {
  const clean = pathname.replace(/^\/+/, '');
  if (clean === '' ) return 'index.html';
  if (clean.endsWith('/')) return `${clean}index.html`;
  if (/\.[a-z0-9]+$/i.test(clean)) return clean;
  return existsSync(join(dist, `${clean}.html`)) ? `${clean}.html` : `${clean}/index.html`;
}

test('dist exists (run `pnpm run build` first)', () => {
  assert.ok(existsSync(join(dist, 'index.html')));
});

test('every sitemap URL resolves to a prerendered file with real body content', () => {
  const xml = read('sitemap.xml');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(urls.length > 400, `only ${urls.length} URLs`);
  for (const url of urls) {
    const { pathname } = new URL(url);
    const file = servedFile(pathname);
    if (!pathname.endsWith('/')) {
      assert.ok(existsSync(join(dist, `${pathname.slice(1)}.html`)), `missing 200 twin for ${pathname}`);
    }
    const html = read(file);
    assert.match(html, new RegExp(`<link rel="canonical" href="${url.replace(/[.?]/g, '\\$&')}" />`), url);
    assert.ok(textOf(html).length > 150, `thin static body for ${url}`);
  }
});

test('article pages contain the full article text in static HTML (ar and en)', () => {
  for (const lang of ['ar', 'en']) {
    const html = read(`${lang}/article/2fa-practical-guide.html`);
    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.ok(textOf(html).split(' ').length > 400);
    assert.match(html, /<h1>/);
    assert.match(html, /<h2>/);
  }
});

test('every RSS item link resolves to a built page', () => {
  for (const feed of ['rss.xml', 'ar/rss.xml', 'en/rss.xml']) {
    const xml = read(feed);
    const links = [...xml.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>/g)].map((m) => m[1]);
    assert.equal(links.length, 50, feed);
    for (const link of links) {
      const file = servedFile(new URL(link).pathname);
      assert.ok(existsSync(join(dist, file)), `${feed}: ${link} → ${file}`);
    }
  }
});

test('legacy un-prefixed URLs forward to /ar/ canonicals', () => {
  const html = read('article/2fa-practical-guide.html');
  assert.match(html, /url=\/ar\/article\/2fa-practical-guide/);
  assert.ok(existsSync(join(dist, 'articles.html')));
});

test('root page is crawlable and 404 page is noindex', () => {
  const root = read('index.html');
  assert.match(root, /<link rel="canonical" href="https:\/\/netsecatlas.com\/ar\/" \/>/);
  assert.ok(textOf(root).length > 500);
  assert.match(read('404.html'), /<meta name="robots" content="noindex, follow" \/>/);
});


function walkHtml(dir, rel = '') {
  const out = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'downloads' || ent.name === 'assets' || ent.name === 'icons' || ent.name.startsWith('.')) continue;
    const next = rel ? `${rel}/${ent.name}` : ent.name;
    if (ent.isDirectory()) out.push(...walkHtml(join(dir, ent.name), next));
    else if (ent.name.endsWith('.html')) out.push(next);
  }
  return out;
}

function isRedirectStub(html) {
  return /http-equiv=["']refresh["']/i.test(html) || /<script>location\.replace\(/.test(html);
}

function robotsContent(html) {
  const m = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
  return m ? m[1].toLowerCase() : '';
}

function canonicalHref(html) {
  const m = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  return m ? m[1] : '';
}

test('search pages exist in both languages and are noindex', () => {
  for (const lang of ['ar', 'en']) {
    const html = read(`${lang}/search/index.html`);
    assert.match(robotsContent(html), /noindex/);
    assert.ok(!isRedirectStub(html));
  }
});

test('IndexNow key file is deployed at the site root', () => {
  const key = '13a10f8dd925f0cae8bb47017b2b8ba2';
  assert.equal(read(`${key}.txt`).trim(), key);
});

test('prerendered indexable pages are all listed in the sitemap', () => {
  const xml = read('sitemap.xml');
  const sitemap = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  const indexable = new Set();
  for (const rel of walkHtml(dist)) {
    if (rel === '404.html') continue;
    const html = read(rel);
    if (isRedirectStub(html)) continue;
    if (/\bnoindex\b/.test(robotsContent(html))) continue;
    const canonical = canonicalHref(html);
    if (!/^https:\/\/netsecatlas\.com\/(ar|en)\//.test(canonical)) continue;
    indexable.add(canonical);
  }
  const missing = [...indexable].filter((url) => !sitemap.has(url)).sort();
  assert.equal(missing.length, 0, `indexable pages missing from sitemap: ${missing.slice(0, 20).join(', ')}`);
});

test('every sitemap URL is a 200 indexable prerendered page, not a redirect or noindex', () => {
  const xml = read('sitemap.xml');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(!urls.some((u) => u.includes('/search')));
  for (const url of urls) {
    const { pathname } = new URL(url);
    const file = servedFile(pathname);
    assert.ok(existsSync(join(dist, file)), `sitemap URL has no built file (would not be 200): ${url}`);
    const html = read(file);
    assert.ok(!isRedirectStub(html), `sitemap lists a redirect-only URL: ${url}`);
    assert.ok(!/\bnoindex\b/.test(robotsContent(html)), `sitemap lists a noindex URL: ${url}`);
    assert.match(html, /<meta name="robots" content="index, follow" \/>/);
  }
});
