عندما لا تمر حركة عبر FortiGate ولا تكفي السجلات لمعرفة السبب، فإن أداة **Debug Flow** تخبرك بقرار الجدار الناري تجاه كل حزمة: المسار الذي وجده، والسياسة التي طابقها، وهل طُبّق NAT، أو لماذا أسقط الحزمة. ومع أداة Sniffer تستطيع خلال دقائق الإجابة عن السؤال الأهم: هل المشكلة في الجدار الناري أم في مكان آخر؟

## تسلسل آمن للأوامر

```text
diagnose debug reset
diagnose debug flow filter clear
diagnose debug flow filter addr 10.10.20.15
diagnose debug flow filter dport 443
diagnose debug flow show function-name enable
diagnose debug console timestamp enable
diagnose debug flow trace start 100
diagnose debug enable
```

بعدها أعد تنفيذ المشكلة (افتح الموقع أو ابدأ الاتصال)، ثم أوقف التتبع:

```text
diagnose debug disable
diagnose debug flow trace stop
diagnose debug reset
```

المرشح `addr` يطابق المصدر أو الوجهة، ويمكن التضييق باستخدام `saddr` و`daddr` و`sport` و`dport` و`proto`، أما IPv6 فيستخدم `filter6` و`trace start6`. والرقم 100 يوقف التتبع تلقائيًا بعد 100 سطر حمايةً للمعالج. والأداة نفسها متاحة في الواجهة الرسومية من Network ثم Diagnostics ثم Debug Flow مع إمكانية التصدير بصيغة CSV.

## قراءة النتائج

- **received a packet ... from port2:** وصلت الحزمة ومعها عناوينها ومنافذها وواجهة الدخول.
- **allocate a new session:** هذه أول حزمة في اتصال جديد.
- **find a route ... via port1:** قرار التوجيه وواجهة الخروج.
- **find SNAT:** تم تطبيق NAT للمصدر.
- **Allowed by Policy-12:** السياسة التي سمحت بالحركة.
- **Denied by forward policy check (policy 0):** لم تطابق أي سياسة، فأسقطها المنع الضمني.
- **reverse path check fail, drop:** مسار العودة إلى المصدر يمر بواجهة مختلفة، وهي حماية ضد انتحال العناوين.
- **iprope_in_check() check failed on policy 0:** حركة موجهة إلى الجدار نفسه مرفوضة، مثل محاولة إدارة على واجهة غير مسموح بها.

**السياسة رقم 0 تعني دائمًا المنع الضمني.** راجع الواجهات والعناوين والخدمات والجدول الزمني في السياسة التي توقعت أن تطابق، ويمكنك استخدام Policy Lookup في الواجهة الرسومية للتأكد.

## لا يظهر أي شيء؟

إما أن الحزمة لم تصل إلى الجدار أصلًا، وإما أن الجلسة يتم تسريعها عبر معالجات NP6 أو NP7، وهذه الجلسات لا تظهر في Debug Flow. اختبر باستخدام ICMP لأنه لا يُسرَّع، أو عطّل التسريع مؤقتًا في السياسة التي تختبرها كما يشرح توثيق Fortinet، ثم أعده بعد الانتهاء.

## أداة Sniffer

```text
diagnose sniffer packet any 'host 10.10.20.15 and port 443' 4 20 l
```

الترتيب: الواجهة (any للكل)، ثم مرشح بصيغة tcpdump، ثم مستوى التفصيل (4 يعرض اسم الواجهة)، ثم عدد الحزم، ثم l للوقت المحلي.

| ما تراه | الاستنتاج |
|---|---|
| الحزمة تدخل ولا تخرج | ابحث عن سبب الإسقاط في Debug Flow |
| الحزمة تخرج ولا يعود رد | المشكلة بعد الجدار (المزوّد أو الخادم) |
| لا شيء يصل | التوجيه أو المحولات قبل الجدار |

## أوامر مساعدة

جدول الجلسات عبر `diagnose sys session filter` ثم `diagnose sys session list`، مع مسح المرشح بعد الانتهاء. وجدول التوجيه عبر `get router info routing-table all`. ولمشكلات IPsec راجع [دليل IPsec بين FortiGate وPalo Alto](/article/ipsec-site-to-site-fortigate-palo-alto)، وللإعداد الأولي [دليل تجهيز FortiGate](/article/fortigate-initial-setup-enterprise-guide).

## الأسئلة الشائعة

### هل التتبع آمن على جدار يعمل في الإنتاج؟

نعم مع مرشحات دقيقة وعدد محدد للأسطر، فالتتبع دون مرشح على جهاز مزدحم يرفع استهلاك المعالج. وإذا كان الجهاز يرسل سجلاته إلى FortiAnalyzer أو FortiCloud فقد تُسجَّل مخرجات التتبع كأحداث، فلا تتركه يعمل.

### لماذا يتوقف الإخراج بعد أسطر قليلة؟

لأنك وصلت إلى العدد المحدد في `trace start`، أعد التشغيل برقم أكبر.

## المراجع

- [Fortinet: Debugging the packet flow](https://docs.fortinet.com/document/fortigate/7.6.6/administration-guide/54688)
- [Fortinet: Performing a traffic trace](https://docs.fortinet.com/document/fortigate/7.6.6/administration-guide/314439)
