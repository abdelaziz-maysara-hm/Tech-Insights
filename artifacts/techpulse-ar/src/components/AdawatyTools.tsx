import { ADAWATY_ORIGIN, AdawatyLink } from '@/data/adawaty';
import { useLanguage } from '@/context/LanguageContext';
import { ExternalLink } from 'lucide-react';

export function AdawatyTools({ links }: { links: AdawatyLink[] }) {
  const { language } = useLanguage();
  if (!links.length) return null;

  return (
    <aside className="mt-10 rounded-xl border border-border bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {language === 'ar' ? 'أدوات من أدواتي' : 'Tools on Adawaty'}
      </p>
      <h2 className="mt-1 text-lg font-bold">
        {language === 'ar'
          ? 'جرّب الأداة على أدواتي — محلي في المتصفح'
          : 'Try it on Adawaty — runs locally in your browser'}
      </h2>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              {link.title[language]}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </li>
        ))}
      </ul>
      <a
        href={ADAWATY_ORIGIN}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-xs text-muted-foreground hover:text-primary"
      >
        adawaty.tools
      </a>
    </aside>
  );
}
