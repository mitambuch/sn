// ═══════════════════════════════════════════════════
// MethodeSection — GAFHA grid + 4-step horizontal flow + cards
// ═══════════════════════════════════════════════════

import { SectionHeader } from '@components/layout/SectionHeader';

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

      <ol className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {STEPS.map(s => (
          <li key={s.id} className="bg-surface flex h-full flex-col gap-4 rounded-md p-6 md:p-8">
            <span className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase tabular-nums">
              {s.id}
            </span>
            <h3 className="text-fg font-mono text-base leading-tight font-semibold tracking-tight uppercase md:text-lg">
              {s.verb}
            </h3>
            <p className="text-muted text-base leading-relaxed">{s.body}</p>
          </li>
        ))}
      </ol>

      <p className="text-muted mt-12 max-w-md font-mono text-[11px] leading-relaxed tracking-[0.2em] uppercase">
        SAW Next agit comme facilitateur. Jamais comme intermédiaire financier.
      </p>
    </div>
  </section>
);
