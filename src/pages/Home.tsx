// ═══════════════════════════════════════════════════
// Home — SAW Next experience landing (timeline 6-actes, light total)
//
// WHAT: Composes the SceneDirector + the six actes :
//       000 LOADER → 001 INTRODUCTION → 002 POSITIONNEMENT →
//       003 EXPERTISE → 004 MÉTHODE & ÉQUIPE → 005 CONVERSATION.
//       FilmGrain warm-tinted permanent en fond. QuickDock top-right
//       persistant (APPELER · ÉCRIRE · ESPACE CLIENT · WHATSAPP).
// WHEN: Index of /:locale/ — public landing.
// CHANGE COMPOSITION: rearrange the children. Each acte is autonomous.
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
        {/* Global film-grain — warm sepia mix, fixed behind every act */}
        <FilmGrain intensity={0.55} density={14} tickMs={100} className="fixed inset-0 -z-10" />

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
