import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { PlayCircle } from 'lucide-react';
import { Link } from 'wouter';
import { useSEO } from '@/hooks/useSEO';
import { useAllArticles } from '@/hooks/useAllArticles';
import cmsVideosJson from '@/content/videos.json';
import { CmsVideo } from '@/data/cmsTypes';
import { extractYouTubeId, youtubeEmbedUrl, youtubeThumbnailUrl } from '@/lib/mediaUrls';

const cmsVideos = cmsVideosJson as unknown as CmsVideo[];

type Playable = {
  key: string;
  title: string;
  youtubeId: string;
  href?: string;
  meta?: string;
};

export default function Videos() {
  const { language, t } = useLanguage();
  const { allArticles } = useAllArticles();
  const [activeId, setActiveId] = useState<string | null>(null);

  const fromArticles: Playable[] = allArticles
    .filter((a) => a.youtubeVideoId && /^[\w-]{11}$/.test(a.youtubeVideoId))
    .map((a) => ({
      key: `article-${a.id}`,
      title: a.title[language],
      youtubeId: a.youtubeVideoId!,
      href: `/article/${a.slug}`,
      meta: a.categoryId,
    }));

  const fromCms: Playable[] = cmsVideos
    .map((v) => {
      const id = extractYouTubeId(v.youtubeId || '');
      if (!id) return null;
      const title =
        typeof v.title === 'object' && v.title
          ? v.title[language] || v.title.ar || v.title.en || id
          : String(v.title || id);
      return {
        key: `cms-${v.id}`,
        title,
        youtubeId: id,
        meta: v.date,
      } as Playable;
    })
    .filter(Boolean) as Playable[];

  // Prefer CMS library videos, then article-linked videos (dedupe by youtube id)
  const seen = new Set<string>();
  const items: Playable[] = [];
  for (const item of [...fromCms, ...fromArticles]) {
    if (seen.has(item.youtubeId)) continue;
    seen.add(item.youtubeId);
    items.push(item);
  }

  useSEO({ title: t('videos'), path: '/videos' });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-6 text-gradient inline-block">{t('videos')}</h1>
        <p className="text-lg text-muted-foreground">
          {language === 'ar'
            ? 'شاهد المراجعات والشروحات التقنية مباشرة داخل الموقع.'
            : 'Watch tech reviews and explainers embedded on this site.'}
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-muted-foreground mt-12">
          {language === 'ar' ? 'لا توجد فيديوهات حالياً.' : 'No videos yet.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {items.map((item) => {
            const playing = activeId === item.key;
            return (
              <article
                key={item.key}
                className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all"
              >
                <div className="relative aspect-video w-full bg-black">
                  {playing ? (
                    <iframe
                      src={`${youtubeEmbedUrl(item.youtubeId)}?autoplay=1&rel=0`}
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
                        src={youtubeThumbnailUrl(item.youtubeId)}
                        alt=""
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                        loading="lazy"
                        onError={(e) => {
                          const el = e.target as HTMLImageElement;
                          el.src = youtubeThumbnailUrl(item.youtubeId, 'hqdefault');
                        }}
                      />
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
                  {item.meta && (
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.meta}</p>
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
