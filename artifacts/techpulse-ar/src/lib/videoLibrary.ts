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
  relatedArticles?: string[];
  relatedTools?: string[];
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
  topics?: string[];
  vendors?: string[];
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

export const TOPIC_LABELS: Record<string, Bilingual> = {
  firewalls: { ar: 'جدران الحماية', en: 'Firewalls' },
  vpn: { ar: 'VPN', en: 'VPN' },
  networking: { ar: 'الشبكات', en: 'Networking' },
  wireshark: { ar: 'Wireshark', en: 'Wireshark' },
  dns: { ar: 'DNS', en: 'DNS' },
  soc: { ar: 'SOC', en: 'SOC' },
  siem: { ar: 'SIEM', en: 'SIEM' },
  identity: { ar: 'الهوية', en: 'Identity' },
  'active-directory': { ar: 'Active Directory', en: 'Active Directory' },
  windows: { ar: 'ويندوز', en: 'Windows' },
  endpoint: { ar: 'الأجهزة الطرفية', en: 'Endpoint' },
  vulnerability: { ar: 'الثغرات', en: 'Vulnerability' },
  email: { ar: 'البريد', en: 'Email' },
  web: { ar: 'الويب', en: 'Web' },
  career: { ar: 'المسار المهني', en: 'Career' },
  certifications: { ar: 'الشهادات', en: 'Certifications' },
  wifi: { ar: 'Wi-Fi', en: 'Wi-Fi' },
  wireless: { ar: 'لاسلكي', en: 'Wireless' },
  tls: { ar: 'TLS', en: 'TLS' },
  certificates: { ar: 'الشهادات الرقمية', en: 'Certificates' },
  subnetting: { ar: 'تقسيم الشبكات', en: 'Subnetting' },
};

export function topicLabel(topic: string, lang: Lang): string {
  return TOPIC_LABELS[topic]?.[lang] || topic;
}

export function uniqueTopics(playlists: LibraryPlaylist[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of playlists) {
    for (const t of p.topics || []) {
      if (!seen.has(t)) {
        seen.add(t);
        out.push(t);
      }
    }
  }
  return out;
}

export function videoMatchesQuery(video: LibraryVideo, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [
    video.title.ar,
    video.title.en,
    video.originalTitle,
    video.description.ar,
    video.description.en,
    video.channel.name,
    video.slug,
    ...(video.notes.ar || []),
    ...(video.notes.en || []),
  ]
    .join(' ')
    .toLowerCase();
  return hay.includes(q);
}
