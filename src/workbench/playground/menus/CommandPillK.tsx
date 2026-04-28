import { LanguageSwitcher } from '@components/ui/LanguageSwitcher';
import { useBodyScrollLock } from '@hooks/useBodyScrollLock';
import { cn } from '@utils/cn';
import { Command, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** Command-pill — bottom-docked translucent pill with ⌘K indicator.
 *  i18n-aware nav labels + inline language switcher. Modern product feel
 *  (Arc / Linear). */
export function CommandPillK() {
  const { t } = useTranslation();
  const [paletteOpen, setPaletteOpen] = useState(false);
  useBodyScrollLock(paletteOpen);

  // ⌘K / Ctrl+K opens the fake palette (demo behavior only)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(v => !v);
      }
      if (e.key === 'Escape') setPaletteOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="bg-bg relative min-h-45">
      {/* Fake content hint */}
      <div className="flex min-h-30 items-center justify-center px-6 py-10 md:py-14">
        <span className="text-muted font-mono text-[11px] tracking-[0.2em] uppercase">
          ⌘K anywhere · {t('playground.menu.work')}
        </span>
      </div>

      {/* Docked pill */}
      <div className="sticky bottom-4 flex justify-center px-4 md:bottom-6">
        <nav
          aria-label="Primary"
          className="border-border/60 bg-surface/70 flex items-center gap-1 rounded-full border p-1 shadow-xl backdrop-blur-md"
        >
          <span className="text-accent-text px-3 font-mono text-[11px] tracking-[0.2em] uppercase max-sm:hidden">
            n/w
          </span>
          <span className="bg-border/60 h-5 w-px max-sm:hidden" />

          <ul className="flex items-center">
            {(['work', 'studio', 'journal', 'contact'] as const).map(k => (
              <li key={k}>
                <a
                  href={`#${k}`}
                  className="text-fg hover:bg-bg/50 hover:text-accent-text duration-base inline-block rounded-full px-3 py-1.5 text-xs font-medium tracking-tight transition-colors md:px-4 md:text-sm"
                >
                  {t(`playground.menu.${k}`)}
                </a>
              </li>
            ))}
          </ul>

          <span className="bg-border/60 h-5 w-px" />

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="text-muted hover:text-fg hover:bg-bg/50 duration-base inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs transition-colors md:px-3"
            aria-label="Open command palette"
          >
            <Search size={12} strokeWidth={2} />
            <span className="hidden font-mono text-[10px] tracking-wider md:inline">
              <Command size={10} className="inline" strokeWidth={2} />K
            </span>
          </button>

          <LanguageSwitcher variant="pill" className="ml-1 max-md:hidden" />
        </nav>
      </div>

      {/* Fake palette overlay (demo) */}
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-start justify-center pt-[15vh]',
          'transition-opacity duration-200',
          paletteOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <button
          type="button"
          aria-label="Close palette"
          onClick={() => setPaletteOpen(false)}
          className="bg-bg/80 absolute inset-0 cursor-default backdrop-blur"
        />
        <div className="border-border/60 bg-surface relative w-[min(90vw,520px)] rounded-xl border p-4 shadow-2xl">
          <div className="border-border/50 flex items-center gap-2 border-b pb-3">
            <Search size={14} strokeWidth={2} className="text-muted" />
            <span className="text-muted text-sm">Type a command…</span>
            <span className="text-muted ml-auto font-mono text-[10px] tracking-wider">ESC</span>
          </div>
          <p className="text-muted mt-3 text-xs">Demo palette — press Esc to close.</p>
        </div>
      </div>
    </div>
  );
}
