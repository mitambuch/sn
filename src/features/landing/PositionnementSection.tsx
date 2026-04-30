// ═══════════════════════════════════════════════════
// PositionnementSection — who SAW Next is + conviction + approche
//
// WHAT: One section, three composed blocks, ONE single index label
//       (02 · POSITIONNEMENT) at the top. Sub-blocks are introduced
//       by a thin caps subtitle, no repeated 02.A / 02.B / 02.C.
//       Hairlines used sparingly: one between conviction and approche
//       only (the section itself sits on the section-divider above).
// WHEN: Second section of pages/Home.tsx, anchored at #positionnement.
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
  <section id="positionnement" className="border-fg/10 relative w-full border-t py-32 md:py-48">
    <Container size="2k">
      {/* Single section label */}
      <p className="text-fg/55 mb-16 font-mono text-[10px] font-semibold tracking-[0.5em] uppercase md:mb-24">
        <span className="text-fg/30">02 / </span>POSITIONNEMENT
      </p>

      {/* (a) Édito */}
      <div className="grid gap-10 md:grid-cols-12 md:gap-20">
        <h2
          className="text-fg col-span-12 font-mono font-semibold tracking-tight uppercase md:col-span-5"
          style={{ fontSize: 'clamp(1.75rem, 3.4vw, 3rem)', lineHeight: '1.1' }}
        >
          Une structure
          <br />
          suisse indépendante.
        </h2>
        <div className="col-span-12 max-w-3xl space-y-6 md:col-span-7">
          {POSITIONING.map((p, i) => (
            <p
              key={i}
              className="text-fg/80 leading-relaxed font-light"
              style={{ fontSize: 'clamp(1.1rem, 1.4vw, 1.4rem)' }}
            >
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* (b) Conviction — 3 monumental lines, no extra label */}
      <div className="mt-32 grid gap-12 md:mt-48 md:grid-cols-12 md:gap-16">
        <p className="text-fg/65 col-span-12 max-w-xs text-base leading-relaxed italic md:col-span-3 md:text-lg">
          Dans un monde où tout peut s’acheter, la différence se joue ailleurs.
        </p>
        <ol className="col-span-12 flex flex-col gap-2 md:col-span-9">
          {CONVICTION.map((line, i) => (
            <li
              key={i}
              className="text-fg flex items-baseline gap-6 font-mono leading-[0.95] font-semibold tracking-tight uppercase"
              style={{ fontSize: 'clamp(2rem, 6.5vw, 5.5rem)' }}
            >
              <span className="text-fg/25 font-mono text-xs font-semibold tracking-[0.4em] md:text-sm">
                0{i + 1}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* (c) Approche — 4 piliers, no extra label */}
      <div className="mt-32 md:mt-48">
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
                className="text-fg font-mono font-semibold tracking-tight uppercase"
                style={{ fontSize: 'clamp(1.15rem, 1.6vw, 1.5rem)', lineHeight: '1.15' }}
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
