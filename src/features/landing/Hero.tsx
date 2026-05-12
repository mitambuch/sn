// ═══════════════════════════════════════════════════
// Hero — landing S01 (typewriter + key-word negative + video cycle)
//
// WHAT: Full-viewport opening. A Cloudinary video plays autoplay-loop-
//       muted in the background ; on each phrase change, a new random
//       video swaps in. A dark overlay (bg-black/35) dims the video so
//       the text stays readable everywhere. The headline TYPES OUT one
//       of 8 phrases (90ms/char), HOLDS 4.5s with blinking caret, then
//       ERASES (50ms/char) before the next phrase. Each phrase has
//       ONE key word rendered in `mix-blend-mode: difference` — the
//       rest stays plain white, only the key word inverts against the
//       video. text-wrap: balance keeps the line break in 2 lines.
//       All meta (GPS coords + structure dl + champ d'action + CTAs)
//       sits in the bottom strip — center is reserved for the
//       typewriter alone.
// WHEN: Always the first section of the landing.
// CHANGE PHRASES: edit landing.hero.cyclePhrases.cpN.{before,highlight,
//       after} in i18n.
// ═══════════════════════════════════════════════════

import { Button } from '@components/ui/Button';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const HERO_VIDEOS = [
  'https://res.cloudinary.com/df5khdkxl/video/upload/v1778623070/hf_20260512_191454_db3c4649-3862-496f-80bb-b4e156496be2_syjjkp.mp4',
  'https://res.cloudinary.com/df5khdkxl/video/upload/v1778623070/hf_20260512_191448_960c9c4f-91ad-4007-95f4-780d6508252f_dxgdjv.mp4',
  'https://res.cloudinary.com/df5khdkxl/video/upload/v1778623071/hf_20260512_194219_4de6b520-bec5-4d8d-b0e0-efd0dc34af08_eojkzr.mp4',
  'https://res.cloudinary.com/df5khdkxl/video/upload/v1778623072/hf_20260512_194210_f78548ea-db87-488c-b92e-5cd0844ce208_lhjtcs.mp4',
  'https://res.cloudinary.com/df5khdkxl/video/upload/v1778623071/hf_20260512_191434_99138e4d-1897-43da-b7cc-c727e965ef3a_npula7.mp4',
  'https://res.cloudinary.com/df5khdkxl/video/upload/v1778623072/hf_20260512_191215_65634274-77d2-4171-830c-d156c1ae2837_bi2bj7.mp4',
] as const;

const PHRASE_KEYS = ['cp1', 'cp2', 'cp3', 'cp4', 'cp5', 'cp6', 'cp7', 'cp8'] as const;
const TYPE_SPEED_MS = 90;
const ERASE_SPEED_MS = 50;
const HOLD_MS = 4500;

type TypewriterPhase = 'typing' | 'holding' | 'erasing';
interface PhraseParts {
  before: string;
  highlight: string;
  after: string;
}

function fullPhrase(p: PhraseParts): string {
  return p.before + p.highlight + p.after;
}

/** Landing S01 — typewriter hero over cycling video bg. */
export const Hero = () => {
  const { t } = useTranslation();
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<TypewriterPhase>('typing');

  const [videoSrc, setVideoSrc] = useState<string>(() => {
    const idx = Math.floor(Math.random() * HERO_VIDEOS.length);
    return HERO_VIDEOS[idx] ?? HERO_VIDEOS[0];
  });

  const key = PHRASE_KEYS[phraseIdx] ?? 'cp1';
  const parts = t(`landing.hero.cyclePhrases.${key}`, { returnObjects: true }) as PhraseParts;
  const full = fullPhrase(parts);

  // Typewriter loop : type → hold → erase → next phrase → repeat.
  // All setState routed via setTimeout (React 19 set-state-in-effect rule).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let timer: number;

    if (phase === 'typing') {
      if (text.length < full.length) {
        timer = window.setTimeout(() => {
          setText(full.slice(0, text.length + 1));
        }, TYPE_SPEED_MS);
      } else {
        timer = window.setTimeout(() => {
          setPhase('holding');
        }, 0);
      }
    } else if (phase === 'holding') {
      timer = window.setTimeout(() => {
        setPhase('erasing');
      }, HOLD_MS);
    } else if (text.length > 0) {
      timer = window.setTimeout(() => {
        setText(text.slice(0, -1));
      }, ERASE_SPEED_MS);
    } else {
      timer = window.setTimeout(() => {
        setPhraseIdx(i => (i + 1) % PHRASE_KEYS.length);
        setPhase('typing');
      }, 0);
    }

    return () => {
      window.clearTimeout(timer);
    };
  }, [text, phase, full]);

  // Swap to a random video on each phrase change.
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const idx = Math.floor(Math.random() * HERO_VIDEOS.length);
    setVideoSrc(HERO_VIDEOS[idx] ?? HERO_VIDEOS[0]);
  }, [phraseIdx]);

  return (
    <section
      id="s01"
      className="relative isolate flex min-h-screen flex-col overflow-hidden px-5 pt-20 pb-6 md:px-12 md:pt-20"
    >
      {/* ─── Video bg (full height, no mask) ─── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        src={videoSrc}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* ─── Dark overlay — dims video enough that white text reads ─── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-black/35" />

      {/* ─── Center : typewriter headline, key word in negative ─── */}
      <div className="relative flex flex-1 items-center pt-10 pb-10">
        <h1
          className="max-w-5xl font-mono text-[clamp(2rem,5.5vw,5.5rem)] leading-[1.15] font-medium tracking-tight text-balance text-white uppercase"
          aria-live="polite"
        >
          <TypewriterRender parts={parts} text={text} />
          <span aria-hidden="true" className="caret-blink ml-1 inline-block align-baseline">
            ▎
          </span>
        </h1>
      </div>

      {/* ─── Bottom strip — GPS row + 3-col meta + CTAs (all here now) ─── */}
      <div className="relative flex flex-col gap-6 border-t border-white/25 pt-6">
        {/* GPS hairline row */}
        <div className="hidden items-center justify-end gap-4 font-mono text-[10px] tracking-widest text-white/80 uppercase md:flex">
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block h-1 w-1 rounded-full bg-white"
              style={{ animation: 'terminal-pulse 1.4s ease-in-out infinite' }}
            />
            {t('landing.hero.topRightGps')}
          </span>
          <span>{t('landing.hero.topRightLoc')}</span>
        </div>

        {/* 3-col meta */}
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-[1fr_1.5fr_auto] md:gap-12">
          <div className="flex flex-col gap-3.5">
            <span className="font-mono text-[10px] tracking-widest text-white/60 uppercase">
              ↘ {t('landing.hero.metaStructureLabel')}
            </span>
            <dl className="font-mono text-[10px] leading-[1.9] tracking-wider text-white/85 uppercase">
              <MetaRow term={t('landing.hero.metaType')} value={t('landing.hero.metaTypeValue')} />
              <MetaRow
                term={t('landing.hero.metaStatus')}
                value={t('landing.hero.metaStatusValue')}
              />
              <MetaRow
                term={t('landing.hero.metaModel')}
                value={t('landing.hero.metaModelValue')}
              />
              <MetaRow
                term={t('landing.hero.metaEstablished')}
                value={t('landing.hero.metaEstablishedValue')}
              />
            </dl>
          </div>

          <div className="flex flex-col gap-3.5">
            <span className="font-mono text-[10px] tracking-widest text-white/60 uppercase">
              ↘ {t('landing.hero.metaFieldLabel')}
            </span>
            <p className="max-w-115 text-sm leading-relaxed text-white">
              {t('landing.hero.metaFieldText')}
            </p>
          </div>

          <div className="hidden flex-col gap-2 md:flex">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                document.getElementById('s08')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="font-mono text-xs tracking-widest uppercase"
            >
              {t('landing.cta.requestAccess')}
              <span aria-hidden="true">↗</span>
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                document.getElementById('s09')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="font-mono text-xs tracking-widest text-white uppercase"
            >
              {t('landing.cta.contactDirect')}
              <span aria-hidden="true">↗</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

/** Renders the typewriter text with the highlight word in `mix-blend
 *  difference` once typing reaches it. Slices `text` into the visible
 *  portion of before / highlight / after based on cumulative length. */
const TypewriterRender = ({ parts, text }: { parts: PhraseParts; text: string }) => {
  const beforeLen = parts.before.length;
  const highlightLen = parts.highlight.length;
  const len = text.length;

  if (len <= beforeLen) {
    return <span>{text}</span>;
  }

  if (len <= beforeLen + highlightLen) {
    return (
      <>
        <span>{parts.before}</span>
        <span style={{ mixBlendMode: 'difference' }}>{text.slice(beforeLen)}</span>
      </>
    );
  }

  return (
    <>
      <span>{parts.before}</span>
      <span style={{ mixBlendMode: 'difference' }}>{parts.highlight}</span>
      <span>{text.slice(beforeLen + highlightLen)}</span>
    </>
  );
};

const MetaRow = ({ term, value }: { term: string; value: string }) => (
  <div className="flex justify-between border-b border-white/20 py-1.5">
    <dt className="text-white/60">{term}</dt>
    <dd className="font-medium text-white">{value}</dd>
  </div>
);
