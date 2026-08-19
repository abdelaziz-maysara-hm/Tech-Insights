import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const [articles, index] = await Promise.all([readJson('../src/content/articles.json'), readJson('../src/content/articles-index.json')]);
const article = articles.find((item) => item.slug === 'how-large-language-models-work');
const indexed = index.find((item) => item.slug === article.slug);

test('repositions the LLM explainer for enterprise IT and security', () => {
  assert.equal(article.categoryId, 'cybersecurity');
  assert.deepEqual(article.domainIds, ['cybersecurity', 'infrastructure']);
  assert.deepEqual(article.topicIds, ['dlp']);
  assert.equal(article.contentType, 'concept');
  assert.match(article.body.ar, /???? ??????? ???/);
  assert.match(article.body.en, /Retrieval-Augmented Generation/);
  assert.match(article.body.en, /rollback/);
});

test('keeps review status conservative and both bodies substantial', () => {
  assert.equal(article.technicalStatus, 'needs-review');
  assert.equal(article.translationStatus, 'unreviewed');
  assert.ok(article.body.ar.length > 2600);
  assert.ok(article.body.en.length > 2800);
  assert.doesNotMatch(article.body.en, /in the traditional sense/i);
});

test('synchronizes index metadata and excludes full bodies', () => {
  for (const key of ['title', 'excerpt', 'categoryId', 'tags', 'readTime', 'domainIds', 'topicIds', 'contentType', 'difficulty', 'technicalStatus', 'translationStatus']) {
    assert.deepEqual(indexed[key], article[key], `index differs on ${key}`);
  }
  assert.equal('body' in indexed, false);
});
