import type { TopicDef } from './types';

/** Topics under primary domains. Content can reference topic ids without exclusive ownership. */
export const TOPICS: TopicDef[] = [
  // Cybersecurity
  { id: 'network-security', domainId: 'cybersecurity', label: { ar: 'أمن الشبكات', en: 'Network Security' } },
  { id: 'endpoint-security', domainId: 'cybersecurity', label: { ar: 'أمن نقاط النهاية', en: 'Endpoint Security' } },
  { id: 'siem-soc', domainId: 'cybersecurity', label: { ar: 'SIEM و SOC', en: 'SIEM & SOC' } },
  { id: 'iam-pam', domainId: 'cybersecurity', label: { ar: 'الهوية وإدارة الصلاحيات', en: 'IAM & PAM' } },
  { id: 'dlp', domainId: 'cybersecurity', label: { ar: 'منع تسرب البيانات', en: 'Data Loss Prevention' } },
  { id: 'email-security', domainId: 'cybersecurity', label: { ar: 'أمن البريد', en: 'Email Security' } },
  { id: 'vulnerability-management', domainId: 'cybersecurity', label: { ar: 'إدارة الثغرات', en: 'Vulnerability Management' } },
  { id: 'threat-detection', domainId: 'cybersecurity', label: { ar: 'كشف التهديدات والاستجابة', en: 'Threat Detection & Response' } },
  { id: 'zero-trust', domainId: 'cybersecurity', label: { ar: 'Zero Trust', en: 'Zero Trust' } },

  // Networking
  { id: 'firewalls', domainId: 'networking', label: { ar: 'الجدران النارية', en: 'Firewalls' } },
  { id: 'vpn', domainId: 'networking', label: { ar: 'VPN', en: 'VPN' } },
  { id: 'routing-switching', domainId: 'networking', label: { ar: 'التوجيه والتبديل', en: 'Routing & Switching' } },
  { id: 'dns', domainId: 'networking', label: { ar: 'DNS', en: 'DNS' } },
  { id: 'dhcp-ipam', domainId: 'networking', label: { ar: 'DHCP و IPAM', en: 'DHCP & IPAM' } },
  { id: 'load-balancing', domainId: 'networking', label: { ar: 'موازنة الحمل', en: 'Load Balancing' } },
  { id: 'nac', domainId: 'networking', label: { ar: 'التحكم في وصول الشبكة', en: 'Network Access Control' } },
  { id: 'wireless', domainId: 'networking', label: { ar: 'الشبكات اللاسلكية', en: 'Wireless' } },
  { id: 'network-troubleshooting', domainId: 'networking', label: { ar: 'استكشاف أعطال الشبكة', en: 'Network Troubleshooting' } },

  // Infrastructure
  { id: 'windows-server', domainId: 'infrastructure', label: { ar: 'Windows Server', en: 'Windows Server' } },
  { id: 'active-directory', domainId: 'infrastructure', label: { ar: 'Active Directory', en: 'Active Directory' } },
  { id: 'linux', domainId: 'infrastructure', label: { ar: 'Linux', en: 'Linux' } },
  { id: 'vmware-virtualization', domainId: 'infrastructure', label: { ar: 'VMware والافتراضية', en: 'VMware & Virtualization' } },
  { id: 'backup-recovery', domainId: 'infrastructure', label: { ar: 'النسخ الاحتياطي والاستعادة', en: 'Backup & Recovery' } },
  { id: 'storage', domainId: 'infrastructure', label: { ar: 'التخزين', en: 'Storage' } },
  { id: 'cloud', domainId: 'infrastructure', label: { ar: 'السحابة', en: 'Cloud' } },
  { id: 'pki-certificates', domainId: 'infrastructure', label: { ar: 'PKI والشهادات', en: 'PKI & Certificates' } },
];

export const TOPICS_BY_ID = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

export function getTopicsForDomain(domainId: string): TopicDef[] {
  return TOPICS.filter((t) => t.domainId === domainId);
}
