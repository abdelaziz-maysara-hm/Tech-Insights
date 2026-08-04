import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { PlayCircle } from 'lucide-react';
import { Link } from 'wouter';
import { useSEO } from '@/hooks/useSEO';
import { useAllArticles } from '@/hooks/useAllArticles';
import cmsVideosJson from '@/content/videos.json';
import { CmsVideo } from '@/data/cmsTypes';
import { extractYouTubeId, extractYouTubePlaylistId, youtubeEmbedUrl, youtubePlaylistEmbedUrl, youtubeThumbnailUrl } from '@/lib/mediaUrls';
import { getSubcategories } from '@/data/subcategories';
import { Category } from '@/data/mockData';

const cmsVideos = cmsVideosJson as unknown as CmsVideo[];

type Playable = {
  key: string;
  title: string;
  youtubeId: string;
  playlistId?: string;
  heroImage?: string;
  href?: string;
  categoryId?: string;
  subcategoryId?: string;
  meta?: string;
};

const CATEGORIES = ['all', 'cybersecurity', 'mobile', 'laptops', 'howto', 'ai', 'reviews', 'windows'];

export default function Videos() {
  const { language, t } = useLanguage();
  const { allArticles } = useAllArticles();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [activeSubTab, setActiveSubTab] = useState('all');

  const subcategories = activeTab !== 'all' ? getSubcategories(activeTab as Category) : [];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get('c');
    if (c && CATEGORIES.includes(c)) setActiveTab(c);
  }, []);

  useEffect(() => {
    setActiveSubTab('all');
  }, [activeTab]);

  const fromArticles: Playable[] = allArticles
    .filter((a) => a.youtubeVideoId && /^[\w-]{11}$/.test(a.youtubeVideoId))
    .map((a) => ({
      key: `article-${a.id}`,
      title: a.title[language],
      youtubeId: a.youtubeVideoId!,
      href: `/article/${a.slug}`,
      categoryId: a.categoryId,
      subcategoryId: a.subcategoryId,
      meta: a.categoryId,
    }));

  const fromCms: Playable[] = cmsVideos
    .map((v) => {
      const id = extractYouTubeId(v.youtubeId || '');
      const playlistId = extractYouTubePlaylistId(v.youtubePlaylistId || '');
      if (!id && !playlistId) return null;
      const title =
        typeof v.title === 'object' && v.title
          ? v.title[language] || v.title.ar || v.title.en || id || playlistId
          : String(v.title || id || playlistId);
      return {
        key: `cms-${v.id}`,
        title,
        youtubeId: id,
        playlistId: playlistId || undefined,
        heroImage: v.heroImage,
        categoryId: v.categoryId,
        subcategoryId: v.subcategoryId,
        meta: v.categoryId,
      } as Playable;
    })
    .filter(Boolean) as Playable[];

  const seen = new Set<string>();
  const items: Playable[] = [];
  for (const item of [...fromCms, ...fromArticles]) {
    const dedupeKey = item.playlistId ? `playlist:${item.playlistId}` : `video:${item.youtubeId}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    items.push(item);
  }

  const filtered = items.filter((item) => {
    const matchesCat = activeTab === 'all' || item.categoryId === activeTab;
    const matchesSub = activeSubTab === 'all' || item.subcategoryId === activeSubTab;
    return matchesCat && matchesSub;
  });

  useSEO({ title: t('videos'), path: '/videos' });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">{t('videos')}</h1>
        <p className="text-muted-foreground">
          {language === 'ar'
            ? 'شروحات مرئية مقسّمة حسب التصنيف لسهولة التصفح.'
            : 'Video explainers organized by category for easier browsing.'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              activeTab === cat
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            {cat === 'all' ? (language === 'ar' ? 'الكل' : 'All') : t(cat)}
          </button>
        ))}
      </div>

      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            type="button"
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              activeSubTab === 'all'
                ? 'bg-secondary text-secondary-foreground border-secondary'
                : 'bg-background border-border'
            }`}
          >
            {language === 'ar' ? 'كل الفرعي' : 'All sub'}
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => setActiveSubTab(sub.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                activeSubTab === sub.id
                  ? 'bg-secondary text-secondary-foreground border-secondary'
                  : 'bg-background border-border'
              }`}
            >
              {language === 'ar' ? sub.ar : sub.en}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">
          {language === 'ar' ? 'لا توجد فيديوهات في هذا التصنيف بعد.' : 'No videos in this category yet.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const isActive = activeId === item.key;
            return (
              <article key={item.key} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="relative aspect-video bg-muted">
                  {isActive ? (
                    <iframe
                      src={`${item.playlistId ? youtubePlaylistEmbedUrl(item.playlistId) : youtubeEmbedUrl(item.youtubeId)}?autoplay=1&rel=0`}
                      title={item.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveId(item.key)}
                      className="absolute inset-0 w-full h-full group text-start"
                      aria-label={language === 'ar' ? 'تشغيل الفيديو' : 'Play video'}
                    >
                      <img
                        src={item.playlistId ? (item.heroImage || youtubeThumbnailUrl(item.youtubeId)) : youtubeThumbnailUrl(item.youtubeId)}
                        alt=""
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                        loading="lazy"
                        onError={(e) => {
                          const el = e.target as HTMLImageElement;
                          if (!item.playlistId) el.src = youtubeThumbnailUrl(item.youtubeId, 'hqdefault');
                        }}
                      />
                      {item.playlistId && (
                        <span className="absolute top-2 start-2 bg-background/90 backdrop-blur-sm rounded-md px-2 py-1 text-xs font-medium">
                          {language === 'ar' ? 'قائمة تشغيل كاملة' : 'Full Playlist'}
                        </span>
                      )}
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-background/80 backdrop-blur-sm rounded-full p-4 text-primary shadow-lg group-hover:scale-110 transition-transform">
                          <PlayCircle className="w-12 h-12" />
                        </span>
                      </span>
                    </button>
                  )}
                </div>
                <div className="p-5 space-y-2">
                  <h2 className="text-lg font-bold leading-snug">{item.title}</h2>
                  {item.categoryId && (
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {t(item.categoryId as any) || item.categoryId}
                    </p>
                  )}
                  {item.href && (
                    <Link href={item.href} className="text-sm text-primary font-medium hover:underline inline-block">
                      {language === 'ar' ? 'اقرأ المقال المرتبط' : 'Read related article'}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
