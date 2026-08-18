import { useRoute, Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { getVendor } from '@/data/taxonomy';
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

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <nav className="text-sm text-muted-foreground mb-6 flex flex-wrap gap-2 items-center">
        <Link href="/" className="hover:text-primary">
          {language === 'ar' ? 'الرئيسية' : 'Home'}
        </Link>
        <span>/</span>
        <Link href="/vendors" className="hover:text-primary">
          {language === 'ar' ? 'الموردون' : 'Vendors'}
        </Link>
        <span>/</span>
        <span className="text-foreground">{name}</span>
      </nav>

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
    </div>
  );
}
