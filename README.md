# NetSec Atlas

الموقع الحي: [https://netsecatlas.com](https://netsecatlas.com) — معرفة عملية بالعربية والإنجليزية في الشبكات وأمن المعلومات وأنظمة ويندوز.

Live site: [https://netsecatlas.com](https://netsecatlas.com) — practical Arabic and English guides on networking, information security and Windows administration.

المستودع: [abdelaziz-maysara-hm/Tech-Insights](https://github.com/abdelaziz-maysara-hm/Tech-Insights)  
التطبيق: `artifacts/techpulse-ar` (React, Vite, TypeScript, pnpm). النشر التلقائي إلى GitHub Pages عبر `.github/workflows/deploy-pages.yml` مع كل دفع إلى `main`.

---

## الحالة الآن / Where things stand

**آخر تحديث لهذا الملف: 27 نوفمبر 2026 (توقيت القاهرة، UTC+2).**

- **المحتوى المنشور:** 135 مقالًا و69 مقارنة، لكل منها نسخة عربية ونسخة إنجليزية مكتوبة بشكل مستقل (ليست ترجمة حرفية). لم يراجع أي نص بشريًا بعد (`humanReviewed=0`، و`translationStatus` ليس `reviewed`).
- **الموقع الحي قبل إصلاح 22 نوفمبر:** المقالات والمقارنات والفيديوهات وصفحة التطبيقات `/tools` تعمل. صفحات **البدائل** `/alternatives` كانت موجودة في `main` منذ 21 نوفمبر لكن **لم تُنشر** لأن عملية البناء فشلت بعد حذف أدوات الويب (تفاصيل الإصلاح أدناه).
- **أدوات المتصفح داخل هذا الموقع أُزيلت** في 21 نوفمبر (المالك لديه موقع أدوات منفصل: [adawaty.tools](https://adawaty.tools)). الروابط القديمة مثل `/tools/spf-record-analyzer` تُحوَّل الآن إلى صفحة التطبيقات `/tools` حتى لا تظهر 404.
- **برنامج ويندوز واحد: NetSec Atlas Tools 2.0** (22 نوفمبر). دُمج تطبيق WinForms (v1.3، عشر أدوات) مع برامج WPF الأحد عشر في برنامج واحد فيه **18 أداة** بالعربي والإنجليزي، تحت `desktop/`. كل إصدار يمر باختبارات وحدات واختبار تشغيل واختبار واجهة آلي لكل أداة على ويندوز x64 وARM64 قبل النشر. الإصدار: [desktop-v2.0](https://github.com/abdelaziz-maysara-hm/Tech-Insights/releases/tag/desktop-v2.0). التحميل المباشر من الموقع: `https://netsecatlas.com/downloads/NetSecAtlasTools.exe` (و`NetSecAtlasTools-arm64.exe` و`SHA256SUMS.txt`).
- **برنامج ويندوز: NetSec Atlas Tools 2.1** (27 نوفمبر). تسع أدوات جديدة (المجموع **27**). الإصدار: [desktop-v2.1](https://github.com/abdelaziz-maysara-hm/Tech-Insights/releases/tag/desktop-v2.1). التحميل المباشر: `https://netsecatlas.com/downloads/NetSecAtlasTools.exe` (و`NetSecAtlasTools-arm64.exe` و`SHA256SUMS.txt`). الاختبارات قبل النشر: 79 وحدات و42 واجهة وتشغيل، على x64 وARM64. الخطة المكتملة: [docs/ROADMAP.md#phase-2-1](docs/ROADMAP.md#phase-2-1).
- **صفحة** `/tools` تبدأ الآن بالبرنامج (قائمة الأدوات وأزرار تحميل مباشر)، ثم تطبيقات Atlas (لقطة، حافظة، PDF، تسجيل) من [atlas-recorders](https://github.com/abdelaziz-maysara-hm/atlas-recorders).
- مستودع [netsecatlas-apps](https://github.com/abdelaziz-maysara-hm/netsecatlas-apps) أصبح **مستبدلًا** (مذكور في ملف README الخاص به) ولم يُحذف. بطلب المالك (23 نوفمبر) يُترك كما هو، **دون أرشفة**.
- **قاعدة SEO:** مع كل نشر يُحدَّث تلقائيًا `sitemap.xml` و`video-sitemap.xml` وRSS من المحتوى والمسارات الفعلية. لا تُحرَّر خريطة الموقع يدويًا. `<lastmod>` يأتي من تاريخ تحديث العنصر أو آخر commit لمسه في git، وليس من وقت البناء. صفحات noindex مثل `/search` وصفحات التحويل فقط لا تُدرج. اختبار البناء يفشل إذا سقطت صفحة قابلة للفهرسة من الخريطة أو إذا ذكرت الخريطة رابطًا غير 200. بعد كل نشر يُرسل IndexNow لمحركات البحث الشريكة.
- مولّد المقالات الآلي (generator) **محذوف**. إضافة المحتوى تتم يدويًا كما هو موضّح أدناه.
- **مكتبة الفيديو (هذه المرحلة، قبل التحقق الحي):** 82 فيديو في 10 قوائم تشغيل (كانت 60 في 7). أُضيفت قوائم Wi-Fi وTLS/الشهادات وتقسيم الشبكات، مع بحث وتصفية و«شاهد التالي». كل معرّف يوتيوب موثّق عبر oEmbed. البناء يُخرج 164 مدخلًا في `video-sitemap.xml`. التفاصيل: [docs/ROADMAP.md#phase-perf-videos](docs/ROADMAP.md#phase-perf-videos).

الخطة القادمة كلها في ملف منفصل: **[docs/ROADMAP.md](docs/ROADMAP.md)**. المرحلة الجارية (27 نوفمبر مساءً): [أداء الموبايل وتوسيع صفحة الفيديو](docs/ROADMAP.md#phase-perf-videos) — أداء الموبايل (خطوط محلية، تأجيل AdSense، استبدال prerender ألطف) وتوسيع الفيديو إلى 82/10 قيد الدمج؛ بقي الرصد الحي وLighthouse بعد النشر. صناديق المتابعة في الملف. مرحلة 2.1 مكتملة: [docs/ROADMAP.md#phase-2-1](docs/ROADMAP.md#phase-2-1).

---

## سجل العمل / Changelog of work so far

التواريخ أدناه بتوقيت القاهرة (UTC+2). روابط الطلبات: [قائمة الـ Pull Requests](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pulls?q=is%3Apr).

Dates below are Africa/Cairo (UTC+2).

### المراحل الأساسية على الموقع (19 نوفمبر 2026)

| PR | ماذا أُنجز |
| --- | --- |
| [#2](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/2) | تحسينات SEO: صفحات ثابتة قابلة للزحف، عناوين إنجليزية، إصلاح RSS، روابط داخلية، صفحتا «حول» و«اتصل بنا» حقيقيتان. |
| [#3](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/3) | المرحلة 7: قوائم تشغيل فيديو حسب الموضوع، دفعة المحتوى الأولى، تحويلات، وتحسينات على الصفحة. |
| [#4](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/4) | المرحلة 8: 13 مقالًا جديدًا، إعادة كتابة إنجليزية مستقلة، **إزالة مولّد المقالات**، وتحسين الأداء. |
| [#5](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/5) | المرحلة 9 دفعة 1: علامة `englishEdition: independent` (بدون ادعاء مراجعة بشرية)، 16 إعادة كتابة إنجليزية، تحويل 3 شروحات استهلاكية، وترقية إجراءات GitHub Pages. |
| [#6](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/6) | إصلاح النشر: تتبع مجلد `comparisons-en`. |
| [#7](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/7) – [#11](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/11) | دفعات الإنجليزية 2–6: عشرات المقالات بنسخة إنجليزية مستقلة (دفعة 5 تشمل OWASP Top 10:2025). |
| [#12](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/12) | دفعة 7: أربع إعادة كتابات إنجليزية + تحديث مقال OWASP العربي إلى 2025. |
| [#13](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/13) | دفعة 8: النسخة الإنجليزية للأدلة الخمسة الأساسية؛ استبدال رابط CISA الميت بمصدر NSA. |
| [#14](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/14) | دفعة 9: إنجليزية مستقلة لكل المقارنات المتبقية (68). |
| [#15](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/15) | إصلاح أربع قيم مواصفات عربية كانت أرقامًا مجردة، مع اختبار يمنع تكرار ذلك. |
| [#16](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/16) | دفعة 10 (19 نوفمبر، 11:59): **12 مقالًا جديدًا** بالعربية والإنجليزية المستقلة: تقسيم الشبكات CIDR، المنافذ الشائعة، مصدر قفل حساب AD (4740)، حماية RDP، تقوية SSH، تحليل رؤوس البريد، أخطاء شهادات TLS، FortiGate debug flow، تشخيص DNS، حلقات STP، تعارض عناوين IP، وأوامر PowerShell للشبكات. المجموع: 135 مقالًا. |

تفاصيل نصية أقدم في [CHANGELOG.md](CHANGELOG.md) و[docs/AGENT_HANDOFF.md](docs/AGENT_HANDOFF.md).

### عمل المالك في 21 نوفمبر 2026 (بعد الدفعة 10)

هذه الالتزامات **ليست من دفعة المقالات السابقة**؛ دفعها المالك (أو جلسة ساعدته) في الغالب مباشرة إلى `main`، مع ثلاثة طلبات دمج في البداية. لم نلغِ أيًا من هذا العمل.

| متى (القاهرة) | ماذا حدث |
| --- | --- |
| 10:03 | [#17](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/17): تطبيق ويندوز C# (.NET 8 WinForms) داخل `desktop/NetSecAtlasTools` — حاسبة شبكة فرعية ومرجع منافذ. |
| 10:03 | [#18](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/18): أداتا ويب (حاسبة الشبكة الفرعية ومرجع المنافذ) داخل الموقع. *أُزيلتا لاحقًا في نفس اليوم.* |
| 10:04 | [#19](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/19): إضافة حاسبة VLSM لتطبيق سطح المكتب. |
| 10:09–10:31 | سير عمل بناء وإصدار ملف EXE، بطاقة تحميل على صفحة الأدوات، ثم إضافة: تحويل النطاق إلى CIDR، البصمة (Hash)، والترميز (Base64/hex). إصدارات [desktop-v1.0](https://github.com/abdelaziz-maysara-hm/Tech-Insights/releases/tag/desktop-v1.0) و[v1.1](https://github.com/abdelaziz-maysara-hm/Tech-Insights/releases/tag/desktop-v1.1). |
| 11:05–11:10 | مولّد كلمات مرور وتحويل IP، ثم إصلاح أخطاء تجميع، ثم [desktop-v1.2](https://github.com/abdelaziz-maysara-hm/Tech-Insights/releases/tag/desktop-v1.2). |
| 13:50–13:53 | بحث مورّد MAC وتحويل الطوابع الزمنية، إعادة كتابة النافذة لعشر أدوات، ثم [desktop-v1.3](https://github.com/abdelaziz-maysara-hm/Tech-Insights/releases/tag/desktop-v1.3) (الملف: `NetSecAtlasTools.exe`). |
| 14:08 | حذف أدوات الويب من الموقع (المسار، القسم، والملفات) لأن الأدوات أصبحت على أداتي / تطبيق سطح المكتب. **آخر نشر ناجح للموقع توقف عند هذه المرحلة تقريبًا.** |
| 14:11–14:12 | إضافة قسم **البدائل**: ملف `alternatives.json` (صفحتان: بدائل FortiGate وبدائل Palo Alto)، صفحات القائمة والتفاصيل، المسارات، رابط في القائمة، وبطاقة في الصفحة الرئيسية. **فشل النشر** لأن `Search.tsx` (واختبارات أخرى) ما زالت تستورد ملفات الأدوات المحذوفة. |

في 22 نوفمبر أُصلح كسر البناء (بدون التراجع عن عمل المالك) حتى يمكن نشر صفحات البدائل، وأُضيف هذا الملف وخارطة الطريق.

### مستودع البرامج WPF / netsecatlas-apps

في 19 نوفمبر 2026 (12:40–12:41 القاهرة) أُنشئ المستودع العام [netsecatlas-apps](https://github.com/abdelaziz-maysara-hm/netsecatlas-apps) (ترخيص MIT، .NET 10 LTS، WPF، واجهة عربي/إنجليزي مع RTL). فيه 11 برنامجًا وطبقة منطق مشتركة واختبارات. سير عمل GitHub Actions نجح في البناء والاختبار ونشر ملفات exe لـ x64 وARM64، لكن **خطوة إنشاء الإصدار تُتخطى ما لم يُدفع وسم `v*`**، لذلك لا توجد ملفات للتحميل من صفحة Releases بعد. صفحة البرامج على الموقع غير مكتملة (انظر الخطة).

هذا المستودع **منفصل** عن تطبيق WinForms ذي العشر أدوات في `desktop/` أعلاه. (في 22 نوفمبر دُمج الاثنان، انظر القسم التالي.)

### 22 نوفمبر 2026: برنامج واحد (NetSec Atlas Tools 2.0) وفحص روابط 404

| PR | ماذا أُنجز |
| --- | --- |
| [#22](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/22) | دمج تطبيق WinForms (v1.3) وبرامج WPF الأحد عشر في برنامج WPF واحد (.NET 10 LTS) تحت `desktop/`: 18 أداة في 4 أقسام، عربي/إنجليزي، ملف واحد x64 وARM64. حُذف المكرر (البصمة، مولّد كلمات المرور، قائمة المنافذ صارت داخل الأدوات الأكبر). أُصلحت أخطاء في حاسبات 1.x (‏`/0`، ومدى ينتهي بـ 255.255.255.255 كان لا ينتهي). اختبارات: 67 اختبار وحدات، اختبار تشغيل، و32 اختبار واجهة (FlaUI) تفتح كل أداة وتشغّلها، على `windows-latest` و`windows-11-arm`. سير العمل الجديد `desktop-ci.yml` لا ينشئ إصدارًا إلا بعد نجاح كل الاختبارات، وحلّ محل `build-desktop.yml`. |
| [#23](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/23) | صفحة `/tools` للبرنامج الموحّد مع تحميل مباشر من نفس النطاق (`/downloads/`)، وSoftwareApplication JSON-LD، ونص ثابت قابل للزحف. سير النشر ينسخ ملفات آخر إصدار إلى `/downloads/` ويعيد النشر بعد كل إصدار `desktop-v*`. إصلاح روابط 404 (التفاصيل في CHANGELOG). |

### 23 نوفمبر 2026: خريطة الموقع تُحدَّث مع كل نشر

| PR | ماذا أُنجز |
| --- | --- |
| [#24](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/24) | `sitemap.xml` و`video-sitemap.xml` وRSS تُولَّد في كل بناء من المحتوى والمسارات الحقيقية (المقالات، الفيديو، البدائل، `/tools`، وأي مسار جديد في التطبيق). `<lastmod>` دقيق لكل عنصر. استبعاد `/search` (كانت العربية مدرجة بالخطأ وكانت الصفحة قابلة للفهرسة). اختبار يغطي كل صفحة prerender قابلة للفهرسة، ورفض روابط التحويل أو غير 200. IndexNow بعد النشر. قاعدة موثّقة: كل نشر يحدّث الخريطة تلقائيًا. مستودع netsecatlas-apps يُترك كما هو (بدون أرشفة). |
| [#25](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/25) | قائمة المرحلة الحالية في `docs/ROADMAP.md#phase-2-1` (أدوات 2.1 المرشحة والمختارة، الاختبارات، الإصدار، تحسين الموقع) مع رابط من README. |

### 27 نوفمبر 2026: أدوات 2.1 وتحسين Lighthouse (لم يُنشر الإصدار بعد)

| PR | ماذا أُنجز |
| --- | --- |
| [#26](https://github.com/abdelaziz-maysara-hm/Tech-Insights/pull/26) | NetSec Atlas Tools 2.1: تسع أدوات جديدة (سمعة الملفات بروابط عامة فقط، بدء التشغيل، QR للواي فاي، RDAP، IP العام، تتبع المسار، فك الشهادات، فك JWT، مختبر regex). نجاح CI على win-x64 وwin-arm64 (79 اختبار وحدات، 42 واجهة، واختبار تشغيل). الوسم [desktop-v2.1](https://github.com/abdelaziz-maysara-hm/Tech-Insights/releases/tag/desktop-v2.1) والتحميل من `/downloads/` مع تطابق SHA-256. صفحة `/tools` وJSON-LD بالإصدار 2.1.0. تحسينات Lighthouse: الوصول 100 وSEO 100 على القوالب الخمسة بعد النشر. |

---

## هيكل الموقع والمستودع / How the site is structured

| المسار | الغرض |
| --- | --- |
| `artifacts/techpulse-ar/` | تطبيق الموقع |
| `artifacts/techpulse-ar/src/pages/` | الصفحات (المقالات، المقارنات، الفيديو، التطبيقات `/tools`، البدائل `/alternatives`، البحث، …) |
| `artifacts/techpulse-ar/src/content/` | البيانات المنشورة: `articles.json`، `comparisons.json`، الفيديو، الصفحات الثابتة |
| `artifacts/techpulse-ar/scripts/phase7/` و`scripts/phase8/` | **مصدر** المحتوى الجديد وإعادة الكتابة (يُمرَّر عبر سكربتات التطبيق ثم يُكتب إلى JSON) |
| `artifacts/techpulse-ar/src/config/` | سياسة hreflang، تحويلات المحتوى، إعدادات SEO |
| `desktop/` | برنامج NetSec Atlas Tools (WPF، 27 أداة في 2.1) والاختبارات. التفاصيل في [desktop/README.md](desktop/README.md) |
| `artifacts/techpulse-ar/src/content/desktop-program.json` | بيانات البرنامج المعروضة في `/tools` (الأدوات، روابط التحميل، الإصدار) |
| `.github/workflows/deploy-pages.yml` | بناء الموقع ونشره، ونسخ ملفات آخر إصدار للبرنامج إلى `/downloads/`، ثم إشعار IndexNow |
| `artifacts/techpulse-ar/scripts/generate-sitemap.mjs` و`sitemap-core.mjs` | توليد `sitemap.xml` و`video-sitemap.xml` من المحتوى والمسارات في كل بناء |
| `.github/workflows/desktop-ci.yml` | اختبارات البرنامج على ويندوز x64 وARM64، ثم الإصدار عند وسم `desktop-v*` |

المسارات العامة للموقع (كل منها له `/ar/` و`/en/`):

- `/` الصفحة الرئيسية، `/articles`، `/article/:slug`
- `/comparisons`، `/comparison/:slug`
- `/videos`، `/videos/:playlist`، `/video/:slug`
- `/tools` برنامج NetSec Atlas Tools (تحميل مباشر) وتطبيقات Atlas + رابط إلى أداتي. `/programs` و`/downloads` يحوّلان إلى `/tools`
- `/alternatives`، `/alternatives/:slug`
- `/guides`، `/troubleshooting`، `/vendors`، `/domain/:domain`، `/search`، `/categories`
- `/page/about` و`/page/contact`

العربية والإنجليزية ليستا نسختين متطابقتين جملة بجملة؛ المقالات تُكتب بشكل مستقل على نفس الموضوع، مع أقسام FAQ ومراجع رسمية، وتُعلَّم `englishEdition: 'independent'`.

---

## كيف تضيف مقالًا الآن / How to add content (generator removed)

مولّد المقالات لم يعد موجودًا. المصدر المعتمد هو ملفات المرحلة 8 ثم تشغيل سكربت التطبيق.

1. اكتب النصين بشكل مستقل (ليس ترجمة حرفية) في:
   - `artifacts/techpulse-ar/scripts/phase8/md/<slug>.ar.md`
   - `artifacts/techpulse-ar/scripts/phase8/md/<slug>.en.md`
2. يجب أن يتضمن كل نص عناوين `## الأسئلة الشائعة` / `## FAQ` و`## المراجع` / `## References`. الحد الأدنى للكلمات (بعد `split` على المسافات): العربية 500، الإنجليزية 540. العنوان ≤ 90 حرفًا. لا تضع `translationStatus: reviewed` إلا بعد مراجعة إنسان مُسمّى.
3. أنشئ وحدة المحتوى `artifacts/techpulse-ar/scripts/phase8/content/<slug>.mjs` بهذا الشكل:

```js
import { body } from '../md.mjs';
export default {
  slug: 'example-slug',
  heroFrom: 'an-existing-slug', // يعيد استخدام صورة مقال موجود
  categoryId: 'cybersecurity', subcategoryId: 'guides-tips',
  tags: ['example'],
  domainIds: ['cybersecurity'], topicIds: ['network-security'],
  contentType: 'how-to', vendorIds: [], productIds: [],
  title: { ar: '…', en: '…' },
  excerpt: { ar: '…', en: '…' },
  body: body('example-slug'),
};
```

4. حدّث العدّ في الاختبارات: `scripts/phase8-content.test.mjs` (`NEW.length`) و`scripts/translation-audit-phase4c.test.mjs` (عدد المقالات المقيَّمة).
5. طبّق المحتوى وابنِ واختبر:

```bash
cd artifacts/techpulse-ar
node scripts/phase7/apply-content.mjs && node scripts/phase8/apply-content.mjs
node scripts/translation-audit-phase4c.mjs
# ثم اختبارات المشروع (مثل /workspace/runtests.sh أو pnpm test بعد البناء)
```

6. اربط المقال من مقالات أقدم ذات صلة عندما يناسب. تحقّق من كل رابط خارجي. لا تخترع أرقام بحث أو اعتمادات للمؤلف. تاريخ المقال يكون يوم الإضافة الفعلي (لا ترجع التاريخ للخلف).
7. فرع → طلب دمج → بعد نجاح البناء ادفع إلى `main` (النشر يتم تلقائيًا) ثم تحقق من الصفحتين `/ar/article/<slug>` و`/en/article/<slug>` على الموقع الحي. **لا تعدّل `sitemap.xml` يدويًا** — خريطة الموقع وRSS يُعاد بناؤهما تلقائيًا مع كل نشر من المحتوى الجديد.

التصنيفات والمواضيع والموردون المسموح بهم موثّقون في الاختبارات ووحدات المرحلة 8 الحالية؛ انسخ وحدة موجودة عند الشك.

لتعديل مقال قديم: أفضل مسار هو ملف في `scripts/phase8/english/<slug>.md` أو `scripts/phase8/arabic/<slug>.md` ثم إعادة تشغيل `apply-content`، لا تعديل `articles.json` يدويًا إلا لإصلاح عاجل صغير.

المقارنات: إعادة الكتابة الإنجليزية في `scripts/phase8/comparisons-en/<slug>.json`. لا تضع قيمة مواصفات رقمًا مجردًا في أي لغة.

---

## التطوير المحلي والنشر / Local development and deploy

```bash
corepack enable
pnpm install
pnpm --filter @workspace/techpulse-ar run dev
```

البناء (`pnpm --filter @workspace/techpulse-ar run build`) ينفّذ: خريطة الموقع، RSS، ملفات أجسام المقالات، Vite، ثم `seo-prerender` (HTML ثابت لكل رابط في الخريطة + تحويلات للروابط القديمة غير المسبوقة بلغة). **كل نشر يحدّث الخريطة تلقائيًا.** تاريخ `<lastmod>` من تاريخ العنصر أو git، وصفحات مثل `/search` لا تُدرج. بعد نجاح النشر يُرسل إشعار IndexNow.

للتحقق محليًا: `pnpm --filter @workspace/techpulse-ar run test:sitemap` بعد توليد الخريطة، و`test:build-output` بعد البناء الكامل.

**تحليلات والتحقق من محركات البحث (اختياري، عندما يريد المالك):** متغيرات المستودع `GA_MEASUREMENT_ID` و`GOOGLE_SITE_VERIFICATION` و`BING_SITE_VERIFICATION`. ملف تحقق Search Console `googlec09262aa424a656e.html` موجود أصلًا في `public/`. لا تُحقَن أي شيفرة عندما تكون المتغيرات فارغة.

ملاحظات أقدم عن لوحة CMS وVercel/Netlify قد تكون من مرحلة سابقة؛ الإنتاج الحالي هو GitHub Pages على `netsecatlas.com`.

---

## الخطة / Plan

الملف **[docs/ROADMAP.md](docs/ROADMAP.md)** فيه: ما تبقّى من عمل البرامج، رزنامة المحتوى، المراجعة البشرية، حساب Microsoft Store وتوقيع الشيفرة، Search Console/GA، وأفكار لاحقة. **المرحلة الحالية** (صناديق للمتابعة): [أداء الموبايل وتوسيع صفحة الفيديو](docs/ROADMAP.md#phase-perf-videos). مرحلة 2.1 مكتملة: [docs/ROADMAP.md#phase-2-1](docs/ROADMAP.md#phase-2-1).
