import { body } from '../md.mjs';
export default {
  slug: 'firewall-misconfigurations-audit',
  heroFrom: 'network-segmentation-compliance',
  categoryId: 'cybersecurity', subcategoryId: 'network-security',
  tags: ['firewall', 'audit', 'misconfiguration', 'rulebase', 'hardening'],
  domainIds: ['cybersecurity', 'networking'], topicIds: ['firewalls', 'network-security'],
  contentType: 'guide', vendorIds: ['fortinet', 'palo-alto'], productIds: ['fortigate', 'pan-os'],
  title: { ar: 'أخطاء إعداد الجدران النارية الأكثر شيوعًا وكيف تراجعها', en: 'Common Firewall Misconfigurations and How to Audit for Them' },
  excerpt: {
    ar: 'عشرة أخطاء نجدها في مراجعات الجدران النارية: قواعد any-any، قواعد ظل وغير مستخدمة، إدارة مكشوفة، غياب التسجيل وتصفية الخروج، ومنهج مراجعة ربع سنوي عملي.',
    en: 'Ten firewall mistakes that show up in almost every audit, from any-any rules and exposed admin interfaces to missing egress filtering, plus a quarterly review routine that catches them.',
  },
  body: body('firewall-misconfigurations-audit'),
};
