import type { Article } from '@/data/mockData';

export type ContentIssue = {
  slug: string;
  severity: 'error' | 'warn';
  code: string;
  message: string;
};

function textLen(v: unknown): number {
  if (typeof v === 'string') return v.trim().length;
  if (v && typeof v === 'object') {
    const o = v as { ar?: string; en?: string };
    return (o.ar || '').trim().length + (o.en || '').trim().length;
  }
  return 0;
}

export function estimateReadTime(body: { ar?: string; en?: string } | string | undefined): number {
  const raw = typeof body === 'string' ? body : `${body?.ar || ''} ${body?.en || ''}`;
  const words = raw.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.min(30, Math.round(words / 200) || 3));
}

export function contentScore(article: Article): number {
  let score = 100;
  if (!article.heroImage) score -= 20;
  if (!article.tags?.length) score -= 15;
  if (!article.categoryId) score -= 20;
  if (textLen(article.excerpt) < 40) score -= 15;
  if (textLen(article.body) < 200) score -= 20;
  if (!article.date) score -= 5;
  return Math.max(0, score);
}

export function auditArticles(articles: Article[]): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const slugs = new Map<string, number>();
  const titleKeys = new Map<string, string>();

  for (const a of articles) {
    const slug = a.slug || a.id;
    slugs.set(slug, (slugs.get(slug) || 0) + 1);
    if (!a.heroImage) issues.push({ slug, severity: 'error', code: 'missing_hero', message: 'Missing hero image' });
    if (!a.categoryId) issues.push({ slug, severity: 'error', code: 'missing_category', message: 'Missing category' });
    if (!a.tags?.length) issues.push({ slug, severity: 'warn', code: 'missing_tags', message: 'Missing tags' });
    if (textLen(a.excerpt) < 40) issues.push({ slug, severity: 'warn', code: 'weak_excerpt', message: 'Excerpt too short' });
    if (textLen(a.body) < 200) issues.push({ slug, severity: 'warn', code: 'short_body', message: 'Body too short' });
    const titleKey = `${a.title?.ar || ''}|${a.title?.en || ''}`.toLowerCase();
    if (titleKey.length > 2) {
      if (titleKeys.has(titleKey)) {
        issues.push({ slug, severity: 'error', code: 'duplicate_title', message: `Duplicate title of ${titleKeys.get(titleKey)}` });
      } else titleKeys.set(titleKey, slug);
    }
  }
  for (const [slug, n] of slugs) {
    if (n > 1) issues.push({ slug, severity: 'error', code: 'duplicate_slug', message: `Slug repeated ${n} times` });
  }
  return issues;
}

export function isValidYoutubeId(id: string | undefined | null): boolean {
  return Boolean(id && /^[\w-]{11}$/.test(id));
}
