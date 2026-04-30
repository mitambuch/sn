// ═══════════════════════════════════════════════════
// PositionnementSection — édito + Conviction marquee + Approche cards
//
// WHAT: 3 blocks. (a) édito 2-col. (b) Conviction = marquee
// horizontal infinite ticker (l'accès · la relation · l'exécution
// répétés en boucle, hover pause). (c) Approche 2x2 cards bg-surface.
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

      {/* (a) Body — Geist sans, 2 col asymetric */}
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

    {/* (b) Conviction marquee — full-bleed ticker, GAFHA-style */}
    <div
      aria-hidden="true"
      className="border-border bg-surface group mt-20 overflow-hidden border-y md:mt-28"
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
      {/* (c) Approche — 2x2 grid of cards */}
      <div className="mt-20 md:mt-28">
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {APPROCHE.map(p => (
            <li key={p.id} className="bg-surface flex flex-col gap-4 rounded-sm p-6 md:p-8">
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
