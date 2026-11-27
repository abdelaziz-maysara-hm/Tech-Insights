/**
 * Load AdSense after the first user interaction, or once the browser is idle.
 * The publisher meta tag stays in the document head for verification.
 * This keeps the ads script off the critical path (LCP / TBT) without
 * disabling ads.
 */
const CLIENT = "ca-pub-9572691438076734";
const SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;

let requested = false;

export function scheduleAdSense(): void {
  if (typeof window === "undefined" || requested) return;

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
  const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "scroll", "touchstart"];
  const cleanup = () => {
    events.forEach((ev) => window.removeEventListener(ev, onInteract));
  };
  events.forEach((ev) => window.addEventListener(ev, onInteract, { once: true, passive: true }));

  const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 10000));
  ric(() => load(), { timeout: 10000 });
}
