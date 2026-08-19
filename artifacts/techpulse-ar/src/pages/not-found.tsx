import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { localizePath } from '@/lib/localizedRouting';

export default function NotFound() {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const homeHref = localizePath('/', language, import.meta.env.BASE_URL);

  useSEO({
    title: isArabic ? '?????? ??? ??????' : 'Page Not Found',
    description: isArabic
      ? '?????? ???? ???? ???? ??? ?????? ?? ?? ?????.'
      : 'The page you are looking for does not exist or has been moved.',
    indexable: false,
  });

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">
        {isArabic ? '?????? ??? ??????' : 'Page Not Found'}
      </h2>
      <p className="text-muted-foreground mb-8">
        {isArabic
          ? '?????? ?????? ???? ???? ???? ??? ?????? ?? ?? ?????.'
          : 'Sorry, the page you are looking for does not exist or has been moved.'}
      </p>
      <a
        href={homeHref}
        className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
      >
        {isArabic ? '?????? ????????' : 'Back to Home'}
      </a>
    </div>
  );
}
