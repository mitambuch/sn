// ═══════════════════════════════════════════════════
// HeroSection — Geist Mono accroche, GAFHA grid, corporate buttons
//
// WHAT: Container max-w-400 px-5/6. Top metadata strip · accroche in
//       Geist Mono Semibold UPPERCASE (owner direction) cascading on
//       3 lines · 2 WipeButton (solid Prendre contact + ghost
//       Découvrir la structure, rectangulaires rounded-sm) · pillars
//       in a bottom strip with tabular-nums.
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
      <div className="text-muted mb-16 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] font-semibold tracking-[0.4em] uppercase md:mb-20">
        <span>{SUB_MARK}</span>
        <span className="hidden md:inline">CONCIERGERIE PRIVÉE — GENÈVE</span>
      </div>

      {/* Accroche — Geist Mono Semibold UPPERCASE, 3 lines */}
      <h1
        className="text-fg max-w-6xl font-mono font-semibold tracking-tight uppercase"
        style={{ fontSize: 'clamp(1.5rem, 3.4vw, 3.5rem)', lineHeight: '1.1' }}
      >
        Le véritable luxe ne se mesure pas
        <br />
        uniquement à ce que l’on possède,
        <br />
        mais à ce que l’on vit.
      </h1>

      {/* CTAs — rectangulaires rounded-sm, no rounded-full */}
      <div className="mt-12 flex flex-wrap items-center gap-3 md:mt-16">
        <WipeButton href="#contact" variant="solid">
          Prendre contact
        </WipeButton>
        <WipeButton href="#positionnement" variant="ghost">
          Découvrir la structure
        </WipeButton>
      </div>

      {/* Pillars bottom strip */}
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
