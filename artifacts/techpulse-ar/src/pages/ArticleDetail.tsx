import { useRoute, Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { useAllArticles } from '@/hooks/useAllArticles';
import { useArticleBody } from '@/hooks/useArticleBody';
import { Clock } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { ArticleCard } from '@/components/ArticleCard';

export default function ArticleDetail() {
  const [, params] = useRoute('/article/:slug');
  const { language, t } = useLanguage();
  const { allArticles } = useAllArticles();
  const { article, isLoading } = useArticleBody(params?.slug);
  useSEO({
    title: article?.title?.[language],
    description: article?.excerpt?.[language],
    image: article?.heroImage,
    type: 'article',
    datePublished: article?.date,
    authorName: article?.author?.name?.[language],
    translationStatus: article?.translationStatus,
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground" />;
  }

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

  const authorLabel =
    article.author?.name?.[language] ||
    article.author?.name?.ar ||
    article.author?.name?.en ||
    'NetSec Atlas';

  const related = allArticles
    .filter(a => a.categoryId === article.categoryId && a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen pb-20">
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={article.heroImage} alt={article.title[language]} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full mb-4">
            {t(article.categoryId)}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{article.title[language]}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span className="font-medium text-white">{authorLabel}</span>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {article.readTime} {t('readTime')}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            <span>{article.date}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{article.excerpt[language]}</p>

          {article.youtubeVideoId && (
            <div className="aspect-video mb-10 rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${article.youtubeVideoId}`}
                title={article.title[language]}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}

          <div
            className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary"
            dangerouslySetInnerHTML={{
              __html: (article.body[language] || '')
                .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/^(?!<h)/, '<p>')
                .replace(/(?<!>)$/, '</p>'),
            }}
          />

          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">{t('relatedArticles')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
