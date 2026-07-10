import { Link } from 'wouter';
import { Comparison } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ComparisonCard({ comparison, className }: { comparison: Comparison, className?: string }) {
  const { language, t } = useLanguage();
  const isRtl = language === 'ar';
  
  return (
    <Link href={`/comparison/${comparison.slug}`} className={cn("group block bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5", className)}>
      <div className="relative p-6 bg-gradient-to-br from-muted/50 to-background flex justify-between items-center">
        
        {/* Device 1 */}
        <div className="w-2/5 flex flex-col items-center text-center relative z-10">
          {comparison.overallWinner === 1 && (
            <div className="absolute -top-3 -right-3 bg-secondary text-white p-1 rounded-full shadow-lg z-20">
              <Crown className="w-4 h-4" />
            </div>
          )}
          <img 
            src={comparison.device1Image} 
            alt={comparison.device1Name} 
            className="w-24 h-32 object-contain mb-3 drop-shadow-xl group-hover:scale-105 transition-transform"
            loading="lazy"
          />
          <h4 className="font-bold text-sm md:text-base leading-tight">{comparison.device1Name}</h4>
        </div>

        {/* VS Badge */}
        <div className="w-1/5 flex justify-center z-20 relative">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-sm shadow-[0_0_15px_rgba(0,212,255,0.5)]">
            {t('vs')}
          </div>
        </div>

        {/* Device 2 */}
        <div className="w-2/5 flex flex-col items-center text-center relative z-10">
          {comparison.overallWinner === 2 && (
            <div className="absolute -top-3 -left-3 bg-secondary text-white p-1 rounded-full shadow-lg z-20">
              <Crown className="w-4 h-4" />
            </div>
          )}
          <img 
            src={comparison.device2Image} 
            alt={comparison.device2Name} 
            className="w-24 h-32 object-contain mb-3 drop-shadow-xl group-hover:scale-105 transition-transform"
            loading="lazy"
          />
          <h4 className="font-bold text-sm md:text-base leading-tight">{comparison.device2Name}</h4>
        </div>
      </div>
      
      <div className="p-5 border-t border-border">
        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {comparison.title[language]}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {comparison.excerpt[language]}
        </p>
        
        <div className="flex items-center justify-between text-primary font-medium text-sm">
          <span>{t('readMore')}</span>
          {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </div>
    </Link>
  );
}
