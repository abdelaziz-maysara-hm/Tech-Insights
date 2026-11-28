/**
 * Topic-hub membership and topic inference for internal linking.
 * Pure functions so the sitemap script and the app share the same rules.
 */
import { TOPICS, TOPICS_BY_ID } from '../data/taxonomy/topics.ts';
import type { TopicDef } from '../data/taxonomy/types.ts';

export const TOPIC_ID_SET = new Set(TOPICS.map((t) => t.id));

/** Informal playlist / tag / slug tokens → taxonomy topic ids. */
export const TOPIC_ALIASES: Record<string, string> = {
  firewalls: 'firewalls',
  firewall: 'firewalls',
  vpn: 'vpn',
  dns: 'dns',
  dhcp: 'dhcp-ipam',
  ipam: 'dhcp-ipam',
  subnetting: 'dhcp-ipam',
  subnet: 'dhcp-ipam',
  cidr: 'dhcp-ipam',
  routing: 'routing-switching',
  switching: 'routing-switching',
  stp: 'routing-switching',
  vlan: 'routing-switching',
  wifi: 'wireless',
  wireless: 'wireless',
  'wi-fi': 'wireless',
  tls: 'pki-certificates',
  ssl: 'pki-certificates',
  certificates: 'pki-certificates',
  certificate: 'pki-certificates',
  pki: 'pki-certificates',
  soc: 'siem-soc',
  siem: 'siem-soc',
  identity: 'iam-pam',
  iam: 'iam-pam',
  pam: 'iam-pam',
  'active-directory': 'active-directory',
  ad: 'active-directory',
  windows: 'windows-server',
  endpoint: 'endpoint-security',
  edr: 'endpoint-security',
  vulnerability: 'vulnerability-management',
  email: 'email-security',
  phishing: 'email-security',
  nac: 'nac',
  zerotrust: 'zero-trust',
  'zero-trust': 'zero-trust',
  cloud: 'cloud',
  linux: 'linux',
  vmware: 'vmware-virtualization',
  backup: 'backup-recovery',
  dlp: 'dlp',
  'network-troubleshooting': 'network-troubleshooting',
  troubleshooting: 'network-troubleshooting',
};

export type Topicable = {
  slug?: string;
  tags?: string[];
  topicIds?: string[];
  topics?: string[];
  categoryId?: string;
  subcategoryId?: string;
  vendorIds?: string[];
  vendor?: string;
  domainIds?: string[];
  title?: { ar?: string; en?: string } | string;
  excerpt?: { ar?: string; en?: string } | string;
  device1Name?: string;
  device2Name?: string;
  product?: string;
  playlist?: string;
};

function loc(value: Topicable['title']): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return `${value.en ?? ''} ${value.ar ?? ''}`;
}

function normalizeToken(raw: string): string {
  return String(raw)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function knownTopicId(id: string | undefined | null): string | undefined {
  if (!id) return undefined;
  const direct = normalizeToken(id);
  if (TOPIC_ID_SET.has(direct)) return direct;
  return TOPIC_ALIASES[direct];
}

const SLUG_HINTS: Array<[RegExp, string[]]> = [
  [/fortigate|fortinet|palo-alto|pan-os|check-point|cisco-ftd|sophos-firewall|forcepoint-ngfw|ngfw/, ['firewalls']],
  [/wireguard|openvpn|ipsec|ssl-vpn|ztna/, ['vpn']],
  [/dns|nslookup|dig|infoblox/, ['dns']],
  [/dhcp|ip-address-conflict|subnet|cidr|vlsm/, ['dhcp-ipam']],
  [/vlan|stp|spanning|switching|routing|ospf|bgp/, ['routing-switching']],
  [/wifi|wireless|802-11/, ['wireless']],
  [/tls|ssl|certificate|pki|openssl/, ['pki-certificates']],
  [/siem|soc|splunk|sentinel(?!-one)|wazuh/, ['siem-soc']],
  [/okta|entra|auth0|active-directory|kerberos|iam|pam|bitwarden|1password|keeper/, ['iam-pam']],
  [/crowdstrike|defender|sentinelone|kaspersky|bitdefender|edr|endpoint/, ['endpoint-security']],
  [/nessus|vulnerability|cvss/, ['vulnerability-management']],
  [/dmarc|spf|dkim|phishing|email/, ['email-security']],
  [/linux|ssh|sshd/, ['linux']],
  [/windows|powershell|rdp|event-4740/, ['windows-server']],
  [/lockout|4740|active-directory|group-policy/, ['active-directory']],
  [/vmware|vsphere|esxi/, ['vmware-virtualization']],
  [/backup|veeam|restore/, ['backup-recovery']],
  [/aws|azure|gcp|cloud/, ['cloud']],
  [/nac|802-1x/, ['nac']],
  [/zero-trust|ztna/, ['zero-trust']],
];

export function inferTopicIds(item: Topicable | null | undefined): string[] {
  if (!item) return [];
  const found = new Set<string>();
  for (const id of item.topicIds ?? []) {
    const known = knownTopicId(id);
    if (known) found.add(known);
  }
  for (const id of item.topics ?? []) {
    const known = knownTopicId(id);
    if (known) found.add(known);
  }
  for (const tag of item.tags ?? []) {
    const known = knownTopicId(tag);
    if (known) found.add(known);
  }
  if (found.size > 0) return [...found];

  const blob = [
    item.slug,
    loc(item.title),
    loc(item.excerpt),
    item.device1Name,
    item.device2Name,
    item.product,
    item.vendor,
    item.subcategoryId,
    ...(item.tags ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  for (const [re, ids] of SLUG_HINTS) {
    if (re.test(blob)) for (const id of ids) if (TOPIC_ID_SET.has(id)) found.add(id);
  }
  return [...found];
}

export type TopicHubCatalogs = {
  articles?: Topicable[];
  comparisons?: Topicable[];
  playlists?: Topicable[];
  alternatives?: Topicable[];
};

/** Topics that have at least one piece of existing content and should be indexable hubs. */
export function indexableTopicIds(catalogs: TopicHubCatalogs): string[] {
  const counts = new Map<string, number>();
  const bump = (ids: string[]) => {
    for (const id of ids) counts.set(id, (counts.get(id) || 0) + 1);
  };
  for (const item of catalogs.articles ?? []) bump(inferTopicIds(item));
  for (const item of catalogs.comparisons ?? []) bump(inferTopicIds(item));
  for (const item of catalogs.playlists ?? []) bump(inferTopicIds(item));
  for (const item of catalogs.alternatives ?? []) bump(inferTopicIds(item));
  return TOPICS.map((t) => t.id).filter((id) => (counts.get(id) || 0) > 0);
}

export function topicDef(id: string): TopicDef | undefined {
  return TOPICS_BY_ID[id];
}

export function isIndexableTopic(id: string, catalogs: TopicHubCatalogs): boolean {
  return indexableTopicIds(catalogs).includes(id);
}
