import { cn } from '@utils/cn';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

const LINKS = ['work', 'process', 'notes', 'contact'] as const;

/** Minimal floating nav — pill with backdrop blur, centered, subtle border.
 *  Desktop: inline links + CTA pill. Mobile: compact pill with icon menu +
 *  CTA, expands to a sheet below. */
export function MinimalFloating() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-bg relative min-h-30 md:min-h-35">
      {/* Pretend page backdrop so the floating effect reads */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, color-mix(in srgb, var(--color-accent) 20%, transparent), transparent 50%)',
        }}
        aria-hidden
      />

      <header className="relative z-10 flex justify-center pt-4 md:pt-6">
        <nav
          aria-label="Primary"
          className="border-border/60 bg-surface/70 flex items-center gap-1 rounded-full border px-2 py-2 shadow-lg backdrop-blur-md md:gap-2 md:px-3 md:py-2"
        >
          {/* Mobile menu icon */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            className="text-fg hover:bg-bg/50 duration-base flex h-9 w-9 items-center justify-center rounded-full transition-colors md:hidden"
          >
            {open ? <X size={16} strokeWidth={2} /> : <Menu size={16} strokeWidth={2} />}
          </button>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map(link => (
              <li key={link}>
                <a
                  href={`#${link}`}
                  className="text-fg hover:bg-bg/60 hover:text-accent-text duration-base inline-block rounded-full px-4 py-1.5 text-sm font-medium tracking-tight transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          {/* Divider between nav + CTA on desktop */}
          <span className="bg-border/60 mx-1 hidden h-5 w-px md:block" />

          {/* CTA pill */}
          <a
            href="#start"
            className="bg-accent text-on-accent hover:bg-accent/90 duration-base inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors md:px-4 md:text-sm md:tracking-normal md:normal-case"
          >
            Start a project
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </a>
        </nav>
      </header>

      {/* Mobile sheet */}
      <div
        className={cn(
          'absolute inset-x-4 top-20 z-20 md:hidden',
          'duration-base transition-[opacity,transform]',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
        )}
      >
        <nav
          aria-label="Primary mobile"
          className="border-border/60 bg-surface/90 rounded-2xl border px-2 py-2 shadow-xl backdrop-blur-md"
        >
          <ul>
            {LINKS.map(link => (
              <li key={link}>
                <a
                  href={`#${link}`}
                  onClick={() => setOpen(false)}
                  className="text-fg hover:bg-bg/40 duration-base block rounded-xl px-4 py-3 text-base font-medium tracking-tight transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
