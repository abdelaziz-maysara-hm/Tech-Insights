import { useLanguage } from '@/context/LanguageContext';
import { PlayCircle } from 'lucide-react';
import { Link } from 'wouter';
import { useSEO } from '@/hooks/useSEO';
import { useAllArticles } from '@/hooks/useAllArticles';
import cmsVideosJson from '@/content/videos.json';
import { CmsVideo } from '@/data/cmsTypes';
import { youtubeThumbnailUrl, youtubeWatchUrl } from '@/lib/mediaUrls';

const cmsVideos = cmsVideosJson as unknown as CmsVideo[];

export default function Videos() {
  const { language, t } = useLanguage();
  const { allArticles } = useAllArticles();

  const videoArticles = allArticles.filter((a) => a.youtubeVideoId);

  useSEO({ title: t('videos') });

  const isEmpty = videoArticles.length === 0 && cmsVideos.length === 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-6 text-gradient inline-block">{t('videos')}</h1>
        <p className="text-lg text-muted-foreground">
          {language === 'ar'
            ? 'شاهد أحدث المراجعات والتغطيات التقنية. الفيديوهات مُضمَّنة بروابط YouTube فقط (بدون رفع ملفات).'
            : 'Watch the latest reviews and tech coverage. Videos are YouTube links only (no file uploads).'}
        </p>
      </div>

      {isEmpty ? (
        <p className="text-center text-muted-foreground mt-12">
          {language === 'ar' ? 'لا توجد فيديوهات حالياً.' : 'No videos yet.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {videoArticles.map((article) => (
            <div
              key={article.id}
              className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all group"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={youtubeThumbnailUrl(article.youtubeVideoId!)}
                  alt=""
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
                  loading="lazy"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.src = youtubeThumbnailUrl(article.youtubeVideoId!, 'hqdefault');
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-8 h-8 ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <span className="text-primary text-xs font-bold mb-2 block">{t(article.categoryId)}</span>
                <h3 className="text-lg font-bold mb-3 line-clamp-2 hover:text-primary transition-colors">
                  <Link href={`/article/${article.slug}`}>{article.title[language]}</Link>
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt[language]}</p>
              </div>
            </div>
          ))}

          {cmsVideos.map((video) => (
            <a
              key={video.id}
              href={youtubeWatchUrl(video.youtubeId)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all group block"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={youtubeThumbnailUrl(video.youtubeId)}
                  alt=""
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
                  loading="lazy"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.src = youtubeThumbnailUrl(video.youtubeId, 'hqdefault');
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-8 h-8 ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title[language]}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{video.description[language]}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
