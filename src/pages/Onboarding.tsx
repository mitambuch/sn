// ═══════════════════════════════════════════════════
// Onboarding — cinematic 3-step entry for new members
//
// WHAT: Full-bleed image background + minimal monochrome copy on each
//       step. Three pillars: invitation code, profile (name + phone),
//       dedicated concierge intro. Skippable from the top-right.
//       Replaces the prior form-stepper with an editorial Apple-tier
//       first impression.
// WHEN: /:locale/onboarding route. Reached from Login → invitation mode.
// REPLACE LATER: lot C wires real Supabase write + Resend welcome.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Image } from '@components/ui/Image';
import { Input } from '@components/ui/Input';
import { ROUTES } from '@constants/routes';
import { cn } from '@utils/cn';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { unsplash } from '@/mocks/unsplash';

type Step = 1 | 2 | 3;

const STEP_BG: Record<Step, { src: string; alt: string }> = {
  1: {
    src: unsplash('alps-mist-luxury-mountain-window'),
    alt: 'Vue alpine au lever du jour',
  },
  2: {
    src: unsplash('belle-epoque-salon-private-library'),
    alt: 'Salon privé Belle Époque',
  },
  3: {
    src: unsplash('private-jet-cabin-leather-interior'),
    alt: 'Cabine de jet privé en cuir',
  },
};

export default function Onboarding() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [code, setCode] = useState('SAW-DEMO-2026');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const skip = () => {
    localStorage.setItem('__sn_onboarding_seen', 'true');
    void navigate(localePath(ROUTES.ACCOUNT), { replace: true });
  };

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else skip();
  };

  const bg = STEP_BG[step];
  const stepCopy = `onboarding.step${String(step)}`;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Full-bleed background image, swapped per step */}
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

      {/* Skip + step indicator */}
      <header className="relative z-10 flex items-start justify-between px-6 py-6 md:px-12 md:py-10">
        <span className="text-fg font-mono text-xs tracking-[0.4em] uppercase">S — N</span>
        <div className="flex items-center gap-4">
          <span className="text-muted text-xs tracking-widest uppercase">{String(step)} / 3</span>
          <button
            type="button"
            onClick={skip}
            className="text-muted hover:text-fg duration-base text-xs tracking-widest uppercase transition-colors"
          >
            {t('onboarding.skip')}
          </button>
        </div>
      </header>

      {/* Step content — minimal copy + form input + CTA */}
      <main className="relative z-10 flex min-h-[calc(100vh-8rem)] items-center px-6 md:px-12">
        <form
          onSubmit={next}
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

          {step === 1 && (
            <div className="max-w-md">
              <Input
                label={t('auth.code')}
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
              />
            </div>
          )}

          {step === 2 && (
            <div className="grid max-w-md grid-cols-1 gap-4">
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
            </div>
          )}

          {step === 3 && (
            <div className="border-border bg-surface/60 max-w-md rounded-lg border p-6 backdrop-blur-md">
              <span className="text-muted text-xs tracking-widest uppercase">
                {t('dock.eyebrow')}
              </span>
              <p className="text-fg mt-1 text-lg font-medium">Salvatore Montemagno</p>
              <p className="text-muted mt-1 text-sm">salvatore@sawnext.studio</p>
              <p className="text-muted mt-3 text-sm leading-relaxed">{t('dock.availability')}</p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-4">
            <button
              type="submit"
              className={cn(
                'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
                'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
                'duration-base transition-[border-color,background-color]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              )}
            >
              {step === 3 ? t('onboarding.enter') : t('common.continue')}
              <span aria-hidden="true">→</span>
            </button>
            {step < 3 && (
              <button
                type="button"
                onClick={skip}
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
