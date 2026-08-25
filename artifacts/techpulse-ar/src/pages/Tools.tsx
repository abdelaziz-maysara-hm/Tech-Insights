import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { Link } from 'wouter';
import { ATLAS_TOOLS } from '@/data/atlasTools';

export default function Tools() {
  const { language } = useLanguage();

  useSEO({
    title: language === 'ar' ? 'الأدوات' : 'Tools',
    description:
      language === 'ar'
        ? 'أدوات NetSec Atlas المحلية: تسجيل الشاشة والصوت، تجزئة، JWT، شبكات وعمليات.'
        : 'NetSec Atlas local tools: screen and sound recorders, hashing, JWT, networking and ops.',
    path: '/tools',
  });

  const groups = [
    { ar: 'تسجيل', en: 'Recording' },
    { ar: 'أمن', en: 'Security' },
    { ar: 'شبكات', en: 'Networking' },
    { ar: 'عمليات', en: 'Operations' },
  ];

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {language === 'ar' ? 'الأدوات' : 'Tools'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'ar'
            ? 'تسجيل ويندوز للتحميل، وحاسبات أمنية وشبكية تشتغل في المتصفح من غير ما البيانات تطلع.'
            : 'Windows recorders to download, plus in-browser security and network utilities that never leave your device.'}
        </p>
      </div>

      {groups.map((g) => (
        <section key={g.en} className="mb-10">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4">{g[language]}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ATLAS_TOOLS.filter((t) => t.group.en === g.en).map((t) => (
              <article key={t.id} className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold">{t.title[language]}</h3>
                <p className="text-sm text-muted-foreground mt-2">{t.body[language]}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {t.online ? (
                    <Link
                      href={t.href}
                      className="inline-flex min-h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
                    >
                      {language === 'ar' ? 'افتح' : 'Open'}
                    </Link>
                  ) : (
                    <a
                      href={t.download}
                      className="inline-flex min-h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
                    >
                      {language === 'ar' ? 'تحميل ويندوز' : 'Download Windows'}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
