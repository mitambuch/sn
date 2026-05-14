// ═══════════════════════════════════════════════════
// Principles — landing S04 (three non-negotiables)
//
// WHAT: Full-viewport black section. Three paragraphs are stacked
//       blurred and dark by default — the reader must move the cursor
//       over a paragraph (or scroll it into view) to make it sharp and
//       legible. Active state is set by the latest of : (1) which
//       paragraph is hovered, (2) which paragraph is most in view via
//       IntersectionObserver. Cursor leaves → scroll-active wins.
// WHEN: After Domains. Anchored at #s04. Marked
//       `data-landing-dark="true"` so the global top-corner chrome
//       inverts to white over it.
// CHANGE COPY: edit landing.principles.* keys in fr.json / en.json.
// ═══════════════════════════════════════════════════

import { useLandingContext } from '@context/LandingContentContext';
import { resolveFieldOrFallback } from '@lib/i18nField';
import { cn } from '@utils/cn';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const PILLARS = ['1', '2', '3'] as const;
type PillarKey = (typeof PILLARS)[number];

/** Landing S04 — blur-by-default, cursor-or-scroll reveal manifesto. */
export const Principles = () => {
  const { t, i18n } = useTranslation();
  const { data: landing } = useLandingContext();
  const locale = (i18n.language as 'fr' | 'en') ?? 'fr';
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollActive, setScrollActive] = useState<PillarKey>('1');
  const [hoverActive, setHoverActive] = useState<PillarKey | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    if (!section) return;
    const paragraphs = section.querySelectorAll<HTMLElement>('[data-pillar]');
    if (paragraphs.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const pillar = entry.target.getAttribute('data-pillar');
            if (pillar === '1' || pillar === '2' || pillar === '3') {
              setScrollActive(pillar);
            }
          }
        }
      },
      { threshold: 0.55, rootMargin: '-20% 0px -30% 0px' },
    );

    paragraphs.forEach(p => {
      observer.observe(p);
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  const active = hoverActive ?? scrollActive;

  return (
    <section
      id="s04"
      ref={sectionRef}
      data-landing-dark="true"
      className="bg-ink text-on-ink relative flex min-h-screen flex-col overflow-hidden px-5 py-24 md:px-12 md:py-32"
    >
      {/* ─── Top meta strip ─── */}
      <div className="text-bg/70 mb-16 flex items-baseline justify-between font-mono text-[10px] tracking-widest uppercase md:mb-24">
        <span>
          ↘ 04 /{' '}
          {resolveFieldOrFallback(landing?.principlesEyebrow, locale, t('landing.principles.tag'))}
        </span>
        <span>
          {resolveFieldOrFallback(
            landing?.principlesHeadline,
            locale,
            t('landing.principles.eyebrow'),
          )}
        </span>
      </div>

      {/* ─── Body : pillar index + manifesto ─── */}
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-10 md:grid-cols-[1fr_8fr] md:gap-16">
        {/* Pillar index */}
        <aside
          className="md:sticky md:top-24 md:self-start"
          aria-label={t('landing.principles.tag')}
        >
          {PILLARS.map(p => {
            const isActive = p === active;
            return (
              <button
                key={p}
                type="button"
                onMouseEnter={() => {
                  setHoverActive(p);
                }}
                onFocus={() => {
                  setHoverActive(p);
                }}
                onMouseLeave={() => {
                  setHoverActive(null);
                }}
                onBlur={() => {
                  setHoverActive(null);
                }}
                className={cn(
                  'border-bg/15 flex w-full items-center justify-between gap-3 border-t py-3 text-left font-mono text-[11px] tracking-wider uppercase transition-colors duration-500',
                  isActive ? 'text-bg' : 'text-bg/35 hover:text-bg/70',
                )}
                aria-pressed={isActive}
              >
                <span>{t(`landing.principles.p${p}.mark`)}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-1.5 w-1.5 rounded-full transition-colors duration-500',
                    isActive ? 'bg-bg' : 'bg-bg/25',
                  )}
                />
              </button>
            );
          })}
        </aside>

        {/* Manifesto — blurred by default, sharp on hover / scroll-active */}
        <div
          onMouseLeave={() => {
            setHoverActive(null);
          }}
          className="flex flex-col gap-10 font-mono text-[clamp(1.5rem,2.8vw,2.5rem)] leading-[1.4] tracking-tight uppercase"
        >
          {PILLARS.map(p => {
            const isActive = p === active;
            return (
              <p
                key={p}
                data-pillar={p}
                onMouseEnter={() => {
                  setHoverActive(p);
                }}
                className={cn(
                  'max-w-[58ch] cursor-default transition-[opacity,filter,color] duration-500 ease-out outline-none',
                  isActive
                    ? 'text-bg blur-0 opacity-100'
                    : 'text-bg/30 opacity-70 blur-[4px] hover:blur-[2px]',
                )}
              >
                {t(`landing.principles.p${p}.prefix`)}{' '}
                <span
                  className={cn(
                    'font-semibold transition-colors duration-500',
                    isActive ? 'text-bg border-bg border-b' : 'text-bg/50 border-bg/30 border-b',
                  )}
                >
                  {t(`landing.principles.p${p}.keyword`)}
                </span>{' '}
                {t(`landing.principles.p${p}.body`)}
              </p>
            );
          })}
        </div>
      </div>

      {/* ─── Bottom strip ─── */}
      <div className="border-bg/20 text-bg/55 mt-16 flex items-center justify-between gap-4 border-t pt-6 font-mono text-[10px] tracking-widest uppercase md:mt-20">
        <span>{t('landing.principles.footer')}</span>
        <span>— {t('landing.principles.signature')}</span>
      </div>
    </section>
  );
};
