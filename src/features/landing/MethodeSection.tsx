// ═══════════════════════════════════════════════════
// MethodeSection — the 4-step operational method
//
// WHAT: 4 numbered steps presented as a horizontal flow on desktop
//       (one cell per step, hairlines between them) and a vertical
//       stack on mobile. Each step = id, verb, body. A short legal
//       precision under ("facilitateur, jamais intermédiaire financier").
// WHEN: Fourth section of pages/Home.tsx, anchored at #methode.
// EDIT STEPS: STEPS array.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';

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

export const MethodeSection = () => (
  <section id="methode" className="border-fg/10 relative w-full border-t py-32 md:py-48">
    <Container size="2k">
      <header className="mb-16 grid gap-6 md:mb-24 md:grid-cols-12 md:gap-16">
        <p className="text-fg/55 col-span-12 font-mono text-[10px] font-semibold tracking-[0.5em] uppercase md:col-span-3 md:pt-3">
          <span className="text-fg/30">04 / </span>MÉTHODE
        </p>
        <h2
          className="text-fg col-span-12 max-w-3xl font-mono font-semibold tracking-tight uppercase md:col-span-9"
          style={{ fontSize: 'clamp(1.75rem, 3.6vw, 3rem)', lineHeight: '1.1' }}
        >
          Un fonctionnement simple,
          <br />
          répété sans concession.
        </h2>
      </header>

      <ol className="grid gap-12 md:grid-cols-4 md:gap-10">
        {STEPS.map((s, i) => (
          <li key={s.id} className="flex flex-col gap-4">
            <div className="border-fg/30 flex items-center gap-3 border-t pt-4">
              <span className="text-fg/65 font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
                {s.id}
              </span>
              {i < STEPS.length - 1 && (
                <span aria-hidden="true" className="bg-fg/15 hidden h-px flex-1 md:block" />
              )}
            </div>
            <h3
              className="text-fg font-mono font-semibold tracking-tight uppercase"
              style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.4rem)', lineHeight: '1.15' }}
            >
              {s.verb}
            </h3>
            <p className="text-fg/70 text-base leading-relaxed md:text-lg">{s.body}</p>
          </li>
        ))}
      </ol>

      <p className="text-fg/45 mt-16 max-w-md font-mono text-[11px] leading-relaxed tracking-wider uppercase">
        SAW Next agit comme facilitateur. Jamais comme intermédiaire financier.
      </p>
    </Container>
  </section>
);
