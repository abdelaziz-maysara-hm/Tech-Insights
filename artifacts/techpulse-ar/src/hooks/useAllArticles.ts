import { useCallback } from 'react';
import { Article } from '@/data/mockData';
import adminArticlesJson from '@/content/articles.json';

/** Public site reads build-time CMS JSON (updated when content is committed). */
export function useAllArticles() {
  const allArticles = adminArticlesJson as unknown as Article[];
  const refresh = useCallback(() => {}, []);
  return { allArticles, refresh };
}
