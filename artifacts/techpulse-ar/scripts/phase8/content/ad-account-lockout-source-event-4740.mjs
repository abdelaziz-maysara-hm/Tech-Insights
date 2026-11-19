import { body } from '../md.mjs';
export default {
  slug: "ad-account-lockout-source-event-4740",
  heroFrom: "windows-security-event-ids-soc",
  categoryId: "windows", subcategoryId: "guides-tips",
  tags: ["active-directory", "account-lockout", "event-4740", "powershell", "troubleshooting"],
  domainIds: ["infrastructure", "troubleshooting"], topicIds: ["active-directory", "iam-pam"],
  contentType: "troubleshooting", vendorIds: ["microsoft"], productIds: [],
  title: { ar: "تتبع مصدر قفل حسابات Active Directory عبر الحدث 4740 خطوة بخطوة", en: "Find the Source of AD Account Lockouts with Event 4740 and PowerShell" },
  excerpt: {
    ar: "كيف تجد الجهاز الذي يقفل حساب المستخدم: الاستعلام من PDC Emulator عن الحدث 4740، أكواد الفشل 4625 و4771، والأسباب الشائعة مثل كلمات المرور المحفوظة.",
    en: "Locate the device locking a user out: query the PDC emulator for event 4740, decode 4625 and 4771 failures, and clear stale saved credentials and spraying.",
  },
  body: body("ad-account-lockout-source-event-4740"),
};
