// ═══════════════════════════════════════════════════
// Onboarding — 3-step stepper for new members (fake)
//
// WHAT: Walks a new member through (1) confirming their invitation
//       code, (2) profile basics (name, contact preference, locale),
//       (3) confirmation screen. On final submit, navigates to
//       /:locale/account. Steps are linear — no skipping in this lot.
// WHEN: /:locale/onboarding route. Reached from Login → invitation mode.
// EDIT COPY: src/locales/{fr,en}.json under auth.* and account.* — never inline.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { Input } from '@components/ui/Input';
import { ProgressBar } from '@components/ui/ProgressBar';
import { SectionHeader } from '@components/ui/SectionHeader';
import { ROUTES } from '@constants/routes';
import { cn } from '@utils/cn';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Step = 1 | 2 | 3;

const stepKeys = {
  1: { title: 'auth.modeInvitation', hint: 'auth.modeInvitationHint' },
  2: { title: 'account.profileTitle', hint: 'account.dashboardLede' },
  3: { title: 'inquiry.success', hint: '' },
} as const;

export default function Onboarding() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [code, setCode] = useState('SAW-DEMO-2026');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else void navigate(localePath(ROUTES.ACCOUNT), { replace: true });
  };

  const stepCopy = stepKeys[step];

  return (
    <Container size="md">
      <section className="flex min-h-[calc(100vh-14rem)] flex-col justify-center py-16">
        <div className="mb-12 flex items-center gap-4">
          <span className="text-muted text-xs tracking-widest uppercase">
            {`${String(step)} / 3`}
          </span>
          <div className="flex-1">
            <ProgressBar value={(step / 3) * 100} aria-label="Onboarding progress" />
          </div>
        </div>

        <SectionHeader
          eyebrow={t('public.tagline')}
          title={t(stepCopy.title)}
          {...(stepCopy.hint ? { lede: t(stepCopy.hint) } : {})}
          size="md"
          as="h1"
        />

        <form className="mt-12 flex max-w-md flex-col gap-4" onSubmit={next}>
          {step === 1 && (
            <Input
              label={t('auth.code')}
              type="text"
              required
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
            />
          )}

          {step === 2 && (
            <>
              <Input
                label={t('common.fullName')}
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
              <Input
                label={t('common.phone')}
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </>
          )}

          {step === 3 && (
            <p className="text-muted max-w-lg leading-relaxed">{t('inquiry.success')}</p>
          )}

          <div className="mt-4 flex items-center gap-4">
            <button
              type="submit"
              className={cn(
                'border-border bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
                'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              )}
            >
              {step === 3 ? t('public.loginCta') : t('common.continue')}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </section>
    </Container>
  );
}
