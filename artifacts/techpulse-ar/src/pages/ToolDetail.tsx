import { useMemo, useState } from 'react';
import { Link, useParams } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { ATLAS_TOOLS } from '@/data/atlasTools';

const field = 'w-full rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-sm';
const btn = 'min-h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground';
const ghost = 'min-h-10 rounded-md border border-border px-4 text-sm';

export default function ToolDetail() {
  const params = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const tool = ATLAS_TOOLS.find((t) => t.id === params.slug && t.online);

  useSEO({
    title: tool ? tool.title[language] : language === 'ar' ? 'أداة' : 'Tool',
    description: tool?.body[language],
    path: `/tools/${params.slug ?? ''}`,
  });

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>{language === 'ar' ? 'الأداة غير موجودة.' : 'Tool not found.'}</p>
        <Link href="/tools" className="text-primary mt-4 inline-block">
          {language === 'ar' ? 'كل الأدوات' : 'All tools'}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/tools" className="text-sm text-muted-foreground hover:text-primary">
        {language === 'ar' ? '← الأدوات' : '← Tools'}
      </Link>
      <h1 className="text-3xl font-bold mt-3">{tool.title[language]}</h1>
      <p className="text-muted-foreground mt-2">{tool.body[language]}</p>
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <Panel id={tool.id} ar={language === 'ar'} />
      </div>
    </div>
  );
}

function copy(text: string) {
  void navigator.clipboard.writeText(text);
}

function Panel({ id, ar }: { id: string; ar: boolean }) {
  if (id === 'hash') return <Hash ar={ar} />;
  if (id === 'jwt') return <Jwt ar={ar} />;
  if (id === 'subnet') return <Subnet ar={ar} />;
  if (id === 'regex') return <Regex ar={ar} />;
  if (id === 'base64') return <B64 ar={ar} />;
  if (id === 'password') return <Pwd ar={ar} />;
  if (id === 'json') return <Json ar={ar} />;
  if (id === 'cron') return <Cron ar={ar} />;
  if (id === 'uuid') return <Uuid ar={ar} />;
  if (id === 'timestamp') return <Ts ar={ar} />;
  return null;
}

function Hash({ ar }: { ar: boolean }) {
  const [text, setText] = useState('');
  const [algo, setAlgo] = useState('SHA-256');
  const [out, setOut] = useState('');
  async function run(data: BufferSource) {
    const buf = await crypto.subtle.digest(algo, data);
    setOut([...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join(''));
  }
  return (
    <div className="space-y-3">
      <select className={field} value={algo} onChange={(e) => setAlgo(e.target.value)}>
        <option>SHA-256</option>
        <option>SHA-1</option>
        <option>SHA-384</option>
        <option>SHA-512</option>
      </select>
      <textarea className={`${field} min-h-28`} value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex gap-2">
        <button type="button" className={btn} onClick={() => void run(new TextEncoder().encode(text))}>
          {ar ? 'احسب' : 'Hash'}
        </button>
        <label className={ghost}>
          {ar ? 'ملف' : 'File'}
          <input
            type="file"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) await run(await f.arrayBuffer());
            }}
          />
        </label>
      </div>
      {out ? <p className="break-all font-mono text-xs">{out}</p> : null}
    </div>
  );
}

function Jwt({ ar }: { ar: boolean }) {
  const [raw, setRaw] = useState('');
  const parsed = useMemo(() => {
    try {
      const p = raw.trim().split('.');
      if (p.length < 2) return null;
      const dec = (s: string) =>
        JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))));
      return { header: dec(p[0]), payload: dec(p[1]) };
    } catch {
      return raw.trim() ? { error: true } : null;
    }
  }, [raw]);
  return (
    <div className="space-y-3">
      <textarea className={`${field} min-h-28`} value={raw} onChange={(e) => setRaw(e.target.value)} placeholder="eyJhbGciOi..." />
      <p className="text-xs text-muted-foreground">{ar ? 'بدون تحقق من التوقيع.' : 'Signature is not verified.'}</p>
      {parsed && 'error' in parsed ? <p className="text-destructive text-sm">{ar ? 'غير صالح' : 'Invalid'}</p> : null}
      {parsed && 'header' in parsed ? (
        <pre className="overflow-auto text-xs">{JSON.stringify(parsed, null, 2)}</pre>
      ) : null}
    </div>
  );
}

function Subnet({ ar }: { ar: boolean }) {
  const [cidr, setCidr] = useState('192.168.1.0/24');
  const info = useMemo(() => {
    const m = cidr.trim().match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d+)$/);
    if (!m) return null;
    const oct = [+m[1], +m[2], +m[3], +m[4]];
    const prefix = +m[5];
    if (oct.some((n) => n > 255) || prefix > 32) return null;
    const ip = ((oct[0] << 24) | (oct[1] << 16) | (oct[2] << 8) | oct[3]) >>> 0;
    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    const network = ip & mask;
    const broadcast = network | (~mask >>> 0);
    const fmt = (n: number) => [24, 16, 8, 0].map((s) => ((n >>> s) & 255).toString()).join('.');
    const size = 2 ** (32 - prefix);
    return {
      network: fmt(network),
      mask: fmt(mask),
      broadcast: fmt(broadcast),
      hosts: String(prefix >= 31 ? size : size - 2),
    };
  }, [cidr]);
  return (
    <div className="space-y-3">
      <input className={field} value={cidr} onChange={(e) => setCidr(e.target.value)} />
      {info ? (
        <ul className="text-sm space-y-1 font-mono">
          <li>Network {info.network}</li>
          <li>Mask {info.mask}</li>
          <li>Broadcast {info.broadcast}</li>
          <li>Hosts {info.hosts}</li>
        </ul>
      ) : (
        <p className="text-sm text-destructive">{ar ? 'CIDR غير صحيح' : 'Invalid CIDR'}</p>
      )}
    </div>
  );
}

function Regex({ ar }: { ar: boolean }) {
  const [pattern, setPattern] = useState('\\b\\d{4}\\b');
  const [text, setText] = useState('tickets 2024 and 2025');
  const matches = useMemo(() => {
    try {
      return [...text.matchAll(new RegExp(pattern, 'g'))].map((m) => m[0]);
    } catch {
      return [];
    }
  }, [pattern, text]);
  return (
    <div className="space-y-3">
      <input className={field} value={pattern} onChange={(e) => setPattern(e.target.value)} />
      <textarea className={`${field} min-h-24`} value={text} onChange={(e) => setText(e.target.value)} />
      <p className="text-sm text-muted-foreground">{matches.length} {ar ? 'مطابقة' : 'matches'}</p>
      <ul className="font-mono text-sm">{matches.map((m, i) => <li key={i}>{m}</li>)}</ul>
    </div>
  );
}

function B64({ ar }: { ar: boolean }) {
  const [src, setSrc] = useState('');
  const [enc, setEnc] = useState(true);
  const out = useMemo(() => {
    try {
      return enc ? btoa(unescape(encodeURIComponent(src))) : decodeURIComponent(escape(atob(src)));
    } catch {
      return '';
    }
  }, [src, enc]);
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button type="button" className={enc ? btn : ghost} onClick={() => setEnc(true)}>{ar ? 'ترميز' : 'Encode'}</button>
        <button type="button" className={!enc ? btn : ghost} onClick={() => setEnc(false)}>{ar ? 'فك' : 'Decode'}</button>
      </div>
      <textarea className={`${field} min-h-24`} value={src} onChange={(e) => setSrc(e.target.value)} />
      <textarea readOnly className={`${field} min-h-24`} value={out} />
    </div>
  );
}

function Pwd({ ar }: { ar: boolean }) {
  const [len, setLen] = useState(20);
  const [pwd, setPwd] = useState('');
  function gen() {
    const pool = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*-_';
    const b = new Uint32Array(len);
    crypto.getRandomValues(b);
    setPwd([...b].map((n) => pool[n % pool.length]).join(''));
  }
  return (
    <div className="space-y-3">
      <label className="text-sm flex justify-between">{ar ? 'الطول' : 'Length'} {len}
        <input type="range" min={8} max={64} value={len} onChange={(e) => setLen(+e.target.value)} />
      </label>
      <button type="button" className={btn} onClick={gen}>{ar ? 'توليد' : 'Generate'}</button>
      {pwd ? (
        <p className="font-mono break-all">
          {pwd}{' '}
          <button type="button" onClick={() => copy(pwd)}>{ar ? 'نسخ' : 'Copy'}</button>
        </p>
      ) : null}
    </div>
  );
}

function Json({ ar }: { ar: boolean }) {
  const [src, setSrc] = useState('{"ok":true}');
  const [out, setOut] = useState('');
  const [err, setErr] = useState('');
  function run(pretty: boolean) {
    try {
      setOut(JSON.stringify(JSON.parse(src), null, pretty ? 2 : 0));
      setErr('');
    } catch (e) {
      setErr(String(e));
    }
  }
  return (
    <div className="space-y-3">
      <textarea className={`${field} min-h-28`} value={src} onChange={(e) => setSrc(e.target.value)} />
      <div className="flex gap-2">
        <button type="button" className={btn} onClick={() => run(true)}>{ar ? 'تنسيق' : 'Pretty'}</button>
        <button type="button" className={ghost} onClick={() => run(false)}>{ar ? 'ضغط' : 'Minify'}</button>
      </div>
      {err ? <p className="text-sm text-destructive">{err}</p> : null}
      {out ? <textarea readOnly className={`${field} min-h-28`} value={out} /> : null}
    </div>
  );
}

function Cron({ ar }: { ar: boolean }) {
  const [expr, setExpr] = useState('*/5 * * * *');
  const parts = expr.trim().split(/\s+/);
  const names = ar
    ? ['دقيقة', 'ساعة', 'يوم الشهر', 'شهر', 'يوم الأسبوع']
    : ['minute', 'hour', 'day of month', 'month', 'day of week'];
  return (
    <div className="space-y-3">
      <input className={field} value={expr} onChange={(e) => setExpr(e.target.value)} />
      {parts.length === 5 ? (
        <ul className="text-sm space-y-1">
          {parts.map((p, i) => (
            <li key={i}>
              {names[i]}: {p === '*' ? (ar ? 'كل القيم' : 'every') : p}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-destructive">{ar ? 'تعبير خماسي' : 'Need 5 fields'}</p>
      )}
    </div>
  );
}

function Uuid({ ar }: { ar: boolean }) {
  const [list, setList] = useState<string[]>([]);
  return (
    <div className="space-y-3">
      <button type="button" className={btn} onClick={() => setList([crypto.randomUUID()])}>
        {ar ? 'توليد' : 'Generate'}
      </button>
      <ul className="font-mono text-xs space-y-1">
        {list.map((u) => (
          <li key={u}>{u}</li>
        ))}
      </ul>
    </div>
  );
}

function Ts({ ar }: { ar: boolean }) {
  const [unix, setUnix] = useState(String(Math.floor(Date.now() / 1000)));
  const n = Number(unix);
  const date = Number.isFinite(n) ? new Date(n > 1e12 ? n : n * 1000).toString() : '';
  return (
    <div className="space-y-3">
      <input className={field} value={unix} onChange={(e) => setUnix(e.target.value)} />
      <p className="text-sm">{date || '—'}</p>
      <button type="button" className={ghost} onClick={() => setUnix(String(Math.floor(Date.now() / 1000)))}>
        {ar ? 'الآن' : 'Now'}
      </button>
    </div>
  );
}
