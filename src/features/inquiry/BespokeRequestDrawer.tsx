// ═══════════════════════════════════════════════════
// BespokeRequestDrawer — full sur-mesure request form
//
// WHAT: The most detailed inquiry form in the product. Captures domain
//       (multi-select chips), free-form description, budget min/max +
//       currency, urgency, optional target date, photo attachments, and
//       a privacy acknowledgement. Designed for the "we don't have what
//       you want — describe it" moment.
// WHEN: Triggered from CatalogueProactiveBanner on any list page, or
//       from the dashboard "demande sur mesure" intent.
// CHROME: <RequestDrawerShell /> canonical (header + slide-in + backdrop).
//         Form-only logic lives here.
// EDGE: No real submission yet — simulated 800ms latency + toast.
// ═══════════════════════════════════════════════════

import { ImageUpload } from '@components/ui/ImageUpload';
import { Input } from '@components/ui/Input';
import { RequestDrawerShell } from '@components/ui/RequestDrawerShell';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { ShieldCheck } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DOMAINS = [
  'property',
  'timepiece',
  'artwork',
  'event',
  'journey',
  'concierge',
  'other',
] as const;
type Domain = (typeof DOMAINS)[number];

const URGENCY = ['this-week', 'this-month', 'three-months', 'no-rush'] as const;
type Urgency = (typeof URGENCY)[number];

const CURRENCIES = ['CHF', 'EUR', 'USD'] as const;
type Currency = (typeof CURRENCIES)[number];

interface BespokeRequestDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Optional pre-selected domain (when opened from a list page). */
  initialDomain?: Domain;
}

export const BespokeRequestDrawer = ({
  open,
  onClose,
  initialDomain,
}: BespokeRequestDrawerProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [domains, setDomains] = useState<Set<Domain>>(
    new Set(initialDomain ? [initialDomain] : []),
  );
  const [description, setDescription] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [currency, setCurrency] = useState<Currency>('CHF');
  const [urgency, setUrgency] = useState<Urgency>('this-month');
  const [targetDate, setTargetDate] = useState('');
  const [confidential, setConfidential] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const toggleDomain = (d: Domain) => {
    setDomains(prev => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast({ variant: 'success', message: t('bespoke.success') });
      setDescription('');
      setBudgetMin('');
      setBudgetMax('');
      setTargetDate('');
      setSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <RequestDrawerShell
      open={open}
      onClose={onClose}
      eyebrow={t('bespoke.eyebrow')}
      title={t('bespoke.title')}
      lede={t('bespoke.lede')}
      widthClass="max-w-2xl"
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* ─── Domain chips ─── */}
        <fieldset className="flex flex-col gap-2">
          <legend className="text-fg text-sm font-medium">{t('bespoke.domain')}</legend>
          <p className="text-muted text-xs leading-relaxed">{t('bespoke.domainHint')}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DOMAINS.map(d => {
              const selected = domains.has(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDomain(d)}
                  aria-pressed={selected}
                  className={cn(
                    'inline-flex items-center rounded-full border px-3 py-1 text-xs tracking-widest uppercase',
                    'duration-base transition-[color,background-color,border-color]',
                    'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                    selected
                      ? 'bg-fg text-bg border-fg'
                      : 'border-border text-muted hover:text-fg hover:border-fg/40 bg-transparent',
                  )}
                >
                  {t(`bespoke.domainValues.${d}`)}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* ─── Description ─── */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bespoke-desc" className="text-fg text-sm font-medium">
            {t('bespoke.description')}
          </label>
          <p className="text-muted text-xs leading-relaxed">{t('bespoke.descriptionHint')}</p>
          <textarea
            id="bespoke-desc"
            rows={5}
            required
            placeholder={t('bespoke.descriptionPlaceholder')}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="bg-surface/80 border-border focus:border-accent focus:ring-accent text-fg placeholder:text-muted/60 mt-1 rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
          />
        </div>

        {/* ─── Budget ─── */}
        <fieldset className="flex flex-col gap-2">
          <legend className="text-fg text-sm font-medium">{t('bespoke.budget')}</legend>
          <p className="text-muted text-xs leading-relaxed">{t('bespoke.budgetHint')}</p>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
              label={t('bespoke.budgetMin')}
              type="number"
              min={0}
              step={1000}
              placeholder="0"
              value={budgetMin}
              onChange={e => setBudgetMin(e.target.value)}
            />
            <Input
              label={t('bespoke.budgetMax')}
              type="number"
              min={0}
              step={1000}
              placeholder="—"
              value={budgetMax}
              onChange={e => setBudgetMax(e.target.value)}
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="bespoke-currency" className="text-fg text-sm font-medium">
                {t('bespoke.currency')}
              </label>
              <select
                id="bespoke-currency"
                value={currency}
                onChange={e => setCurrency(e.target.value as Currency)}
                className="bg-surface/80 border-border focus:border-accent focus:ring-accent text-fg rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
              >
                {CURRENCIES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* ─── Urgency chips ─── */}
        <fieldset className="flex flex-col gap-2">
          <legend className="text-fg text-sm font-medium">{t('bespoke.urgency')}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {URGENCY.map(u => {
              const selected = urgency === u;
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUrgency(u)}
                  aria-pressed={selected}
                  className={cn(
                    'inline-flex items-center rounded-full border px-3 py-1 text-xs tracking-widest uppercase',
                    'duration-base transition-[color,background-color,border-color]',
                    'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                    selected
                      ? 'bg-fg text-bg border-fg'
                      : 'border-border text-muted hover:text-fg hover:border-fg/40 bg-transparent',
                  )}
                >
                  {t(`bespoke.urgencyValues.${u}`)}
                </button>
              );
            })}
          </div>
        </fieldset>

        <Input
          label={t('bespoke.targetDate')}
          type="date"
          value={targetDate}
          onChange={e => setTargetDate(e.target.value)}
        />

        {/* ─── Photos ─── */}
        <ImageUpload label={t('bespoke.attachLabel')} hint={t('bespoke.attachHint')} maxFiles={5} />

        {/* ─── Confidentiality acknowledgement ─── */}
        <button
          type="button"
          onClick={() => setConfidential(v => !v)}
          aria-pressed={confidential}
          className="border-border bg-surface/40 hover:border-fg/40 flex items-start gap-3 rounded-md border p-4 text-left"
        >
          <span
            aria-hidden="true"
            className={cn(
              'border-border mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border',
              confidential ? 'bg-fg' : 'bg-bg',
            )}
          >
            {confidential && <span className="text-bg text-xs">✓</span>}
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-fg inline-flex items-center gap-2 text-sm font-medium">
              <ShieldCheck size={14} strokeWidth={1.5} aria-hidden="true" />
              {t('bespoke.confidential')}
            </span>
            <span className="text-muted text-xs leading-relaxed">
              {t('bespoke.confidentialHint')}
            </span>
          </span>
        </button>

        <p className="text-muted border-border border-t pt-4 text-xs leading-relaxed">
          {t('jet.salvaReassurance')}
        </p>

        <div className="mt-2 flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting || domains.size === 0 || description.length === 0}
            className={cn(
              'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
              'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
              'duration-base transition-[border-color,background-color,opacity]',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            {submitting ? t('inquiry.sending') : t('bespoke.submit')}
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
