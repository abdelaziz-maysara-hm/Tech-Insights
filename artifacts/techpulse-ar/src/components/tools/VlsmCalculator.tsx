import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { allocateVlsm, formatIPv4 } from '@/lib/tools/ipv4';
import { CopyButton, ResultTable, inputClass, labelClass } from './shared';

type Row = { id: number; name: string; hosts: string };

const DEFAULT_ROWS: Row[] = [
  { id: 1, name: 'Users', hosts: '100' },
  { id: 2, name: 'Servers', hosts: '50' },
  { id: 3, name: 'Management', hosts: '10' },
  { id: 4, name: 'WAN link', hosts: '2' },
];

export default function VlsmCalculator() {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const [base, setBase] = useState('192.168.1.0/24');
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  const [nextId, setNextId] = useState(5);

  const result = useMemo(
    () =>
      allocateVlsm(
        base,
        rows
          .filter((row) => row.hosts.trim() !== '')
          .map((row, index) => ({
            name: row.name.trim() || `${ar ? 'قسم' : 'Segment'} ${index + 1}`,
            hosts: Number(row.hosts),
          })),
      ),
    [base, rows, ar],
  );

  const errorText = (() => {
    if (result.ok) return '';
    switch (result.error) {
      case 'invalid-base':
        return ar
          ? 'الشبكة الأم غير صحيحة. استخدم صيغة مثل 192.168.1.0/24 أو 10.0.0.0/255.255.0.0.'
          : 'Invalid parent network. Use a form like 192.168.1.0/24 or 10.0.0.0/255.255.0.0.';
      case 'invalid-hosts':
        return ar
          ? `عدد الأجهزة في «${result.detail}» يجب أن يكون عددًا صحيحًا موجبًا.`
          : `Host count for "${result.detail}" must be a positive whole number.`;
      case 'no-requests':
        return ar ? 'أضف قسمًا واحدًا على الأقل.' : 'Add at least one segment.';
      case 'does-not-fit':
        return ar
          ? `الخطة لا تتسع داخل الشبكة الأم عند الوصول إلى «${result.detail}». استخدم شبكة أم أكبر أو قلّل الأعداد.`
          : `The plan does not fit in the parent block (stopped at "${result.detail}"). Use a larger parent block or smaller host counts.`;
    }
  })();

  const head = ar
    ? ['القسم', 'المطلوب', 'الشبكة', 'القناع', 'Wildcard', 'نطاق الأجهزة', 'البث', 'المتاح', 'غير مستخدم']
    : ['Segment', 'Needed', 'Network', 'Mask', 'Wildcard', 'Usable range', 'Broadcast', 'Usable', 'Unused'];

  const planText = result.ok
    ? result.allocations
        .map(
          (a) =>
            `${a.name}\t${formatIPv4(a.network)}/${a.prefix}\t${formatIPv4(a.mask)}\t${formatIPv4(a.firstHost)}-${formatIPv4(a.lastHost)}\t${formatIPv4(a.broadcast)}`,
        )
        .join('\n')
    : '';

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass} htmlFor="vlsm-base">
          {ar ? 'الشبكة الأم' : 'Parent network'}
        </label>
        <input
          id="vlsm-base"
          dir="ltr"
          className={inputClass}
          value={base}
          onChange={(event) => setBase(event.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="space-y-2">
        <p className={labelClass}>{ar ? 'الأقسام وعدد الأجهزة' : 'Segments and host counts'}</p>
        {rows.map((row) => (
          <div key={row.id} className="flex gap-2">
            <input
              aria-label={ar ? 'اسم القسم' : 'Segment name'}
              className={inputClass}
              value={row.name}
              onChange={(event) =>
                setRows(rows.map((r) => (r.id === row.id ? { ...r, name: event.target.value } : r)))
              }
            />
            <input
              aria-label={ar ? 'عدد الأجهزة' : 'Hosts'}
              inputMode="numeric"
              dir="ltr"
              className={`${inputClass} max-w-[8rem]`}
              value={row.hosts}
              onChange={(event) =>
                setRows(rows.map((r) => (r.id === row.id ? { ...r, hosts: event.target.value } : r)))
              }
            />
            <button
              type="button"
              aria-label={ar ? 'حذف' : 'Remove'}
              onClick={() => setRows(rows.filter((r) => r.id !== row.id))}
              className="inline-flex min-h-9 items-center rounded-md border border-border px-2 hover:bg-muted"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            setRows([...rows, { id: nextId, name: '', hosts: '' }]);
            setNextId(nextId + 1);
          }}
          className="inline-flex min-h-9 items-center gap-2 rounded-md border border-border px-3 text-sm hover:bg-muted"
        >
          <Plus className="h-4 w-4" />
          {ar ? 'إضافة قسم' : 'Add segment'}
        </button>
      </div>

      {!result.ok ? (
        <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm">
          {errorText}
        </p>
      ) : (
        <div className="space-y-4" aria-live="polite">
          <ResultTable
            head={head}
            rows={result.allocations.map((a) => [
              <span key="n" dir="auto" className="font-sans">{a.name}</span>,
              a.hosts,
              `${formatIPv4(a.network)}/${a.prefix}`,
              formatIPv4(a.mask),
              formatIPv4(a.wildcard),
              `${formatIPv4(a.firstHost)} – ${formatIPv4(a.lastHost)}`,
              formatIPv4(a.broadcast),
              a.usableHosts,
              a.wasted,
            ])}
          />
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>
              {ar
                ? `مستخدم ${result.usedAddresses} من ${result.base.totalAddresses} عنوان (${Math.round((result.usedAddresses / result.base.totalAddresses) * 100)}%).`
                : `Allocated ${result.usedAddresses} of ${result.base.totalAddresses} addresses (${Math.round((result.usedAddresses / result.base.totalAddresses) * 100)}%).`}{' '}
              {result.freeRanges.map((range) => (
                <span key={range.start} dir="ltr" className="font-mono">
                  {ar ? 'الحر: ' : 'Free: '}
                  {formatIPv4(range.start)} – {formatIPv4(range.end)}
                </span>
              ))}
            </p>
            <CopyButton text={planText} label={ar ? 'نسخ الخطة' : 'Copy plan'} />
          </div>
        </div>
      )}
    </div>
  );
}
