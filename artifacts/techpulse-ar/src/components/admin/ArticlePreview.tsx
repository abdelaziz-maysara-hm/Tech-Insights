import { X } from 'lucide-react';

interface Props {
  language: 'ar' | 'en';
  open: boolean;
  onClose: () => void;
  title: string;
  excerpt: string;
  body: string;
  heroImage?: string;
  category?: string;
  youtubeId?: string;
}

export function ArticlePreview({
  language,
  open,
  onClose,
  title,
  excerpt,
  body,
  heroImage,
  category,
  youtubeId,
}: Props) {
  if (!open) return null;

  const paragraphs = body.split('\n\n').filter(Boolean);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-10">
      <div className="relative w-full max-w-3xl bg-background border border-border rounded-2xl shadow-2xl mb-10">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 border-b border-border bg-card/95 backdrop-blur rounded-t-2xl">
          <h2 className="font-bold text-lg">
            {language === 'ar' ? 'معاينة المقال' : 'Article preview'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {heroImage && (
            <img src={heroImage} alt="" className="w-full aspect-video object-cover rounded-xl" />
          )}
          {category && (
            <span className="inline-block text-xs font-bold uppercase tracking-wide text-primary">
              {category}
            </span>
          )}
          <h1 className="text-3xl font-bold leading-tight">{title || (language === 'ar' ? '(بدون عنوان)' : '(No title)')}</h1>
          {excerpt && <p className="text-lg text-muted-foreground">{excerpt}</p>}

          {youtubeId && (
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                title="preview"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {paragraphs.map((para, i) =>
              para.startsWith('## ') ? (
                <h2 key={i} className="text-2xl font-bold mt-8 mb-3">
                  {para.replace('## ', '')}
                </h2>
              ) : (
                <p key={i} className="mb-4 text-muted-foreground leading-relaxed">
                  {para}
                </p>
              ),
            )}
            {!paragraphs.length && (
              <p className="text-muted-foreground italic">
                {language === 'ar' ? 'لا يوجد محتوى بعد' : 'No body content yet'}
              </p>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-md bg-primary text-primary-foreground font-medium"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
