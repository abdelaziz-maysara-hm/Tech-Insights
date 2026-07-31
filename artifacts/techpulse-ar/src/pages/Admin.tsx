import { useState, useEffect, FormEvent, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Category } from '@/data/mockData';
import { Article } from '@/data/mockData';
import { CmsVideo, CmsPage } from '@/data/cmsTypes';
import * as adminApi from '@/lib/adminApi';
import { extractYouTubeId } from '@/lib/mediaUrls';
import {
  Lock, Plus, List, Upload, Trash2, LogOut, Film, FileText, Loader2, FileJson,
} from 'lucide-react';

type Tab = 'articles' | 'videos' | 'pages' | 'import';
type ImportKind = 'articles' | 'videos';

const ARTICLE_EXAMPLE = `[
  {
    "title": { "ar": "عنوان المقال", "en": "Article Title" },
    "excerpt": { "ar": "ملخص قصير", "en": "Short excerpt" },
    "body": { "ar": "## مقدمة\\n\\nالنص", "en": "## Intro\\n\\nBody" },
    "categoryId": "mobile",
    "tags": ["Phone", "Tips"],
    "readTime": 5,
    "heroImage": "https://picsum.photos/seed/demo/800/450",
    "youtubeVideoId": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }
]`;

const VIDEO_EXAMPLE = `[
  {
    "title": { "ar": "مراجعة هاتف جديد", "en": "New phone review" },
    "description": { "ar": "ملخص الفيديو", "en": "Video summary" },
    "youtubeUrl": "https://youtu.be/dQw4w9WgXcQ"
  }
]`;

export default function Admin() {
  const { language } = useLanguage();
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('articles');

  useEffect(() => {
    adminApi.me()
      .then((res) => {
        if (res.authenticated) {
          setIsAuthenticated(true);
          setUsername(res.username || '');
        }
      })
      .catch(() => {})
      .finally(() => setCheckingSession(false));
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginBusy(true);
    try {
      const res = await adminApi.login(usernameInput, passwordInput);
      setIsAuthenticated(true);
      setUsername(res.username);
    } catch (err) {
      setLoginError(
        err instanceof adminApi.AdminApiError && err.status === 500
          ? (language === 'ar' ? 'لوحة الإدارة غير مُهيأة بعد (متغيرات البيئة ناقصة)' : 'Admin panel is not configured yet (missing env vars)')
          : (language === 'ar' ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Incorrect username or password'),
      );
    } finally {
      setLoginBusy(false);
    }
  };

  const handleLogout = async () => {
    await adminApi.logout().catch(() => {});
    setIsAuthenticated(false);
    setUsername('');
  };

  if (checkingSession) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[60vh]">
        <form onSubmit={handleLogin} className="bg-card p-8 rounded-2xl border border-border shadow-lg max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">{language === 'ar' ? 'تسجيل الدخول للإدارة' : 'Admin Login'}</h1>
          <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} placeholder={language === 'ar' ? 'اسم المستخدم' : 'Username'} className="w-full bg-background border border-border rounded-md px-4 py-3 mb-4 focus:ring-2 focus:ring-primary focus:outline-none" autoFocus />
          <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'} className="w-full bg-background border border-border rounded-md px-4 py-3 mb-4 focus:ring-2 focus:ring-primary focus:outline-none" />
          {loginError && <p className="text-red-500 text-sm mb-4 text-center">{loginError}</p>}
          <button type="submit" disabled={loginBusy} className="w-full bg-primary text-primary-foreground py-3 rounded-md font-bold hover:bg-primary/90 transition-colors disabled:opacity-60">
            {loginBusy ? (language === 'ar' ? 'جاري الدخول...' : 'Logging in...') : (language === 'ar' ? 'دخول' : 'Login')}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{language === 'ar' ? 'لوحة الإدارة' : 'Admin Dashboard'}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {language === 'ar' ? `مسجل دخول كـ ${username}` : `Logged in as ${username}`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'ar'
              ? 'الوسائط = روابط فقط (YouTube / صور https) — لا رفع ملفات على Vercel'
              : 'Media = links only (YouTube / https images) — no file uploads on Vercel'}
          </p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors">
          <LogOut className="w-5 h-5" />
          {language === 'ar' ? 'تسجيل خروج' : 'Logout'}
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <TabButton active={activeTab === 'articles'} onClick={() => setActiveTab('articles')} icon={<List className="w-5 h-5" />}>{language === 'ar' ? 'المقالات' : 'Articles'}</TabButton>
        <TabButton active={activeTab === 'videos'} onClick={() => setActiveTab('videos')} icon={<Film className="w-5 h-5" />}>{language === 'ar' ? 'الفيديوهات' : 'Videos'}</TabButton>
        <TabButton active={activeTab === 'pages'} onClick={() => setActiveTab('pages')} icon={<FileText className="w-5 h-5" />}>{language === 'ar' ? 'الصفحات' : 'Pages'}</TabButton>
        <TabButton active={activeTab === 'import'} onClick={() => setActiveTab('import')} icon={<Upload className="w-5 h-5" />}>{language === 'ar' ? 'استيراد JSON' : 'JSON Import'}</TabButton>
      </div>

      {activeTab === 'articles' && <ArticlesTab language={language} />}
      {activeTab === 'videos' && <VideosTab language={language} />}
      {activeTab === 'pages' && <PagesTab language={language} />}
      {activeTab === 'import' && <ImportTab language={language} />}
    </div>
  );
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors ${active ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-muted'}`}>
      {icon} {children}
    </button>
  );
}

function PublishNote({ language, committedToGithub }: { language: 'ar' | 'en'; committedToGithub?: boolean }) {
  if (committedToGithub === undefined) return null;
  if (committedToGithub) {
    return (
      <p className="text-xs text-green-500 mt-2">
        {language === 'ar' ? 'تم الحفظ على GitHub — يظهر بعد إعادة البناء (1–2 دقيقة).' : 'Saved to GitHub — appears after rebuild (1–2 min).'}
      </p>
    );
  }
  return (
    <p className="text-xs text-yellow-500 mt-2">
      {language === 'ar' ? 'حُفظ محلياً فقط — GitHub غير مربوط.' : 'Saved locally only — GitHub not connected.'}
    </p>
  );
}

function ArticlesTab({ language }: { language: 'ar' | 'en' }) {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [lastResult, setLastResult] = useState<boolean | undefined>(undefined);
  const [formError, setFormError] = useState('');
  const [arTitle, setArTitle] = useState('');
  const [enTitle, setEnTitle] = useState('');
  const [arExcerpt, setArExcerpt] = useState('');
  const [enExcerpt, setEnExcerpt] = useState('');
  const [arBody, setArBody] = useState('');
  const [enBody, setEnBody] = useState('');
  const [category, setCategory] = useState<Category>('technology');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [heroImage, setHeroImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.listItems<Article>('articles').then((res) => setItems(res.items)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    const yt = extractYouTubeId(youtubeInput);
    const slugBase = enTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    try {
      const res = await adminApi.createItem<Article>('articles', {
        slug: `article-${Date.now()}-${slugBase}`,
        title: { ar: arTitle, en: enTitle },
        excerpt: { ar: arExcerpt, en: enExcerpt },
        body: { ar: arBody, en: enBody },
        categoryId: category,
        author: { name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' }, avatar: 'https://i.pravatar.cc/150?img=68' },
        date: new Date().toISOString().split('T')[0],
        readTime,
        heroImage: heroImage || undefined,
        tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
        youtubeVideoId: yt || undefined,
        isFeatured,
        isTrending,
      });
      setLastResult(res.committedToGithub);
      setArTitle(''); setEnTitle(''); setArExcerpt(''); setEnExcerpt('');
      setArBody(''); setEnBody(''); setYoutubeInput(''); setTagsStr('');
      setHeroImage(''); setIsFeatured(false); setIsTrending(false);
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) return;
    const res = await adminApi.deleteItem('articles', id);
    setLastResult(res.committedToGithub);
    load();
  };

  return (
    <div className="space-y-6">
      <button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-bold hover:bg-primary/90">
        <Plus className="w-5 h-5" /> {language === 'ar' ? 'إضافة مقال' : 'Add Article'}
      </button>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-card p-6 md:p-8 rounded-xl border border-border space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">العنوان (عربي) *</label>
              <input required value={arTitle} onChange={(e) => setArTitle(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div dir="ltr">
              <label className="block text-sm font-medium mb-2 text-left">Title (English) *</label>
              <input required value={enTitle} onChange={(e) => setEnTitle(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">المقتطف (عربي) *</label>
              <textarea required value={arExcerpt} onChange={(e) => setArExcerpt(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-24" />
            </div>
            <div dir="ltr">
              <label className="block text-sm font-medium mb-2 text-left">Excerpt (English) *</label>
              <textarea required value={enExcerpt} onChange={(e) => setEnExcerpt(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-24" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">محتوى المقال (عربي) *</label>
              <textarea required value={arBody} onChange={(e) => setArBody(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-48 font-mono text-sm" />
            </div>
            <div className="md:col-span-2" dir="ltr">
              <label className="block text-sm font-medium mb-2 text-left">Article Body (English) *</label>
              <textarea required value={enBody} onChange={(e) => setEnBody(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-48 font-mono text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full bg-background border border-border rounded-md px-4 py-2">
                {['cybersecurity', 'mobile', 'laptops', 'howto', 'ai', 'reviews', 'windows', 'comparisons', 'technology'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">YouTube URL أو ID</label>
              <input value={youtubeInput} onChange={(e) => setYoutubeInput(e.target.value)} placeholder="https://youtu.be/... أو dQw4w9WgXcQ" className="w-full bg-background border border-border rounded-md px-4 py-2" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Read time (min)</label>
              <input type="number" min="1" value={readTime} onChange={(e) => setReadTime(Number(e.target.value))} className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Hero image URL (https فقط — بدون رفع ملف)</label>
              <input value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="https://..." className="w-full bg-background border border-border rounded-md px-4 py-2" dir="ltr" />
            </div>
            <div className="md:col-span-2 flex gap-8 p-4 bg-muted/50 rounded-md border border-border">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4" /><span>Featured</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="w-4 h-4" /><span>Trending</span></label>
            </div>
          </div>
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-bold hover:bg-primary/90">{language === 'ar' ? 'نشر المقال' : 'Publish'}</button>
        </form>
      )}

      <PublishNote language={language} committedToGithub={lastResult} />
      <ItemsTable language={language} loading={loading} empty={language === 'ar' ? 'لا توجد مقالات' : 'No articles'} items={items.map((a) => ({ id: a.id, col1: a.title[language], col2: a.categoryId, col3: a.date }))} onDelete={handleDelete} />
    </div>
  );
}

function VideosTab({ language }: { language: 'ar' | 'en' }) {
  const [items, setItems] = useState<CmsVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [lastResult, setLastResult] = useState<boolean | undefined>(undefined);
  const [formError, setFormError] = useState('');
  const [arTitle, setArTitle] = useState('');
  const [enTitle, setEnTitle] = useState('');
  const [arDesc, setArDesc] = useState('');
  const [enDesc, setEnDesc] = useState('');
  const [youtubeInput, setYoutubeInput] = useState('');

  const load = () => {
    setLoading(true);
    adminApi.listItems<CmsVideo>('videos').then((res) => setItems(res.items)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    const yt = extractYouTubeId(youtubeInput);
    if (!yt) {
      setFormError(language === 'ar' ? 'رابط YouTube غير صالح' : 'Invalid YouTube URL or id');
      return;
    }
    try {
      const res = await adminApi.createItem<CmsVideo>('videos', {
        title: { ar: arTitle, en: enTitle },
        description: { ar: arDesc, en: enDesc },
        youtubeId: yt,
        date: new Date().toISOString().split('T')[0],
      });
      setLastResult(res.committedToGithub);
      setArTitle(''); setEnTitle(''); setArDesc(''); setEnDesc(''); setYoutubeInput('');
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'حذف؟' : 'Delete?')) return;
    const res = await adminApi.deleteItem('videos', id);
    setLastResult(res.committedToGithub);
    load();
  };

  return (
    <div className="space-y-6">
      <button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-bold hover:bg-primary/90">
        <Plus className="w-5 h-5" /> {language === 'ar' ? 'إضافة فيديو (رابط)' : 'Add Video (link)'}
      </button>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-card p-6 md:p-8 rounded-xl border border-border space-y-6">
          <p className="text-xs text-muted-foreground">
            {language === 'ar'
              ? 'لا يتم رفع فيديو — فقط رابط YouTube. الصورة المصغّرة تُجلب تلقائياً من YouTube.'
              : 'No video upload — YouTube link only. Thumbnail is fetched automatically from YouTube.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">العنوان (عربي) *</label>
              <input required value={arTitle} onChange={(e) => setArTitle(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div dir="ltr">
              <label className="block text-sm font-medium mb-2 text-left">Title (English) *</label>
              <input required value={enTitle} onChange={(e) => setEnTitle(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الوصف (عربي)</label>
              <textarea value={arDesc} onChange={(e) => setArDesc(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-24" />
            </div>
            <div dir="ltr">
              <label className="block text-sm font-medium mb-2 text-left">Description (English)</label>
              <textarea value={enDesc} onChange={(e) => setEnDesc(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-24" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">YouTube URL أو ID *</label>
              <input required value={youtubeInput} onChange={(e) => setYoutubeInput(e.target.value)} placeholder="https://www.youtube.com/watch?v=... أو youtu.be/..." className="w-full bg-background border border-border rounded-md px-4 py-2" dir="ltr" />
              {extractYouTubeId(youtubeInput) && (
                <p className="text-xs text-green-500 mt-1" dir="ltr">ID: {extractYouTubeId(youtubeInput)}</p>
              )}
            </div>
          </div>
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-bold">{language === 'ar' ? 'نشر الفيديو' : 'Publish Video'}</button>
        </form>
      )}

      <PublishNote language={language} committedToGithub={lastResult} />
      <ItemsTable language={language} loading={loading} empty={language === 'ar' ? 'لا توجد فيديوهات' : 'No videos'} items={items.map((v) => ({ id: v.id, col1: v.title[language], col2: v.youtubeId, col3: v.date }))} onDelete={handleDelete} />
    </div>
  );
}

function PagesTab({ language }: { language: 'ar' | 'en' }) {
  const [items, setItems] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [lastResult, setLastResult] = useState<boolean | undefined>(undefined);
  const [arTitle, setArTitle] = useState('');
  const [enTitle, setEnTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [arContent, setArContent] = useState('');
  const [enContent, setEnContent] = useState('');
  const [showInFooter, setShowInFooter] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi.listItems<CmsPage>('pages').then((res) => setItems(res.items)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const finalSlug = (slug || enTitle).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const res = await adminApi.createItem<CmsPage>('pages', {
      slug: finalSlug,
      title: { ar: arTitle, en: enTitle },
      content: { ar: arContent, en: enContent },
      updatedAt: new Date().toISOString().split('T')[0],
      showInFooter,
    });
    setLastResult(res.committedToGithub);
    setArTitle(''); setEnTitle(''); setSlug(''); setArContent(''); setEnContent('');
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'حذف؟' : 'Delete?')) return;
    const res = await adminApi.deleteItem('pages', id);
    setLastResult(res.committedToGithub);
    load();
  };

  return (
    <div className="space-y-6">
      <button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-bold">
        <Plus className="w-5 h-5" /> {language === 'ar' ? 'إضافة صفحة' : 'Add Page'}
      </button>
      {showForm && (
        <form onSubmit={handleAdd} className="bg-card p-6 rounded-xl border border-border space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium mb-2">العنوان (عربي) *</label><input required value={arTitle} onChange={(e) => setArTitle(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2" /></div>
            <div dir="ltr"><label className="block text-sm font-medium mb-2 text-left">Title (English) *</label><input required value={enTitle} onChange={(e) => setEnTitle(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2" /></div>
            <div className="md:col-span-2" dir="ltr"><label className="block text-sm font-medium mb-2 text-left">Slug</label><input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-2">المحتوى (عربي) *</label><textarea required value={arContent} onChange={(e) => setArContent(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-40" /></div>
            <div className="md:col-span-2" dir="ltr"><label className="block text-sm font-medium mb-2 text-left">Content (English) *</label><textarea required value={enContent} onChange={(e) => setEnContent(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-40" /></div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={showInFooter} onChange={(e) => setShowInFooter(e.target.checked)} /><span>{language === 'ar' ? 'في الفوتر' : 'In footer'}</span></label>
          </div>
          <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-bold">{language === 'ar' ? 'نشر' : 'Publish'}</button>
        </form>
      )}
      <PublishNote language={language} committedToGithub={lastResult} />
      <ItemsTable language={language} loading={loading} empty={language === 'ar' ? 'لا صفحات' : 'No pages'} items={items.map((p) => ({ id: p.id, col1: p.title[language], col2: p.slug, col3: p.updatedAt }))} onDelete={handleDelete} />
    </div>
  );
}

function ItemsTable({
  language, loading, empty, items, onDelete,
}: {
  language: 'ar' | 'en';
  loading: boolean;
  empty: string;
  items: { id: string; col1: string; col2: string; col3: string }[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {loading ? (
        <div className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground">{empty}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="p-4 text-right">{language === 'ar' ? 'العنوان' : 'Title'}</th>
                <th className="p-4 text-right">Info</th>
                <th className="p-4 text-right">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                <th className="p-4 text-center">{language === 'ar' ? 'حذف' : 'Delete'}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="border-b border-border hover:bg-muted/50">
                  <td className="p-4 text-right">{row.col1}</td>
                  <td className="p-4 text-right text-sm" dir="ltr">{row.col2}</td>
                  <td className="p-4 text-sm text-muted-foreground text-right">{row.col3}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => onDelete(row.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-md"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ImportTab({ language }: { language: 'ar' | 'en' }) {
  const [kind, setKind] = useState<ImportKind>('articles');
  const [importJson, setImportJson] = useState('');
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [details, setDetails] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const example = kind === 'articles' ? ARTICLE_EXAMPLE : VIDEO_EXAMPLE;

  const handleImport = async () => {
    setMessage(null);
    setDetails([]);
    let parsed: unknown;
    try {
      parsed = JSON.parse(importJson);
    } catch {
      setMessage({ type: 'error', text: language === 'ar' ? 'JSON غير صحيح' : 'Invalid JSON' });
      return;
    }

    let items: unknown[];
    if (Array.isArray(parsed)) {
      items = parsed;
    } else if (kind === 'articles' && Array.isArray((parsed as any)?.articles)) {
      items = (parsed as any).articles;
    } else if (kind === 'videos' && Array.isArray((parsed as any)?.videos)) {
      items = (parsed as any).videos;
    } else {
      setMessage({
        type: 'error',
        text: language === 'ar'
          ? `لم يتم العثور على مصفوفة. استخدم [...] أو { "${kind}": [...] }`
          : `No array found. Use [...] or { "${kind}": [...] }`,
      });
      return;
    }

    if (!items.length) {
      setMessage({ type: 'error', text: language === 'ar' ? 'المصفوفة فارغة' : 'Empty array' });
      return;
    }

    setBusy(true);
    try {
      const res = await adminApi.bulkImport(kind, items as any[]);
      setMessage({
        type: 'ok',
        text: language === 'ar'
          ? `تم استيراد ${res.added} عنصر. ${res.committedToGithub ? 'حُفظ على GitHub.' : 'محلي فقط.'}`
          : `Imported ${res.added} item(s). ${res.committedToGithub ? 'Saved to GitHub.' : 'Local only.'}`,
      });
      setImportJson('');
    } catch (err) {
      if (err instanceof adminApi.AdminApiError && Array.isArray(err.data?.details)) {
        setDetails(err.data.details);
        setMessage({ type: 'error', text: language === 'ar' ? 'فشل التحقق' : 'Validation failed' });
      } else {
        setMessage({ type: 'error', text: err instanceof Error ? err.message : String(err) });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-xl border border-border max-w-3xl space-y-4">
      <h2 className="text-xl font-bold">{language === 'ar' ? 'استيراد JSON (روابط فقط)' : 'JSON Import (links only)'}</h2>
      <p className="text-sm text-muted-foreground">
        {language === 'ar'
          ? 'لا رفع صور/فيديوهات كملفات. استخدم روابط https للصور وروابط YouTube للفيديو. مناسب لحدود Vercel.'
          : 'No binary image/video uploads. Use https image URLs and YouTube links. Fits Vercel limits.'}
      </p>

      <div className="flex gap-2">
        <button type="button" onClick={() => { setKind('articles'); setImportJson(''); setMessage(null); }} className={`px-4 py-2 rounded-md text-sm font-medium ${kind === 'articles' ? 'bg-primary text-primary-foreground' : 'border border-border'}`}>
          {language === 'ar' ? 'مقالات' : 'Articles'}
        </button>
        <button type="button" onClick={() => { setKind('videos'); setImportJson(''); setMessage(null); }} className={`px-4 py-2 rounded-md text-sm font-medium ${kind === 'videos' ? 'bg-primary text-primary-foreground' : 'border border-border'}`}>
          {language === 'ar' ? 'فيديوهات' : 'Videos'}
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setImportJson(example)} className="text-sm px-4 py-2 rounded-md border border-border hover:bg-muted">
          {language === 'ar' ? 'إدراج مثال' : 'Insert example'}
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className="text-sm px-4 py-2 rounded-md border border-border hover:bg-muted flex items-center gap-2">
          <FileJson className="w-4 h-4" />
          {language === 'ar' ? 'رفع ملف JSON' : 'Upload JSON file'}
        </button>
        <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void f.text().then((t) => { setImportJson(t); setMessage(null); setDetails([]); });
          e.target.value = '';
        }} />
      </div>

      <textarea value={importJson} onChange={(e) => setImportJson(e.target.value)} placeholder={example} className="w-full bg-background border border-border rounded-md px-4 py-2 h-72 font-mono text-xs text-left" dir="ltr" />

      {message && <p className={`text-sm ${message.type === 'ok' ? 'text-green-500' : 'text-red-500'}`}>{message.text}</p>}
      {details.length > 0 && (
        <ul className="text-xs text-red-400 list-disc ps-5 space-y-1" dir="ltr">
          {details.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      )}

      <button onClick={handleImport} disabled={busy || !importJson.trim()} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium disabled:opacity-60">
        {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
        {language === 'ar' ? 'استيراد' : 'Import'}
      </button>

      <div className="text-xs text-muted-foreground border-t border-border pt-4 space-y-2" dir="ltr">
        {kind === 'videos' ? (
          <>
            <p className="font-medium">Video fields: title (ar/en required), youtubeUrl | youtubeId (required), description optional</p>
            <p>Accepts: youtu.be/ID · youtube.com/watch?v=ID · shorts · embed · bare 11-char id</p>
          </>
        ) : (
          <>
            <p className="font-medium">Article required: title, excerpt, body (each ar+en). Optional: heroImage (https), youtubeVideoId/URL, tags, categoryId</p>
            <p>categoryId: cybersecurity · mobile · laptops · howto · ai · reviews · windows · comparisons · technology</p>
          </>
        )}
      </div>
    </div>
  );
}
