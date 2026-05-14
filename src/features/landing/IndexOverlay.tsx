// ═══════════════════════════════════════════════════
// IndexOverlay — full-screen landing nav
//
// WHAT: A full-bleed dark overlay that slides down from the top to reveal
//       a numbered list of landing sections + two persistent access CTAs
//       (Request access + Private area). Click an entry / CTA →
//       smooth-scroll or navigate (Lenis app-level handles the easing).
// WHEN: Triggered by the INDEX button in the top-right corner of the
//       landing. Closed via the Fermer ✕ button or the Escape key.
// CHANGE NAV ENTRIES: edit `sections` array passed by the parent
//       (props-driven so it stays language-aware and decoupled).
// ═══════════════════════════════════════════════════

import { BrandMark } from '@components/brand/BrandMark';
import { cn } from '@utils/cn';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

export interface IndexEntry {
  /** Section anchor target (e.g. "#s03"). */
  href: string;
  /** Two-digit slug (e.g. "03"). */
  num: string;
  /** Section name (e.g. "Présentation"). */
  name: string;
  /** Short eyebrow on the right (e.g. "Structure"). */
  label: string;
}

interface IndexOverlayProps {
  open: boolean;
  onClose: () => void;
  sections: readonly IndexEntry[];
  /** Footer location string (e.g. "Boudry, Suisse"). */
  location: string;
  /** Footer count string (e.g. "09 sections"). */
  count: string;
  /** Footer edition string (e.g. "Édition Mai 2026"). */
  edition: string;
  /** Accessible label for the close button. */
  closeLabel: string;
  /** Accessible / visible title in the overlay header. */
  title: string;
  /** Primary CTA label (e.g. "Demander un accès"). */
  primaryCtaLabel: string;
  /** Primary CTA — button or anchor node. The overlay closes itself on
   *  click via the wrapping `onClickCapture` so the node only owns the
   *  visual + action concern. */
  primaryCtaNode: ReactNode;
  /** Secondary CTA label (e.g. "Espace privé"). */
  secondaryCtaLabel: string;
  /** Secondary CTA — react-router Link target (rendered as <a>). */
  secondaryCtaNode: ReactNode;
}

/** Full-screen landing index — slides down on open, Escape to close. */
export const IndexOverlay = ({
  open,
  onClose,
  sections,
  location,
  count,
  edition,
  closeLabel,
  title,
  primaryCtaLabel,
  primaryCtaNode,
  secondaryCtaLabel,
  secondaryCtaNode,
}: IndexOverlayProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      aria-hidden={!open}
      className={cn(
        'bg-ink text-on-ink fixed inset-0 z-[300] flex flex-col overflow-y-auto px-5 py-6 transition-transform duration-500 md:px-12 md:py-8',
        '[transition-timing-function:cubic-bezier(0.7,0,0.3,1)]',
        open ? 'translate-y-0' : 'pointer-events-none -translate-y-full',
      )}
    >
      {/* ─── Header : monumental BrandMark + close ─── */}
      <div className="flex items-center justify-between gap-4 pb-6">
        <a href="#s01" onClick={onClose} aria-label={title} className="block">
          <BrandMark className="text-bg text-2xl tracking-tight md:text-4xl" />
        </a>
        <button
          type="button"
          onClick={onClose}
          className="border-bg text-bg hover:bg-bg hover:text-fg rounded-full border px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors"
        >
          {closeLabel}&nbsp;✕
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-center" aria-label={title}>
        {sections.map(entry => (
          <a
            key={entry.href}
            href={entry.href}
            onClick={onClose}
            className="border-bg/15 grid grid-cols-[40px_1fr_auto] items-center gap-4 border-b py-4 transition-[padding] duration-300 ease-out hover:pl-6 md:grid-cols-[60px_1fr_auto_auto] md:gap-8"
          >
            <span className="text-bg/50 font-mono text-[11px] tracking-wider">{entry.num}</span>
            <span className="font-mono text-[clamp(1.75rem,5vw,4rem)] leading-none font-medium tracking-tight uppercase">
              {entry.name}
            </span>
            <span className="text-bg/50 hidden font-mono text-[10px] tracking-widest uppercase md:block">
              {entry.label}
            </span>
            <span aria-hidden="true" className="text-bg/70 font-mono text-lg">
              ↗
            </span>
          </a>
        ))}
      </nav>

      {/* ─── CTAs : 2 boutons d'accès toujours visibles ─── */}
      <div className="border-bg/20 grid grid-cols-1 gap-3 border-t pt-6 md:grid-cols-2 md:gap-4">
        <span className="contents">{primaryCtaNode}</span>
        <span className="sr-only">{primaryCtaLabel}</span>
        <span className="contents">{secondaryCtaNode}</span>
        <span className="sr-only">{secondaryCtaLabel}</span>
      </div>

      <div className="border-bg/20 text-bg/55 mt-6 grid grid-cols-1 gap-2 border-t pt-4 font-mono text-[10px] tracking-widest uppercase md:grid-cols-3 md:gap-4">
        <span>↘ {location}</span>
        <span className="md:text-center">{count}</span>
        <span className="md:text-right">{edition}</span>
      </div>
    </div>
  );
};
