import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const APP_PATH = new URL('../src/App.tsx', import.meta.url);
const SEO_PATH = new URL('../src/hooks/useSEO.ts', import.meta.url);
const NOT_FOUND_PATH = new URL('../src/pages/not-found.tsx', import.meta.url);
const SITEMAP_PATH = new URL('../public/sitemap.xml', import.meta.url);
const RSS_PATH = new URL('../public/rss.xml', import.meta.url);

const expectedRoutes = [
  '/', '/articles', '/article/:slug', '/comparisons', '/comparison/:slug',
  '/videos', '/categories', '/search', '/page/:slug', '/troubleshooting',
  '/guides', '/tools', '/vendors/:vendor', '/vendors', '/domain/:domain',
];

test('keeps the complete route surface with the catch-all last', async () => {
  const app = await readFile(APP_PATH, 'utf8');
  for (const route of expectedRoutes) {
    assert.ok(app.includes(`<Route path="${route}"`), `missing route ${route}`);
  }
  assert.ok(app.lastIndexOf('<Route component={NotFound}') > app.lastIndexOf('<Route path='));
});

test('marks not-found pages noindex and removes canonical structured signals', async () => {
  const [seo, notFound] = await Promise.all([
    readFile(SEO_PATH, 'utf8'),
    readFile(NOT_FOUND_PATH, 'utf8'),
  ]);
  assert.match(notFound, /indexable:\s*false/);
  assert.match(notFound, /?????? ??? ??????/);
  assert.match(seo, /noindex, nofollow/);
  assert.match(seo, /link\[rel="canonical"\]/);
  assert.match(seo, /replaceHreflangLinks\(\[\]\)/);
  assert.match(seo, /upsertJsonLd\('jsonld-website', null\)/);
});

test('keeps sitemap canonical-only and production-domain consistent', async () => {
  const sitemap = await readFile(SITEMAP_PATH, 'utf8');
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(locations.length, 267);
  assert.equal(new Set(locations).size, locations.length);
  assert.ok(locations.every((url) => /^https:\/\/netsecatlas\.com\/(ar|en)\//.test(url)));
  assert.doesNotMatch(sitemap, /technical-insights\.com/i);
});

test('keeps RSS on the production domain without legacy-host regression', async () => {
  const rss = await readFile(RSS_PATH, 'utf8');
  assert.match(rss, /https:\/\/netsecatlas\.com/);
  assert.doesNotMatch(rss, /technical-insights\.com/i);
  assert.equal([...rss.matchAll(/<item>/g)].length, 50);
});
