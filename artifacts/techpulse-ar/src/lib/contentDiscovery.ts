/**
 * Helpers to associate existing CMS content with the multi-dimensional taxonomy
 * without rewriting or duplicating articles.
 */
import type { ArticleListItem } from '@/data/mockData';
import {
  type DomainId,
  type ContentTypeId,
  TOPICS,
  getAllProducts,
  matchVendorsFromText,
  VENDORS_BY_ID,
} from '@/data/taxonomy';

/** Map legacy CMS categoryId → primary domain hints */
const LEGACY_CATEGORY_TO_DOMAIN: Record<string, DomainId[]> = {
  cybersecurity: ['cybersecurity'],
  windows: ['infrastructure'],
  howto: ['guides'],
  comparisons: ['comparisons'],
  technology: ['infrastructure', 'networking'],
  mobile: [],
  laptops: [],
  ai: [],
  reviews: [],
};

function articleSearchText(a: ArticleListItem): string {
  const tags = (a.tags ?? []).join(' ');
  return [
    a.title?.en,
    a.title?.ar,
    a.excerpt?.en,
    a.excerpt?.ar,
    tags,
    a.categoryId,
    a.subcategoryId,
    a.slug,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

/** Infer content type from title/tags/slug heuristics (non-destructive). */
export function inferContentType(a: ArticleListItem): ContentTypeId | undefined {
  if (a.contentType) return a.contentType;
  const t = articleSearchText(a);
  if (
    /troubleshoot|fix|error|failed|not working|issue|problem|استكشاف|خطأ|فشل|مشكلة/.test(t)
  ) {
    return 'troubleshooting';
  }
  if (/vs |versus|مقارنة|comparison/.test(t) || a.categoryId === 'comparisons') {
    return 'comparison';
  }
  if (/how to|how-to|step by step|تكوين|دليل|guide|setup|deploy/.test(t)) {
    return 'guide';
  }
  if (/what is|concept|explained|مفهوم/.test(t)) {
    return 'concept';
  }
  if (a.categoryId === 'howto') return 'how-to';
  return undefined;
}

export function inferDomains(a: ArticleListItem): DomainId[] {
  if (a.domainIds) return a.domainIds.filter((id): id is DomainId =>
    ['cybersecurity', 'networking', 'infrastructure', 'troubleshooting', 'tools', 'vendors', 'comparisons', 'guides'].includes(id),
  );
  const domains = new Set<DomainId>();
  const legacy = LEGACY_CATEGORY_TO_DOMAIN[a.categoryId] ?? [];
  for (const d of legacy) domains.add(d);

  const t = articleSearchText(a);
  if (/firewall|vpn|dns|dhcp|routing|switching|network|شبكة|جدار/.test(t)) {
    domains.add('networking');
  }
  if (
    /security|endpoint|siem|soc|iam|pam|dlp|zero trust|malware|ransomware|أمن|سيبراني/.test(
      t,
    )
  ) {
    domains.add('cybersecurity');
  }
  if (
    /windows server|active directory|linux|vmware|esxi|vcenter|backup|certificate|pki|azure|aws/.test(
      t,
    )
  ) {
    domains.add('infrastructure');
  }
  if (inferContentType(a) === 'troubleshooting') {
    domains.add('troubleshooting');
  }
  if (inferContentType(a) === 'guide' || inferContentType(a) === 'how-to') {
    domains.add('guides');
  }
  return [...domains];
}

export function inferVendors(a: ArticleListItem): string[] {
  if (a.vendorIds) return [...a.vendorIds];
  return matchVendorsFromText(articleSearchText(a));
}

export function inferTopics(a: ArticleListItem): string[] {
  if (a.topicIds) return [...a.topicIds];
  const text = articleSearchText(a);
  const aliases: Record<string, string[]> = {
    'network-security': ['network security', 'firewall'],
    'endpoint-security': ['endpoint', 'edr', 'antivirus'],
    'siem-soc': ['siem', 'soc'],
    'iam-pam': ['iam', 'pam', 'identity', 'privileged access'],
    dlp: ['dlp', 'data loss prevention'],
    'email-security': ['email security', 'dmarc', 'dkim', 'spf'],
    'vulnerability-management': ['vulnerability', 'cve', 'cvss'],
    'threat-detection': ['threat detection', 'incident response', 'xdr'],
    'zero-trust': ['zero trust'],
    firewalls: ['firewall', 'fortigate', 'palo alto', 'ngfw'],
    vpn: ['vpn', 'globalprotect', 'anyconnect'],
    'routing-switching': ['routing', 'switching', 'vlan'],
    dns: ['dns'],
    'dhcp-ipam': ['dhcp', 'ipam', 'infoblox'],
    'load-balancing': ['load balancing', 'load balancer', 'big-ip', 'f5'],
    nac: ['network access control', '802.1x', 'cisco ise', 'clearpass'],
    wireless: ['wireless', 'wi-fi', 'wifi'],
    'network-troubleshooting': ['network troubleshooting', 'packet capture', 'wireshark'],
    'windows-server': ['windows server'],
    'active-directory': ['active directory', 'group policy', 'kerberos'],
    linux: ['linux'],
    'vmware-virtualization': ['vmware', 'esxi', 'vcenter', 'virtualization', 'hyper-v'],
    'backup-recovery': ['backup', 'recovery', 'ransomware recovery'],
    storage: ['storage', 'ssd', 'hdd'],
    cloud: ['azure', 'aws', 'cloud'],
    'pki-certificates': ['pki', 'certificate', 'tls', 'ssl'],
  };
  return TOPICS.filter((topic) =>
    (aliases[topic.id] ?? [topic.id.replace(/-/g, ' ')]).some((term) => text.includes(term)),
  ).map((topic) => topic.id);
}

export function inferProducts(a: ArticleListItem): string[] {
  if (a.productIds) return [...a.productIds];
  const text = articleSearchText(a);
  return getAllProducts()
    .filter((product) => {
      const terms = [product.id, product.label.en, product.label.ar, ...(product.aliases ?? [])];
      return terms.some((term) => term.length > 2 && text.includes(term.toLowerCase()));
    })
    .map((product) => product.id);
}

export function filterByDomain(articles: ArticleListItem[], domainId: DomainId): ArticleListItem[] {
  return articles.filter((a) => inferDomains(a).includes(domainId));
}

export function filterByVendor(articles: ArticleListItem[], vendorId: string): ArticleListItem[] {
  return articles.filter((a) => inferVendors(a).includes(vendorId));
}

export function filterTroubleshooting(articles: ArticleListItem[]): ArticleListItem[] {
  return articles.filter((a) => {
    if (inferContentType(a) === 'troubleshooting') return true;
    return inferDomains(a).includes('troubleshooting');
  });
}

export function filterGuides(articles: ArticleListItem[]): ArticleListItem[] {
  return articles.filter((a) => {
    const ct = inferContentType(a);
    return ct === 'guide' || ct === 'how-to' || a.categoryId === 'howto';
  });
}

export function vendorLabel(vendorId: string, lang: 'ar' | 'en'): string {
  const v = VENDORS_BY_ID[vendorId];
  if (!v) return vendorId;
  return (v.shortLabel ?? v.label)[lang];
}
