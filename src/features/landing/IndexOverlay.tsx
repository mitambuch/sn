// ═══════════════════════════════════════════════════
// IndexOverlay — full-screen landing nav
//
// WHAT: A full-bleed dark overlay that slides down from the top to reveal
//       a numbered list of landing sections. Click an entry → smooth-scroll
//       to that section (Lenis app-level handles the easing).
// WHEN: Triggered by the INDEX button in the top-right corner of the
//       landing. Closed via the Fermer ✕ button or the Escape key.
// CHANGE NAV ENTRIES: edit `sections` array passed by the parent
//       (props-driven so it stays language-aware and decoupled).
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
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
        'bg-fg text-bg fixed inset-0 z-[300] flex flex-col px-5 py-8 transition-transform duration-500 md:px-12',
        '[transition-timing-function:cubic-bezier(0.7,0,0.3,1)]',
        open ? 'translate-y-0' : 'pointer-events-none -translate-y-full',
      )}
    >
      <div className="text-bg/80 flex items-center justify-between font-mono text-[11px] tracking-[0.1em] uppercase">
        <span>{title}</span>
        <button
          type="button"
          onClick={onClose}
          className="border-bg text-bg hover:bg-bg hover:text-fg border px-3.5 py-2 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors"
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
            <span className="font-mono text-[clamp(1.75rem,5vw,4rem)] leading-none font-medium tracking-[-0.025em] uppercase">
              {entry.name}
            </span>
            <span className="text-bg/50 hidden font-mono text-[10px] tracking-[0.12em] uppercase md:block">
              {entry.label}
            </span>
            <span aria-hidden="true" className="text-bg/70 font-mono text-lg">
              ↗
            </span>
          </a>
        ))}
      </nav>

      <div className="border-bg/20 text-bg/55 mt-12 grid grid-cols-3 gap-4 border-t pt-8 font-mono text-[10px] tracking-[0.12em] uppercase">
        <span>↘ {location}</span>
        <span className="text-center">{count}</span>
        <span className="text-right">{edition}</span>
      </div>
    </div>
  );
};
