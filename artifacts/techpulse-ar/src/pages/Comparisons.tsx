import { mockComparisons } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { ComparisonCard } from '@/components/ComparisonCard';
import { useSEO } from '@/hooks/useSEO';

export default function Comparisons() {
  const { language, t } = useLanguage();

  useSEO({ title: t('comparisons') });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-6 text-gradient inline-block">{t('comparisons')}</h1>
        <p className="text-lg text-muted-foreground">
          {language === 'ar' 
            ? 'مقارنات تفصيلية وجهاً لوجه بين أحدث الأجهزة التقنية لنساعدك على اتخاذ قرار الشراء الصحيح.' 
            : 'Detailed head-to-head comparisons between the latest tech devices to help you make the right purchasing decision.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {mockComparisons.map(comparison => (
          <ComparisonCard key={comparison.id} comparison={comparison} />
        ))}
      </div>
    </div>
  );
}
