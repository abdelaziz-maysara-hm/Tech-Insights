/** SEO-friendly unique slugs */
const used = new Set();

export function resetSlugs() {
  used.clear();
}

export function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80) || 'item';
}

export function uniqueSlug(base) {
  let s = slugify(base);
  if (!used.has(s)) {
    used.add(s);
    return s;
  }
  let n = 2;
  while (used.has(`${s}-${n}`)) n += 1;
  const out = `${s}-${n}`;
  used.add(out);
  return out;
}
