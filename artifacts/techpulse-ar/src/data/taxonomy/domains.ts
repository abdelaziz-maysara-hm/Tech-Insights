import type { DomainDef } from './types';

/**
 * Primary domains for NetSec Atlas navigation and discovery.
 * Independent of legacy CMS categoryId values.
 */
export const DOMAINS: DomainDef[] = [
  {
    id: 'troubleshooting',
    label: { ar: 'استكشاف الأخطاء وإصلاحها', en: 'Troubleshooting' },
    shortLabel: { ar: 'استكشاف الأعطال', en: 'Troubleshooting' },
    description: {
      ar: 'حلول عملية لمشاكل الشبكات والأمن والأنظمة',
      en: 'Practical fixes for network, security and systems problems',
    },
    navOrder: 1,
    showInPrimaryNav: true,
    route: '/troubleshooting',
  },
  {
    id: 'cybersecurity',
    label: { ar: 'الأمن السيبراني', en: 'Cybersecurity' },
    shortLabel: { ar: 'الأمن', en: 'Security' },
    description: {
      ar: 'أمن الشبكات، نقاط النهاية، الهوية، والكشف عن التهديدات',
      en: 'Network, endpoint, identity and threat detection security',
    },
    navOrder: 2,
    showInPrimaryNav: true,
    route: '/domain/cybersecurity',
  },
  {
    id: 'networking',
    label: { ar: 'الشبكات', en: 'Networking' },
    shortLabel: { ar: 'الشبكات', en: 'Networking' },
    description: {
      ar: 'الجدران النارية، VPN، التوجيه، DNS، والوصول إلى الشبكة',
      en: 'Firewalls, VPN, routing, DNS and network access',
    },
    navOrder: 3,
    showInPrimaryNav: true,
    route: '/domain/networking',
  },
  {
    id: 'infrastructure',
    label: { ar: 'البنية التحتية', en: 'Infrastructure' },
    shortLabel: { ar: 'البنية', en: 'Infra' },
    description: {
      ar: 'خوادم ويندوز، Active Directory، لينكس، الافتراضية والسحابة',
      en: 'Windows Server, Active Directory, Linux, virtualization and cloud',
    },
    navOrder: 4,
    showInPrimaryNav: true,
    route: '/domain/infrastructure',
  },
  {
    id: 'tools',
    label: { ar: 'الأدوات', en: 'Tools' },
    shortLabel: { ar: 'الأدوات', en: 'Tools' },
    description: {
      ar: 'أدوات هندسية للشبكات والأمن والعمليات',
      en: 'Engineering tools for networking, security and operations',
    },
    navOrder: 5,
    showInPrimaryNav: true,
    route: '/tools',
  },
  {
    id: 'vendors',
    label: { ar: 'الشركات والمنتجات', en: 'Vendors' },
    shortLabel: { ar: 'البائعون', en: 'Vendors' },
    description: {
      ar: 'مراكز معرفة للمنتجات والموردين الاحترافيين',
      en: 'Knowledge hubs for professional products and vendors',
    },
    navOrder: 6,
    showInPrimaryNav: true,
    route: '/vendors',
  },
  {
    id: 'comparisons',
    label: { ar: 'المقارنات', en: 'Comparisons' },
    shortLabel: { ar: 'مقارنات', en: 'Compare' },
    description: {
      ar: 'مقارنات احترافية لقرارات الشراء والبنية',
      en: 'Professional comparisons for purchasing and architecture decisions',
    },
    navOrder: 7,
    showInPrimaryNav: true,
    route: '/comparisons',
  },
  {
    id: 'guides',
    label: { ar: 'الأدلة والشروحات', en: 'Guides' },
    shortLabel: { ar: 'أدلة', en: 'Guides' },
    description: {
      ar: 'أدلة التكوين والنشر والشروحات العملية',
      en: 'Configuration, deployment and practical how-to guides',
    },
    navOrder: 8,
    showInPrimaryNav: true,
    route: '/guides',
  },
];

export const DOMAINS_BY_ID = Object.fromEntries(DOMAINS.map((d) => [d.id, d])) as Record<
  string,
  DomainDef
>;

export function getPrimaryNavDomains(): DomainDef[] {
  return DOMAINS.filter((d) => d.showInPrimaryNav).sort((a, b) => a.navOrder - b.navOrder);
}
