import { useRoute, Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { useAllArticles } from '@/hooks/useAllArticles';
import { useArticleBody } from '@/hooks/useArticleBody';
import { Clock } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { ArticleCard } from '@/components/ArticleCard';
import { AdawatyTools } from '@/components/AdawatyTools';
import { adawatyLinksForArticle } from '@/data/adawaty';
import { localizeInternalLinks, markdownToHtml } from '@/lib/markdown';
import { getRelatedArticles, getAdjacentArticles } from '@/lib/relatedContent';
import { LiteYouTube } from '@/components/video/LiteYouTube';
import { libraryPlaylists, libraryVideos } from '@/data/videoLibrary';
import { playlistForArticle, videosForPlaylist } from '@/lib/videoLibrary';

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

  // Internal linking: topical neighbours (shared tags / subcategory /
  // category) plus previous/next in the same category.
  const related = getRelatedArticles(article, allArticles, 6);
  const { previous, next } = getAdjacentArticles(article, allArticles);

  const playlist = playlistForArticle(article.slug, libraryPlaylists);
  const playlistVideos = playlist ? videosForPlaylist(playlist, libraryVideos) : [];

  const adawatyLinks = adawatyLinksForArticle({
    categoryId: article.categoryId,
    tags: article.tags,
    title: article.title,
  });

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
            <div className="mb-10">
              <LiteYouTube id={article.youtubeVideoId} title={article.title[language]} playLabel={language === 'ar' ? 'تشغيل' : 'Play'} />
            </div>
          )}

          <div
            className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary"
            // markdownToHtml escapes all source text before formatting.
            dangerouslySetInnerHTML={{ __html: localizeInternalLinks(markdownToHtml(article.body[language] || ''), language) }}
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

          {(previous || next) && (
            <nav
              aria-label={language === 'ar' ? 'التنقل بين المقالات' : 'Article navigation'}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10"
            >
              {previous ? (
                <Link href={`/article/${previous.slug}`} rel="prev" className="block rounded-lg border border-border p-4 hover:border-primary transition-colors">
                  <span className="block text-xs text-muted-foreground mb-1">{language === 'ar' ? 'المقال السابق' : 'Previous article'}</span>
                  <span className="font-medium">{previous.title[language]}</span>
                </Link>
              ) : <span />}
              {next && (
                <Link href={`/article/${next.slug}`} rel="next" className="block rounded-lg border border-border p-4 hover:border-primary transition-colors">
                  <span className="block text-xs text-muted-foreground mb-1">{language === 'ar' ? 'المقال التالي' : 'Next article'}</span>
                  <span className="font-medium">{next.title[language]}</span>
                </Link>
              )}
            </nav>
          )}

          {playlist && playlistVideos.length > 0 && (
            <aside className="mt-10 rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-bold mb-2">
                {language === 'ar' ? 'شاهد قائمة التشغيل المرتبطة' : 'Watch the related playlist'}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                <Link href={`/videos/${playlist.slug}`} className="text-primary hover:underline font-medium">{playlist.title[language]}</Link>
                {' · '}
                {playlistVideos.length} {language === 'ar' ? 'فيديو' : 'videos'}
              </p>
              <ol className="list-decimal ps-6 space-y-1 text-sm">
                {playlistVideos.slice(0, 4).map((v) => (
                  <li key={v.slug}><Link href={`/video/${v.slug}`} className="hover:text-primary">{v.title[language]}</Link></li>
                ))}
              </ol>
            </aside>
          )}

          <AdawatyTools links={adawatyLinks} />
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
