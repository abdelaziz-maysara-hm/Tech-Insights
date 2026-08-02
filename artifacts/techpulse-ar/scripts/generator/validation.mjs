/** Schema validation + uniqueness checks */
import { assertBi } from './localization.mjs';

export function validateVideo(item, index) {
  const e = [];
  if (!item.id) e.push('id');
  try { assertBi(item.title, 'title'); } catch (err) { e.push(String(err.message)); }
  try { assertBi(item.description, 'description'); } catch (err) { e.push(String(err.message)); }
  if (typeof item.youtubeId !== 'string') e.push('youtubeId must be string');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date || '')) e.push('date');
  if (!item.categoryId) e.push('categoryId');
  if (!item.subcategoryId) e.push('subcategoryId');
  return e.map((x) => `videos[${index}].${x}`);
}

export function validateArticle(item, index) {
  const e = [];
  if (!item.id) e.push('id');
  if (!item.slug) e.push('slug');
  try { assertBi(item.title, 'title'); } catch (err) { e.push(String(err.message)); }
  try { assertBi(item.excerpt, 'excerpt'); } catch (err) { e.push(String(err.message)); }
  try { assertBi(item.body, 'body'); } catch (err) { e.push(String(err.message)); }
  if (!item.categoryId) e.push('categoryId');
  if (!item.author?.name) e.push('author.name');
  if (!item.heroImage) e.push('heroImage');
  if (!Array.isArray(item.tags) || !item.tags.length) e.push('tags');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date || '')) e.push('date');
  if (typeof item.readTime !== 'number') e.push('readTime');
  return e.map((x) => `articles[${index}].${x}`);
}

export function validateComparison(item, index) {
  const e = [];
  if (!item.id) e.push('id');
  if (!item.slug) e.push('slug');
  try { assertBi(item.title, 'title'); } catch (err) { e.push(String(err.message)); }
  try { assertBi(item.excerpt, 'excerpt'); } catch (err) { e.push(String(err.message)); }
  try { assertBi(item.verdict, 'verdict'); } catch (err) { e.push(String(err.message)); }
  if (!item.device1Name || !item.device2Name) e.push('device names');
  if (!item.specs || typeof item.specs !== 'object') e.push('specs');
  if (item.overallWinner !== 1 && item.overallWinner !== 2) e.push('overallWinner');
  if (!item.categoryId) e.push('categoryId');
  return e.map((x) => `comparisons[${index}].${x}`);
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
