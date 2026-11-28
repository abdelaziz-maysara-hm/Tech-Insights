import { useRoute, Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { DOMAINS_BY_ID, getTopicsForDomain, type DomainId } from '@/data/taxonomy';
import { useAllArticles } from '@/hooks/useAllArticles';
import { filterByDomain } from '@/lib/contentDiscovery';
import { ArticleCard } from '@/components/ArticleCard';
import { PageBreadcrumbs } from '@/components/PageBreadcrumbs';
import { breadcrumbTrailFor } from '@/lib/breadcrumbs';
import { indexableTopicIds } from '@/lib/topicContent';
import { siteCatalogs } from '@/lib/siteCatalogs';

const VALID: DomainId[] = ['cybersecurity', 'networking', 'infrastructure'];

export default function DomainPage() {
  const [, params] = useRoute('/domain/:domain');
  const { language, t } = useLanguage();
  const domainId = params?.domain as DomainId | undefined;
  const domain = domainId && VALID.includes(domainId) ? DOMAINS_BY_ID[domainId] : undefined;
  const topics = domain ? getTopicsForDomain(domain.id) : [];
  const { allArticles } = useAllArticles();
  const items = domain ? filterByDomain(allArticles, domain.id) : [];
  const catalogs = siteCatalogs();
  const publishedTopics = new Set(indexableTopicIds({
    articles: allArticles,
    comparisons: catalogs.comparisons,
    playlists: catalogs.playlists,
    alternatives: catalogs.alternatives,
  }));
  const lang = language === 'ar' ? 'ar' : 'en';
  const crumbs = domain
    ? breadcrumbTrailFor(`/domain/${domain.id}`, { lang, title: domain.label[lang] })
    : [];

  useSEO({
    title: domain ? domain.label[language] : language === 'ar' ? 'قسم غير موجود' : 'Domain not found',
    description: domain?.description?.[language],
    path: domain ? domain.route : '/',
  });

  if (!domain) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">
          {language === 'ar' ? 'القسم غير موجود' : 'Domain not found'}
        </h1>
        <Link href="/" className="text-primary hover:underline">
          {t('home')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <PageBreadcrumbs items={crumbs} />
      <div className="max-w-3xl mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{domain.label[language]}</h1>
        {domain.description && (
          <p className="text-muted-foreground">{domain.description[language]}</p>
        )}
      </div>

      {topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {topics.map((topic) =>
            publishedTopics.has(topic.id) ? (
              <Link
                key={topic.id}
                href={`/topic/${topic.id}`}
                className="px-3 py-1 rounded-full border border-border bg-muted/40 text-sm hover:border-primary hover:text-primary"
              >
                {topic.label[language]}
              </Link>
            ) : (
              <span
                key={topic.id}
                className="px-3 py-1 rounded-full border border-border bg-muted/40 text-sm text-muted-foreground"
              >
                {topic.label[language]}
              </span>
            ),
          )}
        </div>
      )}

      <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm mb-10">
        <Link href="/categories" className="text-primary hover:underline">{t('categories')}</Link>
        {VALID.filter((id) => id !== domain.id).map((id) => (
          <Link key={id} href={`/domain/${id}`} className="text-primary hover:underline">
            {DOMAINS_BY_ID[id].label[language]}
          </Link>
        ))}
        <Link href="/articles" className="text-primary hover:underline">{t('articles')}</Link>
        <Link href="/guides" className="text-primary hover:underline">{language === 'ar' ? 'أدلة' : 'Guides'}</Link>
        <Link href="/troubleshooting" className="text-primary hover:underline">{language === 'ar' ? 'استكشاف الأعطال' : 'Troubleshooting'}</Link>
        <Link href="/vendors" className="text-primary hover:underline">{language === 'ar' ? 'الموردون' : 'Vendors'}</Link>
      </nav>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-muted-foreground text-center">
          <p className="mb-4">
            {language === 'ar'
              ? 'لا محتوى مرتبط بعد من المقالات الحالية.'
              : 'No matching content from existing articles yet.'}
          </p>
          <Link href="/articles" className="text-primary hover:underline">
            {t('articles')}
          </Link>
        </div>
      )}
    </div>
  );
}
