/**
 * Resize Unsplash hero URLs so a 64px thumb does not download an 800px file.
 * Non-Unsplash URLs are returned unchanged.
 */
export function sizedHero(url: string | undefined, width: number, height?: number): string {
  if (!url) return '';
  try {
    const u = new URL(url);
    if (u.hostname === 'images.unsplash.com' || u.hostname.endsWith('.unsplash.com')) {
      u.searchParams.set('auto', 'format');
      u.searchParams.set('fit', 'crop');
      u.searchParams.set('w', String(width));
      if (height) u.searchParams.set('h', String(height));
      if (!u.searchParams.get('q')) u.searchParams.set('q', '70');
      return u.toString();
    }
  } catch {
    /* keep the original URL */
  }
  return url;
}

export function heroSrcSet(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    if (u.hostname !== 'images.unsplash.com' && !u.hostname.endsWith('.unsplash.com')) {
      return undefined;
    }
    return [400, 800, 1200]
      .map((w) => `${sizedHero(url, w, Math.round((w * 9) / 16))} ${w}w`)
      .join(', ');
  } catch {
    return undefined;
  }
}
