import { Logomark } from '@components/ui/Logomark';
import { cn } from '@utils/cn';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV = [
  { href: '#positionnement', label: 'POSITIONNEMENT' },
  { href: '#expertise', label: 'EXPERTISE' },
  { href: '#methode', label: 'MÉTHODE' },
  { href: '#equipe', label: 'ÉQUIPE' },
];

export const LandingHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300',
        scrolled
          ? 'border-fg/10 bg-bg/85 border-b backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex w-full max-w-400 items-center justify-between gap-8 px-5 py-4 md:px-6 md:py-5">
        <a
          href="#hero"
          aria-label="SAW Next — retour en haut"
          className="text-fg focus-visible:ring-fg/30 inline-flex items-center rounded-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          <Logomark className="h-7 w-auto md:h-8" />
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-7 md:flex lg:gap-10">
          {NAV.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="text-fg/60 hover:text-fg focus-visible:ring-fg/30 group relative py-2 font-mono text-[11px] font-semibold tracking-[0.28em] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
            >
              <span>{item.label}</span>
              <span
                aria-hidden="true"
                className="bg-fg absolute right-0 bottom-0 left-0 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="border-fg/40 text-fg hover:bg-fg hover:text-bg hover:border-fg focus-visible:ring-fg/30 group inline-flex items-center gap-2.5 rounded-sm border px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.32em] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:px-5 md:py-3"
        >
          <span>Contacter</span>
          <ArrowUpRight
            size={13}
            strokeWidth={1.8}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </header>
  );
};
