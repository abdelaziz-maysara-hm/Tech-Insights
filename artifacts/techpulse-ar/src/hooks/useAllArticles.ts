import { Article } from '@/data/mockData';
import articlesJson from '@/content/articles.json';

/** The site is fully static: articles come from the build-time JSON only. */
export function useAllArticles() {
  const allArticles = articlesJson as unknown as Article[];
  return { allArticles };
}
