import { body } from '../md.mjs';
export default {
  slug: "ip-address-conflict-troubleshooting",
  heroFrom: "dhcp-failover-high-availability",
  categoryId: "howto", subcategoryId: "guides-tips",
  tags: ["ip-conflict", "dhcp", "arp", "dhcp-snooping", "troubleshooting"],
  domainIds: ["networking", "troubleshooting"], topicIds: ["dhcp-ipam", "network-troubleshooting"],
  contentType: "troubleshooting", vendorIds: ["microsoft"], productIds: [],
  title: { ar: "حل تعارض عناوين IP: كيف تجد الجهاز المكرر وتمنع المشكلة", en: "IP Address Conflict Troubleshooting: Find the Duplicate and Stop Repeats" },
  excerpt: {
    ar: "من الحدث 4199 في ويندوز إلى عنوان MAC ومنفذ المحول وسجلات DHCP، ثم الإصلاح بالحجوزات وDHCP Snooping وDynamic ARP Inspection.",
    en: "Go from Windows event 4199 to the other MAC, switch port and DHCP lease, then fix it for good with reservations, DHCP snooping and Dynamic ARP Inspection.",
  },
  body: body("ip-address-conflict-troubleshooting"),
};
