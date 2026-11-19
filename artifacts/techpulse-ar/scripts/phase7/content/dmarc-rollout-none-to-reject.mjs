export default {
  slug: 'dmarc-rollout-none-to-reject',
  categoryId: 'cybersecurity',
  subcategoryId: 'guides-tips',
  tags: ['dmarc', 'spf', 'dkim', 'email-security', 'dns'],
  domainIds: ['cybersecurity'],
  topicIds: ['dns'],
  contentType: 'guide',
  vendorIds: ['microsoft', 'google'],
  productIds: [],
  title: {
    ar: 'تطبيق DMARC من p=none إلى p=reject: خطة مرحلية',
    en: 'Rolling Out DMARC from p=none to p=reject: A Phased Plan',
  },
  excerpt: {
    ar: 'خطة عملية من أربع مراحل: الجرد والمراقبة، إصلاح المحاذاة، quarantine بنسبة تدريجية، ثم reject، مع أمثلة سجلات DNS وأخطاء شائعة.',
    en: 'A practical four-phase plan: inventory and monitoring, fixing alignment, gradual quarantine, then reject — with DNS record examples and common pitfalls.',
  },
  body: {
    ar: `## لماذا لا تقفز مباشرة إلى p=reject؟

لأن معظم المؤسسات لا تعرف كل الخدمات التي ترسل بريدًا باسمها: منصة التسويق، ونظام التذاكر، والفوترة، وأجهزة الطباعة الضوئية، وتطبيقات قديمة. سياسة reject قبل اكتشافها جميعًا تعني رفض فواتيرك أو إشعاراتك لدى العملاء. الخطة المرحلية تحميك من ذلك. إذا كنت جديدًا على المفاهيم فابدأ بـ[دليل أمن البريد المؤسسي](/article/enterprise-email-security-guide).

## المرحلة 1: المراقبة (p=none) — من أسبوعين إلى شهرين

انشر سجلًا يجمع التقارير دون أن يؤثر على التسليم:

\`\`\`text
_dmarc.example.com.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc@example.com; fo=1"
\`\`\`

- **rua:** عنوان يستقبل التقارير التجميعية اليومية (XML). إذا كان العنوان على نطاق آخر، يجب أن ينشر ذلك النطاق سجل تفويض خاصًا لاستقبال التقارير.
- **fo=1:** يطلب تقارير فشل إذا فشل SPF أو DKIM، لكن كثيرًا من المزودين لا يرسلون تقارير الفشل التفصيلية لأسباب الخصوصية.
- استخدم أداة تحليل للتقارير بدل قراءة XML يدويًا.

افحص السجل بأداة [محلل سجل DMARC](/tools/dmarc-record-analyzer).

## المرحلة 2: الجرد وإصلاح المحاذاة

من التقارير، صنّف كل مصدر إرسال:

| التصنيف | الإجراء |
|---|---|
| خدمة شرعية تنجح في المحاذاة | لا شيء |
| خدمة شرعية تفشل | فعّل DKIM بنطاقك عليها، أو أضفها إلى SPF مع نطاق Return-Path مخصص |
| إعادة توجيه أو قوائم بريدية | عادة تنجح بـDKIM؛ تأكد أن DKIM مفعل |
| مصدر غير معروف | تحقق داخليًا؛ إن لم يكن شرعيًا فهو ما ستمنعه السياسة |

نصائح:

- **DKIM أولًا:** المحاذاة عبر DKIM أكثر صمودًا من SPF لأنها تنجو من إعادة التوجيه.
- **انتبه لحد العشرة استعلامات في SPF** عند إضافة الخدمات. افحص بـ[محلل سجل SPF](/tools/spf-record-analyzer).
- **النطاقات الفرعية:** وسم sp يحدد سياسة النطاقات الفرعية؛ إذا لم يُحدد، ترث النطاقات الفرعية سياسة النطاق الرئيسي.

## المرحلة 3: الحجر التدريجي (quarantine)

عندما تصل نسبة الرسائل الشرعية الناجحة إلى ما يقارب 100٪ لعدة أسابيع، انشر السياسة مع وسم الاختبار أولًا:

\`\`\`text
_dmarc.example.com.  TXT  "v=DMARC1; p=quarantine; t=y; rua=mailto:dmarc@example.com"
\`\`\`

- في **RFC 9989** (مايو 2026، الذي حل محل RFC 7489) أُزيل وسم **pct** وحل محله وسم الاختبار **t**. مع \`t=y\` يطبق المستقبِل سياسة أدنى بدرجة: \`quarantine\` تُعامل كـ\`none\`، و\`reject\` تُعامل كـ\`quarantine\`، مع استمرار التقارير.
- راقب التقارير أسبوعين على الأقل، ثم احذف \`t=y\` (أو اجعله \`t=n\`) لتطبيق quarantine فعليًا.
- السبب الرسمي للإزالة: التطبيق الفعلي لقيم pct بين 0 و100 لم يكن دقيقًا عند المستقبلين. بعض المستقبلين قد يظلون يقرؤون \`pct\` القديم، لكن لا تبنِ خطة التدرج عليه.

## المرحلة 4: الرفض (reject)

\`\`\`text
_dmarc.example.com.  TXT  "v=DMARC1; p=reject; rua=mailto:dmarc@example.com"
\`\`\`

بعد التطبيق، استمر في مراقبة التقارير؛ أي خدمة جديدة يضيفها قسم في المؤسسة دون تنسيق ستفشل، لذلك أضف خطوة "إعداد SPF وDKIM" إلى إجراءات شراء أي خدمة ترسل بريدًا.

## لا تنسَ النطاقات التي لا ترسل

كل نطاق تملكه ولا يرسل بريدًا يمكن انتحاله. احمه فورًا دون مراحل:

\`\`\`text
parked-example.com.         TXT  "v=spf1 -all"
_dmarc.parked-example.com.  TXT  "v=DMARC1; p=reject"
\`\`\`

## جدول زمني نموذجي

| الأسبوع | الحالة |
|---|---|
| 0 | p=none مع rua، حماية النطاقات غير المرسلة بـreject |
| 2–6 | جرد المصادر وإصلاح DKIM وSPF |
| 6–8 | quarantine بنسبة 25٪ ثم 50٪ |
| 8–10 | quarantine بنسبة 100٪ |
| 10–12 | reject |

المدة الفعلية تعتمد على عدد الخدمات وسرعة تعاون أصحابها.

## الأسئلة الشائعة

### هل تكفي سياسة p=none لمتطلبات Gmail وYahoo؟

للمرسلين بكميات كبيرة، تشترط Google وYahoo منذ فبراير 2024 وجود سجل DMARC بسياسة p=none على الأقل مع محاذاة. لكن none لا تحمي نطاقك من الانتحال؛ الحماية تبدأ من quarantine.

### ماذا لو فشلت رسائل شرعية بعد reject؟

أصلح المصدر (DKIM أو SPF) بسرعة. وإذا كان التأثير كبيرًا، يمكن العودة مؤقتًا إلى quarantine أثناء الإصلاح، مع توثيق السبب.

### هل يؤثر DMARC على البريد الوارد إلينا؟

السجل الذي تنشره يحمي نطاقك أنت. أما فحص DMARC للرسائل الواردة فيتم على خادمك أو مزودك وفق سياسات نطاقات المرسلين.

## المراجع

- [RFC 9989: DMARC](https://www.rfc-editor.org/rfc/rfc9989)
- [Google Workspace Admin Help: Set up DMARC](https://support.google.com/a/answer/2466580)
- [Microsoft Learn: Set up DMARC to validate the From address domain](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-dmarc-configure)
- [Google: Email sender guidelines](https://support.google.com/a/answer/81126)
`,
    en: `## Why not jump straight to p=reject?

Because most organisations don't know every service that sends mail as them: the marketing platform, the ticketing system, billing, scan-to-email printers and legacy apps. A reject policy before you've found them all means your invoices or notifications get rejected at customers. A phased plan protects you from that. If the concepts are new, start with the [enterprise email security guide](/article/enterprise-email-security-guide).

## Phase 1: monitor (p=none) — two weeks to two months

Publish a record that collects reports without affecting delivery:

\`\`\`text
_dmarc.example.com.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc@example.com; fo=1"
\`\`\`

- **rua:** the address that receives daily aggregate (XML) reports. If it's on another domain, that domain must publish a special authorisation record to accept the reports.
- **fo=1:** requests failure reports if SPF or DKIM fails, though many providers don't send detailed failure reports for privacy reasons.
- Use a report analysis tool instead of reading XML by hand.

Check the record with the [DMARC record analyzer](/tools/dmarc-record-analyzer).

## Phase 2: inventory and fix alignment

From the reports, classify every sending source:

| Category | Action |
|---|---|
| Legitimate service that aligns | Nothing |
| Legitimate service that fails | Enable DKIM with your domain on it, or add it to SPF with a custom Return-Path domain |
| Forwarding or mailing lists | Usually pass via DKIM; make sure DKIM is enabled |
| Unknown source | Investigate internally; if not legitimate, it's what the policy will block |

Tips:

- **DKIM first:** DKIM alignment is more robust than SPF because it survives forwarding.
- **Watch SPF's 10-lookup limit** as you add services. Check with the [SPF record analyzer](/tools/spf-record-analyzer).
- **Subdomains:** the sp tag sets the subdomain policy; if absent, subdomains inherit the main domain's policy.

## Phase 3: quarantine, tested first

Once legitimate mail has passed at close to 100% for several weeks, publish the policy with the testing flag:

\`\`\`text
_dmarc.example.com.  TXT  "v=DMARC1; p=quarantine; t=y; rua=mailto:dmarc@example.com"
\`\`\`

- **RFC 9989** (May 2026, replacing RFC 7489) removed the **pct** tag and introduced the testing tag **t**. With \`t=y\`, receivers apply one level below your policy: \`quarantine\` is treated as \`none\`, \`reject\` as \`quarantine\`. Reporting continues as normal.
- Watch reports for at least two weeks, then remove \`t=y\` (or set \`t=n\`) to enforce quarantine.
- Why pct went: receivers rarely applied values between 0 and 100 accurately. Some may still honour a legacy \`pct\`, but don't build your ramp on it.

## Phase 4: reject

\`\`\`text
_dmarc.example.com.  TXT  "v=DMARC1; p=reject; rua=mailto:dmarc@example.com"
\`\`\`

Keep watching reports after enforcement: any new service a department adds without coordination will fail, so add an "SPF and DKIM setup" step to the procurement process for any service that sends mail.

## Don't forget non-sending domains

Every domain you own that doesn't send mail can be spoofed. Protect them immediately, no phases needed:

\`\`\`text
parked-example.com.         TXT  "v=spf1 -all"
_dmarc.parked-example.com.  TXT  "v=DMARC1; p=reject"
\`\`\`

## A typical timeline

| Week | State |
|---|---|
| 0 | p=none with rua; non-sending domains at reject |
| 2–6 | Inventory sources, fix DKIM and SPF |
| 6–8 | quarantine at 25%, then 50% |
| 8–10 | quarantine at 100% |
| 10–12 | reject |

The real duration depends on the number of services and how quickly their owners cooperate.

## FAQ

### Is p=none enough for Gmail and Yahoo requirements?

For bulk senders, Google and Yahoo have required, since February 2024, a DMARC record with at least p=none plus alignment. But none doesn't protect your domain from spoofing; protection starts at quarantine.

### What if legitimate mail fails after reject?

Fix the source (DKIM or SPF) quickly. If the impact is large, you can temporarily return to quarantine while fixing it, documenting why.

### Does DMARC affect our inbound mail?

The record you publish protects your own domain. DMARC checks on inbound mail happen on your server or provider according to the senders' domain policies.

## References

- [RFC 9989: DMARC](https://www.rfc-editor.org/rfc/rfc9989)
- [Google Workspace Admin Help: Set up DMARC](https://support.google.com/a/answer/2466580)
- [Microsoft Learn: Set up DMARC to validate the From address domain](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-dmarc-configure)
- [Google: Email sender guidelines](https://support.google.com/a/answer/81126)
`,
  },
};
