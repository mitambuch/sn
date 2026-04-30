// ═══════════════════════════════════════════════════
// MethodeSection — compact 4-col horizontal flow + scroll-driven reveal
//
// WHAT: 4 steps inline horizontally on desktop, each one appears in
//       sequence as the section scrolls into view : the index fades
//       in first, the connector line draws left→right (scaleX 0→1),
//       the verb + body slide up. Stagger 220ms between steps. Once
//       triggered, sticks (no re-trigger on scroll back).
//       IntersectionObserver-based, no external lib.
// WHEN: Section 04 of pages/Home.tsx, anchored at #methode.
// ═══════════════════════════════════════════════════

import { SectionHeader } from '@components/layout/SectionHeader';
import { WipeButton } from '@components/ui/WipeButton';
import { useEffect, useRef, useState } from 'react';

const STEPS = [
  { id: '01', verb: 'Une demande.', body: 'Vous formulez une intention, même imprécise.' },
  {
    id: '02',
    verb: 'Une structuration.',
    body: 'Nous transformons la demande en cadre opérationnel.',
  },
  {
    id: '03',
    verb: 'Une proposition.',
    body: 'Une réponse construite, sans intermédiaire financier.',
  },
  { id: '04', verb: 'Une exécution.', body: 'Discrétion absolue. Réseau international mobilisé.' },
];

const STEP_STAGGER_MS = 220;

export const MethodeSection = () => {
  const ref = useRef<HTMLOListElement>(null);
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [revealed, setRevealed] = useState(reducedMotion);

  useEffect(() => {
    if (revealed) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [revealed]);

  return (
    <section id="methode" className="border-border relative w-full border-b py-20 md:py-28">
      <div className="mx-auto w-full max-w-400 px-5 md:px-6">
        <SectionHeader
          index="04"
          label="MÉTHODE"
          title={
            <>
              Un fonctionnement simple,
              <br />
              répété sans concession.
            </>
          }
        />

        <ol ref={ref} className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          {STEPS.map((s, i) => {
            const stepDelay = i * STEP_STAGGER_MS;
            return (
              <li key={s.id} className="relative flex flex-col gap-4">
                {/* Index row : number + connector line drawing in */}
                <div className="flex items-center gap-3">
                  <span
                    className="text-fg font-mono text-base font-semibold tracking-[0.4em] uppercase tabular-nums transition-opacity duration-500 ease-out"
                    style={{
                      opacity: revealed ? 1 : 0,
                      transitionDelay: `${stepDelay}ms`,
                    }}
                  >
                    {s.id}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="bg-fg/40 hidden h-px flex-1 origin-left transition-transform duration-700 ease-out md:block"
                      style={{
                        transform: revealed ? 'scaleX(1)' : 'scaleX(0)',
                        transitionDelay: `${stepDelay + 120}ms`,
                      }}
                    />
                  )}
                </div>

                {/* Verb + body : translate up + fade */}
                <div
                  className="flex flex-col gap-3 transition-all duration-700 ease-out"
                  style={{
                    opacity: revealed ? 1 : 0,
                    transform: revealed ? 'translateY(0)' : 'translateY(14px)',
                    transitionDelay: `${stepDelay + 220}ms`,
                  }}
                >
                  <h3 className="text-fg font-mono text-base leading-tight font-semibold tracking-tight uppercase md:text-lg">
                    {s.verb}
                  </h3>
                  <p className="text-muted text-base leading-relaxed">{s.body}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Mention legale + CTA — appears after the last step has revealed */}
        <div
          className="mt-16 flex flex-col items-start justify-between gap-8 transition-all duration-700 ease-out md:mt-20 md:flex-row md:items-end"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(14px)',
            transitionDelay: `${STEPS.length * STEP_STAGGER_MS + 220}ms`,
          }}
        >
          <p className="text-muted max-w-md font-mono text-[11px] leading-relaxed tracking-[0.2em] uppercase">
            SAW Next agit comme facilitateur. Jamais comme intermédiaire financier.
          </p>
          <WipeButton href="#contact" variant="solid">
            Démarrer une demande
          </WipeButton>
        </div>
      </div>
    </section>
  );
};
