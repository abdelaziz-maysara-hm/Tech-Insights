import { Link, useRoute } from 'wouter';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { useJsonLd } from '@/hooks/useJsonLd';
import { useAllArticles } from '@/hooks/useAllArticles';
import { SITE } from '@/config/site';
import { libraryPlaylists, libraryVideos } from '@/data/videoLibrary';
import { LiteYouTube } from '@/components/video/LiteYouTube';
import {
  formatTotal,
  playlistItemListJsonLd,
  totalDurationSeconds,
  videosForPlaylist,
  youtubePlaylistUrl,
} from '@/lib/videoLibrary';

export default function VideoPlaylist() {
  const [, params] = useRoute('/videos/:playlist');
  const { language } = useLanguage();
  const lang = language === 'ar' ? 'ar' : 'en';
  const { allArticles } = useAllArticles();
  const playlist = libraryPlaylists.find((p) => p.slug === params?.playlist);
  const items = playlist ? videosForPlaylist(playlist, libraryVideos) : [];

  useSEO({
    title: playlist ? `${playlist.title[lang]} — ${lang === 'ar' ? 'قائمة تشغيل' : 'Playlist'}` : undefined,
    description: playlist?.description[lang],
    indexable: Boolean(playlist),
  });
  useJsonLd('jsonld-playlist', playlist ? playlistItemListJsonLd(playlist, items, lang, SITE.url) : null);

  if (!playlist) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">{lang === 'ar' ? 'القائمة غير موجودة' : 'Playlist not found'}</h1>
        <Link href="/videos" className="text-primary hover:underline">{lang === 'ar' ? 'كل القوائم' : 'All playlists'}</Link>
      </div>
    );
  }

  const first = items[0];
  const pillar = allArticles.find((a) => a.slug === playlist.pillarArticle);
  const related = playlist.relatedArticles
    .map((slug) => allArticles.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <div className="container mx-auto px-4 py-10">
      <nav aria-label="breadcrumb" className="text-sm text-muted-foreground mb-6">
        <Link href="/videos" className="hover:text-primary">{lang === 'ar' ? 'مكتبة الفيديو' : 'Video library'}</Link>
        <span className="mx-2">/</span>
        <span>{playlist.title[lang]}</span>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-3">{playlist.title[lang]}</h1>
          <p className="text-muted-foreground mb-2">{playlist.description[lang]}</p>
          <p className="text-sm text-muted-foreground mb-6">
            {items.length} {lang === 'ar' ? 'فيديو' : 'videos'} · {formatTotal(totalDurationSeconds(items), lang)}+
          </p>
          {first && <LiteYouTube id={first.youtubeId} title={first.title[lang]} playLabel={lang === 'ar' ? 'تشغيل' : 'Play'} />}
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-3">{lang === 'ar' ? 'كيف تستخدم هذه القائمة' : 'How to use this playlist'}</h2>
            <p className="text-muted-foreground leading-relaxed">{playlist.intro[lang]}</p>
            {pillar && (
              <p className="mt-4">
                {lang === 'ar' ? 'الدليل المرجعي لهذا المسار: ' : 'The reference guide for this track: '}
                <Link href={`/article/${pillar.slug}`} className="text-primary hover:underline font-medium">{pillar.title[lang]}</Link>
              </p>
            )}
          </section>
          {related.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold mb-3">{lang === 'ar' ? 'اقرأ مع القائمة' : 'Read alongside'}</h2>
              <ul className="list-disc ps-6 space-y-1">
                {related.map((a) => (
                  <li key={a.slug}><Link href={`/article/${a.slug}`} className="text-primary hover:underline">{a.title[lang]}</Link></li>
                ))}
                {(playlist.tools || []).map((tool) => (
                  <li key={tool}><Link href={`/tools/${tool}`} className="text-primary hover:underline">{tool === 'spf-record-analyzer' ? (lang === 'ar' ? 'أداة تحليل سجل SPF' : 'SPF record analyzer') : (lang === 'ar' ? 'أداة تحليل سجل DMARC' : 'DMARC record analyzer')}</Link></li>
                ))}
              </ul>
            </section>
          )}
          {playlist.externalPlaylists.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold mb-3">{lang === 'ar' ? 'دورات كاملة على يوتيوب' : 'Full courses on YouTube'}</h2>
              <ul className="space-y-2">
                {playlist.externalPlaylists.map((p) => (
                  <li key={p.youtubePlaylistId}>
                    <a href={youtubePlaylistUrl(p.youtubePlaylistId)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                      {p.title} — {p.channel.name} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <aside>
          <h2 className="text-lg font-bold mb-3">{lang === 'ar' ? 'محتوى القائمة' : 'Playlist contents'}</h2>
          <ol className="space-y-2">
            {items.map((v) => (
              <li key={v.slug}>
                <Link href={`/video/${v.slug}`} className="flex gap-3 rounded-lg border border-border p-3 hover:border-primary transition-colors">
                  <span className="text-sm font-bold text-muted-foreground w-6 shrink-0">{v.position}</span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{v.title[lang]}</span>
                    <span className="block text-xs text-muted-foreground mt-1">
                      {v.channel.name}
                      {v.durationText ? ` · ${v.durationText}` : ''}
                      {v.language === 'ar' ? (lang === 'ar' ? ' · بالعربية' : ' · Arabic') : ''}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
