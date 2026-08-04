import { mockComparisons } from '@/data/mockData';
import { cmsComparisons } from '@/data/comparisons';
import { useLanguage } from '@/context/LanguageContext';
import { ArticleCard } from '@/components/ArticleCard';
import { ComparisonCard } from '@/components/ComparisonCard';
import { Link } from 'wouter';
import { PlayCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAllArticles } from '@/hooks/useAllArticles';

export default function Home() {
  const { language, t } = useLanguage();
  const { allArticles } = useAllArticles();
  const isRtl = language === 'ar';

  const featuredArticle = allArticles.find(a => a.isFeatured) || allArticles[0];
  const trendingArticles = allArticles.filter(a => a.isTrending).slice(0, 3);
  const latestArticles = allArticles.filter(a => !a.isFeatured && !a.isTrending).slice(0, 6);
  const videoArticles = allArticles.filter(a => a.youtubeVideoId).slice(0, 3);
  const allComparisons = cmsComparisons?.length ? cmsComparisons : mockComparisons;
  const latestComparisons = allComparisons.slice(0, 3);

  return (
    <div className="min-h-screen pb-20">
      <section className="container mx-auto px-4 pt-10 pb-8 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
          {language === 'ar' ? 'رؤى تقنية' : 'Technical Insights'}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          {t('aboutText')}
        </p>
      </section>

      <section className="container mx-auto px-4 pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            {featuredArticle && <ArticleCard article={featuredArticle} featured={true} />}
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-8 bg-secondary rounded-full inline-block"></span>
              <h2 className="text-2xl font-bold">{t('trending')}</h2>
            </div>
            <div className="flex flex-col gap-1">
              {trendingArticles.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group flex items-center gap-3 py-3 border-b border-border last:border-0 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors"
                >
                  <span className="text-2xl font-black text-muted-foreground/40 w-6 text-center shrink-0">
                    {index + 1}
                  </span>
                  <img
                    src={article.heroImage}
                    alt={article.title[language]}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                    loading="lazy"
                  />
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title[language]}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 py-6 mb-12">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {['cybersecurity', 'mobile', 'laptops', 'ai', 'howto', 'windows'].map((cat) => (
              <Link
                key={cat}
                href={`/articles?c=${cat}`}
                className="whitespace-nowrap px-6 py-3 rounded-full bg-background border border-border font-medium hover:border-primary hover:text-primary transition-all snap-start shadow-sm"
              >
                {t(cat)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 mb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: '/articles?c=howto', ar: 'شروحات عملية', en: 'Practical Guides', desc_ar: 'حلول سريعة لمشاكل يومية', desc_en: 'Quick fixes for daily issues' },
            { href: '/comparisons', ar: 'مقارنات', en: 'Comparisons', desc_ar: 'جداول تساعدك تختار', desc_en: 'Tables that help you choose' },
            { href: '/articles?c=cybersecurity', ar: 'الأمان', en: 'Security', desc_ar: 'حمِ حساباتك وجهازك', desc_en: 'Protect accounts and devices' },
            { href: '/videos', ar: 'فيديوهات', en: 'Videos', desc_ar: 'شروحات مرئية داخل الموقع', desc_en: 'In-site video explainers' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="block p-5 rounded-xl border border-border bg-card hover:border-primary/60 hover:shadow-md transition-all">
              <h3 className="font-bold text-lg mb-1">{language === 'ar' ? item.ar : item.en}</h3>
              <p className="text-sm text-muted-foreground">{language === 'ar' ? item.desc_ar : item.desc_en}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-8 bg-primary rounded-full inline-block"></span>
                <h2 className="text-2xl font-bold">{t('latestArticles')}</h2>
              </div>
              <Link href="/articles" className="text-primary font-medium hover:underline flex items-center gap-1">
                {t('readMore')}
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-8 bg-secondary rounded-full inline-block"></span>
                <h2 className="text-2xl font-bold">{t('comparisons')}</h2>
              </div>
              <Link href="/comparisons" className="text-primary font-medium hover:underline flex items-center gap-1">
                {t('readMore')}
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
            <div className="flex flex-col gap-6">
              {latestComparisons.map(c => (
                <ComparisonCard key={c.id} comparison={c} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {videoArticles.length > 0 && (
        <section className="bg-muted/20 border-y border-border py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-8 bg-red-500 rounded-full inline-block"></span>
                <h2 className="text-2xl font-bold">{t('videoSpotlight')}</h2>
              </div>
              <Link href="/videos" className="text-primary font-medium hover:underline flex items-center gap-1">
                {t('readMore')}
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videoArticles.map(article => (
                <Link key={article.id} href={`/article/${article.slug}`} className="group relative rounded-xl overflow-hidden aspect-[16/9] block">
                  <img src={article.heroImage} alt={article.title[language]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                    <h3 className="text-white font-bold line-clamp-2">{article.title[language]}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
