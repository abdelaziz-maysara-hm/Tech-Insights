/**
 * Home only needs the three latest comparison cards, not the full 200KB+
 * catalog. Keep src/content/home-comparisons.json in sync with the first
 * three entries of comparisons.json so the lazy home island stays small.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcPath = join(root, 'src/content/comparisons.json');
const outPath = join(root, 'src/content/home-comparisons.json');
const COUNT = 3;

export function homeComparisonsFrom(all, count = COUNT) {
  if (!Array.isArray(all)) throw new Error('comparisons.json must be an array');
  return all.slice(0, count);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const all = JSON.parse(readFileSync(srcPath, 'utf8'));
  const slice = homeComparisonsFrom(all);
  const json = `${JSON.stringify(slice, null, 2)}\n`;
  const check = process.argv.includes('--check');
  if (check) {
    const current = readFileSync(outPath, 'utf8');
    if (current !== json) {
      console.error('[home-comparisons] src/content/home-comparisons.json is out of date — run node scripts/generate-home-comparisons.mjs');
      process.exit(1);
    }
    console.log(`[home-comparisons] ok (${slice.length} items)`);
  } else {
    writeFileSync(outPath, json, 'utf8');
    console.log(`[home-comparisons] wrote ${slice.length} items → src/content/home-comparisons.json`);
  }
}
