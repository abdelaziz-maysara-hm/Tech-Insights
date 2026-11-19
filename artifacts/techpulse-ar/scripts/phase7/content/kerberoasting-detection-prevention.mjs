export default {
  slug: 'kerberoasting-detection-prevention',
  categoryId: 'cybersecurity',
  subcategoryId: 'identity',
  tags: ['kerberos', 'active-directory', 'kerberoasting', 'service-accounts', 'detection'],
  domainIds: ['cybersecurity'],
  topicIds: ['active-directory', 'iam-pam', 'threat-detection'],
  contentType: 'guide',
  vendorIds: ['microsoft'],
  productIds: ['active-directory'],
  title: {
    ar: 'هجوم Kerberoasting: كيف يعمل وكيف تكشفه وتمنعه',
    en: 'Kerberoasting: How It Works, How to Detect and Prevent It',
  },
  excerpt: {
    ar: 'لماذا تستطيع أي حساب في النطاق مهاجمة حسابات الخدمة، وكيف تكشف الهجوم بالحدث 4769، وكيف تمنعه بـgMSA وكلمات مرور طويلة وتشفير AES.',
    en: 'Why any domain account can attack service accounts, how to detect it with event 4769, and how to prevent it with gMSAs, long passwords and AES.',
  },
  body: {
    ar: `## ما هو Kerberoasting؟

في Kerberos، عندما يريد مستخدم الوصول إلى خدمة (مثل SQL Server)، يطلب من وحدة التحكم بالنطاق **تذكرة خدمة (TGS)**. جزء من هذه التذكرة مشفر بمفتاح مشتق من كلمة مرور الحساب الذي تعمل به الخدمة. الحيلة في الهجوم:

1. أي مستخدم مصادَق عليه في النطاق يستطيع طلب تذكرة لأي حساب مرتبط بـ**SPN** (Service Principal Name)، وهذا سلوك طبيعي في البروتوكول.
2. يأخذ المهاجم التذكرة ويحاول كسر كلمة المرور **دون اتصال** على أجهزته الخاصة، دون أي محاولات دخول فاشلة تُسجَّل على النطاق.
3. إذا كانت كلمة مرور حساب الخدمة ضعيفة أو قديمة، يحصل عليها المهاجم، وغالبًا تكون لحسابات الخدمة صلاحيات واسعة.

لا يحتاج الهجوم إلى ثغرة؛ إنه يستغل كلمات المرور الضعيفة والتشفير القديم. ولهذا يبقى من أكثر تقنيات التصعيد شيوعًا. خلفية البروتوكول في [شرح مصادقة Kerberos](/article/kerberos-authentication-explained).

## لماذا يهم نوع التشفير؟

إذا كانت التذكرة مشفرة بـ**RC4** (النوع 0x17)، فالمفتاح مشتق مباشرة من تجزئة NTLM لكلمة المرور، ومحاولات الكسر أسرع بكثير مقارنة بـ**AES** (النوعان 0x11 و0x12). لذلك يحاول المهاجمون طلب تذاكر RC4 عمدًا. لكن انتبه: AES وحده لا يحمي كلمة مرور ضعيفة؛ يبطئ الكسر فقط.

وقد أعلنت Microsoft نيتها تعطيل RC4 افتراضيًا في تحديث مستقبلي لـWindows 11 24H2 وWindows Server 2025، وتنصح بتعطيله يدويًا على حسابات الخدمة في البيئات التي لم تصلها هذه التحديثات.

## الكشف

### 1. الحدث 4769 على وحدات التحكم

فعّل تدقيق "Kerberos Service Ticket Operations" على وحدات التحكم، ثم ابحث عن:

- **Ticket Encryption Type = 0x17** لحسابات تعرف أنها تدعم AES.
- **حساب واحد يطلب تذاكر لعدد كبير من الخدمات المختلفة** خلال فترة قصيرة.
- طلبات من أجهزة أو حسابات لا تستخدم هذه الخدمات عادة.

مثال على فلتر XML في Event Viewer لعرض طلبات RC4، مأخوذ من مدونة فريق دعم Microsoft:

\`\`\`xml
<QueryList>
  <Query Id="0" Path="Security">
    <Select Path="Security">*[EventData[Data[@Name='TicketEncryptionType']='0x17']]</Select>
  </Query>
</QueryList>
\`\`\`

### 2. حسابات الطُعم (Honey SPN)

أنشئ حساب خدمة وهميًا بـSPN لا تستخدمه أي خدمة حقيقية وبكلمة مرور عشوائية طويلة جدًا. أي طلب تذكرة له مؤشر شبه مؤكد على استطلاع خبيث، مع إنذارات كاذبة قليلة جدًا. الفكرة مشروحة في [أساسيات مصائد العسل والخداع](/article/honeypot-deception-basics).

### 3. أدوات الكشف المدمجة

إذا كنت تستخدم Microsoft Defender for Identity، فهو يولّد تنبيهات على أنماط مشابهة، وتشير Microsoft إلى تنبيه بمعرّف خارجي 2410 للاشتباه في كشف SPN.

## المنع والتخفيف

| الإجراء | الأثر |
|---|---|
| استخدام gMSA أو dMSA لحسابات الخدمة | كلمة مرور من 120 حرفًا تُدار تلقائيًا، ما يجعل الكسر غير عملي |
| كلمة مرور عشوائية طويلة (25+ حرفًا) إذا تعذر gMSA | يرفع تكلفة الكسر بشكل كبير |
| تفعيل AES على الحساب ثم تغيير كلمة المرور | لا تتولد مفاتيح AES إلا بعد تغيير كلمة المرور |
| تعطيل RC4 حيث أمكن | يمنع طلب تذاكر أسهل كسرًا |
| أقل الصلاحيات لحسابات الخدمة | حتى لو كُسرت كلمة المرور يبقى الضرر محدودًا |
| إزالة SPN غير المستخدمة | تقليل الأهداف المتاحة |

### جرد حسابات الخدمة

ابدأ بمعرفة الحسابات المعرضة، أي حسابات المستخدمين التي لديها SPN:

\`\`\`powershell
Get-ADUser -Filter "ServicePrincipalName -like '*'" -Properties ServicePrincipalName, PasswordLastSet, msDS-SupportedEncryptionTypes |
  Select-Object SamAccountName, PasswordLastSet, msDS-SupportedEncryptionTypes
\`\`\`

رتّب النتائج حسب تاريخ آخر تغيير لكلمة المرور، وعالج الأقدم والأكثر صلاحيات أولًا. للمزيد من أوامر PowerShell راجع [مهام Active Directory اليومية بـPowerShell](/article/ad-powershell-daily-tasks).

### الهجوم المشابه: AS-REP Roasting

الحسابات المفعل عليها خيار "Do not require Kerberos preauthentication" معرضة لهجوم مشابه لا يحتاج حتى إلى حساب في النطاق. ابحث عنها وأزل هذا الخيار إلا لسبب موثق.

## الأسئلة الشائعة

### هل يحتاج المهاجم صلاحيات مسؤول لتنفيذ Kerberoasting؟

لا، أي حساب مستخدم عادي في النطاق يكفي، ولهذا يأتي الهجوم عادة بعد اختراق جهاز واحد.

### هل تغيير كلمة مرور حساب الخدمة يكسر التطبيقات؟

قد يحدث إذا كانت كلمة المرور محفوظة في أماكن متعددة. لهذا تحل gMSA المشكلة جذريًا لأن Windows يدير كلمة المرور ويحدّثها تلقائيًا للخوادم المصرح لها.

### هل يمنع تشفير AES الهجوم تمامًا؟

لا. AES يبطئ الكسر، لكن كلمة المرور الضعيفة تبقى قابلة للكسر. المزيج الصحيح هو gMSA أو كلمة مرور طويلة جدًا مع AES.

## المراجع

- [Microsoft Security Blog: Microsoft's guidance to help mitigate Kerberoasting](https://www.microsoft.com/en-us/security/blog/2024/10/11/microsofts-guidance-to-help-mitigate-kerberoasting/)
- [Microsoft Learn: Detect and remediate RC4 usage in Kerberos](https://learn.microsoft.com/en-us/windows-server/security/kerberos/detect-remediate-rc4-kerberos)
- [Microsoft Learn: Event 4769](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769)
- [Microsoft Learn: Group Managed Service Accounts overview](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-managed-service-accounts/group-managed-service-accounts/group-managed-service-accounts-overview)
- [MITRE ATT&CK T1558.003: Kerberoasting](https://attack.mitre.org/techniques/T1558/003/)
`,
    en: `## What is Kerberoasting?

In Kerberos, when a user wants to reach a service (such as SQL Server), they ask the domain controller for a **service ticket (TGS)**. Part of that ticket is encrypted with a key derived from the password of the account the service runs as. The attack's trick:

1. Any authenticated domain user can request a ticket for any account with an **SPN** (Service Principal Name); that's normal protocol behaviour.
2. The attacker takes the ticket and tries to crack the password **offline** on their own hardware, without any failed logons being recorded in the domain.
3. If the service account's password is weak or old, the attacker gets it — and service accounts often have broad rights.

The attack needs no vulnerability; it abuses weak passwords and legacy encryption, which is why it remains one of the most common escalation techniques. Protocol background in [Kerberos authentication explained](/article/kerberos-authentication-explained).

## Why the encryption type matters

If the ticket is encrypted with **RC4** (type 0x17), the key is derived directly from the password's NTLM hash and cracking is much faster than with **AES** (types 0x11 and 0x12). Attackers therefore request RC4 tickets on purpose. But note: AES alone doesn't protect a weak password; it only slows cracking.

Microsoft has announced its intent to disable RC4 by default in a future update to Windows 11 24H2 and Windows Server 2025, and recommends disabling it manually on service accounts in environments without those updates.

## Detection

### 1. Event 4769 on domain controllers

Enable "Kerberos Service Ticket Operations" auditing on DCs, then look for:

- **Ticket Encryption Type = 0x17** for accounts you know support AES.
- **One account requesting tickets for many different services** in a short time.
- Requests from machines or accounts that don't normally use those services.

An example Event Viewer XML filter for RC4 requests, from Microsoft's Ask the Directory Services Team blog:

\`\`\`xml
<QueryList>
  <Query Id="0" Path="Security">
    <Select Path="Security">*[EventData[Data[@Name='TicketEncryptionType']='0x17']]</Select>
  </Query>
</QueryList>
\`\`\`

### 2. Honey SPN accounts

Create a decoy service account with an SPN no real service uses and a very long random password. Any ticket request for it is a near-certain sign of malicious reconnaissance, with very few false positives. The idea is explained in [honeypot and deception basics](/article/honeypot-deception-basics).

### 3. Built-in detections

If you use Microsoft Defender for Identity, it alerts on similar patterns; Microsoft cites an alert with external ID 2410 for suspected SPN exposure.

## Prevention and mitigation

| Action | Effect |
|---|---|
| Use gMSA or dMSA for service accounts | A 120-character auto-managed password makes cracking impractical |
| A long random password (25+ characters) if gMSA isn't possible | Raises cracking cost dramatically |
| Enable AES on the account, then change the password | AES keys are only generated after a password change |
| Disable RC4 where possible | Prevents easier-to-crack tickets |
| Least privilege for service accounts | Limits damage even if a password is cracked |
| Remove unused SPNs | Fewer available targets |

### Inventory your service accounts

Start by finding exposed accounts — user accounts with an SPN:

\`\`\`powershell
Get-ADUser -Filter "ServicePrincipalName -like '*'" -Properties ServicePrincipalName, PasswordLastSet, msDS-SupportedEncryptionTypes |
  Select-Object SamAccountName, PasswordLastSet, msDS-SupportedEncryptionTypes
\`\`\`

Sort by password age and fix the oldest and most privileged first. More PowerShell in [daily Active Directory tasks with PowerShell](/article/ad-powershell-daily-tasks).

### A related attack: AS-REP roasting

Accounts with "Do not require Kerberos preauthentication" enabled are exposed to a similar attack that doesn't even need a domain account. Find them and remove the flag unless there's a documented reason.

## FAQ

### Does the attacker need admin rights for Kerberoasting?

No — any normal domain user account is enough, which is why the attack usually follows the compromise of a single machine.

### Will changing a service account password break applications?

It can, if the password is stored in several places. That's exactly why gMSAs solve the problem: Windows manages the password and updates it automatically for authorised servers.

### Does AES encryption stop the attack completely?

No. AES slows cracking, but a weak password remains crackable. The right combination is a gMSA or a very long password, plus AES.

## References

- [Microsoft Security Blog: Microsoft's guidance to help mitigate Kerberoasting](https://www.microsoft.com/en-us/security/blog/2024/10/11/microsofts-guidance-to-help-mitigate-kerberoasting/)
- [Microsoft Learn: Detect and remediate RC4 usage in Kerberos](https://learn.microsoft.com/en-us/windows-server/security/kerberos/detect-remediate-rc4-kerberos)
- [Microsoft Learn: Event 4769](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769)
- [Microsoft Learn: Group Managed Service Accounts overview](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-managed-service-accounts/group-managed-service-accounts/group-managed-service-accounts-overview)
- [MITRE ATT&CK T1558.003: Kerberoasting](https://attack.mitre.org/techniques/T1558/003/)
`,
  },
};
