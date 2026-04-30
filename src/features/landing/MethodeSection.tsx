// ═══════════════════════════════════════════════════
// MethodeSection — accentuated step-by-step + CTA at the bottom
//
// WHAT: 4 vertical numbered steps, BIG monumental indices (clamp
//       4rem→8rem) chained by a vertical hairline + small dot
//       between each. CTA "Démarrer une demande" at the bottom.
//       Layout differs from Equipe (which is 2-col édito + list).
// ═══════════════════════════════════════════════════

import { SectionHeader } from '@components/layout/SectionHeader';
import { WipeButton } from '@components/ui/WipeButton';

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

export const MethodeSection = () => (
  <section id="methode" className="border-border relative w-full border-b py-20 md:py-28">
    <div className="mx-auto w-full max-w-400 px-5 md:px-6">
      <SectionHeader
        index="04"
        label="MÉTHODE"
        title={
          <>
            Un fonctionnement simple,
            <br />
            répété sans concession.
          </>
        }
      />

      {/* Vertical timeline — big indices, hairline + dot between steps */}
      <ol className="border-fg/15 border-t">
        {STEPS.map((s, i) => (
          <li
            key={s.id}
            className="border-fg/15 group relative grid grid-cols-[5rem_1fr] items-baseline gap-6 border-b py-10 md:grid-cols-[10rem_1fr] md:gap-12 md:py-16"
          >
            {/* Big index */}
            <span
              className="text-fg font-mono leading-none font-semibold tracking-tight tabular-nums"
              style={{ fontSize: 'clamp(3rem, 6vw, 6.5rem)' }}
            >
              {s.id}
            </span>

            {/* Verb + body */}
            <div className="flex flex-col gap-3">
              <h3 className="text-fg font-mono text-lg leading-tight font-semibold tracking-tight uppercase md:text-2xl">
                {s.verb}
              </h3>
              <p className="text-muted max-w-2xl text-base leading-relaxed md:text-lg">{s.body}</p>
            </div>

            {/* Connector dot at the bottom of each step except the last */}
            {i < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className="bg-fg absolute bottom-0 left-10 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full md:left-20"
              />
            )}
          </li>
        ))}
      </ol>

      {/* Mention legale + CTA */}
      <div className="mt-16 flex flex-col items-start justify-between gap-8 md:mt-20 md:flex-row md:items-end">
        <p className="text-muted max-w-md font-mono text-[11px] leading-relaxed tracking-[0.2em] uppercase">
          SAW Next agit comme facilitateur. Jamais comme intermédiaire financier.
        </p>
        <WipeButton href="#contact" variant="solid">
          Démarrer une demande
        </WipeButton>
      </div>
    </div>
  </section>
);
