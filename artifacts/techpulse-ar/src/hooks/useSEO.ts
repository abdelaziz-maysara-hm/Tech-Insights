import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SITE, siteUrl } from '@/config/site';
import { getProductionCanonicalUrl } from '@/lib/seoUrl';
import {
  getHreflangAlternates,
  isHreflangEligible,
  replaceHreflangLinks,
  type TranslationStatus,
} from '@/lib/hreflang';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: 'website' | 'article';
  datePublished?: string;
  authorName?: string;
  translationStatus?: TranslationStatus;
  indexable?: boolean;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertJsonLd(id: string, data: Record<string, unknown> | null) {
  const existing = document.getElementById(id);
  if (!data) {
    existing?.remove();
    return;
  }
  let el = existing as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function useSEO({
  title,
  description,
  image,
  path,
  type = 'website',
  datePublished,
  authorName,
  translationStatus,
  indexable = true,
}: SEOProps = {}) {
  const { language } = useLanguage();

  useEffect(() => {
    const defaultTitle =
      language === 'ar' ? `${SITE.name} - ${SITE.taglineAr}` : `${SITE.name} - ${SITE.taglineEn}`;
    const defaultDesc =
      language === 'ar'
        ? SITE.descriptionAr
        : SITE.descriptionEn;

    const fullTitle = title ? `${title} | ${SITE.name}` : defaultTitle;
    const desc = description || defaultDesc;
    const img = image || siteUrl('/favicon.svg');
    const browserPath = typeof window === 'undefined' ? '/' : window.location.pathname;
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
    const url = getProductionCanonicalUrl(path ?? browserPath, browserPath, basePath);
    const localizedRootUrl = getProductionCanonicalUrl('/', browserPath, basePath);
    const localizedSearchUrl = getProductionCanonicalUrl('/search', browserPath, basePath);
    const hreflangRoute = path ?? browserPath;
    const alternates = getHreflangAlternates(
      hreflangRoute,
      isHreflangEligible(hreflangRoute, translationStatus),
    );

    document.title = fullTitle;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

    upsertMeta('name', 'description', desc);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', img);
    upsertMeta('property', 'og:site_name', SITE.name);
    upsertMeta('property', 'og:locale', language === 'ar' ? 'ar_AR' : 'en_US');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', img);

    if (!indexable) {
      upsertMeta('name', 'robots', 'noindex, nofollow');
      document.querySelector('link[rel="canonical"]')?.remove();
      replaceHreflangLinks([]);
      upsertJsonLd('jsonld-article', null);
      upsertJsonLd('jsonld-website', null);

      return () => {
        document.querySelector('meta[name="robots"]')?.remove();
      };
    }

    upsertMeta('name', 'robots', 'index, follow');

    upsertLink('canonical', url);
    replaceHreflangLinks(alternates);

    if (type === 'article' && title) {
      upsertJsonLd('jsonld-article', {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: desc,
        image: img,
        url,
        datePublished: datePublished || undefined,
        author: {
          '@type': 'Person',
          name: authorName || (language === 'ar' ? SITE.defaultAuthorAr : SITE.defaultAuthorEn),
        },
        publisher: {
          '@type': 'Organization',
          name: SITE.organization.name,
          url: SITE.organization.url,
        },
        inLanguage: language === 'ar' ? 'ar' : 'en',
      });
    } else {
      upsertJsonLd('jsonld-article', null);
      upsertJsonLd('jsonld-website', {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE.name,
        url: localizedRootUrl,
        inLanguage: language,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${localizedSearchUrl}?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      });
    }
  }, [title, description, image, path, type, language, datePublished, authorName, translationStatus, indexable]);
}
