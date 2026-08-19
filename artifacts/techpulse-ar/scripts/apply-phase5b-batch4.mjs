#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';

const slug = 'how-ai-image-generation-works';
const update = {
  title: {
    ar: 'توليد الصور بالذكاء الاصطناعي في المؤسسات: البيانات والمخاطر وضوابط النشر',
    en: 'Enterprise AI Image Generation: Data, Risk, and Publishing Controls',
  },
  excerpt: {
    ar: 'دليل عملي لاستخدام مولدات الصور داخل المؤسسات مع حماية البيانات، وفحص الملكية، وكشف الانتحال، واعتماد المخرجات قبل النشر.',
    en: 'A practical workflow for protecting data, reviewing rights, detecting impersonation, and approving generated images before publication.',
  },
  body: {
    ar: `## توليد الصورة ليس مجرد كتابة وصف

يبدأ النظام عادةً بنموذج تعلم العلاقة بين النص والخصائص البصرية، ثم يولد صورة جديدة عبر عملية احتمالية متدرجة. بعض المنتجات تضيف تحريرًا لصورة موجودة أو استرجاع أصول مرجعية أو سياسات فلترة. اختلاف المنتج والإصدار والإعدادات يعني أن سلوك الاحتفاظ بالبيانات وحقوق الاستخدام ووسائل التتبع لا يمكن افتراضه من تجربة أداة أخرى.

بالنسبة للمؤسسة، السؤال الأهم ليس «هل الصورة جميلة؟» بل: ما البيانات التي دخلت النظام، وما الحقوق المرتبطة بها، وهل يمكن إساءة فهم الناتج أو استخدامه في انتحال جهة أو شخص؟

## صنّف المدخلات قبل رفعها

قد يكشف prompt واحد اسم عميل أو مشروعًا غير معلن أو تصميم منتج أو تفاصيل موقع داخلي. وقد تحتوي الصورة المرجعية على وجوه أو شاشات أو badges أو metadata لم ينتبه إليها المستخدم. طبّق تصنيف البيانات نفسه المستخدم مع خدمات SaaS الأخرى:

- لا ترفع أسرارًا أو مخططات داخلية أو لقطات من أنظمة إنتاج.
- احذف metadata وافحص الخلفية والحواف قبل استخدام صورة مرجعية.
- استخدم بيانات وأسماء بديلة عند بناء نموذج أولي.
- راجع مكان المعالجة، وفترة الاحتفاظ، وخيار منع استخدام البيانات في التدريب.
- امنع الحسابات الشخصية عندما تتطلب السياسة حسابًا مؤسسيًا وسجل تدقيق.

## افصل بين حق الاستخدام وصحة المحتوى

السماح التجاري في شروط الخدمة لا يثبت ملكية كل عنصر ظاهر، ولا يعالج تلقائيًا العلامات التجارية أو الشبه بشخص حقيقي أو ترخيص الصورة المرجعية. احتفظ بسجل يحتوي على الأداة والإصدار والتاريخ والمدخلات والأصول المرجعية والمراجع القانونية المطلوبة واسم صاحب الاعتماد.

لا تطلب محاكاة فنان حي أو نسخة من هوية بصرية لطرف آخر. استخدم وصفًا للخصائص المطلوبة—مثل الإضاءة والتكوين ولوحة الألوان—مع أصول تملك المؤسسة حق استخدامها.

## مخاطر الانتحال والمحتوى المضلل

يمكن لصورة مقنعة أن تنتحل مسؤولًا تنفيذيًا أو منتجًا أو خبرًا. لا تعتمد على النظر وحده لاكتشاف التزييف؛ مؤشرات الصورة قد تختفي بعد الضغط أو إعادة الالتقاط. اربط النشر بمصدر رسمي، ومراجعة بشرية، ووسم واضح عندما يكون السياق قد يضلل الجمهور.

بالنسبة لفرق الأمن، يجب أن تشمل خطة الاستجابة قناة للإبلاغ عن الصور المنتحلة، وحفظ الأدلة، والتحقق من الحساب أو النطاق الناشر، والتواصل المسبق مع العلاقات العامة والقانونية. لا تحذف الدليل الأصلي قبل توثيق الرابط والتوقيت والملف وhash مناسب.

## مسار اعتماد قابل للتدقيق

1. **حدد الغرض والجمهور:** داخلي، نموذج أولي، إعلان، أو مادة خبرية.
2. **صنف المدخلات:** بيانات عامة فقط أم توجد استثناءات معتمدة؟
3. **ولد في بيئة معتمدة:** حساب مؤسسي وسياسات احتفاظ معلومة.
4. **افحص المخرج:** وجوه، شعارات، نصوص، بيانات حساسة، وادعاءات ضمنية.
5. **راجع الحقوق والسياق:** الأصول المرجعية والاستخدام التجاري واحتمال التضليل.
6. **اعتمد وسجل:** احتفظ بالمصدر والإصدار والمراجع والموافقات.
7. **انشر وتابع:** أضف disclosure مناسبًا وراقب إساءة إعادة الاستخدام.

## اختبارات يجب تنفيذها قبل التوسع

اختبر ما إذا كانت الأداة تحتفظ بالمدخلات، ومن يستطيع رؤية سجل الفريق، وهل يمكن حذف مشروع، وكيف تُصدَّر السجلات، وما الذي يحدث عند تعطيل مستخدم. جرّب حالات رفض متعمدة للتأكد من عمل السياسات، ثم افحص صورة مضغوطة ومنشورة لمعرفة هل تبقى provenance metadata أم لا.

لا تجعل watermark أو metadata خط الدفاع الوحيد؛ يمكن إزالتهما. الأفضل طبقات تشمل سياسة استخدام، وهوية وصول، وسجل اعتماد، وقناة نشر موثوقة، وتوعية الفريق بكيفية التحقق.

## الخلاصة

مولد الصور أداة إنتاج محتوى ضمن سلسلة بيانات وحقوق وثقة. الاستخدام المؤسسي الآمن يبدأ بتقليل المدخلات الحساسة، ويمر بمراجعة الحقوق والانتحال، وينتهي باعتماد مسجل ونشر يمكن التحقق من مصدره.`,
    en: `## Image generation is more than writing a prompt

An image system generally learns relationships between language and visual features, then creates a new image through a probabilistic generation process. Products may also edit supplied images, retrieve reference assets, or apply policy filters. Because retention, usage rights, and provenance features vary by product, release, and account tier, behavior observed in one service must not be assumed in another.

For an enterprise, the primary question is not simply whether the result looks good. It is what data entered the service, which rights apply, and whether the output could mislead an audience or impersonate a person or organization.

## Classify input before upload

A single prompt can disclose a customer name, an unreleased project, a product design, or internal location details. A reference image may contain faces, screens, badges, or metadata that the operator did not notice. Apply the same data-classification rules used for other SaaS services:

- Do not upload secrets, internal diagrams, or production screenshots.
- Remove metadata and inspect backgrounds and edges before using a reference.
- Substitute names and data during prototyping.
- Verify processing location, retention, deletion, and training-use controls.
- Require managed accounts when policy needs identity, access control, and audit logs.

## Separate permission to use from accuracy and ownership

Commercial-use language in service terms does not prove ownership of every visible element. It also does not automatically resolve trademarks, resemblance to a real person, or the license of a reference asset. Keep a record of the service, model or release, date, prompt, references, required legal review, and approving owner.

Avoid asking for a living artist's style or a copy of another company's visual identity. Describe required attributes—lighting, composition, medium, and palette—and use references that the organization is entitled to process.

## Impersonation and misleading-media risk

A plausible image can impersonate an executive, product, or news event. Visual inspection alone is not a reliable detector, and technical indicators may disappear after compression or recapture. Tie publication to an authoritative channel, human approval, and clear disclosure whenever context could mislead the audience.

Security response plans should include a reporting path for synthetic impersonation, evidence preservation, verification of the publishing account or domain, and coordination with communications and legal teams. Preserve the original URL, timestamp, file, and an appropriate hash before takedown activity removes evidence.

## An auditable approval workflow

1. **Define purpose and audience:** internal draft, prototype, advertising, or editorial use.
2. **Classify inputs:** public-only data or a documented exception.
3. **Generate in an approved environment:** managed identity and known retention rules.
4. **Inspect output:** people, logos, text, sensitive details, and implied claims.
5. **Review rights and context:** references, commercial purpose, and deception risk.
6. **Approve and record:** retain source, release, review evidence, and owner.
7. **Publish and monitor:** add suitable disclosure and watch for abusive reuse.

## Tests before wider deployment

Test whether prompts and references are retained, who can see team history, whether a project can be deleted, how logs are exported, and what happens when a user is disabled. Submit intentional policy-test cases to confirm controls operate as expected. Then inspect compressed and republished output to see whether provenance metadata survives.

Do not make a watermark or metadata the only control; both can be removed. Use layers: acceptable-use policy, managed access, approval records, authoritative publishing channels, and staff training on verification.

## Bottom line

An image generator is a content-production component inside a data, rights, and trust chain. Safe enterprise use minimizes sensitive input, reviews ownership and impersonation risk, records approval, and publishes through a source the audience can verify.`,
  },
  categoryId: 'cybersecurity',
  subcategoryId: 'guides-tips',
  tags: ['generative-ai', 'data-privacy', 'deepfake', 'content-provenance', 'governance'],
  readTime: 8,
  domainIds: ['cybersecurity'],
  topicIds: ['dlp'],
  contentType: 'guide',
  vendorIds: [],
  productIds: [],
  difficulty: 'intermediate',
  technicalStatus: 'needs-review',
  translationStatus: 'unreviewed',
};

for (const url of [new URL('../src/content/articles.json', import.meta.url), new URL('../src/content/articles-index.json', import.meta.url)]) {
  const items = JSON.parse(await readFile(url, 'utf8'));
  const item = items.find((entry) => entry.slug === slug);
  if (!item) throw new Error(`Missing ${slug} in ${url.pathname}`);
  Object.assign(item, update);
  if (url.pathname.endsWith('/articles-index.json')) delete item.body;
  await writeFile(url, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
}

console.log(`[phase5b-4] reworked ${slug}`);
