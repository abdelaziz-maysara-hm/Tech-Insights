export type AtlasTool = {
  id: string;
  href: string;
  group: { ar: string; en: string };
  title: { ar: string; en: string };
  body: { ar: string; en: string };
  download?: string;
  online?: boolean;
};

export const ATLAS_TOOLS: AtlasTool[] = [
  {
    id: 'screen',
    href: 'https://github.com/abdelaziz-maysara-hm/atlas-recorders/releases/download/v1.1/Atlas_Screen_Recorder_Portable.zip',
    group: { ar: 'تسجيل', en: 'Recording' },
    title: { ar: 'Atlas Screen Recorder', en: 'Atlas Screen Recorder' },
    body: {
      ar: 'تسجيل الشاشة مع صوت النظام والمايك. Portable لويندوز، بدون علامة مائية.',
      en: 'Screen capture with system audio and mic. Windows portable, no watermark.',
    },
    download:
      'https://github.com/abdelaziz-maysara-hm/atlas-recorders/releases/download/v1.1/Atlas_Screen_Recorder_Portable.zip',
  },
  {
    id: 'sound',
    href: 'https://github.com/abdelaziz-maysara-hm/atlas-recorders/releases/download/v1.1/Atlas_Sound_Recorder_Portable.zip',
    group: { ar: 'تسجيل', en: 'Recording' },
    title: { ar: 'Atlas Sound Recorder', en: 'Atlas Sound Recorder' },
    body: {
      ar: 'تسجيل الصوت WAV على جهازك. Python مضمّن، بدون FFmpeg.',
      en: 'Local WAV recorder. Python bundled, no FFmpeg required.',
    },
    download:
      'https://github.com/abdelaziz-maysara-hm/atlas-recorders/releases/download/v1.1/Atlas_Sound_Recorder_Portable.zip',
  },
  {
    id: 'hash',
    href: '/tools/hash',
    group: { ar: 'أمن', en: 'Security' },
    title: { ar: 'حاسبة التجزئة', en: 'Hash Calculator' },
    body: { ar: 'SHA-256 و SHA-1 و SHA-512 لنص أو ملف. محلي.', en: 'SHA-256, SHA-1, SHA-512 for text or files. Local only.' },
    online: true,
  },
  {
    id: 'jwt',
    href: '/tools/jwt',
    group: { ar: 'أمن', en: 'Security' },
    title: { ar: 'فك JWT', en: 'JWT Decoder' },
    body: { ar: 'اقرأ الهيدر والـ payload بدون إرسال التوكن.', en: 'Inspect header and payload without sending the token.' },
    online: true,
  },
  {
    id: 'password',
    href: '/tools/password',
    group: { ar: 'أمن', en: 'Security' },
    title: { ar: 'مولّد كلمات السر', en: 'Password Generator' },
    body: { ar: 'توليد محلي بإنتروبي واضح.', en: 'Local generation with visible entropy.' },
    online: true,
  },
  {
    id: 'subnet',
    href: '/tools/subnet',
    group: { ar: 'شبكات', en: 'Networking' },
    title: { ar: 'حاسبة الشبكات الفرعية', en: 'Subnet Calculator' },
    body: { ar: 'CIDR، النطاق، البث، وعدد الهوستات.', en: 'CIDR, range, broadcast, host count.' },
    online: true,
  },
  {
    id: 'regex',
    href: '/tools/regex',
    group: { ar: 'عمليات', en: 'Operations' },
    title: { ar: 'اختبار Regex', en: 'Regex Tester' },
    body: { ar: 'مطابقات فورية على النص.', en: 'Instant matches against sample text.' },
    online: true,
  },
  {
    id: 'base64',
    href: '/tools/base64',
    group: { ar: 'عمليات', en: 'Operations' },
    title: { ar: 'Base64', en: 'Base64' },
    body: { ar: 'ترميز وفك ترميز.', en: 'Encode and decode.' },
    online: true,
  },
  {
    id: 'json',
    href: '/tools/json',
    group: { ar: 'عمليات', en: 'Operations' },
    title: { ar: 'منسّق JSON', en: 'JSON Formatter' },
    body: { ar: 'تنسيق أو ضغط مع التحقق.', en: 'Pretty-print or minify with validation.' },
    online: true,
  },
  {
    id: 'cron',
    href: '/tools/cron',
    group: { ar: 'عمليات', en: 'Operations' },
    title: { ar: 'شرح Cron', en: 'Cron Explainer' },
    body: { ar: 'حوّل التعبير الخماسي لكلام مفهوم.', en: 'Turn a 5-field expression into plain language.' },
    online: true,
  },
  {
    id: 'uuid',
    href: '/tools/uuid',
    group: { ar: 'عمليات', en: 'Operations' },
    title: { ar: 'مولّد UUID', en: 'UUID Generator' },
    body: { ar: 'UUID v4 محلي.', en: 'Local UUID v4.' },
    online: true,
  },
  {
    id: 'timestamp',
    href: '/tools/timestamp',
    group: { ar: 'عمليات', en: 'Operations' },
    title: { ar: 'محوّل الوقت', en: 'Unix Timestamp' },
    body: { ar: 'Unix time من وإلى التاريخ.', en: 'Unix time to and from local date.' },
    online: true,
  },
];
