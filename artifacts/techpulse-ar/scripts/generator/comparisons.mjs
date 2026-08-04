/**
 * Comparison generator — UNIQUE, topic-appropriate specs per pair, real
 * content only. Follows the same safety rule as articles.mjs: never
 * generate more items than there is real content for, and never invent
 * generic specs (a firewall comparison has no "camera" score).
 */
import { assertSubcategory } from './categories.mjs';
import { distributedDate } from './dates.mjs';
import { resolveComparisonImages } from './images.mjs';
import { bi } from './localization.mjs';
import { uniqueSlug } from './slugs.mjs';

function spec(labelAr, labelEn, v1Ar, v1En, v2Ar, v2En, s1, s2) {
  return {
    label: bi(labelAr, labelEn),
    device1Value: bi(v1Ar, v1En),
    device2Value: bi(v2Ar, v2En),
    device1Score: s1,
    device2Score: s2,
    winner: s1 === s2 ? 0 : s1 > s2 ? 1 : 2,
  };
}

/**
 * Each entry is real, reasoned content: spec categories match what actually
 * matters for that product type (a firewall comparison is judged on threat
 * intelligence and management, not "camera"). Scores reflect a genuine
 * qualitative judgment translated to a 1-10 scale for the comparison-bar UI,
 * not a formula. Extend this array only with real researched pairs.
 */
export const COMPARISON_CONTENT = [
  {
    d1: 'iPhone 16', d2: 'Galaxy S25', sub: 'phones', img1: 'phone', img2: 'phone2',
    specs: [
      spec('نظام التشغيل', 'OS ecosystem', 'iOS، دعم تحديثات أطول', 'iOS, longer update support', 'Android + One UI، تخصيص أوسع', 'Android + One UI, more customization', 8, 8),
      spec('الكاميرا', 'Camera', 'ألوان متسقة، فيديو قوي', 'Consistent colors, strong video', 'مرونة تكبير أعلى (تيليفوتو)', 'Higher zoom flexibility (telephoto)', 8, 8),
      spec('نظام التطبيقات', 'App ecosystem', 'تطبيقات iOS أولاً غالبًا', 'Apps often launch on iOS first', 'مرونة أكبر في تثبيت مصادر خارجية', 'More flexibility installing outside sources', 8, 7),
      spec('التكامل مع الأجهزة الأخرى', 'Cross-device integration', 'قوي جدًا مع Mac وAirPods', 'Very strong with Mac and AirPods', 'قوي مع أجهزة Samsung وWindows', 'Strong with Samsung and Windows devices', 9, 7),
    ],
    verdictAr: 'iPhone 16 أفضل لمن هو داخل منظومة Apple فعليًا (Mac، AirPods). Galaxy S25 أفضل لمن يريد تخصيصًا أوسع ومرونة أكبر في الكاميرا والتطبيقات.',
    verdictEn: 'iPhone 16 makes more sense if you are already inside the Apple ecosystem (Mac, AirPods). Galaxy S25 suits people who want deeper customization and camera/app flexibility.',
  },
  {
    d1: 'Pixel 9', d2: 'Nothing Phone 3', sub: 'phones', img1: 'phone2', img2: 'phone3',
    specs: [
      spec('الكاميرا الحاسوبية', 'Computational photography', 'من الأفضل في فئته', 'Best-in-class for its tier', 'جيدة لكن أقل نضجًا', 'Good but less mature', 9, 6),
      spec('نظافة النظام وسرعة التحديثات', 'Software cleanliness & updates', 'Android نظيف، تحديثات مباشرة من جوجل', 'Clean Android, direct Google updates', 'واجهة مميزة بصريًا لكن تحديثات أبطأ', 'Visually distinctive UI but slower updates', 9, 6),
      spec('التصميم', 'Design', 'كلاسيكي', 'Conventional', 'مميز بصريًا (إضاءة Glyph)', 'Visually distinctive (Glyph lighting)', 7, 8),
      spec('السعر', 'Price', 'متوسط إلى مرتفع', 'Mid-to-high', 'أقل عادة', 'Usually lower', 7, 8),
    ],
    verdictAr: 'Pixel 9 الخيار الأضمن لكاميرا وتحديثات أطول. Nothing Phone 3 خيار جيد لمن يريد تصميمًا مختلفًا وسعرًا أقل ومستعد يتنازل شوية عن نضج الكاميرا.',
    verdictEn: 'Pixel 9 is the safer pick for camera quality and long-term updates. Nothing Phone 3 suits people who want a distinctive design and lower price, trading off some camera maturity.',
  },
  {
    d1: 'MacBook Air M3', d2: 'Dell XPS 13', sub: 'laptops-pcs', img1: 'laptop', img2: 'laptop2',
    specs: [
      spec('عمر البطارية', 'Battery life', 'يتجاوز عادة 15 ساعة استخدام فعلي', 'Typically exceeds 15 hours real use', 'جيد لكن أقل غالبًا (10-12 ساعة)', 'Good but usually lower (10-12 hours)', 9, 7),
      spec('الأداء لكل واط', 'Performance per watt', 'ممتاز بفضل معالج M3', 'Excellent thanks to the M3 chip', 'جيد، يعتمد على معالج Intel/AMD المختار', 'Good, depends on the chosen Intel/AMD chip', 9, 7),
      spec('التوافق مع البرامج', 'Software compatibility', 'ممتاز لتطبيقات Apple، بعض القيود على برامج Windows فقط', 'Great for Apple apps, limits on Windows-only software', 'توافق كامل مع بيئة Windows المؤسسية', 'Full compatibility with enterprise Windows environments', 6, 9),
      spec('المنافذ', 'Ports', 'محدودة (USB-C فقط غالبًا)', 'Limited (mostly USB-C only)', 'عادة أوسع (USB-A، قارئ بطاقات أحيانًا)', 'Usually wider (USB-A, sometimes card reader)', 6, 8),
    ],
    verdictAr: 'MacBook Air M3 أفضل لعمر البطارية والكفاءة إذا كنت مرتاح لنظام macOS. Dell XPS 13 أنسب لبيئة عمل تعتمد على Windows وبرامج مؤسسية محددة.',
    verdictEn: 'MacBook Air M3 wins on battery life and efficiency if macOS suits your workflow. Dell XPS 13 fits better in a Windows-dependent enterprise environment with specific line-of-business software.',
  },
  {
    d1: 'ThinkPad X1', d2: 'HP EliteBook', sub: 'laptops-pcs', img1: 'laptop2', img2: 'laptop',
    specs: [
      spec('لوحة المفاتيح', 'Keyboard', 'من أفضل لوحات المفاتيح في فئة الأعمال تاريخيًا', 'Historically one of the best business keyboards', 'جيدة جدًا لكن أقل شهرة بهذا التحديد', 'Very good but less renowned specifically for this', 9, 7),
      spec('المتانة العسكرية', 'MIL-STD durability', 'يجتاز اختبارات MIL-SPEC بشكل معتاد', 'Regularly passes MIL-SPEC testing', 'يجتاز اختبارات مشابهة في أغلب الطرز', 'Passes similar testing on most models', 8, 8),
      spec('إدارة الأسطول المؤسسي', 'Enterprise fleet management', 'دعم قوي عبر Lenovo ThinkShield', 'Strong support via Lenovo ThinkShield', 'دعم قوي عبر HP Wolf Security', 'Strong support via HP Wolf Security', 8, 8),
      spec('التوفر والدعم المحلي', 'Local availability & support', 'واسع الانتشار في المؤسسات', 'Widely deployed in enterprises', 'واسع الانتشار أيضًا، خاصة القطاع الحكومي', 'Also widely deployed, especially government sector', 8, 8),
    ],
    verdictAr: 'الاتنين مناسبين لبيئة الشركات بنفس المستوى تقريبًا. القرار الفعلي غالبًا بيعتمد على العقد الحالي مع المورّد ودعم ما بعد البيع في بلدك، مش فرق تقني جوهري.',
    verdictEn: 'Both are genuinely close for enterprise use. The real deciding factor is usually your existing vendor contract and local after-sales support, not a fundamental technical gap.',
  },
  {
    d1: 'Palo Alto NGFW', d2: 'Fortinet FortiGate', sub: 'network-security', img1: 'firewall', img2: 'network',
    specs: [
      spec('عمق فحص التطبيقات (App-ID)', 'Application inspection depth', 'App-ID من الأنضج في السوق', 'App-ID is among the most mature in the market', 'قوي، مع تكامل جيد مع باقي منتجات Fortinet', 'Strong, with good integration across the Fortinet suite', 9, 7),
      spec('سهولة الإدارة للفرق الصغيرة', 'Manageability for small teams', 'منحنى تعلم أعلى نسبيًا', 'Relatively steeper learning curve', 'واجهة FortiManager أسهل غالبًا للفرق الصغيرة', 'FortiManager UI is often easier for small teams', 6, 8),
      spec('التكلفة الإجمالية', 'Total cost of ownership', 'مرتفعة عادة (تراخيص + دعم)', 'Usually higher (licensing + support)', 'أقل غالبًا لنفس مستوى الحماية', 'Usually lower for a comparable protection level', 5, 8),
      spec('الأداء تحت فحص SSL الكامل', 'Performance under full SSL inspection', 'قوي على الأجهزة المخصصة لهذا الحمل', 'Strong on appliances sized for this load', 'قوي أيضًا بفضل معالجات SPU المخصصة', 'Also strong thanks to dedicated SPU processors', 8, 8),
    ],
    verdictAr: 'Palo Alto أقوى في عمق تحليل التطبيقات والتهديدات المتقدمة، مناسب لمؤسسات كبيرة بميزانية أعلى. FortiGate بيقدّم قيمة أعلى مقابل السعر وإدارة أسهل، مناسب أكتر للشركات المتوسطة.',
    verdictEn: 'Palo Alto edges ahead on application-layer depth and advanced threat analysis, fitting larger enterprises with bigger budgets. FortiGate offers stronger value for the price and easier management, fitting mid-size organizations better.',
  },
  {
    d1: 'Palo Alto NGFW', d2: 'Forcepoint NGFW', sub: 'network-security', img1: 'firewall', img2: 'security',
    specs: [
      spec('حجم السوق ومجتمع الدعم', 'Market share & support community', 'أوسع بكثير، موارد ومهندسون متاحون أكتر', 'Much wider, more available engineers and resources', 'أضيق، سوق أكثر تخصصًا', 'Narrower, more niche market', 9, 6),
      spec('إدارة السياسات المركزية', 'Centralized policy management', 'Panorama قوي لكن يحتاج تراخيص إضافية', 'Panorama is strong but needs extra licensing', 'SMC (Security Management Center) شامل ومضمّن غالبًا', 'SMC (Security Management Center) is comprehensive and often bundled', 7, 8),
      spec('التركيز على منع فقدان البيانات', 'DLP focus', 'متاح كإضافة', 'Available as an add-on', 'تاريخيًا من نقاط قوة Forcepoint الأساسية', 'Historically one of Forcepoint\'s core strengths', 7, 9),
      spec('التكلفة', 'Cost', 'مرتفعة', 'Higher', 'تنافسية أكثر عادة', 'Usually more competitive', 5, 7),
    ],
    verdictAr: 'Palo Alto أفضل لو أولويتك أكبر مجتمع دعم وموارد تدريب متاحة. Forcepoint خيار قوي لو DLP ومنع تسريب البيانات أولوية حقيقية عندك، خصوصًا في القطاع الحكومي والمالي.',
    verdictEn: 'Palo Alto is the safer choice if you prioritize the largest support community and training resources. Forcepoint is a strong pick if DLP and data-leak prevention are a real priority, especially in government and financial sectors.',
  },
  {
    d1: 'Fortinet FortiGate', d2: 'Forcepoint NGFW', sub: 'network-security', img1: 'network', img2: 'firewall',
    specs: [
      spec('القيمة مقابل السعر', 'Value for money', 'من الأقوى في السوق', 'Among the strongest in the market', 'تنافسي لكن أقل انتشارًا', 'Competitive but less widespread', 8, 6),
      spec('التوسع الأفقي (SD-WAN مدمج)', 'Integrated SD-WAN', 'من نقاط القوة الأساسية لـ Fortinet', 'One of Fortinet\'s core strengths', 'متاح لكن أقل نضجًا كميزة مدمجة', 'Available but less mature as a built-in feature', 9, 6),
      spec('التركيز الأمني الأساسي', 'Core security focus', 'حماية شبكة شاملة (UTM)', 'Broad network protection (UTM)', 'تركيز أوضح على منع فقدان البيانات', 'Clearer focus on data-loss prevention', 8, 8),
    ],
    verdictAr: 'FortiGate خيار أشمل لو محتاج SD-WAN وحماية شبكة متكاملة بسعر تنافسي. Forcepoint أنسب لو DLP هو الأولوية الأولى عندك.',
    verdictEn: 'FortiGate is the more all-around pick if you need integrated SD-WAN and broad network protection at a competitive price. Forcepoint fits better if DLP is genuinely your top priority.',
  },
  {
    d1: 'Cisco FTD', d2: 'Palo Alto NGFW', sub: 'network-security', img1: 'network', img2: 'firewall',
    specs: [
      spec('التكامل مع بنية Cisco القائمة', 'Integration with existing Cisco infrastructure', 'سلس جدًا لو عندك شبكة Cisco أصلًا', 'Very smooth if you already run Cisco networking', 'يحتاج تكامل إضافي مع بيئة غير Cisco', 'Needs extra integration work in a non-Cisco environment', 9, 6),
      spec('واجهة الإدارة', 'Management interface', 'FMC أثقل ويحتاج تعلّم', 'FMC is heavier and has a learning curve', 'Panorama أوضح لمعظم المستخدمين', 'Panorama is generally clearer for most users', 6, 8),
      spec('سمعة تحليل التهديدات', 'Threat-analysis reputation', 'قوية عبر Talos', 'Strong via Talos', 'من الأقوى في تصنيفات الصناعة المستقلة', 'Among the strongest in independent industry rankings', 7, 9),
    ],
    verdictAr: 'Cisco FTD منطقي جدًا لو شبكتك مبنية على Cisco أصلًا. Palo Alto أقوى لو بتبدأ من الصفر أو التحليل المتقدم للتهديدات هو الأولوية.',
    verdictEn: 'Cisco FTD makes strong sense if your network is already Cisco-based. Palo Alto is stronger if you\'re starting fresh or advanced threat analysis is the priority.',
  },
  {
    d1: 'Palo Alto NGFW', d2: 'Check Point', sub: 'network-security', img1: 'firewall', img2: 'shield',
    specs: [
      spec('سمعة منع الاختراق تاريخيًا', 'Historical intrusion-prevention reputation', 'قوية وحديثة النمو', 'Strong, more recently established', 'من أقدم وأعرق الأسماء في السوق', 'One of the oldest and most established names in the market', 8, 8),
      spec('سهولة الترخيص', 'Licensing simplicity', 'واضح نسبيًا', 'Relatively clear', 'معقّد أحيانًا بسبب تعدد الطبقات (Blades)', 'Sometimes complex due to multiple licensed "blades"', 8, 6),
      spec('الابتكار في السحابة', 'Cloud-native innovation', 'استثمار قوي وواضح (Prisma)', 'Strong, clear investment (Prisma)', 'موجود لكن أقل بروزًا في الحديث السوقي', 'Present but less prominent in market messaging', 8, 6),
    ],
    verdictAr: 'Palo Alto أوضح في استراتيجية السحابة وأبسط في الترخيص. Check Point يفضّله كتير من الفرق اللي بتعتمد عليه من سنين طويلة وعندها خبرة متراكمة فيه.',
    verdictEn: 'Palo Alto has a clearer cloud strategy and simpler licensing. Check Point is favored by many teams with years of accumulated in-house expertise with it.',
  },
  {
    d1: 'Fortinet FortiGate', d2: 'Sophos Firewall', sub: 'network-security', img1: 'network', img2: 'security',
    specs: [
      spec('الأداء على الأجهزة المخصصة', 'Appliance-level performance', 'قوي بفضل معالجات SPU', 'Strong thanks to dedicated SPU chips', 'جيد، أقل تخصصًا في المعالجات', 'Good, less specialized processor design', 8, 7),
      spec('سهولة الاستخدام للفرق الصغيرة جدًا', 'Ease of use for very small teams', 'جيدة', 'Good', 'من أبسط الواجهات في السوق للمبتدئين', 'One of the simplest interfaces in the market for beginners', 7, 9),
      spec('السعر لصغار ومتوسطي الشركات', 'Price for small/mid businesses', 'تنافسي', 'Competitive', 'غالبًا الأقل سعرًا في هذه الفئة', 'Often the lowest price in this tier', 7, 9),
    ],
    verdictAr: 'FortiGate أفضل لو محتاج ميزات SD-WAN وأداء أعلى. Sophos أنسب لشركة صغيرة بميزانية محدودة وفريق تقني صغير محتاج سهولة إعداد.',
    verdictEn: 'FortiGate is the better pick if you need SD-WAN features and higher throughput. Sophos suits a small business on a tight budget with a small IT team that needs easy setup.',
  },
  {
    d1: 'WireGuard', d2: 'OpenVPN', sub: 'network-security', img1: 'vpn', img2: 'network',
    specs: [
      spec('السرعة', 'Speed', 'أسرع بشكل ملحوظ بفضل تصميم أبسط', 'Noticeably faster due to a simpler design', 'أبطأ نسبيًا خاصة على أجهزة ضعيفة', 'Relatively slower, especially on low-power devices', 9, 6),
      spec('بساطة الإعداد', 'Setup simplicity', 'ملفات إعداد بسيطة جدًا', 'Very simple config files', 'أكثر تعقيدًا (شهادات، ملفات متعددة)', 'More complex (certificates, multiple files)', 9, 6),
      spec('النضج وسجل التدقيق الأمني', 'Maturity & security audit history', 'أحدث نسبيًا لكن كوده أبسط وأسهل تدقيقًا', 'Newer, but simpler code that\'s easier to audit', 'أقدم بكثير، تاريخ طويل من التدقيق والاستخدام المؤسسي', 'Much older, long history of audits and enterprise use', 7, 9),
      spec('المرونة في التصفية على مستوى المنفذ', 'Port-level filtering flexibility', 'محدودة نسبيًا', 'Relatively limited', 'مرن جدًا (TCP/UDP، منافذ مخصصة)', 'Very flexible (TCP/UDP, custom ports)', 6, 8),
    ],
    verdictAr: 'WireGuard أفضل لمعظم الاستخدامات الحديثة بسبب السرعة والبساطة. OpenVPN لسه منطقي في بيئات مؤسسية قديمة محتاجة مرونة إعداد أعلى أو سجل تدقيق أطول.',
    verdictEn: 'WireGuard is the better default for most modern use cases thanks to speed and simplicity. OpenVPN still makes sense in older enterprise environments needing more configuration flexibility or a longer audit track record.',
  },
  {
    d1: 'Windows NPS', d2: 'FreeRADIUS', sub: 'network-security', img1: 'identity', img2: 'server',
    specs: [
      spec('التكلفة', 'Cost', 'مضمّن مع تراخيص Windows Server الموجودة', 'Included with existing Windows Server licensing', 'مفتوح المصدر ومجاني بالكامل', 'Fully open-source and free', 7, 9),
      spec('سهولة التكامل مع Active Directory', 'Active Directory integration ease', 'مباشر جدًا لأنه من نفس المنظومة', 'Very direct since it\'s the same ecosystem', 'ممكن لكن يحتاج إعداد يدوي إضافي', 'Possible but needs extra manual configuration', 9, 6),
      spec('المرونة والتخصيص', 'Flexibility & customization', 'محدودة بواجهة Windows', 'Limited by the Windows interface', 'مرونة عالية جدًا (سكريبتات، وحدات إضافية)', 'Very high flexibility (scripts, extra modules)', 5, 9),
      spec('منحنى التعلم', 'Learning curve', 'أسهل لفرق Windows الموجودة أصلًا', 'Easier for teams already on Windows', 'أعلى، يحتاج خبرة Linux وملفات إعداد نصية', 'Steeper, needs Linux experience and text config files', 8, 5),
    ],
    verdictAr: 'Windows NPS الخيار الأسرع والأبسط لو بيئتك أصلًا Windows/AD بالكامل. FreeRADIUS أقوى وأرخص لو الفريق مرتاح مع Linux ومحتاج مرونة أعلى.',
    verdictEn: 'Windows NPS is the fastest, simplest choice if your environment is already fully Windows/AD. FreeRADIUS is more powerful and cheaper if the team is comfortable with Linux and needs more flexibility.',
  },
  {
    d1: 'Okta', d2: 'Microsoft Entra ID', sub: 'identity', img1: 'identity', img2: 'cloud',
    specs: [
      spec('استقلالية المنصة', 'Platform independence', 'مصمم من الأساس ليكون محايدًا (Microsoft/Google/غيره)', 'Built from the ground up to be vendor-neutral', 'أقوى طبيعيًا داخل منظومة Microsoft 365', 'Naturally strongest inside the Microsoft 365 ecosystem', 8, 7),
      spec('عدد التطبيقات الجاهزة للتكامل', 'Pre-built app integrations', 'كتالوج ضخم ومتخصص في هذا تحديدًا', 'A huge catalog, specifically built around this', 'كتالوج واسع أيضًا وينمو بسرعة', 'Also a wide, fast-growing catalog', 9, 8),
      spec('التسعير', 'Pricing', 'منتج مستقل بتسعير خاص', 'Standalone product with its own pricing', 'غالبًا مُضمّن أو مخفّض ضمن باقات Microsoft 365', 'Often bundled or discounted within Microsoft 365 plans', 6, 8),
    ],
    verdictAr: 'Okta أفضل لو بيئتك متنوعة (multi-cloud) ومش معتمدة على Microsoft بشكل أساسي. Entra ID منطقي جدًا وأرخص لو أصلًا مشترك في Microsoft 365.',
    verdictEn: 'Okta is the better fit for a diverse, multi-cloud environment not centered on Microsoft. Entra ID makes strong sense — and is cheaper — if you\'re already on Microsoft 365.',
  },
  {
    d1: 'CrowdStrike Falcon', d2: 'Microsoft Defender', sub: 'endpoint', img1: 'endpoint', img2: 'security',
    specs: [
      spec('استقلالية الأداء عن نظام التشغيل', 'Performance independent of the OS', 'خفيف نسبيًا ومصمم عبر منصات متعددة', 'Relatively light, designed across multiple platforms', 'مدمج بعمق في Windows، أداء ممتاز هناك تحديدًا', 'Deeply built into Windows, excellent performance there specifically', 8, 8),
      spec('عمق الصيد الاستباقي للتهديدات', 'Proactive threat-hunting depth', 'من الأقوى في تصنيفات الصناعة المستقلة', 'Among the strongest in independent industry rankings', 'تحسّن كبير في السنوات الأخيرة، لسه خلف قليلًا', 'Improved significantly in recent years, still slightly behind', 9, 7),
      spec('التكلفة', 'Cost', 'مرتفعة نسبيًا كمنتج مستقل', 'Relatively higher as a standalone product', 'غالبًا مُضمّن ضمن تراخيص Microsoft 365 E5', 'Often bundled within Microsoft 365 E5 licensing', 5, 9),
    ],
    verdictAr: 'CrowdStrike الخيار الأقوى لو حماية نقاط النهاية أولوية قصوى مستقلة. Defender منطقي جدًا لو عندك تراخيص E5 أصلًا، القيمة صعب تتفوق عليها.',
    verdictEn: 'CrowdStrike is the stronger pick if endpoint protection is a standalone top priority. Defender makes strong sense if you already hold E5 licensing — the value is hard to beat.',
  },
  {
    d1: 'CrowdStrike Falcon', d2: 'SentinelOne', sub: 'endpoint', img1: 'endpoint', img2: 'cyber',
    specs: [
      spec('الاعتماد على الاستجابة الآلية', 'Reliance on automated response', 'قوي، مع اعتماد كبير على تحليل سحابي', 'Strong, with heavy reliance on cloud analysis', 'يركّز أكتر على الاستجابة الآلية على الجهاز نفسه (Autonomous)', 'Focuses more on on-device autonomous response', 8, 8),
      spec('سمعة السوق وحجم الانتشار', 'Market reputation & deployment scale', 'الأوسع انتشارًا حاليًا في السوق المؤسسي', 'Currently the widest deployment in the enterprise market', 'ينمو بسرعة لكن أصغر حجمًا', 'Growing fast but still smaller in scale', 9, 7),
    ],
    verdictAr: 'CrowdStrike الخيار الأضمن لو عايز أوسع انتشار وموارد دعم متاحة. SentinelOne بديل قوي وجدير بالتجربة خصوصًا لو الاستجابة الآلية بدون اتصال سحابي مستمر مهمة عندك.',
    verdictEn: 'CrowdStrike is the safer choice for the widest deployment base and available support resources. SentinelOne is a strong, worth-trying alternative, especially if on-device automated response without constant cloud reliance matters to you.',
  },
  {
    d1: 'Microsoft Defender', d2: 'SentinelOne', sub: 'endpoint', img1: 'security', img2: 'endpoint',
    specs: [
      spec('التكلفة داخل بيئة Microsoft', 'Cost within a Microsoft environment', 'مُضمّن غالبًا ضمن E5', 'Often bundled within E5', 'تكلفة إضافية منفصلة', 'A separate additional cost', 9, 5),
      spec('الاستقلالية عن المنصة', 'Platform independence', 'أقوى داخل Windows تحديدًا', 'Strongest specifically within Windows', 'أداء متسق أكثر عبر منصات متعددة', 'More consistent performance across multiple platforms', 6, 8),
    ],
    verdictAr: 'Defender الخيار الأوفر لو أصلًا داخل منظومة Microsoft 365. SentinelOne أنسب لبيئة متعددة المنصات مش معتمدة على Windows بشكل أساسي.',
    verdictEn: 'Defender is the more economical choice if you\'re already inside Microsoft 365. SentinelOne fits better in a multi-platform environment not primarily Windows-based.',
  },
  {
    d1: 'ChatGPT', d2: 'Claude', sub: 'software-services', img1: 'ai', img2: 'ai',
    specs: [
      spec('الأدوات والإضافات', 'Tools & plugins ecosystem', 'كتالوج إضافات أوسع وأقدم', 'A wider, more established plugin catalog', 'يركّز أكتر على المحادثة والتحليل المباشر', 'Focuses more on direct conversation and analysis', 8, 7),
      spec('طول السياق للملفات الكبيرة', 'Context length for large files', 'جيد وبيتحسن باستمرار', 'Good and constantly improving', 'من الأقوى تاريخيًا في التعامل مع مستندات طويلة', 'Historically among the strongest for long documents', 7, 9),
    ],
    verdictAr: 'الاتنين قويين وبيتغيروا بسرعة. لو شغلك بيعتمد على تحليل مستندات طويلة أو كتابة كود دقيقة، كلود عادة بيتفوق قليلًا. لو محتاج إضافات وتكامل أوسع مع أدوات تانية، ChatGPT أشمل حاليًا.',
    verdictEn: 'Both are strong and evolving fast. If your work leans on long-document analysis or precise coding, Claude tends to edge ahead slightly. If you need broader plugin/tool integration, ChatGPT is currently more comprehensive.',
  },
  {
    d1: 'AWS', d2: 'Azure', sub: 'software-services', img1: 'cloud', img2: 'cloud',
    specs: [
      spec('عمق ونضج الخدمات', 'Service depth & maturity', 'الأقدم والأوسع خدمات في السوق', 'The oldest and widest range of services in the market', 'ينمو بسرعة وقوي جدًا في بيئات Microsoft', 'Growing fast and very strong in Microsoft-centric environments', 9, 8),
      spec('التكامل مع بيئة Microsoft المؤسسية', 'Integration with Microsoft enterprise stack', 'يحتاج إعداد إضافي', 'Needs extra setup', 'سلس جدًا (AD، Office 365، إلخ)', 'Very smooth (AD, Office 365, etc.)', 6, 9),
    ],
    verdictAr: 'AWS أوسع وأنضج كخدمات سحابية عامة. Azure منطقي جدًا لو مؤسستك معتمدة أصلًا على Microsoft (AD، Office 365) وعايز تكامل أسهل.',
    verdictEn: 'AWS is broader and more mature as a general cloud platform. Azure makes strong sense if your organization already runs on Microsoft (AD, Office 365) and you want easier integration.',
  },
  {
    d1: '1Password', d2: 'Bitwarden', sub: 'software-services', img1: 'security', img2: 'security',
    specs: [
      spec('السعر', 'Price', 'مدفوع بالكامل', 'Fully paid', 'خطة مجانية قوية + مفتوح المصدر', 'Strong free tier + open source', 6, 9),
      spec('تجربة الاستخدام والتصميم', 'UX & polish', 'من الأنعم استخدامًا في السوق', 'Among the smoothest to use in the market', 'جيد جدًا وتحسّن كثيرًا', 'Very good and has improved a lot', 9, 7),
      spec('ملاءمة الفرق المؤسسية', 'Enterprise team fit', 'أدوات إدارة فريق ناضجة', 'Mature team-management tooling', 'أدوات فريق قوية أيضًا وأرخص للفرق الكبيرة', 'Also strong team tooling, and cheaper for large teams', 8, 8),
    ],
    verdictAr: '1Password أنعم في التجربة اليومية. Bitwarden خيار ممتاز لو الميزانية أولوية أو بتفضّل مفتوح المصدر — الفرق العملي بينهم أصغر بكتير من فرق السعر.',
    verdictEn: '1Password feels smoother day-to-day. Bitwarden is an excellent choice if budget matters or you prefer open source — the practical gap between them is much smaller than the price gap.',
  },
  {
    d1: 'PS5', d2: 'Xbox Series X', sub: 'gaming-consoles', img1: 'console', img2: 'console',
    specs: [
      spec('الحصريات', 'Exclusive titles', 'مكتبة حصريات أقوى تاريخيًا', 'Historically stronger exclusives lineup', 'أقل حصريات لكن Game Pass يعوّض جزئيًا', 'Fewer exclusives, but Game Pass partly offsets that', 8, 7),
      spec('قيمة الاشتراك', 'Subscription value', 'PS Plus جيد', 'PS Plus is good', 'Game Pass غالبًا أفضل قيمة مقابل السعر', 'Game Pass is usually better value for money', 7, 9),
    ],
    verdictAr: 'PS5 أفضل لو الحصريات أولويتك. Xbox Series X أقوى في القيمة الإجمالية بفضل Game Pass لو بتلعب مجموعة واسعة من الألعاب.',
    verdictEn: 'PS5 wins if exclusives are your priority. Xbox Series X offers stronger overall value thanks to Game Pass if you play a wide range of games.',
  },
  {
    d1: 'Apple Watch 10', d2: 'Galaxy Watch 7', sub: 'wearables', img1: 'watch', img2: 'watch',
    specs: [
      spec('التوافق مع الهاتف', 'Phone compatibility', 'يعمل مع iPhone فقط', 'Works with iPhone only', 'يعمل بشكل كامل مع Android (أفضل مع Samsung)', 'Works fully with Android (best with Samsung)', 8, 8),
      spec('عمر البطارية', 'Battery life', 'يوم واحد تقريبًا', 'Roughly one day', 'أطول قليلًا في أغلب الطرز', 'Slightly longer on most models', 6, 7),
    ],
    verdictAr: 'الاختيار هنا محدد بنوع هاتفك أكتر من أي حاجة تانية — Apple Watch مع iPhone، Galaxy Watch مع Android.',
    verdictEn: 'The choice here is mostly dictated by your phone more than anything else — Apple Watch pairs with iPhone, Galaxy Watch with Android.',
  },
  {
    d1: 'Kaspersky Endpoint Security', d2: 'Bitdefender GravityZone', sub: 'endpoint', img1: 'endpoint', img2: 'security',
    specs: [
      spec('سهولة الإدارة المركزية', 'Central management ease', 'واجهة KSC ناضجة وواسعة الانتشار', 'The KSC console is mature and widely deployed', 'واجهة GravityZone حديثة وسهلة التعلم', 'GravityZone\'s console is modern and easy to learn', 8, 8),
      spec('التأثير على أداء الجهاز', 'Impact on device performance', 'خفيف نسبيًا', 'Relatively light', 'من الأخف في السوق حسب اختبارات مستقلة', 'Among the lightest in independent tests', 7, 9),
      spec('التوفر والدعم في المنطقة العربية', 'Regional availability & support', 'انتشار قوي في المنطقة', 'Strong presence in the region', 'متوفر لكن شراكات محلية أقل', 'Available but fewer local partnerships', 8, 6),
    ],
    verdictAr: 'الاتنين خيار قوي لحماية نقاط النهاية للشركات الصغيرة والمتوسطة. Kaspersky أقوى في الدعم المحلي بالمنطقة العربية، Bitdefender أخف على أداء الجهاز حسب اختبارات مستقلة متكررة.',
    verdictEn: 'Both are strong picks for SMB endpoint protection. Kaspersky has stronger regional support in the Arabic-speaking market; Bitdefender is lighter on device performance in repeated independent tests.',
  },
  {
    d1: 'Windows RDS', d2: 'Citrix Virtual Apps', sub: 'software-services', img1: 'server', img2: 'cloud',
    specs: [
      spec('تكلفة الترخيص الأولية', 'Initial licensing cost', 'أقل بكثير (تراخيص RDS فقط)', 'Much lower (RDS licensing only)', 'أعلى بكثير (طبقة تراخيص إضافية)', 'Much higher (an extra licensing layer)', 9, 5),
      spec('تحسين الأداء عبر شبكات ضعيفة', 'Performance over weak networks', 'جيد', 'Good', 'من الأفضل في السوق تاريخيًا (بروتوكول HDX)', 'Historically among the best in the market (HDX protocol)', 6, 9),
      spec('سهولة الإعداد لبيئة صغيرة', 'Setup simplicity for a small environment', 'مباشر لأنه من نفس منظومة Windows Server', 'Direct since it\'s part of the Windows Server ecosystem', 'أعقد، محتاج خبرة متخصصة', 'More complex, needs specialized expertise', 8, 5),
    ],
    verdictAr: 'RDS الخيار الأوفر والأبسط لشركة صغيرة أو متوسطة محتاجة سطح مكتب بعيد أساسي. Citrix يستاهل التكلفة الإضافية لو عندك فروع كتير بشبكات ضعيفة ومحتاج أداء ثابت.',
    verdictEn: 'RDS is the more affordable, simpler choice for a small-to-mid business needing basic remote desktop. Citrix justifies its extra cost if you have many branches on weak networks and need consistently strong performance.',
  },
  {
    d1: 'Group Policy', d2: 'Microsoft Intune', sub: 'identity', img1: 'identity', img2: 'cloud',
    specs: [
      spec('إدارة الأجهزة خارج الشبكة المحلية', 'Managing devices outside the local network', 'محدودة جدًا بدون VPN', 'Very limited without a VPN', 'مصمم أصلًا لإدارة الأجهزة من أي مكان', 'Built specifically to manage devices from anywhere', 3, 9),
      spec('التكلفة لبيئة صغيرة موجودة أصلًا على AD', 'Cost for a small environment already on AD', 'مجاني فعليًا (مضمّن)', 'Effectively free (already included)', 'يحتاج ترخيص إضافي (Intune / E3-E5)', 'Needs additional licensing (Intune / E3-E5)', 9, 5),
      spec('دعم الأجهزة غير Windows (macOS, iOS)', 'Support for non-Windows devices (macOS, iOS)', 'غير مدعوم أصلًا', 'Not natively supported', 'دعم كامل عبر منصات متعددة', 'Full cross-platform support', 2, 9),
    ],
    verdictAr: 'Group Policy منطقي جدًا لبيئة Windows تقليدية بالكامل داخل الشبكة. Intune ضروري فعليًا لو عندك أجهزة بعيدة أو خليط من الأنظمة (macOS، iOS، Android).',
    verdictEn: 'Group Policy makes strong sense for a fully traditional on-premises Windows environment. Intune is genuinely necessary if you have remote devices or a mix of platforms (macOS, iOS, Android).',
  },
  {
    d1: 'Veeam Backup & Replication', d2: 'Acronis Cyber Protect', sub: 'software-services', img1: 'storage', img2: 'security',
    specs: [
      spec('التركيز الأساسي', 'Core focus', 'نسخ احتياطي واستعادة على مستوى مؤسسي عميق', 'Deep enterprise-grade backup and recovery', 'يدمج النسخ الاحتياطي مع حماية من الفيروسات في منتج واحد', 'Combines backup with anti-malware protection in one product', 8, 7),
      spec('دعم بيئات الافتراضية الكبيرة (VMware/Hyper-V)', 'Support for large virtualized environments', 'من الأقوى والأنضج في السوق لهذا تحديدًا', 'Among the strongest and most mature in the market for this specifically', 6, 8),
      spec('الملاءمة للشركات الصغيرة بفريق تقني محدود', 'Fit for small businesses with a limited IT team', 'يحتاج خبرة أعمق للاستفادة الكاملة', 'Needs deeper expertise to use fully', 6, 8),
    ],
    verdictAr: 'Veeam أقوى لمؤسسة كبيرة عندها بيئة افتراضية معقدة ومحتاجة نسخ احتياطي على مستوى مؤسسي. Acronis أنسب لشركة صغيرة عايزة نسخ احتياطي وحماية من الفيروسات في أداة واحدة مبسطة.',
    verdictEn: 'Veeam is stronger for a larger organization with a complex virtualized environment needing enterprise-grade backup. Acronis fits a small business wanting backup and anti-malware in one simplified tool.',
  },
  {
    d1: 'Splunk', d2: 'Wazuh', sub: 'network-security', img1: 'analytics', img2: 'security',
    specs: [
      spec('التكلفة', 'Cost', 'مرتفعة جدًا، ترخيص حسب حجم البيانات', 'Very high, licensed by data volume', 'مفتوح المصدر ومجاني بالكامل', 'Fully open-source and free', 3, 9),
      spec('نضج تحليل البيانات الضخمة', 'Big-data analysis maturity', 'من الأنضج والأقوى في السوق', 'Among the most mature and powerful in the market', 'جيد جدًا لكن أصغر مجتمعًا وموارد', 'Very good but a smaller community and resource base', 9, 6),
      spec('سهولة البداية لفريق صغير', 'Ease of getting started for a small team', 'منحنى تعلم وتكلفة أعلى', 'Steeper learning curve and cost', 'أسهل بداية مجانية، يحتاج خبرة Linux', 'Easier free start, needs Linux expertise', 5, 8),
    ],
    verdictAr: 'Splunk الخيار الأقوى لمؤسسة كبيرة عندها ميزانية وبيانات ضخمة محتاجة تحليل عميق. Wazuh بديل قوي ومجاني تمامًا لفريق صغير عايز يبدأ في SIEM من غير تكلفة ترخيص.',
    verdictEn: 'Splunk is the stronger choice for a large organization with budget and massive data needing deep analysis. Wazuh is a strong, fully free alternative for a small team wanting to start with SIEM without licensing cost.',
  },
  {
    d1: 'Forcepoint Email Security', d2: 'Proofpoint Email Protection', sub: 'network-security', img1: 'security', img2: 'shield',
    specs: [
      spec('التركيز على منع فقدان البيانات (DLP)', 'DLP focus', 'من نقاط القوة التاريخية الأساسية', 'One of the historical core strengths', 'قوي أيضًا لكن أقل تخصصًا في DLP تحديدًا', 'Also strong but less specifically DLP-focused', 9, 7),
      spec('حجم السوق ومجتمع الدعم', 'Market size & support community', 'أضيق نسبيًا', 'Relatively narrower', 'أوسع انتشارًا في سوق أمان البريد تحديدًا', 'Wider deployment specifically in the email-security market', 6, 8),
      spec('التكامل مع بيئات حكومية ومالية', 'Integration with government/financial environments', 'قوي وتاريخي في هذا القطاع تحديدًا', 'Strong and historically established in this sector specifically', 9, 7),
    ],
    verdictAr: 'Forcepoint خيار قوي جدًا للقطاعات الحساسة (حكومي، مالي) لو منع تسريب البيانات أولوية قصوى. Proofpoint أوسع انتشارًا كحل أمان بريد عام لمعظم الشركات.',
    verdictEn: 'Forcepoint is a very strong choice for sensitive sectors (government, financial) where DLP is the top priority. Proofpoint has wider deployment as a general email-security solution for most businesses.',
  },
  {
    d1: 'VMware vSphere', d2: 'Proxmox VE', sub: 'software-services', img1: 'server', img2: 'cpu',
    specs: [
      spec('التكلفة', 'Cost', 'ترخيص مدفوع، اتغيّر مؤخرًا بشكل ملحوظ بعد استحواذ Broadcom', 'Paid licensing, notably changed recently after the Broadcom acquisition', 'مفتوح المصدر ومجاني بالكامل', 'Fully open-source and free', 4, 9),
      spec('النضج والاستقرار المؤسسي', 'Enterprise maturity & stability', 'الأنضج تاريخيًا في السوق المؤسسي', 'Historically the most mature in the enterprise market', 'جيد جدًا وينمو بسرعة، أقل انتشارًا في المؤسسات الكبرى', 'Very good and growing fast, less common in large enterprises', 9, 6),
      spec('سهولة الإدارة لفريق صغير', 'Manageability for a small team', 'واجهة قوية لكن معقّدة الترخيص', 'Powerful interface but licensing complexity', 'واجهة ويب بسيطة ومباشرة', 'Simple, direct web interface', 6, 8),
    ],
    verdictAr: 'vSphere منطقي لمؤسسة كبيرة عندها ميزانية وعقد دعم قائم. Proxmox VE خيار قوي جدًا وبيكسب أرضية سريعة، خصوصًا بعد تغييرات ترخيص VMware الأخيرة.',
    verdictEn: 'vSphere makes sense for a large organization with budget and an existing support contract. Proxmox VE is a genuinely strong, fast-growing alternative, especially after VMware\'s recent licensing changes.',
  },
  {
    d1: 'pfSense', d2: 'OPNsense', sub: 'network-security', img1: 'firewall', img2: 'shield',
    specs: [
      spec('أصل المشروع والمجتمع', 'Project origin & community', 'أقدم وأوسع انتشارًا تاريخيًا', 'Older and historically more widespread', 'تفرّع من pfSense بتركيز أكبر على الشفافية والتحديثات المتكررة', 'A pfSense fork with more focus on transparency and frequent updates', 8, 8),
      spec('وتيرة التحديثات', 'Update frequency', 'أبطأ نسبيًا', 'Relatively slower', 'أسرع في إصدار تحديثات وميزات جديدة', 'Faster at shipping updates and new features', 6, 8),
      spec('التوافق مع الإضافات القديمة', 'Compatibility with older add-ons', 'مجتمع إضافات أوسع تاريخيًا', 'Historically wider add-on ecosystem', 'مجتمع أصغر لكن ينمو بسرعة', 'Smaller community but growing fast', 8, 6),
    ],
    verdictAr: 'الاتنين مبنيين على نفس الأساس (FreeBSD) وقريبين جدًا من بعض. pfSense أنسب لو محتاج إضافات قديمة معينة، OPNsense أفضل لو التحديثات المتكررة والشفافية أولوية.',
    verdictEn: 'Both share the same FreeBSD foundation and are very close. pfSense fits if you need specific legacy add-ons; OPNsense is better if frequent updates and transparency are the priority.',
  },
  {
    d1: 'Zabbix', d2: 'Nagios', sub: 'network-security', img1: 'analytics', img2: 'network',
    specs: [
      spec('سهولة الإعداد الأولي', 'Initial setup ease', 'اكتشاف تلقائي أوسع للأجهزة', 'Broader automatic device discovery', 'إعداد يدوي أكتر في البداية', 'More manual setup initially', 8, 5),
      spec('واجهة الرسوم البيانية', 'Dashboard/graphing UI', 'حديثة ومدمجة بشكل أفضل', 'Modern and better integrated', 'أساسية، غالبًا محتاجة إضافات خارجية للرسوم المتقدمة', 'Basic, often needs external plugins for advanced graphs', 8, 5),
      spec('النضج والاستقرار طويل المدى', 'Long-term maturity', 'ناضج وواسع الانتشار', 'Mature and widespread', 'من أقدم أدوات المراقبة مفتوحة المصدر على الإطلاق', 'One of the oldest open-source monitoring tools ever', 7, 8),
    ],
    verdictAr: 'Zabbix أسهل بداية وواجهة أحدث لمعظم الفرق. Nagios لسه خيار قوي لو عندك بنية تحتية قائمة عليه فعلًا أو محتاج نظام Plugin ضخم متوفر من سنين طويلة.',
    verdictEn: 'Zabbix is easier to start with and has a more modern UI for most teams. Nagios remains strong if you already have infrastructure built on it or need its huge, long-established plugin ecosystem.',
  },
  {
    d1: 'Ubiquiti UniFi', d2: 'Cisco Meraki', sub: 'network-security', img1: 'network', img2: 'cloud',
    specs: [
      spec('التكلفة الإجمالية', 'Total cost', 'شراء أجهزة مرة واحدة، بدون اشتراك سنوي إجباري', 'One-time hardware purchase, no mandatory annual subscription', 'اشتراك سنوي إجباري لكل جهاز طوال عمره', 'Mandatory annual per-device licensing for the device\'s lifetime', 8, 4),
      spec('سهولة الإدارة السحابية', 'Cloud management ease', 'جيدة عبر UniFi Controller', 'Good via the UniFi Controller', 'من الأفضل في السوق، إدارة سحابية ناضجة جدًا', 'Among the best in the market, very mature cloud management', 7, 9),
      spec('الدعم المؤسسي والـSLA', 'Enterprise support & SLA', 'دعم مجتمعي أساسًا، أقل رسمية', 'Mostly community-based support, less formal', 'دعم Cisco الرسمي مع اتفاقيات SLA واضحة', 'Official Cisco support with clear SLAs', 5, 9),
    ],
    verdictAr: 'UniFi قيمة ممتازة للشركات الصغيرة والمتوسطة بميزانية محدودة. Meraki أنسب للمؤسسات اللي محتاجة دعم رسمي واتفاقيات خدمة واضحة، مقابل تكلفة اشتراك سنوي دائم.',
    verdictEn: 'UniFi offers excellent value for budget-conscious small and mid-size businesses. Meraki fits organizations needing official support and clear SLAs, at the cost of a permanent annual subscription.',
  },
  {
    d1: 'Ansible', d2: 'PowerShell DSC', sub: 'software-services', img1: 'code', img2: 'windows',
    specs: [
      spec('التوافق عبر المنصات', 'Cross-platform compatibility', 'يدعم Linux وWindows وأجهزة شبكات متنوعة', 'Supports Linux, Windows, and diverse network devices', 'مصمم أساسًا لبيئة Windows', 'Built primarily for the Windows environment', 9, 6),
      spec('منحنى التعلم', 'Learning curve', 'YAML بسيط نسبيًا للمبتدئين', 'Relatively simple YAML for beginners', 'يحتاج خبرة PowerShell أعمق', 'Needs deeper PowerShell expertise', 8, 6),
      spec('التكامل مع Active Directory', 'Active Directory integration', 'ممكن عبر إضافات', 'Possible via modules', 'تكامل مباشر وطبيعي لأنه من نفس منظومة Microsoft', 'Direct, native integration as part of the Microsoft ecosystem', 6, 9),
    ],
    verdictAr: 'Ansible أفضل لبيئة مختلطة (Linux + Windows + شبكات). PowerShell DSC أنسب لبيئة Windows/AD خالصة محتاجة تكامل عميق مع منظومة Microsoft.',
    verdictEn: 'Ansible is the better fit for a mixed environment (Linux + Windows + network devices). PowerShell DSC suits a pure Windows/AD environment needing deep Microsoft ecosystem integration.',
  },
  {
    d1: 'Cloudflare', d2: 'Akamai', sub: 'network-security', img1: 'cloud', img2: 'shield',
    specs: [
      spec('سهولة البداية لموقع صغير أو متوسط', 'Ease of start for a small/mid site', 'خطة مجانية قوية وإعداد سريع جدًا', 'Strong free tier and very fast setup', 'موجّه أساسًا للمؤسسات الكبرى، إعداد أعقد', 'Primarily aimed at large enterprises, more complex setup', 9, 5),
      spec('حجم شبكة التوزيع العالمية', 'Global CDN network scale', 'واسعة جدًا وتنمو باستمرار', 'Very wide and constantly growing', 'من أقدم وأكبر شبكات CDN في العالم', 'One of the oldest and largest CDN networks in the world', 8, 9),
      spec('حماية DDoS للمؤسسات الضخمة', 'DDoS protection at massive enterprise scale', 'قوية جدًا وتغطي معظم الاحتياجات', 'Very strong, covers most needs', 'سجل طويل جدًا في حماية أكبر المواقع العالمية من هجمات ضخمة', 'A very long track record protecting the world\'s largest sites from massive attacks', 8, 9),
    ],
    verdictAr: 'Cloudflare خيار ممتاز وسريع البداية لمعظم المواقع، بما فيها الصغيرة والمتوسطة. Akamai أنسب لمؤسسات ضخمة جدًا محتاجة أعلى مستوى حماية وأداء عالمي بميزانية مؤسسية.',
    verdictEn: 'Cloudflare is an excellent, fast-to-start choice for most sites, including small and mid-size ones. Akamai fits very large enterprises needing the highest tier of protection and global performance at enterprise budget.',
  },
  {
    d1: 'Duo Security', d2: 'Microsoft Authenticator', sub: 'identity', img1: 'identity', img2: 'cloud',
    specs: [
      spec('استقلالية المنصة', 'Platform independence', 'محايد تمامًا، يشتغل مع أي مزوّد هوية', 'Fully vendor-neutral, works with any identity provider', 'أقوى طبيعيًا داخل منظومة Microsoft', 'Naturally strongest inside the Microsoft ecosystem', 8, 7),
      spec('سهولة الإعداد الأولي', 'Initial setup ease', 'واجهة إعداد بسيطة وسريعة', 'Simple, fast setup interface', 'سريع جدًا لو أصلًا على Entra ID', 'Very fast if already on Entra ID', 8, 9),
      spec('التكلفة', 'Cost', 'خطط مستقلة بأسعار واضحة', 'Standalone plans with clear pricing', 'غالبًا مُضمّن ضمن تراخيص Microsoft 365', 'Often bundled within Microsoft 365 licensing', 6, 8),
    ],
    verdictAr: 'Duo أفضل لبيئة متنوعة مش معتمدة على Microsoft بشكل أساسي. Microsoft Authenticator منطقي جدًا وأرخص لو أصلًا مشترك في Microsoft 365.',
    verdictEn: 'Duo is the better fit for a diverse environment not centered on Microsoft. Microsoft Authenticator makes strong sense -- and is cheaper -- if you\'re already on Microsoft 365.',
  },
  {
    d1: 'Terraform', d2: 'Ansible', sub: 'software-services', img1: 'code', img2: 'code2',
    specs: [
      spec('الغرض الأساسي', 'Primary purpose', 'بناء وإدارة البنية التحتية نفسها (IaC)', 'Provisioning and managing the infrastructure itself (IaC)', 'ضبط إعدادات الأنظمة بعد إنشائها (Configuration Management)', 'Configuring systems after they exist (configuration management)', 8, 8),
      spec('إدارة الحالة (State)', 'State management', 'يحتفظ بملف حالة يتتبع كل مورد', 'Maintains a state file tracking every resource', 'بدون حالة مركزية، بيتأكد من الوضع الحالي كل مرة', 'Stateless, checks current condition each run', 8, 7),
      spec('التعامل مع بيئات سحابية متعددة', 'Multi-cloud handling', 'من الأقوى والأشهر لهذا الغرض تحديدًا', 'Among the strongest and most popular specifically for this', 'ممكن لكن مش الغرض الأساسي له', 'Possible but not its primary design goal', 9, 5),
    ],
    verdictAr: 'الأداتين مكملتين لبعض مش بديلتين — Terraform لبناء البنية التحتية، Ansible لضبطها بعد كده. كتير من الفرق بتستخدم الاتنين مع بعض.',
    verdictEn: 'These tools complement rather than replace each other -- Terraform provisions infrastructure, Ansible configures it afterward. Many teams use both together.',
  },
  {
    d1: 'Datto', d2: 'Veeam', sub: 'software-services', img1: 'storage', img2: 'server',
    specs: [
      spec('التركيز الأساسي', 'Core focus', 'موجّه أساسًا لمزوّدي الخدمات المُدارة (MSP)', 'Primarily aimed at Managed Service Providers (MSPs)', 'مناسب لكل الأحجام من شركة صغيرة لمؤسسة ضخمة', 'Fits everything from small business to large enterprise', 7, 9),
      spec('سرعة الاستعادة', 'Recovery speed', 'يركّز بقوة على استمرارية العمل (BCDR) بسرعة استعادة عالية', 'Strong focus on business continuity (BCDR) with fast recovery', 'ممتاز أيضًا، خيارات استعادة مرنة', 'Also excellent, with flexible recovery options', 8, 8),
      spec('سهولة الإدارة لعميل واحد فقط', 'Manageability for a single client', 'مصمم لإدارة عملاء متعددين معًا', 'Designed to manage multiple clients at once', 'أبسط وأنسب لو محتاج تدير بيئة واحدة بس', 'Simpler and better suited to managing just one environment', 6, 8),
    ],
    verdictAr: 'Datto منطقي جدًا لو أنت مزوّد خدمات مُدارة بيدير نسخ احتياطي لعملاء متعددين. Veeam أنسب لو محتاج تدير نسخ احتياطي لبيئة واحدة (شركتك بس).',
    verdictEn: 'Datto makes strong sense if you\'re an MSP managing backups for multiple clients. Veeam fits better if you\'re managing backup for a single environment (just your own company).',
  },
  {
    d1: 'Qualys', d2: 'Nessus', sub: 'network-security', img1: 'security', img2: 'shield',
    specs: [
      spec('نموذج النشر', 'Deployment model', 'سحابي بالكامل غالبًا', 'Mostly fully cloud-based', 'يدعم النشر المحلي والسحابي', 'Supports both on-premises and cloud deployment', 7, 8),
      spec('سهولة البداية لفريق صغير', 'Ease of start for a small team', 'يحتاج تخطيط أولي أكتر', 'Needs more upfront planning', 'من أسهل أدوات فحص الثغرات بداية في السوق', 'Among the easiest vulnerability scanners to get started with', 6, 9),
      spec('عمق التقارير المؤسسية', 'Enterprise reporting depth', 'قوي جدًا لمؤسسات كبيرة متعددة الأنظمة', 'Very strong for large multi-system enterprises', 'جيد جدًا، أبسط للفرق الأصغر', 'Very good, simpler for smaller teams', 9, 7),
    ],
    verdictAr: 'Qualys أقوى لمؤسسة كبيرة محتاجة رؤية شاملة عبر بنية تحتية معقدة. Nessus أسهل بداية وأنسب لفريق أمان صغير أو متوسط.',
    verdictEn: 'Qualys is stronger for a large organization needing comprehensive visibility across complex infrastructure. Nessus is easier to start with and fits a small-to-mid security team better.',
  },
  {
    d1: 'Google Workspace', d2: 'Microsoft 365', sub: 'software-services', img1: 'cloud', img2: 'browser',
    specs: [
      spec('التعاون اللحظي على المستندات', 'Real-time document collaboration', 'من الأنضج والأسلس في السوق تاريخيًا', 'Historically among the smoothest and most mature in the market', 'تحسّن كثيرًا، لسه خلف قليلًا في السلاسة اللحظية', 'Improved a lot, still slightly behind in real-time smoothness', 9, 7),
      spec('التكامل مع أدوات مؤسسية تقليدية', 'Integration with traditional enterprise tools', 'أقل تكاملًا مع أنظمة Windows/AD التقليدية', 'Less integrated with traditional Windows/AD systems', 'تكامل عميق وطبيعي مع Windows وActive Directory', 'Deep, native integration with Windows and Active Directory', 6, 9),
      spec('تطبيقات المكتب الكاملة (Desktop)', 'Full desktop office apps', 'أساسًا سحابي، تطبيقات مكتبية محدودة', 'Primarily cloud-based, limited desktop apps', 'تطبيقات Office الكاملة (Word, Excel) بجانب النسخة السحابية', 'Full desktop Office apps (Word, Excel) alongside the cloud version', 6, 9),
    ],
    verdictAr: 'Google Workspace أفضل لفريق يعتمد بشكل أساسي على التعاون السحابي البسيط. Microsoft 365 أنسب لمؤسسة محتاجة تطبيقات مكتبية كاملة وتكامل عميق مع بنية Windows موجودة أصلًا.',
    verdictEn: 'Google Workspace is better for a team relying mainly on simple cloud collaboration. Microsoft 365 fits an organization needing full desktop apps and deep integration with an existing Windows infrastructure.',
  },
  {
    d1: 'Tailscale', d2: 'Traditional Site-to-Site VPN', sub: 'network-security', img1: 'vpn', img2: 'network',
    specs: [
      spec('سهولة الإعداد', 'Setup ease', 'إعداد سريع جدًا يعتمد على WireGuard، بدون تعقيد شبكي تقليدي', 'Very fast WireGuard-based setup, without traditional networking complexity', 'يحتاج إعداد أعمق (IPs, routing, firewall rules)', 'Needs deeper setup (IPs, routing, firewall rules)', 9, 5),
      spec('الملاءمة لفرق موزّعة (Remote)', 'Fit for distributed remote teams', 'مصمم أساسًا لهذا الغرض بالظبط', 'Built specifically for exactly this purpose', 'ممكن لكن مش الاستخدام الأساسي له', 'Possible but not its primary use case', 9, 6),
      spec('التحكم المركزي التقليدي', 'Traditional centralized control', 'أبسط، أقل تحكم دقيق على مستوى الشبكة', 'Simpler, less granular network-level control', 'تحكم كامل ودقيق جدًا على مستوى الشبكة', 'Full, very granular network-level control', 6, 9),
    ],
    verdictAr: 'Tailscale أسرع وأبسط بكتير لفريق صغير أو متوسط موزّع جغرافيًا. VPN التقليدي لسه منطقي لمؤسسة كبيرة محتاجة تحكم شبكي دقيق ومركزي.',
    verdictEn: 'Tailscale is much faster and simpler for a small-to-mid geographically distributed team. Traditional VPN still makes sense for a large organization needing precise, centralized network control.',
  },
  {
    d1: 'Bitwarden Business', d2: 'Keeper', sub: 'identity', img1: 'security', img2: 'identity',
    specs: [
      spec('التكلفة للفرق', 'Cost for teams', 'من الأرخص في السوق لخطط الفرق', 'Among the cheapest in the market for team plans', 'أعلى سعرًا لكن مع ميزات مؤسسية إضافية', 'Higher priced but with extra enterprise features', 9, 6),
      spec('مفتوح المصدر والشفافية', 'Open source & transparency', 'مفتوح المصدر بالكامل، قابل للتدقيق', 'Fully open-source, independently auditable', 'مغلق المصدر', 'Closed source', 9, 5),
      spec('ميزات المراقبة المؤسسية', 'Enterprise monitoring features', 'أساسية', 'Basic', 'تقارير وتحكم أعمق للمؤسسات الكبيرة', 'Deeper reporting and control for large enterprises', 6, 8),
    ],
    verdictAr: 'Bitwarden Business قيمة ممتازة وشفافية عالية للفرق الصغيرة والمتوسطة. Keeper أنسب لمؤسسة كبيرة محتاجة تحكم وتقارير أعمق وعندها ميزانية أعلى.',
    verdictEn: 'Bitwarden Business offers excellent value and transparency for small-to-mid teams. Keeper fits a larger organization needing deeper control and reporting with a bigger budget.',
  },
  {
    d1: 'Rapid7 InsightVM', d2: 'Tenable.io', sub: 'network-security', img1: 'security', img2: 'shield',
    specs: [
      spec('سهولة الربط بأدوات الاستجابة', 'Integration with response tooling', 'تكامل قوي مع أدوات Rapid7 الأخرى (SOAR)', 'Strong integration with other Rapid7 tools (SOAR)', 'تكامل واسع أيضًا عبر شراكات كتيرة', 'Also wide integration through many partnerships', 8, 8),
      spec('سهولة البداية', 'Ease of getting started', 'واجهة واضحة نسبيًا', 'Relatively clear interface', 'من الأسهل تاريخيًا في فحص الثغرات', 'Historically among the easiest for vulnerability scanning', 7, 8),
      spec('عمق التحليل والتقييم', 'Analysis & prioritization depth', 'قوي جدًا في ترتيب أولوية المخاطر الفعلية', 'Very strong at prioritizing real risk', 'قوي أيضًا، معيار صناعي معروف', 'Also strong, a well-known industry standard', 8, 8),
    ],
    verdictAr: 'الاتنين من أقوى حلول فحص الثغرات في السوق المؤسسي، والفرق العملي بينهم صغير. القرار غالبًا بيعتمد على الأدوات التانية الموجودة أصلًا في بيئتك.',
    verdictEn: 'Both are among the strongest enterprise vulnerability-scanning solutions, with a small practical gap between them. The decision usually comes down to what other tools already exist in your environment.',
  },
  {
    d1: 'Postman', d2: 'Insomnia', sub: 'software-services', img1: 'code', img2: 'dev',
    specs: [
      spec('مجموعة الميزات الشاملة', 'Overall feature breadth', 'أوسع بكثير (اختبار تلقائي، مراقبة، توثيق)', 'Much broader (automated testing, monitoring, docs)', 'أبسط وأخف، يركّز على الأساسيات', 'Simpler and lighter, focused on the essentials', 9, 6),
      spec('سرعة الأداء واستهلاك الموارد', 'Performance & resource usage', 'أثقل نسبيًا مع كل الميزات المدمجة', 'Relatively heavier with all its bundled features', 'أخف وأسرع بشكل ملحوظ', 'Noticeably lighter and faster', 6, 9),
      spec('التعاون الجماعي', 'Team collaboration', 'قوي جدًا مع مساحات عمل مشتركة', 'Very strong with shared workspaces', 'جيد، أبسط نسبيًا', 'Good, relatively simpler', 8, 6),
    ],
    verdictAr: 'Postman أشمل لفريق كبير محتاج ميزات متقدمة وتعاون. Insomnia أفضل لمطوّر فردي أو فريق صغير عايز أداة خفيفة وسريعة بدون تعقيد زيادة.',
    verdictEn: 'Postman is more comprehensive for a large team needing advanced features and collaboration. Insomnia is better for a solo developer or small team wanting a light, fast tool without extra complexity.',
  },
  {
    d1: 'GitHub Actions', d2: 'Jenkins', sub: 'software-services', img1: 'code', img2: 'server',
    specs: [
      spec('سهولة الإعداد', 'Setup ease', 'مدمج مباشرة في GitHub، إعداد سريع جدًا', 'Built directly into GitHub, very fast setup', 'يحتاج تثبيت وإدارة سيرفر منفصل', 'Needs a separate server install and management', 9, 4),
      spec('المرونة والتخصيص الكامل', 'Full flexibility & customization', 'جيدة لكن محدودة نسبيًا بمنصة GitHub', 'Good but relatively limited to the GitHub platform', 'مرونة شبه كاملة، آلاف الإضافات', 'Near-total flexibility, thousands of plugins', 7, 9),
      spec('التكلفة لمشروع مفتوح المصدر صغير', 'Cost for a small open-source project', 'دقائق تشغيل مجانية سخية', 'Generous free run-minutes', 'مجاني بالكامل لكن يحتاج استضافة خاصة بك', 'Fully free but needs your own hosting', 8, 7),
    ],
    verdictAr: 'GitHub Actions أسرع بداية وأبسط لمعظم المشاريع الحديثة على GitHub. Jenkins لسه الخيار الأقوى لبيئة محتاجة تخصيص كامل أو مش على GitHub أصلًا.',
    verdictEn: 'GitHub Actions is faster to start and simpler for most modern GitHub-hosted projects. Jenkins remains the stronger choice for an environment needing full customization or not on GitHub at all.',
  },
  {
    d1: 'Grafana', d2: 'Kibana', sub: 'software-services', img1: 'analytics', img2: 'cloud',
    specs: [
      spec('مصادر البيانات المدعومة', 'Supported data sources', 'يدعم مصادر بيانات متنوعة جدًا (Prometheus, MySQL, وغيرها)', 'Supports a very wide variety of data sources (Prometheus, MySQL, and more)', 'مرتبط أساسًا بمنظومة Elasticsearch', 'Primarily tied to the Elasticsearch ecosystem', 9, 6),
      spec('لوحات المراقبة والتنبيهات', 'Dashboards & alerting', 'من الأقوى في السوق لهذا الغرض تحديدًا', 'Among the strongest in the market specifically for this', 'قوي أيضًا، خصوصًا مع بيانات Elasticsearch', 'Also strong, especially with Elasticsearch data', 9, 7),
      spec('البحث النصي الكامل في السجلات', 'Full-text log search', 'ممكن لكن مش نقطة القوة الأساسية', 'Possible but not its core strength', 'من الأقوى في البحث النصي داخل السجلات', 'Among the strongest for full-text log search', 6, 9),
    ],
    verdictAr: 'Grafana أفضل لو محتاج لوحات مراقبة موحدة من مصادر بيانات متعددة. Kibana أقوى لو أصلًا بتستخدم Elasticsearch وبتركّز على البحث العميق في السجلات.',
    verdictEn: 'Grafana is better if you need unified dashboards across multiple data sources. Kibana is stronger if you\'re already on Elasticsearch and focused on deep log search.',
  },
  {
    d1: 'AnyDesk', d2: 'TeamViewer', sub: 'software-services', img1: 'server', img2: 'cloud',
    specs: [
      spec('سرعة الاتصال والاستجابة', 'Connection speed & responsiveness', 'يُعرف بسرعة استجابة عالية حتى على اتصالات أبطأ', 'Known for high responsiveness even on slower connections', 'جيد جدًا، أثقل شوية على اتصالات ضعيفة', 'Very good, slightly heavier on weak connections', 8, 7),
      spec('التسعير للاستخدام التجاري', 'Pricing for commercial use', 'أرخص نسبيًا في أغلب الخطط', 'Relatively cheaper across most plans', 'أشمل ميزات لكن أعلى سعرًا عمومًا', 'More comprehensive features but generally pricier', 8, 6),
      spec('ميزات الدعم الفني المؤسسي', 'Enterprise IT support features', 'جيدة ومتنامية', 'Good and growing', 'من الأنضج والأشمل تاريخيًا في هذا المجال', 'Historically among the most mature and comprehensive in this space', 7, 9),
    ],
    verdictAr: 'AnyDesk أسرع وأرخص لمعظم الاستخدامات اليومية. TeamViewer لسه الخيار الأشمل لمؤسسة كبيرة محتاجة ميزات دعم فني متقدمة ومتكاملة.',
    verdictEn: 'AnyDesk is faster and cheaper for most day-to-day use. TeamViewer remains the more comprehensive choice for a large enterprise needing advanced, integrated IT support features.',
  },
  {
    d1: 'BitLocker', d2: 'VeraCrypt', sub: 'endpoint', img1: 'windows', img2: 'security',
    specs: [
      spec('التكامل مع Windows وActive Directory', 'Windows & AD integration', 'مدمج بالكامل، تحكم مركزي عبر GPO وAD', 'Fully built-in, central control via GPO and AD', 'مفتوح المصدر، لا تكامل مؤسسي مباشر', 'Open-source, no direct enterprise integration', 9, 4),
      spec('دعم أنظمة تشغيل متعددة', 'Cross-platform support', 'Windows فقط', 'Windows only', 'يدعم Windows وmacOS وLinux', 'Supports Windows, macOS, and Linux', 3, 9),
      spec('الشفافية والتدقيق المستقل', 'Transparency & independent audit', 'مغلق المصدر', 'Closed source', 'مفتوح المصدر بالكامل، خضع لتدقيق مستقل', 'Fully open-source, has undergone independent audits', 4, 9),
    ],
    verdictAr: 'BitLocker أنسب بيئة شركة معتمدة على Windows/AD محتاجة إدارة مركزية سهلة. VeraCrypt أفضل لمستخدم فردي أو بيئة متعددة الأنظمة محتاجة شفافية كاملة.',
    verdictEn: 'BitLocker fits a Windows/AD-based company environment needing easy central management. VeraCrypt is better for an individual user or cross-platform environment needing full transparency.',
  },
  {
    d1: 'Burp Suite', d2: 'OWASP ZAP', sub: 'network-security', img1: 'security', img2: 'code',
    specs: [
      spec('التكلفة', 'Cost', 'النسخة الكاملة مدفوعة (Professional)', 'The full Professional version is paid', 'مجاني ومفتوح المصدر بالكامل', 'Fully free and open-source', 5, 9),
      spec('عمق الميزات المتقدمة', 'Advanced feature depth', 'من الأعمق والأكثر احترافية في اختبار تطبيقات الويب', 'Among the deepest and most professional for web app testing', 'قوي جدًا كأداة مجانية، أقل عمقًا من النسخة المدفوعة', 'Very strong as a free tool, less deep than the paid alternative', 9, 7),
      spec('سهولة البداية للمبتدئين', 'Ease of start for beginners', 'منحنى تعلم أعلى قليلًا', 'Slightly steeper learning curve', 'واجهة أبسط، مناسب جدًا للبداية', 'Simpler interface, well-suited for getting started', 6, 8),
    ],
    verdictAr: 'Burp Suite Professional الخيار الأقوى لمختبر اختراق محترف بميزانية. OWASP ZAP بديل ممتاز ومجاني بالكامل، خصوصًا للمبتدئين أو المشاريع مفتوحة المصدر.',
    verdictEn: 'Burp Suite Professional is the stronger choice for a professional pentester with budget. OWASP ZAP is an excellent, fully free alternative, especially for beginners or open-source projects.',
  },
  {
    d1: 'Snort', d2: 'Suricata', sub: 'network-security', img1: 'shield', img2: 'network',
    specs: [
      spec('الأداء متعدد المعالجات', 'Multi-threaded performance', 'تاريخيًا معالجة أحادية الخيط بشكل أساسي', 'Historically primarily single-threaded processing', 'مبني من الأساس ليدعم معالجة متعددة الخيوط', 'Built from the ground up for multi-threaded processing', 6, 9),
      spec('النضج والانتشار التاريخي', 'Historical maturity & adoption', 'الأقدم والأكثر انتشارًا تاريخيًا، مجتمع ضخم', 'The oldest and most widely adopted historically, huge community', 'أحدث نسبيًا لكن ينمو بسرعة كبيرة', 'Relatively newer but growing very fast', 9, 7),
      spec('دعم فك تشفير البروتوكولات الحديثة', 'Modern protocol decoding support', 'جيد، يحتاج إضافات أحيانًا', 'Good, sometimes needs add-ons', 'دعم أعمق ومدمج لبروتوكولات وتطبيقات أحدث', 'Deeper, built-in support for newer protocols and applications', 6, 8),
    ],
    verdictAr: 'Snort لسه خيار قوي بمجتمع ضخم وموارد تعلم أكتر. Suricata أفضل لبيئة محتاجة أداء أعلى على أجهزة متعددة النوى الحديثة.',
    verdictEn: 'Snort remains strong with a huge community and more learning resources. Suricata is better for an environment needing higher performance on modern multi-core hardware.',
  },
  {
    d1: 'GitLab', d2: 'GitHub', sub: 'software-services', img1: 'code', img2: 'code2',
    specs: [
      spec('الاستضافة الذاتية (Self-hosted)', 'Self-hosting', 'دعم قوي وناضج جدًا للاستضافة الذاتية المجانية', 'Strong, very mature free self-hosting support', 'الاستضافة الذاتية محدودة أكتر ومكلفة (GitHub Enterprise)', 'Self-hosting is more limited and costly (GitHub Enterprise)', 9, 5),
      spec('أدوات CI/CD المدمجة', 'Built-in CI/CD tooling', 'مدمجة بعمق وناضجة جدًا من سنين طويلة', 'Deeply integrated and very mature for many years', 'GitHub Actions قوية وسهلة، أحدث نسبيًا', 'GitHub Actions is strong and easy, relatively newer', 9, 8),
      spec('حجم المجتمع ومشاريع مفتوحة المصدر', 'Community size & open-source projects', 'مجتمع كبير لكن أصغر من GitHub', 'Large community but smaller than GitHub', 'الأكبر بلا منازع لاستضافة المشاريع مفتوحة المصدر', 'By far the largest for hosting open-source projects', 6, 9),
    ],
    verdictAr: 'GitLab أقوى لو محتاج استضافة ذاتية كاملة أو DevOps متكامل من نفس المنصة. GitHub أفضل للانخراط مع أكبر مجتمع مفتوح المصدر في العالم.',
    verdictEn: 'GitLab is stronger if you need full self-hosting or integrated DevOps from one platform. GitHub is better for engaging with the world\'s largest open-source community.',
  },
  {
    d1: 'Docker', d2: 'Podman', sub: 'software-services', img1: 'server', img2: 'cpu',
    specs: [
      spec('الحاجة لخدمة Daemon مستمرة', 'Need for a persistent daemon', 'يحتاج خدمة Daemon شغالة دايمًا بصلاحيات root غالبًا', 'Requires an always-running daemon, often with root privileges', 'بدون Daemon، تشغيل بدون صلاحيات root ممكن', 'Daemonless, rootless operation is possible', 6, 9),
      spec('النضج وسهولة الاستخدام', 'Maturity & ease of use', 'الأكثر انتشارًا ونضجًا تاريخيًا، توثيق أوسع', 'The most widespread and historically mature, wider documentation', 'أحدث نسبيًا، توافق أوامر مشابه لـDocker يسهّل الانتقال', 'Relatively newer, Docker-compatible commands ease the transition', 9, 7),
      spec('الأمان الافتراضي', 'Default security posture', 'يحتاج إعداد إضافي للتشغيل الآمن بدون root', 'Needs extra configuration for secure rootless operation', 'مصمم من الأساس ليكون أكثر أمانًا افتراضيًا', 'Designed from the ground up to be more secure by default', 6, 9),
    ],
    verdictAr: 'Docker لسه الخيار الأوسع انتشارًا والأنضج توثيقًا. Podman بديل قوي جدًا لو الأمان الافتراضي (بدون root) وتقليل الاعتماد على Daemon أولوية عندك.',
    verdictEn: 'Docker remains the most widespread and best-documented choice. Podman is a very strong alternative if default security (rootless) and reducing daemon dependency matter to you.',
  },
  {
    d1: 'Cisco ISE', d2: 'Aruba ClearPass', sub: 'network-security', img1: 'network', img2: 'identity',
    specs: [
      spec('التكامل مع بنية Cisco القائمة', 'Integration with existing Cisco infrastructure', 'سلس جدًا لو شبكتك مبنية على Cisco أصلًا', 'Very smooth if your network is already Cisco-based', 'يعمل مع بنية متعددة المزوّدين بمرونة أعلى', 'Works flexibly across multi-vendor infrastructure', 9, 7),
      spec('سهولة الإعداد الأولي', 'Initial setup ease', 'أعقد نسبيًا، يحتاج خبرة أعمق', 'Relatively more complex, needs deeper expertise', 'واجهة أوضح وأسهل بداية غالبًا', 'Generally clearer interface and easier to start with', 6, 8),
      spec('المرونة عبر بيئات متعددة المزوّدين', 'Flexibility across multi-vendor environments', 'أقوى داخل منظومة Cisco تحديدًا', 'Strongest specifically within the Cisco ecosystem', 'مصمم من الأساس ليكون محايدًا للمزوّدين', 'Built from the ground up to be vendor-neutral', 6, 9),
    ],
    verdictAr: 'Cisco ISE منطقي جدًا لو شبكتك بالكامل من Cisco أصلًا. Aruba ClearPass أنسب لبيئة متعددة المزوّدين محتاجة مرونة NAC أعلى.',
    verdictEn: 'Cisco ISE makes strong sense if your network is entirely Cisco already. Aruba ClearPass fits better in a multi-vendor environment needing more NAC flexibility.',
  },
  {
    d1: 'Sysmon', d2: 'Windows Default Auditing', sub: 'endpoint', img1: 'endpoint', img2: 'windows',
    specs: [
      spec('عمق التفاصيل المسجّلة', 'Logging detail depth', 'تفاصيل غنية جدًا (تجزئة الملفات، سلاسل الشبكة، إلخ)', 'Very rich detail (file hashes, network connections, etc.)', 'أساسي، يغطي الأحداث الشائعة بس', 'Basic, covers only common events', 9, 5),
      spec('سهولة الإعداد', 'Setup ease', 'يحتاج تثبيت وضبط ملف تكوين خارجي', 'Needs installation and an external config file', 'مدمج بالكامل، تفعيل مباشر من الإعدادات', 'Fully built-in, direct activation from settings', 5, 9),
      spec('التكامل مع أدوات SIEM', 'SIEM integration', 'من الأفضل والأكثر توافقًا مع معظم حلول SIEM', 'Among the best and most compatible with most SIEM solutions', 'متوافق لكن بتفاصيل أقل عمقًا', 'Compatible but with less detailed data', 9, 6),
    ],
    verdictAr: 'Sysmon أقوى بكتير في عمق التفاصيل ومناسب جدًا لو عندك SIEM بتحلل البيانات. التدقيق الافتراضي في Windows كافٍ للبداية البسيطة بس، مش لتحقيق جنائي حقيقي.',
    verdictEn: 'Sysmon is far stronger in detail depth and fits well if you have a SIEM analyzing the data. Windows default auditing is fine for a basic start, but not for real forensic investigation.',
  },
  {
    d1: 'Have I Been Pwned', d2: 'Enterprise Breach Monitoring Services', sub: 'network-security', img1: 'security', img2: 'analytics',
    specs: [
      spec('التكلفة', 'Cost', 'مجاني للاستخدام الفردي والتحقق الأساسي', 'Free for individual use and basic checks', 'مدفوع، مصمم لمراقبة نطاقات مؤسسية كاملة', 'Paid, designed for monitoring entire enterprise domains', 9, 5),
      spec('عمق المراقبة المستمرة', 'Continuous monitoring depth', 'تنبيهات أساسية عند تسريب جديد', 'Basic alerts on a new leak', 'مراقبة أعمق ومستمرة عبر مصادر أوسع (منتديات، أسواق مظلمة)', 'Deeper, continuous monitoring across wider sources (forums, dark markets)', 6, 9),
      spec('سهولة البداية', 'Ease of getting started', 'فوري، بس تدخل الإيميل وتشوف النتيجة', 'Instant -- just enter an email and see the result', 'يحتاج إعداد واشتراك مؤسسي', 'Needs setup and an enterprise subscription', 9, 5),
    ],
    verdictAr: 'Have I Been Pwned ممتاز كنقطة بداية سريعة ومجانية لأي فرد أو فريق صغير. خدمات المراقبة المؤسسية تستاهل الاستثمار لو عندك نطاق شركة كبير محتاج مراقبة مستمرة وأعمق.',
    verdictEn: 'Have I Been Pwned is excellent as a quick, free starting point for any individual or small team. Enterprise monitoring services are worth the investment if you have a large company domain needing deeper, continuous monitoring.',
  },
  {
    d1: 'Nextcloud', d2: 'ownCloud', sub: 'software-services', img1: 'cloud', img2: 'storage',
    specs: [
      spec('وتيرة التطوير والميزات الحديثة', 'Development pace & modern features', 'أسرع في إضافة ميزات جديدة، مجتمع أكبر حاليًا', 'Faster at adding new features, currently a larger community', 'أبطأ نسبيًا، يركّز على الاستقرار المؤسسي', 'Relatively slower, focuses on enterprise stability', 8, 6),
      spec('سهولة الاستضافة الذاتية', 'Self-hosting ease', 'توثيق واسع وسهل للمبتدئين', 'Extensive, beginner-friendly documentation', 'جيد أيضًا، أنسب لفرق تقنية متمرسة', 'Also good, better suited to experienced technical teams', 8, 7),
      spec('الميزات المؤسسية المتقدمة', 'Advanced enterprise features', 'متوفرة، تنمو باستمرار', 'Available, constantly growing', 'تاريخيًا أقوى في ميزات الامتثال المؤسسي البحتة', 'Historically stronger in purely enterprise compliance features', 7, 8),
    ],
    verdictAr: 'Nextcloud الخيار الأشهر والأسرع تطويرًا حاليًا لمعظم الاستخدامات. ownCloud لسه خيار قوي لمؤسسة كبيرة محتاجة استقرار وميزات امتثال محددة.',
    verdictEn: 'Nextcloud is currently the more popular, faster-developing choice for most use cases. ownCloud remains a strong option for a large enterprise needing stability and specific compliance features.',
  },
  {
    d1: 'Prometheus', d2: 'Datadog', sub: 'software-services', img1: 'analytics', img2: 'cloud',
    specs: [
      spec('نموذج الاستضافة والتكلفة', 'Hosting model & cost', 'مفتوح المصدر، تستضيفه بنفسك، تكلفة بنية تحتية بس', 'Open-source, self-hosted, only infrastructure cost', 'خدمة سحابية مُدارة بالكامل، تسعير حسب الاستخدام', 'Fully managed cloud service, usage-based pricing', 8, 6),
      spec('سهولة الإعداد الأولي', 'Initial setup ease', 'يحتاج إعداد وضبط يدوي أكتر', 'Needs more manual setup and tuning', 'إعداد سريع جدًا، تكامل جاهز مع مئات الخدمات', 'Very fast setup, ready-made integrations with hundreds of services', 5, 9),
      spec('التحكم الكامل في البيانات', 'Full data control', 'تحكم كامل، البيانات عندك بالكامل', 'Full control, data stays entirely with you', 'البيانات على سحابة الطرف التالت', 'Data lives on a third-party cloud', 9, 5),
    ],
    verdictAr: 'Prometheus أفضل لو محتاج تحكم كامل في البيانات وعندك فريق تقني قادر على الإدارة الذاتية. Datadog أسرع بداية وأنسب لفريق عايز حل جاهز بدون عبء إدارة بنية تحتية.',
    verdictEn: 'Prometheus is better if you need full data control and have a technical team capable of self-management. Datadog is faster to start and fits a team wanting a ready-made solution without infrastructure management overhead.',
  },
  {
    d1: 'Metasploit', d2: 'Manual Exploitation', sub: 'network-security', img1: 'security', img2: 'code',
    specs: [
      spec('سرعة اختبار ثغرات معروفة', 'Speed testing known vulnerabilities', 'سريع جدًا، مكتبة ضخمة من الثغرات الجاهزة', 'Very fast, a huge library of ready exploits', 'أبطأ بكثير، كل خطوة بتتكتب يدويًا', 'Much slower, every step written manually', 9, 3),
      spec('الفهم العميق لآلية الثغرة', 'Deep understanding of the vulnerability mechanics', 'ممكن يخلي المختبر يعتمد على الأداة من غير فهم عميق', 'Can lead a tester to rely on the tool without deep understanding', 'بيبني فهم حقيقي عميق لكل خطوة وكل ثغرة', 'Builds real, deep understanding of every step and vulnerability', 5, 9),
      spec('اكتشاف ثغرات جديدة غير معروفة', 'Discovering new, unknown vulnerabilities', 'محدود بمكتبة الثغرات الموجودة أصلًا', 'Limited to the exploit library that already exists', 'الطريقة الوحيدة الفعلية لاكتشاف ثغرات يوم الصفر', 'The only real way to discover zero-day vulnerabilities', 4, 9),
    ],
    verdictAr: 'Metasploit أسرع وأعملي لاختبار ثغرات معروفة على نطاق واسع. الاستغلال اليدوي ضروري لفهم عميق حقيقي ولاكتشاف ثغرات جديدة غير موجودة في أي مكتبة جاهزة.',
    verdictEn: 'Metasploit is faster and more practical for testing known vulnerabilities at scale. Manual exploitation is necessary for real deep understanding and discovering new vulnerabilities not in any existing library.',
  },
  {
    d1: 'Microsoft Purview', d2: 'Traditional DLP Tools', sub: 'network-security', img1: 'cloud', img2: 'security',
    specs: [
      spec('التكامل مع منظومة Microsoft 365', 'Microsoft 365 ecosystem integration', 'تكامل عميق ومباشر لأنه من نفس المنظومة', 'Deep, direct integration as part of the same ecosystem', 'يحتاج تكامل إضافي مع كل خدمة على حدة', 'Needs extra integration work with each service separately', 9, 5),
      spec('التغطية خارج بيئة Microsoft', 'Coverage outside the Microsoft environment', 'محدودة نسبيًا خارج منظومة Microsoft', 'Relatively limited outside the Microsoft ecosystem', 'أدوات DLP تقليدية غالبًا مصممة للتغطية الشاملة عبر منصات متعددة', 'Traditional DLP tools are often designed for broad multi-platform coverage', 5, 8),
      spec('سهولة الإدارة الموحدة', 'Unified management ease', 'لوحة تحكم واحدة لكل بيانات Microsoft 365', 'One dashboard for all Microsoft 365 data', 'يحتاج غالبًا إدارة منفصلة لكل نظام', 'Often requires separate management per system', 9, 6),
    ],
    verdictAr: 'Microsoft Purview منطقي جدًا لو مؤسستك معتمدة بشكل أساسي على Microsoft 365. أدوات DLP التقليدية أنسب لبيئة متنوعة فيها أنظمة كتيرة خارج منظومة Microsoft.',
    verdictEn: 'Microsoft Purview makes strong sense if your organization is primarily on Microsoft 365. Traditional DLP tools fit better in a diverse environment with many systems outside the Microsoft ecosystem.',
  },
  {
    d1: 'YubiKey', d2: 'Authenticator App', sub: 'identity', img1: 'identity', img2: 'phone',
    specs: [
      spec('مقاومة هجمات التصيد', 'Phishing resistance', 'مقاومة عالية جدًا، من الأصعب اختراقها حتى بالتصيد المتقدم', 'Very high resistance, among the hardest to bypass even with advanced phishing', 'جيدة، لكن عرضة نظريًا لهجمات معقدة جدًا', 'Good, but theoretically vulnerable to very sophisticated attacks', 9, 7),
      spec('سهولة الاستخدام اليومي', 'Daily usability', 'يحتاج حمل جهاز إضافي دايمًا', 'Requires always carrying an extra device', 'موجود بالفعل على الهاتف المستخدم يوميًا', 'Already on the phone used daily', 6, 9),
      spec('التكلفة', 'Cost', 'تكلفة شراء لكل مستخدم', 'A purchase cost per user', 'مجاني تمامًا لأي تطبيق موثوق', 'Fully free for any trusted app', 5, 9),
    ],
    verdictAr: 'YubiKey الخيار الأقوى أمنيًا للحسابات عالية الحساسية رغم التكلفة والعبء الإضافي. تطبيق المصادقة خيار ممتاز وعملي لمعظم المستخدمين اليوميين.',
    verdictEn: 'YubiKey is the strongest security choice for high-sensitivity accounts despite the cost and extra burden. An authenticator app is an excellent, practical choice for most everyday users.',
  },
  {
    d1: 'Palo Alto Prisma Access', d2: 'Zscaler', sub: 'network-security', img1: 'firewall', img2: 'cloud',
    specs: [
      spec('التكامل مع بنية Palo Alto القائمة', 'Integration with existing Palo Alto infrastructure', 'سلس جدًا لو عندك أجهزة Palo Alto أصلًا', 'Very smooth if you already run Palo Alto appliances', 'محايد تمامًا تجاه المزوّد، مصمم كخدمة سحابية بحتة', 'Fully vendor-neutral, built as a pure cloud service', 9, 7),
      spec('نضج منصة SASE السحابية', 'Cloud-native SASE platform maturity', 'استثمار قوي وحديث نسبيًا في هذا الاتجاه', 'Strong, relatively newer investment in this direction', 'من الرواد الأوائل في مجال SASE السحابي تحديدًا', 'Among the earliest pioneers specifically in cloud-native SASE', 7, 9),
      spec('سهولة الإدارة الموحدة مع الفروع', 'Unified branch management ease', 'قوية لو باقي بنيتك من Palo Alto', 'Strong if the rest of your infrastructure is Palo Alto', 'واجهة سحابية موحدة مصممة لهذا الغرض تحديدًا', 'A unified cloud console designed specifically for this', 7, 9),
    ],
    verdictAr: 'Prisma Access منطقي جدًا لو مؤسستك معتمدة أصلًا على أجهزة Palo Alto. Zscaler خيار أنضج وأكثر تخصصًا لو بتبدأ استراتيجية SASE من الصفر بدون التزام سابق بمزوّد معين.',
    verdictEn: 'Prisma Access makes strong sense if your organization already runs on Palo Alto appliances. Zscaler is a more mature, specialized choice if you\'re starting a SASE strategy from scratch without prior vendor commitment.',
  },
  {
    d1: 'Elastic Stack (ELK)', d2: 'Splunk', sub: 'network-security', img1: 'analytics', img2: 'db',
    specs: [
      spec('التكلفة للبيانات الضخمة', 'Cost at large data volume', 'أرخص بكثير عند حجم بيانات كبير جدًا', 'Much cheaper at very large data volumes', 'تكلفة ترخيص ترتفع بشكل ملحوظ مع حجم البيانات', 'Licensing cost rises noticeably with data volume', 8, 4),
      spec('سهولة الإعداد الأولي', 'Initial setup ease', 'يحتاج تجميع عدة مكونات (Elasticsearch, Logstash, Kibana)', 'Requires assembling several components (Elasticsearch, Logstash, Kibana)', 'حل متكامل جاهز من البداية', 'A fully integrated, ready-to-use solution from the start', 5, 9),
      spec('الدعم الفني الرسمي', 'Official technical support', 'متاح لكن أقل شمولية من الخيارات المدفوعة بالكامل', 'Available but less comprehensive than fully paid options', 'دعم مؤسسي شامل ومعروف في السوق', 'Comprehensive, well-known enterprise support', 6, 9),
    ],
    verdictAr: 'Elastic Stack أوفر بكثير لبيانات ضخمة جدًا لو عندك فريق تقني قادر على الإدارة الذاتية. Splunk أسهل بداية وأقوى دعمًا لمؤسسة مستعدة تدفع أكتر مقابل حل جاهز ومتكامل.',
    verdictEn: 'Elastic Stack is much more economical for very large data volumes if you have a technically capable self-managing team. Splunk is easier to start with and better supported for an organization willing to pay more for a ready, integrated solution.',
  },
  {
    d1: 'Rclone', d2: 'rsync', sub: 'software-services', img1: 'storage', img2: 'server',
    specs: [
      spec('دعم التخزين السحابي', 'Cloud storage support', 'يدعم عشرات خدمات التخزين السحابي مباشرة (Google Drive, S3, إلخ)', 'Supports dozens of cloud storage services directly (Google Drive, S3, etc.)', 'مصمم أساسًا للمزامنة بين أنظمة ملفات محلية أو عبر SSH', 'Primarily designed for syncing between local filesystems or over SSH', 9, 4),
      spec('النضج والاستقرار التاريخي', 'Historical maturity & stability', 'أحدث نسبيًا لكن ناضج جدًا لغرضه', 'Relatively newer but very mature for its purpose', 'من أقدم وأكثر أدوات النسخ والمزامنة اختبارًا في تاريخ Linux', 'One of the oldest, most battle-tested sync tools in Linux history', 7, 9),
      spec('سرعة النقل للملفات المحلية الكبيرة', 'Transfer speed for large local files', 'جيدة، لكن مش نقطة التخصص الأساسية', 'Good, but not its primary specialty', 'محسّن بشكل كبير لنقل الفروق فقط (Delta) بسرعة عالية', 'Highly optimized for fast delta-only transfers', 6, 9),
    ],
    verdictAr: 'Rclone الخيار الأوضح لو شغلك أساسًا مع تخزين سحابي متنوع. rsync لسه لا يُضاهى لمزامنة ونسخ الملفات بين أنظمة محلية أو عبر SSH بكفاءة عالية.',
    verdictEn: 'Rclone is the clear choice if your work is primarily with diverse cloud storage. rsync remains unmatched for syncing and copying files between local systems or over SSH efficiently.',
  },
  {
    d1: 'Netskope', d2: 'Palo Alto Prisma SaaS', sub: 'network-security', img1: 'cloud', img2: 'firewall',
    specs: [
      spec('التركيز على أمان التطبيقات السحابية (CASB)', 'Cloud app security (CASB) focus', 'من الرواد المتخصصين تحديدًا في هذا المجال', 'Among the specialized pioneers specifically in this space', 'قوي أيضًا كجزء من منصة أمان سحابية أشمل', 'Also strong as part of a broader cloud security platform', 9, 7),
      spec('سهولة التكامل مع بنية Palo Alto القائمة', 'Integration ease with existing Palo Alto infrastructure', 'محايد تجاه المزوّد', 'Vendor-neutral', 'تكامل طبيعي وسلس لو عندك منتجات Palo Alto أصلًا', 'Natural, smooth integration if you already have Palo Alto products', 6, 9),
      spec('عمق تصنيف التطبيقات السحابية المكتشفة', 'Depth of discovered cloud app classification', 'قاعدة بيانات ضخمة ومتخصصة لتصنيف آلاف التطبيقات', 'A huge, specialized database classifying thousands of apps', 9, 7),
    ],
    verdictAr: 'Netskope أقوى وأعمق تخصصًا في أمان التطبيقات السحابية تحديدًا. Prisma SaaS منطقي أكتر لو محتاج منصة أمان موحدة متكاملة مع بقية منتجات Palo Alto.',
    verdictEn: 'Netskope is stronger and more deeply specialized specifically in cloud app security. Prisma SaaS makes more sense if you need a unified security platform integrated with the rest of your Palo Alto products.',
  },
  {
    d1: 'WSUS', d2: 'Microsoft Intune', sub: 'software-services', img1: 'server', img2: 'cloud',
    specs: [
      spec('التكلفة', 'Cost', 'مجاني بالكامل، مضمّن مع Windows Server', 'Fully free, included with Windows Server', 'يحتاج ترخيص Intune منفصل أو ضمن E3/E5', 'Needs a separate Intune license or E3/E5 bundle', 9, 5),
      spec('إدارة أجهزة خارج الشبكة المحلية', 'Managing devices outside the local network', 'محدودة جدًا بدون VPN', 'Very limited without a VPN', 'مصمم أصلًا لإدارة الأجهزة من أي مكان', 'Built specifically to manage devices from anywhere', 3, 9),
      spec('التحكم الدقيق في توقيت النشر', 'Fine-grained deployment timing control', 'تحكم جيد عبر مجموعات وحلقات نشر', 'Good control via deployment rings and groups', 'تحكم أعمق وأكثر مرونة عبر السياسات السحابية', 'Deeper, more flexible control via cloud policies', 7, 9),
    ],
    verdictAr: 'WSUS منطقي جدًا لبيئة صغيرة كل الأجهزة فيها داخل الشبكة المحلية دايمًا. Intune ضروري فعليًا لو عندك أجهزة بعيدة أو خليط من أنواع الأجهزة والمنصات.',
    verdictEn: 'WSUS makes strong sense for a small environment where all devices are always on the local network. Intune is genuinely necessary if you have remote devices or a mix of device types and platforms.',
  },
];

export function generateComparisons({ count = COMPARISON_CONTENT.length, subcategory, startIndex = 0 } = {}) {
  let pool = COMPARISON_CONTENT;
  if (subcategory) pool = pool.filter((c) => c.sub === subcategory);
  if (!pool.length) {
    console.warn('[comparisons] No real content for this filter — refusing generic filler.');
    return [];
  }

  const items = [];
  const safeCount = Math.min(count, pool.length - startIndex);
  if (count > pool.length - startIndex) {
    console.warn(`[comparisons] Requested ${count}, but only ${pool.length} real comparisons exist — capping at ${Math.max(safeCount, 0)} instead of duplicating with (2)/(3) suffixes.`);
  }
  for (let i = 0; i < safeCount; i++) {
    const abs = startIndex + i;
    const row = pool[abs % pool.length];
    const cycle = Math.floor(abs / pool.length) + 1;
    const { d1, d2, img1, img2 } = row;
    const sub = assertSubcategory('comparisons', row.sub);

    const titleEn = cycle > 1 ? `${d1} vs ${d2} (${cycle})` : `${d1} vs ${d2}`;
    const titleAr = cycle > 1 ? `${d1} ضد ${d2} (${cycle})` : `${d1} ضد ${d2}`;

    const wins1 = row.specs.filter((s) => s.winner === 1).length;
    const wins2 = row.specs.filter((s) => s.winner === 2).length;
    const overallWinner = wins1 === wins2 ? 0 : wins1 > wins2 ? 1 : 2;

    const images = resolveComparisonImages({
      device1Name: d1, device2Name: d2, img1, img2, subcategoryId: sub,
    });

    items.push({
      id: `cmp-gen-${String(abs + 1).padStart(4, '0')}`,
      slug: uniqueSlug(cycle > 1 ? `${d1}-vs-${d2}-${cycle}` : `${d1}-vs-${d2}`),
      title: bi(titleAr, titleEn),
      excerpt: bi(row.verdictAr.slice(0, 120), row.verdictEn.slice(0, 140)),
      device1Name: d1,
      device2Name: d2,
      device1Image: images.device1Image,
      device2Image: images.device2Image,
      date: distributedDate(abs, Math.max(count + startIndex, 1)),
      categoryId: 'comparisons',
      subcategoryId: sub,
      heroImage: images.heroImage,
      overallWinner,
      specs: Object.fromEntries(row.specs.map((s, idx) => [`spec${idx + 1}`, s])),
      verdict: bi(row.verdictAr, row.verdictEn),
    });
  }
  return items;
}
