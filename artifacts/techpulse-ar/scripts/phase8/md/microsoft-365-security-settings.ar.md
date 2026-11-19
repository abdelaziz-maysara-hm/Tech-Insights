## كيف تستخدم هذه القائمة؟

معظم اختراقات Microsoft 365 لا تحتاج ثغرة؛ تحتاج كلمة مرور مسروقة وإعدادًا افتراضيًا لم يُراجع. القائمة التالية مرتبة حسب الأثر: ابدأ من الأعلى. بعض الإعدادات تتطلب تراخيص محددة (مثل Entra ID P1/P2 أو Defender for Office 365)، وقد أشرنا لذلك.

## أولًا: الهوية

**1. MFA للجميع.** عبر Conditional Access إن كان لديك Entra ID P1، أو Security defaults إن لم يكن. التفاصيل في [سياسات Conditional Access الأساسية](/article/entra-conditional-access-baseline).

**2. حظر المصادقة القديمة.** البروتوكولات التي لا تدعم MFA هي أسهل طريق لتجاوزها.

**3. حسابان للطوارئ (break-glass).** سحابيان بالكامل، مستثنيان من السياسات، محميّان بمفتاح FIDO2، ومراقبان بتنبيه عند أي استخدام.

**4. حماية كلمات المرور وSSPR.** فعّل Microsoft Entra Password Protection لمنع الكلمات الضعيفة الشائعة، واجعل استعادة كلمة المرور الذاتية تتطلب وسيلتين.

## ثانيًا: المسؤولون

**5. أقل عدد ممكن من Global Administrators.** توصي Microsoft بأقل من خمسة. استخدم أدوارًا أضيق (مثل Exchange Administrator أو User Administrator) لبقية المهام.

**6. حسابات إدارية منفصلة.** المسؤول يستخدم حسابًا عاديًا للبريد والتصفح، وحسابًا إداريًا منفصلًا بدون صندوق بريد للإدارة فقط.

**7. Privileged Identity Management.** (يتطلب Entra ID P2) لتفعيل الصلاحيات العليا عند الحاجة ولمدة محدودة بدل منحها بشكل دائم.

## ثالثًا: التطبيقات

**8. تقييد موافقة المستخدمين على التطبيقات.** هجمات "Consent phishing" تخدع المستخدم ليمنح تطبيقًا خبيثًا صلاحية قراءة بريده. اسمح بالموافقة فقط لتطبيقات من ناشرين موثقين بصلاحيات منخفضة، وفعّل **admin consent workflow** لبقية الطلبات.

## رابعًا: البريد

**9. منع إعادة التوجيه التلقائي إلى خارج المؤسسة.** المهاجم الذي يخترق صندوقًا يضع غالبًا قاعدة تحويل خفية. اضبط سياسة البريد الصادر (outbound spam policy) لمنع التحويل التلقائي الخارجي إلا لاستثناءات محددة.

**10. سياسات الحماية المسبقة (Preset security policies).** فعّل السياسة Standard أو Strict في Defender for Office 365 لتطبيق إعدادات Microsoft الموصى بها لمكافحة التصيد وSafe Links وSafe Attachments دفعة واحدة.

**11. DKIM وDMARC لكل نطاق.** فعّل توقيع DKIM لكل نطاق مخصص وانشر DMARC، كما في [دليل تشخيص وصول البريد إلى Spam](/article/company-email-spam-spf-dmarc-diagnosis).

## خامسًا: المشاركة والتعاون

**12. ضبط المشاركة الخارجية في SharePoint وOneDrive.** قلّل المستوى الافتراضي من "Anyone" إلى "New and existing guests" أو أضيق، وفعّل انتهاء صلاحية الروابط.

**13. مراجعة الوصول الخارجي في Teams.** حدد النطاقات المسموح بالتواصل معها إن كان عملك يسمح بذلك.

## سادسًا: التدقيق والمراقبة

**14. التأكد من تفعيل سجل التدقيق الموحد (Unified Audit Log).** مفعّل افتراضيًا في معظم المستأجرين الحديثة، لكن تحقق منه في Microsoft Purview؛ بدونه لا يمكنك التحقيق في أي حادث.

**15. مراجعة Microsoft Secure Score وسياسات التنبيه شهريًا.** Secure Score يعطيك قائمة توصيات مرتبة حسب الأثر، وسياسات التنبيه تنبهك إلى أحداث مثل إنشاء قواعد تحويل أو منح صلاحيات إدارية.

## الأسئلة الشائعة

**هل يكفي ترخيص Microsoft 365 Business Basic؟**
يمكنك تطبيق جزء كبير من القائمة (Security defaults، إعدادات المشاركة، منع التحويل، DKIM)، لكن Conditional Access وDefender for Office 365 يتطلبان تراخيص أعلى مثل Business Premium.

**من أين أبدأ إن كان الوقت ضيقًا؟**
البنود 1 و2 و5 و9: MFA، حظر المصادقة القديمة، تقليل المسؤولين، منع التحويل الخارجي.

**هل تغيّر هذه الإعدادات تجربة المستخدم؟**
بعضها نعم (MFA بشكل أساسي). أبلغ المستخدمين مسبقًا وطبّق على مجموعة تجريبية أولًا.

## المراجع

- [Best practices for Microsoft Entra roles — Microsoft Learn](https://learn.microsoft.com/entra/identity/role-based-access-control/best-practices)
- [Preset security policies in EOP and Defender for Office 365 — Microsoft Learn](https://learn.microsoft.com/defender-office-365/preset-security-policies)
- [Configure how users consent to applications — Microsoft Learn](https://learn.microsoft.com/entra/identity/enterprise-apps/configure-user-consent)
- [Microsoft Secure Score — Microsoft Learn](https://learn.microsoft.com/defender-xdr/microsoft-secure-score)
