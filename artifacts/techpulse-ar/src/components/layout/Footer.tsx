import { Link } from 'wouter';
import { ACTIVE_CATEGORIES } from '@/lib/activeCategories';
import { useLanguage } from '@/context/LanguageContext';
import { Twitter, Facebook, Instagram, Youtube, Linkedin, Rss, ArrowUp } from 'lucide-react';
import { SITE } from '@/config/site';
import pagesJson from '@/content/pages.json';
import { CmsPage } from '@/data/cmsTypes';

const footerPages = (pagesJson as unknown as CmsPage[]).filter((p) => p.showInFooter);

// Only render social icons for profiles that are actually configured in
// src/config/site.ts (empty strings are hidden instead of linking to "#").
const SOCIAL_ICONS = [
  { key: 'x', label: 'X / Twitter', Icon: Twitter },
  { key: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
  { key: 'facebook', label: 'Facebook', Icon: Facebook },
  { key: 'instagram', label: 'Instagram', Icon: Instagram },
  { key: 'youtube', label: 'YouTube', Icon: Youtube },
] as const;
const socialLinks = SOCIAL_ICONS.filter(({ key }) => Boolean(SITE.social[key]));

export function Footer() {
  const { language, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="text-2xl font-bold text-gradient flex items-center gap-2">
              <span className="bg-primary text-primary-foreground p-1 rounded-md text-xl">NSA</span>
              NetSec Atlas
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('aboutText')}
            </p>
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map(({ key, label, Icon }) => (
                <a
                  key={key}
                  href={SITE.social[key]}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label={label}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
              <a
                href={`/${language}/rss.xml`}
                className="text-muted-foreground hover:text-primary transition-colors text-xs font-medium flex items-center gap-1"
                title="RSS"
              >
                <Rss className="h-4 w-4" /> RSS
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t('categories')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {ACTIVE_CATEGORIES.map((cat) => (
                <li key={cat}><Link href={`/articles?c=${cat}`} className="hover:text-primary">{t(cat)}</Link></li>
              ))}
              <li><Link href="/videos" className="hover:text-primary">{language === 'ar' ? 'مكتبة الفيديو' : 'Video library'}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{language === 'ar' ? 'روابط هامة' : 'Important Links'}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/articles" className="hover:text-primary">{t('articles')}</Link></li>
              <li><Link href="/troubleshooting" className="hover:text-primary">{language === 'ar' ? 'استكشاف الأعطال' : 'Troubleshooting'}</Link></li>
              <li><Link href="/guides" className="hover:text-primary">{language === 'ar' ? 'أدلة' : 'Guides'}</Link></li>
              <li><Link href="/alternatives" className="hover:text-primary">{language === 'ar' ? 'بدائل' : 'Alternatives'}</Link></li>
              <li><Link href="/tools" className="hover:text-primary">{language === 'ar' ? 'تطبيقات Atlas' : 'Atlas Apps'}</Link></li>
              <li><a href="https://adawaty.tools/categories/security-network/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">{language === 'ar' ? 'أدوات الأمن — أدواتي' : 'Security tools — Adawaty'}</a></li>
              <li><Link href="/vendors" className="hover:text-primary">{language === 'ar' ? 'الموردون' : 'Vendors'}</Link></li>
              <li><Link href="/comparisons" className="hover:text-primary">{t('comparisons')}</Link></li>
              <li><Link href="/videos" className="hover:text-primary">{t('videos')}</Link></li>
              {footerPages.map((page) => (
                <li key={page.id}>
                  <Link href={`/page/${page.slug}`} className="hover:text-primary">{page.title[language]}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{language === 'ar' ? 'تابع الجديد' : 'Stay updated'}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'ar'
                ? 'تابع أحدث المقالات العملية في الشبكات والأمن عبر خلاصة RSS في قارئ الأخبار المفضل لديك.'
                : 'Follow the latest practical networking and security articles through our RSS feed in your favourite reader.'}
            </p>
            <a
              href={`/${language}/rss.xml`}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Rss className="h-4 w-4" />
              {language === 'ar' ? 'اشترك عبر RSS' : 'Subscribe via RSS'}
            </a>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NetSec Atlas. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4">
            <button type="button" onClick={scrollToTop} className="bg-muted p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors" aria-label={language === 'ar' ? 'العودة إلى أعلى الصفحة' : 'Back to top'}>
              <ArrowUp className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
