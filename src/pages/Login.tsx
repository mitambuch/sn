// ═══════════════════════════════════════════════════
// Login — three sign-in modes (email+password / magic link / invitation code)
//
// WHAT: Renders three editorial choice cards on first load (landing v2
//       visual language : data-theme='dark' wrapper + monumental mono
//       headline + uppercase tracking). Selecting a card swaps to the
//       matching form. Calls AuthContext methods which route to Supabase
//       when env is wired, or DEV stubs otherwise. Magic-link + invitation
//       modes show a confirmation screen — the user completes signin by
//       clicking the link in their inbox.
// WHEN: /:locale/login route. AuthContext owns the live-vs-stub branch.
// EDIT COPY: src/locales/{fr,en}.json under auth.* — never inline.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Input } from '@components/ui/Input';
import { ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { cn } from '@utils/cn';
import { type FormEvent, type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

type Mode = 'select' | 'email' | 'magic-link' | 'invitation' | 'magic-link-sent';
type FormMode = 'email' | 'magic-link' | 'invitation';

const ModeCard = ({
  num,
  title,
  hint,
  onClick,
}: {
  num: string;
  title: string;
  hint: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'border-border bg-surface/40 hover:border-fg/60 hover:bg-surface/70 group flex h-full flex-col gap-6 rounded-lg border p-8 text-left md:p-10',
      'duration-base transition-[border-color,background-color]',
      'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    )}
  >
    <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">{num}</span>
    <span className="text-fg font-mono text-lg leading-tight font-medium tracking-tight uppercase md:text-xl">
      {title}
    </span>
    <span className="text-muted/90 mt-auto text-sm leading-relaxed">{hint}</span>
    <span
      aria-hidden="true"
      className="text-muted/60 group-hover:text-fg duration-base font-mono text-[10px] tracking-[0.3em] uppercase transition-colors"
    >
      Choisir ↗
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
  <form className="flex max-w-md flex-col gap-5" onSubmit={onSubmit}>
    {children}
    {error && (
      <p
        role="alert"
        className="text-danger border-danger/30 bg-danger/4 rounded-md border px-3 py-2 text-xs leading-relaxed"
      >
        {error}
      </p>
    )}
    <div className="mt-2 flex items-center gap-4">
      <button
        type="submit"
        disabled={submitting}
        className="border-border bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent inline-flex items-center gap-3 rounded-full border px-7 py-3.5 font-mono text-xs tracking-[0.3em] uppercase focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? '…' : label}
        {!submitting && <span aria-hidden="true">↗</span>}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="text-muted hover:text-fg duration-base font-mono text-[11px] tracking-[0.2em] uppercase transition-colors"
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

// eslint-disable-next-line max-lines-per-function -- page composition with 3 auth modes + monumental layout
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
    <section data-theme="dark" className="bg-bg text-fg relative min-h-screen overflow-hidden">
      {/* ─── Top corner — back-to-home + eyebrow ─── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-5 md:px-12 md:py-8">
        <Link
          to={localePath(ROUTES.HOME)}
          className="text-muted hover:text-fg pointer-events-auto font-mono text-[11px] tracking-[0.3em] uppercase transition-colors"
        >
          ← {t('auth.back')}
        </Link>
        <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
          {t('auth.tagEyebrow')}
        </span>
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-16 px-5 py-32 md:gap-24 md:px-12 md:py-40">
        {/* ─── Monumental headline ─── */}
        <header className="flex flex-col gap-6">
          <h1 className="max-w-5xl font-mono text-[clamp(2rem,6vw,5.5rem)] leading-[0.92] font-medium tracking-tight uppercase">
            {t('auth.titleA')}
            <br />
            <span className="text-muted">{t('auth.titleB')}</span>
          </h1>
          <p className="text-muted max-w-2xl text-base leading-relaxed md:text-lg">
            {t('auth.lede')}
          </p>
        </header>

        {/* ─── Body ─── */}
        <div>
          {mode === 'select' && (
            <div className="grid gap-4 md:grid-cols-3 md:gap-6">
              <ModeCard
                num="01"
                title={t('auth.modeEmail')}
                hint={t('auth.modeEmailHint')}
                onClick={() => {
                  resetTo('email');
                }}
              />
              <ModeCard
                num="02"
                title={t('auth.modeMagicLink')}
                hint={t('auth.modeMagicLinkHint')}
                onClick={() => {
                  resetTo('magic-link');
                }}
              />
              <ModeCard
                num="03"
                title={t('auth.modeInvitation')}
                hint={t('auth.modeInvitationHint')}
                onClick={() => {
                  resetTo('invitation');
                }}
              />
            </div>
          )}

          {current && (
            <div className="flex flex-col gap-6">
              <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
                {current.label}
              </span>
              <FormShell
                onSubmit={current.onSubmit}
                error={error}
                onCancel={() => {
                  resetTo('select');
                }}
                label={current.label}
                backLabel={back}
                submitting={submitting}
              >
                {current.fields}
              </FormShell>
            </div>
          )}

          {mode === 'magic-link-sent' && (
            <div className="border-border bg-surface/40 flex max-w-lg flex-col gap-5 rounded-lg border p-8 md:p-10">
              <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
                {t('auth.magicLinkSentTag')}
              </span>
              <p className="text-fg text-sm leading-relaxed md:text-base">
                {t('auth.magicLinkSent')}
              </p>
              <button
                type="button"
                onClick={() => {
                  resetTo('select');
                }}
                className="text-muted hover:text-fg duration-base self-start font-mono text-[11px] tracking-[0.2em] uppercase transition-colors"
              >
                ← {t('auth.back')}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
