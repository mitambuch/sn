// ═══════════════════════════════════════════════════
// ExamplePage — /exemple — esthetic gate into the demo share code
//
// WHAT: A "trailer" landing that anyone can hit. Cold-open noir surface
//       with the SAW NEXT mark, a one-line invitation and a single
//       button "Entrer dans l'aperçu" that pushes the user through to
//       /share/SAW-DEMO-2026 — which renders the seeded demo event
//       (Gala ONU Genève) as a real fiche.
//
//       Purpose : Salva sends https://sn-studio-dusky.vercel.app/exemple
//       to any prospect, no authentication, no commitment. The prospect
//       gets a tactile taste of the experience before being invited.
//
// WHEN: Public route /exemple (outside locale tree, no PublicLayout
//       chrome). Reachable directly, share-able as-is.
// ═══════════════════════════════════════════════════

import { MonoGradientPlaceholder } from '@components/ui/MonoGradientPlaceholder';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const DEMO_DISPLAY_CODE = 'SAW-DEMO-2026';

export default function ExamplePage() {
  // Tiny entry animation — content fades in after first paint so the
  // noir surface reads as a deliberate cold-open, not a flash.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => {
      setEntered(true);
    }, 50);
    return () => {
      window.clearTimeout(id);
    };
  }, []);

  return (
    <main
      data-theme="dark"
      className="bg-bg text-fg relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16 md:px-12"
    >
      {/* React 19 hoists these into <head> automatically */}
      <title>Aperçu privé — SAW NEXT</title>
      <meta
        name="description"
        content="Un aperçu privé du cercle SAW NEXT — accès retenue, accompagnement sur-mesure."
      />
      <meta name="robots" content="noindex, nofollow" />

      {/* Ambient backdrop — monochrome organic motion, behind everything */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-25">
        <MonoGradientPlaceholder tone="dark" className="h-full w-full" />
      </div>

      <div
        className="relative z-10 flex max-w-2xl flex-col items-center gap-12 text-center"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 1200ms ease-out, transform 1200ms ease-out',
        }}
      >
        <span className="text-muted font-mono text-[10px] tracking-[0.5em] uppercase">
          SAW NEXT — Aperçu privé
        </span>

        <h1 className="font-mono text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] font-medium tracking-tight uppercase">
          Une fiche.
          <br />
          Un aperçu.
          <br />
          <span className="text-muted">Aucune trace.</span>
        </h1>

        <p className="text-fg/80 max-w-md text-base leading-relaxed">
          Sawnext est un cercle restreint. Cette page ouvre une porte unique sur une fiche réelle —
          sans inscription, sans laisser d&apos;empreinte. Considérez-la comme un coup d&apos;œil
          dans l&apos;atelier.
        </p>

        <div className="flex flex-col items-center gap-4">
          <Link
            to={`/share/${DEMO_DISPLAY_CODE}`}
            className="border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-fg/40 group inline-flex items-center gap-4 rounded-full border px-10 py-4 font-mono text-xs tracking-[0.4em] uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            Entrer dans l&apos;aperçu
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
          </Link>
          <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
            Code · {DEMO_DISPLAY_CODE}
          </span>
        </div>

        <Link
          to="/"
          className="text-muted hover:text-fg mt-4 font-mono text-[10px] tracking-[0.3em] uppercase transition-colors"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
