import {
  detectLanguageFromPath,
  localizePath,
  removeBasePath,
} from './localizedRouting.ts';

const LEGACY_STATIC_ROUTES = new Set([
  '/',
  '/articles',
  '/comparisons',
  '/videos',
  '/categories',
  '/search',
  '/troubleshooting',
  '/guides',
  '/tools',
  '/vendors',
]);

const LEGACY_DYNAMIC_ROUTES = [
  /^\/article\/[^/]+\/?$/,
  /^\/comparison\/[^/]+\/?$/,
  /^\/page\/[^/]+\/?$/,
  /^\/vendors\/[^/]+\/?$/,
  /^\/domain\/[^/]+\/?$/,
];

function normalizeLegacyPath(pathname: string, basePath = ''): string {
  const withoutBase = removeBasePath(pathname || '/', basePath);
  if (withoutBase === '/') return '/';
  return withoutBase.replace(/\/+$/, '') || '/';
}

export function isSupportedLegacyRoute(pathname: string, basePath = ''): boolean {
  const normalized = normalizeLegacyPath(pathname, basePath);
  return (
    LEGACY_STATIC_ROUTES.has(normalized) ||
    LEGACY_DYNAMIC_ROUTES.some((pattern) => pattern.test(normalized))
  );
}

export function getLegacyRedirectTarget(
  value: string,
  basePath = '',
): string | null {
  if (detectLanguageFromPath(value, basePath)) return null;

  const pathname = value.split(/[?#]/, 1)[0] || '/';
  if (!isSupportedLegacyRoute(pathname, basePath)) return null;

  return localizePath(value, 'ar', basePath);
}
