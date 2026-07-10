import { Link } from 'wouter';
import { Article } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { Clock, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  className?: string;
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
          className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
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
            <div className="flex items-center gap-2">
              <img src={article.author.avatar} alt={article.author.name[language]} className="w-6 h-6 rounded-full" />
              <span>{article.author.name[language]}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            <span>{article.date}</span>
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
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="bg-background/80 backdrop-blur-sm text-foreground text-xs font-semibold px-2 py-1 rounded">
            {t(article.categoryId)}
          </span>
        </div>
        {article.youtubeVideoId && (
          <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm rounded-full p-1.5 text-foreground">
            <PlayCircle className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {article.title[language]}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
          {article.excerpt[language]}
        </p>
        <div className="flex items-center justify-between mt-auto text-xs text-muted-foreground pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <img src={article.author.avatar} alt={article.author.name[language]} className="w-5 h-5 rounded-full" />
            <span className="truncate max-w-[100px]">{article.author.name[language]}</span>
          </div>
          <span className="flex items-center gap-1 flex-shrink-0">
            <Clock className="w-3 h-3" />
            {article.readTime} {t('readTime')}
          </span>
        </div>
      </div>
    </Link>
  );
}
