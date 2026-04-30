// ═══════════════════════════════════════════════════
// Home — SAW Next public landing one-pager
//
// WHAT: Composes the five landing sections (HeroImmersive, EspritSaw,
//       DomainsTicker, CinematicManifesto, ConversationFooter) on a
//       single page. Light theme + #edf2f1 surface enforced by the
//       parent <LandingLayout />. No app chrome (Header/Footer
//       intentionally omitted).
// WHEN: Index of /:locale/. The /invite/:code sister route reuses
//       the same layout.
// CHANGE COMPOSITION: reorder the imports below. Each section is
//       independent and accepts an `id` prop for in-page anchors.
// ═══════════════════════════════════════════════════

import { SeoHead } from '@components/features/SeoHead';
import {
  CinematicManifesto,
  ConversationFooter,
  DomainsTicker,
  EspritSaw,
  HeroImmersive,
} from '@features/landing';

export default function Home() {
  return (
    <>
      <SeoHead
        title="SAW Next — Conciergerie privée"
        description="Conciergerie privée suisse. Le luxe vécu autrement — événements, voyages, horlogerie, immobilier off-market."
      />
      <HeroImmersive id="hero" />
      <EspritSaw id="esprit" />
      <DomainsTicker id="domaines" />
      <CinematicManifesto id="manifeste" />
      <ConversationFooter id="conversation" />
    </>
  );
}
