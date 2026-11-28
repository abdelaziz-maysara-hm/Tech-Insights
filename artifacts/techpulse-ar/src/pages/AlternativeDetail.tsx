import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { useParams, Link } from 'wouter';
import alternativesData from '@/content/alternatives.json';
import { PageBreadcrumbs } from '@/components/PageBreadcrumbs';
import { RelatedLinks } from '@/components/RelatedLinks';
import { breadcrumbTrailFor } from '@/lib/breadcrumbs';
import { getRelatedGraph } from '@/lib/relatedContent';
import { siteCatalogs } from '@/lib/siteCatalogs';

interface AltItem {
  name: string;
  product: string;
  summary: { ar: string; en: string };
  pros: { ar: string[]; en: string[] };
  cons: { ar: string[]; en: string[] };
  comparisonSlug?: string;
}

interface Alternative {
  id: string;
  slug: string;
  product: string;
  title: { ar: string; en: string };
  excerpt: { ar: string; en: string };
  alternatives: AltItem[];
}

const alternatives = alternativesData as Alternative[];

export default function AlternativeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const ar = language === 'ar';

  const alt = alternatives.find((a) => a.slug === slug);

  useSEO({
    title: alt ? alt.title[language] : 'Not Found',
    description: alt ? alt.excerpt[language] : '',
    path: `/alternatives/${slug}`,
  });

  if (!alt) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>{ar ? 'غير موجود' : 'Not found'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh] max-w-4xl">
      <PageBreadcrumbs
        items={breadcrumbTrailFor(`/alternatives/${alt.slug}`, {
          lang: ar ? 'ar' : 'en',
          title: alt.title[language],
        })}
      />

      <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-3">{alt.title[language]}</h1>
      <p className="text-muted-foreground mb-8">{alt.excerpt[language]}</p>

      <div className="space-y-6">
        {alt.alternatives.map((item, i) => (
          <article key={i} className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold">
              {item.name} <span className="text-muted-foreground font-normal">— {item.product}</span>
            </h2>
            <p className="mt-2 text-muted-foreground">{item.summary[language]}</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-green-600 dark:text-green-400">
                  {ar ? 'المميزات' : 'Pros'}
                </h3>
                <ul className="mt-1 list-disc ps-5 text-sm">
                  {item.pros[language].map((p, j) => (
                    <li key={j}>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-600 dark:text-red-400">
                  {ar ? 'العيوب' : 'Cons'}
                </h3>
                <ul className="mt-1 list-disc ps-5 text-sm">
                  {item.cons[language].map((c, j) => (
                    <li key={j}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {item.comparisonSlug && (
              <Link
                href={`/comparison/${item.comparisonSlug}`}
                className="mt-4 inline-block text-sm text-primary hover:underline"
              >
                {ar ? 'شوف المقارنة التفصيلية →' : 'See detailed comparison →'}
              </Link>
            )}
          </article>
        ))}
      </div>

      <RelatedLinks
        groups={getRelatedGraph(alt, siteCatalogs(), 3)}
        language={ar ? 'ar' : 'en'}
      />
    </div>
  );
}
