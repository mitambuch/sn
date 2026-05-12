// ═══════════════════════════════════════════════════
// Hero — landing S01 (intro, cinema video bg)
//
// WHAT: Full-viewport opening section. A randomly-picked Cloudinary
//       video plays as silent autoplay loop in the background. The
//       3-line headline uses `mix-blend-mode: difference` against the
//       video — the words appear in pure negative against whatever is
//       behind. One word in line 3 cycles every ~6.5s. Stagger
//       reveal on each line at first paint. Mobile-friendly.
// WHEN: Always the first section of the landing.
// CHANGE CYCLING WORDS: edit CYCLING_WORDS below.
// CHANGE VIDEO POOL: edit HERO_VIDEOS — one is picked at mount.
// ═══════════════════════════════════════════════════

import { Button } from '@components/ui/Button';
import { useCyclingWord } from '@features/landing/useCyclingWord';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CYCLING_WORDS = ['basse', 'tenue', 'feutrée', 'retenue'] as const;

const HERO_VIDEOS = [
  'https://res.cloudinary.com/df5khdkxl/video/upload/v1778623070/hf_20260512_191454_db3c4649-3862-496f-80bb-b4e156496be2_syjjkp.mp4',
  'https://res.cloudinary.com/df5khdkxl/video/upload/v1778623070/hf_20260512_191448_960c9c4f-91ad-4007-95f4-780d6508252f_dxgdjv.mp4',
  'https://res.cloudinary.com/df5khdkxl/video/upload/v1778623071/hf_20260512_194219_4de6b520-bec5-4d8d-b0e0-efd0dc34af08_eojkzr.mp4',
  'https://res.cloudinary.com/df5khdkxl/video/upload/v1778623072/hf_20260512_194210_f78548ea-db87-488c-b92e-5cd0844ce208_lhjtcs.mp4',
  'https://res.cloudinary.com/df5khdkxl/video/upload/v1778623071/hf_20260512_191434_99138e4d-1897-43da-b7cc-c727e965ef3a_npula7.mp4',
  'https://res.cloudinary.com/df5khdkxl/video/upload/v1778623072/hf_20260512_191215_65634274-77d2-4171-830c-d156c1ae2837_bi2bj7.mp4',
] as const;

/** Landing S01 — hero with Cloudinary video bg + mix-blend headline. */
export const Hero = () => {
  const { t } = useTranslation();
  const word = useCyclingWord(CYCLING_WORDS, 6500);

  // Random pick at mount, stable across re-renders (lazy useState init
  // — useMemo would violate react-hooks/purity because Math.random()
  // is impure, but lazy init is allowed by the rule).
  const [videoSrc] = useState(() => {
    const idx = Math.floor(Math.random() * HERO_VIDEOS.length);
    return HERO_VIDEOS[idx] ?? HERO_VIDEOS[0];
  });

  return (
    <section
      id="s01"
      className="relative isolate flex min-h-screen flex-col overflow-hidden px-5 pt-20 pb-6 md:px-12 md:pt-20"
    >
      {/* ─── Video bg ─── */}
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
          maskImage: 'linear-gradient(to bottom, black 0%, black 65%, transparent 96%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 65%, transparent 96%)',
        }}
      />

      {/* ─── Top meta strip — coordonnées Boudry, terminal-style ─── */}
      <div className="border-border text-muted hidden items-center justify-end gap-4 border-b pb-5 font-mono text-[10px] tracking-widest uppercase md:flex">
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="bg-fg inline-block h-1 w-1 rounded-full"
            style={{ animation: 'terminal-pulse 1.4s ease-in-out infinite' }}
          />
          {t('landing.hero.topRightGps')}
        </span>
        <span>{t('landing.hero.topRightLoc')}</span>
      </div>

      {/* ─── Center : headline with mix-blend-difference over video ─── */}
      <div className="relative flex flex-1 items-center pt-20 pb-10">
        <h1
          className="font-mono text-[clamp(2.5rem,9.5vw,9.5rem)] leading-[0.92] font-medium tracking-tight text-white uppercase"
          style={{ mixBlendMode: 'difference' }}
        >
          <span className="hero-line hero-line-1 block">{t('landing.hero.line1')}</span>
          <span className="hero-line hero-line-2 block">{t('landing.hero.line2')}</span>
          <span className="hero-line hero-line-3 block">
            {t('landing.hero.line3prefix')}{' '}
            <span key={word} className="animate-cycling-word inline-block">
              {word}
            </span>
            .
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
