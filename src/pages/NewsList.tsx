// ═══════════════════════════════════════════════════
// NewsList — /:locale/account/news
// Editorial timeline of articles, filter by kind.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { CardSkeleton } from '@components/ui/CardSkeleton';
import { FilterBar } from '@components/ui/FilterBar';
import { Reveal } from '@components/ui/Reveal';
import { SectionHeader } from '@components/ui/SectionHeader';
import { ROUTES } from '@constants/routes';
import { CatalogueProactiveBanner } from '@features/catalogue/CatalogueProactiveBanner';
import { ArticleCard } from '@features/news/ArticleCard';
import { useFakeLoading } from '@hooks/useFakeLoading';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { listArticles } from '@/mocks';
import type { ArticleKind } from '@/types/article';

export default function NewsList() {
  const { t, i18n } = useTranslation();
  const { localePath } = useLocale();
  const all = useMemo(() => listArticles(), []);
  const loading = useFakeLoading(450);

  const [activeKinds, setActiveKinds] = useState<Set<ArticleKind>>(new Set());
  const toggleKind = (k: ArticleKind) => {
    setActiveKinds(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const filtered = activeKinds.size === 0 ? all : all.filter(a => activeKinds.has(a.kind));
  const allKinds = Array.from(new Set(all.map(a => a.kind)));

  return (
    <Container size="xl">
      <div className="space-y-12 py-12">
        <SectionHeader
          eyebrow={t('account.eyebrow')}
          title={t('account.news.title')}
          lede={t('account.news.lede')}
          size="md"
          as="h1"
        />

        <FilterBar>
          {allKinds.map(k => (
            <FilterBar.Chip
              key={k}
              label={t(`articles.kind.${k}`)}
              selected={activeKinds.has(k)}
              onToggle={() => toggleKind(k)}
            />
          ))}
          <FilterBar.Reset
            label={t('common.reset')}
            onReset={() => setActiveKinds(new Set())}
            visible={activeKinds.size > 0}
          />
        </FilterBar>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} ratio="3/2" />)
            : filtered.map((a, i) => (
                <Reveal key={a.id} index={i}>
                  <ArticleCard
                    article={a}
                    href={localePath(ROUTES.ACCOUNT_NEWS + '/' + a.slug)}
                    kindLabel={t(`articles.kind.${a.kind}`)}
                    locale={i18n.language}
                    readMinutesLabel={t('articles.readMinutes')}
                  />
                </Reveal>
              ))}
        </div>

        {!loading && (
          <p className="text-muted text-xs tracking-widest uppercase">
            {t('common.showing', { count: filtered.length })}
          </p>
        )}

        <CatalogueProactiveBanner />
      </div>
    </Container>
  );
}
