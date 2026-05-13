// ═══════════════════════════════════════════════════
// shareDocumentAction — "Partager cette fiche" Document Action
//
// WHAT: Adds a Document Action to every shareable document type (event,
//       property, timepiece, artwork, journey, conciergeService, article)
//       that opens a small dialog with :
//
//         · The public URL (when visibility = "public")  → ready to send
//         · A deeplink to /admin/share-codes pre-filled (when "shareCode") →
//           one-click takes Salva to the code-generation form on the
//           frontend admin, no copy-paste of the Sanity _id required
//         · A clear "change visibility to share" hint (when "private")
//
//       Each mode emits a WhatsApp deeplink, a Copy URL button and an
//       Email button using the same brand-voice message template.
//
// WHEN: Registered via document.actions in sanity.config.ts ; Sanity
//       only shows it on docs whose schema name matches SHAREABLE_TYPES.
// ═══════════════════════════════════════════════════

import { ShareIcon } from '@sanity/icons';
import type { DocumentActionComponent } from 'sanity';
import { useState } from 'react';

import { ShareDialog } from '../components/ShareDialog';

const SHAREABLE_TYPES = new Set([
  'event',
  'property',
  'timepiece',
  'artwork',
  'journey',
  'conciergeService',
  'article',
]);

const DOMAIN_PATHS: Record<string, string> = {
  event: 'events',
  property: 'properties',
  timepiece: 'timepieces',
  artwork: 'artworks',
  journey: 'journeys',
  conciergeService: 'concierge',
  article: 'news',
};

interface DocSnapshot {
  _id?: string;
  _type?: string;
  visibility?: string;
  slug?: { current?: string };
  title?: { fr?: string; en?: string } | string;
}

const resolveTitle = (doc: DocSnapshot): string => {
  if (typeof doc.title === 'string') return doc.title;
  if (doc.title && typeof doc.title === 'object') return doc.title.fr ?? doc.title.en ?? '';
  return '';
};

/**
 * Build the public canonical URL for a doc, e.g.
 *   /fr/account/events/gala-onu
 * Account-prefixed path mirrors the frontend routes setup.
 */
const buildPublicUrl = (siteUrl: string, type: string, slug: string, locale = 'fr'): string => {
  const folder = DOMAIN_PATHS[type];
  if (!folder) return siteUrl;
  return `${siteUrl.replace(/\/$/, '')}/${locale}/account/${folder}/${slug}`;
};

/**
 * Build the /admin/share-codes deeplink with the doc pre-filled, so
 * Salva can hit "Générer" without copy-pasting the Sanity _id.
 */
const buildAdminDeeplink = (
  siteUrl: string,
  docType: string,
  docId: string,
  locale = 'fr',
): string => {
  const u = new URL(`${siteUrl.replace(/\/$/, '')}/${locale}/admin/share-codes`);
  u.searchParams.set('docType', docType);
  u.searchParams.set('docId', docId);
  return u.toString();
};

interface ShareActionFactoryOpts {
  /** Public site origin, e.g. https://sn-studio-dusky.vercel.app. */
  siteUrl: string;
}

/**
 * Factory that returns the Document Action component bound to a given
 * site URL. Wire it up in `sanity.config.ts` so the URL is read once
 * from env at Studio build time.
 */
export const makeShareDocumentAction = (opts: ShareActionFactoryOpts): DocumentActionComponent => {
  const ShareAction: DocumentActionComponent = props => {
    const { id, type, published, draft } = props;
    const [open, setOpen] = useState(false);

    if (!SHAREABLE_TYPES.has(type)) return null;

    const doc = (published ?? draft) as DocSnapshot | null;
    const visibility = (doc?.visibility ?? 'private') as 'private' | 'public' | 'shareCode';
    const slug = doc?.slug?.current ?? '';
    const title = doc ? resolveTitle(doc) : '';

    const publicUrl = slug ? buildPublicUrl(opts.siteUrl, type, slug) : '';
    const adminDeeplink = buildAdminDeeplink(opts.siteUrl, type, id);

    return {
      label: 'Partager cette fiche…',
      icon: ShareIcon,
      onHandle: () => setOpen(true),
      dialog: open && {
        type: 'dialog',
        onClose: () => setOpen(false),
        header: 'Partager cette fiche',
        content: (
          <ShareDialog
            docType={type}
            docId={id}
            title={title}
            visibility={visibility}
            publicUrl={publicUrl}
            adminDeeplink={adminDeeplink}
          />
        ),
      },
    };
  };

  return ShareAction;
};
