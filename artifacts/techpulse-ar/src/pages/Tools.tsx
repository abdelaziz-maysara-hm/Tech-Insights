import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { ADAWATY_ORIGIN, ADAWATY_SECURITY } from '@/data/adawaty';
import { ExternalLink } from 'lucide-react';

const APPS = [
  {
    id: 'screen',
    title: 'Atlas Screen Recorder',
    body: {
      ar: 'سجّل الشاشة مع صوت النظام والمايك. Portable لويندوز، بدون علامة مائية ولا حساب.',
      en: 'Record the screen with system audio and mic. Windows portable, no watermark, no account.',
    },
    download:
      'https://github.com/abdelaziz-maysara-hm/atlas-recorders/releases/download/v1.1/Atlas_Screen_Recorder_Portable.zip',
  },
  {
    id: 'sound',
    title: 'Atlas Sound Recorder',
    body: {
      ar: 'سجّل الصوت WAV على جهازك. Python مضمّن.',
      en: 'Record WAV audio locally. Python is bundled.',
    },
    download:
      'https://github.com/abdelaziz-maysara-hm/atlas-recorders/releases/download/v1.1/Atlas_Sound_Recorder_Portable.zip',
  },
] as const;

export default function Tools() {
  const { language } = useLanguage();

  useSEO({
    title: language === 'ar' ? 'تطبيقات Atlas' : 'Atlas Apps',
    description:
      language === 'ar'
        ? 'حمّل Atlas Screen Recorder و Atlas Sound Recorder من NetSec Atlas. أدوات الأمن على أدواتي.'
        : 'Download Atlas Screen Recorder and Atlas Sound Recorder from NetSec Atlas. Security tools live on Adawaty.',
    path: '/tools',
  });

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {language === 'ar' ? 'تطبيقات Atlas' : 'Atlas Apps'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'ar'
            ? 'برامج ويندوز للتسجيل المحلي. أدوات الأمن والشبكات المجانية على أدواتي.'
            : 'Windows apps for local recording. Free security and network utilities live on Adawaty.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {APPS.map((app) => (
          <article key={app.id} className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">{app.title}</h2>
            <p className="text-sm text-muted-foreground mt-2">{app.body[language]}</p>
            <a
              href={app.download}
              className="mt-5 inline-flex min-h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              {language === 'ar' ? 'تحميل ويندوز' : 'Download for Windows'}
            </a>
          </article>
        ))}
      </div>

      <aside className="mt-12 max-w-3xl rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold">
          {language === 'ar' ? 'أدوات الأمن على أدواتي' : 'Security tools on Adawaty'}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {language === 'ar'
            ? 'التجزئة، كلمات السر، الشبكات، والمزيد تشتغل في المتصفح على أدواتي. مقالات NetSec Atlas بتربطك بيها.'
            : 'Hashing, passwords, networking, and more run in the browser on Adawaty. NetSec Atlas articles link out to them.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={ADAWATY_SECURITY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            {language === 'ar' ? 'قسم الأمن والشبكات' : 'Security & network'}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href={ADAWATY_ORIGIN}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border px-4 text-sm"
          >
            adawaty.tools
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </aside>
    </div>
  );
}
