import { body } from '../md.mjs';
export default {
  slug: 'wazuh-custom-rule-brute-force',
  heroFrom: 'how-siem-actually-works',
  categoryId: 'cybersecurity', subcategoryId: 'guides-tips',
  tags: ['wazuh', 'detection-engineering', 'brute-force', 'ssh', 'rdp', 'siem'],
  domainIds: ['cybersecurity'], topicIds: ['siem-soc', 'threat-detection'],
  contentType: 'how-to', vendorIds: [], productIds: [],
  title: { ar: 'كتابة قاعدة Wazuh مخصصة لكشف هجمات التخمين (Brute Force)', en: 'Writing a Custom Wazuh Rule to Catch Brute-Force Logins' },
  excerpt: {
    ar: 'كيف تكتب قاعدة ترابط في Wazuh لكشف محاولات تخمين كلمات المرور على SSH وRDP بعتبة تناسب بيئتك، وتختبرها بـwazuh-logtest، وتربطها بالاستجابة التلقائية.',
    en: 'Build correlation rules in Wazuh that flag SSH and RDP password guessing at thresholds that fit your environment, test them with wazuh-logtest and wire them to active response.',
  },
  body: body('wazuh-custom-rule-brute-force'),
};
