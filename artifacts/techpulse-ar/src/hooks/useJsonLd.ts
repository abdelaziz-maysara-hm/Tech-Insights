import { useEffect } from 'react';

/** Injects (and cleans up) one JSON-LD <script> in <head> for the current route. */
export function useJsonLd(id: string, data: Record<string, unknown> | null) {
  const serialized = data ? JSON.stringify(data) : '';
  useEffect(() => {
    if (!serialized) return;
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = serialized;
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [id, serialized]);
}
