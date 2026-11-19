import { body } from '../md.mjs';
export default {
  slug: "fortigate-debug-flow-troubleshooting",
  heroFrom: "fortigate-initial-setup-enterprise-guide",
  categoryId: "cybersecurity", subcategoryId: "network-security",
  tags: ["fortigate", "debug-flow", "troubleshooting", "firewall", "sniffer"],
  domainIds: ["networking", "troubleshooting"], topicIds: ["firewalls", "network-troubleshooting"],
  contentType: "troubleshooting", vendorIds: ["fortinet"], productIds: [],
  title: { ar: "تشخيص FortiGate بأمر debug flow: لماذا تُسقط الحركة وكيف تقرأ المخرجات", en: "FortiGate Debug Flow: Find Why Traffic Is Dropped, Step by Step" },
  excerpt: {
    ar: "تسلسل أوامر diagnose debug flow الصحيح، تفسير رسائل المخرجات مثل policy 0، تأثير تسريع NP6 وNP7، واستخدام sniffer لتأكيد مسار الحزم.",
    en: "The correct diagnose debug flow sequence, how to read its messages (policy 0 means implicit deny), the NP offload caveat, and confirming paths with the sniffer.",
  },
  body: body("fortigate-debug-flow-troubleshooting"),
};
