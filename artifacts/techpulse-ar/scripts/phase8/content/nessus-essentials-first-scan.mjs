import { body } from '../md.mjs';
export default {
  slug: 'nessus-essentials-first-scan',
  heroFrom: 'vulnerability-scanning-vs-penetration-testing',
  categoryId: 'cybersecurity', subcategoryId: 'guides-tips',
  tags: ['nessus', 'vulnerability-scanning', 'tenable', 'credentialed-scan', 'lab'],
  domainIds: ['cybersecurity'], topicIds: ['vulnerability-management'],
  contentType: 'how-to', vendorIds: [], productIds: [],
  title: { ar: 'أول فحص ثغرات باستخدام Nessus Essentials: من التثبيت إلى قراءة التقرير', en: 'Your First Vulnerability Scan with Nessus Essentials' },
  excerpt: {
    ar: 'تثبيت Nessus Essentials المجاني، الفرق بين الفحص العادي والفحص بصلاحيات، تشغيل أول فحص بأمان، وقراءة النتائج وترتيب الإصلاح.',
    en: 'Install the free Nessus Essentials scanner, run an unauthenticated and a credentialed scan on lab hosts, and turn the results into a sensible fix list.',
  },
  body: body('nessus-essentials-first-scan'),
};
