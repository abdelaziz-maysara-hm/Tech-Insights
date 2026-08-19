import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getLegacyRedirectTarget,
  isSupportedLegacyRoute,
} from '../src/lib/legacyRedirect.ts';

test('redirects supported legacy discovery and content routes to Arabic', () => {
  assert.equal(getLegacyRedirectTarget('/articles'), '/ar/articles');
  assert.equal(getLegacyRedirectTarget('/article/example-slug'), '/ar/article/example-slug');
  assert.equal(getLegacyRedirectTarget('/vendors/cisco'), '/ar/vendors/cisco');
  assert.equal(getLegacyRedirectTarget('/'), '/ar/');
});

test('preserves query strings and fragments', () => {
  assert.equal(
    getLegacyRedirectTarget('/search?q=zero+trust#results'),
    '/ar/search?q=zero+trust#results',
  );
});

test('does not redirect localized, unsupported, or malformed routes', () => {
  assert.equal(getLegacyRedirectTarget('/ar/articles'), null);
  assert.equal(getLegacyRedirectTarget('/en/articles'), null);
  assert.equal(getLegacyRedirectTarget('/fr/articles'), null);
  assert.equal(getLegacyRedirectTarget('/unknown'), null);
  assert.equal(getLegacyRedirectTarget('/article/one/two'), null);
});

test('supports repository base paths without duplicating them', () => {
  assert.equal(
    getLegacyRedirectTarget('/Tech-Insights/tools?tab=dns', '/Tech-Insights'),
    '/Tech-Insights/ar/tools?tab=dns',
  );
  assert.equal(
    getLegacyRedirectTarget('/Tech-Insights/en/tools', '/Tech-Insights'),
    null,
  );
});

test('recognizes only the maintained legacy route surface', () => {
  assert.equal(isSupportedLegacyRoute('/comparison/a-vs-b'), true);
  assert.equal(isSupportedLegacyRoute('/domain/network-security'), true);
  assert.equal(isSupportedLegacyRoute('/api/cms/content'), false);
  assert.equal(isSupportedLegacyRoute('/assets/app.js'), false);
});
