#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';

const slug = 'effective-ai-prompting-guide';
const update = {
  title: {
    ar: 'صياغة طلبات AI للتشخيص التقني بأمان: قالب عملي للمهندسين',
    en: 'Writing Safe AI Prompts for Technical Troubleshooting: An Engineer’s Template',
  },
  excerpt: {
    ar: 'قالب تشخيص منظم يفصل الحقائق عن الافتراضات، يبدأ بفحوص القراءة فقط، ويطلب مخاطر التنفيذ والتحقق وخطة التراجع.',
    en: 'A structured diagnostic prompt that separates facts from assumptions, starts read-only, and requires risks, verification, and rollback.',
  },
  body: {
    ar: `## لماذا السؤال العام ينتج إجابة خطرة

طلب مثل «الـVPN لا يعمل، أعطني الحل» لا يحدد المنتج أو الإصدار أو موضع الفشل أو ما تغير مؤخرًا. النتيجة غالبًا قائمة تخمينات وقد تتضمن أمرًا يغير الحالة قبل جمع الأدلة. في بيئة إنتاجية، جودة السؤال جزء من إدارة المخاطر وليست مجرد تحسين لصياغة الإجابة.

## افصل الحقائق عن الافتراضات

ابدأ بقسم للحقائق المرصودة: رسالة الخطأ حرفيًا بعد إزالة البيانات الحساسة، وقت بدء المشكلة، النطاق المتأثر، آخر تغيير معروف، والاختبارات التي نجحت أو فشلت. بعده اكتب الافتراضات بصراحة، مثل «أشتبه في DNS لكن لم أتحقق». هذا يمنع المساعد من التعامل مع التخمين كأنه حقيقة.

## القالب العملي

استخدم الأقسام التالية:

1. **الهدف:** النتيجة المطلوبة دون افتراض الحل.
2. **البيئة:** المنتج والإصدار ونظام التشغيل والبنية ذات الصلة، بلا أسرار.
3. **الأعراض:** الخطأ والنطاق والتوقيت والسلوك المتوقع مقابل الفعلي.
4. **التغييرات:** ما تم نشره أو تعديله قبل ظهور المشكلة.
5. **ما تم اختباره:** الأوامر والنتائج الفعلية، لا عبارة «جربت كل شيء».
6. **القيود:** لا توقف خدمة، لا تغيّر firewall، أو لا توجد نافذة صيانة.
7. **شكل الإجابة:** فرضيات مرتبة، فحوص قراءة فقط، ثم إجراءات تغيير منفصلة.

## اطلب عقدًا واضحًا للإجابة

اطلب من المساعد أن يذكر لكل فرضية: الدليل المؤيد، اختبارًا يثبتها أو يستبعدها، النتيجة المتوقعة، وما الذي يعنيه كل مخرج. اطلب تمييز الأوامر التي تغير الحالة بعلامة واضحة، وذكر الصلاحيات والنطاق والأثر وخطوة التراجع.

## مثال مختصر

«الهدف استعادة name resolution لخادم واحد. Windows Server 2022، والعملاء في subnet واحدة. الخطأ DNS name does not exist، بينما ping بالعنوان يعمل. لم يحدث تغيير مقصود، وResolve-DnsName يفشل من عميلين. لا تغيّر الإعدادات الآن. رتّب ثلاث فرضيات، ثم أعطني فحوص قراءة فقط لكل فرضية، والنتائج المتوقعة، والمعلومة الناقصة التي تحتاجها.»

هذا أفضل من طلب حل مباشر لأنه يبني مسارًا يمكن إيقافه ومراجعته عند كل خطوة.

## لا ترسل هذه البيانات

احذف كلمات المرور والمفاتيح والـtokens وملفات الإعداد الكاملة وعناوين العملاء وأسماء الأجهزة الحقيقية والسجلات التي تحتوي بيانات شخصية. استخدم قيمًا بديلة، ولا تحاول «إخفاء» السر جزئيًا؛ الجزء المتبقي قد يظل حساسًا.

## راجع الإجابة قبل التنفيذ

قارن أسماء الخيارات والأوامر بتوثيق الإصدار الفعلي. تأكد أن الأمر يعمل على الهدف المقصود وليس كل الأجهزة، وأن لديك backup أو snapshot مناسبًا عند الحاجة. ابدأ بمختبر أو حالة واحدة، ثم تحقق بقياس محدد قبل التوسع.

## الخلاصة

الطلب التقني الجيد لا يطلب حلًا واثقًا؛ بل يطلب مسار تشخيص قابلًا للإثبات. حقائق واضحة، افتراضات معلنة، فحوص قراءة فقط، مخاطر وتراجع، ثم تحقق موضوعي—هذا ما يجعل AI مساعدًا مفيدًا بدل مولّد أوامر غير موثوقة.`,
    en: `## Why a vague prompt can produce an unsafe answer

“The VPN is broken; give me the fix” omits the product, release, failure boundary, and recent changes. The response will likely be a list of guesses and may change state before collecting evidence. In production operations, prompt quality is part of risk management, not merely writing style.

## Separate observations from assumptions

Start with observed facts: the exact sanitized error, when it began, affected scope, last known change, and tests that passed or failed. Put assumptions in a separate section, such as “DNS is suspected but not verified.” This prevents a hypothesis from being treated as evidence.

## A practical prompt structure

Use these sections:

1. **Objective:** the desired outcome without prescribing the solution.
2. **Environment:** relevant product, version, operating system, and architecture without secrets.
3. **Symptoms:** error, scope, timing, expected behavior, and actual behavior.
4. **Changes:** deployments or configuration changes before the incident.
5. **Tests performed:** commands and observed outputs, not “tried everything.”
6. **Constraints:** no outage, no firewall change, or no maintenance window.
7. **Response contract:** ranked hypotheses, read-only checks first, and state-changing actions separated.

## Require an evidence contract

For each hypothesis, request supporting evidence, a test that confirms or rejects it, the expected result, and how to interpret each outcome. Require state-changing commands to be labeled and accompanied by privileges, scope, impact, and rollback guidance.

## Short example

“Objective: restore name resolution for one server. Environment: Windows Server 2022; clients share one subnet. Symptom: DNS name does not exist, while ping by IP works. No intentional change; Resolve-DnsName fails from two clients. Do not change configuration yet. Rank three hypotheses, provide read-only checks and expected results for each, and list any missing information.”

This is safer than requesting an immediate fix because every step can be reviewed or stopped.

## Data that must stay out of the prompt

Remove passwords, keys, tokens, complete configuration files, customer addresses, real host names, and logs containing personal data. Use explicit placeholders. Partial masking is not automatically safe because the remaining context may still identify a system or secret.

## Review before execution

Compare option names and commands with documentation for the deployed release. Confirm the target scope, and prepare an appropriate backup or snapshot when needed. Test in a lab or on one controlled case, then measure the result before expanding the change.

## Bottom line

A strong technical prompt does not ask for a confident answer; it asks for a falsifiable diagnostic path. Clear facts, declared assumptions, read-only evidence, risk and rollback details, and objective verification turn AI into a useful assistant instead of an untrusted command generator.`,
  },
  categoryId: 'cybersecurity',
  subcategoryId: 'guides-tips',
  tags: ['ai-security', 'troubleshooting', 'change-safety', 'data-privacy'],
  readTime: 7,
  domainIds: ['cybersecurity', 'infrastructure', 'troubleshooting'],
  topicIds: ['dlp'],
  contentType: 'troubleshooting',
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

console.log(`[phase5b-2] reworked ${slug}`);
