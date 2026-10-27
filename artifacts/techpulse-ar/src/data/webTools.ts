import webToolsJson from '@/content/web-tools.json';

export type Localized<T = string> = { ar: T; en: T };
export type WebToolCategory = 'networking' | 'email-security';

export type WebTool = {
  slug: string;
  category: WebToolCategory;
  updated: string;
  keywords: string[];
  title: Localized;
  metaDescription: Localized;
  summary: Localized;
  intro: Localized<string[]>;
  howTo: Localized<string[]>;
  notes: Localized<string[]>;
  faq: Localized<{ q: string; a: string }[]>;
  references: { label: string; url: string }[];
};

export const WEB_TOOLS = webToolsJson as WebTool[];

export const WEB_TOOL_CATEGORY_LABELS: Record<WebToolCategory, Localized> = {
  networking: { ar: 'الشبكات وعناوين IP', en: 'Networking & IP' },
  'email-security': { ar: 'أمن البريد الإلكتروني', en: 'Email security' },
};

export function getWebTool(slug: string | undefined): WebTool | undefined {
  return WEB_TOOLS.find((tool) => tool.slug === slug);
}

/** Keyword match used by the site search page: every query word must appear in the tool's text. */
export function searchWebTools(query: string): WebTool[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter((word) => word.length >= 2);
  if (!words.length) return [];
  return WEB_TOOLS.filter((tool) => {
    const haystack = [tool.slug, tool.title.ar, tool.title.en, tool.summary.ar, tool.summary.en, ...tool.keywords]
      .join(' ')
      .toLowerCase();
    return words.every((word) => haystack.includes(word));
  });
}
