import { useEffect, useMemo } from 'react';
import { useRoute, Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { useAllArticles } from '@/hooks/useAllArticles';
import { useSEO } from '@/hooks/useSEO';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { ArticleCard } from '@/components/ArticleCard';

export default function ArticleDetail() {
  const [, params] = useRoute('/article/:slug');
  const slug = params?.slug;
  const { language, t, isRtl } = useLanguage();
  const { allArticles } = useAllArticles();

  const article = useMemo(
    () => allArticles.find((a) => a.slug === slug),
    [allArticles, slug],
  );

  useSEO(
    article
      ? {
          title: article.title[language],
          description: article.excerpt[language],
          image: article.heroImage,
          path: `/article/${article.slug}`,
          type: 'article',
          datePublished: article.date,
          authorName: article.author?.name?.[language] || article.author?.name?.ar,
        }
      : { title: t('notFound') || 'Not found', path: `/article/${slug || ''}` },
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const relatedArticles = useMemo(() => {
    if (!article) return [];
    const scored = allArticles
      .filter((a) => a.slug !== article.slug)
      .map((a) => {
        let score = 0;
        if (a.categoryId === article.categoryId) score += 40;
        const tags = new Set(article.tags || []);
        for (const tag of a.tags || []) if (tags.has(tag)) score += 25;
        return { a, score };
      })
      .filter((x) => x.score > 0)
      .sort((x, y) => y.score - x.score)
      .slice(0, 3)
      .map((x) => x.a);
    return scored;
  }, [article, allArticles]);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">{language === 'ar' ? 'المقال غير موجود' : 'Article not found'}</h1>
        <Link href="/articles" className="text-primary hover:underline">
          {language === 'ar' ? 'العودة للمقالات' : 'Back to articles'}
        </Link>
      </div>
    );
  }

  const body = article.body?.[language] || article.body?.ar || '';

  return (
    <div className="min-h-screen pb-20">
      <article className="container mx-auto px-4 pt-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/articles" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {language === 'ar' ? 'كل المقالات' : 'All articles'}
          </Link>
        </div>

        <div className="relative rounded-2xl overflow-hidden mb-8 aspect-[16/9] bg-muted">
          <img
            src={article.heroImage}
            alt={article.title[language]}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full mb-3">
              {t(article.categoryId)}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">{article.title[language]}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-200">
              <span className="font-medium text-white">{article.author.name[language]}</span>
              <span className="opacity-60">•</span>
              <span>{article.date}</span>
              <span className="opacity-60">•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime} {t('readTime')}
              </span>
            </div>
          </div>
        </div>

        {article.youtubeVideoId && (
          <div className="mb-8 aspect-video rounded-xl overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${article.youtubeVideoId}`}
              title={article.title[language]}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary">
          {body.split('\n').map((line, idx) => {
            if (line.startsWith('## ')) {
              return (
                <h2 key={idx} className="text-xl font-bold mt-8 mb-3 text-foreground">
                  {line.replace(/^##\s+/, '')}
                </h2>
              );
            }
            if (line.startsWith('# ')) {
              return (
                <h2 key={idx} className="text-2xl font-bold mt-8 mb-3 text-foreground">
                  {line.replace(/^#\s+/, '')}
                </h2>
              );
            }
            if (!line.trim()) return <br key={idx} />;
            return (
              <p key={idx} className="mb-4 leading-relaxed text-muted-foreground">
                {line}
              </p>
            );
          })}
        </div>

        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
            {article.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {relatedArticles.length > 0 && (
        <section className="container mx-auto px-4 mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">{t('relatedArticles')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {relatedArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
