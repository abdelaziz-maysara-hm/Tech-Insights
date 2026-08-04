import { Link } from 'wouter';
import { Article } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { Clock, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';


function authorName(article: Article, language: 'ar' | 'en'): string {
  const a: any = article.author;
  if (!a) return language === 'ar' ? 'فريق رؤى تقنية' : 'Technical Insights Team';
  if (typeof a === 'string') return a;
  if (a.name && typeof a.name === 'object') return a.name[language] || a.name.ar || a.name.en || '';
  if (typeof a.name === 'string') return a.name;
  return language === 'ar' ? 'فريق رؤى تقنية' : 'Technical Insights Team';
}

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  className?: string;
}

const HERO_FALLBACK =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop';

function handleHeroError(e: React.SyntheticEvent<HTMLImageElement>) {
  const el = e.currentTarget;
  if (el.dataset.fallback) return;
  el.dataset.fallback = '1';
  el.src = HERO_FALLBACK;
}

export function ArticleCard({ article, featured = false, className }: ArticleCardProps) {
  const { language, t } = useLanguage();

  if (featured) {
    return (
      <Link href={`/article/${article.slug}`} className={cn("group block relative overflow-hidden rounded-2xl glow-effect", className)}>
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent z-10" />
        <img
          src={article.heroImage}
          alt={article.title[language]}
          className="w-full h-full min-h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={handleHeroError}
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
          <div className="flex gap-2 mb-3">
            <span className="bg-primary/90 text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {t(article.categoryId)}
            </span>
            {article.isTrending && (
              <span className="bg-secondary/90 text-secondary-foreground text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                🔥 {language === 'ar' ? 'شائع' : 'Hot'}
              </span>
            )}
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight group-hover:text-primary transition-colors">
            {article.title[language]}
          </h2>
          <p className="text-gray-200 text-sm md:text-base line-clamp-2 max-w-3xl mb-4">
            {article.excerpt[language]}
          </p>
          <div className="flex items-center gap-4 text-xs md:text-sm text-gray-300">
            <span>{authorName(article, language)}</span>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime} {t('readTime')}
            </span>
          </div>
        </div>
        {article.youtubeVideoId && (
          <div className="absolute top-6 right-6 z-20 bg-background/50 backdrop-blur-md rounded-full p-2 text-white">
            <PlayCircle className="w-6 h-6" />
          </div>
        )}
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.slug}`} className={cn("group flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5", className)}>
      <div className="relative aspect-video overflow-hidden">
        <img
          src={article.heroImage}
          alt={article.title[language]}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={handleHeroError}
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="bg-background/80 backdrop-blur-sm text-foreground text-xs font-semibold px-2 py-1 rounded">
            {t(article.categoryId)}
          </span>
        </div>
        {article.youtubeVideoId && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4 md:p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {article.title[language]}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
          {article.excerpt[language]}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
          <span className="truncate max-w-[160px]">{authorName(article, language)}</span>
          <span className="flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime} {t('readTime')}
          </span>
        </div>
      </div>
    </Link>
  );
}
