import { body } from '../md.mjs';
export default {
  slug: "email-header-analysis-phishing",
  heroFrom: "phishing-spot-before-click",
  categoryId: "cybersecurity", subcategoryId: "guides-tips",
  tags: ["email", "phishing", "headers", "spf", "dmarc"],
  domainIds: ["cybersecurity"], topicIds: ["email-security"],
  contentType: "how-to", vendorIds: [], productIds: [],
  title: { ar: "تحليل رأس البريد الإلكتروني لكشف التصيد: From وReturn-Path وAuthentication-Results", en: "Email Header Analysis for Phishing: Reading Received and Auth Results" },
  excerpt: {
    ar: "اقرأ رأس الرسالة المشبوهة كمحلل: الفرق بين From وReply-To وReturn-Path، تتبع سطور Received، وتفسير نتائج SPF وDKIM وDMARC.",
    en: "Read a suspicious message like an analyst: From vs Reply-To vs Return-Path, tracing Received lines, and interpreting SPF, DKIM and DMARC verdicts.",
  },
  body: body("email-header-analysis-phishing"),
};
