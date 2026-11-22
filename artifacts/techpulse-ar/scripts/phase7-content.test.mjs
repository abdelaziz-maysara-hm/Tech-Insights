/**
 * Phase 7: video library, content plan batch 1, redirects and on-page SEO.
 * Source checks always run; dist checks run after `pnpm run build`.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const readJson = (rel) => JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'));
const articles = readJson('../src/content/articles.json');
const comparisons = readJson('../src/content/comparisons.json');
const videos = readJson('../src/content/videos.json');
const playlists = readJson('../src/content/video-playlists.json');
const verified = readJson('./phase7/youtube-oembed-verified.json');
const { redirects } = readJson('../src/config/content-redirects.json');
const dist = fileURLToPath(new URL('../dist/public/', import.meta.url));
const articleSlugs = new Set(articles.map((a) => a.slug));
const PILLARS = ['enterprise-network-security-guide', 'soc-incident-response-guide', 'active-directory-identity-security-guide', 'endpoint-vulnerability-management-guide', 'enterprise-email-security-guide'];
const NEW = [...PILLARS, 'forticlient-error-7200-fix', 'fortios-ssl-vpn-tunnel-mode-removal-ipsec-migration', 'windows-security-event-ids-soc', 'dmarc-rollout-none-to-reject', 'kes-12-exclusions-kaspersky-security-center', 'kerberoasting-detection-prevention', 'exploited-vulnerabilities-roundup-august-2026'];

test('every embedded YouTube ID was verified via oEmbed', () => {
  assert.ok(videos.length >= 50);
  for (const v of videos) {
    assert.match(v.youtubeId, /^[\w-]{11}$/);
    assert.ok(verified.videos[v.youtubeId], `${v.slug}: ${v.youtubeId} not in oEmbed verification`);
    assert.equal(v.channel.url, verified.videos[v.youtubeId].authorUrl);
  }
});

test('playlists reference existing videos and articles', () => {
  const videoSlugs = new Set(videos.map((v) => v.slug));
  assert.equal(playlists.length, 7);
  for (const p of playlists) {
    assert.ok(p.videos.length >= 5, p.slug);
    p.videos.forEach((slug) => assert.ok(videoSlugs.has(slug), `${p.slug} -> ${slug}`));
    if (p.pillarArticle) assert.ok(articleSlugs.has(p.pillarArticle), `${p.slug} pillar ${p.pillarArticle}`);
    p.relatedArticles.forEach((slug) => assert.ok(articleSlugs.has(slug), `${p.slug} related ${slug}`));
  }
});

test('content plan batch 1 is published, dated and referenced', () => {
  for (const slug of NEW) {
    const a = articles.find((x) => x.slug === slug);
    assert.ok(a, slug);
    assert.equal(a.date, '2026-11-19');
    assert.equal(a.author.avatar, '');
    for (const lang of ['ar', 'en']) {
      assert.match(a.body[lang], /^## (الأسئلة الشائعة|FAQ)$/m, `${slug} ${lang} FAQ`);
      assert.match(a.body[lang], /^## (المراجع|References)$/m, `${slug} ${lang} references`);
      const min = PILLARS.includes(slug) ? 1150 : 600;
      assert.ok(a.body[lang].split(/\s+/).length >= min, `${slug} ${lang} too short`);
    }
  }
});

test('redirected content is unpublished and points at live pages', () => {
  const comparisonSlugs = new Set(comparisons.map((c) => c.slug));
  for (const [from, to] of Object.entries(redirects)) {
    const [, type, slug] = from.split('/');
    if (type === 'article') assert.ok(!articleSlugs.has(slug), `${slug} still published`);
    if (type === 'comparison') assert.ok(!comparisonSlugs.has(slug), `${slug} still published`);
    const target = to.match(/^\/article\/(.+)$/);
    if (target) assert.ok(articleSlugs.has(target[1]), `${from} -> ${to}`);
  }
});

test('on-page SEO: unique titles/excerpts and no repetitive "complete guide" titles', () => {
  for (const lang of ['ar', 'en']) {
    const titles = articles.map((a) => a.title[lang]);
    const excerpts = articles.map((a) => a.excerpt[lang]);
    assert.equal(new Set(titles).size, titles.length, `duplicate ${lang} titles`);
    assert.equal(new Set(excerpts).size, excerpts.length, `duplicate ${lang} excerpts`);
  }
  const repetitive = articles.filter((a) => !PILLARS.includes(a.slug) && /الدليل (الكامل|الشامل)|The Complete Guide/.test(`${a.title.ar} ${a.title.en}`));
  assert.deepEqual(repetitive.map((a) => a.slug), []);
});

test('dist: video pages, playlists, video sitemap and redirect stubs', { skip: !existsSync(dist) }, () => {
  const read = (rel) => readFileSync(join(dist, rel), 'utf8');
  const v = videos[0];
  const videoHtml = read(`ar/video/${v.slug}/index.html`);
  assert.match(videoHtml, /"@type":"VideoObject"/);
  assert.match(videoHtml, new RegExp(`i\\.ytimg\\.com/vi/${v.youtubeId}/`));
  assert.doesNotMatch(videoHtml, /<iframe[^>]+youtube\.com\/embed/);
  const playlistHtml = read(`en/videos/${playlists[0].slug}/index.html`);
  assert.match(playlistHtml, /"@type":"ItemList"/);
  const sitemap = read('video-sitemap.xml');
  assert.equal((sitemap.match(/<video:video>/g) || []).length, videos.length * 2);
  assert.match(read('robots.txt'), /video-sitemap\.xml/);
  for (const prefix of ['ar/', 'en/', '']) {
    const stub = read(`${prefix}article/iphone-16-vs-galaxy-s25/index.html`.replace('article/iphone', 'comparison/iphone'));
    assert.match(stub, /http-equiv="refresh"/);
    assert.match(stub, /\/comparisons/);
  }
  const roundupStub = read('en/article/ruby-on-rails-critical-rce-patch/index.html');
  assert.match(roundupStub, /exploited-vulnerabilities-roundup-august-2026/);
});

test('internal links in article bodies resolve to live content', () => {
  let tools = new Set();
  try { tools = new Set(readJson('../src/content/web-tools.json').map((t) => t.slug)); } catch { /* removed 2026-11-21 */ }
  const toolRedirects = readJson('../src/config/content-redirects.json').redirects || {};
  const broken = [];
  for (const a of articles) {
    for (const lang of ['ar', 'en']) {
      for (const [, type, slug] of a.body[lang].matchAll(/\]\(\/(article|tools)\/([^)#\s]+)\)/g)) {
        const ok = type === 'article' ? articleSlugs.has(slug) : tools.has(slug) || Boolean(toolRedirects[`/tools/${slug}`]);
        if (!ok) broken.push(`${a.slug} (${lang}) -> /${type}/${slug}`);
      }
    }
  }
  assert.deepEqual(broken, []);
});
