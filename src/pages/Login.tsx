// ═══════════════════════════════════════════════════
// Login — three sign-in modes rendered as a centered popup card
//
// WHAT: Full-screen darkened backdrop with a centered max-w-md card
//       (popup-like). On first load shows three COMPACT one-line mode
//       rows (NOT big editorial cards — visual language is "form choice",
//       not "value prop"). Selecting a row swaps to the matching form
//       inside the same card. The route exists for deep-link callbacks
//       (magic-link, invitation flow) but visually behaves like a modal
//       overlaid on the home page. Esc + top-right X both go home.
// WHEN: /:locale/login route — outside PublicLayout so no header/footer
//       chrome bleeds through.
// EDIT COPY: src/locales/{fr,en}.json under auth.* — never inline.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Input } from '@components/ui/Input';
import { ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { cn } from '@utils/cn';
import { X } from 'lucide-react';
import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

type Mode = 'select' | 'email' | 'magic-link' | 'invitation' | 'magic-link-sent';
type FormMode = 'email' | 'magic-link' | 'invitation';

const ModeRow = ({
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
      'border-border bg-surface/30 hover:border-fg/60 hover:bg-surface/60 group flex items-center justify-between gap-4 rounded-lg border px-4 py-3.5 text-left',
      'duration-base transition-[border-color,background-color]',
      'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    )}
  >
    <div className="flex flex-col gap-1">
      <span className="text-fg text-sm leading-tight font-medium">{title}</span>
      <span className="text-muted text-xs leading-snug">{hint}</span>
    </div>
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

// eslint-disable-next-line max-lines-per-function -- modal page with 3 auth modes + dialog semantics
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
      <div className="border-border bg-bg relative flex w-full max-w-md flex-col gap-6 rounded-xl border p-7 shadow-2xl md:p-9">
        {/* ─── Close ─── */}
        <Link
          to={localePath(ROUTES.HOME)}
          aria-label={t('common.close')}
          className="text-muted hover:text-fg focus-visible:ring-accent absolute top-3 right-3 rounded-md p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <X size={18} strokeWidth={1.5} aria-hidden="true" />
        </Link>

        {/* ─── Header (compact) ─── */}
        <header className="flex flex-col gap-2 pr-8">
          <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
            {t('auth.tagEyebrow')}
          </span>
          <h1
            id="login-title"
            className="font-mono text-xl leading-tight font-semibold tracking-tight uppercase md:text-2xl"
          >
            {t('auth.titleModal')}
          </h1>
          <p className="text-muted text-sm leading-relaxed">{t('auth.ledeModal')}</p>
        </header>

        {/* ─── Body ─── */}
        {mode === 'select' && (
          <div className="flex flex-col gap-2.5">
            <ModeRow
              title={t('auth.modeEmail')}
              hint={t('auth.modeEmailHint')}
              onClick={() => {
                resetTo('email');
              }}
            />
            <ModeRow
              title={t('auth.modeMagicLink')}
              hint={t('auth.modeMagicLinkHint')}
              onClick={() => {
                resetTo('magic-link');
              }}
            />
            <ModeRow
              title={t('auth.modeInvitation')}
              hint={t('auth.modeInvitationHint')}
              onClick={() => {
                resetTo('invitation');
              }}
            />
          </div>
        )}

        {current && (
          <div className="flex flex-col gap-4">
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
          <div className="border-border bg-surface/40 flex flex-col gap-4 rounded-lg border p-5">
            <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
              {t('auth.magicLinkSentTag')}
            </span>
            <p className="text-fg text-sm leading-relaxed">{t('auth.magicLinkSent')}</p>
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
    </section>
  );
}
