import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { ADAWATY_ORIGIN, ADAWATY_SECURITY } from '@/data/adawaty';
import { ExternalLink } from 'lucide-react';

const APPS = [
  {
    id: 'capture',
    title: 'Atlas Capture',
    body: {
      ar: 'سكرين شوت لمنطقة أو الشاشة كاملة، نسخ للحافظة، من غير إعلانات.',
      en: 'Region or full-screen screenshot, copy to clipboard, no ads.',
    },
    hotkey: 'Ctrl+Shift+S',
    save: 'Documents\\AtlasRecordings\\Capture',
    download:
      'https://github.com/abdelaziz-maysara-hm/atlas-recorders/releases/download/v2.0/Atlas_Capture_Win.zip',
  },
  {
    id: 'clip',
    title: 'Atlas Clip',
    body: {
      ar: 'سجل الحافظة على الجهاز. تثبيت وبحث.',
      en: 'Local clipboard history. Pin and search.',
    },
    hotkey: 'Ctrl+Shift+V',
    save: 'Documents\\AtlasRecordings\\clip_history.json',
    download:
      'https://github.com/abdelaziz-maysara-hm/atlas-recorders/releases/download/v2.0/Atlas_Clip_Win.zip',
  },
  {
    id: 'pdf',
    title: 'Atlas PDF',
    body: {
      ar: 'دمج وتقسيم وتدوير PDF وصور إلى PDF من غير رفع.',
      en: 'Merge, split, rotate PDFs and images to PDF. No upload.',
    },
    hotkey: '—',
    save: 'Documents\\AtlasRecordings\\PDF',
    download:
      'https://github.com/abdelaziz-maysara-hm/atlas-recorders/releases/download/v2.0/Atlas_PDF_Win.zip',
  },
  {
    id: 'screen',
    title: 'Atlas Screen Recorder',
    body: {
      ar: 'سجّل الشاشة مع صوت النظام والمايك. بدون علامة مائية ولا حساب.',
      en: 'Record the screen with system audio and mic. No watermark, no account.',
    },
    hotkey: 'Ctrl+Shift+R',
    save: 'Documents\\AtlasRecordings\\Screen',
    download:
      'https://github.com/abdelaziz-maysara-hm/atlas-recorders/releases/download/v2.1/Atlas_Screen_Recorder_Win.zip',
  },
  {
    id: 'sound',
    title: 'Atlas Sound Recorder',
    body: {
      ar: 'سجّل الصوت WAV على جهازك. Python مضمّن.',
      en: 'Record WAV audio locally. Python is bundled.',
    },
    hotkey: 'Ctrl+Shift+R',
    save: 'Documents\\AtlasRecordings\\Sound',
    download:
      'https://github.com/abdelaziz-maysara-hm/atlas-recorders/releases/download/v2.0/Atlas_Sound_Recorder_Win.zip',
  },
] as const;

export default function Tools() {
  const { language } = useLanguage();
  const ar = language === 'ar';

  useSEO({
    title: ar ? 'تطبيقات Atlas — التحميل والدليل' : 'Atlas Apps — download and setup',
    description: ar
      ? 'حمّل تطبيقات Atlas لويندوز: لقطة، حافظة، PDF، تسجيل شاشة وصوت. دليل الإعداد والاستخدام.'
      : 'Download Atlas Windows apps: capture, clipboard, PDF, screen and sound. Setup and usage guide.',
    path: '/tools',
  });

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{ar ? 'تطبيقات Atlas' : 'Atlas Apps'}</h1>
        <p className="text-muted-foreground">
          {ar
            ? 'نسخة EXE لويندوز. فك الضغط، شغّل الملف. من غير Python ولا Setup.'
            : 'Windows EXE. Extract and run. No Python, no Setup.'}
        </p>
        <a href="#manual" className="inline-block mt-4 text-sm font-medium text-primary hover:underline">
          {ar ? 'دليل الإعداد والاستخدام ↓' : 'Setup and usage guide ↓'}
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {APPS.map((app) => (
          <article key={app.id} className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">{app.title}</h2>
            <p className="text-sm text-muted-foreground mt-2">{app.body[language]}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {ar ? 'اختصار' : 'Hotkey'}: {app.hotkey}
            </p>
            <a
              href={app.download}
              className="mt-5 inline-flex min-h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              {ar ? 'تحميل ويندوز' : 'Download for Windows'}
            </a>
          </article>
        ))}
      </div>

      <section id="manual" className="mt-16 max-w-3xl scroll-mt-24">
        <h2 className="text-2xl font-bold">{ar ? 'دليل الإعداد والاستخدام' : 'Setup and usage'}</h2>

        <h3 className="mt-8 text-lg font-semibold">{ar ? '١. التثبيت (مرة واحدة)' : '1. Setup (once)'}</h3>
        <ol className="mt-3 list-decimal space-y-2 ps-5 text-sm text-muted-foreground leading-relaxed">
          <li>{ar ? 'حمّل ملف ZIP من الكرت فوق (نسخة EXE).' : 'Download the EXE zip from the card above.'}</li>
          <li>{ar ? 'فك الضغط في أي مجلد (مثال: Desktop).' : 'Extract it anywhere (e.g. Desktop).'}</li>
          <li>
            {ar
              ? 'شغّل Atlas_….exe من داخل المجلد. سيب ملفات _internal كما هي.'
              : 'Run Atlas_….exe from inside the folder. Keep the _internal files next to it.'}
          </li>
          <li>
            {ar
              ? 'مفيش Python ولا Setup.bat. SmartScreen: More info ثم Run anyway.'
              : 'No Python and no Setup.bat. SmartScreen: More info, then Run anyway.'}
          </li>
        </ol>

        <h3 className="mt-8 text-lg font-semibold">{ar ? '٢. ويندوز SmartScreen' : '2. Windows SmartScreen'}</h3>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {ar
            ? 'ويندوز ممكن يقول "Windows protected your PC". اضغط More info ثم Run anyway. البرنامج Portable ومش محتاج صلاحيات أدمن.'
            : 'Windows may say “Windows protected your PC”. Click More info, then Run anyway. The app is portable and does not need admin rights.'}
        </p>

        <h3 className="mt-8 text-lg font-semibold">{ar ? '٣. الاستخدام' : '3. How to use each app'}</h3>
        <div className="mt-4 space-y-4 text-sm leading-relaxed">
          <ManualApp
            title="Atlas Capture"
            body={
              ar
                ? 'اختَر منطقة أو الشاشة كاملة. Delay لو هتبدّل نافذة. التقاط ينسخ PNG للحافظة ويحفظ الملف. Ctrl+Shift+S.'
                : 'Pick region or full screen. Use Delay if you need to switch windows. Capture copies PNG to the clipboard and saves the file. Ctrl+Shift+S.'
            }
          />
          <ManualApp
            title="Atlas Clip"
            body={
              ar
                ? 'سيبه شغال في الخلفية. أي نص تنسخه يدخل السجل. تثبيت للعناصر المهمة. Ctrl+Shift+V يطلع النافذة.'
                : 'Leave it running. Copied text lands in history. Pin important items. Ctrl+Shift+V brings the window up.'
            }
          />
          <ManualApp
            title="Atlas PDF"
            body={
              ar
                ? 'Add files: PDF أو صور. Merge للدمج، Split لكل صفحة، Rotate 90°، Images to PDF. النتيجة في مجلد PDF.'
                : 'Add PDF or image files. Merge, Split pages, Rotate 90°, Images to PDF. Output goes to the PDF folder.'
            }
          />
          <ManualApp
            title="Atlas Screen Recorder"
            body={
              ar
                ? 'الجودة، FPS، الصوت (مايك / نظام / الاتنين). عدّ تنازلي، إيقاف تلقائي، NVENC لو الكرت يدعمه. Ctrl+Shift+R يبدأ/يوقف. MP4.'
                : 'Set quality, FPS, audio (mic / system / both). Countdown, auto-stop, NVENC if the GPU allows. Ctrl+Shift+R starts/stops. MP4.'
            }
          />
          <ManualApp
            title="Atlas Sound Recorder"
            body={
              ar
                ? 'اختَر المايك، Mono/Stereo، 48kHz. مقياس مستوى وتحذير قص. إيقاف مؤقت. Ctrl+Shift+R. WAV.'
                : 'Pick the mic, Mono/Stereo, 48 kHz. Level meter and clip warning. Pause. Ctrl+Shift+R. WAV.'
            }
          />
        </div>

        <h3 className="mt-8 text-lg font-semibold">{ar ? '٤. مكان الملفات' : '4. Where files go'}</h3>
        <p className="mt-3 text-sm text-muted-foreground">
          {ar
            ? 'الافتراضي: مجلد المستخدم AtlasRecordings (مش Documents). من Screen اضغط Change folder أو Open Folder. بعد الإيقاف يسألك يفتح الملف.'
            : 'Default: %USERPROFILE%\AtlasRecordings (not Documents). In Screen use Change folder or Open Folder. After Stop it offers to reveal the file.'}
        </p>

        <h3 className="mt-8 text-lg font-semibold">{ar ? '٥. لو حاجة وقفت' : '5. If something fails'}</h3>
        <ul className="mt-3 list-disc space-y-2 ps-5 text-sm text-muted-foreground leading-relaxed">
          <li>
            {ar
              ? 'exe مش بيشتغل: فك الضغط كامل، وسيب مجلد _internal جنب الملف. SmartScreen: Run anyway.'
              : 'exe will not start: extract the whole folder and keep _internal next to the exe. SmartScreen: Run anyway.'}
          </li>
          <li>
            {ar
              ? 'الشاشة من غير صوت نظام: Audio = System أو Both. بعض السماعات الافتراضية بتحتاج WASAPI.'
              : 'Screen has no system audio: set Audio to System or Both. Some default devices need WASAPI.'}
          </li>
          <li>
            {ar
              ? 'الاختصار مش شغال: قفل برنامج تاني ماسك نفس المفاتيح، أو شغّل Atlas الأول.'
              : 'Hotkey does nothing: another app owns the shortcut, or start Atlas first.'}
          </li>
          <li>
            {ar
              ? 'اللغة: زر EN / عربي أعلى النافذة. بتتحفظ.'
              : 'Language: EN / عربي in the window. It is remembered.'}
          </li>
        </ul>
      </section>

      <aside className="mt-12 max-w-3xl rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold">{ar ? 'أدوات الأمن على أدواتي' : 'Security tools on Adawaty'}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {ar
            ? 'التجزئة، كلمات السر، الشبكات تشتغل في المتصفح على أدواتي. المقالات بتربطك بيها.'
            : 'Hashing, passwords, and networking run in the browser on Adawaty. Articles link out to them.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={ADAWATY_SECURITY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            {ar ? 'قسم الأمن والشبكات' : 'Security & network'}
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

function ManualApp({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h4 className="font-semibold">{title}</h4>
      <p className="mt-1 text-muted-foreground">{body}</p>
    </div>
  );
}
