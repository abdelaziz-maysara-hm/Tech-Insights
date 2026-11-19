import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const report = JSON.parse(readFileSync(new URL('../../../docs/i18n/phase4c-translation-audit.json', import.meta.url), 'utf8'));

test('keeps unreviewed editorial translations out of VALID_PAIR', () => {
  // Phase 9: AI-written independent English editions are flagged separately
  // (englishEdition) and must never be counted as human-reviewed.
  assert.equal(report.byType.articles.VALID_PAIR, report.byType.articles.humanReviewed);
  assert.equal(report.byType.comparisons.VALID_PAIR, report.byType.comparisons.humanReviewed);
  assert.equal(report.byType.staticPages.VALID_PAIR, 0);
  for (const record of [...report.records.articles, ...report.records.comparisons]) {
    if (record.independentEnglish && !record.humanReviewed) assert.notEqual(record.status, 'VALID_PAIR', record.slug);
  }
  assert.match(report.policy.independentEnglish, /not a human review/);
});

test('records the owner translation-quality finding', () => {
  assert.match(report.policy.currentOwnerFinding, /literal and technically unreliable/i);
  assert.match(report.policy.validPairGate, /human-reviewed/i);
});

test('preserves the complete known content inventory', () => {
  assert.equal(report.byType.articles.evaluated, 123); // Phase 7: +12 new, -28 merged/retired; Phase 8: +13 new; Phase 9: -3 redirected
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

