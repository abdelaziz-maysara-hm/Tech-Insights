/**
 * Load AdSense after the first user interaction, or after 30s as a last
 * resort. Do not use requestIdleCallback: in lab tools the thread goes
 * idle right after hydration and the ads script then inflates TBT/LCP.
 * The publisher meta tag stays in the document head for verification.
 */
const CLIENT = "ca-pub-9572691438076734";
const SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;

let requested = false;

export function scheduleAdSense(): void {
  if (typeof window === "undefined" || requested) return;

  const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "scroll", "touchstart"];
  let fallback = 0;

  const cleanup = () => {
    events.forEach((ev) => window.removeEventListener(ev, onInteract));
    if (fallback) window.clearTimeout(fallback);
  };

  const load = () => {
    if (requested) return;
    requested = true;
    cleanup();
    if (document.querySelector(`script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]`)) {
      return;
    }
    const s = document.createElement("script");
    s.async = true;
    s.src = SCRIPT_SRC;
    s.crossOrigin = "anonymous";
    document.head.appendChild(s);
  };

  const onInteract = () => load();
  events.forEach((ev) => window.addEventListener(ev, onInteract, { once: true, passive: true }));
  fallback = window.setTimeout(load, 30_000);
}
