import { useState } from 'react';
import { Play } from 'lucide-react';
import { YOUTUBE_ID_RE, youtubeNoCookieEmbed, youtubeThumb } from '@/lib/videoLibrary';

interface LiteYouTubeProps {
  id: string;
  title: string;
  playLabel: string;
  className?: string;
}

/**
 * Lightweight YouTube facade (lite-youtube pattern): renders only a thumbnail
 * and a button until the visitor clicks, then loads the privacy-enhanced
 * youtube-nocookie.com player. Saves ~1 MB of third-party JS per embed and
 * sets no YouTube cookies before interaction.
 */
export function LiteYouTube({ id, title, playLabel, className = '' }: LiteYouTubeProps) {
  const [active, setActive] = useState(false);
  if (!YOUTUBE_ID_RE.test(id)) return null;

  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-xl bg-black ${className}`}>
      {active ? (
        <iframe
          src={youtubeNoCookieEmbed(id, true)}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label={`${playLabel}: ${title}`}
        >
          <img
            src={youtubeThumb(id)}
            alt={title}
            loading="lazy"
            decoding="async"
            width={480}
            height={360}
            className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover:scale-110">
              <Play className="h-8 w-8 fill-current" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
