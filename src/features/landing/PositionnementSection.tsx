// ═══════════════════════════════════════════════════
// PositionnementSection — édito + Conviction marquee + Approche
// (cards bg-fg/5, harmonised with the warm-grey bg, no white)
// ═══════════════════════════════════════════════════

import { SectionHeader } from '@components/layout/SectionHeader';

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
  <section id="positionnement" className="border-border relative w-full border-b py-20 md:py-28">
    <div className="mx-auto w-full max-w-400 px-5 md:px-6">
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
      />

      <div className="grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-12">
        <p className="text-muted col-span-12 max-w-xs text-sm leading-relaxed italic md:col-span-3 md:text-base">
          Dans un monde où tout peut s’acheter, la différence se joue ailleurs.
        </p>
        <div className="col-span-12 space-y-5 md:col-span-9">
          {POSITIONING.map((p, i) => (
            <p
              key={i}
              className="text-fg/80 max-w-3xl text-lg leading-relaxed font-light md:text-xl"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>

    {/* Conviction marquee — full-bleed bg-fg/5 (not surface-white) */}
    <div
      aria-hidden="true"
      className="border-fg/15 bg-fg/5 group mt-20 overflow-hidden border-y md:mt-28"
    >
      <div className="flex animate-[marquee_42s_linear_infinite] py-10 whitespace-nowrap group-hover:[animation-play-state:paused] md:py-14">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className={
              i % 2 === 0
                ? 'text-fg inline-block pr-12 font-mono text-4xl leading-none font-semibold tracking-tight uppercase md:pr-20 md:text-6xl lg:text-7xl'
                : 'text-muted inline-block pr-12 font-mono text-4xl leading-none font-semibold tracking-tight uppercase md:pr-20 md:text-6xl lg:text-7xl'
            }
          >
            {CONVICTION_PHRASE}
          </span>
        ))}
      </div>
    </div>

    <div className="mx-auto w-full max-w-400 px-5 md:px-6">
      {/* Approche — cards bg-fg/5 (no more white bg-surface) */}
      <div className="mt-20 md:mt-28">
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {APPROCHE.map(p => (
            <li
              key={p.id}
              className="bg-fg/5 border-fg/10 flex flex-col gap-4 rounded-sm border p-6 md:p-8"
            >
              <span className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
                {p.id}
              </span>
              <h3 className="text-fg font-mono text-lg leading-[1.15] font-semibold tracking-tight uppercase md:text-xl">
                {p.title}.
              </h3>
              <p className="text-muted text-base leading-relaxed">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
