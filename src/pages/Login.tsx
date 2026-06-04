// ═══════════════════════════════════════════════════
// Login — full-screen access shell (deep-link target for the email)
//
// WHAT: A full-screen darkened backdrop with a centered card that hosts the
//       shared <LoginPanel/>. This is the page the acceptance email links to
//       (saw-next.ch/fr/login) and the destination RequireAuth redirects to.
//       The landing also exposes the SAME panel as an overlay (LoginModal) —
//       both render LoginPanel so the flow never diverges.
// WHEN: /:locale/login route — outside PublicLayout so no header/footer
//       chrome bleeds through. Esc + top-right X go home.
// EDIT COPY: src/locales/{fr,en}.json under auth.* — never inline.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { ROUTES } from '@constants/routes';
import { LoginPanel, type LoginPanelMode } from '@features/access/LoginPanel';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Login() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();

  // RequireAuth stores the gated destination in state.from — return there
  // after sign-in (e.g. a shared fiche URL). The acceptance email / access
  // modal can also pre-open the first-connection form with the code.
  const navState = location.state as {
    from?: { pathname?: string; search?: string };
    invitationCode?: string;
    mode?: LoginPanelMode;
  } | null;
  const redirectTo = navState?.from?.pathname
    ? `${navState.from.pathname}${navState.from.search ?? ''}`
    : localePath(ROUTES.ACCOUNT);

  // Esc dismisses → navigate home (modal semantics on a real route).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        void navigate(localePath(ROUTES.HOME), { replace: true });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [navigate, localePath]);

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      className="bg-bg/95 text-fg fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-5 py-10 backdrop-blur-md"
    >
      <div className="border-border bg-bg relative flex w-full max-w-md flex-col rounded-xl border p-7 shadow-2xl md:p-9">
        <Link
          to={localePath(ROUTES.HOME)}
          aria-label={t('common.close')}
          className="text-muted hover:text-fg focus-visible:ring-accent absolute top-3 right-3 rounded-md p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <X size={18} strokeWidth={1.5} aria-hidden="true" />
        </Link>

        <LoginPanel
          initialMode={navState?.mode ?? 'select'}
          initialCode={navState?.invitationCode ?? ''}
          onRegistered={() => {
            void navigate(localePath(ROUTES.ONBOARDING), { replace: true });
          }}
          onSignedIn={() => {
            void navigate(redirectTo, { replace: true });
          }}
        />
      </div>
    </section>
  );
}
