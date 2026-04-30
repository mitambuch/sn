// ═══════════════════════════════════════════════════
// DomainsTicker — the six expertises as a magnetic, hover-aware list
//
// WHAT: Renders the SAW Next domains (events, voyages, encounters,
//       horology, real estate, lifestyle) as numbered rows in a
//       Geist Mono table. On hover (desktop) the whole row magnifies
//       softly and the separator → morphs into the brand ↗.
//       On mobile they stack vertically with a tap-active state.
// WHEN: Section after <EspritSaw />, before <CinematicManifesto />.
//       The list anchors the breadth of the offer without exposing
//       a dedicated sub-page per domain (HNW conversations stay
//       central, not catalogue-style discovery).
// CHANGE COPY: src/locales/fr.json + en.json — never inline.
// CHANGE LIST: DOMAINS array below.
// ═══════════════════════════════════════════════════

import { MaskedReveal } from '@components/ui/MaskedReveal';
import { cn } from '@utils/cn';
import { useState } from 'react';

interface DomainRow {
  index: string;
  title: string;
  whisper: string;
}

const DOMAINS: DomainRow[] = [
  {
    index: '01',
    title: 'Événements sportifs et culturels',
    whisper: 'Monaco · Wimbledon · Cannes',
  },
  { index: '02', title: 'Voyages et expériences sur mesure', whisper: 'Itinéraires confidentiels' },
  { index: '03', title: 'Rencontres exclusives', whisper: 'Salons fermés · Cercles privés' },
  {
    index: '04',
    title: 'Horlogerie et objets de collection',
    whisper: 'Pièces rares · Maisons indépendantes',
  },
  { index: '05', title: 'Immobilier et opportunités off-market', whisper: 'Biens jamais publiés' },
  {
    index: '06',
    title: 'Lifestyle management et conciergerie',
    whisper: 'Au quotidien · Sans relâche',
  },
];

interface DomainsTickerProps {
  id?: string;
}

export const DomainsTicker = ({ id = 'domaines' }: DomainsTickerProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id={id} className="border-fg/10 relative w-full border-y px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12 md:gap-16">
        <div className="text-fg/50 col-span-12 font-mono text-[10px] tracking-[0.4em] uppercase md:col-span-3">
          <span className="text-fg/30">03 / </span>
          <span>Domaines</span>
        </div>

        <div className="col-span-12 md:col-span-9">
          <MaskedReveal>
            <h2 className="text-fg font-mono text-2xl leading-[1.05] tracking-tight uppercase md:text-4xl">
              La société accompagne ses clients
              <br />
              dans <span className="text-fg/60">{DOMAINS.length}</span> univers de haute exigence.
            </h2>
          </MaskedReveal>

          <ul
            onMouseLeave={() => setHovered(null)}
            className="mt-12 flex flex-col"
            aria-label="Domaines d’expertise SAW Next"
          >
            {DOMAINS.map((row, i) => {
              const isActive = hovered === i;
              const isDimmed = hovered !== null && hovered !== i;
              return (
                <li
                  key={row.index}
                  onMouseEnter={() => setHovered(i)}
                  className={cn(
                    'border-fg/10 group relative flex flex-col gap-1 border-t py-5 transition-all duration-500 md:flex-row md:items-baseline md:justify-between md:gap-6 md:py-6',
                    isDimmed && 'opacity-40',
                    isActive && 'opacity-100',
                    i === DOMAINS.length - 1 && 'border-b',
                  )}
                >
                  {/* Index */}
                  <span
                    className={cn(
                      'text-fg/50 font-mono text-[10px] tracking-[0.4em] transition-colors duration-300 md:w-12',
                      isActive && 'text-fg',
                    )}
                  >
                    {row.index}
                  </span>

                  {/* Title */}
                  <span
                    className={cn(
                      'text-fg flex-1 font-mono text-lg leading-tight tracking-tight uppercase transition-transform duration-500 md:text-2xl lg:text-3xl',
                      isActive && 'md:translate-x-2',
                    )}
                  >
                    {row.title}
                  </span>

                  {/* Whisper */}
                  <span
                    className={cn(
                      'text-fg/45 font-mono text-[10px] tracking-[0.3em] uppercase transition-all duration-500 md:text-right',
                      isActive ? 'text-fg/80' : 'text-fg/45',
                    )}
                  >
                    {row.whisper}
                  </span>

                  {/* Brand arrow — appears at the very right on hover */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'text-fg pointer-events-none absolute top-1/2 right-0 hidden -translate-y-1/2 font-mono text-2xl transition-all duration-500 md:block',
                      isActive ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0',
                    )}
                  >
                    ↗
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="text-muted mt-10 max-w-md font-mono text-[11px] leading-relaxed tracking-wider uppercase">
            Chaque domaine repose sur un réseau bâti depuis quinze ans. Aucun partenariat affiché
            publiquement.
          </p>
        </div>
      </div>
    </section>
  );
};
