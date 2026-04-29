// ═══════════════════════════════════════════════════
// IntentCards — dashboard "I'd like to..." prompt grid
//
// WHAT: 4 large bordered cards proposing canonical intents to a
//       member. Each card opens a tailored drawer:
//       · Travel (free-form)
//       · Object search (free-form)
//       · Event organize (free-form)
//       · Private jet (structured form)
// WHEN: Mounted in AccountDashboard above "Recently added".
// ═══════════════════════════════════════════════════

import { FreeFormInquiryDrawer } from '@features/inquiry/FreeFormInquiryDrawer';
import { JetCharterDrawer } from '@features/jet/JetCharterDrawer';
import { cn } from '@utils/cn';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Intent = 'travel' | 'object-search' | 'event-organize' | 'jet';

const SOURCE_BY_INTENT = {
  travel: 'journey',
  'object-search': 'object-search',
  'event-organize': 'event-organize',
  jet: 'jet',
} as const;

interface IntentCardProps {
  eyebrow: string;
  title: string;
  hint: string;
  onClick: () => void;
}

const IntentCard = ({ eyebrow, title, hint, onClick }: IntentCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'group border-border bg-surface/40 hover:border-fg/50 hover:bg-surface flex flex-col gap-3 rounded-lg border p-6 text-left',
      'duration-base transition-[border-color,background-color,transform]',
      'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
      'motion-safe:hover:-translate-y-0.5',
    )}
  >
    <span className="text-muted text-xs tracking-widest uppercase">{eyebrow}</span>
    <span className="text-fg text-lg font-light">{title}</span>
    <span className="text-muted text-sm leading-relaxed">{hint}</span>
    <span
      aria-hidden="true"
      className="text-muted group-hover:text-fg duration-base mt-2 text-xs tracking-widest uppercase transition-colors"
    >
      →
    </span>
  </button>
);

export const IntentCards = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState<Intent | null>(null);

  const close = () => setActive(null);

  return (
    <>
      <section aria-labelledby="intent-heading" className="space-y-6">
        <div className="flex items-end justify-between">
          <h2 id="intent-heading" className="text-fg text-2xl font-light">
            {t('account.intent.heading')}
          </h2>
          <span className="text-muted text-xs tracking-widest uppercase">
            {t('account.intent.subheading')}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <IntentCard
            eyebrow={t('account.intent.travel.eyebrow')}
            title={t('account.intent.travel.title')}
            hint={t('account.intent.travel.hint')}
            onClick={() => setActive('travel')}
          />
          <IntentCard
            eyebrow={t('account.intent.object.eyebrow')}
            title={t('account.intent.object.title')}
            hint={t('account.intent.object.hint')}
            onClick={() => setActive('object-search')}
          />
          <IntentCard
            eyebrow={t('account.intent.event.eyebrow')}
            title={t('account.intent.event.title')}
            hint={t('account.intent.event.hint')}
            onClick={() => setActive('event-organize')}
          />
          <IntentCard
            eyebrow={t('account.intent.jet.eyebrow')}
            title={t('account.intent.jet.title')}
            hint={t('account.intent.jet.hint')}
            onClick={() => setActive('jet')}
          />
        </div>
      </section>

      {active && active !== 'jet' && (
        <FreeFormInquiryDrawer
          open
          onClose={close}
          source={SOURCE_BY_INTENT[active]}
          intentTitle={t(
            `account.intent.${active === 'object-search' ? 'object' : active === 'event-organize' ? 'event' : 'travel'}.drawerTitle`,
          )}
          intentLede={t(
            `account.intent.${active === 'object-search' ? 'object' : active === 'event-organize' ? 'event' : 'travel'}.drawerLede`,
          )}
          placeholder={t(
            `account.intent.${active === 'object-search' ? 'object' : active === 'event-organize' ? 'event' : 'travel'}.placeholder`,
          )}
        />
      )}

      <JetCharterDrawer open={active === 'jet'} onClose={close} />
    </>
  );
};
