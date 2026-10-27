/**
 * Offline SPF (RFC 7208) record analyzer. It parses a pasted record only; it does not
 * query DNS, so nested include/redirect lookups cannot be counted here.
 */
import { normalizeTxtInput, utf8Length } from './txtRecord.ts';
import { parseIPv4 } from './ipv4.ts';

export type Severity = 'error' | 'warning' | 'info';
export type SpfIssueCode =
  | 'empty'
  | 'no-version'
  | 'multiple-records'
  | 'unknown-mechanism'
  | 'missing-domain'
  | 'invalid-ip4'
  | 'invalid-ip6'
  | 'invalid-cidr'
  | 'unexpected-argument'
  | 'too-many-lookups'
  | 'near-lookup-limit'
  | 'duplicate-modifier'
  | 'plus-all'
  | 'neutral-all'
  | 'multiple-all'
  | 'terms-after-all'
  | 'redirect-ignored'
  | 'no-all-no-redirect'
  | 'ptr-discouraged'
  | 'string-too-long'
  | 'record-too-large'
  | 'unknown-modifier'
  | 'nested-lookups';

export type SpfIssue = { severity: Severity; code: SpfIssueCode; term?: string };

export type SpfQualifier = '+' | '-' | '~' | '?';
export type SpfTerm =
  | {
      kind: 'mechanism';
      raw: string;
      qualifier: SpfQualifier;
      explicitQualifier: boolean;
      name: string;
      value: string;
      countsLookup: boolean;
      ignored: boolean;
    }
  | { kind: 'modifier'; raw: string; name: string; value: string; countsLookup: boolean; ignored: boolean };

export type SpfAnalysis = {
  record: string;
  valid: boolean;
  terms: SpfTerm[];
  lookupCount: number;
  issues: SpfIssue[];
  allQualifier: SpfQualifier | null;
  octets: number;
};

const MECHANISMS = new Set(['all', 'include', 'a', 'mx', 'ptr', 'ip4', 'ip6', 'exists']);
const LOOKUP_MECHANISMS = new Set(['include', 'a', 'mx', 'ptr', 'exists']);
const KNOWN_MODIFIERS = new Set(['redirect', 'exp']);

export function isValidIPv6(value: string): boolean {
  if (!/^[0-9a-f:.]+$/i.test(value) || !value.includes(':')) return false;
  const parts = value.split('::');
  if (parts.length > 2) return false;
  const groups = (text: string) => (text === '' ? [] : text.split(':'));
  const head = groups(parts[0]);
  const tail = parts.length === 2 ? groups(parts[1]) : [];
  const all = [...head, ...tail];
  let count = 0;
  for (let i = 0; i < all.length; i += 1) {
    const group = all[i];
    const isLast = i === all.length - 1;
    if (isLast && group.includes('.')) {
      if (parseIPv4(group) === null) return false;
      count += 2;
    } else if (/^[0-9a-f]{1,4}$/i.test(group)) {
      count += 1;
    } else {
      return false;
    }
  }
  return parts.length === 2 ? count < 8 : count === 8;
}

function validCidr(value: string | undefined, max: number): boolean {
  if (value === undefined) return true;
  return /^(0|[1-9]\d?\d?)$/.test(value) && Number(value) <= max;
}

function looksLikeDomainSpec(value: string): boolean {
  return value.length > 0 && !/\s/.test(value);
}

export function analyzeSpf(input: string): SpfAnalysis {
  const normalized = normalizeTxtInput(input);
  const record = normalized.value;
  const issues: SpfIssue[] = [];
  const terms: SpfTerm[] = [];
  const octets = utf8Length(record);
  const base: SpfAnalysis = { record, valid: false, terms, lookupCount: 0, issues, allQualifier: null, octets };

  if (!record) {
    issues.push({ severity: 'error', code: 'empty' });
    return base;
  }

  for (const piece of normalized.strings) {
    if (normalized.quoted && utf8Length(piece) > 255) {
      issues.push({ severity: 'error', code: 'string-too-long' });
      break;
    }
  }
  if (!normalized.quoted && octets > 255) {
    issues.push({ severity: 'warning', code: 'string-too-long' });
  }

  const tokens = record.split(' ').filter(Boolean);
  if (!/^v=spf1$/i.test(tokens[0] ?? '')) {
    issues.push({ severity: 'error', code: 'no-version' });
    return base;
  }

  const versionCount = tokens.filter((token) => /^v=spf1$/i.test(token)).length;
  if (versionCount > 1) issues.push({ severity: 'error', code: 'multiple-records' });

  let seenAll = false;
  let allCount = 0;
  const modifierCounts = new Map<string, number>();

  for (const token of tokens.slice(1)) {
    if (/^v=spf1$/i.test(token)) continue;
    const modifierMatch = token.match(/^([a-z][a-z0-9_.-]*)=(.*)$/i);
    if (modifierMatch) {
      const name = modifierMatch[1].toLowerCase();
      const value = modifierMatch[2];
      modifierCounts.set(name, (modifierCounts.get(name) ?? 0) + 1);
      if (!KNOWN_MODIFIERS.has(name)) {
        issues.push({ severity: 'info', code: 'unknown-modifier', term: token });
      } else if (!looksLikeDomainSpec(value)) {
        issues.push({ severity: 'error', code: 'missing-domain', term: token });
      }
      terms.push({ kind: 'modifier', raw: token, name, value, countsLookup: name === 'redirect', ignored: false });
      continue;
    }

    const mechanismMatch = token.match(/^([+\-~?]?)([a-z][a-z0-9_.-]*)(.*)$/i);
    const qualifier = (mechanismMatch?.[1] || '+') as SpfQualifier;
    const name = mechanismMatch?.[2]?.toLowerCase() ?? '';
    const rest = mechanismMatch?.[3] ?? '';
    if (!mechanismMatch || !MECHANISMS.has(name)) {
      issues.push({ severity: 'error', code: 'unknown-mechanism', term: token });
      continue;
    }

    const term: SpfTerm = {
      kind: 'mechanism',
      raw: token,
      qualifier,
      explicitQualifier: Boolean(mechanismMatch[1]),
      name,
      value: rest.replace(/^:/, ''),
      countsLookup: LOOKUP_MECHANISMS.has(name),
      ignored: seenAll,
    };

    if (seenAll) term.countsLookup = false;

    switch (name) {
      case 'all':
        if (rest) issues.push({ severity: 'error', code: 'unexpected-argument', term: token });
        allCount += 1;
        if (!seenAll) {
          base.allQualifier = qualifier;
          if (qualifier === '+') issues.push({ severity: 'error', code: 'plus-all', term: token });
          if (qualifier === '?') issues.push({ severity: 'warning', code: 'neutral-all', term: token });
        }
        seenAll = true;
        break;
      case 'include':
      case 'exists':
        if (!rest.startsWith(':') || !looksLikeDomainSpec(rest.slice(1))) {
          issues.push({ severity: 'error', code: 'missing-domain', term: token });
        }
        break;
      case 'a':
      case 'mx': {
        const match = rest.match(/^(?::([^/]+))?(?:\/(\d+))?(?:\/\/(\d+))?$/);
        if (!match) {
          issues.push({ severity: 'error', code: 'invalid-cidr', term: token });
        } else if (!validCidr(match[2], 32) || !validCidr(match[3], 128)) {
          issues.push({ severity: 'error', code: 'invalid-cidr', term: token });
        }
        break;
      }
      case 'ptr':
        issues.push({ severity: 'warning', code: 'ptr-discouraged', term: token });
        if (rest && !(rest.startsWith(':') && looksLikeDomainSpec(rest.slice(1)))) {
          issues.push({ severity: 'error', code: 'missing-domain', term: token });
        }
        break;
      case 'ip4': {
        const match = rest.match(/^:([^/]+)(?:\/(\d+))?$/);
        if (!match || parseIPv4(match[1]) === null) {
          issues.push({ severity: 'error', code: 'invalid-ip4', term: token });
        } else if (!validCidr(match[2], 32)) {
          issues.push({ severity: 'error', code: 'invalid-cidr', term: token });
        }
        break;
      }
      case 'ip6': {
        const match = rest.match(/^:([^/]+)(?:\/(\d+))?$/);
        if (!match || !isValidIPv6(match[1])) {
          issues.push({ severity: 'error', code: 'invalid-ip6', term: token });
        } else if (!validCidr(match[2], 128)) {
          issues.push({ severity: 'error', code: 'invalid-cidr', term: token });
        }
        break;
      }
    }

    terms.push(term);
  }

  for (const [name, count] of modifierCounts) {
    if (KNOWN_MODIFIERS.has(name) && count > 1) {
      issues.push({ severity: 'error', code: 'duplicate-modifier', term: name });
    }
  }

  if (allCount > 1) issues.push({ severity: 'warning', code: 'multiple-all' });
  const firstAllIndex = terms.findIndex((term) => term.kind === 'mechanism' && term.name === 'all');
  if (firstAllIndex >= 0 && terms.slice(firstAllIndex + 1).some((term) => term.kind === 'mechanism')) {
    issues.push({ severity: 'warning', code: 'terms-after-all' });
  }

  const hasRedirect = modifierCounts.has('redirect');
  if (hasRedirect && seenAll) {
    issues.push({ severity: 'warning', code: 'redirect-ignored' });
    for (const term of terms) {
      if (term.kind === 'modifier' && term.name === 'redirect') {
        term.ignored = true;
        term.countsLookup = false;
      }
    }
  }
  if (!seenAll && !hasRedirect) issues.push({ severity: 'warning', code: 'no-all-no-redirect' });

  const lookupCount = terms.filter((term) => term.countsLookup).length;
  base.lookupCount = lookupCount;
  if (lookupCount > 10) issues.push({ severity: 'error', code: 'too-many-lookups' });
  else if (lookupCount >= 8) issues.push({ severity: 'warning', code: 'near-lookup-limit' });

  if (terms.some((term) => term.countsLookup && (term.name === 'include' || term.name === 'redirect'))) {
    issues.push({ severity: 'info', code: 'nested-lookups' });
  }

  if (octets > 450) issues.push({ severity: 'warning', code: 'record-too-large' });

  base.valid = !issues.some((issue) => issue.severity === 'error');
  return base;
}
