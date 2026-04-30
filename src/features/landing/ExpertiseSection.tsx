// ═══════════════════════════════════════════════════
// ExpertiseSection — the 10 expertise domains, numbered table
//
// WHAT: Numbered sommaire of the 10 fields where SAW Next intervenes.
//       Each row = index (01–10), title, sub-line of keywords. Hover
//       brings the row forward and slides in the brand arrow.
// WHEN: Third section of pages/Home.tsx, anchored at #expertise.
// EDIT LIST: DOMAINS array.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { BrandArrow } from '@components/ui/BrandArrow';
import { cn } from '@utils/cn';
import { useState } from 'react';

interface Domain {
  id: string;
  title: string;
  sub: string;
}

const DOMAINS: Domain[] = [
  {
    id: '01',
    title: 'Haute horlogerie & pièces rares',
    sub: 'Maisons indépendantes · Calibre · Provenance',
  },
  { id: '02', title: 'Opportunités off-market', sub: 'Biens et opportunités jamais publiés' },
  {
    id: '03',
    title: 'Immobilier sur mesure',
    sub: 'Acquisitions discrètes · Résidences principales et secondaires',
  },
  { id: '04', title: 'Art & collection', sub: 'Œuvres rares · Provenance · Certificats' },
  {
    id: '05',
    title: 'Expériences & voyages',
    sub: 'Itinéraires confidentiels · Exécution sur mesure',
  },
  { id: '06', title: 'Événementiel exclusif', sub: 'Monaco · Wimbledon · Cannes · Cercles privés' },
  {
    id: '07',
    title: 'Lifestyle management',
    sub: 'Au quotidien · Sans relâche · Assistance globale',
  },
  {
    id: '08',
    title: 'Mise en relation stratégique',
    sub: 'Cercles fermés · Introductions ciblées',
  },
  { id: '09', title: 'Structuration patrimoniale', sub: 'Cadre suisse · Partenaires sélectionnés' },
  {
    id: '10',
    title: 'Accompagnement de carrière',
    sub: 'Long terme · Confidentiel · Pluri-sectoriel',
  },
];

export const ExpertiseSection = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="expertise" className="border-fg/10 relative w-full border-t py-32 md:py-48">
      <Container size="2k">
        <header className="mb-16 grid gap-6 md:mb-24 md:grid-cols-12 md:gap-16">
          <p className="text-fg/55 col-span-12 font-mono text-[10px] font-semibold tracking-[0.5em] uppercase md:col-span-3 md:pt-3">
            <span className="text-fg/30">03 / </span>EXPERTISE
          </p>
          <div className="col-span-12 max-w-3xl md:col-span-9">
            <h2
              className="text-fg font-mono font-semibold tracking-tight uppercase"
              style={{ fontSize: 'clamp(1.75rem, 3.6vw, 3rem)', lineHeight: '1.1' }}
            >
              Un spectre
              <br />
              volontairement large.
            </h2>
            <p className="text-fg/70 mt-6 max-w-2xl text-lg leading-relaxed md:text-xl">
              Chaque intervention est pensée comme une réponse unique. Les domaines ci-dessous sont
              des points d&apos;ancrage, pas des catégories closes.
            </p>
          </div>
        </header>

        <ul onMouseLeave={() => setHovered(null)} className="flex flex-col">
          {DOMAINS.map((d, i) => {
            const isActive = hovered === d.id;
            const isDimmed = hovered !== null && !isActive;
            return (
              <li
                key={d.id}
                onMouseEnter={() => setHovered(d.id)}
                className={cn(
                  'border-fg/15 group relative flex flex-col gap-2 border-t py-6 transition-opacity duration-500 md:flex-row md:items-baseline md:gap-10 md:py-8',
                  isDimmed && 'opacity-40',
                  i === DOMAINS.length - 1 && 'border-b',
                )}
              >
                <span
                  className={cn(
                    'text-fg/55 font-mono text-[10px] font-semibold tracking-[0.4em] uppercase transition-colors duration-300 md:w-16',
                    isActive && 'text-fg',
                  )}
                >
                  {d.id}
                </span>
                <div
                  className={cn(
                    'flex flex-1 flex-col gap-1 transition-transform duration-500',
                    isActive && 'md:translate-x-2',
                  )}
                >
                  <h3
                    className="text-fg font-mono font-semibold tracking-tight uppercase"
                    style={{ fontSize: 'clamp(1.05rem, 1.7vw, 1.5rem)', lineHeight: '1.15' }}
                  >
                    {d.title}.
                  </h3>
                  <p className="text-fg/55 font-mono text-[11px] tracking-[0.2em] uppercase md:text-xs">
                    {d.sub}
                  </p>
                </div>
                <BrandArrow
                  className={cn(
                    'text-fg pointer-events-none hidden h-[0.9em] transition-all duration-500 md:block',
                    isActive ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0',
                  )}
                />
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
};
