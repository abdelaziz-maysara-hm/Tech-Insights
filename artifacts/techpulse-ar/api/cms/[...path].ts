import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// RESTORED - will be replaced with full content via follow-up if needed
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.status(503).json({ error: 'temporary', message: 'CMS handler being restored' });
}
