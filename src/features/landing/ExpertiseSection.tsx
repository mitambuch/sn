import { SectionHeader } from '@components/layout/SectionHeader';
import { cn } from '@utils/cn';
import { ArrowUpRight } from 'lucide-react';
import { useMemo, useState } from 'react';

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
  const activeDomain = useMemo(
    () => DOMAINS.find(domain => domain.id === hovered) ?? DOMAINS[0],
    [hovered],
  );

  return (
    <section
      id="expertise"
      className="border-border relative isolate w-full scroll-mt-24 overflow-hidden border-b py-24 md:scroll-mt-28 md:py-32"
    >
      <div className="relative mx-auto w-full max-w-400 px-5 md:px-6">
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <aside className="lg:col-span-4">
            <div className="border-fg/15 bg-fg/[0.035] sticky top-28 overflow-hidden rounded-sm border p-5 md:p-6">
              <div className="relative">
                <p className="text-muted font-mono text-[10px] font-semibold tracking-[0.35em] uppercase">
                  Couverture opérationnelle
                </p>
                <p className="text-fg mt-8 font-mono text-8xl leading-none font-semibold tracking-tight tabular-nums md:text-9xl">
                  10
                </p>
                <p className="text-muted mt-3 max-w-xs text-base leading-relaxed">
                  Domaines activables selon l’intention, la confidentialité requise et le niveau
                  d’exécution attendu.
                </p>

                <div className="border-fg/15 mt-10 border-t pt-5">
                  <p className="text-muted font-mono text-[10px] font-semibold tracking-[0.35em] uppercase">
                    Focus actif
                  </p>
                  <h3 className="text-fg mt-4 font-mono text-xl leading-tight font-semibold tracking-tight uppercase">
                    {activeDomain?.title}.
                  </h3>
                  <p className="text-muted mt-2 font-mono text-[11px] leading-relaxed tracking-[0.18em] uppercase">
                    {activeDomain?.sub}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <ol
            onMouseLeave={() => setHovered(null)}
            className="border-fg/15 lg:col-span-8 lg:border-t"
          >
            {DOMAINS.map(d => {
              const isActive = hovered === d.id;
              const isDimmed = hovered !== null && !isActive;
              return (
                <li
                  key={d.id}
                  onMouseEnter={() => setHovered(d.id)}
                  className={cn(
                    'border-fg/15 group relative grid grid-cols-[3.25rem_1fr_auto] gap-4 overflow-hidden border-t py-6 transition-all duration-300 first:border-t-0 lg:grid-cols-[4.5rem_1fr_auto] lg:border-t-0 lg:border-b lg:px-5 lg:py-7',
                    isActive && 'bg-fg/[0.045]',
                    isDimmed && 'opacity-45',
                  )}
                >
                  <span className="bg-fg absolute top-0 bottom-0 left-0 w-px origin-top scale-y-0 transition-transform duration-500 group-hover:scale-y-100" />
                  <span className="text-muted pt-1 font-mono text-[10px] font-semibold tracking-[0.4em] uppercase tabular-nums">
                    {d.id}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-fg font-mono text-lg leading-tight font-semibold tracking-tight uppercase md:text-2xl">
                      {d.title}.
                    </h3>
                    <p className="text-muted mt-2 font-mono text-[11px] leading-relaxed tracking-[0.2em] uppercase">
                      {d.sub}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={20}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className={cn(
                      'text-fg mt-1 transition-all duration-300',
                      isActive ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-35',
                    )}
                  />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};
