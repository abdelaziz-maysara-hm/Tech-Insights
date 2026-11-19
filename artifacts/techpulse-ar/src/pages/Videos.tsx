import { Link } from 'wouter';
import { ListVideo, PlayCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { useJsonLd } from '@/hooks/useJsonLd';
import { SITE } from '@/config/site';
import { libraryPlaylists, libraryVideos } from '@/data/videoLibrary';
import { formatTotal, totalDurationSeconds, videosForPlaylist, youtubeThumb } from '@/lib/videoLibrary';

export default function Videos() {
  const { language } = useLanguage();
  const lang = language === 'ar' ? 'ar' : 'en';
  const title = lang === 'ar' ? 'مكتبة الفيديو: قوائم تشغيل في الشبكات والأمن' : 'Video Library: Network & Security Playlists';
  const description =
    lang === 'ar'
      ? `${libraryPlaylists.length} قوائم تشغيل مرتبة حسب مسارات التعلم، تضم ${libraryVideos.length} فيديو مختارًا من قنوات موثوقة مع ملخص وملاحظات ومقالات مرتبطة.`
      : `${libraryPlaylists.length} playlists ordered as learning tracks, with ${libraryVideos.length} hand-picked videos from reputable channels plus summaries, notes and related articles.`;
  useSEO({ title, description });
  useJsonLd('jsonld-video-hub', {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    itemListElement: libraryPlaylists.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE.url}/${lang}/videos/${p.slug}`,
      name: p.title[lang],
    })),
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        <p className="text-sm text-muted-foreground mt-3">
          {lang === 'ar'
            ? 'كل فيديو يعمل بوضع الخصوصية المحسّن (youtube-nocookie) ولا يُحمَّل المشغّل إلا عند الضغط على تشغيل.'
            : 'Every video uses privacy-enhanced mode (youtube-nocookie) and the player only loads when you press play.'}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {libraryPlaylists.map((playlist) => {
          const items = videosForPlaylist(playlist, libraryVideos);
          const arabicCount = items.filter((v) => v.language === 'ar').length;
          const cover = items[0];
          return (
            <article key={playlist.slug} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
              <Link href={`/videos/${playlist.slug}`} className="relative block aspect-video bg-muted group">
                {cover && (
                  <img
                    src={youtubeThumb(cover.youtubeId)}
                    alt={playlist.title[lang]}
                    loading="lazy"
                    width={480}
                    height={360}
                    className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                )}
                <span className="absolute bottom-2 end-2 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs font-medium">
                  <ListVideo className="h-3.5 w-3.5" />
                  {items.length} {lang === 'ar' ? 'فيديو' : 'videos'}
                </span>
              </Link>
              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-lg font-bold mb-2">
                  <Link href={`/videos/${playlist.slug}`} className="hover:text-primary">
                    {playlist.title[lang]}
                  </Link>
                </h2>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{playlist.description[lang]}</p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-muted px-2 py-1">{formatTotal(totalDurationSeconds(items), lang)}+</span>
                  {arabicCount > 0 && (
                    <span className="rounded-full bg-muted px-2 py-1">
                      {lang === 'ar' ? `${arabicCount} بالعربية` : `${arabicCount} in Arabic`}
                    </span>
                  )}
                </div>
                <Link
                  href={`/videos/${playlist.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <PlayCircle className="h-4 w-4" />
                  {lang === 'ar' ? 'ابدأ القائمة' : 'Start the playlist'}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
