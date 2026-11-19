## لماذا Conditional Access وليس "تفعيل MFA" فقط؟

**Conditional Access** في Microsoft Entra ID هو محرك قرارات: إذا كان هذا المستخدم، من هذا الجهاز أو الموقع، يحاول الوصول إلى هذا التطبيق، فاطلب كذا أو امنع. يتطلب ترخيص Microsoft Entra ID P1 على الأقل (متضمن في Microsoft 365 Business Premium وE3 وE5). المؤسسات التي لا تملك هذا الترخيص تستخدم **Security defaults**، وهو إعداد جاهز يفرض MFA ويحظر المصادقة القديمة دون تخصيص.

الخطر الحقيقي ليس غياب MFA تمامًا، بل **الثغرات** في تغطيته: تطبيق مستثنى، أو بروتوكول قديم لا يدعم MFA، أو سياسة تغطي "Office 365" فقط. في يوليو 2026 نشرت Huntress تحليلًا لحملة رش كلمات مرور (password spraying) عبر Azure CLI استغلت تدفق OAuth القديم (ROPC) في مؤسسات لم تكن سياسات Conditional Access فيها تغطي كل تطبيقات السحابة، فاخترق المهاجمون عشرات الحسابات رغم وجود MFA على البريد.

## قبل أول سياسة: حسابات الطوارئ

أنشئ حسابين على الأقل للطوارئ (break-glass) سحابيين بالكامل، بصلاحية Global Administrator، واستثنِهما من كل السياسات، واحمهما بمفتاح FIDO2 أو مصادقة بالشهادات، وراقب أي تسجيل دخول بهما بتنبيه فوري. بدونهما قد تقفل نفسك خارج المستأجر بسياسة خاطئة واحدة.

## مجموعة البداية (Secure foundation)

تقدّم Microsoft قوالب جاهزة في **Entra admin center > Entra ID > Conditional Access > Create new policy from templates**، وتُنشأ في وضع Report-only افتراضيًا. مجموعة البداية التي نوصي بها:

1. **فرض MFA على المسؤولين** (قالب Require MFA for admins): كل أدوار الإدارة الحساسة، ويُفضّل لاحقًا رفعها إلى MFA مقاوم للتصيد (FIDO2 أو Windows Hello for Business).
2. **حظر المصادقة القديمة** (Block legacy authentication): البروتوكولات القديمة (مثل IMAP وPOP وSMTP AUTH الأساسي) لا تدعم MFA، فهي باب خلفي مفتوح.
3. **فرض MFA على جميع المستخدمين**: على **كل الموارد** (All resources) وليس على تطبيقات مختارة فقط.
4. **فرض MFA على إدارة Azure**: يغطي بوابة Azure وAzure CLI وPowerShell. Microsoft نفسها بدأت فرض MFA على هذه الواجهات تدريجيًا (المرحلة الثانية للـCLI وPowerShell منذ 1 أكتوبر 2025)، لكن سياستك يجب ألا تعتمد على ذلك وحده.
5. **تأمين تسجيل وسائل التحقق**: حتى لا يسجّل المهاجم وسيلة MFA خاصة به من أي مكان إذا عرف كلمة المرور.

## الطبقة الثانية بعد الاستقرار

- **اشتراط جهاز متوافق أو منضم للنطاق** للوصول إلى البيانات الحساسة، مع Intune.
- **سياسات المخاطر** لتسجيلات الدخول الخطرة والمستخدمين عاليي الخطورة: تتطلب ترخيص Entra ID P2.
- **حظر منصات الأجهزة غير المعروفة أو غير المدعومة**.
- سياسات خاصة لحسابات الضيوف.

## طريقة النشر الآمن

1. أنشئ السياسة في وضع **التقرير فقط** (Report-only).
2. راقب **سجلات تسجيل الدخول** لأسبوع أو اثنين: من سيتأثر؟ أي تطبيقات تستخدم مصادقة قديمة؟
3. استخدم أداة **What If** لاختبار حالات محددة.
4. فعّل السياسة لمجموعة تجريبية، ثم للجميع.
5. راجع الاستثناءات كل ربع سنة؛ الاستثناءات المؤقتة تميل لأن تصبح دائمة.

للصورة الكاملة لأمن الهوية في البيئات الهجينة راجع [دليل أمن Active Directory والهوية](/article/active-directory-identity-security-guide)، ولأسباب تفضيل MFA المقاوم للتصيد راجع [هجمات إرهاق MFA](/article/mfa-fatigue-attacks-explained).

## الأسئلة الشائعة

**هل أستثني حسابات الخدمة؟**
حسابات الخدمة التي هي حسابات مستخدمين عادية تمثل خطرًا؛ الأفضل استبدالها بهويات مُدارة أو كيانات خدمة، وتطبيق سياسات الوصول المشروط الخاصة بهويات أحمال العمل.

**هل Security defaults كافية؟**
للمؤسسات الصغيرة بدون P1 هي بداية ممتازة. لكنها لا تسمح بالاستثناءات أو بالشروط المخصصة.

**ماذا عن السياسات الكلاسيكية القديمة؟**
توقفت عن العمل منذ يوليو 2024 حسب Microsoft. إن كانت ما زالت ظاهرة في المستأجر فانقل إعداداتها إلى سياسات حديثة ثم عطّلها.

## المراجع

- [Conditional Access templates — Microsoft Learn](https://learn.microsoft.com/entra/identity/conditional-access/concept-conditional-access-policy-common)
- [Manage emergency access accounts in Microsoft Entra ID — Microsoft Learn](https://learn.microsoft.com/entra/identity/role-based-access-control/security-emergency-access)
- [Plan for mandatory Microsoft Entra MFA — Microsoft Learn](https://learn.microsoft.com/entra/identity/authentication/concept-mandatory-multifactor-authentication)
- [Block legacy authentication with Conditional Access — Microsoft Learn](https://learn.microsoft.com/entra/identity/conditional-access/policy-block-legacy-authentication)
- [Massive password spray campaign targeting Azure CLI — SecurityWeek (يوليو 2026)](https://www.securityweek.com/massive-password-spray-campaign-targeting-azure-cli/)
