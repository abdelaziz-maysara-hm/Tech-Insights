import { body } from '../md.mjs';
export default {
  slug: "common-network-ports-cheat-sheet",
  heroFrom: "firewall-misconfigurations-audit",
  categoryId: "cybersecurity", subcategoryId: "network-security",
  tags: ["ports", "tcp", "udp", "firewall", "cheat-sheet"],
  domainIds: ["networking", "cybersecurity"], topicIds: ["firewalls", "network-security"],
  contentType: "reference", vendorIds: [], productIds: [],
  title: { ar: "مرجع منافذ الشبكة الشائعة TCP وUDP وكيف تعرف ما يستمع على جهازك", en: "Common Network Ports Cheat Sheet: TCP/UDP Numbers Admins Should Know" },
  excerpt: {
    ar: "جداول المنافذ الأكثر استخدامًا للويب والبريد والدليل النشط والإدارة عن بعد وقواعد البيانات، مع أوامر كشف المنافذ المفتوحة على ويندوز ولينكس.",
    en: "The ports you meet daily, grouped by web, mail, Active Directory, remote admin and databases, plus commands to list listening ports on Windows and Linux.",
  },
  body: body("common-network-ports-cheat-sheet"),
};
