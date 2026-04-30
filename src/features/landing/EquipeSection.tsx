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
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-4">
            <p className="text-fg font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
              <span className="text-fg/30">05 / </span>ÉQUIPE
            </p>
            <span className="bg-fg/30 hidden h-px w-16 md:block" aria-hidden="true" />
          </div>

          <h2 className="text-fg mt-5 font-mono text-3xl leading-[1.04] font-semibold tracking-tight uppercase md:mt-6 md:text-5xl lg:text-6xl">
            Une structure agile,
            <br />
            discrète, crédible.
          </h2>

          <p className="text-fg mt-10 text-xl leading-relaxed md:mt-12 md:text-2xl">
            Trois profils complémentaires, issus de l’industrie du luxe, du sport professionnel et
            de la relation client haut de gamme.
          </p>
          <p className="text-fg mt-6 max-w-md text-base leading-relaxed">
            Le premier interlocuteur reste le même tout au long du dossier. Les autres interviennent
            à la demande, selon la nature de l’intention.
          </p>
        </div>

        <ul className="border-fg/15 border-t md:col-span-7">
          {FOUNDERS.map((f, i) => (
            <li
              key={f.name}
              className="border-fg/15 grid grid-cols-1 gap-6 border-b py-7 md:grid-cols-[7.5rem_1fr] md:items-center md:py-8"
            >
              <div className="text-fg/25 font-mono text-6xl leading-none font-semibold tracking-tight md:text-7xl">
                {f.initials}
              </div>

              <div>
                <div className="flex items-center gap-4">
                  <span className="text-fg font-mono text-[10px] font-semibold tracking-[0.4em] uppercase tabular-nums">
                    0{i + 1}
                  </span>
                  <span className="text-fg font-mono text-[10px] font-semibold tracking-[0.35em] uppercase">
                    {f.role}
                  </span>
                </div>
                <h3 className="text-fg mt-4 font-mono text-lg leading-tight font-semibold tracking-tight uppercase md:text-2xl">
                  {f.name}.
                </h3>
                <p className="text-fg mt-2 text-base leading-relaxed">{f.qualif}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
