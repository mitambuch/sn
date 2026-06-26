// ═══════════════════════════════════════════════════
// TheHiddenShore — bespoke private-journey presentation at /the-hidden-shore
//
// WHAT: A standalone, cinematic single-page presentation for one client
//       pitch (a private birthday journey). Dark hero → manifesto → eight
//       editorial "chapters" with two photo plates → an Option A / Option B
//       departure timeline → a full "what is included" index → a closing
//       statement. Reuses the SAW NEXT visual language end-to-end (mono
//       caps headings, ✦ marquees, scroll reveals, monochrome tokens).
// WHEN: /the-hidden-shore — top-level route, outside the locale tree, no
//       layout chrome, self-manages its own <title>/meta (noindex). English
//       only by design — it is a one-off client document, not site content.
// EDIT COPY: src/data/hiddenShore.ts  ·  EDIT PHOTOS: drop two files into
//       public/images/  → hidden-shore-yacht.jpg + hidden-shore-beach.jpg
//       (they appear automatically; no code change needed).
// ═══════════════════════════════════════════════════

import { BrandMark } from '@components/brand/BrandMark';
import { Reveal } from '@components/ui/Reveal';
import { Marquee } from '@features/landing/Marquee';
import { SectionTag } from '@features/landing/SectionTag';
import { cn } from '@utils/cn';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { siteConfig } from '@/config/site';
import {
  type Chapter,
  chapters,
  closing,
  hiddenShore,
  included,
  manifesto,
  type OptionKey,
  optionLabels,
  timeline,
} from '@/data/hiddenShore';

/** A framed photo with a clean monochrome placeholder until the file exists.
 *  Drop the named image into public/images/ and it renders automatically. */
function Plate({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  const [errored, setErrored] = useState(false);
  return (
    <figure className="flex flex-col gap-3">
      <div className="bg-surface relative aspect-[3/2] w-full overflow-hidden">
        {errored ? (
          <div className="text-muted absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase">{caption}</span>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-50">
              Photo to be added
            </span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setErrored(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <figcaption className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
        {caption}
      </figcaption>
    </figure>
  );
}

/** Dark cinematic hero — title, subtitle, meta strip, epigraph. */
function Hero() {
  return (
    <section className="bg-ink relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden px-5 pt-28 pb-8 text-white md:px-12 md:pt-32">
      <SectionTag num="00" label={hiddenShore.brand} className="text-white/70" />

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

      <dl className="grid grid-cols-1 gap-x-12 gap-y-1.5 border-t border-white/20 pt-6 font-mono text-[10px] leading-[1.9] tracking-wider uppercase sm:grid-cols-3">
        {hiddenShore.meta.map(m => (
          <div key={m.label} className="flex justify-between border-b border-white/15 py-1.5">
            <dt className="text-white/55">{m.label}</dt>
            <dd className="font-medium text-white">{m.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Opening thesis — lead line set large, supporting lines beneath. */
function Manifesto() {
  return (
    <section className="px-5 py-28 md:px-12 md:py-40">
      <Reveal className="flex max-w-4xl flex-col gap-8">
        <SectionTag num="01" label={manifesto.tag} />
        <p className="text-fg font-mono text-[clamp(1.5rem,4.2vw,2.75rem)] leading-[1.2] font-medium tracking-[-0.02em] text-balance uppercase">
          {manifesto.lead}
        </p>
        <div className="text-muted flex max-w-2xl flex-col gap-2 text-base leading-[1.7] text-pretty md:text-lg">
          {manifesto.lines.map(line => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/** One editorial chapter — index numeral, title, stacked fragments. */
function ChapterBlock({ chapter }: { chapter: Chapter }) {
  return (
    <Reveal className="border-border grid gap-6 border-t py-16 md:grid-cols-[10rem_1fr] md:gap-12 md:py-20">
      <div className="flex flex-col gap-2">
        <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
          Chapter {chapter.num}
        </span>
        <h2 className="font-mono text-[clamp(1.5rem,4vw,2.25rem)] leading-[1] font-medium tracking-[-0.02em] text-balance uppercase">
          {chapter.title}
        </h2>
      </div>
      <div className="text-muted flex max-w-2xl flex-col gap-1.5 text-base leading-[1.7] text-pretty md:text-lg">
        {chapter.lines.map((line, i) => (
          <Reveal key={line} index={i} step={40} maxStagger={320}>
            <span className="block">{line}</span>
          </Reveal>
        ))}
      </div>
    </Reveal>
  );
}

/** The eight chapters, with the two photo plates woven into the narrative. */
function Chapters() {
  return (
    <section className="px-5 md:px-12">
      {chapters.map((chapter, i) => (
        <div key={chapter.num}>
          <ChapterBlock chapter={chapter} />
          {/* Yacht after "Leaving the Shore" (II), beach after "The Hidden Shore" (IV). */}
          {i === 1 && (
            <Reveal className="py-8 md:py-12">
              <Plate
                src="/images/hidden-shore-yacht.jpg"
                alt="The Azimut 80 Fly cruising along the Algarve coastline"
                caption="Azimut 80 Fly"
              />
            </Reveal>
          )}
          {i === 3 && (
            <Reveal className="py-8 md:py-12">
              <Plate
                src="/images/hidden-shore-beach.jpg"
                alt="The private beach at sunset"
                caption="The Hidden Shore · Private beach"
              />
            </Reveal>
          )}
        </div>
      ))}
    </section>
  );
}

/** Two-option departure schedule — toggle changes only the morning times. */
function Timeline() {
  const [option, setOption] = useState<OptionKey>('a');
  return (
    <section className="border-border border-y px-5 py-24 md:px-12 md:py-32">
      <Reveal className="mb-12 flex flex-col gap-6">
        <SectionTag num="02" label="Experience Timeline" />
        <h2 className="font-mono text-[clamp(1.75rem,5vw,3.5rem)] leading-[0.98] font-medium tracking-[-0.025em] text-balance uppercase">
          One day, two departures
        </h2>
        <p className="text-muted max-w-2xl text-base leading-[1.7] text-pretty md:text-lg">
          The journey is identical. Only the departure time changes — choose the schedule that suits
          the day best.
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
                'rounded-full px-5 py-2.5 font-mono text-[11px] tracking-[0.15em] uppercase transition-colors',
                option === key ? 'bg-fg text-bg' : 'text-muted hover:text-fg',
              )}
            >
              {optionLabels[key].name}
              <span className="ml-2 opacity-60">· {optionLabels[key].tagline}</span>
            </button>
          ))}
        </div>
      </Reveal>

      <ol className="border-border border-t">
        {timeline.map((entry, i) => (
          <Reveal key={entry.body} index={i} step={40} maxStagger={400}>
            <li className="border-border grid gap-2 border-b py-5 md:grid-cols-[12rem_1fr] md:gap-8">
              <span className="text-fg font-mono text-sm tracking-[0.12em] uppercase">
                {entry.options ? entry.options[option] : entry.label}
              </span>
              <span className="text-muted text-base leading-[1.7] text-pretty">{entry.body}</span>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/** Full "what is included" index — one column per service group. */
function Included() {
  return (
    <section className="px-5 py-24 md:px-12 md:py-32">
      <Reveal className="mb-14 flex max-w-3xl flex-col gap-5">
        <SectionTag num="03" label="What Is Included" />
        <h2 className="font-mono text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.02] font-medium tracking-[-0.025em] text-balance uppercase">
          Everything, accounted for
        </h2>
      </Reveal>
      <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {included.map((group, i) => (
          <Reveal key={group.title} index={i} step={50} maxStagger={500}>
            <div className="flex flex-col gap-4">
              <h3 className="border-border text-fg border-b pb-3 font-mono text-sm tracking-[0.12em] uppercase">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {group.items.map(item => (
                  <li
                    key={item}
                    className="text-muted flex gap-3 text-sm leading-relaxed text-pretty"
                  >
                    <span aria-hidden="true" className="text-fg/40 select-none">
                      ·
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** Closing statement on ink — the deck's final word. */
function Closing() {
  return (
    <section className="bg-ink text-on-ink px-5 py-32 md:px-12 md:py-48">
      <Reveal>
        <p className="max-w-4xl font-mono text-[clamp(2rem,7vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.025em] text-balance uppercase">
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
      <Marquee items={hiddenShore.marquee} tone="dark" />
      <Manifesto />
      <Chapters />
      <Marquee items={hiddenShore.marquee} tone="light" />
      <Timeline />
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
