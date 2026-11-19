export default {
  slug: 'soc-incident-response-guide',
  pillar: true,
  categoryId: 'cybersecurity',
  subcategoryId: 'guides-tips',
  tags: ['soc', 'siem', 'incident-response', 'detection', 'pillar'],
  domainIds: ['cybersecurity'],
  topicIds: ['siem-soc', 'threat-detection'],
  contentType: 'guide',
  vendorIds: ['microsoft'],
  productIds: [],
  title: {
    ar: 'مركز العمليات الأمنية والاستجابة للحوادث: الدليل الشامل',
    en: 'SOC and Incident Response: The Complete Guide',
  },
  excerpt: {
    ar: 'كيف تبني قدرة رصد واستجابة واقعية: مصادر السجلات، الـSIEM، قواعد الكشف، مراحل الاستجابة وفق NIST، كتيبات التشغيل، والمقاييس التي تهم الإدارة.',
    en: 'How to build a realistic detection and response capability: log sources, SIEM, detection rules, NIST response phases, playbooks and the metrics that matter.',
  },
  body: {
    ar: `## ما هو مركز العمليات الأمنية فعلًا؟

مركز العمليات الأمنية (SOC) ليس غرفة مليئة بالشاشات، بل **قدرة** تتكون من ثلاثة عناصر: أشخاص يحللون التنبيهات، وعمليات واضحة تحدد ماذا يفعلون، وتقنيات تجمع البيانات وتربطها. يمكن لمؤسسة متوسطة أن تمتلك SOC فعالًا بفريق صغير أو بالشراكة مع مزود خدمة مُدارة، بشرط أن تكون المصادر والعمليات صحيحة.

يجمع هذا الدليل محتوى مقالتينا السابقتين عن مركز العمليات الأمنية وخطة الاستجابة للحوادث في مرجع واحد محدث، ويربطك بقائمة تشغيل مرئية وبالمقالات التفصيلية.

## نماذج تشغيل SOC

| النموذج | المزايا | العيوب | مناسب لـ |
|---|---|---|---|
| داخلي | تحكم كامل وفهم عميق للبيئة | تكلفة توظيف وتشغيل على مدار الساعة | المؤسسات الكبيرة والمنظمة |
| مُدار (MSSP/MDR) | تغطية 24/7 بتكلفة متوقعة | معرفة أقل بسياق العمل | المؤسسات الصغيرة والمتوسطة |
| هجين | فريق داخلي لساعات العمل ومزود لخارجها | يحتاج تنسيقًا وتسليمًا واضحًا | معظم المؤسسات المتوسطة |

مهما كان النموذج، تبقى **ملكية الحادث** داخل المؤسسة: المزود ينبّه ويحلل، لكن قرار عزل خادم إنتاجي أو إبلاغ جهة تنظيمية قرار داخلي.

## الأدوار والمستويات

- **المستوى الأول (Triage):** يستقبل التنبيهات، يستبعد الإنذارات الكاذبة، ويصعّد ما يستحق.
- **المستوى الثاني (Investigation):** يحقق في الحوادث المصعّدة ويحدد النطاق ويبدأ الاحتواء.
- **المستوى الثالث (Threat Hunting / Engineering):** يكتب قواعد الكشف، ويبحث استباقيًا عن التهديدات، ويحسّن الأدوات.
- **مدير الحادث:** ينسق بين الفنيين والإدارة والقانونية والاتصال أثناء الحوادث الكبيرة.

## مصادر السجلات: ابدأ بما يكشف الهجمات الحقيقية

أكبر خطأ في مشاريع الـSIEM هو جمع كل شيء ثم الغرق في التكلفة والضجيج. رتّب المصادر حسب قيمتها:

1. **وحدات التحكم بالنطاق (Domain Controllers):** أحداث المصادقة وتغييرات المجموعات والحسابات.
2. **الأجهزة الطرفية (EDR):** العمليات وسلاسل التنفيذ والاتصالات الشبكية.
3. **بوابات الوصول عن بُعد والجدار الناري:** تسجيلات الدخول والاتصالات الصادرة.
4. **البريد الإلكتروني:** الرسائل المحجوبة والروابط والمرفقات المبلغ عنها.
5. **الهوية السحابية:** تسجيلات الدخول والتطبيقات الممنوحة صلاحيات.
6. **DNS والوكيل (Proxy):** الاتصالات بنطاقات خبيثة أو حديثة التسجيل.

لمعرفة أحداث Windows الأهم وكيف تُقرأ، راجع [أهم معرّفات أحداث أمان Windows لفرق SOC](/article/windows-security-event-ids-soc)، ولفهم سياسات الاحتفاظ راجع [الاحتفاظ بالسجلات والـSIEM](/article/log-retention-siem-basics).

## كيف يعمل الـSIEM وكيف تكتب قاعدة كشف جيدة

يجمع الـSIEM السجلات ويوحّد صيغتها ثم يطبق عليها قواعد ارتباط تولّد تنبيهات. القاعدة الجيدة لها:

- **فرضية واضحة:** مثال: "حساب واحد يفشل في تسجيل الدخول على عشرات الحسابات خلال دقائق يشير إلى Password Spray".
- **بيانات مصدر مؤكدة:** تأكد أن الحدث يُجمع فعلًا (مثلًا 4625 على وحدات التحكم).
- **عتبة مضبوطة:** اختبرها على بيانات أسبوعين قبل التفعيل لتقليل الإنذارات الكاذبة.
- **كتيب استجابة مرتبط:** كل تنبيه يجب أن يخبر المحلل بالخطوة التالية.
- **ربط بإطار MITRE ATT&CK:** يسهّل قياس التغطية ومعرفة الفجوات.

مثال مبسط لقاعدة بلغة استعلام عامة:

\`\`\`text
الحدث = 4625 (فشل تسجيل الدخول)
تجميع حسب: عنوان المصدر
الشرط: عدد أسماء المستخدمين المختلفة >= 20 خلال 10 دقائق
الإجراء: تنبيه متوسط الخطورة + كتيب "Password Spray"
\`\`\`

تعرف على التفاصيل في [كيف يعمل الـSIEM](/article/how-siem-actually-works) و[كيف يعمل الـEDR](/article/how-edr-actually-works).

## دورة الاستجابة للحوادث

يعتمد معظم الممارسين على دورة NIST التي نُشرت في SP 800-61. في أبريل 2025 أصدر NIST المراجعة الثالثة (SP 800-61r3) التي تربط الاستجابة للحوادث بوظائف إطار الأمن السيبراني CSF 2.0 (الحوكمة، التحديد، الحماية، الكشف، الاستجابة، التعافي)، لكن المراحل العملية ما زالت مألوفة:

### 1. التحضير

- خطة مكتوبة معتمدة من الإدارة، وجهات اتصال محدثة (بما فيها خارج ساعات العمل).
- صلاحيات جاهزة للعزل والتحقيق، ونسخ احتياطية مختبرة.
- قنوات اتصال بديلة إذا كان البريد نفسه مخترقًا.

### 2. الكشف والتحليل

- تحديد هل الحدث حادث فعلي، وما نطاقه وخطورته.
- حفظ الأدلة قبل تغييرها: السجلات، صور الذاكرة عند الحاجة، ونسخ الملفات المشبوهة.
- توثيق خط زمني لكل ما يُكتشف.

### 3. الاحتواء

- **قصير المدى:** عزل الجهاز عبر الـEDR، تعطيل الحساب المخترق، حجب عنوان أو نطاق.
- **طويل المدى:** إصلاحات مؤقتة تسمح باستمرار العمل أثناء التنظيف.

### 4. الاستئصال والتعافي

- إزالة البرمجيات الخبيثة وأبواب الدخول الخلفية، وإعادة تعيين كلمات المرور المتأثرة.
- إعادة الأنظمة من نسخ نظيفة، ومراقبة مكثفة بعد العودة.

### 5. ما بعد الحادث

- جلسة "دروس مستفادة" دون لوم خلال أسبوعين.
- تحديث قواعد الكشف والكتيبات والخطة نفسها.

لأخطر سيناريو، راجع [الساعة الأولى بعد هجوم فدية](/article/ransomware-first-hour-response)، ولتجربة الخطة قبل الحاجة إليها راجع [تمارين الطاولة](/article/incident-response-tabletop-exercises).

## مصفوفة تصنيف الخطورة

| المستوى | المعيار | زمن الاستجابة المستهدف |
|---|---|---|
| حرج | تشفير فدية، اختراق حساب مسؤول نطاق، تسريب بيانات مؤكد | فوري — تفعيل فريق الحوادث |
| مرتفع | جهاز مصاب ينتشر، حساب مستخدم مخترق مع نشاط | خلال ساعة |
| متوسط | برمجية خبيثة محجوبة، محاولة تصيد ناجحة دون نشاط لاحق | خلال يوم عمل |
| منخفض | فحص منافذ خارجي، تصيد محجوب | ضمن المراجعة الدورية |

عدّل الأزمنة حسب حجم فريقك، لكن اكتبها مسبقًا حتى لا يُتخذ القرار تحت الضغط.

## كتيبات التشغيل (Playbooks)

الكتيب يحول الخبرة إلى خطوات قابلة للتكرار. ابدأ بخمسة كتيبات تغطي أغلب الحوادث:

1. **التصيد الاحتيالي:** فحص الرسالة، البحث عن مستلمين آخرين، حذفها من كل الصناديق، إعادة تعيين كلمة المرور لمن نقر وأدخل بياناته.
2. **حساب مخترق:** تعطيل الحساب أو إلغاء الجلسات، مراجعة قواعد إعادة توجيه البريد، فحص تسجيلات الدخول من مواقع غير مألوفة.
3. **برمجية خبيثة على جهاز:** عزل عبر الـEDR، جمع الأدلة، تحديد مصدر الإصابة، إعادة تثبيت عند الشك.
4. **فدية:** عزل الشبكة المتأثرة، حماية النسخ الاحتياطية، إبلاغ الإدارة والجهات القانونية، عدم إعادة التشغيل قبل جمع الأدلة.
5. **استغلال ثغرة على خدمة مكشوفة:** تطبيق الإصلاح أو التخفيف، البحث عن مؤشرات الاختراق، فحص الحركة الجانبية.

## التواصل وإدارة الأدلة أثناء الحادث

الجانب الفني نصف الحادث فقط؛ النصف الآخر هو التواصل والتوثيق:

- **قناة حادث مخصصة:** غرفة محادثة أو جسر هاتفي لكل حادث كبير، مع سجل قرارات يُحدَّث بالوقت والاسم.
- **تحديثات منتظمة للإدارة:** رسالة قصيرة كل فترة متفق عليها تتضمن: ماذا نعرف، ماذا لا نعرف، ماذا نفعل الآن، ومتى التحديث التالي.
- **سلسلة الحيازة (Chain of Custody):** عند جمع أدلة قد تُستخدم قانونيًا، سجّل من جمعها ومتى وكيف خُزنت، واحسب بصمة (Hash) للملفات المجمعة.
- **الالتزامات القانونية:** بعض القوانين وعقود العملاء تفرض مُهلًا للإبلاغ عن تسريب البيانات الشخصية؛ حدد مسبقًا من يقرر ذلك مع الفريق القانوني.
- **عدم التسرع بالتنظيف:** حذف البرمجية الخبيثة قبل فهم طريقة الدخول قد يترك الباب مفتوحًا للمهاجم ليعود.

## خارطة طريق لبناء القدرة خلال ستة أشهر

| الشهر | الهدف |
|---|---|
| 1 | جرد الأصول الحرجة، تحديد مالك الحوادث، كتابة خطة استجابة مختصرة |
| 2 | تفعيل سياسات تدقيق Windows على وحدات التحكم، وتجميع سجلاتها مع الـEDR مركزيًا |
| 3 | كتابة 10 قواعد كشف عالية القيمة مرتبطة بكتيبات |
| 4 | إضافة سجلات VPN والجدار الناري والبريد، وقياس نسبة الإنذارات الكاذبة |
| 5 | تمرين طاولة لسيناريو فدية مع الإدارة |
| 6 | مراجعة التغطية مقابل ATT&CK، وتحديد ما يُسند لمزود خارجي |

## المقاييس التي تهم

- **متوسط زمن الكشف (MTTD)** و**متوسط زمن الاستجابة (MTTR)**.
- **نسبة الإنذارات الكاذبة** لكل قاعدة؛ القاعدة التي تولد 95٪ إنذارات كاذبة تُرهق الفريق ويجب ضبطها.
- **تغطية ATT&CK:** نسبة التقنيات التي لديك كشف مُختبر لها.
- **نسبة الحوادث المكتشفة داخليًا** مقابل تلك التي أبلغت عنها جهة خارجية.

## أخطاء شائعة

- شراء SIEM قبل تحديد حالات الاستخدام.
- عدم مزامنة الوقت (NTP) بين الأنظمة، مما يجعل الخط الزمني للحادث غير موثوق.
- تنبيهات بلا مالك أو بلا كتيب.
- خطة استجابة لم تُجرَّب أبدًا.

## الأسئلة الشائعة

### هل أحتاج SIEM لأبدأ؟

لا بالضرورة. يمكن البدء بتجميع سجلات وحدات التحكم والـEDR في منصة واحدة وكتابة عدد قليل من القواعد عالية القيمة، ثم التوسع.

### ما الفرق بين EDR وSIEM؟

الـEDR يراقب الأجهزة الطرفية بعمق ويستطيع عزلها، أما الـSIEM فيجمع سجلات من مصادر متعددة ليربط الأحداث عبر البيئة كلها. يكمل كل منهما الآخر.

### كم مرة يجب اختبار خطة الاستجابة؟

مرة سنويًا على الأقل بتمرين طاولة، وبعد أي تغيير كبير في البنية أو الفريق.

### هل أدفع الفدية إذا تعرضنا لهجوم؟

القرار إداري وقانوني ويتأثر بالقوانين المحلية ووثيقة التأمين، وتنصح جهات رسمية مثل CISA بعدم الدفع. الأهم هو امتلاك نسخ احتياطية غير قابلة للتعديل ومختبرة حتى لا تضطر للاختيار.

## المراجع

- [NIST SP 800-61 Rev. 3: Incident Response Recommendations and Considerations for Cybersecurity Risk Management](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
- [NIST Cybersecurity Framework 2.0](https://www.nist.gov/cyberframework)
- [MITRE ATT&CK](https://attack.mitre.org/)
- [CISA: #StopRansomware Guide](https://www.cisa.gov/stopransomware/ransomware-guide)
`,
    en: `## What a SOC really is

A Security Operations Center (SOC) isn't a room full of screens; it's a **capability** made of three things: people who analyse alerts, clear processes that tell them what to do, and technology that collects and correlates data. A mid-sized organisation can run an effective SOC with a small team or with a managed provider, as long as the data sources and processes are right.

This guide merges our earlier articles on the SOC and on building an incident response plan into one up-to-date reference, linked to a video playlist and the detailed articles.

## SOC operating models

| Model | Pros | Cons | Fits |
|---|---|---|---|
| In-house | Full control, deep knowledge of the environment | Hiring cost and 24/7 staffing | Large and regulated organisations |
| Managed (MSSP/MDR) | 24/7 coverage at a predictable cost | Less business context | Small and mid-sized organisations |
| Hybrid | Internal team in business hours, provider after hours | Needs clear coordination and handover | Most mid-sized organisations |

Whatever the model, **incident ownership** stays inside the organisation: the provider alerts and analyses, but isolating a production server or notifying a regulator is an internal decision.

## Roles and tiers

- **Tier 1 (triage):** receives alerts, filters false positives and escalates what matters.
- **Tier 2 (investigation):** investigates escalated incidents, scopes them and starts containment.
- **Tier 3 (threat hunting / engineering):** writes detections, hunts proactively and improves tooling.
- **Incident manager:** coordinates technical staff, leadership, legal and communications during major incidents.

## Log sources: start with what catches real attacks

The biggest mistake in SIEM projects is collecting everything and drowning in cost and noise. Prioritise sources by value:

1. **Domain controllers:** authentication events, group and account changes.
2. **Endpoints (EDR):** processes, execution chains and network connections.
3. **Remote-access gateways and firewalls:** logins and outbound connections.
4. **Email:** blocked messages, links and user-reported attachments.
5. **Cloud identity:** sign-ins and applications granted permissions.
6. **DNS and proxy:** connections to malicious or newly registered domains.

For the Windows events that matter most and how to read them, see [Windows security event IDs for SOC teams](/article/windows-security-event-ids-soc); for retention policy see [log retention and SIEM basics](/article/log-retention-siem-basics).

## How a SIEM works and how to write a good detection

A SIEM collects logs, normalises them and applies correlation rules that generate alerts. A good rule has:

- **A clear hypothesis:** e.g. "one source failing to log on to dozens of accounts within minutes indicates password spraying".
- **Confirmed source data:** make sure the event is actually collected (e.g. 4625 on domain controllers).
- **A tuned threshold:** test it on two weeks of data before enabling it, to limit false positives.
- **A linked playbook:** every alert should tell the analyst the next step.
- **A MITRE ATT&CK mapping:** makes coverage measurable and gaps visible.

A simplified rule in generic query language:

\`\`\`text
event = 4625 (failed logon)
group by: source address
condition: distinct user names >= 20 within 10 minutes
action: medium-severity alert + "Password Spray" playbook
\`\`\`

Learn more in [how a SIEM actually works](/article/how-siem-actually-works) and [how EDR actually works](/article/how-edr-actually-works).

## The incident response lifecycle

Most practitioners use the NIST lifecycle published in SP 800-61. In April 2025 NIST released Revision 3 (SP 800-61r3), which maps incident response to the Cybersecurity Framework 2.0 functions (Govern, Identify, Protect, Detect, Respond, Recover), but the practical phases remain familiar:

### 1. Preparation

- A written plan approved by leadership, with up-to-date contacts (including after hours).
- Pre-approved permissions for isolation and investigation, and tested backups.
- Out-of-band communication in case email itself is compromised.

### 2. Detection and analysis

- Decide whether the event is a real incident, and its scope and severity.
- Preserve evidence before it changes: logs, memory images where needed, copies of suspicious files.
- Keep a timeline of everything discovered.

### 3. Containment

- **Short term:** isolate the device via EDR, disable the compromised account, block an address or domain.
- **Long term:** temporary fixes that let the business keep running during clean-up.

### 4. Eradication and recovery

- Remove malware and backdoors, and reset affected credentials.
- Restore systems from clean backups and monitor closely afterwards.

### 5. Post-incident

- A blameless lessons-learned session within two weeks.
- Update detections, playbooks and the plan itself.

For the worst-case scenario see [the first hour after a ransomware attack](/article/ransomware-first-hour-response), and to rehearse the plan before you need it see [tabletop exercises](/article/incident-response-tabletop-exercises).

## Severity matrix

| Level | Criteria | Target response time |
|---|---|---|
| Critical | Ransomware encryption, domain admin compromise, confirmed data exfiltration | Immediate — activate the incident team |
| High | Spreading infected device, compromised user account with activity | Within one hour |
| Medium | Blocked malware, successful phish with no follow-on activity | Within one business day |
| Low | External port scan, blocked phish | In the routine review |

Adjust the times to your team size, but write them down in advance so decisions aren't made under pressure.

## Playbooks

A playbook turns experience into repeatable steps. Start with five that cover most incidents:

1. **Phishing:** analyse the message, find other recipients, purge it from all mailboxes, reset passwords for anyone who clicked and entered credentials.
2. **Compromised account:** disable the account or revoke sessions, review mail forwarding rules, check sign-ins from unusual locations.
3. **Malware on a device:** isolate via EDR, collect evidence, find the infection source, reimage if in doubt.
4. **Ransomware:** isolate affected networks, protect backups, inform leadership and legal, don't reboot before collecting evidence.
5. **Exploited internet-facing service:** apply the patch or mitigation, hunt for indicators of compromise, check for lateral movement.

## Communication and evidence handling during an incident

The technical work is only half of an incident; the other half is communication and documentation:

- **A dedicated incident channel:** a chat room or bridge per major incident, with a decision log updated with time and name.
- **Regular leadership updates:** a short message at an agreed interval covering what we know, what we don't, what we're doing now and when the next update is.
- **Chain of custody:** when collecting evidence that may be used legally, record who collected it, when and how it was stored, and hash the collected files.
- **Legal obligations:** some laws and customer contracts set deadlines for reporting personal-data breaches; decide in advance, with legal, who makes that call.
- **Don't rush the clean-up:** removing malware before understanding the entry point can leave the door open for the attacker to return.

## A six-month roadmap to build the capability

| Month | Goal |
|---|---|
| 1 | Inventory critical assets, name the incident owner, write a short response plan |
| 2 | Enable Windows audit policies on domain controllers and centralise their logs with EDR |
| 3 | Write 10 high-value detections linked to playbooks |
| 4 | Add VPN, firewall and email logs; measure false-positive rates |
| 5 | Run a ransomware tabletop exercise with leadership |
| 6 | Review coverage against ATT&CK and decide what to outsource |

## Metrics that matter

- **Mean time to detect (MTTD)** and **mean time to respond (MTTR)**.
- **False-positive rate** per rule; a rule that is 95% false positives burns out the team and must be tuned.
- **ATT&CK coverage:** the share of techniques with a tested detection.
- **Share of incidents detected internally** versus reported by a third party.

## Common mistakes

- Buying a SIEM before defining use cases.
- Unsynchronised time (NTP) across systems, which makes the incident timeline unreliable.
- Alerts without an owner or a playbook.
- A response plan that has never been exercised.

## FAQ

### Do I need a SIEM to start?

Not necessarily. You can start by centralising domain controller and EDR logs in one platform with a few high-value rules, then grow.

### What's the difference between EDR and SIEM?

EDR monitors endpoints in depth and can isolate them; a SIEM collects logs from many sources to correlate events across the whole environment. They complement each other.

### How often should the response plan be tested?

At least once a year with a tabletop exercise, and after any major change in architecture or staff.

### Should we pay a ransom if we're hit?

That's a business and legal decision shaped by local law and your insurance policy, and official bodies such as CISA advise against paying. What matters most is having tested, immutable backups so you're never forced to choose.

## References

- [NIST SP 800-61 Rev. 3: Incident Response Recommendations and Considerations for Cybersecurity Risk Management](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
- [NIST Cybersecurity Framework 2.0](https://www.nist.gov/cyberframework)
- [MITRE ATT&CK](https://attack.mitre.org/)
- [CISA: #StopRansomware Guide](https://www.cisa.gov/stopransomware/ransomware-guide)
`,
  },
};
