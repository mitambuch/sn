import { useEffect, useState } from 'react';

const EYEBROW = 'CONCIERGERIE PRIVÉE — SUISSE';
const PILLARS = ['SUISSE', 'INDÉPENDANT', 'BESPOKE'];
const PHRASES = [
  'Une demande, même imprécise.',
  'Un cadre, pas un catalogue.',
  'Un seul interlocuteur, du début à la fin.',
  'Une exécution sans intermédiaire.',
  'Conciergerie privée — depuis la Suisse.',
];

const TYPE_SPEED_MS = 55;
const ERASE_SPEED_MS = 22;
const HOLD_MS = 1800;
const SETTLE_MS = 280;

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
                className="bg-fg ml-2 inline-block w-[0.45ch] animate-[cursor-blink_1.05s_step-end_infinite] align-baseline"
                style={{ height: '0.82em', transform: 'translateY(0.1em)' }}
              />
            </h1>
            <span className="sr-only">SAW Next — conciergerie privée. {PHRASES.join(' ')}</span>
          </div>

          <div className="border-fg/20 grid grid-cols-1 gap-3 border-t pt-5 md:grid-cols-3 md:gap-8 md:pt-6">
            {PILLARS.map((p, i) => (
              <span
                key={p}
                className="text-fg flex items-baseline gap-4 font-mono text-xs font-semibold tracking-[0.45em] uppercase md:text-sm"
              >
                <span className="text-fg tabular-nums">0{i + 1}</span>
                <span>{p}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
