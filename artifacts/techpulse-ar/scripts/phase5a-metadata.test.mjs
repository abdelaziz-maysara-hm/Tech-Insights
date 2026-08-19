import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));

const [report, articles, articleIndex, comparisons] = await Promise.all([
  readJson('../../../docs/content-audit/phase3-content-audit.json'),
  readJson('../src/content/articles.json'),
  readJson('../src/content/articles-index.json'),
  readJson('../src/content/comparisons.json'),
]);

const keepRecords = report.records.filter((record) => record.proposedDisposition === 'KEEP');
const sourceMaps = {
  article: [new Map(articles.map((item) => [item.id, item])), new Map(articleIndex.map((item) => [item.id, item]))],
  comparison: [new Map(comparisons.map((item) => [item.id, item]))],
};

test('the Phase 3 KEEP inventory remains stable', () => {
  assert.equal(keepRecords.length, 100);
  assert.equal(keepRecords.filter((record) => record.source === 'article').length, 99);
  assert.equal(keepRecords.filter((record) => record.source === 'comparison').length, 1);
});

test('every KEEP record carries exact explicit audit metadata', () => {
  for (const record of keepRecords) {
    for (const sourceMap of sourceMaps[record.source]) {
      const item = sourceMap.get(record.id);
      assert.ok(item, `missing ${record.source} ${record.id}`);
      assert.equal(item.slug, record.slug);
      assert.deepEqual(item.domainIds, record.inferredDomains);
      assert.deepEqual(item.topicIds, record.inferredTopics);
      assert.equal(item.contentType, record.inferredContentType);
      assert.deepEqual(item.vendorIds, record.inferredVendors);
      assert.deepEqual(item.productIds, record.inferredProducts);
      assert.equal(item.technicalStatus, 'needs-review');
      assert.equal(item.translationStatus, 'unreviewed');
    }
  }
});

test('article index metadata matches the full article source', () => {
  const fullById = new Map(articles.map((item) => [item.id, item]));
  for (const record of keepRecords.filter((item) => item.source === 'article')) {
    const full = fullById.get(record.id);
    const indexed = articleIndex.find((item) => item.id === record.id);
    for (const key of ['domainIds', 'topicIds', 'contentType', 'vendorIds', 'productIds', 'technicalStatus', 'translationStatus']) {
      assert.deepEqual(indexed[key], full[key], `${record.id} differs on ${key}`);
    }
  }
});
