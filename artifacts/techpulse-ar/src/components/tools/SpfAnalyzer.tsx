import { useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { analyzeSpf, type SpfIssue, type SpfIssueCode, type SpfQualifier } from '@/lib/tools/spf';
import { IssueList, ResultTable, labelClass, inputClass } from './shared';

const SAMPLE = 'v=spf1 ip4:192.0.2.0/24 include:_spf.example.net mx ~all';

type Msg = (term?: string) => string;
const MESSAGES: Record<SpfIssueCode, { ar: Msg; en: Msg }> = {
  empty: { ar: () => 'الصق سجل SPF لتحليله.', en: () => 'Paste an SPF record to analyze it.' },
  'no-version': {
    ar: () => 'السجل يجب أن يبدأ بـ v=spf1 بالضبط، وإلا فلن يعتبره المستقبِل سجل SPF أصلًا.',
    en: () => 'The record must start with exactly v=spf1; otherwise receivers do not treat it as SPF at all.',
  },
  'multiple-records': {
    ar: () => 'يبدو أنك لصقت أكثر من سجل v=spf1. وجود سجلين لنفس الاسم ينتج permerror؛ ادمجهما في سجل واحد.',
    en: () => 'More than one v=spf1 record detected. Two SPF records on one name cause a permerror — merge them.',
  },
  'unknown-mechanism': {
    ar: (t) => `«${t}» ليست آلية معروفة في SPF، وهذا يجعل السجل كله permerror.`,
    en: (t) => `"${t}" is not a known SPF mechanism, which makes the whole record a permerror.`,
  },
  'missing-domain': {
    ar: (t) => `«${t}» تحتاج إلى نطاق بعد النقطتين.`,
    en: (t) => `"${t}" needs a domain after the colon.`,
  },
  'invalid-ip4': { ar: (t) => `عنوان IPv4 غير صالح في «${t}».`, en: (t) => `Invalid IPv4 address in "${t}".` },
  'invalid-ip6': { ar: (t) => `عنوان IPv6 غير صالح في «${t}».`, en: (t) => `Invalid IPv6 address in "${t}".` },
  'invalid-cidr': { ar: (t) => `طول البادئة غير صالح في «${t}».`, en: (t) => `Invalid prefix length in "${t}".` },
  'unexpected-argument': {
    ar: (t) => `«${t}» لا تقبل قيمة بهذا الشكل.`,
    en: (t) => `"${t}" does not take an argument in this form.`,
  },
  'too-many-lookups': {
    ar: () => 'عدد الآليات التي تتطلب استعلام DNS تجاوز 10 في هذا السجل وحده؛ المستقبِل سيعيد permerror.',
    en: () => 'This record alone has more than 10 DNS-querying terms; receivers will return a permerror.',
  },
  'near-lookup-limit': {
    ar: () => 'اقتربت من حد الـ10 استعلامات في هذا المستوى فقط، وكل include يضيف استعلاماته الداخلية أيضًا.',
    en: () => 'Close to the 10-lookup limit at this level alone, and every include adds its own nested lookups.',
  },
  'duplicate-modifier': {
    ar: (t) => `المُعدِّل «${t}» مكرر؛ redirect وexp مسموح بكل منهما مرة واحدة فقط.`,
    en: (t) => `Modifier "${t}" appears more than once; redirect and exp may each appear only once.`,
  },
  'plus-all': {
    ar: () => '+all يسمح لأي خادم في العالم بالإرسال باسم نطاقك، ويُبطل فائدة SPF.',
    en: () => '+all authorizes every host on the internet to send as your domain and defeats SPF.',
  },
  'neutral-all': {
    ar: () => '?all لا يقدّم أي حكم على المرسلين غير المذكورين؛ فكّر في ~all أو -all.',
    en: () => '?all gives no verdict for unlisted senders; consider ~all or -all.',
  },
  'multiple-all': { ar: () => 'توجد أكثر من آلية all.', en: () => 'More than one "all" mechanism is present.' },
  'terms-after-all': {
    ar: (t) => `«${t}» تأتي بعد all، والمستقبِل يتجاهل كل ما بعد all.`,
    en: (t) => `"${t}" comes after "all"; receivers ignore every mechanism after it.`,
  },
  'redirect-ignored': {
    ar: () => 'redirect يُتجاهل لأن السجل يحتوي على all.',
    en: () => 'redirect is ignored because the record contains "all".',
  },
  'no-all-no-redirect': {
    ar: () => 'لا توجد all ولا redirect، فالنتيجة الافتراضية للمرسلين غير المذكورين هي neutral.',
    en: () => 'No "all" and no redirect, so unlisted senders default to a neutral result.',
  },
  'ptr-discouraged': {
    ar: () => 'آلية ptr بطيئة وغير موثوقة، والمعيار يوصي بعدم استخدامها.',
    en: () => 'The ptr mechanism is slow and unreliable; RFC 7208 says it should not be published.',
  },
  'string-too-long': {
    ar: () => 'إحدى سلاسل TXT تتجاوز 255 حرفًا؛ قسّمها إلى عدة سلاسل بين علامات تنصيص.',
    en: () => 'A TXT string exceeds 255 characters; split it into several quoted strings.',
  },
  'record-too-large': {
    ar: () => 'السجل أطول من 450 بايت، والمعيار ينصح بالبقاء تحته لتفادي مشاكل استجابات DNS الكبيرة.',
    en: () => 'The record is over 450 octets; RFC 7208 advises staying below that to avoid oversized DNS answers.',
  },
  'unknown-modifier': {
    ar: (t) => `المُعدِّل «${t}» غير معروف وسيتجاهله المستقبِل.`,
    en: (t) => `Unknown modifier "${t}" will be ignored by receivers.`,
  },
  'nested-lookups': {
    ar: () => 'الأداة تعدّ استعلامات هذا السجل فقط؛ استعلامات السجلات المضمّنة عبر include أو redirect تُحتسب أيضًا ضمن الحد.',
    en: () => 'Only this record is counted; lookups inside included or redirected records also count toward the limit.',
  },
};

const QUALIFIER_LABEL: Record<SpfQualifier, { ar: string; en: string }> = {
  '+': { ar: 'سماح (pass)', en: 'pass' },
  '-': { ar: 'رفض (fail)', en: 'fail' },
  '~': { ar: 'مشتبه (softfail)', en: 'softfail' },
  '?': { ar: 'محايد (neutral)', en: 'neutral' },
};

export default function SpfAnalyzer() {
  const { language } = useLanguage();
  const lang = language === 'ar' ? 'ar' : 'en';
  const ar = lang === 'ar';
  const [input, setInput] = useState(SAMPLE);
  const analysis = useMemo(() => analyzeSpf(input), [input]);

  const issueItems = analysis.issues.map((issue: SpfIssue, index) => ({
    severity: issue.severity,
    key: `${issue.code}-${issue.term ?? ''}-${index}`,
    text: MESSAGES[issue.code][lang](issue.term),
  }));

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass} htmlFor="spf-input">
          {ar ? 'سجل SPF (يمكن لصقه مع علامات التنصيص)' : 'SPF record (quoted strings are fine)'}
        </label>
        <textarea
          id="spf-input"
          dir="ltr"
          rows={3}
          className={inputClass}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3" aria-live="polite">
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">{ar ? 'الحالة' : 'Status'}</p>
          <p className={`font-semibold ${analysis.valid ? 'text-emerald-600' : 'text-red-500'}`}>
            {analysis.valid ? (ar ? 'صياغة سليمة' : 'Syntax OK') : ar ? 'يحتوي أخطاء' : 'Has errors'}
          </p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">
            {ar ? 'استعلامات DNS في هذا المستوى' : 'DNS lookups at this level'}
          </p>
          <p className="font-mono font-semibold">{analysis.lookupCount} / 10</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">{ar ? 'الحكم الافتراضي (all)' : 'Default verdict (all)'}</p>
          <p className="font-semibold">
            {analysis.allQualifier ? QUALIFIER_LABEL[analysis.allQualifier][lang] : ar ? 'غير محدد' : 'not set'}
          </p>
        </div>
      </div>

      <IssueList
        issues={issueItems}
        labels={ar ? { error: 'خطأ', warning: 'تحذير', info: 'ملاحظة' } : { error: 'Error', warning: 'Warning', info: 'Note' }}
      />

      {analysis.terms.length > 0 && (
        <ResultTable
          head={ar ? ['المقطع', 'النوع', 'النتيجة عند التطابق', 'استعلام DNS؟'] : ['Term', 'Type', 'Result on match', 'DNS lookup?']}
          rows={analysis.terms.map((term) => [
            <span key="r" className={term.ignored ? 'line-through opacity-60' : ''}>{term.raw}</span>,
            term.kind === 'mechanism' ? (ar ? 'آلية' : 'mechanism') : ar ? 'مُعدِّل' : 'modifier',
            term.kind === 'mechanism' ? QUALIFIER_LABEL[term.qualifier][lang] : '—',
            term.countsLookup ? (ar ? 'نعم' : 'yes') : ar ? 'لا' : 'no',
          ])}
        />
      )}
      <p className="text-xs text-muted-foreground">
        {ar
          ? `الحجم: ${analysis.octets} بايت. التحليل يتم داخل متصفحك ولا يُرسل السجل إلى أي خادم.`
          : `Size: ${analysis.octets} octets. Analysis runs in your browser; the record is not sent anywhere.`}
      </p>
    </div>
  );
}
