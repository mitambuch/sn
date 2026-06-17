// ═══════════════════════════════════════════════════
// deviceLocale — resolve the visitor's device language
//
// WHAT: reads the phone/browser's preferred languages (navigator.languages)
//       and returns the first one we support (fr/en/es). Unlike the global
//       i18n detector (which prefers a cached choice + the prerendered
//       <html lang="fr">), this ignores both and reflects the DEVICE — so a
//       phone in England opens EN, in Paris opens FR. Falls back to EN
//       (international) when the device language isn't one we offer.
// WHEN: the public salon pages (/QR, /presentation) call this on mount to
//       open in the scanner's own language (owner direction 2026-06-17).
// ═══════════════════════════════════════════════════

import { isLocale, type Locale } from '@config/i18n';

/** First supported locale among the device's preferred languages, else EN. */
export function resolveDeviceLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en';
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const pref of prefs) {
    const two = pref?.slice(0, 2).toLowerCase();
    if (isLocale(two)) return two;
  }
  return 'en';
}
