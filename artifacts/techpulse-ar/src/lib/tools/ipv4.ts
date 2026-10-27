/**
 * Pure IPv4 math used by the client-side network tools.
 * Addresses are handled as unsigned 32-bit integers stored in regular JS numbers
 * (no bitwise operators on full 32-bit values, to avoid sign issues).
 */

export const IPV4_SPACE = 2 ** 32;

/** Strict dotted-quad parser. Rejects leading zeros (e.g. "010") to avoid octal ambiguity. */
export function parseIPv4(value: string): number | null {
  const parts = value.trim().split('.');
  if (parts.length !== 4) return null;
  let result = 0;
  for (const part of parts) {
    if (!/^(0|[1-9]\d{0,2})$/.test(part)) return null;
    const octet = Number(part);
    if (octet > 255) return null;
    result = result * 256 + octet;
  }
  return result;
}

export function formatIPv4(value: number): string {
  return [
    Math.floor(value / 2 ** 24) % 256,
    Math.floor(value / 2 ** 16) % 256,
    Math.floor(value / 2 ** 8) % 256,
    value % 256,
  ].join('.');
}

export function blockSize(prefix: number): number {
  return 2 ** (32 - prefix);
}

export function prefixToMask(prefix: number): number {
  return IPV4_SPACE - blockSize(prefix);
}

export function prefixToWildcard(prefix: number): number {
  return blockSize(prefix) - 1;
}

/** Returns the prefix length for a contiguous netmask, or null if the mask is not contiguous. */
export function maskToPrefix(mask: number): number | null {
  for (let prefix = 0; prefix <= 32; prefix += 1) {
    if (prefixToMask(prefix) === mask) return prefix;
  }
  return null;
}

/** Returns the prefix length for a contiguous wildcard (inverse) mask, or null. */
export function wildcardToPrefix(wildcard: number): number | null {
  for (let prefix = 0; prefix <= 32; prefix += 1) {
    if (prefixToWildcard(prefix) === wildcard) return prefix;
  }
  return null;
}

export function networkAddress(address: number, prefix: number): number {
  const size = blockSize(prefix);
  return Math.floor(address / size) * size;
}

export type ParsedCidr = { address: number; prefix: number; network: number };

/** Parses "a.b.c.d/nn" or "a.b.c.d/255.255.255.0". */
export function parseCidr(value: string): ParsedCidr | null {
  const match = value.trim().match(/^([^/\s]+)\s*\/\s*(\S+)$/);
  if (!match) return null;
  const address = parseIPv4(match[1]);
  if (address === null) return null;
  let prefix: number | null = null;
  if (/^\d{1,2}$/.test(match[2])) {
    const n = Number(match[2]);
    prefix = n <= 32 ? n : null;
  } else {
    const mask = parseIPv4(match[2]);
    prefix = mask === null ? null : maskToPrefix(mask);
  }
  if (prefix === null) return null;
  return { address, prefix, network: networkAddress(address, prefix) };
}

export type SubnetInfo = {
  prefix: number;
  network: number;
  broadcast: number;
  firstHost: number;
  lastHost: number;
  totalAddresses: number;
  usableHosts: number;
  mask: number;
  wildcard: number;
};

/**
 * Subnet details. /31 follows RFC 3021 (both addresses usable on point-to-point links);
 * /32 is a single host route.
 */
export function subnetInfo(address: number, prefix: number): SubnetInfo {
  const network = networkAddress(address, prefix);
  const total = blockSize(prefix);
  const broadcast = network + total - 1;
  let firstHost = network + 1;
  let lastHost = broadcast - 1;
  let usableHosts = total - 2;
  if (prefix === 31) {
    firstHost = network;
    lastHost = broadcast;
    usableHosts = 2;
  } else if (prefix === 32) {
    firstHost = network;
    lastHost = network;
    usableHosts = 1;
  }
  return {
    prefix,
    network,
    broadcast,
    firstHost,
    lastHost,
    totalAddresses: total,
    usableHosts,
    mask: prefixToMask(prefix),
    wildcard: prefixToWildcard(prefix),
  };
}

/** Smallest prefix whose classic usable-host count (size - 2) fits the requested hosts. */
export function prefixForHosts(hosts: number): number | null {
  if (!Number.isInteger(hosts) || hosts < 1) return null;
  for (let prefix = 30; prefix >= 0; prefix -= 1) {
    if (blockSize(prefix) - 2 >= hosts) return prefix;
  }
  return null;
}

export type VlsmRequest = { name: string; hosts: number };
export type VlsmAllocation = VlsmRequest & SubnetInfo & { wasted: number };
export type VlsmResult =
  | {
      ok: true;
      base: SubnetInfo;
      allocations: VlsmAllocation[];
      usedAddresses: number;
      freeRanges: { start: number; end: number }[];
    }
  | { ok: false; error: 'invalid-base' | 'invalid-hosts' | 'no-requests' | 'does-not-fit'; detail?: string };

/**
 * Classic VLSM: sort requirements largest-first and allocate aligned blocks sequentially
 * from the start of the base network. Each subnet reserves network and broadcast addresses.
 */
export function allocateVlsm(baseCidr: string, requests: VlsmRequest[]): VlsmResult {
  const parsed = parseCidr(baseCidr);
  if (!parsed) return { ok: false, error: 'invalid-base' };
  if (!requests.length) return { ok: false, error: 'no-requests' };
  const sized = requests.map((request, index) => ({ request, index, prefix: prefixForHosts(request.hosts) }));
  const bad = sized.find((item) => item.prefix === null);
  if (bad) return { ok: false, error: 'invalid-hosts', detail: bad.request.name };

  const ordered = [...sized].sort((a, b) => (a.prefix! - b.prefix!) || (a.index - b.index));
  const base = subnetInfo(parsed.network, parsed.prefix);
  const end = base.network + base.totalAddresses;
  let cursor = base.network;
  const allocations: VlsmAllocation[] = [];
  for (const item of ordered) {
    const prefix = item.prefix!;
    if (prefix < parsed.prefix || cursor + blockSize(prefix) > end) {
      return { ok: false, error: 'does-not-fit', detail: item.request.name };
    }
    const info = subnetInfo(cursor, prefix);
    allocations.push({ ...item.request, ...info, wasted: info.usableHosts - item.request.hosts });
    cursor += blockSize(prefix);
  }
  const usedAddresses = cursor - base.network;
  const freeRanges = cursor < end ? [{ start: cursor, end: end - 1 }] : [];
  return { ok: true, base, allocations, usedAddresses, freeRanges };
}

export type CidrBlock = { network: number; prefix: number };

/** Minimal list of CIDR blocks that exactly covers [start, end] (inclusive). */
export function rangeToCidrs(start: number, end: number): CidrBlock[] {
  if (start > end) return [];
  const blocks: CidrBlock[] = [];
  let current = start;
  while (current <= end) {
    let prefix = 0;
    while (prefix < 32) {
      const size = blockSize(prefix);
      if (current % size === 0 && current + size - 1 <= end) break;
      prefix += 1;
    }
    blocks.push({ network: current, prefix });
    current += blockSize(prefix);
  }
  return blocks;
}

export type RangeParse =
  | { ok: true; start: number; end: number; source: 'range' | 'cidr' | 'single' }
  | { ok: false; error: 'invalid' | 'reversed' };

/** Accepts "a.b.c.d - e.f.g.h", "a.b.c.d/nn", "a.b.c.d/255.255.255.0", or a single address. */
export function parseRangeInput(value: string): RangeParse {
  const text = value.trim();
  const rangeMatch = text.match(/^(\S+)\s*(?:-|–|to)\s*(\S+)$/i);
  if (rangeMatch) {
    const start = parseIPv4(rangeMatch[1]);
    const end = parseIPv4(rangeMatch[2]);
    if (start === null || end === null) return { ok: false, error: 'invalid' };
    if (start > end) return { ok: false, error: 'reversed' };
    return { ok: true, start, end, source: 'range' };
  }
  if (text.includes('/')) {
    const cidr = parseCidr(text);
    if (!cidr) return { ok: false, error: 'invalid' };
    return { ok: true, start: cidr.network, end: cidr.network + blockSize(cidr.prefix) - 1, source: 'cidr' };
  }
  const single = parseIPv4(text);
  if (single === null) return { ok: false, error: 'invalid' };
  return { ok: true, start: single, end: single, source: 'single' };
}
