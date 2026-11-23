/** Generates canonical localized sitemap entries from source content and hreflang policy. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSitemaps } from './sitemap-core.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const { entries, sitemapXml, videoXml, videoCount } = buildSitemaps();
const outputDirectory = join(root, 'public');
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(join(outputDirectory, 'sitemap.xml'), sitemapXml, 'utf8');
writeFileSync(join(outputDirectory, 'video-sitemap.xml'), videoXml, 'utf8');

const arCount = entries.filter((entry) => entry.language === 'ar').length;
const enCount = entries.filter((entry) => entry.language === 'en').length;
const missingLastmod = entries.filter((entry) => !entry.lastmod).length;
console.log(`[sitemap] wrote ${entries.length} canonical URLs (${arCount} ar, ${enCount} en, lastmod-missing=${missingLastmod}) → public/sitemap.xml`);
console.log(`[sitemap] wrote ${videoCount * 2} video entries → public/video-sitemap.xml`);
