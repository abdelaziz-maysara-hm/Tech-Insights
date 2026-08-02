#!/usr/bin/env node
/**
 * Content generator CLI for Technical Insights.
 * Writes production-shaped JSON under content/generated/ only.
 */
import { resetSlugs } from './slugs.mjs';
import { generateArticles } from './articles.mjs';
import { generateVideos } from './videos.mjs';
import { generateComparisons } from './comparisons.mjs';
import { generateCollections } from './collections.mjs';
import { generatePages } from './pages.mjs';
import { parseArgs, writeJson } from './utils.mjs';
import { uniquenessReport, validateAll } from './validation.mjs';

const DEFAULTS = {
  videos: 1000,
  comparisons: 1000,
  collections: 50,
  pages: undefined,
  articles: 100,
};

async function run() {
  const started = Date.now();
  const args = parseArgs();
  resetSlugs();

  const jobs = [];
  const want = (name) => args.type === 'all' || args.type === name;

  if (want('videos')) jobs.push(['videos', () => generateVideos({ count: args.count ?? DEFAULTS.videos, category: args.category, subcategory: args.subcategory })]);
  if (want('comparisons')) jobs.push(['comparisons', () => generateComparisons({ count: args.count ?? DEFAULTS.comparisons, subcategory: args.subcategory })]);
  if (want('collections')) jobs.push(['collections', () => generateCollections({ count: args.count ?? DEFAULTS.collections, category: args.category })]);
  if (want('pages')) jobs.push(['pages', () => generatePages({ count: args.count ?? DEFAULTS.pages })]);
  if (want('articles')) jobs.push(['articles', () => generateArticles({ count: args.count ?? DEFAULTS.articles, category: args.category })]);

  if (!jobs.length) {
    console.error('Unknown type. Use videos|articles|comparisons|collections|pages|all');
    process.exit(1);
  }

  const report = { generatedAt: new Date().toISOString(), files: [], validation: [], uniqueness: [], ms: 0 };

  for (const [name, fn] of jobs) {
    const items = fn();
    const v = validateAll(name, items);
    report.validation.push({ name, ...v });
    if (name === 'articles' || name === 'comparisons' || name === 'collections' || name === 'pages') {
      report.uniqueness.push(uniquenessReport(items, (x) => x.slug, `${name}.slug`));
    }
    report.uniqueness.push(uniquenessReport(items, (x) => x.id, `${name}.id`));
    if (!v.ok) {
      console.error(`Validation failed for ${name}:`, v.errors);
      process.exit(1);
    }
    const written = await writeJson(`${name}.json`, items);
    report.files.push({ name: `${name}.json`, ...written });
    console.log(`✓ ${name}: ${written.count} items → ${written.path} (${written.bytes} bytes)`);
  }

  report.ms = Date.now() - started;
  await writeJson('GENERATION_REPORT.json', report);
  console.log(`\nDone in ${report.ms}ms`);
  console.log('Report: content/generated/GENERATION_REPORT.json');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
