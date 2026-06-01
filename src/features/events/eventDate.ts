// ═══════════════════════════════════════════════════
// eventDate — resolve an event's date into display strings
//
// WHAT: Turns an event's date mode (exact / allYear / free) into the
//       three shapes the UI needs: a card badge stamp, a long human
//       date, and an optional time. One place so the card, the detail
//       page and the share page never drift apart.
// WHEN: Use anywhere an event date is shown. Pass the active locale and
//       the i18next `t` function (for the localized "all year" label).
// ═══════════════════════════════════════════════════

import type { Event } from '@/types/event';

export interface EventDateDisplay {
  /** Card badge stamp — big `top` line, optional small `bottom` line. */
  badge: { top: string; bottom?: string };
  /** Long human date — "samedi 14 juin 2026", "Toute l'année", or free text. */
  long: string;
  /** Time of day ("19:30"), only present in `exact` mode. */
  time?: string;
}

type EventDateFields = Pick<Event, 'dateMode' | 'startsAt' | 'dateLabel'>;

/**
 * Resolve an event's date into display strings.
 * `dateMode` absent ⇒ treated as `exact` (legacy docs / mocks).
 */
export function resolveEventDate(
  event: EventDateFields,
  locale: string,
  t: (key: string) => string,
): EventDateDisplay {
  const mode = event.dateMode ?? 'exact';

  if (mode === 'allYear') {
    const label = t('events.allYear');
    return { badge: { top: label }, long: label };
  }

  if (mode === 'free') {
    // Operator-written text; fall back to the all-year label if somehow empty.
    const label = event.dateLabel?.trim() || t('events.allYear');
    return { badge: { top: label }, long: label };
  }

  // exact — guard against a missing startsAt (shouldn't occur post-validation).
  if (!event.startsAt) {
    return { badge: { top: '—' }, long: '—' };
  }

  const d = new Date(event.startsAt);
  return {
    badge: {
      top: d.toLocaleDateString(locale, { day: '2-digit' }),
      bottom: d.toLocaleDateString(locale, { month: 'short' }),
    },
    long: d.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
  };
}
