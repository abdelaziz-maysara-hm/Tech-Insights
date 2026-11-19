/**
 * Video library helpers shared by the React app and the static prerender.
 * Pure functions with no path aliases so Node can import them directly.
 * Data: src/content/videos.json + src/content/video-playlists.json, built by
 * scripts/phase7/build-videos.mjs from oEmbed-verified YouTube IDs only.
 */

export type Lang = 'ar' | 'en';
export type Bilingual = { ar: string; en: string };

export interface LibraryVideo {
  id: string;
  slug: string;
  youtubeId: string;
  title: Bilingual;
  originalTitle: string;
  description: Bilingual;
  notes: { ar: string[]; en: string[] };
  channel: { name: string; url: string };
  duration: string | null;
  durationText: string | null;
  language?: string;
  playlist: string;
  position: number;
  date: string;
  categoryId?: string;
}

export interface ExternalPlaylist {
  youtubePlaylistId: string;
  title: string;
  channel: { name: string; url: string };
}

export interface LibraryPlaylist {
  slug: string;
  pillar: string;
  title: Bilingual;
  description: Bilingual;
  intro: Bilingual;
  pillarArticle: string;
  relatedArticles: string[];
  externalPlaylists: ExternalPlaylist[];
  tools?: string[];
  videos: string[];
  updatedAt: string;
}

export const YOUTUBE_ID_RE = /^[\w-]{11}$/;

export function youtubeNoCookieEmbed(id: string, autoplay = false): string {
  return `https://www.youtube-nocookie.com/embed/${id}${autoplay ? '?autoplay=1&rel=0' : '?rel=0'}`;
}

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function youtubeThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function youtubePlaylistUrl(id: string): string {
  return `https://www.youtube.com/playlist?list=${id}`;
}

export function videosForPlaylist(playlist: LibraryPlaylist, videos: LibraryVideo[]): LibraryVideo[] {
  const bySlug = new Map(videos.map((v) => [v.slug, v]));
  return playlist.videos.map((slug) => bySlug.get(slug)).filter((v): v is LibraryVideo => Boolean(v));
}

/** Total runtime of the videos with a known duration, as "H:MM" or "M min". */
export function totalDurationSeconds(videos: LibraryVideo[]): number {
  return videos.reduce((sum, v) => {
    if (!v.durationText) return sum;
    const parts = v.durationText.split(':').map(Number);
    while (parts.length < 3) parts.unshift(0);
    return sum + parts[0] * 3600 + parts[1] * 60 + parts[2];
  }, 0);
}

export function formatTotal(seconds: number, lang: Lang): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (lang === 'ar') return h ? `${h} ساعة و${m} دقيقة` : `${m} دقيقة`;
  return h ? `${h} h ${m} min` : `${m} min`;
}

/** The playlist (and its first video) that covers an article, if any. */
export function playlistForArticle(
  articleSlug: string,
  playlists: LibraryPlaylist[],
): LibraryPlaylist | null {
  return (
    playlists.find((p) => p.pillarArticle === articleSlug && p.pillar !== 'career') ||
    playlists.find((p) => p.relatedArticles.includes(articleSlug)) ||
    null
  );
}

export function videoObjectJsonLd(
  video: LibraryVideo,
  lang: Lang,
  pageUrl: string,
): Record<string, unknown> {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title[lang],
    description: video.description[lang],
    thumbnailUrl: [youtubeThumb(video.youtubeId)],
    embedUrl: youtubeNoCookieEmbed(video.youtubeId),
    url: pageUrl,
    inLanguage: video.language || undefined,
    author: { '@type': 'Organization', name: video.channel.name, url: video.channel.url },
    sameAs: youtubeWatchUrl(video.youtubeId),
  };
  if (video.duration) data.duration = video.duration;
  return data;
}

export function playlistItemListJsonLd(
  playlist: LibraryPlaylist,
  videos: LibraryVideo[],
  lang: Lang,
  siteUrl: string,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: playlist.title[lang],
    description: playlist.description[lang],
    numberOfItems: videos.length,
    itemListElement: videos.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${siteUrl}/${lang}/video/${v.slug}`,
      name: v.title[lang],
    })),
  };
}
