import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getCanonicalLanguage,
  getLocalizedCanonicalPath,
  getProductionCanonicalUrl,
} from '../src/lib/seoUrl.ts';

test('builds Arabic and English localized production canonicals', () => {
  assert.equal(
    getProductionCanonicalUrl('/troubleshooting', '/ar/troubleshooting'),
    'https://netsecatlas.com/ar/troubleshooting',
  );
  assert.equal(
    getProductionCanonicalUrl('/troubleshooting', '/en/troubleshooting'),
    'https://netsecatlas.com/en/troubleshooting',
  );
});

test('removes query strings and hashes from canonical URLs', () => {
  assert.equal(
    getProductionCanonicalUrl('/search?q=dns#results', '/en/search?q=dns#results'),
    'https://netsecatlas.com/en/search',
  );
});

test('does not duplicate an existing language prefix', () => {
  assert.equal(
    getLocalizedCanonicalPath('/ar/vendors/fortinet', '/en/vendors/fortinet'),
    '/en/vendors/fortinet',
  );
});

test('uses deterministic Arabic canonicals for legacy unprefixed routes', () => {
  assert.equal(getCanonicalLanguage('/article/stable-slug'), 'ar');
  assert.equal(
    getProductionCanonicalUrl('/article/stable-slug', '/article/stable-slug'),
    'https://netsecatlas.com/ar/article/stable-slug',
  );
});

test('handles localized roots and deployment base paths', () => {
  assert.equal(getProductionCanonicalUrl('/', '/en/'), 'https://netsecatlas.com/en/');
  assert.equal(
    getProductionCanonicalUrl(
      '/Tech-Insights/vendors/fortinet?source=preview',
      '/Tech-Insights/ar/vendors/fortinet',
      '/Tech-Insights',
    ),
    'https://netsecatlas.com/ar/vendors/fortinet',
  );
});

test('always enforces the configured production domain', () => {
  assert.equal(
    getProductionCanonicalUrl('/guides', 'https://preview.example/en/guides'),
    'https://netsecatlas.com/en/guides',
  );
});
