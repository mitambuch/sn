import { SectionHeader } from '@components/layout/SectionHeader';
import { MaskedReveal } from '@components/ui/MaskedReveal';

const POSITIONING = [
  "SAW Next est une structure suisse indépendante spécialisée dans l'accompagnement de clients privés et d'entrepreneurs.",
  'Nous intervenons sur des demandes spécifiques, complexes ou non standardisées, dans un cadre strictement confidentiel.',
  "SAW Next n'est pas un vendeur de produits. C'est une plateforme de solutions.",
];

const CONVICTION_PHRASE =
  'L’accès aux cercles fermés · La relation portée par un seul interlocuteur · L’exécution sans intermédiaire financier · Depuis la Suisse, en stricte confidentialité · ';

const APPROCHE = [
  {
    id: '01',
    title: 'Confidentialité absolue',
    body: 'Aucune information sensible n’est partagée sans validation préalable. Le silence est un service.',
  },
  {
    id: '02',
    title: 'Réseau international',
    body: 'Partenaires sélectionnés selon la nature de chaque demande, intégrés au cas par cas.',
  },
  {
    id: '03',
    title: 'Interlocuteur unique',
    body: 'Un seul point de contact connaît votre dossier. Pas de chaîne, pas de déperdition.',
  },
  {
    id: '04',
    title: 'Exécution sur mesure',
    body: 'Chaque intervention est pensée comme une réponse unique. Aucun template, aucun catalogue.',
  },
];

export const PositionnementSection = () => (
  <section
    id="positionnement"
    className="border-border relative isolate w-full scroll-mt-24 overflow-hidden border-b py-24 md:scroll-mt-28 md:py-32"
  >
    <div className="relative mx-auto w-full max-w-400 px-5 md:px-6">
      <SectionHeader
        index="02"
        label="POSITIONNEMENT"
        title={
          <>
            Une structure
            <br />
            suisse indépendante.
          </>
        }
        trailing={
          <div className="border-fg/15 hidden min-w-56 border-l pl-5 md:block">
            <p className="text-fg font-mono text-[10px] leading-relaxed font-semibold tracking-[0.3em] uppercase">
              Cadre suisse
              <br />
              Intervention privée
            </p>
          </div>
        }
      />

      <div className="border-fg/15 border-t">
        {POSITIONING.map((p, i) => (
          <MaskedReveal key={p} delay={i * 90}>
            <p className="border-fg/15 grid grid-cols-[3.5rem_1fr] gap-4 border-b py-7 text-lg leading-relaxed md:grid-cols-[5rem_1fr] md:py-9 md:text-2xl lg:text-3xl">
              <span className="text-fg font-mono text-[10px] font-semibold tracking-[0.35em] uppercase tabular-nums">
                0{i + 1}
              </span>
              <span className="text-fg max-w-5xl">{p}</span>
            </p>
          </MaskedReveal>
        ))}
      </div>
    </div>

    <div
      aria-hidden="true"
      className="border-fg/15 bg-fg text-bg group mt-24 overflow-hidden border-y md:mt-32"
    >
      <div className="flex animate-[marquee_72s_linear_infinite] py-3 whitespace-nowrap group-hover:[animation-play-state:paused] md:py-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="inline-block pr-10 font-mono text-sm leading-none font-semibold tracking-[0.18em] uppercase md:pr-14 md:text-base lg:text-lg"
          >
            {CONVICTION_PHRASE}
          </span>
        ))}
      </div>
    </div>

    <div className="relative mx-auto w-full max-w-400 px-5 md:px-6">
      <div className="mt-20 grid grid-cols-1 gap-4 md:mt-28 md:grid-cols-4">
        {APPROCHE.map(p => (
          <article
            key={p.id}
            className="border-fg/15 group relative min-h-72 overflow-hidden rounded-sm border p-7 md:p-8"
          >
            <span className="bg-fg absolute top-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
            <div className="flex h-full flex-col gap-8">
              <span className="text-fg font-mono text-[10px] font-semibold tracking-[0.4em] uppercase tabular-nums">
                {p.id}
              </span>
              <div className="flex-1">
                <h3 className="text-fg font-mono text-lg leading-[1.15] font-semibold tracking-tight uppercase md:text-xl">
                  {p.title}.
                </h3>
                <p className="text-fg mt-5 text-base leading-relaxed">{p.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
