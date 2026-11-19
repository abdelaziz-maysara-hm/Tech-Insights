/**
 * Off-audience items repositioned for the security/IT audience (phase 8).
 * chatgpt-vs-claude is redirected instead (see src/config/content-redirects.json).
 */
import { body } from './md.mjs';

export const REPURPOSE_ARTICLES = [
  {
    slug: 'printer-not-working-fixes',
    categoryId: 'windows', subcategoryId: 'guides-tips',
    tags: ['printing', 'print-spooler', 'printnightmare', 'troubleshooting', 'windows-server'],
    domainIds: ['infrastructure', 'troubleshooting'], topicIds: ['windows-server', 'network-troubleshooting'],
    contentType: 'troubleshooting', vendorIds: ['microsoft'], productIds: ['windows-server'],
    title: {
      ar: 'استكشاف أعطال الطباعة في الشركات وتأمينها: Spooler والتعريفات والطابعات الشبكية',
      en: 'Office Printing for IT Teams: Spooler, Drivers, Network Printers and PrintNightmare',
    },
    excerpt: {
      ar: 'منهج لمحترفي الدعم: تحديد نطاق العطل، خدمة Print Spooler، الطابعات الشبكية، سياسات Point and Print بعد PrintNightmare، وتعطيل الخدمة حيث لا حاجة لها.',
      en: 'A support-desk method for office printing problems that also closes the security gaps: spooler fixes, network printers, Point and Print after PrintNightmare, and where to disable the service.',
    },
    body: body('printer-not-working-fixes'),
  },
];

const v = (ar, en) => ({ ar, en });
export const REPURPOSE_COMPARISONS = [
  {
    slug: 'thinkpad-x1-vs-hp-elitebook',
    fields: {
      title: v('ThinkPad X1 ضد HP EliteBook لأسطول الشركة: مقارنة من زاوية الأمن والإدارة', 'ThinkPad X1 vs HP EliteBook for a Corporate Fleet: Security and Manageability'),
      excerpt: v(
        'مقارنة لفرق تقنية المعلومات: حماية البرامج الثابتة، إدارة BIOS عن بُعد، تحديث التعريفات على نطاق واسع، والدعم. الفرق الحقيقي في أدوات الإدارة وعقد الدعم أكثر من العتاد.',
        'A fleet-buyer comparison for IT and security teams: firmware protection, remote BIOS management, driver updates at scale and support. Tooling and the support contract matter more than the chassis.',
      ),
      overallWinner: 0,
      specs: {
        spec1: {
          label: v('حماية البرامج الثابتة (Firmware)', 'Firmware protection'),
          device1Value: v('ضمن حزمة Lenovo ThinkShield، مع BIOS قادر على التعافي الذاتي في الطرز التجارية', 'Part of Lenovo ThinkShield, with self-healing BIOS on commercial models'),
          device2Value: v('HP Sure Start ضمن HP Wolf Security لاكتشاف تلف BIOS واستعادته', 'HP Sure Start (HP Wolf Security) detects and recovers a corrupted BIOS'),
          device1Score: 8, device2Score: 8, winner: 0,
        },
        spec2: {
          label: v('إدارة إعدادات BIOS عن بُعد', 'Remote BIOS configuration'),
          device1Value: v('عبر WMI وأدوات Lenovo للمسؤولين، وتكامل مع Intune وأدوات النشر', 'Via WMI and Lenovo admin tooling, integrates with Intune and deployment tools'),
          device2Value: v('عبر HP BIOS Configuration Utility وأدوات HP للإدارة، مع تكامل مع Intune', 'Via HP BIOS Configuration Utility and HP manageability tools, integrates with Intune'),
          device1Score: 8, device2Score: 8, winner: 0,
        },
        spec3: {
          label: v('تحديث التعريفات والـBIOS على نطاق واسع', 'Driver and BIOS updates at scale'),
          device1Value: v('أدوات Lenovo التجارية (مثل Commercial Vantage وSystem Update) وحزم تحديث لأدوات النشر', 'Lenovo commercial tools (Commercial Vantage, System Update) and update packs for deployment tools'),
          device2Value: v('HP Image Assistant وحزم التعريفات لأدوات النشر', 'HP Image Assistant and driver packs for deployment tools'),
          device1Score: 8, device2Score: 8, winner: 0,
        },
        spec4: {
          label: v('ما يجب اشتراطه في أي طراز', 'Non-negotiables for either model'),
          device1Value: v('TPM 2.0 وSecure Boot وBitLocker، ودعم Windows Hello for Business، ومعالج بميزات إدارة إن احتجتها', 'TPM 2.0, Secure Boot, BitLocker, Windows Hello for Business support, and vPro-class manageability if you need it'),
          device2Value: v('المتطلبات نفسها؛ تحقق منها في مواصفات الطراز المحدد وليس السلسلة', 'Same list; verify it per SKU, not per product line'),
          device1Score: 8, device2Score: 8, winner: 0,
        },
      },
      verdict: v(
        'من زاوية الأمن والإدارة الطرازان متقاربان جدًا: كلاهما يوفر حماية للبرامج الثابتة وأدوات لإدارة BIOS وتحديثه عن بُعد. اختر حسب أدوات الإدارة التي يعرفها فريقك وعقد الدعم المحلي، ثم اشترط TPM 2.0 وتشفير BitLocker وتكامل Intune في كل طراز. راجع أيضًا دليل BitLocker لدينا.',
        'For security and manageability the two are very close: both offer firmware protection plus remote BIOS and update tooling. Choose on the management tools your team already runs and local support terms, then require TPM 2.0, BitLocker and Intune integration on every SKU. See our BitLocker guide for the encryption side.',
      ),
    },
  },
];
