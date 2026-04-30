// ═══════════════════════════════════════════════════
// CinematicManifesto — three-act scroll-pinned manifesto
//
// WHAT: A 3-act tall section (~300vh on desktop). The inner panel is
//       sticky at top:0 and the three lines fade-cross-fade in sync
//       with scroll progress. On mobile + reduced-motion the layout
//       collapses to a vertical stack with no pinning.
// WHEN: Penultimate section. Acts as the brand's emotional close
//       before the contact card.
// HOW IT WORKS: GSAP ScrollTrigger pinned timeline. Cleanup via
//       gsap.context() — survives HMR without orphan triggers.
// CHANGE COPY: ACTS array below.
// CHANGE TIMING: scrub + tweens in the gsap timeline.
// ═══════════════════════════════════════════════════

import { useMediaQuery } from '@hooks/useMediaQuery';
import { useEffect, useRef } from 'react';

const ACTS = [
  { tag: 'I', body: "Le luxe n'est pas un produit." },
  { tag: 'II', body: "Le luxe n'est pas un statut." },
  { tag: 'III', body: 'Le luxe est une attention.' },
];

interface CinematicManifestoProps {
  id?: string;
}

export const CinematicManifesto = ({ id = 'manifeste' }: CinematicManifestoProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const actsRef = useRef<HTMLDivElement[]>([]);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!isDesktop || reduced) return;

    let mounted = true;

    const setup = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (!mounted) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const acts = actsRef.current.filter((el): el is HTMLDivElement => Boolean(el));
        if (acts.length < 2) return;

        acts.forEach((el, i) => {
          gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 24 });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top top',
            end: '+=2400',
            pin: panelRef.current,
            scrub: 1.2,
          },
        });

        for (let i = 0; i < acts.length - 1; i++) {
          const out = acts[i];
          const next = acts[i + 1];
          if (!out || !next) continue;
          tl.to(out, { opacity: 0, y: -24, duration: 1 }).to(
            next,
            { opacity: 1, y: 0, duration: 1 },
            '<',
          );
        }
      }, wrapRef);

      return () => ctx.revert();
    };

    let cleanup: (() => void) | undefined;
    void setup().then(fn => {
      cleanup = fn;
    });

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, [isDesktop, reduced]);

  // Mobile / reduced-motion fallback — vertical stack, no pin
  if (!isDesktop || reduced) {
    return (
      <section id={id} className="relative w-full px-6 py-24 md:px-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-16 text-center">
          {ACTS.map(act => (
            <div key={act.tag} className="flex flex-col items-center gap-4">
              <span className="text-fg/40 font-mono text-xs tracking-[0.4em] uppercase">
                {act.tag}
              </span>
              <p className="text-fg font-mono text-2xl leading-tight tracking-tight uppercase">
                {act.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={wrapRef} id={id} className="relative w-full">
      <div
        ref={panelRef}
        className="flex h-screen w-full items-center justify-center overflow-hidden px-12"
      >
        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <span className="text-fg/40 mb-8 font-mono text-[10px] tracking-[0.5em] uppercase">
            04 · Manifeste
          </span>

          <div className="relative flex h-40 w-full items-center justify-center">
            {ACTS.map((act, i) => (
              <div
                key={act.tag}
                ref={el => {
                  if (el) actsRef.current[i] = el;
                }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6"
              >
                <span className="text-fg/30 font-mono text-xs tracking-[0.5em] uppercase">
                  Acte {act.tag}
                </span>
                <p className="text-fg font-mono text-4xl leading-tight tracking-tight uppercase md:text-5xl lg:text-6xl">
                  {act.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
