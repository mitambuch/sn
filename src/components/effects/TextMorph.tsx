// ═══════════════════════════════════════════════════
// TextMorph — character-by-character morph between two strings
//
// WHAT: Renders one of two strings, transitioning per character with
//       a staggered glitch-in. Used by Doorway: "Continuer la
//       conversation." morphs into the phone number on hover.
// WHEN: Acte 5 (Doorway) — primary CTA. Other surfaces should not use
//       it unless the morph is content-meaningful (don't morph for fun).
// CHANGE STAGGER: prop `pace` (ms per char, default 28).
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { useEffect, useState } from 'react';

interface TextMorphProps {
  /** Resting text. */
  from: string;
  /** Hover/focus target text. */
  to: string;
  /** True → animate to `to`. False → animate back to `from`. */
  active: boolean;
  pace?: number;
  className?: string;
}

export const TextMorph = ({ from, to, active, pace = 28, className }: TextMorphProps) => {
  const target = active ? to : from;
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    let cancelled = false;
    const len = Math.max(target.length, display.length);
    let i = 0;
    const step = () => {
      if (cancelled) return;
      i += 1;
      const next = target.slice(0, i).padEnd(target.length, ' ');
      setDisplay(next);
      if (i < len) window.setTimeout(step, pace);
    };
    step();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, pace]);

  return (
    <span aria-label={target} className={cn('inline-block', className)}>
      {display.split('').map((char, idx) => (
        <span
          key={idx}
          aria-hidden="true"
          className="animate-glitch-in inline-block"
          style={{ animationDelay: `${idx * 8}ms` }}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  );
};
