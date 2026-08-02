/** Natural date distribution across years */
export function distributedDate(index, total, startYear = 2022, endYear = 2026) {
  const span = Math.max(1, total);
  const t = index / span;
  const start = Date.UTC(startYear, 0, 1);
  const end = Date.UTC(endYear, 6, 1);
  const ms = start + Math.floor((end - start) * t);
  const d = new Date(ms);
  // jitter day within month
  d.setUTCDate(1 + ((index * 7) % 27));
  return d.toISOString().slice(0, 10);
}
