import { SITE } from '../config/site.ts';
import {
  detectLanguageFromPath,
  localizePath,
  removeBasePath,
  type SupportedLanguage,
} from './localizedRouting.ts';

export const LEGACY_CANONICAL_LANGUAGE: SupportedLanguage = 'ar';

function pathnameOnly(value: string): string {
  const suffixIndex = [value.indexOf('?'), value.indexOf('#')]
    .filter((index) => index >= 0)
    .reduce((first, index) => Math.min(first, index), value.length);
  const withoutSuffix = value.slice(0, suffixIndex) || '/';

  if (/^https?:\/\//i.test(withoutSuffix)) {
    return new URL(withoutSuffix).pathname;
  }

  return withoutSuffix.startsWith('/') ? withoutSuffix : `/${withoutSuffix}`;
}

export function getCanonicalLanguage(
  currentPath: string,
  basePath = '',
): SupportedLanguage {
  return detectLanguageFromPath(pathnameOnly(currentPath), basePath) ?? LEGACY_CANONICAL_LANGUAGE;
}

export function getLocalizedCanonicalPath(
  routePath: string,
  currentPath: string,
  basePath = '',
): string {
  const language = getCanonicalLanguage(currentPath, basePath);
  const routeWithoutDeploymentBase = removeBasePath(pathnameOnly(routePath), basePath);
  return localizePath(routeWithoutDeploymentBase, language);
}

export function getProductionCanonicalUrl(
  routePath: string,
  currentPath: string,
  basePath = '',
): string {
  return `${SITE.url}${getLocalizedCanonicalPath(routePath, currentPath, basePath)}`;
}
