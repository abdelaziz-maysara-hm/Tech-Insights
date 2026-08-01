import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Self-contained Vercel function (bundler does not reliably import siblings).
// Mirrors server/admin/{router,store,token,github,cookies,validate}.ts
// ---------------------------------------------------------------------------

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

const API_BASE = 'https://api.github.com';
interface GhFileResponse { sha: string; content: string }

function repoInfo() {
  return {
    repo: process.env.GITHUB_REPO,
    branch: process.env.GITHUB_BRANCH || 'main',
    token: process.env.GITHUB_TOKEN,
  };
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
  if (!res.ok) throw new Error(`GitHub read failed (${res.status}): ${await res.text()}`);
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
  if (!res.ok) throw new Error(`GitHub write failed (${res.status}): ${await res.text()}`);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, '../../src/content');
type CollectionName = 'articles' | 'videos' | 'pages';

const REPO_PATHS: Record<CollectionName, string> = {
  articles: 'artifacts/techpulse-ar/src/content/articles.json',
  videos: 'artifacts/techpulse-ar/src/content/videos.json',
  pages: 'artifacts/techpulse-ar/src/content/pages.json',
};

async function readLocal(name: CollectionName): Promise<any[]> {
  try {
    const raw = await readFile(path.join(CONTENT_DIR, `${name}.json`), 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocal(name: CollectionName, items: any[]): Promise<void> {
  try {
    await mkdir(CONTENT_DIR, { recursive: true });
    await writeFile(path.join(CONTENT_DIR, `${name}.json`), `${JSON.stringify(items, null, 2)}\n`, 'utf8');
  } catch {
    // read-only on Vercel
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
      /* fall through */
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

// ----- validation (inlined) ---------------------------------------------------
const CATEGORIES = new Set([
  'cybersecurity', 'mobile', 'laptops', 'howto', 'ai', 'reviews', 'windows', 'comparisons', 'technology',
]);

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function isBilingual(v: unknown): v is { ar: string; en: string } {
  return isObject(v) && typeof v.ar === 'string' && typeof v.en === 'string';
}
function slugify(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80) || `item-${Date.now()}`;
}
function today(): string {
  return new Date().toISOString().split('T')[0]!;
}

interface ValidationResult {
  ok: boolean;
  errors: string[];
  item?: Record<string, unknown>;
}

function validateArticle(raw: unknown, index?: number): ValidationResult {
  const prefix = index !== undefined ? `articles[${index}]` : 'article';
  const errors: string[] = [];
  if (!isObject(raw)) return { ok: false, errors: [`${prefix}: must be an object`] };
  if (!isBilingual(raw.title) || !raw.title.ar.trim() || !raw.title.en.trim()) {
    errors.push(`${prefix}.title: required { ar, en } non-empty`);
  }
  if (!isBilingual(raw.excerpt) || !raw.excerpt.ar.trim() || !raw.excerpt.en.trim()) {
    errors.push(`${prefix}.excerpt: required { ar, en } non-empty`);
  }
  if (!isBilingual(raw.body) || !raw.body.ar.trim() || !raw.body.en.trim()) {
    errors.push(`${prefix}.body: required { ar, en } non-empty`);
  }
  if (typeof raw.categoryId === 'string' && !CATEGORIES.has(raw.categoryId)) {
    errors.push(`${prefix}.categoryId: invalid "${raw.categoryId}"`);
  }
  if (errors.length) return { ok: false, errors };

  const enTitle = (raw.title as { en: string }).en;
  const slug = typeof raw.slug === 'string' && raw.slug.trim() ? slugify(raw.slug) : slugify(enTitle);
  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((t): t is string => typeof t === 'string').map((t) => t.trim()).filter(Boolean)
    : typeof raw.tags === 'string'
      ? raw.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];
  const item: Record<string, unknown> = {
    id: typeof raw.id === 'string' && raw.id.trim() ? String(raw.id) : undefined,
    slug,
    title: raw.title,
    excerpt: raw.excerpt,
    body: raw.body,
    categoryId: typeof raw.categoryId === 'string' && CATEGORIES.has(raw.categoryId) ? raw.categoryId : 'technology',
    author:
      isObject(raw.author) && isBilingual((raw.author as any).name)
        ? {
            name: (raw.author as any).name,
            avatar: typeof (raw.author as any).avatar === 'string' ? (raw.author as any).avatar : 'https://i.pravatar.cc/150?img=68',
          }
        : { name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' }, avatar: 'https://i.pravatar.cc/150?img=68' },
    date: typeof raw.date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(raw.date) ? raw.date.slice(0, 10) : today(),
    readTime: typeof raw.readTime === 'number' && raw.readTime > 0 ? Math.min(Math.round(raw.readTime), 120) : 5,
    heroImage: typeof raw.heroImage === 'string' && raw.heroImage.trim() ? raw.heroImage.trim() : `https://picsum.photos/seed/${slug}/800/450`,
    tags,
    isFeatured: Boolean(raw.isFeatured),
    isTrending: Boolean(raw.isTrending),
  };
  if (typeof raw.youtubeVideoId === 'string' && raw.youtubeVideoId.trim()) item.youtubeVideoId = raw.youtubeVideoId.trim();
  if (typeof raw.subcategoryId === 'string' && raw.subcategoryId.trim()) item.subcategoryId = raw.subcategoryId.trim();
  return { ok: true, errors: [], item };
}

function validateVideo(raw: unknown, index?: number): ValidationResult {
  const prefix = index !== undefined ? `videos[${index}]` : 'video';
  const errors: string[] = [];
  if (!isObject(raw)) return { ok: false, errors: [`${prefix}: must be an object`] };
  if (!isBilingual(raw.title) || !raw.title.ar.trim() || !raw.title.en.trim()) errors.push(`${prefix}.title: required`);
  const youtubeId =
    typeof raw.youtubeId === 'string' ? raw.youtubeId.trim()
      : typeof raw.youtubeVideoId === 'string' ? raw.youtubeVideoId.trim() : '';
  if (!youtubeId) errors.push(`${prefix}.youtubeId: required`);
  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    errors: [],
    item: {
      id: typeof raw.id === 'string' && raw.id.trim() ? String(raw.id) : undefined,
      title: raw.title,
      description: isBilingual(raw.description) ? raw.description : { ar: '', en: '' },
      youtubeId,
      date: typeof raw.date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(raw.date) ? raw.date.slice(0, 10) : today(),
    },
  };
}

function validatePage(raw: unknown, index?: number): ValidationResult {
  const prefix = index !== undefined ? `pages[${index}]` : 'page';
  const errors: string[] = [];
  if (!isObject(raw)) return { ok: false, errors: [`${prefix}: must be an object`] };
  if (!isBilingual(raw.title) || !raw.title.ar.trim() || !raw.title.en.trim()) errors.push(`${prefix}.title: required`);
  if (!isBilingual(raw.content) || !raw.content.ar.trim() || !raw.content.en.trim()) errors.push(`${prefix}.content: required`);
  if (errors.length) return { ok: false, errors };
  const enTitle = (raw.title as { en: string }).en;
  return {
    ok: true,
    errors: [],
    item: {
      id: typeof raw.id === 'string' && raw.id.trim() ? String(raw.id) : undefined,
      slug: typeof raw.slug === 'string' && raw.slug.trim() ? slugify(raw.slug) : slugify(enTitle),
      title: raw.title,
      content: raw.content,
      updatedAt: typeof raw.updatedAt === 'string' && /^\d{4}-\d{2}-\d{2}/.test(raw.updatedAt) ? raw.updatedAt.slice(0, 10) : today(),
      showInFooter: raw.showInFooter !== false,
    },
  };
}

function validateItem(collection: CollectionName, raw: unknown, index?: number): ValidationResult {
  if (collection === 'articles') return validateArticle(raw, index);
  if (collection === 'videos') return validateVideo(raw, index);
  return validatePage(raw, index);
}

function validateItems(collection: CollectionName, items: unknown[]) {
  const normalized: Record<string, unknown>[] = [];
  const errors: string[] = [];
  for (let i = 0; i < items.length; i++) {
    const r = validateItem(collection, items[i], i);
    if (!r.ok || !r.item) errors.push(...r.errors);
    else normalized.push(r.item);
  }
  if (errors.length) return { ok: false as const, errors: errors.slice(0, 20) };
  return { ok: true as const, items: normalized };
}

function assignIds(items: Record<string, unknown>[], existingIds: Set<string>) {
  return items.map((item) => {
    const rawId = item.id != null ? String(item.id) : '';
    const id = rawId && !existingIds.has(rawId) ? rawId : crypto.randomUUID();
    existingIds.add(id);
    return { ...item, id };
  });
}

// ----- router -----------------------------------------------------------------
interface CmsRequest {
  method: string;
  path: string;
  body: any;
  cookies: Record<string, string>;
  itemId?: string;
  action?: string;
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
  if (!token) return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200`;
}

async function handleCmsRequest(req: CmsRequest): Promise<CmsResponse> {
  const { method, path: reqPath, body, itemId, action } = req;
  const segments = reqPath.split('/').filter(Boolean);

  if (method === 'POST' && reqPath === '/login') {
    const users = getAdminUsers();
    if (!users.length) return { status: 500, body: { error: 'admin_not_configured' } };
    try { getSecret(); } catch { return { status: 500, body: { error: 'admin_not_configured' } }; }
    const username = String(body?.username ?? '');
    const password = String(body?.password ?? '');
    const match = users.find((u) => safeCompare(u.username, username) && safeCompare(u.password, password));
    if (!match) return { status: 401, body: { error: 'invalid_credentials' } };
    const token = createToken({ username: match.username }, getSecret());
    return { status: 200, headers: { 'Set-Cookie': setCookieHeader(token) }, body: { ok: true, username: match.username } };
  }

  if (method === 'POST' && reqPath === '/logout') {
    return { status: 200, headers: { 'Set-Cookie': setCookieHeader(null) }, body: { ok: true } };
  }

  if (method === 'GET' && reqPath === '/me') {
    const auth = requireAuth(req);
    return { status: 200, body: { authenticated: Boolean(auth), username: auth?.username } };
  }

  // Public read-only list for the website (no auth). Same data admin manages.
  if (method === 'GET' && (reqPath === '/public/articles' || reqPath === '/public/videos' || reqPath === '/public/pages')) {
    const name = reqPath.split('/').pop() as 'articles' | 'videos' | 'pages';
    try {
      const items = await readCollection(name);
      return { status: 200, body: { items } };
    } catch (err) {
      return { status: 500, body: { error: 'internal_error', message: err instanceof Error ? err.message : String(err) } };
    }
  }

  const auth = requireAuth(req);
  if (!auth) return { status: 401, body: { error: 'unauthorized' } };

  const collectionName = segments[0] as CollectionName;
  if (!COLLECTIONS.includes(collectionName)) return { status: 404, body: { error: 'not_found' } };

  const second = action || itemId;

  try {
    if (method === 'GET' && !second) {
      return { status: 200, body: { items: await readCollection(collectionName) } };
    }

    if (method === 'POST' && action === 'bulk-import') {
      const incoming = Array.isArray(body?.items) ? body.items : [];
      if (!incoming.length) return { status: 400, body: { error: 'no_items' } };
      const validated = validateItems(collectionName, incoming);
      if (!validated.ok) return { status: 400, body: { error: 'validation_failed', details: validated.errors } };
      const existing = await readCollection(collectionName);
      const existingIds = new Set(existing.map((i: any) => String(i.id)));
      const withIds = assignIds(validated.items, existingIds);
      const result = await writeCollection(collectionName, [...withIds, ...existing], `Bulk import ${withIds.length} ${collectionName} by ${auth.username}`);
      return { status: 200, body: { ok: true, added: withIds.length, ...result } };
    }

    if (method === 'POST' && !action && !itemId) {
      const validated = validateItem(collectionName, body);
      if (!validated.ok || !validated.item) return { status: 400, body: { error: 'validation_failed', details: validated.errors } };
      const existing = await readCollection(collectionName);
      const existingIds = new Set(existing.map((i: any) => String(i.id)));
      const [newItem] = assignIds([validated.item], existingIds);
      const result = await writeCollection(collectionName, [newItem, ...existing], `Add ${collectionName.slice(0, -1)} "${newItem!.id}" by ${auth.username}`);
      return { status: 200, body: { ok: true, item: newItem, ...result } };
    }

    if (method === 'PUT' && itemId) {
      const existing = await readCollection(collectionName);
      const idx = existing.findIndex((i: any) => i.id === itemId);
      if (idx === -1) return { status: 404, body: { error: 'not_found' } };
      const validated = validateItem(collectionName, { ...existing[idx], ...body, id: itemId });
      if (!validated.ok || !validated.item) return { status: 400, body: { error: 'validation_failed', details: validated.errors } };
      existing[idx] = { ...validated.item, id: itemId };
      const result = await writeCollection(collectionName, existing, `Update ${collectionName.slice(0, -1)} "${itemId}" by ${auth.username}`);
      return { status: 200, body: { ok: true, item: existing[idx], ...result } };
    }

    if (method === 'DELETE' && itemId) {
      const existing = await readCollection(collectionName);
      const filtered = existing.filter((i: any) => i.id !== itemId);
      if (filtered.length === existing.length) return { status: 404, body: { error: 'not_found' } };
      const result = await writeCollection(collectionName, filtered, `Delete ${collectionName.slice(0, -1)} "${itemId}" by ${auth.username}`);
      return { status: 200, body: { ok: true, ...result } };
    }
  } catch (err) {
    return { status: 500, body: { error: 'internal_error', message: err instanceof Error ? err.message : String(err) } };
  }

  return { status: 404, body: { error: 'not_found' } };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const rawUrl = req.url || '/';
  const [pathname, queryString] = rawUrl.split('?');
  const cmsPath = pathname.replace(/^\/api\/cms/, '') || '/';
  const params = new URLSearchParams(queryString || '');

  const cmsReq: CmsRequest = {
    method: req.method || 'GET',
    path: cmsPath,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    cookies: parseCookies(req.headers.cookie),
    itemId: params.get('id') || undefined,
    action: params.get('action') || undefined,
  };

  try {
    const result = await handleCmsRequest(cmsReq);
    if (result.headers) {
      for (const [key, value] of Object.entries(result.headers)) res.setHeader(key, value);
    }
    res.status(result.status).json(result.body);
  } catch (err) {
    res.status(500).json({
      error: 'internal_error',
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
