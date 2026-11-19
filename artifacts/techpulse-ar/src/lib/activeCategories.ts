import articlesIndexJson from '@/content/articles-index.json';
import type { Category } from '@/data/mockData';

/** Display order for article categories. */
const ORDER: Category[] = ['cybersecurity', 'windows', 'howto', 'technology', 'mobile', 'laptops', 'ai', 'reviews'];

const counts = new Map<string, number>();
for (const item of articlesIndexJson as { categoryId: string }[]) {
  counts.set(item.categoryId, (counts.get(item.categoryId) ?? 0) + 1);
}

/** Categories that currently have at least one article (no empty category pages or filters). */
export const ACTIVE_CATEGORIES: Category[] = ORDER.filter((c) => (counts.get(c) ?? 0) > 0);

export function categoryCount(category: string): number {
  return counts.get(category) ?? 0;
}
