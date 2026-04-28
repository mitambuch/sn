import { useBodyScrollLock } from '@hooks/useBodyScrollLock';
import { cn } from '@utils/cn';
import { ArrowUpRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const PRIMARY = ['work', 'studio', 'journal', 'contact'] as const;
const SECONDARY = ['instagram', 'are.na', 'mail', 'podcast'] as const;

/** Fullscreen burger — minimal top bar (logo + "Menu" text), click reveals
 *  fullscreen overlay with oversized typography. Same UX on desktop + mobile
 *  (intentional — no hover behavior). */
export function FullscreenBurger() {
  const [open, setOpen] = useState(false);
  useBodyScrollLock(open);

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className="bg-bg relative z-30">
        <div className="mx-auto flex max-w-400 items-center justify-between px-4 py-5 md:px-8 md:py-6">
          <a href="#home" className="text-fg text-lg font-medium tracking-tight md:text-xl">
            Studio Plume
          </a>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="text-fg hover:text-accent-text duration-base group inline-flex items-center gap-2 text-sm font-semibold tracking-[0.2em] uppercase transition-colors md:text-[13px]"
          >
            <span className="duration-base inline-block transition-transform group-hover:translate-x-0.5">
              Menu
            </span>
            <span className="bg-fg group-hover:bg-accent-text duration-base h-px w-8 transition-colors md:w-10" />
          </button>
        </div>
      </header>

      {/* Fullscreen overlay */}
      <div
        className={cn(
          'bg-bg fixed inset-0 z-50 flex flex-col',
          'transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between px-4 py-5 md:px-8 md:py-6">
          <span className="text-fg text-lg font-medium tracking-tight md:text-xl">
            Studio Plume
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="text-fg hover:text-accent-text duration-base inline-flex items-center gap-2 text-sm font-semibold tracking-[0.2em] uppercase transition-colors"
          >
            Close
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <nav
          aria-label="Primary fullscreen"
          className="flex-1 overflow-y-auto px-4 py-10 md:px-8 md:py-20"
        >
          <ul className="mx-auto max-w-400 space-y-1 md:space-y-3">
            {PRIMARY.map((link, i) => (
              <li key={link}>
                <a
                  href={`#${link}`}
                  onClick={() => setOpen(false)}
                  className="text-fg hover:text-accent-text duration-base group flex items-baseline gap-4 text-5xl font-bold tracking-tighter transition-colors md:text-8xl lg:text-9xl"
                >
                  <span className="text-muted font-mono text-xs tracking-[0.2em] md:text-sm">
                    0{i + 1}
                  </span>
                  <span className="group-hover:italic">{link}</span>
                  <ArrowUpRight
                    size={32}
                    strokeWidth={1.5}
                    className="text-muted group-hover:text-accent-text -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 max-md:hidden"
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-16 flex max-w-400 flex-wrap items-baseline gap-x-8 gap-y-2 md:mt-24">
            <span className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase">
              Elsewhere
            </span>
            {SECONDARY.map(link => (
              <a
                key={link}
                href={`#${link}`}
                onClick={() => setOpen(false)}
                className="text-fg hover:text-accent-text duration-base text-sm tracking-tight transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
