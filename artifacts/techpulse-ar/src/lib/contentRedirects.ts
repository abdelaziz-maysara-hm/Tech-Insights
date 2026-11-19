import config from '../config/content-redirects.json' with { type: 'json' };

/** Language-less identity path -> identity path (e.g. /article/old -> /article/new). */
export const CONTENT_REDIRECTS: Record<string, string> = config.redirects;

export function getContentRedirectTarget(identityPath: string): string | null {
  const clean = identityPath.replace(/\/+$/, '') || '/';
  return CONTENT_REDIRECTS[clean] ?? null;
}
