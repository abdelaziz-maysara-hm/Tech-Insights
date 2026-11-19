// Phase 7 (2026-11-19) expansions of thin articles and merge instructions.

export const FORTIGATE_SSLVPN_NOTICE = {
  ar: `> **تنبيه مهم (نوفمبر 2026):** بدءًا من FortiOS 7.6.3 أزالت Fortinet وضع SSL VPN Tunnel Mode واستبدلته بـIPsec VPN، ولا تُرحَّل إعداداته عند الترقية. الخطوات أدناه تنطبق على الإصدارات الأقدم فقط (مثل 7.4.x و7.6.0–7.6.2). إذا كنت تخطط للترقية فاقرأ أولًا [دليل الترحيل إلى IPsec](/article/fortios-ssl-vpn-tunnel-mode-removal-ipsec-migration).

`,
  en: `> **Important (November 2026):** starting with FortiOS 7.6.3, Fortinet removed SSL VPN tunnel mode and replaced it with IPsec VPN, and its settings are not carried over on upgrade. The steps below apply to older releases only (such as 7.4.x and 7.6.0–7.6.2). If you plan to upgrade, read the [IPsec migration guide](/article/fortios-ssl-vpn-tunnel-mode-removal-ipsec-migration) first.

`,
};

export const FORTIGATE_SSLVPN_APPENDIX = {
  ar: `

## ماذا بعد FortiOS 7.6.3؟

- **Tunnel Mode لم يعد متاحًا** في الواجهة الرسومية ولا في سطر الأوامر، وسياسات ssl.root لا تُرحَّل.
- **وضع الويب** مستمر باسم Agentless VPN على بعض الطرازات فقط، والطرازات ذات ذاكرة 2 جيجابايت أو أقل لا تدعمه.
- **البديل الموصى به** هو IPsec للوصول عن بُعد، ويمكن تشغيله عبر TCP 443 على FortiOS 7.4.2 فما فوق مع FortiClient 7.4.1 فما فوق.
- إذا ظهر الخطأ ‎-7200 للمستخدمين بعد الترقية، فراجع [شرح خطأ FortiClient ‎-7200](/article/forticlient-error-7200-fix).

## قائمة تحقق أمنية لأي بوابة وصول عن بُعد

1. MFA إلزامية لكل المستخدمين.
2. أحدث إصدار مدعوم من البرنامج الثابت، ومتابعة إشعارات FortiGuard PSIRT.
3. تقييد الوصول بحسب المجموعة إلى الشبكات المطلوبة فقط.
4. شهادة خادم صالحة من جهة موثوقة بدل الشهادة الافتراضية.
5. إرسال سجلات الاتصال إلى الـSIEM ومراقبة تسجيلات الدخول من دول أو أوقات غير معتادة.

للصورة الكاملة راجع [دليل أمن الشبكات المؤسسية](/article/enterprise-network-security-guide).

## المراجع

- [FortiOS 7.6.3 Release Notes: SSL VPN tunnel mode replaced with IPsec VPN](https://docs.fortinet.com/document/fortigate/7.6.3/fortios-release-notes/173430/ssl-vpn-tunnel-mode-replaced-with-ipsec-vpn)
`,
  en: `

## What about FortiOS 7.6.3 and later?

- **Tunnel mode is no longer available** in the GUI or CLI, and ssl.root policies are not migrated.
- **Web mode** continues as Agentless VPN on some models only; models with 2 GB of RAM or less don't support it.
- **The recommended replacement** is remote-access IPsec, which can run over TCP 443 on FortiOS 7.4.2+ with FortiClient 7.4.1+.
- If users see error -7200 after an upgrade, read [FortiClient error -7200 explained](/article/forticlient-error-7200-fix).

## Security checklist for any remote-access gateway

1. Mandatory MFA for every user.
2. The latest supported firmware, and follow FortiGuard PSIRT advisories.
3. Per-group access restricted to the networks each group needs.
4. A valid server certificate from a trusted CA instead of the factory default.
5. Connection logs sent to the SIEM, with alerts on logins from unusual countries or hours.

For the full picture see the [enterprise network security guide](/article/enterprise-network-security-guide).

## References

- [FortiOS 7.6.3 Release Notes: SSL VPN tunnel mode replaced with IPsec VPN](https://docs.fortinet.com/document/fortigate/7.6.3/fortios-release-notes/173430/ssl-vpn-tunnel-mode-replaced-with-ipsec-vpn)
`,
};

export const SECURE_REMOTE_WORK = {
  title: {
    ar: 'قائمة تحقق للعمل عن بُعد الآمن: 12 ضابطًا لفرق تقنية المعلومات',
    en: 'A Secure Remote Work Checklist: 12 Controls for IT Teams',
  },
  excerpt: {
    ar: 'اثنا عشر ضابطًا عمليًا لتأمين الموظفين عن بُعد: الوصول الآمن وMFA، حماية الجهاز وتشفيره، التحديثات، الشبكة المنزلية، النسخ الاحتياطي، والاستجابة عند فقدان جهاز.',
    en: 'Twelve practical controls for securing remote staff: secure access and MFA, device protection and encryption, updates, home networks, backups and what to do when a device is lost.',
  },
  body: {
    ar: `## لمن هذه القائمة؟

لفرق تقنية المعلومات التي تدير موظفين يعملون من المنزل أو أثناء التنقل. كل بند يمكن التحقق منه بسؤال واحد بنعم أو لا، ومرتبط بمقال تفصيلي.

## أولًا: الهوية والوصول

1. **مصادقة متعددة العوامل (MFA) على كل الحسابات** بلا استثناء: البريد، والـVPN، والتطبيقات السحابية. فضّل التطبيقات مع مطابقة الأرقام أو المفاتيح المادية للحسابات الحساسة. راجع [دليل المصادقة الثنائية العملي](/article/2fa-practical-guide).
2. **وصول آمن إلى الموارد الداخلية** عبر VPN أو وصول على مستوى التطبيق، مع منح كل مجموعة ما تحتاجه فقط. إذا كنت تستخدم FortiGate فانتبه لإلغاء SSL VPN Tunnel Mode في FortiOS 7.6.3 كما في [دليل الترحيل إلى IPsec](/article/fortios-ssl-vpn-tunnel-mode-removal-ipsec-migration).
3. **حسابات بلا صلاحيات مسؤول محلي** على أجهزة المستخدمين، مع تدوير كلمة مرور المسؤول المحلي عبر [Windows LAPS](/article/windows-local-admin-password-rotation).

## ثانيًا: الجهاز

4. **تشفير القرص بالكامل** بـBitLocker أو ما يعادله، مع حفظ مفاتيح الاسترداد مركزيًا. راجع [أساسيات BitLocker](/article/bitlocker-disk-encryption-basics).
5. **حماية الأجهزة الطرفية وEDR** مفعلة ومحدثة، ولا يستطيع المستخدم تعطيلها. راجع [كيف يعمل الـEDR](/article/how-edr-actually-works).
6. **تحديثات تلقائية** لنظام التشغيل والمتصفح والتطبيقات، مع تقرير مركزي يوضح الأجهزة المتأخرة.
7. **إدارة مركزية للجهاز** (MDM أو أداة إدارة الأجهزة الطرفية) تتيح فرض السياسات والمسح عن بُعد.

## ثالثًا: الشبكة والبيانات

8. **شبكة منزلية معقولة الأمان:** كلمة مرور Wi-Fi قوية، وتغيير كلمة مرور إدارة الراوتر الافتراضية، وتحديث برنامجه الثابت. راجع [تأمين الراوتر](/article/home-router-security-basics).
9. **ملفات العمل في مكان مركزي** مع نسخ احتياطي، وليس على القرص المحلي فقط. راجع [قاعدة النسخ الاحتياطي 3-2-1](/article/backup-3-2-1-rule-practical).
10. **فصل الاستخدام الشخصي عن العمل:** جهاز عمل مخصص إن أمكن، وإلا فسياسة واضحة للأجهزة الشخصية كما في [سياسة BYOD](/article/byod-policy-security-guide).

## رابعًا: الإنسان والإجراءات

11. **توعية قصيرة ومتكررة** بالتصيد والهندسة الاجتماعية، مع زر إبلاغ واضح. راجع [كيف تكتشف التصيد قبل النقر](/article/phishing-spot-before-click).
12. **إجراء معروف عند فقدان جهاز أو الاشتباه في اختراق:** رقم أو قناة للإبلاغ فورًا، ثم تعطيل الجلسات وقفل الجهاز أو مسحه عن بُعد.

## كيف تطبّق القائمة

- راجعها مع كل موظف جديد في أسبوعه الأول، لا بعد أشهر.
- حوّل البنود 1 و4 و5 و6 إلى تقارير آلية من أدوات الإدارة بدل الاعتماد على تصريح المستخدم.
- راجع القائمة كل ستة أشهر أو بعد أي حادث.

## الأسئلة الشائعة

### هل الـVPN وحدها كافية لتأمين العمل عن بُعد؟

لا. الـVPN تحمي الاتصال، لكن الجهاز غير المحمي أو الحساب دون MFA يبقى نقطة دخول للمهاجمين.

### هل يجب منع شبكات Wi-Fi العامة؟

ليس بالضرورة إذا كان الاتصال مشفرًا (VPN أو HTTPS) والجهاز محميًا ومحدثًا، لكن تجنب إدخال بيانات حساسة على شبكات غير موثوقة دون نفق آمن.

### ماذا أفعل إذا فقد موظف جهازه؟

ألغِ جلساته وغيّر كلمة مروره، واقفل الجهاز أو امسحه عن بُعد، وتأكد أن القرص مشفر، ووثّق الحادث.

## المراجع

- [NIST SP 800-46 Rev. 2: Guide to Enterprise Telework, Remote Access, and BYOD Security](https://csrc.nist.gov/pubs/sp/800/46/r2/final)
- [CISA: Telework guidance and resources](https://www.cisa.gov/topics/risk-management/telework)
`,
    en: `## Who is this checklist for?

IT teams managing staff who work from home or on the move. Each item can be checked with a single yes-or-no question and links to a detailed article.

## Identity and access

1. **Multi-factor authentication (MFA) on every account**, no exceptions: email, VPN and cloud apps. Prefer apps with number matching, or hardware keys for sensitive accounts. See the [practical 2FA guide](/article/2fa-practical-guide).
2. **Secure access to internal resources** via VPN or application-level access, giving each group only what it needs. If you use FortiGate, note the removal of SSL VPN tunnel mode in FortiOS 7.6.3 as covered in the [IPsec migration guide](/article/fortios-ssl-vpn-tunnel-mode-removal-ipsec-migration).
3. **No local admin rights** on user devices, with the local admin password rotated by [Windows LAPS](/article/windows-local-admin-password-rotation).

## The device

4. **Full-disk encryption** with BitLocker or equivalent, with recovery keys stored centrally. See [BitLocker basics](/article/bitlocker-disk-encryption-basics).
5. **Endpoint protection and EDR** enabled, up to date, and impossible for users to disable. See [how EDR works](/article/how-edr-actually-works).
6. **Automatic updates** for the OS, browser and apps, with a central report showing devices that fall behind.
7. **Central device management** (MDM or an endpoint management tool) to enforce policy and wipe remotely.

## Network and data

8. **A reasonably secure home network:** a strong Wi-Fi password, a changed default router admin password and updated router firmware. See [securing a router](/article/home-router-security-basics).
9. **Work files stored centrally** with backups, not only on the local disk. See [the 3-2-1 backup rule](/article/backup-3-2-1-rule-practical).
10. **Separate personal and work use:** a dedicated work device where possible, otherwise a clear policy for personal devices as in [BYOD policy](/article/byod-policy-security-guide).

## People and procedures

11. **Short, frequent awareness training** on phishing and social engineering, with a clear report button. See [spotting phishing before you click](/article/phishing-spot-before-click).
12. **A known procedure for a lost device or suspected compromise:** a number or channel to report immediately, then revoke sessions and lock or wipe the device remotely.

## How to apply the checklist

- Go through it with every new starter in their first week, not months later.
- Turn items 1, 4, 5 and 6 into automated reports from your management tools instead of relying on users' word.
- Review the checklist every six months or after any incident.

## FAQ

### Is a VPN alone enough to secure remote work?

No. A VPN protects the connection, but an unprotected device or an account without MFA remains an entry point.

### Should public Wi-Fi be banned?

Not necessarily, if the connection is encrypted (VPN or HTTPS) and the device is protected and patched; but avoid entering sensitive data on untrusted networks without a secure tunnel.

### What should we do if an employee loses a device?

Revoke their sessions and change their password, lock or wipe the device remotely, confirm the disk is encrypted, and document the incident.

## References

- [NIST SP 800-46 Rev. 2: Guide to Enterprise Telework, Remote Access, and BYOD Security](https://csrc.nist.gov/pubs/sp/800/46/r2/final)
- [CISA: Telework guidance and resources](https://www.cisa.gov/topics/risk-management/telework)
`,
  },
};

// data-backup-simple-guide is redirect-only: its useful parts already exist
// in backup-3-2-1-rule-practical.
// Short articles folded into a stronger target. `skip` lists headings
// (regex) that are dropped from the merged source (intro / bottom line).
export const MERGES = [
  {
    from: 'mfa-methods-compared-sms-app-hardware',
    into: '2fa-practical-guide',
    heading: { ar: 'مقارنة طرق المصادقة: SMS مقابل التطبيق مقابل المفتاح المادي', en: 'Comparing methods: SMS vs app vs hardware key' },
    skip: /الخلاصة|Bottom line/i,
  },
  {
    from: 'sql-injection-basics-explained',
    into: 'owasp-top-10-overview',
    heading: { ar: 'مثال تفصيلي: حقن SQL (SQL Injection)', en: 'A worked example: SQL injection' },
    skip: /الخلاصة|Bottom line/i,
  },
  {
    from: 'browser-vs-standalone-password-manager',
    into: 'password-manager-start',
    heading: { ar: 'مدير كلمات المرور المدمج في المتصفح أم مدير مستقل؟', en: 'Built-in browser manager or a standalone one?' },
    skip: /ليه السؤال|Why this question|الخلاصة|Bottom line/i,
  },
];
