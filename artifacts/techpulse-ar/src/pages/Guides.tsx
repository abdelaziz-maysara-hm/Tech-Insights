import { useLanguage } from '@/context/LanguageContext';
import { useAllArticles } from '@/hooks/useAllArticles';
import { ArticleCard } from '@/components/ArticleCard';
import { useSEO } from '@/hooks/useSEO';
import { filterGuides } from '@/lib/contentDiscovery';
import { Link } from 'wouter';
import { PageBreadcrumbs } from '@/components/PageBreadcrumbs';
import { breadcrumbTrailFor } from '@/lib/breadcrumbs';

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
      <PageBreadcrumbs items={breadcrumbTrailFor('/guides', { lang: language === 'ar' ? 'ar' : 'en', title: language === 'ar' ? 'الأدلة والشروحات' : 'Guides' })} />
      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {language === 'ar' ? 'الأدلة والشروحات' : 'Guides'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'ar'
            ? 'أدلة عملية للتنفيذ والتكوين — ليست مقالات أخبار عامة.'
            : 'Practical implementation and configuration guides — not generic news posts.'}
        </p>
        <Link
          href="/tools#manual"
          className="mt-5 inline-flex min-h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          {language === 'ar' ? 'دليل تطبيقات Atlas' : 'Atlas apps setup guide'}
        </Link>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link href="/categories" className="text-primary hover:underline">{t('categories')}</Link>
          <Link href="/troubleshooting" className="text-primary hover:underline">{language === 'ar' ? 'استكشاف الأعطال' : 'Troubleshooting'}</Link>
          <Link href="/articles" className="text-primary hover:underline">{t('articles')}</Link>
        </div>
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
