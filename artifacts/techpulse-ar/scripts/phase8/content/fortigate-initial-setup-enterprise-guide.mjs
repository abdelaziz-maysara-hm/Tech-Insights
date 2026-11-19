import { body } from '../md.mjs';
export default {
  slug: 'fortigate-initial-setup-enterprise-guide',
  heroFrom: 'fortigate-ssl-vpn-checklist',
  categoryId: 'cybersecurity', subcategoryId: 'network-security',
  tags: ['fortigate', 'fortios', 'firewall', 'hardening', 'initial-setup'],
  domainIds: ['cybersecurity', 'networking'], topicIds: ['firewalls', 'network-security'],
  contentType: 'guide', vendorIds: ['fortinet'], productIds: ['fortigate'],
  title: { ar: 'إعداد FortiGate من الصفر لبيئة الشركات: خطوة بخطوة', en: 'FortiGate Initial Setup for Production: A Step-by-Step Build' },
  excerpt: {
    ar: 'من أول دخول إلى أول سياسة: تحديث FortiOS، تأمين واجهة الإدارة، الواجهات والمناطق، التوجيه، السياسات، ملفات الحماية، السجلات والنسخ الاحتياطي.',
    en: 'Take a new FortiGate from factory defaults to production: firmware path, admin lockdown, interfaces and zones, routing, policy design, logging and backups.',
  },
  body: body('fortigate-initial-setup-enterprise-guide'),
};
