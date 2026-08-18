import { SITE } from '../config/site.ts';
import { localizePath, stripLanguagePrefix } from './localizedRouting.ts';

export type TranslationStatus = 'unreviewed' | 'reviewed' | 'invalid';

export type HreflangAlternate = {
  hreflang: 'ar' | 'en' | 'x-default';
  href: string;
};

const REVIEWED_CONTENT_ROUTES: Readonly<Record<string, TranslationStatus>> = Object.freeze({});

const ELIGIBLE_DISCOVERY_ROUTES = new Set([
  '/',
  '/articles',
  '/comparisons',
  '/categories',
  '/troubleshooting',
  '/guides',
  '/tools',
  '/vendors',
]);

const ELIGIBLE_DISCOVERY_PATTERNS = [
  /^\/vendors\/[^/]+$/,
  /^\/domain\/[^/]+$/,
];

function pathnameOnly(value: string): string {
  const raw = /^https?:\/\//i.test(value) ? new URL(value).pathname : value;
  const end = [raw.indexOf('?'), raw.indexOf('#')]
    .filter((index) => index >= 0)
    .reduce((first, index) => Math.min(first, index), raw.length);
  return (raw.slice(0, end) || '/').replace(/\/+$/, '') || '/';
}
export function getCanonicalRouteIdentity(value: string, basePath = ''): string {
  const path = pathnameOnly(stripLanguagePrefix(pathnameOnly(value), basePath));
  return path || '/';
}

export function getTranslationStatus(routePath: string): TranslationStatus {
  return REVIEWED_CONTENT_ROUTES[getCanonicalRouteIdentity(routePath)] ?? 'unreviewed';
}

export function isDiscoveryRouteHreflangEligible(routePath: string): boolean {
  const route = getCanonicalRouteIdentity(routePath);
  return ELIGIBLE_DISCOVERY_ROUTES.has(route)
    || ELIGIBLE_DISCOVERY_PATTERNS.some((pattern) => pattern.test(route));
}

export function isHreflangEligible(
  routePath: string,
  translationStatus = getTranslationStatus(routePath),
): boolean {
  return isDiscoveryRouteHreflangEligible(routePath) || translationStatus === 'reviewed';
}

export function getHreflangAlternates(
  routePath: string,
  eligible: boolean,
): HreflangAlternate[] {
  if (!eligible) return [];
  const route = getCanonicalRouteIdentity(routePath);
  const ar = `${SITE.url}${localizePath(route, 'ar')}`;
  const en = `${SITE.url}${localizePath(route, 'en')}`;
  return [
    { hreflang: 'ar', href: ar },
    { hreflang: 'en', href: en },
    { hreflang: 'x-default', href: ar },
  ];
}

export function replaceHreflangLinks(alternates: readonly HreflangAlternate[]): void {
  document.head
    .querySelectorAll('link[data-netsecatlas-hreflang]')
    .forEach((element) => element.remove());

  for (const alternate of alternates) {
    const element = document.createElement('link');
    element.rel = 'alternate';
    element.hreflang = alternate.hreflang;
    element.href = alternate.href;
    element.dataset.netsecatlasHreflang = 'true';
    document.head.appendChild(element);
  }
}
