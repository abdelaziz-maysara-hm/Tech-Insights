import { useState, useEffect, FormEvent, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Category, Article } from '@/data/mockData';
import * as adminApi from '@/lib/adminApi';
import { extractYouTubeId } from '@/lib/mediaUrls';
import { ArticlePreview } from '@/components/admin/ArticlePreview';
import { VideosTab, PagesTab, PublishNote, ItemsTable } from '@/pages/adminTabs';
import {
  Lock, Plus, List, Upload, LogOut, Film, FileText, Loader2, FileJson, Pencil, Eye, Sparkles,
} from 'lucide-react';

type Tab = 'articles' | 'videos' | 'pages' | 'import';
type ImportKind = 'articles' | 'videos';

const ARTICLE_EXAMPLE = `[\n  {\n    "title": { "ar": "عنوان المقال", "en": "Article Title" },\n    "excerpt": { "ar": "ملخص قصير", "en": "Short excerpt" },\n    "body": { "ar": "## مقدمة\\n\\nالنص", "en": "## Intro\\n\\nBody" },\n    "categoryId": "mobile",\n    "tags": ["Phone", "Tips"],\n    "readTime": 5,\n    "heroImage": "https://picsum.photos/seed/demo/800/450",\n    "youtubeVideoId": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"\n  }\n]`;

const VIDEO_EXAMPLE = `[\n  {\n    "title": { "ar": "مراجعة هاتف جديد", "en": "New phone review" },\n    "description": { "ar": "ملخص الفيديو", "en": "Video summary" },\n    "youtubeUrl": "https://youtu.be/dQw4w9WgXcQ"\n  }\n]`;

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
      if (err instanceof adminApi.AdminApiError && err.status === 429) {
        setLoginError(language === 'ar' ? 'محاولات كثيرة — انتظر 15 دقيقة' : 'Too many attempts — wait 15 minutes');
      } else if (err instanceof adminApi.AdminApiError && err.status === 500) {
        setLoginError(language === 'ar' ? 'لوحة الإدارة غير مُهيأة بعد (متغيرات البيئة ناقصة)' : 'Admin panel is not configured yet (missing env vars)');
      } else {
        setLoginError(language === 'ar' ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Incorrect username or password');
      }
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

function ArticlesTab({ language }: { language: 'ar' | 'en' }) {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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
  const [slug, setSlug] = useState('');
  const [generating, setGenerating] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.listItems<Article>('articles').then((res) => setItems(res.items)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const resetForm = () => {
    setArTitle(''); setEnTitle(''); setArExcerpt(''); setEnExcerpt('');
    setArBody(''); setEnBody(''); setYoutubeInput(''); setTagsStr('');
    setHeroImage(''); setIsFeatured(false); setIsTrending(false);
    setReadTime(5); setCategory('technology'); setSlug('');
    setEditingId(null); setFormError('');
  };

  const startEdit = (a: Article) => {
    setEditingId(a.id);
    setShowForm(true);
    setArTitle(a.title.ar); setEnTitle(a.title.en);
    setArExcerpt(a.excerpt.ar); setEnExcerpt(a.excerpt.en);
    setArBody(a.body.ar); setEnBody(a.body.en);
    setCategory((a.categoryId as Category) || 'technology');
    setYoutubeInput(a.youtubeVideoId || '');
    setTagsStr((a.tags ?? []).join(', '));
    setReadTime(a.readTime || 5);
    setHeroImage(a.heroImage || '');
    setIsFeatured(Boolean(a.isFeatured));
    setIsTrending(Boolean(a.isTrending));
    setSlug(a.slug || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = async () => {
    if (!arTitle.trim() && !enTitle.trim()) {
      setFormError(language === 'ar' ? 'اكتب العنوان العربي أو الإنجليزي أولاً' : 'Enter an Arabic or English title first');
      return;
    }
    setGenerating(true);
    setFormError('');
    try {
      const res = await adminApi.generateArticle({
        titleAr: arTitle.trim() || undefined,
        titleEn: enTitle.trim() || undefined,
        categoryId: category,
      });
      if (res.title?.ar) setArTitle(res.title.ar);
      if (res.title?.en) setEnTitle(res.title.en);
      if (res.excerpt?.ar) setArExcerpt(res.excerpt.ar);
      if (res.excerpt?.en) setEnExcerpt(res.excerpt.en);
      if (res.body?.ar) setArBody(res.body.ar);
      if (res.body?.en) setEnBody(res.body.en);
      if (Array.isArray(res.tags) && res.tags.length) setTagsStr(res.tags.join(', '));
      if (res.readTime) setReadTime(res.readTime);
      if (!slug && res.title?.en) {
        setSlug(res.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setFormError(language === 'ar' ? `فشل التوليد: ${msg}` : `Generation failed: ${msg}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    const yt = extractYouTubeId(youtubeInput);
    const payload = {
      title: { ar: arTitle, en: enTitle },
      excerpt: { ar: arExcerpt, en: enExcerpt },
      body: { ar: arBody, en: enBody },
      categoryId: category,
      readTime,
      heroImage: heroImage || undefined,
      tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
      youtubeVideoId: yt || undefined,
      isFeatured,
      isTrending,
      slug: slug || undefined,
    };

    try {
      if (editingId) {
        const res = await adminApi.updateItem<Article>('articles', editingId, payload);
        setLastResult(res.committedToGithub);
      } else {
        const slugBase = enTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const res = await adminApi.createItem<Article>('articles', {
          ...payload,
          slug: slug || `article-${Date.now()}-${slugBase}`,
          author: {
            name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
            avatar: 'https://i.pravatar.cc/150?img=68',
          },
          date: new Date().toISOString().split('T')[0],
        });
        setLastResult(res.committedToGithub);
      }
      resetForm();
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
    if (editingId === id) {
      resetForm();
      setShowForm(false);
    }
    load();
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => {
          if (showForm && !editingId) setShowForm(false);
          else { resetForm(); setShowForm(true); }
        }}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-bold hover:bg-primary/90"
      >
        <Plus className="w-5 h-5" /> {language === 'ar' ? 'إضافة مقال' : 'Add Article'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card p-6 md:p-8 rounded-xl border border-border space-y-6">
          <h3 className="text-lg font-bold">
            {editingId ? (language === 'ar' ? 'تعديل مقال' : 'Edit article') : (language === 'ar' ? 'مقال جديد' : 'New article')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">العنوان (عربي) *</label>
              <input required value={arTitle} onChange={(e) => setArTitle(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div dir="ltr">
              <label className="block text-sm font-medium mb-2 text-left">Title (English) *</label>
              <input required value={enTitle} onChange={(e) => setEnTitle(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating || (!arTitle.trim() && !enTitle.trim())}
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-semibold hover:bg-secondary/90 disabled:opacity-50"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {generating
                  ? (language === 'ar' ? 'جاري التوليد...' : 'Generating...')
                  : (language === 'ar' ? 'ولّد المحتوى بالذكاء الاصطناعي' : 'Generate content with AI')}
              </button>
              <span className="text-xs text-muted-foreground">
                {language === 'ar'
                  ? 'اكتب العنوان ثم اضغط للتوليد — راجع النص قبل الحفظ'
                  : 'Enter a title, then generate — review before saving'}
              </span>
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
              <input value={youtubeInput} onChange={(e) => setYoutubeInput(e.target.value)} placeholder="https://youtu.be/..." className="w-full bg-background border border-border rounded-md px-4 py-2" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Read time (min)</label>
              <input type="number" min={1} value={readTime} onChange={(e) => setReadTime(Number(e.target.value))} className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Hero image URL (https)</label>
              <input value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="https://..." className="w-full bg-background border border-border rounded-md px-4 py-2" dir="ltr" />
            </div>
            <div className="md:col-span-2 flex gap-8 p-4 bg-muted/50 rounded-md border border-border">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4" /><span>Featured</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="w-4 h-4" /><span>Trending</span></label>
            </div>
          </div>
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-bold hover:bg-primary/90">
              {editingId ? (language === 'ar' ? 'حفظ التعديلات' : 'Save changes') : (language === 'ar' ? 'نشر المقال' : 'Publish')}
            </button>
            <button type="button" onClick={() => setShowPreview(true)} className="flex items-center gap-2 px-6 py-3 rounded-md border border-border hover:bg-muted">
              <Eye className="w-4 h-4" />
              {language === 'ar' ? 'معاينة' : 'Preview'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { resetForm(); setShowForm(false); }} className="px-6 py-3 rounded-md border border-border hover:bg-muted">
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            )}
          </div>
        </form>
      )}

      <ArticlePreview
        language={language}
        open={showPreview}
        onClose={() => setShowPreview(false)}
        title={language === 'ar' ? arTitle : enTitle}
        excerpt={language === 'ar' ? arExcerpt : enExcerpt}
        body={language === 'ar' ? arBody : enBody}
        heroImage={heroImage || undefined}
        category={category}
        youtubeId={extractYouTubeId(youtubeInput) || undefined}
      />

      <PublishNote language={language} committedToGithub={lastResult} />
      <ItemsTable
        language={language}
        loading={loading}
        empty={language === 'ar' ? 'لا توجد مقالات' : 'No articles'}
        items={items.map((a) => ({ id: a.id, col1: a.title[language], col2: a.categoryId, col3: a.date }))}
        onDelete={handleDelete}
        onEdit={(id) => {
          const a = items.find((x) => x.id === id);
          if (a) startEdit(a);
        }}
      />
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
    if (Array.isArray(parsed)) items = parsed;
    else if (kind === 'articles' && Array.isArray((parsed as any)?.articles)) items = (parsed as any).articles;
    else if (kind === 'videos' && Array.isArray((parsed as any)?.videos)) items = (parsed as any).videos;
    else {
      setMessage({ type: 'error', text: language === 'ar' ? 'مصفوفة غير موجودة' : 'No array found' });
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
          : `Imported ${res.added}. ${res.committedToGithub ? 'Saved to GitHub.' : 'Local only.'}`,
      });
      setImportJson('');
    } catch (err) {
      if (err instanceof adminApi.AdminApiError && Array.isArray((err as any).data?.details)) {
        setDetails((err as any).data.details);
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
      <h2 className="text-xl font-bold">{language === 'ar' ? 'استيراد JSON' : 'JSON Import'}</h2>
      <div className="flex gap-2">
        <button type="button" onClick={() => { setKind('articles'); setImportJson(''); }} className={`px-4 py-2 rounded-md text-sm font-medium ${kind === 'articles' ? 'bg-primary text-primary-foreground' : 'border border-border'}`}>{language === 'ar' ? 'مقالات' : 'Articles'}</button>
        <button type="button" onClick={() => { setKind('videos'); setImportJson(''); }} className={`px-4 py-2 rounded-md text-sm font-medium ${kind === 'videos' ? 'bg-primary text-primary-foreground' : 'border border-border'}`}>{language === 'ar' ? 'فيديوهات' : 'Videos'}</button>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setImportJson(example)} className="text-sm px-4 py-2 rounded-md border border-border">{language === 'ar' ? 'مثال' : 'Example'}</button>
        <button type="button" onClick={() => fileRef.current?.click()} className="text-sm px-4 py-2 rounded-md border border-border flex items-center gap-2"><FileJson className="w-4 h-4" /> JSON</button>
        <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void f.text().then((t) => { setImportJson(t); setMessage(null); });
          e.target.value = '';
        }} />
      </div>
      <textarea value={importJson} onChange={(e) => setImportJson(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-72 font-mono text-xs" dir="ltr" />
      {message && <p className={`text-sm ${message.type === 'ok' ? 'text-green-500' : 'text-red-500'}`}>{message.text}</p>}
      {details.length > 0 && <ul className="text-xs text-red-400 list-disc ps-5" dir="ltr">{details.map((d, i) => <li key={i}>{d}</li>)}</ul>}
      <button onClick={handleImport} disabled={busy || !importJson.trim()} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium disabled:opacity-60">
        {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
        {language === 'ar' ? 'استيراد' : 'Import'}
      </button>
    </div>
  );
}
