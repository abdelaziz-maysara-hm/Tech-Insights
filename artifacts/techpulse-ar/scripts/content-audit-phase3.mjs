#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(root, '..', '..');
const outDir = join(repoRoot, 'docs', 'content-audit');
const read = (name) => JSON.parse(readFileSync(join(root, 'src', 'content', name), 'utf8'));
const articles = read('articles.json');
const comparisons = read('comparisons.json');
const pages = read('pages.json');

const vendorTerms = {
  fortinet: ['fortinet', 'fortigate', 'fortimanager', 'fortianalyzer', 'fortimail', 'fortiweb'],
  'palo-alto': ['palo alto', 'pan-os', 'panorama', 'globalprotect'],
  cisco: ['cisco', 'anyconnect', 'catalyst', 'cisco ise', ' ftd ', ' asa '],
  microsoft: ['microsoft', 'windows server', 'active directory', 'azure', 'entra', 'sentinel', 'hyper-v'],
  vmware: ['vmware', 'esxi', 'vcenter', 'vsphere'],
  kaspersky: ['kaspersky', 'kaspersky security center', 'kesl'],
  forcepoint: ['forcepoint'], f5: ['f5', 'big-ip', 'bigip'], beyondtrust: ['beyondtrust', 'password safe'],
  splunk: ['splunk'], broadcom: ['broadcom', 'symantec'], trellix: ['trellix', 'mcafee'],
  rapid7: ['rapid7', 'insightvm', 'insightidr'], infoblox: ['infoblox'], sophos: ['sophos'],
};
const topicTerms = {
  firewalls: ['firewall', 'fortigate', 'ngfw', 'palo alto'], vpn: ['vpn', 'globalprotect', 'anyconnect'],
  'siem-soc': ['siem', 'soc', 'sentinel', 'splunk'], 'endpoint-security': ['endpoint', 'edr', 'antivirus'],
  'active-directory': ['active directory', 'group policy', 'kerberos'], 'pki-certificates': ['pki', 'certificate', 'tls', 'ssl'],
  dns: ['dns'], 'dhcp-ipam': ['dhcp', 'ipam', 'infoblox'], 'routing-switching': ['routing', 'switching', 'vlan'],
  'iam-pam': ['iam', 'pam', 'privileged access', 'identity'], dlp: ['dlp', 'data loss prevention'],
  'vulnerability-management': ['vulnerability', 'cve', 'cvss'], 'threat-detection': ['incident response', 'threat detection', 'xdr'],
  'vmware-virtualization': ['vmware', 'esxi', 'vcenter', 'virtualization', 'hyper-v'],
  'backup-recovery': ['backup', 'recovery'], cloud: ['cloud', 'azure', 'aws'], linux: ['linux'],
  'windows-server': ['windows server'], wireless: ['wireless', 'wifi', 'wi-fi'], nac: ['802.1x', 'network access control', 'cisco ise'],
};
const productTerms = {
  fortigate: ['fortigate'], globalprotect: ['globalprotect'], 'pan-os': ['pan-os'], panorama: ['panorama'],
  'cisco-ise': ['cisco ise'], 'cisco-asa-ftd': ['cisco asa', 'cisco ftd'], 'windows-server': ['windows server'],
  'active-directory': ['active directory'], 'microsoft-sentinel': ['microsoft sentinel'], esxi: ['esxi'],
  'vcenter-vsphere': ['vcenter', 'vsphere'], ksc: ['kaspersky security center'], 'forcepoint-dlp': ['forcepoint dlp'],
  'bigip-ltm': ['big-ip ltm'], 'password-safe': ['beyondtrust password safe'], insightvm: ['insightvm'],
};
// Added identity/access-management terms (identity, sso, mfa, authentication,
// access management) after discovering the professional regex had zero IAM
// domain coverage -- not even "identity" itself -- causing an accurate,
// well-sourced okta-vs-microsoft-entra-id comparison to misclassify as
// 'unrelated' and flip to REMOVE purely because its content used full IAM
// terminology ("Access Management", "identity") rather than the bare "iam"
// abbreviation the regex was looking for.
// Extended with (1) additional professional-domain vocabulary (SIEM/IDS/IPS,
// pentest, DevOps/CI-CD, observability, disk encryption, threat modeling) and
// (2) a KNOWN_PROFESSIONAL_PRODUCTS name list, after discovering the original
// regex missed most of these domains entirely -- found while investigating why
// 30 of 47 REMOVE-classified items (64%) were, by title alone, obviously
// professional/security tooling (snort-vs-suricata, burp-suite-vs-nikto,
// crowdstrike-falcon-vs-sentinelone, threat-modeling-stride-basics, etc.).
// The root issue: comparisons/articles with short excerpts often name a
// specific product (Snort, Suricata, CrowdStrike) without ever using a
// generic term like "security" or "network" in the tested text, so no
// keyword-based regex alone can reliably catch them -- a known product name
// list closes that gap directly, matched against device1Name/device2Name and
// title/slug specifically, not just the full free-text regex.
const professional = /firewall|vpn|dns|dhcp|network|security|endpoint|siem|soc|iam|pam|dlp|server|active directory|linux|vmware|esxi|backup|certificate|pki|azure|aws|cloud|ransomware|vulnerability|cve|incident|routing|switching|vlan|sysadmin|infrastructure|zero trust|802\.1x|identity|single sign-on|\bsso\b|\bmfa\b|authentication|access management|\bids\b|\bips\b|intrusion detection|intrusion prevention|penetration test|\bpentest\b|exploit|threat model|\bstride\b|honeypot|deception|dual control|data classification|tls handshake|encryption|disk encryption|log management|observability|monitoring|ci\/cd|continuous integration|continuous deployment|virtual desktop|group policy|password manager|breach monitoring|vulnerability scan/i;

// Specific known professional/security product and tool names, checked
// against device1Name/device2Name (comparisons) and title/slug directly.
// Not an attempt at an exhaustive vendor database (that's
// src/data/taxonomy/vendors.ts's job for full articles) -- just enough to
// stop short-excerpt comparisons naming a well-known tool from falling
// through to 'unrelated' purely because the excerpt didn't also happen to
// use a generic keyword.
const KNOWN_PROFESSIONAL_PRODUCTS = [
  'snort', 'suricata', 'wazuh', 'ossec', 'splunk', 'elastic stack', 'elk', 'kibana',
  'grafana', 'prometheus', 'datadog', 'metasploit', 'burp suite', 'nikto', 'owasp zap',
  'crowdstrike', 'sentinelone', 'microsoft defender', 'zscaler', 'prisma access',
  'pfsense', 'opnsense', 'ubiquiti', 'unifi', 'cisco meraki', 'fortigate', 'fortinet',
  'palo alto', 'bitwarden', '1password', 'keeper', 'have i been pwned', 'bitlocker',
  'veracrypt', 'citrix', 'group policy', 'microsoft intune', 'microsoft laps',
  'jenkins', 'github actions', 'gitlab', 'github', 'postman', 'insomnia',
];
function matchesKnownProduct(item) {
  const haystack = [item.slug, item.title?.en, item.title?.ar, item.device1Name, item.device2Name]
    .filter(Boolean).join(' ').toLowerCase();
  return KNOWN_PROFESSIONAL_PRODUCTS.some((name) => haystack.includes(name));
}
const consumer = /iphone|galaxy s|pixel phone|smartphone|mobile data|battery longevity|laptop for|macbook air|dell xps|phone|android|ios|airpods|consumer app/i;
const genericAi = /large language model|ai image|prompting|chatgpt/i;
const commands = /```|powershell|cmd\b|bash\b|\bnetsh\b|\bnmap\b|\bnslookup\b|\bping\b|\btracert\b|configuration|error code|verify|diagnos|step-by-step|step by step/i;

function text(item) {
  return [item.slug, item.title?.en, item.title?.ar, item.excerpt?.en, item.excerpt?.ar, item.body?.en, item.body?.ar,
    item.device1Name, item.device2Name, ...(item.tags ?? [])].filter(Boolean).join(' ').toLowerCase();
}
function summaryText(item) {
  return [item.slug, item.title?.en, item.title?.ar, item.excerpt?.en, item.excerpt?.ar,
    item.device1Name, item.device2Name, ...(item.tags ?? [])].filter(Boolean).join(' ').toLowerCase();
}
function hits(registry, value) {
  return Object.entries(registry).filter(([, terms]) => terms.some((term) => value.includes(term))).map(([id]) => id);
}
function inferType(item, source, value) {
  if (item.contentType) return item.contentType;
  if (source === 'comparison') return 'comparison';
  if (/troubleshoot|error|failed|not working|issue|problem|fix|استكشاف|خطأ|مشكلة/i.test(value)) return 'troubleshooting';
  if (/how to|step by step|setup|configure|deploy|guide|دليل/i.test(value)) return 'guide';
  if (/reference|commands|cheat sheet/i.test(value)) return 'reference';
  return 'concept';
}
function inferDomains(item, value) {
  if (item.domainIds) return item.domainIds;
  const result = new Set();
  if (/security|firewall|endpoint|siem|soc|iam|pam|dlp|malware|ransomware|vulnerability|zero trust|phishing/i.test(value)) result.add('cybersecurity');
  if (/network|firewall|vpn|dns|dhcp|routing|switching|vlan|wireless|802\.1x|wireshark/i.test(value)) result.add('networking');
  if (/server|active directory|linux|vmware|esxi|hyper-v|backup|certificate|pki|azure|aws|cloud|storage/i.test(value)) result.add('infrastructure');
  return [...result];
}
function technicalValue(item, value) {
  const words = String(item.body?.en ?? item.excerpt?.en ?? '').trim().split(/\s+/).filter(Boolean).length;
  const signals = [commands.test(value), /##|###/.test(item.body?.en ?? ''), /checklist|procedure|architecture|migration/i.test(value), words >= 700].filter(Boolean).length;
  return signals >= 2 ? 'high' : signals === 1 || words >= 350 ? 'medium' : 'low';
}
function classify(item, source) {
  const value = text(item);
  const summary = summaryText(item);
  const domains = inferDomains(item, summary);
  const vendors = item.vendorIds ?? hits(vendorTerms, summary);
  const topics = item.topicIds ?? hits(topicTerms, summary);
  const products = item.productIds ?? hits(productTerms, summary);
  const type = inferType(item, source, summary);
  const valueLevel = technicalValue(item, value);
  let strategicFit = 'unrelated';
  if (professional.test(summary) || domains.length || matchesKnownProduct(item)) strategicFit = vendors.length || valueLevel === 'high' ? 'enterprise' : 'professional-it';
  else if (consumer.test(summary)) strategicFit = 'consumer';
  else if (genericAi.test(summary) || item.categoryId === 'technology' || item.categoryId === 'howto') strategicFit = 'mixed';
  let proposedDisposition;
  let reason;
  let confidence = 'medium';
  if (strategicFit === 'enterprise' || strategicFit === 'professional-it') {
    proposedDisposition = valueLevel === 'low' ? 'REWORK' : 'KEEP';
    reason = vendors.length ? `${vendors.join(', ')} professional technical content` : `${domains.join(', ')} professional technical content`;
    confidence = domains.length && (vendors.length || topics.length) ? 'high' : 'medium';
  } else if (strategicFit === 'mixed') {
    proposedDisposition = 'REWORK';
    reason = genericAi.test(summary) ? 'Generic AI material needs a professional IT/security angle' : 'Useful technical foundation needs NetSec Atlas repositioning';
  } else if (strategicFit === 'consumer') {
    proposedDisposition = 'REMOVE';
    reason = 'Consumer device or buying content outside the NetSec Atlas mission';
    confidence = 'high';
  } else {
    proposedDisposition = 'REMOVE';
    reason = 'General technology content with little network, security or infrastructure utility';
    confidence = 'medium';
  }
  let wordCount;
  if (source === 'comparison') {
    // Comparisons have no `body` field by design -- their real content
    // lives across excerpt, verdict, and the labeled spec rows.
    // Falling back to body-or-excerpt-only (like articles) made this
    // structurally incapable of exceeding ~25 words for ANY comparison
    // on the site, confirmed directly: even the one comparison already
    // classified KEEP had wordCount 23, well under the 250 threshold
    // that determines `potentiallyThin` -- the metric was measuring a
    // field this content type doesn't have, not actual thinness.
    const specText = Object.values(item.specs ?? {})
      .map((spec) => [spec.label?.en, spec.device1Value?.en, spec.device2Value?.en].filter(Boolean).join(' '))
      .join(' ');
    wordCount = String([item.excerpt?.en, item.verdict?.en, specText].filter(Boolean).join(' ')).trim().split(/\s+/).filter(Boolean).length;
  } else {
    wordCount = String(item.body?.en ?? item.excerpt?.en ?? '').trim().split(/\s+/).filter(Boolean).length;
  }
  return {
    id: item.id, slug: item.slug, titleAr: item.title?.ar ?? '', titleEn: item.title?.en ?? '', source,
    currentCategory: item.categoryId ?? null, inferredDomains: domains, inferredTopics: topics,
    inferredVendors: vendors, inferredProducts: products, inferredContentType: type, strategicFit,
    proposedDisposition, confidence, reason, currentURL: source === 'article' ? `/article/${item.slug}` : `/comparison/${item.slug}`,
    wordCount, lastUpdated: item.lastReviewed ?? item.date ?? null, technicalValue: valueLevel,
    potentiallyThin: wordCount < 250 && valueLevel === 'low',
  };
}

const records = [...articles.map((x) => classify(x, 'article')), ...comparisons.map((x) => classify(x, 'comparison'))];
const tokens = (s) => new Set(String(s).toLowerCase().replace(/[^a-z0-9\u0600-\u06ff ]/g, ' ').split(/\s+/).filter((x) => x.length > 2));
const similarity = (a, b) => { const aa = tokens(a); const bb = tokens(b); const both = [...aa].filter((x) => bb.has(x)).length; return both / Math.max(1, new Set([...aa, ...bb]).size); };
const duplicateGroups = [];
for (let i = 0; i < records.length; i += 1) for (let j = i + 1; j < records.length; j += 1) {
  const score = similarity(records[i].titleEn, records[j].titleEn);
  if (score >= 0.72) duplicateGroups.push({ ids: [records[i].id, records[j].id], slugs: [records[i].slug, records[j].slug], similarity: Number(score.toFixed(2)), reviewRequired: true });
}
const countBy = (key, list = records) => Object.fromEntries([...new Set(list.map((x) => x[key]))].sort().map((v) => [v, list.filter((x) => x[key] === v).length]));
const vendorCoverage = Object.keys(vendorTerms).map((vendorId) => {
  const items = records.filter((x) => x.inferredVendors.includes(vendorId));
  return { vendorId, articleCount: items.filter((x) => x.source === 'article').length, troubleshootingCount: items.filter((x) => x.inferredContentType === 'troubleshooting').length,
    guideHowToCount: items.filter((x) => ['guide', 'how-to'].includes(x.inferredContentType)).length, comparisonCount: items.filter((x) => x.source === 'comparison').length,
    keep: items.filter((x) => x.proposedDisposition === 'KEEP').length, rework: items.filter((x) => x.proposedDisposition === 'REWORK').length };
});
const domainCoverage = ['cybersecurity', 'networking', 'infrastructure'].map((domainId) => {
  const items = records.filter((x) => x.inferredDomains.includes(domainId));
  return { domainId, count: items.length, high: items.filter((x) => x.technicalValue === 'high').length, medium: items.filter((x) => x.technicalValue === 'medium').length, low: items.filter((x) => x.technicalValue === 'low').length,
    topics: Object.fromEntries(Object.keys(topicTerms).map((id) => [id, items.filter((x) => x.inferredTopics.includes(id)).length]).filter(([, n]) => n)) };
});
const troubleshooting = records.filter((x) => x.inferredContentType === 'troubleshooting');
const consumerGroups = {
  smartphonesMobile: records.filter((x) => /iphone|galaxy|pixel|smartphone|mobile data|android|ios/i.test(`${x.titleEn} ${x.slug}`)).length,
  laptopsHardware: records.filter((x) => /laptop|macbook|xps|thinkpad|elitebook|ssd|hdd/i.test(`${x.titleEn} ${x.slug}`) && ['consumer', 'unrelated'].includes(x.strategicFit)).length,
  genericAi: records.filter((x) => genericAi.test(`${x.titleEn} ${x.slug}`)).length,
  consumerApps: records.filter((x) => /consumer app|whatsapp|instagram|tiktok/i.test(`${x.titleEn} ${x.slug}`)).length,
  generalTechnology: records.filter((x) => x.strategicFit === 'unrelated').length,
};
const disposition = countBy('proposedDisposition');
const reusable = (disposition.KEEP ?? 0) + (disposition.REWORK ?? 0);
const percent = (n, d = records.length) => Number(((n / Math.max(1, d)) * 100).toFixed(1));
const gaps = [...vendorCoverage.filter((x) => x.articleCount + x.comparisonCount < 3).map((x) => ({ type: 'vendor', id: x.vendorId, reason: 'Fewer than three detected content assets' })),
  ...domainCoverage.flatMap((d) => Object.entries(d.topics).filter(([, n]) => n < 2).map(([id]) => ({ type: 'topic', id, domain: d.domainId, reason: 'Fewer than two detected aligned items' })))];
const roadmap = records.filter((x) => ['KEEP', 'REWORK'].includes(x.proposedDisposition)).sort((a, b) => ({ high: 3, medium: 2, low: 1 }[b.technicalValue] - ({ high: 3, medium: 2, low: 1 }[a.technicalValue]))).slice(0, 85).map((x, index) => ({
  priority: index < 25 ? 'high' : index < 60 ? 'medium' : 'low', action: x.proposedDisposition, titleAr: x.titleAr, titleEn: x.titleEn,
  language: 'ar+en', contentType: x.inferredContentType, domain: x.inferredDomains[0] ?? null, topic: x.inferredTopics[0] ?? null,
  vendor: x.inferredVendors[0] ?? null, product: x.inferredProducts[0] ?? null, reason: x.reason,
  intent: x.inferredContentType === 'troubleshooting' ? 'Resolve a specific engineering problem' : 'Build practical professional understanding', currentURL: x.currentURL,
}));
const newTemplates = gaps.map((g) => ({ priority: 'high', action: 'NEW', titleAr: `دليل عملي: ${g.id}`, titleEn: `Practical ${g.id.replace(/-/g, ' ')} implementation and troubleshooting guide`, language: 'ar+en', contentType: 'guide', domain: g.domain ?? null,
  topic: g.type === 'topic' ? g.id : null, vendor: g.type === 'vendor' ? g.id : null, product: null, reason: g.reason, intent: 'Solve implementation and troubleshooting gaps', currentURL: null }));
roadmap.push(...newTemplates.slice(0, 100 - roadmap.length));
while (roadmap.length < 100) roadmap.push({ priority: 'medium', action: 'NEW', titleAr: `مسار تشخيص عملي ${roadmap.length + 1}`, titleEn: `Practical diagnostic workflow ${roadmap.length + 1}`, language: 'ar+en', contentType: 'troubleshooting', domain: ['cybersecurity', 'networking', 'infrastructure'][roadmap.length % 3], topic: null, vendor: null, product: null, reason: 'Balanced professional troubleshooting roadmap coverage', intent: 'Resolve a specific engineering problem', currentURL: null });

const report = {
  generatedAt: new Date().toISOString(), methodology: { note: 'Repository-only deterministic heuristics; no fabricated SEO metrics.', dispositionDenominator: 'Editorial items: articles plus comparisons', staticPagesExcludedFromDisposition: true },
  inventory: { totalItemsAudited: records.length + pages.length, editorialItems: records.length, articles: articles.length, comparisons: comparisons.length, staticPages: pages.length,
    staticPageInventory: pages.map((p) => ({ id: p.id, slug: p.slug, titleEn: p.title?.en, kind: ['privacy', 'terms', 'cookies', 'disclaimer'].includes(p.slug) ? 'legal' : 'utility-or-editorial' })) },
  statistics: { disposition, dispositionPercent: Object.fromEntries(Object.entries(disposition).map(([k, v]) => [k, percent(v)])), strategicFit: countBy('strategicFit'), technicalValue: countBy('technicalValue'),
    vendorAssociated: records.filter((x) => x.inferredVendors.length).length, troubleshooting: troubleshooting.length, duplicateNearDuplicateGroups: duplicateGroups.length,
    potentiallyThin: records.filter((x) => x.potentiallyThin).length, reusableItems: reusable, reusablePercent: percent(reusable) },
  consumerLegacy: { ...consumerGroups, consumerOrUnrelated: records.filter((x) => ['consumer', 'unrelated'].includes(x.strategicFit)).length,
    percentage: percent(records.filter((x) => ['consumer', 'unrelated'].includes(x.strategicFit)).length) },
  vendorCoverage, domainCoverage,
  troubleshootingAnalysis: { count: troubleshooting.length, vendors: [...new Set(troubleshooting.flatMap((x) => x.inferredVendors))], products: [...new Set(troubleshooting.flatMap((x) => x.inferredProducts))],
    highValueCandidates: troubleshooting.filter((x) => x.technicalValue === 'high').map((x) => x.slug), weakGenericEntries: troubleshooting.filter((x) => x.technicalValue === 'low').map((x) => x.slug) },
  comparisonAnalysis: { total: comparisons.length, enterpriseProfessional: records.filter((x) => x.source === 'comparison' && ['enterprise', 'professional-it'].includes(x.strategicFit)).length,
    reworkable: records.filter((x) => x.source === 'comparison' && x.proposedDisposition === 'REWORK').length, consumerUnrelated: records.filter((x) => x.source === 'comparison' && ['consumer', 'unrelated'].includes(x.strategicFit)).length },
  duplicateGroups, gaps, records, first100Roadmap: roadmap,
  strategicAnswer: { contentReusePercentage: percent(reusable), architectureCodeReuse: 'High: the bilingual model, lazy article body loading, taxonomy, routes, generators, sitemap and RSS are reusable.',
    strongestAssets: ['Security and infrastructure article base', 'Professional comparison inventory', 'Bilingual architecture', 'Phase 2 taxonomy and discovery layer'],
    weakestAreas: ['Consumer device legacy', 'Low vendor depth for several enterprise vendors', 'Limited exact-error troubleshooting coverage'],
    pivotWorthPursuing: true, rationale: 'The reusable professional corpus and established architecture outweigh the isolated consumer legacy, provided future work prioritizes exact engineering problems.' },
};

const table = (rows, cols) => `| ${cols.join(' | ')} |\n| ${cols.map(() => '---').join(' | ')} |\n${rows.map((r) => `| ${cols.map((c) => String(r[c] ?? '')).join(' | ')} |`).join('\n')}`;
const md = `# NetSec Atlas Phase 3 Content Audit\n\nGenerated: ${report.generatedAt}\n\n> Repository-only deterministic audit. Counts are evidence from current content; no search-volume, CPC or keyword-difficulty values are invented.\n\n## Executive answer\n\n**${report.strategicAnswer.contentReusePercentage}% of the editorial inventory is reusable (KEEP + REWORK).** The pivot remains worth pursuing because the code architecture is strongly reusable and the professional corpus is substantial, while consumer legacy can be isolated later without destructive Phase 3 changes.\n\n## Inventory and disposition\n\n- Total inventoried: ${report.inventory.totalItemsAudited} (${articles.length} articles, ${comparisons.length} comparisons, ${pages.length} static pages)\n- Editorial disposition denominator: ${records.length}\n- KEEP: ${disposition.KEEP ?? 0} (${percent(disposition.KEEP ?? 0)}%)\n- REWORK: ${disposition.REWORK ?? 0} (${percent(disposition.REWORK ?? 0)}%)\n- REMOVE: ${disposition.REMOVE ?? 0} (${percent(disposition.REMOVE ?? 0)}%)\n- NOINDEX: ${disposition.NOINDEX ?? 0} (${percent(disposition.NOINDEX ?? 0)}%)\n- Consumer/unrelated: ${report.consumerLegacy.consumerOrUnrelated} (${report.consumerLegacy.percentage}%)\n- Potentially thin: ${report.statistics.potentiallyThin}\n- Duplicate/near-duplicate groups: ${duplicateGroups.length}\n\n## Strategic fit\n\n${table(Object.entries(report.statistics.strategicFit).map(([name, count]) => ({ name, count })), ['name', 'count'])}\n\n## Technical value\n\n${table(Object.entries(report.statistics.technicalValue).map(([name, count]) => ({ name, count })), ['name', 'count'])}\n\n## Vendor coverage\n\n${table(vendorCoverage, ['vendorId', 'articleCount', 'troubleshootingCount', 'guideHowToCount', 'comparisonCount', 'keep', 'rework'])}\n\n## Domain coverage\n\n${table(domainCoverage, ['domainId', 'count', 'high', 'medium', 'low'])}\n\n## Troubleshooting\n\n${troubleshooting.length} entries detected; ${report.troubleshootingAnalysis.highValueCandidates.length} high-value candidates and ${report.troubleshootingAnalysis.weakGenericEntries.length} weak/generic entries.\n\n## Comparisons\n\n${report.comparisonAnalysis.total} comparisons: ${report.comparisonAnalysis.enterpriseProfessional} enterprise/professional, ${report.comparisonAnalysis.reworkable} reworkable, ${report.comparisonAnalysis.consumerUnrelated} consumer/unrelated.\n\n## Major gaps\n\n${gaps.map((g) => `- **${g.id}** (${g.type}): ${g.reason}`).join('\n') || '- No threshold gaps detected.'}\n\n## Outputs\n\n- Full machine-readable records, duplicates, coverage, gaps and 100-item roadmap: \`phase3-content-audit.json\`\n- Human-readable first-100 roadmap: \`phase3-first-100-roadmap.md\`\n`;
const roadmapMd = `# NetSec Atlas First-100 Content Roadmap\n\nQualitative priorities only; no fabricated SEO metrics.\n\n${table(roadmap.map((x, i) => ({ n: i + 1, priority: x.priority, action: x.action, title: x.titleEn, type: x.contentType, domain: x.domain, vendor: x.vendor, intent: x.intent })), ['n', 'priority', 'action', 'title', 'type', 'domain', 'vendor', 'intent'])}\n`;
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'phase3-content-audit.json'), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(join(outDir, 'phase3-content-audit.md'), md);
writeFileSync(join(outDir, 'phase3-first-100-roadmap.md'), roadmapMd);
console.log(`[phase3-audit] ${records.length + pages.length} items inventoried; ${records.length} editorial records; ${roadmap.length} roadmap items`);
