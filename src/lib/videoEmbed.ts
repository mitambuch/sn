// ═══════════════════════════════════════════════════
// videoEmbed — normalise a Vimeo / YouTube share URL into an embed URL
//
// WHAT: takes whatever URL an editor pasted (youtu.be, youtube.com/watch,
//       shorts, vimeo.com/ID…) and returns the iframe `src` to use, plus
//       the detected provider. YouTube uses the privacy-friendly
//       `youtube-nocookie` host. Returns provider `null` when the URL
//       isn't a recognised video link, so the caller can skip rendering.
// WHEN: VideoPlayer (article media gallery) and anywhere a pasted video
//       URL must become a player.
// ═══════════════════════════════════════════════════

export type VideoProvider = 'youtube' | 'vimeo';

export interface ParsedVideo {
  provider: VideoProvider | null;
  /** iframe src, or null when the URL isn't recognised. */
  embedUrl: string | null;
}

const YOUTUBE_ID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{6,})/i;
const VIMEO_ID = /vimeo\.com\/(?:video\/)?(\d+)/i;

/** Normalise a Vimeo / YouTube URL to an iframe-ready embed URL. */
export function toEmbedUrl(url: string): ParsedVideo {
  const trimmed = url.trim();

  const yt = YOUTUBE_ID.exec(trimmed);
  if (yt) {
    return {
      provider: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${yt[1]}`,
    };
  }

  const vi = VIMEO_ID.exec(trimmed);
  if (vi) {
    return { provider: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vi[1]}` };
  }

  return { provider: null, embedUrl: null };
}
