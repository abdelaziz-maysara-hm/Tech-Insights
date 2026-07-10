import { useLanguage } from '@/context/LanguageContext';
import { PlayCircle } from 'lucide-react';
import { Link } from 'wouter';
import { useSEO } from '@/hooks/useSEO';
import { useAllArticles } from '@/hooks/useAllArticles';

export default function Videos() {
  const { language, t } = useLanguage();
  const { allArticles } = useAllArticles();

  const videoArticles = allArticles.filter(a => a.youtubeVideoId);

  useSEO({ title: t('videos') });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-6 text-gradient inline-block">{t('videos')}</h1>
        <p className="text-lg text-muted-foreground">
          {language === 'ar' 
            ? 'شاهد أحدث المراجعات والتغطيات التقنية عبر قناتنا.' 
            : 'Watch the latest reviews and tech coverage through our channel.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {videoArticles.map(article => (
          <div key={article.id} className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all group">
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <img 
                src={`https://img.youtube.com/vi/${article.youtubeVideoId}/maxresdefault.jpg`}
                alt=""
                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = article.heroImage;
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform cursor-pointer">
                  <PlayCircle className="w-8 h-8 ml-1" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <span className="text-primary text-xs font-bold mb-2 block">{t(article.categoryId)}</span>
              <h3 className="text-lg font-bold mb-3 line-clamp-2 hover:text-primary transition-colors">
                <Link href={`/article/${article.slug}`}>{article.title[language]}</Link>
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {article.excerpt[language]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
