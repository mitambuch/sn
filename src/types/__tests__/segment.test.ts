import { describe, expect, it } from 'vitest';

import { memberCanSeeFiche } from '../segment';

const M = 'member-1';

describe('memberCanSeeFiche', () => {
  it('mode "all" → visible to any member', () => {
    expect(memberCanSeeFiche(M, [], { mode: 'all', segments: [], excludedMemberIds: [] })).toBe(
      true,
    );
  });

  it('mode "segments" → visible only with a matching segment', () => {
    const audience = {
      mode: 'segments' as const,
      segments: ['piguet-galland'],
      excludedMemberIds: [],
    };
    expect(memberCanSeeFiche(M, ['piguet-galland'], audience)).toBe(true);
    expect(memberCanSeeFiche(M, ['vip'], audience)).toBe(false);
    expect(memberCanSeeFiche(M, [], audience)).toBe(false);
  });

  it('exclusion overrides everything', () => {
    expect(
      memberCanSeeFiche(M, ['piguet-galland'], {
        mode: 'all',
        segments: [],
        excludedMemberIds: [M],
      }),
    ).toBe(false);
    expect(
      memberCanSeeFiche(M, ['piguet-galland'], {
        mode: 'segments',
        segments: ['piguet-galland'],
        excludedMemberIds: [M],
      }),
    ).toBe(false);
  });
});
