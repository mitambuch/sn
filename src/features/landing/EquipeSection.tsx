// ═══════════════════════════════════════════════════
// EquipeSection — 2-column asymetric : édito intro left, discreet
// list right. NO big avatars. The team is the relationship, not a
// gallery of faces.
// ═══════════════════════════════════════════════════

import { SectionHeader } from '@components/layout/SectionHeader';

const FOUNDERS = [
  {
    initials: 'SM',
    name: 'Salvatore Montemagno',
    role: 'Fondateur',
    qualif: '20 ans dans le luxe HNWI / UHNW.',
  },
  {
    initials: 'BG',
    name: 'Bokar Guissé',
    role: 'Co-fondateur',
    qualif: 'Agent de joueurs européens, cercles internationaux.',
  },
  {
    initials: 'HN',
    name: 'Harry Novillo',
    role: 'Co-fondateur',
    qualif: 'Ex-sportif pro, projets entrepreneuriaux premium.',
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

      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        {/* Left — édito intro */}
        <div className="md:col-span-5">
          <p className="text-fg/85 text-lg leading-relaxed font-light md:text-xl">
            Trois profils complémentaires, issus de l’industrie du luxe, du sport professionnel et
            de la relation client haut de gamme.
          </p>
          <p className="text-muted mt-6 max-w-md text-base leading-relaxed">
            Le premier interlocuteur reste le même tout au long du dossier. Les autres interviennent
            à la demande, selon la nature de l’intention.
          </p>
        </div>

        {/* Right — discreet list, no big avatars */}
        <ul className="border-fg/15 md:col-span-7 md:border-l md:pl-12">
          {FOUNDERS.map((f, i) => (
            <li
              key={f.name}
              className="border-fg/15 grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-b py-5 first:border-t md:grid-cols-[4rem_1fr_auto] md:gap-6 md:py-7"
            >
              <span className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase tabular-nums">
                0{i + 1}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-fg font-mono text-sm leading-tight font-semibold tracking-tight uppercase md:text-base">
                  {f.name}.
                </h3>
                <p className="text-muted text-sm leading-relaxed">{f.qualif}</p>
              </div>
              <span className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
                {f.role}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
