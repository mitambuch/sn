// ═══════════════════════════════════════════════════
// MethodeSection — horizontal timeline (different layout from Équipe)
//
// WHAT: 4 steps presented as a horizontal numbered timeline. Big
//       index numbers (clamp 3-5rem) with hairlines between them.
//       Verb mono uppercase + body sans below. NOT cards — this
//       differentiates from EquipeSection (cards).
// ═══════════════════════════════════════════════════

import { SectionHeader } from '@components/layout/SectionHeader';
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

      <ol className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
        {STEPS.map((s, i) => (
          <li key={s.id} className="flex flex-col gap-5">
            {/* Big index + hairline connector */}
            <div className="flex items-center gap-4">
              <span
                className="text-fg font-mono leading-none font-semibold tracking-tight tabular-nums"
                style={{ fontSize: 'clamp(2.5rem, 4vw, 3.75rem)' }}
              >
                {s.id}
              </span>
              {i < STEPS.length - 1 && (
                <span aria-hidden="true" className="bg-fg/30 hidden h-px flex-1 md:block" />
              )}
            </div>
            <h3 className="text-fg font-mono text-base leading-tight font-semibold tracking-tight uppercase md:text-lg">
              {s.verb}
            </h3>
            <p className={cn('text-muted text-base leading-relaxed')}>{s.body}</p>
          </li>
        ))}
      </ol>

      <p className="text-muted mt-16 max-w-md font-mono text-[11px] leading-relaxed tracking-[0.2em] uppercase">
        SAW Next agit comme facilitateur. Jamais comme intermédiaire financier.
      </p>
    </div>
  </section>
);
