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
  {
    youtubePlaylistId: 'PLxbwE86jKRgMpuZuLBivzlM8s2Dk5lXBQ',
    titleAr: 'دورة CCNA 200-301 كاملة ومجانية',
    titleEn: 'FREE CCNA 200-301 Complete Course',
    descAr: 'سلسلة كاملة ومجانية لتغطية منهج CCNA 200-301 خطوة بخطوة من قناة Jeremy IT Lab.',
    descEn: 'A complete, free playlist covering the CCNA 200-301 syllabus step by step from Jeremy\'s IT Lab.',
    categoryId: 'cybersecurity', subcategoryId: 'network-security',
  },
  {
    youtubeId: 'S7MNX_UD7vY',
    titleAr: 'CCNA مجانًا // اليوم صفر - ما هي الشبكة؟',
    titleEn: 'FREE CCNA // Day 0 - What is a Network?',
    descAr: 'أول حلقة في سلسلة CCNA المجانية من Jeremy IT Lab: شرح مبسط لمفهوم الشبكة من الصفر.',
    descEn: 'The first episode of Jeremy\'s IT Lab free CCNA series: a from-scratch explanation of what a network is.',
    categoryId: 'cybersecurity', subcategoryId: 'network-security',
  },
  {
    youtubeId: 'oIRkXulqJA4',
    titleAr: 'CCNA مجانًا // نموذج OSI',
    titleEn: 'FREE CCNA // OSI Model',
    descAr: 'شرح طبقات نموذج OSI السبع، أساس فهم أي مفهوم شبكات لاحق.',
    descEn: 'An explanation of the seven OSI model layers, foundational to understanding later networking concepts.',
    categoryId: 'cybersecurity', subcategoryId: 'network-security',
  },
  {
    youtubePlaylistId: 'PLIhvC56v63IJVXv0GJcl9vO5Z6znCVb1P',
    titleAr: 'دورة CCNA مجانية من NetworkChuck',
    titleEn: 'FREE CCNA Course by NetworkChuck',
    descAr: 'سلسلة تحضير لشهادة CCNA بأسلوب عملي وممتع من قناة NetworkChuck.',
    descEn: 'A CCNA certification prep playlist with NetworkChuck\'s practical, engaging style.',
    categoryId: 'cybersecurity', subcategoryId: 'network-security',
  },
  {
    youtubePlaylistId: 'PLG49S3nxzAnnOmvg5UGVenB_qQgsh01uC',
    titleAr: 'دورة تحضير شهادة CompTIA Security+ SY0-701',
    titleEn: 'CompTIA Security+ SY0-701 Training Course',
    descAr: 'سلسلة Professor Messer الشهيرة لتحضير امتحان Security+ SY0-701 بشكل مجاني وشامل.',
    descEn: 'Professor Messer\'s well-known free, comprehensive Security+ SY0-701 exam prep playlist.',
    categoryId: 'cybersecurity', subcategoryId: 'guides-tips',
  },
  {
    youtubePlaylistId: 'PLG49S3nxzAnnXcPUJbwikr2xAcmKljbnQ',
    titleAr: 'دورة تحضير شهادة CompTIA Network+',
    titleEn: 'CompTIA Network+ Training Course',
    descAr: 'سلسلة Professor Messer لتحضير امتحان Network+ بشكل مجاني وشامل.',
    descEn: 'Professor Messer\'s free, comprehensive Network+ exam prep playlist.',
    categoryId: 'cybersecurity', subcategoryId: 'network-security',
  },
  {
    youtubeId: 'fNzpcB7ODxQ',
    titleAr: 'دورة الاختراق الأخلاقي العملي الكاملة',
    titleEn: 'Practical Ethical Hacking - Full Course',
    descAr: 'دورة كاملة ومجانية في الاختراق الأخلاقي العملي من TCM Security.',
    descEn: 'A complete, free practical ethical hacking course from TCM Security (The Cyber Mentor).',
    categoryId: 'cybersecurity', subcategoryId: 'guides-tips',
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
  const safeCount = Math.min(count, pool.length);
  if (count > pool.length) {
    console.warn(`[videos] Requested ${count}, but only ${pool.length} real videos exist — capping at ${safeCount} instead of duplicating with (2)/(3) suffixes.`);
  }
  for (let i = 0; i < safeCount; i++) {
    const v = pool[i % pool.length];
    const cycle = Math.floor(i / pool.length) + 1;
    const sub = assertSubcategory(v.categoryId, v.subcategoryId);
    const titleAr = cycle > 1 ? `${v.titleAr} (${cycle})` : v.titleAr;
    const titleEn = cycle > 1 ? `${v.titleEn} (${cycle})` : v.titleEn;

    items.push({
      id: `vid-gen-${String(i + 1).padStart(4, '0')}`,
      title: bi(titleAr, titleEn),
      description: bi(v.descAr, v.descEn),
      youtubeId: v.youtubeId || '',
      youtubePlaylistId: v.youtubePlaylistId || undefined,
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
