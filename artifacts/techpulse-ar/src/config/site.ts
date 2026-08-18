/**
 * NetSec Atlas — central site brand & domain configuration.
 */
export const SITE = {
  name: 'NetSec Atlas',
  shortName: 'NSA',
  url: 'https://netsecatlas.com',
  taglineEn: 'Practical Network, Security & IT Knowledge',
  taglineAr: 'معرفة عملية في الشبكات والأمن وتقنية المعلومات',
  descriptionEn:
    'Practical network, security and IT knowledge for cybersecurity professionals, network engineers, system administrators and infrastructure teams. Troubleshooting, guides, comparisons and professional tools.',
  descriptionAr:
    'معرفة عملية في الشبكات والأمن وتقنية المعلومات لمتخصصي الأمن السيبراني ومهندسي الشبكات ومسؤولي الأنظمة وفرق البنية التحتية. استكشاف الأعطال، أدلة عملية، مقارنات وأدوات احترافية.',
  defaultAuthorEn: 'NetSec Atlas',
  defaultAuthorAr: 'NetSec Atlas',
  organization: {
    name: 'NetSec Atlas',
    url: 'https://netsecatlas.com',
    description:
      'Practical Network, Security & IT Knowledge — technical resources for network, security and infrastructure engineers.',
  },
} as const;

export type SiteConfig = typeof SITE;

export function siteUrl(path = ''): string {
  if (!path || path === '/') return SITE.url;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${p}`;
}
