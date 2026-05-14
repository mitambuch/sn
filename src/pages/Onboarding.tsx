// ═══════════════════════════════════════════════════
// Onboarding — cinematic 3-step entry for new members
//
// WHAT: Full-bleed image background + minimal monochrome copy on each
//       step. Three pillars: invitation code, profile (name + phone),
//       dedicated concierge intro. Skippable from the top-right.
//
// FLOW: The user lands here after clicking a magic link emailed by
//       Supabase (signInWithOtp from the AccessRequestModal / LoginModal
//       invitation flow). user.user_metadata.invitation_code carries the
//       code over from the landing form.
//   - Step 1 calls confirmInvitationRedemption(code) — atomic RPC that
//     marks the code redeemed in Supabase. Surfaces the error if the
//     code is invalid / already used.
//   - Step 2 UPDATEs profiles (full_name + phone) on Supabase.
//   - Step 3 is a visual welcome card before landing on /account.
//
// FALLBACK: When Supabase isn't wired (hasSupabase = false), each step
//       passes through without DB writes so the demo path stays
//       clickable.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Image } from '@components/ui/Image';
import { Input } from '@components/ui/Input';
import { ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { hasSupabase, supabase } from '@/lib/supabase';
import { unsplash } from '@/mocks/unsplash';

type Step = 1 | 2 | 3;

const STEP_BG: Record<Step, { src: string; alt: string }> = {
  1: { src: unsplash('alps-mist-luxury-mountain-window'), alt: 'Vue alpine au lever du jour' },
  2: { src: unsplash('belle-epoque-salon-private-library'), alt: 'Salon privé Belle Époque' },
  3: { src: unsplash('private-jet-cabin-leather-interior'), alt: 'Cabine de jet privé en cuir' },
};

function StepBackground({ step }: { step: Step }) {
  const bg = STEP_BG[step];
  return (
    <div className="absolute inset-0">
      <Image
        src={bg.src}
        alt={bg.alt}
        eager
        ratio="16/9"
        wrapperClassName="absolute inset-0 h-full w-full"
        className="h-full w-full object-cover"
      />
      <div
        className="from-bg/95 via-bg/70 to-bg/40 absolute inset-0 bg-linear-to-tr"
        aria-hidden="true"
      />
    </div>
  );
}

interface StepFieldsProps {
  step: Step;
  code: string;
  setCode: (v: string) => void;
  fullName: string;
  setFullName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
}

function StepFields({
  step,
  code,
  setCode,
  fullName,
  setFullName,
  phone,
  setPhone,
}: StepFieldsProps) {
  const { t } = useTranslation();
  if (step === 1) {
    return (
      <div className="max-w-md">
        <Input
          label={t('auth.code')}
          type="text"
          required
          value={code}
          onChange={e => {
            setCode(e.target.value.toUpperCase());
          }}
          helperText="Format : SAW-XXXX-XXXX"
        />
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="grid max-w-md grid-cols-1 gap-4">
        <Input
          label={t('common.fullName')}
          type="text"
          autoComplete="name"
          required
          value={fullName}
          onChange={e => {
            setFullName(e.target.value);
          }}
        />
        <Input
          label={t('common.phone')}
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={e => {
            setPhone(e.target.value);
          }}
        />
      </div>
    );
  }
  return (
    <div className="border-border bg-surface/60 max-w-md rounded-lg border p-6 backdrop-blur-md">
      <span className="text-muted text-xs tracking-widest uppercase">{t('dock.eyebrow')}</span>
      <p className="text-fg mt-1 text-lg font-medium">Salvatore Montemagno</p>
      <p className="text-muted mt-1 text-sm">salvatore@sawnext.studio</p>
      <p className="text-muted mt-3 text-sm leading-relaxed">{t('dock.availability')}</p>
    </div>
  );
}

export default function Onboarding() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const navigate = useNavigate();
  const { user, confirmInvitationRedemption } = useAuth();
  const { toast } = useToast();

  // user_metadata.invitation_code is set by signInWithOtp({ data: ... }) in
  // the landing AccessRequestModal flow. If the user reached onboarding by
  // any other path, the field is undefined.
  const metaCode =
    (user as unknown as { user_metadata?: { invitation_code?: string } })?.user_metadata
      ?.invitation_code ?? '';

  const [step, setStep] = useState<Step>(1);
  const [code, setCode] = useState<string>(metaCode || 'SAW-');
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goAccount = () => {
    localStorage.setItem('__sn_onboarding_seen', 'true');
    void navigate(localePath(ROUTES.ACCOUNT), { replace: true });
  };

  const handleStep1 = async () => {
    setError(null);
    setSubmitting(true);
    const result = await confirmInvitationRedemption(code);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? t('common.error'));
      return;
    }
    setStep(2);
  };

  const handleStep2 = async () => {
    setError(null);
    if (!hasSupabase || !supabase || !user) {
      setStep(3);
      return;
    }
    setSubmitting(true);
    const { error: updErr } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone: phone || null })
      .eq('id', user.id);
    setSubmitting(false);
    if (updErr) {
      setError(updErr.message);
      return;
    }
    toast({ variant: 'success', message: t('account.preferences.savedToast') });
    setStep(3);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (step === 1) void handleStep1();
    else if (step === 2) void handleStep2();
    else goAccount();
  };

  const stepCopy = `onboarding.step${String(step)}`;
  const submitLabel = submitting
    ? t('common.loading')
    : step === 3
      ? t('onboarding.enter')
      : t('common.continue');

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <StepBackground step={step} />

      <header className="relative z-10 flex items-start justify-between px-6 py-6 md:px-12 md:py-10">
        <span className="text-fg font-mono text-xs tracking-[0.4em] uppercase">S — N</span>
        <div className="flex items-center gap-4">
          <span className="text-muted text-xs tracking-widest uppercase">{String(step)} / 3</span>
          <button
            type="button"
            onClick={goAccount}
            className="text-muted hover:text-fg duration-base text-xs tracking-widest uppercase transition-colors"
          >
            {t('onboarding.skip')}
          </button>
        </div>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-8rem)] items-center px-6 md:px-12">
        <form
          onSubmit={handleSubmit}
          className="motion-safe:animate-in motion-safe:fade-in flex w-full max-w-2xl flex-col gap-8 motion-safe:duration-700"
          key={step}
        >
          <span className="text-muted text-xs tracking-[0.3em] uppercase">
            {t(`${stepCopy}.eyebrow`)}
          </span>
          <h1 className="text-fg max-w-xl font-mono text-3xl font-bold tracking-tight text-balance uppercase md:text-4xl lg:text-5xl">
            {t(`${stepCopy}.title`)}
          </h1>
          <p className="text-muted max-w-xl text-base leading-relaxed text-pretty md:text-lg">
            {t(`${stepCopy}.lede`)}
          </p>

          <StepFields
            step={step}
            code={code}
            setCode={setCode}
            fullName={fullName}
            setFullName={setFullName}
            phone={phone}
            setPhone={setPhone}
          />

          {error && (
            <p
              role="alert"
              className="border-danger/30 bg-danger/5 text-danger max-w-md rounded-md border px-3 py-2 text-sm"
            >
              {error}
            </p>
          )}

          <div className="mt-4 flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className={cn(
                'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
                'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
                'duration-base transition-[border-color,background-color]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-60',
              )}
            >
              {submitLabel}
              <span aria-hidden="true">→</span>
            </button>
            {step < 3 && (
              <button
                type="button"
                onClick={goAccount}
                className="text-muted hover:text-fg duration-base text-xs tracking-widest uppercase transition-colors"
              >
                {t('onboarding.skip')}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
