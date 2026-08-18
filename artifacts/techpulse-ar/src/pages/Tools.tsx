import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { Link } from 'wouter';

const TOOL_CATEGORIES = [
  {
    id: 'networking',
    title: { ar: 'أدوات الشبكات', en: 'Networking Tools' },
    examples: { ar: 'حاسبة الشبكات الفرعية، CIDR، نطاقات IP', en: 'Subnet, CIDR, IP range calculators' },
  },
  {
    id: 'dns-email',
    title: { ar: 'DNS والبريد', en: 'DNS & Email' },
    examples: { ar: 'فحص DNS، SPF، DMARC، DKIM', en: 'DNS lookup, SPF, DMARC, DKIM' },
  },
  {
    id: 'security',
    title: { ar: 'أدوات الأمن', en: 'Security Tools' },
    examples: { ar: 'تجزئة، شهادات، JWT، IOC', en: 'Hashes, certificates, JWT, IOC' },
  },
  {
    id: 'operations',
    title: { ar: 'العمليات', en: 'Operations' },
    examples: { ar: 'تحليل Syslog، Regex، Cron', en: 'Syslog parser, Regex, Cron helpers' },
  },
] as const;

export default function Tools() {
  const { language } = useLanguage();

  useSEO({
    title: language === 'ar' ? 'الأدوات' : 'Tools',
    description:
      language === 'ar'
        ? 'أدوات هندسية احترافية للشبكات والأمن والعمليات'
        : 'Professional engineering tools for networking, security and operations',
    path: '/tools',
  });

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {language === 'ar' ? 'الأدوات' : 'Tools'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'ar'
            ? 'أساس لاكتشاف الأدوات الاحترافية. التنفيذ الفعلي للأدوات سيُضاف تدريجياً — بدون صفحات وهمية.'
            : 'Foundation for professional tool discovery. Real tools will be added incrementally — no fake SEO placeholders.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TOOL_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
          >
            <h2 className="text-lg font-bold mb-2">{cat.title[language]}</h2>
            <p className="text-sm text-muted-foreground mb-3">{cat.examples[language]}</p>
            <span className="text-xs font-medium text-primary/80">
              {language === 'ar' ? 'قريباً' : 'Coming soon'}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        {language === 'ar' ? (
          <>
            للمحتوى التقني الحالي:{' '}
            <Link href="/articles" className="text-primary hover:underline">
              المقالات
            </Link>
          </>
        ) : (
          <>
            Existing technical content:{' '}
            <Link href="/articles" className="text-primary hover:underline">
              Articles
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
