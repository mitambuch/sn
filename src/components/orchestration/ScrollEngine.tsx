// ═══════════════════════════════════════════════════
// ScrollEngine — Lenis-driven smooth scroll provider
//
// WHAT: Initialises Lenis on mount and feeds the ScrollEngineContext
//       (scrollY, progress, freeze, resume). The hook + context live
//       in `useScrollEngine.ts` so this file exports only the
//       provider component.
// WHEN: Mounts once at the SceneDirector root.
// CHANGE FEEL: edit Lenis options below (duration / wheelMultiplier).
// ═══════════════════════════════════════════════════

import Lenis from 'lenis';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { ScrollEngineState } from './useScrollEngine';
import { ScrollEngineContext } from './useScrollEngine';

interface ScrollEngineProps {
  children: ReactNode;
}

export const ScrollEngine = ({ children }: ScrollEngineProps) => {
  const lenisRef = useRef<Lenis | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: t => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });
    lenisRef.current = lenis;

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    const onScroll = (e: { scroll: number; progress: number }) => {
      setScrollY(e.scroll);
      setProgress(e.progress);
    };
    lenis.on('scroll', onScroll);

    return () => {
      lenis.off('scroll', onScroll);
      lenis.destroy();
      window.cancelAnimationFrame(raf);
      lenisRef.current = null;
    };
  }, []);

  const value = useMemo<ScrollEngineState>(() => {
    const freeze = (ms: number) => {
      const lenis = lenisRef.current;
      if (!lenis) return;
      lenis.stop();
      window.setTimeout(() => lenis.start(), ms);
    };
    const resume = () => lenisRef.current?.start();

    return { scrollY, progress, freeze, resume };
  }, [scrollY, progress]);

  return <ScrollEngineContext.Provider value={value}>{children}</ScrollEngineContext.Provider>;
};
