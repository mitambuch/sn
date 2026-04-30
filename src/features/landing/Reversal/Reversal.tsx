// ═══════════════════════════════════════════════════
// Reversal — acte 4, the public→intimate flip (PHASE C STUB)
//
// WHAT: Will be the clip-path circle expand + filter invert +
//       chromatic split transition. For now: a hard contrast bridge
//       between the dark acts (0-3) and Doorway (5).
// ═══════════════════════════════════════════════════

import { ActStage } from '@components/orchestration/ActStage';

export const Reversal = () => (
  <ActStage name="Reversal" tall={1}>
    <div className="flex h-screen w-full items-center justify-center bg-[#edf2f1]">
      <p className="font-mono text-[10px] tracking-[0.5em] text-[#1a1a1a]/40 uppercase">
        04 · Reversal · Une demande.
      </p>
    </div>
  </ActStage>
);
