/**
 * Article generator — UNIQUE body per topic (no single shared template).
 * Extend TOPIC_CONTENT only; refuse generic filler bodies.
 */
import { distributedDate } from './dates.mjs';
import { heroImage } from './images.mjs';
import { bi } from './localization.mjs';
import { uniqueSlug } from './slugs.mjs';

/** Each topic must define its own titles + bodies. */
export const TOPIC_CONTENT = [];

export function generateArticles({ count = 20, category, startIndex = 0 } = {}) {
  let pool = TOPIC_CONTENT;
  if (category) pool = pool.filter((t) => t.cat === category);
  if (!pool.length) {
    console.warn('[articles] TOPIC_CONTENT is empty — refusing generic filler.');
    return [];
  }
  const items = [];
  for (let i = 0; i < count; i++) {
    const abs = startIndex + i;
    const t = pool[abs % pool.length];
    const cycle = Math.floor(abs / pool.length) + 1;
    items.push({
      id: `art-gen-${String(abs + 1).padStart(4, '0')}`,
      slug: uniqueSlug(cycle > 1 ? `${t.slug}-${cycle}` : t.slug),
      title: bi(cycle > 1 ? `${t.titleAr} (${cycle})` : t.titleAr, cycle > 1 ? `${t.titleEn} (${cycle})` : t.titleEn),
      excerpt: bi(t.excerptAr, t.excerptEn),
      body: bi(t.bodyAr, t.bodyEn),
      categoryId: t.cat,
      subcategoryId: t.sub || 'guides-tips',
      author: 'Technical Insights',
      date: distributedDate(abs, Math.max(count + startIndex, 1)),
      readTime: t.readTime || 4,
      heroImage: heroImage(abs),
      tags: t.tags || [t.cat],
      isFeatured: abs < 3,
      isTrending: abs >= 3 && abs < 6,
    });
  }
  return items;
}
