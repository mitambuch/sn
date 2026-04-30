// ═══════════════════════════════════════════════════
// Threshold — acte 0, the gatekeeper of the experience
//
// WHAT: Black-absolute viewport with a single pulsing dot center.
//       The user must hold-click for ~1500ms to "cross". On crossing,
//       the dot expands as a circular wipe (clip-path) revealing the
//       rest of the timeline. A skip ghost appears bottom-right after
//       4s of inactivity for users uncomfortable with the gesture.
// WHEN: First act. Mounted as the first child of <SceneDirector/>.
// CHANGE HOLD DURATION: HOLD_MS constant.
// CHANGE SKIP DELAY: SKIP_AFTER_MS constant.
// ═══════════════════════════════════════════════════

import { PulseDot } from '@components/effects/PulseDot';
import { ActStage } from '@components/orchestration/ActStage';
import { useScene } from '@components/orchestration/useScene';
import { cn } from '@utils/cn';
import { useEffect, useRef, useState } from 'react';

const HOLD_MS = 1500;
const SKIP_AFTER_MS = 4000;

export const Threshold = () => {
  const { hasCrossedThreshold, crossThreshold } = useScene();
  const [holdProgress, setHoldProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [crossing, setCrossing] = useState(false);
  const holdStart = useRef<number | null>(null);
  const raf = useRef<number>(0);

  // Show the skip cue after 4s of inactivity
  useEffect(() => {
    if (hasCrossedThreshold) return;
    const t = window.setTimeout(() => setShowSkip(true), SKIP_AFTER_MS);
    return () => window.clearTimeout(t);
  }, [hasCrossedThreshold]);

  // Animate clip-path expand once threshold is crossed
  const onCross = () => {
    if (crossing || hasCrossedThreshold) return;
    setCrossing(true);
    window.setTimeout(() => {
      crossThreshold();
      // Smooth scroll to acte 1
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }, 950);
  };

  const beginHold = () => {
    if (crossing || hasCrossedThreshold) return;
    holdStart.current = performance.now();
    const tick = () => {
      if (holdStart.current === null) return;
      const elapsed = performance.now() - holdStart.current;
      const pct = Math.min(elapsed / HOLD_MS, 1);
      setHoldProgress(pct);
      if (pct >= 1) {
        holdStart.current = null;
        onCross();
      } else {
        raf.current = window.requestAnimationFrame(tick);
      }
    };
    raf.current = window.requestAnimationFrame(tick);
  };

  const cancelHold = () => {
    holdStart.current = null;
    window.cancelAnimationFrame(raf.current);
    setHoldProgress(0);
  };

  if (hasCrossedThreshold) return null;

  return (
    <ActStage name="Threshold" tall={1} sticky={false}>
      <div
        className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#000000]"
        style={{
          clipPath: crossing ? 'circle(150% at 50% 50%)' : 'circle(100% at 50% 50%)',
          transition: crossing ? 'clip-path 900ms cubic-bezier(0.76, 0, 0.24, 1)' : undefined,
        }}
      >
        {/* Hold-progress ring around the dot — appears only while holding */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-32 w-32 rounded-full border border-white/30"
          style={{
            opacity: holdProgress > 0 ? 1 : 0,
            transform: `scale(${0.6 + holdProgress * 0.6})`,
            transition: 'opacity 200ms ease',
          }}
        />

        <PulseDot
          size={6}
          haloSize={120}
          className="text-white"
          onPointerDown={beginHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onContextMenu={e => e.preventDefault()}
        />

        {/* Skip cue */}
        <button
          type="button"
          onClick={onCross}
          aria-label="Entrer directement"
          className={cn(
            'absolute right-6 bottom-6 font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase transition-opacity duration-700',
            'hover:text-white/70 focus-visible:text-white/70 focus-visible:outline-none',
            'md:right-12 md:bottom-12',
            showSkip ? 'opacity-100' : 'opacity-0',
          )}
        >
          Entrer →
        </button>
      </div>
    </ActStage>
  );
};
