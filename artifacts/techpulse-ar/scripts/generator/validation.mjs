/** Schema validation + uniqueness + taxonomy checks */
import { ALLOWED_SUBCATEGORIES } from './categories.mjs';
import { assertBi } from './localization.mjs';

function checkTaxonomy(item, index, kind) {
  const e = [];
  const cat = item.categoryId;
  const sub = item.subcategoryId;
  if (!cat) e.push('categoryId');
  if (!sub) e.push('subcategoryId');
  if (cat && sub) {
    const allowed = ALLOWED_SUBCATEGORIES[cat];
    if (allowed && !allowed.includes(sub)) {
      e.push(`subcategoryId "${sub}" not allowed under category "${cat}"`);
    }
  }
  if (!item.heroImage) e.push('heroImage');
  return e.map((x) => `${kind}[${index}].${x}`);
}

export function validateVideo(item, index) {
  const e = [];
  if (!item.id) e.push('id');
  try { assertBi(item.title, 'title'); } catch (err) { e.push(String(err.message)); }
  try { assertBi(item.description, 'description'); } catch (err) { e.push(String(err.message)); }
  if (typeof item.youtubeId !== 'string') e.push('youtubeId must be string');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date || '')) e.push('date');
  return [...e.map((x) => `videos[${index}].${x}`), ...checkTaxonomy(item, index, 'videos')];
}

export function validateArticle(item, index) {
  const e = [];
  if (!item.id) e.push('id');
  if (!item.slug) e.push('slug');
  try { assertBi(item.title, 'title'); } catch (err) { e.push(String(err.message)); }
  try { assertBi(item.excerpt, 'excerpt'); } catch (err) { e.push(String(err.message)); }
  try { assertBi(item.body, 'body'); } catch (err) { e.push(String(err.message)); }
  if (!item.author?.name) e.push('author.name');
  if (!Array.isArray(item.tags) || !item.tags.length) e.push('tags');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date || '')) e.push('date');
  if (typeof item.readTime !== 'number') e.push('readTime');
  return [...e.map((x) => `articles[${index}].${x}`), ...checkTaxonomy(item, index, 'articles')];
}

export function validateComparison(item, index) {
  const e = [];
  if (!item.id) e.push('id');
  if (!item.slug) e.push('slug');
  try { assertBi(item.title, 'title'); } catch (err) { e.push(String(err.message)); }
  try { assertBi(item.excerpt, 'excerpt'); } catch (err) { e.push(String(err.message)); }
  try { assertBi(item.verdict, 'verdict'); } catch (err) { e.push(String(err.message)); }
  if (!item.device1Name || !item.device2Name) e.push('device names');
  if (!item.device1Image || !item.device2Image) e.push('device images');
  if (item.device1Image && item.device2Image && item.device1Image === item.device2Image) {
    e.push('device1Image and device2Image must differ');
  }
  if (!item.specs || typeof item.specs !== 'object') e.push('specs');
  if (![0, 1, 2].includes(item.overallWinner)) e.push('overallWinner');
  return [...e.map((x) => `comparisons[${index}].${x}`), ...checkTaxonomy(item, index, 'comparisons')];
}

export function validatePage(item, index) {
  const e = [];
  if (!item.id) e.push('id');
  if (!item.slug) e.push('slug');
  try { assertBi(item.title, 'title'); } catch (err) { e.push(String(err.message)); }
  try { assertBi(item.content, 'content'); } catch (err) { e.push(String(err.message)); }
  return e.map((x) => `pages[${index}].${x}`);
}

export function validateCollection(item, index) {
  const e = [];
  if (!item.id) e.push('id');
  if (!item.slug) e.push('slug');
  try { assertBi(item.title, 'title'); } catch (err) { e.push(String(err.message)); }
  try { assertBi(item.description, 'description'); } catch (err) { e.push(String(err.message)); }
  if (!Array.isArray(item.itemSlugs)) e.push('itemSlugs');
  return e.map((x) => `collections[${index}].${x}`);
}

export function uniquenessReport(items, keyFn, label) {
  const seen = new Map();
  const dups = [];
  for (const item of items) {
    const k = keyFn(item);
    if (seen.has(k)) dups.push(k);
    else seen.set(k, true);
  }
  return { label, unique: seen.size, duplicates: dups.slice(0, 20), ok: dups.length === 0 };
}

export function validateAll(kind, items) {
  const validators = {
    videos: validateVideo,
    articles: validateArticle,
    comparisons: validateComparison,
    pages: validatePage,
    collections: validateCollection,
  };
  const fn = validators[kind];
  const errors = [];
  items.forEach((item, i) => errors.push(...fn(item, i)));
  return { ok: errors.length === 0, errors: errors.slice(0, 30), totalErrors: errors.length };
}
