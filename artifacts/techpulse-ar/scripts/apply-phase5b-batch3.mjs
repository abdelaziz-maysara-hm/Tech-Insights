#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';

const slug = 'how-large-language-models-work';
const update = {
  title: {
    ar: 'كيف تعمل النماذج اللغوية الكبيرة في بيئات IT: دليل عملي للثقة والمخاطر',
    en: 'How LLMs Work in Enterprise IT: A Practical Guide to Trust and Risk',
  },
  excerpt: {
    ar: 'شرح عملي للـtokens ونافذة السياق وRAG، ولماذا يجب التعامل مع مخرجات LLM كاقتراحات تحتاج إلى أدلة وضوابط أمنية.',
    en: 'A practical explanation of tokens, context windows, and RAG—and why LLM output needs evidence and security controls.',
  },
  body: {
    ar: `## النموذج يولّد نصًا ولا يستعلم تلقائيًا من مصدر موثوق

النموذج اللغوي الكبير يحوّل المدخل إلى وحدات صغيرة تسمى tokens، ثم يقدّر الوحدة التالية اعتمادًا على الأنماط التي تعلمها والسياق المتاح. هذه الآلية ممتازة للتلخيص والصياغة وتصنيف النصوص، لكنها لا تعني أن كل جملة ناتجة حقيقة موثقة. الطلاقة خاصية لغوية، وليست دليلًا على صحة المعلومة.

## ماذا يحدث من السؤال إلى الإجابة

1. **Tokenization:** يُقسَّم النص إلى وحدات قد تكون كلمة أو جزءًا منها أو علامة ترقيم.
2. **Context:** تدخل التعليمات والمحادثة والمستندات المرفقة ضمن نافذة سياق محدودة.
3. **Inference:** يحسب النموذج احتمالات الوحدات التالية ويولّد الاستجابة تدريجيًا.
4. **Sampling:** تؤثر إعدادات الاختيار في تنوع الإجابة، لكنها لا تحول الاحتمال إلى حقيقة.

نافذة السياق ليست ذاكرة دائمة. إذا خرجت معلومة من النافذة أو ضاعت وسط محتوى طويل، قد لا يستخدمها النموذج بصورة موثوقة. كما أن إدخال مستند داخل السياق لا يضمن أن كل سطر فيه سيحصل على الوزن نفسه.

## التدريب لا يساوي الوصول إلى قاعدة بيانات

أثناء التدريب يتعلم النموذج علاقات وأنماطًا من بيانات كثيرة، ثم تُثبَّت أوزانه للاستخدام. لا يحتفظ عادةً بفهرس يمكنه منه إظهار السطر الذي بُنيت عليه كل إجابة. لذلك قد يخلط بين منتجات متشابهة، أو يقترح خيارًا يخص إصدارًا آخر، أو يؤلف مرجعًا يبدو مقنعًا.

بالنسبة لمهندس IT، النتيجة المهمة هي أن اسم command أو registry path أو policy يجب مراجعته في توثيق الإصدار الفعلي قبل التنفيذ.

## أين يختلف RAG عن النموذج وحده

في Retrieval-Augmented Generation يبحث النظام أولًا في مصادر محددة، ثم يضع المقاطع المسترجعة داخل السياق كي يصيغ النموذج إجابة منها. هذا قد يحسن الحداثة وإمكانية الاستشهاد، لكنه لا يلغي الأخطاء. قد يفشل البحث في جلب المستند الصحيح، أو تكون الصلاحيات واسعة، أو يفسر النموذج المقطع بصورة خاطئة.

اختبر RAG على ثلاث طبقات: جودة الاسترجاع، صحة الاستشهاد، وصحة الاستنتاج النهائي. وجود رابط في الإجابة لا يثبت أن الرابط يدعم الادعاء المكتوب.

## حدود الثقة في التشغيل والأمن

تعامل مع المخرجات على أنها فرضية عمل عندما تتضمن تشخيصًا أو إعدادًا أو أمرًا. ابدأ بفحوص القراءة فقط، واطلب فصل الحقائق المرصودة عن الافتراضات. قبل أي تغيير، حدد الهدف والصلاحيات والنطاق والأثر وخطة التراجع، ثم تحقق بقياس واضح بعد التنفيذ.

لا تُرسل كلمات مرور أو tokens أو private keys أو ملفات إعداد كاملة أو بيانات عملاء أو سجلات غير منقحة. سياسات المؤسسة الخاصة بالتصنيف والاحتفاظ ومكان معالجة البيانات تنطبق على أدوات AI مثل أي خدمة خارجية أخرى.

## نموذج تقييم قبل اعتماد الإجابة

- هل ذكرت الإجابة المنتج والإصدار الصحيحين؟
- هل يمكن ربط كل ادعاء مهم بمصدر رسمي أو دليل من البيئة؟
- هل بدأت بفحص غير مغير للحالة؟
- هل أوضحت الصلاحيات والنطاق والمخاطر والتراجع؟
- هل يمكن اختبار التغيير في مختبر أو على هدف محدود؟
- هل توجد نتيجة قابلة للقياس تثبت النجاح أو الفشل؟

## الخلاصة

فهم tokens والسياق والتوليد الاحتمالي وRAG يحدد المكان الصحيح للـLLM في العمل التقني: مساعد سريع للبحث والصياغة وبناء الفرضيات، وليس سلطة تنفيذ. القيمة الحقيقية تأتي من دمجه مع مصادر مضبوطة، وحماية البيانات، ومراجعة بشرية، واختبار قابل للتراجع والتحقق.`,
    en: `## An LLM generates text; it does not automatically query an authority

A large language model turns input into small units called tokens, then estimates the next token from learned patterns and the available context. That mechanism is useful for summarization, drafting, and classification, but it does not make every generated sentence a verified fact. Fluency is a language property, not evidence of correctness.

## From a question to an answer

1. **Tokenization:** text is split into units that may be words, word fragments, or punctuation.
2. **Context:** instructions, conversation history, and supplied documents occupy a finite context window.
3. **Inference:** the model calculates likely next tokens and generates the response incrementally.
4. **Sampling:** selection settings affect variation, but they do not turn probability into truth.

The context window is not permanent memory. Information outside it—or buried in a long input—may not be used reliably. Supplying a document also does not guarantee that every line receives equal attention.

## Training is not a searchable source database

During training, the model learns relationships and patterns from large datasets, and its weights are then used for inference. It normally cannot show a source line for every generated claim. It can therefore combine similar products, suggest an option from another release, or invent a plausible-looking reference.

For an IT engineer, the operational consequence is simple: command names, registry paths, policy settings, and API parameters must be checked against documentation for the deployed release.

## What RAG changes—and what it does not

Retrieval-Augmented Generation searches selected sources and places retrieved passages in the context before the model composes an answer. This can improve freshness and citation, but it does not eliminate error. Retrieval may select the wrong document, permissions may expose excessive material, or the model may misinterpret a correct passage.

Test a RAG system at three layers: retrieval quality, citation support, and the final conclusion. A link beside an answer is not proof that the source supports the stated claim.

## Trust boundaries for operations and security

Treat output as a working hypothesis whenever it contains diagnosis, configuration, or commands. Begin with read-only evidence and require observations to be separated from assumptions. Before a change, identify the target, privilege, scope, impact, rollback, and a measurable post-change check.

Do not submit passwords, tokens, private keys, complete configurations, customer data, or unsanitized logs. Enterprise rules for classification, retention, and processing location apply to AI tools just as they apply to any external service.

## A pre-use review checklist

- Does the answer match the actual product and release?
- Can every important claim be tied to official documentation or environmental evidence?
- Does diagnosis begin with non-destructive checks?
- Are privilege, scope, risk, and rollback explicit?
- Can the action be tested in a lab or on one controlled target?
- Is there an objective result that proves success or failure?

## Bottom line

Tokens, context, probabilistic generation, and RAG explain the proper role of an LLM in technical work: a fast assistant for research, drafting, and hypothesis generation—not an execution authority. Its value depends on controlled sources, data protection, human review, and reversible, verifiable testing.`,
  },
  categoryId: 'cybersecurity',
  subcategoryId: 'concepts',
  tags: ['llm', 'ai-security', 'rag', 'data-privacy', 'technical-validation'],
  readTime: 7,
  domainIds: ['cybersecurity', 'infrastructure'],
  topicIds: ['dlp'],
  contentType: 'concept',
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

console.log(`[phase5b-3] reworked ${slug}`);
