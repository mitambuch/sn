// ═══════════════════════════════════════════════════
// Stillness — acte 3, EXPERTISE (10 domaines structurés)
//
// WHAT: Numbered technical sommaire of the 10 expertise areas. Each
//       row carries: index (01–10) · domain title (Geist Mono semi-
//       bold uppercase) · sub-line (catégorie / mots-clefs). Hover :
//       row shifts +8px right, sub-line intensifies, brand arrow
//       slides in. NOT a stellar field — a rich technical catalogue.
// WHEN: After Murmurs. The how, in detail.
// CHANGE LIST: DOMAINS array.
// ═══════════════════════════════════════════════════

import { ActStage } from '@components/orchestration/ActStage';
import { TechFrame } from '@components/orchestration/TechFrame';
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
    title: 'HAUTE HORLOGERIE & PIÈCES RARES',
    sub: 'Maisons indépendantes · Calibre · Provenance',
  },
  { id: '02', title: 'OPPORTUNITÉS OFF-MARKET', sub: 'Biens et opportunités jamais publiés' },
  {
    id: '03',
    title: 'IMMOBILIER SUR MESURE',
    sub: 'Acquisitions discrètes · Résidences principales et secondaires',
  },
  { id: '04', title: 'ART & COLLECTION', sub: 'Œuvres rares · Provenance · Certificats' },
  {
    id: '05',
    title: 'EXPÉRIENCES & VOYAGES',
    sub: 'Itinéraires confidentiels · Exécution sur mesure',
  },
  { id: '06', title: 'ÉVÉNEMENTIEL EXCLUSIF', sub: 'Monaco · Wimbledon · Cannes · Cercles privés' },
  {
    id: '07',
    title: 'LIFESTYLE MANAGEMENT',
    sub: 'Au quotidien · Sans relâche · Assistance globale',
  },
  {
    id: '08',
    title: 'MISE EN RELATION STRATÉGIQUE',
    sub: 'Cercles fermés · Introductions ciblées',
  },
  { id: '09', title: 'STRUCTURATION PATRIMONIALE', sub: 'Cadre suisse · Partenaires sélectionnés' },
  {
    id: '10',
    title: 'ACCOMPAGNEMENT DE CARRIÈRE',
    sub: 'Long terme · Confidentiel · Pluri-sectoriel',
  },
];

export const Stillness = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <ActStage name="Stillness" tall={1} sticky={false}>
      <div className="relative w-full px-6 py-32 md:px-12 md:py-40">
        <TechFrame index="003" label="EXPERTISE" />

        <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-12 md:gap-16">
          <div className="col-span-12 md:col-span-4">
            <h2 className="font-mono text-2xl leading-tight font-semibold tracking-tight text-[#1a1a1a] uppercase md:text-3xl">
              UN SPECTRE
              <br />
              VOLONTAIREMENT
              <br />
              LARGE.
            </h2>
            <p className="mt-8 max-w-xs text-base leading-relaxed text-[#1a1a1a]/70">
              Chaque intervention est pensée comme une réponse unique. Les domaines ci-contre sont
              des points d&apos;ancrage, pas des catégories closes.
            </p>
          </div>

          <ul
            onMouseLeave={() => setHovered(null)}
            className="col-span-12 flex flex-col md:col-span-8"
          >
            {DOMAINS.map((d, i) => {
              const isActive = hovered === d.id;
              const isDimmed = hovered !== null && !isActive;
              return (
                <li
                  key={d.id}
                  onMouseEnter={() => setHovered(d.id)}
                  className={cn(
                    'group relative flex flex-col gap-1 border-t border-[#1a1a1a]/15 py-6 transition-all duration-500 md:flex-row md:items-baseline md:gap-8',
                    isDimmed && 'opacity-40',
                    isActive && 'opacity-100',
                    i === DOMAINS.length - 1 && 'border-b',
                  )}
                >
                  <span
                    className={cn(
                      'font-mono text-[10px] font-semibold tracking-[0.4em] text-[#1a1a1a]/50 transition-colors duration-300 md:w-12',
                      isActive && 'text-[#1a1a1a]',
                    )}
                  >
                    {d.id}
                  </span>
                  <div
                    className={cn(
                      'flex-1 transition-transform duration-500',
                      isActive && 'md:translate-x-2',
                    )}
                  >
                    <h3 className="font-mono text-base leading-tight font-semibold tracking-tight text-[#1a1a1a] uppercase md:text-lg lg:text-xl">
                      {d.title}
                    </h3>
                    <p
                      className={cn(
                        'mt-1 font-mono text-[11px] tracking-wider uppercase transition-colors duration-300',
                        isActive ? 'text-[#1a1a1a]/80' : 'text-[#1a1a1a]/50',
                      )}
                    >
                      {d.sub}
                    </p>
                  </div>
                  <BrandArrow
                    className={cn(
                      'pointer-events-none hidden h-[0.9em] text-[#1a1a1a] transition-all duration-500 md:block',
                      isActive ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0',
                    )}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </ActStage>
  );
};
