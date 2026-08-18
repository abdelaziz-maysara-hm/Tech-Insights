import type { VendorDef } from './types';

/**
 * Data-driven vendor/product registry.
 * Extensible — do not hard-code per-vendor React pages.
 * matchKeywords help associate existing content without rewriting it.
 */
export const VENDORS: VendorDef[] = [
  {
    id: 'fortinet',
    label: { ar: 'Fortinet', en: 'Fortinet' },
    description: {
      ar: 'جدران نارية، أمن الشبكات، وإدارة الأمن',
      en: 'Firewalls, network security and security management',
    },
    matchKeywords: ['fortinet', 'fortigate', 'fortimanager', 'fortianalyzer', 'fortimail', 'fortiweb', 'forticlient', 'ems'],
    products: [
      { id: 'fortigate', vendorId: 'fortinet', label: { ar: 'FortiGate', en: 'FortiGate' }, aliases: ['fg', 'fortigate'] },
      { id: 'fortimanager', vendorId: 'fortinet', label: { ar: 'FortiManager', en: 'FortiManager' } },
      { id: 'fortianalyzer', vendorId: 'fortinet', label: { ar: 'FortiAnalyzer', en: 'FortiAnalyzer' } },
      { id: 'fortimail', vendorId: 'fortinet', label: { ar: 'FortiMail', en: 'FortiMail' } },
      { id: 'fortiweb', vendorId: 'fortinet', label: { ar: 'FortiWeb', en: 'FortiWeb' } },
      { id: 'forticlient-ems', vendorId: 'fortinet', label: { ar: 'FortiClient / EMS', en: 'FortiClient / EMS' }, aliases: ['forticlient', 'ems'] },
    ],
  },
  {
    id: 'palo-alto',
    label: { ar: 'Palo Alto Networks', en: 'Palo Alto Networks' },
    shortLabel: { ar: 'Palo Alto', en: 'Palo Alto' },
    matchKeywords: ['palo alto', 'paloalto', 'pan-os', 'panos', 'panorama', 'globalprotect'],
    products: [
      { id: 'pan-os', vendorId: 'palo-alto', label: { ar: 'PAN-OS', en: 'PAN-OS' }, aliases: ['panos'] },
      { id: 'panorama', vendorId: 'palo-alto', label: { ar: 'Panorama', en: 'Panorama' } },
      { id: 'globalprotect', vendorId: 'palo-alto', label: { ar: 'GlobalProtect', en: 'GlobalProtect' } },
    ],
  },
  {
    id: 'cisco',
    label: { ar: 'Cisco', en: 'Cisco' },
    matchKeywords: ['cisco', 'asa', 'ftd', 'ise', 'anyconnect', 'catalyst'],
    products: [
      { id: 'cisco-ise', vendorId: 'cisco', label: { ar: 'Cisco ISE', en: 'Cisco ISE' }, aliases: ['ise'] },
      { id: 'cisco-asa-ftd', vendorId: 'cisco', label: { ar: 'ASA / FTD', en: 'ASA / FTD' }, aliases: ['asa', 'ftd'] },
      { id: 'cisco-switching', vendorId: 'cisco', label: { ar: 'Switching', en: 'Switching' } },
    ],
  },
  {
    id: 'microsoft',
    label: { ar: 'Microsoft', en: 'Microsoft' },
    matchKeywords: ['microsoft', 'windows server', 'active directory', 'sentinel', 'azure ad', 'entra'],
    products: [
      { id: 'windows-server', vendorId: 'microsoft', label: { ar: 'Windows Server', en: 'Windows Server' } },
      { id: 'active-directory', vendorId: 'microsoft', label: { ar: 'Active Directory', en: 'Active Directory' }, aliases: ['ad'] },
      { id: 'microsoft-sentinel', vendorId: 'microsoft', label: { ar: 'Microsoft Sentinel', en: 'Microsoft Sentinel' }, aliases: ['sentinel'] },
    ],
  },
  {
    id: 'vmware',
    label: { ar: 'VMware', en: 'VMware' },
    matchKeywords: ['vmware', 'esxi', 'vcenter', 'vsphere'],
    products: [
      { id: 'esxi', vendorId: 'vmware', label: { ar: 'ESXi', en: 'ESXi' } },
      { id: 'vcenter-vsphere', vendorId: 'vmware', label: { ar: 'vCenter / vSphere', en: 'vCenter / vSphere' }, aliases: ['vcenter', 'vsphere'] },
    ],
  },
  {
    id: 'kaspersky',
    label: { ar: 'Kaspersky', en: 'Kaspersky' },
    matchKeywords: ['kaspersky', 'ksc', 'kes', 'kesl', 'network agent'],
    products: [
      { id: 'ksc', vendorId: 'kaspersky', label: { ar: 'Kaspersky Security Center', en: 'Kaspersky Security Center' }, aliases: ['ksc'] },
      { id: 'kes', vendorId: 'kaspersky', label: { ar: 'Kaspersky Endpoint Security', en: 'Kaspersky Endpoint Security' }, aliases: ['kes'] },
      { id: 'kesl', vendorId: 'kaspersky', label: { ar: 'KES for Linux', en: 'Kaspersky Endpoint Security for Linux' }, aliases: ['kesl'] },
      { id: 'network-agent', vendorId: 'kaspersky', label: { ar: 'Network Agent', en: 'Network Agent' } },
    ],
  },
  {
    id: 'forcepoint',
    label: { ar: 'Forcepoint', en: 'Forcepoint' },
    matchKeywords: ['forcepoint'],
    products: [
      { id: 'forcepoint-dlp', vendorId: 'forcepoint', label: { ar: 'Forcepoint DLP', en: 'Forcepoint DLP' } },
      { id: 'forcepoint-web', vendorId: 'forcepoint', label: { ar: 'Web Security', en: 'Web Security' } },
      { id: 'forcepoint-email', vendorId: 'forcepoint', label: { ar: 'Email Security', en: 'Email Security' } },
      { id: 'forcepoint-ngfw', vendorId: 'forcepoint', label: { ar: 'NGFW', en: 'NGFW' } },
    ],
  },
  {
    id: 'f5',
    label: { ar: 'F5', en: 'F5' },
    matchKeywords: ['f5', 'big-ip', 'bigip', 'ltm', 'gtm'],
    products: [
      { id: 'bigip-ltm', vendorId: 'f5', label: { ar: 'BIG-IP LTM', en: 'BIG-IP LTM' }, aliases: ['ltm'] },
      { id: 'bigip-dns', vendorId: 'f5', label: { ar: 'BIG-IP DNS / GTM', en: 'BIG-IP DNS / GTM' }, aliases: ['gtm'] },
      { id: 'bigip-waf', vendorId: 'f5', label: { ar: 'Advanced WAF', en: 'BIG-IP Advanced WAF' } },
    ],
  },
  {
    id: 'beyondtrust',
    label: { ar: 'BeyondTrust', en: 'BeyondTrust' },
    matchKeywords: ['beyondtrust', 'password safe'],
    products: [
      { id: 'password-safe', vendorId: 'beyondtrust', label: { ar: 'Password Safe', en: 'Password Safe' } },
    ],
  },
  {
    id: 'splunk',
    label: { ar: 'Splunk', en: 'Splunk' },
    matchKeywords: ['splunk'],
    products: [
      { id: 'splunk-enterprise', vendorId: 'splunk', label: { ar: 'Splunk Enterprise', en: 'Splunk Enterprise' } },
    ],
  },
  {
    id: 'broadcom',
    label: { ar: 'Broadcom', en: 'Broadcom' },
    matchKeywords: ['broadcom', 'symantec'],
    products: [
      { id: 'symantec-dlp', vendorId: 'broadcom', label: { ar: 'Symantec DLP', en: 'Symantec DLP' } },
    ],
  },
  {
    id: 'trellix',
    label: { ar: 'Trellix', en: 'Trellix' },
    matchKeywords: ['trellix', 'mcafee'],
    products: [
      { id: 'trellix-endpoint', vendorId: 'trellix', label: { ar: 'Endpoint Security', en: 'Endpoint Security' } },
    ],
  },
  {
    id: 'rapid7',
    label: { ar: 'Rapid7', en: 'Rapid7' },
    matchKeywords: ['rapid7', 'insightvm', 'insightidr'],
    products: [
      { id: 'insightvm', vendorId: 'rapid7', label: { ar: 'InsightVM', en: 'InsightVM' } },
    ],
  },
  {
    id: 'infoblox',
    label: { ar: 'Infoblox', en: 'Infoblox' },
    matchKeywords: ['infoblox'],
    products: [
      { id: 'infoblox-ddi', vendorId: 'infoblox', label: { ar: 'DDI', en: 'DDI' } },
    ],
  },
  {
    id: 'sophos',
    label: { ar: 'Sophos', en: 'Sophos' },
    matchKeywords: ['sophos'],
    products: [
      { id: 'sophos-xg', vendorId: 'sophos', label: { ar: 'XG / XGS Firewall', en: 'XG / XGS Firewall' } },
    ],
  },
];

export const VENDORS_BY_ID = Object.fromEntries(VENDORS.map((v) => [v.id, v]));

export function getVendor(id: string) {
  return VENDORS_BY_ID[id];
}

export function getAllProducts() {
  return VENDORS.flatMap((v) => v.products);
}

/** Match existing free-text (title/tags/excerpt) to vendor ids without rewriting content. */
export function matchVendorsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const hits: string[] = [];
  for (const v of VENDORS) {
    if (v.matchKeywords.some((k) => lower.includes(k.toLowerCase()))) {
      hits.push(v.id);
    }
  }
  return hits;
}
