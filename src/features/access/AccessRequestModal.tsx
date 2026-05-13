// ═══════════════════════════════════════════════════
// AccessRequestModal — dual-mode access gate (form / invitation code)
//
// WHAT: Centered modal popup with two switchable modes :
//       (A) "Demander un accès" — structured request form (firstName,
//           lastName, email, phone, company, activity, message). Submits
//           a free-form inquiry routed to Salva via the existing pipeline.
//       (B) "J'ai un code" — single input for an SAW-XXXX-XXXX invitation
//           code given off-channel by Salva (e.g. to a VIP who declines to
//           share details). Format-validated client-side, then navigates
//           to /onboarding (which performs the live Supabase check).
// WHEN: Triggered from the landing Access section (S08) CTA(s).
// CHANGE FIELDS: edit FORM_FIELDS array below + matching landing.access.modal
//                keys in src/locales/{fr,en}.json.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Modal } from '@components/ui/Modal';
import { ROUTES } from '@constants/routes';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { INVITATION_CODE_DISPLAY_PATTERN, normalizeInvitationCode } from '@/types/invitation';

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
  const [form, setForm] = useState<RequestFormState>(EMPTY_FORM);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const setField = (key: keyof RequestFormState) => (value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleRequestSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    // WHY: stub routed to existing Resend pipeline once the Netlify function
    // accepts the structured payload. For MVP we surface success + clear.
    setTimeout(() => {
      toast({ variant: 'success', message: t('landing.access.modal.requestSuccess') });
      setForm(EMPTY_FORM);
      setSubmitting(false);
      onClose();
    }, 600);
  };

  const handleCodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const trimmed = code.trim();
    if (!INVITATION_CODE_DISPLAY_PATTERN.test(trimmed)) {
      setCodeError(t('landing.access.modal.codeInvalidFormat'));
      return;
    }
    setCodeError(null);
    setSubmitting(true);
    const canonical = normalizeInvitationCode(trimmed);
    // WHY: leave Supabase validation to /onboarding (it gates step1 → step2
    // with the live check). The modal only enforces format here.
    setTimeout(() => {
      toast({ variant: 'success', message: t('landing.access.modal.codeAccepted') });
      setSubmitting(false);
      onClose();
      void navigate(localePath(ROUTES.ONBOARDING), { state: { invitationCode: canonical } });
    }, 400);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
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
          <form className="flex flex-col gap-5" onSubmit={handleRequestSubmit} noValidate>
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
              <Input
                label={t('landing.access.modal.fields.email')}
                value={form.email}
                onChange={e => {
                  setField('email')(e.target.value);
                }}
                required
                type="email"
                autoComplete="email"
              />
              <Input
                label={t('landing.access.modal.fields.phone')}
                value={form.phone}
                onChange={e => {
                  setField('phone')(e.target.value);
                }}
                required
                type="tel"
                autoComplete="tel"
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

            <div className="flex flex-col gap-1.5">
              <label htmlFor="access-message" className="text-fg text-sm font-medium">
                {t('landing.access.modal.fields.message')}
              </label>
              <textarea
                id="access-message"
                rows={3}
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

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting}
                className="font-mono text-xs tracking-[0.3em] uppercase"
              >
                {submitting
                  ? t('landing.access.modal.submitting')
                  : t('landing.access.modal.submitRequest')}
                <span aria-hidden="true">↗</span>
              </Button>
              <button
                type="button"
                onClick={onClose}
                className="text-muted hover:text-fg font-mono text-[11px] tracking-[0.2em] uppercase transition-colors"
              >
                {t('common.close')}
              </button>
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
