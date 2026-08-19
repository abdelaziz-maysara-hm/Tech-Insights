import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const [articles, index] = await Promise.all([readJson('../src/content/articles.json'), readJson('../src/content/articles-index.json')]);
const article = articles.find((item) => item.slug === 'effective-ai-prompting-guide');
const indexed = index.find((item) => item.slug === article.slug);

test('turns generic prompting into evidence-led technical troubleshooting', () => {
  assert.equal(article.categoryId, 'cybersecurity');
  assert.deepEqual(article.domainIds, ['cybersecurity', 'infrastructure', 'troubleshooting']);
  assert.deepEqual(article.topicIds, ['dlp']);
  assert.equal(article.contentType, 'troubleshooting');
  assert.match(article.body.ar, /فحوص قراءة فقط/);
  assert.match(article.body.en, /read-only checks/);
});

test('keeps conservative review states and substantial independent bodies', () => {
  assert.equal(article.technicalStatus, 'needs-review');
  assert.equal(article.translationStatus, 'unreviewed');
  assert.ok(article.body.ar.length > 2400);
  assert.ok(article.body.en.length > 2600);
  assert.doesNotMatch(article.body.en, /think step by step/i);
});

test('synchronizes list metadata without shipping the body', () => {
  for (const key of ['title', 'excerpt', 'categoryId', 'tags', 'readTime', 'domainIds', 'topicIds', 'contentType', 'difficulty', 'technicalStatus', 'translationStatus']) {
    assert.deepEqual(indexed[key], article[key], `index differs on ${key}`);
  }
  assert.equal('body' in indexed, false);
});
