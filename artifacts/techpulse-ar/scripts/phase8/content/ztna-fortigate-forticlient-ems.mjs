import { body } from '../md.mjs';
export default {
  slug: 'ztna-fortigate-forticlient-ems',
  heroFrom: 'zero-trust-explained-practically',
  categoryId: 'cybersecurity', subcategoryId: 'vpn-remote',
  tags: ['ztna', 'zero-trust', 'fortigate', 'forticlient-ems', 'remote-access'],
  domainIds: ['cybersecurity', 'networking'], topicIds: ['zero-trust', 'vpn'],
  contentType: 'guide', vendorIds: ['fortinet'], productIds: ['fortigate', 'forticlient-ems'],
  title: { ar: 'تطبيق ZTNA باستخدام FortiGate وFortiClient EMS: من التصميم إلى أول سياسة', en: 'Deploying ZTNA with FortiGate and FortiClient EMS' },
  excerpt: {
    ar: 'كيف يعمل ZTNA عند Fortinet: دور EMS والشهادات ووسوم الحالة الأمنية، إعداد ZTNA Server وسياسة الوصول على FortiGate، وخطة الانتقال من VPN.',
    en: 'How Fortinet ZTNA fits together: EMS certificates and posture tags, the FortiGate access proxy and policy, a first protected app, and a sane migration path off VPN.',
  },
  body: body('ztna-fortigate-forticlient-ems'),
};
