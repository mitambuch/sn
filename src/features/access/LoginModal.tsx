// ═══════════════════════════════════════════════════
// LoginModal — three sign-in modes in a centered popup
//
// WHAT: Same mechanics as the page-route /login (email+password / magic
//       link / invitation code) but rendered as a global modal that
//       opens OVER the landing instead of replacing the page. Reuses the
//       AccessRequestModal visual language for consistency : Modal wrapper
//       + eyebrow + headline + compact body. The route /login still
//       exists for deep-link callbacks (magic-link redirect, password
//       reset) but the primary entry from the landing is this modal.
// WHEN: Mounted by LoginModalProvider, controlled via useLoginModal().
// EDIT COPY: src/locales/{fr,en}.json under auth.* — never inline.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Input } from '@components/ui/Input';
import { Modal } from '@components/ui/Modal';
import { ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { cn } from '@utils/cn';
import { type FormEvent, type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Mode = 'select' | 'email' | 'magic-link' | 'invitation' | 'magic-link-sent';
type FormMode = 'email' | 'magic-link' | 'invitation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
      'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
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

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
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

  const handleClose = () => {
    resetTo('select');
    onClose();
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
      setError(result.error ?? t('common.error'));
    }
  };

  const meta: Record<
    FormMode,
    { label: string; onSubmit: (e: FormEvent) => void; fields: ReactNode }
  > = {
    email: {
      label: t('auth.signIn'),
      onSubmit: e => {
        e.preventDefault();
        void runAuth(
          () => signIn(email, password),
          () => {
            onClose();
            void navigate(localePath(ROUTES.ACCOUNT), { replace: true });
          },
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
            onChange={e => {
              setEmail(e.target.value);
            }}
          />
          <Input
            label={t('auth.password')}
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={e => {
              setPassword(e.target.value);
            }}
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
          () => {
            setMode('magic-link-sent');
          },
        );
      },
      fields: (
        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => {
            setEmail(e.target.value);
          }}
        />
      ),
    },
    invitation: {
      label: t('auth.modeInvitation'),
      onSubmit: e => {
        e.preventDefault();
        void runAuth(
          () => redeemInvitationCode(code, email),
          () => {
            setMode('magic-link-sent');
          },
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
            onChange={e => {
              setEmail(e.target.value);
            }}
          />
          <Input
            label={t('auth.code')}
            type="text"
            required
            placeholder="SAW-XXXX-XXXX"
            value={code}
            onChange={e => {
              setCode(e.target.value.toUpperCase());
            }}
          />
        </>
      ),
    },
  };

  const isFormMode = mode === 'email' || mode === 'magic-link' || mode === 'invitation';
  const current = isFormMode ? meta[mode] : null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md">
      <div className="flex flex-col gap-6 p-1">
        <header className="flex flex-col gap-2">
          <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
            {t('auth.tagEyebrow')}
          </span>
          <h2 className="font-mono text-xl leading-tight font-semibold tracking-tight uppercase md:text-2xl">
            {t('auth.titleModal')}
          </h2>
          <p className="text-muted text-sm leading-relaxed">{t('auth.ledeModal')}</p>
        </header>

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
          <form className="flex flex-col gap-5" onSubmit={current.onSubmit}>
            <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
              {current.label}
            </span>
            {current.fields}
            {error && (
              <p
                role="alert"
                className="text-danger border-danger/30 bg-danger/4 rounded-md border px-3 py-2 text-xs leading-relaxed"
              >
                {error}
              </p>
            )}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="border-border bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent inline-flex items-center gap-3 rounded-full border px-6 py-3 font-mono text-xs tracking-[0.3em] uppercase focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? '…' : current.label}
                {!submitting && <span aria-hidden="true">↗</span>}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetTo('select');
                }}
                className="text-muted hover:text-fg duration-base font-mono text-[11px] tracking-[0.2em] uppercase transition-colors"
              >
                ← {t('common.back')}
              </button>
            </div>
          </form>
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
    </Modal>
  );
};
