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
    d1: 'Windows RDS', d2: 'Citrix Virtual Apps', sub: 'network-security', img1: 'server', img2: 'cloud',
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
    d1: 'Veeam Backup & Replication', d2: 'Acronis Cyber Protect', sub: 'network-security', img1: 'storage', img2: 'security',
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
