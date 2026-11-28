import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { Link } from 'wouter';
import alternativesData from '@/content/alternatives.json';
import { PageBreadcrumbs } from '@/components/PageBreadcrumbs';
import { breadcrumbTrailFor } from '@/lib/breadcrumbs';

interface Alternative {
  id: string;
  slug: string;
  product: string;
  title: { ar: string; en: string };
  excerpt: { ar: string; en: string };
}

const alternatives = alternativesData as Alternative[];

export default function Alternatives() {
  const { language } = useLanguage();
  const ar = language === 'ar';

  useSEO({
    title: ar ? 'بدائل المنتجات' : 'Product Alternatives',
    description: ar
      ? 'أفضل البدائل لمنتجات الأمن والشبكات الشائعة.'
      : 'Best alternatives to popular security and networking products.',
    path: '/alternatives',
  });

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <PageBreadcrumbs items={breadcrumbTrailFor('/alternatives', { lang: ar ? 'ar' : 'en', title: ar ? 'بدائل المنتجات' : 'Product Alternatives' })} />
      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {ar ? 'بدائل المنتجات' : 'Product Alternatives'}
        </h1>
        <p className="text-muted-foreground">
          {ar
            ? 'خيارات عملية لمن يبحث عن بديل لمنتج حالي.'
            : 'Practical options for those looking for an alternative to a current product.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alternatives.map((alt) => (
          <Link
            key={alt.id}
            href={`/alternatives/${alt.slug}`}
            className="block rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary"
          >
            <h2 className="text-lg font-bold">{alt.title[language]}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{alt.excerpt[language]}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
