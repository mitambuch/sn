// ═══════════════════════════════════════════════════
// PositionnementSection — who SAW Next is + the conviction + approche
//
// WHAT: Three composed blocks within a single anchored section :
//       (a) Positionnement — long-form édito explaining the structure
//       (b) Conviction — 3 monumental nouns (L'accès / La relation /
//           L'exécution) with marginal gloss
//       (c) Approche — 4 piliers in a clean numbered list
// WHEN: Second section of pages/Home.tsx, anchored at #positionnement.
// EDIT COPY: constants below.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { BrandArrow } from '@components/ui/BrandArrow';

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
  <section id="positionnement" className="relative w-full py-32 md:py-48">
    <Container size="2k">
      {/* (a) Positionnement édito */}
      <header className="mb-16 grid gap-6 md:mb-24 md:grid-cols-12 md:gap-16">
        <p className="text-fg/55 col-span-12 font-mono text-[10px] font-semibold tracking-[0.5em] uppercase md:col-span-3 md:pt-3">
          <span className="text-fg/30">02 / </span>POSITIONNEMENT
        </p>
        <div className="col-span-12 max-w-4xl space-y-8 md:col-span-9">
          {POSITIONING.map((p, i) => (
            <p
              key={i}
              className="text-fg leading-snug font-light tracking-tight"
              style={{ fontSize: 'clamp(1.35rem, 2.4vw, 2.25rem)' }}
            >
              {p}
            </p>
          ))}
        </div>
      </header>

      {/* (b) Conviction — 3 monumental lines */}
      <div className="border-fg/10 grid gap-12 border-t pt-24 md:grid-cols-12 md:gap-16 md:pt-32">
        <aside className="col-span-12 md:col-span-3">
          <p className="text-fg/55 font-mono text-[10px] font-semibold tracking-[0.5em] uppercase">
            <span className="text-fg/30">02.B / </span>CONVICTION
          </p>
          <p className="text-fg/65 mt-6 max-w-xs text-base leading-relaxed italic md:text-lg">
            Dans un monde où tout peut s’acheter, la différence se joue ailleurs.
          </p>
        </aside>
        <ol className="col-span-12 flex flex-col gap-2 md:col-span-9">
          {CONVICTION.map((line, i) => (
            <li
              key={i}
              className="text-fg flex items-baseline gap-6 leading-[0.95] font-light tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 9vw, 8rem)' }}
            >
              <span className="text-fg/25 font-mono text-xs font-semibold tracking-[0.4em] md:text-sm">
                0{i + 1}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* (c) Approche — 4 piliers */}
      <div className="border-fg/10 mt-24 border-t pt-16 md:mt-32 md:pt-24">
        <header className="mb-12 flex items-baseline gap-6">
          <p className="text-fg/55 font-mono text-[10px] font-semibold tracking-[0.5em] uppercase">
            <span className="text-fg/30">02.C / </span>APPROCHE
          </p>
          <span className="bg-fg/15 block h-px flex-1" />
        </header>
        <ul className="grid gap-12 md:grid-cols-2 md:gap-16">
          {APPROCHE.map(p => (
            <li
              key={p.id}
              className="border-fg/15 group relative flex flex-col gap-4 border-t pt-6"
            >
              <div className="text-fg/55 flex items-center justify-between font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
                <span>{p.id}</span>
                <BrandArrow className="text-fg/30 group-hover:text-fg/70 h-[0.9em] transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              <h3
                className="text-fg font-light tracking-tight"
                style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.25rem)', lineHeight: '1.1' }}
              >
                {p.title}.
              </h3>
              <p className="text-fg/70 max-w-md text-base leading-relaxed md:text-lg">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);
