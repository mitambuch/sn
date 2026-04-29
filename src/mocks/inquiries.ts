// ═══════════════════════════════════════════════════
// Inquiries mock dataset — lot B fake data
// Member's recent inquiries spanning the 5 lifecycle states.
// ═══════════════════════════════════════════════════

import { currentUser } from '@/mocks/users';
import type { Inquiry } from '@/types/inquiry';

export const inquiries: Inquiry[] = [
  {
    id: 'inq-01',
    userId: currentUser.id,
    source: 'property',
    targetId: 'prop-01',
    message: 'Disponibilité pour visite du chalet la semaine du 5 mai, de préférence en matinée.',
    status: 'in_review',
    createdAt: '2026-04-26T09:30:00.000Z',
  },
  {
    id: 'inq-02',
    userId: currentUser.id,
    source: 'timepiece',
    targetId: 'tp-01',
    message:
      'Set complet vérifié et plombs intacts ? Si oui, j’aimerais procéder à un examen physique à Genève.',
    status: 'contacted',
    createdAt: '2026-04-22T11:00:00.000Z',
  },
  {
    id: 'inq-03',
    userId: currentUser.id,
    source: 'event',
    targetId: 'evt-01',
    message: '4 places pour le gala de l’ONU, accord pour dress code black-tie.',
    status: 'new',
    createdAt: '2026-04-28T18:00:00.000Z',
  },
  {
    id: 'inq-04',
    userId: currentUser.id,
    source: 'concierge',
    targetId: null,
    message:
      'Recherche un audit de sécurité pour résidence à Cap-Ferrat, fin mai. Discrétion absolue requise.',
    status: 'closed',
    createdAt: '2026-03-12T14:00:00.000Z',
  },
  {
    id: 'inq-05',
    userId: currentUser.id,
    source: 'journey',
    targetId: 'jrn-02',
    message: 'Croisière Amalfi 10 jours en juillet, 8 invités. Merci de proposer dates.',
    status: 'cancelled',
    createdAt: '2026-02-20T10:00:00.000Z',
  },
];
