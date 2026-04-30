// ═══════════════════════════════════════════════════
// Apparition — acte 1, ACCROCHE (no wordmark, no doublon)
//
// WHAT: After the loader has just delivered the wordmark, this acte
//       does NOT re-show it. Instead a single editorial line — the
//       brand accroche — sits centered in massive Geist light. A
//       discreet bottom strip carries the three pillars (SUISSE ·
//       INDÉPENDANT · BESPOKE), placed as an anchor, not a header.
//       Granyon-style breathing room everywhere.
// WHEN: First scrollable acte, right after the loader fades.
// ═══════════════════════════════════════════════════

import { ActStage } from '@components/orchestration/ActStage';
import { TechFrame } from '@components/orchestration/TechFrame';

const ACCROCHE = {
  partA: 'Le véritable luxe',
  partB: 'ne se mesure pas uniquement à ce que l’on possède,',
  partC: 'mais à ce que l’on vit.',
};

const PILLARS = ['SUISSE', 'INDÉPENDANT', 'BESPOKE'];

export const Apparition = () => (
  <ActStage name="Apparition" tall={1} sticky={false}>
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <TechFrame index="001" label="ACCROCHE" />

      {/* Centered accroche — massive Geist light, breathing room */}
      <div className="flex flex-1 items-center justify-center px-6 md:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-light tracking-tight text-balance text-[#1a1a1a]">
            <span
              className="block"
              style={{ fontSize: 'clamp(1.75rem, 4.2vw, 4rem)', lineHeight: '1.05' }}
            >
              {ACCROCHE.partA}
            </span>
            <span
              className="mt-3 block text-[#1a1a1a]/75"
              style={{ fontSize: 'clamp(1.25rem, 2.4vw, 2.25rem)', lineHeight: '1.35' }}
            >
              {ACCROCHE.partB}
            </span>
            <span
              className="mt-3 block"
              style={{ fontSize: 'clamp(1.5rem, 3.2vw, 3rem)', lineHeight: '1.15' }}
            >
              {ACCROCHE.partC}
            </span>
          </p>
        </div>
      </div>

      {/* Bottom strip — anchor pillars, discreet but present */}
      <div className="px-6 pb-16 md:px-12 md:pb-20">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-8 border-t border-[#1a1a1a]/15 pt-6">
          {PILLARS.map((p, i) => (
            <span
              key={p}
              className="flex items-center gap-4 font-mono text-[10px] font-semibold tracking-[0.45em] text-[#1a1a1a] uppercase md:text-xs md:tracking-[0.55em]"
            >
              <span className="text-[#1a1a1a]/30">0{i + 1}</span>
              <span>{p}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  </ActStage>
);
