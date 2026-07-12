import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getFile, putFile, isGithubConfigured } from './github.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// server/admin -> server -> artifacts/techpulse-ar -> src/content
const CONTENT_DIR = path.resolve(__dirname, '../../src/content');

export type CollectionName = 'articles' | 'videos' | 'pages';

const REPO_PATHS: Record<CollectionName, string> = {
  articles: 'artifacts/techpulse-ar/src/content/articles.json',
  videos: 'artifacts/techpulse-ar/src/content/videos.json',
  pages: 'artifacts/techpulse-ar/src/content/pages.json',
};

async function readLocal(name: CollectionName): Promise<any[]> {
  try {
    const file = path.join(CONTENT_DIR, `${name}.json`);
    const raw = await readFile(file, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocal(name: CollectionName, items: any[]): Promise<void> {
  try {
    await mkdir(CONTENT_DIR, { recursive: true });
    const file = path.join(CONTENT_DIR, `${name}.json`);
    await writeFile(file, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
  } catch {
    // Read-only filesystem (e.g. a deployed Netlify Function) - safe to ignore.
    // The GitHub commit below (when configured) is the real source of truth there.
  }
}

export async function readCollection(name: CollectionName): Promise<any[]> {
  if (isGithubConfigured()) {
    try {
      const remote = await getFile(REPO_PATHS[name]);
      if (remote) {
        const parsed = JSON.parse(remote.content);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fall back to local copy below
    }
  }
  return readLocal(name);
}

export async function writeCollection(
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
