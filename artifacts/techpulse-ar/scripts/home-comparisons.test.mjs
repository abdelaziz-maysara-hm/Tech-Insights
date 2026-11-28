import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { homeComparisonsFrom } from './generate-home-comparisons.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('home-comparisons.json is the first three entries of comparisons.json', () => {
  const all = JSON.parse(readFileSync(join(root, 'src/content/comparisons.json'), 'utf8'));
  const home = JSON.parse(readFileSync(join(root, 'src/content/home-comparisons.json'), 'utf8'));
  const expected = homeComparisonsFrom(all);
  assert.equal(home.length, 3);
  assert.deepEqual(home, expected);
});
