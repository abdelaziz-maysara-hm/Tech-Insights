import { useParams } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { Clock, Calendar, Tag, Share2, Facebook, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ArticleCard } from '@/components/ArticleCard';
import { useSEO } from '@/hooks/useSEO';
import { useAllArticles } from '@/hooks/useAllArticles';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const { allArticles } = useAllArticles();
  const [activeHeading, setActiveHeading] = useState('');
  
  const article = allArticles.find(a => a.slug === slug);
  
  useSEO(article ? { title: article.title[language], description: article.excerpt[language] } : {});
  
  if (!article) {
    return <div className="container py-20 text-center text-2xl">Article not found</div>;
  }

  const relatedArticles = allArticles
    .filter(a => a.id !== article.id && (a.categoryId === article.categoryId || a.tags.some(t => article.tags.includes(t))))
    .slice(0, 3);

  // Parse markdown-like body to HTML and extract headings
  const bodyText = article.body[language];
  const paragraphs = bodyText.split('\n\n');
  const headings: { id: string, text: string }[] = [];
  
  const renderedBody = paragraphs.map((para, index) => {
    if (para.startsWith('## ')) {
      const text = para.replace('## ', '');
      const id = `heading-${index}`;
      headings.push({ id, text });
      return <h2 key={index} id={id} className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-foreground">{text}</h2>;
    }
    return <p key={index} className="mb-6 text-lg text-muted-foreground leading-relaxed">{para}</p>;
  });

  // Highlight TOC based on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings, language]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img src={article.heroImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 z-20 container mx-auto px-4 flex flex-col justify-end pb-12">
          <div className="max-w-4xl">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
              {t(article.categoryId)}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {article.title[language]}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-gray-300">
              <div className="flex items-center gap-2">
                <img src={article.author.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-white/20" />
                <span className="font-medium text-white">{article.author.name[language]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} {t('readTime')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar TOC */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4 pb-4 border-b border-border">{t('tableOfContents')}</h3>
              <ul className="space-y-3">
                {headings.map(h => (
                  <li key={h.id}>
                    <button 
                      onClick={() => scrollToHeading(h.id)}
                      className={`text-sm text-left ${language === 'ar' ? 'text-right' : ''} transition-colors ${
                        activeHeading === h.id 
                          ? 'text-primary font-bold' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {h.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 max-w-3xl">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              
              {article.youtubeVideoId && (
                <div className="mb-10 rounded-2xl overflow-hidden shadow-lg aspect-video">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${article.youtubeVideoId}`} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full"
                    loading="lazy"
                  ></iframe>
                </div>
              )}

              {renderedBody}

              {/* Tags & Share */}
              <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground mr-1" />
                  {article.tags.map(tag => (
                    <span key={tag} className="bg-muted text-muted-foreground text-xs font-medium px-3 py-1.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground mr-2">{language === 'ar' ? 'شارك المقال:' : 'Share:'}</span>
                  <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-[#4267B2] hover:text-white transition-colors">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-muted/30 border-t border-border py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">{t('relatedArticles')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map(a => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
