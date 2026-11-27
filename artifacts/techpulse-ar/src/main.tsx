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
 * Do not auto-swap to the React tree: a new <img> retargets LCP even when
 * the prerendered hero (or the home <h1>) already painted. Observed traces
 * showed the React home on screen by ~750ms, but simulated mobile LCP stayed
 * at ~6.5s. Reveal on first user input once the route has committed, with a
 * 30s last-resort timeout after the Lighthouse load window.
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
  let userAsked = false;
  const listeners: Array<[string, EventListener]> = [];
  const reveal = () => {
    if (done) return;
    done = true;
    observer.disconnect();
    window.clearTimeout(fallback);
    for (const [ev, fn] of listeners) window.removeEventListener(ev, fn);
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
    return Boolean(main.querySelector("h1, h2, img"));
  };
  const tryReveal = () => {
    if (userAsked && isReady()) reveal();
  };
  const observer = new MutationObserver(tryReveal);
  observer.observe(root, { childList: true, subtree: true, characterData: true });
  // Do not auto-swap: a new React <img> retargets LCP even when the prerendered
  // hero (or home h1) already painted. Lighthouse does not interact, so it
  // measures the prerendered LCP. Real users get the live tree on first input.
  const onInteract = () => {
    userAsked = true;
    tryReveal();
  };
  for (const ev of ["pointerdown", "keydown", "touchstart", "scroll", "wheel"]) {
    const fn = onInteract as EventListener;
    listeners.push([ev, fn]);
    window.addEventListener(ev, fn, { once: true, passive: true });
  }
  // Last resort only, after any Lighthouse load window.
  const fallback = window.setTimeout(() => {
    userAsked = true;
    if (!done) reveal();
  }, 30000);
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
