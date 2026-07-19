import { useLanguage } from '@/context/LanguageContext';
import { ArticleCard } from '@/components/ArticleCard';
import { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useAllArticles } from '@/hooks/useAllArticles';
import { getSubcategories } from '@/data/subcategories';
import { Category } from '@/data/mockData';

export default function Articles() {
  const { language, t } = useLanguage();
  const { allArticles } = useAllArticles();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [activeSubTab, setActiveSubTab] = useState<string>('all');
  const [search, setSearch] = useState('');

  const categories = ['all', 'cybersecurity', 'mobile', 'laptops', 'howto', 'ai', 'reviews', 'windows'];
  const subcategories = activeTab !== 'all' ? getSubcategories(activeTab as Category) : [];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get('c');
    if (c && categories.includes(c)) {
      setActiveTab(c);
    }
  }, []);

  useEffect(() => {
    // Reset the subcategory filter whenever the main category changes
    setActiveSubTab('all');
  }, [activeTab]);

  const filteredArticles = allArticles.filter(article => {
    const matchesCat = activeTab === 'all' || article.categoryId === activeTab;
    const matchesSubCat = activeSubTab === 'all' || article.subcategoryId === activeSubTab;
    const matchesSearch = article.title[language].toLowerCase().includes(search.toLowerCase()) || 
                          (article.tags ?? []).some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSubCat && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-6 text-center">{t('articles')}</h1>
        
        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-8">
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')}
            className="w-full bg-card border border-border rounded-full py-3 px-6 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-3.5 h-5 w-5 text-muted-foreground`} />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === cat 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat === 'all' ? (language === 'ar' ? 'الكل' : 'All') : t(cat)}
            </button>
          ))}
        </div>

        {/* Subcategory tabs - only shown once a specific category is active */}
        {subcategories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveSubTab('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                activeSubTab === 'all'
                  ? 'bg-secondary text-secondary-foreground border-secondary'
                  : 'bg-transparent text-muted-foreground border-border hover:bg-muted/50'
              }`}
            >
              {language === 'ar' ? 'كل الأقسام' : 'All Sections'}
            </button>
            {subcategories.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  activeSubTab === sub.id
                    ? 'bg-secondary text-secondary-foreground border-secondary'
                    : 'bg-transparent text-muted-foreground border-border hover:bg-muted/50'
                }`}
              >
                {language === 'ar' ? sub.ar : sub.en}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            <p className="text-xl mb-2">{t('noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
