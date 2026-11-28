import { useRoute, Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { getVendor, VENDORS } from '@/data/taxonomy';
import { PageBreadcrumbs } from '@/components/PageBreadcrumbs';
import { RelatedLinks } from '@/components/RelatedLinks';
import { breadcrumbTrailFor } from '@/lib/breadcrumbs';
import { getAdjacentLoop, getRelatedGraph } from '@/lib/relatedContent';
import { siteCatalogs } from '@/lib/siteCatalogs';
import { useAllArticles } from '@/hooks/useAllArticles';
import { filterByVendor } from '@/lib/contentDiscovery';
import { ArticleCard } from '@/components/ArticleCard';

export default function VendorDetail() {
  const [, params] = useRoute('/vendors/:vendor');
  const { language } = useLanguage();
  const vendorId = params?.vendor ?? '';
  const vendor = getVendor(vendorId);
  const { allArticles } = useAllArticles();
  const related = vendor ? filterByVendor(allArticles, vendor.id) : [];

  useSEO({
    title: vendor
      ? (vendor.shortLabel ?? vendor.label)[language]
      : language === 'ar'
        ? 'مورد غير موجود'
        : 'Vendor not found',
    description: vendor?.description?.[language],
    path: vendor ? `/vendors/${vendor.id}` : '/vendors',
  });

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">
          {language === 'ar' ? 'المورد غير موجود' : 'Vendor not found'}
        </h1>
        <p className="text-muted-foreground mb-6">
          {language === 'ar'
            ? 'لا يوجد سجل لهذا المعرّف في سجل الموردين.'
            : 'No registry entry for this vendor id.'}
        </p>
        <Link href="/vendors" className="text-primary hover:underline">
          {language === 'ar' ? 'العودة للموردين' : 'Back to vendors'}
        </Link>
      </div>
    );
  }

  const name = (vendor.shortLabel ?? vendor.label)[language];
  const lang = language === 'ar' ? 'ar' : 'en';
  const vendorRows = VENDORS.map((v) => ({ slug: v.id, title: v.label }));
  const { previous, next } = getAdjacentLoop({ slug: vendor.id, title: vendor.label }, vendorRows);
  const crossRelated = getRelatedGraph(
    { slug: vendor.id, vendorIds: [vendor.id], vendor: vendor.id, title: vendor.label, tags: [vendor.id, vendor.label.en] },
    siteCatalogs(),
    4,
  );
  const crumbs = breadcrumbTrailFor(`/vendors/${vendor.id}`, { lang, title: name });

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <PageBreadcrumbs items={crumbs} />

      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{name}</h1>
        {vendor.description && (
          <p className="text-muted-foreground">{vendor.description[language]}</p>
        )}
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">
          {language === 'ar' ? 'المنتجات' : 'Products'}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {vendor.products.map((p) => (
            <li
              key={p.id}
              className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium"
            >
              {p.label[language]}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">
          {language === 'ar' ? 'محتوى مرتبط' : 'Related content'}
        </h2>
        {related.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-6 text-muted-foreground text-sm">
            {language === 'ar'
              ? 'لا يوجد محتوى مرتبط حالياً من المقالات الموجودة. لن نُنشئ صفحات وهمية.'
              : 'No matching content from existing articles yet. We do not fabricate filler pages.'}
          </div>
        )}
      </section>

      {(previous || next) && (
        <nav
          aria-label={lang === 'ar' ? 'موردون مجاورون' : 'Nearby vendors'}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12"
        >
          {previous ? (
            <Link href={`/vendors/${previous.slug}`} className="block rounded-lg border border-border p-4 hover:border-primary transition-colors">
              <span className="block text-xs text-muted-foreground mb-1">{lang === 'ar' ? 'المورد السابق' : 'Previous vendor'}</span>
              <span className="font-medium">{previous.title[lang]}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link href={`/vendors/${next.slug}`} className="block rounded-lg border border-border p-4 hover:border-primary transition-colors">
              <span className="block text-xs text-muted-foreground mb-1">{lang === 'ar' ? 'المورد التالي' : 'Next vendor'}</span>
              <span className="font-medium">{next.title[lang]}</span>
            </Link>
          )}
        </nav>
      )}

      <RelatedLinks groups={crossRelated} language={lang} />
    </div>
  );
}
