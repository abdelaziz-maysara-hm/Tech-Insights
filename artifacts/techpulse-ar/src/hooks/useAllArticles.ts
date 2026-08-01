import { useCallback, useEffect, useState } from 'react';
import { Article } from '@/data/mockData';
import adminArticlesJson from '@/content/articles.json';

/**
 * Public articles: prefer live CMS API (same source admin writes to),
 * fall back to build-time JSON so the site always renders.
 */
export function useAllArticles() {
  const bundled = adminArticlesJson as unknown as Article[];
  const [allArticles, setAllArticles] = useState<Article[]>(bundled);

  const refresh = useCallback(() => {
    fetch('/api/cms/public/articles', { credentials: 'omit' })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        const items = Array.isArray(data?.items) ? (data.items as Article[]) : [];
        if (items.length) setAllArticles(items);
      })
      .catch(() => {
        /* keep bundled */
      });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { allArticles, refresh };
}
