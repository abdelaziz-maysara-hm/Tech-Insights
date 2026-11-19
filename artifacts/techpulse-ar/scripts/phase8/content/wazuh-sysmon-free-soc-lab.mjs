import { body } from '../md.mjs';
export default {
  slug: 'wazuh-sysmon-free-soc-lab',
  heroFrom: 'how-siem-actually-works',
  categoryId: 'cybersecurity', subcategoryId: 'guides-tips',
  tags: ['wazuh', 'sysmon', 'soc', 'lab', 'siem', 'detection'],
  domainIds: ['cybersecurity'], topicIds: ['siem-soc', 'threat-detection', 'endpoint-security'],
  contentType: 'how-to', vendorIds: ['microsoft'], productIds: [],
  title: { ar: 'مختبر SOC مجاني في البيت باستخدام Wazuh وSysmon', en: 'Build a Free Home SOC Lab with Wazuh and Sysmon' },
  excerpt: {
    ar: 'خطوات بناء مختبر مراقبة أمنية مجاني: خادم Wazuh، وكيل على Windows مع Sysmon، توليد أحداث هجوم آمنة، وقراءة التنبيهات كما يفعل محلل SOC.',
    en: 'Stand up Wazuh, ship Sysmon telemetry from a Windows VM, fire safe attack simulations and practise triage like a SOC analyst, all on free software.',
  },
  body: body('wazuh-sysmon-free-soc-lab'),
};
