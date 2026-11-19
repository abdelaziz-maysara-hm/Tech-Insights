import { body } from '../md.mjs';
export default {
  slug: 'microsoft-365-security-settings',
  heroFrom: 'enterprise-email-security-guide',
  categoryId: 'cybersecurity', subcategoryId: 'identity',
  tags: ['microsoft-365', 'entra-id', 'exchange-online', 'hardening', 'defender-for-office-365'],
  domainIds: ['cybersecurity'], topicIds: ['iam-pam', 'email-security', 'cloud'],
  contentType: 'guide', vendorIds: ['microsoft'], productIds: [],
  title: { ar: '15 إعدادًا أمنيًا في Microsoft 365 يجب ضبطها الآن', en: '15 Microsoft 365 Security Settings to Check Today' },
  excerpt: {
    ar: 'قائمة عملية بخمسة عشر إعدادًا في Microsoft 365 تغلق أكثر طرق الاختراق شيوعًا: الهوية والمسؤولين، البريد، المشاركة، والتدقيق، مع مكان كل إعداد.',
    en: 'Fifteen Microsoft 365 settings that shut the most common doors attackers use, grouped by identity, admin roles, email, sharing and auditing, with where to find each one.',
  },
  body: body('microsoft-365-security-settings'),
};
