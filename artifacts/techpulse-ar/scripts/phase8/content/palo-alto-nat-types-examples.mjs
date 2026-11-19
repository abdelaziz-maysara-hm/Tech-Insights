import { body } from '../md.mjs';
export default {
  slug: 'palo-alto-nat-types-examples',
  heroFrom: 'palo-alto-security-policy-basics',
  categoryId: 'cybersecurity', subcategoryId: 'network-security',
  tags: ['palo-alto', 'pan-os', 'nat', 'firewall', 'dnat', 'snat'],
  domainIds: ['cybersecurity', 'networking'], topicIds: ['firewalls', 'network-security'],
  contentType: 'guide', vendorIds: ['palo-alto'], productIds: ['pan-os'],
  title: { ar: 'أنواع NAT في Palo Alto بأمثلة عملية: Source وDestination وU-Turn', en: 'Palo Alto NAT Explained with Worked Examples (SNAT, DNAT, U-Turn)' },
  excerpt: {
    ar: 'شرح أنواع NAT في PAN-OS بأمثلة: DIPP للإنترنت، Static للخوادم، Destination NAT للنشر، وU-Turn، مع القاعدة الذهبية لربط NAT بسياسة الأمان.',
    en: 'Worked PAN-OS NAT examples: DIPP for outbound, static and destination NAT for published servers, U-turn hairpinning, and the pre-NAT/post-NAT rule that trips everyone up.',
  },
  body: body('palo-alto-nat-types-examples'),
};
