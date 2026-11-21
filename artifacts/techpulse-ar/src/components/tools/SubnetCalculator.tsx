import { useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { formatIPv4, parseCidr, subnetInfo } from '@/lib/tools/ipv4';
import { CopyButton, ResultTable, inputClass, labelClass } from './shared';

export default function SubnetCalculator() {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const [input, setInput] = useState('192.168.1.0/24');

  const result = useMemo(() => {
    const parsed = parseCidr(input);
    if (!parsed) return null;
    return subnetInfo(parsed.address, parsed.prefix);
  }, [input]);

  const head = ar
    ? ['الخاصية', 'القيمة']
    : ['Property', 'Value'];

  const rows = result
    ? [
        [ar ? 'عنوان الشبكة' : 'Network address', `${formatIPv4(result.network)}/${result.prefix}`],
        [ar ? 'قناع الشبكة' : 'Netmask', formatIPv4(result.mask)],
        [ar ? 'قناع Wildcard' : 'Wildcard mask', formatIPv4(result.wildcard)],
        [ar ? 'عنوان البث' : 'Broadcast', formatIPv4(result.broadcast)],
        [ar ? 'أول عنوان صالح' : 'First usable', formatIPv4(result.firstHost)],
        [ar ? 'آخر عنوان صالح' : 'Last usable', formatIPv4(result.lastHost)],
        [ar ? 'إجمالي العناوين' : 'Total addresses', String(result.totalAddresses)],
        [ar ? 'العناوين الصالحة' : 'Usable hosts', String(result.usableHosts)],
      ]
    : [];

  const copyText = result
    ? [
        `Network: ${formatIPv4(result.network)}/${result.prefix}`,
        `Netmask: ${formatIPv4(result.mask)}`,
        `Wildcard: ${formatIPv4(result.wildcard)}`,
        `Broadcast: ${formatIPv4(result.broadcast)}`,
        `First: ${formatIPv4(result.firstHost)}`,
        `Last: ${formatIPv4(result.lastHost)}`,
        `Usable: ${result.usableHosts}`,
      ].join('\n')
    : '';

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass} htmlFor="subnet-input">
          {ar ? 'الشبكة (CIDR أو قناع)' : 'Network (CIDR or mask)'}
        </label>
        <input
          id="subnet-input"
          dir="ltr"
          className={inputClass}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="192.168.1.0/24"
          spellCheck={false}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {ar
            ? 'مثال: 10.0.0.0/16 أو 172.16.1.5/255.255.255.0'
            : 'Example: 10.0.0.0/16 or 172.16.1.5/255.255.255.0'}
        </p>
      </div>

      {!result ? (
        <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm">
          {ar
            ? 'الصيغة غير صحيحة. استخدم شكلًا مثل 192.168.1.0/24.'
            : 'Invalid format. Use something like 192.168.1.0/24.'}
        </p>
      ) : (
        <div className="space-y-4" aria-live="polite">
          <ResultTable head={head} rows={rows} />
          <div className="flex justify-end">
            <CopyButton text={copyText} label={ar ? 'نسخ النتيجة' : 'Copy result'} />
          </div>
        </div>
      )}
    </div>
  );
}
