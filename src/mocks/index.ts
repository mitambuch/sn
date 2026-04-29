// ═══════════════════════════════════════════════════
// Mocks barrel — single import surface for all dev fixtures
//
// Usage:
//   import { getProperty, listProperties } from '@/mocks';
//
// All `list*` and `get*` helpers return the data synchronously today.
// They are designed to be drop-in replaceable with async Supabase calls
// in lot C (server wiring) — keep the same names and shapes.
// ═══════════════════════════════════════════════════

import type { Artwork } from '@/types/artwork';
import type { User } from '@/types/auth';
import type { ConciergeService } from '@/types/concierge';
import type { Event } from '@/types/event';
import type { Inquiry } from '@/types/inquiry';
import type { InvitationCode } from '@/types/invitation';
import type { Journey } from '@/types/journey';
import type { Property } from '@/types/property';
import type { Timepiece } from '@/types/timepiece';

import { artworks } from './artworks';
import { conciergeServices } from './concierge';
import { events } from './events';
import { inquiries } from './inquiries';
import { invitations } from './invitations';
import { journeys } from './journeys';
import { properties } from './properties';
import { timepieces } from './timepieces';
import { currentUser, operator, users } from './users';

// ─── Properties ──────────────────────────────────────
export const listProperties = (): Property[] => properties;
export const getProperty = (slug: string): Property | undefined =>
  properties.find(p => p.slug === slug || p.id === slug);

// ─── Timepieces ──────────────────────────────────────
export const listTimepieces = (): Timepiece[] => timepieces;
export const getTimepiece = (slug: string): Timepiece | undefined =>
  timepieces.find(t => t.slug === slug || t.id === slug);

// ─── Artworks ────────────────────────────────────────
export const listArtworks = (): Artwork[] => artworks;
export const getArtwork = (slug: string): Artwork | undefined =>
  artworks.find(a => a.slug === slug || a.id === slug);

// ─── Events ──────────────────────────────────────────
export const listEvents = (): Event[] => events;
export const getEvent = (slug: string): Event | undefined =>
  events.find(e => e.slug === slug || e.id === slug);

// ─── Journeys ────────────────────────────────────────
export const listJourneys = (): Journey[] => journeys;
export const getJourney = (slug: string): Journey | undefined =>
  journeys.find(j => j.slug === slug || j.id === slug);

// ─── Concierge ───────────────────────────────────────
export const listConciergeServices = (): ConciergeService[] => conciergeServices;
export const getConciergeService = (slug: string): ConciergeService | undefined =>
  conciergeServices.find(c => c.slug === slug || c.id === slug);

// ─── Users / Inquiries ───────────────────────────────
export const listUsers = (): User[] => users;
export const listInquiries = (): Inquiry[] => inquiries;
export const listInquiriesForUser = (userId: string): Inquiry[] =>
  inquiries.filter(i => i.userId === userId);

// ─── Invitations ─────────────────────────────────────
export const listInvitations = (): InvitationCode[] => invitations;

export { currentUser, operator };

export {
  artworks,
  conciergeServices,
  events,
  inquiries,
  invitations,
  journeys,
  properties,
  timepieces,
  users,
};
