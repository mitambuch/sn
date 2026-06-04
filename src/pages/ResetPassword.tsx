// ═══════════════════════════════════════════════════
// ResetPassword — set a new password from the recovery email link
//
// WHAT: Centered popup card with two fields (new password + confirmation).
//       The page is the landing target of the "mot de passe oublié" email:
//       Supabase parses the recovery token from the URL on load
//       (detectSessionInUrl) and opens a short-lived recovery session, so
//       updateUser({ password }) succeeds without the old password.
// WHEN: /:locale/reset-password — reached only via the reset email link.
// EDIT COPY: src/locales/{fr,en}.json under resetPassword.* — never inline.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Input } from '@components/ui/Input';
import { ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@hooks/useToast';
import { X } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPassword() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(t('auth.passwordTooShort'));
      return;
    }
    if (password !== confirm) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    setSubmitting(true);
    void updatePassword(password).then(result => {
      setSubmitting(false);
      if (!result.ok) {
        // The recovery session is missing/expired — guide back to a fresh request.
        setError(result.error ?? t('resetPassword.noSession'));
        return;
      }
      toast({ variant: 'success', message: t('resetPassword.success') });
      void navigate(localePath(ROUTES.ACCOUNT), { replace: true });
    });
  };

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-title"
      className="bg-bg/95 text-fg fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-5 py-10 backdrop-blur-md"
    >
      <div className="border-border bg-bg relative flex w-full max-w-md flex-col gap-6 rounded-xl border p-7 shadow-2xl md:p-9">
        <Link
          to={localePath(ROUTES.LOGIN)}
          aria-label={t('common.close')}
          className="text-muted hover:text-fg focus-visible:ring-accent absolute top-3 right-3 rounded-md p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <X size={18} strokeWidth={1.5} aria-hidden="true" />
        </Link>

        <header className="flex flex-col gap-2 pr-8">
          <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
            {t('resetPassword.tag')}
          </span>
          <h1
            id="reset-title"
            className="font-mono text-xl leading-tight font-semibold tracking-tight uppercase md:text-2xl"
          >
            {t('resetPassword.title')}
          </h1>
          <p className="text-muted text-sm leading-relaxed">{t('resetPassword.lede')}</p>
        </header>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
          {error && (
            <p
              role="alert"
              className="text-danger border-danger/30 bg-danger/4 rounded-md border px-3 py-2 text-xs leading-relaxed"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="border-border bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent mt-2 inline-flex items-center gap-3 self-start rounded-full border px-7 py-3.5 font-mono text-xs tracking-[0.3em] uppercase focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? '…' : t('resetPassword.submit')}
            {!submitting && <span aria-hidden="true">↗</span>}
          </button>
        </form>
      </div>
    </section>
  );
}
