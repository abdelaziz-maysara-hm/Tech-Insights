import { Link } from 'wouter';
import { Search, Menu, X, Moon, Sun, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useAllArticles } from '@/hooks/useAllArticles';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { allArticles } = useAllArticles();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const searchResults = searchQuery.trim() 
    ? allArticles.filter(a => 
        a.title[language].toLowerCase().includes(searchQuery.toLowerCase()) || 
        (a.tags ?? []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  // Close mobile menu when route changes or language changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="text-2xl font-bold text-gradient flex items-center gap-2">
            <span className="bg-primary text-primary-foreground p-1 rounded-md text-xl">TI</span>
            {language === 'ar' ? 'رؤى تقنية' : 'Technical Insights'}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 space-x-reverse font-medium text-sm">
          <Link href="/" className="hover:text-primary transition-colors px-2">{t('home')}</Link>
          <Link href="/articles" className="hover:text-primary transition-colors px-2">{t('articles')}</Link>
          <Link href="/comparisons" className="hover:text-primary transition-colors px-2">{t('comparisons')}</Link>
          <Link href="/videos" className="hover:text-primary transition-colors px-2">{t('videos')}</Link>
        </nav>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              className="w-full bg-muted/50 border border-border rounded-full py-2 px-4 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
            <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-2.5 h-4 w-4 text-muted-foreground`} />
            
            {/* Search Dropdown */}
            {isSearchFocused && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map(article => (
                      <li key={article.id}>
                        <Link href={`/article/${article.slug}`} className="flex items-center gap-3 p-3 hover:bg-muted transition-colors">
                          <img src={article.heroImage} alt="" className="w-12 h-12 object-cover rounded" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{article.title[language]}</p>
                            <p className="text-xs text-muted-foreground truncate">{t(article.categoryId)}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href={`/search?q=${searchQuery}`} className="block p-3 text-center text-sm text-primary hover:bg-muted font-medium border-t border-border">
                        {language === 'ar' ? `عرض كل نتائج "${searchQuery}"` : `View all results for "${searchQuery}"`}
                      </Link>
                    </li>
                  </ul>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {t('noResults')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleLanguage}
            className="p-2 rounded-full hover:bg-muted transition-colors flex items-center gap-1 font-semibold text-sm"
            aria-label="Toggle language"
          >
            <Globe className="h-4 w-4" />
            <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 flex flex-col gap-4 animate-in slide-in-from-top-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              className="w-full bg-muted border border-border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Link 
                href={`/search?q=${searchQuery}`}
                className="absolute top-2 right-4 text-primary text-sm font-medium"
              >
                {t('search')}
              </Link>
            )}
          </div>
          <nav className="flex flex-col gap-2">
            <Link href="/" className="px-4 py-2 rounded-md hover:bg-muted">{t('home')}</Link>
            <Link href="/articles" className="px-4 py-2 rounded-md hover:bg-muted">{t('articles')}</Link>
            <Link href="/comparisons" className="px-4 py-2 rounded-md hover:bg-muted">{t('comparisons')}</Link>
            <Link href="/videos" className="px-4 py-2 rounded-md hover:bg-muted">{t('videos')}</Link>
            <Link href="/categories" className="px-4 py-2 rounded-md hover:bg-muted">{t('categories')}</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
