import { lazy, Suspense, useEffect, type ComponentType, type LazyExoticComponent } from 'react';
import { Link, useParams } from 'wouter';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { getWebTool, WEB_TOOLS, WEB_TOOL_CATEGORY_LABELS } from '@/data/webTools';
import NotFound from '@/pages/not-found';

const TOOL_COMPONENTS: Record<string, LazyExoticComponent<ComponentType>> = {
  'vlsm-subnet-calculator': lazy(() => import('@/components/tools/VlsmCalculator')),
  'subnet-calculator': lazy(() => import('@/components/tools/SubnetCalculator')),
  'common-ports-lookup': lazy(() => import('@/components/tools/PortLookup')),
  'ip-range-to-cidr-wildcard': lazy(() => import('@/components/tools/RangeToCidr')),
  'spf-record-analyzer': lazy(() => import('@/components/tools/SpfAnalyzer')),
  'dmarc-record-analyzer': lazy(() => import('@/components/tools/DmarcAnalyzer')),
};

export default function ToolDetail() {
  const { slug } = useParams();
  const tool = getWebTool(slug);
  if (!tool || !TOOL_COMPONENTS[tool.slug]) return <NotFound />;
  return <ToolPage slug={tool.slug} />;
}

function ToolPage({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const lang = language === 'ar' ? 'ar' : 'en';
  const ar = lang === 'ar';
  const tool = getWebTool(slug)!;
  const Widget = TOOL_COMPONENTS[slug];
  const related = WEB_TOOLS.filter((item) => item.slug !== slug);

  useSEO({
    title: tool.title[lang],
    description: tool.metaDescription[lang],
    path: `/tools/${slug}`,
  });

  // The prerendered HTML carries WebApplication JSON-LD; drop it when leaving the page client-side.
  useEffect(() => () => document.getElementById('jsonld-tool')?.remove(), []);

  return (
    <div className="container mx-auto px-4 py-12">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/tools" className="hover:text-primary">
          {ar ? 'الأدوات' : 'Tools'}
        </Link>
        <span className="mx-2">/</span>
        <span>{WEB_TOOL_CATEGORY_LABELS[tool.category][lang]}</span>
      </nav>

      <header className="mb-8 max-w-3xl">
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">{tool.title[lang]}</h1>
        <p className="text-lg text-muted-foreground">{tool.summary[lang]}</p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          {ar ? 'تعمل بالكامل داخل متصفحك — لا يُرسل أي شيء إلى خادم' : 'Runs entirely in your browser — nothing is sent to a server'}
        </p>
      </header>

      <section className="mb-12 max-w-5xl rounded-2xl border border-border bg-card p-4 md:p-6">
        <Suspense fallback={<p className="text-sm text-muted-foreground">{ar ? 'جارٍ التحميل…' : 'Loading…'}</p>}>
          <Widget />
        </Suspense>
      </section>

      <article className="max-w-3xl space-y-10 leading-relaxed">
        <section className="space-y-4">
          {tool.intro[lang].map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">{ar ? 'طريقة الاستخدام' : 'How to use it'}</h2>
          <ol className="list-decimal space-y-2 ps-6">
            {tool.howTo[lang].map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">{ar ? 'ملاحظات مهمة' : 'Good to know'}</h2>
          <ul className="list-disc space-y-2 ps-6">
            {tool.notes[lang].map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">{ar ? 'أسئلة شائعة' : 'FAQ'}</h2>
          <div className="space-y-3">
            {tool.faq[lang].map((item) => (
              <details key={item.q} className="rounded-lg border border-border p-4">
                <summary className="cursor-pointer font-semibold">{item.q}</summary>
                <p className="mt-2 text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">{ar ? 'المراجع' : 'References'}</h2>
          <ul className="list-disc space-y-1 ps-6 text-sm">
            {tool.references.map((ref) => (
              <li key={ref.url}>
                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" dir="ltr">
                  {ref.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">{ar ? 'أدوات أخرى' : 'More tools'}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/tools/${item.slug}`} className="block rounded-lg border border-border p-4 hover:border-primary">
                  <span className="font-semibold">{item.title[lang]}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{item.summary[lang]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
}
