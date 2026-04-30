/* ═══════════════════════════════════════════════════════════════
   ROUTES — single source of truth for all URLs
   Always use these constants, never hardcode strings.

   Paths are locale-agnostic; the active locale is prepended at render
   time via `localePath(locale, ROUTES.X)` from @config/i18n.

   Surface boundaries (see CLAUDE.md):
   - Public      → flat under /:locale/ (HOME, LOGIN, ONBOARDING, PLAYGROUND, LAB)
   - Client      → under /:locale/account/* (RequireAuth, AppLayout)
   - Admin       → under /:locale/admin/*  (RequireRole 'admin', AdminLayout)
   ═══════════════════════════════════════════════════════════════ */

export const ROUTES = {
  // ─── Public ──────────────────────────────────────────
  HOME: '/',
  INVITE: '/invite/:code',
  LOGIN: '/login',
  ONBOARDING: '/onboarding',
  PLAYGROUND: '/playground',
  LAB: '/lab',

  // ─── Client (RequireAuth) ────────────────────────────
  ACCOUNT: '/account',
  ACCOUNT_EVENTS: '/account/events',
  ACCOUNT_EVENT_DETAIL: '/account/events/:slug',
  ACCOUNT_PROPERTIES: '/account/properties',
  ACCOUNT_PROPERTY_DETAIL: '/account/properties/:slug',
  ACCOUNT_TIMEPIECES: '/account/timepieces',
  ACCOUNT_TIMEPIECE_DETAIL: '/account/timepieces/:slug',
  ACCOUNT_ARTWORKS: '/account/artworks',
  ACCOUNT_ARTWORK_DETAIL: '/account/artworks/:slug',
  ACCOUNT_JOURNEYS: '/account/journeys',
  ACCOUNT_JOURNEY_DETAIL: '/account/journeys/:slug',
  ACCOUNT_CONCIERGE: '/account/concierge',
  ACCOUNT_CONCIERGE_DETAIL: '/account/concierge/:slug',
  ACCOUNT_PROFILE: '/account/profile',
  ACCOUNT_INQUIRIES: '/account/inquiries',
  ACCOUNT_PREFERENCES: '/account/preferences',
  ACCOUNT_NEWS: '/account/news',
  ACCOUNT_NEWS_DETAIL: '/account/news/:slug',
  ACCOUNT_SAVED: '/account/saved',

  // ─── Admin (RequireRole 'admin') ─────────────────────
  ADMIN: '/admin',
  ADMIN_CATALOGUE: '/admin/catalogue',
  ADMIN_INVITATIONS: '/admin/invitations',
  ADMIN_INQUIRIES: '/admin/inquiries',
  ADMIN_USERS: '/admin/users',

  NOT_FOUND: '*',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
