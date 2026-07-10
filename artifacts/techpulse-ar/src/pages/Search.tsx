import { useLanguage } from '@/context/LanguageContext';
import { ArticleCard } from '@/components/ArticleCard';
import { useEffect, useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { useAllArticles } from '@/hooks/useAllArticles';

export default function Search() {
  const { language, t } = useLanguage();
  const { allArticles } = useAllArticles();
  const [query, setQuery] = useState('');
  
  useSEO({ title: t('search') });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get('q') || '');
  }, []);

  const results = query 
    ? allArticles.filter(a => 
        a.title[language].toLowerCase().includes(query.toLowerCase()) || 
        a.excerpt[language].toLowerCase().includes(query.toLowerCase()) ||
        a.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <div className="max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl font-bold mb-8">
          {language === 'ar' ? 'نتائج البحث عن:' : 'Search results for:'} <span className="text-primary">"{query}"</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {results.length > 0 ? (
          results.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-card rounded-2xl border border-border">
            <h2 className="text-2xl font-bold mb-4">{t('noResults')}</h2>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'جرب البحث بكلمات مختلفة أو تصفح الأقسام.' 
                : 'Try searching with different keywords or browse categories.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
