/**
 * Helpers to associate existing CMS content with the multi-dimensional taxonomy
 * without rewriting or duplicating articles.
 */
import type { ArticleListItem } from '@/data/mockData';
import {
  type DomainId,
  type ContentTypeId,
  matchVendorsFromText,
  VENDORS_BY_ID,
} from '@/data/taxonomy';

/** Map legacy CMS categoryId → primary domain hints */
const LEGACY_CATEGORY_TO_DOMAIN: Record<string, DomainId[]> = {
  cybersecurity: ['cybersecurity'],
  windows: ['infrastructure'],
  howto: ['guides'],
  comparisons: ['comparisons'],
  technology: ['infrastructure', 'networking'],
  mobile: [],
  laptops: [],
  ai: [],
  reviews: [],
};

function articleSearchText(a: ArticleListItem): string {
  const tags = (a.tags ?? []).join(' ');
  return [
    a.title?.en,
    a.title?.ar,
    a.excerpt?.en,
    a.excerpt?.ar,
    tags,
    a.categoryId,
    a.subcategoryId,
    a.slug,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

/** Infer content type from title/tags/slug heuristics (non-destructive). */
export function inferContentType(a: ArticleListItem): ContentTypeId | undefined {
  const t = articleSearchText(a);
  if (
    /troubleshoot|fix|error|failed|not working|issue|problem|استكشاف|خطأ|فشل|مشكلة/.test(t)
  ) {
    return 'troubleshooting';
  }
  if (/vs |versus|مقارنة|comparison/.test(t) || a.categoryId === 'comparisons') {
    return 'comparison';
  }
  if (/how to|how-to|step by step|تكوين|دليل|guide|setup|deploy/.test(t)) {
    return 'guide';
  }
  if (/what is|concept|explained|مفهوم/.test(t)) {
    return 'concept';
  }
  if (a.categoryId === 'howto') return 'how-to';
  return undefined;
}

export function inferDomains(a: ArticleListItem): DomainId[] {
  const domains = new Set<DomainId>();
  const legacy = LEGACY_CATEGORY_TO_DOMAIN[a.categoryId] ?? [];
  for (const d of legacy) domains.add(d);

  const t = articleSearchText(a);
  if (/firewall|vpn|dns|dhcp|routing|switching|network|شبكة|جدار/.test(t)) {
    domains.add('networking');
  }
  if (
    /security|endpoint|siem|soc|iam|pam|dlp|zero trust|malware|ransomware|أمن|سيبراني/.test(
      t,
    )
  ) {
    domains.add('cybersecurity');
  }
  if (
    /windows server|active directory|linux|vmware|esxi|vcenter|backup|certificate|pki|azure|aws/.test(
      t,
    )
  ) {
    domains.add('infrastructure');
  }
  if (inferContentType(a) === 'troubleshooting') {
    domains.add('troubleshooting');
  }
  if (inferContentType(a) === 'guide' || inferContentType(a) === 'how-to') {
    domains.add('guides');
  }
  return [...domains];
}

export function inferVendors(a: ArticleListItem): string[] {
  return matchVendorsFromText(articleSearchText(a));
}

export function filterByDomain(articles: ArticleListItem[], domainId: DomainId): ArticleListItem[] {
  return articles.filter((a) => inferDomains(a).includes(domainId));
}

export function filterByVendor(articles: ArticleListItem[], vendorId: string): ArticleListItem[] {
  return articles.filter((a) => inferVendors(a).includes(vendorId));
}

export function filterTroubleshooting(articles: ArticleListItem[]): ArticleListItem[] {
  return articles.filter((a) => {
    if (inferContentType(a) === 'troubleshooting') return true;
    return inferDomains(a).includes('troubleshooting');
  });
}

export function filterGuides(articles: ArticleListItem[]): ArticleListItem[] {
  return articles.filter((a) => {
    const ct = inferContentType(a);
    return ct === 'guide' || ct === 'how-to' || a.categoryId === 'howto';
  });
}

export function vendorLabel(vendorId: string, lang: 'ar' | 'en'): string {
  const v = VENDORS_BY_ID[vendorId];
  if (!v) return vendorId;
  return (v.shortLabel ?? v.label)[lang];
}
