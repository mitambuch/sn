// ═══════════════════════════════════════════════════
// HeroSection — full viewport (min-h-screen), tight composition
//
// WHAT: 100vh hero. Top meta (3 tokens) anchored top-left + top-right
//       on the same row, no floating. Centered accroche in Geist Mono
//       Semibold UPPERCASE. CTAs just below the accroche. Pillars
//       row at the very bottom of the viewport. Everything tied to
//       the same Container grid so nothing floats.
// WHEN: First section of pages/Home.tsx, anchored at #hero.
// ═══════════════════════════════════════════════════

import { WipeButton } from '@components/ui/WipeButton';

const PILLARS = ['SUISSE', 'INDÉPENDANT', 'BESPOKE'];

export const HeroSection = () => (
  <section
    id="hero"
    className="border-border relative flex w-full flex-col border-b"
    style={{ minHeight: '100vh' }}
  >
    <div className="mx-auto flex w-full max-w-400 flex-1 flex-col px-5 pt-32 pb-10 md:px-6 md:pt-36 md:pb-12">
      {/* Top meta — anchored row, not floating */}
      <div className="text-muted flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
        <span>BESPOKE CLIENT SERVICES PLATFORM</span>
        <span className="hidden md:inline">CONCIERGERIE PRIVÉE — SUISSE</span>
      </div>

      {/* Centered area — accroche + CTAs */}
      <div className="flex flex-1 flex-col justify-center py-12 md:py-16">
        <h1
          className="text-fg max-w-6xl font-mono font-semibold tracking-tight uppercase"
          style={{ fontSize: 'clamp(1.5rem, 3.4vw, 3.5rem)', lineHeight: '1.08' }}
        >
          Le véritable luxe ne se mesure pas
          <br />
          uniquement à ce que l’on possède,
          <br />
          mais à ce que l’on vit.
        </h1>

        <div className="mt-12 flex flex-wrap items-center gap-3 md:mt-16">
          <WipeButton href="#contact" variant="solid">
            Prendre contact
          </WipeButton>
          <WipeButton href="#positionnement" variant="ghost">
            Découvrir la structure
          </WipeButton>
        </div>
      </div>

      {/* Pillars row — anchored bottom of viewport */}
      <div className="border-fg/15 grid grid-cols-1 gap-3 border-t pt-6 md:grid-cols-3 md:gap-8 md:pt-8">
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
