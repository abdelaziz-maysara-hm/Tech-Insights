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
  extractLocUrls,
  generateStaticRouteFallbacks,
  pathnameFromProductionUrl,
  resolveRouteIndexPath,
  routeDirFromPathname,
} from './generate-static-route-fallbacks.mjs';

test('extractLocUrls reads every loc entry', () => {
  const xml = `<?xml version="1.0"?>
  <urlset>
    <url><loc>https://netsecatlas.com/ar/</loc></url>
    <url><loc>https://netsecatlas.com/en/articles</loc></url>
  </urlset>`;
  assert.deepEqual(extractLocUrls(xml), [
    'https://netsecatlas.com/ar/',
    'https://netsecatlas.com/en/articles',
  ]);
});

test('pathnameFromProductionUrl accepts production origin only', () => {
  assert.equal(pathnameFromProductionUrl('https://netsecatlas.com/ar/'), '/ar/');
  assert.equal(pathnameFromProductionUrl('https://netsecatlas.com/en/articles'), '/en/articles');
  assert.equal(pathnameFromProductionUrl('https://netsecatlas.com/ar/articles?x=1#y'), '/ar/articles');
  assert.equal(pathnameFromProductionUrl('https://evil.example/ar/'), null);
  assert.equal(pathnameFromProductionUrl('http://netsecatlas.com/ar/'), '/ar/');
  assert.equal(pathnameFromProductionUrl('not-a-url'), null);
});

test('routeDirFromPathname normalizes trailing slashes and root', () => {
  assert.deepEqual(routeDirFromPathname('/'), { ok: true, relativeDir: '' });
  assert.deepEqual(routeDirFromPathname('/ar/'), { ok: true, relativeDir: 'ar' });
  assert.deepEqual(routeDirFromPathname('/ar'), { ok: true, relativeDir: 'ar' });
  assert.deepEqual(routeDirFromPathname('/ar/articles'), { ok: true, relativeDir: 'ar/articles' });
  assert.deepEqual(routeDirFromPathname('/en/articles/example-slug'), {
    ok: true,
    relativeDir: 'en/articles/example-slug',
  });
  assert.deepEqual(routeDirFromPathname('/ar//articles'), { ok: true, relativeDir: 'ar/articles' });
});

test('routeDirFromPathname rejects traversal', () => {
  assert.equal(routeDirFromPathname('/ar/../etc/passwd').ok, false);
  assert.equal(routeDirFromPathname('/ar/%2e%2e/secret').ok, false);
  assert.equal(pathnameFromProductionUrl('https://netsecatlas.com/ar/%2e%2e/secret'), null);
  assert.equal(pathnameFromProductionUrl('https://netsecatlas.com/ar/../escape'), null);
});

test('resolveRouteIndexPath stays under dist public', () => {
  const base = '/tmp/dist-public-test';
  assert.equal(resolveRouteIndexPath(base, 'ar'), join(base, 'ar', 'index.html'));
  assert.equal(resolveRouteIndexPath(base, ''), join(base, 'index.html'));
  assert.equal(resolveRouteIndexPath(base, '../escape'), null);
});

test('generateStaticRouteFallbacks writes SPA shells for sitemap routes', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nsa-static-routes-'));
  try {
    const distPublic = join(dir, 'public');
    mkdirSync(distPublic, { recursive: true });
    const shell = '<!doctype html><html><body>SPA_SHELL</body></html>\n';
    writeFileSync(join(distPublic, 'index.html'), shell, 'utf8');

    const xml = `<?xml version="1.0"?>
    <urlset>
      <url><loc>https://netsecatlas.com/ar/</loc></url>
      <url><loc>https://netsecatlas.com/en/</loc></url>
      <url><loc>https://netsecatlas.com/ar/</loc></url>
      <url><loc>https://netsecatlas.com/ar/articles</loc></url>
      <url><loc>https://netsecatlas.com/en/articles/example-slug</loc></url>
      <url><loc>https://netsecatlas.com/ar/articles/</loc></url>
      <url><loc>https://evil.example/ar/hack</loc></url>
      <url><loc>https://netsecatlas.com/ar/../escape</loc></url>
      <url><loc>https://netsecatlas.com/</loc></url>
    </urlset>`;

    const result = generateStaticRouteFallbacks({
      distPublic,
      sitemapXml: xml,
    });

    assert.equal(result.sitemapUrls, 9);
    assert.equal(result.written, 4);
    assert.ok(result.skippedRoot >= 1);
    assert.ok(result.skippedDuplicate >= 1);
    assert.ok(result.rejected.some((r) => r.reason === 'foreign-or-invalid-url'));
    assert.ok(
      result.rejected.some((r) => r.reason === 'foreign-or-invalid-url' && r.url.includes('..')),
    );

    assert.equal(readFileSync(join(distPublic, 'index.html'), 'utf8'), shell);
    assert.equal(readFileSync(join(distPublic, 'ar', 'index.html'), 'utf8'), shell);
    assert.equal(readFileSync(join(distPublic, 'en', 'index.html'), 'utf8'), shell);
    assert.equal(readFileSync(join(distPublic, 'ar', 'articles', 'index.html'), 'utf8'), shell);
    assert.equal(
      readFileSync(join(distPublic, 'en', 'articles', 'example-slug', 'index.html'), 'utf8'),
      shell,
    );
    assert.equal(existsSync(join(distPublic, 'escape', 'index.html')), false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('idempotent re-run does not corrupt shell', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nsa-static-routes-idem-'));
  try {
    const distPublic = join(dir, 'public');
    mkdirSync(distPublic, { recursive: true });
    writeFileSync(join(distPublic, 'index.html'), 'SHELL_V1\n', 'utf8');
    const xml = `<urlset><url><loc>https://netsecatlas.com/ar/guides</loc></url></urlset>`;
    generateStaticRouteFallbacks({ distPublic, sitemapXml: xml });
    generateStaticRouteFallbacks({ distPublic, sitemapXml: xml });
    assert.equal(readFileSync(join(distPublic, 'ar', 'guides', 'index.html'), 'utf8'), 'SHELL_V1\n');
    assert.equal(readFileSync(join(distPublic, 'index.html'), 'utf8'), 'SHELL_V1\n');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
