import assert from 'node:assert/strict';
import test from 'node:test';
import {
  allocateVlsm,
  formatIPv4,
  maskToPrefix,
  parseCidr,
  parseIPv4,
  parseRangeInput,
  prefixForHosts,
  prefixToMask,
  prefixToWildcard,
  rangeToCidrs,
  subnetInfo,
  wildcardToPrefix,
} from '../src/lib/tools/ipv4.ts';
import { analyzeSpf, isValidIPv6 } from '../src/lib/tools/spf.ts';
import { analyzeDmarc, buildDmarc, isValidFo, testModePolicy } from '../src/lib/tools/dmarc.ts';
import { normalizeTxtInput } from '../src/lib/tools/txtRecord.ts';

const ip = (value: string) => {
  const parsed = parseIPv4(value);
  assert.notEqual(parsed, null, value);
  return parsed as number;
};
const cidrs = (start: string, end: string) =>
  rangeToCidrs(ip(start), ip(end)).map((block) => `${formatIPv4(block.network)}/${block.prefix}`);
const codes = (issues: { code: string }[]) => issues.map((issue) => issue.code);

test('parses and formats IPv4 strictly', () => {
  assert.equal(parseIPv4('0.0.0.0'), 0);
  assert.equal(parseIPv4('255.255.255.255'), 2 ** 32 - 1);
  assert.equal(parseIPv4('192.168.1.10'), 3232235786);
  assert.equal(formatIPv4(3232235786), '192.168.1.10');
  for (const bad of ['256.1.1.1', '1.2.3', '1.2.3.4.5', '01.2.3.4', 'a.b.c.d', '1.2.3.-4', '']) {
    assert.equal(parseIPv4(bad), null, bad);
  }
});

test('converts masks, wildcards and prefixes', () => {
  assert.equal(formatIPv4(prefixToMask(24)), '255.255.255.0');
  assert.equal(formatIPv4(prefixToMask(0)), '0.0.0.0');
  assert.equal(formatIPv4(prefixToMask(32)), '255.255.255.255');
  assert.equal(formatIPv4(prefixToMask(19)), '255.255.224.0');
  assert.equal(formatIPv4(prefixToWildcard(24)), '0.0.0.255');
  assert.equal(formatIPv4(prefixToWildcard(22)), '0.0.3.255');
  assert.equal(maskToPrefix(ip('255.255.255.192')), 26);
  assert.equal(maskToPrefix(ip('255.0.255.0')), null);
  assert.equal(wildcardToPrefix(ip('0.0.0.63')), 26);
  assert.equal(wildcardToPrefix(ip('0.0.0.5')), null);
});

test('computes subnet details including /31 and /32', () => {
  const s = subnetInfo(ip('192.168.10.77'), 26);
  assert.equal(formatIPv4(s.network), '192.168.10.64');
  assert.equal(formatIPv4(s.broadcast), '192.168.10.127');
  assert.equal(formatIPv4(s.firstHost), '192.168.10.65');
  assert.equal(formatIPv4(s.lastHost), '192.168.10.126');
  assert.equal(s.usableHosts, 62);
  assert.equal(subnetInfo(ip('10.0.0.0'), 8).usableHosts, 16777214);
  const p2p = subnetInfo(ip('10.1.1.1'), 31);
  assert.equal(p2p.usableHosts, 2);
  assert.equal(formatIPv4(p2p.firstHost), '10.1.1.0');
  assert.equal(subnetInfo(ip('10.1.1.1'), 32).usableHosts, 1);
  const parsed = parseCidr('172.16.5.9/255.255.240.0');
  assert.deepEqual(parsed && [formatIPv4(parsed.network), parsed.prefix], ['172.16.0.0', 20]);
  assert.equal(parseCidr('10.0.0.0/33'), null);
});

test('picks the smallest VLSM block for a host count', () => {
  assert.equal(prefixForHosts(1), 30);
  assert.equal(prefixForHosts(2), 30);
  assert.equal(prefixForHosts(3), 29);
  assert.equal(prefixForHosts(62), 26);
  assert.equal(prefixForHosts(63), 25);
  assert.equal(prefixForHosts(254), 24);
  assert.equal(prefixForHosts(0), null);
});

test('allocates a textbook VLSM plan largest-first', () => {
  const result = allocateVlsm('192.168.1.0/24', [
    { name: 'WAN', hosts: 2 },
    { name: 'Sales', hosts: 50 },
    { name: 'HR', hosts: 10 },
    { name: 'Eng', hosts: 100 },
  ]);
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.deepEqual(
    result.allocations.map((a) => `${a.name} ${formatIPv4(a.network)}/${a.prefix}`),
    ['Eng 192.168.1.0/25', 'Sales 192.168.1.128/26', 'HR 192.168.1.192/28', 'WAN 192.168.1.208/30'],
  );
  assert.equal(result.usedAddresses, 212);
  assert.deepEqual(result.freeRanges.map((r) => `${formatIPv4(r.start)}-${formatIPv4(r.end)}`), [
    '192.168.1.212-192.168.1.255',
  ]);
  assert.equal(result.allocations[0].wasted, 26);
});

test('rejects VLSM plans that do not fit or have bad input', () => {
  const tooBig = allocateVlsm('10.0.0.0/26', [{ name: 'A', hosts: 40 }, { name: 'B', hosts: 30 }]);
  assert.deepEqual(tooBig, { ok: false, error: 'does-not-fit', detail: 'B' });
  assert.equal(allocateVlsm('10.0.0.0/30', [{ name: 'A', hosts: 5 }]).ok, false);
  assert.deepEqual(allocateVlsm('nope', [{ name: 'A', hosts: 1 }]), { ok: false, error: 'invalid-base' });
  assert.deepEqual(allocateVlsm('10.0.0.0/24', []), { ok: false, error: 'no-requests' });
  const normalized = allocateVlsm('10.0.0.77/24', [{ name: 'A', hosts: 10 }]);
  assert.ok(normalized.ok && formatIPv4(normalized.allocations[0].network) === '10.0.0.0');
});

test('summarizes IP ranges into minimal CIDR blocks', () => {
  assert.deepEqual(cidrs('192.168.1.0', '192.168.1.255'), ['192.168.1.0/24']);
  assert.deepEqual(cidrs('10.0.0.1', '10.0.0.6'), ['10.0.0.1/32', '10.0.0.2/31', '10.0.0.4/31', '10.0.0.6/32']);
  assert.deepEqual(cidrs('192.168.0.0', '192.168.3.255'), ['192.168.0.0/22']);
  assert.deepEqual(cidrs('192.168.1.100', '192.168.1.200'), [
    '192.168.1.100/30', '192.168.1.104/29', '192.168.1.112/28', '192.168.1.128/26',
    '192.168.1.192/29', '192.168.1.200/32',
  ]);
  assert.deepEqual(cidrs('0.0.0.0', '255.255.255.255'), ['0.0.0.0/0']);
  assert.deepEqual(cidrs('255.255.255.255', '255.255.255.255'), ['255.255.255.255/32']);
});

test('parses range inputs in several notations', () => {
  assert.deepEqual(parseRangeInput('10.0.0.5 - 10.0.0.9'), { ok: true, start: ip('10.0.0.5'), end: ip('10.0.0.9'), source: 'range' });
  assert.deepEqual(parseRangeInput('10.0.0.9-10.0.0.5'), { ok: false, error: 'reversed' });
  const cidr = parseRangeInput('10.0.0.77/28');
  assert.ok(cidr.ok && formatIPv4(cidr.start) === '10.0.0.64' && formatIPv4(cidr.end) === '10.0.0.79');
  assert.equal(parseRangeInput('garbage').ok, false);
});

test('joins quoted multi-string TXT values', () => {
  assert.equal(normalizeTxtInput('"v=spf1 ip4:192.0.2.0/24 " "-all"').value, 'v=spf1 ip4:192.0.2.0/24 -all');
  assert.equal(normalizeTxtInput('  v=spf1   mx  -all ').value, 'v=spf1 mx -all');
});

test('validates IPv6 literals used in ip6 mechanisms', () => {
  for (const good of ['2001:db8::', '::1', '2001:db8:0:0:0:0:0:1', '::ffff:192.0.2.1', 'fe80::1']) {
    assert.ok(isValidIPv6(good), good);
  }
  for (const bad of ['2001:db8:::1', '1:2:3:4:5:6:7:8:9', 'g::1', '192.0.2.1', '1::2::3']) {
    assert.ok(!isValidIPv6(bad), bad);
  }
});

test('accepts a clean SPF record and counts DNS lookups', () => {
  const r = analyzeSpf('v=spf1 ip4:192.0.2.0/24 ip6:2001:db8::/32 mx include:_spf.example.net -all');
  assert.equal(r.valid, true);
  assert.equal(r.lookupCount, 2);
  assert.equal(r.allQualifier, '-');
  assert.ok(!codes(r.issues).includes('no-all-no-redirect'));
});

test('flags SPF errors and RFC 7208 pitfalls', () => {
  assert.ok(codes(analyzeSpf('spf1 -all').issues).includes('no-version'));
  assert.ok(codes(analyzeSpf('v=spf1 +all').issues).includes('plus-all'));
  assert.ok(codes(analyzeSpf('v=spf1 mx').issues).includes('no-all-no-redirect'));
  assert.ok(codes(analyzeSpf('v=spf1 ptr -all').issues).includes('ptr-discouraged'));
  assert.ok(codes(analyzeSpf('v=spf1 ip4:300.1.1.1 -all').issues).includes('invalid-ip4'));
  assert.ok(codes(analyzeSpf('v=spf1 ip4:10.0.0.0/33 -all').issues).includes('invalid-cidr'));
  assert.ok(codes(analyzeSpf('v=spf1 include -all').issues).includes('missing-domain'));
  assert.ok(codes(analyzeSpf('v=spf1 foo:bar -all').issues).includes('unknown-mechanism'));
  assert.ok(codes(analyzeSpf('v=spf1 redirect=a.example redirect=b.example').issues).includes('duplicate-modifier'));
  assert.ok(codes(analyzeSpf('v=spf1 -all v=spf1 mx -all').issues).includes('multiple-records'));

  const after = analyzeSpf('v=spf1 -all include:late.example');
  assert.ok(codes(after.issues).includes('terms-after-all'));
  assert.equal(after.lookupCount, 0);

  const redirected = analyzeSpf('v=spf1 mx redirect=_spf.example ~all');
  assert.ok(codes(redirected.issues).includes('redirect-ignored'));
  assert.equal(redirected.lookupCount, 1);

  const redirectOnly = analyzeSpf('v=spf1 redirect=_spf.example');
  assert.equal(redirectOnly.lookupCount, 1);
  assert.equal(redirectOnly.valid, true);
});

test('enforces the 10 DNS-lookup limit', () => {
  const eleven = `v=spf1 ${Array.from({ length: 11 }, (_, i) => `include:s${i}.example`).join(' ')} -all`;
  const r = analyzeSpf(eleven);
  assert.equal(r.lookupCount, 11);
  assert.equal(r.valid, false);
  assert.ok(codes(r.issues).includes('too-many-lookups'));
  const nine = analyzeSpf('v=spf1 a mx ptr exists:%{i}.x.example include:a.example include:b.example include:c.example include:d.example include:e.example -all');
  assert.equal(nine.lookupCount, 9);
  assert.ok(codes(nine.issues).includes('near-lookup-limit'));
  // ip4/ip6/all do not count
  assert.equal(analyzeSpf(`v=spf1 ${Array.from({ length: 20 }, (_, i) => `ip4:10.0.${i}.0/24`).join(' ')} -all`).lookupCount, 0);
});

test('flags oversized quoted TXT strings', () => {
  const long = `"v=spf1 ${'ip4:192.0.2.1 '.repeat(20)}-all"`;
  assert.ok(codes(analyzeSpf(long).issues).includes('string-too-long'));
});

test('parses a valid RFC 9989 DMARC record', () => {
  const r = analyzeDmarc('v=DMARC1; p=reject; sp=quarantine; np=reject; adkim=s; rua=mailto:dmarc@example.com,mailto:x@example.net; ruf=mailto:f@example.com; fo=1:d');
  assert.equal(r.usable, true);
  assert.deepEqual(r.issues.filter((i) => i.severity !== 'info'), []);
  assert.equal(r.effective.p, 'reject');
  assert.equal(r.effective.sp, 'quarantine');
  assert.equal(r.effective.np, 'reject');
  assert.equal(r.effective.adkim, 's');
  assert.equal(r.effective.aspf, 'r');
  assert.deepEqual(r.effective.rua, ['mailto:dmarc@example.com', 'mailto:x@example.net']);
});

test('applies RFC 9989 inheritance and defaults', () => {
  const r = analyzeDmarc('"v=DMARC1; p=quarantine; rua=mailto:a@example.com"');
  assert.equal(r.effective.sp, 'quarantine');
  assert.equal(r.effective.np, 'quarantine');
  assert.ok(codes(r.issues).includes('no-np'));
  const spOnly = analyzeDmarc('v=DMARC1; p=reject; sp=none; rua=mailto:a@example.com');
  assert.equal(spOnly.effective.np, 'none');
  const missingP = analyzeDmarc('v=DMARC1; rua=mailto:a@example.com');
  assert.equal(missingP.usable, true);
  assert.equal(missingP.effective.p, 'none');
  assert.ok(codes(missingP.issues).includes('missing-p'));
});

test('rejects records whose v tag is missing, misplaced or wrong case', () => {
  assert.equal(analyzeDmarc('p=reject; v=DMARC1').usable, false);
  assert.ok(codes(analyzeDmarc('p=reject; v=DMARC1').issues).includes('version-not-first'));
  assert.equal(analyzeDmarc('v=dmarc1; p=reject').usable, false);
  assert.equal(analyzeDmarc('p=reject').usable, false);
  assert.equal(analyzeDmarc('').usable, false);
});

test('flags historic, invalid, duplicate and unknown DMARC tags', () => {
  const r = analyzeDmarc('v=DMARC1; p=quarantine; pct=25; ri=86400; adkim=x; P=reject; foo=bar; rua=mailto:a@example.com');
  const c = codes(r.issues);
  assert.ok(c.includes('historic-tag'));
  assert.ok(c.includes('pct-partial'));
  assert.ok(c.includes('invalid-value'));
  assert.ok(c.includes('uppercase-tag'));
  assert.ok(c.includes('unknown-tag'));
  assert.equal(r.effective.adkim, 'r');
  assert.ok(codes(analyzeDmarc('v=DMARC1; p=none; p=reject').issues).includes('duplicate-tag'));
  assert.ok(codes(analyzeDmarc('v=DMARC1; p=none').issues).includes('no-rua'));
  assert.ok(codes(analyzeDmarc('v=DMARC1; p=none; rua=mailto:a@example.com; fo=1').issues).includes('fo-without-ruf'));
  assert.ok(codes(analyzeDmarc('v=DMARC1; p=reject; t=y; rua=mailto:a@example.com').issues).includes('test-mode'));
});

test('validates fo combinations and test-mode downgrade', () => {
  for (const good of ['0', '1', 'd', 's', '0:d', 'd:s', '1:d:s', 's:0']) assert.ok(isValidFo(good), good);
  for (const bad of ['0:1', 'x', '1:1', '', 'd:d']) assert.ok(!isValidFo(bad), bad);
  assert.equal(testModePolicy('reject'), 'quarantine');
  assert.equal(testModePolicy('quarantine'), 'none');
  assert.equal(testModePolicy('none'), 'none');
});

test('builds DMARC records with v and p first and defaults omitted', () => {
  assert.equal(buildDmarc({ p: 'none', rua: 'dmarc@example.com' }), 'v=DMARC1; p=none; rua=mailto:dmarc@example.com');
  assert.equal(
    buildDmarc({ p: 'reject', np: 'reject', t: true, adkim: 's', aspf: 'r', ruf: 'f@example.com', fo: '1' }),
    'v=DMARC1; p=reject; np=reject; t=y; adkim=s; ruf=mailto:f@example.com; fo=1',
  );
  const built = buildDmarc({ p: 'quarantine', sp: 'reject', rua: 'a@example.com, mailto:b@example.com' });
  const analysis = analyzeDmarc(built);
  assert.equal(analysis.usable, true);
  assert.deepEqual(analysis.issues.filter((i) => i.severity !== 'info'), []);
});

test('web-tools.json entries are complete in both languages and wired to the UI', async () => {
  const { readFileSync } = await import('node:fs');
  const tools = JSON.parse(readFileSync(new URL('../src/content/web-tools.json', import.meta.url), 'utf8'));
  const detail = readFileSync(new URL('../src/pages/ToolDetail.tsx', import.meta.url), 'utf8');
  const policy = JSON.parse(readFileSync(new URL('../src/config/hreflang-policy.json', import.meta.url), 'utf8'));
  assert.equal(new Set(tools.map((t: { slug: string }) => t.slug)).size, tools.length);
  for (const tool of tools) {
    assert.match(tool.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(detail.includes(`'${tool.slug}'`), `no component mapped for ${tool.slug}`);
    assert.ok(policy.eligibleDiscoveryRoutes.includes(`/tools/${tool.slug}`));
    for (const lang of ['ar', 'en']) {
      for (const field of ['title', 'metaDescription', 'summary']) {
        assert.ok(tool[field][lang]?.trim(), `${tool.slug} ${field}.${lang}`);
      }
      for (const field of ['intro', 'howTo', 'notes', 'faq']) {
        assert.ok(tool[field][lang]?.length > 0, `${tool.slug} ${field}.${lang}`);
      }
    }
    assert.ok(tool.metaDescription.en.length <= 170, `${tool.slug} meta description too long`);
    assert.ok(tool.references.every((ref: { url: string }) => ref.url.startsWith('https://')));
  }
});
