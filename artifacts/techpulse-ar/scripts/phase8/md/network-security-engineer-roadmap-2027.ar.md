## قبل الخطة: ما الذي يفعله مهندس أمن الشبكات فعلًا؟

في معظم الشركات، مهندس أمن الشبكات هو من يصمم ويشغّل ويستكشف أعطال: الجدران النارية، الـVPN، تقسيم الشبكة، التحكم بالوصول، وأحيانًا WAF وموازنات الأحمال. هو ليس محلل SOC تمامًا وليس مهندس شبكات تقليديًا، بل في المنتصف. لذلك يحتاج أساس شبكات متينًا أولًا، ثم أمنًا فوقه.

هذه الخطة مرتبة على مراحل. المدة تختلف من شخص لآخر؛ المهم ألا تنتقل لمرحلة قبل أن تستطيع **تطبيق** ما في السابقة في مختبر.

## المرحلة 1: أساس الشبكات (لا تتجاوزها)

- نموذج TCP/IP، وكيف تعمل ARP وDNS وDHCP فعليًا.
- العنونة والتقسيم الفرعي (subnetting) حتى تصبح تلقائية.
- التوجيه الثابت وأساسيات OSPF وBGP.
- الـVLAN والـTrunk والـSTP.
- قراءة الحزم في Wireshark: راجع [دليل تحليل الشبكات بـWireshark](/article/wireshark-network-analysis-complete-guide).

**مختبر:** شبكة افتراضية في GNS3 أو EVE-NG أو Cisco Packet Tracer فيها موجّهان ومحوّلان وثلاث VLAN.

## المرحلة 2: أنظمة التشغيل والخدمات

- أساسيات Linux من سطر الأوامر.
- Windows Server وActive Directory وDNS الداخلي.
- PowerShell أو Bash لأتمتة المهام الصغيرة.

## المرحلة 3: جدار ناري واحد بعمق

اختر موردًا واحدًا (FortiGate أو Palo Alto أو غيرهما) وتعلّمه بعمق بدل المرور السطحي على الجميع: السياسات، NAT، ملفات الحماية، التوجيه، الترقية، النسخ الاحتياطي، والتشخيص من سطر الأوامر. ابدأ بـ[إعداد FortiGate من الصفر](/article/fortigate-initial-setup-enterprise-guide) أو [أنواع NAT في Palo Alto](/article/palo-alto-nat-types-examples). بعدها يصبح تعلّم المورد الثاني سريعًا لأن المفاهيم واحدة.

**مختبر:** معظم الموردين يوفرون إصدارات افتراضية للتقييم أو التدريب؛ راجع شروط كل مورد.

## المرحلة 4: VPN والهوية والوصول

- IPsec بالتفصيل، بما في ذلك الربط بين موردين مختلفين: [نفق IPsec بين FortiGate وPalo Alto](/article/ipsec-site-to-site-fortigate-palo-alto).
- ZTNA وفكرة Zero Trust.
- 802.1X وNAC وRADIUS.
- MFA وConditional Access وأساسيات الهوية السحابية.

## المرحلة 5: السجلات والكشف

مهندس الأمن الذي لا يقرأ السجلات يعمل نصف عمله. تعلّم Syslog، وأساسيات SIEM، وكيف تستخدم سجلات الجدار الناري في التحقيق. ابنِ [مختبر SOC مجانيًا](/article/wazuh-sysmon-free-soc-lab) لترى الصورة من جهة المحلل.

## المرحلة 6: السحابة والأتمتة

- شبكات السحابة: VPC/VNet، مجموعات الأمان، الربط الهجين.
- Python لأتمتة المهام والتعامل مع APIs الأجهزة.
- مفهوم Infrastructure as Code (مثل Ansible أو Terraform).

## أين تأتي الشهادات؟

الشهادات تفتح باب المقابلة، لكن المختبر هو ما يجعلك تنجح فيها. خيارات شائعة حسب المرحلة:

| المرحلة | أمثلة |
|---|---|
| الأساس | CompTIA Network+، Cisco CCNA |
| الأمن العام | CompTIA Security+ |
| المورد | برنامج شهادات Fortinet NSE (Network Security Expert)، أو مسار شهادات Palo Alto Networks |

راجع دائمًا صفحات الموردين الرسمية، لأن أسماء الشهادات ومتطلباتها تتغير.

## كيف تبني ملفًا يقنع جهة التوظيف

- مستودع GitHub فيه ملاحظات المختبرات وملفات الإعداد (بعد إزالة الأسرار).
- مقالات قصيرة تشرح مشكلة حللتها.
- فهم واضح لأخطاء الإعداد الشائعة: [أخطاء إعداد الجدران النارية وطريقة مراجعتها](/article/firewall-misconfigurations-audit).

## الأسئلة الشائعة

**هل أبدأ بالأمن مباشرة دون شبكات؟**
ستصطدم بحاجز سريعًا. أغلب أعطال الجدران النارية هي في الحقيقة مشاكل توجيه أو NAT أو DNS.

**هل البرمجة ضرورية؟**
ليست شرطًا للبداية، لكنها تصبح ميزة كبيرة في المستوى المتوسط، خصوصًا Python.

**ما الإطار الذي يصف المهارات المطلوبة رسميًا؟**
إطار NICE من NIST (SP 800-181) يصف أدوار الأمن السيبراني ومهاراتها، ومفيد لتخطيط التعلم.

## المراجع

- [NICE Framework Resource Center — NIST](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center)
- [Fortinet Training Institute — NSE Certification Program](https://www.fortinet.com/training/certification)
- [Cisco CCNA — Cisco Learning Network](https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html)
- [CompTIA Security+ — CompTIA](https://www.comptia.org/certifications/security)
