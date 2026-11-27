/**
 * Re-verify every YouTube video and playlist ID in videos-data.mjs (and any
 * extra IDs passed as arguments) via the public oEmbed API.
 * Usage: node scripts/phase7/verify-youtube-oembed.mjs [--write]
 * With --write, new HTTP 200 results are merged into youtube-oembed-verified.json.
 * Never invent IDs: only IDs already in source data or passed on the CLI are checked.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { VIDEO_ROWS } from './videos-data.mjs';

const verifiedPath = new URL('./youtube-oembed-verified.json', import.meta.url);
const verified = JSON.parse(readFileSync(verifiedPath, 'utf8'));
const write = process.argv.includes('--write');
const extra = process.argv.filter((a) => a !== '--write' && !a.startsWith('-') && !a.endsWith('verify-youtube-oembed.mjs'));

const videoIds = new Set(extra.filter((id) => !id.startsWith('PL') || id.length === 11));
const playlistIds = new Set(extra.filter((id) => id.startsWith('PL') && id.length > 13));
for (const rows of Object.values(VIDEO_ROWS)) {
  for (const row of rows) videoIds.add(row[1]);
}
try {
  const playlists = JSON.parse(readFileSync(new URL('../../src/content/video-playlists.json', import.meta.url), 'utf8'));
  for (const p of playlists) {
    for (const entry of p.externalPlaylists || []) {
      const value = typeof entry === 'string' ? entry : entry.youtubePlaylistId;
      if (value) playlistIds.add(value);
    }
  }
} catch {
  /* video-playlists.json is produced by build-videos.mjs */
}

async function oembed(url) {
  const api = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`;
  const res = await fetch(api, { headers: { 'User-Agent': 'NetSecAtlasVideoVerify/1.0 (+https://netsecatlas.com)' } });
  if (!res.ok) return { oembedStatus: res.status };
  const data = await res.json();
  return {
    title: data.title,
    author: data.author_name,
    authorUrl: data.author_url,
    oembedStatus: 200,
  };
}

const failures = [];
for (const id of videoIds) {
  const rec = await oembed(`https://www.youtube.com/watch?v=${id}`);
  const ok = rec.oembedStatus === 200;
  console.log(`${ok ? 'OK' : 'FAIL'} video ${id} ${rec.author || rec.oembedStatus} | ${rec.title || ''}`);
  if (!ok) failures.push(id);
  else if (write) verified.videos[id] = rec;
}
for (const id of playlistIds) {
  const rec = await oembed(`https://www.youtube.com/playlist?list=${id}`);
  const ok = rec.oembedStatus === 200;
  console.log(`${ok ? 'OK' : 'FAIL'} playlist ${id} ${rec.author || rec.oembedStatus} | ${rec.title || ''}`);
  if (!ok) failures.push(id);
  else if (write) verified.playlists[id] = rec;
}

if (write && failures.length === 0) {
  verified.verifiedAt = new Date().toISOString().slice(0, 10);
  writeFileSync(verifiedPath, `${JSON.stringify(verified, null, 1)}\n`);
  console.log(`wrote ${verifiedPath.pathname}`);
}
if (failures.length) {
  console.error(`failed: ${failures.join(', ')}`);
  process.exit(1);
}
console.log(`verified ${videoIds.size} videos and ${playlistIds.size} playlists`);
