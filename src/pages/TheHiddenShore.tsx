// ═══════════════════════════════════════════════════
// TheHiddenShore — bespoke private-journey presentation at /the-hidden-shore
//
// WHAT: A short, mobile-first, tap-to-open presentation for one client
//       pitch (a private birthday journey). A cinematic cover, an at-a-
//       glance strip, then everything else lives in collapsed accordions
//       (the story in chapters, the day in four acts, what is included by
//       category) so the page is never an endless scroll. Small lucide
//       pictos label each section. No bullet lists — services are
//       separated by hairlines. Reuses the SAW NEXT monochrome visual
//       language end-to-end. A background video for the cover is pending.
// WHEN: /the-hidden-shore — top-level route, outside the locale tree, no
//       layout chrome, self-manages its own <title>/meta (noindex).
//       English only by design — a one-off client document, not site
//       content.
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
  Anchor,
  BellRing,
  BookOpen,
  Building2,
  CalendarDays,
  Camera,
  Car,
  Clock,
  Compass,
  Gift,
  ListChecks,
  type LucideIcon,
  MapPin,
  Moon,
  Music,
  Palette,
  ShieldCheck,
  Ship,
  Sparkles,
  Sun,
  Sunrise,
  UtensilsCrossed,
  Waves,
  Wine,
} from 'lucide-react';
import { useEffect, useState } from 'react';
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
  type OptionKey,
  optionLabels,
  timeline,
} from '@/data/hiddenShore';

/* ─── Picto registry — one map, keyed by chapter numeral / phase name /
   included title / fact label / section. Keeps icons in one place. ─── */
const ICONS: Record<string, LucideIcon> = {
  // Chapters
  I: Car,
  II: Ship,
  III: Waves,
  IV: MapPin,
  V: Moon,
  VI: Music,
  VII: Palette,
  VIII: Sunrise,
  // Day acts
  'Afternoon at Sea': Sun,
  'The Hidden Shore': MapPin,
  'The Celebration': Music,
  Sunrise: Sunrise,
  // Included groups
  'Private Yacht': Ship,
  'Maritime Operations': Anchor,
  'Ground Transportation': Car,
  'Exclusive Venue': MapPin,
  'Event Design': Sparkles,
  Gastronomy: UtensilsCrossed,
  'Premium Bar': Wine,
  Entertainment: Music,
  Security: ShieldCheck,
  Media: Camera,
  'Signature Gift': Gift,
  'Concierge & Production': BellRing,
  // Facts
  Destination: MapPin,
  Dates: CalendarDays,
  Yacht: Ship,
  'Shore venue': Building2,
  // Sections + journey
  'The Journey': Compass,
  story: BookOpen,
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

/** Cover — title, subtitle, location/dates, epigraph. One screen. */
function Hero() {
  return (
    <section className="bg-ink relative isolate flex min-h-svh flex-col justify-between overflow-hidden px-5 pt-28 pb-10 text-white md:px-12 md:pt-32">
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
        <p className="mt-8 max-w-xl font-mono text-sm tracking-[0.2em] text-white/75 uppercase">
          {hiddenShore.location} &nbsp;·&nbsp; {hiddenShore.dates}
        </p>
        <p className="mt-10 max-w-md text-lg leading-relaxed text-pretty text-white/85">
          {hiddenShore.epigraph.map(line => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>

      <span className="font-mono text-[10px] tracking-[0.3em] text-white/45 uppercase">
        Scroll · tap to open
      </span>
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

/** The story — manifesto + eight chapters, each tap-to-open. */
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
            <div className="text-fg/75 flex flex-col gap-2 leading-[1.7]">
              {manifesto.lines.map(line => (
                <span key={line}>{line}</span>
              ))}
            </div>
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
              <div className="text-fg/75 flex flex-col gap-2 leading-[1.7]">
                {chapter.lines.map(line => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

/** The day — A/B departure toggle + four acts, each tap-to-open. */
function Day() {
  const [option, setOption] = useState<OptionKey>('a');
  return (
    <section className="border-border border-t px-5 py-20 md:px-12 md:py-28">
      <SectionHead icon="day" label="Hour by hour" title="The Day" />

      <div className="mb-8 flex flex-col gap-3">
        <p className="text-muted text-sm leading-relaxed">
          Same journey, two start times — pick the schedule that suits the day.
        </p>
        <div
          role="group"
          aria-label="Departure option"
          className="border-border inline-flex w-fit rounded-full border p-1"
        >
          {(['a', 'b'] as const).map(key => (
            <button
              key={key}
              type="button"
              onClick={() => setOption(key)}
              aria-pressed={option === key}
              className={cn(
                'rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors',
                option === key ? 'bg-fg text-bg' : 'text-muted hover:text-fg',
              )}
            >
              {optionLabels[key].name}
              <span className="ml-1.5 opacity-60">· {optionLabels[key].tagline}</span>
            </button>
          ))}
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
                      className="grid gap-1 py-3 first:pt-0 md:grid-cols-[7rem_1fr] md:gap-5"
                    >
                      <span className="text-fg font-mono text-xs tracking-[0.12em] uppercase">
                        {entry.options ? entry.options[option] : entry.label}
                      </span>
                      <span className="text-muted leading-relaxed">{entry.body}</span>
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

/** Closing statement on ink — the final word. */
function Closing() {
  return (
    <section className="bg-ink text-on-ink px-5 py-28 md:px-12 md:py-40">
      <Reveal>
        <p className="max-w-4xl font-mono text-[clamp(1.75rem,6vw,4rem)] leading-none font-medium tracking-tight text-balance uppercase">
          {closing.map(line => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </Reveal>
    </section>
  );
}

export default function TheHiddenShore() {
  useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);

  const title = `${hiddenShore.title} · ${hiddenShore.subtitle} | ${siteConfig.name}`;
  const description =
    'A private, one-of-one birthday journey along the Algarve coastline — an exclusive Saw Next experience.';

  return (
    <div className="bg-bg text-fg min-h-screen">
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="noindex, nofollow" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${siteConfig.url}/the-hidden-shore`} />

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
      <Day />
      <Included />
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
