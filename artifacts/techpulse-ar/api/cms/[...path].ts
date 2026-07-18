import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCmsRequest, type CmsRequest } from '../../server/admin/router.ts';
import { parseCookies } from '../../server/admin/cookies.ts';

// Vercel Serverless Function — ported from netlify/functions/cms-api.ts
// The frontend calls /cms/api/*; vercel.json rewrites that to
// /api/cms/*, which lands here with the tail segments in req.query.path.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const segments = req.query.path;
  const pathArr = Array.isArray(segments) ? segments : segments ? [segments] : [];
  const path = `/${pathArr.join('/')}`;

  const cmsReq: CmsRequest = {
    method: req.method || 'GET',
    path,
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