import { useEffect, useState } from 'react';
import { mockComparisons } from '@/data/mockData';
import { cmsComparisons } from '@/data/comparisons';
import { useLanguage } from '@/context/LanguageContext';
import { ComparisonCard } from '@/components/ComparisonCard';
import { useSEO } from '@/hooks/useSEO';
import { getSubcategories } from '@/data/subcategories';

export default function Comparisons() {
  const { language, t } = useLanguage();
  const list = (cmsComparisons?.length ? cmsComparisons : mockComparisons) as Array<
    (typeof mockComparisons)[number] & { subcategoryId?: string }
  >;
  const [activeSubTab, setActiveSubTab] = useState('all');
  const subcategories = getSubcategories('comparisons');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('s');
    if (s && (s === 'all' || subcategories.some((x) => x.id === s))) {
      setActiveSubTab(s);
    }
  }, []);

  const filtered = list.filter((item) => {
    if (activeSubTab === 'all') return true;
    return (item as any).subcategoryId === activeSubTab;
  });

  useSEO({ title: t('comparisons'), path: '/comparisons' });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-4xl font-bold mb-4 text-gradient inline-block">{t('comparisons')}</h1>
        <p className="text-lg text-muted-foreground">
          {language === 'ar'
            ? 'مقارنات عملية بجداول — مقسّمة حسب نوع المنتج لتختار أسرع.'
            : 'Practical table comparisons — grouped by product type so you choose faster.'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <button
          type="button"
          onClick={() => setActiveSubTab('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            activeSubTab === 'all'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border hover:border-primary/50'
          }`}
        >
          {language === 'ar' ? 'الكل' : 'All'}
        </button>
        {subcategories.map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => setActiveSubTab(sub.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              activeSubTab === sub.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            {language === 'ar' ? sub.ar : sub.en}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">
          {language === 'ar' ? 'لا توجد مقارنات في هذا القسم بعد.' : 'No comparisons in this section yet.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {filtered.map((comparison) => (
            <ComparisonCard key={comparison.id} comparison={comparison} />
          ))}
        </div>
      )}
    </div>
  );
}
