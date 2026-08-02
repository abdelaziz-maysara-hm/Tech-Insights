/** Merge / dedupe helpers for incremental generation */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PACKAGE_ROOT, OUT_DIR } from './utils.mjs';

export function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function itemFingerprint(item) {
  const slug = item.slug ? normalizeText(item.slug) : '';
  const id = item.id ? normalizeText(item.id) : '';
  const titleEn = normalizeText(item.title?.en || item.title);
  const titleAr = normalizeText(item.title?.ar || '');
  const yt = item.youtubeId ? normalizeText(item.youtubeId) : '';
  return { id, slug, titleKey: `${titleEn}|${titleAr}`, youtubeId: yt };
}

export function titleSimilarity(a, b) {
  const ta = new Set(normalizeText(a).split(' ').filter(Boolean));
  const tb = new Set(normalizeText(b).split(' ').filter(Boolean));
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter += 1;
  return inter / (ta.size + tb.size - inter);
}

export function isNearDuplicate(existing, candidate, threshold = 0.92) {
  const fe = itemFingerprint(existing);
  const fc = itemFingerprint(candidate);
  if (fe.id && fc.id && fe.id === fc.id) return true;
  if (fe.slug && fc.slug && fe.slug === fc.slug) return true;
  if (fe.titleKey && fc.titleKey && fe.titleKey === fc.titleKey) return true;
  const enSim = titleSimilarity(existing.title?.en || existing.title, candidate.title?.en || candidate.title);
  const arSim = titleSimilarity(existing.title?.ar || '', candidate.title?.ar || '');
  return enSim >= threshold || arSim >= threshold;
}

export function mergeRecord(existing, candidate) {
  const out = { ...existing };
  for (const [key, value] of Object.entries(candidate)) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'string') {
      if (!out[key] && value) out[key] = value;
      continue;
    }
    if (value && typeof value === 'object' && value.ar !== undefined && value.en !== undefined) {
      const prev = out[key] || {};
      out[key] = {
        ar: (prev.ar && prev.ar.length >= (value.ar?.length || 0)) ? prev.ar : (value.ar || prev.ar || ''),
        en: (prev.en && prev.en.length >= (value.en?.length || 0)) ? prev.en : (value.en || prev.en || ''),
      };
      continue;
    }
    if (Array.isArray(value)) {
      if (!Array.isArray(out[key]) || out[key].length === 0) out[key] = value;
      continue;
    }
    if (out[key] === undefined || out[key] === null || out[key] === '') out[key] = value;
  }
  if ((!out.youtubeId || out.youtubeId.length < 11) && candidate.youtubeId && candidate.youtubeId.length >= 11) {
    out.youtubeId = candidate.youtubeId;
  }
  return out;
}

export async function loadJsonArray(path) {
  try {
    const raw = await readFile(path, 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function loadExisting(name) {
  const live = join(PACKAGE_ROOT, 'src/content', `${name}.json`);
  const generated = join(OUT_DIR, `${name}.json`);
  const a = await loadJsonArray(live);
  const b = await loadJsonArray(generated);
  const { items } = mergeLists(a, b, { preferIncomingOnDuplicate: false });
  return items;
}

export function mergeLists(base, candidates, { preferIncomingOnDuplicate = false } = {}) {
  const result = [...base];
  let added = 0;
  let merged = 0;
  let skipped = 0;
  for (const cand of candidates) {
    const idx = result.findIndex((ex) => isNearDuplicate(ex, cand));
    if (idx === -1) {
      result.push(cand);
      added += 1;
      continue;
    }
    if (preferIncomingOnDuplicate) {
      result[idx] = mergeRecord(cand, result[idx]);
    } else {
      result[idx] = mergeRecord(result[idx], cand);
    }
    merged += 1;
    skipped += 1;
  }
  return { items: result, added, merged, skipped };
}

export function nextNumericSuffix(items, prefix) {
  let max = 0;
  for (const item of items) {
    const m = String(item.id || '').match(new RegExp(`^${prefix}(\\d+)$`));
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max;
}
