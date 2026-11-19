import { body } from '../md.mjs';
export default {
  slug: 'mitre-attack-to-detections',
  heroFrom: 'how-siem-actually-works',
  categoryId: 'cybersecurity', subcategoryId: 'concepts',
  tags: ['mitre-attack', 'detection-engineering', 'soc', 'sigma', 'siem'],
  domainIds: ['cybersecurity'], topicIds: ['siem-soc', 'threat-detection'],
  contentType: 'guide', vendorIds: ['microsoft'], productIds: [],
  title: { ar: 'من MITRE ATT&CK إلى قواعد كشف فعلية: منهج عملي لفرق SOC', en: 'Turning MITRE ATT&CK into Working Detections: A Practical Method' },
  excerpt: {
    ar: 'كيف تختار تقنيات ATT&CK المهمة لبيئتك، وتربطها بمصادر السجلات، وتكتب قاعدة كشف وتختبرها، وتتابع التغطية دون أن تتحول المصفوفة إلى لوحة ألوان بلا معنى.',
    en: 'Pick the ATT&CK techniques that matter to you, map them to the logs you actually have, write and test detections, and track coverage honestly instead of colouring in a matrix.',
  },
  body: body('mitre-attack-to-detections'),
};
