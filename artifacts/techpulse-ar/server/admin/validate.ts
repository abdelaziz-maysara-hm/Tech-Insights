/**
 * Lightweight, dependency-free validation + normalization for CMS collections.
 * Used by the admin router (Replit/Netlify) so bad JSON never gets committed.
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

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isBilingual(v: unknown): v is { ar: string; en: string } {
  if (!isObject(v)) return false;
  return typeof v.ar === 'string' && typeof v.en === 'string';
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80) || `item-${Date.now()}`;
}

function today(): string {
  return new Date().toISOString().split('T')[0]!;
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
    typeof raw.slug === 'string' && raw.slug.trim()
      ? slugify(raw.slug)
      : slugFromTitle;

  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((t): t is string => typeof t === 'string').map((t) => t.trim()).filter(Boolean)
    : typeof raw.tags === 'string'
      ? raw.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

  const readTime =
    typeof raw.readTime === 'number' && raw.readTime > 0
      ? Math.min(Math.round(raw.readTime), 120)
      : 5;

  const heroImage =
    typeof raw.heroImage === 'string' && raw.heroImage.trim()
      ? raw.heroImage.trim()
      : `https://picsum.photos/seed/${slug}/800/450`;

  const author =
    isObject(raw.author) && isBilingual((raw.author as any).name)
      ? {
          name: (raw.author as any).name as { ar: string; en: string },
          avatar:
            typeof (raw.author as any).avatar === 'string'
              ? (raw.author as any).avatar
              : 'https://i.pravatar.cc/150?img=68',
        }
      : {
          name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
          avatar: 'https://i.pravatar.cc/150?img=68',
        };

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

  if (typeof raw.youtubeVideoId === 'string' && raw.youtubeVideoId.trim()) {
    item.youtubeVideoId = raw.youtubeVideoId.trim();
  }
  if (typeof raw.subcategoryId === 'string' && raw.subcategoryId.trim()) {
    item.subcategoryId = raw.subcategoryId.trim();
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
  const youtubeId =
    typeof raw.youtubeId === 'string'
      ? raw.youtubeId.trim()
      : typeof raw.youtubeVideoId === 'string'
        ? raw.youtubeVideoId.trim()
        : '';
  if (!youtubeId) {
    errors.push(`${prefix}.youtubeId: required non-empty string`);
  }
  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    errors: [],
    item: {
      id: typeof raw.id === 'string' && raw.id.trim() ? String(raw.id) : undefined,
      title: raw.title,
      description: isBilingual(raw.description)
        ? raw.description
        : { ar: '', en: '' },
      youtubeId,
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
    typeof raw.slug === 'string' && raw.slug.trim()
      ? slugify(raw.slug)
      : slugify(enTitle);

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

/** Example article shape for admin UI / docs. */
export const ARTICLE_JSON_EXAMPLE = `[
  {
    "title": {
      "ar": "عنوان المقال بالعربية",
      "en": "Article Title in English"
    },
    "excerpt": {
      "ar": "ملخص قصير يظهر في البطاقات.",
      "en": "Short excerpt shown on cards."
    },
    "body": {
      "ar": "## المقدمة\\n\\nنص المقال الكامل. استخدم ## للعناوين الفرعية.",
      "en": "## Introduction\\n\\nFull article body. Use ## for subheadings."
    },
    "categoryId": "mobile",
    "tags": ["هاتف", "Phone", "Tips"],
    "readTime": 5,
    "isFeatured": false,
    "isTrending": false,
    "heroImage": "https://picsum.photos/seed/my-article/800/450"
  }
]`;
