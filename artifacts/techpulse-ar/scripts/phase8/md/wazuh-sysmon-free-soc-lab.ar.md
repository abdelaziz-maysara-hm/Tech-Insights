## لماذا تبني مختبرًا بنفسك؟

قراءة الكتب عن SIEM مفيدة، لكن المحلل الحقيقي يتعلم عندما يرى حدثًا خامًا ثم تنبيهًا ثم يسأل: هل هذا هجوم أم ضجيج؟ مختبر صغير من جهازين افتراضيين يعطيك هذه التجربة مجانًا: **Wazuh** كمنصة SIEM/XDR مفتوحة المصدر، و**Sysmon** من Microsoft Sysinternals ليعطيك رؤية تفصيلية لما يحدث داخل Windows.

إن كانت فكرة SIEM جديدة عليك فابدأ بـ[كيف يعمل SIEM فعليًا](/article/how-siem-actually-works).

## ماذا تحتاج؟

- جهاز مضيف بذاكرة 16 جيجابايت على الأقل وبرنامج افتراضية (VirtualBox أو VMware Workstation أو Hyper-V).
- جهاز Linux افتراضي لخادم Wazuh (Ubuntu مثلًا). راجع جدول متطلبات العتاد في دليل Wazuh Quickstart قبل تحديد الذاكرة والمعالج.
- جهاز Windows 10/11 أو Windows Server تقييمي كضحية.
- شبكة افتراضية **معزولة** (Host-only أو NAT داخلي). لا تربط المختبر بشبكة العمل.

## الخطوة 1: تثبيت Wazuh بأمر واحد

توفر Wazuh مثبّتًا يجمع المكونات الثلاثة (indexer وserver وdashboard) على جهاز واحد، وهو مناسب تمامًا للمختبر:

```bash
curl -sO https://packages.wazuh.com/4.14/wazuh-install.sh
sudo bash ./wazuh-install.sh -a
```

في نهاية التثبيت يطبع السكربت كلمة مرور المستخدم `admin` للوحة التحكم. احفظها، ثم افتح `https://<IP-الخادم>` من المتصفح. الرقم 4.14 هو الإصدار وقت كتابة المقال؛ تحقق دائمًا من الإصدار الحالي في الوثائق الرسمية قبل النسخ.

## الخطوة 2: تثبيت Sysmon على جهاز Windows

Sysmon وحده لا يفعل شيئًا مفيدًا بدون ملف إعداد جيد. ابدأ بإعداد مجتمعي معروف مثل sysmon-config من SwiftOnSecurity أو sysmon-modular من Olaf Hartong، ثم عدّله لاحقًا:

```powershell
.\Sysmon64.exe -accepteula -i sysmonconfig.xml
```

ستظهر الأحداث في Event Viewer تحت `Applications and Services Logs > Microsoft > Windows > Sysmon > Operational`. أهم الأحداث للبداية: 1 (إنشاء عملية مع سطر الأوامر)، 3 (اتصال شبكي)، 10 (وصول عملية إلى أخرى، مهم لكشف سرقة بيانات LSASS)، 11 (إنشاء ملف).

## الخطوة 3: تثبيت وكيل Wazuh وربط Sysmon

من لوحة Wazuh اختر **Deploy new agent**، واختر Windows، وانسخ أمر PowerShell الذي تولّده اللوحة وشغّله كمسؤول. بعد ظهور الوكيل متصلًا، أضف قناة Sysmon إلى ملف `ossec.conf` على الوكيل:

```xml
<localfile>
  <location>Microsoft-Windows-Sysmon/Operational</location>
  <log_format>eventchannel</log_format>
</localfile>
```

أعد تشغيل خدمة الوكيل، وستبدأ أحداث Sysmon بالوصول إلى الخادم حيث تفك قواعد Wazuh الجاهزة جزءًا كبيرًا منها.

## الخطوة 4: ولّد نشاطًا مشبوهًا بشكل آمن

لا تستخدم برمجيات خبيثة حقيقية. مشروع Atomic Red Team يوفر اختبارات صغيرة مرتبطة بتقنيات MITRE ATT&CK. أمثلة للبداية داخل جهاز المختبر فقط:

- محاولات دخول فاشلة متكررة لتوليد الحدث 4625.
- تشغيل PowerShell بأمر مرمّز (`-EncodedCommand`) لرؤية الحدث 1 في Sysmon.
- إنشاء مستخدم محلي جديد وإضافته لمجموعة Administrators.

## الخطوة 5: تدرّب على الفرز كمحلل

لكل تنبيه اسأل خمسة أسئلة: ما الجهاز؟ ما المستخدم؟ ما العملية الأب؟ ماذا حدث قبله وبعده بخمس دقائق؟ هل هو متوقع؟ دوّن الإجابات في قالب تذكرة بسيط، فهذه بالضبط مهارة مقابلات وظائف SOC. اربط ما تراه بأرقام أحداث Windows المذكورة في [دليل معرّفات أحداث Windows لمحللي SOC](/article/windows-security-event-ids-soc).

## الخطوة التالية

بعد أن تعتاد على التنبيهات الجاهزة، اكتب قاعدتك الخاصة كما في [قاعدة Wazuh مخصصة لكشف التخمين](/article/wazuh-custom-rule-brute-force)، ثم وسّع التغطية بمنهج [تحويل MITRE ATT&CK إلى قواعد كشف](/article/mitre-attack-to-detections).

## الأسئلة الشائعة

**هل يكفي Wazuh وحده بدون Sysmon؟**
يعمل، لكن سجلات Windows الافتراضية لا تسجّل سطر أوامر العمليات ولا الاتصالات الشبكية لكل عملية بالتفصيل. Sysmon يسد هذه الفجوة.

**هل يمكن تشغيل المختبر على السحابة؟**
نعم، لكن انتبه للتكلفة ولا تعرض لوحة Wazuh على الإنترنت دون تقييد العناوين.

**هل اختبارات Atomic Red Team آمنة؟**
مصممة للاختبار، لكن بعضها يغيّر إعدادات النظام. شغّلها في جهاز افتراضي معزول وخذ Snapshot قبلها.

## المراجع

- [Wazuh Quickstart — Wazuh Documentation](https://documentation.wazuh.com/current/quickstart.html)
- [Log data collection — Wazuh Documentation](https://documentation.wazuh.com/current/user-manual/capabilities/log-data-collection/index.html)
- [Sysmon — Microsoft Sysinternals](https://learn.microsoft.com/sysinternals/downloads/sysmon)
- [Atomic Red Team — Red Canary (GitHub)](https://github.com/redcanaryco/atomic-red-team)
