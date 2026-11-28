import { useLanguage } from '@/context/LanguageContext';
import { Category } from '@/data/mockData';
import { ACTIVE_CATEGORIES } from '@/lib/activeCategories';
import { Link } from 'wouter';
import { useSEO } from '@/hooks/useSEO';
import { useAllArticles } from '@/hooks/useAllArticles';
import { DOMAINS_BY_ID, getTopicsForDomain } from '@/data/taxonomy';
import { PageBreadcrumbs } from '@/components/PageBreadcrumbs';
import { breadcrumbTrailFor } from '@/lib/breadcrumbs';
import { inferTopicIds, indexableTopicIds } from '@/lib/topicContent';
import { siteCatalogs } from '@/lib/siteCatalogs';

const DOMAIN_IDS = ['cybersecurity', 'networking', 'infrastructure'] as const;

export default function Categories() {
  const { language, t } = useLanguage();
  const lang = language === 'ar' ? 'ar' : 'en';
  const { allArticles } = useAllArticles();
  const catalogs = siteCatalogs();
  const published = new Set(indexableTopicIds({
    articles: allArticles,
    comparisons: catalogs.comparisons,
    playlists: catalogs.playlists,
    alternatives: catalogs.alternatives,
  }));

  const categories: Category[] = ACTIVE_CATEGORIES;
  const crumbs = breadcrumbTrailFor('/categories', { lang, title: t('categories') });

  useSEO({ title: t('categories') });

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <PageBreadcrumbs items={crumbs} />
      <h1 className="text-4xl font-bold mb-10 text-center">{t('categories')}</h1>

      <section className="max-w-5xl mx-auto mb-12">
        <h2 className="text-xl font-bold mb-4">{lang === 'ar' ? 'أقسام المعرفة' : 'Knowledge domains'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DOMAIN_IDS.map((id) => {
            const domain = DOMAINS_BY_ID[id];
            return (
              <Link
                key={id}
                href={`/domain/${id}`}
                className="block rounded-xl border border-border bg-card p-5 hover:border-primary transition-colors"
              >
                <h3 className="font-bold text-lg mb-1">{domain.label[lang]}</h3>
                <p className="text-sm text-muted-foreground">{domain.description?.[lang]}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="max-w-5xl mx-auto mb-12">
        <h2 className="text-xl font-bold mb-4">{lang === 'ar' ? 'محاور الموضوعات' : 'Topic hubs'}</h2>
        {DOMAIN_IDS.map((id) => {
          const domain = DOMAINS_BY_ID[id];
          const topics = getTopicsForDomain(id).filter((topic) => published.has(topic.id));
          if (!topics.length) return null;
          return (
            <div key={id} className="mb-6">
              <h3 className="font-semibold mb-2">
                <Link href={`/domain/${id}`} className="hover:text-primary">
                  {domain.label[lang]}
                </Link>
              </h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {topics.map((topic) => (
                  <li key={topic.id}>
                    <Link href={`/topic/${topic.id}`} className="text-primary hover:underline">
                      {topic.label[lang]}
                    </Link>
                    <span className="text-muted-foreground">
                      {' '}
                      ({allArticles.filter((a) => inferTopicIds(a).includes(topic.id)).length})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section className="max-w-5xl mx-auto mb-12">
        <h2 className="text-xl font-bold mb-4 text-center">{lang === 'ar' ? 'تصنيفات المقالات' : 'Article categories'}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => {
            const count = allArticles.filter((a) => a.categoryId === cat).length;
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
                  {count} {lang === 'ar' ? 'مقالات' : 'Articles'}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <nav className="max-w-5xl mx-auto flex flex-wrap gap-x-5 gap-y-2 text-sm justify-center">
        <Link href="/articles" className="text-primary hover:underline">{t('articles')}</Link>
        <Link href="/guides" className="text-primary hover:underline">{lang === 'ar' ? 'أدلة' : 'Guides'}</Link>
        <Link href="/troubleshooting" className="text-primary hover:underline">{lang === 'ar' ? 'استكشاف الأعطال' : 'Troubleshooting'}</Link>
        <Link href="/comparisons" className="text-primary hover:underline">{t('comparisons')}</Link>
        <Link href="/vendors" className="text-primary hover:underline">{lang === 'ar' ? 'الموردون' : 'Vendors'}</Link>
        <Link href="/alternatives" className="text-primary hover:underline">{lang === 'ar' ? 'بدائل' : 'Alternatives'}</Link>
        <Link href="/videos" className="text-primary hover:underline">{lang === 'ar' ? 'مكتبة الفيديو' : 'Video library'}</Link>
      </nav>
    </div>
  );
}
