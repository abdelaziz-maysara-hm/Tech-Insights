import crypto from 'node:crypto';
import { readCollection, writeCollection, type CollectionName } from './store.ts';
import { createToken, verifyToken, safeCompare } from './token.ts';
import { validateCollectionItem, validateCollectionItems } from './validate.ts';

export interface CmsRequest {
  method: string;
  /** Path relative to /cms/api, e.g. "/articles" or "/articles/abc123" */
  path: string;
  body: any;
  cookies: Record<string, string>;
}

export interface CmsResponse {
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

function assignIds(
  items: Record<string, unknown>[],
  existingIds: Set<string>,
): Record<string, unknown>[] {
  return items.map((item) => {
    const rawId = item.id != null ? String(item.id) : '';
    const id = rawId && !existingIds.has(rawId) ? rawId : crypto.randomUUID();
    existingIds.add(id);
    return { ...item, id };
  });
}

export async function handleCmsRequest(req: CmsRequest): Promise<CmsResponse> {
  const { method, path, body } = req;
  const segments = path.split('/').filter(Boolean);

  if (method === 'POST' && path === '/login') {
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

  if (method === 'POST' && path === '/logout') {
    return { status: 200, headers: { 'Set-Cookie': setCookieHeader(null) }, body: { ok: true } };
  }

  if (method === 'GET' && path === '/me') {
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

      const validated = validateCollectionItems(collectionName, incoming);
      if (!validated.ok) {
        return { status: 400, body: { error: 'validation_failed', details: validated.errors } };
      }

      const existing = await readCollection(collectionName);
      const existingIds = new Set(existing.map((i: any) => String(i.id)));
      const withIds = assignIds(validated.items, existingIds);
      const merged = [...withIds, ...existing];
      const result = await writeCollection(
        collectionName,
        merged,
        `Bulk import ${withIds.length} ${collectionName} by ${auth.username}`,
      );
      return { status: 200, body: { ok: true, added: withIds.length, ...result } };
    }

    if (method === 'POST' && !second) {
      const validated = validateCollectionItem(collectionName, body);
      if (!validated.ok || !validated.item) {
        return { status: 400, body: { error: 'validation_failed', details: validated.errors } };
      }

      const existing = await readCollection(collectionName);
      const existingIds = new Set(existing.map((i: any) => String(i.id)));
      const [newItem] = assignIds([validated.item], existingIds);
      const merged = [newItem, ...existing];
      const result = await writeCollection(
        collectionName,
        merged,
        `Add ${collectionName.slice(0, -1)} "${newItem!.id}" by ${auth.username}`,
      );
      return { status: 200, body: { ok: true, item: newItem, ...result } };
    }

    if (method === 'PUT' && second) {
      const existing = await readCollection(collectionName);
      const idx = existing.findIndex((i: any) => i.id === second);
      if (idx === -1) return { status: 404, body: { error: 'not_found' } };

      const mergedBody = { ...existing[idx], ...body, id: second };
      const validated = validateCollectionItem(collectionName, mergedBody);
      if (!validated.ok || !validated.item) {
        return { status: 400, body: { error: 'validation_failed', details: validated.errors } };
      }

      existing[idx] = { ...validated.item, id: second };
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
