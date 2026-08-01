import { useCallback } from 'react';
import { Article } from '@/data/mockData';
import adminArticlesJson from '@/content/articles.json';

/**
 * Site content source of truth: admin CMS articles (src/content/articles.json).
 * Large placeholder datasets (extended / troubleshooting / mock fillers) are
 * intentionally excluded so the public site stays free of duplicate and
 * low-quality picsum content.
 */
export function useAllArticles() {
  const customArticles = adminArticlesJson as unknown as Article[];

  const refresh = useCallback(() => {}, []);

  return { allArticles: customArticles, refresh };
}
