/**
 * Article generator — UNIQUE body per topic + content-aware hero + valid taxonomy.
 */
import { assertSubcategory, inferTaxonomy } from './categories.mjs';
import { distributedDate } from './dates.mjs';
import { resolveArticleHero } from './images.mjs';
import { bi } from './localization.mjs';
import { uniqueSlug } from './slugs.mjs';

const DEFAULT_AUTHOR = {
  name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
  avatar: 'https://i.pravatar.cc/150?img=11',
};

/** Each topic must define its own titles + bodies. Extend TOPIC_CONTENT only. */
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

    const inferred = inferTaxonomy(
      [t.slug, t.titleEn, t.titleAr, ...(t.tags || []), t.cat, t.sub].filter(Boolean).join(' '),
    );
    const categoryId = t.cat || inferred.categoryId;
    const subcategoryId = assertSubcategory(
      categoryId,
      t.sub || inferred.subcategoryId,
    );

    const titleAr = cycle > 1 ? `${t.titleAr} (${cycle})` : t.titleAr;
    const titleEn = cycle > 1 ? `${t.titleEn} (${cycle})` : t.titleEn;
    const slug = uniqueSlug(cycle > 1 ? `${t.slug}-${cycle}` : t.slug);
    const tags = t.tags || [categoryId];

    items.push({
      id: `art-gen-${String(abs + 1).padStart(4, '0')}`,
      slug,
      title: bi(titleAr, titleEn),
      excerpt: bi(t.excerptAr, t.excerptEn),
      body: bi(t.bodyAr, t.bodyEn),
      categoryId,
      subcategoryId,
      author: t.author || DEFAULT_AUTHOR,
      date: distributedDate(abs, Math.max(count + startIndex, 1)),
      readTime: t.readTime || 4,
      heroImage: resolveArticleHero({
        categoryId,
        subcategoryId,
        tags,
        title: { ar: titleAr, en: titleEn },
        slug,
        theme: t.theme || inferred.theme,
      }),
      tags,
      isFeatured: abs < 3,
      isTrending: abs >= 3 && abs < 6,
    });
  }
  return items;
}
