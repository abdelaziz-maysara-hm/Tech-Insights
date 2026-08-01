/**
 * Weighted search ranking + synonym expansion.
 * Weights (RP-032): Title 10, Tags 8, Technology/category 7, Summary 5, Body 3
 */
import type { Article } from '@/data/mockData';

/** Synonym groups (RP-033) — query terms expand to all group members. */
const SYNONYM_GROUPS: string[][] = [
  ['av', 'antivirus', 'anti-virus', 'مضاد فيروسات', 'انتي فيروس', 'انتيفايروس'],
  ['edr', 'endpoint detection', 'endpoint detection and response', 'كشف نقاط النهاية'],
  ['siem', 'security information and event management', 'سيم'],
  ['xdr', 'extended detection and response'],
  ['defender', 'microsoft defender', 'windows defender', 'ديفندر'],
  ['ssd', 'solid state', 'solid state drive'],
  ['hdd', 'hard disk', 'هارد ديسك'],
  ['vpn', 'في بي ان', 'شبكة خاصة'],
  ['password', 'كلمات مرور', 'كلمة مرور', 'باسورد'],
  ['battery', 'بطارية'],
  ['android', 'اندرويد', 'أندرويد'],
  ['iphone', 'آيفون', 'ايفون', 'ios'],
  ['windows', 'ويندوز'],
  ['react', 'ريأكت', 'رياكت'],
  ['ai', 'ذكاء اصطناعي', 'artificial intelligence'],
  ['backup', 'نسخ احتياطي', 'باك اب'],
  ['bsod', 'شاشة زرقاء', 'blue screen'],
];

function expandQueryTerms(raw: string): string[] {
  const q = raw.trim().toLowerCase();
  if (!q) return [];
  const terms = new Set<string>([q]);
  for (const token of q.split(/\s+/).filter(Boolean)) {
    terms.add(token);
  }
  for (const group of SYNONYM_GROUPS) {
    const hit = group.some((g) => q.includes(g) || terms.has(g));
    if (hit) {
      for (const g of group) terms.add(g);
    }
  }
  return [...terms];
}

function fieldScore(text: string | undefined | null, terms: string[], weight: number): number {
  if (!text) return 0;
  const lower = text.toLowerCase();
  let hits = 0;
  for (const t of terms) {
    if (t && lower.includes(t)) hits += 1;
  }
  if (hits === 0) return 0;
  return weight * hits;
}

export interface RankedArticle {
  article: Article;
  score: number;
}

/**
 * Rank articles by relevance to query. Returns only positive-score matches, highest first.
 */
export function rankArticles(
  articles: Article[],
  query: string,
  categoryFilter?: string,
): RankedArticle[] {
  const terms = expandQueryTerms(query);
  const hasQuery = terms.length > 0;

  const ranked: RankedArticle[] = [];

  for (const a of articles) {
    if (categoryFilter && categoryFilter !== 'all' && a.categoryId !== categoryFilter) {
      continue;
    }
    if (!hasQuery) {
      if (categoryFilter && categoryFilter !== 'all') {
        ranked.push({ article: a, score: 1 });
      }
      continue;
    }

    let score = 0;
    score += fieldScore(a.title?.ar, terms, 10);
    score += fieldScore(a.title?.en, terms, 10);
    score += fieldScore((a.tags ?? []).join(' '), terms, 8);
    score += fieldScore(a.categoryId, terms, 7);
    score += fieldScore(a.subcategoryId, terms, 7);
    score += fieldScore(a.excerpt?.ar, terms, 5);
    score += fieldScore(a.excerpt?.en, terms, 5);
    score += fieldScore(a.body?.ar, terms, 3);
    score += fieldScore(a.body?.en, terms, 3);

    if (score > 0) ranked.push({ article: a, score });
  }

  ranked.sort((x, y) => y.score - x.score);
  return ranked;
}
