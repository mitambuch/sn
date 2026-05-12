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

import { Button } from '@components/ui/Button';
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
      className="relative flex min-h-screen flex-col px-5 pt-20 pb-6 md:px-12 md:pt-20"
    >
      {/* ─── Top meta strip — coordonnées Boudry, terminal-style ─── */}
      <div className="border-border text-muted hidden items-center justify-end gap-4 border-b pb-5 font-mono text-[10px] tracking-widest uppercase md:flex">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="bg-fg inline-block h-1 w-1 rounded-full" />
          {t('landing.hero.topRightGps')}
        </span>
        <span>{t('landing.hero.topRightLoc')}</span>
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

        {/* col 3 : CTAs (desktop) — Button atom variants */}
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
