import { useLocale } from '@app/LocaleProvider';
import { Logomark } from '@components/ui/Logomark';
import { ROUTES } from '@constants/routes';
import { cn } from '@utils/cn';
import { ArrowUpRight } from 'lucide-react';
import { type MouseEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NAV = [
  { href: '#positionnement', label: 'POSITIONNEMENT' },
  { href: '#expertise', label: 'EXPERTISE' },
  { href: '#methode', label: 'MÉTHODE' },
  { href: '#equipe', label: 'ÉQUIPE' },
  { href: '#contact', label: 'CONTACT' },
];

const SIGNATURE_LINE = 'SAW NEXT · CONCIERGERIE PRIVÉE · SUISSE';

export const LandingHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { locale, availableLocales, setLocale, localePath } = useLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleNavClick = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMenuOpen(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 right-0 left-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300',
          scrolled || menuOpen
            ? 'border-fg/15 bg-bg/85 border-b backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex w-full max-w-400 items-center justify-between gap-6 px-5 py-4 md:px-6 md:py-5">
          <a
            href="#hero"
            aria-label="SAW Next — retour en haut"
            onClick={handleNavClick('#hero')}
            className="text-fg focus-visible:ring-fg/30 inline-flex items-center rounded-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            <Logomark className="h-5 w-auto md:h-5.5" />
          </a>

          <div className="flex items-center gap-5 md:gap-7">
            <div
              role="group"
              aria-label="Langue"
              className="font-mono text-[10px] font-semibold tracking-[0.32em] uppercase"
            >
              {availableLocales.map((loc, idx) => (
                <span key={loc} className="inline-flex items-center">
                  {idx > 0 && (
                    <span aria-hidden="true" className="text-fg/30 mx-2">
                      ·
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setLocale(loc)}
                    aria-pressed={loc === locale}
                    className={cn(
                      'text-fg focus-visible:ring-fg/30 rounded-sm border-b transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none',
                      loc === locale ? 'border-fg' : 'hover:border-fg/40 border-transparent',
                    )}
                  >
                    {loc.toUpperCase()}
                  </button>
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(prev => !prev)}
              aria-expanded={menuOpen}
              aria-controls="landing-menu"
              className="text-fg focus-visible:ring-fg/30 group inline-flex items-center gap-3 rounded-sm font-mono text-[10px] font-semibold tracking-[0.32em] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
            >
              <span>{menuOpen ? 'Fermer' : 'Menu'}</span>
              <span
                aria-hidden="true"
                className="relative inline-flex h-3 w-5 items-center justify-center"
              >
                <span
                  className={cn(
                    'bg-fg absolute h-px w-full origin-center transition-all duration-300',
                    menuOpen ? 'rotate-45' : '-translate-y-1',
                  )}
                />
                <span
                  className={cn(
                    'bg-fg absolute h-px w-full origin-center transition-all duration-300',
                    menuOpen ? '-rotate-45' : 'translate-y-1',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="landing-menu"
        className={cn(
          'fixed inset-0 z-40 transition-opacity duration-500',
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          onClick={closeMenu}
          aria-label="Fermer le menu"
          className="bg-bg/92 absolute inset-0 cursor-default backdrop-blur-2xl"
          tabIndex={-1}
        />

        <div className="pointer-events-none relative flex h-full flex-col px-5 pt-24 pb-10 md:px-6 md:pt-32 md:pb-12">
          <nav
            aria-label="Navigation principale"
            className="pointer-events-auto mx-auto w-full max-w-400 flex-1"
          >
            <ol className="border-fg/15 border-t">
              {NAV.map((item, i) => (
                <li key={item.href} className="border-fg/15 border-b">
                  <a
                    href={item.href}
                    onClick={handleNavClick(item.href)}
                    className="hover:bg-fg/3 group grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-6 transition-colors duration-200 md:grid-cols-[5rem_1fr_auto] md:gap-6 md:py-7"
                    style={{
                      opacity: menuOpen ? 1 : 0,
                      transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                      transition: `opacity 600ms ease, transform 600ms ease`,
                      transitionDelay: menuOpen ? `${120 + i * 70}ms` : '0ms',
                    }}
                  >
                    <span className="text-fg font-mono text-[10px] font-semibold tracking-[0.4em] uppercase tabular-nums">
                      0{i + 1}
                    </span>
                    <span className="text-fg font-mono text-2xl leading-tight font-semibold tracking-tight uppercase md:text-4xl lg:text-5xl">
                      {item.label}
                    </span>
                    <ArrowUpRight
                      size={22}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="text-fg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div
            className="pointer-events-auto mx-auto mt-12 flex w-full max-w-400 flex-col items-start justify-between gap-6 md:flex-row md:items-center md:gap-10"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 600ms ease, transform 600ms ease',
              transitionDelay: menuOpen ? `${120 + NAV.length * 70 + 60}ms` : '0ms',
            }}
          >
            <Link
              to={localePath(ROUTES.LOGIN)}
              onClick={closeMenu}
              className="border-fg/40 text-fg hover:bg-fg hover:text-bg hover:border-fg group inline-flex items-center gap-3 rounded-sm border px-5 py-3 font-mono text-[10px] font-semibold tracking-[0.32em] uppercase transition-colors duration-200"
            >
              <span>Espace client</span>
              <ArrowUpRight
                size={14}
                strokeWidth={1.8}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <p className="text-fg font-mono text-[10px] font-semibold tracking-[0.32em] uppercase">
              {SIGNATURE_LINE}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
