import { useLanguage } from '@/context/LanguageContext';
import { ArticleCard } from '@/components/ArticleCard';
import { useEffect, useMemo, useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { useAllArticles } from '@/hooks/useAllArticles';
import { Search as SearchIcon } from 'lucide-react';
import type { Category } from '@/data/mockData';
import { rankArticles } from '@/lib/searchRanking';

const CATEGORIES: Category[] = [
  'cybersecurity',
  'mobile',
  'laptops',
  'howto',
  'ai',
  'reviews',
  'windows',
  'comparisons',
  'technology',
];

export default function Search() {
  const { language, t } = useLanguage();
  const { allArticles } = useAllArticles();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');

  useSEO({ title: t('search'), path: '/search' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get('q') || '');
    setCategory(params.get('cat') || 'all');
  }, []);

  const updateUrl = (q: string, cat: string) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (cat !== 'all') params.set('cat', cat);
    const qs = params.toString();
    const next = qs ? `/search?${qs}` : '/search';
    window.history.replaceState(null, '', next);
  };

  const results = useMemo(() => {
    return rankArticles(allArticles, query, category).map((r) => r.article);
  }, [allArticles, query, category]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(query, category);
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <div className="max-w-3xl mx-auto mb-10 space-y-6">
        <h1 className="text-3xl font-bold">
          {language === 'ar' ? 'البحث' : 'Search'}
        </h1>

        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <SearchIcon
              className={`absolute top-3 h-4 w-4 text-muted-foreground ${language === 'ar' ? 'right-3' : 'left-3'}`}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className={`w-full bg-card border border-border rounded-xl py-2.5 ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:outline-none focus:ring-2 focus:ring-primary/50`}
            />
          </div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              updateUrl(query, e.target.value);
            }}
            className="bg-card border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">{language === 'ar' ? 'كل التصنيفات' : 'All categories'}</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(c)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90"
          >
            {t('search')}
          </button>
        </form>

        {(query || category !== 'all') && (
          <p className="text-muted-foreground text-sm">
            {language === 'ar'
              ? `${results.length} نتيجة${query ? ` لـ "${query}"` : ''}`
              : `${results.length} result(s)${query ? ` for "${query}"` : ''}`}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {results.length > 0 ? (
          results.map((article) => <ArticleCard key={article.id} article={article} />)
        ) : (
          <div className="col-span-full py-20 text-center bg-card rounded-2xl border border-border">
            <h2 className="text-2xl font-bold mb-4">{t('noResults')}</h2>
            <p className="text-muted-foreground">
              {language === 'ar'
                ? 'جرب كلمات أخرى أو غيّر التصنيف.'
                : 'Try different keywords or change the category.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
