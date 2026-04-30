// ═══════════════════════════════════════════════════
// HeroSection — landing opening (sans Wordmark : il vit dans le Loader)
//
// WHAT: Opening of the home AFTER the loader has delivered the brand.
//       Sub-mark + editorial accroche + primary CONTACTER CTA + the
//       three brand pillars in a bottom strip. The Wordmark itself
//       is intentionally absent here — its place was the Loader.
// WHEN: First section of pages/Home.tsx, anchored at #hero.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { BrandArrow } from '@components/ui/BrandArrow';
import { MagneticButton } from '@components/ui/MagneticButton';

const SUB_MARK = 'BESPOKE CLIENT SERVICES PLATFORM';
const ACCROCHE_LEAD = 'Le véritable luxe ne se mesure pas uniquement à ce que l’on possède,';
const ACCROCHE_BANG = 'mais à ce que l’on vit.';
const PILLARS = ['SUISSE', 'INDÉPENDANT', 'BESPOKE'];

export const HeroSection = () => (
  <section id="hero" className="relative w-full pt-40 pb-24 md:pt-56 md:pb-32 lg:pt-64">
    <Container size="2k">
      <div className="grid gap-10 md:grid-cols-12 md:gap-16">
        {/* Left — sub-mark vertical anchor */}
        <p className="text-fg/55 col-span-12 font-mono text-xs font-semibold tracking-[0.5em] uppercase md:col-span-4 md:pt-3">
          {SUB_MARK}
        </p>

        {/* Right — editorial accroche + CTA */}
        <div className="col-span-12 max-w-4xl md:col-span-8">
          <p
            className="text-fg/85 font-light tracking-tight"
            style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.75rem)', lineHeight: '1.2' }}
          >
            {ACCROCHE_LEAD}
          </p>
          <p
            className="text-fg mt-2 font-light tracking-tight"
            style={{ fontSize: 'clamp(1.875rem, 4vw, 4rem)', lineHeight: '1.05' }}
          >
            {ACCROCHE_BANG}
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <MagneticButton strength={0.3} range={140}>
              <a
                href="#contact"
                className="border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-fg/30 inline-flex items-center gap-3 rounded-full border px-6 py-3.5 font-mono text-[11px] font-semibold tracking-[0.35em] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <span>PRENDRE CONTACT</span>
                <BrandArrow className="h-[0.9em]" />
              </a>
            </MagneticButton>
            <a
              href="#positionnement"
              className="text-fg/60 hover:text-fg font-mono text-[10px] font-semibold tracking-[0.4em] uppercase transition-colors duration-200"
            >
              DÉCOUVRIR LA STRUCTURE ↓
            </a>
          </div>
        </div>
      </div>

      {/* Pillars bottom strip — 1 hairline only */}
      <div className="border-fg/15 mt-32 flex flex-col gap-6 border-t pt-8 md:mt-40 md:flex-row md:items-center md:justify-between md:gap-8">
        {PILLARS.map((p, i) => (
          <span
            key={p}
            className="text-fg flex items-center gap-4 font-mono text-xs font-semibold tracking-[0.5em] uppercase md:text-sm"
          >
            <span className="text-fg/30">0{i + 1}</span>
            <span>{p}</span>
          </span>
        ))}
      </div>
    </Container>
  </section>
);
