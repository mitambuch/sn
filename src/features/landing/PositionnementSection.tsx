// ═══════════════════════════════════════════════════
// PositionnementSection — GAFHA grid + uniform SectionHeader
// ═══════════════════════════════════════════════════

import { SectionHeader } from '@components/layout/SectionHeader';

const POSITIONING = [
  "SAW Next est une structure suisse indépendante spécialisée dans l'accompagnement de clients privés et d'entrepreneurs.",
  'Nous intervenons sur des demandes spécifiques, complexes ou non standardisées, dans un cadre strictement confidentiel.',
  "SAW Next n'est pas un vendeur de produits. C'est une plateforme de solutions.",
];

const CONVICTION = ['L’accès.', 'La relation.', 'L’exécution.'];

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

      {/* Body — Geist sans, 2 col grid */}
      <div className="grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-3" aria-hidden="true" />
        <div className="space-y-5 md:col-span-9">
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

      {/* Conviction — full-width monumental */}
      <div className="border-border mt-20 grid grid-cols-1 gap-8 border-t pt-16 md:mt-28 md:grid-cols-12 md:gap-12 md:pt-20">
        <p className="text-muted max-w-xs text-sm leading-relaxed italic md:col-span-3 md:text-base">
          Dans un monde où tout peut s’acheter, la différence se joue ailleurs.
        </p>
        <ol className="md:col-span-9">
          {CONVICTION.map((line, i) => (
            <li
              key={i}
              className="text-fg flex items-baseline gap-6 font-mono leading-[0.95] font-semibold tracking-tight uppercase"
              style={{ fontSize: 'clamp(1.85rem, 5.5vw, 4.5rem)' }}
            >
              <span className="text-muted font-mono text-xs font-semibold tracking-[0.4em] tabular-nums md:text-sm">
                0{i + 1}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Approche — 2x2 grid of cards (bg-surface, rounded-md) */}
      <div className="mt-20 md:mt-28">
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {APPROCHE.map(p => (
            <li key={p.id} className="bg-surface flex flex-col gap-4 rounded-md p-6 md:p-8">
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
