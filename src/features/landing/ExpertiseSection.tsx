// ═══════════════════════════════════════════════════
// ExpertiseSection — GAFHA grid + uniform header + clean rows
// ═══════════════════════════════════════════════════

import { SectionHeader } from '@components/layout/SectionHeader';
import { cn } from '@utils/cn';
import { ArrowUpRight } from 'lucide-react';
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
    <section id="expertise" className="border-border relative w-full border-b py-20 md:py-28">
      <div className="mx-auto w-full max-w-400 px-5 md:px-6">
        <SectionHeader
          index="03"
          label="EXPERTISE"
          title={
            <>
              Un spectre
              <br />
              volontairement large.
            </>
          }
        />

        <ol
          onMouseLeave={() => setHovered(null)}
          className="border-border grid grid-cols-1 gap-x-12 border-t md:grid-cols-2"
        >
          {DOMAINS.map(d => {
            const isActive = hovered === d.id;
            const isDimmed = hovered !== null && !isActive;
            return (
              <li
                key={d.id}
                onMouseEnter={() => setHovered(d.id)}
                className={cn(
                  'border-border group grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b py-6 transition-opacity duration-300 md:grid-cols-[4rem_1fr_auto] md:gap-6 md:py-7',
                  isDimmed && 'opacity-40',
                )}
              >
                <span className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase tabular-nums">
                  {d.id}
                </span>
                <div className="min-w-0">
                  <h3 className="text-fg truncate font-mono text-base leading-tight font-semibold tracking-tight uppercase md:text-lg">
                    {d.title}.
                  </h3>
                  <p className="text-muted mt-1 truncate font-mono text-[11px] tracking-[0.2em] uppercase">
                    {d.sub}
                  </p>
                </div>
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className={cn(
                    'text-fg pointer-events-none transition-all duration-300',
                    isActive ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-30',
                  )}
                />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
