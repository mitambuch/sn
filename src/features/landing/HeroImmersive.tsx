// ═══════════════════════════════════════════════════
// HeroImmersive — opening act of the SAW Next landing
//
// WHAT: Full-bleed section, min-h-screen. Animated grain canvas
//       backdrop, top metadata strip, massive Wordmark reveal,
//       monospace tagline, and a magnetic "découvrir" cue at the
//       bottom that nudges the user into scrolling.
// WHEN: First section of the landing one-pager. Single instance.
// CHANGE THE TAGLINE: edit src/locales/fr.json + en.json under
//                     landing.hero.* — never inline.
// CHANGE THE GRAIN: prop on <GrainCanvas /> below (intensity, gridPx).
// ═══════════════════════════════════════════════════

import { GrainCanvas } from '@components/ui/GrainCanvas';
import { Logomark } from '@components/ui/Logomark';
import { MagneticButton } from '@components/ui/MagneticButton';
import { MaskedReveal } from '@components/ui/MaskedReveal';
import { Wordmark } from '@components/ui/Wordmark';

interface HeroImmersiveProps {
  /** Section id for in-page navigation (smooth-scroll target from sibling sections). */
  id?: string;
}

export const HeroImmersive = ({ id = 'hero' }: HeroImmersiveProps) => {
  return (
    <section id={id} className="relative flex min-h-screen w-full flex-col overflow-hidden">
      {/* Living grain backdrop — decorative, aria-hidden inside */}
      <GrainCanvas intensity={0.7} gridPx={6} tint="#1a1a1a" />

      {/* Top metadata strip — Geist Mono, ultra-discreet */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-6 md:px-12 md:pt-10">
        <Logomark className="text-fg h-6 w-auto md:h-7" />
        <div className="text-fg/70 hidden font-mono text-[10px] tracking-[0.4em] uppercase md:flex md:flex-col md:items-end md:gap-1">
          <span>Conciergerie privée</span>
          <span>Genève · Avril 2026</span>
        </div>
        <div className="text-fg/70 font-mono text-[10px] tracking-[0.3em] uppercase md:hidden">
          Genève
        </div>
      </header>

      {/* Centered brand reveal */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center md:px-12">
        <MaskedReveal immediate delay={200} className="w-full max-w-5xl">
          <Wordmark className="text-fg w-full" />
        </MaskedReveal>

        <MaskedReveal immediate delay={900}>
          <p className="text-fg/80 mt-10 font-mono text-xs tracking-[0.5em] uppercase md:text-sm">
            Le luxe vécu autrement
          </p>
        </MaskedReveal>

        <MaskedReveal immediate delay={1200}>
          <p className="text-muted mt-6 max-w-xl text-base leading-relaxed text-pretty md:text-lg">
            Conciergerie privée suisse — accès aux événements, voyages et objets d&apos;exception
            qui n&apos;apparaissent pas en vitrine.
          </p>
        </MaskedReveal>
      </div>

      {/* Scroll cue — magnetic, anchors to next section */}
      <div className="relative z-10 flex items-center justify-center pb-10 md:pb-14">
        <MagneticButton strength={0.35} range={140}>
          <a
            href="#esprit"
            className="text-fg/80 hover:text-fg focus-visible:ring-fg/40 group flex flex-col items-center gap-3 rounded-sm px-4 py-2 font-mono text-[10px] tracking-[0.5em] uppercase transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none"
          >
            <span>Découvrir</span>
            <span aria-hidden="true" className="block h-10 w-px overflow-hidden">
              <span className="bg-fg/60 group-hover:bg-fg block h-full w-full origin-top transition-transform duration-700 group-hover:scale-y-110" />
            </span>
          </a>
        </MagneticButton>
      </div>
    </section>
  );
};
