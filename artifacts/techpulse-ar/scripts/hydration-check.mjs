/**
 * CI check: serve dist/public, load sample pages in headless Chrome, and
 * fail on hydration mismatches or console errors.
 *
 * Expects `pnpm run build` to have already written dist/public (runtests.sh
 * does that first). Does not add Playwright/Puppeteer — uses Chrome's
 * DevTools protocol and Node's built-in WebSocket.
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer as createNetServer } from 'node:net';
import { createServer } from 'node:http';
import { existsSync, readFileSync, rmSync, statSync } from 'node:fs';
import { extname, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import test from 'node:test';

const root = fileURLToPath(new URL('..', import.meta.url));
const distPublic = join(root, 'dist', 'public');

const SAMPLE_PATHS = [
  '/ar/',
  '/en/',
  '/ar/article/2fa-practical-guide',
  '/en/article/2fa-practical-guide',
  '/ar/comparison/thinkpad-x1-vs-hp-elitebook',
  '/en/comparison/thinkpad-x1-vs-hp-elitebook',
  '/ar/video/fortigate-firewall-policy-internet-access',
  '/en/video/fortigate-firewall-policy-internet-access',
  '/ar/videos/firewalls-vpn',
  '/en/videos/firewalls-vpn',
  '/ar/tools',
  '/en/tools',
  '/ar/alternatives',
  '/en/alternatives',
  '/ar/search',
  '/en/search',
  '/ar/__404__',
  '/en/__404__',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
};

const BLOCKED_URLS = [
  '*://pagead2.googlesyndication.com/*',
  '*://googleads.g.doubleclick.net/*',
  '*://www.google.com/pagead/*',
  '*://www.googletagservices.com/*',
  '*://tpc.googlesyndication.com/*',
  '*://fundingchoicesmessages.google.com/*',
];

const HYDRATION_RE =
  /hydrat|did not match|server rendered html|minified react error #(418|419|422|423|425)/i;

function servedFile(pathname) {
  const clean = decodeURIComponent(pathname.split('?')[0].split('#')[0]).replace(/^\/+/, '');
  if (clean === '') return 'index.html';
  if (clean.endsWith('/')) return `${clean}index.html`;
  if (/\.[a-z0-9]+$/i.test(clean)) return clean;
  return existsSync(join(distPublic, `${clean}.html`)) ? `${clean}.html` : `${clean}/index.html`;
}

function safeJoin(rel) {
  const abs = resolve(distPublic, rel);
  const relToRoot = relative(distPublic, abs);
  if (relToRoot.startsWith('..') || normalize(rel).startsWith('..')) return null;
  if (!abs.startsWith(distPublic)) return null;
  return abs;
}

function startStaticServer(port) {
  const server = createServer((req, res) => {
    const host = req.headers.host || '127.0.0.1';
    let pathname = '/';
    try {
      pathname = new URL(req.url || '/', `http://${host}`).pathname;
    } catch {
      res.writeHead(400).end('bad url');
      return;
    }
    const rel = servedFile(pathname);
    const file = safeJoin(rel);
    const notFound = join(distPublic, '404.html');
    const serve = (status, path) => {
      const type = MIME[extname(path).toLowerCase()] || 'application/octet-stream';
      res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' });
      res.end(readFileSync(path));
    };
    if (!file || !existsSync(file) || statSync(file).isDirectory()) {
      if (existsSync(notFound)) serve(404, notFound);
      else res.writeHead(404).end('not found');
      return;
    }
    serve(200, file);
  });
  return new Promise((resolve, reject) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

function freePort() {
  return new Promise((resolve, reject) => {
    const s = createNetServer();
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address();
      s.close((err) => (err ? reject(err) : resolve(port)));
    });
    s.on('error', reject);
  });
}

async function waitForJson(url, timeoutMs) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
      last = new Error(`${url} → ${res.status}`);
    } catch (err) {
      last = err;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw last || new Error(`timeout waiting for ${url}`);
}

class Cdp {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Set();
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
    this.ws.addEventListener('message', (event) => {
      const msg = JSON.parse(String(event.data));
      if (msg.id != null && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(`${msg.error.message || ''} ${JSON.stringify(msg.error)}`.trim()));
        else resolve(msg.result);
      }
      if (msg.method) {
        for (const fn of this.listeners) fn(msg);
      }
    });
  }

  on(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP timeout: ${method}`));
      }, 25_000);
      this.pending.set(id, {
        resolve: (v) => {
          clearTimeout(timer);
          resolve(v);
        },
        reject: (e) => {
          clearTimeout(timer);
          reject(e);
        },
      });
    });
  }

  close() {
    try {
      this.ws.close();
    } catch {}
  }
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) throw new Error('google-chrome not found (needed for the hydration check)');
  return found;
}

function formatConsole(item) {
  const args = item.args || [];
  const parts = args.map((arg) => {
    if (!arg || typeof arg !== 'object') return String(arg);
    if (arg.value != null) return String(arg.value);
    if (arg.description) return arg.description;
    if (arg.unserializableValue) return arg.unserializableValue;
    return arg.type || '';
  });
  return parts.join(' ').trim();
}

function isIgnorable(text, url = '') {
  const blob = `${text} ${url}`;
  if (/favico/i.test(blob)) return true;
  if (/googlesyndication|doubleclick|pagead|adsbygoogle|fundingchoices/i.test(blob)) return true;
  if (/third-party cookie|attest|deprecated.*feature/i.test(blob)) return true;
  return false;
}

async function visit(cdp, origin, pathname) {
  const issues = [];
  const url = new URL(pathname, origin).href;
  const off = cdp.on((msg) => {
    if (msg.method === 'Runtime.exceptionThrown') {
      const desc =
        msg.params?.exceptionDetails?.exception?.description ||
        msg.params?.exceptionDetails?.text ||
        JSON.stringify(msg.params?.exceptionDetails || {});
      if (!isIgnorable(desc, url)) issues.push({ kind: 'exception', text: desc });
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const type = msg.params?.type;
      const text = formatConsole(msg.params || {});
      if (!text) return;
      if (HYDRATION_RE.test(text)) issues.push({ kind: 'hydration', text });
      else if ((type === 'error' || type === 'assert') && !isIgnorable(text, url)) {
        issues.push({ kind: 'console', text });
      }
    }
    if (msg.method === 'Log.entryAdded') {
      const entry = msg.params?.entry || {};
      const text = `${entry.text || ''} ${entry.url || ''}`;
      if (entry.level === 'error' && !isIgnorable(text, entry.url)) {
        issues.push({ kind: 'log', text: text.trim() });
      }
    }
    if (msg.method === 'Network.loadingFailed') {
      const p = msg.params || {};
      const failedUrl = p.requestId || '';
      if (p.canceled || p.blockedReason) return;
      if (/net::ERR_ABORTED|net::ERR_BLOCKED/i.test(p.errorText || '')) return;
    }
  });

  await cdp.send('Page.stopLoading').catch(() => {});
  const loaded = new Promise((resolve) => {
    const done = cdp.on((msg) => {
      if (msg.method === 'Page.loadEventFired') {
        done();
        resolve();
      }
    });
  });
  const nav = await cdp.send('Page.navigate', { url });
  if (nav.errorText) issues.push({ kind: 'navigate', text: nav.errorText });
  await Promise.race([
    loaded,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`load timeout for ${pathname}`)), 20_000)),
  ]);

  // Route chunk preload + hydrateRoot.
  await new Promise((r) => setTimeout(r, 2000));

  const snapshot = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const root = document.querySelector('#root');
      const hydrate = root && root.getAttribute('data-hydrate') === 'app';
      const text = (root && root.innerText || '').replace(/\\s+/g, ' ').trim();
      const h1 = root && root.querySelector('h1');
      return {
        hydrate,
        textLength: text.length,
        h1: h1 ? h1.textContent.trim() : '',
        title: document.title,
      };
    })()`,
    returnByValue: true,
  });
  off();
  const info = snapshot?.result?.value || {};
  return { pathname, url, issues, info };
}

test('prerendered sample pages hydrate without mismatches or console errors', async (t) => {
  assert.ok(existsSync(join(distPublic, 'index.html')), 'dist/public is missing — run `pnpm run build` first');
  assert.ok(
    existsSync(join(distPublic, 'ar/__404__/index.html')),
    'dist/public is missing hydrated 404 samples — run a full build including seo-prerender',
  );

  const httpPort = await freePort();
  const debugPort = await freePort();
  const server = await startStaticServer(httpPort);
  const origin = `http://127.0.0.1:${httpPort}`;
  const profile = join(tmpdir(), `nsa-hydration-chrome-${process.pid}`);
  const chromeBin = findChrome();
  const chrome = spawn(
    chromeBin,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-background-networking',
      '--no-first-run',
      `--user-data-dir=${profile}`,
      `--remote-debugging-port=${debugPort}`,
      '--remote-allow-origins=*',
      'about:blank',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );

  const failures = [];
  let cdp;
  try {
    const version = await waitForJson(`http://127.0.0.1:${debugPort}/json/version`, 15_000);
    const list = await waitForJson(`http://127.0.0.1:${debugPort}/json/list`, 5_000);
    const page = (list || []).find((tab) => tab.type === 'page') || list[0];
    const wsUrl = page?.webSocketDebuggerUrl || version.webSocketDebuggerUrl;
    assert.ok(wsUrl, 'Chrome did not expose a DevTools websocket');

    cdp = new Cdp(wsUrl);
    await cdp.open();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Console.enable');
    await cdp.send('Log.enable');
    await cdp.send('Network.enable');
    await cdp.send('Network.setBlockedURLs', { urls: BLOCKED_URLS });

    for (const pathname of SAMPLE_PATHS) {
      const result = await visit(cdp, origin, pathname);
      const pageFails = [];
      if (!result.info.hydrate) pageFails.push('missing #root[data-hydrate=app]');
      if (!result.info.textLength || result.info.textLength < 80) {
        pageFails.push(`thin hydrated body (${result.info.textLength || 0} chars)`);
      }
      if (!result.info.h1) pageFails.push('missing h1 inside #root');
      for (const issue of result.issues) {
        pageFails.push(`${issue.kind}: ${issue.text}`);
      }
      if (pageFails.length) {
        failures.push({ pathname, title: result.info.title, pageFails });
        console.error(`[hydration] FAIL ${pathname}`, pageFails.join(' | '));
      } else {
        console.log(`[hydration] ok ${pathname} — “${result.info.h1}”`);
      }
    }
  } finally {
    if (cdp) cdp.close();
    chrome.kill('SIGKILL');
    await new Promise((resolve) => server.close(resolve));
    rmSync(profile, { recursive: true, force: true });
  }

  if (failures.length) {
    const detail = failures
      .map((f) => `${f.pathname}: ${f.pageFails.join('; ')}`)
      .join('\n');
    assert.fail(`${failures.length} page(s) failed the hydration check:\n${detail}`);
  }
});
