// ═══════════════════════════════════════════════════
// EquipeSection — 3 founder cards (different layout from Méthode)
//
// WHAT: 3 founder cards in a 3-col grid. Each card = avatar carré
//       (initials placeholder) en haut, then name + role tag + body.
//       Cards are bg-surface rounded-sm — visually distinct from
//       MethodeSection (which is timeline-style numbered, no cards).
// ═══════════════════════════════════════════════════

import { SectionHeader } from '@components/layout/SectionHeader';

const FOUNDERS = [
  {
    initials: 'SM',
    name: 'Salvatore Montemagno',
    role: 'Fondateur',
    body: '20 ans d’expérience dans le luxe, la distribution et la gestion de relations avec une clientèle HNWI et UHNW.',
  },
  {
    initials: 'BG',
    name: 'Bokar Guissé',
    role: 'Co-fondateur',
    body: 'Agent de joueurs de football de premier plan au niveau européen, avec accès à des cercles internationaux exigeants.',
  },
  {
    initials: 'HN',
    name: 'Harry Novillo',
    role: 'Co-fondateur',
    body: 'Ancien sportif professionnel de haut niveau, impliqué dans des projets entrepreneuriaux et environnements premium.',
  },
];

export const EquipeSection = () => (
  <section id="equipe" className="border-border relative w-full border-b py-20 md:py-28">
    <div className="mx-auto w-full max-w-400 px-5 md:px-6">
      <SectionHeader
        index="05"
        label="ÉQUIPE"
        title={
          <>
            Une structure agile,
            <br />
            discrète, crédible.
          </>
        }
      />

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {FOUNDERS.map(f => (
          <li key={f.name} className="bg-surface flex flex-col gap-6 rounded-sm p-6 md:p-8">
            {/* Avatar carré, large */}
            <div className="border-fg/15 bg-bg flex aspect-square w-full items-center justify-center rounded-sm border">
              <span
                aria-hidden="true"
                className="text-fg font-mono font-semibold tracking-widest uppercase tabular-nums"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
              >
                {f.initials}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-fg font-mono text-base leading-tight font-semibold tracking-tight uppercase md:text-lg">
                {f.name}.
              </h3>
              <p className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
                {f.role}
              </p>
            </div>
            <p className="text-muted text-base leading-relaxed">{f.body}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
