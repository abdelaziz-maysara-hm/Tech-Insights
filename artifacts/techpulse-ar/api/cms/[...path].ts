import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Everything the admin CMS needs lives in this single file on purpose.
// Vercel's function bundler does not reliably pull in sibling files that
// live outside the /api directory, so instead of importing from
// ../../server/admin/*, we inline that logic here. Behavior is identical
// to server/admin/{router,store,token,github,cookies}.ts.
// ---------------------------------------------------------------------------

// ----- cookies.ts -----------------------------------------------------------
function parseCookies(header: string | undefined | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}

// ----- token.ts --------------------------------------------------------------
function createToken(payload: Record<string, unknown>, secret: string, ttlSeconds = 60 * 60 * 12): string {
  const body = { ...payload, exp: Date.now() + ttlSeconds * 1000 };
  const encodedBody = Buffer.from(JSON.stringify(body), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(encodedBody).digest('base64url');
  return `${encodedBody}.${sig}`;
}

function verifyToken<T extends Record<string, unknown>>(
  token: string | undefined | null,
  secret: string,
): (T & { exp: number }) | null {
  if (!token) return null;
  const [encodedBody, sig] = token.split('.');
  if (!encodedBody || !sig) return null;

  const expectedSig = crypto.createHmac('sha256', secret).update(encodedBody).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedBody, 'base64url').toString('utf8')) as T & { exp: number };
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function safeCompare(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

// ----- github.ts --------------------------------------------------------------
const API_BASE = 'https://api.github.com';

interface GhFileResponse {
  sha: string;
  content: string;
}

function repoInfo() {
  const repo = process.env.GITHUB_REPO; // "owner/name"
  const branch = process.env.GITHUB_BRANCH || 'main';
  const token = process.env.GITHUB_TOKEN;
  return { repo, branch, token };
}

function isGithubConfigured(): boolean {
  const { repo, token } = repoInfo();
  return Boolean(repo && token);
}

async function getFile(repoPath: string): Promise<{ content: string; sha: string } | null> {
  const { repo, branch, token } = repoInfo();
  if (!repo || !token) return null;

  const res = await fetch(`${API_BASE}/repos/${repo}/contents/${repoPath}?ref=${encodeURIComponent(branch)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'techpulse-admin-cms',
    },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub read failed (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as GhFileResponse;
  return { content: Buffer.from(data.content, 'base64').toString('utf8'), sha: data.sha };
}

async function putFile(repoPath: string, content: string, message: string): Promise<void> {
  const { repo, branch, token } = repoInfo();
  if (!repo || !token) throw new Error('GitHub is not configured (missing GITHUB_REPO/GITHUB_TOKEN)');

  const existing = await getFile(repoPath);

  const res = await fetch(`${API_BASE}/repos/${repo}/contents/${repoPath}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'techpulse-admin-cms',
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf8').toString('base64'),
      branch,
      sha: existing?.sha,
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub write failed (${res.status}): ${await res.text()}`);
  }
}

// ----- store.ts --------------------------------------------------------------
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// api/cms -> api -> artifacts/techpulse-ar -> src/content
const CONTENT_DIR = path.resolve(__dirname, '../../src/content');

type CollectionName = 'articles' | 'videos' | 'pages';

const REPO_PATHS: Record<CollectionName, string> = {
  articles: 'artifacts/techpulse-ar/src/content/articles.json',
  videos: 'artifacts/techpulse-ar/src/content/videos.json',
  pages: 'artifacts/techpulse-ar/src/content/pages.json',
};

async function readLocal(name: CollectionName): Promise<any[]> {
  try {
    const file = path.join(CONTENT_DIR, `${name}.json`);
    const raw = await readFile(file, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocal(name: CollectionName, items: any[]): Promise<void> {
  try {
    await mkdir(CONTENT_DIR, { recursive: true });
    const file = path.join(CONTENT_DIR, `${name}.json`);
    await writeFile(file, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
  } catch {
    // Read-only filesystem on Vercel - safe to ignore. The GitHub commit
    // below (when configured) is the real source of truth there.
  }
}

async function readCollection(name: CollectionName): Promise<any[]> {
  if (isGithubConfigured()) {
    try {
      const remote = await getFile(REPO_PATHS[name]);
      if (remote) {
        const parsed = JSON.parse(remote.content);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fall back to local copy below
    }
  }
  return readLocal(name);
}

async function writeCollection(
  name: CollectionName,
  items: any[],
  commitMessage: string,
): Promise<{ committedToGithub: boolean }> {
  await writeLocal(name, items);
  if (isGithubConfigured()) {
    await putFile(REPO_PATHS[name], `${JSON.stringify(items, null, 2)}\n`, commitMessage);
    return { committedToGithub: true };
  }
  return { committedToGithub: false };
}

// ----- router.ts --------------------------------------------------------------
interface CmsRequest {
  method: string;
  /** Path relative to /cms/api, e.g. "/articles" or "/articles/abc123" */
  path: string;
  body: any;
  cookies: Record<string, string>;
}

interface CmsResponse {
  status: number;
  headers?: Record<string, string>;
  body: unknown;
}

const SESSION_COOKIE = 'techpulse_admin_session';
const COLLECTIONS: CollectionName[] = ['articles', 'videos', 'pages'];

function getAdminUsers(): { username: string; password: string }[] {
  const users: { username: string; password: string }[] = [];
  if (process.env.ADMIN1_USERNAME && process.env.ADMIN1_PASSWORD) {
    users.push({ username: process.env.ADMIN1_USERNAME, password: process.env.ADMIN1_PASSWORD });
  }
  if (process.env.ADMIN2_USERNAME && process.env.ADMIN2_PASSWORD) {
    users.push({ username: process.env.ADMIN2_USERNAME, password: process.env.ADMIN2_PASSWORD });
  }
  return users;
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return secret;
}

function requireAuth(req: CmsRequest): { username: string } | null {
  try {
    const token = req.cookies[SESSION_COOKIE];
    const payload = verifyToken<{ username: string }>(token, getSecret());
    return payload ? { username: payload.username } : null;
  } catch {
    return null;
  }
}

function setCookieHeader(token: string | null): string {
  if (!token) {
    return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
  }
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200`;
}

async function handleCmsRequest(req: CmsRequest): Promise<CmsResponse> {
  const { method, path: reqPath, body } = req;
  const segments = reqPath.split('/').filter(Boolean);

  if (method === 'POST' && reqPath === '/login') {
    const users = getAdminUsers();
    if (!users.length) {
      return { status: 500, body: { error: 'admin_not_configured' } };
    }
    let secretOk = true;
    try {
      getSecret();
    } catch {
      secretOk = false;
    }
    if (!secretOk) return { status: 500, body: { error: 'admin_not_configured' } };

    const username = String(body?.username ?? '');
    const password = String(body?.password ?? '');
    const match = users.find((u) => safeCompare(u.username, username) && safeCompare(u.password, password));
    if (!match) return { status: 401, body: { error: 'invalid_credentials' } };

    const token = createToken({ username: match.username }, getSecret());
    return {
      status: 200,
      headers: { 'Set-Cookie': setCookieHeader(token) },
      body: { ok: true, username: match.username },
    };
  }

  if (method === 'POST' && reqPath === '/logout') {
    return { status: 200, headers: { 'Set-Cookie': setCookieHeader(null) }, body: { ok: true } };
  }

  if (method === 'GET' && reqPath === '/me') {
    const auth = requireAuth(req);
    return { status: 200, body: { authenticated: Boolean(auth), username: auth?.username } };
  }

  const auth = requireAuth(req);
  if (!auth) return { status: 401, body: { error: 'unauthorized' } };

  const collectionName = segments[0] as CollectionName;
  if (!COLLECTIONS.includes(collectionName)) {
    return { status: 404, body: { error: 'not_found' } };
  }

  const second = segments[1];

  try {
    if (method === 'GET' && !second) {
      const items = await readCollection(collectionName);
      return { status: 200, body: { items } };
    }

    if (method === 'POST' && second === 'bulk-import') {
      const incoming = Array.isArray(body?.items) ? body.items : [];
      if (!incoming.length) return { status: 400, body: { error: 'no_items' } };
      const existing = await readCollection(collectionName);
      const existingIds = new Set(existing.map((i: any) => i.id));
      const withIds = incoming.map((item: any) => ({
        ...item,
        id: item.id && !existingIds.has(item.id) ? String(item.id) : crypto.randomUUID(),
      }));
      const merged = [...withIds, ...existing];
      const result = await writeCollection(
        collectionName,
        merged,
        `Bulk import ${withIds.length} ${collectionName} by ${auth.username}`,
      );
      return { status: 200, body: { ok: true, added: withIds.length, ...result } };
    }

    if (method === 'POST' && !second) {
      const existing = await readCollection(collectionName);
      const newItem = { ...body, id: body?.id ? String(body.id) : crypto.randomUUID() };
      const merged = [newItem, ...existing];
      const result = await writeCollection(
        collectionName,
        merged,
        `Add ${collectionName.slice(0, -1)} "${newItem.id}" by ${auth.username}`,
      );
      return { status: 200, body: { ok: true, item: newItem, ...result } };
    }

    if (method === 'PUT' && second) {
      const existing = await readCollection(collectionName);
      const idx = existing.findIndex((i: any) => i.id === second);
      if (idx === -1) return { status: 404, body: { error: 'not_found' } };
      existing[idx] = { ...existing[idx], ...body, id: second };
      const result = await writeCollection(
        collectionName,
        existing,
        `Update ${collectionName.slice(0, -1)} "${second}" by ${auth.username}`,
      );
      return { status: 200, body: { ok: true, item: existing[idx], ...result } };
    }

    if (method === 'DELETE' && second) {
      const existing = await readCollection(collectionName);
      const filtered = existing.filter((i: any) => i.id !== second);
      if (filtered.length === existing.length) return { status: 404, body: { error: 'not_found' } };
      const result = await writeCollection(
        collectionName,
        filtered,
        `Delete ${collectionName.slice(0, -1)} "${second}" by ${auth.username}`,
      );
      return { status: 200, body: { ok: true, ...result } };
    }
  } catch (err) {
    return { status: 500, body: { error: 'internal_error', message: err instanceof Error ? err.message : String(err) } };
  }

  return { status: 404, body: { error: 'not_found' } };
}

// ----- Vercel handler ---------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const segments = req.query.path;
  const pathArr = Array.isArray(segments) ? segments : segments ? [segments] : [];
  const cmsPath = `/${pathArr.join('/')}`;

  const cmsReq: CmsRequest = {
    method: req.method || 'GET',
    path: cmsPath,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    cookies: parseCookies(req.headers.cookie),
  };

  try {
    const result = await handleCmsRequest(cmsReq);
    if (result.headers) {
      for (const [key, value] of Object.entries(result.headers)) {
        res.setHeader(key, value);
      }
    }
    res.status(result.status).json(result.body);
  } catch (err) {
    res.status(500).json({
      error: 'internal_error',
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
