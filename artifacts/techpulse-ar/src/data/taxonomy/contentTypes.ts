import type { ContentTypeDef } from './types';

export const CONTENT_TYPES: ContentTypeDef[] = [
  {
    id: 'troubleshooting',
    label: { ar: 'استكشاف أخطاء', en: 'Troubleshooting' },
    description: { ar: 'مشكلة، أعراض، تشخيص، وحل', en: 'Problem, symptoms, diagnosis and resolution' },
  },
  {
    id: 'guide',
    label: { ar: 'دليل', en: 'Guide' },
    description: { ar: 'شرح عملي شامل', en: 'Practical comprehensive guide' },
  },
  {
    id: 'how-to',
    label: { ar: 'كيف تفعل', en: 'How-To' },
    description: { ar: 'خطوات تنفيذ محددة', en: 'Specific implementation steps' },
  },
  {
    id: 'comparison',
    label: { ar: 'مقارنة', en: 'Comparison' },
    description: { ar: 'مقارنة احترافية بين حلول', en: 'Professional solution comparison' },
  },
  {
    id: 'reference',
    label: { ar: 'مرجع', en: 'Reference' },
    description: { ar: 'مرجع أوامر أو إعدادات', en: 'Command or configuration reference' },
  },
  {
    id: 'concept',
    label: { ar: 'مفهوم', en: 'Concept' },
    description: { ar: 'شرح مفهوم تقني', en: 'Technical concept explanation' },
  },
];

export const CONTENT_TYPES_BY_ID = Object.fromEntries(CONTENT_TYPES.map((c) => [c.id, c]));
