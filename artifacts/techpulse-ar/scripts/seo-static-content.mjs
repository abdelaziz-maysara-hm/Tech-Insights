/**
 * Build-time static body HTML for prerendered routes.
 *
 * GitHub Pages serves a Vite SPA whose <div id="root"> is empty until
 * JavaScript runs. Crawlers that do not execute JS (Bing, social/link-preview
 * bots, AI crawlers) and Google's first indexing wave therefore saw no
 * content. This module renders real, semantic, crawlable HTML (headings,
 * article body, breadcrumbs, related-article links, site navigation) for every
 * sitemap route. React's createRoot() replaces it on mount, so the live UI is
 * unchanged for visitors with JavaScript.
 */
import { markdownToHtml } from '../src/lib/markdown.ts';
import { getRelatedArticles, getAdjacentArticles } from '../src/lib/relatedContent.ts';
import { SITE, escapeHtml, escapeAttr, pickLocalized } from './seo-prerender-core.mjs';

const UI = {
  home: { ar: 'الرئيسية', en: 'Home' },
  articles: { ar: 'المقالات', en: 'Articles' },
  comparisons: { ar: 'مقارنات', en: 'Comparisons' },
  troubleshooting: { ar: 'استكشاف الأعطال', en: 'Troubleshooting' },
  guides: { ar: 'أدلة', en: 'Guides' },
  tools: { ar: 'أدوات', en: 'Tools' },
  vendors: { ar: 'الموردون', en: 'Vendors' },
  videos: { ar: 'فيديو', en: 'Videos' },
  categories: { ar: 'الأقسام', en: 'Categories' },
  related: { ar: 'مقالات ذات صلة', en: 'Related articles' },
  latest: { ar: 'أحدث المقالات', en: 'Latest articles' },
  latestComparisons: { ar: 'أحدث المقارنات', en: 'Latest comparisons' },
  previous: { ar: 'المقال السابق', en: 'Previous article' },
  next: { ar: 'المقال التالي', en: 'Next article' },
  readTime: { ar: 'دقائق قراءة', en: 'min read' },
  verdict: { ar: 'الخلاصة', en: 'Verdict' },
  otherLanguage: { ar: 'English', en: 'العربية' },
  sitePages: { ar: 'عن الموقع', en: 'About the site' },
  rss: { ar: 'خلاصة RSS', en: 'RSS feed' },
  feature: { ar: 'المعيار', en: 'Criterion' },
};

const CATEGORY = {
  cybersecurity: { ar: 'أمن المعلومات', en: 'Cybersecurity' },
  mobile: { ar: 'الهواتف', en: 'Mobile' },
  laptops: { ar: 'اللابتوب', en: 'Laptops' },
  howto: { ar: 'حلول تقنية', en: 'How-To' },
  ai: { ar: 'الذكاء الاصطناعي', en: 'AI' },
  reviews: { ar: 'مراجعات', en: 'Reviews' },
  windows: { ar: 'ويندوز', en: 'Windows' },
  technology: { ar: 'تقنية', en: 'Technology' },
  comparisons: { ar: 'مقارنات', en: 'Comparisons' },
};

const NAV = ['/articles', '/comparisons', '/troubleshooting', '/guides', '/tools', '/vendors'];
const NAV_KEY = {
  '/articles': 'articles',
  '/comparisons': 'comparisons',
  '/troubleshooting': 'troubleshooting',
  '/guides': 'guides',
  '/tools': 'tools',
  '/vendors': 'vendors',
  '/videos': 'videos',
  '/categories': 'categories',
};

const t = (key, lang) => UI[key]?.[lang] ?? key;

export function localizedHref(identity, lang) {
  return identity === '/' ? `/${lang}/` : `/${lang}${identity}`;
}

function byDateDesc(a, b) {
  return String(b.date || '').localeCompare(String(a.date || ''));
}

function articleText(a) {
  return [a.title?.en, a.title?.ar, a.excerpt?.en, a.excerpt?.ar, ...(a.tags || []), a.slug]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

const TROUBLESHOOT_RE = /troubleshoot|fix|error|failed|not working|issue|problem|استكشاف|خطأ|فشل|مشكلة/;
const GUIDE_RE = /how to|how-to|step by step|تكوين|دليل|guide|setup|deploy/;
const NETWORK_RE = /network|vlan|dns|dhcp|bgp|ospf|subnet|router|switch|wi-?fi|vpn|firewall|tcp|ip\b|شبك|راوتر/;
const INFRA_RE = /windows|server|active directory|vmware|backup|linux|cloud|virtual|ويندوز|سيرفر/;

export function articlesForIdentity(identity, articles, indexes) {
  const sorted = articles.slice().sort(byDateDesc);
  if (identity === '/troubleshooting') return sorted.filter((a) => TROUBLESHOOT_RE.test(articleText(a)));
  if (identity === '/guides') {
    return sorted.filter((a) => a.categoryId === 'howto' || GUIDE_RE.test(articleText(a)));
  }
  const domain = identity.match(/^\/domain\/([^/]+)$/)?.[1];
  if (domain === 'cybersecurity') return sorted.filter((a) => a.categoryId === 'cybersecurity');
  if (domain === 'networking') return sorted.filter((a) => NETWORK_RE.test(articleText(a)));
  if (domain === 'infrastructure') {
    return sorted.filter(
      (a) => a.categoryId === 'windows' || a.categoryId === 'technology' || INFRA_RE.test(articleText(a)),
    );
  }
  const vendorId = identity.match(/^\/vendors\/([^/]+)$/)?.[1];
  if (vendorId) {
    const vendor = indexes.vendorsById?.get(vendorId);
    const names = [vendorId.replace(/-/g, ' '), vendor?.label?.en, vendor?.label?.ar]
      .filter(Boolean)
      .map((n) => n.toLowerCase());
    return sorted.filter((a) => names.some((n) => articleText(a).includes(n)));
  }
  return sorted;
}

function articleList(items, lang, { withExcerpt = true } = {}) {
  if (!items.length) return '';
  return `<ul>${items
    .map((a) => {
      const title = pickLocalized(a.title, lang);
      const excerpt = withExcerpt ? pickLocalized(a.excerpt, lang) : '';
      return `<li><a href="${escapeAttr(localizedHref(`/article/${a.slug}`, lang))}">${escapeHtml(title)}</a>${
        excerpt ? ` — <span>${escapeHtml(excerpt)}</span>` : ''
      }</li>`;
    })
    .join('')}</ul>`;
}

function comparisonList(items, lang) {
  if (!items.length) return '';
  return `<ul>${items
    .map(
      (c) =>
        `<li><a href="${escapeAttr(localizedHref(`/comparison/${c.slug}`, lang))}">${escapeHtml(
          pickLocalized(c.title, lang),
        )}</a></li>`,
    )
    .join('')}</ul>`;
}

function breadcrumbs(trail, lang) {
  return `<nav aria-label="breadcrumb"><ol>${trail
    .map(
      ([label, identity]) =>
        `<li>${identity ? `<a href="${escapeAttr(localizedHref(identity, lang))}">${escapeHtml(label)}</a>` : escapeHtml(label)}</li>`,
    )
    .join('')}</ol></nav>`;
}

/** BreadcrumbList JSON-LD items for a route (absolute URLs). */
export function breadcrumbTrail(identity, seo, indexes) {
  const lang = seo.lang;
  const trail = [[t('home', lang), '/']];
  let m;
  if ((m = identity.match(/^\/article\/([^/]+)$/))) {
    trail.push([t('articles', lang), '/articles']);
    const article = indexes.articlesBySlug.get(m[1]);
    const cat = article?.categoryId && CATEGORY[article.categoryId]?.[lang];
    if (cat) trail.push([cat, `/articles?c=${article.categoryId}`]);
    trail.push([seo.title, null]);
  } else if (identity.startsWith('/comparison/')) {
    trail.push([t('comparisons', lang), '/comparisons'], [seo.title, null]);
  } else if (identity.startsWith('/vendors/')) {
    trail.push([t('vendors', lang), '/vendors'], [seo.title, null]);
  } else if (identity.startsWith('/tools/')) {
    trail.push([t('tools', lang), '/tools'], [seo.title, null]);
  } else if (identity !== '/') {
    trail.push([seo.title, null]);
  }
  // query-string crumbs are not canonical URLs; keep them as plain labels
  return trail.map(([label, id]) => [label, id && id.includes('?') ? null : id]);
}

function siteHeader(identity, lang, otherLangAvailable) {
  const other = lang === 'ar' ? 'en' : 'ar';
  const links = NAV.map(
    (path) => `<a href="${escapeAttr(localizedHref(path, lang))}">${escapeHtml(t(NAV_KEY[path], lang))}</a>`,
  ).join(' · ');
  const switcher = otherLangAvailable
    ? ` · <a href="${escapeAttr(localizedHref(identity, other))}" hreflang="${other}" lang="${other}">${escapeHtml(t('otherLanguage', lang))}</a>`
    : '';
  return `<header class="container mx-auto px-4 py-4"><a href="${escapeAttr(localizedHref('/', lang))}"><strong>${escapeHtml(
    SITE.name,
  )}</strong></a><nav aria-label="primary">${links}${switcher}</nav></header>`;
}

function siteFooter(lang, indexes) {
  const pages = (indexes.pages || []).filter((p) => p.showInFooter !== false);
  const pageLinks = pages
    .map(
      (p) =>
        `<li><a href="${escapeAttr(localizedHref(`/page/${p.slug}`, lang))}">${escapeHtml(pickLocalized(p.title, lang))}</a></li>`,
    )
    .join('');
  return `<footer class="container mx-auto px-4 py-8"><h2>${escapeHtml(t('sitePages', lang))}</h2><ul>${pageLinks}<li><a href="/${lang}/rss.xml">${escapeHtml(
    t('rss', lang),
  )}</a></li></ul><p>© ${escapeHtml(SITE.name)}</p></footer>`;
}

function renderArticle(article, seo, indexes) {
  const lang = seo.lang;
  const body = markdownToHtml(pickLocalized(article.body, lang));
  const related = getRelatedArticles(article, indexes.articles || [], 6);
  const { previous, next } = getAdjacentArticles(article, indexes.articles || []);
  const author = pickLocalized(article.author?.name, lang) || SITE.name;
  const tags = (article.tags || []).map((tag) => `<li>#${escapeHtml(tag)}</li>`).join('');
  const hero = article.heroImage
    ? `<img src="${escapeAttr(article.heroImage)}" alt="${escapeAttr(seo.title)}" width="800" height="450" loading="eager" />`
    : '';
  const adjacent = [
    previous
      ? `<a rel="prev" href="${escapeAttr(localizedHref(`/article/${previous.slug}`, lang))}">${escapeHtml(
          t('previous', lang),
        )}: ${escapeHtml(pickLocalized(previous.title, lang))}</a>`
      : '',
    next
      ? `<a rel="next" href="${escapeAttr(localizedHref(`/article/${next.slug}`, lang))}">${escapeHtml(
          t('next', lang),
        )}: ${escapeHtml(pickLocalized(next.title, lang))}</a>`
      : '',
  ]
    .filter(Boolean)
    .join(' | ');
  return `<article class="max-w-3xl mx-auto"><h1>${escapeHtml(seo.title)}</h1><p><span>${escapeHtml(author)}</span> · <time datetime="${escapeAttr(
    article.date || '',
  )}">${escapeHtml(article.date || '')}</time>${article.readTime ? ` · ${escapeHtml(String(article.readTime))} ${escapeHtml(t('readTime', lang))}` : ''}</p>${hero}<p><strong>${escapeHtml(
    pickLocalized(article.excerpt, lang),
  )}</strong></p><div class="max-w-none">${body}</div>${tags ? `<ul>${tags}</ul>` : ''}${
    adjacent ? `<nav aria-label="article navigation">${adjacent}</nav>` : ''
  }</article>${related.length ? `<section class="max-w-3xl mx-auto"><h2>${escapeHtml(t('related', lang))}</h2>${articleList(related, lang)}</section>` : ''}`;
}

function renderComparison(item, seo, indexes) {
  const lang = seo.lang;
  const specs = Object.values(item.specs || {});
  const rows = specs
    .map(
      (s) =>
        `<tr><th scope="row">${escapeHtml(pickLocalized(s.label, lang))}</th><td>${escapeHtml(
          pickLocalized(s.device1Value, lang),
        )}</td><td>${escapeHtml(pickLocalized(s.device2Value, lang))}</td></tr>`,
    )
    .join('');
  const verdict = item.verdict ? pickLocalized(item.verdict, lang) : '';
  const others = (indexes.comparisons || [])
    .filter((c) => c.slug !== item.slug && c.subcategoryId && c.subcategoryId === item.subcategoryId)
    .slice(0, 6);
  return `<article class="max-w-3xl mx-auto"><h1>${escapeHtml(seo.title)}</h1><p>${escapeHtml(
    pickLocalized(item.excerpt, lang),
  )}</p>${
    rows
      ? `<table><thead><tr><th>${escapeHtml(t('feature', lang))}</th><th>${escapeHtml(item.device1Name || '')}</th><th>${escapeHtml(
          item.device2Name || '',
        )}</th></tr></thead><tbody>${rows}</tbody></table>`
      : ''
  }${verdict ? `<h2>${escapeHtml(t('verdict', lang))}</h2><div>${markdownToHtml(verdict)}</div>` : ''}</article>${
    others.length ? `<section class="max-w-3xl mx-auto"><h2>${escapeHtml(t('comparisons', lang))}</h2>${comparisonList(others, lang)}</section>` : ''
  }`;
}

function renderPage(page, seo) {
  const lang = seo.lang;
  const content = pickLocalized(page.content, lang).replace(/^##\s+.+\n+/, ''); // drop duplicated title
  return `<article class="max-w-3xl mx-auto"><h1>${escapeHtml(seo.title)}</h1><div class="max-w-none">${markdownToHtml(
    content,
  )}</div></article>`;
}

function localizedList(field, lang) {
  const value = field && typeof field === 'object' && !Array.isArray(field) ? field[lang] ?? field.en ?? field.ar : field;
  return Array.isArray(value) ? value : [];
}

function renderTool(tool, seo) {
  const lang = seo.lang;
  const parts = [`<h1>${escapeHtml(seo.title)}</h1>`];
  const summary = pickLocalized(tool.summary, lang) || pickLocalized(tool.metaDescription, lang);
  if (summary) parts.push(`<p><strong>${escapeHtml(summary)}</strong></p>`);
  for (const para of localizedList(tool.intro, lang)) parts.push(`<p>${escapeHtml(para)}</p>`);
  const howTo = localizedList(tool.howTo, lang);
  if (howTo.length) {
    parts.push(`<h2>${lang === 'ar' ? 'طريقة الاستخدام' : 'How to use'}</h2><ol>${howTo.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>`);
  }
  const notes = localizedList(tool.notes, lang);
  if (notes.length) {
    parts.push(`<h2>${lang === 'ar' ? 'ملاحظات' : 'Notes'}</h2><ul>${notes.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul>`);
  }
  const faq = localizedList(tool.faq, lang).filter((f) => f && f.q && f.a);
  if (faq.length) {
    parts.push(`<h2>${lang === 'ar' ? 'أسئلة شائعة' : 'FAQ'}</h2>${faq.map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`).join('')}`);
  }
  const refs = Array.isArray(tool.references) ? tool.references.filter((r) => r && /^https:\/\//.test(r.url || '')) : [];
  if (refs.length) {
    parts.push(`<h2>${lang === 'ar' ? 'المراجع' : 'References'}</h2><ul>${refs.map((r) => `<li><a href="${escapeAttr(r.url)}" rel="noopener noreferrer">${escapeHtml(r.label || r.url)}</a></li>`).join('')}</ul>`);
  }
  return `<article class="max-w-3xl mx-auto">${parts.join('')}</article>`;
}

/** FAQPage JSON-LD for tool pages (null when the tool has no FAQ). */
export function toolFaqJsonLd(tool, lang) {
  const faq = localizedList(tool?.faq, lang).filter((f) => f && f.q && f.a);
  if (!faq.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

function renderListing(identity, seo, indexes) {
  const lang = seo.lang;
  const articles = indexes.articles || [];
  const comparisons = (indexes.comparisons || []).slice().sort(byDateDesc);
  const head = `<h1>${escapeHtml(seo.title === SITE.name ? `${SITE.name} — ${seo.description}` : seo.title)}</h1>${
    seo.title === SITE.name ? '' : `<p>${escapeHtml(seo.description)}</p>`
  }`;

  if (identity === '/') {
    const sections = NAV.map(
      (path) => `<li><a href="${escapeAttr(localizedHref(path, lang))}">${escapeHtml(t(NAV_KEY[path], lang))}</a></li>`,
    ).join('');
    return `<section class="max-w-5xl mx-auto">${head}<ul>${sections}</ul><h2>${escapeHtml(t('latest', lang))}</h2>${articleList(
      articles.slice().sort(byDateDesc).slice(0, 24),
      lang,
    )}<h2>${escapeHtml(t('latestComparisons', lang))}</h2>${comparisonList(comparisons.slice(0, 12), lang)}</section>`;
  }
  if (identity === '/comparisons') {
    return `<section class="max-w-5xl mx-auto">${head}${comparisonList(comparisons, lang)}</section>`;
  }
  if (identity === '/tools') {
    const tools = (indexes.webTools || [])
      .map(
        (tool) =>
          `<li><a href="${escapeAttr(localizedHref(`/tools/${tool.slug}`, lang))}">${escapeHtml(
            pickLocalized(tool.title, lang),
          )}</a> — ${escapeHtml(pickLocalized(tool.metaDescription, lang))}</li>`,
      )
      .join('');
    return `<section class="max-w-5xl mx-auto">${head}<ul>${tools}</ul></section>`;
  }
  if (identity === '/vendors') {
    const vendors = [...(indexes.vendorsById?.values() || [])]
      .filter((v) => indexes.eligibleDiscoveryRoutes.has(`/vendors/${v.id}`))
      .map(
        (v) =>
          `<li><a href="${escapeAttr(localizedHref(`/vendors/${v.id}`, lang))}">${escapeHtml(pickLocalized(v.label, lang))}</a></li>`,
      )
      .join('');
    return `<section class="max-w-5xl mx-auto">${head}<ul>${vendors}</ul></section>`;
  }
  if (identity === '/categories') {
    const cats = Object.keys(CATEGORY)
      .filter((id) => articles.some((a) => a.categoryId === id))
      .map((id) => {
        const list = articles.filter((a) => a.categoryId === id).sort(byDateDesc).slice(0, 8);
        return `<h2>${escapeHtml(CATEGORY[id][lang])}</h2>${articleList(list, lang, { withExcerpt: false })}`;
      })
      .join('');
    return `<section class="max-w-5xl mx-auto">${head}${cats}</section>`;
  }
  const list = articlesForIdentity(identity, articles, indexes);
  const limit = identity === '/articles' ? list.length : 40;
  return `<section class="max-w-5xl mx-auto">${head}${articleList(list.slice(0, limit), lang)}</section>`;
}

/**
 * Returns the inner HTML for <div id="root"> for one route.
 * @param {string} identity language-less route, e.g. /article/foo
 * @param {object} seo resolveRouteSeo() result
 * @param {object} indexes loadContentIndexes() result
 */
export function renderStaticBody(identity, seo, indexes) {
  const lang = seo.lang;
  let main = '';
  let m;
  if ((m = identity.match(/^\/article\/([^/]+)$/)) && indexes.articlesBySlug.get(m[1])) {
    main = renderArticle(indexes.articlesBySlug.get(m[1]), seo, indexes);
  } else if ((m = identity.match(/^\/comparison\/([^/]+)$/)) && indexes.comparisonsBySlug.get(m[1])) {
    main = renderComparison(indexes.comparisonsBySlug.get(m[1]), seo, indexes);
  } else if ((m = identity.match(/^\/page\/([^/]+)$/)) && indexes.pagesBySlug.get(m[1])) {
    main = renderPage(indexes.pagesBySlug.get(m[1]), seo);
  } else if ((m = identity.match(/^\/tools\/([^/]+)$/)) && indexes.toolsBySlug?.get(m[1])) {
    main = renderTool(indexes.toolsBySlug.get(m[1]), seo);
  } else {
    main = renderListing(identity, seo, indexes);
  }
  const trail = breadcrumbTrail(identity, seo, indexes);
  const crumbs = identity === '/' ? '' : breadcrumbs(trail, lang);
  const otherLangAvailable = seo.alternates.length > 0;
  return `<div data-prerendered="true" lang="${lang}" dir="${seo.dir}">${siteHeader(identity, lang, otherLangAvailable)}<main class="container mx-auto px-4 py-8">${crumbs}${main}</main>${siteFooter(
    lang,
    indexes,
  )}</div>`;
}
