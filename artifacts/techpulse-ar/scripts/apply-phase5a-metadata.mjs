#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const reportUrl = new URL('../../../docs/content-audit/phase3-content-audit.json', import.meta.url);
const sources = {
  article: [
    new URL('src/content/articles.json', root),
    new URL('src/content/articles-index.json', root),
  ],
  comparison: [new URL('src/content/comparisons.json', root)],
};

const readJson = async (url) => JSON.parse(await readFile(url, 'utf8'));
const report = await readJson(reportUrl);
const keepRecords = report.records.filter((record) => record.proposedDisposition === 'KEEP');

function explicitMetadata(record) {
  return {
    domainIds: record.inferredDomains,
    topicIds: record.inferredTopics,
    contentType: record.inferredContentType,
    vendorIds: record.inferredVendors,
    productIds: record.inferredProducts,
    technicalStatus: 'needs-review',
    translationStatus: 'unreviewed',
  };
}

for (const [source, urls] of Object.entries(sources)) {
  const expected = keepRecords.filter((record) => record.source === source);

  for (const url of urls) {
    const items = await readJson(url);
    const byId = new Map(items.map((item) => [item.id, item]));

    for (const record of expected) {
      const item = byId.get(record.id);
      if (!item || item.slug !== record.slug) {
        throw new Error(`Phase 5A source mismatch for ${record.id} (${record.slug}) in ${url.pathname}`);
      }
      Object.assign(item, explicitMetadata(record));
    }

    await writeFile(url, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
  }
}

console.log(`[phase5a] applied explicit metadata to ${keepRecords.length} KEEP records`);
