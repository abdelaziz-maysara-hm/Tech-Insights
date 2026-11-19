import { body } from '../md.mjs';
export default {
  slug: 'company-email-spam-spf-dmarc-diagnosis',
  heroFrom: 'spf-dkim-dmarc-email-basics',
  categoryId: 'cybersecurity', subcategoryId: 'guides-tips',
  tags: ['email', 'spf', 'dkim', 'dmarc', 'deliverability', 'troubleshooting'],
  domainIds: ['cybersecurity', 'troubleshooting'], topicIds: ['email-security', 'dns'],
  contentType: 'troubleshooting', vendorIds: ['microsoft'], productIds: [],
  title: { ar: 'لماذا يصل بريد شركتك إلى Spam؟ تشخيص SPF وDKIM وDMARC خطوة بخطوة', en: 'Why Your Company Email Goes to Spam: Diagnosing SPF, DKIM and DMARC' },
  excerpt: {
    ar: 'طريقة منهجية لمعرفة سبب وصول رسائل شركتك إلى البريد المزعج: قراءة رأس Authentication-Results، فحص SPF وDKIM وDMARC، السمعة، ومتطلبات Gmail وMicrosoft.',
    en: 'A methodical way to find out why your mail lands in junk: read Authentication-Results, test SPF, DKIM and DMARC alignment, check reputation, and meet Gmail and Outlook sender rules.',
  },
  body: body('company-email-spam-spf-dmarc-diagnosis'),
};
