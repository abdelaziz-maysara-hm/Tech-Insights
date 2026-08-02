/**
 * Video metadata generator.
 * Uses a curated pool of REAL public educational YouTube IDs (cycled).
 * Never invents random 11-char fakes.
 */
import { VIDEO_TOPICS } from './categories.mjs';
import { distributedDate } from './dates.mjs';
import { bi } from './localization.mjs';
import { pick } from './utils.mjs';

/** Known-good public educational video IDs (FreeCodeCamp / common tutorials). */
const REAL_YOUTUBE_IDS = [
  '3QhU9jd03a0', // networks
  'UB1O30fR-EE', // HTML
  'Tn6-PIqc4UM', // React
  'kqtD5dpn9C8', // Python
  'inWWhr5tnEA', // cybersecurity
  'W6NZfCO5SIk', // JavaScript
  '1Rs2ND1ryYc', // CSS
  'ad79nYk2-go', // AI
  'RGOj5yH7evk', // Git
  'GZvSYJDk-us', // APIs
  'sWbUDq4S6Y8', // Linux
  'HXV3zeQKqGY', // SQL
  'rfscVS0vtbw', // Python full course
  'PkZNo7MFNFg', // JS full course
  'pTB0EiLXUC8', // networking
  'qiQR5rTSshw', // cyber
  'RBSGKlAvoiM', // data structures
  '8hly31xKli0', // algorithms
  'Ke90tMq7zHc', // React
  'SqcY0GlETPk', // React hooks
  'zQnBQ4tB3ZA', // TypeScript
  'ENrzD9HAZK4', // Node.js
  '3c-iBn73dDE', // Docker
  's_o8gLR6OZo', // Kubernetes intro
  'ulprqHHWlng', // AWS
  'tDPoenO39xk', // Azure
  '7Vtl2WggqOg', // GitHub
  'eFOJiThU8SM', // Next.js
  'OPmWbP5pzr4', // PostgreSQL
  'ztKab2ye9BM', // MongoDB
];

const ANGLES_AR = ['مقدمة عملية','شرح للمبتدئين','أخطاء شائعة','أفضل الممارسات','دليل سريع','خطوة بخطوة','مفاهيم أساسية','تطبيق عملي'];
const ANGLES_EN = ['Practical intro','Beginner guide','Common mistakes','Best practices','Quick guide','Step by step','Core concepts','Hands-on walkthrough'];

export function generateVideos({ count = 1000, category, subcategory } = {}) {
  const topics = VIDEO_TOPICS.filter((t) => {
    if (category && t.categoryId !== category) return false;
    if (subcategory && t.subcategoryId !== subcategory) return false;
    return true;
  });
  const pool = topics.length ? topics : VIDEO_TOPICS;
  const items = [];

  for (let i = 0; i < count; i++) {
    const topic = pick(pool, i);
    const angleAr = pick(ANGLES_AR, i);
    const angleEn = pick(ANGLES_EN, i);
    const n = Math.floor(i / pool.length) + 1;
    items.push({
      id: `vid-gen-${String(i + 1).padStart(4, '0')}`,
      title: bi(
        `${topic.topic}: ${angleAr}${n > 1 ? ` (${n})` : ''}`,
        `${topic.topic}: ${angleEn}${n > 1 ? ` (${n})` : ''}`,
      ),
      description: bi(
        `شرح واضح حول ${topic.topic} باللغة العربية يناسب المبتدئين والمتوسطين، مع أمثلة عملية.`,
        `A clear guide to ${topic.topic} for beginners and intermediate learners, with practical examples.`,
      ),
      youtubeId: REAL_YOUTUBE_IDS[i % REAL_YOUTUBE_IDS.length],
      date: distributedDate(i, count),
      categoryId: topic.categoryId,
      subcategoryId: topic.subcategoryId,
    });
  }
  return items;
}
