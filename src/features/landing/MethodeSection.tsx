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
    <section
      id="methode"
      className="border-border relative isolate w-full scroll-mt-24 overflow-hidden border-b py-24 md:scroll-mt-28 md:py-32"
    >
      <div className="relative mx-auto w-full max-w-400 px-5 md:px-6">
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
          trailing={
            <p className="text-muted max-w-xs font-mono text-[10px] leading-relaxed font-semibold tracking-[0.3em] uppercase">
              Une ligne claire
              <br />
              du signal à l’exécution
            </p>
          }
        />

        <ol ref={ref} className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {STEPS.map((s, i) => {
            const stepDelay = i * STEP_STAGGER_MS;
            return (
              <li
                key={s.id}
                className="border-fg/15 bg-fg/[0.025] relative min-h-72 overflow-hidden rounded-sm border p-5 md:p-6"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? 'translateY(0)' : 'translateY(18px)',
                  transition: 'opacity 700ms ease, transform 700ms ease',
                  transitionDelay: `${stepDelay}ms`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="bg-fg/35 absolute top-0 right-0 left-0 h-px origin-left"
                  style={{
                    transform: revealed ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 900ms ease',
                    transitionDelay: `${stepDelay + 160}ms`,
                  }}
                />

                <div className="flex h-full flex-col justify-between gap-10">
                  <div className="flex items-start justify-between gap-6">
                    <span className="text-fg font-mono text-base font-semibold tracking-[0.4em] uppercase tabular-nums">
                      {s.id}
                    </span>
                    <span className="text-fg/15 font-mono text-6xl leading-none font-semibold tracking-tight tabular-nums">
                      {s.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-fg font-mono text-lg leading-tight font-semibold tracking-tight uppercase md:text-xl">
                      {s.verb}
                    </h3>
                    <p className="text-muted mt-4 text-base leading-relaxed">{s.body}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div
          className="mt-12 grid grid-cols-1 gap-6 transition-all duration-700 ease-out md:mt-14 md:grid-cols-[1fr_auto] md:items-end"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(14px)',
            transitionDelay: `${STEPS.length * STEP_STAGGER_MS + 220}ms`,
          }}
        >
          <p className="text-muted max-w-xl font-mono text-[11px] leading-relaxed tracking-[0.2em] uppercase">
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
