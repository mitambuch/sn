// ═══════════════════════════════════════════════════
// ActStage — wrapper for a single act in the timeline
//
// WHAT: Marks a viewport-sized region tied to a named act. Tracks
//       its visibility via IntersectionObserver and notifies the
//       SceneDirector when it becomes the centered act.
// WHEN: Wraps the JSX of every act component (Threshold, Apparition,
//       Murmurs, Stillness, Reversal, Doorway).
// CHANGE HEIGHT: each act can override via the `tall` prop (multiples
//       of 100vh) — Stillness uses 4 (one screen per monolithic word
//       + transitions), Apparition uses 3 (room to scroll-resist the
//       wordmark draw), the rest default to 1.
// ═══════════════════════════════════════════════════

import type { ActName } from '@components/orchestration/useScene';
import { useScene } from '@components/orchestration/useScene';
import { cn } from '@utils/cn';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

interface ActStageProps {
  name: ActName;
  children: ReactNode;
  /** Multiplier on 100vh. 1 = single viewport. */
  tall?: number;
  /** Sticky inner content over the tall outer wrapper. Default true. */
  sticky?: boolean;
  className?: string;
}

export const ActStage = ({ name, children, tall = 1, sticky = true, className }: ActStageProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { setCurrentAct } = useScene();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            setCurrentAct(name);
          }
        });
      },
      { threshold: [0.4, 0.6] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [name, setCurrentAct]);

  return (
    <section
      ref={wrapRef}
      data-act={name}
      className={cn('relative w-full', className)}
      style={{ minHeight: `${tall * 100}vh` }}
    >
      {sticky ? (
        <div className="sticky top-0 flex min-h-screen w-full items-center justify-center overflow-hidden">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
};
