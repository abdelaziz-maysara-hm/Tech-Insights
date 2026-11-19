import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root")!;

/**
 * Pages are prerendered at build time with crawlable static HTML inside
 * #root (scripts/seo-static-content.mjs). Keep that content on screen while
 * React loads the route (lazy chunks, article bodies) and swap only once the
 * app's <main> has real content, so visitors never see a blank flash.
 */
function keepPrerenderUntilAppIsReady(root: HTMLElement) {
  const prerendered = root.querySelector<HTMLElement>("[data-prerendered]");
  if (!prerendered) return;
  const holder = document.createElement("div");
  holder.id = "prerender-holder";
  root.parentNode?.insertBefore(holder, root);
  holder.appendChild(prerendered);
  root.style.display = "none";

  let done = false;
  const reveal = () => {
    if (done) return;
    done = true;
    observer.disconnect();
    window.clearTimeout(fallback);
    root.style.display = "";
    holder.remove();
  };
  const isReady = () => {
    const main = root.querySelector("main");
    if (!main || main.querySelector('[aria-busy="true"]')) return false;
    return (main.textContent ?? "").trim().length > 80;
  };
  const observer = new MutationObserver(() => {
    if (isReady()) reveal();
  });
  observer.observe(root, { childList: true, subtree: true, characterData: true });
  // Never hold the interactive app back for long (slow networks, short pages).
  const fallback = window.setTimeout(reveal, 6000);
}

keepPrerenderUntilAppIsReady(container);
createRoot(container).render(<App />);
