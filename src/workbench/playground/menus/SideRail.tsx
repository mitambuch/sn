import { LanguageSwitcher } from '@components/ui/LanguageSwitcher';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import { cn } from '@utils/cn';
import { Briefcase, FileText, Home, Mail, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ITEMS = [
  { key: 'home' as const, icon: Home },
  { key: 'work' as const, icon: Briefcase },
  { key: 'studio' as const, icon: Sparkles },
  { key: 'journal' as const, icon: FileText },
  { key: 'contact' as const, icon: Mail },
];

/** Vertical rail — thin by default, expands on hover/focus. Icons + labels.
 *  Theme + language switchers stacked at the bottom. Dashboard/product feel. */
export function SideRail() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-bg relative flex min-h-90">
      <nav
        aria-label="Primary"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onFocusCapture={() => setExpanded(true)}
        onBlurCapture={e => {
          if (!e.currentTarget.contains(e.relatedTarget)) setExpanded(false);
        }}
        className={cn(
          'border-border/60 bg-surface/40 flex flex-col border-r transition-[width] duration-300',
          expanded ? 'w-55' : 'w-16',
        )}
      >
        {/* Logo mark */}
        <div className="border-border/50 flex h-16 items-center border-b px-4">
          <span className="bg-accent text-on-accent flex h-8 w-8 flex-none items-center justify-center text-base font-black">
            R
          </span>
          <span
            className={cn(
              'text-fg ml-3 text-sm font-semibold tracking-tight transition-opacity',
              expanded ? 'opacity-100 delay-75' : 'pointer-events-none w-0 opacity-0',
            )}
          >
            rail/works
          </span>
        </div>

        {/* Links */}
        <ul className="flex-1 space-y-1 p-2">
          {ITEMS.map(({ key, icon: Icon }) => (
            <li key={key}>
              <a
                href={`#${key}`}
                className="text-muted hover:text-fg hover:bg-bg/50 duration-base flex h-11 items-center gap-3 rounded-md px-3 transition-colors"
              >
                <Icon size={18} strokeWidth={1.75} className="flex-none" />
                <span
                  className={cn(
                    'text-sm font-medium tracking-tight transition-opacity',
                    expanded ? 'opacity-100 delay-75' : 'pointer-events-none w-0 opacity-0',
                  )}
                >
                  {key === 'home' ? t('nav.home') : t(`playground.menu.${key}`)}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Footer: theme + language */}
        <div className="border-border/50 flex flex-col items-center gap-3 border-t p-3">
          <ThemeToggle />
          <LanguageSwitcher
            variant={expanded ? 'pill' : 'stacked'}
            className={cn('transition-all', expanded ? 'w-auto' : 'w-auto')}
          />
        </div>
      </nav>

      {/* Placeholder content area for context */}
      <div className="flex flex-1 items-center justify-center p-6">
        <span className="text-muted font-mono text-[11px] tracking-[0.2em] uppercase">
          hover the rail →
        </span>
      </div>
    </div>
  );
}
