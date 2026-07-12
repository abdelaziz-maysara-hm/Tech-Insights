import { useState, useEffect, FormEvent } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAllArticles } from '@/hooks/useAllArticles';
import { addCustomArticle, deleteCustomArticle, exportData, importData } from '@/data/adminStore';
import { Lock, Plus, List, Download, Upload, Trash2, LogOut } from 'lucide-react';
import { Category } from '@/data/mockData';

export default function Admin() {
  const { language } = useLanguage();
  const { allArticles, refresh } = useAllArticles();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'export'>('list');
  const [newPassword, setNewPassword] = useState('');

  // Form State
  const [arTitle, setArTitle] = useState('');
  const [enTitle, setEnTitle] = useState('');
  const [arExcerpt, setArExcerpt] = useState('');
  const [enExcerpt, setEnExcerpt] = useState('');
  const [arBody, setArBody] = useState('');
  const [enBody, setEnBody] = useState('');
  const [category, setCategory] = useState<Category>('cybersecurity');
  const [youtubeId, setYoutubeId] = useState('');
  const [arAuthor, setArAuthor] = useState('');
  const [enAuthor, setEnAuthor] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [heroImage, setHeroImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  const [importJson, setImportJson] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('techpulse_admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const currentPass = localStorage.getItem('techpulse_admin_pass') || 'admin123';
    if (passwordInput === currentPass) {
      setIsAuthenticated(true);
      sessionStorage.setItem('techpulse_admin_auth', 'true');
    } else {
      alert(language === 'ar' ? 'كلمة المرور غير صحيحة' : 'Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('techpulse_admin_auth');
  };

  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    if (newPassword.trim()) {
      localStorage.setItem('techpulse_admin_pass', newPassword);
      alert(language === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully');
      setNewPassword('');
    }
  };

  const handleAddArticle = (e: FormEvent) => {
    e.preventDefault();
    const id = Date.now().toString();
    const slug = `article-${id}-${enTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const newArticle = {
      id,
      slug,
      title: { ar: arTitle, en: enTitle },
      excerpt: { ar: arExcerpt, en: enExcerpt },
      body: { ar: arBody, en: enBody },
      categoryId: category,
      author: {
        name: { ar: arAuthor || 'إدارة الموقع', en: enAuthor || 'Site Admin' },
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      date: new Date().toISOString().split('T')[0],
      readTime,
      heroImage: heroImage || `https://picsum.photos/seed/${slug}/800/450`,
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
      youtubeVideoId: youtubeId.trim() || undefined,
      isFeatured,
      isTrending
    };

    addCustomArticle(newArticle as any);
    refresh();
    alert(language === 'ar' ? 'تم نشر المقال بنجاح' : 'Article published successfully');
    
    // Reset
    setArTitle(''); setEnTitle(''); setArExcerpt(''); setEnExcerpt('');
    setArBody(''); setEnBody(''); setYoutubeId(''); setTagsStr('');
    setHeroImage(''); setIsFeatured(false); setIsTrending(false);
    setActiveTab('list');
  };

  const handleDelete = (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
      deleteCustomArticle(id);
      refresh();
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'techpulse_articles.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (importData(importJson)) {
      alert(language === 'ar' ? 'تم الاستيراد بنجاح' : 'Import successful');
      setImportJson('');
      refresh();
    } else {
      alert(language === 'ar' ? 'خطأ في تنسيق الملف' : 'Invalid format');
    }
  };

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
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'}
            className="w-full bg-background border border-border rounded-md px-4 py-3 mb-6 focus:ring-2 focus:ring-primary focus:outline-none"
            autoFocus
          />
          <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-md font-bold hover:bg-primary/90 transition-colors">
            {language === 'ar' ? 'دخول' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  // Get only custom articles for the list (since they use Date.now as IDs, they are massive numbers)
  const customArticles = allArticles.filter(a => {
    const num = parseInt(a.id);
    return !isNaN(num) && num > 1000000000;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{language === 'ar' ? 'لوحة الإدارة' : 'Admin Dashboard'}</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors">
          <LogOut className="w-5 h-5" />
          {language === 'ar' ? 'تسجيل خروج' : 'Logout'}
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <button onClick={() => setActiveTab('list')} className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors ${activeTab === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-muted'}`}>
          <List className="w-5 h-5" /> {language === 'ar' ? 'المقالات المضافة' : 'Custom Articles'}
        </button>
        <button onClick={() => setActiveTab('add')} className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors ${activeTab === 'add' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-muted'}`}>
          <Plus className="w-5 h-5" /> {language === 'ar' ? 'إضافة مقال' : 'Add Article'}
        </button>
        <button onClick={() => setActiveTab('export')} className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors ${activeTab === 'export' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-muted'}`}>
          <Upload className="w-5 h-5" /> {language === 'ar' ? 'التصدير/الاستيراد' : 'Export/Import'}
        </button>
      </div>

      {activeTab === 'list' && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {customArticles.length === 0 ? (
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
                    <th className="p-4 font-bold text-right">YouTube ID</th>
                    <th className="p-4 font-bold text-center">{language === 'ar' ? 'حذف' : 'Delete'}</th>
                  </tr>
                </thead>
                <tbody>
                  {customArticles.map(a => (
                    <tr key={a.id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-4 text-right">{a.title[language]}</td>
                      <td className="p-4 text-right"><span className="bg-secondary px-2 py-1 rounded text-xs">{a.categoryId}</span></td>
                      <td className="p-4 text-sm text-muted-foreground text-right">{a.date}</td>
                      <td className="p-4 text-sm text-right">{a.youtubeVideoId || '-'}</td>
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
      )}

      {activeTab === 'add' && (
        <form onSubmit={handleAddArticle} className="bg-card p-6 md:p-8 rounded-xl border border-border space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">العنوان (عربي) *</label>
              <input required value={arTitle} onChange={e => setArTitle(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div dir="ltr">
              <label className="block text-sm font-medium mb-2 text-left">Title (English) *</label>
              <input required value={enTitle} onChange={e => setEnTitle(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">المقتطف (عربي) *</label>
              <textarea required value={arExcerpt} onChange={e => setArExcerpt(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-24" />
            </div>
            <div dir="ltr">
              <label className="block text-sm font-medium mb-2 text-left">Excerpt (English) *</label>
              <textarea required value={enExcerpt} onChange={e => setEnExcerpt(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-24" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">محتوى المقال (عربي) * (Use ## for headings)</label>
              <textarea required value={arBody} onChange={e => setArBody(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-48 font-mono text-sm" />
            </div>
            <div className="md:col-span-2" dir="ltr">
              <label className="block text-sm font-medium mb-2 text-left">Article Body (English) * (Use ## for headings)</label>
              <textarea required value={enBody} onChange={e => setEnBody(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-48 font-mono text-sm" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">التصنيف / Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as Category)} className="w-full bg-background border border-border rounded-md px-4 py-2">
                {['cybersecurity', 'mobile', 'laptops', 'howto', 'ai', 'reviews', 'windows', 'comparisons', 'technology'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">رابط فيديو YouTube / YouTube ID</label>
              <input value={youtubeId} onChange={e => setYoutubeId(e.target.value)} placeholder="e.g. dQw4w9WgXcQ" className="w-full bg-background border border-border rounded-md px-4 py-2" dir="ltr" />
              <p className="text-xs text-muted-foreground mt-1">أدخل ID الفيديو فقط، مثال: dQw4w9WgXcQ</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">اسم الكاتب (عربي)</label>
              <input value={arAuthor} onChange={e => setArAuthor(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div dir="ltr">
              <label className="block text-sm font-medium mb-2 text-left">Author Name (English)</label>
              <input value={enAuthor} onChange={e => setEnAuthor(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">الوسوم / Tags (comma separated)</label>
              <input value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="Tech, Review, 2024" className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">زمن القراءة (دقائق) / Read Time (minutes)</label>
              <input type="number" min="1" value={readTime} onChange={e => setReadTime(Number(e.target.value))} className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">صورة المقال / Hero Image URL (optional)</label>
              <input value={heroImage} onChange={e => setHeroImage(e.target.value)} placeholder="https://..." className="w-full bg-background border border-border rounded-md px-4 py-2" dir="ltr" />
            </div>

            <div className="md:col-span-2 flex gap-8 p-4 bg-muted/50 rounded-md border border-border">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4" />
                <span className="font-medium">Is Featured (مميز)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isTrending} onChange={e => setIsTrending(e.target.checked)} className="w-4 h-4" />
                <span className="font-medium">Is Trending (شائع)</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-bold hover:bg-primary/90 transition-colors">
              نشر المقال / Publish Article
            </button>
          </div>
        </form>
      )}

      {activeTab === 'export' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-xl border border-border">
            <h2 className="text-xl font-bold mb-4">{language === 'ar' ? 'تصدير البيانات' : 'Export Data'}</h2>
            <p className="text-muted-foreground mb-6">
              {language === 'ar' ? 'تحميل جميع المقالات المضافة كملف JSON لعمل نسخة احتياطية.' : 'Download all custom articles as a JSON file for backup.'}
            </p>
            <button onClick={handleExport} className="flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-md font-medium hover:bg-secondary/90 transition-colors">
              <Download className="w-5 h-5" /> {language === 'ar' ? 'تصدير JSON' : 'Export JSON'}
            </button>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <h2 className="text-xl font-bold mb-4">{language === 'ar' ? 'استيراد البيانات' : 'Import Data'}</h2>
            <textarea 
              value={importJson} 
              onChange={e => setImportJson(e.target.value)} 
              placeholder='{"articles": [...]}'
              className="w-full bg-background border border-border rounded-md px-4 py-2 h-32 mb-4 font-mono text-xs text-left" 
              dir="ltr"
            />
            <button onClick={handleImport} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
              <Upload className="w-5 h-5" /> {language === 'ar' ? 'استيراد' : 'Import'}
            </button>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border md:col-span-2">
            <h2 className="text-xl font-bold mb-4">{language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}</h2>
            <form onSubmit={handleChangePassword} className="flex gap-4 max-w-md">
              <input 
                type="text" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                placeholder={language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                className="flex-1 bg-background border border-border rounded-md px-4 py-2" 
                required 
              />
              <button type="submit" className="bg-secondary text-secondary-foreground px-6 py-2 rounded-md font-medium hover:bg-secondary/90 transition-colors">
                {language === 'ar' ? 'حفظ' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}