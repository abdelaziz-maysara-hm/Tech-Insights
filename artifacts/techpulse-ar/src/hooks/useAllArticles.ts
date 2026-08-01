import { useCallback, useEffect, useState } from 'react';
import { Article } from '@/data/mockData';
import adminArticlesJson from '@/content/articles.json';

/**
 * Prefer live CMS (same data admin import writes).
 * Fallback to build-time JSON if API is unavailable.
 */
export function useAllArticles() {
  const bundled = adminArticlesJson as unknown as Article[];
  const [allArticles, setAllArticles] = useState<Article[]>(bundled);

  const refresh = useCallback(() => {
    fetch('/api/cms/public/articles')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        const items = Array.isArray(data?.items) ? (data.items as Article[]) : [];
        if (items.length > 0) setAllArticles(items);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { allArticles, refresh };
}
