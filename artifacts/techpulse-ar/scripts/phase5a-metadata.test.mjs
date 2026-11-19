import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));

const [report, articles, articleIndex, comparisons, contentRedirects] = await Promise.all([
  readJson('../../../docs/content-audit/phase3-content-audit.json'),
  readJson('../src/content/articles.json'),
  readJson('../src/content/articles-index.json'),
  readJson('../src/content/comparisons.json'),
  readJson('../src/config/content-redirects.json'),
]);

const allKeepRecords = report.records.filter((record) => record.proposedDisposition === 'KEEP');
// Phase 7 merged some KEEP items into stronger pages (or retired off-topic
// ones); those are covered by a permanent redirect instead of a record.
const redirectPath = (record) => `/${record.source}/${record.slug}`;
const redirectedKeep = allKeepRecords.filter((record) => contentRedirects.redirects[redirectPath(record)]);
const keepRecords = allKeepRecords.filter((record) => !contentRedirects.redirects[redirectPath(record)]);
const sourceMaps = {
  article: [new Map(articles.map((item) => [item.id, item])), new Map(articleIndex.map((item) => [item.id, item]))],
  comparison: [new Map(comparisons.map((item) => [item.id, item]))],
};

test('the Phase 5A KEEP baseline does not regress as REWORK content improves', () => {
  assert.ok(allKeepRecords.length >= 100);
  assert.ok(keepRecords.filter((record) => record.source === 'article').length >= 85);
  assert.ok(keepRecords.filter((record) => record.source === 'comparison').length >= 1);
});

test('every merged or retired KEEP record redirects to live content', () => {
  const liveArticles = new Set(articles.map((item) => item.slug));
  for (const record of redirectedKeep) {
    const target = contentRedirects.redirects[redirectPath(record)];
    assert.ok(!liveArticles.has(record.slug), `${record.slug} redirected but still published`);
    const m = target.match(/^\/article\/(.+)$/);
    if (m) assert.ok(liveArticles.has(m[1]), `${record.slug} -> missing ${target}`);
  }
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
      assert.ok(['unreviewed', 'reviewed'].includes(item.translationStatus), `${item.slug} translationStatus`);
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
