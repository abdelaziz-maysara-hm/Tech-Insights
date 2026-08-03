/**
 * Content-aware image resolver.
 * - Articles: thematic hero matching category/subcategory/keywords (NOT random stock).
 * - Comparisons: vendor logo when known, else paired thematic images by product type.
 * Only uses URLs that are known-working (verified 200).
 */

const U = (id, w = 800, h = 450) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

/** Verified working Unsplash photo IDs only */
const P = {
  phone: 'photo-1511707171634-5f897ff02aa9',
  phone2: 'photo-1592899677977-9c10ca588bbd',
  phone3: 'photo-1580910051074-3eb694886505',
  laptop: 'photo-1486312338219-ce68d2c6f44d',
  laptop2: 'photo-1498050108023-c5249f4df085',
  code: 'photo-1555949963-aa79dcee981c',
  code2: 'photo-1555066931-4365d14bab8c',
  lock: 'photo-1614064641938-3bbee52942c7',
  cyber: 'photo-1550751827-4bd374c3f58b',
  network: 'photo-1563986768609-322da13575f3',
  matrix: 'photo-1526374965328-7f61d4dc18c5',
  shield: 'photo-1633265486064-086b219458ec',
  earth: 'photo-1451187580459-43490279c0fa',
  analytics: 'photo-1460925895917-afdab827c52f',
  circuit: 'photo-1518770660439-4636190af475',
  server: 'photo-1607799279861-4dd421887fb3',
  support: 'photo-1516321318423-f06f85e504b3',
  team: 'photo-1573164713714-d95e436ab8d6',
  payment: 'photo-1563013544-824ae1b704d3',
};

/** Theme → primary photo (device card size defaults) */
export const THEMES = {
  phone: U(P.phone, 400, 500),
  phone2: U(P.phone2, 400, 500),
  phone3: U(P.phone3, 400, 500),
  laptop: U(P.laptop, 400, 500),
  laptop2: U(P.laptop2, 400, 500),
  tablet: U(P.phone3, 400, 500),
  storage: U(P.server, 400, 500),
  cpu: U(P.circuit, 400, 500),
  gpu: U(P.analytics, 400, 500),
  console: U(P.matrix, 400, 500),
  watch: U(P.phone2, 400, 500),
  audio: U(P.support, 400, 500),
  ai: U(P.matrix, 400, 500),
  browser: U(P.code, 400, 500),
  cloud: U(P.earth, 400, 500),
  db: U(P.server, 400, 500),
  linux: U(P.code2, 400, 500),
  security: U(P.lock, 400, 500),
  lock: U(P.lock, 400, 500),
  cyber: U(P.cyber, 400, 500),
  network: U(P.network, 400, 500),
  firewall: U(P.shield, 400, 500),
  shield: U(P.shield, 400, 500),
  vpn: U(P.network, 400, 500),
  identity: U(P.payment, 400, 500),
  endpoint: U(P.shield, 400, 500),
  server: U(P.server, 400, 500),
  windows: U(P.laptop, 400, 500),
  dev: U(P.code, 400, 500),
  code: U(P.code, 400, 500),
  code2: U(P.code2, 400, 500),
  circuit: U(P.circuit, 400, 500),
  power: U(P.circuit, 400, 500),
  tech: U(P.circuit, 800, 450),
};

/** Vendor / product logos for comparisons (preferred when name matches) */
export const VENDOR_LOGOS = {
  'palo alto': 'https://cdn.simpleicons.org/paloaltonetworks/FA582D',
  'paloalto': 'https://cdn.simpleicons.org/paloaltonetworks/FA582D',
  fortinet: 'https://cdn.simpleicons.org/fortinet/EE3124',
  fortigate: 'https://cdn.simpleicons.org/fortinet/EE3124',
  cisco: 'https://cdn.simpleicons.org/cisco/1BA0D7',
  forcepoint: 'https://www.google.com/s2/favicons?domain=forcepoint.com&sz=128',
  okta: 'https://cdn.simpleicons.org/okta/007DC1',
  'entra id': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftazure.svg',
  entra: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftazure.svg',
  microsoft: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128',
  defender: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128',
  windows: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/windows.svg',
  wireguard: 'https://cdn.simpleicons.org/wireguard/88171A',
  openvpn: 'https://cdn.simpleicons.org/openvpn/EA7E20',
  crowdstrike: 'https://www.google.com/s2/favicons?domain=crowdstrike.com&sz=128',
  sentinelone: 'https://www.google.com/s2/favicons?domain=sentinelone.com&sz=128',
  'check point': 'https://www.google.com/s2/favicons?domain=checkpoint.com&sz=128',
  checkpoint: 'https://www.google.com/s2/favicons?domain=checkpoint.com&sz=128',
  sophos: 'https://www.google.com/s2/favicons?domain=sophos.com&sz=128',
  freeradius: 'https://www.google.com/s2/favicons?domain=freeradius.org&sz=128',
  nps: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/windows.svg',
  apple: 'https://cdn.simpleicons.org/apple/000000',
  iphone: 'https://cdn.simpleicons.org/apple/000000',
  samsung: 'https://cdn.simpleicons.org/samsung/1428A0',
  galaxy: 'https://cdn.simpleicons.org/samsung/1428A0',
  android: 'https://cdn.simpleicons.org/android/3DDC84',
};

const FALLBACK_PARTNER = {
  phone: 'phone2',
  phone2: 'phone3',
  laptop: 'laptop2',
  security: 'network',
  lock: 'network',
  network: 'firewall',
  firewall: 'cyber',
  shield: 'cyber',
  vpn: 'network',
  identity: 'lock',
  endpoint: 'shield',
  cyber: 'security',
  ai: 'code',
  cloud: 'server',
  dev: 'code2',
  code: 'code2',
  code2: 'dev',
  windows: 'laptop',
  circuit: 'tech',
  tech: 'circuit',
};

function heroSize(url) {
  return url.replace('w=400&h=500', 'w=800&h=450');
}

export function themeImage(theme) {
  return THEMES[theme] || THEMES.tech;
}

export function themeImagePaired(theme, otherTheme) {
  if (theme !== otherTheme) return themeImage(theme);
  const partner = FALLBACK_PARTNER[theme] ?? 'tech';
  return themeImage(partner);
}

/** Map comparison subcategory → default theme */
const HERO_BY_SUB = {
  phones: THEMES.phone,
  'laptops-pcs': THEMES.laptop,
  'software-services': THEMES.dev,
  'gaming-consoles': THEMES.console,
  wearables: THEMES.watch,
  'network-security': THEMES.firewall,
  identity: THEMES.identity,
  endpoint: THEMES.endpoint,
  general: THEMES.tech,
};

export function heroForSub(sub) {
  const img = HERO_BY_SUB[sub] || THEMES.tech;
  return heroSize(img);
}

export function heroImage(index) {
  const keys = Object.keys(HERO_BY_SUB);
  return heroForSub(keys[index % keys.length]);
}

/** Resolve logo for a product/vendor name if known */
export function logoForName(name = '') {
  const n = String(name).toLowerCase();
  for (const [key, url] of Object.entries(VENDOR_LOGOS)) {
    if (n.includes(key)) return url;
  }
  return null;
}

/**
 * Keyword → theme for articles (order matters: more specific first).
 */
const KEYWORD_THEME = [
  [/ssl\s*vpn|remote access|forticlient|globalprotect|vpn/i, 'vpn'],
  [/firewall|ngfw|palo alto|fortigate|fortinet|forcepoint|check\s*point|sophos|cisco ftd/i, 'firewall'],
  [/radius|nps|ldap|active directory|entra|okta|iam|identity|powershell.*ad|user authentication/i, 'identity'],
  [/crowdstrike|sentinelone|defender|edr|endpoint|antivirus|malware/i, 'endpoint'],
  [/2fa|mfa|password|authenticator|phishing|encryption|cyber|security policy/i, 'security'],
  [/network|routing|switching|wifi|dns|tcp/i, 'network'],
  [/windows|disk cleanup|storage sense/i, 'windows'],
  [/linux|ubuntu|fedora/i, 'linux'],
  [/ai|chatgpt|llm|machine learning/i, 'ai'],
  [/cloud|aws|azure|vercel/i, 'cloud'],
  [/phone|iphone|galaxy|android|mobile/i, 'phone'],
  [/laptop|macbook|notebook/i, 'laptop'],
  [/code|programming|developer|git/i, 'dev'],
];

const SUB_THEME = {
  'network-security': 'firewall',
  identity: 'identity',
  endpoint: 'endpoint',
  'vpn-remote': 'vpn',
  'guides-tips': 'security',
  concepts: 'cyber',
  phones: 'phone',
  'laptops-pcs': 'laptop',
  'software-services': 'dev',
  'gaming-consoles': 'console',
  wearables: 'watch',
  general: 'tech',
};

const CAT_THEME = {
  cybersecurity: 'security',
  mobile: 'phone',
  laptops: 'laptop',
  windows: 'windows',
  ai: 'ai',
  howto: 'dev',
  technology: 'tech',
  reviews: 'phone',
  comparisons: 'tech',
};

/**
 * Pick a hero image that reflects article content.
 * Priority: explicit theme → keyword match → subcategory → category → tech fallback.
 */
export function resolveArticleHero({
  categoryId,
  subcategoryId,
  tags = [],
  title = {},
  slug = '',
  theme,
} = {}) {
  if (theme && THEMES[theme]) return heroSize(THEMES[theme]);

  const hay = [
    slug,
    typeof title === 'string' ? title : `${title.ar || ''} ${title.en || ''}`,
    ...(Array.isArray(tags) ? tags : []),
    subcategoryId || '',
    categoryId || '',
  ]
    .join(' ')
    .toLowerCase();

  for (const [re, th] of KEYWORD_THEME) {
    if (re.test(hay)) return heroSize(THEMES[th] || THEMES.tech);
  }

  if (subcategoryId && SUB_THEME[subcategoryId]) {
    return heroSize(THEMES[SUB_THEME[subcategoryId]]);
  }
  if (categoryId && CAT_THEME[categoryId]) {
    return heroSize(THEMES[CAT_THEME[categoryId]]);
  }
  return THEMES.tech;
}

/**
 * Device images for a comparison row.
 * Prefer real vendor logos; otherwise thematic paired images.
 */
export function resolveComparisonImages({ device1Name, device2Name, img1, img2, subcategoryId } = {}) {
  const logo1 = logoForName(device1Name);
  const logo2 = logoForName(device2Name);

  let d1 = logo1;
  let d2 = logo2;

  if (!d1) d1 = themeImage(img1 || SUB_THEME[subcategoryId] || 'tech');
  if (!d2) {
    const t2 = img2 || SUB_THEME[subcategoryId] || 'tech';
    d2 = themeImagePaired(t2, img1 || t2);
    if (d2 === d1) d2 = themeImagePaired(FALLBACK_PARTNER[t2] || 'tech', t2);
  }

  if (d1 === d2 && !logo1) {
    d2 = themeImage(FALLBACK_PARTNER[img1] || 'phone2');
  }

  const hero = logo1 || heroForSub(subcategoryId);
  return { device1Image: d1, device2Image: d2, heroImage: hero };
}

export function deviceImage(index, slot = 0) {
  const theme = slot === 0 ? 'phone' : 'phone2';
  return themeImage(theme);
}
