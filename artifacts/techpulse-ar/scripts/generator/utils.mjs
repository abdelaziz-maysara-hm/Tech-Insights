/** Shared CLI + IO helpers */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const PACKAGE_ROOT = join(__dirname, '../..');
export const OUT_DIR = join(PACKAGE_ROOT, 'content/generated');

export function parseArgs(argv = process.argv.slice(2)) {
  const out = { type: 'all', count: undefined, category: undefined, subcategory: undefined };
  for (const arg of argv) {
    if (arg.startsWith('--type=')) out.type = arg.slice(7);
    else if (arg.startsWith('--count=')) out.count = Number(arg.slice(8));
    else if (arg.startsWith('--category=')) out.category = arg.slice(11);
    else if (arg.startsWith('--subcategory=')) out.subcategory = arg.slice(14);
  }
  return out;
}

export async function writeJson(name, data) {
  await mkdir(OUT_DIR, { recursive: true });
  const path = join(OUT_DIR, name);
  const body = `${JSON.stringify(data, null, 2)}\n`;
  await writeFile(path, body, 'utf8');
  return { path, bytes: Buffer.byteLength(body, 'utf8'), count: Array.isArray(data) ? data.length : 1 };
}

export function pick(arr, i) {
  return arr[i % arr.length];
}

export function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
