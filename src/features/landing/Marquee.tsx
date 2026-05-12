// ═══════════════════════════════════════════════════
// Marquee — horizontal scrolling ticker band
//
// WHAT: Renders a horizontal infinite-scroll band of items separated by ✦.
//       Two visual variants : "dark" (ink bg, light text — default) and
//       "light" (page bg, ink text). Pauses speed on hover (50s → 80s).
// WHEN: Between landing sections as a typographic separator carrying
//       ticker-like metadata (season, status, location, etc.).
// CHANGE SPEED: durationSec prop (default 50s).
// CHANGE SEPARATOR: starGlyph prop (default "✦").
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { useMemo } from 'react';

interface MarqueeProps {
  /** Items to scroll. Will be duplicated 2× for seamless looping. */
  items: readonly string[];
  /** "dark" = bg-fg + text-bg ; "light" = bg-bg + text-fg. */
  tone?: 'dark' | 'light';
  /** Scroll duration in seconds (one full cycle). Default 50. */
  durationSec?: number;
  /** Separator glyph between items. Default ✦. */
  starGlyph?: string;
  className?: string;
}

/** Infinite horizontal ticker band — landing section separator. */
export const Marquee = ({
  items,
  tone = 'dark',
  durationSec = 50,
  starGlyph = '✦',
  className,
}: MarqueeProps) => {
  const stream = useMemo(() => [...items, ...items], [items]);

  return (
    <div
      className={cn(
        'group relative overflow-hidden border-y py-3.5',
        tone === 'dark' ? 'bg-fg text-bg border-fg/10' : 'bg-bg text-fg border-border',
        className,
      )}
    >
      <div
        className="flex font-mono text-[11px] tracking-[0.18em] whitespace-nowrap uppercase group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee ${String(durationSec)}s linear infinite`,
        }}
      >
        {stream.map((item, i) => (
          <span key={`${item}-${String(i)}`} className="inline-flex items-center gap-3.5 px-8">
            {item}
            <span aria-hidden="true" className={tone === 'dark' ? 'text-bg/40' : 'text-fg/30'}>
              {starGlyph}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};
