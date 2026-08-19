import { useEffect } from 'react';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Home from '@/pages/Home';
import Articles from '@/pages/Articles';
import ArticleDetail from '@/pages/ArticleDetail';
import Comparisons from '@/pages/Comparisons';
import ComparisonDetail from '@/pages/ComparisonDetail';
import Videos from '@/pages/Videos';
import Categories from '@/pages/Categories';
import Search from '@/pages/Search';
import PageDetail from '@/pages/PageDetail';
import Troubleshooting from '@/pages/Troubleshooting';
import Guides from '@/pages/Guides';
import Tools from '@/pages/Tools';
import Vendors from '@/pages/Vendors';
import VendorDetail from '@/pages/VendorDetail';
import DomainPage from '@/pages/Domain';
import NotFound from '@/pages/not-found';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useSEO } from '@/hooks/useSEO';
import { useLocalizedLocation } from '@/hooks/useLocalizedLocation';
import { getLegacyRedirectTarget } from '@/lib/legacyRedirect';

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
          <Route path="/tools" component={Tools} />
          <Route path="/vendors/:vendor" component={VendorDetail} />
          <Route path="/vendors" component={Vendors} />
          <Route path="/domain/:domain" component={DomainPage} />
          <Route component={NotFound} />
        </Switch>
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
