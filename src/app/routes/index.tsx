import { AdminLayout } from '@app/layouts/AdminLayout';
import { AppLayout } from '@app/layouts/AppLayout';
import { PublicLayout } from '@app/layouts/PublicLayout';
import RootLayout from '@app/layouts/RootLayout';
import { LocaleProvider } from '@app/LocaleProvider';
import { LocaleRedirect } from '@app/LocaleRedirect';
import { Spinner } from '@components/ui/Spinner';
import { getInitialLocale, isLocale } from '@config/i18n';
import { ROUTES } from '@constants/routes';
import type { ComponentType } from 'react';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';

/* ─── Lazy loading with retry — survives chunk load failures ───
   Retries the dynamic import up to 3 times with exponential backoff.
   Handles deploy-time hash mismatches when users have stale tabs.
   ──────────────────────────────────────────────────────────── */
function lazyWithRetry<T extends ComponentType>(
  factory: () => Promise<{ default: T }>,
  retries = 3,
) {
  return lazy(() => {
    const attempt = (remaining: number): Promise<{ default: T }> =>
      factory().catch((err: unknown) => {
        if (remaining <= 0) return Promise.reject(err);
        return new Promise<{ default: T }>(resolve =>
          setTimeout(() => resolve(attempt(remaining - 1)), 2 ** (retries - remaining) * 1000),
        );
      });
    return attempt(retries);
  });
}

/* ─── Public ─── */

const Home = lazyWithRetry(() => import('@pages/Home'));
const Playground = lazyWithRetry(() => import('@pages/Playground'));
const Lab = lazyWithRetry(() => import('@pages/Lab'));
const NotFound = lazyWithRetry(() => import('@pages/NotFound'));
const Login = lazyWithRetry(() => import('@pages/Login'));
const Onboarding = lazyWithRetry(() => import('@pages/Onboarding'));
const AccountDashboard = lazyWithRetry(() => import('@pages/AccountDashboard'));
const PropertiesList = lazyWithRetry(() => import('@pages/PropertiesList'));
const PropertyDetail = lazyWithRetry(() => import('@pages/PropertyDetail'));
const TimepiecesList = lazyWithRetry(() => import('@pages/TimepiecesList'));
const TimepieceDetail = lazyWithRetry(() => import('@pages/TimepieceDetail'));
const ArtworksList = lazyWithRetry(() => import('@pages/ArtworksList'));
const ArtworkDetail = lazyWithRetry(() => import('@pages/ArtworkDetail'));
const EventsList = lazyWithRetry(() => import('@pages/EventsList'));
const EventDetail = lazyWithRetry(() => import('@pages/EventDetail'));
const JourneysList = lazyWithRetry(() => import('@pages/JourneysList'));
const JourneyDetail = lazyWithRetry(() => import('@pages/JourneyDetail'));
const ConciergeList = lazyWithRetry(() => import('@pages/ConciergeList'));
const ConciergeDetail = lazyWithRetry(() => import('@pages/ConciergeDetail'));
const AccountProfile = lazyWithRetry(() => import('@pages/AccountProfile'));
const AccountInquiries = lazyWithRetry(() => import('@pages/AccountInquiries'));
const AccountPreferences = lazyWithRetry(() => import('@pages/AccountPreferences'));
const AdminDashboard = lazyWithRetry(() => import('@pages/AdminDashboard'));
const AdminInvitations = lazyWithRetry(() => import('@pages/AdminInvitations'));
const AdminInquiries = lazyWithRetry(() => import('@pages/AdminInquiries'));
const AdminUsers = lazyWithRetry(() => import('@pages/AdminUsers'));
const NewsList = lazyWithRetry(() => import('@pages/NewsList'));
const NewsDetail = lazyWithRetry(() => import('@pages/NewsDetail'));
const AccountSaved = lazyWithRetry(() => import('@pages/AccountSaved'));

/* ─── Loading fallback — themed, no white flash ───────────────── */
function PageLoader() {
  return (
    <div className="bg-bg flex min-h-screen items-center justify-center">
      <Spinner size="sm" aria-label="Loading page" />
    </div>
  );
}

/* ─── Locale-scoped layout ──────────────────────────────────── */
function LocaleLayout() {
  const { locale: param } = useParams<{ locale?: string }>();
  const { pathname, search, hash } = useLocation();

  if (param !== undefined && !isLocale(param)) {
    const fallback = getInitialLocale();
    return <Navigate to={`/${fallback}${pathname}${search}${hash}`} replace />;
  }

  return (
    <LocaleProvider>
      <RootLayout />
    </LocaleProvider>
  );
}

/* ─── Main router ─────────────────────────────────────────────
   All concrete pages land in lot B per phase. Until then, route
   placeholders render <ComingSoon titleKey="..." />.
   ─────────────────────────────────────────────────────────── */
export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ─── Un-prefixed → redirect to detected locale ─── */}
        <Route path={ROUTES.HOME} element={<LocaleRedirect />} />
        <Route path={ROUTES.PLAYGROUND} element={<LocaleRedirect />} />
        <Route path={ROUTES.LAB} element={<LocaleRedirect />} />

        {/* ─── Canonical locale-prefixed tree ─── */}
        <Route path="/:locale" element={<LocaleLayout />}>
          {/* ─── Public surface ─── */}
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="playground" element={<Playground />} />
            <Route path="lab" element={<Lab />} />
            <Route path="login" element={<Login />} />
            <Route path="onboarding" element={<Onboarding />} />
          </Route>

          {/* ─── Member surface (RequireAuth via AppLayout) ─── */}
          <Route path="account" element={<AppLayout />}>
            <Route index element={<AccountDashboard />} />
            <Route path="news" element={<NewsList />} />
            <Route path="news/:slug" element={<NewsDetail />} />
            <Route path="saved" element={<AccountSaved />} />
            <Route path="events" element={<EventsList />} />
            <Route path="events/:slug" element={<EventDetail />} />
            <Route path="properties" element={<PropertiesList />} />
            <Route path="properties/:slug" element={<PropertyDetail />} />
            <Route path="timepieces" element={<TimepiecesList />} />
            <Route path="timepieces/:slug" element={<TimepieceDetail />} />
            <Route path="artworks" element={<ArtworksList />} />
            <Route path="artworks/:slug" element={<ArtworkDetail />} />
            <Route path="journeys" element={<JourneysList />} />
            <Route path="journeys/:slug" element={<JourneyDetail />} />
            <Route path="concierge" element={<ConciergeList />} />
            <Route path="concierge/:slug" element={<ConciergeDetail />} />
            <Route path="profile" element={<AccountProfile />} />
            <Route path="inquiries" element={<AccountInquiries />} />
            <Route path="preferences" element={<AccountPreferences />} />
          </Route>

          {/* ─── Admin surface (RequireRole 'admin' via AdminLayout) ─── */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="invitations" element={<AdminInvitations />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ─── Catch-all outside the locale tree ──────────── */}
        <Route path={ROUTES.NOT_FOUND} element={<LocaleRedirect />} />
      </Routes>
    </Suspense>
  );
}
