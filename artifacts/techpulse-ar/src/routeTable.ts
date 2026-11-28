import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { stripLanguagePrefix } from '@/lib/localizedRouting';

type Loader = () => Promise<{ default: ComponentType<any> }>;

const loaders = {
  Home: () => import('@/pages/Home'),
  Articles: () => import('@/pages/Articles'),
  ArticleDetail: () => import('@/pages/ArticleDetail'),
  Comparisons: () => import('@/pages/Comparisons'),
  ComparisonDetail: () => import('@/pages/ComparisonDetail'),
  Videos: () => import('@/pages/Videos'),
  VideoPlaylist: () => import('@/pages/VideoPlaylist'),
  VideoDetail: () => import('@/pages/VideoDetail'),
  Categories: () => import('@/pages/Categories'),
  Search: () => import('@/pages/Search'),
  PageDetail: () => import('@/pages/PageDetail'),
  Troubleshooting: () => import('@/pages/Troubleshooting'),
  Guides: () => import('@/pages/Guides'),
  Tools: () => import('@/pages/Tools'),
  Alternatives: () => import('@/pages/Alternatives'),
  AlternativeDetail: () => import('@/pages/AlternativeDetail'),
  VendorDetail: () => import('@/pages/VendorDetail'),
  Vendors: () => import('@/pages/Vendors'),
  DomainPage: () => import('@/pages/Domain'),
  NotFound: () => import('@/pages/not-found'),
  HomeComparisons: () => import('@/components/HomeComparisons'),
  ArticleBelowFold: () => import('@/components/ArticleBelowFold'),
} satisfies Record<string, Loader>;

export const Home = lazy(loaders.Home) as LazyExoticComponent<ComponentType>;
export const Articles = lazy(loaders.Articles) as LazyExoticComponent<ComponentType>;
export const ArticleDetail = lazy(loaders.ArticleDetail) as LazyExoticComponent<ComponentType>;
export const Comparisons = lazy(loaders.Comparisons) as LazyExoticComponent<ComponentType>;
export const ComparisonDetail = lazy(loaders.ComparisonDetail) as LazyExoticComponent<ComponentType>;
export const Videos = lazy(loaders.Videos) as LazyExoticComponent<ComponentType>;
export const VideoPlaylist = lazy(loaders.VideoPlaylist) as LazyExoticComponent<ComponentType>;
export const VideoDetail = lazy(loaders.VideoDetail) as LazyExoticComponent<ComponentType>;
export const Categories = lazy(loaders.Categories) as LazyExoticComponent<ComponentType>;
export const Search = lazy(loaders.Search) as LazyExoticComponent<ComponentType>;
export const PageDetail = lazy(loaders.PageDetail) as LazyExoticComponent<ComponentType>;
export const Troubleshooting = lazy(loaders.Troubleshooting) as LazyExoticComponent<ComponentType>;
export const Guides = lazy(loaders.Guides) as LazyExoticComponent<ComponentType>;
export const Tools = lazy(loaders.Tools) as LazyExoticComponent<ComponentType>;
export const Alternatives = lazy(loaders.Alternatives) as LazyExoticComponent<ComponentType>;
export const AlternativeDetail = lazy(loaders.AlternativeDetail) as LazyExoticComponent<ComponentType>;
export const VendorDetail = lazy(loaders.VendorDetail) as LazyExoticComponent<ComponentType>;
export const Vendors = lazy(loaders.Vendors) as LazyExoticComponent<ComponentType>;
export const DomainPage = lazy(loaders.DomainPage) as LazyExoticComponent<ComponentType>;
export const NotFound = lazy(loaders.NotFound) as LazyExoticComponent<ComponentType>;

const exact: Record<string, Loader[]> = {
  '/': [loaders.Home, loaders.HomeComparisons],
  '/articles': [loaders.Articles],
  '/comparisons': [loaders.Comparisons],
  '/videos': [loaders.Videos],
  '/categories': [loaders.Categories],
  '/search': [loaders.Search],
  '/troubleshooting': [loaders.Troubleshooting],
  '/guides': [loaders.Guides],
  '/tools': [loaders.Tools],
  '/alternatives': [loaders.Alternatives],
  '/vendors': [loaders.Vendors],
};

const patterned: Array<{ test: (id: string) => boolean; load: Loader[] }> = [
  { test: (id) => /^\/article\/[^/]+$/.test(id), load: [loaders.ArticleDetail, loaders.ArticleBelowFold] },
  { test: (id) => /^\/comparison\/[^/]+$/.test(id), load: [loaders.ComparisonDetail] },
  { test: (id) => /^\/videos\/[^/]+$/.test(id), load: [loaders.VideoPlaylist] },
  { test: (id) => /^\/video\/[^/]+$/.test(id), load: [loaders.VideoDetail] },
  { test: (id) => /^\/page\/[^/]+$/.test(id), load: [loaders.PageDetail] },
  { test: (id) => /^\/tools\/[^/]+$/.test(id), load: [loaders.Tools] },
  { test: (id) => /^\/alternatives\/[^/]+$/.test(id), load: [loaders.AlternativeDetail] },
  { test: (id) => /^\/vendors\/[^/]+$/.test(id), load: [loaders.VendorDetail] },
  { test: (id) => /^\/domain\/[^/]+$/.test(id), load: [loaders.DomainPage] },
];

/** Preload the lazy route module (and below-the-fold companions) so hydrateRoot
 *  does not paint a Suspense fallback that would mismatch the prerendered tree. */
export function preloadRoute(pathname: string, basePath: string): Promise<unknown[]> {
  const identity = stripLanguagePrefix(pathname, basePath) || '/';
  const found = exact[identity] ?? patterned.find((p) => p.test(identity))?.load ?? [loaders.NotFound];
  return Promise.all(found.map((load) => load()));
}

/** Used by the SSR entry so onAllReady does not have to discover every page. */
export function preloadAllRoutes(): Promise<unknown[]> {
  return Promise.all(Object.values(loaders).map((load) => load()));
}
