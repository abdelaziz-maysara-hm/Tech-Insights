/**
 * Post-Vite GitHub Pages helper:
 * materialize every production sitemap path as <route>/index.html
 * so direct navigation returns HTTP 200 instead of a document-level 404.
 *
 * Source of truth: generated sitemap (no hard-coded route registry).
 * Shell: dist/public/index.html (SPA shell — not full SSR/prerender).
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PRODUCTION_ORIGIN = 'https://netsecatlas.com';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const defaultDistPublic = join(root, 'dist', 'public');
const defaultSitemapCandidates = [
  join(defaultDistPublic, 'sitemap.xml'),
  join(root, 'public', 'sitemap.xml'),
];

/**
 * @param {string} xml
 * @returns {string[]}
 */
export function extractLocUrls(xml) {
  const matches = [...String(xml).matchAll(/<loc>\s*([^<\s][^<]*)\s*<\/loc>/gi)];
  return matches.map((m) => m[1].trim());
}

/**
 * Accept only production-origin absolute URLs. Returns pathname or null.
 * Rejects path traversal before WHATWG URL normalization can collapse it.
 * @param {string} urlString
 * @param {string} [origin]
 * @returns {string | null}
 */
export function pathnameFromProductionUrl(urlString, origin = PRODUCTION_ORIGIN) {
  if (typeof urlString !== 'string' || !urlString.trim()) return null;

  let parsed;
  try {
    parsed = new URL(urlString);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
  const expected = new URL(origin);
  if (parsed.hostname !== expected.hostname) return null;

  // Raw path before WHATWG normalization (avoids /ar/../x → /x).
  const pathMatch = String(urlString).match(/^[a-z][a-z0-9+.-]*:\/\/[^/]+(\/[^?#]*)?/i);
  const rawPath = pathMatch && pathMatch[1] != null ? pathMatch[1] : '/';
  if (/(^|\/)(?:\.|%2e){1,2}(?=\/|$)/i.test(rawPath)) {
    return null;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(rawPath);
  } catch {
    return null;
  }
  if (pathname.includes('\0')) return null;
  if (pathname.split('/').some((segment) => segment === '.' || segment === '..')) {
    return null;
  }
  return pathname || '/';
}

/**
 * Normalize a URL pathname into relative directory segments under dist/public.
 * Root "/" → "" (keep existing dist/public/index.html).
 * @param {string} pathname
 * @returns {{ ok: true, relativeDir: string } | { ok: false, reason: string }}
 */
export function routeDirFromPathname(pathname) {
  if (typeof pathname !== 'string' || pathname.length === 0) {
    return { ok: false, reason: 'empty-pathname' };
  }
  if (!pathname.startsWith('/')) {
    return { ok: false, reason: 'not-absolute' };
  }

  let cleaned = pathname.replace(/\/+/g, '/');
  if (cleaned.length > 1 && cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1);
  }
  if (cleaned === '/') {
    return { ok: true, relativeDir: '' };
  }

  const segments = cleaned.slice(1).split('/');
  const normalizedSegments = [];
  for (const segment of segments) {
    let decoded = segment;
    try {
      decoded = decodeURIComponent(segment);
    } catch {
      return { ok: false, reason: 'invalid-segment-encoding' };
    }
    if (!decoded || decoded === '.' || decoded === '..') {
      return { ok: false, reason: 'path-traversal-or-empty-segment' };
    }
    if (decoded.includes('\\') || decoded.includes('\0') || decoded.includes('/')) {
      return { ok: false, reason: 'invalid-segment' };
    }
    normalizedSegments.push(decoded);
  }
  return { ok: true, relativeDir: normalizedSegments.join('/') };
}

/**
 * Resolve output index.html path under distPublic; never escapes that root.
 * @param {string} distPublic
 * @param {string} relativeDir
 * @returns {string | null}
 */
export function resolveRouteIndexPath(distPublic, relativeDir) {
  const base = resolve(distPublic);
  const targetDir = relativeDir ? resolve(base, ...relativeDir.split('/')) : base;
  const relativeToBase = relative(base, targetDir);
  if (relativeToBase.startsWith('..') || relativeToBase.split(sep).includes('..')) {
    return null;
  }
  const indexPath = resolve(targetDir, 'index.html');
  const relIndex = relative(base, indexPath);
  if (relIndex.startsWith('..') || relIndex.split(sep).includes('..')) {
    return null;
  }
  return indexPath;
}

/**
 * @typedef {{
 *   sitemapUrls: number,
 *   uniquePathnames: number,
 *   written: number,
 *   skippedRoot: number,
 *   skippedDuplicate: number,
 *   rejected: { url: string, reason: string }[],
 *   routes: string[],
 * }} GenerateResult
 */

/**
 * @param {object} options
 * @param {string} options.distPublic
 * @param {string} options.sitemapXml
 * @param {string} [options.origin]
 * @param {boolean} [options.dryRun]
 * @returns {GenerateResult}
 */
export function generateStaticRouteFallbacks({
  distPublic,
  sitemapXml,
  origin = PRODUCTION_ORIGIN,
  dryRun = false,
}) {
  const shellPath = join(distPublic, 'index.html');
  if (!dryRun && !existsSync(shellPath)) {
    throw new Error(`SPA shell missing: ${shellPath}`);
  }

  const urls = extractLocUrls(sitemapXml);
  /** @type {GenerateResult} */
  const result = {
    sitemapUrls: urls.length,
    uniquePathnames: 0,
    written: 0,
    skippedRoot: 0,
    skippedDuplicate: 0,
    rejected: [],
    routes: [],
  };

  const seenDirs = new Set();

  for (const url of urls) {
    const pathname = pathnameFromProductionUrl(url, origin);
    if (pathname == null) {
      result.rejected.push({ url, reason: 'foreign-or-invalid-url' });
      continue;
    }
    const dirResult = routeDirFromPathname(pathname);
    if (!dirResult.ok) {
      result.rejected.push({ url, reason: dirResult.reason });
      continue;
    }
    const { relativeDir } = dirResult;
    if (relativeDir === '') {
      result.skippedRoot += 1;
      continue;
    }
    if (seenDirs.has(relativeDir)) {
      result.skippedDuplicate += 1;
      continue;
    }
    seenDirs.add(relativeDir);

    const outPath = resolveRouteIndexPath(distPublic, relativeDir);
    if (!outPath) {
      result.rejected.push({ url, reason: 'path-escape' });
      continue;
    }

    result.routes.push(relativeDir);
    if (!dryRun) {
      mkdirSync(dirname(outPath), { recursive: true });
      copyFileSync(shellPath, outPath);
    }
    result.written += 1;
  }

  result.uniquePathnames = seenDirs.size + (result.skippedRoot > 0 ? 1 : 0);
  return result;
}

function isMainModule() {
  const entry = process.argv[1] && resolve(process.argv[1]);
  return entry === fileURLToPath(import.meta.url);
}

function main() {
  const distPublic = defaultDistPublic;
  if (!existsSync(join(distPublic, 'index.html'))) {
    console.error('[static-routes] dist/public/index.html not found. Run vite build first.');
    process.exit(1);
  }

  const sitemapPath = defaultSitemapCandidates.find((candidate) => existsSync(candidate));
  if (!sitemapPath) {
    console.error('[static-routes] sitemap.xml not found under dist/public or public.');
    process.exit(1);
  }

  const xml = readFileSync(sitemapPath, 'utf8');
  const result = generateStaticRouteFallbacks({ distPublic, sitemapXml: xml });

  console.log(
    `[static-routes] sitemap=${result.sitemapUrls} written=${result.written} rootSkipped=${result.skippedRoot} dupSkipped=${result.skippedDuplicate} rejected=${result.rejected.length} (from ${relative(root, sitemapPath)})`,
  );
  if (result.rejected.length) {
    for (const item of result.rejected.slice(0, 8)) {
      console.warn(`[static-routes] rejected: ${item.reason} ← ${item.url}`);
    }
  }
}

if (isMainModule()) {
  main();
}
