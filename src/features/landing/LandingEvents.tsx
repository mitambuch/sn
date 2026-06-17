// ═══════════════════════════════════════════════════
// LandingEvents — landing S06 (public events + locked teasers)
//
// WHAT: Public-facing events section on the home. Shows the real events the
//       client flagged `visibility: public` in Sanity, then a few frosted
//       LOCKED teaser cards so the visitor feels there's more behind access.
//       Every card (real or locked) opens the access-request modal — the
//       section is a conversion funnel, not a catalogue.
// WHEN: Mounted in Home.tsx, between Domains (S05) and Access (S08). It
//       renders NOTHING until at least one real public event exists — the
//       public home never shows fake fiches (no mock fallback).
// MECHANICS: magnetic-hover (real cards pull toward the cursor) +
//       masked-reveal (locked cards stay veiled; hovering partially lifts
//       the blur as a tease, the content never actually unlocks).
// CHANGE COPY: edit landing.events.* keys in fr/en/es.json.
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { MagneticHover } from '@components/ui/MagneticHover';
import { Reveal } from '@components/ui/Reveal';
import { useAccessRequestModal } from '@context/useAccessRequestModal';
import { SectionTag } from '@features/landing/SectionTag';
import { usePublicEvents } from '@features/landing/usePublicEvents';
import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { resolveEventDate } from '@/features/events/eventDate';
import type { PublicEvent } from '@/types/event';

/** How many locked teaser cards trail the real events (owner: 3 — enough FOMO,
 *  not so many they drown the real content). */
const TEASER_COUNT = 3;

/** Landing S06 — public events with locked teasers, all funneling to access. */
export const LandingEvents = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en' : i18n.language === 'es' ? 'es' : 'fr';
  const { events, loading } = usePublicEvents();
  const { openAccessRequest } = useAccessRequestModal();

  // No mock fallback : until a real public event exists, the section is absent.
  if (loading || events.length === 0) return null;

  const requestAccess = () => {
    openAccessRequest('request');
  };

  return (
    <section id="s06" className="border-border border-b px-5 py-24 md:px-12 md:py-32">
      {/* ─── Header — same grammar as Domains S05 ─── */}
      <div className="border-border mb-14 flex flex-col gap-6 border-b pb-8 md:flex-row md:items-end md:justify-between md:gap-12">
        <div className="flex flex-col gap-4">
          <SectionTag num="06" label={t('landing.events.tag')} />
          <h2 className="font-mono text-[clamp(1.75rem,4vw,4rem)] leading-[0.95] font-medium tracking-[-0.025em] uppercase">
            {t('landing.events.headline')}
          </h2>
        </div>
        <p className="text-muted font-mono text-[10px] leading-[1.9] tracking-widest uppercase md:max-w-[30ch] md:text-right">
          {t('landing.events.lede')}
        </p>
      </div>

      {/* ─── Grid : real events first, locked teasers after ─── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {events.map((event, i) => (
          <Reveal key={event.id} index={i} className="h-full *:h-full">
            <RealEventCard
              event={event}
              locale={locale}
              categoryLabel={t(`events.category.${event.category}`)}
              ariaLabel={t('landing.events.cardAria', { title: event.title })}
              onActivate={requestAccess}
            />
          </Reveal>
        ))}
        {Array.from({ length: TEASER_COUNT }).map((_, i) => (
          <Reveal key={`locked-${String(i)}`} index={events.length + i} className="h-full *:h-full">
            <LockedTeaser
              label={t('landing.events.locked')}
              hint={t('landing.events.lockedHint')}
              ariaLabel={t('landing.events.lockedAria')}
              onActivate={requestAccess}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
};

interface RealEventCardProps {
  event: PublicEvent;
  locale: string;
  categoryLabel: string;
  ariaLabel: string;
  onActivate: () => void;
}

/** A genuine public event — magnetic on desktop, opens access on activate. */
const RealEventCard = ({
  event,
  locale,
  categoryLabel,
  ariaLabel,
  onActivate,
}: RealEventCardProps) => {
  const { t } = useTranslation();
  const { badge } = resolveEventDate(event, locale, t);

  return (
    <MagneticHover radius={120} strength={0.12} className="block h-full w-full">
      <button
        type="button"
        onClick={onActivate}
        aria-label={ariaLabel}
        className="rounded-card block h-full w-full text-left focus-visible:outline-none"
      >
        <Card interactive padding="none" className="h-full">
          <Card.Media
            src={event.images[0]?.src}
            alt={event.images[0]?.alt ?? event.title}
            ratio="4/3"
          />
          <Card.Badge top={badge.top} bottom={badge.bottom} />
          <Card.Body>
            <Card.Eyebrow>
              {categoryLabel} · {event.city}
            </Card.Eyebrow>
            <Card.Title>{event.title}</Card.Title>
            <Card.Stats>
              <Card.Stat label={t('events.meta.venue')} value={event.venue} />
            </Card.Stats>
          </Card.Body>
        </Card>
      </button>
    </MagneticHover>
  );
};

interface LockedTeaserProps {
  label: string;
  hint: string;
  ariaLabel: string;
  onActivate: () => void;
}

/** A veiled, members-only card. The content is redacted + blurred ; hovering
 *  partially lifts the veil (masked-reveal) as a tease, then opens access. */
const LockedTeaser = ({ label, hint, ariaLabel, onActivate }: LockedTeaserProps) => (
  <button
    type="button"
    onClick={onActivate}
    aria-label={ariaLabel}
    className="group/locked rounded-card block h-full w-full text-left focus-visible:outline-none"
  >
    <Card interactive padding="none" className="relative h-full">
      {/* Veiled content — redacted bars over a mono placeholder. Decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none blur-[6px] saturate-0 transition-[filter] duration-500 ease-out select-none group-hover/locked:blur-[3px]"
      >
        <Card.Media ratio="4/3" alt="" />
        <div className="flex flex-col gap-3 p-5">
          <span className="bg-fg/15 block h-2 w-1/3 rounded-full" />
          <span className="bg-fg/25 block h-4 w-3/4 rounded-full" />
          <span className="bg-fg/10 block h-2 w-1/2 rounded-full" />
        </div>
      </div>

      {/* Frosted veil + lock — sits above the redacted content. */}
      <div className="bg-bg/30 absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center backdrop-blur-[1px]">
        <span className="border-fg/30 text-fg flex h-11 w-11 items-center justify-center rounded-full border">
          <Lock size={16} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span className="text-fg font-mono text-[11px] tracking-[0.2em] uppercase">{label}</span>
        <span className="text-muted font-mono text-[10px] tracking-[0.18em] uppercase">{hint}</span>
      </div>
    </Card>
  </button>
);
