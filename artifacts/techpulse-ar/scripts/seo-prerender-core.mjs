/**
 * Build-time static SEO HTML injection for GitHub Pages (Phase 6A).
 * Sitemap-driven route materialization with route-specific metadata.
 * Not SSR — React hydrates from the Vite SPA shell.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export const SITE = {
  name: 'NetSec Atlas',
  url: 'https://netsecatlas.com',
  taglineEn: 'Practical Network, Security & IT Knowledge',
  taglineAr: 'معرفة عملية في الشبكات والأمن وتقنية المعلومات',
  descriptionEn:
    'Practical network, security and IT knowledge for cybersecurity professionals, network engineers, system administrators and infrastructure teams. Troubleshooting, guides, comparisons and professional tools.',
  descriptionAr:
    'معرفة عملية في الشبكات والأمن وتقنية المعلومات لمتخصصي الأمن السيبراني ومهندسي الشبكات ومسؤولي الأنظمة وفرق البنية التحتية. استكشاف الأعطال، أدلة عملية، مقارنات وأدوات احترافية.',
  defaultAuthorEn: 'NetSec Atlas',
  defaultAuthorAr: 'NetSec Atlas',
  organization: { name: 'NetSec Atlas', url: 'https://netsecatlas.com' },
};

const SECTION_META = {
  '/': {
    title: { ar: SITE.name, en: SITE.name },
    description: { ar: SITE.descriptionAr, en: SITE.descriptionEn },
  },
  '/articles': {
    title: { ar: 'المقالات', en: 'Articles' },
    description: {
      ar: 'مقالات عملية في الشبكات والأمن وتقنية المعلومات.',
      en: 'Practical articles on networking, security and IT.',
    },
  },
  '/comparisons': {
    title: { ar: 'مقارنات', en: 'Comparisons' },
    description: {
      ar: 'مقارنات احترافية بين حلول وتقنيات الشبكات والأمن.',
      en: 'Professional comparisons of network and security solutions.',
    },
  },
  '/troubleshooting': {
    title: { ar: 'استكشاف الأخطاء وإصلاحها', en: 'Troubleshooting' },
    description: {
      ar: 'حلول عملية لمشاكل الشبكات والأمن والأنظمة.',
      en: 'Practical fixes for network, security and systems problems.',
    },
  },
  '/guides': {
    title: { ar: 'أدلة', en: 'Guides' },
    description: {
      ar: 'أدلة عملية لتكوين وتشغيل تقنيات الشبكات والأمن.',
      en: 'Practical guides for configuring and operating network and security technologies.',
    },
  },
  '/tools': {
    title: { ar: 'أدوات', en: 'Tools' },
    description: {
      ar: 'أدوات هندسية عملية للشبكات والأمن وتقنية المعلومات.',
      en: 'Practical engineering tools for networking, security and IT.',
    },
  },
  '/vendors': {
    title: { ar: 'الموردون', en: 'Vendors' },
    description: {
      ar: 'موردو حلول الشبكات والأمن المؤسسية ومنتجاتهم.',
      en: 'Enterprise network and security vendors and their products.',
    },
  },
  '/categories': {
    title: { ar: 'الأقسام', en: 'Categories' },
    description: {
      ar: 'تصفح المحتوى حسب الأقسام التقنية.',
      en: 'Browse content by technical categories.',
    },
  },
  '/videos': {
    title: { ar: 'فيديو', en: 'Videos' },
    description: {
      ar: 'مقاطع فيديو تقنية عملية.',
      en: 'Practical technical videos.',
    },
  },
  '/search': {
    title: { ar: 'بحث', en: 'Search' },
    description: {
      ar: 'ابحث في معرفة NetSec Atlas العملية.',
      en: 'Search NetSec Atlas practical knowledge.',
    },
  },
};

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function escapeAttr(value) {
  return escapeHtml(value).replaceAll('`', '&#96;');
}

export function safeJsonLd(data) {
  return JSON.stringify(data)
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026');
}

export function pickLocalized(field, lang) {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'object') {
    const value = field[lang] ?? field.en ?? field.ar ?? '';
    return typeof value === 'string' ? value : '';
  }
  return '';
}

function loadJson(relativePath) {
  try {
    const value = JSON.parse(readFileSync(join(root, relativePath), 'utf8'));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function loadPolicy() {
  try {
    return JSON.parse(readFileSync(join(root, 'src/config/hreflang-policy.json'), 'utf8'));
  } catch {
    return { reviewedContentRoutes: [], eligibleDiscoveryRoutes: [] };
  }
}

export function parseTaxonomyDefs(source) {
  const items = [];
  const blockRe =
    /\{\s*id:\s*'([^']+)',\s*(?:shortLabel:[\s\S]*?,)?\s*label:\s*\{\s*ar:\s*'((?:\\'|[^'])*)'\s*,\s*en:\s*'((?:\\'|[^'])*)'\s*\}([\s\S]*?)(?=\n  \{|\n\];)/g;
  let match;
  while ((match = blockRe.exec(source))) {
    const id = match[1];
    const ar = match[2].replaceAll("\\'", "'");
    const en = match[3].replaceAll("\\'", "'");
    let description = { ar: '', en: '' };
    const tail = match[4] || '';
    const descMatch = tail.match(
      /description:\s*\{[\s\S]*?ar:\s*'([^']*)'[\s\S]*?en:\s*'([^']*)'/,
    );
    if (descMatch) {
      description = { ar: descMatch[1], en: descMatch[2] };
    }
    items.push({ id, label: { ar, en }, description });
  }
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function loadContentIndexes() {
  const articles = loadJson('src/content/articles.json');
  const comparisons = loadJson('src/content/comparisons.json');
  const pages = loadJson('src/content/pages.json');
  const policy = loadPolicy();
  let vendors = [];
  let domains = [];
  try {
    vendors = parseTaxonomyDefs(readFileSync(join(root, 'src/data/taxonomy/vendors.ts'), 'utf8'));
  } catch {}
  try {
    domains = parseTaxonomyDefs(readFileSync(join(root, 'src/data/taxonomy/domains.ts'), 'utf8'));
  } catch {}
  return {
    articlesBySlug: new Map(articles.map((a) => [a.slug, a])),
    comparisonsBySlug: new Map(comparisons.map((c) => [c.slug, c])),
    pagesBySlug: new Map(pages.map((p) => [p.slug, p])),
    vendorsById: new Map(vendors.map((v) => [v.id, v])),
    domainsById: new Map(domains.map((d) => [d.id, d])),
    reviewedContentRoutes: new Set(policy.reviewedContentRoutes || []),
    eligibleDiscoveryRoutes: new Set(policy.eligibleDiscoveryRoutes || []),
  };
}

export function routeIdentityFromPathname(pathname) {
  const cleaned = pathname.replace(/\/+/g, '/');
  const m = cleaned.match(/^\/(ar|en)(\/.*)?$/);
  if (!m) return cleaned.replace(/\/+$/, '') || '/';
  const rest = m[2] || '/';
  return rest.replace(/\/+$/, '') || '/';
}

export function detectLocale(pathname) {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
  if (pathname === '/ar' || pathname.startsWith('/ar/')) return 'ar';
  return 'ar';
}

export function isHreflangEligibleForRoute(identity, indexes) {
  return (
    indexes.eligibleDiscoveryRoutes.has(identity) ||
    indexes.reviewedContentRoutes.has(identity)
  );
}

export function buildHreflangAlternates(identity, eligible) {
  if (!eligible) return [];
  const arHref = identity === '/' ? `${SITE.url}/ar/` : `${SITE.url}/ar${identity}`;
  const enHref = identity === '/' ? `${SITE.url}/en/` : `${SITE.url}/en${identity}`;
  return [
    { hreflang: 'ar', href: arHref },
    { hreflang: 'en', href: enHref },
    { hreflang: 'x-default', href: arHref },
  ];
}

export function resolveRouteSeo(pathname, indexes) {
  const lang = detectLocale(pathname);
  const identity = routeIdentityFromPathname(pathname);
  let canonical = `${SITE.url}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
  if (pathname === '/ar' || pathname === '/ar/') canonical = `${SITE.url}/ar/`;
  if (pathname === '/en' || pathname === '/en/') canonical = `${SITE.url}/en/`;
  if (!/^https:\/\/netsecatlas\.com\/(ar|en)\/$/.test(canonical)) {
    canonical = canonical.replace(/\/$/, '');
  }

  const eligible = isHreflangEligibleForRoute(identity, indexes);
  const alternates = buildHreflangAlternates(identity, eligible);
  const base = {
    lang,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    canonical,
    alternates,
    type: 'website',
    title: '',
    description: '',
    image: '',
    datePublished: '',
    authorName: '',
    source: 'fallback',
  };

  let m;
  if ((m = identity.match(/^\/article\/([^/]+)$/))) {
    const article = indexes.articlesBySlug.get(m[1]);
    if (article) {
      return {
        ...base,
        type: 'article',
        title: pickLocalized(article.title, lang),
        description: pickLocalized(article.excerpt, lang),
        image: typeof article.heroImage === 'string' ? article.heroImage : '',
        datePublished: article.date || '',
        authorName:
          pickLocalized(article.author?.name, lang) ||
          (lang === 'ar' ? SITE.defaultAuthorAr : SITE.defaultAuthorEn),
        source: 'article',
      };
    }
  }
  if ((m = identity.match(/^\/comparison\/([^/]+)$/))) {
    const item = indexes.comparisonsBySlug.get(m[1]);
    if (item) {
      return {
        ...base,
        type: 'article',
        title: pickLocalized(item.title, lang),
        description: pickLocalized(item.excerpt, lang),
        image: typeof item.heroImage === 'string' ? item.heroImage : '',
        datePublished: item.date || '',
        authorName: lang === 'ar' ? SITE.defaultAuthorAr : SITE.defaultAuthorEn,
        source: 'comparison',
      };
    }
  }
  if ((m = identity.match(/^\/page\/([^/]+)$/))) {
    const item = indexes.pagesBySlug.get(m[1]);
    if (item) {
      return {
        ...base,
        title: pickLocalized(item.title, lang),
        description: lang === 'ar' ? SITE.descriptionAr : SITE.descriptionEn,
        source: 'page',
      };
    }
  }
  if ((m = identity.match(/^\/vendors\/([^/]+)$/))) {
    const vendor = indexes.vendorsById.get(m[1]);
    if (vendor) {
      return {
        ...base,
        title: pickLocalized(vendor.label, lang),
        description:
          pickLocalized(vendor.description, lang) ||
          (lang === 'ar' ? SITE.descriptionAr : SITE.descriptionEn),
        source: 'vendor',
      };
    }
  }
  if ((m = identity.match(/^\/domain\/([^/]+)$/))) {
    const domain = indexes.domainsById.get(m[1]);
    if (domain) {
      return {
        ...base,
        title: pickLocalized(domain.label, lang),
        description:
          pickLocalized(domain.description, lang) ||
          (lang === 'ar' ? SITE.descriptionAr : SITE.descriptionEn),
        source: 'domain',
      };
    }
  }

  const section = SECTION_META[identity];
  if (section) {
    return {
      ...base,
      title: pickLocalized(section.title, lang),
      description: pickLocalized(section.description, lang),
      source: identity === '/' ? 'home' : 'section',
    };
  }

  return {
    ...base,
    title: SITE.name,
    description: lang === 'ar' ? SITE.descriptionAr : SITE.descriptionEn,
    source: 'fallback',
  };
}

export function fullDocumentTitle(seo) {
  if (!seo.title || seo.title === SITE.name) {
    return `${SITE.name} - ${seo.lang === 'ar' ? SITE.taglineAr : SITE.taglineEn}`;
  }
  return `${seo.title} | ${SITE.name}`;
}
