// ═══════════════════════════════════════════════════
// InquiryDrawer — right-side drawer for "Express interest" submissions
//
// WHAT: Slide-in drawer holding a contextualised inquiry form. Triggered
//       from any DetailHero "Express interest" CTA. On submit, inserts
//       a row into Supabase `inquiries` when wired + user signed in.
//       A Postgres trigger then fires the Resend email to Salvatore.
//       Demo mode preserved: simulates submission + toast if no backend.
// WHEN: Mounted at the page level (PropertyDetail, future module details).
// CHROME: <RequestDrawerShell /> canonical.
// ═══════════════════════════════════════════════════

import { ImageUpload } from '@components/ui/ImageUpload';
import { RequestDrawerShell } from '@components/ui/RequestDrawerShell';
import { Textarea } from '@components/ui/Textarea';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { hasSupabase, supabase } from '@/lib/supabase';
import type { InquirySource } from '@/types/inquiry';

interface InquiryDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Source module — used to label the inquiry context. */
  source: InquirySource;
  /** Item title rendered as drawer eyebrow ("Chalet sur les hauts de Verbier"). */
  itemTitle: string;
  /** Item id (slug or uuid) — persisted as inquiry.target_id for back-office reference. */
  targetId?: string;
}

const SOURCE_NAV_KEY: Record<InquirySource, string> = {
  property: 'account.nav.properties',
  timepiece: 'account.nav.timepieces',
  artwork: 'account.nav.artworks',
  event: 'account.nav.events',
  journey: 'account.nav.journeys',
  concierge: 'account.nav.concierge',
  jet: 'account.nav.concierge',
  'object-search': 'account.nav.concierge',
  'event-organize': 'account.nav.concierge',
};

export const InquiryDrawer = ({
  open,
  onClose,
  source,
  itemTitle,
  targetId,
}: InquiryDrawerProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { session } = useAuth();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const userId = session?.user?.id;
    const canPersist =
      hasSupabase && supabase !== null && typeof userId === 'string' && !userId.startsWith('dev-');

    if (canPersist && supabase) {
      const insertPayload: {
        user_id: string;
        source: InquirySource;
        message: string | null;
        target_id?: string;
      } = {
        user_id: userId as string,
        source,
        message: message.trim() || null,
      };
      if (targetId) insertPayload.target_id = targetId;

      const { error } = await supabase.from('inquiries').insert(insertPayload);
      setSubmitting(false);
      if (error) {
        toast({ variant: 'error', message: error.message });
        return;
      }
      toast({ variant: 'success', message: t('inquiry.success') });
      setMessage('');
      onClose();
      return;
    }

    window.setTimeout(() => {
      toast({ variant: 'success', message: t('inquiry.success') });
      setMessage('');
      setSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <RequestDrawerShell
      open={open}
      onClose={onClose}
      eyebrow={t(SOURCE_NAV_KEY[source])}
      title={itemTitle}
      lede={t('inquiry.drawerLede')}
      widthClass="max-w-lg"
    >
      <form
        className="flex flex-col gap-6"
        onSubmit={e => {
          void handleSubmit(e);
        }}
      >
        <Textarea
          label={t('inquiry.drawerTitle')}
          rows={5}
          placeholder={t('inquiry.messagePlaceholder')}
          value={message}
          onChange={e => setMessage(e.target.value)}
        />

        <ImageUpload label={t('inquiry.attachLabel')} hint={t('inquiry.attachHint')} maxFiles={3} />

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
