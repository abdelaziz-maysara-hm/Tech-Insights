import { body } from '../md.mjs';
export default {
  slug: "secure-rdp-brute-force-protection",
  heroFrom: "rdp-multi-user-rds-licensing",
  categoryId: "windows", subcategoryId: "guides-tips",
  tags: ["rdp", "brute-force", "remote-desktop", "hardening", "windows"],
  domainIds: ["cybersecurity", "infrastructure"], topicIds: ["windows-server", "zero-trust", "endpoint-security"],
  contentType: "how-to", vendorIds: ["microsoft"], productIds: [],
  title: { ar: "حماية RDP من هجمات التخمين: سبع ضوابط عملية لخوادم ويندوز", en: "Protect RDP from Brute-Force Attacks: Seven Practical Controls" },
  excerpt: {
    ar: "لماذا يُعد RDP المكشوف على الإنترنت هدفًا دائمًا، وكيف تحميه بالـVPN أو ZTNA وNLA والقفل والمراقبة، مع قائمة تدقيق ومراجعة بعد التعرّض.",
    en: "Why internet-exposed RDP gets hammered and how to lock it down with VPN or ZTNA, NLA, lockout policy, MFA and monitoring, plus a checklist and exposure review.",
  },
  body: body("secure-rdp-brute-force-protection"),
};
