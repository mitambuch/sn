// ═══════════════════════════════════════════════════
// Home — SAW Next public landing (one-page, light total, simple-pro)
//
// WHAT: Composes the 5 landing sections in narrative order :
//       Hero → Positionnement → Expertise → Méthode → Équipe.
//       The Footer (LandingLayout) carries the closing CONTACTER
//       block, anchored at #contact.
// WHEN: Index of /:locale/.
// CHANGE COMPOSITION: rearrange the children below. Each section is
//       autonomous and carries its own anchor id.
// ═══════════════════════════════════════════════════

import { SeoHead } from '@components/features/SeoHead';
import {
  EquipeSection,
  ExpertiseSection,
  HeroSection,
  MethodeSection,
  PositionnementSection,
} from '@features/landing';

export default function Home() {
  return (
    <>
      <SeoHead
        title="SAW Next — Bespoke Client Services Platform"
        description="Le véritable luxe ne se mesure pas uniquement à ce que l'on possède, mais à ce que l'on vit."
      />
      <HeroSection />
      <PositionnementSection />
      <ExpertiseSection />
      <MethodeSection />
      <EquipeSection />
    </>
  );
}
