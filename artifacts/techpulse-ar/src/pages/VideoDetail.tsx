import { Link, useRoute } from 'wouter';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { useJsonLd } from '@/hooks/useJsonLd';
import { useAllArticles } from '@/hooks/useAllArticles';
import { SITE } from '@/config/site';
import { libraryPlaylists, libraryVideos } from '@/data/videoLibrary';
import { LiteYouTube } from '@/components/video/LiteYouTube';
import { PageBreadcrumbs } from '@/components/PageBreadcrumbs';
import { RelatedLinks } from '@/components/RelatedLinks';
import { breadcrumbTrailFor } from '@/lib/breadcrumbs';
import { getRelatedGraph } from '@/lib/relatedContent';
import { siteCatalogs } from '@/lib/siteCatalogs';
import { desktopToolByAnchor, toolsHref } from '@/lib/toolAnchors';
import { videoObjectJsonLd, videosForPlaylist, youtubeThumb, youtubeWatchUrl } from '@/lib/videoLibrary';

export default function VideoDetail() {
  const [, params] = useRoute('/video/:slug');
  const { language } = useLanguage();
  const lang = language === 'ar' ? 'ar' : 'en';
  const { allArticles } = useAllArticles();
  const video = libraryVideos.find((v) => v.slug === params?.slug);
  const playlist = video ? libraryPlaylists.find((p) => p.slug === video.playlist) : undefined;

  useSEO({
    title: video?.title[lang],
    description: video?.description[lang],
    image: video ? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg` : undefined,
    indexable: Boolean(video),
  });
  useJsonLd('jsonld-video', video ? videoObjectJsonLd(video, lang, `${SITE.url}/${lang}/video/${video.slug}`) : null);

  if (!video || !playlist) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">{lang === 'ar' ? 'الفيديو غير موجود' : 'Video not found'}</h1>
        <Link href="/videos" className="text-primary hover:underline">{lang === 'ar' ? 'مكتبة الفيديو' : 'Video library'}</Link>
      </div>
    );
  }

  const items = videosForPlaylist(playlist, libraryVideos);
  const index = items.findIndex((v) => v.slug === video.slug);
  const previous = index > 0 ? items[index - 1] : null;
  const next = index >= 0 && index < items.length - 1 ? items[index + 1] : null;
  const primaryArticles = (video.relatedArticles && video.relatedArticles.length > 0
    ? video.relatedArticles
    : [playlist.pillarArticle, ...playlist.relatedArticles]
  )
    .map((slug) => allArticles.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const seen = new Set<string>();
  const related = primaryArticles.filter((a) => (seen.has(a.slug) ? false : (seen.add(a.slug), true))).slice(0, 6);
  const toolAnchors = [...(video.relatedTools || []), ...(playlist.tools || [])];
  const tools = [...new Set(toolAnchors)].map((anchor) => desktopToolByAnchor(anchor)).filter((t): t is NonNullable<typeof t> => Boolean(t));
  const crossRelated = getRelatedGraph(video, siteCatalogs(), 3);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 max-w-3xl">
          <PageBreadcrumbs
            items={breadcrumbTrailFor(`/video/${video.slug}`, {
              lang,
              title: video.title[lang],
              playlist: { slug: playlist.slug, title: playlist.title },
            })}
          />
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{video.title[lang]}</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {lang === 'ar' ? 'القناة: ' : 'Channel: '}
            <a href={video.channel.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{video.channel.name}</a>
            {video.durationText ? ` · ${video.durationText}` : ''}
            {' · '}
            {lang === 'ar' ? `الدرس ${video.position} من ${items.length}` : `Lesson ${video.position} of ${items.length}`}
          </p>
          <LiteYouTube id={video.youtubeId} title={video.title[lang]} playLabel={lang === 'ar' ? 'تشغيل' : 'Play'} />
          {next && (
            <Link
              href={`/video/${next.slug}`}
              rel="next"
              className="mt-4 flex gap-3 rounded-xl border border-primary/40 bg-card p-3 hover:border-primary"
            >
              <img src={youtubeThumb(next.youtubeId)} alt="" width={160} height={90} className="h-16 w-28 rounded object-cover shrink-0" />
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-primary mb-1">
                  {lang === 'ar' ? 'شاهد التالي' : 'Watch next'}
                </span>
                <span className="font-medium">{next.title[lang]}</span>
                <span className="block text-xs text-muted-foreground mt-1">
                  {next.channel.name}
                  {next.durationText ? ` · ${next.durationText}` : ''}
                </span>
              </span>
            </Link>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            {lang === 'ar' ? 'العنوان الأصلي: ' : 'Original title: '}
            <span dir="auto">{video.originalTitle}</span>
            {' · '}
            <a href={youtubeWatchUrl(video.youtubeId)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary">
              {lang === 'ar' ? 'شاهد على يوتيوب (والنص الكامل من قائمة الفيديو)' : 'Watch on YouTube (full transcript from the video menu)'}
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-3">{lang === 'ar' ? 'ملخص' : 'Summary'}</h2>
            <p className="text-muted-foreground leading-relaxed">{video.description[lang]}</p>
          </section>
          <section className="mt-6">
            <h2 className="text-xl font-bold mb-3">{lang === 'ar' ? 'ملاحظات NetSec Atlas حول الموضوع' : 'NetSec Atlas notes on the topic'}</h2>
            <ul className="list-disc ps-6 space-y-1 text-muted-foreground">
              {video.notes[lang].map((note) => <li key={note}>{note}</li>)}
            </ul>
          </section>
          {(related.length > 0 || tools.length > 0) && (
            <section className="mt-6">
              <h2 className="text-xl font-bold mb-3">{lang === 'ar' ? 'على الموقع' : 'On this site'}</h2>
              {related.length > 0 && (
                <>
                  <h3 className="text-base font-semibold mb-2">{lang === 'ar' ? 'مقال مرتبط' : 'Related article'}</h3>
                  <ul className="list-disc ps-6 space-y-1 mb-4">
                    {related.map((a) => (
                      <li key={a.slug}><Link href={`/article/${a.slug}`} className="text-primary hover:underline">{a.title[lang]}</Link></li>
                    ))}
                  </ul>
                </>
              )}
              {tools.length > 0 && (
                <>
                  <h3 className="text-base font-semibold mb-2">{lang === 'ar' ? 'أداة مرتبطة' : 'Related tool'}</h3>
                  <ul className="list-disc ps-6 space-y-1">
                    {tools.map((tool) => (
                      <li key={tool.anchor}>
                        <Link href={toolsHref(tool.anchor)} className="text-primary hover:underline">
                          {tool.title[lang]}
                        </Link>
                        <span className="text-muted-foreground text-sm">
                          {lang === 'ar' ? ' في برنامج NetSec Atlas Tools' : ' in NetSec Atlas Tools'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}
          <nav aria-label={lang === 'ar' ? 'التنقل في القائمة' : 'Playlist navigation'} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
            {previous ? (
              <Link href={`/video/${previous.slug}`} rel="prev" className="block rounded-lg border border-border p-4 hover:border-primary">
                <span className="block text-xs text-muted-foreground mb-1">{lang === 'ar' ? 'الدرس السابق' : 'Previous lesson'}</span>
                <span className="font-medium">{previous.title[lang]}</span>
              </Link>
            ) : <span />}
            {next && (
              <Link href={`/video/${next.slug}`} rel="next" className="block rounded-lg border border-border p-4 hover:border-primary">
                <span className="block text-xs text-muted-foreground mb-1">{lang === 'ar' ? 'الدرس التالي' : 'Next lesson'}</span>
                <span className="font-medium">{next.title[lang]}</span>
              </Link>
            )}
          </nav>
        </div>
        <aside>
          <h2 className="text-lg font-bold mb-3">{playlist.title[lang]}</h2>
          <ol className="space-y-2">
            {items.map((v) => (
              <li key={v.slug}>
                <Link
                  href={`/video/${v.slug}`}
                  aria-current={v.slug === video.slug ? 'page' : undefined}
                  className={`flex gap-3 rounded-lg border p-3 transition-colors ${
                    v.slug === video.slug ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
                  }`}
                >
                  <span className="text-sm font-bold text-muted-foreground w-6 shrink-0">{v.position}</span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{v.title[lang]}</span>
                    <span className="block text-xs text-muted-foreground mt-1">
                      {v.durationText || v.channel.name}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </div>
      <RelatedLinks groups={crossRelated} language={lang} exclude={['videos']} />
    </div>
  );
}
