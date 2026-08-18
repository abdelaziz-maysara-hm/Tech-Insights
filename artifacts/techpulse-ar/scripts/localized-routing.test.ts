import assert from 'node:assert/strict';
import test from 'node:test';
import {
  detectLanguageFromPath,
  getEquivalentLocalizedPath,
  localizePath,
  normalizeBasePath,
  removeBasePath,
  stripLanguagePrefix,
} from '../src/lib/localizedRouting.ts';

test('detects only supported language prefixes', () => {
  assert.equal(detectLanguageFromPath('/ar/guides'), 'ar');
  assert.equal(detectLanguageFromPath('/en/guides?topic=dns'), 'en');
  assert.equal(detectLanguageFromPath('/fr/guides'), null);
  assert.equal(detectLanguageFromPath('/articles'), null);
});

test('strips a supported prefix and preserves query and hash', () => {
  assert.equal(stripLanguagePrefix('/en/search?q=dns#results'), '/search?q=dns#results');
  assert.equal(stripLanguagePrefix('/ar/'), '/');
  assert.equal(stripLanguagePrefix('/fr/search?q=dns'), '/fr/search?q=dns');
});

test('adds or replaces the language prefix', () => {
  assert.equal(localizePath('/guides', 'en'), '/en/guides');
  assert.equal(localizePath('/ar/guides', 'en'), '/en/guides');
  assert.equal(localizePath('/en/', 'ar'), '/ar/');
});

test('switches the equivalent route without losing query or hash', () => {
  assert.equal(
    getEquivalentLocalizedPath('/ar/article/dns?view=full#steps', 'en'),
    '/en/article/dns?view=full#steps',
  );
});

test('supports deployment base paths', () => {
  assert.equal(normalizeBasePath('/Tech-Insights/'), '/Tech-Insights');
  assert.equal(removeBasePath('/Tech-Insights/en/tools', '/Tech-Insights'), '/en/tools');
  assert.equal(detectLanguageFromPath('/Tech-Insights/en/tools', '/Tech-Insights'), 'en');
  assert.equal(
    stripLanguagePrefix('/Tech-Insights/en/tools?q=ping', '/Tech-Insights'),
    '/Tech-Insights/tools?q=ping',
  );
  assert.equal(
    localizePath('/Tech-Insights/ar/tools?q=ping', 'en', '/Tech-Insights'),
    '/Tech-Insights/en/tools?q=ping',
  );
});
