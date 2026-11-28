import { Link } from 'wouter';
import type { RelatedGroups, RelatedLink } from '@/lib/relatedContent';
import { relatedGroupsAreEmpty } from '@/lib/relatedContent';

const HEADINGS: Record<keyof RelatedGroups, { ar: string; en: string }> = {
  articles: { ar: 'مقالات ذات صلة', en: 'Related articles' },
  videos: { ar: 'فيديوهات ذات صلة', en: 'Related videos' },
  playlists: { ar: 'قوائم تشغيل', en: 'Related playlists' },
  comparisons: { ar: 'مقارنات ذات صلة', en: 'Related comparisons' },
  alternatives: { ar: 'صفحات بدائل', en: 'Alternative round-ups' },
  tools: { ar: 'أدوات على البرنامج', en: 'Desktop tools' },
  topics: { ar: 'محاور الموضوع', en: 'Topic hubs' },
  vendors: { ar: 'صفحات المورّدين', en: 'Vendor pages' },
};

const ORDER: Array<keyof RelatedGroups> = [
  'articles',
  'videos',
  'playlists',
  'comparisons',
  'alternatives',
  'tools',
  'topics',
  'vendors',
];

type Props = {
  groups: RelatedGroups;
  language: 'ar' | 'en';
  exclude?: Array<keyof RelatedGroups>;
};

function LinkList({ items, language }: { items: RelatedLink[]; language: 'ar' | 'en' }) {
  return (
    <ul className="space-y-1.5 text-sm">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="text-primary hover:underline">
            {item.title[language] || item.title.en || item.href}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Compact, tag/topic-driven related links. Safe to reuse on any content page. */
export function RelatedLinks({ groups, language, exclude = [] }: Props) {
  if (relatedGroupsAreEmpty(groups)) return null;
  const visible = ORDER.filter((kind) => !exclude.includes(kind) && groups[kind].length > 0);
  if (visible.length === 0) return null;
  return (
    <aside className="mt-10 rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-bold mb-4">{language === 'ar' ? 'ذات صلة' : 'Related'}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {visible.map((kind) => (
          <div key={kind}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">{HEADINGS[kind][language]}</h3>
            <LinkList items={groups[kind]} language={language} />
          </div>
        ))}
      </div>
    </aside>
  );
}

const LEGAL_PAGES = [
  { slug: 'about', ar: 'من نحن', en: 'About NetSec Atlas' },
  { slug: 'team', ar: 'الفريق', en: 'The team' },
  { slug: 'editorial-policy', ar: 'السياسة التحريرية', en: 'Editorial policy' },
  { slug: 'contact', ar: 'تواصل معنا', en: 'Contact us' },
  { slug: 'contribute', ar: 'ساهم معنا', en: 'Contribute' },
  { slug: 'privacy', ar: 'سياسة الخصوصية', en: 'Privacy policy' },
  { slug: 'cookies', ar: 'سياسة ملفات الارتباط', en: 'Cookie policy' },
  { slug: 'terms', ar: 'شروط الاستخدام', en: 'Terms of use' },
  { slug: 'disclaimer', ar: 'إخلاء المسؤولية', en: 'Disclaimer' },
  { slug: 'advertising', ar: 'الإعلان', en: 'Advertising' },
] as const;

/** Cross-links among legal/about pages so each has several contextual inbound links. */
export function RelatedSitePages({ currentSlug, language }: { currentSlug: string; language: 'ar' | 'en' }) {
  const others = LEGAL_PAGES.filter((p) => p.slug !== currentSlug);
  return (
    <aside className="mt-12 pt-8 border-t border-border">
      <h2 className="text-lg font-bold mb-3">{language === 'ar' ? 'صفحات أخرى عن الموقع' : 'More about this site'}</h2>
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {others.map((page) => (
          <li key={page.slug}>
            <Link href={`/page/${page.slug}`} className="text-primary hover:underline">
              {language === 'ar' ? page.ar : page.en}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
