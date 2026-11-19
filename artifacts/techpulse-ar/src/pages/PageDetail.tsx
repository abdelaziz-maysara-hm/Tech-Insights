import { useParams } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import pagesJson from '@/content/pages.json';
import { CmsPage } from '@/data/cmsTypes';
import NotFound from '@/pages/not-found';
import { markdownToHtml } from '@/lib/markdown';

const cmsPages = pagesJson as unknown as CmsPage[];

export default function PageDetail() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const page = cmsPages.find((p) => p.slug === slug);

  useSEO({
    title: page?.title[language],
    description: page?.description?.[language],
    translationStatus: page?.translationStatus,
  });

  if (!page) return <NotFound />;

  // The page title is rendered as <h1>; drop a duplicated leading "## Title".
  const html = markdownToHtml((page.content[language] || '').replace(/^##\s+.+\n+/, ''));

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gradient inline-block">{page.title[language]}</h1>
      <div
        className="prose prose-invert max-w-none leading-relaxed text-foreground/90 prose-a:text-primary"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
