#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(appRoot, '..', '..');
const outputDirectory = join(repoRoot, 'docs', 'i18n');

const readJson = (name) => JSON.parse(readFileSync(join(appRoot, 'src', 'content', name), 'utf8'));
const articles = readJson('articles.json');
const comparisons = readJson('comparisons.json');
const pages = readJson('pages.json');

const arabicPattern = /[\u0600-\u06ff]/g;
const latinPattern = /[A-Za-z]/g;
// Fixed a deeper design gap documented after the substring bug fix above:
// standalone "قريبًا" (soon) used as ordinary, correctly-spelled temporal
// language in a normal-length sentence (e.g. "قد تحتاج للعودة لنسخة سابقة
// قريبًا" -- "you might need to revert to a previous version soon") was
// still false-flagged as unfinished placeholder content. Unlike English
// "coming soon," which is a fairly specific two-word phrase rarely used for
// anything else, Arabic "قريبًا" alone is common, ordinary temporal
// vocabulary -- so a bare word match can't reliably distinguish "this
// content isn't ready yet" from routine usage. Genuine placeholder text is
// also typically brief (a stand-in message, not embedded in a full
// article), so the fix restricts the Arabic pattern to only fire when the
// combined title+body text is short -- the word is plausibly the entire
// "coming soon" message itself, not one word inside an otherwise complete,
// substantial piece of writing.
const arabicSoonPattern = /(?<![\u0600-\u06FF])قريب[ًاا]/;
const placeholderPattern = /\b(?:todo|tbd|lorem ipsum|placeholder|coming soon)\b|تحت الإنشاء/i;
const ARABIC_SOON_MAX_CONTEXT_WORDS = 20;

export const PAIR_STATUS = Object.freeze({
  VALID: 'VALID_PAIR',
  REVIEW: 'REVIEW_PAIR',
  INVALID: 'INVALID_PAIR',
});

function countMatches(value, pattern) {
  return (String(value).match(pattern) ?? []).length;
}

function languageShare(value, language) {
  const text = String(value);
  const ar = countMatches(text, arabicPattern);
  const en = countMatches(text, latinPattern);
  const total = ar + en;
  if (!total) return 0;
  return (language === 'ar' ? ar : en) / total;
}

function wordCount(value) {
  return String(value).trim().split(/\s+/u).filter(Boolean).length;
}

function pairSignals({ title, summary, body }) {
  const arBody = String(body?.ar ?? '');
  const enBody = String(body?.en ?? '');
  const arWords = wordCount(arBody);
  const enWords = wordCount(enBody);
  const ratio = Math.min(arWords, enWords) / Math.max(1, Math.max(arWords, enWords));
  const reasons = [];

  if (wordCount(title?.ar) < 2 || wordCount(title?.en) < 2) reasons.push('missing-or-trivial-title');
  if (summary && (wordCount(summary.ar) < 3 || wordCount(summary.en) < 3)) reasons.push('missing-or-trivial-summary');
  if (arWords < 5 || enWords < 5) reasons.push('missing-or-trivial-body');
  if (arBody.trim() === enBody.trim()) reasons.push('identical-bodies');
  if (languageShare(arBody, 'ar') < 0.55) reasons.push('arabic-side-not-predominantly-arabic');
  if (languageShare(enBody, 'en') < 0.75) reasons.push('english-side-not-predominantly-english');
  const combinedText = `${title?.ar ?? ''} ${title?.en ?? ''} ${arBody} ${enBody}`;
  const combinedWordCount = wordCount(`${arBody} ${enBody}`);
  const hasGenericPlaceholder = placeholderPattern.test(combinedText);
  const hasShortArabicSoon = combinedWordCount <= ARABIC_SOON_MAX_CONTEXT_WORDS && arabicSoonPattern.test(combinedText);
  if (hasGenericPlaceholder || hasShortArabicSoon) reasons.push('placeholder-language');
  if (ratio < 0.25) reasons.push('suspicious-length-ratio');

  return {
    fieldComplete: reasons.every((reason) => !reason.startsWith('missing-')),
    automatedCandidate: reasons.length === 0,
    arWords,
    enWords,
    lengthRatio: Number(ratio.toFixed(3)),
    arLanguageShare: Number(languageShare(arBody, 'ar').toFixed(3)),
    enLanguageShare: Number(languageShare(enBody, 'en').toFixed(3)),
    signals: reasons,
  };
}

function classifyContent({ id, slug, kind, title, summary, body, translationStatus }) {
  const signals = pairSignals({ title, summary, body });
  const humanReviewed = translationStatus === 'reviewed';
  let status = PAIR_STATUS.REVIEW;
  let reason = 'Automated checks cannot establish technical or editorial translation equivalence.';
  let confidence = 'high';

  if (!signals.fieldComplete || signals.signals.some((signal) => signal !== 'suspicious-length-ratio')) {
    status = PAIR_STATUS.INVALID;
    reason = `Structural or language validation failed: ${signals.signals.join(', ')}.`;
  } else if (humanReviewed && signals.automatedCandidate) {
    status = PAIR_STATUS.VALID;
    reason = 'Automated checks passed and the record carries an explicit human-reviewed translation marker.';
  } else if (signals.automatedCandidate) {
    reason = 'Field-complete automated candidate, but no explicit human technical/editorial review is recorded.';
  } else {
    reason = `Requires review: ${signals.signals.join(', ')}.`;
  }

  return {
    id,
    slug,
    kind,
    route: kind === 'article' ? `/article/${slug}` : kind === 'comparison' ? `/comparison/${slug}` : `/page/${slug}`,
    status,
    reason,
    confidence,
    fieldComplete: signals.fieldComplete,
    automatedCandidate: signals.automatedCandidate,
    humanReviewed,
    metrics: signals,
  };
}

const articleRecords = articles.map((item) => classifyContent({
  ...item,
  kind: 'article',
  summary: item.excerpt,
  body: item.body,
}));

const comparisonRecords = comparisons.map((item) => classifyContent({
  ...item,
  kind: 'comparison',
  summary: item.excerpt,
  body: item.verdict,
}));

const staticPageRecords = pages.map((item) => classifyContent({
  ...item,
  kind: 'static-page',
  body: item.content,
}));

const sharedDiscoveryRoutes = [
  '/', '/articles', '/comparisons', '/videos', '/categories', '/search', '/troubleshooting', '/guides', '/tools', '/vendors',
];
const domainIds = ['cybersecurity', 'networking', 'infrastructure'];
const vendorIds = ['fortinet', 'palo-alto', 'cisco', 'microsoft', 'vmware', 'kaspersky', 'forcepoint', 'f5', 'beyondtrust', 'splunk', 'broadcom', 'trellix', 'rapid7', 'infoblox', 'sophos'];
const dynamicRecords = [
  ...sharedDiscoveryRoutes,
  ...domainIds.map((id) => `/domain/${id}`),
  ...vendorIds.map((id) => `/vendors/${id}`),
].map((route) => ({
  id: `route:${route}`,
  slug: route,
  kind: 'dynamic-discovery',
  route,
  status: PAIR_STATUS.REVIEW,
  reason: 'The shared route exists in both languages, but its complete rendered copy has not been human-reviewed as a translation pair.',
  confidence: 'high',
  fieldComplete: true,
  automatedCandidate: false,
  humanReviewed: false,
  metrics: null,
}));

const groups = {
  articles: articleRecords,
  comparisons: comparisonRecords,
  staticPages: staticPageRecords,
  dynamicDiscoveryPages: dynamicRecords,
};

function counts(records) {
  const result = Object.fromEntries(Object.values(PAIR_STATUS).map((status) => [status, 0]));
  for (const record of records) result[record.status] += 1;
  return result;
}

const allRecords = Object.values(groups).flat();
const report = {
  schemaVersion: 1,
  policy: {
    note: 'Heuristics detect obvious defects only. They do not prove semantic, technical, or editorial equivalence.',
    validPairGate: 'Explicit human-reviewed translation marker plus passing automated checks.',
    currentOwnerFinding: 'Existing translations are considered literal and technically unreliable until reviewed.',
    seoEffect: 'Only VALID_PAIR records may receive reciprocal hreflang or localized sitemap alternates.',
  },
  totals: { evaluated: allRecords.length, ...counts(allRecords) },
  byType: Object.fromEntries(Object.entries(groups).map(([name, records]) => [name, { evaluated: records.length, ...counts(records) }])),
  records: groups,
};

const percentage = (value, total) => `${((value / Math.max(1, total)) * 100).toFixed(1)}%`;
const rows = Object.entries(report.byType).map(([type, value]) =>
  `| ${type} | ${value.evaluated} | ${value.VALID_PAIR} (${percentage(value.VALID_PAIR, value.evaluated)}) | ${value.REVIEW_PAIR} (${percentage(value.REVIEW_PAIR, value.evaluated)}) | ${value.INVALID_PAIR} (${percentage(value.INVALID_PAIR, value.evaluated)}) |`,
).join('\n');
const notableInvalid = allRecords.filter((record) => record.status === PAIR_STATUS.INVALID).slice(0, 25);
const markdown = `# NetSec Atlas Phase 4C Translation Pair Audit\n\n> Automated validation is not human review. A field-complete pair is not necessarily a correct technical translation. The owner has identified the existing translations as literal and technically unreliable, so unreviewed pairs remain REVIEW_PAIR.\n\n## Policy\n\n- VALID_PAIR requires an explicit human-reviewed translation marker and passing structural checks.\n- REVIEW_PAIR is excluded from hreflang until technical/editorial review is recorded.\n- INVALID_PAIR is excluded because automated structural or language checks failed.\n- This report is development documentation and is not imported by the production application.\n\n## Results\n\n| Content type | Evaluated | VALID_PAIR | REVIEW_PAIR | INVALID_PAIR |\n| --- | ---: | ---: | ---: | ---: |\n${rows}\n\n**Total:** ${report.totals.evaluated} evaluated; ${report.totals.VALID_PAIR} valid; ${report.totals.REVIEW_PAIR} review; ${report.totals.INVALID_PAIR} invalid.\n\n## Important distinction\n\n- FIELD COMPLETE: required values exist.\n- AUTOMATED CANDIDATE: obvious script-detectable defects were not found.\n- HUMAN REVIEWED: a qualified reviewer explicitly approved technical and editorial equivalence.\n\nOnly the third state, combined with passing automated checks, is eligible for VALID_PAIR.\n\n## Invalid examples\n\n${notableInvalid.length ? notableInvalid.map((record) => `- \`${record.kind}:${record.slug}\` — ${record.reason}`).join('\n') : '- None detected by structural heuristics.'}\n`;

mkdirSync(outputDirectory, { recursive: true });
writeFileSync(join(outputDirectory, 'phase4c-translation-audit.json'), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(join(outputDirectory, 'phase4c-translation-audit.md'), markdown);
console.log(`[phase4c-i18n] ${report.totals.evaluated} pairs: ${report.totals.VALID_PAIR} valid, ${report.totals.REVIEW_PAIR} review, ${report.totals.INVALID_PAIR} invalid`);
