## لماذا قاعدة مخصصة إذا كانت القواعد الجاهزة موجودة؟

يأتي Wazuh بقواعد جاهزة لكشف التخمين؛ مثلًا القاعدة 5763 تنبّه عندما تتكرر رسالة فشل مصادقة SSH (القاعدة 5760) ثماني مرات خلال 120 ثانية من العنوان نفسه، والقاعدة 60204 تفعل شيئًا مشابهًا لفشل الدخول على Windows. لكن العتبة المناسبة تختلف من بيئة لأخرى: خادم قفز (jump host) لا يدخل عليه إلا ثلاثة مهندسين يستحق عتبة أقل بكثير من خادم ويب عام يتعرض لضجيج الإنترنت طوال اليوم.

القاعدة المخصصة تتيح لك ضبط العتبة والمدة والخطورة بحسب قيمة الأصل، دون تعديل ملفات Wazuh الأصلية التي تُستبدل عند التحديث.

## أين تكتب القاعدة؟

- الملف: `/var/ossec/etc/rules/local_rules.xml` على خادم Wazuh.
- أرقام القواعد المخصصة: بين **100000 و120000** حسب توصية Wazuh، حتى لا تتعارض مع القواعد الأصلية.

## القاعدة الأولى: تخمين SSH على خادم القفز

```xml
<group name="local,sshd,brute_force,">
  <rule id="100100" level="12" frequency="4" timeframe="300">
    <if_matched_sid>5760</if_matched_sid>
    <same_srcip />
    <hostname>^jump-01$</hostname>
    <description>Jump host: 4 SSH authentication failures from $(srcip) in 5 minutes</description>
    <mitre>
      <id>T1110</id>
    </mitre>
  </rule>
</group>
```

شرح العناصر:

- `if_matched_sid 5760`: تعتمد على القاعدة الجاهزة التي تفك رسالة فشل SSH، فلا داعي لكتابة decoder.
- `frequency="4" timeframe="300"`: أربع حالات خلال خمس دقائق.
- `same_srcip`: من العنوان نفسه، حتى لا تجمع محاولات مستخدمين مختلفين.
- `level="12"`: خطورة أعلى من القاعدة العامة لأن الأصل حساس.

## القاعدة الثانية: فشل دخول RDP على Windows

```xml
<group name="local,windows,brute_force,">
  <rule id="100110" level="10" frequency="6" timeframe="180">
    <if_matched_sid>60122</if_matched_sid>
    <same_field>win.eventdata.ipAddress</same_field>
    <description>6 Windows logon failures (4625) from $(win.eventdata.ipAddress) in 3 minutes</description>
    <mitre>
      <id>T1110</id>
    </mitre>
  </rule>
</group>
```

القاعدة 60122 هي القاعدة الجاهزة لحدث 4625 (فشل الدخول بسبب اسم مستخدم أو كلمة مرور خاطئة). لاحظ استخدام `same_field` لأن عنوان المصدر في أحداث Windows يأتي في حقل `win.eventdata.ipAddress`. خلفية الحدث في [دليل معرّفات أحداث Windows لمحللي SOC](/article/windows-security-event-ids-soc).

## الاختبار قبل التفعيل

1. تحقق من صحة الصيغة وأعد تشغيل المدير:

```bash
sudo systemctl restart wazuh-manager
```

2. استخدم `wazuh-logtest` لتمرير سطر سجل حقيقي ورؤية أي قاعدة تطابقه:

```bash
sudo /var/ossec/bin/wazuh-logtest
```

الصق سطر فشل SSH من `/var/log/auth.log` عدة مرات، وتأكد من ظهور القاعدة 100100 بعد التكرار الرابع.

3. نفّذ اختبارًا حقيقيًا في المختبر بمحاولات دخول خاطئة من جهاز آخر، وتأكد من ظهور التنبيه في لوحة التحكم. يمكنك تجهيز بيئة لذلك كما في [مختبر Wazuh وSysmon المجاني](/article/wazuh-sysmon-free-soc-lab).

## الاستجابة التلقائية (بحذر)

يدعم Wazuh الاستجابة التلقائية (Active Response)، مثل حظر العنوان مؤقتًا بسكربت `firewall-drop` عند تطابق القاعدة. أضف في `ossec.conf` على المدير كتلة `active-response` تحدد الأمر والقاعدة 100100 ومدة الحظر. ابدأ بمدة قصيرة، واستثنِ عناوين الإدارة والماسحات الأمنية الداخلية، وإلا قد تحظر فريقك بنفسك.

## أخطاء شائعة

- تعديل ملفات القواعد الأصلية بدل `local_rules.xml`، فتضيع التعديلات بعد التحديث.
- عتبة منخفضة جدًا على أصول عامة تولّد مئات التنبيهات يوميًا.
- نسيان `same_srcip` أو `same_field`، فتجمع القاعدة فشل مستخدمين متفرقين وتنبّه بلا معنى.

لتوسيع هذا المنهج إلى تقنيات أخرى راجع [تحويل MITRE ATT&CK إلى قواعد كشف](/article/mitre-attack-to-detections).

## الأسئلة الشائعة

**هل `same_srcip` و`same_source_ip` شيء واحد؟**
نعم؛ وثائق Wazuh الحالية تعتبر `same_source_ip` اسمًا قديمًا (deprecated) يعمل كاسم بديل لـ`same_srcip`.

**هل أرفع مستوى القاعدة إلى 15؟**
احتفظ بالمستويات العليا للحالات المؤكدة تقريبًا. التخمين وحده محاولة، وليس اختراقًا.

**كيف أكشف دخولًا ناجحًا بعد تخمين؟**
هذا أهم من التخمين نفسه. اربط تنبيه التخمين بحدث نجاح الدخول من العنوان نفسه في SIEM أو أثناء التحقيق، وتعامل معه كحادث محتمل.

## المراجع

- [Custom rules — Wazuh Documentation](https://documentation.wazuh.com/current/user-manual/ruleset/rules/custom.html)
- [Rules XML syntax — Wazuh Documentation](https://documentation.wazuh.com/current/user-manual/ruleset/ruleset-xml-syntax/rules.html)
- [wazuh-logtest — Wazuh Documentation](https://documentation.wazuh.com/current/user-manual/reference/tools/wazuh-logtest.html)
- [Active response — Wazuh Documentation](https://documentation.wazuh.com/current/user-manual/capabilities/active-response/index.html)
