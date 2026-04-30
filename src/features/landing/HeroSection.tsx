import { useEffect, useState } from 'react';

const EYEBROW = 'CONCIERGERIE PRIVÉE — SUISSE';

const PILLARS = [
  { label: 'SUISSE', qualif: 'Cadre confidentiel' },
  { label: 'INDÉPENDANT', qualif: 'Sans commission cachée' },
  { label: 'BESPOKE', qualif: 'Sur mesure intégral' },
];

const PHRASES = [
  'Une demande, même imprécise.',
  'Un cadre, pas un catalogue.',
  'Un seul interlocuteur, du début à la fin.',
  'Une exécution sans intermédiaire.',
  'Conciergerie privée — depuis la Suisse.',
];

const TYPE_SPEED_MS = 80;
const ERASE_SPEED_MS = 35;
const HOLD_MS = 3500;
const SETTLE_MS = 380;

type Phase = 'typing' | 'holding' | 'erasing' | 'settle';

const useTypewriter = (phrases: string[]) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<Phase>('typing');

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const fallback = phrases[0] ?? '';
      if (text !== fallback) {
        const t = window.setTimeout(() => setText(fallback), 0);
        return () => window.clearTimeout(t);
      }
      return;
    }

    const current = phrases[index] ?? '';
    let timer: number;

    if (phase === 'typing') {
      timer =
        text.length < current.length
          ? window.setTimeout(() => setText(current.slice(0, text.length + 1)), TYPE_SPEED_MS)
          : window.setTimeout(() => setPhase('holding'), 0);
    } else if (phase === 'holding') {
      timer = window.setTimeout(() => setPhase('erasing'), HOLD_MS);
    } else if (phase === 'erasing') {
      timer =
        text.length > 0
          ? window.setTimeout(() => setText(text.slice(0, -1)), ERASE_SPEED_MS)
          : window.setTimeout(() => setPhase('settle'), 0);
    } else {
      timer = window.setTimeout(() => {
        setIndex(i => (i + 1) % phrases.length);
        setPhase('typing');
      }, SETTLE_MS);
    }

    return () => window.clearTimeout(timer);
  }, [text, phase, index, phrases]);

  return text;
};

export const HeroSection = () => {
  const typed = useTypewriter(PHRASES);

  return (
    <section
      id="hero"
      className="border-border relative isolate flex min-h-svh w-full scroll-mt-24 overflow-hidden border-b md:scroll-mt-28"
    >
      <div className="mx-auto flex w-full max-w-400 flex-col px-5 pt-28 pb-6 md:px-6 md:pt-32">
        <div className="flex min-h-[calc(100svh-8.5rem)] flex-col">
          <div className="flex items-center gap-4">
            <span className="text-fg font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
              {EYEBROW}
            </span>
            <span className="bg-fg/30 hidden h-px flex-1 md:block" aria-hidden="true" />
          </div>

          <div className="flex flex-1 flex-col justify-center py-12 md:py-16">
            <h1
              aria-hidden="true"
              className="text-fg max-w-5xl font-mono font-semibold tracking-tight uppercase"
              style={{ fontSize: 'clamp(2.25rem, 7vw, 6.75rem)', lineHeight: '1.04' }}
            >
              <span>{typed}</span>
              <span
                aria-hidden="true"
                className="bg-fg ml-2 inline-block w-0.5 animate-[cursor-blink_1.05s_step-end_infinite] align-baseline"
                style={{ height: '0.82em', transform: 'translateY(0.1em)' }}
              />
            </h1>
            <span className="sr-only">SAW Next — conciergerie privée. {PHRASES.join(' ')}</span>
          </div>

          <div className="border-fg/15 grid grid-cols-1 gap-6 border-t pt-6 md:grid-cols-3 md:gap-12 md:pt-7">
            {PILLARS.map((p, i) => (
              <div key={p.label} className="flex items-baseline gap-4">
                <span className="text-fg font-mono text-[10px] font-semibold tracking-[0.4em] uppercase tabular-nums">
                  0{i + 1}
                </span>
                <div className="flex flex-col gap-1.5">
                  <span className="text-fg font-mono text-sm font-semibold tracking-[0.32em] uppercase md:text-base">
                    {p.label}
                  </span>
                  <span className="text-fg font-mono text-[10px] tracking-[0.18em] uppercase">
                    {p.qualif}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-5 bottom-32 hidden flex-col items-end gap-3 md:right-8 md:bottom-36 md:flex"
      >
        <span className="text-fg font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
          Découvrir
        </span>
        <span className="bg-fg block h-14 w-px animate-[scroll-hint_2.4s_ease-in-out_infinite]" />
      </div>
    </section>
  );
};
