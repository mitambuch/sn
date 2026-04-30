// ═══════════════════════════════════════════════════
// GlitchType — typewriter reveal with a brief glyph offset
//
// WHAT: Splits its text into characters, reveals them one at a time
//       (delay = `pace` ms per char), each char animated with a 420ms
//       glitch-in keyframe (translate + blur, GPU-only). Optional
//       `play` prop gates the animation — defaults to on-mount.
// WHEN: Stillness amorce, Murmurs phrase reveal at hover, Doorway
//       text-morph fallback. Anywhere a "machine" feels right.
// CHANGE PACE: prop `pace` (ms per char, default 38).
// CHANGE EASE: edit @keyframes glitch-in in animations.css.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { useEffect, useState } from 'react';

interface GlitchTypeProps {
  text: string;
  /** ms between successive char reveals. */
  pace?: number;
  className?: string;
}

/** Mounts → starts revealing. To reset, change the React `key`. */
export const GlitchType = ({ text, pace = 38, className }: GlitchTypeProps) => {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let i = 0;
    const step = () => {
      if (cancelled) return;
      i += 1;
      setRevealed(prev => (prev < i ? i : prev));
      if (i < text.length) window.setTimeout(step, pace);
    };
    const startId = window.setTimeout(step, pace);
    return () => {
      cancelled = true;
      window.clearTimeout(startId);
    };
  }, [text, pace]);

  return (
    <span aria-label={text} className={cn('inline-block', className)}>
      {text.split('').map((char, idx) => (
        <span
          key={`${idx}-${char}`}
          aria-hidden="true"
          className={cn('inline-block', idx < revealed ? 'animate-glitch-in' : 'opacity-0')}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  );
};
