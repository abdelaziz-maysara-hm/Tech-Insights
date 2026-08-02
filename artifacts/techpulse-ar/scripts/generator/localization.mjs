/** Bilingual field helpers */
export function bi(ar, en) {
  return { ar: String(ar).trim(), en: String(en).trim() };
}

export function assertBi(value, label) {
  if (!value || typeof value.ar !== 'string' || typeof value.en !== 'string') {
    throw new Error(`${label} must be { ar, en }`);
  }
  if (!value.ar.trim() || !value.en.trim()) {
    throw new Error(`${label} ar/en must be non-empty`);
  }
}
