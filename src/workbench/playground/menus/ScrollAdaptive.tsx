import { LanguageSwitcher } from '@components/ui/LanguageSwitcher';
import { cn } from '@utils/cn';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const LINKS = ['work', 'writing', 'about', 'contact'] as const;

/** Scroll-adaptive — full wordmark + CTA at rest, morphs to a compact pill
 *  once the page scrolls. Playground uses a toggle for demo purposes since
 *  real scroll is the parent's concern. */
export function ScrollAdaptive() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-bg relative min-h-55">
      {/* Demo toggle — real implementations hook into window scroll */}
      <div className="absolute top-3 right-3 z-10">
        <button
          type="button"
          onClick={() => setScrolled(v => !v)}
          className="border-border/60 bg-surface/60 text-muted hover:text-fg duration-base rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase transition-colors"
        >
          state: {scrolled ? 'scrolled' : 'top'}
        </button>
      </div>

      {/* AT-REST header — large, generous */}
      <header
        className={cn(
          'duration-base absolute inset-x-0 top-0 transition-[opacity,transform]',
          scrolled ? 'pointer-events-none -translate-y-2 opacity-0' : 'translate-y-0 opacity-100',
        )}
      >
        <div className="mx-auto flex max-w-400 items-end justify-between gap-6 px-4 pt-10 pb-6 md:px-8 md:pt-14 md:pb-8">
          <a href="#home" className="flex flex-col">
            <span className="text-muted font-mono text-[10px] tracking-[0.25em] uppercase">
              Studio
            </span>
            <span className="text-fg text-3xl leading-[0.9] font-bold tracking-tight md:text-5xl lg:text-6xl">
              côté marais
            </span>
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {LINKS.map(link => (
                <li key={link}>
                  <a
                    href={`#${link}`}
                    className="text-fg hover:text-accent-text duration-base text-sm tracking-tight transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="text-fg -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
          >
            <Menu size={22} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* SCROLLED header — compact pill floating */}
      <header
        className={cn(
          'duration-base absolute inset-x-0 top-3 flex justify-center transition-[opacity,transform] md:top-5',
          scrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
        )}
      >
        <nav
          aria-label="Primary (scrolled)"
          className="border-border/60 bg-surface/80 flex items-center gap-2 rounded-full border px-3 py-2 shadow-lg backdrop-blur-md"
        >
          <a href="#home" className="text-fg px-2 text-sm font-semibold tracking-tight">
            côté marais
          </a>
          <span className="bg-border/60 h-4 w-px" />
          <ul className="hidden items-center gap-1 sm:flex">
            {LINKS.slice(0, 3).map(link => (
              <li key={link}>
                <a
                  href={`#${link}`}
                  className="text-muted hover:text-fg duration-base inline-block rounded-full px-2.5 py-1 text-xs transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
          <LanguageSwitcher variant="minimal" className="ml-1" />
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          'border-border bg-bg absolute inset-x-0 top-0 z-50 border-b md:hidden',
          'duration-base transition-[opacity,transform]',
          mobileOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
        )}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <span className="text-fg text-xl font-bold tracking-tight">côté marais</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="text-fg -mr-2 flex h-11 w-11 items-center justify-center"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </div>
        <ul className="px-6 py-4">
          {LINKS.map(link => (
            <li key={link} className="border-border/50 border-b last:border-b-0">
              <a
                href={`#${link}`}
                onClick={() => setMobileOpen(false)}
                className="text-fg block py-3 text-lg font-medium tracking-tight"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
