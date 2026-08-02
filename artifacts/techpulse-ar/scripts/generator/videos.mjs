/**
 * Video metadata generator.
 * Phase 1: titles, descriptions, taxonomy, dates — NO random YouTube IDs.
 * youtubeId left empty for a later linking pass with real IDs.
 */
import { VIDEO_TOPICS } from './categories.mjs';
import { distributedDate } from './dates.mjs';
import { bi } from './localization.mjs';
import { pick } from './utils.mjs';

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
      title: bi(`${topic.topic}: ${angleAr}${n > 1 ? ` (${n})` : ''}`, `${topic.topic}: ${angleEn}${n > 1 ? ` (${n})` : ''}`),
      description: bi(
        `شرح واضح حول ${topic.topic} باللغة العربية يناسب المبتدئين والمتوسطين، مع أمثلة عملية.`,
        `A clear guide to ${topic.topic} for beginners and intermediate learners, with practical examples.`,
      ),
      youtubeId: '',
      date: distributedDate(i, count),
      categoryId: topic.categoryId,
      subcategoryId: topic.subcategoryId,
    });
  }
  return items;
}
