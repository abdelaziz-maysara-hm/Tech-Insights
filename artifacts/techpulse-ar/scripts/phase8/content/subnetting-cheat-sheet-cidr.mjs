import { body } from '../md.mjs';
export default {
  slug: "subnetting-cheat-sheet-cidr",
  heroFrom: "vlan-basics-why-segment",
  categoryId: "cybersecurity", subcategoryId: "network-security",
  tags: ["subnetting", "cidr", "ipv4", "networking", "cheat-sheet"],
  domainIds: ["networking"], topicIds: ["routing-switching", "dhcp-ipam"],
  contentType: "reference", vendorIds: [], productIds: [],
  title: { ar: "مرجع تقسيم الشبكات CIDR: جدول البادئات وحيلة حجم الكتلة بسرعة", en: "Subnetting Cheat Sheet: CIDR Prefixes, Masks and the Block-Size Trick" },
  excerpt: {
    ar: "جدول كامل للبادئات من /8 إلى /32 مع الأقنعة وعدد الأجهزة، وطريقة حساب الشبكة الفرعية ذهنيًا في ثوانٍ، ونطاقات RFC 1918 الخاصة.",
    en: "A printable CIDR table from /8 to /32 with masks and host counts, a mental block-size method for subnetting in seconds, and the RFC 1918 private ranges.",
  },
  body: body("subnetting-cheat-sheet-cidr"),
};
