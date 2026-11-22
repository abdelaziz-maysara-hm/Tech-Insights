/**
 * On-site browser tools were removed on 2026-11-21 (they live on adawaty.tools
 * and in the desktop app). This guard keeps the deleted files from coming back
 * unnoticed and breaking the build the way Search.tsx did after the removal.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (rel) => readFileSync(new URL(rel, import.meta.url), 'utf8');

test('on-site web tool catalog and detail page stay removed', () => {
  assert.equal(existsSync(new URL('../src/content/web-tools.json', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/data/webTools.ts', import.meta.url)), false);
  assert.equal(existsSync(new URL('../src/pages/ToolDetail.tsx', import.meta.url)), false);
  assert.doesNotMatch(read('../src/pages/Search.tsx'), /webTools/);
  assert.doesNotMatch(read('../src/App.tsx'), /path="\/tools\/:slug"/);
});

test('retired tool URLs redirect to the apps page', () => {
  const { redirects } = JSON.parse(read('../src/config/content-redirects.json'));
  for (const slug of ['vlsm-subnet-calculator', 'ip-range-to-cidr-wildcard', 'spf-record-analyzer', 'dmarc-record-analyzer']) {
    assert.equal(redirects[`/tools/${slug}`], '/tools', slug);
  }
});
