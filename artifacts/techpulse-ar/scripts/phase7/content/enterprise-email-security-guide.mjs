export default {
  slug: 'enterprise-email-security-guide',
  pillar: true,
  categoryId: 'cybersecurity',
  subcategoryId: 'guides-tips',
  tags: ['email-security', 'spf', 'dkim', 'dmarc', 'phishing', 'pillar'],
  domainIds: ['cybersecurity'],
  topicIds: ['dns', 'threat-detection'],
  contentType: 'guide',
  vendorIds: ['microsoft', 'google'],
  productIds: [],
  title: {
    ar: 'أمن البريد المؤسسي: الدليل الشامل لـSPF وDKIM وDMARC والتصيد',
    en: 'Enterprise Email Security: The Complete Guide to SPF, DKIM and DMARC',
  },
  excerpt: {
    ar: 'كيف تحمي نطاقك ومستخدميك: مصادقة البريد بـSPF وDKIM وDMARC، متطلبات Gmail وYahoo وOutlook للمرسلين، MTA-STS، بوابات البريد، والتوعية بالتصيد.',
    en: 'How to protect your domain and users: SPF, DKIM and DMARC authentication, Gmail, Yahoo and Outlook sender requirements, MTA-STS, mail gateways and phishing awareness.',
  },
  body: {
    ar: `## لماذا لا يزال البريد الإلكتروني الباب الأوسع للهجمات؟

صُمم بروتوكول SMTP في زمن لم يكن فيه التحقق من هوية المرسل مطروحًا، لذلك يستطيع أي شخص نظريًا إرسال رسالة يظهر فيها نطاقك في حقل "From". ومن هنا تأتي أكثر الهجمات شيوعًا: التصيد، وانتحال المدير المالي (BEC)، والمرفقات الخبيثة.

أمن البريد المؤسسي له جانبان:

1. **حماية نطاقك من الانتحال** حتى لا يستخدمه المهاجمون ضد عملائك وموظفيك (SPF وDKIM وDMARC).
2. **حماية مستخدميك من الرسائل الواردة الخبيثة** (البوابات، والفحص، والتوعية، والاستجابة).

## الجزء الأول: مصادقة البريد

### SPF — من يحق له الإرسال باسم نطاقك؟

سجل SPF (المعيار RFC 7208) هو سجل TXT في DNS يسرد الخوادم والخدمات المسموح لها بالإرسال من نطاقك:

\`\`\`text
example.com.  TXT  "v=spf1 include:spf.protection.outlook.com include:_spf.google.com -all"
\`\`\`

نقاط حرجة:

- **سجل واحد فقط** لكل نطاق؛ وجود سجلين يجعل التحقق يفشل.
- **حد 10 استعلامات DNS:** كل include وa وmx وredirect يُحتسب، وتجاوز الحد يعطي نتيجة permerror.
- **‎-all أم ‎~all:** الأولى ترفض غير المذكورين صراحة، والثانية "فشل مخفف". عمليًا تعتمد قرارات الرفض اليوم على DMARC أكثر من SPF وحده.
- SPF يتحقق من نطاق **Return-Path** (المغلف)، وليس من حقل From الذي يراه المستخدم؛ لذلك لا يكفي وحده لمنع الانتحال.

افحص سجلك بأداة [محلل سجل SPF](/tools/spf-record-analyzer).

### DKIM — توقيع رقمي للرسالة

يضيف DKIM (المعيار RFC 6376) توقيعًا مشفرًا لرأس الرسالة وأجزاء من محتواها، وينشر المفتاح العام في DNS تحت "محدد" (Selector):

\`\`\`text
selector1._domainkey.example.com.  CNAME  selector1-example-com._domainkey.example.onmicrosoft.com.
\`\`\`

- استخدم مفاتيح RSA بطول 2048 بت حيث يدعمها المزود.
- فعّل DKIM على **كل** خدمة ترسل باسمك (نظام CRM، منصة النشرات، نظام الفوترة)، لا على البريد الرئيسي فقط.
- دوّر المفاتيح دوريًا باستخدام محددين.

### DMARC — السياسة التي تربط كل شيء

يربط DMARC (المعيار RFC 9989 الصادر في مايو 2026، والذي حل محل RFC 7489) بين SPF وDKIM وحقل From الظاهر، ويطلب **المحاذاة (Alignment)**: يجب أن يتطابق نطاق SPF أو نطاق توقيع DKIM مع نطاق From. كما يحدد ما يفعله المستقبل بالرسائل الفاشلة، ويرسل لك تقارير.

\`\`\`text
_dmarc.example.com.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc-reports@example.com; fo=1"
\`\`\`

| السياسة | التأثير |
|---|---|
| p=none | مراقبة فقط مع تقارير |
| p=quarantine | وضع الرسائل الفاشلة في البريد العشوائي |
| p=reject | رفض الرسائل الفاشلة |

الهدف النهائي هو p=reject، لكن الوصول إليه يتطلب مرحلة مراقبة لاكتشاف كل الخدمات الشرعية. خطة مفصلة في [الانتقال بـDMARC من none إلى reject](/article/dmarc-rollout-none-to-reject)، وافحص سجلك بأداة [محلل سجل DMARC](/tools/dmarc-record-analyzer). الأساسيات في [أساسيات SPF وDKIM وDMARC](/article/spf-dkim-dmarc-email-basics).

### متطلبات كبار مزودي البريد

منذ فبراير 2024 تطلب Google وYahoo من المرسلين بكميات كبيرة (أكثر من 5000 رسالة يوميًا إلى حسابات Gmail) مصادقة SPF وDKIM، وسجل DMARC بسياسة p=none على الأقل مع محاذاة نطاق From، وإلغاء اشتراك بنقرة واحدة للرسائل التسويقية، والحفاظ على معدل بلاغات البريد العشوائي منخفضًا. وأعلنت Microsoft متطلبات مماثلة لـOutlook.com للمرسلين بكميات كبيرة بدءًا من مايو 2025. حتى لو لم تكن مرسلًا كبيرًا، فإن الالتزام بهذه المتطلبات يحسن وصول رسائلك.

### طبقات إضافية

- **MTA-STS (RFC 8461) وTLS-RPT (RFC 8460):** تفرض تشفير TLS على البريد الوارد إلى نطاقك وتمنع هجمات خفض التشفير، مع تقارير عن الأعطال.
- **BIMI:** يعرض شعار علامتك التجارية في بعض صناديق البريد، ويتطلب سياسة DMARC مُطبّقة (quarantine أو reject).
- **حماية النطاقات غير المستخدمة:** النطاق الذي لا يرسل بريدًا يجب أن يحمل \`v=spf1 -all\` وسياسة DMARC بـp=reject، حتى لا يُستغل في الانتحال.

## الجزء الثاني: حماية المستخدمين من الرسائل الواردة

### بوابة البريد أو الحماية المدمجة

سواء كانت بوابة مستقلة أو حماية مدمجة في Microsoft 365 أو Google Workspace، تأكد من:

- فحص المرفقات في بيئة معزولة (Sandbox) وإعادة كتابة الروابط وفحصها لحظة النقر.
- سياسات مكافحة الانتحال: حماية أسماء كبار المسؤولين والنطاقات المشابهة (مثل استبدال حرف بآخر يشبهه).
- وسم الرسائل الخارجية بتنبيه واضح.
- حظر أنواع المرفقات الخطيرة مثل الملفات التنفيذية والبرامج النصية، والتعامل بحذر مع الملفات المضغوطة المحمية بكلمة مرور.

راجع [أساسيات بوابات أمن البريد](/article/email-security-gateway-basics).

### الحسابات المخترقة

كثير من هجمات BEC لا تنتحل النطاق بل تستخدم حسابًا حقيقيًا مخترقًا. لذلك:

- فعّل MFA مقاومة للتصيد، كما في [دليل المصادقة الثنائية العملي](/article/2fa-practical-guide).
- راقب قواعد إعادة توجيه البريد إلى عناوين خارجية، فهي علامة كلاسيكية على الاختراق.
- عطّل بروتوكولات المصادقة القديمة (Basic Authentication) التي لا تدعم MFA.

### الإنسان كخط دفاع

- تدريب قصير ومتكرر بدل محاضرة سنوية طويلة.
- محاكاة تصيد تقيس **نسبة الإبلاغ**، لا نسبة النقر فقط.
- زر إبلاغ واضح في عميل البريد، وردّ سريع على كل بلاغ.
- إجراء تحقق خارج البريد (اتصال هاتفي برقم معروف) لأي طلب تحويل مالي أو تغيير بيانات بنكية.

راجع [كيف تكتشف التصيد قبل النقر](/article/phishing-spot-before-click) و[برامج محاكاة التصيد](/article/phishing-simulation-training-programs) و[مقاييس التوعية الأمنية](/article/security-awareness-training-metrics).

## الاستجابة لحادث بريد: من البلاغ إلى الإغلاق

عندما يبلغ موظف عن رسالة مشبوهة أو يكتشف الفريق حسابًا مخترقًا، اتبع خطوات ثابتة:

1. **حلل الرسالة:** افحص الرؤوس (Received، ونتائج Authentication-Results لـSPF وDKIM وDMARC)، والروابط والمرفقات في بيئة معزولة.
2. **حدد النطاق:** ابحث عن نفس المرسل أو الموضوع أو الرابط في كل الصناديق. أدوات مثل Content Search أو Threat Explorer في Microsoft 365 تسهّل ذلك.
3. **احذف من كل مكان:** أزل الرسالة من صناديق جميع المستلمين، وأضف المرسل والروابط إلى قوائم الحظر.
4. **عالج من تفاعل:** من أدخل بياناته يجب إعادة تعيين كلمة مروره وإلغاء جلساته النشطة ومراجعة طرق MFA المسجلة على حسابه.
5. **ابحث عن الثبات:** قواعد إعادة توجيه أو حذف تلقائي، تطبيقات OAuth مُنحت صلاحيات، أو أجهزة جديدة مسجلة.
6. **أغلق الحلقة:** أبلغ المُبلّغ بالنتيجة وشكره، فهذا يزيد نسبة الإبلاغ مستقبلًا.

التفاصيل الكاملة لإدارة الحوادث في [دليل مركز العمليات الأمنية والاستجابة للحوادث](/article/soc-incident-response-guide).

## قراءة تقارير DMARC التجميعية

تقارير rua ملفات XML يرسلها المستقبلون يوميًا تقريبًا، وتحتوي لكل عنوان IP مرسل: عدد الرسائل، ونتيجة SPF وDKIM، وهل تحققت المحاذاة. قراءتها يدويًا مرهقة، لذلك يُفضل استخدام أداة تحليل تجمعها في لوحة واحدة. ما تبحث عنه:

- **خدمات شرعية تفشل:** منصة تسويق أو نظام فوترة لم يُضف إلى SPF أو لم يُفعّل عليه DKIM.
- **مصادر غير معروفة:** عناوين ترسل باسمك دون إذن؛ هذه بالضبط ما سيمنعه p=reject.
- **إعادة التوجيه:** رسائل شرعية تفشل في SPF بعد مرورها بخادم وسيط لكنها تنجح في DKIM؛ لذلك DKIM أهم للمحاذاة.

## قائمة تحقق سريعة

| البند | الحالة المطلوبة |
|---|---|
| SPF | سجل واحد، أقل من 10 استعلامات، ينتهي بـ‎-all أو ‎~all |
| DKIM | مفعّل على كل خدمة مرسلة، بمفاتيح 2048 بت |
| DMARC | منشور مع rua، ومسار زمني واضح نحو reject |
| النطاقات غير المرسلة | ‎v=spf1 -all وDMARC p=reject |
| MTA-STS | وضع testing ثم enforce |
| MFA | لكل صناديق البريد، مقاومة للتصيد للمسؤولين |
| المصادقة القديمة | معطلة |
| زر الإبلاغ | متاح ومتابع |

## الأسئلة الشائعة

### هل يمنع DMARC كل رسائل التصيد؟

لا. يمنع انتحال نطاقك تحديدًا، لكنه لا يمنع النطاقات المشابهة أو الحسابات المخترقة أو الرسائل من خدمات مجانية. لذلك نحتاج طبقات الحماية الأخرى.

### كم يستغرق الوصول إلى p=reject؟

يختلف حسب عدد الخدمات التي ترسل باسمك؛ في بيئة بسيطة قد يكفي شهر أو اثنان، وفي المؤسسات الكبيرة قد يستغرق عدة أشهر من تحليل التقارير.

### لماذا تفشل رسائل النشرة البريدية في DMARC رغم وجود SPF؟

غالبًا لأن مزود النشرات يستخدم نطاقه الخاص في Return-Path، فلا تتحقق المحاذاة. الحل هو تفعيل DKIM بنطاقك على منصة النشرات أو إعداد نطاق Return-Path مخصص.

### هل أحتاج بوابة بريد منفصلة إذا كنت على Microsoft 365؟

ليس دائمًا. الحماية المدمجة في الخطط الأعلى قوية إذا ضُبطت جيدًا. قيّم الفجوات الفعلية قبل إضافة طبقة جديدة.

## المراجع

- [RFC 7208: Sender Policy Framework (SPF)](https://datatracker.ietf.org/doc/html/rfc7208)
- [RFC 6376: DomainKeys Identified Mail (DKIM) Signatures](https://datatracker.ietf.org/doc/html/rfc6376)
- [RFC 9989: Domain-based Message Authentication, Reporting, and Conformance (DMARC)](https://www.rfc-editor.org/rfc/rfc9989)
- [RFC 8461: SMTP MTA Strict Transport Security (MTA-STS)](https://datatracker.ietf.org/doc/html/rfc8461)
- [Google: Email sender guidelines](https://support.google.com/a/answer/81126)
- [Microsoft Learn: Set up DMARC to validate the From address domain](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-dmarc-configure)
`,
    en: `## Why email is still the widest door for attackers

SMTP was designed when sender verification wasn't a consideration, so in theory anyone can send a message with your domain in the "From" field. That's where the most common attacks come from: phishing, CEO/CFO impersonation (BEC) and malicious attachments.

Enterprise email security has two sides:

1. **Protecting your domain from spoofing**, so attackers can't use it against your customers and staff (SPF, DKIM, DMARC).
2. **Protecting your users from malicious inbound mail** (gateways, scanning, awareness and response).

## Part 1: email authentication

### SPF — who may send as your domain?

An SPF record (RFC 7208) is a DNS TXT record listing the servers and services allowed to send from your domain:

\`\`\`text
example.com.  TXT  "v=spf1 include:spf.protection.outlook.com include:_spf.google.com -all"
\`\`\`

Critical points:

- **Only one record** per domain; two records make evaluation fail.
- **The 10-DNS-lookup limit:** every include, a, mx and redirect counts, and exceeding it returns permerror.
- **-all vs ~all:** the first fails anything not listed; the second is a "soft fail". In practice, rejection decisions today depend more on DMARC than on SPF alone.
- SPF checks the **Return-Path** (envelope) domain, not the From header the user sees, so on its own it doesn't stop spoofing.

Check your record with the [SPF record analyzer](/tools/spf-record-analyzer).

### DKIM — a digital signature on the message

DKIM (RFC 6376) adds a cryptographic signature over headers and parts of the body, and publishes the public key in DNS under a selector:

\`\`\`text
selector1._domainkey.example.com.  CNAME  selector1-example-com._domainkey.example.onmicrosoft.com.
\`\`\`

- Use 2048-bit RSA keys where your provider supports them.
- Enable DKIM on **every** service sending as you (CRM, newsletter platform, billing system), not just your main mailbox provider.
- Rotate keys periodically using two selectors.

### DMARC — the policy that ties it together

DMARC (RFC 9989, published May 2026 to replace RFC 7489) links SPF and DKIM to the visible From domain and requires **alignment**: the SPF domain or the DKIM signing domain must match the From domain. It also tells receivers what to do with failing mail and sends you reports.

\`\`\`text
_dmarc.example.com.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc-reports@example.com; fo=1"
\`\`\`

| Policy | Effect |
|---|---|
| p=none | Monitor only, with reports |
| p=quarantine | Send failing mail to spam |
| p=reject | Reject failing mail |

The end goal is p=reject, but getting there needs a monitoring phase to discover every legitimate service. A detailed plan is in [rolling DMARC from none to reject](/article/dmarc-rollout-none-to-reject); check your record with the [DMARC record analyzer](/tools/dmarc-record-analyzer). Basics are in [SPF, DKIM and DMARC basics](/article/spf-dkim-dmarc-email-basics).

### Major mailbox provider requirements

Since February 2024, Google and Yahoo require bulk senders (more than 5,000 messages a day to Gmail accounts) to authenticate with SPF and DKIM, publish DMARC with at least p=none and an aligned From domain, offer one-click unsubscribe on marketing mail, and keep spam complaint rates low. Microsoft announced similar requirements for high-volume senders to Outlook.com starting in May 2025. Even if you're not a bulk sender, meeting these requirements improves deliverability.

### Extra layers

- **MTA-STS (RFC 8461) and TLS-RPT (RFC 8460):** enforce TLS on mail delivered to your domain, prevent downgrade attacks and report failures.
- **BIMI:** shows your brand logo in some inboxes and requires an enforced DMARC policy (quarantine or reject).
- **Protect non-sending domains:** a domain that never sends mail should publish \`v=spf1 -all\` and a DMARC p=reject policy so it can't be used for spoofing.

## Part 2: protecting users from inbound mail

### A mail gateway or built-in protection

Whether it's a standalone gateway or the protection built into Microsoft 365 or Google Workspace, make sure you have:

- Attachment sandboxing, and link rewriting with time-of-click checks.
- Anti-impersonation policies protecting executive names and look-alike domains (such as one character swapped for a similar one).
- A clear banner on external messages.
- Blocking of dangerous attachment types such as executables and scripts, and caution with password-protected archives.

See [email security gateway basics](/article/email-security-gateway-basics).

### Compromised accounts

Many BEC attacks don't spoof the domain at all; they use a real, compromised mailbox. So:

- Enforce phishing-resistant MFA, as in the [practical 2FA guide](/article/2fa-practical-guide).
- Monitor forwarding rules to external addresses, a classic sign of compromise.
- Disable legacy (basic) authentication protocols that can't do MFA.

### People as a line of defence

- Short, frequent training instead of one long annual lecture.
- Phishing simulations that measure the **report rate**, not just the click rate.
- A clear report button in the mail client, and fast feedback on every report.
- An out-of-band check (a phone call to a known number) for any payment request or bank detail change.

See [spotting phishing before you click](/article/phishing-spot-before-click), [phishing simulation programmes](/article/phishing-simulation-training-programs) and [security awareness metrics](/article/security-awareness-training-metrics).

## Responding to an email incident: from report to closure

When a user reports a suspicious message or the team finds a compromised mailbox, follow fixed steps:

1. **Analyse the message:** inspect headers (Received, and Authentication-Results for SPF, DKIM and DMARC), and detonate links and attachments in a sandbox.
2. **Scope it:** search every mailbox for the same sender, subject or link. Tools such as Content Search or Threat Explorer in Microsoft 365 make this easier.
3. **Purge everywhere:** remove the message from all recipients' mailboxes and block the sender and links.
4. **Fix whoever interacted:** anyone who entered credentials needs a password reset, active sessions revoked and their registered MFA methods reviewed.
5. **Hunt for persistence:** forwarding or auto-delete rules, OAuth apps granted permissions, or newly registered devices.
6. **Close the loop:** tell the reporter the outcome and thank them; it raises future report rates.

Full incident handling is in the [SOC and incident response guide](/article/soc-incident-response-guide).

## Reading DMARC aggregate reports

rua reports are XML files receivers send roughly daily. For each sending IP they contain the message count, SPF and DKIM results, and whether alignment passed. Reading them by hand is tedious, so use an analysis tool that aggregates them into one dashboard. What to look for:

- **Legitimate services failing:** a marketing platform or billing system missing from SPF or without DKIM.
- **Unknown sources:** addresses sending as you without permission — exactly what p=reject will stop.
- **Forwarding:** legitimate mail that fails SPF after passing through an intermediary but passes DKIM, which is why DKIM matters most for alignment.

## Quick checklist

| Item | Target state |
|---|---|
| SPF | One record, under 10 lookups, ending in -all or ~all |
| DKIM | Enabled on every sending service, 2048-bit keys |
| DMARC | Published with rua and a clear timeline to reject |
| Non-sending domains | v=spf1 -all and DMARC p=reject |
| MTA-STS | testing mode, then enforce |
| MFA | All mailboxes; phishing-resistant for admins |
| Legacy authentication | Disabled |
| Report button | Available and monitored |

## FAQ

### Does DMARC stop all phishing?

No. It stops spoofing of your exact domain, but not look-alike domains, compromised accounts or mail from free services. That's why the other layers matter.

### How long does it take to reach p=reject?

It depends on how many services send as you; a simple environment may need a month or two, large organisations several months of report analysis.

### Why does our newsletter fail DMARC even though SPF passes?

Usually because the newsletter provider uses its own domain in the Return-Path, so alignment fails. The fix is to enable DKIM with your domain on the newsletter platform or set up a custom Return-Path domain.

### Do I need a separate gateway if I'm on Microsoft 365?

Not always. The built-in protection in higher plans is strong when tuned well. Assess real gaps before adding another layer.

## References

- [RFC 7208: Sender Policy Framework (SPF)](https://datatracker.ietf.org/doc/html/rfc7208)
- [RFC 6376: DomainKeys Identified Mail (DKIM) Signatures](https://datatracker.ietf.org/doc/html/rfc6376)
- [RFC 9989: Domain-based Message Authentication, Reporting, and Conformance (DMARC)](https://www.rfc-editor.org/rfc/rfc9989)
- [RFC 8461: SMTP MTA Strict Transport Security (MTA-STS)](https://datatracker.ietf.org/doc/html/rfc8461)
- [Google: Email sender guidelines](https://support.google.com/a/answer/81126)
- [Microsoft Learn: Set up DMARC to validate the From address domain](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-dmarc-configure)
`,
  },
};
