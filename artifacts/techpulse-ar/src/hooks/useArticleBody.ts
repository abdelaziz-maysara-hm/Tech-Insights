import { useEffect, useState } from 'react';
import { Article, BilingualText } from '@/data/mockData';
import articlesIndexJson from '@/content/articles-index.json';

const index = articlesIndexJson as unknown as Omit<Article, 'body'>[];

/**
 * Loads ONE article: metadata from the (already bundled) article index and
 * the body from /content/articles/<slug>.json, a small per-article file
 * written at build time by scripts/generate-article-bodies.mjs. Visitors no
 * longer download every article's body to read one.
 */
export function useArticleBody(slug: string | undefined) {
  const [article, setArticle] = useState<Article | null | undefined>(undefined);

  useEffect(() => {
    const meta = slug ? index.find((a) => a.slug === slug) : undefined;
    if (!slug || !meta) {
      setArticle(null);
      return;
    }
    let cancelled = false;
    setArticle(undefined);
    const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
    fetch(`${base}content/articles/${encodeURIComponent(slug)}.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { body: BilingualText }) => {
        if (!cancelled) setArticle({ ...(meta as Article), body: data.body });
      })
      .catch(() => {
        if (!cancelled) setArticle(null);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { article, isLoading: article === undefined };
}
