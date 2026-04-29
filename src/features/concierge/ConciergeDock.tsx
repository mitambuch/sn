// ═══════════════════════════════════════════════════
// ConciergeDock — always-on Salva contact dock (bottom-right)
//
// WHAT: Fixed floating button bottom-right of authenticated surfaces.
//       Click expands to a discreet popover with avatar, name,
//       availability hint, "Appeler" (tel:), and "Écrire" (opens
//       FreeFormInquiryDrawer). Esc + click-outside closes the popover.
// WHEN: Mounted once in AppLayout — visible on every /:locale/account/*
//       page so a member is never more than one click from Salva.
// EDGE: Mobile collapses to a single icon button at the bottom; popover
//       stretches to the screen width with safe-area inset.
// ═══════════════════════════════════════════════════

import { FreeFormInquiryDrawer } from '@features/inquiry/FreeFormInquiryDrawer';
import { cn } from '@utils/cn';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { currentUser } from '@/mocks/users';

const Initials = ({ name }: { name: string }) => {
  const parts = name.split(' ');
  const initials = (parts[0]?.[0] ?? '') + (parts.at(-1)?.[0] ?? '');
  return (
    <span
      aria-hidden="true"
      className="border-border bg-bg text-fg flex h-9 w-9 items-center justify-center rounded-full border text-xs tracking-widest uppercase"
    >
      {initials}
    </span>
  );
};

export const ConciergeDock = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [writeOpen, setWriteOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  // Close popover on click-outside + Escape
  useEffect(() => {
    if (!expanded) return;
    const onPointerDown = (e: PointerEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [expanded]);

  return (
    <>
      <div
        ref={dockRef}
        className="fixed right-4 bottom-4 z-(--z-overlay) flex flex-col items-end gap-3 md:right-8 md:bottom-8"
      >
        {expanded && (
          <div
            role="dialog"
            aria-label={t('dock.title')}
            className={cn(
              'border-border bg-bg flex w-72 flex-col gap-4 rounded-lg border p-5 shadow-2xl',
              'motion-safe:animate-in motion-safe:slide-in-from-bottom-2 motion-safe:fade-in',
            )}
          >
            <div className="flex items-center gap-3">
              <Initials name={currentUser.conciergeName} />
              <div className="flex flex-col">
                <span className="text-muted text-xs tracking-widest uppercase">
                  {t('dock.eyebrow')}
                </span>
                <span className="text-fg text-sm font-medium">{currentUser.conciergeName}</span>
                <span className="text-muted text-xs">{t('dock.availability')}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href="tel:+41215550000"
                className={cn(
                  'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
                  'inline-flex items-center justify-between rounded-full border px-5 py-2.5 text-xs tracking-widest uppercase',
                  'duration-base transition-[border-color,background-color]',
                  'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                )}
                onClick={() => setExpanded(false)}
              >
                {t('dock.call')}
                <span aria-hidden="true">↗</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setExpanded(false);
                  setWriteOpen(true);
                }}
                className={cn(
                  'border-border text-fg hover:border-fg/60 focus-visible:ring-accent',
                  'inline-flex items-center justify-between rounded-full border px-5 py-2.5 text-xs tracking-widest uppercase',
                  'duration-base transition-[border-color]',
                  'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                )}
              >
                {t('dock.write')}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          aria-label={t('dock.title')}
          aria-expanded={expanded}
          onClick={() => setExpanded(v => !v)}
          className={cn(
            'border-fg bg-fg text-bg focus-visible:ring-accent',
            'flex h-14 items-center gap-3 rounded-full border pr-5 pl-2 shadow-2xl',
            'duration-base transition-[transform,box-shadow]',
            'hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--color-fg)_25%,transparent)]',
            'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.97]',
          )}
        >
          <Initials name={currentUser.conciergeName} />
          <span className="hidden text-xs tracking-widest uppercase md:inline">
            {expanded ? t('common.close') : t('dock.cta')}
          </span>
        </button>
      </div>

      <FreeFormInquiryDrawer
        open={writeOpen}
        onClose={() => setWriteOpen(false)}
        source="concierge"
        intentTitle={t('dock.write')}
        intentLede={t('dock.writeLede')}
        placeholder={t('inquiry.messagePlaceholder')}
      />
    </>
  );
};
