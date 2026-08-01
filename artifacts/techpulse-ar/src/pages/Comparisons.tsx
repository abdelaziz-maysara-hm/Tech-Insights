import { mockComparisons } from '@/data/mockData';
import { cmsComparisons } from '@/data/comparisons';
import { useLanguage } from '@/context/LanguageContext';
import { ComparisonCard } from '@/components/ComparisonCard';
import { useSEO } from '@/hooks/useSEO';

export default function Comparisons() {
  const { language, t } = useLanguage();
  const list = cmsComparisons?.length ? cmsComparisons : mockComparisons;

  useSEO({ title: t('comparisons'), path: '/comparisons' });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-6 text-gradient inline-block">{t('comparisons')}</h1>
        <p className="text-lg text-muted-foreground">
          {language === 'ar'
            ? 'مقارنات عملية بجداول تساعدك تختار أسرع.'
            : 'Practical side-by-side comparisons to help you choose faster.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {list.map((comparison) => (
          <ComparisonCard key={comparison.id} comparison={comparison} />
        ))}
      </div>
    </div>
  );
}
