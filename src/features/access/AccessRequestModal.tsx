// ═══════════════════════════════════════════════════
// AccessRequestModal — dual-mode access gate (form / invitation code)
//
// WHAT: Centered modal popup with two switchable modes :
//       (A) "Demander un accès" — 3-step wizard for the request flow.
//           Step 1 (Identité) : firstName + lastName + email
//           Step 2 (Profil) : phone + company + activity
//           Step 3 (Message) : message textarea + legal + submit
//           A 3-segment progress bar at top shows where the user stands.
//           Going step-by-step keeps the modal short enough to fit a
//           320×667 phone without overflow — direct fix to the "trop
//           haut sur smartphone" report 2026-05-14 17:02.
//       (B) "J'ai un code" — single input for an SAW-XXXX-XXXX invitation
//           code given off-channel by Salva (e.g. to a VIP who declines to
//           share details). Format-validated client-side, then navigates
//           to /onboarding (which performs the live Supabase check).
// WHEN: Triggered from the landing Access section (S08) + Hero +
//       IndexOverlay + TerminalBar CTAs via the global
//       AccessRequestModalProvider.
// CHANGE FIELDS: edit the per-step renderer in REQUEST_STEPS / the
//       Step component below + matching landing.access.modal keys in
//       src/locales/{fr,en}.json.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Button } from '@components/ui/Button';
import { Checkbox } from '@components/ui/Checkbox';
import { Input } from '@components/ui/Input';
import { Modal } from '@components/ui/Modal';
import { PhoneField } from '@components/ui/PhoneField';
import { ROUTES } from '@constants/routes';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useNavigate } from 'react-router-dom';

import { hasSupabase, supabase } from '@/lib/supabase';
import { INVITATION_CODE_CANONICAL_PATTERN, normalizeInvitationCode } from '@/types/invitation';

type Mode = 'request' | 'code';

interface AccessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Optional initial mode — defaults to 'request'. */
  initialMode?: Mode;
}

interface RequestFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  activity: string;
  message: string;
}

const EMPTY_FORM: RequestFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  activity: '',
  message: '',
};

const REQUEST_STEP_COUNT = 3;
type RequestStep = 0 | 1 | 2;

// Required fields per step — used to gate the "Continuer" button so the
// user can't skip past mandatory inputs. Optional fields (company,
// activity, message) aren't listed.
const REQUIRED_PER_STEP: Record<RequestStep, ReadonlyArray<keyof RequestFormState>> = {
  0: ['firstName', 'lastName', 'email'],
  1: ['phone'],
  2: [],
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Loose but real email check — boundary validation, not RFC-perfect. */
function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Real phone validation via libphonenumber (E.164 from PhoneField). */
function isValidPhone(value: string): boolean {
  const trimmed = value.trim();
  return trimmed !== '' && isValidPhoneNumber(trimmed);
}

function isStepComplete(step: RequestStep, form: RequestFormState): boolean {
  const filled = REQUIRED_PER_STEP[step].every(key => form[key].trim() !== '');
  if (!filled) return false;
  // Beyond presence, the contact steps must hold a VALID value so the
  // operator can actually reach the lead.
  if (step === 0) return isValidEmail(form.email);
  if (step === 1) return isValidPhone(form.phone);
  return true;
}

export const AccessRequestModal = ({
  isOpen,
  onClose,
  initialMode = 'request',
}: AccessRequestModalProps) => {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [step, setStep] = useState<RequestStep>(0);
  const [form, setForm] = useState<RequestFormState>(EMPTY_FORM);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Reset wizard step + error state on close so the next open always
  // starts fresh. The modal stays mounted under the global provider, so
  // without this the user would re-enter on the step they bailed on.
  const handleClose = () => {
    setStep(0);
    setCodeError(null);
    setConsent(false);
    onClose();
  };

  const setField = (key: keyof RequestFormState) => (value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const goNext = () => {
    if (!isStepComplete(step, form)) return;
    setStep(prev => (prev < REQUEST_STEP_COUNT - 1 ? ((prev + 1) as RequestStep) : prev));
  };

  const goBack = () => {
    setStep(prev => (prev > 0 ? ((prev - 1) as RequestStep) : prev));
  };

  const handleRequestSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    // The submit lives on step 3 ; this guard is defensive in case the
    // form is somehow submitted from another step (Enter key on a field).
    if (step !== REQUEST_STEP_COUNT - 1) {
      goNext();
      return;
    }
    // Legal consent is mandatory before the request leaves the browser.
    if (!consent) return;
    setSubmitting(true);

    if (hasSupabase && supabase) {
      // Real insert via the anon-write policy from migration 0012.
      // The Postgres trigger fires the Resend operator email.
      const { error } = await supabase.from('access_requests').insert({
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        company: form.company.trim() || null,
        activity: form.activity.trim() || null,
        message: form.message.trim() || null,
      });
      setSubmitting(false);
      if (error) {
        toast({ variant: 'error', message: error.message });
        return;
      }
      toast({ variant: 'success', message: t('landing.access.modal.requestSuccess') });
      setForm(EMPTY_FORM);
      setConsent(false);
      handleClose();
      return;
    }

    // Simulator path — preserves demo UX without a backend.
    await new Promise<void>(resolve => {
      setTimeout(resolve, 600);
    });
    toast({ variant: 'success', message: t('landing.access.modal.requestSuccess') });
    setForm(EMPTY_FORM);
    setSubmitting(false);
    handleClose();
  };

  const handleCodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    // Accept both the raw 8-char code emailed by the system AND the pretty
    // SAW-XXXX-XXXX form — normalize, then validate the canonical shape.
    const canonical = normalizeInvitationCode(code);
    if (!INVITATION_CODE_CANONICAL_PATTERN.test(canonical)) {
      setCodeError(t('landing.access.modal.codeInvalidFormat'));
      return;
    }
    setCodeError(null);
    setSubmitting(true);
    // WHY: hand off to /login → "Première connexion" with the code pre-filled.
    // That form does the live Supabase check, creates the account with a
    // password, and consumes the code. The modal only enforces format here.
    setTimeout(() => {
      toast({ variant: 'success', message: t('landing.access.modal.codeAccepted') });
      setSubmitting(false);
      handleClose();
      void navigate(localePath(ROUTES.LOGIN), {
        state: { invitationCode: canonical, mode: 'first' },
      });
    }, 400);
  };

  // Inline format errors — shown only once the user has typed something
  // invalid, so the field doesn't scream before it's been touched.
  const emailError =
    form.email.trim() !== '' && !isValidEmail(form.email)
      ? t('landing.access.modal.errors.email')
      : null;
  const phoneError =
    form.phone.trim() !== '' && !isValidPhone(form.phone)
      ? t('landing.access.modal.errors.phone')
      : null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl">
      <div className="flex flex-col gap-8 p-2">
        {/* ─── Header — eyebrow + headline ─── */}
        <header className="flex flex-col gap-3">
          <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
            {t('landing.access.modal.eyebrow')}
          </span>
          <h2 className="font-mono text-2xl leading-tight font-semibold tracking-tight uppercase md:text-3xl">
            {t('landing.access.modal.title')}
          </h2>
          <p className="text-muted max-w-lg text-sm leading-relaxed">
            {t('landing.access.modal.lede')}
          </p>
        </header>

        {/* ─── Mode toggle ─── */}
        <div
          role="tablist"
          aria-label={t('landing.access.modal.modeToggleLabel')}
          className="border-border bg-surface/40 inline-flex self-start rounded-full border p-1"
        >
          {(['request', 'code'] as Mode[]).map(m => (
            <button
              key={m}
              role="tab"
              type="button"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                setCodeError(null);
                if (m === 'request') setStep(0);
              }}
              className={cn(
                'rounded-full px-5 py-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-200',
                mode === m ? 'bg-fg text-bg' : 'text-muted hover:text-fg',
              )}
            >
              {t(`landing.access.modal.mode.${m}`)}
            </button>
          ))}
        </div>

        {/* ─── Form body ─── */}
        {mode === 'request' ? (
          <form
            className="flex flex-col gap-6"
            onSubmit={e => {
              void handleRequestSubmit(e);
            }}
            noValidate
          >
            {/* ─── Step progress (3 segments) + counter ─── */}
            <div className="flex flex-col gap-2">
              <div
                className="flex items-center gap-1.5"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={REQUEST_STEP_COUNT}
                aria-valuenow={step + 1}
                aria-label={t('landing.access.modal.steps.counter', {
                  current: step + 1,
                  total: REQUEST_STEP_COUNT,
                })}
              >
                {Array.from({ length: REQUEST_STEP_COUNT }).map((_, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className={cn(
                      'h-0.5 flex-1 rounded-full transition-colors duration-300',
                      i <= step ? 'bg-fg' : 'bg-fg/15',
                    )}
                  />
                ))}
              </div>
              <div className="flex items-baseline justify-between gap-3 font-mono text-[10px] tracking-[0.25em] uppercase">
                <span className="text-fg">
                  {t(
                    `landing.access.modal.steps.${
                      step === 0 ? 'identity' : step === 1 ? 'profile' : 'message'
                    }`,
                  )}
                </span>
                <span className="text-muted">
                  {t('landing.access.modal.steps.counter', {
                    current: step + 1,
                    total: REQUEST_STEP_COUNT,
                  })}
                </span>
              </div>
            </div>

            {/* ─── Step 0 — Identité ─── */}
            {step === 0 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label={t('landing.access.modal.fields.firstName')}
                  value={form.firstName}
                  onChange={e => {
                    setField('firstName')(e.target.value);
                  }}
                  required
                  autoComplete="given-name"
                />
                <Input
                  label={t('landing.access.modal.fields.lastName')}
                  value={form.lastName}
                  onChange={e => {
                    setField('lastName')(e.target.value);
                  }}
                  required
                  autoComplete="family-name"
                />
                <div className="md:col-span-2">
                  <Input
                    label={t('landing.access.modal.fields.email')}
                    value={form.email}
                    onChange={e => {
                      setField('email')(e.target.value);
                    }}
                    required
                    type="email"
                    autoComplete="email"
                    {...(emailError ? { error: emailError } : {})}
                  />
                </div>
              </div>
            )}

            {/* ─── Step 1 — Profil ─── */}
            {step === 1 && (
              <div className="grid grid-cols-1 gap-4">
                <PhoneField
                  label={t('landing.access.modal.fields.phone')}
                  value={form.phone}
                  onChange={setField('phone')}
                  {...(phoneError ? { error: phoneError } : {})}
                />
                <Input
                  label={t('landing.access.modal.fields.company')}
                  value={form.company}
                  onChange={e => {
                    setField('company')(e.target.value);
                  }}
                  autoComplete="organization"
                />
                <Input
                  label={t('landing.access.modal.fields.activity')}
                  value={form.activity}
                  onChange={e => {
                    setField('activity')(e.target.value);
                  }}
                />
              </div>
            )}

            {/* ─── Step 2 — Message + submit ─── */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="access-message" className="text-fg text-sm font-medium">
                    {t('landing.access.modal.fields.message')}
                  </label>
                  <textarea
                    id="access-message"
                    rows={4}
                    value={form.message}
                    onChange={e => {
                      setForm(prev => ({ ...prev, message: e.target.value }));
                    }}
                    placeholder={t('landing.access.modal.fields.messagePlaceholder')}
                    className={cn(
                      'bg-surface/80 text-fg rounded-lg border px-3 py-2 backdrop-blur-sm',
                      'border-border hover:border-accent/30 focus:border-accent focus:ring-accent',
                      'placeholder:text-muted/60 focus:ring-1 focus:outline-none',
                      'duration-base transition-[border-color,box-shadow]',
                    )}
                  />
                </div>

                <p className="text-muted border-border border-t pt-4 text-xs leading-relaxed">
                  {t('landing.access.modal.legal')}
                </p>

                <Checkbox
                  id="access-consent"
                  checked={consent}
                  onChange={e => {
                    setConsent(e.target.checked);
                  }}
                  label={t('landing.access.modal.consent')}
                />
              </div>
            )}

            {/* ─── Navigation : Back / (Next | Submit) ─── */}
            <div className="border-border flex flex-wrap items-center justify-between gap-3 border-t pt-5">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="text-muted hover:text-fg font-mono text-[11px] tracking-[0.25em] uppercase transition-colors"
                >
                  ← {t('landing.access.modal.steps.back')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-muted hover:text-fg font-mono text-[11px] tracking-[0.25em] uppercase transition-colors"
                >
                  {t('common.close')}
                </button>
              )}

              {step < REQUEST_STEP_COUNT - 1 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={goNext}
                  disabled={!isStepComplete(step, form)}
                  className="font-mono text-xs tracking-[0.3em] uppercase"
                >
                  {t('landing.access.modal.steps.next')}
                  <span aria-hidden="true">↗</span>
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting || !consent}
                  className="font-mono text-xs tracking-[0.3em] uppercase"
                >
                  {submitting
                    ? t('landing.access.modal.submitting')
                    : t('landing.access.modal.submitRequest')}
                  <span aria-hidden="true">↗</span>
                </Button>
              )}
            </div>
          </form>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleCodeSubmit} noValidate>
            <Input
              label={t('landing.access.modal.code.label')}
              value={code}
              onChange={e => {
                setCode(e.target.value.toUpperCase());
                if (codeError) setCodeError(null);
              }}
              {...(codeError ? { error: codeError } : {})}
              helperText={t('landing.access.modal.code.helper')}
              placeholder="SAW-XXXX-XXXX"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              className="font-mono tracking-[0.18em] uppercase"
            />

            <p className="text-muted border-border border-t pt-4 text-xs leading-relaxed">
              {t('landing.access.modal.code.legal')}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting || code.trim().length === 0}
                className="font-mono text-xs tracking-[0.3em] uppercase"
              >
                {submitting
                  ? t('landing.access.modal.submitting')
                  : t('landing.access.modal.submitCode')}
                <span aria-hidden="true">↗</span>
              </Button>
              <button
                type="button"
                onClick={() => {
                  setMode('request');
                  setCodeError(null);
                }}
                className="text-muted hover:text-fg font-mono text-[11px] tracking-[0.2em] uppercase transition-colors"
              >
                {t('landing.access.modal.noCodeYet')}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
