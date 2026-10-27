import { useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  blockSize,
  formatIPv4,
  maskToPrefix,
  parseIPv4,
  parseRangeInput,
  prefixToMask,
  prefixToWildcard,
  rangeToCidrs,
  wildcardToPrefix,
} from '@/lib/tools/ipv4';
import { CopyButton, ResultTable, inputClass, labelClass } from './shared';

function convertMask(value: string): { prefix: number } | { error: 'invalid' | 'non-contiguous' } {
  const text = value.trim().replace(/^\//, '');
  if (/^\d{1,2}$/.test(text)) {
    const n = Number(text);
    return n <= 32 ? { prefix: n } : { error: 'invalid' };
  }
  const parsed = parseIPv4(text);
  if (parsed === null) return { error: 'invalid' };
  const asMask = maskToPrefix(parsed);
  if (asMask !== null) return { prefix: asMask };
  const asWildcard = wildcardToPrefix(parsed);
  if (asWildcard !== null) return { prefix: asWildcard };
  return { error: 'non-contiguous' };
}

export default function RangeToCidr() {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const [input, setInput] = useState('192.168.1.100 - 192.168.1.200');
  const [maskInput, setMaskInput] = useState('255.255.255.192');

  const parsed = useMemo(() => parseRangeInput(input), [input]);
  const blocks = useMemo(() => (parsed.ok ? rangeToCidrs(parsed.start, parsed.end) : []), [parsed]);
  const mask = useMemo(() => convertMask(maskInput), [maskInput]);

  const cidrText = blocks.map((b) => `${formatIPv4(b.network)}/${b.prefix}`).join('\n');
  const wildcardText = blocks
    .map((b) => `${formatIPv4(b.network)} ${formatIPv4(prefixToWildcard(b.prefix))}`)
    .join('\n');

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="range-input">
            {ar ? 'النطاق أو CIDR أو عنوان مفرد' : 'Range, CIDR or single address'}
          </label>
          <input
            id="range-input"
            dir="ltr"
            className={inputClass}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
          />
        </div>

        {!parsed.ok ? (
          <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm">
            {parsed.error === 'reversed'
              ? ar
                ? 'عنوان البداية أكبر من عنوان النهاية.'
                : 'The start address is greater than the end address.'
              : ar
                ? 'صيغة غير صحيحة. أمثلة: ‎10.0.0.5 - 10.0.0.90 أو ‎10.0.0.0/22 أو ‎10.0.0.7'
                : 'Unrecognized input. Examples: 10.0.0.5 - 10.0.0.90, 10.0.0.0/22, or 10.0.0.7'}
          </p>
        ) : (
          <div className="space-y-3" aria-live="polite">
            <p className="text-sm text-muted-foreground">
              {ar
                ? `يغطي ${parsed.end - parsed.start + 1} عنوانًا في ${blocks.length} كتلة.`
                : `${parsed.end - parsed.start + 1} addresses covered by ${blocks.length} block${blocks.length === 1 ? '' : 's'}.`}{' '}
              <span dir="ltr" className="font-mono">
                {formatIPv4(parsed.start)} – {formatIPv4(parsed.end)}
              </span>
            </p>
            <ResultTable
              head={ar ? ['CIDR', 'القناع', 'Wildcard', 'من', 'إلى', 'العناوين'] : ['CIDR', 'Netmask', 'Wildcard', 'From', 'To', 'Addresses']}
              rows={blocks.map((b) => [
                `${formatIPv4(b.network)}/${b.prefix}`,
                formatIPv4(prefixToMask(b.prefix)),
                formatIPv4(prefixToWildcard(b.prefix)),
                formatIPv4(b.network),
                formatIPv4(b.network + blockSize(b.prefix) - 1),
                blockSize(b.prefix),
              ])}
            />
            <div className="flex flex-wrap gap-3">
              <CopyButton text={cidrText} label={ar ? 'نسخ قائمة CIDR' : 'Copy CIDR list'} />
              <CopyButton text={wildcardText} label={ar ? 'نسخ العنوان + Wildcard' : 'Copy address + wildcard'} />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border p-4 space-y-3">
        <h3 className="font-semibold">{ar ? 'تحويل سريع للأقنعة' : 'Quick mask converter'}</h3>
        <label className={labelClass} htmlFor="mask-input">
          {ar ? 'بادئة أو قناع أو Wildcard' : 'Prefix, netmask or wildcard'}
        </label>
        <input
          id="mask-input"
          dir="ltr"
          className={inputClass}
          value={maskInput}
          onChange={(event) => setMaskInput(event.target.value)}
          spellCheck={false}
        />
        {'prefix' in mask ? (
          <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4" dir="ltr">
            <div><dt className="text-muted-foreground">Prefix</dt><dd className="font-mono">/{mask.prefix}</dd></div>
            <div><dt className="text-muted-foreground">Netmask</dt><dd className="font-mono">{formatIPv4(prefixToMask(mask.prefix))}</dd></div>
            <div><dt className="text-muted-foreground">Wildcard</dt><dd className="font-mono">{formatIPv4(prefixToWildcard(mask.prefix))}</dd></div>
            <div><dt className="text-muted-foreground">Addresses</dt><dd className="font-mono">{blockSize(mask.prefix)}</dd></div>
          </dl>
        ) : (
          <p role="alert" className="text-sm text-red-500">
            {mask.error === 'non-contiguous'
              ? ar
                ? 'القناع غير متصل (ليس كتلة CIDR).'
                : 'Non-contiguous mask — it does not describe a CIDR block.'
              : ar
                ? 'أدخل بادئة من 0 إلى 32 أو قناعًا عشريًا.'
                : 'Enter a prefix from 0 to 32 or a dotted mask.'}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {ar
            ? 'القيمة التي تكون قناعًا وقناع Wildcard في الوقت نفسه (مثل 0.0.0.0) تُفسَّر كقناع شبكة.'
            : 'Values that read as both a netmask and a wildcard (such as 0.0.0.0) are interpreted as a netmask.'}
        </p>
      </div>
    </div>
  );
}
