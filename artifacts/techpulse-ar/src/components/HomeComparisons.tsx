import type { Comparison } from '@/data/mockData';
import homeComparisonsJson from '@/content/home-comparisons.json';
import { useLanguage } from '@/context/LanguageContext';
import { ComparisonCard } from '@/components/ComparisonCard';
import { Link } from 'wouter';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const latestComparisons = homeComparisonsJson as unknown as Comparison[];

/** Below-the-fold home comparisons. Isolated so Home can paint the LCP card
 *  without waiting to download the 200KB+ comparisons catalog. The JSON
 *  here is only the three cards on the home island. */
export default function HomeComparisons() {
  const { language, t } = useLanguage();
  const isRtl = language === 'ar';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="w-2 h-8 bg-secondary rounded-full inline-block"></span>
          <h2 className="text-2xl font-bold">{t('comparisons')}</h2>
        </div>
        <Link href="/comparisons" className="text-primary font-medium hover:underline flex items-center gap-1">
          {language === 'ar' ? 'المزيد من المقارنات' : 'More comparisons'}
          {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </Link>
      </div>
      <div className="flex flex-col gap-6">
        {latestComparisons.map((c) => (
          <ComparisonCard key={c.id} comparison={c} />
        ))}
      </div>
    </div>
  );
}
