#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';

const slug = 'chatgpt-study-without-harm';
const update = {
  title: {
    ar: 'استخدام مساعدات الذكاء الاصطناعي في التدريب التقني بأمان: دليل عملي',
    en: 'Using AI Assistants Safely for Technical Training: A Practical Guide',
  },
  excerpt: {
    ar: 'منهج عملي للاستفادة من مساعدات AI في تعلّم الشبكات والأمن وإدارة الأنظمة دون تسريب بيانات أو تنفيذ أوامر غير موثوقة.',
    en: 'A practical workflow for learning networking, security, and systems administration with AI without leaking data or running unverified commands.',
  },
  body: {
    ar: `## الهدف: مساعد للتعلّم وليس مصدرًا للحقيقة

مساعد الذكاء الاصطناعي يمكنه شرح مفهوم، اقتراح خطوات تشخيص، أو إنشاء أسئلة تدريبية بسرعة. لكنه قد يخلط بين إصدارات المنتجات، يقترح أمرًا غير مناسب لبيئتك، أو يعرض إعدادًا يبدو صحيحًا لغويًا لكنه خطر تشغيليًا. لذلك يجب أن يبقى المرجع النهائي هو توثيق الشركة المصنّعة، وسياسة المؤسسة، ونتيجة الاختبار داخل بيئة معزولة.

## ابدأ بتصنيف البيانات قبل كتابة السؤال

لا ترسل كلمات مرور أو مفاتيح API أو رموز وصول أو ملفات إعداد حقيقية. احذف كذلك عناوين IP العامة، أسماء العملاء، أسماء الأجهزة، أرقام التذاكر، البريد الداخلي، وأي سجل قد يحتوي على بيانات شخصية. استبدل القيم الحساسة بأمثلة واضحة مثل SERVER-A و10.0.0.10 وexample.com.

إذا كان المطلوب لا يمكن شرحه دون مشاركة بيانات حقيقية، استخدم أداة معتمدة من المؤسسة وفق سياسة الاحتفاظ بالبيانات والتحكم الإداري، أو لا تستخدم مساعدًا خارجيًا أصلًا.

## سير عمل آمن من خمس خطوات

### 1. اطلب تفسيرًا لا أمرًا أعمى

ابدأ بسؤال يطلب شرح الفكرة والافتراضات والمخاطر. مثال: «اشرح لماذا قد يفشل DNS resolution، ثم اقترح ترتيبًا للتشخيص دون تغيير الإعدادات».

### 2. اطلب مصادر تحقق

اطلب أسماء صفحات التوثيق أو المصطلحات الرسمية التي يجب البحث عنها، ثم افتح المصدر الرسمي بنفسك. لا تعتمد على رابط مولّد قبل التأكد من النطاق والمحتوى.

### 3. راجع تأثير كل أمر

قبل التنفيذ، حدّد هل الأمر للقراءة فقط أم يغير الحالة. راجع الصلاحيات المطلوبة، النطاق المستهدف، إمكانية التراجع، وتأثيره على الجلسات أو الشبكة أو البيانات.

### 4. اختبر في مختبر معزول

استخدم VM أو tenant تجريبيًا أو نسخة إعداد منزوعة الحساسية. خذ snapshot أو backup مناسبًا، وشغّل التغيير على حالة صغيرة قبل تعميمه.

### 5. وثّق وتحقق بعد التنفيذ

سجّل الأمر الفعلي والوقت والنتيجة وخطوة التراجع. تحقق بقياس واضح: هل عاد الاسم إلى resolution؟ هل انخفض الخطأ؟ هل ما زالت الخدمات والمراقبة تعمل؟

## قالب سؤال مفيد لمهندس أو مسؤول أنظمة

اكتب السياق غير الحساس، الهدف، القيود، وما جربته. ثم اطلب: افتراضات الحل، خطوات قراءة فقط أولًا، المخاطر، طريقة التحقق، وخطة التراجع. هذا القالب يجعل الإجابة قابلة للمراجعة بدل أن تكون قائمة أوامر مبهمة.

## علامات تستدعي التوقف

توقف إذا اقترحت الإجابة تعطيل الحماية، حذف بيانات، تغيير firewall rule واسعة، تشغيل سكربت مجهول بصلاحيات مرتفعة، أو تجاوز سياسة الترخيص. وتوقف أيضًا عندما يذكر المساعد خيارًا غير موجود في إصدارك؛ اختلاف الإصدار أو الترخيص قد يغيّر الخطوات بالكامل.

## قائمة مراجعة سريعة

- البيانات منزوعة الحساسية.
- المصدر الرسمي مفتوح للمقارنة.
- الأوامر وتأثيرها مفهومون.
- الاختبار تم في بيئة غير إنتاجية.
- توجد خطة تراجع ونسخة احتياطية عند الحاجة.
- النتيجة تم قياسها، لا افتراضها.

## الخلاصة

أفضل استخدام للذكاء الاصطناعي في التدريب التقني هو تسريع الفهم وبناء سيناريوهات اختبار ومراجعة الفرضيات. لا تمنحه أسرار البيئة، ولا تنفذ مخرجاته مباشرة على الإنتاج، ولا تعتبر صياغة واثقة دليلًا على الصحة التقنية.`,
    en: `## The goal: a learning assistant, not a source of truth

An AI assistant can explain a concept, suggest a diagnostic sequence, or create practice questions quickly. It can also mix product versions, propose a command that does not fit your environment, or present a configuration that sounds plausible but is operationally unsafe. Vendor documentation, organizational policy, and results from an isolated test environment must remain authoritative.

## Classify the data before writing the prompt

Never submit passwords, API keys, access tokens, or real configuration files. Remove public IP addresses, customer and host names, ticket numbers, internal email addresses, and logs containing personal data. Replace sensitive values with explicit placeholders such as SERVER-A, 10.0.0.10, and example.com.

If a task cannot be described without real data, use only an organization-approved system with appropriate retention and administrative controls, or do not use an external assistant.

## A safe five-step workflow

### 1. Ask for reasoning, not a blind command

Start by requesting the concept, assumptions, and risks. For example: “Explain why DNS resolution might fail, then propose a read-only diagnostic order before changing configuration.”

### 2. Request verification paths

Ask for the official documentation topics or product terminology you should verify, then open the vendor source yourself. Do not trust a generated link until you confirm its domain and content.

### 3. Review the effect of every command

Determine whether each command is read-only or state-changing. Check required privileges, target scope, rollback options, and possible effects on sessions, network access, and data.

### 4. Test in an isolated lab

Use a VM, test tenant, or sanitized configuration. Take an appropriate snapshot or backup and apply the change to a small test case before considering broader deployment.

### 5. Record and verify the result

Document the command actually used, execution time, result, and rollback step. Verify with an observable outcome: did name resolution recover, did the error stop, and do services and monitoring still work?

## A useful prompt structure for technical work

Provide non-sensitive context, the desired outcome, constraints, and what you already tested. Request assumptions, read-only checks first, risks, verification steps, and rollback guidance. This produces an answer that can be reviewed instead of an unexplained command list.

## Stop conditions

Stop if a response proposes disabling protection, deleting data, opening a broad firewall rule, running an unknown elevated script, or bypassing licensing policy. Also stop when it references an option absent from your version; product release and license differences can change the correct procedure completely.

## Quick checklist

- Data is sanitized.
- Official documentation is open for comparison.
- Commands and their effects are understood.
- Testing occurs outside production.
- A rollback path and backup exist when needed.
- The outcome is measured rather than assumed.

## Bottom line

The strongest use of AI in technical training is accelerating understanding, building lab scenarios, and challenging assumptions. Do not expose environment secrets, execute output directly in production, or mistake confident wording for technical correctness.`,
  },
  categoryId: 'cybersecurity',
  subcategoryId: 'guides-tips',
  tags: ['ai-security', 'technical-training', 'data-privacy', 'change-safety'],
  readTime: 7,
  domainIds: ['cybersecurity', 'infrastructure'],
  topicIds: ['dlp'],
  contentType: 'guide',
  vendorIds: [],
  productIds: [],
  difficulty: 'beginner',
  technicalStatus: 'needs-review',
  translationStatus: 'unreviewed',
};

const contentUrls = [
  new URL('../src/content/articles.json', import.meta.url),
  new URL('../src/content/articles-index.json', import.meta.url),
];

for (const url of contentUrls) {
  const items = JSON.parse(await readFile(url, 'utf8'));
  const item = items.find((entry) => entry.slug === slug);
  if (!item) throw new Error(`Missing ${slug} in ${url.pathname}`);
  Object.assign(item, update);
  if (url.pathname.endsWith('/articles-index.json')) delete item.body;
  await writeFile(url, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
}

console.log(`[phase5b-1] reworked ${slug}`);
