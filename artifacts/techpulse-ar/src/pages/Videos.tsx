import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { ListVideo, PlayCircle, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { useJsonLd } from '@/hooks/useJsonLd';
import { SITE } from '@/config/site';
import { libraryPlaylists, libraryVideos } from '@/data/videoLibrary';
import {
  formatTotal,
  topicLabel,
  totalDurationSeconds,
  uniqueTopics,
  videoMatchesQuery,
  videosForPlaylist,
  youtubeThumb,
} from '@/lib/videoLibrary';

export default function Videos() {
  const { language } = useLanguage();
  const lang = language === 'ar' ? 'ar' : 'en';
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('');
  const [vendor, setVendor] = useState('');
  const [spoken, setSpoken] = useState('');

  const topics = useMemo(() => uniqueTopics(libraryPlaylists), []);
  const vendors = useMemo(() => {
    const names = [...new Set(libraryVideos.map((v) => v.channel.name))].sort((a, b) => a.localeCompare(b));
    return names;
  }, []);

  const filteredPlaylists = useMemo(() => {
    return libraryPlaylists.filter((playlist) => {
      if (topic && !(playlist.topics || []).includes(topic)) return false;
      const items = videosForPlaylist(playlist, libraryVideos).filter((v) => {
        if (vendor && v.channel.name !== vendor) return false;
        if (spoken && (v.language || 'en') !== spoken) return false;
        return videoMatchesQuery(v, query);
      });
      if (vendor || spoken || query.trim()) return items.length > 0;
      return true;
    });
  }, [query, topic, vendor, spoken]);

  const filteredVideos = useMemo(() => {
    const allow = new Set(filteredPlaylists.map((p) => p.slug));
    return libraryVideos.filter((v) => {
      if (!allow.has(v.playlist) && topic) {
        const pl = libraryPlaylists.find((p) => p.slug === v.playlist);
        if (!(pl?.topics || []).includes(topic)) return false;
      }
      if (topic) {
        const pl = libraryPlaylists.find((p) => p.slug === v.playlist);
        if (!(pl?.topics || []).includes(topic)) return false;
      }
      if (vendor && v.channel.name !== vendor) return false;
      if (spoken && (v.language || 'en') !== spoken) return false;
      return videoMatchesQuery(v, query);
    });
  }, [query, topic, vendor, spoken, filteredPlaylists]);

  const filtersOn = Boolean(query.trim() || topic || vendor || spoken);
  const title = lang === 'ar' ? 'مكتبة الفيديو: قوائم تشغيل في الشبكات والأمن' : 'Video Library: Network & Security Playlists';
  const description =
    lang === 'ar'
      ? `${libraryPlaylists.length} قوائم تشغيل مرتبة حسب الموضوع، تضم ${libraryVideos.length} فيديو مختارًا من قنوات موثوقة مع ملخص وملاحظات ومقالات وأدوات مرتبطة.`
      : `${libraryPlaylists.length} playlists organised by topic, with ${libraryVideos.length} hand-picked videos from reputable channels plus summaries, notes, and related articles and tools.`;
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

  const selectClass = 'rounded-md border border-border bg-background px-3 py-2 text-sm min-h-10';

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="max-w-3xl mx-auto mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        <p className="text-sm text-muted-foreground mt-3">
          {lang === 'ar'
            ? 'كل فيديو يعمل بوضع الخصوصية المحسّن (youtube-nocookie) ولا يُحمَّل المشغّل إلا عند الضغط على تشغيل.'
            : 'Every video uses privacy-enhanced mode (youtube-nocookie) and the player only loads when you press play.'}
        </p>
      </header>

      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="max-w-5xl mx-auto mb-8 rounded-xl border border-border bg-card p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="block text-sm">
            <span className="mb-1 flex items-center gap-1 font-medium">
              <Search className="h-3.5 w-3.5" aria-hidden />
              {lang === 'ar' ? 'بحث' : 'Search'}
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'عنوان أو قناة أو موضوع…' : 'Title, channel or topic…'}
              className={`${selectClass} w-full`}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">{lang === 'ar' ? 'الموضوع' : 'Topic'}</span>
            <select value={topic} onChange={(e) => setTopic(e.target.value)} className={`${selectClass} w-full`}>
              <option value="">{lang === 'ar' ? 'كل الموضوعات' : 'All topics'}</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {topicLabel(t, lang)}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">{lang === 'ar' ? 'القناة / المورد' : 'Vendor / channel'}</span>
            <select value={vendor} onChange={(e) => setVendor(e.target.value)} className={`${selectClass} w-full`}>
              <option value="">{lang === 'ar' ? 'كل القنوات' : 'All channels'}</option>
              {vendors.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">{lang === 'ar' ? 'اللغة' : 'Language'}</span>
            <select value={spoken} onChange={(e) => setSpoken(e.target.value)} className={`${selectClass} w-full`}>
              <option value="">{lang === 'ar' ? 'كل اللغات' : 'All languages'}</option>
              <option value="ar">{lang === 'ar' ? 'العربية' : 'Arabic'}</option>
              <option value="en">{lang === 'ar' ? 'الإنجليزية' : 'English'}</option>
            </select>
          </label>
        </div>
        {filtersOn && (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <p className="text-muted-foreground">
              {lang === 'ar'
                ? `${filteredVideos.length} فيديو في ${filteredPlaylists.length} قائمة`
                : `${filteredVideos.length} videos in ${filteredPlaylists.length} playlists`}
            </p>
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => {
                setQuery('');
                setTopic('');
                setVendor('');
                setSpoken('');
              }}
            >
              {lang === 'ar' ? 'مسح التصفية' : 'Clear filters'}
            </button>
          </div>
        )}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaylists.map((playlist) => {
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
                  {(playlist.topics || []).slice(0, 2).map((t) => (
                    <span key={t} className="rounded-full bg-muted px-2 py-1">
                      {topicLabel(t, lang)}
                    </span>
                  ))}
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

      {filtersOn && (
        <section className="max-w-5xl mx-auto mt-12">
          <h2 className="text-xl font-bold mb-4">{lang === 'ar' ? 'الفيديوهات المطابقة' : 'Matching videos'}</h2>
          {filteredVideos.length === 0 ? (
            <p className="text-muted-foreground">{lang === 'ar' ? 'لا توجد نتائج لهذه التصفية.' : 'No videos match these filters.'}</p>
          ) : (
            <ul className="space-y-2">
              {filteredVideos.map((v) => (
                <li key={v.slug}>
                  <Link href={`/video/${v.slug}`} className="flex gap-3 rounded-lg border border-border p-3 hover:border-primary">
                    <img src={youtubeThumb(v.youtubeId)} alt="" width={128} height={96} className="h-16 w-24 rounded object-cover shrink-0" />
                    <span>
                      <span className="block font-medium">{v.title[lang]}</span>
                      <span className="block text-xs text-muted-foreground mt-1">
                        {v.channel.name}
                        {v.durationText ? ` · ${v.durationText}` : ''}
                        {v.language === 'ar' ? (lang === 'ar' ? ' · بالعربية' : ' · Arabic') : ''}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
