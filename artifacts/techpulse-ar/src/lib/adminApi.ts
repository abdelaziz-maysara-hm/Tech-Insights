// Client for the admin CMS API. Every request keeps exactly one path
// segment after /api/cms/ (Vercel's catch-all function did not reliably
// route multi-segment paths like /articles/bulk-import or /articles/{id}),
// so item id / action are passed as query parameters instead.
const BASE = '/api/cms';

export class AdminApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : undefined;

  if (!res.ok) {
    throw new AdminApiError(res.status, data?.error || `Request failed (${res.status})`);
  }
  return data as T;
}

export function login(username: string, password: string) {
  return request<{ ok: true; username: string }>('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function logout() {
  return request<{ ok: true }>('/logout', { method: 'POST' });
}

export function me() {
  return request<{ authenticated: boolean; username?: string }>('/me');
}

export type Collection = 'articles' | 'videos' | 'pages';

export function listItems<T>(collection: Collection) {
  return request<{ items: T[] }>(`/${collection}`);
}

export function createItem<T>(collection: Collection, item: Partial<T>) {
  return request<{ ok: true; item: T; committedToGithub: boolean }>(`/${collection}`, {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export function updateItem<T>(collection: Collection, id: string, item: Partial<T>) {
  return request<{ ok: true; item: T; committedToGithub: boolean }>(`/${collection}?id=${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  });
}

export function deleteItem(collection: Collection, id: string) {
  return request<{ ok: true; committedToGithub: boolean }>(`/${collection}?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export function bulkImport<T>(collection: Collection, items: Partial<T>[]) {
  return request<{ ok: true; added: number; committedToGithub: boolean }>(`/${collection}?action=bulk-import`, {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}