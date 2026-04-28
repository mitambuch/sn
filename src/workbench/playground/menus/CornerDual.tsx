import { ThemeToggle } from '@components/ui/ThemeToggle';
import { useBodyScrollLock } from '@hooks/useBodyScrollLock';
import { cn } from '@utils/cn';
import { ArrowUpRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const LINKS = ['work', 'studio', 'journal', 'contact'] as const;

/** Corner-dual — zero chrome. Logo floats absolute top-left, a text "Menu"
 *  button floats top-right. Content implicitly fills the viewport.
 *  Portfolio / gallery feel. Theme toggle hidden inside the overlay. */
export function CornerDual() {
  const [open, setOpen] = useState(false);
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="bg-bg relative min-h-80 overflow-hidden">
      {/* Implicit content hint */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-muted max-w-sm text-center font-mono text-[11px] leading-relaxed tracking-[0.15em] uppercase">
          content fills the viewport
          <br />·<br />
          chrome reduced to two corners
        </span>
      </div>

      {/* Top-left: wordmark */}
      <a
        href="#home"
        className="text-fg absolute top-5 left-5 z-10 text-lg font-medium tracking-tight md:top-7 md:left-8 md:text-xl"
      >
        Plume(s)
      </a>

      {/* Top-right: Menu button */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="text-fg hover:text-accent-text duration-base group absolute top-5 right-5 z-10 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.2em] uppercase transition-colors md:top-7 md:right-8 md:text-[13px]"
      >
        <span className="bg-fg group-hover:bg-accent-text duration-base h-px w-8 transition-colors md:w-10" />
        Menu
      </button>

      {/* Overlay */}
      <div
        className={cn(
          'bg-bg absolute inset-0 z-50 flex flex-col',
          'transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between px-5 py-5 md:px-8 md:py-7">
          <span className="text-fg text-lg font-medium tracking-tight md:text-xl">Plume(s)</span>
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

        <nav aria-label="Primary corner" className="flex-1 px-5 py-6 md:px-8 md:py-10">
          <ul className="space-y-2 md:space-y-4">
            {LINKS.map((link, i) => (
              <li key={link} className="border-border/40 border-b">
                <a
                  href={`#${link}`}
                  onClick={() => setOpen(false)}
                  className="text-fg hover:text-accent-text duration-base group flex items-baseline justify-between gap-4 py-4 text-3xl font-bold tracking-tight transition-colors md:py-6 md:text-6xl"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="text-muted font-mono text-xs tracking-[0.2em] md:text-sm">
                      0{i + 1}
                    </span>
                    <span>{link}</span>
                  </span>
                  <ArrowUpRight
                    size={24}
                    strokeWidth={1.5}
                    className="text-muted group-hover:text-accent-text -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 max-md:hidden"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Overlay footer: theme toggle */}
        <div className="border-border/40 flex items-center justify-between border-t px-5 py-4 md:px-8">
          <span className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase">theme</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
