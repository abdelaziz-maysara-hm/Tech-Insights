import { useParams } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { Clock, Calendar, Tag, Share2, Facebook, Twitter, Link2, Check } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ArticleCard } from '@/components/ArticleCard';
import { useSEO } from '@/hooks/useSEO';
import { useAllArticles } from '@/hooks/useAllArticles';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const { allArticles } = useAllArticles();
  const [activeHeading, setActiveHeading] = useState('');
  const [copied, setCopied] = useState(false);

  const article = allArticles.find((a) => a.slug === slug);

  useSEO(
    article
      ? {
          title: article.title[language],
          description: article.excerpt[language],
          image: article.heroImage,
          path: `/article/${article.slug}`,
          type: 'article',
          datePublished: article.date,
          authorName: article.author?.name?.[language] || article.author?.name?.ar,
        }
      : {},
  );

  // Weighted related articles (category > subcategory > tags).
  // Scores are relative; higher is better. Only positive-score items are shown.
  const relatedArticles = useMemo(() => {
    if (!article) return [];

    const sourceTags = new Set((article.tags ?? []).map((t) => t.toLowerCase()));
    const scored = allArticles
      .filter((a) => a.id !== article.id)
      .map((a) => {
        let score = 0;
        if (a.categoryId === article.categoryId) score += 40;
        if (
          article.subcategoryId &&
          a.subcategoryId &&
          a.subcategoryId === article.subcategoryId
        ) {
          score += 15;
        }
        const overlap = (a.tags ?? []).filter((t) =>
          sourceTags.has(t.toLowerCase()),
        ).length;
        if (sourceTags.size > 0 && overlap > 0) {
          // Up to 30 points based on tag overlap ratio
          score += Math.min(30, Math.round((overlap / sourceTags.size) * 30));
        }
        return { article: a, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.article);

    return scored;
  }, [article, allArticles]);

  const bodyText = article ? article.body[language] : '';
  const paragraphs = bodyText ? bodyText.split('\n\n') : [];

  const headings = useMemo(() => {
    const list: { id: string; text: string }[] = [];
    paragraphs.forEach((para, index) => {
      if (para.startsWith('## ')) {
        list.push({ id: `heading-${index}`, text: para.replace('## ', '') });
      }
    });
    return list;
  }, [bodyText]);

  const renderedBody = paragraphs.map((para, index) => {
    if (para.startsWith('## ')) {
      const text = para.replace('## ', '');
      const id = `heading-${index}`;
      return (
        <h2 key={index} id={id} className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-foreground">
          {text}
        </h2>
      );
    }
    if (!para.trim()) return null;
    return (
      <p key={index} className="mb-6 text-lg text-muted-foreground leading-relaxed">
        {para}
      </p>
    );
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHeading(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -80% 0px' },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const shareUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `https://technical-insights.com/article/${slug}`;
  const shareTitle = article?.title[language] || '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n${shareUrl}`)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  if (!article) {
    return (
      <div className="container py-20 text-center text-2xl">
        {language === 'ar' ? 'المقال غير موجود' : 'Article not found'}
      </div>
    );
  }

  return (
    <>
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img src={article.heroImage} alt={article.title[language]} className="w-full h-full object-cover" />
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
                <img
                  src={article.author.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-white/20"
                />
                <span className="font-medium text-white">{article.author.name[language]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {article.readTime} {t('readTime')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="hidden lg:block lg:col-span-3">
            {headings.length > 0 && (
              <div className="sticky top-24 bg-card rounded-xl border border-border p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4 pb-4 border-b border-border">
                  {t('tableOfContents')}
                </h3>
                <ul className="space-y-3">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <button
                        onClick={() => scrollToHeading(h.id)}
                        className={`text-sm w-full ${language === 'ar' ? 'text-right' : 'text-left'} transition-colors ${
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
            )}
          </div>

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
                  />
                </div>
              )}

              {renderedBody}

              <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 not-prose">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {(article.tags ?? []).map((tag) => (
                    <span
                      key={tag}
                      className="bg-muted text-muted-foreground text-xs font-medium px-3 py-1.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground me-1">
                    {language === 'ar' ? 'شارك:' : 'Share:'}
                  </span>
                  <button
                    type="button"
                    onClick={shareWhatsApp}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors"
                    title="WhatsApp"
                    aria-label="WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={shareTwitter}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-colors"
                    title="X / Twitter"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={shareFacebook}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-[#4267B2] hover:text-white transition-colors"
                    title="Facebook"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={copyLink}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    title={language === 'ar' ? 'نسخ الرابط' : 'Copy link'}
                    aria-label="Copy link"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedArticles.length > 0 && (
        <div className="bg-muted/30 border-t border-border py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">{t('relatedArticles')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
