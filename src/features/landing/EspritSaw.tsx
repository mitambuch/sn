// ═══════════════════════════════════════════════════
// EspritSaw — second act, the editorial stance of the brand
//
// WHAT: Mid-page section that mirrors the PDF's "L'Esprit SAW Next"
//       page. Big monospace title, three short paragraphs, and three
//       inline KeyTerm chips that pop a definition on hover (desktop)
//       or tap (mobile).
// WHEN: Right after <HeroImmersive />, before <DomainsTicker />.
// CHANGE COPY: src/locales/fr.json + en.json under landing.esprit.*.
// CHANGE TERM DEFINITIONS: TERMS array below.
// ═══════════════════════════════════════════════════

import { MaskedReveal } from '@components/ui/MaskedReveal';
import { cn } from '@utils/cn';
import type { ReactNode } from 'react';
import { useState } from 'react';

const TERMS: Record<string, string> = {
  authentique: 'aucune mise en scène — l’expérience telle qu’elle existe pour les initiés.',
  humaine: 'un interlocuteur unique, joignable, qui connaît votre dossier.',
  mémorable: 'pensé pour rester avec vous longtemps après l’événement.',
};

interface KeyTermProps {
  term: keyof typeof TERMS;
  children: ReactNode;
}

const KeyTerm = ({ term, children }: KeyTermProps) => {
  const [open, setOpen] = useState(false);
  const definition = TERMS[term];

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(prev => !prev)}
        className={cn(
          'border-fg/30 hover:border-fg focus-visible:border-fg group relative inline-flex items-baseline gap-1 border-b border-dashed pb-0.5 font-mono text-[0.95em] tracking-tight uppercase transition-colors duration-300 focus-visible:outline-none',
          open && 'border-fg',
        )}
        aria-expanded={open}
      >
        <span aria-hidden="true" className="text-fg/40 text-[0.7em]">
          [
        </span>
        <span>{children}</span>
        <span aria-hidden="true" className="text-fg/40 text-[0.7em]">
          ]
        </span>
      </button>
      <span
        role="tooltip"
        className={cn(
          'border-fg/15 bg-bg text-muted pointer-events-none absolute top-full left-0 z-20 mt-2 w-72 max-w-[80vw] border p-3 font-mono text-[10px] leading-relaxed tracking-wider uppercase transition-all duration-300',
          open ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0',
        )}
      >
        <span className="text-fg/40 mr-2">{`/* ${String(term)} */`}</span>
        <span>{definition}</span>
      </span>
    </span>
  );
};

interface EspritSawProps {
  id?: string;
}

export const EspritSaw = ({ id = 'esprit' }: EspritSawProps) => {
  return (
    <section id={id} className="relative w-full px-6 py-24 md:px-12 md:py-32 lg:py-40">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12 md:gap-16">
        {/* Section index — Geist Mono, mimics PDF page numbering */}
        <div className="text-fg/50 col-span-12 font-mono text-[10px] tracking-[0.4em] uppercase md:col-span-3">
          <span className="text-fg/30">02 / </span>
          <span>L&apos;esprit</span>
        </div>

        <div className="col-span-12 md:col-span-9">
          <MaskedReveal>
            <h2 className="text-fg font-mono text-3xl leading-[0.95] tracking-tight uppercase md:text-5xl lg:text-6xl">
              L&apos;esprit
              <br />
              SAW<span className="text-fg/60">↗</span>NEXT
            </h2>
          </MaskedReveal>

          <div className="text-fg/85 mt-12 max-w-2xl space-y-6 text-base leading-relaxed md:text-lg">
            <MaskedReveal delay={120}>
              <p>
                Notre objectif reste toujours le même : créer des moments{' '}
                <KeyTerm term="authentique">authentiques</KeyTerm>,{' '}
                <KeyTerm term="humaine">humains</KeyTerm> et{' '}
                <KeyTerm term="mémorable">mémorables</KeyTerm>.
              </p>
            </MaskedReveal>

            <MaskedReveal delay={220}>
              <p>
                Le véritable luxe ne consiste pas seulement à assister à un événement. Il consiste à
                le vivre autrement — depuis les coulisses, avec les bonnes personnes, sans la
                friction qui dilue l&apos;instant.
              </p>
            </MaskedReveal>

            <MaskedReveal delay={320}>
              <p className="text-muted">
                Les expériences présentées ne représentent qu&apos;un aperçu des possibilités.
                Chacune commence par une conversation.
              </p>
            </MaskedReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
