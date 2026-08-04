/**
 * URL-only media helpers.
 * We never upload binary files to Vercel/Git — only store external links.
 * Thumbnails for YouTube come from img.youtube.com automatically.
 */

/** Extract an 11-char YouTube video id from a bare id or full URL. */
export function extractYouTubeId(input: string | undefined | null): string {
  if (!input) return '';
  const raw = input.trim();
  if (!raw) return '';

  // Already a plain id
  if (/^[\w-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0] || '';
      return /^[\w-]{11}$/.test(id) ? id : '';
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      const v = url.searchParams.get('v');
      if (v && /^[\w-]{11}$/.test(v)) return v;

      // /embed/ID or /shorts/ID or /live/ID
      const parts = url.pathname.split('/').filter(Boolean);
      const markers = ['embed', 'shorts', 'live', 'v'];
      for (let i = 0; i < parts.length - 1; i++) {
        if (markers.includes(parts[i]!) && /^[\w-]{11}$/.test(parts[i + 1]!)) {
          return parts[i + 1]!;
        }
      }
    }
  } catch {
    // not a URL
  }

  // Last resort: find 11-char token in the string
  const match = raw.match(/[\w-]{11}/);
  return match ? match[0] : '';
}

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/** Extract a YouTube playlist id (starts with PL/UU/FL/LL, etc.) from a bare id or full URL. */
export function extractYouTubePlaylistId(input: string | undefined | null): string {
  if (!input) return '';
  const raw = input.trim();
  if (!raw) return '';

  // Already a plain playlist id
  if (/^[\w-]{13,}$/.test(raw) && !/^[\w-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    const list = url.searchParams.get('list');
    if (list) return list;
  } catch {
    // not a URL
  }
  return '';
}

/** In-page embed URL (youtube-nocookie for slightly more privacy-friendly embed). */
export function youtubeEmbedUrl(id: string): string {
  const clean = extractYouTubeId(id);
  return clean ? `https://www.youtube-nocookie.com/embed/${clean}` : '';
}

/** In-page playlist embed URL -- plays through the whole playlist in order. */
export function youtubePlaylistEmbedUrl(playlistId: string): string {
  const clean = extractYouTubePlaylistId(playlistId);
  return clean ? `https://www.youtube-nocookie.com/embed/videoseries?list=${clean}` : '';
}

export function youtubeThumbnailUrl(id: string, quality: 'maxresdefault' | 'hqdefault' = 'maxresdefault'): string {
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
}

/** Accept only http(s) image URLs — never data: or relative paths for CMS content. */
export function normalizeImageUrl(input: string | undefined | null, fallback: string): string {
  if (!input) return fallback;
  const trimmed = input.trim();
  if (!trimmed) return fallback;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return fallback;
    return trimmed;
  } catch {
    return fallback;
  }
}

export function isHttpUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
