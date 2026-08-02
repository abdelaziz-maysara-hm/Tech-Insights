import { Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { Twitter, Facebook, Instagram, Youtube, ArrowUp, Settings } from 'lucide-react';
import pagesJson from '@/content/pages.json';
import { CmsPage } from '@/data/cmsTypes';

const footerPages = (pagesJson as unknown as CmsPage[]).filter((p) => p.showInFooter);

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
              <span className="bg-primary text-primary-foreground p-1 rounded-md text-xl">TI</span>
              {language === 'ar' ? 'رؤى تقنية' : 'Technical Insights'}
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('aboutText')}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="/rss.xml" className="text-muted-foreground hover:text-primary transition-colors text-xs font-medium" title="RSS">
                RSS
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t('categories')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/articles?c=mobile" className="hover:text-primary">{t('mobile')}</Link></li>
              <li><Link href="/articles?c=laptops" className="hover:text-primary">{t('laptops')}</Link></li>
              <li><Link href="/articles?c=ai" className="hover:text-primary">{t('ai')}</Link></li>
              <li><Link href="/articles?c=cybersecurity" className="hover:text-primary">{t('cybersecurity')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{language === 'ar' ? 'روابط هامة' : 'Important Links'}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/articles" className="hover:text-primary">{t('articles')}</Link></li>
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
            <h3 className="font-bold text-lg mb-4">{language === 'ar' ? 'النشرة البريدية' : 'Newsletter'}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'ar'
                ? 'اشترك ليصلك أحدث الأخبار التقنية والمراجعات أسبوعياً.'
                : 'Subscribe to get the latest tech news and reviews weekly.'}
            </p>
            <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email address'}
                className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                {language === 'ar' ? 'اشترك' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {language === 'ar' ? 'رؤى تقنية' : 'Technical Insights'}. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors" title="Admin">
              <Settings className="h-4 w-4" />
            </Link>
            <button onClick={scrollToTop} className="bg-muted p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors">
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
