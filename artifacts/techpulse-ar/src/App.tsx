import { Suspense, useEffect } from 'react';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LanguageProvider, type Language } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useSEO } from '@/hooks/useSEO';
import { useLocalizedLocation } from '@/hooks/useLocalizedLocation';
import { getLegacyRedirectTarget } from '@/lib/legacyRedirect';
import { getContentRedirectTarget } from '@/lib/contentRedirects';
import {
  Alternatives,
  AlternativeDetail,
  ArticleDetail,
  Articles,
  Categories,
  ComparisonDetail,
  Comparisons,
  DomainPage,
  Guides,
  Home,
  NotFound,
  PageDetail,
  Search,
  Tools,
  Troubleshooting,
  VendorDetail,
  Vendors,
  VideoDetail,
  VideoPlaylist,
  Videos,
} from '@/routeTable';

export type AppSsrProps = {
  ssrPath?: string;
  ssrSearch?: string;
  language?: Language;
};

function RouteFallback() {
  return (
    <div
      className="container mx-auto px-4 py-16 min-h-[40vh]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="h-8 w-48 max-w-full rounded bg-muted animate-pulse mb-6" />
      <div className="h-4 w-full max-w-2xl rounded bg-muted/70 animate-pulse mb-3" />
      <div className="h-4 w-full max-w-xl rounded bg-muted/50 animate-pulse" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

function LegacyRouteRedirect() {
  useEffect(() => {
    const currentLocation = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const target = getLegacyRedirectTarget(currentLocation, import.meta.env.BASE_URL);

    if (target && target !== currentLocation) {
      window.location.replace(target);
    }
  }, []);

  return null;
}

/** Removed/merged content: forward to its replacement (static stubs do the same without JS). */
function ContentRedirect() {
  const [pathname] = useLocation();
  useEffect(() => {
    const target = getContentRedirectTarget(pathname);
    if (!target) return;
    const lang = window.location.pathname.match(/^\/(ar|en)(\/|$)/)?.[1] ?? 'ar';
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    window.location.replace(`${base}/${lang}${target}`);
  }, [pathname]);
  return null;
}

function ScrollToTop() {
  const [pathname] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Sends a GA4 page_view on every client-side route change. No-op unless the
 * build injected gtag (VITE_GA_MEASUREMENT_ID, see vite.config.ts).
 */
function AnalyticsPageViews() {
  const [pathname] = useLocation();
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    // Let route-level useSEO() update document.title first.
    const timer = window.setTimeout(() => {
      window.gtag?.('event', 'page_view', {
        page_location: window.location.href,
        page_path: window.location.pathname,
        page_title: document.title,
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);
  return null;
}

function GlobalSEO() {
  useSEO();
  return null;
}

function Router() {
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <ScrollToTop />
      <ContentRedirect />
      <GlobalSEO />
      <AnalyticsPageViews />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content / تخطَّ إلى المحتوى
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense fallback={<RouteFallback />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/articles" component={Articles} />
            <Route path="/article/:slug" component={ArticleDetail} />
            <Route path="/comparisons" component={Comparisons} />
            <Route path="/comparison/:slug" component={ComparisonDetail} />
            <Route path="/videos" component={Videos} />
            <Route path="/videos/:playlist" component={VideoPlaylist} />
            <Route path="/video/:slug" component={VideoDetail} />
            <Route path="/categories" component={Categories} />
            <Route path="/search" component={Search} />
            <Route path="/page/:slug" component={PageDetail} />
            <Route path="/troubleshooting" component={Troubleshooting} />
            <Route path="/guides" component={Guides} />
            <Route path="/tools" component={Tools} />
            <Route path="/alternatives" component={Alternatives} />
            <Route path="/alternatives/:slug" component={AlternativeDetail} />
            <Route path="/vendors/:vendor" component={VendorDetail} />
            <Route path="/vendors" component={Vendors} />
            <Route path="/domain/:domain" component={DomainPage} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function App({ ssrPath, ssrSearch, language }: AppSsrProps = {}) {
  return (
    <ThemeProvider defaultTheme="dark">
      <LanguageProvider initialLanguage={language}>
        <LegacyRouteRedirect />
        <WouterRouter
          base={import.meta.env.BASE_URL.replace(/\/$/, '')}
          hook={useLocalizedLocation}
          ssrPath={ssrPath}
          ssrSearch={ssrSearch}
        >
          <Router />
        </WouterRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
