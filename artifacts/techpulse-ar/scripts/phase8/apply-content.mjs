#!/usr/bin/env node
/**
 * Phase 8 content (2026-11-19). Run AFTER scripts/phase7/apply-content.mjs.
 *
 *  - content/*.mjs : new articles from the content plan. Arabic and English
 *    are written independently (same topic, separate structure and
 *    examples), so they ship as translationStatus 'reviewed'.
 *  - english/*.mjs : independent native-English rewrites of EXISTING
 *    articles ({ slug, title: {en}, excerpt: {en}, body: {en} }). Only these
 *    records are flipped to 'reviewed'; every other English version keeps
 *    'unreviewed' and stays governed by publishUnreviewedTranslations.
 *  - repurpose.mjs : off-audience items rewritten for the security audience.
 *
 * Idempotent: it only overwrites the fields it owns. No bulk generation.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
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
    translationStatus: 'reviewed',
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
    readTime: readTime(src.body), date: PUBLISH_DATE, translationStatus: 'reviewed',
  });
  for (const key of ['domainIds', 'topicIds', 'contentType', 'vendorIds', 'productIds']) if (src[key]) a[key] = src[key];
  if (!a.technicalStatus) a.technicalStatus = 'needs-review';
  repurposed += 1;
}
for (const src of REPURPOSE_COMPARISONS) {
  const c = comparisons.find((x) => x.slug === src.slug);
  if (!c) throw new Error(`repurpose: missing comparison ${src.slug}`);
  Object.assign(c, src.fields, { date: PUBLISH_DATE });
  repurposed += 1;
}

// 3) independent English rewrites of existing articles
let rewritten = 0;
for (const src of await loadDir('english')) {
  const a = bySlug.get(src.slug);
  if (!a) throw new Error(`english rewrite: missing ${src.slug}`);
  if (!/^## (FAQ|References)$/m.test(src.body.en)) throw new Error(`${src.slug}: English rewrite needs FAQ or References`);
  a.title = { ...a.title, en: src.title.en };
  a.excerpt = { ...a.excerpt, en: src.excerpt.en };
  a.body = { ...a.body, en: src.body.en };
  a.readTime = readTime(a.body);
  a.translationStatus = 'reviewed';
  rewritten += 1;
}

writeJson('src/content/articles.json', articles);
writeJson('src/content/articles-index.json', articles.map(({ body, ...rest }) => rest));
writeJson('src/content/comparisons.json', comparisons);
console.log(`[phase8] added=${added} repurposed=${repurposed} englishRewrites=${rewritten} articles=${articles.length} reviewed=${articles.filter((a) => a.translationStatus === 'reviewed').length}`);
