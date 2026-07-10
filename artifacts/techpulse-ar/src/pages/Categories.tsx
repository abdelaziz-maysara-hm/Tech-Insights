import { useLanguage } from '@/context/LanguageContext';
import { Category } from '@/data/mockData';
import { Link } from 'wouter';
import { useSEO } from '@/hooks/useSEO';
import { useAllArticles } from '@/hooks/useAllArticles';

export default function Categories() {
  const { language, t } = useLanguage();
  const { allArticles } = useAllArticles();

  const categories: Category[] = ['cybersecurity', 'mobile', 'laptops', 'howto', 'ai', 'reviews', 'windows', 'comparisons'];

  useSEO({ title: t('categories') });

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-10 text-center">{t('categories')}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
        {categories.map(cat => {
          const count = allArticles.filter(a => a.categoryId === cat).length;
          
          return (
            <Link 
              key={cat} 
              href={`/articles?c=${cat}`}
              className="group bg-card border border-border rounded-xl p-6 text-center hover:border-primary transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl font-bold">{cat.charAt(0).toUpperCase()}</span>
              </div>
              <h3 className="font-bold text-lg mb-1">{t(cat)}</h3>
              <p className="text-sm text-muted-foreground">
                {count} {language === 'ar' ? 'مقالات' : 'Articles'}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
