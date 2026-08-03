/** Comparison generator — correct subcategory + logo/thematic images */
import { assertSubcategory, COMPARISON_CATALOG } from './categories.mjs';
import { distributedDate } from './dates.mjs';
import { resolveComparisonImages } from './images.mjs';
import { bi } from './localization.mjs';
import { uniqueSlug } from './slugs.mjs';

function spec(labelAr, labelEn, v1Ar, v1En, v2Ar, v2En, s1, s2, winner) {
  return {
    label: bi(labelAr, labelEn),
    device1Value: bi(v1Ar, v1En),
    device2Value: bi(v2Ar, v2En),
    device1Score: s1,
    device2Score: s2,
    winner,
  };
}

export function generateComparisons({ count = 30, subcategory, startIndex = 0 } = {}) {
  let catalog = COMPARISON_CATALOG;
  if (subcategory) catalog = catalog.filter((c) => c.sub === subcategory);
  if (!catalog.length) catalog = COMPARISON_CATALOG;

  const items = [];
  for (let i = 0; i < count; i++) {
    const abs = startIndex + i;
    const row = catalog[abs % catalog.length];
    const cycle = Math.floor(abs / catalog.length) + 1;
    const { d1, d2, img1, img2 } = row;
    const sub = assertSubcategory('comparisons', row.sub);

    const titleEn = cycle > 1 ? `${d1} vs ${d2} (${cycle})` : `${d1} vs ${d2}`;
    const titleAr = cycle > 1 ? `${d1} ضد ${d2} (${cycle})` : `${d1} ضد ${d2}`;
    const s1 = 7 + (abs % 3);
    const s2 = 7 + ((abs + 1) % 3);
    const winner = s1 === s2 ? (abs % 2 === 0 ? 1 : 2) : s1 > s2 ? 1 : 2;

    const images = resolveComparisonImages({
      device1Name: d1,
      device2Name: d2,
      img1,
      img2,
      subcategoryId: sub,
    });

    items.push({
      id: `cmp-gen-${String(abs + 1).padStart(4, '0')}`,
      slug: uniqueSlug(`${d1}-vs-${d2}-${cycle}`),
      title: bi(titleAr, titleEn),
      excerpt: bi(
        `مقارنة عملية بين ${d1} و ${d2} مع جدول نقاط وخلاصة واضحة.`,
        `A practical comparison of ${d1} and ${d2} with scores and a clear verdict.`,
      ),
      device1Name: d1,
      device2Name: d2,
      device1Image: images.device1Image,
      device2Image: images.device2Image,
      date: distributedDate(abs, Math.max(count + startIndex, 1)),
      categoryId: 'comparisons',
      subcategoryId: sub,
      heroImage: images.heroImage,
      overallWinner: winner,
      specs: {
        display: spec('الشاشة / العرض', 'Display', 'جيد جدًا', 'Very good', 'ممتاز', 'Excellent', s1, s2, s1 >= s2 ? 1 : 2),
        performance: spec('الأداء', 'Performance', 'قوي', 'Strong', 'قوي جدًا', 'Very strong', s2, s1, s2 >= s1 ? 2 : 1),
        battery: spec('البطارية / الاستمرارية', 'Battery / endurance', 'يوم كامل', 'All-day', 'يوم+', 'All-day+', 8, 8, 1),
        camera: spec('الجودة / المرونة', 'Quality / flexibility', 'مرن', 'Flexible', 'ثابت', 'Consistent', 8, 9, 2),
        price: spec('القيمة', 'Value', 'متوسطة', 'Fair', 'مرتفعة', 'Premium', 8, 6, 1),
      },
      verdict: bi(
        winner === 1
          ? `${d1} الأنسب لمعظم المستخدمين من حيث القيمة والاستخدام اليومي.`
          : `${d2} يتفوق إجمالًا في هذه المقارنة لمعظم سيناريوهات الاستخدام.`,
        winner === 1
          ? `${d1} is the better fit for most people on value and daily use.`
          : `${d2} leads overall for most real-world scenarios.`,
      ),
    });
  }
  return items;
}
