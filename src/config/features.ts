/* ═══════════════════════════════════════════════════════════════
   FEATURE FLAGS — runtime switches for not-yet-ready surfaces
   Plain constants : flipping one is a deliberate, reviewed code change
   (it ships alongside the work that makes the feature real).
   ═══════════════════════════════════════════════════════════════ */

interface FeatureFlags {
  /** Member catalogue surfaces (products + modules) are real, not mock. */
  readonly catalogueLive: boolean;
}

// WHY: typed as boolean (not the `false` literal) so consumers treat it as a
// genuine runtime switch — keeps `no-unnecessary-condition` quiet at every
// call site and makes flipping it a one-line change with no type ripple.
export const FEATURES: FeatureFlags = {
  // WHY: the member catalogue (properties, timepieces, artworks, events,
  // journeys, concierge, news) is still backed by demo MOCK data — fake
  // products, invented "limited offer" countdowns, placeholder concierge
  // contact. A real client logging in must NOT see that. While this is
  // false, those surfaces are hidden behind an "espace en préparation"
  // holding state (nav trimmed, routes redirected, search disabled,
  // dashboard shows a preparation notice instead of the fake vitrine).
  //
  // FLIP TO true ONLY when real Sanity content is wired and the fiches are
  // complete — that change ships with the catalogue content branch merged
  // (crash-safe detail pages) so the catalogue is real on the first click.
  catalogueLive: false,
};
