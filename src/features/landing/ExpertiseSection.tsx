import { SectionHeader } from '@components/layout/SectionHeader';
import { ArrowUpRight } from 'lucide-react';

interface Domain {
  id: string;
  title: string;
  sub: string;
}

const INTRO =
  'SAW Next est avant tout une conciergerie. La diversité des domaines couverts repose sur l’expérience accumulée par l’équipe, sur un réseau international travaillé dans la durée et sur des partenaires sélectionnés au cas par cas — jamais sur un catalogue.';

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

export const ExpertiseSection = () => (
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

      <p className="text-fg -mt-6 mb-12 max-w-3xl text-base leading-relaxed md:-mt-8 md:mb-16 md:text-lg">
        {INTRO}
      </p>

      <ol className="border-fg/15 grid grid-cols-1 border-t md:grid-cols-2 md:gap-x-12">
        {DOMAINS.map(d => (
          <li
            key={d.id}
            className="border-fg/15 group grid grid-cols-[3.25rem_1fr_auto] items-start gap-4 border-b py-6 md:py-7"
          >
            <span className="text-fg pt-1 font-mono text-[10px] font-semibold tracking-[0.4em] uppercase tabular-nums">
              {d.id}
            </span>
            <div className="min-w-0">
              <h3 className="text-fg font-mono text-lg leading-tight font-semibold tracking-tight uppercase">
                {d.title}.
              </h3>
              <p className="text-fg mt-2 font-mono text-[11px] leading-relaxed tracking-[0.2em] uppercase">
                {d.sub}
              </p>
            </div>
            <ArrowUpRight
              size={20}
              strokeWidth={1.5}
              aria-hidden="true"
              className="text-fg mt-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </li>
        ))}
      </ol>
    </div>
  </section>
);
