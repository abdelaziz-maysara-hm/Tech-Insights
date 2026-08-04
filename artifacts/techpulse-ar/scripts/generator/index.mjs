#!/usr/bin/env node
/**
 * Content generator CLI for Technical Insights.
 * Default: generate NEW batch and MERGE into existing (generated + live).
 * --replace : overwrite generated file only
 * --apply   : also write merged result into src/content (live)
 */
import { resetSlugs } from './slugs.mjs';
import { generateArticles } from './articles.mjs';
import { generateVideos } from './videos.mjs';
import { generateComparisons } from './comparisons.mjs';
import { generateCollections } from './collections.mjs';
import { generatePages } from './pages.mjs';
import { parseArgs, writeJson, writeJsonIndex } from './utils.mjs';
import { uniquenessReport, validateAll } from './validation.mjs';
import { loadExisting, mergeLists, nextNumericSuffix } from './merge.mjs';

const DEFAULTS = {
  videos: 100,
  comparisons: 50,
  collections: 20,
  pages: undefined,
  articles: 50,
};

async function run() {
  const started = Date.now();
  const args = parseArgs();
  resetSlugs();

  const jobs = [];
  const want = (name) => args.type === 'all' || args.type === name;

  if (want('videos')) {
    jobs.push(['videos', async () => {
      const existing = args.append ? await loadExisting('videos') : [];
      const start = nextNumericSuffix(existing, 'vid-gen-');
      const batch = generateVideos({
        count: args.count ?? DEFAULTS.videos,
        category: args.category,
        subcategory: args.subcategory,
        startIndex: start,
      });
      return args.append ? mergeLists(existing, batch) : { items: batch, added: batch.length, merged: 0, skipped: 0 };
    }]);
  }
  if (want('comparisons')) {
    jobs.push(['comparisons', async () => {
      const existing = args.append ? await loadExisting('comparisons') : [];
      const start = nextNumericSuffix(existing, 'cmp-gen-');
      const batch = generateComparisons({
        count: args.count ?? DEFAULTS.comparisons,
        subcategory: args.subcategory,
        startIndex: start,
      });
      return args.append ? mergeLists(existing, batch) : { items: batch, added: batch.length, merged: 0, skipped: 0 };
    }]);
  }
  if (want('collections')) {
    jobs.push(['collections', async () => {
      const existing = args.append ? await loadExisting('collections') : [];
      const start = nextNumericSuffix(existing, 'col-gen-');
      const batch = generateCollections({
        count: args.count ?? DEFAULTS.collections,
        category: args.category,
        startIndex: start,
      });
      return args.append ? mergeLists(existing, batch) : { items: batch, added: batch.length, merged: 0, skipped: 0 };
    }]);
  }
  if (want('pages')) {
    jobs.push(['pages', async () => {
      const existing = args.append ? await loadExisting('pages') : [];
      const batch = generatePages({ count: args.count ?? DEFAULTS.pages });
      return args.append ? mergeLists(existing, batch) : { items: batch, added: batch.length, merged: 0, skipped: 0 };
    }]);
  }
  if (want('articles')) {
    jobs.push(['articles', async () => {
      const existing = args.append ? await loadExisting('articles') : [];
      const start = nextNumericSuffix(existing, 'art-gen-');
      const batch = generateArticles({
        count: args.count ?? DEFAULTS.articles,
        category: args.category,
        startIndex: start,
      });
      return args.append ? mergeLists(existing, batch) : { items: batch, added: batch.length, merged: 0, skipped: 0 };
    }]);
  }

  if (!jobs.length) {
    console.error('Unknown type. Use videos|articles|comparisons|collections|pages|all');
    process.exit(1);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    mode: args.replace ? 'replace' : 'append-merge',
    applyLive: args.apply,
    files: [],
    validation: [],
    uniqueness: [],
    merge: [],
    ms: 0,
  };

  for (const [name, fn] of jobs) {
    const { items, added, merged, skipped } = await fn();
    const v = validateAll(name, items);
    report.validation.push({ name, ...v });
    report.merge.push({ name, total: items.length, added, merged, skipped });
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
    console.log(`✓ ${name}: total=${items.length} (+${added} new, ~${merged} merged) → ${written.path}`);
    if (args.apply) {
      const live = await writeJson(`${name}.json`, items, { live: true });
      console.log(`  ↳ applied to live: ${live.path}`);
      if (name === 'articles') {
        const index = await writeJsonIndex('articles-index.json', items, ['body'], { live: true });
        console.log(`  ↳ lightweight index (no body field, for listing pages): ${index.path} (${index.bytes} bytes vs ${live.bytes} full)`);
      }
    }
  }

  report.ms = Date.now() - started;
  await writeJson('GENERATION_REPORT.json', report);
  console.log(`\nDone in ${report.ms}ms [${report.mode}]`);
  console.log('Report: content/generated/GENERATION_REPORT.json');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
