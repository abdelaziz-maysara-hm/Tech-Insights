/** Comparison generator matching comparisons.json schema */
import { COMPARISON_PAIRS, COMPARISON_SUBCATEGORIES } from './categories.mjs';
import { distributedDate } from './dates.mjs';
import { deviceImage, heroImage } from './images.mjs';
import { bi } from './localization.mjs';
import { uniqueSlug } from './slugs.mjs';
import { pick } from './utils.mjs';

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

export function generateComparisons({ count = 1000, subcategory } = {}) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const [d1, d2] = pick(COMPARISON_PAIRS, i);
    const sub = subcategory || pick(COMPARISON_SUBCATEGORIES, i);
    const n = Math.floor(i / COMPARISON_PAIRS.length) + 1;
    const titleEn = n > 1 ? `${d1} vs ${d2} (${n})` : `${d1} vs ${d2}`;
    const titleAr = n > 1 ? `${d1} ضد ${d2} (${n})` : `${d1} ضد ${d2}`;
    const scoreShift = i % 3;
    const s1 = 7 + (scoreShift % 3);
    const s2 = 7 + ((scoreShift + 1) % 3);
    const winner = s1 === s2 ? (i % 2 === 0 ? 1 : 2) : s1 > s2 ? 1 : 2;
    items.push({
      id: `cmp-gen-${String(i + 1).padStart(4, '0')}`,
      slug: uniqueSlug(`${d1}-vs-${d2}-${n}`),
      title: bi(titleAr, titleEn),
      excerpt: bi(
        `مقارنة عملية بين ${d1} و ${d2} مع جدول نقاط وخلاصة.`,
        `A practical comparison of ${d1} and ${d2} with scores and a verdict.`,
      ),
      device1Name: d1,
      device2Name: d2,
      device1Image: deviceImage(i, 0),
      device2Image: deviceImage(i, 1),
      date: distributedDate(i, count),
      categoryId: 'comparisons',
      subcategoryId: sub,
      heroImage: heroImage(i),
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
          ? `${d1} الأنسب إن كانت الأولوية للقيمة والاستخدام اليومي؛ ${d2} خيار أقوى في بعض البنود.`
          : `${d2} يتفوق إجمالًا في هذه المقارنة؛ ${d1} يبقى منافسًا إن كان السعر أو التوافق أهم.`,
        winner === 1
          ? `${d1} is the better fit when value and daily use matter most; ${d2} still wins some categories.`
          : `${d2} leads overall in this matchup; ${d1} remains competitive on price or ecosystem fit.`,
      ),
    });
  }
  return items;
}
