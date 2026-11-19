#!/usr/bin/env node
/**
 * Phase 7 content plan, batch 1 (2026-11-19).
 *
 *  - adds 5 pillar pages + 6 cluster articles + 1 news roundup (ar/en)
 *  - folds 4 thin articles into stronger targets, expands 2 thin articles
 *  - removes redirected content (src/config/content-redirects.json) from
 *    articles.json / articles-index.json / comparisons.json
 *  - replaces the repetitive "الدليل الكامل/الشامل" titles
 *  - drops placeholder avatar photos (bylines are the editorial team)
 *
 * Idempotent: safe to re-run. Run: node scripts/phase7/apply-content.mjs
 * NOTE: scripts/generator/* would overwrite these edits if re-run.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { TITLE_FIXES } from './title-fixes.mjs';
import { FORTIGATE_SSLVPN_NOTICE, FORTIGATE_SSLVPN_APPENDIX, SECURE_REMOTE_WORK, MERGES } from './expansions.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const p = (rel) => join(root, rel);
const readJson = (rel) => JSON.parse(readFileSync(p(rel), 'utf8'));
const writeJson = (rel, data) => writeFileSync(p(rel), `${JSON.stringify(data, null, 2)}\n`, 'utf8');

const PUBLISH_DATE = '2026-11-19';
const TEAM_AUTHOR = { name: { ar: 'فريق NetSec Atlas', en: 'NetSec Atlas Team' }, avatar: '' };

const KNOWN_VENDORS = new Set(['fortinet', 'palo-alto', 'cisco', 'microsoft', 'vmware', 'kaspersky', 'forcepoint', 'f5', 'beyondtrust', 'splunk', 'broadcom', 'trellix', 'rapid7', 'infoblox', 'sophos']);
const PRODUCT_ALIASES = { 'kaspersky-security-center': 'ksc', 'kaspersky-endpoint-security': 'kes' };
const KNOWN_PRODUCTS = new Set(['fortigate', 'fortimanager', 'forticlient-ems', 'active-directory', 'windows-server', 'ksc', 'kes', 'pan-os', 'globalprotect']);

const HERO_FROM = {
  'enterprise-network-security-guide': 'network-segmentation-compliance',
  'soc-incident-response-guide': 'security-operations-center-soc-guide',
  'active-directory-identity-security-guide': 'active-directory-complete-setup-guide',
  'endpoint-vulnerability-management-guide': 'vulnerability-management-program-guide',
  'enterprise-email-security-guide': 'email-security-gateway-basics',
  'forticlient-error-7200-fix': 'fortigate-ssl-vpn-checklist',
  'fortios-ssl-vpn-tunnel-mode-removal-ipsec-migration': 'vpn-basics-what-it-does',
  'windows-security-event-ids-soc': 'windows-event-viewer-security-logs',
  'dmarc-rollout-none-to-reject': 'spf-dkim-dmarc-email-basics',
  'kes-12-exclusions-kaspersky-security-center': 'kaspersky-security-center-tagging',
  'kerberoasting-detection-prevention': 'kerberos-authentication-explained',
  'exploited-vulnerabilities-roundup-august-2026': 'sonicwall-sma1000-ransomware-exploitation-2026',
};

const words = (text) => String(text || '').split(/\s+/).filter(Boolean).length;
const readTime = (body) => Math.max(3, Math.round(Math.max(words(body.ar), words(body.en)) / 200));

// ---------------------------------------------------------------- sections
function splitSections(md) {
  const parts = md.split(/^(?=## )/m);
  return parts.map((chunk) => ({ heading: (chunk.match(/^## (.*)$/m) || [])[1] || '', text: chunk }));
}
function demote(md) {
  return md.replace(/^(#{2,5}) /gm, (m, hashes) => `${hashes}# `);
}
function insertBeforeConclusion(body, addition) {
  const re = /^## (الخلاصة|Bottom line|المراجع|References)(?=\s|$).*$/m;
  const m = body.match(re);
  if (!m) return `${body.trimEnd()}\n\n${addition.trim()}\n`;
  return `${body.slice(0, m.index).trimEnd()}\n\n${addition.trim()}\n\n${body.slice(m.index)}`;
}

// ---------------------------------------------------------------- load
const articles = readJson('src/content/articles.json');
const comparisons = readJson('src/content/comparisons.json');
const { redirects } = readJson('src/config/content-redirects.json');
const bySlug = new Map(articles.map((a) => [a.slug, a]));

// 1) merges (only while the source still exists)
let merged = 0;
for (const merge of MERGES) {
  const source = bySlug.get(merge.from);
  const target = bySlug.get(merge.into);
  if (!source || !target) continue;
  for (const lang of ['ar', 'en']) {
    const sections = splitSections(source.body[lang]).filter((s) => s.heading);
    const kept = sections.filter((s) => (merge.only ? merge.only.test(s.heading) : !merge.skip.test(s.heading)));
    const addition = `## ${merge.heading[lang]}\n\n${kept.map((s) => demote(s.text).trim()).join('\n\n')}`;
    target.body[lang] = insertBeforeConclusion(target.body[lang], addition);
  }
  target.readTime = readTime(target.body);
  target.date = PUBLISH_DATE;
  merged += 1;
}

// 2) expansions
let expanded = 0;
const fg = bySlug.get('fortigate-ssl-vpn-checklist');
if (fg && !fg.body.ar.includes('FortiOS 7.6.3')) {
  for (const lang of ['ar', 'en']) {
    fg.body[lang] = FORTIGATE_SSLVPN_NOTICE[lang] + fg.body[lang].trimEnd() + FORTIGATE_SSLVPN_APPENDIX[lang];
  }
  fg.readTime = readTime(fg.body);
  fg.date = PUBLISH_DATE;
  expanded += 1;
}
const srw = bySlug.get('secure-remote-work-checklist');
SECURE_REMOTE_WORK.excerpt.en = 'Twelve practical controls for remote staff: secure access and MFA, device protection and encryption, updates, home networks, backups and lost devices.';
if (srw && !srw.body.ar.includes('12.')) {
  srw.title = SECURE_REMOTE_WORK.title;
  srw.excerpt = SECURE_REMOTE_WORK.excerpt;
  srw.body = SECURE_REMOTE_WORK.body;
  srw.readTime = readTime(srw.body);
  srw.date = PUBLISH_DATE;
  expanded += 1;
}

// 3) new articles
const contentDir = join(here, 'content');
const newArticles = [];
for (const file of readdirSync(contentDir).filter((f) => f.endsWith('.mjs')).sort()) {
  const mod = (await import(pathToFileURL(join(contentDir, file)).href)).default;
  newArticles.push(mod);
}
const pillarOrder = ['enterprise-network-security-guide', 'soc-incident-response-guide', 'active-directory-identity-security-guide', 'endpoint-vulnerability-management-guide', 'enterprise-email-security-guide'];
newArticles.sort((a, b) => (pillarOrder.indexOf(a.slug) + 1 || 99) - (pillarOrder.indexOf(b.slug) + 1 || 99) || a.slug.localeCompare(b.slug));

let added = 0;
newArticles.forEach((src, index) => {
  const existing = bySlug.get(src.slug);
  const hero = existing?.heroImage || bySlug.get(HERO_FROM[src.slug])?.heroImage || articles[0].heroImage;
  const topicIds = [...new Set([...(src.topicIds || []), ...(/email|dmarc/.test(src.slug) ? ['email-security'] : [])])];
  const record = {
    id: existing?.id || `art-p7-${String(index + 1).padStart(3, '0')}`,
    slug: src.slug,
    title: src.title,
    excerpt: src.excerpt,
    body: src.body,
    categoryId: src.categoryId,
    subcategoryId: src.subcategoryId,
    author: TEAM_AUTHOR,
    date: PUBLISH_DATE,
    readTime: readTime(src.body),
    heroImage: hero,
    tags: src.tags,
    isFeatured: Boolean(src.pillar),
    isTrending: false,
    domainIds: src.domainIds,
    topicIds,
    contentType: src.contentType === 'troubleshooting' ? 'troubleshooting' : (src.slug.includes('roundup') ? 'reference' : 'guide'),
    vendorIds: (src.vendorIds || []).filter((v) => KNOWN_VENDORS.has(v)),
    productIds: (src.productIds || []).map((x) => PRODUCT_ALIASES[x] || x).filter((x) => KNOWN_PRODUCTS.has(x)),
    technicalStatus: 'needs-review',
    translationStatus: 'unreviewed',
  };
  if (existing) Object.assign(existing, record);
  else {
    articles.unshift(record);
    added += 1;
  }
  bySlug.set(src.slug, existing || record);
});

// 4) remove redirected content
const redirectedArticles = new Set(Object.keys(redirects).filter((k) => k.startsWith('/article/')).map((k) => k.slice('/article/'.length)));
const redirectedComparisons = new Set(Object.keys(redirects).filter((k) => k.startsWith('/comparison/')).map((k) => k.slice('/comparison/'.length)));
for (const [from, to] of Object.entries(redirects)) {
  const m = to.match(/^\/article\/(.+)$/);
  if (m && !bySlug.has(m[1])) throw new Error(`redirect ${from} -> ${to}: target article missing`);
}
const keptArticles = articles.filter((a) => !redirectedArticles.has(a.slug));
const keptComparisons = comparisons.filter((c) => !redirectedComparisons.has(c.slug));

// 5) titles + avatars
let retitled = 0;
for (const article of keptArticles) {
  const fix = TITLE_FIXES[article.slug];
  if (fix && (article.title.ar !== fix[0] || article.title.en !== fix[1])) {
    article.title = { ar: fix[0], en: fix[1] };
    retitled += 1;
  }
  if (article.author) article.author = { ...article.author, avatar: '' };
}

// 5b) restore audit metadata on KEEP articles that never received it
// (pre-existing gap: phase5a-metadata.test.mjs failed on main for 10 records)
const audit = JSON.parse(readFileSync(join(root, '..', '..', 'docs', 'content-audit', 'phase3-content-audit.json'), 'utf8'));
let metadataFilled = 0;
const keptById = new Map([...keptArticles, ...keptComparisons].map((a) => [a.id, a]));
for (const record of audit.records) {
  if (record.proposedDisposition !== 'KEEP' || !['article', 'comparison'].includes(record.source)) continue;
  const article = keptById.get(record.id);
  if (!article || Array.isArray(article.domainIds)) continue;
  Object.assign(article, {
    domainIds: record.inferredDomains,
    topicIds: record.inferredTopics,
    contentType: record.inferredContentType,
    vendorIds: record.inferredVendors,
    productIds: record.inferredProducts,
    technicalStatus: 'needs-review',
    translationStatus: 'unreviewed',
  });
  metadataFilled += 1;
}

// 6) write
writeJson('src/content/articles.json', keptArticles);
writeJson('src/content/articles-index.json', keptArticles.map(({ body, ...rest }) => rest));
writeJson('src/content/comparisons.json', keptComparisons);

console.log(`[phase7] added=${added} merged=${merged} expanded=${expanded} retitled=${retitled} metadataFilled=${metadataFilled} ` +
  `removedArticles=${articles.length - keptArticles.length} removedComparisons=${comparisons.length - keptComparisons.length} ` +
  `articles=${keptArticles.length} comparisons=${keptComparisons.length}`);
