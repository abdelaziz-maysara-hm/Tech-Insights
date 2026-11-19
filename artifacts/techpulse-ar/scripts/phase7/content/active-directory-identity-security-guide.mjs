export default {
  slug: 'active-directory-identity-security-guide',
  pillar: true,
  categoryId: 'cybersecurity',
  subcategoryId: 'identity',
  tags: ['active-directory', 'identity', 'kerberos', 'privileged-access', 'pillar'],
  domainIds: ['cybersecurity', 'infrastructure'],
  topicIds: ['active-directory', 'iam-pam', 'windows-server'],
  contentType: 'guide',
  vendorIds: ['microsoft'],
  productIds: ['active-directory'],
  title: {
    ar: 'أمن Active Directory والهوية: الدليل الشامل',
    en: 'Active Directory and Identity Security: The Complete Guide',
  },
  excerpt: {
    ar: 'لماذا يستهدف المهاجمون Active Directory أولًا، وكيف تحميه: نموذج المستويات، حسابات الخدمة، Kerberos، LAPS، سياسات المجموعات، والمراقبة.',
    en: 'Why attackers go after Active Directory first and how to protect it: the tier model, service accounts, Kerberos, LAPS, Group Policy and monitoring.',
  },
  body: {
    ar: `## لماذا Active Directory هو الهدف الأول؟

في معظم المؤسسات التي تعمل على Windows، يتحكم Active Directory (AD) في من يدخل إلى ماذا: أجهزة المستخدمين، الخوادم، البريد، وأحيانًا الوصول عن بُعد والتطبيقات السحابية عبر المزامنة. لذلك يكفي أن يحصل المهاجم على صلاحيات مسؤول النطاق (Domain Admin) ليتحكم في البيئة كلها، ولهذا تمر معظم هجمات الفدية الحديثة بمرحلة الاستيلاء على AD قبل التشفير.

هذا الدليل يرتب حماية AD من الأساس إلى المراقبة، ويربطك بالمقالات التفصيلية وقائمة تشغيل مرئية.

## كيف يتحرك المهاجم داخل AD عادة؟

فهم المسار يساعدك على كسره:

1. **الدخول الأولي:** رسالة تصيد أو ثغرة على خدمة مكشوفة تعطي المهاجم جهاز مستخدم عادي.
2. **الاستطلاع:** أي مستخدم في النطاق يستطيع افتراضيًا قراءة معظم كائنات AD، فيكتشف المهاجم المجموعات المميزة وحسابات الخدمة.
3. **سرقة بيانات الاعتماد:** من ذاكرة الأجهزة التي سجّل عليها مسؤولون، أو عبر هجمات مثل Kerberoasting على حسابات الخدمة.
4. **الحركة الجانبية:** استخدام حساب مسؤول محلي مشترك أو بيانات مسروقة للانتقال بين الأجهزة.
5. **التصعيد:** الوصول إلى حساب ضمن Domain Admins أو إلى وحدة تحكم بالنطاق.
6. **الثبات:** إنشاء حسابات أو تعديل سياسات مجموعات أو سرقة مفتاح حساب krbtgt.

كل قسم في هذا الدليل يستهدف خطوة أو أكثر من هذه الخطوات.

## نموذج المستويات وفصل الصلاحيات

القاعدة الأهم: **الحساب ذو الصلاحيات العالية لا يسجل الدخول أبدًا على جهاز أقل أمانًا**. تنصح Microsoft في نموذج الوصول المؤسسي (Enterprise Access Model) بفصل مستويات التحكم. صيغة عملية مبسطة:

| المستوى | يشمل | قاعدة الدخول |
|---|---|---|
| المستوى 0 | وحدات التحكم بالنطاق، خوادم PKI، أنظمة إدارة الهوية | حسابات مستوى 0 فقط ومن محطات إدارة مخصصة |
| المستوى 1 | الخوادم والتطبيقات | حسابات إدارة خوادم منفصلة |
| المستوى 2 | أجهزة المستخدمين | حسابات دعم فني لا تملك صلاحيات على الخوادم |

عمليًا:

- لكل مسؤول حسابان على الأقل: حساب يومي للبريد والتصفح، وحساب إداري منفصل.
- حافظ على عضوية Domain Admins وEnterprise Admins وSchema Admins في حدها الأدنى، ويُفضّل أن تكون فارغة إلا عند الحاجة.
- أضف الحسابات المميزة إلى مجموعة **Protected Users** بعد اختبار التوافق، فهي تمنع تخزين بيانات الاعتماد في ذاكرة التخزين المؤقت وتمنع استخدام NTLM وتشفير RC4 وDES لأعضائها.
- استخدم محطات وصول مميزة (PAW) لإدارة المستوى 0.

راجع [مبدأ أقل الصلاحيات عمليًا](/article/least-privilege-principle-practical) و[إعداد Active Directory الكامل](/article/active-directory-complete-setup-guide).

## حسابات الخدمة: الحلقة الأضعف

حسابات الخدمة غالبًا لديها كلمات مرور قديمة لا تتغير، وصلاحيات أوسع من اللازم، ومرتبطة بـSPN مما يجعلها عرضة لهجوم Kerberoasting، حيث يطلب أي مستخدم في النطاق تذكرة خدمة ثم يحاول كسر كلمة المرور دون اتصال.

الحلول بالترتيب:

1. **حسابات الخدمة المُدارة بمجموعة (gMSA):** كلمة مرور من 120 حرفًا تُدار وتُغيَّر تلقائيًا. وفي Windows Server 2025 أُضيفت حسابات dMSA لتسهيل الترحيل من حسابات الخدمة التقليدية.
2. **إذا تعذر ذلك:** كلمة مرور عشوائية طويلة جدًا (25 حرفًا فأكثر) تُغيَّر دوريًا.
3. **تشفير AES فقط:** فعّل AES على الحساب ثم غيّر كلمة المرور لتوليد مفاتيح AES، وأوقف RC4 حيث أمكن.
4. **أقل الصلاحيات:** حساب الخدمة لا يحتاج أن يكون مسؤول نطاق في الأغلب.

التفاصيل والكشف في [كشف هجوم Kerberoasting ومنعه](/article/kerberoasting-detection-prevention)، وخلفية البروتوكول في [شرح مصادقة Kerberos](/article/kerberos-authentication-explained).

## كلمات مرور المسؤول المحلي

إذا كانت كلمة مرور حساب Administrator المحلي متطابقة على كل الأجهزة، فاختراق جهاز واحد يعني الوصول إلى جميعها. الحل هو **Windows LAPS** المدمج في Windows منذ تحديثات أبريل 2023، والذي يولّد كلمة مرور فريدة لكل جهاز ويخزنها في AD أو Microsoft Entra ID ويغيّرها دوريًا. راجع [تدوير كلمة مرور المسؤول المحلي](/article/windows-local-admin-password-rotation).

## سياسات المجموعات (GPO) كأداة أمان

سياسات المجموعات وسيلة لفرض الإعدادات الأمنية على كل الأجهزة. أهم الإعدادات:

- سياسات التدقيق المتقدمة (Advanced Audit Policy) لتوليد الأحداث التي يحتاجها الـSOC.
- تقييد من يستطيع تسجيل الدخول محليًا أو عبر RDP إلى الخوادم ووحدات التحكم.
- تعطيل البروتوكولات القديمة: SMBv1 وLLMNR وNetBIOS حيث لا تُستخدم، وتقليل NTLM تدريجيًا.
- فرض توقيع SMB وتوقيع LDAP وربط القنوات (Channel Binding).

وانتبه: من يستطيع تعديل GPO مرتبطة بوحدة تحكم بالنطاق يملك فعليًا صلاحيات المستوى 0. راجع [أساسيات سياسات المجموعات](/article/group-policy-basics-for-sysadmins).

## سياسة كلمات المرور الحديثة

توصيات NIST الحالية (SP 800-63B) تفضل كلمات مرور طويلة ومقارنتها بقوائم كلمات المرور المسربة، بدل فرض تعقيد شكلي وتغيير دوري إجباري دون سبب. وفي AD يمكن تطبيق سياسات كلمات مرور دقيقة (Fine-Grained Password Policies) لفرض طول أكبر على الحسابات المميزة. راجع [إرشادات NIST لكلمات المرور](/article/nist-password-guidelines-vs-old-rules).

## المصادقة متعددة العوامل والهوية الهجينة

إذا كانت هويات AD متزامنة مع Microsoft Entra ID، فإن حماية الهوية السحابية جزء من حماية AD. فعّل MFA لكل المستخدمين، وفضّل الطرق المقاومة للتصيد مثل FIDO2 وWindows Hello for Business للحسابات المميزة. وانتبه لهجمات إغراق الإشعارات كما في [هجمات إرهاق MFA](/article/mfa-fatigue-attacks-explained)، وقارن الطرق في [دليل المصادقة الثنائية العملي](/article/2fa-practical-guide).

## الصلاحيات المخفية: التفويض وقوائم التحكم بالوصول

ليست كل الصلاحيات الخطيرة ظاهرة في عضوية المجموعات. كثير من مسارات التصعيد تأتي من إعدادات متراكمة عبر السنين:

- **صلاحيات على الكائنات (ACL):** مثل GenericAll أو WriteDacl أو حق إعادة تعيين كلمة المرور على حساب مميز. مستخدم عادي يملك أحد هذه الحقوق على مجموعة Domain Admins يستطيع إضافة نفسه إليها.
- **التفويض غير المقيد (Unconstrained Delegation):** الخادم المفوَّض بهذه الطريقة يحتفظ بتذاكر المستخدمين الذين يتصلون به، فإذا اختُرق يمكن سرقة تذاكر حسابات مميزة. استبدله بالتفويض المقيد أو التفويض المقيد القائم على الموارد، وضع الحسابات الحساسة في خيار "Account is sensitive and cannot be delegated".
- **مالكو الكائنات:** المالك يستطيع تعديل الصلاحيات، فراجع ملكية الكائنات الحساسة.
- **AdminSDHolder:** يحمي صلاحيات المجموعات المميزة ويعيد تطبيقها دوريًا؛ أي تعديل غير متوقع عليه مؤشر خطير.

استخدم أدوات تقييم مجانية وموثوقة لرسم هذه المسارات دوريًا، وعالج المسارات التي تصل إلى المستوى 0 أولًا.

## خدمات الشهادات (AD CS)

إذا كانت لديك جهة إصدار شهادات مؤسسية مدمجة مع AD، فهي جزء من المستوى 0. قوالب الشهادات سيئة الإعداد، مثل القوالب التي تسمح للطالب بتحديد اسم الموضوع (Subject) مع إمكانية استخدام الشهادة للمصادقة، قد تسمح لمستخدم عادي بالحصول على شهادة باسم مسؤول. راجع القوالب المنشورة، وقيّد صلاحيات التسجيل، وفعّل موافقة المدير على القوالب الحساسة، وراقب طلبات الشهادات. خلفية المفاهيم في [شرح البنية التحتية للمفاتيح العامة](/article/pki-certificate-authority-explained).

## المراقبة: الأحداث التي يجب أن تُنبهك

| الحدث | المعنى | لماذا يهم |
|---|---|---|
| 4728 / 4732 / 4756 | إضافة عضو إلى مجموعة أمان | إضافة غير متوقعة إلى مجموعة مميزة |
| 4720 | إنشاء حساب مستخدم | حساب ثبات أنشأه مهاجم |
| 4769 مع تشفير 0x17 | طلب تذكرة خدمة بتشفير RC4 | مؤشر محتمل على Kerberoasting |
| 4740 | قفل حساب | محاولات تخمين |
| 4662 | عملية على كائن في AD | مؤشر محتمل على DCSync عند ظهور صلاحيات النسخ المتماثل لحساب غير وحدة تحكم |
| 5136 | تعديل كائن في الدليل | تغييرات على GPO أو كائنات حساسة |

التفاصيل في [أهم معرّفات أحداث أمان Windows](/article/windows-security-event-ids-soc) و[سجلات الأمان في Event Viewer](/article/windows-event-viewer-security-logs).

## التعافي: هل تستطيع إعادة بناء النطاق؟

- احتفظ بنسخة احتياطية لحالة النظام (System State) لوحدة تحكم واحدة على الأقل في كل نطاق، معزولة عن الشبكة.
- وثّق إجراءات استعادة الغابة (Forest Recovery) من دليل Microsoft واختبرها في بيئة معزولة.
- بعد أي اختراق للمستوى 0، أعد تعيين كلمة مرور حساب krbtgt مرتين مع مراعاة فترة النسخ المتماثل بينهما.

## الأسئلة الشائعة

### هل يكفي وضع كلمة مرور قوية لحساب Domain Admin؟

لا. المهاجم غالبًا لا يخمن كلمة المرور بل يسرقها من ذاكرة جهاز سجّل عليه المسؤول. الفصل بين المستويات واستخدام محطات إدارة مخصصة أهم من قوة كلمة المرور وحدها.

### ما الفرق بين gMSA وحساب الخدمة العادي؟

حساب gMSA يدير AD كلمة مروره تلقائيًا بطول 120 حرفًا ويغيرها دوريًا، ولا يعرفها أي شخص، بينما حساب الخدمة العادي يعتمد على كلمة مرور يضعها مسؤول وغالبًا لا تتغير.

### هل تعطيل NTLM بالكامل ممكن؟

في كثير من البيئات يتطلب ذلك تدقيقًا طويلًا لأن تطبيقات قديمة تعتمد عليه. ابدأ بتفعيل تدقيق NTLM لمعرفة من يستخدمه، ثم قيّده تدريجيًا.

### كم عدد أعضاء Domain Admins المثالي؟

أقل عدد ممكن، ويفضل صفر أعضاء دائمين مع منح الصلاحية عند الحاجة فقط ولفترة محدودة.

## المراجع

- [Microsoft Learn: Best practices for securing Active Directory](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory)
- [Microsoft Learn: Enterprise access model](https://learn.microsoft.com/en-us/security/privileged-access-workstations/privileged-access-access-model)
- [Microsoft Learn: Windows LAPS overview](https://learn.microsoft.com/en-us/windows-server/identity/laps/laps-overview)
- [Microsoft Security Blog: Guidance to help mitigate Kerberoasting](https://www.microsoft.com/en-us/security/blog/2024/10/11/microsofts-guidance-to-help-mitigate-kerberoasting/)
- [NIST SP 800-63B: Digital Identity Guidelines](https://pages.nist.gov/800-63-4/sp800-63b.html)
`,
    en: `## Why Active Directory is target number one

In most Windows organisations, Active Directory (AD) controls who gets into what: user devices, servers, email and often remote access and cloud apps through synchronisation. An attacker who reaches Domain Admin controls the whole environment, which is why most modern ransomware operations take over AD before encrypting anything.

This guide orders AD protection from the foundations to monitoring and links to the detailed articles and a video playlist.

## How attackers usually move through AD

Understanding the path helps you break it:

1. **Initial access:** a phishing email or an exploited internet-facing service gives the attacker a normal user's device.
2. **Reconnaissance:** by default any domain user can read most AD objects, so the attacker finds privileged groups and service accounts.
3. **Credential theft:** from the memory of machines where admins have logged on, or via attacks such as Kerberoasting against service accounts.
4. **Lateral movement:** a shared local admin password or stolen credentials let them hop between machines.
5. **Escalation:** reaching a Domain Admins member or a domain controller.
6. **Persistence:** creating accounts, editing Group Policy, or stealing the krbtgt key.

Every section of this guide targets one or more of these steps.

## The tier model and separating privilege

The most important rule: **a highly privileged account never logs on to a less trusted machine**. Microsoft's Enterprise Access Model separates control planes. A simplified, practical version:

| Tier | Contains | Logon rule |
|---|---|---|
| Tier 0 | Domain controllers, PKI servers, identity management systems | Tier 0 accounts only, from dedicated admin workstations |
| Tier 1 | Servers and applications | Separate server admin accounts |
| Tier 2 | User devices | Helpdesk accounts with no rights on servers |

In practice:

- Every administrator has at least two accounts: a daily account for email and browsing, and a separate admin account.
- Keep Domain Admins, Enterprise Admins and Schema Admins membership to a minimum — ideally empty except when needed.
- Add privileged accounts to **Protected Users** after compatibility testing: it prevents credential caching and blocks NTLM, RC4 and DES for its members.
- Use privileged access workstations (PAWs) for Tier 0 administration.

See [the least-privilege principle in practice](/article/least-privilege-principle-practical) and [the complete Active Directory setup guide](/article/active-directory-complete-setup-guide).

## Service accounts: the weakest link

Service accounts often have old passwords that never change, more rights than needed, and an SPN that makes them vulnerable to Kerberoasting, where any domain user requests a service ticket and tries to crack the password offline.

Fixes, in order:

1. **Group Managed Service Accounts (gMSA):** a 120-character password managed and rotated automatically. Windows Server 2025 adds delegated MSAs (dMSA) to ease migration from classic service accounts.
2. **If that's not possible:** a very long random password (25+ characters) rotated periodically.
3. **AES only:** enable AES on the account, then change the password to generate AES keys, and retire RC4 where you can.
4. **Least privilege:** a service account rarely needs to be a domain admin.

Detection and details in [Kerberoasting detection and prevention](/article/kerberoasting-detection-prevention); protocol background in [Kerberos authentication explained](/article/kerberos-authentication-explained).

## Local administrator passwords

If the local Administrator password is the same on every machine, compromising one means reaching all of them. The fix is **Windows LAPS**, built into Windows since the April 2023 updates, which generates a unique password per device, stores it in AD or Microsoft Entra ID and rotates it. See [rotating the local admin password](/article/windows-local-admin-password-rotation).

## Group Policy as a security tool

Group Policy enforces security settings across every machine. The most important settings:

- Advanced Audit Policy, to generate the events your SOC needs.
- Restrict who can log on locally or via RDP to servers and domain controllers.
- Disable legacy protocols: SMBv1, LLMNR and NetBIOS where unused, and reduce NTLM gradually.
- Require SMB signing, LDAP signing and channel binding.

Beware: anyone who can edit a GPO linked to domain controllers effectively holds Tier 0 rights. See [Group Policy basics](/article/group-policy-basics-for-sysadmins).

## A modern password policy

Current NIST guidance (SP 800-63B) favours long passwords checked against breached-password lists over cosmetic complexity rules and forced periodic changes without cause. In AD, Fine-Grained Password Policies let you require longer passwords for privileged accounts. See [NIST password guidelines vs old rules](/article/nist-password-guidelines-vs-old-rules).

## MFA and hybrid identity

If AD identities sync to Microsoft Entra ID, protecting cloud identity is part of protecting AD. Enforce MFA for all users and prefer phishing-resistant methods such as FIDO2 and Windows Hello for Business for privileged accounts. Watch for push-bombing as described in [MFA fatigue attacks](/article/mfa-fatigue-attacks-explained), and compare methods in the [practical 2FA guide](/article/2fa-practical-guide).

## Hidden privilege: delegation and ACLs

Not all dangerous rights show up in group membership. Many escalation paths come from settings accumulated over years:

- **Object permissions (ACLs):** rights such as GenericAll, WriteDacl or Reset Password on a privileged account. A normal user holding one of these on the Domain Admins group can add themselves to it.
- **Unconstrained delegation:** a server trusted this way keeps the tickets of users who connect to it, so if it is compromised, privileged tickets can be stolen. Replace it with constrained or resource-based constrained delegation, and mark sensitive accounts "Account is sensitive and cannot be delegated".
- **Object owners:** an owner can change permissions, so review ownership of sensitive objects.
- **AdminSDHolder:** protects the permissions of privileged groups and reapplies them periodically; any unexpected change to it is a serious indicator.

Use reputable, free assessment tools to map these paths regularly, and fix paths that reach Tier 0 first.

## Certificate Services (AD CS)

If you run an enterprise certificate authority integrated with AD, it is part of Tier 0. Misconfigured certificate templates — for example ones that let the requester supply the subject name while allowing client authentication — can let a normal user obtain a certificate as an administrator. Review published templates, restrict enrolment rights, require manager approval for sensitive templates and monitor certificate requests. Background in [PKI and certificate authorities explained](/article/pki-certificate-authority-explained).

## Monitoring: events that should alert you

| Event | Meaning | Why it matters |
|---|---|---|
| 4728 / 4732 / 4756 | Member added to a security group | Unexpected addition to a privileged group |
| 4720 | User account created | Persistence account created by an attacker |
| 4769 with type 0x17 | Service ticket requested with RC4 | Possible Kerberoasting indicator |
| 4740 | Account locked out | Guessing attempts |
| 4662 | Operation performed on an AD object | Possible DCSync when replication rights are used by a non-DC account |
| 5136 | Directory object modified | Changes to GPOs or sensitive objects |

Details in [Windows security event IDs for SOC teams](/article/windows-security-event-ids-soc) and [Event Viewer security logs](/article/windows-event-viewer-security-logs).

## Recovery: can you rebuild the domain?

- Keep a System State backup of at least one domain controller per domain, isolated from the network.
- Document Microsoft's forest recovery procedure and rehearse it in an isolated lab.
- After any Tier 0 compromise, reset the krbtgt password twice, allowing for replication between the resets.

## FAQ

### Is a strong Domain Admin password enough?

No. Attackers rarely guess it; they steal it from the memory of a machine where the admin logged on. Tier separation and dedicated admin workstations matter more than password strength alone.

### What's the difference between a gMSA and a regular service account?

AD manages a gMSA's 120-character password automatically and rotates it, and no human knows it; a regular service account relies on a password set by an admin that often never changes.

### Can NTLM be disabled completely?

In many environments that takes a long audit because legacy apps depend on it. Start by enabling NTLM auditing to see who uses it, then restrict it gradually.

### What's the ideal number of Domain Admins?

As few as possible — ideally zero permanent members, with rights granted just in time for a limited period.

## References

- [Microsoft Learn: Best practices for securing Active Directory](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory)
- [Microsoft Learn: Enterprise access model](https://learn.microsoft.com/en-us/security/privileged-access-workstations/privileged-access-access-model)
- [Microsoft Learn: Windows LAPS overview](https://learn.microsoft.com/en-us/windows-server/identity/laps/laps-overview)
- [Microsoft Security Blog: Guidance to help mitigate Kerberoasting](https://www.microsoft.com/en-us/security/blog/2024/10/11/microsofts-guidance-to-help-mitigate-kerberoasting/)
- [NIST SP 800-63B: Digital Identity Guidelines](https://pages.nist.gov/800-63-4/sp800-63b.html)
`,
  },
};
