// ═══════════════════════════════════════════════════
// ArtworkDetail — /:locale/account/artworks/:slug
//
// Œuvre dominante full-bleed, artist mini-bio, MetaList specsheet,
// provenance + exhibitions lists, "Express interest" CTA.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { GalleryGrid } from '@components/ui/GalleryGrid';
import { Image } from '@components/ui/Image';
import { MetaList } from '@components/ui/MetaList';
import { PriceTag } from '@components/ui/PriceTag';
import { SectionHeader } from '@components/ui/SectionHeader';
import { Timeline } from '@components/ui/Timeline';
import { ROUTES } from '@constants/routes';
import { SimilarItemsStrip } from '@features/catalogue/SimilarItemsStrip';
import { AudioNote } from '@features/concierge/AudioNote';
import { InquiryDrawer } from '@features/inquiry/InquiryDrawer';
import { useSanityItem } from '@hooks/useSanityItem';
import { cn } from '@utils/cn';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useParams } from 'react-router-dom';

import { GROQ_ARTWORK_DETAIL } from '@/lib/sanityQueries';
import { getArtwork } from '@/mocks';
import type { Artwork } from '@/types/artwork';

export default function ArtworkDetail() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const mockArtwork = slug ? getArtwork(slug) : null;
  const { data: artwork } = useSanityItem<Artwork>({
    query: slug ? GROQ_ARTWORK_DETAIL(slug) : '',
    gateModule: 'artwork',
    gateSlug: slug,
    fallback: mockArtwork ?? null,
  });
  if (!artwork) return <Navigate to={localePath(ROUTES.ACCOUNT_ARTWORKS)} replace />;

  const dim = `${String(artwork.dimensions.heightCm)} × ${String(artwork.dimensions.widthCm)}${
    artwork.dimensions.depthCm ? ` × ${String(artwork.dimensions.depthCm)}` : ''
  } cm`;

  const meta = [
    { label: t('artworks.meta.artist'), value: artwork.artistName },
    { label: t('artworks.meta.year'), value: String(artwork.year) },
    { label: t('artworks.meta.medium'), value: t(`artworks.medium.${artwork.medium}`) },
    { label: t('artworks.meta.dimensions'), value: dim },
    { label: t('artworks.meta.signed'), value: artwork.signed ? t('common.yes') : t('common.no') },
    ...(artwork.edition ? [{ label: t('artworks.meta.edition'), value: artwork.edition }] : []),
  ];

  return (
    <Container size="xl">
      <div className="space-y-16 py-12">
        {/* Œuvre dominante */}
        <div className="space-y-6">
          <span className="text-muted text-xs tracking-widest uppercase">
            {artwork.artistName} · {artwork.year}
          </span>
          <h1 className="text-fg max-w-3xl font-mono text-3xl font-bold tracking-tight uppercase italic md:text-5xl">
            {artwork.title}
          </h1>
          <Image
            src={artwork.images[0]?.src ?? ''}
            alt={artwork.images[0]?.alt ?? artwork.title}
            ratio="3/2"
            eager
            wrapperClassName="bg-surface"
            className="object-contain"
          />
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <p className="text-fg text-lg leading-relaxed text-pretty">{artwork.summary}</p>
            <p className="text-muted leading-relaxed">{artwork.description}</p>

            <div className="border-border space-y-3 border-t pt-6">
              <span className="text-muted text-xs tracking-widest uppercase">
                {t('artworks.artist')}
              </span>
              <p className="text-fg leading-relaxed">{artwork.artistBio}</p>
            </div>

            <button
              type="button"
              onClick={() => setInquiryOpen(true)}
              className={cn(
                'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
                'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
                'duration-base transition-[border-color,background-color]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              )}
            >
              {t('common.expressInterest')}
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <aside className="space-y-6">
            <span className="text-muted text-xs tracking-widest uppercase">
              {t('common.details')}
            </span>
            <MetaList items={meta} />
            <div className="border-border border-t pt-6">
              <PriceTag onRequestLabel={t('common.onRequest')} size="md" />
            </div>
            <AudioNote transcript={t('audio.samples.artwork')} durationSeconds={38} />
          </aside>
        </div>

        {artwork.provenance.length > 0 && (
          <div className="space-y-6">
            <SectionHeader title={t('artworks.provenance')} size="sm" as="h2" />
            <Timeline items={artwork.provenance.map(p => ({ title: p }))} />
          </div>
        )}

        {artwork.exhibitions.length > 0 && (
          <div className="space-y-6">
            <SectionHeader title={t('artworks.exhibitions')} size="sm" as="h2" />
            <ul className="border-border divide-border divide-y border-t">
              {artwork.exhibitions.map(e => (
                <li key={e} className="text-fg py-3 text-sm">
                  {e}
                </li>
              ))}
            </ul>
          </div>
        )}

        {artwork.images.length > 1 && (
          <div className="space-y-6">
            <SectionHeader title={t('artworks.gallery')} size="sm" as="h2" />
            <GalleryGrid images={artwork.images.slice(1)} />
          </div>
        )}

        <SimilarItemsStrip module="artwork" currentSlug={artwork.slug} />

        <Link
          to={localePath(ROUTES.ACCOUNT_ARTWORKS)}
          className="text-muted hover:text-fg duration-base inline-flex items-center gap-2 text-xs tracking-widest uppercase transition-colors"
        >
          ← {t('common.back')}
        </Link>
      </div>

      <InquiryDrawer
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        source="artwork"
        itemTitle={`${artwork.artistName} — ${artwork.title}`}
        targetId={artwork.id}
      />
    </Container>
  );
}
