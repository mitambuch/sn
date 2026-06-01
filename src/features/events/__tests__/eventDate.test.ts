import { describe, expect, it } from 'vitest';

import { resolveEventDate } from '@/features/events/eventDate';

// Minimal i18n stub — only `events.allYear` is consulted by the helper.
const t = (key: string) => (key === 'events.allYear' ? 'Toute l’année' : key);

describe('resolveEventDate', () => {
  it('formats an exact date into badge + long + time (fr-CH)', () => {
    const r = resolveEventDate(
      { dateMode: 'exact', startsAt: '2026-06-14T19:30:00+02:00' },
      'fr-CH',
      t,
    );
    expect(r.badge.top).toBe('14');
    expect(r.badge.bottom).toBeTruthy(); // localized short month
    expect(r.long).toContain('2026');
    expect(r.time).toBe('19:30');
  });

  it('treats a missing dateMode as exact (legacy docs / mocks)', () => {
    const r = resolveEventDate({ startsAt: '2026-06-14T19:30:00+02:00' }, 'fr-CH', t);
    expect(r.badge.top).toBe('14');
    expect(r.time).toBe('19:30');
  });

  it('renders the all-year label with no time', () => {
    const r = resolveEventDate({ dateMode: 'allYear' }, 'fr-CH', t);
    expect(r.badge.top).toBe('Toute l’année');
    expect(r.badge.bottom).toBeUndefined();
    expect(r.long).toBe('Toute l’année');
    expect(r.time).toBeUndefined();
  });

  it('renders free text and never exposes a clock time', () => {
    const r = resolveEventDate({ dateMode: 'free', dateLabel: 'Sur demande' }, 'fr-CH', t);
    expect(r.badge.top).toBe('Sur demande');
    expect(r.long).toBe('Sur demande');
    expect(r.time).toBeUndefined();
  });

  it('falls back to the all-year label when free text is empty', () => {
    const r = resolveEventDate({ dateMode: 'free', dateLabel: '  ' }, 'fr-CH', t);
    expect(r.long).toBe('Toute l’année');
  });

  it('shows a dash when exact mode somehow lacks a start date', () => {
    const r = resolveEventDate({ dateMode: 'exact' }, 'fr-CH', t);
    expect(r.badge.top).toBe('—');
    expect(r.time).toBeUndefined();
  });
});
