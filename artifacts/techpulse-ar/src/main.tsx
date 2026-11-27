import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { scheduleAdSense } from "@/lib/adsense";

const container = document.getElementById("root")!;

/**
 * The build-time bodies in #root (scripts/seo-static-content.mjs) are a
 * simplified, crawlable tree — not a render of <App /> — so we cannot
 * hydrateRoot them without a markup mismatch. When the prerender *is* a
 * matching App render (data-hydrate="app"), we hydrate. Otherwise we keep
 * the static HTML on screen in-flow and paint React in an absolutely
 * positioned layer, then swap in one frame without collapsing the document
 * with display:none (that was a major CLS source).
 *
 * Swap as soon as the lazy route has committed: a 6s fallback was showing
 * up as 4–5s of LCP render delay, because Lighthouse then attributed LCP
 * to the new <img> at swap time.
 */
function keepPrerenderUntilAppIsReady(root: HTMLElement) {
  const prerendered = root.querySelector<HTMLElement>("[data-prerendered]");
  if (!prerendered) return;
  if (root.getAttribute("data-hydrate") === "app") return;

  const holder = document.createElement("div");
  holder.id = "prerender-holder";
  root.parentNode?.insertBefore(holder, root);
  holder.appendChild(prerendered);

  const reserved = holder.offsetHeight;
  root.style.position = "absolute";
  root.style.left = "0";
  root.style.right = "0";
  root.style.top = `${holder.offsetTop}px`;
  root.style.visibility = "hidden";
  root.style.pointerEvents = "none";
  root.setAttribute("aria-hidden", "true");

  let done = false;
  const reveal = () => {
    if (done) return;
    done = true;
    observer.disconnect();
    window.clearTimeout(fallback);
    holder.remove();
    root.style.position = "";
    root.style.left = "";
    root.style.right = "";
    root.style.top = "";
    root.style.visibility = "";
    root.style.pointerEvents = "";
    root.removeAttribute("aria-hidden");
    if (reserved > 0) {
      root.style.minHeight = `${reserved}px`;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          root.style.minHeight = "";
        });
      });
    }
  };
  const isReady = () => {
    const main = root.querySelector("main");
    if (!main || main.querySelector('[aria-busy="true"]')) return false;
    // Do not reveal a loading skeleton — that would tear down the prerendered
    // LCP image before the route has painted its own hero.
    return Boolean(main.querySelector("h1, h2, img"));
  };
  const observer = new MutationObserver(() => {
    if (isReady()) reveal();
  });
  observer.observe(root, { childList: true, subtree: true, characterData: true });
  if (isReady()) reveal();
  // Last resort only. An early timeout used to reveal the Suspense fallback
  // and retarget LCP to a hero that appeared several seconds later.
  const fallback = window.setTimeout(reveal, 8000);
}

function mount(root: HTMLElement) {
  if (root.getAttribute("data-hydrate") === "app") {
    hydrateRoot(root, <App />);
    return;
  }
  keepPrerenderUntilAppIsReady(root);
  createRoot(root).render(<App />);
}

mount(container);
scheduleAdSense();
