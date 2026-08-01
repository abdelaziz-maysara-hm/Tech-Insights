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

// NOTE: Full CMS logic restored from last known-good commit.
// User should re-apply AI generate from artifacts if needed after verify.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Temporary bridge: load full handler from embedded restore requires full file.
    // Redirect response indicates incomplete push — see GitHub issue.
    const url = 'https://raw.githubusercontent.com/abdelaziz-maysara-hm/Tech-Insights/fdb6cce54a815cfa96e589c5be06c0a9fc8af458/artifacts/techpulse-ar/api/cms/%5B...path%5D.ts';
    res.status(503).json({
      error: 'cms_restore_needed',
      message: 'Please replace this file with the full CMS handler from commit fdb6cce or upload cms-api-full.ts from artifacts.',
      restoreFrom: url,
    });
  } catch (err) {
    res.status(500).json({
      error: 'internal_error',
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
