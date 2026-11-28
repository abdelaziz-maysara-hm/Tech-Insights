import { useLanguage } from '@/context/LanguageContext';
import { useAllArticles } from '@/hooks/useAllArticles';
import { ArticleCard } from '@/components/ArticleCard';
import { useSEO } from '@/hooks/useSEO';
import { filterTroubleshooting } from '@/lib/contentDiscovery';
import { Link } from 'wouter';
import { PageBreadcrumbs } from '@/components/PageBreadcrumbs';
import { breadcrumbTrailFor } from '@/lib/breadcrumbs';

export default function Troubleshooting() {
  const { language, t } = useLanguage();
  const { allArticles } = useAllArticles();
  const items = filterTroubleshooting(allArticles);

  useSEO({
    title: language === 'ar' ? 'استكشاف الأخطاء وإصلاحها' : 'Troubleshooting',
    description:
      language === 'ar'
        ? 'حلول عملية لمشاكل الشبكات والأمن والأنظمة'
        : 'Practical fixes for network, security and systems problems',
    path: '/troubleshooting',
  });

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <PageBreadcrumbs items={breadcrumbTrailFor('/troubleshooting', { lang: language === 'ar' ? 'ar' : 'en', title: language === 'ar' ? 'استكشاف الأخطاء وإصلاحها' : 'Troubleshooting' })} />
      <div className="max-w-3xl mb-10">
        <p className="text-sm font-semibold text-primary mb-2">
          {language === 'ar' ? 'ركيزة أساسية' : 'Core pillar'}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {language === 'ar' ? 'استكشاف الأخطاء وإصلاحها' : 'Troubleshooting'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'ar'
            ? 'محتوى موجّه للمشكلة: أعراض، بيئة، أسباب محتملة، تشخيص وحل. لا نحشو صفحات عامة.'
            : 'Problem-oriented content: symptoms, environment, likely causes, diagnosis and resolution — not generic filler.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link href="/categories" className="text-primary hover:underline">{t('categories')}</Link>
          <Link href="/guides" className="text-primary hover:underline">{language === 'ar' ? 'أدلة' : 'Guides'}</Link>
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
              ? 'لم تُصنَّف مقالات استكشاف أعطال بعد من المحتوى الحالي. المحتوى التقني الموجود ما زال متاحاً عبر المقالات.'
              : 'No troubleshooting-classified items detected yet from existing content. Existing technical articles remain available.'}
          </p>
          <Link href="/articles" className="text-primary hover:underline">
            {t('articles')}
          </Link>
        </div>
      )}
    </div>
  );
}
