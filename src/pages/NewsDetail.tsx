// ═══════════════════════════════════════════════════
// NewsDetail — /:locale/account/news/:slug
// Full editorial article with hero + body + "Découvrir" → related item.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { GalleryGrid } from '@components/ui/GalleryGrid';
import { Image } from '@components/ui/Image';
import { SectionHeader } from '@components/ui/SectionHeader';
import { VideoPlayer } from '@components/ui/VideoPlayer';
import { ROUTES } from '@constants/routes';
import { useSanityItem } from '@hooks/useSanityItem';
import { cn } from '@utils/cn';
import { humanizeToken } from '@utils/humanizeToken';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useParams } from 'react-router-dom';

import { GROQ_ARTICLE_DETAIL } from '@/lib/sanityQueries';
import { getArticle } from '@/mocks';
import type { Article, ArticleMedia } from '@/types/article';

const RELATED_ROUTE_BY_MODULE = {
  property: ROUTES.ACCOUNT_PROPERTIES,
  timepiece: ROUTES.ACCOUNT_TIMEPIECES,
  artwork: ROUTES.ACCOUNT_ARTWORKS,
  event: ROUTES.ACCOUNT_EVENTS,
  journey: ROUTES.ACCOUNT_JOURNEYS,
  concierge: ROUTES.ACCOUNT_CONCIERGE,
} as const;

export default function NewsDetail() {
  const { t, i18n } = useTranslation();
  const { localePath } = useLocale();
  const { slug } = useParams<{ slug: string }>();

  const mockArticle = slug ? getArticle(slug) : null;
  const { data: article } = useSanityItem<Article>({
    query: slug ? GROQ_ARTICLE_DETAIL(slug) : '',
    gateModule: 'article',
    gateSlug: slug,
    fallback: mockArticle ?? null,
  });
  if (!article) return <Navigate to={localePath(ROUTES.ACCOUNT_NEWS)} replace />;

  const dateLabel = new Date(article.publishedAt).toLocaleDateString(i18n.language, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // kind: mock enum → i18n label; Sanity category value with no key → humanise.
  const kindKey = `articles.kind.${article.kind}`;
  const kindLabel = i18n.exists(kindKey) ? t(kindKey) : humanizeToken(article.kind);

  const relatedHref = article.relatedItem
    ? localePath(
        RELATED_ROUTE_BY_MODULE[article.relatedItem.module] + '/' + article.relatedItem.slug,
      )
    : null;

  const media = article.gallery ?? [];
  const galleryImages = media.flatMap(m =>
    m.kind === 'image' ? [{ src: m.src, alt: m.alt }] : [],
  );
  const galleryVideos = media.filter(
    (m): m is Extract<ArticleMedia, { kind: 'video' | 'embed' }> => m.kind !== 'image',
  );

  return (
    <Container size="lg">
      <article className="space-y-12 py-12">
        <header className="space-y-4">
          <span className="text-muted text-xs tracking-widest uppercase">
            {kindLabel} · {dateLabel} · {String(article.readMinutes)} {t('articles.readMinutes')}
          </span>
          <SectionHeader title={article.title} lede={article.excerpt} size="lg" as="h1" />
        </header>

        <Image
          src={article.cover.src}
          alt={article.cover.alt}
          ratio="3/2"
          eager
          wrapperClassName="rounded-lg"
        />

        <div className="prose-editorial mx-auto max-w-3xl">
          <p className="text-fg text-lg leading-relaxed text-pretty">{article.body}</p>
        </div>

        {media.length > 0 && (
          <section className="mx-auto max-w-3xl space-y-8">
            <SectionHeader title={t('articles.media')} size="sm" as="h2" />
            {galleryImages.length > 0 && <GalleryGrid images={galleryImages} />}
            {galleryVideos.length > 0 && (
              <div className="space-y-8">
                {galleryVideos.map(v => (
                  <VideoPlayer key={v.kind === 'embed' ? v.url : v.src} {...v} />
                ))}
              </div>
            )}
          </section>
        )}

        {relatedHref && (
          <aside className="border-border bg-surface/40 mx-auto flex max-w-3xl flex-col gap-3 rounded-lg border p-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-muted text-xs tracking-widest uppercase">
                {t('articles.related')}
              </span>
              <span className="text-fg text-base">
                {t(
                  `account.nav.${article.relatedItem!.module === 'property' ? 'properties' : article.relatedItem!.module === 'timepiece' ? 'timepieces' : article.relatedItem!.module === 'artwork' ? 'artworks' : article.relatedItem!.module === 'event' ? 'events' : article.relatedItem!.module === 'journey' ? 'journeys' : 'concierge'}`,
                )}
              </span>
            </div>
            <Link
              to={relatedHref}
              className={cn(
                'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
                'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
                'duration-base transition-[border-color,background-color]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              )}
            >
              {t('common.discover')}
              <span aria-hidden="true">→</span>
            </Link>
          </aside>
        )}

        <Link
          to={localePath(ROUTES.ACCOUNT_NEWS)}
          className="text-muted hover:text-fg duration-base mx-auto inline-flex max-w-3xl items-center gap-2 text-xs tracking-widest uppercase transition-colors"
        >
          ← {t('common.back')}
        </Link>
      </article>
    </Container>
  );
}
