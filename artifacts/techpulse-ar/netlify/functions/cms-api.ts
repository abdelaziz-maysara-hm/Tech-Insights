import { handleCmsRequest, type CmsRequest } from '../../server/admin/router.ts';
import { parseCookies } from '../../server/admin/cookies.ts';

// Netlify Functions v2 (Web-standard Request/Response). No extra deps needed.
export default async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/cms\/api/, '') || '/';

  let body: any;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      body = await req.json();
    } catch {
      body = undefined;
    }
  }

  const cmsReq: CmsRequest = {
    method: req.method,
    path,
    body,
    cookies: parseCookies(req.headers.get('cookie')),
  };

  try {
    const result = await handleCmsRequest(cmsReq);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    if (result.headers) {
      for (const [k, v] of Object.entries(result.headers)) headers.set(k, v);
    }
    return new Response(JSON.stringify(result.body), { status: result.status, headers });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'internal_error', message: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

export const config = { path: '/cms/api/*' };
