// ═══════════════════════════════════════════════════
// Reversal — acte 4, MÉTHODE & ÉQUIPE (process + crédibilité)
//
// WHAT: Two stacked sub-acts in a single screen :
//       (1) Méthode — 4 vertical steps with connecting hairlines
//           (01 UNE DEMANDE → 04 UNE EXÉCUTION). Each step has an
//           index, a title, a one-line precision.
//       (2) Équipe — 3 founders in mono semibold uppercase, with
//           their qualif visible upfront (no hover gimmick), no
//           photos. Each preceded by `→` index.
// WHEN: After Stillness. The "how it actually works" + the "who is
//       behind it".
// CHANGE COPY: STEPS / FOUNDERS arrays.
// ═══════════════════════════════════════════════════

import { ActStage } from '@components/orchestration/ActStage';
import { TechFrame } from '@components/orchestration/TechFrame';

const STEPS = [
  { id: '01', title: 'UNE DEMANDE', body: 'Vous formulez une intention, même imprécise.' },
  {
    id: '02',
    title: 'UNE STRUCTURATION',
    body: 'Nous transformons la demande en cadre opérationnel.',
  },
  {
    id: '03',
    title: 'UNE PROPOSITION',
    body: 'Une réponse construite, sans intermédiaire financier.',
  },
  { id: '04', title: 'UNE EXÉCUTION', body: 'Discrétion absolue. Réseau international mobilisé.' },
];

const FOUNDERS = [
  {
    id: '→',
    name: 'SALVATORE MONTEMAGNO',
    role: 'FONDATEUR',
    body: '20 ans d’expérience dans le luxe, la distribution et la gestion de relations avec une clientèle HNWI et UHNW.',
  },
  {
    id: '→',
    name: 'BOKAR GUISSÉ',
    role: 'CO-FONDATEUR',
    body: 'Agent de joueurs de football de premier plan au niveau européen, avec accès à des cercles internationaux exigeants.',
  },
  {
    id: '→',
    name: 'HARRY NOVILLO',
    role: 'CO-FONDATEUR',
    body: 'Ancien sportif professionnel de haut niveau, impliqué dans des projets entrepreneuriaux et environnements premium.',
  },
];

export const Reversal = () => (
  <ActStage name="Reversal" tall={1} sticky={false}>
    <div className="relative w-full px-6 py-32 md:px-12 md:py-40">
      <TechFrame index="004" label="MÉTHODE & ÉQUIPE" />

      <div className="mx-auto grid w-full max-w-6xl gap-24 md:gap-32">
        {/* Méthode */}
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <h2 className="col-span-12 font-mono text-2xl leading-tight font-semibold tracking-tight text-[#1a1a1a] uppercase md:col-span-4 md:text-3xl">
            UN FONCTIONNEMENT
            <br />
            SIMPLE.
          </h2>
          <ol className="col-span-12 flex flex-col md:col-span-8">
            {STEPS.map((s, i) => (
              <li
                key={s.id}
                className="relative grid grid-cols-[3rem_1fr] gap-6 border-t border-[#1a1a1a]/15 py-8 last:border-b md:grid-cols-[5rem_1fr]"
              >
                <span className="font-mono text-[10px] font-semibold tracking-[0.4em] text-[#1a1a1a]/50 uppercase">
                  {s.id}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-mono text-lg font-semibold tracking-tight text-[#1a1a1a] uppercase md:text-2xl">
                    {s.title}
                  </h3>
                  <p className="text-base leading-relaxed text-[#1a1a1a]/70 md:text-lg">{s.body}</p>
                </div>
                {/* Connecting line indicator (decorative) */}
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-full left-[1.45rem] block h-0 w-px bg-transparent md:left-[2.4rem]"
                  />
                )}
              </li>
            ))}
            <li className="mt-6 max-w-md font-mono text-[10px] tracking-[0.4em] text-[#1a1a1a]/50 uppercase">
              SAW Next agit comme facilitateur. Jamais comme intermédiaire financier.
            </li>
          </ol>
        </div>

        {/* Équipe */}
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="col-span-12 md:col-span-4">
            <h2 className="font-mono text-2xl leading-tight font-semibold tracking-tight text-[#1a1a1a] uppercase md:text-3xl">
              UNE STRUCTURE
              <br />
              AGILE,
              <br />
              DISCRÈTE,
              <br />
              CRÉDIBLE.
            </h2>
            <p className="mt-8 max-w-xs text-base leading-relaxed text-[#1a1a1a]/70">
              Profils complémentaires issus du luxe, du sport professionnel et de la relation client
              haut de gamme.
            </p>
          </div>
          <ul className="col-span-12 flex flex-col md:col-span-8">
            {FOUNDERS.map(f => (
              <li
                key={f.name}
                className="grid grid-cols-[2rem_1fr] gap-6 border-t border-[#1a1a1a]/15 py-8 last:border-b md:grid-cols-[3rem_1fr] md:gap-10"
              >
                <span className="font-mono text-base font-semibold text-[#1a1a1a]/40">{f.id}</span>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="font-mono text-lg font-semibold tracking-tight text-[#1a1a1a] uppercase md:text-xl">
                      {f.name}
                    </h3>
                    <span className="font-mono text-[10px] tracking-[0.4em] text-[#1a1a1a]/50 uppercase">
                      {f.role}
                    </span>
                  </div>
                  <p className="text-base leading-relaxed text-[#1a1a1a]/75 md:text-lg">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </ActStage>
);
