/**
 * Offline DMARC policy record analyzer and builder following RFC 9989 (May 2026),
 * which obsoletes RFC 7489. It parses a pasted record only; it does not query DNS.
 */
import { normalizeTxtInput } from './txtRecord.ts';

export type Severity = 'error' | 'warning' | 'info';
export type DmarcIssueCode =
  | 'empty'
  | 'version-not-first'
  | 'bad-version'
  | 'missing-p'
  | 'p-none'
  | 'invalid-value'
  | 'duplicate-tag'
  | 'historic-tag'
  | 'pct-partial'
  | 'unknown-tag'
  | 'uppercase-tag'
  | 'malformed-tag'
  | 'no-rua'
  | 'non-mailto-uri'
  | 'obsolete-size-limit'
  | 'fo-without-ruf'
  | 'test-mode'
  | 'no-np';

export type DmarcIssue = { severity: Severity; code: DmarcIssueCode; tag?: string };
export type DmarcPolicy = 'none' | 'quarantine' | 'reject';
export type DmarcTag = { name: string; value: string; known: boolean; valid: boolean };

export type DmarcAnalysis = {
  record: string;
  /** False when receivers must ignore the whole record (missing/misplaced/invalid v tag). */
  usable: boolean;
  tags: DmarcTag[];
  issues: DmarcIssue[];
  effective: {
    p: DmarcPolicy;
    sp: DmarcPolicy;
    np: DmarcPolicy;
    testMode: boolean;
    adkim: 'r' | 's';
    aspf: 'r' | 's';
    rua: string[];
    ruf: string[];
    fo: string;
    psd: 'y' | 'n' | 'u';
  };
};

const ACTIVE_TAGS = new Set(['v', 'p', 'sp', 'np', 't', 'psd', 'adkim', 'aspf', 'rua', 'ruf', 'fo']);
const HISTORIC_TAGS = new Set(['pct', 'rf', 'ri']);
const POLICIES = new Set(['none', 'quarantine', 'reject']);

export function isValidFo(value: string): boolean {
  const parts = value.split(':').map((part) => part.trim());
  if (!parts.length || parts.some((part) => !['0', '1', 'd', 's'].includes(part))) return false;
  if (new Set(parts).size !== parts.length) return false;
  return !(parts.includes('0') && parts.includes('1'));
}

function splitUris(value: string): string[] {
  return value.split(',').map((uri) => uri.trim()).filter(Boolean);
}

function validUriList(value: string): boolean {
  const uris = splitUris(value);
  return uris.length > 0 && uris.every((uri) => /^[a-z][a-z0-9+.-]*:\S+$/i.test(uri));
}

function validateValue(name: string, value: string): boolean {
  switch (name) {
    case 'p':
    case 'sp':
    case 'np':
      return POLICIES.has(value);
    case 't':
      return value === 'y' || value === 'n';
    case 'psd':
      return value === 'y' || value === 'n' || value === 'u';
    case 'adkim':
    case 'aspf':
      return value === 'r' || value === 's';
    case 'rua':
    case 'ruf':
      return validUriList(value);
    case 'fo':
      return isValidFo(value);
    default:
      return true;
  }
}

export function analyzeDmarc(input: string): DmarcAnalysis {
  const record = normalizeTxtInput(input).value;
  const issues: DmarcIssue[] = [];
  const tags: DmarcTag[] = [];
  const effective: DmarcAnalysis['effective'] = {
    p: 'none',
    sp: 'none',
    np: 'none',
    testMode: false,
    adkim: 'r',
    aspf: 'r',
    rua: [],
    ruf: [],
    fo: '0',
    psd: 'u',
  };
  const result: DmarcAnalysis = { record, usable: false, tags, issues, effective };

  if (!record) {
    issues.push({ severity: 'error', code: 'empty' });
    return result;
  }

  const parts = record.split(';').map((part) => part.trim()).filter(Boolean);
  const seen = new Map<string, number>();

  parts.forEach((part, index) => {
    const match = part.match(/^([A-Za-z]+)\s*=\s*(.+)$/);
    if (!match) {
      issues.push({ severity: 'warning', code: 'malformed-tag', tag: part });
      return;
    }
    const name = match[1];
    const value = match[2].trim();
    seen.set(name, (seen.get(name) ?? 0) + 1);

    if (name === 'v') {
      if (index !== 0) issues.push({ severity: 'error', code: 'version-not-first' });
      if (value !== 'DMARC1') issues.push({ severity: 'error', code: 'bad-version' });
      tags.push({ name, value, known: true, valid: value === 'DMARC1' && index === 0 });
      return;
    }

    if (ACTIVE_TAGS.has(name)) {
      const valid = validateValue(name, value);
      if (!valid) issues.push({ severity: 'warning', code: 'invalid-value', tag: name });
      tags.push({ name, value, known: true, valid });
      return;
    }

    if (HISTORIC_TAGS.has(name)) {
      issues.push({ severity: 'warning', code: 'historic-tag', tag: name });
      if (name === 'pct' && value !== '100') issues.push({ severity: 'warning', code: 'pct-partial', tag: name });
      tags.push({ name, value, known: true, valid: true });
      return;
    }

    if (ACTIVE_TAGS.has(name.toLowerCase()) || HISTORIC_TAGS.has(name.toLowerCase())) {
      issues.push({ severity: 'warning', code: 'uppercase-tag', tag: name });
    } else {
      issues.push({ severity: 'info', code: 'unknown-tag', tag: name });
    }
    tags.push({ name, value, known: false, valid: false });
  });

  if (!tags.length || tags[0].name !== 'v') {
    if (!issues.some((issue) => issue.code === 'version-not-first')) {
      issues.push({ severity: 'error', code: 'version-not-first' });
    }
  }

  for (const [name, count] of seen) {
    if (count > 1) issues.push({ severity: 'error', code: 'duplicate-tag', tag: name });
  }

  result.usable = tags[0]?.name === 'v' && tags[0].value === 'DMARC1';

  const get = (name: string) => tags.find((tag) => tag.name === name && tag.valid)?.value;
  const p = get('p') as DmarcPolicy | undefined;
  const sp = get('sp') as DmarcPolicy | undefined;
  const np = get('np') as DmarcPolicy | undefined;
  effective.p = p ?? 'none';
  effective.sp = sp ?? effective.p;
  effective.np = np ?? sp ?? effective.p;
  effective.testMode = get('t') === 'y';
  effective.adkim = (get('adkim') as 'r' | 's' | undefined) ?? 'r';
  effective.aspf = (get('aspf') as 'r' | 's' | undefined) ?? 'r';
  effective.rua = splitUris(get('rua') ?? '');
  effective.ruf = splitUris(get('ruf') ?? '');
  effective.fo = get('fo') ?? '0';
  effective.psd = (get('psd') as 'y' | 'n' | 'u' | undefined) ?? 'u';

  if (result.usable) {
    if (!tags.some((tag) => tag.name === 'p')) issues.push({ severity: 'warning', code: 'missing-p' });
    else if (effective.p === 'none') issues.push({ severity: 'info', code: 'p-none' });
    if (!effective.rua.length) issues.push({ severity: 'warning', code: 'no-rua' });
    for (const uri of [...effective.rua, ...effective.ruf]) {
      if (!/^mailto:/i.test(uri)) issues.push({ severity: 'info', code: 'non-mailto-uri', tag: uri });
      if (/![0-9]+[kmgt]?$/i.test(uri)) issues.push({ severity: 'info', code: 'obsolete-size-limit', tag: uri });
    }
    if (tags.some((tag) => tag.name === 'fo') && !effective.ruf.length) {
      issues.push({ severity: 'info', code: 'fo-without-ruf' });
    }
    if (effective.testMode) issues.push({ severity: 'info', code: 'test-mode' });
    if (!np && effective.p !== 'none' && effective.np !== 'reject') {
      issues.push({ severity: 'info', code: 'no-np' });
    }
  }

  return result;
}

/** Policy that receivers are asked to apply when t=y (one level below the published policy). */
export function testModePolicy(policy: DmarcPolicy): DmarcPolicy {
  if (policy === 'reject') return 'quarantine';
  return 'none';
}

export type DmarcBuilderInput = {
  p: DmarcPolicy;
  sp?: DmarcPolicy | '';
  np?: DmarcPolicy | '';
  t?: boolean;
  adkim?: 'r' | 's';
  aspf?: 'r' | 's';
  rua?: string;
  ruf?: string;
  fo?: string;
};

function toUriList(value: string | undefined): string {
  return splitUris(value ?? '')
    .map((uri) => (/^[a-z][a-z0-9+.-]*:/i.test(uri) ? uri : `mailto:${uri}`))
    .join(',');
}

/** Builds a record in a conventional order: v first (required), then p. Defaults are omitted. */
export function buildDmarc(input: DmarcBuilderInput): string {
  const parts = ['v=DMARC1', `p=${input.p}`];
  if (input.sp) parts.push(`sp=${input.sp}`);
  if (input.np) parts.push(`np=${input.np}`);
  if (input.t) parts.push('t=y');
  if (input.adkim === 's') parts.push('adkim=s');
  if (input.aspf === 's') parts.push('aspf=s');
  const rua = toUriList(input.rua);
  if (rua) parts.push(`rua=${rua}`);
  const ruf = toUriList(input.ruf);
  if (ruf) {
    parts.push(`ruf=${ruf}`);
    if (input.fo && input.fo !== '0') parts.push(`fo=${input.fo}`);
  }
  return parts.join('; ');
}
