// ═══════════════════════════════════════════════════
// Invitation codes mock dataset — lot B fake data
// ═══════════════════════════════════════════════════

import { operator, users } from '@/mocks/users';
import type { InvitationCode } from '@/types/invitation';

export const invitations: InvitationCode[] = [
  {
    id: 'inv-01',
    code: 'AB23C7DE',
    status: 'redeemed',
    createdAt: '2025-12-01T09:00:00.000Z',
    redeemedAt: '2025-12-05T11:00:00.000Z',
    redeemedBy: users[2]?.id ?? null,
    expiresAt: null,
    createdBy: operator.id,
  },
  {
    id: 'inv-02',
    code: 'KQ89PR23',
    status: 'redeemed',
    createdAt: '2026-01-15T10:00:00.000Z',
    redeemedAt: '2026-01-18T14:00:00.000Z',
    redeemedBy: users[3]?.id ?? null,
    expiresAt: null,
    createdBy: operator.id,
  },
  {
    id: 'inv-03',
    code: 'JN45VX78',
    status: 'unused',
    createdAt: '2026-04-01T08:30:00.000Z',
    redeemedAt: null,
    redeemedBy: null,
    expiresAt: '2026-07-01T08:30:00.000Z',
    createdBy: operator.id,
  },
  {
    id: 'inv-04',
    code: 'MX27HK56',
    status: 'unused',
    createdAt: '2026-04-08T15:00:00.000Z',
    redeemedAt: null,
    redeemedBy: null,
    expiresAt: '2026-07-08T15:00:00.000Z',
    createdBy: operator.id,
  },
  {
    id: 'inv-05',
    code: 'BW73DF92',
    status: 'expired',
    createdAt: '2025-09-12T12:00:00.000Z',
    redeemedAt: null,
    redeemedBy: null,
    expiresAt: '2025-12-12T12:00:00.000Z',
    createdBy: operator.id,
  },
  {
    id: 'inv-06',
    code: 'PR58TJ49',
    status: 'revoked',
    createdAt: '2026-02-20T10:00:00.000Z',
    redeemedAt: null,
    redeemedBy: null,
    expiresAt: null,
    createdBy: operator.id,
  },
  {
    id: 'inv-07',
    code: 'XS84QM62',
    status: 'unused',
    createdAt: '2026-04-22T11:00:00.000Z',
    redeemedAt: null,
    redeemedBy: null,
    expiresAt: '2026-07-22T11:00:00.000Z',
    createdBy: operator.id,
  },
];
