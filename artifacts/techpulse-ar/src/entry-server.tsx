import type { ReactElement } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import App from './App';
import { detectLanguageFromPath } from './lib/localizedRouting';
import { preloadAllRoutes } from './routeTable';
import { setSsrData, type SsrData } from './ssr-data';

const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

export type RenderAppOptions = {
  data?: SsrData;
};

let routesReady: Promise<unknown> | null = null;

function ensureRoutes() {
  if (!routesReady) routesReady = preloadAllRoutes();
  return routesReady;
}

/**
 * Render the real <App /> tree for one URL to a string. Waits for every
 * lazy route (onAllReady) so the HTML is complete before it is written.
 */
export async function renderApp(url: string, options: RenderAppOptions = {}): Promise<string> {
  await ensureRoutes();
  const parsed = new URL(url, 'https://netsecatlas.com');
  const ssrPath = parsed.pathname;
  const ssrSearch = parsed.search;
  const language = detectLanguageFromPath(ssrPath, BASE) ?? 'ar';
  setSsrData(options.data);
  try {
    return await renderToStringWithAllReady(
      <App ssrPath={ssrPath} ssrSearch={ssrSearch} language={language} />,
    );
  } finally {
    setSsrData(undefined);
  }
}

function renderToStringWithAllReady(element: ReactElement): Promise<string> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const { pipe, abort } = renderToPipeableStream(element, {
      onAllReady() {
        if (settled) return;
        const sink = new PassThrough();
        const chunks: Buffer[] = [];
        sink.on('data', (chunk: Buffer | string) => chunks.push(Buffer.from(chunk)));
        sink.on('error', (err: Error) => {
          if (settled) return;
          settled = true;
          reject(err);
        });
        sink.on('end', () => {
          if (settled) return;
          settled = true;
          resolve(Buffer.concat(chunks).toString('utf8'));
        });
        pipe(sink);
      },
      onError(err) {
        if (settled) return;
        settled = true;
        abort();
        reject(err);
      },
    });
    setTimeout(() => {
      if (settled) return;
      settled = true;
      abort();
      reject(new Error('SSR render timed out after 20s'));
    }, 20_000);
  });
}
