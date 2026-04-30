// ═══════════════════════════════════════════════════
// Home — SAW Next experience landing (timeline 6-actes)
//
// WHAT: Composes the SceneDirector orchestrator and the six acts
//       in narrative order : Threshold (gate) → Apparition (brand
//       emerges) → Murmurs (stellar field) → Stillness (silence) →
//       Reversal (flip) → Doorway (the conversation).
// WHEN: Index of /:locale/ — public landing.
// CHANGE COMPOSITION: rearrange children below. Each act is
//       self-contained ; ordering changes the narrative, not the
//       components themselves.
// ═══════════════════════════════════════════════════

import { SeoHead } from '@components/features/SeoHead';
import { SceneDirector } from '@components/orchestration/SceneDirector';
import { FilmGrain } from '@components/ui/FilmGrain';
import { Apparition, Doorway, Murmurs, Reversal, Stillness, Threshold } from '@features/landing';

export default function Home() {
  return (
    <>
      <SeoHead
        title="SAW Next — Bespoke Client Services Platform"
        description="Le véritable luxe ne se mesure pas uniquement à ce que l'on possède, mais à ce que l'on vit."
      />
      <SceneDirector>
        {/* Global film-grain — sits behind every act, fixed position */}
        <FilmGrain intensity={0.85} density={16} tickMs={90} className="fixed inset-0 -z-10" />

        <Threshold />
        <Apparition />
        <Murmurs />
        <Stillness />
        <Reversal />
        <Doorway />
      </SceneDirector>
    </>
  );
}
