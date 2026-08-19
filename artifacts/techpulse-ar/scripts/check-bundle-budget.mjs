/**
 * Production bundle budget gate for NetSec Atlas (Phase 6B).
 * Inspects dist/public/assets after vite build.
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = join(root, 'dist', 'public', 'assets');

/** Budgets in bytes (raw, post-minify). Headroom above measured optimized builds. */
const BUDGETS = {
  maxEntryJs: 450_000,
  maxNonArticlesJsChunk: 450_000,
  maxArticlesJsChunk: 1_200_000,
  maxCss: 180_000,
  maxTotalJs: 2_400_000,
};

function listAssets() {
  if (!existsSync(assetsDir)) {
    throw new Error(`Missing ${assetsDir}. Run production build first.`);
  }
  return readdirSync(assetsDir)
    .filter((name) => name.endsWith('.js') || name.endsWith('.css'))
    .map((name) => {
      const filePath = join(assetsDir, name);
      return { name, size: statSync(filePath).size, filePath };
    })
    .sort((a, b) => b.size - a.size);
}

function entryJsFromHtml() {
  const htmlPath = join(root, 'dist', 'public', 'index.html');
  const html = readFileSync(htmlPath, 'utf8');
  const match = html.match(/<script[^>]+src="([^"]*\/assets\/[^"]+\.js)"/);
  if (!match) return null;
  const fileName = match[1].split('/').pop();
  return fileName;
}

function isArticlesChunk(name) {
  return /^articles-/i.test(name) || name.toLowerCase().includes('articles-');
}

function main() {
  const assets = listAssets();
  const js = assets.filter((a) => a.name.endsWith('.js'));
  const css = assets.filter((a) => a.name.endsWith('.css'));
  const entryName = entryJsFromHtml();
  const entry = js.find((a) => a.name === entryName) || js[0];
  const nonArticles = js.filter((a) => !isArticlesChunk(a.name));
  const articles = js.filter((a) => isArticlesChunk(a.name));
  const largestNonArticles = nonArticles[0];
  const largestArticles = articles[0];
  const totalJs = js.reduce((sum, a) => sum + a.size, 0);
  const totalCss = css.reduce((sum, a) => sum + a.size, 0);

  const report = {
    entryJs: entry ? { name: entry.name, size: entry.size } : null,
    largestNonArticlesJs: largestNonArticles
      ? { name: largestNonArticles.name, size: largestNonArticles.size }
      : null,
    articlesJs: largestArticles
      ? { name: largestArticles.name, size: largestArticles.size }
      : null,
    totalJs,
    totalCss,
    jsChunks: js.length,
    cssChunks: css.length,
  };

  console.log('[bundle-budget]', JSON.stringify(report, null, 2));

  const failures = [];
  if (report.entryJs && report.entryJs.size > BUDGETS.maxEntryJs) {
    failures.push(
      `entry JS ${report.entryJs.name} ${report.entryJs.size} > ${BUDGETS.maxEntryJs}`,
    );
  }
  if (report.largestNonArticlesJs && report.largestNonArticlesJs.size > BUDGETS.maxNonArticlesJsChunk) {
    failures.push(
      `largest non-articles JS ${report.largestNonArticlesJs.name} ${report.largestNonArticlesJs.size} > ${BUDGETS.maxNonArticlesJsChunk}`,
    );
  }
  if (report.articlesJs && report.articlesJs.size > BUDGETS.maxArticlesJsChunk) {
    failures.push(
      `articles JS ${report.articlesJs.name} ${report.articlesJs.size} > ${BUDGETS.maxArticlesJsChunk}`,
    );
  }
  if (totalCss > BUDGETS.maxCss) {
    failures.push(`CSS total ${totalCss} > ${BUDGETS.maxCss}`);
  }
  if (totalJs > BUDGETS.maxTotalJs) {
    failures.push(`total JS ${totalJs} > ${BUDGETS.maxTotalJs}`);
  }

  if (failures.length) {
    console.error('[bundle-budget] FAILED:');
    for (const f of failures) console.error(' -', f);
    process.exit(1);
  }
  console.log('[bundle-budget] OK');
}

main();
