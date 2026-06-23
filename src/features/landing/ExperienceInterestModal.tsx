// ═══════════════════════════════════════════════════
// ExperienceInterestModal — simple public contact form for an experience
//
// WHAT: A single-screen "manifester mon intérêt" form shown when a visitor
//       wants to be contacted about a PUBLIC experience fiche. It captures a
//       message + coordinates (name, email, phone) + optional availability,
//       and posts the lead so the SAW Next team can recontact directly.
// WHEN: Opened from a public fiche CTA (PublicFichePanel via the landing,
//       and the /share/:code page). This REPLACES the old behaviour where the
//       fiche CTA opened the access-request / invitation-code wizard — a
//       public experience needs a low-friction contact, not a "request access"
//       flow (client retour 2026-06-23).
// BACKEND: inserts into `public.access_requests` (migration 0012) — already
//       anon-insert + a Postgres trigger that emails the operator (reply_to =
//       the lead's email). The experience title is prefixed into the message
//       so the operator sees the context. No new migration needed. Demo mode
//       (no Supabase) simulates the submit so the flow stays testable offline.
// CHANGE FIELDS: edit the inputs below + the `interestForm.*` keys in
//       src/locales/{fr,en,es}.json.
// ═══════════════════════════════════════════════════

import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Modal } from '@components/ui/Modal';
import { PhoneField } from '@components/ui/PhoneField';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isValidPhoneNumber } from 'react-phone-number-input';

import { hasSupabase, supabase } from '@/lib/supabase';

interface ExperienceInterestModalProps {
  /** The experience title — shown as context + stored with the lead.
   *  `null` keeps the modal closed. */
  experienceTitle: string | null;
  onClose: () => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  availability: string;
}

const EMPTY: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
  availability: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (v: string): boolean => EMAIL_RE.test(v.trim());
/** Phone is optional — empty is valid; a typed value must be a real number. */
const isValidPhone = (v: string): boolean => v.trim() === '' || isValidPhoneNumber(v.trim());

/** Compose the operator-facing message: experience context first, then the
 *  optional availability, then the visitor's free text. */
function composeMessage(
  experienceTitle: string,
  form: FormState,
  availabilityLabel: string,
): string {
  const parts = [`[${experienceTitle}]`];
  if (form.availability.trim()) parts.push(`${availabilityLabel}: ${form.availability.trim()}`);
  if (form.message.trim()) parts.push(form.message.trim());
  return parts.join('\n\n');
}

/** Low-friction contact form for a public experience. */
export const ExperienceInterestModal = ({
  experienceTitle,
  onClose,
}: ExperienceInterestModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const isOpen = experienceTitle !== null;

  const set = (key: keyof FormState) => (value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleClose = () => {
    setForm(EMPTY);
    onClose();
  };

  // Submit is allowed once the reachable-contact essentials are valid: name,
  // a real email, and a message. Phone + availability stay optional (friction).
  const canSubmit =
    form.firstName.trim() !== '' &&
    form.lastName.trim() !== '' &&
    isValidEmail(form.email) &&
    isValidPhone(form.phone) &&
    form.message.trim() !== '';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting || !canSubmit || experienceTitle === null) return;
    setSubmitting(true);

    const message = composeMessage(experienceTitle, form, t('interestForm.fields.availability'));

    // Real insert via the anon-write policy from migration 0012 — the Postgres
    // trigger fires the Resend operator email (reply_to = the visitor's email).
    if (hasSupabase && supabase) {
      const { error } = await supabase.from('access_requests').insert({
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        message,
      });
      setSubmitting(false);
      if (error) {
        toast({ variant: 'error', message: t('interestForm.error') });
        return;
      }
      toast({ variant: 'success', message: t('interestForm.success') });
      handleClose();
      return;
    }

    // Demo path — preserves the UX without a backend.
    await new Promise<void>(resolve => {
      setTimeout(resolve, 600);
    });
    setSubmitting(false);
    toast({ variant: 'success', message: t('interestForm.success') });
    handleClose();
  };

  const emailError =
    form.email.trim() !== '' && !isValidEmail(form.email) ? t('interestForm.errors.email') : null;
  const phoneError =
    form.phone.trim() !== '' && !isValidPhone(form.phone) ? t('interestForm.errors.phone') : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel={t('interestForm.title')}
      className="max-w-xl"
    >
      <form
        className="flex flex-col gap-6 p-2"
        onSubmit={e => {
          void handleSubmit(e);
        }}
        noValidate
      >
        {/* ─── Header ─── */}
        <header className="flex flex-col gap-3">
          <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
            {t('interestForm.eyebrow')}
          </span>
          <h2 className="font-mono text-2xl leading-tight font-semibold tracking-tight uppercase md:text-3xl">
            {t('interestForm.title')}
          </h2>
          {experienceTitle !== null && experienceTitle !== '' && (
            <p className="text-muted text-sm leading-relaxed">
              {/* Colon lives in the locale string so each language keeps its own
                  typography (FR "… :" with a space, EN/ES "…:" without). */}
              {t('interestForm.about')}{' '}
              <span className="text-fg font-medium">{experienceTitle}</span>
            </p>
          )}
          <p className="text-muted max-w-lg text-sm leading-relaxed">{t('interestForm.lede')}</p>
        </header>

        {/* ─── Coordonnées ─── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label={t('interestForm.fields.firstName')}
            value={form.firstName}
            onChange={e => {
              set('firstName')(e.target.value);
            }}
            required
            autoComplete="given-name"
          />
          <Input
            label={t('interestForm.fields.lastName')}
            value={form.lastName}
            onChange={e => {
              set('lastName')(e.target.value);
            }}
            required
            autoComplete="family-name"
          />
          <div className="md:col-span-2">
            <Input
              label={t('interestForm.fields.email')}
              value={form.email}
              onChange={e => {
                set('email')(e.target.value);
              }}
              required
              type="email"
              autoComplete="email"
              {...(emailError ? { error: emailError } : {})}
            />
          </div>
          <div className="md:col-span-2">
            <PhoneField
              label={t('interestForm.fields.phone')}
              value={form.phone}
              onChange={set('phone')}
              {...(phoneError ? { error: phoneError } : {})}
            />
          </div>
        </div>

        {/* ─── Message ─── */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="interest-message" className="text-fg text-sm font-medium">
            {t('interestForm.fields.message')}
          </label>
          <textarea
            id="interest-message"
            rows={4}
            required
            aria-required="true"
            value={form.message}
            onChange={e => {
              set('message')(e.target.value);
            }}
            placeholder={t('interestForm.fields.messagePlaceholder')}
            className={cn(
              'bg-surface/80 text-fg rounded-lg border px-3 py-2 backdrop-blur-sm',
              'border-border hover:border-accent/30 focus:border-accent focus:ring-accent',
              'placeholder:text-muted/60 focus:ring-1 focus:outline-none',
              'duration-base transition-[border-color,box-shadow]',
            )}
          />
        </div>

        {/* ─── Disponibilités (optionnel) ─── */}
        <Input
          label={t('interestForm.fields.availability')}
          value={form.availability}
          onChange={e => {
            set('availability')(e.target.value);
          }}
          placeholder={t('interestForm.fields.availabilityPlaceholder')}
        />

        <p className="text-muted border-border border-t pt-4 text-xs leading-relaxed">
          {t('interestForm.legal')}
        </p>

        {/* ─── Actions ─── */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting || !canSubmit}
            className="font-mono text-xs tracking-[0.3em] uppercase"
          >
            {submitting ? t('interestForm.submitting') : t('interestForm.submit')}
            <span aria-hidden="true">↗</span>
          </Button>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted hover:text-fg font-mono text-[11px] tracking-[0.25em] uppercase transition-colors"
          >
            {t('common.close')}
          </button>
        </div>
      </form>
    </Modal>
  );
};
