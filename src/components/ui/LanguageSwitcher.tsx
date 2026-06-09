// ═══════════════════════════════════════════════════
// LanguageSwitcher — popover language picker (FR / EN / ES)
//
// WHAT: A compact trigger button showing the active language code; clicking
//       it opens a small box listing the languages, with the current one
//       marked. Pick one to switch and the box closes. Replaces the old
//       always-visible 3-pill row.
// WHEN: Header, landing chrome — anywhere a visitor picks the UI language.
// CHANGE LOCALES: edit SUPPORTED_LOCALES in src/config/i18n.ts and add the
//       matching autonym to LOCALE_LABELS below.
// CHANGE LOOK: trigger + panel use design tokens (bg-surface, border-border,
//       bg-accent for the active row). Pass tone="inverted" on dark/blend
//       chrome (e.g. the landing top corner) for a white trigger.
// ═══════════════════════════════════════════════════

import { type Locale, SUPPORTED_LOCALES } from '@config/i18n';
import { cn } from '@utils/cn';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** Each language shown in its own name (autonym) — independent of the UI locale. */
const LOCALE_LABELS: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
};

interface LanguageSwitcherProps {
  className?: string;
  currentLocale?: Locale;
  onLocaleChange?: (locale: Locale) => void;
  /** Legacy prop kept for the playground menu demos; the popover look is now
   *  uniform, so this no longer changes the rendering. */
  variant?: 'pill' | 'minimal' | 'stacked';
  /** Which edge of the trigger the panel aligns to. Default: end (right). */
  align?: 'start' | 'end';
  /** `inverted` = transparent/white trigger for dark or mix-blend chrome. */
  tone?: 'default' | 'inverted';
}

/** Popover FR/EN/ES picker. Reads the active locale from i18n, switches on select. */
export const LanguageSwitcher = ({
  className,
  currentLocale,
  onLocaleChange,
  align = 'end',
  tone = 'default',
}: LanguageSwitcherProps) => {
  const { i18n, t } = useTranslation();
  const current =
    currentLocale ?? ((i18n.resolvedLanguage ?? i18n.language ?? 'fr').slice(0, 2) as Locale);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const select = (lng: Locale) => {
    setOpen(false);
    if (lng === current) return;
    if (onLocaleChange) onLocaleChange(lng);
    else void i18n.changeLanguage(lng);
  };

  const inverted = tone === 'inverted';

  return (
    <div ref={rootRef} className={cn('relative inline-flex', className)}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={t('a11y.languageSwitcher')}
        className={cn(
          'duration-base inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors',
          inverted
            ? 'text-current opacity-90 hover:opacity-100'
            : 'border-border/60 bg-surface/60 text-fg hover:bg-fg/5 border',
        )}
      >
        <span>{current}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 10 6"
          className={cn('h-1.5 w-2.5 transition-transform duration-200', open && 'rotate-180')}
        >
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {open && (
        <div
          id={panelId}
          className={cn(
            'popover-reveal border-border/70 bg-surface/95 absolute top-full z-50 mt-2 min-w-34 overflow-hidden rounded-xl border p-1 shadow-lg backdrop-blur',
            align === 'end' ? 'right-0' : 'left-0',
          )}
          // Escape the landing chrome's mix-blend so the panel stays readable.
          style={{ mixBlendMode: 'normal', isolation: 'isolate' }}
        >
          {SUPPORTED_LOCALES.map(lng => {
            const isActive = lng === current;
            return (
              <button
                key={lng}
                type="button"
                aria-pressed={isActive}
                onClick={() => select(lng)}
                className={cn(
                  'duration-base flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                  isActive ? 'bg-accent text-on-accent' : 'text-fg hover:bg-fg/5',
                )}
              >
                <span>{LOCALE_LABELS[lng]}</span>
                <span
                  className={cn(
                    'font-mono text-[10px] tracking-wider uppercase',
                    isActive ? 'text-on-accent/70' : 'text-muted',
                  )}
                >
                  {lng}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
