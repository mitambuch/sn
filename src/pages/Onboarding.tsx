// ═══════════════════════════════════════════════════
// Onboarding — cinematic welcome screen for a freshly-created account
//
// WHAT: Full-bleed image background + a single welcome panel introducing
//       the dedicated concierge. No inputs: the invitation code is already
//       consumed and the password already set during registration (see
//       Login → registerWithCode). This screen is purely the warm landing
//       before the member space.
// WHEN: Reached right after a successful first connection. Skippable from
//       the top-right; "Découvrir mon espace" leads to /account.
// EDIT COPY: src/locales/{fr,en}.json under onboarding.* — never inline.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Image } from '@components/ui/Image';
import { ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { unsplash } from '@/mocks/unsplash';

export default function Onboarding() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const navigate = useNavigate();
  const { user } = useAuth();

  const goAccount = () => {
    localStorage.setItem('__sn_onboarding_seen', 'true');
    void navigate(localePath(ROUTES.ACCOUNT), { replace: true });
  };

  // First name only for a warm, discreet greeting (HNW voice — no gush).
  const firstName = user?.fullName?.trim().split(/\s+/)[0] ?? '';

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={unsplash('private-jet-cabin-leather-interior')}
          alt={t('onboarding.welcome.imageAlt')}
          eager
          ratio="16/9"
          wrapperClassName="absolute inset-0 h-full w-full"
          className="h-full w-full object-cover"
        />
        <div
          className="from-bg/95 via-bg/70 to-bg/40 absolute inset-0 bg-linear-to-tr"
          aria-hidden="true"
        />
      </div>

      <header className="relative z-10 flex items-start justify-between px-6 py-6 md:px-12 md:py-10">
        <span className="text-fg font-mono text-xs tracking-[0.4em] uppercase">S — N</span>
        <button
          type="button"
          onClick={goAccount}
          className="text-muted hover:text-fg duration-base text-xs tracking-widest uppercase transition-colors"
        >
          {t('onboarding.skip')}
        </button>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-8rem)] items-center px-6 md:px-12">
        <div className="motion-safe:animate-in motion-safe:fade-in flex w-full max-w-2xl flex-col gap-8 motion-safe:duration-700">
          <span className="text-muted text-xs tracking-[0.3em] uppercase">
            {t('onboarding.welcome.eyebrow')}
          </span>
          <h1 className="text-fg max-w-xl font-mono text-3xl font-bold tracking-tight text-balance uppercase md:text-4xl lg:text-5xl">
            {firstName
              ? t('onboarding.welcome.titleNamed', { name: firstName })
              : t('onboarding.welcome.title')}
          </h1>
          <p className="text-muted max-w-xl text-base leading-relaxed text-pretty md:text-lg">
            {t('onboarding.welcome.lede')}
          </p>

          <div className="border-border bg-surface/60 max-w-md rounded-lg border p-6 backdrop-blur-md">
            <span className="text-muted text-xs tracking-widest uppercase">
              {t('dock.eyebrow')}
            </span>
            <p className="text-fg mt-1 text-lg font-medium">Valmont Seragone Mato</p>
            <p className="text-muted mt-1 text-sm">valmont@sawnext.studio</p>
            <p className="text-muted mt-3 text-sm leading-relaxed">{t('dock.availability')}</p>
          </div>

          <div className="mt-2">
            <button
              type="button"
              onClick={goAccount}
              className="border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent duration-base inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase transition-[border-color,background-color] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {t('onboarding.enter')}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
