export default {
  slug: 'kes-12-exclusions-kaspersky-security-center',
  categoryId: 'cybersecurity',
  subcategoryId: 'endpoint',
  tags: ['kaspersky', 'kes', 'kaspersky-security-center', 'exclusions', 'endpoint-security'],
  domainIds: ['cybersecurity'],
  topicIds: ['endpoint-security'],
  contentType: 'guide',
  vendorIds: ['kaspersky'],
  productIds: ['kaspersky-endpoint-security', 'kaspersky-security-center'],
  title: {
    ar: 'استثناءات KES 12 في Kaspersky Security Center: إعداد آمن واستيراد XML',
    en: 'KES 12 Exclusions in Kaspersky Security Center: Safe Setup and XML Import',
  },
  excerpt: {
    ar: 'الفرق بين استثناءات الفحص والتطبيقات الموثوقة في KES 12، وكيف تضيفها في السياسة، وتستوردها بصيغة XML، وتتجنب النقاط العمياء الخطيرة.',
    en: 'The difference between scan exclusions and trusted applications in KES 12, how to add them in policy, import them as XML, and avoid dangerous blind spots.',
  },
  body: {
    ar: `## متى تحتاج استثناءً أصلًا؟

الاستثناء يُضاف عندما تتسبب الحماية في مشكلة حقيقية: بطء شديد في تطبيق قاعدة بيانات أو نظام نسخ احتياطي، أو تعارض مع تطبيق متخصص (مثل برامج GIS أو المحاسبة)، أو إنذار كاذب مؤكد. لا تضف استثناءً "احتياطيًا" أو لأن منتدى نصح به. كل استثناء نقطة عمياء، والمهاجمون يبحثون عن المجلدات المستثناة لوضع أدواتهم فيها.

الإطار العام لإدارة الاستثناءات بأمان موجود في [دليل أمن الأجهزة الطرفية وإدارة الثغرات](/article/endpoint-vulnerability-management-guide).

## نوعان مختلفان: استثناءات الفحص والتطبيقات الموثوقة

| | استثناءات الفحص (Scan exclusions) | التطبيقات الموثوقة (Trusted applications) |
|---|---|---|
| ماذا تستثني | ملفات أو مجلدات أو أنواع كائنات من الفحص | نشاط تطبيق معيّن (ملفاته وشبكته وسجله) من المراقبة |
| أمثلة | ملفات قاعدة بيانات بامتداد محدد في مسار محدد | عملية برنامج النسخ الاحتياطي التي تقرأ آلاف الملفات |
| الخطر | أي ملف خبيث يوضع في المسار المستثنى لن يُفحص | إذا استُغل التطبيق الموثوق، قد لا يُراقب سلوكه الخبيث |

القاعدة: اختر النوع الأضيق الذي يحل المشكلة.

## إضافة الاستثناءات في سياسة Kaspersky Security Center

الاستثناءات تُدار مركزيًا في سياسة Kaspersky Endpoint Security for Windows، ضمن الإعدادات العامة في قسم الاستثناءات (Exclusions)، حيث تجد قائمتي استثناءات الفحص والتطبيقات الموثوقة. قد تختلف أسماء القوائم قليلًا بين وحدة MMC وWeb Console وبين الإصدارات الفرعية من KES 12، لذلك راجع دليل المساعدة لإصدارك.

### خيارات استثناء الفحص

- **الملف أو المجلد:** مسار كامل، مع دعم الأقنعة مثل * و? ومتغيرات البيئة.
- **اسم الكائن:** حسب تصنيف Kaspersky Encyclopedia، مثل أداة إدارة عن بُعد مشروعة تُكتشف كـ"not-a-virus".
- **تجزئة الملف (Hash):** لاستثناء ملف محدد بعينه، وهو أضيق خيار وأكثره أمانًا لملف لا يتغير.
- **مكونات الحماية:** يمكن تطبيق الاستثناء على مكونات محددة فقط (مثل حماية الملفات من التهديدات أو فحص الأجهزة) بدل كل المكونات.

### خيارات التطبيق الموثوق

لكل تطبيق موثوق يمكن تحديد ما يُستثنى، ومنها عدم فحص الملفات التي يفتحها، وعدم مراقبة نشاطه، وعدم مراقبة العمليات الفرعية، وعدم فحص ترافيكه الشبكي. فعّل فقط الخيار الذي تحتاجه.

### الوراثة والاستثناءات المحلية

- في السياسات المتداخلة، يسمح خيار دمج القيم عند الوراثة (Merge values when inheriting) بجمع قوائم السياسة الأم والسياسة الفرعية.
- عطّل السماح للمستخدم بإضافة استثناءات أو تطبيقات موثوقة محلية، حتى تبقى كل الاستثناءات مرئية ومراجعة مركزيًا. منذ KES 12.6، يخفي التطبيق كائنات المنطقة الموثوقة عن المستخدم إذا منع المسؤول الاستثناءات المحلية.
- منذ KES 12.6 تتوفر استثناءات وتطبيقات موثوقة **مُعرّفة مسبقًا** لخوادم SQL وMicrosoft Exchange وSystem Center Configuration Manager، وهي أفضل من كتابة قوائمك يدويًا لهذه الأنظمة.

## الاستيراد والتصدير بصيغة XML

عند وجود قائمة طويلة (مثل استثناءات يوصي بها مصنّع تطبيق)، فإن إدخالها يدويًا بطيء ومعرض للأخطاء. تتيح قائمة الاستثناءات في السياسة التصدير إلى ملف XML والاستيراد منه. أفضل طريقة عملية:

1. أضف استثناءً واحدًا يدويًا بالإعدادات الصحيحة.
2. صدّر القائمة إلى XML لترى الصيغة الدقيقة التي يتوقعها إصدارك.
3. انسخ بنية العنصر لكل مسار جديد، مع الحفاظ على نفس الحقول.
4. استورد الملف إلى سياسة اختبار أولًا وتحقق من أن كل الإدخالات ظهرت كما يجب.
5. طبّق على مجموعة تجريبية من الأجهزة قبل التعميم.

لماذا البدء بالتصدير؟ لأن صيغة ملف XML قد تختلف بين الإصدارات، والتصدير من نفس الإصدار يضمن التوافق بدل الاعتماد على ملف من مصدر آخر.

## قائمة تحقق قبل إضافة أي استثناء

- [ ] هل المشكلة مؤكدة ومرتبطة بالحماية فعلًا (اختبرت بتعطيل المكوّن على جهاز اختبار فقط)؟
- [ ] هل يوجد توصية رسمية من مصنّع التطبيق؟
- [ ] هل اخترت أضيق نطاق: تجزئة أو ملف أو امتداد في مسار، بدل مجلد كامل؟
- [ ] هل المسار غير قابل للكتابة من المستخدمين العاديين؟
- [ ] هل الاستثناء على المكوّن الذي يسبب المشكلة فقط؟
- [ ] هل وثّقت السبب والمالك وتاريخ المراجعة؟

## مسارات يجب ألا تُستثنى أبدًا

- جذر القرص الكامل مثل C:\\
- مجلدات Temp وDownloads وAppData الخاصة بالمستخدمين.
- مجلد Windows أو System32 بالكامل.
- مجلدات مشاركة الشبكة التي يكتب فيها الجميع.

لتنظيم الأجهزة وتطبيق سياسات مختلفة حسب الدور، راجع [استخدام الوسوم في Kaspersky Security Center](/article/kaspersky-security-center-tagging).

## الأسئلة الشائعة

### هل يمكن استثناء عملية بدل مسار؟

نعم، عبر قائمة التطبيقات الموثوقة، مع تحديد الخيارات التي تحتاجها فقط.

### لماذا لا يظهر الاستثناء على الأجهزة بعد إضافته؟

تأكد أن السياسة نشطة ومطبقة على مجموعة الإدارة الصحيحة، وأن الأجهزة تتزامن مع خادم الإدارة، وأن الإعداد مقفل (رمز القفل) إذا أردت فرضه.

### هل الاستثناءات تؤثر على فحص الأجهزة المجدول أيضًا؟

يعتمد ذلك على المكونات التي حددتها للاستثناء؛ يمكن تطبيقه على الحماية الفورية فقط أو على المهام أيضًا.

## المراجع

- [Kaspersky Endpoint Security 12 for Windows Help: Creating a local trusted zone](https://support.kaspersky.com/help/KESWIN/12.9/en-US/128356.htm)
- [Kaspersky Endpoint Security 12.6 for Windows: What's new](https://support.kaspersky.com/kes-for-windows/12.6/127969)
- [Kaspersky Endpoint Security for Windows Help: Editing the list of trusted applications](https://support.kaspersky.com/KESWin/11.5.0/en-US/123510.htm)
`,
    en: `## When do you need an exclusion at all?

Add an exclusion when protection causes a real problem: severe slowness in a database or backup system, a conflict with specialised software (such as GIS or accounting packages), or a confirmed false positive. Don't add exclusions "just in case" or because a forum suggested them. Every exclusion is a blind spot, and attackers look for excluded folders to drop their tools into.

The broader framework for managing exclusions safely is in the [endpoint security and vulnerability management guide](/article/endpoint-vulnerability-management-guide).

## Two different things: scan exclusions and trusted applications

| | Scan exclusions | Trusted applications |
|---|---|---|
| What they exclude | Files, folders or object types from scanning | One application's activity (files, network, registry) from monitoring |
| Example | Database files with a specific extension in a specific path | The backup software process that reads thousands of files |
| Risk | Any malicious file placed in the excluded path won't be scanned | If the trusted app is exploited, its malicious behaviour may go unmonitored |

The rule: choose the narrowest type that solves the problem.

## Adding exclusions in a Kaspersky Security Center policy

Exclusions are managed centrally in the Kaspersky Endpoint Security for Windows policy, under General settings in the Exclusions section, where you'll find the scan exclusions and trusted applications lists. Names can differ slightly between the MMC console and Web Console and across KES 12 minor versions, so check the help for your version.

### Scan exclusion options

- **File or folder:** a full path, with masks such as * and ? and environment variables supported.
- **Object name:** per the Kaspersky Encyclopedia classification, such as a legitimate remote-admin tool detected as "not-a-virus".
- **File hash:** to exclude one specific file — the narrowest and safest option for a file that doesn't change.
- **Protection components:** apply the exclusion to specific components only (such as File Threat Protection or scan tasks) instead of all components.

### Trusted application options

For each trusted application you choose what's excluded, including not scanning files it opens, not monitoring its activity, not monitoring child processes and not scanning its network traffic. Enable only the option you need.

### Inheritance and local exclusions

- In nested policies, the "Merge values when inheriting" option combines the parent and child policy lists.
- Disable users' ability to add local exclusions or trusted applications, so every exclusion stays visible and centrally reviewed. Since KES 12.6, the application hides trusted-zone objects from the user when the administrator has prohibited local exclusions.
- Since KES 12.6, **predefined** exclusions and trusted applications are available for SQL servers, Microsoft Exchange and System Center Configuration Manager — better than writing your own lists for those systems.

## Importing and exporting XML

With a long list (such as exclusions recommended by an application vendor), entering them by hand is slow and error-prone. The policy's exclusions list supports exporting to and importing from an XML file. The most reliable workflow:

1. Add one exclusion by hand with the correct settings.
2. Export the list to XML to see the exact format your version expects.
3. Copy that element's structure for each new path, keeping the same fields.
4. Import the file into a test policy first and confirm every entry appears as intended.
5. Apply it to a pilot group of devices before rolling out.

Why start with an export? Because the XML format can differ between versions, and exporting from the same version guarantees compatibility instead of relying on a file from elsewhere.

## Checklist before adding any exclusion

- [ ] Is the problem confirmed and really caused by protection (tested by disabling the component on a test machine only)?
- [ ] Is there an official recommendation from the application vendor?
- [ ] Did you choose the narrowest scope — a hash, file or extension in a path, rather than a whole folder?
- [ ] Is the path not writable by standard users?
- [ ] Does the exclusion apply only to the component causing the problem?
- [ ] Did you document the reason, owner and review date?

## Paths you should never exclude

- A whole drive root such as C:\\
- Users' Temp, Downloads and AppData folders.
- The entire Windows or System32 folder.
- Network shares everyone can write to.

To organise devices and apply different policies by role, see [using tags in Kaspersky Security Center](/article/kaspersky-security-center-tagging).

## FAQ

### Can I exclude a process instead of a path?

Yes, through the trusted applications list, enabling only the options you need.

### Why doesn't the exclusion show up on devices after I add it?

Check that the policy is active and applied to the right administration group, that devices are syncing with the Administration Server, and that the setting is locked (the padlock) if you want to enforce it.

### Do exclusions also affect scheduled scans?

It depends on the components you selected for the exclusion; it can apply to real-time protection only, or to scan tasks as well.

## References

- [Kaspersky Endpoint Security 12 for Windows Help: Creating a local trusted zone](https://support.kaspersky.com/help/KESWIN/12.9/en-US/128356.htm)
- [Kaspersky Endpoint Security 12.6 for Windows: What's new](https://support.kaspersky.com/kes-for-windows/12.6/127969)
- [Kaspersky Endpoint Security for Windows Help: Editing the list of trusted applications](https://support.kaspersky.com/KESWin/11.5.0/en-US/123510.htm)
`,
  },
};
