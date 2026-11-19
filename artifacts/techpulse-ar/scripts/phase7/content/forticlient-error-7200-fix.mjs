export default {
  slug: 'forticlient-error-7200-fix',
  categoryId: 'cybersecurity',
  subcategoryId: 'vpn-remote',
  tags: ['fortinet', 'forticlient', 'ssl-vpn', 'troubleshooting'],
  domainIds: ['networking', 'troubleshooting'],
  topicIds: ['vpn', 'firewalls'],
  contentType: 'troubleshooting',
  vendorIds: ['fortinet'],
  productIds: ['fortigate', 'forticlient'],
  title: {
    ar: 'خطأ FortiClient ‎-7200 في SSL VPN: الأسباب والحلول',
    en: 'FortiClient Error -7200 in SSL VPN: Causes and Fixes',
  },
  excerpt: {
    ar: 'الخطأ ‎-7200 نادرًا ما يعني كلمة مرور خاطئة. هذه الأسباب الفعلية بالترتيب، من تعطل Tunnel Mode بعد FortiOS 7.6.3 إلى قوة التشفير والشهادات، مع أوامر التشخيص.',
    en: 'Error -7200 rarely means a wrong password. The real causes in order — tunnel mode after FortiOS 7.6.3, portals, cipher strength, certificates — plus debug commands.',
  },
  body: {
    ar: `## ما معنى الخطأ ‎-7200؟

تظهر الرسالة "Credential or SSLVPN configuration is wrong (-7200)" في FortiClient عندما يفشل الاتصال بعد بدء جلسة TLS مع بوابة FortiGate، وغالبًا عند نسبة تقدم قريبة من 48٪. رغم أن الرسالة تذكر بيانات الاعتماد أولًا، فإن السبب في أغلب الحالات **إعداد على البوابة**: البوابة الخاطئة، أو بوابة ويب (Portal) لا تسمح بالنفق، أو قاعدة مصادقة لا تتطابق، أو شهادة غير صحيحة.

القاعدة الذهبية: **ابدأ التشخيص من FortiGate وليس من جهاز المستخدم**، خاصة إذا تأثر أكثر من مستخدم في الوقت نفسه.

## الأسباب بالترتيب حسب الشيوع

### 1. الترقية إلى FortiOS 7.6.3 أو أحدث

بدءًا من FortiOS 7.6.3 أزالت Fortinet وضع SSL VPN Tunnel Mode واستبدلته بـIPsec VPN، ولا تُرحَّل إعدادات Tunnel Mode عند الترقية. إذا ظهر الخطأ لكل المستخدمين مباشرة بعد الترقية، فهذا هو السبب الأرجح، والحل الدائم ليس إصلاح SSL VPN بل **الترحيل إلى IPsec**. الخطوات في [دليل الترحيل من SSL VPN إلى IPsec](/article/fortios-ssl-vpn-tunnel-mode-removal-ipsec-migration).

وقد وثّقت Fortinet أيضًا حالات تظهر فيها البوابات بعد الترقية وTunnel Mode معطل عليها؛ في الإصدارات التي ما زالت تدعم الوضع، يلزم إعادة تفعيله **واختيار مجموعة عناوين IP (IP Pool)** الصحيحة، لأن التفعيل دون مجموعة عناوين يعطي الخطأ نفسه.

### 2. البوابة (Portal) المخصصة للمستخدم لا تدعم النفق

قواعد المصادقة (Authentication Rules) في إعدادات SSL VPN تربط كل مجموعة ببوابة، وهناك بوابة افتراضية لمن لا يطابق أي قاعدة. قد ينجح المستخدم في المصادقة ثم يُوجَّه إلى بوابة بلا Tunnel Mode أو بلا IP Pool. افحص من سطر الأوامر:

\`\`\`text
config vpn ssl web portal
    show
end

config vpn ssl settings
    show
end
\`\`\`

ابحث عن \`set tunnel-mode enable\` و\`set ip-pools\` في البوابة التي يصل إليها المستخدم فعلًا.

### 3. قوة التشفير أقل مما تتطلبه قاعدة المصادقة

وثّقت Fortinet أن FortiGate يتطلب أن تكون قوة التشفير في إعدادات SSL VPN مساوية أو أقوى من القوة المحددة في قاعدة المصادقة (الافتراضي 168 بت). إذا ضُبطت مجموعة تشفير أضعف (مثل TLS-AES-128-GCM-SHA256 وحدها)، تكتمل مصافحة TLS ثم تفشل المصادقة بالخطأ ‎-7200. الحل: إزالة تخصيص ciphersuite للعودة إلى الافتراضي أو اختيار مجموعة أقوى.

### 4. SAML مع المتصفح المدمج

عند استخدام SAML مع مزود هوية مثل Microsoft Entra ID أو Okta، قد لا يتعامل المتصفح المدمج في FortiClient مع سياسات الوصول المشروط أو طرق MFA الحديثة. تفعيل خيار استخدام المتصفح الخارجي للمصادقة في إعداد الاتصال يحل كثيرًا من هذه الحالات.

### 5. الشهادة الخاطئة

إذا كانت المصادقة بالشهادات، فقد يختار العميل شهادة مستخدم بدل شهادة الجهاز، أو لا تكون جهة الإصدار (CA) مثبتة على FortiGate. توضح وثائق FortiClient أن مخرجات fnbamd تُظهر فشل بناء سلسلة الشهادة في هذه الحالة.

### 6. أسباب أخرى أقل شيوعًا

- عنوان البوابة أو المنفذ خاطئ في ملف الاتصال، أو اسم FQDN يشير إلى عنوان قديم.
- FortiGate في وضع الحفاظ على الذاكرة (Conserve Mode) أو واجهة ssl.root معطلة.
- إصدار FortiClient قديم جدًا مقارنة بإصدار FortiOS.

## أوامر التشخيص على FortiGate

شغّل الأوامر التالية ثم اطلب من المستخدم إعادة المحاولة:

\`\`\`text
diagnose debug reset
diagnose vpn ssl debug-filter src-addr4 <IP-المستخدم>
diagnose debug application fnbamd -1
diagnose debug application sslvpn -1
diagnose debug console timestamp enable
diagnose debug enable
\`\`\`

وبعد الانتهاء أوقف التصحيح بـ\`diagnose debug disable\`. للتحقق من وضع الذاكرة استخدم \`diagnose hardware sysinfo conserve\`، ولإحصاءات SSL VPN استخدم \`diagnose vpn ssl statistics\`.

## ما لا يجب فعله

- **لا تعطّل TLS 1.3 على أجهزة المستخدمين** كحل دائم. قد يساعد ذلك في تشخيص مشكلة تفاوض، لكنه خفض للأمان يجب ألا يبقى.
- **لا تعِد ضبط كلمات المرور** لكل المستخدمين قبل التأكد من أن المشكلة ليست في الإعداد.

## الأسئلة الشائعة

### لماذا يظهر الخطأ لكل المستخدمين فجأة؟

غالبًا بسبب تغيير على البوابة: ترقية البرنامج الثابت، أو تعديل على البوابات أو قواعد المصادقة أو مجموعات التشفير. راجع سجل التغييرات أولًا.

### هل يمكن البقاء على SSL VPN بعد FortiOS 7.6.3؟

وضع Tunnel Mode غير متاح في 7.6.3 وما بعده. يبقى وضع الويب باسم Agentless VPN على بعض الطرازات فقط، لكن الحل الموصى به للوصول بالعميل هو IPsec.

### هل تفيد إعادة تثبيت FortiClient؟

نادرًا، لأن السبب في الغالب على البوابة. أعد التثبيت أو التحديث فقط إذا كان الإصدار قديمًا جدًا أو تأثر مستخدم واحد بعد استبعاد أسباب الإعداد.

## المراجع

- [Fortinet Community: FortiClient error -7200 after upgrading to v7.6.3](https://community.fortinet.com/fortigate-3/troubleshooting-tip-forticlient-error-credential-or-ssl-vpn-configuration-is-wrong-7200-after-upgrading-to-v7-6-3-206000)
- [Fortinet Community: -7200 and cipher strength in authentication rules](https://community.fortinet.com/fortigate-3/technical-tip-credential-or-ssl-vpn-configuration-is-wrong-7200-for-ssl-vpn-with-any-type-of-authentication-219912)
- [FortiClient Administration Guide: Wrong certificate selected](https://docs.fortinet.com/document/forticlient/8.0.0/administration-guide/525958/wrong-certificate-selected)
- [FortiOS 7.6.3 Release Notes: SSL VPN tunnel mode replaced with IPsec VPN](https://docs.fortinet.com/document/fortigate/7.6.3/fortios-release-notes/173430/ssl-vpn-tunnel-mode-replaced-with-ipsec-vpn)
`,
    en: `## What does error -7200 mean?

FortiClient shows "Credential or SSLVPN configuration is wrong (-7200)" when the connection fails after a TLS session with the FortiGate has started, often around 48% progress. Although the message mentions credentials first, the cause is usually **a configuration on the gateway**: the wrong gateway, a portal that doesn't allow tunnels, an authentication rule that doesn't match, or the wrong certificate.

The golden rule: **start troubleshooting on the FortiGate, not the user's laptop**, especially if more than one user is affected at once.

## Causes, most common first

### 1. An upgrade to FortiOS 7.6.3 or later

Starting with FortiOS 7.6.3, Fortinet removed SSL VPN tunnel mode and replaced it with IPsec VPN, and tunnel-mode settings are not carried over on upgrade. If every user gets the error right after an upgrade, this is the likeliest cause, and the lasting fix isn't repairing SSL VPN but **migrating to IPsec**. Steps are in the [SSL VPN to IPsec migration guide](/article/fortios-ssl-vpn-tunnel-mode-removal-ipsec-migration).

Fortinet has also documented portals coming up with tunnel mode disabled after an upgrade; on versions that still support it, you must re-enable it **and select the correct IP pool**, because enabling it without an address pool produces the same error.

### 2. The user's portal doesn't support tunnels

Authentication rules in the SSL VPN settings map each group to a portal, with a default portal for anyone who matches no rule. A user can authenticate successfully and then land on a portal with no tunnel mode or no IP pool. Check from the CLI:

\`\`\`text
config vpn ssl web portal
    show
end

config vpn ssl settings
    show
end
\`\`\`

Look for \`set tunnel-mode enable\` and \`set ip-pools\` on the portal the user actually receives.

### 3. Cipher strength lower than the authentication rule requires

Fortinet documents that the FortiGate requires the cipher strength in the SSL VPN settings to be equal to or stronger than the strength in the authentication rule (168-bit by default). If a weaker suite is configured (for example TLS-AES-128-GCM-SHA256 alone), the TLS handshake completes and authentication then fails with -7200. Fix: unset the custom ciphersuite to return to the default, or choose a stronger one.

### 4. SAML with the embedded browser

With SAML against an identity provider such as Microsoft Entra ID or Okta, FortiClient's embedded browser may not handle conditional access or modern MFA flows. Enabling the external browser option for authentication in the connection profile resolves many of these cases.

### 5. The wrong certificate

With certificate authentication, the client may pick a user certificate instead of the machine certificate, or the issuing CA may be missing from the FortiGate. The FortiClient documentation shows fnbamd output reporting a failed chain build in this case.

### 6. Other, less common causes

- The wrong gateway address or port in the connection profile, or an FQDN pointing to an old address.
- The FortiGate in conserve mode, or the ssl.root interface down.
- A FortiClient build far older than the FortiOS version.

## Debug commands on the FortiGate

Run these, then ask the user to retry:

\`\`\`text
diagnose debug reset
diagnose vpn ssl debug-filter src-addr4 <user-IP>
diagnose debug application fnbamd -1
diagnose debug application sslvpn -1
diagnose debug console timestamp enable
diagnose debug enable
\`\`\`

Stop with \`diagnose debug disable\` when finished. Check memory state with \`diagnose hardware sysinfo conserve\` and SSL VPN statistics with \`diagnose vpn ssl statistics\`.

## What not to do

- **Don't disable TLS 1.3 on user devices** as a permanent fix. It can help diagnose a negotiation problem, but it's a security downgrade that shouldn't stay.
- **Don't reset everyone's password** before ruling out configuration.

## FAQ

### Why does every user suddenly get the error?

Usually because something changed on the gateway: a firmware upgrade, or edits to portals, authentication rules or cipher suites. Check the change log first.

### Can we stay on SSL VPN after FortiOS 7.6.3?

Tunnel mode isn't available in 7.6.3 and later. Web mode remains, renamed Agentless VPN, on some models only, but the recommended client-based remote access is IPsec.

### Does reinstalling FortiClient help?

Rarely, because the cause is usually on the gateway. Reinstall or update only if the client is very old, or a single user is affected after configuration causes are ruled out.

## References

- [Fortinet Community: FortiClient error -7200 after upgrading to v7.6.3](https://community.fortinet.com/fortigate-3/troubleshooting-tip-forticlient-error-credential-or-ssl-vpn-configuration-is-wrong-7200-after-upgrading-to-v7-6-3-206000)
- [Fortinet Community: -7200 and cipher strength in authentication rules](https://community.fortinet.com/fortigate-3/technical-tip-credential-or-ssl-vpn-configuration-is-wrong-7200-for-ssl-vpn-with-any-type-of-authentication-219912)
- [FortiClient Administration Guide: Wrong certificate selected](https://docs.fortinet.com/document/forticlient/8.0.0/administration-guide/525958/wrong-certificate-selected)
- [FortiOS 7.6.3 Release Notes: SSL VPN tunnel mode replaced with IPsec VPN](https://docs.fortinet.com/document/fortigate/7.6.3/fortios-release-notes/173430/ssl-vpn-tunnel-mode-replaced-with-ipsec-vpn)
`,
  },
};
