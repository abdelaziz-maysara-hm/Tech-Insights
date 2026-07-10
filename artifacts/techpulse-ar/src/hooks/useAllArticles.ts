import { useState, useEffect, useCallback } from 'react';
import { Article } from '@/data/mockData';
import { mockArticles } from '@/data/mockData';
import { extendedArticles } from '@/data/articlesData';
import { getCustomArticles } from '@/data/adminStore';

export function useAllArticles() {
  const [customArticles, setCustomArticles] = useState<Article[]>([]);

  const refresh = useCallback(() => {
    setCustomArticles(getCustomArticles());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, [refresh]);

  const allArticles = [
    ...customArticles,
    ...mockArticles.filter(a => {
      const numId = parseInt(a.id);
      return isNaN(numId) || numId < 9 || numId > 21;
    }),
    ...extendedArticles
  ];
  
  return { allArticles, refresh };
}