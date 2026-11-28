/**
 * Internal-linking helpers shared by the React app and the static prerender.
 * Pure functions with no path aliases so Node can import them directly.
 */

export interface RelatableArticle {
  id?: string;
  slug: string;
  categoryId?: string;
  subcategoryId?: string;
  tags?: string[];
  date?: string;
}

function normTag(tag: string): string {
  return String(tag).trim().toLowerCase();
}

/**
 * Rank other articles by topical closeness: shared tags weigh most, then the
 * same subcategory, then the same category; ties go to the newest article.
 * When fewer than three topical matches exist, the list is topped up with the
 * newest other articles so every article still links out to related reading.
 */
export function getRelatedArticles<T extends RelatableArticle>(
  article: RelatableArticle,
  all: readonly T[],
  limit = 6,
): T[] {
  const tags = new Set((article.tags ?? []).map(normTag));
  const scored = all
    .filter((other) => other.slug !== article.slug)
    .map((other) => {
      let score = 0;
      for (const tag of other.tags ?? []) if (tags.has(normTag(tag))) score += 3;
      if (article.subcategoryId && other.subcategoryId === article.subcategoryId) score += 2;
      if (article.categoryId && other.categoryId === article.categoryId) score += 1;
      return { other, score };
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || String(b.other.date ?? '').localeCompare(String(a.other.date ?? '')),
    );
  const picked = scored.slice(0, limit).map((entry) => entry.other);
  if (picked.length < Math.min(3, limit)) {
    const taken = new Set(picked.map((a) => a.slug));
    const newest = all
      .filter((other) => other.slug !== article.slug && !taken.has(other.slug))
      .slice()
      .sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')));
    for (const other of newest) {
      if (picked.length >= Math.min(3, limit)) break;
      picked.push(other);
    }
  }
  return picked;
}

/** Previous (older) and next (newer) article in the same category by date. */
export function getAdjacentArticles<T extends RelatableArticle>(
  article: RelatableArticle,
  all: readonly T[],
): { previous: T | null; next: T | null } {
  const sameCategory = all
    .filter((a) => a.categoryId === article.categoryId)
    .slice()
    .sort((a, b) => String(a.date ?? '').localeCompare(String(b.date ?? '')) || a.slug.localeCompare(b.slug));
  const index = sameCategory.findIndex((a) => a.slug === article.slug);
  if (index < 0) return { previous: null, next: null };
  return {
    previous: index > 0 ? sameCategory[index - 1] : null,
    next: index < sameCategory.length - 1 ? sameCategory[index + 1] : null,
  };
}

import { inferTopicIds, type Topicable } from './topicContent.ts';
import { TOPICS_BY_ID } from '../data/taxonomy/topics.ts';

export type RelatedKind =
  | 'article'
  | 'video'
  | 'playlist'
  | 'comparison'
  | 'alternative'
  | 'tool'
  | 'topic'
  | 'vendor';

export type RelatedLink = {
  href: string;
  title: { ar: string; en: string };
  kind: RelatedKind;
  slug?: string;
};

export type RelatedGroups = {
  articles: RelatedLink[];
  videos: RelatedLink[];
  playlists: RelatedLink[];
  comparisons: RelatedLink[];
  alternatives: RelatedLink[];
  tools: RelatedLink[];
  topics: RelatedLink[];
  vendors: RelatedLink[];
};

export type RelatedCatalogs = {
  articles?: Array<Topicable & { slug: string; title?: { ar: string; en: string }; date?: string; vendorIds?: string[] }>;
  comparisons?: Array<Topicable & { slug: string; title?: { ar: string; en: string }; date?: string }>;
  videos?: Array<Topicable & { slug: string; title?: { ar: string; en: string }; playlist?: string; relatedArticles?: string[]; relatedTools?: string[] }>;
  playlists?: Array<Topicable & { slug: string; title?: { ar: string; en: string }; relatedArticles?: string[]; vendors?: string[]; tools?: string[] }>;
  alternatives?: Array<Topicable & { slug: string; title?: { ar: string; en: string }; vendor?: string; product?: string }>;
  tools?: Array<{ anchor: string; title: { ar: string; en: string } }>;
  vendors?: Array<{ id: string; label: { ar: string; en: string } }>;
};

function locTitle(item: { title?: { ar?: string; en?: string } | string; slug?: string }): { ar: string; en: string } {
  const t = item.title;
  if (t && typeof t === 'object') {
    return { ar: t.ar || t.en || item.slug || '', en: t.en || t.ar || item.slug || '' };
  }
  const s = typeof t === 'string' ? t : item.slug || '';
  return { ar: s, en: s };
}

function tagsOf(item: Topicable): Set<string> {
  return new Set((item.tags ?? []).map((t) => String(t).trim().toLowerCase()));
}

function vendorsOf(item: Topicable): Set<string> {
  const ids = new Set<string>();
  for (const id of item.vendorIds ?? []) ids.add(String(id).toLowerCase());
  if (item.vendor) ids.add(String(item.vendor).toLowerCase().replace(/\s+/g, '-'));
  return ids;
}

function scoreAgainst(seed: Topicable, other: Topicable): number {
  let score = 0;
  const seedTopics = new Set(inferTopicIds(seed));
  const otherTopics = inferTopicIds(other);
  for (const id of otherTopics) if (seedTopics.has(id)) score += 4;
  const seedTags = tagsOf(seed);
  for (const tag of tagsOf(other)) if (seedTags.has(tag)) score += 3;
  const seedVendors = vendorsOf(seed);
  for (const id of vendorsOf(other)) if (seedVendors.has(id) || [...seedVendors].some((v) => id.includes(v) || v.includes(id))) score += 3;
  if (seed.subcategoryId && other.subcategoryId === seed.subcategoryId) score += 2;
  if (seed.categoryId && other.categoryId === seed.categoryId) score += 1;
  return score;
}

function pickScored<T extends { slug: string }>(
  seedSlug: string | undefined,
  items: readonly T[],
  scoreOf: (item: T) => number,
  limit: number,
): T[] {
  const scored = items
    .filter((item) => item.slug !== seedSlug)
    .map((item) => ({ item, score: scoreOf(item) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.slug.localeCompare(b.item.slug));
  return scored.slice(0, limit).map((entry) => entry.item);
}

const EMPTY_GROUPS: RelatedGroups = {
  articles: [],
  videos: [],
  playlists: [],
  comparisons: [],
  alternatives: [],
  tools: [],
  topics: [],
  vendors: [],
};

/**
 * Cross-type related links driven by topics, tags, vendors and categories.
 * New content is picked up automatically once it shares those fields (or
 * inferable tokens in the slug/title).
 */
export function getRelatedGraph(
  seed: Topicable & { slug?: string },
  catalogs: RelatedCatalogs,
  limitPerType = 3,
): RelatedGroups {
  const groups: RelatedGroups = {
    articles: [],
    videos: [],
    playlists: [],
    comparisons: [],
    alternatives: [],
    tools: [],
    topics: [],
    vendors: [],
  };

  const articles = catalogs.articles ?? [];
  const seedSlug = seed.slug;

  for (const article of pickScored(seedSlug, articles, (item) => scoreAgainst(seed, item), limitPerType)) {
    groups.articles.push({ href: `/article/${article.slug}`, title: locTitle(article), kind: 'article', slug: article.slug });
  }

  for (const comparison of pickScored(seedSlug, catalogs.comparisons ?? [], (item) => scoreAgainst(seed, item), limitPerType)) {
    groups.comparisons.push({
      href: `/comparison/${comparison.slug}`,
      title: locTitle(comparison),
      kind: 'comparison',
      slug: comparison.slug,
    });
  }

  for (const video of pickScored(seedSlug, catalogs.videos ?? [], (item) => {
    let score = scoreAgainst(seed, item);
    const playlist = (catalogs.playlists ?? []).find((p) => p.slug === item.playlist);
    if (playlist) score += scoreAgainst(seed, playlist);
    if (item.relatedArticles?.includes(seedSlug || '')) score += 5;
    if (playlist?.relatedArticles?.includes(seedSlug || '')) score += 4;
    return score;
  }, limitPerType)) {
    groups.videos.push({ href: `/video/${video.slug}`, title: locTitle(video), kind: 'video', slug: video.slug });
  }

  for (const playlist of pickScored(seedSlug, catalogs.playlists ?? [], (item) => {
    let score = scoreAgainst(seed, item);
    if (item.relatedArticles?.includes(seedSlug || '')) score += 5;
    return score;
  }, Math.min(2, limitPerType))) {
    groups.playlists.push({
      href: `/videos/${playlist.slug}`,
      title: locTitle(playlist),
      kind: 'playlist',
      slug: playlist.slug,
    });
  }

  for (const alternative of pickScored(seedSlug, catalogs.alternatives ?? [], (item) => scoreAgainst(seed, item), limitPerType)) {
    groups.alternatives.push({
      href: `/alternatives/${alternative.slug}`,
      title: locTitle(alternative),
      kind: 'alternative',
      slug: alternative.slug,
    });
  }

  const seedTopics = inferTopicIds(seed);
  const seedBlob = [seed.slug, ...(seed.tags ?? []), ...(seedTopics), seed.categoryId, seed.subcategoryId]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const toolScores = (catalogs.tools ?? [])
    .map((tool) => {
      const tokens = `${tool.anchor} ${tool.title.en} ${tool.title.ar}`.toLowerCase();
      let score = 0;
      for (const id of seedTopics) {
        if (tokens.includes(id.replace(/-/g, ' ')) || tokens.includes(id)) score += 4;
      }
      if (/lockout|4740|active.directory/.test(seedBlob) && /lockout|ad-/.test(tokens)) score += 6;
      if (/subnet|cidr|vlsm|vlan/.test(seedBlob) && /subnet|cidr|vlsm/.test(tokens)) score += 6;
      if (/dns|nslookup|dig/.test(seedBlob) && /dns/.test(tokens)) score += 6;
      if (/port|tcp|udp|firewall/.test(seedBlob) && /port/.test(tokens)) score += 5;
      if (/tls|certificate|pki|openssl/.test(seedBlob) && /certificate|tls|csr/.test(tokens)) score += 6;
      if (/email|phishing|header|spf|dmarc/.test(seedBlob) && /email|header/.test(tokens)) score += 6;
      if (/wifi|wireless/.test(seedBlob) && /wi-fi|wifi/.test(tokens)) score += 5;
      if (/network|troubleshoot|ping|traceroute/.test(seedBlob) && /troubleshoot|ping|traceroute/.test(tokens)) score += 3;
      return { tool, score };
    })
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score || a.tool.anchor.localeCompare(b.tool.anchor));

  for (const entry of toolScores.slice(0, Math.min(2, limitPerType))) {
    groups.tools.push({
      href: `/tools#${entry.tool.anchor}`,
      title: entry.tool.title,
      kind: 'tool',
      slug: entry.tool.anchor,
    });
  }

  for (const id of seedTopics.slice(0, 3)) {
    const def = TOPICS_BY_ID[id];
    if (!def) continue;
    groups.topics.push({
      href: `/topic/${def.id}`,
      title: { ar: def.label.ar, en: def.label.en },
      kind: 'topic',
      slug: def.id,
    });
  }

  const seedVendors = vendorsOf(seed);
  for (const vendor of catalogs.vendors ?? []) {
    const id = vendor.id.toLowerCase();
    const label = `${vendor.label.en} ${vendor.label.ar}`.toLowerCase();
    const hit =
      seedVendors.has(id) ||
      [...seedVendors].some((v) => v.includes(id) || id.includes(v)) ||
      (seedBlob && (seedBlob.includes(id) || seedBlob.includes(label.split(' ')[0]!)));
    // Prefer explicit vendor ids / product names over loose first-token matches.
    const explicit =
      seedVendors.has(id) ||
      `${seed.slug ?? ''} ${seed.product ?? ''} ${seed.vendor ?? ''} ${(seed as { device1Name?: string }).device1Name ?? ''} ${(seed as { device2Name?: string }).device2Name ?? ''}`
        .toLowerCase()
        .includes(id.replace(/-/g, ' ')) ||
      `${seed.slug ?? ''}`.includes(id);
    if (!explicit && !hit) continue;
    if (!explicit) continue;
    groups.vendors.push({
      href: `/vendors/${vendor.id}`,
      title: { ar: vendor.label.ar, en: vendor.label.en },
      kind: 'vendor',
      slug: vendor.id,
    });
    if (groups.vendors.length >= 3) break;
  }

  return groups;
}

export function relatedGroupsAreEmpty(groups: RelatedGroups): boolean {
  return Object.values(groups).every((list) => list.length === 0);
}

/** Previous and next items in a stable list, wrapping so endpoints still get two neighbours when the list has 3+ items. */
export function getAdjacentLoop<T extends { slug: string }>(
  item: T,
  all: readonly T[],
): { previous: T | null; next: T | null } {
  if (all.length < 2) return { previous: null, next: null };
  const index = all.findIndex((row) => row.slug === item.slug);
  if (index < 0) return { previous: null, next: null };
  const previous = all[(index - 1 + all.length) % all.length];
  const next = all[(index + 1) % all.length];
  if (previous.slug === item.slug) return { previous: null, next: null };
  return { previous, next: next.slug === item.slug ? null : next };
}

export function emptyRelatedGroups(): RelatedGroups {
  return { ...EMPTY_GROUPS, articles: [], videos: [], playlists: [], comparisons: [], alternatives: [], tools: [], topics: [], vendors: [] };
}
