export default {
  slug: 'fortios-ssl-vpn-tunnel-mode-removal-ipsec-migration',
  categoryId: 'cybersecurity',
  subcategoryId: 'vpn-remote',
  tags: ['fortinet', 'fortigate', 'ipsec', 'ssl-vpn', 'migration'],
  domainIds: ['networking'],
  topicIds: ['vpn', 'firewalls'],
  contentType: 'guide',
  vendorIds: ['fortinet'],
  productIds: ['fortigate', 'forticlient'],
  title: {
    ar: 'إلغاء SSL VPN Tunnel Mode في FortiOS 7.6.3: خطة الترحيل إلى IPsec VPN',
    en: 'SSL VPN Tunnel Mode Removed in FortiOS 7.6.3: A Migration Plan to IPsec VPN',
  },
  excerpt: {
    ar: 'ما الذي تغيّر في FortiOS 7.6.3، ولماذا يجب الترحيل قبل الترقية، وكيف تنقل المستخدمين والمجموعات والسياسات إلى IPsec عبر TCP 443 خطوة بخطوة.',
    en: 'What changed in FortiOS 7.6.3, why you must migrate before upgrading, and how to move users, groups and policies to IPsec over TCP 443 step by step.',
  },
  body: {
    ar: `## ما الذي تغيّر بالضبط؟

وفق ملاحظات إصدار FortiOS 7.6.3 الرسمية، استُبدلت ميزة **SSL VPN Tunnel Mode** بـ**IPsec VPN** الذي يمكن ضبطه للعمل على منفذ TCP 443. لم يعد Tunnel Mode متاحًا في الواجهة الرسومية ولا في سطر الأوامر، و**لا تُرحَّل إعداداته** من الإصدارات السابقة، بما في ذلك سياسات الجدار الناري المرتبطة بواجهة ssl.root. ينطبق ذلك على كل طرازات FortiGate.

ما الذي يبقى؟

- **وضع الويب (Web Mode)** يستمر باسم جديد هو **Agentless VPN**، لكنه غير مدعوم على بعض الطرازات، والطرازات ذات ذاكرة 2 جيجابايت أو أقل لا تدعم أيًا من الوضعين.
- لم يعد FortiGate يعمل كـ"عميل SSL VPN" لجهاز FortiGate آخر؛ البديل هو IPsec بصفة عميل اتصال (Dial-up client).

**النتيجة العملية:** إذا رقّيت إلى 7.6.3 دون ترحيل، يفقد كل مستخدمي الوصول عن بُعد اتصالهم فورًا، وغالبًا يظهر لهم الخطأ ‎-7200 كما في [شرح خطأ FortiClient ‎-7200](/article/forticlient-error-7200-fix).

## لماذا IPsec عبر TCP 443؟

السبب الشائع لاختيار SSL VPN سابقًا هو أنه يعمل على منفذ 443 الذي نادرًا ما يُحجب، بينما يعتمد IPsec التقليدي على UDP 500 و4500 التي قد تحجبها بعض الشبكات أو أجهزة NAT لدى مزودي الخدمة. الحل الذي تقدمه Fortinet هو **نقل IKE وESP عبر TCP**، وهو مدعوم على FortiOS 7.4.2 فما فوق ومع FortiClient 7.4.1 فما فوق، ويستخدم منفذ 443 افتراضيًا.

## خطة الترحيل خطوة بخطوة

### 1. الجرد والتوثيق

اكتب كل ما يقدمه SSL VPN حاليًا:

| العنصر في SSL VPN | مكافئه في IPsec |
|---|---|
| المستخدمون والمجموعات (محلي، LDAP، RADIUS، SAML) | مصادقة المستخدم عبر XAuth أو EAP مع نفس المجموعات |
| نطاق عناوين النفق (IP Pool) | نطاق عناوين العملاء في Mode Config |
| الشبكات الداخلية المحمية | إعدادات المرحلة الثانية والشبكات المحمية |
| Split Tunneling | خيار IPv4 split tunnel في المرحلة الأولى |
| سياسات من ssl.root إلى LAN | نفس السياسات مع تغيير الواجهة إلى نفق IPsec |
| بوابات مختلفة لمجموعات مختلفة | أنفاق متعددة أو تمييز بـPeer ID |

### 2. النسخ الاحتياطي

خذ نسخة احتياطية كاملة من الإعدادات قبل أي تغيير، واحفظها خارج الجهاز.

### 3. بناء IPsec بالتوازي مع SSL VPN

أنشئ نفق IPsec للوصول عن بُعد على الإصدار الحالي **قبل الترقية** (7.4.x أو 7.6.0–7.6.2)، باستخدام الواجهة الرسومية أو سطر الأوامر أو خدمة FortiConverter. ابدأ بـIKEv2 حيث يدعمه عملاؤك، وخوارزميات حديثة، وفعّل النقل عبر TCP إن احتجت 443. وإذا كانت الأجهزة مُدارة عبر FortiManager، فرقِّه أولًا إلى 7.6.3 وابنِ الأنفاق منه.

### 4. تحديث FortiClient

وزّع ملف اتصال IPsec الجديد عبر FortiClient EMS أو ملف XML، وتأكد أن إصدار FortiClient يدعم IPsec عبر TCP إذا كنت تستخدمه.

### 5. تجربة محدودة

انقل مجموعة صغيرة (قسم تقنية المعلومات مثلًا) واختبر: المصادقة وMFA، الوصول إلى التطبيقات، DNS الداخلي، الأداء، والاتصال من شبكات مختلفة (منزلية، فندقية، بيانات الجوال).

### 6. النقل التدريجي ثم الترقية

بعد نجاح التجربة، انقل بقية المجموعات، وأبلغ المستخدمين بالتغيير ووفر لهم دليلًا قصيرًا. فقط بعد انتقال الجميع إلى IPsec، رقِّ إلى 7.6.3 وأزل إعدادات SSL VPN Tunnel من EMS.

## نقاط يجب الانتباه لها

- **MFA:** تأكد أن طريقة MFA الحالية (FortiToken، RADIUS، SAML) تعمل مع إعداد IPsec الجديد قبل النقل.
- **السياسات:** السياسات القديمة لا تُرحَّل؛ أعد إنشاءها على واجهة النفق الجديدة بنفس مبدأ أقل الصلاحيات.
- **السجلات والمراقبة:** حدّث قواعد الـSIEM التي كانت تعتمد على سجلات SSL VPN.
- **الطرازات الصغيرة:** راجع قيود طرازك قبل الاعتماد على Agentless VPN.

## الأسئلة الشائعة

### هل يمكن تأجيل الترقية إلى 7.6.3؟

يمكن البقاء على فرع مدعوم مثل 7.4 مؤقتًا، لكن يجب متابعة الإصلاحات الأمنية وخطة دعم الإصدار. التأجيل وقت للترحيل وليس بديلًا عنه.

### هل يحتاج المستخدمون إلى تثبيت برنامج جديد؟

يستخدمون FortiClient نفسه غالبًا، لكن بملف اتصال IPsec جديد، وقد يلزم تحديث إصدار العميل لدعم النقل عبر TCP.

### هل IPsec أكثر أمانًا من SSL VPN؟

كلاهما آمن إذا ضُبط جيدًا. ميزة IPsec أنه معيار مفتوح وواسع الدعم، والأهم في الحالتين هو التحديث المستمر وMFA وأقل الصلاحيات.

## المراجع

- [FortiOS 7.6.3 Release Notes: SSL VPN tunnel mode replaced with IPsec VPN](https://docs.fortinet.com/document/fortigate/7.6.3/fortios-release-notes/173430/ssl-vpn-tunnel-mode-replaced-with-ipsec-vpn)
- [FortiOS 7.6.3 Administration Guide: SSL VPN tunnel mode to IPsec VPN migration](https://docs.fortinet.com/document/fortigate/7.6.3/administration-guide/155142/ssl-vpn-tunnel-mode-to-ipsec-vpn-migration)
- [Fortinet Community: Changes on SSL VPN modes starting from v7.6.3](https://community.fortinet.com/fortigate-3/technical-tip-changes-on-ssl-vpn-modes-starting-from-v7-6-3-204117)
- [Fortinet Community: Using FortiManager for SSL VPN to IPsec VPN migration](https://community.fortinet.com/fortimanager-27/technical-tip-using-fortimanager-for-ssl-vpn-to-ipsec-vpn-migration-206094)
`,
    en: `## What exactly changed?

According to the official FortiOS 7.6.3 release notes, **SSL VPN tunnel mode** was replaced with **IPsec VPN**, which can be configured to use TCP port 443. Tunnel mode is no longer available in the GUI or CLI, and **its settings are not upgraded** from previous versions, including firewall policies tied to the ssl.root interface. This applies to all FortiGate models.

What remains?

- **Web mode** continues under a new name, **Agentless VPN**, but it isn't supported on some models, and models with 2 GB of RAM or less support neither mode.
- A FortiGate can no longer act as an "SSL VPN client" to another FortiGate; the replacement is an IPsec dial-up client.

**The practical consequence:** upgrade to 7.6.3 without migrating and every remote-access user loses connectivity immediately, usually with error -7200 as described in [FortiClient error -7200 explained](/article/forticlient-error-7200-fix).

## Why IPsec over TCP 443?

The usual reason for choosing SSL VPN was that it runs on port 443, which is rarely blocked, while traditional IPsec relies on UDP 500 and 4500, which some networks and carrier-grade NAT can block. Fortinet's answer is **IKE and ESP over TCP**, supported on FortiOS 7.4.2 and later with FortiClient 7.4.1 and later, using port 443 by default.

## Step-by-step migration plan

### 1. Inventory and document

Write down everything SSL VPN provides today:

| SSL VPN element | IPsec equivalent |
|---|---|
| Users and groups (local, LDAP, RADIUS, SAML) | User authentication via XAuth or EAP with the same groups |
| Tunnel IP pool | Client address range in Mode Config |
| Protected internal networks | Phase 2 settings and protected subnets |
| Split tunnelling | IPv4 split tunnel option in Phase 1 |
| ssl.root → LAN policies | The same policies with the interface changed to the IPsec tunnel |
| Different portals for different groups | Multiple tunnels or Peer ID differentiation |

### 2. Back up

Take a full configuration backup before any change and store it off the device.

### 3. Build IPsec alongside SSL VPN

Create the remote-access IPsec tunnel on your current version **before upgrading** (7.4.x or 7.6.0–7.6.2), using the GUI, CLI or the FortiConverter service. Start with IKEv2 where your clients support it, modern algorithms, and TCP transport if you need 443. If devices are managed by FortiManager, upgrade FortiManager to 7.6.3 first and build the tunnels there.

### 4. Update FortiClient

Push the new IPsec connection profile via FortiClient EMS or an XML configuration, and make sure the FortiClient version supports IPsec over TCP if you use it.

### 5. Limited pilot

Move a small group (IT, for example) and test: authentication and MFA, application access, internal DNS, performance, and connecting from different networks (home, hotel, mobile data).

### 6. Gradual cutover, then upgrade

After a successful pilot, move the remaining groups, announce the change and give users a short guide. Only once everyone is on IPsec, upgrade to 7.6.3 and remove the SSL VPN tunnel settings from EMS.

## Watch-outs

- **MFA:** confirm your current MFA method (FortiToken, RADIUS, SAML) works with the new IPsec setup before moving users.
- **Policies:** old policies don't migrate; recreate them on the new tunnel interface with least privilege.
- **Logging and monitoring:** update SIEM rules that relied on SSL VPN logs.
- **Small models:** check your model's limits before relying on Agentless VPN.

## FAQ

### Can we postpone upgrading to 7.6.3?

You can stay on a supported branch such as 7.4 for a while, but keep up with security fixes and the version support timeline. Postponing buys time to migrate; it isn't a substitute.

### Do users need new software?

Usually the same FortiClient with a new IPsec profile, though a client update may be needed for TCP transport.

### Is IPsec more secure than SSL VPN?

Both are secure when configured well. IPsec's advantage is that it's an open, widely supported standard; in both cases what matters most is patching, MFA and least privilege.

## References

- [FortiOS 7.6.3 Release Notes: SSL VPN tunnel mode replaced with IPsec VPN](https://docs.fortinet.com/document/fortigate/7.6.3/fortios-release-notes/173430/ssl-vpn-tunnel-mode-replaced-with-ipsec-vpn)
- [FortiOS 7.6.3 Administration Guide: SSL VPN tunnel mode to IPsec VPN migration](https://docs.fortinet.com/document/fortigate/7.6.3/administration-guide/155142/ssl-vpn-tunnel-mode-to-ipsec-vpn-migration)
- [Fortinet Community: Changes on SSL VPN modes starting from v7.6.3](https://community.fortinet.com/fortigate-3/technical-tip-changes-on-ssl-vpn-modes-starting-from-v7-6-3-204117)
- [Fortinet Community: Using FortiManager for SSL VPN to IPsec VPN migration](https://community.fortinet.com/fortimanager-27/technical-tip-using-fortimanager-for-ssl-vpn-to-ipsec-vpn-migration-206094)
`,
  },
};
