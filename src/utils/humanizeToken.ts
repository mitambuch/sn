// ═══════════════════════════════════════════════════
// humanizeToken — readable fallback for an enum value with no i18n label
//
// WHAT: turns a raw token into a human label when no translation key exists.
//       "rental-long" → "Rental long", "behind_scenes" → "Behind scenes".
// WHEN: catalogue detail pages render an enum via t(`mod.field.${value}`).
//       Sanity lists can hold values the i18n bundle doesn't (yet) label;
//       this avoids showing a raw "mod.field.foo" key to the user.
// ═══════════════════════════════════════════════════

/** "rental-long" → "Rental long". Used as the last-resort enum label. */
export const humanizeToken = (value: string): string =>
  value
    .replace(/[-_]/g, ' ')
    .trim()
    .replace(/^\w/, c => c.toUpperCase());
