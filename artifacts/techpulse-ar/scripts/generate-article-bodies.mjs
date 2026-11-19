#!/usr/bin/env node
/**
 * Writes one small JSON file per article body to public/content/articles/<slug>.json
 * so an article page downloads only its own body (a few KB) instead of a
 * code-split chunk containing every article (1 MB+). Generated at build/dev
 * time from src/content/articles.json; the output folder is git-ignored.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const articles = JSON.parse(readFileSync(join(root, 'src/content/articles.json'), 'utf8'));
const outDir = join(root, 'public/content/articles');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
for (const article of articles) {
  if (!/^[a-z0-9-]+$/.test(article.slug)) throw new Error(`unsafe slug ${article.slug}`);
  writeFileSync(join(outDir, `${article.slug}.json`), JSON.stringify({ slug: article.slug, body: article.body }), 'utf8');
}
console.log(`[article-bodies] wrote ${articles.length} files → public/content/articles/`);
