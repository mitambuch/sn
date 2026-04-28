import { LanguageSwitcher } from '@components/ui/LanguageSwitcher';
import { cn } from '@utils/cn';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LINKS = ['work', 'studio', 'journal', 'contact'] as const;

/** Ticker top — promo/news strip that auto-scrolls above the main nav.
 *  Marquee gives a "publication" feel; main nav stays conventional below. */
export function TickerTop() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const tickerItems = [
    '◆ New case study — HDVA digital table',
    '◆ Workshop incoming — 12 May, Lausanne',
    '◆ We are hiring — senior designer',
    '◆ Writing — building slowly, on purpose',
  ];

  return (
    <header className="bg-bg">
      {/* Ticker row */}
      <div className="bg-fg text-bg border-border/20 flex items-center gap-3 overflow-hidden border-b py-2">
        <span className="text-bg/70 flex-none px-4 font-mono text-[10px] tracking-[0.3em] uppercase max-md:hidden">
          live
        </span>
        <div
          className="flex min-w-0 flex-1 overflow-hidden"
          role="region"
          aria-label="News ticker"
          aria-live="off"
        >
          <div className="flex animate-[marquee_28s_linear_infinite] items-center gap-10 whitespace-nowrap">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="text-xs font-medium tracking-tight">
                {item}
              </span>
            ))}
          </div>
        </div>
        <span className="flex-none px-4 max-md:hidden">
          <LanguageSwitcher variant="minimal" />
        </span>
      </div>

      {/* Main nav row */}
      <div className="border-border/60 border-b">
        <div className="mx-auto flex max-w-400 items-center justify-between px-4 py-4 md:px-8 md:py-5">
          <a href="#home" className="text-fg text-lg font-semibold tracking-tight md:text-xl">
            Périphérique
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {LINKS.map(link => (
                <li key={link}>
                  <a
                    href={`#${link}`}
                    className="text-fg hover:text-accent-text duration-base text-sm font-medium tracking-tight transition-colors"
                  >
                    {t(`playground.menu.${link}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(v => !v)}
            className="text-fg -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
          >
            {mobileOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          'border-border bg-bg absolute inset-x-0 z-40 border-b md:hidden',
          'duration-base transition-[opacity,transform]',
          mobileOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
        )}
      >
        <ul className="px-6 py-4">
          {LINKS.map(link => (
            <li key={link} className="border-border/40 border-b last:border-b-0">
              <a
                href={`#${link}`}
                onClick={() => setMobileOpen(false)}
                className="text-fg block py-3 text-lg font-medium tracking-tight"
              >
                {t(`playground.menu.${link}`)}
              </a>
            </li>
          ))}
          <li className="pt-4">
            <LanguageSwitcher variant="pill" />
          </li>
        </ul>
      </div>
    </header>
  );
}
