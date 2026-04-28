// ═══════════════════════════════════════════════════
// Playground component tags — shared vocabulary
//
// WHAT: Closed set of tags applied to playground specimens (buttons,
//       menus, sections, etc.) so the owner and Claude can reference
//       components by vibe/context.
// WHEN: When adding a specimen, annotate it with 1-3 tags from this set.
// HOW:  In conversation, owner can say "utilise un #brutalist #solid"
//       and Claude filters specimens by matching tags.
// ═══════════════════════════════════════════════════

/** Style tags — the aesthetic family a component belongs to. */
export const STYLE_TAGS = [
  'brutalist', // raw, thick borders, uppercase, no radius
  'editorial', // refined, italic, magazine-feel
  'minimal', // quiet, reduced chrome, whitespace
  'product', // practical SaaS/product style
  'playful', // animated, fun, unusual
  'luxe', // elegant, restrained, high-end
  'technical', // mono font, grid-aware, precise
  'organic', // soft, friendly, rounded
] as const;

/** Behavior tags — how the component reads functionally. */
export const BEHAVIOR_TAGS = [
  'icon', // icon-dominant
  'solid', // solid background
  'ghost', // transparent or border-only
  'animated', // significant hover/interaction effect
  'accent', // uses brand accent color prominently
] as const;

export type StyleTag = (typeof STYLE_TAGS)[number];
export type BehaviorTag = (typeof BEHAVIOR_TAGS)[number];
export type ComponentTag = StyleTag | BehaviorTag;

/** Strictly typed tag array — 1-3 tags per specimen. */
export type TagList = readonly ComponentTag[];
