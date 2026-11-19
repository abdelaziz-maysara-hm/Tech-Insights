export default {
  slug: 'windows-security-event-ids-soc',
  categoryId: 'cybersecurity',
  subcategoryId: 'guides-tips',
  tags: ['windows', 'event-logs', 'soc', 'siem', 'detection'],
  domainIds: ['cybersecurity'],
  topicIds: ['siem-soc', 'threat-detection', 'active-directory'],
  contentType: 'guide',
  vendorIds: ['microsoft'],
  productIds: ['windows-server'],
  title: {
    ar: 'أهم معرّفات أحداث أمان Windows لفرق SOC: ماذا تراقب ولماذا',
    en: 'Key Windows Security Event IDs for SOC Teams: What to Monitor and Why',
  },
  excerpt: {
    ar: 'جدول مرجعي لأحداث Windows الأمنية الأهم: تسجيل الدخول، الحسابات والمجموعات، Kerberos، العمليات والخدمات والمهام المجدولة، ومسح السجلات، مع سياسات التدقيق اللازمة.',
    en: 'Reference table of key Windows security events — logons, accounts and groups, Kerberos, processes, services, scheduled tasks, log clearing — and the audit policy they need.',
  },
  body: {
    ar: `## لماذا هذه الأحداث تحديدًا؟

يولّد Windows مئات أنواع الأحداث، وجمعها كلها يرفع تكلفة الـSIEM ويغرق المحللين. هذه القائمة تركز على الأحداث التي تكشف خطوات الهجوم الشائعة: الدخول بكلمات مرور مسروقة، وإنشاء حسابات للثبات، وإضافة صلاحيات، وتشغيل أدوات، ومحو الآثار.

**تنبيه مهم:** كثير من هذه الأحداث لا يُسجَّل افتراضيًا. يجب تفعيل **سياسة التدقيق المتقدمة (Advanced Audit Policy)** عبر سياسات المجموعات، وإلا ستبحث عن أحداث غير موجودة. ابدأ بتوصيات Microsoft للسياسات الأساسية.

## تسجيل الدخول والمصادقة

| المعرّف | الحدث | ما يهم المحلل |
|---|---|---|
| 4624 | تسجيل دخول ناجح | نوع الدخول (Logon Type): 2 تفاعلي، 3 شبكي، 10 RDP؛ ومصدر الدخول |
| 4625 | فشل تسجيل الدخول | رمز الحالة يوضح السبب؛ كثرته من مصدر واحد على حسابات متعددة تعني Password Spray |
| 4648 | تسجيل دخول ببيانات اعتماد صريحة | استخدام runas أو أدوات حركة جانبية |
| 4672 | منح صلاحيات خاصة لجلسة | دخول حساب مميز؛ راقب الحسابات المميزة على أجهزة غير متوقعة |
| 4740 | قفل حساب | محاولات تخمين؛ المصدر يظهر في حقل Caller Computer Name |
| 4776 | تحقق NTLM على وحدة التحكم | يكشف استمرار استخدام NTLM ومصادره |

### أحداث Kerberos على وحدات التحكم

| المعرّف | الحدث | ما يهم المحلل |
|---|---|---|
| 4768 | طلب تذكرة TGT | فشل متكرر قد يشير إلى تخمين، وحسابات بلا مصادقة مسبقة مستهدفة بهجوم AS-REP Roasting |
| 4769 | طلب تذكرة خدمة | تشفير 0x17 (RC4) وطلبات كثيرة لخدمات مختلفة من حساب واحد قد تشير إلى Kerberoasting |
| 4771 | فشل المصادقة المسبقة لـKerberos | رمز 0x18 يعني كلمة مرور خاطئة |

تفاصيل الكشف في [كشف هجوم Kerberoasting ومنعه](/article/kerberoasting-detection-prevention)، وخلفية البروتوكول في [شرح مصادقة Kerberos](/article/kerberos-authentication-explained).

## إدارة الحسابات والمجموعات

| المعرّف | الحدث | لماذا يهم |
|---|---|---|
| 4720 | إنشاء حساب مستخدم | حسابات ثبات ينشئها المهاجم |
| 4722 | تفعيل حساب | تفعيل حساب معطل قديم |
| 4724 | محاولة إعادة تعيين كلمة مرور | إعادة تعيين كلمة مرور حساب مميز من حساب غير متوقع |
| 4728 | إضافة عضو لمجموعة أمان عامة (Global) | مثل Domain Admins |
| 4732 | إضافة عضو لمجموعة محلية (Local) | مثل Administrators على خادم |
| 4756 | إضافة عضو لمجموعة شاملة (Universal) | مثل Enterprise Admins |
| 4738 | تعديل حساب مستخدم | تغييرات على خصائص حساسة |

## العمليات والخدمات والمهام المجدولة

| المعرّف | السجل | الحدث | لماذا يهم |
|---|---|---|---|
| 4688 | Security | إنشاء عملية | فعّل تضمين سطر الأوامر لرؤية الأوامر الكاملة |
| 4697 | Security | تثبيت خدمة | أدوات الحركة الجانبية تثبت خدمات مؤقتة |
| 7045 | System | تثبيت خدمة جديدة | مكمّل لـ4697 ويظهر افتراضيًا |
| 4698 | Security | إنشاء مهمة مجدولة | وسيلة ثبات شائعة |
| 4104 | PowerShell/Operational | تسجيل كتل البرامج النصية | يكشف أوامر PowerShell المشفرة أو المموهة بعد فك التشويش |

لاستخدام المهام المجدولة بشكل مشروع راجع [أتمتة Windows بجدولة المهام](/article/windows-task-scheduler-automation).

## مسح السجلات وتعطيل التدقيق

| المعرّف | الحدث | لماذا يهم |
|---|---|---|
| 1102 | مسح سجل الأمان | نادرًا ما يكون مشروعًا؛ نبّه عليه دائمًا |
| 4719 | تغيير سياسة التدقيق | محاولة لإخفاء النشاط |

هذا سبب مهم لإرسال السجلات إلى خادم مركزي فورًا: إذا مُسح السجل محليًا تبقى نسخته في الـSIEM.

## قواعد كشف مقترحة للبدء

1. **Password Spray:** حدث 4625 من مصدر واحد على 20 اسم مستخدم مختلفًا أو أكثر خلال 10 دقائق.
2. **إضافة إلى مجموعة مميزة:** أي 4728 أو 4732 أو 4756 على Domain Admins أو Enterprise Admins أو Administrators على وحدات التحكم.
3. **مسح السجل:** أي 1102 أو 4719.
4. **خدمة جديدة على خادم:** 7045 أو 4697 خارج نافذة التغيير المعتمدة.
5. **RDP غير متوقع:** 4624 بنوع 10 إلى خادم حساس من جهاز غير محطة إدارة.
6. **RC4 لحساب خدمة:** 4769 بتشفير 0x17 لحساب تعرف أنه يدعم AES.

## نصائح تشغيلية

- **حجم السجل:** الحجم الافتراضي لسجل Security صغير على الخوادم المزدحمة؛ زد الحجم أو أرسل الأحداث فورًا.
- **مزامنة الوقت:** بدون NTP موحد لا يمكن بناء خط زمني موثوق.
- **السياق:** حدث واحد نادرًا ما يكفي؛ اربط الأحداث معًا (فشل متكرر ثم نجاح ثم 4672).

للقراءة اليدوية للسجلات راجع [سجلات الأمان في Event Viewer](/article/windows-event-viewer-security-logs)، وللصورة الكاملة راجع [دليل مركز العمليات الأمنية والاستجابة للحوادث](/article/soc-incident-response-guide).

## الأسئلة الشائعة

### لماذا لا أرى الحدث 4688 مع سطر الأوامر؟

يجب تفعيل تدقيق إنشاء العمليات وتفعيل إعداد "Include command line in process creation events" عبر سياسات المجموعات.

### هل أجمع أحداث كل الأجهزة أم وحدات التحكم فقط؟

ابدأ بوحدات التحكم والخوادم الحرجة، ثم الأجهزة الطرفية عبر الـEDR أو Windows Event Forwarding حسب الميزانية.

### هل يكفي Sysmon بدل سجلات Windows؟

Sysmon من Microsoft Sysinternals يضيف تفاصيل غنية (مثل الاتصالات الشبكية وتحميل المكتبات) ويكمل سجلات Windows ولا يحل محل أحداث المصادقة على وحدات التحكم.

## المراجع

- [Microsoft Learn: Advanced security audit policy settings](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/advanced-security-audit-policy-settings)
- [Microsoft Learn: Event 4769 — A Kerberos service ticket was requested](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769)
- [Microsoft Learn: Events to monitor (Active Directory)](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/appendix-l--events-to-monitor)
- [Microsoft Learn: Sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon)
`,
    en: `## Why these events in particular?

Windows generates hundreds of event types, and collecting them all inflates SIEM cost and drowns analysts. This list focuses on events that reveal common attack steps: logging on with stolen passwords, creating persistence accounts, adding privileges, running tools and erasing traces.

**Important:** many of these events are not logged by default. You must enable **Advanced Audit Policy** through Group Policy, or you'll be hunting for events that don't exist. Start from Microsoft's baseline recommendations.

## Logons and authentication

| ID | Event | What matters to the analyst |
|---|---|---|
| 4624 | Successful logon | Logon type: 2 interactive, 3 network, 10 RDP; and the source |
| 4625 | Failed logon | The status code explains why; many from one source across many accounts means password spraying |
| 4648 | Logon with explicit credentials | runas or lateral-movement tooling |
| 4672 | Special privileges assigned to a logon | Privileged logon; watch privileged accounts on unexpected machines |
| 4740 | Account locked out | Guessing; the source appears in Caller Computer Name |
| 4776 | NTLM validation on a DC | Shows continued NTLM use and its sources |

### Kerberos events on domain controllers

| ID | Event | What matters to the analyst |
|---|---|---|
| 4768 | TGT requested | Repeated failures may mean guessing; accounts without pre-authentication are AS-REP roasting targets |
| 4769 | Service ticket requested | Type 0x17 (RC4) and many different services requested by one account may indicate Kerberoasting |
| 4771 | Kerberos pre-authentication failed | Code 0x18 means a bad password |

Detection details in [Kerberoasting detection and prevention](/article/kerberoasting-detection-prevention); protocol background in [Kerberos authentication explained](/article/kerberos-authentication-explained).

## Account and group management

| ID | Event | Why it matters |
|---|---|---|
| 4720 | User account created | Attacker persistence accounts |
| 4722 | Account enabled | Re-enabling an old disabled account |
| 4724 | Password reset attempted | Reset of a privileged account by an unexpected account |
| 4728 | Member added to a global security group | Such as Domain Admins |
| 4732 | Member added to a local security group | Such as Administrators on a server |
| 4756 | Member added to a universal security group | Such as Enterprise Admins |
| 4738 | User account changed | Changes to sensitive attributes |

## Processes, services and scheduled tasks

| ID | Log | Event | Why it matters |
|---|---|---|---|
| 4688 | Security | Process created | Enable command-line inclusion to see full commands |
| 4697 | Security | Service installed | Lateral-movement tools install temporary services |
| 7045 | System | New service installed | Complements 4697 and is logged by default |
| 4698 | Security | Scheduled task created | A common persistence method |
| 4104 | PowerShell/Operational | Script block logging | Reveals encoded or obfuscated PowerShell after deobfuscation |

For legitimate scheduled-task use see [Windows Task Scheduler automation](/article/windows-task-scheduler-automation).

## Log clearing and audit tampering

| ID | Event | Why it matters |
|---|---|---|
| 1102 | Security log cleared | Rarely legitimate; always alert |
| 4719 | Audit policy changed | An attempt to hide activity |

This is a key reason to forward logs centrally in real time: if the local log is cleared, the SIEM still has the copy.

## Starter detection rules

1. **Password spray:** 4625 from one source against 20+ distinct user names within 10 minutes.
2. **Privileged group addition:** any 4728, 4732 or 4756 on Domain Admins, Enterprise Admins or Administrators on DCs.
3. **Log clearing:** any 1102 or 4719.
4. **New service on a server:** 7045 or 4697 outside the approved change window.
5. **Unexpected RDP:** 4624 type 10 to a sensitive server from a non-admin workstation.
6. **RC4 for a service account:** 4769 with type 0x17 for an account you know supports AES.

## Operational tips

- **Log size:** the default Security log size is small for busy servers; increase it or forward events immediately.
- **Time sync:** without consistent NTP you can't build a trustworthy timeline.
- **Context:** one event rarely suffices; correlate (repeated failures, then success, then 4672).

For reading logs by hand see [Event Viewer security logs](/article/windows-event-viewer-security-logs); for the big picture see the [SOC and incident response guide](/article/soc-incident-response-guide).

## FAQ

### Why don't I see 4688 with the command line?

You must enable process creation auditing and the "Include command line in process creation events" setting through Group Policy.

### Should I collect events from every device or just DCs?

Start with domain controllers and critical servers, then endpoints through EDR or Windows Event Forwarding as budget allows.

### Can Sysmon replace Windows logs?

Sysmon from Microsoft Sysinternals adds rich detail (such as network connections and image loads) and complements Windows logs; it doesn't replace authentication events on domain controllers.

## References

- [Microsoft Learn: Advanced security audit policy settings](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/advanced-security-audit-policy-settings)
- [Microsoft Learn: Event 4769 — A Kerberos service ticket was requested](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769)
- [Microsoft Learn: Events to monitor (Active Directory)](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/appendix-l--events-to-monitor)
- [Microsoft Learn: Sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon)
`,
  },
};
