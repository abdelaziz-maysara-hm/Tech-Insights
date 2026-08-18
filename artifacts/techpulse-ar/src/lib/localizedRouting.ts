export const SUPPORTED_LANGUAGES = ['ar', 'en'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

type PathParts = {
  pathname: string;
  suffix: string;
};

function splitPath(value: string): PathParts {
  const queryIndex = value.indexOf('?');
  const hashIndex = value.indexOf('#');
  const suffixIndex = [queryIndex, hashIndex]
    .filter((index) => index >= 0)
    .reduce((first, index) => Math.min(first, index), value.length);

  const rawPathname = value.slice(0, suffixIndex) || '/';
  return {
    pathname: rawPathname.startsWith('/') ? rawPathname : `/${rawPathname}`,
    suffix: value.slice(suffixIndex),
  };
}

export function normalizeBasePath(basePath = ''): string {
  if (!basePath || basePath === '/') return '';
  return `/${basePath.replace(/^\/+|\/+$/g, '')}`;
}

export function removeBasePath(pathname: string, basePath = ''): string {
  const base = normalizeBasePath(basePath);
  if (!base) return pathname || '/';
  if (pathname === base) return '/';
  return pathname.startsWith(`${base}/`) ? pathname.slice(base.length) : pathname;
}

export function detectLanguageFromPath(
  value: string,
  basePath = '',
): SupportedLanguage | null {
  const { pathname } = splitPath(value);
  const relativePath = removeBasePath(pathname, basePath);
  const firstSegment = relativePath.split('/').filter(Boolean)[0];
  return SUPPORTED_LANGUAGES.find((language) => language === firstSegment) ?? null;
}

export function stripLanguagePrefix(value: string, basePath = ''): string {
  const { pathname, suffix } = splitPath(value);
  const base = normalizeBasePath(basePath);
  const relativePath = removeBasePath(pathname, base);
  const language = detectLanguageFromPath(relativePath);

  if (!language) return `${pathname}${suffix}`;

  const stripped = relativePath.replace(new RegExp(`^/${language}(?=/|$)`), '') || '/';
  return `${base}${stripped === '/' ? '/' : stripped}${suffix}` || '/';
}

export function localizePath(
  value: string,
  language: SupportedLanguage,
  basePath = '',
): string {
  const { pathname, suffix } = splitPath(value);
  const base = normalizeBasePath(basePath);
  const withoutBase = removeBasePath(pathname, base);
  const withoutLanguage = stripLanguagePrefix(withoutBase);
  const routePath = splitPath(withoutLanguage).pathname;
  const localizedPath = routePath === '/' ? `/${language}/` : `/${language}${routePath}`;
  return `${base}${localizedPath}${suffix}`;
}

export function getEquivalentLocalizedPath(
  value: string,
  language: SupportedLanguage,
  basePath = '',
): string {
  return localizePath(value, language, basePath);
}
