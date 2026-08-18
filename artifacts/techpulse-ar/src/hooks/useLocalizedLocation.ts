import type { BaseLocationHook, RouterObject } from 'wouter';
import { navigate, useBrowserLocation } from 'wouter/use-browser-location';
import {
  detectLanguageFromPath,
  localizePath,
  stripLanguagePrefix,
} from '@/lib/localizedRouting';

const useLocalizedLocation: BaseLocationHook = (router: RouterObject) => {
  const [browserPath] = useBrowserLocation(router);
  const language = detectLanguageFromPath(browserPath, router.base);
  const routePath = stripLanguagePrefix(browserPath, router.base);

  return [
    routePath,
    (to: string, options?: Parameters<typeof navigate>[1]) => {
      navigate(language ? localizePath(to, language, router.base) : to, options);
    },
  ];
};

useLocalizedLocation.hrefs = (href, router?: RouterObject) => {
  if (typeof window === 'undefined') return href;
  const language = detectLanguageFromPath(window.location.pathname, router?.base);
  return language ? localizePath(href, language, router?.base) : href;
};

export { useLocalizedLocation };
