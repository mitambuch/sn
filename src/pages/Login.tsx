// ═══════════════════════════════════════════════════
// Login — three sign-in modes (email+password / magic link / invitation code)
//
// WHAT: Renders three editorial choice cards on first load. Selecting a
//       card swaps to the matching form. On submit, simulates a successful
//       auth in DEV (via AuthContext.__setDevSession) and navigates to
//       /:locale/account. Magic-link mode shows a confirmation screen.
//       Invitation-code mode redirects to /onboarding instead.
// WHEN: /:locale/login route. AuthContext is replaced live in lot A.5.
// EDIT COPY: src/locales/{fr,en}.json under auth.* — never inline.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { Input } from '@components/ui/Input';
import { SectionHeader } from '@components/ui/SectionHeader';
import { ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { cn } from '@utils/cn';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

type Mode = 'select' | 'email' | 'magic-link' | 'invitation' | 'magic-link-sent';

const ModeCard = ({
  title,
  hint,
  onClick,
}: {
  title: string;
  hint: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'border-border bg-surface/40 hover:border-fg/60 hover:bg-surface/80 group flex flex-col gap-3 rounded-lg border p-8 text-left',
      'duration-base transition-[border-color,background-color]',
      'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    )}
  >
    <span className="text-fg text-base font-medium">{title}</span>
    <span className="text-muted text-sm leading-relaxed">{hint}</span>
    <span
      aria-hidden="true"
      className="text-muted group-hover:text-fg duration-base mt-2 text-xs tracking-widest uppercase transition-colors"
    >
      →
    </span>
  </button>
);

const SubmitRow = ({
  onCancel,
  label,
  backLabel,
}: {
  onCancel: () => void;
  label: string;
  backLabel: string;
}) => (
  <div className="mt-2 flex items-center gap-4">
    <button
      type="submit"
      className="border-border bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {label}
      <span aria-hidden="true">→</span>
    </button>
    <button
      type="button"
      onClick={onCancel}
      className="text-muted hover:text-fg duration-base text-xs tracking-widest uppercase transition-colors"
    >
      ← {backLabel}
    </button>
  </div>
);

export default function Login() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const { __setDevSession } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const fakeSignIn = (target: 'account' | 'onboarding') => {
    __setDevSession('client');
    void navigate(localePath(target === 'account' ? ROUTES.ACCOUNT : ROUTES.ONBOARDING), {
      replace: true,
    });
  };

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    fakeSignIn('account');
  };

  const handleMagicLinkSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMode('magic-link-sent');
  };

  const handleInvitationSubmit = (e: FormEvent) => {
    e.preventDefault();
    fakeSignIn('onboarding');
  };

  const back = t('common.back');

  return (
    <Container size="md">
      <section className="flex min-h-[calc(100vh-14rem)] flex-col justify-center py-16">
        <SectionHeader eyebrow={t('public.tagline')} title={t('auth.tagline')} size="md" as="h1" />

        <div className="mt-12">
          {mode === 'select' && (
            <div className="grid gap-4 md:grid-cols-3">
              <ModeCard
                title={t('auth.modeEmail')}
                hint={t('auth.modeEmailHint')}
                onClick={() => setMode('email')}
              />
              <ModeCard
                title={t('auth.modeMagicLink')}
                hint={t('auth.modeMagicLinkHint')}
                onClick={() => setMode('magic-link')}
              />
              <ModeCard
                title={t('auth.modeInvitation')}
                hint={t('auth.modeInvitationHint')}
                onClick={() => setMode('invitation')}
              />
            </div>
          )}

          {mode === 'email' && (
            <form className="flex max-w-md flex-col gap-4" onSubmit={handleEmailSubmit}>
              <Input
                label={t('auth.email')}
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                label={t('auth.password')}
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <SubmitRow
                onCancel={() => setMode('select')}
                label={t('auth.signIn')}
                backLabel={back}
              />
            </form>
          )}

          {mode === 'magic-link' && (
            <form className="flex max-w-md flex-col gap-4" onSubmit={handleMagicLinkSubmit}>
              <Input
                label={t('auth.email')}
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <SubmitRow
                onCancel={() => setMode('select')}
                label={t('auth.modeMagicLink')}
                backLabel={back}
              />
            </form>
          )}

          {mode === 'invitation' && (
            <form className="flex max-w-md flex-col gap-4" onSubmit={handleInvitationSubmit}>
              <Input
                label={t('auth.code')}
                type="text"
                required
                placeholder="SAW-XXXX-XXXX"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
              />
              <SubmitRow
                onCancel={() => setMode('select')}
                label={t('auth.modeInvitation')}
                backLabel={back}
              />
            </form>
          )}

          {mode === 'magic-link-sent' && (
            <div className="border-border max-w-md rounded-lg border p-8">
              <p className="text-fg text-sm leading-relaxed">{t('auth.magicLinkSent')}</p>
              <button
                type="button"
                onClick={() => setMode('select')}
                className="text-muted hover:text-fg duration-base mt-6 text-xs tracking-widest uppercase transition-colors"
              >
                ← {t('auth.back')}
              </button>
            </div>
          )}
        </div>

        <div className="mt-16">
          <Link
            to={localePath(ROUTES.HOME)}
            className="text-muted hover:text-fg duration-base text-xs tracking-widest uppercase transition-colors"
          >
            ← {t('auth.back')}
          </Link>
        </div>
      </section>
    </Container>
  );
}
