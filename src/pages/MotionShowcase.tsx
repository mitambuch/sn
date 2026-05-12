// ═══════════════════════════════════════════════════
// MotionShowcase — visual demo of all motion phases shipped tonight
//
// WHAT: Single-page showcase to verify the Phase 1-5 motion stack
//       visually : grain, reveal stagger, magnetic hover, smooth scroll
//       inertia, view-transitions inter-pages (via link back to /logo).
// WHEN: Open /motion (route registered in src/app/routes/index.tsx).
// PURPOSE: owner check + client demo of the "vivant + tech" character.
// ═══════════════════════════════════════════════════

import { BrandMark } from '@components/brand/BrandMark';
import { BrandLink as Link } from '@components/ui/BrandLink';
import { MagneticHover } from '@components/ui/MagneticHover';
import { Reveal } from '@components/ui/Reveal';

const STAGGER_DEMO_ITEMS = [
  { eyebrow: 'A — 01', title: 'PROPRIÉTÉ' },
  { eyebrow: 'B — 02', title: 'GARDE-TEMPS' },
  { eyebrow: 'C — 03', title: 'ART' },
  { eyebrow: 'D — 04', title: 'EXPÉRIENCE' },
  { eyebrow: 'E — 05', title: 'VOYAGE' },
  { eyebrow: 'F — 06', title: 'CONCIERGE' },
];

const MAGNETIC_DEMO = [
  { label: 'IMMOBILIER ↗', strength: 0.18 },
  { label: 'GARDE-TEMPS ↗', strength: 0.22 },
  { label: 'ART ↗', strength: 0.28 },
  { label: 'VOYAGE ↗', strength: 0.35 },
];

// eslint-disable-next-line max-lines-per-function -- showcase page intentionally long
export default function MotionShowcase() {
  return (
    <main className="bg-bg text-fg min-h-screen px-6 py-16 sm:px-12 sm:py-24">
      <div className="mx-auto flex max-w-5xl flex-col gap-32">
        {/* ─── Hero — logo + typography + grain demo ─── */}
        <section className="flex flex-col gap-6">
          <p className="text-muted font-mono text-xs tracking-widest uppercase">
            Motion Showcase · Phase 1-5
          </p>
          <h1 className="font-mono text-4xl leading-none font-bold tracking-tight sm:text-5xl md:text-6xl">
            VIVANT
            <br />+ TECH-PRO
          </h1>
          <p className="text-muted max-w-2xl text-base leading-relaxed text-pretty md:text-lg">
            Cinq couches de mouvement empilées : grain 35mm vivant (regarde le bg), Lenis smooth
            scroll (drag wheel), reveal cascade (continue à scroller), magnétisme curseur (CTAs
            ci-dessous), view-transitions inter-pages (clic un lien).
          </p>
        </section>

        {/* ─── Phase 1 — Tokens (visible already via grain on bg) ─── */}
        <section className="flex flex-col gap-6">
          <p className="text-muted font-mono text-xs tracking-widest uppercase">
            Phase 1 — Motion tokens + grain
          </p>
          <h2 className="text-2xl tracking-tight sm:text-3xl">VOIS LE GRAIN VIVRE</h2>
          <div className="border-border bg-surface rounded-card border p-6">
            <p className="font-mono text-sm leading-relaxed">
              Fond visible derrière ces mots : grain SVG fractalNoise 0.62 baseFrequency, opacity
              0.45, animé en 8 steps (24fps cinema). Mix-blend multiply sur light, screen sur dark.
              Tweak
              <span className="font-bold"> --grain-opacity </span>
              dans src/index.css → tout le site bouge.
            </p>
          </div>
        </section>

        {/* ─── Phase 2 — Lenis smooth scroll ─── */}
        <section className="flex flex-col gap-6">
          <p className="text-muted font-mono text-xs tracking-widest uppercase">
            Phase 2 — Lenis smooth scroll
          </p>
          <h2 className="text-2xl tracking-tight sm:text-3xl">DRAG LE WHEEL</h2>
          <p className="text-muted max-w-2xl text-sm leading-relaxed">
            La molette ne saute plus pixel par pixel. Lenis applique une inertie 1.1s ease-out-expo.
            Drag rapide = momentum qui s'estompe doucement. Reduced-motion désactive
            automatiquement.
          </p>
        </section>

        {/* ─── Phase 3 — Reveal stagger ─── */}
        <section className="flex flex-col gap-6">
          <p className="text-muted font-mono text-xs tracking-widest uppercase">
            Phase 3 — Reveal stagger
          </p>
          <h2 className="text-2xl tracking-tight sm:text-3xl">CARDS QUI ARRIVENT EN CASCADE</h2>
          <p className="text-muted text-sm leading-relaxed">
            Chaque card stagger 60ms après la précédente. IntersectionObserver, ~0 KB bundle.
            Re-scroll vers le haut puis redescend pour voir.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STAGGER_DEMO_ITEMS.map((item, i) => (
              <Reveal key={item.eyebrow} index={i}>
                <div className="border-border bg-surface rounded-card flex h-full flex-col gap-2 border p-6">
                  <span className="text-muted font-mono text-xs tracking-widest uppercase">
                    {item.eyebrow}
                  </span>
                  <h3 className="text-lg tracking-tight">{item.title}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─── Phase 4 — View transitions inter-pages ─── */}
        <section className="flex flex-col gap-6">
          <p className="text-muted font-mono text-xs tracking-widest uppercase">
            Phase 4 — View transitions native
          </p>
          <h2 className="text-2xl tracking-tight sm:text-3xl">CLIC = CROSSFADE LUXE</h2>
          <p className="text-muted max-w-2xl text-sm leading-relaxed">
            Click pour voir la page changer en crossfade 620ms ease-luxe au lieu d'un flash
            blanc-blanc. Chrome / Edge / Safari 18+. Firefox → instant nav (graceful fallback).
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/logo"
              className="border-fg bg-fg text-bg hover:bg-fg/90 duration-base inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase transition-[border-color,background-color] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Voir /logo <span aria-hidden="true">↗</span>
            </Link>
            <Link
              to="/motion"
              className="border-border text-muted hover:text-fg hover:border-fg/40 duration-base inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase transition-[border-color,color]"
            >
              Re-trigger ↻
            </Link>
          </div>
        </section>

        {/* ─── Phase 5 — Magnetic hover ─── */}
        <section className="flex flex-col gap-6">
          <p className="text-muted font-mono text-xs tracking-widest uppercase">
            Phase 5 — Magnetic hover
          </p>
          <h2 className="text-2xl tracking-tight sm:text-3xl">CTAS QUI PULL VERS LE CURSEUR</h2>
          <p className="text-muted max-w-2xl text-sm leading-relaxed">
            Approche le curseur des 4 boutons (chaque colonne a une strength différente). Skip sur
            touch + reduced-motion. Sweet spot strength = 0.22 (la 2e colonne).
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {MAGNETIC_DEMO.map(({ label, strength }) => (
              <MagneticHover key={label} radius={100} strength={strength}>
                <button
                  type="button"
                  className="border-border text-fg hover:border-fg w-full rounded-md border px-4 py-3 font-mono text-xs tracking-widest uppercase transition-[border-color] duration-150"
                >
                  {label}
                </button>
              </MagneticHover>
            ))}
          </div>
          <div className="text-muted grid grid-cols-2 gap-4 font-mono text-[10px] sm:grid-cols-4">
            {MAGNETIC_DEMO.map(({ label, strength }) => (
              <span key={label} className="text-center">
                strength {strength.toFixed(2)}
              </span>
            ))}
          </div>
        </section>

        {/* ─── Filler for scroll length ─── */}
        <section className="flex flex-col gap-6">
          <p className="text-muted font-mono text-xs tracking-widest uppercase">
            Long scroll — sens l'inertie Lenis
          </p>
          <div className="space-y-4">
            {Array.from({ length: 10 }, (_, i) => (
              <Reveal key={i} index={i}>
                <p className="text-muted text-sm leading-relaxed">
                  Ligne {String(i + 1)}. Scroll. Sens l'inertie. Le grain bouge derrière. Le texte
                  arrive avec 60ms de délai par rapport au précédent. C'est le tempo
                  fromanother.love.
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─── Footer brand ─── */}
        <section className="border-border flex flex-col items-start gap-4 border-t pt-12">
          <BrandMark className="text-sm" />
          <p className="text-muted font-sans text-xs">Motion showcase · 2026-05-12 design-night.</p>
        </section>
      </div>
    </main>
  );
}
