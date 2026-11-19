import { body } from '../md.mjs';
export default {
  slug: "stp-loop-broadcast-storm-troubleshooting",
  heroFrom: "snmp-monitoring-basics",
  categoryId: "howto", subcategoryId: "guides-tips",
  tags: ["stp", "spanning-tree", "broadcast-storm", "cisco", "switching"],
  domainIds: ["networking", "troubleshooting"], topicIds: ["routing-switching", "network-troubleshooting"],
  contentType: "troubleshooting", vendorIds: [], productIds: [],
  title: { ar: "حل حلقات الشبكة وعواصف البث: STP وBPDU Guard وStorm Control", en: "Network Loops and Broadcast Storms: STP, BPDU Guard and Storm Control" },
  excerpt: {
    ar: "كيف تكتشف حلقة الطبقة الثانية من رسائل MACFLAP وارتفاع المعالج، وتعزلها بسرعة، ثم تمنع تكرارها بـPortFast وBPDU Guard وتحديد Root Bridge.",
    en: "Spot a Layer 2 loop from MAC flapping and CPU spikes, isolate it fast, then prevent repeats with PortFast, BPDU Guard, a fixed root bridge and storm control.",
  },
  body: body("stp-loop-broadcast-storm-troubleshooting"),
};
