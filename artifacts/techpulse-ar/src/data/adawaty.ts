export const ADAWATY_ORIGIN = 'https://adawaty.tools';
export const ADAWATY_SECURITY = `${ADAWATY_ORIGIN}/categories/security-network/`;

export type AdawatyLink = {
  href: string;
  title: { ar: string; en: string };
};

/** Existing Adawaty tools we can deep-link from NetSec Atlas articles. More security tools land here later. */
export const ADAWATY_SECURITY_TOOLS: AdawatyLink[] = [
  {
    href: ADAWATY_SECURITY,
    title: { ar: 'كل أدوات الأمن والشبكات', en: 'All security & network tools' },
  },
  {
    href: `${ADAWATY_ORIGIN}/tools/hash-generator/`,
    title: { ar: 'مولّد التجزئة', en: 'Hash generator' },
  },
  {
    href: `${ADAWATY_ORIGIN}/tools/secure-password-generator/`,
    title: { ar: 'مولّد كلمات السر', en: 'Password generator' },
  },
  {
    href: `${ADAWATY_ORIGIN}/tools/cidr-range-calculator/`,
    title: { ar: 'حاسبة CIDR', en: 'CIDR calculator' },
  },
];

const TAG_HINTS: { re: RegExp; href: string }[] = [
  { re: /hash|sha|md5|checksum/i, href: `${ADAWATY_ORIGIN}/tools/hash-generator/` },
  { re: /password|passwd|كلمة السر|كلمات السر/i, href: `${ADAWATY_ORIGIN}/tools/secure-password-generator/` },
  { re: /cidr|subnet|ip address|ipv4/i, href: `${ADAWATY_ORIGIN}/tools/cidr-range-calculator/` },
];

export function adawatyLinksForArticle(input: {
  categoryId?: string;
  tags?: string[];
  title?: { ar?: string; en?: string };
}): AdawatyLink[] {
  const blob = [
    input.categoryId ?? '',
    ...(input.tags ?? []),
    input.title?.ar ?? '',
    input.title?.en ?? '',
  ].join(' ');

  const isSecurity =
    input.categoryId === 'cybersecurity' ||
    /security|tls|ssl|vpn|firewall|hash|jwt|ioc|malware|cipher|encrypt/i.test(blob);

  if (!isSecurity) return [];

  const picked = new Map<string, AdawatyLink>();
  picked.set(ADAWATY_SECURITY, ADAWATY_SECURITY_TOOLS[0]);
  for (const hint of TAG_HINTS) {
    if (hint.re.test(blob)) {
      const tool = ADAWATY_SECURITY_TOOLS.find((t) => t.href === hint.href);
      if (tool) picked.set(tool.href, tool);
    }
  }
  if (picked.size === 1) {
    ADAWATY_SECURITY_TOOLS.slice(1, 3).forEach((t) => picked.set(t.href, t));
  }
  return [...picked.values()];
}
