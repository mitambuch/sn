// ═══════════════════════════════════════════════════
// LanguageSwitcher — compact FR/EN/ES pill group
//
// WHAT: Segmented pill (one per SUPPORTED_LOCALES) with active highlight,
//       switches i18n locale on click
// WHEN: Place in header/menu to let visitors pick language
// CHANGE LOCALES: edit SUPPORTED_LOCALES in src/config/i18n.ts
// CHANGE STYLE: the active segment uses bg-accent + text-on-accent
// ═══════════════════════════════════════════════════

import { type Locale, SUPPORTED_LOCALES } from '@config/i18n';
import { cn } from '@utils/cn';
import { useTranslation } from 'react-i18next';

type Variant = 'pill' | 'minimal' | 'stacked';

interface LanguageSwitcherProps {
  variant?: Variant;
  className?: string;
  currentLocale?: Locale;
  onLocaleChange?: (locale: Locale) => void;
}

/** FR/EN/ES segmented control. Reads current locale from i18n, switches on click. */
export const LanguageSwitcher = ({
  variant = 'pill',
  className,
  currentLocale,
  onLocaleChange,
}: LanguageSwitcherProps) => {
  const { i18n, t } = useTranslation();
  const current =
    currentLocale ?? ((i18n.resolvedLanguage ?? i18n.language ?? 'fr').slice(0, 2) as Locale);

  const base =
    variant === 'pill'
      ? 'border-border/60 bg-surface/60 inline-flex items-center rounded-full border p-0.5'
      : variant === 'stacked'
        ? 'inline-flex flex-col items-end gap-0.5'
        : 'inline-flex items-center gap-2';

  const itemBase =
    variant === 'pill'
      ? 'rounded-full px-2 py-1 text-[11px] font-semibold tracking-wide uppercase sm:px-2.5'
      : variant === 'stacked'
        ? 'text-[11px] font-mono tracking-[0.2em] uppercase'
        : 'text-[11px] font-mono tracking-[0.2em] uppercase';

  return (
    <div role="group" aria-label={t('a11y.languageSwitcher')} className={cn(base, className)}>
      {SUPPORTED_LOCALES.map(lng => {
        const isActive = current === lng;
        return (
          <button
            key={lng}
            type="button"
            onClick={() => {
              if (lng === current) return;
              if (onLocaleChange) {
                onLocaleChange(lng);
                return;
              }
              void i18n.changeLanguage(lng);
            }}
            aria-pressed={isActive}
            aria-label={`${t('a11y.languageSwitcher')} — ${lng.toUpperCase()}`}
            className={cn(
              itemBase,
              'duration-base transition-colors',
              variant === 'pill'
                ? isActive
                  ? 'bg-accent text-on-accent'
                  : 'text-muted hover:text-fg'
                : isActive
                  ? 'text-accent-text'
                  : 'text-muted hover:text-fg',
            )}
          >
            {lng}
          </button>
        );
      })}
    </div>
  );
};
