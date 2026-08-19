import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const [articles, index] = await Promise.all([readJson('../src/content/articles.json'), readJson('../src/content/articles-index.json')]);
const article = articles.find((item) => item.slug === 'how-ai-image-generation-works');
const indexed = index.find((item) => item.slug === article.slug);

test('repositions image generation around enterprise security controls', () => {
  assert.equal(article.categoryId, 'cybersecurity');
  assert.deepEqual(article.domainIds, ['cybersecurity']);
  assert.deepEqual(article.topicIds, ['dlp']);
  assert.equal(article.contentType, 'guide');
  assert.match(article.body.ar, /????? ????????/);
  assert.match(article.body.en, /Impersonation and misleading-media risk/);
  assert.match(article.body.en, /auditable approval workflow/);
});

test('provides substantial independent bodies with conservative review states', () => {
  assert.equal(article.technicalStatus, 'needs-review');
  assert.equal(article.translationStatus, 'unreviewed');
  assert.ok(article.body.ar.length > 3000);
  assert.ok(article.body.en.length > 3400);
  assert.doesNotMatch(article.body.en, /magic paintbrush/i);
});

test('keeps index metadata synchronized without a body', () => {
  for (const key of ['title', 'excerpt', 'categoryId', 'tags', 'readTime', 'domainIds', 'topicIds', 'contentType', 'difficulty', 'technicalStatus', 'translationStatus']) {
    assert.deepEqual(indexed[key], article[key], `index differs on ${key}`);
  }
  assert.equal('body' in indexed, false);
});
