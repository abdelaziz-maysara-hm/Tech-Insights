import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
}

export function useSEO({ title, description }: SEOProps = {}) {
  const { language } = useLanguage();

  useEffect(() => {
    const defaultTitle = language === 'ar' ? 'تيك بالس - موقع تقنى عربى' : 'TechPulse - Arabic Tech Magazine';
    const defaultDesc = language === 'ar' 
      ? 'دليلك الأول في عالم التقنية، مراجعات، أخبار، ومقارنات.' 
      : 'Your first guide in the tech world, reviews, news, and comparisons.';

    document.title = title ? `${title} - TechPulse` : defaultTitle;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || defaultDesc);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description || defaultDesc;
      document.head.appendChild(meta);
    }
  }, [title, description, language]);
}
