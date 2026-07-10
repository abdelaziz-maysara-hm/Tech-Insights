import { mockComparisons } from '@/data/mockData';
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
  const latestComparisons = mockComparisons.slice(0, 2);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Featured */}
          <div className="lg:col-span-8">
            <ArticleCard article={featuredArticle} featured={true} className="h-full" />
          </div>
          
          {/* Trending Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-8 bg-secondary rounded-full inline-block"></span>
              <h2 className="text-2xl font-bold">{t('trending')}</h2>
            </div>
            {trendingArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="border-y border-border bg-muted/30 py-6 mb-12">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {['cybersecurity', 'mobile', 'laptops', 'ai', 'howto', 'windows'].map((cat) => (
              <Link 
                key={cat} 
                href={`/categories?c=${cat}`}
                className="whitespace-nowrap px-6 py-3 rounded-full bg-background border border-border font-medium hover:border-primary hover:text-primary transition-all snap-start shadow-sm"
              >
                {t(cat)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left/Right Column: Latest Articles */}
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

          {/* Right/Left Column: Comparisons & Extras */}
          <div className="lg:col-span-1 space-y-12">
            {/* Comparisons Widget */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-6 bg-secondary rounded-full inline-block"></span>
                  <h2 className="text-xl font-bold">{t('comparisons')}</h2>
                </div>
                <Link href="/comparisons" className="text-sm text-primary hover:underline">
                  {t('readMore')}
                </Link>
              </div>
              <div className="space-y-6">
                {latestComparisons.map(comp => (
                  <ComparisonCard key={comp.id} comparison={comp} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Spotlight */}
      <section className="bg-muted/30 py-16 border-y border-border">
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
    </div>
  );
}
