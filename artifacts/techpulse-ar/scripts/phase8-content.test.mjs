/**
 * Phase 8: remaining content-plan articles, independent English rewrites,
 * repurposed items, generator removal and per-article body files.
 * Source checks always run; dist checks run after `pnpm run build`.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const readJson = (rel) => JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'));
const articles = readJson('../src/content/articles.json');
const index = readJson('../src/content/articles-index.json');
const comparisons = readJson('../src/content/comparisons.json');
const pkg = readJson('../package.json');
const { redirects } = readJson('../src/config/content-redirects.json');
const policy = readJson('../src/config/hreflang-policy.json');
const dist = fileURLToPath(new URL('../dist/public/', import.meta.url));
const slugs = new Set(articles.map((a) => a.slug));
const NEW = readdirSync(new URL('./phase8/content/', import.meta.url)).filter((f) => f.endsWith('.mjs')).map((f) => f.replace(/\.mjs$/, ''));
const ENGLISH = readdirSync(new URL('./phase8/english/', import.meta.url)).filter((f) => f.endsWith('.mjs')).map((f) => f.replace(/\.mjs$/, ''));

test('13 planned articles are published, dated, referenced and bilingual', () => {
  assert.equal(NEW.length, 13);
  for (const slug of NEW) {
    const a = articles.find((x) => x.slug === slug);
    assert.ok(a, slug);
    assert.equal(a.date, '2026-11-19');
    assert.equal(a.translationStatus, 'reviewed');
    for (const lang of ['ar', 'en']) {
      assert.match(a.body[lang], /^## (الأسئلة الشائعة|FAQ)$/m, `${slug} ${lang} FAQ`);
      assert.match(a.body[lang], /^## (المراجع|References)$/m, `${slug} ${lang} references`);
      // Arabic is more compact per word than English, hence the lower Arabic floor
      assert.ok(a.body[lang].split(/\s+/).length >= (lang === 'ar' ? 500 : 540), `${slug} ${lang} too short`);
      assert.ok(a.title[lang].length <= 90, `${slug} ${lang} title too long`);
    }
    // independent, not translated: English and Arabic do not share their section outline
    assert.notEqual(a.body.en.match(/^## /gm).length * 1000 + a.body.en.length, a.body.ar.match(/^## /gm).length * 1000 + a.body.ar.length);
  }
});

test('English rewrites are marked reviewed; everything else stays unreviewed', () => {
  const reviewed = new Set([...NEW, ...ENGLISH, 'printer-not-working-fixes']);
  for (const a of articles) {
    if (reviewed.has(a.slug)) assert.equal(a.translationStatus, 'reviewed', a.slug);
    else assert.notEqual(a.translationStatus, 'reviewed', `${a.slug} marked reviewed without a rewrite`);
  }
  assert.equal(policy.publishUnreviewedTranslations, true);
});

test('index mirrors articles without bodies', () => {
  assert.equal(index.length, articles.length);
  for (const item of index) assert.equal('body' in item, false);
});

test('repurposed and redirected off-audience items', () => {
  assert.equal(redirects['/comparison/chatgpt-vs-claude'], '/article/chatgpt-study-without-harm');
  assert.ok(!comparisons.some((c) => c.slug === 'chatgpt-vs-claude'));
  const printer = articles.find((a) => a.slug === 'printer-not-working-fixes');
  assert.match(printer.body.en, /PrintNightmare/);
  const thinkpad = comparisons.find((c) => c.slug === 'thinkpad-x1-vs-hp-elitebook');
  assert.match(thinkpad.title.en, /Corporate Fleet/);
});

test('DMARC content follows RFC 9989 (no pct-based ramp)', () => {
  for (const slug of ['dmarc-rollout-none-to-reject', 'enterprise-email-security-guide', 'spf-dkim-dmarc-email-basics']) {
    const a = articles.find((x) => x.slug === slug);
    for (const lang of ['ar', 'en']) assert.doesNotMatch(a.body[lang], /pct=\d/, `${slug} ${lang}`);
  }
});

test('internal article links in new content resolve', () => {
  for (const slug of [...NEW, ...ENGLISH]) {
    const a = articles.find((x) => x.slug === slug);
    for (const lang of ['ar', 'en']) {
      for (const [, target] of a.body[lang].matchAll(/\]\(\/article\/([a-z0-9-]+)\)/g)) assert.ok(slugs.has(target), `${slug} ${lang} -> ${target}`);
    }
  }
});

test('bulk generator is gone', () => {
  assert.equal(existsSync(new URL('./generator/', import.meta.url)), false);
  assert.ok(!Object.keys(pkg.scripts).some((k) => k.startsWith('generate')), 'generate scripts removed');
  assert.match(pkg.scripts.build, /generate-article-bodies\.mjs/);
});

test('dist: per-article body files, default OG image, CNAME', { skip: !existsSync(dist) }, () => {
  for (const a of articles) {
    const file = new URL(`content/articles/${a.slug}.json`, `file://${dist}`);
    assert.ok(existsSync(file), `missing body file for ${a.slug}`);
  }
  assert.ok(existsSync(`${dist}og-default.png`));
  assert.equal(readFileSync(`${dist}CNAME`, 'utf8').trim(), 'netsecatlas.com');
  const hub = readFileSync(`${dist}en/articles/index.html`, 'utf8');
  assert.match(hub, /property="og:image" content="https:\/\/netsecatlas\.com\/og-default\.png"/);
  for (const slug of NEW) assert.ok(existsSync(`${dist}en/article/${slug}/index.html`), slug);
  const assets = readdirSync(`${dist}assets`);
  assert.ok(!assets.some((f) => /^articles-.*\.js$/.test(f)), 'full articles chunk should be gone');
});
