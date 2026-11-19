/**
 * Small, dependency-free Markdown → HTML renderer shared by the React app and
 * the build-time static prerender (scripts/seo-static-content.mjs).
 *
 * Security: ALL source text is HTML-escaped first, so article bodies can never
 * inject markup or scripts (e.g. the XSS article quotes `<script>` tags).
 * Only http(s), mailto and site-relative links are emitted.
 *
 * Supported: ## / ### / #### headings, paragraphs, **bold**, *italic*,
 * `inline code`, fenced ``` code blocks, - / * bullet lists, 1. ordered lists,
 * > blockquotes, simple | tables |, [links](url).
 *
 * Keep this file free of TypeScript-only runtime syntax (enums, namespaces,
 * parameter properties) so Node can load it with native type stripping.
 */

export function escapeHtml(value: string): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeHref(raw: string): string | null {
  const href = raw.trim();
  if (/^https?:\/\//i.test(href) || /^mailto:/i.test(href)) return href;
  if (href.startsWith('/') && !href.startsWith('//')) return href;
  if (href.startsWith('#')) return href;
  return null;
}

/** Inline formatting on an already-escaped string. */
function renderInline(escaped: string): string {
  const codeSpans: string[] = [];
  let out = escaped.replace(/`([^`]+)`/g, (_m, code: string) => {
    codeSpans.push(`<code>${code}</code>`);
    return `\u0000${codeSpans.length - 1}\u0000`;
  });
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, text: string, url: string) => {
    // url is escaped already; decode &amp; for the check only
    const href = safeHref(url.replace(/&amp;/g, '&'));
    if (!href) return match;
    const external = /^https?:\/\//i.test(href);
    const rel = external ? ' rel="noopener noreferrer" target="_blank"' : '';
    return `<a href="${escapeHtml(href)}"${rel}>${text}</a>`;
  });
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s).,:;!?]|$)/g, '$1<em>$2</em>');
  out = out.replace(/\u0000(\d+)\u0000/g, (_m, i: string) => codeSpans[Number(i)] ?? '');
  return out;
}

function isTableSeparator(line: string): boolean {
  return /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line.trim());
}

function splitRow(line: string): string[] {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

export function markdownToHtml(markdown: string): string {
  const lines = String(markdown ?? '').replace(/\r\n?/g, '\n').split('\n');
  const html: string[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${renderInline(escapeHtml(paragraph.join(' ')))}</p>`);
      paragraph = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      i += 1;
      continue;
    }

    const fence = trimmed.match(/^```\s*([\w+-]*)/);
    if (fence) {
      flushParagraph();
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1; // closing fence
      const lang = fence[1] ? ` class="language-${escapeHtml(fence[1])}"` : '';
      html.push(`<pre dir="ltr"><code${lang}>${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }

    const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      // A single "#" inside a body is demoted to h2: the page owns the h1.
      const level = Math.max(2, heading[1].length);
      html.push(`<h${level}>${renderInline(escapeHtml(heading[2].trim()))}</h${level}>`);
      i += 1;
      continue;
    }

    if (trimmed.startsWith('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      flushParagraph();
      const head = splitRow(trimmed);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(splitRow(lines[i]));
        i += 1;
      }
      const th = head.map((c) => `<th>${renderInline(escapeHtml(c))}</th>`).join('');
      const body = rows
        .map((r) => `<tr>${r.map((c) => `<td>${renderInline(escapeHtml(c))}</td>`).join('')}</tr>`)
        .join('');
      html.push(`<div class="overflow-x-auto"><table><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table></div>`);
      continue;
    }

    if (/^[-*]\s+/.test(trimmed) || /^\d+[.)]\s+/.test(trimmed)) {
      flushParagraph();
      const ordered = /^\d+[.)]\s+/.test(trimmed);
      const itemRe = ordered ? /^\d+[.)]\s+/ : /^[-*]\s+/;
      const items: string[] = [];
      while (i < lines.length && itemRe.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(itemRe, ''));
        i += 1;
        // continuation lines (indented, non-empty, not a new item)
        while (
          i < lines.length &&
          /^\s{2,}\S/.test(lines[i]) &&
          !itemRe.test(lines[i].trim())
        ) {
          items[items.length - 1] += ` ${lines[i].trim()}`;
          i += 1;
        }
      }
      const tag = ordered ? 'ol' : 'ul';
      html.push(`<${tag}>${items.map((it) => `<li>${renderInline(escapeHtml(it))}</li>`).join('')}</${tag}>`);
      continue;
    }

    if (trimmed.startsWith('>')) {
      flushParagraph();
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quote.push(lines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      html.push(`<blockquote><p>${renderInline(escapeHtml(quote.join(' ')))}</p></blockquote>`);
      continue;
    }

    paragraph.push(trimmed);
    i += 1;
  }
  flushParagraph();
  return html.join('\n');
}

/** Plain-text word count of a markdown body (used for JSON-LD wordCount). */
export function countWords(markdown: string): number {
  return String(markdown ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*`>|[\]()_-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}
