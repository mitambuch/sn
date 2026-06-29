// ═══════════════════════════════════════════════════
// TheHiddenShore — bespoke private-journey presentation (THE ODYSSEY) at
// /the-hidden-shore
//
// WHAT: A short, mobile-first, tap-to-open presentation for one client
//       pitch (a private 24-hour birthday experience along the Algarve
//       coast). A cinematic cover, an at-a-glance strip, then everything lives
//       in collapsed accordions (the story in chapters, what is included
//       by category) so the page is never an endless scroll. Small lucide
//       pictos label each section. No bullet lists — services are
//       separated by hairlines. Reuses the SAW NEXT monochrome visual
//       language end-to-end. A muted looping video sits behind the cover.
//       The A/B schedule module (<Day/>) is retained but DORMANT — gated
//       off via SHOW_DAY; ships as a single programme until a second
//       version is authored.
// WHEN: /the-hidden-shore — top-level route, outside the locale tree, no
//       layout chrome, self-manages its own <title>/meta (noindex). The
//       route slug is kept (was "The Hidden Shore") so the shared link
//       still resolves. English only by design — a one-off client
//       document, not site content.
// EDIT COPY: src/data/hiddenShore.ts  ·  COVER VIDEO: drop a .mp4 into
//       public/video/ and wire it as the Hero background (same pattern as
//       the landing — see src/config/heroVideos.ts).
// ═══════════════════════════════════════════════════

import { BrandMark } from '@components/brand/BrandMark';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@components/ui/Accordion';
import { Reveal } from '@components/ui/Reveal';
import { cn } from '@utils/cn';
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Clock,
  Compass,
  ListChecks,
  type LucideIcon,
  MapPin,
  Music,
  Palette,
  ShieldCheck,
  Ship,
  Users,
  UtensilsCrossed,
  Wine,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { siteConfig } from '@/config/site';
import {
  chapters,
  closing,
  type DayPhase,
  dayPhases,
  facts,
  hiddenShore,
  included,
  manifesto,
  offer,
  type OptionKey,
  optionLabels,
  timeline,
  vessel,
} from '@/data/hiddenShore';

/* ─── Picto registry — one map, keyed by chapter numeral / phase name /
   included title / fact label / section. Keeps icons in one place. ─── */
const ICONS: Record<string, LucideIcon> = {
  // Chapters
  I: Ship, // The Programme — boarding at Faro
  II: Compass, // Navigation — cruising the Algarve coast
  III: Music, // The Celebration
  IV: Palette, // The Signature Moment — the artwork
  V: ShieldCheck, // Confidentiality
  // Included groups
  'Catering & Cuisine': UtensilsCrossed,
  Bar: Wine,
  Atmosphere: Music,
  // Facts
  Destination: MapPin,
  Dates: CalendarDays,
  Yacht: Ship,
  Guests: Users,
  // Sections + journey
  'The Journey': Compass,
  story: BookOpen,
  vessel: Ship,
  day: Clock,
  included: ListChecks,
};

/** Small line-icon by registry key. Renders nothing for an unknown key. */
function Picto({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name];
  return Icon ? (
    <Icon size={16} strokeWidth={1.5} aria-hidden="true" className={cn('shrink-0', className)} />
  ) : null;
}

/** Section opener — picto eyebrow + heading. */
function SectionHead({ icon, label, title }: { icon: string; label: string; title: string }) {
  return (
    <div className="mb-8 flex flex-col gap-3">
      <span className="text-muted flex items-center gap-2.5 font-mono text-[10px] tracking-[0.3em] uppercase">
        <Picto name={icon} className="size-3.5" /> {label}
      </span>
      <h2 className="font-mono text-[clamp(1.5rem,5vw,2.5rem)] leading-[1.02] font-medium tracking-tight text-balance uppercase">
        {title}
      </h2>
    </div>
  );
}

/** Cover — muted looping video behind the title, with a dark scrim so the
 *  text stays legible. Title, subtitle, location/dates, epigraph. One screen. */
function Hero() {
  return (
    <section className="bg-ink relative isolate flex min-h-svh flex-col justify-between overflow-hidden px-5 pt-28 pb-10 text-white md:px-12 md:pt-32">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        src="/video/portimao.mp4"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-black/45" />

      <span className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.3em] text-white/60 uppercase">
        <Compass size={14} strokeWidth={1.5} aria-hidden="true" /> {hiddenShore.brand}
      </span>

      <div className="flex flex-1 flex-col justify-center py-12">
        <p className="font-mono text-[11px] tracking-[0.3em] text-white/60 uppercase">
          {hiddenShore.subtitle}
        </p>
        <h1 className="mt-5 max-w-5xl font-mono text-[clamp(2.75rem,9vw,7rem)] leading-[0.92] font-medium tracking-[-0.03em] text-balance uppercase">
          {hiddenShore.title}
        </h1>
        <div className="mt-8 flex flex-col gap-3">
          <span className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-white/70 uppercase">
            <MapPin size={15} strokeWidth={1.5} aria-hidden="true" /> {hiddenShore.location}
          </span>
          <span className="flex items-center gap-2.5 font-mono text-[clamp(1.5rem,5vw,2.5rem)] leading-none font-medium tracking-tight text-white uppercase">
            <CalendarDays
              size={26}
              strokeWidth={1.5}
              aria-hidden="true"
              className="shrink-0 text-white/80"
            />
            {hiddenShore.dates}
          </span>
        </div>
        <p className="mt-10 max-w-md text-lg leading-relaxed text-pretty text-white/85">
          {hiddenShore.epigraph.map(line => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>

      <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-white/55 uppercase">
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
          className="motion-safe:animate-bounce"
        />
        Scroll to explore
      </div>
    </section>
  );
}

/** At-a-glance orientation strip — key facts with pictos, no scroll cost. */
function Facts() {
  return (
    <section className="border-border border-b px-5 py-8 md:px-12">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
        {facts.map(f => (
          <div key={f.label} className="flex flex-col gap-1.5">
            <dt className="text-muted flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
              <Picto name={f.label} className="size-3.5" /> {f.label}
            </dt>
            <dd className="text-fg font-mono text-sm tracking-tight uppercase">{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** The story — manifesto + chapters, each tap-to-open. */
function Story() {
  return (
    <section className="px-5 py-20 md:px-12 md:py-28">
      <SectionHead icon="story" label="The Experience" title="The Story" />
      <Accordion type="single" defaultOpen="journey" className="border-border border-t">
        <AccordionItem value="journey">
          <AccordionTrigger>
            <span className="flex items-center gap-3">
              <Picto name="The Journey" className="text-muted" />
              <span>A Private Journey</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-base">
            <p className="text-fg mb-4 font-mono text-sm leading-snug tracking-tight uppercase">
              {manifesto.lead}
            </p>
            <ul className="divide-border/40 text-fg/80 divide-y">
              {manifesto.lines.map(line => (
                <li key={line} className="py-2 leading-relaxed first:pt-0">
                  {line}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {chapters.map(chapter => (
          <AccordionItem key={chapter.num} value={chapter.num}>
            <AccordionTrigger>
              <span className="flex items-center gap-3">
                <Picto name={chapter.num} className="text-muted" />
                <span className="text-muted font-mono text-xs tracking-[0.12em]">
                  {chapter.num}
                </span>
                <span>{chapter.title}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-base">
              <ul className="divide-border/40 text-fg/80 divide-y">
                {chapter.lines.map(line => (
                  <li key={line} className="py-2 leading-relaxed first:pt-0">
                    {line}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

/** The vessel — the yacht itself: a short editorial line, designer credits,
 *  key specifications, and a link out to Azimut so the recipient can browse
 *  photos and full detail. */
function Vessel() {
  return (
    <section className="border-border border-t px-5 py-20 md:px-12 md:py-28">
      <SectionHead icon="vessel" label="The Vessel" title={vessel.name} />

      <p className="text-fg/80 mb-10 max-w-2xl text-lg leading-relaxed text-pretty">
        {vessel.lead}
      </p>

      {/* Designer credits — exterior / interior / builder. */}
      <dl className="border-border mb-10 grid grid-cols-1 gap-x-6 gap-y-5 border-t pt-8 sm:grid-cols-3">
        {vessel.designers.map(d => (
          <div key={d.name} className="flex flex-col gap-1.5">
            <dt className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase">
              {d.role}
            </dt>
            <dd className="text-fg font-mono text-sm tracking-tight uppercase">{d.name}</dd>
          </div>
        ))}
      </dl>

      {/* Key specifications from the Azimut spec sheet. */}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
        {vessel.specs.map(s => (
          <div key={s.label} className="flex flex-col gap-1.5">
            <dt className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase">
              {s.label}
            </dt>
            <dd className="text-fg font-mono text-sm tracking-tight uppercase">{s.value}</dd>
          </div>
        ))}
      </dl>

      <a
        href={vessel.link}
        target="_blank"
        rel="noopener noreferrer"
        className="border-border text-fg hover:bg-fg hover:text-bg focus-visible:ring-fg mt-12 inline-flex w-fit items-center gap-2.5 rounded-full border px-7 py-3.5 font-mono text-xs tracking-[0.2em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {vessel.linkLabel}
        <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
      </a>
    </section>
  );
}

/** The day — A/B departure schedule. On desktop the toggle sits inline; on
 *  mobile a thumb-reachable bar pins to the bottom of the screen while this
 *  section is in view, so switching A/B never means scrolling back up. */
function Day() {
  const [option, setOption] = useState<OptionKey>('a');
  const sectionRef = useRef<HTMLElement>(null);
  const [barVisible, setBarVisible] = useState(false);

  // Reveal the mobile bottom bar only while The Day is on screen — switching
  // A/B elsewhere would change times the visitor cannot see.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setBarVisible(entry?.isIntersecting ?? false),
      { rootMargin: '0px 0px -20% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const optionButton = (key: OptionKey, variant: 'inline' | 'bar') => (
    <button
      key={key}
      type="button"
      onClick={() => setOption(key)}
      aria-pressed={option === key}
      className={cn(
        'rounded-full font-mono uppercase transition-colors',
        variant === 'bar'
          ? 'flex-1 px-3 py-2 text-center leading-tight'
          : 'px-4 py-2 text-[11px] tracking-[0.12em]',
        option === key ? 'bg-fg text-bg' : 'text-muted hover:text-fg',
      )}
    >
      {variant === 'bar' ? (
        <>
          <span className="block text-[11px] tracking-[0.12em]">{optionLabels[key].name}</span>
          <span className="mt-0.5 block text-[9px] tracking-wide opacity-60">
            {optionLabels[key].tagline}
          </span>
        </>
      ) : (
        <>
          {optionLabels[key].name}
          <span className="ml-1.5 opacity-60">· {optionLabels[key].tagline}</span>
        </>
      )}
    </button>
  );

  return (
    <section ref={sectionRef} className="border-border border-t px-5 py-20 md:px-12 md:py-28">
      <SectionHead icon="day" label="Hour by hour" title="The Day" />

      <div className="mb-8 flex flex-col gap-5">
        <p className="text-muted text-sm leading-relaxed">
          Same journey, two start times. The marked moments below change with your choice —
          everything else stays identical.
        </p>

        {/* Active option made unmistakable — large A/B badge + label, updates
            on toggle so you always know which schedule you are reading. */}
        <div className="border-fg/15 bg-fg/3 flex w-fit items-center gap-4 rounded-xl border p-4">
          <span
            aria-hidden="true"
            className="bg-fg text-bg flex size-12 shrink-0 items-center justify-center rounded-lg font-mono text-2xl font-bold"
          >
            {option.toUpperCase()}
          </span>
          <div className="flex flex-col">
            <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
              Now viewing
            </span>
            <span className="text-fg font-mono text-base font-medium tracking-tight uppercase">
              {optionLabels[option].name} · {optionLabels[option].tagline}
            </span>
          </div>
        </div>

        {/* Desktop toggle (inline). Mobile uses the pinned bottom bar below. */}
        <div
          role="group"
          aria-label="Departure option"
          className="border-border hidden w-fit rounded-full border p-1 md:inline-flex"
        >
          {(['a', 'b'] as const).map(key => optionButton(key, 'inline'))}
        </div>
      </div>

      <Accordion type="single" defaultOpen={dayPhases[0]} className="border-border border-t">
        {dayPhases.map((phase: DayPhase) => (
          <AccordionItem key={phase} value={phase}>
            <AccordionTrigger>
              <span className="flex items-center gap-3">
                <Picto name={phase} className="text-muted" />
                <span>{phase}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="divide-border/60 divide-y">
                {timeline
                  .filter(entry => entry.phase === phase)
                  .map(entry => (
                    <li
                      key={entry.body}
                      className={cn(
                        'grid gap-1 py-3 first:pt-0 md:grid-cols-[9rem_1fr] md:gap-5',
                        // Mark the moments that differ between Option A and B.
                        entry.options && 'border-fg border-l-2 pl-3 md:pl-4',
                      )}
                    >
                      <span className="flex flex-col gap-0.5">
                        {entry.options && (
                          <span className="text-muted font-mono text-[9px] tracking-[0.2em] uppercase">
                            {optionLabels[option].name}
                          </span>
                        )}
                        <span className="text-fg font-mono text-xs tracking-[0.12em] uppercase">
                          {entry.options ? entry.options[option] : entry.label}
                        </span>
                      </span>
                      <span className="text-muted leading-relaxed">{entry.body}</span>
                    </li>
                  ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Mobile: thumb-reachable A/B switch pinned to the bottom of the
          screen while The Day is in view. Hidden on desktop. */}
      <div
        role="group"
        aria-label="Departure option"
        inert={!barVisible}
        className={cn(
          'border-border bg-bg/95 fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t px-3 pt-2 backdrop-blur-sm transition-transform duration-300 md:hidden',
          'pb-[max(0.5rem,env(safe-area-inset-bottom))]',
          barVisible ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        {(['a', 'b'] as const).map(key => optionButton(key, 'bar'))}
      </div>
    </section>
  );
}

/** What is included — twelve categories, tap-to-open, hairline-separated. */
function Included() {
  return (
    <section className="border-border border-t px-5 py-20 md:px-12 md:py-28">
      <SectionHead icon="included" label="Fully accounted for" title="What Is Included" />
      <Accordion type="single" className="border-border border-t">
        {included.map(group => (
          <AccordionItem key={group.title} value={group.title}>
            <AccordionTrigger>
              <span className="flex items-center gap-3">
                <Picto name={group.title} className="text-muted" />
                <span>{group.title}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="divide-border/60 divide-y">
                {group.items.map(item => (
                  <li key={item} className="text-muted py-2 leading-relaxed first:pt-0">
                    {item}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

/** Offer validity — a compact, time-sensitive commercial note from the
 *  client, set apart in a bordered callout. */
function Validity() {
  return (
    <section className="border-border border-t px-5 py-12 md:px-12">
      <div className="border-border bg-fg/3 flex max-w-2xl flex-col gap-3 rounded-xl border p-6">
        <span className="text-muted flex items-center gap-2.5 font-mono text-[10px] tracking-[0.3em] uppercase">
          <Clock size={14} strokeWidth={1.5} aria-hidden="true" /> {offer.tag}
        </span>
        {offer.lines.map(line => (
          <p key={line} className="text-fg/80 text-sm leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}

/** Closing statement on ink — the final word. */
function Closing() {
  return (
    <section className="bg-ink text-on-ink px-5 py-28 md:px-12 md:py-40">
      <Reveal className="flex flex-col gap-10">
        <p className="max-w-4xl font-mono text-[clamp(1.75rem,6vw,4rem)] leading-none font-medium tracking-tight text-balance uppercase">
          {closing.map(line => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        <Link
          to="/"
          className="border-on-ink/30 text-on-ink hover:bg-on-ink hover:text-ink focus-visible:ring-on-ink inline-flex w-fit items-center gap-2.5 rounded-full border px-7 py-3.5 font-mono text-xs tracking-[0.2em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Discover Saw Next
          <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  );
}

// The A/B day-by-day schedule module (<Day/>) is retained but dormant — THE
// ODYSSEY ships as a single programme. Flip to true (and refill the timeline /
// optionLabels in src/data/hiddenShore.ts) to surface a second version.
const SHOW_DAY: boolean = false;

export default function TheHiddenShore() {
  useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);

  const title = `${hiddenShore.title} · ${hiddenShore.subtitle} | ${siteConfig.name}`;
  const description =
    'A private 24-hour birthday experience along the Algarve coast — an exclusive Saw Next experience.';

  return (
    <div className="bg-bg text-fg min-h-screen">
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="noindex, nofollow" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${siteConfig.url}/the-hidden-shore`} />
      <meta property="og:image" content={`${siteConfig.url}/images/sn-og.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={`${siteConfig.url}/images/sn-og.png`} />

      <header
        className="pointer-events-none fixed inset-x-0 top-0 z-100 flex items-center justify-between px-5 py-4 text-white md:px-12 md:py-5"
        style={{ mixBlendMode: 'difference' }}
      >
        <Link to="/" aria-label="Saw Next home" className="pointer-events-auto inline-flex">
          <BrandMark variant="full" className="text-base md:text-lg" />
        </Link>
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Private</span>
      </header>

      <Hero />
      <Facts />
      <Story />
      <Vessel />
      {SHOW_DAY && <Day />}
      <Included />
      <Validity />
      <Closing />

      <footer className="border-border flex items-center justify-between border-t px-5 py-8 md:px-12">
        <BrandMark variant="short" className="text-muted text-sm" />
        <span className="text-muted/70 font-mono text-[10px] tracking-[0.3em] uppercase">
          {hiddenShore.brand}
        </span>
      </footer>
    </div>
  );
}
