import program from '@/content/desktop-program.json';

/** Stable #anchor on /tools from the English tool name. */
export function toolAnchor(englishName: string): string {
  return englishName
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export type DesktopToolRef = {
  anchor: string;
  title: { ar: string; en: string };
};

const TOOLS: DesktopToolRef[] = (program.categories as Array<{ tools: Array<{ ar: string; en: string }> }>).flatMap((cat) =>
  cat.tools.map((tool) => ({
    anchor: toolAnchor(tool.en),
    title: { ar: tool.ar, en: tool.en },
  })),
);

const BY_ANCHOR = new Map(TOOLS.map((t) => [t.anchor, t]));

export function desktopToolByAnchor(anchor: string): DesktopToolRef | undefined {
  return BY_ANCHOR.get(anchor);
}

export function toolsHref(anchor?: string): string {
  return anchor ? `/tools#${anchor}` : '/tools';
}

export function allDesktopTools(): DesktopToolRef[] {
  return TOOLS;
}
