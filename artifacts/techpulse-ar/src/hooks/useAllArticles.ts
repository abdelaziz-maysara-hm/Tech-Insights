import { useState, useEffect, useCallback } from 'react';
import { Article } from '@/data/mockData';
import { mockArticles } from '@/data/mockData';
import adminArticlesJson from '@/content/articles.json';

/**
 * Merges all article sources:
 *  1. Admin-published articles (src/content/articles.json — managed via the
 *     /admin CMS panel and committed to GitHub; Netlify rebuilds pick these up)
 *  2. Core mockArticles (IDs 1-8 only; 9-21 were generic placeholders)
 *  3. Extended articles (200+ entries) — loaded lazily after mount
 *  4. Troubleshooting articles (30 how-to guides) — loaded lazily after mount
 *
 * Lazy-loading the large datasets keeps the initial bundle light and lets
 * the page render immediately with the core articles.
 */
export function useAllArticles() {
  const [extended, setExtended]                   = useState<Article[]>([]);
  const [troubleshooting, setTroubleshooting]     = useState<Article[]>([]);

  const customArticles = adminArticlesJson as unknown as Article[];

  // Kept for backwards compatibility with callers that used to force a
  // localStorage re-read; admin content now comes from a build-time JSON
  // import, so there is nothing to refresh at runtime beyond a full reload.
  const refresh = useCallback(() => {}, []);

  // Lazy-load the two large static datasets in parallel
  useEffect(() => {
    let cancelled = false;

    Promise.all([
      import('@/data/articlesData'),
      import('@/data/troubleshootingArticles'),
    ]).then(([extMod, tsMod]) => {
      if (cancelled) return;
      setExtended(extMod.extendedArticles);
      setTroubleshooting(tsMod.troubleshootingArticles);
    });

    return () => { cancelled = true; };
  }, []);

  const coreArticles = mockArticles.filter(a => {
    const n = parseInt(a.id);
    return isNaN(n) || n < 9 || n > 21;
  });

  const allArticles: Article[] = [
    ...customArticles,
    ...coreArticles,
    ...troubleshooting,
    ...extended,
  ];

  return { allArticles, refresh };
}
