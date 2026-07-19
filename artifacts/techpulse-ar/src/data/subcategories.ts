import { Category } from './mockData';

export interface Subcategory {
  id: string;
  ar: string;
  en: string;
}

const CONTENT_TYPE: Subcategory[] = [
  { id: 'reviews', ar: 'مراجعات', en: 'Reviews' },
  { id: 'best-picks', ar: 'أفضل اختيارات', en: 'Best Picks' },
  { id: 'guides-tips', ar: 'شروحات ونصائح', en: 'Guides & Tips' },
  { id: 'concepts', ar: 'مفاهيم وشروحات', en: 'Concepts Explained' },
  { id: 'news-updates', ar: 'أخبار وتحديثات', en: 'News & Updates' },
  { id: 'general', ar: 'عام', en: 'General' },
];

export const SUBCATEGORIES: Record<Category, Subcategory[]> = {
  mobile: CONTENT_TYPE,
  laptops: CONTENT_TYPE,
  windows: CONTENT_TYPE,
  howto: CONTENT_TYPE,
  ai: CONTENT_TYPE,
  cybersecurity: CONTENT_TYPE,
  technology: CONTENT_TYPE,
  reviews: [
    { id: 'phones-wearables', ar: 'هواتف وساعات', en: 'Phones & Wearables' },
    { id: 'audio', ar: 'صوتيات وسماعات', en: 'Audio' },
    { id: 'cameras-drones', ar: 'كاميرات وطائرات', en: 'Cameras & Drones' },
    { id: 'gaming', ar: 'ألعاب وتحكم', en: 'Gaming' },
    { id: 'accessories-peripherals', ar: 'إكسسوارات وملحقات', en: 'Accessories & Peripherals' },
    { id: 'general', ar: 'عام', en: 'General' },
  ],
  comparisons: [
    { id: 'phones', ar: 'مقارنات هواتف', en: 'Phone Comparisons' },
    { id: 'laptops-pcs', ar: 'مقارنات لابتوبات وحواسيب', en: 'Laptop & PC Comparisons' },
    { id: 'gaming-consoles', ar: 'مقارنات ألعاب', en: 'Gaming Comparisons' },
    { id: 'wearables', ar: 'مقارنات ساعات', en: 'Wearable Comparisons' },
    { id: 'software-services', ar: 'مقارنات برمجيات وخدمات', en: 'Software & Services Comparisons' },
    { id: 'general', ar: 'عام', en: 'General' },
  ],
};

export function getSubcategories(category: Category): Subcategory[] {
  return SUBCATEGORIES[category] ?? [];
}

export function getSubcategoryLabel(category: Category, subcategoryId: string | undefined, lang: 'ar' | 'en'): string {
  if (!subcategoryId) return '';
  const found = getSubcategories(category).find((s) => s.id === subcategoryId);
  return found ? found[lang] : subcategoryId;
}
