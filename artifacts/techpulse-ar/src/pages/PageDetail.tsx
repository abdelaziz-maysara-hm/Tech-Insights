import { useParams } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import pagesJson from '@/content/pages.json';
import { CmsPage } from '@/data/cmsTypes';
import NotFound from '@/pages/not-found';

const cmsPages = pagesJson as unknown as CmsPage[];

export default function PageDetail() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const page = cmsPages.find((p) => p.slug === slug);

  useSEO({ title: page?.title[language] });

  if (!page) return <NotFound />;

  const paragraphs = page.content[language].split('\n').filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gradient inline-block">{page.title[language]}</h1>
      <div className="prose prose-invert max-w-none space-y-4 leading-relaxed text-foreground/90">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
