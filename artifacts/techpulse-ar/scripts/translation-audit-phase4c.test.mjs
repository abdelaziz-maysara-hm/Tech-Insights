import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const report = JSON.parse(readFileSync(new URL('../../../docs/i18n/phase4c-translation-audit.json', import.meta.url), 'utf8'));

test('keeps unreviewed editorial translations out of VALID_PAIR', () => {
  // Phase 8: only articles whose English was rewritten as an independent piece carry
  // translationStatus 'reviewed'; every VALID_PAIR must be one of them.
  const articles = JSON.parse(readFileSync(new URL('../src/content/articles.json', import.meta.url), 'utf8'));
  const reviewed = new Set(articles.filter((a) => a.translationStatus === 'reviewed').map((a) => a.slug));
  const validArticles = report.records.articles.filter((r) => r.status === 'VALID_PAIR');
  assert.equal(report.byType.articles.VALID_PAIR, validArticles.length);
  for (const r of validArticles) assert.ok(reviewed.has(r.slug), `${r.slug} VALID without rewrite`);
  assert.equal(report.byType.comparisons.VALID_PAIR, 0);
  assert.equal(report.byType.staticPages.VALID_PAIR, 0);
});

test('records the owner translation-quality finding', () => {
  assert.match(report.policy.currentOwnerFinding, /literal and technically unreliable/i);
  assert.match(report.policy.validPairGate, /human-reviewed/i);
});

test('preserves the complete known content inventory', () => {
  assert.equal(report.byType.articles.evaluated, 126); // Phase 7: +12 new, -28 merged/retired; Phase 8: +13 new
  assert.equal(report.byType.comparisons.evaluated, 69); // Phase 8: chatgpt-vs-claude redirected
  assert.equal(report.byType.staticPages.evaluated, 10);
});

test('provides a reason and confidence for every classified pair', () => {
  for (const group of Object.values(report.records)) {
    for (const record of group) {
      assert.ok(record.reason);
      assert.ok(record.confidence);
    }
  }
});

