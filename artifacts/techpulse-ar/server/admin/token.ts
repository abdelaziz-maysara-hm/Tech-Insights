import crypto from 'node:crypto';

/**
 * Minimal, dependency-free signed session token (HMAC-SHA256).
 * Not a full JWT implementation, but gives the same guarantees we need:
 * tamper-proof payload + expiry, verifiable with a shared secret.
 */
export function createToken(
  payload: Record<string, unknown>,
  secret: string,
  ttlSeconds = 60 * 60 * 12,
): string {
  const body = { ...payload, exp: Date.now() + ttlSeconds * 1000 };
  const encodedBody = Buffer.from(JSON.stringify(body), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(encodedBody).digest('base64url');
  return `${encodedBody}.${sig}`;
}

export function verifyToken<T extends Record<string, unknown>>(
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

/** Constant-time string comparison (hashes first so length itself never leaks). */
export function safeCompare(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}
