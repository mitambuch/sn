// ═══════════════════════════════════════════════════
// HeroSection — landing opening (full-bleed, 2560px-aware)
//
// WHAT: Wordmark monumental top-left, sub-mark + accroche éditoriale,
//       three pillars in a bottom strip, primary CONTACTER CTA. Sized
//       to dominate ultra-wide screens (max-w 2560px). Full light
//       surface, charcoal text, FilmGrain visible behind via the
//       LandingLayout fixed layer.
// WHEN: First section of pages/Home.tsx, anchored at #hero.
// EDIT COPY: SUB_MARK / ACCROCHE / PILLARS constants below.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { BrandArrow } from '@components/ui/BrandArrow';
import { MagneticButton } from '@components/ui/MagneticButton';
import { Wordmark } from '@components/ui/Wordmark';

const SUB_MARK = 'BESPOKE CLIENT SERVICES PLATFORM';
const ACCROCHE_LEAD = 'Le véritable luxe ne se mesure pas uniquement à ce que l’on possède,';
const ACCROCHE_BANG = 'mais à ce que l’on vit.';
const PILLARS = ['SUISSE', 'INDÉPENDANT', 'BESPOKE'];

export const HeroSection = () => (
  <section id="hero" className="relative w-full pt-32 pb-24 md:pt-48 md:pb-32 lg:pt-56">
    <Container size="2k">
      {/* Top metadata */}
      <div className="text-fg/55 mb-12 flex items-center justify-between font-mono text-[10px] font-semibold tracking-[0.4em] uppercase md:mb-16">
        <span>VOL. 01 · 2026</span>
        <span className="hidden md:inline">CONCIERGERIE PRIVÉE — GENÈVE</span>
      </div>

      {/* Wordmark monumental — capped to a sane max so it doesn't become
          a highway billboard on 4K screens. ~1100px on desktop is already
          imposing without going absurd. */}
      <div className="w-full max-w-[min(90vw,1200px)]">
        <Wordmark className="text-fg w-full" />
      </div>

      {/* Sub-mark + accroche editorial */}
      <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-12 md:gap-16">
        <p className="text-fg/65 col-span-12 font-mono text-xs font-semibold tracking-[0.5em] uppercase md:col-span-4 md:pt-3">
          {SUB_MARK}
        </p>
        <div className="col-span-12 max-w-4xl md:col-span-8">
          <p
            className="text-fg/85 font-light tracking-tight"
            style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2.5rem)', lineHeight: '1.25' }}
          >
            {ACCROCHE_LEAD}
          </p>
          <p
            className="text-fg mt-2 font-light tracking-tight"
            style={{ fontSize: 'clamp(1.75rem, 3.6vw, 3.5rem)', lineHeight: '1.1' }}
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

      {/* Pillars bottom strip */}
      <div className="border-fg/15 mt-24 flex flex-col gap-6 border-t pt-8 md:mt-32 md:flex-row md:items-center md:justify-between md:gap-8">
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
