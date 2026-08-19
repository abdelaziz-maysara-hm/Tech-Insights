import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const xml = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const arLocations = locations.filter((location) => location.startsWith('https://netsecatlas.com/ar/'));
const enLocations = locations.filter((location) => location.startsWith('https://netsecatlas.com/en/'));

test('emits only unique localized production canonical locations', () => {
  assert.equal(locations.length, 267);
  assert.equal(new Set(locations).size, locations.length);
  assert.equal(arLocations.length, 241);
  assert.equal(enLocations.length, 26);
  assert.ok(locations.every((location) => /^https:\/\/netsecatlas\.com\/(ar|en)\//.test(location)));
});

test('excludes legacy, query-filter, and unreviewed English content URLs', () => {
  assert.ok(!locations.some((location) => location.includes('?')));
  assert.ok(!locations.some((location) => /netsecatlas\.com\/(article|comparison|page)\//.test(location)));
  assert.ok(!enLocations.some((location) => /\/en\/(article|comparison|page)\//.test(location)));
});

test('adds reciprocal XHTML alternates only to eligible pairs', () => {
  assert.match(xml, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
  const urlBlocks = [...xml.matchAll(/<url>\s*([\s\S]*?)\s*<\/url>/g)].map((match) => match[1]);
  const eligibleBlocks = urlBlocks.filter((block) => block.includes('xhtml:link'));
  assert.equal(eligibleBlocks.length, 52);
  for (const block of eligibleBlocks) {
    assert.equal((block.match(/hreflang="ar"/g) ?? []).length, 1);
    assert.equal((block.match(/hreflang="en"/g) ?? []).length, 1);
    assert.equal((block.match(/hreflang="x-default"/g) ?? []).length, 1);
  }
});

test('uses Arabic localized canonicals for x-default', () => {
  const defaults = [...xml.matchAll(/hreflang="x-default" href="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(defaults.length, 52);
  assert.ok(defaults.every((href) => href.startsWith('https://netsecatlas.com/ar/')));
});

test('contains no forbidden or malformed SEO hosts and paths', () => {
  assert.doesNotMatch(xml, /localhost|vercel|technical-insights\.com|\/ar\/ar\/|\/en\/en\//i);
});
