import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { markdownToHtml, countWords } from '../src/lib/markdown.ts';
import { getRelatedArticles, getAdjacentArticles } from '../src/lib/relatedContent.ts';
import { loadContentIndexes, resolveRouteSeo } from './seo-prerender-core.mjs';
import { renderStaticBody } from './seo-static-content.mjs';
import {
  buildRouteExtras,
  injectSeoIntoShell,
  legacyRedirectHtml,
  writeExtensionlessTwin,
  writeLegacyRedirects,
} from './seo-prerender.mjs';
import { buildFeed } from './generate-rss.mjs';

const shell = `<!doctype html><html lang="ar"><head><title>x</title>
<link rel="alternate" type="application/rss+xml" title="NetSec Atlas RSS" href="/rss.xml" />
</head><body><div id="root"></div><script type="module" src="/assets/index.js"></script></body></html>`;

const indexes = loadContentIndexes();
const textOf = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

test('markdown renderer escapes raw HTML and never emits script tags', () => {
  const html = markdownToHtml('Text with `<script>alert(1)</script>` and <img src=x onerror=alert(1)>');
  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /<img/i);
  assert.match(html, /<code>&lt;script&gt;/);
});

test('markdown renderer supports headings, lists, code fences, tables and safe links', () => {
  const html = markdownToHtml([
    '## Title', '', '- one', '- two', '', '1. first', '2. second', '',
    '```bash', 'echo "hi" <x>', '```', '',
    '| a | b |', '|---|---|', '| 1 | 2 |', '',
    '[ok](https://example.com) [bad](javascript:alert(1)) **bold**',
  ].join('\n'));
  assert.match(html, /<h2>Title<\/h2>/);
  assert.match(html, /<ul><li>one<\/li><li>two<\/li><\/ul>/);
  assert.match(html, /<ol><li>first<\/li><li>second<\/li><\/ol>/);
  assert.match(html, /<pre dir="ltr"><code class="language-bash">echo &quot;hi&quot; &lt;x&gt;<\/code><\/pre>/);
  assert.match(html, /<table>/);
  assert.match(html, /<a href="https:\/\/example.com" rel="noopener noreferrer" target="_blank">ok<\/a>/);
  assert.doesNotMatch(html, /href="javascript/);
  assert.match(html, /<strong>bold<\/strong>/);
  assert.ok(countWords('## a\n\nb c d') >= 3);
});

test('related articles prefer shared tags and never include the article itself', () => {
  const all = [
    { slug: 'a', categoryId: 'x', tags: ['VPN', 'Firewall'], date: '2024-01-01' },
    { slug: 'b', categoryId: 'y', tags: ['vpn'], date: '2024-01-02' },
    { slug: 'c', categoryId: 'x', tags: [], date: '2024-01-03' },
    { slug: 'd', categoryId: 'z', tags: [], date: '2024-01-04' },
  ];
  const related = getRelatedArticles(all[0], all, 6).map((a) => a.slug);
  // b (shared tag) before c (same category); d only tops the list up to three.
  assert.deepEqual(related, ['b', 'c', 'd']);
  const adj = getAdjacentArticles(all[2], all);
  assert.equal(adj.previous?.slug, 'a');
  assert.equal(adj.next, null);
});

test('every article gets at least three internal related links', () => {
  const articles = indexes.articles;
  const weak = articles.filter((a) => getRelatedArticles(a, articles, 6).length < 3).map((a) => a.slug);
  assert.deepEqual(weak, []);
});

for (const lang of ['ar', 'en']) {
  test(`static ${lang} article body is real crawlable content`, () => {
    const slug = '2fa-practical-guide';
    const pathname = `/${lang}/article/${slug}`;
    const seo = resolveRouteSeo(pathname, indexes);
    const html = injectSeoIntoShell(shell, seo, buildRouteExtras(pathname, seo, indexes));
    const root = html.slice(html.indexOf('<div id="root">'));
    assert.match(root, /<h1>/);
    assert.ok(textOf(root).split(' ').length > 300, 'expected the full article text');
    assert.match(root, new RegExp(`href="/${lang}/article/[^"]+"`), 'related internal links');
    assert.match(html, new RegExp(`<link rel="canonical" href="https://netsecatlas.com/${lang}/article/${slug}" />`));
    assert.match(html, /hreflang="en"/);
    assert.match(html, /hreflang="ar"/);
    assert.match(html, /"@type":"Article"/);
    assert.match(html, /"@type":"BreadcrumbList"/);
    assert.match(html, /"dateModified"/);
    assert.match(html, new RegExp(`href="/${lang}/rss.xml"`));
    assert.match(html, /<script type="module" src="\/assets\/index.js"><\/script>/);
  });
}

test('static listing, page, comparison and tool bodies render', () => {
  for (const pathname of ['/ar/', '/en/articles', '/ar/page/about', '/en/comparison/iphone-16-vs-galaxy-s25', '/en/tools/vlsm-subnet-calculator', '/ar/vendors/fortinet']) {
    const seo = resolveRouteSeo(pathname, indexes);
    const body = renderStaticBody(pathname.replace(/^\/(ar|en)/, '') || '/', seo, indexes);
    assert.match(body, /<h1>/, pathname);
    assert.ok(textOf(body).length > 200, pathname);
  }
  const seo = resolveRouteSeo('/en/articles', indexes);
  const list = renderStaticBody('/articles', seo, indexes);
  assert.equal((list.match(/href="\/en\/article\//g) || []).length >= indexes.articles.length, true);
});

test('about/contact pages are no longer placeholders', () => {
  for (const slug of ['about', 'contact', 'privacy', 'editorial-policy']) {
    const page = indexes.pagesBySlug.get(slug);
    for (const lang of ['ar', 'en']) {
      assert.ok(page.content[lang].split(/\s+/).length > 60, `${slug}/${lang}`);
      assert.doesNotMatch(page.content[lang], /نحدّث هذه الصفحة عند الحاجة|updated as needed/);
    }
    assert.ok(page.description?.ar && page.description?.en, slug);
  }
});

test('legacy redirect stubs and extensionless twins', () => {
  const html = legacyRedirectHtml('/ar/article/x');
  assert.match(html, /<link rel="canonical" href="https:\/\/netsecatlas.com\/ar\/article\/x" \/>/);
  assert.match(html, /http-equiv="refresh" content="0; url=\/ar\/article\/x"/);
  const dir = mkdtempSync(join(tmpdir(), 'nsa-'));
  try {
    assert.equal(writeExtensionlessTwin(dir, 'ar/article/x', '<p>x</p>'), true);
    assert.ok(existsSync(join(dir, 'ar', 'article', 'x.html')));
    assert.equal(writeExtensionlessTwin(dir, 'ar', '<p>x</p>'), false);
    assert.equal(writeExtensionlessTwin(dir, '', '<p>x</p>'), false);
    const n = writeLegacyRedirects({ distPublic: dir, routes: [{ path: 'ar/article/y' }, { path: 'en/article/y' }, { path: 'ar' }] });
    assert.equal(n, 1);
    assert.match(readFileSync(join(dir, 'article', 'y', 'index.html'), 'utf8'), /\/ar\/article\/y/);
    assert.ok(existsSync(join(dir, 'article', 'y.html')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('RSS feeds link to localized canonical article URLs', () => {
  for (const lang of ['ar', 'en']) {
    const { xml, count } = buildFeed(indexes.articles, lang, `/${lang}/rss.xml`);
    assert.equal(count, 50);
    const links = [...xml.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>/g)].map((m) => m[1]);
    assert.ok(links.every((l) => l.startsWith(`https://netsecatlas.com/${lang}/article/`)));
    assert.match(xml, new RegExp(`<language>${lang}</language>`));
  }
});
