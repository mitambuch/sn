// ═══════════════════════════════════════════════════
// ProfileEditDrawer — inline edit of the member's profile fields
//
// WHAT: Right-side drawer with the 4 self-editable profile fields
//       (full_name, phone, contact_preference, locale). Submits a
//       single UPDATE to `public.profiles` filtered to the current
//       user — Migration 0010 GRANTed UPDATE only on this column
//       whitelist + pinned the role via a with-check policy, so
//       even if a future bug widened the GRANT, the role cannot be
//       escalated through this path.
// WHEN: Mounted at the AccountProfile page level, opened by the
//       "Modifier" CTA in the meta list.
// CHROME: RequestDrawerShell — same chrome as the inquiry drawers
//       for visual coherence across the account surface.
// FALLBACK: When Supabase isn't wired or the session is a dev stub,
//       the submit shows a toast + closes without persistence (same
//       simulator philosophy as the inquiry helper).
// ═══════════════════════════════════════════════════

import { Input } from '@components/ui/Input';
import { RequestDrawerShell } from '@components/ui/RequestDrawerShell';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { hasSupabase, supabase } from '@/lib/supabase';
import type { UserContactPreference, UserLocale } from '@/types/auth';

const CONTACT_OPTIONS: UserContactPreference[] = ['email', 'phone', 'secure-message'];
const LOCALE_OPTIONS: UserLocale[] = ['fr', 'en'];

interface ProfileEditDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Called after a successful real update so the parent can refresh. */
  onSaved?: () => void;
}

export const ProfileEditDrawer = ({ open, onClose, onSaved }: ProfileEditDrawerProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { session } = useAuth();
  const user = session?.user ?? null;

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [contactPreference, setContactPreference] = useState<UserContactPreference>(
    user?.contactPreference ?? 'email',
  );
  const [locale, setLocale] = useState<UserLocale>(user?.locale ?? 'fr');
  const [submitting, setSubmitting] = useState(false);

  const userId = user?.id;
  const canPersist =
    hasSupabase &&
    supabase !== null &&
    typeof userId === 'string' &&
    userId.length > 0 &&
    !userId.startsWith('dev-');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!canPersist || !supabase || !userId) {
      // Simulator path — preserves demo UX without a backend.
      await new Promise<void>(resolve => {
        setTimeout(resolve, 400);
      });
      toast({ variant: 'success', message: t('account.profile.saved') });
      setSubmitting(false);
      onClose();
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone: phone || null,
        contact_preference: contactPreference,
        locale,
      })
      .eq('id', userId);
    setSubmitting(false);

    if (error) {
      toast({ variant: 'error', message: error.message });
      return;
    }
    toast({ variant: 'success', message: t('account.profile.saved') });
    onSaved?.();
    onClose();
  };

  return (
    <RequestDrawerShell
      open={open}
      onClose={onClose}
      eyebrow={t('account.profileTitle')}
      title={t('account.profile.editTitle')}
      lede={t('account.profile.editLede')}
      widthClass="max-w-lg"
    >
      <form
        className="flex flex-col gap-6"
        onSubmit={e => {
          void handleSubmit(e);
        }}
      >
        <Input
          label={t('common.fullName')}
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
        />
        <Input
          label={t('common.phone')}
          type="tel"
          placeholder="+41 78 …"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <fieldset className="flex flex-col gap-2">
          <legend className="text-fg text-sm font-medium">
            {t('account.preferences.contactPreference')}
          </legend>
          <div className="flex flex-wrap gap-2">
            {CONTACT_OPTIONS.map(opt => {
              const selected = contactPreference === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setContactPreference(opt)}
                  aria-pressed={selected}
                  className={cn(
                    'duration-base rounded-full border px-4 py-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors',
                    selected
                      ? 'border-fg bg-fg text-bg'
                      : 'border-border text-muted hover:border-fg/60 hover:text-fg',
                  )}
                >
                  {t(`account.preferences.contact.${opt}`)}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-fg text-sm font-medium">{t('account.preferences.locale')}</legend>
          <div className="flex gap-2">
            {LOCALE_OPTIONS.map(opt => {
              const selected = locale === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setLocale(opt)}
                  aria-pressed={selected}
                  className={cn(
                    'duration-base rounded-full border px-4 py-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors',
                    selected
                      ? 'border-fg bg-fg text-bg'
                      : 'border-border text-muted hover:border-fg/60 hover:text-fg',
                  )}
                >
                  {opt === 'fr' ? 'Français' : 'English'}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-auto flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className={cn(
              'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
              'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
              'duration-base transition-[border-color,background-color,opacity]',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            {submitting ? t('inquiry.sending') : t('account.profile.save')}
            <span aria-hidden="true">↗</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-fg duration-base text-xs tracking-widest uppercase transition-colors"
          >
            {t('common.close')}
          </button>
        </div>
      </form>
    </RequestDrawerShell>
  );
};
