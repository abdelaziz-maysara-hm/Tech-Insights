#!/usr/bin/env node
/**
 * Phase 8 content (2026-11-19). Run AFTER scripts/phase7/apply-content.mjs.
 *
 *  - content/*.mjs : new articles from the content plan. Arabic and English
 *    are written independently (same topic, separate structure and examples).
 *  - english/<slug>.md : independent native-English rewrites of EXISTING
 *    articles (front matter: title, excerpt; then the body).
 *  - comparisons-en/<slug>.json : independent English for comparisons
 *    ({ title, excerpt, verdict, specs: { specN: { label, device1Value, device2Value } } }).
 *  - repurpose.mjs : off-audience items rewritten for the security audience.
 *
 * These records get englishEdition: 'independent'. That is NOT a human
 * review: translationStatus stays 'unreviewed' (only a person may set
 * 'reviewed'), and publication keeps following publishUnreviewedTranslations.
 *
 * Idempotent: it only overwrites the fields it owns. No bulk generation.
 */
import { existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { REPURPOSE_ARTICLES, REPURPOSE_COMPARISONS } from './repurpose.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const p = (rel) => join(root, rel);
const readJson = (rel) => JSON.parse(readFileSync(p(rel), 'utf8'));
const writeJson = (rel, data) => writeFileSync(p(rel), `${JSON.stringify(data, null, 2)}\n`, 'utf8');

const PUBLISH_DATE = '2026-11-19';
const TEAM_AUTHOR = { name: { ar: 'فريق NetSec Atlas', en: 'NetSec Atlas Team' }, avatar: '' };
const KNOWN_VENDORS = new Set(['fortinet', 'palo-alto', 'cisco', 'microsoft', 'vmware', 'kaspersky', 'forcepoint', 'f5', 'beyondtrust', 'splunk', 'broadcom', 'trellix', 'rapid7', 'infoblox', 'sophos']);
const KNOWN_PRODUCTS = new Set(['fortigate', 'fortimanager', 'forticlient-ems', 'active-directory', 'windows-server', 'ksc', 'kes', 'pan-os', 'globalprotect', 'microsoft-sentinel', 'panorama', 'fortianalyzer']);

const words = (text) => String(text || '').split(/\s+/).filter(Boolean).length;
const readTime = (body) => Math.max(3, Math.round(Math.max(words(body.ar), words(body.en)) / 200));
const loadDir = async (dir) => {
  const out = [];
  for (const file of readdirSync(join(here, dir)).filter((f) => f.endsWith('.mjs')).sort()) {
    out.push((await import(pathToFileURL(join(here, dir, file)).href)).default);
  }
  return out;
};

const articles = readJson('src/content/articles.json');
const comparisons = readJson('src/content/comparisons.json');
const bySlug = new Map(articles.map((a) => [a.slug, a]));

// 1) new articles
let added = 0;
const fresh = await loadDir('content');
fresh.forEach((src, index) => {
  const existing = bySlug.get(src.slug);
  const hero = existing?.heroImage || bySlug.get(src.heroFrom)?.heroImage || articles[0].heroImage;
  const record = {
    id: existing?.id || `art-p8-${String(index + 1).padStart(3, '0')}`,
    slug: src.slug,
    title: src.title,
    excerpt: src.excerpt,
    body: src.body,
    categoryId: src.categoryId,
    subcategoryId: src.subcategoryId,
    author: TEAM_AUTHOR,
    date: PUBLISH_DATE,
    readTime: readTime(src.body),
    heroImage: hero,
    tags: src.tags,
    isFeatured: false,
    isTrending: false,
    domainIds: src.domainIds,
    topicIds: src.topicIds,
    contentType: src.contentType || 'guide',
    vendorIds: (src.vendorIds || []).filter((v) => KNOWN_VENDORS.has(v)),
    productIds: (src.productIds || []).filter((x) => KNOWN_PRODUCTS.has(x)),
    technicalStatus: 'needs-review',
    translationStatus: existing?.translationStatus === 'reviewed' ? 'reviewed' : 'unreviewed',
    englishEdition: 'independent',
  };
  if (existing) Object.assign(existing, record);
  else { articles.unshift(record); added += 1; }
  bySlug.set(src.slug, existing || record);
});

// 2) repurposed articles (both languages rewritten)
let repurposed = 0;
for (const src of REPURPOSE_ARTICLES) {
  const a = bySlug.get(src.slug);
  if (!a) throw new Error(`repurpose: missing ${src.slug}`);
  Object.assign(a, {
    title: src.title, excerpt: src.excerpt, body: src.body,
    categoryId: src.categoryId, subcategoryId: src.subcategoryId, tags: src.tags,
    readTime: readTime(src.body), date: PUBLISH_DATE, englishEdition: 'independent',
  });
  for (const key of ['domainIds', 'topicIds', 'contentType', 'vendorIds', 'productIds']) if (src[key]) a[key] = src[key];
  if (!a.technicalStatus) a.technicalStatus = 'needs-review';
  repurposed += 1;
}
for (const src of REPURPOSE_COMPARISONS) {
  const c = comparisons.find((x) => x.slug === src.slug);
  if (!c) throw new Error(`repurpose: missing comparison ${src.slug}`);
  Object.assign(c, src.fields, { date: PUBLISH_DATE, englishEdition: 'independent' });
  repurposed += 1;
}

// 3) independent English rewrites of existing articles and comparisons
const parseFrontMatter = (text, file) => {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${file}: missing front matter`);
  const meta = Object.fromEntries(m[1].split('\n').map((line) => {
    const i = line.indexOf(':');
    return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
  }));
  if (!meta.title || !meta.excerpt) throw new Error(`${file}: title and excerpt required`);
  return { ...meta, body: `${m[2].trim()}\n` };
};
let rewritten = 0;
for (const file of readdirSync(join(here, 'english')).filter((f) => f.endsWith('.md')).sort()) {
  const slug = file.replace(/\.md$/, '');
  const a = bySlug.get(slug);
  if (!a) throw new Error(`english rewrite: missing ${slug}`);
  const src = parseFrontMatter(readFileSync(join(here, 'english', file), 'utf8'), file);
  a.title = { ...a.title, en: src.title };
  a.excerpt = { ...a.excerpt, en: src.excerpt };
  a.body = { ...a.body, en: src.body };
  a.readTime = readTime(a.body);
  a.englishEdition = 'independent';
  rewritten += 1;
}
// Arabic updates of existing articles (same front-matter format), e.g. OWASP Top 10:2025
let arabicUpdates = 0;
for (const file of (existsSync(join(here, 'arabic')) ? readdirSync(join(here, 'arabic')) : []).filter((f) => f.endsWith('.md')).sort()) {
  const slug = file.replace(/\.md$/, '');
  const a = bySlug.get(slug);
  if (!a) throw new Error(`arabic update: missing ${slug}`);
  const src = parseFrontMatter(readFileSync(join(here, 'arabic', file), 'utf8'), file);
  a.title = { ...a.title, ar: src.title };
  a.excerpt = { ...a.excerpt, ar: src.excerpt };
  a.body = { ...a.body, ar: src.body };
  a.readTime = readTime(a.body);
  arabicUpdates += 1;
}
// records written independently at creation (outside content/): keep the flag
for (const slug of ['exploited-vulnerabilities-roundup-august-2026']) {
  if (bySlug.get(slug)) bySlug.get(slug).englishEdition = 'independent';
}
let comparisonsRewritten = 0;
for (const file of (existsSync(join(here, 'comparisons-en')) ? readdirSync(join(here, 'comparisons-en')) : []).filter((f) => f.endsWith('.json')).sort()) {
  const slug = file.replace(/\.json$/, '');
  const c = comparisons.find((x) => x.slug === slug);
  if (!c) throw new Error(`comparison rewrite: missing ${slug}`);
  const src = JSON.parse(readFileSync(join(here, 'comparisons-en', file), 'utf8'));
  c.title = { ...c.title, en: src.title };
  c.excerpt = { ...c.excerpt, en: src.excerpt };
  c.verdict = { ...c.verdict, en: src.verdict };
  for (const [key, spec] of Object.entries(src.specs || {})) {
    if (!c.specs[key]) throw new Error(`${slug}: unknown spec ${key}`);
    for (const field of ['label', 'device1Value', 'device2Value']) {
      if (spec[field]) c.specs[key][field] = { ...c.specs[key][field], en: spec[field] };
    }
  }
  c.englishEdition = 'independent';
  comparisonsRewritten += 1;
}
// a person, not this script, sets translationStatus 'reviewed'
for (const a of articles) if (a.englishEdition === 'independent' && a.translationStatus === 'reviewed' && !a.humanReviewedBy) a.translationStatus = 'unreviewed';

writeJson('src/content/articles.json', articles);
writeJson('src/content/articles-index.json', articles.map(({ body, ...rest }) => rest));
writeJson('src/content/comparisons.json', comparisons);
console.log(`[phase8] added=${added} repurposed=${repurposed} englishRewrites=${rewritten} arabicUpdates=${arabicUpdates} comparisonRewrites=${comparisonsRewritten} articles=${articles.length} ` +
  `independentEnglish=${articles.filter((a) => a.englishEdition === 'independent').length}/${articles.length} articles, ${comparisons.filter((c) => c.englishEdition === 'independent').length}/${comparisons.length} comparisons, humanReviewed=${articles.filter((a) => a.translationStatus === 'reviewed').length}`);
