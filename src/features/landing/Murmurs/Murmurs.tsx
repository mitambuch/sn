// ═══════════════════════════════════════════════════
// Murmurs — acte 2, POSITIONNEMENT (Granyon-style breathing)
//
// WHAT: Three layouts, each different from the others — no boxes,
//       no tinted bands, no card grids :
//       (a) Positionnement édito — asymetric 2-col (small intro
//           label left, long body right with 3 staggered paragraphs).
//       (b) Conviction monumentale — full-bleed pleine respiration,
//           3 lines stacked center-left, MASSIVE white space, the
//           amorce phrase floats in the right margin like a marginal
//           gloss.
//       (c) Approche — vertical zigzag : 4 piliers occupent toute la
//           largeur, alternance gauche/droite, chacun = un mini-acte
//           propre avec espace vertical entre eux.
// WHEN: After Apparition. Establishes who SAW Next is + what they
//       believe + how they operate.
// ═══════════════════════════════════════════════════

import { ActStage } from '@components/orchestration/ActStage';
import { TechFrame } from '@components/orchestration/TechFrame';
import { cn } from '@utils/cn';

const POSITIONING = [
  "SAW Next est une structure suisse indépendante spécialisée dans l'accompagnement de clients privés et d'entrepreneurs.",
  'Nous intervenons sur des demandes spécifiques, complexes ou non standardisées, dans un cadre strictement confidentiel.',
  "SAW Next n'est pas un vendeur de produits. C'est une plateforme de solutions.",
];

const CONVICTION = ['L’accès.', 'La relation.', 'L’exécution.'];

const PILLARS = [
  {
    id: '01',
    side: 'left' as const,
    title: 'Confidentialité absolue',
    body: 'Aucune information sensible n’est partagée sans validation préalable. Le silence est un service.',
  },
  {
    id: '02',
    side: 'right' as const,
    title: 'Réseau international',
    body: 'Partenaires sélectionnés selon la nature de chaque demande, intégrés au cas par cas.',
  },
  {
    id: '03',
    side: 'left' as const,
    title: 'Interlocuteur unique',
    body: 'Un seul point de contact connaît votre dossier. Pas de chaîne, pas de déperdition.',
  },
  {
    id: '04',
    side: 'right' as const,
    title: 'Exécution sur mesure',
    body: 'Chaque intervention est pensée comme une réponse unique. Aucun template, aucun catalogue.',
  },
];

export const Murmurs = () => (
  <ActStage name="Murmurs" tall={1} sticky={false}>
    <div className="relative w-full">
      <TechFrame index="002" label="POSITIONNEMENT" />

      {/* (a) Positionnement édito — asymetric 2-col, padding XL */}
      <section className="px-6 pt-32 pb-32 md:px-12 md:pt-48 md:pb-40">
        <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-12 md:gap-20">
          <p className="col-span-12 font-mono text-[10px] font-semibold tracking-[0.5em] text-[#1a1a1a]/50 uppercase md:col-span-3 md:pt-3">
            <span className="text-[#1a1a1a]/30">02 / </span>
            POSITIONNEMENT
          </p>
          <div className="col-span-12 max-w-160 space-y-8 md:col-span-9">
            {POSITIONING.map((p, i) => (
              <p
                key={i}
                className="leading-snug font-light tracking-tight text-[#1a1a1a]"
                style={{ fontSize: 'clamp(1.35rem, 2.4vw, 2rem)' }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* (b) Conviction — full-bleed, monumental, marginal amorce on the right */}
      <section className="relative w-full overflow-hidden px-6 py-40 md:px-12 md:py-56">
        <div className="mx-auto grid w-full max-w-7xl gap-16 md:grid-cols-12 md:gap-12">
          {/* Marginal gloss — top right column */}
          <aside className="order-1 col-span-12 md:order-2 md:col-span-4 md:col-start-9 md:pt-2">
            <p className="font-mono text-[10px] font-semibold tracking-[0.5em] text-[#1a1a1a]/50 uppercase">
              <span className="text-[#1a1a1a]/30">02.B / </span>
              CONVICTION
            </p>
            <p className="mt-8 max-w-xs text-base leading-relaxed text-[#1a1a1a]/65 italic md:text-lg">
              Dans un monde où tout peut s’acheter, la différence se joue ailleurs.
            </p>
          </aside>

          {/* Three monumental lines — center-left, stacked, breathing */}
          <div className="order-2 col-span-12 md:order-1 md:col-span-8 md:row-start-1">
            <ol className="flex flex-col gap-1">
              {CONVICTION.map((line, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-6 leading-[0.95] font-light tracking-tight text-[#1a1a1a]"
                  style={{ fontSize: 'clamp(3rem, 11vw, 9rem)' }}
                >
                  <span className="font-mono text-xs font-semibold tracking-[0.4em] text-[#1a1a1a]/30 md:text-sm">
                    0{i + 1}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Hairline separator below — visual rhythm, very subtle */}
        <div className="mx-auto mt-32 h-px w-full max-w-7xl bg-[#1a1a1a]/10" />
      </section>

      {/* (c) Approche — vertical zigzag, no grid, no cards */}
      <section className="px-6 pt-32 pb-40 md:px-12 md:pt-48 md:pb-56">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-24 flex items-baseline gap-6 md:mb-32">
            <p className="font-mono text-[10px] font-semibold tracking-[0.5em] text-[#1a1a1a]/50 uppercase">
              <span className="text-[#1a1a1a]/30">02.C / </span>
              APPROCHE
            </p>
            <span className="block h-px flex-1 bg-[#1a1a1a]/15" />
          </div>

          <ul className="flex flex-col gap-32 md:gap-40">
            {PILLARS.map(p => (
              <li
                key={p.id}
                className={cn(
                  'flex flex-col gap-6 md:flex-row md:items-start md:gap-16',
                  p.side === 'right' && 'md:ml-[35%]',
                )}
              >
                <span className="font-mono text-[10px] font-semibold tracking-[0.5em] text-[#1a1a1a]/35 uppercase md:pt-3">
                  {p.id}
                </span>
                <div className="max-w-136">
                  <h3
                    className="font-light tracking-tight text-[#1a1a1a]"
                    style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', lineHeight: '1.05' }}
                  >
                    {p.title}.
                  </h3>
                  <p className="mt-6 max-w-md text-lg leading-relaxed text-[#1a1a1a]/70 md:text-xl">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  </ActStage>
);
