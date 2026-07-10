import { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'ar' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  home: { ar: 'الرئيسية', en: 'Home' },
  articles: { ar: 'المقالات', en: 'Articles' },
  comparisons: { ar: 'مقارنات', en: 'Comparisons' },
  videos: { ar: 'فيديو', en: 'Videos' },
  categories: { ar: 'الأقسام', en: 'Categories' },
  search: { ar: 'بحث', en: 'Search' },
  
  // UI Elements
  readMore: { ar: 'اقرأ المزيد', en: 'Read More' },
  trending: { ar: 'شائع الآن', en: 'Trending Now' },
  latestArticles: { ar: 'أحدث المقالات', en: 'Latest Articles' },
  videoSpotlight: { ar: 'أحدث الفيديوهات', en: 'Video Spotlight' },
  searchPlaceholder: { ar: 'ابحث عن مراجعات، أخبار، هواتف...', en: 'Search for reviews, news, phones...' },
  noResults: { ar: 'لم يتم العثور على نتائج', en: 'No results found' },
  backToTop: { ar: 'العودة للأعلى', en: 'Back to top' },
  readTime: { ar: 'دقائق قراءة', en: 'min read' },
  by: { ar: 'بواسطة', en: 'By' },
  relatedArticles: { ar: 'مقالات ذات صلة', en: 'Related Articles' },
  tableOfContents: { ar: 'محتويات المقال', en: 'Table of Contents' },
  
  // Categories
  cybersecurity: { ar: 'أمن المعلومات', en: 'Cybersecurity' },
  mobile: { ar: 'الهواتف', en: 'Mobile' },
  laptops: { ar: 'اللابتوب', en: 'Laptops' },
  howto: { ar: 'حلول تقنية', en: 'How-To' },
  ai: { ar: 'الذكاء الاصطناعي', en: 'AI' },
  reviews: { ar: 'مراجعات', en: 'Reviews' },
  windows: { ar: 'ويندوز', en: 'Windows' },
  
  // Comparisons
  vs: { ar: 'ضد', en: 'VS' },
  winner: { ar: 'الفائز', en: 'Winner' },
  verdict: { ar: 'الخلاصة', en: 'The Verdict' },
  display: { ar: 'الشاشة', en: 'Display' },
  performance: { ar: 'الأداء', en: 'Performance' },
  battery: { ar: 'البطارية', en: 'Battery' },
  camera: { ar: 'الكاميرا', en: 'Camera' },
  price: { ar: 'السعر', en: 'Price' },
  
  // Footer
  aboutUs: { ar: 'من نحن', en: 'About Us' },
  aboutText: { ar: 'تيك بالس هو دليلك العربي الأول في عالم التقنية، نقدم لك أحدث الأخبار، المراجعات، والمقارنات بحيادية واحترافية.', en: 'TechPulse is your premium tech guide, providing the latest news, reviews, and comparisons with deep expertise.' },
  followUs: { ar: 'تابعنا', en: 'Follow Us' },
  allRightsReserved: { ar: 'جميع الحقوق محفوظة.', en: 'All rights reserved.' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    const saved = localStorage.getItem('techpulse_lang') as Language;
    if (saved && (saved === 'ar' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Switch font families
    if (language === 'ar') {
      document.body.style.fontFamily = 'var(--font-cairo)';
    } else {
      document.body.style.fontFamily = 'var(--font-inter)';
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('techpulse_lang', lang);
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
