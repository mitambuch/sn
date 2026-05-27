// ═══════════════════════════════════════════════════
// Mocks barrel — single import surface for all dev fixtures
//
// Catalogue helpers (Properties, Timepieces, Artworks, Events,
// Journeys, Concierge services, Articles) delegate to the adminStore
// so live edits made by Valmont in /admin/catalogue surface in the
// public catalogue immediately and persist across reloads.
//
// Lot C will swap the adminStore localStorage layer for Supabase
// queries — the helper API stays identical.
// ═══════════════════════════════════════════════════

import * as adminStore from '@/store/adminStore';
import type { Article } from '@/types/article';
import type { Artwork } from '@/types/artwork';
import type { User } from '@/types/auth';
import type { ConciergeService } from '@/types/concierge';
import type { Event } from '@/types/event';
import type { Inquiry } from '@/types/inquiry';
import type { InvitationCode } from '@/types/invitation';
import type { Journey } from '@/types/journey';
import type { Property } from '@/types/property';
import type { Timepiece } from '@/types/timepiece';

import { articles } from './articles';
import { artworks } from './artworks';
import { conciergeServices } from './concierge';
import { events } from './events';
import { inquiries } from './inquiries';
import { invitations } from './invitations';
import { journeys } from './journeys';
import { properties } from './properties';
import { timepieces } from './timepieces';
import { currentUser, operator, users } from './users';

/* ─── Catalogue helpers — delegated to adminStore ─── */

export const listProperties = (): Property[] => adminStore.listItems('property');
export const getProperty = (slug: string): Property | undefined =>
  adminStore.listItems('property').find(p => p.slug === slug || p.id === slug);

export const listTimepieces = (): Timepiece[] => adminStore.listItems('timepiece');
export const getTimepiece = (slug: string): Timepiece | undefined =>
  adminStore.listItems('timepiece').find(t => t.slug === slug || t.id === slug);

export const listArtworks = (): Artwork[] => adminStore.listItems('artwork');
export const getArtwork = (slug: string): Artwork | undefined =>
  adminStore.listItems('artwork').find(a => a.slug === slug || a.id === slug);

export const listEvents = (): Event[] => adminStore.listItems('event');
export const getEvent = (slug: string): Event | undefined =>
  adminStore.listItems('event').find(e => e.slug === slug || e.id === slug);

export const listJourneys = (): Journey[] => adminStore.listItems('journey');
export const getJourney = (slug: string): Journey | undefined =>
  adminStore.listItems('journey').find(j => j.slug === slug || j.id === slug);

export const listConciergeServices = (): ConciergeService[] => adminStore.listItems('concierge');
export const getConciergeService = (slug: string): ConciergeService | undefined =>
  adminStore.listItems('concierge').find(c => c.slug === slug || c.id === slug);

export const listArticles = (): Article[] => adminStore.listItems('article');
export const getArticle = (slug: string): Article | undefined =>
  adminStore.listItems('article').find(a => a.slug === slug || a.id === slug);

/* ─── Users / Inquiries / Invitations — still seed-only ─── */

export const listUsers = (): User[] => users;
export const listInquiries = (): Inquiry[] => inquiries;
export const listInquiriesForUser = (userId: string): Inquiry[] =>
  inquiries.filter(i => i.userId === userId);

export const listInvitations = (): InvitationCode[] => invitations;

export { currentUser, operator };

export {
  articles,
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
