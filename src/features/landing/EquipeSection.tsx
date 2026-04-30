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
  <section
    id="equipe"
    className="border-border relative isolate w-full scroll-mt-24 overflow-hidden border-b py-24 md:scroll-mt-28 md:py-32"
  >
    <div className="relative mx-auto w-full max-w-400 px-5 md:px-6">
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

      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <div className="sticky top-28">
            <p className="text-fg/80 text-xl leading-relaxed md:text-2xl">
              Trois profils complémentaires, issus de l’industrie du luxe, du sport professionnel et
              de la relation client haut de gamme.
            </p>
            <p className="text-muted mt-6 max-w-md text-base leading-relaxed">
              Le premier interlocuteur reste le même tout au long du dossier. Les autres
              interviennent à la demande, selon la nature de l’intention.
            </p>

            <div className="border-fg/15 bg-fg/[0.035] mt-10 overflow-hidden border">
              <div className="border-fg/10 flex items-center justify-between border-b px-5 py-4">
                <span className="text-muted font-mono text-[10px] font-semibold tracking-[0.35em] uppercase">
                  Principe
                </span>
                <span className="text-fg font-mono text-[10px] font-semibold tracking-[0.35em] uppercase">
                  01
                </span>
              </div>
              <p className="text-fg px-5 py-6 font-mono text-xl leading-tight font-semibold tracking-tight uppercase">
                Un point de contact.
                <br />
                Un dossier.
                <br />
                Une exécution.
              </p>
            </div>
          </div>
        </div>

        <ul className="grid gap-4 md:col-span-7">
          {FOUNDERS.map((f, i) => (
            <li
              key={f.name}
              className="border-fg/15 bg-fg/[0.025] group relative overflow-hidden border transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="bg-fg absolute top-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
              <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-[7.5rem_1fr_auto] md:items-center md:p-6">
                <div className="text-fg/20 font-mono text-6xl leading-none font-semibold tracking-tight md:text-7xl">
                  {f.initials}
                </div>

                <div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase tabular-nums">
                      0{i + 1}
                    </span>
                    <span className="text-muted font-mono text-[10px] font-semibold tracking-[0.35em] uppercase">
                      {f.role}
                    </span>
                  </div>
                  <h3 className="text-fg mt-4 font-mono text-lg leading-tight font-semibold tracking-tight uppercase md:text-2xl">
                    {f.name}.
                  </h3>
                  <p className="text-muted mt-2 text-base leading-relaxed">{f.qualif}</p>
                </div>

                <span className="border-fg/20 text-fg hidden border px-3 py-2 font-mono text-[10px] font-semibold tracking-[0.35em] uppercase lg:inline-flex">
                  Active
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
