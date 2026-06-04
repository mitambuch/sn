// ═══════════════════════════════════════════════════
// LoginPanel — the shared sign-in UI + logic (no chrome, no routing)
//
// WHAT: The single source of truth for the access tunnel. Renders the door
//       selector and the three forms, and talks to the auth layer:
//         • "Première connexion" — invitation code + email + password (with
//           confirmation) → registerWithCode() creates the account.
//         • "Email + mot de passe" — returning member → signIn().
//         • "Mot de passe oublié" — requestPasswordReset() emails a link.
//       It owns ZERO chrome and ZERO navigation: the page shell (Login.tsx)
//       and the landing modal (LoginModal.tsx) both render this same panel
//       and provide their own container + post-auth navigation via the
//       onRegistered / onSignedIn callbacks. One flow, two frames — so the
//       two entry points can never drift apart again.
// WHEN: Used by src/pages/Login.tsx and src/features/access/LoginModal.tsx.
// EDIT COPY: src/locales/{fr,en}.json under auth.* — never inline.
// ═══════════════════════════════════════════════════

import { Input } from '@components/ui/Input';
import { useAuth } from '@context/AuthContext';
import { cn } from '@utils/cn';
import { KeyRound, type LucideIcon, Ticket } from 'lucide-react';
import { type FormEvent, type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { INVITATION_CODE_CANONICAL_PATTERN, normalizeInvitationCode } from '@/types/invitation';

export type LoginPanelMode =
  | 'select'
  | 'first'
  | 'returning'
  | 'forgot'
  | 'forgot-sent'
  | 'confirm-sent';

const MIN_PASSWORD_LENGTH = 8;

interface LoginPanelProps {
  /** Door to open on mount. Defaults to the selector. */
  initialMode?: LoginPanelMode;
  /** Pre-fill the first-connection code (from the acceptance email link). */
  initialCode?: string;
  /** First connection succeeded with a live session → go to the welcome. */
  onRegistered: () => void;
  /** Returning member signed in → go to their space. */
  onSignedIn: () => void;
}

const ModeRow = ({
  icon: Icon,
  title,
  hint,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  hint: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'border-border bg-surface/30 hover:border-fg/60 hover:bg-surface/60 group grid w-full grid-cols-[44px_1fr_auto] items-center gap-4 rounded-xl border px-4 py-4 text-left',
      'duration-base transition-[border-color,background-color]',
      'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    )}
  >
    <span
      aria-hidden="true"
      className="border-border bg-bg/60 text-fg group-hover:border-fg/40 duration-base flex h-11 w-11 items-center justify-center rounded-lg border transition-colors"
    >
      <Icon size={18} strokeWidth={1.6} />
    </span>
    <span className="flex flex-col gap-1">
      <span className="text-fg text-sm leading-tight font-medium">{title}</span>
      <span className="text-muted text-xs leading-snug">{hint}</span>
    </span>
    <span
      aria-hidden="true"
      className="text-muted/60 group-hover:text-fg font-mono text-base transition-colors"
    >
      ↗
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
  footer,
}: {
  onSubmit: (e: FormEvent) => void;
  children: ReactNode;
  error: string | null;
  onCancel: () => void;
  label: string;
  backLabel: string;
  submitting: boolean;
  footer?: ReactNode;
}) => (
  <form className="flex flex-col gap-5" onSubmit={onSubmit}>
    {children}
    {error && (
      <p
        role="alert"
        className="text-danger border-danger/30 bg-danger/4 rounded-md border px-3 py-2 text-xs leading-relaxed"
      >
        {error}
      </p>
    )}
    <div className="mt-1 flex items-center gap-4">
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
    {footer}
  </form>
);

const SentPanel = ({
  tag,
  body,
  onBack,
  backLabel,
}: {
  tag: string;
  body: string;
  onBack: () => void;
  backLabel: string;
}) => (
  <div className="border-border bg-surface/40 flex flex-col gap-4 rounded-lg border p-5">
    <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">{tag}</span>
    <p className="text-fg text-sm leading-relaxed">{body}</p>
    <button
      type="button"
      onClick={onBack}
      className="text-muted hover:text-fg duration-base self-start font-mono text-[11px] tracking-[0.2em] uppercase transition-colors"
    >
      ← {backLabel}
    </button>
  </div>
);

export const LoginPanel = ({
  initialMode = 'select',
  initialCode = '',
  onRegistered,
  onSignedIn,
}: LoginPanelProps) => {
  const { t } = useTranslation();
  const { signIn, registerWithCode, requestPasswordReset } = useAuth();

  const [mode, setMode] = useState<LoginPanelMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fullName, setFullName] = useState('');
  const [code, setCode] = useState(initialCode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetTo = (next: LoginPanelMode) => {
    setError(null);
    setMode(next);
  };

  const run = async (
    action: () => Promise<{ ok: boolean; error?: string; needsEmailConfirm?: boolean }>,
    onOk: (r: { needsEmailConfirm?: boolean }) => void,
  ): Promise<void> => {
    setSubmitting(true);
    setError(null);
    const result = await action();
    setSubmitting(false);
    if (result.ok) onOk(result);
    else setError(result.error ?? t('common.error'));
  };

  const submitFirst = (e: FormEvent) => {
    e.preventDefault();
    if (!INVITATION_CODE_CANONICAL_PATTERN.test(normalizeInvitationCode(code))) {
      setError(t('auth.codeInvalid'));
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(t('auth.passwordTooShort'));
      return;
    }
    if (password !== confirm) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    void run(
      () => registerWithCode({ email, code, password, fullName }),
      result => {
        if (result.needsEmailConfirm) resetTo('confirm-sent');
        else onRegistered();
      },
    );
  };

  const submitReturning = (e: FormEvent) => {
    e.preventDefault();
    void run(() => signIn(email, password), onSignedIn);
  };

  const submitForgot = (e: FormEvent) => {
    e.preventDefault();
    void run(
      () => requestPasswordReset(email),
      () => resetTo('forgot-sent'),
    );
  };

  const back = t('common.back');

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 pr-8">
        <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
          {t('auth.tagEyebrow')}
        </span>
        <h2
          id="login-title"
          className="font-mono text-xl leading-tight font-semibold tracking-tight uppercase md:text-2xl"
        >
          {t('auth.titleModal')}
        </h2>
        <p className="text-muted text-sm leading-relaxed">{t('auth.ledeModal')}</p>
      </header>

      {mode === 'select' && (
        <div className="flex flex-col gap-2.5">
          <ModeRow
            icon={Ticket}
            title={t('auth.modeFirst')}
            hint={t('auth.modeFirstHint')}
            onClick={() => resetTo('first')}
          />
          <ModeRow
            icon={KeyRound}
            title={t('auth.modeReturning')}
            hint={t('auth.modeReturningHint')}
            onClick={() => resetTo('returning')}
          />
        </div>
      )}

      {mode === 'first' && (
        <div className="flex flex-col gap-4">
          <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
            {t('auth.modeFirst')}
          </span>
          <FormShell
            onSubmit={submitFirst}
            error={error}
            onCancel={() => resetTo('select')}
            label={t('auth.createAccount')}
            backLabel={back}
            submitting={submitting}
          >
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
              placeholder="XXXXXXXX"
              autoCapitalize="characters"
              spellCheck={false}
              className="font-mono tracking-[0.18em] uppercase"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
            />
            <Input
              label={t('common.fullName')}
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
            <Input
              label={t('auth.password')}
              type="password"
              autoComplete="new-password"
              required
              helperText={t('auth.createPasswordHelper')}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Input
              label={t('auth.confirmPassword')}
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
          </FormShell>
        </div>
      )}

      {mode === 'returning' && (
        <div className="flex flex-col gap-4">
          <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
            {t('auth.modeReturning')}
          </span>
          <FormShell
            onSubmit={submitReturning}
            error={error}
            onCancel={() => resetTo('select')}
            label={t('auth.signIn')}
            backLabel={back}
            submitting={submitting}
            footer={
              <button
                type="button"
                onClick={() => resetTo('forgot')}
                className="text-muted hover:text-fg self-start text-xs underline-offset-4 transition-colors hover:underline"
              >
                {t('auth.forgotPassword')}
              </button>
            }
          >
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
          </FormShell>
        </div>
      )}

      {mode === 'forgot' && (
        <div className="flex flex-col gap-4">
          <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
            {t('auth.forgotTitle')}
          </span>
          <p className="text-muted text-sm leading-relaxed">{t('auth.forgotLede')}</p>
          <FormShell
            onSubmit={submitForgot}
            error={error}
            onCancel={() => resetTo('returning')}
            label={t('auth.forgotCta')}
            backLabel={back}
            submitting={submitting}
          >
            <Input
              label={t('auth.email')}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </FormShell>
        </div>
      )}

      {mode === 'forgot-sent' && (
        <SentPanel
          tag={t('auth.forgotSentTag')}
          body={t('auth.forgotSent')}
          onBack={() => resetTo('returning')}
          backLabel={t('auth.back')}
        />
      )}
      {mode === 'confirm-sent' && (
        <SentPanel
          tag={t('auth.confirmEmailTag')}
          body={t('auth.confirmEmailSent')}
          onBack={() => resetTo('returning')}
          backLabel={t('auth.back')}
        />
      )}
    </div>
  );
};
