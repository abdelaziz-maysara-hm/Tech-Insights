import { useState, useEffect, useCallback } from 'react';
import { Article } from '@/data/mockData';
import { mockArticles } from '@/data/mockData';
import { getCustomArticles } from '@/data/adminStore';

/**
 * Merges all article sources:
 *  1. Custom articles (localStorage – admin panel)
 *  2. Core mockArticles (IDs 1-8 only; 9-21 were generic placeholders)
 *  3. Extended articles (200+ entries) — loaded lazily after mount
 *  4. Troubleshooting articles (30 how-to guides) — loaded lazily after mount
 *
 * Lazy-loading the large datasets keeps the initial bundle light and lets
 * the page render immediately with the core articles.
 */
export function useAllArticles() {
  const [customArticles, setCustomArticles]       = useState<Article[]>([]);
  const [extended, setExtended]                   = useState<Article[]>([]);
  const [troubleshooting, setTroubleshooting]     = useState<Article[]>([]);

  // Reload custom articles from localStorage
  const refresh = useCallback(() => {
    setCustomArticles(getCustomArticles());
  }, []);

  // Custom articles + storage event listener
  useEffect(() => {
    refresh();
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, [refresh]);

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
