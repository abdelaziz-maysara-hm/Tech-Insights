import { useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  analyzeDmarc,
  buildDmarc,
  testModePolicy,
  type DmarcIssueCode,
  type DmarcPolicy,
} from '@/lib/tools/dmarc';
import { CopyButton, IssueList, inputClass, labelClass } from './shared';

const SAMPLE = 'v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@example.com; adkim=s';

type Msg = (tag?: string) => string;
const MESSAGES: Record<DmarcIssueCode, { ar: Msg; en: Msg }> = {
  empty: { ar: () => 'الصق سجل DMARC لتحليله.', en: () => 'Paste a DMARC record to analyze it.' },
  'version-not-first': {
    ar: () => 'يجب أن يكون v=DMARC1 أول وسم في السجل، وإلا يتجاهل المستقبِل السجل بالكامل.',
    en: () => 'v=DMARC1 must be the very first tag; otherwise receivers ignore the whole record.',
  },
  'bad-version': {
    ar: () => 'قيمة v يجب أن تكون DMARC1 بالضبط (حساسة لحالة الأحرف).',
    en: () => 'The v tag must be exactly DMARC1 (case-sensitive).',
  },
  'missing-p': {
    ar: () => 'لا يوجد وسم p، فيُعامل السجل كأنه p=none. أضفه صراحةً.',
    en: () => 'No p tag, so the record is treated as p=none. Add it explicitly.',
  },
  'p-none': {
    ar: () => 'p=none وضع مراقبة فقط: تصلك التقارير لكن لا يُطلب من المستقبِل أي إجراء ضد الرسائل الفاشلة.',
    en: () => 'p=none is monitoring only: you get reports, but receivers are not asked to act on failing mail.',
  },
  'invalid-value': {
    ar: (t) => `قيمة الوسم «${t}» غير صالحة، وسيستخدم المستقبِل القيمة الافتراضية بدلًا منها.`,
    en: (t) => `Invalid value for "${t}"; receivers fall back to the default instead.`,
  },
  'duplicate-tag': {
    ar: (t) => `الوسم «${t}» مكرر، وهذا يجعل صياغة السجل غير صحيحة.`,
    en: (t) => `Tag "${t}" appears more than once, which makes the record syntactically invalid.`,
  },
  'historic-tag': {
    ar: (t) => `الوسم «${t}» أصبح تاريخيًا في RFC 9989 ولم يعد له أثر؛ يمكن حذفه.`,
    en: (t) => `"${t}" is historic under RFC 9989 and no longer has any effect; you can remove it.`,
  },
  'pct-partial': {
    ar: () => 'pct بقيمة أقل من 100 كان يُستخدم للتطبيق التدريجي، والبديل الحالي هو t=y.',
    en: () => 'A pct below 100 was used for gradual rollout; the current replacement is t=y.',
  },
  'unknown-tag': {
    ar: (t) => `الوسم «${t}» غير معروف وسيتم تجاهله.`,
    en: (t) => `Unknown tag "${t}" will be ignored.`,
  },
  'uppercase-tag': {
    ar: (t) => `اكتب «${t}» بأحرف صغيرة؛ أسماء الوسوم تُكتب بالأحرف الصغيرة.`,
    en: (t) => `Write "${t}" in lowercase; tag names are defined in lowercase.`,
  },
  'malformed-tag': {
    ar: (t) => `«${t}» ليس على شكل وسم=قيمة.`,
    en: (t) => `"${t}" is not in tag=value form.`,
  },
  'no-rua': {
    ar: () => 'لا يوجد rua، فلن تصلك تقارير إجمالية تعرف منها من يرسل باسم نطاقك.',
    en: () => 'No rua, so you will not receive aggregate reports showing who sends as your domain.',
  },
  'non-mailto-uri': {
    ar: (t) => `«${t}» ليس عنوان mailto:، والمستقبِلون ملزمون بدعم mailto فقط وقد يتجاهلون غيره.`,
    en: (t) => `"${t}" is not a mailto: URI; receivers are only required to support mailto and may ignore others.`,
  },
  'obsolete-size-limit': {
    ar: (t) => `حد الحجم بعد علامة ! في «${t}» لم يعد جزءًا من المعيار الحالي.`,
    en: (t) => `The "!size" suffix in "${t}" is not part of the current specification.`,
  },
  'fo-without-ruf': {
    ar: () => 'fo لا يؤثر إلا عند وجود ruf لاستقبال تقارير الفشل.',
    en: () => 'fo only matters when ruf is set to receive failure reports.',
  },
  'test-mode': {
    ar: () => 't=y مفعّل: يُطلب من المستقبِل تطبيق سياسة أخف بدرجة واحدة (reject ← quarantine، quarantine ← none). التقارير لا تتأثر.',
    en: () => 't=y is set: receivers are asked to apply one level lower (reject → quarantine, quarantine → none). Reporting is unaffected.',
  },
  'no-np': {
    ar: () => 'لا يوجد np، فالنطاقات الفرعية غير الموجودة تأخذ سياسة sp أو p. يمكنك تحديد np=reject صراحةً.',
    en: () => 'No np, so non-existent subdomains inherit sp or p. You can set np=reject explicitly.',
  },
};

const POLICY_LABEL: Record<DmarcPolicy, { ar: string; en: string }> = {
  none: { ar: 'none (مراقبة فقط)', en: 'none (monitor only)' },
  quarantine: { ar: 'quarantine (عزل/مزعج)', en: 'quarantine (treat as suspicious)' },
  reject: { ar: 'reject (رفض)', en: 'reject' },
};

function Analyzer({ lang }: { lang: 'ar' | 'en' }) {
  const ar = lang === 'ar';
  const [input, setInput] = useState(SAMPLE);
  const analysis = useMemo(() => analyzeDmarc(input), [input]);
  const e = analysis.effective;
  const policyText = (policy: DmarcPolicy) =>
    e.testMode ? `${POLICY_LABEL[policy][lang]} → t=y: ${testModePolicy(policy)}` : POLICY_LABEL[policy][lang];

  const rows: [string, string][] = [
    [ar ? 'النطاق نفسه (p)' : 'Domain (p)', policyText(e.p)],
    [ar ? 'النطاقات الفرعية (sp)' : 'Subdomains (sp)', policyText(e.sp)],
    [ar ? 'نطاقات فرعية غير موجودة (np)' : 'Non-existent subdomains (np)', policyText(e.np)],
    ['DKIM alignment (adkim)', e.adkim === 's' ? (ar ? 'صارم' : 'strict') : ar ? 'مرن' : 'relaxed'],
    ['SPF alignment (aspf)', e.aspf === 's' ? (ar ? 'صارم' : 'strict') : ar ? 'مرن' : 'relaxed'],
    [ar ? 'تقارير إجمالية (rua)' : 'Aggregate reports (rua)', e.rua.join(', ') || '—'],
    [ar ? 'تقارير فشل (ruf)' : 'Failure reports (ruf)', e.ruf.join(', ') || '—'],
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass} htmlFor="dmarc-input">
          {ar ? 'سجل DMARC (قيمة TXT للاسم ‎_dmarc.example.com)' : 'DMARC record (TXT value at _dmarc.example.com)'}
        </label>
        <textarea
          id="dmarc-input"
          dir="ltr"
          rows={3}
          className={inputClass}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
        />
      </div>
      <p className={`font-semibold ${analysis.usable ? 'text-emerald-600' : 'text-red-500'}`} aria-live="polite">
        {analysis.usable
          ? ar ? 'سجل DMARC قابل للاستخدام' : 'Usable DMARC record'
          : ar ? 'سيتجاهل المستقبِلون هذا السجل' : 'Receivers will ignore this record'}
      </p>
      {analysis.usable && (
        <dl className="grid gap-2 sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-border p-3">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="break-all font-mono text-sm" dir="ltr">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <IssueList
        issues={analysis.issues.map((issue, index) => ({
          severity: issue.severity,
          key: `${issue.code}-${issue.tag ?? ''}-${index}`,
          text: MESSAGES[issue.code][lang](issue.tag),
        }))}
        labels={ar ? { error: 'خطأ', warning: 'تحذير', info: 'ملاحظة' } : { error: 'Error', warning: 'Warning', info: 'Note' }}
      />
    </div>
  );
}

function Select<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>{label}</label>
      <select id={id} className={inputClass} value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}

function Generator({ lang }: { lang: 'ar' | 'en' }) {
  const ar = lang === 'ar';
  const [p, setP] = useState<DmarcPolicy>('none');
  const [sp, setSp] = useState<DmarcPolicy | ''>('');
  const [np, setNp] = useState<DmarcPolicy | ''>('');
  const [t, setT] = useState(false);
  const [adkim, setAdkim] = useState<'r' | 's'>('r');
  const [aspf, setAspf] = useState<'r' | 's'>('r');
  const [rua, setRua] = useState('');
  const [ruf, setRuf] = useState('');
  const [fo, setFo] = useState('0');

  const record = buildDmarc({ p, sp, np, t, adkim, aspf, rua, ruf, fo });
  const policyOptions = (['none', 'quarantine', 'reject'] as DmarcPolicy[]).map((value) => ({
    value,
    label: POLICY_LABEL[value][lang],
  }));
  const inheritOption = { value: '' as const, label: ar ? 'افتراضي (يرث)' : 'Default (inherit)' };
  const alignOptions = [
    { value: 'r' as const, label: ar ? 'مرن (افتراضي)' : 'Relaxed (default)' },
    { value: 's' as const, label: ar ? 'صارم' : 'Strict' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Select id="g-p" label={ar ? 'السياسة (p)' : 'Policy (p)'} value={p} options={policyOptions} onChange={setP} />
        <Select id="g-sp" label={ar ? 'النطاقات الفرعية (sp)' : 'Subdomains (sp)'} value={sp} options={[inheritOption, ...policyOptions]} onChange={setSp} />
        <Select id="g-np" label={ar ? 'غير الموجودة (np)' : 'Non-existent (np)'} value={np} options={[inheritOption, ...policyOptions]} onChange={setNp} />
        <Select id="g-adkim" label="adkim" value={adkim} options={alignOptions} onChange={setAdkim} />
        <Select id="g-aspf" label="aspf" value={aspf} options={alignOptions} onChange={setAspf} />
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input type="checkbox" checked={t} onChange={(event) => setT(event.target.checked)} />
          {ar ? 'وضع الاختبار (t=y)' : 'Test mode (t=y)'}
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="g-rua">{ar ? 'بريد التقارير الإجمالية (rua)' : 'Aggregate report address (rua)'}</label>
          <input id="g-rua" dir="ltr" className={inputClass} placeholder="dmarc@example.com" value={rua} onChange={(event) => setRua(event.target.value)} />
        </div>
        <div>
          <label className={labelClass} htmlFor="g-ruf">{ar ? 'بريد تقارير الفشل (ruf، اختياري)' : 'Failure report address (ruf, optional)'}</label>
          <input id="g-ruf" dir="ltr" className={inputClass} value={ruf} onChange={(event) => setRuf(event.target.value)} />
        </div>
      </div>
      {ruf.trim() && (
        <Select
          id="g-fo"
          label={ar ? 'متى تُرسل تقارير الفشل (fo)' : 'When to send failure reports (fo)'}
          value={fo}
          options={[
            { value: '0', label: ar ? '0: عند فشل كل الآليات (افتراضي)' : '0: all mechanisms fail (default)' },
            { value: '1', label: ar ? '1: عند فشل أي آلية' : '1: any mechanism fails' },
            { value: 'd', label: ar ? 'd: عند فشل DKIM' : 'd: DKIM fails' },
            { value: 's', label: ar ? 's: عند فشل SPF' : 's: SPF fails' },
            { value: '1:d:s', label: '1:d:s' },
          ]}
          onChange={setFo}
        />
      )}
      <div className="rounded-lg border border-border bg-muted/40 p-3">
        <p className="mb-2 text-xs text-muted-foreground">
          {ar ? 'انشر هذه القيمة كسجل TXT على ‎_dmarc.<نطاقك>' : 'Publish this as a TXT record at _dmarc.<your-domain>'}
        </p>
        <code className="block break-all font-mono text-sm" dir="ltr">{record}</code>
        <div className="mt-3">
          <CopyButton text={record} label={ar ? 'نسخ السجل' : 'Copy record'} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {ar
          ? 'إن كان بريد التقارير على نطاق آخر، فيجب أن يأذن ذلك النطاق باستقبال تقاريرك عبر سجل ‎_report._dmarc كما يصف RFC 9990.'
          : 'If the report mailbox is on another domain, that domain must authorize your reports with a _report._dmarc record, as described in RFC 9990.'}
      </p>
    </div>
  );
}

export default function DmarcAnalyzer() {
  const { language } = useLanguage();
  const lang = language === 'ar' ? 'ar' : 'en';
  const [tab, setTab] = useState<'analyze' | 'build'>('analyze');
  return (
    <div className="space-y-6">
      <div role="tablist" className="inline-flex rounded-lg border border-border p-1">
        {(['analyze', 'build'] as const).map((value) => (
          <button
            key={value}
            role="tab"
            type="button"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={`min-h-9 rounded-md px-4 text-sm font-medium ${tab === value ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            {value === 'analyze' ? (lang === 'ar' ? 'تحليل سجل' : 'Analyze') : lang === 'ar' ? 'إنشاء سجل' : 'Generate'}
          </button>
        ))}
      </div>
      {tab === 'analyze' ? <Analyzer lang={lang} /> : <Generator lang={lang} />}
    </div>
  );
}
