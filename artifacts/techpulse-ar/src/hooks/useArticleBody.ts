import { useEffect, useState } from 'react';
import { Article, BilingualText } from '@/data/mockData';
import articlesIndexJson from '@/content/articles-index.json';
import { getSsrData } from '@/ssr-data';

const index = articlesIndexJson as unknown as Omit<Article, 'body'>[];

/**
 * Loads ONE article: metadata from the (already bundled) article index and
 * the body from /content/articles/<slug>.json, a small per-article file
 * written at build time by scripts/generate-article-bodies.mjs.
 *
 * When the prerender inlined the same article on `window.__NSS_DATA__`, the
 * first render (server and client) uses that body so hydrateRoot matches.
 */
export function useArticleBody(slug: string | undefined) {
  const inlined = slug ? inlineArticle(slug) : undefined;
  const [article, setArticle] = useState<Article | null | undefined>(() => {
    if (!slug) return null;
    if (inlined) return inlined;
    return undefined;
  });

  useEffect(() => {
    const meta = slug ? index.find((a) => a.slug === slug) : undefined;
    if (!slug || !meta) {
      setArticle(null);
      return;
    }
    if (inlined && inlined.slug === slug) {
      setArticle(inlined);
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
  }, [slug, inlined]);

  return { article, isLoading: article === undefined };
}

function inlineArticle(slug: string): Article | undefined {
  const data = getSsrData();
  if (data?.article && data.article.slug === slug && data.article.body) {
    return data.article;
  }
  return undefined;
}
