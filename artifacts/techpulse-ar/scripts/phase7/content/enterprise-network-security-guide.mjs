export default {
  slug: 'enterprise-network-security-guide',
  pillar: true,
  categoryId: 'cybersecurity',
  subcategoryId: 'network-security',
  tags: ['network-security', 'firewall', 'vpn', 'segmentation', 'pillar'],
  domainIds: ['networking', 'cybersecurity'],
  topicIds: ['firewalls', 'vpn', 'routing-switching', 'nac'],
  contentType: 'guide',
  vendorIds: ['fortinet', 'palo-alto'],
  productIds: ['fortigate'],
  title: {
    ar: 'أمن الشبكات المؤسسية: الدليل الشامل للجدران النارية والـVPN',
    en: 'Enterprise Network Security: The Complete Guide',
  },
  excerpt: {
    ar: 'مرجع عملي لتصميم شبكة مؤسسية آمنة: طبقات الحماية، سياسات الجدار الناري، الوصول عن بُعد بعد إلغاء SSL VPN Tunnel Mode، التقسيم بالـVLAN، والمراقبة.',
    en: 'Design a secure enterprise network: defense layers, firewall policy, remote access after SSL VPN tunnel mode removal, segmentation and monitoring.',
  },
  body: {
    ar: `## لماذا يحتاج أمن الشبكة إلى خطة وليس إلى جهاز؟

يشتري كثير من الفرق جدارًا ناريًا من الجيل التالي ثم يعتبرون أن الشبكة أصبحت آمنة. الواقع أن الجهاز مجرد أداة لتنفيذ سياسة؛ فإذا كانت الشبكة الداخلية مسطحة، وكانت القواعد تسمح بـ"any-any"، وكانت حسابات الإدارة مكشوفة على الإنترنت، فلن ينقذك أي ترخيص. هذا الدليل يجمع ما تحتاجه لبناء شبكة مؤسسية يمكن الدفاع عنها، ويربطك بالمقالات التفصيلية وقائمة التشغيل المرئية الخاصة بكل جزء.

الفكرة الأساسية هي **الدفاع في العمق**: لا نعتمد على طبقة واحدة، بل نرتب طبقات متتالية بحيث إذا فشلت إحداها كشفت الطبقة التالية الهجوم أو أبطأته.

## الطبقات الخمس لشبكة مؤسسية آمنة

### 1. الحافة (Perimeter)

الجدار الناري على حافة الإنترنت يفصل بين الشبكة الداخلية والعالم الخارجي. مهامه الأساسية:

- منع كل الاتصالات الواردة افتراضيًا، والسماح فقط بالخدمات المنشورة عمدًا (مثل بوابة VPN أو خادم بريد).
- فحص الترافيك الصادر أيضًا؛ فالبرمجيات الخبيثة تتصل بخوادم التحكم من الداخل إلى الخارج.
- تفعيل خدمات الحماية مثل IPS وتصفية الويب وفحص التطبيقات وفق مخاطر كل قاعدة.

### 2. التقسيم الداخلي (Segmentation)

الشبكة المسطحة تعني أن جهاز موظف مصابًا يستطيع الوصول إلى خوادم قواعد البيانات مباشرة. التقسيم بالـVLAN ثم فرض السياسة بين الأقسام عبر الجدار الناري يحدّ من الحركة الجانبية. ابدأ بتقسيم بسيط:

| المنطقة | أمثلة | من يصل إليها |
|---|---|---|
| المستخدمون | أجهزة الموظفين | الإنترنت وخدمات محددة فقط |
| الخوادم | التطبيقات وقواعد البيانات | المستخدمون على منافذ التطبيق فقط |
| الإدارة | واجهات إدارة الأجهزة | محطات إدارة مخصصة (PAW) فقط |
| الضيوف و IoT | الطابعات والكاميرات والزوار | الإنترنت فقط أو خدمة واحدة |

اقرأ التفاصيل في [أساسيات الـVLAN](/article/vlan-basics-why-segment) و[التقسيم والامتثال](/article/network-segmentation-compliance) و[عزل شبكة الضيوف](/article/guest-wifi-network-isolation).

### 3. التحكم في الوصول إلى الشبكة (NAC)

لا يكفي أن نعرف أي منفذ متصل؛ نحتاج أن نعرف **من** و**ماذا** يتصل. معيار IEEE 802.1X مع خادم RADIUS يسمح بمصادقة الجهاز أو المستخدم قبل منحه عنوانًا على الشبكة، ويمكن وضع الأجهزة غير المعروفة في VLAN معزولة. راجع [مصادقة 802.1X بالشهادات](/article/802-1x-certificate-authentication) و[أساسيات NAC](/article/network-access-control-nac-basics).

### 4. الوصول عن بُعد (Remote Access)

بوابات VPN من أكثر الأصول استهدافًا لأنها مكشوفة على الإنترنت بطبيعتها. القواعد الذهبية:

- مصادقة متعددة العوامل (MFA) إلزامية لكل حساب VPN.
- تحديث البرنامج الثابت فور صدور إصلاحات أمنية لبوابات الوصول.
- منح كل مجموعة وصولًا إلى ما تحتاجه فقط بدل الوصول الكامل للشبكة.

**تغيير مهم لمستخدمي Fortinet:** بدءًا من FortiOS 7.6.3 أُزيل وضع SSL VPN Tunnel Mode واستُبدل بـIPsec VPN الذي يمكن تشغيله عبر TCP 443، ولا تُرحَّل إعدادات Tunnel Mode تلقائيًا عند الترقية. يجب الترحيل قبل الترقية. التفاصيل في [دليل الترحيل من SSL VPN إلى IPsec](/article/fortios-ssl-vpn-tunnel-mode-removal-ipsec-migration)، وإذا ظهر لك الخطأ ‎-7200 في FortiClient فراجع [شرح الخطأ ‎-7200 وحله](/article/forticlient-error-7200-fix).

### 5. المراقبة والاستجابة

القواعد بدون سجلات لا تفيد في التحقيق. أرسل سجلات الجدار الناري وبوابة VPN وخوادم DNS إلى خادم Syslog أو SIEM مركزي، واحتفظ بها مدة كافية للتحقيق. ابدأ من [إعداد خادم Syslog](/article/syslog-server-setup-basics) ثم [كيف يعمل الـSIEM](/article/how-siem-actually-works).

## كيف تكتب سياسة جدار ناري قابلة للإدارة

أكثر المشاكل شيوعًا في الجدران النارية المؤسسية ليست الثغرات بل **تضخم القواعد**: مئات القواعد التي لا يعرف أحد سبب وجودها. اتبع هذه المبادئ:

1. **الرفض الافتراضي:** آخر قاعدة ترفض كل شيء وتسجّله.
2. **قواعد محددة:** المصدر والوجهة والخدمة محددة، وتجنب "any" إلا لسبب موثق.
3. **الترتيب مهم:** معظم الجدران النارية تطابق القواعد من الأعلى إلى الأسفل وتتوقف عند أول تطابق، فضع القواعد الأكثر تحديدًا أولًا.
4. **التوثيق:** كل قاعدة لها اسم ووصف ومالك وتاريخ مراجعة أو رقم طلب تغيير.
5. **المراجعة الدورية:** احذف القواعد التي لم تُستخدم (عداد الاستخدام صفر) بعد التأكد مع مالكها.

مثال على سياسة صحيحة لنشر خدمة داخلية:

\`\`\`text
الاسم: USERS-to-ERP-HTTPS
المصدر: VLAN المستخدمين
الوجهة: خادم ERP
الخدمة: HTTPS فقط
الإجراء: سماح + فحص IPS + تسجيل
المالك: فريق التطبيقات — طلب تغيير CHG-1234
\`\`\`

للتطبيق العملي على منصات محددة راجع [أساسيات سياسات Palo Alto](/article/palo-alto-security-policy-basics) و[قواعد جدار Windows المتقدمة](/article/windows-firewall-advanced-rules).

## خدمات البنية الأساسية التي ينساها الجميع

- **DNS:** استخدم تصفية DNS لحجب النطاقات الخبيثة، وراقب الاستعلامات غير المعتادة. راجع [أمن DNS والتصفية وDNSSEC](/article/dns-security-filtering-dnssec).
- **DHCP:** فعّل ميزات مثل DHCP Snooping على المحولات لمنع خوادم DHCP المزيفة، واعتمد على تكرار الخدمة كما في [DHCP Failover](/article/dhcp-failover-high-availability).
- **SNMP:** استخدم SNMPv3 مع المصادقة والتشفير بدل v1/v2c ذات "community strings" النصية. راجع [أساسيات مراقبة SNMP](/article/snmp-monitoring-basics).
- **الشهادات:** راقب تواريخ انتهاء الشهادات على البوابات والخوادم قبل أن تتسبب في انقطاع. راجع [مراقبة انتهاء الشهادات](/article/certificate-expiry-monitoring).

## انعدام الثقة (Zero Trust) دون مبالغة

انعدام الثقة ليس منتجًا بل مبدأ: لا تُمنح الثقة بناءً على الموقع في الشبكة، بل يُتحقق من كل طلب بناءً على الهوية وحالة الجهاز والسياق. عمليًا يعني ذلك تقوية الهوية (MFA)، وتقسيمًا أدق، ووصولًا على مستوى التطبيق بدل الشبكة كاملة. يقدم المعهد الوطني الأمريكي للمعايير والتقنية (NIST) الإطار المرجعي في المنشور SP 800-207. اقرأ [شرح انعدام الثقة عمليًا](/article/zero-trust-explained-practically).

## تقوية الجدار الناري نفسه

الجدار الناري هدف بحد ذاته، وقد استُغلت ثغرات في واجهات إدارة وبوابات VPN لدى أكثر من مصنّع خلال السنوات الأخيرة. قائمة تقوية مختصرة:

- **إصدار مدعوم ومحدث:** تابع إشعارات المصنّع الأمنية (مثل FortiGuard PSIRT أو Palo Alto Security Advisories) وطبّق الإصلاحات الحرجة وفق جدول زمني محدد.
- **حسابات إدارة مسماة:** لا تستخدم حساب admin المشترك؛ أنشئ حسابًا لكل مسؤول مع MFA، واربط الدخول بخادم RADIUS أو LDAP حتى يُلغى الوصول تلقائيًا عند مغادرة الموظف.
- **تقييد مصادر الإدارة:** حدد العناوين المسموح لها بالدخول (Trusted Hosts) وعطّل HTTP وTelnet واكتفِ بـHTTPS وSSH.
- **الخدمات غير المستخدمة:** عطّل الخدمات المكشوفة التي لا تحتاجها على واجهة WAN، مثل بوابة الويب إذا لم تكن مستخدمة.
- **نسخ الإعدادات:** خذ نسخة احتياطية مشفرة من الإعدادات بشكل مجدول واحفظها خارج الجهاز.
- **سجل التدقيق:** أرسل سجلات تسجيل دخول المسؤولين وتغييرات الإعدادات إلى الـSIEM، ونبّه على أي تغيير خارج نافذة التغييرات.

## أساسيات تصميم IPsec للوصول عن بُعد والربط بين الفروع

مع انتقال كثير من البيئات إلى IPsec، يفيد فهم مكوناته الأساسية:

- **المرحلة الأولى (IKE):** تتفاوض فيها البوابتان أو البوابة والعميل على الهوية وخوارزميات التشفير. استخدم IKEv2 حيث يدعمه العميل، مع خوارزميات حديثة مثل AES-GCM ومجموعات Diffie-Hellman قوية، وتجنب خوارزميات قديمة مثل DES و3DES وMD5.
- **المرحلة الثانية (IPsec SA):** تحدد الشبكات المحمية والتشفير الفعلي للبيانات.
- **المصادقة:** الشهادات أقوى من المفتاح المشترك (PSK)، وإذا استُخدم PSK فيجب أن يكون طويلًا وعشوائيًا. لمستخدمي الوصول عن بُعد تُضاف مصادقة المستخدم (مثل XAuth أو EAP) مع MFA.
- **عبور NAT:** يعمل IPsec افتراضيًا على UDP 500 و4500، وإذا كانت الشبكات الوسيطة تحجبها فإن FortiOS يدعم نقل IKE وESP عبر TCP (المنفذ 443 افتراضيًا) بدءًا من الإصدار 7.4.2 مع FortiClient 7.4.1 أو أحدث.
- **Split Tunnel أم Full Tunnel:** النفق الكامل يمنح رؤية وفحصًا لكل ترافيك المستخدم لكنه يستهلك عرض نطاق البوابة؛ النفق المجزأ أخف لكنه يتطلب حماية أقوى للجهاز الطرفي.

## خطة عمل لأول 90 يومًا

| الفترة | الإجراءات |
|---|---|
| الأسابيع 1–2 | جرد الأجهزة الشبكية وإصداراتها، وإغلاق واجهات الإدارة المكشوفة على الإنترنت |
| الأسابيع 3–4 | تفعيل MFA على VPN، وتحديث البرامج الثابتة، وتوثيق القواعد الحالية |
| الشهر 2 | فصل منطقة الإدارة والضيوف وIoT، وإرسال السجلات إلى خادم مركزي |
| الشهر 3 | مراجعة القواعد غير المستخدمة، وتجربة 802.1X على قسم واحد، وتمرين استجابة للحوادث |

## الأخطاء الشائعة

- **إدارة الجدار الناري من الإنترنت:** اجعل واجهة الإدارة متاحة من شبكة الإدارة فقط.
- **قواعد مؤقتة دائمة:** كل قاعدة مؤقتة يجب أن يكون لها تاريخ انتهاء.
- **عدم اختبار النسخ الاحتياطي للإعدادات:** احفظ نسخة من الإعدادات قبل كل تغيير وبعده.
- **الاعتماد على VPN وحدها:** الوصول عن بُعد يجب أن يقترن بحماية الأجهزة الطرفية والمراقبة.

## الأسئلة الشائعة

### ما الفرق بين الجدار الناري التقليدي وجدار الجيل التالي؟

الجدار التقليدي يقرر بناءً على العناوين والمنافذ، بينما جدار الجيل التالي (NGFW) يتعرف على التطبيقات والمستخدمين ويدمج خدمات مثل IPS وتصفية الويب وفحص TLS ضمن السياسة نفسها.

### هل ما زال SSL VPN خيارًا آمنًا؟

المشكلة ليست في التقنية بقدر ما هي في البوابات غير المحدثة والحسابات دون MFA. ومع ذلك، أزالت Fortinet وضع Tunnel Mode من FortiOS 7.6.3 لصالح IPsec، لذلك خطط للترحيل إذا كنت تستخدمه.

### من أين أبدأ إذا كانت شبكتي مسطحة بالكامل؟

ابدأ بفصل الضيوف وIoT وواجهات الإدارة لأنها الأسهل تأثيرًا والأعلى خطرًا، ثم انتقل إلى فصل الخوادم عن المستخدمين.

### هل يغني التقسيم بالـVLAN عن الجدار الناري الداخلي؟

لا. الـVLAN تفصل نطاقات البث فقط، أما منع الاتصال بين الأقسام فيتطلب سياسة على الجدار الناري أو قوائم تحكم بالوصول (ACL) بين الشبكات.

## المراجع

- [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)
- [NIST SP 800-41 Rev. 1: Guidelines on Firewalls and Firewall Policy](https://csrc.nist.gov/pubs/sp/800/41/r1/final)
- [Fortinet: SSL VPN tunnel mode to IPsec VPN migration (FortiOS 7.6.3)](https://docs.fortinet.com/document/fortigate/7.6.3/administration-guide/155142/ssl-vpn-tunnel-mode-to-ipsec-vpn-migration)
- [NSA: Network Infrastructure Security Guide](https://www.nsa.gov/Press-Room/Press-Releases-Statements/Press-Release-View/Article/2949885/nsa-details-network-infrastructure-best-practices/)
`,
    en: `## Why network security needs a plan, not a box

Many teams buy a next-generation firewall and then consider the network secure. In reality the appliance only enforces a policy: if the internal network is flat, rules allow "any-any" and management interfaces are exposed to the internet, no licence will save you. This guide gathers what you need to build a defensible enterprise network and links to the detailed articles and the video playlist for each part.

The core idea is **defense in depth**: never rely on a single layer, but stack layers so that when one fails, the next one detects or slows the attack.

## The five layers of a secure enterprise network

### 1. The perimeter

The internet-edge firewall separates the internal network from the outside world. Its core jobs:

- Deny all inbound connections by default and allow only services you deliberately publish (such as a VPN gateway or mail server).
- Inspect outbound traffic too: malware calls its command-and-control servers from the inside out.
- Enable security services such as IPS, web filtering and application control according to each rule's risk.

### 2. Internal segmentation

A flat network means one infected laptop can talk directly to database servers. VLAN segmentation, with policy enforced between segments on the firewall, limits lateral movement. Start simple:

| Zone | Examples | Who can reach it |
|---|---|---|
| Users | Staff devices | Internet and specific services only |
| Servers | Applications and databases | Users on application ports only |
| Management | Device admin interfaces | Dedicated admin workstations (PAW) only |
| Guests & IoT | Printers, cameras, visitors | Internet only, or a single service |

Details: [VLAN basics](/article/vlan-basics-why-segment), [segmentation and compliance](/article/network-segmentation-compliance) and [guest Wi-Fi isolation](/article/guest-wifi-network-isolation).

### 3. Network access control (NAC)

Knowing which port is connected isn't enough; we need to know **who** and **what** is connecting. IEEE 802.1X with a RADIUS server authenticates the device or user before it gets an address, and unknown devices can be placed in an isolated VLAN. See [802.1X certificate authentication](/article/802-1x-certificate-authentication) and [NAC basics](/article/network-access-control-nac-basics).

### 4. Remote access

VPN gateways are among the most targeted assets because they are internet-facing by design. The golden rules:

- Mandatory multi-factor authentication (MFA) for every VPN account.
- Patch gateway firmware as soon as security fixes are released.
- Give each group access only to what it needs instead of the whole network.

**An important change for Fortinet users:** starting with FortiOS 7.6.3, SSL VPN tunnel mode was removed and replaced with IPsec VPN, which can run over TCP 443, and tunnel-mode settings are not carried over on upgrade. You must migrate before upgrading. See the [SSL VPN to IPsec migration guide](/article/fortios-ssl-vpn-tunnel-mode-removal-ipsec-migration), and if FortiClient shows error -7200, read [FortiClient error -7200 explained](/article/forticlient-error-7200-fix).

### 5. Monitoring and response

Rules without logs are useless in an investigation. Send firewall, VPN gateway and DNS logs to a central Syslog server or SIEM and keep them long enough to investigate. Start with [setting up a Syslog server](/article/syslog-server-setup-basics), then [how a SIEM actually works](/article/how-siem-actually-works).

## Writing a firewall policy you can actually manage

The most common problem in enterprise firewalls isn't vulnerabilities, it's **rule bloat**: hundreds of rules nobody can explain. Follow these principles:

1. **Default deny:** the last rule denies everything and logs it.
2. **Specific rules:** source, destination and service are defined; avoid "any" unless there's a documented reason.
3. **Order matters:** most firewalls match top-down and stop at the first match, so put the most specific rules first.
4. **Documentation:** every rule has a name, description, owner and a review date or change ticket.
5. **Periodic review:** remove rules with a zero hit count after confirming with their owner.

An example of a well-formed rule publishing an internal service:

\`\`\`text
Name: USERS-to-ERP-HTTPS
Source: Users VLAN
Destination: ERP server
Service: HTTPS only
Action: allow + IPS + logging
Owner: Applications team — change CHG-1234
\`\`\`

For platform specifics see [Palo Alto security policy basics](/article/palo-alto-security-policy-basics) and [advanced Windows Firewall rules](/article/windows-firewall-advanced-rules).

## Infrastructure services everyone forgets

- **DNS:** use DNS filtering to block malicious domains and watch for unusual queries. See [DNS security, filtering and DNSSEC](/article/dns-security-filtering-dnssec).
- **DHCP:** enable features such as DHCP snooping on switches to stop rogue DHCP servers, and make the service redundant as in [DHCP failover](/article/dhcp-failover-high-availability).
- **SNMP:** use SNMPv3 with authentication and encryption instead of v1/v2c plaintext community strings. See [SNMP monitoring basics](/article/snmp-monitoring-basics).
- **Certificates:** track certificate expiry on gateways and servers before it causes an outage. See [certificate expiry monitoring](/article/certificate-expiry-monitoring).

## Zero Trust without the hype

Zero Trust isn't a product; it's a principle: trust is never granted based on network location, and every request is verified based on identity, device posture and context. In practice that means stronger identity (MFA), finer segmentation and application-level access instead of whole-network access. NIST SP 800-207 is the reference framework. Read [Zero Trust explained practically](/article/zero-trust-explained-practically).

## Hardening the firewall itself

The firewall is a target in its own right; management interfaces and VPN portals from several vendors have been exploited in recent years. A short hardening list:

- **A supported, patched release:** follow vendor security advisories (such as FortiGuard PSIRT or Palo Alto Security Advisories) and apply critical fixes on a defined schedule.
- **Named admin accounts:** don't use a shared admin account; give each administrator an account with MFA, backed by RADIUS or LDAP so access is revoked automatically when someone leaves.
- **Restrict management sources:** define trusted hosts for admin access, disable HTTP and Telnet, and keep only HTTPS and SSH.
- **Unused services:** disable services exposed on the WAN interface that you don't need, such as a web portal nobody uses.
- **Configuration backups:** take scheduled, encrypted configuration backups and store them off the device.
- **Audit trail:** send admin logins and configuration changes to the SIEM, and alert on changes outside the change window.

## IPsec design basics for remote access and site-to-site

As many environments move to IPsec, it helps to understand its building blocks:

- **Phase 1 (IKE):** the gateways, or gateway and client, negotiate identity and crypto algorithms. Use IKEv2 where the client supports it, with modern algorithms such as AES-GCM and strong Diffie-Hellman groups, and avoid legacy ones such as DES, 3DES and MD5.
- **Phase 2 (IPsec SA):** defines the protected networks and the actual data encryption.
- **Authentication:** certificates are stronger than a pre-shared key (PSK); if you use a PSK it must be long and random. Remote-access users add user authentication (such as XAuth or EAP) with MFA.
- **NAT traversal:** IPsec uses UDP 500 and 4500 by default; where those are blocked, FortiOS supports IKE and ESP over TCP (port 443 by default) from FortiOS 7.4.2 with FortiClient 7.4.1 or later.
- **Split vs full tunnel:** a full tunnel gives visibility and inspection of all user traffic but consumes gateway bandwidth; a split tunnel is lighter but demands stronger endpoint protection.

## A 90-day action plan

| Period | Actions |
|---|---|
| Weeks 1–2 | Inventory network devices and versions; close management interfaces exposed to the internet |
| Weeks 3–4 | Enforce MFA on VPN, update firmware, document current rules |
| Month 2 | Separate management, guest and IoT zones; ship logs to a central server |
| Month 3 | Review unused rules, pilot 802.1X on one department, run an incident-response exercise |

## Common mistakes

- **Managing the firewall from the internet:** make the admin interface reachable from the management network only.
- **Permanent "temporary" rules:** every temporary rule needs an expiry date.
- **Untested configuration backups:** save the configuration before and after every change.
- **Relying on the VPN alone:** remote access must be paired with endpoint protection and monitoring.

## FAQ

### What is the difference between a traditional firewall and a next-generation firewall?

A traditional firewall decides on addresses and ports, while a next-generation firewall (NGFW) identifies applications and users and integrates IPS, web filtering and TLS inspection into the same policy.

### Is SSL VPN still a safe option?

The bigger problem is unpatched gateways and accounts without MFA rather than the technology itself. That said, Fortinet removed tunnel mode in FortiOS 7.6.3 in favour of IPsec, so plan a migration if you rely on it.

### Where do I start if my network is completely flat?

Start by separating guests, IoT and management interfaces, as they are the easiest wins with the highest risk, then separate servers from users.

### Does VLAN segmentation replace an internal firewall?

No. VLANs only separate broadcast domains; blocking traffic between segments requires firewall policy or access control lists (ACLs) between networks.

## References

- [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)
- [NIST SP 800-41 Rev. 1: Guidelines on Firewalls and Firewall Policy](https://csrc.nist.gov/pubs/sp/800/41/r1/final)
- [Fortinet: SSL VPN tunnel mode to IPsec VPN migration (FortiOS 7.6.3)](https://docs.fortinet.com/document/fortigate/7.6.3/administration-guide/155142/ssl-vpn-tunnel-mode-to-ipsec-vpn-migration)
- [NSA: Network Infrastructure Security Guide](https://www.nsa.gov/Press-Room/Press-Releases-Statements/Press-Release-View/Article/2949885/nsa-details-network-infrastructure-best-practices/)
`,
  },
};
