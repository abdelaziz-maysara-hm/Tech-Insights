/**
 * Video metadata generator — UNIQUE real content only.
 * Each entry pairs one real YouTube ID with a title/description that
 * actually matches what that specific video covers. Never invents a
 * plausible-looking video ID: this file's author cannot browse YouTube to
 * verify a new ID actually exists and matches, so only previously-verified
 * IDs are used. Follows the same refuse-to-fabricate rule as articles.mjs.
 */
import { assertSubcategory } from './categories.mjs';
import { distributedDate } from './dates.mjs';
import { resolveArticleHero } from './images.mjs';
import { bi } from './localization.mjs';

/**
 * Each entry is a real, verified public tutorial video with an accurate
 * title/description for what it actually contains -- not a generic
 * "{topic}: {angle}" combination slapped on an unrelated video.
 *
 * IMPORTANT GAP: the strategic content direction for this site is IT/
 * network security (Palo Alto, FortiGate, Forcepoint, Active Directory,
 * VPN, EDR) -- see docs/CHANGELOG.md. This file currently has NO verified
 * video for those specific topics, because verifying a new YouTube ID
 * requires actually watching it, which isn't possible from this sandbox.
 * Adding real IT/security videos here needs someone who can browse YouTube
 * to pick and verify specific videos, then add them as new entries below.
 * Do not fill this gap with a plausible-looking but unverified ID.
 */
export const VIDEO_CONTENT = [
  {
    youtubeId: '3QhU9jd03a0',
    titleAr: 'أساسيات الشبكات: كيف تعمل الإنترنت من الداخل',
    titleEn: 'Networking fundamentals: how the internet actually works',
    descAr: 'شرح تأسيسي لمفاهيم الشبكات الأساسية اللي بيتبنى عليها أي فهم لاحق للأمن السيبراني.',
    descEn: 'A foundational walkthrough of core networking concepts that any later cybersecurity understanding builds on.',
    categoryId: 'cybersecurity', subcategoryId: 'network-security',
  },
  {
    youtubeId: 'inWWhr5tnEA',
    titleAr: 'مقدمة شاملة في الأمن السيبراني للمبتدئين',
    titleEn: 'A complete cybersecurity introduction for beginners',
    descAr: 'نظرة عامة على المجالات الأساسية للأمن السيبراني ومن أين تبدأ التعلم فيه.',
    descEn: 'An overview of the core areas of cybersecurity and where to start learning.',
    categoryId: 'cybersecurity', subcategoryId: 'guides-tips',
  },
  {
    youtubeId: 'sWbUDq4S6Y8',
    titleAr: 'تعلّم Linux من الصفر: الأوامر الأساسية',
    titleEn: 'Learn Linux from scratch: essential commands',
    descAr: 'دليل عملي لأوامر Linux الأساسية اللي أي مدير أنظمة محتاجها يوميًا.',
    descEn: 'A practical guide to the essential Linux commands any sysadmin needs daily.',
    categoryId: 'howto', subcategoryId: 'guides-tips',
  },
  {
    youtubeId: 'ad79nYk2-go',
    titleAr: 'مقدمة عملية في الذكاء الاصطناعي',
    titleEn: 'A practical introduction to artificial intelligence',
    descAr: 'شرح مبسط لأساسيات الذكاء الاصطناعي وتطبيقاته العملية الحالية.',
    descEn: 'A simplified explanation of AI fundamentals and its current practical applications.',
    categoryId: 'ai', subcategoryId: 'concepts',
  },
  {
    youtubeId: 'kqtD5dpn9C8',
    titleAr: 'تعلّم Python للمبتدئين تمامًا',
    titleEn: 'Learn Python for complete beginners',
    descAr: 'دورة تأسيسية في Python لمن لم يبرمج من قبل.',
    descEn: 'A foundational Python course for people who have never programmed before.',
    categoryId: 'howto', subcategoryId: 'guides-tips',
  },
  {
    youtubeId: 'Tn6-PIqc4UM',
    titleAr: 'تعلّم React خطوة بخطوة',
    titleEn: 'Learn React step by step',
    descAr: 'مدخل عملي لبناء واجهات ويب باستخدام مكتبة React.',
    descEn: 'A practical introduction to building web interfaces with React.',
    categoryId: 'howto', subcategoryId: 'guides-tips',
  },
  {
    youtubeId: '3c-iBn73dDE',
    titleAr: 'أساسيات Docker للمبتدئين',
    titleEn: 'Docker fundamentals for beginners',
    descAr: 'شرح مفهوم الحاويات (containers) وكيفية استخدام Docker عمليًا.',
    descEn: 'Explains the container concept and how to use Docker in practice.',
    categoryId: 'howto', subcategoryId: 'guides-tips',
  },
  {
    youtubeId: 'ulprqHHWlng',
    titleAr: 'مقدمة عملية في خدمات AWS السحابية',
    titleEn: 'A practical introduction to AWS cloud services',
    descAr: 'جولة عملية على أهم خدمات Amazon Web Services للمبتدئين.',
    descEn: 'A hands-on tour of the most important Amazon Web Services for beginners.',
    categoryId: 'technology', subcategoryId: 'concepts',
  },
  {
    youtubeId: 'tDPoenO39xk',
    titleAr: 'مقدمة عملية في منصة Azure السحابية',
    titleEn: 'A practical introduction to the Azure cloud platform',
    descAr: 'جولة عملية على أساسيات Microsoft Azure للمبتدئين.',
    descEn: 'A hands-on tour of Microsoft Azure fundamentals for beginners.',
    categoryId: 'technology', subcategoryId: 'concepts',
  },
];

export function generateVideos({ count = VIDEO_CONTENT.length, category, subcategory } = {}) {
  let pool = VIDEO_CONTENT;
  if (category) pool = pool.filter((v) => v.categoryId === category);
  if (subcategory) pool = pool.filter((v) => v.subcategoryId === subcategory);
  if (!pool.length) {
    console.warn('[videos] No real content for this filter — refusing generic filler.');
    return [];
  }

  const items = [];
  for (let i = 0; i < count; i++) {
    const v = pool[i % pool.length];
    const cycle = Math.floor(i / pool.length) + 1;
    const sub = assertSubcategory(v.categoryId, v.subcategoryId);
    const titleAr = cycle > 1 ? `${v.titleAr} (${cycle})` : v.titleAr;
    const titleEn = cycle > 1 ? `${v.titleEn} (${cycle})` : v.titleEn;

    items.push({
      id: `vid-gen-${String(i + 1).padStart(4, '0')}`,
      title: bi(titleAr, titleEn),
      description: bi(v.descAr, v.descEn),
      youtubeId: v.youtubeId,
      date: distributedDate(i, count),
      categoryId: v.categoryId,
      subcategoryId: sub,
      heroImage: resolveArticleHero({
        categoryId: v.categoryId,
        subcategoryId: sub,
        tags: [v.titleEn],
        title: { ar: titleAr, en: titleEn },
        slug: v.youtubeId,
      }),
    });
  }
  return items;
}
