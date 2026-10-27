/**
 * Normalizes a pasted DNS TXT value. If the text contains quoted character-strings
 * (as shown by dig or zone files), they are concatenated without separators, as
 * RFC 7208 section 3.3 describes for multi-string SPF records.
 */
export type NormalizedTxt = { value: string; strings: string[]; quoted: boolean };

export function normalizeTxtInput(input: string): NormalizedTxt {
  const trimmed = input.trim();
  const quotedStrings = [...trimmed.matchAll(/"((?:\\.|[^"\\])*)"/g)].map((match) =>
    match[1].replace(/\\(.)/g, '$1'),
  );
  if (quotedStrings.length > 0) {
    return { value: quotedStrings.join('').trim(), strings: quotedStrings, quoted: true };
  }
  return { value: trimmed.replace(/\s+/g, ' '), strings: [trimmed], quoted: false };
}

export function utf8Length(value: string): number {
  return new TextEncoder().encode(value).length;
}
