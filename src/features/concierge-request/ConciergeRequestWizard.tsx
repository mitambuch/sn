// ═══════════════════════════════════════════════════
// ConciergeRequestWizard — guided multi-step request modal
//
// WHAT: Centered modal (desktop + mobile) that walks the member through
//       a smart 3-step flow to express a personalised request :
//         1. Category (real-estate / timepiece / art / experience /
//            travel / other) — 6 large tap targets.
//         2. Details — free-form description + optional photos (useful
//            for "find me a watch with this dial").
//         3. Review — recap + submit.
//       Each step has a back/next button. Photos handled by ImageUpload
//       (already exists in /components/ui/ImageUpload, multi-file with
//       previews).
// WHEN: Triggered from AccountDashboard "Une demande personnalisée" CTA
//       or one of the 4 quick-shortcut buttons (which skip step 1 by
//       passing initialCategory).
// EDGE: Escape closes (with a confirmation prompt? — not yet, future
//       improvement). Body scroll locked while open. prefers-reduced-
//       motion respected (slide animations neutralised).
// ═══════════════════════════════════════════════════

import { ImageUpload } from '@components/ui/ImageUpload';
import { Textarea } from '@components/ui/Textarea';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  ChevronLeft,
  Compass,
  Frame,
  PartyPopper,
  Sparkles,
  Watch,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type WizardCategory =
  | 'real-estate'
  | 'timepiece'
  | 'art'
  | 'experience'
  | 'travel'
  | 'other';

type Step = 'category' | 'details' | 'review';

const CATEGORY_ICON: Record<WizardCategory, LucideIcon> = {
  'real-estate': Briefcase,
  timepiece: Watch,
  art: Frame,
  experience: PartyPopper,
  travel: Compass,
  other: Sparkles,
};

const CATEGORIES: WizardCategory[] = [
  'real-estate',
  'timepiece',
  'art',
  'experience',
  'travel',
  'other',
];

interface ConciergeRequestWizardProps {
  open: boolean;
  onClose: () => void;
  /** When set, the wizard skips step 1 (Category) and starts at Details. */
  initialCategory?: WizardCategory;
}

export const ConciergeRequestWizard = ({
  open,
  onClose,
  initialCategory,
}: ConciergeRequestWizardProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>(initialCategory ? 'details' : 'category');
  const [category, setCategory] = useState<WizardCategory | null>(initialCategory ?? null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sync internal state when the wizard re-opens with a different entry point.
  const [openLatch, setOpenLatch] = useState(open);
  if (openLatch !== open) {
    setOpenLatch(open);
    if (open) {
      setStep(initialCategory ? 'details' : 'category');
      setCategory(initialCategory ?? null);
      setDescription('');
      setSubmitting(false);
    }
  }

  // Escape closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Body scroll lock.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  const canGoNext =
    (step === 'category' && category !== null) ||
    (step === 'details' && description.trim().length > 0) ||
    step === 'review';

  const goNext = () => {
    if (step === 'category') setStep('details');
    else if (step === 'details') setStep('review');
  };

  const goBack = () => {
    if (step === 'review') setStep('details');
    else if (step === 'details' && !initialCategory) setStep('category');
  };

  const canGoBack = (step === 'details' && !initialCategory) || step === 'review';

  const handleSubmit = () => {
    setSubmitting(true);
    // Simulated for now — wire to Supabase inquiries insert when ready.
    window.setTimeout(() => {
      toast({ variant: 'success', message: t('inquiry.success') });
      setSubmitting(false);
      onClose();
    }, 700);
  };

  const stepNumber = step === 'category' ? 1 : step === 'details' ? 2 : 3;
  const stepLabelKey =
    step === 'category'
      ? 'wizard.step.category'
      : step === 'details'
        ? 'wizard.step.details'
        : 'wizard.step.review';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('wizard.title')}
      className="fixed inset-0 z-(--z-modal) flex items-end justify-center sm:items-center sm:p-4"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t('wizard.actions.close')}
        className="bg-bg/80 absolute inset-0 backdrop-blur-sm"
      />

      <div className="border-border bg-bg rounded-t-card sm:rounded-card shadow-card-rest relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden border">
        {/* ─── Header ─── */}
        <header className="border-border flex items-center justify-between border-b px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-3">
            <span className="text-muted font-mono text-[10px] tracking-widest uppercase">
              {String(stepNumber)}/3
            </span>
            <span className="text-fg text-sm font-medium">{t(stepLabelKey)}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('wizard.actions.close')}
            className="text-muted hover:text-fg duration-base transition-colors"
          >
            <X size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </header>

        {/* ─── Body ─── */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
          {step === 'category' && (
            <div className="space-y-6">
              <header className="space-y-2">
                <h2 className="text-fg text-2xl font-light tracking-tight sm:text-3xl">
                  {t('wizard.title')}
                </h2>
                <p className="text-muted text-sm leading-relaxed">{t('wizard.category.lede')}</p>
              </header>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {CATEGORIES.map(c => {
                  const Icon = CATEGORY_ICON[c];
                  const selected = category === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCategory(c);
                        setStep('details');
                      }}
                      className={cn(
                        'border-border bg-surface group rounded-card flex items-center gap-4 border px-4 py-4 text-left',
                        'shadow-card-rest hover:border-fg/30 hover:shadow-card-hover',
                        'transition-[border-color,box-shadow] duration-300',
                        'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
                        selected && 'border-fg/40',
                      )}
                    >
                      <span className="border-border bg-bg text-fg flex h-10 w-10 shrink-0 items-center justify-center rounded-full border">
                        <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-fg text-sm font-medium">
                          {t(`wizard.category.${c}.title`)}
                        </span>
                        <span className="text-muted text-xs">{t(`wizard.category.${c}.hint`)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'details' && category && (
            <div className="space-y-6">
              <header className="space-y-2">
                <span className="text-muted text-xs tracking-widest uppercase">
                  {t(`wizard.category.${category}.title`)}
                </span>
                <h2 className="text-fg text-2xl font-light tracking-tight sm:text-3xl">
                  {t('wizard.step.details')}
                </h2>
                <p className="text-muted text-sm leading-relaxed">{t('wizard.details.lede')}</p>
              </header>
              <Textarea
                label={t('wizard.step.details')}
                rows={6}
                placeholder={t('wizard.details.placeholder')}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              <ImageUpload
                label={t('wizard.details.photoLabel')}
                hint={t('wizard.details.photoHint')}
                maxFiles={3}
              />
            </div>
          )}

          {step === 'review' && category && (
            <div className="space-y-6">
              <header className="space-y-2">
                <h2 className="text-fg text-2xl font-light tracking-tight sm:text-3xl">
                  {t('wizard.review.title')}
                </h2>
                <p className="text-muted text-sm leading-relaxed">{t('wizard.review.lede')}</p>
              </header>
              <dl className="border-border divide-border bg-surface shadow-card-rest rounded-card divide-y border">
                <div className="flex flex-col gap-1 px-5 py-4">
                  <dt className="text-muted text-xs tracking-widest uppercase">
                    {t('wizard.review.categoryLabel')}
                  </dt>
                  <dd className="text-fg text-sm">{t(`wizard.category.${category}.title`)}</dd>
                </div>
                <div className="flex flex-col gap-1 px-5 py-4">
                  <dt className="text-muted text-xs tracking-widest uppercase">
                    {t('wizard.review.descriptionLabel')}
                  </dt>
                  <dd className="text-fg text-sm leading-relaxed whitespace-pre-wrap">
                    {description.trim() || '—'}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        {/* ─── Footer ─── */}
        <footer className="border-border flex items-center justify-between gap-3 border-t px-5 py-4 sm:px-6">
          {canGoBack ? (
            <button
              type="button"
              onClick={goBack}
              className={cn(
                'text-muted hover:text-fg inline-flex items-center gap-2 text-xs tracking-widest uppercase',
                'duration-base transition-colors',
                'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
              )}
            >
              <ChevronLeft size={14} strokeWidth={1.5} aria-hidden="true" />
              {t('wizard.actions.back')}
            </button>
          ) : (
            <span aria-hidden="true" />
          )}

          {step === 'review' ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={cn(
                'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
                'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-xs tracking-widest uppercase',
                'duration-base transition-[border-color,background-color,opacity]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              {submitting ? t('wizard.actions.sending') : t('wizard.actions.submit')}
              <span aria-hidden="true">→</span>
            </button>
          ) : step === 'details' ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className={cn(
                'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
                'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-xs tracking-widest uppercase',
                'duration-base transition-[border-color,background-color,opacity]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              {t('wizard.actions.next')}
              <span aria-hidden="true">→</span>
            </button>
          ) : (
            <span aria-hidden="true" />
          )}
        </footer>
      </div>
    </div>
  );
};
