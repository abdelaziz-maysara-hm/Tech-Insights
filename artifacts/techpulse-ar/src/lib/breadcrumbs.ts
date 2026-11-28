/**
 * Breadcrumb trails shared by the React tree (visible nav) and prerender (JSON-LD).
 */
import { TOPICS_BY_ID } from '../data/taxonomy/topics.ts';
import { DOMAINS_BY_ID } from '../data/taxonomy/domains.ts';

export type BreadcrumbItem = {
  label: string;
  href: string | null;
};

export type BreadcrumbContext = {
  lang: 'ar' | 'en';
  title: string;
  article?: { topicIds?: string[] };
  playlist?: { slug: string; title: { ar: string; en: string } };
  topicId?: string;
  domainId?: string;
  pageSlug?: string;
};

const UI = {
  home: { ar: 'الرئيسية', en: 'Home' },
  articles: { ar: 'المقالات', en: 'Articles' },
  comparisons: { ar: 'مقارنات', en: 'Comparisons' },
  troubleshooting: { ar: 'استكشاف الأعطال', en: 'Troubleshooting' },
  guides: { ar: 'أدلة', en: 'Guides' },
  tools: { ar: 'أدوات', en: 'Tools' },
  alternatives: { ar: 'بدائل', en: 'Alternatives' },
  vendors: { ar: 'الموردون', en: 'Vendors' },
  videos: { ar: 'مكتبة الفيديو', en: 'Video library' },
  categories: { ar: 'الأقسام', en: 'Categories' },
};

const DOMAIN_PAGES = new Set(['cybersecurity', 'networking', 'infrastructure']);

export function breadcrumbTrailFor(identity: string, ctx: BreadcrumbContext): BreadcrumbItem[] {
  const lang = ctx.lang;
  const t = (key: keyof typeof UI) => UI[key][lang];
  const trail: BreadcrumbItem[] = [{ label: t('home'), href: '/' }];

  if (identity === '/' || identity === '') return trail;

  let m: RegExpMatchArray | null;
  if ((m = identity.match(/^\/article\/([^/]+)$/))) {
    trail.push({ label: t('articles'), href: '/articles' });
    const topicId = (ctx.article?.topicIds ?? []).map((id) => TOPICS_BY_ID[id]?.id).find(Boolean);
    if (topicId && TOPICS_BY_ID[topicId]) {
      trail.push({ label: TOPICS_BY_ID[topicId].label[lang], href: `/topic/${topicId}` });
    }
    trail.push({ label: ctx.title, href: null });
    return trail;
  }
  if (identity.startsWith('/comparison/')) {
    trail.push({ label: t('comparisons'), href: '/comparisons' }, { label: ctx.title, href: null });
    return trail;
  }
  if (identity.startsWith('/vendors/')) {
    trail.push({ label: t('vendors'), href: '/vendors' }, { label: ctx.title, href: null });
    return trail;
  }
  if (identity.startsWith('/alternatives/')) {
    trail.push({ label: t('alternatives'), href: '/alternatives' }, { label: ctx.title, href: null });
    return trail;
  }
  if (identity.startsWith('/videos/')) {
    trail.push({ label: t('videos'), href: '/videos' }, { label: ctx.title, href: null });
    return trail;
  }
  if (identity.startsWith('/video/')) {
    trail.push({ label: t('videos'), href: '/videos' });
    if (ctx.playlist) {
      trail.push({ label: ctx.playlist.title[lang], href: `/videos/${ctx.playlist.slug}` });
    }
    trail.push({ label: ctx.title, href: null });
    return trail;
  }
  if ((m = identity.match(/^\/topic\/([^/]+)$/))) {
    const topic = TOPICS_BY_ID[m[1]];
    const domainId = topic?.domainId;
    if (domainId && DOMAIN_PAGES.has(domainId) && DOMAINS_BY_ID[domainId]) {
      trail.push({ label: t('categories'), href: '/categories' });
      trail.push({ label: DOMAINS_BY_ID[domainId].label[lang], href: `/domain/${domainId}` });
    }
    trail.push({ label: topic ? topic.label[lang] : ctx.title, href: null });
    return trail;
  }
  if ((m = identity.match(/^\/domain\/([^/]+)$/))) {
    trail.push({ label: t('categories'), href: '/categories' });
    trail.push({ label: ctx.title, href: null });
    return trail;
  }
  if (identity.startsWith('/page/')) {
    trail.push({ label: ctx.title, href: null });
    return trail;
  }

  const sections: Record<string, keyof typeof UI> = {
    '/articles': 'articles',
    '/comparisons': 'comparisons',
    '/videos': 'videos',
    '/categories': 'categories',
    '/troubleshooting': 'troubleshooting',
    '/guides': 'guides',
    '/tools': 'tools',
    '/alternatives': 'alternatives',
    '/vendors': 'vendors',
  };
  if (sections[identity]) {
    trail.push({ label: t(sections[identity]), href: null });
    return trail;
  }

  trail.push({ label: ctx.title, href: null });
  return trail;
}
