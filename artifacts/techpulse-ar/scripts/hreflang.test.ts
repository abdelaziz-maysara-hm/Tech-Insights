import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getCanonicalRouteIdentity,
  getHreflangAlternates,
  isDiscoveryRouteHreflangEligible,
  isHreflangEligible,
  replaceHreflangLinks,
} from '../src/lib/hreflang.ts';

test('keeps current content states ineligible', () => {
  assert.equal(isHreflangEligible('/ar/article/2fa-practical-guide'), false);
  assert.equal(isHreflangEligible('/en/comparison/iphone-16-vs-galaxy-s25'), false);
  assert.equal(isHreflangEligible('/page/privacy'), false);
});

test('allows only an explicit reviewed content fixture', () => {
  assert.equal(isHreflangEligible('/article/reviewed-fixture', 'reviewed'), true);
  assert.equal(isHreflangEligible('/article/review-fixture', 'unreviewed'), false);
  assert.equal(isHreflangEligible('/article/invalid-fixture', 'invalid'), false);
});

test('creates reciprocal production alternates and Arabic x-default', () => {
  assert.deepEqual(getHreflangAlternates('/en/article/reviewed-fixture?x=1#top', true), [
    { hreflang: 'ar', href: 'https://netsecatlas.com/ar/article/reviewed-fixture' },
    { hreflang: 'en', href: 'https://netsecatlas.com/en/article/reviewed-fixture' },
    { hreflang: 'x-default', href: 'https://netsecatlas.com/ar/article/reviewed-fixture' },
  ]);
});

test('approves maintained discovery classes but not query-driven search or videos', () => {
  for (const route of ['/', '/troubleshooting', '/guides', '/tools', '/vendors', '/vendors/fortinet', '/articles', '/comparisons', '/domain/networking', '/categories']) {
    assert.equal(isDiscoveryRouteHreflangEligible(route), true, route);
  }
  assert.equal(isDiscoveryRouteHreflangEligible('/search'), false);
  assert.equal(isDiscoveryRouteHreflangEligible('/videos'), false);
});

test('normalizes localized and legacy routes without duplicate prefixes', () => {
  assert.equal(getCanonicalRouteIdentity('/ar/ar/tools?source=preview'), '/ar/tools');
  const alternates = getHreflangAlternates('/en/vendors/fortinet#details', true);
  assert.ok(alternates.every(({ href }) => !href.includes('/ar/ar/') && !href.includes('/en/en/')));
  assert.ok(alternates.every(({ href }) => href.startsWith('https://netsecatlas.com/')));
});

test('returns no alternate descriptors for an ineligible route', () => {
  assert.deepEqual(getHreflangAlternates('/article/unreviewed', false), []);
});

test('replaces stale head alternates across SPA eligibility transitions', () => {
  const children: Array<Record<string, unknown> & { remove: () => void }> = [];
  const head = {
    querySelectorAll: () => children.filter((item) => item.dataset),
    appendChild: (item: (typeof children)[number]) => children.push(item),
  };
  globalThis.document = {
    head,
    createElement: () => {
      const item: Record<string, unknown> & { remove: () => void } = {
        dataset: {},
        remove: () => children.splice(children.indexOf(item), 1),
      };
      return item;
    },
  } as unknown as Document;

  replaceHreflangLinks(getHreflangAlternates('/tools', true));
  assert.deepEqual(children.map((item) => item.hreflang), ['ar', 'en', 'x-default']);
  replaceHreflangLinks([]);
  assert.equal(children.length, 0);
  replaceHreflangLinks(getHreflangAlternates('/vendors/fortinet', true));
  assert.equal(children.length, 3);
  assert.equal(new Set(children.map((item) => item.hreflang)).size, 3);
});
