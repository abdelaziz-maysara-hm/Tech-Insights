import { body } from '../md.mjs';
export default {
  slug: 'entra-conditional-access-baseline',
  heroFrom: 'active-directory-identity-security-guide',
  categoryId: 'cybersecurity', subcategoryId: 'identity',
  tags: ['entra-id', 'conditional-access', 'mfa', 'microsoft-365', 'identity', 'zero-trust'],
  domainIds: ['cybersecurity'], topicIds: ['iam-pam', 'zero-trust'],
  contentType: 'guide', vendorIds: ['microsoft'], productIds: [],
  title: { ar: 'سياسات Conditional Access الأساسية في Entra ID: البداية الصحيحة', en: 'A Baseline Conditional Access Policy Set for Microsoft Entra ID' },
  excerpt: {
    ar: 'مجموعة السياسات الأساسية التي تبدأ بها أي مؤسسة في Entra ID: MFA للمسؤولين والجميع، حظر المصادقة القديمة، حسابات الطوارئ، ووضع Report-only قبل التفعيل.',
    en: 'The Conditional Access policies every Entra ID tenant should start with: MFA for admins and users, legacy auth blocked, Azure management covered, break-glass accounts and a safe rollout.',
  },
  body: body('entra-conditional-access-baseline'),
};
