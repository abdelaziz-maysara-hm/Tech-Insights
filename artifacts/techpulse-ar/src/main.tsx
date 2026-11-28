import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { scheduleAdSense } from "@/lib/adsense";
import { preloadRoute } from "@/routeTable";

const container = document.getElementById("root")!;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

/**
 * The prerender writes a real renderToString(<App />) tree into #root and
 * marks it data-hydrate="app". We preload the matching lazy route (and any
 * below-the-fold companion) so Suspense does not flash a fallback, then
 * hydrateRoot the same markup. Dev / empty shells still use createRoot.
 */
async function boot() {
  const shouldHydrate = container.getAttribute("data-hydrate") === "app";
  if (shouldHydrate) {
    await preloadRoute(window.location.pathname, basePath);
    hydrateRoot(container, <App />);
  } else {
    createRoot(container).render(<App />);
  }
  scheduleAdSense();
}

void boot();
