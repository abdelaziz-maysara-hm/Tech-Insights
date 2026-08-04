import { ArticleListItem } from '@/data/mockData';
import articlesIndexJson from '@/content/articles-index.json';

/**
 * Lightweight article metadata (title, excerpt, category, etc.) WITHOUT the
 * full body text -- safe for listing/browsing pages to import, since the
 * body of every article never ships in their bundle. Pages that need one
 * article's full body should use useArticleBody() (dynamic import) instead.
 */
export function useAllArticles() {
  const allArticles = articlesIndexJson as unknown as ArticleListItem[];
  return { allArticles };
}
