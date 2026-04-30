// ═══════════════════════════════════════════════════
// Reversal — acte 4, MÉTHODE & ÉQUIPE (Granyon breathing, layouts différents)
//
// WHAT: Two stacked sub-acts but each with its own layout language.
//       (a) Méthode — 4 steps presented as a horizontal flow on
//           desktop with progress hairlines between them, vertical
//           on mobile. Each step = number + verb + body. The whole
//           thing reads like a mechanism, not a checklist.
//       (b) Équipe — asymetric split per founder : full-width name
//           in massive Geist light, role tag on the right, body
//           paragraph indented. No grid, no cards. Pure typographic
//           hierarchy. Founders alternate left/right anchors.
// WHEN: After Stillness. The how + the who behind it.
// ═══════════════════════════════════════════════════

import { ActStage } from '@components/orchestration/ActStage';
import { TechFrame } from '@components/orchestration/TechFrame';
import { cn } from '@utils/cn';

const STEPS = [
  { id: '01', verb: 'Une demande.', body: 'Vous formulez une intention, même imprécise.' },
  {
    id: '02',
    verb: 'Une structuration.',
    body: 'Nous transformons la demande en cadre opérationnel.',
  },
  {
    id: '03',
    verb: 'Une proposition.',
    body: 'Une réponse construite, sans intermédiaire financier.',
  },
  { id: '04', verb: 'Une exécution.', body: 'Discrétion absolue. Réseau international mobilisé.' },
];

const FOUNDERS = [
  {
    name: 'Salvatore Montemagno',
    role: 'Fondateur',
    body: '20 ans d’expérience dans le luxe, la distribution et la gestion de relations avec une clientèle HNWI et UHNW.',
  },
  {
    name: 'Bokar Guissé',
    role: 'Co-fondateur',
    body: 'Agent de joueurs de football de premier plan au niveau européen, avec accès à des cercles internationaux exigeants.',
  },
  {
    name: 'Harry Novillo',
    role: 'Co-fondateur',
    body: 'Ancien sportif professionnel de haut niveau, impliqué dans des projets entrepreneuriaux et environnements premium.',
  },
];

export const Reversal = () => (
  <ActStage name="Reversal" tall={1} sticky={false}>
    <div className="relative w-full">
      <TechFrame index="004" label="MÉTHODE & ÉQUIPE" />

      {/* (a) Méthode — horizontal flow on desktop, vertical on mobile */}
      <section className="px-6 pt-32 pb-32 md:px-12 md:pt-48 md:pb-40">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-24 grid gap-8 md:grid-cols-12 md:gap-16">
            <p className="col-span-12 font-mono text-[10px] font-semibold tracking-[0.5em] text-[#1a1a1a]/50 uppercase md:col-span-3 md:pt-3">
              <span className="text-[#1a1a1a]/30">04 / </span>
              MÉTHODE
            </p>
            <h2
              className="col-span-12 font-light tracking-tight text-[#1a1a1a] md:col-span-9"
              style={{ fontSize: 'clamp(1.75rem, 3.6vw, 3rem)', lineHeight: '1.1' }}
            >
              Un fonctionnement simple,
              <br />
              répété sans concession.
            </h2>
          </div>

          <ol className="grid gap-12 md:grid-cols-4 md:gap-8">
            {STEPS.map((s, i) => (
              <li key={s.id} className="relative flex flex-col gap-4 md:gap-6">
                {/* Hairline above with number floating */}
                <div className="flex items-center gap-3 border-t border-[#1a1a1a]/30 pt-4">
                  <span className="font-mono text-[10px] font-semibold tracking-[0.4em] text-[#1a1a1a]/60 uppercase">
                    {s.id}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="hidden h-px flex-1 bg-[#1a1a1a]/15 md:block"
                    />
                  )}
                </div>
                <h3
                  className="font-light tracking-tight text-[#1a1a1a]"
                  style={{ fontSize: 'clamp(1.35rem, 2vw, 1.75rem)', lineHeight: '1.15' }}
                >
                  {s.verb}
                </h3>
                <p className="text-base leading-relaxed text-[#1a1a1a]/70">{s.body}</p>
              </li>
            ))}
          </ol>

          <p className="mt-20 max-w-md font-mono text-[11px] leading-relaxed tracking-wider text-[#1a1a1a]/45 uppercase">
            SAW Next agit comme facilitateur. Jamais comme intermédiaire financier.
          </p>
        </div>
      </section>

      {/* Hairline transition */}
      <div className="mx-auto h-px w-full max-w-6xl bg-[#1a1a1a]/10" />

      {/* (b) Équipe — asymetric split per founder, no cards */}
      <section className="px-6 pt-32 pb-40 md:px-12 md:pt-48 md:pb-56">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-24 grid gap-8 md:grid-cols-12 md:gap-16">
            <p className="col-span-12 font-mono text-[10px] font-semibold tracking-[0.5em] text-[#1a1a1a]/50 uppercase md:col-span-3 md:pt-3">
              <span className="text-[#1a1a1a]/30">04.B / </span>
              ÉQUIPE
            </p>
            <h2
              className="col-span-12 max-w-3xl font-light tracking-tight text-[#1a1a1a] md:col-span-9"
              style={{ fontSize: 'clamp(1.75rem, 3.6vw, 3rem)', lineHeight: '1.1' }}
            >
              Une structure agile, discrète, crédible — issue du luxe, du sport professionnel et de
              la relation client haut de gamme.
            </h2>
          </div>

          <ul className="flex flex-col gap-24 md:gap-32">
            {FOUNDERS.map((f, i) => (
              <li
                key={f.name}
                className={cn('flex flex-col gap-6 md:gap-10', i % 2 === 1 && 'md:ml-[20%]')}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-[#1a1a1a]/15 pt-6">
                  <h3
                    className="font-light tracking-tight text-[#1a1a1a]"
                    style={{ fontSize: 'clamp(1.75rem, 4vw, 3.25rem)', lineHeight: '1.05' }}
                  >
                    {f.name}.
                  </h3>
                  <span className="font-mono text-[10px] font-semibold tracking-[0.4em] text-[#1a1a1a]/55 uppercase">
                    {f.role}
                  </span>
                </div>
                <p className="max-w-2xl text-lg leading-relaxed text-[#1a1a1a]/70 md:text-xl">
                  {f.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  </ActStage>
);
