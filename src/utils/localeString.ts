// ═══════════════════════════════════════════════════
// localeStr — coerce a value to a plain string
//
// WHAT: Accepts a string, a localeString object ({fr,en,es}), or anything
//       else, and returns a plain string ('' when nothing usable). Guards
//       UI against an unflattened Sanity localeString reaching render
//       (e.g. a query that didn't project via the $locale helper).
// WHEN: Rendering a field that *should* be a string but might arrive as
//       a {fr,en,es} object — e.g. shared-fiche titles/summaries.
// i18n: optional `locale` arg picks the active language first, then falls
//       back FR → EN → ES → ''. Without it, behaviour is FR-preferred (the
//       historical default). WHY the arg: a raw localeString reaching here
//       on the ES site used to collapse to FR (no `es` branch) — a visitor
//       saw French even when an ES value existed. Pass the active locale to
//       resolve correctly.
// ═══════════════════════════════════════════════════

type Locale = 'fr' | 'en' | 'es';

/** Coerce string | {fr,en,es} | unknown → plain string. With `locale`, prefers
 *  that language then falls back FR → EN → ES; without it, FR-preferred. */
export const localeStr = (value: unknown, locale?: Locale): string => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const o = value as { fr?: unknown; en?: unknown; es?: unknown };
    // Active locale first when asked, then the FR → EN → ES fallback chain.
    const order: Locale[] = locale ? [locale, 'fr', 'en', 'es'] : ['fr', 'en', 'es'];
    for (const key of order) {
      const candidate = o[key];
      if (typeof candidate === 'string') return candidate;
    }
  }
  return '';
};
