// ═══════════════════════════════════════════════════
// Hero — landing S01 (intro)
//
// WHAT: Full-viewport opening section. Three-line headline with one cycling
//       word inside line 3 ("voix [basse|tenue|feutrée|retenue]"). Top
//       meta strip (mockup version + GPS), bottom three-column meta strip
//       (structure list + champ d'action paragraph + CTAs).
// WHEN: Always the first section of the landing.
// CHANGE CYCLING WORDS: edit CYCLING_WORDS below — must stay in the same
//       semantic register (brand voice: retenue suisse-bancaire).
// ═══════════════════════════════════════════════════

import { useCyclingWord } from '@features/landing/useCyclingWord';
import { useTranslation } from 'react-i18next';

const CYCLING_WORDS = ['basse', 'tenue', 'feutrée', 'retenue'] as const;

/** Landing S01 — hero opening with cycling headline word. */
export const Hero = () => {
  const { t } = useTranslation();
  const word = useCyclingWord(CYCLING_WORDS, 4000);

  return (
    <section
      id="s01"
      className="relative flex min-h-screen flex-col px-5 pt-14 pb-6 md:px-12 md:pt-14"
    >
      {/* ─── Top meta strip ─── */}
      <div className="border-border grid grid-cols-1 items-center gap-2 border-b pb-5 font-mono text-[10px] tracking-[0.1em] uppercase md:grid-cols-[1fr_auto_1fr]">
        <span className="text-muted">{t('landing.hero.topLeft')}</span>
        <span className="text-fg hidden font-semibold md:inline">
          {t('landing.hero.topCenter')}
        </span>
        <span className="text-muted hidden items-center justify-end gap-4 md:flex">
          <span className="bg-fg inline-flex items-center gap-1.5 before:inline-block before:h-1 before:w-1 before:rounded-full before:bg-current before:content-['']">
            <span>{t('landing.hero.topRightGps')}</span>
          </span>
          <span>{t('landing.hero.topRightLoc')}</span>
        </span>
      </div>

      {/* ─── Side vertical mark (desktop) ─── */}
      <span
        aria-hidden="true"
        className="text-muted absolute top-20 right-3 hidden font-mono text-[9px] tracking-[0.15em] uppercase md:block"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        {t('landing.hero.sideMark')}
      </span>

      {/* ─── Center : headline ─── */}
      <div className="relative flex flex-1 items-center pt-20 pb-10">
        <h1 className="font-mono text-[clamp(2.5rem,9.5vw,9.5rem)] leading-[0.92] font-medium tracking-[-0.035em] uppercase">
          <span className="block">{t('landing.hero.line1')}</span>
          <span className="block">{t('landing.hero.line2')}</span>
          <span className="block pl-0 font-light italic md:pl-[18%]">
            {t('landing.hero.line3prefix')}{' '}
            <span
              key={word}
              className="animate-cycling-word inline-block transition-opacity duration-300 ease-out"
            >
              {word}
            </span>
            .
          </span>
        </h1>
      </div>

      {/* ─── Bottom 3-col meta strip ─── */}
      <div className="border-border grid grid-cols-1 items-end gap-8 border-t pt-8 md:grid-cols-[1fr_1.5fr_auto] md:gap-12">
        {/* col 1 : structure list */}
        <div className="flex flex-col gap-3.5">
          <span className="text-muted font-mono text-[10px] tracking-[0.1em] uppercase">
            ↘ {t('landing.hero.metaStructureLabel')}
          </span>
          <dl className="font-mono text-[10px] leading-[1.9] tracking-[0.05em] uppercase">
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

        {/* col 2 : champ d'action paragraph */}
        <div className="flex flex-col gap-3.5">
          <span className="text-muted font-mono text-[10px] tracking-[0.1em] uppercase">
            ↘ {t('landing.hero.metaFieldLabel')}
          </span>
          <p className="text-fg max-w-[460px] text-sm leading-relaxed">
            {t('landing.hero.metaFieldText')}
          </p>
        </div>

        {/* col 3 : CTAs (desktop) */}
        <div className="hidden flex-col gap-2 md:flex">
          <a
            href="#s08"
            className="border-fg bg-fg text-bg hover:bg-bg hover:text-fg inline-flex items-center gap-2.5 border px-5 py-3 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors"
          >
            {t('landing.cta.requestAccess')}
            <span aria-hidden="true">↗</span>
          </a>
          <a
            href="#s08"
            className="border-fg text-fg hover:bg-fg hover:text-bg inline-flex items-center gap-2.5 border px-5 py-3 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors"
          >
            {t('landing.cta.privateArea')}
            <span aria-hidden="true">↗</span>
          </a>
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
