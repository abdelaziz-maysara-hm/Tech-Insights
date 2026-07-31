import { useState, useEffect, FormEvent, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Category } from '@/data/mockData';
import { Article } from '@/data/mockData';
import { CmsVideo, CmsPage } from '@/data/cmsTypes';
import * as adminApi from '@/lib/adminApi';
import {
  Lock, Plus, List, Upload, Trash2, LogOut, Film, FileText, Loader2, FileJson,
} from 'lucide-react';

type Tab = 'articles' | 'videos' | 'pages' | 'import';

const ARTICLE_EXAMPLE = `[
  {
    "title": {
      "ar": "عنوان المقال بالعربية",
      "en": "Article Title in English"
    },
    "excerpt": {
      "ar": "ملخص قصير يظهر في البطاقات.",
      "en": "Short excerpt shown on cards."
    },
    "body": {
      "ar": "## المقدمة\\n\\nنص المقال الكامل. استخدم ## للعناوين الفرعية.",
      "en": "## Introduction\\n\\nFull article body. Use ## for subheadings."
    },
    "categoryId": "mobile",
    "tags": ["هاتف", "Phone", "Tips"],
    "readTime": 5,
    "isFeatured": false,
    "isTrending": false
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
          : (language === 'ar' ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Incorrect username or password')
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
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder={language === 'ar' ? 'اسم المستخدم' : 'Username'}
            className="w-full bg-background border border-border rounded-md px-4 py-3 mb-4 focus:ring-2 focus:ring-primary focus:outline-none"
            autoFocus
          />
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'}
            className="w-full bg-background border border-border rounded-md px-4 py-3 mb-4 focus:ring-2 focus:ring-primary focus:outline-none"
          />
          {loginError && <p className="text-red-500 text-sm mb-4 text-center">{loginError}</p>}
          <button
            type="submit"
            disabled={loginBusy}
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-bold hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
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
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors">
          <LogOut className="w-5 h-5" />
          {language === 'ar' ? 'تسجيل خروج' : 'Logout'}
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <TabButton active={activeTab === 'articles'} onClick={() => setActiveTab('articles')} icon={<List className="w-5 h-5" />}>
          {language === 'ar' ? 'المقالات' : 'Articles'}
        </TabButton>
        <TabButton active={activeTab === 'videos'} onClick={() => setActiveTab('videos')} icon={<Film className="w-5 h-5" />}>
          {language === 'ar' ? 'الفيديوهات' : 'Videos'}
        </TabButton>
        <TabButton active={activeTab === 'pages'} onClick={() => setActiveTab('pages')} icon={<FileText className="w-5 h-5" />}>
          {language === 'ar' ? 'الصفحات' : 'Pages'}
        </TabButton>
        <TabButton active={activeTab === 'import'} onClick={() => setActiveTab('import')} icon={<Upload className="w-5 h-5" />}>
          {language === 'ar' ? 'استيراد JSON' : 'JSON Import'}
        </TabButton>
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
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors ${active ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-muted'}`}
    >
      {icon} {children}
    </button>
  );
}

function PublishNote({ language, committedToGithub }: { language: 'ar' | 'en'; committedToGithub?: boolean }) {
  if (committedToGithub === undefined) return null;
  if (committedToGithub) {
    return (
      <p className="text-xs text-green-500 mt-2">
        {language === 'ar'
          ? 'تم الحفظ على GitHub، وسيظهر التعديل على الموقع بعد إعادة النشر (دقيقة إلى دقيقتين).'
          : 'Saved to GitHub. The change will appear on the live site after rebuild (about 1-2 minutes).'}
      </p>
    );
  }
  return (
    <p className="text-xs text-yellow-500 mt-2">
      {language === 'ar'
        ? 'تم الحفظ محلياً فقط — لم يتم ربط GitHub بعد (GITHUB_TOKEN/GITHUB_REPO).'
        : 'Saved locally only — GitHub is not connected yet (GITHUB_TOKEN/GITHUB_REPO).'}
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
  const [youtubeId, setYoutubeId] = useState('');
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
    const slugBase = enTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newArticle: Partial<Article> = {
      slug: `article-${Date.now()}-${slugBase}`,
      title: { ar: arTitle, en: enTitle },
      excerpt: { ar: arExcerpt, en: enExcerpt },
      body: { ar: arBody, en: enBody },
      categoryId: category,
      author: {
        name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
        avatar: 'https://i.pravatar.cc/150?img=68',
      },
      date: new Date().toISOString().split('T')[0],
      readTime,
      heroImage: heroImage || `https://picsum.photos/seed/${slugBase || Date.now()}/800/450`,
      tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
      youtubeVideoId: youtubeId.trim() || undefined,
      isFeatured,
      isTrending,
    };
    try {
      const res = await adminApi.createItem<Article>('articles', newArticle);
      setLastResult(res.committedToGithub);
      setArTitle(''); setEnTitle(''); setArExcerpt(''); setEnExcerpt('');
      setArBody(''); setEnBody(''); setYoutubeId(''); setTagsStr('');
      setHeroImage(''); setIsFeatured(false); setIsTrending(false);
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return;
    const res = await adminApi.deleteItem('articles', id);
    setLastResult(res.committedToGithub);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-bold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" /> {language === 'ar' ? 'إضافة مقال' : 'Add Article'}
        </button>
      </div>

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
              <label className="block text-sm font-medium mb-2">محتوى المقال (عربي) * (استخدم ## للعناوين)</label>
              <textarea required value={arBody} onChange={(e) => setArBody(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-48 font-mono text-sm" />
            </div>
            <div className="md:col-span-2" dir="ltr">
              <label className="block text-sm font-medium mb-2 text-left">Article Body (English) * (Use ## for headings)</label>
              <textarea required value={enBody} onChange={(e) => setEnBody(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-48 font-mono text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">التصنيف / Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full bg-background border border-border rounded-md px-4 py-2">
                {['cybersecurity', 'mobile', 'laptops', 'howto', 'ai', 'reviews', 'windows', 'comparisons', 'technology'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">رابط فيديو YouTube / YouTube ID</label>
              <input value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} placeholder="e.g. dQw4w9WgXcQ" className="w-full bg-background border border-border rounded-md px-4 py-2" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الوسوم / Tags (comma separated)</label>
              <input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="Tech, Review, 2024" className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">زمن القراءة (دقائق)</label>
              <input type="number" min="1" value={readTime} onChange={(e) => setReadTime(Number(e.target.value))} className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">صورة المقال / Hero Image URL (optional)</label>
              <input value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="https://..." className="w-full bg-background border border-border rounded-md px-4 py-2" dir="ltr" />
            </div>
            <div className="md:col-span-2 flex gap-8 p-4 bg-muted/50 rounded-md border border-border">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4" />
                <span className="font-medium">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="w-4 h-4" />
                <span className="font-medium">Trending</span>
              </label>
            </div>
          </div>
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <div className="pt-4 border-t border-border">
            <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-bold hover:bg-primary/90 transition-colors">
              {language === 'ar' ? 'نشر المقال' : 'Publish Article'}
            </button>
          </div>
        </form>
      )}

      <PublishNote language={language} committedToGithub={lastResult} />

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            {language === 'ar' ? 'لا توجد مقالات مضافة بعد' : 'No custom articles added yet'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="p-4 font-bold text-right">{language === 'ar' ? 'العنوان' : 'Title'}</th>
                  <th className="p-4 font-bold text-right">{language === 'ar' ? 'التصنيف' : 'Category'}</th>
                  <th className="p-4 font-bold text-right">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th className="p-4 font-bold text-center">{language === 'ar' ? 'حذف' : 'Delete'}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 text-right">{a.title[language]}</td>
                    <td className="p-4 text-right"><span className="bg-secondary px-2 py-1 rounded text-xs">{a.categoryId}</span></td>
                    <td className="p-4 text-sm text-muted-foreground text-right">{a.date}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-md transition-colors inline-block">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function VideosTab({ language }: { language: 'ar' | 'en' }) {
  const [items, setItems] = useState<CmsVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [lastResult, setLastResult] = useState<boolean | undefined>(undefined);

  const [arTitle, setArTitle] = useState('');
  const [enTitle, setEnTitle] = useState('');
  const [arDesc, setArDesc] = useState('');
  const [enDesc, setEnDesc] = useState('');
  const [youtubeId, setYoutubeId] = useState('');

  const load = () => {
    setLoading(true);
    adminApi.listItems<CmsVideo>('videos').then((res) => setItems(res.items)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const res = await adminApi.createItem<CmsVideo>('videos', {
      title: { ar: arTitle, en: enTitle },
      description: { ar: arDesc, en: enDesc },
      youtubeId: youtubeId.trim(),
      date: new Date().toISOString().split('T')[0],
    });
    setLastResult(res.committedToGithub);
    setArTitle(''); setEnTitle(''); setArDesc(''); setEnDesc(''); setYoutubeId('');
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) return;
    const res = await adminApi.deleteItem('videos', id);
    setLastResult(res.committedToGithub);
    load();
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => setShowForm((v) => !v)}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-bold hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-5 h-5" /> {language === 'ar' ? 'إضافة فيديو' : 'Add Video'}
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
              <label className="block text-sm font-medium mb-2">الوصف (عربي)</label>
              <textarea value={arDesc} onChange={(e) => setArDesc(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-24" />
            </div>
            <div dir="ltr">
              <label className="block text-sm font-medium mb-2 text-left">Description (English)</label>
              <textarea value={enDesc} onChange={(e) => setEnDesc(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-24" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">YouTube Video ID *</label>
              <input required value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} placeholder="e.g. dQw4w9WgXcQ" className="w-full bg-background border border-border rounded-md px-4 py-2" dir="ltr" />
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-bold hover:bg-primary/90 transition-colors">
              {language === 'ar' ? 'نشر الفيديو' : 'Publish Video'}
            </button>
          </div>
        </form>
      )}

      <PublishNote language={language} committedToGithub={lastResult} />

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            {language === 'ar' ? 'لا توجد فيديوهات مضافة بعد' : 'No videos added yet'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="p-4 font-bold text-right">{language === 'ar' ? 'العنوان' : 'Title'}</th>
                  <th className="p-4 font-bold text-right">YouTube ID</th>
                  <th className="p-4 font-bold text-right">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th className="p-4 font-bold text-center">{language === 'ar' ? 'حذف' : 'Delete'}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((v) => (
                  <tr key={v.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 text-right">{v.title[language]}</td>
                    <td className="p-4 text-sm text-right" dir="ltr">{v.youtubeId}</td>
                    <td className="p-4 text-sm text-muted-foreground text-right">{v.date}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDelete(v.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-md transition-colors inline-block">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) return;
    const res = await adminApi.deleteItem('pages', id);
    setLastResult(res.committedToGithub);
    load();
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => setShowForm((v) => !v)}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-bold hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-5 h-5" /> {language === 'ar' ? 'إضافة صفحة' : 'Add Page'}
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
            <div className="md:col-span-2" dir="ltr">
              <label className="block text-sm font-medium mb-2 text-left">Slug (URL) — optional</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="about-us" className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">المحتوى (عربي) *</label>
              <textarea required value={arContent} onChange={(e) => setArContent(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-40" />
            </div>
            <div className="md:col-span-2" dir="ltr">
              <label className="block text-sm font-medium mb-2 text-left">Content (English) *</label>
              <textarea required value={enContent} onChange={(e) => setEnContent(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-40" />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showInFooter} onChange={(e) => setShowInFooter(e.target.checked)} className="w-4 h-4" />
                <span className="font-medium">{language === 'ar' ? 'إظهار في الفوتر' : 'Show in footer'}</span>
              </label>
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-bold hover:bg-primary/90 transition-colors">
              {language === 'ar' ? 'نشر الصفحة' : 'Publish Page'}
            </button>
          </div>
        </form>
      )}

      <PublishNote language={language} committedToGithub={lastResult} />

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            {language === 'ar' ? 'لا توجد صفحات مضافة بعد' : 'No pages added yet'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="p-4 font-bold text-right">{language === 'ar' ? 'العنوان' : 'Title'}</th>
                  <th className="p-4 font-bold text-right">Slug</th>
                  <th className="p-4 font-bold text-center">{language === 'ar' ? 'حذف' : 'Delete'}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 text-right">{p.title[language]}</td>
                    <td className="p-4 text-sm text-right" dir="ltr">/page/{p.slug}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-md transition-colors inline-block">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ImportTab({ language }: { language: 'ar' | 'en' }) {
  const [importJson, setImportJson] = useState('');
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [details, setDetails] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const text = await file.text();
    setImportJson(text);
    setMessage(null);
    setDetails([]);
  };

  const handleImport = async () => {
    setMessage(null);
    setDetails([]);
    let parsed: unknown;
    try {
      parsed = JSON.parse(importJson);
    } catch {
      setMessage({ type: 'error', text: language === 'ar' ? 'صيغة JSON غير صحيحة' : 'Invalid JSON' });
      return;
    }
    const items = Array.isArray(parsed) ? parsed : (parsed as any)?.articles;
    if (!Array.isArray(items) || !items.length) {
      setMessage({
        type: 'error',
        text: language === 'ar'
          ? 'لم يتم العثور على مصفوفة مقالات. استخدم [...] أو { "articles": [...] }'
          : 'No articles array found. Use [...] or { "articles": [...] }',
      });
      return;
    }
    setBusy(true);
    try {
      const res = await adminApi.bulkImport('articles', items);
      setMessage({
        type: 'ok',
        text: language === 'ar'
          ? `تم استيراد ${res.added} مقال بنجاح. ${res.committedToGithub ? 'تم الحفظ على GitHub — سيظهر بعد إعادة البناء.' : 'تم الحفظ محلياً فقط (GitHub غير مربوط).'}`
          : `Imported ${res.added} article(s). ${res.committedToGithub ? 'Saved to GitHub — will appear after rebuild.' : 'Saved locally only (GitHub not connected).'}`,
      });
      setImportJson('');
    } catch (err) {
      if (err instanceof adminApi.AdminApiError) {
        const data = (err as any).data;
        const errs = data?.details || data?.error;
        if (Array.isArray(errs)) {
          setDetails(errs);
          setMessage({
            type: 'error',
            text: language === 'ar' ? 'فشل التحقق من الحقول — راجع التفاصيل أدناه' : 'Validation failed — see details below',
          });
        } else {
          setMessage({ type: 'error', text: err.message });
        }
      } else {
        setMessage({ type: 'error', text: err instanceof Error ? err.message : String(err) });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-xl border border-border max-w-3xl space-y-4">
      <h2 className="text-xl font-bold">{language === 'ar' ? 'استيراد مقالات دفعة واحدة (JSON)' : 'Bulk-import Articles (JSON)'}</h2>
      <p className="text-sm text-muted-foreground">
        {language === 'ar'
          ? 'الصق مصفوفة مقالات أو ارفع ملف .json. الحقول الإلزامية: title و excerpt و body (كل منها ar + en). باقي الحقول اختيارية ويتم تعبئتها تلقائياً.'
          : 'Paste an articles array or upload a .json file. Required: title, excerpt, body (each with ar + en). Other fields are optional and auto-filled.'}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setImportJson(ARTICLE_EXAMPLE)}
          className="text-sm px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors"
        >
          {language === 'ar' ? 'إدراج مثال' : 'Insert example'}
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-sm px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2"
        >
          <FileJson className="w-4 h-4" />
          {language === 'ar' ? 'رفع ملف JSON' : 'Upload JSON file'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = '';
          }}
        />
      </div>

      <textarea
        value={importJson}
        onChange={(e) => setImportJson(e.target.value)}
        placeholder={ARTICLE_EXAMPLE}
        className="w-full bg-background border border-border rounded-md px-4 py-2 h-72 font-mono text-xs text-left"
        dir="ltr"
      />

      {message && (
        <p className={`text-sm ${message.type === 'ok' ? 'text-green-500' : 'text-red-500'}`}>{message.text}</p>
      )}
      {details.length > 0 && (
        <ul className="text-xs text-red-400 list-disc ps-5 space-y-1" dir="ltr">
          {details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      )}

      <button
        onClick={handleImport}
        disabled={busy || !importJson.trim()}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
        {language === 'ar' ? 'استيراد' : 'Import'}
      </button>

      <div className="text-xs text-muted-foreground border-t border-border pt-4 space-y-1" dir="ltr">
        <p className="font-medium">{language === 'ar' ? 'التصنيفات المسموحة:' : 'Allowed categoryId values:'}</p>
        <p>cybersecurity · mobile · laptops · howto · ai · reviews · windows · comparisons · technology</p>
      </div>
    </div>
  );
}
