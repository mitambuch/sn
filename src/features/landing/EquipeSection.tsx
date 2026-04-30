// ═══════════════════════════════════════════════════
// EquipeSection — the 3 founders with qualifications visible upfront
//
// WHAT: Three founders presented as full-width rows : large name in
//       Geist Light, role tag aligned right, body paragraph below.
//       Asymmetric indent on the 2nd founder for visual rhythm. No
//       cards, no photos — pure typographic hierarchy.
// WHEN: Fifth section of pages/Home.tsx, anchored at #equipe.
// EDIT FOUNDERS: FOUNDERS array.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { cn } from '@utils/cn';

const FOUNDERS = [
  {
    name: 'Salvatore Montemagno',
    role: 'Fondateur',
    body: '20 ans d’expérience dans le luxe, la distribution et la gestion de relations avec une clientèle HNWI et UHNW.',
  },
  {
    name: 'Bokar Guissé',
    role: 'Co-fondateur',
    body: 'Agent de joueurs de football de premier plan au niveau européen, avec accès à des cercles internationaux exigeants.',
  },
  {
    name: 'Harry Novillo',
    role: 'Co-fondateur',
    body: 'Ancien sportif professionnel de haut niveau, impliqué dans des projets entrepreneuriaux et environnements premium.',
  },
];

export const EquipeSection = () => (
  <section id="equipe" className="border-fg/10 relative w-full border-t py-32 md:py-48">
    <Container size="2k">
      <header className="mb-16 grid gap-6 md:mb-24 md:grid-cols-12 md:gap-16">
        <p className="text-fg/55 col-span-12 font-mono text-[10px] font-semibold tracking-[0.5em] uppercase md:col-span-3 md:pt-3">
          <span className="text-fg/30">05 / </span>ÉQUIPE
        </p>
        <h2
          className="text-fg col-span-12 max-w-3xl font-light tracking-tight md:col-span-9"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)', lineHeight: '1.05' }}
        >
          Une structure agile, discrète, crédible.
        </h2>
      </header>

      <ul className="flex flex-col gap-20 md:gap-28">
        {FOUNDERS.map((f, i) => (
          <li key={f.name} className={cn('flex flex-col gap-6', i % 2 === 1 && 'md:ml-[18%]')}>
            <div className="border-fg/15 flex flex-wrap items-baseline justify-between gap-4 border-t pt-6">
              <h3
                className="text-fg font-light tracking-tight"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 3.25rem)', lineHeight: '1.05' }}
              >
                {f.name}.
              </h3>
              <span className="text-fg/55 font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
                {f.role}
              </span>
            </div>
            <p className="text-fg/70 max-w-2xl text-lg leading-relaxed md:text-xl">{f.body}</p>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);
