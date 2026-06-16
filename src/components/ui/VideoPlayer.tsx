// ═══════════════════════════════════════════════════
// VideoPlayer — plays a self-hosted file or a Vimeo/YouTube embed
//
// WHAT: renders a single video in a 16:9 frame. Two modes:
//       - kind="video": a file uploaded to Sanity → native <video controls>.
//       - kind="embed": a Vimeo/YouTube link → privacy-friendly iframe.
//       Never autoplays (respects the user and prefers-reduced-motion by
//       default). Shows an optional caption underneath.
// WHEN: inside a media gallery (article media). One <VideoPlayer/> per clip.
// CHANGE RATIO: edit the `aspect-video` class on the frame below.
// ═══════════════════════════════════════════════════

import { toEmbedUrl } from '@lib/videoEmbed';
import { cn } from '@utils/cn';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface VideoPlayerProps {
  kind: 'video' | 'embed';
  /** File URL when kind="video". */
  src?: string;
  /** Share URL (Vimeo/YouTube) when kind="embed". */
  url?: string;
  /** Still image shown before play (kind="video"). */
  poster?: string;
  /** Accessible description. */
  alt?: string;
  /** Optional caption shown below the player. */
  caption?: string;
  className?: string;
}

/** Single video player — self-hosted file or Vimeo/YouTube embed. */
export const VideoPlayer = ({
  kind,
  src,
  url,
  poster,
  alt,
  caption,
  className,
}: VideoPlayerProps) => {
  const { t } = useTranslation();
  const label = caption || alt || t('articles.videoLabel');

  const frame = 'bg-surface aspect-video w-full overflow-hidden rounded-lg';

  let player: ReactNode = null;

  if (kind === 'video' && src) {
    player = (
      <video controls preload="metadata" poster={poster} aria-label={label} className={frame}>
        <source src={src} />
        <track kind="captions" />
      </video>
    );
  } else if (kind === 'embed' && url) {
    const { embedUrl } = toEmbedUrl(url);
    player = embedUrl ? (
      <iframe
        src={embedUrl}
        title={label}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={cn(frame, 'border-0')}
      />
    ) : (
      // Unrecognised URL — degrade to a plain link rather than a broken frame.
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-muted hover:text-fg text-sm underline underline-offset-4"
      >
        {label}
      </a>
    );
  }

  if (!player) return null;

  return (
    <figure className={cn('space-y-2', className)}>
      {player}
      {caption && <figcaption className="text-muted text-sm leading-relaxed">{caption}</figcaption>}
    </figure>
  );
};
