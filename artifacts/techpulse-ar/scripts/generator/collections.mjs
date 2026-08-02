/**
 * Curated collection pages (best-of lists).
 * Schema is additive JSON for future use — not wired into the site yet.
 */
import { distributedDate } from './dates.mjs';
import { heroImage } from './images.mjs';
import { bi } from './localization.mjs';
import { uniqueSlug } from './slugs.mjs';
import { pick } from './utils.mjs';

const SEEDS = [
  ['Best AI Coding Tools', 'أفضل أدوات البرمجة بالذكاء الاصطناعي', 'ai'],
  ['Best Password Managers', 'أفضل مديري كلمات المرور', 'cybersecurity'],
  ['Best Linux Distros', 'أفضل توزيعات لينكس', 'howto'],
  ['Best IDEs', 'أفضل بيئات التطوير', 'howto'],
  ['Best Firewalls', 'أفضل جدران الحماية', 'cybersecurity'],
  ['Best VPNs', 'أفضل خدمات VPN', 'cybersecurity'],
  ['Best Programming Languages', 'أفضل لغات البرمجة للمبتدئين', 'howto'],
  ['Best Cloud Platforms', 'أفضل منصات الحوسبة السحابية', 'technology'],
  ['Best Cybersecurity Tools', 'أفضل أدوات الأمن السيبراني', 'cybersecurity'],
  ['Best AI Image Generators', 'أفضل مولّدات الصور بالذكاء الاصطناعي', 'ai'],
];

export function generateCollections({ count = 50, category } = {}) {
  const seeds = category ? SEEDS.filter((s) => s[2] === category) : SEEDS;
  const pool = seeds.length ? seeds : SEEDS;
  const items = [];
  for (let i = 0; i < count; i++) {
    const [en, ar, cat] = pick(pool, i);
    const n = Math.floor(i / pool.length) + 1;
    const titleEn = n > 1 ? `${en} (${n})` : en;
    const titleAr = n > 1 ? `${ar} (${n})` : ar;
    items.push({
      id: `col-gen-${String(i + 1).padStart(4, '0')}`,
      slug: uniqueSlug(titleEn),
      title: bi(titleAr, titleEn),
      description: bi(
        `قائمة منسّقة حول ${ar} مع معايير اختيار واضحة.`,
        `A curated list of ${en.toLowerCase()} with clear selection criteria.`,
      ),
      categoryId: cat,
      heroImage: heroImage(i),
      date: distributedDate(i, count),
      itemSlugs: [],
      isFeatured: i % 9 === 0,
    });
  }
  return items;
}
