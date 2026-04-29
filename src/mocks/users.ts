// ═══════════════════════════════════════════════════
// Users mock dataset — lot B fake data
//
// Current member (used by AuthContext dev session) + concierge operator
// (Salva) + 5 fake members for admin views.
// ═══════════════════════════════════════════════════

import type { User } from '@/types/auth';

export const currentUser: User = {
  id: 'usr-current',
  email: 'membre@sawnext.demo',
  fullName: 'Hugo Méredith',
  role: 'client',
  locale: 'fr',
  contactPreference: 'phone',
  conciergeName: 'Salvatore Montemagno',
  createdAt: '2025-11-12T10:00:00.000Z',
};

export const operator: User = {
  id: 'usr-op-salva',
  email: 'salvatore@sawnext.studio',
  fullName: 'Salvatore Montemagno',
  role: 'admin',
  locale: 'fr',
  contactPreference: 'email',
  conciergeName: 'Salvatore Montemagno',
  createdAt: '2025-09-01T00:00:00.000Z',
};

export const users: User[] = [
  currentUser,
  operator,
  {
    id: 'usr-001',
    email: 'a.lefevre@sawnext.demo',
    fullName: 'Anne Lefèvre',
    role: 'client',
    locale: 'fr',
    contactPreference: 'phone',
    conciergeName: 'Salvatore Montemagno',
    createdAt: '2025-12-05T09:00:00.000Z',
  },
  {
    id: 'usr-002',
    email: 'k.morrison@sawnext.demo',
    fullName: 'Kenneth Morrison',
    role: 'client',
    locale: 'en',
    contactPreference: 'secure-message',
    conciergeName: 'Salvatore Montemagno',
    createdAt: '2026-01-18T14:00:00.000Z',
  },
  {
    id: 'usr-003',
    email: 'mc.huang@sawnext.demo',
    fullName: 'Mei-Chen Huang',
    role: 'client',
    locale: 'en',
    contactPreference: 'email',
    conciergeName: 'Salvatore Montemagno',
    createdAt: '2026-02-02T11:00:00.000Z',
  },
  {
    id: 'usr-004',
    email: 'd.rossi@sawnext.demo',
    fullName: 'Domenico Rossi',
    role: 'client',
    locale: 'fr',
    contactPreference: 'phone',
    conciergeName: 'Salvatore Montemagno',
    createdAt: '2026-02-22T15:00:00.000Z',
  },
  {
    id: 'usr-005',
    email: 'e.almeida@sawnext.demo',
    fullName: 'Elisa Almeida',
    role: 'client',
    locale: 'en',
    contactPreference: 'phone',
    conciergeName: 'Salvatore Montemagno',
    createdAt: '2026-03-10T10:00:00.000Z',
  },
];
