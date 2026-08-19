import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const [articles, index] = await Promise.all([
  readJson('../src/content/articles.json'),
  readJson('../src/content/articles-index.json'),
]);
const slug = 'chatgpt-study-without-harm';
const article = articles.find((item) => item.slug === slug);
const indexed = index.find((item) => item.slug === slug);

test('repositions the first REWORK item for professional technical use', () => {
  assert.ok(article);
  assert.equal(article.categoryId, 'cybersecurity');
  assert.deepEqual(article.domainIds, ['cybersecurity', 'infrastructure']);
  assert.deepEqual(article.topicIds, ['dlp']);
  assert.equal(article.contentType, 'guide');
  assert.equal(article.technicalStatus, 'needs-review');
  assert.equal(article.translationStatus, 'unreviewed');
});

test('provides substantial independent Arabic and English guidance', () => {
  assert.ok(article.body.ar.length > 2200);
  assert.ok(article.body.en.length > 2500);
  assert.match(article.body.ar, /???? ??? ???????/);
  assert.match(article.body.en, /outside production/);
  assert.doesNotMatch(article.body.en, /private tutor available 24 hours/i);
});

test('keeps list and full content metadata synchronized', () => {
  assert.ok(indexed);
  for (const key of ['title', 'excerpt', 'categoryId', 'subcategoryId', 'tags', 'readTime', 'domainIds', 'topicIds', 'contentType', 'vendorIds', 'productIds', 'difficulty', 'technicalStatus', 'translationStatus']) {
    assert.deepEqual(indexed[key], article[key], `index differs on ${key}`);
  }
  assert.equal('body' in indexed, false);
});
