import { Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { ArticleCard } from '@/components/ArticleCard';
import { AdawatyTools } from '@/components/AdawatyTools';
import { adawatyLinksForArticle } from '@/data/adawaty';
import { localizeInternalLinks, markdownToHtml } from '@/lib/markdown';
import { getRelatedArticles, getAdjacentArticles, getRelatedGraph } from '@/lib/relatedContent';
import { RelatedLinks } from '@/components/RelatedLinks';
import { siteCatalogs } from '@/lib/siteCatalogs';
import { LiteYouTube } from '@/components/video/LiteYouTube';
import { libraryPlaylists, libraryVideos } from '@/data/videoLibrary';
import { playlistForArticle, videosForPlaylist } from '@/lib/videoLibrary';
import type { Article, ArticleListItem } from '@/data/mockData';

type Props = {
  article: Article;
  allArticles: ArticleListItem[];
};

/** Body, embeds, and related blocks — kept out of the ArticleDetail entry
 *  so the hero can paint without waiting on videoLibrary / markdown. */
export default function ArticleBelowFold({ article, allArticles }: Props) {
  const { language, t } = useLanguage();
  const related = getRelatedArticles(article, allArticles, 6);
  const { previous, next } = getAdjacentArticles(article, allArticles);
  const crossRelated = getRelatedGraph(article, siteCatalogs(), 3);
  const playlist = playlistForArticle(article.slug, libraryPlaylists);
  const playlistVideos = playlist ? videosForPlaylist(playlist, libraryVideos) : [];
  const adawatyLinks = adawatyLinksForArticle({
    categoryId: article.categoryId,
    tags: article.tags,
    title: article.title,
  });

  return (
    <>
      <div className="max-w-3xl mx-auto">
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
      <RelatedLinks groups={crossRelated} language={language === 'ar' ? 'ar' : 'en'} exclude={['articles']} />
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
    </>
  );
}
