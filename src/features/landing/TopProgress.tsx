// ═══════════════════════════════════════════════════
// TopProgress — fixed scroll progress bar
//
// WHAT: A 2px bar pinned to the top of the viewport whose width tracks
//       scroll progress (0 → 100% as the user moves from top to bottom).
// WHEN: Mounted once at the landing root. One bar per page.
// CHANGE COLOR: bg-fg token (matches the brand foreground).
// CHANGE HEIGHT: h-[2px] below.
// ═══════════════════════════════════════════════════

import { useEffect, useRef } from 'react';

/** Top scroll-progress bar (fixed, 2px, fg-colored). */
export const TopProgress = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      el.style.width = `${String(progress)}%`;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="bg-fg fixed top-0 left-0 z-[200] h-[2px] w-0 transition-[width] duration-100 ease-linear"
    />
  );
};
