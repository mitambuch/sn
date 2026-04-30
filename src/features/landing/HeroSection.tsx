// ═══════════════════════════════════════════════════
// HeroSection — landing opening (GAFHA-rigorous grid)
//
// WHAT: Container max-w-400 + px-5/md:px-6 (rigorous grid, same as
//       every other section). Top metadata strip · accroche éditoriale
//       (Geist sans light) · 2 WipeButtons (solid PRENDRE CONTACT +
//       ghost DÉCOUVRIR LA STRUCTURE) · pillars in a bottom strip.
//       No Wordmark — it lives in the Loader.
// WHEN: First section of pages/Home.tsx, anchored at #hero.
// ═══════════════════════════════════════════════════

import { WipeButton } from '@components/ui/WipeButton';

const SUB_MARK = 'BESPOKE CLIENT SERVICES PLATFORM';
const PILLARS = ['SUISSE', 'INDÉPENDANT', 'BESPOKE'];

export const HeroSection = () => (
  <section
    id="hero"
    className="border-border relative w-full border-b pt-32 pb-24 md:pt-44 md:pb-32"
  >
    <div className="mx-auto w-full max-w-400 px-5 md:px-6">
      {/* Top meta strip */}
      <div className="text-muted mb-12 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] font-semibold tracking-[0.4em] uppercase md:mb-16">
        <span>{SUB_MARK}</span>
        <span className="hidden md:inline">CONCIERGERIE PRIVÉE — GENÈVE</span>
      </div>

      {/* Accroche editorial — Geist sans light, NOT mono */}
      <h1
        className="text-fg max-w-5xl font-light tracking-[-0.02em]"
        style={{ fontSize: 'clamp(1.85rem, 4vw, 4rem)', lineHeight: '1.05' }}
      >
        Le véritable luxe ne se mesure pas
        <br className="hidden md:inline" /> uniquement à ce que l’on possède,
        <br />
        <span className="text-fg">mais à ce que l’on vit.</span>
      </h1>

      {/* CTAs */}
      <div className="mt-12 flex flex-wrap items-center gap-3 md:mt-16">
        <WipeButton href="#contact" variant="solid">
          Prendre contact
        </WipeButton>
        <WipeButton href="#positionnement" variant="ghost">
          Découvrir la structure
        </WipeButton>
      </div>

      {/* Pillars bottom strip — 1 hairline */}
      <div className="border-border mt-24 grid grid-cols-1 gap-3 border-t pt-8 md:mt-32 md:grid-cols-3 md:gap-8">
        {PILLARS.map((p, i) => (
          <span
            key={p}
            className="text-fg flex items-baseline gap-4 font-mono text-xs font-semibold tracking-[0.5em] uppercase md:text-sm"
          >
            <span className="text-muted tabular-nums">0{i + 1}</span>
            <span>{p}</span>
          </span>
        ))}
      </div>
    </div>
  </section>
);
