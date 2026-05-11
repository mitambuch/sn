// ═══════════════════════════════════════════════════
// ConciergeRequestWizard — adaptive guided request modal
//
// WHAT: Centered modal that walks the member through a smart 3-step
//       flow. Step 2 (Details) is ADAPTIVE per category — Travel and
//       Timepiece expose structured fields (dates, brand, year range,
//       budget…), other categories fall back to free-form. ALL fields
//       are optional — the member never gets stuck, and can always
//       "Request a callback from Salvatore" as a fast lane from the
//       review step.
// WHEN: Triggered from AccountDashboard "Une demande personnalisée"
//       CTA or 4 quick-shortcut buttons (skip step 1 via
//       initialCategory prop).
// EDIT FIELDS: edit the per-category sections in the Details step
//       renderer below. Add a category : extend WizardCategory type +
//       CATEGORY_ICON map + add a `case` in the details switch.
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
  PhoneCall,
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

type FormState = Record<string, string>;

/* ─── Small inline form atoms — kept local to keep the wizard self-
       contained without dragging new UI atoms tonight ──────────── */

const fieldShell = 'flex flex-col gap-1.5';
const labelShell = 'text-muted text-xs tracking-widest uppercase';
const inputShell =
  'border-border bg-bg text-fg placeholder:text-muted/60 rounded-md border px-3 py-2.5 text-sm focus-visible:border-fg/40 focus-visible:outline-none';

const FieldText = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'date' | 'number';
}) => (
  <div className={fieldShell}>
    <label htmlFor={id} className={labelShell}>
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className={inputShell}
    />
  </div>
);

const FieldSelect = ({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) => (
  <div className={fieldShell}>
    <label htmlFor={id} className={labelShell}>
      {label}
    </label>
    <select id={id} value={value} onChange={e => onChange(e.target.value)} className={inputShell}>
      <option value="">—</option>
      {options.map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

export const ConciergeRequestWizard = ({
  open,
  onClose,
  initialCategory,
}: ConciergeRequestWizardProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>(initialCategory ? 'details' : 'category');
  const [category, setCategory] = useState<WizardCategory | null>(initialCategory ?? null);
  const [fields, setFields] = useState<FormState>({});
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reset state on re-open (without effect — derived from prop change).
  const [openLatch, setOpenLatch] = useState(open);
  if (openLatch !== open) {
    setOpenLatch(open);
    if (open) {
      setStep(initialCategory ? 'details' : 'category');
      setCategory(initialCategory ?? null);
      setFields({});
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

  const setField = (key: string, value: string) => setFields(prev => ({ ...prev, [key]: value }));

  const goNext = () => {
    if (step === 'category') setStep('details');
    else if (step === 'details') setStep('review');
  };

  const goBack = () => {
    if (step === 'review') setStep('details');
    else if (step === 'details' && !initialCategory) setStep('category');
  };

  const canGoBack = (step === 'details' && !initialCategory) || step === 'review';

  const handleSubmit = (kind: 'full' | 'callback') => {
    setSubmitting(true);
    // Simulated for MVP — wire to Supabase inquiries.insert once data
    // shape is finalised. Callback mode = minimal request, no fields.
    window.setTimeout(() => {
      toast({
        variant: 'success',
        message: kind === 'callback' ? t('callback.hint') : t('inquiry.success'),
      });
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
      className="fixed inset-0 z-(--z-modal) flex items-end justify-center p-3 sm:items-center sm:p-4"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t('wizard.actions.close')}
        className="bg-bg/80 absolute inset-0 backdrop-blur-sm"
      />

      <div className="border-border bg-bg rounded-card shadow-card-rest relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden border">
        {/* ─── Header ─── */}
        <header className="border-border flex items-center justify-between border-b px-6 py-4 sm:px-8 sm:py-5">
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
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
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
                <p className="text-muted text-sm leading-relaxed">
                  {t('wizard.details.allOptional')}
                </p>
              </header>

              {category === 'travel' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FieldText
                    id="travel-departure"
                    label={t('wizard.fields.travel.departure')}
                    placeholder={t('wizard.fields.travel.departurePlaceholder')}
                    value={fields.travelDeparture ?? ''}
                    onChange={v => setField('travelDeparture', v)}
                  />
                  <FieldText
                    id="travel-destination"
                    label={t('wizard.fields.travel.destination')}
                    placeholder={t('wizard.fields.travel.destinationPlaceholder')}
                    value={fields.travelDestination ?? ''}
                    onChange={v => setField('travelDestination', v)}
                  />
                  <FieldText
                    id="travel-date-start"
                    type="date"
                    label={t('wizard.fields.travel.dateStart')}
                    value={fields.travelDateStart ?? ''}
                    onChange={v => setField('travelDateStart', v)}
                  />
                  <FieldText
                    id="travel-date-end"
                    type="date"
                    label={t('wizard.fields.travel.dateEnd')}
                    value={fields.travelDateEnd ?? ''}
                    onChange={v => setField('travelDateEnd', v)}
                  />
                  <FieldText
                    id="travel-passengers"
                    type="number"
                    label={t('wizard.fields.travel.passengers')}
                    placeholder={t('wizard.fields.travel.passengersPlaceholder')}
                    value={fields.travelPassengers ?? ''}
                    onChange={v => setField('travelPassengers', v)}
                  />
                  <FieldText
                    id="travel-budget"
                    label={t('wizard.fields.travel.budget')}
                    placeholder={t('wizard.fields.travel.budgetPlaceholder')}
                    value={fields.travelBudget ?? ''}
                    onChange={v => setField('travelBudget', v)}
                  />
                </div>
              )}

              {category === 'timepiece' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FieldText
                    id="tp-brand"
                    label={t('wizard.fields.timepiece.brand')}
                    placeholder={t('wizard.fields.timepiece.brandPlaceholder')}
                    value={fields.timepieceBrand ?? ''}
                    onChange={v => setField('timepieceBrand', v)}
                  />
                  <FieldText
                    id="tp-model"
                    label={t('wizard.fields.timepiece.model')}
                    placeholder={t('wizard.fields.timepiece.modelPlaceholder')}
                    value={fields.timepieceModel ?? ''}
                    onChange={v => setField('timepieceModel', v)}
                  />
                  <FieldText
                    id="tp-year-min"
                    type="number"
                    label={t('wizard.fields.timepiece.yearMin')}
                    value={fields.timepieceYearMin ?? ''}
                    onChange={v => setField('timepieceYearMin', v)}
                  />
                  <FieldText
                    id="tp-year-max"
                    type="number"
                    label={t('wizard.fields.timepiece.yearMax')}
                    value={fields.timepieceYearMax ?? ''}
                    onChange={v => setField('timepieceYearMax', v)}
                  />
                  <FieldSelect
                    id="tp-condition"
                    label={t('wizard.fields.timepiece.condition')}
                    value={fields.timepieceCondition ?? ''}
                    onChange={v => setField('timepieceCondition', v)}
                    options={[
                      { value: 'new', label: t('wizard.fields.timepiece.conditionNew') },
                      {
                        value: 'excellent',
                        label: t('wizard.fields.timepiece.conditionExcellent'),
                      },
                      { value: 'good', label: t('wizard.fields.timepiece.conditionGood') },
                      { value: 'any', label: t('wizard.fields.timepiece.conditionAny') },
                    ]}
                  />
                  <FieldText
                    id="tp-budget"
                    label={t('wizard.fields.timepiece.budget')}
                    placeholder={t('wizard.fields.timepiece.budgetPlaceholder')}
                    value={fields.timepieceBudget ?? ''}
                    onChange={v => setField('timepieceBudget', v)}
                  />
                </div>
              )}

              <Textarea
                label={t('wizard.details.freeFormLabel')}
                rows={category === 'travel' || category === 'timepiece' ? 4 : 6}
                placeholder={
                  category === 'travel' || category === 'timepiece'
                    ? t('wizard.details.freeFormPlaceholder')
                    : t('wizard.details.placeholder')
                }
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
                <div className="flex flex-col gap-1 px-6 py-4">
                  <dt className="text-muted text-xs tracking-widest uppercase">
                    {t('wizard.review.categoryLabel')}
                  </dt>
                  <dd className="text-fg text-sm">{t(`wizard.category.${category}.title`)}</dd>
                </div>
                {Object.entries(fields)
                  .filter(([, v]) => v.trim().length > 0)
                  .map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-1 px-6 py-4">
                      <dt className="text-muted text-xs tracking-widest uppercase">
                        {/* Try i18n lookup first then fallback to raw key */}
                        {(() => {
                          if (key.startsWith('travel')) {
                            const sub = key.slice('travel'.length);
                            return t(
                              `wizard.fields.travel.${sub.charAt(0).toLowerCase()}${sub.slice(1)}`,
                            );
                          }
                          if (key.startsWith('timepiece')) {
                            const sub = key.slice('timepiece'.length);
                            return t(
                              `wizard.fields.timepiece.${sub.charAt(0).toLowerCase()}${sub.slice(1)}`,
                            );
                          }
                          return key;
                        })()}
                      </dt>
                      <dd className="text-fg text-sm">{value}</dd>
                    </div>
                  ))}
                {description.trim().length > 0 && (
                  <div className="flex flex-col gap-1 px-6 py-4">
                    <dt className="text-muted text-xs tracking-widest uppercase">
                      {t('wizard.review.descriptionLabel')}
                    </dt>
                    <dd className="text-fg text-sm leading-relaxed whitespace-pre-wrap">
                      {description}
                    </dd>
                  </div>
                )}
              </dl>

              {/* Alternative fast lane : ask Salva to call back, no form needed */}
              <button
                type="button"
                onClick={() => handleSubmit('callback')}
                disabled={submitting}
                className={cn(
                  'border-border text-muted hover:text-fg hover:border-fg/40',
                  'inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-xs tracking-widest uppercase',
                  'duration-base transition-[color,border-color]',
                  'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                )}
              >
                <PhoneCall size={12} strokeWidth={1.5} aria-hidden="true" />
                {t('callback.cta')}
              </button>
            </div>
          )}
        </div>

        {/* ─── Footer ─── */}
        <footer className="border-border flex items-center justify-between gap-3 border-t px-6 py-4 sm:px-8">
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
              onClick={() => handleSubmit('full')}
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
              className={cn(
                'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
                'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-xs tracking-widest uppercase',
                'duration-base transition-[border-color,background-color]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
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
