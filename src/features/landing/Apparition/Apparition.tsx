// ═══════════════════════════════════════════════════
// Apparition — acte 1, INTRODUCTION (édito dense, light)
//
// WHAT: Once the loader has cleared, the wordmark sits centred and
//       static. Below: sub-mark (Bespoke Client Services Platform),
//       3 pillars (Suisse / Indépendant / Bespoke), then the full
//       accroche from the brand doc as an editorial paragraph.
// WHEN: Right after Threshold (loader). The brand has been
//       "received"; this acte builds context.
// CHANGE COPY: ACCROCHE / SUB_MARK / PILLARS — all uppercase per
//       owner direction.
// ═══════════════════════════════════════════════════

import { ActStage } from '@components/orchestration/ActStage';
import { TechFrame } from '@components/orchestration/TechFrame';
import { Wordmark } from '@components/ui/Wordmark';

const SUB_MARK = 'BESPOKE CLIENT SERVICES PLATFORM';
const PILLARS = ['SUISSE', 'INDÉPENDANT', 'BESPOKE'];
const ACCROCHE =
  "Le véritable luxe ne se mesure pas uniquement à ce que l'on possède, mais à ce que l'on vit.";

export const Apparition = () => (
  <ActStage name="Apparition" tall={1} sticky={false}>
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 md:px-12">
      <TechFrame index="001" label="INTRODUCTION" />

      {/* Wordmark static, monumental */}
      <div className="w-full max-w-6xl">
        <Wordmark className="text-[#1a1a1a]" />
      </div>

      {/* Sub-mark — bare under the wordmark, full uppercase */}
      <p className="mt-8 font-mono text-xs font-semibold tracking-[0.55em] text-[#1a1a1a]/70 uppercase md:text-sm">
        {SUB_MARK}
      </p>

      {/* 3 pillars row, separated by hairlines */}
      <div className="mt-14 flex w-full max-w-3xl items-center justify-between font-mono text-sm font-semibold tracking-[0.35em] text-[#1a1a1a] uppercase md:text-base">
        {PILLARS.map((p, i) => (
          <span key={p} className="relative inline-flex items-center gap-6">
            <span>{p}</span>
            {i < PILLARS.length - 1 && (
              <span aria-hidden="true" className="block h-px w-10 bg-[#1a1a1a]/30 md:w-16" />
            )}
          </span>
        ))}
      </div>

      {/* Accroche — the full quote, treated as editorial */}
      <p className="mt-20 max-w-3xl text-center text-2xl leading-snug font-light tracking-tight text-balance text-[#1a1a1a]/85 md:text-3xl lg:text-[2.5rem] lg:leading-[1.15]">
        {ACCROCHE}
      </p>
    </div>
  </ActStage>
);
