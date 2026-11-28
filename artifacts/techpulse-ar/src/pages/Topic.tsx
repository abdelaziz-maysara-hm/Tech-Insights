import { useRoute, Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { TOPICS_BY_ID, DOMAINS_BY_ID } from '@/data/taxonomy';
import { useAllArticles } from '@/hooks/useAllArticles';
import { ArticleCard } from '@/components/ArticleCard';
import { PageBreadcrumbs } from '@/components/PageBreadcrumbs';
import { breadcrumbTrailFor } from '@/lib/breadcrumbs';
import { inferTopicIds, indexableTopicIds } from '@/lib/topicContent';
import { getRelatedGraph } from '@/lib/relatedContent';
import { RelatedLinks } from '@/components/RelatedLinks';
import { siteCatalogs } from '@/lib/siteCatalogs';
import NotFound from '@/pages/not-found';

export default function TopicPage() {
  const [, params] = useRoute('/topic/:topic');
  const { language, t } = useLanguage();
  const lang = language === 'ar' ? 'ar' : 'en';
  const topicId = params?.topic ?? '';
  const topic = TOPICS_BY_ID[topicId];
  const { allArticles } = useAllArticles();
  const catalogs = siteCatalogs();
  const published = topic ? indexableTopicIds({
    articles: allArticles,
    comparisons: catalogs.comparisons,
    playlists: catalogs.playlists,
    alternatives: catalogs.alternatives,
  }).includes(topic.id) : false;

  useSEO({
    title: topic ? topic.label[lang] : lang === 'ar' ? 'موضوع غير موجود' : 'Topic not found',
    description: topic
      ? lang === 'ar'
        ? `مقالات وفيديوهات ومقارنات في محور ${topic.label.ar}`
        : `Articles, videos and comparisons in the ${topic.label.en} topic`
      : undefined,
    path: topic ? `/topic/${topic.id}` : '/',
    indexable: Boolean(topic && published),
  });

  if (!topic || !published) return <NotFound />;

  const domain = DOMAINS_BY_ID[topic.domainId];
  const articles = allArticles.filter((a) => inferTopicIds(a).includes(topic.id));
  const comparisons = (catalogs.comparisons ?? []).filter((c) => inferTopicIds(c).includes(topic.id));
  const playlists = (catalogs.playlists ?? []).filter((p) => inferTopicIds(p).includes(topic.id));
  const videos = (catalogs.videos ?? []).filter((v) => inferTopicIds(v).includes(topic.id) || playlists.some((p) => p.slug === v.playlist));
  const alternatives = (catalogs.alternatives ?? []).filter((a) => inferTopicIds(a).includes(topic.id));
  const siblingTopics = indexableTopicIds({
    articles: allArticles,
    comparisons: catalogs.comparisons,
    playlists: catalogs.playlists,
    alternatives: catalogs.alternatives,
  })
    .map((id) => TOPICS_BY_ID[id])
    .filter((t) => t && t.domainId === topic.domainId && t.id !== topic.id);

  const related = getRelatedGraph({ slug: topic.id, topicIds: [topic.id], title: topic.label }, catalogs, 4);
  const crumbs = breadcrumbTrailFor(`/topic/${topic.id}`, { lang, title: topic.label[lang], topicId: topic.id });

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <PageBreadcrumbs items={crumbs} />
      <div className="max-w-3xl mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{topic.label[lang]}</h1>
        <p className="text-muted-foreground">
          {lang === 'ar'
            ? `كل المحتوى المرتبط بهذا المحور على الموقع.${domain ? ` ينتمي إلى قسم ${domain.label.ar}.` : ''}`
            : `Everything on the site that belongs to this topic.${domain ? ` It sits under the ${domain.label.en} domain.` : ''}`}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 text-sm mb-10">
        <Link href="/categories" className="text-primary hover:underline">
          {t('categories')}
        </Link>
        {domain && (
          <Link href={`/domain/${domain.id}`} className="text-primary hover:underline">
            {domain.label[lang]}
          </Link>
        )}
        <Link href="/articles" className="text-primary hover:underline">
          {t('articles')}
        </Link>
        <Link href="/guides" className="text-primary hover:underline">
          {lang === 'ar' ? 'أدلة' : 'Guides'}
        </Link>
        <Link href="/troubleshooting" className="text-primary hover:underline">
          {lang === 'ar' ? 'استكشاف الأعطال' : 'Troubleshooting'}
        </Link>
        <Link href="/vendors" className="text-primary hover:underline">
          {lang === 'ar' ? 'الموردون' : 'Vendors'}
        </Link>
      </div>

      {articles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">{lang === 'ar' ? 'مقالات' : 'Articles'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}

      {playlists.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">{lang === 'ar' ? 'قوائم التشغيل' : 'Playlists'}</h2>
          <ul className="space-y-2">
            {playlists.map((p) => (
              <li key={p.slug}>
                <Link href={`/videos/${p.slug}`} className="text-primary hover:underline">
                  {p.title?.[lang] || p.slug}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {videos.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">{lang === 'ar' ? 'فيديوهات' : 'Videos'}</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {videos.map((v) => (
              <li key={v.slug}>
                <Link href={`/video/${v.slug}`} className="text-primary hover:underline">
                  {v.title?.[lang] || v.slug}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {comparisons.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">{lang === 'ar' ? 'مقارنات' : 'Comparisons'}</h2>
          <ul className="space-y-2">
            {comparisons.map((c) => (
              <li key={c.slug}>
                <Link href={`/comparison/${c.slug}`} className="text-primary hover:underline">
                  {c.title?.[lang] || c.slug}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {alternatives.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">{lang === 'ar' ? 'بدائل' : 'Alternatives'}</h2>
          <ul className="space-y-2">
            {alternatives.map((a) => (
              <li key={a.slug}>
                <Link href={`/alternatives/${a.slug}`} className="text-primary hover:underline">
                  {a.title?.[lang] || a.slug}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {siblingTopics.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">{lang === 'ar' ? 'محاور أخرى في نفس القسم' : 'Other topics in this domain'}</h2>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {siblingTopics.map((t) => (
              <li key={t.id}>
                <Link href={`/topic/${t.id}`} className="text-primary hover:underline">
                  {t.label[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <RelatedLinks groups={related} language={lang} exclude={['topics']} />
    </div>
  );
}
