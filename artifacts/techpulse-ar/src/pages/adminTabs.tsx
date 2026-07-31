import { useState, useEffect, FormEvent } from 'react';
import { CmsVideo, CmsPage } from '@/data/cmsTypes';
import * as adminApi from '@/lib/adminApi';
import { extractYouTubeId } from '@/lib/mediaUrls';
import { Plus, Trash2, Loader2, Pencil } from 'lucide-react';

export function PublishNote({ language, committedToGithub }: { language: 'ar' | 'en'; committedToGithub?: boolean }) {
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

export function ItemsTable({
  language, loading, empty, items, onDelete, onEdit,
}: {
  language: 'ar' | 'en';
  loading: boolean;
  empty: string;
  items: { id: string; col1: string; col2: string; col3: string }[];
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
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
                <th className="p-4 text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="border-b border-border hover:bg-muted/50">
                  <td className="p-4 text-right">{row.col1}</td>
                  <td className="p-4 text-right text-sm" dir="ltr">{row.col2}</td>
                  <td className="p-4 text-sm text-muted-foreground text-right">{row.col3}</td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1">
                      {onEdit && (
                        <button type="button" onClick={() => onEdit(row.id)} className="text-primary hover:bg-primary/10 p-2 rounded-md" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      <button type="button" onClick={() => onDelete(row.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-md" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

export function VideosTab({ language }: { language: 'ar' | 'en' }) {
  const [items, setItems] = useState<CmsVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const reset = () => {
    setArTitle(''); setEnTitle(''); setArDesc(''); setEnDesc(''); setYoutubeInput('');
    setEditingId(null); setFormError('');
  };

  const startEdit = (v: CmsVideo) => {
    setEditingId(v.id);
    setShowForm(true);
    setArTitle(v.title.ar); setEnTitle(v.title.en);
    setArDesc(v.description?.ar || ''); setEnDesc(v.description?.en || '');
    setYoutubeInput(v.youtubeId || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    const yt = extractYouTubeId(youtubeInput);
    if (!yt) {
      setFormError(language === 'ar' ? 'رابط YouTube غير صالح' : 'Invalid YouTube URL or id');
      return;
    }
    const payload = {
      title: { ar: arTitle, en: enTitle },
      description: { ar: arDesc, en: enDesc },
      youtubeId: yt,
    };
    try {
      if (editingId) {
        const res = await adminApi.updateItem<CmsVideo>('videos', editingId, payload);
        setLastResult(res.committedToGithub);
      } else {
        const res = await adminApi.createItem<CmsVideo>('videos', {
          ...payload,
          date: new Date().toISOString().split('T')[0],
        });
        setLastResult(res.committedToGithub);
      }
      reset();
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
    if (editingId === id) { reset(); setShowForm(false); }
    load();
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => {
          if (showForm && !editingId) setShowForm(false);
          else { reset(); setShowForm(true); }
        }}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-bold hover:bg-primary/90"
      >
        <Plus className="w-5 h-5" /> {language === 'ar' ? 'إضافة فيديو (رابط)' : 'Add Video (link)'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card p-6 md:p-8 rounded-xl border border-border space-y-6">
          <h3 className="text-lg font-bold">
            {editingId ? (language === 'ar' ? 'تعديل فيديو' : 'Edit video') : (language === 'ar' ? 'فيديو جديد' : 'New video')}
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
              <input required value={youtubeInput} onChange={(e) => setYoutubeInput(e.target.value)} placeholder="https://youtu.be/..." className="w-full bg-background border border-border rounded-md px-4 py-2" dir="ltr" />
              {extractYouTubeId(youtubeInput) && (
                <p className="text-xs text-green-500 mt-1" dir="ltr">ID: {extractYouTubeId(youtubeInput)}</p>
              )}
            </div>
          </div>
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-bold">
              {editingId ? (language === 'ar' ? 'حفظ' : 'Save') : (language === 'ar' ? 'نشر' : 'Publish')}
            </button>
            {editingId && (
              <button type="button" onClick={() => { reset(); setShowForm(false); }} className="px-6 py-3 rounded-md border border-border">
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            )}
          </div>
        </form>
      )}

      <PublishNote language={language} committedToGithub={lastResult} />
      <ItemsTable
        language={language}
        loading={loading}
        empty={language === 'ar' ? 'لا توجد فيديوهات' : 'No videos'}
        items={items.map((v) => ({ id: v.id, col1: v.title[language], col2: v.youtubeId, col3: v.date }))}
        onDelete={handleDelete}
        onEdit={(id) => {
          const v = items.find((x) => x.id === id);
          if (v) startEdit(v);
        }}
      />
    </div>
  );
}

export function PagesTab({ language }: { language: 'ar' | 'en' }) {
  const [items, setItems] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<boolean | undefined>(undefined);
  const [formError, setFormError] = useState('');
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

  const reset = () => {
    setArTitle(''); setEnTitle(''); setSlug(''); setArContent(''); setEnContent('');
    setShowInFooter(true); setEditingId(null); setFormError('');
  };

  const startEdit = (p: CmsPage) => {
    setEditingId(p.id);
    setShowForm(true);
    setArTitle(p.title.ar); setEnTitle(p.title.en);
    setSlug(p.slug); setArContent(p.content.ar); setEnContent(p.content.en);
    setShowInFooter(p.showInFooter !== false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    const finalSlug = (slug || enTitle).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload = {
      slug: finalSlug,
      title: { ar: arTitle, en: enTitle },
      content: { ar: arContent, en: enContent },
      showInFooter,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    try {
      if (editingId) {
        const res = await adminApi.updateItem<CmsPage>('pages', editingId, payload);
        setLastResult(res.committedToGithub);
      } else {
        const res = await adminApi.createItem<CmsPage>('pages', payload);
        setLastResult(res.committedToGithub);
      }
      reset();
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'حذف؟' : 'Delete?')) return;
    const res = await adminApi.deleteItem('pages', id);
    setLastResult(res.committedToGithub);
    if (editingId === id) { reset(); setShowForm(false); }
    load();
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => {
          if (showForm && !editingId) setShowForm(false);
          else { reset(); setShowForm(true); }
        }}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-bold"
      >
        <Plus className="w-5 h-5" /> {language === 'ar' ? 'إضافة صفحة' : 'Add Page'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border border-border space-y-6">
          <h3 className="text-lg font-bold">
            {editingId ? (language === 'ar' ? 'تعديل صفحة' : 'Edit page') : (language === 'ar' ? 'صفحة جديدة' : 'New page')}
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
            <div className="md:col-span-2" dir="ltr">
              <label className="block text-sm font-medium mb-2 text-left">Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">المحتوى (عربي) *</label>
              <textarea required value={arContent} onChange={(e) => setArContent(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-40" />
            </div>
            <div className="md:col-span-2" dir="ltr">
              <label className="block text-sm font-medium mb-2 text-left">Content (English) *</label>
              <textarea required value={enContent} onChange={(e) => setEnContent(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-2 h-40" />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showInFooter} onChange={(e) => setShowInFooter(e.target.checked)} />
              <span>{language === 'ar' ? 'في الفوتر' : 'In footer'}</span>
            </label>
          </div>
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-bold">
              {editingId ? (language === 'ar' ? 'حفظ' : 'Save') : (language === 'ar' ? 'نشر' : 'Publish')}
            </button>
            {editingId && (
              <button type="button" onClick={() => { reset(); setShowForm(false); }} className="px-6 py-3 rounded-md border border-border">
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            )}
          </div>
        </form>
      )}

      <PublishNote language={language} committedToGithub={lastResult} />
      <ItemsTable
        language={language}
        loading={loading}
        empty={language === 'ar' ? 'لا صفحات' : 'No pages'}
        items={items.map((p) => ({ id: p.id, col1: p.title[language], col2: p.slug, col3: p.updatedAt }))}
        onDelete={handleDelete}
        onEdit={(id) => {
          const p = items.find((x) => x.id === id);
          if (p) startEdit(p);
        }}
      />
    </div>
  );
}
