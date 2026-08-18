import { useLanguage } from '@/context/LanguageContext';
import { useAllArticles } from '@/hooks/useAllArticles';
import { ArticleCard } from '@/components/ArticleCard';
import { useSEO } from '@/hooks/useSEO';
import { filterGuides } from '@/lib/contentDiscovery';
import { Link } from 'wouter';

export default function Guides() {
  const { language, t } = useLanguage();
  const { allArticles } = useAllArticles();
  const items = filterGuides(allArticles);

  useSEO({
    title: language === 'ar' ? 'الأدلة والشروحات' : 'Guides',
    description:
      language === 'ar'
        ? 'أدلة التكوين والنشر والشروحات العملية'
        : 'Configuration, deployment and practical how-to guides',
    path: '/guides',
  });

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {language === 'ar' ? 'الأدلة والشروحات' : 'Guides'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'ar'
            ? 'أدلة عملية للتنفيذ والتكوين — ليست مقالات أخبار عامة.'
            : 'Practical implementation and configuration guides — not generic news posts.'}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          <p className="mb-4">
            {language === 'ar'
              ? 'لا توجد أدلة مُصنَّفة حالياً. تصفّح المقالات الحالية.'
              : 'No classified guides yet. Browse existing articles.'}
          </p>
          <Link href="/articles" className="text-primary hover:underline">
            {t('articles')}
          </Link>
        </div>
      )}
    </div>
  );
}
