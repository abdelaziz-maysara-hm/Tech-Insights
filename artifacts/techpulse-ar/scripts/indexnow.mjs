/**
 * Submit published URLs to IndexNow (Bing and partners). Safe to retry.
 * Reads the key from public/<key>.txt and the URL list from a sitemap file
 * (local or already-live). Failures print a warning and exit 0 unless
 * --strict is passed — a search-engine outage must not fail a deploy.
 *
 *   node scripts/indexnow.mjs [--sitemap <path-or-url>] [--strict]
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { INDEXNOW_KEY, SITE } from './sitemap-core.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENDPOINT = 'https://api.indexnow.org/indexnow';

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

async function readSitemap(source) {
  if (/^https?:\/\//i.test(source)) {
    const res = await fetch(source, { redirect: 'follow' });
    if (!res.ok) throw new Error(`sitemap HTTP ${res.status} at ${source}`);
    return res.text();
  }
  return readFileSync(source, 'utf8');
}

async function main() {
  const strict = process.argv.includes('--strict');
  const defaultLocal = join(root, 'public', 'sitemap.xml');
  const source = arg('--sitemap', existsSync(defaultLocal) ? defaultLocal : `${SITE}/sitemap.xml`);
  const keyFile = join(root, 'public', `${INDEXNOW_KEY}.txt`);
  if (!existsSync(keyFile) || readFileSync(keyFile, 'utf8').trim() !== INDEXNOW_KEY) {
    throw new Error(`IndexNow key file missing or mismatched: ${keyFile}`);
  }
  const xml = await readSitemap(source);
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!urls.length) throw new Error('no <loc> entries in sitemap');
  const body = {
    host: 'netsecatlas.com',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  // 200 = OK, 202 = Accepted. 4xx/5xx are failures.
  if (res.status === 200 || res.status === 202) {
    console.log(`[indexnow] submitted ${urls.length} URLs (${res.status}) from ${source}`);
    return;
  }
  const message = `[indexnow] ${ENDPOINT} returned ${res.status}: ${text.slice(0, 300)}`;
  if (strict) throw new Error(message);
  console.warn(message);
}

main().catch((err) => {
  if (process.argv.includes('--strict')) {
    console.error(err);
    process.exit(1);
  }
  console.warn(`[indexnow] skipped: ${err.message || err}`);
});
