import { Link, useRoute } from 'wouter';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { useJsonLd } from '@/hooks/useJsonLd';
import { useAllArticles } from '@/hooks/useAllArticles';
import { SITE } from '@/config/site';
import { libraryPlaylists, libraryVideos } from '@/data/videoLibrary';
import { LiteYouTube } from '@/components/video/LiteYouTube';
import { videoObjectJsonLd, videosForPlaylist, youtubeWatchUrl } from '@/lib/videoLibrary';

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
  const related = [playlist.pillarArticle, ...playlist.relatedArticles]
    .map((slug) => allArticles.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <nav aria-label="breadcrumb" className="text-sm text-muted-foreground mb-6">
          <Link href="/videos" className="hover:text-primary">{lang === 'ar' ? 'مكتبة الفيديو' : 'Video library'}</Link>
          <span className="mx-2">/</span>
          <Link href={`/videos/${playlist.slug}`} className="hover:text-primary">{playlist.title[lang]}</Link>
        </nav>
        <h1 className="text-2xl md:text-3xl font-bold mb-3">{video.title[lang]}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {lang === 'ar' ? 'القناة: ' : 'Channel: '}
          <a href={video.channel.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{video.channel.name}</a>
          {video.durationText ? ` · ${video.durationText}` : ''}
          {' · '}
          {lang === 'ar' ? `الدرس ${video.position} من ${items.length}` : `Lesson ${video.position} of ${items.length}`}
        </p>
        <LiteYouTube id={video.youtubeId} title={video.title[lang]} playLabel={lang === 'ar' ? 'تشغيل' : 'Play'} />
        <p className="text-xs text-muted-foreground mt-2">
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
        {related.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xl font-bold mb-3">{lang === 'ar' ? 'مقالات مرتبطة' : 'Related articles'}</h2>
            <ul className="list-disc ps-6 space-y-1">
              {related.map((a) => (
                <li key={a.slug}><Link href={`/article/${a.slug}`} className="text-primary hover:underline">{a.title[lang]}</Link></li>
              ))}
            </ul>
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
    </div>
  );
}
