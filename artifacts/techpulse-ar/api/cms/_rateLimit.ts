/**
 * Rate limiting for admin login lives inlined inside [...path].ts
 * because the Vercel bundler does not reliably import sibling modules.
 * Mirror: server/admin/router.ts (10 attempts / 15 minutes per IP).
 */
export {};
