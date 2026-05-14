// ═══════════════════════════════════════════════════
// Interlocutor — landing S09 (focal contact + restricted circle)
//
// WHAT: Two-column section with autoplay rotation through the three
//       founders. Salvatore always loads first, then advances every
//       8s to Harry, then Bokar, then loops. Hovering the focal card
//       freezes the timer ; leaving resumes. A 3-segment progress
//       bar at the bottom of the section shows the active member and
//       the time remaining on the current segment.
//
//       Owner directions :
//       1. Always start with Salva (ego-canonical).
//       2. 8s per slide, auto-advance.
//       3. Hover on focal card → lock timer.
//       4. Bottom progress bar visualises the rotation.
//       5. Click on any segment or circle card → jump to that member.
//
// WHEN: Anchored at #s09 of the landing.
// ═══════════════════════════════════════════════════

import { useLandingContext } from '@context/LandingContentContext';
import { useReveal } from '@hooks/useReveal';
import { resolveFieldOrFallback } from '@lib/i18nField';
import { cn } from '@utils/cn';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const FOCAL_CHANNELS = {
  phone: '+41 78 749 81 70',
  phoneTel: '+41787498170',
  email: 'info@saw-next.ch',
  whatsapp: 'https://wa.me/41787498170',
  linkedin: '#',
} as const;

interface Member {
  key: 'salva' | 'harry' | 'bokar';
  firstName: string;
  lastName: string;
}

const MEMBERS: ReadonlyArray<Member> = [
  { key: 'salva', firstName: 'Salvatore', lastName: 'Montemagno' },
  { key: 'harry', firstName: 'Harry', lastName: 'Novillo' },
  { key: 'bokar', firstName: 'Bokar', lastName: 'Guissé' },
] as const;

const SEQUENCE: ReadonlyArray<Member['key']> = ['salva', 'harry', 'bokar'];
const SLIDE_DURATION_MS = 8000;

/** Landing S09 — autoplay focal interlocutor + supporting circle. */
export const Interlocutor = () => {
  const { t, i18n } = useTranslation();
  const { data: landing } = useLandingContext();
  const locale = (i18n.language as 'fr' | 'en') ?? 'fr';
  const ref = useReveal<HTMLDivElement>();
  const [focalKey, setFocalKey] = useState<Member['key']>('salva');
  const [progress, setProgress] = useState(0); // 0..1 of current slide

  // Refs drive the autoplay loop without forcing the effect to re-run
  // on every frame. focalKey lives in state for re-render ; the
  // accumulator + paused flag live in refs so the rAF loop reads
  // fresh values without re-subscribing.
  const accumRef = useRef(0);
  const pausedRef = useRef(false);
  const focalRef = useRef<Member['key']>('salva');

  // Sync focalRef with the focalKey state via effect (React 19 forbids
  // ref writes during render).
  useEffect(() => {
    focalRef.current = focalKey;
  }, [focalKey]);

  useEffect(() => {
    // Respect reduced-motion : skip the autoplay entirely.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const delta = now - prev;
      prev = now;
      if (!pausedRef.current) {
        accumRef.current += delta;
        const ratio = Math.min(accumRef.current / SLIDE_DURATION_MS, 1);
        setProgress(ratio);
        if (accumRef.current >= SLIDE_DURATION_MS) {
          accumRef.current = 0;
          const idx = SEQUENCE.indexOf(focalRef.current);
          const next = SEQUENCE[(idx + 1) % SEQUENCE.length]!;
          setFocalKey(next);
        }
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(raf);
    };
  }, []);

  // Manual promotion (click on a circle card or a progress segment) —
  // jumps the rotation onto that member and resets the timer.
  const promote = (key: Member['key']) => {
    setFocalKey(key);
    accumRef.current = 0;
    setProgress(0);
  };

  const focal = MEMBERS.find(m => m.key === focalKey) ?? MEMBERS[0]!;
  const circle = MEMBERS.filter(m => m.key !== focalKey);
  const isSalvaFocal = focal.key === 'salva';

  const focalBio = t(
    isSalvaFocal ? 'landing.interlocutor.salvaBio' : `landing.interlocutor.${focal.key}.bio`,
  );
  const focalTag = isSalvaFocal
    ? t('landing.interlocutor.focalTag')
    : t(`landing.interlocutor.${focal.key}.tag`);

  return (
    <section id="s09" ref={ref} className="border-border border-b">
      {/* ─── Header strip — eyebrow + monumental title ─── */}
      <div className="border-border border-b px-8 py-8 md:px-12 md:py-10">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-widest uppercase">
          <span>
            ↘ 09 /{' '}
            {resolveFieldOrFallback(
              landing?.interlocutorEyebrow,
              locale,
              t('landing.interlocutor.eyebrowTeam'),
            )}
          </span>
          <span className="text-muted">{t('landing.interlocutor.countLabel')}</span>
        </div>
        <h2 className="mt-6 font-mono text-[clamp(1.75rem,4.2vw,3.5rem)] leading-[0.95] font-medium tracking-tight uppercase">
          {resolveFieldOrFallback(
            landing?.interlocutorHeadlineA,
            locale,
            t('landing.interlocutor.headlineA'),
          )}
          <br />
          <span className="text-muted">
            {resolveFieldOrFallback(
              landing?.interlocutorHeadlineB,
              locale,
              t('landing.interlocutor.headlineB'),
            )}
          </span>
        </h2>
      </div>

      {/* ─── Main split : focal (full size) + circle (compact stack) ───
           md:min-h-[680px] locks the row height so swapping focal (Salva
           = 4 channels, Harry/Bokar = single 'Contact opérationnel' pill)
           doesn't make the box jump. */}
      <div className="grid grid-cols-1 md:min-h-170 md:grid-cols-[1.25fr_1fr]">
        {/* ─── Focal card — hover-pauses the timer ─── */}
        <article
          className="bg-surface border-border duration-base flex flex-col gap-8 border-b p-8 transition-all md:border-r md:border-b-0 md:p-12"
          aria-live="polite"
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
          onFocus={() => {
            pausedRef.current = true;
          }}
          onBlur={() => {
            pausedRef.current = false;
          }}
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
                {focalTag}
              </span>
              <h3 className="font-mono text-[clamp(1.5rem,3.5vw,3rem)] leading-[0.92] font-medium tracking-tight uppercase">
                {focal.firstName}
                <br />
                {focal.lastName}.
              </h3>
            </div>
            <div
              aria-hidden="true"
              className="border-border bg-bg/40 aspect-3/4 w-24 shrink-0 border md:w-32"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, color-mix(in srgb, var(--color-fg) 8%, transparent) 0%, color-mix(in srgb, var(--color-fg) 18%, transparent) 100%)',
              }}
            />
          </div>

          <span className="font-mono text-[12px] tracking-[0.18em] uppercase">
            {t('landing.interlocutor.role')}
          </span>
          <p className="text-fg max-w-prose text-sm leading-relaxed md:text-base">{focalBio}</p>

          {/* Channels — only when Salvatore is focal. Otherwise a single
              "via Salvatore" link, since he is the operational contact.
              `mt-auto` anchors both variants to the bottom of the focal
              article so the contact block sits at the same vertical
              position regardless of who is shown. */}
          {isSalvaFocal ? (
            <ul className="border-border mt-auto border-t">
              {[
                {
                  href: `tel:${FOCAL_CHANNELS.phoneTel}`,
                  label: t('landing.interlocutor.phone'),
                  value: FOCAL_CHANNELS.phone,
                },
                {
                  href: `mailto:${FOCAL_CHANNELS.email}`,
                  label: t('landing.interlocutor.email'),
                  value: FOCAL_CHANNELS.email,
                },
                {
                  href: FOCAL_CHANNELS.whatsapp,
                  label: t('landing.interlocutor.whatsapp'),
                  value: t('landing.interlocutor.whatsappAction'),
                },
                {
                  href: FOCAL_CHANNELS.linkedin,
                  label: t('landing.interlocutor.linkedin'),
                  value: t('landing.interlocutor.linkedinAction'),
                },
              ].map(channel => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    className="border-border text-fg flex items-center justify-between border-b py-3 font-mono text-[11px] tracking-wider uppercase transition-[padding] duration-200 hover:pl-2"
                  >
                    <span>{channel.label}</span>
                    <span className="text-muted">{channel.value}&nbsp;↗</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="border-border mt-auto flex items-center justify-between gap-4 border-t pt-4">
              <span className="text-muted font-mono text-[11px] tracking-[0.18em] uppercase">
                Contact opérationnel · Salvatore
              </span>
              <button
                type="button"
                onClick={() => promote('salva')}
                className="border-fg text-fg hover:bg-fg hover:text-bg duration-base inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[10px] tracking-[0.25em] uppercase transition-colors"
              >
                Voir Salvatore
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          )}
        </article>

        {/* ─── Circle — promotable cards ─── */}
        <aside className="flex flex-col">
          <div className="border-border flex items-center justify-between border-b px-8 py-5 font-mono text-[10px] tracking-[0.3em] uppercase md:px-12">
            <span>↘ {t('landing.interlocutor.circleTag')}</span>
            <span className="text-muted">{t('landing.interlocutor.circleCount')}</span>
          </div>
          {circle.map((member, i) => {
            const bioKey =
              member.key === 'salva'
                ? 'landing.interlocutor.salvaBio'
                : `landing.interlocutor.${member.key}.bio`;
            const tagKey =
              member.key === 'salva'
                ? 'landing.interlocutor.focalTag'
                : `landing.interlocutor.${member.key}.tag`;
            return (
              <article key={member.key} className={i === 0 ? 'border-border border-b' : ''}>
                <button
                  type="button"
                  onClick={() => promote(member.key)}
                  aria-label={`Mettre en avant ${member.firstName} ${member.lastName}`}
                  className="hover:bg-bg/40 focus-visible:ring-fg/30 group w-full text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <div className="flex flex-col gap-5 p-8 md:p-12">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-muted font-mono text-[9px] tracking-[0.3em] uppercase">
                          {t(tagKey)}
                        </span>
                        <h3 className="font-mono text-[clamp(1.25rem,2.6vw,2rem)] leading-[0.95] font-medium tracking-tight uppercase">
                          {member.firstName}
                          <br />
                          {member.lastName}.
                        </h3>
                      </div>
                      <div
                        aria-hidden="true"
                        className="border-border bg-bg/40 aspect-3/4 w-16 shrink-0 border md:w-20"
                        style={{
                          backgroundImage:
                            'linear-gradient(135deg, color-mix(in srgb, var(--color-fg) 6%, transparent) 0%, color-mix(in srgb, var(--color-fg) 14%, transparent) 100%)',
                        }}
                      />
                    </div>
                    <p className="text-fg/85 text-sm leading-relaxed">{t(bioKey)}</p>
                    <span className="text-muted group-hover:text-fg font-mono text-[10px] tracking-[0.3em] uppercase transition-colors">
                      Mettre en avant ↗
                    </span>
                  </div>
                </button>
              </article>
            );
          })}
        </aside>
      </div>

      {/* ─── Bottom progress bar : 3 segments, active fills 0 → 100% ─── */}
      <div
        role="tablist"
        aria-label="Membres de l'équipe"
        className="border-border bg-bg/60 grid grid-cols-3 gap-px border-t backdrop-blur-sm"
      >
        {MEMBERS.map(member => {
          const isActive = focalKey === member.key;
          return (
            <button
              key={member.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => promote(member.key)}
              className={cn(
                'duration-base group flex flex-col gap-2 px-4 py-3 text-left transition-colors md:px-6 md:py-4',
                'hover:bg-fg/5 focus-visible:ring-fg/30 focus-visible:ring-2 focus-visible:outline-none',
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={cn(
                    'font-mono text-[10px] tracking-[0.3em] uppercase transition-colors',
                    isActive ? 'text-fg' : 'text-muted',
                  )}
                >
                  {member.firstName}
                </span>
                <span
                  className={cn(
                    'font-mono text-[9px] tracking-wider uppercase transition-colors',
                    isActive ? 'text-fg/70' : 'text-muted/50',
                  )}
                >
                  0{SEQUENCE.indexOf(member.key) + 1}
                </span>
              </div>
              <div className="bg-fg/10 relative h-px overflow-hidden">
                <div
                  aria-hidden="true"
                  className="bg-fg absolute inset-y-0 left-0"
                  style={{
                    width: isActive ? `${(progress * 100).toFixed(1)}%` : '0%',
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
