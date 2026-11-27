import { lazy, Suspense } from 'react';
import { useRoute, Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { useAllArticles } from '@/hooks/useAllArticles';
import { useArticleBody } from '@/hooks/useArticleBody';
import { Clock } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { HERO_SIZES_ARTICLE, heroSrcSet, sizedHero } from '@/lib/images';

const ArticleBelowFold = lazy(() => import('@/components/ArticleBelowFold'));

export default function ArticleDetail() {
  const [, params] = useRoute('/article/:slug');
  const { language, t } = useLanguage();
  const { allArticles } = useAllArticles();
  const meta = allArticles.find((a) => a.slug === params?.slug);
  const { article, isLoading } = useArticleBody(params?.slug);
  const display = article ?? meta;

  useSEO({
    title: display?.title?.[language],
    description: display?.excerpt?.[language],
    image: display?.heroImage,
    type: 'article',
    datePublished: display?.date,
    authorName: display?.author?.name?.[language],
    translationStatus: display?.translationStatus,
  });

  if (!display) {
    if (isLoading) {
      return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground" />;
    }
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">{language === 'ar' ? 'المقال غير موجود' : 'Article not found'}</h1>
        <Link href="/articles" className="text-primary hover:underline">
          {language === 'ar' ? 'العودة للمقالات' : 'Back to articles'}
        </Link>
      </div>
    );
  }

  const authorLabel =
    display.author?.name?.[language] ||
    display.author?.name?.ar ||
    display.author?.name?.en ||
    'NetSec Atlas';

  return (
    <div className="min-h-screen pb-20">
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={sizedHero(display.heroImage, 1200, 675)} srcSet={heroSrcSet(display.heroImage)} sizes={HERO_SIZES_ARTICLE} alt={display.title[language]} className="w-full h-full object-cover" width={1200} height={675} decoding="sync" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full mb-4">
            {t(display.categoryId)}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{display.title[language]}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span className="font-medium text-white">{authorLabel}</span>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {display.readTime} {t('readTime')}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            <span>{display.date}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{display.excerpt[language]}</p>
        </div>
        {article?.body && (
          <Suspense fallback={null}>
            <ArticleBelowFold article={article} allArticles={allArticles} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
