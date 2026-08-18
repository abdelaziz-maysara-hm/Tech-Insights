import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const report = JSON.parse(readFileSync(new URL('../../../docs/i18n/phase4c-translation-audit.json', import.meta.url), 'utf8'));

test('keeps unreviewed editorial translations out of VALID_PAIR', () => {
  assert.equal(report.byType.articles.VALID_PAIR, 0);
  assert.equal(report.byType.comparisons.VALID_PAIR, 0);
  assert.equal(report.byType.staticPages.VALID_PAIR, 0);
});

test('records the owner translation-quality finding', () => {
  assert.match(report.policy.currentOwnerFinding, /literal and technically unreliable/i);
  assert.match(report.policy.validPairGate, /human-reviewed/i);
});

test('preserves the complete known content inventory', () => {
  assert.equal(report.byType.articles.evaluated, 129);
  assert.equal(report.byType.comparisons.evaluated, 75);
  assert.equal(report.byType.staticPages.evaluated, 9);
});

test('provides a reason and confidence for every classified pair', () => {
  for (const group of Object.values(report.records)) {
    for (const record of group) {
      assert.ok(record.reason);
      assert.ok(record.confidence);
    }
  }
});

