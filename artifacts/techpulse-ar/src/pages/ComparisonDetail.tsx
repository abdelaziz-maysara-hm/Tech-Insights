import { useParams } from 'wouter';
import { mockComparisons } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { Crown } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

export default function ComparisonDetail() {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  
  const comp = mockComparisons.find(c => c.slug === slug);
  
  useSEO(comp ? { title: comp.title[language], description: comp.excerpt[language] } : {});

  if (!comp) {
    return <div className="container py-20 text-center text-2xl">Comparison not found</div>;
  }

  const specKeys = Object.keys(comp.specs) as Array<keyof typeof comp.specs>;

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
            {t('comparisons')}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            {comp.title[language]}
          </h1>
          <p className="text-lg text-muted-foreground">
            {comp.excerpt[language]}
          </p>
        </div>

        {/* Head to Head Visual */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between bg-card rounded-2xl border border-border p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 z-0" />
            
            {/* Device 1 */}
            <div className="w-full md:w-5/12 flex flex-col items-center z-10">
              <div className="relative">
                {comp.overallWinner === 1 && (
                  <div className="absolute -top-6 -left-6 bg-secondary text-white p-3 rounded-full shadow-[0_0_20px_rgba(255,107,53,0.4)] rotate-[-15deg] z-20 flex flex-col items-center">
                    <Crown className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold uppercase">{t('winner')}</span>
                  </div>
                )}
                <img src={comp.device1Image} alt={comp.device1Name} className="h-64 object-contain drop-shadow-2xl" />
              </div>
              <h2 className="text-2xl font-bold mt-6 text-center">{comp.device1Name}</h2>
            </div>

            {/* VS */}
            <div className="w-full md:w-2/12 flex justify-center py-8 z-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-[0_0_30px_rgba(0,212,255,0.4)]">
                {t('vs')}
              </div>
            </div>

            {/* Device 2 */}
            <div className="w-full md:w-5/12 flex flex-col items-center z-10">
              <div className="relative">
                {comp.overallWinner === 2 && (
                  <div className="absolute -top-6 -right-6 bg-secondary text-white p-3 rounded-full shadow-[0_0_20px_rgba(255,107,53,0.4)] rotate-[15deg] z-20 flex flex-col items-center">
                    <Crown className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold uppercase">{t('winner')}</span>
                  </div>
                )}
                <img src={comp.device2Image} alt={comp.device2Name} className="h-64 object-contain drop-shadow-2xl" />
              </div>
              <h2 className="text-2xl font-bold mt-6 text-center">{comp.device2Name}</h2>
            </div>
          </div>
        </div>

        {/* Specs Table */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-3 bg-muted/50 p-4 border-b border-border font-bold text-center">
              <div className="text-lg">{comp.device1Name}</div>
              <div className="text-muted-foreground">المواصفات</div>
              <div className="text-lg">{comp.device2Name}</div>
            </div>
            
            <div className="divide-y divide-border">
              {specKeys.map(key => {
                const spec = comp.specs[key];
                return (
                  <div key={key} className="grid grid-cols-3 p-4 items-center hover:bg-muted/20 transition-colors">
                    {/* Device 1 Value */}
                    <div className={`text-center p-3 rounded-lg ${spec.winner === 1 ? 'bg-primary/10 border border-primary/30 font-medium' : ''}`}>
                      <p className="text-sm md:text-base">{spec.device1Value[language]}</p>
                      <div className="w-full bg-muted h-1.5 mt-3 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${(spec.device1Score / 10) * 100}%` }} />
                      </div>
                    </div>
                    
                    {/* Label */}
                    <div className="text-center font-bold text-muted-foreground px-2">
                      {spec.label[language]}
                    </div>
                    
                    {/* Device 2 Value */}
                    <div className={`text-center p-3 rounded-lg ${spec.winner === 2 ? 'bg-primary/10 border border-primary/30 font-medium' : ''}`}>
                      <p className="text-sm md:text-base">{spec.device2Value[language]}</p>
                      <div className="w-full bg-muted h-1.5 mt-3 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${(spec.device2Score / 10) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Verdict */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary/10 via-background to-secondary/10 p-8 md:p-10 rounded-2xl border border-border text-center">
            <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
              <Crown className="w-6 h-6 text-secondary" />
              {t('verdict')}
            </h3>
            <p className="text-lg md:text-xl leading-relaxed text-foreground">
              {comp.verdict[language]}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
