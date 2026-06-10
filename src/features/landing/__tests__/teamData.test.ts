import { describe, expect, it } from 'vitest';

import { FOCAL_MEMBER, TEAM_MEMBERS, toTelHref, toWhatsAppHref } from '../teamData';

describe('teamData helpers', () => {
  describe('toTelHref', () => {
    it('keeps the leading + and strips spaces', () => {
      expect(toTelHref('+33 6 88 38 01 86')).toBe('tel:+33688380186');
      expect(toTelHref('+41 78 749 81 70')).toBe('tel:+41787498170');
    });

    it('strips parentheses and dashes', () => {
      expect(toTelHref('+1 (415) 555-0100')).toBe('tel:+14155550100');
    });
  });

  describe('toWhatsAppHref', () => {
    // The brief's expected wa.me values, derived from each phone.
    it.each([
      ['+33 6 88 38 01 86', 'https://wa.me/33688380186'],
      ['+41 76 492 77 76', 'https://wa.me/41764927776'],
      ['+33 6 42 00 14 74', 'https://wa.me/33642001474'],
      ['+41 79 417 39 49', 'https://wa.me/41794173949'],
      ['+41 78 749 81 70', 'https://wa.me/41787498170'],
    ])('derives %s → %s when no explicit link is set', (phone, expected) => {
      expect(toWhatsAppHref({ phone })).toBe(expected);
    });

    it('prefers an explicit wa.me url over the phone', () => {
      expect(toWhatsAppHref({ phone: '+33 6 88 38 01 86', whatsapp: 'https://wa.me/999' })).toBe(
        'https://wa.me/999',
      );
    });

    it('treats a non-url whatsapp value as a raw number', () => {
      expect(toWhatsAppHref({ phone: '+1 000', whatsapp: '+41 78 749 81 70' })).toBe(
        'https://wa.me/41787498170',
      );
    });
  });
});

describe('TEAM_MEMBERS data integrity', () => {
  it('has the five members in display order', () => {
    expect(TEAM_MEMBERS.map(m => m.key)).toEqual(['valmont', 'harvy', 'lucian', 'tavio', 'sergio']);
  });

  it('marks exactly one focal member (Valmont)', () => {
    const focal = TEAM_MEMBERS.filter(m => m.isFocal);
    expect(focal).toHaveLength(1);
    expect(focal[0]?.key).toBe('valmont');
    expect(FOCAL_MEMBER.key).toBe('valmont');
  });

  it('gives every member a distinct phone (no Valmont contamination)', () => {
    const phones = TEAM_MEMBERS.map(m => m.phone);
    expect(new Set(phones).size).toBe(phones.length);
  });

  it('fills sector title and function in all three locales for every member', () => {
    for (const m of TEAM_MEMBERS) {
      for (const loc of ['fr', 'en', 'es'] as const) {
        expect(m.sectorTitle[loc].length).toBeGreaterThan(0);
        expect(m.functionLabel[loc].length).toBeGreaterThan(0);
      }
    }
  });

  it('never ships a placeholder LinkedIn url', () => {
    for (const m of TEAM_MEMBERS) {
      expect(m.linkedin).not.toBe('#');
    }
  });

  it('matches the brief data for each member', () => {
    const byKey = Object.fromEntries(TEAM_MEMBERS.map(m => [m.key, m]));

    expect(byKey.sergio).toMatchObject({
      lastName: 'Kubas',
      slug: 'sergio-kubas',
      phone: '+33 6 88 38 01 86',
      email: 'info@saw-next.ch',
    });
    expect(byKey.sergio?.sectorTitle.fr).toBe('SPORT & CERCLES PRIVÉS');
    expect(byKey.sergio?.functionLabel.fr).toBe('Relations internationales & développement');

    expect(byKey.lucian?.phone).toBe('+41 76 492 77 76');
    expect(byKey.lucian?.sectorTitle.fr).toBe('ÉVÉNEMENTIEL • SHOWBIZ • HOSPITALITÉ');
    expect(byKey.lucian?.functionLabel.fr).toBe('Relations VIP & développement');

    expect(byKey.harvy?.phone).toBe('+33 6 42 00 14 74');
    expect(byKey.harvy?.functionLabel.fr).toBe('Relations internationales & développement');

    expect(byKey.tavio?.phone).toBe('+41 79 417 39 49');
    expect(byKey.tavio?.sectorTitle.fr).toBe('IMMOBILIER • ARCHITECTURE • ART DE VIVRE');
    expect(byKey.tavio?.functionLabel.fr).toBe('Développement & vision de projets');
  });
});
