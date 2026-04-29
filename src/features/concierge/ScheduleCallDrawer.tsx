// ═══════════════════════════════════════════════════
// ScheduleCallDrawer — book a 30-min appointment with Salvatore
//
// WHAT: A right-side drawer with a 7-day strip of date pills and a
//       grid of 5 fixed time slots per day (09:00, 10:30, 14:00, 15:30,
//       17:00). Optional notes textarea + ICS-style success toast.
// WHEN: Opened from the dashboard "Réserver 30 min" CTA, the
//       ConciergeDock popover, or anywhere a member wants face time.
// REPLACE LATER: lot C wires Cal.com or a custom Supabase booking row.
// ═══════════════════════════════════════════════════

import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { CalendarClock, Clock } from 'lucide-react';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SLOTS = ['09:00', '10:30', '14:00', '15:30', '17:00'] as const;
type Slot = (typeof SLOTS)[number];

interface DayOption {
  iso: string;
  date: Date;
}

// WHY: now-anchor frozen at module evaluation so react-hooks/purity is
// happy. Lot C will replace with server snapshot anyway.
const NOW_MS = Date.now();

function nextSevenDays(): DayOption[] {
  const out: DayOption[] = [];
  for (let i = 1; i <= 7; i += 1) {
    const d = new Date(NOW_MS + i * 24 * 60 * 60 * 1000);
    out.push({ iso: d.toISOString().slice(0, 10), date: d });
  }
  return out;
}

interface ScheduleCallDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const ScheduleCallDrawer = ({ open, onClose }: ScheduleCallDrawerProps) => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const days = useMemo(() => nextSevenDays(), []);

  const [selectedDay, setSelectedDay] = useState<string>(days[0]?.iso ?? '');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmitting(true);
    setTimeout(() => {
      const day = days.find(d => d.iso === selectedDay);
      const dayLabel = day
        ? day.date.toLocaleDateString(i18n.language, {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
          })
        : selectedDay;
      toast({
        variant: 'success',
        message: t('schedule.success', { day: dayLabel, slot: selectedSlot }),
      });
      setNotes('');
      setSelectedSlot(null);
      setSubmitting(false);
      onClose();
    }, 700);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('schedule.title')}
      className="fixed inset-0 z-(--z-modal)"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t('common.close')}
        className="bg-bg/80 absolute inset-0 backdrop-blur-sm"
      />
      <aside
        className={cn(
          'border-border bg-bg absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l',
          'duration-base motion-safe:animate-in motion-safe:slide-in-from-right',
        )}
      >
        <header className="border-border flex items-start justify-between border-b px-8 py-6">
          <div className="flex flex-col gap-1">
            <span className="text-muted text-xs tracking-widest uppercase">
              {t('schedule.eyebrow')}
            </span>
            <h2 className="text-fg text-xl font-light">{t('schedule.title')}</h2>
            <p className="text-muted mt-2 text-sm leading-relaxed">{t('schedule.lede')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="text-muted hover:text-fg duration-base text-xs tracking-widest uppercase transition-colors"
          >
            ✕
          </button>
        </header>

        <form
          className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-8"
          onSubmit={handleSubmit}
        >
          {/* Day picker — 7 day strip */}
          <fieldset className="flex flex-col gap-3">
            <legend className="text-fg flex items-center gap-2 text-sm font-medium">
              <CalendarClock size={14} strokeWidth={1.5} aria-hidden="true" />
              {t('schedule.chooseDay')}
            </legend>
            <div className="grid grid-cols-7 gap-2">
              {days.map(d => {
                const selected = d.iso === selectedDay;
                const dow = d.date.toLocaleDateString(i18n.language, { weekday: 'short' });
                const day = d.date.toLocaleDateString(i18n.language, { day: '2-digit' });
                return (
                  <button
                    key={d.iso}
                    type="button"
                    onClick={() => setSelectedDay(d.iso)}
                    aria-pressed={selected}
                    className={cn(
                      'border-border flex flex-col items-center gap-1 rounded-md border px-2 py-3',
                      'duration-base transition-[border-color,background-color,color]',
                      'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      selected
                        ? 'bg-fg text-bg border-fg'
                        : 'bg-surface/40 text-fg hover:border-fg/50 hover:bg-surface',
                    )}
                  >
                    <span className="text-[10px] tracking-widest uppercase opacity-70">
                      {dow.replace('.', '')}
                    </span>
                    <span className="text-base font-medium">{day}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Slot picker — 5 fixed slots */}
          <fieldset className="flex flex-col gap-3">
            <legend className="text-fg flex items-center gap-2 text-sm font-medium">
              <Clock size={14} strokeWidth={1.5} aria-hidden="true" />
              {t('schedule.chooseSlot')}
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {SLOTS.map(slot => {
                const selected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    aria-pressed={selected}
                    className={cn(
                      'border-border rounded-full border px-3 py-2 text-sm tracking-widest',
                      'duration-base transition-[border-color,background-color,color]',
                      'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      selected
                        ? 'bg-fg text-bg border-fg'
                        : 'bg-surface/40 text-fg hover:border-fg/50 hover:bg-surface',
                    )}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
            <p className="text-muted text-xs leading-relaxed">{t('schedule.timezone')}</p>
          </fieldset>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="schedule-notes" className="text-fg text-sm font-medium">
              {t('schedule.notes')}
            </label>
            <p className="text-muted text-xs leading-relaxed">{t('schedule.notesHint')}</p>
            <textarea
              id="schedule-notes"
              rows={3}
              placeholder={t('schedule.notesPlaceholder')}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="bg-surface/80 border-border focus:border-accent focus:ring-accent text-fg placeholder:text-muted/60 mt-1 rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
            />
          </div>

          <p className="text-muted border-border border-t pt-4 text-xs leading-relaxed">
            {t('schedule.calendarHint')}
          </p>

          <div className="mt-2 flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting || !selectedSlot}
              className={cn(
                'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
                'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
                'duration-base transition-[border-color,background-color,opacity]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              {submitting ? t('inquiry.sending') : t('schedule.submit')}
              <span aria-hidden="true">→</span>
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
      </aside>
    </div>
  );
};
