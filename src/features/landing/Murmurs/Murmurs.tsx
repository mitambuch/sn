// ═══════════════════════════════════════════════════
// Murmurs — acte 2, POSITIONNEMENT (dense édito + conviction)
//
// WHAT: Three composed blocks within one act:
//       (1) Positionnement — the "structure suisse indépendante"
//           paragraph, set as a long-form édito.
//       (2) Conviction — three monumental nouns "ACCÈS · RELATION ·
//           EXÉCUTION" in a stacked typography sequence on a slightly
//           tinted band.
//       (3) Approche — 4 piliers in an asymmetric grid with arrow
//           indices.
// WHEN: After Apparition. The brand has been received; this acte
//       declares what it is and how it operates.
// CHANGE COPY: constants below.
// ═══════════════════════════════════════════════════

import { ActStage } from '@components/orchestration/ActStage';
import { TechFrame } from '@components/orchestration/TechFrame';
import { BrandArrow } from '@components/ui/BrandArrow';

const POSITIONING_BODY = [
  "SAW Next est une structure suisse indépendante spécialisée dans l'accompagnement de clients privés et d'entrepreneurs.",
  'Nous intervenons sur des demandes spécifiques, complexes ou non standardisées, dans un cadre strictement confidentiel.',
  "SAW Next n'est pas un vendeur de produits. C'est une plateforme de solutions.",
];

const CONVICTION = ['L’ACCÈS.', 'LA RELATION.', 'L’EXÉCUTION.'];

const PILLARS = [
  {
    id: '01',
    title: 'CONFIDENTIALITÉ ABSOLUE',
    body: 'Aucune information sensible n’est partagée sans validation.',
  },
  {
    id: '02',
    title: 'RÉSEAU INTERNATIONAL',
    body: 'Partenaires sélectionnés selon la nature de chaque demande.',
  },
  {
    id: '03',
    title: 'INTERLOCUTEUR UNIQUE',
    body: 'Un seul point de contact qui connaît votre dossier.',
  },
  {
    id: '04',
    title: 'EXÉCUTION SUR MESURE',
    body: 'Chaque intervention est pensée comme une réponse unique.',
  },
];

export const Murmurs = () => (
  <ActStage name="Murmurs" tall={1} sticky={false}>
    <div className="relative flex min-h-screen w-full flex-col px-6 py-32 md:px-12 md:py-40">
      <TechFrame index="002" label="POSITIONNEMENT" />

      <div className="mx-auto grid w-full max-w-6xl gap-20 md:gap-28">
        {/* Block 1 — Positionnement édito */}
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <h2 className="col-span-12 font-mono text-2xl leading-tight font-semibold tracking-tight text-[#1a1a1a] uppercase md:col-span-5 md:text-3xl">
            UNE STRUCTURE
            <br />
            SUISSE
            <br />
            INDÉPENDANTE.
          </h2>
          <div className="col-span-12 space-y-6 text-lg leading-relaxed text-pretty text-[#1a1a1a]/85 md:col-span-7 md:text-xl">
            {POSITIONING_BODY.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {/* Block 2 — Conviction monumental */}
        <div className="-mx-6 border-y border-[#1a1a1a]/10 bg-[#1a1a1a]/2.5 px-6 py-20 md:-mx-12 md:px-12 md:py-32">
          <p className="mb-12 font-mono text-[10px] font-semibold tracking-[0.5em] text-[#1a1a1a]/50 uppercase">
            02 · CONVICTION
          </p>
          <p className="mb-16 max-w-2xl font-mono text-sm leading-relaxed text-[#1a1a1a]/70 uppercase md:text-base">
            Dans un monde où tout peut s’acheter, la différence se joue ailleurs.
          </p>
          <div className="grid gap-2">
            {CONVICTION.map((line, i) => (
              <h3
                key={i}
                className="flex items-baseline gap-6 font-mono leading-[0.95] font-semibold tracking-tight text-[#1a1a1a] uppercase"
                style={{ fontSize: 'clamp(2.5rem, 8.5vw, 7rem)' }}
              >
                <span className="font-mono text-xs tracking-[0.4em] text-[#1a1a1a]/30 md:text-sm">
                  0{i + 1}
                </span>
                <span>{line}</span>
              </h3>
            ))}
          </div>
        </div>

        {/* Block 3 — Approche, 4 pillars asymetric grid */}
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <h2 className="col-span-12 font-mono text-2xl leading-tight font-semibold tracking-tight text-[#1a1a1a] uppercase md:col-span-4 md:text-3xl">
            APPROCHE.
          </h2>
          <ul className="col-span-12 grid gap-8 md:col-span-8 md:grid-cols-2">
            {PILLARS.map(p => (
              <li
                key={p.id}
                className="group relative flex flex-col gap-3 border-t border-[#1a1a1a]/15 pt-5"
              >
                <div className="flex items-center justify-between font-mono text-[10px] font-semibold tracking-[0.4em] text-[#1a1a1a]/50 uppercase">
                  <span>{p.id}</span>
                  <BrandArrow className="h-[0.9em] text-[#1a1a1a]/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#1a1a1a]/70" />
                </div>
                <h4 className="font-mono text-base font-semibold tracking-tight text-[#1a1a1a] uppercase md:text-lg">
                  {p.title}
                </h4>
                <p className="text-sm leading-relaxed text-[#1a1a1a]/70 md:text-base">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </ActStage>
);
