// ═══════════════════════════════════════════════════
// ConciergeRequestWizard — adaptive guided request modal
//
// WHAT: Centered modal that walks the member through a 4-step flow :
//       category → fields (adaptive per category) → extras (free-form +
//       photos) → review. Step "fields" is ADAPTIVE — travel /
//       timepiece / real-estate / art / experience each surface their
//       own structured fields. "Other" skips the fields step entirely.
//       ALL fields are optional and the review step exposes a fast
//       "request a callback" lane for clients who don't want to fill
//       anything.
//
//       UI rework 2026-05-14 14:50 (owner direction "plus esthétique
//       plus construit") :
//       - Visual segmented progress bar replaces "n/total" text
//       - Header carries a category breadcrumb chip on step 2+
//       - Modal width max-w-2xl → max-w-3xl, border-fg/15 tighter
//       - Category picker : 2 cols mobile / 3 cols tablet+ cards
//         flex-col with raised icon, selected = filled fg bg-fg
//       - Form atoms : inputs h-12 with focus ring, labels in font-mono
//         tracking-[0.18em] (less screaming than tracking-widest)
//       - Review summary : surface card with mono uppercase labels
//       - Footer + CTAs : h-12 generous, mono caps tracking-[0.18em]
//
//       Premium-controls rework 2026-05-14 15:34 (owner direction "fait
//       un truc où on doit pas mettre à la main les chiffres, je veux
//       un truc de formulaire PREMIUM et tellement fluide") :
//       - RangeSlider atom (dual-thumb bucketed slider) replaces every
//         min/max numeric input pair — surface, year, every budget
//       - Stepper atom (+/− buttons) replaces every standalone number
//         input — passengers, bedrooms, guests, art dimensions
//       - CHF formatter shared across the 5 budget sliders (50K, 1M, 5M…)
//       - Review step compacted : range pairs collapse to a single
//         "min — max" row, 2-col grid, no scroll on a typical phone
//       - Callback CTA demoted to a quiet "or [link]" under the dl
//         (was a full-width ghost button)
//       - Mobile chrome trimmed : header py-3 (was py-4), body px-5
//         (was px-6), category cards p-3 + h-9 icon (was p-4 + h-11),
//         hint hidden below sm — 6 categories fit above the fold on
//         a 375 × 667 phone.
// WHEN: Triggered from AccountDashboard "Une demande personnalisée"
//       CTA or 4 quick-shortcut buttons (skip step 1 via
//       initialCategory prop). Also mounted at the AppLayout level via
//       AccountRequestModalProvider so the bottom-nav FAB opens the
//       same instance.
// EDIT FIELDS: edit the per-category sections in the Details step
//       renderer below. Add a category : extend WizardCategory type +
//       CATEGORY_ICON map + add a `case` in the details switch.
// ═══════════════════════════════════════════════════

import { ImageUpload } from '@components/ui/ImageUpload';
import { RangeSlider } from '@components/ui/RangeSlider';
import { Stepper } from '@components/ui/Stepper';
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

type Step = 'category' | 'fields' | 'extras' | 'review';

/** Returns the ordered chain of steps for a given category. "Other" has
 *  no per-category fields, so it skips the 'fields' step. */
function stepsFor(category: WizardCategory | null): Step[] {
  if (!category) return ['category', 'fields', 'extras', 'review'];
  if (category === 'other') return ['category', 'extras', 'review'];
  return ['category', 'fields', 'extras', 'review'];
}

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

/* ─── Step config — bucketed slider scales + CHF formatter. Owner
       direction 2026-05-14 15:34 : "fait un truc où on doit pas mettre
       à la main les chiffres". Every numeric range is a bucketed
       RangeSlider with discrete steps ; the CHF formatter is shared
       across the 5 budget sliders so visual consistency is built-in. */

const SURFACE_STEPS = [0, 50, 100, 150, 200, 300, 500, 750, 1000, 1500, 2500] as const;
const YEAR_STEPS = Array.from({ length: 76 }, (_, i) => 1950 + i); // 1950..2025

const BUDGET_REAL_ESTATE = [
  0, 500_000, 1_000_000, 2_500_000, 5_000_000, 10_000_000, 25_000_000, 50_000_000, 100_000_000,
] as const;
const BUDGET_TIMEPIECE = [
  0, 10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000, 2_500_000, 5_000_000,
] as const;
const BUDGET_ART = [
  0, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000, 2_500_000, 5_000_000, 10_000_000,
] as const;
const BUDGET_TRAVEL = [
  0, 10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000, 2_500_000,
] as const;
const BUDGET_EXPERIENCE = [
  0, 5_000, 10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000,
] as const;

const formatCHF = (n: number): string => {
  if (n === 0) return '0';
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m.toLocaleString('fr-CH', { maximumFractionDigits: 1 })} M CHF`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toLocaleString('fr-CH', { maximumFractionDigits: 0 })}K CHF`;
  }
  return `${n.toLocaleString('fr-CH')} CHF`;
};
const formatM2 = (n: number): string => (n === 0 ? '0' : `${n.toLocaleString('fr-CH')} m²`);
const formatYear = (n: number): string => String(n);

/** Read a numeric value from the string-keyed FormState, fall back to default. */
const num = (v: string | undefined, fallback: number): number => {
  if (!v) return fallback;
  const parsed = parseInt(v, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/* ─── Form atoms — local to the wizard. Tuned for an app-grade feel :
       h-12 inputs (48px touch targets), label in mono caps but smaller
       tracking so it reads as a section sub-header, focus state with a
       proper accent ring (not just a border tint). ───────────────── */

const fieldShell = 'flex flex-col gap-2';
const labelShell = 'text-muted font-mono text-[10px] font-medium tracking-[0.18em] uppercase';
const inputShell = cn(
  'border-fg/15 bg-bg text-fg placeholder:text-muted/50',
  'h-12 rounded-md border px-3.5 text-sm leading-none',
  'transition-[border-color,box-shadow] duration-200',
  'focus-visible:border-fg/40 focus-visible:ring-fg/10 focus-visible:ring-2 focus-visible:outline-none',
);

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

  // Entry step depends on initialCategory : Other skips 'fields' entirely.
  const initialEntryStep: Step = initialCategory
    ? initialCategory === 'other'
      ? 'extras'
      : 'fields'
    : 'category';

  const [step, setStep] = useState<Step>(initialEntryStep);
  const [category, setCategory] = useState<WizardCategory | null>(initialCategory ?? null);
  const [fields, setFields] = useState<FormState>({});
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reset state on re-open (without effect — derived from prop change).
  const [openLatch, setOpenLatch] = useState(open);
  if (openLatch !== open) {
    setOpenLatch(open);
    if (open) {
      setStep(initialEntryStep);
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

  const chain = stepsFor(category);
  const stepIdx = chain.indexOf(step);
  // First reachable step in the chain (after initialCategory entry).
  const firstReachable = initialCategory
    ? initialCategory === 'other'
      ? 'extras'
      : 'fields'
    : 'category';

  const goNext = () => {
    if (stepIdx >= 0 && stepIdx < chain.length - 1) {
      const next = chain[stepIdx + 1];
      if (next !== undefined) setStep(next);
    }
  };

  const goBack = () => {
    if (stepIdx > 0 && step !== firstReachable) {
      const prev = chain[stepIdx - 1];
      if (prev !== undefined) setStep(prev);
    }
  };

  const canGoBack = stepIdx > 0 && step !== firstReachable;

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

  const stepNumber = stepIdx + 1;
  const stepTotal = chain.length;
  const stepLabelKey = `wizard.step.${step}`;

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

      <div className="border-fg/15 bg-bg shadow-card-rest sm:rounded-card relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border">
        {/* ─── Header — eyebrow row + visual progress bar. Each segment
              animates fill on step change so the member feels forward
              motion. The category breadcrumb (when set) reminds them of
              the current scope. ─────────────────────────────────────── */}
        <header className="border-fg/10 border-b">
          <div className="flex items-center justify-between gap-3 px-5 py-3 sm:px-8 sm:py-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase">
                {String(stepNumber).padStart(2, '0')} / {String(stepTotal).padStart(2, '0')}
              </span>
              <span aria-hidden="true" className="bg-fg/15 h-3 w-px" />
              <span className="text-fg truncate text-sm font-medium tracking-tight">
                {t(stepLabelKey)}
              </span>
              {category && step !== 'category' && (
                <>
                  <span aria-hidden="true" className="bg-fg/15 hidden h-3 w-px sm:inline-block" />
                  <span className="text-muted hidden truncate text-xs tracking-tight sm:inline">
                    {t(`wizard.category.${category}.title`)}
                  </span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('wizard.actions.close')}
              className="text-muted hover:text-fg focus-visible:ring-accent duration-base shrink-0 rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <X size={18} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
          {/* Segmented progress bar — one segment per step, filled up to
              and including the current step. */}
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={stepTotal}
            aria-valuenow={stepNumber}
            className="bg-fg/5 flex h-1 w-full gap-0.5 px-5 sm:px-8"
          >
            {chain.map((s, i) => (
              <span
                key={s}
                aria-hidden="true"
                className={cn(
                  'h-full flex-1 transition-colors duration-500 ease-out',
                  i <= stepIdx ? 'bg-fg' : 'bg-fg/10',
                )}
              />
            ))}
          </div>
        </header>

        {/* ─── Body — tighter mobile padding for the no-scroll mantra. ── */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-8">
          {step === 'category' && (
            <div className="space-y-5 sm:space-y-7">
              <header className="space-y-2 sm:space-y-3">
                <span className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase">
                  {t('wizard.step.category')}
                </span>
                <h2 className="text-fg font-mono text-xl font-bold tracking-tight uppercase sm:text-2xl md:text-3xl">
                  {t('wizard.title')}
                </h2>
                <p className="text-muted max-w-prose text-sm leading-relaxed">
                  {t('wizard.category.lede')}
                </p>
              </header>
              {/* 2 cols mobile, 3 cols tablet+. Compact mobile padding so
                  the 6 cards fit visible without a long scroll. Hint
                  text hidden below sm to keep cards short (the icon +
                  title is enough at that size). */}
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4">
                {CATEGORIES.map(c => {
                  const Icon = CATEGORY_ICON[c];
                  const selected = category === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCategory(c);
                        setStep(c === 'other' ? 'extras' : 'fields');
                      }}
                      className={cn(
                        'group bg-surface/60 hover:bg-surface flex flex-col items-start gap-2 rounded-xl border p-3 text-left sm:gap-3 sm:p-5',
                        'transition-[border-color,background-color,box-shadow] duration-300',
                        'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
                        selected
                          ? 'border-fg/50 shadow-card-rest bg-surface'
                          : 'border-fg/10 hover:border-fg/30',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 sm:h-11 sm:w-11',
                          selected
                            ? 'border-fg bg-fg text-bg'
                            : 'border-fg/15 bg-bg text-fg group-hover:border-fg/40',
                        )}
                      >
                        <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <div className="flex flex-col gap-0.5 sm:gap-1">
                        <span className="text-fg text-[13px] leading-tight font-medium sm:text-base">
                          {t(`wizard.category.${c}.title`)}
                        </span>
                        <span className="text-muted hidden text-xs leading-snug sm:inline">
                          {t(`wizard.category.${c}.hint`)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'fields' && category && category !== 'other' && (
            <div className="space-y-5 sm:space-y-7">
              <header className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <span className="border-fg/15 bg-surface/60 text-fg inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase">
                    {(() => {
                      const CatIcon = CATEGORY_ICON[category];
                      return <CatIcon size={12} strokeWidth={1.5} aria-hidden="true" />;
                    })()}
                    {t(`wizard.category.${category}.title`)}
                  </span>
                </div>
                <h2 className="text-fg font-mono text-xl font-bold tracking-tight uppercase sm:text-2xl md:text-3xl">
                  {t('wizard.step.fields')}
                </h2>
                <p className="text-muted max-w-prose text-sm leading-relaxed">
                  {t('wizard.details.allOptional')}
                </p>
              </header>

              {category === 'travel' && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                  <Stepper
                    id="travel-passengers"
                    label={t('wizard.fields.travel.passengers')}
                    value={num(fields.travelPassengers, 0)}
                    min={0}
                    max={50}
                    onChange={n => setField('travelPassengers', n === 0 ? '' : String(n))}
                  />
                  <div className="sm:col-span-2">
                    <RangeSlider
                      id="travel-budget"
                      label={t('wizard.fields.travel.budget')}
                      steps={BUDGET_TRAVEL}
                      value={[
                        num(fields.travelBudgetMin, BUDGET_TRAVEL[0]),
                        num(fields.travelBudgetMax, BUDGET_TRAVEL[BUDGET_TRAVEL.length - 1]!),
                      ]}
                      onChange={([min, max]) => {
                        setField('travelBudgetMin', String(min));
                        setField('travelBudgetMax', String(max));
                      }}
                      format={formatCHF}
                      maxSuffix="+"
                    />
                  </div>
                </div>
              )}

              {category === 'timepiece' && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                  <div className="sm:col-span-2">
                    <RangeSlider
                      id="tp-year"
                      label={t('wizard.fields.timepiece.year')}
                      steps={YEAR_STEPS}
                      value={[
                        num(fields.timepieceYearMin, YEAR_STEPS[0]!),
                        num(fields.timepieceYearMax, YEAR_STEPS[YEAR_STEPS.length - 1]!),
                      ]}
                      onChange={([min, max]) => {
                        setField('timepieceYearMin', String(min));
                        setField('timepieceYearMax', String(max));
                      }}
                      format={formatYear}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <RangeSlider
                      id="tp-budget"
                      label={t('wizard.fields.timepiece.budget')}
                      steps={BUDGET_TIMEPIECE}
                      value={[
                        num(fields.timepieceBudgetMin, BUDGET_TIMEPIECE[0]),
                        num(
                          fields.timepieceBudgetMax,
                          BUDGET_TIMEPIECE[BUDGET_TIMEPIECE.length - 1]!,
                        ),
                      ]}
                      onChange={([min, max]) => {
                        setField('timepieceBudgetMin', String(min));
                        setField('timepieceBudgetMax', String(max));
                      }}
                      format={formatCHF}
                      maxSuffix="+"
                    />
                  </div>
                </div>
              )}

              {category === 'real-estate' && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FieldSelect
                    id="re-type"
                    label={t('wizard.fields.real-estate.type')}
                    value={fields.realEstateType ?? ''}
                    onChange={v => setField('realEstateType', v)}
                    options={[
                      { value: 'chalet', label: t('wizard.fields.real-estate.typeChalet') },
                      { value: 'villa', label: t('wizard.fields.real-estate.typeVilla') },
                      { value: 'penthouse', label: t('wizard.fields.real-estate.typePenthouse') },
                      { value: 'estate', label: t('wizard.fields.real-estate.typeEstate') },
                      { value: 'townhouse', label: t('wizard.fields.real-estate.typeTownhouse') },
                    ]}
                  />
                  <FieldText
                    id="re-region"
                    label={t('wizard.fields.real-estate.region')}
                    placeholder={t('wizard.fields.real-estate.regionPlaceholder')}
                    value={fields.realEstateRegion ?? ''}
                    onChange={v => setField('realEstateRegion', v)}
                  />
                  <Stepper
                    id="re-bedrooms"
                    label={t('wizard.fields.real-estate.bedrooms')}
                    value={num(fields.realEstateBedrooms, 0)}
                    min={0}
                    max={20}
                    onChange={n => setField('realEstateBedrooms', n === 0 ? '' : String(n))}
                  />
                  <FieldSelect
                    id="re-availability"
                    label={t('wizard.fields.real-estate.availability')}
                    value={fields.realEstateAvailability ?? ''}
                    onChange={v => setField('realEstateAvailability', v)}
                    options={[
                      { value: 'sale', label: t('wizard.fields.real-estate.availabilitySale') },
                      { value: 'rent', label: t('wizard.fields.real-estate.availabilityRent') },
                      { value: 'both', label: t('wizard.fields.real-estate.availabilityBoth') },
                    ]}
                  />
                  <div className="sm:col-span-2">
                    <RangeSlider
                      id="re-surface"
                      label={t('wizard.fields.real-estate.surface')}
                      steps={SURFACE_STEPS}
                      value={[
                        num(fields.realEstateSurfaceMin, SURFACE_STEPS[0]),
                        num(fields.realEstateSurfaceMax, SURFACE_STEPS[SURFACE_STEPS.length - 1]!),
                      ]}
                      onChange={([min, max]) => {
                        setField('realEstateSurfaceMin', String(min));
                        setField('realEstateSurfaceMax', String(max));
                      }}
                      format={formatM2}
                      maxSuffix="+"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <RangeSlider
                      id="re-budget"
                      label={t('wizard.fields.real-estate.budget')}
                      steps={BUDGET_REAL_ESTATE}
                      value={[
                        num(fields.realEstateBudgetMin, BUDGET_REAL_ESTATE[0]),
                        num(
                          fields.realEstateBudgetMax,
                          BUDGET_REAL_ESTATE[BUDGET_REAL_ESTATE.length - 1]!,
                        ),
                      ]}
                      onChange={([min, max]) => {
                        setField('realEstateBudgetMin', String(min));
                        setField('realEstateBudgetMax', String(max));
                      }}
                      format={formatCHF}
                      maxSuffix="+"
                    />
                  </div>
                </div>
              )}

              {category === 'art' && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FieldText
                    id="art-artist"
                    label={t('wizard.fields.art.artist')}
                    placeholder={t('wizard.fields.art.artistPlaceholder')}
                    value={fields.artArtist ?? ''}
                    onChange={v => setField('artArtist', v)}
                  />
                  <FieldSelect
                    id="art-period"
                    label={t('wizard.fields.art.period')}
                    value={fields.artPeriod ?? ''}
                    onChange={v => setField('artPeriod', v)}
                    options={[
                      { value: 'contemporary', label: t('wizard.fields.art.periodContemporary') },
                      { value: 'modern', label: t('wizard.fields.art.periodModern') },
                      { value: 'classic', label: t('wizard.fields.art.periodClassic') },
                    ]}
                  />
                  <FieldSelect
                    id="art-medium"
                    label={t('wizard.fields.art.medium')}
                    value={fields.artMedium ?? ''}
                    onChange={v => setField('artMedium', v)}
                    options={[
                      { value: 'oil', label: t('wizard.fields.art.mediumOil') },
                      { value: 'acrylic', label: t('wizard.fields.art.mediumAcrylic') },
                      { value: 'sculpture', label: t('wizard.fields.art.mediumSculpture') },
                      { value: 'photo', label: t('wizard.fields.art.mediumPhoto') },
                      { value: 'print', label: t('wizard.fields.art.mediumPrint') },
                      { value: 'mixed', label: t('wizard.fields.art.mediumMixed') },
                    ]}
                  />
                  <Stepper
                    id="art-height"
                    label={t('wizard.fields.art.heightMax')}
                    value={num(fields.artHeightMax, 0)}
                    min={0}
                    max={500}
                    step={10}
                    unit={t('wizard.fields.art.dimensionsUnit')}
                    onChange={n => setField('artHeightMax', n === 0 ? '' : String(n))}
                  />
                  <Stepper
                    id="art-width"
                    label={t('wizard.fields.art.widthMax')}
                    value={num(fields.artWidthMax, 0)}
                    min={0}
                    max={500}
                    step={10}
                    unit={t('wizard.fields.art.dimensionsUnit')}
                    onChange={n => setField('artWidthMax', n === 0 ? '' : String(n))}
                  />
                  <div className="sm:col-span-2">
                    <RangeSlider
                      id="art-budget"
                      label={t('wizard.fields.art.budget')}
                      steps={BUDGET_ART}
                      value={[
                        num(fields.artBudgetMin, BUDGET_ART[0]),
                        num(fields.artBudgetMax, BUDGET_ART[BUDGET_ART.length - 1]!),
                      ]}
                      onChange={([min, max]) => {
                        setField('artBudgetMin', String(min));
                        setField('artBudgetMax', String(max));
                      }}
                      format={formatCHF}
                      maxSuffix="+"
                    />
                  </div>
                </div>
              )}

              {category === 'experience' && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FieldSelect
                    id="exp-type"
                    label={t('wizard.fields.experience.type')}
                    value={fields.experienceType ?? ''}
                    onChange={v => setField('experienceType', v)}
                    options={[
                      { value: 'dinner', label: t('wizard.fields.experience.typeDinner') },
                      { value: 'gala', label: t('wizard.fields.experience.typeGala') },
                      { value: 'concert', label: t('wizard.fields.experience.typeConcert') },
                      { value: 'sport', label: t('wizard.fields.experience.typeSport') },
                      { value: 'show', label: t('wizard.fields.experience.typeShow') },
                      { value: 'cultural', label: t('wizard.fields.experience.typeCultural') },
                    ]}
                  />
                  <FieldText
                    id="exp-date"
                    type="date"
                    label={t('wizard.fields.experience.date')}
                    value={fields.experienceDate ?? ''}
                    onChange={v => setField('experienceDate', v)}
                  />
                  <FieldText
                    id="exp-location"
                    label={t('wizard.fields.experience.location')}
                    placeholder={t('wizard.fields.experience.locationPlaceholder')}
                    value={fields.experienceLocation ?? ''}
                    onChange={v => setField('experienceLocation', v)}
                  />
                  <Stepper
                    id="exp-guests"
                    label={t('wizard.fields.experience.guests')}
                    value={num(fields.experienceGuests, 0)}
                    min={0}
                    max={200}
                    onChange={n => setField('experienceGuests', n === 0 ? '' : String(n))}
                  />
                  <FieldSelect
                    id="exp-dress"
                    label={t('wizard.fields.experience.dressCode')}
                    value={fields.experienceDressCode ?? ''}
                    onChange={v => setField('experienceDressCode', v)}
                    options={[
                      { value: 'casual', label: t('wizard.fields.experience.dressCasual') },
                      { value: 'smart', label: t('wizard.fields.experience.dressSmart') },
                      { value: 'blackTie', label: t('wizard.fields.experience.dressBlackTie') },
                    ]}
                  />
                  <div className="sm:col-span-2">
                    <RangeSlider
                      id="exp-budget"
                      label={t('wizard.fields.experience.budget')}
                      steps={BUDGET_EXPERIENCE}
                      value={[
                        num(fields.experienceBudgetMin, BUDGET_EXPERIENCE[0]),
                        num(
                          fields.experienceBudgetMax,
                          BUDGET_EXPERIENCE[BUDGET_EXPERIENCE.length - 1]!,
                        ),
                      ]}
                      onChange={([min, max]) => {
                        setField('experienceBudgetMin', String(min));
                        setField('experienceBudgetMax', String(max));
                      }}
                      format={formatCHF}
                      maxSuffix="+"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'extras' && category && (
            <div className="space-y-5 sm:space-y-7">
              <header className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <span className="border-fg/15 bg-surface/60 text-fg inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase">
                    {(() => {
                      const CatIcon = CATEGORY_ICON[category];
                      return <CatIcon size={12} strokeWidth={1.5} aria-hidden="true" />;
                    })()}
                    {t(`wizard.category.${category}.title`)}
                  </span>
                </div>
                <h2 className="text-fg font-mono text-xl font-bold tracking-tight uppercase sm:text-2xl md:text-3xl">
                  {t('wizard.step.extras')}
                </h2>
                <p className="text-muted max-w-prose text-sm leading-relaxed">
                  {category === 'other' ? t('wizard.other.lede') : t('wizard.extras.lede')}
                </p>
              </header>
              <Textarea
                label={t('wizard.details.freeFormLabel')}
                rows={category === 'other' ? 7 : 5}
                placeholder={
                  category === 'other'
                    ? t('wizard.other.placeholder')
                    : t('wizard.details.freeFormPlaceholder')
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
            <div className="space-y-5">
              <header className="space-y-1.5">
                <h2 className="text-fg font-mono text-xl font-bold tracking-tight uppercase sm:text-2xl">
                  {t('wizard.review.title')}
                </h2>
                <p className="text-muted text-xs leading-relaxed sm:text-sm">
                  {t('wizard.review.lede')}
                </p>
              </header>

              {/* Compact review grid — 2 cols sm+, each cell is a label
                  over value pair. Range pairs (min/max) are combined into
                  one row so 6 wizard fields don't render as 12 review
                  lines. Description spans the full width when present. */}
              {(() => {
                type Item = { key: string; label: string; value: string; fullWidth?: boolean };
                const items: Item[] = [
                  {
                    key: 'category',
                    label: t('wizard.review.categoryLabel'),
                    value: t(`wizard.category.${category}.title`),
                  },
                ];

                // Range pairs to combine — each (minKey, maxKey) tuple
                // collapses to a single "x — y" row when at least one
                // value differs from the bucket default of 0.
                const rangePairs: {
                  min: string;
                  max: string;
                  label: string;
                  format: (n: number) => string;
                }[] = [
                  {
                    min: 'realEstateSurfaceMin',
                    max: 'realEstateSurfaceMax',
                    label: t('wizard.fields.real-estate.surface'),
                    format: formatM2,
                  },
                  {
                    min: 'realEstateBudgetMin',
                    max: 'realEstateBudgetMax',
                    label: t('wizard.fields.real-estate.budget'),
                    format: formatCHF,
                  },
                  {
                    min: 'timepieceYearMin',
                    max: 'timepieceYearMax',
                    label: t('wizard.fields.timepiece.year'),
                    format: formatYear,
                  },
                  {
                    min: 'timepieceBudgetMin',
                    max: 'timepieceBudgetMax',
                    label: t('wizard.fields.timepiece.budget'),
                    format: formatCHF,
                  },
                  {
                    min: 'artBudgetMin',
                    max: 'artBudgetMax',
                    label: t('wizard.fields.art.budget'),
                    format: formatCHF,
                  },
                  {
                    min: 'travelBudgetMin',
                    max: 'travelBudgetMax',
                    label: t('wizard.fields.travel.budget'),
                    format: formatCHF,
                  },
                  {
                    min: 'experienceBudgetMin',
                    max: 'experienceBudgetMax',
                    label: t('wizard.fields.experience.budget'),
                    format: formatCHF,
                  },
                ];

                const consumed = new Set<string>();
                for (const pair of rangePairs) {
                  const minStr = fields[pair.min];
                  const maxStr = fields[pair.max];
                  if (minStr === undefined && maxStr === undefined) continue;
                  consumed.add(pair.min);
                  consumed.add(pair.max);
                  const minN = num(minStr, 0);
                  const maxN = num(maxStr, 0);
                  if (minN === 0 && maxN === 0) continue;
                  items.push({
                    key: pair.min,
                    label: pair.label,
                    value: `${pair.format(minN)}  —  ${pair.format(maxN)}`,
                  });
                }

                // Remaining scalar fields — reuse the original i18n lookup.
                const labelFor = (key: string): string => {
                  const lookups: { prefix: string; ns: string }[] = [
                    { prefix: 'travel', ns: 'travel' },
                    { prefix: 'timepiece', ns: 'timepiece' },
                    { prefix: 'realEstate', ns: 'real-estate' },
                    { prefix: 'art', ns: 'art' },
                    { prefix: 'experience', ns: 'experience' },
                  ];
                  for (const { prefix, ns } of lookups) {
                    if (key.startsWith(prefix)) {
                      const sub = key.slice(prefix.length);
                      return t(`wizard.fields.${ns}.${sub.charAt(0).toLowerCase()}${sub.slice(1)}`);
                    }
                  }
                  return key;
                };

                for (const [key, value] of Object.entries(fields)) {
                  if (consumed.has(key)) continue;
                  if (!value.trim()) continue;
                  items.push({ key, label: labelFor(key), value });
                }

                if (description.trim().length > 0) {
                  items.push({
                    key: '__description',
                    label: t('wizard.review.descriptionLabel'),
                    value: description,
                    fullWidth: true,
                  });
                }

                return (
                  <dl className="border-fg/15 bg-surface/60 grid grid-cols-1 gap-x-6 gap-y-4 rounded-xl border p-5 sm:grid-cols-2 sm:p-6">
                    {items.map(item => (
                      <div
                        key={item.key}
                        className={cn('flex flex-col gap-1', item.fullWidth && 'sm:col-span-2')}
                      >
                        <dt className="text-muted font-mono text-[10px] tracking-[0.18em] uppercase">
                          {item.label}
                        </dt>
                        <dd
                          className={cn(
                            'text-fg text-sm leading-snug',
                            item.fullWidth && 'whitespace-pre-wrap',
                          )}
                        >
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                );
              })()}

              {/* Fast lane — owner direction 2026-05-14 15:34 : "le bouton
                  on a callback.cta" : keep the option, present it as a
                  clearly secondary action with a quiet style so it
                  doesn't compete with the primary footer Submit. */}
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted font-mono text-[10px] tracking-[0.18em] uppercase">
                  {t('callback.or')}
                </span>
                <button
                  type="button"
                  onClick={() => handleSubmit('callback')}
                  disabled={submitting}
                  className={cn(
                    'text-fg duration-base inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase underline underline-offset-4 transition-opacity',
                    'focus-visible:ring-accent rounded-sm focus-visible:ring-2 focus-visible:outline-none',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                  )}
                >
                  <PhoneCall size={12} strokeWidth={1.75} aria-hidden="true" />
                  {t('callback.cta')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Footer — h-12 generous touch targets, mono caps chrome
              consistent with the rest of the dashboard. Back is a
              minimal text-link ; primary action fills with bg-fg. ── */}
        <footer className="border-fg/10 bg-bg/95 sticky bottom-0 flex items-center justify-between gap-3 border-t px-5 py-3 sm:px-8 sm:py-5">
          {canGoBack ? (
            <button
              type="button"
              onClick={goBack}
              className={cn(
                'text-muted hover:text-fg inline-flex h-12 items-center gap-2 px-1 font-mono text-[11px] tracking-[0.18em] whitespace-nowrap uppercase',
                'duration-base transition-colors',
                'focus-visible:ring-accent rounded-sm focus-visible:ring-2 focus-visible:outline-none',
              )}
            >
              <ChevronLeft size={16} strokeWidth={1.5} aria-hidden="true" />
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
                'inline-flex h-12 items-center gap-3 rounded-md border px-6 font-mono text-[11px] tracking-[0.18em] whitespace-nowrap uppercase sm:px-8',
                'duration-base transition-[border-color,background-color,opacity]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              {submitting ? t('wizard.actions.sending') : t('wizard.actions.submit')}
              <span aria-hidden="true">→</span>
            </button>
          ) : step === 'fields' || step === 'extras' ? (
            <button
              type="button"
              onClick={goNext}
              className={cn(
                'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
                'inline-flex h-12 items-center gap-3 rounded-md border px-6 font-mono text-[11px] tracking-[0.18em] whitespace-nowrap uppercase sm:px-8',
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
