/** Static pages generator matching pages.json schema */
import { bi } from './localization.mjs';
import { uniqueSlug } from './slugs.mjs';

const PAGES = [
  ['privacy', 'سياسة الخصوصية', 'Privacy Policy', 'نوضح كيف نتعامل مع البيانات والكوكيز والإعلانات.', 'How we handle data, cookies, and ads.'],
  ['terms', 'الشروط والأحكام', 'Terms of Use', 'قواعد استخدام الموقع والمحتوى.', 'Rules for using the site and content.'],
  ['cookies', 'سياسة ملفات تعريف الارتباط', 'Cookie Policy', 'أنواع الكوكيز ولماذا تُستخدم.', 'Cookie types and why they are used.'],
  ['disclaimer', 'إخلاء المسؤولية', 'Disclaimer', 'المحتوى إرشادي وليس استشارة مهنية ملزمة.', 'Content is informational, not binding professional advice.'],
  ['editorial-policy', 'السياسة التحريرية', 'Editorial Policy', 'معايير الدقة والحياد وتصحيح الأخطاء.', 'Accuracy, fairness, and corrections standards.'],
  ['contact', 'تواصل معنا', 'Contact', 'للتواصل والاقتراحات والإبلاغ عن خطأ.', 'Contact, suggestions, and corrections.'],
  ['contribute', 'ساهم معنا', 'Contribute', 'كيف ترشح موضوعًا أو تشارك بخبرة.', 'How to suggest topics or contribute expertise.'],
  ['advertising', 'الإعلان', 'Advertising', 'خيارات الإعلان والشراكات المناسبة.', 'Advertising options and partnerships.'],
  ['about', 'من نحن', 'About Us', 'رؤى تقنية منصة عربية/إنجليزية للشروحات والمقارنات.', 'Technical Insights is a bilingual guides and comparisons platform.'],
];

export function generatePages({ count } = {}) {
  const list = typeof count === 'number' ? PAGES.slice(0, Math.max(1, count)) : PAGES;
  return list.map(([slug, ar, en, arBody, enBody], i) => ({
    id: `page-gen-${String(i + 1).padStart(2, '0')}`,
    slug: uniqueSlug(slug),
    title: bi(ar, en),
    content: bi(`## ${ar}\n\n${arBody}\n\nنحدّث هذه الصفحة عند الحاجة.`, `## ${en}\n\n${enBody}\n\nThis page is updated as needed.`),
    updatedAt: '2026-08-02',
    showInFooter: ['privacy', 'about', 'contact', 'terms'].includes(slug),
  }));
}
