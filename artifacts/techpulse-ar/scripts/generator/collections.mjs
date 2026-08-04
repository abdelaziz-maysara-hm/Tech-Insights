/**
 * Curated collection pages (best-of lists) — REAL items only.
 * Each collection's itemSlugs references actual articles/comparisons that
 * exist in this repo. A seed topic with no real matching content is simply
 * not generated, rather than shipped as an empty "best of" page.
 */
import { distributedDate } from './dates.mjs';
import { heroImage as heroForTheme, resolveArticleHero } from './images.mjs';
import { bi } from './localization.mjs';
import { uniqueSlug } from './slugs.mjs';

/**
 * itemSlugs must be real slugs from src/content/articles.json or
 * comparisons.json (checked manually against both files when this was
 * written). Only add a new SEED entry once you have real content to put
 * in its itemSlugs -- do not add a topic with itemSlugs: [].
 */
export const COLLECTION_CONTENT = [
  {
    titleEn: 'Best Password Managers', titleAr: 'أفضل مديري كلمات المرور',
    cat: 'cybersecurity', theme: 'security',
    itemSlugs: ['password-manager-start', '1password-vs-bitwarden'],
  },
  {
    titleEn: 'Best Firewalls & NGFW Vendors', titleAr: 'أفضل جدران الحماية (NGFW)',
    cat: 'cybersecurity', theme: 'firewall',
    itemSlugs: [
      'palo-alto-security-policy-basics',
      'palo-alto-ngfw-vs-fortinet-fortigate',
      'palo-alto-ngfw-vs-forcepoint-ngfw',
      'fortinet-fortigate-vs-forcepoint-ngfw',
      'cisco-ftd-vs-palo-alto-ngfw',
      'palo-alto-ngfw-vs-check-point',
      'fortinet-fortigate-vs-sophos-firewall',
    ],
  },
  {
    titleEn: 'Best VPN Setups & Guides', titleAr: 'أفضل أدلة وإعدادات VPN',
    cat: 'cybersecurity', theme: 'vpn',
    itemSlugs: [
      'vpn-basics-what-it-does',
      'forcepoint-ssl-vpn-radius',
      'fortigate-ssl-vpn-checklist',
      'wireguard-vs-openvpn',
    ],
  },
  {
    titleEn: 'Best Cloud Platforms', titleAr: 'أفضل منصات الحوسبة السحابية',
    cat: 'technology', theme: 'cloud',
    itemSlugs: ['aws-vs-azure'],
  },
  {
    titleEn: 'Essential Cybersecurity Basics', titleAr: 'أساسيات الأمن السيبراني الضرورية',
    cat: 'cybersecurity', theme: 'security',
    itemSlugs: [
      '2fa-practical-guide',
      'phishing-spot-before-click',
      'password-manager-start',
      'home-router-security-basics',
    ],
  },
  {
    titleEn: 'Best Endpoint Detection & Response (EDR) Tools', titleAr: 'أفضل أدوات EDR لحماية النقاط الطرفية',
    cat: 'cybersecurity', theme: 'endpoint',
    itemSlugs: [
      'crowdstrike-falcon-vs-microsoft-defender',
      'crowdstrike-falcon-vs-sentinelone',
      'microsoft-defender-vs-sentinelone',
    ],
  },
  {
    titleEn: 'Best Identity & Access Management (IAM) Tools', titleAr: 'أفضل أدوات إدارة الهوية والوصول',
    cat: 'cybersecurity', theme: 'identity',
    itemSlugs: ['ad-powershell-daily-tasks', 'okta-vs-microsoft-entra-id', 'windows-nps-vs-freeradius'],
  },
];

export function generateCollections({ count = COLLECTION_CONTENT.length, category } = {}) {
  let pool = category ? COLLECTION_CONTENT.filter((s) => s.cat === category) : COLLECTION_CONTENT;
  if (!pool.length) {
    console.warn('[collections] No real content for this filter — refusing empty/generic collections.');
    return [];
  }

  const items = [];
  for (let i = 0; i < Math.min(count, pool.length); i++) {
    const seed = pool[i];
    const slug = uniqueSlug(seed.titleEn);
    items.push({
      id: `col-gen-${String(i + 1).padStart(4, '0')}`,
      slug,
      title: bi(seed.titleAr, seed.titleEn),
      description: bi(
        `قائمة منسّقة تضم ${seed.itemSlugs.length} مصادر حقيقية عن ${seed.titleAr}.`,
        `A curated list of ${seed.itemSlugs.length} real resources on ${seed.titleEn.toLowerCase()}.`,
      ),
      categoryId: seed.cat,
      heroImage: seed.theme
        ? resolveArticleHero({ categoryId: seed.cat, theme: seed.theme, title: { ar: seed.titleAr, en: seed.titleEn }, slug })
        : heroForTheme(i),
      date: distributedDate(i, pool.length),
      itemSlugs: seed.itemSlugs,
      isFeatured: i === 0,
    });
  }
  return items;
}
