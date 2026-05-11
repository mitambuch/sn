// ═══════════════════════════════════════════════════
// Login — three sign-in modes (email+password / magic link / invitation code)
//
// WHAT: Renders three editorial choice cards on first load. Selecting a
//       card swaps to the matching form. Calls AuthContext methods which
//       route to Supabase when env is wired, or DEV stubs otherwise.
//       Magic-link + invitation modes show a confirmation screen — the
//       user completes signin by clicking the link in their inbox.
// WHEN: /:locale/login route. AuthContext owns the live-vs-stub branch.
// EDIT COPY: src/locales/{fr,en}.json under auth.* — never inline.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { Input } from '@components/ui/Input';
import { SectionHeader } from '@components/ui/SectionHeader';
import { ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { cn } from '@utils/cn';
import { type FormEvent, type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

type Mode = 'select' | 'email' | 'magic-link' | 'invitation' | 'magic-link-sent';
type FormMode = 'email' | 'magic-link' | 'invitation';

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

const FormShell = ({
  onSubmit,
  children,
  error,
  onCancel,
  label,
  backLabel,
  submitting,
}: {
  onSubmit: (e: FormEvent) => void;
  children: ReactNode;
  error: string | null;
  onCancel: () => void;
  label: string;
  backLabel: string;
  submitting: boolean;
}) => (
  <form className="flex max-w-md flex-col gap-4" onSubmit={onSubmit}>
    {children}
    {error && <p className="text-muted text-xs leading-relaxed">{error}</p>}
    <div className="mt-2 flex items-center gap-4">
      <button
        type="submit"
        disabled={submitting}
        className="border-border bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? '…' : label}
        {!submitting && <span aria-hidden="true">→</span>}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="text-muted hover:text-fg duration-base text-xs tracking-widest uppercase transition-colors"
      >
        ← {backLabel}
      </button>
    </div>
  </form>
);

interface MetaInput {
  t: (key: string) => string;
  email: string;
  password: string;
  code: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setCode: (v: string) => void;
  setMode: (m: Mode) => void;
  navigateToAccount: () => void;
  runAuth: (
    action: () => Promise<{ ok: boolean; error?: string }>,
    onOk: () => void,
  ) => Promise<void>;
  signIn: (e: string, p: string) => Promise<{ ok: boolean; error?: string }>;
  signInWithMagicLink: (e: string) => Promise<{ ok: boolean; error?: string }>;
  redeemInvitationCode: (c: string, e: string) => Promise<{ ok: boolean; error?: string }>;
}

interface FormMeta {
  label: string;
  onSubmit: (e: FormEvent) => void;
  fields: ReactNode;
}

const buildMeta = (input: MetaInput): Record<FormMode, FormMeta> => {
  const {
    t,
    email,
    password,
    code,
    setEmail,
    setPassword,
    setCode,
    setMode,
    navigateToAccount,
    runAuth,
    signIn,
    signInWithMagicLink,
    redeemInvitationCode,
  } = input;
  return {
    email: {
      label: t('auth.signIn'),
      onSubmit: e => {
        e.preventDefault();
        void runAuth(() => signIn(email, password), navigateToAccount);
      },
      fields: (
        <>
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
        </>
      ),
    },
    'magic-link': {
      label: t('auth.modeMagicLink'),
      onSubmit: e => {
        e.preventDefault();
        void runAuth(
          () => signInWithMagicLink(email),
          () => setMode('magic-link-sent'),
        );
      },
      fields: (
        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      ),
    },
    invitation: {
      label: t('auth.modeInvitation'),
      onSubmit: e => {
        e.preventDefault();
        void runAuth(
          () => redeemInvitationCode(code, email),
          () => setMode('magic-link-sent'),
        );
      },
      fields: (
        <>
          <Input
            label={t('auth.email')}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            label={t('auth.code')}
            type="text"
            required
            placeholder="SAW-XXXX-XXXX"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
          />
        </>
      ),
    },
  };
};

export default function Login() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const { signIn, signInWithMagicLink, redeemInvitationCode } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetTo = (next: Mode) => {
    setError(null);
    setMode(next);
  };

  const runAuth = async (
    action: () => Promise<{ ok: boolean; error?: string }>,
    onOk: () => void,
  ): Promise<void> => {
    setSubmitting(true);
    setError(null);
    const result = await action();
    setSubmitting(false);
    if (result.ok) {
      onOk();
    } else {
      setError(result.error ?? 'Erreur inconnue');
    }
  };

  const meta = buildMeta({
    t,
    email,
    password,
    code,
    setEmail,
    setPassword,
    setCode,
    setMode,
    navigateToAccount: () => {
      void navigate(localePath(ROUTES.ACCOUNT), { replace: true });
    },
    runAuth,
    signIn,
    signInWithMagicLink,
    redeemInvitationCode,
  });

  const back = t('common.back');
  const isFormMode = mode === 'email' || mode === 'magic-link' || mode === 'invitation';
  const current = isFormMode ? meta[mode] : null;

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
                onClick={() => resetTo('email')}
              />
              <ModeCard
                title={t('auth.modeMagicLink')}
                hint={t('auth.modeMagicLinkHint')}
                onClick={() => resetTo('magic-link')}
              />
              <ModeCard
                title={t('auth.modeInvitation')}
                hint={t('auth.modeInvitationHint')}
                onClick={() => resetTo('invitation')}
              />
            </div>
          )}

          {current && (
            <FormShell
              onSubmit={current.onSubmit}
              error={error}
              onCancel={() => resetTo('select')}
              label={current.label}
              backLabel={back}
              submitting={submitting}
            >
              {current.fields}
            </FormShell>
          )}

          {mode === 'magic-link-sent' && (
            <div className="border-border max-w-md rounded-lg border p-8">
              <p className="text-fg text-sm leading-relaxed">{t('auth.magicLinkSent')}</p>
              <button
                type="button"
                onClick={() => resetTo('select')}
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
