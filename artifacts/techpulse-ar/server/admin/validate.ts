/**
 * Lightweight, dependency-free validation + normalization for CMS collections.
 * Media is URL-only (no binary uploads) to stay within Vercel/Git limits.
 */

export type CollectionName = 'articles' | 'videos' | 'pages';

const CATEGORIES = new Set([
  'cybersecurity',
  'mobile',
  'laptops',
  'howto',
  'ai',
  'reviews',
  'windows',
  'comparisons',
  'technology',
]);

/** Mirrors src/data/subcategories.ts -- kept in sync manually, same as scripts/generator/categories.mjs. */
const ALLOWED_SUBCATEGORIES: Record<string, Set<string>> = {
  mobile: new Set(['reviews', 'best-picks', 'guides-tips', 'concepts', 'news-updates', 'general']),
  laptops: new Set(['reviews', 'best-picks', 'guides-tips', 'concepts', 'news-updates', 'general']),
  windows: new Set(['reviews', 'best-picks', 'guides-tips', 'concepts', 'news-updates', 'general']),
  howto: new Set(['reviews', 'best-picks', 'guides-tips', 'concepts', 'news-updates', 'general']),
  ai: new Set(['reviews', 'best-picks', 'guides-tips', 'concepts', 'news-updates', 'general']),
  technology: new Set(['reviews', 'best-picks', 'guides-tips', 'concepts', 'news-updates', 'general']),
  cybersecurity: new Set([
    'guides-tips', 'network-security', 'identity', 'endpoint', 'vpn-remote', 'concepts', 'news-updates', 'general',
  ]),
  reviews: new Set(['phones-wearables', 'audio', 'cameras-drones', 'gaming', 'accessories-peripherals', 'general']),
  comparisons: new Set([
    'phones', 'laptops-pcs', 'network-security', 'identity', 'endpoint',
    'software-services', 'gaming-consoles', 'wearables', 'general',
  ]),
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isBilingual(v: unknown): v is { ar: string; en: string } {
  if (!isObject(v)) return false;
  return typeof v.ar === 'string' && typeof v.en === 'string';
}

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 80) || `item-${Date.now()}`
  );
}

function today(): string {
  return new Date().toISOString().split('T')[0]!;
}

/** Extract 11-char YouTube id from bare id or full URL. */
export function extractYouTubeId(input: string | undefined | null): string {
  if (!input) return '';
  const raw = input.trim();
  if (!raw) return '';
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
      const parts = url.pathname.split('/').filter(Boolean);
      const markers = ['embed', 'shorts', 'live', 'v'];
      for (let i = 0; i < parts.length - 1; i++) {
        if (markers.includes(parts[i]!) && /^[\w-]{11}$/.test(parts[i + 1]!)) {
          return parts[i + 1]!;
        }
      }
    }
  } catch {
    /* not a URL */
  }

  const match = raw.match(/[\w-]{11}/);
  return match ? match[0] : '';
}

/** Extract a YouTube playlist id (?list=...) from a bare id or full URL. */
export function extractYouTubePlaylistId(input: string | undefined | null): string {
  if (!input) return '';
  const raw = input.trim();
  if (!raw) return '';
  if (/^[\w-]{13,}$/.test(raw) && !/^[\w-]{11}$/.test(raw)) return raw;
  try {
    const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    const list = url.searchParams.get('list');
    if (list) return list;
  } catch {
    /* not a URL */
  }
  return '';
}

function normalizeHttpsUrl(input: string | undefined | null, fallback: string): string {
  if (!input || !String(input).trim()) return fallback;
  const trimmed = String(input).trim();
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return fallback;
    return trimmed;
  } catch {
    return fallback;
  }
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  item?: Record<string, unknown>;
}

export function validateAndNormalizeArticle(
  raw: unknown,
  index?: number,
): ValidationResult {
  const prefix = index !== undefined ? `articles[${index}]` : 'article';
  const errors: string[] = [];

  if (!isObject(raw)) {
    return { ok: false, errors: [`${prefix}: must be an object`] };
  }

  if (!isBilingual(raw.title) || !raw.title.ar.trim() || !raw.title.en.trim()) {
    errors.push(`${prefix}.title: required bilingual object { ar, en } with non-empty strings`);
  }
  if (!isBilingual(raw.excerpt) || !raw.excerpt.ar.trim() || !raw.excerpt.en.trim()) {
    errors.push(`${prefix}.excerpt: required bilingual object { ar, en } with non-empty strings`);
  }
  if (!isBilingual(raw.body) || !raw.body.ar.trim() || !raw.body.en.trim()) {
    errors.push(`${prefix}.body: required bilingual object { ar, en } with non-empty strings`);
  }

  const categoryId =
    typeof raw.categoryId === 'string' && CATEGORIES.has(raw.categoryId)
      ? raw.categoryId
      : 'technology';

  if (typeof raw.categoryId === 'string' && !CATEGORIES.has(raw.categoryId)) {
    errors.push(
      `${prefix}.categoryId: invalid "${raw.categoryId}". Allowed: ${[...CATEGORIES].join(', ')}`,
    );
  }

  if (errors.length) return { ok: false, errors };

  const enTitle = (raw.title as { en: string }).en;
  const slugFromTitle = slugify(enTitle);
  const slug =
    typeof raw.slug === 'string' && raw.slug.trim() ? slugify(raw.slug) : slugFromTitle;

  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((t): t is string => typeof t === 'string').map((t) => t.trim()).filter(Boolean)
    : typeof raw.tags === 'string'
      ? raw.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

  const readTime =
    typeof raw.readTime === 'number' && raw.readTime > 0
      ? Math.min(Math.round(raw.readTime), 120)
      : 5;

  const heroImage = normalizeHttpsUrl(
    typeof raw.heroImage === 'string' ? raw.heroImage : undefined,
    `https://picsum.photos/seed/${slug}/800/450`,
  );

  const author =
    isObject(raw.author) && isBilingual((raw.author as any).name)
      ? {
          name: (raw.author as any).name as { ar: string; en: string },
          avatar: normalizeHttpsUrl(
            typeof (raw.author as any).avatar === 'string' ? (raw.author as any).avatar : undefined,
            'https://i.pravatar.cc/150?img=68',
          ),
        }
      : {
          name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
          avatar: 'https://i.pravatar.cc/150?img=68',
        };

  const ytRaw =
    typeof raw.youtubeVideoId === 'string'
      ? raw.youtubeVideoId
      : typeof raw.youtubeId === 'string'
        ? raw.youtubeId
        : typeof raw.youtubeUrl === 'string'
          ? raw.youtubeUrl
          : '';
  const youtubeVideoId = extractYouTubeId(ytRaw);

  const item: Record<string, unknown> = {
    id: typeof raw.id === 'string' && raw.id.trim() ? String(raw.id) : undefined,
    slug,
    title: raw.title,
    excerpt: raw.excerpt,
    body: raw.body,
    categoryId,
    author,
    date:
      typeof raw.date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(raw.date)
        ? raw.date.slice(0, 10)
        : today(),
    readTime,
    heroImage,
    tags,
    isFeatured: Boolean(raw.isFeatured),
    isTrending: Boolean(raw.isTrending),
  };

  if (youtubeVideoId) item.youtubeVideoId = youtubeVideoId;
  if (typeof raw.subcategoryId === 'string' && raw.subcategoryId.trim()) {
    const sub = raw.subcategoryId.trim();
    const allowed = ALLOWED_SUBCATEGORIES[categoryId];
    if (allowed && !allowed.has(sub)) {
      return {
        ok: false,
        errors: [`${prefix}.subcategoryId: "${sub}" is not allowed under category "${categoryId}". Allowed: ${[...(allowed || [])].join(', ')}`],
      };
    }
    item.subcategoryId = sub;
  }

  return { ok: true, errors: [], item };
}

export function validateAndNormalizeVideo(
  raw: unknown,
  index?: number,
): ValidationResult {
  const prefix = index !== undefined ? `videos[${index}]` : 'video';
  const errors: string[] = [];

  if (!isObject(raw)) {
    return { ok: false, errors: [`${prefix}: must be an object`] };
  }
  if (!isBilingual(raw.title) || !raw.title.ar.trim() || !raw.title.en.trim()) {
    errors.push(`${prefix}.title: required bilingual { ar, en }`);
  }

  const ytRaw =
    typeof raw.youtubeId === 'string'
      ? raw.youtubeId
      : typeof raw.youtubeVideoId === 'string'
        ? raw.youtubeVideoId
        : typeof raw.youtubeUrl === 'string'
          ? raw.youtubeUrl
          : typeof raw.url === 'string'
            ? raw.url
            : '';
  const youtubeId = extractYouTubeId(ytRaw);
  const youtubePlaylistId =
    typeof raw.youtubePlaylistId === 'string'
      ? extractYouTubePlaylistId(raw.youtubePlaylistId)
      : extractYouTubePlaylistId(ytRaw);

  if (!youtubeId && !youtubePlaylistId) {
    errors.push(
      `${prefix}.youtubeId: required — paste a YouTube video or playlist URL (e.g. https://youtu.be/dQw4w9WgXcQ or a ?list=... playlist link)`,
    );
  }
  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    errors: [],
    item: {
      id: typeof raw.id === 'string' && raw.id.trim() ? String(raw.id) : undefined,
      title: raw.title,
      description: isBilingual(raw.description) ? raw.description : { ar: '', en: '' },
      youtubeId,
      ...(youtubePlaylistId ? { youtubePlaylistId } : {}),
      date:
        typeof raw.date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(raw.date)
          ? raw.date.slice(0, 10)
          : today(),
    },
  };
}

export function validateAndNormalizePage(
  raw: unknown,
  index?: number,
): ValidationResult {
  const prefix = index !== undefined ? `pages[${index}]` : 'page';
  const errors: string[] = [];

  if (!isObject(raw)) {
    return { ok: false, errors: [`${prefix}: must be an object`] };
  }
  if (!isBilingual(raw.title) || !raw.title.ar.trim() || !raw.title.en.trim()) {
    errors.push(`${prefix}.title: required bilingual { ar, en }`);
  }
  if (!isBilingual(raw.content) || !raw.content.ar.trim() || !raw.content.en.trim()) {
    errors.push(`${prefix}.content: required bilingual { ar, en }`);
  }
  if (errors.length) return { ok: false, errors };

  const enTitle = (raw.title as { en: string }).en;
  const slug =
    typeof raw.slug === 'string' && raw.slug.trim() ? slugify(raw.slug) : slugify(enTitle);

  return {
    ok: true,
    errors: [],
    item: {
      id: typeof raw.id === 'string' && raw.id.trim() ? String(raw.id) : undefined,
      slug,
      title: raw.title,
      content: raw.content,
      updatedAt:
        typeof raw.updatedAt === 'string' && /^\d{4}-\d{2}-\d{2}/.test(raw.updatedAt)
          ? raw.updatedAt.slice(0, 10)
          : today(),
      showInFooter: raw.showInFooter !== false,
    },
  };
}

export function validateCollectionItem(
  collection: CollectionName,
  raw: unknown,
  index?: number,
): ValidationResult {
  if (collection === 'articles') return validateAndNormalizeArticle(raw, index);
  if (collection === 'videos') return validateAndNormalizeVideo(raw, index);
  return validateAndNormalizePage(raw, index);
}

export function validateCollectionItems(
  collection: CollectionName,
  items: unknown[],
): { ok: true; items: Record<string, unknown>[] } | { ok: false; errors: string[] } {
  const normalized: Record<string, unknown>[] = [];
  const errors: string[] = [];

  for (let i = 0; i < items.length; i++) {
    const result = validateCollectionItem(collection, items[i], i);
    if (!result.ok || !result.item) {
      errors.push(...result.errors);
    } else {
      normalized.push(result.item);
    }
  }

  if (errors.length) return { ok: false, errors: errors.slice(0, 20) };
  return { ok: true, items: normalized };
}
