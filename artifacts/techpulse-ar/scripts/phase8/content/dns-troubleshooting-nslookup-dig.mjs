import { body } from '../md.mjs';
export default {
  slug: "dns-troubleshooting-nslookup-dig",
  heroFrom: "dns-security-filtering-dnssec",
  categoryId: "howto", subcategoryId: "guides-tips",
  tags: ["dns", "nslookup", "dig", "resolve-dnsname", "troubleshooting"],
  domainIds: ["networking", "troubleshooting"], topicIds: ["dns", "network-troubleshooting"],
  contentType: "troubleshooting", vendorIds: [], productIds: [],
  title: { ar: "تشخيص مشكلات DNS باستخدام nslookup وdig وResolve-DnsName", en: "DNS Troubleshooting with nslookup, dig and Resolve-DnsName" },
  excerpt: {
    ar: "منهجية عملية لحل مشكلات أسماء النطاقات: اختبار خادم محدد، تتبع التفويض بـdig +trace، وتفسير أكواد الاستجابة مثل NXDOMAIN وSERVFAIL.",
    en: "A practical method for name-resolution problems: query a specific server, follow delegation with dig +trace, and decode NXDOMAIN, SERVFAIL and REFUSED.",
  },
  body: body("dns-troubleshooting-nslookup-dig"),
};
