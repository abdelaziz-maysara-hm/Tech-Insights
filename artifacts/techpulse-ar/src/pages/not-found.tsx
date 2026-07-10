import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { language } = useLanguage();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">
        {language === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
      </h2>
      <p className="text-muted-foreground mb-8">
        {language === 'ar' 
          ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.' 
          : 'Sorry, the page you are looking for does not exist or has been moved.'}
      </p>
      <a href="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
        {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
      </a>
    </div>
  );
}
