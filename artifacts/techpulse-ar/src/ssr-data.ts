import type { Article } from '@/data/mockData';

/** Data inlined into the prerendered HTML and read on the first client render. */
export type SsrData = {
  article?: Article;
};

declare global {
  // eslint-disable-next-line no-var
  var __NSS_DATA__: SsrData | undefined;
  interface Window {
    __NSS_DATA__?: SsrData;
  }
}

export function getSsrData(): SsrData | undefined {
  if (typeof globalThis === 'undefined') return undefined;
  return globalThis.__NSS_DATA__;
}

export function setSsrData(data: SsrData | undefined): void {
  globalThis.__NSS_DATA__ = data;
}
