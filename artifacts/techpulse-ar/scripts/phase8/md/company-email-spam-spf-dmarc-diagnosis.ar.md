## ابدأ من الدليل، لا من التخمين

عندما يشتكي العملاء من أن رسائل الشركة تصل إلى Spam، أول ما يفعله كثيرون هو تعديل سجل SPF عشوائيًا. الأسلم أن تبدأ من رسالة حقيقية وصلت إلى صندوق Gmail أو Outlook، وتقرأ ما قرره الخادم المستقبِل بنفسه.

للخلفية النظرية عن البروتوكولات الثلاثة راجع [أساسيات SPF وDKIM وDMARC](/article/spf-dkim-dmarc-email-basics).

## الخطوة 1: اقرأ رأس Authentication-Results

في Gmail افتح الرسالة واختر **Show original**، وفي Outlook افتح خصائص الرسالة لترى الرؤوس. ابحث عن سطر مشابه:

```
Authentication-Results: mx.google.com;
  dkim=pass header.i=@example.com header.s=s1;
  spf=softfail smtp.mailfrom=bounce.mailer.example.net;
  dmarc=fail (p=QUARANTINE) header.from=example.com
```

هذا السطر وحده يخبرك بالكثير: DKIM نجح لكن بنطاق مختلف؟ SPF فشل لأن الإرسال تم من خدمة خارجية؟ DMARC فشل لأن أيًا منهما لم يكن **متوافقًا (aligned)** مع نطاق الـFrom؟

## الخطوة 2: افحص SPF

```bash
dig +short TXT example.com | grep spf1
```

الأخطاء الشائعة:

- **أكثر من سجل SPF** للنطاق نفسه: يجب أن يكون سجلًا واحدًا، وإلا تكون النتيجة permerror.
- **تجاوز حد 10 عمليات DNS** (include وa وmx وredirect) وفق RFC 7208، وهو شائع عندما تضيف كل خدمة تسويق include خاص بها.
- **نسيان خدمة ترسل باسمك**: نظام الفواتير، منصة الحملات، أو جهاز طباعة يرسل الماسح الضوئي بالبريد.
- إنهاء السجل بـ`+all`، وهو يعني السماح لأي خادم في العالم.

## الخطوة 3: افحص DKIM والتوافق

نجاح DKIM لا يكفي؛ يجب أن يكون النطاق في `d=` هو نطاقك أو نطاقًا فرعيًا منه حتى يُحتسب لـDMARC. كثير من منصات الإرسال توقّع افتراضيًا بنطاقها هي. فعّل "custom DKIM" في المنصة وانشر سجلات CNAME أو TXT التي تعطيك إياها. في Microsoft 365 فعّل توقيع DKIM لكل نطاق مخصص من بوابة Defender.

## الخطوة 4: راجع DMARC بحسب المعيار الجديد

في مايو 2026 صدر **RFC 9989** ليحل محل RFC 7489 كمواصفة DMARC. أهم ما يعنيك عمليًا:

- الوسم `pct` أُزيل من المعيار، ويحل محله وسم الاختبار `t=y`. بعض المستقبلين ما زالوا يحترمون `pct` القديم، لكن لا تبنِ خطتك عليه.
- ابدأ بـ`p=none` مع تقارير `rua` حتى ترى كل مصادر الإرسال، ثم انتقل تدريجيًا إلى quarantine ثم reject كما في [دليل الانتقال من none إلى reject](/article/dmarc-rollout-none-to-reject).

## الخطوة 5: السمعة وليس المصادقة فقط

إذا نجحت المصادقة كلها والرسائل ما زالت في Spam، فالمشكلة غالبًا في السمعة أو المحتوى:

- تأكد من وجود سجل PTR (reverse DNS) لعنوان خادم الإرسال يطابق اسمه.
- افحص العنوان في قوائم الحظر المعروفة.
- سجّل نطاقك في Google Postmaster Tools وراقب نسبة الشكاوى؛ Google تطلب من المرسلين بكميات كبيرة إبقاء نسبة البلاغات المسجلة أقل من 0.3%.
- افصل البريد التسويقي عن بريد المعاملات بنطاق فرعي، حتى لا تؤثر حملة سيئة على رسائل الفواتير.

## متطلبات المزودين الكبار

منذ 2024 تطلب Google وYahoo من المرسلين بكميات كبيرة (أكثر من 5,000 رسالة يوميًا إلى حساباتهما) مصادقة SPF وDKIM، وسجل DMARC بسياسة `p=none` على الأقل، وإلغاء اشتراك بنقرة واحدة للرسائل التسويقية. وأعلنت Microsoft متطلبات مشابهة لنطاقات Outlook.com الاستهلاكية في 2025. حتى لو كانت كمياتك أقل، فهذه المتطلبات هي الحد الأدنى المعقول.

## الأسئلة الشائعة

**SPF ناجح لكن DMARC فاشل، كيف؟**
لأن SPF يُفحص على نطاق Return-Path وليس نطاق From الظاهر. إن كانت منصة الإرسال تستخدم نطاقها في Return-Path فلن يكون SPF متوافقًا.

**هل أحتاج DKIM إذا كان SPF سليمًا؟**
نعم. SPF ينكسر عند إعادة التوجيه (forwarding)، بينما يبقى توقيع DKIM صالحًا غالبًا.

**كم يستغرق تحسن السمعة؟**
عادة أيامًا إلى أسابيع من الإرسال النظيف والمتسق؛ لا يوجد زر سريع.

## المراجع

- [Email sender guidelines — Google Workspace Admin Help](https://support.google.com/mail/answer/81126)
- [RFC 9989 — Domain-based Message Authentication, Reporting, and Conformance (DMARC)](https://www.rfc-editor.org/rfc/rfc9989)
- [RFC 7208 — Sender Policy Framework (SPF)](https://www.rfc-editor.org/rfc/rfc7208)
- [Email authentication in Microsoft 365 — Microsoft Learn](https://learn.microsoft.com/defender-office-365/email-authentication-about)
