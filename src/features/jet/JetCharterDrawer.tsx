// ═══════════════════════════════════════════════════
// JetCharterDrawer — structured private-jet booking inquiry
//
// WHAT: From/to + dates + pax form, designed to feel like an aviation
//       desk request — not a flight-search widget. Submit triggers a
//       fake transmission with toast confirmation + the standard
//       "Salva confirme la disponibilité sous 30 minutes" reassurance.
// WHEN: Opened from the dashboard "J'ai besoin d'un jet privé" intent
//       card, or from any concierge prompt. Replaces the generic
//       InquiryDrawer when the request is jet-specific.
// CHROME: <RequestDrawerShell /> canonical.
// REPLACE LATER: lot C wires real Resend + Supabase write.
// ═══════════════════════════════════════════════════

import { ImageUpload } from '@components/ui/ImageUpload';
import { Input } from '@components/ui/Input';
import { RequestDrawerShell } from '@components/ui/RequestDrawerShell';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface JetCharterDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const JetCharterDrawer = ({ open, onClose }: JetCharterDrawerProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [withReturn, setWithReturn] = useState(true);
  const [pax, setPax] = useState('2');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast({ variant: 'success', message: t('jet.success') });
      setFrom('');
      setTo('');
      setDepartDate('');
      setReturnDate('');
      setNotes('');
      setSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <RequestDrawerShell
      open={open}
      onClose={onClose}
      eyebrow={t('account.intent.jet.eyebrow')}
      title={t('jet.drawerTitle')}
      lede={t('jet.drawerLede')}
      widthClass="max-w-xl"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t('jet.from')}
            required
            placeholder={t('jet.fromPlaceholder')}
            value={from}
            onChange={e => setFrom(e.target.value)}
          />
          <Input
            label={t('jet.to')}
            required
            placeholder={t('jet.toPlaceholder')}
            value={to}
            onChange={e => setTo(e.target.value)}
          />
        </div>

        <Input
          label={t('jet.departDate')}
          type="datetime-local"
          required
          value={departDate}
          onChange={e => setDepartDate(e.target.value)}
        />

        <button
          type="button"
          onClick={() => setWithReturn(v => !v)}
          aria-pressed={withReturn}
          className="border-border bg-surface/40 hover:border-fg/40 flex cursor-pointer items-center justify-between rounded-md border px-4 py-3 text-left"
        >
          <span className="flex flex-col gap-1">
            <span className="text-fg text-sm font-medium">{t('jet.withReturn')}</span>
            <span className="text-muted text-xs">{t('jet.withReturnHint')}</span>
          </span>
          <span
            aria-hidden="true"
            className={cn(
              'border-border flex h-5 w-5 items-center justify-center rounded border',
              withReturn ? 'bg-fg' : 'bg-bg',
            )}
          >
            {withReturn && <span className="text-bg text-xs">✓</span>}
          </span>
        </button>

        {withReturn && (
          <Input
            label={t('jet.returnDate')}
            type="datetime-local"
            value={returnDate}
            onChange={e => setReturnDate(e.target.value)}
          />
        )}

        <Input
          label={t('jet.pax')}
          type="number"
          min={1}
          max={20}
          required
          value={pax}
          onChange={e => setPax(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="jet-notes" className="text-fg text-sm font-medium">
            {t('jet.notes')}
          </label>
          <textarea
            id="jet-notes"
            rows={3}
            placeholder={t('jet.notesPlaceholder')}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="bg-surface/80 border-border focus:border-accent focus:ring-accent text-fg placeholder:text-muted/60 rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
          />
        </div>

        <ImageUpload label={t('jet.attachLabel')} hint={t('jet.attachHint')} maxFiles={3} />

        <p className="text-muted border-border mt-2 border-t pt-4 text-xs leading-relaxed">
          {t('jet.focalReassurance')}
        </p>

        <div className="mt-2 flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className={cn(
              'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
              'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
              'duration-base transition-[border-color,background-color,opacity]',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            {submitting ? t('inquiry.sending') : t('jet.submit')}
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
