import { body } from '../md.mjs';
export default {
  slug: "ssh-hardening-linux-servers",
  heroFrom: "secure-remote-work-checklist",
  categoryId: "cybersecurity", subcategoryId: "endpoint",
  tags: ["ssh", "linux", "hardening", "sshd-config", "keys"],
  domainIds: ["cybersecurity", "infrastructure"], topicIds: ["endpoint-security", "iam-pam"],
  contentType: "how-to", vendorIds: [], productIds: [],
  title: { ar: "تقوية SSH على خوادم لينكس: المفاتيح والإعدادات الآمنة دون أن تُغلق على نفسك", en: "SSH Hardening for Linux Servers: Keys, sshd_config and Safe Rollout" },
  excerpt: {
    ar: "إعدادات sshd_config الأهم، مفاتيح ed25519 والمفاتيح المادية، قاعدة أول قيمة تفوز في sshd_config.d، والاختبار بـsshd -t قبل إعادة التشغيل.",
    en: "Harden OpenSSH safely: ed25519 and hardware-backed keys, the key sshd_config settings, the first-value-wins rule in sshd_config.d, and testing with sshd -t.",
  },
  body: body("ssh-hardening-linux-servers"),
};
