/** Categories + subcategories aligned with src/data/subcategories.ts */

export const ARTICLE_CATEGORIES = [
  'cybersecurity', 'mobile', 'laptops', 'howto', 'ai', 'reviews', 'windows', 'comparisons', 'technology',
];

/** Allowed subcategory ids per category (must match site UI) */
export const ALLOWED_SUBCATEGORIES = {
  mobile: ['reviews', 'best-picks', 'guides-tips', 'concepts', 'news-updates', 'general'],
  laptops: ['reviews', 'best-picks', 'guides-tips', 'concepts', 'news-updates', 'general'],
  windows: ['reviews', 'best-picks', 'guides-tips', 'concepts', 'news-updates', 'general'],
  howto: ['reviews', 'best-picks', 'guides-tips', 'concepts', 'news-updates', 'general'],
  ai: ['reviews', 'best-picks', 'guides-tips', 'concepts', 'news-updates', 'general'],
  technology: ['reviews', 'best-picks', 'guides-tips', 'concepts', 'news-updates', 'general'],
  cybersecurity: [
    'guides-tips', 'network-security', 'identity', 'endpoint', 'vpn-remote',
    'concepts', 'news-updates', 'general',
  ],
  reviews: ['phones-wearables', 'audio', 'cameras-drones', 'gaming', 'accessories-peripherals', 'general'],
  comparisons: [
    'phones', 'laptops-pcs', 'network-security', 'identity', 'endpoint',
    'software-services', 'gaming-consoles', 'wearables', 'general',
  ],
};

export function assertSubcategory(categoryId, subcategoryId) {
  const allowed = ALLOWED_SUBCATEGORIES[categoryId];
  if (!allowed) return subcategoryId || 'general';
  if (subcategoryId && allowed.includes(subcategoryId)) return subcategoryId;
  // sensible defaults
  if (categoryId === 'cybersecurity') return 'guides-tips';
  if (categoryId === 'comparisons') return 'general';
  return allowed.includes('guides-tips') ? 'guides-tips' : allowed[0];
}

/** Infer category/sub from free text (title, tags, topic) */
export function inferTaxonomy(text = '') {
  const t = String(text).toLowerCase();
  if (/ssl\s*vpn|remote access|forticlient|globalprotect|\bvpn\b/.test(t))
    return { categoryId: 'cybersecurity', subcategoryId: 'vpn-remote', theme: 'vpn' };
  if (/firewall|ngfw|palo alto|fortigate|fortinet|forcepoint|check\s*point|sophos|security policy/.test(t))
    return { categoryId: 'cybersecurity', subcategoryId: 'network-security', theme: 'firewall' };
  if (/radius|nps|active directory|entra|okta|iam|identity|ldap|powershell/.test(t))
    return { categoryId: 'cybersecurity', subcategoryId: 'identity', theme: 'identity' };
  if (/crowdstrike|sentinelone|defender|edr|endpoint|antivirus/.test(t))
    return { categoryId: 'cybersecurity', subcategoryId: 'endpoint', theme: 'endpoint' };
  if (/2fa|mfa|phishing|password|cyber|security/.test(t))
    return { categoryId: 'cybersecurity', subcategoryId: 'guides-tips', theme: 'security' };
  if (/windows|disk cleanup|storage sense/.test(t))
    return { categoryId: 'windows', subcategoryId: 'guides-tips', theme: 'windows' };
  if (/\bai\b|chatgpt|llm/.test(t))
    return { categoryId: 'ai', subcategoryId: 'concepts', theme: 'ai' };
  if (/iphone|galaxy|android|phone|mobile/.test(t))
    return { categoryId: 'mobile', subcategoryId: 'guides-tips', theme: 'phone' };
  if (/laptop|macbook/.test(t))
    return { categoryId: 'laptops', subcategoryId: 'guides-tips', theme: 'laptop' };
  return { categoryId: 'technology', subcategoryId: 'general', theme: 'tech' };
}

export const VIDEO_TOPICS = [
  { topic: 'AI', categoryId: 'ai', subcategoryId: 'concepts' },
  { topic: 'Programming', categoryId: 'howto', subcategoryId: 'guides-tips' },
  { topic: 'Networking', categoryId: 'cybersecurity', subcategoryId: 'network-security' },
  { topic: 'Cybersecurity', categoryId: 'cybersecurity', subcategoryId: 'guides-tips' },
  { topic: 'Firewall', categoryId: 'cybersecurity', subcategoryId: 'network-security' },
  { topic: 'VPN', categoryId: 'cybersecurity', subcategoryId: 'vpn-remote' },
  { topic: 'Active Directory', categoryId: 'cybersecurity', subcategoryId: 'identity' },
  { topic: 'EDR', categoryId: 'cybersecurity', subcategoryId: 'endpoint' },
  { topic: 'Linux', categoryId: 'howto', subcategoryId: 'guides-tips' },
  { topic: 'Windows', categoryId: 'windows', subcategoryId: 'guides-tips' },
  { topic: 'Docker', categoryId: 'howto', subcategoryId: 'guides-tips' },
  { topic: 'AWS', categoryId: 'technology', subcategoryId: 'concepts' },
  { topic: 'Azure', categoryId: 'technology', subcategoryId: 'concepts' },
  { topic: 'Python', categoryId: 'howto', subcategoryId: 'guides-tips' },
  { topic: 'React', categoryId: 'howto', subcategoryId: 'guides-tips' },
];

/**
 * Comparison catalog: each pair is bound to the correct subcategory.
 * img1/img2 = theme keys used only when no vendor logo is found.
 */
export const COMPARISON_CATALOG = [
  // Phones
  { d1: 'iPhone 16', d2: 'Galaxy S25', sub: 'phones', img1: 'phone', img2: 'phone2' },
  { d1: 'Pixel 9', d2: 'Nothing Phone 3', sub: 'phones', img1: 'phone2', img2: 'phone3' },
  // Laptops
  { d1: 'MacBook Air M3', d2: 'Dell XPS 13', sub: 'laptops-pcs', img1: 'laptop', img2: 'laptop2' },
  { d1: 'ThinkPad X1', d2: 'HP EliteBook', sub: 'laptops-pcs', img1: 'laptop2', img2: 'laptop' },
  // Network security / NGFW
  { d1: 'Palo Alto NGFW', d2: 'Fortinet FortiGate', sub: 'network-security', img1: 'firewall', img2: 'network' },
  { d1: 'Palo Alto NGFW', d2: 'Forcepoint NGFW', sub: 'network-security', img1: 'firewall', img2: 'security' },
  { d1: 'Fortinet FortiGate', d2: 'Forcepoint NGFW', sub: 'network-security', img1: 'network', img2: 'firewall' },
  { d1: 'Cisco FTD', d2: 'Palo Alto NGFW', sub: 'network-security', img1: 'network', img2: 'firewall' },
  { d1: 'Palo Alto NGFW', d2: 'Check Point', sub: 'network-security', img1: 'firewall', img2: 'shield' },
  { d1: 'Fortinet FortiGate', d2: 'Sophos Firewall', sub: 'network-security', img1: 'network', img2: 'security' },
  { d1: 'WireGuard', d2: 'OpenVPN', sub: 'network-security', img1: 'vpn', img2: 'network' },
  { d1: 'Windows NPS', d2: 'FreeRADIUS', sub: 'network-security', img1: 'identity', img2: 'server' },
  // Identity
  { d1: 'Okta', d2: 'Microsoft Entra ID', sub: 'identity', img1: 'identity', img2: 'cloud' },
  // Endpoint
  { d1: 'CrowdStrike Falcon', d2: 'Microsoft Defender', sub: 'endpoint', img1: 'endpoint', img2: 'security' },
  { d1: 'CrowdStrike Falcon', d2: 'SentinelOne', sub: 'endpoint', img1: 'endpoint', img2: 'cyber' },
  { d1: 'Microsoft Defender', d2: 'SentinelOne', sub: 'endpoint', img1: 'security', img2: 'endpoint' },
  // Software
  { d1: 'ChatGPT', d2: 'Claude', sub: 'software-services', img1: 'ai', img2: 'ai' },
  { d1: 'Chrome', d2: 'Firefox', sub: 'software-services', img1: 'browser', img2: 'browser' },
  { d1: 'AWS', d2: 'Azure', sub: 'software-services', img1: 'cloud', img2: 'cloud' },
  { d1: '1Password', d2: 'Bitwarden', sub: 'software-services', img1: 'security', img2: 'security' },
  // Gaming / wearables
  { d1: 'PS5', d2: 'Xbox Series X', sub: 'gaming-consoles', img1: 'console', img2: 'console' },
  { d1: 'Apple Watch 10', d2: 'Galaxy Watch 7', sub: 'wearables', img1: 'watch', img2: 'watch' },
];

export const COMPARISON_SUBCATEGORIES = [
  'phones', 'laptops-pcs', 'network-security', 'identity', 'endpoint',
  'software-services', 'gaming-consoles', 'wearables', 'general',
];
