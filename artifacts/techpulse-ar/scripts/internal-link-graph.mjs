/**
 * Internal-link graph from the built site (dist/public + sitemap).
 *
 * Contextual inbound = <a href> inside <main>, excluding header/footer/nav/sitemap.
 * Click depth = BFS from /ar/ and /en/ over every same-site link (including nav/footer).
 *
 * Usage:
 *   node scripts/internal-link-graph.mjs
 *   node scripts/internal-link-graph.mjs --ci
 *   node scripts/internal-link-graph.mjs --json /tmp/link-graph-report.json
 */
import { readFileSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const appRoot = join(root, '..');
const ORIGIN = 'https://netsecatlas.com';

function parseArgs(argv) {
  const out = { ci: false, json: null, dist: join(appRoot, 'dist/public') };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--ci') out.ci = true;
    else if (argv[i] === '--json') out.json = argv[++i];
    else if (argv[i] === '--dist') out.dist = argv[++i];
  }
  return out;
}

function walkHtml(dir, rel = '') {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'downloads' || ent.name === 'assets' || ent.name === 'icons' || ent.name.startsWith('.')) {
      continue;
    }
    const next = rel ? `${rel}/${ent.name}` : ent.name;
    if (ent.isDirectory()) out.push(...walkHtml(join(dir, ent.name), next));
    else if (ent.name.endsWith('.html')) out.push(next);
  }
  return out;
}

function fileToPath(rel) {
  let p = rel.replace(/\\/g, '/');
  if (p.endsWith('/index.html')) p = p.slice(0, -'/index.html'.length);
  else if (p.endsWith('.html')) p = p.slice(0, -'.html'.length);
  if (p === 'index' || p === '') return '/';
  p = `/${p}`.replace(/\/$/, '');
  if (/^\/(ar|en)$/.test(p)) return `${p}/`;
  return p;
}

function normalizeHref(href, fromPath) {
  if (!href) return null;
  href = href.trim();
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
    return null;
  }
  let url;
  try {
    url = new URL(href, ORIGIN + fromPath);
  } catch {
    return null;
  }
  if (url.origin !== ORIGIN) return null;
  let path = url.pathname;
  if (path.endsWith('/index.html')) path = path.slice(0, -'/index.html'.length) || '/';
  if (path.endsWith('.html')) path = path.slice(0, -5);
  if (/^\/(ar|en)\/?$/.test(path)) return path.replace(/\/?$/, '/');
  if (path.length > 1) path = path.replace(/\/$/, '');
  return path;
}

function langOf(path) {
  const m = path.match(/^\/(ar|en)(?:\/|$)/);
  return m ? m[1] : null;
}

function robots(html) {
  const m = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
  return m ? m[1].toLowerCase() : '';
}

function isRedirect(html) {
  return /http-equiv=["']refresh["']/i.test(html) || /<script>location\.replace\(/.test(html);
}

function extractZones(html) {
  const hrefs = (chunk) => [...(chunk || '').matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]);
  const header = html.match(/<header\b[^>]*>[\s\S]*?<\/header>/i);
  const footer = html.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/i);
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i);
  return {
    header: header ? hrefs(header[0]) : [],
    footer: footer ? hrefs(footer[0]) : [],
    main: main ? hrefs(main[0]) : [],
  };
}

function sitemapPaths(dist) {
  const xml = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
  const sit = new Set();
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    let p = new URL(m[1]).pathname;
    if (/^\/(ar|en)$/.test(p)) p += '/';
    else if (p.length > 1) p = p.replace(/\/$/, '');
    sit.add(p);
  }
  return sit;
}

function add(map, key, val) {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(val);
}

function bfs(start, outMap, allowed) {
  const dist = new Map([[start, 0]]);
  const q = [start];
  while (q.length) {
    const cur = q.shift();
    const d = dist.get(cur);
    for (const n of outMap.get(cur) || []) {
      if (!dist.has(n) && allowed.has(n)) {
        dist.set(n, d + 1);
        q.push(n);
      }
    }
  }
  return dist;
}

function distribution(rows) {
  const d = {};
  for (const r of rows) {
    const k = r.inbound >= 10 ? '10+' : String(r.inbound);
    d[k] = (d[k] || 0) + 1;
  }
  return d;
}

export function buildGraph(dist) {
  if (!existsSync(join(dist, 'sitemap.xml'))) {
    throw new Error(`No sitemap at ${dist}/sitemap.xml — run the site build first`);
  }
  const sit = sitemapPaths(dist);
  const pages = [];
  const byPath = new Map();
  for (const rel of walkHtml(dist)) {
    if (rel === '404.html') continue;
    const html = readFileSync(join(dist, rel), 'utf8');
    if (isRedirect(html)) continue;
    if (/\bnoindex\b/.test(robots(html))) continue;
    const path = fileToPath(rel);
    if (byPath.has(path)) continue;
    const lang = langOf(path);
    if (!lang) continue;
    if (!sit.has(path) && !sit.has(path.replace(/\/$/, '')) && !sit.has(`${path}/`)) continue;
    const page = { path, lang, rel, html };
    pages.push(page);
    byPath.set(path, page);
  }

  const ctxIn = new Map();
  const allOut = new Map();
  const ctxOut = new Map();
  const indexablePaths = new Set(pages.map((p) => p.path));

  for (const p of pages) {
    const zones = extractZones(p.html);
    for (const href of [...zones.header, ...zones.footer, ...zones.main]) {
      const t = normalizeHref(href, p.path);
      if (!t || t === p.path) continue;
      add(allOut, p.path, t);
    }
    for (const href of zones.main) {
      const t = normalizeHref(href, p.path);
      if (!t || t === p.path) continue;
      add(ctxOut, p.path, t);
      add(ctxIn, t, p.path);
    }
  }

  const report = { generatedFrom: dist, languages: {} };
  for (const lang of ['ar', 'en']) {
    const group = pages.filter((p) => p.lang === lang);
    const home = `/${lang}/`;
    const depths = bfs(home, allOut, indexablePaths);
    const ctxDepths = bfs(home, ctxOut, indexablePaths);
    const rows = group.map((p) => {
      const sources = [...(ctxIn.get(p.path) || [])].sort();
      return {
        path: p.path,
        inbound: sources.length,
        sources,
        depth: depths.has(p.path) ? depths.get(p.path) : null,
        ctxDepth: ctxDepths.has(p.path) ? ctxDepths.get(p.path) : null,
      };
    });
    rows.sort((a, b) => a.inbound - b.inbound || a.path.localeCompare(b.path));
    const nonHome = rows.filter((r) => r.path !== home);
    const orphans = nonHome.filter((r) => r.inbound === 0).map((r) => r.path);
    const nearOrphans = nonHome.filter((r) => r.inbound === 1).map((r) => r.path);
    const below3 = nonHome.filter((r) => r.inbound < 3);
    const unreachable = rows.filter((r) => r.depth == null).map((r) => r.path);
    const tooDeep = rows.filter((r) => r.depth != null && r.depth > 3).map((r) => ({ path: r.path, depth: r.depth }));
    report.languages[lang] = {
      total: rows.length,
      distro: distribution(rows),
      orphan0: orphans,
      nearOrphan1: nearOrphans,
      below3: below3.map((r) => ({ path: r.path, inbound: r.inbound, sources: r.sources.slice(0, 8) })),
      below3Count: below3.length,
      maxDepth: Math.max(-1, ...rows.map((r) => r.depth ?? -1)),
      maxCtxDepth: Math.max(-1, ...rows.map((r) => r.ctxDepth ?? -1)),
      unreachable,
      tooDeep,
      depthCounts: rows.reduce((acc, r) => {
        const k = r.depth == null ? 'unreach' : String(r.depth);
        acc[k] = (acc[k] || 0) + 1;
        return acc;
      }, {}),
      rows,
    };
  }
  return report;
}

export function ciFailures(report) {
  const failures = [];
  for (const lang of ['ar', 'en']) {
    const d = report.languages[lang];
    if (!d) {
      failures.push(`missing language ${lang}`);
      continue;
    }
    for (const path of d.orphan0) failures.push(`${path}: 0 contextual inbound (orphan)`);
    for (const path of d.nearOrphan1) failures.push(`${path}: 1 contextual inbound (near-orphan)`);
    for (const row of d.below3) {
      if (row.inbound >= 2) failures.push(`${row.path}: ${row.inbound} contextual inbound (need ≥3)`);
    }
    for (const path of d.unreachable) failures.push(`${path}: unreachable from home (all-links depth)`);
    for (const row of d.tooDeep) failures.push(`${row.path}: click depth ${row.depth} (need ≤3)`);
  }
  return failures;
}

function printSummary(report) {
  for (const lang of ['ar', 'en']) {
    const d = report.languages[lang];
    console.log(`\n======== ${lang.toUpperCase()} indexable ${d.total} ========`);
    console.log('contextual inbound distribution:', d.distro);
    console.log('orphans (0 inbound ctx, excl home):', d.orphan0.length);
    console.log('near-orphans (1 inbound ctx):', d.nearOrphan1.length);
    console.log('pages with <3 contextual inbound (excl home):', d.below3Count);
    console.log('max click depth (all links from home):', d.maxDepth, 'unreachable:', d.unreachable.length, d.unreachable);
    console.log('max contextual-only depth:', d.maxCtxDepth);
    console.log('depth counts:', d.depthCounts);
    if (d.orphan0.length) console.log('orphans:', d.orphan0.join(', '));
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = buildGraph(args.dist);
  printSummary(report);
  if (args.json) {
    const slim = {
      generatedFrom: report.generatedFrom,
      languages: Object.fromEntries(
        Object.entries(report.languages).map(([lang, d]) => [
          lang,
          {
            total: d.total,
            distro: d.distro,
            orphan0: d.orphan0,
            nearOrphan1: d.nearOrphan1,
            below3Count: d.below3Count,
            below3: d.below3,
            maxDepth: d.maxDepth,
            maxCtxDepth: d.maxCtxDepth,
            unreachable: d.unreachable,
            tooDeep: d.tooDeep,
            depthCounts: d.depthCounts,
          },
        ]),
      ),
    };
    writeFileSync(args.json, JSON.stringify(slim, null, 2));
    console.log(`wrote ${args.json}`);
  }
  if (args.ci) {
    const failures = ciFailures(report);
    if (failures.length) {
      console.error(`\ninternal-link CI failed (${failures.length} issues):`);
      for (const line of failures.slice(0, 80)) console.error(`  - ${line}`);
      if (failures.length > 80) console.error(`  … ${failures.length - 80} more`);
      process.exit(1);
    }
    console.log('\ninternal-link CI ok: every indexable page has ≥3 contextual inbound and click depth ≤3 (homes exempt from inbound).');
  }
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) main();
