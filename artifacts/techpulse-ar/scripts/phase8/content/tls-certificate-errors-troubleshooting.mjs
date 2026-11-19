import { body } from '../md.mjs';
export default {
  slug: "tls-certificate-errors-troubleshooting",
  heroFrom: "tls-handshake-explained",
  categoryId: "cybersecurity", subcategoryId: "network-security",
  tags: ["tls", "ssl", "certificates", "openssl", "troubleshooting"],
  domainIds: ["cybersecurity", "troubleshooting"], topicIds: ["pki-certificates"],
  contentType: "troubleshooting", vendorIds: [], productIds: [],
  title: { ar: "تشخيص أخطاء شهادات TLS: السلسلة الناقصة والاسم الخاطئ والانتهاء باستخدام openssl", en: "Troubleshooting TLS Certificate Errors with openssl s_client" },
  excerpt: {
    ar: "الأسباب الخمسة الأكثر شيوعًا لأخطاء الشهادات، وكيف تكشفها بالأمر openssl s_client مع ‎-servername و‎-showcerts، وطريقة الإصلاح لكل حالة.",
    en: "Diagnose the five most common certificate errors (missing chain, name mismatch, expiry, untrusted CA, clock) using openssl s_client and fix each one.",
  },
  body: body("tls-certificate-errors-troubleshooting"),
};
