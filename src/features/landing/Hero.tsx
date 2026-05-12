// ═══════════════════════════════════════════════════
// Hero — landing S01 (terminal typewriter + cycling video bg)
//
// WHAT: Full-viewport opening section. A Cloudinary video plays as
//       silent autoplay background ; on each phrase change, a new
//       random video from the pool replaces the previous one. The
//       single-line headline TYPES OUT one of 8 phrases (60ms/char),
//       HOLDS for 2.4s with a blinking caret, then ERASES (32ms/char)
//       before the next phrase. Headline is in mix-blend-difference
//       so the text auto-inverts against any video frame.
// WHEN: Always the first section of the landing.
// CHANGE PHRASES: edit landing.hero.cyclePhrases.cp1..cp8 in i18n.
// CHANGE VIDEO POOL: edit HERO_VIDEOS — random one per phrase.
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
const TYPE_SPEED_MS = 60;
const ERASE_SPEED_MS = 32;
const HOLD_MS = 2400;

type TypewriterPhase = 'typing' | 'holding' | 'erasing';

/** Landing S01 — typewriter hero over cycling video bg. */
export const Hero = () => {
  const { t } = useTranslation();
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<TypewriterPhase>('typing');

  // Random video at mount (lazy init, useState — react-hooks/purity safe).
  const [videoSrc, setVideoSrc] = useState<string>(() => {
    const idx = Math.floor(Math.random() * HERO_VIDEOS.length);
    return HERO_VIDEOS[idx] ?? HERO_VIDEOS[0];
  });

  // Typewriter loop : type → hold → erase → next phrase → repeat.
  // All state updates routed via setTimeout to satisfy React 19's
  // `react-hooks/set-state-in-effect` rule (no synchronous setState
  // in effect bodies).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = PHRASE_KEYS[phraseIdx] ?? 'cp1';
    const fullText = t(`landing.hero.cyclePhrases.${key}`);
    let timer: number;

    if (phase === 'typing') {
      if (text.length < fullText.length) {
        timer = window.setTimeout(() => {
          setText(fullText.slice(0, text.length + 1));
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
  }, [text, phase, phraseIdx, t]);

  // Swap to a different random video on each phrase change.
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
      {/* ─── Video bg — swaps on each phrase change ─── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        src={videoSrc}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 88%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 88%, transparent 100%)',
        }}
      />

      {/* ─── Top meta strip — coordonnées Boudry, in negative over video ─── */}
      <div
        className="hidden items-center justify-end gap-4 border-b border-white pb-5 font-mono text-[10px] tracking-widest text-white uppercase md:flex"
        style={{ mixBlendMode: 'difference' }}
      >
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

      {/* ─── Center : typewriter headline with mix-blend-difference ─── */}
      <div className="relative flex flex-1 items-center pt-20 pb-10">
        <h1
          className="font-mono text-[clamp(1.75rem,5.5vw,5.5rem)] leading-[1.05] font-medium tracking-tight text-white uppercase"
          style={{ mixBlendMode: 'difference' }}
          aria-live="polite"
        >
          {text}
          <span aria-hidden="true" className="caret-blink ml-1 inline-block align-baseline">
            ▎
          </span>
        </h1>
      </div>

      {/* ─── Bottom 3-col meta strip ─── */}
      <div className="border-border grid grid-cols-1 items-end gap-8 border-t pt-8 md:grid-cols-[1fr_1.5fr_auto] md:gap-12">
        <div className="flex flex-col gap-3.5">
          <span className="text-muted font-mono text-[10px] tracking-widest uppercase">
            ↘ {t('landing.hero.metaStructureLabel')}
          </span>
          <dl className="font-mono text-[10px] leading-[1.9] tracking-wider uppercase">
            <MetaRow term={t('landing.hero.metaType')} value={t('landing.hero.metaTypeValue')} />
            <MetaRow
              term={t('landing.hero.metaStatus')}
              value={t('landing.hero.metaStatusValue')}
            />
            <MetaRow term={t('landing.hero.metaModel')} value={t('landing.hero.metaModelValue')} />
            <MetaRow
              term={t('landing.hero.metaEstablished')}
              value={t('landing.hero.metaEstablishedValue')}
            />
          </dl>
        </div>

        <div className="flex flex-col gap-3.5">
          <span className="text-muted font-mono text-[10px] tracking-widest uppercase">
            ↘ {t('landing.hero.metaFieldLabel')}
          </span>
          <p className="text-fg max-w-115 text-sm leading-relaxed">
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
            className="font-mono text-xs tracking-widest uppercase"
          >
            {t('landing.cta.contactDirect')}
            <span aria-hidden="true">↗</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

const MetaRow = ({ term, value }: { term: string; value: string }) => (
  <div className="border-border flex justify-between border-b py-1.5">
    <dt className="text-muted">{term}</dt>
    <dd className="text-fg font-medium">{value}</dd>
  </div>
);
