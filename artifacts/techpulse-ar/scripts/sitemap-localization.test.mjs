import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const xml = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
const readJson = (rel) => JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'));
const policy = readJson('../src/config/hreflang-policy.json');
const articles = readJson('../src/content/articles.json');
const comparisons = readJson('../src/content/comparisons.json');
const pages = readJson('../src/content/pages.json');
const webTools = []; // on-site web tools were removed 2026-11-21; calculators live in the desktop app / Adawaty

const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const arLocations = locations.filter((location) => location.startsWith('https://netsecatlas.com/ar/'));
const enLocations = locations.filter((location) => location.startsWith('https://netsecatlas.com/en/'));

// 13 fixed sections + vendor hubs from policy + tools + every content item.
const BASE_ROUTES = 14; // + /alternatives
const vendorHubs = policy.eligibleDiscoveryRoutes.filter((p) => p.startsWith('/vendors/')).length;
const contentItems = [...articles, ...comparisons, ...pages].filter((item) => item?.slug);
const englishContent = contentItems.filter((item) =>
  item.translationStatus === 'reviewed'
  || (policy.publishUnreviewedTranslations === true && item.translationStatus !== 'invalid'));
// Phase 7: every playlist and video page is published in both languages.
const videoRoutes = JSON.parse(readFileSync(new URL('../src/content/videos.json', import.meta.url), 'utf8')).length
  + JSON.parse(readFileSync(new URL('../src/content/video-playlists.json', import.meta.url), 'utf8')).length;
const expectedAr = BASE_ROUTES + vendorHubs + webTools.length + contentItems.length + videoRoutes;
const expectedEn = policy.eligibleDiscoveryRoutes.length + englishContent.length + videoRoutes;

test('emits only unique localized production canonical locations', () => {
  assert.equal(arLocations.length, expectedAr);
  assert.equal(enLocations.length, expectedEn);
  assert.equal(locations.length, expectedAr + expectedEn);
  assert.equal(new Set(locations).size, locations.length);
  assert.ok(locations.every((location) => /^https:\/\/netsecatlas\.com\/(ar|en)\//.test(location)));
});

test('excludes legacy and query-filter URLs', () => {
  assert.ok(!locations.some((location) => location.includes('?')));
  assert.ok(!locations.some((location) => /netsecatlas\.com\/(article|comparison|page)\//.test(location)));
});

test('lists English content URLs exactly when the translation policy publishes them', () => {
  const enContent = enLocations.filter((location) => /\/en\/(article|comparison|page)\//.test(location));
  assert.equal(enContent.length, englishContent.length);
  const enSet = new Set(enLocations);
  for (const item of articles.filter((a) => englishContent.includes(a))) {
    assert.ok(enSet.has(`https://netsecatlas.com/en/article/${item.slug}`), item.slug);
  }
  if (policy.publishUnreviewedTranslations === true) {
    assert.ok(enLocations.includes('https://netsecatlas.com/en/article/2fa-practical-guide'));
  }
});

test('adds reciprocal XHTML alternates only to eligible pairs', () => {
  assert.match(xml, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
  const urlBlocks = [...xml.matchAll(/<url>\s*([\s\S]*?)\s*<\/url>/g)].map((match) => match[1]);
  const eligibleBlocks = urlBlocks.filter((block) => block.includes('xhtml:link'));
  // Every English URL has an Arabic twin, and both carry the alternates.
  assert.equal(eligibleBlocks.length, expectedEn * 2);
  for (const block of eligibleBlocks) {
    assert.equal((block.match(/hreflang="ar"/g) ?? []).length, 1);
    assert.equal((block.match(/hreflang="en"/g) ?? []).length, 1);
    assert.equal((block.match(/hreflang="x-default"/g) ?? []).length, 1);
  }
  const ineligible = urlBlocks.filter((block) => !block.includes('xhtml:link'));
  assert.ok(ineligible.every((block) => block.includes('/ar/')));
});

test('uses Arabic localized canonicals for x-default', () => {
  const defaults = [...xml.matchAll(/hreflang="x-default" href="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(defaults.length, expectedEn * 2);
  assert.ok(defaults.every((href) => href.startsWith('https://netsecatlas.com/ar/')));
});

test('contains no forbidden or malformed SEO hosts and paths', () => {
  assert.doesNotMatch(xml, /localhost|vercel|technical-insights\.com|\/ar\/ar\/|\/en\/en\//i);
});
