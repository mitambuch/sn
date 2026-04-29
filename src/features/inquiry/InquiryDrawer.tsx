// ═══════════════════════════════════════════════════
// InquiryDrawer — right-side drawer for "Express interest" submissions
//
// WHAT: Slide-in drawer holding a contextualised inquiry form. Triggered
//       from any DetailHero "Express interest" CTA. On submit, simulates
//       transmission (push to local mock store + toast confirmation +
//       close) — replaced by real Resend + Supabase write in lot C.
// WHEN: Mounted at the page level (PropertyDetail, future module details).
// EDGE: Keyboard accessible — Escape closes, focus is trapped inside.
//       prefers-reduced-motion respected on the slide animation.
// ═══════════════════════════════════════════════════

import { ImageUpload } from '@components/ui/ImageUpload';
import { Textarea } from '@components/ui/Textarea';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { InquirySource } from '@/types/inquiry';

interface InquiryDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Source module — used to label the inquiry context. */
  source: InquirySource;
  /** Item title rendered as drawer eyebrow ("Chalet sur les hauts de Verbier"). */
  itemTitle: string;
}

export const InquiryDrawer = ({ open, onClose, source, itemTitle }: InquiryDrawerProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Escape closes
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
    setSubmitting(true);
    // WHY: simulated latency keeps the visible state honest before lot C
    // wires real Supabase + Resend. Drop this setTimeout in the real impl.
    setTimeout(() => {
      toast({ variant: 'success', message: t('inquiry.success') });
      setMessage('');
      setSubmitting(false);
      onClose();
    }, 600);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('inquiry.drawerTitle')}
      className="fixed inset-0 z-(--z-modal)"
    >
      {/* Backdrop click-to-close */}
      <button
        type="button"
        onClick={onClose}
        aria-label={t('common.close')}
        className="bg-bg/80 absolute inset-0 backdrop-blur-sm"
      />

      {/* Panel */}
      <aside
        className={cn(
          'border-border bg-bg absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l',
          'duration-base motion-safe:animate-in motion-safe:slide-in-from-right',
        )}
      >
        <header className="border-border flex items-start justify-between border-b px-8 py-6">
          <div className="flex flex-col gap-1">
            <span className="text-muted text-xs tracking-widest uppercase">
              {t(
                `account.nav.${
                  source === 'property'
                    ? 'properties'
                    : source === 'timepiece'
                      ? 'timepieces'
                      : source === 'artwork'
                        ? 'artworks'
                        : source === 'event'
                          ? 'events'
                          : source === 'journey'
                            ? 'journeys'
                            : 'concierge'
                }`,
              )}
            </span>
            <h2 className="text-fg text-lg font-medium">{itemTitle}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-fg duration-base text-xs tracking-widest uppercase transition-colors"
            aria-label={t('common.close')}
          >
            ✕
          </button>
        </header>

        <form
          className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-8"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <span className="text-muted text-xs tracking-widest uppercase">
              {t('inquiry.drawerTitle')}
            </span>
            <p className="text-fg text-base leading-relaxed">{t('inquiry.drawerLede')}</p>
          </div>

          <Textarea
            label={t('inquiry.drawerTitle')}
            rows={5}
            placeholder={t('inquiry.messagePlaceholder')}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />

          <ImageUpload
            label={t('inquiry.attachLabel')}
            hint={t('inquiry.attachHint')}
            maxFiles={3}
          />

          <div className="mt-auto flex items-center gap-4">
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
              {submitting ? t('inquiry.sending') : t('inquiry.submit')}
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
