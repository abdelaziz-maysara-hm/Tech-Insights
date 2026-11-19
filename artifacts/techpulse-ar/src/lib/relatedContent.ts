/**
 * Internal-linking helpers shared by the React app and the static prerender.
 * Pure functions with no path aliases so Node can import them directly.
 */

export interface RelatableArticle {
  id?: string;
  slug: string;
  categoryId?: string;
  subcategoryId?: string;
  tags?: string[];
  date?: string;
}

function normTag(tag: string): string {
  return String(tag).trim().toLowerCase();
}

/**
 * Rank other articles by topical closeness: shared tags weigh most, then the
 * same subcategory, then the same category; ties go to the newest article.
 * When fewer than three topical matches exist, the list is topped up with the
 * newest other articles so every article still links out to related reading.
 */
export function getRelatedArticles<T extends RelatableArticle>(
  article: RelatableArticle,
  all: readonly T[],
  limit = 6,
): T[] {
  const tags = new Set((article.tags ?? []).map(normTag));
  const scored = all
    .filter((other) => other.slug !== article.slug)
    .map((other) => {
      let score = 0;
      for (const tag of other.tags ?? []) if (tags.has(normTag(tag))) score += 3;
      if (article.subcategoryId && other.subcategoryId === article.subcategoryId) score += 2;
      if (article.categoryId && other.categoryId === article.categoryId) score += 1;
      return { other, score };
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || String(b.other.date ?? '').localeCompare(String(a.other.date ?? '')),
    );
  const picked = scored.slice(0, limit).map((entry) => entry.other);
  if (picked.length < Math.min(3, limit)) {
    const taken = new Set(picked.map((a) => a.slug));
    const newest = all
      .filter((other) => other.slug !== article.slug && !taken.has(other.slug))
      .slice()
      .sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')));
    for (const other of newest) {
      if (picked.length >= Math.min(3, limit)) break;
      picked.push(other);
    }
  }
  return picked;
}

/** Previous (older) and next (newer) article in the same category by date. */
export function getAdjacentArticles<T extends RelatableArticle>(
  article: RelatableArticle,
  all: readonly T[],
): { previous: T | null; next: T | null } {
  const sameCategory = all
    .filter((a) => a.categoryId === article.categoryId)
    .slice()
    .sort((a, b) => String(a.date ?? '').localeCompare(String(b.date ?? '')) || a.slug.localeCompare(b.slug));
  const index = sameCategory.findIndex((a) => a.slug === article.slug);
  if (index < 0) return { previous: null, next: null };
  return {
    previous: index > 0 ? sameCategory[index - 1] : null,
    next: index < sameCategory.length - 1 ? sameCategory[index + 1] : null,
  };
}
