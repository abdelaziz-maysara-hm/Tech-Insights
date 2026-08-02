/** Long-form article generator matching articles.json schema */
import { ARTICLE_CATEGORIES } from './categories.mjs';
import { distributedDate } from './dates.mjs';
import { heroImage } from './images.mjs';
import { bi } from './localization.mjs';
import { uniqueSlug } from './slugs.mjs';
import { pick } from './utils.mjs';

const TOPICS = {
  cybersecurity: ['2FA', 'Password managers', 'Phishing', 'Home router security', 'VPN basics'],
  mobile: ['Battery saving', 'Storage cleanup', 'Overheating', 'App permissions', 'Backup'],
  laptops: ['SSD upgrade', 'Fan noise', 'Student laptop specs', 'Heat management', 'Battery health'],
  howto: ['Factory reset checklist', 'Speed test correctly', 'PC backup 3-2-1', 'Router placement', 'Update apps safely'],
  ai: ['ChatGPT for studying', 'Local vs cloud AI', 'AI image safety', 'Prompting tips', 'AI for email'],
  reviews: ['Phone checklist', 'Earbuds buying guide', 'Monitor for work', 'Power bank guide', 'Keyboard picks'],
  windows: ['Startup apps', 'Update stuck', 'Disk cleanup', 'Defender enough', 'Clipboard history'],
  comparisons: ['Android vs iPhone', 'SSD vs HDD', 'Chrome vs Firefox', 'Tablet vs laptop', 'Drive vs OneDrive'],
  technology: ['What is RAM', 'CPU vs GPU', 'Cloud storage', 'Wi-Fi 6', 'Smart home start'],
};

function body(topic, cat) {
  const ar = [
    `## لماذا يهمك؟`,
    ``,
    `موضوع ${topic} يظهر كثيرًا في الاستخدام اليومي ضمن مجال ${cat}. فهم الأساسيات يوفّر وقتًا ويقلل القرارات الخاطئة.`,
    ``,
    `## خطوات عملية`,
    ``,
    `1. حدد هدفك بوضوح قبل أي تغيير.`,
    `2. خذ نسخة احتياطية إن كان الأمر يمس ملفات أو إعدادات.`,
    `3. طبّق تعديلًا واحدًا ثم اختبر النتيجة.`,
    `4. وثّق ما نجح لتعود إليه لاحقًا.`,
    ``,
    `## أخطاء شائعة`,
    ``,
    `- التسرع بدون نسخة احتياطية.`,
    `- تحميل أدوات من مصادر غير موثوقة.`,
    `- إهمال التحديثات الأمنية.`,
    ``,
    `## أفضل الممارسات`,
    ``,
    `اعتمد مصادر رسمية، وراجع الصلاحيات، وأبقِ النظام محدّثًا. في المواضيع الحساسة أمنيًا لا تعتمد على إشاعة واحدة.`,
    ``,
    `## الخلاصة`,
    ``,
    `ابدأ بخطوة صغيرة قابلة للقياس اليوم، ثم وسّع التحسين تدريجيًا.`,
  ].join('\n');
  const en = [
    `## Why it matters`,
    ``,
    `${topic} shows up often in daily ${cat} workflows. Solid basics save time and prevent poor decisions.`,
    ``,
    `## Practical steps`,
    ``,
    `1. Define the goal before changing anything.`,
    `2. Back up if files or settings are involved.`,
    `3. Apply one change, then verify.`,
    `4. Note what worked so you can reuse it.`,
    ``,
    `## Common mistakes`,
    ``,
    `- Rushing without a backup.`,
    `- Installing tools from untrusted sources.`,
    `- Skipping security updates.`,
    ``,
    `## Best practices`,
    ``,
    `Prefer official sources, review permissions, and keep systems updated. For security topics, do not rely on a single rumor.`,
    ``,
    `## Takeaways`,
    ``,
    `Start with one measurable step today, then improve incrementally.`,
  ].join('\n');
  return bi(ar, en);
}

export function generateArticles({ count = 100, category } = {}) {
  const cats = category ? [category] : ARTICLE_CATEGORIES;
  const items = [];
  for (let i = 0; i < count; i++) {
    const cat = pick(cats, i);
    const topicList = TOPICS[cat] || TOPICS.technology;
    const topic = pick(topicList, i);
    const n = Math.floor(i / topicList.length) + 1;
    const titleEn = n > 1 ? `${topic}: practical guide (${n})` : `${topic}: practical guide`;
    const titleAr = n > 1 ? `${topic}: دليل عملي (${n})` : `${topic}: دليل عملي`;
    const slug = uniqueSlug(titleEn);
    const bodyBi = body(topic, cat);
    const words = bodyBi.en.split(/\s+/).length;
    items.push({
      id: `art-gen-${String(i + 1).padStart(4, '0')}`,
      slug,
      title: bi(titleAr, titleEn),
      excerpt: bi(
        `دليل عملي مختصر حول ${topic} مع خطوات وأخطاء شائعة.`,
        `A practical guide to ${topic} with steps and common mistakes.`,
      ),
      body: bodyBi,
      categoryId: cat,
      author: {
        name: bi('فريق رؤى تقنية', 'Technical Insights Team'),
        avatar: '',
      },
      date: distributedDate(i, count),
      readTime: Math.max(3, Math.round(words / 200)),
      heroImage: heroImage(i),
      tags: [cat, topic.split(' ')[0].toLowerCase(), 'guide'],
      isFeatured: i % 11 === 0,
      isTrending: i % 7 === 0,
    });
  }
  return items;
}
