// ═══════════════════════════════════════════════════
// EquipeSection — GAFHA grid + 3 founder cards
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
          <li key={f.name} className="bg-surface flex flex-col gap-5 rounded-md p-6 md:p-8">
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="border-border bg-bg text-fg flex h-12 w-12 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold tracking-widest uppercase"
              >
                {f.initials}
              </span>
              <div className="min-w-0">
                <h3 className="text-fg truncate font-mono text-base leading-tight font-semibold tracking-tight uppercase md:text-lg">
                  {f.name}.
                </h3>
                <p className="text-muted truncate font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
                  {f.role}
                </p>
              </div>
            </div>
            <p className="text-muted text-base leading-relaxed">{f.body}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
