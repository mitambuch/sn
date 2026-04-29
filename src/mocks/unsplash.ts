// ═══════════════════════════════════════════════════
// Unsplash placeholder URL helper — DEV ONLY
//
// WHY: lot B mocks need realistic visuals before the operator's Cloudinary
// account is wired (planned for V2 product). Unsplash Source delivers
// stable, free, license-friendly placeholders. Marked clearly so a grep
// for `unsplash` finds every replacement target later.
// REPLACE ME: when Cloudinary is set up, replace these helpers with
// `cld(...)` calls and delete this module.
// ═══════════════════════════════════════════════════

/**
 * Returns a deterministic Unsplash Source URL keyed by a slug.
 * The slug seeds the image so a given mock always shows the same photo.
 */
export const unsplash = (slug: string, w = 1600, h = 1200): string =>
  `https://source.unsplash.com/${String(w)}x${String(h)}/?${encodeURIComponent(slug)}`;
