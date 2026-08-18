import { Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { VENDORS } from '@/data/taxonomy';
import { useAllArticles } from '@/hooks/useAllArticles';
import { filterByVendor } from '@/lib/contentDiscovery';

export default function Vendors() {
  const { language } = useLanguage();
  const { allArticles } = useAllArticles();

  useSEO({
    title: language === 'ar' ? 'الشركات والمنتجات' : 'Vendors',
    description:
      language === 'ar'
        ? 'مراكز معرفة للموردين والمنتجات الاحترافية'
        : 'Knowledge hubs for professional vendors and products',
    path: '/vendors',
  });

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {language === 'ar' ? 'الشركات والمنتجات' : 'Vendors'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'ar'
            ? 'صفحات موردين تعتمد على البيانات — بدون محتوى وهمي. يظهر المحتوى الموجود عند تطابقه.'
            : 'Data-driven vendor hubs — no fabricated content. Existing matching articles surface automatically.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VENDORS.map((v) => {
          const count = filterByVendor(allArticles, v.id).length;
          return (
            <Link
              key={v.id}
              href={`/vendors/${v.id}`}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors block"
            >
              <h2 className="font-bold text-lg mb-1">{(v.shortLabel ?? v.label)[language]}</h2>
              {v.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {v.description[language]}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {v.products.length}{' '}
                  {language === 'ar' ? 'منتجات' : 'products'}
                </span>
                <span>
                  {count > 0
                    ? language === 'ar'
                      ? `${count} مقالات مرتبطة`
                      : `${count} related articles`
                    : language === 'ar'
                      ? 'لا محتوى مرتبط بعد'
                      : 'No linked content yet'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
