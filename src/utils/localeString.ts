// ═══════════════════════════════════════════════════
// localeStr — coerce a value to a plain string
//
// WHAT: Accepts a string, a localeString object ({fr,en}), or anything
//       else, and returns a plain string ('' when nothing usable). Guards
//       UI against an unflattened Sanity localeString reaching render
//       (e.g. a query that didn't project via the $locale helper).
// WHEN: Rendering a field that *should* be a string but might arrive as
//       a {fr,en} object — e.g. shared-fiche titles/summaries.
// ═══════════════════════════════════════════════════

/** Coerce string | {fr,en} | unknown → plain string (FR preferred, '' fallback). */
export const localeStr = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const o = value as { fr?: unknown; en?: unknown };
    if (typeof o.fr === 'string') return o.fr;
    if (typeof o.en === 'string') return o.en;
  }
  return '';
};
