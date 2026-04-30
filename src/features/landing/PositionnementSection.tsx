import { SectionHeader } from '@components/layout/SectionHeader';
import { MaskedReveal } from '@components/ui/MaskedReveal';

const POSITIONING = [
  "SAW Next est une structure suisse indépendante spécialisée dans l'accompagnement de clients privés et d'entrepreneurs.",
  'Nous intervenons sur des demandes spécifiques, complexes ou non standardisées, dans un cadre strictement confidentiel.',
  "SAW Next n'est pas un vendeur de produits. C'est une plateforme de solutions.",
];

const CONVICTION_PHRASE = 'L’accès · La relation · L’exécution · ';

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
    <div className="landing-grid absolute inset-0 opacity-35" aria-hidden="true" />

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
            <p className="text-muted font-mono text-[10px] leading-relaxed font-semibold tracking-[0.3em] uppercase">
              Cadre suisse
              <br />
              Intervention privée
            </p>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
        <aside className="md:col-span-4 lg:col-span-3">
          <p className="text-muted max-w-xs text-sm leading-relaxed italic md:text-base">
            Dans un monde où tout peut s’acheter, la différence se joue ailleurs.
          </p>

          <div className="border-fg/15 mt-10 hidden border-t pt-6 md:block">
            {['DISCRÉTION', 'STRUCTURE', 'ACCÈS'].map((item, index) => (
              <div
                key={item}
                className="border-fg/10 flex items-center justify-between border-b py-4 font-mono text-[10px] font-semibold tracking-[0.32em] uppercase"
              >
                <span className="text-fg">{item}</span>
                <span className="text-muted tabular-nums">0{index + 1}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="md:col-span-8 lg:col-span-9">
          <div className="border-fg/15 border-t">
            {POSITIONING.map((p, i) => (
              <MaskedReveal key={p} delay={i * 90}>
                <p className="border-fg/15 group grid grid-cols-[3.5rem_1fr] gap-4 border-b py-7 text-lg leading-relaxed md:grid-cols-[5rem_1fr] md:py-9 md:text-2xl lg:text-3xl">
                  <span className="text-muted font-mono text-[10px] font-semibold tracking-[0.35em] uppercase tabular-nums">
                    0{i + 1}
                  </span>
                  <span className="text-fg/80 group-hover:text-fg max-w-5xl transition-colors duration-300">
                    {p}
                  </span>
                </p>
              </MaskedReveal>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div
      aria-hidden="true"
      className="border-fg/15 bg-fg text-bg group mt-24 overflow-hidden border-y md:mt-32"
    >
      <div className="flex animate-[marquee_38s_linear_infinite] py-8 whitespace-nowrap group-hover:[animation-play-state:paused] md:py-11">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="inline-block pr-12 font-mono text-4xl leading-none font-semibold tracking-tight uppercase md:pr-20 md:text-6xl lg:text-7xl"
          >
            {CONVICTION_PHRASE}
          </span>
        ))}
      </div>
    </div>

    <div className="relative mx-auto w-full max-w-400 px-5 md:px-6">
      <div className="mt-20 grid grid-cols-1 gap-4 md:mt-28 md:grid-cols-4">
        {APPROCHE.map((p, index) => (
          <article
            key={p.id}
            className="border-fg/10 bg-fg/[0.035] group relative min-h-72 overflow-hidden border p-6 transition-transform duration-300 hover:-translate-y-1 md:p-7"
          >
            <span className="bg-fg absolute top-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
            <div className="flex h-full flex-col justify-between gap-8">
              <div className="flex items-start justify-between gap-6">
                <span className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
                  {p.id}
                </span>
                <span className="text-fg/20 font-mono text-5xl leading-none font-semibold tracking-tight tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div>
                <h3 className="text-fg font-mono text-lg leading-[1.12] font-semibold tracking-tight uppercase md:text-xl">
                  {p.title}.
                </h3>
                <p className="text-muted mt-4 text-base leading-relaxed">{p.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
