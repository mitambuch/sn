// ═══════════════════════════════════════════════════
// icons — re-export from the canonical studio/icons.tsx
//
// WHY: Keeps schema imports consistent with the `../_helpers/icons` path
//      used in the new domain schemas, while the actual emoji-icon
//      helper lives at studio/icons.tsx and is shared with desk
//      structure listItems.
// ═══════════════════════════════════════════════════

export { bigIcon, icon } from '../../icons';
