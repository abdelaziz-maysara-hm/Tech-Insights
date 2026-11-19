import { readFileSync } from 'node:fs';

/** Reads the independently written Arabic and English bodies for a slug from ./md/. */
export const body = (slug) => ({
  ar: readFileSync(new URL(`./md/${slug}.ar.md`, import.meta.url), 'utf8').trim() + '\n',
  en: readFileSync(new URL(`./md/${slug}.en.md`, import.meta.url), 'utf8').trim() + '\n',
});
export const enBody = (slug) => readFileSync(new URL(`./md/${slug}.en.md`, import.meta.url), 'utf8').trim() + '\n';
