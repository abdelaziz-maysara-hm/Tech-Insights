import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const sources = {
  'articles.json': 200_000,
  'articles-index.json': 15_000,
  'comparisons.json': 25_000,
  'pages.json': 600,
  'collections.json': 600,
  'videos.json': 900,
};

for (const [filename, minimumArabicCharacters] of Object.entries(sources)) {
  test(`${filename} preserves Arabic UTF-8 content`, async () => {
    const source = await readFile(new URL(`../src/content/${filename}`, import.meta.url), 'utf8');
    JSON.parse(source);

    const arabicCharacters = source.match(/[\u0600-\u06ff]/g)?.length ?? 0;
    assert.ok(
      arabicCharacters >= minimumArabicCharacters,
      `${filename} has only ${arabicCharacters} Arabic characters; expected at least ${minimumArabicCharacters}`,
    );
    assert.doesNotMatch(source, /\?{3,}/, `${filename} contains a likely encoding-corruption sequence`);
    assert.doesNotMatch(source, /\uFFFD/, `${filename} contains Unicode replacement characters`);
  });
}
