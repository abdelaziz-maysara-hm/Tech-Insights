import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const SITE_URL = 'https://technical-insights.com';
const SITE_NAME = 'Technical Insights';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: 'website' | 'article';
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

export function useSEO({
  title,
  description,
  image,
  path,
  type = 'website',
}: SEOProps = {}) {
  const { language } = useLanguage();

  useEffect(() => {
    const defaultTitle =
      language === 'ar' ? 'رؤى تقنية - موقع تقني عربي' : 'Technical Insights - Arabic Tech Magazine';
    const defaultDesc =
      language === 'ar'
        ? 'دليلك الأول في عالم التقنية: مراجعات، أخبار، مقارنات، وشروحات.'
        : 'Your guide to tech: reviews, news, comparisons, and how-tos.';

    const fullTitle = title ? `${title} | ${SITE_NAME}` : defaultTitle;
    const desc = description || defaultDesc;
    const img = image || `${SITE_URL}/favicon.svg`;
    const url = path ? `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}` : SITE_URL;

    document.title = fullTitle;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

    upsertMeta('name', 'description', desc);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', img);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:locale', language === 'ar' ? 'ar_AR' : 'en_US');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', img);

    upsertLink('canonical', url);
  }, [title, description, image, path, type, language]);
}
