import { useEffect, useState } from 'react';
import { Article } from '@/data/mockData';

/**
 * Fetches ONE article's full data (including body) by slug, via a dynamic
 * import of the full articles.json. Vite code-splits this into its own
 * chunk, so the body text of every article is not part of the main bundle
 * or any listing page's bundle -- only a visitor who actually opens an
 * article detail page downloads the full content file, once.
 */
export function useArticleBody(slug: string | undefined) {
  const [article, setArticle] = useState<Article | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) {
      setArticle(null);
      return;
    }
    let cancelled = false;
    setArticle(undefined);
    import('@/content/articles.json').then((mod) => {
      if (cancelled) return;
      const all = mod.default as unknown as Article[];
      setArticle(all.find((a) => a.slug === slug) ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { article, isLoading: article === undefined };
}
