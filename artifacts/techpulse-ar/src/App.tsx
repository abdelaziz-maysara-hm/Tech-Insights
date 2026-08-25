import { lazy, Suspense, useEffect } from 'react';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useSEO } from '@/hooks/useSEO';
import { useLocalizedLocation } from '@/hooks/useLocalizedLocation';
import { getLegacyRedirectTarget } from '@/lib/legacyRedirect';

const Home = lazy(() => import('@/pages/Home'));
const Articles = lazy(() => import('@/pages/Articles'));
const ArticleDetail = lazy(() => import('@/pages/ArticleDetail'));
const Comparisons = lazy(() => import('@/pages/Comparisons'));
const ComparisonDetail = lazy(() => import('@/pages/ComparisonDetail'));
const Videos = lazy(() => import('@/pages/Videos'));
const Categories = lazy(() => import('@/pages/Categories'));
const Search = lazy(() => import('@/pages/Search'));
const PageDetail = lazy(() => import('@/pages/PageDetail'));
const Troubleshooting = lazy(() => import('@/pages/Troubleshooting'));
const Guides = lazy(() => import('@/pages/Guides'));
const Tools = lazy(() => import('@/pages/Tools'));
const ToolDetail = lazy(() => import('@/pages/ToolDetail'));
const VendorDetail = lazy(() => import('@/pages/VendorDetail'));
const Vendors = lazy(() => import('@/pages/Vendors'));
const DomainPage = lazy(() => import('@/pages/Domain'));
const NotFound = lazy(() => import('@/pages/not-found'));

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

function ScrollToTop() {
  const [pathname] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
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
      <GlobalSEO />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/articles" component={Articles} />
            <Route path="/article/:slug" component={ArticleDetail} />
            <Route path="/comparisons" component={Comparisons} />
            <Route path="/comparison/:slug" component={ComparisonDetail} />
            <Route path="/videos" component={Videos} />
            <Route path="/categories" component={Categories} />
            <Route path="/search" component={Search} />
            <Route path="/page/:slug" component={PageDetail} />
            <Route path="/troubleshooting" component={Troubleshooting} />
            <Route path="/guides" component={Guides} />
            <Route path="/tools/:slug" component={ToolDetail} />
            <Route path="/tools" component={Tools} />
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

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <LanguageProvider>
        <LegacyRouteRedirect />
        <WouterRouter
          base={import.meta.env.BASE_URL.replace(/\/$/, '')}
          hook={useLocalizedLocation}
        >
          <Router />
        </WouterRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
