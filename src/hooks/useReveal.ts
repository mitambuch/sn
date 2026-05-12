// ═══════════════════════════════════════════════════
// useReveal — IntersectionObserver-based scroll reveal
//
// WHAT: Attaches a ref that toggles `data-reveal="hidden|shown"` on the
//       element when it enters the viewport. Combined with the CSS rules
//       in src/index.css (transition + transform), this drives the
//       "section appears on scroll" feel à la fromanother.love.
// WHEN: Use via the <Reveal /> wrapper component for ergonomic stagger;
//       fall back to direct hook usage for one-off cases.
// CHANGE DISTANCE / EASING / DURATION: tweak --reveal-y-md, --ease-luxe,
//       --duration-slow in :root / @theme of src/index.css.
// RULE: respects prefers-reduced-motion (instantly shown, no animation).
// ═══════════════════════════════════════════════════

import { useEffect, useRef } from 'react';

interface UseRevealOptions {
  /** Stagger delay in ms (typically computed `stagger * index`). */
  delay?: number;
  /** Threshold for IntersectionObserver (0-1). Default 0.1. */
  threshold?: number;
  /** Root margin string. Default "0px 0px -10% 0px" — fires slightly before reaching the bottom. */
  rootMargin?: string;
  /** If false, the element re-hides when scrolled out. Default true (one-shot reveal). */
  once?: boolean;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(options: UseRevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion — show immediately, no animation.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.setAttribute('data-reveal', 'shown');
      return;
    }

    el.setAttribute('data-reveal', 'hidden');
    if (typeof options.delay === 'number' && options.delay > 0) {
      el.style.setProperty('--reveal-delay', `${String(options.delay)}ms`);
    }

    const once = options.once ?? true;
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-reveal', 'shown');
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.setAttribute('data-reveal', 'hidden');
          }
        }
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? '0px 0px -10% 0px',
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.delay, options.threshold, options.rootMargin, options.once]);

  return ref;
}
