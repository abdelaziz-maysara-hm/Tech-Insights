import { body } from '../md.mjs';
export default {
  slug: 'ipsec-site-to-site-fortigate-palo-alto',
  heroFrom: 'vpn-basics-what-it-does',
  categoryId: 'cybersecurity', subcategoryId: 'vpn-remote',
  tags: ['ipsec', 'site-to-site', 'fortigate', 'palo-alto', 'ikev2', 'vpn'],
  domainIds: ['cybersecurity', 'networking'], topicIds: ['vpn', 'firewalls'],
  contentType: 'how-to', vendorIds: ['fortinet', 'palo-alto'], productIds: ['fortigate', 'pan-os'],
  title: { ar: 'نفق IPsec بين FortiGate وPalo Alto: إعداد كامل واستكشاف الأعطال', en: 'Site-to-Site IPsec Between FortiGate and Palo Alto: Build and Troubleshoot' },
  excerpt: {
    ar: 'إعداد نفق IPsec IKEv2 قائم على التوجيه بين FortiGate وPalo Alto: جدول المعاملات المشتركة، الإعداد على الطرفين، Proxy-ID، وأوامر التشخيص.',
    en: 'A route-based IKEv2 tunnel between FortiOS and PAN-OS: a shared parameter sheet, both configurations, proxy-ID pitfalls and the debug commands that find the fault.',
  },
  body: body('ipsec-site-to-site-fortigate-palo-alto'),
};
