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

  const videoArticles = allArticles.filter((a) => a.youtubeVideoId && /^[\w-]{11}$/.test(a.youtubeVideoId));

  useSEO({ title: t('videos'), path: '/videos' });

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
                  <a
                    href={youtubeWatchUrl(article.youtubeVideoId!)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                    aria-label="Play on YouTube"
                  >
                    <PlayCircle className="w-10 h-10" />
                  </a>
                </div>
              </div>
              <div className="p-5">
                <Link href={`/article/${article.slug}`} className="block">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title[language]}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt[language]}</p>
                </Link>
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
                  <div className="w-16 h-16 bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <PlayCircle className="w-10 h-10" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
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
